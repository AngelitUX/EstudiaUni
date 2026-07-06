import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PaesContentService } from './services/paes-content.service';
import { AuthService } from '../../core/services/auth.service';
import { FirestoreService } from '../../core/services/firestore.service';
import { Materia } from './models/paes.models';
import { SettingsModalComponent } from '../profile/settings-modal.component';
import { ProfileModalComponent } from '../profile/profile-modal.component';
import { AdminService } from '../admin/services/admin.service';
import { PaymentService } from '../../core/services/payment.service';

@Component({
  selector: 'app-learning-path',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SettingsModalComponent, ProfileModalComponent],
  template: `
    <div class="lp-layout">
      <!-- SIDEBAR -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <a routerLink="/dashboard" class="sidebar-logo" style="text-decoration:none;"><span class="text-gradient" [class.pro-logo]="isProPlan()">EstudiaUni</span></a>
        </div>
        <nav class="sidebar-nav">
          <a class="nav-item" routerLink="/dashboard"><span class="nav-icon">🏠</span><span class="nav-text">Inicio</span></a>
          <a class="nav-item active" routerLink="/ruta"><span class="nav-icon">🗺️</span><span class="nav-text">Ruta de Aprendizaje</span></a>
          <a class="nav-item" routerLink="/ensayos"><span class="nav-icon">📚</span><span class="nav-text">Ensayos PAES</span></a>
          <a class="nav-item" routerLink="/mini-ensayo"><span class="nav-icon">🎯</span><span class="nav-text">Mini Ensayos</span></a>
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
          <div *ngIf="!isProPlan() && !adminService.isAdmin()" class="sidebar-promo-card">
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
        <button class="mobile-menu-btn" (click)="mobileOpen = !mobileOpen">☰</button>
        <a routerLink="/dashboard" style="text-decoration:none;"><span class="text-gradient" [class.pro-logo]="isProPlan()">EstudiaUni</span></a>
      </div>
      <div class="mobile-overlay" [class.open]="mobileOpen" (click)="mobileOpen = false">
        <div class="mobile-menu" (click)="$event.stopPropagation()">
          <nav class="sidebar-nav">
            <a class="nav-item" routerLink="/dashboard" (click)="mobileOpen=false"><span class="nav-icon">🏠</span><span class="nav-text">Inicio</span></a>
            <a class="nav-item active" routerLink="/ruta" (click)="mobileOpen=false"><span class="nav-icon">🗺️</span><span class="nav-text">Ruta de Aprendizaje</span></a>
            <a class="nav-item" routerLink="/ensayos" (click)="mobileOpen=false"><span class="nav-icon">📚</span><span class="nav-text">Ensayos PAES</span></a>
            <a class="nav-item" routerLink="/mini-ensayo" (click)="mobileOpen=false"><span class="nav-icon">🎯</span><span class="nav-text">Mini Ensayos</span></a>
            <a class="nav-item" routerLink="/mente-veloz" (click)="mobileOpen=false"><span class="nav-icon">⚡</span><span class="nav-text">Mente Veloz</span></a>
            
            <div class="sidebar-section-title" (click)="toggleHerramientas()">
              HERRAMIENTAS
              <span class="toggle-icon" [style.transform]="herramientasExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'">▼</span>
            </div>
            <div class="sidebar-sub-items" [class.expanded]="herramientasExpanded" [class.collapsible]="isCollapsible">
              <a class="nav-item" routerLink="/encuentra-tu-carrera" (click)="mobileOpen=false"><span class="nav-icon">🎓</span><span class="nav-text">Encuentra tu Carrera</span></a>
              <a class="nav-item" routerLink="/calculadora-nem" (click)="mobileOpen=false"><span class="nav-icon">🧮</span><span class="nav-text">Calculadora NEM</span></a>
              <a class="nav-item" routerLink="/recursos" (click)="mobileOpen=false"><span class="nav-icon">📂</span><span class="nav-text">Recursos Adicionales</span></a>
            </div>
          </nav>
          <div class="mobile-footer" style="padding: 1rem; border-top: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; gap: 0.5rem;">
            <a class="nav-item" (click)="showSettingsModal = true; mobileOpen=false">
              <span class="nav-icon">⚙️</span>
              <span class="nav-text">Configuración</span>
            </a>
            <a class="nav-item logout-btn-sidebar" (click)="confirmLogout(); mobileOpen=false">
              <span class="nav-icon">🚪</span>
              <span class="nav-text">Cerrar Sesión</span>
            </a>
          </div>
        </div>
      </div>

      <!-- MAIN -->
      <main class="main-content animate-fade-in-down">
        <!-- HEADER -->
        <header class="dashboard-header">
          <div class="header-welcome-text">
            <h1 class="header-greeting"><span class="text-gradient">Ruta de Aprendizaje</span></h1>
            <p class="subtitle" style="color: rgba(255,255,255,0.7); font-size: 0.95rem; margin: 0; font-weight: 500;">Elige una materia para empezar tu camino PAES 🚀</p>
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
          <div *ngIf="paes.loading()" class="loading-state">
            <div class="loader"></div>
            <p>Cargando materias...</p>
          </div>

          <ng-container *ngIf="!paes.loading()">
            <!-- CONTROLS ROW -->
            <div class="controls-row" *ngIf="filteredAndSortedMaterias().length > 0">
              <div class="countdown-row">
                <span class="countdown-label">⏳ {{ nextExamLabel }}:</span>
                <div class="countdown-timer">
                  <div class="time-unit"><span>{{ countdown.days }}</span><label>d</label></div>
                  <div class="time-unit"><span>{{ countdown.hours }}</span><label>h</label></div>
                  <div class="time-unit"><span>{{ countdown.minutes }}</span><label>m</label></div>
                </div>
              </div>

              <!-- Stats Widget -->
              <div class="overall-stats" style="margin-left: auto; margin-right: auto;">
                <div class="ov-stat">
                  <span class="ov-val">{{ totalCompleted() }}</span>
                  <span class="ov-label">Completadas</span>
                </div>
                <div class="ov-stat accent">
                  <span class="ov-val">{{ totalSections() }}</span>
                  <span class="ov-label">Total</span>
                </div>
              </div>

              <div class="filters-row">
                <div class="filter-group">
                  <label for="sortOrder">Ordenar por:</label>
                  <select id="sortOrder" [ngModel]="sortOrder()" (ngModelChange)="sortOrder.set($event)">
                    <option value="default">Por Defecto</option>
                    <option value="progress-desc">Más Avanzado a Menos Avanzado</option>
                    <option value="progress-asc">Menos Avanzado a Más Avanzado</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- MATERIAS GRID -->
            <div class="materias-grid" *ngIf="filteredAndSortedMaterias().length > 0">
              <div *ngFor="let m of filteredAndSortedMaterias()"
                class="materia-card horizontal-card"
                [class.has-progress]="getMateriaProgress(m.id).percentage > 0"
                [class.completed]="getMateriaProgress(m.id).percentage === 100"
                [style.background-color]="getMateriaInfo(m).bgColor || '#fff'"
                (click)="goToMateria(m)">

                <!-- Izquierda: Imagen grande -->
                <div class="card-image-col">
                  <img [src]="getMateriaInfo(m).img" [alt]="m.title" class="materia-main-img" />
                </div>

                <!-- Derecha: Contenido -->
                <div class="card-content-col">
                  <!-- Título y Estado -->
                  <div class="card-header-row">
                    <h2>{{ m.title }}</h2>
                    <div class="status-badges">
                      <span class="status-badge" *ngIf="getMateriaProgress(m.id).percentage > 0 && getMateriaProgress(m.id).percentage < 100">EN CURSO</span>
                      <span class="status-badge badge-complete" *ngIf="getMateriaProgress(m.id).percentage === 100">COMPLETADA</span>
                      <span class="status-badge badge-new" *ngIf="getMateriaProgress(m.id).percentage === 0">NUEVO</span>
                    </div>
                  </div>

                  <!-- Descripción -->
                  <p class="materia-desc">{{ getMateriaInfo(m).desc }}</p>

                  <!-- Mini lista de temas/capítulos -->
                  <div class="materia-topics">
                    <span class="topic-tag" *ngFor="let topic of getMateriaInfo(m).topics">{{ topic }}</span>
                  </div>

                  <!-- Footer: Progreso y Botón -->
                  <div class="card-footer-row">
                    <div class="progress-info-wrap">
                      <div class="stats-text">
                        <span class="stat-item"><strong>{{ getCapCount(m.id) }}</strong> Capítulos</span>
                        <span class="stat-sep">·</span>
                        <span class="stat-item"><strong>{{ getSectionCount(m.id) }}</strong> Lecciones</span>
                      </div>
                      <div class="prog-bar-container">
                        <div class="prog-bar-track">
                          <div class="prog-bar-fill"
                            [class.fill-green]="getMateriaProgress(m.id).percentage === 100"
                            [style.width.%]="getMateriaProgress(m.id).percentage">
                          </div>
                        </div>
                        <span class="prog-text-small">{{ getMateriaProgress(m.id).completed }}/{{ getMateriaProgress(m.id).total }}</span>
                      </div>
                    </div>

                    <!-- Botón -->
                    <div class="cta-wrap">
                      <button class="btn-main-action"
                        [class.btn-start]="getMateriaProgress(m.id).percentage === 0"
                        [class.btn-continue]="getMateriaProgress(m.id).percentage > 0 && getMateriaProgress(m.id).percentage < 100"
                        [class.btn-review]="getMateriaProgress(m.id).percentage === 100">
                        {{ getMateriaProgress(m.id).percentage === 0 ? 'EMPEZAR' : getMateriaProgress(m.id).percentage === 100 ? 'REPASAR' : 'CONTINUAR' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- HIDDEN MATERIAS BANNER -->
            <div *ngIf="hiddenMaterias().length > 0 && filteredAndSortedMaterias().length > 0" class="hidden-materias-banner animate-fade-in" style="margin-top: 1.5rem; background: rgba(255,255,255,0.7); border: 1.5px dashed rgba(133,92,214,0.4); border-radius: 16px; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap;">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span style="font-size: 1.5rem;">👁️‍🗨️</span>
                <p style="margin: 0; font-size: 0.95rem; color: var(--text-secondary); line-height: 1.4;">
                  Tienes materias ocultas en tu ruta: <strong style="color: var(--text-primary);">{{ getHiddenMateriasText() }}</strong>. 
                </p>
              </div>
              <button class="btn-profile-redirect" (click)="openProfileModal('subjects-section')" style="margin-top: 0; padding: 0.65rem 1.25rem; font-size: 0.85rem; border-radius: 12px; white-space: nowrap;">
                Activar en perfil ⚙️
              </button>
            </div>

            <!-- EMPTY STATE MESSAGE -->
            <div *ngIf="filteredAndSortedMaterias().length === 0" class="empty-path-container animate-fade-in">
              <div class="empty-path-card glass">
                <div class="empty-icon-wrap">
                  <span class="empty-icon">🗺️</span>
                </div>
                <h2>Tu Ruta está vacía</h2>
                <p>Por favor, elige las materias de tu interés en tu perfil para armar tu ruta de aprendizaje.</p>
                <button class="btn-profile-redirect" (click)="showProfileModal = true">
                  Configurar materias en mi perfil ⚙️
                </button>
              </div>
            </div>
          </ng-container>
        </div>
      </main>
      <app-settings-modal *ngIf="showSettingsModal" (close)="onSettingsClose()"></app-settings-modal>
      <app-profile-modal *ngIf="showProfileModal" [scrollTarget]="profileScrollTarget" (close)="onProfileModalClose()"></app-profile-modal>

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
    :host { display: block; min-height: 100vh; background: #f8f9fa; color: var(--text-primary); }
    .lp-layout { display: flex; min-height: 100vh; }
    .text-gradient { background: var(--gradient-brand); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

    /* SIDEBAR */
    .sidebar { width: 260px; background: rgba(13,15,23,0.95); border-right: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; height: 100vh; z-index: 100; }
    .sidebar-header { padding: 2.5rem 1.5rem 2rem; border-bottom: 1px solid rgba(255,255,255,0.15); text-align: center; }
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
    .nav-item { display: flex; align-items: center; gap: 0.85rem; padding: 0.9rem 1.1rem; border-radius: 12px; color: #ffffff; text-decoration: none; transition: all 0.2s; cursor: pointer; background: transparent; border: none; width: 100%; text-align: left; font-size: 1.05rem; font-weight: 500; }
    .nav-item:hover { background: rgba(255,255,255,0.12); color: #fff; transform: translateX(4px); }
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
    .logout-confirm-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: grid; place-items: center; z-index: 11000; padding: 1.5rem; animation: fadeIn 0.2s ease; }
    .logout-confirm-modal { max-width: 420px !important; background: rgba(255,255,255,0.95); border: 2px solid var(--glass-border); border-radius: 24px; box-shadow: 0 20px 50px rgba(0,0,0,0.2); width: 100%; overflow: hidden; }
    .modal-header { padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--glass-border); }
    .modal-header h2 { margin: 0; font-size: 1.25rem; font-weight: 800; color: var(--text-primary); }
    .close-btn { background: none; border: none; font-size: 1.75rem; color: var(--text-muted); cursor: pointer; line-height: 1; transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), color 0.2s ease; }
    .close-btn:hover { transform: rotate(90deg) scale(1.1); color: #ef4444 !important; }
    .modal-body { padding: 1.5rem; }
    .confirm-content { text-align: center; padding: 1rem 0; }
    .confirm-icon { font-size: 3.5rem; margin-bottom: 1rem; }
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

    /* MOBILE */
    .mobile-header { display: none; position: fixed; top: 0; left: 0; right: 0; height: 60px; background: rgba(13,15,23,0.95); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.1); padding: 0 1rem; align-items: center; gap: 1rem; z-index: 101; }
    .mobile-menu-btn { background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; }
    .mobile-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); z-index: 200; }
    .mobile-overlay.open { display: block; }
    .mobile-menu { position: absolute; top: 0; left: 0; width: 280px; height: 100%; background: #0d0f17; padding: 2rem 1rem; }

    /* MAIN */
    .main-content { flex: 1; margin-left: 260px; max-width: calc(100% - 260px); }

    .overall-stats { display: flex; gap: 0.75rem; }
    .ov-stat { background: #fff; border: 2px solid rgba(0,0,0,0.06); border-radius: 14px; padding: 0.75rem 1.25rem; text-align: center; min-width: 75px; }
    .ov-stat.accent { border-color: rgba(133,92,214,0.15); background: rgba(133,92,214,0.03); }
    .ov-val { display: block; font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: var(--text-primary); line-height: 1; }
    .ov-label { font-size: 0.68rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.04em; font-weight: 600; }

    /* CONTROLS ROW */
    .controls-row { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.5rem; }

    /* COUNTDOWN WIDGET */
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
    .countdown-label { font-size: 0.85rem; font-weight: 700; color: #64748b; }
    .countdown-timer { display: flex; gap: 0.75rem; }
    .time-unit { display: flex; align-items: baseline; gap: 2px; }
    .time-unit span { font-size: 1rem; font-weight: 800; color: var(--accent-primary); min-width: 20px; text-align: center; }
    .time-unit label { font-size: 0.75rem; font-weight: 600; color: #94a3b8; }

    /* FILTERS */
    .filters-row {
      display: flex;
      gap: 1.5rem;
      background: #fff;
      padding: 0.6rem 1.25rem;
      border-radius: 12px;
      border: 2px solid rgba(0,0,0,0.06);
      align-items: center;
      flex-wrap: wrap;
    }
    .filter-group {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .filter-group label {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text-secondary);
    }
    .filter-group select {
      padding: 0.5rem 1rem;
      border-radius: 8px;
      border: 2px solid rgba(0,0,0,0.06);
      background: #f8f9fa;
      font-family: inherit;
      font-weight: 600;
      color: var(--text-primary);
      cursor: pointer;
      outline: none;
      transition: all 0.2s;
    }
    .filter-group select:focus {
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 3px rgba(133,92,214,0.1);
    }

    /* MATERIAS GRID */
    .materias-grid { display: flex; flex-direction: column; gap: 1.5rem; }

    /* HORIZONTAL CARD */
    .horizontal-card { display: flex; flex-direction: row; gap: 2rem; padding: 2rem; background: #fff; border: 2px solid rgba(0,0,0,0.06); border-radius: 24px; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); align-items: stretch; }
    .horizontal-card:hover { transform: translateY(-4px); box-shadow: 0 20px 48px rgba(133,92,214,0.1); border-color: rgba(133,92,214,0.25); }

    /* IMAGE COLUMN */
    .card-image-col { flex: 0 0 360px; display: flex; align-items: center; justify-content: center; overflow: hidden; border-radius: 16px; }
    .materia-main-img { 
      width: 100%; 
      height: auto;
      max-height: 280px; 
      object-fit: contain; 
      border-radius: 12px; 
      transition: transform 0.4s ease;
      /* Efecto de difuminado en los bordes para mezcla suave */
      mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent),
                  linear-gradient(to bottom, transparent, black 5%, black 95%, transparent);
      mask-composite: intersect;
      -webkit-mask-composite: source-in;
    }
    .horizontal-card:hover .materia-main-img { transform: scale(1.05); }

    /* CONTENT COLUMN */
    .card-content-col { flex: 1; display: flex; flex-direction: column; justify-content: center; }
    .card-header-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; gap: 1rem; }
    .card-header-row h2 { font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; color: var(--text-primary); margin: 0; line-height: 1.2; }
    .status-badges { display: flex; gap: 0.5rem; }
    
    .status-badge { font-size: 0.75rem; font-weight: 700; padding: 0.35rem 0.85rem; border-radius: 99px; background: rgba(133,92,214,0.1); color: var(--accent-primary); white-space: nowrap; height: fit-content; }
    .status-badge.badge-complete { background: rgba(88,204,2,0.1); color: #3d8c00; }
    .status-badge.badge-new { background: rgba(0,0,0,0.05); color: var(--text-secondary); }

    /* DESC & TOPICS */
    .materia-desc { font-size: 1rem; color: var(--text-secondary); line-height: 1.6; margin: 0 0 1rem; max-width: 600px; }
    .materia-topics { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem; }
    .topic-tag { font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); background: #f1f5f9; padding: 0.3rem 0.75rem; border-radius: 6px; }

    /* FOOTER ROW */
    .card-footer-row { margin-top: auto; display: flex; justify-content: space-between; align-items: flex-end; gap: 1.5rem; flex-wrap: wrap; }
    
    /* STATS & PROG */
    .progress-info-wrap { flex: 1; min-width: 200px; }
    .stats-text { display: flex; gap: 0.5rem; color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 0.5rem; }
    .stats-text strong { color: var(--text-primary); font-family: var(--font-heading); }
    .stat-sep { opacity: 0.5; }
    
    .prog-bar-container { display: flex; align-items: center; gap: 0.75rem; }
    .prog-bar-track { flex: 1; height: 8px; background: rgba(0,0,0,0.06); border-radius: 99px; overflow: hidden; }
    .prog-bar-fill { height: 100%; background: linear-gradient(90deg, #855cd6, #a78bfa); border-radius: 99px; transition: width 0.6s ease; }
    .prog-bar-fill.fill-green { background: linear-gradient(90deg, #58cc02, #78d64b); }
    .prog-text-small { font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); white-space: nowrap; }

    /* BUTTON */
    .btn-main-action { padding: 0.85rem 2.5rem; border-radius: 14px; border: none; font-family: var(--font-heading); font-weight: 800; font-size: 1.05rem; letter-spacing: 0.03em; cursor: pointer; transition: all 0.2s; white-space: nowrap; text-transform: uppercase; }
    .btn-start { background: #ff9600; color: #fff; box-shadow: 0 4px 0 #cc7800; }
    .btn-start:hover { transform: translateY(2px); box-shadow: 0 2px 0 #cc7800; }
    .btn-continue { background: var(--accent-primary); color: #fff; box-shadow: 0 4px 0 #6b46b8; }
    .btn-continue:hover { transform: translateY(2px); box-shadow: 0 2px 0 #6b46b8; }
    .btn-review { background: #fff; color: #3d8c00; border: 2px solid rgba(88,204,2,0.3); padding: 0.7rem 2.5rem; }
    .btn-review:hover { background: rgba(88,204,2,0.05); border-color: #58cc02; }

    /* LOADING */
    .loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 50vh; color: var(--text-secondary); font-weight: 500; }
    .loader { width: 40px; height: 40px; border: 4px solid rgba(133,92,214,0.2); border-top-color: var(--accent-primary); border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1rem; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* EMPTY STATE */
    .empty-path-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 45vh;
      padding: 2rem;
    }
    .empty-path-card {
      background: rgba(255, 255, 255, 0.75);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.4);
      border-radius: 24px;
      padding: 3rem 2rem;
      max-width: 500px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.25rem;
    }
    .empty-icon-wrap {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(133, 92, 214, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 0.5rem;
      box-shadow: inset 0 2px 8px rgba(133, 92, 214, 0.05);
    }
    .empty-icon {
      font-size: 2.5rem;
      animation: float 3s ease-in-out infinite;
    }
    .empty-path-card h2 {
      font-family: var(--font-heading);
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--text-primary);
      margin: 0;
    }
    .empty-path-card p {
      font-size: 1.05rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0;
    }
    .btn-profile-redirect {
      margin-top: 0.5rem;
      background: linear-gradient(135deg, var(--accent-primary) 0%, #a78bfa 100%);
      color: #fff;
      border: none;
      padding: 0.95rem 2rem;
      border-radius: 16px;
      font-family: var(--font-heading);
      font-weight: 800;
      font-size: 1rem;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(133, 92, 214, 0.3), 0 2px 0 #6b46b8;
      transition: all 0.2s ease;
    }
    .btn-profile-redirect:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(133, 92, 214, 0.4), 0 2px 0 #6b46b8;
    }
    .btn-profile-redirect:active {
      transform: translateY(1px);
      box-shadow: 0 2px 8px rgba(133, 92, 214, 0.2), 0 0px 0 #6b46b8;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }

    @media (max-width: 768px) {
      .sidebar { display: none; }
      .mobile-header { display: flex; }
      .main-content { margin-left: 0; max-width: 100%; }
      .page-header { flex-direction: column; }
      
      .horizontal-card { flex-direction: column; gap: 1.5rem; padding: 1.5rem; }
      .card-image-col { flex: 0 0 auto; }
      .materia-main-img { max-height: 180px; }
      .card-footer-row { flex-direction: column; align-items: stretch; gap: 1.5rem; }
      .cta-wrap { width: 100%; }
      .btn-main-action { width: 100%; }
    }
  `]
})
export class LearningPathComponent implements OnInit, OnDestroy {
  public firestoreService = inject(FirestoreService);
  private auth = inject(AuthService);
  public paes = inject(PaesContentService);
  private router = inject(Router);
  public adminService = inject(AdminService);
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

  mobileOpen = false;
  showSettingsModal = false;
  showProfileModal = false;
  profileScrollTarget = '';
  showLogoutConfirm = false;

  openProfileModal(target = '') {
    this.profileScrollTarget = target;
    this.showProfileModal = true;
  }

  isProPlan = computed(() => {
    const p = this.firestoreService.profileSignal();
    return p?.plan === 'premium';
  });
  profileInitial = computed(() => {
    const p = this.firestoreService.profileSignal();
    return p?.displayName?.charAt(0).toUpperCase() || 'U';
  });

  countdown = { days: 0, hours: 0, minutes: 0 };
  nextExamLabel = '';
  private countdownInterval: any;

  userSelectedSubjects = computed(() => {
    const p = this.firestoreService.profileSignal();
    if (!p) return [];
    if (Array.isArray(p.selectedSubjects)) {
      return p.selectedSubjects;
    }
    // Default to all subjects if never configured
    return ['comp-lectora', 'mat1', 'mat2', 'historia', 'ciencias-tp', 'ciencias-biologia', 'ciencias-fisica', 'ciencias-quimica'];
  });
  sortOrder = signal<string>('default');

  filteredAndSortedMaterias = computed(() => {
    let list = [...this.paes.materias()];
    
    // Filter
    const selected = this.userSelectedSubjects();
    if (selected) {
      // Auto-include specific science branches if the legacy 'ciencias' is selected
      let effectiveSelected = [...selected];
      if (effectiveSelected.includes('ciencias')) {
        effectiveSelected.push('ciencias-biologia', 'ciencias-fisica', 'ciencias-quimica', 'ciencias-tp');
        // Remove the legacy 'ciencias' so they don't click the empty generic card
        effectiveSelected = effectiveSelected.filter(id => id !== 'ciencias');
      }
      list = list.filter(m => effectiveSelected.includes(m.id));
    }
    
    // Sort
    const s = this.sortOrder();
    if (s === 'progress-desc') {
      list.sort((a, b) => this.getMateriaProgress(b.id).percentage - this.getMateriaProgress(a.id).percentage);
    } else if (s === 'progress-asc') {
      list.sort((a, b) => this.getMateriaProgress(a.id).percentage - this.getMateriaProgress(b.id).percentage);
    }
    
    return list;
  });

  hiddenMaterias = computed(() => {
    const list = this.paes.materias();
    const visibleIds = this.filteredAndSortedMaterias().map(m => m.id);
    return list.filter(m => !visibleIds.includes(m.id) && m.id !== 'ciencias');
  });

  getHiddenMateriasText() {
    return this.hiddenMaterias().map(m => m.title).join(', ');
  }

  onSettingsClose() {
    this.showSettingsModal = false;
  }

  onProfileModalClose() {
    this.showProfileModal = false;
  }

  ngOnInit() {
    this.firestoreService.getUserProfile().subscribe();
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
    this.countdownInterval = setInterval(update, 60000);
  }

  materiaDataConfig: Record<string, { desc: string, topics: string[], img: string, bgColor?: string }> = {
    'comp-lectora': {
      desc: 'Desarrolla las tres habilidades fundamentales evaluadas en la PAES de Competencia Lectora: Localizar información explícita, Interpretar y relacionar ideas, y Evaluar reflexivamente los textos.',
      topics: ['Localizar', 'Interpretar', 'Evaluar'],
      img: 'assets/images/subjects/comp-lectora.png',
      bgColor: '#F7A08F'
    },
    'mat1': {
      desc: 'Domina los conceptos fundamentales de números, álgebra, geometría y probabilidad para asegurar un alto puntaje en la prueba M1.',
      topics: ['Números', 'Álgebra', 'Geometría', 'Probabilidad'],
      img: 'assets/images/subjects/mat1-v3.png',
      bgColor: '#A5B4FC'
    },
    'mat2': {
      desc: 'Enfréntate al temario de profundización de la prueba M2 con contenidos avanzados de números reales, logaritmos, trigonometría, geometría y estadística.',
      topics: ['Reales y Logaritmos', 'Trigonometría', 'Circunferencia', 'Dispersión y Modelos'],
      img: 'assets/images/subjects/mat1-v3.png',
      bgColor: '#C7D2FE'
    },
    'historia': {
      desc: 'Comprende los procesos históricos de Chile y el mundo, y analiza geografía y formación ciudadana de manera crítica.',
      topics: ['Historia de Chile', 'Historia Universal', 'Formación Ciudadana'],
      img: 'assets/images/historia.png'
    },
    'ciencias-fisica': {
      desc: 'Domina los conceptos de ondas, mecánica, energía y electricidad para resolver problemas de física aplicada.',
      topics: ['Ondas', 'Mecánica', 'Tierra', 'Electricidad'],
      img: 'assets/images/subjects/fisica.png',
      bgColor: '#DCCEF9'
    },
    'ciencias-tp': {
      desc: 'Prepárate para la prueba de Ciencias Técnico Profesional con enfoque en fenómenos aplicados al ámbito laboral.',
      topics: ['Biología TP', 'Física TP', 'Química TP'],
      img: 'assets/images/subjects/ciencias-tp.png',
      bgColor: '#F3D8AB'
    },
    'ciencias-biologia': {
      desc: 'Profundiza en la biología celular, herencia, procesos vitales, evolución e interacción de los organismos con su ambiente.',
      topics: ['Organización Celular', 'Herencia', 'Ecosistemas'],
      img: 'assets/images/subjects/biologia.png',
      bgColor: '#D0D9AC'
    },
    'ciencias-quimica': {
      desc: 'Estudia la estructura de la materia, enlaces, química orgánica y reacciones estequiométricas fundamentales.',
      topics: ['Estructura Atómica', 'Química Orgánica', 'Estequiometría'],
      img: 'assets/images/subjects/quimica.png',
      bgColor: '#B8F4D2'
    }
  };

  getMateriaInfo(m: Materia) {
    const config = this.materiaDataConfig[m.id];
    return {
      desc: config?.desc || 'Prepárate para la prueba con material actualizado y ejercicios prácticos.',
      topics: config?.topics || ['General', 'Ejercicios'],
      img: m.imageUrl || config?.img || 'assets/images/comp-lectora.png',
      bgColor: config?.bgColor
    };
  }

  totalCompleted = computed(() => {
    let total = 0;
    for (const m of this.paes.materias()) {
      total += this.paes.getMateriaProgress(m.id).completed;
    }
    return total;
  });

  totalSections = computed(() => {
    let total = 0;
    for (const m of this.paes.materias()) {
      total += this.paes.getMateriaProgress(m.id).total;
    }
    return total;
  });

  getMateriaProgress(materiaId: string) {
    return this.paes.getMateriaProgress(materiaId);
  }

  getCapCount(materiaId: string): number {
    return this.paes.getCapitulosByMateria(materiaId).length;
  }

  getSectionCount(materiaId: string): number {
    return this.paes.getCapitulosByMateria(materiaId)
      .reduce((acc, cap) => acc + cap.secciones.length, 0);
  }

  goToMateria(m: Materia) {
    this.router.navigate(['/ruta', m.id]);
  }

  confirmLogout() {
    this.showLogoutConfirm = true;
  }

  async executeLogout() {
    this.showLogoutConfirm = false;
    await this.auth.logout().toPromise();
    this.router.navigate(['/']);
  }

}
