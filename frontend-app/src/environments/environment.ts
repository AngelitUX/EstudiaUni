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

  // INTERRUPTOR de App Check en el cliente. Vuelto a `true` el 2026-09-04 (parte 3), a pedido
  // explicito del usuario, DESPUES de corregir en Cloudflare los 2 problemas que causaban el
  // retry loop de Firefox: agrego los 3 hostnames (estudiauni.cl, www.estudiauni.cl,
  // estudiauni.web.app) a la allowlist del widget de Turnstile y cambio el modo de "Invisible"
  // a "Managed". TURNSTILE_SECRET_KEY ya estaba cargada y desplegada en el backend desde antes.
  //
  // OJO: este flag por si solo NO bloquea bots todavia. App Check sigue en modo "Supervision"
  // en la consola de Firebase (Build > App Check > APIs) -- esta emitiendo y contando tokens,
  // pero deja pasar tanto lo verificado como lo no verificado. El bloqueo real de scrapers/bots
  // requiere pasar Cloud Firestore (y despues Authentication) a "Aplicar" en esa pantalla, y eso
  // se hace recien despues de confirmar ahi que el % de "Solicitudes verificadas" esta alto y
  // estable (varios dias, probado en Chrome + Firefox + Safari + movil) -- si se aplica con el
  // % bajo, se bloquearia trafico real, no solo bots.
  //
  // Si vuelven a aparecer errores de Turnstile en la consola (sobre todo en Firefox), revisar
  // primero la config del widget en Cloudflare (hostnames + modo) antes de volver esto a `false`.
  appCheckEnabled: true,
  turnstileSiteKey: '0x4AAAAAAEb00X1M9HopFvPf',
  turnstileTokenExchangeUrl: `${apiUrl}/api/app-check/exchange`
};

