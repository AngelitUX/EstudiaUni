import { Component, inject, OnInit, OnDestroy, computed, effect } from '@angular/core';
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
import { ToastService } from '../../core/services/toast.service';
import { AdminService } from '../admin/services/admin.service';
import { MiniEnsayoService } from '../../core/services/mini-ensayo.service';
import { PaymentService } from '../../core/services/payment.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProfileModalComponent, SettingsModalComponent, HistoryModalComponent],
  template: `
    <div class="dashboard-layout">
      <!-- SIDEBAR -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <a routerLink="/dashboard" class="sidebar-logo" style="text-decoration:none;"><span class="text-gradient" [class.pro-logo]="isProPlan()">EstudiaUni</span></a>
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
          <a class="nav-item" routerLink="/mini-ensayo">
            <span class="nav-icon">🎯</span>
            <span class="nav-text">Mini Ensayos</span>
          </a>
          <a class="nav-item" routerLink="/mente-veloz">
            <span class="nav-icon">⚡</span>
            <span class="nav-text">Mente Veloz</span>
          </a>

          <div class="sidebar-section-title" (click)="toggleHerramientas()">
            HERRAMIENTAS
            <span class="toggle-icon" [style.transform]="herramientasExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'">▼</span>
          </div>
          <div class="sidebar-sub-items" [class.expanded]="herramientasExpanded" [class.collapsible]="isCollapsible">
            <a class="nav-item" routerLink="/encuentra-tu-carrera">
              <span class="nav-icon">🎓</span>
              <span class="nav-text">Encuentra tu Carrera</span>
            </a>
            <a class="nav-item" routerLink="/calculadora-nem">
              <span class="nav-icon">🧮</span>
              <span class="nav-text">Calculadora NEM</span>
            </a>
            <a class="nav-item" routerLink="/recursos">
              <span class="nav-icon">📂</span>
              <span class="nav-text">Recursos Adicionales</span>
            </a>
          </div>
          <!-- Sidebar Promo Card -->
          <div *ngIf="!isProPlan() && !adminService.isAdmin()" class="sidebar-promo-card" (click)="paymentService.openPricingModal()">
            <span class="promo-crown">👑</span>
            <h4>Pásate a PRO</h4>
            <p>Explicaciones con IA y Ensayos Ilimitados</p>
            <button class="btn-promo-sidebar">Ver Planes ⚡</button>
          </div>
        </nav>
        <div class="sidebar-footer" style="flex-direction: column; gap: 0.5rem; padding: 1.25rem 0.75rem;">
          <a class="nav-item" routerLink="/soporte" title="Soporte de Usuario">
            <span class="nav-icon">🎧</span>
            <span class="nav-text">Soporte</span>
          </a>
          <a class="nav-item" (click)="showSettingsModal = true">
            <span class="nav-icon">⚙️</span>
            <span class="nav-text">Configuración</span>
          </a>
          <a class="nav-item logout-btn-sidebar" (click)="confirmLogout()">
            <span class="nav-icon">🚪</span>
            <span class="nav-text">Cerrar Sesión</span>
          </a>
        </div>
      </aside>

      <!-- MOBILE HEADER -->
      <div class="mobile-header">
        <button class="mobile-menu-btn" (click)="mobileMenuOpen = !mobileMenuOpen">☰</button>
        <span class="text-gradient" [class.pro-logo]="isProPlan()">EstudiaUni</span>
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
            <a class="nav-item" routerLink="/mini-ensayo" (click)="mobileMenuOpen = false">
              <span class="nav-icon">🎯</span>
              <span class="nav-text">Mini Ensayos</span>
            </a>
            <a class="nav-item" routerLink="/mente-veloz" (click)="mobileMenuOpen = false">
              <span class="nav-icon">⚡</span>
              <span class="nav-text">Mente Veloz</span>
            </a>

            <div class="sidebar-section-title" (click)="toggleHerramientas()">
              HERRAMIENTAS
              <span class="toggle-icon" [style.transform]="herramientasExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'">▼</span>
            </div>
            <div class="sidebar-sub-items" [class.expanded]="herramientasExpanded" [class.collapsible]="isCollapsible">
              <a class="nav-item" routerLink="/encuentra-tu-carrera" (click)="mobileMenuOpen = false">
                <span class="nav-icon">🎓</span>
                <span class="nav-text">Encuentra tu Carrera</span>
              </a>
              <a class="nav-item" routerLink="/calculadora-nem" (click)="mobileMenuOpen = false">
                <span class="nav-icon">🧮</span>
                <span class="nav-text">Calculadora NEM</span>
              </a>
              <a class="nav-item" routerLink="/recursos" (click)="mobileMenuOpen = false">
                <span class="nav-icon">📂</span>
                <span class="nav-text">Recursos Adicionales</span>
              </a>
            </div>
            
            <!-- Sidebar Promo Card -->
            <div *ngIf="!isProPlan() && !adminService.isAdmin()" class="sidebar-promo-card" (click)="paymentService.openPricingModal()">
              <span class="promo-crown">👑</span>
              <h4>Pásate a PRO</h4>
              <p>Explicaciones con IA y Ensayos Ilimitados</p>
              <button class="btn-promo-sidebar">Ver Planes ⚡</button>
            </div>
          </nav>
          <div class="mobile-footer" style="padding: 1rem; border-top: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; gap: 0.5rem;">
            <a class="nav-item" routerLink="/soporte" (click)="mobileMenuOpen = false">
              <span class="nav-icon">🎧</span>
              <span class="nav-text">Soporte</span>
            </a>
            <a class="nav-item" (click)="showSettingsModal = true; mobileMenuOpen = false">
              <span class="nav-icon">⚙️</span>
              <span class="nav-text">Configuración</span>
            </a>
            <a class="nav-item logout-btn-sidebar" (click)="confirmLogout(); mobileMenuOpen = false">
              <span class="nav-icon">🚪</span>
              <span class="nav-text">Cerrar Sesión</span>
            </a>
          </div>
        </div>
      </div>

      <!-- MAIN CONTENT -->
      <main class="main-content animate-fade-in-down">
        <!-- HEADER -->
        <header class="dashboard-header">
          <div class="header-welcome-text">
            <h1 class="header-greeting">¡Hola, <span class="text-gradient" [class.pro-username]="isProPlan()">{{ userName() }}</span>! 👋</h1>
          </div>
          <div class="welcome-actions">
            <button *ngIf="!isProPlan() && !adminService.isAdmin()" class="btn-upgrade-pro" (click)="paymentService.openPricingModal()">
              Mejorar a PRO ⚡
            </button>
            <span class="plan-badge" [class.pro]="isProPlan() && !adminService.isAdmin()" [class.admin]="adminService.isAdmin()">{{ adminService.isAdmin() ? 'ADMIN' : (isProPlan() ? 'PRO' : 'BASICO') }}</span>
            <div class="profile-menu-wrap">
              <button class="profile-trigger" (click)="showProfileModal = true">
                <span class="profile-avatar-wrap">
                  <img *ngIf="firestoreService.profileSignal()?.photoURL; else avatarFallback" [src]="firestoreService.profileSignal()?.photoURL" alt="Foto de perfil" class="profile-avatar"/>
                  <ng-template #avatarFallback><span class="profile-avatar fallback">{{ profileInitial() }}</span></ng-template>
                </span>
              </button>
              <span class="profile-emoji-badge">{{ firestoreService.profileSignal()?.profileEmoji || '✨' }}</span>
            </div>
          </div>
        </header>

        <div class="dashboard-body">
          <!-- WELCOME HEADER ROW -->
          <div class="welcome-header-row">
            <div class="welcome-sub-info">
              <div class="welcome-date" style="margin-top: 0; margin-bottom: 0.35rem;">{{ currentDate }}</div>
              <p style="color: var(--text-secondary); font-weight: 500; font-size: 1.15rem; margin: 0;">Bienvenido de vuelta. Aquí está tu resumen de hoy.</p>
            </div>
            
            <div class="welcome-widgets-row">
              <div class="countdown-row">
                <span class="countdown-label">⏳ {{ nextExamLabel }}:</span>
                <div class="countdown-timer">
                  <div class="time-unit"><span>{{ countdown.days }}</span><label>d</label></div>
                  <div class="time-unit"><span>{{ countdown.hours }}</span><label>h</label></div>
                  <div class="time-unit"><span>{{ countdown.minutes }}</span><label>m</label></div>
                </div>
              </div>

              <!-- TOP SIDEBAR KPIs (Estudio Semanal & Ensayos Realizados) -->
              <section class="kpis-row-sidebar-top">
                <div class="kpi-card glass-card">
                  <div class="kpi-icon">⏱️</div>
                  <div class="kpi-content">
                    <span class="kpi-value">{{ getWeeklyStudyHours() }} hrs</span>
                    <span class="kpi-label">Estudio semanal</span>
                  </div>
                </div>
                <div class="kpi-card glass-card">
                  <div class="kpi-icon">📝</div>
                  <div class="kpi-content">
                    <span class="kpi-value">{{ getCompletedEnsayosCount() }}</span>
                    <span class="kpi-label">Ensayos realizados</span>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <!-- TWO-COLUMN GRID -->
          <div class="dashboard-grid">
            <!-- 1. PROFILE COMPLETION PROGRESS BAR -->
            <div class="profile-completion-card glass-card" *ngIf="getProfileCompletion() < 100" style="margin-bottom: 0;">
              <div class="profile-completion-info">
                <span class="alert-icon-pulse">⚠️</span>
                <span class="completion-pill-badge">{{ getProfileCompletion() }}% completado</span>
                <span class="profile-completion-text">— {{ getProfileCompletionMessage() }}</span>
              </div>
              <div class="profile-completion-progress-wrapper">
                <div class="profile-completion-bar-bg">
                  <div class="profile-completion-bar-fill" [style.width.%]="getProfileCompletion()"></div>
                </div>
                <button class="btn-complete-profile" (click)="showProfileModal = true">
                  Completar Perfil ➔
                </button>
              </div>
            </div>

            <!-- 3. AI HERO RECOMMENDATION (Primary CTA) -->
            <section class="ai-hero glass-card" id="ai-hero-section" style="margin-bottom: 0;">
              <div class="ai-hero-left">
                <div class="ai-hero-badge">🤖 Recomendación IA · <span>Personalizado</span></div>
                <div class="ai-hero-rec" [class.anim-even]="activeRecIdx % 2 === 0" [class.anim-odd]="activeRecIdx % 2 !== 0" *ngIf="dashSvc.recommendations()[activeRecIdx] as rec">
                  <div class="ai-hero-icon">{{ rec.icon }}</div>
                  <div class="ai-hero-text">
                    <h3>{{ rec.title }}</h3>
                    <p>{{ rec.description }}</p>
                    <div class="ai-hero-stats">
                      <span>⏱️ {{ rec.estimatedTime }}</span>
                      <span>📊 {{ rec.difficulty }}</span>
                    </div>
                  </div>
                </div>
                <div class="ai-hero-nav" *ngIf="dashSvc.recommendations().length > 1">
                  <button type="button" class="nav-arrow-rec" (click)="prevRecommendation()">‹</button>
                  <button *ngFor="let r of dashSvc.recommendations(); let i = index" class="rec-dot" [class.active]="i === activeRecIdx" (click)="setActiveRec(i)"></button>
                  <button type="button" class="nav-arrow-rec" (click)="nextRecommendation()">›</button>
                </div>
              </div>
              <div class="ai-hero-actions">
                <button class="btn-cta-primary btn-hero" [routerLink]="dashSvc.recommendations()[activeRecIdx].routerLink || '/ruta'">
                  🚀 {{ dashSvc.recommendations()[activeRecIdx].type === 'repaso' ? 'Retomar estudio' : 'Comenzar ahora' }}
                </button>
              </div>
            </section>

            <!-- 4. PAES GOAL PROGRESS -->
            <section class="paes-goal-bar glass-card" id="paes-goal-section" style="margin-bottom: 0;">
              <ng-container *ngIf="firestoreService.profileSignal()?.targetScore as target; else noGoal">
                <div class="goal-header">
                  <div class="goal-info">
                    <span class="goal-label">🎯 Meta PAES</span>
                    <span class="goal-target">{{ firestoreService.profileSignal()?.targetCareer || 'Tu carrera' }}<span *ngIf="firestoreService.profileSignal()?.targetUniversity"> en {{ firestoreService.profileSignal()?.targetUniversity }}</span> · {{ target }} pts</span>
                  </div>
                  <div class="goal-score-display">
                    <span class="goal-current" [class.on-track]="getRoundedAverageScore() >= target" [class.behind]="getRoundedAverageScore() > 0 && getRoundedAverageScore() < target">{{ getRoundedAverageScore() || '---' }}</span>
                    <span class="goal-current-label">Promedio actual</span>
                  </div>
                </div>
                <div class="goal-bar-bg">
                  <div class="goal-bar-fill" [style.width.%]="getGoalProgress()" [class.on-track]="getRoundedAverageScore() >= target"></div>
                  <div class="goal-marker" [style.left.%]="100">
                    <span class="goal-marker-label">{{ target }}</span>
                  </div>
                </div>
                <div class="goal-footer-actions" style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem; border-top: 1.5px solid var(--glass-border); padding-top: 0.75rem; flex-wrap: wrap; gap: 0.75rem;">
                  <div style="display: flex; flex-direction: column; gap: 0.35rem; flex: 1; min-width: 180px;">
                    <span class="goal-hint" style="margin-top: 0;" *ngIf="getRoundedAverageScore() > 0 && getRoundedAverageScore() < target">
                      Te faltan {{ target - getRoundedAverageScore() }} puntos.
                    </span>
                    <span class="goal-hint on-track" style="margin-top: 0;" *ngIf="getRoundedAverageScore() >= target">
                      🎉 ¡Superada!
                    </span>
                    <span class="goal-hint" style="margin-top: 0;" *ngIf="getRoundedAverageScore() === 0 && getMetaPaesMateriasList().length === 0">
                      Haz un ensayo PAES en modo real.
                    </span>
                    <span class="goal-hint" style="margin-top: 0; color: #f59e0b;" *ngIf="getRoundedAverageScore() === 0 && getMetaPaesMateriasList().length > 0 && getMetaPaesIncludedCount() === 0">
                      Todas las materias están excluidas. Agrega al menos una en «Materias del promedio».
                    </span>
                    <span class="goal-hint" style="margin-top: 0; font-size: 0.78rem; color: var(--text-muted); font-weight: 600;" *ngIf="getMetaPaesIncludedCount() > 0">
                      Promedio de {{ getMetaPaesIncludedCount() }} materia(s) · {{ getMetaPaesTotalEnsayosIncluded() }} ensayo(s) real(es)
                    </span>
                  </div>
                  <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
                    <button type="button" class="btn-meta-materias" (click)="showMetaPaesMateriasModal = true">
                      📋 Materias del promedio
                    </button>
                    <a routerLink="/encuentra-tu-carrera" class="btn-buscar-carreras">
                      🔍 Buscar carreras
                    </a>
                  </div>
                </div>
              </ng-container>
              <ng-template #noGoal>
                <div class="goal-empty-state" style="display: flex; justify-content: space-between; align-items: center; gap: 1.5rem; flex-wrap: wrap; padding: 0.25rem 0;">
                  <div class="goal-empty-info" style="display: flex; flex-direction: column; gap: 0.35rem; flex: 1; min-width: 200px;">
                    <span class="goal-label" style="font-size: 1.1rem; display: flex; align-items: center; gap: 0.4rem;">🎯 Meta PAES</span>
                    <p style="margin: 0; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.45;">
                      Establece tu carrera para ver tu proyección.
                    </p>
                  </div>
                  <div class="goal-empty-actions" style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
                    <button (click)="showProfileModal = true" class="btn-cta-primary btn-sm" style="font-size: 0.85rem; padding: 0.5rem 1rem; cursor: pointer;">
                      🎯 Meta
                    </button>
                  </div>
                </div>
              </ng-template>
            </section>

            <!-- 5. SUBJECT MASTERY -->
            <div class="metric-card glass-card mastery-card">
              <div class="metric-header" style="flex-direction: column; align-items: flex-start; gap: 0.15rem; margin-bottom: 0.65rem; width: 100%;">
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                  <span class="metric-label">Nivel de Dominio por Tema</span>
                  <span class="metric-icon">🎯</span>
                </div>
                <span *ngIf="dashSvc.subjectMasteries().length > 0" class="scroll-hint-text" style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600; margin-top: 0.1rem;">
                  💡 Si no ves tu materia, usa la rueda del mouse para bajar
                </span>
              </div>
              <div class="metric-body mastery-body">
                <ng-container *ngIf="dashSvc.subjectMasteries().length > 0; else noMastery">
                  <div *ngFor="let m of dashSvc.subjectMasteries()" class="mastery-item clickable" (click)="router.navigate(['/ruta', m.subjectId])">
                    <div class="mastery-top">
                      <span class="mastery-icon">{{ m.subjectIcon }}</span>
                      <span class="mastery-name">{{ m.subjectName }}</span>
                      <span class="mastery-pct">{{ m.mastery }}%</span>
                    </div>
                    <div class="mastery-bar-container">
                      <div class="mastery-bar-bg" [class.free-user-bar]="!isProPlan() && !adminService.isAdmin()">
                        <div class="mastery-bar-fill" [style.width.%]="(!isProPlan() && !adminService.isAdmin()) ? (m.mastery > 25 ? 25 : m.mastery) : m.mastery" [style.background]="getMasteryColor(m.mastery)"></div>
                        <div *ngIf="!isProPlan() && !adminService.isAdmin()" class="golden-locked-overlay"></div>
                      </div>
                      <div *ngIf="!isProPlan() && !adminService.isAdmin()" class="mastery-padlock">🔒</div>
                    </div>
                    <span class="mastery-sub">{{ m.lessonsCompleted }}/{{ m.totalLessons }} lecciones</span>
                  </div>
                </ng-container>
                <ng-template #noMastery>
                  <div class="empty-state-mastery">
                    <div class="blurred-chart-preview">
                      <div class="preview-bar" style="height: 60%"></div>
                      <div class="preview-bar" style="height: 85%"></div>
                      <div class="preview-bar" style="height: 40%"></div>
                      <div class="preview-bar" style="height: 72%"></div>
                      <div class="preview-bar" style="height: 55%"></div>
                    </div>
                    <div class="empty-mastery-text">
                      <span class="empty-mastery-icon">📊</span>
                      <p>Completa tu primera lección para descubrir cuáles son tus <strong>puntos fuertes</strong></p>
                      <a routerLink="/ruta" class="btn-cta-secondary btn-sm">Ir a lecciones →</a>
                    </div>
                  </div>
                </ng-template>
              </div>
            </div>

            <!-- 6. PUNTAJE MAS ALTO (RECORD CARD) -->
            <div class="metric-card glass-card record-card">
              <div class="metric-header record-header" [class.no-arrows]="dashSvc.paesRecords().length < 2">
                <button class="nav-arrow" (click)="prevRecordSubject()" *ngIf="dashSvc.paesRecords().length >= 2">‹</button>
                <span class="metric-label" [style.margin]="dashSvc.paesRecords().length < 2 ? '0 auto' : '0'">{{ recordSubjects[currentRecordIdx].name }}</span>
                <button class="nav-arrow" (click)="nextRecordSubject()" *ngIf="dashSvc.paesRecords().length >= 2">›</button>
              </div>
              <div class="metric-body">
                <ng-container *ngIf="displayedRecord; else noRecord">
                  <div class="record-display">
                    <!-- PAES PROJECTED SCORE -->
                    <div class="record-projected">{{ displayedRecord.score || calculatePaesScore(displayedRecord) }}</div>
                    <span class="record-projected-label">PAES Proyectado</span>
                    <!-- Improvement indicator -->
                    <span class="improvement-badge" *ngIf="getImprovementDelta() as delta" [class.positive]="delta > 0" [class.negative]="delta < 0">
                      {{ delta > 0 ? '+' : '' }}{{ delta }} pts vs anterior
                    </span>
                    <span class="record-detail" style="font-size:0.75rem;">{{ displayedRecord.correctAnswers }}/{{ displayedRecord.totalQuestions }} corr. · {{ displayedRecord.ensayoTitle }}</span>
                    <!-- BULLET THERMOMETER (if target set) -->
                    <div class="bullet-bar" *ngIf="firestoreService.profileSignal()?.targetScore as target">
                      <div class="bullet-track">
                        <div class="bullet-fill" [style.width.%]="getBulletWidth(displayedRecord.score || calculatePaesScore(displayedRecord), target)"></div>
                        <div class="bullet-target-line" [style.left.%]="100"></div>
                      </div>
                      <div class="bullet-labels">
                        <span>100</span>
                        <span class="bullet-target-label">Meta: {{ target }}</span>
                      </div>
                    </div>
                  </div>
                  <!-- TREND MINI CHART -->
                  <div class="trend-chart" *ngIf="recentScores.length > 1">
                    <svg viewBox="0 0 200 60" class="trend-svg" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" [attr.stop-color]="trendDirection >= 0 ? '#10b981' : '#ef4444'" stop-opacity="0.3"/>
                          <stop offset="100%" [attr.stop-color]="trendDirection >= 0 ? '#10b981' : '#ef4444'" stop-opacity="0.02"/>
                        </linearGradient>
                      </defs>
                      <path [attr.d]="trendAreaPath" fill="url(#trendGrad)"/>
                      <polyline [attr.points]="trendLinePath" fill="none" [attr.stroke]="trendDirection >= 0 ? '#10b981' : '#ef4444'" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <circle *ngFor="let p of trendPoints; let last = last" [attr.cx]="p.x" [attr.cy]="p.y" [attr.r]="last ? 4 : 2.5" [attr.fill]="trendDirection >= 0 ? '#10b981' : '#ef4444'" [attr.stroke]="last ? '#fff' : 'none'" [attr.stroke-width]="last ? 2 : 0"/>
                    </svg>
                  </div>
                </ng-container>
                <ng-template #noRecord>
                  <div class="empty-state-small">
                    <div class="blurred-chart-preview">
                      <div class="preview-bar" style="height: 40%"></div>
                      <div class="preview-bar" style="height: 70%"></div>
                      <div class="preview-bar" style="height: 50%"></div>
                      <div class="preview-bar" style="height: 80%"></div>
                      <div class="preview-bar" style="height: 60%"></div>
                    </div>
                    <span class="empty-icon" style="z-index: 1;">📝</span>
                    <p style="z-index: 1;">Sin récord en esta área</p>
                    <a routerLink="/ensayos" class="btn-cta-secondary btn-sm" style="z-index: 1; font-size:0.8rem; padding: 0.4rem 0.8rem;">Comenzar →</a>
                  </div>
                </ng-template>
              </div>
              <div class="rec-nav record-nav-dots" *ngIf="dashSvc.paesRecords().length >= 2" style="position:relative; margin-top:0.5rem; bottom:0;">
                <button *ngFor="let s of recordSubjects; let i = index" class="rec-dot" [class.active]="i === currentRecordIdx" (click)="setRecordSubject(i)"></button>
              </div>
            </div>

            <!-- 7. COMBINED STREAK CARD WITH WEEKLY CALENDAR -->
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
                    <div class="streak-name">Racha de estudio</div>
                  </div>
                </div>
                
                <div class="streak-item super-streak">
                  <div class="streak-icon-wrap">⚡</div>
                  <div class="streak-details">
                    <div class="streak-value">{{ dashSvc.superStreakDays() }} <span class="streak-label">días</span></div>
                    <div class="streak-name">Súper racha</div>
                  </div>
                </div>
              </div>
              <!-- WEEKLY CALENDAR -->
              <div class="week-calendar">
                <div *ngFor="let day of weekDays; let i = index" class="week-day" [class.active]="weeklyActivity[i]" [class.today]="i === todayWeekIndex">
                  <span class="week-day-label">{{ day }}</span>
                  <span class="week-day-dot" [class.filled]="weeklyActivity[i]">{{ weeklyActivity[i] ? '✓' : '' }}</span>
                </div>
              </div>
              <div class="metric-footer">
                <span class="metric-subtext" *ngIf="dashSvc.superStreakDays() > 0">⚡ ¡Imparable! Dominando al máximo.</span>
                <span class="metric-subtext" *ngIf="dashSvc.streakDays() > 0 && dashSvc.superStreakDays() === 0">🔥 Vas muy bien.</span>
                <span class="metric-subtext" *ngIf="dashSvc.streakDays() === 0">Inicia tu racha hoy.</span>
              </div>
            </div>

            <!-- 8. RECENT ACTIVITY -->
            <section class="activity-section-full" style="margin-bottom: 0;">
              <div class="recent-activity glass-card">
                <div class="activity-header">
                  <h3>📋 Actividad Reciente</h3>
                  <button class="btn-ver-todo" (click)="showHistoryModal = true">
                    📋 Ver todo
                  </button>
                </div>
                <div class="activity-list" *ngIf="dashSvc.activities().length > 0; else noActivity">
                  <div *ngFor="let act of dashSvc.activities().slice(0, 5)" 
                       class="activity-item"
                       [class.clickable]="act.type === 'ensayo' || act.type === 'mente-veloz' || act.type === 'mini-ensayo'"
                       (click)="onActivityClick(act)">
                    <span class="activity-icon">{{ act.type === 'leccion' ? '✅' : (act.type === 'mente-veloz' ? '⚡' : (act.type === 'mini-ensayo' ? '🎯' : '📝')) }}</span>
                    <div class="activity-info">
                      <span class="activity-title">{{ act.title }}</span>
                      <div class="activity-meta">
                        <span [class]="'activity-subject-badge subj-' + act.subject" *ngIf="act.subject && act.subject !== 'mente-veloz'">{{ act.subjectIcon }} {{ getSubjectName(act.subject) }}</span>
                        <span class="activity-time">{{ formatActivityTime(act.timestamp) }}</span>
                      </div>
                    </div>
                    <div class="activity-right">
                      <span class="performance-dot" [class.green]="getPerformanceLevel(act) === 'good'" [class.yellow]="getPerformanceLevel(act) === 'medium'" [class.red]="getPerformanceLevel(act) === 'low'"></span>
                      <!-- CONTEXTUAL CTA -->
                      <span class="clickable-badge" [class.review]="getPerformanceLevel(act) === 'low'" *ngIf="act.type === 'ensayo' || act.type === 'mente-veloz' || act.type === 'mini-ensayo'">{{ getContextualCTA(act) }}</span>
                      <span class="activity-score" *ngIf="act.score !== undefined">
                        {{ act.type === 'leccion' ? act.score + '%' : (act.type === 'mente-veloz' ? act.totalCorrect + ' corr.' : act.totalCorrect + '/' + act.totalQuestions) }}
                      </span>
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
          </div>
        </div>
      </main>
    </div>

    <!-- MODALS -->
    <app-profile-modal *ngIf="showProfileModal" (close)="onProfileModalClose()"></app-profile-modal>
    <app-settings-modal *ngIf="showSettingsModal" (close)="onSettingsModalClose()"></app-settings-modal>
    <app-history-modal *ngIf="showHistoryModal" (close)="showHistoryModal = false"></app-history-modal>

    <!-- CUSTOM LOGOUT CONFIRMATION -->
    <div class="modal-overlay logout-confirm-overlay" *ngIf="showLogoutConfirm" (click)="showLogoutConfirm = false">
      <div class="modal-container glass logout-confirm-modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Cerrar Sesión</h2>
          <button class="logout-close-btn" (click)="showLogoutConfirm = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="confirm-content">
            <div class="confirm-icon">🚪</div>
            <h3>¿Estás seguro de que quieres salir?</h3>
            <p>Se cerrará tu sesión actual y volverás a la página de inicio.</p>
          </div>
        </div>
        <div class="modal-footer confirm-actions">
          <button class="btn-secondary-modal" (click)="showLogoutConfirm = false">Cancelar</button>
          <button class="btn-primary-modal btn-danger" (click)="executeLogout()">Cerrar Sesión</button>
        </div>
      </div>
    </div>

    <!-- STREAK EXPLANATION MODAL -->
    <!-- META PAES MATERIAS MODAL -->
    <div class="modal-overlay" *ngIf="showMetaPaesMateriasModal" (click)="showMetaPaesMateriasModal = false">
      <div class="modal-container glass-card meta-paes-materias-modal" (click)="$event.stopPropagation()">
        <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--glass-border);">
          <h2 style="margin: 0; font-size: 1.2rem;">Materias en Meta PAES</h2>
          <button type="button" class="close-btn" (click)="showMetaPaesMateriasModal = false">&times;</button>
        </div>
        <div class="modal-body" style="padding: 1.25rem 1.5rem;">
          <p style="margin: 0 0 1rem; color: var(--text-secondary); font-size: 0.9rem; line-height: 1.5;">
            El <strong>promedio actual</strong> usa ensayos PAES en <strong>modo real</strong>. Puedes quitar materias del cálculo y volver a agregarlas cuando quieras.
          </p>
          <div *ngIf="getMetaPaesMateriasList().length === 0" class="meta-paes-empty">
            <span>📝</span>
            <p>Aún no tienes ensayos PAES en modo real. Completa uno en <a routerLink="/ensayos" (click)="showMetaPaesMateriasModal = false">Ensayos PAES</a>.</p>
          </div>
          <ul class="meta-paes-materias-list" *ngIf="getMetaPaesMateriasList().length > 0">
            <li *ngFor="let m of getMetaPaesMateriasList()" [class.excluded]="isMetaPaesSubjectExcluded(m.id)">
              <div class="meta-materia-info">
                <span class="meta-materia-name">{{ m.name }}</span>
                <span class="meta-materia-detail">{{ m.count }} ensayo(s) · promedio {{ m.avgScore }} pts</span>
              </div>
              <button
                type="button"
                class="btn-toggle-materia"
                [class.is-excluded]="isMetaPaesSubjectExcluded(m.id)"
                [disabled]="savingMetaPaesMaterias"
                (click)="toggleMetaPaesSubject(m.id)">
                {{ isMetaPaesSubjectExcluded(m.id) ? '+ Agregar al promedio' : 'Quitar del promedio' }}
              </button>
            </li>
          </ul>
        </div>
        <div class="modal-footer" style="padding: 1rem 1.5rem; border-top: 1px solid var(--glass-border); display: flex; justify-content: flex-end;">
          <button type="button" class="btn-primary-modal" (click)="showMetaPaesMateriasModal = false">Listo</button>
        </div>
      </div>
    </div>

    <div class="modal-overlay" *ngIf="showStreakInfo" (click)="showStreakInfo = false">
      <div class="modal-container glass streak-info-modal animate-scale-up" (click)="$event.stopPropagation()">
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

    <!-- FLOATING HELP BUTTON -->
    <button class="help-fab" (click)="showHelpModal = true" title="Guía del Dashboard">
      💡
    </button>

    <!-- HELP EXPLANATION MODAL -->
    <div class="modal-overlay" *ngIf="showHelpModal" (click)="showHelpModal = false">
      <div class="modal-container glass help-modal-container animate-scale-up" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>💡 Guía Rápida del Dashboard</h2>
          <button class="logout-close-btn" (click)="showHelpModal = false">&times;</button>
        </div>
        <div class="modal-body help-modal-body">
          <p class="help-intro-text">Aquí tienes una explicación de cada sección para que aproveches al máximo EstudiaUni:</p>
          
          <div class="help-sections-grid">
            <div class="help-section-card">
              <div class="help-card-icon">⚡</div>
              <div class="help-card-info">
                <h4>Recomendación de la IA</h4>
                <p>Análisis de tu nivel para sugerirte qué estudiar o repasar hoy mismo.</p>
              </div>
            </div>

            <div class="help-section-card">
              <div class="help-card-icon">🎯</div>
              <div class="help-card-info">
                <h4>Meta PAES</h4>
                <p>Compara tu promedio proyectado con el puntaje meta de la carrera que quieres.</p>
              </div>
            </div>

            <div class="help-section-card">
              <div class="help-card-icon">📊</div>
              <div class="help-card-info">
                <h4>Dominio por Tema</h4>
                <p>Muestra tu progreso y porcentaje de dominio en cada materia evaluada.</p>
              </div>
            </div>

            <div class="help-section-card">
              <div class="help-card-icon">🏆</div>
              <div class="help-card-info">
                <h4>Récord de Puntaje</h4>
                <p>Tu puntaje PAES proyectado más alto y el cambio respecto a tu ensayo anterior. Además, te muestra el puntaje más reciente y el más alto para cada materia individual.</p>
              </div>
            </div>

            <div class="help-section-card">
              <div class="help-card-icon">🔥</div>
              <div class="help-card-info">
                <h4>Rachas de Estudio</h4>
                <p>Días seguidos de estudio (Racha normal) y de lecciones en todas las materias (Súper Racha).</p>
              </div>
            </div>

            <div class="help-section-card">
              <div class="help-card-icon">⏱️</div>
              <div class="help-card-info">
                <h4>Horas Semanales</h4>
                <p>Registro del tiempo dedicado a lecciones, ensayos y mente veloz esta semana.</p>
              </div>
            </div>
            
            <div class="help-section-card">
              <div class="help-card-icon">🛠️</div>
              <div class="help-card-info">
                <h4>Herramientas</h4>
                <p>Calculadora NEM, Encuentra tu Carrera y Recursos Adicionales en el menú lateral.</p>
              </div>
            </div>

            <div class="help-section-card">
              <div class="help-card-icon">👤</div>
              <div class="help-card-info">
                <h4>Tu Perfil</h4>
                <p>Configura tu meta de puntaje y carrera para que la IA personalice tu ruta.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-primary-modal" (click)="showHelpModal = false">¡Entendido!</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-layout { display: flex; min-height: 100vh; background: var(--bg-color); color: var(--text-primary); }
    .text-gradient { background: var(--gradient-brand); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

    /* SIDEBAR */
    .sidebar { width: 260px; background: #0F1018; border-right: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; height: 100vh; z-index: 100; overflow-y: auto; }
    .sidebar::-webkit-scrollbar { width: 4px; }
    .sidebar::-webkit-scrollbar-track { background: transparent; }
    .sidebar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; transition: background 0.2s; }
    .sidebar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.25); }
    .sidebar-header { 
      padding: 2.5rem 1.5rem 2rem; 
      border-bottom: 1px solid rgba(255,255,255,0.15); 
      text-align: center;
    }
    .sidebar-logo { 
      font-family: var(--font-heading); 
      font-size: 3.5rem; 
      font-weight: 900; 
      background: linear-gradient(135deg, #ffffff 40%, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.04em; 
      text-shadow: 0 0 15px rgba(139, 92, 246, 0.3);
      position: relative;
    }
    .sidebar-nav {
      padding: 1rem 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .nav-item { display: flex; align-items: center; gap: 0.85rem; padding: 0.9rem 1.1rem; border-radius: 12px; color: #ffffff; text-decoration: none; transition: all 0.2s; cursor: pointer; background: transparent; border: none; width: 100%; text-align: left; font-size: 1.05rem; font-weight: 500; }
    .nav-item:hover { background: rgba(255,255,255,0.12); color: #fff; transform: translateX(4px); }
    .nav-item.active { background: rgba(139,92,246,0.18); color: #c4b5fd; border: none; border-left: 3.5px solid #a78bfa; box-shadow: 0 4px 12px rgba(139,92,246,0.12); font-weight: 700; }
    .nav-item.active .nav-icon { filter: brightness(1.3); }
    .nav-item.active .nav-text { color: #c4b5fd; }
    .nav-icon { font-size: 1.35rem; width: 32px; display: flex; align-items: center; justify-content: center; }
    .sidebar-section-title {
      font-size: 0.78rem;
      font-weight: 800;
      color: rgba(255, 255, 255, 0.95);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      padding: 0.75rem 1.1rem;
      margin: 0.75rem 0.5rem 0.25rem;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      user-select: none;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      border-radius: 8px;
    }
    .sidebar-section-title:hover {
      background: rgba(255, 255, 255, 0.07);
      color: #ffffff;
    }
    .sidebar-section-title .toggle-icon {
      font-size: 0.65rem;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      color: rgba(255, 255, 255, 0.6);
    }
    .sidebar-section-title:hover .toggle-icon {
      color: #ffffff;
    }
    .sidebar-sub-items {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      max-height: 0;
      opacity: 0;
      margin-left: 1.4rem;
      border-left: 1.5px solid rgba(255, 255, 255, 0.08);
      padding-left: 0.4rem;
      gap: 0.25rem;
    }
    .sidebar-sub-items.collapsible {
      transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
    }
    .sidebar-sub-items.expanded {
      max-height: 260px;
      opacity: 1;
      margin-top: 0.25rem;
      margin-bottom: 0.5rem;
    }
    .sidebar-sub-items .nav-item {
      padding: 0.65rem 0.9rem;
      font-size: 0.95rem;
      border-radius: 10px;
    }
    .sidebar-sub-items .nav-item:hover {
      background: rgba(255, 255, 255, 0.07);
      transform: translateX(3px);
    }
    .sidebar-sub-items .nav-item.active {
      background: rgba(139,92,246,0.18); 
      color: #c4b5fd; 
      border: none; 
      border-left: 3.5px solid #a78bfa; 
      box-shadow: 0 4px 12px rgba(139,92,246,0.12); 
      font-weight: 700;
    }
    .sidebar-footer { padding: 1.25rem 0.75rem; border-top: 1px solid rgba(255,255,255,0.1); }
    .sidebar-footer .nav-item { font-size: 0.88rem; padding: 0.72rem 1.1rem; }
    .logout-btn-sidebar {
      color: #fca5a5 !important;
      opacity: 0.8;
    }
    .logout-btn-sidebar:hover {
      background: rgba(239, 68, 68, 0.15) !important;
      color: #ef4444 !important;
      opacity: 1;
    }
    .logout-confirm-overlay { z-index: 11000; }
    .logout-confirm-modal { max-width: 420px !important; }
    .confirm-content { text-align: center; padding: 1rem 0; }
    .confirm-icon { font-size: 3.5rem; margin-bottom: 1rem; }
    .confirm-content h3 { margin: 0 0 0.5rem; font-size: 1.3rem; }
    .confirm-content p { color: var(--text-secondary); margin: 0; }
    .confirm-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .btn-secondary-modal { padding: 0.85rem; border-radius: 12px; border: 2px solid var(--glass-border); background: transparent; color: var(--text-primary); font-weight: 700; cursor: pointer; transition: all 0.2s; }
    .btn-secondary-modal:hover { background: var(--bg-secondary); }
    .btn-danger { background: #ef4444 !important; box-shadow: 0 4px 12px rgba(239,68,68,0.25) !important; }

    /* MOBILE */
    .mobile-header { display: none; position: fixed; top: 0; left: 0; right: 0; height: 60px; background: #0F1018; backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.1); padding: 0 1rem; align-items: center; gap: 1rem; z-index: 101; }
    .mobile-menu-btn { background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; padding: 0.5rem; }
    .mobile-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 200; }
    .mobile-overlay.open { display: block; }
    .mobile-menu { position: absolute; top: 0; left: 0; width: 280px; height: 100%; background: #0F1018; padding: 2rem 1rem; }

    /* MAIN */
    .main-content { flex: 1; margin-left: 260px; max-width: calc(100% - 260px); padding: 0; display: flex; flex-direction: column; background: #0F1018; }

    /* HEADER */
    .dashboard-header {
      height: 110px;
      background: #0F1018;
      border-bottom: 1px solid rgba(255,255,255,0.15);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 2.5rem;
      box-sizing: border-box;
    }
    .header-greeting {
      font-family: var(--font-heading);
      font-size: 2.4rem;
      font-weight: 800;
      color: #ffffff;
      margin: 0;
      letter-spacing: -0.02em;
      line-height: 1.2;
    }
    .dashboard-body {
      flex: 1;
      background: var(--bg-color);
      padding: 1.5rem 2.5rem 2.5rem;
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      box-shadow: -4px -4px 12px rgba(0,0,0,0.05);
      position: relative;
      z-index: 1;
    }

    .dashboard-grid {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    /* WELCOME */
    .welcome-header-row {
      display: flex;
      flex-direction: column;
      margin-bottom: 0.25rem;
      gap: 0.5rem;
    }
    .welcome-widgets-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1.5rem;
    }
    .welcome-widgets-row .kpis-row-sidebar-top {
      flex-shrink: 0;
      width: 420px;
    }
    .welcome-date {
      color: var(--text-secondary);
      font-size: 1.5rem;
      font-weight: 700;
      font-family: var(--font-heading);
      letter-spacing: -0.015em;
    }
    
    /* COUNTDOWN WIDGET */
    .countdown-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: #ffffff;
      padding: 0.4rem 0.85rem;
      border-radius: 10px;
      width: fit-content;
      box-shadow: var(--shadow-sm);
      border: 1.5px solid rgba(133,92,214,0.35);
      margin-top: 0;
      line-height: 1;
    }
    .countdown-label { font-size: 0.82rem; font-weight: 700; color: #4b5563; margin: 0; line-height: 1; }
    .countdown-timer { display: flex; gap: 0.5rem; align-items: center; }
    .time-unit { display: flex; align-items: baseline; gap: 1px; }
    .time-unit span { font-size: 0.95rem; font-weight: 800; color: var(--accent-primary); min-width: 16px; text-align: center; margin: 0; line-height: 1; }
    .time-unit label { font-size: 0.7rem; font-weight: 600; color: #6b7280; margin: 0; line-height: 1; }

    .welcome-actions { display: flex; align-items: center; gap: 1rem; }
    .profile-menu-wrap { position: relative; }
    .profile-trigger { display: flex; align-items: center; justify-content: center; border: 1.5px solid var(--glass-border); background: #ffffff; color: var(--text-primary); border-radius: 50%; padding: 0.15rem; cursor: pointer; text-decoration: none; transition: all 0.2s; width: 56px; height: 56px; box-shadow: var(--shadow-sm); }
    .profile-trigger:hover { border-color: var(--accent-primary); box-shadow: var(--shadow); }
    .profile-avatar-wrap { position: relative; width: 48px; height: 48px; display: inline-block; flex-shrink: 0; }
    .profile-avatar { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; }
    .profile-avatar.fallback { display: grid; place-items: center; background: var(--gradient-brand); font-weight: 700; font-size: 0.95rem; color: white; }
    .profile-emoji-badge { position: absolute; right: -3px; bottom: -3px; background: #111827; border: 1.5px solid rgba(255,255,255,0.2); border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; line-height: 1; z-index: 10; pointer-events: none; }
    .plan-badge { font-size: 0.85rem; letter-spacing: 0.05em; padding: 0.5rem 1rem; border-radius: 999px; font-weight: 800; background: var(--bg-secondary); color: var(--text-secondary); border: 2px solid var(--glass-border); line-height: 1; }
    .plan-badge.pro { background: rgba(245,158,11,0.1); color: #d97706; border-color: rgba(245,158,11,0.3); }
    .plan-badge.admin { background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #fff; border: 2.5px solid #d97706 !important; text-shadow: 0 1px 2px rgba(0,0,0,0.25); box-shadow: 0 0 12px rgba(245,158,11,0.6), inset 0 1px 2px rgba(255,255,255,0.35); }

    /* METRICS */
    .metrics-section { display: grid; grid-template-columns: 1.5fr 0.75fr 0.85fr; gap: 1.5rem; margin-bottom: 2rem; }
    .metric-card { padding: 1rem 1.15rem; border-radius: 16px; display: flex; flex-direction: column; background: #ffffff; border: 2px solid var(--glass-border); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: var(--shadow); }
    .metric-card:hover { border-color: rgba(133,92,214,0.4); transform: translateY(-4px); box-shadow: var(--shadow-md); }
    .metric-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
    .metric-label { font-size: 0.9rem; color: #374151; font-weight: 700; }
    .metric-icon { font-size: 1.4rem; }
    .metric-body { flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
    .metric-number { font-size: 2.4rem; font-weight: 800; font-family: var(--font-heading); background: var(--gradient-brand); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1.1; }
    .metric-unit { font-size: 0.95rem; color: #6b7280; font-weight: 600; margin-top: -0.25rem; }
    .metric-footer { margin-top: 0.6rem; padding-top: 0.6rem; border-top: 1.5px solid var(--glass-border); }
    .metric-subtext { color: #4b5563; font-size: 0.82rem; font-weight: 600; }

    /* MASTERY */
    .mastery-card { }
    .mastery-body {
      display: flex;
      flex-direction: column;
      gap: 0.75rem !important;
      max-height: 165px;
      overflow-y: auto;
      padding-right: 4px;
      align-items: stretch;
      justify-content: flex-start;
      margin: auto 0;
    }
    .mastery-body::-webkit-scrollbar { width: 4px; }
    .mastery-body::-webkit-scrollbar-thumb { background: rgba(133, 92, 214, 0.45); border-radius: 99px; }
    .mastery-item { display: flex; flex-direction: column; gap: 0.35rem; }
    .mastery-top { display: flex; align-items: center; gap: 0.5rem; }
    .mastery-icon { font-size: 1.1rem; }
    .mastery-name { flex: 1; font-size: 0.9rem; font-weight: 600; color: var(--text-primary); }
    .mastery-pct { font-size: 0.95rem; font-weight: 800; color: var(--accent-primary); }
    .mastery-bar-bg { height: 6px; background: var(--bg-secondary); border-radius: 99px; overflow: hidden; border: 1px solid var(--glass-border); }
    .mastery-bar-fill { height: 100%; border-radius: 99px; transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); }
    .mastery-sub { font-size: 0.8rem; color: var(--text-muted); font-weight: 600; }

    /* RECORD */
    .record-card { position: relative; padding-bottom: 1.25rem; }
    .record-header { display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 0.5rem; }
    .nav-arrow { background: rgba(133,92,214,0.1); border: none; color: var(--accent-primary); font-size: 1.3rem; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; padding-bottom: 2px; }
    .nav-arrow:hover { background: var(--accent-primary); color: #fff; transform: scale(1.1); }
    .record-display { display: flex; flex-direction: column; align-items: center; gap: 0.2rem; position: relative; width: 100%; }
    .record-projected { font-size: 2.4rem; font-weight: 800; font-family: var(--font-heading); background: var(--gradient-brand); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1.1; }
    .record-projected-label { font-size: 0.75rem; color: var(--text-secondary); font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }
    .record-detail { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; text-align: center; margin-top: 0.1rem; }
    .record-materia-badge { font-size: 0.68rem; font-weight: 800; text-transform: uppercase; color: var(--accent-primary); background: rgba(133,92,214,0.1); padding: 0.15rem 0.5rem; border-radius: 6px; margin-top: 0.25rem; border: 1px solid rgba(133,92,214,0.2); }
    .record-nav-dots { position: absolute; bottom: 0.4rem; left: 0; right: 0; }

    /* IMPROVEMENT BADGE */
    .improvement-badge { font-size: 0.78rem; font-weight: 800; padding: 0.2rem 0.65rem; border-radius: 99px; }
    .improvement-badge.positive { background: rgba(16,185,129,0.12); color: #10b981; border: 1px solid rgba(16,185,129,0.25); }
    .improvement-badge.negative { background: rgba(239,68,68,0.1); color: #ef4444; border: 1px solid rgba(239,68,68,0.2); }

    /* BULLET THERMOMETER */
    .bullet-bar { width: 100%; margin-top: 0.4rem; }
    .bullet-track { position: relative; height: 8px; background: var(--bg-secondary); border-radius: 99px; border: 1px solid var(--glass-border); overflow: visible; }
    .bullet-fill { height: 100%; border-radius: 99px; background: var(--gradient-brand); transition: width 0.8s cubic-bezier(0.34,1.56,0.64,1); max-width: 100%; }
    .bullet-target-line { position: absolute; top: -3px; bottom: -3px; width: 3px; background: var(--accent-primary); border-radius: 2px; transform: translateX(-50%); box-shadow: 0 0 6px rgba(133,92,214,0.4); }
    .bullet-labels { display: flex; justify-content: space-between; margin-top: 0.15rem; font-size: 0.62rem; font-weight: 700; color: var(--text-muted); }
    .bullet-target-label { color: var(--accent-primary); }

    /* EMPTY STATES */
    .empty-state-small {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      text-align: center;
      padding: 0.75rem;
      background: rgba(0, 0, 0, 0.01);
      border-radius: 12px;
      border: 2px dashed rgba(133, 92, 214, 0.35);
      min-height: 110px;
      overflow: hidden;
      box-sizing: border-box;
      width: 100%;
    }
    .empty-state-small .empty-icon { font-size: 1.5rem; opacity: 0.8; z-index: 1; }
    .empty-state-small p { font-size: 0.8rem; color: #4b5563; margin: 0 0 0.25rem 0; max-width: 200px; font-weight: 600; z-index: 1; }
    .btn-ver-todo { padding: 0.45rem 0.9rem; border-radius: 10px; background: rgba(133,92,214,0.08); color: var(--accent-primary); font-size: 0.8rem; font-weight: 700; border: 1.5px solid rgba(133,92,214,0.15); cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 0.4rem; }
    .btn-ver-todo:hover { background: var(--accent-primary); color: #fff; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(133,92,214,0.2); }

    /* MINI ENSAYOS PROMO */
    .mini-ensayo-promo { display: flex; justify-content: space-between; align-items: center; padding: 2rem; background: linear-gradient(135deg, rgba(133,92,214,0.05), rgba(133,92,214,0.15)); border: 2px solid rgba(133,92,214,0.3); border-radius: 20px; flex-wrap: wrap; gap: 1.5rem; }
    .promo-content { display: flex; flex-direction: column; gap: 1rem; flex: 1; }
    .promo-header { display: flex; align-items: flex-start; gap: 1rem; }
    .promo-icon { font-size: 2.5rem; line-height: 1; }
    .promo-header h3 { font-family: var(--font-heading); font-size: 1.4rem; margin: 0 0 0.3rem; color: var(--text-primary); }
    .promo-header p { font-size: 0.95rem; color: var(--text-secondary); margin: 0; line-height: 1.4; }
    .badge-new { background: var(--gradient-brand); color: #fff; font-size: 0.7rem; font-weight: 800; padding: 0.2rem 0.6rem; border-radius: 99px; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 0.2rem; }
    .promo-topics { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .topic-pill { background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); padding: 0.4rem 0.8rem; border-radius: 8px; font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); }
    .btn-create-mini { padding: 1rem 2rem; background: var(--gradient-brand); color: #fff; border: none; border-radius: 14px; font-size: 1.1rem; font-weight: 800; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 15px rgba(133,92,214,0.3); white-space: nowrap; text-decoration: none; display: inline-flex; justify-content: center; align-items: center; }
    .btn-create-mini:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(133,92,214,0.4); }

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
    .mastery-item { padding: 0.4rem 0.6rem; border-radius: 12px; transition: all 0.2s; }
    .mastery-item.clickable { cursor: pointer; }
    .mastery-item.clickable:hover { background: rgba(133, 92, 214, 0.08); transform: translateX(4px); }
    .mastery-top { display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.2rem; }
    .mastery-icon { font-size: 1.1rem; }
    .mastery-name { font-weight: 700; flex: 1; font-size: 0.9rem; }
    .mastery-pct { font-weight: 800; color: var(--accent-primary); font-size: 0.9rem; }
    .mastery-bar-bg { height: 6px; background: rgba(0,0,0,0.05); border-radius: 4px; overflow: hidden; margin-bottom: 0.15rem; }
    .mastery-bar-fill { height: 100%; border-radius: 4px; transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); }
    .mastery-sub { font-size: 0.72rem; color: #6b7280; font-weight: 600; }

    /* Estilos del candado y la barra de progreso dorada animada para usuarios gratis (BASICO) */
    .mastery-bar-container {
      position: relative;
      width: 100%;
      display: block;
      margin-bottom: 0.15rem;
    }
    .mastery-bar-container .mastery-bar-bg {
      margin-bottom: 0;
    }
    .mastery-bar-bg.free-user-bar {
      overflow: hidden;
    }
    .golden-locked-overlay {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 25%;
      right: 0;
      background: linear-gradient(90deg, #d4af37 0%, #ffd700 25%, #f39c12 50%, #ffd700 75%, #d4af37 100%);
      background-size: 200% 100%;
      animation: goldShimmer 8s infinite linear;
      opacity: 0.95;
      pointer-events: none;
      z-index: 2;
    }
    .mastery-padlock {
      position: absolute;
      left: 25%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 0.85rem;
      line-height: 1;
      z-index: 10;
      filter: drop-shadow(0 1px 2px rgba(0,0,0,0.4));
      pointer-events: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    @keyframes goldShimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    /* COMBINED STREAK CARD */
    .combined-streak-card .metric-body { flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: stretch; gap: 0.75rem; padding-top: 0.2rem; }
    .streak-item { display: flex; align-items: center; gap: 0.65rem; padding: 0.55rem 0.8rem; border-radius: 12px; background: rgba(0,0,0,0.02); border: 1.5px solid var(--glass-border); transition: all 0.2s; }
    .streak-item:hover { transform: translateX(4px); background: #ffffff; }
    .streak-item.normal-streak:hover { border-color: rgba(249,115,22,0.3); box-shadow: 0 4px 12px rgba(249,115,22,0.08); }
    .streak-item.super-streak:hover { border-color: rgba(139,92,246,0.3); box-shadow: 0 4px 12px rgba(139,92,246,0.08); }
    
    .streak-icon-wrap { font-size: 1.2rem; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 8px; }
    .normal-streak .streak-icon-wrap { background: rgba(249,115,22,0.1); color: #ea580c; }
    .super-streak .streak-icon-wrap { background: rgba(139,92,246,0.1); color: #7c3aed; }
    
    .streak-details { display: flex; flex-direction: column; flex: 1; }
    .streak-value { font-size: 1.4rem; font-weight: 800; font-family: var(--font-heading); line-height: 1.1; margin-bottom: 0.1rem; display: flex; align-items: baseline; gap: 0.2rem; }
    .normal-streak .streak-value { background: linear-gradient(135deg, #f97316, #ea580c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .super-streak .streak-value { background: linear-gradient(135deg, #8b5cf6, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .streak-label { font-size: 0.8rem; font-weight: 700; color: #4b5563; -webkit-text-fill-color: initial; }
    .streak-name { font-size: 0.72rem; color: #4b5563; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    
    .combined-streak-card.clickable { cursor: pointer; }
    .combined-streak-card.clickable:hover { transform: translateY(-4px) scale(1.01); border-color: var(--accent-primary); box-shadow: 0 6px 16px rgba(133,92,214,0.12); }

    /* STREAK INFO MODAL */
    .streak-info-modal { max-width: 500px !important; width: 90% !important; margin: auto !important; }
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
    .btn-primary-modal { font-family: inherit; width: 100%; padding: 0.85rem; border-radius: 12px; background: var(--accent-primary); color: white; border: none; font-weight: 700; cursor: pointer; transition: all 0.2s; }
    .btn-primary-modal:hover { filter: brightness(1.1); transform: translateY(-2px); }

    .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(8, 10, 18, 0.6); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 99999 !important; padding: 1.5rem; animation: fadeIn 0.25s ease both; }
    .modal-container.glass { background: rgba(255,255,255,0.95); border: 2px solid var(--glass-border); border-radius: 24px; box-shadow: 0 20px 50px rgba(0,0,0,0.25); width: 100%; overflow: hidden; }
    .modal-header { padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--glass-border); }
    .modal-header h2 { margin: 0; font-size: 1.25rem; font-weight: 800; color: var(--text-primary); }
    .close-btn { background: none; border: none; font-size: 1.75rem; color: var(--text-muted); cursor: pointer; line-height: 1; transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), color 0.2s ease; }
    .close-btn:hover { transform: rotate(90deg) scale(1.1); color: #ef4444 !important; }
    .modal-body { padding: 1.5rem; }
    .modal-footer { padding: 1.5rem; border-top: 1px solid var(--glass-border); }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.95) translateY(15px); } to { opacity: 1; transform: scale(1) translateY(0); } }
    .animate-scale-up { animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both; }

    /* AI Recs Side Nav */
    .ai-recs-card { display: flex; flex-direction: column; }
    .ai-body-with-nav { display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 1.5rem; flex: 1; position: relative; padding: 0 1rem; }
    .ai-content-slider { flex: 1; min-width: 0; }
    .nav-arrow-side { background: var(--bg-secondary); border: 2px solid var(--glass-border); color: var(--text-secondary); width: 44px; height: 44px; border-radius: 50%; display: grid; place-items: center; cursor: pointer; transition: all 0.2s; z-index: 5; flex-shrink: 0; font-size: 1.4rem; padding: 0; line-height: 1; }
    .nav-arrow-side:hover { background: #ffffff; color: var(--accent-primary); border-color: var(--accent-primary); transform: scale(1.1); }
    .recommendation-content.hidden { display: none; }
    .ai-footer { padding: 1rem; display: flex; justify-content: center; border-top: 1px solid var(--glass-border); }

    .glass-card { background: #ffffff; border: 1.5px solid var(--glass-border); box-shadow: var(--shadow); }

    /* UNIFIED CTA BUTTONS */
    .btn-cta-primary { font-family: inherit; padding: 0.9rem 2rem; background: var(--gradient-brand); color: #fff; border: none; border-radius: 14px; font-size: 1.05rem; font-weight: 800; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 4px 15px rgba(133,92,214,0.3); white-space: nowrap; text-decoration: none; display: inline-flex; justify-content: center; align-items: center; gap: 0.4rem; letter-spacing: -0.01em; }
    .btn-cta-primary:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(133,92,214,0.4); filter: brightness(1.05); }
    .btn-cta-primary:active { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(133,92,214,0.3); }
    .btn-cta-primary.btn-sm { padding: 0.6rem 1.2rem; font-size: 0.9rem; border-radius: 10px; }

    .btn-cta-secondary {
      font-family: inherit;
      padding: 0.9rem 2rem;
      background: rgba(133,92,214,0.06);
      color: var(--accent-primary);
      border: 1.5px solid rgba(133,92,214,0.18);
      border-radius: 14px;
      font-size: 1.05rem;
      font-weight: 800;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      white-space: nowrap;
      text-decoration: none;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      gap: 0.4rem;
      letter-spacing: -0.01em;
    }
    .btn-cta-secondary:hover {
      background: var(--accent-primary);
      color: #fff;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(133,92,214,0.2);
    }
    .btn-cta-secondary:active {
      transform: translateY(0);
    }
    .btn-cta-secondary.btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.85rem;
      border-radius: 10px;
    }

    .welcome-meta-pill {
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      background: rgba(133, 92, 214, 0.08);
      border: 1px solid rgba(133, 92, 214, 0.25);
      color: var(--accent-primary);
      padding: 0.3rem 0.8rem;
      border-radius: 99px;
      font-size: 0.85rem;
      font-weight: 700;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .welcome-meta-pill:hover {
      transform: translateY(-1.5px);
      background: rgba(133, 92, 214, 0.15);
      border-color: rgba(133, 92, 214, 0.45);
      box-shadow: 0 4px 10px rgba(133, 92, 214, 0.12);
    }
    .welcome-meta-pill.empty {
      background: rgba(245, 158, 11, 0.06);
      border: 1px dashed rgba(245, 158, 11, 0.45);
      color: #ea580c;
    }
    .welcome-meta-pill.empty:hover {
      transform: translateY(-1.5px);
      background: rgba(245, 158, 11, 0.12);
      border-color: rgba(245, 158, 11, 0.6);
      box-shadow: 0 4px 10px rgba(245, 158, 11, 0.1);
    }

    .record-header.no-arrows {
      justify-content: center;
    }

    .activity-subject-badge.subj-comp-lectora {
      background: rgba(139, 92, 246, 0.08) !important;
      color: #6d28d9 !important;
      border-color: rgba(139, 92, 246, 0.2) !important;
    }
    .activity-subject-badge.subj-mat1, .activity-subject-badge.subj-mat2 {
      background: rgba(37, 99, 235, 0.08) !important;
      color: #1d4ed8 !important;
      border-color: rgba(37, 99, 235, 0.2) !important;
    }
    .activity-subject-badge.subj-historia {
      background: rgba(234, 88, 12, 0.08) !important;
      color: #c2410c !important;
      border-color: rgba(234, 88, 12, 0.2) !important;
    }
    .activity-subject-badge.subj-ciencias,
    .activity-subject-badge.subj-ciencias-biologia,
    .activity-subject-badge.subj-ciencias-fisica,
    .activity-subject-badge.subj-ciencias-quimica,
    .activity-subject-badge.subj-ciencias-tp {
      background: rgba(5, 150, 105, 0.08) !important;
      color: #047857 !important;
      border-color: rgba(5, 150, 105, 0.2) !important;
    }

    /* AI HERO CARD */
    .ai-hero { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 1.75rem; border-radius: 18px; margin-bottom: 2rem; background: linear-gradient(135deg, rgba(133,92,214,0.06), rgba(99,102,241,0.12)); border: 2px solid rgba(133,92,214,0.25) !important; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); gap: 1.5rem; flex-wrap: wrap; }
    .ai-hero:hover { border-color: rgba(133,92,214,0.4) !important; transform: translateY(-4px); box-shadow: var(--shadow-md); }
    .ai-hero-left { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 0.75rem; }
    .ai-hero-badge { font-size: 0.78rem; font-weight: 800; color: var(--accent-primary); text-transform: uppercase; letter-spacing: 0.04em; }
    .ai-hero-badge span { background: rgba(133,92,214,0.1); padding: 0.15rem 0.5rem; border-radius: 6px; font-size: 0.7rem; }
    .ai-hero-rec { display: flex; gap: 1rem; align-items: flex-start; }
    .ai-hero-rec.anim-even { animation: fadeInSlideRec1 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
    .ai-hero-rec.anim-odd { animation: fadeInSlideRec2 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
    @keyframes fadeInSlideRec1 {
      0% { opacity: 0; transform: translateY(8px) scale(0.98); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes fadeInSlideRec2 {
      0% { opacity: 0; transform: translateY(8px) scale(0.98); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    .ai-hero-icon { font-size: 2.2rem; background: rgba(133,92,214,0.1); padding: 0.65rem; border-radius: 14px; line-height: 1; flex-shrink: 0; }
    .ai-hero-text { display: flex; flex-direction: column; gap: 0.2rem; min-width: 0; }
    .ai-hero-text h3 { font-family: var(--font-heading); font-size: 1.2rem; font-weight: 800; color: var(--text-primary); margin: 0; }
    .ai-hero-text p { font-size: 0.9rem; color: var(--text-secondary); margin: 0; line-height: 1.4; }
    .ai-hero-stats { display: flex; gap: 1rem; font-size: 0.8rem; color: var(--text-muted); font-weight: 600; margin-top: 0.25rem; }
    .ai-hero-nav { display: flex; gap: 0.5rem; margin-top: 0.35rem; align-items: center; }
    .nav-arrow-rec {
      background: rgba(133, 92, 214, 0.08);
      border: 1.5px solid rgba(133, 92, 214, 0.15);
      color: var(--accent-primary);
      width: 26px;
      height: 26px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      font-size: 1.15rem;
      line-height: 1;
      padding: 0;
      padding-bottom: 2px;
      user-select: none;
    }
    .nav-arrow-rec:hover {
      background: var(--accent-primary);
      color: #fff;
      transform: scale(1.1);
    }
    .ai-hero-actions { display: flex; flex-direction: column; align-items: center; gap: 0.65rem; flex-shrink: 0; }
    .btn-hero {
      font-family: inherit;
      padding: 0.6rem 1.35rem;
      font-size: 0.92rem;
      border-radius: 11px;
      font-weight: 800;
      background: var(--gradient-brand);
      border: 1.5px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 4px 12px rgba(133, 92, 214, 0.2);
    }
    .btn-hero:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(133, 92, 214, 0.3);
      filter: brightness(1.08);
    }
    .btn-hero:active {
      transform: translateY(0);
    }
    .btn-hero-secondary { background: none; border: none; color: var(--accent-primary); font-size: 0.82rem; font-weight: 700; cursor: pointer; transition: all 0.2s; padding: 0.4rem 0.8rem; border-radius: 9px; }
    .btn-hero-secondary:hover { background: rgba(133,92,214,0.08); text-decoration: underline; }

    /* FULL-WIDTH ACTIVITY */
    .activity-section-full { margin-bottom: 2.5rem; }
    .activity-section-full .recent-activity { max-width: 100%; }

    /* CONTEXTUAL CTA BADGE */
    .clickable-badge.review { background: rgba(239,68,68,0.1); color: #ef4444; border-color: rgba(239,68,68,0.2); }

    /* PAES GOAL BAR */
    .paes-goal-bar { padding: 1.25rem 1.5rem; border-radius: 16px; margin-bottom: 2rem; display: flex; flex-direction: column; gap: 0.85rem; border: 2px solid var(--glass-border) !important; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
    .paes-goal-bar:hover { border-color: rgba(133,92,214,0.4) !important; transform: translateY(-4px); box-shadow: var(--shadow-md); }
    .goal-header { display: flex; justify-content: space-between; align-items: center; }
    .goal-info { display: flex; flex-direction: column; gap: 0.15rem; }
    .goal-label { font-size: 0.95rem; font-weight: 700; color: var(--text-primary); }
    .goal-target { font-size: 0.85rem; color: #4b5563; font-weight: 700; }
    .goal-score-display { display: flex; flex-direction: column; align-items: flex-end; gap: 0.1rem; }
    .goal-current { font-size: 1.8rem; font-weight: 800; font-family: var(--font-heading); background: var(--gradient-brand); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1; }
    .goal-current.on-track { background: linear-gradient(135deg, #10b981, #34d399); -webkit-background-clip: text; }
    .goal-current.behind { background: linear-gradient(135deg, #f59e0b, #fbbf24); -webkit-background-clip: text; }
    .goal-current-label { font-size: 0.75rem; color: #6b7280; font-weight: 600; }
    .goal-bar-bg { height: 10px; background: var(--bg-secondary); border-radius: 99px; overflow: visible; position: relative; border: 1px solid var(--glass-border); }
    .goal-bar-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, #f59e0b, #fbbf24); transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1); max-width: 100%; }
    .goal-bar-fill.on-track { background: linear-gradient(90deg, #10b981, #34d399); }
    .goal-marker { position: absolute; top: -6px; transform: translateX(-50%); }
    .goal-marker-label { font-size: 0.65rem; font-weight: 800; color: var(--accent-primary); background: rgba(133,92,214,0.1); padding: 0.1rem 0.4rem; border-radius: 4px; }
    .goal-hint { font-size: 0.82rem; color: #374151; font-weight: 700; }
    .goal-hint.on-track { color: #10b981; }
    .btn-meta-materias {
      background: rgba(133, 92, 214, 0.12);
      border: 1.5px solid rgba(133, 92, 214, 0.35);
      color: var(--accent-primary);
      padding: 0.45rem 0.9rem;
      border-radius: 10px;
      font-size: 0.82rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-meta-materias:hover { background: rgba(133, 92, 214, 0.2); transform: translateY(-1px); }
    .meta-paes-materias-modal { max-width: 520px; width: 100%; border-radius: 20px; overflow: hidden; }
    .meta-paes-materias-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.65rem; }
    .meta-paes-materias-list li {
      display: flex; justify-content: space-between; align-items: center; gap: 1rem;
      padding: 0.85rem 1rem; border-radius: 12px; border: 1.5px solid var(--glass-border); background: #fff;
    }
    .meta-paes-materias-list li.excluded { opacity: 0.65; background: var(--bg-secondary); }
    .meta-materia-info { display: flex; flex-direction: column; gap: 0.15rem; min-width: 0; }
    .meta-materia-name { font-weight: 800; font-size: 0.95rem; color: var(--text-primary); }
    .meta-materia-detail { font-size: 0.78rem; color: var(--text-secondary); font-weight: 600; }
    .btn-toggle-materia {
      flex-shrink: 0; padding: 0.45rem 0.75rem; border-radius: 8px; border: 1.5px solid rgba(239, 68, 68, 0.35);
      background: rgba(239, 68, 68, 0.08); color: #dc2626; font-size: 0.78rem; font-weight: 700; cursor: pointer; transition: all 0.2s;
    }
    .btn-toggle-materia.is-excluded {
      border-color: rgba(16, 185, 129, 0.4); background: rgba(16, 185, 129, 0.1); color: #059669;
    }
    .btn-toggle-materia:disabled { opacity: 0.6; cursor: not-allowed; }
    .meta-paes-empty { text-align: center; padding: 1.5rem 0.5rem; color: var(--text-secondary); }
    .meta-paes-empty span { font-size: 2rem; display: block; margin-bottom: 0.5rem; }
 
    /* BLURRED CHART EMPTY STATE */
    .empty-state-mastery { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 0.75rem; min-height: 110px; border-radius: 12px; overflow: hidden; border: 2px dashed rgba(133, 92, 214, 0.35); background: rgba(0, 0, 0, 0.01); }
    .blurred-chart-preview { position: absolute; inset: 0; display: flex; align-items: flex-end; justify-content: center; gap: 12px; padding: 1.5rem; filter: blur(6px); opacity: 0.15; pointer-events: none; }
    .preview-bar { width: 24px; border-radius: 6px 6px 0 0; background: linear-gradient(180deg, rgba(133,92,214,0.6), rgba(133,92,214,0.2)); }
    .empty-mastery-text {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.4rem;
      text-align: center;
      max-width: 92%;
    }
    .empty-mastery-icon { font-size: 1.5rem; }
    .empty-mastery-text p { font-size: 0.82rem; color: var(--text-primary); margin: 0 0 0.25rem 0; max-width: 220px; line-height: 1.45; font-weight: 600; }
 
    /* TREND CHART */
    .trend-chart { width: 100%; margin-top: 0.5rem; display: flex; flex-direction: column; align-items: center; gap: 0.3rem; }
    .trend-svg { width: 100%; height: 42px; border-radius: 8px; }
    .trend-label { font-size: 0.78rem; font-weight: 700; color: #4b5563; }
    .trend-label.up { color: #10b981; }
    .trend-label.down { color: #ef4444; }
 
    /* WEEKLY CALENDAR */
    .week-calendar { display: flex; justify-content: space-between; gap: 0.25rem; padding: 0.35rem 0.15rem 0; margin-top: 0.25rem; border-top: 1.5px solid var(--glass-border); }
    .week-day { display: flex; flex-direction: column; align-items: center; gap: 0.15rem; flex: 1; }
    .week-day-label { font-size: 0.65rem; font-weight: 800; color: #4b5563; text-transform: uppercase; letter-spacing: 0.03em; }
    .week-day-dot { width: 20px; height: 20px; border-radius: 50%; border: 1.5px solid var(--glass-border); display: flex; align-items: center; justify-content: center; font-size: 0.62rem; font-weight: 800; color: transparent; transition: all 0.3s; background: rgba(0,0,0,0.02); }
    .week-day-dot.filled { background: linear-gradient(135deg, #10b981, #34d399); border-color: #10b981; color: #fff; box-shadow: 0 2px 8px rgba(16,185,129,0.25); }
    .week-day.today .week-day-label { color: var(--accent-primary); font-weight: 800; }
    .week-day.today .week-day-dot:not(.filled) { border-color: var(--accent-primary); border-style: dashed; background: rgba(133,92,214,0.05); }

    /* KPIS ROW */
    .kpis-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 1.5rem; }
    .kpi-card { display: flex; align-items: center; gap: 0.85rem; padding: 0.65rem 1rem; border-radius: 12px; transition: all 0.2s; height: 62px; box-sizing: border-box; }
    .kpi-card:hover { transform: translateY(-2px); border-color: rgba(133,92,214,0.3); }
    .kpi-icon { font-size: 1.2rem; width: 34px; height: 34px; border-radius: 8px; background: rgba(133,92,214,0.08); display: flex; align-items: center; justify-content: center; }
    .kpi-content { display: flex; flex-direction: column; }
    .kpi-value { font-size: 1.1rem; font-weight: 800; color: var(--text-primary); font-family: var(--font-heading); line-height: 1.1; }
    .kpi-label { font-size: 0.76rem; color: #4b5563; font-weight: 700; line-height: 1.1; }

    /* PROFILE COMPLETION CARD WITH SHINE GLOW EFFECT */
    .profile-completion-card {
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.95rem 1.35rem;
      border-radius: 16px;
      margin-bottom: 1.5rem;
      margin-top: 1.25rem;
      background: linear-gradient(135deg, rgba(133, 92, 214, 0.08) 0%, rgba(99, 102, 241, 0.15) 100%);
      border: 2px solid rgba(133, 92, 214, 0.5) !important;
      gap: 1.5rem;
      flex-wrap: wrap;
      animation: profile-glow-pulse 2.5s infinite ease-in-out;
    }
    
    @keyframes profile-glow-pulse {
      0% {
        box-shadow: 0 0 8px rgba(133, 92, 214, 0.2), var(--shadow);
        border-color: rgba(133, 92, 214, 0.5) !important;
      }
      50% {
        box-shadow: 0 0 20px rgba(133, 92, 214, 0.55), var(--shadow);
        border-color: rgba(133, 92, 214, 0.8) !important;
      }
      100% {
        box-shadow: 0 0 8px rgba(133, 92, 214, 0.2), var(--shadow);
        border-color: rgba(133, 92, 214, 0.5) !important;
      }
    }

    .profile-completion-card::after {
      content: '';
      position: absolute;
      top: 0;
      left: -150%;
      width: 80px;
      height: 100%;
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.35) 50%,
        rgba(255, 255, 255, 0) 100%
      );
      transform: skewX(-25deg);
      animation: shimmer-sweep 6s infinite ease-in-out;
      pointer-events: none;
    }

    @keyframes shimmer-sweep {
      0% { left: -150%; }
      20% { left: 150%; }
      100% { left: 150%; }
    }

    .alert-icon-pulse {
      font-size: 1.15rem;
      animation: icon-bounce 1.5s infinite ease-in-out;
      display: inline-block;
    }
    @keyframes icon-bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-3px); }
    }

    .profile-completion-info {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      font-size: 0.88rem;
      font-weight: 700;
    }
    .profile-completion-pct {
      color: var(--accent-primary);
      font-weight: 800;
    }
    .profile-completion-text {
      color: #374151;
    }
    .profile-completion-progress-wrapper {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex: 1;
      justify-content: flex-end;
      min-width: 250px;
    }
    .profile-completion-bar-bg {
      flex: 1;
      max-width: 200px;
      height: 8px;
      background: rgba(0, 0, 0, 0.05);
      border-radius: 99px;
      overflow: hidden;
    }
    .profile-completion-bar-fill {
      height: 100%;
      border-radius: 99px;
      background: var(--gradient-brand);
      transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .btn-complete-profile {
      font-family: inherit;
      background: var(--gradient-brand);
      border: 1px solid rgba(255, 255, 255, 0.25);
      color: white;
      font-weight: 800;
      font-size: 0.85rem;
      cursor: pointer;
      padding: 0.5rem 1.1rem;
      border-radius: 10px;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      white-space: nowrap;
      box-shadow: 0 4px 12px rgba(133, 92, 214, 0.3);
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
    }
    .btn-complete-profile:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(133, 92, 214, 0.45);
      filter: brightness(1.1);
      text-decoration: none;
    }
    .btn-complete-profile:active {
      transform: translateY(0);
    }
    .completion-pill-badge {
      background: linear-gradient(135deg, #f59e0b, #ea580c);
      color: white;
      padding: 0.25rem 0.65rem;
      border-radius: 99px;
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0.01em;
      box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
      display: inline-flex;
      align-items: center;
      text-transform: uppercase;
    }

    /* FLOATING HELP FAB & MODAL */
    .help-fab {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: var(--gradient-brand);
      color: #ffffff;
      border: 1.5px solid rgba(255, 255, 255, 0.25);
      box-shadow: 0 4px 15px rgba(133, 92, 214, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 999;
    }
    .help-fab:hover {
      transform: scale(1.1) rotate(15deg);
      box-shadow: 0 8px 25px rgba(133, 92, 214, 0.6);
      filter: brightness(1.1);
    }
    .help-fab:active {
      transform: scale(0.95);
    }
    .help-modal-container {
      max-width: 720px !important;
      width: 90% !important;
      margin: auto !important;
    }
    .help-modal-body {
      max-height: 65vh;
      overflow-y: auto;
      padding: 1rem 1.5rem 1.5rem;
    }
    .help-intro-text {
      font-size: 0.95rem;
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
      line-height: 1.5;
      font-weight: 500;
    }
    .help-sections-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;
    }
    @media (max-width: 768px) {
      .help-fab {
        bottom: 1.5rem;
        right: 1.5rem;
        width: 44px;
        height: 44px;
        font-size: 1.3rem;
      }
    }
    @media (max-width: 600px) {
      .help-sections-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      .help-modal-body {
        padding: 0.75rem 1rem 1.25rem;
      }
    }
    .help-section-card {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      padding: 1rem;
      border-radius: 14px;
      background: rgba(0, 0, 0, 0.02);
      border: 1.5px solid var(--glass-border);
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .help-section-card:hover {
      transform: translateY(-2px);
      background: #ffffff;
      border-color: rgba(133, 92, 214, 0.35);
      box-shadow: 0 4px 12px rgba(133, 92, 214, 0.08);
    }
    .help-card-icon {
      font-size: 1.5rem;
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: rgba(133, 92, 214, 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: var(--accent-primary);
    }
    .help-card-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .help-card-info h4 {
      margin: 0;
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .help-card-info p {
      margin: 0;
      font-size: 0.85rem;
      color: var(--text-secondary);
      line-height: 1.4;
    }
    .btn-buscar-carreras {
      font-size: 0.82rem;
      font-weight: 800;
      color: var(--accent-primary);
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.45rem 1rem;
      border-radius: 10px;
      background: rgba(133, 92, 214, 0.08);
      border: 1.5px solid rgba(133, 92, 214, 0.18);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .btn-buscar-carreras:hover {
      background: var(--accent-primary);
      color: #fff;
      transform: translateY(-1.5px);
      box-shadow: 0 4px 12px rgba(133, 92, 214, 0.25);
    }
    .btn-buscar-carreras:active {
      transform: translateY(0);
    }

    /* ENRICHED ACTIVITY ITEMS */
    .activity-meta { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.15rem; }
    .activity-subject-badge { font-size: 0.72rem; font-weight: 700; background: rgba(133,92,214,0.08); color: var(--accent-primary); padding: 0.15rem 0.5rem; border-radius: 6px; border: 1px solid rgba(133,92,214,0.15); white-space: nowrap; }
    .performance-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    .performance-dot.green { background: #10b981; box-shadow: 0 0 6px rgba(16,185,129,0.4); }
    .performance-dot.yellow { background: #f59e0b; box-shadow: 0 0 6px rgba(245,158,11,0.4); }
    .performance-dot.red { background: #ef4444; box-shadow: 0 0 6px rgba(239,68,68,0.4); }

    .kpis-row-sidebar {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .kpis-row-sidebar-top {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    @media (min-width: 1025px) {
      .dashboard-grid {
        display: grid;
        grid-template-columns: 1.5fr 0.75fr 0.85fr;
        grid-template-rows: auto auto auto auto;
        gap: 1.5rem;
        align-items: stretch;
      }
      .profile-completion-card {
        grid-column: 1 / 4;
        grid-row: 1;
        box-sizing: border-box;
      }
      .ai-hero {
        grid-column: 1 / 3;
        grid-row: 2;
      }
      .paes-goal-bar {
        grid-column: 3;
        grid-row: 2;
      }
      .mastery-card {
        grid-column: 1;
        grid-row: 3;
      }
      .record-card {
        grid-column: 2;
        grid-row: 3;
        margin-bottom: 0 !important;
      }
      .combined-streak-card {
        grid-column: 3;
        grid-row: 3;
        margin-bottom: 0 !important;
      }
      .activity-section-full {
        grid-column: 1 / 4;
        grid-row: 4;
      }
    }

    /* RESPONSIVE */
    @media (max-width: 1024px) {
      .welcome-widgets-row {
        flex-direction: column;
        align-items: stretch;
        gap: 1.25rem;
      }
      .welcome-widgets-row .kpis-row-sidebar-top {
        width: 100%;
      }
      .metrics-section { grid-template-columns: 1fr; }
      .activity-section { grid-template-columns: 1fr; }
      .ai-hero { flex-direction: column; align-items: stretch; }
      .ai-hero-actions { flex-direction: row; justify-content: center; }
    }
    @media (max-width: 768px) {
      .sidebar { display: none; }
      .mobile-header { display: flex; }
      .main-content { margin-left: 0; padding-top: 80px; }
      .dashboard-header {
        height: auto;
        padding: 1.5rem;
        flex-direction: column;
        align-items: flex-start;
        gap: 1.25rem;
      }
      .header-greeting {
        font-size: 1.8rem;
      }
      .dashboard-body {
        padding: 1.5rem;
      }
      .welcome-actions { width: 100%; justify-content: space-between; }
      .ai-hero { padding: 1rem; }
      .ai-hero-text h3 { font-size: 1rem; }
      .paes-goal-bar { padding: 1rem; }
      .goal-current { font-size: 1.4rem; }
      .week-day-dot { width: 24px; height: 24px; font-size: 0.6rem; }
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  public authService = inject(AuthService);
  public firestoreService = inject(FirestoreService);
  public dashSvc = inject(DashboardService);
  public paesContent = inject(PaesContentService);
  public router = inject(Router);
  countdown = { days: 0, hours: 0, minutes: 0 };
  nextExamLabel = '';
  private countdownInterval: any;
  private autoPlayInterval: any;
  public notificationService = inject(NotificationService);
  private toast = inject(ToastService);
  public adminService = inject(AdminService);
  public miniEnsayoSvc = inject(MiniEnsayoService);
  public paymentService = inject(PaymentService);

  get herramientasExpanded(): boolean {
    const isToolRoute = this.router.url.includes('/encuentra-tu-carrera') || 
                        this.router.url.includes('/calculadora-nem') || 
                        this.router.url.includes('/recursos');
    if (isToolRoute) return true;
    const val = localStorage.getItem('herramientasExpanded');
    return val !== 'false';
  }

  toggleHerramientas() {
    this.isCollapsible = true;
    const current = this.herramientasExpanded;
    localStorage.setItem('herramientasExpanded', String(!current));
  }

  isCollapsible = false;

  mobileMenuOpen = false;
  activeRecIdx = 0;
  showProfileModal = false;
  showSettingsModal = false;
  showHistoryModal = false;
  showStreakInfo = false;
  showMetaPaesMateriasModal = false;
  savingMetaPaesMaterias = false;
  showLogoutConfirm = false;
  showHelpModal = false;
  currentDate = (() => {
    const formatted = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  })();

  // Weekly streak calendar
  weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  weeklyActivity: boolean[] = [false, false, false, false, false, false, false];
  todayWeekIndex = (() => {
    const d = new Date().getDay();
    return d === 0 ? 6 : d - 1; // Mon=0...Sun=6
  })();

  // Trend chart data
  recentScores: { score: number; total: number; correct: number; date: string }[] = [];
  trendPoints: { x: number; y: number }[] = [];
  trendLinePath = '';
  trendAreaPath = '';
  trendDirection = 0;

  // Last activity for continue banner
  lastActivity = computed(() => {
    const acts = this.dashSvc.activities();
    if (acts.length === 0) return null;
    return acts[0];
  });

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
      this.weeklyActivity = this.dashSvc.getWeeklyActivity();
      this.updateTrendChart();
      const recs = this.dashSvc.recommendations();
      if (recs && this.activeRecIdx >= recs.length) {
        this.activeRecIdx = 0;
      }
    });
  }

  getMasteryColor(pct: number): string {
    if (pct >= 80) return 'linear-gradient(90deg, #10b981, #34d399)';
    if (pct >= 50) return 'linear-gradient(90deg, #855cd6, #a78bfa)';
    if (pct >= 25) return 'linear-gradient(90deg, #f59e0b, #fbbf24)';
    return 'linear-gradient(90deg, #ef4444, #f87171)';
  }

  getWeeklyStudyHours(): number {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);

    let totalMinutes = 0;
    for (const act of this.dashSvc.activities()) {
      let actDate: Date;
      if (typeof act.timestamp === 'string') {
        actDate = new Date(act.timestamp);
      } else if (act.timestamp && typeof act.timestamp.toDate === 'function') {
        actDate = act.timestamp.toDate();
      } else if (act.timestamp && act.timestamp.seconds) {
        actDate = new Date(act.timestamp.seconds * 1000);
      } else {
        continue;
      }

      if (isNaN(actDate.getTime())) continue;
      if (actDate.getTime() >= monday.getTime()) {
        if (act.type === 'leccion') totalMinutes += 15;
        else if (act.type === 'ensayo') totalMinutes += 140;
        else if (act.type === 'mente-veloz') totalMinutes += 5;
        else if (act.type === 'mini-ensayo') totalMinutes += 20;
      }
    }
    return parseFloat((totalMinutes / 60).toFixed(1));
  }

  getCompletedEnsayosCount(): number {
    return this.dashSvc.paesRecords().length;
  }

  getCorrectQuestionsCount(): number {
    return this.dashSvc.activities().reduce((acc, act) => acc + (act.totalCorrect || 0), 0);
  }

  getProfileCompletion(): number {
    const p = this.firestoreService.profileSignal();
    if (!p) return 0;
    let completion = 0;
    if (p.displayName) completion += 20;
    if (p.targetScore) completion += 25;
    if (p.targetCareer) completion += 25;
    if (p.targetUniversity) completion += 20;
    if (p.photoURL || p.profileEmoji) completion += 10;
    return completion;
  }

  getProfileCompletionMessage(): string {
    const p = this.firestoreService.profileSignal();
    if (!p) return '';
    const completion = this.getProfileCompletion();
    if (completion === 100) {
      return '¡Tu perfil está al 100%! Ruta IA completamente personalizada.';
    }
    if (!p.targetScore) {
      return 'Define tu puntaje meta PAES';
    }
    if (!p.targetCareer) {
      return 'Define la carrera que quieres estudiar';
    }
    if (!p.targetUniversity) {
      return 'Elige tu universidad de destino';
    }
    return 'Completa tu foto o emoji de perfil';
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
    this.checkPendingCheckout();
    this.startCountdown();
    this.startAutoPlay();
  }

  ngOnDestroy() {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    this.stopAutoPlay();
  }

  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayInterval = setInterval(() => {
      const recs = this.dashSvc.recommendations();
      if (recs && recs.length > 1) {
        this.activeRecIdx = (this.activeRecIdx + 1) % recs.length;
      }
    }, 5000);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  private startCountdown() {
    const targets = [
      { label: 'PAES Invierno 2026', date: new Date('June 15, 2026 09:00:00') },
      { label: 'PAES Regular 2026', date: new Date('November 30, 2026 09:00:00') },
      { label: 'PAES Invierno 2027', date: new Date('June 14, 2027 09:00:00') },
      { label: 'PAES Regular 2027', date: new Date('November 29, 2027 09:00:00') }
    ];

    const update = () => {
      const now = new Date().getTime();
      const nextTarget = targets.find(t => t.date.getTime() > now);

      if (!nextTarget) {
        this.nextExamLabel = 'Próxima PAES';
        this.countdown = { days: 0, hours: 0, minutes: 0 };
        return;
      }

      this.nextExamLabel = nextTarget.label;
      const diff = nextTarget.date.getTime() - now;
      
      this.countdown = {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      };
    };
    
    update();
    this.countdownInterval = setInterval(update, 60000);
  }

  checkPendingCheckout() {
    const pending = localStorage.getItem('estudiauni_pending_checkout');
    if (!pending) return;

    try {
      const intent = JSON.parse(pending) as { plan: 'monthly' | 'yearly' };
      localStorage.removeItem('estudiauni_pending_checkout');

      // If user is already premium, do nothing
      const profile = this.firestoreService.profileSignal();
      if (profile?.plan === 'premium') {
        return;
      }

      // Open the unified payment modal directly to the recipient step
      this.paymentService.openPricingModal(true, intent.plan);
    } catch (e) {
      console.warn('Error reading pending checkout session:', e);
      localStorage.removeItem('estudiauni_pending_checkout');
    }
  }

  onProfileModalClose() {
    this.showProfileModal = false;
    this.firestoreService.getUserProfile().subscribe();
  }

  onSettingsModalClose() {
    this.showSettingsModal = false;
  }

  updateRecordDisplay() {
    const allRecords = this.dashSvc.paesRecords().filter(r => r.mode === 'real');
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
    if (len > 0) {
      this.activeRecIdx = (this.activeRecIdx + 1) % len;
      this.startAutoPlay();
    }
  }

  prevRecommendation() {
    const len = this.dashSvc.recommendations().length;
    if (len > 0) {
      this.activeRecIdx = (this.activeRecIdx - 1 + len) % len;
      this.startAutoPlay();
    }
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
    } else if (act.type === 'mente-veloz') {
      this.router.navigate(['/mente-veloz'], {
        queryParams: { historyId: act.id }
      });
    } else if (act.type === 'mini-ensayo') {
      try {
        const historyRaw = localStorage.getItem('estudiauni_mini_ensayo_history') || '[]';
        const history = JSON.parse(historyRaw);
        const result = history.find((h: any) => h.sessionId === act.id);
        if (result) {
          this.miniEnsayoSvc.setLastResult(result);
          this.router.navigate(['/mini-ensayo/review']);
        } else {
          console.warn('[Dashboard] Historical mini-ensayo not found in localStorage:', act.id);
        }
      } catch (e) {
        console.error('[Dashboard] Failed to load historical mini-ensayo', e);
      }
    }
  }

  confirmLogout() {
    this.showLogoutConfirm = true;
  }

  async executeLogout() {
    this.showLogoutConfirm = false;
    await firstValueFrom(this.authService.logout());
    this.router.navigate(['/']);
  }

  // ─── NEW METHODS ───

  navigateToLastActivity() {
    const last = this.lastActivity();
    if (!last) return;
    if (last.type === 'leccion') {
      this.router.navigate(['/ruta']);
    } else if (last.type === 'ensayo') {
      this.router.navigate(['/ensayos']);
    } else if (last.type === 'mini-ensayo') {
      this.router.navigate(['/mini-ensayo']);
    } else if (last.type === 'mente-veloz') {
      this.router.navigate(['/mente-veloz']);
    } else {
      this.router.navigate(['/ruta']);
    }
  }

  updateTrendChart() {
    this.recentScores = this.dashSvc.getRecentScores(5);
    if (this.recentScores.length < 2) {
      this.trendPoints = [];
      this.trendLinePath = '';
      this.trendAreaPath = '';
      this.trendDirection = 0;
      return;
    }

    const scores = this.recentScores.map(s => s.score);
    const minScore = Math.min(...scores) - 20;
    const maxScore = Math.max(...scores) + 20;
    const range = maxScore - minScore || 1;
    const w = 200;
    const h = 60;
    const padding = 8;

    this.trendPoints = scores.map((s, i) => ({
      x: padding + (i / (scores.length - 1)) * (w - padding * 2),
      y: h - padding - ((s - minScore) / range) * (h - padding * 2)
    }));

    this.trendLinePath = this.trendPoints.map(p => `${p.x},${p.y}`).join(' ');

    const first = this.trendPoints[0];
    const last = this.trendPoints[this.trendPoints.length - 1];
    this.trendAreaPath = `M${first.x},${h} L${this.trendPoints.map(p => `${p.x},${p.y}`).join(' L')} L${last.x},${h} Z`;

    this.trendDirection = scores[scores.length - 1] - scores[0];
  }

  getMetaPaesExcluded(): string[] {
    return this.firestoreService.profileSignal()?.metaPaesExcludedSubjects ?? [];
  }

  getMetaPaesMateriasList() {
    return this.dashSvc.getPaesSubjectsSummary();
  }

  isMetaPaesSubjectExcluded(subjectId: string): boolean {
    return this.dashSvc.isSubjectExcludedFromMeta(subjectId, this.getMetaPaesExcluded());
  }

  getMetaPaesIncludedCount(): number {
    const all = this.getMetaPaesMateriasList();
    return all.filter(m => !this.isMetaPaesSubjectExcluded(m.id)).length;
  }

  getMetaPaesTotalEnsayosIncluded(): number {
    const excluded = this.getMetaPaesExcluded();
    return this.dashSvc.paesRecords().filter(
      r => r.mode === 'real' && !this.dashSvc.isSubjectExcludedFromMeta(r.subject, excluded)
    ).length;
  }

  async toggleMetaPaesSubject(subjectId: string): Promise<void> {
    const current = [...this.getMetaPaesExcluded()];
    const isExcluded = this.isMetaPaesSubjectExcluded(subjectId);
    const next = isExcluded
      ? current.filter(ex => !this.dashSvc.subjectsMatch(subjectId, ex))
      : [...current, subjectId];
    this.savingMetaPaesMaterias = true;
    try {
      await this.firestoreService.updateProfileSettings({ metaPaesExcludedSubjects: next });
    } catch {
      this.toast.error('No se pudo actualizar las materias.');
    } finally {
      this.savingMetaPaesMaterias = false;
    }
  }

  getRoundedAverageScore(): number {
    const avg = this.dashSvc.getAverageScore(this.getMetaPaesExcluded());
    return avg ? Math.round(avg) : 0;
  }

  getGoalProgress(): number {
    const target = this.firestoreService.profileSignal()?.targetScore;
    if (!target) return 0;
    const avg = this.dashSvc.getAverageScore(this.getMetaPaesExcluded());
    if (avg === 0) return 0;
    return Math.min(100, Math.round((avg / target) * 100));
  }

  getPerformanceLevel(act: any): 'good' | 'medium' | 'low' | 'none' {
    if (act.score === undefined && act.totalCorrect === undefined) return 'none';
    let pct = 0;
    if (act.type === 'leccion') {
      pct = act.score || 0;
    } else if (act.totalCorrect !== undefined && act.totalQuestions) {
      pct = (act.totalCorrect / act.totalQuestions) * 100;
    } else {
      pct = act.score || 0;
    }
    if (pct >= 70) return 'good';
    if (pct >= 40) return 'medium';
    return 'low';
  }

  formatActivityTime(timestamp: any): string {
    if (!timestamp) return '---';
    let date: Date;
    if (typeof timestamp === 'string') {
      date = new Date(timestamp);
    } else if (timestamp && typeof timestamp.toDate === 'function') {
      date = timestamp.toDate();
    } else if (timestamp && timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else {
      return '---';
    }
    if (isNaN(date.getTime())) return '---';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffHours < 24) {
      return this.dashSvc.getRelativeTime(timestamp);
    }
    return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  }

  /** Convert raw correct/total to estimated PAES score (100-1000 scale) */
  calculatePaesScore(record: any): number {
    if (!record || !record.totalQuestions) return 0;
    const pct = record.correctAnswers / record.totalQuestions;
    // PAES scale: 100 (floor) to 1000 (ceiling), linear mapping
    return Math.round(100 + pct * 900);
  }

  /** Returns the delta between latest and previous ensayo score */
  getImprovementDelta(): number | null {
    if (this.recentScores.length < 2) return null;
    const latest = this.recentScores[this.recentScores.length - 1].score;
    const previous = this.recentScores[this.recentScores.length - 2].score;
    const delta = latest - previous;
    return delta === 0 ? null : delta;
  }

  /** Bullet bar width % based on projected score vs target */
  getBulletWidth(projected: number, target: number): number {
    if (!projected || !target) return 0;
    return Math.min(100, Math.round((projected / target) * 100));
  }

  /** Contextual CTA text based on performance */
  getContextualCTA(act: any): string {
    const perf = this.getPerformanceLevel(act);
    if (perf === 'low') return '🔍 Revisar errores';
    if (perf === 'good') return '✨ Ver detalles';
    return 'Ver →';
  }

  /** Set active recommendation index for hero card */
  setActiveRec(idx: number) {
    this.activeRecIdx = idx;
    this.startAutoPlay();
  }

}
