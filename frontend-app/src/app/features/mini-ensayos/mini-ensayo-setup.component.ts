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
import { PaymentService } from '../../core/services/payment.service';


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
    <div class="ensayos-container">
      
      <!-- SIDEBAR -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <a routerLink="/dashboard" class="sidebar-logo" style="text-decoration:none;"><span class="text-gradient" [class.pro-logo]="isProPlan()">EstudiaUni</span></a>
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
          <!-- Sidebar Promo Card -->
          <div *ngIf="!isProPlan() && !adminService.isAdmin()" class="sidebar-promo-card" (click)="paymentService.openPricingModal()">
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
      <main class="main-content animate-fade-in-down">
        <!-- HEADER -->
        <header class="dashboard-header">
          <div class="header-welcome-text">
            <h1 class="header-greeting"><span class="text-gradient">Mini Ensayos Personalizados</span></h1>
            <p class="subtitle" style="color: rgba(255,255,255,0.7); font-size: 0.95rem; margin: 0; font-weight: 500;">Practica a tu medida con preguntas oficiales del banco PAES</p>
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
    .confirm-content h3 { margin: 0 0 0.5rem; font-size: 1.3rem; }
    .confirm-content p { color: var(--text-secondary); margin: 0; }
    .modal-footer { padding: 1.5rem; border-top: 1px solid var(--glass-border); }
    .confirm-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .btn-secondary-modal { padding: 0.85rem; border-radius: 12px; border: 2px solid var(--glass-border); background: transparent; color: var(--text-primary); font-weight: 700; cursor: pointer; transition: all 0.2s; }
    .btn-secondary-modal:hover { background: var(--bg-secondary); }
    .btn-primary-modal { width: 100%; padding: 0.85rem; border-radius: 12px; background: var(--accent-primary); color: white; border: none; font-weight: 700; cursor: pointer; transition: all 0.2s; }
    .btn-primary-modal:hover { filter: brightness(1.1); transform: translateY(-2px); }
    .btn-danger { background: #ef4444 !important; box-shadow: 0 4px 12px rgba(239,68,68,0.25) !important; }
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
