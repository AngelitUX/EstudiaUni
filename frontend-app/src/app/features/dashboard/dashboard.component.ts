import { Component, inject, OnInit, computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { FirestoreService } from '../../core/services/firestore.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { PaesContentService } from '../learning-path/services/paes-content.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-layout">
      <!-- SIDEBAR -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <span class="sidebar-logo"><span class="text-gradient">EstudiaUni</span></span>
        </div>
        <nav class="sidebar-nav">
          <a class="nav-item active" routerLink="/dashboard"><span class="nav-icon">🏠</span><span class="nav-text">Inicio</span></a>
          <a class="nav-item" routerLink="/ruta"><span class="nav-icon">🗺️</span><span class="nav-text">Ruta de Aprendizaje</span></a>
          <a class="nav-item" routerLink="/ensayos"><span class="nav-icon">📚</span><span class="nav-text">Ensayos PAES</span></a>
          <a class="nav-item" routerLink="/settings"><span class="nav-icon">⚙️</span><span class="nav-text">Configuración</span></a>
        </nav>
        <div class="sidebar-footer">
          <button class="nav-item logout-btn" (click)="logout()"><span class="nav-icon">🚪</span><span class="nav-text">Cerrar Sesión</span></button>
        </div>
      </aside>

      <!-- MOBILE HEADER -->
      <div class="mobile-header">
        <button class="mobile-menu-btn" (click)="mobileMenuOpen = !mobileMenuOpen">☰</button>
        <span class="text-gradient">EstudiaUni</span>
      </div>
      <div class="mobile-overlay" [class.open]="mobileMenuOpen" (click)="mobileMenuOpen = false">
        <div class="mobile-menu" (click)="$event.stopPropagation()">
          <nav class="sidebar-nav">
            <a class="nav-item active" routerLink="/dashboard" (click)="mobileMenuOpen = false"><span class="nav-icon">🏠</span><span class="nav-text">Inicio</span></a>
            <a class="nav-item" routerLink="/ruta" (click)="mobileMenuOpen = false"><span class="nav-icon">🗺️</span><span class="nav-text">Ruta de Aprendizaje</span></a>
            <a class="nav-item" routerLink="/ensayos" (click)="mobileMenuOpen = false"><span class="nav-icon">📚</span><span class="nav-text">Ensayos PAES</span></a>
            <a class="nav-item" routerLink="/settings" (click)="mobileMenuOpen = false"><span class="nav-icon">⚙️</span><span class="nav-text">Configuración</span></a>
            <a class="nav-item" (click)="logout()"><span class="nav-icon">🚪</span><span class="nav-text">Cerrar Sesión</span></a>
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
            <div class="welcome-date">{{ currentDate }}</div>
          </div>
          <div class="welcome-actions">
            <span class="plan-badge" [class.pro]="isProPlan">{{ isProPlan ? 'PRO' : 'BASICO' }}</span>
            <div class="profile-menu-wrap">
              <button class="profile-trigger" routerLink="/profile">
                <span class="profile-avatar-wrap">
                  <img *ngIf="userProfile?.photoURL; else avatarFallback" [src]="userProfile?.photoURL" alt="Foto de perfil" class="profile-avatar"/>
                  <ng-template #avatarFallback><span class="profile-avatar fallback">{{ profileInitial }}</span></ng-template>
                  <span class="profile-emoji-badge">{{ userProfile?.profileEmoji || '✨' }}</span>
                </span>
              </button>
            </div>
          </div>
        </section>

        <!-- METRICS CARDS -->
        <section class="metrics-section">
          <!-- SUBJECT MASTERY -->
          <div class="metric-card glass-card mastery-card">
            <div class="metric-header">
              <span class="metric-label">Nivel de Dominio por Tema</span>
              <span class="metric-icon">🎯</span>
            </div>
            <div class="metric-body mastery-body">
              <ng-container *ngIf="dashSvc.subjectMasteries().length > 0; else noMastery">
                <div *ngFor="let m of dashSvc.subjectMasteries()" class="mastery-item">
                  <div class="mastery-top">
                    <span class="mastery-icon">{{ m.subjectIcon }}</span>
                    <span class="mastery-name">{{ m.subjectName }}</span>
                    <span class="mastery-pct">{{ m.mastery }}%</span>
                  </div>
                  <div class="mastery-bar-bg">
                    <div class="mastery-bar-fill" [style.width.%]="m.mastery" [style.background]="getMasteryColor(m.mastery)"></div>
                  </div>
                  <span class="mastery-sub">{{ m.lessonsCompleted }}/{{ m.totalLessons }} lecciones</span>
                </div>
              </ng-container>
              <ng-template #noMastery>
                <div class="empty-state-small">
                  <span class="empty-icon">📚</span>
                  <p>Completa tu primera lección para ver tu progreso</p>
                  <a routerLink="/ruta" class="btn-small-link">Ir a Ruta →</a>
                </div>
              </ng-template>
            </div>
          </div>

          <!-- PAES RECORD -->
          <div class="metric-card glass-card">
            <div class="metric-header">
              <span class="metric-label">Puntaje Récord Ensayo PAES</span>
              <span class="metric-icon">🏆</span>
            </div>
            <div class="metric-body">
              <ng-container *ngIf="dashSvc.bestPaesRecord() as record; else noRecord">
                <div class="record-display">
                  <div class="record-score">{{ record.correctAnswers }}<span class="record-total">/{{ record.totalQuestions }}</span></div>
                  <span class="record-label">respuestas correctas</span>
                  <span class="record-ensayo">{{ record.ensayoTitle }}</span>
                </div>
              </ng-container>
              <ng-template #noRecord>
                <div class="empty-state-small">
                  <span class="empty-icon">📝</span>
                  <p>Aún no has realizado un ensayo PAES</p>
                  <a routerLink="/ensayos" class="btn-small-link">Realizar ensayo →</a>
                </div>
              </ng-template>
            </div>
          </div>

          <!-- STREAK -->
          <div class="metric-card glass-card streak-card">
            <div class="metric-header">
              <span class="metric-label">Racha de Estudio</span>
              <span class="metric-icon">🔥</span>
            </div>
            <div class="metric-body">
              <div class="metric-number streak">{{ dashSvc.streakDays() }}</div>
              <span class="metric-unit">{{ dashSvc.streakDays() === 1 ? 'día' : 'días' }}</span>
            </div>
            <div class="metric-footer">
              <span class="metric-subtext" *ngIf="dashSvc.streakDays() > 0">🔥 ¡Sigue así, no rompas la racha!</span>
              <span class="metric-subtext" *ngIf="dashSvc.streakDays() === 0">Completa una lección hoy para iniciar</span>
            </div>
          </div>
        </section>

        <!-- ACTIVITY / RECOMMENDATION -->
        <section class="activity-section">
          <!-- AI RECOMMENDATIONS -->
          <div class="activity-card glass-card">
            <div class="activity-header">
              <h3>🤖 Recomendación de la IA</h3>
              <span class="activity-badge">Personalizado</span>
            </div>
            <div class="activity-body">
              <div *ngFor="let rec of dashSvc.recommendations(); let i = index" class="recommendation-content" [class.hidden]="i !== activeRecIdx">
                <div class="recommendation-icon">{{ rec.icon }}</div>
                <div class="recommendation-text">
                  <h4>{{ rec.title }}</h4>
                  <p>{{ rec.description }}</p>
                  <div class="recommendation-stats">
                    <span>⏱️ {{ rec.estimatedTime }}</span>
                    <span>📊 {{ rec.difficulty }}</span>
                  </div>
                </div>
              </div>
              <div class="rec-nav" *ngIf="dashSvc.recommendations().length > 1">
                <button *ngFor="let r of dashSvc.recommendations(); let i = index" class="rec-dot" [class.active]="i === activeRecIdx" (click)="activeRecIdx = i"></button>
              </div>
              <button class="btn btn-primary btn-large" [routerLink]="dashSvc.recommendations()[activeRecIdx]?.routerLink ?? '/ruta'">
                🚀 Comenzar
              </button>
            </div>
          </div>

          <!-- RECENT ACTIVITY -->
          <div class="recent-activity glass-card">
            <h3>📋 Actividad Reciente</h3>
            <div class="activity-list" *ngIf="dashSvc.activities().length > 0; else noActivity">
              <div *ngFor="let act of dashSvc.activities().slice(0, 8)" class="activity-item">
                <span class="activity-icon">{{ act.type === 'leccion' ? '✅' : '📝' }}</span>
                <div class="activity-info">
                  <span class="activity-title">{{ act.title }}</span>
                  <span class="activity-time">{{ dashSvc.getRelativeTime(act.timestamp) }}</span>
                </div>
                <span class="activity-score" *ngIf="act.score !== undefined">{{ act.type === 'leccion' ? act.score + '%' : act.totalCorrect + '/' + act.totalQuestions }}</span>
              </div>
            </div>
            <ng-template #noActivity>
              <div class="empty-state-small activity-empty">
                <span class="empty-icon">🕐</span>
                <p>Tu historial aparecerá aquí cuando completes lecciones o ensayos</p>
              </div>
            </ng-template>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-layout { display: flex; min-height: 100vh; background: #000000; color: #ffffff; }
    .text-gradient { background: var(--gradient-brand); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

    /* SIDEBAR */
    .sidebar { width: 260px; background: rgba(13,15,23,0.95); border-right: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; height: 100vh; z-index: 100; }
    .sidebar-header { padding: 1.5rem; border-bottom: 1px solid var(--glass-border); }
    .sidebar-logo { font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; }
    .sidebar-nav { flex: 1; padding: 1rem 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; }
    .nav-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.85rem 1rem; border-radius: 10px; color: var(--text-secondary); text-decoration: none; transition: all 0.2s; cursor: pointer; background: transparent; border: none; width: 100%; text-align: left; font-size: 0.95rem; }
    .nav-item:hover { background: rgba(255,255,255,0.05); color: #fff; }
    .nav-item.active { background: rgba(99,102,241,0.15); color: var(--accent-primary); font-weight: 600; }
    .nav-icon { font-size: 1.2rem; width: 24px; text-align: center; }
    .sidebar-footer { padding: 1rem 0.75rem; border-top: 1px solid var(--glass-border); }
    .logout-btn:hover { background: rgba(239,68,68,0.15); color: #ef4444; }

    /* MOBILE */
    .mobile-header { display: none; position: fixed; top: 0; left: 0; right: 0; height: 60px; background: rgba(13,15,23,0.95); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.1); padding: 0 1rem; align-items: center; gap: 1rem; z-index: 101; }
    .mobile-menu-btn { background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; padding: 0.5rem; }
    .mobile-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 200; }
    .mobile-overlay.open { display: block; }
    .mobile-menu { position: absolute; top: 0; left: 0; width: 280px; height: 100%; background: rgba(13,15,23,0.98); padding: 2rem 1rem; }

    /* MAIN */
    .main-content { flex: 1; margin-left: 260px; padding: 2rem; }

    /* WELCOME */
    .welcome-section { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
    .welcome-text h1 { font-family: var(--font-heading); font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; color: #ffffff; }
    .welcome-text p { color: #9ca3af; }
    .welcome-date { color: #9ca3af; font-size: 0.85rem; margin-top: 0.45rem; }
    .welcome-actions { display: flex; align-items: center; gap: 0.75rem; }
    .profile-menu-wrap { position: relative; }
    .profile-trigger { display: flex; align-items: center; gap: 0.6rem; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.03); color: #fff; border-radius: 999px; padding: 0.35rem 0.75rem 0.35rem 0.35rem; cursor: pointer; text-decoration: none; }
    .profile-trigger:hover { border-color: rgba(133,92,214,0.6); }
    .profile-avatar-wrap { position: relative; width: 52px; height: 52px; display: inline-block; flex-shrink: 0; }
    .profile-avatar { width: 52px; height: 52px; border-radius: 50%; object-fit: cover; }
    .profile-avatar.fallback { display: grid; place-items: center; background: linear-gradient(135deg, #855cd6, #6b46b8); font-weight: 700; font-size: 0.9rem; }
    .profile-emoji-badge { position: absolute; right: -5px; bottom: -5px; background: rgba(0,0,0,0.85); border: 1px solid rgba(255,255,255,0.18); border-radius: 999px; padding: 0.08rem 0.28rem; font-size: 0.72rem; line-height: 1; }
    .plan-badge { font-size: 0.95rem; letter-spacing: 0.02em; padding: 0.48rem 0.95rem; border-radius: 999px; font-weight: 700; background: rgba(148,163,184,0.2); color: #cbd5e1; border: 1px solid rgba(148,163,184,0.3); line-height: 1; }
    .plan-badge.pro { background: rgba(245,158,11,0.18); color: #fbbf24; border-color: rgba(245,158,11,0.35); }

    /* METRICS */
    .metrics-section { display: grid; grid-template-columns: 1.2fr 0.9fr 0.9fr; gap: 1.5rem; margin-bottom: 2rem; }
    .metric-card { padding: 1.5rem; border-radius: 16px; display: flex; flex-direction: column; background: rgba(13,15,23,0.95); border: 1px solid rgba(255,255,255,0.1); transition: border-color 0.3s, box-shadow 0.3s; }
    .metric-card:hover { border-color: rgba(133,92,214,0.3); box-shadow: 0 0 20px rgba(133,92,214,0.08); }
    .metric-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .metric-label { font-size: 0.9rem; color: #9ca3af; font-weight: 500; }
    .metric-icon { font-size: 1.5rem; }
    .metric-body { flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
    .metric-number { font-size: 3rem; font-weight: 800; font-family: var(--font-heading); background: var(--gradient-brand); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .metric-number.streak { background: linear-gradient(135deg, #f97316, #ea580c); -webkit-background-clip: text; }
    .metric-unit { font-size: 1rem; color: #9ca3af; }
    .metric-footer { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1); }
    .metric-subtext { color: #9ca3af; font-size: 0.85rem; }

    /* MASTERY */
    .mastery-card { }
    .mastery-body { flex-direction: column; align-items: stretch !important; gap: 1rem !important; }
    .mastery-item { display: flex; flex-direction: column; gap: 0.35rem; }
    .mastery-top { display: flex; align-items: center; gap: 0.5rem; }
    .mastery-icon { font-size: 1.1rem; }
    .mastery-name { flex: 1; font-size: 0.9rem; font-weight: 500; color: #e5e7eb; }
    .mastery-pct { font-size: 0.9rem; font-weight: 700; color: var(--accent-primary); }
    .mastery-bar-bg { height: 6px; background: rgba(255,255,255,0.1); border-radius: 99px; overflow: hidden; }
    .mastery-bar-fill { height: 100%; border-radius: 99px; transition: width 0.6s ease; }
    .mastery-sub { font-size: 0.75rem; color: #6b7280; }

    /* RECORD */
    .record-display { display: flex; flex-direction: column; align-items: center; gap: 0.3rem; }
    .record-score { font-size: 3rem; font-weight: 800; font-family: var(--font-heading); background: linear-gradient(135deg, #fbbf24, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1.1; }
    .record-total { font-size: 1.5rem; opacity: 0.7; }
    .record-label { font-size: 0.85rem; color: #9ca3af; }
    .record-ensayo { font-size: 0.8rem; color: #6b7280; margin-top: 0.25rem; }

    /* EMPTY STATES */
    .empty-state-small { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; text-align: center; padding: 1rem; }
    .empty-state-small .empty-icon { font-size: 2rem; opacity: 0.6; }
    .empty-state-small p { font-size: 0.85rem; color: #6b7280; margin: 0; max-width: 200px; }
    .btn-small-link { font-size: 0.8rem; color: var(--accent-primary); font-weight: 600; text-decoration: none; margin-top: 0.25rem; transition: opacity 0.2s; }
    .btn-small-link:hover { opacity: 0.8; }

    /* ACTIVITY SECTION */
    .activity-section { display: grid; grid-template-columns: 1.5fr 1fr; gap: 1.5rem; }
    .activity-card, .recent-activity { padding: 1.5rem; border-radius: 16px; background: rgba(13,15,23,0.95); border: 1px solid rgba(255,255,255,0.1); transition: border-color 0.3s; }
    .activity-card:hover, .recent-activity:hover { border-color: rgba(133,92,214,0.2); }
    .activity-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .activity-header h3 { font-size: 1.1rem; font-weight: 600; color: #ffffff; }
    .activity-badge { background: rgba(133,92,214,0.2); color: var(--accent-primary); padding: 0.3rem 0.75rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
    .activity-body { display: flex; flex-direction: column; gap: 1.5rem; }

    /* RECOMMENDATION */
    .recommendation-content { display: flex; gap: 1.25rem; animation: fadeInRec 0.3s ease; }
    .recommendation-content.hidden { display: none; }
    @keyframes fadeInRec { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    .recommendation-icon { font-size: 2.5rem; background: rgba(133,92,214,0.1); padding: 1rem; border-radius: 12px; height: fit-content; }
    .recommendation-text h4 { font-size: 1.1rem; margin-bottom: 0.5rem; color: #fff; }
    .recommendation-text p { color: #9ca3af; font-size: 0.95rem; line-height: 1.5; margin-bottom: 1rem; }
    .recommendation-stats { display: flex; gap: 1.5rem; font-size: 0.85rem; color: #9ca3af; }
    .rec-nav { display: flex; gap: 0.4rem; justify-content: center; }
    .rec-dot { width: 8px; height: 8px; border-radius: 50%; border: none; background: rgba(255,255,255,0.2); cursor: pointer; padding: 0; transition: all 0.2s; }
    .rec-dot.active { background: var(--accent-primary); width: 20px; border-radius: 4px; }
    .btn-large { padding: 1rem 2rem; font-size: 1rem; }

    /* RECENT ACTIVITY */
    .recent-activity h3 { font-size: 1.1rem; font-weight: 600; margin-bottom: 1.5rem; color: #ffffff; }
    .activity-list { display: flex; flex-direction: column; gap: 0.6rem; max-height: 380px; overflow-y: auto; }
    .activity-list::-webkit-scrollbar { width: 4px; }
    .activity-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 99px; }
    .activity-item { display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: rgba(255,255,255,0.03); border-radius: 10px; transition: background 0.2s; }
    .activity-item:hover { background: rgba(255,255,255,0.07); }
    .activity-item .activity-icon { font-size: 1.25rem; }
    .activity-info { flex: 1; display: flex; flex-direction: column; min-width: 0; }
    .activity-title { font-size: 0.9rem; font-weight: 500; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .activity-time { font-size: 0.8rem; color: #9ca3af; }
    .activity-score { font-weight: 700; color: #855cd6; font-size: 0.9rem; white-space: nowrap; }
    .activity-empty { padding: 2rem 1rem; }

    .glass-card { background: rgba(13,15,23,0.95); border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(10px); }

    /* RESPONSIVE */
    @media (max-width: 1024px) {
      .metrics-section { grid-template-columns: 1fr; }
      .activity-section { grid-template-columns: 1fr; }
    }
    @media (max-width: 768px) {
      .sidebar { display: none; }
      .mobile-header { display: flex; }
      .main-content { margin-left: 0; padding-top: 80px; }
      .welcome-actions { width: 100%; justify-content: space-between; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  firestoreService = inject(FirestoreService);
  dashSvc = inject(DashboardService);
  paesContent = inject(PaesContentService);
  router = inject(Router);

  userProfile: any = null;
  mobileMenuOpen = false;
  activeRecIdx = 0;

  userName = 'Estudiante';

  get currentDate(): string {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('es-CL', options);
  }

  get profileInitial(): string {
    return this.userName?.charAt(0)?.toUpperCase() || 'U';
  }

  get isProPlan(): boolean {
    const plan = this.userProfile?.plan || this.userProfile?.subscription?.tier;
    return plan === 'premium' || plan === 'pro';
  }

  getMasteryColor(pct: number): string {
    if (pct >= 80) return 'linear-gradient(90deg, #10b981, #34d399)';
    if (pct >= 50) return 'linear-gradient(90deg, #855cd6, #a78bfa)';
    if (pct >= 25) return 'linear-gradient(90deg, #f59e0b, #fbbf24)';
    return 'linear-gradient(90deg, #ef4444, #f87171)';
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
        }
      }
    });
  }

  async logout() {
    await firstValueFrom(this.authService.logout());
    this.router.navigate(['/login']);
  }
}
