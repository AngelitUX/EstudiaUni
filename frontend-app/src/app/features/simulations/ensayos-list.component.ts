import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SettingsModalComponent } from '../profile/settings-modal.component';
import { ProfileModalComponent } from '../profile/profile-modal.component';
import { FirestoreService } from '../../core/services/firestore.service';

interface Prueba {
  id: string;
  nombre: string;
  icono: string;
  descripcion: string;
  tiempo: number;
  preguntas: number;
  subpruebas?: SubPrueba[];
}

interface SubPrueba {
  id: string;
  nombre: string;
  descripcion: string;
  ensayos?: EnsayoOption[];
}

interface EnsayoOption {
  id: string;
  nombre: string;
  descripcion: string;
}

type ExamMode = 'real' | 'asistido';

@Component({
  selector: 'app-ensayos-list',
  standalone: true,
  imports: [CommonModule, RouterModule, SettingsModalComponent, ProfileModalComponent],
  template: `
    <div class="ensayos-container">
      <!-- SIDEBAR -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <span class="sidebar-logo">
            <span class="text-gradient">EstudiaUni</span>
          </span>
        </div>
        
        <nav class="sidebar-nav">
          <a class="nav-item" routerLink="/dashboard">
            <span class="nav-icon">🏠</span>
            <span class="nav-text">Inicio</span>
          </a>
          <a class="nav-item" routerLink="/ruta">
            <span class="nav-icon">🗺️</span>
            <span class="nav-text">Ruta de Aprendizaje</span>
          </a>

          <a class="nav-item active" routerLink="/ensayos">
            <span class="nav-icon">📚</span>
            <span class="nav-text">Ensayo PAES</span>
          </a>
          <a class="nav-item" (click)="showSettingsModal = true">
            <span class="nav-icon">⚙️</span>
            <span class="nav-text">Configuración</span>
          </a>
        </nav>
        
        <div class="sidebar-footer">
          <button class="nav-item logout-btn" (click)="logout()">
            <span class="nav-icon">🚪</span>
            <span class="nav-text">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <!-- MAIN CONTENT -->
      <main class="main-content">
        <!-- HEADER -->
        <header class="header">
          <div class="header-main-row">
            <div class="header-left">
              <div class="header-back">
                <button class="btn-back" routerLink="/dashboard">← Volver</button>
              </div>
              <div class="header-content">
                <h1 class="title">Ensayos PAES</h1>
                <p class="subtitle">Realiza ensayos completos y simulacros bajo condiciones reales</p>
              </div>
            </div>
            
            <div class="header-actions">
              <span class="plan-badge" [class.pro]="isProPlan">{{ isProPlan ? 'PRO' : 'BASICO' }}</span>
              <div class="profile-menu-wrap">
                <button class="profile-trigger" (click)="showProfileModal = true">
                  <span class="profile-avatar-wrap">
                    <img *ngIf="userProfile?.photoURL; else avatarFallback" [src]="userProfile?.photoURL" alt="Foto de perfil" class="profile-avatar"/>
                    <ng-template #avatarFallback><span class="profile-avatar fallback">{{ profileInitial }}</span></ng-template>
                    <span class="profile-emoji-badge">{{ userProfile?.profileEmoji || '✨' }}</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <!-- PRUEBAS -->
        <div class="pruebas-section">
          <div class="pruebas-grid">
            <button
              *ngFor="let prueba of pruebas"
              type="button"
              class="prueba-card"
              (click)="seleccionarPrueba(prueba)"
              [class.prueba-card-selected]="pruebaSeleccionada?.id === prueba.id">
              <div class="card-icon">{{ prueba.icono }}</div>
              <div class="card-header">
                <h3 class="card-title">{{ prueba.nombre }}</h3>
                <p class="card-desc">{{ prueba.descripcion }}</p>
              </div>
              <div class="card-meta">
                <span class="meta-badge">
                  <span class="meta-icon">📝</span>
                  {{ prueba.preguntas }} pregs
                </span>
                <span class="meta-badge">
                  <span class="meta-icon">⏱️</span>
                  {{ prueba.tiempo }} min
                </span>
              </div>
            </button>
          </div>

          <div *ngIf="pruebaSeleccionada" class="modal-preparacion" (click)="cerrarSeleccion()">
            <div class="modal-content glass-card" (click)="$event.stopPropagation()">
              <button class="modal-close" (click)="cerrarSeleccion()">×</button>

              <div class="modal-icon">{{ pruebaSeleccionada.icono }}</div>
              <h2 class="modal-title">¿Listo para iniciar {{ getNombreSeleccionado() }}?</h2>

              <div class="modal-message">
                <p class="message-text">
                  Prepárate para rendir {{ getNombreSeleccionado() }}.
                </p>
                <p class="message-subtext">
                  Ponte cómodo, elimina distracciones y asegúrate de contar con el tiempo completo.
                </p>
              </div>

              <div *ngIf="pruebaSeleccionada.subpruebas?.length" class="subpruebas-section">
                <p class="subpruebas-title">Selecciona tu área:</p>
                <div class="subpruebas-grid">
                  <button
                    *ngFor="let sub of pruebaSeleccionada.subpruebas"
                    type="button"
                    class="subprueba-card"
                    (click)="seleccionarSubprueba(sub)"
                    [class.subprueba-card-selected]="subPruebaSeleccionada?.id === sub.id">
                    <span class="subprueba-name">{{ sub.nombre }}</span>
                    <span class="subprueba-desc">{{ sub.descripcion }}</span>
                  </button>
                </div>
              </div>

              <div *ngIf="subPruebaSeleccionada?.ensayos?.length" class="subpruebas-section" style="margin-top: 1.5rem;">
                <p class="subpruebas-title">Selecciona el ensayo:</p>
                <div class="subpruebas-grid">
                  <button
                    *ngFor="let ensayo of subPruebaSeleccionada?.ensayos"
                    type="button"
                    class="subprueba-card"
                    (click)="seleccionarEnsayo(ensayo)"
                    [class.subprueba-card-selected]="ensayoSeleccionado?.id === ensayo.id">
                    <span class="subprueba-name">{{ ensayo.nombre }}</span>
                    <span class="subprueba-desc">{{ ensayo.descripcion }}</span>
                  </button>
                </div>
              </div>

              <div class="prueba-detalles">
                <div class="detalle-item">
                  <span class="detalle-label">Prueba:</span>
                  <span class="detalle-valor">{{ getNombreSeleccionado() }}</span>
                </div>
                <div class="detalle-item">
                  <span class="detalle-label">Preguntas:</span>
                  <span class="detalle-valor">{{ pruebaSeleccionada.preguntas }}</span>
                </div>
                <div class="detalle-item">
                  <span class="detalle-label">Tiempo:</span>
                  <span class="detalle-valor">{{ pruebaSeleccionada.tiempo }} minutos</span>
                </div>
              </div>

              <div class="modal-actions">
                <button class="btn btn-outline" (click)="iniciarPrueba('real')">
                  Ensayo real
                </button>
                <button class="btn btn-primary" (click)="iniciarPrueba('asistido')">
                  Ensayo asistido
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    <app-settings-modal *ngIf="showSettingsModal" (close)="showSettingsModal = false"></app-settings-modal>
    <app-profile-modal *ngIf="showProfileModal" (close)="onProfileModalClose()"></app-profile-modal>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: var(--bg-color);
      color: var(--text-primary);
    }
    .ensayos-container { display: flex; min-height: 100vh; }
    .text-gradient { background: var(--gradient-brand); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    
    /* SIDEBAR */
    .sidebar { 
      width: 260px; 
      background: rgba(13, 15, 23, 0.95); 
      border-right: 1px solid rgba(255,255,255,0.1); 
      display: flex; 
      flex-direction: column; 
      position: fixed; 
      top: 0; 
      left: 0; 
      height: 100vh; 
      z-index: 100; 
    }
    .sidebar-header { 
      padding: 2.5rem 1.5rem 2rem; 
      border-bottom: 1px solid rgba(255,255,255,0.15); 
      text-align: center;
    }
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
    .sidebar-nav { 
      flex: 1; 
      padding: 1rem 0.75rem; 
      display: flex; 
      flex-direction: column; 
      gap: 0.5rem; 
    }
    .nav-item { 
      display: flex; 
      align-items: center; 
      gap: 0.85rem; 
      padding: 0.9rem 1.1rem; 
      border-radius: 12px; 
      color: #ffffff; 
      text-decoration: none; 
      transition: all 0.2s; 
      cursor: pointer; 
      font-size: 1.05rem;
      font-weight: 500;
    }
    .nav-item:hover { 
      background: rgba(255, 255, 255, 0.12); 
      color: #fff; 
      transform: translateX(4px);
    }
    .nav-item.active { 
      background: rgba(99, 102, 241, 0.25); 
      color: #ffffff; 
      border: 1.5px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .nav-icon { 
      font-size: 1.35rem; 
      width: 32px; 
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .sidebar-footer {
      padding: 1.25rem 1rem;
      border-top: none;
      display: flex;
      justify-content: center;
    }
    .logout-btn {
      width: fit-content;
      min-width: 180px;
      justify-content: center; 
      padding: 0.65rem 1rem;
      border: 1px solid rgba(239, 68, 68, 0.18) !important; 
      background: transparent !important; 
      color: rgba(252, 165, 165, 0.6) !important; 
      margin: 0 auto;
      border-radius: 14px;
      font-weight: 500;
    }
    .logout-btn:hover { 
      background: rgba(239, 68, 68, 0.1) !important; 
      border-color: #ef4444 !important; 
      color: #ef4444 !important; 
      transform: none !important; 
    }

    /* MAIN CONTENT */
    .main-content { 
      flex: 1; 
      margin-left: 260px; 
      padding: 2.5rem; 
    }

    /* HEADER */
    .header {
      margin-bottom: 3rem;
    }
    .header-main-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1.5rem;
    }
    .header-left {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .profile-menu-wrap { position: relative; }
    .profile-trigger { display: flex; align-items: center; justify-content: center; border: 2px solid var(--glass-border); background: #ffffff; color: var(--text-primary); border-radius: 50%; padding: 0.35rem; cursor: pointer; text-decoration: none; transition: all 0.2s; width: 62px; height: 62px; }
    .profile-trigger:hover { border-color: var(--accent-primary); box-shadow: 0 4px 12px rgba(133,92,214,0.1); }
    .profile-avatar-wrap { position: relative; width: 52px; height: 52px; display: inline-block; flex-shrink: 0; }
    .profile-avatar { width: 52px; height: 52px; border-radius: 50%; object-fit: cover; }
    .profile-avatar.fallback { display: grid; place-items: center; background: linear-gradient(135deg, #855cd6, #6b46b8); font-weight: 700; font-size: 0.9rem; border-radius: 50%; width: 100%; height: 100%; color: white; }
    .profile-emoji-badge { position: absolute; right: -5px; bottom: -5px; background: #111827; border: 1px solid rgba(255,255,255,0.2); border-radius: 999px; padding: 0.1rem 0.3rem; font-size: 0.75rem; line-height: 1; }
    .plan-badge { font-size: 0.85rem; letter-spacing: 0.05em; padding: 0.5rem 1rem; border-radius: 999px; font-weight: 800; background: var(--bg-secondary); color: var(--text-secondary); border: 2px solid var(--glass-border); line-height: 1; }
    .plan-badge.pro { background: rgba(245,158,11,0.1); color: #d97706; border-color: rgba(245,158,11,0.3); }
    .header-back {
      margin-bottom: 0;
    }
    .btn-back {
      background: none;
      border: none;
      color: var(--text-secondary);
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.2s;
      font-weight: 600;
    }
    .btn-back:hover {
      color: var(--accent-primary);
      transform: translateX(-4px);
    }
    .title {
      font-family: var(--font-heading);
      font-size: 2.8rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      letter-spacing: -0.03em;
    }
    .subtitle {
      color: var(--text-secondary);
      font-size: 1.15rem;
      font-weight: 500;
    }

    /* PRUEBAS GRID */
    .pruebas-section {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .pruebas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    /* PRUEBA CARD */
    .prueba-card {
      text-align: left;
      background: #ffffff;
      border: 2px solid var(--glass-border);
      border-radius: 20px;
      padding: 2.5rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      position: relative;
      overflow: hidden;
      color: inherit;
      box-shadow: var(--shadow);
    }
    .prueba-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), transparent);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .prueba-card:hover {
      border-color: rgba(133,92,214,0.4);
      box-shadow: var(--shadow-md);
      transform: translateY(-6px);
    }
    .prueba-card:hover::before {
      opacity: 1;
    }
    .prueba-card-selected {
      border-color: var(--accent-primary);
      background: rgba(133, 92, 214, 0.05);
      box-shadow: 0 12px 40px rgba(133, 92, 214, 0.15);
    }

    .card-icon {
      font-size: 3rem;
      line-height: 1;
    }
    .card-header {
      flex: 1;
    }
    .card-title {
      font-size: 1.4rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
      letter-spacing: -0.01em;
    }
    .card-desc {
      font-size: 1rem;
      color: var(--text-secondary);
      line-height: 1.6;
      font-weight: 500;
    }

    .card-meta {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .meta-badge {
      background: var(--bg-secondary);
      padding: 0.6rem 1.1rem;
      border-radius: 12px;
      font-size: 0.9rem;
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border: 1px solid var(--glass-border);
      font-weight: 700;
    }
    .meta-icon {
      font-size: 1rem;
    }

    /* MODAL PREPARACIÓN */
    .modal-preparacion {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      display: flex;
      align-items: flex-start;
      justify-content: center;
      z-index: 1000;
      padding: 1.5rem;
      overflow-y: auto;
      animation: fadeIn 0.25s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .modal-content {
      background: #ffffff;
      border: 2px solid rgba(0,0,0,0.06);
      border-radius: 20px;
      padding: 2.5rem;
      max-width: 560px;
      width: 100%;
      max-height: calc(100vh - 3rem);
      overflow-y: auto;
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      animation: slideUp 0.3s ease;
      margin: auto;
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .modal-close {
      position: absolute;
      top: 1.25rem;
      right: 1.25rem;
      background: rgba(0, 0, 0, 0.05);
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      font-size: 1.5rem;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal-close:hover {
      background: rgba(0, 0, 0, 0.1);
      color: var(--text-primary);
    }
    .modal-icon {
      font-size: 3.5rem;
      text-align: center;
    }
    .modal-title {
      font-size: 1.7rem;
      font-weight: 800;
      text-align: center;
      color: var(--text-primary);
    }
    .modal-message {
      background: rgba(133, 92, 214, 0.1);
      border-left: 4px solid var(--accent-primary);
      padding: 1rem 1.25rem;
      border-radius: 10px;
    }
    .message-text {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }
    .message-subtext {
      font-size: 0.95rem;
      color: var(--text-secondary);
      line-height: 1.6;
    }
    .subpruebas-section {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .subpruebas-title {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text-primary);
    }
    .subpruebas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 0.75rem;
    }
    .subprueba-card {
      text-align: left;
      border-radius: 12px;
      padding: 0.85rem 1rem;
      background: rgba(0, 0, 0, 0.02);
      border: 1px solid rgba(0, 0, 0, 0.06);
      color: inherit;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .subprueba-card:hover {
      border-color: rgba(133, 92, 214, 0.3);
      background: rgba(133, 92, 214, 0.05);
    }
    .subprueba-card-selected {
      border-color: var(--accent-primary);
      box-shadow: 0 4px 12px rgba(133, 92, 214, 0.15);
      background: rgba(133, 92, 214, 0.1);
    }
    .subprueba-name {
      font-weight: 700;
      color: var(--text-primary);
    }
    .subprueba-desc {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }
    .prueba-detalles {
      background: rgba(0, 0, 0, 0.02);
      border: 1px solid rgba(0, 0, 0, 0.06);
      border-radius: 12px;
      padding: 1.25rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 1.25rem;
    }
    .detalle-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .detalle-label {
      font-size: 0.8rem;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }
    .detalle-valor {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--accent-primary);
    }
    .modal-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }

    .btn {
      padding: 0.85rem 1.5rem;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
      flex: 1;
    }
    .btn-primary {
      background: var(--accent-primary);
      color: #fff;
      box-shadow: 0 4px 0 #6b46b8;
    }
    .btn-primary:hover {
      transform: translateY(2px);
      box-shadow: 0 2px 0 #6b46b8;
    }
    .btn-outline {
      background: #ffffff;
      border: 2px solid rgba(0,0,0,0.06);
      color: var(--text-primary);
    }
    .btn-outline:hover {
      border-color: rgba(0,0,0,0.15);
      background: rgba(0, 0, 0, 0.02);
    }
    .glass-card {
      background: #ffffff;
      border: 2px solid var(--glass-border);
      box-shadow: var(--shadow-lg);
    }

    /* RESPONSIVE */
    @media (max-width: 768px) {
      .sidebar { display: none; }
      .main-content { 
        margin-left: 0; 
        padding: 1.5rem;
      }
      .title { font-size: 1.8rem; }
      .pruebas-grid {
        grid-template-columns: 1fr;
      }
      .modal-content {
        padding: 2rem;
        border-radius: 16px;
      }
      .prueba-detalles {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class EnsayosListComponent implements OnInit {
  pruebas: Prueba[] = [
    {
      id: 'm1',
      nombre: 'M1',
      icono: '📐',
      descripcion: 'Competencia Matemática 1',
      tiempo: 140,
      preguntas: 65,
      subpruebas: [
        {
          id: 'm1',
          nombre: 'PAES Oficial 2024',
          descripcion: 'Prueba oficial rendida a fines del 2023.'
        },
        {
          id: 'm1-invierno',
          nombre: 'PAES Invierno 2024',
          descripcion: 'Prueba de invierno rendida a mediados del 2024.'
        },
        {
          id: 'm1-invierno-2025',
          nombre: 'PAES Invierno 2025',
          descripcion: 'Prueba de invierno para el proceso de admisión 2025.'
        },
        {
          id: 'm1-2026',
          nombre: 'PAES Oficial 2026',
          descripcion: 'Prueba oficial rendida a fines del 2025.'
        },
        {
          id: 'm1-invierno-2026',
          nombre: 'PAES Invierno 2026',
          descripcion: 'Prueba de invierno rendida a mediados del 2026.'
        }
      ]
    },
    {
      id: 'm2',
      nombre: 'M2',
      icono: '📊',
      descripcion: 'Matemática 2',
      tiempo: 140,
      preguntas: 55,
      subpruebas: [
        {
          id: 'm2-2024',
          nombre: 'PAES Oficial 2024',
          descripcion: 'Prueba oficial de Matemática 2 rendida a fines del 2023.'
        },
        {
          id: 'm2-invierno-2024',
          nombre: 'PAES Invierno 2024',
          descripcion: 'Prueba de invierno de Matemática 2 rendida a mediados del 2024.'
        },
        {
          id: 'm2-invierno-2025',
          nombre: 'PAES Invierno 2025',
          descripcion: 'Prueba de invierno de Matemática 2 para el proceso de admisión 2025.'
        },
        {
          id: 'm2-invierno-2026',
          nombre: 'PAES Invierno 2026',
          descripcion: 'Prueba de invierno de Matemática 2 para el proceso de admisión 2026.'
        },
        {
          id: 'm2-2025',
          nombre: 'PAES Oficial 2025',
          descripcion: 'Prueba oficial de Matemática 2 rendida a fines del 2024.'
        },
        {
          id: 'm2-2026',
          nombre: 'PAES Oficial 2026',
          descripcion: 'Prueba oficial de Matemática 2 rendida a fines del 2025.'
        }
      ]
    },
    {
      id: 'competencia-lectora',
      nombre: 'Competencia Lectora',
      icono: '📖',
      descripcion: 'Comprensión y análisis de textos',
      tiempo: 150,
      preguntas: 65
    },
    {
      id: 'ciencias',
      nombre: 'Ciencias',
      icono: '🧬',
      descripcion: 'Biología, Química y Física',
      tiempo: 160,
      preguntas: 80,
      subpruebas: [
        {
          id: 'biologia',
          nombre: 'Biología',
          descripcion: 'Ecosistemas, genética y evolución',
          ensayos: [
            {
              id: 'b-2024',
              nombre: 'PAES Oficial 2024',
              descripcion: 'Prueba oficial de Biología rendida a fines del 2023.'
            },
            {
              id: 'b-invierno-2024',
              nombre: 'PAES Invierno 2024',
              descripcion: 'Prueba de invierno de Biología rendida a mediados del 2024.'
            },
            {
              id: 'b-2025',
              nombre: 'PAES Oficial 2025',
              descripcion: 'Prueba oficial de Biología rendida a fines del 2024.'
            },
            {
              id: 'b-invierno-2025',
              nombre: 'PAES Invierno 2025',
              descripcion: 'Prueba de invierno de Biología para el proceso de admisión 2025.'
            },
            {
              id: 'b-2026',
              nombre: 'PAES Oficial 2026',
              descripcion: 'Prueba oficial de Biología rendida a fines del 2025.'
            },
            {
              id: 'b-invierno-2026',
              nombre: 'PAES Invierno 2026',
              descripcion: 'Prueba de invierno de Biología para el proceso de admisión 2026.'
            }
          ]
        },
        {
          id: 'quimica',
          nombre: 'Química',
          descripcion: 'Materia, reacciones y estequiometría',
          ensayos: [
            {
              id: 'ciencias-quimica',
              nombre: 'PAES Oficial 2024',
              descripcion: 'Próximamente disponible...'
            }
          ]
        },
        {
          id: 'fisica',
          nombre: 'Física',
          descripcion: 'Movimiento, energía y fuerzas',
          ensayos: [
            {
              id: 'f-2024',
              nombre: 'PAES Oficial 2024',
              descripcion: 'Prueba oficial de Física rendida a fines del 2023.'
            },
            {
              id: 'f-invierno-2024',
              nombre: 'PAES Invierno 2024',
              descripcion: 'Prueba de invierno de Física rendida a mediados del 2024.'
            },
            {
              id: 'f-invierno-2025',
              nombre: 'PAES Invierno 2025',
              descripcion: 'Prueba de invierno de Física rendida a mediados del 2025.'
            },
            {
              id: 'f-2025',
              nombre: 'PAES Oficial 2025',
              descripcion: 'Prueba oficial de Física rendida a fines del 2024.'
            },
            {
              id: 'f-2026',
              nombre: 'PAES Oficial 2026',
              descripcion: 'Prueba oficial de Física rendida a fines del 2025.'
            },
            {
              id: 'f-invierno-2026',
              nombre: 'PAES Invierno 2026',
              descripcion: 'Prueba de invierno de Física rendida a mediados del 2026.'
            }
          ]
        },
        {
          id: 'ciencias-tp',
          nombre: 'Ciencias Técnico-Profesional',
          descripcion: 'Aplicaciones científicas en contextos técnicos'
        }
      ]
    },
    {
      id: 'historia',
      nombre: 'Historia y Ciencias Sociales',
      icono: '🏛️',
      descripcion: 'Historia y Ciencias Sociales',
      tiempo: 120,
      preguntas: 65,
      subpruebas: [
        {
          id: 'h-2024',
          nombre: 'PAES Oficial 2024',
          descripcion: 'Prueba oficial de Historia rendida a fines del 2023.'
        },
        {
          id: 'h-invierno-2024',
          nombre: 'PAES Invierno 2024',
          descripcion: 'Prueba de invierno de Historia rendida a mediados del 2024.'
        },
        {
          id: 'h-invierno-2025',
          nombre: 'PAES Invierno 2025',
          descripcion: 'Prueba de invierno de Historia rendida a mediados del 2025.'
        },
        {
          id: 'h-invierno-2026',
          nombre: 'PAES Invierno 2026',
          descripcion: 'Prueba de invierno de Historia rendida a mediados del 2026.'
        },
        {
          id: 'h-2025',
          nombre: 'PAES Oficial 2025',
          descripcion: 'Prueba oficial de Historia rendida a fines del 2024.'
        },
        {
          id: 'h-2026',
          nombre: 'PAES Oficial 2026',
          descripcion: 'Prueba oficial de Historia rendida a fines del 2025.'
        }
      ]
    }
  ];

  pruebaSeleccionada: Prueba | null = null;
  subPruebaSeleccionada: SubPrueba | null = null;
  ensayoSeleccionado: EnsayoOption | null = null;

  private router = inject(Router);
  private authService = inject(AuthService);
  private firestoreService = inject(FirestoreService);
  showSettingsModal = false;
  showProfileModal = false;
  userProfile: any = null;

  get profileInitial(): string {
    return this.userProfile?.displayName?.charAt(0)?.toUpperCase() || 'U';
  }
  
  get isProPlan(): boolean {
    const plan = this.userProfile?.plan || this.userProfile?.subscription?.tier;
    return plan === 'premium' || plan === 'pro';
  }

  onProfileModalClose() {
    this.showProfileModal = false;
    this.loadUserProfile();
  }

  private loadUserProfile() {
    this.firestoreService.getUserProfile().subscribe({
      next: (profile) => {
        if (profile) {
          this.userProfile = profile;
        }
      }
    });
  }

  ngOnInit() {
    // Pre-cargar datos desde Auth para evitar parpadeo
    const currentUser = this.authService.currentUser;
    if (currentUser) {
      this.userProfile = {
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL
      };
    }

    this.loadUserProfile();
  }

  seleccionarPrueba(prueba: Prueba) {
    this.pruebaSeleccionada = prueba;
    this.subPruebaSeleccionada = prueba.subpruebas?.[0] ?? null;
    this.ensayoSeleccionado = this.subPruebaSeleccionada?.ensayos?.[0] ?? null;
  }

  seleccionarSubprueba(subprueba: SubPrueba) {
    this.subPruebaSeleccionada = subprueba;
    this.ensayoSeleccionado = subprueba.ensayos?.[0] ?? null;
  }

  seleccionarEnsayo(ensayo: EnsayoOption) {
    this.ensayoSeleccionado = ensayo;
  }

  cerrarSeleccion() {
    this.pruebaSeleccionada = null;
    this.subPruebaSeleccionada = null;
    this.ensayoSeleccionado = null;
  }

  iniciarPrueba(mode: ExamMode) {
    if (this.pruebaSeleccionada) {
      // Aquí se navegará al componente de ejecución de la prueba
      const ensayoId = this.ensayoSeleccionado?.id ?? this.subPruebaSeleccionada?.id ?? this.pruebaSeleccionada.id;
      this.router.navigate(['/ensayo', ensayoId, 'run'], {
        queryParams: {
          mode,
          duration: this.pruebaSeleccionada.tiempo,
          questions: this.pruebaSeleccionada.preguntas
        }
      });
    }
  }

  getNombreSeleccionado(): string {
    if (!this.pruebaSeleccionada) {
      return '';
    }
    if (this.subPruebaSeleccionada) {
      if (this.ensayoSeleccionado) {
        return `${this.pruebaSeleccionada.nombre} - ${this.subPruebaSeleccionada.nombre} (${this.ensayoSeleccionado.nombre})`;
      }
      return `${this.pruebaSeleccionada.nombre} - ${this.subPruebaSeleccionada.nombre}`;
    }
    return this.pruebaSeleccionada.nombre;
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
