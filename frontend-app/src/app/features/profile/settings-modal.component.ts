import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FirestoreService } from '../../core/services/firestore.service';
import { ToastService } from '../../core/services/toast.service';
import { NotificationService } from '../../core/services/notification.service';
import { ReportBugModalComponent } from './report-bug-modal.component';

@Component({
  selector: 'app-settings-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReportBugModalComponent],
  template: `
    <div class="modal-overlay" (click)="closeModal()">
      <div class="modal-container glass" (click)="$event.stopPropagation()">
        <div class="modal-topbar">
          <h1>Configuración</h1>
          <button class="btn-close" (click)="closeModal()">✕</button>
        </div>
        <div class="modal-scroll">
          <!-- Ruta de Aprendizaje se movió a Perfil -->
          <div class="section-block">
            <div class="section-header">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem;">
                <div>
                  <h3>Notificaciones</h3>
                  <p>Avisos y recordatorios de estudio en tu horario preferido.</p>
                </div>
                <label class="switch" style="margin: 0; flex-shrink: 0;">
                  <input [(ngModel)]="settingsForm.notificationsEnabled" type="checkbox" (change)="onNotificationsToggle()"/>
                  <span>Activas</span>
                </label>
              </div>
            </div>
            <div class="grid" [style.opacity]="settingsForm.notificationsEnabled ? '1' : '0.5'" [style.pointer-events]="settingsForm.notificationsEnabled ? 'auto' : 'none'">
              <label>Horario preferido
                <select [(ngModel)]="settingsForm.preferredStudyTime">
                  <option value="manana">Mañana (7:00 - 11:00)</option>
                  <option value="tarde">Tarde (14:00 - 18:00)</option>
                  <option value="noche">Noche (20:00 - 23:00)</option>
                  <option value="ninguno">Cualquier momento</option>
                </select>
              </label>
              <label>Intensidad
                <select [(ngModel)]="settingsForm.notificationIntensity">
                  <option value="baja">Baja (cada 1.5 hrs)</option>
                  <option value="normal">Normal (cada 1 hr)</option>
                  <option value="alta">Alta (cada 30 min)</option>
                </select>
              </label>
            </div>
            <div class="notification-status" *ngIf="settingsForm.notificationsEnabled">
              <span class="status-dot" [class.granted]="notifPermissionGranted" [class.denied]="!notifPermissionGranted"></span>
              <span>{{ notifPermissionGranted ? 'Notificaciones permitidas ✓' : 'Permiso de notificaciones pendiente' }}</span>
              <button *ngIf="!notifPermissionGranted" class="btn-request-perm" (click)="requestNotifPermission()">Permitir</button>
            </div>
          </div>
          <div class="section-block">
            <div class="section-header"><h3>Accesibilidad</h3><p>Adapta la plataforma a tus necesidades visuales y cognitivas.</p></div>
            <div class="grid" style="grid-template-columns: 1fr 1fr 1fr;">
              <label class="switch">
                <input [(ngModel)]="settingsForm.dyslexiaFont" type="checkbox" (change)="applyAccessibility()"/>
                <span>Fuente para dislexia</span>
              </label>
              <label>Tamaño de fuente
                <select [(ngModel)]="settingsForm.fontSize" (change)="applyAccessibility()">
                  <option value="normal">Normal</option>
                  <option value="large">Grande</option>
                  <option value="xlarge">Extra grande</option>
                </select>
              </label>
              <label>Espaciado de texto
                <select [(ngModel)]="settingsForm.textSpacing" (change)="applyAccessibility()">
                  <option value="normal">Normal</option>
                  <option value="wide">Amplio</option>
                  <option value="xwide">Muy amplio</option>
                </select>
              </label>
            </div>
          </div>
          <div class="section-block">
            <div class="section-header">
              <h3>Atajos de Teclado (Navegabilidad)</h3>
              <p>Haz clic en cada casilla y presiona la tecla que deseas asignar para responder y navegar por las lecciones.</p>
            </div>
            <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.85rem;">
              <div class="key-card">
                <label class="key-label" for="key-ansA">Opción A</label>
                <input id="key-ansA" type="text" [value]="formatKeyName(settingsForm.keyAnsA)" (keydown)="captureKey($event, 'keyAnsA')" readonly class="key-input"/>
              </div>
              <div class="key-card">
                <label class="key-label" for="key-ansB">Opción B</label>
                <input id="key-ansB" type="text" [value]="formatKeyName(settingsForm.keyAnsB)" (keydown)="captureKey($event, 'keyAnsB')" readonly class="key-input"/>
              </div>
              <div class="key-card">
                <label class="key-label" for="key-ansC">Opción C</label>
                <input id="key-ansC" type="text" [value]="formatKeyName(settingsForm.keyAnsC)" (keydown)="captureKey($event, 'keyAnsC')" readonly class="key-input"/>
              </div>
              <div class="key-card">
                <label class="key-label" for="key-ansD">Opción D</label>
                <input id="key-ansD" type="text" [value]="formatKeyName(settingsForm.keyAnsD)" (keydown)="captureKey($event, 'keyAnsD')" readonly class="key-input"/>
              </div>
              <div class="key-card">
                <label class="key-label" for="key-ansE">Opción E</label>
                <input id="key-ansE" type="text" [value]="formatKeyName(settingsForm.keyAnsE)" (keydown)="captureKey($event, 'keyAnsE')" readonly class="key-input"/>
              </div>
              <div class="key-card">
                <label class="key-label" for="key-next">Siguiente</label>
                <input id="key-next" type="text" [value]="formatKeyName(settingsForm.keyNext)" (keydown)="captureKey($event, 'keyNext')" readonly class="key-input"/>
              </div>
              <div class="key-card">
                <label class="key-label" for="key-prev">Anterior</label>
                <input id="key-prev" type="text" [value]="formatKeyName(settingsForm.keyPrev)" (keydown)="captureKey($event, 'keyPrev')" readonly class="key-input"/>
              </div>
              <div class="key-card">
                <label class="key-label" for="key-exit">Cerrar / Salir</label>
                <input id="key-exit" type="text" [value]="formatKeyName(settingsForm.keyExit)" (keydown)="captureKey($event, 'keyExit')" readonly class="key-input"/>
              </div>
            </div>
            <div class="keyboard-info-banner">
              <span>💡 <strong>Nota:</strong> Los atajos clásicos (<kbd>1</kbd> al <kbd>5</kbd> para responder, y <kbd>↵ Enter</kbd>, <kbd>␣ Espacio</kbd>, <kbd>←</kbd> / <kbd>→</kbd> para navegar) se mantendrán siempre activos como alternativa en segundo plano, incluso si cambias tus atajos.</span>
            </div>
            <div style="display: flex; justify-content: flex-end; margin-top: 0.5rem;">
              <button type="button" class="btn-reset-keys" (click)="resetDefaultKeys()">
                Restablecer Valores Predeterminados
              </button>
            </div>
          </div>
          <div class="section-block">
            <div class="section-header"><h3>Soporte</h3><p>¿Necesitas ayuda? Escríbenos desde el centro de soporte.</p></div>
            <div class="support-actions">
              <a routerLink="/soporte" class="support-link" (click)="closeModal()">🎧 Ir a Soporte</a>
            </div>
          </div>
          <div class="section-block">
            <div class="section-header"><h3>Origen de datos (Mocks)</h3><p>Alterna entre la base de datos de Firebase y datos locales simulados (Mocks).</p></div>
            <div class="grid" style="grid-template-columns: 1fr;">
              <label class="switch">
                <input [(ngModel)]="useLocalMocks" type="checkbox" (change)="toggleLocalMocks()"/>
                <span>Usar Mocks Locales (Offline)</span>
              </label>
              <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: -0.25rem; font-weight: 500;">
                Ideal para desarrollo rápido. Carga capítulos y lecciones directamente de archivos locales sin consumir lecturas de Firestore. Requiere recargar.
              </div>
            </div>
          </div>
          <div class="action-bar">
            <button class="btn-report" (click)="showReportBugModal = true">
              <img src="assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_ReportarBug.svg" alt="Reportar un problema" class="report-bug-icon"/>
            </button>
            <button class="primary" [class.dirty]="isDirty()" [class.shake]="shakeSaveButton" (click)="saveSettings()" [disabled]="saving || loading || !isDirty()">{{ saving ? 'Guardando...' : 'Guardar configuración' }}</button>
          </div>
        </div>
      </div>
    </div>
    
    <app-report-bug-modal *ngIf="showReportBugModal" (close)="showReportBugModal = false"></app-report-bug-modal>
  `,
  styles: [`
    .modal-overlay{position:fixed;inset:0;z-index:9000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.55);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);animation:fadeOverlay .25s ease}
    @keyframes fadeOverlay{from{opacity:0}to{opacity:1}}
    .modal-container{position:relative;width:min(720px,94vw);max-height:88vh;display:flex;flex-direction:column;border-radius:18px;background:#ffffff;border:2px solid var(--glass-border);box-shadow:var(--shadow-lg);animation:slideUp .3s cubic-bezier(.16,1,.3,1);color:var(--text-primary)}
    @keyframes slideUp{from{opacity:0;transform:translateY(32px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
    .modal-topbar{display:flex;align-items:center;justify-content:space-between;padding:1rem 1.25rem;border-bottom:2px solid var(--glass-border)}
    .modal-topbar h1{margin:0;font-size:1.15rem;font-weight:800}
    .btn-close{border:none;background:var(--bg-secondary);color:var(--text-secondary);width:34px;height:34px;border-radius:10px;font-size:1.1rem;cursor:pointer;display:grid;place-items:center;transition:all .2s}
    .btn-close:hover{background:rgba(239,68,68,0.25);color:#fca5a5}
    .modal-scroll{overflow-y:auto;padding:1.25rem;flex:1;display:flex;flex-direction:column;gap:1rem}
    .modal-scroll::-webkit-scrollbar{width:5px}
    .modal-scroll::-webkit-scrollbar-thumb{background:var(--glass-border);border-radius:99px}
    .section-block{background:var(--bg-color);border:2px solid var(--glass-border);border-radius:16px;padding:1rem;display:flex;flex-direction:column;gap:.85rem}
    .section-header{display:flex;flex-direction:column;gap:.25rem}
    .section-header h3{margin:0;font-size:1.05rem;color:var(--text-primary);font-weight:700}
    .section-header p{margin:0;color:var(--text-secondary);font-size:.9rem;font-weight:500}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:.7rem}
    label{display:block;margin-bottom:.7rem;font-size:.9rem;color:var(--text-primary);font-weight:700}
    input,textarea,select{width:100%;margin-top:.25rem;border-radius:9px;border:2px solid var(--glass-border);background:#ffffff;color:var(--text-primary);padding:.58rem .65rem;font:inherit;font-size:16px !important;box-sizing:border-box}
    input:focus,select:focus{outline:none;border-color:var(--accent-primary);box-shadow:0 0 0 2px rgba(133,92,214,0.2)}
    .switch{display:flex;align-items:center;gap:.5rem;margin-top:.25rem}
    .switch input{width:auto;margin:0}
    .primary{margin-top:.3rem;border:0;border-radius:9px;background:#94a3b8;color:#fff;padding:.62rem .95rem;font-weight:600;cursor:pointer;transition:all .2s;box-shadow:0 4px 12px rgba(0,0,0,0.1)}
    .primary.dirty{background:linear-gradient(135deg,#855cd6,#6b46b8);box-shadow:0 4px 12px rgba(133,92,214,0.3)}
    .primary:hover:not([disabled]){filter:brightness(1.1);transform:translateY(-2px)}
    .primary[disabled]{opacity:.6;cursor:not-allowed}
    .primary.shake{animation:shake-btn 0.6s cubic-bezier(.36,.07,.19,.97) both;box-shadow:0 0 0 2px #ef4444,0 4px 12px rgba(239,68,68,0.4) !important}
    @keyframes shake-btn{
      0%,100%{transform:translate3d(0,0,0)}
      10%,90%{transform:translate3d(-1px,0,0)}
      20%,80%{transform:translate3d(2px,0,0)}
      30%,50%,70%{transform:translate3d(-4px,0,0)}
      40%,60%{transform:translate3d(4px,0,0)}
    }
    .action-bar{display:flex;justify-content:space-between;align-items:center}
    .btn-report{border:2px solid var(--glass-border);background:var(--bg-secondary);border-radius:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0.5rem;width:60px;height:60px;transition:all 0.2s}
    .btn-report:hover{border-color:var(--accent-primary);background:rgba(133,92,214,0.08);transform:translateY(-2px);box-shadow:0 4px 12px rgba(133,92,214,0.2)}
    .report-bug-icon{width:100%;height:100%;object-fit:contain}
    .notification-status{display:flex;align-items:center;gap:.5rem;font-size:.85rem;color:var(--text-secondary);padding:.5rem .75rem;background:var(--bg-secondary);border-radius:10px;border:2px solid var(--glass-border);font-weight:600}
    .status-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
    .status-dot.granted{background:#10b981}
    .status-dot.denied{background:#f59e0b}
    .btn-request-perm{border:none;background:var(--accent-primary);color:#ffffff;border-radius:8px;padding:.4rem .9rem;font-size:.85rem;font-weight:700;cursor:pointer;margin-left:auto;transition:all .2s;box-shadow:0 2px 8px rgba(133,92,214,0.25)}
    .btn-request-perm:hover{filter:brightness(1.1);transform:translateY(-1px);box-shadow:0 4px 12px rgba(133,92,214,0.35)}
    .support-actions{display:flex;align-items:center;justify-content:flex-start}
    .support-link{display:inline-flex;align-items:center;gap:.45rem;text-decoration:none;border-radius:10px;border:2px solid var(--accent-primary);color:var(--accent-primary);padding:.55rem .9rem;font-weight:700;background:rgba(133,92,214,0.08);transition:all .2s}
    .support-link:hover{background:var(--accent-primary);color:#ffffff;transform:translateY(-1px)}
    .key-card {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      background: var(--bg-secondary);
      border: 1.5px solid var(--glass-border);
      padding: 0.6rem;
      border-radius: 12px;
      transition: all 0.2s;
    }
    .key-card:hover {
      border-color: rgba(133, 92, 214, 0.3);
      background: rgba(133, 92, 214, 0.02);
    }
    .key-label {
      font-size: 0.72rem;
      color: var(--text-secondary);
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      text-align: center;
    }
    .key-input {
      width: 100%;
      text-align: center;
      font-weight: 800;
      font-size: 0.85rem !important;
      background: #ffffff !important;
      border: 1.5px solid var(--glass-border) !important;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04) !important;
      cursor: pointer;
      padding: 0.45rem !important;
      border-radius: 8px;
      transition: all 0.2s;
    }
    .key-input:focus {
      border-color: var(--accent-primary) !important;
      background: rgba(133, 92, 214, 0.04) !important;
      box-shadow: 0 0 0 2px rgba(133, 92, 214, 0.15) !important;
      outline: none;
    }
    .btn-reset-keys {
      background: transparent;
      border: 1.5px solid var(--glass-border);
      color: var(--text-secondary);
      padding: 0.45rem 0.85rem;
      font-size: 0.8rem;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-reset-keys:hover {
      border-color: #ef4444;
      color: #ef4444;
      background: rgba(239, 68, 68, 0.05);
    }
    .keyboard-info-banner {
      background: rgba(133, 92, 214, 0.05);
      border: 1.5px solid rgba(133, 92, 214, 0.15);
      padding: 0.75rem 0.95rem;
      border-radius: 12px;
      font-size: 0.78rem;
      line-height: 1.4;
      color: var(--text-secondary);
      font-weight: 500;
      margin-top: 0.8rem;
    }
    .keyboard-info-banner kbd {
      background: #ffffff;
      border: 1px solid var(--glass-border);
      border-bottom: 2.5px solid var(--glass-border);
      padding: 0.1rem 0.35rem;
      border-radius: 4px;
      font-family: inherit;
      font-weight: 800;
      font-size: 0.72rem;
      color: var(--text-primary);
      box-shadow: 0 1px 1px rgba(0,0,0,0.05);
    }
    @media(max-width:720px){
      .modal-overlay{padding:0.5rem;align-items:flex-start}
      .modal-container{width:100%;margin-top:0.5rem;max-height:94vh}
      .grid{grid-template-columns:1fr !important}
      input,select{font-size:16px !important}
      .action-bar{flex-direction:column;align-items:stretch;gap:0.75rem}
      .btn-report{justify-content:center}
      .primary{width:100%}
    }
  `]
})
export class SettingsModalComponent implements OnInit {
  private readonly firestoreService = inject(FirestoreService);
  private readonly toast = inject(ToastService);
  private readonly notificationService = inject(NotificationService);


  @Output() close = new EventEmitter<void>();

  loading = true;
  saving = false;
  notifPermissionGranted = false;
  useLocalMocks = false;
  showReportBugModal = false;
  shakeSaveButton = false;

  settingsForm = {
    preferredStudyTime: 'tarde' as 'manana' | 'tarde' | 'noche' | 'ninguno',
    notificationsEnabled: true,
    theme: 'dark' as 'dark' | 'light' | 'auto',
    notificationIntensity: 'normal' as 'baja' | 'normal' | 'alta',
    dyslexiaFont: false,
    fontSize: 'normal' as 'normal' | 'large' | 'xlarge',
    textSpacing: 'normal' as 'normal' | 'wide' | 'xwide',
    keyAnsA: 'z',
    keyAnsB: 'x',
    keyAnsC: 'c',
    keyAnsD: 'v',
    keyAnsE: 'b',
    keyNext: 'enter',
    keyPrev: 'arrowleft',
    keyExit: 'escape'
  };
  initialSettingsForm = '';

  isDirty(): boolean {
    return this.initialSettingsForm !== JSON.stringify(this.settingsForm);
  }

  ngOnInit(): void {
    this.useLocalMocks = localStorage.getItem('USE_LOCAL_MOCKS') === 'true';
    this.notifPermissionGranted = this.notificationService.isNotificationPermissionGranted();
    this.firestoreService.getUserProfile().subscribe({
      next: (profile) => {
        if (profile) {
          const p = profile as any;
          this.settingsForm.preferredStudyTime = p.preferredStudyTime || 'tarde';
          this.settingsForm.notificationsEnabled = p.notificationsEnabled ?? true;
          this.settingsForm.theme = p.theme || 'dark';
          this.settingsForm.notificationIntensity = p.notificationIntensity || 'normal';
          this.settingsForm.dyslexiaFont = !!p.dyslexiaFont;
          this.settingsForm.fontSize = p.fontSize || 'normal';
          this.settingsForm.textSpacing = p.textSpacing || 'normal';
          this.settingsForm.keyAnsA = p.keyAnsA || 'z';
          this.settingsForm.keyAnsB = p.keyAnsB || 'x';
          this.settingsForm.keyAnsC = p.keyAnsC || 'c';
          this.settingsForm.keyAnsD = p.keyAnsD || 'v';
          this.settingsForm.keyAnsE = p.keyAnsE || 'b';
          this.settingsForm.keyNext = p.keyNext || 'enter';
          this.settingsForm.keyPrev = p.keyPrev || 'arrowleft';
          this.settingsForm.keyExit = p.keyExit || 'escape';
          
          // Seed localStorage instantly
          localStorage.setItem('KEY_SHORTCUT_A', this.settingsForm.keyAnsA);
          localStorage.setItem('KEY_SHORTCUT_B', this.settingsForm.keyAnsB);
          localStorage.setItem('KEY_SHORTCUT_C', this.settingsForm.keyAnsC);
          localStorage.setItem('KEY_SHORTCUT_D', this.settingsForm.keyAnsD);
          localStorage.setItem('KEY_SHORTCUT_E', this.settingsForm.keyAnsE);
          localStorage.setItem('KEY_SHORTCUT_NEXT', this.settingsForm.keyNext);
          localStorage.setItem('KEY_SHORTCUT_PREV', this.settingsForm.keyPrev);
          localStorage.setItem('KEY_SHORTCUT_EXIT', this.settingsForm.keyExit);
        }
        this.initialSettingsForm = JSON.stringify(this.settingsForm);
        this.loading = false;
      },
      error: () => { this.loading = false; this.toast.error('No se pudo cargar la información.'); }
    });
  }

  captureKey(event: KeyboardEvent, field: 'keyAnsA' | 'keyAnsB' | 'keyAnsC' | 'keyAnsD' | 'keyAnsE' | 'keyNext' | 'keyPrev' | 'keyExit') {
    event.preventDefault();
    const key = event.key.toLowerCase();
    if (key === 'escape' && field !== 'keyExit') return; // permitimos escape para cancelar, a menos que configuremos escape mismo
    this.settingsForm[field] = key;
  }

  formatKeyName(key: string): string {
    if (!key) return '';
    const lower = key.toLowerCase();
    if (lower === 'arrowleft') return '← Flecha Izq';
    if (lower === 'arrowright') return '→ Flecha Der';
    if (lower === 'arrowup') return '↑ Flecha Arriba';
    if (lower === 'arrowdown') return '↓ Flecha Abajo';
    if (lower === ' ') return '␣ Espacio';
    if (lower === 'enter') return '↵ Enter';
    return key.toUpperCase();
  }

  resetDefaultKeys() {
    this.settingsForm.keyAnsA = 'z';
    this.settingsForm.keyAnsB = 'x';
    this.settingsForm.keyAnsC = 'c';
    this.settingsForm.keyAnsD = 'v';
    this.settingsForm.keyAnsE = 'b';
    this.settingsForm.keyNext = 'enter';
    this.settingsForm.keyPrev = 'arrowleft';
    this.settingsForm.keyExit = 'escape';
    this.toast.info('Atajos restablecidos. Recuerda guardar los cambios 🔄');
  }

  toggleLocalMocks(): void {
    localStorage.setItem('USE_LOCAL_MOCKS', String(this.useLocalMocks));
    if (this.useLocalMocks) {
      this.toast.info('Cargando mocks locales... Reiniciando en breve 🔄');
    } else {
      this.toast.info('Cambiando a base de datos de Firebase... Reiniciando en breve 🔄');
    }
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }

  closeModal() {
    if (this.isDirty()) {
      this.toast.info('Debes guardar tus cambios antes de salir.');
      this.shakeSaveButton = true;
      setTimeout(() => this.shakeSaveButton = false, 600);
      return;
    }
    this.close.emit();
  }

  async requestNotifPermission() {
    // Si ya está bloqueado a nivel de navegador, el API de Notification no abrirá el prompt
    if ('Notification' in window && Notification.permission === 'denied') {
      this.toast.error('Las notificaciones están bloqueadas en tu navegador. Por favor, actívalas en la configuración de la barra de direcciones 🔒.');
      return;
    }

    this.notifPermissionGranted = await this.notificationService.requestPermission();

    if (this.notifPermissionGranted) {
      this.toast.success('Notificaciones permitidas');
    } else {
      this.toast.error('No se pudo obtener permiso de notificaciones');
    }
  }

  applyAccessibility() {
    const classList = document.body.classList;
    if (this.settingsForm.dyslexiaFont) classList.add('dyslexia-font'); else classList.remove('dyslexia-font');
    classList.remove('font-large', 'font-xlarge', 'spacing-wide', 'spacing-xwide');
    if (this.settingsForm.fontSize === 'large') classList.add('font-large');
    else if (this.settingsForm.fontSize === 'xlarge') classList.add('font-xlarge');

    if (this.settingsForm.textSpacing === 'wide') classList.add('spacing-wide');
    else if (this.settingsForm.textSpacing === 'xwide') classList.add('spacing-xwide');
  }

  onNotificationsToggle(): void {
    if (this.settingsForm.notificationsEnabled) {
      this.notificationService.startReminders({
        preferredStudyTime: this.settingsForm.preferredStudyTime,
        notificationIntensity: this.settingsForm.notificationIntensity,
        notificationsEnabled: true,
      }, true);
      this.toast.success('Recordatorios activados');
    } else {
      this.notificationService.stopReminders();
      this.toast.info('Recordatorios desactivados');
    }
  }

  async saveSettings(): Promise<void> {
    this.saving = true;
    try {
      await this.firestoreService.updateProfileSettings({
        preferredStudyTime: this.settingsForm.preferredStudyTime,
        notificationsEnabled: this.settingsForm.notificationsEnabled,
        theme: this.settingsForm.theme,
        notificationIntensity: this.settingsForm.notificationIntensity,
        dyslexiaFont: this.settingsForm.dyslexiaFont,
        fontSize: this.settingsForm.fontSize,
        textSpacing: this.settingsForm.textSpacing,
        keyAnsA: this.settingsForm.keyAnsA,
        keyAnsB: this.settingsForm.keyAnsB,
        keyAnsC: this.settingsForm.keyAnsC,
        keyAnsD: this.settingsForm.keyAnsD,
        keyAnsE: this.settingsForm.keyAnsE,
        keyNext: this.settingsForm.keyNext,
        keyPrev: this.settingsForm.keyPrev,
        keyExit: this.settingsForm.keyExit
      });
      // Save locally for instant access
      localStorage.setItem('KEY_SHORTCUT_A', this.settingsForm.keyAnsA);
      localStorage.setItem('KEY_SHORTCUT_B', this.settingsForm.keyAnsB);
      localStorage.setItem('KEY_SHORTCUT_C', this.settingsForm.keyAnsC);
      localStorage.setItem('KEY_SHORTCUT_D', this.settingsForm.keyAnsD);
      localStorage.setItem('KEY_SHORTCUT_E', this.settingsForm.keyAnsE);
      localStorage.setItem('KEY_SHORTCUT_NEXT', this.settingsForm.keyNext);
      localStorage.setItem('KEY_SHORTCUT_PREV', this.settingsForm.keyPrev);
      localStorage.setItem('KEY_SHORTCUT_EXIT', this.settingsForm.keyExit);
      // Restart reminders with new config after saving
      if (this.settingsForm.notificationsEnabled) {
        this.notificationService.startReminders({
          preferredStudyTime: this.settingsForm.preferredStudyTime,
          notificationIntensity: this.settingsForm.notificationIntensity,
          notificationsEnabled: true,
        }, false);
      }
      this.initialSettingsForm = JSON.stringify(this.settingsForm);
      this.toast.success('Configuración guardada.');
      this.close.emit();
    } catch { this.toast.error('No se pudo guardar la configuración.'); } finally { this.saving = false; }
  }
}
