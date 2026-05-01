import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PaesContentService } from './services/paes-content.service';
import { AuthService } from '../../core/services/auth.service';

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
          <div class="sidebar-footer" style="margin-top: auto; padding-top: 1rem;">
            <button class="nav-item logout-btn" (click)="logout()">
              <span class="nav-icon">🚪</span>
              <span class="nav-text">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      <!-- MAIN -->
      <main class="main-content">
        <div *ngIf="paes.loading()" class="loading-state">
          <div class="loader"></div>
          <p>Cargando ruta de aprendizaje...</p>
        </div>

        <ng-container *ngIf="!paes.loading()">
          <div class="page-top">
            <button class="btn-back" routerLink="/dashboard">← Volver al Inicio</button>
            <h1>Ruta de Aprendizaje</h1>
            <p class="subtitle">Avanza paso a paso en tu preparación PAES 🚀</p>
          </div>

          <!-- MATERIA PILLS -->
          <div class="materia-pills">
            <button *ngFor="let m of materias()"
              class="pill" [class.active]="selectedMateria() === m.id"
              [class.disabled]="!m.isActive"
              (click)="m.isActive && selectMateria(m.id)">
              <span class="pill-icon">{{ m.icon }}</span> {{ m.title }}
              <span class="pill-soon" *ngIf="!m.isActive">Pronto</span>
            </button>
          </div>

          <!-- PROGRESS BAR -->
          <div class="materia-progress-wrap" *ngIf="materiaProgress() as mp">
            <div class="materia-progress-info">
              <span>{{ mp.completed }}/{{ mp.total }} secciones completadas</span>
              <span class="materia-pct">{{ mp.percentage }}%</span>
            </div>
            <div class="materia-progress-bar">
              <div class="materia-progress-fill" [style.width.%]="mp.percentage"></div>
            </div>
          </div>

          <!-- CAMINO / PATH -->
          <div class="path-container">
            <div class="path-line"></div>
            <div *ngFor="let cap of capitulos(); let i = index" class="path-node-group">
              <div class="path-node"
                [class.completed]="capProgress(cap.id).percentage === 100"
                [class.active]="capProgress(cap.id).percentage > 0 && capProgress(cap.id).percentage < 100"
                (click)="goToCapitulo(cap)">
                <div class="node-circle">
                  <span class="node-number" *ngIf="capProgress(cap.id).percentage < 100">{{ i + 1 }}</span>
                  <span class="node-check" *ngIf="capProgress(cap.id).percentage === 100">✓</span>
                </div>
                <div class="node-stars">
                  <span *ngFor="let s of getStars(cap.id)" class="star" [class.filled]="s">★</span>
                </div>
              </div>
              <div class="path-label" (click)="goToCapitulo(cap)">
                <span class="path-title">{{ cap.title }}</span>
                <span class="path-sub">{{ cap.secciones.length }} secciones</span>
              </div>
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
    .main-content { flex: 1; margin-left: 260px; padding: 2rem 2rem 4rem; max-width: 900px; }
    .page-top { margin-bottom: 1.5rem; }
    .btn-back { background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: 0.9rem; padding: 0; margin-bottom: 0.5rem; display: inline-flex; align-items: center; gap: 0.3rem; }
    .btn-back:hover { color: var(--accent-primary); }
    .page-top h1 { font-family: var(--font-heading); font-size: 2rem; font-weight: 700; color: var(--text-primary); margin: 0 0 0.25rem; }
    .subtitle { color: var(--text-secondary); font-size: 1rem; margin: 0; }

    /* MATERIA PILLS */
    .materia-pills { display: flex; gap: 0.6rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
    .pill { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.6rem 1.2rem; border-radius: 999px; border: 2px solid rgba(0,0,0,0.08); background: #fff; color: var(--text-secondary); font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: all 0.2s; position: relative; }
    .pill:hover:not(.disabled) { border-color: var(--accent-primary); color: var(--accent-primary); }
    .pill.active { background: var(--accent-primary); border-color: var(--accent-primary); color: #fff; box-shadow: 0 4px 0 #6b46b8; }
    .pill.disabled { opacity: 0.5; cursor: not-allowed; }
    .pill-icon { font-size: 1.1rem; }
    .pill-soon { font-size: 0.65rem; background: rgba(255,150,0,0.15); color: #ff9600; padding: 0.1rem 0.4rem; border-radius: 99px; font-weight: 700; text-transform: uppercase; }

    /* MATERIA PROGRESS */
    .materia-progress-wrap { margin-bottom: 2rem; }
    .materia-progress-info { display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.4rem; }
    .materia-pct { font-weight: 700; color: var(--accent-primary); }
    .materia-progress-bar { height: 8px; background: rgba(0,0,0,0.06); border-radius: 99px; overflow: hidden; }
    .materia-progress-fill { height: 100%; background: linear-gradient(90deg, var(--accent-primary), #a78bfa); border-radius: 99px; transition: width 0.5s ease; }

    /* PATH */
    .path-container { position: relative; padding: 1rem 0 2rem 3.5rem; }
    .path-line { position: absolute; left: 2.15rem; top: 1rem; bottom: 2rem; width: 4px; background: rgba(0,0,0,0.08); border-radius: 99px; z-index: 0; }
    .path-node-group { display: flex; align-items: flex-start; gap: 1.25rem; margin-bottom: 2.5rem; position: relative; z-index: 1; }
    .path-node { display: flex; flex-direction: column; align-items: center; gap: 0.3rem; cursor: pointer; }
    .node-circle { width: 56px; height: 56px; border-radius: 50%; background: #fff; border: 4px solid rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; font-family: var(--font-heading); font-size: 1.3rem; font-weight: 800; color: var(--text-secondary); transition: all 0.3s; box-shadow: 0 3px 0 rgba(0,0,0,0.08); }
    .path-node:hover .node-circle { transform: translateY(-3px); box-shadow: 0 6px 16px rgba(133,92,214,0.2); border-color: var(--accent-primary); }
    .path-node.active .node-circle { border-color: var(--accent-primary); color: var(--accent-primary); background: rgba(133,92,214,0.06); box-shadow: 0 3px 0 #6b46b8, 0 0 0 4px rgba(133,92,214,0.15); }
    .path-node.completed .node-circle { border-color: #10b981; background: #10b981; color: #fff; box-shadow: 0 3px 0 #059669; }
    .node-stars { display: flex; gap: 2px; }
    .star { font-size: 0.7rem; color: rgba(0,0,0,0.15); }
    .star.filled { color: #ffc800; }
    .path-label { cursor: pointer; padding-top: 0.5rem; }
    .path-title { display: block; font-family: var(--font-heading); font-weight: 600; font-size: 1.05rem; color: var(--text-primary); line-height: 1.3; }
    .path-sub { display: block; font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.15rem; }

    .loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 50vh; color: var(--text-secondary); font-weight: 500; }
    .loader { width: 40px; height: 40px; border: 4px solid rgba(133,92,214,0.2); border-top-color: var(--accent-primary); border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1rem; }
    @keyframes spin { to { transform: rotate(360deg); } }

    @media (max-width: 768px) {
      .sidebar { display: none; }
      .mobile-header { display: flex; }
      .main-content { margin-left: 0; padding: 80px 1rem 3rem; }
    }
  `]
})
export class LearningPathComponent {
  public paes = inject(PaesContentService);
  private auth = inject(AuthService);
  private router = inject(Router);

  mobileOpen = false;

  materias = this.paes.materias;
  selectedMateria = signal('comp-lectora');

  capitulos = computed(() => this.paes.getCapitulosByMateria(this.selectedMateria()));
  materiaProgress = computed(() => this.paes.getMateriaProgress(this.selectedMateria()));

  selectMateria(id: string) { this.selectedMateria.set(id); }

  capProgress(capId: string) { return this.paes.getCapituloProgress(capId); }

  getStars(capId: string): boolean[] {
    const p = this.capProgress(capId);
    const total = Math.max(p.total, 1);
    return Array.from({ length: total }, (_, i) => i < p.completed);
  }

  goToCapitulo(cap: any) {
    this.router.navigate(['/ruta', this.selectedMateria(), cap.id]);
  }

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/']);
  }
}
