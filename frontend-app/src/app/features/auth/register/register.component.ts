import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);

  name = '';
  email = '';
  password = '';
  error = '';
  loading = false;

  async onSubmit() {
    this.error = '';
    this.loading = true;
    try {
      await this.authService.register(this.email, this.password, this.name);
      this.router.navigate(['/dashboard']);
    } catch (e: any) {
      this.error = e?.message || 'Error al crear la cuenta. Intenta nuevamente.';
    } finally {
      this.loading = false;
    }
  }
}
