import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService, CouponValidationResponse } from '../../core/services/payment.service';
import { FirestoreService } from '../../core/services/firestore.service';
import { environment } from '../../../environments/environment';

type ModalStep = 'plans' | 'recipient';
type RecipientMode = 'self' | 'gift';
type PaymentMethodOption = 'flow' | 'transfer';
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

        <!-- ─────────────── STEP 1: Plan Selection ─────────────── -->
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

          <p class="secure-checkout-text">🔒 Suscripción 100% segura a través de Flow o Transferencia Bancaria</p>
        </ng-container>

        <!-- ─────────────── STEP 2: Recipient, Method & Plan ─────────────── -->
        <ng-container *ngIf="currentStep() === 'recipient'">
          <div class="flow-step">
            <!-- Back Button -->
            <button class="btn-back" *ngIf="!cameFromHome()" (click)="goBack()">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              Volver a los planes
            </button>

            <div class="step-header">
              <img class="step-icon-wrap" src="assets/images/Nuevos VideosEIlustraciones/IconosAVIF/P_Pro.avif" alt="Plan PRO" />
              <h2>¿Para quién es el Plan Pro?</h2>
              <p>Elige si activar el Pro en tu cuenta o regalárselo a alguien más.</p>
            </div>

            <!-- Mode Tabs (Para mi / Regalar) -->
            <div class="mode-tabs">
              <button class="mode-tab" [class.active]="recipientMode() === 'self'" (click)="setMode('self')">
                <span class="tab-icon">🧑‍💻</span> Para mí
              </button>
              <button class="mode-tab gift-tab" [class.active]="recipientMode() === 'gift'" (click)="setMode('gift')">
                <span class="tab-icon">🎁</span> Regalar
              </button>
            </div>

            <!-- Plan Selector Option -->
            <div class="plan-selector-row">
              <button class="pselector-btn" [class.active]="billingCycle() === 'monthly'" (click)="onPlanChange('monthly')">
                <div class="pselector-main">Mensual</div>
                <div class="pselector-price">
                  $ {{ couponResult()?.valid && billingCycle() === 'monthly' ? formatPrice(couponResult()!.finalAmount!) : '9.990' }} /mes
                </div>
              </button>
              <button class="pselector-btn" [class.active]="billingCycle() === 'yearly'" (click)="onPlanChange('yearly')">
                <div class="pselector-main">Anual <span class="save-chip">-41%</span></div>
                <div class="pselector-price">
                  $ {{ couponResult()?.valid && billingCycle() === 'yearly' ? formatPrice(couponResult()!.finalAmount!) : '69.990' }}
                </div>
              </button>
            </div>

            <!-- Self Mode Email Display -->
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

            <!-- Gift Mode Email Input -->
            <div class="mode-panel" *ngIf="recipientMode() === 'gift'">
              <p class="gift-desc">Ingresa el correo de la persona a quien quieres regalarle el Plan Pro.</p>
              <div class="email-wrap" [class.found]="emailStatus() === 'found'" [class.notfound]="emailStatus() === 'not_found'">
                <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,12 2,6"></polyline></svg>
                <input type="email" class="text-input" placeholder="correo@ejemplo.cl" [(ngModel)]="giftEmail" (input)="onEmailInput()" [disabled]="loadingCheckout()" />
                <span class="email-status-indicator" *ngIf="emailStatus() !== 'idle'">
                  <span *ngIf="emailStatus() === 'checking'">⏳</span>
                  <span *ngIf="emailStatus() === 'found'">✅</span>
                  <span *ngIf="emailStatus() === 'not_found'">❌</span>
                </span>
              </div>
              <p class="feedback-msg success" *ngIf="emailStatus() === 'found'">
                ✅ <strong>{{ giftEmail }}</strong> — Cuenta verificada.
              </p>
              <p class="feedback-msg error" *ngIf="emailStatus() === 'not_found'">
                ❌ No encontramos una cuenta registrada con ese correo.
              </p>
            </div>

            <!-- ── PAYMENT METHOD SELECTOR ── -->
            <div class="method-selector-section" style="margin-top: 1.5rem;">
              <label class="section-label-sm">Método de Pago:</label>
              <div class="method-tabs">
                <button class="method-tab" [class.active]="paymentMethod() === 'flow'" (click)="setPaymentMethod('flow')">
                  💳 Flow <span class="sub-tag">(Tarjetas, suscripción)</span>
                </button>
                <button class="method-tab" [class.active]="paymentMethod() === 'transfer'" (click)="setPaymentMethod('transfer')">
                  🏛️ Transferencia <span class="sub-tag">(Manual)</span>
                </button>
              </div>
            </div>

            <!-- ── FLOW SUBSCRIPTION FLOW ── -->
            <div *ngIf="paymentMethod() === 'flow'">
              <!-- Coupon Toggle -->
              <div class="coupon-toggle-row" style="margin-top: 1.25rem;">
                <label class="checkbox-container">
                  <input type="checkbox" [checked]="hasDiscountCode()" (change)="toggleDiscountCode()" />
                  <span class="checkmark"></span>
                  Tengo un código de descuento
                </label>
              </div>

              <!-- Coupon Input -->
              <div class="coupon-section" *ngIf="hasDiscountCode()" style="margin-top: 1rem;">
                <div class="coupon-input-row">
                  <div class="coupon-wrap" [class.valid]="couponStatus() === 'valid'" [class.invalid]="couponStatus() === 'invalid'">
                    <input type="text" class="text-input coupon-text" placeholder="Ej: PAES2026" [(ngModel)]="couponCode" (input)="onCouponInput()" [disabled]="loadingCheckout()" style="text-transform:uppercase;" />
                  </div>
                  <button class="btn-apply-coupon" (click)="applyCoupon()" [disabled]="!couponCode.trim() || couponStatus() === 'checking' || loadingCheckout()">
                    Aplicar
                  </button>
                </div>
                <p class="coupon-feedback success" *ngIf="couponStatus() === 'valid'">{{ couponResult()?.message }}</p>
                <p class="coupon-feedback error" *ngIf="couponStatus() === 'invalid'">{{ couponFeedbackMsg() }}</p>
              </div>

              <!-- Price breakdown if coupon valid -->
              <div class="price-summary-box discounted" *ngIf="couponResult()?.valid" style="margin-top: 1.25rem;">
                <div class="price-row">
                  <span class="price-label">Precio base</span>
                  <span class="price-val crossed">$ {{ billingCycle() === 'monthly' ? '9.990' : '69.990' }}</span>
                </div>
                <div class="price-row discount-row">
                  <span class="price-label green">Descuento</span>
                  <span class="price-val green">-$ {{ formatPrice(couponResult()!.discountAmount!) }}</span>
                </div>
                <div class="price-divider"></div>
                <div class="price-row total-row">
                  <span class="price-label bold">Total</span>
                  <span class="price-val bold purple">$ {{ formatPrice(couponResult()!.finalAmount!) }}</span>
                </div>
              </div>

              <button class="btn-checkout big" style="margin-top: 1.5rem;" (click)="proceedCheckout()" [disabled]="loadingCheckout() || (recipientMode() === 'gift' && emailStatus() !== 'found')">
                <span *ngIf="!loadingCheckout()">
                  {{ couponResult()?.valid
                    ? 'Suscribirme por $' + formatPrice(couponResult()!.finalAmount!) + ' con Flow 🔒'
                    : 'Suscribirme con Flow 🔒'
                  }}
                </span>
                <span *ngIf="loadingCheckout()" class="loading-dots">Conectando con Flow</span>
              </button>
              <p class="secure-checkout-text">🔒 Suscripción con renovación automática ({{ billingCycle() === 'monthly' ? 'mensual' : 'anual' }}) — cancela cuando quieras</p>
            </div>

            <!-- ── MANUAL TRANSFER FLOW ── -->
            <div *ngIf="paymentMethod() === 'transfer'" style="margin-top: 1.25rem;">
              <div class="bank-details-box">
                <h4>🏛️ Datos para Transferencia Bancaria:</h4>
                <div class="bank-grid">
                  <div><strong>Banco:</strong> Banco de Chile / BancoEstado</div>
                  <div><strong>Tipo de Cuenta:</strong> Cuenta Vista / Corriente</div>
                  <div><strong>N° de Cuenta:</strong> 77-654321-0</div>
                  <div><strong>RUT:</strong> 77.654.321-K</div>
                  <div><strong>Nombre:</strong> EstudiaUni SpA</div>
                  <div><strong>Correo Pagos:</strong> pagos&#64;estudiauni.cl</div>
                </div>
                <p class="bank-amount-notice">
                  Monto exacto a transferir: <strong>$ {{ couponResult()?.valid ? formatPrice(couponResult()!.finalAmount!) : (billingCycle() === 'monthly' ? '9.990' : '69.990') }} CLP</strong>
                </p>
              </div>

              <div class="transfer-warning-box">
                <span class="twb-icon">⚠️</span>
                <ul>
                  <li>La activación <strong>no es inmediata</strong> — un administrador revisa tu comprobante a mano, puede tardar algunas horas.</li>
                  <li>Esto <strong>no es una suscripción</strong>: es un pago único por {{ billingCycle() === 'monthly' ? '1 mes' : '1 año' }}. No se te cobrará de nuevo automáticamente.</li>
                  <li>Cuando termine ese período, <strong>todas las funciones PRO se bloquean</strong> otra vez hasta que hagas una nueva transferencia.</li>
                </ul>
              </div>

              <div class="transfer-form" *ngIf="!transferSubmitted()">
                <div class="form-row-sm">
                  <label>Banco Emisor (tu banco):</label>
                  <input type="text" class="text-input-styled" placeholder="Ej: BancoEstado, Santander, Falabella" [(ngModel)]="bankName" />
                </div>
                <div class="form-row-sm">
                  <label>N° de Comprobante o Transferencia:</label>
                  <input type="text" class="text-input-styled" placeholder="Ej: 123456789" [(ngModel)]="transferNumber" />
                </div>

                <div class="form-row-sm">
                  <label>Comprobante de la Transferencia:</label>
                  <div class="receipt-upload-box" *ngIf="!receiptPreview()">
                    <input type="file" id="receipt-input" accept="image/*" (change)="onReceiptFileSelected($event)" style="display:none;" />
                    <label for="receipt-input" class="receipt-upload-trigger">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                      <span>Sube una foto o captura de tu comprobante</span>
                    </label>
                  </div>
                  <div class="receipt-preview-box" *ngIf="receiptPreview()">
                    <img [src]="receiptPreview()" alt="Comprobante subido" />
                    <button type="button" class="btn-remove-receipt" (click)="removeReceipt()">🗑️ Quitar</button>
                  </div>
                  <p class="receipt-error" *ngIf="receiptError()">{{ receiptError() }}</p>
                </div>

                <button class="btn-checkout big" style="margin-top: 1.25rem; background: linear-gradient(135deg, #059669, #047857);" (click)="submitTransferReport()" [disabled]="loadingCheckout() || !bankName.trim() || !transferNumber.trim() || !receiptPreview() || (recipientMode() === 'gift' && emailStatus() !== 'found')">
                  <span *ngIf="!loadingCheckout()">📤 Notificar Transferencia</span>
                  <span *ngIf="loadingCheckout()" class="loading-dots">Enviando comprobante</span>
                </button>
              </div>

              <div class="transfer-success-box" *ngIf="transferSubmitted()">
                <div class="ts-icon">🎉</div>
                <h4>¡Comprobante de Transferencia Recibido!</h4>
                <p>El equipo de EstudiaUni verificará tu transferencia N° <strong>{{ transferNumber }}</strong> y activará el Plan Pro en breve.</p>
                <button class="btn-cancel" style="margin-top: 1rem; width: 100%;" (click)="closeModal()">Entendido, cerrar</button>
              </div>
            </div>

          </div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    @keyframes floatLogo { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
    .sidebar-logo-img { width: 230px; height: auto; object-fit: contain; margin: 28px auto 0 auto; filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.2)); animation: floatLogo 3.5s ease-in-out infinite; }
    .mobile-logo-img { width: 160px; height: auto; object-fit: contain; margin: 12px auto 0 auto; animation: floatLogo 3.5s ease-in-out infinite; }
    .pricing-modal-overlay {
      /* Rendered at the app root and opened from inside other feature modals
         (e.g. the "listo para iniciar" / cooldown modals, which reach up to
         z-index 100000), so it must always win the stacking order regardless
         of what else is open underneath it. */
      position: fixed; inset: 0; z-index: 999999; display: flex; align-items: center;
      justify-content: center; background: rgba(0,0,0,0.6); backdrop-filter: blur(16px);
      padding: 1rem; overflow-y: auto;
    }
    .pricing-modal-container {
      position: relative; width: min(880px,100%); border-radius: 24px; background: #fff;
      border: 2px solid var(--glass-border); box-shadow: 0 25px 60px rgba(0,0,0,0.25);
      padding: 2.5rem 2rem 2rem; color: var(--text-primary); max-height: 94vh; overflow-y: auto;
    }
    .btn-close-pricing {
      position: absolute; top: 1.25rem; right: 1.25rem; border: none;
      background: var(--bg-secondary); color: var(--text-secondary);
      width: 36px; height: 36px; border-radius: 10px; font-size: 1.15rem;
      cursor: pointer; display: grid; place-items: center; transition: all 0.2s; z-index: 2;
    }
    .btn-close-pricing:hover { background: rgba(239,68,68,0.2); color:#ef4444; }

    .pricing-header { text-align:center; margin-bottom:2rem; }
    .crown-icon { font-size:2.5rem; display:inline-block; }
    .pricing-header h2 { margin:0.5rem 0; font-size:1.8rem; font-weight:800; }
    .pricing-subtitle { margin:0 auto 1.5rem; color:var(--text-secondary); max-width:580px; font-size:0.98rem; }
    .billing-switcher { display:inline-flex; background:var(--bg-secondary); padding:0.35rem; border-radius:14px; border:1px solid var(--glass-border); gap:0.25rem; }
    .billing-switcher button { border:none; background:transparent; color:var(--text-secondary); padding:0.5rem 1.25rem; border-radius:10px; font-weight:700; font-size:0.9rem; cursor:pointer; }
    .billing-switcher button.active { background:#fff; color:var(--accent-primary); box-shadow:var(--shadow-sm); }
    .discount-badge { background:#10b981; color:#fff; font-size:0.72rem; padding:0.15rem 0.45rem; border-radius:6px; font-weight:800; }
    .pricing-cards { display:grid; grid-template-columns:1fr 1fr; gap:1.75rem; margin-bottom:1.5rem; }
    .pricing-card { background:#fff; border:2px solid var(--glass-border); border-radius:20px; padding:2rem; display:flex; flex-direction:column; position:relative; }
    .pro-card { border-color:#d4af37; background:linear-gradient(to bottom,#fff,rgba(254,243,199,0.25)); }
    .glowing-gold-border { box-shadow:0 0 20px rgba(212,175,55,0.15); }
    .popular-ribbon { position:absolute; top:1rem; right:1rem; background:linear-gradient(135deg,#FFE885 0%,#E6A100 50%,#B87E00 100%); color:#fff; font-size:0.7rem; font-weight:800; padding:0.3rem 0.75rem; border-radius:99px; }
    .plan-tag-small { display:inline-block; font-size:0.72rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); background:var(--bg-secondary); padding:0.2rem 0.6rem; border-radius:6px; margin-bottom:0.4rem; }
    .premium-tag-small { background:rgba(212,175,55,0.15); color:#b87e00; }
    .card-header h3 { margin:0; font-size:1.4rem; font-weight:800; }
    .text-gold-gradient { background:linear-gradient(135deg,#d4af37 0%,#b87e00 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
    .card-desc { margin:0.35rem 0 1.25rem; font-size:0.88rem; color:var(--text-secondary); }
    .card-price { display:flex; align-items:baseline; gap:0.2rem; margin-bottom:0.25rem; }
    .currency { font-size:1.3rem; font-weight:800; }
    .amount { font-size:2.2rem; font-weight:900; }
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
    .btn-pro-action { width:100%; padding:0.95rem; border:none; background:linear-gradient(135deg,#FFE885 0%,#E6A100 50%,#B87E00 100%); color:#fff; border-radius:12px; font-weight:800; font-size:1rem; cursor:pointer; }
    .pulse-gold { animation:goldPulse 2s infinite; }
    @keyframes goldPulse { 0%{box-shadow:0 0 0 0 rgba(230,161,0,0.4)} 70%{box-shadow:0 0 0 10px rgba(230,161,0,0)} 100%{box-shadow:0 0 0 0 rgba(230,161,0,0)} }

    .flow-step { max-width:540px; margin:0 auto; }
    .btn-back { display:inline-flex; align-items:center; gap:0.4rem; border:none; background:transparent; color:var(--text-secondary); font-size:0.9rem; font-weight:600; cursor:pointer; padding:0.35rem 0.75rem; border-radius:8px; margin-bottom:1.5rem; }
    .btn-back:hover { background:var(--bg-secondary); color:var(--text-primary); }
    .step-header { text-align:center; margin-bottom:1.5rem; }
    .step-icon-wrap { width:56px; height:56px; margin:0 auto 0.5rem; display:block; filter:drop-shadow(0 2px 6px rgba(133,92,214,0.3)); }
    .step-header h2 { margin:0 0 0.5rem; font-size:1.6rem; font-weight:800; }
    .step-header p { margin:0; color:var(--text-secondary); font-size:0.95rem; }
    .mode-tabs { display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:1.25rem; background:var(--bg-secondary); padding:0.4rem; border-radius:16px; border:1px solid var(--glass-border); }
    .mode-tab { display:flex; align-items:center; justify-content:center; gap:0.6rem; border:none; background:transparent; color:var(--text-secondary); padding:0.75rem 1rem; border-radius:12px; font-weight:700; font-size:0.95rem; cursor:pointer; }
    .mode-tab.active { background:#fff; color:var(--accent-primary); box-shadow:0 2px 8px rgba(0,0,0,0.08); }
    .mode-tab.gift-tab.active { background:linear-gradient(135deg,#fdf2ff 0%,#f3e8ff 100%); color:#7c3aed; }
    .plan-selector-row { display:flex; gap:0.75rem; margin-bottom:1.25rem; }
    .pselector-btn { flex:1; padding:0.7rem 1rem; border:2px solid var(--glass-border); background:var(--bg-secondary); border-radius:12px; font-size:0.88rem; font-weight:700; color:var(--text-secondary); cursor:pointer; text-align:left; }
    .pselector-btn.active { border-color:var(--accent-primary); background:rgba(133,92,214,0.06); color:var(--accent-primary); }
    .pselector-main { font-size:0.88rem; font-weight:700; display:flex; align-items:center; gap:0.4rem; }
    .pselector-price { font-size:1rem; font-weight:800; margin-top:0.15rem; }
    .save-chip { background:#10b981; color:#fff; font-size:0.65rem; padding:0.1rem 0.35rem; border-radius:5px; font-weight:800; }
    
    .self-email-display { display:flex; align-items:center; gap:0.9rem; padding:0.9rem 1.25rem; border-radius:14px; background:rgba(133,92,214,0.04); border:1.5px solid rgba(133,92,214,0.2); margin-bottom:1.25rem; }
    .sedf-icon { font-size:1.8rem; flex-shrink:0; }
    .sedf-info { display:flex; flex-direction:column; flex:1; min-width:0; }
    .sedf-label { font-size:0.75rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); }
    .sedf-val { font-size:0.95rem; font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .badge-green { flex-shrink:0; background:rgba(16,185,129,0.12); color:#059669; font-size:0.8rem; font-weight:700; padding:0.3rem 0.65rem; border-radius:8px; }
    .gift-desc { font-size:0.9rem; color:var(--text-secondary); margin:0 0 1rem; }
    .email-wrap { display:flex; align-items:center; gap:0.6rem; padding:0.75rem 1rem; border-radius:14px; border:2px solid var(--glass-border); background:var(--bg-secondary); margin-bottom:0.75rem; }
    .input-icon { flex-shrink:0; color:var(--text-muted); }
    .text-input { flex:1; border:none; background:transparent; font-size:0.95rem; font-weight:500; color:var(--text-primary); outline:none; font-family:inherit; }
    .feedback-msg { font-size:0.85rem; font-weight:600; margin:0 0 1rem; padding:0.6rem 0.9rem; border-radius:10px; }
    .feedback-msg.success { background:rgba(16,185,129,0.08); color:#047857; }
    .feedback-msg.error { background:rgba(239,68,68,0.08); color:#b91c1c; }

    /* Payment method */
    .section-label-sm { display:block; font-size:0.82rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); margin-bottom:0.5rem; }
    .method-tabs { display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:1rem; }
    .method-tab { padding:0.75rem 0.85rem; border:2px solid var(--glass-border); background:var(--bg-secondary); border-radius:14px; font-weight:700; font-size:0.9rem; color:var(--text-secondary); cursor:pointer; text-align:center; }
    .method-tab.active { border-color:var(--accent-primary); background:rgba(133,92,214,0.08); color:var(--accent-primary); }
    .sub-tag { font-size:0.75rem; font-weight:500; opacity:0.8; }

    /* Bank Details Box */
    .bank-details-box { background:rgba(16,185,129,0.05); border:1.5px solid rgba(16,185,129,0.25); border-radius:16px; padding:1.25rem; margin-bottom:1.25rem; }
    .bank-details-box h4 { margin:0 0 0.75rem; font-size:1rem; font-weight:800; color:#047857; }
    .bank-grid { display:grid; grid-template-columns:1fr 1fr; gap:0.5rem 1rem; font-size:0.88rem; color:var(--text-primary); }
    .bank-amount-notice { margin:0.85rem 0 0; font-size:0.9rem; color:#065f46; border-top:1px dashed rgba(16,185,129,0.3); padding-top:0.6rem; }

    /* Transfer warning — no subscription, manual review delay, re-lock at period end */
    .transfer-warning-box { display:flex; gap:0.75rem; background:rgba(245,158,11,0.08); border:1.5px solid rgba(245,158,11,0.3); border-radius:16px; padding:1rem 1.25rem; margin-bottom:1.25rem; }
    .twb-icon { flex-shrink:0; font-size:1.3rem; line-height:1.4; }
    .transfer-warning-box ul { margin:0; padding-left:1.1rem; display:flex; flex-direction:column; gap:0.4rem; font-size:0.85rem; color:#92400e; line-height:1.4; }
    .transfer-warning-box strong { color:#78350f; }

    /* Form inputs */
    .form-row-sm { display:flex; flex-direction:column; gap:0.35rem; margin-bottom:0.85rem; }
    .form-row-sm label { font-size:0.85rem; font-weight:700; color:var(--text-secondary); }
    .text-input-styled { padding:0.75rem 1rem; border-radius:12px; border:2px solid var(--glass-border); background:var(--bg-secondary); font-size:0.95rem; font-weight:600; color:var(--text-primary); outline:none; }
    .text-input-styled:focus { border-color:var(--accent-primary); background:#fff; }

    /* Receipt upload */
    .receipt-upload-box { }
    .receipt-upload-trigger { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:0.5rem; padding:1.5rem 1rem; border:2px dashed var(--glass-border); border-radius:14px; background:var(--bg-secondary); color:var(--text-secondary); font-size:0.88rem; font-weight:600; text-align:center; cursor:pointer; transition:all 0.2s; }
    .receipt-upload-trigger:hover { border-color:var(--accent-primary); color:var(--accent-primary); background:rgba(133,92,214,0.04); }
    .receipt-preview-box { position:relative; border-radius:14px; overflow:hidden; border:2px solid var(--glass-border); }
    .receipt-preview-box img { display:block; width:100%; max-height:260px; object-fit:contain; background:var(--bg-secondary); }
    .btn-remove-receipt { position:absolute; top:0.6rem; right:0.6rem; border:none; background:rgba(0,0,0,0.65); color:#fff; font-size:0.8rem; font-weight:700; padding:0.4rem 0.75rem; border-radius:8px; cursor:pointer; }
    .btn-remove-receipt:hover { background:rgba(239,68,68,0.85); }
    .receipt-error { margin:0.5rem 0 0; font-size:0.82rem; font-weight:600; color:#b91c1c; }

    /* Transfer Success */
    .transfer-success-box { text-align:center; padding:1.5rem 1rem; background:rgba(16,185,129,0.08); border-radius:16px; border:1.5px solid rgba(16,185,129,0.3); }
    .ts-icon { font-size:3rem; margin-bottom:0.5rem; }
    .transfer-success-box h4 { margin:0 0 0.5rem; color:#047857; font-weight:800; font-size:1.2rem; }
    .transfer-success-box p { margin:0; font-size:0.92rem; color:var(--text-secondary); line-height:1.5; }
    .btn-cancel { padding:0.85rem; border:2px solid var(--glass-border); background:#fff; color:var(--text-secondary); border-radius:12px; font-weight:700; font-size:0.92rem; cursor:pointer; }
    .btn-cancel:hover { background:var(--bg-secondary); }

    /* Coupon Toggle & Section */
    .checkbox-container { display: flex; align-items: center; gap: 0.6rem; font-size: 0.9rem; font-weight: 600; color: var(--text-secondary); cursor: pointer; }
    .price-summary-box { background:var(--bg-secondary); border:1.5px solid var(--glass-border); border-radius:16px; padding:1rem 1.25rem; margin-bottom:1.25rem; }
    .price-row { display:flex; justify-content:space-between; align-items:center; padding:0.25rem 0; }
    .price-label { font-size:0.88rem; font-weight:600; color:var(--text-secondary); }
    .price-val { font-size:0.95rem; font-weight:700; }
    .price-val.crossed { text-decoration:line-through; color:var(--text-muted); }
    .green { color:#059669 !important; }
    .bold { font-weight:800 !important; }
    .purple { color:var(--accent-primary) !important; font-size:1.1rem !important; }
    .price-divider { height:1px; background:rgba(16,185,129,0.2); margin:0.4rem 0; }
    .coupon-input-row { display:flex; gap:0.65rem; }
    .coupon-wrap { flex:1; display:flex; align-items:center; padding:0.75rem 1rem; border-radius:14px; border:2px solid var(--glass-border); background:var(--bg-secondary); }
    .coupon-text { flex:1; font-size:0.95rem; font-weight:700; letter-spacing:0.08em; }
    .btn-apply-coupon { padding:0 1.25rem; border:none; background:var(--accent-primary); color:#fff; border-radius:12px; font-weight:800; font-size:0.9rem; cursor:pointer; }
    .coupon-feedback { font-size:0.85rem; font-weight:600; margin:0.5rem 0 0; padding:0.4rem 0.8rem; border-radius:8px; }
    .coupon-feedback.success { color:#047857; background:rgba(16,185,129,0.08); }
    .coupon-feedback.error { color:#b91c1c; background:rgba(239,68,68,0.08); }

    /* Checkout */
    .btn-checkout { width:100%; padding:1rem; border:none; background:linear-gradient(135deg,#7c3aed 0%,#5b21b6 100%); color:#fff; border-radius:14px; font-weight:800; font-size:1rem; cursor:pointer; transition:all 0.25s ease; box-shadow:0 4px 15px rgba(124,58,237,0.35); display:flex; align-items:center; justify-content:center; }
    .btn-checkout.big { font-size:1.05rem; padding:1.1rem; }
    .btn-checkout:hover:not([disabled]) { filter:brightness(1.1); transform:translateY(-2px); }
    .btn-checkout[disabled] { opacity:0.5; cursor:not-allowed; }
    .secure-checkout-text { text-align:center; margin:1rem 0 0; font-size:0.8rem; color:var(--text-muted); font-weight:600; }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 1024px) {
      .pricing-modal-container { padding: 2rem 1.5rem 1.5rem; }
      .pricing-cards { gap: 1.25rem; }
      .pricing-card { padding: 1.5rem; }
    }

    @media (max-width: 768px) {
      .pricing-modal-overlay { padding: 0.5rem; align-items: flex-start; }
      .pricing-modal-container { width: 100%; border-radius: 18px; padding: 2rem 1.25rem 1.25rem; max-height: none; margin-top: 0.5rem; }
      .pricing-header h2 { font-size: 1.35rem; }
      .pricing-subtitle { font-size: 0.9rem; }
      .billing-switcher { display: flex; width: 100%; }
      .billing-switcher button { flex: 1; padding: 0.5rem 0.5rem; font-size: 0.85rem; white-space: nowrap; }
      .pricing-cards { grid-template-columns: 1fr; gap: 1rem; }
      .pricing-card { padding: 1.5rem 1.25rem; }
      .flow-step { max-width: 100%; }
      .step-header h2 { font-size: 1.3rem; }
      .mode-tabs { grid-template-columns: 1fr 1fr; }
      .mode-tab { padding: 0.7rem 0.5rem; font-size: 0.85rem; }
      .plan-selector-row { flex-direction: column; }
      .method-tabs { grid-template-columns: 1fr; }
      .bank-grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 480px) {
      .pricing-modal-container { padding: 1.75rem 1rem 1rem; }
      .btn-close-pricing { top: 0.85rem; right: 0.85rem; width: 32px; height: 32px; }
      .crown-icon { font-size: 2rem; }
      .pricing-header h2 { font-size: 1.15rem; }
      .card-header h3 { font-size: 1.2rem; }
      .amount { font-size: 1.8rem; }
      .amount-big { font-size: 1.6rem; }
      .coupon-input-row { flex-direction: column; }
      .btn-apply-coupon { padding: 0.75rem 1.25rem; }
      .self-email-display { flex-wrap: wrap; }
      .action-row, .plan-selector-row { gap: 0.5rem; }
    }

    @media (max-width: 380px) {
      .pricing-header h2 { font-size: 1.05rem; }
      .step-header h2 { font-size: 1.15rem; }
      .mode-tab { font-size: 0.78rem; padding: 0.6rem 0.4rem; }
      .mode-tab .tab-icon { display: none; }
    }
  `]
})
export class PricingModalComponent implements OnInit {
  private paymentService = inject(PaymentService);
  private firestoreService = inject(FirestoreService);

  currentStep = signal<ModalStep>('plans');
  recipientMode = signal<RecipientMode>('self');
  paymentMethod = signal<PaymentMethodOption>('flow');
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

  // Manual Transfer flow
  bankName = '';
  transferNumber = '';
  transferSubmitted = signal<boolean>(false);
  receiptPreview = signal<string | null>(null);
  receiptError = signal<string>('');

  isPro = () => this.firestoreService.profileSignal()?.plan === 'premium';
  currentUserEmail = () => (this.firestoreService.profileSignal() as any)?.email || 'tu cuenta';

  ngOnInit() {
    this.billingCycle.set(this.paymentService.selectedPlanType());
    if (this.paymentService.skipPlanStep()) {
      this.cameFromHome.set(true);
      this.currentStep.set('recipient');
    }
  }

  formatPrice(n: number): string {
    return (n || 0).toLocaleString('es-CL');
  }

  setBilling(cycle: 'monthly' | 'yearly') { this.billingCycle.set(cycle); }

  onPlanChange(cycle: 'monthly' | 'yearly') {
    this.billingCycle.set(cycle);
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
    this.resetTransferState();
  }

  setMode(mode: RecipientMode) { this.recipientMode.set(mode); this.resetGiftState(); }

  setPaymentMethod(method: PaymentMethodOption) {
    this.paymentMethod.set(method);
  }

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

  private resetTransferState() {
    this.paymentMethod.set('flow');
    this.bankName = '';
    this.transferNumber = '';
    this.transferSubmitted.set(false);
    this.receiptPreview.set(null);
    this.receiptError.set('');
  }

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
        this.emailStatus.set('found');
      } else {
        this.emailStatus.set('not_found');
      }
    } catch {
      this.emailStatus.set('not_found');
    }
  }

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

  proceedCheckout() {
    this.loadingCheckout.set(true);
    // Flow always POSTs the token back to `url_return` (never a plain GET) —
    // a static SPA route can't read a POST body, so this points at a backend
    // bridge that reads it server-side and redirects here with a query param
    // instead. See flow-webhook.controller.ts `returnFromRegistration()`.
    const returnUrl = `${environment.apiUrl}/api/subscriptions/flow/return`;
    const plan = this.billingCycle();
    const targetUid = this.recipientMode() === 'gift' ? this.giftTargetUid : undefined;
    const couponCode = this.couponStatus() === 'valid' ? this.couponCode.trim().toUpperCase() : undefined;

    this.paymentService.startFlowRegistration(plan, returnUrl, targetUid, couponCode).subscribe({
      next: (res) => {
        // Flow's documented redirect pattern: a plain GET to url?token=..., no form/POST needed.
        window.location.href = `${res.url}?token=${res.token}`;
      },
      error: (err) => {
        this.loadingCheckout.set(false);
        const errMsg = err.error?.message || err.message || 'Error de conexión';
        alert('Hubo un problema al iniciar la suscripción: ' + errMsg);
      }
    });
  }

  onReceiptFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.receiptError.set('Selecciona una imagen válida (foto o captura de pantalla).');
      input.value = '';
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      this.receiptError.set('La imagen debe ser menor a 8MB.');
      input.value = '';
      return;
    }
    this.receiptError.set('');

    // Compressed client-side to a data URL and stored directly in the
    // `manual_payments` Firestore doc as `receiptUrl` — same pattern already
    // used for profile photos (see profile-modal.component.ts). Keeps this
    // self-contained with no new upload infra, and stays well under the
    // 5mb body limit main.ts sets for this endpoint.
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxWidth = 1000;
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        this.receiptPreview.set(canvas.toDataURL('image/webp', 0.75));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
    input.value = '';
  }

  removeReceipt() {
    this.receiptPreview.set(null);
  }

  submitTransferReport() {
    if (!this.bankName.trim() || !this.transferNumber.trim() || !this.receiptPreview()) return;
    this.loadingCheckout.set(true);

    const baseAmount = this.billingCycle() === 'monthly' ? 9990 : 69990;
    const finalAmount = this.couponResult()?.valid ? this.couponResult()!.finalAmount! : baseAmount;

    const data = {
      planType: this.billingCycle(),
      bankName: this.bankName.trim(),
      transferNumber: this.transferNumber.trim(),
      amount: finalAmount,
      targetUid: this.recipientMode() === 'gift' ? this.giftTargetUid : undefined,
      couponCode: this.couponStatus() === 'valid' ? this.couponCode.trim().toUpperCase() : undefined,
      receiptUrl: this.receiptPreview() || undefined,
    };

    this.paymentService.submitManualTransfer(data).subscribe({
      next: () => {
        this.loadingCheckout.set(false);
        this.transferSubmitted.set(true);
      },
      error: (err) => {
        this.loadingCheckout.set(false);
        alert('Error al enviar comprobante: ' + (err.error?.message || err.message));
      }
    });
  }

}
