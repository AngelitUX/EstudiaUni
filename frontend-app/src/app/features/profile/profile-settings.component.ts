import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { updateProfile } from 'firebase/auth';
import { FirestoreService } from '../../core/services/firestore.service';
import { ToastService } from '../../core/services/toast.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="page">
      <header class="topbar glass">
        <button class="back" routerLink="/dashboard">← Dashboard</button>
        <h1>{{ isSettingsMode ? 'Configuración' : 'Perfil' }}</h1>
      </header>

      <section class="card glass" *ngIf="!isSettingsMode">
        <div class="profile-head">
          <div class="avatar-wrap">
            <img
              *ngIf="profileForm.photoURL; else avatarFallback"
              [src]="profileForm.photoURL"
              class="avatar"
              alt="Foto de perfil"
            />
            <ng-template #avatarFallback>
              <div class="avatar fallback">{{ initial }}</div>
            </ng-template>
            <div class="emoji-pill">{{ profileForm.profileEmoji || '✨' }}</div>
          </div>
          <div>
            <h2 class="profile-title">
              {{ profileForm.displayName || 'Tu perfil' }}
              <span>{{ profileForm.profileEmoji || '✨' }}</span>
            </h2>
          </div>
        </div>

        <div class="grid">
          <label>
            Nombre visible
            <input [(ngModel)]="profileForm.displayName" type="text" maxlength="50" />
          </label>
          <label>
            Emote <small>(un emote que te represente!)</small>
            <div class="emoji-picker">
              <button
                type="button"
                class="emoji-option"
                *ngFor="let emoji of emojiOptions"
                [class.active]="profileForm.profileEmoji === emoji"
                (click)="selectEmoji(emoji)"
              >
                {{ emoji }}
              </button>
            </div>
            <div class="emoji-selected">Seleccionado: {{ profileForm.profileEmoji || '✨' }}</div>
          </label>
        </div>

        <label>
          URL de foto
          <input [(ngModel)]="profileForm.photoURL" type="url" placeholder="https://..." />
        </label>
        <label>
          O subir desde tu PC
          <input type="file" accept="image/*" (change)="onPhotoFileSelected($event)" />
        </label>

        <label>
          Descripción breve
          <textarea [(ngModel)]="profileForm.bio" rows="3" maxlength="140" placeholder="Quién eres en una frase"></textarea>
        </label>

        <button class="primary" (click)="saveProfile()" [disabled]="saving || loading">
          {{ saving ? 'Guardando...' : 'Guardar perfil' }}
        </button>
      </section>

      <section class="card glass" *ngIf="isSettingsMode">
        <h2>Configuración</h2>
        <p class="muted">Personaliza tu experiencia de estudio.</p>

        <h3>📚 Metas Académicas</h3>
        <div class="grid">
          <label>
            Carrera objetivo
            <input [(ngModel)]="settingsForm.targetCareer" type="text" maxlength="80" placeholder="Ej: Ingeniería" />
          </label>
          <label>
            Universidad objetivo
            <input [(ngModel)]="settingsForm.targetUniversity" type="text" maxlength="80" placeholder="Ej: U. de Chile" />
          </label>
          <label>
            Fecha meta de prueba
            <input [(ngModel)]="settingsForm.targetExamDate" type="date" />
          </label>
          <label>
            Meta diaria (min)
            <input [(ngModel)]="settingsForm.studyGoalMinutesPerDay" type="number" min="10" max="240" />
          </label>
        </div>

        <h3>⏰ Preferencias de Estudio</h3>
        <label>
          Horario preferido
          <select [(ngModel)]="settingsForm.preferredStudyTime">
            <option value="manana">Mañana (7:00 - 11:00)</option>
            <option value="tarde">Tarde (14:00 - 18:00)</option>
            <option value="noche">Noche (20:00 - 23:00)</option>
          </select>
        </label>

        <h3>🎨 Interfaz</h3>
        <label>
          Tema visual
          <select [(ngModel)]="settingsForm.theme">
            <option value="dark">Oscuro</option>
            <option value="light">Claro</option>
            <option value="auto">Automático</option>
          </select>
        </label>

        <h3>🔔 Notificaciones</h3>
        <label class="switch">
          <input [(ngModel)]="settingsForm.notificationsEnabled" type="checkbox" (change)="onNotificationsToggle()" />
          <span>Recordatorios activos</span>
        </label>

        <label>
          Intensidad de recordatorios
          <select [(ngModel)]="settingsForm.notificationIntensity" [disabled]="!settingsForm.notificationsEnabled">
            <option value="baja">Baja (cada 4 horas)</option>
            <option value="normal">Normal (cada 2 horas)</option>
            <option value="alta">Alta (cada 45 minutos)</option>
          </select>
        </label>

        <button class="primary" (click)="saveSettings()" [disabled]="saving || loading">
          {{ saving ? 'Guardando...' : 'Guardar configuración' }}
        </button>
      </section>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: #000;
      color: #fff;
    }

    .page {
      max-width: 920px;
      margin: 0 auto;
      padding: 1.5rem 1rem 2.5rem;
    }

    .glass {
      background: rgba(13, 15, 23, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 14px;
    }

    .topbar {
      padding: 0.9rem 1rem;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.7rem;
    }

    .back {
      border: 0;
      background: transparent;
      color: #c4b5fd;
      cursor: pointer;
      padding: 0;
    }

    h1 {
      margin: 0;
      font-size: 1.2rem;
    }

    h2 {
      margin: 0 0 0.35rem;
      font-size: 1.15rem;
    }

    h3 {
      margin: 1.2rem 0 0.6rem;
      font-size: 0.95rem;
      color: #d1d5db;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 0.9rem;
    }

    h3:first-child {
      margin-top: 0;
      border-top: none;
      padding-top: 0;
    }

    .muted {
      margin: 0 0 0.9rem;
      color: #9ca3af;
      font-size: 0.92rem;
    }
    .profile-title {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      margin: 0;
      font-size: 1.5rem;
      line-height: 1.15;
    }
    .profile-title span {
      font-size: 1.2rem;
    }

    .card {
      padding: 1.1rem;
    }

    .profile-head {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.6rem;
    }

    .avatar-wrap {
      position: relative;
      width: 90px;
      height: 90px;
      flex-shrink: 0;
    }

    .avatar {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid rgba(133, 92, 214, 0.6);
    }

    .avatar.fallback {
      display: grid;
      place-items: center;
      background: linear-gradient(135deg, #855cd6, #6b46b8);
      font-size: 1.6rem;
      font-weight: 700;
    }

    .emoji-pill {
      position: absolute;
      right: -4px;
      bottom: -4px;
      background: rgba(0, 0, 0, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.18);
      border-radius: 999px;
      padding: 0.2rem 0.45rem;
      font-size: 0.95rem;
      line-height: 1;
    }

    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.7rem;
    }

    label {
      display: block;
      margin-bottom: 0.7rem;
      font-size: 0.9rem;
      color: #d1d5db;
    }
    label small {
      color: #9ca3af;
      font-size: 0.78rem;
      margin-left: 0.25rem;
    }

    input,
    textarea,
    select {
      width: 100%;
      margin-top: 0.25rem;
      border-radius: 9px;
      border: 1px solid rgba(255, 255, 255, 0.16);
      background: rgba(0, 0, 0, 0.3);
      color: #fff;
      padding: 0.58rem 0.65rem;
      font: inherit;
    }
    .emoji-picker {
      margin-top: 0.35rem;
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }
    .emoji-option {
      border: 1px solid rgba(255, 255, 255, 0.16);
      background: rgba(0, 0, 0, 0.3);
      color: #fff;
      border-radius: 8px;
      padding: 0.35rem 0.48rem;
      cursor: pointer;
      line-height: 1;
      font-size: 1rem;
    }
    .emoji-option.active {
      border-color: rgba(133, 92, 214, 0.8);
      background: rgba(133, 92, 214, 0.22);
    }
    .emoji-selected {
      margin-top: 0.35rem;
      color: #9ca3af;
      font-size: 0.8rem;
    }

    .switch {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.25rem;
    }

    .switch input {
      width: auto;
      margin: 0;
    }

    .primary {
      margin-top: 0.3rem;
      border: 0;
      border-radius: 9px;
      background: linear-gradient(135deg, #855cd6, #6b46b8);
      color: #fff;
      padding: 0.62rem 0.95rem;
      font-weight: 600;
      cursor: pointer;
    }

    .primary[disabled] {
      opacity: 0.6;
      cursor: not-allowed;
    }

    @media (max-width: 720px) {
      .grid {
        grid-template-columns: 1fr;
      }

      .profile-head {
        align-items: flex-start;
      }
    }
  `],
})
export class ProfileSettingsComponent implements OnInit, OnDestroy {
  private readonly firestoreService = inject(FirestoreService);
  private readonly toast = inject(ToastService);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  isSettingsMode = false;
  loading = true;
  saving = false;

  profileForm = {
    displayName: '',
    photoURL: '',
    bio: '',
    profileEmoji: '✨',
  };
  emojiOptions = [
    '✨', '🔥', '🎯', '🚀', '📚', '🧠', '😎', '🌟', '🎓', '⚡',
    '💪', '🦊', '🐼', '🦄', '😄', '🤓', '🥳', '😺', '🌈', '🍀',
    '🪐', '🌙', '☀️', '🎵', '🎮', '🏆', '💎', '🧩', '🫶', '🛡️',
  ];

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

  get initial(): string {
    const base = this.profileForm.displayName?.trim();
    return base ? base.charAt(0).toUpperCase() : 'U';
  }

  ngOnInit(): void {
    this.isSettingsMode = this.router.url.includes('/settings');

    this.firestoreService.getUserProfile().subscribe({
      next: (profile) => {
        if (profile) {
          this.profileForm.displayName = profile.displayName || '';
          this.profileForm.photoURL = profile.photoURL || '';
          this.profileForm.bio = profile.bio || '';
          this.profileForm.profileEmoji = this.normalizeEmoji(profile.profileEmoji);

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
      error: () => {
        this.loading = false;
        this.toast.error('No se pudo cargar la información.');
      },
    });
  }

  async saveProfile(): Promise<void> {
    const displayName = this.profileForm.displayName.trim();
    if (!displayName) {
      this.toast.error('El nombre visible es obligatorio.');
      return;
    }

    const selectedEmoji = this.normalizeEmoji(this.profileForm.profileEmoji);

    this.saving = true;
    try {
      await this.firestoreService.updateProfileSettings({
        displayName,
        photoURL: this.profileForm.photoURL.trim() || null,
        bio: this.profileForm.bio.trim(),
        profileEmoji: selectedEmoji,
      });

      if (this.auth.currentUser) {
        await updateProfile(this.auth.currentUser, {
          displayName,
          photoURL: this.profileForm.photoURL.trim() || null,
        });
      }

      this.profileForm.profileEmoji = selectedEmoji;
      this.toast.success('Perfil guardado.');
      await this.router.navigate(['/dashboard']);
    } catch {
      this.toast.error('No se pudo guardar el perfil.');
    } finally {
      this.saving = false;
    }
  }

  selectEmoji(emoji: string): void {
    this.profileForm.profileEmoji = this.normalizeEmoji(emoji);
  }

  onPhotoFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.toast.error('Selecciona una imagen valida.');
      input.value = '';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.toast.error('La imagen debe ser menor a 2MB.');
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      this.profileForm.photoURL = result || this.profileForm.photoURL;
    };
    reader.readAsDataURL(file);
  }

  private normalizeEmoji(value?: string | null): string {
    if (!value) return '✨';
    const normalized = value.trim();
    const emojiMatch = normalized.match(/\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*/u);
    return emojiMatch ? emojiMatch[0] : '✨';
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
      this.toast.success('Configuración guardada.');
    } catch {
      this.toast.error('No se pudo guardar la configuración.');
    } finally {
      this.saving = false;
    }
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

  ngOnDestroy(): void {
    this.notificationService.stopReminders();
  }
}
