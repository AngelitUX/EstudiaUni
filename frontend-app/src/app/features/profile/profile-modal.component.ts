import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, inject, Output, EventEmitter, Input, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { updateProfile } from 'firebase/auth';
import { FirestoreService } from '../../core/services/firestore.service';
import { ToastService } from '../../core/services/toast.service';
import { AdminService } from '../admin/services/admin.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { CareerService, Career } from '../../core/services/career.service';

@Component({
  selector: 'app-profile-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="modal-overlay" (click)="closeModal()">
      <div class="modal-container glass" (click)="$event.stopPropagation()">
        <div class="modal-topbar">
          <h1>Perfil</h1>
          <div class="topbar-actions">
            <button class="btn-undo" *ngIf="isDirty()" (click)="undoChanges()" title="Deshacer todos los cambios">↺ Deshacer</button>
            <button class="btn-close" (click)="closeModal()">✕</button>
          </div>
        </div>
        <div class="modal-scroll">
          <div class="profile-shell">
            <aside class="profile-sidebar">
              <div class="avatar-container">
                <div class="avatar-wrap clickable" (click)="(isProPlan() || adminService.isAdmin()) ? photoInput.click() : showPremiumToast()" title="Foto de perfil">
                  <img *ngIf="profileForm.photoURL; else avatarFallback" [src]="profileForm.photoURL" class="avatar" alt="Foto de perfil"/>
                  <ng-template #avatarFallback><div class="avatar fallback">{{ initial }}</div></ng-template>
                  <div class="avatar-overlay">
                    <span>Cambiar foto</span>
                  </div>
                  <input #photoInput type="file" accept="image/*" (change)="onPhotoFileSelected($event)" style="display: none;" [disabled]="!(isProPlan() || adminService.isAdmin())"/>
                </div>
                <div class="emoji-pill clickable" (click)="$event.stopPropagation(); showEmojiPicker = true" title="Cambiar emote">
                  {{ profileForm.profileEmoji || '✨' }}
                </div>
              </div>

              <div class="profile-summary">
                <div class="name-edit-wrap">
                  <input *ngIf="isEditingName" [(ngModel)]="profileForm.displayName" class="title-input" (blur)="isEditingName = false" (keyup.enter)="isEditingName = false" #nameInput/>
                  <h2 class="profile-title" *ngIf="!isEditingName">{{ profileForm.displayName || 'Tu perfil' }}</h2>
                  <button class="btn-edit-name" (click)="toggleEditName()" [title]="isEditingName ? 'Confirmar' : 'Editar nombre'">
                    {{ isEditingName ? '✅' : '✏️' }}
                  </button>
                </div>
                <a *ngIf="adminService.isAdmin()" routerLink="/admin" class="admin-badge" (click)="closeModal()">🛡️ Panel de Admin</a>
                <p class="profile-subtitle">Personaliza tu identidad y tu imagen.</p>
              </div>

              <!-- SECTOR AVATARES PREDEFINIDOS EN MODAL -->
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


              <div class="sidebar-extra-fields">
                <label class="sidebar-field">Ubicación (Región)
                  <select [(ngModel)]="profileForm.location" class="sidebar-select">
                    <option value="">Selecciona tu región</option>
                    <option *ngFor="let region of chileanRegions" [value]="region">{{ region }}</option>
                  </select>
                </label>
                <label class="sidebar-field">Sobre ti
                  <textarea #bioInput [(ngModel)]="profileForm.bio" rows="4" maxlength="140" placeholder="Quién eres en una frase" style="width:100%; resize:none; font-size: 0.85rem; padding: 0.45rem; border-radius: 8px; border: 1.5px solid var(--glass-border); margin-top: 0.35rem; min-height: 80px;"></textarea>
                  <div class="helper-row" style="margin-top: 0.25rem;"><span>Máx 140</span><span class="counter">{{ profileForm.bio.length }}/140</span></div>
                </label>
              </div>
              
              <div class="sidebar-spacer"></div>
            </aside>
            <div class="profile-main">
              <div class="section-block">
                <div class="section-header"><h3>Plan de Cuenta</h3><p>Estado actual de tu suscripción en EstudiaUni.</p></div>
                <div class="info-row">
                <div class="info-item" style="width: 100%;">
                  <span class="info-label">Suscripción activa</span>
                  <div class="subscription-badge-wrap">
                    <span class="plan-badge-inline" [class.pro]="isProPlan()">{{ isProPlan() ? 'Premium 🚀' : 'Básico (Gratis)' }}</span>
                    <div class="subscription-status" *ngIf="isProPlan() && getSubscriptionInfo()">
                      <span class="subscription-cancelled" *ngIf="isSubscriptionCancelled()">(Cancelado)</span>
                      <span class="subscription-time-remaining animate-fade-in">
                        {{ getSubscriptionInfo() }}
                      </span>
                    </div>
                  </div>
                  <button *ngIf="isProPlan() && !isSubscriptionCancelled()" class="btn-cancel-subscription" (click)="openCancelSubscription()" id="btn-cancel-suscripcion">
                    ⚠️ Cancelar Suscripción
                  </button>
                </div>
              </div>
              </div>
              <div class="section-block subjects-section" [class.highlight-section]="scrollTarget === 'subjects-section'">
                <div class="section-header"><h3>Ruta de Aprendizaje</h3><p>Selecciona las materias que quieres ver en tu ruta.</p></div>
                <div class="grid subjects-grid-profile">
                  <label class="switch-profile" *ngFor="let subject of subjectsList">
                    <input type="checkbox" [checked]="isSubjectSelected(subject.id)" (change)="toggleSubject(subject.id)"/>
                    <span>{{ subject.name }}</span>
                  </label>
                </div>
              </div>
              <div class="section-block paes-goal-section" [class.highlight-section]="scrollTarget === 'paes-goal-section'">
                <div class="section-header">
                  <h3>🎯 Meta PAES</h3>
                  <p>Configura tu puntaje objetivo y mide tu progreso en el dashboard.</p>
                </div>
                <div class="goal-fields">
                  <label>Universidad
                    <select [(ngModel)]="profileForm.targetUniversity" (change)="onUniversityChange()">
                      <option value="">Selecciona tu universidad</option>
                      <option *ngFor="let uni of universidades" [value]="uni">{{ uni }}</option>
                    </select>
                  </label>
                  <label>Carrera a la que aspiras
                    <select [(ngModel)]="profileForm.targetCareer" [disabled]="!profileForm.targetUniversity">
                      <option value="">Selecciona tu carrera</option>
                      <option *ngFor="let c of carrerasFiltradas" [value]="c.nombre">{{ c.nombre }}</option>
                    </select>
                  </label>
                  <label>Puntaje de corte (100-1000)
                    <input [(ngModel)]="profileForm.targetScore" (blur)="onTargetScoreBlur()" (change)="onTargetScoreBlur()" type="number" min="100" max="1000" step="1" placeholder="Ej: 700"/>
                  </label>
                  
                  <div *ngIf="!profileForm.targetScore || !profileForm.targetCareer || !profileForm.targetUniversity" style="margin-top: 0.5rem; display: flex; justify-content: center;">
                    <a routerLink="/encuentra-tu-carrera" (click)="closeModal()" class="btn-buscar-carreras-profile" style="display: inline-flex; align-items: center; gap: 0.5rem; background: var(--accent-primary); color: white; padding: 0.6rem 1.25rem; border-radius: 9px; font-weight: 700; text-decoration: none; font-size: 0.9rem; transition: all 0.2s;">
                      🔍 Encuentra tu carrera ideal
                    </a>
                  </div>
                </div>
                <div class="goal-preview" *ngIf="profileForm.targetScore && profileForm.targetCareer">
                  <span class="goal-preview-icon">🏆</span>
                  <span class="goal-preview-text">Tu meta: <strong>{{ profileForm.targetCareer }}</strong> — {{ profileForm.targetScore }} pts</span>
                </div>
              </div>
              <div class="section-block nem-history-section" [class.highlight-section]="scrollTarget === 'nem-history-section'">
                <div class="section-header">
                  <h3>Historial NEM</h3>
                  <p>Tus notas guardadas desde la Calculadora NEM.</p>
                </div>
                <div class="nem-history-container" *ngIf="firestoreService.profileSignal()?.notasNem as nem; else noNemData">
                  <div class="nem-history-grid">
                    <div class="nem-stat">
                      <span class="nem-stat-label">1° Medio</span>
                      <span class="nem-stat-value">{{ nem.n1 || '--' }}</span>
                    </div>
                    <div class="nem-stat">
                      <span class="nem-stat-label">2° Medio</span>
                      <span class="nem-stat-value">{{ nem.n2 || '--' }}</span>
                    </div>
                    <div class="nem-stat">
                      <span class="nem-stat-label">3° Medio</span>
                      <span class="nem-stat-value">{{ nem.n3 || '--' }}</span>
                    </div>
                    <div class="nem-stat">
                      <span class="nem-stat-label">4° Medio</span>
                      <span class="nem-stat-value">{{ nem.n4 || '--' }}</span>
                    </div>
                  </div>
                  <div class="nem-group" *ngIf="nem.grupo">
                    <span class="nem-group-badge">Grupo {{ nem.grupo }} ({{ nem.grupo === 'A' ? 'HC Diurno' : nem.grupo === 'B' ? 'HC Vespertino' : 'TP' }})</span>
                  </div>
                </div>
                <ng-template #noNemData>
                  <div class="empty-nem">
                    <p>Aún no has guardado tus notas.</p>
                    <a routerLink="/calculadora-nem" (click)="closeModal()" class="btn-nem-link">Ir a la calculadora</a>
                  </div>
                </ng-template>
              </div>
              <div class="bottom-spacer"></div>
            </div>
          </div>
        </div>
        <div class="action-bar">
          <button class="primary" [class.dirty]="isDirty()" [class.shake]="shakeSaveButton" (click)="saveProfile()" [disabled]="saving || loading || !isDirty()">{{ saving ? 'Guardando...' : 'Guardar perfil' }}</button>
        </div>
        <div class="emoji-modal" *ngIf="showEmojiPicker">
            <div class="emoji-backdrop" (click)="showEmojiPicker = false"></div>
            <div class="emoji-panel glass">
              <div class="emoji-panel-header"><h4>Elige tu emote</h4><button class="emoji-close" type="button" (click)="showEmojiPicker = false">×</button></div>
              <div class="emoji-grid">
                <button type="button" class="emoji-option" *ngFor="let emoji of emojiOptions" [class.active]="profileForm.profileEmoji === emoji" (click)="selectEmoji(emoji); showEmojiPicker = false">{{ emoji }}</button>
              </div>
            </div>
          </div>

          <!-- IMAGE EDITOR MODAL -->
          <div class="image-editor-modal" *ngIf="showImageEditor">
            <div class="editor-backdrop" (click)="cancelImageEdition()"></div>
            <div class="editor-panel glass">
              <div class="editor-header">
                <h4>Editar imagen</h4>
                <button class="editor-close" (click)="cancelImageEdition()">×</button>
              </div>
              <div class="editor-body">
                <div class="crop-container" #cropContainer (mousedown)="onCropStart($event)" (touchstart)="onCropStart($event)">
                  <img [src]="imageToEdit" class="img-full-preview" [style.transform]="'rotate(' + rotation + 'deg)'" #imgRef/>
                  <div class="crop-overlay" [style.left.px]="cropX" [style.top.px]="cropY" [style.width.px]="cropSize" [style.height.px]="cropSize">
                    <div class="crop-handle" (mousedown)="onResizeStart($event)" (touchstart)="onResizeStart($event)"></div>
                  </div>
                </div>
                <div class="editor-controls">
                  <p class="editor-hint">Arrastra para mover el círculo y usa el controlador para cambiar el tamaño.</p>
                  <div class="control-buttons">
                    <button class="btn-tool" (click)="rotateImage(-90)" title="Girar izquierda">↺</button>
                    <button class="btn-tool" (click)="rotateImage(90)" title="Girar derecha">↻</button>
                  </div>
                </div>
              </div>
              <div class="editor-footer">
                <button class="btn-cancel" (click)="cancelImageEdition()">Cancelar</button>
                <button class="btn-save" (click)="applyImageEdition()">Aplicar foto</button>
              </div>
            </div>
          </div>
      </div>
    </div>

    <!-- CUSTOM LOGOUT CONFIRMATION -->
    <div class="logout-confirm-overlay" *ngIf="showLogoutConfirm" (click)="showLogoutConfirm = false">
      <div class="logout-confirm-modal glass" (click)="$event.stopPropagation()">
        <div class="confirm-header">
          <h2>Cerrar Sesión</h2>
          <button class="close-btn" (click)="showLogoutConfirm = false">&times;</button>
        </div>
        <div class="confirm-body">
          <div class="confirm-content">
            <div class="confirm-icon">🚪</div>
            <h3>¿Estás seguro de que quieres salir?</h3>
            <p>Se cerrará tu sesión actual y volverás a la página de inicio.</p>
          </div>
        </div>
        <div class="confirm-footer">
          <button class="btn-cancel" (click)="showLogoutConfirm = false">Cancelar</button>
          <button class="btn-logout-final" (click)="executeLogout()">Cerrar Sesión</button>
        </div>
      </div>
    </div>

    <!-- CUSTOM UNDO CONFIRMATION -->
    <div class="logout-confirm-overlay" *ngIf="showUndoConfirm" (click)="showUndoConfirm = false">
      <div class="logout-confirm-modal glass" (click)="$event.stopPropagation()">
        <div class="confirm-header">
          <h2>Deshacer Cambios</h2>
          <button class="close-btn" (click)="showUndoConfirm = false">&times;</button>
        </div>
        <div class="confirm-body">
          <div class="confirm-content">
            <div class="confirm-icon">↺</div>
            <h3>¿Deshacer todos los cambios?</h3>
            <p>Se descartarán todas las modificaciones que no hayas guardado.</p>
          </div>
        </div>
        <div class="confirm-footer">
          <button class="btn-cancel" (click)="showUndoConfirm = false">Cancelar</button>
          <button class="btn-confirm-final" (click)="executeUndoChanges()">Deshacer</button>
        </div>
      </div>
    </div>
    <!-- CANCEL SUBSCRIPTION - STEP 1 -->
    <div class="logout-confirm-overlay" *ngIf="showCancelSubStep1" (click)="showCancelSubStep1 = false">
      <div class="logout-confirm-modal glass" (click)="$event.stopPropagation()">
        <div class="confirm-header">
          <h2>Cancelar Suscripción</h2>
          <button class="close-btn" (click)="showCancelSubStep1 = false">&times;</button>
        </div>
        <div class="confirm-body">
          <div class="confirm-content">
            <div class="confirm-icon">📄</div>
            <h3>¿Seguro que quieres cancelar?</h3>
            <p>Perderás todos los beneficios <strong>Premium</strong> al término del período pagado. Ensayos ilimitados, Tutor IA y más.</p>
            <div class="cancel-sub-warning">⚠️ Esta acción es irreversible.</div>
          </div>
        </div>
        <div class="confirm-footer">
          <button class="btn-cancel" (click)="showCancelSubStep1 = false">No, mantener Premium</button>
          <button class="btn-cancel-sub-next" (click)="goToCancelStep2()">Sí, continuar →</button>
        </div>
      </div>
    </div>

    <!-- CANCEL SUBSCRIPTION - STEP 2 (double confirm) -->
    <div class="logout-confirm-overlay" *ngIf="showCancelSubStep2" (click)="showCancelSubStep2 = false">
      <div class="logout-confirm-modal glass cancel-step2-modal" (click)="$event.stopPropagation()">
        <div class="confirm-header">
          <h2>Confirmación Final</h2>
          <button class="close-btn" (click)="showCancelSubStep2 = false">&times;</button>
        </div>
        <div class="confirm-body">
          <div class="confirm-content">
            <div class="confirm-icon">🚫</div>
            <h3>Úlltima oportunidad</h3>
            <p>¿Estás completamente seguro? Deja de tener acceso Premium al finalizar tu ciclo de facturación.</p>
            <div class="cancel-countdown" *ngIf="cancelCountdown &gt; 0">
              El botón se activará en <strong>{{ cancelCountdown }}s</strong>
            </div>
          </div>
        </div>
        <div class="confirm-footer">
          <button class="btn-cancel" (click)="showCancelSubStep2 = false">No, quiero mantenerla</button>
          <button
            class="btn-cancel-sub-final"
            [disabled]="cancelCountdown &gt; 0"
            (click)="executeCancelSubscription()"
          >
            {{ cancelCountdown &gt; 0 ? 'Espera ' + cancelCountdown + 's...' : '🚫 Cancelar definitivamente' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay{position:fixed;inset:0;z-index:9000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.55);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);animation:fadeOverlay .25s ease}
    @keyframes fadeOverlay{from{opacity:0}to{opacity:1}}
    .modal-container{position:relative;width:min(920px,94vw);max-height:88vh;display:flex;flex-direction:column;border-radius:18px;background:#ffffff;border:2px solid var(--glass-border);box-shadow:var(--shadow-lg);animation:slideUp .3s cubic-bezier(.16,1,.3,1);color:var(--text-primary)}
    @keyframes slideUp{from{opacity:0;transform:translateY(32px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
    .modal-topbar{display:flex;align-items:center;justify-content:space-between;padding:1rem 1.25rem;border-bottom:2px solid var(--glass-border)}
    .modal-topbar h1{margin:0;font-size:1.15rem;font-weight:800}
    .topbar-actions{display:flex;align-items:center;gap:0.75rem}
    .btn-undo{background:rgba(133,92,214,0.1);border:1.5px solid var(--accent-primary);color:var(--accent-primary);padding:0.4rem 0.8rem;border-radius:10px;font-weight:700;font-size:0.85rem;cursor:pointer;transition:all 0.2s}
    .btn-undo:hover{background:var(--accent-primary);color:white}
    .btn-close{border:none;background:var(--bg-secondary);color:var(--text-secondary);width:34px;height:34px;border-radius:10px;font-size:1.1rem;cursor:pointer;display:grid;place-items:center;transition:all .2s}
    .btn-close:hover{background:rgba(239,68,68,0.25);color:#fca5a5}
    .modal-scroll{overflow-y:auto;padding:1.25rem;flex:1;overscroll-behavior:contain}
    .modal-scroll::-webkit-scrollbar{width:8px}
    .modal-scroll::-webkit-scrollbar-thumb{background:rgba(133,92,214,0.45);border-radius:99px}
    .modal-scroll::-webkit-scrollbar-thumb:hover{background:rgba(133,92,214,0.65)}

    .profile-shell{display:grid;grid-template-columns:260px 1fr;gap:1.5rem}
    .profile-sidebar{display:flex;flex-direction:column;align-items:center;text-align:center;gap:1rem;padding:1.25rem;border-radius:16px;background:var(--bg-color);border:2px solid var(--glass-border);align-self:flex-start;position:sticky;top:0.5rem}
    .profile-summary{display:flex;flex-direction:column;align-items:center;gap:.5rem}
    .profile-title{display:flex;align-items:center;justify-content:center;gap:.45rem;margin:0;font-size:1.15rem;line-height:1.15;word-break:break-word;max-width:200px}
    .name-edit-wrap{display:flex;align-items:center;justify-content:center;gap:0.5rem;width:100%}
    .title-input{font-size:1.15rem;font-weight:800;text-align:center;padding:0.2rem;margin:0;border-bottom:2px solid var(--accent-primary);border-radius:0;border-top:0;border-left:0;border-right:0;width:180px;background:transparent}
    .btn-edit-name{background:none;border:none;font-size:1.1rem;cursor:pointer;opacity:0.6;transition:all 0.2s;padding:0.2rem}
    .btn-edit-name:hover{opacity:1;transform:scale(1.2)}
    .profile-subtitle{margin:0;color:var(--text-secondary);font-size:.9rem;line-height:1.5;font-weight:500}
    .admin-badge{display:inline-block;margin-top:.5rem;background:#fee2e2;border:2px solid #fecaca;color:#dc2626;padding:.35rem .75rem;border-radius:6px;font-size:.8rem;font-weight:700;text-decoration:none;transition:all .2s}
    .admin-badge:hover{background:#fecaca;transform:translateY(-2px)}
    .avatar-container{position:relative;width:100px;height:100px}
    .avatar-wrap{position:relative;width:100px;height:100px;flex-shrink:0;cursor:pointer;overflow:hidden;border-radius:50%}
    .avatar-wrap:hover .avatar-overlay{opacity:1}
    .avatar-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.55);border-radius:50%;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s;color:white;font-size:0.85rem;font-weight:800;text-align:center;padding:0.5rem;line-height:1.2}
    .avatar{width:100%;height:100%;border-radius:50%;object-fit:cover;border:3px solid var(--accent-primary);box-shadow:0 0 15px rgba(133,92,214,0.2)}
    .avatar.fallback{display:grid;place-items:center;background:linear-gradient(135deg,#855cd6,#6b46b8);font-size:2rem;font-weight:700}
    .emoji-pill{position:absolute;right:0;bottom:0;background:#111827;border:1.5px solid rgba(255,255,255,0.2);border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;line-height:1;z-index:2;animation:emote-swing 2s ease-in-out infinite;transform-origin:center bottom}
    @keyframes emote-swing{
      0%,100%{transform:rotate(-8deg)}
      50%{transform:rotate(8deg)}
    }
    .emoji-pill.clickable{cursor:pointer;transition:all .2s}
    .emoji-pill.clickable:hover{transform:scale(1.2) rotate(0deg) !important;background:var(--accent-primary);border-color:white;box-shadow:0 0 10px rgba(133,92,214,0.5);animation:none}
    .subjects-grid-profile{grid-template-columns:1fr 1fr;gap:0.5rem}
    .switch-profile{display:flex;align-items:center;gap:.5rem;margin-top:.25rem;cursor:pointer;background:white;padding:0.5rem;border-radius:8px;border:1.5px solid var(--glass-border);transition:all 0.2s}
    .switch-profile:hover{border-color:var(--accent-primary);background:rgba(133,92,214,0.05)}
    .switch-profile input{width:auto;margin:0}
    .sidebar-extra-fields{width:100%;margin-top:1rem}
    .sidebar-field{width:100%;margin-bottom:0.85rem;text-align:left;font-size:0.85rem;color:var(--text-secondary);font-weight:600}
    .sidebar-select{width:100%;margin-top:0.35rem;padding:0.45rem;border-radius:8px;border:1.5px solid var(--glass-border);background:white;font-size:0.85rem;font-weight:600;color:var(--text-primary);cursor:pointer}
    .logout-profile-btn{margin-top:auto;width:100%;padding:.75rem;border-radius:12px;border:2px solid rgba(239,68,68,0.45);background:rgba(239,68,68,0.05);color:#ef4444;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:.6rem;transition:all .2s}
    .logout-profile-btn:hover { background: rgba(239, 68, 68, 0.2); color: #ef4444; border-color: #ef4444; transform: translateY(-1px); }

    /* LOGOUT CONFIRMATION */
    .logout-confirm-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; z-index: 10000; animation: fadeIn .2s ease; }
    .logout-confirm-modal { width: min(420px, 90vw); background: #ffffff; border-radius: 24px; border: 2px solid var(--glass-border); box-shadow: 0 20px 50px rgba(0,0,0,0.25); animation: slideUp .3s cubic-bezier(.16,1,.3,1); overflow: hidden; }
    .confirm-header { padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--glass-border); }
    .confirm-header h2 { margin: 0; font-size: 1.15rem; font-weight: 800; color: var(--text-primary); }
    .close-btn { background: none; border: none; font-size: 1.5rem; color: var(--text-muted); cursor: pointer; transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), color 0.2s ease; }
    .close-btn:hover { transform: rotate(90deg) scale(1.1); color: #ef4444 !important; }
    .confirm-body { padding: 2rem 1.5rem; }
    .confirm-content { text-align: center; }
    .confirm-icon { font-size: 3.5rem; margin-bottom: 1rem; }
    .confirm-content h3 { margin: 0 0 0.5rem; font-size: 1.3rem; font-weight: 800; }
    .confirm-content p { margin: 0; color: var(--text-secondary); font-weight: 500; }
    .confirm-footer { padding: 1.25rem 1.5rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; border-top: 1px solid var(--glass-border); background: var(--bg-secondary); }
    .btn-cancel { padding: 0.85rem; border-radius: 12px; border: 2px solid var(--glass-border); background: #ffffff; color: var(--text-primary); font-weight: 700; cursor: pointer; transition: all 0.2s; }
    .btn-cancel:hover { background: var(--bg-secondary); }
    .btn-logout-final { padding: 0.85rem; border-radius: 12px; border: none; background: #ef4444; color: #ffffff; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(239,68,68,0.25); }
    .btn-logout-final:hover { filter: brightness(1.1); transform: translateY(-2px); }
    .btn-confirm-final { padding: 0.85rem; border-radius: 12px; border: none; background: var(--accent-primary); color: #ffffff; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(133,92,214,0.25); }
    .btn-confirm-final:hover { filter: brightness(1.1); transform: translateY(-2px); }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    /* CANCEL SUBSCRIPTION */
    .btn-cancel-subscription { margin-top: 0.75rem; display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.5rem 1rem; border-radius: 8px; border: 1.5px solid rgba(239,68,68,0.35); background: rgba(239,68,68,0.06); color: #ef4444; font-size: 0.82rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
    .btn-cancel-subscription:hover { background: rgba(239,68,68,0.14); border-color: rgba(239,68,68,0.6); transform: translateY(-1px); }
    .cancel-sub-warning { margin-top: 1rem; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25); border-radius: 8px; padding: 0.6rem 0.9rem; font-size: 0.85rem; font-weight: 600; color: #ef4444; text-align: center; }
    .btn-cancel-sub-next { padding: 0.85rem; border-radius: 12px; border: none; background: #f59e0b; color: #fff; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(245,158,11,0.25); }
    .btn-cancel-sub-next:hover { filter: brightness(1.1); transform: translateY(-2px); }
    .cancel-step2-modal { border-color: rgba(239,68,68,0.3) !important; }
    .cancel-countdown { margin-top: 1rem; font-size: 0.88rem; color: var(--text-secondary); background: var(--bg-secondary); border-radius: 8px; padding: 0.5rem 0.75rem; text-align: center; }
    .btn-cancel-sub-final { padding: 0.85rem; border-radius: 12px; border: none; background: #ef4444; color: #fff; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(239,68,68,0.25); }
    .btn-cancel-sub-final:hover:not([disabled]) { filter: brightness(1.1); transform: translateY(-2px); }
    .btn-cancel-sub-final[disabled] { opacity: 0.5; cursor: not-allowed; transform: none !important; }

    .logout-profile-btn .icon{font-size:1.1rem}
    .profile-main{display:flex;flex-direction:column;gap:1.2rem}
    .section-block{background:var(--bg-color);border:2px solid var(--glass-border);border-radius:16px;padding:0.75rem 1rem;display:flex;flex-direction:column;gap:.6rem;transition:all 0.3s}
    .highlight-section { animation: pulse-glow 2s infinite; border-color: var(--accent-primary) !important; box-shadow: 0 0 15px rgba(133,92,214,0.4) !important; }
    @keyframes pulse-glow {
      0% { box-shadow: 0 0 15px rgba(133,92,214,0.3); }
      50% { box-shadow: 0 0 25px rgba(133,92,214,0.6); }
      100% { box-shadow: 0 0 15px rgba(133,92,214,0.3); }
    }
    .section-header{display:flex;flex-direction:column;gap:.25rem}
    .section-header h3{margin:0;font-size:1.05rem;color:var(--text-primary);font-weight:700}
    .section-header p{margin:0;color:var(--text-secondary);font-size:.9rem;font-weight:500}
    .emoji-inline{display:flex;align-items:center;gap:1rem;flex-wrap:wrap}
    .emoji-preview{width:52px;height:52px;border-radius:14px;display:grid;place-items:center;font-size:1.6rem;background:var(--bg-secondary);border:2px solid var(--glass-border)}
    .emoji-info{display:flex;flex-direction:column;gap:.2rem}
    .emoji-label{font-size:.75rem;color:var(--text-muted);font-weight:600;text-transform:uppercase}
    .emoji-value{font-weight:800;color:var(--accent-primary);font-size:1rem}
    .btn-emoji{border:2px solid var(--accent-primary);background:rgba(133,92,214,0.05);color:var(--accent-primary);border-radius:10px;padding:.5rem .9rem;font-weight:700;cursor:pointer;transition:all .2s}
    .btn-emoji:hover{border-color:#855cd6;background:rgba(133,92,214,0.12)}
    label{display:block;margin-bottom:.7rem;font-size:.9rem;color:var(--text-primary);font-weight:700}
    input,textarea,select{width:100%;margin-top:.25rem;border-radius:9px;border:2px solid var(--glass-border);background:#ffffff;color:var(--text-primary);padding:.58rem .65rem;font:inherit;box-sizing:border-box}
    input:focus,textarea:focus,select:focus{outline:none;border-color:var(--accent-primary);box-shadow:0 0 0 2px rgba(133,92,214,0.2)}
    .helper-row{display:flex;justify-content:space-between;font-size:.8rem;color:var(--text-muted);font-weight:600}
    .counter{color:var(--accent-primary);font-weight:700}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:.7rem}
    .info-row{display:flex;align-items:center;gap:1.5rem;margin-bottom:0.5rem;width:100%}
    .info-item{display:flex;flex-direction:column;gap:0.25rem;width:100%}
    .info-label{font-size:0.75rem;color:var(--text-muted);font-weight:600;text-transform:uppercase}
    .plan-badge-inline{font-size:0.95rem;font-weight:800;color:var(--text-secondary);background:var(--bg-secondary);padding:0.4rem 0.8rem;border-radius:8px;width:fit-content}
    .plan-badge-inline.pro{background:rgba(245,158,11,0.1);color:#d97706;border:1px solid rgba(245,158,11,0.3)}
    .subscription-badge-wrap{display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;margin-top:0.25rem}
    .subscription-status{display:flex;flex-direction:column;gap:0.25rem}
    .subscription-cancelled{font-size:0.75rem;font-weight:700;color:#ef4444}
    .subscription-time-remaining{font-size:0.88rem;font-weight:600;color:var(--text-secondary);border:1.5px solid var(--glass-border);padding:0.4rem 0.8rem;border-radius:8px;background:rgba(255, 255, 255, 0.45);box-shadow:var(--shadow-sm);line-height:1}
    .input-with-icon{position:relative;display:flex;align-items:center}
    .input-icon{position:absolute;left:0.75rem;font-size:1rem;pointer-events:none}
    .input-with-icon input{padding-left:2.4rem}
    .primary{margin-top:.3rem;border:0;border-radius:9px;background:#94a3b8;color:#fff;padding:.62rem .95rem;font-weight:600;cursor:pointer;transition:all .2s;box-shadow:0 4px 12px rgba(0,0,0,0.1)}
    .primary.dirty{background:linear-gradient(135deg,#855cd6,#6b46b8);box-shadow:0 4px 12px rgba(133,92,214,0.3)}
    .primary:hover:not([disabled]){filter:brightness(1.1);transform:translateY(-2px)}
    .primary[disabled]{cursor:not-allowed;opacity:.8}
    .action-bar{position:absolute;bottom:2rem;right:2.5rem;z-index:100;display:flex;flex-direction:column;align-items:flex-end;gap:0.5rem}
    .dirty-hint{font-size:0.8rem;color:#f59e0b;font-weight:700;animation:fadeIn .3s}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    .bottom-spacer{height:5rem}

    .nem-history-container{display:flex;flex-direction:column;gap:1rem;background:rgba(133,92,214,0.05);padding:1rem;border-radius:12px;border:1px solid rgba(133,92,214,0.15)}
    .nem-history-grid{display:flex;justify-content:space-between;gap:0.5rem}
    .nem-stat{display:flex;flex-direction:column;align-items:center;gap:0.25rem;background:#fff;padding:0.75rem 1rem;border-radius:10px;border:1px solid var(--glass-border);flex:1;box-shadow:var(--shadow-sm)}
    .nem-stat-label{font-size:0.7rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em}
    .nem-stat-value{font-size:1.3rem;font-weight:800;color:var(--accent-primary);line-height:1}
    .nem-group{display:flex;justify-content:center}
    .nem-group-badge{font-size:0.8rem;font-weight:700;color:var(--text-secondary);background:var(--bg-secondary);padding:0.35rem 0.8rem;border-radius:99px;border:1px solid var(--glass-border)}
    .empty-nem{display:flex;flex-direction:column;align-items:center;gap:0.75rem;padding:1.5rem;background:rgba(0,0,0,0.02);border-radius:12px;border:1px dashed var(--glass-border);text-align:center}
    .empty-nem p{margin:0;font-size:0.9rem;color:var(--text-secondary);font-weight:500}
    .btn-nem-link{display:inline-block;background:var(--accent-primary);color:white;text-decoration:none;padding:0.5rem 1.25rem;border-radius:8px;font-size:0.9rem;font-weight:700;transition:all 0.2s}
    .btn-nem-link:hover{filter:brightness(1.1);transform:translateY(-2px)}

    .primary.shake { animation: shake-btn 0.6s cubic-bezier(.36,.07,.19,.97) both; box-shadow: 0 0 0 2px #ef4444, 0 4px 12px rgba(239,68,68,0.4) !important; }
    @keyframes shake-btn {
      0%, 100% { transform: translate3d(0, 0, 0); }
      10%, 90% { transform: translate3d(-1px, 0, 0); }
      20%, 80% { transform: translate3d(2px, 0, 0); }
      30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
      40%, 60% { transform: translate3d(4px, 0, 0); }
    }

    .avatars-selector-container {
      width: 100%;
      margin: 0.75rem 0;
      text-align: left;
    }
    .avatars-selector-title {
      font-size: 0.75rem;
      color: var(--text-muted);
      font-weight: 700;
      display: block;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
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

    .emoji-modal{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:9500}
    .emoji-backdrop{position:absolute;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px)}
    .emoji-panel{position:relative;z-index:1;width:min(560px,90vw);padding:1rem 1.25rem 1.25rem;border-radius:16px;border:2px solid var(--glass-border);background:#ffffff;box-shadow:var(--shadow-lg)}
    .emoji-panel-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:.85rem}
    .emoji-panel-header h4{margin:0;font-size:1.1rem;color:var(--text-primary);font-weight:800}
    .emoji-close{border:none;background:var(--bg-secondary);color:var(--text-secondary);width:30px;height:30px;border-radius:8px;cursor:pointer}
    .emoji-grid{display:grid;grid-template-columns:repeat(6,minmax(40px,1fr));gap:.5rem}
    .emoji-option{border:2px solid var(--glass-border);background:var(--bg-color);color:var(--text-primary);border-radius:8px;padding:.35rem .48rem;cursor:pointer;line-height:1;font-size:1.2rem;transition:all .2s;display:grid;place-items:center}
    .emoji-option.active{border-color:var(--accent-primary);background:rgba(133,92,214,0.1)}

    @media(max-width:720px){
      .profile-shell{grid-template-columns:1fr}
      .emoji-grid{grid-template-columns:repeat(5,minmax(40px,1fr))}
      .grid{grid-template-columns:1fr}
    }

    /* PAES GOAL SECTION */
    .paes-goal-section { background: linear-gradient(135deg, rgba(133,92,214,0.03), rgba(99,102,241,0.05)) !important; }
    .goal-fields { display: flex; flex-direction: column; gap: 0.5rem; }
    .goal-fields label { font-size: 0.88rem; }
    .goal-preview { display: flex; align-items: center; gap: 0.75rem; background: rgba(133,92,214,0.08); border: 1.5px solid rgba(133,92,214,0.2); border-radius: 12px; padding: 0.85rem 1rem; margin-top: 0.5rem; }
    .goal-preview-icon { font-size: 1.5rem; }
    .goal-preview-text { font-size: 0.9rem; color: var(--text-primary); font-weight: 600; }
    .goal-preview-text strong { color: var(--accent-primary); }

    /* IMAGE EDITOR STYLES */
    .image-editor-modal{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:9600}
    .editor-backdrop{position:absolute;inset:0;background:rgba(0,0,0,0.8);backdrop-filter:blur(8px)}
    .editor-panel{position:relative;z-index:1;width:min(500px,94vw);background:#ffffff;border-radius:18px;border:2px solid var(--glass-border);padding:1.25rem;display:flex;flex-direction:column;gap:1.25rem}
    .editor-header{display:flex;justify-content:space-between;align-items:center}
    .editor-header h4{margin:0;font-size:1.1rem;font-weight:800}
    .editor-close{background:none;border:none;font-size:1.5rem;cursor:pointer;color:var(--text-secondary)}
    .editor-body{display:flex;flex-direction:column;gap:1.5rem;align-items:center;user-select:none}
    .crop-container{position:relative;width:340px;height:340px;background:#f3f4f6;border-radius:12px;overflow:hidden;display:flex;align-items:center;justify-content:center;border:1px solid var(--glass-border);cursor:crosshair}
    .img-full-preview{max-width:100%;max-height:100%;object-fit:contain;pointer-events:none}
    .crop-overlay{position:absolute;border:2px solid var(--accent-primary);box-shadow:0 0 0 4000px rgba(0,0,0,0.5);cursor:move;border-radius:50%}
    .crop-overlay::before{content:'';position:absolute;inset:0;border:1px solid rgba(255,255,255,0.4);border-radius:50%}
    .crop-handle{position:absolute;right:-6px;bottom:-6px;width:16px;height:16px;background:white;border:2px solid var(--accent-primary);border-radius:50%;cursor:nwse-resize;z-index:5}
    .editor-hint{font-size:0.8rem;color:var(--text-muted);text-align:center;margin-top:-0.5rem;font-weight:500}
    .editor-controls{width:100%;display:flex;flex-direction:column;gap:1rem}
    .control-buttons{display:flex;gap:.75rem;justify-content:center}
    .btn-tool{width:44px;height:44px;border-radius:10px;background:var(--bg-secondary);border:1.5px solid var(--glass-border);font-size:1.2rem;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center}
    .btn-tool:hover{background:var(--accent-primary);color:white;border-color:white;transform:scale(1.1)}
    .editor-footer{display:flex;justify-content:flex-end;gap:.75rem;border-top:1px solid var(--glass-border);padding-top:1rem}
    .btn-cancel{background:none;border:none;padding:.6rem 1rem;font-weight:600;cursor:pointer;color:var(--text-secondary)}
    .btn-save{background:var(--accent-primary);color:white;border:none;padding:.6rem 1.25rem;border-radius:9px;font-weight:700;cursor:pointer;box-shadow:0 4px 12px rgba(133,92,214,0.3);transition:all .2s}
    .btn-save:hover{filter:brightness(1.1);transform:translateY(-2px)}
  `]
})
export class ProfileModalComponent implements OnInit {
  public readonly firestoreService = inject(FirestoreService);
  private readonly toast = inject(ToastService);
  private readonly auth = inject(Auth);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  public readonly adminService = inject(AdminService);
  private readonly careerService = inject(CareerService);

  @Output() close = new EventEmitter<void>();
  @Input() scrollTarget?: string;

  ngAfterViewInit() {
    if (this.scrollTarget) {
      setTimeout(() => {
        const el = document.querySelector('.' + this.scrollTarget);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }

  loading = true;
  saving = false;
  showEmojiPicker = false;
  showLogoutConfirm = false;
  showUndoConfirm = false;
  showCancelSubStep1 = false;
  showCancelSubStep2 = false;
  cancelCountdown = 5;
  private cancelCountdownInterval: any = null;
  showImageEditor = false;
  shakeSaveButton = false;
  isEditingName = false;
  imageToEdit = '';

  universidades: string[] = [];
  todasLasCarreras: Career[] = [];
  carrerasFiltradas: Career[] = [];

  chileanRegions = [
    'Arica y Parinacota',
    'Tarapacá',
    'Antofagasta',
    'Atacama',
    'Coquimbo',
    'Valparaíso',
    'Metropolitana de Santiago',
    'Libertador Gral. Bernardo O\'Higgins',
    'Maule',
    'Ñuble',
    'Biobío',
    'La Araucanía',
    'Los Ríos',
    'Los Lagos',
    'Aysén del Gral. Carlos Ibáñez del Campo',
    'Magallanes y de la Antártica Chilena'
  ];

  rotation = 0;
  cropX = 50;
  cropY = 50;
  cropSize = 150;

  isDragging = false;
  isResizing = false;
  startX = 0;
  startY = 0;
  initialX = 0;
  initialY = 0;
  initialSize = 0;

  profileForm = {
    displayName: '',
    photoURL: '',
    bio: '',
    profileEmoji: '✨',
    school: '',
    location: '',
    selectedSubjects: [] as string[],
    targetScore: null as number | null,
    targetCareer: '',
    targetUniversity: ''
  };
  initialProfileForm = ''; // JSON string to compare
  subjectsList = [
    { id: 'comp-lectora', name: 'Competencia Lectora' },
    { id: 'mat1', name: 'Matemática M1' },
    { id: 'mat2', name: 'Matemática M2' },
    { id: 'historia', name: 'Historia y Cs. Sociales' },
    { id: 'ciencias-tp', name: 'Ciencias T.P.' },
    { id: 'ciencias-biologia', name: 'Biología' },
    { id: 'ciencias-fisica', name: 'Física' },
    { id: 'ciencias-quimica', name: 'Química' }
  ];
  emojiOptions = ['✨', '🔥', '🎯', '🚀', '📚', '🧠', '😎', '🌟', '🎓', '⚡', '💪', '🦊', '🐼', '🦄', '😄', '🤓', '🥳', '😺', '🌈', '🍀', '🪐', '🌙', '☀️', '🎵', '🎮', '🏆', '💎', '🧩', '🫶', '🛡️'];

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

  showPremiumToast(): void {
    this.toast.error('La carga de imágenes personalizadas es una función Premium ⚡.');
  }

  public get firestoreServiceSignal() {
    return this.firestoreService;
  }

  isProPlan = () => this.firestoreService.profileSignal()?.plan === 'premium';

  isSubscriptionCancelled(): boolean {
    return this.firestoreService.profileSignal()?.subscription?.status === 'cancelled';
  }

  getSubscriptionInfo(): string {
    const profile = this.firestoreService.profileSignal();
    if (!profile || !profile.subscription) return '';

    const sub = profile.subscription;
    if (sub.tier !== 'premium') return '';

    // Calculate dates
    let end: Date | null = null;
    if (sub.endDate) {
      if (typeof sub.endDate.toDate === 'function') {
        end = sub.endDate.toDate();
      } else {
        end = new Date(sub.endDate);
      }
    }

    if (!end) return 'Acceso de por vida ✨';

    // Format date: "Activa hasta el DD/MM/AAAA"
    const day = String(end.getDate()).padStart(2, '0');
    const month = String(end.getMonth() + 1).padStart(2, '0');
    const year = end.getFullYear();

    // Friendly days remaining (comparing normalized local midnights)
    const today = new Date();
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endMidnight = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    const diffTime = endMidnight.getTime() - todayMidnight.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'Expirada';
    } else if (diffDays === 0) {
      return 'Expira hoy ⚠️';
    } else if (diffDays === 1) {
      return 'Expira mañana ⚠️';
    } else if (diffDays <= 7) {
      return `Expira en ${diffDays} días ⏳ (${day}/${month}/${year})`;
    } else {
      return `Activa hasta el ${day}/${month}/${year} (${diffDays} días restantes)`;
    }
  }

  isDirty(): boolean {
    const current = { ...this.profileForm };
    const initial = JSON.parse(this.initialProfileForm);

    // Sort arrays for comparison to ignore order
    if (current.selectedSubjects) current.selectedSubjects = [...current.selectedSubjects].sort();
    if (initial.selectedSubjects) initial.selectedSubjects = [...initial.selectedSubjects].sort();

    return JSON.stringify(initial) !== JSON.stringify(current);
  }

  get initial(): string { return this.profileForm.displayName?.trim()?.charAt(0)?.toUpperCase() || 'U'; }

  ngOnInit(): void {
    // Bloquear scroll del fondo
    document.body.style.overflow = 'hidden';

    this.firestoreService.getUserProfile().subscribe({
      next: (profile) => {
        if (profile) {
          this.profileForm.displayName = profile.displayName || '';
          this.profileForm.photoURL = profile.photoURL || '';
          this.profileForm.bio = profile.bio || '';
          this.profileForm.profileEmoji = this.normalizeEmoji(profile.profileEmoji);
          this.profileForm.school = profile.school || '';
          this.profileForm.location = profile.location || '';
          this.profileForm.selectedSubjects = Array.isArray(profile.selectedSubjects)
            ? [...profile.selectedSubjects]
            : this.subjectsList.map(s => s.id);
          this.profileForm.targetScore = this.clampTargetScore(profile.targetScore);
          this.profileForm.targetCareer = profile.targetCareer || '';
          this.profileForm.targetUniversity = profile.targetUniversity || '';
          this.initialProfileForm = JSON.stringify(this.profileForm);
        }
        this.loading = false;
        
        this.careerService.getUniversidades().subscribe(unis => this.universidades = unis);
        this.careerService.getCareers().subscribe(carreras => {
          this.todasLasCarreras = carreras;
          this.onUniversityChange();
        });
      },
      error: () => { this.loading = false; this.toast.error('No se pudo cargar la información.'); }
    });
  }

  ngOnDestroy(): void {
    // Restaurar scroll del fondo
    document.body.style.overflow = '';
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

  undoChanges() {
    this.showUndoConfirm = true;
  }

  executeUndoChanges() {
    const original = JSON.parse(this.initialProfileForm);
    this.profileForm = { ...original };
    this.toast.info('Cambios deshechos.');
    this.showUndoConfirm = false;
  }

  openCancelSubscription() {
    this.showCancelSubStep1 = true;
  }

  goToCancelStep2() {
    this.showCancelSubStep1 = false;
    this.showCancelSubStep2 = true;
    this.cancelCountdown = 5;
    if (this.cancelCountdownInterval) clearInterval(this.cancelCountdownInterval);
    this.cancelCountdownInterval = setInterval(() => {
      this.cancelCountdown--;
      if (this.cancelCountdown <= 0) {
        clearInterval(this.cancelCountdownInterval);
        this.cancelCountdownInterval = null;
      }
    }, 1000);
  }

  async executeCancelSubscription() {
    this.showCancelSubStep2 = false;
    if (this.cancelCountdownInterval) clearInterval(this.cancelCountdownInterval);
    try {
      await this.firestoreService.cancelSubscription();
      this.toast.info('Tu suscripción ha sido cancelada. Mantendrás el acceso Premium hasta el fin de tu período pagado.');
    } catch {
      this.toast.error('No se pudo cancelar la suscripción. Contacta a soporte.');
    }
  }

  logout() {
    this.showLogoutConfirm = true;
  }

  async executeLogout() {
    this.showLogoutConfirm = false;
    await this.authService.logout().toPromise();
    this.router.navigate(['/']);
    this.closeModal();
  }

  isSubjectSelected(id: string): boolean {
    return this.profileForm.selectedSubjects.includes(id);
  }

  toggleSubject(id: string) {

    if (this.isSubjectSelected(id)) {
      this.profileForm.selectedSubjects = this.profileForm.selectedSubjects.filter(s => s !== id);
    } else {
      this.profileForm.selectedSubjects = [...this.profileForm.selectedSubjects, id];
    }
  }

  selectEmoji(emoji: string) { this.profileForm.profileEmoji = this.normalizeEmoji(emoji); }

  toggleEditName() {
    this.isEditingName = !this.isEditingName;
    if (this.isEditingName) {
      setTimeout(() => {
        const input = document.querySelector('.title-input') as HTMLInputElement;
        if (input) input.focus();
      }, 0);
    }
  }

  onPhotoFileSelected(event: Event): void {
    if (!this.isProPlan() && !this.adminService.isAdmin()) {
      this.toast.error('La carga de imágenes personalizadas es una función Premium ⚡.');
      return;
    }
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { this.toast.error('Selecciona una imagen valida.'); input.value = ''; return; }
    if (file.size > 2 * 1024 * 1024) { this.toast.error('La imagen debe ser menor a 2MB.'); input.value = ''; return; }

    const reader = new FileReader();
    reader.onload = () => {
      this.imageToEdit = reader.result as string;
      this.rotation = 0;
      this.cropX = 70;
      this.cropY = 70;
      this.cropSize = 200;
      this.showImageEditor = true;
      input.value = ''; // Reset input
    };
    reader.readAsDataURL(file);
  }

  // DRAG & RESIZE LOGIC
  onCropStart(event: MouseEvent | TouchEvent) {
    if (this.isResizing) return;
    this.isDragging = true;
    const pos = this.getEventPos(event);
    this.startX = pos.x;
    this.startY = pos.y;
    this.initialX = this.cropX;
    this.initialY = this.cropY;

    const moveSub = (e: MouseEvent | TouchEvent) => this.onMove(e);
    const endSub = () => {
      this.isDragging = false;
      window.removeEventListener('mousemove', moveSub as any);
      window.removeEventListener('touchmove', moveSub as any);
      window.removeEventListener('mouseup', endSub);
      window.removeEventListener('touchend', endSub);
    };
    window.addEventListener('mousemove', moveSub as any);
    window.addEventListener('touchmove', moveSub as any, { passive: false });
    window.addEventListener('mouseup', endSub);
    window.addEventListener('touchend', endSub);
  }

  onResizeStart(event: MouseEvent | TouchEvent) {
    event.stopPropagation();
    this.isResizing = true;
    const pos = this.getEventPos(event);
    this.startX = pos.x;
    this.initialSize = this.cropSize;

    const moveSub = (e: MouseEvent | TouchEvent) => this.onResizeMove(e);
    const endSub = () => {
      this.isResizing = false;
      window.removeEventListener('mousemove', moveSub as any);
      window.removeEventListener('touchmove', moveSub as any);
      window.removeEventListener('mouseup', endSub);
      window.removeEventListener('touchend', endSub);
    };
    window.addEventListener('mousemove', moveSub as any);
    window.addEventListener('touchmove', moveSub as any, { passive: false });
    window.addEventListener('mouseup', endSub);
    window.addEventListener('touchend', endSub);
  }

  private onMove(event: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    event.preventDefault();
    const pos = this.getEventPos(event);
    const dx = pos.x - this.startX;
    const dy = pos.y - this.startY;

    // Limits
    const containerSize = 340;
    this.cropX = Math.max(0, Math.min(containerSize - this.cropSize, this.initialX + dx));
    this.cropY = Math.max(0, Math.min(containerSize - this.cropSize, this.initialY + dy));
  }

  private onResizeMove(event: MouseEvent | TouchEvent) {
    if (!this.isResizing) return;
    event.preventDefault();
    const pos = this.getEventPos(event);
    const dx = pos.x - this.startX;

    const containerSize = 340;
    const newSize = Math.max(50, Math.min(containerSize - this.cropX, containerSize - this.cropY, this.initialSize + dx));
    this.cropSize = newSize;
  }

  private getEventPos(e: MouseEvent | TouchEvent) {
    if (e instanceof MouseEvent) return { x: e.clientX, y: e.clientY };
    return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }

  cancelImageEdition() {
    this.showImageEditor = false;
    this.imageToEdit = '';
  }

  rotateImage(deg: number) {
    this.rotation = (this.rotation + deg) % 360;
  }

  applyImageEdition() {
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.src = this.imageToEdit;

    img.onload = () => {
      const exportSize = 400;
      canvas.width = exportSize;
      canvas.height = exportSize;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Calcular proporciones
      const containerSize = 340;

      // La imagen se ajusta al contenedor (object-fit: contain)
      const aspect = img.width / img.height;
      let displayW, displayH;
      if (aspect > 1) {
        displayW = containerSize;
        displayH = containerSize / aspect;
      } else {
        displayH = containerSize;
        displayW = containerSize * aspect;
      }

      const offsetX = (containerSize - displayW) / 2;
      const offsetY = (containerSize - displayH) / 2;

      // Coordenadas relativas a la imagen mostrada
      const relX = (this.cropX - offsetX) / displayW;
      const relY = (this.cropY - offsetY) / displayH;
      const relSize = this.cropSize / Math.max(displayW, displayH);

      // Dibujar en canvas
      ctx.clearRect(0, 0, exportSize, exportSize);

      // Aplicar rotación (opcional si queremos que la imagen rote pero el crop no)
      // Por simplicidad, si rotamos, rotamos la imagen base antes de sacar el crop
      // Pero aquí implementaremos el crop sobre la imagen tal cual se ve

      const sourceX = relX * img.width;
      const sourceY = relY * img.height;
      const sourceSize = (this.cropSize / displayW) * img.width;

      ctx.drawImage(img, sourceX, sourceY, sourceSize, sourceSize, 0, 0, exportSize, exportSize);

      this.profileForm.photoURL = canvas.toDataURL('image/webp', 0.8);
      this.showImageEditor = false;
      this.imageToEdit = '';
      this.toast.success('Foto actualizada');
    };
  }

  async saveProfile(): Promise<void> {
    const displayName = this.profileForm.displayName.trim();
    if (!displayName) { this.toast.error('El nombre visible es obligatorio.'); return; }
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
        school: this.profileForm.school.trim(),
        location: this.profileForm.location.trim(),
        selectedSubjects: this.profileForm.selectedSubjects,
        targetScore: this.clampTargetScore(this.profileForm.targetScore),
        targetCareer: this.profileForm.targetCareer?.trim() || null,
        targetUniversity: this.profileForm.targetUniversity?.trim() || null
      });
      if (this.auth.currentUser) {
        const updatePayload: { displayName: string; photoURL?: string | null } = { displayName };
        if (!photoURL || /^https?:\/\//i.test(photoURL)) updatePayload.photoURL = photoURL;
        try { await updateProfile(this.auth.currentUser, updatePayload); } catch { }
      }
      this.profileForm.profileEmoji = selectedEmoji;
      this.toast.success('Perfil guardado.');
      this.close.emit();
    } catch { this.toast.error('No se pudo guardar el perfil.'); } finally { this.saving = false; }
  }

  private normalizeEmoji(value?: string | null): string {
    if (!value) return '✨';
    return value.trim() || '✨';
  }

  onTargetScoreBlur(): void {
    this.profileForm.targetScore = this.clampTargetScore(this.profileForm.targetScore);
  }

  onUniversityChange(): void {
    if (!this.profileForm.targetUniversity) {
      this.carrerasFiltradas = [];
      this.profileForm.targetCareer = '';
    } else {
      this.carrerasFiltradas = this.todasLasCarreras.filter(
        c => c.universidad === this.profileForm.targetUniversity
      );
      if (!this.carrerasFiltradas.some(c => c.nombre === this.profileForm.targetCareer)) {
        this.profileForm.targetCareer = '';
      }
    }
  }

  private clampTargetScore(value: number | string | null | undefined): number | null {
    if (value === null || value === undefined || value === '') return null;
    const n = Number(value);
    if (Number.isNaN(n)) return null;
    return Math.min(1000, Math.max(100, Math.round(n)));
  }
}
