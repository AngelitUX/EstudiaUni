import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="not-found-page">
      <div class="not-found-glow"></div>
      <div class="not-found-content">
        <div class="not-found-code text-gradient">404</div>
        <h1>Esta página no existe</h1>
        <p>El enlace que seguiste puede estar roto, o la página se movió de lugar. Revisa la dirección o vuelve a un lugar conocido.</p>
        <div class="not-found-actions">
          <button class="btn btn-primary btn-large" (click)="goHome()">
            {{ isLoggedIn() ? 'Ir a mi Dashboard' : 'Volver al Inicio' }}
          </button>
          <a routerLink="/soporte" class="btn btn-outline btn-large">Ir a Soporte</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .not-found-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      padding: 2rem;
      text-align: center;
      background: #fafaff;
    }
    .not-found-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 600px;
      height: 600px;
      transform: translate(-50%, -50%);
      background: radial-gradient(circle, rgba(133,92,214,0.14) 0%, transparent 70%);
      pointer-events: none;
    }
    .not-found-content {
      position: relative;
      z-index: 1;
      max-width: 480px;
    }
    .not-found-code {
      font-size: 6rem;
      font-weight: 800;
      line-height: 1;
      margin-bottom: 0.5rem;
      font-family: var(--font-heading);
    }
    .not-found-content h1 {
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.75rem;
    }
    .not-found-content p {
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 2rem;
    }
    .not-found-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    @media (max-width: 480px) {
      .not-found-code { font-size: 4rem; }
      .not-found-actions { flex-direction: column; width: 100%; }
    }
  `]
})
export class NotFoundComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  isLoggedIn = toSignal(this.authService.isLoggedIn$, { initialValue: false });

  goHome() {
    this.router.navigate([this.isLoggedIn() ? '/dashboard' : '/']);
  }
}
