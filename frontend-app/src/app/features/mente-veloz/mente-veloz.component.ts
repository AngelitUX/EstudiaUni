import { Component, HostListener, OnInit, OnDestroy, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { PaesContentService } from '../learning-path/services/paes-content.service';
import { SettingsModalComponent } from '../profile/settings-modal.component';
import { ProfileModalComponent } from '../profile/profile-modal.component';
import { FirestoreService } from '../../core/services/firestore.service';
import { AdminService } from '../admin/services/admin.service';
import { AuthService } from '../../core/services/auth.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { PaymentService } from '../../core/services/payment.service';
import { StreakIconComponent } from '../../shared/components/streak-icon.component';
import { ToastService } from '../../core/services/toast.service';

export const FREE_MENTE_VELOZ_MATERIAS = ['mat1', 'comp-lectora'];
export const FREE_MENTE_VELOZ_TIMES = [60, 180];
export const FREE_MENTE_VELOZ_SESSIONS_PER_WINDOW = 3;
export const MENTE_VELOZ_WINDOW_HOURS = 24;

type DifficultyMode = 'normal' | 'hardcore' | 'suddendeath';
type GameState = 'setup' | 'playing' | 'results';

interface PlayedQuestion {
  question: any;
  selectedOption: 'A' | 'B' | 'C' | 'D' | 'SKIP' | null;
  isCorrect: boolean;
  timeTaken: number; // in seconds
}

@Component({
  selector: 'app-mente-veloz',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SettingsModalComponent, ProfileModalComponent, StreakIconComponent],
  template: `
    <div class="mv-layout">
      <!-- SIDEBAR -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <a routerLink="/dashboard" class="sidebar-logo" style="text-decoration:none; display: flex; align-items: center; justify-content: center;">
            <img [src]="(isProPlan() || adminService.isAdmin()) ? 'https://res.cloudinary.com/dqm3syhwr/image/upload/f_auto,q_auto/v1/imagenes/branding/LogoEstudiaUniPREMIUM' : 'https://res.cloudinary.com/dqm3syhwr/image/upload/f_auto,q_auto/v1/imagenes/branding/LogoEstudiaUni'" alt="EstudiaUni" class="sidebar-logo-img" />
          </a>
        </div>
        <nav class="sidebar-nav">
          <a class="nav-item" routerLink="/dashboard"><img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_Inicio.svg" alt="Inicio" class="nav-icon-img"/><span class="nav-text">Inicio</span></a>
          <a class="nav-item" routerLink="/ruta"><img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_RutaDeAprendizaje.svg" alt="Ruta de Aprendizaje" class="nav-icon-img"/><span class="nav-text">Ruta de Aprendizaje</span></a>
          <a class="nav-item" routerLink="/ensayos"><img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_EnsayosPaes.svg" alt="Ensayos PAES" class="nav-icon-img"/><span class="nav-text">Ensayos PAES</span></a>
          <a class="nav-item" routerLink="/mini-ensayo"><img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_MiniEnsayos.svg" alt="Mini Ensayos" class="nav-icon-img"/><span class="nav-text">Mini Ensayos</span></a>
          <a class="nav-item active" routerLink="/mente-veloz"><img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_MenteVeloz.svg" alt="Mente Veloz" class="nav-icon-img"/><span class="nav-text">Mente Veloz</span></a>
          
          <div class="sidebar-section-title" (click)="toggleHerramientas()">
            HERRAMIENTAS
            <span class="toggle-icon" [style.transform]="herramientasExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'">▼</span>
          </div>
          <div class="sidebar-sub-items" [class.expanded]="herramientasExpanded" [class.collapsible]="isCollapsible">
            <a class="nav-item" routerLink="/encuentra-tu-carrera"><img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_EnncuentraTuCarrera.svg" alt="Encuentra tu Carrera" class="nav-icon-img"/><span class="nav-text">Encuentra tu Carrera</span></a>
            <a class="nav-item" routerLink="/calculadora-nem"><img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_CalculadoraNEM.svg" alt="Calculadora NEM" class="nav-icon-img"/><span class="nav-text">Calculadora NEM</span></a>
            <a class="nav-item" routerLink="/recursos"><img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_RecursosAdicionales.svg" alt="Recursos Adicionales" class="nav-icon-img"/><span class="nav-text">Recursos Adicionales</span></a>
          </div>
          <!-- Sidebar Promo Card -->
          <div *ngIf="!isProPlan() && !adminService.isAdmin()" class="sidebar-promo-card">
            <img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_Pro.svg" alt="PRO" class="promo-crown"/>
            <h4>Pásate a PRO</h4>
            <p>Explicaciones con IA y Ensayos Ilimitados</p>
            <button class="btn-promo-sidebar">Ver Planes ⚡</button>
          </div>
        </nav>
        <div class="sidebar-footer" style="flex-direction: column; gap: 0.5rem; padding: 1.25rem 0.75rem;">
          <a class="nav-item" (click)="showSettingsModal = true">
            <img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_Configuracion.svg" alt="Configuración" class="nav-icon-img nav-icon-img-config"/>
            <span class="nav-text">Configuración</span>
          </a>
          <a class="nav-item logout-btn-sidebar" (click)="confirmLogout()">
            <img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_CerrarSesion.svg" alt="Cerrar Sesión" class="nav-icon-img"/>
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
        <a routerLink="/dashboard" style="text-decoration:none;flex:1;text-align:center"><span class="text-gradient" [class.pro-logo]="isProPlan()" style="font-family:var(--font-heading);font-size:1.4rem;font-weight:900">EstudiaUni</span></a>
        <div style="width:44px"></div>
      </div>
      <div class="mobile-overlay" [class.open]="mobileOpen" (click)="mobileOpen = false">
        <div class="mobile-menu" (click)="$event.stopPropagation()">
          <nav class="sidebar-nav">
            <a class="nav-item" routerLink="/dashboard" (click)="mobileOpen=false"><img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_Inicio.svg" alt="Inicio" class="nav-icon-img"/><span class="nav-text">Inicio</span></a>
            <a class="nav-item" routerLink="/ruta" (click)="mobileOpen=false"><img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_RutaDeAprendizaje.svg" alt="Ruta de Aprendizaje" class="nav-icon-img"/><span class="nav-text">Ruta de Aprendizaje</span></a>
            <a class="nav-item" routerLink="/ensayos" (click)="mobileOpen=false"><img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_EnsayosPaes.svg" alt="Ensayos PAES" class="nav-icon-img"/><span class="nav-text">Ensayos PAES</span></a>
            <a class="nav-item" routerLink="/mini-ensayo" (click)="mobileOpen=false"><img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_MiniEnsayos.svg" alt="Mini Ensayos" class="nav-icon-img"/><span class="nav-text">Mini Ensayos</span></a>
            <a class="nav-item active" routerLink="/mente-veloz" (click)="mobileOpen=false"><img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_MenteVeloz.svg" alt="Mente Veloz" class="nav-icon-img"/><span class="nav-text">Mente Veloz</span></a>
            
            <div class="sidebar-section-title" (click)="toggleHerramientas()">
              HERRAMIENTAS
              <span class="toggle-icon" [style.transform]="herramientasExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'">▼</span>
            </div>
            <div class="sidebar-sub-items" [class.expanded]="herramientasExpanded" [class.collapsible]="isCollapsible">
              <a class="nav-item" routerLink="/encuentra-tu-carrera" (click)="mobileOpen=false"><img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_EnncuentraTuCarrera.svg" alt="Encuentra tu Carrera" class="nav-icon-img"/><span class="nav-text">Encuentra tu Carrera</span></a>
              <a class="nav-item" routerLink="/calculadora-nem" (click)="mobileOpen=false"><img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_CalculadoraNEM.svg" alt="Calculadora NEM" class="nav-icon-img"/><span class="nav-text">Calculadora NEM</span></a>
              <a class="nav-item" routerLink="/recursos" (click)="mobileOpen=false"><img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_RecursosAdicionales.svg" alt="Recursos Adicionales" class="nav-icon-img"/><span class="nav-text">Recursos Adicionales</span></a>
            </div>
          </nav>
          <div class="mobile-footer" style="padding: 1rem; border-top: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; gap: 0.5rem;">
            <a class="nav-item" (click)="showSettingsModal = true; mobileOpen=false">
              <img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_Configuracion.svg" alt="Configuración" class="nav-icon-img nav-icon-img-config"/>
              <span class="nav-text">Configuración</span>
            </a>
            <a class="nav-item logout-btn-sidebar" (click)="confirmLogout(); mobileOpen=false">
              <img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_CerrarSesion.svg" alt="Cerrar Sesión" class="nav-icon-img"/>
              <span class="nav-text">Cerrar Sesión</span>
            </a>
          </div>
        </div>
      </div>

      <!-- MAIN CONTENT -->
      <main class="main-content animate-fade-in-down">
        <!-- GLOBAL PAGE HEADER (Visible in Setup and Results states) -->
        <header class="dashboard-header" *ngIf="gameState() !== 'playing'">
          <div class="header-welcome-text">
            <div *ngIf="gameState() === 'setup'">
              <h1 class="header-greeting"><span class="text-gradient">Mente Veloz</span></h1>
              <p class="subtitle" style="color: rgba(255,255,255,0.7); font-size: 0.95rem; margin: 0; font-weight: 500;">¡El desafío definitivo contrarreloj! Pon a prueba tu rapidez mental respondiendo preguntas del pool oficial.</p>
            </div>
            <div *ngIf="gameState() === 'results'">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span class="results-medal-small" style="font-size: 2.2rem;">{{ accuracy() >= 90 ? '🥇' : accuracy() >= 70 ? '🥈' : accuracy() >= 50 ? '🥉' : '🏆' }}</span>
                <h1 class="header-greeting"><span class="text-gradient">{{ accuracy() >= 90 ? '¡Rendimiento Excepcional!' : accuracy() >= 70 ? '¡Muy Bien Hecho!' : accuracy() >= 50 ? '¡Buen Esfuerzo!' : '¡Sigue Practicando!' }}</span></h1>
              </div>
              <div class="results-config-badges" style="margin-top: 0.5rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <span class="config-badge" style="background: rgba(255,255,255,0.1); padding: 0.35rem 0.85rem; border-radius: 99px; font-size: 0.8rem; font-weight: 700; color: #fff; border: 2px solid rgba(255,255,255,0.2);">⏱️ {{ formatTime(timeLimit()) }}</span>
                <span class="config-badge" [class.normal]="difficulty() === 'normal'" [class.hardcore]="difficulty() === 'hardcore'" [class.suddendeath]="difficulty() === 'suddendeath'" style="background: rgba(255,255,255,0.1); padding: 0.35rem 0.85rem; border-radius: 99px; font-size: 0.8rem; font-weight: 700; color: #fff; border: 2px solid rgba(255,255,255,0.2);">{{ difficulty() === 'normal' ? '🟢 Normal' : difficulty() === 'hardcore' ? '🔥 Hardcore' : '💀 Muerte Súbita' }}</span>
                <span class="config-badge" style="background: rgba(255,255,255,0.1); padding: 0.35rem 0.85rem; border-radius: 99px; font-size: 0.8rem; font-weight: 700; color: #fff; border: 2px solid rgba(255,255,255,0.2);">📚 {{ selectedMaterias.size }} materias</span>
              </div>
            </div>
          </div>
          <div class="welcome-actions">
            <app-streak-icon></app-streak-icon>
            <button *ngIf="!isProPlan() && !adminService.isAdmin()" class="btn-upgrade-pro" (click)="paymentService.openPricingModal()">
              Mejorar a PRO ⚡
            </button>
            <span class="plan-badge" [class.pro]="isProPlan() && !adminService.isAdmin()" [class.admin]="adminService.isAdmin()">{{ adminService.isAdmin() ? 'ADMIN' : (isProPlan() ? 'PRO' : 'BASICO') }}</span>
            <div class="profile-menu-wrap">
              <button class="profile-trigger" (click)="showProfileModal = true">
                <span class="profile-avatar-wrap">
                  <img *ngIf="firestoreService.profileSignal()?.photoURL; else avatarFallback" [src]="firestoreService.profileSignal()?.photoURL" alt="Foto de perfil" class="profile-avatar" [class.avatar-preset]="(firestoreService.profileSignal()?.photoURL || '').includes('assets/images/avatars/')"/>
                  <ng-template #avatarFallback><span class="profile-avatar fallback">{{ profileInitial() }}</span></ng-template>
                </span>
              </button>
              <span class="profile-emoji-badge">{{ firestoreService.profileSignal()?.profileEmoji || '✨' }}</span>
            </div>
          </div>
        </header>

        <!-- SETUP STATE -->
        <div class="dashboard-body" *ngIf="gameState() === 'setup'">
          <div class="state-container">
            <div class="setup-card glass-card">
            <div class="setup-section-title">
              <span class="section-badge">1</span>
              <h3>Selecciona las Materias</h3>
              <button class="btn-select-all" (click)="toggleAllMaterias()">
                {{ selectedMaterias.size === selectableMateriaCount() ? 'Deseleccionar todo' : 'Seleccionar todo' }}
              </button>
            </div>
            <div class="subjects-grid">
              <button *ngFor="let m of paesContent.materias()"
                      class="subject-btn"
                      [class.selected]="selectedMaterias.has(m.id)"
                      [class.locked]="isMateriaLockedForFree(m.id)"
                      (click)="toggleMateria(m.id)">
                <img *ngIf="getMateriaIconPath(m.id) as iconPath" [src]="iconPath" [alt]="m.title" class="subj-icon-img"/>
                <span class="subj-icon" *ngIf="!getMateriaIconPath(m.id)">{{ m.icon || '📚' }}</span>
                <span class="subj-title">{{ m.title }}</span>
                <span class="checkbox-indicator" *ngIf="!isMateriaLockedForFree(m.id)"></span>
                <span class="lock-indicator" *ngIf="isMateriaLockedForFree(m.id)">🔒 PRO</span>
              </button>
            </div>
            <p class="warning-text" *ngIf="!isProPlan() && !adminService.isAdmin()">Plan Básico: solo Competencia Lectora y M1 disponibles. <a (click)="paymentService.openPricingModal()" style="color: var(--accent-primary); cursor: pointer; font-weight: 700;">Mejora a PRO</a> para todas las materias.</p>
            <div class="pool-counter" *ngIf="selectedMaterias.size > 0">
              {{ getPoolCount() }} preguntas disponibles en {{ selectedMaterias.size }} materia{{ selectedMaterias.size > 1 ? 's' : '' }}
            </div>
            <div class="setup-summary" style="margin-top: 1.25rem; justify-content: center; margin-bottom: 0;" *ngIf="selectedMaterias.size > 0">
              <div class="summary-pill personal-record-badge" style="background: rgba(245, 158, 11, 0.08); border-color: rgba(245, 158, 11, 0.3); color: #d97706; padding: 0.6rem 1.2rem; border-radius: 12px; font-weight: 800; font-size: 0.95rem; display: flex; align-items: center; gap: 0.5rem; border: 2px solid rgba(245,158,11,0.3);">
                <span>🏆 Récord en esta combinación:</span> 
                <strong style="font-size: 1.15rem; color: #b45309;">{{ currentCombinationRecord() }} correctas</strong>
              </div>
            </div>
            <div class="setup-error-alert" *ngIf="setupError && selectedMaterias.size === 0">
              ⚠️ Debes seleccionar al menos una materia para poder iniciar.
            </div>

            <div class="setup-section-title mt-5">
              <span class="section-badge">2</span>
              <h3>Configuración de Tiempo</h3>
            </div>
            <div class="time-presets">
              <button class="preset-btn" [class.active]="timeLimit() === 60" (click)="setTime(60)">
                ⏱️ 1 Minuto
              </button>
              <button class="preset-btn" [class.active]="timeLimit() === 180" (click)="setTime(180)">
                ⏱️ 3 Minutos
              </button>
              <button class="preset-btn" [class.locked]="!isProPlan() && !adminService.isAdmin()" [class.active]="timeLimit() === 300" (click)="setTime(300)">
                ⏱️ 5 Minutos @if (!isProPlan() && !adminService.isAdmin()) { <span class="lock-indicator">🔒</span> }
              </button>
              <div class="custom-time-wrap">
                <span class="custom-time-label">Personalizado</span>
                <div class="custom-time-input-group" [class.locked]="!isProPlan() && !adminService.isAdmin()">
                  <input type="number" [(ngModel)]="customTimeMinutes" placeholder="Ej: 10" min="1" max="60" [disabled]="!isProPlan() && !adminService.isAdmin()" (change)="setCustomTime()">
                  <span class="input-unit">min {{ (!isProPlan() && !adminService.isAdmin()) ? '🔒' : '' }}</span>
                </div>
              </div>
            </div>
            <p class="warning-text" *ngIf="!isProPlan() && !adminService.isAdmin()">Plan Básico: solo 1 o 3 minutos. <a (click)="paymentService.openPricingModal()" style="color: var(--accent-primary); cursor: pointer; font-weight: 700;">Mejora a PRO</a> para 5 min o tiempo personalizado.</p>

            <div class="setup-section-title mt-5">
              <span class="section-badge">3</span>
              <h3>Modo de Penalización (Dificultad)</h3>
            </div>
            <div class="modes-grid">
              <div class="mode-card normal" [class.active]="difficulty() === 'normal'" (click)="setDifficulty('normal')">
                <div class="mode-header-row">
                  <span class="mode-pill-icon">🟢</span>
                  <h4>Normal</h4>
                </div>
                <p>Perfecto para entrenar. Si te equivocas, pasas a la siguiente pregunta sin restar tiempo.</p>
              </div>
              <div class="mode-card hardcore" [class.locked]="!isProPlan() && !adminService.isAdmin()" [class.active]="difficulty() === 'hardcore'" (click)="setDifficulty('hardcore')">
                <div class="mode-header-row">
                  <span class="mode-pill-icon">🔥</span>
                  <h4>Hardcore</h4>
                  <span class="lock-indicator" *ngIf="!isProPlan() && !adminService.isAdmin()">🔒 PRO</span>
                </div>
                <p>Para mentes ágiles. Cada respuesta incorrecta restará <strong>5 segundos</strong> del temporizador.</p>
              </div>
              <div class="mode-card suddendeath" [class.locked]="!isProPlan() && !adminService.isAdmin()" [class.active]="difficulty() === 'suddendeath'" (click)="setDifficulty('suddendeath')">
                <div class="mode-header-row">
                  <span class="mode-pill-icon">💀</span>
                  <h4>Muerte Súbita</h4>
                  <span class="lock-indicator" *ngIf="!isProPlan() && !adminService.isAdmin()">🔒 PRO</span>
                </div>
                <p>Sin margen de error. Al primer fallo se terminará el tiempo y la ronda habrá finalizado.</p>
              </div>
            </div>
            <p class="warning-text" *ngIf="!isProPlan() && !adminService.isAdmin()">Plan Básico: solo dificultad Normal. <a (click)="paymentService.openPricingModal()" style="color: var(--accent-primary); cursor: pointer; font-weight: 700;">Mejora a PRO</a> para Hardcore y Muerte Súbita.</p>

            <div class="setup-summary">
              <div class="summary-pill">
                <span>⏱️</span> {{ formatTime(timeLimit()) }}
              </div>
              <div class="summary-pill">
                <span>⚡</span> Modo {{ difficulty() === 'normal' ? 'Normal' : difficulty() === 'hardcore' ? 'Hardcore' : 'Muerte Súbita' }}
              </div>
              <div class="summary-pill">
                <span>📚</span> {{ selectedMaterias.size }} Materias
              </div>
            </div>

            <p class="warning-text" style="text-align: center;" *ngIf="!isProPlan() && !adminService.isAdmin()">
              {{ sessionStatus().allowed ? ('Te quedan ' + sessionStatus().remaining + ' de ' + 3 + ' partidas gratis hoy.') : ('⏳ Sin partidas gratis disponibles. Vuelve ' + (sessionStatus().nextAvailableAt | date:'short') + ' o pásate a PRO.') }}
            </p>
            <button class="btn-start-game" [disabled]="!isProPlan() && !adminService.isAdmin() && !sessionStatus().allowed" (click)="startGame()">
              <span>Comenzar Desafío ⚡</span>
            </button>
          </div>
        </div>
        </div>

        <!-- PLAYING STATE -->
        <div class="dashboard-body playing-body" *ngIf="gameState() === 'playing'">
          <div class="state-container playing-state">
          <!-- Sticky HUD wrapper -->
          <div class="hud-sticky-wrapper">
            <!-- Top HUD -->
            <div class="hud glass-card">
              <div class="hud-left">
                <div class="hud-stat-pill score">
                  <span class="stat-pill-icon">🎯</span>
                  <div class="stat-pill-content">
                    <label>Correctas</label>
                    <span>{{ correctAnswers() }}/{{ totalAnswered() }}</span>
                  </div>
                </div>
                <div class="hud-stat-pill streak" *ngIf="streak() > 0" [class.streak]="streak() > 0">
                  <span class="stat-pill-icon">🔥</span>
                  <div class="stat-pill-content">
                    <label>Racha</label>
                    <span>x{{ streak() }}</span>
                  </div>
                </div>
              </div>
              
              <div class="hud-right">
                <div class="timer-box" [class.warning]="timeLeft() <= 15 && timeLeft() > 5" [class.danger]="timeLeft() <= 5">
                  <span class="timer-icon">⏱️</span>
                  <span class="timer-val">{{ formatTime(timeLeft()) }}</span>
                </div>
              </div>
            </div>
            <!-- Time Progress Bar -->
            <div class="time-progress-bar">
              <div class="time-progress-fill" [style.width.%]="(timeLeft() / timeLimit()) * 100" [class.warning]="timeLeft() <= 15 && timeLeft() > 5" [class.danger]="timeLeft() <= 5"></div>
            </div>
          </div>

          <!-- Question Card -->
          <div class="question-card glass-card" *ngIf="currentQuestion() as q" style="position: relative;">
            <div class="q-header">
              <span class="q-materia-badge">{{ getMateriaName(q.materiaId) }}</span>
              <span class="q-tema-badge" *ngIf="q.tema">🏷️ {{ q.tema }}</span>
            </div>
            
            <div class="q-preambulo" *ngIf="q.preambulo_texto">{{ q.preambulo_texto }}</div>
            <div class="q-img-wrap" *ngIf="q.preambulo_imagen_url">
              <img class="q-img" [src]="q.preambulo_imagen_url" alt="Imagen de apoyo">
            </div>
            
            <h2 class="q-enunciado">{{ q.enunciado }}</h2>
            <div class="q-formula-box" *ngIf="q.formula_latex">
              <code class="q-formula">{{ q.formula_latex }}</code>
            </div>

            <div class="options-grid">
              <button *ngFor="let opt of optionsList" 
                      class="option-btn" 
                      [class.selected]="selectedOption === opt"
                      [class.correct]="showFeedback && opt === q.respuesta_correcta"
                      [class.incorrect]="showFeedback && selectedOption === opt && opt !== q.respuesta_correcta"
                      [disabled]="showFeedback"
                      (click)="selectOption(opt)"
                      style="position: relative;">
                
                <!-- Sparkling & Flame Streak Animations (Relative to this option button!) -->
                <div class="feedback-effect-overlay" *ngIf="showFeedback && selectedOption === opt && opt === q.respuesta_correcta && showFeedbackEffect" [class.streak-mode]="streak() >= 2">
                  <!-- Sparks/Brillos effect (streak < 2) -->
                  <div class="sparkles-container" *ngIf="streak() < 2">
                    <span class="sparkle sp-1">✨</span>
                    <span class="sparkle sp-2">⭐</span>
                    <span class="sparkle sp-3">✨</span>
                    <span class="sparkle sp-4">⭐</span>
                    <span class="sparkle sp-5">✨</span>
                    <span class="correct-text-pop" style="font-size: 1.5rem; text-shadow: 0 0 10px rgba(16, 185, 129, 0.4);">¡Correcto!</span>
                  </div>
                  
                  <!-- Fire & Multiplier effect (streak >= 2) -->
                  <div class="flame-container" *ngIf="streak() >= 2">
                    <div class="flame-wrapper" style="width: 50px; height: 50px;">
                      <span class="fire-particle fp-1" style="font-size: 1.2rem;">🔥</span>
                      <span class="fire-particle fp-2" style="font-size: 1.2rem;">🔥</span>
                      <span class="fire-particle fp-3" style="font-size: 1.2rem;">🔥</span>
                      <span class="fire-emoji-main" style="font-size: 2.2rem;">🔥</span>
                    </div>
                    <div class="streak-text-pop" style="font-size: 1.3rem; margin-top: 2px;">
                      RACHA <span class="streak-number">x{{ streak() }}</span>
                    </div>
                  </div>
                </div>

                <div class="opt-left-section">
                  <span class="opt-letter">{{ opt === 'A' ? '1' : opt === 'B' ? '2' : opt === 'C' ? '3' : '4' }}</span>
                  <span class="opt-text" *ngIf="q.tipo_alternativas === 'texto'">{{ q.alternativas[opt] }}</span>
                  <img class="opt-img" *ngIf="q.tipo_alternativas === 'imagen'" [src]="q.alternativas[opt]" alt="Alternativa">
                </div>
              </button>
            </div>

            <div class="game-controls">
              <div class="keyboard-helper">
                <span class="kbd-key">1</span>
                <span class="kbd-key">2</span>
                <span class="kbd-key">3</span>
                <span class="kbd-key">4</span>
                <span class="kbd-desc">Responder</span>
                <span class="kbd-separator">|</span>
                <span class="kbd-key wide">Espacio</span>
                <span class="kbd-desc">Saltar (-2s)</span>
              </div>
              <div style="display: flex; gap: 0.75rem; align-items: center;">
                <button class="btn-skip-game" [disabled]="showFeedback" (click)="skipQuestion()">
                  Saltar Pregunta ⏭️
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>

        <!-- RESULTS STATE -->
        <div class="dashboard-body" *ngIf="gameState() === 'results'">
          <div class="state-container results-state">
          <!-- VOLVER/REPETIR ACTIONS (Moved to the top before all details) -->
          <div class="results-actions" style="margin-bottom: 2rem; display: flex; justify-content: center; gap: 1rem; width: 100%;">
            <button class="btn-primary-lg" (click)="resetGame()">
              <span>Jugar otra Ronda</span>
            </button>
            <a routerLink="/dashboard" class="btn-outline-lg">
              Volver al Inicio
            </a>
          </div>

          <div class="stats-row">
            <div class="stat-box glass-card">
              <span class="stat-icon">📝</span>
              <div class="stat-val text-gradient">{{ totalAnswered() }}</div>
              <div class="stat-label">Respondidas</div>
            </div>
            <div class="stat-box glass-card" [class.excellent]="accuracy() >= 80" [class.good]="accuracy() >= 50 && accuracy() < 80">
              <span class="stat-icon">🎯</span>
              <div class="stat-val text-gradient">{{ accuracy() }}%</div>
              <div class="stat-label">Precisión</div>
            </div>
            <div class="stat-box glass-card">
              <span class="stat-icon">⚡</span>
              <div class="stat-val text-gradient">{{ avgSpeed() }}s</div>
              <div class="stat-label">Velocidad Promedio</div>
            </div>
            <div class="stat-box glass-card" *ngIf="bestStreak > 0">
              <span class="stat-icon">🔥</span>
              <div class="stat-val text-gradient">{{ bestStreak }}</div>
              <div class="stat-label">Mejor Racha</div>
            </div>
          </div>

          <!-- Subjects progress breakdown -->
          <div class="podium-section glass-card" *ngIf="podiumStats().length > 0">
            <div class="section-header-row">
              <span class="section-header-icon">📊</span>
              <h3>Rendimiento por Materia</h3>
            </div>
            <div class="podium-grid">
              <div class="podium-item" *ngFor="let p of podiumStats()">
                <div class="p-info-row">
                  <span class="p-name">{{ getMateriaName(p.materiaId) }}</span>
                  <span class="p-details">{{ p.correct }}/{{ p.total }} correctas ({{ p.accuracy }}%)</span>
                </div>
                <div class="p-bar-track">
                  <div class="p-bar-fill" [style.width.%]="p.accuracy" [class.excellent]="p.accuracy >= 75" [class.warning]="p.accuracy >= 40 && p.accuracy < 75" [class.critical]="p.accuracy < 40"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Error breakdown review -->
          <div class="errors-section glass-card" *ngIf="failedQuestions().length > 0">
            <div class="section-header-row error-title">
              <span class="section-header-icon">❌</span>
              <h3>Revisión de Errores ({{ failedQuestions().length }})</h3>
            </div>
            <p class="section-subtitle">Repasa tus equivocaciones para consolidar tu aprendizaje teórico.</p>
            
            <div class="error-card glass-card" *ngFor="let err of failedQuestions(); let i = index">
              <div class="err-header">
                <span class="err-num">Pregunta {{ i + 1 }}</span>
                <span class="err-materia-badge">{{ getMateriaName(err.question.materiaId) }}</span>
              </div>
              <p class="err-enunciado">{{ err.question.enunciado }}</p>
              
              <div class="err-answers-box">
                <div class="err-answer-item incorrect">
                  <span class="err-answer-status-badge">Tu respuesta</span>
                  <span class="err-answer-content">
                    <strong>({{ err.selectedOption }})</strong> 
                    {{ err.selectedOption === 'SKIP' ? 'Saltada' : err.question.alternativas[err.selectedOption || ''] }}
                  </span>
                </div>
                <div class="err-answer-item correct">
                  <span class="err-answer-status-badge">Correcta</span>
                  <span class="err-answer-content">
                    <strong>({{ err.question.respuesta_correcta }})</strong> 
                    {{ err.question.alternativas[err.question.respuesta_correcta] }}
                  </span>
                </div>
              </div>

              <div class="err-feedback" *ngIf="err.question.feedback_error || err.question.feedback_acierto">
                <span class="feedback-bulb">💡 Justificación:</span>
                <p>{{ err.question.feedback_error || err.question.feedback_acierto }}</p>
              </div>
            </div>
          </div>
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
            <img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_CerrarSesion.svg" alt="Cerrar Sesion" class="confirm-icon confirm-icon-img"/>
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

    <!-- TIME UP OVERLAY TRANSITION -->
    <div class="timeup-overlay" *ngIf="showTimeUpOverlay()" [class.fade-out]="gameState() === 'results'">
      <div class="timeup-content animate-pop-in">
        <div class="timeup-icon-wrapper">
          <span class="timeup-emoji">⏱️</span>
          <span class="timeup-pulse"></span>
        </div>
        <h1 class="timeup-title">¡Tiempo Agotado!</h1>
        <p class="timeup-subtitle">Calculando tus estadísticas de velocidad y precisión...</p>
        
        <div class="timeup-loader">
          <div class="loader-bar"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes floatLogo { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
    .sidebar-logo-img { width: 230px; height: auto; object-fit: contain; margin: 28px auto 0 auto; filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.2)); animation: floatLogo 3.5s ease-in-out infinite; }
    .mobile-logo-img { width: 160px; height: auto; object-fit: contain; margin: 12px auto 0 auto; animation: floatLogo 3.5s ease-in-out infinite; }
    :host { 
      display: block; 
      min-height: 100vh; 
      background: radial-gradient(circle at 10% 20%, rgba(133, 92, 214, 0.05) 0%, transparent 45%), 
                  radial-gradient(circle at 90% 80%, rgba(28, 176, 246, 0.05) 0%, transparent 45%), 
                  var(--bg-color); 
      color: var(--text-primary); 
      font-family: var(--font-body); 
    }
    .mv-layout { display: flex; min-height: 100vh; }
    .playing-body { border-top-left-radius: 0 !important; border-top-right-radius: 0 !important; box-shadow: none !important; padding-top: 1.5rem !important; background: var(--bg-color) !important; min-height: 100vh !important; }
    
    /* SIDEBAR */
    .sidebar { width: 260px; background: rgba(13,15,23,0.95); border-right: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; height: 100vh; z-index: 100; }
    .sidebar-header { height: 110px; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid rgba(255,255,255,0.15); padding: 0 1rem; box-sizing: border-box; }
    
    .sidebar-nav {
      flex: 1;
      padding: 1rem 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      overflow-y: auto;
    }
    .sidebar-nav::-webkit-scrollbar {
      width: 4px;
    }
    .sidebar-nav::-webkit-scrollbar-track {
      background: transparent;
    }
    .sidebar-nav::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      transition: background 0.2s;
    }
    .sidebar-nav::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.25);
    }
    .nav-item { display: flex; align-items: center; gap: 0.85rem; padding: 0.9rem 1.1rem; border-radius: 12px; color: #ffffff; text-decoration: none; transition: all 0.2s; cursor: pointer; font-size: 1.05rem; font-weight: 500; }
    .nav-item:hover { background: rgba(255,255,255,0.12); transform: translateX(4px); }
    .nav-item.active { 
      background: rgba(139,92,246,0.18); 
      color: #c4b5fd; 
      border: none; 
      border-left: 3.5px solid #a78bfa; 
      box-shadow: 0 4px 12px rgba(139,92,246,0.12); 
      font-weight: 700; 
    }
    .nav-item.active .nav-icon { filter: brightness(1.3); }
    .nav-item.active .nav-text { color: #c4b5fd; }
    .nav-icon { font-size: 1.35rem; width: 32px; text-align: center; }
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
    .logout-btn-sidebar { color: #f87171 !important; }
    .logout-btn-sidebar:hover { background: rgba(248, 113, 113, 0.15) !important; }

    /* MOBILE HEADER */
    .mobile-header { display: none; position: fixed; top: 0; left: 0; right: 0; height: 60px; background: rgba(13,15,23,0.99); border-bottom: 1px solid rgba(255,255,255,0.12); padding: 0 1rem; align-items: center; gap: 0.75rem; z-index: 101; }
    .mobile-menu-btn { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #fff; cursor: pointer; padding: 0.5rem 0.65rem; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.2s; }
    .mobile-menu-btn:hover { background: rgba(255,255,255,0.15); }
    .mobile-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); z-index: 200; }
    .mobile-overlay.open { display: block; }
    .mobile-menu { position: fixed; top: 0; left: 0; width: 280px; max-width: 85vw; height: 100vh; background: #0d0f17; padding: 0; overflow-y: auto; box-shadow: 4px 0 20px rgba(0,0,0,0.5); z-index: 10000; display: flex; flex-direction: column; }

    /* MAIN CONTENT */
    .main-content { flex: 1; overflow-y: auto; background: var(--bg-color); }
    .state-container { width: 100%; max-width: 960px; margin: 0 auto; }

    .setup-card { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(24px); border: 2.5px solid var(--glass-border); border-radius: var(--border-radius); padding: 2.5rem; box-shadow: var(--shadow-lg); }
    .setup-section-title { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; }
    .section-badge { width: 28px; height: 28px; border-radius: 50%; background: var(--accent-primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; flex-shrink: 0; }
    .setup-section-title h3 { margin: 0; font-size: 1.3rem; font-weight: 700; color: var(--text-primary); flex: 1; }
    .btn-select-all { background: rgba(133, 92, 214, 0.06); border: 1.5px solid rgba(133, 92, 214, 0.15); color: var(--accent-primary); padding: 0.35rem 0.85rem; border-radius: 8px; font-size: 0.78rem; font-weight: 700; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
    .btn-select-all:hover { background: var(--accent-primary); color: #fff; transform: translateY(-1px); }
    .mt-5 { margin-top: 2.5rem; }

    /* SUBJECTS */
    .subjects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; }
    .subject-btn { background: #ffffff; border: 2.5px solid rgba(0, 0, 0, 0.12); border-radius: 16px; padding: 0.9rem 1.1rem; min-height: 82px; color: var(--text-primary); font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.75rem; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); text-align: left; position: relative; line-height: 1.25; box-sizing: border-box; width: 100%; -moz-appearance: none; -webkit-appearance: none; }
    .subject-btn:hover { border-color: rgba(133, 92, 214, 0.45); background: rgba(255, 255, 255, 0.95); transform: translateY(-2px); }
    .subject-btn.selected { border-color: var(--accent-primary); background: linear-gradient(135deg, rgba(133, 92, 214, 0.04), rgba(107, 70, 184, 0.08)); color: var(--accent-primary); box-shadow: 0 6px 18px rgba(133, 92, 214, 0.15); }
    .checkbox-indicator { width: 18px; height: 18px; min-width: 18px; min-height: 18px; border-radius: 50%; border: 2.5px solid rgba(0, 0, 0, 0.22); margin-left: auto; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0; line-height: 1; }
    .subject-btn.selected .checkbox-indicator { border-color: var(--accent-primary); background: var(--accent-primary); }
    .subject-btn.selected .checkbox-indicator::after { content: '✓'; color: white; font-size: 0.7rem; font-weight: 900; line-height: 1; display: block; margin-top: -1px; }
    .subj-icon { font-size: 1.35rem; flex-shrink: 0; }
    .subj-icon-img { width: 48px; height: 48px; object-fit: contain; flex-shrink: 0; }
    .subj-title { font-size: 0.95rem; flex: 1; min-width: 0; margin-right: 0.25rem; }
    .pool-counter { margin-top: 1rem; padding: 0.75rem 1rem; background: rgba(133, 92, 214, 0.04); border: 2.5px solid rgba(133, 92, 214, 0.18); border-radius: 12px; color: var(--accent-primary); font-weight: 600; font-size: 0.9rem; text-align: center; }
    .setup-error-alert { background: rgba(239, 68, 68, 0.08); border-left: 5px solid #ef4444; border-radius: 0 12px 12px 0; color: #ef4444; font-weight: 600; padding: 1rem; margin-top: 1rem; font-size: 0.95rem; border: 2.5px solid rgba(239, 68, 68, 0.15); border-left: none; }
    .warning-text { color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.75rem; }
    .subject-btn.locked, .preset-btn.locked, .custom-time-input-group.locked, .mode-card.locked { opacity: 0.55; cursor: not-allowed; }
    .lock-indicator { font-size: 0.72rem; font-weight: 800; color: #b45309; background: rgba(245,158,11,0.12); padding: 0.15rem 0.5rem; border-radius: 99px; margin-left: auto; }
 
    /* TIME PRESETS */
    .time-presets { display: flex; gap: 1rem; flex-wrap: wrap; }
    .preset-btn { flex: 1; min-width: 130px; background: #ffffff; border: 2.5px solid rgba(0, 0, 0, 0.12); padding: 1rem; border-radius: 16px; color: var(--text-secondary); font-weight: 700; cursor: pointer; transition: all 0.2s; }
    .preset-btn:hover { border-color: rgba(133, 92, 214, 0.45); background: #fafafa; }
    .preset-btn.active { border-color: var(--accent-primary); background: rgba(133, 92, 214, 0.08); color: var(--accent-primary); border-width: 3px; }
    .custom-time-wrap { display: flex; flex-direction: column; gap: 0.35rem; max-width: 140px; }
    .custom-time-label { font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-align: center; text-transform: uppercase; letter-spacing: 0.03em; }
    .custom-time-input-group { display: flex; align-items: center; background: #ffffff; border: 2.5px solid rgba(0, 0, 0, 0.12); border-radius: 16px; padding-right: 1rem; }
    .custom-time-input-group input { width: 100%; border: none; background: transparent; padding: 1rem; color: var(--text-primary); font-weight: 700; outline: none; text-align: center; font-size: 1rem; }
    .input-unit { color: var(--text-muted); font-weight: 700; font-size: 0.9rem; }
    .custom-time-input-group:focus-within { border-color: var(--accent-primary); }

    /* MODES */
    .modes-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; }
    .mode-card { background: #ffffff; border: 2.5px solid rgba(0, 0, 0, 0.12); padding: 1.5rem; border-radius: 20px; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); display: flex; flex-direction: column; }
    .mode-card:hover { transform: translateY(-3px); border-color: rgba(133, 92, 214, 0.4); box-shadow: var(--shadow); }
    .mode-header-row { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.75rem; }
    .mode-pill-icon { font-size: 1.5rem; }
    .mode-card h4 { margin: 0; font-weight: 800; font-size: 1.15rem; color: var(--text-primary); }
    .mode-card p { margin: 0; color: var(--text-secondary); font-size: 0.88rem; line-height: 1.5; }
    
    .mode-card.active.normal { border: 3px solid #22c55e; background: rgba(34, 197, 94, 0.05); box-shadow: 0 8px 24px rgba(34, 197, 94, 0.12); }
    .mode-card.active.hardcore { border: 3px solid #f97316; background: rgba(249, 115, 22, 0.05); box-shadow: 0 8px 24px rgba(249, 115, 22, 0.12); }
    .mode-card.active.suddendeath { border: 3px solid #ef4444; background: rgba(239, 68, 68, 0.05); box-shadow: 0 8px 24px rgba(239, 68, 68, 0.12); }

    .btn-start-game { width: 100%; margin-top: 2rem; background: var(--gradient-brand); color: #fff; border: none; padding: 1.3rem; border-radius: 20px; font-size: 1.25rem; font-weight: 800; letter-spacing: 0.02em; cursor: pointer; box-shadow: 0 10px 25px rgba(133, 92, 214, 0.3); transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-family: var(--font-heading); }
    .btn-start-game:hover { transform: translateY(-4px); box-shadow: 0 15px 35px rgba(133, 92, 214, 0.45); }
    .btn-start-game:active { transform: translateY(0); }

    .setup-summary { display: flex; gap: 0.75rem; justify-content: center; margin-top: 2.5rem; flex-wrap: wrap; }
    .summary-pill { display: flex; align-items: center; gap: 0.4rem; background: rgba(0,0,0,0.03); padding: 0.45rem 1rem; border-radius: 99px; font-size: 0.88rem; font-weight: 700; color: var(--text-secondary); border: 2.5px solid rgba(0,0,0,0.12); }
    .summary-pill span { font-size: 1rem; }

    /* STICKY HUD CONTAINER - opaque background to cover scrolled content */
    .hud-sticky-wrapper {
      position: sticky;
      top: -2px;
      z-index: 100;
      background: var(--bg-color);
      padding: 1.5rem 0 0.5rem 0;
      margin-top: -1.5rem;
    }

    /* HUD SCREEN */
    .hud { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(16px); padding: 0.85rem 1.5rem; border-radius: 20px 20px 0 0; border: 2.5px solid rgba(133, 92, 214, 0.28); border-bottom: none; box-shadow: var(--shadow-md); z-index: 10; }
    .hud-left, .hud-right { display: flex; align-items: center; gap: 0.5rem; }
    .hud-stat-pill { display: flex; align-items: center; gap: 0.5rem; background: rgba(0, 0, 0, 0.03); padding: 0.4rem 0.85rem; border-radius: 12px; border: 2px solid rgba(0, 0, 0, 0.12); }
    .stat-pill-icon { font-size: 1.15rem; }
    .stat-pill-content { display: flex; flex-direction: column; }
    .stat-pill-content label { font-size: 0.62rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted); letter-spacing: 0.05em; line-height: 1; margin-bottom: 1px; }
    .stat-pill-content span { font-size: 0.95rem; font-weight: 800; color: var(--text-primary); line-height: 1.1; }
    .hud-stat-pill.score { background: rgba(34, 197, 94, 0.06); border-color: rgba(34, 197, 94, 0.3); }
    .hud-stat-pill.score span { color: #22c55e; }
    .hud-stat-pill.difficulty-pill { padding: 0.4rem 0.6rem; }
    .hud-stat-pill.difficulty-pill.normal { background: rgba(34, 197, 94, 0.06); border-color: rgba(34, 197, 94, 0.3); }
    .hud-stat-pill.difficulty-pill.hardcore { background: rgba(249, 115, 22, 0.06); border-color: rgba(249, 115, 22, 0.3); }
    .hud-stat-pill.difficulty-pill.suddendeath { background: rgba(239, 68, 68, 0.06); border-color: rgba(239, 68, 68, 0.3); }
    .hud-stat-pill.streak { background: rgba(249, 115, 22, 0.08); border-color: rgba(249, 115, 22, 0.3); animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    .hud-stat-pill.streak span { color: #f97316; font-size: 1.1rem; }
    .hud-stat-pill.streak.hot { background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(249, 115, 22, 0.1)); border-color: rgba(239, 68, 68, 0.4); }
    .hud-stat-pill.streak.hot span { color: #ef4444; font-weight: 900; }
    @keyframes popIn { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
    .hud-stat-pill.question-counter { background: rgba(0,0,0,0.02); }
 
    .time-progress-bar { height: 5px; background: rgba(0,0,0,0.04); border-radius: 0 0 20px 20px; overflow: hidden; margin-bottom: 0; border: 2.5px solid rgba(133, 92, 214, 0.28); border-top: none; z-index: 10; }
    .time-progress-fill { height: 100%; background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary)); border-radius: 0 0 20px 20px; transition: width 1s linear; }
    .time-progress-fill.warning { background: linear-gradient(90deg, #f59e0b, #facc15); }
    .time-progress-fill.danger { background: linear-gradient(90deg, #dc2626, #ef4444); animation: dangerPulse 0.5s infinite alternate; }
    @keyframes dangerPulse { from { opacity: 0.7; } to { opacity: 1; } }

    .timer-box { display: flex; align-items: center; gap: 0.5rem; background: #ffffff; border: 2.5px solid rgba(0,0,0,0.12); padding: 0.4rem 1.5rem; border-radius: 99px; font-family: 'Outfit', monospace; font-size: 2rem; font-weight: 800; color: var(--text-primary); box-shadow: var(--shadow-sm); transition: all 0.3s; letter-spacing: -0.02em; }
    .timer-box.warning { border-color: #facc15; background: rgba(250, 204, 21, 0.06); color: #ca8a04; animation: heartbeat 1s infinite alternate ease-in-out; }
    .timer-box.danger { border-color: #ef4444; background: rgba(239, 68, 68, 0.06); color: #ef4444; animation: heartbeat 0.5s infinite alternate ease-in-out; }
    @keyframes heartbeat { from { transform: scale(1); } to { transform: scale(1.03); } }

    /* QUESTION PANEL & SCROLL MARGIN ADJUSTMENT */
    .question-card { background: #ffffff; padding: 2rem 2.5rem; border-radius: 28px; box-shadow: var(--shadow-lg); border: 2.5px solid rgba(133, 92, 214, 0.28); margin-top: 1.25rem; }
    .q-header { display: flex; gap: 0.75rem; margin-bottom: 1.75rem; flex-wrap: wrap; }
    .q-materia-badge { background: rgba(133, 92, 214, 0.08); color: var(--accent-primary); border: 2px solid rgba(133, 92, 214, 0.25); padding: 0.35rem 0.85rem; border-radius: 8px; font-size: 0.78rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.03em; }
    .q-tema-badge { background: #f1f5f9; color: #475569; border: 2px solid #cbd5e1; padding: 0.35rem 0.85rem; border-radius: 8px; font-size: 0.78rem; font-weight: 700; }
    .q-preambulo { font-size: 1rem; color: var(--text-secondary); font-style: italic; margin-bottom: 1.25rem; border-left: 4px solid var(--accent-primary); padding-left: 1.25rem; line-height: 1.6; }
    .q-img-wrap { text-align: center; margin-bottom: 1.75rem; background: rgba(0,0,0,0.02); padding: 1rem; border-radius: 16px; border: 1.5px dashed rgba(0,0,0,0.06); }
    .q-img { max-width: 100%; max-height: 250px; border-radius: 12px; }
    .q-enunciado { font-size: 1.45rem; font-weight: 800; line-height: 1.45; margin-bottom: 2.25rem; color: var(--text-primary); font-family: var(--font-heading); }
    .q-formula-box { background: rgba(0,0,0,0.03); padding: 1rem 1.5rem; border-radius: 12px; font-family: monospace; font-size: 1.15rem; margin-bottom: 2rem; border-left: 4px solid var(--accent-secondary); color: #0369a1; }

    /* OPTIONS GRID */
    .options-grid { display: flex; flex-direction: column; gap: 1rem; }
    .option-btn { background: #ffffff; border: 2.5px solid rgba(0, 0, 0, 0.12); border-radius: 20px; padding: 1.2rem 1.5rem; text-align: left; cursor: pointer; transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1); display: flex; align-items: center; justify-content: space-between; gap: 1rem; outline: none; }
    .option-btn:hover:not(:disabled) { border-color: rgba(133, 92, 214, 0.45); background: #fcfbfe; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(133, 92, 214, 0.05); }
    .option-btn:active:not(:disabled) { transform: translateY(0); }
    .opt-left-section { display: flex; align-items: center; gap: 1rem; flex: 1; }
    .opt-letter { width: 38px; height: 38px; background: rgba(0,0,0,0.04); color: var(--text-secondary); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.15rem; flex-shrink: 0; transition: all 0.15s; }
    .opt-text { font-size: 1.05rem; font-weight: 600; color: var(--text-primary); }
    .opt-img { max-height: 80px; max-width: 100%; border-radius: 8px; }

    .option-btn.selected { border: 3px solid var(--accent-primary); background: rgba(133, 92, 214, 0.03); }
    .option-btn.correct { background: #f0fdf4; border: 3px solid #22c55e; color: #15803d; box-shadow: 0 6px 20px rgba(34, 197, 94, 0.15); }
    .option-btn.correct .opt-letter { background: #22c55e; color: #fff; }
    .option-btn.correct .opt-text { color: #166534; }
    .option-btn.correct .kbd-badge { border-color: #22c55e; color: #22c55e; box-shadow: 0 2px 0 #22c55e; }
    
    .option-btn.incorrect { background: #fef2f2; border: 3px solid #ef4444; color: #b91c1c; animation: shake 0.4s; }
    .option-btn.incorrect .opt-letter { background: #ef4444; color: #fff; }
    .option-btn.incorrect .opt-text { color: #991b1b; }
    .option-btn.incorrect .kbd-badge { border-color: #ef4444; color: #ef4444; box-shadow: 0 2px 0 #ef4444; }

    @keyframes shake { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-6px); } 40% { transform: translateX(6px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(4px); } }

    /* CONTROLS */
    .game-controls { display: flex; justify-content: space-between; align-items: center; margin-top: 2.25rem; padding-top: 1.5rem; border-top: 2.5px dashed rgba(0,0,0,0.06); }
    .keyboard-helper { display: flex; align-items: center; gap: 0.4rem; }
    .kbd-key { background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 6px; padding: 2px 7px; font-size: 0.72rem; color: #475569; font-weight: 800; font-family: monospace; box-shadow: 0 2px 0 #cbd5e1; }
    .kbd-key.wide { padding: 2px 12px; }
    .kbd-desc { font-size: 0.78rem; color: var(--text-muted); font-weight: 600; margin-left: 0.2rem; }
    .kbd-separator { color: rgba(0,0,0,0.1); margin: 0 0.5rem; font-weight: 300; }
    
    .btn-skip-game { background: rgba(0,0,0,0.04); color: var(--text-secondary); border: 2.5px solid rgba(0,0,0,0.12); padding: 0.75rem 1.5rem; border-radius: 16px; font-weight: 700; cursor: pointer; transition: all 0.2s; font-size: 0.9rem; }
    .btn-skip-game:hover:not(:disabled) { background: rgba(0,0,0,0.08); border-color: rgba(0,0,0,0.18); color: var(--text-primary); }

    /* PREMIUM FEEDBACK EFFECTS - sparkles & streak multiplier pops */
    .feedback-effect-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      z-index: 10;
      background: rgba(34, 197, 94, 0.08);
      border-radius: 17px;
      animation: overlayFade 1.1s ease-out forwards;
    }
    .feedback-effect-overlay.streak-mode {
      background: rgba(245, 158, 11, 0.08);
    }
    @keyframes overlayFade {
      0% { opacity: 1; }
      80% { opacity: 1; }
      100% { opacity: 0; }
    }
    
    .sparkles-container {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .correct-text-pop {
      font-size: 2.4rem;
      font-weight: 900;
      color: #10b981;
      font-family: var(--font-heading);
      text-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
      animation: textPop 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }
    .sparkle {
      position: absolute;
      font-size: 2rem;
      animation: sparkleFly 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    }
    .sp-1 { --tx: -85px; --ty: -65px; --rot: 15deg; animation-delay: 0s; }
    .sp-2 { --tx: 85px; --ty: -75px; --rot: -20deg; animation-delay: 0.05s; }
    .sp-3 { --tx: -95px; --ty: 55px; --rot: -45deg; animation-delay: 0.1s; }
    .sp-4 { --tx: 95px; --ty: 65px; --rot: 30deg; animation-delay: 0.15s; }
    .sp-5 { --tx: 0px; --ty: -105px; --rot: 0deg; animation-delay: 0.02s; }
    @keyframes sparkleFly {
      0% { transform: scale(0) translate(0, 0) rotate(0deg); opacity: 0; }
      50% { opacity: 1; }
      100% { transform: scale(1.2) translate(var(--tx), var(--ty)) rotate(var(--rot)); opacity: 0; }
    }

    /* Flames (Streak Mode) */
    .flame-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .flame-wrapper {
      position: relative;
      width: 100px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .fire-emoji-main {
      font-size: 4rem;
      z-index: 2;
      animation: mainFlame 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }
    .fire-particle {
      position: absolute;
      font-size: 2rem;
      z-index: 1;
      animation: fireFly 0.8s ease-out forwards;
    }
    .fp-1 { --tx: -45px; --ty: -55px; animation-delay: 0s; }
    .fp-2 { --tx: 45px; --ty: -60px; animation-delay: 0.08s; }
    .fp-3 { --tx: 0px; --ty: -75px; animation-delay: 0.15s; }
    .streak-text-pop {
      margin-top: 0.5rem;
      font-size: 2.6rem;
      font-weight: 900;
      color: #ff9600;
      font-family: var(--font-heading);
      text-shadow: 0 0 25px rgba(255, 150, 0, 0.5);
      animation: textPop 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .streak-number {
      color: #ffc800;
      font-size: 3.2rem;
      animation: streakNumberBounce 0.5s ease-in-out infinite alternate;
    }
    @keyframes mainFlame {
      0% { transform: scale(0) rotate(0deg); }
      30% { transform: scale(1.4) rotate(-10deg); }
      50% { transform: scale(1.2) rotate(10deg); }
      100% { transform: scale(1) rotate(0deg); opacity: 0; }
    }
    @keyframes fireFly {
      0% { transform: scale(0.5) translate(0, 0); opacity: 0; }
      30% { opacity: 1; }
      100% { transform: scale(1.5) translate(var(--tx), var(--ty)); opacity: 0; }
    }
    @keyframes textPop {
      0% { transform: scale(0.4); opacity: 0; }
      50% { transform: scale(1.15); opacity: 1; }
      100% { transform: scale(1); opacity: 0; }
    }
    @keyframes streakNumberBounce {
      from { transform: scale(1); }
      to { transform: scale(1.15); }
    }

    /* LOGOUT & OTHER CONFIRMATION MODALS */
    .logout-confirm-overlay { z-index: 11000; }
    .logout-confirm-modal { max-width: 420px !important; padding: 0 !important; }
    .confirm-content { text-align: center; padding: 1rem 0; }
    .confirm-icon { font-size: 3.5rem; margin-bottom: 1rem; }
    .confirm-icon-img { width: 88px; height: 88px; object-fit: contain; }
    .confirm-content h3 { margin: 0 0 0.5rem; font-size: 1.3rem; }
    .confirm-content p { color: var(--text-secondary); margin: 0; }
    .confirm-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .btn-secondary-modal { padding: 0.85rem; border-radius: 12px; border: 2.5px solid var(--glass-border); background: transparent; color: var(--text-primary); font-weight: 700; cursor: pointer; transition: all 0.2s; }
    .btn-secondary-modal:hover { background: var(--bg-secondary); }
    .btn-primary-modal { padding: 0.85rem; border-radius: 12px; border: none; background: var(--accent-primary); color: #fff; font-weight: 700; cursor: pointer; transition: all 0.2s; }
    .btn-primary-modal:hover { background: #6b46b8; }
    .btn-danger { background: #ef4444 !important; box-shadow: 0 4px 12px rgba(239,68,68,0.25) !important; color: white !important; }
    .btn-danger:hover { background: #dc2626 !important; }

    /* RESULTS SCREEN */
    .results-state { text-align: center; }
    .results-medal { font-size: 5rem; margin-bottom: 0.5rem; filter: drop-shadow(0 8px 16px rgba(133, 92, 214, 0.2)); animation: bounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    @keyframes bounceIn { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.15); } 100% { transform: scale(1); opacity: 1; } }
    .results-config-badges { display: flex; gap: 0.5rem; margin-top: 0.5rem; flex-wrap: wrap; }
    .config-badge { background: rgba(0,0,0,0.04); padding: 0.35rem 0.85rem; border-radius: 99px; font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); border: 2px solid rgba(0,0,0,0.12); }
    .config-badge.normal { color: #22c55e; border-color: rgba(34, 197, 94, 0.3); background: rgba(34, 197, 94, 0.05); }
    .config-badge.hardcore { color: #f97316; border-color: rgba(249, 115, 22, 0.3); background: rgba(249, 115, 22, 0.05); }
    .config-badge.suddendeath { color: #ef4444; border-color: rgba(239, 68, 68, 0.3); background: rgba(239, 68, 68, 0.05); }
    .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .stat-box { background: #ffffff; padding: 1.75rem 1.25rem; border-radius: 20px; box-shadow: var(--shadow); border: 2.5px solid rgba(133, 92, 214, 0.25); display: flex; flex-direction: column; align-items: center; transition: all 0.3s; }
    .stat-box:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); border-color: rgba(133, 92, 214, 0.45); }
    .stat-icon { font-size: 2rem; margin-bottom: 0.5rem; }
    .stat-val { font-size: 2.8rem; font-weight: 800; line-height: 1; margin-bottom: 0.35rem; font-family: var(--font-heading); }
    .stat-label { color: var(--text-secondary); font-size: 0.82rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    .stat-box.excellent { border-color: #22c55e; border-width: 3px; background: linear-gradient(180deg, #ffffff, #f0fdf4); }
    .stat-box.good { border-color: var(--accent-secondary); border-width: 3px; background: linear-gradient(180deg, #ffffff, rgba(28, 176, 246, 0.03)); }

    /* MODAL GENERAL */
    .modal-overlay:not(.logout-confirm-overlay) { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-container:not(.logout-confirm-modal) { background: #ffffff; padding: 2rem; border-radius: 24px; width: 90%; max-width: 400px; text-align: center; }
    .confirm-icon { font-size: 3rem; margin-bottom: 1rem; }

    /* PODIUM & ERRORS */
    .podium-section, .errors-section { background: #ffffff; border: 2.5px solid rgba(133, 92, 214, 0.25); padding: 2.5rem; border-radius: 28px; margin-bottom: 2rem; text-align: left; box-shadow: var(--shadow-md); }
    .section-header-row { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; }
    .section-header-icon { font-size: 1.8rem; }
    .podium-section h3, .errors-section h3 { margin: 0; color: var(--text-primary); font-size: 1.45rem; font-weight: 800; }
    .podium-grid { display: flex; flex-direction: column; gap: 1.25rem; }
    .podium-item { display: flex; flex-direction: column; gap: 0.4rem; }
    .p-info-row { display: flex; justify-content: space-between; font-weight: 700; font-size: 0.98rem; }
    .p-name { color: var(--text-primary); }
    .p-details { color: var(--text-secondary); font-weight: 600; font-size: 0.9rem; }
    .p-bar-track { height: 12px; background: rgba(0,0,0,0.04); border-radius: 99px; overflow: hidden; border: 1.5px solid rgba(0,0,0,0.08); }
    .p-bar-fill { height: 100%; border-radius: 99px; transition: width 0.8s ease; }
    .p-bar-fill.excellent { background: linear-gradient(90deg, #22c55e, #4ade80); }
    .p-bar-fill.warning { background: linear-gradient(90deg, #facc15, #fde047); }
    .p-bar-fill.critical { background: linear-gradient(90deg, #ef4444, #f87171); }
    .section-subtitle { color: var(--text-secondary); margin: -1rem 0 2rem; font-size: 0.95rem; font-weight: 500; }
    .error-title h3 { color: #ef4444; }
    .error-card { background: rgba(0,0,0,0.01); border: 2.5px solid rgba(0,0,0,0.12); padding: 2rem; border-radius: 20px; margin-bottom: 1.25rem; box-shadow: none; }
    .error-card:hover { border-color: rgba(133, 92, 214, 0.35); box-shadow: var(--shadow-sm); }
    .err-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; }
    .err-num { color: #ef4444; font-weight: 800; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; background: rgba(239, 68, 68, 0.06); border: 2px solid rgba(239, 68, 68, 0.25); padding: 0.25rem 0.75rem; border-radius: 8px; }
    .err-materia-badge { background: #f1f5f9; color: #475569; padding: 0.25rem 0.75rem; border-radius: 8px; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; border: 2px solid #cbd5e1; }
    .err-enunciado { font-size: 1.15rem; color: var(--text-primary); font-weight: 700; margin-bottom: 1.5rem; line-height: 1.5; font-family: var(--font-heading); }
    .err-answers-box { display: flex; flex-direction: column; gap: 0.75rem; background: #ffffff; padding: 1.25rem; border-radius: 16px; border: 2.5px solid rgba(0,0,0,0.12); margin-bottom: 1.25rem; }
    .err-answer-item { display: flex; align-items: center; gap: 0.75rem; font-size: 0.95rem; font-weight: 600; }
    .err-answer-status-badge { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; padding: 0.2rem 0.5rem; border-radius: 6px; flex-shrink: 0; min-width: 100px; text-align: center; }
    .err-answer-item.incorrect .err-answer-status-badge { background: #fee2e2; color: #ef4444; }
    .err-answer-item.incorrect .err-answer-content { color: #991b1b; }
    .err-answer-item.correct .err-answer-status-badge { background: #dcfce7; color: #22c55e; }
    .err-answer-item.correct .err-answer-content { color: #166534; }
    .err-answer-content { font-size: 0.98rem; }
    .err-feedback { background: rgba(56, 189, 248, 0.05); border-left: 5px solid var(--accent-secondary); padding: 1.25rem; color: #0369a1; font-size: 0.95rem; border-radius: 0 12px 12px 0; border-top: 2px solid rgba(56, 189, 248, 0.15); border-bottom: 2px solid rgba(56, 189, 248, 0.15); border-right: 2px solid rgba(56, 189, 248, 0.15); display: flex; flex-direction: column; gap: 0.25rem; }
    .feedback-bulb { font-weight: 800; font-size: 0.88rem; text-transform: uppercase; color: #0284c7; letter-spacing: 0.03em; }
    .err-feedback p { margin: 0; font-weight: 500; line-height: 1.5; }
    .results-actions { display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; flex-wrap: wrap; }
    .btn-primary-lg { background: var(--accent-primary); color: #fff; border: none; padding: 1.1rem 2.5rem; border-radius: 9999px; font-size: 1.15rem; font-weight: 700; cursor: pointer; box-shadow: 0 4px 0 #6b46b8; transition: all 0.2s; }
    .btn-primary-lg:hover { transform: translateY(-2px); background: #6b46b8; box-shadow: 0 6px 0 #5a3a9a; }
    .btn-primary-lg:active { transform: translateY(0); }
    .btn-outline-lg { background: #ffffff; border: 3px solid var(--accent-primary); color: var(--accent-primary); padding: 1.1rem 2.5rem; border-radius: 9999px; font-size: 1.15rem; font-weight: 700; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; justify-content: center; }
    .btn-outline-lg:hover { background: var(--accent-primary); color: #ffffff; box-shadow: 0 4px 0 #6b46b8; transform: translateY(-2px); }

    @media (max-width: 1024px) {
      aside.sidebar, .sidebar { display: none !important; }
      .mobile-header { display: flex !important; }
      .main-content { margin-left: 0 !important; max-width: 100vw !important; width: 100% !important; padding: 0 !important; padding-top: 60px !important; box-sizing: border-box !important; }
      .dashboard-header { height: auto !important; padding: 1.25rem 1rem 0.75rem !important; flex-direction: column !important; align-items: flex-start !important; gap: 0.5rem !important; width: 100% !important; box-sizing: border-box !important; }
      .dashboard-header .welcome-actions { display: none !important; }
      .dashboard-header .subtitle { font-size: 0.85rem !important; line-height: 1.35 !important; }
      .dashboard-body { padding: 1rem 1rem 2rem !important; width: 100% !important; box-sizing: border-box !important; }
      .setup-card { padding: 1.25rem 1rem !important; border-radius: 16px !important; }
      .setup-section-title { flex-wrap: wrap !important; gap: 0.5rem !important; justify-content: space-between !important; }
      .setup-section-title h3 { font-size: 1.1rem !important; flex: 1 !important; min-width: 130px !important; }
      .btn-select-all { padding: 0.4rem 0.75rem !important; font-size: 0.75rem !important; }
    }
    @media (max-width: 768px) {
      aside.sidebar, .sidebar { display: none !important; }
      .mobile-header { display: flex !important; }
      .main-content { margin-left: 0 !important; max-width: 100vw !important; width: 100% !important; padding: 0 !important; padding-top: 60px !important; box-sizing: border-box !important; }
      .dashboard-header { height: auto !important; padding: 1rem 0.85rem 0.5rem !important; flex-direction: column !important; align-items: flex-start !important; gap: 0.5rem !important; width: 100% !important; box-sizing: border-box !important; }
      .dashboard-header .welcome-actions { display: none !important; }
      .dashboard-header .subtitle { font-size: 0.82rem !important; line-height: 1.35 !important; }
      .dashboard-body { padding: 0.85rem 0.85rem 2rem !important; width: 100% !important; box-sizing: border-box !important; }
      .setup-card { padding: 1rem 0.85rem !important; border-radius: 16px !important; }
      .setup-section-title { flex-wrap: wrap !important; gap: 0.5rem !important; justify-content: space-between !important; }
      .setup-section-title h3 { font-size: 1.05rem !important; flex: 1 !important; min-width: 120px !important; }
      .btn-select-all { padding: 0.35rem 0.65rem !important; font-size: 0.72rem !important; }
      .hud { flex-direction: row; gap: 0.5rem; padding: 0.6rem 0.75rem; justify-content: space-between; border-radius: 16px 16px 0 0; }
      .hud-left, .hud-right { gap: 0.35rem; }
      .hud-stat-pill { padding: 0.3rem 0.5rem; }
      .stat-pill-content label { display: none; }
      .timer-box { font-size: 1.5rem; padding: 0.3rem 0.8rem; }
      .time-progress-bar { border-radius: 0 0 16px 16px; position: static; }
      .stats-row { grid-template-columns: 1fr 1fr; gap: 0.75rem; }
      .stat-box { min-width: 100%; padding: 1.25rem 1rem; }
      .stat-val { font-size: 2.2rem; }
      .question-card { padding: 1.25rem 1rem; border-radius: 20px; }
      .q-enunciado { font-size: 1.25rem; }
      .option-btn { padding: 1rem; }
      .results-actions { flex-direction: column; width: 100%; }
      .btn-primary-lg, .btn-outline-lg { width: 100%; text-align: center; }
      .kbd-badge, .keyboard-helper { display: none; }
      .setup-summary { gap: 0.5rem; }
      .summary-pill { font-size: 0.78rem; padding: 0.35rem 0.75rem; }
      .results-medal { font-size: 3.5rem; }
      .title { font-size: 2.2rem; }
      .podium-section, .errors-section { padding: 1.25rem 1rem; border-radius: 18px; }
      .error-card { padding: 1.25rem 1rem; }
      .err-header { flex-wrap: wrap; gap: 0.5rem; }
      .p-info-row { flex-wrap: wrap; gap: 0.25rem; }
      .err-answer-item { flex-wrap: wrap; }
      .err-answer-status-badge { min-width: 0; }
    }

    @media (max-width: 480px) {
      .main-content { padding-top: 60px !important; }
      .subjects-grid, .modes-grid { grid-template-columns: 1fr !important; }
      .time-presets { flex-direction: column; }
      .preset-btn { min-width: 100%; }
      .custom-time-wrap { max-width: 100%; }
      .timer-box { font-size: 1.3rem; padding: 0.3rem 0.65rem; }
      .q-header { gap: 0.5rem; }
      .q-enunciado { font-size: 1.1rem; }
      .options-grid { gap: 0.75rem; }
      .option-btn { padding: 0.85rem; }
      .game-controls { flex-wrap: wrap; gap: 0.75rem; justify-content: center; }
      .btn-skip-game { width: 100%; }
    }

    /* TIME UP TRANSITION OVERLAY */
    .timeup-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: radial-gradient(circle at center, rgba(17, 24, 39, 0.95), rgba(10, 10, 12, 0.98));
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      opacity: 1;
      transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .timeup-overlay.fade-out {
      opacity: 0;
      pointer-events: none;
    }
    .timeup-content {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #ffffff;
      max-width: 450px;
      padding: 2rem;
    }
    .timeup-icon-wrapper {
      position: relative;
      width: 100px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5rem;
    }
    .timeup-emoji {
      font-size: 4.5rem;
      z-index: 2;
      animation: clockSpin 2.2s cubic-bezier(0.68, -0.6, 0.32, 1.6) infinite;
      display: inline-block;
    }
    .timeup-pulse {
      position: absolute;
      width: 90px;
      height: 90px;
      border-radius: 50%;
      background: rgba(133, 92, 214, 0.4);
      animation: radialPulse 1.5s ease-out infinite;
      z-index: 1;
    }
    .timeup-title {
      font-size: 2.8rem;
      font-weight: 800;
      font-family: var(--font-heading);
      margin: 0;
      background: linear-gradient(135deg, #ffffff, #e9d5ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-shadow: 0 4px 20px rgba(133, 92, 214, 0.3);
      animation: textFloat 2s ease-in-out infinite;
    }
    .timeup-subtitle {
      font-size: 1.05rem;
      color: rgba(255, 255, 255, 0.7);
      margin: 0.75rem 0 2rem;
      font-weight: 500;
      line-height: 1.4;
    }
    .timeup-loader {
      width: 200px;
      height: 6px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      overflow: hidden;
      position: relative;
    }
    .loader-bar {
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
      transform-origin: left;
      animation: loaderStretch 2.2s linear forwards;
    }
    .animate-pop-in {
      animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
    @keyframes clockSpin {
      0% { transform: scale(1) rotate(0deg); }
      10% { transform: scale(1.1) rotate(-10deg); }
      50% { transform: scale(1.2) rotate(180deg); }
      60% { transform: scale(1.2) rotate(190deg); }
      100% { transform: scale(1) rotate(360deg); }
    }
    @keyframes radialPulse {
      0% { transform: scale(0.8); opacity: 1; }
      100% { transform: scale(2.2); opacity: 0; }
    }
    @keyframes textFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
    @keyframes loaderStretch {
      0% { transform: scaleX(0); }
      100% { transform: scaleX(1); }
    }
    @keyframes popIn {
      0% { opacity: 0; transform: scale(0.8); }
      100% { opacity: 1; transform: scale(1); }
    }
  `]
})
export class MenteVelozComponent implements OnInit, OnDestroy {
  public paesContent = inject(PaesContentService);
  public firestoreService = inject(FirestoreService);
  public adminService = inject(AdminService);
  private authService = inject(AuthService);
  private dashSvc = inject(DashboardService);
  public paymentService = inject(PaymentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

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

  // --- PERSONAL RECORDS ---
  personalRecords: Record<string, number> = {};
  currentCombinationRecord = signal<number>(0);

  mobileOpen = false;
  showSettingsModal = false;
  showProfileModal = false;
  showLogoutConfirm = false;
  showTimeUpOverlay = signal(false);

  // --- STATE ---
  gameState = signal<GameState>('setup');
  selectedMaterias = new Set<string>();
  timeLimit = signal<number>(60);
  customTimeMinutes = 1;
  difficulty = signal<DifficultyMode>('normal');
  setupError = false;
  bestStreak = 0;

  // --- PLAYING STATE ---
  optionsList: ('A'|'B'|'C'|'D')[] = ['A', 'B', 'C', 'D'];
  timeLeft = signal<number>(0);
  timerInterval: any;
  poolQuestions: any[] = [];
  playedQuestions: PlayedQuestion[] = [];
  currentQuestionIndex = 0;
  
  streak = signal<number>(0);
  correctAnswers = signal<number>(0);
  totalAnswered = signal<number>(0);

  currentQuestion = signal<any | null>(null);
  selectedOption: 'A'|'B'|'C'|'D'|'SKIP'|null = null;
  showFeedback = false;
  showFeedbackEffect = false;
  questionStartTime = 0;

  isProPlan = computed(() => {
    const p = this.firestoreService.profileSignal();
    return p?.plan === 'premium';
  });

  private toast = inject(ToastService);
  sessionStatus = signal<{ allowed: boolean; remaining: number; nextAvailableAt?: Date }>({ allowed: true, remaining: FREE_MENTE_VELOZ_SESSIONS_PER_WINDOW });

  private isFreeTier(): boolean {
    return !this.isProPlan() && !this.adminService.isAdmin();
  }

  isMateriaLockedForFree(id: string): boolean {
    if (!this.isFreeTier()) return false;
    return !FREE_MENTE_VELOZ_MATERIAS.includes(this.normalizeMateriaId(id));
  }

  selectableMateriaCount(): number {
    const all = this.paesContent.materias();
    return this.isFreeTier() ? all.filter(m => !this.isMateriaLockedForFree(m.id)).length : all.length;
  }

  isDifficultyLockedForFree(mode: DifficultyMode): boolean {
    return this.isFreeTier() && mode !== 'normal';
  }

  isTimeLockedForFree(seconds: number): boolean {
    return this.isFreeTier() && !FREE_MENTE_VELOZ_TIMES.includes(seconds);
  }

  setDifficulty(mode: DifficultyMode) {
    if (this.isDifficultyLockedForFree(mode)) {
      this.paymentService.openPricingModal();
      return;
    }
    this.difficulty.set(mode);
  }

  private getSessionTimestampsKey(): string {
    const uid = this.authService.currentUser?.uid || 'anon';
    return `estudiauni_mv_sessions_${uid}`;
  }

  private getRecentSessionTimestamps(): number[] {
    try {
      const raw = localStorage.getItem(this.getSessionTimestampsKey()) || '[]';
      const timestamps: number[] = JSON.parse(raw);
      const cutoff = Date.now() - MENTE_VELOZ_WINDOW_HOURS * 3600 * 1000;
      return timestamps.filter(t => t > cutoff);
    } catch (e) {
      return [];
    }
  }

  private recordSessionStart() {
    const recent = this.getRecentSessionTimestamps();
    recent.push(Date.now());
    localStorage.setItem(this.getSessionTimestampsKey(), JSON.stringify(recent));
    this.updateSessionStatus();
  }

  updateSessionStatus() {
    if (!this.isFreeTier()) {
      this.sessionStatus.set({ allowed: true, remaining: Infinity });
      return;
    }
    const recent = this.getRecentSessionTimestamps();
    const remaining = Math.max(0, FREE_MENTE_VELOZ_SESSIONS_PER_WINDOW - recent.length);
    if (remaining > 0) {
      this.sessionStatus.set({ allowed: true, remaining });
      return;
    }
    const oldest = Math.min(...recent);
    const nextAvailableAt = new Date(oldest + MENTE_VELOZ_WINDOW_HOURS * 3600 * 1000);
    this.sessionStatus.set({ allowed: false, remaining: 0, nextAvailableAt });
  }

  profileInitial = computed(() => {
    const p = this.firestoreService.profileSignal();
    return p?.displayName?.charAt(0).toUpperCase() || 'U';
  });

  updateCurrentRecord() {
    if (this.selectedMaterias.size === 0) {
      this.currentCombinationRecord.set(0);
      return;
    }
    const key = Array.from(this.selectedMaterias).sort().join(',');
    const record = this.personalRecords[key] || 0;
    this.currentCombinationRecord.set(record);
  }

  ngOnInit() {
    this.paesContent.materias().forEach(m => {
      if (!this.isMateriaLockedForFree(m.id)) this.selectedMaterias.add(m.id);
    });
    this.updateSessionStatus();

    // El banco de preguntas se carga bajo demanda (no es parte de la carga inicial de la app)
    this.paesContent.ensurePoolPreguntasLoaded();

    // Load personal records when auth is resolved
    this.authService.user$.subscribe(user => {
      if (user) {
        const raw = localStorage.getItem(`estudiauni_mv_records_${user.uid}`);
        if (raw) {
          try { this.personalRecords = JSON.parse(raw); } catch { this.personalRecords = {}; }
        } else {
          this.personalRecords = {};
        }
        this.updateCurrentRecord();
      }
    });

    // Check query parameters to load historical review
    this.route.queryParams.subscribe(params => {
      const historyId = params['historyId'];
      if (historyId) {
        this.loadHistoryReview(historyId);
      }
    });
  }

  loadHistoryReview(historyId: string) {
    const user = this.authService.currentUser;
    const uid = user ? user.uid : null;
    if (!uid) return;

    const activitiesRaw = localStorage.getItem(`estudiauni_activities_${uid}`);
    if (!activitiesRaw) return;

    try {
      const activities: any[] = JSON.parse(activitiesRaw);
      const entry = activities.find(a => a.id === historyId);
      if (entry && entry.type === 'mente-veloz' && entry.playedQuestionsRaw) {
        const parsedQuestions = JSON.parse(entry.playedQuestionsRaw);
        
        this.gameState.set('results');
        this.playedQuestions = parsedQuestions;
        this.correctAnswers.set(entry.totalCorrect || 0);
        this.totalAnswered.set(entry.totalQuestions || 0);
        this.bestStreak = entry.bestStreak || 0;
        
        if (entry.timeLimit) this.timeLimit.set(entry.timeLimit);
        if (entry.difficulty) this.difficulty.set(entry.difficulty as DifficultyMode);
        if (entry.materiasKey) {
          this.selectedMaterias.clear();
          entry.materiasKey.split(',').forEach((id: string) => this.selectedMaterias.add(id));
        }
        this.updateCurrentRecord();
      }
    } catch (e) {
      console.error('Error loading Mente Veloz history review:', e);
    }
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  toggleMateria(id: string) {
    if (this.isMateriaLockedForFree(id)) {
      this.paymentService.openPricingModal();
      return;
    }
    if (this.selectedMaterias.has(id)) {
      this.selectedMaterias.delete(id);
    } else {
      this.selectedMaterias.add(id);
    }
    this.updateCurrentRecord();
  }

  toggleAllMaterias() {
    const all = this.paesContent.materias();
    const selectable = this.isFreeTier() ? all.filter(m => !this.isMateriaLockedForFree(m.id)) : all;
    if (this.selectedMaterias.size === selectable.length) {
      this.selectedMaterias.clear();
    } else {
      this.selectedMaterias.clear();
      selectable.forEach(m => this.selectedMaterias.add(m.id));
    }
    this.updateCurrentRecord();
  }

  getMateriaIconPath(id: string): string | null {
    if (!id) return null;
    const norm = id.toLowerCase();
    if (norm.includes('lectora')) return 'assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_Lenguaje.svg';
    if (norm.includes('biologia')) return 'assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_Biologia.svg';
    if (norm.includes('fisica')) return 'assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_Fisica.svg';
    if (norm.includes('quimica')) return 'assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_Quimica.svg';
    if (norm.includes('tp') || norm.includes('tecnico')) return 'assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_TecnicoProfesional.svg';
    if (norm.includes('historia')) return 'assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_Historia.svg';
    if (norm === 'mat1' || norm.includes('m1') || norm.includes('matematica-1') || norm.includes('matematicas-m1')) return 'assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_m1.svg';
    if (norm === 'mat2' || norm.includes('m2') || norm.includes('matematica-2') || norm.includes('matematicas-m2')) return 'assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_m2.svg';
    if (norm.includes('ciencias')) return 'assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_Biologia.svg';
    return null;
  }

  normalizeMateriaId(id: string): string {
    if (!id) return '';
    const norm = id.toLowerCase().trim();
    if (norm === 'mat1' || norm === 'matematicas-m1' || norm === 'math-m1' || norm === 'm1') return 'mat1';
    if (norm === 'mat2' || norm === 'matematicas-m2' || norm === 'm2') return 'mat2';
    if (norm === 'comp-lectora' || norm === 'competencia-lectora' || norm === 'lectura') return 'comp-lectora';
    if (norm === 'historia' || norm === 'historia y cs. sociales' || norm === 'historia y cs. soc.') return 'historia';
    if (norm === 'ciencias') return 'ciencias';
    return norm;
  }

  isMateriaSelected(materiaId: string): boolean {
    if (this.selectedMaterias.has(materiaId)) return true;
    const normalizedTarget = this.normalizeMateriaId(materiaId);
    return Array.from(this.selectedMaterias).some(selectedId => 
      this.normalizeMateriaId(selectedId) === normalizedTarget
    );
  }

  getPoolCount(): number {
    return this.paesContent.poolPreguntas().filter(q => this.isMateriaSelected(q.materiaId)).length;
  }

  setTime(seconds: number) {
    if (this.isTimeLockedForFree(seconds)) {
      this.paymentService.openPricingModal();
      return;
    }
    this.timeLimit.set(seconds);
    this.customTimeMinutes = Math.floor(seconds / 60);
  }

  setCustomTime() {
    if (this.isFreeTier()) {
      this.paymentService.openPricingModal();
      this.customTimeMinutes = Math.floor(this.timeLimit() / 60);
      return;
    }
    if (this.customTimeMinutes > 0) {
      this.timeLimit.set(this.customTimeMinutes * 60);
    }
  }

  async startGame() {
    if (this.selectedMaterias.size === 0) {
      this.setupError = true;
      return;
    }

    if (this.isFreeTier()) {
      this.updateSessionStatus();
      if (!this.sessionStatus().allowed) {
        this.toast.info('Ya usaste tus 3 partidas gratis de las últimas 24 horas. Pásate a PRO para partidas ilimitadas.');
        return;
      }
    }

    this.setupError = false;

    if (this.isFreeTier()) {
      this.recordSessionStart();
    }

    await this.paesContent.ensurePoolPreguntasLoaded();
    const allQuestions = this.paesContent.poolPreguntas();
    this.poolQuestions = allQuestions.filter(q => this.isMateriaSelected(q.materiaId));
    this.poolQuestions = this.shuffleArray([...this.poolQuestions]);

    if (this.poolQuestions.length === 0) {
      alert("No hay preguntas disponibles para las materias seleccionadas.");
      return;
    }

    this.playedQuestions = [];
    this.streak.set(0);
    this.bestStreak = 0;
    this.correctAnswers.set(0);
    this.totalAnswered.set(0);
    this.currentQuestionIndex = 0;
    this.timeLeft.set(this.timeLimit());

    this.gameState.set('playing');
    this.loadNextQuestion();
    this.startTimer();
  }

  startTimer() {
    this.clearTimer();
    this.timerInterval = setInterval(() => {
      if (this.gameState() !== 'playing') return;
      
      const current = this.timeLeft();
      if (current <= 1) {
        this.timeLeft.set(0);
        this.endGame();
      } else {
        this.timeLeft.set(current - 1);
      }
    }, 1000);
  }

  clearTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  loadNextQuestion() {
    if (this.currentQuestionIndex >= this.poolQuestions.length) {
      this.endGame();
      return;
    }

    this.showFeedback = false;
    this.showFeedbackEffect = false;
    this.selectedOption = null;
    this.currentQuestion.set(this.poolQuestions[this.currentQuestionIndex]);
    this.questionStartTime = Date.now();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.gameState() !== 'playing' || this.showFeedback) return;
    
    const key = event.key.toUpperCase();
    if (key === '1' || key === 'A') this.selectOption('A');
    if (key === '2' || key === 'B') this.selectOption('B');
    if (key === '3' || key === 'C') this.selectOption('C');
    if (key === '4' || key === 'D') this.selectOption('D');
    if (key === ' ' || key === 'SPACEBAR') {
      event.preventDefault();
      this.skipQuestion();
    }
  }

  selectOption(opt: 'A'|'B'|'C'|'D') {
    if (this.showFeedback) return;
    
    this.selectedOption = opt;
    this.showFeedback = true;
    
    const q = this.currentQuestion();
    const isCorrect = opt === q.respuesta_correcta;
    const timeTaken = (Date.now() - this.questionStartTime) / 1000;

    this.playedQuestions.push({ question: q, selectedOption: opt, isCorrect, timeTaken });
    this.totalAnswered.update(v => v + 1);

    if (isCorrect) {
      this.correctAnswers.update(v => v + 1);
      this.streak.update(v => v + 1);
      if (this.streak() > this.bestStreak) this.bestStreak = this.streak();
      this.showFeedbackEffect = true;
    } else {
      this.streak.set(0);
      this.showFeedbackEffect = false;
      
      if (this.difficulty() === 'hardcore') {
        this.timeLeft.update(v => Math.max(0, v - 5));
        if (this.timeLeft() === 0) {
          setTimeout(() => this.endGame(), 1000);
          return;
        }
      } else if (this.difficulty() === 'suddendeath') {
        setTimeout(() => this.endGame(), 1000);
        return;
      }
    }

    setTimeout(() => {
      if (this.gameState() === 'playing') {
        this.currentQuestionIndex++;
        this.loadNextQuestion();
      }
    }, 1000);
  }

  confirmLogout() {
    this.showLogoutConfirm = true;
  }

  async executeLogout() {
    this.showLogoutConfirm = false;
    await this.authService.logout().toPromise();
    window.location.href = '/login';
  }

  skipQuestion() {
    if (this.showFeedback) return;
    const q = this.currentQuestion();
    const timeTaken = (Date.now() - this.questionStartTime) / 1000;
    this.playedQuestions.push({ question: q, selectedOption: 'SKIP', isCorrect: false, timeTaken });
    this.streak.set(0);
    this.timeLeft.update(v => Math.max(0, v - 2));
    this.currentQuestionIndex++;
    this.loadNextQuestion();
  }

  endGame() {
    this.clearTimer();
    this.showTimeUpOverlay.set(true);

    // 1. Check & Update Personal Record for current subject combination
    const user = this.authService.currentUser;
    if (user) {
      const key = Array.from(this.selectedMaterias).sort().join(',');
      const currentRecord = this.personalRecords[key] || 0;
      const currentScore = this.correctAnswers();
      if (currentScore > currentRecord) {
        this.personalRecords[key] = currentScore;
        localStorage.setItem(`estudiauni_mv_records_${user.uid}`, JSON.stringify(this.personalRecords));
        this.updateCurrentRecord();
      }
    }

    // 2. Save Activity Entry to History via DashboardService
    const materiaNames = Array.from(this.selectedMaterias)
      .map(id => this.getMateriaName(id))
      .join(', ');

    const playedQuestionsRaw = JSON.stringify(this.playedQuestions.map(pq => ({
      question: {
        materiaId: pq.question.materiaId,
        enunciado: pq.question.enunciado,
        alternativas: pq.question.alternativas,
        respuesta_correcta: pq.question.respuesta_correcta,
        feedback_error: pq.question.feedback_error || null,
        feedback_acierto: pq.question.feedback_acierto || null,
        preambulo_texto: pq.question.preambulo_texto || null,
        preambulo_imagen_url: pq.question.preambulo_imagen_url || null,
      },
      selectedOption: pq.selectedOption,
      isCorrect: pq.isCorrect,
      timeTaken: pq.timeTaken
    })));

    const scorePercentage = this.totalAnswered() > 0 
      ? Math.round((this.correctAnswers() / this.totalAnswered()) * 100) 
      : 0;

    // History is a PRO perk — free users see their results on screen but nothing is persisted
    if (!this.isFreeTier()) {
      this.dashSvc.logMenteVelozCompleted({
        title: `Ronda de Mente Veloz: ${materiaNames}`,
        correctAnswers: this.correctAnswers(),
        totalQuestions: this.totalAnswered(),
        score: scorePercentage,
        difficulty: this.difficulty() === 'normal' ? 'Normal' : this.difficulty() === 'hardcore' ? 'Hardcore' : 'Muerte Súbita',
        timeLimit: this.timeLimit(),
        avgSpeed: this.avgSpeed().toString(),
        bestStreak: this.bestStreak,
        materiasKey: Array.from(this.selectedMaterias).sort().join(','),
        playedQuestionsRaw
      });
    }
    this.updateSessionStatus();

    setTimeout(() => {
      this.gameState.set('results');
      setTimeout(() => {
        this.showTimeUpOverlay.set(false);
      }, 600);
    }, 2200);
  }

  resetGame() {
    this.router.navigate([], {
      queryParams: { historyId: null },
      queryParamsHandling: 'merge'
    });
    this.gameState.set('setup');
  }

  // --- RESULTS COMPUTED ---
  accuracy = computed(() => {
    const total = this.totalAnswered();
    if (total === 0) return 0;
    return Math.round((this.correctAnswers() / total) * 100);
  });

  avgSpeed = computed(() => {
    const answered = this.playedQuestions.filter(p => p.selectedOption !== 'SKIP');
    if (answered.length === 0) return 0;
    const totalTime = answered.reduce((acc, curr) => acc + curr.timeTaken, 0);
    return (totalTime / answered.length).toFixed(1);
  });

  podiumStats = computed(() => {
    const stats = new Map<string, { total: number, correct: number }>();
    this.playedQuestions.forEach(p => {
      if (p.selectedOption === 'SKIP') return;
      const mId = p.question.materiaId;
      if (!stats.has(mId)) stats.set(mId, { total: 0, correct: 0 });
      const s = stats.get(mId)!;
      s.total++;
      if (p.isCorrect) s.correct++;
    });

    const result = Array.from(stats.entries()).map(([mId, s]) => ({
      materiaId: mId,
      total: s.total,
      correct: s.correct,
      accuracy: Math.round((s.correct / s.total) * 100)
    }));
    
    // Sort by accuracy descending
    return result.sort((a, b) => b.accuracy - a.accuracy);
  });

  failedQuestions = computed(() => {
    return this.playedQuestions.filter(p => !p.isCorrect);
  });

  getMateriaName(id: string): string {
    const m = this.paesContent.getMateriaById(id);
    return m ? m.title : id;
  }

  private shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
