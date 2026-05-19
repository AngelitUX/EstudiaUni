import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AdminService } from './services/admin.service';
import { PoolPregunta, MateriaId } from '../learning-path/models/paes.models';
import { KatexService } from '../../core/services/katex.service';

@Component({
  selector: 'app-question-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
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
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: #0f0f14; color: #e4e4e7; }
    .editor-page { max-width: 1200px; margin: 0 auto; padding: 1.5rem; }

    .editor-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
    .editor-header h1 { font-size: 1.4rem; font-weight: 800; color: #fff; margin: 0; }
    .btn-back {
      padding: 0.5rem 1rem; border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.08); background: transparent;
      color: #a1a1aa; font-size: 0.82rem; text-decoration: none;
      transition: all 0.2s; cursor: pointer;
    }
    .btn-back:hover { border-color: rgba(133,92,214,0.3); color: #a78bfa; }

    .editor-grid { display: grid; grid-template-columns: 1fr 380px; gap: 2rem; align-items: start; }

    /* FORM */
    .form-section {
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
      border-radius: 16px; padding: 1.5rem;
    }
    .form-group { margin-bottom: 1.1rem; }
    .form-group label {
      display: flex; align-items: center; gap: 0.4rem;
      font-size: 0.82rem; font-weight: 600; color: #a1a1aa;
      margin-bottom: 0.4rem;
    }
    .opt { font-weight: 400; color: #52525b; font-size: 0.75rem; }
    .hint { font-weight: 400; color: #a78bfa; font-size: 0.72rem; margin-left: auto; }

    .input-text, .input-select, .input-textarea {
      width: 100%; padding: 0.7rem 0.85rem;
      background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px; color: #e4e4e7; font-size: 0.88rem;
      transition: all 0.2s; outline: none; font-family: inherit;
      box-sizing: border-box;
    }
    .input-text:focus, .input-select:focus, .input-textarea:focus {
      border-color: rgba(133,92,214,0.5); box-shadow: 0 0 0 3px rgba(133,92,214,0.1);
    }
    .input-select { cursor: pointer; }
    .input-select option { background: #1e1e2a; color: #e4e4e7; }
    .input-textarea { resize: vertical; min-height: 60px; }
    .input-main { font-size: 0.95rem; font-weight: 500; }
    .input-mono { font-family: 'Courier New', monospace; font-size: 0.82rem; }

    .section-divider {
      margin: 1.5rem 0 1.25rem; border-top: 1px solid rgba(255,255,255,0.06);
      text-align: center; position: relative;
    }
    .section-divider span {
      background: #18181f; padding: 0 0.75rem;
      font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em;
      color: #71717a; font-weight: 600; position: relative; top: -0.55rem;
    }

    .radio-group { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .radio-label {
      display: flex; align-items: center; gap: 0.35rem;
      padding: 0.5rem 0.85rem; border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.08); background: transparent;
      color: #a1a1aa; font-size: 0.82rem; cursor: pointer; transition: all 0.2s;
    }
    .radio-label:hover { border-color: rgba(133,92,214,0.3); }
    .radio-label.active { border-color: rgba(133,92,214,0.5); background: rgba(133,92,214,0.1); color: #a78bfa; }
    .radio-label input[type="radio"] { display: none; }
    .radio-answer { min-width: 50px; justify-content: center; font-weight: 700; }

    .alt-group { position: relative; }
    .alt-letter {
      width: 22px; height: 22px; border-radius: 5px;
      background: rgba(255,255,255,0.06); display: inline-flex;
      align-items: center; justify-content: center;
      font-size: 0.72rem; font-weight: 800; color: #71717a;
    }
    .alt-letter.correct { background: rgba(88,204,2,0.15); color: #86efac; }

    .form-actions {
      display: flex; gap: 0.75rem; justify-content: flex-end;
      margin-top: 1.5rem; padding-top: 1.25rem;
      border-top: 1px solid rgba(255,255,255,0.06);
    }
    .btn-cancel {
      padding: 0.7rem 1.25rem; border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.1); background: transparent;
      color: #a1a1aa; font-weight: 600; cursor: pointer;
      text-decoration: none; font-size: 0.85rem; transition: all 0.2s;
    }
    .btn-cancel:hover { border-color: rgba(255,255,255,0.2); color: #e4e4e7; }
    .btn-save {
      padding: 0.7rem 1.5rem; border-radius: 10px; border: none;
      background: linear-gradient(135deg, #855cd6, #6c3fc5);
      color: #fff; font-weight: 700; font-size: 0.88rem; cursor: pointer;
      box-shadow: 0 4px 15px rgba(133,92,214,0.3); transition: all 0.2s;
    }
    .btn-save:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(133,92,214,0.4); }
    .btn-save:disabled { opacity: 0.5; cursor: not-allowed; }

    /* PREVIEW */
    .preview-section {
      position: sticky; top: 1.5rem;
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
      border-radius: 16px; overflow: hidden;
    }
    .preview-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 0.85rem 1.15rem;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .preview-header h3 { margin: 0; font-size: 0.88rem; color: #a1a1aa; }
    .preview-badge {
      font-size: 0.7rem; font-weight: 600;
      background: rgba(133,92,214,0.12); color: #a78bfa;
      padding: 0.2rem 0.6rem; border-radius: 6px;
    }
    .preview-card { padding: 1.15rem; }
    .pv-preambulo {
      font-size: 0.8rem; color: #a1a1aa; font-style: italic;
      margin: 0 0 0.75rem; line-height: 1.5;
      padding: 0.65rem; background: rgba(133,92,214,0.05);
      border-radius: 8px; border-left: 3px solid rgba(133,92,214,0.3);
    }
    .pv-img-wrap {
      margin-bottom: 0.75rem; background: rgba(255,255,255,0.03);
      border-radius: 10px; padding: 0.5rem; text-align: center;
    }
    .pv-img { max-width: 100%; max-height: 180px; object-fit: contain; border-radius: 6px; }
    .pv-enunciado { font-size: 0.92rem; font-weight: 600; color: #e4e4e7; line-height: 1.5; margin: 0 0 0.75rem; }
    .pv-formula {
      font-family: 'Courier New', monospace; font-size: 0.85rem;
      background: rgba(16,185,129,0.08); color: #34d399;
      padding: 0.65rem; border-radius: 8px; margin-bottom: 0.75rem;
      border: 1px solid rgba(16,185,129,0.15);
    }
    .pv-options { display: flex; flex-direction: column; gap: 0.4rem; }
    .pv-option {
      display: flex; align-items: center; gap: 0.6rem;
      padding: 0.55rem 0.75rem; border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.06);
      font-size: 0.8rem; color: #a1a1aa; transition: all 0.2s;
    }
    .pv-option.correct { border-color: rgba(88,204,2,0.25); background: rgba(88,204,2,0.05); }
    .pv-letter {
      width: 24px; height: 24px; border-radius: 6px;
      background: rgba(255,255,255,0.06); display: flex;
      align-items: center; justify-content: center;
      font-weight: 800; font-size: 0.72rem; color: #71717a; flex-shrink: 0;
    }
    .pv-option.correct .pv-letter { background: rgba(88,204,2,0.15); color: #86efac; }
    .pv-opt-img { max-width: 100%; max-height: 60px; object-fit: contain; border-radius: 4px; }

    @media (max-width: 900px) {
      .editor-grid { grid-template-columns: 1fr; }
      .preview-section { position: static; }
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

  TEMAS_POR_MATERIA: Record<MateriaId, string[]> = {
    'matematicas-m1': ['Números', 'Álgebra y Funciones', 'Geometría', 'Probabilidad y Estadística'],
    'matematicas-m2': ['Números', 'Álgebra y Funciones', 'Geometría', 'Probabilidad y Estadística'],
    'competencia-lectora': ['Rastrear y localizar', 'Relacionar e interpretar', 'Evaluar y reflexionar'],
    'ciencias-biologia': ['Organización, estructura y actividad celular', 'Procesos y funciones biológicas', 'Herencia y evolución', 'Organismo y ambiente'],
    'ciencias-fisica': ['Mecánica', 'Ondas', 'Energía', 'Electricidad y magnetismo'],
    'ciencias-quimica': ['Estructura atómica y enlaces', 'Química orgánica', 'Reacciones químicas y estequiometría'],
    'ciencias-tp': ['Biología TP', 'Física TP', 'Química TP'],
    'historia': ['Mundo, América y Chile', 'Formación Ciudadana', 'Economía y Sociedad']
  };

  form: {
    materiaId: MateriaId;
    tema: string;
    preambulo_texto: string;
    preambulo_imagen_url: string;
    enunciado: string;
    formula_latex: string;
    tipo_alternativas: 'texto' | 'imagen';
    alternativas: { A: string; B: string; C: string; D: string };
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
          alternativas: { ...pregunta.alternativas },
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
      this.form.alternativas.A.trim() &&
      this.form.alternativas.B.trim() &&
      this.form.alternativas.C.trim() &&
      this.form.alternativas.D.trim() &&
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
    return this.TEMAS_POR_MATERIA[materiaId] || [];
  }

  onMateriaChange() {
    this.form.tema = '';
  }
}
