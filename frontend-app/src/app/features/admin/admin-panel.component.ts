import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AdminService } from './services/admin.service';
import { PoolPregunta, MateriaId } from '../learning-path/models/paes.models';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="admin-layout">
      <!-- SIDEBAR -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="logo-mark">⚡</div>
          <h2>Admin Panel</h2>
          <span class="badge">EstudiaUni</span>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/admin" class="nav-item active">
            <span class="nav-icon">📋</span>
            <span>Pool de Preguntas</span>
            <span class="nav-count">{{ adminSvc.totalPreguntas() }}</span>
          </a>
          <a routerLink="/admin/pregunta/nueva" class="nav-item">
            <span class="nav-icon">➕</span>
            <span>Nueva Pregunta</span>
          </a>
        </nav>

        <div class="sidebar-divider"></div>

        <!-- FILTROS POR MATERIA -->
        <div class="filter-section">
          <h3 class="filter-title">Filtrar por Materia</h3>
          <button class="filter-chip"
            [class.active]="adminSvc.filterMateria() === 'all'"
            (click)="adminSvc.setFilter('all')">
            <span>📚</span> Todas
          </button>
          @for (mat of adminSvc.materiasDisponibles; track mat.id) {
            <button class="filter-chip"
              [class.active]="adminSvc.filterMateria() === mat.id"
              (click)="adminSvc.setFilter(mat.id)">
              <span>{{ mat.icon }}</span> {{ mat.label }}
            </button>
          }
        </div>

        <div class="sidebar-footer">
          <button class="btn-back" routerLink="/dashboard">
            ← Volver al Dashboard
          </button>
        </div>
      </aside>

      <!-- MAIN CONTENT -->
      <main class="main-content">
        <!-- HEADER -->
        <header class="content-header">
          <div class="header-left">
            <h1>Pool de Preguntas</h1>
            <p class="subtitle">Gestiona el banco de preguntas PAES para todas las materias</p>
          </div>
          <div class="header-actions">
            <button class="btn-refresh" (click)="refresh()" [disabled]="adminSvc.loading()">
              {{ adminSvc.loading() ? '⏳' : '🔄' }} Actualizar
            </button>
            <a routerLink="/admin/pregunta/nueva" class="btn-create">
              ➕ Nueva Pregunta
            </a>
          </div>
        </header>

        <!-- STATS BAR -->
        <div class="stats-bar">
          @for (mat of adminSvc.materiasDisponibles; track mat.id) {
            <div class="stat-card" [class.active]="adminSvc.filterMateria() === mat.id" (click)="adminSvc.setFilter(mat.id)">
              <span class="stat-icon">{{ mat.icon }}</span>
              <span class="stat-count">{{ countByMateria(mat.id) }}</span>
              <span class="stat-label">{{ mat.label }}</span>
            </div>
          }
        </div>

        <!-- LOADING -->
        @if (adminSvc.loading()) {
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Cargando preguntas...</p>
          </div>
        }

        <!-- EMPTY STATE -->
        @if (!adminSvc.loading() && adminSvc.preguntas().length === 0) {
          <div class="empty-state">
            <div class="empty-icon">📭</div>
            <h3>No hay preguntas aún</h3>
            <p>Comienza creando tu primera pregunta para el banco PAES</p>
            <a routerLink="/admin/pregunta/nueva" class="btn-create">
              ➕ Crear primera pregunta
            </a>
          </div>
        }

        <!-- QUESTION LIST -->
        @if (!adminSvc.loading() && adminSvc.preguntas().length > 0) {
          <div class="question-list">
            @for (pregunta of adminSvc.preguntas(); track pregunta.id) {
              <div class="question-card" [class.image-type]="pregunta.tipo_alternativas === 'imagen'">
                <div class="card-header">
                  <div class="card-badges">
                    <span class="badge-materia">{{ adminSvc.getMateriaIcon(pregunta.materiaId) }} {{ adminSvc.getMateriaLabel(pregunta.materiaId) }}</span>
                    <span class="badge-tema">{{ pregunta.tema }}</span>
                    @if (pregunta.tipo_alternativas === 'imagen') {
                      <span class="badge-type badge-img">🖼️ Imagen</span>
                    }
                    @if (pregunta.formula_latex) {
                      <span class="badge-type badge-latex">∑ LaTeX</span>
                    }
                  </div>
                  <div class="card-actions">
                    <button class="btn-icon" title="Editar" (click)="editPregunta(pregunta)">✏️</button>
                    <button class="btn-icon btn-danger" title="Eliminar" (click)="confirmDelete(pregunta)">🗑️</button>
                  </div>
                </div>

                <div class="card-body">
                  @if (pregunta.preambulo_texto) {
                    <p class="preambulo">💬 {{ pregunta.preambulo_texto | slice:0:120 }}{{ pregunta.preambulo_texto.length > 120 ? '...' : '' }}</p>
                  }
                  <p class="enunciado">{{ pregunta.enunciado }}</p>

                  <div class="alternativas-preview">
                    @for (key of optionKeys; track key) {
                      <span class="alt-chip" [class.correct]="key === pregunta.respuesta_correcta">
                        <strong>{{ key }})</strong>
                        @if (pregunta.tipo_alternativas === 'texto') {
                          {{ pregunta.alternativas[key] | slice:0:40 }}{{ pregunta.alternativas[key].length > 40 ? '...' : '' }}
                        } @else {
                          🖼️ Imagen
                        }
                      </span>
                    }
                  </div>
                </div>

                <div class="card-footer">
                  <span class="card-date">📅 {{ formatDate(pregunta.createdAt) }}</span>
                  <span class="card-answer">✅ Correcta: {{ pregunta.respuesta_correcta }}</span>
                </div>
              </div>
            }
          </div>
        }
      </main>
    </div>

    <!-- DELETE MODAL -->
    @if (deleteTarget()) {
      <div class="modal-overlay" (click)="deleteTarget.set(null)">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-icon">⚠️</div>
          <h3>¿Eliminar pregunta?</h3>
          <p class="modal-text">{{ deleteTarget()!.enunciado | slice:0:100 }}...</p>
          <p class="modal-warning">Esta acción no se puede deshacer.</p>
          <div class="modal-actions">
            <button class="btn-cancel" (click)="deleteTarget.set(null)">Cancelar</button>
            <button class="btn-delete" (click)="executeDelete()" [disabled]="deleting()">
              {{ deleting() ? 'Eliminando...' : '🗑️ Eliminar' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: #f8f9fa; color: var(--text-primary); }

    .admin-layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      min-height: 100vh;
    }

    /* ─── SIDEBAR ─── */
    .sidebar {
      background: #18181f;
      border-right: 1px solid rgba(255,255,255,0.06);
      display: flex;
      flex-direction: column;
      padding: 1.5rem 1rem;
      position: sticky;
      top: 0;
      height: 100vh;
      overflow-y: auto;
    }

    .sidebar-header {
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .logo-mark {
      width: 48px; height: 48px;
      background: linear-gradient(135deg, #855cd6, #6c3fc5);
      border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.4rem;
      margin: 0 auto 0.75rem;
      box-shadow: 0 4px 20px rgba(133,92,214,0.3);
    }

    .sidebar-header h2 { font-size: 1.15rem; font-weight: 700; margin: 0; color: #fff; }
    .badge { display: inline-block; font-size: 0.65rem; background: rgba(133,92,214,0.15); color: #a78bfa; padding: 0.2rem 0.6rem; border-radius: 99px; margin-top: 0.35rem; font-weight: 600; letter-spacing: 0.03em; }

    .sidebar-nav { display: flex; flex-direction: column; gap: 0.35rem; }

    .nav-item {
      display: flex; align-items: center; gap: 0.65rem;
      padding: 0.7rem 0.85rem;
      border-radius: 10px;
      color: #a1a1aa;
      text-decoration: none;
      font-size: 0.88rem;
      font-weight: 500;
      transition: all 0.2s;
      cursor: pointer;
    }
    .nav-item:hover { background: rgba(255,255,255,0.04); color: #e4e4e7; }
    .nav-item.active { background: rgba(133,92,214,0.12); color: #a78bfa; }
    .nav-icon { font-size: 1.1rem; }
    .nav-count { margin-left: auto; font-size: 0.75rem; background: rgba(255,255,255,0.08); padding: 0.15rem 0.5rem; border-radius: 99px; font-weight: 600; }

    .sidebar-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 1rem 0; }

    .filter-section { flex: 1; }
    .filter-title { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: #71717a; margin: 0 0 0.65rem 0.5rem; font-weight: 600; }

    .filter-chip {
      display: flex; align-items: center; gap: 0.5rem;
      width: 100%;
      padding: 0.55rem 0.75rem;
      border: 1px solid transparent;
      border-radius: 8px;
      background: transparent;
      color: #a1a1aa;
      font-size: 0.82rem;
      cursor: pointer;
      transition: all 0.2s;
      text-align: left;
    }
    .filter-chip:hover { background: rgba(255,255,255,0.04); color: #e4e4e7; }
    .filter-chip.active { background: rgba(133,92,214,0.1); border-color: rgba(133,92,214,0.2); color: #a78bfa; }

    .sidebar-footer { margin-top: auto; padding-top: 1rem; }
    .btn-back {
      width: 100%; padding: 0.65rem; border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.08);
      background: transparent; color: #a1a1aa;
      font-size: 0.82rem; font-weight: 500;
      cursor: pointer; transition: all 0.2s;
    }
    .btn-back:hover { border-color: rgba(133,92,214,0.3); color: #a78bfa; }

    /* ─── MAIN CONTENT ─── */
    .main-content { padding: 2rem; overflow-y: auto; }

    .content-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 1.5rem;
    }
    .content-header h1 { font-size: 1.65rem; font-weight: 800; margin: 0; color: var(--text-primary); }
    .subtitle { font-size: 0.88rem; color: var(--text-secondary); margin: 0.35rem 0 0; }
    .header-actions { display: flex; gap: 0.65rem; }
    .btn-refresh {
      padding: 0.6rem 1.1rem; border-radius: 10px;
      border: 2px solid rgba(0,0,0,0.06);
      background: #ffffff; color: var(--text-secondary);
      font-size: 0.82rem; font-weight: 600; cursor: pointer;
      transition: all 0.2s;
    }
    .btn-refresh:hover { border-color: rgba(133,92,214,0.3); color: #a78bfa; }
    .btn-refresh:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-create {
      padding: 0.6rem 1.25rem; border-radius: 10px;
      border: none; text-decoration: none;
      background: linear-gradient(135deg, #855cd6, #6c3fc5);
      color: #fff; font-size: 0.85rem; font-weight: 700;
      cursor: pointer; transition: all 0.2s;
      box-shadow: 0 4px 15px rgba(133,92,214,0.3);
      display: inline-flex; align-items: center; gap: 0.4rem;
    }
    .btn-create:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(133,92,214,0.4); }

    /* ─── STATS BAR ─── */
    .stats-bar {
      display: flex; gap: 0.65rem; margin-bottom: 1.5rem;
      overflow-x: auto; padding-bottom: 0.5rem;
    }
    .stat-card {
      display: flex; flex-direction: column; align-items: center;
      padding: 0.75rem 1rem; min-width: 100px;
      background: #ffffff;
      border: 2px solid rgba(0,0,0,0.06);
      border-radius: 12px; cursor: pointer;
      transition: all 0.2s;
    }
    .stat-card:hover { border-color: rgba(133,92,214,0.2); background: rgba(133,92,214,0.05); }
    .stat-card.active { border-color: rgba(133,92,214,0.4); background: rgba(133,92,214,0.1); }
    .stat-icon { font-size: 1.25rem; }
    .stat-count { font-size: 1.4rem; font-weight: 800; color: var(--text-primary); margin-top: 0.25rem; }
    .stat-label { font-size: 0.65rem; color: var(--text-secondary); text-align: center; margin-top: 0.15rem; }

    /* ─── LOADING ─── */
    .loading-state {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 4rem 2rem; color: #71717a;
    }
    .spinner {
      width: 40px; height: 40px;
      border: 3px solid rgba(133,92,214,0.15);
      border-top-color: #855cd6;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 1rem;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* ─── EMPTY STATE ─── */
    .empty-state {
      text-align: center; padding: 4rem 2rem;
      background: rgba(0,0,0,0.02);
      border: 2px dashed rgba(0,0,0,0.08);
      border-radius: 20px;
    }
    .empty-icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.8; }
    .empty-state h3 { font-size: 1.2rem; margin: 0 0 0.5rem; color: var(--text-primary); }
    .empty-state p { font-size: 0.88rem; color: var(--text-secondary); margin: 0 0 1.5rem; }

    /* ─── QUESTION CARDS ─── */
    .question-list { display: flex; flex-direction: column; gap: 0.85rem; }

    .question-card {
      background: #ffffff;
      border: 2px solid rgba(0,0,0,0.06);
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.25s;
    }
    .question-card:hover { border-color: rgba(133,92,214,0.2); transform: translateY(-1px); box-shadow: 0 8px 30px rgba(0,0,0,0.2); }
    .question-card.image-type { border-left: 3px solid #f59e0b; }

    .card-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 0.85rem 1.15rem;
      border-bottom: 2px solid rgba(0,0,0,0.06);
    }
    .card-badges { display: flex; gap: 0.4rem; flex-wrap: wrap; }
    .badge-materia {
      font-size: 0.72rem; font-weight: 600;
      background: rgba(133,92,214,0.12); color: #a78bfa;
      padding: 0.25rem 0.65rem; border-radius: 6px;
    }
    .badge-tema {
      font-size: 0.72rem; font-weight: 600;
      background: rgba(59,130,246,0.12); color: #60a5fa;
      padding: 0.25rem 0.65rem; border-radius: 6px;
    }
    .badge-type {
      font-size: 0.72rem; font-weight: 600;
      padding: 0.25rem 0.65rem; border-radius: 6px;
    }
    .badge-img { background: rgba(245,158,11,0.12); color: #fbbf24; }
    .badge-latex { background: rgba(16,185,129,0.12); color: #34d399; }

    .card-actions { display: flex; gap: 0.35rem; }
    .btn-icon {
      width: 34px; height: 34px;
      border-radius: 8px; border: 2px solid rgba(0,0,0,0.06);
      background: transparent; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.85rem; transition: all 0.2s;
    }
    .btn-icon:hover { background: rgba(0,0,0,0.04); border-color: rgba(0,0,0,0.12); }
    .btn-icon.btn-danger:hover { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.3); }

    .card-body { padding: 1rem 1.15rem; }
    .preambulo {
      font-size: 0.8rem; color: #a1a1aa; font-style: italic;
      margin: 0 0 0.5rem; line-height: 1.5;
      padding-left: 0.75rem;
      border-left: 2px solid rgba(133,92,214,0.3);
    }
    .enunciado {
      font-size: 0.92rem; font-weight: 600; color: var(--text-primary);
      margin: 0 0 0.85rem; line-height: 1.5;
    }

    .alternativas-preview { display: flex; flex-wrap: wrap; gap: 0.4rem; }
    .alt-chip {
      font-size: 0.75rem; padding: 0.3rem 0.6rem;
      background: rgba(0,0,0,0.03);
      border: 1px solid rgba(0,0,0,0.06);
      border-radius: 6px; color: var(--text-secondary);
      transition: all 0.2s;
    }
    .alt-chip.correct { background: rgba(88,204,2,0.1); border-color: rgba(88,204,2,0.25); color: #3d8c00; }
    .alt-chip strong { color: var(--text-primary); margin-right: 0.25rem; }

    .card-footer {
      display: flex; justify-content: space-between; align-items: center;
      padding: 0.65rem 1.15rem;
      border-top: 2px solid rgba(0,0,0,0.06);
      font-size: 0.72rem; color: var(--text-secondary);
    }

    /* ─── DELETE MODAL ─── */
    .modal-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.7);
      backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease-out;
    }
    .modal-card {
      background: #ffffff;
      border: 2px solid rgba(0,0,0,0.06);
      border-radius: 20px;
      padding: 2rem;
      max-width: 420px;
      width: 90%;
      text-align: center;
      animation: slideUp 0.3s ease-out;
    }
    .modal-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
    .modal-card h3 { font-size: 1.15rem; margin: 0 0 0.75rem; color: var(--text-primary); }
    .modal-text { font-size: 0.85rem; color: var(--text-secondary); margin: 0 0 0.5rem; line-height: 1.5; }
    .modal-warning { font-size: 0.78rem; color: #ef4444; margin: 0 0 1.5rem; font-weight: 500; }
    .modal-actions { display: flex; gap: 0.65rem; justify-content: center; }
    .btn-cancel {
      padding: 0.65rem 1.25rem; border-radius: 10px;
      border: 2px solid rgba(0,0,0,0.06);
      background: transparent; color: var(--text-secondary);
      font-weight: 600; cursor: pointer;
      transition: all 0.2s;
    }
    .btn-cancel:hover { border-color: rgba(0,0,0,0.15); color: var(--text-primary); }
    .btn-delete {
      padding: 0.65rem 1.25rem; border-radius: 10px;
      border: none;
      background: linear-gradient(135deg, #dc2626, #b91c1c);
      color: #fff; font-weight: 700; cursor: pointer;
      transition: all 0.2s;
    }
    .btn-delete:hover { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(220,38,38,0.3); }
    .btn-delete:disabled { opacity: 0.6; cursor: not-allowed; }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    /* ─── RESPONSIVE ─── */
    @media (max-width: 900px) {
      .admin-layout { grid-template-columns: 1fr; }
      .sidebar {
        position: fixed; bottom: 0; left: 0; right: 0;
        height: auto; max-height: 50vh;
        flex-direction: row; overflow-x: auto;
        border-right: none; border-top: 1px solid rgba(255,255,255,0.06);
        z-index: 100; padding: 0.75rem;
      }
      .sidebar-header, .sidebar-divider, .filter-section, .sidebar-footer { display: none; }
      .sidebar-nav { flex-direction: row; gap: 0.5rem; }
      .nav-count { display: none; }
      .main-content { padding: 1.25rem; padding-bottom: 5rem; }
      .content-header { flex-direction: column; gap: 1rem; }
      .stats-bar { gap: 0.4rem; }
      .stat-card { min-width: 80px; padding: 0.5rem 0.65rem; }
      .stat-count { font-size: 1.1rem; }
      .stat-label { font-size: 0.6rem; }
    }
  `]
})
export class AdminPanelComponent implements OnInit {
  adminSvc = inject(AdminService);
  private router = inject(Router);

  optionKeys: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
  deleteTarget = signal<PoolPregunta | null>(null);
  deleting = signal(false);

  ngOnInit() {
    this.adminSvc.loadPreguntas();
  }

  countByMateria(materiaId: MateriaId): number {
    // Count from ALL preguntas (unfiltered)
    return this.adminSvc.totalPreguntas() > 0
      ? this.adminSvc.allPreguntas().filter(p => p.materiaId === materiaId).length
      : 0;
  }

  refresh() {
    this.adminSvc.loadPreguntas();
  }

  editPregunta(pregunta: PoolPregunta) {
    this.router.navigate(['/admin/pregunta', pregunta.id]);
  }

  confirmDelete(pregunta: PoolPregunta) {
    this.deleteTarget.set(pregunta);
  }

  async executeDelete() {
    const target = this.deleteTarget();
    if (!target) return;
    this.deleting.set(true);
    try {
      await this.adminSvc.deletePregunta(target.id);
      this.deleteTarget.set(null);
    } catch (error) {
      console.error('Error deleting pregunta:', error);
      alert('Error al eliminar la pregunta. Verifica tu conexión.');
    } finally {
      this.deleting.set(false);
    }
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return 'Sin fecha';
    try {
      return new Date(dateStr).toLocaleDateString('es-CL', {
        day: '2-digit', month: 'short', year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  }
}
