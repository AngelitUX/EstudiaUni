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
            <a class="nav-item" (click)="logout()"><span class="nav-icon">🚪</span><span class="nav-text">Cerrar Sesión</span></a>
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
              class="materia-card horizontal-card"
              [class.has-progress]="getMateriaProgress(m.id).percentage > 0"
              [class.completed]="getMateriaProgress(m.id).percentage === 100"
              (click)="goToMateria(m)">

              <!-- Izquierda: Imagen grande -->
              <div class="card-image-col">
                <img [src]="getMateriaInfo(m.id).img" [alt]="m.title" class="materia-main-img" />
              </div>

              <!-- Derecha: Contenido -->
              <div class="card-content-col">
                <!-- Título y Estado -->
                <div class="card-header-row">
                  <h2>{{ m.title }}</h2>
                  <div class="status-badges">
                    <div class="status-badge"
                      *ngIf="getMateriaProgress(m.id).percentage > 0"
                      [class.badge-complete]="getMateriaProgress(m.id).percentage === 100">
                      {{ getMateriaProgress(m.id).percentage === 100 ? '✓ Completa' : getMateriaProgress(m.id).percentage + '% en curso' }}
                    </div>
                    <div class="status-badge badge-new" *ngIf="getMateriaProgress(m.id).percentage === 0">Nuevo</div>
                  </div>
                </div>

                <!-- Descripción y Tópicos -->
                <p class="materia-desc">{{ getMateriaInfo(m.id).desc }}</p>
                <div class="materia-topics">
                  <span class="topic-tag" *ngFor="let topic of getMateriaInfo(m.id).topics">{{ topic }}</span>
                </div>

                <!-- Footer de la tarjeta: Progreso + Botón -->
                <div class="card-footer-row">
                  <div class="progress-info-wrap">
                    <div class="stats-text">
                      <span class="stat-item"><strong>{{ getCapCount(m.id) }}</strong> Capítulos</span>
                      <span class="stat-sep">·</span>
                      <span class="stat-item"><strong>{{ getSectionCount(m.id) }}</strong> Lecciones</span>
                    </div>
                    <div class="prog-bar-container">
                      <div class="prog-bar-track">
                        <div class="prog-bar-fill"
                          [class.fill-green]="getMateriaProgress(m.id).percentage === 100"
                          [style.width.%]="getMateriaProgress(m.id).percentage">
                        </div>
                      </div>
                      <span class="prog-text-small">{{ getMateriaProgress(m.id).completed }}/{{ getMateriaProgress(m.id).total }}</span>
                    </div>
                  </div>

                  <!-- Botón -->
                  <div class="cta-wrap">
                    <button class="btn-main-action"
                      [class.btn-start]="getMateriaProgress(m.id).percentage === 0"
                      [class.btn-continue]="getMateriaProgress(m.id).percentage > 0 && getMateriaProgress(m.id).percentage < 100"
                      [class.btn-review]="getMateriaProgress(m.id).percentage === 100">
                      {{ getMateriaProgress(m.id).percentage === 0 ? 'EMPEZAR' : getMateriaProgress(m.id).percentage === 100 ? 'REPASAR' : 'CONTINUAR' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </ng-container>
      </main>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: #f8f9fa; color: var(--text-primary); }
    .lp-layout { display: flex; min-height: 100vh; }
    .text-gradient { background: var(--gradient-brand); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

    /* SIDEBAR */
    .sidebar { width: 260px; background: rgba(13,15,23,0.95); border-right: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; height: 100vh; z-index: 100; }
    .sidebar-header { padding: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .sidebar-logo { font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: #fff; }
    .sidebar-nav { flex: 1; padding: 1rem 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; }
    .nav-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.85rem 1rem; border-radius: 10px; color: var(--text-secondary); text-decoration: none; transition: all 0.2s; cursor: pointer; background: transparent; border: none; width: 100%; text-align: left; font-size: 0.95rem; }
    .nav-item:hover { background: rgba(255,255,255,0.05); color: #fff; }
    .nav-item.active { background: rgba(99,102,241,0.15); color: var(--accent-primary); font-weight: 600; }
    .nav-icon { font-size: 1.2rem; width: 24px; text-align: center; }
    .sidebar-footer { padding: 1rem 0.75rem; border-top: 1px solid rgba(255,255,255,0.1); }
    .logout-btn:hover { background: rgba(239,68,68,0.15); color: #ef4444; }

    /* MOBILE */
    .mobile-header { display: none; position: fixed; top: 0; left: 0; right: 0; height: 60px; background: rgba(13,15,23,0.95); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.1); padding: 0 1rem; align-items: center; gap: 1rem; z-index: 101; }
    .mobile-menu-btn { background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; }
    .mobile-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); z-index: 200; }
    .mobile-overlay.open { display: block; }
    .mobile-menu { position: absolute; top: 0; left: 0; width: 280px; height: 100%; background: #0d0f17; padding: 2rem 1rem; }

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
    .materias-grid { display: flex; flex-direction: column; gap: 1.5rem; }

    /* HORIZONTAL CARD */
    .horizontal-card { display: flex; flex-direction: row; gap: 2rem; padding: 2rem; background: #fff; border: 2px solid rgba(0,0,0,0.06); border-radius: 24px; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); align-items: stretch; }
    .horizontal-card:hover { transform: translateY(-4px); box-shadow: 0 20px 48px rgba(133,92,214,0.1); border-color: rgba(133,92,214,0.25); }

    /* IMAGE COLUMN */
    .card-image-col { flex: 0 0 280px; display: flex; align-items: center; justify-content: center; }
    .materia-main-img { width: 100%; height: auto; max-height: 220px; object-fit: contain; border-radius: 12px; transition: transform 0.4s ease; }
    .horizontal-card:hover .materia-main-img { transform: scale(1.05); }

    /* CONTENT COLUMN */
    .card-content-col { flex: 1; display: flex; flex-direction: column; justify-content: center; }
    .card-header-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; gap: 1rem; }
    .card-header-row h2 { font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; color: var(--text-primary); margin: 0; line-height: 1.2; }
    .status-badges { display: flex; gap: 0.5rem; }
    
    .status-badge { font-size: 0.75rem; font-weight: 700; padding: 0.35rem 0.85rem; border-radius: 99px; background: rgba(133,92,214,0.1); color: var(--accent-primary); white-space: nowrap; height: fit-content; }
    .status-badge.badge-complete { background: rgba(88,204,2,0.1); color: #3d8c00; }
    .status-badge.badge-new { background: rgba(0,0,0,0.05); color: var(--text-secondary); }

    /* DESC & TOPICS */
    .materia-desc { font-size: 1rem; color: var(--text-secondary); line-height: 1.6; margin: 0 0 1rem; max-width: 600px; }
    .materia-topics { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem; }
    .topic-tag { font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); background: #f1f5f9; padding: 0.3rem 0.75rem; border-radius: 6px; }

    /* FOOTER ROW */
    .card-footer-row { margin-top: auto; display: flex; justify-content: space-between; align-items: flex-end; gap: 1.5rem; flex-wrap: wrap; }
    
    /* STATS & PROG */
    .progress-info-wrap { flex: 1; min-width: 200px; }
    .stats-text { display: flex; gap: 0.5rem; color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 0.5rem; }
    .stats-text strong { color: var(--text-primary); font-family: var(--font-heading); }
    .stat-sep { opacity: 0.5; }
    
    .prog-bar-container { display: flex; align-items: center; gap: 0.75rem; }
    .prog-bar-track { flex: 1; height: 8px; background: rgba(0,0,0,0.06); border-radius: 99px; overflow: hidden; }
    .prog-bar-fill { height: 100%; background: linear-gradient(90deg, #855cd6, #a78bfa); border-radius: 99px; transition: width 0.6s ease; }
    .prog-bar-fill.fill-green { background: linear-gradient(90deg, #58cc02, #78d64b); }
    .prog-text-small { font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); white-space: nowrap; }

    /* BUTTON */
    .btn-main-action { padding: 0.85rem 2.5rem; border-radius: 14px; border: none; font-family: var(--font-heading); font-weight: 800; font-size: 1.05rem; letter-spacing: 0.03em; cursor: pointer; transition: all 0.2s; white-space: nowrap; text-transform: uppercase; }
    .btn-start { background: #ff9600; color: #fff; box-shadow: 0 4px 0 #cc7800; }
    .btn-start:hover { transform: translateY(2px); box-shadow: 0 2px 0 #cc7800; }
    .btn-continue { background: var(--accent-primary); color: #fff; box-shadow: 0 4px 0 #6b46b8; }
    .btn-continue:hover { transform: translateY(2px); box-shadow: 0 2px 0 #6b46b8; }
    .btn-review { background: #fff; color: #3d8c00; border: 2px solid rgba(88,204,2,0.3); padding: 0.7rem 2.5rem; }
    .btn-review:hover { background: rgba(88,204,2,0.05); border-color: #58cc02; }

    /* LOADING */
    .loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 50vh; color: var(--text-secondary); font-weight: 500; }
    .loader { width: 40px; height: 40px; border: 4px solid rgba(133,92,214,0.2); border-top-color: var(--accent-primary); border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1rem; }
    @keyframes spin { to { transform: rotate(360deg); } }

    @media (max-width: 768px) {
      .sidebar { display: none; }
      .mobile-header { display: flex; }
      .main-content { margin-left: 0; padding: 80px 1rem 4rem; max-width: 100%; }
      .page-header { flex-direction: column; }
      
      .horizontal-card { flex-direction: column; gap: 1.5rem; padding: 1.5rem; }
      .card-image-col { flex: 0 0 auto; }
      .materia-main-img { max-height: 180px; }
      .card-footer-row { flex-direction: column; align-items: stretch; gap: 1.5rem; }
      .cta-wrap { width: 100%; }
      .btn-main-action { width: 100%; }
    }
  `]
})
export class LearningPathComponent {
  public paes = inject(PaesContentService);
  private auth = inject(AuthService);
  private router = inject(Router);

  mobileOpen = false;

  materiaDataConfig: Record<string, { desc: string, topics: string[], img: string }> = {
    'comp-lectora': {
      desc: 'Mejora tu comprensión lectora, análisis de textos literarios y no literarios, y desarrolla un pensamiento crítico fundamental para la prueba.',
      topics: ['Textos Literarios', 'Textos No Literarios', 'Vocabulario'],
      img: 'assets/images/comp-lectora.png'
    },
    'mat1': {
      desc: 'Domina los conceptos fundamentales de números, álgebra, geometría y probabilidad para asegurar un alto puntaje en la prueba M1.',
      topics: ['Números', 'Álgebra', 'Geometría', 'Probabilidad'],
      img: 'assets/images/mat1.png'
    },
    'historia': {
      desc: 'Comprende los procesos históricos de Chile y el mundo, y analiza geografía y formación ciudadana de manera crítica.',
      topics: ['Historia de Chile', 'Historia Universal', 'Formación Ciudadana'],
      img: 'assets/images/historia.png'
    },
    'ciencias': {
      desc: 'Prepárate integralmente en los ejes de Biología, Física y Química, comprendiendo los fenómenos naturales y sus leyes.',
      topics: ['Biología', 'Física', 'Química'],
      img: 'assets/images/ciencias.png'
    }
  };

  getMateriaInfo(id: string) {
    return this.materiaDataConfig[id] || {
      desc: 'Prepárate para la prueba con material actualizado y ejercicios prácticos.',
      topics: ['General', 'Ejercicios'],
      img: 'assets/images/comp-lectora.png'
    };
  }

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
