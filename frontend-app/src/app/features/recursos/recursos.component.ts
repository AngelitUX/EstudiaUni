import { Component, inject, computed, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from '../../core/services/auth.service';
import { FirestoreService } from '../../core/services/firestore.service';
import { SettingsModalComponent } from '../profile/settings-modal.component';
import { ProfileModalComponent } from '../profile/profile-modal.component';
import { AdminService } from '../admin/services/admin.service';
import { RecursosService, Recurso } from './recursos.service';
import { PaymentService } from '../../core/services/payment.service';
import { StreakIconComponent } from '../../shared/components/streak-icon.component';

@Component({
  selector: 'app-recursos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SettingsModalComponent, ProfileModalComponent, StreakIconComponent],
  template: `
    <div class="app-layout">
      <!-- SIDEBAR -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <a routerLink="/dashboard" class="sidebar-logo" style="text-decoration:none; display: flex; align-items: center; justify-content: center;">
            <img [src]="(isProPlan() || adminService.isAdmin()) ? 'https://res.cloudinary.com/dqm3syhwr/image/upload/f_auto,q_auto/v1/imagenes/branding/LogoEstudiaUniPREMIUM' : 'https://res.cloudinary.com/dqm3syhwr/image/upload/f_auto,q_auto/v1/imagenes/branding/LogoEstudiaUni'" alt="EstudiaUni" class="sidebar-logo-img" />
          </a>
        </div>
        <nav class="sidebar-nav">
          <a class="nav-item" routerLink="/dashboard"><img decoding="async" src="assets/images/Nuevos VideosEIlustraciones/IconosAVIF/P_Inicio.avif" alt="Inicio" class="nav-icon-img"/><span class="nav-text">Inicio</span></a>
          <a class="nav-item" routerLink="/ruta"><img decoding="async" src="assets/images/Nuevos VideosEIlustraciones/IconosAVIF/P_RutaDeAprendizaje.avif" alt="Ruta de Aprendizaje" class="nav-icon-img"/><span class="nav-text">Ruta de Aprendizaje</span></a>
          <a class="nav-item" routerLink="/ensayos"><img decoding="async" src="assets/images/Nuevos VideosEIlustraciones/IconosAVIF/P_EnsayosPaes.avif" alt="Ensayos PAES" class="nav-icon-img"/><span class="nav-text">Ensayos PAES</span></a>
          <a class="nav-item" routerLink="/mini-ensayo"><img decoding="async" src="assets/images/Nuevos VideosEIlustraciones/IconosAVIF/P_MiniEnsayos.avif" alt="Mini Ensayos" class="nav-icon-img"/><span class="nav-text">Mini Ensayos</span></a>
          <a class="nav-item" routerLink="/mente-veloz"><img decoding="async" src="assets/images/Nuevos VideosEIlustraciones/IconosAVIF/P_MenteVeloz.avif" alt="Mente Veloz" class="nav-icon-img"/><span class="nav-text">Mente Veloz</span></a>
          
          <div class="sidebar-section-title" (click)="toggleHerramientas()">
            HERRAMIENTAS
            <span class="toggle-icon" [style.transform]="herramientasExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'">▼</span>
          </div>
          <div class="sidebar-sub-items" [class.expanded]="herramientasExpanded" [class.collapsible]="isCollapsible">
            <a class="nav-item" routerLink="/encuentra-tu-carrera"><img decoding="async" src="assets/images/Nuevos VideosEIlustraciones/IconosAVIF/P_EnncuentraTuCarrera.avif" alt="Encuentra tu Carrera" class="nav-icon-img"/><span class="nav-text">Encuentra tu Carrera</span></a>
            <a class="nav-item" routerLink="/calculadora-nem"><img decoding="async" src="assets/images/Nuevos VideosEIlustraciones/IconosAVIF/P_CalculadoraNEM.avif" alt="Calculadora NEM" class="nav-icon-img"/><span class="nav-text">Calculadora NEM</span></a>
            <a class="nav-item active" routerLink="/recursos"><img decoding="async" src="assets/images/Nuevos VideosEIlustraciones/IconosAVIF/P_RecursosAdicionales.avif" alt="Recursos Adicionales" class="nav-icon-img"/><span class="nav-text">Recursos Adicionales</span></a>
          </div>
          <!-- Sidebar Promo Card -->
          <div *ngIf="!isProPlan() && !adminService.isAdmin()" class="sidebar-promo-card">
            <img src="assets/images/Nuevos VideosEIlustraciones/IconosAVIF/P_Pro.avif" alt="PRO" class="promo-crown"/>
            <h4>Pásate a PRO</h4>
            <p>Explicaciones con IA y Ensayos Ilimitados</p>
            <button class="btn-promo-sidebar">Ver Planes ⚡</button>
          </div>
        </nav>
        <div class="sidebar-footer" style="flex-direction: column; gap: 0.5rem; padding: 1.25rem 0.75rem;">
          <a class="nav-item" (click)="showSettingsModal = true">
            <img decoding="async" src="assets/images/Nuevos VideosEIlustraciones/IconosAVIF/P_Configuracion.avif" alt="Configuración" class="nav-icon-img nav-icon-img-config"/>
            <span class="nav-text">Configuración</span>
          </a>
          <a class="nav-item logout-btn-sidebar" (click)="confirmLogout()">
            <img decoding="async" src="assets/images/Nuevos VideosEIlustraciones/IconosAVIF/P_CerrarSesion.avif" alt="Cerrar Sesión" class="nav-icon-img"/>
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
              <img *ngIf="firestoreService.profileSignal()?.photoURL; else avatarMobileNav" [src]="firestoreService.profileSignal()?.photoURL" alt="Foto" class="profile-avatar" style="width:32px;height:32px" [class.avatar-preset]="(firestoreService.profileSignal()?.photoURL || '').includes('assets/images/avatars/')"/>
              <ng-template #avatarMobileNav><span class="profile-avatar fallback" style="width:32px;height:32px;font-size:0.9rem">{{ profileInitial() }}</span></ng-template>
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
            <a class="nav-item" routerLink="/dashboard" (click)="mobileOpen=false"><img decoding="async" src="assets/images/Nuevos VideosEIlustraciones/IconosAVIF/P_Inicio.avif" alt="Inicio" class="nav-icon-img"/><span class="nav-text">Inicio</span></a>
            <a class="nav-item" routerLink="/ruta" (click)="mobileOpen=false"><img decoding="async" src="assets/images/Nuevos VideosEIlustraciones/IconosAVIF/P_RutaDeAprendizaje.avif" alt="Ruta de Aprendizaje" class="nav-icon-img"/><span class="nav-text">Ruta de Aprendizaje</span></a>
            <a class="nav-item" routerLink="/ensayos" (click)="mobileOpen=false"><img decoding="async" src="assets/images/Nuevos VideosEIlustraciones/IconosAVIF/P_EnsayosPaes.avif" alt="Ensayos PAES" class="nav-icon-img"/><span class="nav-text">Ensayos PAES</span></a>
            <a class="nav-item" routerLink="/mini-ensayo" (click)="mobileOpen=false"><img decoding="async" src="assets/images/Nuevos VideosEIlustraciones/IconosAVIF/P_MiniEnsayos.avif" alt="Mini Ensayos" class="nav-icon-img"/><span class="nav-text">Mini Ensayos</span></a>
            <a class="nav-item" routerLink="/mente-veloz" (click)="mobileOpen=false"><img decoding="async" src="assets/images/Nuevos VideosEIlustraciones/IconosAVIF/P_MenteVeloz.avif" alt="Mente Veloz" class="nav-icon-img"/><span class="nav-text">Mente Veloz</span></a>
            
            <div class="sidebar-section-title" (click)="toggleHerramientas()">
              HERRAMIENTAS
              <span class="toggle-icon" [style.transform]="herramientasExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'">▼</span>
            </div>
            <div class="sidebar-sub-items" [class.expanded]="herramientasExpanded" [class.collapsible]="isCollapsible">
              <a class="nav-item" routerLink="/encuentra-tu-carrera" (click)="mobileOpen=false"><img decoding="async" src="assets/images/Nuevos VideosEIlustraciones/IconosAVIF/P_EnncuentraTuCarrera.avif" alt="Encuentra tu Carrera" class="nav-icon-img"/><span class="nav-text">Encuentra tu Carrera</span></a>
              <a class="nav-item" routerLink="/calculadora-nem" (click)="mobileOpen=false"><img decoding="async" src="assets/images/Nuevos VideosEIlustraciones/IconosAVIF/P_CalculadoraNEM.avif" alt="Calculadora NEM" class="nav-icon-img"/><span class="nav-text">Calculadora NEM</span></a>
              <a class="nav-item active" routerLink="/recursos" (click)="mobileOpen=false"><img decoding="async" src="assets/images/Nuevos VideosEIlustraciones/IconosAVIF/P_RecursosAdicionales.avif" alt="Recursos Adicionales" class="nav-icon-img"/><span class="nav-text">Recursos Adicionales</span></a>
            </div>
          </nav>
          <div class="mobile-footer" style="padding: 1rem; border-top: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; gap: 0.5rem;">
            <a class="nav-item" (click)="showSettingsModal = true; mobileOpen=false">
              <img decoding="async" src="assets/images/Nuevos VideosEIlustraciones/IconosAVIF/P_Configuracion.avif" alt="Configuración" class="nav-icon-img nav-icon-img-config"/>
              <span class="nav-text">Configuración</span>
            </a>
            <a class="nav-item logout-btn-sidebar" (click)="confirmLogout(); mobileOpen=false">
              <img decoding="async" src="assets/images/Nuevos VideosEIlustraciones/IconosAVIF/P_CerrarSesion.avif" alt="Cerrar Sesión" class="nav-icon-img"/>
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
            <h1 class="header-greeting"><span class="text-gradient">Recursos Adicionales</span></h1>
            <p class="subtitle" style="color: rgba(255,255,255,0.7); font-size: 0.95rem; margin: 0; font-weight: 500;">Explora material de estudio, guías, videos y más para complementar tu preparación.</p>
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

        <div class="dashboard-body" style="position: relative; min-height: 500px;">
          <!-- COMING SOON OVERLAY -->
          <div *ngIf="!adminService.isAdmin()" class="coming-soon-overlay" style="position: absolute; inset: 0; z-index: 10; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(6px); background: rgba(248, 250, 252, 0.5); border-radius: 12px; margin: 0 -1rem;">
            <div class="glass-card" style="text-align: center; max-width: 400px; padding: 2.5rem; border: 1px solid rgba(139, 92, 246, 0.2); box-shadow: 0 20px 40px rgba(0,0,0,0.1); background: rgba(255, 255, 255, 0.9);">
              <img src="assets/images/Nuevos VideosEIlustraciones/IconosAVIF/P_Temporizador.avif" alt="Próximamente" style="width: 100px; height: 100px; object-fit: contain; display: block; margin: 0 auto 1rem; animation: scaleUp 0.5s ease-out;"/>
              <h2 style="font-size: 1.8rem; font-weight: 800; color: #1e293b; margin-bottom: 0.5rem;">¡Próximamente!</h2>
              <p style="color: #475569; font-size: 1rem; line-height: 1.5; margin: 0;">Estamos recolectando y preparando el mejor material de estudio. ¡Vuelve muy pronto!</p>
            </div>
          </div>
          
          <div *ngIf="adminService.isAdmin()">
        <!-- FILTERS -->
        <div class="filters-container glass-card">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <label for="recursos-search" class="visually-hidden">Buscar recursos</label>
            <input id="recursos-search" type="text" [ngModel]="searchTerm()" (ngModelChange)="searchTerm.set($event)" placeholder="Buscar por título, categoría, capítulo o etiqueta...">
          </div>

          <div class="filter-actions">
            <div class="filter-group">
              <label for="recursos-filter-categoria">Categoría (Materia):</label>
              <select id="recursos-filter-categoria" [ngModel]="selectedCategoria()" (ngModelChange)="onCategoriaFilterChange($event)">
                <option value="all">Todas</option>
                <option *ngFor="let cat of categoriasDisponibles()" [value]="cat">{{ cat }}</option>
              </select>
            </div>

            <div class="filter-group" *ngIf="subcategoriasDisponibles().length > 0">
              <label for="recursos-filter-subcategoria">Subcategoría (Capítulo):</label>
              <select id="recursos-filter-subcategoria" [ngModel]="selectedSubcategoria()" (ngModelChange)="selectedSubcategoria.set($event)">
                <option value="all">Todas</option>
                <option *ngFor="let sub of subcategoriasDisponibles()" [value]="sub">{{ sub }}</option>
              </select>
            </div>

            <div class="filter-group">
              <label for="recursos-filter-tipo">Tipo:</label>
              <select id="recursos-filter-tipo" [ngModel]="selectedTipo()" (ngModelChange)="selectedTipo.set($event)">
                <option value="all">Todos</option>
                <option value="pdf">PDFs y Guías</option>
                <option value="video">Videos</option>
                <option value="ensayo">Ensayos</option>
                <option value="libro">Libros</option>
                <option value="link">Enlaces</option>
                <option value="otro">Otros</option>
              </select>
            </div>
          </div>
        </div>

        <!-- CONTENT GRID -->
        <div *ngIf="recursosService.loading()" class="loading-state">
          <div class="loader"></div>
          <p>Cargando recursos...</p>
        </div>

        <div *ngIf="!recursosService.loading() && filteredRecursos().length === 0" class="empty-state glass-card">
          <div class="empty-icon">🏜️</div>
          <h3>No se encontraron recursos</h3>
          <p>Intenta ajustar tus filtros de búsqueda.</p>
          <button class="btn btn-outline" (click)="clearFilters()" style="margin-top: 1rem;">Limpiar Filtros</button>
        </div>

        <div *ngIf="!recursosService.loading() && filteredRecursos().length > 0" class="recursos-categories-container">
          <div class="materia-section" *ngFor="let materia of categoriasList()">
            <div class="materia-header">
              <span class="materia-icon">📚</span>
              <h2>{{ materia }}</h2>
              <span class="materia-count">{{ recursosGroupedByMateria()[materia].length }} {{ recursosGroupedByMateria()[materia].length === 1 ? 'recurso' : 'recursos' }}</span>
            </div>
            
            <div class="recursos-grid">
              <div class="recurso-card glass-card" *ngFor="let recurso of recursosGroupedByMateria()[materia]">
                <div class="card-top" style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; width: 100%;">
                  <div class="recurso-icon-wrapper" [ngClass]="recurso.tipo">
                    <span class="r-icon">{{ getIconForTipo(recurso.tipo) }}</span>
                  </div>
                  <div style="display: flex; gap: 0.35rem; align-items: center;">
                    <span *ngIf="recurso.subcategoria" class="badge-categoria" style="background: rgba(133,92,214,0.06); border-color: rgba(133,92,214,0.25); color: var(--accent-primary); font-size: 0.65rem;">
                      🏷️ {{ recurso.subcategoria }}
                    </span>
                    <span class="badge-categoria">{{ recurso.tipo | uppercase }}</span>
                  </div>
                </div>
                
                <!-- INLINE PREVIEW THUMBNAIL -->
                <div class="recurso-preview-thumbnail" [ngClass]="recurso.tipo">
                  <!-- PDF Mock -->
                  <div *ngIf="recurso.tipo === 'pdf'" class="thumbnail-pdf">
                    <div class="sheet">
                      <div class="line title"></div>
                      <div class="line short"></div>
                      <div class="line long"></div>
                      <div class="line medium"></div>
                      <div class="chart-mock"></div>
                    </div>
                    <div class="sheet-back"></div>
                    <span class="pages-badge">📄 3 Págs</span>
                  </div>
                  
                  <!-- Video Mock -->
                  <div *ngIf="recurso.tipo === 'video'" class="thumbnail-video" [style.background-image]="getVideoThumbnail(recurso.url) ? 'url(' + getVideoThumbnail(recurso.url) + ')' : null" style="background-size: cover; background-position: center; width: 100%; height: 100%;">
                    <div class="play-overlay" style="background: rgba(0, 0, 0, 0.4);">
                      <span class="play-icon">▶</span>
                    </div>
                    <div class="duration-badge">3:00</div>
                    <div class="video-bar">
                      <div class="progress" style="width: 35%;"></div>
                    </div>
                  </div>
                  
                  <!-- Libro Mock -->
                  <div *ngIf="recurso.tipo === 'libro'" class="thumbnail-libro">
                    <div class="book-spine"></div>
                    <div class="book-cover">
                      <span class="book-title">{{ recurso.titulo }}</span>
                      <span class="book-author">EstudiaUni Editorial</span>
                    </div>
                  </div>
                  
                  <!-- Ensayo Mock -->
                  <div *ngIf="recurso.tipo === 'ensayo'" class="thumbnail-ensayo">
                    <div class="quiz-item">
                      <div class="quiz-q">Ensayo de Diagnóstico</div>
                      <div class="quiz-opts">
                        <div class="opt-circle active">A</div>
                        <div class="opt-circle">B</div>
                        <div class="opt-circle">C</div>
                        <div class="opt-circle">D</div>
                      </div>
                    </div>
                    <div class="timer-badge">⏳ 3 Preguntas</div>
                  </div>
                  
                  <!-- Link Mock -->
                  <div *ngIf="recurso.tipo === 'link'" class="thumbnail-link">
                    <div class="browser-bar">
                      <div class="dots"><span class="r"></span><span class="y"></span><span class="g"></span></div>
                      <div class="address-bar">estudiauni.cl/enlace</div>
                    </div>
                    <div class="browser-body">
                      <div class="line title"></div>
                      <div class="blocks">
                        <div class="block"></div>
                        <div class="block"></div>
                      </div>
                    </div>
                  </div>

                  <!-- Otro Mock -->
                  <div *ngIf="recurso.tipo === 'otro'" class="thumbnail-otro">
                    <span class="otro-icon">📁</span>
                    <span class="otro-label">Recurso Adicional</span>
                  </div>
                </div>
                
                <h3 class="recurso-title">{{ recurso.titulo }}</h3>
                <p class="recurso-desc">{{ recurso.descripcion }}</p>
                
                <div class="recurso-tags">
                  <span class="tag" *ngFor="let tag of recurso.etiquetas">#{{ tag }}</span>
                </div>
                
                <div class="card-bottom" style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem;">
                  <button type="button" class="btn-action-preview" (click)="openPreview(recurso, $event)">
                    👁️ Vista Previa
                  </button>
                  <button type="button" class="btn-action" (click)="ejecutarAccionRecurso(recurso, $event)">
                    {{ getActionTextForTipo(recurso.tipo) }} <span class="arrow">→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
          </div> <!-- close pointer events wrapper -->
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
            <img src="assets/images/Nuevos VideosEIlustraciones/IconosAVIF/P_CerrarSesion.avif" alt="Cerrar Sesion" class="confirm-icon confirm-icon-img"/>
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

    <!-- PREMIUM INTERACTIVE PREVIEW MODAL -->
    <div class="modal-overlay preview-overlay animate-fade-in" *ngIf="selectedPreviewRecurso()" (click)="closePreviewModal()">
      <div class="modal-container preview-modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="header-title-wrap">
            <span class="preview-type-badge" [ngClass]="selectedPreviewRecurso()?.tipo">
              {{ getIconForTipo(selectedPreviewRecurso()!.tipo) }} {{ selectedPreviewRecurso()!.tipo | uppercase }}
            </span>
            <h2 class="preview-modal-title">{{ selectedPreviewRecurso()!.titulo }}</h2>
          </div>
          <button class="close-btn" (click)="closePreviewModal()">&times;</button>
        </div>
        
        <div class="modal-body preview-body-container">
          <!-- PDF INTERACTIVE VIEW -->
          <div *ngIf="selectedPreviewRecurso()!.tipo === 'pdf'" class="interactive-preview pdf-preview-container">
            <!-- REAL PDF EMBED -->
            <div *ngIf="selectedPreviewRecurso()!.url !== '#'" class="real-pdf-viewer" style="width: 100%;">
              <div class="real-pdf-alert" style="display: flex; gap: 0.85rem; padding: 0.85rem 1.1rem; border-radius: 10px; background: rgba(28, 176, 246, 0.06); border-left: 4px solid #1cb0f6; margin-bottom: 1rem;">
                <span class="alert-icon" style="font-size: 1.25rem;">📄</span>
                <div class="alert-text">
                  <h4 style="margin: 0; font-size: 0.9rem; font-weight: 800; color: var(--text-primary);">Visualizando Documento Real</h4>
                  <p style="margin: 0.2rem 0 0; font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4;">A continuación se muestran las páginas reales del recurso de estudio. Puedes desplazarte, hacer zoom o descargarlo directamente.</p>
                </div>
              </div>
              <iframe [src]="getSafeUrl(selectedPreviewRecurso()!.url)" class="pdf-iframe-embed" width="100%" height="650px" style="border: none; border-radius: 12px; box-shadow: var(--shadow-sm);"></iframe>
            </div>

            <!-- MOCK PDF VIEWER FALLBACK -->
            <div *ngIf="selectedPreviewRecurso()!.url === '#'" style="width: 100%;">
              <div class="viewer-toolbar">
                <button class="toolbar-btn" [disabled]="pdfCurrentPage === 1" (click)="prevPdfPage()">◀ Anterior</button>
                <span class="page-indicator">Página {{ pdfCurrentPage }} de 3</span>
                <button class="toolbar-btn" [disabled]="pdfCurrentPage === 3" (click)="nextPdfPage()">Siguiente ▶</button>
              </div>
              
              <div class="pdf-page-mock animate-fade-in">
                <div class="pdf-page-header">
                  <span class="logo-text">EstudiaUni Materiales</span>
                  <span class="doc-title">{{ selectedPreviewRecurso()!.categoria }}</span>
                </div>
                
                <div class="pdf-page-content">
                  <h3 class="page-title">{{ getPdfPageContent(selectedPreviewRecurso()!, pdfCurrentPage).title }}</h3>
                  <hr class="doc-divider">
                  <div class="page-body-paragraphs">
                    <p *ngFor="let p of getPdfPageContent(selectedPreviewRecurso()!, pdfCurrentPage).paragraphs" class="doc-text">
                      {{ p }}
                    </p>
                    <ul class="doc-bullets" *ngIf="getPdfPageContent(selectedPreviewRecurso()!, pdfCurrentPage).bullets?.length">
                      <li *ngFor="let b of getPdfPageContent(selectedPreviewRecurso()!, pdfCurrentPage).bullets">
                        <strong>{{ b.label }}:</strong> {{ b.desc }}
                      </li>
                    </ul>
                    <div class="pdf-watermark">Vista Previa - EstudiaUni</div>
                  </div>
                </div>
                <div class="pdf-page-footer">
                  <span>© EstudiaUni 2026</span>
                  <span>Página {{ pdfCurrentPage }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- VIDEO INTERACTIVE VIEW -->
          <div *ngIf="selectedPreviewRecurso()!.tipo === 'video'" class="interactive-preview video-preview-container">
            <!-- REAL YOUTUBE EMBED -->
            <div *ngIf="selectedPreviewRecurso()!.url !== '#' && isYoutubeUrl(selectedPreviewRecurso()!.url)" class="real-video-embed" style="width: 100%;">
              <iframe [src]="getSafeVideoUrl(selectedPreviewRecurso()!.url)" class="video-iframe-embed" width="100%" height="450px" style="border: none; border-radius: 12px; box-shadow: var(--shadow-sm);" allowfullscreen></iframe>
            </div>

            <!-- DIRECT MP4 VIDEO PLAY -->
            <div *ngIf="selectedPreviewRecurso()!.url !== '#' && !isYoutubeUrl(selectedPreviewRecurso()!.url) && selectedPreviewRecurso()!.url.includes('.mp4')" class="real-video-embed" style="width: 100%;">
              <video [src]="selectedPreviewRecurso()!.url" controls class="video-native-embed" width="100%" style="border-radius: 12px; max-height: 450px; background: black;"></video>
            </div>

            <!-- MOCK VIDEO PLAYER FALLBACK -->
            <div *ngIf="selectedPreviewRecurso()!.url === '#' || (!isYoutubeUrl(selectedPreviewRecurso()!.url) && !selectedPreviewRecurso()!.url.includes('.mp4'))" style="width: 100%;">
              <div class="mock-video-player">
                <div class="video-canvas" [class.playing]="videoPlaying">
                  <div class="video-overlay-pulse" *ngIf="!videoPlaying" (click)="togglePlayVideo()">
                    <span class="large-play-icon">▶</span>
                    <span class="play-hint">Haz click para reproducir clase</span>
                  </div>
                  
                  <div class="visual-video-graphic" *ngIf="videoPlaying">
                    <div class="wave-graphic">
                      <span class="bar bar-1"></span>
                      <span class="bar bar-2"></span>
                      <span class="bar bar-3"></span>
                      <span class="bar bar-4"></span>
                      <span class="bar bar-5"></span>
                    </div>
                    <div class="topic-floating-pill">Clase: {{ selectedPreviewRecurso()!.titulo }}</div>
                    <div class="instructor-sub">Instructor EstudiaUni</div>
                  </div>
                  
                  <div class="captions-overlay">
                    <p class="caption-text">{{ currentCaption }}</p>
                  </div>
                </div>
                
                <div class="video-controls">
                  <button class="play-pause-btn" (click)="togglePlayVideo()">
                    {{ videoPlaying ? '⏸ Pausar' : '▶ Reproducir' }}
                  </button>
                  <div class="video-progress-container">
                    <span class="time-label">{{ formatVideoTime(videoTime) }}</span>
                    <div class="video-progress-bar" (click)="seekVideo($event)">
                      <div class="video-progress-fill" [style.width.%]="(videoTime / videoDuration) * 100"></div>
                    </div>
                    <span class="time-label">{{ formatVideoTime(videoDuration) }}</span>
                  </div>
                  <button class="reset-btn" (click)="resetVideo()">🔄 Reiniciar</button>
                </div>
              </div>
              <div class="video-details-card">
                <h4>Transcripción y Notas del Video</h4>
                <p>Este video explica en profundidad los contenidos clave de <strong>{{ selectedPreviewRecurso()!.categoria }}</strong> para la preparación PAES. Reproduce para seguir la explicación del tutor.</p>
              </div>
            </div>
          </div>

          <!-- LIBRO INTERACTIVE VIEW -->
          <div *ngIf="selectedPreviewRecurso()!.tipo === 'libro'" class="interactive-preview book-preview-container">
            <div class="mock-book">
              <!-- Left Page -->
              <div class="book-page left-page">
                <div class="book-page-content">
                  <h4 class="chapter-title">Capítulo {{ bookCurrentPage + 1 }}</h4>
                  <h3 class="page-title">{{ getBookPageContent(selectedPreviewRecurso()!, bookCurrentPage * 2 + 1).title }}</h3>
                  <hr class="doc-divider">
                  <p class="book-text" *ngFor="let p of getBookPageContent(selectedPreviewRecurso()!, bookCurrentPage * 2 + 1).paragraphs">
                    {{ p }}
                  </p>
                </div>
                <span class="page-num">{{ bookCurrentPage * 2 + 1 }}</span>
              </div>
              <!-- Right Page -->
              <div class="book-page right-page">
                <div class="book-page-content">
                  <h3 class="page-title" style="margin-top: 1rem;">{{ getBookPageContent(selectedPreviewRecurso()!, bookCurrentPage * 2 + 2).title }}</h3>
                  <hr class="doc-divider" *ngIf="getBookPageContent(selectedPreviewRecurso()!, bookCurrentPage * 2 + 2).title">
                  <p class="book-text" *ngFor="let p of getBookPageContent(selectedPreviewRecurso()!, bookCurrentPage * 2 + 2).paragraphs">
                    {{ p }}
                  </p>
                  <ul class="book-bullets" *ngIf="getBookPageContent(selectedPreviewRecurso()!, bookCurrentPage * 2 + 2).bullets?.length">
                    <li *ngFor="let b of getBookPageContent(selectedPreviewRecurso()!, bookCurrentPage * 2 + 2).bullets">
                      <strong>{{ b.label }}:</strong> {{ b.desc }}
                    </li>
                  </ul>
                </div>
                <span class="page-num">{{ bookCurrentPage * 2 + 2 }}</span>
              </div>
            </div>
            
            <div class="book-controls">
              <button class="toolbar-btn" [disabled]="bookCurrentPage === 0" (click)="prevBookPage()">◀ Página Anterior</button>
              <span class="page-indicator">Capítulo {{ bookCurrentPage + 1 }}</span>
              <button class="toolbar-btn" [disabled]="bookCurrentPage === 1" (click)="nextBookPage()">Página Siguiente ▶</button>
            </div>
          </div>

          <!-- ENSAYO INTERACTIVE VIEW -->
          <div *ngIf="selectedPreviewRecurso()!.tipo === 'ensayo'" class="interactive-preview quiz-preview-container">
            <div class="quiz-welcome-banner" *ngIf="!quizSubmitted">
              <span class="banner-icon">🎯</span>
              <div class="banner-text">
                <h4>Minicuestionario de Ensayo</h4>
                <p>Prueba tus conocimientos contestando estas 3 preguntas de práctica.</p>
              </div>
            </div>
            
            <div class="quiz-questions-list">
              <div class="quiz-question-card glass-card" *ngFor="let q of quizQuestions; let i = index">
                <div class="question-header">
                  <span class="q-number">Pregunta {{ i + 1 }}</span>
                  <span class="badge-status" *ngIf="quizSubmitted" [ngClass]="quizAnswers[q.id] === q.correct ? 'correct' : 'incorrect'">
                    {{ quizAnswers[q.id] === q.correct ? 'Correcta ✓' : 'Incorrecta ✗' }}
                  </span>
                </div>
                <p class="question-text">{{ q.q }}</p>
                <div class="options-grid">
                  <button 
                    type="button"
                    class="option-row-btn"
                    *ngFor="let key of ['A', 'B', 'C', 'D']"
                    [class.selected]="quizAnswers[q.id] === key"
                    [class.correct-highlight]="quizSubmitted && q.correct === key"
                    [class.incorrect-highlight]="quizSubmitted && quizAnswers[q.id] === key && q.correct !== key"
                    [disabled]="quizSubmitted"
                    (click)="selectQuizAnswer(q.id, key)">
                    <span class="option-letter">{{ key }}</span>
                    <span class="option-desc">{{ $any(q.opts)[key] }}</span>
                  </button>
                </div>
                
                <div class="explanation-box animate-fade-in" *ngIf="quizSubmitted">
                  <span class="exp-title">💡 Explicación:</span>
                  <p class="exp-text">{{ q.exp }}</p>
                </div>
              </div>
            </div>
            
            <div class="quiz-actions-row">
              <button class="btn btn-outline" *ngIf="quizSubmitted" (click)="resetQuiz()">🔄 Reiniciar Cuestionario</button>
              <button class="btn btn-primary" *ngIf="!quizSubmitted" [disabled]="Object.keys(quizAnswers).length < quizQuestions.length" (click)="checkQuizAnswers()">
                ✓ Evaluar Respuestas
              </button>
            </div>
          </div>

          <!-- LINK INTERACTIVE VIEW -->
          <div *ngIf="selectedPreviewRecurso()!.tipo === 'link'" class="interactive-preview browser-preview-container">
            <div class="browser-window-mock">
              <div class="browser-header">
                <div class="window-buttons"><span class="btn-dot r"></span><span class="btn-dot y"></span><span class="btn-dot g"></span></div>
                <div class="browser-address">
                  <span class="lock-icon">🔒</span>
                  <span class="url-text">{{ selectedPreviewRecurso()!.url.startsWith('http') ? selectedPreviewRecurso()!.url : 'https://estudiauni.cl/recursos/' + selectedPreviewRecurso()!.id }}</span>
                </div>
              </div>
              <div class="browser-content-area">
                <div class="site-header-mock">
                  <div class="site-logo">🌐 EstudiaUni Enlaces</div>
                  <div class="site-menu"><span>Inicio</span><span>Recursos</span><span>Acerca</span></div>
                </div>
                <div class="site-body-mock">
                  <span class="mock-globe">🌐</span>
                  <h3>Estás por visitar un portal de estudio externo</h3>
                  <p class="site-intro">
                    Este enlace te redirigirá a <strong>{{ selectedPreviewRecurso()!.titulo }}</strong>, una plataforma externa recomendada por nuestro equipo docente para ampliar tus conocimientos.
                  </p>
                  <div class="features-list-mock">
                    <div class="feat"><span class="tick">✓</span> Material verificado y confiable</div>
                    <div class="feat"><span class="tick">✓</span> Sin publicidad intrusiva</div>
                    <div class="feat"><span class="tick">✓</span> Complemento perfecto para la PAES</div>
                  </div>
                  <a [href]="selectedPreviewRecurso()!.url" target="_blank" class="btn btn-primary btn-large-visit" (click)="closePreviewModal()">
                    Abrir Portal Externo 🚀
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- OTRO INTERACTIVE VIEW -->
          <div *ngIf="selectedPreviewRecurso()!.tipo === 'otro'" class="interactive-preview otro-preview-container">
            <div class="otro-view-card">
              <span class="folder-big">📁</span>
              <h3>Recurso del Sistema EstudiaUni</h3>
              <p>Este archivo es un material de apoyo especial en formato oficial. Puedes acceder directamente haciendo click en el botón de abajo.</p>
              <a [href]="selectedPreviewRecurso()!.url" target="_blank" class="btn btn-primary btn-large-visit" (click)="closePreviewModal()">
                Descargar / Abrir Recurso 📥
              </a>
            </div>
          </div>
        </div>
        
        <div class="modal-footer preview-modal-footer">
          <button class="btn btn-outline" (click)="closePreviewModal()">Cerrar Vista Previa</button>
          <button type="button" class="btn btn-primary btn-action-go" (click)="ejecutarAccionRecurso(selectedPreviewRecurso()!, $event); closePreviewModal()">
            {{ getActionTextForTipo(selectedPreviewRecurso()!.tipo) }}
          </button>
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
    :host { display: block; min-height: 100vh; background: var(--bg-color); color: var(--text-primary); }
    .app-layout { display: flex; min-height: 100vh; }
    .text-gradient { background: var(--gradient-brand); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    
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
    
    /* MOBILE HEADER */
    .mobile-header { display: none; flex-direction: column; position: fixed; top: 0; left: 0; right: 0; background: rgba(13,15,23,0.99); border-bottom: 1px solid rgba(255,255,255,0.12); z-index: 101; box-sizing: border-box; }
    .mobile-header-top { position: relative; display: flex; align-items: center; justify-content: space-between; height: 60px; padding: 0 1rem; gap: 0.75rem; box-sizing: border-box; width: 100%; }
    .mobile-header.mobile-header-with-pro .mobile-logo-img { animation: none; }
    .mobile-header-pro-row { display: flex; justify-content: center; padding: 0 1rem 0.55rem; box-sizing: border-box; width: 100%; }
    .mobile-pro-pill { width: 190px; max-width: 100%; }
    .mobile-menu-btn { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18); color: #fff; cursor: pointer; padding: 0; width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.2s; box-sizing: border-box; }
    .mobile-menu-btn:hover { background: rgba(255,255,255,0.2); }
    .mobile-menu { position: fixed; top: 0; left: 0; width: 280px; max-width: 85vw; height: 100vh; background: #0d0f17; padding: 0; overflow-y: auto; box-shadow: 4px 0 20px rgba(0,0,0,0.5); z-index: 10000; display: flex; flex-direction: column; }

    /* MAIN CONTENT */
    .main-content { flex: 1; overflow-y: auto; background: var(--bg-color); }

    /* FILTERS */
    .filters-container { display: flex; justify-content: space-between; align-items: center; gap: 1.5rem; padding: 1.25rem 2rem; margin-bottom: 2rem; flex-wrap: wrap; }
    .visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
    .search-box { position: relative; flex: 1; min-width: 250px; }
    .search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); font-size: 1.2rem; opacity: 0.6; }
    .search-box input { width: 100%; padding: 0.85rem 1rem 0.85rem 3rem; border: 2px solid var(--glass-border); border-radius: 12px; font-size: 1rem; font-weight: 500; outline: none; transition: all 0.2s; background: #f8f9fa; }
    .search-box input:focus { border-color: var(--accent-secondary); background: #fff; box-shadow: 0 0 0 3px rgba(28, 176, 246, 0.15); }
    
    .filter-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
    .filter-group { display: flex; align-items: center; gap: 0.5rem; }
    .filter-group label { font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); }
    .filter-group select { padding: 0.75rem 1rem; border: 2px solid var(--glass-border); border-radius: 12px; font-size: 0.95rem; font-weight: 600; outline: none; cursor: pointer; background: #fff; }
    .filter-group select:focus { border-color: var(--accent-secondary); }

    /* CATEGORIZED LAYOUT */
    .recursos-categories-container { display: flex; flex-direction: column; gap: 3rem; }
    .materia-section { display: flex; flex-direction: column; gap: 1.25rem; }
    .materia-header { display: flex; align-items: center; gap: 0.75rem; border-bottom: 2px solid var(--glass-border); padding-bottom: 0.75rem; margin-top: 1rem; }
    .materia-icon { font-size: 1.5rem; }
    .materia-header h2 { font-size: 1.4rem; font-weight: 800; margin: 0; color: var(--text-primary); }
    .materia-count { font-size: 0.82rem; font-weight: 700; color: var(--text-secondary); background: var(--bg-secondary); padding: 0.2rem 0.6rem; border-radius: 99px; border: 1.5px solid var(--glass-border); margin-left: auto; }
    .recursos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
    
    .recurso-card { padding: 1.5rem; display: flex; flex-direction: column; height: 100%; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; border: 2px solid var(--glass-border); background: rgba(255,255,255,0.7); backdrop-filter: blur(10px); }
    .recurso-card:hover { transform: translateY(-6px); border-color: rgba(28, 176, 246, 0.5); box-shadow: 0 16px 36px rgba(28, 176, 246, 0.12); }
    
    .card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
    .recurso-icon-wrapper { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; }
    .recurso-icon-wrapper.pdf { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); }
    .recurso-icon-wrapper.video { background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.2); }
    .recurso-icon-wrapper.link { background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); }
    .recurso-icon-wrapper.ensayo { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; border: 1px solid rgba(139, 92, 246, 0.2); }
    .recurso-icon-wrapper.libro { background: rgba(245, 158, 11, 0.1); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.2); }
    .recurso-icon-wrapper.otro { background: rgba(107, 114, 128, 0.1); color: #6b7280; border: 1px solid rgba(107, 114, 128, 0.2); }
    
    .badge-categoria { background: #f1f5f9; color: #475569; padding: 0.35rem 0.75rem; border-radius: 99px; font-size: 0.72rem; font-weight: 800; border: 1px solid #cbd5e1; letter-spacing: 0.03em; }

    /* INLINE PREVIEW THUMBNAILS */
    .recurso-preview-thumbnail {
      height: 130px;
      border-radius: 12px;
      background: #f8fafc;
      border: 1px solid rgba(0, 0, 0, 0.06);
      margin-bottom: 1.25rem;
      overflow: hidden;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: border-color 0.2s;
    }
    .recurso-card:hover .recurso-preview-thumbnail {
      border-color: rgba(28, 176, 246, 0.25);
    }

    /* Thumbnail Styles */
    .thumbnail-pdf {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      width: 100%;
      height: 100%;
      padding-bottom: 10px;
      background: linear-gradient(180deg, #fef2f2 0%, #fee2e2 100%);
    }
    .thumbnail-pdf .sheet {
      width: 60px;
      height: 80px;
      background: white;
      border-radius: 4px;
      border: 1px solid rgba(220, 38, 38, 0.15);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
      padding: 8px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      z-index: 2;
      transform: rotate(-3deg) translateY(4px);
    }
    .thumbnail-pdf .sheet-back {
      width: 55px;
      height: 75px;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 4px;
      border: 1px solid rgba(220, 38, 38, 0.1);
      position: absolute;
      z-index: 1;
      transform: rotate(6deg) translate(8px, 6px);
    }
    .thumbnail-pdf .line {
      height: 3px;
      background: #e2e8f0;
      border-radius: 2px;
    }
    .thumbnail-pdf .line.title {
      height: 5px;
      background: #ef4444;
      width: 65%;
      margin-bottom: 2px;
    }
    .thumbnail-pdf .line.short { width: 45%; }
    .thumbnail-pdf .line.medium { width: 75%; }
    .thumbnail-pdf .line.long { width: 90%; }
    .thumbnail-pdf .chart-mock {
      height: 20px;
      background: #fee2e2;
      border-radius: 3px;
      margin-top: auto;
      border: 1px dashed rgba(239, 68, 68, 0.3);
    }
    .thumbnail-pdf .pages-badge {
      position: absolute;
      right: 8px;
      top: 8px;
      background: rgba(239, 68, 68, 0.9);
      color: white;
      font-size: 0.68rem;
      font-weight: 800;
      padding: 0.2rem 0.5rem;
      border-radius: 6px;
    }

    .thumbnail-video {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
    }
    .thumbnail-video .play-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.2);
    }
    .thumbnail-video .play-icon {
      width: 44px;
      height: 44px;
      background: rgba(59, 130, 246, 0.9);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      padding-left: 3px;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
      transition: all 0.25s;
    }
    .recurso-card:hover .thumbnail-video .play-icon {
      transform: scale(1.15);
      background: #3b82f6;
    }
    .thumbnail-video .duration-badge {
      position: absolute;
      right: 8px;
      bottom: 12px;
      background: rgba(0, 0, 0, 0.85);
      color: white;
      font-size: 0.65rem;
      font-weight: 800;
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
    }
    .thumbnail-video .video-bar {
      height: 4px;
      background: rgba(255, 255, 255, 0.2);
      width: 100%;
      margin-top: auto;
    }
    .thumbnail-video .video-bar .progress {
      height: 100%;
      background: #ef4444;
    }

    .thumbnail-libro {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      display: flex;
      padding: 12px 12px 12px 24px;
      align-items: stretch;
      position: relative;
    }
    .thumbnail-libro .book-spine {
      position: absolute;
      left: 14px;
      top: 12px;
      bottom: 12px;
      width: 6px;
      background: #f59e0b;
      border-radius: 2px 0 0 2px;
      box-shadow: inset 1px 0 3px rgba(0,0,0,0.15);
    }
    .thumbnail-libro .book-cover {
      flex: 1;
      background: linear-gradient(90deg, #d97706 0%, #f59e0b 100%);
      border-radius: 0 6px 6px 0;
      box-shadow: 2px 4px 8px rgba(0,0,0,0.15);
      padding: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: white;
      border-left: 2px solid rgba(255,255,255,0.15);
    }
    .thumbnail-libro .book-title {
      font-size: 0.7rem;
      font-weight: 900;
      line-height: 1.2;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      letter-spacing: -0.01em;
    }
    .thumbnail-libro .book-author {
      font-size: 0.52rem;
      opacity: 0.85;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .thumbnail-ensayo {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12px;
      position: relative;
    }
    .thumbnail-ensayo .quiz-item {
      background: white;
      border: 1px solid rgba(139, 92, 246, 0.15);
      border-radius: 8px;
      padding: 10px;
      width: 85%;
      box-shadow: 0 4px 10px rgba(139, 92, 246, 0.06);
    }
    .thumbnail-ensayo .quiz-q {
      font-size: 0.72rem;
      font-weight: 850;
      color: #5b21b6;
      margin-bottom: 6px;
    }
    .thumbnail-ensayo .quiz-opts {
      display: flex;
      gap: 6px;
    }
    .thumbnail-ensayo .opt-circle {
      width: 18px;
      height: 18px;
      border: 1.5px solid #c084fc;
      color: #8b5cf6;
      font-size: 0.58rem;
      font-weight: 800;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .thumbnail-ensayo .opt-circle.active {
      background: #8b5cf6;
      border-color: #8b5cf6;
      color: white;
      box-shadow: 0 2px 5px rgba(139, 92, 246, 0.3);
    }
    .thumbnail-ensayo .timer-badge {
      position: absolute;
      right: 8px;
      top: 8px;
      background: #8b5cf6;
      color: white;
      font-size: 0.65rem;
      font-weight: 800;
      padding: 0.15rem 0.4rem;
      border-radius: 5px;
    }

    .thumbnail-link {
      width: 100%;
      height: 100%;
      background: #f1f5f9;
      display: flex;
      flex-direction: column;
      padding: 8px;
    }
    .thumbnail-link .browser-bar {
      height: 20px;
      background: #e2e8f0;
      border-radius: 6px 6px 0 0;
      display: flex;
      align-items: center;
      padding: 0 8px;
      gap: 10px;
    }
    .thumbnail-link .dots { display: flex; gap: 3px; }
    .thumbnail-link .dots span { width: 5px; height: 5px; border-radius: 50%; }
    .thumbnail-link .dots span.r { background: #ef4444; }
    .thumbnail-link .dots span.y { background: #eab308; }
    .thumbnail-link .dots span.g { background: #22c55e; }
    .thumbnail-link .address-bar {
      flex: 1;
      height: 12px;
      background: white;
      border-radius: 3px;
      font-size: 0.52rem;
      color: #94a3b8;
      display: flex;
      align-items: center;
      padding-left: 6px;
      font-family: monospace;
    }
    .thumbnail-link .browser-body {
      flex: 1;
      background: white;
      border-radius: 0 0 6px 6px;
      border: 1px solid #e2e8f0;
      border-top: none;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .thumbnail-link .line { height: 4px; background: #f1f5f9; border-radius: 2px; }
    .thumbnail-link .line.title { width: 55%; background: #cbd5e1; height: 6px; }
    .thumbnail-link .blocks { display: flex; gap: 6px; height: 25px; margin-top: auto; }
    .thumbnail-link .block { flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; }

    .thumbnail-otro {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    .thumbnail-otro .otro-icon { font-size: 2.2rem; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.06)); }
    .thumbnail-otro .otro-label { font-size: 0.7rem; font-weight: 800; color: #475569; letter-spacing: 0.02em; }

    /* CARD DETAILS */
    .recurso-title { font-size: 1.15rem; font-weight: 800; margin: 0 0 0.5rem; color: var(--text-primary); line-height: 1.35; }
    .recurso-desc { font-size: 0.92rem; color: var(--text-secondary); margin: 0 0 1rem; flex-grow: 1; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.45; }
    
    .recurso-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.25rem; }
    .tag { font-size: 0.72rem; color: var(--accent-primary); font-weight: 700; background: rgba(133, 92, 214, 0.05); padding: 0.2rem 0.55rem; border-radius: 6px; border: 1px solid rgba(133, 92, 214, 0.08); }
    
    .card-bottom { margin-top: auto; padding-top: 0.5rem; border-top: 1px solid rgba(0,0,0,0.04); }
    .btn-action { display: inline-flex; align-items: center; gap: 0.4rem; color: var(--accent-secondary); font-weight: 800; font-size: 0.9rem; transition: transform 0.2s; text-decoration: none; }
    .btn-action .arrow { transition: transform 0.2s; }
    .recurso-card:hover .btn-action .arrow { transform: translateX(3px); }

    .btn-action-preview {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      border: 1.5px solid var(--glass-border);
      background: white;
      color: var(--text-secondary);
      font-size: 0.85rem;
      font-weight: 750;
      padding: 0.45rem 0.8rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-action-preview:hover {
      border-color: var(--accent-secondary);
      color: var(--accent-secondary);
      background: rgba(28, 176, 246, 0.04);
      transform: translateY(-1px);
    }

    /* LOADING & EMPTY STATES */
    .loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem; color: var(--text-secondary); font-weight: 600; }
    .loader { width: 40px; height: 40px; border: 4px solid rgba(28, 176, 246, 0.2); border-top-color: var(--accent-secondary); border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1rem; }
    @keyframes spin { to { transform: rotate(360deg); } }
    
    .empty-state { text-align: center; padding: 4rem 2rem; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .empty-icon { font-size: 4rem; margin-bottom: 1rem; }
    .empty-state h3 { font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem; }
    .empty-state p { color: var(--text-secondary); margin-bottom: 1.5rem; }

    /* LOGOUT MODAL */
    .logout-confirm-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: grid; place-items: center; z-index: 11000; padding: 1.5rem; animation: fadeIn 0.2s ease; }
    .logout-confirm-modal { max-width: 420px !important; background: rgba(255,255,255,0.95); border: 2px solid var(--glass-border); border-radius: 24px; box-shadow: 0 20px 50px rgba(0,0,0,0.2); width: 100%; overflow: hidden; }
    
    .modal-header {
      padding: 1.5rem 2rem;
      border-bottom: 1px solid var(--glass-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: white;
      width: 100%;
      box-sizing: border-box;
    }
    .close-btn {
      background: rgba(0, 0, 0, 0.05);
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      color: var(--text-secondary);
      cursor: pointer;
      transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), color 0.2s ease, background 0.2s ease;
      flex-shrink: 0;
    }
    .close-btn:hover {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444 !important;
      transform: rotate(90deg) scale(1.1);
    }
    
    /* PREMIUM DETAILED PREVIEW MODAL Styles */
    .preview-overlay {
      position: fixed;
      inset: 0;
      background: rgba(13, 15, 23, 0.7);
      backdrop-filter: blur(12px);
      display: grid;
      place-items: center;
      z-index: 10500;
      padding: 1.5rem;
      animation: fadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .preview-modal {
      max-width: 850px !important;
      width: 100%;
      height: 90vh;
      max-height: 720px;
      background: #ffffff;
      border: 2px solid var(--glass-border);
      border-radius: 24px;
      box-shadow: 0 24px 60px rgba(13, 15, 23, 0.25);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      animation: slideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes slideUp {
      from { transform: translateY(30px) scale(0.96); opacity: 0; }
      to { transform: translateY(0) scale(1); opacity: 1; }
    }

    .preview-modal-title {
      font-size: 1.4rem !important;
      font-weight: 800 !important;
      color: var(--text-primary);
      margin: 0;
      line-height: 1.25;
      max-width: 80%;
      display: inline-block;
    }
    .header-title-wrap {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.4rem;
    }
    .preview-type-badge {
      font-size: 0.68rem;
      font-weight: 850;
      padding: 0.25rem 0.65rem;
      border-radius: 6px;
      letter-spacing: 0.04em;
    }
    .preview-type-badge.pdf { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
    .preview-type-badge.video { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
    .preview-type-badge.link { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    .preview-type-badge.ensayo { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; }
    .preview-type-badge.libro { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
    .preview-type-badge.otro { background: rgba(107, 114, 128, 0.1); color: #6b7280; }

    .preview-body-container {
      flex: 1;
      overflow-y: auto;
      background: #f8fafc;
      padding: 2rem;
      display: flex;
      flex-direction: column;
    }
    .preview-modal-footer {
      padding: 1.25rem 2rem;
      border-top: 1px solid var(--glass-border);
      background: white;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 1rem;
    }
    .btn-action-go {
      background: var(--accent-secondary) !important;
      color: white !important;
      font-weight: 800;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      text-decoration: none;
      transition: all 0.2s;
    }
    .btn-action-go:hover {
      filter: brightness(1.05);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(28, 176, 246, 0.25);
    }

    /* 1. PDF VIEWER Styles */
    .pdf-preview-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      flex: 1;
    }
    .viewer-toolbar {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      background: white;
      padding: 0.6rem 1.25rem;
      border-radius: 99px;
      border: 1px solid var(--glass-border);
      box-shadow: 0 4px 12px rgba(0,0,0,0.03);
    }
    .toolbar-btn {
      background: none;
      border: none;
      color: var(--accent-secondary);
      font-weight: 800;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s;
      padding: 0.2rem 0.5rem;
    }
    .toolbar-btn:disabled {
      color: var(--text-muted);
      cursor: not-allowed;
      opacity: 0.5;
    }
    .page-indicator {
      font-size: 0.88rem;
      font-weight: 750;
      color: var(--text-primary);
    }
    .pdf-page-mock {
      background: white;
      border: 1px solid rgba(0, 0, 0, 0.08);
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
      width: 100%;
      max-width: 520px;
      height: 480px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 2rem;
      position: relative;
    }
    .pdf-page-header {
      display: flex;
      justify-content: space-between;
      font-size: 0.72rem;
      color: #94a3b8;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1.5px solid #f1f5f9;
      padding-bottom: 0.6rem;
    }
    .pdf-page-content {
      flex: 1;
      padding: 1.5rem 0;
      display: flex;
      flex-direction: column;
      position: relative;
    }
    .pdf-page-content .page-title {
      font-size: 1.15rem;
      font-weight: 850;
      color: #1e293b;
      margin: 0 0 0.5rem;
    }
    .doc-divider {
      border: none;
      height: 2px;
      background: #fee2e2;
      margin-bottom: 1rem;
    }
    .doc-text {
      font-size: 0.88rem;
      line-height: 1.55;
      color: #475569;
      margin-bottom: 0.75rem;
    }
    .doc-bullets {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding-left: 1.2rem;
      margin: 0.5rem 0;
    }
    .doc-bullets li {
      font-size: 0.85rem;
      color: #334155;
      line-height: 1.45;
    }
    .pdf-watermark {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%) rotate(-25deg);
      font-size: 2.2rem;
      font-weight: 900;
      color: rgba(239, 68, 68, 0.05);
      pointer-events: none;
      white-space: nowrap;
      letter-spacing: 0.05em;
    }
    .pdf-page-footer {
      display: flex;
      justify-content: space-between;
      font-size: 0.7rem;
      color: #94a3b8;
      font-weight: 700;
      border-top: 1.5px solid #f1f5f9;
      padding-top: 0.6rem;
    }

    /* 2. VIDEO PLAYER Mock Styles */
    .video-preview-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      flex: 1;
    }
    .mock-video-player {
      background: #0f172a;
      border-radius: 16px;
      border: 1px solid #1e293b;
      box-shadow: 0 12px 32px rgba(0,0,0,0.15);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .video-canvas {
      height: 260px;
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }
    .video-overlay-pulse {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      background: rgba(0, 0, 0, 0.45);
      cursor: pointer;
    }
    .large-play-icon {
      width: 68px;
      height: 68px;
      background: #3b82f6;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      padding-left: 5px;
      box-shadow: 0 8px 24px rgba(59, 130, 246, 0.45);
      transition: all 0.25s;
    }
    .video-overlay-pulse:hover .large-play-icon {
      transform: scale(1.1);
      background: #2563eb;
      box-shadow: 0 10px 30px rgba(59, 130, 246, 0.6);
    }
    .play-hint {
      color: rgba(255, 255, 255, 0.85);
      font-size: 0.88rem;
      font-weight: 750;
      letter-spacing: 0.02em;
    }
    .visual-video-graphic {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .wave-graphic {
      display: flex;
      align-items: center;
      gap: 6px;
      height: 60px;
    }
    .wave-graphic .bar {
      width: 6px;
      background: #3b82f6;
      border-radius: 3px;
      height: 20px;
    }
    .video-canvas.playing .wave-graphic .bar {
      animation: audioBounce 1.2s infinite ease-in-out alternate;
    }
    .wave-graphic .bar-1 { animation-delay: 0.1s; height: 35px; }
    .wave-graphic .bar-2 { animation-delay: 0.3s; height: 50px; }
    .wave-graphic .bar-3 { animation-delay: 0.5s; height: 25px; }
    .wave-graphic .bar-4 { animation-delay: 0.2s; height: 42px; }
    .wave-graphic .bar-5 { animation-delay: 0.4s; height: 30px; }
    
    @keyframes audioBounce {
      0% { transform: scaleY(0.4); }
      100% { transform: scaleY(1.4); }
    }

    .topic-floating-pill {
      position: absolute;
      top: 16px;
      left: 16px;
      background: rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      padding: 0.35rem 0.8rem;
      border-radius: 99px;
      font-size: 0.72rem;
      font-weight: 750;
    }
    .instructor-sub {
      margin-top: 1rem;
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .captions-overlay {
      position: absolute;
      bottom: 16px;
      left: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.75);
      border-radius: 10px;
      padding: 0.75rem 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      min-height: 48px;
    }
    .caption-text {
      color: #ffffff;
      font-size: 0.88rem;
      font-weight: 700;
      margin: 0;
      line-height: 1.4;
    }

    .video-controls {
      background: #1e293b;
      padding: 0.75rem 1.25rem;
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }
    .play-pause-btn {
      background: #3b82f6;
      color: white;
      border: none;
      font-weight: 850;
      font-size: 0.85rem;
      padding: 0.45rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .play-pause-btn:hover { background: #2563eb; }
    .video-progress-container {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .video-progress-bar {
      flex: 1;
      height: 6px;
      background: rgba(255,255,255,0.25);
      border-radius: 3px;
      cursor: pointer;
      position: relative;
    }
    .video-progress-fill {
      height: 100%;
      background: #ef4444;
      border-radius: 3px;
      position: relative;
    }
    .time-label {
      color: #94a3b8;
      font-size: 0.75rem;
      font-family: monospace;
      font-weight: 700;
    }
    .reset-btn {
      background: none;
      border: 1px solid rgba(255,255,255,0.2);
      color: rgba(255,255,255,0.8);
      font-weight: 750;
      font-size: 0.78rem;
      padding: 0.4rem 0.8rem;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .reset-btn:hover { background: rgba(255,255,255,0.06); }
    .video-details-card {
      background: white;
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      padding: 1.25rem;
    }
    .video-details-card h4 { margin: 0 0 0.5rem; font-size: 0.95rem; font-weight: 800; }
    .video-details-card p { font-size: 0.85rem; color: var(--text-secondary); margin: 0; line-height: 1.5; }

    /* 3. BOOK VIEWER Styles */
    .book-preview-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      flex: 1;
    }
    .mock-book {
      display: flex;
      width: 100%;
      max-width: 720px;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 12px 32px rgba(0,0,0,0.06);
      height: 380px;
      border: 1.5px solid rgba(0,0,0,0.06);
      overflow: hidden;
      position: relative;
    }
    .mock-book::before {
      content: "";
      position: absolute;
      left: 50%;
      top: 0;
      bottom: 0;
      width: 16px;
      background: linear-gradient(90deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.05) 100%);
      transform: translateX(-50%);
      z-index: 10;
    }
    .book-page {
      flex: 1;
      padding: 2.25rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: #fafaf9;
      position: relative;
    }
    .book-page.left-page {
      border-right: 1px solid rgba(0,0,0,0.04);
      padding-right: 2.5rem;
    }
    .book-page.right-page {
      padding-left: 2.5rem;
    }
    .book-page-content {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }
    .chapter-title {
      font-size: 0.72rem;
      color: #d97706;
      font-weight: 850;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0;
    }
    .book-page .page-title {
      font-size: 1rem;
      font-weight: 850;
      color: #1c1917;
      margin: 0 0 0.25rem;
      line-height: 1.35;
    }
    .book-text {
      font-size: 0.85rem;
      line-height: 1.55;
      color: #44403c;
      margin-bottom: 0.5rem;
    }
    .book-bullets {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      padding-left: 1.1rem;
      margin: 0.25rem 0;
    }
    .book-bullets li {
      font-size: 0.8rem;
      color: #57534e;
      line-height: 1.45;
    }
    .page-num {
      align-self: center;
      font-size: 0.72rem;
      font-weight: 800;
      color: #a8a29e;
      font-family: monospace;
    }
    .book-controls {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      background: white;
      padding: 0.5rem 1.2rem;
      border-radius: 99px;
      border: 1px solid var(--glass-border);
    }

    /* 4. QUIZ VIEWER Styles */
    .quiz-preview-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      flex: 1;
    }
    .quiz-welcome-banner {
      display: flex;
      gap: 1rem;
      background: rgba(139, 92, 246, 0.06);
      border: 1.5px dashed rgba(139, 92, 246, 0.2);
      border-radius: 12px;
      padding: 1rem 1.25rem;
    }
    .banner-icon { font-size: 1.75rem; }
    .banner-text h4 { margin: 0 0 0.25rem; font-size: 0.95rem; font-weight: 800; color: #5b21b6; }
    .banner-text p { margin: 0; font-size: 0.85rem; color: #7c3aed; }

    .quiz-questions-list {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .quiz-question-card {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .question-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .q-number {
      font-size: 0.75rem;
      font-weight: 850;
      color: var(--accent-primary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .badge-status {
      font-size: 0.72rem;
      font-weight: 800;
      padding: 0.2rem 0.6rem;
      border-radius: 6px;
    }
    .badge-status.correct { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    .badge-status.incorrect { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

    .question-text {
      font-size: 0.95rem;
      font-weight: 800;
      color: var(--text-primary);
      margin: 0;
      line-height: 1.45;
    }
    .options-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.6rem;
    }
    .option-row-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: 10px;
      border: 1.5px solid var(--glass-border);
      background: white;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s;
    }
    .option-row-btn:hover:not(:disabled) {
      border-color: var(--accent-primary);
      background: rgba(133, 92, 214, 0.04);
      transform: translateX(3px);
    }
    .option-row-btn.selected {
      border-color: var(--accent-primary);
      background: rgba(133, 92, 214, 0.08);
      box-shadow: 0 4px 10px rgba(133,92,214,0.06);
    }
    .option-row-btn.selected .option-letter {
      background: var(--accent-primary);
      color: white;
    }
    
    .option-row-btn.correct-highlight {
      border-color: #10b981 !important;
      background: rgba(16, 185, 129, 0.08) !important;
    }
    .option-row-btn.correct-highlight .option-letter {
      background: #10b981 !important;
      color: white !important;
    }
    
    .option-row-btn.incorrect-highlight {
      border-color: #ef4444 !important;
      background: rgba(239, 68, 68, 0.08) !important;
    }
    .option-row-btn.incorrect-highlight .option-letter {
      background: #ef4444 !important;
      color: white !important;
    }

    .option-letter {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #f1f5f9;
      color: #64748b;
      font-size: 0.75rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    .option-desc {
      font-size: 0.88rem;
      font-weight: 650;
      color: var(--text-primary);
    }

    .explanation-box {
      background: #f8fafc;
      border-left: 4px solid #3b82f6;
      padding: 1rem;
      border-radius: 0 8px 8px 0;
      margin-top: 0.5rem;
    }
    .exp-title {
      font-size: 0.8rem;
      font-weight: 850;
      color: #2563eb;
      display: block;
      margin-bottom: 0.25rem;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .exp-text {
      font-size: 0.82rem;
      color: #475569;
      margin: 0;
      line-height: 1.5;
    }
    .quiz-actions-row {
      display: flex;
      justify-content: flex-end;
      padding-top: 0.5rem;
    }

    /* 5. BROWSER Mock Styles (Links) */
    .browser-preview-container {
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .browser-window-mock {
      background: white;
      border-radius: 16px;
      border: 1.5px solid var(--glass-border);
      box-shadow: 0 12px 32px rgba(0,0,0,0.06);
      display: flex;
      flex-direction: column;
      height: 420px;
      overflow: hidden;
    }
    .browser-header {
      height: 40px;
      background: #f1f5f9;
      border-bottom: 1.5px solid #e2e8f0;
      display: flex;
      align-items: center;
      padding: 0 1rem;
      gap: 1.25rem;
    }
    .window-buttons {
      display: flex;
      gap: 6px;
    }
    .btn-dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
    }
    .btn-dot.r { background: #ef4444; }
    .btn-dot.y { background: #eab308; }
    .btn-dot.g { background: #22c55e; }
    .browser-address {
      flex: 1;
      height: 24px;
      background: white;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      display: flex;
      align-items: center;
      padding: 0 8px;
      gap: 6px;
      overflow: hidden;
    }
    .lock-icon { font-size: 0.72rem; }
    .url-text {
      font-size: 0.7rem;
      color: #64748b;
      font-family: monospace;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .browser-content-area {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .site-header-mock {
      height: 44px;
      border-bottom: 1px solid #f1f5f9;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 1.5rem;
      background: #f8fafc;
    }
    .site-logo {
      font-size: 0.8rem;
      font-weight: 850;
      color: var(--accent-secondary);
    }
    .site-menu {
      display: flex;
      gap: 1rem;
      font-size: 0.72rem;
      font-weight: 700;
      color: #94a3b8;
    }
    .site-body-mock {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 2.5rem;
    }
    .mock-globe {
      font-size: 3rem;
      margin-bottom: 0.75rem;
      filter: drop-shadow(0 4px 10px rgba(59, 130, 246, 0.15));
    }
    .site-body-mock h3 {
      font-size: 1.15rem;
      font-weight: 850;
      margin: 0 0 0.5rem;
    }
    .site-intro {
      font-size: 0.85rem;
      color: var(--text-secondary);
      max-width: 440px;
      line-height: 1.5;
      margin: 0 0 1.25rem;
    }
    .features-list-mock {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      align-items: flex-start;
      margin-bottom: 1.5rem;
    }
    .features-list-mock .feat {
      font-size: 0.8rem;
      font-weight: 700;
      color: #475569;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .features-list-mock .tick {
      color: #10b981;
      font-weight: 850;
    }
    .btn-large-visit {
      padding: 0.7rem 1.75rem !important;
      font-size: 0.92rem !important;
      font-weight: 850 !important;
      border-radius: 10px !important;
    }

    /* 6. OTROS VIEWER Styles */
    .otro-preview-container {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
    }
    .otro-view-card {
      background: white;
      border-radius: 16px;
      border: 1.5px solid var(--glass-border);
      padding: 2.5rem;
      text-align: center;
      max-width: 440px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .folder-big {
      font-size: 4rem;
      margin-bottom: 1rem;
      filter: drop-shadow(0 4px 10px rgba(0,0,0,0.05));
    }
    .otro-view-card h3 {
      font-size: 1.2rem;
      font-weight: 850;
      margin: 0 0 0.5rem;
    }
    .otro-view-card p {
      font-size: 0.88rem;
      color: var(--text-secondary);
      line-height: 1.5;
      margin: 0 0 1.5rem;
    }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    @media (max-width: 1024px) {
      aside.sidebar, .sidebar { display: none !important; }
      .mobile-header { display: flex !important; }
      .main-content { margin-left: 0 !important; padding: 0 !important; padding-top: 60px !important; max-width: 100vw !important; width: 100% !important; box-sizing: border-box !important; }
      .mobile-header.mobile-header-with-pro ~ .main-content { padding-top: 104px !important; }
      .dashboard-header { height: auto !important; max-height: none !important; padding: 1.25rem 1rem 0.75rem !important; flex-direction: column !important; align-items: flex-start !important; gap: 0.5rem !important; width: 100% !important; box-sizing: border-box !important; }
      .dashboard-header .welcome-actions { display: none !important; }
      .dashboard-header .subtitle { font-size: 0.85rem !important; line-height: 1.35 !important; }
      .dashboard-body { padding: 1rem 1rem 2rem !important; width: 100% !important; box-sizing: border-box !important; }
    }

    @media (max-width: 768px) {
      aside.sidebar, .sidebar { display: none !important; }
      .mobile-header { display: flex !important; }
      .main-content { margin-left: 0 !important; padding: 0 !important; padding-top: 60px !important; max-width: 100vw !important; width: 100% !important; box-sizing: border-box !important; }
      .mobile-header.mobile-header-with-pro ~ .main-content { padding-top: 104px !important; }
      .dashboard-header { height: auto !important; max-height: none !important; padding: 1rem 0.85rem 0.5rem !important; flex-direction: column !important; align-items: flex-start !important; gap: 0.5rem !important; width: 100% !important; box-sizing: border-box !important; }
      .dashboard-header .welcome-actions { display: none !important; }
      .dashboard-header .subtitle { font-size: 0.82rem !important; line-height: 1.35 !important; }
      .dashboard-body { padding: 0.85rem 0.85rem 2rem !important; width: 100% !important; box-sizing: border-box !important; }
      .filters-container { flex-direction: column; align-items: stretch; }
      .recursos-grid { grid-template-columns: 1fr !important; }
      .preview-modal { height: 95vh; max-height: none; }
      .preview-body-container { padding: 1.25rem !important; }
      .modal-header { padding: 1.25rem !important; }
      .preview-modal-title { font-size: 1.15rem !important; }
      .viewer-toolbar { flex-wrap: wrap; justify-content: center; gap: 0.75rem !important; padding: 0.75rem 1rem !important; }
      .book-controls { flex-wrap: wrap; justify-content: center; gap: 0.75rem !important; text-align: center; }
      .video-controls { flex-wrap: wrap; gap: 0.75rem !important; }
      .video-progress-container { min-width: 100%; order: 3; }
      .mock-book { flex-direction: column; height: auto; }
      .book-page { padding: 1.5rem !important; }
      .book-page.left-page { border-right: none; border-bottom: 1px solid rgba(0,0,0,0.06); padding-right: 1.5rem !important; }
      .book-page.right-page { padding-left: 1.5rem !important; }
      .pdf-page-mock { padding: 1.25rem !important; height: auto !important; min-height: 420px; }
      .site-body-mock { padding: 1.5rem !important; }
      .browser-window-mock { height: auto !important; }
      .otro-view-card, .quiz-question-card { padding: 1.25rem !important; }
    }

    @media (max-width: 480px) {
      .main-content { padding-top: 60px !important; }
      .mobile-header.mobile-header-with-pro ~ .main-content { padding-top: 104px !important; }
      .filters-container { gap: 0.5rem; }
      .recursos-grid { grid-template-columns: 1fr !important; }
      .preview-body-container { padding: 1rem !important; }
      .modal-header { padding: 1rem !important; }
      .preview-modal-footer { padding: 1rem !important; flex-direction: column-reverse; }
      .preview-modal-footer .btn { width: 100%; }
      .viewer-toolbar, .book-controls { gap: 0.5rem !important; }
      .site-body-mock { padding: 1rem !important; }
    }
  `]
})
export class RecursosComponent implements OnInit, OnDestroy {
  public firestoreService = inject(FirestoreService);
  private auth = inject(AuthService);
  private router = inject(Router);
  public adminService = inject(AdminService);
  public recursosService = inject(RecursosService);
  private sanitizer = inject(DomSanitizer);
  public paymentService = inject(PaymentService);

  mobileOpen = false;
  showSettingsModal = false;
  showProfileModal = false;
  showLogoutConfirm = false;

  searchTerm = signal('');
  selectedCategoria = signal('all');
  selectedSubcategoria = signal('all');
  selectedTipo = signal('all');

  subcategoriasDisponibles = computed(() => {
    const recursos = this.recursosService.recursos();
    const subcats = new Set<string>();
    const activeCat = this.selectedCategoria();
    
    recursos.forEach(r => {
      if (r.visible && r.subcategoria) {
        if (activeCat === 'all' || r.categoria === activeCat) {
          subcats.add(r.subcategoria);
        }
      }
    });
    return Array.from(subcats).sort();
  });

  onCategoriaFilterChange(newCat: string) {
    this.selectedCategoria.set(newCat);
    this.selectedSubcategoria.set('all');
  }

  // Modal Interactive State
  selectedPreviewRecurso = signal<Recurso | null>(null);
  pdfCurrentPage = 1;
  videoPlaying = false;
  videoTime = 0;
  videoDuration = 180; // 3 minutes
  videoInterval: any = null;
  videoCaptions = [
    { time: 0, text: '¡Bienvenidos a EstudiaUni! Hoy repasaremos los conceptos clave.' },
    { time: 10, text: 'En la PAES de Matemáticas, las funciones cuadráticas son fundamentales.' },
    { time: 25, text: 'Recuerden la fórmula del vértice: x = -b / (2a).' },
    { time: 45, text: 'Esta coordenada x nos da el eje de simetría de la parábola.' },
    { time: 60, text: 'Si a es mayor a cero, la parábola se abre hacia arriba (cóncava).' },
    { time: 80, text: 'Si a es menor a cero, se abre hacia abajo (convexa).' },
    { time: 100, text: 'Veamos un ejemplo práctico: f(x) = 2x² - 4x + 1.' },
    { time: 120, text: 'Aquí, a = 2 y b = -4. Entonces el vértice en x es -(-4)/(2*2) = 1.' },
    { time: 140, text: 'Para encontrar la coordenada y del vértice, evaluamos f(1) = 2(1)² - 4(1) + 1 = -1.' },
    { time: 160, text: '¡Excelente! El vértice de la parábola es (1, -1).' }
  ];
  currentCaption = 'Haga click en reproducir para iniciar la clase en video.';

  // Quiz state
  Object = Object;
  quizAnswers: { [key: number]: string } = {};
  quizSubmitted = false;
  quizQuestions = [
    {
      id: 1,
      q: '¿Cuál es el valor del discriminante (Δ) en la ecuación cuadrática x² - 5x + 6 = 0?',
      opts: { A: '1', B: '25', C: '6', D: '-1' },
      correct: 'A',
      exp: 'El discriminante se calcula como b² - 4ac. Reemplazando: (-5)² - 4(1)(6) = 25 - 24 = 1. Como es mayor a 0, la ecuación tiene dos soluciones reales distintas.'
    },
    {
      id: 2,
      q: 'En un texto argumentativo, ¿cuál es el objetivo principal del autor?',
      opts: { A: 'Narrar una historia de ficción', B: 'Persuadir al lector sobre un punto de vista', C: 'Explicar científicamente un fenómeno', D: 'Definir el significado de palabras complejas' },
      correct: 'B',
      exp: 'El texto argumentativo tiene como finalidad convencer o persuadir al receptor sobre la validez de una tesis u opinión mediante el uso de argumentos.'
    },
    {
      id: 3,
      q: '¿En qué año se promulgó la primera Constitución de la República de Chile?',
      opts: { A: '1810', B: '1818', C: '1833', D: '1925' },
      correct: 'C',
      exp: 'Aunque hubo reglamentos provisionales previos (como en 1812 y 1818), la Constitución de 1833, redactada en gran parte por Mariano Egaña y bajo la influencia de Diego Portales, fue el primer texto constitucional duradero que organizó establemente la República.'
    }
  ];

  // Book pages state
  bookCurrentPage = 0; // 0: Pages 1-2, 1: Pages 3-4

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

  isProPlan = computed(() => {
    const p = this.firestoreService.profileSignal();
    return p?.plan === 'premium';
  });
  
  profileInitial = computed(() => {
    const p = this.firestoreService.profileSignal();
    return p?.displayName?.charAt(0).toUpperCase() || 'U';
  });

  recursosGroupedByMateria = computed(() => {
    const list = this.filteredRecursos();
    const groups: { [key: string]: Recurso[] } = {};
    list.forEach(r => {
      if (!groups[r.categoria]) {
        groups[r.categoria] = [];
      }
      groups[r.categoria].push(r);
    });
    return groups;
  });

  categoriasList = computed(() => {
    return Object.keys(this.recursosGroupedByMateria()).sort();
  });

  categoriasDisponibles = computed(() => {
    const recursos = this.recursosService.recursos();
    const categorias = new Set<string>();
    recursos.forEach(r => {
      if (r.visible) categorias.add(r.categoria);
    });
    return Array.from(categorias).sort();
  });

  filteredRecursos = computed(() => {
    let recursos = this.recursosService.recursos().filter(r => r.visible);
    
    // Filter by type
    const tipo = this.selectedTipo();
    if (tipo !== 'all') {
      recursos = recursos.filter(r => r.tipo === tipo);
    }
    
    // Filter by category
    const cat = this.selectedCategoria();
    if (cat !== 'all') {
      recursos = recursos.filter(r => r.categoria === cat);
    }

    // Filter by subcategory
    const subcat = this.selectedSubcategoria();
    if (subcat !== 'all') {
      recursos = recursos.filter(r => r.subcategoria === subcat);
    }
    
    // Filter by search term
    const term = this.searchTerm().trim().toLowerCase();
    if (term !== '') {
      recursos = recursos.filter(r => 
        r.titulo.toLowerCase().includes(term) || 
        r.descripcion.toLowerCase().includes(term) ||
        r.categoria.toLowerCase().includes(term) ||
        (r.subcategoria && r.subcategoria.toLowerCase().includes(term)) ||
        r.etiquetas.some(t => t.toLowerCase().includes(term))
      );
    }
    
    return recursos;
  });

  ngOnInit() {
    // Los recursos ya se cargan en el constructor del servicio
  }

  ngOnDestroy() {
    this.clearVideoTimer();
  }

  clearFilters() {
    this.searchTerm.set('');
    this.selectedCategoria.set('all');
    this.selectedSubcategoria.set('all');
    this.selectedTipo.set('all');
  }

  getIconForTipo(tipo: string): string {
    switch(tipo) {
      case 'pdf': return '📄';
      case 'video': return '▶️';
      case 'ensayo': return '📝';
      case 'libro': return '📚';
      case 'link': return '🔗';
      default: return '📁';
    }
  }

  getActionTextForTipo(tipo: string): string {
    switch(tipo) {
      case 'pdf': return 'Descargar PDF';
      case 'video': return 'Ver Video';
      case 'ensayo': return 'Ver Ensayo';
      case 'libro': return 'Ver Libro';
      case 'link': return 'Abrir Enlace';
      default: return 'Abrir Recurso';
    }
  }

  // Interactive preview actions
  openPreview(recurso: Recurso, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.selectedPreviewRecurso.set(recurso);
    this.pdfCurrentPage = 1;
    this.bookCurrentPage = 0;
    this.resetVideo();
    this.resetQuiz();
  }

  closePreviewModal() {
    this.selectedPreviewRecurso.set(null);
    this.clearVideoTimer();
  }

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getSafeVideoUrl(url: string): SafeResourceUrl {
    let embedUrl = url;
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  isYoutubeUrl(url: string): boolean {
    return url.includes('youtube.com') || url.includes('youtu.be');
  }

  getVideoThumbnail(url: string): string {
    if (!url) return '';
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('youtube.com/embed/')[1]?.split('?')[0];
    }
    
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    }
    return '';
  }

  ejecutarAccionRecurso(recurso: Recurso, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    
    // If it's a PDF, Book, or generic local upload, trigger the download method
    if (recurso.tipo === 'pdf' || recurso.tipo === 'libro' || (recurso.url && recurso.url.startsWith('data:'))) {
      this.descargarRecurso(recurso);
    } else {
      // Otherwise, open link in new window
      if (recurso.url && recurso.url !== '#') {
        window.open(recurso.url, '_blank');
      } else {
        alert('Este es un recurso de demostración y no contiene un enlace o archivo real.');
      }
    }
  }

  descargarRecurso(recurso: Recurso, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    if (!recurso.url || recurso.url === '#') {
      alert('Este es un recurso de demostración y no contiene un archivo real para descargar.');
      return;
    }
    
    try {
      const link = document.createElement('a');
      link.href = recurso.url;
      
      // Determine file extension
      let extension = '.pdf';
      if (recurso.tipo === 'video') extension = '.mp4';
      else if (recurso.tipo === 'ensayo') extension = '.json';
      else if (recurso.tipo === 'libro') extension = '.pdf';
      else if (recurso.tipo === 'link') extension = '.html';
      
      if (recurso.url.startsWith('data:')) {
        const mimeType = recurso.url.substring(5, recurso.url.indexOf(';'));
        if (mimeType === 'application/pdf') extension = '.pdf';
        else if (mimeType === 'application/json') extension = '.json';
        else if (mimeType.startsWith('image/')) extension = '.' + mimeType.split('/')[1];
      } else {
        const lastDot = recurso.url.lastIndexOf('.');
        if (lastDot > recurso.url.length - 6) {
          extension = recurso.url.substring(lastDot);
        }
      }
      
      link.download = recurso.titulo.replace(/[^a-zA-Z0-9]/g, '_') + extension;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error al descargar el recurso:', error);
      // Fallback: open link in new window
      window.open(recurso.url, '_blank');
    }
  }

  // PDF controls
  prevPdfPage() {
    if (this.pdfCurrentPage > 1) this.pdfCurrentPage--;
  }

  nextPdfPage() {
    if (this.pdfCurrentPage < 3) this.pdfCurrentPage++;
  }

  getPdfPageContent(recurso: Recurso, page: number) {
    const cat = recurso.categoria.toLowerCase();
    const isMath = cat.includes('matemat') || recurso.titulo.toLowerCase().includes('m1') || recurso.titulo.toLowerCase().includes('m2');
    const isScience = cat.includes('ciencia') || cat.includes('físic') || cat.includes('químic') || cat.includes('biolog') || recurso.titulo.toLowerCase().includes('física');
    
    if (isMath) {
      if (page === 1) {
        return {
          title: 'Eje Álgebra y Funciones: Ecuaciones Cuadráticas',
          paragraphs: [
            'Una ecuación de segundo grado con una incógnita es de la forma: ax² + bx + c = 0, donde a, b y c son números reales y a ≠ 0.',
            'Para resolver esta ecuación podemos utilizar el método de factorización, completación de cuadrados o directamente la fórmula general.'
          ],
          bullets: [
            { label: 'Fórmula General', desc: 'x = (-b ± √(b² - 4ac)) / 2a' },
            { label: 'Discriminante (Δ)', desc: 'Δ = b² - 4ac. Define la naturaleza de las soluciones de la ecuación.' },
            { label: 'Δ > 0', desc: 'Dos soluciones reales y distintas.' },
            { label: 'Δ = 0', desc: 'Una única solución real (soluciones reales e iguales).' },
            { label: 'Δ < 0', desc: 'No tiene soluciones en el conjunto de los números reales.' }
          ]
        };
      } else if (page === 2) {
        return {
          title: 'Propiedades de las Raíces de la Ecuación Cuadrática',
          paragraphs: [
            'Si x₁ y x₂ son las soluciones de la ecuación cuadrática ax² + bx + c = 0, se cumplen las siguientes relaciones matemáticas sumamente evaluadas en la PAES:',
            'Estas propiedades nos permiten resolver problemas de ecuaciones complejas sin necesidad de encontrar explícitamente el valor de cada solución individual.'
          ],
          bullets: [
            { label: 'Suma de soluciones (x₁ + x₂)', desc: '-b / a' },
            { label: 'Producto de soluciones (x₁ * x₂)', desc: 'c / a' },
            { label: 'Forma canónica de la función cuadrática', desc: 'f(x) = a(x - h)² + k, donde (h, k) representa las coordenadas del vértice.' },
            { label: 'Vértice en x (h)', desc: 'h = -b / (2a)' },
            { label: 'Vértice en y (k)', desc: 'k = f(h) = (4ac - b²) / 4a' }
          ]
        };
      } else {
        return {
          title: 'Eje Geometría: Teorema de Pitágoras y Semejanza',
          paragraphs: [
            'La semejanza de triángulos y la proporcionalidad geométrica representan el núcleo del eje de Geometría en la prueba regular M1.',
            'Dos triángulos son semejantes si tienen sus ángulos homólogos iguales y sus lados homólogos proporcionales.'
          ],
          bullets: [
            { label: 'Criterio Ángulo-Ángulo (AA)', desc: 'Tienen dos ángulos congruentes.' },
            { label: 'Criterio Lado-Ángulo-Lado (LAL)', desc: 'Dos lados proporcionales y el ángulo comprendido entre ellos igual.' },
            { label: 'Teorema de Euclides', desc: 'En un triángulo rectángulo, h² = p * q, a² = c * p, b² = c * q.' },
            { label: 'Tríos Pitagóricos Comunes', desc: '(3,4,5), (5,12,13), (8,15,17). Ahorran valioso tiempo de cálculo.' }
          ]
        };
      }
    } else if (isScience) {
      if (page === 1) {
        return {
          title: 'Física Módulo Común: Leyes de la Dinámica',
          paragraphs: [
            'La dinámica estudia las causas del movimiento de los cuerpos basándose en las tres leyes postuladas por Isaac Newton.',
            'Toda fuerza representa una interacción mutua entre dos cuerpos y se mide oficialmente en Newtons (N) en el Sistema Internacional.'
          ],
          bullets: [
            { label: 'Primera Ley (Inercia)', desc: 'Un cuerpo permanece en reposo o MRU a menos que una fuerza neta externa actúe sobre él.' },
            { label: 'Segunda Ley (Masa y Aceleración)', desc: 'F = m * a. La aceleración es directamente proporcional a la fuerza e inversamente proporcional a la masa.' },
            { label: 'Tercera Ley (Acción y Reacción)', desc: 'Si el cuerpo A ejerce una fuerza sobre B, B ejerce una fuerza de igual magnitud y sentido opuesto sobre A.' }
          ]
        };
      } else if (page === 2) {
        return {
          title: 'Energía Mecánica y su Conservación',
          paragraphs: [
            'El concepto de energía y su transformación es uno de los temas transversales más preguntados en el temario de Física.',
            'La energía mecánica total es la suma de la energía cinética (de movimiento) y la energía potencial (de posición).'
          ],
          bullets: [
            { label: 'Energía Cinética (Ec)', desc: 'Ec = 0.5 * m * v²' },
            { label: 'Energía Potencial Gravitatoria (Ep)', desc: 'Ep = m * g * h, donde g ≈ 10 m/s² en problemas PAES.' },
            { label: 'Teorema del Trabajo y la Energía', desc: 'El trabajo realizado por la fuerza neta es igual al cambio en la energía cinética.' },
            { label: 'Fuerzas Conservativas', desc: 'Si solo actúan fuerzas conservativas (como la gravedad), la energía mecánica total se mantiene constante.' }
          ]
        };
      } else {
        return {
          title: 'Química Común: Estequiometría y Leyes Ponderales',
          paragraphs: [
            'La estequiometría se encarga del cálculo cuantitativo de las relaciones de masa y moles entre reactivos y productos en una reacción química.',
            'Para realizar cualquier cálculo estequiométrico, la ecuación química debe estar estrictamente balanceada.'
          ],
          bullets: [
            { label: 'Concepto de Mol', desc: 'Unidad que contiene 6.02 * 10²³ partículas (Número de Avogadro).' },
            { label: 'Masa Molar', desc: 'Masa de un mol de sustancia en gramos (g/mol).' },
            { label: 'Reactivo Limitante', desc: 'Sustancia que se consume por completo primero y determina la cantidad de producto formada.' },
            { label: 'Rendimiento de Reacción', desc: '(Rendimiento Real / Rendimiento Teórico) * 100%' }
          ]
        };
      }
    } else {
      if (page === 1) {
        return {
          title: 'Técnicas Avanzadas de Comprensión Lectora',
          paragraphs: [
            'La competencia lectora no es solo una habilidad pasiva; requiere un procesamiento activo y estratégico de la información del texto.',
            'Identificar la tipología textual y el propósito del autor en los primeros párrafos orienta significativamente la lectura.'
          ],
          bullets: [
            { label: 'Idea Principal', desc: 'Responde a la pregunta "¿Qué se dice sobre el tema?" en cada párrafo.' },
            { label: 'Tema Central', desc: 'Sujeto global del texto. Responde a "¿De qué se habla en el texto?".' },
            { label: 'Lectura Exploratoria', desc: 'Escaneo rápido previo de subtítulos, negritas y estructura para prever contenidos.' },
            { label: 'Subrayado Activo', desc: 'Marcar únicamente palabras clave y nexos argumentativos para no saturar el texto.' }
          ]
        };
      } else if (page === 2) {
        return {
          title: 'Estrategias de Inferencia LECTURA CRÍTICA',
          paragraphs: [
            'Inferir consiste en extraer información implícita a partir de datos explícitos del texto, sin inventar ni sobreinterpretar.',
            'Las preguntas de inferencia son de las que presentan mayor tasa de error en la PAES.'
          ],
          bullets: [
            { label: 'Inferencia Válida', desc: 'Se deduce de forma lógica y necesaria de las premisas presentes en el texto.' },
            { label: 'Sobreinferencia (Error común)', desc: 'Extraer conclusiones que van más allá del texto o suponer intenciones no declaradas.' },
            { label: 'Tono del Autor', desc: 'Identificar emociones o postura del autor (irónico, crítico, objetivo, entusiasta).' },
            { label: 'Evaluación y Reflexión', desc: 'Juzgar la validez de los argumentos o relacionar el texto con otros conocimientos.' }
          ]
        };
      } else {
        return {
          title: 'Historia: Chile a Inicios del Siglo XX',
          paragraphs: [
            'La transición de Chile hacia el siglo XX estuvo marcada por profundas transformaciones sociales y la llamada "Cuestión Social".',
            'La riqueza generada por el salitre coexistió con deplorables condiciones de vida para la clase trabajadora.'
          ],
          bullets: [
            { label: 'Cuestión Social', desc: 'Conjunto de problemas laborales, sanitarios y habitacionales de los sectores populares.' },
            { label: 'Crisis del Centenario', desc: 'Descontento intelectual y político en 1910 frente a la oligarquía y el parlamentarismo.' },
            { label: 'Constitución de 1925', desc: 'Puso fin al régimen parlamentario, consagrando el presidencialismo y la separación Iglesia-Estado.' },
            { label: 'Rol del Estado', desc: 'Inicio paulatino de políticas sociales de salud, educación y previsión social.' }
          ]
        };
      }
    }
  }

  // Video controls
  togglePlayVideo() {
    if (this.videoPlaying) {
      this.clearVideoTimer();
      this.videoPlaying = false;
    } else {
      this.videoPlaying = true;
      this.videoInterval = setInterval(() => {
        if (this.videoTime < this.videoDuration) {
          this.videoTime++;
          this.updateVideoCaption();
        } else {
          this.resetVideo();
        }
      }, 1000);
    }
  }

  seekVideo(event: MouseEvent) {
    const bar = event.currentTarget as HTMLElement;
    const rect = bar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const width = rect.width;
    const pct = clickX / width;
    this.videoTime = Math.floor(pct * this.videoDuration);
    this.updateVideoCaption();
  }

  formatVideoTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  resetVideo() {
    this.clearVideoTimer();
    this.videoPlaying = false;
    this.videoTime = 0;
    this.currentCaption = 'Haga click en reproducir para iniciar la clase en video.';
  }

  private clearVideoTimer() {
    if (this.videoInterval) {
      clearInterval(this.videoInterval);
      this.videoInterval = null;
    }
  }

  private updateVideoCaption() {
    const active = this.videoCaptions.find((c, idx) => {
      const next = this.videoCaptions[idx + 1];
      return this.videoTime >= c.time && (!next || this.videoTime < next.time);
    });
    this.currentCaption = active ? active.text : 'Reproduciendo clase en video...';
  }

  // Book controls
  prevBookPage() {
    if (this.bookCurrentPage > 0) this.bookCurrentPage--;
  }

  nextBookPage() {
    if (this.bookCurrentPage < 1) this.bookCurrentPage++;
  }

  getBookPageContent(recurso: Recurso, page: number) {
    const cat = recurso.categoria.toLowerCase();
    const isMath = cat.includes('matemat') || recurso.titulo.toLowerCase().includes('m1') || recurso.titulo.toLowerCase().includes('m2');
    const isScience = cat.includes('ciencia') || cat.includes('físic') || cat.includes('químic') || cat.includes('biolog') || recurso.titulo.toLowerCase().includes('física');
    
    if (isMath) {
      if (page === 1) {
        return {
          title: 'Sección 1: Estrategias PAES de Cálculo Rápido',
          paragraphs: [
            'Para destacar en la prueba PAES M1, no basta con saber los contenidos; el tiempo es tu recurso más valioso.',
            'Aprender a simplificar fracciones y utilizar decimales estratégicamente puede ahorrarte hasta 15 minutos en total.'
          ]
        };
      } else if (page === 2) {
        return {
          title: 'El Secreto de los Tríos Pitagóricos',
          paragraphs: [
            'En preguntas de geometría que involucran triángulos rectángulos, calcular la hipotenusa usando raíz cuadrada toma valioso tiempo.',
            'Los tríos pitagóricos son combinaciones de números enteros que cumplen a² + b² = c².'
          ],
          bullets: [
            { label: 'Trío Básico (3, 4, 5)', desc: 'Si los catetos miden 3 y 4, la hipotenusa mide 5. Aplica también a múltiplos como (6, 8, 10).' },
            { label: 'Trío Medio (5, 12, 13)', desc: 'Muy común en preguntas de trigonometría y vectores.' },
            { label: 'Trío Avanzado (8, 15, 17)', desc: 'Si lo conoces, respondes la pregunta en 5 segundos.' }
          ]
        };
      } else if (page === 3) {
        return {
          title: 'Sección 2: Errores Comunes en Probabilidades',
          paragraphs: [
            'Muchos estudiantes confunden los sucesos mutuamente excluyentes con los sucesos independientes en probabilidad.',
            'Asegúrate de leer con calma si en el problema hay reposición o no en una extracción sucesiva.'
          ]
        };
      } else {
        return {
          title: 'Regla del Producto y Suma',
          paragraphs: [
            'La clave para diferenciar cuándo sumar o cuándo multiplicar probabilidades radica en los conectores lógicos "O" e "Y":'
          ],
          bullets: [
            { label: 'Conector "O" (Unión)', desc: 'Suma de probabilidades. Si son excluyentes: P(A ∪ B) = P(A) + P(B).' },
            { label: 'Conector "Y" (Intersección)', desc: 'Multiplicación de probabilidades. Si son independientes: P(A ∩ B) = P(A) * P(B).' }
          ]
        };
      }
    } else if (isScience) {
      if (page === 1) {
        return {
          title: 'Sección 1: Método Científico y Variables',
          paragraphs: [
            'Las preguntas de Habilidades Científicas representan casi el 30% de la prueba de Ciencias.',
            'Saber identificar las variables en un diseño experimental es la clave absoluta para contestar correctamente.'
          ]
        };
      } else if (page === 2) {
        return {
          title: 'Tipos de Variables en Experimentos',
          paragraphs: [
            'En cualquier experimento controlado diseñado para evaluar hipótesis, debemos distinguir claramente tres tipos de variables:'
          ],
          bullets: [
            { label: 'Variable Independiente', desc: 'La causa. Es la que el experimentador manipula directamente (ej. temperatura).' },
            { label: 'Variable Dependiente', desc: 'El efecto. Es la que se mide y registra como respuesta (ej. velocidad de reacción).' },
            { label: 'Variables Controladas', desc: 'Todas las demás condiciones que deben mantenerse constantes para que el experimento sea válido.' }
          ]
        };
      } else if (page === 3) {
        return {
          title: 'Sección 2: Organización Celular y Organelos',
          paragraphs: [
            'Toda célula es la unidad estructural, funcional y de origen de los seres vivos.',
            'Los organelos eucariontes realizan funciones metabólicas altamente especializadas dentro del citoplasma.'
          ]
        };
      } else {
        return {
          title: 'Organelos Clave en la Célula',
          paragraphs: [
            'A continuación se detallan los organelos con mayor tasa de aparición en la sección de biología:'
          ],
          bullets: [
            { label: 'Mitocondria', desc: 'Central de energía. Produce ATP mediante respiración celular.' },
            { label: 'Ribosomas', desc: 'Síntesis de proteínas. Presentes tanto en procariontes como eucariontes.' },
            { label: 'Cloroplasto', desc: 'Exclusivo de plantas. Realiza la fotosíntesis fijando CO2.' }
          ]
        };
      }
    } else {
      if (page === 1) {
        return {
          title: 'Sección 1: Comprensión de Textos no Literarios',
          paragraphs: [
            'En los textos expositivos e informativos de la PAES, el autor busca entregar datos de manera objetiva.',
            'Estructurar esquemas mentales mientras lees te ayudará a retener ideas clave sin releer.'
          ]
        };
      } else if (page === 2) {
        return {
          title: 'Estrategias Lectoras Efectivas',
          paragraphs: [
            'Para responder preguntas de localización de información de manera expedita:'
          ],
          bullets: [
            { label: 'Rastreo Visual (Scanning)', desc: 'Buscar palabras clave o datos específicos como fechas o nombres rápidamente.' },
            { label: 'Parafraseo', desc: 'Expresar con tus propias palabras lo afirmado en el texto para asegurar la comprensión.' },
            { label: 'Contextualización', desc: 'Deducir el significado de un término complejo analizando las oraciones vecinas.' }
          ]
        };
      } else if (page === 3) {
        return {
          title: 'Sección 2: Formación Ciudadana y Democracia',
          paragraphs: [
            'El eje de Formación Ciudadana en la PAES de Historia evalúa el conocimiento de los derechos humanos y el sistema institucional chileno.',
            'La participación ciudadana es el pilar de una democracia representativa fuerte y cohesionada.'
          ]
        };
      } else {
        return {
          title: 'Conceptos Clave de Educación Cívica',
          paragraphs: [
            'Principios y valores fundamentales consagrados constitucionalmente:'
          ],
          bullets: [
            { label: 'Estado de Derecho', desc: 'El poder está sometido a las leyes y la Constitución, garantizando la igualdad ante la ley.' },
            { label: 'Soberanía Popular', desc: 'El poder reside en el pueblo, quien lo delega en autoridades electas democráticamente.' },
            { label: 'Pluralismo Político', desc: 'Garantía constitucional de la libre expresión de diversas corrientes ideológicas.' }
          ]
        };
      }
    }
  }

  // Quiz controls
  selectQuizAnswer(qId: number, option: string) {
    this.quizAnswers[qId] = option;
  }

  checkQuizAnswers() {
    this.quizSubmitted = true;
  }

  resetQuiz() {
    this.quizAnswers = {};
    this.quizSubmitted = false;
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
