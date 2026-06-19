import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
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
    try {
      await this.authService.loginWithGoogle();
      
      // Con Google, el email ya viene verificado
      // Pero por seguridad, verificamos igual
      const user = this.auth.currentUser;
      if (user && !user.emailVerified) {
        this.router.navigate(['/verify-email']);
      } else {
        this.router.navigate(['/dashboard']);
      }
    } catch (e: any) {
      this.error = 'Error al iniciar sesión con Google.';
    } finally {
      this.loading = false;
    }
  }
}
