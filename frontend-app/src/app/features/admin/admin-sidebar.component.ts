import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AdminService } from './services/admin.service';

/**
 * Sidebar único del panel admin. Antes cada página (pool de preguntas,
 * suscripciones, recursos, bugs) tenía su propia copia pegada del sidebar,
 * y con el tiempo se desincronizaron: a "Suscripciones" le faltaba el link
 * "Nueva Pregunta", a "Recursos" le faltaba "Suscripciones y Pagos", el
 * badge de conteo aparecía en unas páginas y en otras no, y el editor de
 * preguntas no tenía sidebar en absoluto. Ahora solo existe una copia, y el
 * ítem activo se calcula con routerLinkActive en vez de a mano por archivo.
 *
 * Las clases usan el prefijo "admin-" a propósito: styles.css define reglas
 * GLOBALES con !important para .sidebar/.sidebar-header/.sidebar-logo/
 * .nav-item/etc, pensadas para el sidebar del dashboard/ruta de aprendizaje
 * (logo de texto, sin badge). Como esas reglas no están scoped al componente,
 * si este sidebar reutiliza esos mismos nombres las reglas globales le ganan
 * a cualquier CSS que se le ponga aquí — eso fue lo que causó que el header
 * quedara con una altura fija equivocada y el badge "ADMIN PANEL" se
 * desbordara sobre el primer ítem del nav, robándole el click.
 *
 * Las páginas que necesitan contenido extra en el sidebar (ej. los filtros
 * por materia del pool de preguntas) lo proyectan vía <ng-content>.
 */
@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="admin-sidebar">
      <div class="admin-sidebar-header">
        <a routerLink="/dashboard" class="admin-sidebar-logo" style="text-decoration:none; display: flex; align-items: center; justify-content: center;">
          <img [src]="adminSvc.isAdmin() ? 'https://res.cloudinary.com/dqm3syhwr/image/upload/f_auto,q_auto/v1/imagenes/branding/LogoEstudiaUniPREMIUM' : 'https://res.cloudinary.com/dqm3syhwr/image/upload/f_auto,q_auto/v1/imagenes/branding/LogoEstudiaUni'" alt="EstudiaUni" class="admin-sidebar-logo-img" />
        </a>
        <div class="admin-panel-tag">ADMIN PANEL</div>
      </div>

      <nav class="admin-sidebar-nav">
        <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="admin-nav-item">
          <span class="admin-nav-icon">📋</span>
          <span class="admin-nav-text">Pool de Preguntas</span>
          <span class="admin-nav-count">{{ adminSvc.totalPreguntas() }}</span>
        </a>
        <a routerLink="/admin/pregunta/nueva" routerLinkActive="active" class="admin-nav-item">
          <span class="admin-nav-icon">➕</span>
          <span class="admin-nav-text">Nueva Pregunta</span>
        </a>
        <a routerLink="/admin/suscripciones" routerLinkActive="active" class="admin-nav-item">
          <span class="admin-nav-icon">💳</span>
          <span class="admin-nav-text">Suscripciones y Pagos</span>
        </a>
        <a routerLink="/admin/usuarios" routerLinkActive="active" class="admin-nav-item">
          <span class="admin-nav-icon">👥</span>
          <span class="admin-nav-text">Usuarios</span>
        </a>
        <a routerLink="/admin/recursos" routerLinkActive="active" class="admin-nav-item">
          <img src="assets/images/iconosParaElementos/P_RecursosAdicionales.png" alt="Recursos Adicionales" class="admin-nav-icon-img"/>
          <span class="admin-nav-text">Recursos</span>
        </a>
        <a routerLink="/admin/bugs" routerLinkActive="active" class="admin-nav-item">
          <span class="admin-nav-icon">🐛</span>
          <span class="admin-nav-text">Reportes de Bug</span>
        </a>
        <a routerLink="/admin/modo-infinito" routerLinkActive="active" class="admin-nav-item">
          <span class="admin-nav-icon">⚡</span>
          <span class="admin-nav-text">Modo Infinito</span>
        </a>
      </nav>

      <ng-content></ng-content>

      <div class="admin-sidebar-footer" style="padding: 1.25rem 0.75rem; margin-top: auto;">
        <a class="admin-nav-item admin-logout-btn" routerLink="/dashboard">
          <img src="assets/images/iconosParaElementos/P_Inicio.png" alt="Inicio" class="admin-nav-icon-img"/>
          <span class="admin-nav-text">Dashboard</span>
        </a>
      </div>
    </aside>
  `,
  styles: [`
    @keyframes floatLogo { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
    .admin-sidebar-logo-img { width: 180px; height: auto; object-fit: contain; filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.2)); animation: floatLogo 3.5s ease-in-out infinite; }

    .admin-sidebar {
      width: 260px;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(20px);
      border-right: 1px solid rgba(133,92,214,0.15);
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      z-index: 100;
    }
    .admin-sidebar-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      border-bottom: 1px solid rgba(255,255,255,0.15);
      padding: 1.25rem 1rem;
      box-sizing: border-box;
    }

    .admin-panel-tag {
      font-size: 0.65rem;
      background: rgba(139, 92, 246, 0.25);
      color: #c084fc;
      padding: 0.2rem 0.6rem;
      border-radius: 99px;
      font-weight: 800;
      letter-spacing: 0.08em;
      display: inline-block;
    }

    .admin-sidebar-nav {
      padding: 1rem 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .admin-nav-item {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.9rem 1.1rem;
      border-radius: 12px;
      color: var(--text-primary);
      text-decoration: none;
      transition: all 0.2s;
      cursor: pointer;
      font-size: 1.05rem;
      font-weight: 500;
    }
    .admin-nav-item:hover {
      background: rgba(133,92,214,0.08);
      color: var(--text-primary);
      transform: translateX(4px);
    }
    .admin-nav-item.active {
      background: rgba(133,92,214,0.15);
      color: var(--accent-primary);
      border-left: 3.5px solid var(--accent-primary);
      box-shadow: 0 4px 12px rgba(133,92,214,0.12);
      font-weight: 700;
    }
    .admin-nav-item.active .admin-nav-icon { filter: brightness(1.1); }
    .admin-nav-item.active .admin-nav-text { color: var(--accent-primary); }
    .admin-nav-icon {
      font-size: 1.35rem;
      width: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .admin-nav-icon-img { width: 32px; height: 32px; object-fit: contain; }
    .admin-nav-count {
      margin-left: auto;
      font-size: 0.75rem;
      background: rgba(133,92,214,0.1);
      color: var(--accent-primary);
      padding: 0.2rem 0.6rem;
      border-radius: 99px;
      font-weight: 700;
    }

    .admin-logout-btn { color: #ef4444; opacity: 0.8; }
    .admin-logout-btn:hover { background: rgba(239, 68, 68, 0.08); color: #ef4444; opacity: 1; }

    @media (max-width: 1024px) {
      .admin-sidebar {
        position: relative;
        width: 100%;
        height: auto;
        border-right: none;
        border-bottom: 1px solid rgba(255,255,255,0.15);
      }
    }
  `]
})
export class AdminSidebarComponent {
  adminSvc = inject(AdminService);
}
