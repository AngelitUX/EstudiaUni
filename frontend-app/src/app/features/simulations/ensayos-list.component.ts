import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FirestoreService, Ensayo, Intento } from '../../core/services/firestore.service';
import { AuthService } from '../../core/services/auth.service';

interface EnsayoDisplay {
  id: string;
  title: string;
  subject: string;
  icon: string;
  questions: number;
  duration: string;
  status: 'not_started' | 'in_progress' | 'completed';
  score?: number;
  intentoId?: string;
}

@Component({
  selector: 'app-ensayos-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="ensayos-layout">
      <!-- SIDEBAR -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <span class="sidebar-logo"><span class="text-gradient">EstudiaUni</span></span>
        </div>
        <nav class="sidebar-nav">
          <a class="nav-item" routerLink="/dashboard"><span class="nav-icon">🏠</span><span class="nav-text">Inicio</span></a>
          <a class="nav-item" routerLink="/ruta"><span class="nav-icon">🗺️</span><span class="nav-text">Ruta de Aprendizaje</span></a>
          <a class="nav-item active" routerLink="/ensayos"><span class="nav-icon">📚</span><span class="nav-text">Ensayos PAES</span></a>
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
        <button class="mobile-menu-btn" (click)="mobileMenuOpen = !mobileMenuOpen">☰</button>
        <span class="text-gradient">EstudiaUni</span>
      </div>

      <!-- MOBILE MENU OVERLAY -->
      <div class="mobile-overlay" [class.open]="mobileMenuOpen" (click)="mobileMenuOpen = false">
        <div class="mobile-menu" (click)="$event.stopPropagation()">
          <nav class="sidebar-nav">
            <a class="nav-item" routerLink="/dashboard" (click)="mobileMenuOpen = false"><span class="nav-icon">🏠</span><span class="nav-text">Inicio</span></a>
            <a class="nav-item" routerLink="/ruta" (click)="mobileMenuOpen = false"><span class="nav-icon">🗺️</span><span class="nav-text">Ruta de Aprendizaje</span></a>
            <a class="nav-item active" routerLink="/ensayos" (click)="mobileMenuOpen = false"><span class="nav-icon">📚</span><span class="nav-text">Ensayos PAES</span></a>
            <a class="nav-item" routerLink="/settings" (click)="mobileMenuOpen = false"><span class="nav-icon">⚙️</span><span class="nav-text">Configuración</span></a>
          </nav>
          <div class="sidebar-footer" style="margin-top: auto; padding-top: 1rem;">
            <button class="nav-item logout-btn" (click)="logout()">
              <span class="nav-icon">🚪</span>
              <span class="nav-text">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      <!-- MAIN CONTENT -->
      <main class="main-content">
        <header class="page-header">
          <div style="margin-bottom: 1rem;">
            <button class="btn btn-ghost" routerLink="/dashboard" style="padding: 0; display: inline-flex; align-items: center; gap: 0.5rem;">
              ← Volver al Inicio
            </button>
          </div>
          <div>
            <h1>Ensayos Disponibles</h1>
            <p class="page-subtitle">Practica con ensayos completos en condiciones reales de la PAES</p>
          </div>
        </header>

        <!-- FILTER PILLS -->
        <div class="filter-pills">
          <button 
            *ngFor="let filter of filters"
            class="pill"
            [class.active]="activeFilter === filter.value"
            (click)="activeFilter = filter.value">
            {{ filter.label }}
          </button>
        </div>

        <!-- ENSAYOS GRID -->
        <div class="ensayos-grid">
          <div 
            *ngFor="let ensayo of filteredEnsayos" 
            class="ensayo-card glass-card"
            [class.completed]="ensayo.status === 'completed'"
            [class.in-progress]="ensayo.status === 'in_progress'">
            
            <div class="ensayo-icon">{{ ensayo.icon }}</div>
            
            <div class="ensayo-content">
              <h3 class="ensayo-title">{{ ensayo.title }}</h3>
              
              <div class="ensayo-meta">
                <span class="meta-item">
                  <span class="meta-icon">📝</span>
                  {{ ensayo.questions }} preguntas
                </span>
                <span class="meta-item">
                  <span class="meta-icon">⏱️</span>
                  {{ ensayo.duration }}
                </span>
              </div>

              <div class="ensayo-footer">
                <div class="status-badge" [ngClass]="ensayo.status">
                  <ng-container [ngSwitch]="ensayo.status">
                    <span *ngSwitchCase="'not_started'">No iniciado</span>
                    <span *ngSwitchCase="'in_progress'">En progreso</span>
                    <span *ngSwitchCase="'completed'">✓ {{ ensayo.score }} pts</span>
                  </ng-container>
                </div>

                <button *ngIf="ensayo.status === 'not_started'" class="btn btn-primary" (click)="startEnsayo(ensayo)">
                  Comenzar Ensayo
                </button>
                <button *ngIf="ensayo.status === 'in_progress'" class="btn btn-outline" (click)="continueEnsayo(ensayo)">
                  Continuar
                </button>
                <button *ngIf="ensayo.status === 'completed'" class="btn btn-ghost" (click)="reviewEnsayo(ensayo)">
                  Ver Revisión →
                  Revisar →
                </button>
              </div>
            </div>
          </div>
        </div>

          <div *ngIf="filteredEnsayos.length === 0" class="empty-state">
            <div class="empty-icon">💭</div>
            <h3>No hay ensayos disponibles</h3>
            <p>No se encontraron ensayos para este filtro.</p>
          </div>
        </main>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: var(--bg-color, #fdf9f1); }
    .ensayos-layout { display: flex; min-height: 100vh; }
    .text-gradient { background: var(--gradient-brand); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

    /* SIDEBAR — idéntico al dashboard */
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
    .mobile-menu { position: absolute; top: 0; left: 0; width: 280px; height: 100%; background: #fff; padding: 2rem 1rem; display: flex; flex-direction: column; }

    /* MAIN */
    .main-content { flex: 1; margin-left: 260px; padding: 2rem 2.5rem 4rem; }
    .page-header { margin-bottom: 2rem; }
    .page-header h1 { font-family: var(--font-heading); font-size: 2rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.4rem; }
    .page-subtitle { color: var(--text-secondary); margin: 0; }
    .btn-back { background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: 0.9rem; padding: 0; margin-bottom: 0.75rem; display: inline-flex; align-items: center; gap: 0.3rem; }
    .btn-back:hover { color: var(--accent-primary); }

    /* FILTER PILLS */
    .filter-pills { display: flex; gap: 0.6rem; flex-wrap: wrap; margin-bottom: 2rem; }
    .pill { padding: 0.55rem 1.1rem; border-radius: 999px; border: 2px solid rgba(0,0,0,0.08); background: #fff; color: var(--text-secondary); font-size: 0.88rem; font-weight: 500; cursor: pointer; transition: all 0.2s; }
    .pill:hover { border-color: var(--accent-primary); color: var(--accent-primary); }
    .pill.active { background: var(--accent-primary); border-color: var(--accent-primary); color: #fff; box-shadow: 0 4px 0 #6b46b8; }

    /* CARDS */
    .ensayos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.25rem; }
    .ensayo-card { padding: 1.5rem; border-radius: 16px; display: flex; gap: 1.25rem; background: #fff; border: 2px solid rgba(0,0,0,0.06); transition: all 0.25s; }
    .ensayo-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(133,92,214,0.12); border-color: rgba(133,92,214,0.2); }
    .ensayo-card.completed { border-color: rgba(16,185,129,0.25); }
    .ensayo-card.in-progress { border-color: rgba(255,150,0,0.25); }
    .ensayo-icon { font-size: 2.25rem; background: rgba(133,92,214,0.08); width: 64px; height: 64px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .ensayo-content { flex: 1; display: flex; flex-direction: column; }
    .ensayo-title { font-family: var(--font-heading); font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.65rem; line-height: 1.3; }
    .ensayo-meta { display: flex; gap: 1rem; margin-bottom: 1rem; }
    .meta-item { display: flex; align-items: center; gap: 0.4rem; font-size: 0.82rem; color: var(--text-secondary); }
    .ensayo-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 1rem; border-top: 1px solid rgba(0,0,0,0.06); }
    .status-badge { font-size: 0.78rem; font-weight: 600; padding: 0.3rem 0.7rem; border-radius: 999px; }
    .status-badge.not_started { background: rgba(0,0,0,0.06); color: var(--text-secondary); }
    .status-badge.in_progress { background: rgba(255,150,0,0.12); color: #ff9600; }
    .status-badge.completed { background: rgba(16,185,129,0.12); color: #10b981; }
    .btn { padding: 0.6rem 1.2rem; border-radius: 999px; font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; border: none; }
    .btn-primary { background: var(--accent-primary); color: #fff; box-shadow: 0 3px 0 #6b46b8; }
    .btn-primary:hover { transform: translateY(2px); box-shadow: 0 1px 0 #6b46b8; }
    .btn-outline { background: transparent; border: 2px solid var(--accent-primary); color: var(--accent-primary); }
    .btn-outline:hover { background: rgba(133,92,214,0.08); }
    .btn-ghost { background: transparent; color: var(--text-secondary); border: none; }
    .btn-ghost:hover { color: var(--accent-primary); }
    .empty-state { text-align: center; padding: 4rem 2rem; }
    .empty-icon { font-size: 3.5rem; margin-bottom: 1rem; }
    .empty-state h3 { font-family: var(--font-heading); font-size: 1.2rem; color: var(--text-primary); margin-bottom: 0.5rem; }
    .empty-state p { color: var(--text-secondary); }
    @media (max-width: 768px) {
      .sidebar { display: none; }
      .mobile-header { display: flex; }
      .main-content { margin-left: 0; padding: 80px 1rem 3rem; }
      .ensayos-grid { grid-template-columns: 1fr; }
      .ensayo-card { flex-direction: column; }
      .ensayo-footer { flex-direction: column; gap: 0.75rem; align-items: stretch; text-align: center; }
    }
  `]
})
export class EnsayosListComponent implements OnInit {
  private router = inject(Router);
  private firestoreService = inject(FirestoreService);
  private auth = inject(AuthService);
  
  mobileMenuOpen = false;
  activeFilter = 'all';
  loading = true;

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/']);
  }

  filters = [
    { label: 'Todos', value: 'all' },
    { label: 'Matemática 1', value: 'matematica1' },
    { label: 'Comprensión Lectora', value: 'lenguaje' },
    { label: 'Ciencias', value: 'ciencias' },
    { label: 'Historia', value: 'historia' }
  ];

  ensayos: EnsayoDisplay[] = [];
  intentos: Intento[] = [];

  private subjectIcons: Record<string, string> = {
    'matematica1': '📐',
    'matematica2': '📊',
    'lenguaje': '📖',
    'ciencias': '🧬',
    'historia': '🏛️'
  };

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    
    // Cargar ensayos e intentos del usuario
    this.firestoreService.getEnsayos().subscribe(ensayos => {
      this.firestoreService.getIntentosUsuario().subscribe(intentos => {
        this.intentos = intentos;
        this.ensayos = ensayos.map(e => this.mapEnsayoToDisplay(e, intentos));
        this.loading = false;
      });
    });
  }

  private mapEnsayoToDisplay(ensayo: Ensayo, intentos: Intento[]): EnsayoDisplay {
    // Buscar si hay intento para este ensayo
    const intento = intentos.find(i => i.ensayoId === ensayo.id);
    
    let status: 'not_started' | 'in_progress' | 'completed' = 'not_started';
    let score: number | undefined;
    let intentoId: string | undefined;
    
    if (intento) {
      intentoId = intento.id;
      if (intento.status === 'completed') {
        status = 'completed';
        score = intento.score;
      } else if (intento.status === 'in_progress') {
        status = 'in_progress';
      }
    }
    
    const hours = Math.floor(ensayo.timeMinutes / 60);
    const mins = ensayo.timeMinutes % 60;
    const duration = `${hours}h ${mins}m`;
    
    return {
      id: ensayo.id || '',
      title: ensayo.title,
      subject: ensayo.subject,
      icon: this.subjectIcons[ensayo.subject] || '📝',
      questions: ensayo.questionCount,
      duration,
      status,
      score,
      intentoId
    };
  }

  get filteredEnsayos(): EnsayoDisplay[] {
    if (this.activeFilter === 'all') return this.ensayos;
    return this.ensayos.filter(e => e.subject === this.activeFilter);
  }

  filterEnsayos(filterValue: string) {
    this.activeFilter = filterValue;
    // Recargar desde Firestore con filtro
    const subject = filterValue === 'all' ? undefined : filterValue;
    this.firestoreService.getEnsayos(subject).subscribe(ensayos => {
      this.ensayos = ensayos.map(e => this.mapEnsayoToDisplay(e, this.intentos));
    });
  }

  async startEnsayo(ensayo: EnsayoDisplay) {
    try {
      // Crear nuevo intento en Firestore
      const intentoId = await this.firestoreService.startIntento(ensayo.id);
      this.router.navigate(['/ensayo', ensayo.id, 'run'], { queryParams: { intento: intentoId } });
    } catch (error) {
      // Si falla (ej: no logueado), ir directo con mock
      this.router.navigate(['/ensayo', ensayo.id, 'run']);
    }
  }

  continueEnsayo(ensayo: EnsayoDisplay) {
    this.router.navigate(['/ensayo', ensayo.id, 'run'], { 
      queryParams: { intento: ensayo.intentoId } 
    });
  }

  reviewEnsayo(ensayo: EnsayoDisplay) {
    this.router.navigate(['/ensayo', ensayo.id, 'review'], {
      queryParams: { intento: ensayo.intentoId }
    });
  }
}
