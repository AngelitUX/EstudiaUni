import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PaesContentService } from './services/paes-content.service';
import { AuthService } from '../../core/services/auth.service';
import { SettingsModalComponent } from '../profile/settings-modal.component';
import { ProfileModalComponent } from '../profile/profile-modal.component';
import { FirestoreService } from '../../core/services/firestore.service';
import { AdminService } from '../admin/services/admin.service';

type PathItem = 
  | { type: 'chapter', capituloId: string, title: string, subtitle: string }
  | { type: 'node', id: string, capituloId: string, title: string, status: 'completed' | 'active' | 'locked', nodeIndex: number };

@Component({
  selector: 'app-materia-path',
  standalone: true,
  imports: [CommonModule, RouterModule, SettingsModalComponent, ProfileModalComponent],
  template: `
    <div class="lp-layout">
      <!-- SIDEBAR -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <a routerLink="/dashboard" class="sidebar-logo" style="text-decoration:none;"><span class="text-gradient">EstudiaUni</span></a>
        </div>
        <nav class="sidebar-nav">
          <a class="nav-item" routerLink="/dashboard"><span class="nav-icon">🏠</span><span class="nav-text">Inicio</span></a>
          <a class="nav-item active" routerLink="/ruta"><span class="nav-icon">🗺️</span><span class="nav-text">Ruta de Aprendizaje</span></a>
          <a class="nav-item" routerLink="/ensayos"><span class="nav-icon">📚</span><span class="nav-text">Ensayos PAES</span></a>
        </nav>
        <div class="sidebar-footer">
          <a class="nav-item" (click)="showSettingsModal = true">
            <span class="nav-icon">⚙️</span>
            <span class="nav-text">Configuración</span>
          </a>
        </div>
      </aside>

      <!-- MOBILE HEADER -->
      <div class="mobile-header">
        <button class="mobile-menu-btn" (click)="mobileOpen = !mobileOpen">☰</button>
        <a routerLink="/dashboard" style="text-decoration:none;"><span class="text-gradient">EstudiaUni</span></a>
      </div>
      <div class="mobile-overlay" [class.open]="mobileOpen" (click)="mobileOpen = false">
        <div class="mobile-menu" (click)="$event.stopPropagation()">
          <nav class="sidebar-nav">
            <a class="nav-item" routerLink="/dashboard" (click)="mobileOpen=false"><span class="nav-icon">🏠</span><span class="nav-text">Inicio</span></a>
            <a class="nav-item active" routerLink="/ruta" (click)="mobileOpen=false"><span class="nav-icon">🗺️</span><span class="nav-text">Ruta de Aprendizaje</span></a>
            <a class="nav-item" routerLink="/ensayos" (click)="mobileOpen=false"><span class="nav-icon">📚</span><span class="nav-text">Ensayos PAES</span></a>
          </nav>
          <div class="mobile-footer" style="padding: 1rem; border-top: 1px solid rgba(255,255,255,0.1);">
            <a class="nav-item" (click)="showSettingsModal = true; mobileOpen=false">
              <span class="nav-icon">⚙️</span>
              <span class="nav-text">Configuración</span>
            </a>
          </div>
        </div>
      </div>

      <!-- MAIN -->
      <main class="main-content" *ngIf="materia() as m">
        <!-- HEADER -->
        <header class="path-header">
          <div class="header-left">
            <button class="btn-back" routerLink="/ruta">
              <span>←</span>
            </button>
            <div class="header-info">
              <h2>{{ m.title }}</h2>
            </div>
          </div>

          <div class="welcome-actions">
            <span class="plan-badge" [class.pro]="isProPlan() && !adminService.isAdmin()" [class.admin]="adminService.isAdmin()">
              {{ adminService.isAdmin() ? 'ADMIN' : (isProPlan() ? 'PRO' : 'BASICO') }}
            </span>
            <div class="profile-menu-wrap">
              <button class="profile-trigger" (click)="showProfileModal = true">
                <span class="profile-avatar-wrap">
                  <img *ngIf="firestoreService.profileSignal()?.photoURL; else avatarFallback" [src]="firestoreService.profileSignal()?.photoURL" alt="Foto de perfil" class="profile-avatar"/>
                  <ng-template #avatarFallback><span class="profile-avatar fallback">{{ profileInitial() }}</span></ng-template>
                  <span class="profile-emoji-badge">{{ firestoreService.profileSignal()?.profileEmoji || '✨' }}</span>
                </span>
              </button>
            </div>
          </div>
        </header>

        <div class="materia-page">
          <!-- DUOLINGO PATH -->
          <div class="duo-path-container">
            <ng-container *ngFor="let item of pathItems()">
              <!-- CHAPTER DIVIDER -->
              <div *ngIf="item.type === 'chapter'" class="chapter-divider">
                <div class="div-line"></div>
                <div class="div-content">
                  <span class="div-title">{{ item.title }}</span>
                  <button class="btn-guide" (click)="goToGuide(item.capituloId)">
                    <span class="guide-icon">📖</span> Guía
                  </button>
                </div>
                <div class="div-line"></div>
              </div>

              <!-- SECTION NODE -->
              <div *ngIf="item.type === 'node'" class="node-row">
                <div class="node-wrapper" [style.transform]="'translateX(' + getOffset(item.nodeIndex) + 'px)'">
                  <div class="active-tooltip" *ngIf="item.status === 'active'">
                    EMPEZAR
                    <div class="tooltip-arrow"></div>
                  </div>
                  <button class="duo-node" 
                    [class.node-completed]="item.status === 'completed'"
                    [class.node-active]="item.status === 'active'"
                    [class.node-locked]="item.status === 'locked'"
                    (click)="handleNodeClick(item)">
                    <div class="node-inner">
                      <svg *ngIf="item.status === 'completed'" class="node-icon icon-star" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <svg *ngIf="item.status === 'active'" class="node-icon icon-star" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <svg *ngIf="item.status === 'locked'" class="node-icon icon-lock" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
                      </svg>
                    </div>
                  </button>
                  <div class="node-title-top" 
                    [class.text-completed]="item.status === 'completed'"
                    [class.text-active]="item.status === 'active'">
                    {{ item.title }}
                  </div>
                </div>
              </div>
            </ng-container>
          </div>
        </div>
      </main>
    </div>
    <app-profile-modal *ngIf="showProfileModal" (close)="showProfileModal = false"></app-profile-modal>
    <app-settings-modal *ngIf="showSettingsModal" (close)="showSettingsModal = false"></app-settings-modal>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: var(--bg-color); color: var(--text-primary); }
    .lp-layout { display: flex; min-height: 100vh; }
    .text-gradient { background: var(--gradient-brand); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

    /* SIDEBAR */
    .sidebar { width: 260px; background: rgba(13,15,23,0.95); border-right: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; height: 100vh; z-index: 100; }
    .sidebar-header { padding: 2.5rem 1.5rem 2rem; border-bottom: 1px solid rgba(255,255,255,0.15); text-align: center; }
    .sidebar-logo { 
      font-family: var(--font-heading); 
      font-size: 2.2rem; 
      font-weight: 900; 
      background: linear-gradient(135deg, #ffffff 40%, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.04em; 
      text-shadow: 0 0 15px rgba(139, 92, 246, 0.3);
      position: relative;
    }
    .sidebar-nav { flex: 1; padding: 1rem 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; }
    .nav-item { display: flex; align-items: center; gap: 0.85rem; padding: 0.9rem 1.1rem; border-radius: 12px; color: #ffffff; text-decoration: none; transition: all 0.2s; cursor: pointer; background: transparent; border: none; width: 100%; text-align: left; font-size: 1.05rem; font-weight: 500; }
    .nav-item:hover { background: rgba(255,255,255,0.12); color: #fff; transform: translateX(4px); }
    .nav-item.active { background: rgba(99,102,241,0.25); color: #ffffff; border: 1.5px solid rgba(255,255,255,0.15); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .nav-icon { font-size: 1.35rem; width: 32px; display: flex; align-items: center; justify-content: center; }
    .sidebar-footer { padding: 1.25rem 0.75rem; border-top: 1px solid rgba(255,255,255,0.1); }

    /* MOBILE */
    .mobile-header { display: none; position: fixed; top: 0; left: 0; right: 0; height: 60px; background: rgba(13,15,23,0.95); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.1); padding: 0 1rem; align-items: center; gap: 1rem; z-index: 101; }
    .mobile-menu-btn { background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; }
    .mobile-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); z-index: 200; }
    .mobile-overlay.open { display: block; }
    .mobile-menu { position: absolute; top: 0; left: 0; width: 280px; height: 100%; background: #0d0f17; padding: 2rem 1rem; }

    /* MAIN */
    .main-content { flex: 1; margin-left: 260px; max-width: calc(100% - 260px); }

    .materia-page { max-width: 600px; margin: 0 auto; padding-bottom: 6rem; position: relative; }

    /* HEADER */
    .path-header { padding: 2rem 2.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; width: 100%; box-sizing: border-box; }
    .header-left { display: flex; align-items: center; gap: 1rem; }
    .btn-back { background: transparent; border: none; font-size: 1.5rem; color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; transition: all 0.2s; }
    .btn-back:hover { background: var(--bg-secondary); color: var(--accent-primary); transform: translateX(-4px); }
    .header-info h2 { font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; color: var(--text-primary); margin: 0; letter-spacing: -0.02em; }

    /* MATCH DASHBOARD WELCOME ACTIONS */
    .welcome-actions { display: flex; align-items: center; gap: 1rem; }
    .profile-menu-wrap { position: relative; }
    .profile-trigger { display: flex; align-items: center; justify-content: center; border: 2px solid var(--glass-border); background: #ffffff; color: var(--text-primary); border-radius: 50%; padding: 0.35rem; cursor: pointer; transition: all 0.2s; width: 62px; height: 62px; box-shadow: var(--shadow-sm); }
    .profile-trigger:hover { border-color: var(--accent-primary); box-shadow: var(--shadow); }
    .profile-avatar-wrap { position: relative; width: 52px; height: 52px; display: inline-block; flex-shrink: 0; }
    .profile-avatar { width: 52px; height: 52px; border-radius: 50%; object-fit: cover; }
    .profile-avatar.fallback { display: grid; place-items: center; background: var(--gradient-brand); font-weight: 700; font-size: 0.9rem; color: white; }
    .profile-emoji-badge { position: absolute; right: -5px; bottom: -5px; background: #111827; border: 1.5px solid rgba(255,255,255,0.2); border-radius: 999px; padding: 0.1rem 0.3rem; font-size: 0.75rem; line-height: 1; color: white; }
    
    .plan-badge { font-size: 0.85rem; letter-spacing: 0.05em; padding: 0.5rem 1rem; border-radius: 999px; font-weight: 800; background: var(--bg-secondary); color: var(--text-secondary); border: 2px solid var(--glass-border); line-height: 1; text-transform: uppercase; }
    .plan-badge.pro { background: rgba(245,158,11,0.1); color: #d97706; border-color: rgba(245,158,11,0.3); }
    .plan-badge.admin { background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #fff; border-color: #f59e0b; box-shadow: 0 0 10px rgba(245,158,11,0.5); border: none; }

    /* PATH CONTAINER */
    .duo-path-container { position: relative; padding: 2rem 0; display: flex; flex-direction: column; align-items: center; overflow: hidden; }

    /* CHAPTER DIVIDER */
    .chapter-divider { display: flex; align-items: center; width: 100%; max-width: 440px; margin: 1.5rem 0 7.5rem; position: relative; z-index: 15; padding: 0 1rem; }
    .div-line { flex: 1; height: 4px; background: var(--glass-border); border-radius: 99px; }
    .div-content { padding: 0 1.25rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 0.8rem; }
    .div-title { font-family: var(--font-heading); font-size: 1.05rem; font-weight: 800; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.08em; }
    
    .btn-guide { background: var(--accent-primary); border: 2px solid transparent; box-shadow: 0 4px 12px rgba(133,92,214,0.3); padding: 0.6rem 1.4rem; border-radius: 99px; font-family: var(--font-heading); font-size: 0.95rem; font-weight: 800; color: #fff; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 0.5rem; }
    .btn-guide:hover { background: #714cc2; transform: translateY(-3px); box-shadow: 0 6px 16px rgba(133,92,214,0.4); }
    .btn-guide:active { transform: translateY(0); box-shadow: 0 2px 8px rgba(133,92,214,0.3); }
    .guide-icon { font-size: 1.1rem; }

    /* NODE ROW */
    .node-row { width: 100%; display: flex; justify-content: center; margin-bottom: 5.5rem; position: relative; z-index: 2; }
    .node-wrapper { position: relative; display: flex; flex-direction: column; align-items: center; transition: transform 0.3s ease; }

    /* NODE FLOATING TITLE (TOP) */
    .node-title-top { position: absolute; top: -32px; left: 50%; transform: translateX(-50%); font-family: var(--font-heading); font-size: 0.95rem; font-weight: 800; color: var(--text-secondary); white-space: nowrap; pointer-events: none; transition: all 0.2s; text-shadow: 0 2px 4px rgba(255,255,255,1), 0 0 10px rgba(255,255,255,1); }
    .text-completed { color: #3d8c00; }
    .text-active { color: var(--accent-primary); top: -36px; }

    /* ACTIVE TOOLTIP */
    .active-tooltip { position: absolute; top: -82px; background: #111827; color: #fff; font-family: var(--font-heading); font-size: 0.85rem; font-weight: 800; padding: 0.6rem 1rem; border-radius: 12px; letter-spacing: 0.05em; animation: bounce 2s infinite; white-space: nowrap; box-shadow: 0 6px 16px rgba(0,0,0,0.15); z-index: 10; }
    .tooltip-arrow { position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 8px solid #111827; }

    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-8px); }
      60% { transform: translateY(-4px); }
    }

    /* DUO NODE BUTTON */
    .duo-node { border: none; border-radius: 50%; padding: 0; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); position: relative; outline: none; -webkit-tap-highlight-color: transparent; }
    .node-inner { width: 72px; height: 72px; border-radius: 50%; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
    .node-icon { width: 32px; height: 32px; }

    /* COMPLETED STATE */
    .node-completed { background: #58cc02; box-shadow: 0 6px 0 #46a302; }
    .node-completed .node-inner { background: linear-gradient(180deg, #65e003, #58cc02); }
    .node-completed .node-icon { color: white; }
    .node-completed:active { transform: translateY(6px); box-shadow: 0 0 0 #46a302; }

    /* ACTIVE STATE */
    .node-active { background: #ce82ff; box-shadow: 0 8px 0 #a559d6, 0 0 0 8px rgba(206,130,255,0.2); transform: scale(1.1); animation: pulseRing 3s infinite; }
    .node-active .node-inner { background: linear-gradient(180deg, #dfa6ff, #ce82ff); border: 4px solid white; width: 76px; height: 76px; }
    .node-active .node-icon { color: white; width: 36px; height: 36px; }
    .node-active:active { transform: scale(1.1) translateY(8px); box-shadow: 0 0 0 #a559d6, 0 0 0 4px rgba(206,130,255,0.2); }

    /* LOCKED STATE */
    .node-locked { background: #e5e5e5; box-shadow: 0 6px 0 #cccccc; cursor: not-allowed; }
    .node-locked .node-inner { background: #e5e5e5; }
    .node-locked .node-icon { color: #afafaf; }
    .node-locked:active { transform: translateY(6px); box-shadow: 0 0 0 #cccccc; }

    @keyframes pulseRing {
      0% { box-shadow: 0 8px 0 #a559d6, 0 0 0 0 rgba(206,130,255,0.4); }
      70% { box-shadow: 0 8px 0 #a559d6, 0 0 0 15px rgba(206,130,255,0); }
      100% { box-shadow: 0 8px 0 #a559d6, 0 0 0 0 rgba(206,130,255,0); }
    }

    @media (max-width: 768px) {
      .sidebar { display: none; }
      .mobile-header { display: flex; }
      .main-content { margin-left: 0; max-width: 100%; }
      .materia-page { padding-top: 60px; }
    }

    @media (max-width: 600px) {
      .node-inner { width: 64px; height: 64px; }
      .node-active .node-inner { width: 68px; height: 68px; }
      .node-icon { width: 28px; height: 28px; }
    }
  `]
})
export class MateriaPathComponent {
  private paes = inject(PaesContentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public firestoreService = inject(FirestoreService);
  public adminService = inject(AdminService);
  private auth = inject(AuthService);

  mobileOpen = false;
  showSettingsModal = false;
  showProfileModal = false;

  profileInitial = computed(() => {
    const name = this.firestoreService.profileSignal()?.displayName || '';
    return name.charAt(0).toUpperCase() || 'U';
  });
  isProPlan = computed(() => this.firestoreService.profileSignal()?.plan === 'premium');

  materiaId = signal('');
  materia = computed(() => this.paes.getMateriaById(this.materiaId()));
  capitulos = computed(() => this.paes.getCapitulosByMateria(this.materiaId()));

  // Pattern for horizontal zigzag staggering
  private offsets = [0, -40, -65, -40, 0, 40, 65, 40];

  constructor() {
    this.materiaId.set(this.route.snapshot.paramMap.get('materiaId') || '');
  }

  getOffset(index: number): number {
    return this.offsets[index % this.offsets.length];
  }

  pathItems = computed(() => {
    const items: PathItem[] = [];
    let nodeIndex = 0;
    let foundActive = false;

    this.capitulos().forEach((cap, capIndex) => {
      // 1. Add Chapter Divider
      items.push({
        type: 'chapter',
        capituloId: cap.id,
        title: cap.title,
        subtitle: `Capítulo ${capIndex + 1}`
      });

      // 2. Add Sections as nodes
      cap.secciones.forEach((sec) => {
        const prog = this.paes.getSeccionProgress(sec.id);
        const completed = prog?.completed || false;
        
        let status: 'completed' | 'active' | 'locked' = 'locked';

        if (completed) {
          status = 'completed';
        } else if (!foundActive) {
          status = 'active';
          foundActive = true;
        } else {
          status = 'locked';
        }

        items.push({
          type: 'node',
          id: sec.id,
          capituloId: cap.id,
          title: sec.title,
          status,
          nodeIndex: nodeIndex++
        });
      });
    });

    return items;
  });

  handleNodeClick(item: any) {
    if (item.status === 'locked') return;
    this.router.navigate(['/ruta', this.materiaId(), item.capituloId, item.id]);
  }

  goToGuide(capId: string) {
    this.router.navigate(['/ruta', this.materiaId(), capId]);
  }

}
