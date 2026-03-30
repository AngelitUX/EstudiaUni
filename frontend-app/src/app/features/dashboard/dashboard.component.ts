import { Component, inject, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { FirestoreService } from '../../core/services/firestore.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-layout">
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
          <a class="nav-item active" routerLink="/dashboard">
            <span class="nav-icon">🏠</span>
            <span class="nav-text" *ngIf="!sidebarCollapsed">Inicio</span>
          </a>
          <a class="nav-item" routerLink="/modules">
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
        
        <div class="sidebar-footer">
          <button class="nav-item logout-btn" (click)="logout()">
            <span class="nav-icon">🚪</span>
            <span class="nav-text" *ngIf="!sidebarCollapsed">Cerrar Sesión</span>
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
            <a class="nav-item active" routerLink="/dashboard" (click)="mobileMenuOpen = false">
              <span class="nav-icon">🏠</span>
              <span class="nav-text">Inicio</span>
            </a>
            <a class="nav-item" routerLink="/modules" (click)="mobileMenuOpen = false">
              <span class="nav-icon">📚</span>
              <span class="nav-text">Ensayos PAES</span>
            </a>
            <a class="nav-item" routerLink="/modules" (click)="mobileMenuOpen = false">
              <span class="nav-icon">🎯</span>
              <span class="nav-text">Práctica por Tema</span>
            </a>
            <a class="nav-item" routerLink="/dashboard" (click)="mobileMenuOpen = false">
              <span class="nav-icon">📊</span>
              <span class="nav-text">Mi Progreso</span>
            </a>
            <a class="nav-item" (click)="logout()">
              <span class="nav-icon">🚪</span>
              <span class="nav-text">Cerrar Sesión</span>
            </a>
          </nav>
        </div>
      </div>

      <!-- MAIN CONTENT -->
      <main class="main-content">
        <!-- WELCOME -->
        <section class="welcome-section">
          <div class="welcome-text">
            <h1>¡Hola, <span class="text-gradient">{{ userName }}</span>! 👋</h1>
            <p>Bienvenido de vuelta. Aquí está tu resumen de hoy.</p>
          </div>
          <div class="welcome-date">
            {{ currentDate }}
          </div>
        </section>

        <!-- METRICS CARDS -->
        <section class="metrics-section">
          <div class="metric-card glass-card">
            <div class="metric-header">
              <span class="metric-label">Nivel de Dominio Global</span>
              <span class="metric-icon">🎯</span>
            </div>
            <div class="metric-body">
              <div class="circular-progress" [attr.data-progress]="globalProgress">
                <svg viewBox="0 0 100 100">
                  <circle class="bg" cx="50" cy="50" r="45"/>
                  <circle class="progress" cx="50" cy="50" r="45" 
                    [style.strokeDashoffset]="283 - (283 * globalProgress / 100)"/>
                </svg>
                <div class="progress-value">{{ globalProgress }}%</div>
              </div>
            </div>
            <div class="metric-footer">
              <span class="metric-change positive">↑ 5% esta semana</span>
            </div>
          </div>

          <div class="metric-card glass-card">
            <div class="metric-header">
              <span class="metric-label">Preguntas Respondidas</span>
              <span class="metric-icon">✅</span>
            </div>
            <div class="metric-body">
              <div class="metric-number">{{ questionsAnswered }}</div>
            </div>
            <div class="metric-footer">
              <span class="metric-subtext">+{{ questionsToday }} hoy</span>
            </div>
          </div>

          <div class="metric-card glass-card">
            <div class="metric-header">
              <span class="metric-label">Racha de Estudio</span>
              <span class="metric-icon">🔥</span>
            </div>
            <div class="metric-body">
              <div class="metric-number streak">{{ studyStreak }}</div>
              <span class="metric-unit">días</span>
            </div>
            <div class="metric-footer">
              <span class="metric-subtext">¡Sigue así!</span>
            </div>
          </div>
        </section>

        <!-- ACTIVITY / RECOMMENDATION -->
        <section class="activity-section">
          <div class="activity-card glass-card">
            <div class="activity-header">
              <h3>🤖 Recomendación de la IA</h3>
              <span class="activity-badge">Personalizado</span>
            </div>
            <div class="activity-body">
              <div class="recommendation-content">
                <div class="recommendation-icon">📐</div>
                <div class="recommendation-text">
                  <h4>Continúa con: Álgebra - Ecuaciones Cuadráticas</h4>
                  <p>Basado en tu último rendimiento, te recomendamos practicar este tema para mejorar tu puntaje en Matemáticas.</p>
                  <div class="recommendation-stats">
                    <span>⏱️ 15 min estimados</span>
                    <span>📊 Dificultad: Media</span>
                  </div>
                </div>
              </div>
              <button class="btn btn-primary btn-large" routerLink="/modules">
                🚀 Comenzar Práctica
              </button>
            </div>
          </div>

          <div class="recent-activity glass-card">
            <h3>📋 Actividad Reciente</h3>
            <div class="activity-list">
              <div class="activity-item">
                <span class="activity-icon">✅</span>
                <div class="activity-info">
                  <span class="activity-title">Quiz de Geometría</span>
                  <span class="activity-time">Hace 2 horas</span>
                </div>
                <span class="activity-score">85%</span>
              </div>
              <div class="activity-item">
                <span class="activity-icon">📝</span>
                <div class="activity-info">
                  <span class="activity-title">Ensayo PAES Matemáticas</span>
                  <span class="activity-time">Ayer</span>
                </div>
                <span class="activity-score">720 pts</span>
              </div>
              <div class="activity-item">
                <span class="activity-icon">🎯</span>
                <div class="activity-info">
                  <span class="activity-title">Práctica de Álgebra</span>
                  <span class="activity-time">Hace 2 días</span>
                </div>
                <span class="activity-score">90%</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    /* ===== LAYOUT ===== */
    .dashboard-layout {
      display: flex;
      min-height: 100vh;
    }
    .text-gradient {
      background: var(--gradient-brand);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* ===== SIDEBAR ===== */
    .sidebar {
      width: 260px;
      background: rgba(13, 15, 23, 0.95);
      border-right: 1px solid var(--glass-border);
      display: flex;
      flex-direction: column;
      transition: width 0.3s ease;
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      z-index: 100;
    }
    .sidebar.collapsed {
      width: 80px;
    }
    .sidebar-header {
      padding: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--glass-border);
    }
    .sidebar-logo {
      font-family: var(--font-heading);
      font-size: 1.25rem;
      font-weight: 800;
    }
    .sidebar-logo-mini {
      font-family: var(--font-heading);
      font-size: 1.25rem;
      font-weight: 800;
      background: var(--gradient-brand);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .sidebar-toggle {
      background: rgba(255, 255, 255, 0.1);
      border: none;
      color: var(--text-secondary);
      width: 28px;
      height: 28px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .sidebar-toggle:hover {
      background: var(--accent-primary);
      color: #fff;
    }
    .sidebar-nav {
      flex: 1;
      padding: 1rem 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.85rem 1rem;
      border-radius: 10px;
      color: var(--text-secondary);
      text-decoration: none;
      transition: all 0.2s;
      cursor: pointer;
      background: transparent;
      border: none;
      width: 100%;
      text-align: left;
      font-size: 0.95rem;
    }
    .nav-item:hover {
      background: rgba(255, 255, 255, 0.05);
      color: #fff;
    }
    .nav-item.active {
      background: rgba(99, 102, 241, 0.15);
      color: var(--accent-primary);
      font-weight: 600;
    }
    .nav-icon {
      font-size: 1.2rem;
      width: 24px;
      text-align: center;
    }
    .sidebar-footer {
      padding: 1rem 0.75rem;
      border-top: 1px solid var(--glass-border);
    }
    .logout-btn:hover {
      background: rgba(239, 68, 68, 0.15);
      color: #ef4444;
    }

    /* ===== MOBILE HEADER ===== */
    .mobile-header {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 60px;
      background: rgba(13, 15, 23, 0.95);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--glass-border);
      padding: 0 1rem;
      align-items: center;
      gap: 1rem;
      z-index: 101;
    }
    .mobile-menu-btn {
      background: none;
      border: none;
      color: #fff;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0.5rem;
    }
    .mobile-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 200;
    }
    .mobile-overlay.open {
      display: block;
    }
    .mobile-menu {
      position: absolute;
      top: 0;
      left: 0;
      width: 280px;
      height: 100%;
      background: rgba(13, 15, 23, 0.98);
      padding: 2rem 1rem;
    }

    /* ===== MAIN CONTENT ===== */
    .main-content {
      flex: 1;
      margin-left: 260px;
      padding: 2rem;
      transition: margin-left 0.3s ease;
    }
    .sidebar.collapsed ~ .main-content {
      margin-left: 80px;
    }

    /* ===== WELCOME ===== */
    .welcome-section {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .welcome-text h1 {
      font-family: var(--font-heading);
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    .welcome-text p {
      color: var(--text-secondary);
    }
    .welcome-date {
      color: var(--text-secondary);
      font-size: 0.9rem;
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
    }

    /* ===== METRICS ===== */
    .metrics-section {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .metric-card {
      padding: 1.5rem;
      border-radius: 16px;
      display: flex;
      flex-direction: column;
    }
    .metric-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .metric-label {
      font-size: 0.9rem;
      color: var(--text-secondary);
      font-weight: 500;
    }
    .metric-icon {
      font-size: 1.5rem;
    }
    .metric-body {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    .metric-number {
      font-size: 3rem;
      font-weight: 800;
      font-family: var(--font-heading);
      background: var(--gradient-brand);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .metric-number.streak {
      color: #f97316;
      background: linear-gradient(135deg, #f97316, #ea580c);
      -webkit-background-clip: text;
    }
    .metric-unit {
      font-size: 1rem;
      color: var(--text-secondary);
    }
    .metric-footer {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--glass-border);
    }
    .metric-change.positive {
      color: #10b981;
      font-size: 0.85rem;
    }
    .metric-subtext {
      color: var(--text-secondary);
      font-size: 0.85rem;
    }

    /* ===== CIRCULAR PROGRESS ===== */
    .circular-progress {
      position: relative;
      width: 120px;
      height: 120px;
    }
    .circular-progress svg {
      transform: rotate(-90deg);
      width: 100%;
      height: 100%;
    }
    .circular-progress circle {
      fill: none;
      stroke-width: 8;
      stroke-linecap: round;
    }
    .circular-progress .bg {
      stroke: rgba(255, 255, 255, 0.1);
    }
    .circular-progress .progress {
      stroke: url(#gradient);
      stroke-dasharray: 283;
      transition: stroke-dashoffset 1s ease;
    }
    .progress-value {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 1.5rem;
      font-weight: 800;
      font-family: var(--font-heading);
      background: var(--gradient-brand);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    /* ===== ACTIVITY ===== */
    .activity-section {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 1.5rem;
    }
    .activity-card, .recent-activity {
      padding: 1.5rem;
      border-radius: 16px;
    }
    .activity-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .activity-header h3 {
      font-size: 1.1rem;
      font-weight: 600;
    }
    .activity-badge {
      background: rgba(99, 102, 241, 0.2);
      color: var(--accent-primary);
      padding: 0.3rem 0.75rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .activity-body {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .recommendation-content {
      display: flex;
      gap: 1.25rem;
    }
    .recommendation-icon {
      font-size: 2.5rem;
      background: rgba(99, 102, 241, 0.1);
      padding: 1rem;
      border-radius: 12px;
      height: fit-content;
    }
    .recommendation-text h4 {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
      color: #fff;
    }
    .recommendation-text p {
      color: var(--text-secondary);
      font-size: 0.95rem;
      line-height: 1.5;
      margin-bottom: 1rem;
    }
    .recommendation-stats {
      display: flex;
      gap: 1.5rem;
      font-size: 0.85rem;
      color: var(--text-secondary);
    }
    .btn-large {
      padding: 1rem 2rem;
      font-size: 1rem;
    }
    
    .recent-activity h3 {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }
    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .activity-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 10px;
      transition: background 0.2s;
    }
    .activity-item:hover {
      background: rgba(255, 255, 255, 0.06);
    }
    .activity-item .activity-icon {
      font-size: 1.25rem;
    }
    .activity-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .activity-title {
      font-size: 0.9rem;
      font-weight: 500;
      color: #fff;
    }
    .activity-time {
      font-size: 0.8rem;
      color: var(--text-secondary);
    }
    .activity-score {
      font-weight: 700;
      color: #10b981;
      font-size: 0.9rem;
    }

    /* ===== GLASS CARD ===== */
    .glass-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--glass-border);
      backdrop-filter: blur(10px);
    }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 1024px) {
      .metrics-section {
        grid-template-columns: 1fr;
      }
      .activity-section {
        grid-template-columns: 1fr;
      }
    }
    @media (max-width: 768px) {
      .sidebar {
        display: none;
      }
      .mobile-header {
        display: flex;
      }
      .main-content {
        margin-left: 0;
        padding-top: 80px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  firestoreService = inject(FirestoreService);
  router = inject(Router);

  userProfile: any = null;
  sidebarCollapsed = false;
  mobileMenuOpen = false;

  // Datos (se actualizan desde Firestore)
  userName = 'Estudiante';
  globalProgress = 68;
  questionsAnswered = 247;
  questionsToday = 12;
  studyStreak = 7;

  get currentDate(): string {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date().toLocaleDateString('es-CL', options);
  }

  ngOnInit() {
    // Guardar perfil del usuario al cargar (crea si no existe)
    this.firestoreService.saveUserProfile({}).catch(() => {});
    
    // Cargar datos del usuario desde Firestore
    this.firestoreService.getUserProfile().subscribe({
      next: (profile) => {
        if (profile) {
          this.userProfile = profile;
          this.userName = profile.displayName?.split(' ')[0] || 'Estudiante';
          if (profile.stats?.questionsAnswered) {
            this.questionsAnswered = profile.stats.questionsAnswered;
          }
          if (profile.stats?.studyStreak) {
            this.studyStreak = profile.stats.studyStreak;
          }
        }
      }
    });
  }

  async logout() {
    await firstValueFrom(this.authService.logout());
    this.router.navigate(['/login']);
  }
}
