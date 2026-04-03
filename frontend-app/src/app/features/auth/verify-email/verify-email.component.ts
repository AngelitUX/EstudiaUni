import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
  private auth = inject(Auth);
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  loading = false;
  error = '';
  success = '';
  checkingVerification = false;

  ngOnInit() {
    const user = this.auth.currentUser;
    if (user) {
      this.email = user.email || '';
      
      // Si ya está verificado, redirigir al dashboard
      if (user.emailVerified) {
        this.router.navigate(['/dashboard']);
      }
    } else {
      // Si no hay usuario, redirigir a login
      this.router.navigate(['/login']);
    }
  }

  async resendVerification() {
    this.error = '';
    this.success = '';
    this.loading = true;
    try {
      await this.authService.resendVerificationEmail();
      this.success = '✅ Correo de verificación reenviado. Revisa tu bandeja de entrada.';
      // Ocultar mensaje después de 5 segundos
      setTimeout(() => {
        this.success = '';
      }, 5000);
    } catch (e: any) {
      this.error = 'Error al reenviar el correo de verificación.';
    } finally {
      this.loading = false;
    }
  }

  async checkVerification() {
    this.checkingVerification = true;
    this.error = '';
    
    const user = this.auth.currentUser;
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      // Recargar el usuario para obtener el estado más actualizado
      await user.reload();
      
      if (user.emailVerified) {
        // Email verificado, redirigir al dashboard
        this.router.navigate(['/dashboard']);
      } else {
        this.error = 'Tu correo aún no ha sido verificado. Revisa tu bandeja de entrada y haz clic en el enlace.';
      }
    } catch (e: any) {
      this.error = 'Error al verificar el estado del correo.';
    } finally {
      this.checkingVerification = false;
    }
  }

  async logout() {
    await this.authService.logout().toPromise();
    this.router.navigate(['/']);
  }
}
