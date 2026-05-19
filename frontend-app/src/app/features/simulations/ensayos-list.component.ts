import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SettingsModalComponent } from '../profile/settings-modal.component';
import { ProfileModalComponent } from '../profile/profile-modal.component';
import { FirestoreService } from '../../core/services/firestore.service';
import { AdminService } from '../admin/services/admin.service';
import { DashboardService } from '../../core/services/dashboard.service';

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
  imports: [CommonModule, RouterModule, SettingsModalComponent, ProfileModalComponent],
  template: `
    <div class="ensayos-container">
      <!-- SIDEBAR -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <a routerLink="/dashboard" class="sidebar-logo" style="text-decoration:none;">
            <span class="text-gradient" [class.pro-logo]="isProPlan()">EstudiaUni</span>
          </a>
        </div>
        
        <nav class="sidebar-nav">
          <a class="nav-item" routerLink="/dashboard">
            <span class="nav-icon">🏠</span>
            <span class="nav-text">Inicio</span>
          </a>
          <a class="nav-item" routerLink="/ruta">
            <span class="nav-icon">🗺️</span>
            <span class="nav-text">Ruta de Aprendizaje</span>
          </a>

          <a class="nav-item active" routerLink="/ensayos">
            <span class="nav-icon">📚</span>
            <span class="nav-text">Ensayos PAES</span>
          </a>
          <a class="nav-item" routerLink="/mini-ensayo">
            <span class="nav-icon">🎯</span>
            <span class="nav-text">Mini Ensayos</span>
          </a>
          <a class="nav-item" routerLink="/mente-veloz">
            <span class="nav-icon">⚡</span>
            <span class="nav-text">Mente Veloz</span>
          </a>
          
          <div class="sidebar-section-title" (click)="toggleHerramientas()">
            HERRAMIENTAS
            <span class="toggle-icon" [style.transform]="herramientasExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'">▼</span>
          </div>
          <div class="sidebar-sub-items" [class.expanded]="herramientasExpanded" [class.collapsible]="isCollapsible">
            <a class="nav-item" routerLink="/encuentra-tu-carrera">
              <span class="nav-icon">🎓</span>
              <span class="nav-text">Encuentra tu Carrera</span>
            </a>
            <a class="nav-item" routerLink="/calculadora-nem">
              <span class="nav-icon">🧮</span>
              <span class="nav-text">Calculadora NEM</span>
            </a>
            <a class="nav-item" routerLink="/recursos">
              <span class="nav-icon">📂</span>
              <span class="nav-text">Recursos Adicionales</span>
            </a>
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

      <!-- MAIN CONTENT -->
      <main class="main-content animate-fade-in">
        <!-- HEADER -->
        <header class="header">
          <div class="header-main-row">
            <div class="header-left">
              <div class="header-content">
                <div class="title-row">
                  <h1 class="title">Ensayos PAES</h1>
                  <div class="status-pill">
                    <span class="status-dot"></span>
                    Temarios 2026 Actualizados
                  </div>
                </div>
                <p class="subtitle">Realiza ensayos completos y simulacros bajo condiciones reales</p>
                
                <!-- COUNTDOWN WIDGET -->
                <div class="countdown-row">
                  <span class="countdown-label">⏳ {{ nextExamLabel }}:</span>
                  <div class="countdown-timer">
                    <div class="time-unit"><span>{{ countdown.days }}</span><label>d</label></div>
                    <div class="time-unit"><span>{{ countdown.hours }}</span><label>h</label></div>
                    <div class="time-unit"><span>{{ countdown.minutes }}</span><label>m</label></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ACTIVE EXAM WIDGET -->
            <div class="header-center" *ngIf="activeProgress">
              <div class="active-exam-widget glass-card">
                <div class="widget-info">
                  <span class="widget-label">PENDIENTE</span>
                  <h4 class="widget-title">{{ activeProgress.examName.startsWith('Ensayo') ? activeProgress.examName : 'Ensayo ' + activeProgress.examName }}</h4>
                </div>
                <button class="btn-resume" (click)="resumeActiveIntento()">
                  Continuar →
                </button>
                <button class="btn-widget-discard" (click)="discardActiveProgress()" title="Eliminar progreso guardado">
                  ×
                </button>
              </div>
            </div>
            
            <div class="header-actions">
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
          </div>
        </header>

        <!-- PRUEBAS -->
        <div class="pruebas-section">
          <div class="pruebas-grid">
            <button
              *ngFor="let prueba of pruebas"
              type="button"
              class="prueba-card"
              (click)="seleccionarPrueba(prueba)"
              [class.prueba-card-selected]="pruebaSeleccionada?.id === prueba.id">
              <div class="card-icon">{{ prueba.icono }}</div>
              <div class="card-header">
                <h3 class="card-title">{{ prueba.nombre }}</h3>
                <p class="card-desc">{{ prueba.descripcion }}</p>
              </div>
            </button>
          </div>

          <div *ngIf="pruebaSeleccionada" class="modal-preparacion" (click)="cerrarSeleccion()">
            <div class="modal-content glass-card" (click)="$event.stopPropagation()">
              <button class="modal-close" (click)="cerrarSeleccion()">×</button>

              <div class="modal-icon">{{ pruebaSeleccionada.icono }}</div>
              <h2 class="modal-title">¿Listo para iniciar {{ getNombreSeleccionado() }}?</h2>

              <div class="modal-message">
                <p class="message-text">
                  Prepárate para rendir {{ getNombreSeleccionado() }}.
                </p>
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
                    (click)="seleccionarSubprueba(sub)"
                    [class.subprueba-card-selected]="subPruebaSeleccionada?.id === sub.id"
                    [class.perfect-gold]="isPerfect(sub.id)">
                    <span class="subprueba-name">
                      {{ sub.nombre }}
                      <span class="gold-badge" *ngIf="isPerfect(sub.id)">🏆</span>
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
                    (click)="seleccionarEnsayo(ensayo)"
                    [class.subprueba-card-selected]="ensayoSeleccionado?.id === ensayo.id"
                    [class.perfect-gold]="isPerfect(ensayo.id)">
                    <span class="subprueba-name">
                      {{ ensayo.nombre }}
                      <span class="gold-badge" *ngIf="isPerfect(ensayo.id)">🏆</span>
                    </span>
                    <span class="subprueba-desc">{{ ensayo.descripcion }}</span>
                  </button>
                </div>
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
        </div>
      </main>
    </div>
    <app-settings-modal *ngIf="showSettingsModal" (close)="showSettingsModal = false"></app-settings-modal>
    <app-profile-modal *ngIf="showProfileModal" (close)="onProfileModalClose()"></app-profile-modal>

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
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: var(--bg-color);
      color: var(--text-primary);
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
    .sidebar-header { 
      padding: 2.5rem 1.5rem 2rem; 
      border-bottom: 1px solid rgba(255,255,255,0.15); 
      text-align: center;
    }
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
      background: rgba(99, 102, 241, 0.25); 
      color: #ffffff; 
      border: 1.5px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
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
      background: rgba(99, 102, 241, 0.18);
      border: 1.5px solid rgba(99, 102, 241, 0.3) !important;
      box-shadow: 0 2px 8px rgba(99, 102, 241, 0.15) !important;
    }
    .sidebar-footer { padding: 1.25rem 0.75rem; border-top: 1px solid rgba(255,255,255,0.1); }
    .logout-btn-sidebar { color: #fca5a5 !important; opacity: 0.8; }
    .logout-btn-sidebar:hover { background: rgba(239, 68, 68, 0.15) !important; color: #ef4444 !important; opacity: 1; }
    .logout-confirm-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: grid; place-items: center; z-index: 11000; padding: 1.5rem; animation: fadeIn 0.2s ease; }
    .logout-confirm-modal { max-width: 420px !important; background: rgba(255,255,255,0.95); border: 2px solid var(--glass-border); border-radius: 24px; box-shadow: 0 20px 50px rgba(0,0,0,0.2); width: 100%; overflow: hidden; }
    .modal-header { padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--glass-border); }
    .modal-header h2 { margin: 0; font-size: 1.25rem; font-weight: 800; color: var(--text-primary); }
    .close-btn { background: none; border: none; font-size: 1.75rem; color: var(--text-muted); cursor: pointer; line-height: 1; }
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

    /* MAIN CONTENT */
    .main-content { 
      flex: 1; 
      margin-left: 260px; 
      padding: 2.5rem; 
    }

    /* HEADER */
    .header {
      margin-bottom: 3rem;
    }
    .header-main-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1.5rem;
    }
    .header-left {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }
    .profile-menu-wrap { position: relative; }
    .profile-trigger { display: flex; align-items: center; justify-content: center; border: 2px solid var(--glass-border); background: #ffffff; color: var(--text-primary); border-radius: 50%; padding: 0.35rem; cursor: pointer; text-decoration: none; transition: all 0.2s; width: 62px; height: 62px; }
    .profile-trigger:hover { border-color: var(--accent-primary); box-shadow: 0 4px 12px rgba(133,92,214,0.1); }
    .profile-avatar-wrap { position: relative; width: 52px; height: 52px; display: inline-block; flex-shrink: 0; }
    .profile-avatar { width: 52px; height: 52px; border-radius: 50%; object-fit: cover; }
    .profile-avatar.fallback { display: grid; place-items: center; background: linear-gradient(135deg, #855cd6, #6b46b8); font-weight: 700; font-size: 0.9rem; border-radius: 50%; width: 100%; height: 100%; color: white; }
    .profile-emoji-badge { position: absolute; right: 0; bottom: 0; background: #111827; border: 1.5px solid rgba(255,255,255,0.2); border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; line-height: 1; z-index: 10; pointer-events: none; }
    .plan-badge { font-size: 0.85rem; letter-spacing: 0.05em; padding: 0.5rem 1rem; border-radius: 999px; font-weight: 800; background: var(--bg-secondary); color: var(--text-secondary); border: 2px solid var(--glass-border); line-height: 1; }
    .plan-badge.pro { background: rgba(245,158,11,0.1); color: #d97706; border-color: rgba(245,158,11,0.3); }
    .plan-badge.admin { background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #fff; border: 2.5px solid #d97706 !important; text-shadow: 0 1px 2px rgba(0,0,0,0.25); box-shadow: 0 0 12px rgba(245,158,11,0.6), inset 0 1px 2px rgba(255,255,255,0.35); }
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

    /* PRUEBA CARD */
    .prueba-card {
      text-align: left;
      background: #ffffff;
      border: 2px solid var(--glass-border);
      border-radius: 20px;
      padding: 2.5rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
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
    }
    .card-header {
      flex: 1;
    }
    .card-title {
      font-size: 1.75rem;
      font-weight: 900;
      margin-bottom: 0.5rem;
      color: #0f172a;
      letter-spacing: -0.02em;
    }
    .card-desc {
      font-size: 1.1rem;
      color: #64748b;
      line-height: 1.5;
      font-weight: 500;
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
      background: rgba(0, 0, 0, 0.75);
      display: flex;
      align-items: flex-start;
      justify-content: center;
      z-index: 1000;
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
      padding: 2.5rem;
      max-width: 560px;
      width: 100%;
      max-height: calc(100vh - 3rem);
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
      top: 1.25rem;
      right: 1.25rem;
      background: rgba(0, 0, 0, 0.05);
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      font-size: 1.5rem;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
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
    .countdown-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-top: 1.25rem;
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
      z-index: 2000;
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

    /* RESPONSIVE */
    @media (max-width: 768px) {
      .sidebar { display: none; }
      .main-content { 
        margin-left: 0; 
        padding: 1.5rem;
      }
      .title { font-size: 1.8rem; }
      .pruebas-grid {
        grid-template-columns: 1fr;
      }
      .modal-content {
        padding: 2rem;
        border-radius: 16px;
      }
      .prueba-detalles {
        grid-template-columns: 1fr;
      }
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

  isCollapsible = false;

  pruebas: Prueba[] = [
    {
      id: 'm1',
      nombre: 'M1',
      icono: '📐',
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
      icono: '📊',
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
      icono: '📖',
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
      icono: '🧬',
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
      icono: '🏛️',
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
  activeProgress: { examId: string; examName: string } | null = null;
  showOverwriteModal = false;
  pendingMode: ExamMode = 'real';

  private readonly STORAGE_KEY = 'estudiauni_active_asistido';

  private router = inject(Router);
  private authService = inject(AuthService);
  public firestoreService = inject(FirestoreService);
  public adminService = inject(AdminService);
  public dashSvc = inject(DashboardService);
  showProfileModal = false;
  showSettingsModal = false;
  showLogoutConfirm = false;
  isProPlan = computed(() => this.firestoreService.profileSignal()?.plan === 'premium');

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
        this.activeProgress = { examId: data.examId, examName: data.examName || data.examId };
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

  discardActiveProgress() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.activeProgress = null;
  }

  iniciarPrueba(mode: ExamMode) {
    if (!this.pruebaSeleccionada) return;

    const ensayoId = this.ensayoSeleccionado?.id ?? this.subPruebaSeleccionada?.id ?? this.pruebaSeleccionada.id;

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
