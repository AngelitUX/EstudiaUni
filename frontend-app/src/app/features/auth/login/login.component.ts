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
