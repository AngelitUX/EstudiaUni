import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MiniEnsayoService } from '../../core/services/mini-ensayo.service';
import { MateriaId } from '../learning-path/models/paes.models';
import { SettingsModalComponent } from '../profile/settings-modal.component';
import { ProfileModalComponent } from '../profile/profile-modal.component';
import { FirestoreService } from '../../core/services/firestore.service';
import { AdminService } from '../admin/services/admin.service';
import { AuthService } from '../../core/services/auth.service';


interface MateriaOption {
  id: MateriaId;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-mini-ensayo-setup',
  standalone: true,
  imports: [CommonModule, RouterLink, SettingsModalComponent, ProfileModalComponent],
  template: `
    <div class="dashboard-layout">
      
      <!-- SIDEBAR -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <a routerLink="/dashboard" class="sidebar-logo" style="text-decoration:none;"><span class="text-gradient">EstudiaUni</span></a>
        </div>
        <nav class="sidebar-nav">
          <a class="nav-item" routerLink="/dashboard"><span class="nav-icon">🏠</span><span class="nav-text">Inicio</span></a>
          <a class="nav-item" routerLink="/ruta"><span class="nav-icon">🗺️</span><span class="nav-text">Ruta de Aprendizaje</span></a>
          <a class="nav-item" routerLink="/ensayos"><span class="nav-icon">📚</span><span class="nav-text">Ensayos PAES</span></a>
          <a class="nav-item active" routerLink="/mini-ensayo"><span class="nav-icon">🎯</span><span class="nav-text">Mini Ensayos</span></a>
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
        <a routerLink="/dashboard" style="text-decoration:none;"><span class="text-gradient">EstudiaUni</span></a>
      </div>
      <div class="mobile-overlay" [class.open]="mobileOpen" (click)="mobileOpen = false">
        <div class="mobile-menu" (click)="$event.stopPropagation()">
          <nav class="sidebar-nav">
            <a class="nav-item" routerLink="/dashboard" (click)="mobileOpen=false"><span class="nav-icon">🏠</span><span class="nav-text">Inicio</span></a>
            <a class="nav-item" routerLink="/ruta" (click)="mobileOpen=false"><span class="nav-icon">🗺️</span><span class="nav-text">Ruta de Aprendizaje</span></a>
            <a class="nav-item" routerLink="/ensayos" (click)="mobileOpen=false"><span class="nav-icon">📚</span><span class="nav-text">Ensayos PAES</span></a>
            <a class="nav-item active" routerLink="/mini-ensayo" (click)="mobileOpen=false"><span class="nav-icon">🎯</span><span class="nav-text">Mini Ensayos</span></a>
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

      <!-- MAIN CONTENT -->
      <main class="main-content setup-layout animate-fade-in" style="flex: 1; margin-left: 260px; padding: 1.25rem 2.5rem 2.5rem; max-width: calc(100% - 260px); display: flex; flex-direction: column; align-items: center;">
        <header class="header" style="width: 100%; max-width: 900px; margin-bottom: 1.5rem; border-bottom: 2px solid var(--glass-border); padding-bottom: 1rem;">
          <div class="header-main-row" style="display: flex; justify-content: space-between; align-items: center; width: 100%; flex-wrap: wrap; gap: 1.5rem;">
            <div class="header-left" style="display: flex; align-items: center; gap: 1.5rem; flex: 1; text-align: left;">
              <div class="header-content">
                <div class="title-row" style="display: flex; align-items: center; gap: 1rem;">
                  <div class="hero-icon-container-small" style="width: 48px; height: 48px; border-radius: 12px; background: rgba(133, 92, 214, 0.1); border: 2px solid rgba(133, 92, 214, 0.2); display: flex; align-items: center; justify-content: center;">
                    <span class="hero-icon" style="font-size: 1.8rem; filter: drop-shadow(0 2px 6px rgba(250, 204, 21, 0.4));">🎯</span>
                  </div>
                  <h1 class="title text-gradient" style="margin: 0; font-size: 2.2rem; font-weight: 800; font-family: var(--font-heading);">Mini Ensayos Personalizados</h1>
                </div>
                <p class="subtitle" style="margin: 0; margin-top: 0.25rem; color: var(--text-secondary); font-size: 1.05rem;">Practica a tu medida con preguntas oficiales del banco PAES</p>
              </div>
            </div>
            
            <div class="welcome-actions" style="display: flex; align-items: center; gap: 1rem;">
              <span class="plan-badge" [class.pro]="isProPlan() && !adminService.isAdmin()" [class.admin]="adminService.isAdmin()">{{ adminService.isAdmin() ? 'ADMIN' : (isProPlan() ? 'PRO' : 'BASICO') }}</span>
              <div class="profile-menu-wrap" style="position: relative;">
                <button class="profile-trigger" (click)="showProfileModal = true" style="display: flex; align-items: center; justify-content: center; border: 2.5px solid var(--glass-border); background: #ffffff; color: var(--text-primary); border-radius: 50%; padding: 0.35rem; cursor: pointer; text-decoration: none; transition: all 0.2s; width: 62px; height: 62px; box-shadow: var(--shadow-sm);">
                  <span class="profile-avatar-wrap" style="position: relative; width: 52px; height: 52px; display: inline-block; flex-shrink: 0;">
                    <img *ngIf="firestoreService.profileSignal()?.photoURL; else avatarFallback" [src]="firestoreService.profileSignal()?.photoURL" alt="Foto de perfil" class="profile-avatar" style="width: 52px; height: 52px; border-radius: 50%; object-fit: cover;"/>
                    <ng-template #avatarFallback><span class="profile-avatar fallback" style="display: grid; place-items: center; background: var(--gradient-brand); font-weight: 700; font-size: 0.9rem; color: white; width: 52px; height: 52px; border-radius: 50%;">{{ profileInitial() }}</span></ng-template>
                  </span>
                </button>
                <span class="profile-emoji-badge" style="position: absolute; right: 0; bottom: 0; background: #111827; border: 1.5px solid rgba(255,255,255,0.2); border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; line-height: 1; z-index: 10; pointer-events: none;">{{ firestoreService.profileSignal()?.profileEmoji || '✨' }}</span>
              </div>
            </div>
          </div>
        </header>


      <div class="setup-container glass-card">
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
                <span class="mat-icon">{{ mat.icon }}</span>
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
                            [disabled]="totalAvailableQuestions() < count"
                            (click)="setCount(count)">
                      {{ count }}
                    </button>
                  }
                </div>
                @if (totalAvailableQuestions() < questionCount()) {
                  <p class="warning-text">Solo hay {{ totalAvailableQuestions() }} preguntas disponibles en los temas seleccionados.</p>
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
                  [disabled]="!isValid()" 
                  (click)="startMiniEnsayo()">
            🚀 Comenzar Mini Ensayo
          </button>
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
    
    .dashboard-layout { display: flex; min-height: 100vh; }
    
    .sidebar { width: 260px; background: rgba(13,15,23,0.95); border-right: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; height: 100vh; z-index: 100; overflow-y: auto; }
    .sidebar::-webkit-scrollbar { width: 4px; }
    .sidebar::-webkit-scrollbar-track { background: transparent; }
    .sidebar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; transition: background 0.2s; }
    .sidebar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.25); }
    .sidebar-header { padding: 2.5rem 1.5rem 2rem; border-bottom: 1px solid rgba(255,255,255,0.15); text-align: center; }
    .sidebar-logo { font-size: 2.2rem; font-weight: 900; letter-spacing: -0.04em; text-shadow: 0 0 15px rgba(139, 92, 246, 0.3); font-family: var(--font-heading); }
    .text-gradient { background: var(--gradient-brand); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .sidebar-nav {
      padding: 1rem 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .nav-item { display: flex; align-items: center; gap: 0.85rem; padding: 0.9rem 1.1rem; border-radius: 12px; color: #ffffff; text-decoration: none; transition: all 0.2s; cursor: pointer; font-size: 1.05rem; font-weight: 500; border: none; background: transparent; width: 100%; text-align: left; }
    .nav-item:hover { background: rgba(255,255,255,0.12); transform: translateX(4px); }
    .nav-item.active { background: rgba(99,102,241,0.25); border: 1.5px solid rgba(255,255,255,0.15); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .nav-icon { font-size: 1.35rem; width: 32px; text-align: center; display: flex; align-items: center; justify-content: center; }
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
    .logout-btn-sidebar { color: #f87171 !important; }
    .logout-btn-sidebar:hover { background: rgba(248, 113, 113, 0.15) !important; }
    
    .main-content { flex: 1; overflow-y: auto; padding: 2rem; background: var(--bg-color); }
    
    .setup-layout { max-width: 900px; margin: 0 auto; width: 100%; }
    
    .setup-header { text-align: center; margin-bottom: 2rem; }
    .back-btn { display: inline-block; color: var(--text-secondary); text-decoration: none; margin-bottom: 1rem; font-weight: 600; transition: color 0.2s; }
    .back-btn:hover { color: var(--accent-primary); }
    .setup-header h1 { font-family: var(--font-heading); font-size: 2.5rem; margin: 0 0 0.5rem; }
    .subtitle { color: var(--text-secondary); font-size: 1.1rem; margin: 0; }
    
    .setup-container { width: 100%; max-width: 900px; padding: 2.5rem; border-radius: 24px; border: 2px solid var(--glass-border); display: flex; flex-direction: column; gap: 2.5rem; }
    
    .step-section { display: flex; flex-direction: column; gap: 1rem; }
    .step-header { display: flex; align-items: center; gap: 1rem; }
    .step-number { width: 32px; height: 32px; border-radius: 50%; background: var(--gradient-brand); color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-family: var(--font-heading); }
    .step-header h2 { font-size: 1.3rem; margin: 0; flex: 1; }
    
    .materias-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; }
    .materia-card { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 1.25rem; border-radius: 16px; border: 2px solid var(--glass-border); background: rgba(255,255,255,0.02); cursor: pointer; transition: all 0.2s; }
    .materia-card:hover { border-color: rgba(133,92,214,0.4); transform: translateY(-2px); }
    .materia-card.active { border-color: var(--accent-primary); background: rgba(133,92,214,0.1); box-shadow: 0 4px 16px rgba(133,92,214,0.2); }
    .mat-icon { font-size: 2rem; }
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
    
    .time-display { padding: 0.75rem; border-radius: 12px; border: 2px solid transparent; background: rgba(255,255,255,0.05); font-weight: 700; font-size: 1.1rem; display: flex; align-items: center; gap: 0.5rem; }
    .warning-text { font-size: 0.8rem; color: #ef4444; margin: 0; }
    
    .setup-actions { border-top: 1px dashed var(--glass-border); padding-top: 2rem; display: flex; justify-content: flex-end; }
    .btn-start { padding: 1rem 2rem; border-radius: 16px; border: none; background: var(--gradient-brand); color: white; font-size: 1.1rem; font-weight: 800; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 15px rgba(133,92,214,0.3); }
    .btn-start:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(133,92,214,0.4); }
    .btn-start:disabled { background: var(--glass-border); color: var(--text-muted); box-shadow: none; cursor: not-allowed; transform: none; }
    
    .animate-slide-down { animation: slideDown 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .plan-badge { font-size: 0.85rem; letter-spacing: 0.05em; padding: 0.5rem 1rem; border-radius: 999px; font-weight: 800; background: var(--bg-secondary); color: var(--text-secondary); border: 2px solid var(--glass-border); line-height: 1; }
    .plan-badge.pro { background: rgba(245,158,11,0.1); color: #d97706; border-color: rgba(245,158,11,0.3); }
    .plan-badge.admin { background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #fff; border: 2.5px solid #d97706 !important; text-shadow: 0 1px 2px rgba(0,0,0,0.25); box-shadow: 0 0 12px rgba(245,158,11,0.6), inset 0 1px 2px rgba(255,255,255,0.35); }
    
    .animate-fade-in { animation: fadeIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
  `]
})
export class MiniEnsayoSetupComponent implements OnInit {
  public firestoreService = inject(FirestoreService);
  public adminService = inject(AdminService);
  private auth = inject(AuthService);

  mobileOpen = false;
  showSettingsModal = false;
  showProfileModal = false;
  showLogoutConfirm = false;
  isCollapsible = false;

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
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  materias: MateriaOption[] = [
    { id: 'competencia-lectora', label: 'Comp. Lectora', icon: '📖' },
    { id: 'matematicas-m1', label: 'Matemáticas M1', icon: '🔢' },
    { id: 'matematicas-m2', label: 'Matemáticas M2', icon: '📐' },
    { id: 'ciencias-biologia', label: 'Biología', icon: '🧬' },
    { id: 'ciencias-fisica', label: 'Física', icon: '⚛️' },
    { id: 'ciencias-quimica', label: 'Química', icon: '🧪' },
    { id: 'ciencias-tp', label: 'Ciencias TP', icon: '🛠️' },
    { id: 'historia', label: 'Historia', icon: '🏛️' },
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
    this.route.queryParams.subscribe(params => {
      if (params['mode'] === 'mejorador') {
        this.mode.set('mejorador');
        
        const matId = params['materiaId'] as MateriaId;
        if (matId) {
          this.selectedMateria.set(matId);
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

  selectMateria(id: MateriaId) {
    this.selectedMateria.set(id);
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

  startMiniEnsayo() {
    if (!this.isValid()) return;

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
