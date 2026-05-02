import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface Prueba {
  id: string;
  nombre: string;
  icono: string;
  descripcion: string;
  tiempo: number; // en minutos
  preguntas: number;
  subpruebas?: SubPrueba[];
}

interface SubPrueba {
  id: string;
  nombre: string;
  descripcion: string;
}

type ExamMode = 'real' | 'asistido';

@Component({
  selector: 'app-ensayos-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
          <a class="nav-item" routerLink="/modules">
            <span class="nav-icon">🎯</span>
            <span class="nav-text">Práctica por Tema</span>
          </a>
          <a class="nav-item active" routerLink="/ensayos">
            <span class="nav-icon">📚</span>
            <span class="nav-text">Ensayo PAES</span>
          </a>
          <a class="nav-item" routerLink="/settings">
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
          <div class="header-back">
            <button class="btn-back" routerLink="/dashboard">← Volver</button>
          </div>
          <div class="header-content">
            <h1 class="title">Ensayos PAES</h1>
            <p class="subtitle">Realiza ensayos completos y simulacros bajo condiciones reales</p>
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
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: #000000;
      color: #f8fafc;
      --text-secondary: #c4b5fd;
    }
    .ensayos-container { display: flex; min-height: 100vh; }
    .text-gradient { background: var(--gradient-brand); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    
    /* SIDEBAR */
    .sidebar { 
      width: 260px; 
      background: rgba(13, 15, 23, 0.95); 
      border-right: 1px solid var(--glass-border); 
      display: flex; 
      flex-direction: column; 
      position: fixed; 
      top: 0; 
      left: 0; 
      height: 100vh; 
      z-index: 100; 
    }
    .sidebar-header { 
      padding: 1.5rem; 
      border-bottom: 1px solid var(--glass-border); 
    }
    .sidebar-logo { 
      font-family: var(--font-heading); 
      font-size: 1.25rem; 
      font-weight: 800; 
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
      gap: 0.75rem; 
      padding: 0.85rem 1rem; 
      border-radius: 10px; 
      color: var(--text-secondary); 
      text-decoration: none; 
      transition: all 0.2s; 
      cursor: pointer; 
    }
    .nav-item:hover { 
      background: rgba(255, 255, 255, 0.05); 
      color: #fff; 
    }
    .nav-item.active { 
      background: rgba(99, 102, 241, 0.15); 
      color: var(--accent-primary); 
      font-weight: 600; 
    }
    .nav-icon { 
      font-size: 1.2rem; 
      width: 24px; 
      text-align: center; 
    }
    .sidebar-footer {
      padding: 1rem 0.75rem;
      border-top: 1px solid var(--glass-border);
    }
    .logout-btn {
      color: #ef4444;
    }
    .logout-btn:hover {
      background: rgba(239, 68, 68, 0.1);
      color: #ff6b6b;
    }

    /* MAIN CONTENT */
    .main-content { 
      flex: 1; 
      margin-left: 260px; 
      padding: 2rem; 
    }

    /* HEADER */
    .header {
      margin-bottom: 3rem;
    }
    .header-back {
      margin-bottom: 1rem;
    }
    .btn-back {
      background: none;
      border: none;
      color: var(--accent-primary);
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.2s;
      font-weight: 600;
    }
    .btn-back:hover {
      color: #fff;
      transform: translateX(-4px);
    }
    .title {
      font-family: var(--font-heading);
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
    }
    .subtitle {
      color: var(--text-secondary);
      font-size: 1.1rem;
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
      background: rgba(255, 255, 255, 0.03);
      border: 2px solid var(--glass-border);
      border-radius: 16px;
      padding: 2rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      position: relative;
      overflow: hidden;
      color: inherit;
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
      border-color: var(--accent-primary);
      box-shadow: 0 12px 40px rgba(99, 102, 241, 0.2);
      transform: translateY(-4px);
    }
    .prueba-card:hover::before {
      opacity: 1;
    }
    .prueba-card-selected {
      border-color: var(--accent-primary);
      background: rgba(99, 102, 241, 0.1);
      box-shadow: 0 12px 40px rgba(99, 102, 241, 0.25);
    }

    .card-icon {
      font-size: 3rem;
      line-height: 1;
    }
    .card-header {
      flex: 1;
    }
    .card-title {
      font-size: 1.3rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: #fff;
    }
    .card-desc {
      font-size: 0.9rem;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .card-meta {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .meta-badge {
      background: rgba(255, 255, 255, 0.05);
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.85rem;
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      gap: 0.4rem;
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
      background: rgba(13, 15, 23, 0.98);
      border: 2px solid var(--glass-border);
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
      background: rgba(255, 255, 255, 0.1);
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
      background: rgba(255, 255, 255, 0.2);
      color: #fff;
    }
    .modal-icon {
      font-size: 3.5rem;
      text-align: center;
    }
    .modal-title {
      font-size: 1.7rem;
      font-weight: 800;
      text-align: center;
    }
    .modal-message {
      background: rgba(99, 102, 241, 0.1);
      border-left: 4px solid var(--accent-primary);
      padding: 1rem 1.25rem;
      border-radius: 10px;
    }
    .message-text {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #fff;
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
      color: #fff;
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
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--glass-border);
      color: inherit;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .subprueba-card:hover {
      border-color: var(--accent-primary);
      background: rgba(99, 102, 241, 0.12);
    }
    .subprueba-card-selected {
      border-color: var(--accent-primary);
      box-shadow: 0 8px 24px rgba(99, 102, 241, 0.2);
      background: rgba(99, 102, 241, 0.18);
    }
    .subprueba-name {
      font-weight: 700;
      color: #fff;
    }
    .subprueba-desc {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }
    .prueba-detalles {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--glass-border);
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
      background: var(--gradient-brand);
      color: #fff;
    }
    .btn-primary:hover {
      opacity: 0.9;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
    }
    .btn-outline {
      background: transparent;
      border: 2px solid var(--glass-border);
      color: var(--text-secondary);
    }
    .btn-outline:hover {
      border-color: var(--accent-primary);
      color: #fff;
      background: rgba(99, 102, 241, 0.1);
    }
    .glass-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--glass-border);
      backdrop-filter: blur(10px);
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
  private router = inject(Router);
  private authService = inject(AuthService);

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
        }
      ]
    },
    {
      id: 'm2',
      nombre: 'M2',
      icono: '📊',
      descripcion: 'Matemática 2',
      tiempo: 140,
      preguntas: 55
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
          id: 'ciencias-biologia',
          nombre: 'Biología',
          descripcion: 'Ecosistemas, genética y evolución'
        },
        {
          id: 'ciencias-quimica',
          nombre: 'Química',
          descripcion: 'Materia, reacciones y estequiometría'
        },
        {
          id: 'ciencias-fisica',
          nombre: 'Física',
          descripcion: 'Movimiento, energía y fuerzas'
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
      preguntas: 65
    }
  ];

  pruebaSeleccionada: Prueba | null = null;
  subPruebaSeleccionada: SubPrueba | null = null;

  ngOnInit() {
    // Cargar datos iniciales si es necesario
  }

  seleccionarPrueba(prueba: Prueba) {
    this.pruebaSeleccionada = prueba;
    this.subPruebaSeleccionada = prueba.subpruebas?.[0] ?? null;
  }

  seleccionarSubprueba(subprueba: SubPrueba) {
    this.subPruebaSeleccionada = subprueba;
  }

  cerrarSeleccion() {
    this.pruebaSeleccionada = null;
    this.subPruebaSeleccionada = null;
  }

  iniciarPrueba(mode: ExamMode) {
    if (this.pruebaSeleccionada) {
      // Aquí se navegará al componente de ejecución de la prueba
      const ensayoId = this.subPruebaSeleccionada?.id ?? this.pruebaSeleccionada.id;
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
