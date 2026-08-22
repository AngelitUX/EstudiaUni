import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminSidebarComponent } from './admin-sidebar.component';

interface MateriaOption {
  id: string;
  label: string;
  routePath: string;
}

@Component({
  selector: 'app-admin-infinite-mode',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebarComponent],
  template: `
    <div class="admin-layout">
      <app-admin-sidebar></app-admin-sidebar>

      <main class="admin-main-content animate-fade-in-down">
        <header class="content-header">
          <div class="header-left">
            <h1>Modo Infinito</h1>
            <p class="subtitle">Acceso de vista previa al Modo Infinito (Polígono de Maestría). Reservado para el equipo — todavía no está disponible para los estudiantes.</p>
          </div>
        </header>

        <div class="infinite-card glass-card-simple">
          <div class="infinite-card-icon">🌟</div>
          <div class="infinite-card-body">
            <h3>Elige una materia</h3>
            <p>Se abrirá la Ruta de Aprendizaje de esa materia directamente en Modo Infinito, sin necesidad de haberla completado.</p>
            <div class="infinite-card-controls">
              <select class="materia-select" [(ngModel)]="selectedMateriaId" name="materiaId">
                <option *ngFor="let m of materias" [value]="m.id">{{ m.label }}</option>
              </select>
              <button class="btn-enter-infinite" (click)="goToInfiniteMode()">
                ⚡ Modo Infinito
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: #fafafa; color: var(--text-primary); }
    .admin-layout { display: flex; min-height: 100vh; }
    .admin-main-content { flex: 1; margin-left: 260px; padding: 2.5rem; background: #fafafa; }
    .content-header { margin-bottom: 2.5rem; }
    .content-header h1 { font-family: var(--font-heading); font-size: 2.8rem; font-weight: 800; margin: 0; color: var(--text-primary); letter-spacing: -0.03em; }
    .subtitle { font-size: 1.05rem; color: var(--text-secondary); margin: 0.5rem 0 0; font-weight: 500; max-width: 640px; line-height: 1.5; }

    .glass-card-simple { background: #ffffff; border: 2px solid var(--glass-border); border-radius: 20px; box-shadow: var(--shadow-sm); }

    .infinite-card { display: flex; align-items: flex-start; gap: 1.5rem; padding: 2rem; max-width: 640px; }
    .infinite-card-icon { font-size: 3rem; line-height: 1; flex-shrink: 0; }
    .infinite-card-body h3 { margin: 0 0 0.4rem; font-size: 1.3rem; font-weight: 800; color: var(--text-primary); }
    .infinite-card-body p { margin: 0 0 1.25rem; font-size: 0.95rem; color: var(--text-secondary); line-height: 1.5; }

    .infinite-card-controls { display: flex; gap: 0.85rem; flex-wrap: wrap; align-items: center; }
    .materia-select {
      flex: 1 1 220px;
      padding: 0.75rem 1rem;
      border-radius: 12px;
      border: 2px solid var(--glass-border);
      background: #ffffff;
      color: var(--text-primary);
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
    }
    .materia-select:focus { border-color: var(--accent-primary); outline: none; }

    .btn-enter-infinite {
      padding: 0.8rem 1.5rem;
      border-radius: 12px;
      border: none;
      background: linear-gradient(135deg, #ffc800, #ff9600);
      color: #1e293b;
      font-weight: 800;
      font-size: 0.95rem;
      cursor: pointer;
      box-shadow: 0 4px 0 #cc7a00;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .btn-enter-infinite:hover { transform: translateY(2px); box-shadow: 0 2px 0 #cc7a00; }

    @media (max-width: 1024px) {
      .admin-layout { flex-direction: column; }
      .admin-main-content { margin-left: 0; padding: 1.5rem; }
    }
    @media (max-width: 600px) {
      .content-header h1 { font-size: 2rem; }
      .infinite-card { flex-direction: column; padding: 1.5rem; }
      .infinite-card-controls { flex-direction: column; align-items: stretch; }
    }
  `]
})
export class AdminInfiniteModeComponent {
  private router = inject(Router);

  materias: MateriaOption[] = [
    { id: 'comp-lectora', label: 'Competencia Lectora', routePath: 'ruta/comp-lectora' },
    { id: 'mat1', label: 'Matemática 1 (M1)', routePath: 'ruta/mat1' },
    { id: 'mat2', label: 'Matemática 2 (M2)', routePath: 'ruta/mat2' },
    { id: 'historia', label: 'Historia', routePath: 'ruta/historia' },
    { id: 'ciencias-biologia', label: 'Ciencias · Biología', routePath: 'ruta/ciencias-biologia' },
    { id: 'ciencias-fisica', label: 'Ciencias · Física', routePath: 'ruta/ciencias-fisica' },
    { id: 'ciencias-quimica', label: 'Ciencias · Química', routePath: 'ruta/ciencias-quimica' },
  ];

  selectedMateriaId = this.materias[0].id;

  goToInfiniteMode() {
    const materia = this.materias.find(m => m.id === this.selectedMateriaId);
    if (!materia) return;
    this.router.navigate(['/' + materia.routePath], { queryParams: { mode: 'infinite' } });
  }
}
