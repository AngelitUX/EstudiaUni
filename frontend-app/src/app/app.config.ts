import { ApplicationConfig, PLATFORM_ID, inject, provideZoneChangeDetection } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
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
const APP_CHECK_TIMEOUT_MS = 5000;

function conTopeDeTiempo<T>(promesa: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const temporizador = setTimeout(
      () => reject(new Error(`Turnstile no respondio en ${ms} ms; se continua sin token de App Check.`)),
      ms
    );
    promesa.then(
      (valor) => { clearTimeout(temporizador); resolve(valor); },
      (error) => { clearTimeout(temporizador); reject(error); }
    );
  });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })
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
        return initializeAppCheck(getApp(), {
          // El proveedor NO se pasa tal cual: va envuelto en un tope de tiempo, porque tal
          // como viene se puede colgar para siempre y bloquear el login. Ver el comentario
          // largo de conTopeDeTiempo() arriba.
          provider: new CustomProvider({
            getToken: () => conTopeDeTiempo(cpo.getToken(), APP_CHECK_TIMEOUT_MS)
          }),
          isTokenAutoRefreshEnabled: true
        });
      })
    ] : [])
  ]
};
