import { Component, inject, OnInit, computed, effect } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { FirestoreService } from '../../core/services/firestore.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { PaesContentService } from '../learning-path/services/paes-content.service';
import { Router, RouterModule } from '@angular/router';
import { ProfileModalComponent } from '../profile/profile-modal.component';
import { SettingsModalComponent } from '../profile/settings-modal.component';
import { HistoryModalComponent } from './history-modal.component';
import { NotificationService } from '../../core/services/notification.service';
import { AdminService } from '../admin/services/admin.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProfileModalComponent, SettingsModalComponent, HistoryModalComponent],
  template: `
    <div class="dashboard-layout">
      <!-- SIDEBAR -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <a routerLink="/dashboard" class="sidebar-logo" style="text-decoration:none;"><span class="text-gradient">EstudiaUni</span></a>
        </div>
        <nav class="sidebar-nav">
          <a class="nav-item active" routerLink="/dashboard">
            <span class="nav-icon">🏠</span>
            <span class="nav-text">Inicio</span>
          </a>
          <a class="nav-item" routerLink="/ruta">
            <span class="nav-icon">🗺️</span>
            <span class="nav-text">Ruta de Aprendizaje</span>
          </a>

          <a class="nav-item" routerLink="/ensayos">
            <span class="nav-icon">📚</span>
            <span class="nav-text">Ensayos PAES</span>
          </a>
        </nav>
        <div class="sidebar-footer">
          <a class="nav-item" (click)="showSettingsModal = true">
            <span class="nav-icon">⚙️</span>
            <span class="nav-text">Configuración</span>
          </a>
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
            <a class="nav-item active" routerLink="/dashboard" (click)="mobileMenuOpen = false">
              <span class="nav-icon">🏠</span>
              <span class="nav-text">Inicio</span>
            </a>
            <a class="nav-item" routerLink="/ruta" (click)="mobileMenuOpen = false">
              <span class="nav-icon">🗺️</span>
              <span class="nav-text">Ruta de Aprendizaje</span>
            </a>

            <a class="nav-item" routerLink="/ensayos" (click)="mobileMenuOpen = false">
              <span class="nav-icon">📚</span>
              <span class="nav-text">Ensayos PAES</span>
            </a>
          </nav>
          <div class="mobile-footer" style="padding: 1rem; border-top: 1px solid rgba(255,255,255,0.1);">
            <a class="nav-item" (click)="showSettingsModal = true; mobileMenuOpen = false">
              <span class="nav-icon">⚙️</span>
              <span class="nav-text">Configuración</span>
            </a>
          </div>
        </div>
      </div>

      <!-- MAIN CONTENT -->
      <main class="main-content">
        <!-- WELCOME -->
        <section class="welcome-section">
          <div class="welcome-text">
            <h1>¡Hola, <span class="text-gradient">{{ userName() }}</span>! 👋</h1>
            <p>Bienvenido de vuelta. Aquí está tu resumen de hoy.</p>
            <div class="welcome-date">{{ currentDate }}</div>
          </div>
          <div class="welcome-actions">
            <span class="plan-badge" [class.pro]="isProPlan() && !adminService.isAdmin()" [class.admin]="adminService.isAdmin()">{{ adminService.isAdmin() ? 'ADMIN' : (isProPlan() ? 'PRO' : 'BASICO') }}</span>
            <div class="profile-menu-wrap">
              <button class="profile-trigger" (click)="showProfileModal = true">
                <span class="profile-avatar-wrap">
                  <img *ngIf="firestoreService.profileSignal()?.photoURL; else avatarFallback" [src]="firestoreService.profileSignal()?.photoURL" alt="Foto de perfil" class="profile-avatar"/>
                  <ng-template #avatarFallback><span class="profile-avatar fallback">{{ profileInitial() }}</span></ng-template>
                  <span class="profile-emoji-badge">{{ firestoreService.profileSignal()?.profileEmoji || '✨' }}</span>
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
                <div *ngFor="let m of dashSvc.subjectMasteries()" class="mastery-item clickable" (click)="router.navigate(['/ruta', m.subjectId])">
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
          <div class="metric-card glass-card record-card">
            <div class="metric-header record-header">
              <button class="nav-arrow" (click)="prevRecordSubject()">‹</button>
              <span class="metric-label">{{ recordSubjects[currentRecordIdx].name }}</span>
              <button class="nav-arrow" (click)="nextRecordSubject()">›</button>
            </div>
            <div class="metric-body">
              <ng-container *ngIf="displayedRecord; else noRecord">
                <div class="record-display">
                  <div class="record-score">{{ displayedRecord.correctAnswers }}<span class="record-total">/{{ displayedRecord.totalQuestions }}</span></div>
                  <span class="record-label">Respuestas Correctas</span>
                  <span class="record-ensayo">{{ displayedRecord.ensayoTitle }}</span>
                  <span class="record-materia-badge" *ngIf="currentRecordIdx === 0 && displayedRecord.subject !== 'general'">{{ getSubjectName(displayedRecord.subject) }}</span>
                </div>
              </ng-container>
              <ng-template #noRecord>
                <div class="empty-state-small">
                  <span class="empty-icon">📝</span>
                  <p>Sin récord en esta área</p>
                  <a routerLink="/ensayos" class="btn-small-link">Realizar ensayo →</a>
                </div>
              </ng-template>
            </div>
            <div class="rec-nav record-nav-dots" *ngIf="recordSubjects.length > 1">
              <button *ngFor="let s of recordSubjects; let i = index" class="rec-dot" [class.active]="i === currentRecordIdx" (click)="setRecordSubject(i)"></button>
            </div>
          </div>

          <!-- COMBINED STREAK CARD -->
          <div class="metric-card glass-card combined-streak-card clickable" (click)="showStreakInfo = true">
            <div class="metric-header">
              <span class="metric-label">Tus Rachas Activas</span>
              <span class="metric-icon">🔥</span>
            </div>
            <div class="metric-body streaks-container">
              <div class="streak-item normal-streak">
                <div class="streak-icon-wrap">🔥</div>
                <div class="streak-details">
                  <div class="streak-value">{{ dashSvc.streakDays() }} <span class="streak-label">días</span></div>
                  <div class="streak-name">Racha de Estudio</div>
                </div>
              </div>
              
              <div class="streak-divider"></div>
              
              <div class="streak-item super-streak">
                <div class="streak-icon-wrap">⚡</div>
                <div class="streak-details">
                  <div class="streak-value">{{ dashSvc.superStreakDays() }} <span class="streak-label">días</span></div>
                  <div class="streak-name">Súper Racha</div>
                </div>
              </div>
            </div>
            <div class="metric-footer">
              <span class="metric-subtext" *ngIf="dashSvc.superStreakDays() > 0">⚡ ¡Imparable! Dominando al máximo.</span>
              <span class="metric-subtext" *ngIf="dashSvc.streakDays() > 0 && dashSvc.superStreakDays() === 0">🔥 Vas muy bien, intenta la Súper Racha.</span>
              <span class="metric-subtext" *ngIf="dashSvc.streakDays() === 0">Completa una lección para iniciar tu racha.</span>
            </div>
          </div>
        </section>

        <!-- STREAK EXPLANATION MODAL -->
        <div class="modal-overlay" *ngIf="showStreakInfo" (click)="showStreakInfo = false">
          <div class="modal-container glass streak-info-modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>¿Cómo funcionan las Rachas?</h2>
              <button class="close-btn" (click)="showStreakInfo = false">&times;</button>
            </div>
            <div class="modal-body">
              <div class="info-section">
                <div class="info-icon normal">🔥</div>
                <div class="info-content">
                  <h3>Racha de Estudio</h3>
                  <p>Es tu constancia diaria. Se suma cada día que completas al menos <strong>una lección</strong> o <strong>un ensayo</strong>.</p>
                  <span class="info-tip">💡 Tip: ¡Basta con 10 minutos al día para mantenerla viva!</span>
                </div>
              </div>

              <div class="info-divider"></div>

              <div class="info-section">
                <div class="info-icon super">⚡</div>
                <div class="info-content">
                  <h3>Súper Racha</h3>
                  <p>Es el máximo nivel de disciplina. Se suma únicamente si logras:</p>
                  <ul>
                    <li>Completar al menos <strong>una lección</strong> de <strong>CADA materia</strong> activa en tu ruta de aprendizaje durante el mismo día.</li>
                  </ul>
                  <span class="info-tip">🚀 Reto: ¡Mantener esta racha te garantiza un progreso masivo!</span>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn-primary-modal" (click)="showStreakInfo = false">¡Entendido!</button>
            </div>
          </div>
        </div>

        <!-- ACTIVITY / RECOMMENDATION -->
        <section class="activity-section">
          <!-- AI RECOMMENDATIONS -->
          <div class="activity-card glass-card ai-recs-card">
            <div class="activity-header">
              <h3>🤖 Recomendación de la IA</h3>
              <span class="activity-badge">Personalizado</span>
            </div>
            <div class="activity-body ai-body-with-nav">
              <button class="nav-arrow-side left" (click)="prevRecommendation()" *ngIf="dashSvc.recommendations().length > 1">‹</button>
              
              <div class="ai-content-slider">
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
              </div>

              <button class="nav-arrow-side right" (click)="nextRecommendation()" *ngIf="dashSvc.recommendations().length > 1">›</button>
            </div>
            <div class="ai-footer">
              <button class="btn btn-primary btn-large" [routerLink]="dashSvc.recommendations()[activeRecIdx].routerLink || '/ruta'">
                🚀 Comenzar
              </button>
            </div>
          </div>

          <!-- RECENT ACTIVITY -->
          <div class="recent-activity glass-card">
            <div class="activity-header">
              <h3>📋 Actividad Reciente</h3>
              <button class="btn-ver-todo" (click)="showHistoryModal = true">
                📋 Ver todo
              </button>
            </div>
            <div class="activity-list" *ngIf="dashSvc.activities().length > 0; else noActivity">
              <div *ngFor="let act of dashSvc.activities().slice(0, 4)" 
                   class="activity-item"
                   [class.clickable]="act.type === 'ensayo'"
                   (click)="onActivityClick(act)">
                <span class="activity-icon">{{ act.type === 'leccion' ? '✅' : '📝' }}</span>
                <div class="activity-info">
                  <span class="activity-title">{{ act.title }}</span>
                  <span class="activity-time">{{ dashSvc.getRelativeTime(act.timestamp) }}</span>
                </div>
                <div class="activity-right">
                  <span class="clickable-badge" *ngIf="act.type === 'ensayo'">Ver →</span>
                  <span class="activity-score" *ngIf="act.score !== undefined">{{ act.type === 'leccion' ? act.score + '%' : act.totalCorrect + '/' + act.totalQuestions }}</span>
                </div>
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

    <!-- MODALS -->
    <app-profile-modal *ngIf="showProfileModal" (close)="onProfileModalClose()"></app-profile-modal>
    <app-settings-modal *ngIf="showSettingsModal" (close)="onSettingsModalClose()"></app-settings-modal>
    <app-history-modal *ngIf="showHistoryModal" (close)="showHistoryModal = false"></app-history-modal>
  `,
  styles: [`
    .dashboard-layout { display: flex; min-height: 100vh; background: var(--bg-color); color: var(--text-primary); }
    .text-gradient { background: var(--gradient-brand); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

    /* SIDEBAR */
    .sidebar { width: 260px; background: rgba(13,15,23,0.95); border-right: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; height: 100vh; z-index: 100; }
    .sidebar-header { 
      padding: 2.5rem 1.5rem 2rem; 
      border-bottom: 1px solid rgba(255,255,255,0.15); 
      text-align: center;
    }
    .sidebar-logo { 
      font-family: var(--font-heading); 
      font-size: 2.2rem; 
      font-weight: 900; 
      background: linear-gradient(135deg, #ffffff 40%, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.04em; 
      text-shadow: 0 0 15px rgba(139, 92, 246, 0.3);
      position: relative;
    }
    .sidebar-nav { flex: 1; padding: 1rem 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; }
    .nav-item { display: flex; align-items: center; gap: 0.85rem; padding: 0.9rem 1.1rem; border-radius: 12px; color: #ffffff; text-decoration: none; transition: all 0.2s; cursor: pointer; background: transparent; border: none; width: 100%; text-align: left; font-size: 1.05rem; font-weight: 500; }
    .nav-item:hover { background: rgba(255,255,255,0.12); color: #fff; transform: translateX(4px); }
    .nav-item.active { background: rgba(99,102,241,0.25); color: #ffffff; border: 1.5px solid rgba(255,255,255,0.15); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .nav-icon { font-size: 1.35rem; width: 32px; display: flex; align-items: center; justify-content: center; }
    .sidebar-footer { padding: 1.25rem 1rem; border-top: none; display: flex; justify-content: center; }
    .logout-btn { 
      width: fit-content;
      min-width: 180px;
      justify-content: center; 
      padding: 0.65rem 1rem;
      border: 1px solid rgba(239, 68, 68, 0.18) !important; 
      background: transparent !important; 
      color: rgba(252, 165, 165, 0.6) !important; 
      margin: 0 auto;
      border-radius: 14px;
      font-weight: 500;
    }
    .logout-btn:hover { background: rgba(239, 68, 68, 0.1) !important; border-color: #ef4444 !important; color: #ef4444 !important; transform: none !important; }

    /* MOBILE */
    .mobile-header { display: none; position: fixed; top: 0; left: 0; right: 0; height: 60px; background: rgba(13,15,23,0.95); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.1); padding: 0 1rem; align-items: center; gap: 1rem; z-index: 101; }
    .mobile-menu-btn { background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; padding: 0.5rem; }
    .mobile-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 200; }
    .mobile-overlay.open { display: block; }
    .mobile-menu { position: absolute; top: 0; left: 0; width: 280px; height: 100%; background: rgba(13,15,23,0.98); padding: 2rem 1rem; }

    /* MAIN */
    .main-content { flex: 1; margin-left: 260px; padding: 2.5rem; max-width: calc(100% - 260px); }

    /* WELCOME */
    .welcome-section { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
    .welcome-text h1 { font-family: var(--font-heading); font-size: 2.8rem; font-weight: 800; margin-bottom: 0.5rem; color: var(--text-primary); letter-spacing: -0.02em; }
    .welcome-text p { color: var(--text-secondary); font-weight: 500; font-size: 1.15rem; }
    .welcome-date { color: var(--text-muted); font-size: 0.9rem; margin-top: 0.5rem; font-weight: 500; }
    .welcome-actions { display: flex; align-items: center; gap: 1rem; }
    .profile-menu-wrap { position: relative; }
    .profile-trigger { display: flex; align-items: center; justify-content: center; border: 2px solid var(--glass-border); background: #ffffff; color: var(--text-primary); border-radius: 50%; padding: 0.35rem; cursor: pointer; text-decoration: none; transition: all 0.2s; width: 62px; height: 62px; box-shadow: var(--shadow-sm); }
    .profile-trigger:hover { border-color: var(--accent-primary); box-shadow: var(--shadow); }
    .profile-avatar-wrap { position: relative; width: 52px; height: 52px; display: inline-block; flex-shrink: 0; }
    .profile-avatar { width: 52px; height: 52px; border-radius: 50%; object-fit: cover; }
    .profile-avatar.fallback { display: grid; place-items: center; background: var(--gradient-brand); font-weight: 700; font-size: 0.9rem; color: white; }
    .profile-emoji-badge { position: absolute; right: -5px; bottom: -5px; background: #111827; border: 1.5px solid rgba(255,255,255,0.2); border-radius: 999px; padding: 0.1rem 0.3rem; font-size: 0.75rem; line-height: 1; }
    .plan-badge { font-size: 0.85rem; letter-spacing: 0.05em; padding: 0.5rem 1rem; border-radius: 999px; font-weight: 800; background: var(--bg-secondary); color: var(--text-secondary); border: 2px solid var(--glass-border); line-height: 1; }
    .plan-badge.pro { background: rgba(245,158,11,0.1); color: #d97706; border-color: rgba(245,158,11,0.3); }
    .plan-badge.admin { background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #fff; border-color: #f59e0b; text-shadow: 0 1px 2px rgba(0,0,0,0.2); box-shadow: 0 0 10px rgba(245,158,11,0.5); border: none; }

    /* METRICS */
    .metrics-section { display: grid; grid-template-columns: 1.2fr 0.9fr 1.1fr; gap: 1.5rem; margin-bottom: 2rem; }
    .metric-card { padding: 1.5rem; border-radius: 16px; display: flex; flex-direction: column; background: #ffffff; border: 2px solid var(--glass-border); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: var(--shadow); }
    .metric-card:hover { border-color: rgba(133,92,214,0.4); transform: translateY(-4px); box-shadow: var(--shadow-md); }
    .metric-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .metric-label { font-size: 0.9rem; color: var(--text-secondary); font-weight: 600; }
    .metric-icon { font-size: 1.5rem; }
    .metric-body { flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
    .metric-number { font-size: 3rem; font-weight: 800; font-family: var(--font-heading); background: var(--gradient-brand); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1.1; }
    .metric-unit { font-size: 1rem; color: var(--text-muted); font-weight: 600; margin-top: -0.25rem; }
    .metric-footer { margin-top: 1rem; padding-top: 1rem; border-top: 1.5px solid var(--glass-border); }
    .metric-subtext { color: var(--text-secondary); font-size: 0.85rem; font-weight: 500; }

    /* MASTERY */
    .mastery-card { }
    .mastery-body { flex-direction: column; align-items: stretch !important; gap: 1rem !important; }
    .mastery-item { display: flex; flex-direction: column; gap: 0.35rem; }
    .mastery-top { display: flex; align-items: center; gap: 0.5rem; }
    .mastery-icon { font-size: 1.1rem; }
    .mastery-name { flex: 1; font-size: 0.9rem; font-weight: 600; color: var(--text-primary); }
    .mastery-pct { font-size: 0.95rem; font-weight: 800; color: var(--accent-primary); }
    .mastery-bar-bg { height: 8px; background: var(--bg-secondary); border-radius: 99px; overflow: hidden; border: 1px solid var(--glass-border); }
    .mastery-bar-fill { height: 100%; border-radius: 99px; transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); }
    .mastery-sub { font-size: 0.8rem; color: var(--text-muted); font-weight: 600; }

    /* RECORD */
    .record-card { position: relative; padding-bottom: 2rem; }
    .record-header { display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 1rem; }
    .nav-arrow { background: rgba(133,92,214,0.1); border: none; color: var(--accent-primary); font-size: 1.5rem; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; padding-bottom: 2px; }
    .nav-arrow:hover { background: var(--accent-primary); color: #fff; transform: scale(1.1); }
    .record-display { display: flex; flex-direction: column; align-items: center; gap: 0.3rem; position: relative; }
    .record-score { font-size: 3rem; font-weight: 800; font-family: var(--font-heading); background: linear-gradient(135deg, #fbbf24, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1.1; display: flex; align-items: baseline; }
    .record-total { font-size: 1.5rem; opacity: 0.7; -webkit-text-fill-color: var(--text-primary); margin-left: 2px; }
    .record-label { font-size: 0.85rem; color: var(--text-secondary); font-weight: 600; text-align: center; width: 100%; }
    .record-ensayo { font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem; text-align: center; }
    .record-materia-badge { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: var(--accent-primary); background: rgba(133,92,214,0.1); padding: 0.2rem 0.6rem; border-radius: 6px; margin-top: 0.5rem; border: 1px solid rgba(133,92,214,0.2); }
    .record-nav-dots { position: absolute; bottom: 0.75rem; left: 0; right: 0; }

    /* EMPTY STATES */
    .empty-state-small { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; text-align: center; padding: 1rem; background: rgba(0,0,0,0.02); border-radius: 12px; border: 2.5px dashed rgba(0,0,0,0.18); }
    .empty-state-small .empty-icon { font-size: 2rem; opacity: 0.8; }
    .empty-state-small p { font-size: 0.85rem; color: var(--text-secondary); margin: 0; max-width: 200px; }
    .btn-ver-todo { padding: 0.45rem 0.9rem; border-radius: 10px; background: rgba(133,92,214,0.08); color: var(--accent-primary); font-size: 0.8rem; font-weight: 700; border: 1.5px solid rgba(133,92,214,0.15); cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 0.4rem; }
    .btn-ver-todo:hover { background: var(--accent-primary); color: #fff; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(133,92,214,0.2); }

    /* ACTIVITY SECTION */
    .activity-section { display: grid; grid-template-columns: 1.5fr 1fr; gap: 1.5rem; }
    .activity-card, .recent-activity { padding: 1.5rem; border-radius: 16px; background: #ffffff; border: 2px solid var(--glass-border); transition: all 0.3s; box-shadow: var(--shadow); }
    .activity-card:hover, .recent-activity:hover { border-color: rgba(133,92,214,0.4); box-shadow: var(--shadow-md); }
    .activity-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .activity-header h3 { font-size: 1.1rem; font-weight: 600; color: var(--text-primary); margin: 0; }
    .activity-badge { background: rgba(133,92,214,0.1); color: var(--accent-primary); padding: 0.3rem 0.75rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
    .activity-body { display: flex; flex-direction: column; gap: 1.5rem; }

    /* RECOMMENDATION */
    .recommendation-content { display: flex; gap: 1.25rem; animation: fadeInRec 0.3s ease; }
    .recommendation-content.hidden { display: none; }
    @keyframes fadeInRec { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    .recommendation-icon { font-size: 2.5rem; background: rgba(133,92,214,0.1); padding: 1rem; border-radius: 12px; height: fit-content; }
    .recommendation-text h4 { font-size: 1.1rem; margin: 0 0 0.5rem; color: var(--text-primary); font-family: var(--font-heading); font-weight: 700; }
    .recommendation-text p { color: var(--text-secondary); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1rem; }
    .recommendation-stats { display: flex; gap: 1.5rem; font-size: 0.85rem; color: var(--text-secondary); font-weight: 600; }
    .rec-nav { display: flex; gap: 0.4rem; justify-content: center; }
    .rec-dot { width: 8px; height: 8px; border-radius: 50%; border: none; background: rgba(0,0,0,0.1); cursor: pointer; padding: 0; transition: all 0.2s; }
    .rec-dot.active { background: var(--accent-primary); width: 20px; border-radius: 4px; }
    .btn-large { padding: 1rem 2rem; font-size: 1rem; background: var(--accent-primary); border-radius: 14px; color: #fff; font-family: var(--font-heading); font-weight: 700; border: none; cursor: pointer; box-shadow: 0 4px 0 #6b46b8; transition: all 0.2s; }
    .btn-large:hover { transform: translateY(2px); box-shadow: 0 2px 0 #6b46b8; }

    /* RECENT ACTIVITY */
    .recent-activity h3 { font-size: 1.1rem; font-weight: 600; margin: 0 0 1.5rem; color: var(--text-primary); }
    .activity-list { display: flex; flex-direction: column; gap: 0.6rem; max-height: 380px; overflow-y: auto; padding-right: 4px; }
    .activity-list::-webkit-scrollbar { width: 4px; }
    .activity-list::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 99px; }
    .activity-item { display: flex; align-items: center; gap: 1rem; padding: 0.85rem; background: #ffffff; border: 2px solid var(--glass-border); border-radius: 14px; transition: all 0.2s; }
    .activity-item:hover { background: var(--bg-secondary); border-color: var(--glass-border); transform: translateX(4px); }
    .activity-item.clickable { cursor: pointer; border-color: rgba(133,92,214,0.3); }
    .activity-item.clickable:hover { background: var(--bg-secondary); border-color: var(--accent-primary); transform: translateX(4px); box-shadow: var(--shadow-sm); }
    .activity-item .activity-icon { font-size: 1.25rem; background: var(--bg-secondary); width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .activity-info { flex: 1; display: flex; flex-direction: column; min-width: 0; }
    .activity-title { font-size: 0.95rem; font-weight: 700; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
    .activity-time { font-size: 0.8rem; color: var(--text-muted); font-weight: 500; }
    .activity-score { font-weight: 800; color: var(--accent-primary); font-size: 0.9rem; white-space: nowrap; background: rgba(133,92,214,0.25); padding: 0.25rem 0.75rem; border-radius: 99px; }
    .activity-right { display: flex; align-items: center; gap: 0.75rem; }
    .clickable-badge { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; background: var(--accent-primary); color: #fff; padding: 0.25rem 0.6rem; border-radius: 8px; opacity: 0.9; box-shadow: 0 2px 8px rgba(133,92,214,0.2); }
    .header-title-group { display: flex; align-items: center; gap: 0.75rem; }
    .nav-arrow.small { 
      width: 28px; 
      height: 28px; 
      font-size: 1.2rem; 
      background: rgba(133,92,214,0.08); 
      border: 1.5px solid rgba(133,92,214,0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      cursor: pointer;
      color: var(--accent-primary);
      transition: all 0.2s;
      padding: 0;
      line-height: 1;
    }
    .nav-arrow.small:hover {
      background: var(--accent-primary);
      color: #fff;
      transform: scale(1.1);
    }
    .mastery-item { padding: 0.85rem; border-radius: 12px; transition: all 0.2s; }
    .mastery-item.clickable { cursor: pointer; }
    .mastery-item.clickable:hover { background: rgba(133, 92, 214, 0.08); transform: translateX(4px); }
    .mastery-top { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; }
    .mastery-icon { font-size: 1.25rem; }
    .mastery-name { font-weight: 700; flex: 1; font-size: 0.95rem; }
    .mastery-pct { font-weight: 800; color: var(--accent-primary); }
    .mastery-bar-bg { height: 8px; background: rgba(0,0,0,0.05); border-radius: 4px; overflow: hidden; margin-bottom: 0.35rem; }
    .mastery-bar-fill { height: 100%; border-radius: 4px; transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); }
    .mastery-sub { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; }

    /* COMBINED STREAK CARD */
    .combined-streak-card .metric-body { flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: stretch; gap: 1rem; padding-top: 0.5rem; }
    .streak-item { display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1rem; border-radius: 14px; background: rgba(0,0,0,0.02); border: 1.5px solid var(--glass-border); transition: all 0.2s; }
    .streak-item:hover { transform: translateX(4px); background: #ffffff; }
    .streak-item.normal-streak:hover { border-color: rgba(249,115,22,0.3); box-shadow: 0 4px 12px rgba(249,115,22,0.08); }
    .streak-item.super-streak:hover { border-color: rgba(139,92,246,0.3); box-shadow: 0 4px 12px rgba(139,92,246,0.08); }
    
    .streak-icon-wrap { font-size: 1.8rem; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 12px; }
    .normal-streak .streak-icon-wrap { background: rgba(249,115,22,0.1); color: #ea580c; }
    .super-streak .streak-icon-wrap { background: rgba(139,92,246,0.1); color: #7c3aed; }
    
    .streak-details { display: flex; flex-direction: column; flex: 1; }
    .streak-value { font-size: 2.2rem; font-weight: 800; font-family: var(--font-heading); line-height: 1; margin-bottom: 0.15rem; display: flex; align-items: baseline; gap: 0.25rem; }
    .normal-streak .streak-value { background: linear-gradient(135deg, #f97316, #ea580c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .super-streak .streak-value { background: linear-gradient(135deg, #8b5cf6, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .streak-label { font-size: 1rem; font-weight: 700; color: var(--text-muted); -webkit-text-fill-color: initial; }
    .streak-name { font-size: 0.85rem; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    
    .streak-divider { height: 2px; background: var(--glass-border); width: 60%; margin: 0 auto; border-radius: 2px; }
    .combined-streak-card.clickable { cursor: pointer; }
    .combined-streak-card.clickable:hover { transform: translateY(-6px) scale(1.02); border-color: var(--accent-primary); box-shadow: 0 10px 25px rgba(133,92,214,0.15); }

    /* STREAK INFO MODAL */
    .streak-info-modal { max-width: 500px !important; }
    .info-section { display: flex; gap: 1.25rem; align-items: flex-start; padding: 0.5rem 0; }
    .info-icon { font-size: 2.5rem; width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; border-radius: 16px; flex-shrink: 0; }
    .info-icon.normal { background: rgba(249,115,22,0.1); }
    .info-icon.super { background: rgba(139,92,246,0.1); }
    .info-content h3 { margin: 0 0 0.5rem 0; font-size: 1.2rem; color: var(--text-primary); }
    .info-content p { margin: 0 0 0.75rem 0; font-size: 0.95rem; line-height: 1.5; color: var(--text-secondary); }
    .info-content ul { margin: 0 0 0.75rem 0; padding-left: 1.2rem; font-size: 0.9rem; color: var(--text-secondary); }
    .info-content li { margin-bottom: 0.4rem; }
    .info-tip { display: block; font-size: 0.85rem; font-weight: 700; color: var(--accent-primary); background: rgba(133,92,214,0.08); padding: 0.6rem 0.85rem; border-radius: 8px; border-left: 3px solid var(--accent-primary); }
    .info-divider { height: 1.5px; background: var(--glass-border); margin: 1.25rem 0; opacity: 0.6; }
    .btn-primary-modal { width: 100%; padding: 0.85rem; border-radius: 12px; background: var(--accent-primary); color: white; border: none; font-weight: 700; cursor: pointer; transition: all 0.2s; }
    .btn-primary-modal:hover { filter: brightness(1.1); transform: translateY(-2px); }

    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: grid; place-items: center; z-index: 1000; padding: 1.5rem; animation: fadeIn 0.2s ease; }
    .modal-container.glass { background: rgba(255,255,255,0.95); border: 2px solid var(--glass-border); border-radius: 24px; box-shadow: 0 20px 50px rgba(0,0,0,0.2); width: 100%; overflow: hidden; }
    .modal-header { padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--glass-border); }
    .modal-header h2 { margin: 0; font-size: 1.25rem; font-weight: 800; color: var(--text-primary); }
    .close-btn { background: none; border: none; font-size: 1.75rem; color: var(--text-muted); cursor: pointer; line-height: 1; }
    .modal-body { padding: 1.5rem; }
    .modal-footer { padding: 1.5rem; border-top: 1px solid var(--glass-border); }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    /* AI Recs Side Nav */
    .ai-recs-card { display: flex; flex-direction: column; }
    .ai-body-with-nav { display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 1.5rem; flex: 1; position: relative; padding: 0 1rem; }
    .ai-content-slider { flex: 1; min-width: 0; }
    .nav-arrow-side { background: var(--bg-secondary); border: 2px solid var(--glass-border); color: var(--text-secondary); width: 44px; height: 44px; border-radius: 50%; display: grid; place-items: center; cursor: pointer; transition: all 0.2s; z-index: 5; flex-shrink: 0; font-size: 1.4rem; padding: 0; line-height: 1; }
    .nav-arrow-side:hover { background: #ffffff; color: var(--accent-primary); border-color: var(--accent-primary); transform: scale(1.1); }
    .recommendation-content.hidden { display: none; }
    .ai-footer { padding: 1rem; display: flex; justify-content: center; border-top: 1px solid var(--glass-border); }

    .glass-card { background: #ffffff; border: 1.5px solid var(--glass-border); box-shadow: var(--shadow); }

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
  public authService = inject(AuthService);
  public firestoreService = inject(FirestoreService);
  public dashSvc = inject(DashboardService);
  public paesContent = inject(PaesContentService);
  public router = inject(Router);
  public notificationService = inject(NotificationService);
  public adminService = inject(AdminService);

  mobileMenuOpen = false;
  activeRecIdx = 0;
  showProfileModal = false;
  showSettingsModal = false;
  showHistoryModal = false;
  showStreakInfo = false;
  currentDate = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());

  isProPlan = computed(() => this.firestoreService.profileSignal()?.plan === 'premium');

  profileInitial = computed(() => {
    const p = this.firestoreService.profileSignal();
    return p?.displayName?.charAt(0).toUpperCase() || 'U';
  });

  userName = computed(() => {
    const p = this.firestoreService.profileSignal();
    return p?.displayName?.split(' ')[0] || 'Estudiante';
  });
  currentRecordIdx = 0;
  displayedRecord: any = null;

  recordSubjects = [
    { id: 'all', name: 'Último puntaje más alto' },
    { id: 'comp-lectora', name: 'Competencia Lectora' },
    { id: 'mat1', name: 'Matemática M1' },
    { id: 'mat2', name: 'Matemática M2' },
    { id: 'ciencias-biologia', name: 'Biología' },
    { id: 'ciencias-fisica', name: 'Física' },
    { id: 'ciencias-quimica', name: 'Química' },
    { id: 'ciencias-tp', name: 'Ciencias T.P.' },
    { id: 'historia', name: 'Historia y Cs. Sociales' }
  ];

  constructor() {
    effect(() => {
      this.updateRecordDisplay();
    });
  }

  getMasteryColor(pct: number): string {
    if (pct >= 80) return 'linear-gradient(90deg, #10b981, #34d399)';
    if (pct >= 50) return 'linear-gradient(90deg, #855cd6, #a78bfa)';
    if (pct >= 25) return 'linear-gradient(90deg, #f59e0b, #fbbf24)';
    return 'linear-gradient(90deg, #ef4444, #f87171)';
  }

  ngOnInit() {
    this.firestoreService.getUserProfile().subscribe();
    this.firestoreService.getUserProfile().subscribe({
      next: (profile) => {
        if (profile && profile.notificationsEnabled) {
          this.notificationService.startReminders({
            preferredStudyTime: profile.preferredStudyTime || 'tarde',
            notificationIntensity: profile.notificationIntensity || 'normal',
            notificationsEnabled: true,
          });
        }
      }
    });
  }

  onProfileModalClose() {
    this.showProfileModal = false;
    this.firestoreService.getUserProfile().subscribe();
  }

  onSettingsModalClose() {
    this.showSettingsModal = false;
  }

  updateRecordDisplay() {
    const allRecords = this.dashSvc.paesRecords();
    if (allRecords.length === 0) {
      this.displayedRecord = null;
      return;
    }

    const currentSubjectId = this.recordSubjects[this.currentRecordIdx].id;

    if (currentSubjectId === 'all') {
      this.displayedRecord = this.dashSvc.bestPaesRecord();
    } else {
      const subjectRecords = allRecords.filter(r => r.subject === currentSubjectId || r.subject === currentSubjectId.replace('ciencias-', ''));
      if (subjectRecords.length === 0) {
        this.displayedRecord = null;
      } else {
        this.displayedRecord = subjectRecords.reduce((best, r) => {
          if (r.correctAnswers > best.correctAnswers) return r;
          if (r.correctAnswers === best.correctAnswers) {
            return new Date(r.timestamp).getTime() > new Date(best.timestamp).getTime() ? r : best;
          }
          return best;
        }, subjectRecords[0]);
      }
    }
  }

  getSubjectName(id: string): string {
    return this.recordSubjects.find(s => s.id === id || s.id.replace('ciencias-', '') === id)?.name || id;
  }

  nextRecordSubject() {
    this.currentRecordIdx = (this.currentRecordIdx + 1) % this.recordSubjects.length;
    this.updateRecordDisplay();
  }

  prevRecordSubject() {
    this.currentRecordIdx = (this.currentRecordIdx - 1 + this.recordSubjects.length) % this.recordSubjects.length;
    this.updateRecordDisplay();
  }

  nextRecommendation() {
    const len = this.dashSvc.recommendations().length;
    this.activeRecIdx = (this.activeRecIdx + 1) % len;
  }

  prevRecommendation() {
    const len = this.dashSvc.recommendations().length;
    this.activeRecIdx = (this.activeRecIdx - 1 + len) % len;
  }

  setRecordSubject(idx: number) {
    this.currentRecordIdx = idx;
    this.updateRecordDisplay();
  }

  onActivityClick(act: any) {
    if (act.type === 'ensayo') {
      const ensayoId = act.ensayoId || act.id.match(/^ensayo-(.+?)-\d+$/)?.[1];
      if (ensayoId) {
        this.router.navigate(['/ensayo', ensayoId, 'review'], {
          queryParams: { intento: act.intentoId }
        });
      }
    }
  }

}
