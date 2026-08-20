import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from './services/admin.service';
import { AdminSidebarComponent } from './admin-sidebar.component';

@Component({
  selector: 'app-admin-bugs',
  standalone: true,
  imports: [CommonModule, RouterLink, AdminSidebarComponent],
  providers: [DatePipe],
  template: `
    <div class="admin-layout">
      <app-admin-sidebar></app-admin-sidebar>

      <!-- MAIN CONTENT -->
      <main class="admin-main-content animate-fade-in-down">
        <header class="content-header">
          <div class="header-left">
            <h1>Reportes de Bugs y Sugerencias</h1>
            <p class="subtitle">Gestiona los problemas y comentarios reportados por los usuarios</p>
          </div>
          <div class="header-actions">
            <button class="btn-refresh" (click)="loadReports()" [disabled]="loading()">
              {{ loading() ? '⏳' : '🔄' }} Actualizar
            </button>
          </div>
        </header>

        <!-- LOADING -->
        <div class="loading-state" *ngIf="loading()">
          <div class="spinner"></div>
          <p>Cargando reportes...</p>
        </div>

        <!-- EMPTY STATE -->
        <div class="empty-state glass-card" *ngIf="!loading() && reports().length === 0">
          <div class="empty-icon">🎉</div>
          <h3>Todo en orden</h3>
          <p>No hay reportes ni sugerencias pendientes.</p>
        </div>

        <!-- REPORTS LIST -->
        <div class="report-list" *ngIf="!loading() && reports().length > 0">
          <div class="report-card glass-card-simple" *ngFor="let rep of reports()">
            <div class="card-header">
              <div class="card-badges">
                <span class="badge-type" [class.badge-bug]="rep.type === 'Bug'" [class.badge-sug]="rep.type === 'Sugerencia'" [class.badge-otro]="rep.type === 'Otro'">
                  {{ getIcon(rep.type) }} {{ rep.type }}
                </span>
                <span class="badge-status" [class.status-resolved]="rep.status === 'Resuelto'" [class.status-pending]="rep.status === 'Pendiente'">
                  {{ rep.status }}
                </span>
              </div>
              <div class="card-actions">
                <button *ngIf="rep.status === 'Pendiente'" class="btn-icon" title="Marcar como Resuelto" (click)="resolveReport(rep.id)">✅</button>
                <button class="btn-icon btn-danger" title="Eliminar" (click)="deleteReport(rep.id)">🗑️</button>
              </div>
            </div>

            <div class="card-body">
              <h3 class="report-title">{{ rep.title }}</h3>
              <p class="report-desc">{{ rep.description }}</p>
            </div>

            <div class="card-footer">
              <span class="card-date">📅 {{ formatDate(rep.timestamp) }}</span>
              <span class="card-uid">👤 UID: {{ rep.uid }}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: #fafafa; color: var(--text-primary); }

    .admin-layout { display: flex; min-height: 100vh; }

    /* MAIN CONTENT */
    .admin-main-content { flex: 1; margin-left: 260px; padding: 2.5rem; background: #fafafa; }
    .content-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2.5rem; gap: 1.5rem; }
    .content-header h1 { font-family: var(--font-heading); font-size: 2.8rem; font-weight: 800; margin: 0; color: var(--text-primary); letter-spacing: -0.03em; }
    .subtitle { font-size: 1.15rem; color: var(--text-secondary); margin: 0.5rem 0 0; font-weight: 500; }
    
    .btn-refresh { padding: 0.75rem 1.25rem; border-radius: 12px; border: 2px solid var(--glass-border); background: #ffffff; color: var(--text-secondary); font-size: 0.95rem; font-weight: 700; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 0.5rem; }
    .btn-refresh:hover { border-color: rgba(133,92,214,0.4); color: var(--accent-primary); box-shadow: var(--shadow-sm); }
    
    /* LOADING & SPIN */
    .loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 6rem 2rem; color: var(--text-secondary); }
    .spinner { width: 44px; height: 44px; border: 4px solid rgba(133,92,214,0.15); border-top-color: var(--accent-primary); border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 1rem; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* EMPTY STATE */
    .empty-state { text-align: center; padding: 5rem 2rem; }
    .empty-icon { font-size: 4rem; margin-bottom: 1rem; opacity: 0.8; }
    .empty-state h3 { font-size: 1.5rem; margin: 0 0 0.5rem; color: var(--text-primary); font-weight: 800; }
    .empty-state p { font-size: 1rem; color: var(--text-secondary); margin: 0; font-weight: 500; }

    /* REPORT CARDS */
    .report-list { display: flex; flex-direction: column; gap: 1.25rem; }
    .glass-card-simple { background: #ffffff; border: 2px solid var(--glass-border); border-radius: 20px; padding: 1.75rem; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: var(--shadow-sm); }
    .glass-card-simple:hover { border-color: rgba(133,92,214,0.35); transform: translateY(-2px); box-shadow: var(--shadow-md); }

    .card-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 1rem; border-bottom: 1px dashed var(--glass-border); margin-bottom: 1.25rem; gap: 1rem; }
    .card-badges { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    
    .badge-type, .badge-status { font-size: 0.75rem; font-weight: 700; padding: 0.35rem 0.8rem; border-radius: 8px; }
    .badge-bug { background: rgba(239,68,68,0.12); color: #dc2626; }
    .badge-sug { background: rgba(59,130,246,0.12); color: #2563eb; }
    .badge-otro { background: rgba(107,114,128,0.12); color: #4b5563; }
    
    .status-pending { background: rgba(245,158,11,0.12); color: #d97706; border: 1px solid rgba(245,158,11,0.2); }
    .status-resolved { background: rgba(16,185,129,0.12); color: #059669; border: 1px solid rgba(16,185,129,0.2); }

    .card-actions { display: flex; gap: 0.5rem; }
    .btn-icon { width: 36px; height: 36px; border-radius: 10px; border: 2px solid var(--glass-border); background: #ffffff; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1rem; transition: all 0.2s; }
    .btn-icon:hover { background: var(--bg-secondary); border-color: rgba(0,0,0,0.15); transform: scale(1.05); }
    .btn-icon.btn-danger:hover { background: #fee2e2; border-color: #fca5a5; color: #ef4444; }

    .card-body { margin-bottom: 1.25rem; }
    .report-title { font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin: 0 0 0.5rem; }
    .report-desc { font-size: 0.95rem; color: var(--text-secondary); margin: 0; line-height: 1.6; white-space: pre-wrap; }

    .card-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px dashed var(--glass-border); font-size: 0.8rem; color: var(--text-muted); font-weight: 600; }

    /* RESPONSIVE */
    @media (max-width: 1024px) {
      .admin-layout { flex-direction: column; }
      .admin-main-content { margin-left: 0; padding: 1.5rem; }
      .content-header { flex-direction: column; gap: 1.25rem; }
    }
    @media (max-width: 600px) {
      .content-header h1 { font-size: 2rem; }
    }
    @media (max-width: 480px) {
      .admin-main-content { padding: 1rem; }
      .content-header h1 { font-size: 1.6rem; }
      .subtitle { font-size: 1rem; }
      .card-header { flex-direction: column; align-items: flex-start; }
      .card-actions { align-self: flex-end; }
      .card-footer { flex-direction: column; align-items: flex-start; gap: 0.35rem; }
      .glass-card-simple { padding: 1.1rem; }
    }
  `]
})
export class AdminBugsComponent implements OnInit {
  adminSvc = inject(AdminService);
  datePipe = inject(DatePipe);

  reports = signal<any[]>([]);
  loading = signal(false);

  ngOnInit() {
    this.loadReports();
  }

  async loadReports() {
    this.loading.set(true);
    const data = await this.adminSvc.getBugReports();
    this.reports.set(data);
    this.loading.set(false);
  }

  async resolveReport(id: string) {
    if (confirm('¿Marcar como resuelto?')) {
      await this.adminSvc.updateBugReportStatus(id, 'Resuelto');
      this.loadReports();
    }
  }

  async deleteReport(id: string) {
    if (confirm('¿Estás seguro de eliminar este reporte?')) {
      await this.adminSvc.deleteBugReport(id);
      this.loadReports();
    }
  }

  getIcon(type: string): string {
    if (type === 'Bug') return '🐛';
    if (type === 'Sugerencia') return '💡';
    return '📝';
  }

  formatDate(timestamp: any): string {
    if (!timestamp) return '';
    let d: Date;
    if (typeof timestamp.toDate === 'function') d = timestamp.toDate();
    else d = new Date(timestamp);
    return this.datePipe.transform(d, 'dd MMM yyyy, HH:mm') || '';
  }
}
