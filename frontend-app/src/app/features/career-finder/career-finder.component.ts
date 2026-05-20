import { Component, inject, OnInit, signal, computed, ViewChild, ElementRef, AfterViewChecked, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CareerService, Career, CareerFilters } from '../../core/services/career.service';
import { FirestoreService } from '../../core/services/firestore.service';
import { AdminService } from '../admin/services/admin.service';
import { SettingsModalComponent } from '../profile/settings-modal.component';
import { ProfileModalComponent } from '../profile/profile-modal.component';
import { AiAssistService, ChatMessage } from '../../core/services/ai-assist.service';
import { AuthService } from '../../core/services/auth.service';
import { PaymentService } from '../../core/services/payment.service';

@Component({
  selector: 'app-career-finder',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SettingsModalComponent, ProfileModalComponent],
  host: {
    '(document:click)': 'onDocumentClick($event)'
  },
  template: `
    <div class="career-layout">
      <!-- SIDEBAR (Consistente con el resto de la app) -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <a routerLink="/dashboard" class="sidebar-logo" style="text-decoration:none;"><span class="text-gradient" [class.pro-logo]="isProPlan()">EstudiaUni</span></a>
        </div>
        <nav class="sidebar-nav">
          <a class="nav-item" routerLink="/dashboard"><span class="nav-icon">🏠</span><span class="nav-text">Inicio</span></a>
          <a class="nav-item" routerLink="/ruta"><span class="nav-icon">🗺️</span><span class="nav-text">Ruta de Aprendizaje</span></a>
          <a class="nav-item" routerLink="/ensayos"><span class="nav-icon">📚</span><span class="nav-text">Ensayos PAES</span></a>
          <a class="nav-item" routerLink="/mini-ensayo"><span class="nav-icon">🎯</span><span class="nav-text">Mini Ensayos</span></a>
          <a class="nav-item" routerLink="/mente-veloz"><span class="nav-icon">⚡</span><span class="nav-text">Mente Veloz</span></a>
          
          <div class="sidebar-section-title" (click)="toggleHerramientas()">
            HERRAMIENTAS
            <span class="toggle-icon" [style.transform]="herramientasExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'">▼</span>
          </div>
          <div class="sidebar-sub-items" [class.expanded]="herramientasExpanded" [class.collapsible]="isCollapsible">
            <a class="nav-item active" routerLink="/encuentra-tu-carrera"><span class="nav-icon">🎓</span><span class="nav-text">Encuentra tu Carrera</span></a>
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
            <a class="nav-item" routerLink="/ruta" (click)="mobileOpen=false"><span class="nav-icon">🗺️</span><span class="nav-text">Ruta de Aprendizaje</span></a>
            <a class="nav-item" routerLink="/ensayos" (click)="mobileOpen=false"><span class="nav-icon">📚</span><span class="nav-text">Ensayos PAES</span></a>
            <a class="nav-item" routerLink="/mini-ensayo" (click)="mobileOpen=false"><span class="nav-icon">🎯</span><span class="nav-text">Mini Ensayos</span></a>
            <a class="nav-item" routerLink="/mente-veloz" (click)="mobileOpen=false"><span class="nav-icon">⚡</span><span class="nav-text">Mente Veloz</span></a>
            
            <div class="sidebar-section-title" (click)="toggleHerramientas()">
              HERRAMIENTAS
              <span class="toggle-icon" [style.transform]="herramientasExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'">▼</span>
            </div>
            <div class="sidebar-sub-items" [class.expanded]="herramientasExpanded" [class.collapsible]="isCollapsible">
              <a class="nav-item active" routerLink="/encuentra-tu-carrera" (click)="mobileOpen=false"><span class="nav-icon">🎓</span><span class="nav-text">Encuentra tu Carrera</span></a>
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

      <!-- MAIN CONTENT -->
      <main class="main-content animate-fade-in-down">
        <!-- HEADER -->
        <header class="dashboard-header">
          <div class="header-welcome-text">
            <h1 class="header-greeting"><span class="text-gradient">Encuentra tu Carrera</span></h1>
            <p class="subtitle" style="color: rgba(255,255,255,0.7); font-size: 0.95rem; margin: 0; font-weight: 500;">Descubre tu futuro académico basado en tus intereses y ubicación.</p>
          </div>
          
          <div class="welcome-actions">
            <!-- BOTÓN DESPLEGABLE FAVORITOS -->
            <div class="favorites-dropdown-container" *ngIf="favorites().length > 0">
              <button class="btn btn-outline fav-toggle-btn" (click)="showFavorites.set(!showFavorites())" [class.active]="showFavorites()">
                ❤️ Favoritos ({{ favorites().length }})
              </button>
              
              <div class="favorites-wrapper" *ngIf="showFavorites()">
                <h4>Tus Favoritos <span>{{favorites().length}}/5</span></h4>
                <div class="fav-list">
                  <div class="fav-item animate-fade-in" *ngFor="let fav of favorites()">
                    <div class="fav-text">
                      <strong>{{ fav.nombre }}</strong>
                      <span>{{ fav.abreviatura }} • {{ fav.puntajeCorte2025 }} pts</span>
                    </div>
                    <button class="btn-remove-fav" (click)="toggleFavorite(fav)" title="Quitar">
                      <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button *ngIf="!isProPlan() && !adminService.isAdmin()" class="btn-upgrade-pro" (click)="paymentService.openPricingModal()">
              Mejorar a PRO ⚡
            </button>
            <span class="plan-badge" [class.pro]="isProPlan() && !adminService.isAdmin()" [class.admin]="adminService.isAdmin()">
              {{ adminService.isAdmin() ? 'ADMIN' : (isProPlan() ? 'PRO' : 'BASICO') }}
            </span>
            <div class="profile-menu-wrap">
              <button class="profile-trigger" (click)="showProfileModal = true">
                <span class="profile-avatar-wrap">
                  <img *ngIf="firestoreService.profileSignal()?.photoURL; else avatarFallback" [src]="firestoreService.profileSignal()?.photoURL" class="profile-avatar"/>
                  <ng-template #avatarFallback><span class="profile-avatar fallback">{{ profileInitial() }}</span></ng-template>
                </span>
              </button>
              <span class="profile-emoji-badge" *ngIf="firestoreService.profileSignal()?.profileEmoji">{{ firestoreService.profileSignal()?.profileEmoji }}</span>
            </div>
          </div>
        </header>

        <div class="dashboard-body">
          <!-- AI TUTOR PROMO BANNER -->
        <div class="ai-promo-container" *ngIf="!isAiOpen()">
          <div class="ai-promo-banner">
            <div class="ai-promo-content">
              <img src="assets/img/gif.gif" style="width: 32px; height: 32px; object-fit: contain; margin-right: 0.25rem;" alt="Foco" />
              <div class="ai-promo-text">
                <strong>¿Dudas vocacionales?</strong>
                <span>Pregúntale a Foco: "¿Qué podría estudiar?", "¿Qué significa NEM?", etc.</span>
              </div>
            </div>
            <button class="btn btn-primary" (click)="toggleAi()">Abrir</button>
          </div>
        </div>

        <!-- FILTROS -->
        <section class="finder-form glass-card">
          <div class="form-grid">
            <div class="form-group search-group">
              <label>Busca tu carrera</label>
              <div class="input-with-icon">
                <span class="icon">🔍</span>
                <input 
                  type="text" 
                  placeholder="Ej: Ingeniería Civil, Medicina..." 
                  [(ngModel)]="filters.query"
                  (input)="search()"
                >
              </div>
            </div>

            <div class="form-group">
              <label>Ubicación</label>
              <div class="custom-select-container">
                <div class="combobox-wrapper" [class.open]="showLocDropdown()">
                  <input 
                    type="text" 
                    class="combobox-input"
                    [placeholder]="filters.ubicacion || 'Todas las regiones'"
                    [(ngModel)]="locSearchQuery"
                    (focus)="showLocDropdown.set(true); showUniDropdown.set(false)"
                    (input)="searchLocFromInput($event)"
                  >
                  <span class="chevron" [class.open]="showLocDropdown()" (click)="showLocDropdown.set(!showLocDropdown())">▼</span>
                </div>
                
                <div class="custom-dropdown-menu" *ngIf="showLocDropdown()">
                  <div class="options-list">
                    <div class="option" (click)="selectUbicacion('')">Todas las regiones</div>
                    <div 
                      class="option" 
                      *ngFor="let loc of filteredUbicaciones()" 
                      (click)="selectUbicacion(loc)"
                      [class.active]="filters.ubicacion === loc"
                    >
                      {{ loc }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Universidad</label>
              <div class="custom-select-container">
                <div class="combobox-wrapper" [class.open]="showUniDropdown()">
                  <input 
                    type="text" 
                    class="combobox-input"
                    [placeholder]="filters.universidad || 'Todas las instituciones'"
                    [(ngModel)]="uniSearchQuery"
                    (focus)="showUniDropdown.set(true); showLocDropdown.set(false)"
                    (input)="searchUniFromInput($event)"
                  >
                  <span class="chevron" [class.open]="showUniDropdown()" (click)="showUniDropdown.set(!showUniDropdown())">▼</span>
                </div>
                
                <div class="custom-dropdown-menu" *ngIf="showUniDropdown()">
                  <div class="options-list">
                    <div class="option" (click)="selectUniversidad('')">Todas las instituciones</div>
                    <div 
                      class="option" 
                      *ngFor="let uni of filteredUniversidades()" 
                      (click)="selectUniversidad(uni)"
                      [class.active]="filters.universidad === uni"
                    >
                      {{ uni }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="interests-section">
            <label>Selecciona tus intereses y habilidades:</label>
            <div class="interests-grid">
              <button *ngFor="let interest of availableInterests" 
                      class="interest-pill" 
                      [class.active]="isSelected(interest)"
                      (click)="toggleInterest(interest)">
                {{ interest }}
              </button>
            </div>
          </div>
        </section>

        <!-- RESULTADOS -->
        <section class="results-section">
          <!-- WELCOME STATE (When no search yet) -->
          <div *ngIf="!hasSearched()" class="welcome-search">
            <div class="welcome-icon">🎓</div>
            <h2>Comienza tu búsqueda</h2>
            <p>Escribe el nombre de una carrera o selecciona tus intereses para ver recomendaciones personalizadas.</p>
          </div>

          <!-- RESULTS HEADER -->
          <div *ngIf="hasSearched() && filteredCareers().length > 0" class="results-header">
            <h3>{{ filteredCareers().length }} Carreras encontradas</h3>
            <button class="btn-text" (click)="resetFilters()">Limpiar filtros</button>
          </div>

          <!-- CAREERS GRID -->
          <div *ngIf="hasSearched()" class="careers-grid">
            <div *ngFor="let career of visibleCareers()" class="career-card glass-card">
              <div class="card-top">
                <div class="uni-info">
                  <span class="uni-name">{{ career.universidad }}</span>
                  <span class="uni-tag">{{ career.abreviatura }}</span>
                </div>
                <span class="location-badge">📍 {{ career.ubicacion }}</span>
              </div>
              
              <h2 class="career-title">{{ career.nombre }}</h2>
              <p class="career-desc">{{ career.descripcion }}</p>

              <div class="interest-pills">
                <span *ngFor="let int of career.intereses" class="pill">{{ int }}</span>
              </div>

              <div class="score-section">
                <div class="score-header">
                  <span>Ponderación PAES</span>
                  <span class="corte-label">Corte 2025: <strong>{{ career.puntajeCorte2025 }}</strong></span>
                </div>
                <div class="score-grid">
                  <div class="score-item">
                    <span class="val">{{ career.puntajes.nem }}%</span>
                    <span class="lab">NEM</span>
                  </div>
                  <div class="score-item">
                    <span class="val">{{ career.puntajes.ranking }}%</span>
                    <span class="lab">RANK</span>
                  </div>
                  <div class="score-item">
                    <span class="val">{{ career.puntajes.lectora }}%</span>
                    <span class="lab">LECT</span>
                  </div>
                  <div class="score-item">
                    <span class="val">{{ career.puntajes.matematica1 }}%</span>
                    <span class="lab">M1</span>
                  </div>
                  <div class="score-item" *ngIf="career.puntajes.matematica2 > 0">
                    <span class="val">{{ career.puntajes.matematica2 }}%</span>
                    <span class="lab">M2</span>
                  </div>
                  <div class="score-item">
                    <span class="val">{{ career.puntajes.electiva }}%</span>
                    <span class="lab">ELEC</span>
                  </div>
                </div>
              </div>

              <div class="card-footer">
                <button 
                  class="btn btn-outline w-full btn-favorite" 
                  [class.active]="isFavorite(career)"
                  (click)="toggleFavorite(career)">
                  {{ isFavorite(career) ? '❤️ Quitar de favoritos' : '🤍 Agregar a favoritos' }}
                </button>
              </div>
            </div>
          </div>

          <!-- LOAD MORE BUTTON -->
          <div *ngIf="hasSearched() && filteredCareers().length > displayLimit()" class="load-more">
            <button class="btn btn-primary" (click)="loadMore()">Ver más carreras ({{ remainingCount() }} restantes)</button>
          </div>

          <!-- EMPTY STATE (No results found) -->
          <div *ngIf="hasSearched() && filteredCareers().length === 0" class="empty-state">
            <span class="empty-icon">🔎</span>
            <p>No encontramos carreras que coincidan con tu búsqueda.</p>
            <button class="btn btn-primary" (click)="resetFilters()">Ver todas las carreras</button>
          </div>
        </section>

        <!-- TOAST NOTIFICATION -->
        <div class="custom-toast" *ngIf="toastMessage()">
          <span class="toast-icon">⚠️</span>
          {{ toastMessage() }}
        </div>
        </div>
      </main>

      <!-- AI CHAT PANEL -->
      <aside class="ai-panel" [class.open]="isAiOpen()">
        <div class="ai-header">
          <div class="ai-header-left">
            <div class="ai-avatar">
              <img src="assets/img/gif.gif" alt="Foco" style="width: 100%; height: 100%; object-fit: contain;">
            </div>
            <div>
              <h4 class="ai-title">Foco, tu Pulpo Orientador</h4>
              <span class="ai-status">{{ aiLoading ? 'Pensando...' : 'En línea' }}</span>
            </div>
          </div>
          <div style="display:flex; gap:0.5rem">
            <button class="btn-icon-sm" (click)="clearChat()" title="Limpiar chat">🗑️</button>
            <button class="btn-icon-sm" (click)="toggleAi()" title="Cerrar">✕</button>
          </div>
        </div>

        <div class="ai-messages" #chatScrollContainer>
          <div *ngIf="aiMessages().length === 0" class="ai-empty-state">
            <p>¿Tienes preguntas? Foco está listo para guiarte en tu futuro vocacional. Pregúntame sobre carreras, universidades, ponderaciones o empleabilidad.</p>
          </div>
          <div
            *ngFor="let msg of aiMessages()"
            class="ai-bubble"
            [class.user]="msg.role === 'user'"
            [class.assistant]="msg.role === 'assistant'">
            <div class="bubble-role">{{ msg.role === 'user' ? 'Tú' : '🐙 Foco' }}</div>
            <div class="bubble-content" [innerHTML]="formatAiMessage(msg.content)"></div>
            <div class="bubble-time" *ngIf="msg.timestamp">
              {{ msg.timestamp | date:'HH:mm' }}
            </div>
          </div>
          <div *ngIf="aiLoading" class="ai-bubble assistant loading-bubble">
            <div class="bubble-role">🐙 Foco</div>
            <div class="typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="ai-quick-actions">
          <button class="quick-btn" (click)="sendQuickMessage('No sé qué estudiar, ¿me ayudas a decidir?')" [disabled]="aiLoading">
            🧭 Orientación
          </button>
          <button class="quick-btn" (click)="sendQuickMessage('Dime, ¿qué podría estudiar según mis intereses?')" [disabled]="aiLoading">
            💡 ¿Qué estudiar?
          </button>
          <button class="quick-btn" (click)="sendQuickMessage('¿Qué carreras tienen mejor empleabilidad?')" [disabled]="aiLoading">
            💼 Empleabilidad
          </button>
          <button class="quick-btn" (click)="sendQuickMessage('¿Cómo funciona la Gratuidad y qué becas existen?')" [disabled]="aiLoading">
            💰 Becas y Gratuidad
          </button>
        </div>

        <!-- Chat Input -->
        <div class="ai-input-area">
          <textarea
            class="ai-input"
            [(ngModel)]="chatInputText"
            (keydown.enter)="onEnterKey($event)"
            [disabled]="aiLoading"
            placeholder="Escribe tu pregunta... (Enter para enviar)"
            rows="2"
            maxlength="300">
          </textarea>
          <button
            class="btn-send"
            (click)="sendChatMessage()"
            [disabled]="aiLoading || !chatInputText.trim()">
            <span *ngIf="!aiLoading">➤</span>
            <span *ngIf="aiLoading" class="spinner-sm">⏳</span>
          </button>
        </div>
      </aside>
    </div>

    <app-settings-modal *ngIf="showSettingsModal" (close)="showSettingsModal = false"></app-settings-modal>
    <app-profile-modal *ngIf="showProfileModal" (close)="showProfileModal = false"></app-profile-modal>

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
    .career-layout { display: flex; min-height: 100vh; background: var(--bg-color); }
    
    /* SIDEBAR */
    .sidebar { width: 260px; background: rgba(13, 15, 23, 0.95); border-right: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; height: 100vh; z-index: 100; }
    .sidebar-header { padding: 2.5rem 1.5rem 2rem; border-bottom: 1px solid rgba(255,255,255,0.15); text-align: center; }
    .sidebar-logo { font-family: var(--font-heading); font-size: 2.2rem; font-weight: 900; background: linear-gradient(135deg, #ffffff 40%, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -0.04em; text-shadow: 0 0 15px rgba(139, 92, 246, 0.3); position: relative; }
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
    .nav-item:hover { background: rgba(255, 255, 255, 0.12); color: #fff; transform: translateX(4px); }
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

    /* MOBILE HEADER */
    .mobile-header { display: none; position: fixed; top: 0; left: 0; right: 0; height: 60px; background: rgba(13,15,23,0.95); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.1); padding: 0 1rem; align-items: center; gap: 1rem; z-index: 101; }
    .mobile-menu-btn { background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; }
    .mobile-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 200; }
    .mobile-overlay.open { display: block; }
    .mobile-menu { position: absolute; top: 0; left: 0; width: 280px; height: 100%; background: #0d0f17; padding: 2rem 1rem; }

    /* MAIN CONTENT */
    .main-content { flex: 1; overflow-y: auto; background: var(--bg-color); }

    /* FINDER FORM */
    .finder-form { padding: 2rem; margin-bottom: 2.5rem; }
    .form-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .form-group label { font-size: 0.9rem; font-weight: 700; color: var(--text-primary); }
    .form-group input, .form-group select { padding: 0.8rem 1rem; border-radius: 12px; border: 2px solid var(--glass-border); background: var(--bg-secondary); font-family: inherit; font-size: 1rem; outline: none; transition: border-color 0.2s; }
    .form-group input:focus, .form-group select:focus { border-color: var(--accent-primary); }

    /* CUSTOM SEARCHABLE SELECT (COMBOBOX) */
    .custom-select-container { position: relative; width: 100%; }
    .combobox-wrapper { 
      position: relative; border-radius: 12px; border: 2px solid var(--glass-border); 
      background: var(--bg-secondary); display: flex; align-items: center; 
      transition: all 0.2s; min-height: 48px; padding-right: 1rem;
    }
    .combobox-wrapper:hover, .combobox-wrapper.open { border-color: var(--accent-primary); }
    
    .combobox-input { 
      width: 100%; border: none !important; background: transparent; padding: 0.8rem 1rem; 
      font-family: inherit; font-size: 1rem; color: var(--text-primary); outline: none !important;
      box-shadow: none !important;
    }
    .combobox-input:focus { outline: none !important; border: none !important; box-shadow: none !important; }
    .combobox-input::placeholder { color: var(--text-primary); opacity: 0.7; }
    
    .chevron { font-size: 0.8rem; transition: transform 0.2s; opacity: 0.5; cursor: pointer; }
    .chevron.open { transform: rotate(180deg); }

    .custom-dropdown-menu { 
      position: absolute; top: calc(100% + 8px); left: 0; right: 0; 
      background: #ffffff; border: 2px solid var(--glass-border); 
      border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); 
      z-index: 50; max-height: 300px; display: flex; flex-direction: column;
      overflow: hidden; animation: slideDown 0.2s ease-out;
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .options-list { overflow-y: auto; flex: 1; padding: 0.5rem; }
    .option { 
      padding: 0.75rem 1rem; border-radius: 8px; cursor: pointer; 
      transition: all 0.2s; font-size: 0.95rem; color: var(--text-secondary);
    }
    .option:hover { background: rgba(133,92,214,0.05); color: var(--accent-primary); }
    .option.active { background: rgba(133,92,214,0.1); color: var(--accent-primary); font-weight: 700; }

    .input-with-icon { position: relative; }
    .input-with-icon .icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); opacity: 0.5; }
    .input-with-icon input { padding-left: 2.8rem; width: 100%; }

    .interests-section { margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--glass-border); }
    .interests-section label { display: block; font-size: 0.95rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-primary); }
    .interests-grid { display: flex; flex-wrap: wrap; gap: 0.75rem; }
    .interest-pill { padding: 0.6rem 1.25rem; border-radius: 999px; border: 2px solid var(--glass-border); background: #ffffff; color: var(--text-secondary); cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); font-weight: 600; font-size: 0.9rem; }
    .interest-pill:hover { border-color: var(--accent-primary); background: rgba(133,92,214,0.05); transform: translateY(-2px); }
    .interest-pill.active { background: var(--accent-primary); color: white; border-color: var(--accent-primary); box-shadow: 0 4px 12px rgba(133,92,214,0.3); }

    .results-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .results-header h3 { font-size: 1.2rem; font-weight: 700; }
    .btn-text { background: none; border: none; color: var(--accent-primary); font-weight: 700; cursor: pointer; text-decoration: underline; }

    .careers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
    .career-card { padding: 1.5rem; display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s; }
    .career-card:hover { transform: translateY(-4px); box-shadow: 0 15px 30px rgba(0,0,0,0.08); }
    .card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
    .uni-info { display: flex; flex-direction: column; }
    .uni-name { font-size: 0.85rem; font-weight: 600; color: var(--text-muted); }
    .uni-tag { font-size: 0.75rem; font-weight: 800; color: var(--accent-primary); text-transform: uppercase; }
    .location-badge { font-size: 0.8rem; color: var(--text-secondary); font-weight: 600; }

    .career-title { font-size: 1.4rem; font-weight: 800; margin-bottom: 0.75rem; color: var(--text-primary); font-family: var(--font-heading); }
    .career-desc { font-size: 0.95rem; color: var(--text-secondary); margin-bottom: 1.25rem; line-height: 1.5; flex-grow: 1; }

    .interest-pills { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.5rem; }
    .pill { font-size: 0.75rem; background: var(--bg-secondary); color: var(--text-secondary); padding: 0.25rem 0.6rem; border-radius: 6px; font-weight: 600; }

    .score-section { background: rgba(0,0,0,0.02); padding: 1rem; border-radius: 12px; margin-bottom: 1.5rem; }
    .score-header { display: flex; justify-content: space-between; margin-bottom: 0.75rem; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); }
    .corte-label strong { color: var(--accent-orange); font-size: 1rem; }
    .score-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(50px, 1fr)); gap: 0.5rem; }
    .score-item { display: flex; flex-direction: column; align-items: center; background: white; padding: 0.5rem; border-radius: 8px; border: 1px solid var(--glass-border); }
    .score-item .val { font-size: 0.9rem; font-weight: 800; color: var(--text-primary); }
    .score-item .lab { font-size: 0.65rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; }

    .empty-state { text-align: center; padding: 4rem 2rem; }
    .empty-icon { font-size: 4rem; display: block; margin-bottom: 1rem; opacity: 0.5; }
    .empty-state p { font-size: 1.2rem; color: var(--text-secondary); margin-bottom: 1.5rem; }

    /* WELCOME SEARCH */
    .welcome-search { text-align: center; padding: 6rem 2rem; background: rgba(255,255,255,0.4); border-radius: 24px; border: 2px dashed var(--glass-border); }
    .welcome-icon { font-size: 5rem; margin-bottom: 1.5rem; display: block; }
    .welcome-search h2 { font-size: 2.2rem; font-weight: 800; margin-bottom: 1rem; color: var(--text-primary); }
    .welcome-search p { font-size: 1.2rem; color: var(--text-secondary); max-width: 500px; margin: 0 auto; }

    /* LOAD MORE */
    .load-more { display: flex; justify-content: center; margin-top: 3rem; }
    .load-more .btn { padding: 1rem 2.5rem; font-size: 1.1rem; border-radius: 14px; }

    /* AI PROMO BANNER */
    .ai-promo-container { display: flex; margin-bottom: 1.5rem; }
    .ai-promo-banner { display: inline-flex; justify-content: space-between; align-items: center; padding: 0.4rem 0.5rem 0.4rem 1rem; border-radius: 999px; background: linear-gradient(135deg, rgba(99,102,241,0.08), rgba(168,85,247,0.08)); border: 1px solid rgba(99,102,241,0.2); gap: 1rem; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
    .ai-promo-content { display: flex; align-items: center; gap: 0.5rem; }
    .ai-icon { font-size: 1.25rem; }
    .ai-promo-text { display: flex; align-items: center; gap: 0.35rem; }
    .ai-promo-text strong { font-size: 0.85rem; color: var(--text-primary); font-weight: 700; }
    .ai-promo-text span { color: var(--text-secondary); font-size: 0.85rem; }
    .ai-promo-banner .btn { padding: 0.35rem 1rem; font-size: 0.8rem; border-radius: 999px; font-weight: 700; }

    /* AI PANEL (Floating Sidebar) */
    .ai-panel {
      position: fixed; top: 0; right: -400px; width: 380px; height: 100vh;
      background: #ffffff; border-left: 1px solid var(--glass-border);
      display: flex; flex-direction: column; transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1000; box-shadow: -5px 0 25px rgba(0,0,0,0.1);
    }
    .ai-panel.open { right: 0; }
    
    .ai-header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; background: #f8fafc; border-bottom: 1px solid var(--glass-border); }
    .ai-header-left { display: flex; align-items: center; gap: 0.75rem; }
    .ai-avatar { width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .ai-title { margin: 0; font-size: 1rem; font-weight: 700; color: #1e293b; }
    .ai-status { font-size: 0.75rem; color: #10b981; font-weight: 600; }
    .btn-icon-sm { background: none; border: none; font-size: 1.1rem; cursor: pointer; color: #64748b; padding: 0.2rem; transition: color 0.2s; border-radius: 4px;}
    .btn-icon-sm:hover { color: #1e293b; background: #e2e8f0; }
    
    .ai-empty-state { text-align: center; padding: 2rem; color: #64748b; margin-top: auto; margin-bottom: auto;}
    .ai-avatar-lg { font-size: 3rem; margin-bottom: 1rem; }

    .ai-messages { flex: 1; overflow-y: auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; background: #f8fafc; scroll-behavior: smooth; }
    .ai-messages::-webkit-scrollbar { width: 6px; }
    .ai-messages::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
    .ai-bubble { max-width: 85%; padding: 1rem; border-radius: 12px; position: relative; animation: slideIn 0.3s ease-out; }
    @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .ai-bubble.user { background: #3b82f6; color: #ffffff; align-self: flex-end; border-bottom-right-radius: 4px; }
    .ai-bubble.assistant { background: #ffffff; color: #1e293b; align-self: flex-start; border-bottom-left-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
    
    .bubble-role { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; margin-bottom: 0.25rem; opacity: 0.8; }
    .ai-bubble.user .bubble-role { color: #bfdbfe; }
    .ai-bubble.assistant .bubble-role { color: #64748b; }
    .bubble-content { font-size: 0.95rem; line-height: 1.5; }
    ::ng-deep .bubble-content p { margin-bottom: 0.5rem; }
    ::ng-deep .bubble-content p:last-child { margin-bottom: 0; }
    ::ng-deep .bubble-content strong { font-weight: 700; }
    ::ng-deep .bubble-content ul, ::ng-deep .bubble-content ol { padding-left: 1.5rem; margin-bottom: 0.5rem; }
    .bubble-time { font-size: 0.65rem; text-align: right; margin-top: 0.5rem; opacity: 0.7; }

    .ai-quick-actions { display: flex; flex-wrap: wrap; gap: 0.5rem; padding: 1rem 1.25rem 0.5rem; background: #ffffff; border-top: 1px solid #e2e8f0;}
    .quick-btn { background: #f1f5f9; border: 1px solid #cbd5e1; color: #475569; padding: 0.4rem 0.8rem; border-radius: 999px; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .quick-btn:hover:not(:disabled) { background: #e0e7ff; border-color: #a5b4fc; color: #4338ca; }
    .quick-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    .ai-input-area { padding: 1rem 1.25rem; background: #ffffff; display: flex; gap: 0.75rem; align-items: flex-end; }
    .ai-input { flex: 1; border: 2px solid #e2e8f0; border-radius: 12px; padding: 0.75rem 1rem; font-family: inherit; font-size: 0.95rem; resize: none; background: #f8fafc; transition: border-color 0.2s; outline: none; }
    .ai-input:focus { border-color: #3b82f6; background: #ffffff; }
    .ai-input:disabled { background: #f1f5f9; cursor: not-allowed; }
    .btn-send { width: 44px; height: 44px; border-radius: 12px; background: #3b82f6; border: none; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; flex-shrink: 0; font-size: 1.2rem; }
    .btn-send:hover:not(:disabled) { background: #2563eb; transform: scale(1.05); }
    .btn-send:disabled { background: #94a3b8; cursor: not-allowed; transform: none; }

    /* Typing indicator */
    .typing-indicator { display: flex; gap: 4px; padding: 0.5rem 0; }
    .typing-indicator span { width: 6px; height: 6px; background: #94a3b8; border-radius: 50%; animation: bounce 1.4s infinite ease-in-out both; }
    .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
    .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
    @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }

    /* FAVORITES DROPDOWN */
    .favorites-dropdown-container {
      position: relative;
    }
    .fav-toggle-btn {
      padding: 0.4rem 1rem;
      border-radius: 999px;
      font-weight: 700;
      font-size: 0.85rem;
      background: #ffffff;
      transition: all 0.2s;
    }
    .fav-toggle-btn:hover, .fav-toggle-btn.active {
      background: #fef2f2;
      border-color: #fca5a5;
      color: #ef4444;
    }

    .favorites-wrapper {
      background: #ffffff;
      border: 1px solid var(--glass-border);
      border-radius: 16px;
      padding: 1.25rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
      width: 380px;
      position: absolute;
      right: 0;
      top: calc(100% + 0.5rem);
      z-index: 50;
      transform-origin: top right;
      animation: scaleIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    .favorites-wrapper h4 {
      font-size: 0.95rem;
      color: var(--text-primary);
      margin: 0 0 1rem 0;
      font-weight: 800;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .favorites-wrapper h4 span {
      background: #f1f5f9;
      padding: 0.2rem 0.6rem;
      border-radius: 999px;
      font-size: 0.75rem;
      color: var(--text-secondary);
    }
    .fav-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-height: 250px;
      overflow-y: auto;
      padding-right: 0.25rem;
    }
    .fav-list::-webkit-scrollbar { width: 4px; }
    .fav-list::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
    
    .fav-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f8fafc;
      border-radius: 10px;
      padding: 0.75rem;
      border: 1px solid #e2e8f0;
      transition: all 0.2s;
    }
    .fav-item:hover {
      background: #ffffff;
      border-color: #cbd5e1;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }
    .fav-text {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
    }
    .fav-text strong {
      font-size: 0.85rem;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 0.15rem;
    }
    .fav-text span {
      font-size: 0.75rem;
      color: var(--text-secondary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .btn-remove-fav {
      background: #fee2e2;
      border: none;
      color: #ef4444;
      font-size: 1rem;
      cursor: pointer;
      border-radius: 8px;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      flex-shrink: 0;
      margin-left: 0.75rem;
    }
    .btn-remove-fav:hover {
      background: #fecaca;
      transform: scale(1.05);
    }
    .btn-favorite {
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    .btn-favorite.active {
      background: #fef2f2;
      color: #ef4444;
      border-color: #fca5a5;
    }
    .btn-favorite.active:hover {
      background: #fee2e2;
    }

    /* TOAST NOTIFICATION */
    .custom-toast {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      background: #1e293b;
      color: white;
      padding: 0.85rem 1.5rem;
      border-radius: 999px;
      font-weight: 600;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      z-index: 9999;
      animation: slideUpToast 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    @keyframes slideUpToast {
      from { bottom: -2rem; opacity: 0; }
      to { bottom: 2rem; opacity: 1; }
    }

    @media (max-width: 1024px) {
      .form-grid { grid-template-columns: 1fr 1fr; }
      .ai-promo-text span { display: none; } /* Hide extra text on small screens */
      .favorites-wrapper { position: relative; width: 100%; margin-bottom: 1.5rem; }
    }


    @media (max-width: 768px) {
      .sidebar { display: none; }
      .mobile-header { display: flex; }
      .main-content { margin-left: 0; padding: 80px 1.5rem 2rem; max-width: 100%; }
      .form-grid { grid-template-columns: 1fr; }
      .page-header h1 { font-size: 2.2rem; }
      .careers-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class CareerFinderComponent implements OnInit {
  private careerService = inject(CareerService);
  public firestoreService = inject(FirestoreService);
  public adminService = inject(AdminService);
  private aiService = inject(AiAssistService);
  private router = inject(Router);
  private authService = inject(AuthService);
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

  @ViewChild('chatScrollContainer') private chatScrollContainer!: ElementRef;

  mobileOpen = false;
  showSettingsModal = false;
  showProfileModal = false;
  showLogoutConfirm = false;

  careers = signal<Career[]>([]);
  ubicaciones = signal<string[]>([]);
  universidades = signal<string[]>([]);
  areas = signal<string[]>([]);
  filteredCareers = signal<Career[]>([]);
  displayLimit = signal<number>(8);
  hasSearched = signal<boolean>(false);

  // Searchable dropdown state
  locSearchQuery = signal<string>('');
  uniSearchQuery = signal<string>('');
  showLocDropdown = signal<boolean>(false);
  showUniDropdown = signal<boolean>(false);

  // AI Assistant state
  isAiOpen = signal<boolean>(false);
  aiMessages = signal<ChatMessage[]>([]);
  aiLoading = false;
  chatInputText = '';

  // Favorites state
  favorites = signal<any[]>([]);
  showFavorites = signal<boolean>(false);
  toastMessage = signal<string>('');

  constructor() {
    // Sync from Firestore profile if user is logged in
    effect(() => {
      const profile = this.firestoreService.profileSignal();
      if (profile && profile.favoriteCareers && this.favorites().length === 0) {
        this.favorites.set(profile.favoriteCareers);
      }
    }, { allowSignalWrites: true });
  }

  showToast(msg: string) {
    this.toastMessage.set(msg);
    setTimeout(() => this.toastMessage.set(''), 3500);
  }

  private normalize(str: string): string {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  filteredUbicaciones = computed(() => {
    const query = this.normalize(this.locSearchQuery());
    return this.ubicaciones().filter(l => this.normalize(l).includes(query));
  });

  filteredUniversidades = computed(() => {
    const query = this.normalize(this.uniSearchQuery());
    return this.universidades().filter(u => this.normalize(u).includes(query));
  });

  visibleCareers = computed(() => this.filteredCareers().slice(0, this.displayLimit()));
  remainingCount = computed(() => Math.max(0, this.filteredCareers().length - this.displayLimit()));

  filters: CareerFilters = {
    query: '',
    ubicacion: '',
    universidad: '',
    area: '',
    intereses: []
  };

  availableInterests = [
    'Ingeniería', 'Matemáticas', 'Tecnología', 'Ciencias', 'Salud', 'Justicia', 
    'Lectura', 'Diseño', 'Negocios', 'Ayuda social', 'Innovación',
    'Programación', 'Enseñanza', 'Investigación', 'Liderazgo',
    'Historia', 'Geografía', 'Arte', 'Biología', 'Química', 'Física',
    'Derecho', 'Arquitectura', 'Música', 'Economía'
  ];

  isProPlan = computed(() => this.firestoreService.profileSignal()?.plan === 'premium');
  profileInitial = computed(() => this.firestoreService.profileSignal()?.displayName?.charAt(0).toUpperCase() || 'U');

  async ngOnInit() {
    // 1. Try to load favorites from localStorage for immediate feedback
    const localFavs = localStorage.getItem('estudiauni_favorite_careers');
    if (localFavs) {
      try {
        this.favorites.set(JSON.parse(localFavs));
      } catch (e) {}
    }

    this.careerService.getUbicaciones().subscribe(data => this.ubicaciones.set(data));
    this.careerService.getUniversidades().subscribe(data => this.universidades.set(data));
    this.careerService.getAreas().subscribe(data => this.areas.set(data));
  }

  selectUbicacion(loc: string) {
    this.filters.ubicacion = loc;
    this.showLocDropdown.set(false);
    this.locSearchQuery.set('');
    this.search();
  }

  selectUniversidad(uni: string) {
    this.filters.universidad = uni;
    this.showUniDropdown.set(false);
    this.uniSearchQuery.set('');
    this.search();
  }

  searchLocFromInput(event: any) {
    this.showLocDropdown.set(true);
    this.locSearchQuery.set(event.target.value);
  }

  searchUniFromInput(event: any) {
    this.showUniDropdown.set(true);
    this.uniSearchQuery.set(event.target.value);
  }

  search() {
    if (!this.filters.query && (!this.filters.intereses || this.filters.intereses.length === 0) && !this.filters.ubicacion && !this.filters.universidad) {
      this.hasSearched.set(false);
      this.filteredCareers.set([]);
      return;
    }

    this.hasSearched.set(true);
    this.displayLimit.set(8);
    this.careerService.recommendCareers(this.filters).subscribe(data => {
      this.filteredCareers.set(data);
    });
  }

  loadMore() {
    this.displayLimit.update(l => l + 8);
  }

  toggleInterest(interest: string) {
    if (!this.filters.intereses) this.filters.intereses = [];
    const idx = this.filters.intereses.indexOf(interest);
    
    if (idx >= 0) {
      this.filters.intereses.splice(idx, 1);
    } else {
      this.filters.intereses.push(interest);
    }
    this.search();
  }

  isSelected(interest: string): boolean {
    return this.filters.intereses?.includes(interest) || false;
  }

  resetFilters() {
    this.filters = {
      query: '',
      ubicacion: '',
      universidad: '',
      area: '',
      intereses: []
    };
    this.hasSearched.set(false);
    this.filteredCareers.set([]);
    this.displayLimit.set(8);
  }

  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-select-container')) {
      this.showLocDropdown.set(false);
      this.showUniDropdown.set(false);
    }
  }

  // --- AI ASSISTANT LOGIC ---
  toggleAi() {
    this.isAiOpen.set(!this.isAiOpen());
    if (this.isAiOpen()) {
      setTimeout(() => this.scrollChatToBottom(), 100);
    }
  }

  clearChat() {
    this.aiMessages.set([]);
  }

  sendQuickMessage(text: string) {
    this.chatInputText = text;
    this.sendChatMessage();
  }

  onEnterKey(event: Event) {
    event.preventDefault();
    this.sendChatMessage();
  }

  async sendChatMessage() {
    const text = this.chatInputText.trim();
    if (!text || this.aiLoading) return;

    this.chatInputText = '';
    const userMsg: ChatMessage = { role: 'user', content: text, timestamp: new Date() };
    this.aiMessages.update(msgs => [...msgs, userMsg]);
    this.scrollChatToBottom();
    this.aiLoading = true;

    // Build context
    const recentMessages = this.aiMessages().slice(-6).map(m => ({
      role: m.role,
      content: m.content
    }));

    // Generate a context summarizing current state
    const prompt = `Eres Foco, la mascota oficial y orientador vocacional de EstudiaUni.cl. Eres un pulpo súper inteligente, entusiasta y amigable de 8 tentáculos. Tu rol es guiar a los estudiantes en sus dudas vocacionales con calidez, cercanía y mucha motivación.

PERSONALIDAD Y TONO DE FOCO:
- ¡Eres un pulpo! Usa metáforas marinas u oceanográficas de forma sutil, dinámica y divertida en tus explicaciones (ej. "mar de dudas", "corrientes de ideas", "navegar por tu futuro", "desenredar con mis tentáculos"), pero NUNCA las uses en saludos repetitivos.
- Sé sumamente empático, motivador y usa un español chileno sutil y cercano, perfecto para estudiantes de enseñanza media (ej. "¡Dale!", "¡Súper!", "¡Excelente!", "¡Vamos con todo!").
- En lugar de respuestas genéricas de IA, tu personalidad es vibrante, alegre y llena de emojis marinos y de luz (🐙, 💡, 🌊, 🧠, ✨).

REGLAS DE RESOLUCIÓN PEDAGÓGICA (ESTRICTAS):
- SIN INTRODUCCIONES REPETITIVAS (CRÍTICO): NUNCA incluyas saludos repetitivos, presentaciones o introducciones largas en tus respuestas (ej. evita decir "¡Hola!", "¡Vamos a sumergirnos!", "¡Hola crack!", "mis tentáculos están listos para...", etc.). Ve DIRECTAMENTE al grano, a la pista o a la pregunta en tu primer párrafo, sin rodeos tediosos para que la interacción fluya de forma ágil y rápida.
- INTERACCIÓN PASO A PASO (CRÍTICO): NUNCA respondas a tus propias preguntas ni simules diálogos interactivos de ida y vuelta contigo mismo en una sola respuesta. Haz una única pregunta de reflexión o entrega una única pista inicial a la vez, deteniendo tu respuesta para esperar a que el estudiante interactúe y responda antes de avanzar al siguiente paso de la resolución.
- Sé conciso y directo: responde de forma breve (idealmente entre 2 y 4 párrafos cortos) para no abrumar al estudiante, pero asegúrate de terminar SIEMPRE tus oraciones e ideas de forma completa y redonda.
- FINALIZACIÓN OBLIGATORIA: Bajo ninguna circunstancia dejes una respuesta incompleta, una oración a medias o una explicación truncada. Cada mensaje tuyo debe tener un cierre perfecto y coherente.
- Si te preguntan por detalles específicos de carreras en Chile (puntajes de corte, ponderaciones, duración, empleabilidad, gratuidad) da la mejor estimación/guía si no tienes el dato exacto, pero advierte con cariño que el estudiante debe corroborar la información en los canales oficiales de DEMRE y del Ministerio de Educación.

Responde esta consulta del usuario: "${text}"`;

    try {
      const reply = await this.aiService.askQuestion(prompt, recentMessages);
      
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: reply || 'Lo siento, tuve un problema procesando tu mensaje.',
        timestamp: new Date()
      };
      
      this.aiMessages.update(msgs => [...msgs, assistantMsg]);
    } catch (error) {
      console.error('Error in chat:', error);
      this.aiMessages.update(msgs => [...msgs, { 
        role: 'assistant', 
        content: 'Hubo un error de conexión con mi servidor. Por favor intenta de nuevo.', 
        timestamp: new Date() 
      }]);
    } finally {
      this.aiLoading = false;
      this.scrollChatToBottom();
    }
  }

  private scrollChatToBottom() {
    setTimeout(() => {
      try {
        if (this.chatScrollContainer?.nativeElement) {
          const el = this.chatScrollContainer.nativeElement;
          el.scrollTop = el.scrollHeight;
        }
      } catch (err) {}
    }, 100);
  }

  formatAiMessage(text: string): string {
    if (!text) return '';
    let html = text;
    // Negritas: **texto** -> <strong>texto</strong>
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Itálicas: *palabra* -> <em>palabra</em> (solo para palabras individuales, evitando multiplicar expresiones matemáticas como 3 * x * y)
    html = html.replace(/\*([a-zA-ZáéíóúÁÉÍÓÚñÑ]+)\*/g, '<em>$1</em>');
    // Saltos de línea: \n -> <br>
    html = html.replace(/\n/g, '<br>');
    return html;
  }

  // --- FAVORITES LOGIC ---
  isFavorite(career: any): boolean {
    return this.favorites().some(f => f.nombre === career.nombre && f.universidad === career.universidad);
  }

  async saveFavoritesToProfile(newFavorites: any[]) {
    // Guardar en localStorage para respuesta rápida
    localStorage.setItem('estudiauni_favorite_careers', JSON.stringify(newFavorites));
    
    // Guardar en Firestore si el usuario está conectado
    const profile = this.firestoreService.profileSignal();
    if (profile && profile.uid) {
      await this.firestoreService.updateProfileSettings({ favoriteCareers: newFavorites });
      // Actualizar la señal del perfil para mantener consistencia
      this.firestoreService.profileSignal.set({ ...profile, favoriteCareers: newFavorites });
    }
  }

  toggleFavorite(career: any) {
    const current = this.favorites();
    const index = current.findIndex(f => f.nombre === career.nombre && f.universidad === career.universidad);
    
    if (index > -1) {
      const newList = current.filter((_, i) => i !== index);
      this.favorites.set(newList);
      this.saveFavoritesToProfile(newList);
      if (newList.length === 0) {
        this.showFavorites.set(false); // Close dropdown if empty
      }
    } else {
      if (current.length < 5) {
        const newList = [...current, career];
        this.favorites.set(newList);
        this.saveFavoritesToProfile(newList);
        this.showFavorites.set(true); // Auto-open when adding
      } else {
        this.showToast('Límite alcanzado: Tienes 5 favoritos. Elimina uno para agregar otro.');
      }
    }
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
