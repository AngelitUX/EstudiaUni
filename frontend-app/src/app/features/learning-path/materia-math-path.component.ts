import { Component, inject, signal, computed, HostListener, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PaesContentService } from './services/paes-content.service';
import { AuthService } from '../../core/services/auth.service';
import { SettingsModalComponent } from '../profile/settings-modal.component';
import { ProfileModalComponent } from '../profile/profile-modal.component';
import { FirestoreService } from '../../core/services/firestore.service';
import { AdminService } from '../admin/services/admin.service';
import { PaymentService } from '../../core/services/payment.service';
import { InfiniteMasteryModalComponent } from './infinite-mastery-modal.component';

type NodeItem = { id: string, capituloId: string, title: string, status: 'completed' | 'active' | 'locked', nodeIndex: number, tags?: string[], isCrown?: boolean };

type PathItem = {
  type: 'chapter' | 'node-row';
  capituloId: string;
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  isCurrentChapter?: boolean;
  isLocked?: boolean;
  nodes?: any[];
  rowIndex?: number;
  isCentered?: boolean;
  isBranchStart?: boolean;
};

@Component({
  selector: 'app-materia-math-path',
  standalone: true,
  imports: [CommonModule, RouterModule, SettingsModalComponent, ProfileModalComponent, InfiniteMasteryModalComponent],
  template: `
    <div class="lp-layout" [ngClass]="materiaId() === 'mat1' ? 'materia-mat1' : 'materia-mat2'">
      <!-- SIDEBAR -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <a routerLink="/dashboard" class="sidebar-logo" style="text-decoration:none; display: flex; align-items: center; justify-content: center;">
            <img [src]="(isProPlan() || adminService.isAdmin()) ? 'https://res.cloudinary.com/dqm3syhwr/image/upload/f_auto,q_auto/v1/imagenes/branding/LogoEstudiaUniPREMIUM' : 'https://res.cloudinary.com/dqm3syhwr/image/upload/f_auto,q_auto/v1/imagenes/branding/LogoEstudiaUni'" alt="EstudiaUni" class="sidebar-logo-img" />
          </a>
        </div>
        <nav class="sidebar-nav">
          <a class="nav-item" routerLink="/dashboard"><img src="assets/images/iconosParaElementos/P_Inicio.png" alt="Inicio" class="nav-icon-img"/><span class="nav-text">Inicio</span></a>
          <a class="nav-item active" routerLink="/ruta"><img src="assets/images/iconosParaElementos/P_RutaDeAprendizaje.png" alt="Ruta de Aprendizaje" class="nav-icon-img"/><span class="nav-text">Ruta de Aprendizaje</span></a>
          <a class="nav-item" routerLink="/ensayos"><img src="assets/images/iconosParaElementos/P_EnsayosPaes.png" alt="Ensayos PAES" class="nav-icon-img"/><span class="nav-text">Ensayos PAES</span></a>
          <a class="nav-item" routerLink="/mini-ensayo"><img src="assets/images/iconosParaElementos/P_MiniEnsayos.png" alt="Mini Ensayos" class="nav-icon-img"/><span class="nav-text">Mini Ensayos</span></a>
          <a class="nav-item" routerLink="/mente-veloz"><img src="assets/images/iconosParaElementos/P_MenteVeloz.png" alt="Mente Veloz" class="nav-icon-img"/><span class="nav-text">Mente Veloz</span></a>
          
          <div class="sidebar-section-title" (click)="toggleHerramientas()">
            HERRAMIENTAS
            <span class="toggle-icon" [style.transform]="herramientasExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'">▼</span>
          </div>
          <div class="sidebar-sub-items" [class.expanded]="herramientasExpanded" [class.collapsible]="isCollapsible">
            <a class="nav-item" routerLink="/encuentra-tu-carrera"><img src="assets/images/iconosParaElementos/P_EnncuentraTuCarrera.png" alt="Encuentra tu Carrera" class="nav-icon-img"/><span class="nav-text">Encuentra tu Carrera</span></a>
            <a class="nav-item" routerLink="/calculadora-nem"><img src="assets/images/iconosParaElementos/P_CalculadoraNEM.png" alt="Calculadora NEM" class="nav-icon-img"/><span class="nav-text">Calculadora NEM</span></a>
            <a class="nav-item" routerLink="/recursos"><img src="assets/images/iconosParaElementos/P_RecursosAdicionales.png" alt="Recursos Adicionales" class="nav-icon-img"/><span class="nav-text">Recursos Adicionales</span></a>
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
        <button class="mobile-menu-btn" (click)="mobileOpen = !mobileOpen">☰</button>
        <a routerLink="/dashboard" style="text-decoration:none; display: flex; align-items: center;">
          <img [src]="(isProPlan() || adminService.isAdmin()) ? 'https://res.cloudinary.com/dqm3syhwr/image/upload/f_auto,q_auto/v1/imagenes/branding/LogoEstudiaUniPREMIUM' : 'https://res.cloudinary.com/dqm3syhwr/image/upload/f_auto,q_auto/v1/imagenes/branding/LogoEstudiaUni'" alt="EstudiaUni" class="mobile-logo-img" />
        </a>
      </div>
      <div class="mobile-overlay" [class.open]="mobileOpen" (click)="mobileOpen = false">
        <div class="mobile-menu" (click)="$event.stopPropagation()">
          <nav class="sidebar-nav">
            <a class="nav-item" routerLink="/dashboard" (click)="mobileOpen=false"><img src="assets/images/iconosParaElementos/P_Inicio.png" alt="Inicio" class="nav-icon-img"/><span class="nav-text">Inicio</span></a>
            <a class="nav-item active" routerLink="/ruta" (click)="mobileOpen=false"><img src="assets/images/iconosParaElementos/P_RutaDeAprendizaje.png" alt="Ruta de Aprendizaje" class="nav-icon-img"/><span class="nav-text">Ruta de Aprendizaje</span></a>
            <a class="nav-item" routerLink="/ensayos" (click)="mobileOpen=false"><img src="assets/images/iconosParaElementos/P_EnsayosPaes.png" alt="Ensayos PAES" class="nav-icon-img"/><span class="nav-text">Ensayos PAES</span></a>
            <a class="nav-item" routerLink="/mini-ensayo" (click)="mobileOpen=false"><img src="assets/images/iconosParaElementos/P_MiniEnsayos.png" alt="Mini Ensayos" class="nav-icon-img"/><span class="nav-text">Mini Ensayos</span></a>
            <a class="nav-item" routerLink="/mente-veloz" (click)="mobileOpen=false"><img src="assets/images/iconosParaElementos/P_MenteVeloz.png" alt="Mente Veloz" class="nav-icon-img"/><span class="nav-text">Mente Veloz</span></a>
            
            <div class="sidebar-section-title" (click)="toggleHerramientas()">
              HERRAMIENTAS
              <span class="toggle-icon" [style.transform]="herramientasExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'">▼</span>
            </div>
            <div class="sidebar-sub-items" [class.expanded]="herramientasExpanded" [class.collapsible]="isCollapsible">
              <a class="nav-item" routerLink="/encuentra-tu-carrera" (click)="mobileOpen=false"><img src="assets/images/iconosParaElementos/P_EnncuentraTuCarrera.png" alt="Encuentra tu Carrera" class="nav-icon-img"/><span class="nav-text">Encuentra tu Carrera</span></a>
              <a class="nav-item" routerLink="/calculadora-nem" (click)="mobileOpen=false"><img src="assets/images/iconosParaElementos/P_CalculadoraNEM.png" alt="Calculadora NEM" class="nav-icon-img"/><span class="nav-text">Calculadora NEM</span></a>
              <a class="nav-item" routerLink="/recursos" (click)="mobileOpen=false"><img src="assets/images/iconosParaElementos/P_RecursosAdicionales.png" alt="Recursos Adicionales" class="nav-icon-img"/><span class="nav-text">Recursos Adicionales</span></a>
            </div>
          </nav>
          <div class="mobile-footer" style="padding: 1rem; border-top: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; gap: 0.5rem;">
            <a class="nav-item" (click)="showSettingsModal = true; mobileOpen=false">
              <img src="assets/images/iconosParaElementos/P_Configuracion.png" alt="Configuración" class="nav-icon-img nav-icon-img-config"/>
              <span class="nav-text">Configuración</span>
            </a>
            <a class="nav-item logout-btn-sidebar" (click)="confirmLogout(); mobileOpen=false">
              <img src="assets/images/iconosParaElementos/P_CerrarSesion.png" alt="Cerrar Sesión" class="nav-icon-img"/>
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
            <!-- Botón de Test para desbloquear todo 
            <button class="btn-upgrade-pro" style="background: linear-gradient(135deg, #e11d48, #be123c); font-size: 0.8rem; border-radius: 99px; margin-right: 0.5rem;" (click)="toggleUnlockAllSteps()">
              {{ isUnlockedAll() ? '🔒 Bloquear Ruta' : '🔓 Desbloquear todo' }}
            </button> -->
            <button *ngIf="isEntirePathCompleted()" class="btn-infinite-mastery-top" (click)="showInfiniteMastery = true">
              🌟 Modo Infinito
            </button>
            <button *ngIf="adminService.isAdmin()" class="btn-upgrade-pro" style="background: linear-gradient(135deg, #10b981, #059669); margin-right: 0.5rem;" (click)="forceRefresh()">
              🔄 Actualizar Datos
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

        <div class="dashboard-body" style="position: relative; overflow: hidden; min-height: 100vh;">
          <!-- MATH BACKGROUND DECORATIONS (soft edge motif, matching the Física style) -->
          <div class="physics-bg-decorations">
            <span class="bg-deco-orbit"></span>
            <span class="bg-deco-orbit-alt"></span>
            <span class="bg-deco" style="top: 4%; left: 4%; font-size: 2.4rem; transform: rotate(-12deg);">π</span>
            <span class="bg-deco" style="top: 16%; right: 5%; font-size: 2.6rem; transform: rotate(10deg);">√x</span>
            <span class="bg-deco" style="top: 30%; left: 3%; font-size: 2.1rem; transform: rotate(8deg);">∫</span>
            <span class="bg-deco" style="top: 42%; right: 4%; font-size: 2.9rem; transform: rotate(-8deg);">∑</span>
            <span class="bg-deco" style="top: 54%; left: 4%; font-size: 2.2rem; transform: rotate(-10deg);">f'(x)</span>
            <span class="bg-deco" style="top: 65%; right: 3%; font-size: 2.5rem; transform: rotate(12deg);">Δ</span>
            <span class="bg-deco" style="top: 76%; left: 5%; font-size: 2.1rem; transform: rotate(6deg);">x² + y²</span>
            <span class="bg-deco" style="top: 88%; right: 5%; font-size: 2.6rem; transform: rotate(-14deg);">θ</span>
            <span class="bg-deco" style="top: 6%; right: 22%; font-size: 1.9rem; transform: rotate(-6deg);">∞</span>
            <span class="bg-deco" style="top: 94%; left: 20%; font-size: 1.9rem; transform: rotate(9deg);">log x</span>
            <span class="bg-deco" style="top: 22%; left: 16%; font-size: 1.8rem; transform: rotate(14deg);">%</span>
            <span class="bg-deco" style="top: 8%; left: 30%; font-size: 1.8rem; transform: rotate(-9deg);">n!</span>
            <span class="bg-deco" style="top: 92%; right: 25%; font-size: 1.8rem; transform: rotate(7deg);">½</span>
          </div>
          <div class="materia-page">
          <!-- DUOLINGO PATH -->
          <div class="duo-path-container">
            <ng-container *ngFor="let item of pathItems(); let i = index">
              <!-- CHAPTER SPLASH BANNER -->
              <div *ngIf="item.type === 'chapter'" style="position: relative; width: 100%; display: flex; flex-direction: column; align-items: center;">
                <!-- SIMBOLOS DE CAPITULO (M1 vs M2) -->
                <ng-container *ngIf="materiaId() === 'mat1'">
                  <div class="math-decor-item decor-left" style="top: 20%;">π</div>
                  <div class="math-decor-item decor-right" style="top: 60%;">√x</div>
                </ng-container>
                <ng-container *ngIf="materiaId() === 'mat2'">
                  <div class="math-decor-item decor-left" style="top: 20%;">lim</div>
                  <div class="math-decor-item decor-right" style="top: 60%;">f'(x)</div>
                </ng-container>
                <div class="chapter-splash" [ngClass]="[item.capituloId, getChapterProgress(item.capituloId).pct === 100 ? 'chapter-completed' : '']" style="margin-bottom: 7rem; width: 100%;">
                  <div class="splash-bg-pattern"></div>
                  <div class="splash-inner">
                  <div class="splash-hero">
                    <div class="splash-mascot-area">
                      <img src="https://res.cloudinary.com/dqm3syhwr/image/upload/f_auto,q_auto/v1/imagenes/branding/gif" alt="Foco" class="splash-mascot chapter-image-custom" />
                    </div>
                    <div class="splash-info">
                      <span class="splash-badge" [class.badge-completed]="getChapterProgress(item.capituloId).pct === 100">
                        Capítulo {{ getChapterNum(item.capituloId) }} <span *ngIf="getChapterProgress(item.capituloId).pct === 100">✓</span>
                      </span>
                      <h2 class="splash-title">{{ item.title }}</h2>
                      <p class="splash-desc" *ngIf="item.capituloId === 'cap-localizar'">Identifica y extrae información explícita del texto. Domina sinónimos, paráfrasis y la técnica de escaneo.</p>
                      <div class="splash-stats">
                        <div class="ss"><span class="ss-icon">📚</span> {{ getChapterNodeCount(item.capituloId) }} Lecciones</div>
                        <div class="ss" *ngIf="getChapterWeight(item.capituloId)"><span class="ss-icon">📊</span> {{ getChapterWeight(item.capituloId) }}</div>
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
                    <div class="guide-tooltip" *ngIf="item.isCurrentChapter && !isGuideCompleted(item.capituloId) && getChapterProgress(item.capituloId).completed === 0">
                      EMPEZAR
                      <div class="tooltip-arrow"></div>
                    </div>
                    <button class="splash-guide-btn" [class.locked]="item.isLocked" (click)="!item.isLocked && goToGuide(item.capituloId)" style="flex: 1;">
                      <span class="sgb-icon">📖</span> Resumen del Capítulo
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
                  <span class="sep-text">🏁 Tu ruta comienza aquí ↓</span>
                  <div class="sep-line"></div>
                </div>
                </div>
            </div>

            <!-- SECTION NODE ROW -->
            <div *ngIf="item.type === 'node-row'" class="node-row" 
                 [style.margin-bottom]="hasTreeLayout() ? '7.5rem' : '6.5rem'">
              <!-- SIMBOLOS DE LECCION ALTERNADOS (M1 vs M2) -->
              <ng-container *ngIf="materiaId() === 'mat1'">
                <div *ngIf="i % 4 === 0" class="math-decor-item decor-left" style="top: 0px;">∑</div>
                <div *ngIf="i % 4 === 1" class="math-decor-item decor-right" style="top: 0px;">∞</div>
                <div *ngIf="i % 4 === 2" class="math-decor-item decor-left" style="top: 0px;">%</div>
                <div *ngIf="i % 4 === 3" class="math-decor-item decor-right" style="top: 0px;">∫</div>
              </ng-container>
              <ng-container *ngIf="materiaId() === 'mat2'">
                <div *ngIf="i % 4 === 0" class="math-decor-item decor-left" style="top: 0px;">log x</div>
                <div *ngIf="i % 4 === 1" class="math-decor-item decor-right" style="top: 0px;">θ</div>
                <div *ngIf="i % 4 === 2" class="math-decor-item decor-left" style="top: 0px;">λ</div>
                <div *ngIf="i % 4 === 3" class="math-decor-item decor-right" style="top: 0px;">u·v</div>
              </ng-container>
              
              <!-- SVG CONECTOR HACIA EL CAPITULO DE ARRIBA (Invertido) -->
              <svg class="path-svg" *ngIf="i > 0 && pathItems()[i - 1].type === 'chapter'" style="height: 150px; top: -114px; z-index: -1;">
                <path [attr.d]="getUpwardChapterConnection(i)"
                      [attr.stroke]="getUpwardChapterColor(i)"
                      fill="none" stroke-width="12" stroke-linecap="round" />
              </svg>
              
              <!-- SVG CAMINITO CONECTOR -->
              <svg class="path-svg" *ngIf="!isLastPathItem(item)" 
                   [style.height]="isNextChapter(i) ? '156px' : (hasTreeLayout() ? 'calc(72px + 7.5rem)' : 'calc(72px + 6.5rem)')">
                <path *ngFor="let conn of getConnections(i)"
                      [attr.d]="conn.d"
                      [attr.stroke]="conn.color"
                      [attr.stroke-dasharray]="conn.dasharray"
                      fill="none" stroke-width="12" stroke-linecap="round" />
              </svg>
                
                <div class="node-wrapper" 
                     [style.display]="item.nodes!.length > 1 ? 'flex' : 'flex'"
                     [style.flex-direction]="item.nodes!.length > 1 ? 'row' : 'column'"
                     [style.gap]="item.nodes!.length === 3 ? 'calc(180px - 72px)' : (item.nodes!.length === 2 ? 'calc(280px - 72px)' : '0')"
                     style="align-items: center; justify-content: center;">
                     
                  <ng-container *ngFor="let node of item.nodes; let nodeIdx = index; let isLast = last">
                    <div [id]="node.id" 
                         [style.transform]="getNodeTransform(item, nodeIdx)"
                         style="position: relative; display: flex; flex-direction: column; align-items: center;">
                      
                      <div class="active-tooltip" *ngIf="node.status === 'active' && item.nodes!.length === 1">
                        {{ getChapterProgress(node.capituloId).completed === 0 ? 'EMPEZAR' : 'CONTINUAR' }}
                        <div class="tooltip-arrow"></div>
                      </div>

                      <!-- Admin toggle node button -->
                      <button *ngIf="adminService.isAdmin()"
                        class="admin-node-toggle"
                        [class.completed]="node.status === 'completed'"
                        [title]="node.status === 'completed' ? 'Marcar lección como incompleta' : 'Marcar lección como completada'"
                        (click)="toggleNodeCompletion($event, node)">
                        <span class="admin-toggle-icon-default">{{ node.status === 'completed' ? '✓' : '+' }}</span>
                        <span class="admin-toggle-icon-hover">✕</span>
                      </button>

                      <!-- Título de Subcapítulo (Solo en ramificaciones) -->
                      <div class="subcapitulo-title" *ngIf="item.isBranchStart && getSubcapituloTitle(node)" 
                           style="position: absolute; top: -46px; font-size: 15px; font-weight: 900; color: var(--accent-primary); white-space: nowrap; text-transform: uppercase; letter-spacing: 1.5px; background: rgba(255,255,255,0.95); padding: 6px 16px; border-radius: 20px; z-index: 2; border: 2px solid rgba(133,92,214,0.3); box-shadow: 0 4px 16px rgba(133,92,214,0.25); backdrop-filter: blur(8px);">
                        {{ getSubcapituloTitle(node) }}
                      </div>

                      <button class="duo-node" 
                        [class.node-completed]="node.status === 'completed'"
                        [class.node-active]="node.status === 'active'"
                        [class.node-locked]="node.status === 'locked'"
                        (click)="handleNodeClick(node)">
                        <div class="node-inner">
                          <!-- CROWN SVG -->
                          <svg *ngIf="node.isCrown && (node.status === 'completed' || node.status === 'active')" class="node-icon icon-crown" viewBox="0 0 24 24" fill="currentColor" style="color: #ffd700; filter: drop-shadow(0 0 4px rgba(255,215,0,0.5));">
                            <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5ZM19 19C19 19.55 18.55 20 18 20H6C5.45 20 5 19.55 5 19V18H19V19Z"/>
                          </svg>
                          <!-- BOSS SVG -->
                          <svg *ngIf="!node.isCrown && node.isBoss && (node.status === 'completed' || node.status === 'active')" class="node-icon icon-boss" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C7.03 2 3 6.03 3 11V14.5C3 15.33 3.67 16 4.5 16H6V20C6 21.1 6.9 22 8 22H16C17.1 22 18 21.1 18 20V16H19.5C20.33 16 21 15.33 21 14.5V11C21 6.03 16.97 2 12 2ZM8 10C6.9 10 6 9.1 6 8C6 6.9 6.9 6 8 6C9.1 6 10 6.9 10 8C10 9.1 9.1 10 8 10ZM16 10C14.9 10 14 9.1 14 8C14 6.9 14.9 6 16 6C17.1 6 18 6.9 18 8C18 9.1 17.1 10 16 10ZM15 19H9V16H15V19Z" />
                          </svg>
                          <!-- PRACTICE SVG -->
                          <svg *ngIf="!node.isCrown && !node.isBoss && isPracticeNode(node) && (node.status === 'completed' || node.status === 'active')" class="node-icon icon-practice" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 9V7c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2v2H10V7c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v2H2v6h2v2c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-2h4v2c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-2h2v-6h-2z"/>
                          </svg>
                          <!-- STAR SVG -->
                          <svg *ngIf="!node.isCrown && !node.isBoss && !isPracticeNode(node) && (node.status === 'completed' || node.status === 'active')" class="node-icon icon-star" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                          <!-- LOCK SVG -->
                          <svg *ngIf="node.status === 'locked'" class="node-icon icon-lock" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
                          </svg>
                        </div>
                      </button>
                      <div class="node-title" 
                        [class.text-completed]="node.status === 'completed'"
                        [class.text-active]="node.status === 'active'"
                        [class.historia-title]="hasTreeLayout()"
                        [class.title-boss]="node.isBoss && !node.isCrown"
                        [class.title-crown]="node.isCrown"
                        [class.title-practice]="!node.isBoss && !node.isCrown && isPracticeNode(node)"
                        [style.bottom]="(hasTreeLayout() && node.title.length > 25) ? '-60px' : (node.status === 'active' ? '-36px' : '-32px')">
                        {{ node.title }}
                      </div>
                    </div>
                  </ng-container>
                </div>
              </div>
            </ng-container>

            <!-- NODO FINAL DE MAESTRÍA INFINITA (Solo cuando la ruta esté completada) -->
            <div *ngIf="isEntirePathCompleted()" class="infinite-mastery-node-card" (click)="showInfiniteMastery = true">
              <div class="infinite-portal-badge">
                <span class="portal-icon">🌟</span>
                <div class="portal-text">
                  <h4>Modo Infinito · Polígono de Maestría</h4>
                  <p>Practica ilimitadamente con preguntas dinámicas de todos los ejes</p>
                </div>
                <button class="btn-enter-portal">Entrar al Polígono →</button>
              </div>
            </div>
          </div>
        </div>
        </div>
      </main>
    </div>
    <app-profile-modal *ngIf="showProfileModal" (close)="showProfileModal = false"></app-profile-modal>
    <app-settings-modal *ngIf="showSettingsModal" (close)="showSettingsModal = false"></app-settings-modal>
    <app-infinite-mastery-modal *ngIf="showInfiniteMastery" [materiaId]="materiaId()" (close)="showInfiniteMastery = false"></app-infinite-mastery-modal>

    <!-- CUSTOM LOGOUT CONFIRMATION -->
    <!-- PHYSICS SIMULATOR PANEL (only for ciencias-fisica) -->
    <ng-container *ngIf="isMathRoute()">
      <!-- Tab trigger button -->
      <button class="sim-tab-trigger" (click)="toggleSimPanel()" [class.panel-open]="simPanelOpen" [class.expanded]="simExpanded">
        <span class="sim-tab-icon">📐</span>
        <span class="sim-tab-label">Simulador M1/M2</span>
        <span class="sim-tab-arrow">{{ simPanelOpen ? '▶' : '◀' }}</span>
      </button>

      <!-- Simulator Drawer -->
      <div class="sim-drawer" [class.open]="simPanelOpen" [class.expanded]="simExpanded">
        <div class="sim-drawer-inner">
          <div class="sim-header">
            <div class="sim-header-left">
              <span class="sim-header-icon">📐</span>
              <div>
                <h3 class="sim-title">Simuladores de Matemáticas {{ isM1Route() ? 'M1' : 'M2' }}</h3>
              </div>
            </div>
            <div class="sim-header-actions">
              <button class="sim-expand-btn" (click)="toggleSimExpand()">
                {{ simExpanded ? '↙ Reducir' : '↗ Ampliar' }}
              </button>
              <button class="sim-close-btn" (click)="toggleSimPanel()">✕</button>
            </div>
          </div>

          <div style="font-size: 0.85rem; color: #4b5563; text-align: center; margin-bottom: 1rem; padding: 0.6rem; background: rgba(0,0,0,0.04); border-radius: 8px; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-weight: 500; border: 1px solid rgba(0,0,0,0.05);">
            💡 <span>Si no visualizas bien la simulación, usa el botón <strong>↗ Ampliar</strong> de arriba.</span>
          </div>
          
          <div class="sim-chapter-groups">
            <!-- M1 Select -->
            <select class="sim-chapter-select" *ngIf="isM1Route()" (change)="setSimChapter($event)">
              <option value="0" [selected]="selectedSimChapterIndex === 0">Eje: Números</option>
              <option value="1" [selected]="selectedSimChapterIndex === 1">Eje: Álgebra y Funciones</option>
              <option value="2" [selected]="selectedSimChapterIndex === 2">Eje: Geometría</option>
              <option value="3" [selected]="selectedSimChapterIndex === 3">Eje: Probabilidad y Estadística</option>
            </select>

            <!-- M2 Select -->
            <select class="sim-chapter-select" *ngIf="isM2Route()" (change)="setSimChapter($event)">
              <option value="0" [selected]="selectedSimChapterIndex === 0">Eje: Números (M2)</option>
              <option value="1" [selected]="selectedSimChapterIndex === 1">Eje: Álgebra y Funciones (M2)</option>
              <option value="2" [selected]="selectedSimChapterIndex === 2">Eje: Geometría (M2)</option>
              <option value="3" [selected]="selectedSimChapterIndex === 3">Eje: Probabilidad y Estadística (M2)</option>
            </select>
            
            <!-- M1 Tabs -->
            <ng-container *ngIf="isM1Route()">
              <!-- EJE 1: Números -->
              <div class="sim-tabs" *ngIf="selectedSimChapterIndex === 0">
                <button class="sim-tab" [class.active]="activeSimTab === 'percentage'" (click)="setSimTab('percentage')">📊 Porcentajes</button>
                <button class="sim-tab" [class.active]="activeSimTab === 'exponential'" (click)="setSimTab('exponential')">🌳 Potencias y Crecimiento</button>
              </div>
              <!-- EJE 2: Álgebra -->
              <div class="sim-tabs" *ngIf="selectedSimChapterIndex === 1">
                <button class="sim-tab" [class.active]="activeSimTab === 'linear'" (click)="setSimTab('linear')">📈 F. Lineal y Afín</button>
                <button class="sim-tab" [class.active]="activeSimTab === 'quadratic'" (click)="setSimTab('quadratic')">📉 F. Cuadrática</button>
                <button class="sim-tab" [class.active]="activeSimTab === 'free-graph'" (click)="setSimTab('free-graph')">🧮 Graficador Libre</button>
              </div>
              <!-- EJE 3: Geometría -->
              <div class="sim-tabs" *ngIf="selectedSimChapterIndex === 2">
                <button class="sim-tab" [class.active]="activeSimTab === 'pythagoras'" (click)="setSimTab('pythagoras')">📐 T. de Pitágoras</button>
                <button class="sim-tab" [class.active]="activeSimTab === 'homothetic'" (click)="setSimTab('homothetic')">🔄 Transf. Isométricas</button>
              </div>
              <!-- EJE 4: Estadística -->
              <div class="sim-tabs" *ngIf="selectedSimChapterIndex === 3">
                <button class="sim-tab" [class.active]="activeSimTab === 'dice-simulation'" (click)="setSimTab('dice-simulation')">🎲 Tirada de Dados</button>
              </div>
            </ng-container>

            <!-- M2 Tabs -->
            <ng-container *ngIf="isM2Route()">
              <!-- EJE 1: Números (M2) -->
              <div class="sim-tabs" *ngIf="selectedSimChapterIndex === 0">
                <button class="sim-tab" [class.active]="activeSimTab === 'exponential-m2'" (click)="setSimTab('exponential-m2')">💰 Int. Compuesto y Continuo</button>
              </div>
              <!-- EJE 2: Álgebra (M2) -->
              <div class="sim-tabs" *ngIf="selectedSimChapterIndex === 1">
                <button class="sim-tab" [class.active]="activeSimTab === 'system2x2'" (click)="setSimTab('system2x2')">🔗 Sistemas 2x2</button>
                <button class="sim-tab" [class.active]="activeSimTab === 'sinusoidal'" (click)="setSimTab('sinusoidal')">〜 Ondas Trigonométricas</button>
              </div>
              <!-- EJE 3: Geometría (M2) -->
              <div class="sim-tabs" *ngIf="selectedSimChapterIndex === 2">
                <button class="sim-tab" [class.active]="activeSimTab === 'homothetic-m2'" (click)="setSimTab('homothetic-m2')">🎯 Homotecia Dinámica</button>
                <button class="sim-tab" [class.active]="activeSimTab === 'circle-theorems'" (click)="setSimTab('circle-theorems')">⭕ Ángulos y Cuerdas</button>
              </div>
              <!-- EJE 4: Estadística (M2) -->
              <div class="sim-tabs" *ngIf="selectedSimChapterIndex === 3">
                <button class="sim-tab" [class.active]="activeSimTab === 'normal-distribution'" (click)="setSimTab('normal-distribution')">🔔 Campana de Gauss</button>
              </div>
            </ng-container>
          </div>

          <!-- ================= M1 SIMULATORS CONTENT ================= -->
    <ng-container *ngIf="isMathRoute()">
      <!-- Tab trigger button -->
      <button class="sim-tab-trigger" (click)="toggleSimPanel()" [class.panel-open]="simPanelOpen" [class.expanded]="simExpanded">
        <span class="sim-tab-icon">📐</span>
        <span class="sim-tab-label">Simulador M1/M2</span>
        <span class="sim-tab-arrow">{{ simPanelOpen ? '▶' : '◀' }}</span>
      </button>

      <!-- Simulator Drawer -->
      <div class="sim-drawer" [class.open]="simPanelOpen" [class.expanded]="simExpanded">
        <div class="sim-drawer-inner">
          <div class="sim-header">
            <div class="sim-header-left">
              <span class="sim-header-icon">📐</span>
              <div>
                <h3 class="sim-title">Simuladores de Matemáticas {{ isM1Route() ? 'M1' : 'M2' }}</h3>
              </div>
            </div>
            <div class="sim-header-actions">
              <button class="sim-expand-btn" (click)="toggleSimExpand()">
                {{ simExpanded ? '↙ Reducir' : '↗ Ampliar' }}
              </button>
              <button class="sim-close-btn" (click)="toggleSimPanel()">✕</button>
            </div>
          </div>

          <div style="font-size: 0.85rem; color: #4b5563; text-align: center; margin-bottom: 1rem; padding: 0.6rem; background: rgba(0,0,0,0.04); border-radius: 8px; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-weight: 500; border: 1px solid rgba(0,0,0,0.05);">
            💡 <span>Si no visualizas bien la simulación, usa el botón <strong>↗ Ampliar</strong> de arriba.</span>
          </div>
          
          <div class="sim-chapter-groups">
            <!-- M1 Select -->
            <select class="sim-chapter-select" *ngIf="isM1Route()" (change)="setSimChapter($event)">
              <option value="0" [selected]="selectedSimChapterIndex === 0">Eje: Números</option>
              <option value="1" [selected]="selectedSimChapterIndex === 1">Eje: Álgebra y Funciones</option>
              <option value="2" [selected]="selectedSimChapterIndex === 2">Eje: Geometría</option>
              <option value="3" [selected]="selectedSimChapterIndex === 3">Eje: Probabilidad y Estadística</option>
            </select>

            <!-- M2 Select -->
            <select class="sim-chapter-select" *ngIf="isM2Route()" (change)="setSimChapter($event)">
              <option value="0" [selected]="selectedSimChapterIndex === 0">Eje: Números (M2)</option>
              <option value="1" [selected]="selectedSimChapterIndex === 1">Eje: Álgebra y Funciones (M2)</option>
              <option value="2" [selected]="selectedSimChapterIndex === 2">Eje: Geometría (M2)</option>
              <option value="3" [selected]="selectedSimChapterIndex === 3">Eje: Probabilidad y Estadística (M2)</option>
            </select>
            
            <!-- M1 Tabs -->
            <ng-container *ngIf="isM1Route()">
              <!-- EJE 1: Números -->
              <div class="sim-tabs" *ngIf="selectedSimChapterIndex === 0">
                <button class="sim-tab" [class.active]="activeSimTab === 'percentage'" (click)="setSimTab('percentage')">📊 Porcentajes</button>
                <button class="sim-tab" [class.active]="activeSimTab === 'exponential'" (click)="setSimTab('exponential')">🌳 Potencias y Crecimiento</button>
                <button class="sim-tab" [class.active]="activeSimTab === 'rational-line'" (click)="setSimTab('rational-line')">📍 Recta Racional</button>
              </div>
              <!-- EJE 2: Álgebra -->
              <div class="sim-tabs" *ngIf="selectedSimChapterIndex === 1">
                <button class="sim-tab" [class.active]="activeSimTab === 'linear'" (click)="setSimTab('linear')">📈 F. Lineal y Afín</button>
                <button class="sim-tab" [class.active]="activeSimTab === 'quadratic'" (click)="setSimTab('quadratic')">📉 F. Cuadrática</button>
                <button class="sim-tab" [class.active]="activeSimTab === 'free-graph'" (click)="setSimTab('free-graph')">🧮 Graficador Libre</button>
                <button class="sim-tab" [class.active]="activeSimTab === 'equation-balance'" (click)="setSimTab('equation-balance')">⚖️ Balanza de Ecuaciones</button>
              </div>
              <!-- EJE 3: Geometría -->
              <div class="sim-tabs" *ngIf="selectedSimChapterIndex === 2">
                <button class="sim-tab" [class.active]="activeSimTab === 'pythagoras'" (click)="setSimTab('pythagoras')">📐 T. de Pitágoras</button>
                <button class="sim-tab" [class.active]="activeSimTab === 'homothetic'" (click)="setSimTab('homothetic')">🔄 Transf. Isométricas</button>
                <button class="sim-tab" [class.active]="activeSimTab === 'thales-theorem'" (click)="setSimTab('thales-theorem')">🌿 Teorema de Thales</button>
              </div>
              <!-- EJE 4: Estadística -->
              <div class="sim-tabs" *ngIf="selectedSimChapterIndex === 3">
                <button class="sim-tab" [class.active]="activeSimTab === 'dice-simulation'" (click)="setSimTab('dice-simulation')">🎲 Tirada de Dados</button>
                <button class="sim-tab" [class.active]="activeSimTab === 'multigraph'" (click)="setSimTab('multigraph')">📊 Multigráfico</button>
              </div>
            </ng-container>

            <!-- M2 Tabs -->
            <ng-container *ngIf="isM2Route()">
              <!-- EJE 1: Números (M2) -->
              <div class="sim-tabs" *ngIf="selectedSimChapterIndex === 0">
                <button class="sim-tab" [class.active]="activeSimTab === 'exponential-m2'" (click)="setSimTab('exponential-m2')">💰 Int. Compuesto y Continuo</button>
                <button class="sim-tab" [class.active]="activeSimTab === 'log-exponential-m2'" (click)="setSimTab('log-exponential-m2')">🪵 Relación Log-Exponencial</button>
              </div>
              <!-- EJE 2: Álgebra (M2) -->
              <div class="sim-tabs" *ngIf="selectedSimChapterIndex === 1">
                <button class="sim-tab" [class.active]="activeSimTab === 'system2x2'" (click)="setSimTab('system2x2')">🔗 Sistemas 2x2</button>
                <button class="sim-tab" [class.active]="activeSimTab === 'sinusoidal'" (click)="setSimTab('sinusoidal')">〜 Ondas Trigonométricas</button>
                <button class="sim-tab" [class.active]="activeSimTab === 'inverse-symmetry-m2'" (click)="setSimTab('inverse-symmetry-m2')">🪞 Simetría Inversa</button>
              </div>
              <!-- EJE 3: Geometría (M2) -->
              <div class="sim-tabs" *ngIf="selectedSimChapterIndex === 2">
                <button class="sim-tab" [class.active]="activeSimTab === 'homothetic-m2'" (click)="setSimTab('homothetic-m2')">🎯 Homotecia Dinámica</button>
                <button class="sim-tab" [class.active]="activeSimTab === 'circle-theorems'" (click)="setSimTab('circle-theorems')">⭕ Ángulos y Cuerdas</button>
                <button class="sim-tab" [class.active]="activeSimTab === 'trig-circle-m2'" (click)="setSimTab('trig-circle-m2')">⭕ Círculo Unitario</button>
                <button class="sim-tab" [class.active]="activeSimTab === 'sphere-volume-m2'" (click)="setSimTab('sphere-volume-m2')">🔮 Esfera: Área y Vol.</button>
              </div>
              <!-- EJE 4: Estadística (M2) -->
              <div class="sim-tabs" *ngIf="selectedSimChapterIndex === 3">
                <button class="sim-tab" [class.active]="activeSimTab === 'normal-distribution'" (click)="setSimTab('normal-distribution')">🔔 Campana de Gauss</button>
                <button class="sim-tab" [class.active]="activeSimTab === 'combinatorics-m2'" (click)="setSimTab('combinatorics-m2')">🔀 Combinatoria</button>
                <button class="sim-tab" [class.active]="activeSimTab === 'binomial-distribution-m2'" (click)="setSimTab('binomial-distribution-m2')">📈 Dist. Binomial</button>
              </div>
            </ng-container>
          </div>

          <!-- ================= M1 SIMULATORS CONTENT ================= -->
    <ng-container *ngIf="isMathRoute()">
      <!-- Tab trigger button -->
      <button class="sim-tab-trigger" (click)="toggleSimPanel()" [class.panel-open]="simPanelOpen" [class.expanded]="simExpanded">
        <span class="sim-tab-icon">📐</span>
        <span class="sim-tab-label">Simulador M1/M2</span>
        <span class="sim-tab-arrow">{{ simPanelOpen ? '▶' : '◀' }}</span>
      </button>

      <!-- Simulator Drawer -->
      <div class="sim-drawer" [class.open]="simPanelOpen" [class.expanded]="simExpanded">
        <div class="sim-drawer-inner">
          <div class="sim-header">
            <div class="sim-header-left">
              <span class="sim-header-icon">📐</span>
              <div>
                <h3 class="sim-title">Simuladores de Matemáticas {{ isM1Route() ? 'M1' : 'M2' }}</h3>
              </div>
            </div>
            <div class="sim-header-actions">
              <button class="sim-expand-btn" (click)="toggleSimExpand()">
                {{ simExpanded ? '↙ Reducir' : '↗ Ampliar' }}
              </button>
              <button class="sim-close-btn" (click)="toggleSimPanel()">✕</button>
            </div>
          </div>

          <div style="font-size: 0.85rem; color: #4b5563; text-align: center; margin-bottom: 1rem; padding: 0.6rem; background: rgba(0,0,0,0.04); border-radius: 8px; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-weight: 500; border: 1px solid rgba(0,0,0,0.05);">
            💡 <span>Si no visualizas bien la simulación, usa el botón <strong>↗ Ampliar</strong> de arriba.</span>
          </div>
          
          <div class="sim-chapter-groups">
            <!-- M1 Select -->
            <select class="sim-chapter-select" *ngIf="isM1Route()" (change)="setSimChapter($event)">
              <option value="0" [selected]="selectedSimChapterIndex === 0">Eje: Números</option>
              <option value="1" [selected]="selectedSimChapterIndex === 1">Eje: Álgebra y Funciones</option>
              <option value="2" [selected]="selectedSimChapterIndex === 2">Eje: Geometría</option>
              <option value="3" [selected]="selectedSimChapterIndex === 3">Eje: Probabilidad y Estadística</option>
            </select>

            <!-- M2 Select -->
            <select class="sim-chapter-select" *ngIf="isM2Route()" (change)="setSimChapter($event)">
              <option value="0" [selected]="selectedSimChapterIndex === 0">Eje: Números (M2)</option>
              <option value="1" [selected]="selectedSimChapterIndex === 1">Eje: Álgebra y Funciones (M2)</option>
              <option value="2" [selected]="selectedSimChapterIndex === 2">Eje: Geometría (M2)</option>
              <option value="3" [selected]="selectedSimChapterIndex === 3">Eje: Probabilidad y Estadística (M2)</option>
            </select>
            
            <!-- M1 Tabs -->
            <ng-container *ngIf="isM1Route()">
              <!-- EJE 1: Números -->
              <div class="sim-tabs" *ngIf="selectedSimChapterIndex === 0">
                <button class="sim-tab" [class.active]="activeSimTab === 'percentage'" (click)="setSimTab('percentage')">📊 Porcentajes</button>
                <button class="sim-tab" [class.active]="activeSimTab === 'exponential'" (click)="setSimTab('exponential')">🌳 Potencias y Crecimiento</button>
                <button class="sim-tab" [class.active]="activeSimTab === 'rational-line'" (click)="setSimTab('rational-line')">📍 Recta Racional</button>
              </div>
              <!-- EJE 2: Álgebra -->
              <div class="sim-tabs" *ngIf="selectedSimChapterIndex === 1">
                <button class="sim-tab" [class.active]="activeSimTab === 'linear'" (click)="setSimTab('linear')">📈 F. Lineal y Afín</button>
                <button class="sim-tab" [class.active]="activeSimTab === 'quadratic'" (click)="setSimTab('quadratic')">📉 F. Cuadrática</button>
                <button class="sim-tab" [class.active]="activeSimTab === 'free-graph'" (click)="setSimTab('free-graph')">🧮 Graficador Libre</button>
                <button class="sim-tab" [class.active]="activeSimTab === 'equation-balance'" (click)="setSimTab('equation-balance')">⚖️ Balanza de Ecuaciones</button>
              </div>
              <!-- EJE 3: Geometría -->
              <div class="sim-tabs" *ngIf="selectedSimChapterIndex === 2">
                <button class="sim-tab" [class.active]="activeSimTab === 'pythagoras'" (click)="setSimTab('pythagoras')">📐 T. de Pitágoras</button>
                <button class="sim-tab" [class.active]="activeSimTab === 'homothetic'" (click)="setSimTab('homothetic')">🔄 Transf. Isométricas</button>
                <button class="sim-tab" [class.active]="activeSimTab === 'thales-theorem'" (click)="setSimTab('thales-theorem')">🌿 Teorema de Thales</button>
              </div>
              <!-- EJE 4: Estadística -->
              <div class="sim-tabs" *ngIf="selectedSimChapterIndex === 3">
                <button class="sim-tab" [class.active]="activeSimTab === 'dice-simulation'" (click)="setSimTab('dice-simulation')">🎲 Tirada de Dados</button>
                <button class="sim-tab" [class.active]="activeSimTab === 'multigraph'" (click)="setSimTab('multigraph')">📊 Multigráfico</button>
              </div>
            </ng-container>

            <!-- M2 Tabs -->
            <ng-container *ngIf="isM2Route()">
              <!-- EJE 1: Números (M2) -->
              <div class="sim-tabs" *ngIf="selectedSimChapterIndex === 0">
                <button class="sim-tab" [class.active]="activeSimTab === 'exponential-m2'" (click)="setSimTab('exponential-m2')">💰 Int. Compuesto y Continuo</button>
                <button class="sim-tab" [class.active]="activeSimTab === 'log-exponential-m2'" (click)="setSimTab('log-exponential-m2')">🪵 Relación Log-Exponencial</button>
              </div>
              <!-- EJE 2: Álgebra (M2) -->
              <div class="sim-tabs" *ngIf="selectedSimChapterIndex === 1">
                <button class="sim-tab" [class.active]="activeSimTab === 'system2x2'" (click)="setSimTab('system2x2')">🔗 Sistemas 2x2</button>
                <button class="sim-tab" [class.active]="activeSimTab === 'sinusoidal'" (click)="setSimTab('sinusoidal')">〜 Ondas Trigonométricas</button>
                <button class="sim-tab" [class.active]="activeSimTab === 'inverse-symmetry-m2'" (click)="setSimTab('inverse-symmetry-m2')">🪞 Simetría Inversa</button>
              </div>
              <!-- EJE 3: Geometría (M2) -->
              <div class="sim-tabs" *ngIf="selectedSimChapterIndex === 2">
                <button class="sim-tab" [class.active]="activeSimTab === 'homothetic-m2'" (click)="setSimTab('homothetic-m2')">🎯 Homotecia Dinámica</button>
                <button class="sim-tab" [class.active]="activeSimTab === 'circle-theorems'" (click)="setSimTab('circle-theorems')">⭕ Ángulos y Cuerdas</button>
                <button class="sim-tab" [class.active]="activeSimTab === 'trig-circle-m2'" (click)="setSimTab('trig-circle-m2')">⭕ Círculo Unitario</button>
                <button class="sim-tab" [class.active]="activeSimTab === 'sphere-volume-m2'" (click)="setSimTab('sphere-volume-m2')">🔮 Esfera: Área y Vol.</button>
              </div>
              <!-- EJE 4: Estadística (M2) -->
              <div class="sim-tabs" *ngIf="selectedSimChapterIndex === 3">
                <button class="sim-tab" [class.active]="activeSimTab === 'normal-distribution'" (click)="setSimTab('normal-distribution')">🔔 Campana de Gauss</button>
                <button class="sim-tab" [class.active]="activeSimTab === 'combinatorics-m2'" (click)="setSimTab('combinatorics-m2')">🔀 Combinatoria</button>
                <button class="sim-tab" [class.active]="activeSimTab === 'binomial-distribution-m2'" (click)="setSimTab('binomial-distribution-m2')">📈 Dist. Binomial</button>
              </div>
            </ng-container>
          </div>

          <!-- ================= M1 SIMULATORS CONTENT ================= -->
          <ng-container *ngIf="isM1Route()">
            <!-- ═══ 1.1 PERCENTAGE SIMULATOR ═══ -->
            <div class="sim-content" *ngIf="activeSimTab === 'percentage'">
              <div class="sim-info-badge">📊 Representación visual de porcentajes, fracciones y decimales</div>
              <canvas #percentageCanvas class="sim-canvas"></canvas>
              <div class="sim-controls">
                <div class="sim-control-row">
                  <label>Porcentaje: <strong>{{ simPercentage }}%</strong></label>
                  <input type="range" min="0" max="100" [value]="simPercentage" (input)="simPercentage = +$any($event.target).value; drawPercentage()">
                </div>
                <div class="sim-control-row">
                  <label>Tema de color:</label>
                  <div style="display:flex;gap:0.35rem">
                    <button class="sim-btn" [class.sim-btn-outline]="simPercentageTheme !== 'purple'" (click)="simPercentageTheme='purple'; drawPercentage()">Morado</button>
                    <button class="sim-btn" [class.sim-btn-outline]="simPercentageTheme !== 'teal'" (click)="simPercentageTheme='teal'; drawPercentage()">Turquesa</button>
                    <button class="sim-btn" [class.sim-btn-outline]="simPercentageTheme !== 'crimson'" (click)="simPercentageTheme='crimson'; drawPercentage()">Carmesí</button>
                  </div>
                </div>
              </div>
              <div class="sim-stats">
                <div class="proj-stat" (mouseenter)="hoveredFormula = 'Fracción = Valor / 100'" (mouseleave)="hoveredFormula = ''"><span>Fracción</span><strong>{{ getPercentageFraction() }}</strong></div>
                <div class="proj-stat" (mouseenter)="hoveredFormula = 'Decimal = Valor / 100'" (mouseleave)="hoveredFormula = ''"><span>Decimal</span><strong>{{ (simPercentage / 100).toFixed(2) }}</strong></div>
                <div class="proj-stat" (mouseenter)="hoveredFormula = 'Resto = 100% - Valor'" (mouseleave)="hoveredFormula = ''"><span>Restante</span><strong>{{ 100 - simPercentage }}%</strong></div>
              </div>
            </div>

            <!-- ═══ 1.2 EXPONENTIAL/POTENCIAS SIMULATOR ═══ -->
            <div class="sim-content" *ngIf="activeSimTab === 'exponential'">
              <div class="sim-info-badge">🌳 Crecimiento y ramificación por potencias (ej. Duplicación)</div>
              <canvas #exponentialCanvas class="sim-canvas"></canvas>
              <div class="sim-controls">
                <div class="sim-control-row">
                  <label>Nivel de ramificación: <strong>{{ simExpA }}</strong></label>
                  <input type="range" min="1" max="5" [value]="simExpA" (input)="simExpA = +$any($event.target).value; drawExponential()">
                </div>
                <div class="sim-control-row">
                  <label>Factor base: <strong>{{ simExpBase }}</strong></label>
                  <input type="range" min="2" max="3" [value]="simExpBase" (input)="simExpBase = +$any($event.target).value; drawExponential()">
                </div>
              </div>
              <div class="sim-stats">
                <div class="proj-stat full" (mouseenter)="hoveredFormula = 'Nodos = Base^Nivel'" (mouseleave)="hoveredFormula = ''">
                  <span>Nodos finales en este nivel</span>
                  <strong>{{ Math.pow(simExpBase, simExpA) }}</strong>
                </div>
              </div>
            </div>

            <!-- ═══ 1.3 RATIONAL LINE SIMULATOR ═══ -->
            <div class="sim-content" *ngIf="activeSimTab === 'rational-line'">
              <div class="sim-info-badge">📍 Ubicación de números racionales (fracciones y decimales) en la recta numérica</div>
              <canvas #rationalCanvas class="sim-canvas"></canvas>
              <div class="sim-controls">
                <div class="sim-control-row">
                  <label>Numerador: <strong>{{ simRatNum }}</strong></label>
                  <input type="range" min="-10" max="10" [value]="simRatNum" (input)="simRatNum = +$any($event.target).value; drawRational()">
                </div>
                <div class="sim-control-row">
                  <label>Denominador: <strong>{{ simRatDen }}</strong></label>
                  <input type="range" min="1" max="10" [value]="simRatDen" (input)="simRatDen = +$any($event.target).value; drawRational()">
                </div>
              </div>
              <div class="sim-stats">
                <div class="proj-stat" (mouseenter)="hoveredFormula = 'Fracción = Numerador / Denominador'" (mouseleave)="hoveredFormula = ''"><span>Fracción</span><strong>{{ simRatNum }}/{{ simRatDen }}</strong></div>
                <div class="proj-stat" (mouseenter)="hoveredFormula = 'Decimal = Valor obtenido de división'" (mouseleave)="hoveredFormula = ''"><span>Decimal</span><strong>{{ (simRatNum / simRatDen) | number:'1.1-3' }}</strong></div>
              </div>
            </div>

            <!-- ═══ 2.1 LINEAR FUNCTION SIMULATOR ═══ -->
            <div class="sim-content" *ngIf="activeSimTab === 'linear'">
              <div class="sim-info-badge">📈 Función lineal y afín — pendiente m e intercepto n</div>
              <canvas #linearCanvas class="sim-canvas"></canvas>
              <div class="sim-controls">
                <div class="sim-control-row">
                  <label>Pendiente m: <strong>{{ simLineSlope }}</strong></label>
                  <input type="range" min="-30" max="30" [value]="simLineSlope * 10" (input)="simLineSlope = +$any($event.target).value / 10; drawLinear()">
                </div>
                <div class="sim-control-row">
                  <label>Intercepto n: <strong>{{ simLineIntercept }}</strong></label>
                  <input type="range" min="-4" max="4" [value]="simLineIntercept" (input)="simLineIntercept = +$any($event.target).value; drawLinear()">
                </div>
              </div>
              <div class="sim-stats">
                <div class="proj-stat" (mouseenter)="hoveredFormula = 'm > 0 (Creciente), m < 0 (Decreciente)'" (mouseleave)="hoveredFormula = ''"><span>Tipo</span><strong>{{ simLineSlope > 0 ? 'Creciente' : simLineSlope < 0 ? 'Decreciente' : 'Constante' }}</strong></div>
                <div class="proj-stat" (mouseenter)="hoveredFormula = 'Intersección Y = (0, n)'" (mouseleave)="hoveredFormula = ''"><span>Corte Y</span><strong>(0, {{ simLineIntercept }})</strong></div>
                <div class="proj-stat" (mouseenter)="hoveredFormula = 'Corte X = (-n / m, 0)'" (mouseleave)="hoveredFormula = ''"><span>Corte X</span><strong>{{ getLinearXIntercept() }}</strong></div>
              </div>
            </div>

            <!-- ═══ 2.2 QUADRATIC FUNCTION SIMULATOR ═══ -->
            <div class="sim-content" *ngIf="activeSimTab === 'quadratic'">
              <div class="sim-info-badge">📉 Función cuadrática — concavidad, vértice e intersecciones</div>
              <canvas #quadraticCanvas class="sim-canvas"></canvas>
              <div class="sim-controls">
                <div class="sim-control-row">
                  <label>Coeficiente a: <strong>{{ simQuadA }}</strong></label>
                  <input type="range" min="-20" max="20" [value]="simQuadA * 10" (input)="setQuadA($event)">
                </div>
                <div class="sim-control-row">
                  <label>Coeficiente b: <strong>{{ simQuadB }}</strong></label>
                  <input type="range" min="-40" max="40" [value]="simQuadB * 10" (input)="simQuadB = +$any($event.target).value / 10; drawQuadratic()">
                </div>
                <div class="sim-control-row">
                  <label>Coeficiente c: <strong>{{ simQuadC }}</strong></label>
                  <input type="range" min="-4" max="4" [value]="simQuadC" (input)="simQuadC = +$any($event.target).value; drawQuadratic()">
                </div>
              </div>
              <div class="sim-stats">
                <div class="proj-stat" (mouseenter)="hoveredFormula = 'a > 0 (Cóncava arriba), a < 0 (abajo)'" (mouseleave)="hoveredFormula = ''"><span>Abertura</span><strong>{{ simQuadA > 0 ? 'Arriba' : 'Abajo' }}</strong></div>
                <div class="proj-stat" (mouseenter)="hoveredFormula = 'Vér = (-b/2a, f(-b/2a))'" (mouseleave)="hoveredFormula = ''"><span>Vértice</span><strong>{{ getQuadraticVertex() }}</strong></div>
                <div class="proj-stat" (mouseenter)="hoveredFormula = 'Δ = b² − 4ac'" (mouseleave)="hoveredFormula = ''"><span>Discriminante</span><strong>{{ getQuadraticDisc() | number:'1.1-1' }}</strong></div>
                <div class="proj-stat" (mouseenter)="hoveredFormula = 'Cortes X según signo de Δ'" (mouseleave)="hoveredFormula = ''"><span>Cortes X</span><strong>{{ getQuadraticDisc() > 0 ? '2 cortes' : getQuadraticDisc() === 0 ? '1 corte' : '0 cortes' }}</strong></div>
              </div>
            </div>

            <!-- ═══ 2.3 FREE GRAPH SIMULATOR ═══ -->
            <div class="sim-content" *ngIf="activeSimTab === 'free-graph'">
              <div class="sim-info-badge">🧮 Graficador Libre — escribe cualquier fórmula en función de x (ej. sin(x) + cos(2*x))</div>
              <canvas #freeCanvas class="sim-canvas"></canvas>
              <div class="sim-controls">
                <div class="sim-control-row">
                  <label>Fórmula f(x):</label>
                  <input type="text" style="flex: 1; padding: 0.35rem 0.5rem; border: 1px solid #d1d5db; border-radius: 6px; font-family: monospace; font-size: 0.9rem;" [value]="simFreeExpression" (input)="updateFreeExpression($event)" placeholder="ej. sin(x) + 0.5*x">
                </div>
                <div class="sim-control-row">
                  <label>Zoom (escala): <strong>{{ simFreeScale }} px/u</strong></label>
                  <input type="range" min="10" max="80" [value]="simFreeScale" (input)="simFreeScale = +$any($event.target).value; drawFreeGraph()">
                </div>
                <div class="sim-control-row">
                  <label>Ejemplos rápidos:</label>
                  <div style="display:flex;gap:0.35rem;flex-wrap:wrap">
                    <button class="sim-btn sim-btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.8rem;" (click)="setFreeExample('sin(x)')">sin(x)</button>
                    <button class="sim-btn sim-btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.8rem;" (click)="setFreeExample('x^3 - 3*x')">x³ - 3x</button>
                    <button class="sim-btn sim-btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.8rem;" (click)="setFreeExample('cos(x)*x')">cos(x)·x</button>
                    <button class="sim-btn sim-btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.8rem;" (click)="setFreeExample('abs(x) - 2')">|x| - 2</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- ═══ 2.4 EQUATION BALANCE SIMULATOR ═══ -->
            <div class="sim-content" *ngIf="activeSimTab === 'equation-balance'">
              <div class="sim-info-badge">⚖️ Balanza de Ecuaciones — encuentra el valor de x que equilibra la ecuación ax + b = c</div>
              <canvas #balanceCanvas class="sim-canvas"></canvas>
              <div class="sim-controls">
                <div class="sim-control-row">
                  <label>Ecuación:</label>
                  <div style="font-weight:bold; font-size: 1rem; color: #7c3aed;">
                    {{ simBalA }}x + {{ simBalB }} = {{ simBalC }}
                  </div>
                </div>
                <div class="sim-control-row">
                  <label>Bolsas de x (a): <strong>{{ simBalA }}</strong></label>
                  <input type="range" min="1" max="4" [value]="simBalA" (input)="simBalA = +$any($event.target).value; drawBalance()">
                </div>
                <div class="sim-control-row">
                  <label>Peso Izq. (b): <strong>{{ simBalB }}</strong></label>
                  <input type="range" min="0" max="6" [value]="simBalB" (input)="simBalB = +$any($event.target).value; drawBalance()">
                </div>
                <div class="sim-control-row">
                  <label>Peso Der. (c): <strong>{{ simBalC }}</strong></label>
                  <input type="range" min="1" max="15" [value]="simBalC" (input)="simBalC = +$any($event.target).value; drawBalance()">
                </div>
                <div class="sim-control-row" style="background: rgba(124,58,237,0.05); padding: 0.5rem; border-radius: 8px; border: 1px dashed rgba(124,58,237,0.2);">
                  <label>Adivina x: <strong>{{ simBalXVal }}</strong></label>
                  <input type="range" min="1" max="5" step="0.5" [value]="simBalXVal" (input)="simBalXVal = +$any($event.target).value; drawBalance()">
                </div>
              </div>
              <div class="sim-stats">
                <div class="proj-stat" (mouseenter)="hoveredFormula = 'Peso Izq = a*x + b'" (mouseleave)="hoveredFormula = ''"><span>Balanza Izq</span><strong>{{ simBalA * simBalXVal + simBalB | number:'1.1-1' }}u</strong></div>
                <div class="proj-stat" (mouseenter)="hoveredFormula = 'Peso Der = c'" (mouseleave)="hoveredFormula = ''"><span>Balanza Der</span><strong>{{ simBalC }}u</strong></div>
                <div class="proj-stat" (mouseenter)="hoveredFormula = 'Estado del equilibrio físico'" (mouseleave)="hoveredFormula = ''"><span>Estado</span><strong>{{ (simBalA * simBalXVal + simBalB === simBalC) ? '⚖️ Equilibrado!' : '⚠️ Desequilibrado' }}</strong></div>
              </div>
            </div>

            <!-- ═══ 3.1 PYTHAGORAS SIMULATOR ═══ -->
            <div class="sim-content" *ngIf="activeSimTab === 'pythagoras'">
              <div class="sim-info-badge">📐 Teorema de Pitágoras — suma de áreas de los catetos y la hipotenusa</div>
              <canvas #pythagorasCanvas class="sim-canvas"></canvas>
              <div class="sim-controls">
                <div class="sim-control-row">
                  <label>Cateto a: <strong>{{ simPythA }}</strong></label>
                  <input type="range" min="30" max="90" [value]="simPythA" (input)="simPythA = +$any($event.target).value; drawPythagoras()">
                </div>
                <div class="sim-control-row">
                  <label>Cateto b: <strong>{{ simPythB }}</strong></label>
                  <input type="range" min="30" max="90" [value]="simPythB" (input)="simPythB = +$any($event.target).value; drawPythagoras()">
                </div>
              </div>
              <div class="sim-stats">
                <div class="proj-stat" (mouseenter)="hoveredFormula = 'Área cateto a = a²'" (mouseleave)="hoveredFormula = ''"><span>Área a²</span><strong>{{ simPythA * simPythA }} px²</strong></div>
                <div class="proj-stat" (mouseenter)="hoveredFormula = 'Área cateto b = b²'" (mouseleave)="hoveredFormula = ''"><span>Área b²</span><strong>{{ simPythB * simPythB }} px²</strong></div>
                <div class="proj-stat" (mouseenter)="hoveredFormula = 'Área hipotenusa = a² + b²'" (mouseleave)="hoveredFormula = ''"><span>Área c²</span><strong>{{ simPythA * simPythA + simPythB * simPythB }} px²</strong></div>
                <div class="proj-stat" (mouseenter)="hoveredFormula = 'Hipotenusa c = √(a² + b²)'" (mouseleave)="hoveredFormula = ''"><span>Hipotenusa c</span><strong>{{ Math.sqrt(simPythA * simPythA + simPythB * simPythB) | number:'1.1-1' }}</strong></div>
              </div>
            </div>

            <!-- ═══ 3.2 ISOMETRIC TRANSFORMATIONS SIMULATOR ═══ -->
            <div class="sim-content" *ngIf="activeSimTab === 'homothetic'">
              <div class="sim-info-badge">🔄 Transformaciones isométricas — traslación, rotación y reflexión</div>
              <canvas #homotheticCanvas class="sim-canvas"></canvas>
              <div class="sim-controls">
                <div class="sim-control-row">
                  <label>Traslación X: <strong>{{ (simHomoK * 10 - 15).toFixed(0) }}</strong></label>
                  <input type="range" min="0" max="30" [value]="simHomoK * 10" (input)="simHomoK = +$any($event.target).value / 10; drawHomothetic()">
                </div>
                <div class="sim-control-row">
                  <label>Rotación θ: <strong>{{ simCircAngle }}°</strong></label>
                  <input type="range" min="0" max="360" [value]="simCircAngle" (input)="simCircAngle = +$any($event.target).value; drawHomothetic()">
                </div>
                <div class="sim-control-row">
                  <label>Reflexión:</label>
                  <div style="display:flex;gap:0.35rem">
                    <button class="sim-btn" [class.sim-btn-outline]="simHomoCenter !== 'origin'" (click)="simHomoCenter='origin'; drawHomothetic()">Eje X</button>
                    <button class="sim-btn" [class.sim-btn-outline]="simHomoCenter !== 'offset'" (click)="simHomoCenter='offset'; drawHomothetic()">Eje Y</button>
                  </div>
                </div>
              </div>
              <div class="sim-stats">
                <div class="proj-stat full" (mouseenter)="hoveredFormula = 'Conservan área, forma y dimensiones'" (mouseleave)="hoveredFormula = ''">
                  <span>Propiedad Isométrica</span>
                  <strong>Área y Ángulos Congruentes</strong>
                </div>
              </div>
            </div>

            <!-- ═══ 3.3 THALES THEOREM SIMULATOR ═══ -->
            <div class="sim-content" *ngIf="activeSimTab === 'thales-theorem'">
              <div class="sim-info-badge">🌿 Teorema de Thales — proporcionalidad de segmentos formados por paralelas y secantes</div>
              <canvas #thalesCanvas class="sim-canvas"></canvas>
              <div class="sim-controls">
                <div class="sim-control-row">
                  <label>Línea Intermedia: <strong>{{ simThalesL2 }}%</strong></label>
                  <input type="range" min="20" max="80" [value]="simThalesL2" (input)="simThalesL2 = +$any($event.target).value; drawThales()">
                </div>
                <div class="sim-control-row">
                  <label>Inclinación Secante: <strong>{{ simThalesAngle }}°</strong></label>
                  <input type="range" min="-30" max="30" [value]="simThalesAngle" (input)="simThalesAngle = +$any($event.target).value; drawThales()">
                </div>
              </div>
              <div class="sim-stats">
                <div class="proj-stat" (mouseenter)="hoveredFormula = 'Razón lado izquierdo = AB / BC'" (mouseleave)="hoveredFormula = ''"><span>Razón Izq</span><strong>{{ getThalesRatios().left | number:'1.2-2' }}</strong></div>
                <div class="proj-stat" (mouseenter)="hoveredFormula = 'Razón lado derecho = DE / EF'" (mouseleave)="hoveredFormula = ''"><span>Razón Der</span><strong>{{ getThalesRatios().right | number:'1.2-2' }}</strong></div>
                <div class="proj-stat" (mouseenter)="hoveredFormula = 'Teorema de Thales: AB / BC = DE / EF'" (mouseleave)="hoveredFormula = ''"><span>Thales</span><strong>Comprobado!</strong></div>
              </div>
            </div>

            <!-- ═══ 4.1 DICE SIMULATION ═══ -->
            <div class="sim-content" *ngIf="activeSimTab === 'dice-simulation'">
              <div class="sim-info-badge">🎲 Frecuencias relativas y Ley de los Grandes Números</div>
              <canvas #diceCanvas class="sim-canvas"></canvas>
              <div class="sim-controls">
                <div class="sim-control-row">
                  <label>Dados:</label>
                  <div style="display:flex;gap:0.35rem;flex:1">
                    <button class="sim-btn" style="flex:1" [class.sim-btn-outline]="simDiceCount !== 1" (click)="simDiceCount=1; clearDiceData()">1 Dado</button>
                    <button class="sim-btn" style="flex:1" [class.sim-btn-outline]="simDiceCount !== 2" (click)="simDiceCount=2; clearDiceData()">2 Dados</button>
                  </div>
                </div>
                <div class="sim-control-row">
                  <label>Lanzamientos:</label>
                  <div style="display:flex;gap:0.35rem;flex:1">
                    <button class="sim-btn" style="flex:1" (click)="simDiceThrows=10; simulateDiceRolls()">+10</button>
                    <button class="sim-btn" style="flex:1" (click)="simDiceThrows=100; simulateDiceRolls()">+100</button>
                    <button class="sim-btn" style="flex:1" (click)="simDiceThrows=1000; simulateDiceRolls()">+1000</button>
                  </div>
                </div>
                <div class="sim-control-row">
                  <button class="sim-btn" style="flex:1;background:#ef4444" (click)="clearDiceData()">🗑️ Limpiar Historial</button>
                </div>
              </div>
              <div class="sim-stats">
                <div class="proj-stat full" (mouseenter)="hoveredFormula = 'Frec. experimental tiende a prob. teórica'" (mouseleave)="hoveredFormula = ''">
                  <span>Total lanzamientos acumulados</span>
                  <strong>{{ simDiceTotalRolls }}</strong>
                </div>
              </div>
            </div>

            <!-- ═══ 4.2 MULTIGRAPH SIMULATOR ═══ -->
            <div class="sim-content" *ngIf="activeSimTab === 'multigraph'">
              <div class="sim-info-badge">📊 Generador Multigráfico — compara la misma información en barras y sectores</div>
              <canvas #multigraphCanvas class="sim-canvas"></canvas>
              <div class="sim-controls">
                <div class="sim-control-row">
                  <label style="color:#2563eb">Categoría A (Azul): <strong>{{ simGraphA }}</strong></label>
                  <input type="range" min="5" max="50" [value]="simGraphA" (input)="simGraphA = +$any($event.target).value; drawMultigraph()">
                </div>
                <div class="sim-control-row">
                  <label style="color:#059669">Categoría B (Verde): <strong>{{ simGraphB }}</strong></label>
                  <input type="range" min="5" max="50" [value]="simGraphB" (input)="simGraphB = +$any($event.target).value; drawMultigraph()">
                </div>
                <div class="sim-control-row">
                  <label style="color:#7c3aed">Categoría C (Morado): <strong>{{ simGraphC }}</strong></label>
                  <input type="range" min="5" max="50" [value]="simGraphC" (input)="simGraphC = +$any($event.target).value; drawMultigraph()">
                </div>
              </div>
              <div class="sim-stats">
                <div class="proj-stat" (mouseenter)="hoveredFormula = 'Porcentaje = A / Total'" (mouseleave)="hoveredFormula = ''"><span>A %</span><strong>{{ getMultigraphPct().a | number:'1.1-1' }}%</strong></div>
                <div class="proj-stat" (mouseenter)="hoveredFormula = 'Porcentaje = B / Total'" (mouseleave)="hoveredFormula = ''"><span>B %</span><strong>{{ getMultigraphPct().b | number:'1.1-1' }}%</strong></div>
                <div class="proj-stat" (mouseenter)="hoveredFormula = 'Porcentaje = C / Total'" (mouseleave)="hoveredFormula = ''"><span>C %</span><strong>{{ getMultigraphPct().c | number:'1.1-1' }}%</strong></div>
              </div>
            </div>
          </ng-container>

          <!-- ================= M2 SIMULATORS CONTENT ================= -->
          <ng-container *ngIf="isM2Route()">
            <!-- ═══ 1.1 EXPONENTIAL M2 (Compound Interest) ═══ -->
            <div class="sim-content" *ngIf="activeSimTab === 'exponential-m2'">
              <div class="sim-info-badge">💰 Crecimiento financiero — interés compuesto capitalizable y continuo</div>
              <canvas #exponentialM2Canvas class="sim-canvas"></canvas>
              <div class="sim-controls">
                <div class="sim-control-row">
                  <label>Capital Inicial (P): <strong>$ {{ simM2Cap }}</strong></label>
                  <input type="range" min="500" max="5000" step="100" [value]="simM2Cap" (input)="simM2Cap = +$any($event.target).value; drawExponentialM2()">
                </div>
                <div class="sim-control-row">
                  <label>Interés anual (r): <strong>{{ (simM2Rate * 100).toFixed(0) }}%</strong></label>
                  <input type="range" min="1" max="30" [value]="simM2Rate * 100" (input)="simM2Rate = +$any($event.target).value / 100; drawExponentialM2()">
                </div>
                <div class="sim-control-row">
                  <label>Capitalización:</label>
                  <div style="display:flex;gap:0.35rem;flex-wrap:wrap">
                    <button class="sim-btn" style="padding:0.25rem 0.45rem; font-size:0.8rem" [class.sim-btn-outline]="simM2Freq !== 'yearly'" (click)="simM2Freq='yearly'; drawExponentialM2()">Anual</button>
                    <button class="sim-btn" style="padding:0.25rem 0.45rem; font-size:0.8rem" [class.sim-btn-outline]="simM2Freq !== 'quarterly'" (click)="simM2Freq='quarterly'; drawExponentialM2()">Trimestral</button>
                    <button class="sim-btn" style="padding:0.25rem 0.45rem; font-size:0.8rem" [class.sim-btn-outline]="simM2Freq !== 'monthly'" (click)="simM2Freq='monthly'; drawExponentialM2()">Mensual</button>
                    <button class="sim-btn" style="padding:0.25rem 0.45rem; font-size:0.8rem" [class.sim-btn-outline]="simM2Freq !== 'continuous'" (click)="simM2Freq='continuous'; drawExponentialM2()">Continua (e^rt)</button>
                  </div>
                </div>
              </div>
              <div class="sim-stats">
                <div class="proj-stat" (mouseenter)="hoveredFormula = simM2Freq === 'continuous' ? 'A(t) = P·e^(rt)' : 'A(t) = P(1 + r/n)^(nt)'" (mouseleave)="hoveredFormula = ''">
                  <span>Monto acumulado a 20 años</span>
                  <strong>$ {{ getExponentialM2Final() | number:'1.0-0' }}</strong>
                </div>
              </div>
            </div>

            <!-- ═══ 1.2 LOG-EXPONENTIAL M2 ═══ -->
            <div class="sim-content" *ngIf="activeSimTab === 'log-exponential-m2'">
              <div class="sim-info-badge">🪵 Relación inversa exponencial-logarítmica — b^y = x  y  log_b(x) = y</div>
              <canvas #logExpCanvas class="sim-canvas"></canvas>
              <div class="sim-controls">
                <div class="sim-control-row">
                  <label>Base b: <strong>{{ simM2LogBase }}</strong></label>
                  <input type="range" min="2" max="5" [value]="simM2LogBase" (input)="simM2LogBase = +$any($event.target).value; drawLogExpM2()">
                </div>
                <div class="sim-control-row">
                  <label>Exponente y: <strong>{{ simM2LogY }}</strong></label>
                  <input type="range" min="-2" max="3" [value]="simM2LogY" (input)="simM2LogY = +$any($event.target).value; drawLogExpM2()">
                </div>
              </div>
            </div>

            <!-- ═══ 2.1 SYSTEM 2X2 ═══ -->
            <div class="sim-content" *ngIf="activeSimTab === 'system2x2'">
              <div class="sim-info-badge">🔗 Sistemas 2x2 — análisis geométrico de intersecciones</div>
              <canvas #system2x2Canvas class="sim-canvas"></canvas>
              <div class="sim-controls">
                <div class="sim-control-row">
                  <label>Recta 1 (m1, n1): <strong>y = {{ simSysM1 }}x + {{ simSysN1 }}</strong></label>
                  <div style="display:flex;gap:0.35rem">
                    <input type="range" min="-30" max="30" [value]="simSysM1 * 10" (input)="simSysM1 = +$any($event.target).value / 10; drawSystem2x2()" style="flex:1">
                    <input type="range" min="-4" max="4" [value]="simSysN1" (input)="simSysN1 = +$any($event.target).value; drawSystem2x2()" style="flex:1">
                  </div>
                </div>
                <div class="sim-control-row">
                  <label>Recta 2 (m2, n2): <strong>y = {{ simSysM2 }}x + {{ simSysN2 }}</strong></label>
                  <div style="display:flex;gap:0.35rem">
                    <input type="range" min="-30" max="30" [value]="simSysM2 * 10" (input)="simSysM2 = +$any($event.target).value / 10; drawSystem2x2()" style="flex:1">
                    <input type="range" min="-4" max="4" [value]="simSysN2" (input)="simSysN2 = +$any($event.target).value; drawSystem2x2()" style="flex:1">
                  </div>
                </div>
              </div>
              <div class="sim-stats">
                <div class="proj-stat full" (mouseenter)="hoveredFormula = 'Ratios de pendientes determinan compatibilidad'" (mouseleave)="hoveredFormula = ''">
                  <span>Clasificación del Sistema</span>
                  <strong>{{ getSystemStatus() }}</strong>
                </div>
              </div>
            </div>

            <!-- ═══ 2.2 SINUSOIDAL WAVES ═══ -->
            <div class="sim-content" *ngIf="activeSimTab === 'sinusoidal'">
              <div class="sim-info-badge">〜 Ondas trigonométricas — amplitud, frecuencia, fase y traslación</div>
              <canvas #sinusoidalCanvas class="sim-canvas"></canvas>
              <div class="sim-controls">
                <div class="sim-control-row">
                  <label>Amplitud A: <strong>{{ simSineA }}</strong></label>
                  <input type="range" min="5" max="30" [value]="simSineA * 10" (input)="simSineA = +$any($event.target).value / 10; drawSinusoidal()">
                </div>
                <div class="sim-control-row">
                  <label>Frecuencia B (Período): <strong>{{ simSineB }}</strong></label>
                  <input type="range" min="5" max="30" [value]="simSineB * 10" (input)="simSineB = +$any($event.target).value / 10; drawSinusoidal()">
                </div>
                <div class="sim-control-row">
                  <label>Desfase C: <strong>{{ (simSineC * 180 / Math.PI).toFixed(0) }}°</strong></label>
                  <input type="range" min="-180" max="180" [value]="simSineC * 180 / Math.PI" (input)="simSineC = +$any($event.target).value * Math.PI / 180; drawSinusoidal()">
                </div>
                <div class="sim-control-row">
                  <label>Desplazamiento D: <strong>{{ simSineD }}</strong></label>
                  <input type="range" min="-2" max="2" step="0.5" [value]="simSineD" (input)="simSineD = +$any($event.target).value; drawSinusoidal()">
                </div>
                <div class="sim-control-row">
                  <label>Animación:</label>
                  <button class="sim-btn" (click)="toggleSineAnimation()">{{ simSineAnimating ? '⏸ Pausar' : '▶ Animar Flujo' }}</button>
                </div>
              </div>
            </div>

            <!-- ═══ 2.3 INVERSE-SYMMETRY M2 ═══ -->
            <div class="sim-content" *ngIf="activeSimTab === 'inverse-symmetry-m2'">
              <div class="sim-info-badge">🪞 Simetría axial de funciones inversas respecto a la diagonal y = x</div>
              <canvas #invSymmetryCanvas class="sim-canvas"></canvas>
              <div class="sim-controls">
                <div class="sim-control-row">
                  <label>Base b: <strong>{{ simM2InvBase }}</strong></label>
                  <input type="range" min="12" max="30" [value]="simM2InvBase * 10" (input)="simM2InvBase = +$any($event.target).value / 10; drawInvSymmetryM2()">
                </div>
              </div>
            </div>

            <!-- ═══ 3.1 HOMOTHETIC M2 ═══ -->
            <div class="sim-content" *ngIf="activeSimTab === 'homothetic-m2'">
              <div class="sim-info-badge">🎯 Homotecia Dinámica — transformaciones de escala en el plano</div>
              <canvas #homotheticM2Canvas class="sim-canvas"></canvas>
              <div class="sim-controls">
                <div class="sim-control-row">
                  <label>Factor de escala k: <strong>{{ simHomoK }}</strong></label>
                  <input type="range" min="-20" max="20" [value]="simHomoK * 10" (input)="simHomoK = +$any($event.target).value / 10; drawHomotheticM2()">
                </div>
                <div class="sim-control-row">
                  <label>Centro de homotecia O:</label>
                  <div style="display:flex;gap:0.35rem">
                    <button class="sim-btn" [class.sim-btn-outline]="simHomoCenter !== 'origin'" (click)="simHomoCenter='origin'; drawHomotheticM2()">Origen (0, 0)</button>
                    <button class="sim-btn" [class.sim-btn-outline]="simHomoCenter !== 'offset'" (click)="simHomoCenter='offset'; drawHomotheticM2()">Desplazado (2, 2)</button>
                  </div>
                </div>
              </div>
              <div class="sim-stats">
                <div class="proj-stat" (mouseenter)="hoveredFormula = 'Razón de perímetros = |k|'" (mouseleave)="hoveredFormula = ''"><span>Escala lineal</span><strong>{{ Math.abs(simHomoK) | number:'1.1-1' }}x</strong></div>
                <div class="proj-stat" (mouseenter)="hoveredFormula = 'Razón de áreas = k²'" (mouseleave)="hoveredFormula = ''"><span>Escala áreas</span><strong>{{ simHomoK * simHomoK | number:'1.2-2' }}x</strong></div>
              </div>
            </div>

            <!-- ═══ 3.2 CIRCLE THEOREMS ═══ -->
            <div class="sim-content" *ngIf="activeSimTab === 'circle-theorems'">
              <div class="sim-info-badge">⭕ Circunferencia M2 — ángulos inscritos/centrales y teorema de cuerdas</div>
              <canvas #circleCanvas class="sim-canvas"></canvas>
              <div class="sim-controls">
                <div class="sim-control-row">
                  <label>Modo de Estudio:</label>
                  <div style="display:flex;gap:0.35rem;flex:1">
                    <button class="sim-btn" style="flex:1" [class.sim-btn-outline]="simCircMode !== 'angles'" (click)="simCircMode='angles'; drawCircleTheorems()">Ángulos</button>
                    <button class="sim-btn" style="flex:1" [class.sim-btn-outline]="simCircMode !== 'chords'" (click)="simCircMode='chords'; drawCircleTheorems()">Cuerdas</button>
                  </div>
                </div>
                <div class="sim-control-row" *ngIf="simCircMode === 'angles'">
                  <label>Ángulo Central: <strong>{{ simCircAngle }}°</strong></label>
                  <input type="range" min="15" max="170" [value]="simCircAngle" (input)="simCircAngle = +$any($event.target).value; drawCircleTheorems()">
                </div>
                <div class="sim-control-row" *ngIf="simCircMode === 'chords'">
                  <label>Desplazar Cruce P:</label>
                  <input type="range" min="30" max="150" [value]="simCircAngle" (input)="simCircAngle = +$any($event.target).value; drawCircleTheorems()">
                </div>
              </div>
              <div class="sim-stats">
                <div class="proj-stat full" (mouseenter)="hoveredFormula = simCircMode === 'angles' ? 'Inscrito = Central / 2' : 'PA · PB = PC · PD'" (mouseleave)="hoveredFormula = ''">
                  <span>{{ getCircleData().segments }}</span>
                  <strong>{{ getCircleData().check }}</strong>
                </div>
              </div>
            </div>

            <!-- ═══ 3.3 TRIG-CIRCLE M2 ═══ -->
            <div class="sim-content" *ngIf="activeSimTab === 'trig-circle-m2'">
              <div class="sim-info-badge">⭕ Razones trigonométricas en el Círculo Unitario (R = 1)</div>
              <canvas #trigCircleCanvas class="sim-canvas"></canvas>
              <div class="sim-controls">
                <div class="sim-control-row">
                  <label>Ángulo θ: <strong>{{ simM2TrigAngle }}°</strong></label>
                  <input type="range" min="0" max="360" [value]="simM2TrigAngle" (input)="simM2TrigAngle = +$any($event.target).value; drawTrigCircleM2()">
                </div>
              </div>
              <div class="sim-stats">
                <div class="proj-stat" (mouseenter)="hoveredFormula = 'sen(θ) = Ordenada (y)'" (mouseleave)="hoveredFormula = ''"><span>sen(θ)</span><strong>{{ Math.sin(simM2TrigAngle * Math.PI / 180) | number:'1.2-2' }}</strong></div>
                <div class="proj-stat" (mouseenter)="hoveredFormula = 'cos(θ) = Abscisa (x)'" (mouseleave)="hoveredFormula = ''"><span>cos(θ)</span><strong>{{ Math.cos(simM2TrigAngle * Math.PI / 180) | number:'1.2-2' }}</strong></div>
                <div class="proj-stat" (mouseenter)="hoveredFormula = 'tan(θ) = sen(θ) / cos(θ)'" (mouseleave)="hoveredFormula = ''"><span>tan(θ)</span><strong>{{ getTrigCircleTan() }}</strong></div>
              </div>
            </div>

            <!-- ═══ 3.4 SPHERE VOLUME M2 ═══ -->
            <div class="sim-content" *ngIf="activeSimTab === 'sphere-volume-m2'">
              <div class="sim-info-badge">🔮 Superficie y volumen de la esfera en función de su radio</div>
              <canvas #sphereCanvas class="sim-canvas"></canvas>
              <div class="sim-controls">
                <div class="sim-control-row">
                  <label>Radio r: <strong>{{ simM2SphereR }}u</strong></label>
                  <input type="range" min="1" max="5" step="0.5" [value]="simM2SphereR" (input)="simM2SphereR = +$any($event.target).value; drawSphereM2()">
                </div>
              </div>
              <div class="sim-stats">
                <div class="proj-stat" (mouseenter)="hoveredFormula = 'Área Superficial = 4·π·r²'" (mouseleave)="hoveredFormula = ''"><span>Área Superficie</span><strong>{{ 4 * Math.PI * simM2SphereR * simM2SphereR | number:'1.1-1' }} u²</strong></div>
                <div class="proj-stat" (mouseenter)="hoveredFormula = 'Volumen = (4/3)·π·r³'" (mouseleave)="hoveredFormula = ''"><span>Volumen</span><strong>{{ (4/3) * Math.PI * Math.pow(simM2SphereR, 3) | number:'1.1-1' }} u³</strong></div>
              </div>
            </div>

            <!-- ═══ 4.1 NORMAL DISTRIBUTION ═══ -->
            <div class="sim-content" *ngIf="activeSimTab === 'normal-distribution'">
              <div class="sim-info-badge">🔔 Campana de Gauss M2 — probabilidad bajo la curva y estandarización Z</div>
              <canvas #normalCanvas class="sim-canvas"></canvas>
              <div class="sim-controls">
                <div class="sim-control-row">
                  <label>Media (μ): <strong>{{ simNormalMean }}</strong></label>
                  <input type="range" min="-20" max="20" [value]="simNormalMean * 10" (input)="simNormalMean = +$any($event.target).value / 10; drawNormalDistribution()">
                </div>
                <div class="sim-control-row">
                  <label>Desviación (σ): <strong>{{ simNormalStd }}</strong></label>
                  <input type="range" min="5" max="20" [value]="simNormalStd * 10" (input)="simNormalStd = +$any($event.target).value / 10; drawNormalDistribution()">
                </div>
                <div class="sim-control-row">
                  <label>Punto corte x₀: <strong>{{ simNormalX0 }}</strong></label>
                  <input type="range" min="-30" max="30" [value]="simNormalX0 * 10" (input)="simNormalX0 = +$any($event.target).value / 10; drawNormalDistribution()">
                </div>
              </div>
              <div class="sim-stats">
                <div class="proj-stat" (mouseenter)="hoveredFormula = 'Z = (x₀ - μ)/σ'" (mouseleave)="hoveredFormula = ''"><span>Puntaje Z</span><strong>{{ getNormalZScore() | number:'1.2-2' }}</strong></div>
                <div class="proj-stat" (mouseenter)="hoveredFormula = 'P(X ≤ x₀) = CDF(Z)'" (mouseleave)="hoveredFormula = ''"><span>Probabilidad</span><strong>{{ getNormalProbability() | number:'1.1-1' }}%</strong></div>
              </div>
            </div>

            <!-- ═══ 4.2 COMBINATORICS M2 ═══ -->
            <div class="sim-content" *ngIf="activeSimTab === 'combinatorics-m2'">
              <div class="sim-info-badge">🔀 Permutaciones, Combinaciones y Variaciones (selección de r elementos entre n)</div>
              <canvas #combinatoricsCanvas class="sim-canvas"></canvas>
              <div class="sim-controls">
                <div class="sim-control-row">
                  <label>Modo:</label>
                  <div style="display:flex;gap:0.35rem;flex:1">
                    <button class="sim-btn" style="flex:1; padding:0.25rem; font-size:0.8rem" [class.sim-btn-outline]="simM2CombMode !== 'permutation'" (click)="simM2CombMode='permutation'; drawCombinatoricsM2()">Permutación</button>
                    <button class="sim-btn" style="flex:1; padding:0.25rem; font-size:0.8rem" [class.sim-btn-outline]="simM2CombMode !== 'combination'" (click)="simM2CombMode='combination'; drawCombinatoricsM2()">Combinación</button>
                    <button class="sim-btn" style="flex:1; padding:0.25rem; font-size:0.8rem" [class.sim-btn-outline]="simM2CombMode !== 'variation'" (click)="simM2CombMode='variation'; drawCombinatoricsM2()">Variación</button>
                  </div>
                </div>
                <div class="sim-control-row">
                  <label>Elementos totales (n): <strong>{{ simM2CombN }}</strong></label>
                  <input type="range" min="3" max="5" [value]="simM2CombN" (input)="setCombM2N($event)">
                </div>
                <div class="sim-control-row" *ngIf="simM2CombMode !== 'permutation'">
                  <label>Grupo selecto (r): <strong>{{ simM2CombR }}</strong></label>
                  <input type="range" min="1" [max]="simM2CombN" [value]="simM2CombR" (input)="simM2CombR = +$any($event.target).value; drawCombinatoricsM2()">
                </div>
              </div>
              <div class="sim-stats">
                <div class="proj-stat full" (mouseenter)="hoveredFormula = getCombinatoricsFormula()" (mouseleave)="hoveredFormula = ''">
                  <span>Resultado total calculado</span>
                  <strong>{{ getCombinatoricsValue() }} combinaciones posibles</strong>
                </div>
              </div>
            </div>

            <!-- ═══ 4.3 BINOMIAL-DISTRIBUTION M2 ═══ -->
            <div class="sim-content" *ngIf="activeSimTab === 'binomial-distribution-m2'">
              <div class="sim-info-badge">📈 Distribución de Probabilidad Binomial (ensayos repetidos)</div>
              <canvas #binomialCanvas class="sim-canvas"></canvas>
              <div class="sim-controls">
                <div class="sim-control-row">
                  <label>Número de ensayos (n): <strong>{{ simM2BinN }}</strong></label>
                  <input type="range" min="4" max="12" [value]="simM2BinN" (input)="simM2BinN = +$any($event.target).value; drawBinomialM2()">
                </div>
                <div class="sim-control-row">
                  <label>Probabilidad éxito (p): <strong>{{ (simM2BinP * 100).toFixed(0) }}%</strong></label>
                  <input type="range" min="10" max="90" step="5" [value]="simM2BinP * 100" (input)="simM2BinP = +$any($event.target).value / 100; drawBinomialM2()">
                </div>
              </div>
              <div class="sim-stats">
                <div class="proj-stat" (mouseenter)="hoveredFormula = 'Esperanza matemática = n·p'" (mouseleave)="hoveredFormula = ''"><span>Media μ</span><strong>{{ simM2BinN * simM2BinP | number:'1.2-2' }}</strong></div>
                <div class="proj-stat" (mouseenter)="hoveredFormula = 'Varianza = n·p·(1-p)'" (mouseleave)="hoveredFormula = ''"><span>Varianza σ²</span><strong>{{ simM2BinN * simM2BinP * (1 - simM2BinP) | number:'1.2-2' }}</strong></div>
              </div>
            </div>
          </ng-container>

          <!-- FORMULA TOOLTIP -->
          <div class="sim-formula-tooltip" [class.show]="hoveredFormula">
            <span class="tooltip-label">Fórmula Aplicada</span>
            <span class="tooltip-formula">{{ hoveredFormula }}</span>
          </div>

        </div>
      </div>
    </ng-container>




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
  `,
  styles: [`
    @keyframes floatLogo { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
    .sidebar-logo-img { width: 230px; height: auto; object-fit: contain; margin: 28px auto 0 auto; filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.2)); animation: floatLogo 3.5s ease-in-out infinite; }
    .mobile-logo-img { width: 160px; height: auto; object-fit: contain; margin: 12px auto 0 auto; animation: floatLogo 3.5s ease-in-out infinite; }
    :host {
      display: block;
      min-height: 100vh;
      color: var(--text-primary);
    }
    .lp-layout.materia-mat1 {
      background-color: #eff6ff;
      background-image:
        radial-gradient(circle at 100% 150%, #bfdbfe 0%, transparent 60%),
        radial-gradient(circle at 0% 0%, #dbeafe 0%, transparent 60%),
        radial-gradient(#1e3a8a 1.5px, transparent 1.5px);
      background-size: 100% 100%, 100% 100%, 24px 24px;
    }
    .lp-layout.materia-mat2 {
      background-color: #f0f9ff;
      background-image:
        radial-gradient(circle at 100% 150%, #bae6fd 0%, transparent 60%),
        radial-gradient(circle at 0% 0%, #e0f2fe 0%, transparent 60%),
        radial-gradient(#0ea5e9 1.5px, transparent 1.5px);
      background-size: 100% 100%, 100% 100%, 24px 24px;
    }
    .lp-layout {
      display: flex;
      min-height: 100vh;
      transition: background-color 0.3s ease;
    }
    .text-gradient { background: var(--gradient-brand); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

    /* SIDEBAR */
    .sidebar { width: 260px; background: rgba(13,15,23,0.95); border-right: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; height: 100vh; z-index: 100; }
    .sidebar-header { height: 110px; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid rgba(255,255,255,0.15); padding: 0 1rem; box-sizing: border-box; }
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
    .duo-path-container {
      position: relative;
      background: transparent;
      padding: 4rem 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow: visible;
    }

    /* MATH BACKGROUND DECORATIONS */
    .physics-bg-decorations {
      position: absolute; inset: 0; pointer-events: none; z-index: 0; overflow: hidden;
      background: radial-gradient(rgba(30, 58, 138, 0.12) 1.5px, transparent 1.5px);
      background-size: 32px 32px;
    }
    .bg-deco { position: absolute; opacity: 0.22; font-family: var(--font-heading, 'Nunito', sans-serif); font-weight: 800; user-select: none; color: #1e3a8a; }
    .materia-mat2 .physics-bg-decorations { background-image: radial-gradient(rgba(14, 165, 233, 0.12) 1.5px, transparent 1.5px); }
    .materia-mat2 .bg-deco { color: #0ea5e9; }
    .bg-deco-orbit { position: absolute; top: 6%; right: -10%; width: 460px; height: 460px; border: 2px dashed rgba(30, 58, 138, 0.16); border-radius: 50%; transform: rotate(-18deg); }
    .bg-deco-orbit::before { content: ''; position: absolute; inset: 70px; border: 2px dashed rgba(30, 58, 138, 0.13); border-radius: 50%; }
    .bg-deco-orbit::after { content: ''; position: absolute; top: 50%; left: 50%; width: 12px; height: 12px; margin: -6px; background: rgba(30, 58, 138, 0.28); border-radius: 50%; }
    .bg-deco-orbit-alt { position: absolute; bottom: 4%; left: -8%; width: 320px; height: 320px; border: 2px dashed rgba(37, 99, 235, 0.15); border-radius: 50%; transform: rotate(12deg); }
    .bg-deco-orbit-alt::before { content: ''; position: absolute; inset: 48px; border: 2px dashed rgba(37, 99, 235, 0.12); border-radius: 50%; }
    .bg-deco-orbit-alt::after { content: ''; position: absolute; top: 50%; left: 50%; width: 10px; height: 10px; margin: -5px; background: rgba(37, 99, 235, 0.25); border-radius: 50%; }
    .materia-mat2 .bg-deco-orbit { border-color: rgba(14, 165, 233, 0.16); }
    .materia-mat2 .bg-deco-orbit::before { border-color: rgba(14, 165, 233, 0.13); }
    .materia-mat2 .bg-deco-orbit::after { background: rgba(14, 165, 233, 0.28); }
    .materia-mat2 .bg-deco-orbit-alt { border-color: rgba(56, 189, 248, 0.15); }
    .materia-mat2 .bg-deco-orbit-alt::before { border-color: rgba(56, 189, 248, 0.12); }
    .materia-mat2 .bg-deco-orbit-alt::after { background: rgba(56, 189, 248, 0.25); }
    @media (max-width: 900px) { .bg-deco-orbit, .bg-deco-orbit-alt { display: none; } }

    /* CHAPTER SPLASH BANNER */
    .chapter-splash { width: 100%; max-width: 600px; position: relative; z-index: 15; border-radius: 28px; overflow: hidden; border: 1.5px solid rgba(133,92,214,0.25); box-shadow: 0 16px 40px rgba(133,92,214,0.12), inset 0 2px 4px rgba(255,255,255,0.8); background: linear-gradient(135deg, #ffffff 0%, #f7f4ff 100%); transition: all 0.3s ease; }
    .materia-mat1 .chapter-splash.chapter-completed { border: 2px solid #1e3a8a !important; box-shadow: 0 16px 40px rgba(30,58,138,0.2), inset 0 2px 4px rgba(255,255,255,0.8) !important; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%) !important; }
    .materia-mat1 .chapter-splash.chapter-completed .splash-badge { background: #1e3a8a !important; }
    .materia-mat2 .chapter-splash.chapter-completed { border: 2px solid #0ea5e9 !important; box-shadow: 0 16px 40px rgba(14,165,233,0.2), inset 0 2px 4px rgba(255,255,255,0.8) !important; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%) !important; }
    .materia-mat2 .chapter-splash.chapter-completed .splash-badge { background: #0ea5e9 !important; }
    .chapter-splash.cap-localizar { background: linear-gradient(150deg, #f3eeff 0%, #e8dff8 40%, #f0ebff 100%); }
    .chapter-splash.cap-interpretar { background: linear-gradient(150deg, #e8f4fd 0%, #d6ecfa 40%, #eaf6ff 100%); }
    .chapter-splash.cap-evaluar { background: linear-gradient(150deg, #e8fde8 0%, #d6f5d6 40%, #eaffea 100%); }
    .splash-bg-pattern { position: absolute; inset: 0; opacity: 0.04; background-image: radial-gradient(circle at 20% 50%, var(--accent-primary) 1px, transparent 1px), radial-gradient(circle at 80% 20%, var(--accent-primary) 1px, transparent 1px), radial-gradient(circle at 60% 80%, var(--accent-primary) 1px, transparent 1px); background-size: 40px 40px, 60px 60px, 50px 50px; pointer-events: none; }
    .splash-inner { position: relative; padding: 2rem 2rem 1.5rem; }
    .splash-hero { display: flex; align-items: center; gap: 1.5rem; }
    .splash-mascot-area { flex-shrink: 0; }
    .splash-mascot { width: 180px; height: 180px; object-fit: contain; animation: mascotFloat 3.5s ease-in-out infinite; }
    @keyframes mascotFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-15px)} }
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
    .splash-guide-btn.locked { background: #e5e5e5; border-color: #cccccc; color: #afafaf; cursor: not-allowed; box-shadow: none; }
    .splash-guide-btn.locked:hover { background: #e5e5e5; border-color: #cccccc; color: #afafaf; transform: none; box-shadow: none; }
    .sgb-icon { font-size: 1.1rem; }

    /* Separator */
    .splash-separator { display: flex; align-items: center; gap: 0.75rem; padding: 1.25rem 2rem 1.5rem; }
    .sep-line { flex: 1; height: 2px; background: linear-gradient(90deg, transparent, rgba(133,92,214,0.15), transparent); }
    .sep-text { font-size: 0.78rem; font-weight: 700; color: var(--text-muted); white-space: nowrap; }

    /* NODE ROW */
    .node-row { width: 100%; display: flex; justify-content: center; position: relative; z-index: 2; }
    .node-wrapper { position: relative; display: flex; flex-direction: column; align-items: center; transition: transform 0.3s ease; }

    /* CAMINITO CONECTOR (SVG) */
    .path-svg {
      position: absolute;
      top: 36px; /* Centrado en el nodo (que mide 72px) */
      left: 50%;
      width: 2px;
      overflow: visible;
      z-index: -1;
    }

    /* NODE FLOATING TITLE (BOTTOM) */
    .node-title { 
      position: absolute; 
      left: 50%; 
      transform: translateX(-50%); 
      font-family: var(--font-heading); 
      font-size: 0.95rem; 
      font-weight: 800; 
      color: var(--text-secondary); 
      white-space: nowrap;
      text-align: center;
      pointer-events: none; 
      transition: all 0.2s; 
      text-shadow: 0 2px 4px rgba(255,255,255,1), 0 0 10px rgba(255,255,255,1); 
    }
    .node-title.historia-title {
      font-size: 0.9rem;
      white-space: normal;
      width: 150px;
      max-width: 150px;
      text-align: center;
      line-height: 1.2;
    }
    .text-completed { 
      color: #3d8c00; 
      background: rgba(255, 255, 255, 0.95); 
      padding: 4px 10px; 
      border-radius: 12px; 
      border: 1.5px solid rgba(88, 204, 2, 0.4); 
      box-shadow: 0 4px 12px rgba(88, 204, 2, 0.15); 
      text-shadow: none;
      z-index: 5;
    }
    .text-active { color: var(--accent-primary); }
    
    .node-title.title-boss { color: #ef4444; text-shadow: 0 2px 4px rgba(255,255,255,1), 0 0 10px rgba(255,255,255,1); }
    .node-title.title-boss.text-completed { color: #ef4444; border: 2.5px solid #ef4444 !important; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25); }
    
    .node-title.title-crown { color: #d97706; text-shadow: 0 2px 4px rgba(255,255,255,1), 0 0 10px rgba(255,255,255,1); font-weight: 900; }
    .node-title.title-crown.text-completed { color: #d97706; border: 2.5px solid #d97706 !important; box-shadow: 0 4px 12px rgba(217, 119, 6, 0.25); }
    
    .node-title.title-practice { color: #0284c7; text-shadow: 0 2px 4px rgba(255,255,255,1), 0 0 10px rgba(255,255,255,1); }
    .node-title.title-practice.text-completed { color: #0284c7; border: 2px solid #0284c7 !important; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.15); }

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
    
    .node-completed.node-practice .node-inner { box-shadow: inset 0 0 0 4px #0284c7; }
    .node-completed.node-boss .node-inner { box-shadow: inset 0 0 0 4px #ef4444; }

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

    /* ============================================
       PHYSICS SIMULATOR PANEL
    ============================================ */
    .sim-tab-trigger {
      position: fixed;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
      color: white;
      border: none;
      border-radius: 14px 0 0 14px;
      padding: 1rem 0.6rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.4rem;
      cursor: pointer;
      z-index: 500;
      box-shadow: -4px 0 20px rgba(124,58,237,0.35);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      min-width: 52px;
    }
    .sim-tab-trigger:hover {
      background: linear-gradient(135deg, #6d28d9 0%, #4338ca 100%);
      box-shadow: -6px 0 24px rgba(124,58,237,0.5);
      padding-right: 0.85rem;
    }
    .sim-tab-trigger.panel-open {
      right: 400px;
      border-radius: 14px 0 0 14px;
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    }
    .sim-tab-trigger.panel-open.expanded {
      right: 800px;
    }
    .sim-tab-icon { font-size: 1.4rem; }
    .sim-tab-label {
      font-size: 0.65rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      writing-mode: vertical-rl;
      text-orientation: mixed;
    }
    .sim-tab-arrow { font-size: 0.7rem; opacity: 0.8; }

    .sim-drawer {
      position: fixed;
      right: -420px;
      top: 0;
      height: 100vh;
      width: 400px;
      background: var(--bg-color);
      border-left: 4px solid #7c3aed;
      z-index: 499;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      overflow-y: auto;
      box-shadow: -12px 0 40px rgba(0,0,0,0.1);
    }
    .sim-drawer.expanded {
      width: 800px;
      right: -820px;
    }
    .sim-drawer.open { right: 0; }
    .sim-drawer.open.expanded { right: 0; }
    .sim-drawer::-webkit-scrollbar { width: 4px; }
    .sim-drawer::-webkit-scrollbar-track { background: transparent; }
    .sim-drawer::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.4); border-radius: 4px; }

    .sim-drawer-inner { padding: 1.5rem; transition: padding 0.4s; }

    .sim-chapter-select {
      width: 100%;
      background: #ffffff;
      border: 1px solid var(--section-border);
      color: var(--text-primary);
      padding: 0.6rem 1rem;
      border-radius: 8px;
      font-family: var(--font-heading);
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 1rem;
      outline: none;
      cursor: pointer;
    }
    .sim-chapter-select:focus {
      border-color: #7c3aed;
      box-shadow: 0 0 0 2px rgba(124,58,237,0.3);
    }
    .sim-chapter-select option {
      background: #ffffff;
      color: var(--text-primary);
    }

    .sim-header-actions {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
    .sim-expand-btn {
      background: #7c3aed;
      border: 1px solid #7c3aed;
      color: white;
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      font-size: 0.72rem;
      font-weight: 800;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 10px rgba(124,58,237,0.3);
    }
    .sim-expand-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 14px rgba(124,58,237,0.4);
    }

    .sim-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--section-border);
    }
    .sim-header-left { display: flex; align-items: center; gap: 0.75rem; }
    .sim-header-icon { font-size: 2rem; }
    .sim-title {
      font-family: var(--font-heading);
      font-size: 1rem;
      font-weight: 800;
      color: var(--text-primary);
      margin: 0;
    }
    .sim-subtitle {
      font-size: 0.72rem;
      color: var(--text-secondary);
      margin: 0.1rem 0 0;
    }
    .sim-close-btn {
      background: rgba(0,0,0,0.04);
      border: 1px solid rgba(0,0,0,0.08);
      color: var(--text-secondary);
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s;
    }
    .sim-close-btn:hover { background: rgba(239,68,68,0.1); color: #ef4444; border-color: rgba(239,68,68,0.3); }

    .sim-chapter-groups {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      margin-bottom: 1.25rem;
    }
    .sim-group-label {
      font-size: 0.68rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      padding: 0.6rem 0.25rem 0.25rem;
      border-top: 1px solid var(--section-border);
      margin-top: 0.35rem;
    }
    .sim-chapter-groups .sim-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-bottom: 1rem;
      background: rgba(0,0,0,0.04);
      border-radius: 12px;
      padding: 0.35rem;
    }

    .sim-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-bottom: 1rem;
      background: rgba(0,0,0,0.04);
      border-radius: 12px;
      padding: 0.35rem;
    }
    .sim-tab {
      flex: 1 1 auto;
      background: transparent;
      border: none;
      color: var(--text-secondary);
      padding: 0.5rem 0.65rem;
      border-radius: 8px;
      font-size: 0.72rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .sim-tab:hover { color: var(--text-primary); background: rgba(0,0,0,0.05); }
    .sim-tab.active {
      background: #7c3aed;
      color: white;
      box-shadow: 0 2px 8px rgba(124,58,237,0.3);
    }

    .sim-info-badge {
      background: rgba(124,58,237,0.1);
      border: 1px solid rgba(124,58,237,0.2);
      border-radius: 10px;
      padding: 0.5rem 0.75rem;
      font-size: 0.75rem;
      color: #7c3aed;
      font-weight: 600;
      margin-bottom: 0.75rem;
      line-height: 1.4;
    }

    .sim-canvas {
      width: 100%;
      height: auto;
      border-radius: 12px;
      background: #0d0b1a;
      border: 1px solid rgba(124,58,237,0.25);
      display: block;
      margin-bottom: 1rem;
    }

    .sim-controls { display: flex; flex-direction: column; gap: 0.65rem; margin-bottom: 1rem; }
    .sim-control-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
    }
    .sim-control-row label {
      font-size: 0.78rem;
      color: var(--text-secondary);
      min-width: 120px;
      flex-shrink: 0;
    }
    .sim-control-row label strong { color: var(--text-primary); }
    .sim-control-row input[type="range"] {
      flex: 1;
      accent-color: #7c3aed;
      cursor: pointer;
      height: 4px;
    }

    .sim-btn {
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      color: white;
      border: none;
      padding: 0.45rem 1rem;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .sim-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(124,58,237,0.4); }
    .sim-btn-outline {
      background: transparent;
      border: 1.5px solid rgba(124,58,237,0.5);
      color: #a78bfa;
    }
    .sim-btn-outline:hover { background: rgba(124,58,237,0.15); }

    .sim-stats {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }
    .proj-stat {
      flex: 1;
      min-width: 80px;
      background: #ffffff;
      border: 1px solid var(--section-border);
      border-radius: 10px;
      padding: 0.5rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      cursor: help;
      transition: all 0.2s;
    }
    .proj-stat:hover {
      border-color: #7c3aed;
      box-shadow: var(--shadow-sm);
    }
    .proj-stat.full { flex: 100%; }
    .proj-stat span { font-size: 0.67rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em; }
    .proj-stat strong { font-size: 0.95rem; color: #7c3aed; font-family: var(--font-heading); }

    .sim-formulas-container {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-top: 0.5rem;
    }
    .sim-formula {
      flex: 1;
      min-width: calc(50% - 0.25rem);
      background: #ffffff;
      border: 1px solid var(--section-border);
      box-shadow: var(--shadow-sm);
      border-radius: 10px;
      padding: 0.6rem 0.8rem;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.2rem;
    }
    .formula-label { 
      font-size: 0.65rem; 
      color: var(--text-muted); 
      font-weight: 700; 
      text-transform: uppercase; 
      white-space: nowrap; 
    }
    .formula-text { 
      font-size: 0.85rem; 
      color: var(--text-primary); 
      font-family: monospace; 
      font-weight: bold;
      letter-spacing: 0.03em;
    }

    .sim-formula-tooltip {
      position: absolute;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: #111827;
      color: white;
      padding: 0.8rem 1.2rem;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      border: 1px solid #7c3aed;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.3rem;
      opacity: 0;
      pointer-events: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1000;
      white-space: nowrap;
    }
    .sim-formula-tooltip.show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    .tooltip-label { font-size: 0.7rem; color: #9ca3af; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; }
    .tooltip-formula { font-size: 1.1rem; color: #a78bfa; font-family: monospace; font-weight: bold; }

    @media (max-width: 768px) {
      .sidebar { display: none; }
      .mobile-header { display: flex; }
      .main-content { margin-left: 0; max-width: 100%; }
      .materia-page { padding-top: 60px; }

      .sim-drawer { width: 100vw; right: -100vw; }
      .sim-tab-trigger.panel-open { right: calc(100vw - 10px); }
    }

    @media (max-width: 600px) {
      .node-inner { width: 64px; height: 64px; }
      .node-active .node-inner { width: 68px; height: 68px; }
      .node-icon { width: 28px; height: 28px; }
    }

    /* DECORACIONES MATEMATICAS FLOTANTES (PROPUESTA 2) */
    .math-decor-item {
      position: absolute;
      font-size: 3rem;
      font-weight: 800;
      pointer-events: none;
      user-select: none;
      z-index: 0;
      font-family: 'Outfit', sans-serif;
      opacity: 0.22;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .materia-mat1 .math-decor-item {
      background-image: linear-gradient(135deg, #1e3a8a, #2563eb);
    }
    .materia-mat2 .math-decor-item {
      background-image: linear-gradient(135deg, #0ea5e9, #38bdf8);
    }
    .decor-left {
      left: 10px;
      animation: floatLeft 7s ease-in-out infinite alternate;
    }
    .decor-right {
      right: 10px;
      animation: floatRight 9s ease-in-out infinite alternate;
    }
    @keyframes floatLeft {
      0% { transform: translateY(0) rotate(-6deg); }
      100% { transform: translateY(-16px) rotate(6deg); }
    }
    @keyframes floatRight {
      0% { transform: translateY(0) rotate(6deg); }
      100% { transform: translateY(-16px) rotate(-6deg); }
    }
    @media (max-width: 640px) {
      .math-decor-item { display: none; }
    }
    .btn-infinite-mastery-top {
      background: linear-gradient(135deg, #855cd6, #6366f1);
      color: #ffffff;
      border: 1.5px solid rgba(255, 255, 255, 0.3);
      border-radius: 99px;
      padding: 0.45rem 1rem;
      font-size: 0.85rem;
      font-weight: 800;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
      transition: all 0.2s;
    }
    .btn-infinite-mastery-top:hover {
      transform: translateY(-2px) scale(1.03);
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
      filter: brightness(1.1);
    }
    .infinite-mastery-node-card {
      margin: 3.5rem auto 5rem;
      max-width: 520px;
      width: 90%;
      background: linear-gradient(135deg, #1e1b4b, #312e81);
      border: 2px solid rgba(133, 92, 214, 0.5);
      border-radius: 24px;
      padding: 1.5rem;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      box-shadow: 0 12px 30px rgba(49, 46, 129, 0.4), 0 0 20px rgba(133, 92, 214, 0.3);
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .infinite-mastery-node-card:hover {
      transform: translateY(-5px) scale(1.02);
      border-color: #f59e0b;
      box-shadow: 0 16px 40px rgba(49, 46, 129, 0.6), 0 0 30px rgba(245, 158, 11, 0.4);
    }
    .infinite-portal-badge {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      position: relative;
      z-index: 2;
    }
    .portal-icon {
      font-size: 2.6rem;
      animation: floatPortal 3s ease-in-out infinite;
    }
    @keyframes floatPortal {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-6px) rotate(8deg); }
    }
    .portal-text h4 {
      margin: 0;
      font-size: 1.15rem;
      font-weight: 800;
      color: #ffffff;
    }
    .portal-text p {
      margin: 0.25rem 0 0;
      font-size: 0.85rem;
      color: #c7d2fe;
      font-weight: 500;
    }
    .btn-enter-portal {
      background: #f59e0b;
      color: #1e1b4b;
      border: none;
      border-radius: 12px;
      padding: 0.6rem 1.1rem;
      font-weight: 800;
      font-size: 0.85rem;
      cursor: pointer;
      white-space: nowrap;
      margin-left: auto;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.35);
      transition: all 0.2s;
    }
    .btn-enter-portal:hover {
      background: #fbbf24;
      transform: scale(1.05);
    }
  `]
})
export class MateriaMathPathComponent implements AfterViewInit, OnDestroy {
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
  showInfiniteMastery = false;

  // ─── Math Simulator State ───
  Math = Math;
  simPanelOpen = false;
  simExpanded = false;
  selectedSimChapterIndex = 0;
  activeSimTab: 'percentage' | 'exponential' | 'linear' | 'quadratic' | 'pythagoras' | 'homothetic' | 'dice-simulation' | 'free-graph' | 'exponential-m2' | 'system2x2' | 'sinusoidal' | 'homothetic-m2' | 'circle-theorems' | 'normal-distribution' | 'rational-line' | 'equation-balance' | 'thales-theorem' | 'multigraph' | 'log-exponential-m2' | 'inverse-symmetry-m2' | 'trig-circle-m2' | 'sphere-volume-m2' | 'combinatorics-m2' | 'binomial-distribution-m2' = 'percentage';
  hoveredFormula = '';

  // 1.1 Percentage simulator
  simPercentage = 25;
  simPercentageTheme: 'purple' | 'teal' | 'crimson' = 'purple';

  // 1.2 Exponential simulator
  simExpType: 'exponential' | 'logarithmic' = 'exponential';
  simExpBase = 2.0;
  simExpA = 1.0;

  // 1.3 Rational Line
  simRatNum = 3;
  simRatDen = 4;

  // 1.4 Equation Balance
  simBalA = 2;
  simBalB = 3;
  simBalC = 9;
  simBalXVal = 1;

  // 2.1 Linear function
  simLineSlope = 1.0;
  simLineIntercept = 0.0;

  // 2.2 Quadratic function
  simQuadA = 0.5;
  simQuadB = 0.0;
  simQuadC = 0.0;

  // 2.3 Free Graphing Simulator
  simFreeExpression = 'sin(x)';
  simFreeScale = 20;

  // 3.1 Pythagoras
  simPythA = 60;
  simPythB = 80;

  // 3.2 Homothecy
  simHomoK = 1.5;
  simHomoCenter: 'origin' | 'offset' = 'origin';

  // 3.3 Thales Theorem
  simThalesL2 = 50;
  simThalesAngle = 10;

  // 3.4 Circumference theorems
  simCircAngle = 60;

  // 4.1 Dice simulation
  simDiceCount = 1;
  simDiceThrows = 100;
  simDiceFrequencies: number[] = [];
  simDiceTotalRolls = 0;

  // 4.2 Multigraph
  simGraphA = 20;
  simGraphB = 30;
  simGraphC = 15;

  // ─── M2 specific state ───
  simM2Cap = 1000;
  simM2Rate = 0.08;
  simM2Freq: 'yearly' | 'quarterly' | 'monthly' | 'continuous' = 'yearly';
  simSysM1 = 1.0;
  simSysN1 = 1.0;
  simSysM2 = -1.0;
  simSysN2 = 3.0;
  simSineA = 1.5;
  simSineB = 1.0;
  simSineC = 0.0;
  simSineD = 0.0;
  simCircMode: 'angles' | 'chords' = 'angles';
  simNormalMean = 0.0;
  simNormalStd = 1.0;
  simNormalX0 = 1.0;

  // 6 new M2 properties
  simM2LogBase = 2;
  simM2LogY = 3;
  simM2InvBase = 2.0;
  simM2TrigAngle = 45;
  simM2SphereR = 3;
  simM2CombN = 4;
  simM2CombR = 2;
  simM2CombMode: 'permutation' | 'combination' | 'variation' = 'combination';
  simM2BinN = 8;
  simM2BinP = 0.5;

  // Sine animation properties (needed for lifecycle cleanup)
  simSineAnimating = false;
  simSinePhase = 0;
  simSineAnimFrame: any;

  @ViewChild('percentageCanvas') percentageCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('exponentialCanvas') exponentialCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('linearCanvas') linearCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('quadraticCanvas') quadraticCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('freeCanvas') freeCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pythagorasCanvas') pythagorasCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('homotheticCanvas') homotheticCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('diceCanvas') diceCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('rationalCanvas') rationalCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('balanceCanvas') balanceCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('thalesCanvas') thalesCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('multigraphCanvas') multigraphCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('exponentialM2Canvas') exponentialM2CanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('system2x2Canvas') system2x2CanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('sinusoidalCanvas') sinusoidalCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('homotheticM2Canvas') homotheticM2CanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('circleCanvas') circleCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('normalCanvas') normalCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('logExpCanvas') logExpCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('invSymmetryCanvas') invSymmetryCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('trigCircleCanvas') trigCircleCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('sphereCanvas') sphereCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('combinatoricsCanvas') combinatoricsCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('binomialCanvas') binomialCanvasRef!: ElementRef<HTMLCanvasElement>;


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

  hasTreeLayout(): boolean {
    const id = this.materiaId();
    return id === 'historia' || id === 'fisica' || id === 'ciencias-fisica';
  }

  getSubcapituloTitle(node: any): string {
    const subCapTag = node.tags?.find((t: string) => t.startsWith('subcapitulo:'));
    if (!subCapTag) return '';
    const raw = subCapTag.split(':')[1].trim();
    return raw.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  isPracticeNode(node: any): boolean {
    return node.title.toLowerCase().includes('práctica') || node.title.toLowerCase().includes('practica');
  }

  // Pattern for horizontal zigzag staggering
  private offsets = [0, -80, -115, -80, 0, 80, 115, 80];

  ngAfterViewInit() {
    // Initial draw will happen when panel opens
  }

  ngOnDestroy() {
    if (this.simSineAnimFrame) cancelAnimationFrame(this.simSineAnimFrame);
  }

  isM1Route(): boolean {
    return this.materiaId() === 'mat1';
  }

  isM2Route(): boolean {
    return this.materiaId() === 'mat2';
  }

  isMathRoute(): boolean {
    return this.isM1Route() || this.isM2Route();
  }

  toggleSimExpand() {
    this.simExpanded = !this.simExpanded;
    setTimeout(() => this.initCurrentSim(), 300);
  }

  setSimChapter(event: Event) {
    const target = event.target as HTMLSelectElement;
    const index = Number(target.value);
    this.selectedSimChapterIndex = index;
    
    if (this.isM1Route()) {
      if (index === 0) this.setSimTab('percentage');
      else if (index === 1) this.setSimTab('linear');
      else if (index === 2) this.setSimTab('pythagoras');
      else if (index === 3) this.setSimTab('dice-simulation');
    } else { // M2
      if (index === 0) this.setSimTab('exponential-m2');
      else if (index === 1) this.setSimTab('system2x2');
      else if (index === 2) this.setSimTab('homothetic-m2');
      else if (index === 3) this.setSimTab('normal-distribution');
    }
  }

  toggleSimPanel() {
    this.simPanelOpen = !this.simPanelOpen;
    if (this.simPanelOpen) {
      if (this.isM1Route()) {
        const m1Tabs = ['percentage', 'exponential', 'linear', 'quadratic', 'pythagoras', 'homothetic', 'dice-simulation', 'free-graph', 'rational-line', 'equation-balance', 'thales-theorem', 'multigraph'];
        if (!m1Tabs.includes(this.activeSimTab)) {
          this.selectedSimChapterIndex = 0;
          this.activeSimTab = 'percentage';
        }
      } else { // M2
        const m2Tabs = ['exponential-m2', 'system2x2', 'sinusoidal', 'homothetic-m2', 'circle-theorems', 'normal-distribution', 'log-exponential-m2', 'inverse-symmetry-m2', 'trig-circle-m2', 'sphere-volume-m2', 'combinatorics-m2', 'binomial-distribution-m2'];
        if (!m2Tabs.includes(this.activeSimTab)) {
          this.selectedSimChapterIndex = 0;
          this.activeSimTab = 'exponential-m2';
        }
      }
      setTimeout(() => this.initCurrentSim(), 100);
    } else {
      this.simSineAnimating = false;
      if (this.simSineAnimFrame) cancelAnimationFrame(this.simSineAnimFrame);
    }
  }

  setSimTab(tab: 'percentage' | 'exponential' | 'linear' | 'quadratic' | 'pythagoras' | 'homothetic' | 'dice-simulation' | 'free-graph' | 'exponential-m2' | 'system2x2' | 'sinusoidal' | 'homothetic-m2' | 'circle-theorems' | 'normal-distribution' | 'rational-line' | 'equation-balance' | 'thales-theorem' | 'multigraph' | 'log-exponential-m2' | 'inverse-symmetry-m2' | 'trig-circle-m2' | 'sphere-volume-m2' | 'combinatorics-m2' | 'binomial-distribution-m2') {
    this.activeSimTab = tab;
    this.simSineAnimating = false;
    if (this.simSineAnimFrame) cancelAnimationFrame(this.simSineAnimFrame);
    setTimeout(() => this.initCurrentSim(), 50);
  }

  public initCurrentSim() {
    if (this.activeSimTab === 'percentage') this.drawPercentage();
    else if (this.activeSimTab === 'exponential') this.drawExponential();
    else if (this.activeSimTab === 'linear') this.drawLinear();
    else if (this.activeSimTab === 'quadratic') this.drawQuadratic();
    else if (this.activeSimTab === 'pythagoras') this.drawPythagoras();
    else if (this.activeSimTab === 'homothetic') this.drawHomothetic();
    else if (this.activeSimTab === 'dice-simulation') this.drawDiceSimulation();
    else if (this.activeSimTab === 'free-graph') this.drawFreeGraph();
    else if (this.activeSimTab === 'rational-line') this.drawRational();
    else if (this.activeSimTab === 'equation-balance') this.drawBalance();
    else if (this.activeSimTab === 'thales-theorem') this.drawThales();
    else if (this.activeSimTab === 'multigraph') this.drawMultigraph();
    else if (this.activeSimTab === 'exponential-m2') this.drawExponentialM2();
    else if (this.activeSimTab === 'system2x2') this.drawSystem2x2();
    else if (this.activeSimTab === 'sinusoidal') this.drawSinusoidal();
    else if (this.activeSimTab === 'homothetic-m2') this.drawHomotheticM2();
    else if (this.activeSimTab === 'circle-theorems') this.drawCircleTheorems();
    else if (this.activeSimTab === 'normal-distribution') this.drawNormalDistribution();
    else if (this.activeSimTab === 'log-exponential-m2') this.drawLogExpM2();
    else if (this.activeSimTab === 'inverse-symmetry-m2') this.drawInvSymmetryM2();
    else if (this.activeSimTab === 'trig-circle-m2') this.drawTrigCircleM2();
    else if (this.activeSimTab === 'sphere-volume-m2') this.drawSphereM2();
    else if (this.activeSimTab === 'combinatorics-m2') this.drawCombinatoricsM2();
    else if (this.activeSimTab === 'binomial-distribution-m2') this.drawBinomialM2();
  }

  private setupHighDpiCanvas(canvas: HTMLCanvasElement, cssW: number, cssH: number) {
    const dpr = window.devicePixelRatio || 2;
    const targetW = Math.floor(cssW * dpr);
    const targetH = Math.floor(cssH * dpr);
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      canvas.width = targetW;
      canvas.height = targetH;
    }
    const ctx = canvas.getContext('2d')!;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    return { ctx, w: cssW, h: cssH };
  }

  // ─── M1: 1.1 Percentage Simulator ───
  getPercentageFraction(): string {
    const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y));
    const divisor = gcd(this.simPercentage, 100);
    return `${this.simPercentage / divisor} / ${100 / divisor}`;
  }

  drawPercentage() {
    const canvas = this.percentageCanvasRef?.nativeElement;
    if (!canvas) return;
    const { ctx, w, h } = this.setupHighDpiCanvas(canvas, this.simExpanded ? 740 : 340, this.simExpanded ? 360 : 180);
    ctx.clearRect(0, 0, w, h);

    const gridSz = Math.min(w * 0.45, h - 30);
    const startX = 20;
    const startY = (h - gridSz) / 2;
    const cellSz = gridSz / 10;

    const themes = {
      purple: { fill: '#7c3aed', empty: 'rgba(124,58,237,0.08)', stroke: 'rgba(124,58,237,0.2)' },
      teal: { fill: '#0d9488', empty: 'rgba(13,148,136,0.08)', stroke: 'rgba(13,148,136,0.2)' },
      crimson: { fill: '#e11d48', empty: 'rgba(225,29,72,0.08)', stroke: 'rgba(225,29,72,0.2)' }
    };
    const t = themes[this.simPercentageTheme] || themes.purple;

    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        const idx = r * 10 + c;
        const x = startX + c * cellSz;
        const y = startY + (9 - r) * cellSz;

        ctx.fillStyle = idx < this.simPercentage ? t.fill : t.empty;
        ctx.fillRect(x + 1, y + 1, cellSz - 2, cellSz - 2);
        ctx.strokeStyle = t.stroke;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cellSz, cellSz);
      }
    }

    const textX = startX + gridSz + (this.simExpanded ? 40 : 20);
    ctx.fillStyle = '#00f0ff';
    ctx.font = this.simExpanded ? 'bold 24px sans-serif' : 'bold 16px sans-serif';
    ctx.fillText(`${this.simPercentage}% Representado`, textX, h / 2 - 20);

    ctx.font = this.simExpanded ? '18px monospace' : '13px monospace';
    ctx.fillStyle = '#93c5fd';
    ctx.fillText(`Fracción: ${this.getPercentageFraction()}`, textX, h / 2 + 10);
    ctx.fillText(`Decimal: ${(this.simPercentage / 100).toFixed(2)}`, textX, h / 2 + 35);
  }

  // ─── M1: 1.2 Exponential/Potencias Simulator ───
  drawExponential() {
    const canvas = this.exponentialCanvasRef?.nativeElement;
    if (!canvas) return;
    const { ctx, w, h } = this.setupHighDpiCanvas(canvas, this.simExpanded ? 740 : 340, this.simExpanded ? 360 : 180);
    ctx.clearRect(0, 0, w, h);

    const drawBranch = (x: number, y: number, length: number, angle: number, depth: number) => {
      if (depth > this.simExpA) return;
      
      const endX = x + length * Math.cos(angle);
      const endY = y + length * Math.sin(angle);

      ctx.strokeStyle = '#0d9488';
      ctx.lineWidth = Math.max(1, 6 - depth * 1.2);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      if (depth === this.simExpA) {
        ctx.fillStyle = '#0f766e';
        ctx.beginPath();
        ctx.arc(endX, endY, 5, 0, 2 * Math.PI);
        ctx.fill();
      }

      const newLen = length * 0.68;
      const spread = Math.PI / 4.2;

      drawBranch(endX, endY, newLen, angle - spread / 2, depth + 1);
      drawBranch(endX, endY, newLen, angle + spread / 2, depth + 1);
      if (this.simExpBase === 3) {
        drawBranch(endX, endY, newLen, angle, depth + 1);
      }
    };

    drawBranch(w / 2, h - 15, h * 0.28, -Math.PI / 2, 0);
  }

  // ─── M1: 2.1 Linear Function ───
  getLinearXIntercept(): string {
    if (this.simLineSlope === 0) {
      return this.simLineIntercept === 0 ? 'Infinitos' : 'No existe';
    }
    return `(${(-this.simLineIntercept / this.simLineSlope).toFixed(1)}, 0)`;
  }

  drawLinear() {
    const canvas = this.linearCanvasRef?.nativeElement;
    if (!canvas) return;
    const { ctx, w, h } = this.setupHighDpiCanvas(canvas, this.simExpanded ? 740 : 340, this.simExpanded ? 360 : 180);
    ctx.clearRect(0, 0, w, h);

    const originX = w / 2;
    const originY = h / 2;
    const scale = this.simExpanded ? 40 : 20;

    // Draw grid and axis numbers
    ctx.strokeStyle = 'rgba(0,0,0,0.05)';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#93c5fd';
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const maxUnitsX = Math.ceil(w / scale);
    for (let u = -maxUnitsX; u <= maxUnitsX; u++) {
      const x = originX + u * scale;
      if (x < 0 || x > w) continue;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      if (u !== 0) {
        ctx.fillText(u.toString(), x, originY + 5);
      }
    }

    ctx.textBaseline = 'middle';
    ctx.textAlign = 'right';
    const maxUnitsY = Math.ceil(h / scale);
    for (let u = -maxUnitsY; u <= maxUnitsY; u++) {
      const y = originY - u * scale;
      if (y < 0 || y > h) continue;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      if (u !== 0) {
        ctx.fillText(u.toString(), originX - 5, y);
      }
    }

    // Axes
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, originY); ctx.lineTo(w, originY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(originX, 0); ctx.lineTo(originX, h); ctx.stroke();

    // Label axes
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('X', w - 10, originY - 10);
    ctx.textAlign = 'left';
    ctx.fillText('Y', originX + 10, 10);

    // Plot line
    ctx.strokeStyle = '#7c3aed';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const xLeft = (0 - originX) / scale;
    const yLeft = this.simLineSlope * xLeft + this.simLineIntercept;
    ctx.moveTo(0, originY - yLeft * scale);

    const xRight = (w - originX) / scale;
    const yRight = this.simLineSlope * xRight + this.simLineIntercept;
    ctx.lineTo(w, originY - yRight * scale);
    ctx.stroke();

    ctx.fillStyle = '#e11d48';
    ctx.beginPath();
    ctx.arc(originX, originY - this.simLineIntercept * scale, 5, 0, 2 * Math.PI);
    ctx.fill();
  }

  // ─── M1: 2.2 Quadratic Function ───
  setQuadA(event: Event) {
    const val = +(event.target as HTMLInputElement).value / 10;
    this.simQuadA = val === 0 ? 0.1 : val;
    this.drawQuadratic();
  }

  getQuadraticVertex(): string {
    const xv = -this.simQuadB / (2 * this.simQuadA);
    const yv = this.simQuadA * xv * xv + this.simQuadB * xv + this.simQuadC;
    return `(${xv.toFixed(1)}, ${yv.toFixed(1)})`;
  }

  getQuadraticDisc(): number {
    return this.simQuadB * this.simQuadB - 4 * this.simQuadA * this.simQuadC;
  }

  drawQuadratic() {
    const canvas = this.quadraticCanvasRef?.nativeElement;
    if (!canvas) return;
    const { ctx, w, h } = this.setupHighDpiCanvas(canvas, this.simExpanded ? 740 : 340, this.simExpanded ? 360 : 180);
    ctx.clearRect(0, 0, w, h);

    const originX = w / 2;
    const originY = h * 0.6;
    const scale = this.simExpanded ? 40 : 20;

    // Draw grid and axis numbers
    ctx.strokeStyle = 'rgba(0,0,0,0.05)';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#93c5fd';
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const maxUnitsX = Math.ceil(w / scale);
    for (let u = -maxUnitsX; u <= maxUnitsX; u++) {
      const x = originX + u * scale;
      if (x < 0 || x > w) continue;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      if (u !== 0) {
        ctx.fillText(u.toString(), x, originY + 5);
      }
    }

    ctx.textBaseline = 'middle';
    ctx.textAlign = 'right';
    const maxUnitsY = Math.ceil(h / scale);
    for (let u = -maxUnitsY; u <= maxUnitsY; u++) {
      const y = originY - u * scale;
      if (y < 0 || y > h) continue;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      if (u !== 0) {
        ctx.fillText(u.toString(), originX - 5, y);
      }
    }

    // Draw axes
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, originY); ctx.lineTo(w, originY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(originX, 0); ctx.lineTo(originX, h); ctx.stroke();

    // Label axes
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('X', w - 10, originY - 10);
    ctx.textAlign = 'left';
    ctx.fillText('Y', originX + 10, 10);

    // Plot parabola
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3;
    ctx.beginPath();
    let first = true;
    for (let px = 0; px < w; px++) {
      const x = (px - originX) / scale;
      const y = this.simQuadA * x * x + this.simQuadB * x + this.simQuadC;
      const py = originY - y * scale;
      if (py >= 0 && py <= h) {
        if (first) { ctx.moveTo(px, py); first = false; }
        else ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // Vertex dot
    const xv = -this.simQuadB / (2 * this.simQuadA);
    const yv = this.simQuadA * xv * xv + this.simQuadB * xv + this.simQuadC;
    ctx.fillStyle = '#e11d48';
    ctx.beginPath();
    ctx.arc(originX + xv * scale, originY - yv * scale, 5, 0, 2 * Math.PI);
    ctx.fill();
  }

  // ─── M1: 2.3 Free Graph ───
  updateFreeExpression(event: Event) {
    this.simFreeExpression = (event.target as HTMLInputElement).value;
    this.drawFreeGraph();
  }

  setFreeExample(expr: string) {
    this.simFreeExpression = expr;
    this.drawFreeGraph();
  }

  cleanExpressionForEval(expr: string): string {
    let clean = expr.toLowerCase();
    
    clean = clean.replace(/\bpi\b/g, 'Math.PI');
    clean = clean.replace(/\be\b/g, 'Math.E');

    const functions = ['sin', 'cos', 'tan', 'sqrt', 'exp', 'log', 'abs', 'pow', 'asin', 'acos', 'atan'];
    functions.forEach(f => {
      const regex = new RegExp('\\b' + f + '\\b', 'g');
      clean = clean.replace(regex, 'Math.' + f);
    });

    for (let k = 0; k < 3; k++) {
      clean = clean.replace(/([a-zA-Z0-9_x().]+)\^([a-zA-Z0-9_().]+)/g, 'Math.pow($1, $2)');
    }

    return clean;
  }

  evaluateExpression(cleanExpr: string, x: number): number {
    try {
      const fn = new Function('x', `
        try {
          return ${cleanExpr};
        } catch(e) {
          return NaN;
        }
      `);
      const val = fn(x);
      return typeof val === 'number' && !isNaN(val) ? val : NaN;
    } catch (e) {
      return NaN;
    }
  }

  drawFreeGraph() {
    const canvas = this.freeCanvasRef?.nativeElement;
    if (!canvas) return;
    const { ctx, w, h } = this.setupHighDpiCanvas(canvas, this.simExpanded ? 740 : 340, this.simExpanded ? 360 : 180);
    ctx.clearRect(0, 0, w, h);

    const originX = w / 2;
    const originY = h / 2;
    const scale = this.simFreeScale;

    // Draw grid and axis numbers
    ctx.strokeStyle = 'rgba(0,0,0,0.05)';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#93c5fd';
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const maxUnitsX = Math.ceil(w / scale);
    for (let u = -maxUnitsX; u <= maxUnitsX; u++) {
      const x = originX + u * scale;
      if (x < 0 || x > w) continue;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      if (u !== 0 && u % 2 === 0) {
        ctx.fillText(u.toString(), x, originY + 5);
      }
    }

    ctx.textBaseline = 'middle';
    ctx.textAlign = 'right';
    const maxUnitsY = Math.ceil(h / scale);
    for (let u = -maxUnitsY; u <= maxUnitsY; u++) {
      const y = originY - u * scale;
      if (y < 0 || y > h) continue;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      if (u !== 0 && u % 2 === 0) {
        ctx.fillText(u.toString(), originX - 5, y);
      }
    }

    // Axes
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, originY); ctx.lineTo(w, originY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(originX, 0); ctx.lineTo(originX, h); ctx.stroke();

    // Label axes
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('X', w - 10, originY - 10);
    ctx.textAlign = 'left';
    ctx.fillText('Y', originX + 10, 10);

    // Plot graph of f(x)
    ctx.strokeStyle = '#059669'; // Green curve
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    let first = true;
    const cleanExpr = this.cleanExpressionForEval(this.simFreeExpression);

    for (let px = 0; px < w; px++) {
      const x = (px - originX) / scale;
      const y = this.evaluateExpression(cleanExpr, x);
      if (isNaN(y) || !isFinite(y)) continue;
      
      const py = originY - y * scale;
      if (py >= -100 && py <= h + 100) {
        if (first) {
          ctx.moveTo(px, py);
          first = false;
        } else {
          ctx.lineTo(px, py);
        }
      }
    }
    ctx.stroke();
  }

  // ─── M1: 3.1 Pythagoras ───
  drawPythagoras() {
    const canvas = this.pythagorasCanvasRef?.nativeElement;
    if (!canvas) return;
    const { ctx, w, h } = this.setupHighDpiCanvas(canvas, this.simExpanded ? 740 : 340, this.simExpanded ? 360 : 180);
    ctx.clearRect(0, 0, w, h);

    const scale = this.simExpanded ? 1.6 : 0.8;
    const baseSizeA = this.simPythA * scale;
    const baseSizeB = this.simPythB * scale;

    const cornerX = w * 0.4;
    const cornerY = h * 0.65;

    const ax = cornerX;
    const ay = cornerY - baseSizeA;
    const bx = cornerX + baseSizeB;
    const by = cornerY;

    ctx.fillStyle = 'rgba(239,68,68,0.15)';
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.fillRect(ax - baseSizeA, ay, baseSizeA, baseSizeA);
    ctx.strokeRect(ax - baseSizeA, ay, baseSizeA, baseSizeA);

    ctx.fillStyle = 'rgba(37,99,235,0.15)';
    ctx.strokeStyle = '#2563eb';
    ctx.fillRect(cornerX, cornerY, baseSizeB, baseSizeB);
    ctx.strokeRect(cornerX, cornerY, baseSizeB, baseSizeB);

    ctx.fillStyle = 'rgba(168,85,247,0.18)';
    ctx.strokeStyle = '#a855f7';
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    const dx = bx - ax;
    const dy = by - ay;
    ctx.lineTo(bx - dy, by + dx);
    ctx.lineTo(ax - dy, ay + dx);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = '#f3f4f6';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cornerX, cornerY);
    ctx.lineTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.strokeRect(cornerX, cornerY - 8, 8, 8);
  }

  // ─── M1: 3.2 Isometric Transformations ───
  drawHomothetic() {
    const canvas = this.homotheticCanvasRef?.nativeElement;
    if (!canvas) return;
    const { ctx, w, h } = this.setupHighDpiCanvas(canvas, this.simExpanded ? 740 : 340, this.simExpanded ? 360 : 180);
    ctx.clearRect(0, 0, w, h);

    const originX = w / 2;
    const originY = h / 2;
    const scale = this.simExpanded ? 24 : 12;

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 15) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 15) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, originY); ctx.lineTo(w, originY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(originX, 0); ctx.lineTo(originX, h); ctx.stroke();

    const t1 = { x: 2, y: 1 };
    const t2 = { x: 6, y: 1 };
    const t3 = { x: 3, y: 5 };

    ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(originX + t1.x * scale, originY - t1.y * scale);
    ctx.lineTo(originX + t2.x * scale, originY - t2.y * scale);
    ctx.lineTo(originX + t3.x * scale, originY - t3.y * scale);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    const tx = this.simHomoK * 10 - 15;
    const ty = 0;
    const angleRad = (this.simCircAngle * Math.PI) / 180;
    const reflectAcrossX = this.simHomoCenter === 'origin';
    const reflectAcrossY = this.simHomoCenter === 'offset';

    const transform = (p: { x: number, y: number }) => {
      let x = p.x + tx;
      let y = p.y + ty;

      const rx = x * Math.cos(angleRad) - y * Math.sin(angleRad);
      const ry = x * Math.sin(angleRad) + y * Math.cos(angleRad);
      x = rx;
      y = ry;

      if (reflectAcrossX) y = -y;
      if (reflectAcrossY) x = -x;

      return { x, y };
    };

    const nt1 = transform(t1);
    const nt2 = transform(t2);
    const nt3 = transform(t3);

    ctx.fillStyle = 'rgba(168, 85, 247, 0.18)';
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(originX + nt1.x * scale, originY - nt1.y * scale);
    ctx.lineTo(originX + nt2.x * scale, originY - nt2.y * scale);
    ctx.lineTo(originX + nt3.x * scale, originY - nt3.y * scale);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
  }

  // ─── M1: 4.1 Dice Simulation ───
  clearDiceData() {
    this.simDiceFrequencies = [];
    this.simDiceTotalRolls = 0;
    this.drawDiceSimulation();
  }

  simulateDiceRolls() {
    const rollsCount = this.simDiceThrows;
    const isTwo = this.simDiceCount === 2;
    const outcomes = isTwo ? 11 : 6;
    const minVal = isTwo ? 2 : 1;

    if (this.simDiceFrequencies.length === 0) {
      this.simDiceFrequencies = Array(outcomes).fill(0);
    }

    for (let i = 0; i < rollsCount; i++) {
      const roll1 = Math.floor(Math.random() * 6) + 1;
      const roll2 = isTwo ? (Math.floor(Math.random() * 6) + 1) : 0;
      const sum = roll1 + roll2;
      this.simDiceFrequencies[sum - minVal]++;
    }

    this.simDiceTotalRolls += rollsCount;
    this.drawDiceSimulation();
  }

  drawDiceSimulation() {
    const canvas = this.diceCanvasRef?.nativeElement;
    if (!canvas) return;
    const { ctx, w, h } = this.setupHighDpiCanvas(canvas, this.simExpanded ? 740 : 340, this.simExpanded ? 360 : 180);
    ctx.clearRect(0, 0, w, h);

    const outcomes = this.simDiceCount === 2 ? 11 : 6;
    const minVal = this.simDiceCount === 2 ? 2 : 1;

    const chartW = w * 0.85;
    const chartH = h * 0.7;
    const startX = w * 0.08;
    const startY = h * 0.8;
    const barW = chartW / outcomes;

    if (this.simDiceFrequencies.length === 0) {
      this.simDiceFrequencies = Array(outcomes).fill(0);
    }

    for (let i = 0; i < outcomes; i++) {
      const freq = this.simDiceFrequencies[i];
      const relFreq = this.simDiceTotalRolls > 0 ? freq / this.simDiceTotalRolls : 0;

      const barH = relFreq * chartH * 3.5;
      const x = startX + i * barW + 4;
      const y = startY - Math.min(barH, chartH);

      ctx.fillStyle = '#8b5cf6';
      ctx.fillRect(x, y, barW - 8, Math.min(barH, chartH));

      ctx.fillStyle = '#00f0ff';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${i + minVal}`, x + barW / 2 - 4, startY + 15);
    }

    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    if (this.simDiceCount === 1) {
      const lineY = startY - (1 / 6) * chartH * 3.5;
      ctx.moveTo(startX, lineY); ctx.lineTo(startX + chartW, lineY);
    } else {
      const lineY = startY - (6 / 36) * chartH * 3.5;
      ctx.moveTo(startX, lineY); ctx.lineTo(startX + chartW, lineY);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // ─── M2: 1.1 Exponential M2 (Compound Interest) ───
  drawExponentialM2() {
    const canvas = this.exponentialM2CanvasRef?.nativeElement;
    if (!canvas) return;
    const { ctx, w, h } = this.setupHighDpiCanvas(canvas, this.simExpanded ? 740 : 340, this.simExpanded ? 360 : 180);
    ctx.clearRect(0, 0, w, h);

    const originX = w * 0.12;
    const originY = h * 0.82;
    const chartW = w * 0.82;
    const chartH = h * 0.72;

    // Draw grid
    ctx.strokeStyle = 'rgba(0,0,0,0.05)';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#93c5fd';
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    for (let yr = 0; yr <= 20; yr += 2) {
      const x = originX + (yr / 20) * chartW;
      ctx.beginPath(); ctx.moveTo(x, originY - chartH); ctx.lineTo(x, originY + 5); ctx.stroke();
      ctx.fillText(`${yr}a`, x, originY + 8);
    }

    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let cap = 0; cap <= 6000; cap += 1000) {
      const y = originY - (cap / 6000) * chartH;
      ctx.beginPath(); ctx.moveTo(originX - 5, y); ctx.lineTo(originX + chartW, y); ctx.stroke();
      ctx.fillText(`$${cap}`, originX - 8, y);
    }

    // Axes
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(originX, originY); ctx.lineTo(originX + chartW, originY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(originX, originY); ctx.lineTo(originX, originY - chartH); ctx.stroke();

    // Plot capital growth
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 3;
    ctx.beginPath();

    const P = this.simM2Cap;
    const r = this.simM2Rate;
    const freq = this.simM2Freq;

    let n = 1;
    if (freq === 'monthly') n = 12;
    else if (freq === 'quarterly') n = 4;

    for (let px = 0; px <= chartW; px++) {
      const t = (px / chartW) * 20;
      let amt = 0;
      if (freq === 'continuous') {
        amt = P * Math.exp(r * t);
      } else {
        amt = P * Math.pow(1 + r / n, n * t);
      }
      const y = originY - (amt / 6000) * chartH;
      if (px === 0) ctx.moveTo(originX + px, y);
      else ctx.lineTo(originX + px, y);
    }
    ctx.stroke();
  }

  getExponentialM2Final(): number {
    const P = this.simM2Cap;
    const r = this.simM2Rate;
    const freq = this.simM2Freq;
    let n = 1;
    if (freq === 'monthly') n = 12;
    else if (freq === 'quarterly') n = 4;
    
    if (freq === 'continuous') {
      return P * Math.exp(r * 20);
    }
    return P * Math.pow(1 + r / n, n * 20);
  }

  // ─── M2: 2.1 Systems 2x2 ───
  drawSystem2x2() {
    const canvas = this.system2x2CanvasRef?.nativeElement;
    if (!canvas) return;
    const { ctx, w, h } = this.setupHighDpiCanvas(canvas, this.simExpanded ? 740 : 340, this.simExpanded ? 360 : 180);
    ctx.clearRect(0, 0, w, h);

    const originX = w / 2;
    const originY = h / 2;
    const scale = this.simExpanded ? 40 : 20;

    // Draw grid and axis numbers
    ctx.strokeStyle = 'rgba(0,0,0,0.05)';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#93c5fd';
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const maxUnitsX = Math.ceil(w / scale);
    for (let u = -maxUnitsX; u <= maxUnitsX; u++) {
      const x = originX + u * scale;
      if (x < 0 || x > w) continue;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      if (u !== 0) ctx.fillText(u.toString(), x, originY + 5);
    }

    ctx.textBaseline = 'middle';
    ctx.textAlign = 'right';
    const maxUnitsY = Math.ceil(h / scale);
    for (let u = -maxUnitsY; u <= maxUnitsY; u++) {
      const y = originY - u * scale;
      if (y < 0 || y > h) continue;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      if (u !== 0) ctx.fillText(u.toString(), originX - 5, y);
    }

    // Axes
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, originY); ctx.lineTo(w, originY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(originX, 0); ctx.lineTo(originX, h); ctx.stroke();

    // Plot Recta 1
    ctx.strokeStyle = '#7c3aed';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const xLeft = (0 - originX) / scale;
    ctx.moveTo(0, originY - (this.simSysM1 * xLeft + this.simSysN1) * scale);
    const xRight = (w - originX) / scale;
    ctx.lineTo(w, originY - (this.simSysM1 * xRight + this.simSysN1) * scale);
    ctx.stroke();

    // Plot Recta 2
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, originY - (this.simSysM2 * xLeft + this.simSysN2) * scale);
    ctx.lineTo(w, originY - (this.simSysM2 * xRight + this.simSysN2) * scale);
    ctx.stroke();

    // Intersect check
    if (this.simSysM1 !== this.simSysM2) {
      const interX = (this.simSysN2 - this.simSysN1) / (this.simSysM1 - this.simSysM2);
      const interY = this.simSysM1 * interX + this.simSysN1;
      
      ctx.fillStyle = '#10b981'; // Green dot
      ctx.beginPath();
      ctx.arc(originX + interX * scale, originY - interY * scale, 6, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  getSystemStatus(): string {
    if (this.simSysM1 !== this.simSysM2) {
      const x = (this.simSysN2 - this.simSysN1) / (this.simSysM1 - this.simSysM2);
      const y = this.simSysM1 * x + this.simSysN1;
      return `Solución Única: (${x.toFixed(1)}, ${y.toFixed(1)})`;
    }
    if (this.simSysN1 === this.simSysN2) {
      return 'Infinitas Soluciones (Rectas Coincidentes)';
    }
    return 'Sin Solución (Rectas Paralelas)';
  }

  // ─── M2: 2.2 Sinusoidal Waves ───
  drawSinusoidal() {
    const canvas = this.sinusoidalCanvasRef?.nativeElement;
    if (!canvas) return;
    const { ctx, w, h } = this.setupHighDpiCanvas(canvas, this.simExpanded ? 740 : 340, this.simExpanded ? 360 : 180);
    ctx.clearRect(0, 0, w, h);

    const originX = w / 2;
    const originY = h / 2;
    const scaleX = this.simExpanded ? 80 : 40;
    const scaleY = this.simExpanded ? 60 : 30;

    // Grid and radians labels
    ctx.strokeStyle = 'rgba(0,0,0,0.05)';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#93c5fd';
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const radLabels = [
      { v: -2 * Math.PI, t: '-2π' },
      { v: -Math.PI, t: '-π' },
      { v: -Math.PI / 2, t: '-π/2' },
      { v: Math.PI / 2, t: 'π/2' },
      { v: Math.PI, t: 'π' },
      { v: 2 * Math.PI, t: '2π' }
    ];

    radLabels.forEach(lbl => {
      const x = originX + lbl.v * scaleX;
      if (x >= 0 && x <= w) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        ctx.fillText(lbl.t, x, originY + 5);
      }
    });

    ctx.textBaseline = 'middle';
    ctx.textAlign = 'right';
    for (let u = -3; u <= 3; u++) {
      const y = originY - u * scaleY;
      if (y >= 0 && y <= h) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        if (u !== 0) ctx.fillText(u.toString(), originX - 5, y);
      }
    }

    // Axes
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, originY); ctx.lineTo(w, originY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(originX, 0); ctx.lineTo(originX, h); ctx.stroke();

    // Plot wave: A * sin(B * (x - C) - phase) + D
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();

    const A = this.simSineA;
    const B = this.simSineB;
    const C = this.simSineC;
    const D = this.simSineD;

    for (let px = 0; px <= w; px++) {
      const x = (px - originX) / scaleX;
      const y = A * Math.sin(B * (x - C) - this.simSinePhase) + D;
      const py = originY - y * scaleY;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  toggleSineAnimation() {
    this.simSineAnimating = !this.simSineAnimating;
    if (this.simSineAnimating) {
      this.animateSineWave();
    }
  }

  animateSineWave() {
    if (!this.simSineAnimating) return;
    this.simSinePhase += 0.05;
    this.drawSinusoidal();
    this.simSineAnimFrame = requestAnimationFrame(() => this.animateSineWave());
  }

  // ─── M2: 3.1 Homothetic M2 ───
  drawHomotheticM2() {
    const canvas = this.homotheticM2CanvasRef?.nativeElement;
    if (!canvas) return;
    const { ctx, w, h } = this.setupHighDpiCanvas(canvas, this.simExpanded ? 740 : 340, this.simExpanded ? 360 : 180);
    ctx.clearRect(0, 0, w, h);

    const originX = w / 2;
    const originY = h / 2;
    const scale = this.simExpanded ? 30 : 15;

    // Draw grid and axis numbers
    ctx.strokeStyle = 'rgba(0,0,0,0.05)';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#93c5fd';
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const maxUnitsX = Math.ceil(w / scale);
    for (let u = -maxUnitsX; u <= maxUnitsX; u++) {
      const x = originX + u * scale;
      if (x < 0 || x > w) continue;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      if (u !== 0 && u % 2 === 0) ctx.fillText(u.toString(), x, originY + 5);
    }

    ctx.textBaseline = 'middle';
    ctx.textAlign = 'right';
    const maxUnitsY = Math.ceil(h / scale);
    for (let u = -maxUnitsY; u <= maxUnitsY; u++) {
      const y = originY - u * scale;
      if (y < 0 || y > h) continue;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      if (u !== 0 && u % 2 === 0) ctx.fillText(u.toString(), originX - 5, y);
    }

    // Axes
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, originY); ctx.lineTo(w, originY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(originX, 0); ctx.lineTo(originX, h); ctx.stroke();

    const t1 = { x: 1, y: 1 };
    const t2 = { x: 4, y: 1 };
    const t3 = { x: 2, y: 3 };

    // Center O
    const ox = this.simHomoCenter === 'origin' ? 0 : 2;
    const oy = this.simHomoCenter === 'origin' ? 0 : 2;

    // Draw Center O
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(originX + ox * scale, originY - oy * scale, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText(' O', originX + ox * scale + 5, originY - oy * scale);

    // Draw original triangle (blue)
    ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(originX + t1.x * scale, originY - t1.y * scale);
    ctx.lineTo(originX + t2.x * scale, originY - t2.y * scale);
    ctx.lineTo(originX + t3.x * scale, originY - t3.y * scale);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Scale factor k
    const k = this.simHomoK;

    // Transformed vertices: P' = O + k * (P - O)
    const nt1 = { x: ox + k * (t1.x - ox), y: oy + k * (t1.y - oy) };
    const nt2 = { x: ox + k * (t2.x - ox), y: oy + k * (t2.y - oy) };
    const nt3 = { x: ox + k * (t3.x - ox), y: oy + k * (t3.y - oy) };

    // Draw projection lines (dashed)
    ctx.strokeStyle = 'rgba(107, 114, 128, 0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    const drawProjLine = (pt: { x: number, y: number }, npt: { x: number, y: number }) => {
      ctx.beginPath();
      ctx.moveTo(originX + ox * scale, originY - oy * scale);
      const farX = ox + 2.5 * (npt.x - ox);
      const farY = oy + 2.5 * (npt.y - oy);
      ctx.lineTo(originX + farX * scale, originY - farY * scale);
      ctx.stroke();
    };
    drawProjLine(t1, nt1);
    drawProjLine(t2, nt2);
    drawProjLine(t3, nt3);
    ctx.setLineDash([]);

    // Draw homothetic triangle (purple)
    ctx.fillStyle = 'rgba(168, 85, 247, 0.18)';
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(originX + nt1.x * scale, originY - nt1.y * scale);
    ctx.lineTo(originX + nt2.x * scale, originY - nt2.y * scale);
    ctx.lineTo(originX + nt3.x * scale, originY - nt3.y * scale);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
  }

  // ─── M2: 3.2 Circle Theorems ───
  drawCircleTheorems() {
    const canvas = this.circleCanvasRef?.nativeElement;
    if (!canvas) return;
    const { ctx, w, h } = this.setupHighDpiCanvas(canvas, this.simExpanded ? 740 : 340, this.simExpanded ? 360 : 180);
    ctx.clearRect(0, 0, w, h);

    const centerX = w / 2;
    const centerY = h / 2;
    const radius = this.simExpanded ? 110 : 55;

    // Draw main circle
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    if (this.simCircMode === 'angles') {
      const baseAngleRad = (this.simCircAngle * Math.PI) / 180;
      
      const angleA = Math.PI / 6; 
      const angleB = angleA + baseAngleRad;

      const ax = centerX + radius * Math.cos(angleA);
      const ay = centerY + radius * Math.sin(angleA);
      const bx = centerX + radius * Math.cos(angleB);
      const by = centerY + radius * Math.sin(angleB);

      const angleD = angleA + baseAngleRad + Math.PI * 0.8;
      const dx = centerX + radius * Math.cos(angleD);
      const dy = centerY + radius * Math.sin(angleD);

      // Central angle lines
      ctx.strokeStyle = '#f97316'; 
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ax, ay); ctx.lineTo(centerX, centerY); ctx.lineTo(bx, by);
      ctx.stroke();

      // Inscribed angle lines
      ctx.strokeStyle = '#a855f7'; 
      ctx.beginPath();
      ctx.moveTo(ax, ay); ctx.lineTo(dx, dy); ctx.lineTo(bx, by);
      ctx.stroke();

      // Mark center C
      ctx.fillStyle = '#00f0ff';
      ctx.beginPath(); ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI); ctx.fill();
    } else {
      // Chords mode crossing at P
      const pOffset = (this.simCircAngle - 90) / 90 * radius * 0.5; 
      
      const px_c = centerX + pOffset;
      const py_c = centerY;

      // Chord 1 (horizontal)
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX - radius, py_c);
      ctx.lineTo(centerX + radius, py_c);
      ctx.stroke();

      // Chord 2 (vertical)
      const dy_v = Math.sqrt(radius * radius - pOffset * pOffset);
      ctx.strokeStyle = '#10b981';
      ctx.beginPath();
      ctx.moveTo(px_c, centerY - dy_v);
      ctx.lineTo(px_c, centerY + dy_v);
      ctx.stroke();

      // Point P
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(px_c, py_c, 5, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  getCircleData(): { segments: string; check: string } {
    if (this.simCircMode === 'angles') {
      return {
        segments: `Ángulo Central: ${this.simCircAngle}°`,
        check: `Ángulo Inscrito: ${(this.simCircAngle / 2).toFixed(1)}° (Mitad del central)`
      };
    }
    const pOffset = (this.simCircAngle - 90) / 90 * 55 * 0.5;
    const radius = 55;
    const PA = radius - pOffset;
    const PB = radius + pOffset;
    const PC = Math.sqrt(radius * radius - pOffset * pOffset);
    const PD = PC;
    return {
      segments: `Cuerda 1: PA = ${PA.toFixed(0)}u, PB = ${PB.toFixed(0)}u | Cuerda 2: PC = ${PC.toFixed(0)}u, PD = ${PD.toFixed(0)}u`,
      check: `Producto: PA·PB = ${(PA * PB).toFixed(0)} | PC·PD = ${(PC * PD).toFixed(0)} (Son Iguales!)`
    };
  }

  // ─── M2: 4.1 Normal Distribution ───
  private normalCDF(x: number): number {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2);
    const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + 1.330274 * t))));
    return x >= 0 ? 1 - prob : prob;
  }

  getNormalZScore(): number {
    return (this.simNormalX0 - this.simNormalMean) / this.simNormalStd;
  }

  getNormalProbability(): number {
    return this.normalCDF(this.getNormalZScore()) * 100;
  }

  drawNormalDistribution() {
    const canvas = this.normalCanvasRef?.nativeElement;
    if (!canvas) return;
    const { ctx, w, h } = this.setupHighDpiCanvas(canvas, this.simExpanded ? 740 : 340, this.simExpanded ? 360 : 180);
    ctx.clearRect(0, 0, w, h);

    const originX = w / 2;
    const originY = h * 0.8;
    const scaleX = this.simExpanded ? 80 : 40;
    const scaleY = this.simExpanded ? 240 : 120; 

    // Draw grid
    ctx.strokeStyle = 'rgba(0,0,0,0.05)';
    ctx.lineWidth = 1;
    for (let u = -4; u <= 4; u++) {
      const x = originX + u * scaleX;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }

    // Axis
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, originY); ctx.lineTo(w, originY); ctx.stroke();

    const mu = this.simNormalMean;
    const sigma = this.simNormalStd;
    const x0 = this.simNormalX0;

    const normPdf = (x: number) => {
      const coeff = 1 / (sigma * Math.sqrt(2 * Math.PI));
      const exponent = -0.5 * Math.pow((x - mu) / sigma, 2);
      return coeff * Math.exp(exponent);
    };

    // Shade area
    ctx.fillStyle = 'rgba(139, 92, 246, 0.2)';
    ctx.beginPath();
    ctx.moveTo(0, originY);
    for (let px = 0; px < w; px++) {
      const x = (px - originX) / scaleX;
      if (x > x0) break;
      const y = normPdf(x);
      const py = originY - y * scaleY;
      ctx.lineTo(px, py);
    }
    const endPx = originX + x0 * scaleX;
    ctx.lineTo(endPx, originY);
    ctx.closePath();
    ctx.fill();

    // Plot Gauss Curve
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    let first = true;
    for (let px = 0; px < w; px++) {
      const x = (px - originX) / scaleX;
      const y = normPdf(x);
      const py = originY - y * scaleY;
      if (first) { ctx.moveTo(px, py); first = false; }
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Boundary vertical line
    const x0Px = originX + x0 * scaleX;
    const y0 = normPdf(x0);
    const y0Px = originY - y0 * scaleY;
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x0Px, originY);
    ctx.lineTo(x0Px, y0Px);
    ctx.stroke();
  }

  // ─── M1: 1.3 Rational Line Simulator ───
  drawRational() {
    const canvas = this.rationalCanvasRef?.nativeElement;
    if (!canvas) return;
    const { ctx, w, h } = this.setupHighDpiCanvas(canvas, this.simExpanded ? 740 : 340, this.simExpanded ? 360 : 180);
    ctx.clearRect(0, 0, w, h);

    const originX = w / 2;
    const originY = h * 0.55;
    const scaleX = this.simExpanded ? 110 : 50; // horizontal scale

    // Draw grid
    ctx.strokeStyle = 'rgba(0,0,0,0.05)';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#93c5fd';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    // Major subdivisions (Integers -3 to 3)
    for (let u = -3; u <= 3; u++) {
      const x = originX + u * scaleX;
      ctx.beginPath(); ctx.moveTo(x, originY - 15); ctx.lineTo(x, originY + 15); ctx.stroke();
      ctx.fillText(u.toString(), x, originY + 20);
    }

    // Minor subdivisions (each integer split into simRatDen parts)
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 0.5;
    const den = this.simRatDen;
    for (let u = -3; u < 3; u++) {
      for (let p = 1; p < den; p++) {
        const x = originX + (u + p / den) * scaleX;
        ctx.beginPath(); ctx.moveTo(x, originY - 8); ctx.lineTo(x, originY + 8); ctx.stroke();
      }
    }

    // Main line
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(originX - 3.2 * scaleX, originY); ctx.lineTo(originX + 3.2 * scaleX, originY); ctx.stroke();

    // Arrows at ends
    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.moveTo(originX - 3.2 * scaleX, originY);
    ctx.lineTo(originX - 3.2 * scaleX + 8, originY - 5);
    ctx.lineTo(originX - 3.2 * scaleX + 8, originY + 5);
    ctx.closePath(); ctx.fill();

    ctx.beginPath();
    ctx.moveTo(originX + 3.2 * scaleX, originY);
    ctx.lineTo(originX + 3.2 * scaleX - 8, originY - 5);
    ctx.lineTo(originX + 3.2 * scaleX - 8, originY + 5);
    ctx.closePath(); ctx.fill();

    // Draw selected rational point
    const num = this.simRatNum;
    const targetX = originX + (num / den) * scaleX;

    // Line indicator
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(targetX, originY - 30); ctx.lineTo(targetX, originY + 10); ctx.stroke();
    ctx.setLineDash([]);

    // The dot
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(targetX, originY, 6, 0, 2 * Math.PI); ctx.fill();

    // Label of fractional value above the point
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`${num}/${den}`, targetX, originY - 45);
  }

  // ─── M1: 1.4 Equation Balance Simulator ───
  drawBalance() {
    const canvas = this.balanceCanvasRef?.nativeElement;
    if (!canvas) return;
    const { ctx, w, h } = this.setupHighDpiCanvas(canvas, this.simExpanded ? 740 : 340, this.simExpanded ? 360 : 180);
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h * 0.35;
    const armL = w * 0.35;

    // Calculate physical tilt of balance based on differences in weights
    const weightL = this.simBalA * this.simBalXVal + this.simBalB;
    const weightR = this.simBalC;
    const diff = weightL - weightR;
    const maxTilt = 22 * Math.PI / 180; // max tilt 22 degrees
    const tilt = Math.max(-maxTilt, Math.min(maxTilt, diff * 0.05));

    // Stand base
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx, h - 20);
    ctx.stroke();

    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.moveTo(cx - 30, h - 20);
    ctx.lineTo(cx + 30, h - 20);
    ctx.lineTo(cx, h - 35);
    ctx.closePath();
    ctx.fill();

    // Balance Arm
    const lx = cx - armL * Math.cos(tilt);
    const ly = cy + armL * Math.sin(tilt);
    const rx = cx + armL * Math.cos(tilt);
    const ry = cy - armL * Math.sin(tilt);

    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(rx, ry); ctx.stroke();

    // Fulcro hinge center
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath(); ctx.arc(cx, cy, 6, 0, 2 * Math.PI); ctx.fill();

    // Function to draw a pan with hanging strings and items
    const drawPan = (px: number, py: number, aBags: number, bWeights: number, colorBags: string) => {
      // Hanging strings
      ctx.strokeStyle = '#6b7280';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px - 35, py + 55);
      ctx.moveTo(px, py);
      ctx.lineTo(px + 35, py + 55);
      ctx.stroke();

      // Pan dish
      ctx.fillStyle = '#9ca3af';
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(px - 40, py + 55);
      ctx.lineTo(px + 40, py + 55);
      ctx.quadraticCurveTo(px + 30, py + 68, px, py + 68);
      ctx.quadraticCurveTo(px - 30, py + 68, px - 40, py + 55);
      ctx.closePath();
      ctx.fill(); ctx.stroke();

      // Draw bags (incógnita x)
      ctx.fillStyle = colorBags;
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let i = 0; i < aBags; i++) {
        const bx = px - 25 + (i * 16);
        const by = py + 42;
        ctx.beginPath();
        ctx.arc(bx, by, 7, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillText('x', bx, by);
        ctx.fillStyle = colorBags;
      }

      // Draw +1 unit weights
      ctx.fillStyle = '#f59e0b'; // Gold weights
      for (let i = 0; i < bWeights; i++) {
        const wx = px - 28 + (i % 6) * 11;
        const wy = py + 50 - Math.floor(i / 6) * 10;
        ctx.fillRect(wx, wy, 8, 8);
      }
    };

    // Draw Left and Right Pans
    drawPan(lx, ly, this.simBalA, this.simBalB, '#7c3aed'); // Left Pan
    drawPan(rx, ry, 0, this.simBalC, '#10b981'); // Right Pan
  }

  // ─── M1: 3.3 Thales Theorem ───
  drawThales() {
    const canvas = this.thalesCanvasRef?.nativeElement;
    if (!canvas) return;
    const { ctx, w, h } = this.setupHighDpiCanvas(canvas, this.simExpanded ? 740 : 340, this.simExpanded ? 360 : 180);
    ctx.clearRect(0, 0, w, h);

    const y1 = h * 0.22;
    const y3 = h * 0.78;
    const y2 = y1 + (y3 - y1) * (this.simThalesL2 / 100);

    // Draw parallel lines L1, L2, L3
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(10, y1); ctx.lineTo(w - 10, y1);
    ctx.moveTo(10, y2); ctx.lineTo(w - 10, y2);
    ctx.moveTo(10, y3); ctx.lineTo(w - 10, y3);
    ctx.stroke();

    // Labels for lines
    ctx.fillStyle = '#93c5fd';
    ctx.font = '9px monospace';
    ctx.fillText('L1', 15, y1 - 5);
    ctx.fillText('L2', 15, y2 - 5);
    ctx.fillText('L3', 15, y3 - 5);

    // Coordinates of Transversal Secant 1 (fixed slant)
    const ax1 = w * 0.22;
    const ax3 = w * 0.38;
    const ax2 = ax1 + (ax3 - ax1) * (this.simThalesL2 / 100);

    // Coordinates of Transversal Secant 2 (slanted by simThalesAngle)
    const tiltOffset = Math.tan(this.simThalesAngle * Math.PI / 180) * (y3 - y1);
    const bx1 = w * 0.78;
    const bx3 = w * 0.62 + tiltOffset;
    const bx2 = bx1 + (bx3 - bx1) * (this.simThalesL2 / 100);

    // Draw transversal lines
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(ax1 - (ax3 - ax1) * 0.2, y1 - (y3 - y1) * 0.2);
    ctx.lineTo(ax3 + (ax3 - ax1) * 0.2, y3 + (y3 - y1) * 0.2);
    ctx.moveTo(bx1 - (bx3 - bx1) * 0.2, y1 - (y3 - y1) * 0.2);
    ctx.lineTo(bx3 + (bx3 - bx1) * 0.2, y3 + (y3 - y1) * 0.2);
    ctx.stroke();

    // Highlight segments
    // AB (green), BC (blue) on Secant 1
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = '#10b981';
    ctx.beginPath(); ctx.moveTo(ax1, y1); ctx.lineTo(ax2, y2); ctx.stroke();
    ctx.strokeStyle = '#3b82f6';
    ctx.beginPath(); ctx.moveTo(ax2, y2); ctx.lineTo(ax3, y3); ctx.stroke();

    // DE (orange), EF (purple) on Secant 2
    ctx.strokeStyle = '#f97316';
    ctx.beginPath(); ctx.moveTo(bx1, y1); ctx.lineTo(bx2, y2); ctx.stroke();
    ctx.strokeStyle = '#8b5cf6';
    ctx.beginPath(); ctx.moveTo(bx2, y2); ctx.lineTo(bx3, y3); ctx.stroke();

    // Intersections dots and labels
    const drawDotAndText = (x: number, y: number, label: string) => {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath(); ctx.arc(x, y, 4, 0, 2 * Math.PI); ctx.fill();
      ctx.fillStyle = '#00f0ff';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText(label, x + 8, y + 3);
    };

    drawDotAndText(ax1, y1, 'A');
    drawDotAndText(ax2, y2, 'B');
    drawDotAndText(ax3, y3, 'C');
    drawDotAndText(bx1, y1, 'D');
    drawDotAndText(bx2, y2, 'E');
    drawDotAndText(bx3, y3, 'F');
  }

  getThalesRatios() {
    const ratioVal = this.simThalesL2 / (100 - this.simThalesL2);
    return {
      left: ratioVal,
      right: ratioVal
    };
  }

  // ─── M1: 4.2 Multigraph ───
  drawMultigraph() {
    const canvas = this.multigraphCanvasRef?.nativeElement;
    if (!canvas) return;
    const { ctx, w, h } = this.setupHighDpiCanvas(canvas, this.simExpanded ? 740 : 340, this.simExpanded ? 360 : 180);
    ctx.clearRect(0, 0, w, h);

    const valA = this.simGraphA;
    const valB = this.simGraphB;
    const valC = this.simGraphC;
    const total = valA + valB + valC;

    const midX = w / 2;

    // --- LEFT HALF: Bar Chart ---
    const chartW = w * 0.38;
    const chartH = h * 0.65;
    const startX = w * 0.07;
    const startY = h * 0.8;
    const barW = chartW / 3;

    const maxVal = Math.max(valA, valB, valC, 1);
    const drawBar = (idx: number, val: number, color: string, label: string) => {
      const hBar = (val / maxVal) * chartH;
      const x = startX + idx * barW + 5;
      const y = startY - hBar;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, barW - 10, hBar);

      // Label at bottom
      ctx.fillStyle = '#93c5fd';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(label, x + (barW - 10) / 2, startY + 12);
      ctx.fillText(val.toString(), x + (barW - 10) / 2, y - 5);
    };

    drawBar(0, valA, '#3b82f6', 'Cat A');
    drawBar(1, valB, '#10b981', 'Cat B');
    drawBar(2, valC, '#8b5cf6', 'Cat C');

    // --- RIGHT HALF: Pie Chart ---
    const pieX = w * 0.72;
    const pieY = h * 0.5;
    const radius = this.simExpanded ? 72 : 42;

    if (total > 0) {
      const angles = [
        (valA / total) * 2 * Math.PI,
        (valB / total) * 2 * Math.PI,
        (valC / total) * 2 * Math.PI
      ];
      const colors = ['#3b82f6', '#10b981', '#8b5cf6'];
      let startAngle = -Math.PI / 2;

      for (let i = 0; i < 3; i++) {
        const endAngle = startAngle + angles[i];
        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.moveTo(pieX, pieY);
        ctx.arc(pieX, pieY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();
        startAngle = endAngle;
      }
    } else {
      ctx.strokeStyle = '#d1d5db';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(pieX, pieY, radius, 0, 2 * Math.PI); ctx.stroke();
    }
  }

  getMultigraphPct() {
    const total = this.simGraphA + this.simGraphB + this.simGraphC;
    return {
      a: total > 0 ? (this.simGraphA / total) * 100 : 0,
      b: total > 0 ? (this.simGraphB / total) * 100 : 0,
      c: total > 0 ? (this.simGraphC / total) * 100 : 0
    };
  }

  // ─── M2: 1.2 Log-Exponential Simulator ───
  drawLogExpM2() {
    const canvas = this.logExpCanvasRef?.nativeElement;
    if (!canvas) return;
    const { ctx, w, h } = this.setupHighDpiCanvas(canvas, this.simExpanded ? 740 : 340, this.simExpanded ? 360 : 180);
    ctx.clearRect(0, 0, w, h);

    const b = this.simM2LogBase;
    const y = this.simM2LogY;
    const x = Math.pow(b, y);

    const cardW = w * 0.44;
    const cardH = h * 0.72;
    const padY = h * 0.14;

    // Left Card: Exponential
    ctx.fillStyle = 'rgba(124, 58, 237, 0.04)';
    ctx.strokeStyle = 'rgba(124, 58, 237, 0.2)';
    ctx.lineWidth = 2;
    ctx.fillRect(w * 0.04, padY, cardW, cardH);
    ctx.strokeRect(w * 0.04, padY, cardW, cardH);

    ctx.fillStyle = '#7c3aed';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Forma Exponencial', w * 0.04 + cardW / 2, padY + 22);

    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 24px monospace';
    ctx.fillText(`${b}^${y} = ${x < 1 ? x.toFixed(2) : x}`, w * 0.04 + cardW / 2, padY + cardH / 2 + 5);

    ctx.fillStyle = '#93c5fd';
    ctx.font = '10px sans-serif';
    ctx.fillText(`Base: ${b} | Exp: ${y}`, w * 0.04 + cardW / 2, padY + cardH - 15);

    // Right Card: Logarithmic
    ctx.fillStyle = 'rgba(16, 185, 129, 0.04)';
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
    ctx.fillRect(w * 0.52, padY, cardW, cardH);
    ctx.strokeRect(w * 0.52, padY, cardW, cardH);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('Forma Logarítmica', w * 0.52 + cardW / 2, padY + 22);

    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 21px monospace';
    ctx.fillText(`log_${b}(${x < 1 ? x.toFixed(2) : x}) = ${y}`, w * 0.52 + cardW / 2, padY + cardH / 2 + 5);

    ctx.fillStyle = '#93c5fd';
    ctx.font = '10px sans-serif';
    ctx.fillText(`Base: ${b} | Arg: ${x < 1 ? x.toFixed(2) : x}`, w * 0.52 + cardW / 2, padY + cardH - 15);
  }

  // ─── M2: 2.3 Inverse-Symmetry Simulator ───
  drawInvSymmetryM2() {
    const canvas = this.invSymmetryCanvasRef?.nativeElement;
    if (!canvas) return;
    const { ctx, w, h } = this.setupHighDpiCanvas(canvas, this.simExpanded ? 740 : 340, this.simExpanded ? 360 : 180);
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const scale = this.simExpanded ? 30 : 18;

    // Axes
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(10, cy); ctx.lineTo(w - 10, cy);
    ctx.moveTo(cx, 10); ctx.lineTo(cx, h - 10);
    ctx.stroke();

    // Identity line y = x
    ctx.strokeStyle = 'rgba(107, 114, 128, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(cx - 5 * scale, cy + 5 * scale);
    ctx.lineTo(cx + 5 * scale, cy - 5 * scale);
    ctx.stroke();
    ctx.setLineDash([]);

    const b = this.simM2InvBase;

    // 1. Exponential function: y = b^x
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let screenX = 10; screenX < w - 10; screenX++) {
      const xVal = (screenX - cx) / scale;
      const yVal = Math.pow(b, xVal);
      const screenY = cy - yVal * scale;
      if (screenY >= 10 && screenY <= h - 10) {
        if (screenX === 10) ctx.moveTo(screenX, screenY);
        else ctx.lineTo(screenX, screenY);
      }
    }
    ctx.stroke();

    // 2. Logarithmic function: y = log_b(x)
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    let firstLogPoint = true;
    for (let screenX = cx + 1; screenX < w - 10; screenX++) {
      const xVal = (screenX - cx) / scale;
      const yVal = Math.log(xVal) / Math.log(b);
      const screenY = cy - yVal * scale;
      if (screenY >= 10 && screenY <= h - 10) {
        if (firstLogPoint) {
          ctx.moveTo(screenX, screenY);
          firstLogPoint = false;
        } else {
          ctx.lineTo(screenX, screenY);
        }
      }
    }
    ctx.stroke();

    // Label curves
    ctx.fillStyle = '#2563eb';
    ctx.font = '10px monospace';
    ctx.fillText(`y = ${b}^x`, cx + 2 * scale, cy - Math.pow(b, 2) * scale - 5);
    ctx.fillStyle = '#8b5cf6';
    ctx.fillText(`y = log_${b}(x)`, cx + 3.2 * scale, cy - (Math.log(3.2) / Math.log(b)) * scale - 12);
    ctx.fillStyle = '#93c5fd';
    ctx.fillText('y = x', cx + 3.5 * scale, cy - 3.5 * scale - 5);

    // Draw symmetrical point pair (1, b) and (b, 1)
    const p1x = cx + 1 * scale;
    const p1y = cy - b * scale;
    const p2x = cx + b * scale;
    const p2y = cy - 1 * scale;

    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(p1x, p1y, 4, 0, 2 * Math.PI); ctx.fill();
    ctx.beginPath(); ctx.arc(p2x, p2y, 4, 0, 2 * Math.PI); ctx.fill();

    ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath(); ctx.moveTo(p1x, p1y); ctx.lineTo(p2x, p2y); ctx.stroke();
    ctx.setLineDash([]);
  }

  // ─── M2: 3.3 Trig-Circle Simulator ───
  drawTrigCircleM2() {
    const canvas = this.trigCircleCanvasRef?.nativeElement;
    if (!canvas) return;
    const { ctx, w, h } = this.setupHighDpiCanvas(canvas, this.simExpanded ? 740 : 340, this.simExpanded ? 360 : 180);
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const R = this.simExpanded ? 110 : 56;

    // Axes
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(10, cy); ctx.lineTo(w - 10, cy);
    ctx.moveTo(cx, 10); ctx.lineTo(cx, h - 10);
    ctx.stroke();

    // Circle
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 2 * Math.PI); ctx.stroke();

    const rad = this.simM2TrigAngle * Math.PI / 180;
    const px = cx + R * Math.cos(rad);
    const py = cy - R * Math.sin(rad);

    // Radio vector
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke();

    // Coseno segment (X axis - blue)
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, cy); ctx.stroke();

    // Seno segment (Vertical - red)
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(px, cy); ctx.lineTo(px, py); ctx.stroke();

    // Tangente segment (Green)
    if (this.simM2TrigAngle !== 90 && this.simM2TrigAngle !== 270) {
      const tanVal = Math.tan(rad);
      const tx = cx + R;
      const ty = cy - R * tanVal;
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(tx, cy); ctx.lineTo(tx, ty); ctx.stroke();

      // Draw continuation line from origin to tangent
      ctx.strokeStyle = 'rgba(31, 41, 55, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(tx, ty); ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  getTrigCircleTan(): string {
    const angle = this.simM2TrigAngle;
    if (angle === 90 || angle === 270) return 'Indefinido';
    const rad = angle * Math.PI / 180;
    return Math.tan(rad).toFixed(2);
  }

  // ─── M2: 3.4 Sphere Volume Simulator ───
  drawSphereM2() {
    const canvas = this.sphereCanvasRef?.nativeElement;
    if (!canvas) return;
    const { ctx, w, h } = this.setupHighDpiCanvas(canvas, this.simExpanded ? 740 : 340, this.simExpanded ? 360 : 180);
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const baseR = this.simExpanded ? 24 : 12;
    const r = this.simM2SphereR * baseR;

    // 3D Spherical Shading (Radial Gradient)
    const grad = ctx.createRadialGradient(cx - r/3, cy - r/3, r/10, cx, cy, r);
    grad.addColorStop(0, '#f9fafb');
    grad.addColorStop(0.3, '#d1d5db');
    grad.addColorStop(1, '#4b5563');

    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2 * Math.PI); ctx.fill();

    // Equator ellipse outline (horizontal)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(cx, cy, r, r * 0.3, 0, 0, 2 * Math.PI);
    ctx.stroke();

    // Meridian ellipse outline (vertical)
    ctx.beginPath();
    ctx.ellipse(cx, cy, r * 0.3, r, 0, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw radius vector from center to edge (diagonal)
    const radX = cx + r * Math.cos(-Math.PI / 6);
    const radY = cy - r * Math.sin(-Math.PI / 6);

    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(radX, radY); ctx.stroke();

    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(cx, cy, 4, 0, 2 * Math.PI); ctx.fill();
    ctx.arc(radX, radY, 4, 0, 2 * Math.PI); ctx.fill();

    // Label 'r'
    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('r', (cx + radX)/2, (cy + radY)/2 - 5);
  }

  // ─── M2: 4.2 Combinatorics Simulator ───
  drawCombinatoricsM2() {
    const canvas = this.combinatoricsCanvasRef?.nativeElement;
    if (!canvas) return;
    const { ctx, w, h } = this.setupHighDpiCanvas(canvas, this.simExpanded ? 740 : 340, this.simExpanded ? 360 : 180);
    ctx.clearRect(0, 0, w, h);

    const n = this.simM2CombN;
    const r = this.simM2CombR;

    const elements = ['A', 'B', 'C', 'D', 'E'].slice(0, n);
    const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

    // Draw N source element circles
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const spacing = w * 0.12;
    const startX = w / 2 - (n - 1) * spacing / 2;
    const startY = h * 0.25;

    for (let i = 0; i < n; i++) {
      ctx.fillStyle = colors[i];
      ctx.beginPath(); ctx.arc(startX + i * spacing, startY, 15, 0, 2 * Math.PI); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillText(elements[i], startX + i * spacing, startY);
    }

    // Write details of combinations on canvas
    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(`Elementos: {${elements.join(', ')}}`, w / 2, h * 0.6);

    ctx.fillStyle = '#93c5fd';
    ctx.font = '11px sans-serif';
    if (this.simM2CombMode === 'permutation') {
      ctx.fillText(`Permutaciones de ${n} elementos (Se ordenan todos):`, w / 2, h * 0.75);
    } else if (this.simM2CombMode === 'combination') {
      ctx.fillText(`Combinaciones posibles agrupando de a ${r} (Sin orden):`, w / 2, h * 0.75);
    } else {
      ctx.fillText(`Variaciones posibles agrupando de a ${r} (Con orden):`, w / 2, h * 0.75);
    }
  }

  setCombM2N(event: any) {
    this.simM2CombN = +event.target.value;
    if (this.simM2CombR > this.simM2CombN) {
      this.simM2CombR = this.simM2CombN;
    }
    this.drawCombinatoricsM2();
  }

  getCombinatoricsFormula(): string {
    const n = this.simM2CombN;
    const r = this.simM2CombR;
    if (this.simM2CombMode === 'permutation') {
      return `P(${n}) = ${n}!`;
    } else if (this.simM2CombMode === 'combination') {
      return `C(${n}, ${r}) = ${n}! / (${r}! · (${n} - ${r})!)`;
    } else {
      return `V(${n}, ${r}) = ${n}! / (${n} - ${r})!`;
    }
  }

  getCombinatoricsValue(): number {
    const fact = (num: number): number => num <= 1 ? 1 : num * fact(num - 1);
    const n = this.simM2CombN;
    const r = this.simM2CombR;
    if (this.simM2CombMode === 'permutation') {
      return fact(n);
    } else if (this.simM2CombMode === 'combination') {
      return fact(n) / (fact(r) * fact(n - r));
    } else {
      return fact(n) / fact(n - r);
    }
  }

  // ─── M2: 4.3 Binomial Distribution Simulator ───
  drawBinomialM2() {
    const canvas = this.binomialCanvasRef?.nativeElement;
    if (!canvas) return;
    const { ctx, w, h } = this.setupHighDpiCanvas(canvas, this.simExpanded ? 740 : 340, this.simExpanded ? 360 : 180);
    ctx.clearRect(0, 0, w, h);

    const n = this.simM2BinN;
    const p = this.simM2BinP;

    const fact = (num: number): number => num <= 1 ? 1 : num * fact(num - 1);
    const comb = (nVal: number, kVal: number): number => fact(nVal) / (fact(kVal) * fact(nVal - kVal));

    // Probabilities array
    const probs: number[] = [];
    for (let k = 0; k <= n; k++) {
      const probability = comb(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
      probs.push(probability);
    }

    const maxProb = Math.max(...probs, 0.05);

    const paddingLeft = w * 0.1;
    const plotW = w * 0.8;
    const plotH = h * 0.65;
    const startY = h * 0.8;

    const barW = plotW / (n + 1);

    // Draw grid & bars
    ctx.fillStyle = '#3b82f6';
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 1;

    ctx.fillStyle = '#93c5fd';
    ctx.font = '8px monospace';
    ctx.textAlign = 'center';

    for (let k = 0; k <= n; k++) {
      const hBar = (probs[k] / maxProb) * plotH;
      const x = paddingLeft + k * barW + 2;
      const y = startY - hBar;

      ctx.fillStyle = 'rgba(59, 130, 246, 0.6)';
      ctx.fillRect(x, y, barW - 4, hBar);
      ctx.strokeStyle = '#2563eb';
      ctx.strokeRect(x, y, barW - 4, hBar);

      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(k.toString(), x + (barW - 4)/2, startY + 12);
    }

    // Curve overlay
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let k = 0; k <= n; k++) {
      const hBar = (probs[k] / maxProb) * plotH;
      const x = paddingLeft + k * barW + (barW - 4)/2 + 2;
      const y = startY - hBar;
      if (k === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }


  constructor() {
    let id = this.route.snapshot.paramMap.get('materiaId') || this.route.snapshot.data['materiaId'];
    if (!id) {
      const url = this.router.url;
      if (url.includes('/mat1')) id = 'mat1';
      else if (url.includes('/mat2')) id = 'mat2';
    }
    this.materiaId.set(id || '');
  }

  getOffset(index: number): number {
    return this.offsets[index % this.offsets.length];
  }

  getAccordionZigzag(rowIndex: number): number {
    const arr = [0, -40, -70, -40, 0, 40, 70, 40];
    return arr[rowIndex % arr.length];
  }



  getNodeTransform(item: any, nodeIndex: number): string {
    if (item.nodes!.length === 1) {
      if (this.hasTreeLayout()) {
        return 'none';
      } else {
        return `translateX(${this.getOffset(item.nodes[0].nodeIndex)}px)`;
      }
    }
    if (item.nodes!.length === 2) {
      return `none`;
    }
    const zig = this.getAccordionZigzag(item.rowIndex!);
    if (false) {
      if (nodeIndex === 0) return `translateX(${zig}px)`;
      if (nodeIndex === 1) return `none`;
      if (nodeIndex === 2) return `translateX(${-zig}px)`;
    }
    return 'none';
  }

  getOffsetsForNodes(item: any): number[] {
    if (!item.nodes) return [0];
    if (item.nodes!.length === 1) {
      if (this.hasTreeLayout()) {
        return [0];
      } else {
        return [this.getOffset(item.nodes[0].nodeIndex)];
      }
    }
    if (item.nodes!.length === 2) return [-140, 140];
    // For 3 nodes: left zigzags, center is 0, right zigzags opposite
    if (item.nodes!.length === 3) return [-180, 0, 180];
    return [0];
  }

  getWrapperOffset(item: any): number {
    if (item.type !== 'node-row') return 0;
    return 0;
  }

  isLastPathItem(item: any): boolean {
    const items = this.pathItems();
    const index = items.indexOf(item);
    return index === items.length - 1;
  }

  isNextChapter(index: number): boolean {
    const items = this.pathItems();
    const next = items[index + 1];
    return next ? next.type === 'chapter' : false;
  }

  getUpwardChapterConnection(index: number): string {
    const items = this.pathItems();
    const item = items[index];
    const x1 = this.getOffsetsForNodes(item)[0];
    return `M ${x1} 150 C ${x1} 98, 0 52, 0 0`;
  }

  getUpwardChapterColor(index: number): string {
    const items = this.pathItems();
    const chapterItem = items[index - 1];
    if (chapterItem && chapterItem.type === 'chapter') {
      return this.isGuideCompleted(chapterItem.capituloId) ? this.getMateriaThemeColor() : '#e5e5e5';
    }
    return '#e5e5e5';
  }

  getMateriaThemeColor(): string {
    return this.materiaId() === 'mat2' ? '#0ea5e9' : '#1e3a8a';
  }

  getChapterConnections(index: number): { d: string, color: string, dasharray?: string }[] {
    const items = this.pathItems();
    const item = items[index];
    if (item.type !== 'chapter') return [];

    const nextItem = items[index + 1];
    if (!nextItem || nextItem.type !== 'node-row') return [];

    const endOffsets = this.getOffsetsForNodes(nextItem);

    const height = 148;
    const isCompleted = this.isGuideCompleted(item.capituloId);
    const themeColor = this.getMateriaThemeColor();

    return endOffsets.map(x2 => {
      const d = `M 0 0 C 0 ${height * 0.35}, ${x2} ${height * 0.65}, ${x2} ${height}`;
      return { d, color: isCompleted ? themeColor : '#e5e5e5', dasharray: isCompleted ? 'none' : '8 8' };
    });
  }

  getConnections(index: number): { d: string, color: string, dasharray?: string }[] {
    const items = this.pathItems();
    const item = items[index];
    if (item.type !== 'node-row') return [];

    const height = this.hasTreeLayout() ? 192 : 176;

    const nextItem = items[index + 1];
    if (!nextItem) return [];

    const startOffsets = this.getOffsetsForNodes(item);
    const endOffsets = this.getOffsetsForNodes(nextItem);

    const connections: { d: string, color: string, dasharray?: string }[] = [];

    const themeColor = this.getMateriaThemeColor();
    const getColor = (sourceOffset: number) => {
      const node = item.nodes!.find((n: any, idx: number) => {
        if (item.nodes!.length === 1) return true;
        if (item.nodes!.length === 2) return (idx === 0 && sourceOffset < 0) || (idx === 1 && sourceOffset > 0);
        if (item.nodes!.length === 3) return (idx === 0 && sourceOffset < -100) || (idx === 1 && sourceOffset === 0) || (idx === 2 && sourceOffset > 100);
        return false;
      });
      return node?.status === 'completed' ? themeColor : '#e5e5e5';
    };

    const getDash = (sourceOffset: number) => {
      return getColor(sourceOffset) === themeColor ? 'none' : '8 8';
    };

    if (nextItem.type === 'chapter') {
      startOffsets.forEach(x1 => {
        const d = `M ${x1} 0 C ${x1} ${156 * 0.35}, 0 ${156 * 0.65}, 0 156`;
        connections.push({ d, color: getColor(x1), dasharray: getDash(x1) });
      });
      return connections;
    }



    const pushConn = (x1: number, x2: number) => {
      const d = `M ${x1} 0 C ${x1} ${height * 0.35}, ${x2} ${height * 0.65}, ${x2} ${height}`;
      connections.push({ d, color: getColor(x1), dasharray: getDash(x1) });
    };

    if (startOffsets.length === endOffsets.length) {
      // 1 to 1, 2 to 2, 3 to 3 (straight connections)
      for (let i = 0; i < startOffsets.length; i++) {
        pushConn(startOffsets[i], endOffsets[i]);
      }
    } else if (startOffsets.length === 1) {
      // 1 to 2, or 1 to 3
      endOffsets.forEach(eOff => pushConn(startOffsets[0], eOff));
    } else if (endOffsets.length === 1) {
      // 2 to 1, or 3 to 1
      startOffsets.forEach(sOff => pushConn(sOff, endOffsets[0]));
    } else if (startOffsets.length === 2 && endOffsets.length === 3) {
      pushConn(startOffsets[0], endOffsets[0]); // Left to Left
      pushConn(startOffsets[1], endOffsets[2]); // Right to Right
      // Where does the center come from? Maybe both?
      pushConn(startOffsets[0], endOffsets[1]);
      pushConn(startOffsets[1], endOffsets[1]);
    } else if (startOffsets.length === 3 && endOffsets.length === 2) {
      pushConn(startOffsets[0], endOffsets[0]);
      pushConn(startOffsets[2], endOffsets[1]);
      // Center connects to both
      pushConn(startOffsets[1], endOffsets[0]);
      pushConn(startOffsets[1], endOffsets[1]);
    }

    return connections;
  }

  pathItems = computed(() => {
    const items: PathItem[] = [];

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
    let rowIndex = 0;

    this.capitulos().forEach((cap, capIndex) => {
      let nodeIndex = 0;
      const unlockAll = localStorage.getItem('unlockAllSteps') === 'true';
      const chapterIsLocked = !unlockAll && foundActive;

      // 1. Add Chapter Divider
      items.push({
        type: 'chapter',
        capituloId: cap.id,
        title: cap.title,
        subtitle: `Capítulo ${capIndex + 1}`,
        imageUrl: cap.imageUrl,
        isCurrentChapter: cap.id === activeChapterId,
        isLocked: chapterIsLocked
      });

      const guideProg = this.paes.getSeccionProgress('guide_' + cap.id);
      const isGuideCompleted = guideProg?.completed || false;
      const blockChapter = unlockAll ? false : !isGuideCompleted;

      // 2. Group Sections by Level to support branching
      const rows: any[][] = [];
      let currentLevel = -1;
      let autoLevel = 1000;
      let currentGroup: any[] = [];

      const sortedSecciones = this.hasTreeLayout()
        ? [...cap.secciones].sort((a, b) => {
            const lA = a.level !== undefined ? a.level : 1000;
            const lB = b.level !== undefined ? b.level : 1000;
            if (lA !== lB) return lA - lB;

            // If same level, sort by subcapitulo to maintain consistent columns
            const subA = (a as any).tags?.find((t: string) => t.startsWith('subcapitulo:')) || '';
            const subB = (b as any).tags?.find((t: string) => t.startsWith('subcapitulo:')) || '';
            return subA.localeCompare(subB);
          })
        : [...cap.secciones].sort((a, b) => (a.order || 0) - (b.order || 0));

      sortedSecciones.forEach((sec) => {
        const lvl = sec.level !== undefined ? sec.level : (autoLevel++);
        if (currentLevel === -1 || currentLevel !== lvl) {
          if (currentGroup.length > 0) rows.push(currentGroup);
          currentLevel = lvl;
          currentGroup = [sec];
        } else {
          currentGroup.push(sec);
        }
      });
      if (currentGroup.length > 0) rows.push(currentGroup);

      // 3. Render rows
      const lastSectionId = cap.secciones.length > 0 ? cap.secciones[cap.secciones.length - 1].id : null;

      rows.forEach(group => {
        let allCompletedInRow = true;

        const rowNodes: NodeItem[] = group.map((sec) => {
          const prog = this.paes.getSeccionProgress(sec.id);
          const completed = prog?.completed || false;
          if (!completed) allCompletedInRow = false;

          let status: 'completed' | 'active' | 'locked' = 'locked';

          if (completed) {
            status = 'completed';
          } else if (unlockAll) {
            status = 'active';
          } else if (!foundActive && !blockChapter) {
            status = 'active';
          } else if (!foundActive && blockChapter) {
            status = 'locked';
          } else {
            status = 'locked';
          }

          return {
            id: sec.id,
            capituloId: cap.id,
            title: sec.title,
            status,
            nodeIndex: nodeIndex++,
            tags: sec.tags,
            isBoss: this.materiaId() === 'mat2' ? false : sec.id === lastSectionId,
            isCrown: (sec as any).isCrown || false
          } as any;
        });

        if (!allCompletedInRow && !unlockAll && !blockChapter && !foundActive) {
          foundActive = true;
        } else if (blockChapter && !foundActive) {
          foundActive = true;
        }

        items.push({
          type: 'node-row',
          nodes: rowNodes,
          rowIndex: rowIndex++,
          capituloId: cap.id
        });
      });
    });

    // Second pass: determine centering for single nodes adjacent to branches, and branch start
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type === 'node-row') {
        const prevRow = items.slice(0, i).reverse().find(x => x.type === 'node-row');

        if (item.nodes && item.nodes.length === 1) {
          const nextRow = items.slice(i + 1).find(x => x.type === 'node-row');
          if ((prevRow && prevRow.nodes && prevRow.nodes.length > 1) ||
            (nextRow && nextRow.nodes && nextRow.nodes.length > 1)) {
            item.isCentered = true;
          } else {
            item.isCentered = false;
          }
        }

        if (item.nodes && item.nodes.length > 1) {
          if (!prevRow || (prevRow && prevRow.nodes && prevRow.nodes.length === 1)) {
            item.isBranchStart = true;
          } else {
            item.isBranchStart = false;
          }
        }
      }
    }

    return items;
  });

  handleNodeClick(item: any) {
    const unlockAll = localStorage.getItem('unlockAllSteps') === 'true';
    if (item.status === 'locked' && !this.adminService.isAdmin() && !unlockAll) return;
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

  getChapterWeight(capId: string): string | undefined {
    const cap = this.capitulos().find(c => c.id === capId);
    return cap?.paesWeight;
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

  isEntirePathCompleted(): boolean {
    if (this.isUnlockedAll()) return true;
    const caps = this.capitulos();
    if (!caps || caps.length === 0) return false;
    return caps.every(cap => {
      const guideDone = this.isGuideCompleted(cap.id);
      const secsDone = (cap.secciones || []).every(sec => !!this.paes.getSeccionProgress(sec.id)?.completed);
      return guideDone && secsDone;
    });
  }

  confirmLogout() {
    this.showLogoutConfirm = true;
  }

  async executeLogout() {
    this.showLogoutConfirm = false;
    await this.auth.logout().toPromise();
    this.router.navigate(['/']);
  }

  isUnlockedAll(): boolean {
    return localStorage.getItem('unlockAllSteps') === 'true';
  }

  toggleUnlockAllSteps() {
    const current = this.isUnlockedAll();
    localStorage.setItem('unlockAllSteps', String(!current));
    window.location.reload();
  }

  forceRefresh() {
    Object.keys(localStorage).forEach(key => {
      if (key.includes('paes_content_cache')) {
        localStorage.removeItem(key);
      }
    });
    window.location.reload();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.altKey && event.key.toLowerCase() === 'u') {
      this.toggleUnlockAllSteps();
    }
    if (event.altKey && event.key.toLowerCase() === 'c') {
      console.log('AUTO-COMPLETING ALL FOR TESTING...');
      this.completeAllMateria();
    }
    if (event.altKey && event.key.toLowerCase() === 'x') {
      console.log('RESETTING ALL PROGRESS FOR TESTING...');
      this.resetAllMateria();
    }
  }

  completeAllMateria() {
    this.capitulos().forEach(cap => {
      this.paes.markSeccionCompleted('guide_' + cap.id);
      if (cap.secciones) {
        cap.secciones.forEach(sec => {
          this.paes.markSeccionCompleted(sec.id);
        });
      }
    });
    console.log('Everything marked as complete!');
    window.location.reload();
  }

  resetAllMateria() {
    this.capitulos().forEach(cap => {
      this.paes.markSeccionIncomplete('guide_' + cap.id);
      if (cap.secciones) {
        cap.secciones.forEach(sec => {
          this.paes.markSeccionIncomplete(sec.id);
        });
      }
    });
    localStorage.setItem('unlockAllSteps', 'false');
    console.log('Progress reset and steps locked!');
    window.location.reload();
  }

}
