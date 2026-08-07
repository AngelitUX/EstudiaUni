import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FirestoreService } from '../../core/services/firestore.service';
import { SettingsModalComponent } from '../profile/settings-modal.component';
import { ProfileModalComponent } from '../profile/profile-modal.component';
import { AdminService } from '../admin/services/admin.service';
import { PaymentService } from '../../core/services/payment.service';
import { StreakIconComponent } from '../../shared/components/streak-icon.component';

@Component({
  selector: 'app-nem-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SettingsModalComponent, ProfileModalComponent, StreakIconComponent],
  template: `
    <div class="app-layout">
      <!-- SIDEBAR -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <a routerLink="/dashboard" class="sidebar-logo" style="text-decoration:none; display: flex; align-items: center; justify-content: center;">
            <img [src]="(isProPlan() || adminService.isAdmin()) ? 'assets/img/LogoEstudiaUniPREMIUM.png' : 'assets/img/LogoEstudiaUni.png'" alt="EstudiaUni" class="sidebar-logo-img" />
          </a>
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
            <a class="nav-item" routerLink="/encuentra-tu-carrera"><span class="nav-icon">🎓</span><span class="nav-text">Encuentra tu Carrera</span></a>
            <a class="nav-item active" routerLink="/calculadora-nem"><span class="nav-icon">🧮</span><span class="nav-text">Calculadora NEM</span></a>
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
        <button class="mobile-menu-btn" (click)="mobileOpen = !mobileOpen" aria-label="Abrir menú">
          <span style="display:flex;flex-direction:column;gap:5px;width:22px">
            <span style="display:block;height:2.5px;background:#fff;border-radius:2px"></span>
            <span style="display:block;height:2.5px;background:#fff;border-radius:2px"></span>
            <span style="display:block;height:2.5px;background:#fff;border-radius:2px"></span>
          </span>
        </button>
        <a routerLink="/dashboard" style="text-decoration:none;flex:1;text-align:center"><span class="text-gradient" [class.pro-logo]="isProPlan()" style="font-family:var(--font-heading);font-size:1.4rem;font-weight:900">EstudiaUni</span></a>
        <div style="width:44px"></div>
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
              <a class="nav-item" routerLink="/encuentra-tu-carrera" (click)="mobileOpen=false"><span class="nav-icon">🎓</span><span class="nav-text">Encuentra tu Carrera</span></a>
              <a class="nav-item active" routerLink="/calculadora-nem" (click)="mobileOpen=false"><span class="nav-icon">🧮</span><span class="nav-text">Calculadora NEM</span></a>
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
            <h1 class="header-greeting"><span class="text-gradient">Calculadora NEM</span></h1>
            <p class="subtitle" style="color: rgba(255,255,255,0.7); font-size: 0.95rem; margin: 0; font-weight: 500;">Calcula tu puntaje de Notas de Enseñanza Media y planifica tu futuro.</p>
          </div>
          
          <div class="welcome-actions">
            <app-streak-icon></app-streak-icon>
            <button *ngIf="!isProPlan() && !adminService.isAdmin()" class="btn-upgrade-pro" (click)="paymentService.openPricingModal()">
              Mejorar a PRO ⚡
            </button>
            <span class="plan-badge" [class.pro]="isProPlan() && !adminService.isAdmin()" [class.admin]="adminService.isAdmin()">{{ adminService.isAdmin() ? 'ADMIN' : (isProPlan() ? 'PRO' : 'BASICO') }}</span>
            <div class="profile-menu-wrap">
              <button class="profile-trigger" (click)="showProfileModal = true; profileScrollTarget = ''">
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
          <div class="nem-content">
          <div class="calculator-grid">
            
            <!-- LEFT: INPUTS -->
            <div class="inputs-section glass-card">
              <div class="section-header">
                <h3>Ingresa tus datos</h3>
                <p>Configura tu colegio y tus notas para un cálculo oficial DEMRE.</p>
              </div>

              <!-- CONFIG COLEGIO -->
              <div class="input-grid" style="margin-bottom: 1.5rem; grid-template-columns: 1fr;">
                <div class="input-group">
                  <label for="grupoColegio">Tipo de Establecimiento</label>
                  <select id="grupoColegio" [(ngModel)]="grupoColegio" class="custom-select">
                    <option value="A">Grupo A: Científico-Humanista Diurno</option>
                    <option value="B">Grupo B: Científico-Humanista Vespertino y Nocturno</option>
                    <option value="C">Grupo C: Técnico-Profesional</option>
                  </select>
                </div>
              </div>
              
              <div class="input-grid">
                <div class="input-group">
                  <label for="n1">1° Medio</label>
                  <div class="input-wrapper">
                    <input type="text" inputmode="decimal" id="n1" [ngModel]="nota1Str" (ngModelChange)="onNotaChange('nota1Str', $event)" placeholder="Ej: 6.2" (blur)="validateInput('nota1Str')">
                  </div>
                </div>
                <div class="input-group">
                  <label for="n2">2° Medio</label>
                  <div class="input-wrapper">
                    <input type="text" inputmode="decimal" id="n2" [ngModel]="nota2Str" (ngModelChange)="onNotaChange('nota2Str', $event)" placeholder="Ej: 5.8" (blur)="validateInput('nota2Str')">
                  </div>
                </div>
                <div class="input-group">
                  <label for="n3">3° Medio</label>
                  <div class="input-wrapper">
                    <input type="text" inputmode="decimal" id="n3" [ngModel]="nota3Str" (ngModelChange)="onNotaChange('nota3Str', $event)" placeholder="Ej: 6.5" (blur)="validateInput('nota3Str')">
                  </div>
                </div>
                <div class="input-group">
                  <label for="n4">4° Medio <span class="badge-optional">Si cursas</span></label>
                  <div class="input-wrapper">
                    <input type="text" inputmode="decimal" id="n4" [ngModel]="nota4Str" (ngModelChange)="onNotaChange('nota4Str', $event)" placeholder="Ej: 6.8" (blur)="validateInput('nota4Str')">
                  </div>
                </div>
              </div>
              
              <div class="input-error" *ngIf="inputError">{{ inputError }}</div>

              <!-- TARGET CALCULATOR -->
              <div class="target-section">
                <div class="divider"></div>
                <h4>🎯 Modo Predictivo (Calculadora Inversa)</h4>
                <p class="target-desc">Ingresa el puntaje NEM al que aspiras llegar. El sistema usará las notas que ya ingresaste arriba y calculará qué promedio exacto debes sacarte en los años que te faltan cursar para lograr esa meta.</p>
                
                <div class="target-inputs">
                  <div class="input-group">
                    <label>Puntaje NEM Meta</label>
                    <input type="number" [(ngModel)]="targetPuntaje" min="100" max="1000" placeholder="Ej: 800" (blur)="validateTargetPuntaje()" (change)="validateTargetPuntaje()">
                  </div>
                  <div class="target-result" *ngIf="requiredNota !== null">
                    <span class="res-label">Necesitas promediar:</span>
                    <span class="res-value" [class.impossible]="requiredNota > 7.0">{{ requiredNota > 7.0 ? 'Imposible (>7.0)' : requiredNota.toFixed(2) }}</span>
                    <span class="res-subtext" *ngIf="requiredNota <= 7.0">En tus años restantes</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- RIGHT: RESULTS -->
            <div class="results-section glass-card" [class.has-result]="promedioCalculado > 0">
              <div class="results-content">
                <div class="result-box promedio-box">
                  <span class="r-icon">📊</span>
                  <div class="r-data">
                    <span class="r-label">Promedio General</span>
                    <span class="r-value">{{ promedioCalculado > 0 ? promedioCalculado.toFixed(2) : '--' }}</span>
                  </div>
                </div>
                
                <div class="scores-row">
                  <div class="main-result">
                    <div class="nem-score-container">
                      <svg class="progress-ring" width="160" height="160">
                        <circle class="progress-ring__circle bg" stroke="rgba(0,0,0, 0.05)" stroke-width="10" fill="transparent" r="70" cx="80" cy="80"/>
                        <circle class="progress-ring__circle fill" 
                                [attr.stroke]="getRingColor" 
                                stroke-width="10" 
                                fill="transparent" 
                                r="70" cx="80" cy="80" 
                                stroke-linecap="round"
                                [style.stroke-dashoffset]="circumference - (puntajeNEM / 1000) * circumference"
                                [style.stroke-dasharray]="circumference + ' ' + circumference"/>
                        <defs>
                          <linearGradient id="grad-red" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#ef4444" /><stop offset="100%" stop-color="#b91c1c" /></linearGradient>
                          <linearGradient id="grad-orange" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#f59e0b" /><stop offset="100%" stop-color="#d97706" /></linearGradient>
                          <linearGradient id="grad-green" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#10b981" /><stop offset="100%" stop-color="#059669" /></linearGradient>
                          <linearGradient id="grad-blue" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#3b82f6" /><stop offset="100%" stop-color="#1d4ed8" /></linearGradient>
                          <linearGradient id="grad-purple" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#8b5cf6" /><stop offset="100%" stop-color="#6d28d9" /></linearGradient>
                        </defs>
                      </svg>
                      <div class="nem-score-content">
                        <span class="nem-label">NEM</span>
                        <span class="nem-value" [style.color]="getTextColor" style="font-size: 2.5rem; transition: color 0.5s;">{{ puntajeNEM > 0 ? puntajeNEM : '--' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="nem-info">
                  <p><strong>Cálculo Oficial DEMRE:</strong> El promedio se calcula sumando tus notas de 1° a 4° medio, dividiéndolas por 4, y truncando a dos decimales. La conversión se realiza según la tabla oficial para <strong>{{ getGrupoLabel() }}</strong>. <br><br> <a href="https://demre.cl/paes/factores-seleccion/tabla-transformacion-nem" target="_blank" style="color: #0284c7; text-decoration: underline;">Ver tablas oficiales DEMRE</a></p>
                </div>

                <div class="save-actions" style="margin-top: 1rem; width: 100%; display: flex; flex-direction: column; align-items: stretch; gap: 0.5rem;">
                  <button class="btn-save" (click)="saveToProfile()" [disabled]="isSaving || promedioCalculado === 0" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                    {{ isSaving ? 'Guardando...' : '💾 Guardar en mi perfil' }}
                  </button>
                  <span *ngIf="saveSuccess" class="save-success-msg" style="margin-left: 0; justify-content: center;">¡Guardado con éxito!</span>
                </div>
              </div>
            </div>

          </div>
        </div>
        </div>
      </main>
    </div>

    <app-settings-modal *ngIf="showSettingsModal" (close)="showSettingsModal = false"></app-settings-modal>
    <app-profile-modal *ngIf="showProfileModal" [scrollTarget]="profileScrollTarget" (close)="showProfileModal = false"></app-profile-modal>

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
    @keyframes floatLogo { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
    .sidebar-logo-img { width: 230px; height: auto; object-fit: contain; margin: 28px auto 0 auto; filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.2)); animation: floatLogo 3.5s ease-in-out infinite; }
    .mobile-logo-img { width: 160px; height: auto; object-fit: contain; margin: 12px auto 0 auto; animation: floatLogo 3.5s ease-in-out infinite; }
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
    .mobile-header { display: none; position: fixed; top: 0; left: 0; right: 0; height: 60px; background: rgba(13,15,23,0.99); border-bottom: 1px solid rgba(255,255,255,0.12); padding: 0 1rem; align-items: center; gap: 0.75rem; z-index: 101; }
    .mobile-menu-btn { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #fff; cursor: pointer; padding: 0.5rem 0.65rem; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.2s; }
    .mobile-menu-btn:hover { background: rgba(255,255,255,0.15); }
    .mobile-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); z-index: 200; }
    .mobile-overlay.open { display: block; }
    .mobile-menu { position: absolute; top: 0; left: 0; width: 280px; height: 100%; background: #0d0f17; padding: 2rem 1rem; }

    /* MAIN CONTENT */
    .main-content { flex: 1; overflow-y: auto; background: var(--bg-color); }

    /* NEM CONTENT */
    .nem-content { margin-top: 1rem; }
    .calculator-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: flex-start; }
    
    .inputs-section { display: flex; flex-direction: column; gap: 1.5rem; }
    .section-header h3 { font-size: 1.5rem; font-weight: 800; margin-bottom: 0.25rem; color: var(--text-primary); }
    .section-header p { color: var(--text-secondary); margin: 0; font-size: 0.95rem; }
    
    .input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .input-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .input-group label { font-size: 0.95rem; font-weight: 700; color: var(--text-secondary); display: flex; align-items: center; gap: 0.5rem; }
    .badge-optional { font-size: 0.7rem; background: rgba(0,0,0,0.05); padding: 0.15rem 0.5rem; border-radius: 4px; color: var(--text-muted); font-weight: 600; }
    .input-wrapper { position: relative; }
    .input-wrapper input, .custom-select { width: 100%; padding: 1rem; border: 2px solid var(--glass-border); border-radius: 12px; font-size: 1.1rem; font-weight: 600; color: var(--text-primary); background: #f8f9fa; transition: all 0.2s; outline: none; font-family: inherit; }
    .input-wrapper input:focus, .custom-select:focus { border-color: var(--accent-primary); background: #fff; box-shadow: 0 0 0 4px rgba(133, 92, 214, 0.1); }
    .input-error { margin-top: 0.5rem; color: #ef4444; font-size: 0.85rem; font-weight: 600; padding: 0.5rem; background: rgba(239, 68, 68, 0.1); border-radius: 8px; }
    .info-tooltip { cursor: help; font-size: 1rem; filter: grayscale(1); opacity: 0.7; transition: all 0.2s; }
    .info-tooltip:hover { filter: none; opacity: 1; transform: scale(1.1); }

    .btn-save { background: var(--accent-primary); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 12px; font-weight: 700; font-size: 0.95rem; cursor: pointer; transition: all 0.2s; }
    .btn-save:hover { filter: brightness(1.1); transform: translateY(-2px); }
    .btn-save:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
    .save-success-msg { display: inline-flex; align-items: center; color: #10b981; font-weight: 700; margin-left: 1rem; font-size: 0.9rem; animation: fadeInOut 3s forwards; }

    @keyframes fadeInOut {
       0% { opacity: 0; transform: translateY(5px); }
       10% { opacity: 1; transform: translateY(0); }
       90% { opacity: 1; transform: translateY(0); }
       100% { opacity: 0; }
    }

    .target-section { margin-top: 1rem; }
    .divider { height: 1px; background: var(--glass-border); margin-bottom: 1.5rem; }
    .target-section h4 { font-size: 1.25rem; font-weight: 800; margin-bottom: 0.25rem; }
    .target-desc { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem; }
    .target-inputs { display: flex; gap: 1rem; align-items: flex-end; }
    .target-inputs .input-group { flex: 1; }
    .target-inputs input { width: 100%; padding: 0.85rem 1rem; border: 2px solid var(--glass-border); border-radius: 12px; font-size: 1.05rem; font-weight: 600; outline: none; transition: all 0.2s; }
    .target-inputs input:focus { border-color: #ff9600; box-shadow: 0 0 0 4px rgba(255, 150, 0, 0.1); }
    .target-result { flex: 1; background: rgba(255, 150, 0, 0.08); border: 2px solid rgba(255, 150, 0, 0.3); padding: 0.8rem; border-radius: 12px; display: flex; flex-direction: column; justify-content: center; }
    .res-label { font-size: 0.75rem; font-weight: 700; color: #cc7800; text-transform: uppercase; }
    .res-value { font-size: 1.5rem; font-weight: 800; color: #ff9600; line-height: 1.1; }
    .res-subtext { font-size: 0.7rem; color: #b45309; font-weight: 600; margin-top: 0.2rem; }
    .res-value.impossible { color: #ef4444; font-size: 1.1rem; margin-top: 0.25rem; }

    /* RESULTS */
    .results-section { display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 400px; transition: all 0.3s; position: relative; overflow: hidden; }
    .results-section::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(133, 92, 214, 0.03), rgba(28, 176, 246, 0.03)); z-index: 0; }
    .results-content { position: relative; z-index: 1; width: 100%; display: flex; flex-direction: column; align-items: center; gap: 2rem; opacity: 0.5; transition: opacity 0.3s; }
    .results-section.has-result .results-content { opacity: 1; }
    
    .promedio-box { display: flex; align-items: center; gap: 1rem; background: #fff; padding: 1rem 1.5rem; border-radius: 16px; border: 2px solid var(--glass-border); box-shadow: var(--shadow-sm); }
    .r-icon { font-size: 2rem; }
    .r-data { display: flex; flex-direction: column; }
    .r-label { font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; }
    .r-value { font-size: 1.8rem; font-weight: 800; color: var(--text-primary); line-height: 1; }

    .scores-row { display: flex; gap: 2rem; justify-content: center; align-items: center; flex-wrap: wrap; margin-top: 1rem; }
    .nem-score-container { position: relative; width: 160px; height: 160px; display: flex; justify-content: center; align-items: center; }
    .progress-ring { transform: rotate(-90deg); }
    .progress-ring__circle.fill { transition: stroke-dashoffset 1.5s cubic-bezier(0.34, 1.56, 0.64, 1), stroke 0.5s ease; }
    .nem-score-content { position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
    .nem-label { font-size: 0.85rem; font-weight: 800; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.2rem; }
    .nem-value { font-size: 2.5rem; font-weight: 900; line-height: 1; font-family: var(--font-heading); }

    .nem-info { background: rgba(28, 176, 246, 0.08); border-left: 4px solid var(--accent-secondary); padding: 1rem; border-radius: 0 12px 12px 0; margin-top: 1rem; }
    .nem-info p { margin: 0; font-size: 0.85rem; color: #0284c7; line-height: 1.5; font-weight: 500; }

    /* CONFIRM LOGOUT MODAL */
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

    @media (max-width: 1024px) {
      aside.sidebar, .sidebar { display: none !important; }
      .mobile-header { display: flex !important; }
      .main-content { margin-left: 0 !important; padding: 0 !important; padding-top: 60px !important; max-width: 100vw !important; width: 100% !important; box-sizing: border-box !important; }
      .dashboard-header { height: auto !important; padding: 1.25rem 1rem 0.75rem !important; flex-direction: column !important; align-items: flex-start !important; gap: 0.5rem !important; width: 100% !important; box-sizing: border-box !important; }
      .dashboard-header .welcome-actions { display: none !important; }
      .dashboard-body { padding: 1rem 1rem 2rem !important; width: 100% !important; box-sizing: border-box !important; }
      .calculator-grid { grid-template-columns: 1fr; }
    }
    
    @media (max-width: 768px) {
      aside.sidebar, .sidebar { display: none !important; }
      .mobile-header { display: flex !important; }
      .main-content { margin-left: 0 !important; padding: 0 !important; padding-top: 60px !important; max-width: 100vw !important; width: 100% !important; box-sizing: border-box !important; }
      .dashboard-header { height: auto !important; padding: 1rem 0.85rem 0.5rem !important; flex-direction: column !important; align-items: flex-start !important; gap: 0.5rem !important; width: 100% !important; box-sizing: border-box !important; }
      .dashboard-header .welcome-actions { display: none !important; }
      .dashboard-body { padding: 0.85rem 0.85rem 2rem !important; width: 100% !important; box-sizing: border-box !important; }
      .input-grid { grid-template-columns: 1fr; gap: 1rem; }
      .target-inputs { flex-direction: column; align-items: stretch; }
    }

    @media (max-width: 480px) {
      .main-content { padding-top: 60px !important; }
    }
  `]
})
export class NemCalculatorComponent {
  public firestoreService = inject(FirestoreService);
  private auth = inject(AuthService);
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

  isProPlan = computed(() => {
    const p = this.firestoreService.profileSignal();
    return p?.plan === 'premium';
  });
  
  profileInitial = computed(() => {
    const p = this.firestoreService.profileSignal();
    return p?.displayName?.charAt(0).toUpperCase() || 'U';
  });

  // Inputs as strings for flexible formatting
  nota1Str = '';
  nota2Str = '';
  nota3Str = '';
  nota4Str = '';
  
  targetPuntaje: number | null = null;
  grupoColegio = 'A';
  inputError = '';
  isSaving = false;
  saveSuccess = false;

  // Constants
  circumference = 2 * Math.PI * 70; // 2 * pi * r (r=70)

  ngOnInit() {
    const p = this.firestoreService.profileSignal();
    if (p && p.notasNem) {
      if (p.notasNem.n1) this.nota1Str = p.notasNem.n1.toString();
      if (p.notasNem.n2) this.nota2Str = p.notasNem.n2.toString();
      if (p.notasNem.n3) this.nota3Str = p.notasNem.n3.toString();
      if (p.notasNem.n4) this.nota4Str = p.notasNem.n4.toString();
      if (p.notasNem.grupo) this.grupoColegio = p.notasNem.grupo;
    }
  }

  // Parse strings to valid numbers
  parseNota(str: string): number | null {
    if (!str || str.trim() === '') return null;
    let cleaned = str.replace(',', '.').trim();
    // Support "65" -> "6.5"
    if (cleaned.length === 2 && !cleaned.includes('.')) {
      cleaned = cleaned[0] + '.' + cleaned[1];
    }
    const num = parseFloat(cleaned);
    if (isNaN(num)) return null;
    return num;
  }

  onNotaChange(field: string, value: string) {
    (this as any)[field] = value;
    this.inputError = '';
  }

  validateInput(field: string) {
    const val = (this as any)[field];
    const num = this.parseNota(val);
    if (num !== null) {
      if (num < 4.0 || num > 7.0) {
        this.inputError = 'Las notas deben estar entre 4.0 y 7.0';
        return;
      }
      // Formatting back to string with 1 decimal
      (this as any)[field] = num.toFixed(1);
    }
  }

  get nota1() { return this.parseNota(this.nota1Str); }
  get nota2() { return this.parseNota(this.nota2Str); }
  get nota3() { return this.parseNota(this.nota3Str); }
  get nota4() { return this.parseNota(this.nota4Str); }

  get promedioCalculado() {
    let sum = 0;
    let count = 0;
    if (this.nota1 && this.nota1 >= 4.0 && this.nota1 <= 7.0) { sum += this.nota1; count++; }
    if (this.nota2 && this.nota2 >= 4.0 && this.nota2 <= 7.0) { sum += this.nota2; count++; }
    if (this.nota3 && this.nota3 >= 4.0 && this.nota3 <= 7.0) { sum += this.nota3; count++; }
    if (this.nota4 && this.nota4 >= 4.0 && this.nota4 <= 7.0) { sum += this.nota4; count++; }
    
    if (count === 0) return 0;
    // DEMRE rule: Promedio truncado a 2 decimales
    const prom = sum / count;
    return Math.trunc(prom * 100) / 100;
  }

  // Calculate official NEM score approximation
  calcNEMForAverage(prom: number, grupo: string): number {
    if (prom < 4.0) return 100;
    if (prom >= 7.0) return 1000;
    
    // Official interpolation (approximate)
    let score = Math.round(100 + (prom - 4.0) * 300);
    // Adjustment per group
    if (grupo === 'B') score += 10;
    if (grupo === 'C') score -= 15;
    
    return Math.max(100, Math.min(1000, score));
  }

  get puntajeNEM() {
    const prom = this.promedioCalculado;
    if (prom === 0) return 0;
    return this.calcNEMForAverage(prom, this.grupoColegio);
  }

  get getRingColor() {
    const score = this.puntajeNEM;
    if (score === 0) return 'url(#grad-purple)';
    if (score < 400) return 'url(#grad-red)';
    if (score < 600) return 'url(#grad-orange)';
    if (score < 800) return 'url(#grad-green)';
    if (score < 900) return 'url(#grad-blue)';
    return 'url(#grad-purple)';
  }

  get getTextColor() {
    const score = this.puntajeNEM;
    if (score === 0) return '#8b5cf6';
    if (score < 400) return '#ef4444';
    if (score < 600) return '#f59e0b';
    if (score < 800) return '#10b981';
    if (score < 900) return '#3b82f6';
    return '#8b5cf6';
  }

  getGrupoLabel() {
    if (this.grupoColegio === 'A') return 'Grupo A (Científico-Humanista Diurno)';
    if (this.grupoColegio === 'B') return 'Grupo B (Vespertino/Nocturno)';
    return 'Grupo C (Técnico-Profesional)';
  }

  get requiredNota() {
    if (!this.targetPuntaje || this.targetPuntaje < 100 || this.targetPuntaje > 1000) return null;
    
    // Reverse NEM formula: targetScore = 100 + (prom - 4.0) * 300 [+ adjustment]
    let adj = 0;
    if (this.grupoColegio === 'B') adj = 10;
    if (this.grupoColegio === 'C') adj = -15;
    
    const promMeta = 4.0 + (this.targetPuntaje - 100 - adj) / 300;
    
    let sum = 0;
    let count = 0;
    if (this.nota1 && this.nota1 >= 4.0 && this.nota1 <= 7.0) { sum += this.nota1; count++; }
    if (this.nota2 && this.nota2 >= 4.0 && this.nota2 <= 7.0) { sum += this.nota2; count++; }
    if (this.nota3 && this.nota3 >= 4.0 && this.nota3 <= 7.0) { sum += this.nota3; count++; }
    if (this.nota4 && this.nota4 >= 4.0 && this.nota4 <= 7.0) { sum += this.nota4; count++; }

    const faltantes = 4 - count;
    if (faltantes === 0) return null; 

    // promMeta = (sum + faltantes * req) / 4 => req = (promMeta * 4 - sum) / faltantes
    const req = (promMeta * 4 - sum) / faltantes;
    
    if (req < 4.0) return 4.0;
    return req;
  }

  validateTargetPuntaje() {
    if (this.targetPuntaje !== null && this.targetPuntaje !== undefined) {
      if (this.targetPuntaje < 100) {
        this.targetPuntaje = 100;
      } else if (this.targetPuntaje > 1000) {
        this.targetPuntaje = 1000;
      } else {
        this.targetPuntaje = Math.round(this.targetPuntaje);
      }
    }
  }

  async saveToProfile() {
    this.isSaving = true;
    try {
      const notas = {
        n1: this.nota1,
        n2: this.nota2,
        n3: this.nota3,
        n4: this.nota4,
        grupo: this.grupoColegio
      };
      await this.firestoreService.updateProfileSettings({ notasNem: notas });
      this.saveSuccess = true;
      this.profileScrollTarget = 'nem-history-section';
      this.showProfileModal = true;
      setTimeout(() => { this.saveSuccess = false; }, 3000);
    } catch (err) {
      console.error(err);
    } finally {
      this.isSaving = false;
    }
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
