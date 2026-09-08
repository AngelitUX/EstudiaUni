import { ApplicationConfig, PLATFORM_ID, inject, provideZoneChangeDetection } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { provideRouter, withInMemoryScrolling, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { initializeApp, provideFirebaseApp, getApp } from '@angular/fire/app';
import { getAuth, provideAuth, initializeAuth, inMemoryPersistence } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAppCheck, initializeAppCheck, CustomProvider } from '@angular/fire/app-check';
import { CloudflareProviderOptions } from '@cloudflare/turnstile-firebase-app-check';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideClientHydration } from '@angular/platform-browser';

// Detección de plataforma "plana", sin inject(): App Check ni siquiera debe registrarse
// como provider en el servidor. CloudflareProviderOptions toca document.body/window en su
// propio constructor (para inyectar el widget invisible de Turnstile) — no es solo que
// initializeAppCheck() no sirva en Node, es que instanciar la clase ya revienta ahí. Nada
// de lo que se prerenderiza (home, login, etc.) necesita un token de App Check, así que la
// solución más simple y segura es que el provider entero no exista fuera del navegador.
const isBrowserRuntime = typeof window !== 'undefined';

// El sitekey de Turnstile está atado a un dominio autorizado en el panel de Cloudflare —
// nunca va a incluir "localhost" (Cloudflare no lo permite como dominio de un sitio real).
// En local, CloudflareProviderOptions reintenta sin parar contra un dominio que siempre va a
// rechazar (Error 110200), y esos reintentos infinitos saturan el hilo principal — bloqueando
// cosas que no tienen nada que ver, como el propio botón de "Iniciar Sesión". Server-side no
// aplica: isBrowserRuntime ya es false ahí, así que location.hostname existe siempre que se
// llegue a evaluar esta línea.
const isLocalDevHost = isBrowserRuntime && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);

// ── Tope de tiempo para el proveedor de App Check (Turnstile) ────────────────────────────
// 🔴 Esto NO es una optimización: sin este tope, el inicio de sesión con Google se cuelga.
//
// `CloudflareProviderOptions.getToken()` (paquete @cloudflare/turnstile-firebase-app-check)
// hace `await readyTurnstile`, y ese promise se crea así:
//
//     const readyTurnstile = new Promise(resolve => { promiseResolve = resolve; });
//
// o sea, SOLO tiene rama de resolución — se resuelve únicamente dentro del callback de éxito
// de `turnstile.render(...)`. No hay `reject` ni tiempo límite en ninguna parte. Si el desafío
// de Turnstile no llega a completarse (Firefox frenando el iframe por su protección estricta
// de terceros, una extensión bloqueando challenges.cloudflare.com, o simplemente lentitud),
// ese promise queda PENDIENTE PARA SIEMPRE. No falla: se cuelga.
//
// Eso sería inofensivo si App Check estuviera fuera del camino crítico, pero no lo está: el
// SDK de Firebase Auth hace `await auth._getAppCheckToken()` DENTRO de `_getRedirectUrl()`,
// es decir ANTES de navegar a Google (@firebase/auth, index-*.js ~línea 10095). Diagnosticado
// en producción el 2026-09-05 sobre un usuario real en Firefox: el botón "Continuar con
// Google" se quedaba cargando y la pestaña NUNCA navegaba; y cuando Turnstile terminaba
// resolviendo mucho después, el redirect se disparaba solo y lo metía al dashboard "de la
// nada" mientras navegaba por otro lado. El login por correo/contraseña no se veía afectado
// porque para cuando el usuario termina de escribir, Turnstile ya alcanzó a resolver.
//
// Con el tope, si Turnstile no responde en 5 s el proveedor RECHAZA. App Check está diseñado
// exactamente para eso: captura el error, registra un aviso y devuelve un token ficticio
// (`makeDummyTokenResult`) — su `getToken()` nunca propaga la excepción. El login sigue de
// inmediato. No baja la seguridad: App Check está en modo "Supervisión" (ver environment.ts),
// así que hoy ningún token se valida de todos modos.
//
// ── Por qué el tope SOLO no alcanzaba (segunda pasada, 2026-09-05) ───────────────────────
// Con un tope "a secas", cada llamada paga sus propios 5 s y se ENCADENAN, porque el camino
// del login con Google hace varias seguidas: navegar a Google, procesar la vuelta, buscar el
// perfil en Firestore, guardarlo. En Firefox eso se veía como ~10-15 s con el dashboard ya
// pintado pero vacío (lo que el usuario describió como "cuenta fantasma": no era otra cuenta,
// era la suya sin datos todavía). Por eso el proveedor lleva además estas dos cosas:
//
//   1. UN SOLO INTENTO COMPARTIDO, Y FALLO RÁPIDO. Todas las llamadas se cuelgan del mismo
//      intento en vuelo, con UN plazo común (no uno por llamada). En cuanto ese plazo vence,
//      cualquier llamada nueva falla al instante en vez de abrir su propia espera de 5 s. Así
//      el costo total por carga de página es 5 s como mucho, no 5 s por operación.
//   2. MEMORIA CORTA ENTRE CARGAS (`localStorage`). Si Turnstile ya falló hace poco en este
//      navegador, la siguiente carga no vuelve a esperar: falla de inmediato. Esto es lo que
//      hace que la vuelta desde Google sea instantánea en vez de costar otros 5 s.
//      Es auto-reparable y va en el sentido seguro: el intento real SIEMPRE se lanza igual en
//      segundo plano, así que apenas Turnstile vuelva a funcionar la marca se borra sola y
//      todo vuelve a la normalidad. La marca caduca sola a los 10 minutos.
const APP_CHECK_TIMEOUT_MS = 5000;
const APP_CHECK_CLAVE_LENTO = 'appcheck_turnstile_lento_hasta';
const APP_CHECK_VENTANA_LENTO_MS = 10 * 60 * 1000;

/** La forma exacta que espera `CustomProviderOptions.getToken` de @firebase/app-check. */
type TokenAppCheck = { readonly token: string; readonly expireTimeMillis: number };
interface IntentoDeToken { promesa: Promise<TokenAppCheck>; vencido: boolean; }

let intentoDeToken: IntentoDeToken | null = null;

// localStorage puede lanzar (modo privado, storage bloqueado por el navegador). Como esto es
// solo una optimización de latencia, cualquier fallo se traga y se sigue con el camino normal.
function marcarTurnstileLento(lento: boolean): void {
  try {
    if (lento) localStorage.setItem(APP_CHECK_CLAVE_LENTO, String(Date.now() + APP_CHECK_VENTANA_LENTO_MS));
    else localStorage.removeItem(APP_CHECK_CLAVE_LENTO);
  } catch { /* sin memoria entre cargas: se paga el plazo una vez más, nada se rompe */ }
}

function turnstileMarcadoLento(): boolean {
  try {
    return Number(localStorage.getItem(APP_CHECK_CLAVE_LENTO) || 0) > Date.now();
  } catch { return false; }
}

function iniciarIntento(cpo: CloudflareProviderOptions): IntentoDeToken {
  const bruto = cpo.getToken();
  const intento = { vencido: false } as IntentoDeToken;

  intento.promesa = new Promise<TokenAppCheck>((resolve, reject) => {
    const temporizador = setTimeout(() => {
      intento.vencido = true;
      marcarTurnstileLento(true);
      reject(new Error(`Turnstile no respondio en ${APP_CHECK_TIMEOUT_MS} ms; se continua sin token de App Check.`));
    }, APP_CHECK_TIMEOUT_MS);

    bruto.then(
      (valor) => { clearTimeout(temporizador); marcarTurnstileLento(false); resolve(valor); },
      (error) => { clearTimeout(temporizador); reject(error); }
    );
  });

  // Cuando el intento REAL termina (aunque sea mucho después del plazo) se libera el estado.
  // Si terminó bien, `cpo.getToken()` ya dejó el token en su propia caché interna de 1 h, así
  // que la siguiente llamada lo devuelve al instante.
  bruto.then(
    () => { if (intentoDeToken === intento) intentoDeToken = null; },
    () => { if (intentoDeToken === intento) intentoDeToken = null; }
  );

  intentoDeToken = intento;
  return intento;
}

function tokenDeAppCheck(cpo: CloudflareProviderOptions): Promise<TokenAppCheck> {
  // Ojo con el orden de estas dos condiciones: la marca de localStorage se consulta SIEMPRE,
  // no solo cuando no hay intento en vuelo. Un primer borrador la consultaba solo si no había
  // intento, y eso reintroducía el problema entero: la primera llamada fallaba rápido pero
  // dejaba un intento de fondo recién nacido (todavía sin vencer), así que la SIGUIENTE se
  // colgaba de él y volvía a esperar los 5 s completos. Verificado simulando la cadena real
  // (calentamiento → clic → vuelta de Google → leer perfil → guardar perfil).
  const sabemosQueNoResponde = intentoDeToken?.vencido === true || turnstileMarcadoLento();

  if (sabemosQueNoResponde) {
    // Se lanza igual el intento en segundo plano: es lo que permite recuperarse solo.
    if (!intentoDeToken) iniciarIntento(cpo).promesa.catch(() => { /* esperado */ });
    return Promise.reject(new Error('Turnstile sigue sin responder en este navegador; se continua sin token de App Check.'));
  }

  return (intentoDeToken ?? iniciarIntento(cpo)).promesa;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
      withPreloading(PreloadAllModules)
    ),
    provideHttpClient(withInterceptors([authInterceptor]), withFetch()),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => {
      // getAuth()'s default persistence hierarchy probes window/indexedDB asynchronously to
      // pick a storage backend — during SSR/prerendering there's no window at all, and that
      // probe never resolves, hanging the render instead of erroring. initializeAuth() with
      // an explicit persistence skips the probe entirely; the browser keeps getAuth()'s
      // normal (indexedDB/localStorage) persistence untouched.
      //
      // NO cambiar getAuth() por initializeAuth() aqui para evitar que se cargue el iframe de
      // auth (288 KB) en la landing: se intento el 2026-08-27 y ROMPE el login con Google.
      // getAuth() registra el browserPopupRedirectResolver por defecto; al quitarlo y pasarlo
      // explicito a signInWithPopup(), el flujo revienta con "TypeError: Class constructor yu
      // cannot be invoked without new" — y compila y pasa el typecheck igual, asi que solo se
      // ve haciendo clic en el boton de verdad. Ver Bitacora 2026-08-27.
      return isPlatformBrowser(inject(PLATFORM_ID))
        ? getAuth(getApp())
        : initializeAuth(getApp(), { persistence: inMemoryPersistence });
    }),
    provideFirestore(() => getFirestore(getApp())),
    provideClientHydration(),
    ...(isBrowserRuntime && !isLocalDevHost && environment.appCheckEnabled ? [
      provideAppCheck(() => {
        const cpo = new CloudflareProviderOptions(
          environment.turnstileTokenExchangeUrl,
          environment.turnstileSiteKey
        );
        const appCheck = initializeAppCheck(getApp(), {
          // El proveedor NO se pasa tal cual: `cpo` puede colgarse para siempre y bloquear el
          // login. `tokenDeAppCheck` le pone plazo, comparte un solo intento entre todas las
          // llamadas y recuerda un fallo reciente. Ver el comentario largo de arriba.
          provider: new CustomProvider({ getToken: () => tokenDeAppCheck(cpo) }),
          isTokenAutoRefreshEnabled: true
        });

        // Calentamiento: se dispara el primer intento durante el arranque de la app, no cuando
        // el usuario hace clic. Así, en un navegador donde Turnstile no responde, el plazo se
        // consume en segundo plano y para cuando alguien pulsa "Continuar con Google" la
        // respuesta (token real o fallo rápido) ya está resuelta.
        tokenDeAppCheck(cpo).catch(() => { /* el fallo ya quedó registrado; App Check sigue */ });

        return appCheck;
      })
    ] : [])
  ]
};
