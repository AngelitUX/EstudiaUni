import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AdminService } from './services/admin.service';
import { AdminSidebarComponent } from './admin-sidebar.component';
import { PoolPregunta, MateriaId } from '../learning-path/models/paes.models';
import { KatexService } from '../../core/services/katex.service';

@Component({
  selector: 'app-question-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdminSidebarComponent],
  template: `
    <div class="admin-layout">
      <app-admin-sidebar></app-admin-sidebar>
      <main class="admin-main-content">
        <div class="editor-page">
          <header class="editor-header">
            <a routerLink="/admin" class="btn-back">← Volver</a>
            <h1>{{ isEditing() ? '✏️ Editar Pregunta' : '➕ Nueva Pregunta' }}</h1>
          </header>

          <div class="editor-grid">
        <!-- FORM -->
        <div class="form-section">
          <!-- MATERIA + TEMA -->
          <div class="form-group">
            <label>Materia *</label>
            <select [(ngModel)]="form.materiaId" (ngModelChange)="onMateriaChange()" class="input-select">
              @for (m of adminSvc.materiasDisponibles; track m.id) {
                <option [value]="m.id">{{ m.icon }} {{ m.label }}</option>
              }
            </select>
          </div>
          <div class="form-group">
            <label>Tema / Eje Temático *</label>
            <select [(ngModel)]="form.tema" class="input-select">
              <option value="" disabled>Selecciona un tema...</option>
              @for (tema of getTemasForMateria(form.materiaId); track tema) {
                <option [value]="tema">{{ tema }}</option>
              }
            </select>
          </div>

          <div class="section-divider"><span>Contenido de la Pregunta</span></div>

          <!-- PREAMBULO -->
          <div class="form-group">
            <label>Preámbulo Texto <span class="opt">(opcional)</span></label>
            <textarea [(ngModel)]="form.preambulo_texto" class="input-textarea" rows="3"
              placeholder="Cita corta o contexto introductorio (Historia/Ciencias)"></textarea>
          </div>
          <div class="form-group">
            <label>Preámbulo Imagen URL <span class="opt">(opcional)</span></label>
            <input type="text" [(ngModel)]="form.preambulo_imagen_url" class="input-text"
              placeholder="https://storage.googleapis.com/...">
          </div>

          <!-- ENUNCIADO -->
          <div class="form-group">
            <label>Enunciado *</label>
            <textarea [(ngModel)]="form.enunciado" class="input-textarea input-main" rows="4"
              placeholder="La pregunta principal..."></textarea>
          </div>

          <!-- FORMULA LATEX -->
          <div class="form-group">
            <label>Fórmula LaTeX <span class="opt">(opcional - Matemáticas)</span></label>
            <input type="text" [(ngModel)]="form.formula_latex" class="input-text input-mono"
              placeholder='Ej: 3 \\cdot (\\frac{1}{6} + \\frac{3}{2})'>
          </div>

          <div class="section-divider"><span>Alternativas</span></div>

          <!-- TIPO ALTERNATIVAS -->
          <div class="form-group">
            <label>Tipo de Alternativas *</label>
            <div class="radio-group">
              <label class="radio-label" [class.active]="form.tipo_alternativas === 'texto'">
                <input type="radio" [(ngModel)]="form.tipo_alternativas" value="texto"> 📝 Texto
              </label>
              <label class="radio-label" [class.active]="form.tipo_alternativas === 'imagen'">
                <input type="radio" [(ngModel)]="form.tipo_alternativas" value="imagen"> 🖼️ Imagen (URLs)
              </label>
            </div>
          </div>

          <!-- ALTERNATIVAS -->
          @for (key of optionKeys; track key) {
            <div class="form-group alt-group">
              <label>
                <span class="alt-letter" [class.correct]="form.respuesta_correcta === key">{{ key }}</span>
                @if (form.tipo_alternativas === 'imagen') { URL de imagen } @else { Texto }
              </label>
              <input type="text" [(ngModel)]="form.alternativas[key]" class="input-text"
                [placeholder]="form.tipo_alternativas === 'imagen' ? 'https://storage...' : 'Alternativa ' + key">
            </div>
          }

          <!-- RESPUESTA CORRECTA -->
          <div class="form-group">
            <label>Respuesta Correcta *</label>
            <div class="radio-group">
              @for (key of optionKeys; track key) {
                <label class="radio-label radio-answer" [class.active]="form.respuesta_correcta === key">
                  <input type="radio" [(ngModel)]="form.respuesta_correcta" [value]="key"> {{ key }}
                </label>
              }
            </div>
          </div>

          <div class="section-divider"><span>Feedback</span></div>

          <div class="form-group">
            <label>Feedback Acierto * <span class="hint">✅ Usa emojis</span></label>
            <textarea [(ngModel)]="form.feedback_acierto" class="input-textarea" rows="3"
              placeholder="¡Excelente! Explicación de por qué es correcta..."></textarea>
          </div>
          <div class="form-group">
            <label>Feedback Error * <span class="hint">❌ Usa emojis</span></label>
            <textarea [(ngModel)]="form.feedback_error" class="input-textarea" rows="3"
              placeholder="Recuerda que... Pista o corrección del error..."></textarea>
          </div>

          <!-- SUBMIT -->
          <div class="form-actions">
            <a routerLink="/admin" class="btn-cancel">Cancelar</a>
            <button class="btn-save" (click)="save()" [disabled]="saving() || !isValid()">
              {{ saving() ? '⏳ Guardando...' : (isEditing() ? '💾 Guardar Cambios' : '🚀 Crear Pregunta') }}
            </button>
          </div>
        </div>

        <!-- PREVIEW -->
        <div class="preview-section">
          <div class="preview-header">
            <h3>👁️ Vista Previa</h3>
            <span class="preview-badge">{{ adminSvc.getMateriaIcon(form.materiaId) }} {{ adminSvc.getMateriaLabel(form.materiaId) }}</span>
          </div>
          <div class="preview-card">
            @if (form.preambulo_texto) {
              <p class="pv-preambulo">💬 {{ form.preambulo_texto }}</p>
            }
            @if (form.preambulo_imagen_url) {
              <div class="pv-img-wrap">
                <img [src]="form.preambulo_imagen_url" alt="Preámbulo" class="pv-img" (error)="imgError($event)">
              </div>
            }
            <p class="pv-enunciado">{{ form.enunciado || 'Escribe el enunciado...' }}</p>
            @if (form.formula_latex) {
              <div class="pv-formula" [innerHTML]="renderLatex(form.formula_latex)"></div>
            }
            <div class="pv-options">
              @for (key of optionKeys; track key) {
                <div class="pv-option" [class.correct]="key === form.respuesta_correcta">
                  <span class="pv-letter">{{ key }}</span>
                  @if (form.tipo_alternativas === 'imagen' && form.alternativas[key]) {
                    <img [src]="form.alternativas[key]" alt="Opción {{ key }}" class="pv-opt-img" (error)="imgError($event)">
                  } @else {
                    <span>{{ form.alternativas[key] || '...' }}</span>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: #fafafa !important; color: var(--text-primary); }
    .admin-layout { display: flex; min-height: 100vh; }
    .admin-main-content { flex: 1; margin-left: 260px; padding: 2.5rem; max-width: calc(100% - 260px); box-sizing: border-box; background: #fafafa; }
    .editor-page { max-width: 1200px; margin: 0 auto; }

    .editor-header { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2.5rem; }
    .editor-header h1 { font-family: var(--font-heading); font-size: 2.2rem; font-weight: 800; color: var(--text-primary); margin: 0; letter-spacing: -0.02em; }
    
    .btn-back {
      padding: 0.65rem 1.25rem; 
      border-radius: 12px;
      border: 2px solid var(--glass-border); 
      background: #ffffff;
      color: var(--text-secondary); 
      font-size: 0.95rem; 
      font-weight: 700;
      text-decoration: none;
      transition: all 0.2s; 
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .btn-back:hover { border-color: rgba(133,92,214,0.4); color: var(--accent-primary); box-shadow: var(--shadow-sm); transform: translateX(-2px); }

    .editor-grid { display: grid; grid-template-columns: 1fr 380px; gap: 2.5rem; align-items: start; }

    /* FORM SECTION */
    .form-section {
      background: #ffffff; 
      border: 2px solid var(--glass-border);
      border-radius: 20px; 
      padding: 2.25rem;
      box-shadow: var(--shadow);
    }
    .form-group { margin-bottom: 1.5rem; }
    .form-group label {
      display: flex; 
      align-items: center; 
      gap: 0.5rem;
      font-size: 0.92rem; 
      font-weight: 700; 
      color: var(--text-primary);
      margin-bottom: 0.6rem;
    }
    .opt { font-weight: 500; color: var(--text-muted); font-size: 0.8rem; }
    .hint { font-weight: 600; color: var(--accent-primary); font-size: 0.78rem; margin-left: auto; }

    .input-text, .input-select, .input-textarea {
      width: 100%; 
      padding: 0.85rem 1rem;
      background: #ffffff; 
      border: 2px solid var(--glass-border);
      border-radius: 12px; 
      color: var(--text-primary); 
      font-size: 0.92rem;
      font-weight: 500;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); 
      outline: none; 
      font-family: inherit;
      box-sizing: border-box;
    }
    .input-text:focus, .input-select:focus, .input-textarea:focus {
      border-color: var(--accent-primary); 
      box-shadow: 0 0 0 4px rgba(133,92,214,0.15);
      background: #ffffff;
    }
    .input-select { cursor: pointer; }
    .input-select option { background: #ffffff; color: var(--text-primary); }
    .input-textarea { resize: vertical; min-height: 80px; line-height: 1.5; }
    .input-main { font-size: 1rem; font-weight: 600; }
    .input-mono { font-family: 'Courier New', monospace; font-size: 0.88rem; font-weight: 700; color: var(--accent-primary); }

    .section-divider {
      margin: 2.25rem 0 1.75rem; 
      border-top: 2px solid var(--glass-border);
      text-align: center; 
      position: relative;
    }
    .section-divider span {
      background: #ffffff; 
      padding: 0 1rem;
      font-family: var(--font-heading);
      font-size: 0.85rem; 
      text-transform: uppercase; 
      letter-spacing: 0.08em;
      color: var(--text-muted); 
      font-weight: 800; 
      position: relative; 
      top: -0.65rem;
    }

    .radio-group { display: flex; gap: 0.65rem; flex-wrap: wrap; }
    .radio-label {
      display: flex; 
      align-items: center; 
      gap: 0.5rem;
      padding: 0.75rem 1.25rem; 
      border-radius: 12px;
      border: 2px solid var(--glass-border); 
      background: #ffffff;
      color: var(--text-secondary); 
      font-size: 0.9rem; 
      cursor: pointer; 
      transition: all 0.2s;
      font-weight: 700;
    }
    .radio-label:hover { border-color: rgba(133,92,214,0.3); }
    .radio-label.active { border-color: var(--accent-primary); background: rgba(133,92,214,0.06); color: var(--accent-primary); }
    .radio-label input[type="radio"] { display: none; }
    .radio-answer { min-width: 58px; justify-content: center; font-weight: 800; font-size: 1.1rem; }

    .alt-group { position: relative; }
    .alt-letter {
      width: 28px; 
      height: 28px; 
      border-radius: 8px;
      background: var(--bg-secondary); 
      display: inline-flex;
      align-items: center; 
      justify-content: center;
      font-size: 0.85rem; 
      font-weight: 800; 
      color: var(--text-secondary);
      transition: all 0.2s;
    }
    .alt-letter.correct { 
      background: rgba(88,204,2,0.15); 
      color: #3d8c00; 
      border: 1.5px solid rgba(88,204,2,0.3);
      box-shadow: 0 0 10px rgba(88,204,2,0.15);
    }

    .form-actions {
      display: flex; 
      gap: 1rem; 
      justify-content: flex-end;
      margin-top: 2rem; 
      padding-top: 1.5rem;
      border-top: 2px solid var(--glass-border);
    }
    .btn-cancel {
      padding: 0.85rem 1.5rem; 
      border-radius: 12px;
      border: 2px solid var(--glass-border); 
      background: transparent;
      color: var(--text-secondary); 
      font-weight: 700; 
      cursor: pointer;
      text-decoration: none; 
      font-size: 0.95rem; 
      transition: all 0.2s;
    }
    .btn-cancel:hover { background: var(--bg-secondary); color: var(--text-primary); }
    
    .btn-save {
      padding: 0.85rem 2rem; 
      border-radius: 12px; 
      border: none;
      background: var(--gradient-brand);
      color: #fff; 
      font-weight: 700; 
      font-size: 0.95rem; 
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(133,92,214,0.3); 
      transition: all 0.2s;
    }
    .btn-save:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(133,92,214,0.4); }
    .btn-save:disabled { opacity: 0.5; cursor: not-allowed; }

    /* PREVIEW SECTION */
    .preview-section {
      position: sticky; 
      top: 2rem;
      background: #ffffff; 
      border: 2px solid var(--glass-border);
      border-radius: 20px; 
      overflow: hidden;
      box-shadow: var(--shadow);
    }
    .preview-header {
      display: flex; 
      justify-content: space-between; 
      align-items: center;
      padding: 1.15rem 1.5rem;
      border-bottom: 2px solid var(--glass-border);
      background: var(--bg-secondary);
    }
    .preview-header h3 { margin: 0; font-size: 1rem; color: var(--text-primary); font-weight: 800; font-family: var(--font-heading); }
    .preview-badge {
      font-size: 0.75rem; 
      font-weight: 700;
      background: rgba(133,92,214,0.12); 
      color: var(--accent-primary);
      padding: 0.3rem 0.75rem; 
      border-radius: 8px;
    }
    .preview-card { padding: 1.5rem; }
    
    .pv-preambulo {
      font-size: 0.9rem; 
      color: var(--text-secondary); 
      font-style: italic;
      margin: 0 0 1rem; 
      line-height: 1.6;
      padding: 0.85rem; 
      background: rgba(133,92,214,0.04);
      border-radius: 10px; 
      border-left: 3px solid rgba(133,92,214,0.4);
    }
    .pv-img-wrap {
      margin-bottom: 1rem; 
      background: var(--bg-secondary);
      border-radius: 12px; 
      padding: 0.75rem; 
      text-align: center;
      border: 1.5px solid var(--glass-border);
    }
    .pv-img { max-width: 100%; max-height: 200px; object-fit: contain; border-radius: 8px; }
    .pv-enunciado { font-size: 1.05rem; font-weight: 700; color: var(--text-primary); line-height: 1.6; margin: 0 0 1.25rem; }
    
    .pv-formula {
      font-size: 0.95rem;
      background: rgba(16,185,129,0.06); 
      color: #059669;
      padding: 0.75rem; 
      border-radius: 10px; 
      margin-bottom: 1.25rem;
      border: 1.5px solid rgba(16,185,129,0.15);
    }
    
    .pv-options { display: flex; flex-direction: column; gap: 0.65rem; }
    .pv-option {
      display: flex; 
      align-items: center; 
      gap: 0.85rem;
      padding: 0.75rem 1rem; 
      border-radius: 10px;
      border: 1.5px solid var(--glass-border);
      font-size: 0.9rem; 
      color: var(--text-secondary); 
      transition: all 0.2s;
      font-weight: 500;
    }
    .pv-option.correct { 
      border-color: rgba(88,204,2,0.35); 
      background: rgba(88,204,2,0.06); 
      color: #3d8c00; 
      font-weight: 700;
    }
    
    .pv-letter {
      width: 28px; 
      height: 28px; 
      border-radius: 8px;
      background: var(--bg-secondary); 
      display: flex;
      align-items: center; 
      justify-content: center;
      font-weight: 800; 
      font-size: 0.85rem; 
      color: var(--text-muted); 
      flex-shrink: 0;
    }
    .pv-option.correct .pv-letter { background: rgba(88,204,2,0.15); color: #3d8c00; }
    .pv-opt-img { max-width: 100%; max-height: 80px; object-fit: contain; border-radius: 6px; }

    @media (max-width: 1024px) {
      .admin-layout { flex-direction: column; }
      .admin-main-content { margin-left: 0; padding: 1.5rem; max-width: 100%; }
    }
    @media (max-width: 900px) {
      .editor-grid { grid-template-columns: 1fr; }
      .preview-section { position: static; }
    }
    @media (max-width: 768px) {
      .admin-main-content { padding: 1.25rem; }
      .editor-header { flex-wrap: wrap; gap: 1rem; margin-bottom: 1.75rem; }
      .editor-header h1 { font-size: 1.6rem; }
      .form-section { padding: 1.5rem; }
    }
    @media (max-width: 480px) {
      .admin-main-content { padding: 1rem; }
      .editor-header h1 { font-size: 1.35rem; }
      .form-section { padding: 1.1rem; }
      .form-actions { flex-direction: column-reverse; }
      .btn-cancel, .btn-save { width: 100%; text-align: center; }
      .radio-group { gap: 0.5rem; }
      .radio-label { padding: 0.6rem 0.9rem; font-size: 0.85rem; }
    }
  `]
})
export class QuestionEditorComponent implements OnInit {
  adminSvc = inject(AdminService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private katexSvc = inject(KatexService);
  private sanitizer = inject(DomSanitizer);

  optionKeys: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
  isEditing = signal(false);
  saving = signal(false);
  editId = '';

  form: {
    materiaId: MateriaId;
    tema: string;
    preambulo_texto: string;
    preambulo_imagen_url: string;
    enunciado: string;
    formula_latex: string;
    tipo_alternativas: 'texto' | 'imagen';
    alternativas: { A: string; B: string; C?: string; D?: string };
    respuesta_correcta: 'A' | 'B' | 'C' | 'D';
    feedback_acierto: string;
    feedback_error: string;
  } = {
    materiaId: 'matematicas-m1',
    tema: '',
    preambulo_texto: '',
    preambulo_imagen_url: '',
    enunciado: '',
    formula_latex: '',
    tipo_alternativas: 'texto',
    alternativas: { A: '', B: '', C: '', D: '' },
    respuesta_correcta: 'A',
    feedback_acierto: '',
    feedback_error: '',
  };

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'nueva') {
      this.editId = id;
      this.isEditing.set(true);
      const pregunta = await this.adminSvc.getPreguntaById(id);
      if (pregunta) {
        this.form = {
          materiaId: pregunta.materiaId,
          tema: pregunta.tema,
          preambulo_texto: pregunta.preambulo_texto || '',
          preambulo_imagen_url: pregunta.preambulo_imagen_url || '',
          enunciado: pregunta.enunciado,
          formula_latex: pregunta.formula_latex || '',
          tipo_alternativas: pregunta.tipo_alternativas,
          alternativas: {
            A: pregunta.alternativas?.A || '',
            B: pregunta.alternativas?.B || '',
            C: pregunta.alternativas?.C || '',
            D: pregunta.alternativas?.D || '',
          },
          respuesta_correcta: pregunta.respuesta_correcta,
          feedback_acierto: pregunta.feedback_acierto,
          feedback_error: pregunta.feedback_error,
        };
      }
    }
  }

  isValid(): boolean {
    return !!(
      this.form.materiaId &&
      this.form.tema.trim() &&
      this.form.enunciado.trim() &&
      this.form.alternativas.A?.trim() &&
      this.form.alternativas.B?.trim() &&
      (this.form.alternativas.C === undefined || this.form.alternativas.C.trim()) &&
      (this.form.alternativas.D === undefined || this.form.alternativas.D.trim()) &&
      this.form.feedback_acierto.trim() &&
      this.form.feedback_error.trim()
    );
  }

  async save() {
    if (!this.isValid()) return;
    this.saving.set(true);

    const data = {
      materiaId: this.form.materiaId,
      tema: this.form.tema.trim(),
      preambulo_texto: this.form.preambulo_texto.trim() || null,
      preambulo_imagen_url: this.form.preambulo_imagen_url.trim() || null,
      enunciado: this.form.enunciado.trim(),
      formula_latex: this.form.formula_latex.trim() || null,
      tipo_alternativas: this.form.tipo_alternativas,
      alternativas: this.form.alternativas,
      respuesta_correcta: this.form.respuesta_correcta,
      feedback_acierto: this.form.feedback_acierto.trim(),
      feedback_error: this.form.feedback_error.trim(),
    };

    try {
      if (this.isEditing()) {
        await this.adminSvc.updatePregunta(this.editId, data);
      } else {
        await this.adminSvc.createPregunta(data);
      }
      this.router.navigate(['/admin']);
    } catch (error) {
      console.error('Error saving pregunta:', error);
      alert('Error al guardar. Verifica tu conexión y permisos de admin.');
    } finally {
      this.saving.set(false);
    }
  }

  imgError(event: Event) {
    (event.target as HTMLImageElement).style.display = 'none';
  }

  renderLatex(latex: string | null): SafeHtml {
    if (!latex) return '';
    return this.katexSvc.render(latex);
  }

  getTemasForMateria(materiaId: MateriaId): string[] {
    return this.adminSvc.getTemasForMateria(materiaId);
  }

  onMateriaChange() {
    this.form.tema = '';
  }
}
