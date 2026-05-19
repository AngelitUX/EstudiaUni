import { Component, inject, signal, computed, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PaesContentService } from './services/paes-content.service';
import { KatexService } from '../../core/services/katex.service';
import { SoundService } from '../../core/services/sound.service';

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

      <!-- QUESTION CARD (one at a time) -->
      <div class="question-area">
        <div class="question-counter">
          Pregunta {{ currentIndex() + 1 }} de {{ t.preguntas.length }}
        </div>

        <div class="question-card" *ngIf="currentQuestion() as q">
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
        <button class="btn-secondary" (click)="prevQuestion()" [disabled]="currentIndex() === 0 || showFeedback()">
          ← Anterior
        </button>

        <div class="dot-indicators">
          <span *ngFor="let p of t.preguntas; let i = index"
            class="dot"
            [class.answered]="answers().has(p.id)"
            [class.current]="i === currentIndex()"
            (click)="!showFeedback() && goToQuestion(i)"></span>
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
    .context-toggle { display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 0.85rem 1.15rem; background: transparent; border: none; font-size: 0.88rem; font-weight: 600; color: var(--text-primary); cursor: pointer; }
    .toggle-arrow { font-size: 0.7rem; color: var(--text-secondary); }
    .context-body { padding: 0 1.15rem 1rem; }
    .context-body p { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.7; margin: 0; font-style: italic; }

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
  private paes = inject(PaesContentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private katex = inject(KatexService);
  private sanitizer = inject(DomSanitizer);
  private soundSvc = inject(SoundService);

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

  ngOnInit() {
    this.seccionId.set(this.route.snapshot.paramMap.get('seccionId') || '');
    this.timer.set(0);
    this.intervalId = setInterval(() => this.timer.update(v => v + 1), 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  selectAnswer(preguntaId: number, option: 'A' | 'B' | 'C' | 'D') {
    if (this.showFeedback()) return;
    const newMap = new Map(this.answers());
    newMap.set(preguntaId, option);
    this.answers.set(newMap);
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
    if (this.isCurrentCorrect()) {
      this.soundSvc.playCorrect();
    } else {
      this.soundSvc.playWrong();
    }
    this.showFeedback.set(true);
  }

  nextQuestion() {
    this.showFeedback.set(false);
    this.currentIndex.update(v => v + 1);
  }

  prevQuestion() {
    this.showFeedback.set(false);
    this.currentIndex.update(v => Math.max(0, v - 1));
  }

  goToQuestion(index: number) {
    this.showFeedback.set(false);
    this.currentIndex.set(index);
  }

  isLastQuestion(): boolean {
    return this.currentIndex() === this.totalQuestions() - 1;
  }

  submitTest() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.paes.submitTest(this.seccionId(), this.answers());
    this.router.navigate(['/test', this.seccionId(), 'review']);
  }

  confirmExit() {
    if (confirm('¿Seguro que quieres salir? Perderás tu progreso.')) {
      if (this.intervalId) clearInterval(this.intervalId);
      window.history.back();
    }
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  renderLatex(latex: string | null): SafeHtml {
    if (!latex) return '';
    return this.katex.render(latex);
  }

  parseMixed(text: string | null | undefined): SafeHtml {
    if (!text) return '';
    const renderedSafe = this.katex.renderMixedText(text);
    const rendered = (renderedSafe as any)?.changingThisBreaksApplicationSecurity || String(renderedSafe);
    const bolded = rendered.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
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