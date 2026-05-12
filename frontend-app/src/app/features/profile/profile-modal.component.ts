import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, inject, Output, EventEmitter, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { updateProfile } from 'firebase/auth';
import { FirestoreService } from '../../core/services/firestore.service';
import { ToastService } from '../../core/services/toast.service';
import { AdminService } from '../admin/services/admin.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="modal-overlay" (click)="closeModal()">
      <div class="modal-container glass" (click)="$event.stopPropagation()">
        <div class="modal-topbar">
          <h1>Perfil</h1>
          <button class="btn-close" (click)="closeModal()">✕</button>
        </div>
        <div class="modal-scroll">
          <div class="profile-shell">
            <aside class="profile-sidebar">
              <div class="avatar-wrap">
                <img *ngIf="profileForm.photoURL; else avatarFallback" [src]="profileForm.photoURL" class="avatar" alt="Foto de perfil"/>
                <ng-template #avatarFallback><div class="avatar fallback">{{ initial }}</div></ng-template>
                <div class="emoji-pill">{{ profileForm.profileEmoji || '✨' }}</div>
              </div>
              <div class="profile-summary">
                <h2 class="profile-title">{{ profileForm.displayName || 'Tu perfil' }}</h2>
                <a *ngIf="adminService.isAdmin()" routerLink="/admin" class="admin-badge" (click)="closeModal()">🛡️ Panel de Admin</a>
                <p class="profile-subtitle">Personaliza tu identidad y tu imagen.</p>
              </div>
              <label class="sidebar-field">Nombre visible<input [(ngModel)]="profileForm.displayName" type="text" maxlength="50" placeholder="Tu nombre público"/></label>
              <label class="upload-card">
                <span class="upload-title">Sube tu foto</span>
                <span class="upload-text">JPG, PNG o WebP · Máx 2MB</span>
                <span class="upload-btn">Seleccionar archivo</span>
                <input type="file" accept="image/*" (change)="onPhotoFileSelected($event)"/>
              </label>

              <button class="logout-profile-btn" (click)="logout()">
                <span class="icon">🚪</span> Cerrar Sesión
              </button>
            </aside>
            <div class="profile-main">
              <div class="section-block">
                <div class="section-header"><h3>Emote</h3><p>Elige un emote que te represente.</p></div>
                <div class="emoji-inline">
                  <div class="emoji-preview">{{ profileForm.profileEmoji || '✨' }}</div>
                  <div class="emoji-info"><span class="emoji-label">Emote actual</span></div>
                  <button class="btn-emoji" type="button" (click)="showEmojiPicker = true">Elegir emote</button>
                </div>
              </div>
              <div class="section-block">
                <div class="section-header"><h3>Plan de Cuenta</h3><p>Estado actual de tu suscripción en EstudiaUni.</p></div>
                <div class="info-row">
                  <div class="info-item">
                    <span class="info-label">Suscripción activa</span>
                    <span class="plan-badge-inline" [class.pro]="isProPlan()">{{ isProPlan() ? 'Premium 🚀' : 'Básico (Gratis)' }}</span>
                  </div>
                </div>
              </div>
              <div class="section-block">
                <div class="section-header"><h3>Sobre ti</h3><p>Una frase rápida para mostrar en tu perfil.</p></div>
                <label>Descripción breve<textarea [(ngModel)]="profileForm.bio" rows="3" maxlength="140" placeholder="Quién eres en una frase"></textarea></label>
                <div class="helper-row"><span>Máx 140 caracteres</span><span class="counter">{{ profileForm.bio.length }}/140</span></div>
              </div>
              <div class="section-block">
                <div class="section-header"><h3>Objetivo académico</h3><p>Define tu meta para personalizar recomendaciones.</p></div>
                <div class="grid">
                  <label>Carrera objetivo
                    <select [(ngModel)]="profileForm.targetCareer">
                      <option value="">Selecciona tu carrera</option>
                      <option *ngFor="let c of careerOptions" [value]="c">{{ c }}</option>
                      <option value="Otra">Otra</option>
                    </select>
                  </label>
                  <label>Universidad objetivo
                    <select [(ngModel)]="profileForm.targetUniversity">
                      <option value="">Selecciona tu universidad</option>
                      <option *ngFor="let u of universityOptions" [value]="u">{{ u }}</option>
                      <option value="Otra">Otra</option>
                    </select>
                  </label>
                </div>
              </div>
              <div class="section-block">
                <div class="section-header"><h3>Redes Sociales</h3><p>Comparte tus enlaces externos.</p></div>
                <label>LinkedIn / Red Social
                  <div class="input-with-icon">
                    <span class="input-icon">🔗</span>
                    <input [(ngModel)]="profileForm.linkedinUrl" type="url" placeholder="https://linkedin.com/in/tu-perfil"/>
                  </div>
                </label>
              </div>
              <div class="bottom-spacer"></div>
            </div>
          </div>
        </div>
        <div class="action-bar">
          <button class="primary" [class.dirty]="isDirty()" (click)="saveProfile()" [disabled]="saving || loading || !isDirty()">{{ saving ? 'Guardando...' : 'Guardar perfil' }}</button>
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
    .btn-close{border:none;background:var(--bg-secondary);color:var(--text-secondary);width:34px;height:34px;border-radius:10px;font-size:1.1rem;cursor:pointer;display:grid;place-items:center;transition:all .2s}
    .btn-close:hover{background:rgba(239,68,68,0.25);color:#fca5a5}
    .modal-scroll{overflow-y:auto;padding:1.25rem;flex:1;overscroll-behavior:contain}
    .modal-scroll::-webkit-scrollbar{width:5px}
    .modal-scroll::-webkit-scrollbar-thumb{background:var(--glass-border);border-radius:99px}

    .profile-shell{display:grid;grid-template-columns:260px 1fr;gap:1.5rem}
    .profile-sidebar{display:flex;flex-direction:column;align-items:center;text-align:center;gap:1rem;padding:1.25rem;border-radius:16px;background:var(--bg-color);border:2px solid var(--glass-border);align-self:flex-start;position:sticky;top:0.5rem}
    .profile-summary{display:flex;flex-direction:column;align-items:center;gap:.5rem}
    .profile-title{display:flex;align-items:center;justify-content:center;gap:.45rem;margin:0;font-size:1.5rem;line-height:1.15}
    .profile-title span{font-size:1.2rem}
    .profile-subtitle{margin:0;color:var(--text-secondary);font-size:.9rem;line-height:1.5;font-weight:500}
    .admin-badge{display:inline-block;margin-top:.5rem;background:#fee2e2;border:2px solid #fecaca;color:#dc2626;padding:.35rem .75rem;border-radius:6px;font-size:.8rem;font-weight:700;text-decoration:none;transition:all .2s}
    .admin-badge:hover{background:#fecaca;transform:translateY(-2px)}
    .avatar-wrap{position:relative;width:90px;height:90px;flex-shrink:0}
    .avatar{width:100%;height:100%;border-radius:50%;object-fit:cover;border:2px solid rgba(133,92,214,0.6)}
    .avatar.fallback{display:grid;place-items:center;background:linear-gradient(135deg,#855cd6,#6b46b8);font-size:1.6rem;font-weight:700}
    .emoji-pill{position:absolute;right:-4px;bottom:-4px;background:#111827;border:1.5px solid rgba(255,255,255,0.2);border-radius:999px;padding:.2rem .45rem;font-size:.95rem;line-height:1}
    .sidebar-field{margin-bottom:0}
    .upload-card{display:grid;gap:.4rem;padding:.85rem;border-radius:12px;background:#f9fafb;border:2.5px dashed rgba(133,92,214,0.35);cursor:pointer;position:relative;overflow:hidden;text-align:center;justify-items:center}
    .upload-card input{position:absolute;inset:0;opacity:0;cursor:pointer}
    .upload-title{font-weight:700;color:var(--accent-primary)}
    .upload-text{font-size:.8rem;color:var(--text-muted);font-weight:500}
    .upload-btn{display:inline-flex;align-items:center;justify-content:center;padding:.45rem .7rem;border-radius:8px;background:rgba(133,92,214,0.1);color:var(--accent-primary);border:1.5px solid var(--accent-primary);font-weight:700;font-size:.85rem;width:fit-content}
    
    .logout-profile-btn{margin-top:1.5rem;width:100%;padding:.75rem;border-radius:12px;border:1.5px solid rgba(239,68,68,0.2);background:rgba(239,68,68,0.05);color:#ef4444;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:.6rem;transition:all .2s}
    .logout-profile-btn:hover{background:#ef4444;color:#fff;border-color:#ef4444;transform:translateY(-2px);box-shadow:0 4px 12px rgba(239,68,68,0.25)}
    .logout-profile-btn .icon{font-size:1.1rem}
    .profile-main{display:flex;flex-direction:column;gap:1.2rem}
    .section-block{background:var(--bg-color);border:2px solid var(--glass-border);border-radius:16px;padding:1rem;display:flex;flex-direction:column;gap:.85rem}
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
    .info-row{display:flex;align-items:center;gap:1.5rem;margin-bottom:0.5rem}
    .info-item{display:flex;flex-direction:column;gap:0.25rem}
    .info-label{font-size:0.75rem;color:var(--text-muted);font-weight:600;text-transform:uppercase}
    .plan-badge-inline{font-size:0.95rem;font-weight:800;color:var(--text-secondary);background:var(--bg-secondary);padding:0.4rem 0.8rem;border-radius:8px;width:fit-content}
    .plan-badge-inline.pro{background:rgba(245,158,11,0.1);color:#d97706;border:1px solid rgba(245,158,11,0.3)}
    .input-with-icon{position:relative;display:flex;align-items:center}
    .input-icon{position:absolute;left:0.75rem;font-size:1rem;pointer-events:none}
    .input-with-icon input{padding-left:2.4rem}
    .primary{margin-top:.3rem;border:0;border-radius:9px;background:#94a3b8;color:#fff;padding:.62rem .95rem;font-weight:600;cursor:pointer;transition:all .2s;box-shadow:0 4px 12px rgba(0,0,0,0.1)}
    .primary.dirty{background:linear-gradient(135deg,#855cd6,#6b46b8);box-shadow:0 4px 12px rgba(133,92,214,0.3)}
    .primary:hover:not([disabled]){filter:brightness(1.1);transform:translateY(-2px)}
    .primary[disabled]{cursor:not-allowed;opacity:.8}
    .action-bar{position:absolute;bottom:2rem;right:2.5rem;z-index:100}
    .bottom-spacer{height:5rem}

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
  `]
})
export class ProfileModalComponent implements OnInit {
  private readonly firestoreService = inject(FirestoreService);
  private readonly toast = inject(ToastService);
  private readonly auth = inject(Auth);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  public readonly adminService = inject(AdminService);

  @Output() close = new EventEmitter<void>();

  loading = true;
  saving = false;
  showEmojiPicker = false;

  profileForm = { displayName: '', photoURL: '', bio: '', profileEmoji: '✨', targetCareer: '', targetUniversity: '', linkedinUrl: '' };
  initialProfileForm = ''; // JSON string to compare
  emojiOptions = ['✨','🔥','🎯','🚀','📚','🧠','😎','🌟','🎓','⚡','💪','🦊','🐼','🦄','😄','🤓','🥳','😺','🌈','🍀','🪐','🌙','☀️','🎵','🎮','🏆','💎','🧩','🫶','🛡️'];
  careerOptions = [
    'Medicina', 'Ingeniería Civil', 'Ingeniería Civil Industrial', 'Ingeniería Civil Minas', 'Ingeniería Civil Eléctrica',
    'Ingeniería Civil Mecánica', 'Ingeniería Civil Informática', 'Derecho', 'Psicología', 'Enfermería',
    'Ingeniería Comercial', 'Arquitectura', 'Medicina Veterinaria', 'Odontología', 'Kinesiología',
    'Pedagogía Educación Básica', 'Pedagogía Matemáticas', 'Pedagogía Lenguaje', 'Pedagogía Inglés',
    'Diseño Gráfico', 'Diseño Industrial', 'Periodismo', 'Geología', 'Obstetricia', 'Química y Farmacia',
    'Terapia Ocupacional', 'Nutrición y Dietética', 'Trabajo Social', 'Biotecnología', 'Astronomía',
    'Bioquímica', 'Administración Pública', 'Sociología', 'Antropología', 'Arqueología', 'Agronomía',
    'Fonoaudiología', 'Tecnología Médica', 'Contador Auditor', 'Publicidad', 'Cine y Audiovisual'
  ];
  universityOptions = [
    'U. de Chile', 'P. Universidad Católica', 'U. de Concepción', 'USACH', 'UTFSM', 'U. Diego Portales',
    'U. Adolfo Ibáñez', 'PUCV', 'U. de Talca', 'U. de la Frontera', 'U. de los Andes', 'UNAB',
    'U. San Sebastián', 'U. de Antofagasta', 'U. de Valparaíso', 'U. Central', 'U. Mayor', 'U. Austral',
    'U. Católica del Norte', 'U. de Atacama', 'U. de Tarapacá', 'U. del Bio-Bío', 'U. de La Serena',
    'U. de Magallanes', 'UMCE', 'U. de Playa Ancha', 'UTEM', 'U. de O\'Higgins', 'U. de Aysén',
    'U. del Desarrollo', 'U. Finis Terrae', 'U. Santo Tomás', 'U. Autónoma', 'U. de Las Américas',
    'U. Bernardo O\'Higgins', 'U. Gabriela Mistral', 'U. Viña del Mar'
  ];

  isProPlan = () => this.firestoreService.profileSignal()?.plan === 'premium';

  isDirty(): boolean {
    return this.initialProfileForm !== JSON.stringify(this.profileForm);
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
          this.profileForm.targetCareer = profile.targetCareer || '';
          this.profileForm.targetUniversity = profile.targetUniversity || '';
          this.profileForm.linkedinUrl = profile.linkedinUrl || '';
          this.initialProfileForm = JSON.stringify(this.profileForm);
        }
        this.loading = false;
      },
      error: () => { this.loading = false; this.toast.error('No se pudo cargar la información.'); }
    });
  }

  ngOnDestroy(): void {
    // Restaurar scroll del fondo
    document.body.style.overflow = '';
  }

  closeModal() { this.close.emit(); }

  async logout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      await this.authService.logout().toPromise();
      this.closeModal();
      this.router.navigate(['/login']);
    }
  }

  selectEmoji(emoji: string) { this.profileForm.profileEmoji = this.normalizeEmoji(emoji); }

  onPhotoFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { this.toast.error('Selecciona una imagen valida.'); input.value = ''; return; }
    if (file.size > 2 * 1024 * 1024) { this.toast.error('La imagen debe ser menor a 2MB.'); input.value = ''; return; }
    const reader = new FileReader();
    reader.onload = () => { this.profileForm.photoURL = (typeof reader.result === 'string' ? reader.result : '') || this.profileForm.photoURL; };
    reader.readAsDataURL(file);
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
        targetCareer: this.profileForm.targetCareer.trim(),
        targetUniversity: this.profileForm.targetUniversity.trim(),
        linkedinUrl: this.profileForm.linkedinUrl.trim()
      });
      if (this.auth.currentUser) {
        const updatePayload: { displayName: string; photoURL?: string | null } = { displayName };
        if (!photoURL || /^https?:\/\//i.test(photoURL)) updatePayload.photoURL = photoURL;
        try { await updateProfile(this.auth.currentUser, updatePayload); } catch {}
      }
      this.profileForm.profileEmoji = selectedEmoji;
      this.toast.success('Perfil guardado.');
      this.close.emit();
    } catch { this.toast.error('No se pudo guardar el perfil.'); } finally { this.saving = false; }
  }

  private normalizeEmoji(value?: string | null): string {
    if (!value) return '✨';
    const normalized = value.trim();
    const emojiMatch = normalized.match(/\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*/u);
    return emojiMatch ? emojiMatch[0] : '✨';
  }
}
