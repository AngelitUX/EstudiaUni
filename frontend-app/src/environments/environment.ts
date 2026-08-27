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
  turnstileSiteKey: '0x4AAAAAAEb00X1M9HopFvPf',
  turnstileTokenExchangeUrl: `${apiUrl}/api/app-check/exchange`
};

