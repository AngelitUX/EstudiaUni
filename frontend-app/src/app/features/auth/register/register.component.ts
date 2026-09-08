import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { mensajeErrorGoogle } from '../../../core/utils/auth-error';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { LegalModalComponent } from '../../../shared/components/legal-modal.component';
import { PasswordVisibilityIconComponent } from '../../../shared/components/password-visibility-icon.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LegalModalComponent, PasswordVisibilityIconComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  router = inject(Router);
  private auth = inject(Auth);
  private stuckGoogleLoginTimer: ReturnType<typeof setTimeout> | null = null;
  private authSub: Subscription | null = null;

  isGoogleRedirectPending = false;

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

    this.authSub = this.authService.user$.subscribe((user) => {
      if (user?.emailVerified) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  ngOnDestroy() {
    if (this.stuckGoogleLoginTimer) clearTimeout(this.stuckGoogleLoginTimer);
    this.authSub?.unsubscribe();
    if (typeof window !== 'undefined') {
      window.removeEventListener('google_redirect_done', this.onRedirectDone);
    }
  }

  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  error = '';
  showPassword = false;
  showConfirmPassword = false;
  acceptedTerms = false;
  /** true cuando el usuario intento registrarse sin marcar la casilla de términos: resalta
   *  la casilla con un mensaje justo al lado (antes el botón de Google simplemente quedaba
   *  deshabilitado y no daba ninguna pista de por qué). Se limpia al marcar la casilla. */
  termsError = false;
  legalModalType: 'terms' | 'privacy' | null = null;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  loading = false;
  verificationEmailSent = false;
  resendSuccess = false;
  resendLoading = false;
  checkingVerification = false;

  passwordChecks = {
    minLength: false,
    hasNumber: false,
    hasUpperCase: false
  };

  // Lista ESTRICTA de dominios permitidos - SOLO estos correos pueden registrarse
  private allowedDomains = [
    // Proveedores de correo principales
    'gmail.com', 'googlemail.com',
    'hotmail.com', 'hotmail.es', 'hotmail.cl',
    'outlook.com', 'outlook.es', 'outlook.cl',
    'yahoo.com', 'yahoo.es', 'yahoo.cl',
    'icloud.com', 'me.com', 'mac.com',
    'live.com', 'live.cl',
    'msn.com',
    'protonmail.com', 'proton.me',
    'zoho.com',
    'aol.com',
    // Universidades chilenas
    'uc.cl', 'puc.cl', 'ing.puc.cl', 'alumno.uc.cl',
    'uchile.cl', 'u.uchile.cl', 'ing.uchile.cl',
    'usach.cl', 'usach.cl',
    'uach.cl',
    'uai.cl', 'alumnos.uai.cl',
    'udp.cl', 'mail.udp.cl',
    'uandes.cl',
    'udd.cl', 'udd.cl',
    'unab.cl',
    'uv.cl',
    'ucn.cl',
    'ufro.cl',
    'utalca.cl',
    'ubiobio.cl',
    'ucsc.cl',
    'uct.cl',
    'umag.cl',
    'ulagos.cl',
    'uda.cl',
    'ucm.cl',
    'uoh.cl',
    'uaysen.cl',
    // Otros proveedores conocidos
    'yandex.com',
    'tutanota.com',
    'fastmail.com'
  ];

  validatePassword() {
    this.passwordChecks.minLength = this.password.length >= 8;
    this.passwordChecks.hasNumber = /\d/.test(this.password);
    this.passwordChecks.hasUpperCase = /[A-Z]/.test(this.password);
  }

  isPasswordValid(): boolean {
    return this.passwordChecks.minLength && 
           this.passwordChecks.hasNumber && 
           this.passwordChecks.hasUpperCase;
  }

  isEmailDomainValid(email: string): boolean {
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return false;
    
    // SOLO permitir dominios de la lista blanca - NO aceptar otros
    return this.allowedDomains.includes(domain);
  }

  async onSubmit() {
    this.error = '';

    if (!this.acceptedTerms) {
      this.termsError = true;
      this.error = 'Debes aceptar los Términos de Servicio y la Política de Privacidad para crear una cuenta.';
      return;
    }

    // Validar nombre
    if (!this.name || this.name.trim().length < 2) {
      this.error = 'Por favor ingresa tu nombre completo (mínimo 2 caracteres).';
      return;
    }
    
    // Validación adicional de email
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.email)) {
      this.error = 'Por favor ingresa un correo electrónico válido.';
      return;
    }

    // Validar dominio del correo ANTES de continuar
    if (!this.isEmailDomainValid(this.email)) {
      this.error = 'El dominio del correo no es válido. Usa Gmail, Hotmail, Yahoo, Outlook, correos universitarios chilenos u otros proveedores reconocidos.';
      return;
    }

    if (!this.isPasswordValid()) {
      this.error = 'La contraseña no cumple con los requisitos de seguridad.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    this.loading = true;
    try {
      await this.authService.register(this.email.toLowerCase().trim(), this.password, this.name.trim());
      // Mostrar pantalla de verificación SOLO si el registro fue exitoso
      this.verificationEmailSent = true;
    } catch (e: any) {
      // NO mostrar pantalla de verificación si hay error
      this.verificationEmailSent = false;
      
      if (e?.code === 'auth/email-already-in-use') {
        this.error = 'Este correo ya está registrado. Intenta iniciar sesión.';
      } else if (e?.code === 'auth/invalid-email') {
        this.error = 'El correo electrónico no es válido. Por favor verifica que sea correcto.';
      } else if (e?.code === 'auth/weak-password') {
        this.error = 'La contraseña es muy débil. Usa al menos 8 caracteres con números y mayúsculas.';
      } else if (e?.code === 'auth/operation-not-allowed') {
        this.error = 'El registro con email/contraseña no está habilitado. Contacta al administrador.';
      } else if (e?.code === 'auth/too-many-requests') {
        this.error = 'Demasiados intentos. Por favor espera unos minutos antes de intentar nuevamente.';
      } else {
        this.error = e?.message || 'Error al crear la cuenta. Intenta nuevamente.';
      }
    } finally {
      this.loading = false;
    }
  }

  async resendVerification() {
    this.resendLoading = true;
    this.resendSuccess = false;
    this.error = '';
    try {
      await this.authService.resendVerificationEmail();
      this.resendSuccess = true;
      // Ocultar mensaje de éxito después de 5 segundos
      setTimeout(() => {
        this.resendSuccess = false;
      }, 5000);
    } catch (e: any) {
      this.error = 'Error al reenviar el correo de verificación.';
    } finally {
      this.resendLoading = false;
    }
  }

  async checkAndGoToLogin() {
    this.checkingVerification = true;
    this.error = '';
    this.resendSuccess = false;
    
    try {
      // Intentar iniciar sesión temporalmente para verificar el estado
      const cred = await signInWithEmailAndPassword(this.auth, this.email, this.password);
      
      // Recargar para obtener el estado más actualizado
      await cred.user.reload();
      
      if (cred.user.emailVerified) {
        // Email verificado, ir al dashboard
        this.router.navigate(['/dashboard']);
      } else {
        // Email NO verificado, mostrar error
        await this.auth.signOut(); // Cerrar sesión
        this.error = '❌ Tu correo aún no ha sido verificado. Por favor revisa tu bandeja de entrada y haz clic en el enlace de verificación.';
      }
    } catch (e: any) {
      this.error = 'Error al verificar. Intenta iniciar sesión desde la página de login.';
    } finally {
      this.checkingVerification = false;
    }
  }

  async registerWithGoogle() {
    this.error = '';

    if (!this.acceptedTerms) {
      this.termsError = true;
      this.error = 'Debes aceptar los Términos de Servicio y la Política de Privacidad para crear una cuenta.';
      return;
    }

    this.loading = true;

    const isLocalhost = typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);
    if (!isLocalhost) {
      this.stuckGoogleLoginTimer = setTimeout(() => {
        this.loading = false;
        this.error = 'Esto está tardando más de lo normal — tu navegador podría estar bloqueando el inicio de sesión con Google (pasa seguido en Firefox, por su protección de cookies de terceros). Si no avanza solo en unos segundos más, prueba crear tu cuenta con correo y contraseña, o usa Chrome.';
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
}
