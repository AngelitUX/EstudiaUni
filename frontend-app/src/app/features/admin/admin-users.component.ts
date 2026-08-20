import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { AdminSidebarComponent } from './admin-sidebar.component';
import { AdminUsersService, AdminUserSummary, PlanFilter } from './services/admin-users.service';
import { PaymentService } from '../../core/services/payment.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebarComponent],
  template: `
    <div class="admin-layout">
      <app-admin-sidebar></app-admin-sidebar>

      <main class="admin-main-content animate-fade-in-down">
        <header class="content-header">
          <div class="header-left">
            <h1>Usuarios 👥</h1>
            <p class="subtitle">Administra y filtra todos los usuarios registrados en la plataforma</p>
          </div>
          <div class="header-actions">
            <button class="btn-refresh" (click)="refresh()" [disabled]="loading()">
              {{ loading() ? '⏳' : '🔄' }} Actualizar
            </button>
          </div>
        </header>

        <!-- FILTROS -->
        <div class="filters-row">
          <div class="admin-tabs-row">
            <button class="atab" [class.active]="planFilter() === 'all'" (click)="setPlanFilter('all')">Todos</button>
            <button class="atab" [class.active]="planFilter() === 'free'" (click)="setPlanFilter('free')">Free</button>
            <button class="atab" [class.active]="planFilter() === 'premium'" (click)="setPlanFilter('premium')">👑 Premium</button>
          </div>
          <div class="search-box">
            <input type="email" class="input-search" placeholder="Buscar por email..."
              [ngModel]="searchInput" (ngModelChange)="onSearchInput($event)" />
            @if (searchInput) {
              <button class="btn-clear-search" (click)="clearSearch()">✕ Limpiar</button>
            }
          </div>
        </div>

        <!-- NOTIFICACIÓN DE ESTADO -->
        @if (actionMsg()) {
          <div class="status-msg success">{{ actionMsg() }}</div>
        }

        <!-- LOADING -->
        @if (loading() && users().length === 0) {
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Cargando usuarios...</p>
          </div>
        }

        <!-- EMPTY -->
        @if (!loading() && users().length === 0) {
          <div class="empty-state glass-card">
            <div class="empty-icon">🧑‍🎓</div>
            <h3>{{ activeSearch() ? 'No se encontró ningún usuario con ese email' : 'No hay usuarios para este filtro' }}</h3>
          </div>
        }

        <!-- TABLE -->
        @if (users().length > 0) {
          <div class="table-container">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Plan</th>
                  <th>Estado suscripción</th>
                  <th>Vence en</th>
                  <th>Rol</th>
                  <th>Registrado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (u of users(); track u.uid) {
                  <tr>
                    <td>
                      <div class="user-info">
                        <img [src]="u.photoURL || 'assets/images/avatars/avatar_1.png'" alt="" class="user-avatar" />
                        <span>{{ u.displayName || '(sin nombre)' }}</span>
                      </div>
                    </td>
                    <td class="font-mono">{{ u.email || '—' }}</td>
                    <td>
                      <span class="plan-tag" [class.premium]="u.plan === 'premium'">
                        {{ u.plan === 'premium' ? '👑 Premium' : 'Free' }}
                      </span>
                    </td>
                    <td>
                      <span class="status-chip" [ngClass]="u.subscriptionStatus || 'none'">
                        {{ formatSubStatus(u.subscriptionStatus) }}
                      </span>
                    </td>
                    <td>
                      @if (u.premiumDaysLeft !== null) {
                        <span class="days-left" [class.expiring-soon]="u.premiumDaysLeft <= 7">
                          {{ u.premiumDaysLeft === 0 ? 'Vence hoy' : u.premiumDaysLeft + ' días' }}
                        </span>
                      } @else {
                        <span class="done-text">—</span>
                      }
                    </td>
                    <td>
                      @if (u.isAdmin) {
                        <span class="badge-admin">🛡️ Admin</span>
                      } @else {
                        <span class="done-text">Estudiante</span>
                      }
                    </td>
                    <td class="date-cell">{{ formatDate(u.createdAt) }}</td>
                    <td>
                      <div class="action-btn-row">
                        @if (u.plan === 'premium') {
                          <button class="btn-extend-sm" (click)="openGrantModal(u)" title="Extender Premium">📅 Extender</button>
                          <button class="btn-revoke-sm" (click)="revokePremium(u)" title="Quitar Premium">🚫 Quitar</button>
                        } @else {
                          <button class="btn-grant-sm" (click)="openGrantModal(u)" title="Otorgar Premium">👑 Otorgar</button>
                        }
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          @if (nextCursor() && !activeSearch()) {
            <div class="load-more-row">
              <button class="btn-load-more" (click)="loadMore()" [disabled]="loadingMore()">
                {{ loadingMore() ? 'Cargando...' : 'Cargar más usuarios' }}
              </button>
            </div>
          }
        }
      </main>
    </div>

    <!-- MODAL OTORGAR / EXTENDER PREMIUM -->
    @if (grantModalOpen()) {
      <div class="modal-overlay" (click)="closeGrantModal()">
        <div class="modal-card glass-modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>👑 {{ grantTarget()?.plan === 'premium' ? 'Extender' : 'Otorgar' }} Plan Pro</h3>
            <button class="btn-close" (click)="closeGrantModal()">×</button>
          </div>
          <p class="modal-subtitle">{{ grantTarget()?.email || grantTarget()?.uid }}</p>

          @if (grantTarget()?.plan === 'premium') {
            <div class="form-group">
              <label>Días a extender:</label>
              <div class="days-quick-row">
                @for (d of quickDayOptions; track d) {
                  <button type="button" class="day-chip" [class.active]="extendDurationDays === d" (click)="extendDurationDays = d">{{ d }}</button>
                }
              </div>
              <input type="number" class="input-styled" min="1" step="1" [(ngModel)]="extendDurationDays" placeholder="Cantidad de días" />
            </div>
          } @else {
            <div class="form-group">
              <label>Duración:</label>
              <select class="input-styled" [(ngModel)]="grantDurationMonths">
                <option [ngValue]="1">1 Mes</option>
                <option [ngValue]="3">3 Meses</option>
                <option [ngValue]="6">6 Meses</option>
                <option [ngValue]="12">1 Año</option>
              </select>
            </div>
          }

          <div class="form-group">
            <label>Motivo / Observación (opcional):</label>
            <input type="text" class="input-styled" [(ngModel)]="grantReason" placeholder="Ej: Cortesía, prueba, soporte..." />
          </div>

          <div class="modal-actions-row">
            <button class="btn-cancel" (click)="closeGrantModal()">Cancelar</button>
            <button class="btn-grant-action" (click)="executeGrant()" [disabled]="submitting() || (grantTarget()?.plan === 'premium' && (!extendDurationDays || extendDurationDays < 1))">
              {{ submitting() ? 'Procesando...' : '🚀 Confirmar' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: #fafafa; color: var(--text-primary); }
    .admin-layout { display: flex; min-height: 100vh; }

    .admin-main-content { flex: 1; margin-left: 260px; padding: 2.5rem; max-width: calc(100% - 260px); background: #fafafa; box-sizing: border-box; }
    .content-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; gap: 1.5rem; }
    .content-header h1 { font-family: var(--font-heading); font-size: 2.5rem; font-weight: 800; margin: 0; color: var(--text-primary); }
    .subtitle { font-size: 1.05rem; color: var(--text-secondary); margin: 0.4rem 0 0; }
    .header-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }

    .btn-refresh { padding: 0.75rem 1.25rem; border-radius: 12px; border: 2px solid var(--glass-border); background: #ffffff; color: var(--text-secondary); font-size: 0.95rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
    .btn-refresh:hover { border-color: rgba(133,92,214,0.4); color: var(--accent-primary); }
    .btn-refresh:disabled { opacity: 0.5; cursor: not-allowed; }

    .filters-row { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
    .admin-tabs-row { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .atab { padding: 0.65rem 1.2rem; border-radius: 12px; border: 1.5px solid var(--glass-border); background: #fff; color: var(--text-secondary); font-weight: 700; cursor: pointer; }
    .atab.active { border-color: var(--accent-primary); background: rgba(133,92,214,0.08); color: var(--accent-primary); }

    .search-box { display: flex; gap: 0.5rem; align-items: center; }
    .input-search { padding: 0.65rem 1rem; border-radius: 12px; border: 2px solid var(--glass-border); background: #fff; font-size: 0.9rem; outline: none; min-width: 240px; }
    .input-search:focus { border-color: var(--accent-primary); }
    .btn-search { padding: 0.65rem 1.1rem; border-radius: 12px; border: none; background: var(--gradient-brand); color: #fff; font-weight: 700; cursor: pointer; }
    .btn-search:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-clear-search { padding: 0.65rem 1rem; border-radius: 12px; border: 2px solid var(--glass-border); background: transparent; color: var(--text-secondary); font-weight: 700; cursor: pointer; }

    .status-msg.success { background: rgba(16,185,129,0.1); color: #047857; padding: 0.85rem 1.25rem; border-radius: 12px; border: 1px solid rgba(16,185,129,0.3); margin-bottom: 1.5rem; font-weight: 600; }

    .table-container { background: #fff; border-radius: 20px; border: 2px solid var(--glass-border); overflow-x: auto; box-shadow: var(--shadow-sm); }
    .admin-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem; }
    .admin-table th { padding: 1rem 1.25rem; background: var(--bg-secondary); color: var(--text-muted); font-weight: 700; text-transform: uppercase; font-size: 0.75rem; border-bottom: 2px solid var(--glass-border); }
    .admin-table td { padding: 1rem 1.25rem; border-bottom: 1px solid var(--glass-border); vertical-align: middle; }
    .font-mono { font-family: monospace; font-size: 0.85rem; }
    .date-cell { color: var(--text-muted); font-size: 0.82rem; white-space: nowrap; }

    .user-info { display: flex; align-items: center; gap: 0.75rem; }
    .user-avatar { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; background: var(--bg-secondary); }

    .plan-tag { padding: 0.25rem 0.6rem; border-radius: 6px; font-size: 0.78rem; font-weight: 700; background: var(--bg-secondary); color: var(--text-secondary); display: inline-block; }
    .plan-tag.premium { background: rgba(212,175,55,0.15); color: #b87e00; }

    .status-chip { padding: 0.3rem 0.75rem; border-radius: 99px; font-size: 0.78rem; font-weight: 800; display: inline-block; }
    .status-chip.active { background: rgba(16,185,129,0.12); color: #059669; }
    .status-chip.expired, .status-chip.revoked, .status-chip.cancelled { background: rgba(239,68,68,0.12); color: #b91c1c; }
    .status-chip.none { background: var(--bg-secondary); color: var(--text-muted); }

    .badge-admin { padding: 0.3rem 0.75rem; border-radius: 99px; font-size: 0.78rem; font-weight: 800; background: rgba(133,92,214,0.12); color: var(--accent-primary); display: inline-block; }
    .done-text { color: var(--text-muted); font-size: 0.85rem; }

    .days-left { font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); white-space: nowrap; }
    .days-left.expiring-soon { color: #b45309; }

    .action-btn-row { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .btn-grant-sm, .btn-extend-sm, .btn-revoke-sm {
      padding: 0.4rem 0.8rem; border-radius: 8px; border: none; font-weight: 700; font-size: 0.8rem; cursor: pointer; white-space: nowrap;
    }
    .btn-grant-sm, .btn-extend-sm { background: linear-gradient(135deg, #7c3aed, #5b21b6); color: #fff; }
    .btn-revoke-sm { background: #ef4444; color: #fff; }

    /* Modal (compartido con el patrón de Suscripciones y Pagos) */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(8px); z-index: 999; display: flex; align-items: center; justify-content: center; padding: 1rem; }
    .glass-modal { background: #fff; border-radius: 24px; padding: 2rem; width: min(500px, 100%); border: 2px solid var(--glass-border); box-shadow: var(--shadow-lg); }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
    .modal-header h3 { margin: 0; font-size: 1.25rem; font-weight: 800; }
    .btn-close { border: none; background: transparent; font-size: 1.5rem; cursor: pointer; color: var(--text-muted); }
    .modal-subtitle { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.5rem; font-family: monospace; }
    .form-group { margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: 0.4rem; }
    .form-group label { font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); }
    .input-styled { padding: 0.75rem 1rem; border-radius: 12px; border: 2px solid var(--glass-border); background: var(--bg-secondary); font-size: 0.95rem; outline: none; }
    .input-styled:focus { border-color: var(--accent-primary); background: #fff; }
    .days-quick-row { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.5rem; }
    .day-chip { padding: 0.4rem 0.8rem; border-radius: 8px; border: 1.5px solid var(--glass-border); background: #fff; color: var(--text-secondary); font-weight: 700; font-size: 0.82rem; cursor: pointer; }
    .day-chip.active { border-color: var(--accent-primary); background: rgba(133,92,214,0.08); color: var(--accent-primary); }
    .modal-actions-row { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; }
    .btn-cancel { padding: 0.75rem 1.25rem; border-radius: 12px; border: 2px solid var(--glass-border); background: transparent; color: var(--text-secondary); font-weight: 700; cursor: pointer; }
    .btn-grant-action { padding: 0.75rem 1.5rem; border-radius: 12px; border: none; background: linear-gradient(135deg,#7c3aed,#5b21b6); color: #fff; font-weight: 800; cursor: pointer; }
    .btn-grant-action:disabled { opacity: 0.6; cursor: not-allowed; }

    .load-more-row { display: flex; justify-content: center; margin-top: 1.5rem; }
    .btn-load-more { padding: 0.85rem 2rem; border-radius: 12px; border: 2px solid var(--glass-border); background: #fff; color: var(--accent-primary); font-weight: 700; cursor: pointer; }
    .btn-load-more:hover { border-color: var(--accent-primary); background: rgba(133,92,214,0.06); }
    .btn-load-more:disabled { opacity: 0.5; cursor: not-allowed; }

    /* LOADING & EMPTY */
    .loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 6rem 2rem; color: var(--text-secondary); }
    .spinner { width: 44px; height: 44px; border: 4px solid rgba(133,92,214,0.15); border-top-color: var(--accent-primary); border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 1rem; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .empty-state { text-align: center; padding: 5rem 2rem; background: #fff; border-radius: 20px; border: 2px solid var(--glass-border); }
    .empty-icon { font-size: 4rem; margin-bottom: 1rem; opacity: 0.8; }
    .empty-state h3 { font-size: 1.25rem; margin: 0; color: var(--text-primary); font-weight: 800; }

    /* RESPONSIVE */
    @media (max-width: 1024px) {
      .admin-layout { flex-direction: column; }
      .admin-main-content { margin-left: 0; padding: 1.5rem; max-width: 100%; }
      .content-header { flex-direction: column; gap: 1.25rem; }
      .admin-table { min-width: 860px; }
    }
    @media (max-width: 480px) {
      .admin-main-content { padding: 1rem; }
      .content-header h1 { font-size: 1.8rem; }
      .filters-row { flex-direction: column; align-items: stretch; }
      .search-box { flex-wrap: wrap; }
      .input-search { min-width: 0; flex: 1 1 auto; }
    }
  `]
})
export class AdminUsersComponent implements OnInit {
  private usersSvc = inject(AdminUsersService);
  private destroyRef = inject(DestroyRef);
  private paymentSvc = inject(PaymentService);

  loading = signal(false);
  loadingMore = signal(false);
  submitting = signal(false);
  actionMsg = signal('');
  grantModalOpen = signal(false);
  grantTarget = signal<AdminUserSummary | null>(null);
  grantDurationMonths = 1;
  extendDurationDays = 30;
  readonly quickDayOptions = [7, 15, 30, 60, 90, 180, 365];
  grantReason = '';
  users = signal<AdminUserSummary[]>([]);
  nextCursor = signal<string | null>(null);
  planFilter = signal<PlanFilter>('all');
  activeSearch = signal<string | null>(null);
  searchInput = '';

  private searchInput$ = new Subject<string>();

  ngOnInit() {
    this.refresh();

    // Búsqueda en vivo: cada tecleo pasa por acá, debounced 300ms para no
    // disparar una request por letra. switchMap cancela automáticamente
    // cualquier búsqueda anterior todavía en vuelo si el usuario sigue
    // escribiendo, así una respuesta lenta y desactualizada nunca pisa a
    // una más nueva.
    this.searchInput$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((term) => {
          this.activeSearch.set(term || null);
          this.loading.set(true);
        }),
        switchMap((term) =>
          this.usersSvc.listUsers(
            term ? { search: term } : { plan: this.planFilter() },
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (res) => {
          this.users.set(res.users);
          this.nextCursor.set(res.nextCursor);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('[AdminUsers] Error searching users:', err);
          this.loading.set(false);
        },
      });
  }

  onSearchInput(value: string) {
    this.searchInput = value;
    this.searchInput$.next(value.trim().toLowerCase());
  }

  refresh() {
    this.loading.set(true);
    this.usersSvc.listUsers({ plan: this.planFilter() }).subscribe({
      next: (res) => {
        this.users.set(res.users);
        this.nextCursor.set(res.nextCursor);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('[AdminUsers] Error loading users:', err);
        this.loading.set(false);
      }
    });
  }

  loadMore() {
    const cursor = this.nextCursor();
    if (!cursor) return;
    this.loadingMore.set(true);
    this.usersSvc.listUsers({ plan: this.planFilter(), cursor }).subscribe({
      next: (res) => {
        this.users.update(list => [...list, ...res.users]);
        this.nextCursor.set(res.nextCursor);
        this.loadingMore.set(false);
      },
      error: (err) => {
        console.error('[AdminUsers] Error loading more users:', err);
        this.loadingMore.set(false);
      }
    });
  }

  setPlanFilter(plan: PlanFilter) {
    if (this.planFilter() === plan) return;
    this.planFilter.set(plan);
    // Cambiar de materia/plan sale del modo búsqueda — son dos formas de
    // filtrar mutuamente excluyentes en esta pantalla.
    this.searchInput = '';
    this.activeSearch.set(null);
    this.refresh();
  }

  clearSearch() {
    this.searchInput = '';
    // Pasa por el mismo Subject que el tecleo en vez de refrescar directo,
    // para que switchMap cancele cualquier búsqueda todavía en vuelo y no
    // termine pisando esta limpieza con una respuesta vieja.
    this.searchInput$.next('');
  }

  formatDate(dateVal: string | null): string {
    if (!dateVal) return '—';
    return new Date(dateVal).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  formatSubStatus(status: string | null): string {
    switch (status) {
      case 'active': return 'Activa';
      case 'expired': return 'Expirada';
      case 'revoked': return 'Revocada';
      case 'cancelled': return 'Cancelada';
      default: return 'Sin suscripción';
    }
  }

  openGrantModal(user: AdminUserSummary) {
    this.grantTarget.set(user);
    this.grantDurationMonths = 1;
    this.extendDurationDays = 30;
    this.grantReason = '';
    this.grantModalOpen.set(true);
  }

  closeGrantModal() {
    if (this.submitting()) return;
    this.grantModalOpen.set(false);
    this.grantTarget.set(null);
  }

  executeGrant() {
    const target = this.grantTarget();
    const targetEmailOrUid = target?.email || target?.uid;
    if (!targetEmailOrUid) return;

    const reason = this.grantReason.trim() || undefined;
    // "Extender" (usuario ya premium) suma días exactos a lo que le queda;
    // "Otorgar" (usuario free) arranca un período nuevo en meses desde hoy.
    const isExtend = target?.plan === 'premium';
    if (isExtend && (!this.extendDurationDays || this.extendDurationDays < 1)) return;

    this.submitting.set(true);
    const request$ = isExtend
      ? this.paymentSvc.adminExtendSubscription({ targetEmailOrUid, durationDays: this.extendDurationDays, reason })
      : this.paymentSvc.adminGrantSubscription({ targetEmailOrUid, durationMonths: this.grantDurationMonths, reason });

    request$.subscribe({
      next: (res) => {
        this.submitting.set(false);
        this.actionMsg.set(res.message);
        this.grantModalOpen.set(false);
        this.grantTarget.set(null);
        this.refresh();
        setTimeout(() => this.actionMsg.set(''), 6000);
      },
      error: (err) => {
        this.submitting.set(false);
        alert('Error al conceder Plan Pro: ' + (err.error?.message || err.message));
      },
    });
  }

  revokePremium(user: AdminUserSummary) {
    const targetEmailOrUid = user.email || user.uid;
    if (!confirm(`¿Quitar Premium a ${targetEmailOrUid}? Su cuenta pasará a nivel Gratuito de inmediato.`)) return;

    this.paymentSvc.adminRevokeSubscription({ targetEmailOrUid }).subscribe({
      next: (res) => {
        this.actionMsg.set(res.message);
        this.refresh();
        setTimeout(() => this.actionMsg.set(''), 6000);
      },
      error: (err) => alert('Error al quitar Premium: ' + (err.error?.message || err.message)),
    });
  }
}
