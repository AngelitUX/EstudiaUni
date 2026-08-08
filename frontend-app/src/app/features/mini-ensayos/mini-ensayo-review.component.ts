import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MiniEnsayoService } from '../../core/services/mini-ensayo.service';
import { PaesContentService } from '../../features/learning-path/services/paes-content.service';
import { KatexService } from '../../core/services/katex.service';
import { SettingsModalComponent } from '../profile/settings-modal.component';
import { ProfileModalComponent } from '../profile/profile-modal.component';
import { FirestoreService } from '../../core/services/firestore.service';
import { AdminService } from '../admin/services/admin.service';
import { AuthService } from '../../core/services/auth.service';
import { PaymentService } from '../../core/services/payment.service';


@Component({
  selector: 'app-mini-ensayo-review',
  standalone: true,
  imports: [CommonModule, RouterLink, SettingsModalComponent, ProfileModalComponent],
  template: `
    <div class="ensayos-container">
      
      <!-- SIDEBAR -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <a routerLink="/dashboard" class="sidebar-logo" style="text-decoration:none; display: flex; align-items: center; justify-content: center;">
            <img [src]="(isProPlan() || adminService.isAdmin()) ? 'https://res.cloudinary.com/dqm3syhwr/image/upload/f_auto,q_auto/v1/imagenes/branding/LogoEstudiaUniPREMIUM' : 'https://res.cloudinary.com/dqm3syhwr/image/upload/f_auto,q_auto/v1/imagenes/branding/LogoEstudiaUni'" alt="EstudiaUni" class="sidebar-logo-img" />
          </a>
        </div>
        <nav class="sidebar-nav">
          <a class="nav-item" routerLink="/dashboard"><span class="nav-icon">🏠</span><span class="nav-text">Inicio</span></a>
          <a class="nav-item" routerLink="/ruta"><span class="nav-icon">🗺️</span><span class="nav-text">Ruta de Aprendizaje</span></a>
          <a class="nav-item" routerLink="/ensayos"><span class="nav-icon">📚</span><span class="nav-text">Ensayos PAES</span></a>
          <a class="nav-item active" routerLink="/mini-ensayo"><span class="nav-icon">🎯</span><span class="nav-text">Mini Ensayos</span></a>
          <a class="nav-item" routerLink="/mente-veloz"><span class="nav-icon">⚡</span><span class="nav-text">Mente Veloz</span></a>
          
          <div class="sidebar-section-title" (click)="toggleHerramientas()">
            HERRAMIENTAS
            <span class="toggle-icon" [style.transform]="herramientasExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'">▼</span>
          </div>
          <div class="sidebar-sub-items" [class.expanded]="herramientasExpanded" [class.collapsible]="isCollapsible">
            <a class="nav-item" routerLink="/encuentra-tu-carrera"><span class="nav-icon">🎓</span><span class="nav-text">Encuentra tu Carrera</span></a>
            <a class="nav-item" routerLink="/calculadora-nem"><span class="nav-icon">🧮</span><span class="nav-text">Calculadora NEM</span></a>
            <a class="nav-item" routerLink="/recursos"><span class="nav-icon">📂</span><span class="nav-text">Recursos Adicionales</span></a>
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
        <button class="mobile-menu-btn" (click)="mobileOpen = !mobileOpen" aria-label="Abrir menú">
          <span style="display:flex;flex-direction:column;gap:5px;width:22px">
            <span style="display:block;height:2.5px;background:#fff;border-radius:2px"></span>
            <span style="display:block;height:2.5px;background:#fff;border-radius:2px"></span>
            <span style="display:block;height:2.5px;background:#fff;border-radius:2px"></span>
          </span>
        </button>
        <a routerLink="/dashboard" style="text-decoration:none;flex:1;text-align:center;display:flex;justify-content:center;">
          <img [src]="(isProPlan() || adminService.isAdmin()) ? 'https://res.cloudinary.com/dqm3syhwr/image/upload/f_auto,q_auto/v1/imagenes/branding/LogoEstudiaUniPREMIUM' : 'https://res.cloudinary.com/dqm3syhwr/image/upload/f_auto,q_auto/v1/imagenes/branding/LogoEstudiaUni'" alt="EstudiaUni" class="mobile-logo-img" />
        </a>
        <button class="profile-trigger" (click)="showProfileModal = true" style="background:none;border:none;cursor:pointer;padding:0">
          <span class="profile-avatar-wrap">
            <img *ngIf="firestoreService.profileSignal()?.photoURL; else avatarMobileMe" [src]="firestoreService.profileSignal()?.photoURL" alt="Foto" class="profile-avatar" style="width:32px;height:32px"/>
            <ng-template #avatarMobileMe><span class="profile-avatar fallback" style="width:32px;height:32px;font-size:0.9rem">{{ profileInitial() }}</span></ng-template>
          </span>
        </button>
      </div>
      <div class="mobile-overlay" [class.open]="mobileOpen" (click)="mobileOpen = false">
        <div class="mobile-menu" (click)="$event.stopPropagation()">
          <div style="padding: 1.5rem 1rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center;">
            <img [src]="(isProPlan() || adminService.isAdmin()) ? 'https://res.cloudinary.com/dqm3syhwr/image/upload/f_auto,q_auto/v1/imagenes/branding/LogoEstudiaUniPREMIUM' : 'https://res.cloudinary.com/dqm3syhwr/image/upload/f_auto,q_auto/v1/imagenes/branding/LogoEstudiaUni'" alt="EstudiaUni" style="width: 150px; height: auto;" />
            <button (click)="mobileOpen=false" style="background: none; border: none; color: rgba(255,255,255,0.7); font-size: 1.75rem; cursor: pointer; line-height: 1;">✕</button>
          </div>
          <nav class="sidebar-nav">
            <a class="nav-item" routerLink="/dashboard" (click)="mobileOpen=false"><span class="nav-icon">🏠</span><span class="nav-text">Inicio</span></a>
            <a class="nav-item" routerLink="/ruta" (click)="mobileOpen=false"><span class="nav-icon">🗺️</span><span class="nav-text">Ruta de Aprendizaje</span></a>
            <a class="nav-item" routerLink="/ensayos" (click)="mobileOpen=false"><span class="nav-icon">📚</span><span class="nav-text">Ensayos PAES</span></a>
            <a class="nav-item active" routerLink="/mini-ensayo" (click)="mobileOpen=false"><span class="nav-icon">🎯</span><span class="nav-text">Mini Ensayos</span></a>
            <a class="nav-item" routerLink="/mente-veloz" (click)="mobileOpen=false"><span class="nav-icon">⚡</span><span class="nav-text">Mente Veloz</span></a>
            <div class="sidebar-section-title">HERRAMIENTAS</div>
            <a class="nav-item" routerLink="/encuentra-tu-carrera" (click)="mobileOpen=false"><span class="nav-icon">🎓</span><span class="nav-text">Encuentra tu Carrera</span></a>
            <a class="nav-item" routerLink="/calculadora-nem" (click)="mobileOpen=false"><span class="nav-icon">🧮</span><span class="nav-text">Calculadora NEM</span></a>
            <a class="nav-item" routerLink="/recursos" (click)="mobileOpen=false"><span class="nav-icon">📂</span><span class="nav-text">Recursos Adicionales</span></a>
          </nav>
          <div style="padding: 1rem; border-top: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; gap: 0.5rem;">
            <a class="nav-item" (click)="showSettingsModal = true; mobileOpen=false"><span class="nav-icon">⚙️</span><span class="nav-text">Configuración</span></a>
            <a class="nav-item logout-btn-sidebar" (click)="confirmLogout(); mobileOpen=false"><span class="nav-icon">🚪</span><span class="nav-text">Cerrar Sesión</span></a>
          </div>
        </div>
      </div>

      <!-- MAIN CONTENT -->
      <main class="main-content review-page animate-fade-in-down" *ngIf="result() as res">
        <!-- HEADER -->
        <header class="dashboard-header">
          <div class="header-welcome-text">
            <h1 class="header-greeting"><span class="text-gradient">Resumen de Mini Ensayo</span></h1>
            <p class="subtitle" style="color: rgba(255,255,255,0.7); font-size: 0.95rem; margin: 0; font-weight: 500;">{{ materiaTitle() }} • {{ res.totalQuestions }} preguntas</p>
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

        <div class="dashboard-body" style="display: flex; flex-direction: column; align-items: center;">
          <button class="btn-back-review" routerLink="/mini-ensayo">← Volver a Mini Ensayos</button>
          <div class="review-container" style="width: 100%; max-width: 900px;">
        <!-- SCORE OVERVIEW -->
        <section class="overview-section">
          <div class="score-card glass-card main-score">
            <div class="score-label">Puntaje Estimado</div>
            <div class="score-value">{{ res.score }}</div>
            <div class="score-desc">Puntos tipo PAES</div>
          </div>
          
          <div class="stats-grid">
            <div class="stat-card glass-card">
              <span class="stat-icon correct">✅</span>
              <div class="stat-info">
                <span class="stat-val">{{ res.correctCount }}</span>
                <span class="stat-lbl">Correctas</span>
              </div>
            </div>
            <div class="stat-card glass-card">
              <span class="stat-icon wrong">❌</span>
              <div class="stat-info">
                <span class="stat-val">{{ res.totalQuestions - res.correctCount - omittedCount() }}</span>
                <span class="stat-lbl">Incorrectas</span>
              </div>
            </div>
            <div class="stat-card glass-card">
              <span class="stat-icon omitted">⏭️</span>
              <div class="stat-info">
                <span class="stat-val">{{ omittedCount() }}</span>
                <span class="stat-lbl">Omitidas</span>
              </div>
            </div>
            <div class="stat-card glass-card">
              <span class="stat-icon time">⏱️</span>
              <div class="stat-info">
                <span class="stat-val">{{ formatTime(res.timeSpent) }}</span>
                <span class="stat-lbl">Tiempo empleado</span>
              </div>
            </div>
          </div>
        </section>

        <!-- MEJORADOR COMPARISON -->
        @if (res.improvement && res.improvement.specific.length > 0) {
          <section class="mejorador-section animate-slide-up">
            <div class="section-title">
              <h2>📈 Evolución de Puntaje</h2>
              <p>Comparación con tus errores del ensayo anterior</p>
            </div>
            
            <div class="improvement-grid">
              @for (imp of res.improvement.specific; track imp.topic) {
                <div class="imp-card glass-card">
                  <div class="imp-header">
                    <span class="imp-topic">{{ imp.topic }}</span>
                    <span class="imp-badge" [class.positive]="imp.delta > 0" [class.negative]="imp.delta < 0" [class.neutral]="imp.delta === 0">
                      {{ imp.delta > 0 ? '+' : '' }}{{ imp.delta }}%
                    </span>
                  </div>
                  <div class="imp-bars">
                    <div class="bar-row">
                      <span class="bar-lbl">Antes</span>
                      <div class="bar-track"><div class="bar-fill old" [style.width.%]="imp.before"></div></div>
                      <span class="bar-val">{{ imp.before }}%</span>
                    </div>
                    <div class="bar-row">
                      <span class="bar-lbl">Ahora</span>
                      <div class="bar-track"><div class="bar-fill new" [style.width.%]="imp.after"></div></div>
                      <span class="bar-val">{{ imp.after }}%</span>
                    </div>
                  </div>
                </div>
              }
            </div>
          </section>
        }

        <!-- DESGLOSE POR TEMA -->
        <section class="breakdown-section animate-slide-up" style="animation-delay: 0.1s;">
          <div class="section-title">
            <h2>📊 Desglose por Tema</h2>
          </div>
          <div class="breakdown-list glass-card">
            @for (topic of res.topicBreakdown; track topic.topic) {
              <div class="breakdown-item">
                <div class="b-info">
                  <span class="b-name">{{ topic.topic }}</span>
                  <span class="b-score">{{ topic.correct }}/{{ topic.total }} correctas</span>
                </div>
                <div class="b-progress-wrap">
                  <div class="b-progress-bar">
                    <div class="b-fill" 
                         [class.good]="topic.percentage >= 75"
                         [class.avg]="topic.percentage >= 50 && topic.percentage < 75"
                         [class.bad]="topic.percentage < 50"
                         [style.width.%]="topic.percentage">
                    </div>
                  </div>
                  <span class="b-pct">{{ topic.percentage }}%</span>
                </div>
              </div>
            }
          </div>
        </section>

        <!-- REVISIÓN DE PREGUNTAS -->
        <section class="questions-review animate-slide-up" style="animation-delay: 0.2s;">
          <div class="section-title">
            <h2>📝 Revisión de Preguntas</h2>
            <p>Analiza tus aciertos y errores</p>
          </div>

          <div class="q-list">
            @for (q of answeredQuestions(); track q.id; let i = $index) {
              <div class="q-review-card glass-card">
                <div class="qr-header">
                  <div class="qr-title">
                    <span class="qr-num">#{{ i + 1 }}</span>
                    <span class="qr-topic">{{ q.tema }}</span>
                  </div>
                  <div class="qr-badge" 
                       [class.correct]="res.answers[q.id] === q.respuesta_correcta"
                       [class.wrong]="res.answers[q.id] && res.answers[q.id] !== q.respuesta_correcta"
                       [class.omitted]="!res.answers[q.id]">
                    {{ getStatusText(res.answers[q.id], q.respuesta_correcta) }}
                  </div>
                </div>

                <div class="qr-body">
                  @if (q.preambulo_texto) {
                    <div class="qr-context"><p>{{ q.preambulo_texto }}</p></div>
                  }
                  @if (q.preambulo_imagen_url) {
                    <img [src]="q.preambulo_imagen_url" class="qr-img" alt="Contexto">
                  }
                  <p class="qr-enunciado">{{ q.enunciado }}</p>
                  @if (q.formula_latex) {
                    <div class="qr-formula" [innerHTML]="renderLatex(q.formula_latex)"></div>
                  }

                  <div class="qr-options">
                    @for (key of optionKeys; track key) {
                      <div class="qr-opt" 
                           [class.is-correct-ans]="key === q.respuesta_correcta"
                           [class.is-user-ans]="key === res.answers[q.id]">
                        <span class="qr-opt-letter">{{ key }}</span>
                        <span class="qr-opt-text" *ngIf="q.tipo_alternativas !== 'imagen'">{{ q.alternativas[key] }}</span>
                        <img *ngIf="q.tipo_alternativas === 'imagen'" [src]="q.alternativas[key]" class="qr-opt-img" alt="Opción {{key}}">
                        
                        @if (key === q.respuesta_correcta) {
                          <span class="qr-indicator correct">✅ Correcta</span>
                        } @else if (key === res.answers[q.id]) {
                          <span class="qr-indicator wrong">❌ Tu respuesta</span>
                        }
                      </div>
                    }
                  </div>
                  
                  @if (isProPlan() || adminService.isAdmin() || res.answers[q.id] !== q.respuesta_correcta) {
                    <div class="qr-feedback" [class.good]="res.answers[q.id] === q.respuesta_correcta" [class.bad]="res.answers[q.id] !== q.respuesta_correcta">
                      <strong>Feedback:</strong>
                      {{ res.answers[q.id] === q.respuesta_correcta ? q.feedback_acierto : q.feedback_error }}
                    </div>
                  } @else {
                    <div class="qr-feedback locked-feedback">
                      <span>🔒 La justificación de respuestas correctas es exclusiva de <strong>PRO</strong>.</span>
                      <a (click)="paymentService.openPricingModal()" style="color: var(--accent-primary); cursor: pointer; font-weight: 700;">Mejorar a PRO</a>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </section>

        <!-- ACTIONS REMOVED AS REQUESTED -->
      </div>
      </div>
      </main>
    </div>

    <app-settings-modal *ngIf="showSettingsModal" (close)="showSettingsModal = false"></app-settings-modal>
    <app-profile-modal *ngIf="showProfileModal" (close)="showProfileModal = false"></app-profile-modal>

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

  `,
  styles: [`
    @keyframes floatLogo { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
    .sidebar-logo-img { width: 230px; height: auto; object-fit: contain; margin: 28px auto 0 auto; filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.2)); animation: floatLogo 3.5s ease-in-out infinite; }
    .mobile-logo-img { width: 160px; height: auto; object-fit: contain; margin: 12px auto 0 auto; animation: floatLogo 3.5s ease-in-out infinite; }
    :host { display: block; min-height: 100vh; background: #0F1018; color: var(--text-primary); }

    .btn-back-review {
      align-self: flex-start;
      margin-bottom: 1rem;
      background: transparent;
      border: none;
      color: var(--accent-primary);
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      padding: 0;
      transition: color 0.2s;
    }
    .btn-back-review:hover { color: #6b46b8; }

    .review-container { width: 100%; max-width: 900px; display: flex; flex-direction: column; gap: 2.5rem; }
    
    /* SECTIONS */
    .section-title { margin-bottom: 1.25rem; }
    .section-title h2 { font-family: var(--font-heading); font-size: 1.4rem; margin: 0 0 0.3rem; }
    .section-title p { color: var(--text-secondary); font-size: 0.95rem; margin: 0; }
    
    /* OVERVIEW */
    .overview-section { display: flex; gap: 1.5rem; flex-wrap: wrap; }
    .main-score { flex: 1; min-width: 250px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; border-color: rgba(133,92,214,0.3); background: rgba(133,92,214,0.05); }
    .score-label { font-size: 0.9rem; font-weight: 700; color: var(--accent-primary); text-transform: uppercase; letter-spacing: 0.05em; }
    .score-value { font-family: var(--font-heading); font-size: 4rem; font-weight: 900; background: var(--gradient-brand); -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1.1; margin: 0.5rem 0; }
    .score-desc { font-size: 0.85rem; color: var(--text-secondary); }
    
    .stats-grid { flex: 2; min-width: 300px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
    .stat-card { display: flex; align-items: center; gap: 1rem; padding: 1.25rem; }
    .stat-icon { font-size: 1.8rem; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 12px; }
    .stat-icon.correct { background: rgba(88,204,2,0.15); color: #58cc02; }
    .stat-icon.wrong { background: rgba(239,68,68,0.15); color: #ef4444; }
    .stat-icon.omitted { background: rgba(156,163,175,0.15); color: #9ca3af; }
    .stat-icon.time { background: rgba(56,189,248,0.15); color: #38bdf8; }
    .stat-info { display: flex; flex-direction: column; }
    .stat-val { font-size: 1.4rem; font-weight: 800; font-family: var(--font-heading); line-height: 1.2; }
    .stat-lbl { font-size: 0.8rem; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; }
    
    /* MEJORADOR */
    .improvement-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; }
    .imp-card { padding: 1.5rem; }
    .imp-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; }
    .imp-topic { font-weight: 800; font-size: 1.1rem; }
    .imp-badge { padding: 0.3rem 0.6rem; border-radius: 8px; font-weight: 700; font-size: 0.85rem; }
    .imp-badge.positive { background: rgba(88,204,2,0.15); color: #3d8c00; }
    .imp-badge.negative { background: rgba(239,68,68,0.15); color: #dc2626; }
    .imp-badge.neutral { background: rgba(156,163,175,0.15); color: #4b5563; }
    .bar-row { display: flex; align-items: center; gap: 0.8rem; margin-bottom: 0.75rem; }
    .bar-lbl { width: 50px; font-size: 0.85rem; color: var(--text-secondary); font-weight: 600; }
    .bar-track { flex: 1; height: 8px; background: var(--bg-secondary); border-radius: 99px; overflow: hidden; }
    .bar-fill { height: 100%; border-radius: 99px; }
    .bar-fill.old { background: #9ca3af; }
    .bar-fill.new { background: var(--accent-primary); }
    .bar-val { width: 40px; font-size: 0.85rem; font-weight: 700; text-align: right; }
    
    /* BREAKDOWN */
    .breakdown-list { display: flex; flex-direction: column; padding: 0.5rem; }
    .breakdown-item { display: flex; align-items: center; gap: 1.5rem; padding: 1rem; border-bottom: 1px solid rgba(0,0,0,0.05); }
    .breakdown-item:last-child { border-bottom: none; }
    .b-info { width: 180px; display: flex; flex-direction: column; }
    .b-name { font-weight: 700; font-size: 0.95rem; color: var(--text-primary); }
    .b-score { font-size: 0.8rem; color: var(--text-secondary); }
    .b-progress-wrap { flex: 1; display: flex; align-items: center; gap: 1rem; }
    .b-progress-bar { flex: 1; height: 10px; background: var(--bg-secondary); border-radius: 99px; overflow: hidden; }
    .b-fill { height: 100%; border-radius: 99px; transition: width 1s ease-out; }
    .b-fill.good { background: #58cc02; }
    .b-fill.avg { background: #eab308; }
    .b-fill.bad { background: #ef4444; }
    .b-pct { width: 45px; font-weight: 800; font-size: 0.95rem; text-align: right; }
    
    /* QUESTIONS REVIEW */
    .q-list { display: flex; flex-direction: column; gap: 1.5rem; }
    .q-review-card { padding: 1.5rem; }
    .qr-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; padding-bottom: 1rem; border-bottom: 1px dashed var(--glass-border); }
    .qr-title { display: flex; align-items: center; gap: 0.75rem; }
    .qr-num { font-weight: 800; font-size: 1.1rem; color: var(--text-primary); }
    .qr-topic { font-size: 0.75rem; font-weight: 700; background: var(--bg-secondary); padding: 0.2rem 0.6rem; border-radius: 6px; color: var(--text-secondary); text-transform: uppercase; }
    .qr-badge { padding: 0.35rem 0.8rem; border-radius: 8px; font-weight: 700; font-size: 0.85rem; }
    .qr-badge.correct { background: rgba(88,204,2,0.15); color: #3d8c00; }
    .qr-badge.wrong { background: rgba(239,68,68,0.15); color: #dc2626; }
    .qr-badge.omitted { background: rgba(156,163,175,0.15); color: #4b5563; }
    
    .qr-context { padding: 1rem; background: rgba(0,0,0,0.02); border-left: 3px solid var(--glass-border); margin-bottom: 1rem; font-style: italic; font-size: 0.9rem; color: var(--text-secondary); border-radius: 0 8px 8px 0; }
    .qr-img { max-width: 100%; max-height: 250px; border-radius: 8px; margin-bottom: 1rem; }
    .qr-enunciado { font-weight: 700; font-size: 1.05rem; line-height: 1.5; margin: 0 0 1.25rem; }
    .qr-formula { margin-bottom: 1.25rem; padding: 0.75rem; background: #fff; border: 1px solid var(--glass-border); border-radius: 8px; text-align: center; }
    
    .qr-options { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.25rem; }
    .qr-opt { display: flex; align-items: center; gap: 0.75rem; padding: 0.85rem 1rem; border-radius: 10px; border: 2px solid var(--glass-border); background: var(--bg-secondary); position: relative; }
    .qr-opt.is-correct-ans { border-color: #58cc02; background: rgba(88,204,2,0.05); }
    .qr-opt.is-user-ans:not(.is-correct-ans) { border-color: #ef4444; background: rgba(239,68,68,0.05); }
    .qr-opt-letter { width: 28px; height: 28px; border-radius: 6px; background: rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem; color: var(--text-secondary); }
    .qr-opt.is-correct-ans .qr-opt-letter { background: #58cc02; color: #fff; }
    .qr-opt.is-user-ans:not(.is-correct-ans) .qr-opt-letter { background: #ef4444; color: #fff; }
    .qr-opt-text { font-size: 0.95rem; color: var(--text-primary); }
    .qr-opt-img { max-height: 60px; border-radius: 4px; }
    .qr-indicator { position: absolute; right: 1rem; font-size: 0.8rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 6px; }
    .qr-indicator.correct { background: #58cc02; color: #fff; }
    .qr-indicator.wrong { background: #ef4444; color: #fff; }
    
    .qr-feedback { padding: 1rem; border-radius: 10px; font-size: 0.9rem; line-height: 1.5; }
    .qr-feedback.good { background: rgba(88,204,2,0.1); color: #2d6600; border: 1px solid rgba(88,204,2,0.2); }
    .qr-feedback.bad { background: rgba(239,68,68,0.1); color: #991b1b; border: 1px solid rgba(239,68,68,0.2); }
    .qr-feedback.locked-feedback { background: rgba(133,92,214,0.08); border: 1px dashed rgba(133,92,214,0.35); color: var(--text-secondary); display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
    
    /* ACTIONS */
    .bottom-actions { display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; }
    .btn-primary, .btn-secondary { padding: 0.85rem 1.5rem; border-radius: 12px; font-weight: 700; font-size: 1rem; cursor: pointer; transition: all 0.2s; border: none; text-decoration: none; display: inline-flex; justify-content: center; align-items: center; }
    .btn-primary { background: var(--gradient-brand); color: #fff; box-shadow: 0 4px 15px rgba(133,92,214,0.3); }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(133,92,214,0.4); }
    .btn-secondary { background: #fff; color: var(--accent-primary); border: 2px solid var(--accent-primary); }
    .btn-secondary:hover { background: rgba(133,92,214,0.05); }
    /* ANIMATIONS */
    .animate-fade-in { animation: none; opacity: 1; transform: none; }
    .animate-slide-up { animation: none; opacity: 1; transform: none; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    
    /* MOBILE HEADER */
    .mobile-header { display: none; position: fixed; top: 0; left: 0; right: 0; height: 60px; background: rgba(13,15,23,0.99); border-bottom: 1px solid rgba(255,255,255,0.12); padding: 0 1rem; align-items: center; gap: 0.75rem; z-index: 101; }
    .mobile-menu-btn { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #fff; cursor: pointer; padding: 0.5rem 0.65rem; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.2s; }
    .mobile-menu-btn:hover { background: rgba(255,255,255,0.15); }

    /* RESPONSIVE */
    @media (max-width: 1024px) {
      aside.sidebar, .sidebar { display: none !important; }
      .mobile-header { display: flex !important; }
      .main-content { margin-left: 0 !important; max-width: 100vw !important; width: 100% !important; padding: 0 !important; box-sizing: border-box !important; }
      .dashboard-header { display: none !important; }
      .dashboard-body { padding: 1.5rem !important; padding-top: 72px !important; }
      .overview-section { flex-direction: column; }
      .main-score { min-width: 0; }
      .stats-grid { min-width: 0; }
    }
    @media (max-width: 768px) {
      aside.sidebar, .sidebar { display: none !important; }
      .mobile-header { display: flex !important; }
      .main-content { margin-left: 0 !important; max-width: 100vw !important; width: 100% !important; padding: 0 !important; box-sizing: border-box !important; }
      .dashboard-header { display: none !important; }
      .dashboard-body { padding: 1rem 0.85rem 2rem !important; padding-top: 72px !important; }
      .stats-grid { grid-template-columns: 1fr 1fr; }
      .bottom-actions { flex-direction: column; }
      .b-info { width: 120px; }
      .breakdown-item { flex-wrap: wrap; gap: 0.75rem; }
      .qr-header { flex-wrap: wrap; gap: 0.5rem; }
    }
    @media (max-width: 480px) {
      .dashboard-body { padding-top: 70px !important; }
      .score-value { font-size: 3rem; }
      .stats-grid { grid-template-columns: 1fr; }
      .b-info { width: 100%; }
      .b-progress-wrap { width: 100%; }
      .breakdown-item { flex-direction: column; align-items: flex-start; }
      .qr-title { flex-wrap: wrap; }
    }
  `]
})
export class MiniEnsayoReviewComponent {
  public firestoreService = inject(FirestoreService);
  public adminService = inject(AdminService);
  public paymentService = inject(PaymentService);
  private auth = inject(AuthService);

  showSettingsModal = false;
  showProfileModal = false;
  showLogoutConfirm = false;
  isCollapsible = false;
  mobileOpen = false;

  get herramientasExpanded(): boolean {
    const val = localStorage.getItem('herramientasExpanded');
    return val !== 'false';
  }

  toggleHerramientas() {
    this.isCollapsible = true;
    const current = this.herramientasExpanded;
    localStorage.setItem('herramientasExpanded', String(!current));
  }

  confirmLogout() {
    this.showLogoutConfirm = true;
  }

  async executeLogout() {
    this.showLogoutConfirm = false;
    await this.auth.logout().toPromise();
    this.router.navigate(['/']);
  }

  isProPlan = computed(() => {
    const p = this.firestoreService.profileSignal();
    return p?.plan === 'premium';
  });
  
  profileInitial = computed(() => {
    const p = this.firestoreService.profileSignal();
    return p?.displayName?.charAt(0).toUpperCase() || 'U';
  });

  private miniEnsayoSvc = inject(MiniEnsayoService);
  private paesContent = inject(PaesContentService);
  private katex = inject(KatexService);
  private sanitizer = inject(DomSanitizer);
  private router = inject(Router);

  result = this.miniEnsayoSvc.lastResult;
  optionKeys: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];

  constructor() {
    if (!this.result()) {
      this.router.navigate(['/dashboard']);
    }
  }

  materiaTitle = computed(() => {
    const r = this.result();
    if (!r) return '';
    const mat = this.paesContent.getMateriaById(r.config.materiaId);
    return mat?.title || r.config.materiaId;
  });

  omittedCount = computed(() => {
    const r = this.result();
    if (!r) return 0;
    return r.totalQuestions - Object.keys(r.answers).length;
  });

  questions = computed(() => {
    const r = this.result();
    if (!r) return [];
    const allPool = this.paesContent.poolPreguntas();
    return r.questionIds.map(id => allPool.find(p => p.id === id)).filter(p => !!p) as any[];
  });

  answeredQuestions = computed(() => {
    const r = this.result();
    if (!r) return [];
    const allQuestions = this.questions();
    return allQuestions.filter(q => !!r.answers[q.id]);
  });

  hasWeakTopics = computed(() => {
    const r = this.result();
    if (!r) return false;
    return r.topicBreakdown.some(t => t.percentage < 50);
  });

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  getStatusText(userAns: string | null | undefined, correctAns: string): string {
    if (!userAns) return 'Omitida';
    return userAns === correctAns ? 'Correcta' : 'Incorrecta';
  }

  renderLatex(latex: string): SafeHtml {
    try {
      return this.katex.render(latex);
    } catch {
      return latex;
    }
  }

  trainWeakTopics() {
    const r = this.result();
    if (!r) return;
    const weak = r.topicBreakdown.filter(t => t.percentage < 50).map(t => t.topic);
    
    const sourceIntento = {
      intentoId: 'from-mini-ensayo',
      ensayoId: 'mini-ensayo',
      ensayoTitle: 'Mini Ensayo Previo',
      previousTopicScores: r.topicBreakdown
    };

    this.router.navigate(['/mini-ensayo'], {
      queryParams: {
        mode: 'mejorador',
        materiaId: r.config.materiaId,
        topics: weak.join(','),
        sourceIntento: JSON.stringify(sourceIntento)
      }
    });
  }
}
