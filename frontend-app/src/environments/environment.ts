// El backend NestJS corre en Cloud Run (servicio "estudiauni-api", region
// southamerica-west1) y Firebase Hosting enruta /api/** hacia el, por lo que
// vive en el MISMO dominio que el sitio: sin CORS y sin una URL aparte.
//
// No poner '' para decir "mismo origen": el frontend hace
// `environment.apiUrl || 'http://localhost:3000'` en 22 sitios y la cadena
// vacia es falsy, asi que caeria al localhost. Tiene que ser el dominio.
const apiUrl = 'https://estudiauni.cl';

export const environment = {
  production: true,
  apiUrl,
  firebase: {
    apiKey: "AIzaSyB3eISSPYcdGYf4l3LvZyADV6dL9l1OW5g",
    authDomain: "estudiauni.firebaseapp.com",
    projectId: "estudiauni",
    storageBucket: "estudiauni.firebasestorage.app",
    messagingSenderId: "976475724065",
    appId: "1:976475724065:web:586b9c2609d84674158660",
    measurementId: "G-LWHGWMQV8F"
  },
  // App Check (Cloudflare Turnstile provider). El sitekey es público (va en el HTML del
  // widget), no un secreto — seguro de tener aquí.
  // El intercambio de token NO pasa por la extensión oficial de Firebase (su Cloud Function
  // no se puede desplegar hoy: declara el runtime nodejs18, que Google Cloud dio de baja, y
  // Cloudflare aún no republicó una versión corregida) — en su lugar pasa por un endpoint
  // propio del backend (ver backend/src/app-check/), que hace exactamente lo mismo.

  // INTERRUPTOR de App Check en el cliente. Hoy en `false` a proposito.
  //
  // Motivo: el backend no tiene TURNSTILE_SECRET_KEY cargada, asi que
  // POST /api/app-check/exchange devuelve { token: "", expireTimeMillis: 0 } (verificado en
  // produccion el 2026-08-27). CloudflareProviderOptions interpreta eso como fallo y REINTENTA
  // sin parar: la consola del sitio publicado se llena de TurnstileError 600010 y esos
  // reintentos saturan el hilo principal — el mismo sintoma que ya obligo a excluir localhost
  // unas lineas mas arriba en app.config.ts.
  //
  // Desactivarlo NO baja la seguridad hoy: App Check esta en modo "Supervision" (no "Aplicar")
  // en la consola de Firebase, o sea que los tokens no se validan igual; lo unico que se
  // dejaba de enviar era un token vacio.
  //
  // PARA REACTIVARLO: cargar TURNSTILE_SECRET_KEY en backend/.env, correr
  // desplegar-backend.bat, comprobar que el endpoint devuelve un token no vacio, y poner esto
  // en `true`. No hace falta ningun otro cambio.
  appCheckEnabled: false,
  turnstileSiteKey: '0x4AAAAAAEb00X1M9HopFvPf',
  turnstileTokenExchangeUrl: `${apiUrl}/api/app-check/exchange`
};

