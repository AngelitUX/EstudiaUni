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
  isGoogleRedirectPending = false;
  private stuckGoogleLoginTimer: ReturnType<typeof setTimeout> | null = null;
  private authSub: Subscription | null = null;

  private onRedirectDone = (ev: any) => {
    if (!ev?.detail?.success && !this.auth.currentUser) {
      this.isGoogleRedirectPending = false;
      this.loading = false;
    }
  };

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const isLocalhost = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);
      if (isLocalhost) {
        try { sessionStorage.removeItem('google_login_pending'); } catch {}
        this.isGoogleRedirectPending = false;
      } else {
        try {
          if (sessionStorage.getItem('google_login_pending') === 'true') {
            this.isGoogleRedirectPending = true;
            this.loading = true;
            setTimeout(() => {
              if (this.isGoogleRedirectPending && !this.auth.currentUser) {
                this.isGoogleRedirectPending = false;
                this.loading = false;
                try { sessionStorage.removeItem('google_login_pending'); } catch {}
              }
            }, 7000);
          }
        } catch {}
        window.addEventListener('google_redirect_done', this.onRedirectDone);
      }
    }

    // Si ya hay sesión iniciada, no tiene sentido mostrar el formulario. Cubre sobre todo
    // el caso de volver de un signInWithRedirect a Google: el resultado a veces tarda en
    // resolverse (sobre todo en Firefox), así que esto se queda SUSCRITO en vez de mirar
    // el estado una sola vez al cargar.
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

    const isLocalhost = typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);
    if (!isLocalhost) {
      this.stuckGoogleLoginTimer = setTimeout(() => {
        this.loading = false;
        this.error = 'Esto está tardando más de lo normal — tu navegador podría estar bloqueando el inicio de sesión con Google (pasa seguido en Firefox, por su protección de cookies de terceros). Si no avanza solo en unos segundos más, prueba con tu correo y contraseña, o usa Chrome.';
      }, 10000);
    }

    try {
      const cred = await this.authService.startGoogleLogin();
      if (cred) {
        if (this.stuckGoogleLoginTimer) clearTimeout(this.stuckGoogleLoginTimer);
        this.loading = false;
        this.router.navigate(['/dashboard']);
      }
    } catch (e: any) {
      if (this.stuckGoogleLoginTimer) clearTimeout(this.stuckGoogleLoginTimer);
      this.error = mensajeErrorGoogle(e);
      this.loading = false;
    }
  }

  ngOnDestroy() {
    if (this.stuckGoogleLoginTimer) clearTimeout(this.stuckGoogleLoginTimer);
    this.authSub?.unsubscribe();
    if (typeof window !== 'undefined') {
      window.removeEventListener('google_redirect_done', this.onRedirectDone);
    }
  }
}
