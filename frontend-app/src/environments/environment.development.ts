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
