import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdminService } from './services/admin.service';
import { RecursosService, Recurso } from '../recursos/recursos.service';
import { PaesContentService } from '../learning-path/services/paes-content.service';

@Component({
  selector: 'app-admin-recursos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="admin-layout">
      <!-- SIDEBAR -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <a routerLink="/dashboard" class="sidebar-logo" style="text-decoration:none;"><span class="text-gradient">EstudiaUni</span></a>
          <div class="admin-panel-tag">ADMIN PANEL</div>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/admin" class="nav-item">
            <span class="nav-icon">📋</span>
            <span class="nav-text">Pool de Preguntas</span>
            <span class="nav-count">{{ adminSvc.totalPreguntas() }}</span>
          </a>
          <a routerLink="/admin/pregunta/nueva" class="nav-item">
            <span class="nav-icon">➕</span>
            <span class="nav-text">Nueva Pregunta</span>
          </a>
          <a routerLink="/admin/recursos" class="nav-item active">
            <span class="nav-icon">📂</span>
            <span class="nav-text">Recursos</span>
          </a>
        </nav>

        <div class="sidebar-divider"></div>

        <div class="sidebar-footer" style="padding: 1.25rem 0.75rem;">
          <a class="nav-item logout-btn-sidebar" routerLink="/dashboard">
            <span class="nav-icon">🏠</span>
            <span class="nav-text">Dashboard</span>
          </a>
        </div>
      </aside>

      <!-- MAIN CONTENT -->
      <main class="main-content animate-fade-in-down">
        <header class="admin-header">
          <div class="header-content">
            <h1>Gestión de Recursos Adicionales</h1>
            <p>Añade, edita o elimina materiales de estudio para los usuarios.</p>
          </div>
          <button class="btn-primary" (click)="openModal()">
            ➕ Nuevo Recurso
          </button>
        </header>

        <!-- STATS BAR -->
        <div class="stats-bar">
          <div class="stat-card">
            <span class="stat-icon">📂</span>
            <span class="stat-count">{{ recursosService.recursos().length }}</span>
            <span class="stat-label">Total Recursos</span>
          </div>
          <div class="stat-card">
            <span class="stat-icon">📄</span>
            <span class="stat-count">{{ countByType('pdf') }}</span>
            <span class="stat-label">PDFs</span>
          </div>
          <div class="stat-card">
            <span class="stat-icon">▶️</span>
            <span class="stat-count">{{ countByType('video') }}</span>
            <span class="stat-label">Videos</span>
          </div>
          <div class="stat-card">
            <span class="stat-icon">🔗</span>
            <span class="stat-count">{{ countByType('link') + countByType('ensayo') + countByType('libro') + countByType('otro') }}</span>
            <span class="stat-label">Otros</span>
          </div>
        </div>

        <!-- LOADING -->
        <div *ngIf="recursosService.loading()" class="loading-state">
          <div class="spinner"></div>
          <p>Cargando recursos...</p>
        </div>

        <!-- FILTERS -->
        <div *ngIf="!recursosService.loading()" class="filters-bar glass-card" style="display: flex; gap: 1.5rem; padding: 1.25rem 1.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; align-items: center; background: white; border-radius: 12px; border: 1.5px solid var(--glass-border);">
          <div class="filter-group" style="display: flex; align-items: center; gap: 0.5rem;">
            <label style="font-size: 0.85rem; font-weight: 700; color: var(--text-secondary);">Filtrar por Categoría:</label>
            <select [ngModel]="selectedCategoria()" (ngModelChange)="selectedCategoria.set($event)" style="padding: 0.5rem 1rem; border: 1.5px solid var(--glass-border); border-radius: 8px; font-size: 0.88rem; font-weight: 600; outline: none; background: white; cursor: pointer; color: var(--text-primary);">
              <option value="all">Todas las materias</option>
              <option *ngFor="let mat of paesSvc.materias()" [value]="mat.title">{{ mat.title }}</option>
            </select>
          </div>

          <div class="filter-group" style="display: flex; align-items: center; gap: 0.5rem;">
            <label style="font-size: 0.85rem; font-weight: 700; color: var(--text-secondary);">Filtrar por Tipo:</label>
            <select [ngModel]="selectedTipo()" (ngModelChange)="selectedTipo.set($event)" style="padding: 0.5rem 1rem; border: 1.5px solid var(--glass-border); border-radius: 8px; font-size: 0.88rem; font-weight: 600; outline: none; background: white; cursor: pointer; color: var(--text-primary);">
              <option value="all">Todos los tipos</option>
              <option value="pdf">PDFs y Guías</option>
              <option value="video">Videos</option>
              <option value="ensayo">Ensayos</option>
              <option value="libro">Libros</option>
              <option value="link">Enlaces</option>
              <option value="otro">Otros</option>
            </select>
          </div>

          <div *ngIf="selectedCategoria() !== 'all' || selectedTipo() !== 'all'" style="margin-left: auto;">
            <button (click)="clearAdminFilters()" style="background: none; border: none; color: var(--accent-secondary); font-weight: 850; font-size: 0.85rem; cursor: pointer; text-decoration: underline;">Limpiar filtros</button>
          </div>
        </div>

        <!-- LISTA DE RECURSOS -->
        <div *ngIf="!recursosService.loading()" class="recursos-list-container glass-card">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Estado</th>
                <th>Orden</th>
                <th>Tipo</th>
                <th>Título & Categoría</th>
                <th>Enlace</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let recurso of filteredRecursos()">
                <td>
                  <span class="status-indicator" [class.active]="recurso.visible" [title]="recurso.visible ? 'Visible' : 'Oculto'">
                    {{ recurso.visible ? '🟢' : '⚫' }}
                  </span>
                </td>
                <td><span class="badge-order">{{ recurso.orden }}</span></td>
                <td>
                  <span class="badge-type" [ngClass]="recurso.tipo">
                    {{ getTypeIcon(recurso.tipo) }} {{ recurso.tipo | uppercase }}
                  </span>
                </td>
                <td>
                  <div class="r-title">{{ recurso.titulo }}</div>
                  <div class="r-cat" style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.25rem;">
                    <span style="font-size: 0.78rem; font-weight: 700; background: rgba(0,0,0,0.04); padding: 0.15rem 0.4rem; border-radius: 4px; color: var(--text-secondary);">📚 {{ recurso.categoria }}</span>
                    <span *ngIf="recurso.subcategoria" style="font-size: 0.78rem; font-weight: 700; background: rgba(133,92,214,0.08); padding: 0.15rem 0.4rem; border-radius: 4px; color: var(--accent-primary);">🏷️ {{ recurso.subcategoria }}</span>
                  </div>
                </td>
                <td>
                  <button type="button" (click)="ejecutarAccionRecurso(recurso, $event)" class="r-link" style="background: none; border: none; padding: 0; color: var(--accent-secondary); font-weight: 800; cursor: pointer; text-decoration: underline; font-size: 0.9rem;" title="Abrir recurso">🔗 Abrir</button>
                </td>
                <td>
                  <div class="action-buttons">
                    <button class="btn-icon btn-edit" (click)="openModal(recurso)" title="Editar">✏️</button>
                    <button class="btn-icon btn-delete" (click)="confirmDelete(recurso)" title="Eliminar">🗑️</button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="recursosService.recursos().length === 0">
                <td colspan="6" class="text-center" style="padding: 3rem;">
                  <span style="font-size: 2rem;">📭</span>
                  <p style="color: var(--text-secondary); margin-top: 1rem;">No hay recursos creados aún.</p>
                </td>
              </tr>
            </tbody>
             <!-- MODAL CREAR/EDITAR -->
    <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
      <div class="modal-content glass-card form-modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ isEditing ? '✏️ Editar Recurso' : '➕ Nuevo Recurso' }}</h2>
          <button class="close-btn" (click)="closeModal()">&times;</button>
        </div>
        
        <div class="modal-body">
          <form class="admin-form" (ngSubmit)="saveRecurso()">
            
            <div class="form-row">
              <div class="form-group" style="flex: 2;">
                <label>Título del Recurso *</label>
                <input type="text" [(ngModel)]="currentRecurso.titulo" name="titulo" required placeholder="Ej: Guía de Funciones Cuadráticas">
              </div>
              <div class="form-group" style="flex: 1.2;">
                <label>Categoría (Materia) *</label>
                <select [(ngModel)]="currentRecurso.categoria" name="categoria" required (change)="onCategoriaChange()" style="width: 100%; height: 44px; border-radius: 8px; border: 2px solid var(--glass-border); padding: 0 0.75rem; font-weight: 600; color: var(--text-primary); outline: none; background: white; font-size: 0.92rem;">
                  <option value="">-- Seleccionar --</option>
                  <option *ngFor="let mat of paesSvc.materias()" [value]="mat.title">{{ mat.title }}</option>
                </select>
              </div>
            </div>

            <div class="form-group" *ngIf="currentRecurso.categoria">
              <label>Subcategoría (Capítulo de la Materia) *</label>
              <select [(ngModel)]="currentRecurso.subcategoria" name="subcategoria" required style="width: 100%; height: 44px; border-radius: 8px; border: 2px solid var(--glass-border); padding: 0 0.75rem; font-weight: 600; color: var(--text-primary); outline: none; background: white; font-size: 0.92rem;">
                <option value="">-- Seleccionar Capítulo --</option>
                <option *ngFor="let cap of getChaptersForCurrentCategory()" [value]="cap.title">{{ cap.title }}</option>
              </select>
              <span class="help-text">Elige el capítulo al que pertenece este recurso de estudio.</span>
            </div>

            <div class="form-group">
              <label>Descripción del Material *</label>
              <textarea [(ngModel)]="currentRecurso.descripcion" name="descripcion" required rows="3" placeholder="Describe brevemente el contenido de este recurso y lo que aprenderán los alumnos..."></textarea>
            </div>

            <!-- TIPO DE RECURSO INTERACTIVE SELECTOR -->
            <div class="form-group">
              <label>Tipo de Recurso (Formato de Visualización) *</label>
              <div class="type-selector-grid">
                <div class="type-card pdf-card" [class.active]="currentRecurso.tipo === 'pdf'" (click)="currentRecurso.tipo = 'pdf'">
                  <span class="type-icon">📄</span>
                  <span class="type-title">PDF / Guía</span>
                </div>
                <div class="type-card video-card" [class.active]="currentRecurso.tipo === 'video'" (click)="currentRecurso.tipo = 'video'">
                  <span class="type-icon">▶️</span>
                  <span class="type-title">Video Clase</span>
                </div>
                <div class="type-card ensayo-card" [class.active]="currentRecurso.tipo === 'ensayo'" (click)="currentRecurso.tipo = 'ensayo'">
                  <span class="type-icon">📝</span>
                  <span class="type-title">Ensayo Práctico</span>
                </div>
                <div class="type-card libro-card" [class.active]="currentRecurso.tipo === 'libro'" (click)="currentRecurso.tipo = 'libro'">
                  <span class="type-icon">📚</span>
                  <span class="type-title">Libro Digital</span>
                </div>
                <div class="type-card link-card" [class.active]="currentRecurso.tipo === 'link'" (click)="currentRecurso.tipo = 'link'">
                  <span class="type-icon">🔗</span>
                  <span class="type-title">Enlace Web</span>
                </div>
                <div class="type-card otro-card" [class.active]="currentRecurso.tipo === 'otro'" (click)="currentRecurso.tipo = 'otro'">
                  <span class="type-icon">📁</span>
                  <span class="type-title">Otro Formato</span>
                </div>
              </div>
            </div>

            <!-- DYNAMIC EXPLANATION -->
            <div class="explanation-box" [ngClass]="currentRecurso.tipo || 'pdf'">
              <span class="explanation-icon">💡</span>
              <div class="explanation-content">
                <strong class="explanation-title">¿Cómo se verá en la plataforma?</strong>
                <p class="explanation-text">{{ getTypeExplanation(currentRecurso.tipo || '') }}</p>
              </div>
            </div>

            <!-- SOURCE TOGGLE -->
            <div class="form-group">
              <label>Origen del Material de Estudio *</label>
              <div class="source-tabs">
                <button type="button" class="source-tab-btn" [class.active]="uploadSource() === 'url'" (click)="uploadSource.set('url')">
                  🔗 Enlace Web (URL Externa)
                </button>
                <button type="button" class="source-tab-btn" [class.active]="uploadSource() === 'file'" (click)="uploadSource.set('file')">
                  📁 Subir Archivo desde PC (.pdf, .json, etc)
                </button>
              </div>
            </div>

            <!-- URL INPUT -->
            <div class="form-group" *ngIf="uploadSource() === 'url'">
              <label>Enlace URL / Dirección Web *</label>
              <input type="url" [(ngModel)]="currentRecurso.url" name="url" placeholder="https://ejemplo.com/material-de-estudio.pdf">
              <span class="help-text">Pega la dirección web completa donde se encuentra alojado el recurso.</span>
            </div>

            <!-- FILE UPLOAD DROPZONE -->
            <div class="form-group" *ngIf="uploadSource() === 'file'">
              <label>Subir Archivo de Estudio *</label>
              
              <!-- DROPZONE -->
              <div class="upload-dropzone" *ngIf="!selectedFileName()" 
                   (click)="fileInput.click()"
                   (dragover)="$event.preventDefault()"
                   (drop)="$event.preventDefault(); onFileDropped($event)">
                <input type="file" #fileInput class="hidden-file-input" (change)="onFileSelected($event)" accept=".pdf,image/*,application/json">
                <span class="upload-icon">📤</span>
                <span class="upload-title">Arrastra tu archivo aquí o <span class="upload-link">búscalo en tu PC</span></span>
                <span class="upload-subtitle">Formatos recomendados: PDF, Imágenes, Cuestionarios (.json) • Máx: 2MB</span>
              </div>

              <!-- FILE INSTALLED CARD -->
              <div class="file-details-card animate-fade-in" *ngIf="selectedFileName()">
                <div class="file-info-wrap">
                  <span class="file-installed-icon">📄</span>
                  <div class="file-text-details">
                    <span class="file-name-label">{{ selectedFileName() }}</span>
                    <span class="file-size-label">{{ selectedFileSize() }} • ✓ Archivo cargado</span>
                  </div>
                </div>
                <button type="button" class="btn-remove-file" (click)="removeSelectedFile()">✕ Quitar</button>
              </div>

              <!-- WARNING BOX -->
              <div class="file-warning-box animate-fade-in" *ngIf="fileWarning()">
                <p>{{ fileWarning() }}</p>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group" style="flex: 2;">
                <label>Etiquetas (separadas por coma)</label>
                <input type="text" [(ngModel)]="etiquetasInput" name="etiquetas" placeholder="Ej: álgebra, funciones, psu">
                <span class="help-text">Presiona enter o guarda para separar las etiquetas.</span>
              </div>
              <div class="form-group">
                <label>Orden (Prioridad)</label>
                <input type="number" [(ngModel)]="currentRecurso.orden" name="orden" required min="1">
              </div>
            </div>

            <div class="form-group toggle-group">
              <label class="toggle-label">
                <input type="checkbox" [(ngModel)]="currentRecurso.visible" name="visible">
                <span class="toggle-switch"></span>
                <span>Visible para los usuarios</span>
              </label>
            </div>

            <div class="form-error" *ngIf="formError">{{ formError }}</div>

            <div class="form-actions">
              <button type="button" class="btn-outline" (click)="closeModal()" [disabled]="isSaving">Cancelar</button>
              <button type="submit" class="btn-primary" [disabled]="isSaving">
                {{ isSaving ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Crear Recurso') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- MODAL ELIMINAR -->
    <div class="modal-overlay" *ngIf="showDeleteModal" (click)="showDeleteModal = false">
      <div class="modal-content glass-card delete-modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>🗑️ Confirmar Eliminación</h2>
          <button class="close-btn" (click)="showDeleteModal = false">&times;</button>
        </div>
        <div class="modal-body text-center" style="padding: 2rem 1rem;">
          <p>¿Estás seguro de que deseas eliminar el recurso <strong>"{{ recursoToDelete?.titulo }}"</strong>?</p>
          <p class="warning-text">Esta acción no se puede deshacer.</p>
        </div>
        <div class="form-actions" style="justify-content: center; margin-top: 1rem;">
          <button class="btn-outline" (click)="showDeleteModal = false">Cancelar</button>
          <button class="btn-primary" style="background: #ef4444; border-color: #ef4444;" (click)="executeDelete()">Sí, Eliminar</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: #fafafa; color: var(--text-primary); }
    .admin-layout { display: flex; min-height: 100vh; }
    .text-gradient { background: var(--gradient-brand); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    
    /* SIDEBAR */
    .sidebar { width: 260px; background: rgba(255,255,255,0.85) !important; backdrop-filter: blur(20px) !important; border-right: 1px solid rgba(133,92,214,0.15) !important; display: flex; flex-direction: column; position: fixed; top: 0; left: 0; height: 100vh; z-index: 100; }
    .sidebar-header { padding: 2.5rem 1.5rem 2rem; border-bottom: 1px solid rgba(133,92,214,0.15) !important; text-align: center; }
    .sidebar-logo { font-family: var(--font-heading); font-size: 2.2rem; font-weight: 900; background: linear-gradient(135deg, #ffffff 40%, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -0.04em; text-shadow: 0 0 15px rgba(139, 92, 246, 0.3); }
    .admin-panel-tag { display: inline-block; background: rgba(139, 92, 246, 0.25); color: #c084fc; font-size: 0.65rem; font-weight: 800; padding: 0.2rem 0.6rem; border-radius: 99px; margin-top: 0.5rem; letter-spacing: 0.08em; border: none; }
    
    .sidebar-nav { flex: 1; padding: 1rem 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; overflow-y: auto; }
    .nav-item { display: flex; align-items: center; gap: 0.85rem; padding: 0.9rem 1.1rem; border-radius: 12px; color: var(--text-primary) !important; text-decoration: none; transition: all 0.2s; cursor: pointer; font-size: 1.05rem; font-weight: 500; }
    .nav-item:hover { background: rgba(133,92,214,0.08) !important; color: var(--text-primary) !important; transform: translateX(4px); }
    .nav-item.active { 
      background: rgba(133,92,214,0.15) !important; 
      color: var(--accent-primary) !important; 
      border: none !important; 
      border-left: 3.5px solid var(--accent-primary) !important; 
      box-shadow: 0 4px 12px rgba(133,92,214,0.12) !important; 
      font-weight: 700 !important; 
    }
    .nav-item.active .nav-icon { filter: brightness(1.1) !important; }
    .nav-item.active .nav-text { color: var(--accent-primary) !important; }
    .nav-icon { font-size: 1.35rem; width: 32px; display: flex; align-items: center; justify-content: center; }
    .nav-count { margin-left: auto; background: rgba(133,92,214,0.1); color: var(--accent-primary); padding: 0.2rem 0.6rem; border-radius: 99px; font-size: 0.75rem; font-weight: 700; }
    
    .sidebar-divider { height: 1px; background: rgba(133,92,214,0.15); margin: 0.5rem 1rem; }
    
    .sidebar-footer { border-top: 1px solid rgba(133,92,214,0.15) !important; }
    .logout-btn-sidebar { color: #ef4444 !important; opacity: 0.8 !important; }
    .logout-btn-sidebar:hover { background: rgba(239, 68, 68, 0.08) !important; color: #ef4444 !important; opacity: 1 !important; }

    /* MAIN CONTENT */
    .main-content { flex: 1; margin-left: 260px; padding: 2.5rem; max-width: calc(100% - 260px); background: #fafafa !important; }
    
    .admin-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; gap: 1rem; flex-wrap: wrap; }
    .header-content h1 { font-family: var(--font-heading); font-size: 2.2rem; font-weight: 800; margin: 0 0 0.5rem; color: var(--text-primary); }
    .header-content p { color: var(--text-secondary); margin: 0; font-size: 1.05rem; }
    
    .btn-primary { background: #ef4444; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 12px; font-weight: 700; font-size: 1rem; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 0 #b91c1c; display: flex; align-items: center; gap: 0.5rem; }
    .btn-primary:hover { background: #dc2626; transform: translateY(2px); box-shadow: 0 2px 0 #b91c1c; }
    .btn-outline { background: transparent; color: var(--text-primary); border: 2px solid var(--glass-border); padding: 0.8rem 1.5rem; border-radius: 12px; font-weight: 700; font-size: 1rem; cursor: pointer; transition: all 0.2s; }
    .btn-outline:hover { background: var(--bg-secondary); }

    /* STATS */
    .stats-bar { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .stat-card { background: #fff; border: 2px solid var(--glass-border); border-radius: 16px; padding: 1.25rem; display: flex; flex-direction: column; box-shadow: var(--shadow-sm); }
    .stat-icon { font-size: 1.8rem; margin-bottom: 0.5rem; }
    .stat-count { font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; color: var(--text-primary); line-height: 1; margin-bottom: 0.25rem; }
    .stat-label { font-size: 0.85rem; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }

    /* TABLE */
    .recursos-list-container { padding: 0 !important; overflow: hidden; border: 2px solid var(--glass-border); }
    .admin-table { width: 100%; border-collapse: collapse; text-align: left; }
    .admin-table th { background: #f8f9fa; padding: 1rem 1.5rem; font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid var(--glass-border); }
    .admin-table td { padding: 1rem 1.5rem; border-bottom: 1px solid var(--glass-border); vertical-align: middle; }
    .admin-table tr:last-child td { border-bottom: none; }
    .admin-table tr:hover { background: rgba(0,0,0,0.01); }

    .status-indicator { font-size: 0.85rem; cursor: help; }
    .badge-order { background: rgba(0,0,0,0.05); padding: 0.2rem 0.6rem; border-radius: 6px; font-weight: 700; font-size: 0.9rem; }
    
    .badge-type { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.3rem 0.75rem; border-radius: 8px; font-size: 0.75rem; font-weight: 700; border: 1px solid; }
    .badge-type.pdf { background: rgba(239, 68, 68, 0.1); color: #ef4444; border-color: rgba(239, 68, 68, 0.2); }
    .badge-type.video { background: rgba(59, 130, 246, 0.1); color: #3b82f6; border-color: rgba(59, 130, 246, 0.2); }
    .badge-type.link { background: rgba(16, 185, 129, 0.1); color: #10b981; border-color: rgba(16, 185, 129, 0.2); }
    .badge-type.ensayo { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; border-color: rgba(139, 92, 246, 0.2); }
    .badge-type.libro { background: rgba(245, 158, 11, 0.1); color: #f59e0b; border-color: rgba(245, 158, 11, 0.2); }
    .badge-type.otro { background: rgba(107, 114, 128, 0.1); color: #6b7280; border-color: rgba(107, 114, 128, 0.2); }

    .r-title { font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem; font-size: 0.95rem; }
    .r-cat { font-size: 0.8rem; color: var(--text-secondary); background: rgba(0,0,0,0.05); display: inline-block; padding: 0.1rem 0.5rem; border-radius: 4px; }
    .r-link { color: var(--accent-secondary); font-weight: 600; font-size: 0.9rem; text-decoration: none; }
    .r-link:hover { text-decoration: underline; }

    .action-buttons { display: flex; gap: 0.5rem; }
    .btn-icon { background: rgba(0,0,0,0.04); border: none; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
    .btn-edit:hover { background: rgba(59, 130, 246, 0.1); }
    .btn-delete:hover { background: rgba(239, 68, 68, 0.1); }

    /* LOADING */
    .loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem; color: var(--text-secondary); font-weight: 600; }
    .spinner { width: 40px; height: 40px; border: 4px solid rgba(239, 68, 68, 0.2); border-top-color: #ef4444; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1rem; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* MODAL */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1.5rem; animation: fadeIn 0.2s ease; overflow-y: auto; }
    .modal-content { background: #fff; width: 100%; max-width: 800px; border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.2); margin: auto; }
    .delete-modal { max-width: 400px; }
    
    .modal-header { padding: 1.5rem 2rem; border-bottom: 1px solid var(--glass-border); display: flex; justify-content: space-between; align-items: center; }
    .modal-header h2 { margin: 0; font-size: 1.4rem; font-weight: 800; color: var(--text-primary); }
    .close-btn { background: none; border: none; font-size: 1.8rem; cursor: pointer; color: var(--text-muted); line-height: 1; transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), color 0.2s ease; }
    .close-btn:hover { transform: rotate(90deg) scale(1.1); color: #ef4444 !important; }
    
    .modal-body { padding: 2rem; max-height: calc(100vh - 200px); overflow-y: auto; }
    
    .form-row { display: flex; gap: 1.5rem; margin-bottom: 1.5rem; }
    @media (max-width: 640px) { .form-row { flex-direction: column; gap: 1.5rem; } }
    
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem; }
    .form-row .form-group { margin-bottom: 0; }
    
    .form-group label { font-size: 0.9rem; font-weight: 700; color: var(--text-primary); }
    .form-group input, .form-group select, .form-group textarea { padding: 0.85rem 1rem; border: 2px solid var(--glass-border); border-radius: 10px; font-size: 0.95rem; outline: none; transition: all 0.2s; font-family: inherit; background: #f8f9fa; }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: #ef4444; background: #fff; box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1); }
    
    .help-text { font-size: 0.75rem; color: var(--text-muted); }
    
    .toggle-group { margin-top: 1rem; margin-bottom: 2rem; background: rgba(0,0,0,0.02); padding: 1rem; border-radius: 10px; border: 1px solid rgba(0,0,0,0.05); }
    .toggle-label { display: flex; align-items: center; gap: 1rem; cursor: pointer; font-weight: 600 !important; }
    .toggle-label input { display: none; }
    .toggle-switch { position: relative; width: 44px; height: 24px; background: #cbd5e1; border-radius: 99px; transition: all 0.3s; }
    .toggle-switch::after { content: ''; position: absolute; top: 2px; left: 2px; width: 20px; height: 20px; background: #fff; border-radius: 50%; transition: all 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
    .toggle-label input:checked + .toggle-switch { background: #10b981; }
    .toggle-label input:checked + .toggle-switch::after { transform: translateX(20px); }

    .form-error { background: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 1rem; border-radius: 10px; margin-bottom: 1.5rem; font-weight: 600; font-size: 0.9rem; border: 1px solid rgba(239, 68, 68, 0.2); }

    .form-actions { display: flex; justify-content: flex-end; gap: 1rem; padding-top: 1rem; border-top: 1px solid var(--glass-border); }

    .warning-text { color: #ef4444; font-weight: 700; margin-top: 0.5rem; }
    .text-center { text-align: center; }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    /* TYPE SELECTOR GRID */
    .type-selector-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
      margin-bottom: 0.5rem;
    }
    @media (max-width: 600px) {
      .type-selector-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    .type-card {
      border: 2px solid var(--glass-border);
      border-radius: 12px;
      padding: 0.85rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      cursor: pointer;
      background: #f8fafc;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .type-card:hover {
      transform: translateY(-2px);
      background: white;
    }
    .type-card .type-icon {
      font-size: 1.5rem;
    }
    .type-card .type-title {
      font-size: 0.8rem;
      font-weight: 800;
      color: var(--text-secondary);
    }
    
    /* Type Selected Glows */
    .type-card.active.pdf-card { border-color: #ef4444; background: rgba(239, 68, 68, 0.05); box-shadow: 0 0 12px rgba(239, 68, 68, 0.15); }
    .type-card.active.pdf-card .type-title { color: #ef4444; }
    
    .type-card.active.video-card { border-color: #3b82f6; background: rgba(59, 130, 246, 0.05); box-shadow: 0 0 12px rgba(59, 130, 246, 0.15); }
    .type-card.active.video-card .type-title { color: #3b82f6; }
    
    .type-card.active.ensayo-card { border-color: #8b5cf6; background: rgba(139, 92, 246, 0.05); box-shadow: 0 0 12px rgba(139, 92, 246, 0.15); }
    .type-card.active.ensayo-card .type-title { color: #8b5cf6; }
    
    .type-card.active.libro-card { border-color: #f59e0b; background: rgba(245, 158, 11, 0.05); box-shadow: 0 0 12px rgba(245, 158, 11, 0.15); }
    .type-card.active.libro-card .type-title { color: #f59e0b; }
    
    .type-card.active.link-card { border-color: #10b981; background: rgba(16, 185, 129, 0.05); box-shadow: 0 0 12px rgba(16, 185, 129, 0.15); }
    .type-card.active.link-card .type-title { color: #10b981; }
    
    .type-card.active.otro-card { border-color: #6b7280; background: rgba(107, 114, 128, 0.05); box-shadow: 0 0 12px rgba(107, 114, 128, 0.15); }
    .type-card.active.otro-card .type-title { color: #6b7280; }

    /* EXPLANATION BOX */
    .explanation-box {
      display: flex;
      gap: 0.85rem;
      padding: 1rem 1.25rem;
      border-radius: 12px;
      margin-bottom: 1.5rem;
      border-left: 4px solid;
      background: #f8fafc;
      animation: fadeIn 0.25s ease;
    }
    .explanation-box.pdf { border-left-color: #ef4444; background: rgba(239, 68, 68, 0.02); }
    .explanation-box.video { border-left-color: #3b82f6; background: rgba(59, 130, 246, 0.02); }
    .explanation-box.ensayo { border-left-color: #8b5cf6; background: rgba(139, 92, 246, 0.02); }
    .explanation-box.libro { border-left-color: #f59e0b; background: rgba(245, 158, 11, 0.02); }
    .explanation-box.link { border-left-color: #10b981; background: rgba(16, 185, 129, 0.02); }
    .explanation-box.otro { border-left-color: #6b7280; background: rgba(107, 114, 128, 0.02); }

    .explanation-icon {
      font-size: 1.25rem;
      margin-top: 0.1rem;
    }
    .explanation-content {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }
    .explanation-title {
      font-size: 0.85rem;
      font-weight: 850;
      color: var(--text-primary);
    }
    .explanation-text {
      font-size: 0.82rem;
      color: var(--text-secondary);
      margin: 0;
      line-height: 1.45;
    }

    /* SOURCE TABS */
    .source-tabs {
      display: flex;
      gap: 0.5rem;
      background: #f1f5f9;
      padding: 0.3rem;
      border-radius: 10px;
      border: 1px solid rgba(0, 0, 0, 0.05);
    }
    .source-tab-btn {
      flex: 1;
      border: none;
      background: none;
      padding: 0.6rem;
      font-size: 0.85rem;
      font-weight: 750;
      color: var(--text-secondary);
      border-radius: 7px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .source-tab-btn.active {
      background: white;
      color: var(--text-primary);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
    }

    /* UPLOAD DROPZONE */
    .upload-dropzone {
      border: 2.5px dashed var(--glass-border);
      background: #f8fafc;
      border-radius: 14px;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.6rem;
      cursor: pointer;
      text-align: center;
      transition: all 0.25s;
    }
    .upload-dropzone:hover {
      border-color: #ef4444;
      background: rgba(239, 68, 68, 0.02);
      transform: scale(0.995);
    }
    .upload-icon {
      font-size: 2.2rem;
    }
    .upload-title {
      font-size: 0.95rem;
      font-weight: 750;
      color: var(--text-primary);
    }
    .upload-link {
      color: #ef4444;
      text-decoration: underline;
    }
    .upload-subtitle {
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .hidden-file-input {
      display: none;
    }

    /* FILE DETAILS CARD */
    .file-details-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: white;
      border: 2px solid #10b981;
      border-radius: 12px;
      padding: 0.85rem 1.25rem;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.06);
    }
    .file-info-wrap {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }
    .file-installed-icon {
      font-size: 1.8rem;
    }
    .file-text-details {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }
    .file-name-label {
      font-size: 0.9rem;
      font-weight: 800;
      color: var(--text-primary);
      max-width: 380px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .file-size-label {
      font-size: 0.75rem;
      font-weight: 700;
      color: #10b981;
    }
    .btn-remove-file {
      border: none;
      background: #fef2f2;
      color: #ef4444;
      font-weight: 800;
      font-size: 0.78rem;
      padding: 0.4rem 0.8rem;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-remove-file:hover {
      background: #fee2e2;
    }

    /* WARNING BOX */
    .file-warning-box {
      background: #fffbeb;
      border: 1px solid #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 0.85rem 1.1rem;
      border-radius: 0 10px 10px 0;
      margin-top: 0.85rem;
    }
    .file-warning-box p {
      font-size: 0.78rem;
      color: #b45309;
      margin: 0;
      font-weight: 650;
      line-height: 1.4;
    }
  `]
})
export class AdminRecursosComponent {
  public adminSvc = inject(AdminService);
  public recursosService = inject(RecursosService);
  public paesSvc = inject(PaesContentService);

  showModal = false;
  showDeleteModal = false;
  isEditing = false;
  isSaving = false;
  formError = '';

  selectedCategoria = signal<string>('all');
  selectedTipo = signal<string>('all');

  filteredRecursos = computed(() => {
    let list = this.recursosService.recursos();
    
    // Filter by category
    const cat = this.selectedCategoria();
    if (cat !== 'all') {
      list = list.filter(r => r.categoria === cat);
    }
    
    // Filter by type
    const tipo = this.selectedTipo();
    if (tipo !== 'all') {
      list = list.filter(r => r.tipo === tipo);
    }
    
    return list.sort((a, b) => a.orden - b.orden);
  });

  clearAdminFilters() {
    this.selectedCategoria.set('all');
    this.selectedTipo.set('all');
  }

  currentRecurso: Partial<Recurso> = {};
  etiquetasInput = '';
  recursoToDelete: Recurso | null = null;

  // Enhanced upload / options states
  selectedFileName = signal<string>('');
  selectedFileSize = signal<string>('');
  uploadSource = signal<'url' | 'file'>('url');
  fileWarning = signal<string>('');

  countByType(tipo: string): number {
    return this.recursosService.recursos().filter(r => r.tipo === tipo).length;
  }

  getTypeIcon(tipo: string): string {
    switch(tipo) {
      case 'pdf': return '📄';
      case 'video': return '▶️';
      case 'ensayo': return '📝';
      case 'libro': return '📚';
      case 'link': return '🔗';
      default: return '📁';
    }
  }

  openModal(recurso?: Recurso) {
    this.formError = '';
    this.selectedFileName.set('');
    this.selectedFileSize.set('');
    this.uploadSource.set('url');
    this.fileWarning.set('');

    if (recurso) {
      this.isEditing = true;
      this.currentRecurso = { ...recurso };
      this.etiquetasInput = recurso.etiquetas ? recurso.etiquetas.join(', ') : '';
      
      if (recurso.url && recurso.url.startsWith('data:')) {
        this.uploadSource.set('file');
        this.selectedFileName.set('Archivo guardado previamente');
        this.selectedFileSize.set('---');
      }
    } else {
      this.isEditing = false;
      this.currentRecurso = {
        titulo: '',
        descripcion: '',
        tipo: 'pdf',
        url: '',
        categoria: '',
        subcategoria: '',
        visible: true,
        orden: this.recursosService.recursos().length + 1
      };
      this.etiquetasInput = '';
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.currentRecurso = {};
    this.etiquetasInput = '';
    this.selectedFileName.set('');
    this.selectedFileSize.set('');
    this.uploadSource.set('url');
    this.fileWarning.set('');
  }

  onCategoriaChange() {
    this.currentRecurso.subcategoria = '';
  }

  getChaptersForCurrentCategory(): any[] {
    if (!this.currentRecurso.categoria) return [];
    const selectedMateria = this.paesSvc.materias().find(m => m.title === this.currentRecurso.categoria);
    if (!selectedMateria) return [];
    return this.paesSvc.getCapitulosByMateria(selectedMateria.id);
  }

  ejecutarAccionRecurso(recurso: Recurso, event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    if (!recurso.url || recurso.url === '#') {
      alert(`Este recurso no tiene una URL válida aún.`);
      return;
    }

    if (recurso.tipo === 'pdf' || recurso.tipo === 'libro' || recurso.url.startsWith('data:')) {
      this.descargarRecurso(recurso);
    } else {
      window.open(recurso.url, '_blank');
    }
  }

  descargarRecurso(recurso: Recurso) {
    if (!recurso.url) return;
    
    const link = document.createElement('a');
    link.href = recurso.url;
    
    // Obtener extensión del archivo
    let ext = 'pdf';
    if (recurso.url.startsWith('data:')) {
      const match = recurso.url.match(/data:([^;]+);/);
      if (match && match[1]) {
        const mime = match[1];
        if (mime.includes('pdf')) ext = 'pdf';
        else if (mime.includes('epub')) ext = 'epub';
        else if (mime.includes('json')) ext = 'json';
        else ext = mime.split('/')[1] || 'bin';
      }
    } else {
      const parts = recurso.url.split('?')[0].split('.');
      if (parts.length > 1) {
        ext = parts.pop() || 'pdf';
      }
    }
    
    // Limpiar nombre del archivo
    const safeTitle = recurso.titulo
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_');
      
    link.download = `${safeTitle}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  getTypeExplanation(tipo: string): string {
    switch (tipo) {
      case 'pdf': return 'Muestra un lector de guías interactivo de múltiples páginas con resúmenes académicos personalizados, marcas de agua anti-copia y contenido descargable.';
      case 'video': return 'Simula un reproductor interactivo premium de video con barras de frecuencia de audio dinámicas, control de tiempo inteligente y subtítulos sincronizados automáticamente con el tutor.';
      case 'ensayo': return 'Genera un minicuestionario interactivo real de 3 preguntas de la PAES con corrección al instante, retroalimentación visual (aciertos en verde, errores en rojo) y una caja con la explicación del fundamento paso a paso.';
      case 'libro': return 'Activa un visualizador premium de libro en dos páginas (estilo cuadernillo abierto) con portada dura, lomo físico simulado, y controles de pase de hoja de lectura.';
      case 'link': return 'Crea un mock de navegador web minimalista con barra de direcciones segura HTTPS, ícono de candado, botones clásicos y vista preliminar estructurada del portal destino.';
      case 'otro': return 'Una tarjeta clásica premium con ícono de folder y botón directo para descargar o abrir el archivo.';
      default: return 'Selecciona un tipo para ver su funcionamiento en la aplicación.';
    }
  }

  getTypeName(tipo: string): string {
    switch (tipo) {
      case 'pdf': return 'PDF / Guía';
      case 'video': return 'Video Clase';
      case 'ensayo': return 'Ensayo Práctico';
      case 'libro': return 'Libro Digital';
      case 'link': return 'Enlace Web';
      case 'otro': return 'Otro Formato';
      default: return '';
    }
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  onFileDropped(event: DragEvent) {
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  handleFile(file: File) {
    this.fileWarning.set('');
    
    // Check file size (1.5MB recommended limit)
    const limit = 1.5 * 1024 * 1024;
    if (file.size > limit) {
      this.fileWarning.set('⚠️ El archivo supera los 1.5MB de límite recomendado. Se recomienda subir un archivo más liviano o usar un enlace URL externo para evitar problemas de almacenamiento.');
    }

    this.selectedFileName.set(file.name);
    this.selectedFileSize.set(this.formatBytes(file.size));

    // Convert file to base64 Data URL
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.currentRecurso.url = e.target.result;
      
      // Auto populate title if it's currently empty
      if (!this.currentRecurso.titulo) {
        const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        const cleanName = nameWithoutExt
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase());
        this.currentRecurso.titulo = cleanName;
      }
    };
    reader.readAsDataURL(file);
  }

  removeSelectedFile() {
    this.selectedFileName.set('');
    this.selectedFileSize.set('');
    this.fileWarning.set('');
    this.currentRecurso.url = '';
  }

  async saveRecurso() {
    this.formError = '';
    
    // Validaciones básicas
    if (!this.currentRecurso.titulo || !this.currentRecurso.descripcion || !this.currentRecurso.url || !this.currentRecurso.categoria || !this.currentRecurso.subcategoria) {
      this.formError = 'Por favor completa todos los campos obligatorios (*) incluyendo la Categoría y Subcategoría.';
      return;
    }

    this.isSaving = true;

    // Parsear etiquetas
    const etiquetas = this.etiquetasInput
      .split(',')
      .map(e => e.trim())
      .filter(e => e.length > 0);

    const recursoData = {
      ...this.currentRecurso,
      etiquetas
    } as Recurso;

    try {
      if (this.isEditing && this.currentRecurso.id) {
        // Actualizar
        if (this.currentRecurso.id.startsWith('placeholder_')) {
          this.formError = 'No puedes editar un recurso de ejemplo (placeholder). Crea uno nuevo.';
          this.isSaving = false;
          return;
        }
        await this.recursosService.updateRecurso(this.currentRecurso.id, recursoData);
      } else {
        // Crear
        await this.recursosService.createRecurso(recursoData);
      }
      this.closeModal();
    } catch (err: any) {
      this.formError = 'Error al guardar: ' + err.message;
    } finally {
      this.isSaving = false;
    }
  }

  confirmDelete(recurso: Recurso) {
    if (recurso.id?.startsWith('placeholder_')) {
      alert('No puedes eliminar un recurso de ejemplo (placeholder).');
      return;
    }
    this.recursoToDelete = recurso;
    this.showDeleteModal = true;
  }

  async executeDelete() {
    if (this.recursoToDelete?.id) {
      try {
        await this.recursosService.deleteRecurso(this.recursoToDelete.id);
        this.showDeleteModal = false;
        this.recursoToDelete = null;
      } catch (err: any) {
        alert('Error al eliminar: ' + err.message);
      }
    }
  }
}
