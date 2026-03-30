import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FirestoreService, Ensayo, Intento } from '../../core/services/firestore.service';

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
      <aside class="sidebar" [class.collapsed]="sidebarCollapsed">
        <div class="sidebar-header">
          <span class="sidebar-logo" *ngIf="!sidebarCollapsed">
            <span class="text-gradient">EstudiaUni</span>
          </span>
          <span class="sidebar-logo-mini" *ngIf="sidebarCollapsed">EU</span>
          <button class="sidebar-toggle" (click)="sidebarCollapsed = !sidebarCollapsed">
            {{ sidebarCollapsed ? '→' : '←' }}
          </button>
        </div>
        
        <nav class="sidebar-nav">
          <a class="nav-item" routerLink="/dashboard">
            <span class="nav-icon">🏠</span>
            <span class="nav-text" *ngIf="!sidebarCollapsed">Inicio</span>
          </a>
          <a class="nav-item active" routerLink="/ensayos">
            <span class="nav-icon">📚</span>
            <span class="nav-text" *ngIf="!sidebarCollapsed">Ensayos PAES</span>
          </a>
          <a class="nav-item" routerLink="/modules">
            <span class="nav-icon">🎯</span>
            <span class="nav-text" *ngIf="!sidebarCollapsed">Práctica por Tema</span>
          </a>
          <a class="nav-item" routerLink="/dashboard">
            <span class="nav-icon">📊</span>
            <span class="nav-text" *ngIf="!sidebarCollapsed">Mi Progreso</span>
          </a>
          <a class="nav-item" routerLink="/dashboard">
            <span class="nav-icon">⚙️</span>
            <span class="nav-text" *ngIf="!sidebarCollapsed">Configuración</span>
          </a>
        </nav>
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
            <a class="nav-item" routerLink="/dashboard" (click)="mobileMenuOpen = false">
              <span class="nav-icon">🏠</span>
              <span class="nav-text">Inicio</span>
            </a>
            <a class="nav-item active" routerLink="/ensayos" (click)="mobileMenuOpen = false">
              <span class="nav-icon">📚</span>
              <span class="nav-text">Ensayos PAES</span>
            </a>
            <a class="nav-item" routerLink="/modules" (click)="mobileMenuOpen = false">
              <span class="nav-icon">🎯</span>
              <span class="nav-text">Práctica por Tema</span>
            </a>
          </nav>
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
                </button>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="filteredEnsayos.length === 0" class="empty-state glass-card">
          <div class="empty-icon">📭</div>
          <h3>No hay ensayos disponibles</h3>
          <p>No se encontraron ensayos para este filtro.</p>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .ensayos-layout { display: flex; min-height: 100vh; }
    .text-gradient { background: var(--gradient-brand); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .sidebar { width: 260px; background: rgba(13, 15, 23, 0.95); border-right: 1px solid var(--glass-border); display: flex; flex-direction: column; transition: width 0.3s ease; position: fixed; top: 0; left: 0; height: 100vh; z-index: 100; }
    .sidebar.collapsed { width: 80px; }
    .sidebar-header { padding: 1.5rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--glass-border); }
    .sidebar-logo { font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; }
    .sidebar-logo-mini { font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; background: var(--gradient-brand); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .sidebar-toggle { background: rgba(255, 255, 255, 0.1); border: none; color: var(--text-secondary); width: 28px; height: 28px; border-radius: 6px; cursor: pointer; }
    .sidebar-toggle:hover { background: var(--accent-primary); color: #fff; }
    .sidebar-nav { flex: 1; padding: 1rem 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; }
    .nav-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.85rem 1rem; border-radius: 10px; color: var(--text-secondary); text-decoration: none; transition: all 0.2s; cursor: pointer; }
    .nav-item:hover { background: rgba(255, 255, 255, 0.05); color: #fff; }
    .nav-item.active { background: rgba(99, 102, 241, 0.15); color: var(--accent-primary); font-weight: 600; }
    .nav-icon { font-size: 1.2rem; width: 24px; text-align: center; }
    .mobile-header { display: none; position: fixed; top: 0; left: 0; right: 0; height: 60px; background: rgba(13, 15, 23, 0.95); backdrop-filter: blur(20px); border-bottom: 1px solid var(--glass-border); padding: 0 1rem; align-items: center; gap: 1rem; z-index: 101; }
    .mobile-menu-btn { background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; }
    .mobile-overlay { display: none; position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); z-index: 200; }
    .mobile-overlay.open { display: block; }
    .mobile-menu { position: absolute; top: 0; left: 0; width: 280px; height: 100%; background: rgba(13, 15, 23, 0.98); padding: 2rem 1rem; }
    .main-content { flex: 1; margin-left: 260px; padding: 2rem; transition: margin-left 0.3s ease; }
    .sidebar.collapsed ~ .main-content { margin-left: 80px; }
    .page-header { margin-bottom: 2rem; }
    .page-header h1 { font-family: var(--font-heading); font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; }
    .page-subtitle { color: var(--text-secondary); }
    .filter-pills { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 2rem; }
    .pill { padding: 0.6rem 1.25rem; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--glass-border); border-radius: 999px; color: var(--text-secondary); font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: all 0.2s; }
    .pill:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }
    .pill.active { background: var(--accent-primary); border-color: var(--accent-primary); color: #fff; }
    .ensayos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.5rem; }
    .ensayo-card { padding: 1.5rem; border-radius: 16px; display: flex; gap: 1.25rem; transition: all 0.3s ease; border: 1px solid var(--glass-border); background: rgba(255, 255, 255, 0.03); }
    .ensayo-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(99, 102, 241, 0.15); border-color: rgba(99, 102, 241, 0.3); }
    .ensayo-card.completed { border-color: rgba(16, 185, 129, 0.3); }
    .ensayo-card.in-progress { border-color: rgba(249, 115, 22, 0.3); }
    .ensayo-icon { font-size: 2.5rem; background: rgba(99, 102, 241, 0.1); width: 70px; height: 70px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .ensayo-content { flex: 1; display: flex; flex-direction: column; }
    .ensayo-title { font-size: 1.1rem; font-weight: 600; color: #fff; margin-bottom: 0.75rem; }
    .ensayo-meta { display: flex; gap: 1.25rem; margin-bottom: 1rem; }
    .meta-item { display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; color: var(--text-secondary); }
    .meta-icon { font-size: 0.9rem; }
    .ensayo-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--glass-border); }
    .status-badge { font-size: 0.8rem; font-weight: 600; padding: 0.35rem 0.75rem; border-radius: 999px; }
    .status-badge.not_started { background: rgba(156, 163, 175, 0.2); color: #9ca3af; }
    .status-badge.in_progress { background: rgba(249, 115, 22, 0.2); color: #f97316; }
    .status-badge.completed { background: rgba(16, 185, 129, 0.2); color: #10b981; }
    .btn { padding: 0.6rem 1.25rem; border-radius: 8px; font-weight: 600; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; border: none; }
    .btn-primary { background: var(--gradient-brand); color: #fff; }
    .btn-primary:hover { opacity: 0.9; transform: scale(1.02); }
    .btn-outline { background: transparent; border: 1px solid var(--accent-primary); color: var(--accent-primary); }
    .btn-outline:hover { background: rgba(99, 102, 241, 0.1); }
    .btn-ghost { background: transparent; color: var(--text-secondary); border: none; }
    .btn-ghost:hover { color: #fff; }
    .empty-state { text-align: center; padding: 4rem 2rem; border-radius: 16px; }
    .empty-icon { font-size: 4rem; margin-bottom: 1rem; }
    .empty-state h3 { font-size: 1.25rem; margin-bottom: 0.5rem; }
    .empty-state p { color: var(--text-secondary); }
    .glass-card { background: rgba(255, 255, 255, 0.03); border: 1px solid var(--glass-border); backdrop-filter: blur(10px); }
    @media (max-width: 768px) {
      .sidebar { display: none; }
      .mobile-header { display: flex; }
      .main-content { margin-left: 0; padding-top: 80px; }
      .ensayos-grid { grid-template-columns: 1fr; }
      .ensayo-card { flex-direction: column; text-align: center; }
      .ensayo-icon { margin: 0 auto; }
      .ensayo-meta { justify-content: center; }
      .ensayo-footer { flex-direction: column; gap: 1rem; }
    }
  `]
})
export class EnsayosListComponent implements OnInit {
  private router = inject(Router);
  private firestoreService = inject(FirestoreService);
  
  sidebarCollapsed = false;
  mobileMenuOpen = false;
  activeFilter = 'all';
  loading = true;

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
