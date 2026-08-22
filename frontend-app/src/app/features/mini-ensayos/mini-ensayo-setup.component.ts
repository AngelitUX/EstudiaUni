import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MiniEnsayoService } from '../../core/services/mini-ensayo.service';
import { PaesContentService } from '../learning-path/services/paes-content.service';
import { MateriaId } from '../learning-path/models/paes.models';
import { SettingsModalComponent } from '../profile/settings-modal.component';
import { ProfileModalComponent } from '../profile/profile-modal.component';
import { FirestoreService } from '../../core/services/firestore.service';
import { AdminService } from '../admin/services/admin.service';
import { AuthService } from '../../core/services/auth.service';
import { PaymentService } from '../../core/services/payment.service';
import { StreakIconComponent } from '../../shared/components/streak-icon.component';
import { ToastService } from '../../core/services/toast.service';


interface MateriaOption {
  id: MateriaId;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-mini-ensayo-setup',
  standalone: true,
  imports: [CommonModule, RouterLink, SettingsModalComponent, ProfileModalComponent, StreakIconComponent],
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
          <a class="nav-item" routerLink="/dashboard"><img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_Inicio.svg" alt="Inicio" class="nav-icon-img"/><span class="nav-text">Inicio</span></a>
          <a class="nav-item" routerLink="/ruta"><img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_RutaDeAprendizaje.svg" alt="Ruta de Aprendizaje" class="nav-icon-img"/><span class="nav-text">Ruta de Aprendizaje</span></a>
          <a class="nav-item" routerLink="/ensayos"><img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_EnsayosPaes.svg" alt="Ensayos PAES" class="nav-icon-img"/><span class="nav-text">Ensayos PAES</span></a>
          <a class="nav-item active" routerLink="/mini-ensayo"><img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_MiniEnsayos.svg" alt="Mini Ensayos" class="nav-icon-img"/><span class="nav-text">Mini Ensayos</span></a>
          <a class="nav-item" routerLink="/mente-veloz"><img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_MenteVeloz.svg" alt="Mente Veloz" class="nav-icon-img"/><span class="nav-text">Mente Veloz</span></a>
          
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
          <div *ngIf="!isProPlan() && !adminService.isAdmin()" class="sidebar-promo-card" (click)="paymentService.openPricingModal()">
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
      <div class="mobile-header" [class.mobile-header-with-pro]="!isProPlan() && !adminService.isAdmin()">
        <div class="mobile-header-top">
          <button class="mobile-menu-btn" (click)="mobileOpen = !mobileOpen" aria-label="Abrir menú">
            <span style="display:flex;flex-direction:column;gap:4px;width:18px">
              <span style="display:block;height:2px;background:#fff;border-radius:2px"></span>
              <span style="display:block;height:2px;background:#fff;border-radius:2px"></span>
              <span style="display:block;height:2px;background:#fff;border-radius:2px"></span>
            </span>
          </button>
          <a routerLink="/dashboard" class="mobile-logo-link">
            <img [src]="(isProPlan() || adminService.isAdmin()) ? 'https://res.cloudinary.com/dqm3syhwr/image/upload/f_auto,q_auto/v1/imagenes/branding/LogoEstudiaUniPREMIUM' : 'https://res.cloudinary.com/dqm3syhwr/image/upload/f_auto,q_auto/v1/imagenes/branding/LogoEstudiaUni'" alt="EstudiaUni" class="mobile-logo-img" />
          </a>
          <button class="profile-trigger" (click)="showProfileModal = true" style="background:none;border:none;cursor:pointer;padding:0">
            <span class="profile-avatar-wrap">
              <img *ngIf="firestoreService.profileSignal()?.photoURL; else avatarMobileMe" [src]="firestoreService.profileSignal()?.photoURL" alt="Foto" class="profile-avatar" style="width:32px;height:32px" [class.avatar-preset]="(firestoreService.profileSignal()?.photoURL || '').includes('assets/images/avatars/')"/>
              <ng-template #avatarMobileMe><span class="profile-avatar fallback" style="width:32px;height:32px;font-size:0.9rem">{{ profileInitial() }}</span></ng-template>
            </span>
          </button>
        </div>
        <div class="mobile-header-pro-row" *ngIf="!isProPlan() && !adminService.isAdmin()">
          <button class="btn-upgrade-pro mobile-pro-pill" (click)="paymentService.openPricingModal()">Mejorar a PRO ⚡</button>
        </div>
      </div>
      <div class="mobile-overlay" [class.open]="mobileOpen" (click)="mobileOpen = false">
        <div class="mobile-menu" (click)="$event.stopPropagation()">
          <div style="position: relative; padding: 0.75rem 1rem 0.75rem 1.1rem; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: flex-start; align-items: center;">
            <img [src]="(isProPlan() || adminService.isAdmin()) ? 'https://res.cloudinary.com/dqm3syhwr/image/upload/f_auto,q_auto,c_crop,x_10,y_202,w_471,h_86/v1/imagenes/branding/LogoEstudiaUniPREMIUM' : 'https://res.cloudinary.com/dqm3syhwr/image/upload/f_auto,q_auto,c_crop,x_1,y_204,w_489,h_81/v1/imagenes/branding/LogoEstudiaUni'" alt="EstudiaUni" style="width: 180px; height: auto;" />
            <button class="mobile-close-btn" (click)="mobileOpen=false" style="position: absolute; top: 0.75rem; right: 1.25rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); color: #fff; width: 34px; height: 34px; border-radius: 10px; font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; line-height: 1;">✕</button>
          </div>
          <nav class="sidebar-nav">
            <a class="nav-item" routerLink="/dashboard" (click)="mobileOpen=false"><img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_Inicio.svg" alt="Inicio" class="nav-icon-img"/><span class="nav-text">Inicio</span></a>
            <a class="nav-item" routerLink="/ruta" (click)="mobileOpen=false"><img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_RutaDeAprendizaje.svg" alt="Ruta de Aprendizaje" class="nav-icon-img"/><span class="nav-text">Ruta de Aprendizaje</span></a>
            <a class="nav-item" routerLink="/ensayos" (click)="mobileOpen=false"><img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_EnsayosPaes.svg" alt="Ensayos PAES" class="nav-icon-img"/><span class="nav-text">Ensayos PAES</span></a>
            <a class="nav-item active" routerLink="/mini-ensayo" (click)="mobileOpen=false"><img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_MiniEnsayos.svg" alt="Mini Ensayos" class="nav-icon-img"/><span class="nav-text">Mini Ensayos</span></a>
            <a class="nav-item" routerLink="/mente-veloz" (click)="mobileOpen=false"><img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_MenteVeloz.svg" alt="Mente Veloz" class="nav-icon-img"/><span class="nav-text">Mente Veloz</span></a>
            <div class="sidebar-section-title">HERRAMIENTAS</div>
            <a class="nav-item" routerLink="/encuentra-tu-carrera" (click)="mobileOpen=false"><img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_EnncuentraTuCarrera.svg" alt="Encuentra tu Carrera" class="nav-icon-img"/><span class="nav-text">Encuentra tu Carrera</span></a>
            <a class="nav-item" routerLink="/calculadora-nem" (click)="mobileOpen=false"><img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_CalculadoraNEM.svg" alt="Calculadora NEM" class="nav-icon-img"/><span class="nav-text">Calculadora NEM</span></a>
            <a class="nav-item" routerLink="/recursos" (click)="mobileOpen=false"><img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_RecursosAdicionales.svg" alt="Recursos Adicionales" class="nav-icon-img"/><span class="nav-text">Recursos Adicionales</span></a>
          </nav>
          <div style="padding: 1rem; border-top: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; gap: 0.5rem;">
            <a class="nav-item" (click)="showSettingsModal = true; mobileOpen=false"><img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_Configuracion.svg" alt="Configuración" class="nav-icon-img nav-icon-img-config"/><span class="nav-text">Configuración</span></a>
            <a class="nav-item logout-btn-sidebar" (click)="confirmLogout(); mobileOpen=false"><img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_CerrarSesion.svg" alt="Cerrar Sesión" class="nav-icon-img"/><span class="nav-text">Cerrar Sesión</span></a>
          </div>
        </div>
      </div>

      <!-- MAIN CONTENT -->
      <main class="main-content animate-fade-in-down">
        <!-- HEADER -->
        <header class="dashboard-header">
          <div class="header-welcome-text">
            <h1 class="header-greeting"><span class="text-gradient">Mini Ensayos Personalizados</span></h1>
            <p class="subtitle" style="color: rgba(255,255,255,0.7); font-size: 0.95rem; margin: 0; font-weight: 500;">Practica a tu medida con preguntas oficiales del banco PAES</p>
          </div>
          <div class="welcome-actions">
            <app-streak-icon></app-streak-icon>
            <button *ngIf="hasLastCompleted()" class="btn-view-last" (click)="viewLastMiniEnsayo()" style="background: rgba(133,92,214,0.12); border: 1.5px solid rgba(133,92,214,0.35); color: var(--accent-primary); padding: 0.55rem 1rem; border-radius: 10px; font-weight: 700; font-size: 0.85rem; cursor: pointer; white-space: nowrap;">
              📄 Último Mini Ensayo
            </button>
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

        <div class="dashboard-body" style="display: flex; flex-direction: column; align-items: center;">
          <div class="setup-container glass-card" style="width: 100%; max-width: 900px;">
        <!-- PASO 1: Materia -->
        <section class="step-section">
          <div class="step-header">
            <span class="step-number">1</span>
            <h2>Selecciona una Materia</h2>
          </div>
          
          <div class="materias-grid">
            @for (mat of materias; track mat.id) {
              <button 
                class="materia-card" 
                [class.active]="selectedMateria() === mat.id"
                (click)="selectMateria(mat.id)">
                <img [src]="mat.icon" [alt]="mat.label" class="mat-icon"/>
                <span class="mat-label">{{ mat.label }}</span>
              </button>
            }
          </div>
        </section>

        <!-- PASO 2: Temas -->
        @if (selectedMateria()) {
          <section class="step-section animate-slide-down">
            <div class="step-header">
              <span class="step-number">2</span>
              <h2>Elige los Temas a Practicar</h2>
              <button class="btn-text-sm" (click)="toggleAllTopics()">
                {{ allTopicsSelected() ? 'Desmarcar todos' : 'Seleccionar todos' }}
              </button>
            </div>

            @if (availableTopics().length > 0) {
              <div class="topics-list">
                @for (t of availableTopics(); track t.topic) {
                  <label class="topic-chip" [class.selected]="selectedTopics().includes(t.topic)">
                    <input type="checkbox" 
                           [checked]="selectedTopics().includes(t.topic)" 
                           (change)="toggleTopic(t.topic)"
                           class="hidden-cb">
                    <span class="topic-name">{{ t.topic }}</span>
                    <span class="topic-count">{{ t.count }} pregs</span>
                  </label>
                }
              </div>
            } @else {
              <div class="empty-topics">No hay preguntas disponibles para esta materia aún.</div>
            }
          </section>
        }

        <!-- PASO 3: Configuración Final -->
        @if (selectedMateria() && selectedTopics().length > 0) {
          <section class="step-section animate-slide-down">
            <div class="step-header">
              <span class="step-number">3</span>
              <h2>Configuración</h2>
            </div>

            <div class="config-row">
              <div class="config-group">
                <label>Cantidad de preguntas</label>
                <div class="count-selector">
                  @for (count of [16, 24, 30]; track count) {
                    <button class="count-btn"
                            [class.active]="questionCount() === count"
                            [class.locked]="count > 16 && !isProPlan() && !adminService.isAdmin()"
                            [disabled]="totalAvailableQuestions() < count || (count > 16 && !isProPlan() && !adminService.isAdmin())"
                            (click)="setCount(count)">
                      {{ count }}
                      @if (count > 16 && !isProPlan() && !adminService.isAdmin()) { <span class="count-lock">🔒</span> }
                    </button>
                  }
                </div>
                @if (!isProPlan() && !adminService.isAdmin()) {
                  <p class="warning-text">Plan Básico: máximo 16 preguntas por mini ensayo. <a (click)="paymentService.openPricingModal()" style="color: var(--accent-primary); cursor: pointer; font-weight: 700;">Mejora a PRO</a> para 24 o 30.</p>
                } @else if (totalAvailableQuestions() < questionCount()) {
                  <p class="warning-text">Solo hay {{ totalAvailableQuestions() }} preguntas disponibles en los temas seleccionados.</p>
                }
                @if (!isProPlan() && !adminService.isAdmin() && !dailyStatus().allowed) {
                  <p class="warning-text" style="color: #f59e0b;">⏳ Ya usaste tu Mini Ensayo gratis de hoy. Disponible de nuevo {{ dailyStatus().nextAvailableAt ? (dailyStatus().nextAvailableAt | date:'short') : 'mañana' }}, o <a (click)="paymentService.openPricingModal()" style="color: var(--accent-primary); cursor: pointer; font-weight: 700;">pásate a PRO</a> para ilimitados.</p>
                }
              </div>
              
              <div class="config-group">
                <label>Tiempo estimado</label>
                <div class="time-display">
                  <span class="time-icon">⏱️</span> 60 minutos
                </div>
              </div>
            </div>
          </section>
        }

        <!-- ACCIONES -->
        <div class="setup-actions">
          <button class="btn-start"
                  [disabled]="!isValid() || (!isProPlan() && !adminService.isAdmin() && !dailyStatus().allowed)"
                  (click)="startMiniEnsayo()">
            Comenzar Mini Ensayo
          </button>
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

  `,
  styles: [`
    @keyframes floatLogo { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
    @keyframes floatLogoNav { 0%, 100% { transform: translateY(-3px); } 50% { transform: translateY(3px); } }
    .sidebar-logo-img { width: 230px; height: auto; object-fit: contain; margin: 28px auto 0 auto; filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.2)); animation: floatLogo 3.5s ease-in-out infinite; }
    .mobile-logo-img { width: 190px; height: auto; object-fit: contain; margin: 0; animation: floatLogoNav 3.5s ease-in-out infinite; }
    .mobile-logo-link { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); text-decoration: none; line-height: 0; z-index: 1; }
    :host { display: block; min-height: 100vh; background: #0F1018; color: var(--text-primary); }

    .setup-container { width: 100%; max-width: 900px; padding: 2.5rem; border-radius: 24px; border: 2px solid var(--glass-border); display: flex; flex-direction: column; gap: 2.5rem; }
    
    .step-section { display: flex; flex-direction: column; gap: 1rem; }
    .step-header { display: flex; align-items: center; gap: 1rem; }
    .step-number { width: 32px; height: 32px; border-radius: 50%; background: var(--gradient-brand); color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-family: var(--font-heading); }
    .step-header h2 { font-size: 1.3rem; margin: 0; flex: 1; }
    
    .materias-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; }
    .materia-card { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 1.25rem; border-radius: 16px; border: 2px solid var(--glass-border); background: rgba(255,255,255,0.02); cursor: pointer; transition: all 0.2s; }
    .materia-card:hover { border-color: rgba(133,92,214,0.4); transform: translateY(-2px); }
    .materia-card.active { border-color: var(--accent-primary); background: rgba(133,92,214,0.1); box-shadow: 0 4px 16px rgba(133,92,214,0.2); }
    .mat-icon { width: 48px; height: 48px; object-fit: contain; }
    .mat-label { font-size: 0.9rem; font-weight: 600; text-align: center; }
    
    .btn-text-sm { background: none; border: none; color: var(--accent-primary); font-size: 0.85rem; font-weight: 600; cursor: pointer; }
    .btn-text-sm:hover { text-decoration: underline; }
    
    .topics-list { display: flex; flex-wrap: wrap; gap: 0.75rem; }
    .topic-chip { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1rem; border-radius: 99px; border: 2px solid var(--glass-border); background: var(--bg-secondary); cursor: pointer; transition: all 0.2s; user-select: none; }
    .topic-chip:hover { border-color: rgba(133,92,214,0.4); }
    .topic-chip.selected { border-color: var(--accent-primary); background: rgba(133,92,214,0.15); }
    .hidden-cb { display: none; }
    .topic-name { font-weight: 600; font-size: 0.95rem; }
    .topic-count { font-size: 0.75rem; background: rgba(255,255,255,0.1); padding: 0.2rem 0.5rem; border-radius: 8px; color: var(--text-secondary); }
    .topic-chip.selected .topic-count { background: rgba(133,92,214,0.2); color: var(--accent-primary); }
    .empty-topics { padding: 1.5rem; text-align: center; color: var(--text-secondary); background: rgba(255,255,255,0.02); border-radius: 12px; font-style: italic; }
    
    .config-row { display: flex; gap: 2rem; flex-wrap: wrap; }
    .config-group { display: flex; flex-direction: column; gap: 0.5rem; flex: 1; min-width: 200px; }
    .config-group label { font-size: 0.9rem; color: var(--text-secondary); font-weight: 600; }
    
    .count-selector { display: flex; gap: 0.5rem; }
    .count-btn { flex: 1; padding: 0.75rem; border-radius: 12px; border: 2px solid var(--glass-border); background: var(--bg-secondary); color: var(--text-primary); font-weight: 700; font-size: 1.1rem; cursor: pointer; transition: all 0.2s; }
    .count-btn:hover:not(:disabled) { border-color: rgba(133,92,214,0.4); }
    .count-btn.active { border-color: var(--accent-primary); background: rgba(133,92,214,0.15); color: var(--accent-primary); }
    .count-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .count-btn.locked { position: relative; }
    .count-lock { font-size: 0.7rem; margin-left: 0.25rem; }
    
    .time-display { padding: 0.75rem; border-radius: 12px; border: 2px solid transparent; background: rgba(255,255,255,0.05); font-weight: 700; font-size: 1.1rem; display: flex; align-items: center; gap: 0.5rem; }
    .warning-text { font-size: 0.8rem; color: #ef4444; margin: 0; }
    
    .setup-actions { border-top: 1px dashed var(--glass-border); padding-top: 2rem; display: flex; justify-content: flex-end; }
    .btn-start { padding: 1rem 2rem; border-radius: 16px; border: none; background: var(--gradient-brand); color: white; font-size: 1.1rem; font-weight: 800; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 15px rgba(133,92,214,0.3); }
    .btn-start:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(133,92,214,0.4); }
    .btn-start:disabled { background: var(--glass-border); color: var(--text-muted); box-shadow: none; cursor: not-allowed; transform: none; }
    
    .animate-slide-down { animation: none; opacity: 1; transform: none; }
    @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in { animation: none; opacity: 1; transform: none; }

    /* LOGOUT MODAL */
    .logout-confirm-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: grid; place-items: center; z-index: 11000; padding: 1.5rem; animation: fadeIn 0.2s ease; }
    .logout-confirm-modal { max-width: 420px !important; background: rgba(255,255,255,0.95); border: 2px solid var(--glass-border); border-radius: 24px; box-shadow: 0 20px 50px rgba(0,0,0,0.2); width: 100%; overflow: hidden; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: grid; place-items: center; z-index: 11000; padding: 1.5rem; }
    .modal-header { padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--glass-border); }
    .modal-header h2 { margin: 0; font-size: 1.25rem; font-weight: 800; color: var(--text-primary); }
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

    /* SIDEBAR */
    .sidebar { width: 260px; background: rgba(13,15,23,0.95); border-right: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; height: 100vh; z-index: 100; overflow-y: auto; }
    .sidebar-header { padding: 2.5rem 1.5rem 2rem; border-bottom: 1px solid rgba(255,255,255,0.15); text-align: center; }
    .sidebar-logo { font-size: 2.2rem; font-weight: 900; letter-spacing: -0.04em; font-family: var(--font-heading); }
    .sidebar-nav { flex: 1; padding: 1rem 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; overflow-y: auto; }
    .nav-item { display: flex; align-items: center; gap: 0.85rem; padding: 0.9rem 1.1rem; border-radius: 12px; color: #ffffff; text-decoration: none; transition: all 0.2s; cursor: pointer; font-size: 1.05rem; font-weight: 500; }
    .nav-item:hover { background: rgba(255,255,255,0.12); color: #fff; transform: translateX(4px); }
    .nav-item.active { background: rgba(139,92,246,0.18); color: #c4b5fd; border-left: 3.5px solid #a78bfa; font-weight: 700; }
    .nav-icon { font-size: 1.35rem; width: 32px; text-align: center; }
    .sidebar-section-title { font-size: 0.78rem; font-weight: 800; color: rgba(255,255,255,0.95); text-transform: uppercase; letter-spacing: 0.08em; padding: 0.75rem 1.1rem; margin: 0.75rem 0.5rem 0.25rem; border-top: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: space-between; cursor: pointer; }
    .sidebar-sub-items { display: flex; flex-direction: column; overflow: hidden; max-height: 0; opacity: 0; margin-left: 1.4rem; }
    .sidebar-sub-items.expanded { max-height: 260px; opacity: 1; }
    .sidebar-footer { padding: 1.25rem 0.75rem; border-top: 1px solid rgba(255,255,255,0.1); }
    .logout-btn-sidebar { color: #fca5a5 !important; }
    .logout-btn-sidebar:hover { background: rgba(239,68,68,0.15) !important; }
    .sidebar-promo-card { background: linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.1)); border: 1px solid rgba(139,92,246,0.25); border-radius: 16px; padding: 1.25rem; margin: 0.5rem; text-align: center; cursor: pointer; }
    .promo-crown { font-size: 2rem; }
    .sidebar-promo-card h4 { color: #c4b5fd; font-size: 1rem; margin: 0.5rem 0 0.25rem; }
    .sidebar-promo-card p { color: rgba(255,255,255,0.6); font-size: 0.8rem; margin: 0 0 1rem; }
    .btn-promo-sidebar { background: var(--gradient-brand); color: white; border: none; border-radius: 8px; padding: 0.5rem 1rem; font-size: 0.85rem; font-weight: 700; cursor: pointer; }

    /* MAIN CONTENT */
    .main-content { flex: 1; margin-left: 260px; overflow-y: auto; background: #0F1018; }
    .ensayos-container { display: flex; min-height: 100vh; }
    .dashboard-header { display: flex; justify-content: space-between; align-items: center; padding: 1.75rem 2.5rem; border-bottom: 1px solid rgba(255,255,255,0.08); background: #0F1018; min-height: 80px; }
    .header-welcome-text { display: flex; flex-direction: column; gap: 0.25rem; }
    .header-greeting { font-size: 2rem; font-weight: 900; font-family: var(--font-heading); margin: 0; }
    .welcome-actions { display: flex; align-items: center; gap: 0.85rem; }
    .btn-upgrade-pro { background: linear-gradient(135deg, #f59e0b, #f97316); color: white; border: none; padding: 0.55rem 1.1rem; border-radius: 99px; font-size: 0.85rem; font-weight: 800; cursor: pointer; }
    .profile-menu-wrap { position: relative; }
    .profile-trigger { background: none; border: none; cursor: pointer; padding: 0; }
    .profile-avatar-wrap { display: flex; }
    .profile-avatar { width: 42px; height: 42px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255,255,255,0.2); }
    .profile-avatar.fallback { background: var(--gradient-brand); color: white; font-weight: 800; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
    .profile-emoji-badge { position: absolute; bottom: -4px; right: -4px; font-size: 1rem; }
    .dashboard-body { padding: 2.5rem; flex: 1; }
    .text-gradient { background: var(--gradient-brand); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

    /* MOBILE HEADER */
    .mobile-header { display: none; flex-direction: column; position: fixed; top: 0; left: 0; right: 0; background: rgba(13,15,23,0.99); border-bottom: 1px solid rgba(255,255,255,0.12); z-index: 101; box-sizing: border-box; }
    .mobile-header-top { position: relative; display: flex; align-items: center; justify-content: space-between; height: 60px; padding: 0 1rem; gap: 0.75rem; box-sizing: border-box; width: 100%; }
    .mobile-header.mobile-header-with-pro .mobile-logo-img { animation: none; }
    .mobile-header-pro-row { display: flex; justify-content: center; padding: 0 1rem 0.55rem; box-sizing: border-box; width: 100%; }
    .mobile-pro-pill { width: 190px; max-width: 100%; }
    .mobile-menu-btn { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18); color: #fff; cursor: pointer; padding: 0; width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.2s; box-sizing: border-box; }
    .mobile-menu-btn:hover { background: rgba(255,255,255,0.2); }
    .mobile-menu { position: fixed; top: 0; left: 0; width: 290px; max-width: 85vw; height: 100vh; background: #0d0f17; overflow-y: auto; display: flex; flex-direction: column; box-shadow: 4px 0 20px rgba(0,0,0,0.5); z-index: 10000; }

    /* RESPONSIVE */
    @media (max-width: 1024px) {
      aside.sidebar, .sidebar { display: none !important; }
      .mobile-header { display: flex !important; }
      .main-content { margin-left: 0 !important; max-width: 100vw !important; width: 100% !important; padding: 0 !important; box-sizing: border-box !important; }
      .dashboard-header {
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 0.35rem !important;
        padding: 72px 1.5rem 0.5rem !important;
        height: auto !important;
        max-height: none !important;
        min-height: 0 !important;
        border-bottom: none !important;
      }
      .dashboard-header .welcome-actions app-streak-icon,
      .dashboard-header .welcome-actions .plan-badge,
      .dashboard-header .welcome-actions .btn-upgrade-pro,
      .dashboard-header .welcome-actions .profile-menu-wrap { display: none !important; }
      .mobile-header.mobile-header-with-pro ~ .main-content .dashboard-header { padding-top: 116px !important; }
      .dashboard-body { padding: 1.5rem !important; display: flex !important; flex-direction: column !important; align-items: center !important; }
      .setup-container { padding: 1.5rem !important; }
    }
    @media (max-width: 768px) {
      aside.sidebar, .sidebar { display: none !important; }
      .mobile-header { display: flex !important; }
      .main-content { margin-left: 0 !important; max-width: 100vw !important; width: 100% !important; padding: 0 !important; box-sizing: border-box !important; }
      .dashboard-header {
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 0.35rem !important;
        padding: 72px 0.85rem 0.5rem !important;
        height: auto !important;
        max-height: none !important;
        min-height: 0 !important;
        border-bottom: none !important;
      }
      .dashboard-header .welcome-actions app-streak-icon,
      .dashboard-header .welcome-actions .plan-badge,
      .dashboard-header .welcome-actions .btn-upgrade-pro,
      .dashboard-header .welcome-actions .profile-menu-wrap { display: none !important; }
      .mobile-header.mobile-header-with-pro ~ .main-content .dashboard-header { padding-top: 116px !important; }
      .dashboard-body { padding: 1rem 0.85rem 2rem !important; display: flex !important; flex-direction: column !important; align-items: center !important; }
      .welcome-actions { flex-wrap: wrap; gap: 0.5rem; width: 100%; }
      .setup-container { padding: 1.25rem !important; }
      .materias-grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); }
    }
    @media (max-width: 480px) {
      .setup-container { padding: 1rem !important; }
      .materias-grid { grid-template-columns: repeat(2, 1fr); }
    }
  `]
})
export class MiniEnsayoSetupComponent implements OnInit {
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
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  hasLastCompleted = signal<boolean>(false);
  dailyStatus = signal<{ allowed: boolean; nextAvailableAt?: Date }>({ allowed: true });

  materias: MateriaOption[] = [
    { id: 'competencia-lectora', label: 'Comp. Lectora', icon: 'assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_Lenguaje.svg' },
    { id: 'matematicas-m1', label: 'Matemáticas M1', icon: 'assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_m1.svg' },
    { id: 'matematicas-m2', label: 'Matemáticas M2', icon: 'assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_m2.svg' },
    { id: 'ciencias-biologia', label: 'Biología', icon: 'assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_Biologia.svg' },
    { id: 'ciencias-fisica', label: 'Física', icon: 'assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_Fisica.svg' },
    { id: 'ciencias-quimica', label: 'Química', icon: 'assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_Quimica.svg' },
    { id: 'ciencias-tp', label: 'Ciencias TP', icon: 'assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_TecnicoProfesional.svg' },
    { id: 'historia', label: 'Historia', icon: 'assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_Historia.svg' },
  ];

  selectedMateria = signal<MateriaId | null>(null);
  availableTopics = signal<{topic: string; count: number}[]>([]);
  selectedTopics = signal<string[]>([]);
  questionCount = signal<16 | 24 | 30>(24);
  mode = signal<'personalizado' | 'mejorador'>('personalizado');
  sourceIntento = signal<any>(null);

  totalAvailableQuestions = computed(() => {
    const topics = this.selectedTopics();
    const available = this.availableTopics();
    return available.filter(t => topics.includes(t.topic)).reduce((sum, t) => sum + t.count, 0);
  });

  allTopicsSelected = computed(() => {
    const available = this.availableTopics();
    const selected = this.selectedTopics();
    return available.length > 0 && available.length === selected.length;
  });

  ngOnInit() {
    this.hasLastCompleted.set(!!this.miniEnsayoSvc.getLastCompletedResult());
    this.dailyStatus.set(this.miniEnsayoSvc.canStartToday());
    if (!this.isProPlan() && !this.adminService.isAdmin()) {
      this.questionCount.set(16);
    }

    // El banco de preguntas se carga bajo demanda (no es parte de la carga inicial de la app)
    this.paesContent.ensurePoolPreguntasLoaded();

    this.route.queryParams.subscribe(async params => {
      if (params['mode'] === 'mejorador') {
        this.mode.set('mejorador');

        const matId = params['materiaId'] as MateriaId;
        if (matId) {
          this.selectedMateria.set(matId);
          await this.paesContent.ensurePoolPreguntasLoaded();
          this.availableTopics.set(this.miniEnsayoSvc.getAvailableTopics(matId));

          if (params['topics']) {
            this.selectedTopics.set(params['topics'].split(','));
          } else {
            // Fallback: select all available topics
            this.selectedTopics.set(this.availableTopics().map(t => t.topic));
          }
          
          if (params['sourceIntento']) {
            try {
              this.sourceIntento.set(JSON.parse(params['sourceIntento']));
            } catch (e) {}
          }
          
          // Force question count to 24 (mejorador mode)
          this.questionCount.set(24);
          
          // Auto-start mini-ensayo
          setTimeout(() => {
            if (this.isValid()) {
              this.startMiniEnsayo();
            }
          }, 300);
        }
      }
    });
  }

  async selectMateria(id: MateriaId) {
    this.selectedMateria.set(id);
    await this.paesContent.ensurePoolPreguntasLoaded();
    this.availableTopics.set(this.miniEnsayoSvc.getAvailableTopics(id));
    // Check all by default if not pre-filled
    if (this.mode() !== 'mejorador') {
      this.selectedTopics.set(this.availableTopics().map(t => t.topic));
    }
  }

  toggleTopic(topic: string) {
    const curr = this.selectedTopics();
    if (curr.includes(topic)) {
      this.selectedTopics.set(curr.filter(t => t !== topic));
    } else {
      this.selectedTopics.set([...curr, topic]);
    }
  }

  toggleAllTopics() {
    if (this.allTopicsSelected()) {
      this.selectedTopics.set([]);
    } else {
      this.selectedTopics.set(this.availableTopics().map(t => t.topic));
    }
  }

  setCount(count: number) {
    this.questionCount.set(count as 16 | 24 | 30);
  }

  isValid(): boolean {
    return !!this.selectedMateria() && 
           this.selectedTopics().length > 0 && 
           this.totalAvailableQuestions() >= 1; // At least 1 question
  }

  viewLastMiniEnsayo() {
    const last = this.miniEnsayoSvc.getLastCompletedResult();
    if (!last) return;
    this.miniEnsayoSvc.setLastResult(last);
    this.router.navigate(['/mini-ensayo/review']);
  }

  async startMiniEnsayo() {
    if (!this.isValid()) return;
    await this.paesContent.ensurePoolPreguntasLoaded();

    if (!this.isProPlan() && !this.adminService.isAdmin()) {
      const status = this.miniEnsayoSvc.canStartToday();
      if (!status.allowed) {
        this.toast.info('Ya usaste tu Mini Ensayo gratis de hoy. Vuelve mañana o pásate a PRO para ilimitados.');
        return;
      }
    }

    let finalCount = this.questionCount();
    if (this.totalAvailableQuestions() < finalCount) {
      // Adjust count to what's available
      finalCount = this.totalAvailableQuestions() as any;
    }

    this.miniEnsayoSvc.generateSession({
      materiaId: this.selectedMateria()!,
      selectedTopics: this.selectedTopics(),
      questionCount: finalCount as any,
      timeLimitMinutes: 60,
      mode: this.mode(),
      sourceIntento: this.sourceIntento()
    });

    this.router.navigate(['/mini-ensayo/run']);
  }
}
