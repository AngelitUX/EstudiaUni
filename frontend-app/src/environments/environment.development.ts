const apiUrl = 'http://localhost:3000';

export const environment = {
  production: false,
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
  // Ver el comentario en environment.ts — mismos valores, el sitekey de Turnstile suele
  // tener un modo de prueba separado si quieres probar en local sin gastar cuota real.
  turnstileSiteKey: '0x4AAAAAAEb00X1M9HopFvPf',
  turnstileTokenExchangeUrl: `${apiUrl}/api/app-check/exchange`
};
