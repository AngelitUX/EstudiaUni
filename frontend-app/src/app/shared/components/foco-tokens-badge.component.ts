import { Component, inject, computed, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../../core/services/firestore.service';
import { AdminService } from '../../features/admin/services/admin.service';
import { PaymentService } from '../../core/services/payment.service';

/**
 * Shared "Foco: X/Y hoy" pill, used anywhere the daily Foco token count is
 * shown (exam runner, ensayo review, career finder, ...). Reads plan/usage
 * directly from FirestoreService so no inputs are needed — just drop it in.
 * Clicking it shows when the daily count resets, since that wasn't visible
 * anywhere before and support kept getting "why did my tokens disappear"
 * questions that were really just "when do they come back".
 */
@Component({
  selector: 'app-foco-tokens-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="foco-badge-wrapper">
      <button type="button" class="foco-tokens-badge" (click)="togglePopover($event)">
        💡 Foco: {{ focoRemaining() }}/{{ focoLimit() }} hoy
      </button>

      <div class="foco-reset-popover" *ngIf="showPopover()" (click)="$event.stopPropagation()">
        <div class="foco-reset-title">🕛 Reinicio de fichas</div>
        <p>Tus fichas se reinician todos los días a las <strong>00:00</strong> (hora de Chile).</p>
        <p class="foco-reset-countdown">Faltan <strong>{{ resetCountdown() }}</strong></p>
        <ng-container *ngIf="!isProPlan()">
          <div class="foco-reset-divider"></div>
          <p class="foco-upgrade-note">Con PRO tienes <strong>500 fichas al día</strong> en vez de 5.</p>
          <button type="button" class="foco-upgrade-btn" (click)="upgrade()">Actualizar a PRO 👑</button>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .foco-badge-wrapper { position: relative; display: inline-block; }
    .foco-tokens-badge {
      background: rgba(124,58,237,0.1);
      color: #7c3aed;
      font-weight: 800;
      font-size: 0.8rem;
      padding: 0.3rem 0.75rem;
      border-radius: 99px;
      border: 1px solid rgba(124,58,237,0.3);
      display: flex;
      align-items: center;
      gap: 0.3rem;
      cursor: pointer;
      font-family: inherit;
    }
    .foco-tokens-badge:hover { background: rgba(124,58,237,0.16); }

    .foco-reset-popover {
      position: absolute;
      top: calc(100% + 0.5rem);
      left: 0;
      z-index: 500;
      width: 260px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 1rem;
      box-shadow: 0 12px 30px -8px rgba(15, 23, 42, 0.25);
      text-align: left;
    }
    .foco-reset-title { font-weight: 800; font-size: 0.85rem; color: #1e293b; margin-bottom: 0.5rem; }
    .foco-reset-popover p { margin: 0 0 0.4rem; font-size: 0.82rem; color: #475569; line-height: 1.45; }
    .foco-reset-countdown { color: #1e293b !important; }
    .foco-reset-countdown strong { color: #7c3aed; font-family: monospace; font-size: 0.95rem; }
    .foco-reset-divider { height: 1px; background: #e2e8f0; margin: 0.6rem 0; }
    .foco-upgrade-note { font-size: 0.78rem !important; }
    .foco-upgrade-btn {
      width: 100%;
      margin-top: 0.25rem;
      padding: 0.55rem;
      border: none;
      border-radius: 10px;
      background: linear-gradient(135deg, #7c3aed, #4338ca);
      color: #fff;
      font-weight: 800;
      font-size: 0.8rem;
      cursor: pointer;
    }

    @media (max-width: 480px) {
      .foco-tokens-badge { font-size: 0.7rem; padding: 0.25rem 0.5rem; }
      .foco-reset-popover { width: 230px; left: auto; right: 0; }
    }
  `]
})
export class FocoTokensBadgeComponent implements OnDestroy {
  private firestoreService = inject(FirestoreService);
  private adminService = inject(AdminService);
  public paymentService = inject(PaymentService);

  showPopover = signal(false);
  resetCountdown = signal('...');
  private countdownInterval: any;
  private outsideClickHandler = () => this.showPopover.set(false);

  isProPlan = computed(() => this.firestoreService.profileSignal()?.plan === 'premium' || this.adminService.isAdmin() === true);
  focoLimit = computed(() => this.isProPlan() ? 500 : 5);
  focoUsed = computed(() => this.firestoreService.profileSignal()?.dailyCredits?.focoTokensUsedToday || 0);
  focoRemaining = computed(() => Math.max(0, this.focoLimit() - this.focoUsed()));

  togglePopover(event: Event) {
    event.stopPropagation();
    const next = !this.showPopover();
    this.showPopover.set(next);
    if (next) {
      this.updateCountdown();
      if (!this.countdownInterval) {
        this.countdownInterval = setInterval(() => this.updateCountdown(), 30000);
      }
      // Defer so this same click doesn't immediately trigger the outside-click close.
      setTimeout(() => document.addEventListener('click', this.outsideClickHandler), 0);
    } else {
      document.removeEventListener('click', this.outsideClickHandler);
    }
  }

  upgrade() {
    this.showPopover.set(false);
    this.paymentService.openPricingModal();
  }

  /**
   * Daily reset happens at Chile midnight, matching the backend's reset
   * check (getResetCredits in subscriptions.service.ts) which stamps
   * "today" using a fixed UTC-3 offset. Mirrored here so the countdown
   * shown to the user matches when the server will actually reset it.
   */
  private updateCountdown() {
    const now = new Date();
    const chileOffsetMs = -3 * 60 * 60000;
    const chileNowFrame = now.getTime() + chileOffsetMs;
    const chileNow = new Date(chileNowFrame);
    const nextMidnightChileFrame = Date.UTC(
      chileNow.getUTCFullYear(),
      chileNow.getUTCMonth(),
      chileNow.getUTCDate() + 1,
      0, 0, 0
    );
    const resetAtRealMs = nextMidnightChileFrame - chileOffsetMs;
    const msLeft = Math.max(0, resetAtRealMs - now.getTime());
    const totalMinutes = Math.floor(msLeft / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    this.resetCountdown.set(`${hours}h ${minutes}m`);
  }

  ngOnDestroy() {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    document.removeEventListener('click', this.outsideClickHandler);
  }
}
