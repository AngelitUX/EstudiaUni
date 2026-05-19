import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../core/services/payment.service';
import { FirestoreService } from '../../core/services/firestore.service';

@Component({
  selector: 'app-pricing-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pricing-modal-overlay" (click)="closeModal()">
      <div class="pricing-modal-container glass" (click)="$event.stopPropagation()">
        <!-- Close Button -->
        <button class="btn-close-pricing" (click)="closeModal()">✕</button>

        <!-- Header -->
        <div class="pricing-header">
          <span class="crown-icon">👑</span>
          <h2>Desbloquea el Máximo Nivel de Preparación</h2>
          <p class="pricing-subtitle">Únete al plan EstudiaUni PRO y prepárate para la PAES con herramientas ilimitadas.</p>
          
          <!-- Billing Cycle Switcher -->
          <div class="billing-switcher">
            <button [class.active]="billingCycle() === 'monthly'" (click)="setBilling('monthly')">Mensual</button>
            <button [class.active]="billingCycle() === 'yearly'" (click)="setBilling('yearly')">
              Anual 
              <span class="discount-badge">Ahorra 33%</span>
            </button>
          </div>
        </div>

        <!-- Cards Container -->
        <div class="pricing-cards">
          <!-- Card 1: Free -->
          <div class="pricing-card basic-card">
            <div class="card-header">
              <h3>Básico</h3>
              <p class="card-desc">Para empezar tu preparación.</p>
              <div class="card-price">
                <span class="currency">$</span>
                <span class="amount">0</span>
                <span class="period">/ por siempre</span>
              </div>
            </div>
            
            <div class="card-divider"></div>
            
            <ul class="features-list">
              <li class="allowed"><span>✅</span> 1 Ensayo diario</li>
              <li class="allowed"><span>✅</span> 3 Quizzes de Mente Veloz diarios</li>
              <li class="allowed"><span>✅</span> Historial NEM y calculadora</li>
              <li class="forbidden"><span>❌</span> Explicaciones con IA ilimitadas</li>
              <li class="forbidden"><span>❌</span> Estadísticas de rendimiento avanzado</li>
              <li class="forbidden"><span>❌</span> Placa dorada exclusiva de perfil PRO</li>
            </ul>

            <button class="btn-basic-status" disabled>
              {{ isPro() ? 'Plan Básico' : 'Tu Plan Actual' }}
            </button>
          </div>

          <!-- Card 2: PRO -->
          <div class="pricing-card pro-card glowing-gold-border">
            <div class="popular-ribbon">MÁS POPULAR</div>
            <div class="card-header">
              <h3 class="text-gold-gradient">PRO 👑</h3>
              <p class="card-desc">Todo el poder ilimitado para asegurar tu puntaje.</p>
              <div class="card-price">
                <span class="currency">$</span>
                <span class="amount">{{ billingCycle() === 'monthly' ? '4.990' : '39.990' }}</span>
                <span class="period">/ {{ billingCycle() === 'monthly' ? 'mes' : 'año' }}</span>
              </div>
              <p class="anual-savings-text" *ngIf="billingCycle() === 'yearly'">Equivale a solo $3.332 al mes</p>
            </div>
            
            <div class="card-divider"></div>
            
            <ul class="features-list">
              <li class="allowed highlight"><span>✨</span> <strong>Ensayos Ilimitados ♾️</strong></li>
              <li class="allowed highlight"><span>✨</span> <strong>Mente Veloz sin límites ⚡</strong></li>
              <li class="allowed highlight"><span>✨</span> <strong>Explicaciones de IA ilimitadas 🧠</strong></li>
              <li class="allowed"><span>✨</span> Estadísticas detalladas de progreso 📈</li>
              <li class="allowed"><span>✨</span> **Emblema Dorado Premium PRO** 🏆</li>
              <li class="allowed"><span>✨</span> Sin anuncios ni esperas 🚫</li>
            </ul>

            <button class="btn-pro-action pulse-gold" (click)="buyPlan()" [disabled]="loadingCheckout()">
              {{ loadingCheckout() ? 'Iniciando Webpay...' : (isPro() ? 'Extender Plan PRO 👑' : '¡Hacerme PRO Ahora! 🚀') }}
            </button>
          </div>
        </div>

        <p class="secure-checkout-text">🔒 Pago 100% seguro a través de Webpay Plus de Transbank</p>
      </div>
    </div>
  `,
  styles: [`
    .pricing-modal-overlay {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      animation: fadeInOverlay 0.25s ease-out;
      padding: 1rem;
      overflow-y: auto;
    }
    
    @keyframes fadeInOverlay {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .pricing-modal-container {
      position: relative;
      width: min(850px, 100%);
      border-radius: 24px;
      background: #ffffff;
      border: 2px solid var(--glass-border);
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
      padding: 2.5rem 2rem 2rem;
      animation: slideUpModal 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      color: var(--text-primary);
      max-height: 94vh;
      overflow-y: auto;
    }

    @keyframes slideUpModal {
      from { opacity: 0; transform: translateY(40px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .btn-close-pricing {
      position: absolute;
      top: 1.25rem;
      right: 1.25rem;
      border: none;
      background: var(--bg-secondary);
      color: var(--text-secondary);
      width: 36px;
      height: 36px;
      border-radius: 10px;
      font-size: 1.15rem;
      cursor: pointer;
      display: grid;
      place-items: center;
      transition: all 0.2s;
    }
    
    .btn-close-pricing:hover {
      background: rgba(239, 68, 68, 0.2);
      color: #ef4444;
      transform: rotate(90deg);
    }

    .pricing-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .crown-icon {
      font-size: 2.5rem;
      display: inline-block;
      animation: crownBob 2s ease-in-out infinite;
    }

    @keyframes crownBob {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-6px) rotate(4deg); }
    }

    .pricing-header h2 {
      margin: 0.5rem 0 0.5rem;
      font-size: 1.8rem;
      font-weight: 800;
      letter-spacing: -0.02em;
    }

    .pricing-subtitle {
      margin: 0 auto 1.5rem;
      color: var(--text-secondary);
      font-weight: 500;
      max-width: 580px;
      font-size: 0.98rem;
      line-height: 1.5;
    }

    .billing-switcher {
      display: inline-flex;
      background: var(--bg-secondary);
      padding: 0.35rem;
      border-radius: 14px;
      border: 1px solid var(--glass-border);
      gap: 0.25rem;
    }

    .billing-switcher button {
      border: none;
      background: transparent;
      color: var(--text-secondary);
      padding: 0.5rem 1.25rem;
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .billing-switcher button.active {
      background: #ffffff;
      color: var(--accent-primary);
      box-shadow: var(--shadow-sm);
    }

    .discount-badge {
      background: #10b981;
      color: #ffffff;
      font-size: 0.72rem;
      padding: 0.15rem 0.45rem;
      border-radius: 6px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }

    .pricing-cards {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.75rem;
      margin-bottom: 1.5rem;
    }

    .pricing-card {
      background: #ffffff;
      border: 2px solid var(--glass-border);
      border-radius: 20px;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      position: relative;
      transition: all 0.3s ease;
    }

    .pricing-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
    }

    .pro-card {
      border-color: #d4af37;
      background: linear-gradient(to bottom, #ffffff, rgba(254, 243, 199, 0.25));
    }

    .glowing-gold-border {
      box-shadow: 0 0 20px rgba(212, 175, 55, 0.15);
    }

    .pricing-card:hover.pro-card {
      box-shadow: 0 15px 40px rgba(212, 175, 55, 0.3);
      border-color: #e6a100;
    }

    .popular-ribbon {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: linear-gradient(135deg, #FFE885 0%, #E6A100 50%, #B87E00 100%);
      color: #ffffff;
      font-size: 0.7rem;
      font-weight: 800;
      padding: 0.3rem 0.75rem;
      border-radius: 99px;
      letter-spacing: 0.05em;
      border: 1px solid #FFE885;
      box-shadow: 0 2px 8px rgba(184, 126, 0, 0.3);
    }

    .card-header h3 {
      margin: 0;
      font-size: 1.4rem;
      font-weight: 800;
    }

    .text-gold-gradient {
      background: linear-gradient(135deg, #d4af37 0%, #b87e00 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .card-desc {
      margin: 0.35rem 0 1.25rem;
      font-size: 0.88rem;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .card-price {
      display: flex;
      align-items: baseline;
      gap: 0.2rem;
      margin-bottom: 0.25rem;
    }

    .card-price .currency {
      font-size: 1.3rem;
      font-weight: 800;
      color: var(--text-primary);
    }

    .card-price .amount {
      font-size: 2.2rem;
      font-weight: 900;
      color: var(--text-primary);
      letter-spacing: -0.03em;
    }

    .card-price .period {
      font-size: 0.9rem;
      color: var(--text-muted);
      font-weight: 600;
    }

    .anual-savings-text {
      margin: 0 0 0.5rem;
      font-size: 0.8rem;
      color: #10b981;
      font-weight: 700;
    }

    .card-divider {
      height: 1px;
      background: var(--glass-border);
      margin: 1.5rem 0;
    }

    .features-list {
      list-style: none;
      padding: 0;
      margin: 0 0 2rem;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      flex: 1;
    }

    .features-list li {
      display: flex;
      align-items: flex-start;
      gap: 0.65rem;
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--text-secondary);
      line-height: 1.4;
    }

    .features-list li span {
      flex-shrink: 0;
      font-size: 1rem;
    }

    .features-list li.forbidden {
      color: var(--text-muted);
    }

    .features-list li.highlight {
      color: var(--text-primary);
      font-weight: 600;
    }

    .btn-basic-status {
      width: 100%;
      padding: 0.85rem;
      border: 2px solid var(--glass-border);
      background: var(--bg-secondary);
      color: var(--text-muted);
      border-radius: 12px;
      font-weight: 700;
      font-size: 0.95rem;
      cursor: not-allowed;
    }

    .btn-pro-action {
      width: 100%;
      padding: 0.95rem;
      border: none;
      background: linear-gradient(135deg, #FFE885 0%, #E6A100 50%, #B87E00 100%);
      color: #ffffff;
      border-radius: 12px;
      font-weight: 800;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.25s ease;
      box-shadow: 0 4px 15px rgba(230, 161, 0, 0.35);
      border: 1px solid #FFE885;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }

    .btn-pro-action:hover:not([disabled]) {
      filter: brightness(1.08);
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(230, 161, 0, 0.5);
    }

    .btn-pro-action[disabled] {
      opacity: 0.75;
      cursor: not-allowed;
    }

    .pulse-gold {
      animation: goldPulse 2s infinite;
    }

    @keyframes goldPulse {
      0% { box-shadow: 0 0 0 0 rgba(230, 161, 0, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(230, 161, 0, 0); }
      100% { box-shadow: 0 0 0 0 rgba(230, 161, 0, 0); }
    }

    .secure-checkout-text {
      text-align: center;
      margin: 1.25rem 0 0;
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .pricing-cards {
        grid-template-columns: 1fr;
        gap: 1.25rem;
      }
      .pricing-modal-container {
        padding: 2rem 1.25rem 1.25rem;
      }
      .pricing-header h2 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class PricingModalComponent {
  private paymentService = inject(PaymentService);
  private firestoreService = inject(FirestoreService);

  billingCycle = signal<'monthly' | 'yearly'>('monthly');
  loadingCheckout = signal<boolean>(false);

  isPro = () => this.firestoreService.profileSignal()?.plan === 'premium';

  setBilling(cycle: 'monthly' | 'yearly') {
    this.billingCycle.set(cycle);
  }

  closeModal() {
    this.paymentService.closePricingModal();
  }

  buyPlan() {
    this.loadingCheckout.set(true);
    const returnUrl = window.location.origin + '/pago-resultado';
    const plan = this.billingCycle();

    this.paymentService.createWebpayTransaction(plan, returnUrl).subscribe({
      next: (res) => {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = res.url;
        
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'token_ws';
        input.value = res.token;
        
        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
      },
      error: (err) => {
        this.loadingCheckout.set(false);
        console.error('[PricingModal] Error initiating Webpay payment:', err);
        const errMsg = err.error?.message || err.message || 'Error de conexión';
        alert('Hubo un problema al iniciar el pago: ' + errMsg);
      }
    });
  }
}
