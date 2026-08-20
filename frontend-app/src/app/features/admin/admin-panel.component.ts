import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AdminService } from './services/admin.service';
import { AdminSidebarComponent } from './admin-sidebar.component';
import { PoolPregunta, MateriaId } from '../learning-path/models/paes.models';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, RouterLink, AdminSidebarComponent],
  template: `
    <div class="admin-layout">
      <app-admin-sidebar>
        <div class="sidebar-divider"></div>

        <!-- FILTROS POR MATERIA -->
        <div class="filter-section">
          <h3 class="filter-title">Filtrar por Materia</h3>
          <button class="filter-chip"
            [class.active]="adminSvc.filterMateria() === 'all'"
            (click)="adminSvc.setFilter('all')">
            <span class="chip-icon">📚</span> Todas
          </button>
          @for (mat of adminSvc.materiasDisponibles; track mat.id) {
            <button class="filter-chip"
              [class.active]="adminSvc.filterMateria() === mat.id"
              (click)="adminSvc.setFilter(mat.id)">
              <span class="chip-icon">{{ mat.icon }}</span> {{ mat.label }}
            </button>
          }
        </div>
      </app-admin-sidebar>

      <!-- MAIN CONTENT -->
      <main class="admin-main-content animate-fade-in-down">
        <!-- HEADER -->
        <header class="content-header">
          <div class="header-left">
            <h1>Pool de Preguntas</h1>
            <p class="subtitle">Gestiona el banco de preguntas PAES para todas las materias</p>
          </div>
          <div class="header-actions">
            <button class="btn-refresh" (click)="refresh()" [disabled]="adminSvc.loading()">
              {{ adminSvc.loading() ? '⏳' : '🔄' }} Actualizar
            </button>
            <button class="btn-refresh" (click)="importModalOpen.set(true)" style="background: rgba(133,92,214,0.08); border-color: rgba(133,92,214,0.3); color: var(--accent-primary);">
              📥 Importar JSON
            </button>
            <a routerLink="/admin/pregunta/nueva" class="btn-create">
              ➕ Nueva Pregunta
            </a>
          </div>
        </header>

        <!-- STATS BAR -->
        <div class="stats-bar">
          @for (mat of adminSvc.materiasDisponibles; track mat.id) {
            <div class="stat-card" [class.active]="adminSvc.filterMateria() === mat.id" (click)="adminSvc.setFilter(mat.id)">
              <span class="stat-icon">{{ mat.icon }}</span>
              <span class="stat-count">{{ countByMateria(mat.id) }}</span>
              <span class="stat-label">{{ mat.label }}</span>
            </div>
          }
        </div>

        <!-- LOADING -->
        @if (adminSvc.loading()) {
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Cargando preguntas...</p>
          </div>
        }

        <!-- EMPTY STATE -->
        @if (!adminSvc.loading() && adminSvc.preguntas().length === 0) {
          <div class="empty-state glass-card">
            <div class="empty-icon">📭</div>
            <h3>No hay preguntas aún</h3>
            <p>Comienza creando tu primera pregunta para el banco PAES</p>
            <a routerLink="/admin/pregunta/nueva" class="btn-create" style="margin-top: 1rem;">
              ➕ Crear primera pregunta
            </a>
          </div>
        }

        <!-- QUESTION LIST -->
        @if (!adminSvc.loading() && adminSvc.preguntas().length > 0) {
          <div class="question-list">
            @for (pregunta of adminSvc.preguntas(); track pregunta.id) {
              <div class="question-card glass-card-simple" [class.image-type]="pregunta.tipo_alternativas === 'imagen'">
                <div class="card-header">
                  <div class="card-badges">
                    <span class="badge-materia">{{ adminSvc.getMateriaIcon(pregunta.materiaId) }} {{ adminSvc.getMateriaLabel(pregunta.materiaId) }}</span>
                    <span class="badge-tema">{{ pregunta.tema }}</span>
                    @if (pregunta.tipo_alternativas === 'imagen') {
                      <span class="badge-type badge-img">🖼️ Imagen</span>
                    }
                    @if (pregunta.formula_latex) {
                      <span class="badge-type badge-latex">∑ LaTeX</span>
                    }
                  </div>
                  <div class="card-actions">
                    <button class="btn-icon" title="Editar" (click)="editPregunta(pregunta)">✏️</button>
                    <button class="btn-icon btn-danger" title="Eliminar" (click)="confirmDelete(pregunta)">🗑️</button>
                  </div>
                </div>

                <div class="card-body">
                  @if (pregunta.preambulo_texto) {
                    <p class="preambulo">💬 {{ pregunta.preambulo_texto | slice:0:120 }}{{ pregunta.preambulo_texto.length > 120 ? '...' : '' }}</p>
                  }
                  <p class="enunciado">{{ pregunta.enunciado }}</p>

                  <div class="alternativas-preview">
                    @for (key of optionKeys; track key) {
                      @if (pregunta.alternativas && pregunta.alternativas[key]) {
                        <span class="alt-chip" [class.correct]="key === pregunta.respuesta_correcta">
                          <strong>{{ key }})</strong>
                          @if (pregunta.tipo_alternativas === 'texto') {
                            {{ pregunta.alternativas[key] | slice:0:40 }}{{ pregunta.alternativas[key].length > 40 ? '...' : '' }}
                          } @else {
                            🖼️ Imagen
                          }
                        </span>
                      }
                    }
                  </div>
                </div>

                <div class="card-footer">
                  <span class="card-date">📅 {{ formatDate(pregunta.createdAt) }}</span>
                  <span class="card-answer">✅ Correcta: {{ pregunta.respuesta_correcta }}</span>
                </div>
              </div>
            }
          </div>
        }
      </main>
    </div>

    <!-- DELETE MODAL -->
    @if (deleteTarget()) {
      <div class="modal-overlay" (click)="deleteTarget.set(null)">
        <div class="modal-card glass-modal" (click)="$event.stopPropagation()">
          <div class="modal-icon">⚠️</div>
          <h3>¿Eliminar pregunta?</h3>
          <p class="modal-text">{{ deleteTarget()!.enunciado | slice:0:100 }}...</p>
          <p class="modal-warning">Esta acción no se puede deshacer.</p>
          <div class="modal-actions">
            <button class="btn-cancel" (click)="deleteTarget.set(null)">Cancelar</button>
            <button class="btn-delete" (click)="executeDelete()" [disabled]="deleting()">
              {{ deleting() ? 'Eliminando...' : '🗑️ Eliminar' }}
            </button>
          </div>
        </div>
      </div>
    }

    <!-- IMPORT JSON MODAL -->
    @if (importModalOpen()) {
      <div class="modal-overlay" (click)="closeImportModal()">
        <div class="modal-card glass-modal import-modal-card" (click)="$event.stopPropagation()">
          <div class="modal-header-import">
            <h3>📥 Importar Preguntas (JSON)</h3>
            <button class="btn-close-modal" (click)="closeImportModal()">×</button>
          </div>
          
          <p class="modal-desc">
            Pega un objeto JSON o un arreglo de objetos JSON de preguntas. Debe coincidir con el esquema estándar del pool.
          </p>

          <div class="example-box">
            <details>
              <summary>📋 Ver ejemplo de estructura JSON</summary>
              <pre class="json-example"><code>[
  {{ '{' }}
    "materiaId": "matematicas-m1",
    "tema": "Porcentajes",
    "enunciado": "¿Cuánto es el 25% de 200?",
    "tipo_alternativas": "texto",
    "alternativas": {{ '{' }}
      "A": "25",
      "B": "50",
      "C": "75",
      "D": "100"
    {{ '}' }},
    "respuesta_correcta": "B",
    "feedback_acierto": "¡Excelente!",
    "feedback_error": "Revisa los cálculos."
  {{ '}' }}
]</code></pre>
            </details>
          </div>

          <div class="form-group-import">
            <textarea 
              class="input-textarea json-textarea" 
              placeholder='[ { "materiaId": "matematicas-m1", ... } ]'
              [value]="importJsonText()"
              (input)="onJsonInput($event)"
              [disabled]="importing()"></textarea>
          </div>

          @if (importErrors().length > 0) {
            <div class="status-box error-box">
              ❌ Se encontraron {{ importErrors().length }} problema(s):
              <ul class="error-list">
                @for (err of importErrors().slice(0, 50); track err) {
                  <li>{{ err }}</li>
                }
              </ul>
              @if (importErrors().length > 50) {
                <p>...y {{ importErrors().length - 50 }} más.</p>
              }
            </div>
          }

          @if (importSuccess()) {
            <div class="status-box success-box">
              {{ importSuccess() }}
            </div>
          }

          @if (importing()) {
            <div class="progress-container">
              <div class="progress-bar-wrap">
                <div class="progress-bar-fill" [style.width.%]="(importProgress().current / importProgress().total) * 100"></div>
              </div>
              <p class="progress-text">Importando {{ importProgress().current }} de {{ importProgress().total }}...</p>
            </div>
          }

          <div class="modal-actions-import">
            <button class="btn-cancel" (click)="closeImportModal()" [disabled]="importing()">Cerrar</button>
            <button class="btn-import-execute" (click)="validateAndImport()" [disabled]="importing() || !importJsonText().trim()">
              {{ importing() ? 'Procesando...' : '📥 Iniciar Importación' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: #fafafa; color: var(--text-primary); }
    .text-gradient { background: var(--gradient-brand); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

    .admin-layout {
      display: flex;
      min-height: 100vh;
    }

    .sidebar-divider { height: 1px; background: rgba(133,92,214,0.15); margin: 0.5rem 0.75rem; }

    .filter-section { 
      flex: 1; 
      padding: 1rem 0.75rem; 
      overflow-y: auto;
    }
    .filter-title { 
      font-size: 0.75rem; 
      text-transform: uppercase; 
      letter-spacing: 0.08em; 
      color: var(--text-muted); 
      margin: 0 0 0.75rem 0.5rem; 
      font-weight: 700; 
    }

    .filter-chip {
      display: flex; 
      align-items: center; 
      gap: 0.75rem;
      width: 100%;
      padding: 0.7rem 0.85rem;
      border: 1.5px solid transparent;
      border-radius: 10px;
      background: transparent;
      color: var(--text-secondary);
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s;
      text-align: left;
      font-weight: 600;
    }
    .filter-chip:hover { 
      background: rgba(133,92,214,0.06); 
      color: var(--text-primary); 
    }
    .filter-chip.active { 
      background: rgba(133,92,214,0.15); 
      border-color: rgba(133, 92, 214, 0.3); 
      color: var(--accent-primary); 
    }
    .chip-icon {
      font-size: 1.1rem;
      width: 24px;
      display: inline-flex;
      justify-content: center;
    }

    /* MAIN CONTENT */
    .admin-main-content { 
      flex: 1; 
      margin-left: 260px; 
      padding: 2.5rem; 
      max-width: calc(100% - 260px); 
      background: #fafafa !important;
    }

    .content-header {
      display: flex; 
      justify-content: space-between; 
      align-items: flex-start;
      margin-bottom: 2.5rem;
      gap: 1.5rem;
    }
    .content-header h1 { 
      font-family: var(--font-heading);
      font-size: 2.8rem; 
      font-weight: 800; 
      margin: 0; 
      color: var(--text-primary); 
      letter-spacing: -0.03em;
    }
    .subtitle { 
      font-size: 1.15rem; 
      color: var(--text-secondary); 
      margin: 0.5rem 0 0; 
      font-weight: 500;
    }
    .header-actions { display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap; }
    
    .btn-refresh {
      padding: 0.75rem 1.25rem; 
      border-radius: 12px;
      border: 2px solid var(--glass-border);
      background: #ffffff; 
      color: var(--text-secondary);
      font-size: 0.95rem; 
      font-weight: 700; 
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .btn-refresh:hover { border-color: rgba(133,92,214,0.4); color: var(--accent-primary); box-shadow: var(--shadow-sm); }
    .btn-refresh:disabled { opacity: 0.5; cursor: not-allowed; }
    
    .btn-create {
      padding: 0.75rem 1.5rem; 
      border-radius: 12px;
      border: none; 
      text-decoration: none;
      background: var(--gradient-brand);
      color: #fff; 
      font-size: 0.95rem; 
      font-weight: 700;
      cursor: pointer; 
      transition: all 0.2s;
      box-shadow: 0 4px 12px rgba(133,92,214,0.3);
      display: inline-flex; 
      align-items: center; 
      gap: 0.5rem;
    }
    .btn-create:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(133,92,214,0.4); }

    /* STATS BAR */
    .stats-bar {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
      gap: 0.75rem; 
      margin-bottom: 2.5rem;
    }
    .stat-card {
      display: flex; 
      flex-direction: column; 
      align-items: center;
      padding: 1rem; 
      background: #ffffff;
      border: 2px solid var(--glass-border);
      border-radius: 16px; 
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: var(--shadow-sm);
    }
    .stat-card:hover { 
      border-color: rgba(133,92,214,0.35); 
      background: rgba(133,92,214,0.03); 
      transform: translateY(-4px);
      box-shadow: var(--shadow);
    }
    .stat-card.active { 
      border-color: var(--accent-primary); 
      background: rgba(133,92,214,0.06); 
      box-shadow: 0 8px 24px rgba(133,92,214,0.12);
    }
    .stat-icon { font-size: 1.5rem; }
    .stat-count { font-size: 1.75rem; font-weight: 800; color: var(--text-primary); margin-top: 0.35rem; font-family: var(--font-heading); }
    .stat-label { font-size: 0.75rem; color: var(--text-secondary); text-align: center; margin-top: 0.25rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.02em; }

    /* LOADING & SPIN */
    .loading-state {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 6rem 2rem; color: var(--text-secondary);
    }
    .spinner {
      width: 44px; height: 44px;
      border: 4px solid rgba(133,92,214,0.15);
      border-top-color: var(--accent-primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 1rem;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* EMPTY STATE */
    .empty-state {
      text-align: center; 
      padding: 5rem 2rem;
    }
    .empty-icon { font-size: 4rem; margin-bottom: 1rem; opacity: 0.8; }
    .empty-state h3 { font-size: 1.5rem; margin: 0 0 0.5rem; color: var(--text-primary); font-weight: 800; }
    .empty-state p { font-size: 1rem; color: var(--text-secondary); margin: 0 0 2rem; font-weight: 500; }

    /* QUESTION CARDS */
    .question-list { display: flex; flex-direction: column; gap: 1.25rem; }

    .glass-card-simple {
      background: #ffffff;
      border: 2px solid var(--glass-border);
      border-radius: 20px;
      padding: 1.75rem;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: var(--shadow-sm);
    }
    .glass-card-simple:hover { 
      border-color: rgba(133,92,214,0.35); 
      transform: translateY(-2px); 
      box-shadow: var(--shadow-md); 
    }
    .glass-card-simple.image-type { border-left: 5px solid #d97706; }

    .card-header {
      display: flex; 
      justify-content: space-between; 
      align-items: center;
      padding-bottom: 1rem;
      border-bottom: 1px dashed var(--glass-border);
      margin-bottom: 1.25rem;
      gap: 1rem;
    }
    .card-badges { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .badge-materia {
      font-size: 0.75rem; 
      font-weight: 700;
      background: rgba(133,92,214,0.12); 
      color: var(--accent-primary);
      padding: 0.35rem 0.8rem; 
      border-radius: 8px;
    }
    .badge-tema {
      font-size: 0.75rem; 
      font-weight: 700;
      background: rgba(28,176,246,0.12); 
      color: #0284c7;
      padding: 0.35rem 0.8rem; 
      border-radius: 8px;
    }
    .badge-type {
      font-size: 0.75rem; 
      font-weight: 700;
      padding: 0.35rem 0.8rem; 
      border-radius: 8px;
    }
    .badge-img { background: rgba(245,158,11,0.12); color: #d97706; }
    .badge-latex { background: rgba(16,185,129,0.12); color: #059669; }

    .card-actions { display: flex; gap: 0.5rem; }
    .btn-icon {
      width: 36px; height: 36px;
      border-radius: 10px; 
      border: 2px solid var(--glass-border);
      background: #ffffff; 
      cursor: pointer;
      display: flex; 
      align-items: center; 
      justify-content: center;
      font-size: 1rem; 
      transition: all 0.2s;
    }
    .btn-icon:hover { background: var(--bg-secondary); border-color: rgba(0,0,0,0.15); transform: scale(1.05); }
    .btn-icon.btn-danger:hover { background: #fee2e2; border-color: #fca5a5; color: #ef4444; }

    .card-body { margin-bottom: 1.25rem; }
    .preambulo {
      font-size: 0.9rem; 
      color: var(--text-secondary); 
      font-style: italic;
      margin: 0 0 0.75rem; 
      line-height: 1.6;
      padding-left: 1rem;
      border-left: 3px solid rgba(133,92,214,0.4);
    }
    .enunciado {
      font-size: 1.05rem; 
      font-weight: 700; 
      color: var(--text-primary);
      margin: 0 0 1.25rem; 
      line-height: 1.6;
    }

    .alternativas-preview { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .alt-chip {
      font-size: 0.85rem; 
      padding: 0.4rem 0.8rem;
      background: var(--bg-secondary);
      border: 1px solid var(--glass-border);
      border-radius: 8px; 
      color: var(--text-secondary);
      transition: all 0.2s;
      font-weight: 500;
    }
    .alt-chip.correct { 
      background: rgba(88,204,2,0.12); 
      border-color: rgba(88,204,2,0.3); 
      color: #3d8c00; 
      font-weight: 700;
    }
    .alt-chip strong { color: var(--text-primary); margin-right: 0.35rem; }

    .card-footer {
      display: flex; 
      justify-content: space-between; 
      align-items: center;
      padding-top: 1rem;
      border-top: 1px dashed var(--glass-border);
      font-size: 0.8rem; 
      color: var(--text-muted);
      font-weight: 600;
    }
    .card-answer {
      font-weight: 700;
      color: #3d8c00;
    }

    /* DELETE MODAL */
    .modal-overlay {
      position: fixed; inset: 0;
      background: rgba(15, 23, 42, 0.4);
      backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.25s ease-out;
    }
    .glass-modal {
      background: #ffffff;
      border: 2px solid var(--glass-border);
      border-radius: 24px;
      padding: 2.5rem;
      max-width: 440px;
      width: 90%;
      text-align: center;
      box-shadow: var(--shadow-lg);
      animation: slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .modal-icon { font-size: 3.5rem; margin-bottom: 1rem; }
    .glass-modal h3 { font-size: 1.4rem; margin: 0 0 0.75rem; color: var(--text-primary); font-weight: 800; }
    .modal-text { font-size: 0.95rem; color: var(--text-secondary); margin: 0 0 0.75rem; line-height: 1.6; font-style: italic; }
    .modal-warning { font-size: 0.85rem; color: #ef4444; margin: 0 0 2rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    .modal-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
    
    .btn-cancel {
      padding: 0.75rem 1.25rem; 
      border-radius: 12px;
      border: 2px solid var(--glass-border);
      background: transparent; 
      color: var(--text-secondary);
      font-weight: 700; 
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.95rem;
    }
    .btn-cancel:hover { background: var(--bg-secondary); color: var(--text-primary); }
    
    .btn-delete {
      padding: 0.75rem 1.25rem; 
      border-radius: 12px;
      border: none;
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: #fff; 
      font-weight: 700; 
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.95rem;
      box-shadow: 0 4px 12px rgba(239,68,68,0.25);
    }
    .btn-delete:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(239,68,68,0.35); }
    .btn-delete:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    /* RESPONSIVE */
    @media (max-width: 1024px) {
      .admin-layout { flex-direction: column; }
      .sidebar-divider, .filter-section { display: none; }
      .admin-main-content { margin-left: 0; padding: 1.5rem; max-width: 100%; }
      .content-header { flex-direction: column; gap: 1.25rem; }
      .stats-bar { grid-template-columns: repeat(4, 1fr); }
    }
    @media (max-width: 600px) {
      .stats-bar { grid-template-columns: repeat(2, 1fr); }
      .content-header h1 { font-size: 2.2rem; }
    }
    @media (max-width: 480px) {
      .admin-main-content { padding: 1rem; }
      .content-header h1 { font-size: 1.7rem; }
      .subtitle { font-size: 1rem; }
      .header-actions { width: 100%; }
      .header-actions .btn-refresh,
      .header-actions .btn-create { flex: 1 1 auto; justify-content: center; font-size: 0.85rem; padding: 0.65rem 0.9rem; }
      .card-header { flex-direction: column; align-items: flex-start; }
      .card-actions { align-self: flex-end; }
      .modal-actions { grid-template-columns: 1fr; }
      .glass-modal { padding: 1.5rem; }
    }
    @media (max-width: 380px) {
      .stats-bar { grid-template-columns: 1fr 1fr; }
      .glass-card-simple { padding: 1.1rem; }
    }

    /* IMPORT MODAL SPECIFICS */
    .import-modal-card {
      max-width: 600px !important;
      width: 95% !important;
      text-align: left !important;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .modal-header-import {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid var(--glass-border);
      padding-bottom: 0.75rem;
    }
    .modal-header-import h3 {
      margin: 0 !important;
      font-size: 1.25rem !important;
      font-weight: 800;
      color: var(--text-primary);
    }
    .btn-close-modal {
      background: transparent;
      border: none;
      font-size: 1.8rem;
      cursor: pointer;
      color: var(--text-muted);
      line-height: 1;
      padding: 0;
      transition: color 0.2s;
    }
    .btn-close-modal:hover {
      color: #ef4444;
    }
    .modal-desc {
      font-size: 0.9rem;
      color: var(--text-secondary);
      margin: 0;
      line-height: 1.5;
    }
    .example-box details {
      background: var(--bg-secondary);
      border: 1.5px solid var(--glass-border);
      border-radius: 12px;
      padding: 0.75rem;
    }
    .example-box summary {
      font-size: 0.85rem;
      font-weight: 700;
      cursor: pointer;
      color: var(--accent-primary);
      outline: none;
      user-select: none;
    }
    .json-example {
      margin: 0.75rem 0 0;
      background: #0d0f17;
      color: #34d399;
      padding: 0.85rem;
      border-radius: 8px;
      font-size: 0.8rem;
      overflow-x: auto;
      max-height: 180px;
    }
    .form-group-import {
      margin: 0;
    }
    .json-textarea {
      min-height: 160px;
      font-family: 'Courier New', monospace;
      font-size: 0.88rem;
      font-weight: 600;
      color: #0f172a;
      background: #f8fafc;
      border: 2px solid var(--glass-border) !important;
    }
    .status-box {
      padding: 0.85rem;
      border-radius: 10px;
      font-size: 0.88rem;
      font-weight: 600;
      line-height: 1.5;
    }
    .error-box {
      background: #fef2f2;
      color: #b91c1c;
      border: 1px solid #fca5a5;
      max-height: 260px;
      overflow-y: auto;
    }
    .error-list {
      margin: 0.5rem 0 0;
      padding-left: 1.25rem;
      font-weight: 500;
    }
    .error-list li { margin-bottom: 0.3rem; }
    .success-box {
      background: #f0fdf4;
      color: #15803d;
      border: 1px solid #86efac;
    }
    .progress-container {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .progress-bar-wrap {
      width: 100%;
      height: 8px;
      background: var(--bg-secondary);
      border-radius: 99px;
      overflow: hidden;
      border: 1.5px solid var(--glass-border);
    }
    .progress-bar-fill {
      height: 100%;
      background: var(--gradient-brand);
      border-radius: 99px;
      transition: width 0.3s ease;
    }
    .progress-text {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text-secondary);
      margin: 0;
    }
    .modal-actions-import {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 0.5rem;
      border-top: 2px solid var(--glass-border);
      padding-top: 1rem;
    }
    .btn-import-execute {
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      border: none;
      background: var(--gradient-brand);
      color: #fff;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 12px rgba(133,92,214,0.3);
    }
    .btn-import-execute:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(133,92,214,0.4);
    }
    .btn-import-execute:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }
  `]
})
export class AdminPanelComponent implements OnInit {
  adminSvc = inject(AdminService);
  private router = inject(Router);

  optionKeys: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
  deleteTarget = signal<PoolPregunta | null>(null);
  deleting = signal(false);

  // ─── Bulk JSON Importer State ───
  importModalOpen = signal(false);
  importJsonText = signal('');
  importing = signal(false);
  importProgress = signal({ current: 0, total: 0 });
  importErrors = signal<string[]>([]);
  importSuccess = signal<string | null>(null);

  private readonly validMateriaIds: MateriaId[] = [
    'competencia-lectora',
    'matematicas-m1',
    'matematicas-m2',
    'ciencias-biologia',
    'ciencias-fisica',
    'ciencias-quimica',
    'ciencias-tp',
    'historia'
  ];

  closeImportModal() {
    if (this.importing()) return;
    this.importModalOpen.set(false);
    this.importJsonText.set('');
    this.importErrors.set([]);
    this.importSuccess.set(null);
  }

  onJsonInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.importJsonText.set(target.value);
  }

  validateAndImport() {
    this.importErrors.set([]);
    this.importSuccess.set(null);

    const text = this.importJsonText().trim();
    if (!text) {
      this.importErrors.set(['Por favor, ingresa un JSON.']);
      return;
    }

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch (e: any) {
      this.importErrors.set([`JSON inválido: ${e.message}`]);
      return;
    }

    const list = Array.isArray(parsed) ? parsed : [parsed];
    if (list.length === 0) {
      this.importErrors.set(['El JSON está vacío o no contiene preguntas.']);
      return;
    }

    // Validamos TODAS las preguntas y acumulamos todos los errores en vez de
    // detenernos en la primera, para que una importación de cientos de
    // preguntas se pueda corregir de una sola pasada.
    const errors: string[] = [];
    const validatedQuestions: Omit<PoolPregunta, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>[] = [];

    for (let i = 0; i < list.length; i++) {
      const q = list[i];
      const prefix = `Pregunta [Índice ${i}]`;

      if (!q.materiaId || !this.validMateriaIds.includes(q.materiaId)) {
        errors.push(`${prefix}: "materiaId" es requerido y debe ser uno de: ${this.validMateriaIds.join(', ')}`);
        continue;
      }

      const temasValidos = this.adminSvc.getTemasForMateria(q.materiaId);
      if (!q.tema || typeof q.tema !== 'string' || !temasValidos.includes(q.tema)) {
        errors.push(`${prefix}: "tema" debe ser exactamente uno de los temas válidos para ${q.materiaId}: ${temasValidos.join(', ')}`);
        continue;
      }
      if (!q.enunciado || typeof q.enunciado !== 'string') {
        errors.push(`${prefix}: "enunciado" es requerido y debe ser una cadena de texto.`);
        continue;
      }
      if (!q.alternativas || typeof q.alternativas !== 'object') {
        errors.push(`${prefix}: "alternativas" debe ser un objeto con las llaves A, B, C, D.`);
        continue;
      }
      const alts = q.alternativas;
      if (!alts.A || !alts.B || !alts.C || !alts.D) {
        errors.push(`${prefix}: "alternativas" debe contener opciones para A, B, C y D.`);
        continue;
      }
      if (!q.respuesta_correcta || !['A', 'B', 'C', 'D'].includes(q.respuesta_correcta)) {
        errors.push(`${prefix}: "respuesta_correcta" es requerida y debe ser A, B, C o D.`);
        continue;
      }
      if (!q.feedback_acierto || typeof q.feedback_acierto !== 'string' || !q.feedback_acierto.trim()) {
        errors.push(`${prefix}: "feedback_acierto" es requerido (explica por qué la respuesta es correcta).`);
        continue;
      }
      if (!q.feedback_error || typeof q.feedback_error !== 'string' || !q.feedback_error.trim()) {
        errors.push(`${prefix}: "feedback_error" es requerido (da una pista o corrección para quien se equivoca).`);
        continue;
      }

      validatedQuestions.push({
        materiaId: q.materiaId,
        tema: q.tema,
        preambulo_texto: q.preambulo_texto || null,
        preambulo_imagen_url: q.preambulo_imagen_url || null,
        enunciado: q.enunciado,
        formula_latex: q.formula_latex || null,
        tipo_alternativas: q.tipo_alternativas === 'imagen' ? 'imagen' : 'texto',
        alternativas: {
          A: String(alts.A),
          B: String(alts.B),
          C: String(alts.C),
          D: String(alts.D),
        },
        respuesta_correcta: q.respuesta_correcta as 'A' | 'B' | 'C' | 'D',
        feedback_acierto: q.feedback_acierto.trim(),
        feedback_error: q.feedback_error.trim(),
      });
    }

    if (errors.length > 0) {
      this.importErrors.set(errors);
      return;
    }

    this.startImporting(validatedQuestions);
  }

  async startImporting(questions: Omit<PoolPregunta, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>[]) {
    this.importing.set(true);
    this.importProgress.set({ current: 0, total: questions.length });

    try {
      const result = await this.adminSvc.createPreguntasBulk(questions, (savedCount, total) => {
        this.importProgress.set({ current: savedCount, total });
      });

      if (result.failedFromIndex !== null) {
        this.importErrors.set([
          `Se guardaron ${result.savedCount} de ${questions.length} preguntas. Falló al llegar al índice ${result.failedFromIndex}: ${result.error}. ` +
          `Las primeras ${result.savedCount} ya quedaron guardadas — vuelve a intentar solo desde el índice ${result.failedFromIndex} en adelante.`
        ]);
      } else {
        this.importSuccess.set(`🎉 ¡Éxito! Se importaron ${result.savedCount} preguntas correctamente.`);
        this.importJsonText.set('');
      }
      this.adminSvc.loadPreguntas();
    } catch (e: any) {
      this.importErrors.set([`Error al subir preguntas: ${e.message}`]);
    } finally {
      this.importing.set(false);
    }
  }

  ngOnInit() {
    this.adminSvc.loadPreguntas();
  }

  countByMateria(materiaId: MateriaId): number {
    // Count from ALL preguntas (unfiltered)
    return this.adminSvc.totalPreguntas() > 0
      ? this.adminSvc.allPreguntas().filter(p => p.materiaId === materiaId).length
      : 0;
  }

  refresh() {
    this.adminSvc.loadPreguntas();
  }

  editPregunta(pregunta: PoolPregunta) {
    this.router.navigate(['/admin/pregunta', pregunta.id]);
  }

  confirmDelete(pregunta: PoolPregunta) {
    this.deleteTarget.set(pregunta);
  }

  async executeDelete() {
    const target = this.deleteTarget();
    if (!target) return;
    this.deleting.set(true);
    try {
      await this.adminSvc.deletePregunta(target.id);
      this.deleteTarget.set(null);
    } catch (error) {
      console.error('Error deleting pregunta:', error);
      alert('Error al eliminar la pregunta. Verifica tu conexión.');
    } finally {
      this.deleting.set(false);
    }
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return 'Sin fecha';
    try {
      return new Date(dateStr).toLocaleDateString('es-CL', {
        day: '2-digit', month: 'short', year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  }
}
