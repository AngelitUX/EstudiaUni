import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Auth } from '@angular/fire/auth';
import { SettingsModalComponent } from '../profile/settings-modal.component';
import { ProfileModalComponent } from '../profile/profile-modal.component';
import { FirestoreService } from '../../core/services/firestore.service';
import { AdminService } from '../admin/services/admin.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { PaymentService } from '../../core/services/payment.service';
import { ToastService } from '../../core/services/toast.service';
import { StreakIconComponent } from '../../shared/components/streak-icon.component';
import { environment } from '../../../environments/environment';

interface Prueba {
  id: string;
  nombre: string;
  icono: string;
  descripcion: string;
  tiempo: number;
  preguntas: number;
  subpruebas?: SubPrueba[];
}

interface SubPrueba {
  id: string;
  nombre: string;
  descripcion: string;
  ensayos?: EnsayoOption[];
}

interface EnsayoOption {
  id: string;
  nombre: string;
  descripcion: string;
}

type ExamMode = 'real' | 'asistido';

@Component({
  selector: 'app-ensayos-list',
  standalone: true,
  imports: [CommonModule, RouterModule, SettingsModalComponent, ProfileModalComponent, StreakIconComponent],
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
          <a class="nav-item" routerLink="/dashboard">
            <img src="assets/images/iconosParaElementos/P_Inicio.png" alt="Inicio" class="nav-icon-img"/>
            <span class="nav-text">Inicio</span>
          </a>
          <a class="nav-item" routerLink="/ruta">
            <img src="assets/images/iconosParaElementos/P_RutaDeAprendizaje.png" alt="Ruta de Aprendizaje" class="nav-icon-img"/>
            <span class="nav-text">Ruta de Aprendizaje</span>
          </a>

          <a class="nav-item active" routerLink="/ensayos">
            <img src="assets/images/iconosParaElementos/P_EnsayosPaes.png" alt="Ensayos PAES" class="nav-icon-img"/>
            <span class="nav-text">Ensayos PAES</span>
          </a>
          <a class="nav-item" routerLink="/mini-ensayo">
            <img src="assets/images/iconosParaElementos/P_MiniEnsayos.png" alt="Mini Ensayos" class="nav-icon-img"/>
            <span class="nav-text">Mini Ensayos</span>
          </a>
          <a class="nav-item" routerLink="/mente-veloz">
            <img src="assets/images/iconosParaElementos/P_MenteVeloz.png" alt="Mente Veloz" class="nav-icon-img"/>
            <span class="nav-text">Mente Veloz</span>
          </a>

          <div class="sidebar-section-title" (click)="toggleHerramientas()">
            HERRAMIENTAS
            <span class="toggle-icon" [style.transform]="herramientasExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'">▼</span>
          </div>
          <div class="sidebar-sub-items" [class.expanded]="herramientasExpanded" [class.collapsible]="isCollapsible">
            <a class="nav-item" routerLink="/encuentra-tu-carrera">
              <img src="assets/images/iconosParaElementos/P_EnncuentraTuCarrera.png" alt="Encuentra tu Carrera" class="nav-icon-img"/>
              <span class="nav-text">Encuentra tu Carrera</span>
            </a>
            <a class="nav-item" routerLink="/calculadora-nem">
              <img src="assets/images/iconosParaElementos/P_CalculadoraNEM.png" alt="Calculadora NEM" class="nav-icon-img"/>
              <span class="nav-text">Calculadora NEM</span>
            </a>
            <a class="nav-item" routerLink="/recursos">
              <img src="assets/images/iconosParaElementos/P_RecursosAdicionales.png" alt="Recursos Adicionales" class="nav-icon-img"/>
              <span class="nav-text">Recursos Adicionales</span>
            </a>
          </div>
          <!-- Sidebar Promo Card -->
          <div *ngIf="!isProPlan() && !adminService.isAdmin()" class="sidebar-promo-card">
            <img src="assets/images/iconosParaElementos/P_Pro.png" alt="PRO" class="promo-crown"/>
            <h4>Pásate a PRO</h4>
            <p>Explicaciones con IA y Ensayos Ilimitados</p>
            <button class="btn-promo-sidebar">Ver Planes ⚡</button>
          </div>
        </nav>
        
        <div class="sidebar-footer" style="flex-direction: column; gap: 0.5rem; padding: 1.25rem 0.75rem;">
          <a class="nav-item" (click)="showSettingsModal = true">
            <img src="assets/images/iconosParaElementos/P_Configuracion.png" alt="Configuración" class="nav-icon-img nav-icon-img-config"/>
            <span class="nav-text">Configuración</span>
          </a>
          <a class="nav-item logout-btn-sidebar" (click)="confirmLogout()">
            <img src="assets/images/iconosParaElementos/P_CerrarSesion.png" alt="Cerrar Sesión" class="nav-icon-img"/>
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
        <button class="profile-trigger" (click)="showProfileModal = true" style="background:none;border:none;cursor:pointer;padding:0">
          <span class="profile-avatar-wrap">
            <img *ngIf="firestoreService.profileSignal()?.photoURL; else avatarMobileE" [src]="firestoreService.profileSignal()?.photoURL" alt="Foto" class="profile-avatar" style="width:32px;height:32px" [class.avatar-preset]="(firestoreService.profileSignal()?.photoURL || '').includes('assets/images/avatars/')"/>
            <ng-template #avatarMobileE><span class="profile-avatar fallback" style="width:32px;height:32px;font-size:0.9rem">{{ profileInitial() }}</span></ng-template>
          </span>
        </button>
      </div>
      <div class="mobile-overlay" [class.open]="mobileOpen" (click)="mobileOpen = false">
        <div class="mobile-menu" (click)="$event.stopPropagation()">
          <div style="padding: 1.5rem 1rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center;">
            <span class="text-gradient" style="font-size: 1.5rem; font-weight: 900; font-family: var(--font-heading);">EstudiaUni</span>
            <button (click)="mobileOpen=false" style="background: none; border: none; color: rgba(255,255,255,0.7); font-size: 1.75rem; cursor: pointer; line-height: 1;">✕</button>
          </div>
          <nav class="sidebar-nav">
            <a class="nav-item" routerLink="/dashboard" (click)="mobileOpen=false"><img src="assets/images/iconosParaElementos/P_Inicio.png" alt="Inicio" class="nav-icon-img"/><span class="nav-text">Inicio</span></a>
            <a class="nav-item" routerLink="/ruta" (click)="mobileOpen=false"><img src="assets/images/iconosParaElementos/P_RutaDeAprendizaje.png" alt="Ruta de Aprendizaje" class="nav-icon-img"/><span class="nav-text">Ruta de Aprendizaje</span></a>
            <a class="nav-item active" routerLink="/ensayos" (click)="mobileOpen=false"><img src="assets/images/iconosParaElementos/P_EnsayosPaes.png" alt="Ensayos PAES" class="nav-icon-img"/><span class="nav-text">Ensayos PAES</span></a>
            <a class="nav-item" routerLink="/mini-ensayo" (click)="mobileOpen=false"><img src="assets/images/iconosParaElementos/P_MiniEnsayos.png" alt="Mini Ensayos" class="nav-icon-img"/><span class="nav-text">Mini Ensayos</span></a>
            <a class="nav-item" routerLink="/mente-veloz" (click)="mobileOpen=false"><img src="assets/images/iconosParaElementos/P_MenteVeloz.png" alt="Mente Veloz" class="nav-icon-img"/><span class="nav-text">Mente Veloz</span></a>
            <div class="sidebar-section-title">HERRAMIENTAS</div>
            <a class="nav-item" routerLink="/encuentra-tu-carrera" (click)="mobileOpen=false"><img src="assets/images/iconosParaElementos/P_EnncuentraTuCarrera.png" alt="Encuentra tu Carrera" class="nav-icon-img"/><span class="nav-text">Encuentra tu Carrera</span></a>
            <a class="nav-item" routerLink="/calculadora-nem" (click)="mobileOpen=false"><img src="assets/images/iconosParaElementos/P_CalculadoraNEM.png" alt="Calculadora NEM" class="nav-icon-img"/><span class="nav-text">Calculadora NEM</span></a>
            <a class="nav-item" routerLink="/recursos" (click)="mobileOpen=false"><img src="assets/images/iconosParaElementos/P_RecursosAdicionales.png" alt="Recursos Adicionales" class="nav-icon-img"/><span class="nav-text">Recursos Adicionales</span></a>
          </nav>
          <div style="padding: 1rem; border-top: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; gap: 0.5rem;">
            <a class="nav-item" (click)="showSettingsModal = true; mobileOpen=false"><img src="assets/images/iconosParaElementos/P_Configuracion.png" alt="Configuración" class="nav-icon-img nav-icon-img-config"/><span class="nav-text">Configuración</span></a>
            <a class="nav-item logout-btn-sidebar" (click)="confirmLogout(); mobileOpen=false"><img src="assets/images/iconosParaElementos/P_CerrarSesion.png" alt="Cerrar Sesión" class="nav-icon-img"/><span class="nav-text">Cerrar Sesión</span></a>
          </div>
        </div>
      </div>

      <!-- MAIN CONTENT -->
      <main class="main-content animate-fade-in-down">
        <!-- HEADER -->
        <header class="dashboard-header">
          <div class="header-welcome-text">
            <h1 class="header-greeting"><span class="text-gradient">Ensayos PAES</span></h1>
            <p class="subtitle" style="color: rgba(255,255,255,0.7); font-size: 0.95rem; margin: 0; font-weight: 500;">Realiza ensayos completos y simulacros bajo condiciones reales</p>
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

        <div class="dashboard-body">
          <!-- TOP ROW: COUNTDOWN & ACTIVE EXAM WIDGET -->
          <div class="sim-top-row" style="display: flex; gap: 1.5rem; align-items: center; justify-content: space-between; flex-wrap: wrap; margin-bottom: 2rem;">
            <!-- COUNTDOWN WIDGET -->
            <div class="countdown-row" style="background: #fff; padding: 0.6rem 1.25rem; border-radius: 12px; width: fit-content; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 2px solid rgba(133,92,214,0.3); display: flex; align-items: center; gap: 1rem;">
              <span class="countdown-label" style="font-size: 0.85rem; font-weight: 700; color: #64748b;">⏳ {{ nextExamLabel }}:</span>
              <div class="countdown-timer" style="display: flex; gap: 0.75rem;">
                <div class="time-unit" style="display: flex; align-items: baseline; gap: 2px;"><span style="font-size: 1rem; font-weight: 800; color: var(--accent-primary); min-width: 20px; text-align: center;">{{ countdown.days }}</span><label style="font-size: 0.75rem; font-weight: 600; color: #94a3b8;">d</label></div>
                <div class="time-unit" style="display: flex; align-items: baseline; gap: 2px;"><span style="font-size: 1rem; font-weight: 800; color: var(--accent-primary); min-width: 20px; text-align: center;">{{ countdown.hours }}</span><label style="font-size: 0.75rem; font-weight: 600; color: #94a3b8;">h</label></div>
                <div class="time-unit" style="display: flex; align-items: baseline; gap: 2px;"><span style="font-size: 1rem; font-weight: 800; color: var(--accent-primary); min-width: 20px; text-align: center;">{{ countdown.minutes }}</span><label style="font-size: 0.75rem; font-weight: 600; color: #94a3b8;">m</label></div>
              </div>
            </div>

            <!-- TEMARIO BADGE -->
            <div class="temario-badge" style="background: rgba(34, 197, 94, 0.1); color: #22c55e; border: 2px solid rgba(34, 197, 94, 0.3); padding: 0.6rem 1.25rem; border-radius: 99px; font-size: 0.85rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; margin-right: auto;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg> 
              Actualizado con temario PAES oficial 2026
            </div>

            <!-- ACTIVE EXAM WIDGET -->
            <div class="active-exam-widget glass-card" *ngIf="activeProgress" style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1.25rem; border-radius: 12px; border: 2px solid var(--accent-primary); background: rgba(133,92,214,0.05);">
              <div class="widget-info">
                <span class="widget-label" style="font-size: 0.7rem; font-weight: 800; color: var(--accent-primary); text-transform: uppercase;">PENDIENTE</span>
                <h4 class="widget-title" style="margin: 0; font-size: 0.95rem; font-weight: 700; color: var(--text-primary);">{{ activeProgress.examName.startsWith('Ensayo') ? activeProgress.examName : 'Ensayo ' + activeProgress.examName }}</h4>
              </div>
              <button class="btn-resume" (click)="resumeActiveIntento()" style="background: var(--accent-primary); color: #fff; border: none; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 700; cursor: pointer;">
                Continuar →
              </button>
              <button class="btn-widget-discard" (click)="discardActiveProgress()" title="Eliminar progreso guardado" style="background: transparent; border: none; color: #ef4444; font-size: 1.25rem; cursor: pointer; padding: 0 0.25rem;">
                ×
              </button>
            </div>

            <!-- COMPACT LAST ENSAYO BUTTON WIDGET -->
            <button class="last-ensayo-compact-btn glass-card animate-fade-in" *ngIf="getLastCompletedEnsayo() as lastEnsayo" (click)="goToLastEnsayoReview(lastEnsayo)" style="background: rgba(124,58,237,0.06); border: 1.5px solid rgba(124,58,237,0.3); border-radius: 99px; padding: 0.45rem 1.1rem; display: flex; align-items: center; gap: 0.65rem; cursor: pointer; transition: all 0.2s;">
              <span style="font-size: 1rem;">📊</span>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 0.82rem; font-weight: 800; color: #0f172a;">Último Ensayo</span>
                <span *ngIf="!isProPlan() && isResultsLockedForLast()" style="background: rgba(245,158,11,0.2); color: #b45309; font-size: 0.72rem; font-weight: 800; padding: 0.15rem 0.55rem; border-radius: 99px;">
                  ⏳ {{ getResultsUnlockCountdown() }}
                </span>
                <span *ngIf="isProPlan() || !isResultsLockedForLast()" style="background: rgba(16,185,129,0.2); color: #047857; font-size: 0.72rem; font-weight: 800; padding: 0.15rem 0.55rem; border-radius: 99px;">
                  Ver Pauta
                </span>
              </div>
              <span style="font-size: 0.85rem; font-weight: 800; color: #7c3aed;">→</span>
            </button>

            <!-- DEV SIMULATE TIME BUTTON (hidden in production builds) -->
            <button *ngIf="!isProduction" class="dev-simulate-btn animate-fade-in" (click)="devResetTimeLimits()" style="background: rgba(239, 68, 68, 0.08); border: 1.5px dashed rgba(239, 68, 68, 0.4); color: #ef4444; border-radius: 99px; padding: 0.45rem 0.85rem; font-size: 0.78rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; margin-left: auto;" title="Boton de prueba para simular el paso de 50h">
              🧪 [DEV] Simular paso de tiempo (+50h)
            </button>
          </div>

          <!-- PRUEBAS -->
          <div class="pruebas-section">
          <div class="pruebas-grid">
            <button
              *ngFor="let prueba of pruebas"
              type="button"
              class="prueba-card"
              (click)="seleccionarPrueba(prueba)"
              [class.prueba-card-selected]="pruebaSeleccionada?.id === prueba.id">
              <div class="card-icon">
                <img *ngIf="isImagePath(prueba.icono)" [src]="prueba.icono" [alt]="prueba.nombre"/>
                <span *ngIf="!isImagePath(prueba.icono)">{{ prueba.icono }}</span>
              </div>
              <div class="card-header">
                <h3 class="card-title">{{ prueba.nombre }}</h3>
                <p class="card-desc">{{ prueba.descripcion }}</p>
              </div>
            </button>
          </div>

        </div>
        </div>
      </main>
    </div>
          <div *ngIf="pruebaSeleccionada" class="modal-preparacion" (click)="cerrarSeleccion()">
            <div class="modal-content glass-card" (click)="$event.stopPropagation()" (scroll)="onModalScroll($event)">
              <button class="modal-close" (click)="cerrarSeleccion()">×</button>

              <div class="modal-icon">
                <img *ngIf="isImagePath(pruebaSeleccionada.icono)" [src]="pruebaSeleccionada.icono" [alt]="pruebaSeleccionada.nombre" style="width: 80px; height: 80px; object-fit: contain;"/>
                <span *ngIf="!isImagePath(pruebaSeleccionada.icono)">{{ pruebaSeleccionada.icono }}</span>
              </div>
              <h2 class="modal-title">¿Listo para iniciar {{ getNombreSeleccionado() }}?</h2>

              <div class="modal-message">
                
                <p class="message-subtext">
                  Ponte cómodo, elimina distracciones y asegúrate de contar con el tiempo completo.
                </p>
              </div>

              <!-- FIRST LEVEL SELECTION (Areas for Sciences, Essays for others) -->
              <div *ngIf="pruebaSeleccionada.subpruebas?.length && pruebaSeleccionada.id !== 'lenguaje'" class="subpruebas-section">
                <p class="subpruebas-title">
                  {{ pruebaSeleccionada.id === 'ciencias' ? 'Selecciona tu área:' : 'Selecciona el ensayo:' }}
                </p>
                <div class="subpruebas-grid">
                  <button
                    *ngFor="let sub of pruebaSeleccionada.subpruebas"
                    type="button"
                    class="subprueba-card"
                    [class.pro-locked-card]="pruebaSeleccionada.id !== 'ciencias' && !isEssayAvailableForFree(sub.id)"
                    (click)="seleccionarSubprueba(sub)"
                    [class.subprueba-card-selected]="subPruebaSeleccionada?.id === sub.id"
                    [class.perfect-gold]="isPerfect(sub.id)">
                    <span class="subprueba-name">
                      {{ sub.nombre }}
                      <span class="gold-badge" *ngIf="isPerfect(sub.id)">🏆</span>
                      <span class="pro-lock-badge" *ngIf="pruebaSeleccionada.id !== 'ciencias' && !isEssayAvailableForFree(sub.id)">🔒 PRO 👑</span>
                    </span>
                    <span class="subprueba-desc">{{ sub.descripcion }}</span>
                  </button>
                </div>
              </div>

              <div *ngIf="subPruebaSeleccionada?.ensayos?.length" class="subpruebas-section" style="margin-top: 1.5rem;">
                <p class="subpruebas-title">Selecciona el ensayo:</p>
                <div class="subpruebas-grid">
                  <button
                    *ngFor="let ensayo of subPruebaSeleccionada?.ensayos"
                    type="button"
                    class="subprueba-card"
                    [class.pro-locked-card]="!isEssayAvailableForFree(ensayo.id)"
                    (click)="seleccionarEnsayo(ensayo)"
                    [class.subprueba-card-selected]="ensayoSeleccionado?.id === ensayo.id"
                    [class.perfect-gold]="isPerfect(ensayo.id)">
                    <span class="subprueba-name">
                      {{ ensayo.nombre }}
                      <span class="gold-badge" *ngIf="isPerfect(ensayo.id)">🏆</span>
                      <span class="pro-lock-badge" *ngIf="!isEssayAvailableForFree(ensayo.id)">🔒 PRO 👑</span>
                    </span>
                    <span class="subprueba-desc">{{ ensayo.descripcion }}</span>
                  </button>
                </div>
              </div>

              <div class="scroll-indicator" *ngIf="canStart && !scrolledToBottom">
                <span>Desliza hacia abajo para continuar</span>
                <span class="scroll-arrow">↓</span>
              </div>

              <!-- COOLDOWN WARNING BANNER FOR FREE USERS -->
              <div class="cooldown-warning-banner animate-fade-in" *ngIf="isCooldownActive()" style="background: rgba(245,158,11,0.1); border: 2px solid rgba(245,158,11,0.3); padding: 1rem 1.25rem; border-radius: 12px; margin: 1.5rem 0; display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <span style="font-size: 1.5rem;">⏳</span>
                  <div>
                    <h4 style="margin: 0; font-size: 0.95rem; font-weight: 800; color: #b45309;">Cooldown de 48 horas Activo (Plan Básico)</h4>
                    <p style="margin: 0.2rem 0 0; font-size: 0.85rem; color: #78350f;">Tu próximo ensayo estará disponible en <strong>{{ getCooldownFormatted() }}</strong>.</p>
                  </div>
                </div>
                <button type="button" (click)="paymentService.openPricingModal()" style="background: linear-gradient(135deg,#7c3aed,#5b21b6); color: #fff; border: none; padding: 0.6rem 1.1rem; border-radius: 8px; font-weight: 800; font-size: 0.85rem; cursor: pointer; white-space: nowrap;">
                  Desbloquear con PRO 👑
                </button>
              </div>

              <div class="prueba-detalles" *ngIf="canStart">
                <div class="detalle-item">
                  <span class="detalle-label">Prueba</span>
                  <span class="detalle-valor">{{ getNombreSeleccionado() }}</span>
                </div>
                <div class="detalle-item" *ngIf="getBestScoreForCurrent() as record">
                  <span class="detalle-label">Récord Personal</span>
                  <span class="detalle-valor" [class.gold-text]="isPerfect(getCurrentEnsayoId())">
                    {{ record.correctAnswers }}/{{ record.totalQuestions }} <span class="score-percent">({{ ((record.correctAnswers / record.totalQuestions) * 100).toFixed(0) }}%)</span>
                  </span>
                  <span class="detalle-subtext" *ngIf="record.timestamp">Logrado el {{ record.timestamp | date:'dd/MM/yyyy' }}</span>
                </div>
                <div class="detalle-item" *ngIf="getAttemptCount(getCurrentEnsayoId()) > 0">
                  <span class="detalle-label">Intentos Realizados</span>
                  <span class="detalle-valor">{{ getAttemptCount(getCurrentEnsayoId()) }}</span>
                </div>
                <div class="detalle-item">
                  <span class="detalle-label">Preguntas</span>
                  <span class="detalle-valor">{{ pruebaSeleccionada.preguntas }}</span>
                </div>
                <div class="detalle-item">
                  <span class="detalle-label">Tiempo</span>
                  <span class="detalle-valor">{{ pruebaSeleccionada.tiempo }} min</span>
                </div>
                <div class="detalle-desc" *ngIf="getSelectedDescription()">
                  {{ getSelectedDescription() }}
                </div>
              </div>

              <div class="warning-note" *ngIf="canStart">
                <span class="warning-icon">⚠️</span>
                <p class="warning-text">
                  Si faltan preguntas es porque fueron <strong>retiradas oficialmente</strong> de este ensayo y no se consideran en la evaluación.
                </p>
              </div>

              <!-- MODE SELECTION GRID -->
              <div class="modes-selection" *ngIf="canStart">
                <p class="modes-title">Elige tu modalidad:</p>
                <div class="modes-grid">
                  <div class="mode-card" 
                       [class.mode-selected]="selectedMode === 'real'"
                       (click)="selectedMode = 'real'">
                    <div class="mode-header">
                      <span class="mode-icon">⏱️</span>
                      <span class="mode-name">Ensayo Real</span>
                    </div>
                    <p class="mode-desc">Simulación exacta. Sin ayudas, cronómetro estricto y resultados finales para medir tu nivel real.</p>
                  </div>

                  <div class="mode-card" 
                       [class.mode-selected]="selectedMode === 'asistido'"
                       (click)="selectedMode = 'asistido'">
                    <div class="mode-header">
                      <span class="mode-icon">🐙</span>
                      <span class="mode-name">Ensayo Asistido</span>
                    </div>
                    <p class="mode-desc">Aprende mientras practicas. Acceso a Foco, tu Pulpo Tutor, para resolver dudas. Puedes pausar, salir y tu progreso quedará guardado.</p>
                  </div>
                </div>
              </div>

              <div class="modal-actions" *ngIf="canStart">
                <button class="btn btn-primary btn-start" 
                        (click)="iniciarPrueba(selectedMode!)" 
                        [disabled]="!selectedMode">
                  {{ selectedMode ? 'Comenzar Ensayo ' + (selectedMode === 'asistido' ? 'Asistido' : 'Real') : 'Selecciona una modalidad' }}
                </button>
              </div>
            </div>
          </div>
    <app-settings-modal *ngIf="showSettingsModal" (close)="showSettingsModal = false"></app-settings-modal>
    <app-profile-modal *ngIf="showProfileModal" (close)="onProfileModalClose()"></app-profile-modal>

    <!-- CUSTOM LOGOUT CONFIRMATION -->
    <div class="modal-overlay logout-confirm-overlay" *ngIf="showLogoutConfirm" (click)="showLogoutConfirm = false">
      <div class="modal-container glass logout-confirm-modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Cerrar Sesión</h2>
          <button class="logout-close-btn" (click)="showLogoutConfirm = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="confirm-content">
            <img src="assets/images/iconosParaElementos/P_CerrarSesion.png" alt="Cerrar Sesion" class="confirm-icon confirm-icon-img"/>
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

    <!-- OVERWRITE PROGRESS MODAL -->
    <div class="modal-overlay" *ngIf="showOverwriteModal" (click)="showOverwriteModal = false">
      <div class="modal-content glass-card" (click)="$event.stopPropagation()">
        <div class="modal-icon">⚠️</div>
        <h2 class="modal-title">¿Deseas empezar de cero?</h2>
        <div class="modal-message">
          <p class="message-text">Ya tienes un progreso guardado en <strong>"{{ activeProgress?.examName }}"</strong>.</p>
          <p class="message-subtext">Si inicias este nuevo ensayo asistido, tu progreso anterior se borrará permanentemente y solo se guardará el nuevo. ¿Deseas continuar?</p>
        </div>
        <div class="modal-actions" style="margin-top: 1rem;">
          <button class="btn btn-outline" (click)="showOverwriteModal = false">Cancelar</button>
          <button class="btn btn-primary" (click)="confirmOverwrite()">Empezar de cero</button>
        </div>
      </div>
    </div>

    <!-- CUSTOM COOLDOWN MODAL -->
    <div class="modal-overlay animate-fade-in" *ngIf="showCooldownModal" (click)="showCooldownModal = false" style="z-index: 99999;">
      <div class="modal-card animate-scale-up" (click)="$event.stopPropagation()" style="background: #ffffff; padding: 2.5rem 2rem; border-radius: 24px; max-width: 480px; width: 90%; text-align: center; box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25); border: 1px solid rgba(15, 23, 42, 0.08);">
        <div style="font-size: 3.5rem; margin-bottom: 0.75rem;">⏳</div>
        <h2 style="font-size: 1.6rem; font-weight: 900; color: #0f172a !important; margin: 0 0 0.4rem;">Cooldown del Plan Básico</h2>
        <span style="background: rgba(245,158,11,0.15); color: #b45309; padding: 0.35rem 0.85rem; border-radius: 99px; font-weight: 800; font-size: 0.8rem; display: inline-block; margin-bottom: 1.25rem;">
          1 Ensayo cada 48 Horas
        </span>

        <p style="color: #475569 !important; font-size: 0.95rem; line-height: 1.6; margin: 0 0 1.5rem; text-align: center; font-weight: 600;">
          Has completado un ensayo recientemente. En el Plan Básico debes esperar 48 horas entre ensayos. Tu próximo ensayo gratuito estará disponible en:
        </p>

        <div style="background: rgba(245,158,11,0.08); border: 2px solid rgba(245,158,11,0.3); padding: 1.2rem; border-radius: 16px; margin-bottom: 1.75rem;">
          <span style="font-size: 0.8rem; font-weight: 700; color: #b45309; text-transform: uppercase;">Disponible en:</span>
          <div style="font-size: 2rem; font-weight: 900; color: #d97706; font-family: monospace; margin-top: 0.25rem;">
            {{ getCooldownFormatted() }}
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <button (click)="showCooldownModal = false; paymentService.openPricingModal()" style="background: linear-gradient(135deg,#7c3aed,#5b21b6); color: #fff; border: none; padding: 0.9rem 1.25rem; border-radius: 12px; font-weight: 800; font-size: 0.95rem; cursor: pointer; box-shadow: 0 4px 14px rgba(124,58,237,0.3);">
            🚀 Desbloquear Ensayos Ilimitados con PRO
          </button>
          <button (click)="showCooldownModal = false" style="background: transparent; color: #64748b; border: 1.5px solid #cbd5e1; padding: 0.75rem; border-radius: 12px; font-weight: 700; font-size: 0.9rem; cursor: pointer;">
            Entendido
          </button>
          <button *ngIf="!isProduction" (click)="devResetTimeLimits()" style="background: rgba(239, 68, 68, 0.08); border: 1.5px dashed rgba(239, 68, 68, 0.4); color: #ef4444; padding: 0.65rem; border-radius: 12px; font-weight: 800; font-size: 0.8rem; cursor: pointer; margin-top: 0.5rem;">
            🧪 [DEV] Simular paso de tiempo (Saltar Cooldown 48h)
          </button>
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
      background: var(--bg-color);
      color: var(--text-primary);
    }
    .pro-lock-badge {
      background: rgba(124, 58, 237, 0.15);
      color: #7c3aed;
      font-size: 0.72rem;
      font-weight: 800;
      padding: 0.2rem 0.5rem;
      border-radius: 6px;
      margin-left: 0.5rem;
      display: inline-flex;
      align-items: center;
      gap: 0.2rem;
    }
    .subprueba-card.pro-locked-card {
      border-color: rgba(124, 58, 237, 0.25);
    }
    .ensayos-container { display: flex; min-height: 100vh; }
    .text-gradient { background: var(--gradient-brand); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    
    /* SIDEBAR */
    .sidebar { 
      width: 260px; 
      background: rgba(13, 15, 23, 0.95); 
      border-right: 1px solid rgba(255,255,255,0.1); 
      display: flex; 
      flex-direction: column; 
      position: fixed; 
      top: 0; 
      left: 0; 
      height: 100vh; 
      z-index: 100; 
    }
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
    .nav-item { 
      display: flex; 
      align-items: center; 
      gap: 0.85rem; 
      padding: 0.9rem 1.1rem; 
      border-radius: 12px; 
      color: #ffffff; 
      text-decoration: none; 
      transition: all 0.2s; 
      cursor: pointer; 
      font-size: 1.05rem;
      font-weight: 500;
    }
    .nav-item:hover { 
      background: rgba(255, 255, 255, 0.12); 
      color: #fff; 
      transform: translateX(4px);
    }
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
    .nav-icon { 
      font-size: 1.35rem; 
      width: 32px; 
      display: flex;
      align-items: center;
      justify-content: center;
    }
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
    .logout-btn-sidebar { color: #fca5a5 !important; opacity: 0.8; }
    .logout-btn-sidebar:hover { background: rgba(239, 68, 68, 0.15) !important; color: #ef4444 !important; opacity: 1; }
    .logout-confirm-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: grid; place-items: center; z-index: 100000 !important; padding: 1.5rem; animation: fadeIn 0.2s ease; }
    .logout-confirm-modal { max-width: 420px !important; background: rgba(255,255,255,0.95); border: 2px solid var(--glass-border); border-radius: 24px; box-shadow: 0 20px 50px rgba(0,0,0,0.2); width: 100%; overflow: hidden; }
    .modal-header { padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--glass-border); }
    .modal-header h2 { margin: 0; font-size: 1.25rem; font-weight: 800; color: var(--text-primary); }
    .close-btn { background: none; border: none; font-size: 1.75rem; color: var(--text-muted); cursor: pointer; line-height: 1; transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), color 0.2s ease; }
    .close-btn:hover { transform: rotate(90deg) scale(1.1); color: #ef4444 !important; }
    .modal-body { padding: 1.5rem; }
    .confirm-content { text-align: center; padding: 1rem 0; }
    .confirm-icon { font-size: 3.5rem; margin-bottom: 1rem; }
    .confirm-icon-img { width: 88px; height: 88px; object-fit: contain; }
    .confirm-content h3 { margin: 0 0 0.5rem; font-size: 1.3rem; }
    .confirm-content p { color: var(--text-secondary); margin: 0; }
    .modal-footer { padding: 1.5rem; border-top: 1px solid var(--glass-border); }
    .confirm-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .btn-secondary-modal { padding: 0.85rem; border-radius: 12px; border: 2px solid var(--glass-border); background: transparent; color: var(--text-primary); font-weight: 700; cursor: pointer; transition: all 0.2s; }
    .btn-secondary-modal:hover { background: var(--bg-secondary); }
    .btn-primary-modal { width: 100%; padding: 0.85rem; border-radius: 12px; background: var(--accent-primary); color: white; border: none; font-weight: 700; cursor: pointer; transition: all 0.2s; }
    .btn-primary-modal:hover { filter: brightness(1.1); transform: translateY(-2px); }
    .btn-danger { background: #ef4444 !important; box-shadow: 0 4px 12px rgba(239,68,68,0.25) !important; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    /* MAIN CONTENT */
    .main-content { 
      flex: 1; 
      margin-left: 260px; 
    }
    .header-back {
      margin-bottom: 0;
    }
    .btn-back {
      background: none;
      border: none;
      color: var(--text-secondary);
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.2s;
      font-weight: 600;
    }
    .btn-back:hover {
      color: var(--accent-primary);
      transform: translateX(-4px);
    }
    .title {
      font-family: var(--font-heading);
      font-size: 2.8rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      letter-spacing: -0.03em;
    }
    .subtitle {
      color: var(--text-secondary);
      font-size: 1.15rem;
      font-weight: 500;
    }

    /* PRUEBAS GRID */
    .pruebas-section {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .pruebas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.5rem;
    }
    @media (min-width: 1025px) {
      .pruebas-grid {
        grid-template-columns: repeat(6, 1fr);
      }
      .pruebas-grid .prueba-card:nth-child(1) { grid-column: 1 / 3; }
      .pruebas-grid .prueba-card:nth-child(2) { grid-column: 3 / 5; }
      .pruebas-grid .prueba-card:nth-child(3) { grid-column: 5 / 7; }
      .pruebas-grid .prueba-card:nth-child(4) { grid-column: 2 / 4; }
      .pruebas-grid .prueba-card:nth-child(5) { grid-column: 4 / 6; }
    }

    /* PRUEBA CARD */
    .prueba-card {
      text-align: center;
      background: #ffffff;
      border: 2px solid var(--glass-border);
      border-radius: 20px;
      padding: 2.5rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      position: relative;
      overflow: hidden;
      color: inherit;
      box-shadow: var(--shadow);
    }
    .prueba-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), transparent);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .prueba-card:hover {
      border-color: rgba(133,92,214,0.4);
      box-shadow: var(--shadow-md);
      transform: translateY(-6px);
    }
    .prueba-card:hover::before {
      opacity: 1;
    }
    .prueba-card-selected {
      border-color: var(--accent-primary);
      background: rgba(133, 92, 214, 0.05);
      box-shadow: 0 12px 40px rgba(133, 92, 214, 0.15);
    }

    .card-icon {
      font-size: 3rem;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100px;
      height: 100px;
    }
    .card-icon img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .card-header {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    .card-title {
      font-size: 1.75rem;
      font-weight: 900;
      margin-bottom: 0.5rem;
      color: #0f172a;
      letter-spacing: -0.02em;
      text-align: center;
    }
    .card-desc {
      font-size: 1.1rem;
      color: #64748b;
      line-height: 1.5;
      font-weight: 500;
      text-align: center;
    }

    .card-meta {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .meta-badge {
      background: var(--bg-secondary);
      padding: 0.6rem 1.1rem;
      border-radius: 12px;
      font-size: 0.9rem;
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border: 1px solid var(--glass-border);
      font-weight: 700;
    }
    .meta-icon {
      font-size: 1rem;
    }

    /* MODAL PREPARACIÓN */
    .modal-preparacion {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.65);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999 !important;
      padding: 1.5rem;
      overflow-y: auto;
      animation: fadeIn 0.25s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .modal-content {
      background: #ffffff;
      border: 2px solid rgba(0,0,0,0.06);
      border-radius: 20px;
      padding: 2.5rem 1.5rem 1.5rem;
      max-width: 560px;
      width: 100%;
      max-height: 88vh;
      overflow-y: auto;
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      animation: slideUp 0.3s ease;
      margin: auto;
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .modal-close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: rgba(0, 0, 0, 0.08);
      border: none;
      width: 36px;
      height: 36px;
      border-radius: 10px;
      font-size: 1.3rem;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      line-height: 1;
    }
    .modal-close:hover {
      background: rgba(0, 0, 0, 0.1);
      color: var(--text-primary);
    }
    .modal-icon {
      font-size: 3.5rem;
      text-align: center;
    }
    .modal-title {
      font-size: 1.7rem;
      font-weight: 800;
      text-align: center;
      color: var(--text-primary);
    }
    .title-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.25rem;
    }
    .status-pill {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(34, 197, 94, 0.1);
      color: #16a34a;
      padding: 0.35rem 0.85rem;
      border-radius: 100px;
      font-size: 0.75rem;
      font-weight: 700;
      border: 1px solid rgba(34, 197, 94, 0.2);
    }
    .status-dot {
      width: 8px;
      height: 8px;
      background: #22c55e;
      border-radius: 50%;
      box-shadow: 0 0 8px #22c55e;
      animation: pulseDot 2s infinite;
    }
    @keyframes pulseDot {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.3); opacity: 0.7; }
      100% { transform: scale(1); opacity: 1; }
    }
    .scroll-indicator {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      margin: 1rem auto;
      color: var(--accent-primary);
      font-weight: 800;
      font-size: 0.9rem;
      animation: fadeIn 0.5s ease;
      position: sticky;
      bottom: 20px;
      z-index: 50;
      width: fit-content;
      text-shadow: 0 1px 3px rgba(255, 255, 255, 1), 0 0 8px rgba(255,255,255,0.9);
    }
    .scroll-arrow {
      font-size: 1.5rem;
      animation: bounceDown 2s infinite;
      line-height: 1;
    }
    @keyframes bounceDown {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(8px); }
      60% { transform: translateY(4px); }
    }
    .countdown-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: #fff;
      padding: 0.6rem 1.25rem;
      border-radius: 12px;
      width: fit-content;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
      border: 2px solid rgba(133,92,214,0.3);
    }
    .countdown-label {
      font-size: 0.85rem;
      font-weight: 700;
      color: #64748b;
    }
    .countdown-timer {
      display: flex;
      gap: 0.75rem;
    }
    .time-unit {
      display: flex;
      align-items: baseline;
      gap: 2px;
    }
    .time-unit span {
      font-size: 1rem;
      font-weight: 800;
      color: var(--accent-primary);
      min-width: 20px;
      text-align: center;
    }
    .time-unit label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #94a3b8;
    }
    .modal-message {
      background: rgba(133, 92, 214, 0.1);
      border-left: 4px solid var(--accent-primary);
      padding: 1rem 1.25rem;
      border-radius: 10px;
    }
    .message-text {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }
    .message-subtext {
      font-size: 0.95rem;
      color: var(--text-secondary);
      line-height: 1.6;
    }
    .subpruebas-section {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .subpruebas-title {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text-primary);
    }
    .subpruebas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 0.75rem;
    }
    .subprueba-card {
      padding: 1.15rem;
      border-radius: 16px;
      background: #fff;
      border: 2px solid rgba(133, 92, 214, 0.12);
      text-align: left;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      position: relative;
      overflow: hidden;
    }
    .subprueba-card:hover {
      transform: translateY(-4px) scale(1.02);
      border-color: rgba(133, 92, 214, 0.4);
      background: rgba(133, 92, 214, 0.08);
      box-shadow: 0 8px 25px rgba(133, 92, 214, 0.12);
    }
    .subprueba-card-selected {
      border-color: var(--accent-primary);
      box-shadow: 0 4px 12px rgba(133, 92, 214, 0.15);
      background: rgba(133, 92, 214, 0.1);
    }
    .subprueba-name {
      font-weight: 700;
      color: var(--text-primary);
    }
    .subprueba-desc {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }
    .prueba-detalles {
      background: rgba(0, 0, 0, 0.02);
      border: 1px solid rgba(0, 0, 0, 0.06);
      border-radius: 12px;
      padding: 1.25rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 1.25rem;
    }
    .detalle-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .detalle-label {
      font-size: 0.75rem;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 700;
    }
    .detalle-valor {
      font-size: 1rem;
      font-weight: 700;
      color: var(--accent-primary);
    }
    .detalle-subtext {
      font-size: 0.7rem;
      color: var(--text-secondary);
      margin-top: 2px;
      font-weight: 500;
    }
    .detalle-desc {
      grid-column: 1 / -1;
      font-size: 0.9rem;
      color: var(--text-secondary);
      line-height: 1.5;
      padding-top: 0.5rem;
      border-top: 1px dashed rgba(0,0,0,0.1);
    }
    .warning-note {
      background: #fffbeb;
      border: 1px solid #fef3c7;
      border-radius: 10px;
      padding: 0.75rem 1rem;
      display: flex;
      gap: 0.75rem;
      margin-top: 1rem;
    }
    .warning-icon { font-size: 1.2rem; }
    .warning-text {
      font-size: 0.85rem;
      color: #92400e;
      line-height: 1.4;
    }
    .btn {
      padding: 0.85rem 1.5rem;
      border-radius: 12px;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: none;
      width: 100%;
    }
    .btn-start {
      margin-top: 1rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .modes-selection {
      margin-top: 1.5rem;
      text-align: left;
    }
    .modes-title {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.75rem;
    }
    .modes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }
    .mode-card {
      padding: 1.25rem;
      border-radius: 16px;
      background: rgba(0, 0, 0, 0.02);
      border: 2px solid transparent;
      cursor: pointer;
      transition: all 0.2s;
    }
    .mode-card:hover {
      background: rgba(133, 92, 214, 0.05);
      border-color: rgba(133, 92, 214, 0.2);
    }
    .mode-selected {
      background: #fff !important;
      border-color: var(--accent-primary) !important;
      box-shadow: 0 10px 25px rgba(133, 92, 214, 0.15);
    }
    .perfect-gold {
      background: linear-gradient(135deg, #fffcf0, #fff9db) !important;
      border-color: #fcd34d !important;
      box-shadow: 0 4px 15px rgba(251, 191, 36, 0.2);
    }
    .perfect-gold:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow: 0 8px 25px rgba(251, 191, 36, 0.35);
      border-color: #fbbf24 !important;
    }
    .perfect-gold.subprueba-card-selected {
      border-color: #d97706 !important;
      border-width: 2.5px;
      background: linear-gradient(135deg, #fff9db, #fff3bf) !important;
      box-shadow: 0 10px 30px rgba(217, 119, 6, 0.25);
    }
    .perfect-gold .subprueba-name { color: #b45309 !important; }
    .gold-badge { font-size: 0.9rem; margin-left: 4px; }
    .gold-text { color: #d97706 !important; font-weight: 800; }
    .score-percent { font-size: 0.85rem; opacity: 0.8; font-weight: 600; }
    .mode-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
    }
    .mode-icon { font-size: 1.5rem; }
    .mode-name {
      font-weight: 800;
      font-size: 1rem;
      color: var(--text-primary);
    }
    .mode-desc {
      font-size: 0.85rem;
      color: var(--text-secondary);
      line-height: 1.5;
    }
    .btn-primary {
      background: var(--accent-primary);
      color: #fff;
      box-shadow: 0 4px 0 #6b46b8;
    }
    .btn:disabled, .btn-outline:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }
    /* ACTIVE EXAM WIDGET */
    .header-center {
      flex: 1;
      display: flex;
      justify-content: center;
      padding: 0 2rem;
    }
    .active-exam-widget {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.65rem 1.15rem;
      border-radius: 16px;
      background: linear-gradient(135deg, #f8fafc, #f1f5f9);
      border: 1px solid rgba(133, 92, 214, 0.15);
      animation: fadeInWidget 0.5s ease;
      max-width: 520px;
      width: 100%;
    }
    .widget-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      min-width: 0; /* Crucial for text-overflow: ellipsis in flexbox */
    }
    .widget-label {
      font-size: 0.7rem;
      font-weight: 800;
      color: var(--accent-primary);
      letter-spacing: 1px;
    }
    .widget-title {
      font-size: 0.85rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
      line-height: 1.2;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .btn-resume {
      background: var(--accent-primary);
      color: #fff;
      border: none;
      padding: 0.45rem 0.9rem;
      border-radius: 10px;
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 12px rgba(133, 92, 214, 0.2);
    }
    .btn-resume:hover {
      transform: translateX(3px);
      background: #7349c2;
    }
    .btn-widget-discard {
      background: none;
      border: 1px solid rgba(0,0,0,0.1);
      color: #94a3b8;
      width: 28px;
      height: 28px;
      border-radius: 8px;
      font-size: 1.1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      flex-shrink: 0;
      line-height: 1;
    }
    .btn-widget-discard:hover {
      background: rgba(239, 68, 68, 0.1);
      border-color: #ef4444;
      color: #ef4444;
    }
    @keyframes fadeInWidget {
      from { opacity: 0; transform: translateY(-5px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100000 !important;
      backdrop-filter: blur(4px);
      animation: fadeInOverlay 0.3s ease;
    }
    @keyframes fadeInOverlay {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .btn-outline {
      background: #ffffff;
      border: 2px solid rgba(0,0,0,0.06);
      color: var(--text-primary);
    }
    .btn-outline:hover {
      border-color: rgba(0,0,0,0.15);
      background: rgba(0, 0, 0, 0.02);
    }
    .glass-card {
      background: #ffffff;
      border: 2px solid var(--glass-border);
      box-shadow: var(--shadow-lg);
    }

    /* MOBILE HEADER */
    .mobile-header { display: none; position: fixed; top: 0; left: 0; right: 0; height: 60px; background: rgba(13,15,23,0.99); border-bottom: 1px solid rgba(255,255,255,0.12); padding: 0 1rem; align-items: center; gap: 0.75rem; z-index: 101; }
    .mobile-menu-btn { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #fff; cursor: pointer; padding: 0.5rem 0.65rem; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.2s; }
    .mobile-menu-btn:hover { background: rgba(255,255,255,0.15); }
    .mobile-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.65); backdrop-filter: blur(6px); z-index: 200; }
    .mobile-overlay.open { display: block; }
    .mobile-menu { position: fixed; top: 0; left: 0; width: 290px; max-width: 85vw; height: 100vh; background: #0d0f17; overflow-y: auto; display: flex; flex-direction: column; box-shadow: 4px 0 20px rgba(0,0,0,0.5); z-index: 10000; }

    /* RESPONSIVE */
    @media (max-width: 1024px) {
      aside.sidebar, .sidebar { display: none !important; }
      .mobile-header { display: flex !important; }
      .main-content { margin-left: 0 !important; max-width: 100vw !important; width: 100% !important; padding: 0 !important; box-sizing: border-box !important; }
      /* Ocultar dashboard-header interno en mobile (la barra top ya lo reemplaza) */
      .dashboard-header { display: none !important; }
      .dashboard-body { padding: 1rem 1rem 2rem !important; padding-top: 72px !important; }
      .pruebas-grid { grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
    }
    @media (max-width: 768px) {
      aside.sidebar, .sidebar { display: none !important; }
      .mobile-header { display: flex !important; }
      .main-content { margin-left: 0 !important; max-width: 100vw !important; width: 100% !important; padding: 0 !important; box-sizing: border-box !important; }
      .dashboard-header { display: none !important; }
      .dashboard-body { padding: 1rem 0.85rem 2rem !important; padding-top: 72px !important; }
      .title { font-size: 1.8rem; }
      .pruebas-grid { grid-template-columns: 1fr; }
      .modal-preparacion { padding: 1rem 0.5rem !important; align-items: center !important; z-index: 20000 !important; }
      .modal-content { padding: 2.5rem 1.25rem 1.25rem !important; margin: auto !important; max-height: 86vh !important; border-radius: 16px !important; }
      .modal-close { top: 0.75rem !important; right: 0.75rem !important; width: 36px !important; height: 36px !important; }
      .prueba-detalles { grid-template-columns: 1fr; }
      .cooldown-warning-banner { flex-direction: column !important; align-items: stretch !important; justify-content: flex-start !important; gap: 0.85rem !important; }
      .cooldown-warning-banner > div:first-child { width: 100%; }
      .cooldown-warning-banner button { width: 100% !important; white-space: normal !important; }
      .active-exam-widget { max-width: 100% !important; flex-wrap: wrap !important; }
      .last-ensayo-compact-btn { max-width: 100%; }
      .last-ensayo-compact-btn > div { flex-wrap: wrap; }
    }
    @media (max-width: 480px) {
      .dashboard-body { padding: 0.85rem !important; padding-top: 70px !important; }
      .prueba-card { padding: 1.5rem; }
      .card-title { font-size: 1.4rem; }
    }
  `]
})
export class EnsayosListComponent implements OnInit {
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

  isImagePath(path: string): boolean {
    return typeof path === 'string' && path.includes('assets/');
  }

  isCollapsible = false;
  mobileOpen = false;
  scrolledToBottom = false;

  onModalScroll(event: any) {
    const target = event.target;
    if (target.scrollHeight - target.scrollTop - target.clientHeight < 30) {
      this.scrolledToBottom = true;
    } else {
      this.scrolledToBottom = false;
    }
  }

  pruebas: Prueba[] = [
    {
      id: 'm1',
      nombre: 'M1',
      icono: 'assets/images/iconosParaElementos/P_m1.png',
      descripcion: 'Competencia Matemática 1',
      tiempo: 140,
      preguntas: 65,
      subpruebas: [
        {
          id: 'm1',
          nombre: 'PAES Oficial 2024',
          descripcion: 'Prueba oficial rendida a fines del 2023.'
        },
        {
          id: 'm1-invierno',
          nombre: 'PAES Invierno 2024',
          descripcion: 'Prueba de invierno rendida a mediados del 2024.'
        },
        {
          id: 'm1-invierno-2025',
          nombre: 'PAES Invierno 2025',
          descripcion: 'Prueba de invierno para el proceso de admisión 2025.'
        },
        {
          id: 'm1-2026',
          nombre: 'PAES Oficial 2026',
          descripcion: 'Prueba oficial rendida a fines del 2025.'
        },
        {
          id: 'm1-invierno-2026',
          nombre: 'PAES Invierno 2026',
          descripcion: 'Prueba de invierno rendida a mediados del 2026.'
        }
      ]
    },
    {
      id: 'm2',
      nombre: 'M2',
      icono: 'assets/images/iconosParaElementos/P_m2.png',
      descripcion: 'Matemática 2',
      tiempo: 140,
      preguntas: 55,
      subpruebas: [
        {
          id: 'm2-2024',
          nombre: 'PAES Oficial 2024',
          descripcion: 'Prueba oficial de Matemática 2 rendida a fines del 2023.'
        },
        {
          id: 'm2-invierno-2024',
          nombre: 'PAES Invierno 2024',
          descripcion: 'Prueba de invierno de Matemática 2 rendida a mediados del 2024.'
        },
        {
          id: 'm2-invierno-2025',
          nombre: 'PAES Invierno 2025',
          descripcion: 'Prueba de invierno de Matemática 2 para el proceso de admisión 2025.'
        },
        {
          id: 'm2-invierno-2026',
          nombre: 'PAES Invierno 2026',
          descripcion: 'Prueba de invierno de Matemática 2 para el proceso de admisión 2026.'
        },
        {
          id: 'm2-2025',
          nombre: 'PAES Oficial 2025',
          descripcion: 'Prueba oficial de Matemática 2 rendida a fines del 2024.'
        },
        {
          id: 'm2-2026',
          nombre: 'PAES Oficial 2026',
          descripcion: 'Prueba oficial de Matemática 2 rendida a fines del 2025.'
        }
      ]
    },
    {
      id: 'lenguaje',
      nombre: 'Competencia Lectora',
      icono: 'assets/images/iconosParaElementos/P_Lenguaje.png',
      descripcion: 'Comprensión de textos y vocabulario',
      tiempo: 150,
      preguntas: 65,
      subpruebas: [
        {
          id: 'l-comprension',
          nombre: 'Comprensión Lectora',
          descripcion: 'Análisis y síntesis de textos',
          ensayos: [
            {
              id: 'l-2024',
              nombre: 'PAES Oficial 2024',
              descripcion: 'Prueba oficial de Lenguaje rendida a fines del 2023.'
            },
            {
              id: 'l-invierno-2024',
              nombre: 'PAES Invierno 2024',
              descripcion: 'Prueba de invierno de Lenguaje rendida a mediados del 2024.'
            },
            {
              id: 'l-2025',
              nombre: 'PAES Oficial 2025',
              descripcion: 'Prueba oficial de Lenguaje rendida a fines del 2024.'
            },
            {
              id: 'l-invierno-2025',
              nombre: 'PAES Invierno 2025',
              descripcion: 'Prueba de invierno de Lenguaje para el proceso de admisión 2025.'
            },
            {
              id: 'l-2026',
              nombre: 'PAES Oficial 2026',
              descripcion: 'Prueba oficial de Lenguaje rendida a fines del 2025.'
            },
            {
              id: 'l-invierno-2026',
              nombre: 'PAES Invierno 2026',
              descripcion: 'Prueba de invierno de Lenguaje para el proceso de admisión 2026.'
            }
          ]
        }
      ]
    },
    {
      id: 'ciencias',
      nombre: 'Ciencias',
      icono: 'assets/images/iconosParaElementos/P_Biologia.png',
      descripcion: 'Biología, Química, Física y Ciencias Técnico-Profesional',
      tiempo: 160,
      preguntas: 80,
      subpruebas: [
        {
          id: 'biologia',
          nombre: 'Biología',
          descripcion: 'Ecosistemas, genética y evolución',
          ensayos: [
            {
              id: 'b-2024',
              nombre: 'PAES Oficial 2024',
              descripcion: 'Prueba oficial de Biología rendida a fines del 2023.'
            },
            {
              id: 'b-invierno-2024',
              nombre: 'PAES Invierno 2024',
              descripcion: 'Prueba de invierno de Biología rendida a mediados del 2024.'
            },
            {
              id: 'b-2025',
              nombre: 'PAES Oficial 2025',
              descripcion: 'Prueba oficial de Biología rendida a fines del 2024.'
            },
            {
              id: 'b-invierno-2025',
              nombre: 'PAES Invierno 2025',
              descripcion: 'Prueba de invierno de Biología para el proceso de admisión 2025.'
            },
            {
              id: 'b-2026',
              nombre: 'PAES Oficial 2026',
              descripcion: 'Prueba oficial de Biología rendida a fines del 2025.'
            },
            {
              id: 'b-invierno-2026',
              nombre: 'PAES Invierno 2026',
              descripcion: 'Prueba de invierno de Biología para el proceso de admisión 2026.'
            }
          ]
        },
        {
          id: 'quimica',
          nombre: 'Química',
          descripcion: 'Materia, reacciones y estequiometría',
          ensayos: [
            {
              id: 'q-2024',
              nombre: 'PAES Oficial 2024',
              descripcion: 'Prueba oficial de Química rendida a fines del 2023.'
            },
            {
              id: 'q-invierno-2024',
              nombre: 'PAES Invierno 2024',
              descripcion: 'Prueba de invierno de Química rendida a mediados del 2024.'
            },
            {
              id: 'q-2025',
              nombre: 'PAES Oficial 2025',
              descripcion: 'Prueba oficial de Química rendida a fines del 2024.'
            },
            {
              id: 'q-invierno-2025',
              nombre: 'PAES Invierno 2025',
              descripcion: 'Prueba de invierno de Química rendida a mediados del 2025.'
            },
            {
              id: 'q-2026',
              nombre: 'PAES Oficial 2026',
              descripcion: 'Prueba oficial de Química rendida a fines del 2025.'
            },
            {
              id: 'q-invierno-2026',
              nombre: 'PAES Invierno 2026',
              descripcion: 'Prueba de invierno de Química rendida a mediados del 2026.'
            }
          ]
        },

        {
          id: 'fisica',
          nombre: 'Física',
          descripcion: 'Movimiento, energía y fuerzas',
          ensayos: [
            {
              id: 'f-2024',
              nombre: 'PAES Oficial 2024',
              descripcion: 'Prueba oficial de Física rendida a fines del 2023.'
            },
            {
              id: 'f-invierno-2024',
              nombre: 'PAES Invierno 2024',
              descripcion: 'Prueba de invierno de Física rendida a mediados del 2024.'
            },
            {
              id: 'f-invierno-2025',
              nombre: 'PAES Invierno 2025',
              descripcion: 'Prueba de invierno de Física rendida a mediados del 2025.'
            },
            {
              id: 'f-2025',
              nombre: 'PAES Oficial 2025',
              descripcion: 'Prueba oficial de Física rendida a fines del 2024.'
            },
            {
              id: 'f-2026',
              nombre: 'PAES Oficial 2026',
              descripcion: 'Prueba oficial de Física rendida a fines del 2025.'
            },
            {
              id: 'f-invierno-2026',
              nombre: 'PAES Invierno 2026',
              descripcion: 'Prueba de invierno de Física rendida a mediados del 2026.'
            }
          ]
        },
        {
          id: 'tecnico-profesional',
          nombre: 'Ciencias Técnico-Profesional',
          descripcion: 'Aplicaciones científicas en contextos técnicos',
          ensayos: [
            {
              id: 't-2024',
              nombre: 'PAES Oficial 2024',
              descripcion: 'Prueba oficial TP rendida a fines del 2023.'
            },
            {
              id: 't-invierno-2024',
              nombre: 'PAES Invierno 2024',
              descripcion: 'Prueba de invierno TP rendida a mediados del 2024.'
            },
            {
              id: 't-2025',
              nombre: 'PAES Oficial 2025',
              descripcion: 'Prueba oficial TP rendida a fines del 2024.'
            },
            {
              id: 't-invierno-2025',
              nombre: 'PAES Invierno 2025',
              descripcion: 'Prueba de invierno TP rendida a mediados del 2025.'
            },
            {
              id: 't-2026',
              nombre: 'PAES Oficial 2026',
              descripcion: 'Prueba oficial TP rendida a fines del 2025.'
            },
            {
              id: 't-invierno-2026',
              nombre: 'PAES Invierno 2026',
              descripcion: 'Prueba de invierno TP rendida a mediados del 2026.'
            }
          ]
        }
      ]
    },
    {
      id: 'historia',
      nombre: 'Historia y Ciencias Sociales',
      icono: 'assets/images/iconosParaElementos/P_Historia.png',
      descripcion: 'Historia y Ciencias Sociales',
      tiempo: 120,
      preguntas: 65,
      subpruebas: [
        {
          id: 'h-2024',
          nombre: 'PAES Oficial 2024',
          descripcion: 'Prueba oficial de Historia rendida a fines del 2023.'
        },
        {
          id: 'h-invierno-2024',
          nombre: 'PAES Invierno 2024',
          descripcion: 'Prueba de invierno de Historia rendida a mediados del 2024.'
        },
        {
          id: 'h-invierno-2025',
          nombre: 'PAES Invierno 2025',
          descripcion: 'Prueba de invierno de Historia rendida a mediados del 2025.'
        },
        {
          id: 'h-invierno-2026',
          nombre: 'PAES Invierno 2026',
          descripcion: 'Prueba de invierno de Historia rendida a mediados del 2026.'
        },
        {
          id: 'h-2025',
          nombre: 'PAES Oficial 2025',
          descripcion: 'Prueba oficial de Historia rendida a fines del 2024.'
        },
        {
          id: 'h-2026',
          nombre: 'PAES Oficial 2026',
          descripcion: 'Prueba oficial de Historia rendida a fines del 2025.'
        }
      ]
    }
  ];

  pruebaSeleccionada: Prueba | null = null;
  subPruebaSeleccionada: SubPrueba | null = null;
  ensayoSeleccionado: EnsayoOption | null = null;
  // Reads from same localStorage key as the runner - always reliable
  activeProgress: { examId: string; examName: string; intentoId?: string } | null = null;
  showOverwriteModal = false;
  pendingMode: ExamMode = 'real';

  private readonly STORAGE_KEY = 'estudiauni_active_asistido';

  private router = inject(Router);
  private authService = inject(AuthService);
  public firestoreService = inject(FirestoreService);
  public adminService = inject(AdminService);
  public dashSvc = inject(DashboardService);
  public paymentService = inject(PaymentService);
  private toast = inject(ToastService);
  private auth = inject(Auth);
  showProfileModal = false;
  showSettingsModal = false;
  showLogoutConfirm = false;
  isProPlan = computed(() => this.firestoreService.profileSignal()?.plan === 'premium');
  readonly isProduction = environment.production;

  async devResetTimeLimits() {
    if (this.isProduction) return; // Dev-only escape hatch, never active in production
    await this.firestoreService.devSimulateTimePass();
    this.showCooldownModal = false;
    this.toast.success('🧪 [DEV] ¡Se simularon 50h de avance! Cooldown y retención 3h reiniciados.');
  }

  profileInitial = computed(() => {
    const p = this.firestoreService.profileSignal();
    return p?.displayName?.charAt(0).toUpperCase() || 'U';
  });

  onProfileModalClose() {
    this.showProfileModal = false;
  }

  countdown = { days: 0, hours: 0, minutes: 0 };
  nextExamLabel = '';
  selectedMode: ExamMode | null = null;
  private countdownInterval: any;

  ngOnInit() {
    this.firestoreService.getUserProfile().subscribe();
    this.refreshActiveProgress();
    this.startCountdown();
  }

  ngOnDestroy() {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
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
    this.countdownInterval = setInterval(update, 60000); // Actualizar cada minuto
  }

  /** Reads localStorage to detect any in-progress assisted exam */
  private refreshActiveProgress() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) { this.activeProgress = null; return; }
      const data = JSON.parse(raw);
      if (data?.examId && data?.mode === 'asistido') {
        this.activeProgress = { examId: data.examId, examName: data.examName || data.examId, intentoId: data.intentoId };
      } else {
        this.activeProgress = null;
      }
    } catch {
      this.activeProgress = null;
    }
  }

  seleccionarPrueba(prueba: Prueba) {
    this.pruebaSeleccionada = prueba;
    // For Language, we auto-select the only sub-area to show essays directly
    if (prueba.id === 'lenguaje') {
      this.subPruebaSeleccionada = prueba.subpruebas?.[0] ?? null;
      this.ensayoSeleccionado = this.subPruebaSeleccionada?.ensayos?.[0] ?? null;
    } else {
      // For others (Ciencias, M1, M2, Historia), we wait for selection in the first grid
      this.subPruebaSeleccionada = null;
      this.ensayoSeleccionado = null;
    }
  }

  seleccionarSubprueba(subprueba: SubPrueba) {
    this.subPruebaSeleccionada = subprueba;
    this.ensayoSeleccionado = subprueba.ensayos?.[0] ?? null;
  }

  seleccionarEnsayo(ensayo: EnsayoOption) {
    this.ensayoSeleccionado = ensayo;
  }

  cerrarSeleccion() {
    this.pruebaSeleccionada = null;
    this.subPruebaSeleccionada = null;
    this.ensayoSeleccionado = null;
  }
  
  resumeActiveIntento() {
    if (this.activeProgress) {
      // Pass resume=true so the runner skips the pause modal and goes straight in
      this.router.navigate(['/ensayo', this.activeProgress.examId, 'run'], {
        queryParams: { mode: 'asistido', resume: 'true' }
      });
    }
  }

  async discardActiveProgress() {
    const isPro = this.isProPlan() || this.adminService.isAdmin();
    const now = new Date();
    const nowTs = now.getTime();

    // 1. Remove local progress storage
    localStorage.removeItem(this.STORAGE_KEY);

    // 2. If free user, register finalization timestamp to activate 48h cooldown
    if (!isPro) {
      localStorage.setItem('estudiauni_last_simulation_finished', nowTs.toString());

      const profile = this.firestoreService.profileSignal();
      if (profile) {
        this.firestoreService.profileSignal.set({
          ...profile,
          lastSimulationFinishedAt: now
        });
      }

      const user = this.auth.currentUser;
      if (user) {
        try {
          const { doc, updateDoc } = await import('@angular/fire/firestore');
          await updateDoc(doc(this.firestoreService.firestore, 'users', user.uid), {
            lastSimulationFinishedAt: now
          });
        } catch (e) {}
      }
      this.toast.info('Ensayo cerrado y finalizado. Cooldown de 48 horas activado.');
    } else {
      this.toast.info('Ensayo cerrado.');
    }

    // 3. Mark attempt in Firestore as completed if attempt ID is present
    if (this.activeProgress?.intentoId) {
      try {
        await this.firestoreService.finishIntento(this.activeProgress.intentoId, 0, 65);
      } catch (e) {}
    }

    this.activeProgress = null;
  }

  isEssayAvailableForFree(ensayoId: string): boolean {
    if (this.isProPlan() || this.adminService.isAdmin()) return true;
    if (!ensayoId) return false;
    const lower = ensayoId.toLowerCase();
    return lower.includes('2026') && !lower.includes('invierno');
  }

  private getLastFinishedDate(): Date | null {
    const profile = this.firestoreService.profileSignal();
    const lastFinished = profile?.lastSimulationFinishedAt;
    if (lastFinished) {
      return typeof lastFinished.toDate === 'function' ? lastFinished.toDate() : new Date(lastFinished);
    }
    const storageVal = localStorage.getItem('estudiauni_last_simulation_finished');
    if (storageVal) {
      const parsed = parseInt(storageVal, 10);
      if (!isNaN(parsed) && parsed > 0) return new Date(parsed);
    }
    return null;
  }

  isCooldownActive(): boolean {
    if (this.isProPlan() || this.adminService.isAdmin()) return false;
    const finishedDate = this.getLastFinishedDate();
    if (!finishedDate) return false;

    const elapsed = Date.now() - finishedDate.getTime();
    return elapsed < 48 * 3600 * 1000;
  }

  getCooldownFormatted(): string {
    const finishedDate = this.getLastFinishedDate();
    if (!finishedDate) return '0h 0m';

    const remainingMs = (48 * 3600 * 1000) - (Date.now() - finishedDate.getTime());
    if (remainingMs <= 0) return '0h 0m';

    const hours = Math.floor(remainingMs / (3600 * 1000));
    const minutes = Math.floor((remainingMs % (3600 * 1000)) / (60 * 1000));
    return `${hours}h ${minutes}m`;
  }

  showCooldownModal = false;

  isResultsLockedForLast(): boolean {
    if (this.isProPlan() || this.adminService.isAdmin()) return false;
    const profile = this.firestoreService.profileSignal();
    const lastFinished = profile?.lastSimulationFinishedAt;
    if (!lastFinished) return false;

    let finishedDate: Date;
    if (typeof lastFinished.toDate === 'function') {
      finishedDate = lastFinished.toDate();
    } else {
      finishedDate = new Date(lastFinished);
    }

    const elapsed = Date.now() - finishedDate.getTime();
    return elapsed < 3 * 3600 * 1000;
  }

  getResultsUnlockCountdown(): string {
    const profile = this.firestoreService.profileSignal();
    const lastFinished = profile?.lastSimulationFinishedAt;
    if (!lastFinished) return '00h 00m 00s';

    let finishedDate: Date;
    if (typeof lastFinished.toDate === 'function') {
      finishedDate = lastFinished.toDate();
    } else {
      finishedDate = new Date(lastFinished);
    }

    const remainingMs = (3 * 3600 * 1000) - (Date.now() - finishedDate.getTime());
    if (remainingMs <= 0) return '00h 00m 00s';

    const hours = Math.floor(remainingMs / (3600 * 1000)).toString().padStart(2, '0');
    const minutes = Math.floor((remainingMs % (3600 * 1000)) / (60 * 1000)).toString().padStart(2, '0');
    const seconds = Math.floor((remainingMs % (60 * 1000)) / 1000).toString().padStart(2, '0');
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  getLastCompletedEnsayo(): any {
    const records = this.dashSvc.paesRecords();
    if (!records || records.length === 0) return null;
    return records[0];
  }

  goToLastEnsayoReview(lastEnsayo: any) {
    if (!lastEnsayo) return;
    const ensayoId = lastEnsayo.ensayoId || 'paes-2026-oficial';
    const intentoId = lastEnsayo.intentoId || '';
    this.router.navigate(['/ensayo', ensayoId, 'review'], {
      queryParams: intentoId ? { intento: intentoId } : {}
    });
  }

  iniciarPrueba(mode: ExamMode) {
    if (!this.pruebaSeleccionada) return;

    const ensayoId = this.ensayoSeleccionado?.id ?? this.subPruebaSeleccionada?.id ?? this.pruebaSeleccionada.id;

    if (!this.isEssayAvailableForFree(ensayoId)) {
      this.paymentService.openPricingModal();
      return;
    }

    if (this.isCooldownActive()) {
      this.showCooldownModal = true;
      return;
    }

    // Only warn if there is ALREADY a DIFFERENT assisted exam in progress
    if (mode === 'asistido' && this.activeProgress && this.activeProgress.examId !== ensayoId) {
      this.pendingMode = mode;
      this.showOverwriteModal = true;
      return;
    }

    this.procederInicio(mode);
  }

  confirmOverwrite() {
    // Clear localStorage so the previous progress is gone
    localStorage.removeItem(this.STORAGE_KEY);
    this.activeProgress = null;
    this.showOverwriteModal = false;
    this.procederInicio(this.pendingMode);
  }

  private async procederInicio(mode: ExamMode) {
    if (!this.pruebaSeleccionada) return;

    const ensayoId = this.ensayoSeleccionado?.id ?? this.subPruebaSeleccionada?.id ?? this.pruebaSeleccionada.id;
    let displaySubject = this.pruebaSeleccionada.nombre;
    if (displaySubject === 'Competencia Lectora') displaySubject = 'Lenguaje';
    
    const subPart = this.subPruebaSeleccionada?.nombre;
    const ensayoPart = this.ensayoSeleccionado?.nombre.replace('PAES ', '');

    let fullName = displaySubject;
    if (subPart && subPart !== displaySubject) {
      fullName += ` ${subPart}`;
    }
    if (ensayoPart) {
      fullName += ` - ${ensayoPart}`;
    }

    try {
      // Crear el intento en Firestore antes de navegar
      const intentoId = await this.firestoreService.startIntento(ensayoId, mode, fullName);
      
      this.router.navigate(['/ensayo', ensayoId, 'run'], {
        queryParams: {
          mode,
          intento: intentoId,
          duration: this.pruebaSeleccionada.tiempo,
          questions: this.pruebaSeleccionada.preguntas,
          name: fullName
        }
      });
    } catch (error) {
      console.error('Error al iniciar ensayo:', error);
      // Fallback a navegación sin intento si falla Firestore
      this.router.navigate(['/ensayo', ensayoId, 'run'], {
        queryParams: {
          mode,
          duration: this.pruebaSeleccionada.tiempo,
          questions: this.pruebaSeleccionada.preguntas,
          name: fullName
        }
      });
    }
  }

  getNombreSeleccionado(): string {
    if (!this.pruebaSeleccionada) return '';
    const subName = this.ensayoSeleccionado?.nombre ?? this.subPruebaSeleccionada?.nombre;
    if (subName) return `${this.pruebaSeleccionada.nombre} - ${subName}`;
    return this.pruebaSeleccionada.nombre;
  }

  getSelectedDescription(): string {
    return this.ensayoSeleccionado?.descripcion ?? this.subPruebaSeleccionada?.descripcion ?? '';
  }

  /** True only when the user has made the required selection to start */
  get canStart(): boolean {
    if (!this.pruebaSeleccionada) return false;
    if (this.pruebaSeleccionada.id === 'lenguaje') return true;
    if (this.pruebaSeleccionada.id === 'ciencias') {
      return this.subPruebaSeleccionada !== null && this.ensayoSeleccionado !== null;
    }
    // M1, M2, Historia: the subprueba IS the essay
    return this.subPruebaSeleccionada !== null;
  }

  getCurrentEnsayoId(): string {
    return this.ensayoSeleccionado?.id ?? this.subPruebaSeleccionada?.id ?? '';
  }

  getBestScoreForCurrent() {
    const id = this.getCurrentEnsayoId();
    if (!id) return null;
    return this.getBestScore(id);
  }

  getBestScore(ensayoId: string) {
    const records = this.dashSvc.paesRecords();
    const relevant = records.filter(r => r.ensayoId === ensayoId && r.mode === 'real');
    if (!relevant.length) return null;
    return relevant.reduce((best, curr) => curr.correctAnswers > best.correctAnswers ? curr : best);
  }

  getAttemptCount(ensayoId: string): number {
    if (!ensayoId) return 0;
    const records = this.dashSvc.paesRecords();
    return records.filter(r => r.ensayoId === ensayoId && r.mode === 'real').length;
  }

  isPerfect(ensayoId: string): boolean {
    const best = this.getBestScore(ensayoId);
    return !!best && best.correctAnswers === best.totalQuestions && best.totalQuestions > 0;
  }

  confirmLogout() {
    this.showLogoutConfirm = true;
  }

  async executeLogout() {
    this.showLogoutConfirm = false;
    await this.authService.logout().toPromise();
    this.router.navigate(['/']);
  }

}
