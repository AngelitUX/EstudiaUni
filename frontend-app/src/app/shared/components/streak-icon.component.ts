import { Component, inject, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/services/dashboard.service';
import { FirestoreService } from '../../core/services/firestore.service';
import { AdminService } from '../../features/admin/services/admin.service';
import { PaymentService } from '../../core/services/payment.service';

@Component({
  selector: 'app-streak-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="streak-icons-wrapper" (click)="openStreakModal()">
      <!-- Normal Streak -->
      <div class="header-streak-icon" [class.active]="dashSvc.streakDays() > 0">
        <span class="streak-emoji">🔥</span>
        <span class="streak-count" *ngIf="dashSvc.streakDays() > 0">{{ dashSvc.streakDays() }}</span>
      </div>

      <!-- Super Streak (PRO only) -->
      <div class="header-streak-icon super-streak" *ngIf="isProPlan()" [class.active]="dashSvc.superStreakDays() > 0">
        <span class="streak-emoji">🔥</span>
        <span class="streak-count" *ngIf="dashSvc.superStreakDays() > 0">{{ dashSvc.superStreakDays() }}</span>
      </div>
      <div class="header-streak-icon super-streak locked" *ngIf="!isProPlan()" (click)="openSuperStreakUpsell($event)" title="Súper Racha — exclusivo PRO">
        <span class="streak-emoji">🔥</span>
        <span class="streak-lock">🔒</span>
      </div>

      <!-- Hover Tooltip -->
      <div class="streak-hover-tooltip">
        <div class="metric-card glass-card combined-streak-card">
          <div class="metric-header" style="justify-content: center; gap: 0.5rem;">
            <span class="metric-label">Tus Rachas Activas</span>
            <span class="metric-icon">🔥</span>
          </div>
          <div class="metric-body streaks-container">
            <div class="streak-item normal-streak">
              <div class="streak-icon-wrap">🔥</div>
              <div class="streak-details">
                <div class="streak-value">{{ dashSvc.streakDays() }} <span class="streak-label">días</span></div>
                <div class="streak-name">Racha de estudio</div>
              </div>
            </div>
            
            <div class="streak-item super-streak" *ngIf="isProPlan()">
              <div class="streak-icon-wrap" style="filter: hue-rotate(190deg) saturate(150%) brightness(1.2);">🔥</div>
              <div class="streak-details">
                <div class="streak-value">{{ dashSvc.superStreakDays() }} <span class="streak-label">días</span></div>
                <div class="streak-name">Súper racha</div>
              </div>
            </div>
            <div class="streak-item super-streak locked" *ngIf="!isProPlan()">
              <div class="streak-icon-wrap" style="filter: grayscale(100%);">🔒</div>
              <div class="streak-details">
                <div class="streak-name">Súper racha — exclusivo PRO</div>
              </div>
            </div>
          </div>
          
          <div class="weekly-calendar">
            <div *ngFor="let day of weekDays; let i = index" class="week-day" [class.active]="weeklyActivity[i]" [class.today]="i === todayWeekIndex">
              <span class="week-day-label">{{ day }}</span>
              <span class="week-day-dot" [class.filled]="weeklyActivity[i]">{{ weeklyActivity[i] ? '✓' : '' }}</span>
            </div>
          </div>
          <div class="metric-footer">
            <span class="metric-subtext" *ngIf="dashSvc.superStreakDays() > 0">⚡ ¡Imparable! Dominando al máximo.</span>
            <span class="metric-subtext" *ngIf="dashSvc.streakDays() > 0 && dashSvc.superStreakDays() === 0">🔥 Vas muy bien.</span>
            <span class="metric-subtext" *ngIf="dashSvc.streakDays() === 0">Inicia tu racha hoy.</span>
          </div>
          <div class="click-hint">
            Haz clic para ver cómo funcionan 👆
          </div>
        </div>
      </div>
    </div>

    <div class="modal-overlay" *ngIf="dashSvc.showStreakModalState()" (click)="dashSvc.showStreakModalState.set(false)">
      <div class="modal-container glass streak-info-modal animate-scale-up" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>¿Cómo funcionan las Rachas?</h2>
          <button class="close-btn" (click)="dashSvc.showStreakModalState.set(false)">✕</button>
        </div>
        <div class="modal-body">
          <div class="info-section">
            <div class="info-icon normal">🔥</div>
            <div class="info-content">
              <h3>Racha de Estudio</h3>
              <p>Es tu constancia diaria. Se suma cada día que completas al menos <strong>una lección</strong> o <strong>un ensayo</strong>.</p>
              <span class="info-tip">💡 Tip: ¡Basta con 10 minutos al día para mantenerla viva!</span>
            </div>
          </div>

          <div class="info-divider"></div>

          <div class="info-section">
            <div class="info-icon super" style="filter: hue-rotate(190deg) saturate(150%) brightness(1.2);">🔥</div>
            <div class="info-content">
              <h3>Súper Racha</h3>
              <p>Es el máximo nivel de disciplina. Se suma únicamente si logras:</p>
              <ul>
                <li>Completar al menos <strong>una lección</strong> de <strong>CADA materia</strong> activa en tu ruta de aprendizaje durante el mismo día.</li>
              </ul>
              <span class="info-tip" *ngIf="isProPlan()">🚀 Reto: ¡Mantener esta racha te garantiza un progreso masivo!</span>
              <span class="info-tip" *ngIf="!isProPlan()">👑 La Súper Racha es exclusiva del Plan PRO. <a (click)="paymentService.openPricingModal()" style="cursor:pointer; text-decoration: underline;">Mejora tu plan</a> para empezar a acumularla.</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-primary-modal" (click)="dashSvc.showStreakModalState.set(false)">¡Entendido!</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .streak-icons-wrapper {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      margin-right: 1rem;
      cursor: pointer;
      user-select: none;
    }
    
    .streak-icons-wrapper::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      height: 20px;
    }

    .header-streak-icon {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      filter: grayscale(100%) opacity(40%);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .streak-icons-wrapper:hover .header-streak-icon {
      transform: scale(1.08);
      filter: grayscale(100%) opacity(60%);
    }

    .header-streak-icon.active {
      filter: none;
    }

    .streak-icons-wrapper:hover .header-streak-icon.active {
      filter: none;
    }

    .header-streak-icon.active .streak-emoji {
      animation: fireLoop 1.2s infinite ease-in-out;
    }

    .header-streak-icon .streak-emoji {
      font-size: 1.5rem;
      display: inline-block;
      line-height: 1;
      transform-origin: bottom center;
    }

    .header-streak-icon.super-streak.active .streak-emoji {
      filter: hue-rotate(190deg) saturate(150%) brightness(1.2);
    }

    .header-streak-icon .streak-count {
      font-size: 1.2rem;
      font-weight: 800;
      color: #f97316;
      font-family: var(--font-heading, sans-serif);
    }

    .header-streak-icon.super-streak.active .streak-count {
      color: #3b82f6;
    }

    .header-streak-icon.super-streak.locked {
      filter: grayscale(100%) opacity(35%);
      position: relative;
    }
    .streak-lock { font-size: 0.75rem; margin-left: 0.1rem; }
    .streak-item.super-streak.locked { opacity: 0.7; }

    @keyframes fireLoop {
      0% { transform: scale(1) rotate(-5deg); }
      50% { transform: scale(1.15) rotate(5deg); }
      100% { transform: scale(1) rotate(-5deg); }
    }

    /* Hover Tooltip */
    .streak-hover-tooltip {
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translate(-50%, 15px);
      margin-top: 12px;
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: none;
      z-index: 1000;
      width: 320px;
    }

    .streak-icons-wrapper:hover .streak-hover-tooltip {
      opacity: 1;
      visibility: visible;
      transform: translate(-50%, 0);
      pointer-events: auto; /* Allow hovering inside the tooltip */
    }

    /* Combined Streak Card Styles */
    .metric-card { padding: 1.25rem 1.4rem; border-radius: 16px; display: flex; flex-direction: column; background: #ffffff; border: 2px solid var(--glass-border) !important; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
    .metric-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
    .metric-label { font-size: 1.1rem; color: #374151; font-weight: 800; }
    .metric-icon { font-size: 1.4rem; }
    
    .combined-streak-card .metric-body { flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: stretch; gap: 0.75rem; padding-top: 0.2rem; }
    .streak-item { display: flex; align-items: center; gap: 0.65rem; padding: 0.55rem 0.8rem; border-radius: 12px; background: rgba(0,0,0,0.02); border: 1.5px solid var(--glass-border); transition: all 0.2s; }
    .streak-icon-wrap { font-size: 1.2rem; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 8px; }
    .normal-streak .streak-icon-wrap { background: rgba(249,115,22,0.1); color: #ea580c; }
    .super-streak .streak-icon-wrap { background: rgba(139,92,246,0.1); color: #7c3aed; }
    .streak-details { display: flex; flex-direction: column; flex: 1; }
    .streak-value { font-size: 1.4rem; font-weight: 800; font-family: var(--font-heading); line-height: 1.1; margin-bottom: 0.1rem; display: flex; align-items: baseline; gap: 0.2rem; }
    .normal-streak .streak-value { background: linear-gradient(135deg, #f97316, #ea580c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .super-streak .streak-value { background: linear-gradient(135deg, #8b5cf6, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .streak-label { font-size: 0.8rem; font-weight: 700; color: #4b5563; -webkit-text-fill-color: initial; }
    .streak-name { font-size: 0.72rem; color: #4b5563; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    
    .weekly-calendar { display: flex; justify-content: space-between; gap: 0.25rem; padding: 0.35rem 0.15rem 0; margin-top: 0.75rem; border-top: 1.5px solid var(--glass-border); }
    .week-day { display: flex; flex-direction: column; align-items: center; gap: 0.15rem; flex: 1; }
    .week-day-label { font-size: 0.65rem; font-weight: 800; color: #4b5563; text-transform: uppercase; letter-spacing: 0.03em; }
    .week-day-dot { width: 20px; height: 20px; border-radius: 50%; border: 1.5px solid var(--glass-border); display: flex; align-items: center; justify-content: center; font-size: 0.62rem; font-weight: 800; color: transparent; transition: all 0.3s; background: rgba(0,0,0,0.02); }
    .week-day-dot.filled { background: linear-gradient(135deg, #10b981, #34d399); border-color: #10b981; color: #fff; box-shadow: 0 2px 8px rgba(16,185,129,0.25); }
    .week-day.today .week-day-label { color: var(--accent-primary); font-weight: 800; }
    .week-day.today .week-day-dot:not(.filled) { border-color: var(--accent-primary); border-style: dashed; background: rgba(133,92,214,0.05); }
    
    .metric-footer { margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1.5px solid var(--glass-border); text-align: center; }
    .metric-subtext { color: #4b5563; font-size: 0.82rem; font-weight: 600; display: block; }

    .click-hint {
      margin-top: 0.75rem;
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--accent-primary);
      text-align: center;
      background: rgba(133, 92, 214, 0.08);
      padding: 0.4rem;
      border-radius: 8px;
    }

    /* Modal Styles */
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(8, 10, 18, 0.6); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 99999 !important; padding: 1.5rem; animation: fadeIn 0.25s ease both; }
    .modal-container.glass { background: rgba(255,255,255,0.95); border: 2px solid var(--glass-border); border-radius: 24px; box-shadow: 0 20px 50px rgba(0,0,0,0.25); width: 100%; overflow: hidden; }
    .streak-info-modal { max-width: 500px !important; margin: auto !important; }
    .modal-header { padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--glass-border); }
    .modal-header h2 { margin: 0; font-size: 1.25rem; font-weight: 800; color: var(--text-primary); }
    .close-btn { border: none; background: var(--bg-secondary); color: var(--text-secondary); width: 34px; height: 34px; border-radius: 10px; font-size: 1.1rem; cursor: pointer; display: grid; place-items: center; transition: all 0.2s; line-height: 1; }
    .close-btn:hover { background: rgba(239,68,68,0.25); color: #fca5a5 !important; }
    .modal-body { padding: 1.5rem; }
    .modal-footer { padding: 1.5rem; border-top: 1px solid var(--glass-border); }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.95) translateY(15px); } to { opacity: 1; transform: scale(1) translateY(0); } }
    .animate-scale-up { animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
    .info-section { display: flex; gap: 1.25rem; align-items: flex-start; padding: 0.5rem 0; text-align: left; }
    .info-icon { font-size: 2.5rem; width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; border-radius: 16px; flex-shrink: 0; }
    .info-icon.normal { background: rgba(249,115,22,0.1); }
    .info-icon.super { background: rgba(139,92,246,0.1); }
    .info-content { text-align: left; }
    .info-content h3 { margin: 0 0 0.5rem 0; font-size: 1.2rem; color: var(--text-primary); }
    .info-content p { margin: 0 0 0.75rem 0; font-size: 0.95rem; line-height: 1.5; color: var(--text-secondary); }
    .info-content ul { margin: 0 0 0.75rem 0; padding-left: 1.2rem; font-size: 0.9rem; color: var(--text-secondary); text-align: left; }
    .info-content li { margin-bottom: 0.4rem; }
    .info-tip { display: block; font-size: 0.85rem; font-weight: 700; color: var(--accent-primary); background: rgba(133,92,214,0.08); padding: 0.6rem 0.85rem; border-radius: 8px; border-left: 3px solid var(--accent-primary); text-align: left; }
    .info-divider { height: 1.5px; background: var(--glass-border); margin: 1.25rem 0; opacity: 0.6; }
    .btn-primary-modal { font-family: inherit; width: 100%; padding: 0.85rem; border-radius: 12px; background: var(--accent-primary); color: white; border: none; font-weight: 700; cursor: pointer; transition: all 0.2s; }
    .btn-primary-modal:hover { filter: brightness(1.1); transform: translateY(-2px); }
  `]
})
export class StreakIconComponent {
  public dashSvc = inject(DashboardService);
  private firestoreService = inject(FirestoreService);
  private adminService = inject(AdminService);
  public paymentService = inject(PaymentService);

  isProPlan = computed(() => {
    const p = this.firestoreService.profileSignal();
    return p?.plan === 'premium' || this.adminService.isAdmin();
  });

  openSuperStreakUpsell(event: Event) {
    event.stopPropagation();
    this.paymentService.openPricingModal();
  }

  // Weekly streak calendar
  weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  weeklyActivity: boolean[] = [false, false, false, false, false, false, false];
  todayWeekIndex = (() => {
    const d = new Date().getDay();
    return d === 0 ? 6 : d - 1; // Mon=0...Sun=6
  })();

  constructor() {
    // Keep weekly activity updated reactively
    effect(() => {
      if (this.dashSvc.getWeeklyActivity) {
        this.weeklyActivity = this.dashSvc.getWeeklyActivity();
      }
    });
  }

  openStreakModal() {
    this.dashSvc.showStreakModalState.set(true);
  }
}
