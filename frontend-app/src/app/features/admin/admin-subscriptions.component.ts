import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PaymentService, TransactionRecord } from '../../core/services/payment.service';

@Component({
  selector: 'app-admin-subscriptions',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="admin-layout">
      <!-- SIDEBAR -->
            <aside class="sidebar">
        <div class="sidebar-header">
          <a routerLink="/dashboard" class="sidebar-logo" style="text-decoration:none; display: flex; align-items: center; justify-content: center;">
            <img src="https://res.cloudinary.com/dqm3syhwr/image/upload/f_auto,q_auto/v1/imagenes/branding/LogoEstudiaUni" alt="EstudiaUni" class="sidebar-logo-img" />
          </a>
          <div class="admin-panel-tag">ADMIN PANEL</div>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/admin" class="nav-item">
            <span class="nav-icon">📋</span>
            <span class="nav-text">Pool de Preguntas</span>
          </a>
          <a routerLink="/admin/suscripciones" class="nav-item active">
            <span class="nav-icon">💳</span>
            <span class="nav-text">Suscripciones y Pagos</span>
          </a>
          <a routerLink="/admin/recursos" class="nav-item">
            <img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_RecursosAdicionales.svg" alt="Recursos Adicionales" class="nav-icon-img"/>
            <span class="nav-text">Recursos</span>
          </a>
          <a routerLink="/admin/bugs" class="nav-item">
            <span class="nav-icon">🐛</span>
            <span class="nav-text">Reportes de Bug</span>
          </a>
        </nav>

        <div class="sidebar-footer" style="padding: 1.25rem 0.75rem; margin-top: auto;">
          <a class="nav-item logout-btn-sidebar" routerLink="/dashboard">
            <img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_Inicio.svg" alt="Inicio" class="nav-icon-img"/>
            <span class="nav-text">Dashboard</span>
          </a>
        </div>
      </aside>

      <!-- MAIN CONTENT -->
      <main class="main-content animate-fade-in-down">
        <!-- HEADER -->
        <header class="content-header">
          <div class="header-left">
            <h1>Suscripciones y Pagos 👑</h1>
            <p class="subtitle">Gestiona transacciones, aprueba transferencias y concede Plan Pro a usuarios</p>
          </div>
          <div class="header-actions">
            <button class="btn-refresh" (click)="loadData()" [disabled]="loading()">
              {{ loading() ? '⏳' : '🔄' }} Actualizar
            </button>
            <button class="btn-create" (click)="grantModalOpen.set(true)">
              👑 Conceder PRO Manual
            </button>
          </div>
        </header>

        <!-- FILTROS Y TABS -->
        <div class="admin-tabs-row">
          <button class="atab" [class.active]="filterTab() === 'all'" (click)="filterTab.set('all')">
            Todas ({{ transactions().length }})
          </button>
          <button class="atab" [class.active]="filterTab() === 'pending_approval'" (click)="filterTab.set('pending_approval')">
            🏛️ Transferencias por Aprobar ({{ countPendingTransfers() }})
          </button>
          <button class="atab" [class.active]="filterTab() === 'flow'" (click)="filterTab.set('flow')">
            💳 Flow
          </button>
        </div>

        <!-- NOTIFICACIÓN DE ESTADO -->
        <div class="status-msg success" *ngIf="actionMsg()">
          {{ actionMsg() }}
        </div>

        <!-- TABLA DE TRANSACCIONES -->
        <div class="table-container glass-card" *ngIf="!loading()">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Método</th>
                <th>Orden / Comprobante</th>
                <th>Monto</th>
                <th>Plan</th>
                <th>Usuario Pagador / Destino</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let tx of filteredTransactions()">
                <td class="date-cell">{{ formatDate(tx.createdAt) }}</td>
                <td>
                  <span class="badge-type" [class.flow]="tx.type === 'flow'" [class.transfer]="tx.type === 'transfer'">
                    {{ tx.type === 'flow' ? '💳 Flow' : '🏛️ Transferencia' }}
                  </span>
                </td>
                <td class="font-mono">
                  {{ tx.subscriptionId || tx.transferNumber || tx.id }}
                  <span *ngIf="tx.bankName" class="bank-tag">({{ tx.bankName }})</span>
                </td>
                <td class="amount-cell">$ {{ formatPrice(tx.amount) }}</td>
                <td>
                  <span class="plan-tag" [class.yearly]="tx.planType === 'yearly'">
                    {{ tx.planType === 'yearly' ? 'Anual 👑' : 'Mensual' }}
                  </span>
                </td>
                <td class="user-cell">
                  <div class="user-info">
                    <span class="user-email">{{ tx.payerEmail || tx.recipientUid || tx.payerUid }}</span>
                    <span class="user-subtext" *ngIf="tx.payerEmail && tx.recipientUid">UID: {{ tx.recipientUid }}</span>
                  </div>
                </td>
                <td>
                  <span class="status-chip" [ngClass]="tx.status">
                    {{ formatStatus(tx.status) }}
                  </span>
                </td>
                <td>
                  <div class="action-btn-row" *ngIf="tx.type === 'transfer' && tx.status === 'pending_approval'">
                    <button class="btn-approve-sm" (click)="approveTransfer(tx.id)" title="Aprobar Transferencia y dar PRO">🟢 Aprobar</button>
                    <button class="btn-reject-sm" (click)="rejectTransfer(tx.id)" title="Rechazar Comprobante">🔴 Rechazar</button>
                  </div>
                  <span *ngIf="tx.status !== 'pending_approval'" class="done-text">---</span>
                </td>
              </tr>
              <tr *ngIf="filteredTransactions().length === 0">
                <td colspan="8" class="empty-table-cell">
                  No se encontraron transacciones en esta categoría.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- MODAL CONCEDER PLAN PRO MANUAL -->
        <div class="modal-overlay" *ngIf="grantModalOpen()" (click)="closeGrantModal()">
          <div class="modal-card glass-modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>👑 Otorgar o Extender Plan Pro Manualmente</h3>
              <button class="btn-close" (click)="closeGrantModal()">×</button>
            </div>
            <p class="modal-subtitle">Busca a un estudiante por correo o UID para activarle acceso Premium.</p>

            <div class="form-group">
              <label>Correo Electrónico o UID del Usuario:</label>
              <input type="text" class="input-styled" placeholder="ejemplo&#64;estudiauni.cl" [(ngModel)]="grantEmail" />
            </div>

            <div class="form-group">
              <label>Duración del Plan Pro:</label>
              <select class="input-styled" [(ngModel)]="grantDurationMonths">
                <option [ngValue]="1">1 Mes ($9.990)</option>
                <option [ngValue]="3">3 Meses</option>
                <option [ngValue]="6">6 Meses</option>
                <option [ngValue]="12">1 Año completo ($69.990)</option>
              </select>
            </div>

            <div class="form-group">
              <label>Motivo / Observación (opcional):</label>
              <input type="text" class="input-styled" placeholder="Ej: Pago verificado manualmente por soporte" [(ngModel)]="grantReason" />
            </div>

            <div class="modal-actions-row">
              <button class="btn-cancel" (click)="closeGrantModal()">Cancelar</button>
              <button class="btn-grant-action" (click)="executeGrant()" [disabled]="!grantEmail.trim() || submitting()">
                {{ submitting() ? 'Procesando...' : '🚀 Activar Plan PRO' }}
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  `,
  styles: [`
    @keyframes floatLogo { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
    .sidebar-logo-img { width: 230px; height: auto; object-fit: contain; margin: 28px auto 0 auto; filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.2)); animation: floatLogo 3.5s ease-in-out infinite; }
    .mobile-logo-img { width: 160px; height: auto; object-fit: contain; margin: 12px auto 0 auto; animation: floatLogo 3.5s ease-in-out infinite; }
    :host { display: block; min-height: 100vh; background: #fafafa; color: var(--text-primary); font-family: 'Inter', system-ui, sans-serif; }
    .text-gradient { background: var(--gradient-brand); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

    .admin-layout { display: flex; min-height: 100vh; }
    .sidebar { width: 260px; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(20px); border-right: 1px solid rgba(133,92,214,0.15); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; height: 100vh; z-index: 100; }
    .sidebar-header { height: 110px; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid rgba(255,255,255,0.15); padding: 0 1rem; box-sizing: border-box; }
    
    .admin-panel-tag { font-size: 0.65rem; background: rgba(139, 92, 246, 0.25); color: #c084fc; padding: 0.2rem 0.6rem; border-radius: 99px; margin-top: 0.5rem; font-weight: 800; }
    
    .sidebar-nav { padding: 1rem 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; }
    .nav-item { display: flex; align-items: center; gap: 0.85rem; padding: 0.9rem 1.1rem; border-radius: 12px; color: var(--text-primary); text-decoration: none; font-size: 1.05rem; font-weight: 500; }
    .nav-item:hover { background: rgba(133,92,214,0.08); }
    .nav-item.active { background: rgba(133,92,214,0.15); color: var(--accent-primary); border-left: 3.5px solid var(--accent-primary); font-weight: 700; }
    .nav-icon { font-size: 1.35rem; width: 32px; display: flex; justify-content: center; }
    .logout-btn-sidebar { color: #ef4444 !important; opacity: 0.8; }

    .main-content { flex: 1; margin-left: 260px; padding: 2.5rem; max-width: calc(100% - 260px); background: #fafafa; }
    .content-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; gap: 1.5rem; }
    .content-header h1 { font-size: 2.5rem; font-weight: 800; margin: 0; }
    .subtitle { font-size: 1.05rem; color: var(--text-secondary); margin: 0.4rem 0 0; }
    .header-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }

    .btn-refresh { padding: 0.75rem 1.25rem; border-radius: 12px; border: 2px solid var(--glass-border); background: #ffffff; color: var(--text-secondary); font-weight: 700; cursor: pointer; }
    .btn-create { padding: 0.75rem 1.5rem; border-radius: 12px; border: none; background: linear-gradient(135deg, #7c3aed, #5b21b6); color: #fff; font-weight: 700; cursor: pointer; box-shadow: 0 4px 12px rgba(124,58,237,0.3); }

    .admin-tabs-row { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .atab { padding: 0.65rem 1.2rem; border-radius: 12px; border: 1.5px solid var(--glass-border); background: #fff; color: var(--text-secondary); font-weight: 700; cursor: pointer; }
    .atab.active { border-color: var(--accent-primary); background: rgba(133,92,214,0.08); color: var(--accent-primary); }

    .status-msg.success { background: rgba(16,185,129,0.1); color: #047857; padding: 0.85rem 1.25rem; border-radius: 12px; border: 1px solid rgba(16,185,129,0.3); margin-bottom: 1.5rem; font-weight: 600; }

    .table-container { background: #fff; border-radius: 20px; border: 2px solid var(--glass-border); overflow-x: auto; box-shadow: var(--shadow-sm); }
    .admin-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem; }
    .admin-table th { padding: 1rem 1.25rem; background: var(--bg-secondary); color: var(--text-muted); font-weight: 700; text-transform: uppercase; font-size: 0.75rem; border-bottom: 2px solid var(--glass-border); }
    .admin-table td { padding: 1rem 1.25rem; border-bottom: 1px solid var(--glass-border); vertical-align: middle; }
    .font-mono { font-family: monospace; font-size: 0.88rem; }
    .amount-cell { font-weight: 800; color: #059669; }
    .date-cell { color: var(--text-muted); font-size: 0.82rem; }
    .bank-tag { font-size: 0.78rem; color: var(--text-muted); font-weight: normal; }

    .badge-type { padding: 0.25rem 0.6rem; border-radius: 6px; font-weight: 700; font-size: 0.78rem; }
    .badge-type.flow { background: rgba(59,130,246,0.1); color: #2563eb; }
    .badge-type.transfer { background: rgba(245,158,11,0.1); color: #d97706; }

    .plan-tag { padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.75rem; font-weight: 700; background: var(--bg-secondary); color: var(--text-secondary); }
    .plan-tag.yearly { background: rgba(212,175,55,0.15); color: #b87e00; }

    .status-chip { padding: 0.3rem 0.75rem; border-radius: 99px; font-size: 0.78rem; font-weight: 800; display: inline-block; }
    .status-chip.paid, .status-chip.completed, .status-chip.approved { background: rgba(16,185,129,0.12); color: #059669; }
    .status-chip.pending_approval { background: rgba(245,158,11,0.15); color: #b45309; }
    .status-chip.failed, .status-chip.rejected { background: rgba(239,68,68,0.12); color: #b91c1c; }

    .action-btn-row { display: flex; gap: 0.5rem; }
    .btn-approve-sm { padding: 0.35rem 0.75rem; border-radius: 8px; border: none; background: #10b981; color: #fff; font-weight: 700; font-size: 0.8rem; cursor: pointer; }
    .btn-reject-sm { padding: 0.35rem 0.75rem; border-radius: 8px; border: none; background: #ef4444; color: #fff; font-weight: 700; font-size: 0.8rem; cursor: pointer; }
    .done-text { color: var(--text-muted); font-size: 0.8rem; }

    .empty-table-cell { text-align: center; padding: 3rem; color: var(--text-muted); }

    /* Modal */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(8px); z-index: 999; display: flex; align-items: center; justify-content: center; padding: 1rem; }
    .glass-modal { background: #fff; border-radius: 24px; padding: 2rem; width: min(500px, 100%); border: 2px solid var(--glass-border); box-shadow: var(--shadow-lg); }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
    .modal-header h3 { margin: 0; font-size: 1.25rem; font-weight: 800; }
    .btn-close { border: none; background: transparent; font-size: 1.5rem; cursor: pointer; color: var(--text-muted); }
    .modal-subtitle { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.5rem; }
    .form-group { margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: 0.4rem; }
    .form-group label { font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); }
    .input-styled { padding: 0.75rem 1rem; border-radius: 12px; border: 2px solid var(--glass-border); background: var(--bg-secondary); font-size: 0.95rem; outline: none; }
    .input-styled:focus { border-color: var(--accent-primary); background: #fff; }
    .modal-actions-row { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; }
    .btn-cancel { padding: 0.75rem 1.25rem; border-radius: 12px; border: 2px solid var(--glass-border); background: transparent; color: var(--text-secondary); font-weight: 700; cursor: pointer; }
    .btn-grant-action { padding: 0.75rem 1.5rem; border-radius: 12px; border: none; background: linear-gradient(135deg,#7c3aed,#5b21b6); color: #fff; font-weight: 800; cursor: pointer; }

    /* RESPONSIVE */
    @media (max-width: 1024px) {
      .admin-layout { flex-direction: column; }
      .sidebar { position: relative; width: 100%; height: auto; border-right: none; }
      .main-content { margin-left: 0; padding: 1.5rem; max-width: 100%; }
      .content-header { flex-direction: column; }
      .admin-table { min-width: 800px; }
    }
    @media (max-width: 480px) {
      .main-content { padding: 1rem; }
      .content-header h1 { font-size: 1.7rem; }
      .header-actions { width: 100%; }
      .header-actions .btn-refresh,
      .header-actions .btn-create { flex: 1 1 auto; text-align: center; }
      .admin-tabs-row { width: 100%; }
      .atab { flex: 1 1 auto; font-size: 0.82rem; padding: 0.6rem 0.8rem; }
      .glass-modal { padding: 1.25rem; }
      .modal-actions-row { flex-direction: column-reverse; }
      .modal-actions-row button { width: 100%; }
    }
  `]
})
export class AdminSubscriptionsComponent implements OnInit {
  private paymentService = inject(PaymentService);

  loading = signal<boolean>(false);
  submitting = signal<boolean>(false);
  transactions = signal<TransactionRecord[]>([]);
  filterTab = signal<'all' | 'pending_approval' | 'flow'>('all');
  actionMsg = signal<string>('');

  // Modal grant
  grantModalOpen = signal<boolean>(false);
  grantEmail = '';
  grantDurationMonths = 1;
  grantReason = '';

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    this.paymentService.getAdminTransactions().subscribe({
      next: (res) => {
        this.transactions.set(res || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('[AdminSubscriptions] Error loading transactions:', err);
        this.loading.set(false);
      }
    });
  }

  countPendingTransfers(): number {
    return this.transactions().filter(t => t.type === 'transfer' && t.status === 'pending_approval').length;
  }

  filteredTransactions(): TransactionRecord[] {
    const tab = this.filterTab();
    if (tab === 'pending_approval') {
      return this.transactions().filter(t => t.status === 'pending_approval');
    }
    if (tab === 'flow') {
      return this.transactions().filter(t => t.type === 'flow');
    }
    return this.transactions();
  }

  formatDate(dateVal: any): string {
    if (!dateVal) return '---';
    const d = new Date(dateVal);
    return d.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  formatPrice(n: number): string {
    return (n || 0).toLocaleString('es-CL');
  }

  formatStatus(status: string): string {
    switch (status) {
      case 'paid': return 'Cobrado (Flow)';
      case 'approved': return 'Aprobado (Transferencia)';
      case 'pending_approval': return 'Pendiente de Revisión';
      case 'rejected': return 'Rechazado';
      case 'failed': return 'Fallido';
      default: return status || 'Pendiente';
    }
  }

  approveTransfer(transferId: string) {
    if (!confirm('¿Confirmas aprobar esta transferencia y otorgar el Plan PRO al estudiante?')) return;
    this.paymentService.adminApproveTransfer({ transferId, action: 'approve' }).subscribe({
      next: (res) => {
        this.actionMsg.set(res.message);
        this.loadData();
        setTimeout(() => this.actionMsg.set(''), 5000);
      },
      error: (err) => alert('Error al aprobar: ' + (err.error?.message || err.message))
    });
  }

  rejectTransfer(transferId: string) {
    const reason = prompt('Indica el motivo del rechazo del comprobante:');
    if (reason === null) return;
    this.paymentService.adminApproveTransfer({ transferId, action: 'reject', rejectionReason: reason }).subscribe({
      next: (res) => {
        this.actionMsg.set('Transferencia rechazada.');
        this.loadData();
        setTimeout(() => this.actionMsg.set(''), 5000);
      },
      error: (err) => alert('Error al rechazar: ' + (err.error?.message || err.message))
    });
  }

  closeGrantModal() {
    this.grantModalOpen.set(false);
    this.grantEmail = '';
    this.grantDurationMonths = 1;
    this.grantReason = '';
  }

  executeGrant() {
    if (!this.grantEmail.trim()) return;
    this.submitting.set(true);

    this.paymentService.adminGrantSubscription({
      targetEmailOrUid: this.grantEmail.trim(),
      durationMonths: this.grantDurationMonths,
      reason: this.grantReason.trim(),
    }).subscribe({
      next: (res) => {
        this.submitting.set(false);
        this.actionMsg.set(res.message);
        this.closeGrantModal();
        this.loadData();
        setTimeout(() => this.actionMsg.set(''), 6000);
      },
      error: (err) => {
        this.submitting.set(false);
        alert('Error al conceder Plan PRO: ' + (err.error?.message || err.message));
      }
    });
  }
}
