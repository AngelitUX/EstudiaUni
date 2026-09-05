// El backend NestJS corre en Cloud Run (servicio "estudiauni-api", region
// southamerica-west1) y Firebase Hosting enruta /api/** hacia el, por lo que
// vive en el MISMO dominio que el sitio: sin CORS y sin una URL aparte.
//
// No poner '' para decir "mismo origen": el frontend hace
// `environment.apiUrl || 'http://localhost:3000'` en 22 sitios y la cadena
// vacia es falsy, asi que caeria al localhost. Tiene que ser el dominio.
const apiUrl = 'https://estudiauni.cl';

// ── authDomain del MISMO ORIGEN (2026-09-05) ──────────────────────────────────────────
// Antes esto era siempre "estudiauni.firebaseapp.com", y ESA era la causa raíz de que el
// login con Google se rompiera en Firefox y Chrome (diagnosticado el 2026-09-05):
//
//   La app corre en estudiauni.cl, pero el "handler" y el iframe de Firebase Auth vivían en
//   estudiauni.firebaseapp.com. O sea que Google devolvía la credencial al storage de OTRO
//   dominio, y estudiauni.cl tenía que leerla de vuelta a través de un iframe DE TERCEROS.
//   Firefox (Total Cookie Protection) particiona ese storage y Chrome está eliminando las
//   cookies de terceros: el resultado del login queda escrito en un lugar que la app ya no
//   puede leer. Síntomas exactos que producía: botón "Ingresando..." colgado para siempre,
//   volver de Google sin quedar logueado, y sesiones a medias con el perfil vacío. La propia
//   consola de Firefox lo decía literal: "cookie particionada ... a
//   https://estudiauni.firebaseapp.com/__/auth/iframe ... porque se carga en el contexto de
//   terceros". El login por correo/contraseña nunca se vio afectado porque no usa ese iframe.
//
// Firebase Hosting ya sirve los archivos de auth en el dominio propio (verificado:
// https://estudiauni.cl/__/auth/handler y /__/auth/iframe.js devuelven 200), así que usando
// el host actual como authDomain TODO el flujo pasa a ser del mismo origen y desaparece la
// dependencia del storage de terceros.
//
// 🔴 REQUISITO en Google Cloud Console (APIs y servicios → Credenciales → cliente OAuth web
// del proyecto): cada host de esta lista necesita su URI de redirección autorizada
// `https://<host>/__/auth/handler`. Sin eso Google responde "Error 400: redirect_uri_mismatch".
// Por eso la lista es explícita y no `window.location.hostname` a secas: cualquier host que
// no esté aquí (localhost, canales de vista previa, etc.) cae al dominio de Firebase de
// siempre, que ya está registrado y sigue funcionando como antes.
const SAME_ORIGIN_AUTH_HOSTS = ['estudiauni.cl', 'www.estudiauni.cl'];
const authDomain = (typeof window !== 'undefined' && SAME_ORIGIN_AUTH_HOSTS.includes(window.location.hostname))
  ? window.location.hostname
  : 'estudiauni.firebaseapp.com';

export const environment = {
  production: true,
  apiUrl,
  firebase: {
    apiKey: "AIzaSyB3eISSPYcdGYf4l3LvZyADV6dL9l1OW5g",
    authDomain,
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

