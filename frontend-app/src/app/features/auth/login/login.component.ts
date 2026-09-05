import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { mensajeErrorGoogle } from '../../../core/utils/auth-error';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { Subscription, firstValueFrom } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { PasswordVisibilityIconComponent } from '../../../shared/components/password-visibility-icon.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PasswordVisibilityIconComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  router = inject(Router);
  private auth = inject(Auth);

  email = '';
  password = '';
  error = '';
  loading = false;
  isResetting = false;
  resetSuccess = false;
  showPassword = false;
  private stuckGoogleLoginTimer: ReturnType<typeof setTimeout> | null = null;
  private authSub: Subscription | null = null;

  ngOnInit() {
    // Si ya hay sesión iniciada, no tiene sentido mostrar el formulario. Cubre sobre todo
    // el caso de volver de un signInWithRedirect a Google: el resultado a veces tarda en
    // resolverse (sobre todo en Firefox), así que esto se queda SUSCRITO en vez de mirar
    // el estado una sola vez al cargar — un chequeo de una sola pasada (ej. firstValueFrom)
    // podía capturar el primer valor `null` justo antes de que Firebase terminara de
    // procesar el redirect, y ya no volvía a reaccionar cuando el usuario sí llegaba un
    // instante (o varios segundos) después: se quedaba viendo el formulario de login
    // aunque el inicio de sesión sí hubiera funcionado (reportado en producción,
    // 2026-09-04, en Chrome y Firefox).
    // Se exige `emailVerified` a propósito: una cuenta de correo sin verificar tiene que ir a
    // /verify-email, y de eso ya se encarga `onSubmit()`. Sin este filtro las dos rutas de
    // navegación compiten por el mismo usuario (esta hacia /dashboard, la de onSubmit hacia
    // /verify-email) y cuál gana depende del orden en que resuelvan. Las cuentas de Google
    // llegan siempre con `emailVerified: true`, así que el caso que importa aquí —volver del
    // redirect— sigue cubierto.
    this.authSub = this.authService.user$.subscribe((user) => {
      if (user?.emailVerified) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async resetPassword() {
    if (!this.email) {
      this.error = 'Por favor, ingresa tu correo electrónico antes de presionar "¿Olvidaste tu contraseña?".';
      return;
    }
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.email)) {
      this.error = 'Por favor ingresa un correo electrónico válido para recuperar la contraseña.';
      return;
    }

    this.isResetting = true;
    this.error = '';
    this.resetSuccess = false;
    try {
      await this.authService.resetPassword(this.email.toLowerCase().trim());
      this.resetSuccess = true;
      setTimeout(() => this.resetSuccess = false, 5000);
    } catch (e: any) {
      if (e?.code === 'auth/user-not-found') {
        this.error = 'No se encontró ninguna cuenta con este correo.';
      } else {
        this.error = 'Error al enviar el correo de recuperación. Intenta de nuevo.';
      }
    } finally {
      this.isResetting = false;
    }
  }

  async onSubmit() {
    this.error = '';
    this.loading = true;
    try {
      await firstValueFrom(this.authService.login(this.email.toLowerCase().trim(), this.password));
      
      // Verificar si el email está verificado
      const user = this.auth.currentUser;
      if (user && !user.emailVerified) {
        // Si el correo NO está verificado, redirigir a verify-email
        this.router.navigate(['/verify-email']);
      } else {
        // Si está verificado, ir al dashboard
        this.router.navigate(['/dashboard']);
      }
    } catch (e: any) {
      if (e?.code === 'auth/user-not-found' || e?.code === 'auth/wrong-password' || e?.code === 'auth/invalid-credential') {
        this.error = 'Correo o contraseña incorrectos.';
      } else if (e?.code === 'auth/invalid-email') {
        this.error = 'El formato del correo electrónico no es válido.';
      } else if (e?.code === 'auth/user-disabled') {
        this.error = 'Esta cuenta ha sido deshabilitada. Contacta al soporte.';
      } else if (e?.code === 'auth/too-many-requests') {
        this.error = 'Demasiados intentos fallidos. Por favor espera unos minutos.';
      } else {
        this.error = 'Error al iniciar sesión. Intenta nuevamente.';
      }
    } finally {
      this.loading = false;
    }
  }

  async loginWithGoogle() {
    this.error = '';
    this.loading = true;

    // signInWithRedirect depende de un iframe interno de Firebase para coordinar el viaje
    // de ida y vuelta a Google. En Firefox con protección estricta de cookies de terceros
    // ese iframe puede quedar bloqueado o simplemente ser muy lento — confirmado en
    // producción (2026-09-04) que a veces SÍ termina navegando a Google pasados varios
    // segundos, así que 10s de margen (no menos) evita mostrar "está bloqueado" justo antes
    // de que funcione solo. Si de verdad se navega, esta página se descarga y el timer
    // nunca llega a disparar.
    this.stuckGoogleLoginTimer = setTimeout(() => {
      this.loading = false;
      this.error = 'Esto está tardando más de lo normal — tu navegador podría estar bloqueando el inicio de sesión con Google (pasa seguido en Firefox, por su protección de cookies de terceros). Si no avanza solo en unos segundos más, prueba con tu correo y contraseña, o usa Chrome.';
    }, 10000);

    try {
      // Navega a Google — no vuelve a este método. El resultado (éxito o error) se
      // recoge en AppComponent.ngOnInit cuando la app se recarga de vuelta.
      await this.authService.startGoogleLogin();
    } catch (e: any) {
      if (this.stuckGoogleLoginTimer) clearTimeout(this.stuckGoogleLoginTimer);
      this.error = mensajeErrorGoogle(e);
      this.loading = false;
    }
  }

  ngOnDestroy() {
    if (this.stuckGoogleLoginTimer) clearTimeout(this.stuckGoogleLoginTimer);
    this.authSub?.unsubscribe();
  }
}
