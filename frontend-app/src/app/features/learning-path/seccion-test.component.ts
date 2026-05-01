import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PaesContentService } from './services/paes-content.service';
import { PreguntaTest } from './models/paes.models';

@Component({
  selector: 'app-seccion-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="test-page" *ngIf="test() as t">
      <!-- HEADER -->
      <div class="test-header">
        <div class="test-header-left">
          <span class="test-label">EVALUACIÓN</span>
          <h2>Test — {{ seccion()?.title }}</h2>
        </div>
        <div class="test-timer">⏱ {{ formatTime(timer()) }}</div>
      </div>

      <!-- QUESTIONS -->
      <div class="questions-scroll">
        <div *ngFor="let p of t.preguntas; let i = index" class="question-card" [id]="'q-'+p.id">
          <div class="question-header">
            <span class="q-number">{{ i + 1 }}. {{ p.enunciado }}</span>
          </div>

          <p class="q-instruction">▶ Selecciona 1 opción</p>
          <p class="q-mark">Marca una sola alternativa.</p>

          <div class="options-list">
            <label *ngFor="let key of optionKeys" class="option-item"
              [class.selected]="answers().get(p.id) === key"
              (click)="selectAnswer(p.id, key)">
              <span class="option-radio" [class.checked]="answers().get(p.id) === key"></span>
              <span class="option-text">{{ p.alternativas[key] }}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- FOOTER -->
      <div class="test-footer">
        <div class="footer-left">
          <span class="footer-timer">Tiempo restante</span>
          <strong>{{ formatTime(timer()) }}</strong>
        </div>
        <div class="footer-center">
          <div class="footer-progress-bar">
            <div class="footer-progress-fill" [style.width.%]="answeredPct()"></div>
          </div>
        </div>
        <div class="footer-right">
          <span>Respondidas <strong>{{ answeredCount() }} / {{ totalQuestions() }}</strong></span>
          <button class="btn-submit" (click)="submitTest()" [disabled]="submitting()">
            {{ submitting() ? 'Enviando...' : 'Enviar respuestas' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: var(--bg-color, #fdf9f1); }
    .test-page { max-width: 800px; margin: 0 auto; padding: 1.5rem 1.5rem 7rem; }

    .test-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; gap: 1rem; flex-wrap: wrap; }
    .test-label { display: inline-block; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--accent-primary); background: rgba(133,92,214,0.1); padding: 0.2rem 0.6rem; border-radius: 6px; margin-bottom: 0.3rem; }
    .test-header h2 { font-family: var(--font-heading); font-size: 1.4rem; font-weight: 700; color: var(--text-primary); margin: 0; }
    .test-timer { font-family: monospace; font-size: 1.1rem; background: rgba(133,92,214,0.08); padding: 0.5rem 1rem; border-radius: 10px; color: var(--accent-primary); font-weight: 600; border: 1px solid rgba(133,92,214,0.2); }

    .questions-scroll { display: flex; flex-direction: column; gap: 1.5rem; }

    .question-card { background: #fff; border: 2px solid rgba(0,0,0,0.06); border-radius: 16px; padding: 1.5rem 1.75rem; }
    .question-header { margin-bottom: 0.75rem; }
    .q-number { font-family: var(--font-heading); font-size: 1.05rem; font-weight: 600; color: var(--text-primary); line-height: 1.5; }
    .q-instruction { font-size: 0.8rem; color: var(--accent-primary); font-weight: 600; margin: 0 0 0.15rem; }
    .q-mark { font-size: 0.78rem; color: var(--text-secondary); margin: 0 0 1rem; font-style: italic; }

    .options-list { display: flex; flex-direction: column; gap: 0.5rem; }
    .option-item { display: flex; align-items: center; gap: 0.85rem; padding: 0.9rem 1.1rem; border: 2px solid rgba(0,0,0,0.06); border-radius: 12px; cursor: pointer; transition: all 0.2s; font-size: 0.95rem; color: var(--text-primary); }
    .option-item:hover { border-color: rgba(133,92,214,0.3); background: rgba(133,92,214,0.03); }
    .option-item.selected { border-color: var(--accent-primary); background: rgba(133,92,214,0.06); }
    .option-radio { width: 20px; height: 20px; border-radius: 50%; border: 2px solid rgba(0,0,0,0.15); flex-shrink: 0; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
    .option-radio.checked { border-color: var(--accent-primary); background: var(--accent-primary); }
    .option-radio.checked::after { content: ''; width: 8px; height: 8px; border-radius: 50%; background: #fff; }
    .option-text { flex: 1; line-height: 1.4; }

    /* FOOTER */
    .test-footer { position: fixed; bottom: 0; left: 0; right: 0; background: #fff; border-top: 2px solid rgba(0,0,0,0.06); padding: 0.75rem 2rem; display: flex; align-items: center; gap: 1.5rem; z-index: 50; }
    .footer-left { display: flex; flex-direction: column; font-size: 0.8rem; color: var(--text-secondary); }
    .footer-left strong { font-size: 1.1rem; color: var(--text-primary); }
    .footer-center { flex: 1; }
    .footer-progress-bar { height: 6px; background: rgba(0,0,0,0.06); border-radius: 99px; overflow: hidden; }
    .footer-progress-fill { height: 100%; background: var(--accent-primary); border-radius: 99px; transition: width 0.3s; }
    .footer-right { display: flex; align-items: center; gap: 1rem; font-size: 0.85rem; color: var(--text-secondary); white-space: nowrap; }
    .btn-submit { padding: 0.7rem 1.5rem; border-radius: 10px; border: none; background: #ef4444; color: #fff; font-weight: 700; font-size: 0.9rem; cursor: pointer; box-shadow: 0 3px 0 #dc2626; transition: all 0.2s; }
    .btn-submit:hover:not(:disabled) { transform: translateY(2px); box-shadow: 0 1px 0 #dc2626; }
    .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

    @media (max-width: 640px) {
      .test-footer { flex-wrap: wrap; padding: 0.75rem 1rem; gap: 0.75rem; }
      .footer-center { width: 100%; order: -1; }
    }
  `]
})
export class SeccionTestComponent implements OnInit, OnDestroy {
  private paes = inject(PaesContentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  optionKeys: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];

  seccionId = signal('');
  seccion = computed(() => this.paes.getSeccionById(this.seccionId()));
  test = computed(() => this.paes.getTestBySeccionId(this.seccionId()));
  answers = signal(new Map<number, 'A' | 'B' | 'C' | 'D'>());
  submitting = signal(false);
  timer = signal(0);
  private intervalId: any;

  totalQuestions = computed(() => this.test()?.preguntas.length || 0);
  answeredCount = computed(() => this.answers().size);
  answeredPct = computed(() => {
    const t = this.totalQuestions();
    return t > 0 ? Math.round((this.answeredCount() / t) * 100) : 0;
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
    const newMap = new Map(this.answers());
    newMap.set(preguntaId, option);
    this.answers.set(newMap);
  }

  submitTest() {
    this.submitting.set(true);
    if (this.intervalId) clearInterval(this.intervalId);

    const result = this.paes.submitTest(this.seccionId(), this.answers());
    this.router.navigate(['/test', this.seccionId(), 'review']);
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
}
