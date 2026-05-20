import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService, CouponValidationResponse } from '../../core/services/payment.service';
import { FirestoreService } from '../../core/services/firestore.service';

type ModalStep = 'plans' | 'recipient';
type RecipientMode = 'self' | 'gift';
type EmailStatus = 'idle' | 'checking' | 'found' | 'not_found';
type CouponStatus = 'idle' | 'checking' | 'valid' | 'invalid';

@Component({
  selector: 'app-pricing-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="pricing-modal-overlay" (click)="closeModal()">
      <div class="pricing-modal-container glass" (click)="$event.stopPropagation()">
        <!-- Close Button -->
        <button class="btn-close-pricing" (click)="closeModal()">✕</button>

        <!-- ─────────────── STEP 1: Plan Selection (solo desde Dashboard) ─────────────── -->
        <ng-container *ngIf="currentStep() === 'plans'">
          <div class="pricing-header">
            <span class="crown-icon">👑</span>
            <h2>Desbloquea el Máximo Nivel de Preparación</h2>
            <p class="pricing-subtitle">Únete al plan EstudiaUni PRO y prepárate para la PAES con herramientas ilimitadas.</p>
            <div class="billing-switcher">
              <button [class.active]="billingCycle() === 'monthly'" (click)="setBilling('monthly')">Mensual</button>
              <button [class.active]="billingCycle() === 'yearly'" (click)="setBilling('yearly')">
                Anual <span class="discount-badge">¡Ahorra 41%!</span>
              </button>
            </div>
          </div>

          <div class="pricing-cards">
            <!-- Card Básico -->
            <div class="pricing-card basic-card">
              <div class="card-header">
                <span class="plan-tag-small">Acceso Inicial</span>
                <h3>Plan Básico</h3>
                <p class="card-desc">Sin tarjetas, sin compromisos.</p>
                <div class="card-price">
                  <span class="amount-big">Gratis</span>
                  <span class="period">/siempre</span>
                </div>
              </div>
              <div class="card-divider"></div>
              <ul class="features-list">
                <li class="allowed"><span class="fi">✅</span> 1 Ensayo PAES cada 48 horas</li>
                <li class="allowed"><span class="fi">✅</span> 1 Capítulo de la Ruta de Aprendizaje</li>
                <li class="allowed"><span class="fi">✅</span> Acceso limitado al Tutor IA</li>
                <li class="allowed"><span class="fi">✅</span> 1 Mini-Ensayo al día</li>
                <li class="forbidden"><span class="fi">❌</span> Acceso al Mejorador de Puntaje</li>
                <li class="forbidden"><span class="fi">❌</span> Análisis para encontrar tu carrera ideal</li>
              </ul>
              <button class="btn-basic-status" disabled>
                {{ isPro() ? 'Plan Básico' : 'Tu Plan Actual' }}
              </button>
            </div>

            <!-- Card PRO -->
            <div class="pricing-card pro-card glowing-gold-border">
              <div class="popular-ribbon">⭐ RECOMENDADO</div>
              <div class="card-header">
                <span class="plan-tag-small premium-tag-small">Preparación Óptima</span>
                <h3 class="text-gold-gradient">Plan Pro 👑</h3>
                <p class="card-desc">Todo el poder ilimitado para asegurar tu puntaje.</p>
                <div class="card-price">
                  <span class="currency">$</span>
                  <span class="amount">{{ billingCycle() === 'monthly' ? '9.990' : '5.833' }}</span>
                  <span class="period">/mes</span>
                </div>
                <p class="price-sub" *ngIf="billingCycle() === 'monthly'">Facturado mensualmente</p>
                <p class="price-sub savings" *ngIf="billingCycle() === 'yearly'">Facturado anualmente ($69.990) — ¡Ahorra 41%!</p>
              </div>
              <div class="card-divider"></div>
              <ul class="features-list">
                <li class="allowed highlight"><span class="fi">✨</span> <strong>Ensayos PAES Ilimitados</strong></li>
                <li class="allowed highlight"><span class="fi">✨</span> <strong>Ruta de Aprendizaje Completa</strong></li>
                <li class="allowed highlight"><span class="fi">✨</span> <strong>Acceso Total al Tutor IA</strong></li>
                <li class="allowed"><span class="fi">✨</span> Acceso completo a Mini-Ensayos y Minijuegos</li>
                <li class="allowed"><span class="fi">✨</span> Mejorador de Puntaje y Análisis Estadístico en tiempo real</li>
                <li class="allowed"><span class="fi">✨</span> <strong>¡Y muchas cosas más!</strong></li>
              </ul>
              <button class="btn-pro-action pulse-gold" (click)="goToRecipient()">
                {{ isPro() ? 'Extender Plan PRO 👑' : '¡Hacerme PRO Ahora! 🚀' }}
              </button>
            </div>
          </div>

          <p class="secure-checkout-text">🔒 Pago 100% seguro a través de Webpay Plus de Transbank</p>
        </ng-container>

        <!-- ─────────────── STEP 2: Recipient, Plan & Coupon Selection ─────────────── -->
        <ng-container *ngIf="currentStep() === 'recipient'">
          <div class="flow-step">
            <!-- Back Button (solo si no vino del home) -->
            <button class="btn-back" *ngIf="!cameFromHome()" (click)="goBack()">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              Volver a los planes
            </button>

            <div class="step-header">
              <div class="step-icon-wrap">🎯</div>
              <h2>¿Para quién es el Plan Pro?</h2>
              <p>Elige si activar el Pro en tu cuenta o regalárselo a alguien más.</p>
            </div>

            <!-- Mode Tabs -->
            <div class="mode-tabs">
              <button class="mode-tab" [class.active]="recipientMode() === 'self'" (click)="setMode('self')">
                <span class="tab-icon">🧑‍💻</span> Para mí
              </button>
              <button class="mode-tab gift-tab" [class.active]="recipientMode() === 'gift'" (click)="setMode('gift')">
                <span class="tab-icon">🎁</span> Regalar
              </button>
            </div>

            <!-- Plan Selector Option (always visible here so they can choose/toggle monthly or yearly) -->
            <div class="plan-selector-row">
              <button class="pselector-btn" [class.active]="billingCycle() === 'monthly'" (click)="onPlanChange('monthly')">
                <div class="pselector-main">Mensual</div>
                <div class="pselector-price">
                  \\\${{ couponResult()?.valid && billingCycle() === 'monthly' ? formatPrice(couponResult()!.finalAmount!) : '9.990' }} /mes
                </div>
              </button>
              <button class="pselector-btn" [class.active]="billingCycle() === 'yearly'" (click)="onPlanChange('yearly')">
                <div class="pselector-main">Anual <span class="save-chip">-41%</span></div>
                <div class="pselector-price">
                  \\\${{ couponResult()?.valid && billingCycle() === 'yearly' ? formatPrice(couponResult()!.finalAmount!) : '69.990' }}
                </div>
              </button>
            </div>

            <!-- ── Self Mode Email Display ── -->
            <div class="mode-panel" *ngIf="recipientMode() === 'self'">
              <div class="self-email-display">
                <span class="sedf-icon">🧑‍💻</span>
                <div class="sedf-info">
                  <span class="sedf-label">Tu cuenta</span>
                  <span class="sedf-val">{{ currentUserEmail() }}</span>
                </div>
                <span class="badge-green">✅ Tú</span>
              </div>
            </div>

            <!-- ── Gift Mode Email Input ── -->
            <div class="mode-panel" *ngIf="recipientMode() === 'gift'">
              <p class="gift-desc">Ingresa el correo de la persona a quien quieres regalarle el Plan Pro. Su cuenta debe estar registrada en EstudiaUni.</p>

              <div class="email-wrap" [class.found]="emailStatus() === 'found'" [class.notfound]="emailStatus() === 'not_found'">
                <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,12 2,6"></polyline></svg>
                <input type="email" class="text-input" placeholder="correo@ejemplo.cl" [(ngModel)]="giftEmail" (input)="onEmailInput()" [disabled]="loadingCheckout()" />
                <span class="email-status-indicator" *ngIf="emailStatus() !== 'idle'">
                  <span *ngIf="emailStatus() === 'checking'">⏳</span>
                  <span *ngIf="emailStatus() === 'found'">✅</span>
                  <span *ngIf="emailStatus() === 'not_found'">❌</span>
                </span>
              </div>

              <!-- Recipient status alerts -->
              <p class="feedback-msg success" *ngIf="emailStatus() === 'found' && recipientPlan() !== 'premium'">
                ✅ <strong>{{ giftEmail }}</strong> — ¡Cuenta encontrada! Está listo para recibir el Pro.
              </p>
              <p class="feedback-msg warning" *ngIf="emailStatus() === 'found' && recipientPlan() === 'premium'">
                ⚠️ <strong>{{ giftEmail }}</strong> ya tiene el Plan Pro activo. Si continúas, la compra se sumará como días adicionales a su plan actual.
              </p>
              <p class="feedback-msg error" *ngIf="emailStatus() === 'not_found'">
                ❌ No encontramos ninguna cuenta con ese correo. Pídele que se registre primero.
              </p>
            </div>

            <!-- ── Coupon Toggle Checkbox (To keep the UI clean) ── -->
            <div class="coupon-toggle-row" style="margin-top: 1.25rem;">
              <label class="checkbox-container">
                <input type="checkbox" [checked]="hasDiscountCode()" (change)="toggleDiscountCode()" />
                <span class="checkmark"></span>
                Tengo un código de descuento
              </label>
            </div>

            <!-- ── Coupon Code Section (Visible only when checked) ── -->
            <div class="coupon-section" *ngIf="hasDiscountCode()" style="margin-top: 1rem; animation: fadeIn 0.2s ease-out;">
              <div class="coupon-input-row">
                <div class="coupon-wrap" [class.valid]="couponStatus() === 'valid'" [class.invalid]="couponStatus() === 'invalid'">
                  <svg class="coupon-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                  <input
                    type="text"
                    class="text-input coupon-text"
                    placeholder="Ej: PAES2026"
                    [(ngModel)]="couponCode"
                    (input)="onCouponInput()"
                    [disabled]="loadingCheckout()"
                    style="text-transform:uppercase;"
                  />
                  <span class="coupon-status-icon" *ngIf="couponStatus() !== 'idle'">
                    <span *ngIf="couponStatus() === 'checking'">⏳</span>
                    <span *ngIf="couponStatus() === 'valid'">✅</span>
                    <span *ngIf="couponStatus() === 'invalid'">❌</span>
                  </span>
                </div>
                <button class="btn-apply-coupon" (click)="applyCoupon()" [disabled]="!couponCode.trim() || couponStatus() === 'checking' || loadingCheckout()">
                  <span *ngIf="couponStatus() !== 'checking'">Aplicar</span>
                  <span *ngIf="couponStatus() === 'checking'" class="loading-dots">Verificando</span>
                </button>
              </div>
              <p class="coupon-feedback success" *ngIf="couponStatus() === 'valid'">{{ couponResult()?.message }}</p>
              <p class="coupon-feedback error" *ngIf="couponStatus() === 'invalid'">{{ couponFeedbackMsg() }}</p>
            </div>

            <!-- ── Price Breakdown (Visible when a coupon is applied) ── -->
            <div class="price-summary-box" *ngIf="couponResult()?.valid" [class.discounted]="true" style="margin-top: 1.25rem; margin-bottom: 1.25rem;">
              <div class="price-row">
                <span class="price-label">Precio base</span>
                <span class="price-val crossed">
                  \\\${{ billingCycle() === 'monthly' ? '9.990' : '69.990' }}/{{ billingCycle() === 'monthly' ? 'mes' : 'año' }}
                </span>
              </div>
              <div class="price-row discount-row">
                <span class="price-label green">Descuento aplicado</span>
                <span class="price-val green">-\\\${{ formatPrice(couponResult()!.discountAmount!) }}</span>
              </div>
              <div class="price-divider"></div>
              <div class="price-row total-row">
                <span class="price-label bold">Total a pagar</span>
                <span class="price-val bold purple">\\\${{ formatPrice(couponResult()!.finalAmount!) }}/{{ billingCycle() === 'monthly' ? 'mes' : 'año' }}</span>
              </div>
            </div>

            <!-- ── Final Checkout Button ── -->
            <button class="btn-checkout big" style="margin-top: 1.5rem;" (click)="proceedCheckout()" [disabled]="loadingCheckout() || (recipientMode() === 'gift' && emailStatus() !== 'found')">
              <span *ngIf="!loadingCheckout()">
                {{ couponResult()?.valid
                  ? 'Pagar $' + formatPrice(couponResult()!.finalAmount!) + ' con Webpay 🔒'
                  : (recipientMode() === 'gift' ? 'Regalar Plan Pro 🎁' : 'Continuar con Webpay 🔒')
                }}
              </span>
              <span *ngIf="loadingCheckout()" class="loading-dots">Iniciando Webpay</span>
            </button>

            <p class="secure-checkout-text">🔒 Pago 100% seguro a través de Webpay Plus de Transbank</p>
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .pricing-modal-overlay {
      position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center;
      justify-content: center; background: rgba(0,0,0,0.6); backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px); animation: fadeInOverlay 0.25s ease-out;
      padding: 1rem; overflow-y: auto;
    }
    @keyframes fadeInOverlay { from { opacity:0; } to { opacity:1; } }
    .pricing-modal-container {
      position: relative; width: min(880px,100%); border-radius: 24px; background: #fff;
      border: 2px solid var(--glass-border); box-shadow: 0 25px 60px rgba(0,0,0,0.25);
      padding: 2.5rem 2rem 2rem; animation: slideUpModal 0.35s cubic-bezier(0.16,1,0.3,1);
      color: var(--text-primary); max-height: 94vh; overflow-y: auto;
    }
    @keyframes slideUpModal { from { opacity:0; transform:translateY(40px) scale(0.96); } to { opacity:1; transform:translateY(0) scale(1); } }
    .btn-close-pricing {
      position: absolute; top: 1.25rem; right: 1.25rem; border: none;
      background: var(--bg-secondary); color: var(--text-secondary);
      width: 36px; height: 36px; border-radius: 10px; font-size: 1.15rem;
      cursor: pointer; display: grid; place-items: center; transition: all 0.2s; z-index: 2;
    }
    .btn-close-pricing:hover { background: rgba(239,68,68,0.2); color:#ef4444; transform:rotate(90deg); }

    /* Step 1 */
    .pricing-header { text-align:center; margin-bottom:2rem; }
    .crown-icon { font-size:2.5rem; display:inline-block; animation:crownBob 2s ease-in-out infinite; }
    @keyframes crownBob { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-6px) rotate(4deg)} }
    .pricing-header h2 { margin:0.5rem 0; font-size:1.8rem; font-weight:800; letter-spacing:-0.02em; }
    .pricing-subtitle { margin:0 auto 1.5rem; color:var(--text-secondary); max-width:580px; font-size:0.98rem; line-height:1.5; }
    .billing-switcher { display:inline-flex; background:var(--bg-secondary); padding:0.35rem; border-radius:14px; border:1px solid var(--glass-border); gap:0.25rem; }
    .billing-switcher button { border:none; background:transparent; color:var(--text-secondary); padding:0.5rem 1.25rem; border-radius:10px; font-weight:700; font-size:0.9rem; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; gap:0.5rem; }
    .billing-switcher button.active { background:#fff; color:var(--accent-primary); box-shadow:var(--shadow-sm); }
    .discount-badge { background:#10b981; color:#fff; font-size:0.72rem; padding:0.15rem 0.45rem; border-radius:6px; font-weight:800; text-transform:uppercase; }
    .pricing-cards { display:grid; grid-template-columns:1fr 1fr; gap:1.75rem; margin-bottom:1.5rem; }
    .pricing-card { background:#fff; border:2px solid var(--glass-border); border-radius:20px; padding:2rem; display:flex; flex-direction:column; position:relative; transition:all 0.3s ease; }
    .pricing-card:hover { transform:translateY(-4px); box-shadow:var(--shadow-lg); }
    .pro-card { border-color:#d4af37; background:linear-gradient(to bottom,#fff,rgba(254,243,199,0.25)); }
    .glowing-gold-border { box-shadow:0 0 20px rgba(212,175,55,0.15); }
    .pricing-card:hover.pro-card { box-shadow:0 15px 40px rgba(212,175,55,0.3); border-color:#e6a100; }
    .popular-ribbon { position:absolute; top:1rem; right:1rem; background:linear-gradient(135deg,#FFE885 0%,#E6A100 50%,#B87E00 100%); color:#fff; font-size:0.7rem; font-weight:800; padding:0.3rem 0.75rem; border-radius:99px; letter-spacing:0.05em; border:1px solid #FFE885; box-shadow:0 2px 8px rgba(184,126,0,0.3); }
    .plan-tag-small { display:inline-block; font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-muted); background:var(--bg-secondary); padding:0.2rem 0.6rem; border-radius:6px; margin-bottom:0.4rem; border:1px solid var(--glass-border); }
    .premium-tag-small { background:rgba(212,175,55,0.15); color:#b87e00; border-color:rgba(212,175,55,0.3); }
    .card-header h3 { margin:0; font-size:1.4rem; font-weight:800; }
    .text-gold-gradient { background:linear-gradient(135deg,#d4af37 0%,#b87e00 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
    .card-desc { margin:0.35rem 0 1.25rem; font-size:0.88rem; color:var(--text-secondary); }
    .card-price { display:flex; align-items:baseline; gap:0.2rem; margin-bottom:0.25rem; }
    .currency { font-size:1.3rem; font-weight:800; }
    .amount { font-size:2.2rem; font-weight:900; letter-spacing:-0.03em; }
    .amount-big { font-size:2rem; font-weight:900; }
    .period { font-size:0.9rem; color:var(--text-muted); font-weight:600; }
    .price-sub { margin:0.1rem 0 0.75rem; font-size:0.8rem; color:var(--text-muted); }
    .price-sub.savings { color:#10b981; font-weight:700; }
    .card-divider { height:1px; background:var(--glass-border); margin:1.25rem 0; }
    .features-list { list-style:none; padding:0; margin:0 0 2rem; display:flex; flex-direction:column; gap:0.8rem; flex:1; }
    .features-list li { display:flex; align-items:flex-start; gap:0.65rem; font-size:0.88rem; font-weight:500; color:var(--text-secondary); }
    .fi { flex-shrink:0; }
    .features-list li.forbidden { color:var(--text-muted); }
    .features-list li.highlight { color:var(--text-primary); font-weight:600; }
    .btn-basic-status { width:100%; padding:0.85rem; border:2px solid var(--glass-border); background:var(--bg-secondary); color:var(--text-muted); border-radius:12px; font-weight:700; cursor:not-allowed; }
    .btn-pro-action { width:100%; padding:0.95rem; border:none; background:linear-gradient(135deg,#FFE885 0%,#E6A100 50%,#B87E00 100%); color:#fff; border-radius:12px; font-weight:800; font-size:1rem; cursor:pointer; transition:all 0.25s ease; box-shadow:0 4px 15px rgba(230,161,0,0.35); text-shadow:0 1px 2px rgba(0,0,0,0.2); }
    .btn-pro-action:hover { filter:brightness(1.08); transform:translateY(-2px); }
    .pulse-gold { animation:goldPulse 2s infinite; }
    @keyframes goldPulse { 0%{box-shadow:0 0 0 0 rgba(230,161,0,0.4)} 70%{box-shadow:0 0 0 10px rgba(230,161,0,0)} 100%{box-shadow:0 0 0 0 rgba(230,161,0,0)} }

    /* Steps 2 & 3 shared */
    .flow-step { max-width:520px; margin:0 auto; }
    .btn-back { display:inline-flex; align-items:center; gap:0.4rem; border:none; background:transparent; color:var(--text-secondary); font-size:0.9rem; font-weight:600; cursor:pointer; padding:0.35rem 0.75rem 0.35rem 0.4rem; border-radius:8px; transition:all 0.2s; margin-bottom:1.75rem; }
    .btn-back:hover { background:var(--bg-secondary); color:var(--text-primary); }
    .step-header { text-align:center; margin-bottom:2rem; }
    .step-icon-wrap { font-size:2.5rem; margin-bottom:0.5rem; display:inline-block; animation:crownBob 2.5s ease-in-out infinite; }
    .step-header h2 { margin:0 0 0.5rem; font-size:1.6rem; font-weight:800; letter-spacing:-0.02em; }
    .step-header p { margin:0; color:var(--text-secondary); font-size:0.95rem; }
    .mode-tabs { display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:1.5rem; background:var(--bg-secondary); padding:0.4rem; border-radius:16px; border:1px solid var(--glass-border); }
    .mode-tab { display:flex; align-items:center; justify-content:center; gap:0.6rem; border:none; background:transparent; color:var(--text-secondary); padding:0.75rem 1rem; border-radius:12px; font-weight:700; font-size:0.95rem; cursor:pointer; transition:all 0.2s; }
    .mode-tab.active { background:#fff; color:var(--accent-primary); box-shadow:0 2px 8px rgba(0,0,0,0.08); }
    .mode-tab.gift-tab.active { background:linear-gradient(135deg,#fdf2ff 0%,#f3e8ff 100%); color:#7c3aed; }
    .plan-selector-row { display:flex; gap:0.75rem; margin-bottom:1.5rem; flex-wrap:wrap; }
    .pselector-btn { flex:1; min-width:120px; padding:0.7rem 1rem; border:2px solid var(--glass-border); background:var(--bg-secondary); border-radius:12px; font-size:0.88rem; font-weight:700; color:var(--text-secondary); cursor:pointer; transition:all 0.2s; text-align:left; }
    .pselector-btn.active { border-color:var(--accent-primary); background:rgba(133,92,214,0.06); color:var(--accent-primary); }
    .pselector-main { font-size:0.88rem; font-weight:700; display:flex; align-items:center; gap:0.4rem; }
    .pselector-price { font-size:1rem; font-weight:800; margin-top:0.15rem; }
    .save-chip { background:#10b981; color:#fff; font-size:0.65rem; padding:0.1rem 0.35rem; border-radius:5px; font-weight:800; }
    .mode-panel { animation:fadeIn 0.25s ease-out; }
    @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    .self-email-display { display:flex; align-items:center; gap:0.9rem; padding:1rem 1.25rem; border-radius:14px; background:rgba(133,92,214,0.04); border:1.5px solid rgba(133,92,214,0.2); margin-bottom:1.5rem; }
    .sedf-icon { font-size:1.8rem; flex-shrink:0; }
    .sedf-info { display:flex; flex-direction:column; flex:1; min-width:0; }
    .sedf-label { font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-muted); }
    .sedf-val { font-size:0.95rem; font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .badge-green { flex-shrink:0; background:rgba(16,185,129,0.12); color:#059669; font-size:0.8rem; font-weight:700; padding:0.3rem 0.65rem; border-radius:8px; }
    .gift-desc { font-size:0.9rem; color:var(--text-secondary); margin:0 0 1.25rem; line-height:1.55; }
    .email-wrap { display:flex; align-items:center; gap:0.6rem; padding:0.75rem 1rem; border-radius:14px; border:2px solid var(--glass-border); background:var(--bg-secondary); margin-bottom:0.75rem; transition:border-color 0.2s; }
    .email-wrap:focus-within { border-color:var(--accent-primary); background:#fff; }
    .email-wrap.found { border-color:#10b981; }
    .email-wrap.notfound { border-color:#ef4444; }
    .input-icon { flex-shrink:0; color:var(--text-muted); }
    .text-input { flex:1; border:none; background:transparent; font-size:0.95rem; font-weight:500; color:var(--text-primary); outline:none; font-family:inherit; }
    .text-input::placeholder { color:var(--text-muted); }
    .feedback-msg { font-size:0.85rem; font-weight:600; margin:0 0 1rem; padding:0.6rem 0.9rem; border-radius:10px; }
    .feedback-msg.success { background:rgba(16,185,129,0.08); color:#047857; border:1px solid rgba(16,185,129,0.2); }
    .feedback-msg.warning { background:rgba(245,158,11,0.08); color:#d97706; border:1px solid rgba(245,158,11,0.2); }
    .feedback-msg.error { background:rgba(239,68,68,0.08); color:#b91c1c; border:1px solid rgba(239,68,68,0.2); }
    
    /* Coupon Toggle Checkbox Styles */
    .coupon-toggle-row { display: flex; align-items: center; }
    .checkbox-container { display: flex; align-items: center; gap: 0.6rem; font-size: 0.9rem; font-weight: 600; color: var(--text-secondary); cursor: pointer; user-select: none; }
    .checkbox-container input { cursor: pointer; width: 18px; height: 18px; accent-color: var(--accent-primary); }

    /* Step 3 — Discount */
    .price-summary-box { background:var(--bg-secondary); border:1.5px solid var(--glass-border); border-radius:16px; padding:1.1rem 1.25rem; margin-bottom:1.5rem; transition:all 0.3s; }
    .price-summary-box.discounted { border-color:rgba(16,185,129,0.4); background:rgba(16,185,129,0.04); }
    .price-row { display:flex; justify-content:space-between; align-items:center; padding:0.3rem 0; }
    .price-label { font-size:0.88rem; font-weight:600; color:var(--text-secondary); }
    .price-val { font-size:0.95rem; font-weight:700; color:var(--text-primary); }
    .price-val.crossed { text-decoration:line-through; color:var(--text-muted); }
    .green { color:#059669 !important; }
    .bold { font-weight:800 !important; color:var(--text-primary) !important; }
    .purple { color:var(--accent-primary) !important; font-size:1.1rem !important; }
    .price-divider { height:1px; background:rgba(16,185,129,0.2); margin:0.5rem 0; }
    .discount-row .price-val { font-size:0.9rem; }
    .coupon-section { margin-bottom:1.5rem; }
    .coupon-label { display:block; font-size:0.88rem; font-weight:700; color:var(--text-primary); margin-bottom:0.6rem; }
    .optional-tag { font-weight:500; color:var(--text-muted); font-size:0.82rem; }
    .coupon-input-row { display:flex; gap:0.65rem; align-items:stretch; }
    .coupon-wrap { flex:1; display:flex; align-items:center; gap:0.6rem; padding:0.75rem 1rem; border-radius:14px; border:2px solid var(--glass-border); background:var(--bg-secondary); transition:border-color 0.2s; }
    .coupon-wrap:focus-within { border-color:var(--accent-primary); background:#fff; }
    .coupon-wrap.valid { border-color:#10b981; background:rgba(16,185,129,0.04); }
    .coupon-wrap.invalid { border-color:#ef4444; }
    .coupon-icon { flex-shrink:0; color:var(--text-muted); }
    .coupon-text { flex:1; font-size:0.95rem; font-weight:700; letter-spacing:0.08em; }
    .coupon-status-icon { font-size:1.1rem; flex-shrink:0; }
    .btn-apply-coupon { padding:0 1.25rem; border:none; background:var(--accent-primary); color:#fff; border-radius:12px; font-weight:800; font-size:0.9rem; cursor:pointer; transition:all 0.2s; white-space:nowrap; }
    .btn-apply-coupon:hover:not([disabled]) { filter:brightness(1.1); transform:translateY(-1px); }
    .btn-apply-coupon[disabled] { opacity:0.5; cursor:not-allowed; }
    .coupon-feedback { font-size:0.85rem; font-weight:600; margin:0.6rem 0 0; padding:0.5rem 0.8rem; border-radius:8px; }
    .coupon-feedback.success { color:#047857; background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.2); }
    .coupon-feedback.error { color:#b91c1c; background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.2); }

    /* Checkout */
    .btn-checkout { width:100%; padding:1rem; border:none; background:linear-gradient(135deg,#7c3aed 0%,#5b21b6 100%); color:#fff; border-radius:14px; font-weight:800; font-size:1rem; cursor:pointer; transition:all 0.25s ease; box-shadow:0 4px 15px rgba(124,58,237,0.35); display:flex; align-items:center; justify-content:center; }
    .btn-checkout.big { font-size:1.05rem; padding:1.1rem; }
    .btn-checkout:hover:not([disabled]) { filter:brightness(1.1); transform:translateY(-2px); box-shadow:0 8px 24px rgba(124,58,237,0.45); }
    .btn-checkout[disabled] { opacity:0.5; cursor:not-allowed; transform:none; }

    .secure-checkout-text { text-align:center; margin:1.25rem 0 0; font-size:0.8rem; color:var(--text-muted); font-weight:600; }
    .loading-dots::after { content:'...'; animation:dotPulse 1.4s infinite; }
    @keyframes dotPulse { 0%,20%{content:'.'} 40%{content:'..'} 60%,100%{content:'...'} }

    @media (max-width:768px) {
      .pricing-cards { grid-template-columns:1fr; gap:1.25rem; }
      .pricing-modal-container { padding:2rem 1.25rem 1.25rem; }
      .pricing-header h2 { font-size:1.5rem; }
    }
  `]
})
export class PricingModalComponent implements OnInit {
  private paymentService = inject(PaymentService);
  private firestoreService = inject(FirestoreService);

  currentStep = signal<ModalStep>('plans');
  recipientMode = signal<RecipientMode>('self');
  billingCycle = signal<'monthly' | 'yearly'>('monthly');
  loadingCheckout = signal<boolean>(false);
  cameFromHome = signal<boolean>(false);

  // Gift flow
  giftEmail = '';
  giftTargetUid = '';
  emailStatus = signal<EmailStatus>('idle');
  recipientPlan = signal<'free' | 'premium'>('free');
  private emailDebounce: any = null;

  // Coupon flow
  couponCode = '';
  couponStatus = signal<CouponStatus>('idle');
  couponResult = signal<CouponValidationResponse | null>(null);
  couponFeedbackMsg = signal<string>('');
  hasDiscountCode = signal<boolean>(false);

  isPro = () => this.firestoreService.profileSignal()?.plan === 'premium';
  currentUserEmail = () => (this.firestoreService.profileSignal() as any)?.email || 'tu cuenta';

  ngOnInit() {
    // Sync initial billing cycle selection
    this.billingCycle.set(this.paymentService.selectedPlanType());

    if (this.paymentService.skipPlanStep()) {
      this.cameFromHome.set(true);
      this.currentStep.set('recipient');
    }
  }

  formatPrice(n: number): string {
    return n.toLocaleString('es-CL');
  }

  setBilling(cycle: 'monthly' | 'yearly') { this.billingCycle.set(cycle); }

  onPlanChange(cycle: 'monthly' | 'yearly') {
    this.billingCycle.set(cycle);
    // Re-validate existing coupon for new plan
    if (this.couponCode.trim() && this.couponStatus() === 'valid') {
      this.couponStatus.set('idle');
      this.couponResult.set(null);
      this.applyCoupon();
    }
  }

  goToRecipient() { this.currentStep.set('recipient'); }

  goBack() { this.currentStep.set('plans'); this.resetGiftState(); }

  closeModal() {
    this.paymentService.closePricingModal();
    this.currentStep.set('plans');
    this.cameFromHome.set(false);
    this.resetGiftState();
    this.resetCouponState();
  }

  setMode(mode: RecipientMode) { this.recipientMode.set(mode); this.resetGiftState(); }

  toggleDiscountCode() {
    this.hasDiscountCode.set(!this.hasDiscountCode());
    if (!this.hasDiscountCode()) {
      this.resetCouponState();
    }
  }

  private resetGiftState() {
    this.giftEmail = ''; this.giftTargetUid = '';
    this.emailStatus.set('idle');
    this.recipientPlan.set('free');
    if (this.emailDebounce) clearTimeout(this.emailDebounce);
  }

  private resetCouponState() {
    this.couponCode = '';
    this.couponStatus.set('idle');
    this.couponResult.set(null);
    this.couponFeedbackMsg.set('');
  }

  // ── Email lookup ──
  onEmailInput() {
    this.emailStatus.set('idle'); this.giftTargetUid = '';
    this.recipientPlan.set('free');
    if (this.emailDebounce) clearTimeout(this.emailDebounce);
    const t = this.giftEmail.trim().toLowerCase();
    if (!t || !t.includes('@')) return;
    this.emailDebounce = setTimeout(() => this.lookupEmail(t), 600);
  }

  private async lookupEmail(email: string) {
    this.emailStatus.set('checking');
    try {
      const uid = await this.firestoreService.findUidByEmail(email);
      if (uid) {
        this.giftTargetUid = uid;
        
        // Fetch recipient profile to check if they already have premium
        this.firestoreService.getUserProfile(true, uid).subscribe({
          next: (profile) => {
            if (profile) {
              this.recipientPlan.set(profile.plan);
            } else {
              this.recipientPlan.set('free');
            }
            this.emailStatus.set('found');
          },
          error: () => {
            this.recipientPlan.set('free');
            this.emailStatus.set('found');
          }
        });
      } else {
        this.emailStatus.set('not_found');
      }
    } catch {
      this.emailStatus.set('not_found');
    }
  }

  // ── Coupon ──
  onCouponInput() {
    this.couponStatus.set('idle');
    this.couponResult.set(null);
    this.couponFeedbackMsg.set('');
  }

  applyCoupon() {
    const code = this.couponCode.trim();
    if (!code) return;
    this.couponStatus.set('checking');
    this.paymentService.validateCoupon(code, this.billingCycle()).subscribe({
      next: (res) => {
        this.couponResult.set(res);
        if (res.valid) {
          this.couponStatus.set('valid');
        } else {
          this.couponStatus.set('invalid');
          this.couponFeedbackMsg.set(res.message);
        }
      },
      error: () => {
        this.couponStatus.set('invalid');
        this.couponFeedbackMsg.set('Error al verificar el código. Intenta de nuevo.');
        this.couponResult.set(null);
      }
    });
  }

  // ── Checkout ──
  proceedCheckout() {
    this.loadingCheckout.set(true);
    const returnUrl = window.location.origin + '/pago-resultado';
    const plan = this.billingCycle();
    const targetUid = this.recipientMode() === 'gift' ? this.giftTargetUid : undefined;
    const couponCode = this.couponStatus() === 'valid' ? this.couponCode.trim().toUpperCase() : undefined;

    this.paymentService.createWebpayTransaction(plan, returnUrl, targetUid, couponCode).subscribe({
      next: (res) => {
        const form = document.createElement('form');
        form.method = 'POST'; form.action = res.url;
        const input = document.createElement('input');
        input.type = 'hidden'; input.name = 'token_ws'; input.value = res.token;
        form.appendChild(input); document.body.appendChild(form); form.submit();
      },
      error: (err) => {
        this.loadingCheckout.set(false);
        const errMsg = err.error?.message || err.message || 'Error de conexión';
        alert('Hubo un problema al iniciar el pago: ' + errMsg);
      }
    });
  }
}
