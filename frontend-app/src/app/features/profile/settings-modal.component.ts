import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FirestoreService } from '../../core/services/firestore.service';
import { ToastService } from '../../core/services/toast.service';
import { NotificationService } from '../../core/services/notification.service';


@Component({
  selector: 'app-settings-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
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
            <div class="section-header"><h3>Preferencias</h3><p>Configura tu ritmo ideal de estudio.</p></div>
            <div class="grid">
              <label>Horario preferido
                <select [(ngModel)]="settingsForm.preferredStudyTime">
                  <option value="manana">Mañana (7:00 - 11:00)</option>
                  <option value="tarde">Tarde (14:00 - 18:00)</option>
                  <option value="noche">Noche (20:00 - 23:00)</option>
                  <option value="ninguno">No tengo horario específico</option>
                </select>
              </label>
            </div>
          </div>
          <div class="section-block">
            <div class="section-header"><h3>Notificaciones</h3><p>Avisos y recordatorios de estudio. Solo se envían dentro de tu horario preferido.</p></div>
            <div class="grid">
              <label class="switch">
                <input [(ngModel)]="settingsForm.notificationsEnabled" type="checkbox" (change)="onNotificationsToggle()"/>
                <span>Recordatorios activos</span>
              </label>
              <label>Intensidad
                <select [(ngModel)]="settingsForm.notificationIntensity" [disabled]="!settingsForm.notificationsEnabled">
                  <option value="baja">Baja (cada hora y media)</option>
                  <option value="normal">Normal (cada hora)</option>
                  <option value="alta">Alta (cada 30 minutos)</option>
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
            <div class="grid">
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
            <button class="primary" (click)="saveSettings()" [disabled]="saving || loading">{{ saving ? 'Guardando...' : 'Guardar configuración' }}</button>
          </div>
        </div>
      </div>
    </div>
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
    .primary{margin-top:.3rem;border:0;border-radius:9px;background:linear-gradient(135deg,#855cd6,#6b46b8);color:#fff;padding:.62rem .95rem;font-weight:600;cursor:pointer;transition:all .2s}
    .primary:hover{filter:brightness(1.1)}
    .primary[disabled]{opacity:.6;cursor:not-allowed}
    .action-bar{display:flex;justify-content:flex-end}
    .notification-status{display:flex;align-items:center;gap:.5rem;font-size:.85rem;color:var(--text-secondary);padding:.5rem .75rem;background:var(--bg-secondary);border-radius:10px;border:2px solid var(--glass-border);font-weight:600}
    .status-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
    .status-dot.granted{background:#10b981}
    .status-dot.denied{background:#f59e0b}
    .btn-request-perm{border:none;background:var(--accent-primary);color:#ffffff;border-radius:8px;padding:.4rem .9rem;font-size:.85rem;font-weight:700;cursor:pointer;margin-left:auto;transition:all .2s;box-shadow:0 2px 8px rgba(133,92,214,0.25)}
    .btn-request-perm:hover{filter:brightness(1.1);transform:translateY(-1px);box-shadow:0 4px 12px rgba(133,92,214,0.35)}
    .support-actions{display:flex;align-items:center;justify-content:flex-start}
    .support-link{display:inline-flex;align-items:center;gap:.45rem;text-decoration:none;border-radius:10px;border:2px solid var(--accent-primary);color:var(--accent-primary);padding:.55rem .9rem;font-weight:700;background:rgba(133,92,214,0.08);transition:all .2s}
    .support-link:hover{background:var(--accent-primary);color:#ffffff;transform:translateY(-1px)}
    @media(max-width:720px){.grid{grid-template-columns:1fr}}
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

  settingsForm = {
    preferredStudyTime: 'tarde' as 'manana' | 'tarde' | 'noche' | 'ninguno',
    notificationsEnabled: true,
    theme: 'dark' as 'dark' | 'light' | 'auto',
    notificationIntensity: 'normal' as 'baja' | 'normal' | 'alta',
    dyslexiaFont: false,
    fontSize: 'normal' as 'normal' | 'large' | 'xlarge'
  };


  ngOnInit(): void {
    this.useLocalMocks = localStorage.getItem('USE_LOCAL_MOCKS') === 'true';
    this.notifPermissionGranted = this.notificationService.isNotificationPermissionGranted();
    this.firestoreService.getUserProfile().subscribe({
      next: (profile) => {
        if (profile) {
          this.settingsForm.preferredStudyTime = profile.preferredStudyTime || 'tarde';
          this.settingsForm.notificationsEnabled = profile.notificationsEnabled ?? true;
          this.settingsForm.theme = profile.theme || 'dark';
          this.settingsForm.notificationIntensity = profile.notificationIntensity || 'normal';
          this.settingsForm.dyslexiaFont = !!profile.dyslexiaFont;
          this.settingsForm.fontSize = profile.fontSize || 'normal';
        }
        this.loading = false;
      },
      error: () => { this.loading = false; this.toast.error('No se pudo cargar la información.'); }
    });
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

  closeModal() { this.close.emit(); }

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
    classList.remove('font-large', 'font-xlarge');
    if (this.settingsForm.fontSize === 'large') classList.add('font-large');
    else if (this.settingsForm.fontSize === 'xlarge') classList.add('font-xlarge');
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
        fontSize: this.settingsForm.fontSize
      });
      // Restart reminders with new config after saving
      if (this.settingsForm.notificationsEnabled) {
        this.notificationService.startReminders({
          preferredStudyTime: this.settingsForm.preferredStudyTime,
          notificationIntensity: this.settingsForm.notificationIntensity,
          notificationsEnabled: true,
        }, false);
      }
      this.toast.success('Configuración guardada.');
      this.close.emit();
    } catch { this.toast.error('No se pudo guardar la configuración.'); } finally { this.saving = false; }
  }
}
