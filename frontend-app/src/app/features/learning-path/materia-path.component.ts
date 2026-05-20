import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PaesContentService } from './services/paes-content.service';
import { AuthService } from '../../core/services/auth.service';
import { SettingsModalComponent } from '../profile/settings-modal.component';
import { ProfileModalComponent } from '../profile/profile-modal.component';
import { FirestoreService } from '../../core/services/firestore.service';
import { AdminService } from '../admin/services/admin.service';
import { PaymentService } from '../../core/services/payment.service';

type PathItem = 
  | { type: 'chapter', capituloId: string, title: string, subtitle: string, isCurrentChapter?: boolean }
  | { type: 'node', id: string, capituloId: string, title: string, status: 'completed' | 'active' | 'locked', nodeIndex: number };

@Component({
  selector: 'app-materia-path',
  standalone: true,
  imports: [CommonModule, RouterModule, SettingsModalComponent, ProfileModalComponent],
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
      <main class="main-content animate-fade-in-down" *ngIf="materia() as m">
        <!-- HEADER -->
        <header class="dashboard-header">
          <div class="header-welcome-text" style="flex-direction: row; align-items: center; gap: 1rem;">
            <button class="btn-back" routerLink="/ruta" style="background: transparent; border: none; color: #fff; font-size: 1.8rem; cursor: pointer; display: flex; align-items: center; padding: 0; line-height: 1;">
              <span>←</span>
            </button>
            <h1 class="header-greeting"><span class="text-gradient">{{ m.title }}</span></h1>
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
          <div class="materia-page">
          <!-- DUOLINGO PATH -->
          <div class="duo-path-container">
            <ng-container *ngFor="let item of pathItems()">
              <!-- CHAPTER SPLASH BANNER -->
              <div *ngIf="item.type === 'chapter'" class="chapter-splash" [ngClass]="item.capituloId">
                <div class="splash-bg-pattern"></div>
                <div class="splash-inner">
                  <div class="splash-hero">
                    <div class="splash-mascot-area">
                      <img src="assets/img/foco-octopus.png" alt="Foco" class="splash-mascot" />
                    </div>
                    <div class="splash-info">
                      <span class="splash-badge">Capítulo {{ getChapterNum(item.capituloId) }}</span>
                      <h2 class="splash-title">{{ item.title }}</h2>
                      <p class="splash-desc" *ngIf="item.capituloId === 'cap-localizar'">Identifica y extrae información explícita del texto. Domina sinónimos, paráfrasis y la técnica de escaneo.</p>
                      <div class="splash-stats">
                        <div class="ss"><span class="ss-icon">📊</span> ~30% de la PAES</div>
                        <div class="ss"><span class="ss-icon">📝</span> {{ getChapterNodeCount(item.capituloId) }} ejercicios</div>
                      </div>
                    </div>
                  </div>

                  <!-- Progress -->
                  <div class="splash-progress">
                    <div class="sp-header">
                      <span class="sp-label">Tu progreso</span>
                      <span class="sp-count">{{ getChapterProgress(item.capituloId).completed }} / {{ getChapterProgress(item.capituloId).total }}</span>
                    </div>
                    <div class="sp-track">
                      <div class="sp-fill" [style.width.%]="getChapterProgress(item.capituloId).pct"></div>
                    </div>
                  </div>

                  <!-- Guide CTA -->
                  <div class="guide-btn-wrapper" style="display: flex; gap: 0.5rem; justify-content: center; align-items: center;">
                    <div class="guide-tooltip" *ngIf="item.isCurrentChapter && !isGuideCompleted(item.capituloId)">
                      EMPEZAR
                      <div class="tooltip-arrow"></div>
                    </div>
                    <button class="splash-guide-btn" (click)="goToGuide(item.capituloId)" style="flex: 1;">
                      <span class="sgb-icon">📖</span> Estudiar la Guía
                    </button>
                    <button *ngIf="adminService.isAdmin()"
                      class="admin-guide-toggle-btn"
                      [class.completed]="isGuideCompleted(item.capituloId)"
                      [title]="isGuideCompleted(item.capituloId) ? 'Marcar guía como incompleta' : 'Marcar guía como completada'"
                      (click)="toggleGuideCompletion($event, item.capituloId)">
                      <span class="admin-guide-icon-default">
                        {{ isGuideCompleted(item.capituloId) ? '✓ Guía' : '⚡ Completar' }}
                      </span>
                      <span class="admin-guide-icon-hover">
                        ✕ Quitar
                      </span>
                    </button>
                  </div>
                </div>

                <!-- Visual separator -->
                <div class="splash-separator">
                  <div class="sep-line"></div>
                  <span class="sep-text">Tu ruta comienza aquí ↓</span>
                  <div class="sep-line"></div>
                </div>
              </div>

              <!-- SECTION NODE -->
              <div *ngIf="item.type === 'node'" class="node-row">
                <div class="node-wrapper" [style.transform]="'translateX(' + getOffset(item.nodeIndex) + 'px)'">
                  <div class="active-tooltip" *ngIf="item.status === 'active'">
                    {{ getChapterProgress(item.capituloId).completed === 0 ? 'EMPEZAR' : 'CONTINUAR' }}
                    <div class="tooltip-arrow"></div>
                  </div>

                  <!-- Admin toggle node button -->
                  <button *ngIf="adminService.isAdmin()"
                    class="admin-node-toggle"
                    [class.completed]="item.status === 'completed'"
                    [title]="item.status === 'completed' ? 'Marcar lección como incompleta' : 'Marcar lección como completada'"
                    (click)="toggleNodeCompletion($event, item)">
                    <span class="admin-toggle-icon-default">{{ item.status === 'completed' ? '✓' : '+' }}</span>
                    <span class="admin-toggle-icon-hover">✕</span>
                  </button>

                  <button class="duo-node" 
                    [class.node-completed]="item.status === 'completed'"
                    [class.node-active]="item.status === 'active'"
                    [class.node-locked]="item.status === 'locked'"
                    (click)="handleNodeClick(item)">
                    <div class="node-inner">
                      <svg *ngIf="item.status === 'completed'" class="node-icon icon-star" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <svg *ngIf="item.status === 'active'" class="node-icon icon-star" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <svg *ngIf="item.status === 'locked'" class="node-icon icon-lock" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
                      </svg>
                    </div>
                  </button>
                  <div class="node-title" 
                    [class.text-completed]="item.status === 'completed'"
                    [class.text-active]="item.status === 'active'">
                    {{ item.title }}
                  </div>
                </div>
              </div>
            </ng-container>
          </div>
        </div>
        </div>
      </main>
    </div>
    <app-profile-modal *ngIf="showProfileModal" (close)="showProfileModal = false"></app-profile-modal>
    <app-settings-modal *ngIf="showSettingsModal" (close)="showSettingsModal = false"></app-settings-modal>

    <!-- CUSTOM LOGOUT CONFIRMATION -->
    <div class="modal-overlay logout-confirm-overlay" *ngIf="showLogoutConfirm" (click)="showLogoutConfirm = false">
      <div class="modal-container glass logout-confirm-modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Cerrar Sesión</h2>
          <button class="close-btn" (click)="showLogoutConfirm = false">&times;</button>
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
    :host { display: block; min-height: 100vh; background: var(--bg-color); color: var(--text-primary); }
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
    .sidebar-nav { flex: 1; padding: 1rem 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; }
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

    .materia-page { max-width: 600px; margin: 0 auto; padding-bottom: 6rem; position: relative; }

    /* BACK BUTTON OVERRIDES */
    .btn-back { background: transparent; border: none; font-size: 1.5rem; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; transition: all 0.2s; }
    .btn-back:hover { background: rgba(255,255,255,0.15); color: #fff; transform: translateX(-4px); }

    /* PATH CONTAINER */
    .duo-path-container { position: relative; padding: 2rem 0; display: flex; flex-direction: column; align-items: center; overflow: hidden; }

    /* CHAPTER SPLASH BANNER */
    .chapter-splash { width: 100%; max-width: 600px; margin: 0 auto 7rem; position: relative; z-index: 15; border-radius: 28px; overflow: hidden; border: 2px solid rgba(133,92,214,0.15); box-shadow: 0 12px 40px rgba(133,92,214,0.08); }
    .chapter-splash.cap-localizar { background: linear-gradient(150deg, #f3eeff 0%, #e8dff8 40%, #f0ebff 100%); }
    .chapter-splash.cap-interpretar { background: linear-gradient(150deg, #e8f4fd 0%, #d6ecfa 40%, #eaf6ff 100%); }
    .chapter-splash.cap-evaluar { background: linear-gradient(150deg, #e8fde8 0%, #d6f5d6 40%, #eaffea 100%); }
    .splash-bg-pattern { position: absolute; inset: 0; opacity: 0.04; background-image: radial-gradient(circle at 20% 50%, var(--accent-primary) 1px, transparent 1px), radial-gradient(circle at 80% 20%, var(--accent-primary) 1px, transparent 1px), radial-gradient(circle at 60% 80%, var(--accent-primary) 1px, transparent 1px); background-size: 40px 40px, 60px 60px, 50px 50px; pointer-events: none; }
    .splash-inner { position: relative; padding: 2rem 2rem 1.5rem; }
    .splash-hero { display: flex; align-items: center; gap: 1.5rem; }
    .splash-mascot-area { flex-shrink: 0; }
    .splash-mascot { width: 110px; height: 110px; object-fit: contain; animation: mascotFloat 4s ease-in-out infinite; filter: drop-shadow(0 8px 16px rgba(133,92,214,0.2)); }
    @keyframes mascotFloat { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-8px) rotate(2deg)} }
    .splash-info { flex: 1; min-width: 0; }
    .splash-badge { display: inline-block; background: var(--accent-primary); color: #fff; font-family: var(--font-heading); font-size: 0.75rem; font-weight: 800; padding: 0.3rem 0.75rem; border-radius: 99px; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.4rem; }
    .splash-title { font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin: 0 0 0.35rem; line-height: 1.2; }
    .splash-desc { font-size: 0.88rem; line-height: 1.5; color: var(--text-secondary); margin: 0 0 0.65rem; }
    .splash-stats { display: flex; gap: 1rem; flex-wrap: wrap; }
    .ss { display: flex; align-items: center; gap: 0.3rem; font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); background: rgba(255,255,255,0.6); padding: 0.3rem 0.6rem; border-radius: 8px; }
    .ss-icon { font-size: 0.9rem; }

    /* Progress */
    .splash-progress { margin-top: 1.25rem; padding: 0.85rem 1rem; background: rgba(255,255,255,0.5); border-radius: 14px; border: 1px solid rgba(0,0,0,0.04); }
    .sp-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
    .sp-label { font-size: 0.78rem; font-weight: 700; color: var(--text-secondary); }
    .sp-count { font-family: var(--font-heading); font-size: 0.85rem; font-weight: 800; color: var(--accent-primary); }
    .sp-track { width: 100%; height: 10px; background: rgba(0,0,0,0.06); border-radius: 99px; overflow: hidden; }
    .sp-fill { height: 100%; background: linear-gradient(90deg, #58cc02, #78e000); border-radius: 99px; transition: width 0.6s cubic-bezier(0.16,1,0.3,1); min-width: 4px; }

    /* Guide CTA */
    .guide-btn-wrapper { position: relative; width: 100%; margin-top: 2rem; }
    .guide-tooltip { position: absolute; top: -45px; left: 50%; transform: translateX(-50%); background: #111827; color: #fff; font-family: var(--font-heading); font-size: 0.85rem; font-weight: 800; padding: 0.6rem 1rem; border-radius: 12px; letter-spacing: 0.05em; animation: bounce 2s infinite; white-space: nowrap; box-shadow: 0 6px 16px rgba(0,0,0,0.15); z-index: 10; pointer-events: none; }
    .guide-tooltip .tooltip-arrow { position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 8px solid #111827; }
    .splash-guide-btn { display: flex; align-items: center; justify-content: center; gap: 0.5rem; width: 100%; padding: 0.85rem; background: rgba(255,255,255,0.7); border: 2px solid rgba(133,92,214,0.2); border-radius: 14px; font-family: var(--font-heading); font-size: 0.95rem; font-weight: 800; color: var(--accent-primary); cursor: pointer; transition: all 0.2s; }
    .splash-guide-btn:hover { background: var(--accent-primary); color: #fff; border-color: var(--accent-primary); transform: translateY(-2px); box-shadow: 0 6px 16px rgba(133,92,214,0.25); }
    .sgb-icon { font-size: 1.1rem; }

    /* Separator */
    .splash-separator { display: flex; align-items: center; gap: 0.75rem; padding: 1.25rem 2rem 1.5rem; }
    .sep-line { flex: 1; height: 2px; background: linear-gradient(90deg, transparent, rgba(133,92,214,0.15), transparent); }
    .sep-text { font-size: 0.78rem; font-weight: 700; color: var(--text-muted); white-space: nowrap; }

    /* NODE ROW */
    .node-row { width: 100%; display: flex; justify-content: center; margin-bottom: 6.5rem; position: relative; z-index: 2; }
    .node-wrapper { position: relative; display: flex; flex-direction: column; align-items: center; transition: transform 0.3s ease; }

    /* NODE FLOATING TITLE (BOTTOM) */
    .node-title { position: absolute; bottom: -32px; left: 50%; transform: translateX(-50%); font-family: var(--font-heading); font-size: 0.95rem; font-weight: 800; color: var(--text-secondary); white-space: nowrap; pointer-events: none; transition: all 0.2s; text-shadow: 0 2px 4px rgba(255,255,255,1), 0 0 10px rgba(255,255,255,1); }
    .text-completed { color: #3d8c00; }
    .text-active { color: var(--accent-primary); bottom: -36px; }

    /* ACTIVE TOOLTIP */
    .active-tooltip { position: absolute; top: -55px; background: #111827; color: #fff; font-family: var(--font-heading); font-size: 0.85rem; font-weight: 800; padding: 0.6rem 1rem; border-radius: 12px; letter-spacing: 0.05em; animation: bounce 2s infinite; white-space: nowrap; box-shadow: 0 6px 16px rgba(0,0,0,0.15); z-index: 10; }
    .tooltip-arrow { position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 8px solid #111827; }

    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-8px); }
      60% { transform: translateY(-4px); }
    }

    /* DUO NODE BUTTON */
    .duo-node { border: none; border-radius: 50%; padding: 0; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); position: relative; outline: none; -webkit-tap-highlight-color: transparent; }
    .node-inner { width: 72px; height: 72px; border-radius: 50%; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
    .node-icon { width: 32px; height: 32px; }

    /* COMPLETED STATE */
    .node-completed { background: #58cc02; box-shadow: 0 6px 0 #46a302; }
    .node-completed .node-inner { background: linear-gradient(180deg, #65e003, #58cc02); }
    .node-completed .node-icon { color: white; }
    .node-completed:active { transform: translateY(6px); box-shadow: 0 0 0 #46a302; }

    /* ACTIVE STATE */
    .node-active { background: #ce82ff; box-shadow: 0 8px 0 #a559d6, 0 0 0 8px rgba(206,130,255,0.2); transform: scale(1.1); animation: pulseRing 3s infinite; }
    .node-active .node-inner { background: linear-gradient(180deg, #dfa6ff, #ce82ff); border: 4px solid white; width: 76px; height: 76px; }
    .node-active .node-icon { color: white; width: 36px; height: 36px; }
    .node-active:active { transform: scale(1.1) translateY(8px); box-shadow: 0 0 0 #a559d6, 0 0 0 4px rgba(206,130,255,0.2); }

    /* LOCKED STATE */
    .node-locked { background: #e5e5e5; box-shadow: 0 6px 0 #cccccc; cursor: not-allowed; }
    .node-locked .node-inner { background: #e5e5e5; }
    .node-locked .node-icon { color: #afafaf; }
    .node-locked:active { transform: translateY(6px); box-shadow: 0 0 0 #cccccc; }

    @keyframes pulseRing {
      0% { box-shadow: 0 8px 0 #a559d6, 0 0 0 0 rgba(206,130,255,0.4); }
      70% { box-shadow: 0 8px 0 #a559d6, 0 0 0 15px rgba(206,130,255,0); }
      100% { box-shadow: 0 8px 0 #a559d6, 0 0 0 0 rgba(206,130,255,0); }
    }

    .admin-node-toggle {
      position: absolute;
      top: -8px;
      right: -8px;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: rgba(15, 23, 42, 0.9);
      border: 2px solid rgba(255, 255, 255, 0.2);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 20;
      font-size: 0.9rem;
      font-weight: 800;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    .admin-node-toggle:hover {
      transform: scale(1.15);
      background: #1e293b;
      border-color: var(--accent-primary);
      box-shadow: 0 6px 16px rgba(133, 92, 214, 0.4);
    }
    .admin-node-toggle.completed {
      background: #58cc02;
      border-color: #ffffff;
      box-shadow: 0 4px 12px rgba(88, 204, 2, 0.4);
    }
    .admin-node-toggle.completed:hover {
      background: #ef4444;
      border-color: #ffffff;
      box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
    }
    .admin-toggle-icon-hover { display: none; }
    .admin-node-toggle.completed:hover .admin-toggle-icon-default { display: none; }
    .admin-node-toggle.completed:hover .admin-toggle-icon-hover { display: block; }

    .admin-guide-toggle-btn {
      padding: 0.85rem 1.25rem;
      border-radius: 14px;
      border: 2px solid rgba(133,92,214,0.3);
      background: rgba(133,92,214,0.06);
      color: var(--accent-primary);
      font-family: var(--font-heading);
      font-size: 0.95rem;
      font-weight: 800;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .admin-guide-toggle-btn:hover {
      background: var(--accent-primary);
      color: #fff;
      border-color: var(--accent-primary);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(133,92,214,0.25);
    }
    .admin-guide-toggle-btn.completed {
      background: rgba(88,204,2,0.08);
      border-color: rgba(88,204,2,0.3);
      color: #3d8c00;
    }
    .admin-guide-toggle-btn.completed:hover {
      background: rgba(239, 68, 68, 0.08);
      border-color: rgba(239, 68, 68, 0.3);
      color: #ef4444;
      box-shadow: 0 6px 16px rgba(239, 68, 68, 0.15);
    }
    .admin-guide-icon-hover { display: none; }
    .admin-guide-toggle-btn.completed:hover .admin-guide-icon-default { display: none; }
    .admin-guide-toggle-btn.completed:hover .admin-guide-icon-hover { display: block; }

    @media (max-width: 768px) {
      .sidebar { display: none; }
      .mobile-header { display: flex; }
      .main-content { margin-left: 0; max-width: 100%; }
      .materia-page { padding-top: 60px; }
    }

    @media (max-width: 600px) {
      .node-inner { width: 64px; height: 64px; }
      .node-active .node-inner { width: 68px; height: 68px; }
      .node-icon { width: 28px; height: 28px; }
    }
  `]
})
export class MateriaPathComponent {
  private paes = inject(PaesContentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public firestoreService = inject(FirestoreService);
  public adminService = inject(AdminService);
  private auth = inject(AuthService);
  public paymentService = inject(PaymentService);

  mobileOpen = false;
  showSettingsModal = false;
  showProfileModal = false;
  showLogoutConfirm = false;

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

  profileInitial = computed(() => {
    const name = this.firestoreService.profileSignal()?.displayName || '';
    return name.charAt(0).toUpperCase() || 'U';
  });
  isProPlan = computed(() => this.firestoreService.profileSignal()?.plan === 'premium');

  materiaId = signal('');
  materia = computed(() => this.paes.getMateriaById(this.materiaId()));
  capitulos = computed(() => this.paes.getCapitulosByMateria(this.materiaId()));

  // Pattern for horizontal zigzag staggering
  private offsets = [0, -40, -65, -40, 0, 40, 65, 40];

  constructor() {
    this.materiaId.set(this.route.snapshot.paramMap.get('materiaId') || '');
  }

  getOffset(index: number): number {
    return this.offsets[index % this.offsets.length];
  }

  pathItems = computed(() => {
    const items: PathItem[] = [];
    let nodeIndex = 0;

    let activeChapterId = '';
    let foundActivePre = false;
    for (const cap of this.capitulos()) {
      for (const sec of cap.secciones) {
        const prog = this.paes.getSeccionProgress(sec.id);
        if (!prog?.completed) {
          activeChapterId = cap.id;
          foundActivePre = true;
          break;
        }
      }
      if (foundActivePre) break;
    }

    let foundActive = false;

    this.capitulos().forEach((cap, capIndex) => {
      // 1. Add Chapter Divider
      items.push({
        type: 'chapter',
        capituloId: cap.id,
        title: cap.title,
        subtitle: `Capítulo ${capIndex + 1}`,
        isCurrentChapter: cap.id === activeChapterId
      });

      const guideProg = this.paes.getSeccionProgress('guide_' + cap.id);
      const isGuideCompleted = guideProg?.completed || false;
      const blockChapter = !isGuideCompleted;

      // 2. Add Sections as nodes
      cap.secciones.forEach((sec) => {
        const prog = this.paes.getSeccionProgress(sec.id);
        const completed = prog?.completed || false;

        let status: 'completed' | 'active' | 'locked' = 'locked';

        if (completed) {
          status = 'completed';
        } else if (!foundActive && !blockChapter) {
          status = 'active';
          foundActive = true;
        } else if (!foundActive && blockChapter) {
          status = 'locked';
          foundActive = true;
        } else {
          status = 'locked';
        }

        items.push({
          type: 'node',
          id: sec.id,
          capituloId: cap.id,
          title: sec.title,
          status,
          nodeIndex: nodeIndex++
        });
      });
    });

    return items;
  });

  handleNodeClick(item: any) {
    if (item.status === 'locked' && !this.adminService.isAdmin()) return;
    this.router.navigate(['/ruta', this.materiaId(), item.capituloId, item.id]);
  }

  toggleNodeCompletion(event: Event, item: any) {
    event.stopPropagation();
    if (item.status === 'completed') {
      this.paes.markSeccionIncomplete(item.id);
    } else {
      this.paes.markSeccionCompleted(item.id);
    }
  }

  toggleGuideCompletion(event: Event, capId: string) {
    event.stopPropagation();
    const isCompleted = this.isGuideCompleted(capId);
    if (isCompleted) {
      this.paes.markSeccionIncomplete('guide_' + capId);
    } else {
      this.paes.markSeccionCompleted('guide_' + capId);
    }
  }

  goToGuide(capId: string) {
    this.router.navigate(['/ruta', this.materiaId(), capId]);
  }

  getChapterNum(capId: string): number {
    const caps = this.capitulos();
    const idx = caps.findIndex(c => c.id === capId);
    return idx >= 0 ? idx + 1 : 1;
  }

  getChapterNodeCount(capId: string): number {
    const cap = this.capitulos().find(c => c.id === capId);
    return cap ? cap.secciones.length : 0;
  }

  getChapterProgress(capId: string): { completed: number; total: number; pct: number } {
    const cap = this.capitulos().find(c => c.id === capId);
    if (!cap) return { completed: 0, total: 0, pct: 0 };
    const total = cap.secciones.length;
    const completed = cap.secciones.filter(s => this.paes.getSeccionProgress(s.id)?.completed).length;
    return { completed, total, pct: total > 0 ? (completed / total) * 100 : 0 };
  }

  isGuideCompleted(capId: string): boolean {
    return !!this.paes.getSeccionProgress('guide_' + capId)?.completed;
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
