/**
 * Traduce un error de inicio de sesión con Google a un mensaje para el usuario.
 *
 * Por qué existe: hasta el 2026-08-26 los dos botones de Google (login y
 * registro) hacían `catch { this.error = 'Error al iniciar sesión con Google.' }`
 * — sin distinguir la causa y **sin registrar el error en ningún lado**. Cuando
 * el inicio de sesión con Google dejó de funcionar en producción, ni el usuario
 * ni la consola daban la menor pista; la causa real (el dominio no estaba en la
 * lista de dominios autorizados de Firebase Auth) sólo se encontró consultando
 * la configuración del proyecto por API.
 *
 * Los códigos vienen de Firebase Auth y son estables.
 */
export function mensajeErrorGoogle(e: any): string {
  const codigo: string = e?.code ?? '';

  // Siempre dejar rastro del error real: es lo que faltaba para diagnosticar.
  console.error('[Auth] Fallo el inicio de sesión con Google:', codigo || e, e);

  switch (codigo) {
    // El usuario cerró la ventana o la canceló. No es un fallo: no conviene
    // asustarlo con un mensaje de error rojo por algo que hizo a propósito.
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
    case 'auth/user-cancelled':
      return '';

    case 'auth/popup-blocked':
      return 'Tu navegador bloqueó la ventana de Google. Permite las ventanas emergentes para este sitio e inténtalo de nuevo.';

    // El dominio desde el que se abre la app no está autorizado en Firebase Auth
    // (Authentication > Settings > Authorized domains). Es un fallo de
    // configuración del sitio, no del usuario: no tiene sentido pedirle que
    // reintente, porque va a fallar siempre.
    case 'auth/unauthorized-domain':
      return 'Este sitio aún no está habilitado para iniciar sesión con Google. Avísanos, por favor: es un problema de configuración nuestro, no tuyo.';

    case 'auth/account-exists-with-different-credential':
      return 'Ya existe una cuenta con este correo, creada con contraseña. Inicia sesión con tu correo y contraseña.';

    case 'auth/network-request-failed':
      return 'No se pudo conectar. Revisa tu conexión a internet e inténtalo de nuevo.';

    case 'auth/too-many-requests':
      return 'Demasiados intentos seguidos. Espera un momento e inténtalo de nuevo.';

    case 'auth/operation-not-allowed':
      return 'El inicio de sesión con Google no está habilitado. Avísanos, por favor: es un problema de configuración nuestra.';

    default:
      return 'No se pudo iniciar sesión con Google. Inténtalo de nuevo.';
  }
}
