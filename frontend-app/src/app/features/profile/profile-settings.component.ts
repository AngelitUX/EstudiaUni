import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { updateProfile } from 'firebase/auth';
import { FirestoreService } from '../../core/services/firestore.service';
import { ToastService } from '../../core/services/toast.service';
import { NotificationService } from '../../core/services/notification.service';
import { AdminService } from '../admin/services/admin.service';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="page">
      <header class="topbar glass">
        <button class="btn-back" routerLink="/dashboard">← Volver</button>
        <h1>{{ isSettingsMode ? 'Configuración' : 'Perfil' }}</h1>
      </header>

      <section class="card glass profile-card" *ngIf="!isSettingsMode">
        <div class="profile-shell">
          <aside class="profile-sidebar">
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

            <div class="profile-summary">
              <h2 class="profile-title">
                {{ profileForm.displayName || 'Tu perfil' }}
                <span>{{ profileForm.profileEmoji || '✨' }}</span>
              </h2>
              <a *ngIf="adminService.isAdmin()" routerLink="/admin" class="admin-badge">
                🛡️ Panel de Admin
              </a>
              <p class="profile-subtitle">Personaliza tu identidad y tu imagen.</p>
            </div>

            <label class="sidebar-field">
              Nombre visible
              <input [(ngModel)]="profileForm.displayName" type="text" maxlength="50" placeholder="Tu nombre público" />
            </label>

            <label class="upload-card">
              <span class="upload-title">Sube tu foto</span>
              <span class="upload-text">JPG, PNG o WebP · Máx 2MB</span>
              <span class="upload-btn">Seleccionar archivo</span>
              <input type="file" accept="image/*" (change)="onPhotoFileSelected($event)" />
            </label>

            <label class="sidebar-field">
              URL de foto
              <input [(ngModel)]="profileForm.photoURL" type="url" placeholder="https://..." />
            </label>
          </aside>

          <div class="profile-main">
            <div class="section-block">
              <div class="section-header">
                <h3>Emote</h3>
                <p>Elige un emote que te represente.</p>
              </div>
              <div class="emoji-inline">
                <div class="emoji-preview">{{ profileForm.profileEmoji || '✨' }}</div>
                <div class="emoji-info">
                  <span class="emoji-label">Emote actual</span>
                  <span class="emoji-value">{{ profileForm.profileEmoji || '✨' }}</span>
                </div>
                <button class="btn-emoji" type="button" (click)="showEmojiPicker = true">
                  Elegir emote
                </button>
              </div>
            </div>

            <div class="section-block">
              <div class="section-header">
                <h3>Sobre ti</h3>
                <p>Una frase rápida para mostrar en tu perfil.</p>
              </div>
              <label>
                Descripción breve
                <textarea [(ngModel)]="profileForm.bio" rows="3" maxlength="140" placeholder="Quién eres en una frase"></textarea>
              </label>
              <div class="helper-row">
                <span>Máx 140 caracteres</span>
                <span class="counter">{{ profileForm.bio.length }}/140</span>
              </div>
            </div>

            <div class="action-bar">
              <button class="primary" (click)="saveProfile()" [disabled]="saving || loading">
                {{ saving ? 'Guardando...' : 'Guardar perfil' }}
              </button>
            </div>
          </div>
        </div>

        <div class="emoji-modal" *ngIf="showEmojiPicker">
          <div class="emoji-backdrop" (click)="showEmojiPicker = false"></div>
          <div class="emoji-panel glass">
            <div class="emoji-panel-header">
              <h4>Elige tu emote</h4>
              <button class="emoji-close" type="button" (click)="showEmojiPicker = false">×</button>
            </div>
            <div class="emoji-grid">
              <button
                type="button"
                class="emoji-option"
                *ngFor="let emoji of emojiOptions"
                [class.active]="profileForm.profileEmoji === emoji"
                (click)="selectEmoji(emoji); showEmojiPicker = false"
              >
                {{ emoji }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section class="card glass settings-card" *ngIf="isSettingsMode">
        <div class="section-header">
          <h2>Configuración</h2>
          <p class="muted">Opciones de estudio separadas del perfil.</p>
        </div>

        <div class="section-block">
          <div class="section-header">
            <h3>Objetivo académico</h3>
            <p>Define tu meta para personalizar recomendaciones.</p>
          </div>
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
        </div>

        <div class="section-block">
          <div class="section-header">
            <h3>Preferencias</h3>
            <p>Configura tu ritmo ideal de estudio.</p>
          </div>
          <div class="grid">
            <label>
              Horario preferido
              <select [(ngModel)]="settingsForm.preferredStudyTime">
                <option value="manana">Mañana (7:00 - 11:00)</option>
                <option value="tarde">Tarde (14:00 - 18:00)</option>
                <option value="noche">Noche (20:00 - 23:00)</option>
              </select>
            </label>
            
            <label>
              Tema visual
              <select [(ngModel)]="settingsForm.theme">
                <option value="dark">Oscuro</option>
                <option value="light">Claro</option>
                <option value="auto">Automático</option>
              </select>
            </label>
          </div>
        </div>
        
        <div class="section-block">
          <div class="section-header">
            <h3>Notificaciones</h3>
            <p>Avisos y recordatorios de estudio.</p>
          </div>
          <div class="grid">
            <label class="switch">
              <input [(ngModel)]="settingsForm.notificationsEnabled" type="checkbox" (change)="onNotificationsToggle()" />
              <span>Recordatorios activos</span>
            </label>

            <label>
              Intensidad
              <select [(ngModel)]="settingsForm.notificationIntensity" [disabled]="!settingsForm.notificationsEnabled">
                <option value="baja">Baja (cada 4 horas)</option>
                <option value="normal">Normal (cada 2 horas)</option>
                <option value="alta">Alta (cada 45 minutos)</option>
              </select>
            </label>
          </div>
        </div>

        <div class="action-bar">
          <button class="primary" (click)="saveSettings()" [disabled]="saving || loading">
            {{ saving ? 'Guardando...' : 'Guardar configuración' }}
          </button>
        </div>
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

    .btn-back {
      border: 0;
      background: transparent;
      color: var(--accent-primary);
      cursor: pointer;
      padding: 0;
      font-weight: 600;
      font-size: 0.95rem;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s;
    }
    .btn-back:hover {
      color: #fff;
      transform: translateX(-4px);
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
    .admin-badge {
      display: inline-block;
      margin-top: 0.5rem;
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #fca5a5;
      padding: 0.35rem 0.75rem;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.2s;
    }
    .admin-badge:hover {
      background: rgba(239, 68, 68, 0.25);
      transform: translateY(-2px);
    }

    .card {
      padding: 1.1rem;
    }
    .profile-card {
      padding: 1.25rem;
    }
    .profile-shell {
      display: grid;
      grid-template-columns: 260px 1fr;
      gap: 1.5rem;
    }
    .profile-sidebar {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .profile-summary {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .profile-subtitle {
      margin: 0;
      color: #9ca3af;
      font-size: 0.9rem;
      line-height: 1.5;
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

    .sidebar-field {
      margin-bottom: 0;
    }

    .upload-card {
      display: grid;
      gap: 0.4rem;
      padding: 0.85rem;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px dashed rgba(133, 92, 214, 0.45);
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .upload-card input {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
    }
    .upload-title {
      font-weight: 600;
      color: #e9d5ff;
    }
    .upload-text {
      font-size: 0.8rem;
      color: #9ca3af;
    }
    .upload-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.45rem 0.7rem;
      border-radius: 8px;
      background: rgba(133, 92, 214, 0.2);
      color: #e9d5ff;
      font-weight: 600;
      font-size: 0.85rem;
      width: fit-content;
    }

    .profile-main {
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
    }
    .section-block {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 16px;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }
    .section-header {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .section-header h3 {
      margin: 0;
      font-size: 1.05rem;
      color: #e5e7eb;
    }
    .section-header p {
      margin: 0;
      color: #9ca3af;
      font-size: 0.9rem;
    }

    .emoji-inline {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .emoji-preview {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      display: grid;
      place-items: center;
      font-size: 1.6rem;
      background: rgba(133, 92, 214, 0.2);
      border: 1px solid rgba(133, 92, 214, 0.35);
    }
    .emoji-info {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }
    .emoji-label {
      font-size: 0.8rem;
      color: #9ca3af;
    }
    .emoji-value {
      font-weight: 600;
      color: #e9d5ff;
      font-size: 1rem;
    }
    .btn-emoji {
      border: 1px solid rgba(133, 92, 214, 0.5);
      background: rgba(133, 92, 214, 0.18);
      color: #e9d5ff;
      border-radius: 10px;
      padding: 0.5rem 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-emoji:hover {
      border-color: #855cd6;
      background: rgba(133, 92, 214, 0.28);
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
    input:focus,
    textarea:focus,
    select:focus {
      outline: none;
      border-color: rgba(133, 92, 214, 0.7);
      box-shadow: 0 0 0 2px rgba(133, 92, 214, 0.2);
    }
    .emoji-picker {
      margin-top: 0.35rem;
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      padding-right: 0.25rem;
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
      transition: all 0.2s;
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
    .helper-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
      color: #9ca3af;
    }
    .counter {
      color: #e9d5ff;
      font-weight: 600;
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
    .action-bar {
      display: flex;
      justify-content: flex-end;
    }

    .emoji-modal {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
    }
    .emoji-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
    }
    .emoji-panel {
      position: relative;
      z-index: 1;
      width: min(560px, 90vw);
      padding: 1rem 1.25rem 1.25rem;
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.12);
    }
    .emoji-panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.85rem;
    }
    .emoji-panel-header h4 {
      margin: 0;
      font-size: 1rem;
    }
    .emoji-close {
      border: none;
      background: rgba(255, 255, 255, 0.08);
      color: #fff;
      width: 30px;
      height: 30px;
      border-radius: 8px;
      cursor: pointer;
    }
    .emoji-grid {
      display: grid;
      grid-template-columns: repeat(6, minmax(40px, 1fr));
      gap: 0.5rem;
    }

    .primary[disabled] {
      opacity: 0.6;
      cursor: not-allowed;
    }

    @media (max-width: 720px) {
      .profile-shell {
        grid-template-columns: 1fr;
      }
      .grid {
        grid-template-columns: 1fr;
      }

      .profile-head {
        align-items: flex-start;
      }
      .emoji-grid {
        grid-template-columns: repeat(5, minmax(40px, 1fr));
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
  public readonly adminService = inject(AdminService);

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

  showEmojiPicker = false;

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
    const rawPhoto = this.profileForm.photoURL.trim();
    const photoURL = rawPhoto || null;

    this.saving = true;
    try {
      await this.firestoreService.updateProfileSettings({
        displayName,
        photoURL,
        bio: this.profileForm.bio.trim(),
        profileEmoji: selectedEmoji,
      });

      let authSyncFailed = false;
      if (this.auth.currentUser) {
        const updatePayload: { displayName: string; photoURL?: string | null } = { displayName };
        if (this.shouldSyncAuthPhoto(photoURL)) {
          updatePayload.photoURL = photoURL;
        }
        try {
          await updateProfile(this.auth.currentUser, updatePayload);
        } catch {
          authSyncFailed = true;
        }
      }

      this.profileForm.profileEmoji = selectedEmoji;
      this.toast.success('Perfil guardado.');
      if (authSyncFailed) {
        this.toast.info('El perfil se guardó, pero la foto de la cuenta no se pudo actualizar.');
      }
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

  private shouldSyncAuthPhoto(photoURL: string | null): boolean {
    if (!photoURL) return true;
    return /^https?:\/\//i.test(photoURL);
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
