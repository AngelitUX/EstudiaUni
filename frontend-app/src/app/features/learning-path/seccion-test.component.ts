import { Component, inject, signal, computed, OnInit, OnDestroy, HostListener, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PaesContentService } from './services/paes-content.service';
import { KatexService } from '../../core/services/katex.service';
import { ToastService } from '../../core/services/toast.service';


@Component({
  selector: 'app-seccion-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="test-page" *ngIf="test() as t">
      <!-- TOP BAR -->
      <div class="top-bar">
        <button class="btn-close" (click)="confirmExit()" title="Salir">✕</button>
        <div class="top-progress">
          <div class="top-progress-fill" [style.width.%]="progressPct()"></div>
        </div>
        <div class="top-timer" [class.urgent]="timer() >= 300">{{ formatTime(timer()) }}</div>
      </div>

      <!-- CONTEXTO BASE -->
      <div class="context-section" *ngIf="t.contexto_base">
        <button class="context-toggle" (click)="contextCollapsed = !contextCollapsed">
          <span>📄 Texto de referencia</span>
          <span class="toggle-arrow" [style.transform]="contextCollapsed ? 'rotate(0)' : 'rotate(180deg)'">▼</span>
        </button>
        <div class="context-wrapper" [class.collapsed]="contextCollapsed">
          <div class="context-body">
            <p *ngFor="let p of getFormattedParagraphs(getActiveContexto(t))">
              <span class="p-num" *ngIf="!p.isTitle">[{{ p.number }}]</span>
              <span class="p-text" [class.p-title]="p.isTitle" [innerHTML]="parseMixed(p.text)"></span>
            </p>
          </div>
        </div>
      </div>

      <!-- QUESTION CARD (one at a time) -->
      <div class="question-area">
        <div class="question-counter">
          Pregunta {{ currentIndex() + 1 }} de {{ t.preguntas.length }}
        </div>

        <div class="question-card" *ngIf="currentQuestion() as q">
          
          <!-- VOICE CONTROLS (Collapsible) -->
          <div class="voice-dropdown-container" *ngIf="!isMathModule()">
            <button class="btn-voice-toggle" (click)="voiceMenuOpen = !voiceMenuOpen">
              🎧 Audio descriptivo <span class="arrow" [class.open]="voiceMenuOpen">▼</span>
            </button>
            <div class="voice-dropdown-menu" [class.open]="voiceMenuOpen">
              <button class="btn-voice" *ngIf="t.contexto_base" (click)="readContext()" title="Texto de referencia (Tecla 1)">🔊 1. Texto referencia</button>
              <button class="btn-voice" (click)="readQuestion()" title="Leer enunciado (Tecla 2)">🔊 2. Enunciado</button>
              <button class="btn-voice" (click)="readOptions()" *ngIf="q.tipo_alternativas !== 'imagen'" title="Leer alternativas (Tecla 3)">🔊 3. Alternativas</button>
              <button class="btn-voice" (click)="readFeedback()" *ngIf="showFeedback()" title="Leer explicación (Tecla 5)">🔊 5. Explicación</button>
              <button class="btn-voice btn-stop" (click)="stopReading()" title="Detener lectura (Tecla 4)">⏹️ 4. Detener</button>
            </div>
          </div>

          <!-- Preámbulo texto (Historia/Ciencias) -->
          <div class="q-preambulo" *ngIf="q.preambulo_texto">
            <span class="preambulo-icon">💬</span>
            <p>{{ q.preambulo_texto }}</p>
          </div>

          <!-- Preámbulo imagen (Ciencias/Matemáticas) -->
          <div class="q-image-wrap" *ngIf="q.preambulo_imagen_url">
            <img [src]="q.preambulo_imagen_url" alt="Imagen de apoyo" class="q-image" />
          </div>

          <p class="q-text" [innerHTML]="parseMixed(q.enunciado)"></p>

          <!-- Fórmula LaTeX (Matemáticas) -->
          <div class="q-formula" *ngIf="q.formula_latex"
            [innerHTML]="renderLatex(q.formula_latex)">
          </div>

          <div class="options-grid">
            <button *ngFor="let key of optionKeys"
              class="option-btn"
              [class.selected]="answers().get(q.id) === key"
              [class.correct]="showFeedback() && key === q.respuesta_correcta"
              [class.wrong]="showFeedback() && answers().get(q.id) === key && key !== q.respuesta_correcta"
              [disabled]="showFeedback()"
              (click)="selectAnswer(q.id, key)">
              <span class="opt-letter" [class.sel]="answers().get(q.id) === key">{{ key }}</span>
              <span class="opt-text" *ngIf="q.tipo_alternativas !== 'imagen'" [innerHTML]="parseMixed(q.alternativas[key])"></span>
              <img *ngIf="q.tipo_alternativas === 'imagen'" [src]="q.alternativas[key]"
                alt="Opción {{ key }}" class="opt-img" />
            </button>
          </div>

          <!-- FEEDBACK -->
          <div class="feedback-bar" *ngIf="showFeedback()"
            [class.correct]="isCurrentCorrect()"
            [class.wrong]="!isCurrentCorrect()">
            <div class="feedback-icon">{{ isCurrentCorrect() ? '✅' : '❌' }}</div>
            <div class="feedback-body">
              <strong>{{ isCurrentCorrect() ? '¡Correcto!' : 'Incorrecto' }}</strong>
              <p [innerHTML]="parseMixed(isCurrentCorrect() ? currentQuestion()!.feedback_acierto : currentQuestion()!.feedback_error)"></p>
            </div>
          </div>
        </div>
      </div>

      <!-- BOTTOM BAR -->
      <div class="bottom-bar">
        <div style="visibility: hidden; pointer-events: none;">
          <button class="btn-secondary">← Anterior</button>
        </div>

        <div class="dot-indicators">
          <span *ngFor="let p of t.preguntas; let i = index"
            class="dot"
            [class.answered]="answers().has(p.id)"
            [class.current]="i === currentIndex()"></span>
        </div>

        <ng-container *ngIf="!showFeedback()">
          <button class="btn-check" (click)="checkAnswer()" [disabled]="!hasCurrentAnswer()">
            Comprobar
          </button>
        </ng-container>
        <ng-container *ngIf="showFeedback()">
          <button class="btn-next" *ngIf="!isLastQuestion()" (click)="nextQuestion()">
            Continuar →
          </button>
          <button class="btn-finish" *ngIf="isLastQuestion()" (click)="submitTest()">
            Ver Resultados 🎉
          </button>
        </ng-container>
      </div>

      <!-- EXIT CONFIRM MODAL -->
      <div class="modal-overlay" *ngIf="showExitConfirm" (click)="showExitConfirm = false">
        <div class="modal-container glass" (click)="$event.stopPropagation()">
          <h3>¿Seguro que quieres salir?</h3>
          <p>Si sales ahora, perderás todo el progreso de esta prueba y tendrás que empezar de nuevo.</p>
          <div class="modal-actions">
            <button class="btn-cancel" (click)="showExitConfirm = false">Cancelar</button>
            <button class="btn-confirm-exit" (click)="executeExit()">Sí, salir</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: #f8f9fa; color: var(--text-primary); }
    .test-page { min-height: 100vh; display: flex; flex-direction: column; }

    /* TOP BAR */
    .top-bar { position: sticky; top: 0; z-index: 50; display: flex; align-items: center; gap: 1rem; padding: 0.85rem 1.5rem; background: #fff; border-bottom: 2px solid rgba(0,0,0,0.06); }
    .btn-close { width: 36px; height: 36px; border-radius: 50%; border: 2px solid rgba(0,0,0,0.1); background: transparent; color: var(--text-secondary); font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0; }
    .btn-close:hover { border-color: #ef4444; color: #ef4444; background: rgba(239,68,68,0.05); }
    .top-progress { flex: 1; height: 14px; background: rgba(0,0,0,0.06); border-radius: 99px; overflow: hidden; }
    .top-progress-fill { height: 100%; background: linear-gradient(90deg, #58cc02, #78d64b); border-radius: 99px; transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1); position: relative; }
    .top-progress-fill::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(255,255,255,0.35) 0%, transparent 60%); border-radius: 99px; }
    .top-timer { font-family: var(--font-heading); font-weight: 700; font-size: 0.9rem; color: var(--text-secondary); min-width: 52px; text-align: center; }
    .top-timer.urgent { color: #ef4444; animation: urgentPulse 1s ease-in-out infinite; }

    /* CONTEXT */
    .context-section { margin: 0.75rem 1.5rem 0; background: #fff; border: 2px solid rgba(0,0,0,0.06); border-radius: 14px; overflow: hidden; }
    .context-toggle { display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 0.85rem 1.15rem; background: transparent; border: none; font-size: 0.88rem; font-weight: 600; color: var(--text-primary); cursor: pointer; transition: background 0.2s; }
    .context-toggle:hover { background: rgba(0,0,0,0.02); }
    .toggle-arrow { font-size: 0.75rem; color: var(--text-secondary); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
    .context-wrapper { display: grid; grid-template-rows: 1fr; transition: grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
    .context-wrapper.collapsed { grid-template-rows: 0fr; }
    .context-body { overflow: hidden; padding: 0 1.15rem 1rem; }
    .context-body p { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.7; margin: 0 0 0.85rem; font-style: italic; display: flex; gap: 0.5rem; align-items: flex-start; }
    .context-body p:last-child { margin-bottom: 0; }
    .p-text { flex: 1; }
    .p-text.p-title { font-family: var(--font-heading); font-size: 1rem; font-weight: 800; color: var(--accent-primary); font-style: normal; margin-top: 0.75rem; margin-bottom: 0.25rem; display: block; border-bottom: 2px solid rgba(133,92,214,0.15); padding-bottom: 0.35rem; }
    .context-wrapper.collapsed .context-body { padding-top: 0; padding-bottom: 0; opacity: 0; transition: opacity 0.2s, padding 0.3s; }
    .context-wrapper:not(.collapsed) .context-body { opacity: 1; transition: opacity 0.3s 0.1s, padding 0.3s; }

    /* QUESTION AREA */
    .question-area { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 1.5rem; }
    .question-counter { font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 1rem; }

    .question-card { background: #fff; border: 2px solid rgba(0,0,0,0.06); border-radius: 20px; padding: 2rem; max-width: 850px; width: 100%; animation: slideUp 0.35s ease-out; }
    .q-text { font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; color: var(--text-primary); line-height: 1.5; margin: 0 0 1.5rem; }

    .q-image-wrap { margin: 0 0 1.5rem; text-align: center; background: #f8f9fa; border-radius: 12px; padding: 1rem; border: 1px solid rgba(0,0,0,0.05); }
    .q-image { max-width: 100%; max-height: 250px; object-fit: contain; border-radius: 8px; }

    /* PREAMBULO */
    .q-preambulo { display: flex; gap: 0.8rem; padding: 1.25rem; margin: 0 0 1.5rem; background: rgba(133,92,214,0.04); border-radius: 12px; border-left: 4px solid rgba(133,92,214,0.4); }
    .q-preambulo p { font-size: 1.05rem; color: var(--text-secondary); line-height: 1.7; margin: 0; font-style: italic; }
    .preambulo-icon { font-size: 1.1rem; flex-shrink: 0; }

    /* FORMULA */
    .q-formula { margin: 0 0 1.25rem; padding: 0.75rem 1rem; background: #f0fdf4; border: 1px solid rgba(22,163,74,0.15); border-radius: 10px; text-align: center; }
    .q-formula code { font-family: 'Courier New', monospace; font-size: 1rem; color: #166534; font-weight: 600; }

    /* IMAGE OPTIONS */
    .opt-img { max-width: 100%; max-height: 80px; object-fit: contain; border-radius: 6px; }

    /* OPTIONS */
    .options-grid { display: flex; flex-direction: column; gap: 0.8rem; }
    .option-btn { display: flex; align-items: center; gap: 1rem; padding: 1.15rem 1.25rem; border: 2px solid rgba(0,0,0,0.08); border-radius: 14px; background: #fff; cursor: pointer; transition: all 0.2s; text-align: left; width: 100%; }
    .option-btn:hover:not(:disabled):not(.selected) { border-color: rgba(133,92,214,0.3); background: rgba(133,92,214,0.03); transform: translateX(4px); }
    .option-btn.selected { border-color: var(--accent-primary); background: rgba(133,92,214,0.06); box-shadow: 0 0 0 3px rgba(133,92,214,0.12); }
    .option-btn.correct { border-color: #58cc02; background: rgba(88,204,2,0.08); box-shadow: 0 0 0 3px rgba(88,204,2,0.15); }
    .option-btn.wrong { border-color: #ef4444; background: rgba(239,68,68,0.06); box-shadow: 0 0 0 3px rgba(239,68,68,0.12); }
    .opt-letter { width: 36px; height: 36px; border-radius: 8px; border: 2px solid rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; font-family: var(--font-heading); font-weight: 800; font-size: 0.95rem; color: var(--text-secondary); flex-shrink: 0; transition: all 0.2s; }
    .opt-letter.sel { background: var(--accent-primary); border-color: var(--accent-primary); color: #fff; }
    .option-btn.correct .opt-letter { background: #58cc02; border-color: #58cc02; color: #fff; }
    .option-btn.wrong .opt-letter { background: #ef4444; border-color: #ef4444; color: #fff; }
    .opt-text { font-size: 1.05rem; color: var(--text-primary); line-height: 1.5; }

    /* FEEDBACK */
    .feedback-bar { display: flex; align-items: flex-start; gap: 0.85rem; padding: 1.15rem; border-radius: 14px; margin-top: 1.25rem; animation: slideUp 0.3s ease-out; }
    .feedback-bar.correct { background: rgba(88,204,2,0.08); border: 1px solid rgba(88,204,2,0.2); }
    .feedback-bar.wrong { background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.15); }
    .feedback-icon { font-size: 1.4rem; flex-shrink: 0; margin-top: 0.1rem; }
    .feedback-body strong { display: block; font-family: var(--font-heading); font-size: 0.95rem; margin-bottom: 0.3rem; }
    .feedback-bar.correct strong { color: #3d8c00; }
    .feedback-bar.wrong strong { color: #dc2626; }
    .feedback-body p { font-size: 0.85rem; color: var(--text-secondary); margin: 0; line-height: 1.5; }

    /* BOTTOM BAR */
    .bottom-bar { position: sticky; bottom: 0; display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 0.85rem 1.5rem; background: #fff; border-top: 2px solid rgba(0,0,0,0.06); z-index: 50; }
    .btn-secondary { padding: 0.7rem 1.2rem; border-radius: 12px; border: 2px solid rgba(0,0,0,0.08); background: #fff; color: var(--text-secondary); font-weight: 700; font-size: 0.88rem; cursor: pointer; transition: all 0.2s; }
    .btn-secondary:hover:not(:disabled) { border-color: var(--accent-primary); color: var(--accent-primary); }
    .btn-secondary:disabled { opacity: 0.3; cursor: not-allowed; }
    .dot-indicators { display: flex; gap: 6px; }
    .dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(0,0,0,0.1); cursor: pointer; transition: all 0.2s; }
    .dot.answered { background: var(--accent-primary); }
    .dot.current { background: var(--accent-primary); transform: scale(1.3); box-shadow: 0 0 0 3px rgba(133,92,214,0.2); }
    .btn-check { padding: 0.75rem 1.5rem; border-radius: 12px; border: none; background: var(--accent-primary); color: #fff; font-weight: 700; font-size: 0.95rem; cursor: pointer; box-shadow: 0 4px 0 #6b46b8; transition: all 0.2s; }
    .btn-check:hover:not(:disabled) { transform: translateY(2px); box-shadow: 0 2px 0 #6b46b8; }
    .btn-check:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
    .btn-next { padding: 0.75rem 1.5rem; border-radius: 12px; border: none; background: #58cc02; color: #fff; font-weight: 700; font-size: 0.95rem; cursor: pointer; box-shadow: 0 4px 0 #4caf00; transition: all 0.2s; }
    .btn-next:hover { transform: translateY(2px); box-shadow: 0 2px 0 #4caf00; }
    .btn-finish { padding: 0.75rem 1.5rem; border-radius: 12px; border: none; background: linear-gradient(135deg, #ffc800, #ff9600); color: #fff; font-weight: 700; font-size: 0.95rem; cursor: pointer; box-shadow: 0 4px 0 #cc7a00; transition: all 0.2s; }
    .btn-finish:hover { transform: translateY(2px); box-shadow: 0 2px 0 #cc7a00; }

    /* VOICE CONTROLS */
    .voice-dropdown-container { margin-bottom: 1.5rem; }
    .btn-voice-toggle { display: flex; align-items: center; gap: 0.5rem; background: rgba(133,92,214,0.08); border: 2px solid rgba(133,92,214,0.2); color: var(--accent-primary); border-radius: 8px; padding: 0.45rem 0.8rem; font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
    .btn-voice-toggle:hover { background: rgba(133,92,214,0.15); }
    .btn-voice-toggle .arrow { font-size: 0.7rem; transition: transform 0.2s; }
    .btn-voice-toggle .arrow.open { transform: rotate(180deg); }
    .voice-dropdown-menu { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem; max-height: 0; opacity: 0; overflow: hidden; transition: all 0.3s ease-in-out; }
    .voice-dropdown-menu.open { max-height: 100px; opacity: 1; }
    .btn-voice { background: #fff; border: 1px solid rgba(133,92,214,0.3); color: var(--accent-primary); border-radius: 8px; padding: 0.4rem 0.7rem; font-size: 0.8rem; font-weight: 700; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
    .btn-voice:hover { background: var(--accent-primary); color: #fff; border-color: var(--accent-primary); transform: translateY(-1px); box-shadow: 0 2px 4px rgba(133,92,214,0.2); }
    .btn-stop { background: #fff; border-color: rgba(239,68,68,0.3); color: #ef4444; }
    .btn-stop:hover { background: #ef4444; color: #fff; border-color: #ef4444; }

    /* MODAL EXIT */
    .modal-overlay { position: fixed; inset: 0; z-index: 9000; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.55); backdrop-filter: blur(8px); animation: fadeOverlay 0.2s ease; }
    .modal-container { width: min(400px, 90vw); background: #fff; border-radius: 16px; padding: 1.5rem; text-align: center; border: 2px solid rgba(0,0,0,0.08); box-shadow: 0 10px 25px rgba(0,0,0,0.15); animation: scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
    .modal-container h3 { margin: 0 0 0.5rem; font-size: 1.25rem; color: var(--text-primary); font-family: var(--font-heading); }
    .modal-container p { margin: 0 0 1.5rem; color: var(--text-secondary); font-size: 0.95rem; line-height: 1.5; }
    .modal-actions { display: flex; gap: 0.75rem; justify-content: stretch; }
    .modal-actions button { flex: 1; padding: 0.75rem; border-radius: 10px; font-weight: 700; font-size: 0.95rem; cursor: pointer; transition: all 0.2s; border: none; }
    .btn-cancel { background: rgba(0,0,0,0.06); color: var(--text-primary); }
    .btn-cancel:hover { background: rgba(0,0,0,0.1); }
    .btn-confirm-exit { background: #ef4444; color: #fff; box-shadow: 0 4px 0 #b91c1c; }
    .btn-confirm-exit:hover { transform: translateY(2px); box-shadow: 0 2px 0 #b91c1c; }

    @keyframes fadeOverlay { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes urgentPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

    @media (max-width: 640px) {
      .question-card { padding: 1.25rem; }
      .q-text { font-size: 1rem; }
      .bottom-bar { padding: 0.75rem 1rem; }
      .dot-indicators { gap: 4px; }
      .dot { width: 8px; height: 8px; }
    }
  `]
})
export class SeccionTestComponent implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private paes = inject(PaesContentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private katex = inject(KatexService);
  private sanitizer = inject(DomSanitizer);
  private toastSvc = inject(ToastService);


  optionKeys: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];

  seccionId = signal('');
  seccion = computed(() => this.paes.getSeccionById(this.seccionId()));
  test = computed(() => this.paes.getTestBySeccionId(this.seccionId()));
  answers = signal(new Map<number, 'A' | 'B' | 'C' | 'D'>());
  timer = signal(0);
  private intervalId: any;

  currentIndex = signal(0);
  showFeedback = signal(false);
  contextCollapsed = false;
  voiceMenuOpen = false;
  showExitConfirm = false;

  isMathModule = computed(() => {
    const mId = this.seccion()?.materiaId;
    return mId ? mId.toLowerCase().includes('mat') : false;
  });

  currentQuestion = computed(() => {
    const t = this.test();
    return t ? t.preguntas[this.currentIndex()] : undefined;
  });

  totalQuestions = computed(() => this.test()?.preguntas.length || 0);
  answeredCount = computed(() => this.answers().size);

  progressPct = computed(() => {
    const t = this.totalQuestions();
    return t > 0 ? Math.round(((this.currentIndex() + (this.showFeedback() ? 1 : 0)) / t) * 100) : 0;
  });

  private getStorageKey(): string {
    return `paes_test_state_${this.seccionId()}`;
  }

  private saveState() {
    if (!isPlatformBrowser(this.platformId)) return;
    const state = {
      answers: Array.from(this.answers().entries()),
      currentIndex: this.currentIndex(),
      showFeedback: this.showFeedback(),
      timer: this.timer()
    };
    sessionStorage.setItem(this.getStorageKey(), JSON.stringify(state));
  }

  private loadState() {
    if (!isPlatformBrowser(this.platformId)) return;
    const saved = sessionStorage.getItem(this.getStorageKey());
    if (saved) {
      try {
        const state = JSON.parse(saved);
        if (state.answers) {
          this.answers.set(new Map(state.answers));
        }
        if (typeof state.currentIndex === 'number') {
          this.currentIndex.set(state.currentIndex);
        }
        if (typeof state.showFeedback === 'boolean') {
          this.showFeedback.set(state.showFeedback);
        }
        if (typeof state.timer === 'number') {
          this.timer.set(state.timer);
        }
      } catch (e) {
        console.warn('Error loading test state', e);
      }
    }
  }

  ngOnInit() {
    this.seccionId.set(this.route.snapshot.paramMap.get('seccionId') || '');
    this.loadState();
    if (this.timer() === 0) {
      this.timer.set(0);
    }
    this.intervalId = setInterval(() => {
      this.timer.update(v => v + 1);
      // Guardar el estado cada 5 segundos para que el timer persista bien
      if (this.timer() % 5 === 0) {
        this.saveState();
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.stopReading();
  }

  // ==========================================
  // TEXT TO SPEECH (ACCESSIBILITY)
  // ==========================================
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Solo si no estamos escribiendo en un input (por si acaso)
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
    
    const key = event.key.toLowerCase();
    
    if (!this.isMathModule()) {
      if (key === '1') this.readContext();
      if (key === '2') this.readQuestion();
      if (key === '3') this.readOptions();
      if (key === '5') this.readFeedback();
      if (key === '4' || key === 'escape' || key === 's') this.stopReading();
    }

    // Siguiente pregunta con espacio
    if (key === ' ' || key === 'spacebar') {
      if (this.showFeedback()) {
        event.preventDefault(); // Evitar scroll
        if (!this.isLastQuestion()) {
          this.nextQuestion();
        } else {
          this.submitTest();
        }
      }
    }
  }

  private cleanHtml(html: string): string {
    if (!html) return '';
    // Elimina las comillas y caracteres extraños
    let text = html.replace(/&quot;/g, '"');
    // Reemplaza los saltos de línea HTML por puntos para que el lector haga pausas
    text = text.replace(/<br\s*\/?>/gi, '. ');
    // Elimina todas las etiquetas HTML
    text = text.replace(/<[^>]*>?/gm, '');
    // Elimina emojis (para que el lector no diga sus nombres)
    text = text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '');
    // Elimina asteriscos de markdown (**negrita**)
    text = text.replace(/\*/g, '');
    return text.trim();
  }

  private getBestVoice(): SpeechSynthesisVoice | null {
    const voices = window.speechSynthesis.getVoices();
    // Prefer Google's neural Spanish voices (Android/Chrome)
    let voice = voices.find(v => v.name.includes('Google') && v.lang.startsWith('es'));
    // Fallback to Microsoft voices (Windows)
    if (!voice) voice = voices.find(v => v.name.includes('Microsoft') && (v.name.includes('Helena') || v.name.includes('Laura') || v.name.includes('Pablo')));
    // Fallback to any Spanish voice
    if (!voice) voice = voices.find(v => v.lang.startsWith('es-') || v.lang === 'es');
    return voice || null;
  }

  private speak(text: string) {
    if (!('speechSynthesis' in window)) {
      this.toastSvc.error('Tu navegador no soporta lectura de voz.');
      return;
    }
    window.speechSynthesis.cancel();
    
    // Si el texto es muy largo, algunos navegadores fallan. Lo ideal sería partirlo, 
    // pero para las alternativas/enunciados esto funciona bien.
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Mejoras para que suene más natural
    utterance.lang = 'es-ES'; // Default fallback
    utterance.rate = 0.95; // Un poco más lento para mejor dicción
    utterance.pitch = 1.05; // Tono ligeramente más alto suele ser más claro
    
    const voice = this.getBestVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }

    window.speechSynthesis.speak(utterance);
  }

  readContext() {
    const t = this.test();
    if (!t || !t.contexto_base) return;
    const activeContext = this.getActiveContexto(t);
    const text = this.cleanHtml(activeContext);
    this.speak(text);
  }

  readQuestion() {
    const q = this.currentQuestion();
    if (!q) return;
    let text = this.cleanHtml(q.enunciado);
    if (q.preambulo_texto) {
      text = q.preambulo_texto + '. ' + text;
    }
    this.speak(text);
  }

  readOptions() {
    const q = this.currentQuestion();
    if (!q || q.tipo_alternativas === 'imagen') return;
    
    let text = '';
    for (const key of this.optionKeys) {
      if (q.alternativas[key]) {
        text += `Opción ${key}: ${this.cleanHtml(q.alternativas[key])}. `;
      }
    }
    this.speak(text);
  }

  readFeedback() {
    if (!this.showFeedback()) return;
    const q = this.currentQuestion();
    if (!q) return;
    
    const isCorrect = this.isCurrentCorrect();
    const intro = isCorrect ? '¡Correcto! ' : 'Incorrecto. ';
    const text = this.cleanHtml(isCorrect ? q.feedback_acierto : q.feedback_error);
    
    this.speak(intro + text);
  }

  stopReading() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  selectAnswer(preguntaId: number, option: 'A' | 'B' | 'C' | 'D') {
    if (this.showFeedback()) return;
    const newMap = new Map(this.answers());
    newMap.set(preguntaId, option);
    this.answers.set(newMap);
    this.saveState();
  }

  hasCurrentAnswer(): boolean {
    const q = this.currentQuestion();
    return q ? this.answers().has(q.id) : false;
  }

  isCurrentCorrect(): boolean {
    const q = this.currentQuestion();
    if (!q) return false;
    return this.answers().get(q.id) === q.respuesta_correcta;
  }

  checkAnswer() {
    this.stopReading();
    if (this.isCurrentCorrect()) {
      this.toastSvc.success('¡Respuesta correcta!');
    } else {
      this.toastSvc.error('Respuesta incorrecta');
    }
    this.showFeedback.set(true);
    this.saveState();
  }

  nextQuestion() {
    this.showFeedback.set(false);
    this.currentIndex.update(v => v + 1);
    this.saveState();
  }

  isLastQuestion(): boolean {
    return this.currentIndex() === this.totalQuestions() - 1;
  }

  submitTest() {
    if (this.intervalId) clearInterval(this.intervalId);
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem(this.getStorageKey());
    }
    this.paes.submitTest(this.seccionId(), this.answers());
    this.router.navigate(['/test', this.seccionId(), 'review']);
  }

  confirmExit() {
    this.showExitConfirm = true;
  }

  executeExit() {
    this.showExitConfirm = false;
    if (this.intervalId) clearInterval(this.intervalId);
    const cap = this.paes.getCapituloBySeccionId(this.seccionId());
    if (cap) {
      this.router.navigate(['/ruta', cap.materiaId], { fragment: this.seccionId() });
    } else {
      const sec = this.seccion();
      if (sec) {
        this.router.navigate(['/ruta', sec.materiaId], { fragment: this.seccionId() });
      } else {
        this.router.navigate(['/ruta']);
      }
    }
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  getActiveContexto(test: any): string {
    if (!test || !test.contexto_base) return '';
    const q = this.currentQuestion();
    const activeTextIndex = q?.texto_index ?? 0;

    if (test.contexto_base.includes('--- DIVISION_TEXTOS ---')) {
      const textos = test.contexto_base.split('--- DIVISION_TEXTOS ---').map((t: string) => t.trim());
      return textos[activeTextIndex] || textos[0] || '';
    }

    return test.contexto_base;
  }

  getFormattedParagraphs(text: string | null | undefined): { text: string; isTitle: boolean; number?: number }[] {
    if (!text) return [];
    const rawParagraphs = text.split('\n\n')
      .map(p => p.trim())
      .filter(p => p !== '' && p !== '--- DIVISION_TEXTOS ---');

    let paragraphCount = 0;
    return rawParagraphs.map(p => {
      const isTitle = p.startsWith('📖') || p.startsWith('TEXTO') || p.includes('TEXTO I') || p.includes('TEXTO II');
      if (isTitle) {
        paragraphCount = 0;
        return { text: p, isTitle: true };
      } else {
        paragraphCount++;
        return { text: p, isTitle: false, number: paragraphCount };
      }
    });
  }

  getParagraphs(text: string | null | undefined): string[] {
    if (!text) return [];
    return text.split('\n\n').map(p => p.trim()).filter(p => p !== '');
  }

  renderLatex(latex: string | null): SafeHtml {
    if (!latex) return '';
    return this.katex.render(latex);
  }

  parseMixed(text: string | null | undefined): SafeHtml {
    if (!text) return '';
    const renderedSafe = this.katex.renderMixedText(text);
    const rendered = (renderedSafe as any)?.changingThisBreaksApplicationSecurity || String(renderedSafe);
    const bolded = rendered.replace(/\*\*(.*?)\*\*/gs, '<strong>$1</strong>');
    const withBreaks = bolded.replace(/&lt;br&gt;/g, '<br>');
    return this.sanitizer.bypassSecurityTrustHtml(withBreaks);
  }
  /*
    // =========================================================================
    // 🚧 ONLY FOR TESTING - KEYBOARD CONTROLS (EASY TO DELETE LATER)
    // =========================================================================
    @HostListener('window:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
      const key = event.key.toLowerCase();
  
      // Select alternative
      if (key === 'z') this.selectAnswerForCurrent('A');
      if (key === 'x') this.selectAnswerForCurrent('B');
      if (key === 'c') this.selectAnswerForCurrent('C');
      if (key === 'v') this.selectAnswerForCurrent('D');
  
      // Check answer or go to next (Enter or Right Arrow)
      if (key === 'arrowright' || key === 'enter') {
        if (!this.showFeedback() && this.hasCurrentAnswer()) {
          this.checkAnswer();
        } else if (this.showFeedback()) {
          if (!this.isLastQuestion()) {
            this.nextQuestion();
          } else {
            this.submitTest();
          }
        }
      }
    }
  
    private selectAnswerForCurrent(option: 'A' | 'B' | 'C' | 'D') {
      const q = this.currentQuestion();
      if (q) {
        this.selectAnswer(q.id, option);
      }
    }
      */
}
