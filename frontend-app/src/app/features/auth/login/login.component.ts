import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';

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

  email = '';
  password = '';
  error = '';
  loading = false;

  async onSubmit() {
    this.error = '';
    this.loading = true;
    try {
      await firstValueFrom(this.authService.login(this.email, this.password));
      this.router.navigate(['/dashboard']);
    } catch (e: any) {
      this.error = 'Credenciales inválidas o error de conexión.';
    } finally {
      this.loading = false;
    }
  }
}
