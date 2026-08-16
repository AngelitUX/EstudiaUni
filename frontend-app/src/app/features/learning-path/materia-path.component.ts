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

type NodeItem = { id: string, capituloId: string, title: string, status: 'completed' | 'active' | 'locked', nodeIndex: number, tags?: string[], isBoss?: boolean, isProTip?: boolean, isPractice?: boolean };

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
  selector: 'app-materia-path',
  standalone: true,
  imports: [CommonModule, RouterModule, SettingsModalComponent, ProfileModalComponent],
  template: `
    <div class="lp-layout">
      <!-- SIDEBAR -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <a routerLink="/dashboard" class="sidebar-logo" style="text-decoration:none; display: flex; align-items: center; justify-content: center;">
            <img [src]="(isProPlan() || adminService.isAdmin()) ? 'https://res.cloudinary.com/dqm3syhwr/image/upload/f_auto,q_auto/v1/imagenes/branding/LogoEstudiaUniPREMIUM' : 'https://res.cloudinary.com/dqm3syhwr/image/upload/f_auto,q_auto/v1/imagenes/branding/LogoEstudiaUni'" alt="EstudiaUni" class="sidebar-logo-img" />
          </a>
        </div>
        <nav class="sidebar-nav">
          <a class="nav-item" routerLink="/dashboard"><img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_Inicio.svg" alt="Inicio" class="nav-icon-img"/><span class="nav-text">Inicio</span></a>
          <a class="nav-item active" routerLink="/ruta"><img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_RutaDeAprendizaje.svg" alt="Ruta de Aprendizaje" class="nav-icon-img"/><span class="nav-text">Ruta de Aprendizaje</span></a>
          <a class="nav-item" routerLink="/ensayos"><img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_EnsayosPaes.svg" alt="Ensayos PAES" class="nav-icon-img"/><span class="nav-text">Ensayos PAES</span></a>
          <a class="nav-item" routerLink="/mini-ensayo"><img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_MiniEnsayos.svg" alt="Mini Ensayos" class="nav-icon-img"/><span class="nav-text">Mini Ensayos</span></a>
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
        <button class="mobile-menu-btn" (click)="mobileOpen = !mobileOpen">☰</button>
        <a routerLink="/dashboard" style="text-decoration:none; display: flex; align-items: center;">
          <img [src]="(isProPlan() || adminService.isAdmin()) ? 'https://res.cloudinary.com/dqm3syhwr/image/upload/f_auto,q_auto/v1/imagenes/branding/LogoEstudiaUniPREMIUM' : 'https://res.cloudinary.com/dqm3syhwr/image/upload/f_auto,q_auto/v1/imagenes/branding/LogoEstudiaUni'" alt="EstudiaUni" class="mobile-logo-img" />
        </a>
      </div>
      <div class="mobile-overlay" [class.open]="mobileOpen" (click)="mobileOpen = false">
        <div class="mobile-menu" (click)="$event.stopPropagation()">
          <nav class="sidebar-nav">
            <a class="nav-item" routerLink="/dashboard" (click)="mobileOpen=false"><img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_Inicio.svg" alt="Inicio" class="nav-icon-img"/><span class="nav-text">Inicio</span></a>
            <a class="nav-item active" routerLink="/ruta" (click)="mobileOpen=false"><img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_RutaDeAprendizaje.svg" alt="Ruta de Aprendizaje" class="nav-icon-img"/><span class="nav-text">Ruta de Aprendizaje</span></a>
            <a class="nav-item" routerLink="/ensayos" (click)="mobileOpen=false"><img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_EnsayosPaes.svg" alt="Ensayos PAES" class="nav-icon-img"/><span class="nav-text">Ensayos PAES</span></a>
            <a class="nav-item" routerLink="/mini-ensayo" (click)="mobileOpen=false"><img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_MiniEnsayos.svg" alt="Mini Ensayos" class="nav-icon-img"/><span class="nav-text">Mini Ensayos</span></a>
            <a class="nav-item" routerLink="/mente-veloz" (click)="mobileOpen=false"><img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_MenteVeloz.svg" alt="Mente Veloz" class="nav-icon-img"/><span class="nav-text">Mente Veloz</span></a>
            
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
          <!-- READING COMPREHENSION BACKGROUND DECORATIONS -->
          <div class="physics-bg-decorations">
            <span class="bg-deco-orbit"></span>
            <span class="bg-deco-orbit-alt"></span>
            <span class="bg-deco" style="top: 4%; left: 4%; font-size: 2.4rem; transform: rotate(-12deg);">¶</span>
            <span class="bg-deco" style="top: 16%; right: 5%; font-size: 2.1rem; transform: rotate(10deg);">Sinónimo</span>
            <span class="bg-deco" style="top: 30%; left: 3%; font-size: 2.6rem; transform: rotate(8deg);">"</span>
            <span class="bg-deco" style="top: 42%; right: 4%; font-size: 2.2rem; transform: rotate(-8deg);">Metáfora</span>
            <span class="bg-deco" style="top: 54%; left: 4%; font-size: 2.2rem; transform: rotate(-10deg);">Inferencia</span>
            <span class="bg-deco" style="top: 65%; right: 3%; font-size: 2rem; transform: rotate(12deg);">§</span>
            <span class="bg-deco" style="top: 76%; left: 5%; font-size: 2.1rem; transform: rotate(6deg);">Idea Principal</span>
            <span class="bg-deco" style="top: 88%; right: 5%; font-size: 2.1rem; transform: rotate(-14deg);">Contexto</span>
            <span class="bg-deco" style="top: 6%; right: 22%; font-size: 1.9rem; transform: rotate(-6deg);">¿?</span>
            <span class="bg-deco" style="top: 94%; left: 20%; font-size: 1.9rem; transform: rotate(9deg);">Tesis</span>
            <span class="bg-deco" style="top: 22%; left: 16%; font-size: 1.8rem; transform: rotate(14deg);">¡!</span>
            <span class="bg-deco" style="top: 92%; right: 25%; font-size: 1.8rem; transform: rotate(7deg);">Prosa</span>
          </div>
          <div class="materia-page">
          <!-- DUOLINGO PATH -->
          <div class="duo-path-container">
            <ng-container *ngFor="let item of pathItems(); let i = index">
              <!-- CHAPTER SPLASH BANNER -->
              <div *ngIf="item.type === 'chapter'" style="position: relative; width: 100%; display: flex; flex-direction: column; align-items: center;">
                <div class="chapter-splash" [ngClass]="[item.capituloId, getChapterProgress(item.capituloId).pct === 100 ? 'chapter-completed' : '']" style="margin-bottom: 7rem; width: 100%;">
                  <div class="splash-bg-pattern"></div>
                  <div class="splash-inner">
                  <div class="splash-hero">
                    <div class="splash-mascot-area">
                      <img src="assets/images/Nuevos VideosEIlustraciones/GifsFocoWEBP/focoComprensionLectora.webp" alt="Foco" class="splash-mascot chapter-image-custom" width="290" height="290" loading="lazy" decoding="async" />
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
                  <span class="sep-text">Tu ruta comienza aquí ↓</span>
                  <div class="sep-line"></div>
                </div>
              </div>
              
              <!-- CONEXION DE CAPITULO A NODO -->
              <svg class="path-svg" *ngIf="item.type === 'chapter' && !isLastPathItem(item)" style="height: 148px; top: calc(100% - 7rem); z-index: -1;">
                <path *ngFor="let conn of getChapterConnections(i)"
                      [attr.d]="conn.d"
                      [attr.stroke]="conn.color"
                      [attr.stroke-dasharray]="conn.dasharray"
                      fill="none" stroke-width="8" stroke-linecap="round" />
              </svg>
            </div>

            <!-- SECTION NODE ROW -->
            <div *ngIf="item.type === 'node-row'" class="node-row" 
                 [style.margin-bottom]="hasTreeLayout() ? '7.5rem' : '6.5rem'">
              
              <!-- SVG CAMINITO CONECTOR -->
              <svg class="path-svg" *ngIf="!isLastPathItem(item)" 
                   [style.height]="isNextChapter(i) ? '156px' : (hasTreeLayout() ? 'calc(72px + 7.5rem)' : 'calc(72px + 6.5rem)')">
                <path *ngFor="let conn of getConnections(i)"
                      [attr.d]="conn.d"
                      [attr.stroke]="conn.color"
                      [attr.stroke-dasharray]="conn.dasharray"
                      fill="none" stroke-width="8" stroke-linecap="round" />
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
                          <ng-container *ngIf="node.isBoss">
                            <svg class="node-icon icon-boss" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C7.03 2 3 6.03 3 11V14.5C3 15.33 3.67 16 4.5 16H6V20C6 21.1 6.9 22 8 22H16C17.1 22 18 21.1 18 20V16H19.5C20.33 16 21 15.33 21 14.5V11C21 6.03 16.97 2 12 2ZM8 10C6.9 10 6 9.1 6 8C6 6.9 6.9 6 8 6C9.1 6 10 6.9 10 8C10 9.1 9.1 10 8 10ZM16 10C14.9 10 14 9.1 14 8C14 6.9 14.9 6 16 6C17.1 6 18 6.9 18 8C18 9.1 17.1 10 16 10ZM15 19H9V16H15V19Z" />
                            </svg>
                          </ng-container>
                          <ng-container *ngIf="!node.isBoss && !node.isProTip && isPracticeNode(node)">
                            <svg class="node-icon icon-practice" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M20 9V7c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2v2H10V7c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v2H2v6h2v2c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-2h4v2c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-2h2v-6h-2z"/>
                            </svg>
                          </ng-container>
                          <ng-container *ngIf="!node.isBoss && node.isProTip">
                            <svg class="node-icon icon-pro-tip" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z"/>
                            </svg>
                          </ng-container>
                          <ng-container *ngIf="!node.isBoss && !node.isProTip && !isPracticeNode(node)">
                            <svg class="node-icon icon-star" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                          </ng-container>
                        </div>
                      </button>
                      <div class="node-title" 
                        [class.text-completed]="node.status === 'completed'"
                        [class.text-active]="node.status === 'active'"
                        [class.historia-title]="hasTreeLayout()"
                        [class.title-boss]="node.isBoss"
                        [class.title-practice]="!node.isBoss && !node.isProTip && isPracticeNode(node)"
                        [class.title-pro-tip]="node.isProTip"
                        [style.bottom]="(hasTreeLayout() && node.title.length > 25) ? '-60px' : (node.status === 'active' ? '-36px' : '-32px')">
                        {{ node.title }}
                      </div>
                    </div>
                  </ng-container>
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
    <!-- PHYSICS SIMULATOR PANEL (only for ciencias-fisica) -->
    <ng-container *ngIf="isPhysicsRoute()">
      <!-- Tab trigger button -->
      <button class="sim-tab-trigger" (click)="toggleSimPanel()" [class.panel-open]="simPanelOpen" [class.expanded]="simExpanded">
        <span class="sim-tab-icon">⚗️</span>
        <span class="sim-tab-label">Simulador</span>
        <span class="sim-tab-arrow">{{ simPanelOpen ? '▶' : '◀' }}</span>
      </button>

      <!-- Simulator Drawer -->
      <div class="sim-drawer" [class.open]="simPanelOpen" [class.expanded]="simExpanded">
        <div class="sim-drawer-inner">
          <div class="sim-header">
            <div class="sim-header-left">
              <span class="sim-header-icon">⚗️</span>
              <div>
                <h3 class="sim-title">Simuladores de Física</h3>
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
            <select class="sim-chapter-select" (change)="setSimChapter($event)">
              <option value="0" [selected]="selectedSimChapterIndex === 0">1 — Mecánica</option>
              <option value="1" [selected]="selectedSimChapterIndex === 1">2 — Ondas</option>
              <option value="2" [selected]="selectedSimChapterIndex === 2">3 — Energía</option>
              <option value="3" [selected]="selectedSimChapterIndex === 3">4 — Electricidad</option>
              <option value="4" [selected]="selectedSimChapterIndex === 4">5 — Tierra y Universo</option>
            </select>
            
            <!-- CAP 1: Mecánica -->
            <div class="sim-tabs" *ngIf="selectedSimChapterIndex === 0">
              <button class="sim-tab" [class.active]="activeSimTab === 'projectile'" (click)="setSimTab('projectile')">🎯 Proyectil</button>
              <button class="sim-tab" [class.active]="activeSimTab === 'inclined'" (click)="setSimTab('inclined')">📐 Plano Inclinado</button>
            </div>
            <!-- CAP 2: Ondas -->
            <div class="sim-tabs" *ngIf="selectedSimChapterIndex === 1">
              <button class="sim-tab" [class.active]="activeSimTab === 'waves'" (click)="setSimTab('waves')">〜 Onda Sinusoidal</button>
              <button class="sim-tab" [class.active]="activeSimTab === 'interference'" (click)="setSimTab('interference')">🔀 Interferencia</button>
              <button class="sim-tab" [class.active]="activeSimTab === 'optics'" (click)="setSimTab('optics')">🔍 Óptica y Lentes</button>
            </div>
            <!-- CAP 3: Energía -->
            <div class="sim-tabs" *ngIf="selectedSimChapterIndex === 2">
              <button class="sim-tab" [class.active]="activeSimTab === 'pendulum'" (click)="setSimTab('pendulum')">🕰️ Péndulo</button>
              <button class="sim-tab" [class.active]="activeSimTab === 'calorimetry'" (click)="setSimTab('calorimetry')">🌡️ Calorimetría</button>
            </div>
            <!-- CAP 4: Electricidad -->
            <div class="sim-tabs" *ngIf="selectedSimChapterIndex === 3">
              <button class="sim-tab" [class.active]="activeSimTab === 'coulomb'" (click)="setSimTab('coulomb')">⚡ Ley de Coulomb</button>
              <button class="sim-tab" [class.active]="activeSimTab === 'circuit'" (click)="setSimTab('circuit')">🔋 Circuito Ohm</button>
              <button class="sim-tab" [class.active]="activeSimTab === 'faraday'" (click)="setSimTab('faraday')">🧲 Ley de Faraday</button>
            </div>
            <!-- CAP 5: Tierra y Universo -->
            <div class="sim-tabs" *ngIf="selectedSimChapterIndex === 4">
              <button class="sim-tab" [class.active]="activeSimTab === 'orbit'" (click)="setSimTab('orbit')">🪐 Órbita Planetaria</button>
            </div>
          </div>

          <!-- ═══ PROJECTILE SIMULATOR ═══ -->
          <div class="sim-content" *ngIf="activeSimTab === 'projectile'">
            <div class="sim-info-badge">🎯 Movimiento parabólico — velocidad inicial, ángulo y gravedad</div>
            <canvas #projectileCanvas class="sim-canvas"></canvas>
            <div class="sim-controls">
              <div class="sim-control-row">
                <label>Velocidad: <strong>{{ projVelocity }} m/s</strong></label>
                <input type="range" min="10" max="50" [value]="projVelocity" (input)="projVelocity = +$any($event.target).value">
              </div>
              <div class="sim-control-row">
                <label>Ángulo: <strong>{{ projAngle }}°</strong></label>
                <input type="range" min="5" max="85" [value]="projAngle" (input)="projAngle = +$any($event.target).value">
              </div>
              <div class="sim-control-row">
                <button class="sim-btn" style="flex: 1" (click)="launchProjectile()">🚀 Lanzar</button>
              </div>
            </div>
            <div class="sim-stats" *ngIf="projMaxHeight > 0">
              <div class="proj-stat" (mouseenter)="hoveredFormula = 'y_max = (v₀·sin(θ))² / 2g'" (mouseleave)="hoveredFormula = ''"><span>Altura máx.</span><strong>{{ projMaxHeight | number:'1.1-1' }} m</strong></div>
              <div class="proj-stat" (mouseenter)="hoveredFormula = 'x_max = (v₀²·sin(2θ)) / g'" (mouseleave)="hoveredFormula = ''"><span>Alcance</span><strong>{{ projRange | number:'1.1-1' }} m</strong></div>
              <div class="proj-stat" (mouseenter)="hoveredFormula = 't_total = 2·v₀·sin(θ) / g'" (mouseleave)="hoveredFormula = ''"><span>Tiempo</span><strong>{{ projTime | number:'1.1-1' }} s</strong></div>
            </div>
            <div class="sim-formulas-container">
              <div class="sim-formula"><span class="formula-label">Pos. Y</span><span class="formula-text">y = v₀·sin(θ)t − ½gt²</span></div>
              <div class="sim-formula"><span class="formula-label">Pos. X</span><span class="formula-text">x = v₀·cos(θ)t</span></div>
            </div>
          </div>

          <!-- ═══ INCLINED PLANE SIMULATOR ═══ -->
          <div class="sim-content" *ngIf="activeSimTab === 'inclined'">
            <div class="sim-info-badge">📐 Plano inclinado — fuerzas componentes y aceleración</div>
            <canvas #inclinedCanvas class="sim-canvas"></canvas>
            <div class="sim-controls">
              <div class="sim-control-row">
                <label>Ángulo θ: <strong>{{ inclinedAngle }}°</strong></label>
                <input type="range" min="5" max="75" [value]="inclinedAngle" (input)="inclinedAngle = +$any($event.target).value; drawInclined()">
              </div>
              <div class="sim-control-row">
                <label>Masa: <strong>{{ inclinedMass }} kg</strong></label>
                <input type="range" min="1" max="20" [value]="inclinedMass" (input)="inclinedMass = +$any($event.target).value; drawInclined()">
              </div>
              <div class="sim-control-row">
                <label>μ rozamiento: <strong>{{ inclinedMu }}</strong></label>
                <input type="range" min="0" max="60" [value]="inclinedMu * 100" (input)="inclinedMu = +$any($event.target).value / 100; drawInclined()">
              </div>
            </div>
            <div class="sim-stats">
              <div class="proj-stat" (mouseenter)="hoveredFormula = 'F∥ = m·g·sin(θ)'" (mouseleave)="hoveredFormula = ''"><span>F paralela</span><strong>{{ getInclinedFp() | number:'1.1-1' }} N</strong></div>
              <div class="proj-stat" (mouseenter)="hoveredFormula = 'N = m·g·cos(θ)'" (mouseleave)="hoveredFormula = ''"><span>F normal</span><strong>{{ getInclinedFn() | number:'1.1-1' }} N</strong></div>
              <div class="proj-stat" (mouseenter)="hoveredFormula = 'Fr = μ·N'" (mouseleave)="hoveredFormula = ''"><span>F rozamiento</span><strong>{{ getInclinedFr() | number:'1.1-1' }} N</strong></div>
              <div class="proj-stat" (mouseenter)="hoveredFormula = 'a = (F∥ - Fr) / m'" (mouseleave)="hoveredFormula = ''"><span>Aceleración</span><strong>{{ getInclinedAcc() | number:'1.2-2' }} m/s²</strong></div>
            </div>
            <div class="sim-formulas-container">
              <div class="sim-formula"><span class="formula-label">Paralela</span><span class="formula-text">F∥ = m·g·sin(θ)</span></div>
              <div class="sim-formula"><span class="formula-label">Fricción</span><span class="formula-text">Fr = μ·m·g·cos(θ)</span></div>
            </div>
          </div>

          <!-- ═══ WAVE SIMULATOR ═══ -->
          <div class="sim-content" *ngIf="activeSimTab === 'waves'">
            <div class="sim-info-badge">〜 Onda sinusoidal — amplitud, frecuencia y longitud de onda</div>
            <canvas #waveCanvas class="sim-canvas"></canvas>
            <div class="sim-controls">
              <div class="sim-control-row">
                <label>Amplitud: <strong>{{ waveAmplitude }}</strong></label>
                <input type="range" min="10" max="60" [value]="waveAmplitude" (input)="waveAmplitude = +$any($event.target).value; drawWave()">
              </div>
              <div class="sim-control-row">
                <label>Frecuencia: <strong>{{ waveFrequency }}</strong></label>
                <input type="range" min="1" max="8" [value]="waveFrequency" (input)="waveFrequency = +$any($event.target).value; drawWave()">
              </div>
              <div class="sim-control-row">
                <label>Animación</label>
                <button class="sim-btn" (click)="toggleWaveAnimation()">{{ waveAnimating ? '⏸ Pausar' : '▶ Animar' }}</button>
              </div>
            </div>
            <div class="sim-formulas-container">
              <div class="sim-formula"><span class="formula-label">Velocidad</span><span class="formula-text">v = f · λ</span></div>
              <div class="sim-formula"><span class="formula-label">Período</span><span class="formula-text">T = 1/f</span></div>
            </div>
          </div>

          <!-- ═══ INTERFERENCE SIMULATOR ═══ -->
          <div class="sim-content" *ngIf="activeSimTab === 'interference'">
            <div class="sim-info-badge">🔀 Superposición de ondas — constructiva y destructiva</div>
            <canvas #interferenceCanvas class="sim-canvas"></canvas>
            <div class="sim-controls">
              <div class="sim-control-row">
                <label>Frec. onda 1: <strong>{{ interfFreq1 }}</strong></label>
                <input type="range" min="1" max="6" [value]="interfFreq1" (input)="interfFreq1 = +$any($event.target).value; drawInterference()">
              </div>
              <div class="sim-control-row">
                <label>Frec. onda 2: <strong>{{ interfFreq2 }}</strong></label>
                <input type="range" min="1" max="6" [value]="interfFreq2" (input)="interfFreq2 = +$any($event.target).value; drawInterference()">
              </div>
              <div class="sim-control-row">
                <label>Fase onda 2: <strong>{{ interfPhase }}°</strong></label>
                <input type="range" min="0" max="360" [value]="interfPhase" (input)="interfPhase = +$any($event.target).value; drawInterference()">
              </div>
              <div class="sim-control-row">
                <label>Animación</label>
                <button class="sim-btn" (click)="toggleInterfAnimation()">{{ interfAnimating ? '⏸ Pausar' : '▶ Animar' }}</button>
              </div>
            </div>
            <div class="sim-formulas-container">
              <div class="sim-formula"><span class="formula-label">Superposición</span><span class="formula-text">y = y₁ + y₂</span></div>
              <div class="sim-formula"><span class="formula-label">Constructiva</span><span class="formula-text">Δx = nλ</span></div>
              <div class="sim-formula"><span class="formula-label">Destructiva</span><span class="formula-text">Δx = (n+½)λ</span></div>
            </div>
          </div>

          <!-- ═══ PENDULUM SIMULATOR ═══ -->
          <div class="sim-content" *ngIf="activeSimTab === 'pendulum'">
            <div class="sim-info-badge">🕰️ Péndulo simple — conservación de energía mecánica</div>
            <canvas #pendulumCanvas class="sim-canvas"></canvas>
            <div class="sim-controls">
              <div class="sim-control-row">
                <label>Longitud: <strong>{{ pendulumLength }} m</strong></label>
                <input type="range" min="1" max="10" [value]="pendulumLength" (input)="pendulumLength = +$any($event.target).value; resetPendulum()">
              </div>
              <div class="sim-control-row">
                <label>Ángulo inicial: <strong>{{ pendulumAngle0 }}°</strong></label>
                <input type="range" min="5" max="60" [value]="pendulumAngle0" (input)="pendulumAngle0 = +$any($event.target).value; resetPendulum()">
              </div>
              <div class="sim-control-row">
                <button class="sim-btn" style="flex: 1" (click)="togglePendulum()">{{ pendulumRunning ? '⏸ Pausar' : '▶ Oscilar' }}</button>
              </div>
            </div>
            <div class="sim-stats">
              <div class="proj-stat" (mouseenter)="hoveredFormula = 'T = 2π √(L/g)'" (mouseleave)="hoveredFormula = ''"><span>Período T</span><strong>{{ getPendulumPeriod() | number:'1.2-2' }} s</strong></div>
              <div class="proj-stat" (mouseenter)="hoveredFormula = 'Ec = ½·m·v²'" (mouseleave)="hoveredFormula = ''"><span>E cinética</span><strong>{{ pendulumKE | number:'1.1-1' }} J</strong></div>
              <div class="proj-stat" (mouseenter)="hoveredFormula = 'Ep = m·g·h'" (mouseleave)="hoveredFormula = ''"><span>E potencial</span><strong>{{ pendulumPE | number:'1.1-1' }} J</strong></div>
            </div>
            <div class="sim-formulas-container">
              <div class="sim-formula"><span class="formula-label">Período</span><span class="formula-text">T = 2π √(L/g)</span></div>
              <div class="sim-formula"><span class="formula-label">Energía</span><span class="formula-text">Em = Ec + Ep = Const</span></div>
            </div>
          </div>

          <!-- ═══ COULOMB SIMULATOR ═══ -->
          <div class="sim-content" *ngIf="activeSimTab === 'coulomb'">
            <div class="sim-info-badge">⚡ Ley de Coulomb — fuerza entre cargas eléctricas</div>
            <canvas #coulombCanvas class="sim-canvas"></canvas>
            <div class="sim-controls">
              <div class="sim-control-row">
                <label>Carga q₁: <strong>{{ coulombQ1 }} μC</strong></label>
                <input type="range" min="1" max="10" [value]="coulombQ1" (input)="coulombQ1 = +$any($event.target).value; drawCoulomb()">
              </div>
              <div class="sim-control-row">
                <label>Carga q₂: <strong>{{ coulombQ2 }} μC</strong></label>
                <input type="range" min="1" max="10" [value]="coulombQ2" (input)="coulombQ2 = +$any($event.target).value; drawCoulomb()">
              </div>
              <div class="sim-control-row">
                <label>Distancia: <strong>{{ coulombDist }} m</strong></label>
                <input type="range" min="1" max="10" [value]="coulombDist" (input)="coulombDist = +$any($event.target).value; drawCoulomb()">
              </div>
            </div>
            <div class="sim-stats">
              <div class="proj-stat full" (mouseenter)="hoveredFormula = 'F = k·|q₁·q₂| / r²'" (mouseleave)="hoveredFormula = ''">
                <span>Fuerza eléctrica</span>
                <strong>{{ getCoulombForce() | number:'1.2-2' }} N</strong>
              </div>
            </div>
            <div class="sim-formulas-container">
              <div class="sim-formula"><span class="formula-label">Fuerza Eléctrica</span><span class="formula-text">F = k·|q₁·q₂| / r²</span></div>
            </div>
          </div>

          <!-- ═══ CIRCUIT SIMULATOR ═══ -->
          <div class="sim-content" *ngIf="activeSimTab === 'circuit'">
            <div class="sim-info-badge">🔋 Ley de Ohm — voltaje, corriente y resistencia en circuitos</div>
            <canvas #circuitCanvas class="sim-canvas"></canvas>
            <div class="sim-controls">
              <div class="sim-control-row">
                <label>Voltaje V: <strong>{{ circuitV }} V</strong></label>
                <input type="range" min="1" max="24" [value]="circuitV" (input)="circuitV = +$any($event.target).value; drawCircuit()">
              </div>
              <div class="sim-control-row">
                <label>R₁: <strong>{{ circuitR1 }} Ω</strong></label>
                <input type="range" min="1" max="20" [value]="circuitR1" (input)="circuitR1 = +$any($event.target).value; drawCircuit()">
              </div>
              <div class="sim-control-row">
                <label>R₂: <strong>{{ circuitR2 }} Ω</strong></label>
                <input type="range" min="1" max="20" [value]="circuitR2" (input)="circuitR2 = +$any($event.target).value; drawCircuit()">
              </div>
              <div class="sim-control-row">
                <label>Tipo:</label>
                <div style="display:flex;gap:0.35rem">
                  <button class="sim-btn" [class.sim-btn-outline]="circuitType !== 'series'" (click)="circuitType='series'; drawCircuit()">Serie</button>
                  <button class="sim-btn" [class.sim-btn-outline]="circuitType !== 'parallel'" (click)="circuitType='parallel'; drawCircuit()">Paralelo</button>
                </div>
              </div>
            </div>
            <div class="sim-stats">
              <div class="proj-stat" (mouseenter)="hoveredFormula = circuitType === 'series' ? 'Rs = R₁ + R₂' : 'Rp = (R₁·R₂) / (R₁ + R₂)'" (mouseleave)="hoveredFormula = ''"><span>R total</span><strong>{{ getCircuitRt() | number:'1.1-1' }} Ω</strong></div>
              <div class="proj-stat" (mouseenter)="hoveredFormula = 'I = V / R_total'" (mouseleave)="hoveredFormula = ''"><span>Corriente</span><strong>{{ getCircuitI() | number:'1.2-2' }} A</strong></div>
              <div class="proj-stat" (mouseenter)="hoveredFormula = 'P = V · I'" (mouseleave)="hoveredFormula = ''"><span>Potencia</span><strong>{{ getCircuitP() | number:'1.1-1' }} W</strong></div>
            </div>
            <div class="sim-formulas-container">
              <div class="sim-formula"><span class="formula-label">Voltaje</span><span class="formula-text">V = I · R</span></div>
              <div class="sim-formula"><span class="formula-label">Potencia</span><span class="formula-text">P = V · I</span></div>
              <div class="sim-formula"><span class="formula-label">R Serie</span><span class="formula-text">Rs = R₁+R₂</span></div>
              <div class="sim-formula"><span class="formula-label">R Paralelo</span><span class="formula-text">1/Rp = 1/R₁+1/R₂</span></div>
            </div>
          </div>

          
          <!-- ═══ CALORIMETRY SIMULATOR ═══ -->
          <div class="sim-content" *ngIf="activeSimTab === 'calorimetry'">
            <div class="sim-info-badge">🌡️ Calorimetría — Equilibrio térmico de mezclas</div>
            <canvas #calorimetryCanvas class="sim-canvas"></canvas>
            <div class="sim-controls">
              <div class="sim-control-row">
                <label>Masa 1: <strong>{{ calMass1 }} g</strong></label>
                <input type="range" min="10" max="500" [value]="calMass1" (input)="calMass1 = +$any($event.target).value; drawCalorimetry()">
              </div>
              <div class="sim-control-row">
                <label>Temp 1: <strong>{{ calTemp1 }} °C</strong></label>
                <input type="range" min="0" max="100" [value]="calTemp1" (input)="calTemp1 = +$any($event.target).value; drawCalorimetry()">
              </div>
              <div class="sim-control-row">
                <label>Masa 2: <strong>{{ calMass2 }} g</strong></label>
                <input type="range" min="10" max="500" [value]="calMass2" (input)="calMass2 = +$any($event.target).value; drawCalorimetry()">
              </div>
              <div class="sim-control-row">
                <label>Temp 2: <strong>{{ calTemp2 }} °C</strong></label>
                <input type="range" min="0" max="100" [value]="calTemp2" (input)="calTemp2 = +$any($event.target).value; drawCalorimetry()">
              </div>
            </div>
            <div class="sim-stats">
              <div class="proj-stat full" (mouseenter)="hoveredFormula = 'T_eq = (m₁T₁ + m₂T₂) / (m₁ + m₂)'" (mouseleave)="hoveredFormula = ''">
                <span>Temp. de Equilibrio</span>
                <strong>{{ calTeq | number:'1.1-1' }} °C</strong>
              </div>
            </div>
            <div class="sim-formulas-container">
              <div class="sim-formula"><span class="formula-label">Equilibrio</span><span class="formula-text">T_eq = (m₁T₁ + m₂T₂) / (m₁ + m₂)</span></div>
            </div>
          </div>

          <!-- ═══ OPTICS SIMULATOR ═══ -->
          <div class="sim-content" *ngIf="activeSimTab === 'optics'">
            <div class="sim-info-badge">🔍 Óptica Geométrica — Formación de imagen en Lente Convergente</div>
            <canvas #opticsCanvas class="sim-canvas"></canvas>
            <div class="sim-controls">
              <div class="sim-control-row">
                <label>Foco (f): <strong>{{ optFocal }} cm</strong></label>
                <input type="range" min="20" max="80" [value]="optFocal" (input)="optFocal = +$any($event.target).value; drawOptics()">
              </div>
              <div class="sim-control-row">
                <label>Dist. Objeto (do): <strong>{{ optDist }} cm</strong></label>
                <input type="range" min="10" max="250" [value]="optDist" (input)="optDist = +$any($event.target).value; drawOptics()">
              </div>
              <div class="sim-control-row">
                <label>Alt. Objeto (ho): <strong>{{ optHeight }} cm</strong></label>
                <input type="range" min="10" max="80" [value]="optHeight" (input)="optHeight = +$any($event.target).value; drawOptics()">
              </div>
            </div>
            <div class="sim-stats">
              <div class="proj-stat" (mouseenter)="hoveredFormula = '1/f = 1/do + 1/di'" (mouseleave)="hoveredFormula = ''"><span>Dist. Imagen (di)</span><strong>{{ getOpticsDi() | number:'1.1-1' }} cm</strong></div>
              <div class="proj-stat" (mouseenter)="hoveredFormula = 'M = -di / do'" (mouseleave)="hoveredFormula = ''"><span>Aumento (M)</span><strong>{{ getOpticsM() | number:'1.2-2' }} x</strong></div>
              <div class="proj-stat" (mouseenter)="hoveredFormula = 'hi = M · ho'" (mouseleave)="hoveredFormula = ''"><span>Alt. Imagen (hi)</span><strong>{{ getOpticsHi() | number:'1.1-1' }} cm</strong></div>
            </div>
            <div class="sim-formulas-container">
              <div class="sim-formula"><span class="formula-label">Ecuación Lentes</span><span class="formula-text">1/f = 1/do + 1/di</span></div>
              <div class="sim-formula"><span class="formula-label">Aumento</span><span class="formula-text">M = -di / do</span></div>
            </div>
          </div>

          <!-- ═══ FARADAY SIMULATOR ═══ -->
          <div class="sim-content" *ngIf="activeSimTab === 'faraday'">
            <div class="sim-info-badge">🧲 Ley de Faraday — Inducción electromagnética por flujo magnético</div>
            <canvas #faradayCanvas class="sim-canvas"></canvas>
            <div class="sim-controls">
              <div class="sim-control-row">
                <label>Espiras (N): <strong>{{ faraN }}</strong></label>
                <input type="range" min="1" max="10" [value]="faraN" (input)="faraN = +$any($event.target).value">
              </div>
              <div class="sim-control-row">
                <label>Área (A): <strong>{{ faraArea }}</strong></label>
                <input type="range" min="1" max="20" [value]="faraArea" (input)="faraArea = +$any($event.target).value">
              </div>
              <div class="sim-control-row">
                <label>Velocidad imán: <strong>{{ faraSpeed }}</strong></label>
                <input type="range" min="1" max="15" [value]="faraSpeed" (input)="faraSpeed = +$any($event.target).value">
              </div>
              <div class="sim-control-row">
                <button class="sim-btn" style="flex: 1" (click)="toggleFaraday()">{{ faraRunning ? '⏸ Pausar' : '▶ Animar' }}</button>
              </div>
            </div>
            <div class="sim-stats">
              <div class="proj-stat" (mouseenter)="hoveredFormula = 'Φ = B · A'" (mouseleave)="hoveredFormula = ''"><span>Flujo (Φ)</span><strong>{{ faraFlux | number:'1.1-1' }} Wb</strong></div>
              <div class="proj-stat" (mouseenter)="hoveredFormula = 'ε = -N · (ΔΦ/Δt)'" (mouseleave)="hoveredFormula = ''"><span>FEM inducida</span><strong>{{ faraEmf | number:'1.2-2' }} V</strong></div>
            </div>
            <div class="sim-formulas-container">
              <div class="sim-formula"><span class="formula-label">Flujo Magnético</span><span class="formula-text">Φ = B · A · cos(θ)</span></div>
              <div class="sim-formula"><span class="formula-label">Ley Faraday</span><span class="formula-text">ε = -N · (ΔΦ/Δt)</span></div>
            </div>
          </div>

          <!-- ═══ ORBIT SIMULATOR ═══ -->
          <div class="sim-content" *ngIf="activeSimTab === 'orbit'">
            <div class="sim-info-badge">🪐 Órbita planetaria — gravedad y velocidad orbital</div>
            <canvas #orbitCanvas class="sim-canvas"></canvas>
            <div class="sim-controls">
              <div class="sim-control-row">
                <label>Masa estrella: <strong>{{ orbitMassStar }}</strong></label>
                <input type="range" min="1" max="10" [value]="orbitMassStar" (input)="orbitMassStar = +$any($event.target).value">
              </div>
              <div class="sim-control-row">
                <label>Radio órbita: <strong>{{ orbitRadius }}</strong></label>
                <input type="range" min="40" max="110" [value]="orbitRadius" (input)="orbitRadius = +$any($event.target).value">
              </div>
              <div class="sim-control-row">
                <button class="sim-btn" style="flex: 1" (click)="toggleOrbit()">{{ orbitRunning ? '⏸ Pausar' : '▶ Orbitar' }}</button>
              </div>
            </div>
            <div class="sim-stats">
              <div class="proj-stat" (mouseenter)="hoveredFormula = 'v = √(G·M / r)'" (mouseleave)="hoveredFormula = ''"><span>Vel. orbital</span><strong>{{ getOrbitVel() | number:'1.2-2' }} ua/s</strong></div>
              <div class="proj-stat" (mouseenter)="hoveredFormula = 'T = 2π·r / v'" (mouseleave)="hoveredFormula = ''"><span>Período</span><strong>{{ getOrbitPeriod() | number:'1.1-1' }} s</strong></div>
            </div>
            <div class="sim-formulas-container">
              <div class="sim-formula"><span class="formula-label">F. Gravedad</span><span class="formula-text">F = G·M·m/r²</span></div>
              <div class="sim-formula"><span class="formula-label">Velocidad</span><span class="formula-text">v = √(G·M/r)</span></div>
            </div>
          </div>

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
    .sidebar-logo-img { width: 230px; height: auto; object-fit: contain; margin: 28px auto 0 auto; filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.2)); animation: floatLogo 3.5s ease-in-out infinite; }
    .mobile-logo-img { width: 160px; height: auto; object-fit: contain; margin: 12px auto 0 auto; animation: floatLogo 3.5s ease-in-out infinite; }
    :host { display: block; min-height: 100vh; background: var(--bg-color); color: var(--text-primary); }
    .lp-layout { display: flex; min-height: 100vh; }
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
    .duo-path-container { position: relative; padding: 2rem 0; display: flex; flex-direction: column; align-items: center; }

    /* READING BACKGROUND DECORATIONS */
    .physics-bg-decorations {
      position: absolute; inset: 0; pointer-events: none; z-index: 0; overflow: hidden;
      background:
        radial-gradient(ellipse 70% 45% at 15% -8%, rgba(220,38,38,0.08), transparent 60%),
        radial-gradient(ellipse 70% 45% at 100% 105%, rgba(239,68,68,0.08), transparent 60%),
        radial-gradient(rgba(220, 38, 38, 0.12) 1.5px, transparent 1.5px);
      background-size: 100% 100%, 100% 100%, 32px 32px;
    }
    .bg-deco { position: absolute; color: #dc2626; opacity: 0.22; font-family: var(--font-heading, 'Nunito', sans-serif); font-weight: 800; user-select: none; }
    .bg-deco-orbit { position: absolute; top: 6%; right: -10%; width: 460px; height: 460px; border: 2px dashed rgba(220, 38, 38, 0.16); border-radius: 50%; transform: rotate(-18deg); }
    .bg-deco-orbit::before { content: ''; position: absolute; inset: 70px; border: 2px dashed rgba(220, 38, 38, 0.13); border-radius: 50%; }
    .bg-deco-orbit::after { content: ''; position: absolute; top: 50%; left: 50%; width: 12px; height: 12px; margin: -6px; background: rgba(220, 38, 38, 0.28); border-radius: 50%; }
    .bg-deco-orbit-alt { position: absolute; bottom: 4%; left: -8%; width: 320px; height: 320px; border: 2px dashed rgba(239, 68, 68, 0.15); border-radius: 50%; transform: rotate(12deg); }
    .bg-deco-orbit-alt::before { content: ''; position: absolute; inset: 48px; border: 2px dashed rgba(239, 68, 68, 0.12); border-radius: 50%; }
    .bg-deco-orbit-alt::after { content: ''; position: absolute; top: 50%; left: 50%; width: 10px; height: 10px; margin: -5px; background: rgba(239, 68, 68, 0.25); border-radius: 50%; }
    @media (max-width: 900px) { .bg-deco-orbit, .bg-deco-orbit-alt { display: none; } }

    /* CHAPTER SPLASH BANNER */
    .chapter-splash { width: 100%; max-width: 600px; position: relative; z-index: 15; border-radius: 28px; overflow: visible; border: 1.5px solid rgba(133,92,214,0.25); box-shadow: 0 16px 40px rgba(133,92,214,0.12), inset 0 2px 4px rgba(255,255,255,0.8); background: linear-gradient(135deg, #ffffff 0%, #f7f4ff 100%); transition: all 0.3s ease; }
    .chapter-splash.chapter-completed { border: 2px solid #dc2626 !important; box-shadow: 0 16px 40px rgba(220,38,38,0.2), inset 0 2px 4px rgba(255,255,255,0.8) !important; background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%) !important; }
    .chapter-splash.chapter-completed .splash-badge { background: #dc2626 !important; }
    .chapter-splash.cap-localizar { background: linear-gradient(150deg, #f3eeff 0%, #e8dff8 40%, #f0ebff 100%); }
    .chapter-splash.cap-interpretar { background: linear-gradient(150deg, #e8f4fd 0%, #d6ecfa 40%, #eaf6ff 100%); }
    .chapter-splash.cap-evaluar { background: linear-gradient(150deg, #e8fde8 0%, #d6f5d6 40%, #eaffea 100%); }
    .splash-bg-pattern { position: absolute; inset: 0; opacity: 0.04; border-radius: inherit; background-image: radial-gradient(circle at 20% 50%, var(--accent-primary) 1px, transparent 1px), radial-gradient(circle at 80% 20%, var(--accent-primary) 1px, transparent 1px), radial-gradient(circle at 60% 80%, var(--accent-primary) 1px, transparent 1px); background-size: 40px 40px, 60px 60px, 50px 50px; pointer-events: none; }
    .splash-inner { position: relative; padding: 2rem 2rem 1.5rem; }
    .splash-hero { display: flex; align-items: center; gap: 1.5rem; }
    .splash-mascot-area { flex-shrink: 0; width: 180px; height: 180px; position: relative; display: flex; align-items: center; justify-content: center; }
    .splash-mascot { width: 290px; height: 290px; position: absolute; object-fit: contain; animation: mascotFloat 3.5s ease-in-out infinite; }
    
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
    
    .icon-practice { color: #58cc02; }
    .title-practice { color: #58cc02; font-weight: 800; }
    .icon-pro-tip { color: #ff9600; }
    .title-pro-tip { color: #ff9600; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.85rem; }
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
      margin-bottom: 0.1rem;
    }

    .sim-tabs {
      display: flex;
      gap: 0.4rem;
      margin-bottom: 1rem;
      background: rgba(0,0,0,0.04);
      border-radius: 12px;
      padding: 0.35rem;
    }
    .sim-tab {
      flex: 1;
      background: transparent;
      border: none;
      color: var(--text-secondary);
      padding: 0.5rem 0.25rem;
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
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
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
  `]
})
export class MateriaPathComponent implements AfterViewInit, OnDestroy {
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

  // ─── Physics Simulator State ───
  simPanelOpen = false;
  simExpanded = false;
  selectedSimChapterIndex = 0;
  activeSimTab: 'waves' | 'interference' | 'projectile' | 'inclined' | 'pendulum' | 'coulomb' | 'circuit' | 'orbit' | 'calorimetry' | 'optics' | 'faraday' = 'projectile';

  // Calorimetry
  calMass1 = 100; calTemp1 = 80;
  calMass2 = 100; calTemp2 = 20;
  calTeq = 50;

  // Optics
  optFocal = 50; optDist = 120; optHeight = 40;

  // Faraday
  faraSpeed = 5; faraN = 3; faraArea = 10;
  faraFlux = 0; faraEmf = 0;
  faraMagnetX = 0;
  faraRunning = false; faraAnimReq: any;
  faraMagnetDir = 1;

  hoveredFormula = '';

  toggleSimExpand() {
    this.simExpanded = !this.simExpanded;
    setTimeout(() => this.initCurrentSim(), 300); // redraw after transition
  }

  setSimChapter(event: Event) {
    const target = event.target as HTMLSelectElement;
    const index = Number(target.value);
    this.selectedSimChapterIndex = index;
    if (index === 0) this.setSimTab('projectile');
    else if (index === 1) this.setSimTab('waves');
    else if (index === 2) this.setSimTab('pendulum');
    else if (index === 3) this.setSimTab('coulomb');
    else if (index === 4) this.setSimTab('orbit');
  }

  // Wave simulator
  waveAmplitude = 35;
  waveFrequency = 3;
  waveAnimating = false;
  private wavePhase = 0;
  private waveAnimFrame: any;

  // Interference simulator
  interfFreq1 = 3;
  interfFreq2 = 4;
  interfPhase = 0;
  interfAnimating = false;
  private interfPhaseAnim = 0;
  private interfAnimFrame: any;

  // Projectile simulator
  projVelocity = 30;
  projAngle = 45;
  projMaxHeight = 0;
  projRange = 0;
  projTime = 0;
  private projAnimFrame: any;
  private projAnimating = false;

  // Inclined plane simulator
  inclinedAngle = 30;
  inclinedMass = 5;
  inclinedMu = 0.2;

  // Pendulum simulator
  pendulumLength = 3;
  pendulumAngle0 = 30;
  pendulumRunning = false;
  pendulumKE = 0;
  pendulumPE = 0;
  private pendulumAngle = 30 * Math.PI / 180;
  private pendulumOmega = 0;
  private pendulumAnimFrame: any;

  // Coulomb simulator
  coulombQ1 = 3;
  coulombQ2 = 5;
  coulombDist = 4;

  // Circuit simulator
  circuitV = 12;
  circuitR1 = 4;
  circuitR2 = 6;
  circuitType: 'series' | 'parallel' = 'series';

  // Orbit simulator
  orbitMassStar = 5;
  orbitRadius = 80;
  orbitRunning = false;
  private orbitAngle = 0;
  private orbitAnimFrame: any;

  @ViewChild('waveCanvas') waveCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('interferenceCanvas') interferenceCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('projectileCanvas') projectileCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('inclinedCanvas') inclinedCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pendulumCanvas') pendulumCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('coulombCanvas') coulombCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('circuitCanvas') circuitCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('orbitCanvas') orbitCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('calorimetryCanvas') calorimetryCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('opticsCanvas') opticsCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('faradayCanvas') faradayCanvasRef!: ElementRef<HTMLCanvasElement>;


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
    return id === 'historia' || id === 'fisica' || id === 'ciencias-fisica' || id === 'ciencias-biologia';
  }

  getSubcapituloTitle(node: any): string {
    const subCapTag = node.tags?.find((t: string) => t.startsWith('subcapitulo:'));
    if (!subCapTag) return '';
    const raw = subCapTag.split(':')[1].trim();
    return raw.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  isPracticeNode(node: any): boolean {
    return node.isPractice || node.title.toLowerCase().includes('práctica') || node.title.toLowerCase().includes('practica');
  }

  // Pattern for horizontal zigzag staggering
  private offsets = [0, -80, -115, -80, 0, 80, 115, 80];

  ngAfterViewInit() {
    // Initial draw will happen when panel opens
  }

  ngOnDestroy() {
    if (this.waveAnimFrame) cancelAnimationFrame(this.waveAnimFrame);
    if (this.interfAnimFrame) cancelAnimationFrame(this.interfAnimFrame);
    if (this.projAnimFrame) cancelAnimationFrame(this.projAnimFrame);
    if (this.pendulumAnimFrame) cancelAnimationFrame(this.pendulumAnimFrame);
    if (this.orbitAnimFrame) cancelAnimationFrame(this.orbitAnimFrame);
  }

  getSimChapterLabel(): string {
    const labels: Record<string, string> = {
      projectile: 'Cap. 1 — Mecánica',
      inclined: 'Cap. 1 — Mecánica',
      waves: 'Cap. 2 — Ondas',
      interference: 'Cap. 2 — Ondas',
      pendulum: 'Cap. 3 — Energía',
      coulomb: 'Cap. 4 — Electricidad',
      circuit: 'Cap. 4 — Electricidad',
      orbit: 'Cap. 5 — Tierra y Universo'
    };
    return labels[this.activeSimTab] || 'Simuladores de Física';
  }

  isPhysicsRoute(): boolean {
    return this.materiaId() === 'ciencias-fisica';
  }

  toggleSimPanel() {
    this.simPanelOpen = !this.simPanelOpen;
    if (this.simPanelOpen) {
      setTimeout(() => this.initCurrentSim(), 100);
    } else {
      this.waveAnimating = false;
      if (this.waveAnimFrame) cancelAnimationFrame(this.waveAnimFrame);
    }
  }

  setSimTab(tab: 'waves' | 'interference' | 'projectile' | 'inclined' | 'pendulum' | 'coulomb' | 'circuit' | 'orbit' | 'calorimetry' | 'optics' | 'faraday') {
    this.activeSimTab = tab;
    // Stop all animations
    this.waveAnimating = false; cancelAnimationFrame(this.waveAnimFrame);
    this.interfAnimating = false; cancelAnimationFrame(this.interfAnimFrame);
    this.pendulumRunning = false; cancelAnimationFrame(this.pendulumAnimFrame);
    this.orbitRunning = false; cancelAnimationFrame(this.orbitAnimFrame);
    setTimeout(() => this.initCurrentSim(), 50);
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

  private initCurrentSim() {
    if (this.activeSimTab === 'waves') this.drawWave();
    else if (this.activeSimTab === 'interference') this.drawInterference();
    else if (this.activeSimTab === 'projectile') this.drawProjectileStatic();
    else if (this.activeSimTab === 'inclined') this.drawInclined();
    else if (this.activeSimTab === 'pendulum') this.resetPendulum();
    else if (this.activeSimTab === 'coulomb') this.drawCoulomb();
    else if (this.activeSimTab === 'circuit') this.drawCircuit();
    else if (this.activeSimTab === 'orbit') this.resetOrbit();
    else if (this.activeSimTab === 'calorimetry') this.drawCalorimetry();
    else if (this.activeSimTab === 'optics') this.drawOptics();
    else if (this.activeSimTab === 'faraday') this.resetFaraday();
  }

  // ─── Wave Simulator ───
  drawWave() {
    const canvas = this.waveCanvasRef?.nativeElement;
    if (!canvas) return;
    const { ctx, w, h } = this.setupHighDpiCanvas(canvas, this.simExpanded ? 740 : 340, this.simExpanded ? 360 : 180);
    ctx.clearRect(0, 0, w, h);

    // Background grid
    ctx.strokeStyle = 'rgba(124,58,237,0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 30) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 30) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Center axis
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
    ctx.setLineDash([]);

    // Wave
    const gradient = ctx.createLinearGradient(0, 0, w, 0);
    gradient.addColorStop(0, '#7c3aed');
    gradient.addColorStop(0.5, '#a78bfa');
    gradient.addColorStop(1, '#4f46e5');
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.shadowColor = '#a78bfa';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    for (let x = 0; x <= w; x++) {
      const y = h / 2 + this.waveAmplitude * Math.sin(2 * Math.PI * this.waveFrequency * x / w + this.wavePhase);
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Labels
    ctx.fillStyle = 'rgba(167,139,250,0.8)';
    ctx.font = '11px monospace';
    ctx.fillText(`A = ${this.waveAmplitude}px`, 8, 16);
    ctx.fillText(`f = ${this.waveFrequency} Hz`, 8, 30);
    ctx.fillText(`λ = ${(w / this.waveFrequency).toFixed(0)}px`, 8, 44);
  }

  toggleWaveAnimation() {
    this.waveAnimating = !this.waveAnimating;
    if (this.waveAnimating) {
      const animate = () => {
        if (!this.waveAnimating) return;
        this.wavePhase += 0.06;
        this.drawWave();
        this.waveAnimFrame = requestAnimationFrame(animate);
      };
      animate();
    } else {
      cancelAnimationFrame(this.waveAnimFrame);
    }
  }

  // ─── Projectile Simulator ───
  drawProjectileStatic() {
    const canvas = this.projectileCanvasRef?.nativeElement;
    if (!canvas) return;
    const { ctx, w, h } = this.setupHighDpiCanvas(canvas, this.simExpanded ? 740 : 340, this.simExpanded ? 400 : 200);
    ctx.clearRect(0, 0, w, h);

    // Ground
    ctx.strokeStyle = 'rgba(124,58,237,0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, h - 20); ctx.lineTo(w, h - 20); ctx.stroke();

    // Prompt
    ctx.fillStyle = 'rgba(167,139,250,0.6)';
    ctx.font = '13px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Ajusta los parámetros y', w / 2, h / 2 - 10);
    ctx.fillText('presiona 🚀 Lanzar', w / 2, h / 2 + 10);
    ctx.textAlign = 'left';

    // Launch point
    ctx.fillStyle = '#7c3aed';
    ctx.beginPath();
    ctx.arc(20, h - 20, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  launchProjectile() {
    if (this.projAnimating) {
      cancelAnimationFrame(this.projAnimFrame);
    }
    const canvas = this.projectileCanvasRef?.nativeElement;
    if (!canvas) return;
    const { ctx, w, h } = this.setupHighDpiCanvas(canvas, this.simExpanded ? 740 : 340, this.simExpanded ? 400 : 200);
    const g = 9.8;
    const v0 = this.projVelocity;
    const angle = this.projAngle * Math.PI / 180;
    const vx = v0 * Math.cos(angle);
    const vy = v0 * Math.sin(angle);
    const totalTime = (2 * vy) / g;
    const maxRange = vx * totalTime;
    const maxHeight = (vy * vy) / (2 * g);

    this.projMaxHeight = maxHeight;
    this.projRange = maxRange;
    this.projTime = totalTime;

    const scale = Math.min((w - 40) / maxRange, (h - 40) / maxHeight) * 0.8;
    const ox = 20;
    const oy = h - 20;

    const dt = totalTime / 100;
    const points: { x: number, y: number }[] = [];
    for (let i = 0; i <= 100; i++) {
      const ti = i * dt;
      const px = vx * ti;
      const py = vy * ti - 0.5 * g * ti * ti;
      points.push({ x: ox + px * scale, y: oy - py * scale });
    }

    ctx.clearRect(0, 0, w, h);
    // Ground
    ctx.strokeStyle = 'rgba(124,58,237,0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, h - 20); ctx.lineTo(w, h - 20); ctx.stroke();

    let idx = 0;
    this.projAnimating = true;
    const draw = () => {
      if (idx >= points.length) {
        this.projAnimating = false;
        return;
      }
      ctx.clearRect(0, 0, w, h);
      // Ground
      ctx.strokeStyle = 'rgba(124,58,237,0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, h - 20); ctx.lineTo(w, h - 20); ctx.stroke();

      // Trajectory so far
      ctx.strokeStyle = 'rgba(167,139,250,0.4)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i <= idx; i++) ctx.lineTo(points[i].x, points[i].y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Ball
      const grad = ctx.createRadialGradient(points[idx].x, points[idx].y, 0, points[idx].x, points[idx].y, 8);
      grad.addColorStop(0, '#c4b5fd');
      grad.addColorStop(1, '#7c3aed');
      ctx.fillStyle = grad;
      ctx.shadowColor = '#a78bfa';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(points[idx].x, points[idx].y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Velocity vectors
      const ti = idx * dt;
      const curVx = vx;
      const curVy = vy - g * ti;
      const vecScale = 2;
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(points[idx].x, points[idx].y);
      ctx.lineTo(points[idx].x + curVx * vecScale, points[idx].y - curVy * vecScale);
      ctx.stroke();

      idx++;
      this.projAnimFrame = requestAnimationFrame(draw);
    };
    draw();
  }

  resetProjectile() {
    if (this.projAnimating) {
      this.projAnimating = false;
      cancelAnimationFrame(this.projAnimFrame);
    }
    this.projMaxHeight = 0;
    this.projRange = 0;
    this.projTime = 0;
    this.drawProjectileStatic();
  }

  // ─── Coulomb Simulator ───
  getCoulombForce(): number {
    const k = 8.99e9;
    const q1 = this.coulombQ1 * 1e-6;
    const q2 = this.coulombQ2 * 1e-6;
    const r = this.coulombDist;
    return k * Math.abs(q1 * q2) / (r * r);
  }

  drawCoulomb() {
    const canvas = this.coulombCanvasRef?.nativeElement;
    if (!canvas) return;
    const { ctx, w, h } = this.setupHighDpiCanvas(canvas, this.simExpanded ? 740 : 340, this.simExpanded ? 400 : 200);
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    // Scale distance based on canvas width to prevent it looking tiny when expanded
    const halfDist = Math.min(this.coulombDist * (w / 24), (w / 2) - 40);

    // Distance line
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(cx - halfDist, cy); ctx.lineTo(cx + halfDist, cy); ctx.stroke();
    ctx.setLineDash([]);

    // Distance label
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`r = ${this.coulombDist} m`, cx, cy - 8);

    // Charge q1 (left)
    const q1Grad = ctx.createRadialGradient(cx - halfDist, cy, 0, cx - halfDist, cy, 24);
    q1Grad.addColorStop(0, '#fbbf24');
    q1Grad.addColorStop(1, 'rgba(251,191,36,0.1)');
    ctx.fillStyle = q1Grad;
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(cx - halfDist, cy, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#111';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`+${this.coulombQ1}μC`, cx - halfDist, cy + 4);

    // Charge q2 (right)
    const q2Grad = ctx.createRadialGradient(cx + halfDist, cy, 0, cx + halfDist, cy, 24);
    q2Grad.addColorStop(0, '#60a5fa');
    q2Grad.addColorStop(1, 'rgba(96,165,250,0.1)');
    ctx.fillStyle = q2Grad;
    ctx.shadowColor = '#60a5fa';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(cx + halfDist, cy, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#111';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`+${this.coulombQ2}μC`, cx + halfDist, cy + 4);

    // Force arrows
    const force = this.getCoulombForce();
    const arrowLen = Math.min(force * 0.003 + 20, 50);
    ctx.strokeStyle = '#f87171';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#f87171';
    ctx.shadowBlur = 6;
    // q1 arrow (pointing left)
    this.drawArrow(ctx, cx - halfDist + 22, cy - 30, cx - halfDist + 22 - arrowLen, cy - 30);
    // q2 arrow (pointing right)
    this.drawArrow(ctx, cx + halfDist - 22, cy - 30, cx + halfDist - 22 + arrowLen, cy - 30);
    ctx.shadowBlur = 0;

    // Force label
    this.drawBadge(ctx, `F = ${this.getCoulombForce().toFixed(2)} N`, cx, h - 14, '#fca5a5', 'center');
  }

  private drawArrow(ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number) {
    const headLen = 8;
    const angle = Math.atan2(toY - fromY, toX - fromX);
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fillStyle = '#f87171';
    ctx.fill();
  }

  private drawBadge(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color: string, align: 'left' | 'center' | 'right' = 'left') {
    ctx.font = 'bold 11px monospace';
    const m = ctx.measureText(text);
    const w = m.width + 10;
    const h = 18;
    const r = 4;

    let boxX = x;
    if (align === 'center') boxX = x - w / 2;
    else if (align === 'right') boxX = x - w;

    ctx.fillStyle = 'rgba(15, 12, 41, 0.85)';
    ctx.beginPath();
    ctx.moveTo(boxX + r, y - 13);
    ctx.lineTo(boxX + w - r, y - 13);
    ctx.quadraticCurveTo(boxX + w, y - 13, boxX + w, y - 13 + r);
    ctx.lineTo(boxX + w, y - 13 + h - r);
    ctx.quadraticCurveTo(boxX + w, y - 13 + h, boxX + w - r, y - 13 + h);
    ctx.lineTo(boxX + r, y - 13 + h);
    ctx.quadraticCurveTo(boxX, y - 13 + h, boxX, y - 13 + h - r);
    ctx.lineTo(boxX, y - 13 + r);
    ctx.quadraticCurveTo(boxX, y - 13, boxX + r, y - 13);
    ctx.closePath();
    ctx.fill();

    ctx.textAlign = 'left';
    ctx.fillStyle = color;
    ctx.fillText(text, boxX + 5, y);
  }

  // ─── Inclined Plane Simulator ───
  getInclinedFp(): number { return this.inclinedMass * 9.8 * Math.sin(this.inclinedAngle * Math.PI / 180); }
  getInclinedFn(): number { return this.inclinedMass * 9.8 * Math.cos(this.inclinedAngle * Math.PI / 180); }
  getInclinedFr(): number { return this.inclinedMu * this.getInclinedFn(); }
  getInclinedAcc(): number { return Math.max(0, (this.getInclinedFp() - this.getInclinedFr()) / this.inclinedMass); }

  drawInclined() {
    const canvas = this.inclinedCanvasRef?.nativeElement;
    if (!canvas) return;
    const { ctx, w, h } = this.setupHighDpiCanvas(canvas, this.simExpanded ? 740 : 340, this.simExpanded ? 400 : 200);
    ctx.clearRect(0, 0, w, h);
    const ang = this.inclinedAngle * Math.PI / 180;
    const baseW = w - 40; const baseH = Math.tan(ang) * baseW;
    const clampH = Math.min(baseH, h - 40);
    const actualBaseW = clampH / Math.tan(ang);
    const ox = 20; const oy = h - 20;
    // Triangle
    ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + actualBaseW, oy); ctx.lineTo(ox, oy - clampH); ctx.closePath();
    ctx.fillStyle = 'rgba(124,58,237,0.15)'; ctx.fill();
    ctx.strokeStyle = 'rgba(124,58,237,0.6)'; ctx.lineWidth = 2; ctx.stroke();
    // Angle arc
    ctx.beginPath(); ctx.arc(ox + actualBaseW, oy, 28, Math.PI, Math.PI + ang); ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = '#fbbf24'; ctx.font = '10px monospace'; ctx.fillText(`${this.inclinedAngle}°`, ox + actualBaseW - 48, oy - 8);
    // Block on slope
    const slopeT = 0.5;
    const midX = ox + actualBaseW * slopeT;
    const midY = oy - clampH * (1 - slopeT);
    const blockSize = 20;
    ctx.save(); ctx.translate(midX, midY); ctx.rotate(-ang);
    ctx.fillStyle = 'rgba(167,139,250,0.85)'; ctx.fillRect(-blockSize / 2, -blockSize, blockSize, blockSize);
    ctx.strokeStyle = '#a78bfa'; ctx.strokeRect(-blockSize / 2, -blockSize, blockSize, blockSize);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(`${this.inclinedMass}kg`, 0, -6); ctx.textAlign = 'left';
    // Weight component arrow (parallel to slope - red)
    const fpScale = this.getInclinedFp() * 0.8;
    ctx.strokeStyle = '#f87171'; ctx.fillStyle = '#f87171'; ctx.lineWidth = 2;
    const fpLen = Math.min(fpScale, 50);
    this.drawArrow(ctx, 0, 0, fpLen, 0);
    // Friction arrow (up-slope - blue)
    const frLen = Math.min(this.getInclinedFr() * 0.8, 40);
    ctx.strokeStyle = '#60a5fa'; ctx.fillStyle = '#60a5fa';
    this.drawArrow(ctx, 0, 0, -frLen, 0);
    ctx.restore();
    // Labels
    this.drawBadge(ctx, `F∥=${this.getInclinedFp().toFixed(1)}N`, w - 8, 18, '#f87171', 'right');
    this.drawBadge(ctx, `Fr=${this.getInclinedFr().toFixed(1)}N`, w - 8, 38, '#60a5fa', 'right');
    this.drawBadge(ctx, `a=${this.getInclinedAcc().toFixed(2)}m/s²`, w - 8, 58, '#4ade80', 'right');
  }

  // ─── Interference Simulator ───
  drawInterference() {
    const canvas = this.interferenceCanvasRef?.nativeElement;
    if (!canvas) return;
    const { ctx, w, h } = this.setupHighDpiCanvas(canvas, this.simExpanded ? 740 : 340, this.simExpanded ? 400 : 200);
    ctx.clearRect(0, 0, w, h);
    const h3 = h / 3;
    const phaseRad = (this.interfPhase * Math.PI / 180) + this.interfPhaseAnim;
    // Wave 1 (blue)
    ctx.beginPath(); ctx.strokeStyle = '#60a5fa'; ctx.lineWidth = 1.5;
    for (let x = 0; x <= w; x++) {
      const y = h3 * 0.5 + 25 * Math.sin(2 * Math.PI * this.interfFreq1 * x / w + this.interfPhaseAnim);
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    } ctx.stroke();
    ctx.fillStyle = '#60a5fa'; ctx.font = '9px monospace'; ctx.fillText('y₁', 4, h3 * 0.5 - 28);
    // Wave 2 (orange)
    ctx.beginPath(); ctx.strokeStyle = '#fb923c'; ctx.lineWidth = 1.5;
    for (let x = 0; x <= w; x++) {
      const y = h3 + 25 * Math.sin(2 * Math.PI * this.interfFreq2 * x / w + phaseRad);
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    } ctx.stroke();
    ctx.fillStyle = '#fb923c'; ctx.fillText('y₂', 4, h3 - 28);
    // Resulting wave (white)
    ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(0, h3 * 1.8, w, h3 * 1.2);
    ctx.beginPath();
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, '#a78bfa'); grad.addColorStop(0.5, '#c4b5fd'); grad.addColorStop(1, '#7c3aed');
    ctx.strokeStyle = grad; ctx.lineWidth = 2.5;
    ctx.shadowColor = '#a78bfa'; ctx.shadowBlur = 6;
    for (let x = 0; x <= w; x++) {
      const y1 = 25 * Math.sin(2 * Math.PI * this.interfFreq1 * x / w + this.interfPhaseAnim);
      const y2 = 25 * Math.sin(2 * Math.PI * this.interfFreq2 * x / w + phaseRad);
      const y = h3 * 2.4 + (y1 + y2) * 0.6;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    } ctx.stroke(); ctx.shadowBlur = 0;
    ctx.fillStyle = '#c4b5fd'; ctx.fillText('y₁+y₂', 4, h3 * 1.85);
    // Center lines
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    [h3 * 0.5, h3, h3 * 2.4].forEach(y => { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); });
    ctx.setLineDash([]);
  }

  toggleInterfAnimation() {
    this.interfAnimating = !this.interfAnimating;
    if (this.interfAnimating) {
      const animate = () => {
        if (!this.interfAnimating) return;
        this.interfPhaseAnim += 0.04;
        this.drawInterference();
        this.interfAnimFrame = requestAnimationFrame(animate);
      }; animate();
    } else { cancelAnimationFrame(this.interfAnimFrame); }
  }

  // ─── Pendulum Simulator ───
  getPendulumPeriod(): number { return 2 * Math.PI * Math.sqrt(this.pendulumLength / 9.8); }

  resetPendulum() {
    this.pendulumRunning = false;
    cancelAnimationFrame(this.pendulumAnimFrame);
    this.pendulumAngle = this.pendulumAngle0 * Math.PI / 180;
    this.pendulumOmega = 0;
    this.pendulumKE = 0;
    const m = 1; const g = 9.8; const L = this.pendulumLength;
    this.pendulumPE = m * g * L * (1 - Math.cos(this.pendulumAngle));
    this.drawPendulum();
  }

  togglePendulum() {
    this.pendulumRunning = !this.pendulumRunning;
    if (this.pendulumRunning) {
      const dt = 0.03; const m = 1; const g = 9.8;
      const animate = () => {
        if (!this.pendulumRunning) return;
        const L = this.pendulumLength;
        const alpha = -(g / L) * Math.sin(this.pendulumAngle);
        this.pendulumOmega += alpha * dt;
        this.pendulumAngle += this.pendulumOmega * dt;
        const h = L * (1 - Math.cos(this.pendulumAngle));
        this.pendulumPE = m * g * h;
        this.pendulumKE = 0.5 * m * (L * this.pendulumOmega) ** 2;
        this.drawPendulum();
        this.pendulumAnimFrame = requestAnimationFrame(animate);
      }; animate();
    } else { cancelAnimationFrame(this.pendulumAnimFrame); }
  }

  private drawPendulum() {
    const canvas = this.pendulumCanvasRef?.nativeElement;
    if (!canvas) return;
    const { ctx, w, h } = this.setupHighDpiCanvas(canvas, this.simExpanded ? 740 : 340, this.simExpanded ? 440 : 220);
    ctx.clearRect(0, 0, w, h);
    const pivotX = w / 2; const pivotY = 30;
    const L = this.pendulumLength; const scale = Math.min((h - 60) / L, 60);
    const bobX = pivotX + L * scale * Math.sin(this.pendulumAngle);
    const bobY = pivotY + L * scale * Math.cos(this.pendulumAngle);
    // Ceiling
    ctx.fillStyle = 'rgba(124,58,237,0.3)'; ctx.fillRect(0, 0, w, 8);
    // Trajectory arc
    ctx.beginPath(); ctx.arc(pivotX, pivotY, L * scale, -Math.PI / 2 - this.pendulumAngle0 * Math.PI / 180, -Math.PI / 2 + this.pendulumAngle0 * Math.PI / 180);
    ctx.strokeStyle = 'rgba(167,139,250,0.15)'; ctx.lineWidth = 2; ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]);
    // String
    ctx.beginPath(); ctx.moveTo(pivotX, pivotY); ctx.lineTo(bobX, bobY);
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 2; ctx.stroke();
    // Pivot
    ctx.beginPath(); ctx.arc(pivotX, pivotY, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#a78bfa'; ctx.fill();
    // Bob
    const bobGrad = ctx.createRadialGradient(bobX - 3, bobY - 3, 2, bobX, bobY, 14);
    bobGrad.addColorStop(0, '#c4b5fd'); bobGrad.addColorStop(1, '#7c3aed');
    ctx.beginPath(); ctx.arc(bobX, bobY, 14, 0, Math.PI * 2);
    ctx.fillStyle = bobGrad; ctx.shadowColor = '#a78bfa'; ctx.shadowBlur = 16; ctx.fill(); ctx.shadowBlur = 0;
    // Energy bar
    const totalE = this.pendulumKE + this.pendulumPE;
    const barW = 90; const barH = 10; const barX = 10; const barY = h - 20;
    ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(barX, barY, barW, barH); ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.strokeRect(barX, barY, barW, barH);
    if (totalE > 0) {
      const keW = barW * (this.pendulumKE / totalE);
      const peW = barW * (this.pendulumPE / totalE);
      ctx.fillStyle = '#f59e0b'; ctx.fillRect(barX, barY, keW, barH);
      ctx.fillStyle = '#60a5fa'; ctx.fillRect(barX + keW, barY, peW, barH);
    }
    ctx.fillStyle = '#f59e0b'; ctx.font = '9px monospace'; ctx.fillText('Ec', barX, barY - 3);
    ctx.fillStyle = '#60a5fa'; ctx.fillText('Ep', barX + 24, barY - 3);
  }

  // ─── Circuit Simulator ───
  getCircuitRt(): number {
    return this.circuitType === 'series' ? this.circuitR1 + this.circuitR2 : (this.circuitR1 * this.circuitR2) / (this.circuitR1 + this.circuitR2);
  }
  getCircuitI(): number { return this.circuitV / this.getCircuitRt(); }
  getCircuitP(): number { return this.circuitV * this.getCircuitI(); }

  drawCircuit() {
    const canvas = this.circuitCanvasRef?.nativeElement;
    if (!canvas) return;
    const { ctx, w, h } = this.setupHighDpiCanvas(canvas, this.simExpanded ? 740 : 340, this.simExpanded ? 400 : 200);
    ctx.clearRect(0, 0, w, h);
    const lw = 2.5;
    ctx.strokeStyle = '#a78bfa'; ctx.lineWidth = lw;

    ctx.save();
    // Shift coordinate system to center the 340px-wide drawing on larger canvases
    const offsetX = (w - 340) / 2;
    ctx.translate(offsetX, 0);

    if (this.circuitType === 'series') {
      // Series: battery -> R1 -> R2 -> back
      ctx.beginPath();
      ctx.moveTo(30, h / 2); ctx.lineTo(80, h / 2);       // left wire
      ctx.moveTo(80, h / 2 - 20); ctx.lineTo(80, h / 2 + 20); // battery
      ctx.moveTo(80, h / 2); ctx.lineTo(120, h / 2);       // to R1
      ctx.moveTo(120, h / 2 - 15); ctx.lineTo(165, h / 2 - 15); ctx.lineTo(165, h / 2 + 15); ctx.lineTo(120, h / 2 + 15); ctx.closePath(); // R1 box
      ctx.moveTo(165, h / 2); ctx.lineTo(200, h / 2);       // between
      ctx.moveTo(200, h / 2 - 15); ctx.lineTo(245, h / 2 - 15); ctx.lineTo(245, h / 2 + 15); ctx.lineTo(200, h / 2 + 15); ctx.closePath(); // R2 box
      ctx.moveTo(245, h / 2); ctx.lineTo(310, h / 2);       // right wire
      ctx.stroke();
      // Battery symbol
      ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(75, h / 2 - 18); ctx.lineTo(75, h / 2 + 18); ctx.stroke();
      ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(68, h / 2 - 10); ctx.lineTo(68, h / 2 + 10); ctx.stroke();
      // Labels
      this.drawBadge(ctx, 'R₁', 142, h / 2 + 28, '#c4b5fd', 'center');
      this.drawBadge(ctx, `${this.circuitR1}Ω`, 142, h / 2 + 48, '#c4b5fd', 'center');
      this.drawBadge(ctx, 'R₂', 222, h / 2 + 28, '#c4b5fd', 'center');
      this.drawBadge(ctx, `${this.circuitR2}Ω`, 222, h / 2 + 48, '#c4b5fd', 'center');
      this.drawBadge(ctx, `${this.circuitV}V`, 68, h / 2 - 28, '#fbbf24', 'center');
      this.drawBadge(ctx, `I=${this.getCircuitI().toFixed(2)}A`, 170, h - 14, '#4ade80', 'center');
    } else {
      // Parallel
      const lx = 50; const rx = 290; const ty = 50; const by = h - 50;
      const m1y = ty + (by - ty) * 0.33; const m2y = ty + (by - ty) * 0.67;
      ctx.beginPath();
      ctx.moveTo(lx, ty); ctx.lineTo(rx, ty);         // top wire
      ctx.moveTo(lx, by); ctx.lineTo(rx, by);         // bottom wire
      ctx.moveTo(lx, ty); ctx.lineTo(lx, by);          // left wire
      ctx.moveTo(rx, ty); ctx.lineTo(rx, by);           // right wire
      ctx.moveTo(lx, m1y); ctx.lineTo(lx + 50, m1y); ctx.lineTo(lx + 50, m2y); ctx.lineTo(lx, m2y); // R1
      ctx.moveTo(rx - 50, m1y); ctx.lineTo(rx, m1y); ctx.moveTo(rx - 50, m1y); ctx.lineTo(rx - 50, m2y); ctx.lineTo(rx, m2y); // R2 right
      ctx.stroke();
      // Battery
      ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(170 - 5, ty - 5); ctx.lineTo(170 - 5, ty + 5); ctx.stroke();
      ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(170 + 5, ty - 8); ctx.lineTo(170 + 5, ty + 8); ctx.stroke();
      // Labels
      this.drawBadge(ctx, `R₁=${this.circuitR1}Ω`, lx + 25, (m1y + m2y) / 2 + 4, '#c4b5fd', 'center');
      this.drawBadge(ctx, `R₂=${this.circuitR2}Ω`, rx - 25, (m1y + m2y) / 2 + 4, '#c4b5fd', 'center');
      this.drawBadge(ctx, `${this.circuitV}V`, 170, ty - 18, '#fbbf24', 'center');
      this.drawBadge(ctx, `I=${this.getCircuitI().toFixed(2)}A  Rt=${this.getCircuitRt().toFixed(1)}Ω`, 170, by + 18, '#4ade80', 'center');
    }

    ctx.restore();
  }

  // ─── Orbit Simulator ───
  getOrbitVel(): number { return Math.sqrt(this.orbitMassStar / this.orbitRadius) * 10; }
  getOrbitPeriod(): number { return (2 * Math.PI * this.orbitRadius) / this.getOrbitVel(); }

  resetOrbit() {
    this.orbitRunning = false;
    cancelAnimationFrame(this.orbitAnimFrame);
    this.orbitAngle = 0;
    this.drawOrbitFrame();
  }

  toggleOrbit() {
    this.orbitRunning = !this.orbitRunning;
    if (this.orbitRunning) {
      const animate = () => {
        if (!this.orbitRunning) return;
        this.orbitAngle += (this.getOrbitVel() / this.orbitRadius) * 0.3;
        this.drawOrbitFrame();
        this.orbitAnimFrame = requestAnimationFrame(animate);
      }; animate();
    } else { cancelAnimationFrame(this.orbitAnimFrame); }
  }

  private drawOrbitFrame() {
    const canvas = this.orbitCanvasRef?.nativeElement;
    if (!canvas) return;
    const { ctx, w, h } = this.setupHighDpiCanvas(canvas, this.simExpanded ? 740 : 340, this.simExpanded ? 480 : 240);
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2; const cy = h / 2;
    // Stars background
    const starSeeds = [[20, 15], [80, 60], [150, 20], [280, 80], [50, 100], [300, 30], [160, 110]];
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    starSeeds.forEach(([sx, sy]) => { ctx.beginPath(); ctx.arc(sx, sy, 1, 0, Math.PI * 2); ctx.fill(); });
    // Orbit path
    ctx.beginPath(); ctx.arc(cx, cy, this.orbitRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(167,139,250,0.2)'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]);
    // Star (center)
    const starSize = 8 + this.orbitMassStar * 1.5;
    const starGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, starSize);
    starGrad.addColorStop(0, '#fffde7'); starGrad.addColorStop(0.5, '#fbbf24'); starGrad.addColorStop(1, 'rgba(251,191,36,0)');
    ctx.beginPath(); ctx.arc(cx, cy, starSize, 0, Math.PI * 2);
    ctx.fillStyle = starGrad; ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 20; ctx.fill(); ctx.shadowBlur = 0;
    ctx.fillStyle = '#fffde7'; ctx.font = '9px monospace'; ctx.textAlign = 'center'; ctx.fillText('★', cx, cy + 3);
    // Velocity vector trail
    for (let i = 1; i <= 6; i++) {
      const trailAngle = this.orbitAngle - i * 0.12;
      const tx = cx + this.orbitRadius * Math.cos(trailAngle);
      const ty = cy + this.orbitRadius * Math.sin(trailAngle);
      ctx.beginPath(); ctx.arc(tx, ty, 3 - i * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(167,139,250,${0.4 - i * 0.06})`; ctx.fill();
    }
    // Planet
    const px = cx + this.orbitRadius * Math.cos(this.orbitAngle);
    const py = cy + this.orbitRadius * Math.sin(this.orbitAngle);
    const planetGrad = ctx.createRadialGradient(px - 3, py - 3, 1, px, py, 10);
    planetGrad.addColorStop(0, '#c4b5fd'); planetGrad.addColorStop(1, '#4f46e5');
    ctx.beginPath(); ctx.arc(px, py, 10, 0, Math.PI * 2);
    ctx.fillStyle = planetGrad; ctx.shadowColor = '#818cf8'; ctx.shadowBlur = 14; ctx.fill(); ctx.shadowBlur = 0;
    // Velocity arrow
    const velAngle = this.orbitAngle + Math.PI / 2;
    const velLen = 22;
    ctx.strokeStyle = '#4ade80'; ctx.fillStyle = '#4ade80'; ctx.lineWidth = 1.8;
    this.drawArrow(ctx, px, py, px + velLen * Math.cos(velAngle), py + velLen * Math.sin(velAngle));
    this.drawBadge(ctx, 'v', px + velLen * Math.cos(velAngle) + 4, py + velLen * Math.sin(velAngle) + 4, '#4ade80');
    ctx.textAlign = 'left';
  }

  constructor() {
    this.materiaId.set(this.route.snapshot.paramMap.get('materiaId') || '');
    
    // Restaurar posición de scroll al volver a la ruta
    setTimeout(() => {
      const savedScroll = sessionStorage.getItem('ruta_scroll_' + this.materiaId());
      if (savedScroll) {
        window.scrollTo({ top: parseInt(savedScroll, 10), behavior: 'instant' });
        sessionStorage.removeItem('ruta_scroll_' + this.materiaId());
      }
    }, 50);
  }

  getOffset(index: number): number {
    return this.offsets[index % this.offsets.length];
  }

  getAccordionZigzag(rowIndex: number): number {
    const arr = [0, -40, -70, -40, 0, 40, 70, 40];
    return arr[rowIndex % arr.length];
  }



  getNodeTransform(item: any, nodeIndex: number): string {
    if (!this.hasTreeLayout() && item.nodes!.length === 1) {
      if (item.isCentered) return 'none';
      return `translateX(${this.getOffset(item.rowIndex!)}px)`;
    }
    if (item.nodes!.length === 1) return 'none';
    // For 2 nodes (double branch): always symmetric, no zigzag
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
    if (!this.hasTreeLayout() && item.nodes!.length === 1) {
      if (item.isCentered) return [0];
      return [this.getOffset(item.rowIndex!)];
    }
    if (item.nodes!.length === 1) return [0];
    // For 2 nodes (double branch): always symmetric at ±140px
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

  getChapterConnections(index: number): { d: string, color: string, dasharray?: string }[] {
    const items = this.pathItems();
    const item = items[index];
    if (item.type !== 'chapter') return [];

    const nextItem = items[index + 1];
    if (!nextItem || nextItem.type !== 'node-row') return [];

    const endOffsets = this.getOffsetsForNodes(nextItem);

    const height = 148;
    const isCompleted = this.isGuideCompleted(item.capituloId);

    return endOffsets.map(x2 => {
      const d = `M 0 0 C 0 ${height * 0.35}, ${x2} ${height * 0.65}, ${x2} ${height}`;
      return { d, color: isCompleted ? '#dc2626' : '#e5e5e5', dasharray: isCompleted ? 'none' : '8 8' };
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

    const getColor = (sourceOffset: number) => {
      const node = item.nodes!.find((n: any, idx: number) => {
        if (item.nodes!.length === 1) return true;
        if (item.nodes!.length === 2) return (idx === 0 && sourceOffset < 0) || (idx === 1 && sourceOffset > 0);
        if (item.nodes!.length === 3) return (idx === 0 && sourceOffset < -100) || (idx === 1 && sourceOffset === 0) || (idx === 2 && sourceOffset > 100);
        return false;
      });
      return node?.status === 'completed' ? '#dc2626' : '#e5e5e5';
    };

    const getDash = (sourceOffset: number) => {
      return getColor(sourceOffset) === '#dc2626' ? 'none' : '8 8';
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
        ? [...cap.secciones]
            .filter(sec => !(sec as any).isSlideGuide)
            .sort((a, b) => {
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
      const lastSectionId = sortedSecciones.length > 0 ? sortedSecciones[sortedSecciones.length - 1].id : null;

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
            isBoss: sec.id === lastSectionId,
            isProTip: sec.isProTip,
            isPractice: sec.isPractice
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
    sessionStorage.setItem('ruta_scroll_' + this.materiaId(), String(window.scrollY));
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
    sessionStorage.setItem('ruta_scroll_' + this.materiaId(), String(window.scrollY));
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

  confirmLogout() {
    this.showLogoutConfirm = true;
  }

  
  // ═══ CALORIMETRY SIMULATOR ═══
  drawCalorimetry() {
    this.calTeq = (this.calMass1 * this.calTemp1 + this.calMass2 * this.calTemp2) / (this.calMass1 + this.calMass2);
    if (!this.calorimetryCanvasRef) {
      setTimeout(() => this.drawCalorimetry(), 50);
      return;
    }
    const canvas = this.calorimetryCanvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if(!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width * 2) {
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      ctx.scale(2, 2);
    }
    
    const w = rect.width || canvas.width/2 || 600;
    const h = rect.height || canvas.height/2 || 300;
    
    ctx.clearRect(0, 0, w, h);
    
    const drawBeaker = (x: number, y: number, width: number, height: number, mass: number, temp: number, label: string) => {
      const r = Math.min(255, Math.max(0, (temp/100) * 255));
      const b = Math.min(255, Math.max(0, 255 - (temp/100) * 255));
      const color = `rgba(${r}, 50, ${b}, 0.8)`;
      
      const fillHeight = (mass / 500) * (height - 20) + 10;
      
      ctx.fillStyle = color;
      ctx.fillRect(x + 5, y + height - fillHeight - 5, width - 10, fillHeight);
      
      ctx.strokeStyle = 'rgba(255,255,255,0.8)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + height);
      ctx.lineTo(x + width, y + height);
      ctx.lineTo(x + width, y);
      ctx.stroke();
      
      ctx.fillStyle = '#fff';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${mass}g a ${temp}°C`, x + width/2, y + height + 20);
      ctx.fillText(label, x + width/2, y - 10);
    };
    
    drawBeaker(w*0.1, h*0.2, 80, 100, this.calMass1, this.calTemp1, "Sustancia 1");
    drawBeaker(w*0.75, h*0.2, 80, 100, this.calMass2, this.calTemp2, "Sustancia 2");
    
    drawBeaker(w*0.35, h*0.4, 150, 150, this.calMass1 + this.calMass2, this.calTeq, "Mezcla (Equilibrio)");
    
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(w*0.1 + 40, h*0.2 + 130);
    ctx.lineTo(w*0.35 + 30, h*0.4 + 20);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(w*0.75 + 40, h*0.2 + 130);
    ctx.lineTo(w*0.35 + 120, h*0.4 + 20);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // ═══ OPTICS SIMULATOR ═══
  getOpticsDi() {
    if (this.optDist === this.optFocal) return 9999;
    return 1 / (1/this.optFocal - 1/this.optDist);
  }
  
  getOpticsM() {
    return -this.getOpticsDi() / this.optDist;
  }
  
  getOpticsHi() {
    return this.getOpticsM() * this.optHeight;
  }

  drawOptics() {
    if (!this.opticsCanvasRef) {
      setTimeout(() => this.drawOptics(), 50);
      return;
    }
    const canvas = this.opticsCanvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if(!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width * 2) {
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      ctx.scale(2, 2);
    }
    
    const w = rect.width || canvas.width/2 || 600;
    const h = rect.height || canvas.height/2 || 300;
    const cy = h / 2;
    const cx = w / 2;
    
    ctx.clearRect(0, 0, w, h);
    
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.stroke();
    ctx.setLineDash([]);
    
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 100);
    ctx.lineTo(cx, cy + 100);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 10, cy - 90); ctx.lineTo(cx, cy - 100); ctx.lineTo(cx + 10, cy - 90);
    ctx.moveTo(cx - 10, cy + 90); ctx.lineTo(cx, cy + 100); ctx.lineTo(cx + 10, cy + 90);
    ctx.stroke();
    
    const pxToCm = 1.5;
    const fpX = this.optFocal * pxToCm;
    ctx.fillStyle = '#ff3b30';
    ctx.beginPath(); ctx.arc(cx - fpX, cy, 4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + fpX, cy, 4, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '12px sans-serif';
    ctx.fillText("F", cx - fpX - 5, cy + 15);
    ctx.fillText("F'", cx + fpX - 5, cy + 15);
    
    const doX = cx - (this.optDist * pxToCm);
    const hoY = cy - (this.optHeight * pxToCm);
    
    const drawArrow = (x: number, yEnd: number, color: string, label: string) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x, cy);
      ctx.lineTo(x, yEnd);
      ctx.stroke();
      ctx.fillStyle = color;
      ctx.beginPath();
      const dir = yEnd < cy ? 1 : -1;
      ctx.moveTo(x, yEnd);
      ctx.lineTo(x - 6, yEnd + 8 * dir);
      ctx.lineTo(x + 6, yEnd + 8 * dir);
      ctx.fill();
      ctx.fillText(label, x + 10, yEnd + 10 * dir);
    };
    
    drawArrow(doX, hoY, '#ffc800', 'Obj');
    
    const di = this.getOpticsDi();
    const hi = this.getOpticsHi();
    const diX = cx + (di * pxToCm);
    const hiY = cy - (hi * pxToCm);
    
    ctx.strokeStyle = 'rgba(255, 200, 0, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(doX, hoY);
    ctx.lineTo(cx, hoY);
    if (di > 0 && di < 9999) {
      ctx.lineTo(diX, hiY);
    } else {
      ctx.lineTo(cx + fpX*2, cy - (hoY - cy));
    }
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(doX, hoY);
    if (di > 0 && di < 9999) {
      ctx.lineTo(diX, hiY);
    } else {
      ctx.lineTo(cx + (cx-doX), cy + (cy-hoY));
    }
    ctx.stroke();
    
    if (di > 0 && di < 9999) {
      drawArrow(diX, hiY, '#00ff66', 'Img');
    } else if (di < 0) {
      ctx.setLineDash([5,5]);
      ctx.beginPath();
      ctx.moveTo(cx, hoY);
      ctx.lineTo(diX, hiY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(diX, hiY);
      ctx.stroke();
      ctx.setLineDash([]);
      drawArrow(diX, hiY, '#00ff66', 'Img (Virtual)');
    }
  }

  // ═══ FARADAY SIMULATOR ═══
  resetFaraday() {
    this.faraRunning = false;
    if (this.faraAnimReq) cancelAnimationFrame(this.faraAnimReq);
    this.faraMagnetX = 0;
    this.faraMagnetDir = 1;
    this.faraFlux = 0;
    this.faraEmf = 0;
    this.drawFaraday();
  }

  toggleFaraday() {
    if (this.faraRunning) {
      this.faraRunning = false;
      cancelAnimationFrame(this.faraAnimReq);
    } else {
      this.faraRunning = true;
      this.faraMagnetX = 0;
      this.faraMagnetDir = 1;
      this.animateFaraday();
    }
  }

  animateFaraday = () => {
    if (!this.faraRunning) return;
    
    const canvas = this.faradayCanvasRef?.nativeElement;
    const w = canvas ? canvas.getBoundingClientRect().width : 600;
    const coilX = w / 2;
    const margin = 50;
    
    const prevFlux = this.faraFlux;
    
    this.faraMagnetX += this.faraSpeed * this.faraMagnetDir * 2;
    
    if (this.faraMagnetX > w - margin) {
      this.faraMagnetX = w - margin;
      this.faraMagnetDir = -1;
    } else if (this.faraMagnetX < margin) {
      this.faraMagnetX = margin;
      this.faraMagnetDir = 1;
    }
    
    const distance = Math.abs(this.faraMagnetX - coilX);
    const B = 100 * Math.exp(-(distance * distance) / 10000);
    this.faraFlux = B * this.faraArea;
    
    this.faraEmf = -this.faraN * (this.faraFlux - prevFlux);
    
    this.drawFaraday();
    this.faraAnimReq = requestAnimationFrame(this.animateFaraday);
  };

  drawFaraday() {
    if (!this.faradayCanvasRef) {
      setTimeout(() => this.drawFaraday(), 50);
      return;
    }
    const canvas = this.faradayCanvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if(!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width * 2) {
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      ctx.scale(2, 2);
    }
    
    const w = rect.width || canvas.width/2 || 600;
    const h = rect.height || canvas.height/2 || 300;
    const cy = h / 2;
    const cx = w / 2;
    
    ctx.clearRect(0, 0, w, h);
    
    if (!this.faraRunning && this.faraMagnetX === 0) {
       this.faraMagnetX = w * 0.2;
    }
    
    ctx.fillStyle = '#222';
    ctx.beginPath(); ctx.arc(cx, cy - 80, 40, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#555'; ctx.lineWidth = 4; ctx.stroke();
    
    ctx.strokeStyle = '#ff3b30';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 60);
    const angle = (this.faraEmf / 50) * (Math.PI / 4);
    const clampedAngle = Math.max(-Math.PI/2, Math.min(Math.PI/2, angle));
    ctx.lineTo(cx + Math.sin(clampedAngle) * 35, cy - 60 - Math.cos(clampedAngle) * 35);
    ctx.stroke();
    
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx - 20, cy - 50); ctx.lineTo(cx - 40, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + 20, cy - 50); ctx.lineTo(cx + 40, cy); ctx.stroke();
    
    ctx.strokeStyle = '#ffc800';
    ctx.lineWidth = 4;
    for (let i = 0; i < this.faraN; i++) {
        ctx.beginPath();
        const offsetX = cx - (this.faraN * 5) + (i * 10);
        const radiusY = 30 + (this.faraArea);
        ctx.ellipse(offsetX, cy, 15, radiusY, 0, 0, Math.PI*2);
        ctx.stroke();
    }
    
    const magW = 60;
    const magH = 30;
    ctx.fillStyle = '#ff3b30';
    ctx.fillRect(this.faraMagnetX - magW/2, cy - magH/2, magW/2, magH);
    ctx.fillStyle = '#00e5ff';
    ctx.fillRect(this.faraMagnetX, cy - magH/2, magW/2, magH);
    ctx.fillStyle = '#fff';
    ctx.font = '14px sans-serif';
    ctx.fillText('N', this.faraMagnetX - magW/4 - 5, cy + 5);
    ctx.fillText('S', this.faraMagnetX + magW/4 - 5, cy + 5);
    
    ctx.strokeStyle = 'rgba(255, 59, 48, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.faraMagnetX - magW/2, cy);
    ctx.lineTo(this.faraMagnetX - magW, cy);
    ctx.stroke();
    
    if (Math.abs(this.faraEmf) > 0.1) {
       ctx.fillStyle = '#00ff66';
       ctx.font = 'bold 20px sans-serif';
       ctx.fillText(`ε = ${this.faraEmf.toFixed(1)} V`, cx - 30, cy + 70);
       
       ctx.strokeStyle = '#00ff66';
       ctx.lineWidth = 3;
       ctx.beginPath();
       if (this.faraEmf > 0) {
           ctx.moveTo(cx - 30, cy + 30); ctx.lineTo(cx - 10, cy + 30);
           ctx.lineTo(cx - 15, cy + 25);
       } else {
           ctx.moveTo(cx + 30, cy + 30); ctx.lineTo(cx + 10, cy + 30);
           ctx.lineTo(cx + 15, cy + 25);
       }
       ctx.stroke();
    }
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
