import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../core/services/firestore.service';
import { ToastService } from '../../core/services/toast.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-settings-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="closeModal()">
      <div class="modal-container glass" (click)="$event.stopPropagation()">
        <div class="modal-topbar">
          <h1>Configuración</h1>
          <button class="btn-close" (click)="closeModal()">✕</button>
        </div>
        <div class="modal-scroll">
          <div class="section-block">
            <div class="section-header"><h3>Objetivo académico</h3><p>Define tu meta para personalizar recomendaciones.</p></div>
            <div class="grid">
              <label>Carrera objetivo<input [(ngModel)]="settingsForm.targetCareer" type="text" maxlength="80" placeholder="Ej: Ingeniería"/></label>
              <label>Universidad objetivo<input [(ngModel)]="settingsForm.targetUniversity" type="text" maxlength="80" placeholder="Ej: U. de Chile"/></label>
              <label>Fecha meta de prueba<input [(ngModel)]="settingsForm.targetExamDate" type="date"/></label>
              <label>Meta diaria (min)<input [(ngModel)]="settingsForm.studyGoalMinutesPerDay" type="number" min="10" max="240"/></label>
            </div>
          </div>
          <div class="section-block">
            <div class="section-header"><h3>Preferencias</h3><p>Configura tu ritmo ideal de estudio.</p></div>
            <div class="grid">
              <label>Horario preferido
                <select [(ngModel)]="settingsForm.preferredStudyTime">
                  <option value="manana">Mañana (7:00 - 11:00)</option>
                  <option value="tarde">Tarde (14:00 - 18:00)</option>
                  <option value="noche">Noche (20:00 - 23:00)</option>
                </select>
              </label>
              <label>Tema visual
                <select [(ngModel)]="settingsForm.theme">
                  <option value="dark">Oscuro</option>
                  <option value="light">Claro</option>
                  <option value="auto">Automático</option>
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
    .modal-container{position:relative;width:min(720px,94vw);max-height:88vh;display:flex;flex-direction:column;border-radius:18px;background:rgba(13,15,23,0.97);border:1px solid rgba(255,255,255,0.12);box-shadow:0 24px 80px rgba(0,0,0,0.6);animation:slideUp .3s cubic-bezier(.16,1,.3,1);color:#fff}
    @keyframes slideUp{from{opacity:0;transform:translateY(32px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
    .modal-topbar{display:flex;align-items:center;justify-content:space-between;padding:1rem 1.25rem;border-bottom:1px solid rgba(255,255,255,0.08)}
    .modal-topbar h1{margin:0;font-size:1.15rem}
    .btn-close{border:none;background:rgba(255,255,255,0.08);color:#fff;width:34px;height:34px;border-radius:10px;font-size:1.1rem;cursor:pointer;display:grid;place-items:center;transition:all .2s}
    .btn-close:hover{background:rgba(239,68,68,0.25);color:#fca5a5}
    .modal-scroll{overflow-y:auto;padding:1.25rem;flex:1;display:flex;flex-direction:column;gap:1rem}
    .modal-scroll::-webkit-scrollbar{width:5px}
    .modal-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:99px}
    .section-block{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:1rem;display:flex;flex-direction:column;gap:.85rem}
    .section-header{display:flex;flex-direction:column;gap:.25rem}
    .section-header h3{margin:0;font-size:1.05rem;color:#e5e7eb}
    .section-header p{margin:0;color:#9ca3af;font-size:.9rem}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:.7rem}
    label{display:block;margin-bottom:.7rem;font-size:.9rem;color:#d1d5db}
    input,textarea,select{width:100%;margin-top:.25rem;border-radius:9px;border:1px solid rgba(255,255,255,0.16);background:rgba(0,0,0,0.3);color:#fff;padding:.58rem .65rem;font:inherit;box-sizing:border-box}
    input:focus,select:focus{outline:none;border-color:rgba(133,92,214,0.7);box-shadow:0 0 0 2px rgba(133,92,214,0.2)}
    .switch{display:flex;align-items:center;gap:.5rem;margin-top:.25rem}
    .switch input{width:auto;margin:0}
    .primary{margin-top:.3rem;border:0;border-radius:9px;background:linear-gradient(135deg,#855cd6,#6b46b8);color:#fff;padding:.62rem .95rem;font-weight:600;cursor:pointer;transition:all .2s}
    .primary:hover{filter:brightness(1.1)}
    .primary[disabled]{opacity:.6;cursor:not-allowed}
    .action-bar{display:flex;justify-content:flex-end}
    .notification-status{display:flex;align-items:center;gap:.5rem;font-size:.85rem;color:#9ca3af;padding:.5rem .75rem;background:rgba(255,255,255,0.03);border-radius:10px;border:1px solid rgba(255,255,255,0.06)}
    .status-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
    .status-dot.granted{background:#10b981}
    .status-dot.denied{background:#f59e0b}
    .btn-request-perm{border:1px solid rgba(133,92,214,0.5);background:rgba(133,92,214,0.18);color:#e9d5ff;border-radius:8px;padding:.3rem .7rem;font-size:.8rem;font-weight:600;cursor:pointer;margin-left:auto;transition:all .2s}
    .btn-request-perm:hover{background:rgba(133,92,214,0.3)}
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

  settingsForm = {
    targetCareer: '',
    targetUniversity: '',
    targetExamDate: '',
    studyGoalMinutesPerDay: 45,
    preferredStudyTime: 'tarde' as 'manana' | 'tarde' | 'noche',
    notificationsEnabled: true,
    theme: 'dark' as 'dark' | 'light' | 'auto',
    notificationIntensity: 'normal' as 'baja' | 'normal' | 'alta',
  };

  ngOnInit(): void {
    this.notifPermissionGranted = this.notificationService.isNotificationPermissionGranted();
    this.firestoreService.getUserProfile().subscribe({
      next: (profile) => {
        if (profile) {
          this.settingsForm.targetCareer = profile.targetCareer || '';
          this.settingsForm.targetUniversity = profile.targetUniversity || '';
          this.settingsForm.targetExamDate = profile.targetExamDate || '';
          this.settingsForm.studyGoalMinutesPerDay = profile.studyGoalMinutesPerDay || 45;
          this.settingsForm.preferredStudyTime = profile.preferredStudyTime || 'tarde';
          this.settingsForm.notificationsEnabled = profile.notificationsEnabled ?? true;
          this.settingsForm.theme = profile.theme || 'dark';
          this.settingsForm.notificationIntensity = profile.notificationIntensity || 'normal';
        }
        this.loading = false;
      },
      error: () => { this.loading = false; this.toast.error('No se pudo cargar la información.'); }
    });
  }

  closeModal() { this.close.emit(); }

  async requestNotifPermission() {
    this.notifPermissionGranted = await this.notificationService.requestPermission();
    if (this.notifPermissionGranted) this.toast.success('Notificaciones permitidas');
    else this.toast.error('No se pudo obtener permiso de notificaciones');
  }

  onNotificationsToggle(): void {
    if (this.settingsForm.notificationsEnabled) {
      this.notificationService.startReminders({
        preferredStudyTime: this.settingsForm.preferredStudyTime,
        notificationIntensity: this.settingsForm.notificationIntensity,
        notificationsEnabled: true,
      });
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
        targetCareer: this.settingsForm.targetCareer.trim(),
        targetUniversity: this.settingsForm.targetUniversity.trim(),
        targetExamDate: this.settingsForm.targetExamDate || null,
        studyGoalMinutesPerDay: this.settingsForm.studyGoalMinutesPerDay,
        preferredStudyTime: this.settingsForm.preferredStudyTime,
        notificationsEnabled: this.settingsForm.notificationsEnabled,
        theme: this.settingsForm.theme,
        notificationIntensity: this.settingsForm.notificationIntensity,
      });
      // Restart reminders with new config after saving
      if (this.settingsForm.notificationsEnabled) {
        this.notificationService.startReminders({
          preferredStudyTime: this.settingsForm.preferredStudyTime,
          notificationIntensity: this.settingsForm.notificationIntensity,
          notificationsEnabled: true,
        });
      }
      this.toast.success('Configuración guardada.');
      this.close.emit();
    } catch { this.toast.error('No se pudo guardar la configuración.'); } finally { this.saving = false; }
  }
}
