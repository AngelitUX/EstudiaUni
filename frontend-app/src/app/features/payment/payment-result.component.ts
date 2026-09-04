import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService, FlowPaymentResult } from '../../core/services/payment.service';
import { FirestoreService } from '../../core/services/firestore.service';

@Component({
  selector: 'app-payment-result',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="payment-container">
      <!-- Background Pulsating Blobs -->
      <div class="payment-bg">
        <div class="blob blob-purple"></div>
        <div class="blob blob-blue"></div>
      </div>

      <div class="glass-card main-card">
        <!-- LOADING STATE -->
        <div *ngIf="state() === 'loading'" class="state-container animate-fade">
          <div class="spinner-container">
            <div class="spinner">
              <div class="spinner-core"></div>
            </div>
            <div class="spinner-glow"></div>
          </div>
          <h1 class="title text-gradient">Activando tu Plan Pro</h1>
          <p class="subtitle">Estamos confirmando tu pago con Flow. Por favor no cierres ni recargues esta página.</p>
          
          <div class="loading-bar">
            <div class="loading-progress"></div>
          </div>
        </div>

        <!-- SUCCESS STATE -->
        <div *ngIf="state() === 'success'" class="state-container animate-fade">
          <div class="success-icon-container">
            <svg class="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <div class="success-glow"></div>
          </div>
          
          <h1 class="title text-gradient success-title">¡Bienvenido a Premium! 🚀</h1>
          <p class="subtitle">Tu pase {{ result()?.planType === 'yearly' ? 'anual' : 'mensual' }} de Plan Pro fue activado con éxito — ya tienes acceso ilimitado a todas las herramientas PAES. Es un pago único: no se te cobrará de nuevo automáticamente.</p>

          <!-- Receipt Details -->
          <div class="receipt-box">
            <div class="receipt-row" *ngIf="result()?.amount">
              <span class="receipt-label">Monto pagado</span>
              <span class="receipt-value font-mono">$ {{ (result()?.amount || 0).toLocaleString('es-CL') }}</span>
            </div>
            <div class="receipt-row" *ngIf="result()?.cardType">
              <span class="receipt-label">Medio de pago</span>
              <span class="receipt-value">{{ result()?.cardType }}</span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">Pase</span>
              <span class="receipt-value text-bold">{{ result()?.planType === 'yearly' ? 'Pro — 1 año' : 'Pro — 1 mes' }} (pago único)</span>
            </div>
            <div class="receipt-divider"></div>
            <div class="receipt-row">
              <span class="receipt-label">Estado de Cuenta</span>
              <span class="receipt-badge">Premium Activo 👑</span>
            </div>
          </div>

          <button class="action-btn btn-success btn-glow" (click)="goToDashboard()">
            ⚡ Ir al Panel Principal
          </button>
        </div>

        <!-- ERROR STATE -->
        <div *ngIf="state() === 'error'" class="state-container animate-fade">
          <div class="error-icon-container">
            <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            <div class="error-glow"></div>
          </div>

          <h1 class="title text-gradient error-title">Pago No Procesado</h1>
          <p class="subtitle">{{ errorMessage() }}</p>

          <div class="action-row">
            <button class="action-btn btn-secondary" (click)="goToHome()">
              Volver al Inicio
            </button>
            <button class="action-btn btn-primary" (click)="goToHome('#pricing')">
              Ver Planes
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Container & Background */
    .payment-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      width: 100vw;
      overflow: hidden;
      position: relative;
      background: #0f0c1b; /* Dark Mode Premium */
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
    .payment-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      pointer-events: none;
    }
    .blob {
      position: absolute;
      filter: blur(120px);
      border-radius: 50%;
      opacity: 0.35;
      animation: morph 12s infinite alternate ease-in-out;
    }
    .blob-purple {
      width: 50vw;
      height: 50vw;
      background: #855cd6;
      top: -10%;
      left: -10%;
    }
    .blob-blue {
      width: 45vw;
      height: 45vw;
      background: #3b82f6;
      bottom: -10%;
      right: -10%;
      animation-delay: -4s;
    }
    @keyframes morph {
      0% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(4vw, -4vh) scale(1.1); }
      100% { transform: translate(-2vw, 2vh) scale(0.9); }
    }

    /* Glassmorphic Card */
    .glass-card {
      position: relative;
      z-index: 10;
      width: 90%;
      max-width: 520px;
      padding: 3rem 2.5rem;
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1);
      text-align: center;
    }

    .state-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    /* Typography */
    .title {
      font-size: 2.2rem;
      font-weight: 800;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
      letter-spacing: -0.5px;
    }
    .subtitle {
      font-size: 1.05rem;
      color: rgba(255, 255, 255, 0.65);
      line-height: 1.6;
      margin-bottom: 2rem;
      max-width: 90%;
    }
    .text-gradient {
      background: linear-gradient(135deg, #a78bfa 0%, #ec4899 50%, #f43f5e 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .success-title {
      background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .error-title {
      background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    /* Spinner Loading */
    .spinner-container {
      position: relative;
      width: 90px;
      height: 90px;
      margin-bottom: 1rem;
    }
    .spinner {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      padding: 3px;
      background: linear-gradient(135deg, #a78bfa 0%, #ec4899 100%);
      animation: spin 1.5s linear infinite;
    }
    .spinner-core {
      width: 100%;
      height: 100%;
      background: #0f0c1b;
      border-radius: 50%;
    }
    .spinner-glow {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: linear-gradient(135deg, #a78bfa 0%, #ec4899 100%);
      filter: blur(12px);
      opacity: 0.5;
      animation: pulse 1.5s infinite alternate ease-in-out;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Success Icon */
    .success-icon-container, .error-icon-container {
      position: relative;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 1rem;
    }
    .success-icon-container {
      background: rgba(16, 185, 129, 0.15);
      border: 2px solid #10b981;
      color: #34d399;
    }
    .success-icon {
      width: 40px;
      height: 40px;
    }
    .success-glow {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: #10b981;
      filter: blur(15px);
      opacity: 0.4;
      z-index: -1;
      animation: pulse 2s infinite ease-in-out;
    }

    /* Error Icon */
    .error-icon-container {
      background: rgba(239, 68, 68, 0.15);
      border: 2px solid #ef4444;
      color: #f87171;
    }
    .error-icon {
      width: 40px;
      height: 40px;
    }
    .error-glow {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: #ef4444;
      filter: blur(15px);
      opacity: 0.4;
      z-index: -1;
      animation: pulse 2s infinite ease-in-out;
    }

    @keyframes pulse {
      0% { transform: scale(0.95); opacity: 0.3; }
      100% { transform: scale(1.1); opacity: 0.6; }
    }

    /* Loading Bar */
    .loading-bar {
      width: 100%;
      height: 6px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 3px;
      overflow: hidden;
      margin-top: 1rem;
    }
    .loading-progress {
      width: 40%;
      height: 100%;
      background: linear-gradient(90deg, #a78bfa, #ec4899);
      border-radius: 3px;
      animation: loadProgress 1.8s infinite ease-in-out;
    }
    @keyframes loadProgress {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(250%); }
    }

    /* Receipt Box */
    .receipt-box {
      width: 100%;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      text-align: left;
    }
    .receipt-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.85rem;
    }
    .receipt-row:last-child {
      margin-bottom: 0;
    }
    .receipt-label {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.45);
    }
    .receipt-value {
      font-size: 0.95rem;
      color: rgba(255, 255, 255, 0.85);
      font-weight: 500;
    }
    .font-mono {
      font-family: 'Space Mono', 'Fira Code', monospace;
      letter-spacing: 0.5px;
    }
    .font-lg {
      font-size: 1.25rem;
      color: #34d399;
    }
    .text-bold {
      font-weight: 700;
    }
    .receipt-divider {
      height: 1px;
      background: rgba(255, 255, 255, 0.05);
      margin: 1rem 0;
    }
    .receipt-badge {
      background: rgba(16, 185, 129, 0.12);
      color: #34d399;
      padding: 0.4rem 0.8rem;
      border-radius: 99px;
      font-size: 0.85rem;
      font-weight: 600;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    /* Buttons */
    .action-btn {
      width: 100%;
      padding: 1rem 2rem;
      font-size: 1.05rem;
      font-weight: 700;
      border-radius: 12px;
      border: none;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .btn-success {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #ffffff;
      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.2);
    }
    .btn-success:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
    }
    .btn-primary {
      background: linear-gradient(135deg, #855cd6 0%, #7c3aed 100%);
      color: #ffffff;
      box-shadow: 0 4px 15px rgba(133, 92, 214, 0.25);
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(133, 92, 214, 0.45);
    }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
    }
    .action-row {
      display: flex;
      gap: 1rem;
      width: 100%;
    }
    .action-row .action-btn {
      flex: 1;
    }

    /* Animations */
    .animate-fade {
      animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 480px) {
      .glass-card {
        width: 92%;
        padding: 2rem 1.25rem;
      }
      .title {
        font-size: 1.6rem;
      }
      .subtitle {
        font-size: 0.95rem;
        max-width: 100%;
      }
      .receipt-box {
        padding: 1rem;
      }
      .action-row {
        flex-direction: column;
      }
      .action-btn {
        padding: 0.9rem 1rem;
        font-size: 1rem;
      }
    }

    @media (max-width: 380px) {
      .spinner-container, .success-icon-container, .error-icon-container {
        width: 70px;
        height: 70px;
      }
      .title {
        font-size: 1.4rem;
      }
      .receipt-row {
        flex-wrap: wrap;
        gap: 0.25rem;
      }
    }
  `]
})
export class PaymentResultComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private paymentService = inject(PaymentService);
  private firestoreService = inject(FirestoreService);

  state = signal<'loading' | 'success' | 'error'>('loading');
  errorMessage = signal<string>('Ocurrió un error inesperado al procesar tu pago.');
  result = signal<FlowPaymentResult | null>(null);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];

      if (token) {
        // The user finished (or cancelled) on Flow's payment page — confirm
        // the charge and grant the pass with our backend.
        this.verifyPayment(token);
      } else {
        // No token: either the user cancelled on Flow's site or landed here directly.
        this.state.set('error');
        this.errorMessage.set('No se encontró ningún token de pago válido. Si cancelaste el pago en Flow, no se realizó ningún cobro.');
      }
    });
  }

  private verifyPayment(token: string) {
    this.paymentService.confirmFlowPayment(token).subscribe({
      next: (res) => {
        if (res.success) {
          this.result.set(res);
          this.state.set('success');

          // Force refresh the user profile signal so Angular state immediately becomes Premium
          this.firestoreService.getUserProfile(true).subscribe();
        } else {
          this.state.set('error');
          this.errorMessage.set(res.message || 'El pago fue rechazado por el banco o por Flow.');
        }
      },
      error: (err) => {
        console.error('[PaymentResult] Error confirming Flow payment:', err);
        this.state.set('error');
        this.errorMessage.set(err.error?.message || 'Error de conexión al confirmar tu pago con Flow. Si el dinero fue descontado de tu cuenta, por favor comunícate con soporte.');
      }
    });
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goToHome(fragment?: string) {
    if (fragment) {
      this.router.navigate(['/'], { fragment: fragment.substring(1) });
      setTimeout(() => {
        const element = document.querySelector(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 200);
    } else {
      this.router.navigate(['/']);
    }
  }
}
