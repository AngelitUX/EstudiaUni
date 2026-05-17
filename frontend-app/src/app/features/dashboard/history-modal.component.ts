import { Component, inject, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, ActivityEntry } from '../../core/services/dashboard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="close.emit()">
      <div class="modal-container glass-card" (click)="$event.stopPropagation()">
        <div class="modal-topbar">
          <h2>Historial Completo de Actividad</h2>
          <button class="btn-close" (click)="close.emit()">✕</button>
        </div>
        
        <div class="modal-content">
          <div class="activity-list" *ngIf="activities.length > 0; else noActivity">
            <div *ngFor="let act of activities" 
                 class="activity-item" 
                 [class.clickable]="act.type === 'ensayo' || act.type === 'mente-veloz'"
                 (click)="onActivityClick(act)">
              <span class="activity-icon">{{ act.type === 'leccion' ? '✅' : (act.type === 'mente-veloz' ? '⚡' : '📝') }}</span>
              <div class="activity-info">
                <span class="activity-title">{{ act.title }}</span>
                <span class="activity-time">{{ getRelativeTime(act.timestamp) }}</span>
              </div>
              <div class="activity-right">
                <span class="clickable-badge" *ngIf="act.type === 'ensayo' || act.type === 'mente-veloz'">Ver Resultados →</span>
                <span class="activity-score" *ngIf="act.score !== undefined">
                  {{ act.type === 'leccion' ? act.score + '%' : (act.type === 'mente-veloz' ? act.totalCorrect + ' correctas' : act.totalCorrect + '/' + act.totalQuestions) }}
                </span>
              </div>
            </div>
          </div>
          <ng-template #noActivity>
            <div class="empty-state">
              <span class="empty-icon">🕐</span>
              <p>Tu historial está vacío. ¡Completa lecciones o ensayos para registrar tu actividad!</p>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay { position: fixed; inset: 0; z-index: 9000; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.55); backdrop-filter: blur(12px); animation: fadeOverlay 0.25s ease; }
    @keyframes fadeOverlay { from { opacity: 0 } to { opacity: 1 } }
    .modal-container { position: relative; width: min(800px, 94vw); max-height: 85vh; display: flex; flex-direction: column; background: #ffffff; padding: 0; border-radius: 18px; overflow: hidden; animation: slideUp 0.3s cubic-bezier(0.16,1,0.3,1); }
    @keyframes slideUp { from { opacity: 0; transform: translateY(32px) scale(0.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
    
    .modal-topbar { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 2px solid var(--glass-border); background: #f8f9fc; }
    .modal-topbar h2 { margin: 0; font-size: 1.2rem; font-weight: 800; color: var(--text-primary); }
    .btn-close { border: none; background: rgba(0,0,0,0.05); color: var(--text-secondary); width: 34px; height: 34px; border-radius: 10px; font-size: 1.1rem; cursor: pointer; transition: all 0.2s; }
    .btn-close:hover { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
    
    .modal-content { overflow-y: auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; flex: 1; }
    .modal-content::-webkit-scrollbar { width: 6px; }
    .modal-content::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 99px; }

    .activity-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .activity-item { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.25rem; background: #ffffff; border: 2px solid var(--glass-border); border-radius: 14px; transition: all 0.2s; }
    .activity-item.clickable { cursor: pointer; border-color: rgba(133,92,214,0.3); }
    .activity-item.clickable:hover { background: var(--bg-secondary); border-color: var(--accent-primary); transform: translateX(4px); box-shadow: var(--shadow-sm); }
    
    .activity-icon { font-size: 1.35rem; background: var(--bg-secondary); width: 46px; height: 46px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .activity-info { flex: 1; display: flex; flex-direction: column; min-width: 0; }
    .activity-title { font-size: 1rem; font-weight: 700; color: var(--text-primary); display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
    .activity-time { font-size: 0.85rem; color: var(--text-muted); font-weight: 500; margin-top: 0.25rem; }
    .activity-right { display: flex; align-items: center; gap: 1rem; }
    .activity-score { font-weight: 800; color: var(--accent-primary); font-size: 1rem; background: rgba(133,92,214,0.25); padding: 0.35rem 0.85rem; border-radius: 99px; }
    .clickable-badge { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; background: var(--accent-primary); color: #fff; padding: 0.3rem 0.7rem; border-radius: 8px; opacity: 0.9; box-shadow: 0 2px 8px rgba(133,92,214,0.2); }

    .empty-state { text-align: center; padding: 3rem 1rem; color: var(--text-secondary); display: flex; flex-direction: column; align-items: center; gap: 1rem; }
    .empty-icon { font-size: 3rem; opacity: 0.8; }
  `]
})
export class HistoryModalComponent implements OnInit {
  private dashSvc = inject(DashboardService);
  private router = inject(Router);

  @Output() close = new EventEmitter<void>();

  activities: ActivityEntry[] = [];

  ngOnInit() {
    this.activities = this.dashSvc.activities();
  }

  getRelativeTime(timestamp: string): string {
    return this.dashSvc.getRelativeTime(timestamp);
  }

  onActivityClick(act: ActivityEntry) {
    if (act.type === 'ensayo') {
      const ensayoId = act.ensayoId || act.id.match(/^ensayo-(.+?)-\d+$/)?.[1];
      if (ensayoId) {
        this.router.navigate(['/ensayo', ensayoId, 'review'], {
          queryParams: { intento: act.intentoId }
        });
        this.close.emit();
      }
    } else if (act.type === 'mente-veloz') {
      this.router.navigate(['/mente-veloz'], {
        queryParams: { historyId: act.id }
      });
      this.close.emit();
    }
  }
}
