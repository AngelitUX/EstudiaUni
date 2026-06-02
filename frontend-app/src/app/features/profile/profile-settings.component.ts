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
import { PaymentService } from '../../core/services/payment.service';


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
                {{ getFirstName(profileForm.displayName) }}
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

            <!-- SECTOR AVATARES PREDEFINIDOS -->
            <div class="avatars-selector-container">
              <span class="avatars-selector-title">Avatares de Foco 🐙</span>
              <div class="avatars-grid">
                <button
                  type="button"
                  class="avatar-option-btn"
                  *ngFor="let avatar of avatarOptions"
                  [class.active]="profileForm.photoURL === avatar"
                  (click)="selectAvatar(avatar)"
                >
                  <img [src]="avatar" alt="Avatar Foco" />
                </button>
              </div>
            </div>

            <!-- CARGA DE ARCHIVO LOCAL (Solo Premium) -->
            <div class="premium-photo-section" [class.locked]="!isProPlan()">
              <label class="upload-card">
                <span class="upload-title">Sube tu foto</span>
                <span class="upload-text">JPG, PNG o WebP · Máx 2MB</span>
                <span class="upload-btn">Seleccionar archivo</span>
                <input type="file" accept="image/*" (change)="onPhotoFileSelected($event)" [disabled]="!isProPlan()" />
              </label>

              <label class="sidebar-field">
                URL de foto
                <input [(ngModel)]="profileForm.photoURL" type="url" placeholder="https://..." [disabled]="!isProPlan()" />
              </label>
              
              <!-- Alerta de Bloqueo Freemium -->
              <div class="freemium-lock-message" *ngIf="!isProPlan()" (click)="paymentService.openPricingModal()">
                <span>🔒 Carga de fotos es una función ⚡ PRO. ¡Pásate a Premium para subir la tuya!</span>
              </div>
            </div>

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

            <div class="section-block">
              <div class="section-header">
                <h3>🎯 Meta PAES</h3>
                <p>Configura tu objetivo académico de puntaje y carrera.</p>
              </div>
              <div class="grid">
                <label>
                  Carrera a la que aspiras
                  <input [(ngModel)]="profileForm.targetCareer" type="text" placeholder="Ej: Ingeniería Civil" />
                </label>
                <label>
                  Universidad
                  <input [(ngModel)]="profileForm.targetUniversity" type="text" placeholder="Ej: Universidad de Chile" />
                </label>
              </div>
              <label>
                Puntaje de corte (100-1000)
                <input [(ngModel)]="profileForm.targetScore" (blur)="onTargetScoreBlur()" (change)="onTargetScoreBlur()" type="number" min="100" max="1000" step="1" placeholder="Ej: 700" />
              </label>
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
          <div class="grid" style="grid-template-columns: 1fr;">
            <label>
              Horario preferido
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
                <option value="baja">Baja (cada hora y media)</option>
                <option value="normal">Normal (cada hora)</option>
                <option value="alta">Alta (cada 30 minutos)</option>
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
      background: var(--bg-color);
      color: var(--text-primary);
    }

    .page {
      max-width: 920px;
      margin: 0 auto;
      padding: 1.5rem 1rem 2.5rem;
    }

    .glass {
      background: #ffffff;
      border: 2px solid var(--glass-border);
      border-radius: 14px;
      box-shadow: var(--shadow-sm);
    }

    .topbar {
      padding: 0.9rem 1.25rem;
      margin-bottom: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.7rem;
      border: 2px solid var(--glass-border);
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
      font-weight: 800;
    }

    h2 {
      margin: 0 0 0.35rem;
      font-size: 1.15rem;
    }

    h3 {
      margin: 1.2rem 0 0.6rem;
      font-size: 0.95rem;
      color: var(--text-primary);
      font-weight: 700;
      border-top: 2px solid var(--glass-border);
      padding-top: 0.9rem;
    }

    h3:first-child {
      margin-top: 0;
      border-top: none;
      padding-top: 0;
    }

    .muted {
      margin: 0 0 0.9rem;
      color: var(--text-muted);
      font-size: 0.92rem;
      font-weight: 500;
    }
    .profile-title {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      margin: 0;
      font-size: 1.5rem;
      line-height: 1.15;
      font-weight: 800;
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
      background: var(--bg-color);
      border: 2px solid var(--glass-border);
    }
    .profile-summary {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .profile-subtitle {
      margin: 0;
      color: var(--text-secondary);
      font-size: 0.9rem;
      line-height: 1.5;
      font-weight: 500;
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
      background: #111827;
      border: 1.5px solid rgba(255, 255, 255, 0.2);
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
      background: var(--bg-secondary);
      border: 2px dashed var(--accent-primary);
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
      font-weight: 700;
      color: var(--accent-primary);
    }
    .upload-text {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 500;
    }
    .upload-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.45rem 0.7rem;
      border-radius: 8px;
      background: rgba(133, 92, 214, 0.1);
      color: var(--accent-primary);
      font-weight: 700;
      font-size: 0.85rem;
      width: fit-content;
      border: 1.5px solid var(--accent-primary);
    }

    .profile-main {
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
    }
    .section-block {
      background: var(--bg-color);
      border: 2px solid var(--glass-border);
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
      color: var(--text-primary);
      font-weight: 700;
    }
    .section-header p {
      margin: 0;
      color: var(--text-secondary);
      font-size: 0.9rem;
      font-weight: 500;
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
      background: var(--bg-secondary);
      border: 2px solid var(--glass-border);
    }
    .emoji-info {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }
    .emoji-label {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 600;
    }
    .emoji-value {
      font-weight: 800;
      color: var(--accent-primary);
      font-size: 1rem;
    }
    .btn-emoji {
      border: 2px solid var(--accent-primary);
      background: rgba(133, 92, 214, 0.05);
      color: var(--accent-primary);
      border-radius: 10px;
      padding: 0.5rem 0.9rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-emoji:hover {
      border-color: #855cd6;
      background: rgba(133, 92, 214, 0.12);
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
      color: var(--text-primary);
      font-weight: 700;
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
      border: 2px solid var(--glass-border);
      background: #ffffff;
      color: var(--text-primary);
      padding: 0.58rem 0.65rem;
      font: inherit;
    }
    input:focus,
    textarea:focus,
    select:focus {
      outline: none;
      border-color: var(--accent-primary);
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
      border: 2px solid var(--glass-border);
      background: var(--bg-color);
      color: var(--text-primary);
      border-radius: 8px;
      padding: 0.35rem 0.48rem;
      cursor: pointer;
      line-height: 1;
      font-size: 1.2rem;
      transition: all 0.2s;
      display: grid;
      place-items: center;
    }
    .emoji-option.active {
      border-color: var(--accent-primary);
      background: rgba(133, 92, 214, 0.1);
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
      color: var(--accent-primary);
      font-weight: 700;
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
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
    }
    .emoji-panel {
      position: relative;
      z-index: 1;
      width: min(560px, 90vw);
      padding: 1rem 1.25rem 1.25rem;
      border-radius: 16px;
      border: 2px solid var(--glass-border);
      background: #ffffff;
      box-shadow: var(--shadow-lg);
    }
    .emoji-panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.85rem;
    }
    .emoji-panel-header h4 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 800;
      color: var(--text-primary);
    }
    .emoji-close {
      border: none;
      background: var(--bg-secondary);
      color: var(--text-secondary);
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

    .avatars-selector-container {
      width: 100%;
      margin: 0.5rem 0;
      text-align: left;
    }
    .avatars-selector-title {
      font-size: 0.85rem;
      color: var(--text-secondary);
      font-weight: 700;
      display: block;
      margin-bottom: 0.5rem;
    }
    .avatars-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 0.4rem;
    }
    .avatar-option-btn {
      border: 2px solid var(--glass-border);
      background: var(--bg-color);
      border-radius: 50%;
      padding: 0;
      cursor: pointer;
      overflow: hidden;
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .avatar-option-btn:hover {
      transform: scale(1.1);
      border-color: rgba(133, 92, 214, 0.45);
    }
    .avatar-option-btn.active {
      border-color: var(--accent-primary);
      box-shadow: 0 0 10px rgba(133, 92, 214, 0.35);
      transform: scale(1.05);
    }
    .avatar-option-btn img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .premium-photo-section {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      position: relative;
    }
    .premium-photo-section.locked {
      opacity: 0.65;
    }
    .premium-photo-section.locked label,
    .premium-photo-section.locked input {
      pointer-events: none;
      cursor: not-allowed;
    }
    .freemium-lock-message {
      background: rgba(245, 158, 11, 0.08);
      border: 1.5px solid rgba(245, 158, 11, 0.3);
      color: #d97706;
      border-radius: 10px;
      padding: 0.6rem 0.8rem;
      font-size: 0.78rem;
      font-weight: 700;
      line-height: 1.3;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
      margin-top: 0.25rem;
    }
    .freemium-lock-message:hover {
      background: rgba(245, 158, 11, 0.15);
      transform: translateY(-1px);
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
  public readonly paymentService = inject(PaymentService);

  isSettingsMode = false;
  isProPlan = () => this.firestoreService.profileSignal()?.plan === 'premium';
  loading = true;
  saving = false;


  avatarOptions = [
    'assets/images/avatars/avatar_1.png',
    'assets/images/avatars/avatar_2.png',
    'assets/images/avatars/avatar_3.png',
    'assets/images/avatars/avatar_4.png',
    'assets/images/avatars/avatar_5.png',
    'assets/images/avatars/avatar_6.png',
    'assets/images/avatars/avatar_7.png',
    'assets/images/avatars/avatar_8.png',
    'assets/images/avatars/avatar_9.png',
    'assets/images/avatars/avatar_10.png'
  ];

  selectAvatar(avatar: string): void {
    this.profileForm.photoURL = avatar;
  }


  profileForm = {
    displayName: '',
    photoURL: '',
    bio: '',
    profileEmoji: '✨',
    targetScore: null as number | null,
    targetCareer: '',
    targetUniversity: '',
  };
  emojiOptions = [
    '✨', '🔥', '🎯', '🚀', '📚', '🧠', '😎', '🌟', '🎓', '⚡',
    '💪', '🦊', '🐼', '🦄', '😄', '🤓', '🥳', '😺', '🌈', '🍀',
    '🪐', '🌙', '☀️', '🎵', '🎮', '🏆', '💎', '🧩', '🫶', '🛡️',
  ];

  settingsForm = {
    studyGoalMinutesPerDay: 45,
    preferredStudyTime: 'tarde' as 'manana' | 'tarde' | 'noche' | 'ninguno',
    notificationsEnabled: true,
    theme: 'dark' as 'dark' | 'light' | 'auto',
    notificationIntensity: 'normal' as 'baja' | 'normal' | 'alta',
  };

  showEmojiPicker = false;

  get initial(): string {
    const base = this.profileForm.displayName?.trim();
    return base ? base.charAt(0).toUpperCase() : 'U';
  }

  getFirstName(fullName: string): string {
    if (!fullName) return 'Tu perfil';
    const first = fullName.trim().split(/\s+/)[0];
    return first || 'Tu perfil';
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
          this.profileForm.targetScore = this.clampTargetScore(profile.targetScore);
          this.profileForm.targetCareer = profile.targetCareer || '';
          this.profileForm.targetUniversity = profile.targetUniversity || '';

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

    if (this.profileForm.displayName.includes('\n') || this.profileForm.displayName.includes('\r')) {
      this.toast.error('El nombre no puede contener saltos de línea.');
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
        targetScore: this.clampTargetScore(this.profileForm.targetScore),
        targetCareer: this.profileForm.targetCareer?.trim() || null,
        targetUniversity: this.profileForm.targetUniversity?.trim() || null,
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
    if (!this.isProPlan()) {
      this.toast.error('La carga de fotos personalizadas es una función Premium ⚡.');
      return;
    }
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

  onTargetScoreBlur(): void {
    this.profileForm.targetScore = this.clampTargetScore(this.profileForm.targetScore);
  }

  private clampTargetScore(value: number | string | null | undefined): number | null {
    if (value === null || value === undefined || value === '') return null;
    const n = Number(value);
    if (Number.isNaN(n)) return null;
    return Math.min(1000, Math.max(100, Math.round(n)));
  }

  private shouldSyncAuthPhoto(photoURL: string | null): boolean {
    if (!photoURL) return true;
    return /^https?:\/\//i.test(photoURL);
  }

  async saveSettings(): Promise<void> {
    this.saving = true;
    try {
      await this.firestoreService.updateProfileSettings({
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
      }, true);
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
