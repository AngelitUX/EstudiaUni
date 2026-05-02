import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PaesContentService } from './services/paes-content.service';
import { AuthService } from '../../core/services/auth.service';
import { Materia } from './models/paes.models';

@Component({
  selector: 'app-learning-path',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="lp-layout">
      <!-- SIDEBAR -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <span class="sidebar-logo"><span class="text-gradient">EstudiaUni</span></span>
        </div>
        <nav class="sidebar-nav">
          <a class="nav-item" routerLink="/dashboard"><span class="nav-icon">🏠</span><span class="nav-text">Inicio</span></a>
          <a class="nav-item active" routerLink="/ruta"><span class="nav-icon">🗺️</span><span class="nav-text">Ruta de Aprendizaje</span></a>
          <a class="nav-item" routerLink="/ensayos"><span class="nav-icon">📚</span><span class="nav-text">Ensayos PAES</span></a>
          <a class="nav-item" routerLink="/settings"><span class="nav-icon">⚙️</span><span class="nav-text">Configuración</span></a>
        </nav>
        <div class="sidebar-footer">
          <button class="nav-item logout-btn" (click)="logout()">
            <span class="nav-icon">🚪</span>
            <span class="nav-text">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <!-- MOBILE HEADER -->
      <div class="mobile-header">
        <button class="mobile-menu-btn" (click)="mobileOpen = !mobileOpen">☰</button>
        <span class="text-gradient">EstudiaUni</span>
      </div>
      <div class="mobile-overlay" [class.open]="mobileOpen" (click)="mobileOpen = false">
        <div class="mobile-menu" (click)="$event.stopPropagation()">
          <nav class="sidebar-nav">
            <a class="nav-item" routerLink="/dashboard" (click)="mobileOpen=false"><span class="nav-icon">🏠</span><span class="nav-text">Inicio</span></a>
            <a class="nav-item active" routerLink="/ruta" (click)="mobileOpen=false"><span class="nav-icon">🗺️</span><span class="nav-text">Ruta de Aprendizaje</span></a>
            <a class="nav-item" routerLink="/ensayos" (click)="mobileOpen=false"><span class="nav-icon">📚</span><span class="nav-text">Ensayos PAES</span></a>
            <a class="nav-item" routerLink="/settings" (click)="mobileOpen=false"><span class="nav-icon">⚙️</span><span class="nav-text">Configuración</span></a>
          </nav>
        </div>
      </div>

      <!-- MAIN -->
      <main class="main-content">
        <div *ngIf="paes.loading()" class="loading-state">
          <div class="loader"></div>
          <p>Cargando materias...</p>
        </div>

        <ng-container *ngIf="!paes.loading()">
          <!-- PAGE HEADER -->
          <div class="page-header">
            <div>
              <h1>Mi Ruta de Aprendizaje</h1>
              <p class="page-subtitle">Elige una materia para empezar tu camino PAES 🚀</p>
            </div>
            <div class="overall-stats">
              <div class="ov-stat">
                <span class="ov-val">{{ totalCompleted() }}</span>
                <span class="ov-label">Completadas</span>
              </div>
              <div class="ov-stat accent">
                <span class="ov-val">{{ totalSections() }}</span>
                <span class="ov-label">Total</span>
              </div>
            </div>
          </div>

          <!-- MATERIAS GRID -->
          <div class="materias-grid">
            <div *ngFor="let m of paes.materias()"
              class="materia-card"
              [class.has-progress]="getMateriaProgress(m.id).percentage > 0"
              [class.completed]="getMateriaProgress(m.id).percentage === 100"
              (click)="goToMateria(m)">

              <!-- Card shine effect -->
              <div class="card-shine"></div>

              <!-- Top row: icon + status badge -->
              <div class="card-top">
                <div class="materia-icon-box">{{ m.icon }}</div>
                <div class="status-badge"
                  *ngIf="getMateriaProgress(m.id).percentage > 0"
                  [class.badge-complete]="getMateriaProgress(m.id).percentage === 100">
                  {{ getMateriaProgress(m.id).percentage === 100 ? '✓ Completa' : getMateriaProgress(m.id).percentage + '% en curso' }}
                </div>
                <div class="status-badge badge-new" *ngIf="getMateriaProgress(m.id).percentage === 0">Nuevo</div>
              </div>

              <!-- Title -->
              <h2>{{ m.title }}</h2>
              <p class="card-subtitle">{{ getCapCount(m.id) }} capítulos · {{ getSectionCount(m.id) }} lecciones</p>

              <!-- Progress ring + bar -->
              <div class="card-progress-area">
                <div class="progress-ring-wrap">
                  <svg viewBox="0 0 48 48" class="prog-svg">
                    <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="5"/>
                    <circle cx="24" cy="24" r="20" fill="none"
                      [attr.stroke]="getMateriaProgress(m.id).percentage === 100 ? '#58cc02' : '#855cd6'"
                      stroke-width="5"
                      stroke-linecap="round"
                      stroke-dasharray="125.66"
                      [attr.stroke-dashoffset]="125.66 - (125.66 * getMateriaProgress(m.id).percentage / 100)"
                      transform="rotate(-90 24 24)"/>
                  </svg>
                  <span class="ring-pct">{{ getMateriaProgress(m.id).percentage }}%</span>
                </div>
                <div class="progress-detail">
                  <div class="prog-bar-track">
                    <div class="prog-bar-fill"
                      [class.fill-green]="getMateriaProgress(m.id).percentage === 100"
                      [style.width.%]="getMateriaProgress(m.id).percentage">
                    </div>
                  </div>
                  <span class="prog-count">{{ getMateriaProgress(m.id).completed }}/{{ getMateriaProgress(m.id).total }} lecciones</span>
                </div>
              </div>

              <!-- CTA Button -->
              <button class="card-cta"
                [class.cta-start]="getMateriaProgress(m.id).percentage === 0"
                [class.cta-continue]="getMateriaProgress(m.id).percentage > 0 && getMateriaProgress(m.id).percentage < 100"
                [class.cta-review]="getMateriaProgress(m.id).percentage === 100">
                <span *ngIf="getMateriaProgress(m.id).percentage === 0">Empezar →</span>
                <span *ngIf="getMateriaProgress(m.id).percentage > 0 && getMateriaProgress(m.id).percentage < 100">Continuar →</span>
                <span *ngIf="getMateriaProgress(m.id).percentage === 100">Repasar →</span>
              </button>
            </div>

          </div>

        </ng-container>
      </main>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: var(--bg-color, #fdf9f1); }
    .lp-layout { display: flex; min-height: 100vh; }
    .text-gradient { background: var(--gradient-brand); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

    /* SIDEBAR */
    .sidebar { width: 260px; background: #ffffff; border-right: 2px solid rgba(0,0,0,0.06); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; height: 100vh; z-index: 100; }
    .sidebar-header { padding: 1.5rem; border-bottom: 1px solid rgba(0,0,0,0.06); }
    .sidebar-logo { font-family: var(--font-heading); font-size: 1.3rem; font-weight: 800; }
    .sidebar-nav { flex: 1; padding: 1rem 0.75rem; display: flex; flex-direction: column; gap: 0.25rem; }
    .nav-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.85rem 1rem; border-radius: 12px; color: var(--text-secondary); text-decoration: none; transition: all 0.2s; cursor: pointer; font-size: 0.95rem; background: transparent; border: none; width: 100%; text-align: left; }
    .nav-item:hover { background: rgba(133,92,214,0.06); color: var(--text-primary); }
    .nav-item.active { background: rgba(133,92,214,0.1); color: var(--accent-primary); font-weight: 600; }
    .nav-icon { font-size: 1.2rem; width: 24px; text-align: center; }
    .sidebar-footer { padding: 1rem 0.75rem; border-top: 1px solid rgba(0,0,0,0.06); }
    .logout-btn { color: var(--text-secondary); }
    .logout-btn:hover { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

    /* MOBILE */
    .mobile-header { display: none; position: fixed; top: 0; left: 0; right: 0; height: 60px; background: #fff; border-bottom: 2px solid rgba(0,0,0,0.06); padding: 0 1rem; align-items: center; gap: 1rem; z-index: 101; }
    .mobile-menu-btn { background: none; border: none; color: var(--text-primary); font-size: 1.5rem; cursor: pointer; }
    .mobile-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 200; }
    .mobile-overlay.open { display: block; }
    .mobile-menu { position: absolute; top: 0; left: 0; width: 280px; height: 100%; background: #fff; padding: 2rem 1rem; }

    /* MAIN */
    .main-content { flex: 1; margin-left: 260px; padding: 2.5rem; max-width: calc(100% - 260px); }

    /* PAGE HEADER */
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; gap: 1rem; flex-wrap: wrap; }
    .page-header h1 { font-family: var(--font-heading); font-size: 2rem; font-weight: 800; color: var(--text-primary); margin: 0 0 0.3rem; }
    .page-subtitle { color: var(--text-secondary); font-size: 0.95rem; margin: 0; }
    .overall-stats { display: flex; gap: 0.75rem; }
    .ov-stat { background: #fff; border: 2px solid rgba(0,0,0,0.06); border-radius: 14px; padding: 0.75rem 1.25rem; text-align: center; min-width: 75px; }
    .ov-stat.accent { border-color: rgba(133,92,214,0.15); background: rgba(133,92,214,0.03); }
    .ov-val { display: block; font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: var(--text-primary); line-height: 1; }
    .ov-label { font-size: 0.68rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.04em; font-weight: 600; }

    /* MATERIAS GRID */
    .materias-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.25rem; }

    /* MATERIA CARD */
    .materia-card { position: relative; background: #fff; border: 2px solid rgba(0,0,0,0.06); border-radius: 22px; padding: 1.75rem; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); overflow: hidden; display: flex; flex-direction: column; gap: 1rem; }
    .materia-card:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(133,92,214,0.14); border-color: rgba(133,92,214,0.3); }
    .materia-card.has-progress { border-color: rgba(133,92,214,0.15); }
    .materia-card.completed { border-color: rgba(88,204,2,0.25); }
    .materia-card.completed:hover { box-shadow: 0 20px 48px rgba(88,204,2,0.12); border-color: rgba(88,204,2,0.4); }

    /* Shine effect */
    .card-shine { position: absolute; top: 0; left: -100%; width: 60%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent); pointer-events: none; transition: left 0.6s ease; }
    .materia-card:hover .card-shine { left: 150%; }

    /* CARD TOP */
    .card-top { display: flex; align-items: center; justify-content: space-between; }
    .materia-icon-box { width: 52px; height: 52px; border-radius: 16px; background: linear-gradient(135deg, rgba(133,92,214,0.1), rgba(133,92,214,0.05)); display: flex; align-items: center; justify-content: center; font-size: 1.75rem; }
    .status-badge { font-size: 0.72rem; font-weight: 700; padding: 0.3rem 0.75rem; border-radius: 99px; background: rgba(133,92,214,0.1); color: var(--accent-primary); }
    .status-badge.badge-complete { background: rgba(88,204,2,0.1); color: #3d8c00; }
    .status-badge.badge-new { background: rgba(0,0,0,0.05); color: var(--text-secondary); }

    /* CARD CONTENT */
    .materia-card h2 { font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin: 0; line-height: 1.2; }
    .card-subtitle { font-size: 0.82rem; color: var(--text-secondary); margin: 0; }

    /* PROGRESS AREA */
    .card-progress-area { display: flex; align-items: center; gap: 1rem; }
    .progress-ring-wrap { position: relative; width: 52px; height: 52px; flex-shrink: 0; }
    .prog-svg { width: 100%; height: 100%; }
    .ring-pct { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-family: var(--font-heading); font-size: 0.72rem; font-weight: 800; color: var(--text-primary); }
    .progress-detail { flex: 1; }
    .prog-bar-track { height: 7px; background: rgba(0,0,0,0.06); border-radius: 99px; overflow: hidden; margin-bottom: 0.4rem; }
    .prog-bar-fill { height: 100%; background: linear-gradient(90deg, #855cd6, #a78bfa); border-radius: 99px; transition: width 0.6s ease; }
    .prog-bar-fill.fill-green { background: linear-gradient(90deg, #58cc02, #78d64b); }
    .prog-count { font-size: 0.78rem; color: var(--text-secondary); }

    /* CTA */
    .card-cta { width: 100%; padding: 0.8rem; border-radius: 14px; border: none; font-family: var(--font-heading); font-weight: 700; font-size: 0.95rem; cursor: pointer; transition: all 0.2s; margin-top: 0.25rem; }
    .cta-start { background: var(--accent-primary); color: #fff; box-shadow: 0 4px 0 #6b46b8; }
    .cta-start:hover { transform: translateY(2px); box-shadow: 0 2px 0 #6b46b8; }
    .cta-continue { background: linear-gradient(135deg, #855cd6, #a78bfa); color: #fff; box-shadow: 0 4px 0 #6b46b8; }
    .cta-continue:hover { transform: translateY(2px); box-shadow: 0 2px 0 #6b46b8; }
    .cta-review { background: rgba(88,204,2,0.1); color: #3d8c00; border: 2px solid rgba(88,204,2,0.25); }
    .cta-review:hover { background: rgba(88,204,2,0.18); }

    /* LOADING */
    .loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 50vh; color: var(--text-secondary); font-weight: 500; }
    .loader { width: 40px; height: 40px; border: 4px solid rgba(133,92,214,0.2); border-top-color: var(--accent-primary); border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1rem; }
    @keyframes spin { to { transform: rotate(360deg); } }

    @media (max-width: 768px) {
      .sidebar { display: none; }
      .mobile-header { display: flex; }
      .main-content { margin-left: 0; padding: 80px 1rem 4rem; max-width: 100%; }
      .materias-grid { grid-template-columns: 1fr; }
      .page-header { flex-direction: column; }
    }
  `]
})
export class LearningPathComponent {
  public paes = inject(PaesContentService);
  private auth = inject(AuthService);
  private router = inject(Router);

  mobileOpen = false;

  totalCompleted = computed(() => {
    let total = 0;
    for (const m of this.paes.materias()) {
      total += this.paes.getMateriaProgress(m.id).completed;
    }
    return total;
  });

  totalSections = computed(() => {
    let total = 0;
    for (const m of this.paes.materias()) {
      total += this.paes.getMateriaProgress(m.id).total;
    }
    return total;
  });

  getMateriaProgress(materiaId: string) {
    return this.paes.getMateriaProgress(materiaId);
  }

  getCapCount(materiaId: string): number {
    return this.paes.getCapitulosByMateria(materiaId).length;
  }

  getSectionCount(materiaId: string): number {
    return this.paes.getCapitulosByMateria(materiaId)
      .reduce((acc, cap) => acc + cap.secciones.length, 0);
  }

  goToMateria(m: Materia) {
    this.router.navigate(['/ruta', m.id]);
  }

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/']);
  }
}
