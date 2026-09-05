import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../../core/services/firestore.service';
import { PaymentService } from '../../core/services/payment.service';

const WARNING_WINDOW_DAYS = 5;
const DISMISS_KEY = 'membership_notice_dismissed_for_date';

/**
 * Warns a Plan PRO user a few days ahead of time that their "pase" (1-month
 * or 1-year, bought once with Flow or by bank transfer) is about to run
 * out — nothing auto-renews anymore, so unlike the old Flow-subscription
 * banner this replaced, there's no card being charged to warn about: the
 * point is just to remind them to buy their next pass before access lapses.
 * Reads the `endDate` already on the user's Firestore profile; shown for
 * ANY provider (flow/manual/transfer) since none of them recur.
 */
@Component({
  selector: 'app-renewal-notice-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="renewal-banner" *ngIf="visible()">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="rb-icon">
        <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <span class="rb-text">
        Tu Membresía PRO vence el <strong>{{ renewalDateLabel() }}</strong> ({{ daysLeftLabel() }}) — cómprala de nuevo antes de esa fecha para no perder tu acceso.
      </span>
      <div class="rb-actions">
        <button class="rb-btn rb-btn-settings" (click)="renewNow()">Renovar membresía</button>
        <button class="rb-btn rb-btn-dismiss" (click)="dismiss()" aria-label="Cerrar aviso">✕</button>
      </div>
    </div>
  `,
  styles: [`
    .renewal-banner {
      display:flex; align-items:center; gap:0.75rem; padding:0.75rem 1.25rem;
      background:linear-gradient(135deg, rgba(230,161,0,0.12), rgba(230,161,0,0.05));
      border:1.5px solid rgba(230,161,0,0.3); border-radius:14px; color:#7a5200;
      font-size:0.85rem; font-weight:600; margin-bottom:1.25rem;
    }
    .rb-icon { flex-shrink:0; color:#b87e00; }
    .rb-text { flex:1; min-width:0; line-height:1.4; }
    .rb-actions { display:flex; align-items:center; gap:0.5rem; flex-shrink:0; }
    .rb-btn { border:none; border-radius:8px; font-weight:700; cursor:pointer; }
    .rb-btn-settings { background:#b87e00; color:#fff; padding:0.4rem 0.85rem; font-size:0.8rem; white-space:nowrap; }
    .rb-btn-settings:hover { filter:brightness(1.08); }
    .rb-btn-dismiss { background:transparent; color:#7a5200; width:24px; height:24px; font-size:0.9rem; display:grid; place-items:center; }
    .rb-btn-dismiss:hover { background:rgba(0,0,0,0.06); }

    @media (max-width: 768px) {
      .renewal-banner { flex-wrap:wrap; padding:0.65rem 1rem; }
      .rb-text { flex:1 1 100%; order:1; }
      .rb-actions { order:2; margin-left:auto; }
    }
  `]
})
export class RenewalNoticeBannerComponent {
  private firestoreService = inject(FirestoreService);
  private paymentService = inject(PaymentService);

  private dismissedForDate = signal<string | null>(
    typeof localStorage !== 'undefined' ? localStorage.getItem(DISMISS_KEY) : null
  );

  private endDate = computed<Date | null>(() => {
    const sub = this.firestoreService.profileSignal()?.subscription;
    if (!sub?.endDate) return null;
    return typeof sub.endDate.toDate === 'function' ? sub.endDate.toDate() : new Date(sub.endDate);
  });

  private eligible = computed(() => {
    const profile = this.firestoreService.profileSignal();
    const sub = profile?.subscription;
    if (!sub) return false;
    return sub.tier === 'premium' && sub.status === 'active';
  });

  daysLeft = computed<number | null>(() => {
    const end = this.endDate();
    if (!end) return null;
    const ms = end.getTime() - Date.now();
    return Math.ceil(ms / (24 * 3600 * 1000));
  });

  daysLeftLabel = computed(() => {
    const days = this.daysLeft();
    if (days === null) return '';
    if (days <= 0) return 'vence hoy';
    if (days === 1) return 'queda 1 día';
    return `quedan ${days} días`;
  });

  visible = computed(() => {
    if (!this.eligible()) return false;
    const days = this.daysLeft();
    if (days === null || days < 0 || days > WARNING_WINDOW_DAYS) return false;
    return this.dismissedForDate() !== this.renewalDateKey();
  });

  renewalDateLabel = computed(() => {
    const end = this.endDate();
    return end ? end.toLocaleDateString('es-CL', { day: 'numeric', month: 'long' }) : '';
  });

  private renewalDateKey(): string {
    const end = this.endDate();
    return end ? end.toISOString().split('T')[0] : '';
  }

  dismiss() {
    const key = this.renewalDateKey();
    this.dismissedForDate.set(key);
    try { localStorage.setItem(DISMISS_KEY, key); } catch { /* ignore quota errors */ }
  }

  renewNow() {
    const planType = this.firestoreService.profileSignal()?.subscription?.planType || 'monthly';
    this.paymentService.openPricingModal(true, planType);
  }
}
