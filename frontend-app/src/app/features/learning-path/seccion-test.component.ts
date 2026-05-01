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
          <span class="test-label">TEST</span>
          <h2>{{ seccion()?.title }}</h2>
        </div>
        <div class="test-timer" [class.urgent]="timer() >= 300">⏱ {{ formatTime(timer()) }}</div>
      </div>

      <!-- CONTEXTO -->
      <div class="context-card" *ngIf="t.contexto_base">
        <p class="context-label">📄 Lee este texto</p>
        <p class="context-text">{{ t.contexto_base }}</p>
      </div>

      <!-- QUESTIONS -->
      <div class="questions-scroll">
        <div *ngFor="let p of t.preguntas; let i = index" class="question-card" [id]="'q-'+p.id">
          <p class="q-number"><span class="q-badge">{{ i + 1 }}</span> {{ p.enunciado }}</p>

          <div class="q-image-container" *ngIf="p.imagen_url">
            <img [src]="p.imagen_url" alt="Imagen de la pregunta" class="q-image" />
          </div>

          <div class="options-list">
            <label *ngFor="let key of optionKeys" class="option-item"
              [class.selected]="answers().get(p.id) === key"
              (click)="selectAnswer(p.id, key)">
              <span class="option-letter" [class.checked]="answers().get(p.id) === key">{{ key }}</span>
              <span class="option-text">{{ p.alternativas[key] }}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- FOOTER -->
      <div class="test-footer">
        <div class="footer-progress">
          <div class="footer-progress-bar">
            <div class="footer-progress-fill" [style.width.%]="answeredPct()"></div>
          </div>
          <span class="footer-pct">{{ answeredCount() }}/{{ totalQuestions() }} respondidas</span>
        </div>
        <button class="btn-submit" (click)="submitTest()" [disabled]="submitting() || answeredCount() === 0">
          {{ submitting() ? 'Enviando...' : 'Enviar →' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: var(--bg-color, #fdf9f1); }
    .test-page { max-width: 720px; margin: 0 auto; padding: 1.5rem 1.5rem 7rem; }

    /* HEADER */
    .test-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; gap: 1rem; flex-wrap: wrap; }
    .test-label { display: inline-block; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent-primary); background: rgba(133,92,214,0.1); padding: 0.2rem 0.6rem; border-radius: 6px; margin-bottom: 0.3rem; }
    .test-header h2 { font-family: var(--font-heading); font-size: 1.3rem; font-weight: 700; color: var(--text-primary); margin: 0; }
    .test-timer { font-family: monospace; font-size: 1rem; background: rgba(133,92,214,0.08); padding: 0.45rem 0.9rem; border-radius: 10px; color: var(--accent-primary); font-weight: 600; border: 1.5px solid rgba(133,92,214,0.2); }
    .test-timer.urgent { background: rgba(239,68,68,0.08); color: #ef4444; border-color: rgba(239,68,68,0.2); }

    /* CONTEXT */
    .context-card { background: #fff; border: 2px solid rgba(0,0,0,0.06); border-radius: 14px; padding: 1.5rem; margin-bottom: 1.5rem; border-left: 4px solid var(--accent-primary); }
    .context-label { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--accent-primary); margin: 0 0 0.75rem; }
    .context-text { font-size: 0.97rem; color: var(--text-primary); line-height: 1.8; margin: 0; font-style: italic; }

    /* QUESTIONS */
    .questions-scroll { display: flex; flex-direction: column; gap: 1.25rem; }
    .question-card { background: #fff; border: 2px solid rgba(0,0,0,0.06); border-radius: 16px; padding: 1.5rem; }
    .q-number { display: flex; align-items: flex-start; gap: 0.75rem; font-family: var(--font-heading); font-size: 1rem; font-weight: 600; color: var(--text-primary); line-height: 1.5; margin: 0 0 1.25rem; }
    .q-badge { display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 50%; background: var(--accent-primary); color: #fff; font-size: 0.8rem; font-weight: 800; flex-shrink: 0; margin-top: 0.1rem; }

    .q-image-container { margin: 0 0 1.25rem 0; text-align: center; background: #f8f9fa; border-radius: 12px; padding: 1rem; border: 1px solid rgba(0,0,0,0.05); }
    .q-image { max-width: 100%; max-height: 300px; object-fit: contain; border-radius: 8px; }

    .options-list { display: flex; flex-direction: column; gap: 0.5rem; }
    .option-item { display: flex; align-items: center; gap: 0.9rem; padding: 0.85rem 1rem; border: 2px solid rgba(0,0,0,0.06); border-radius: 12px; cursor: pointer; transition: all 0.15s; }
    .option-item:hover { border-color: rgba(133,92,214,0.3); background: rgba(133,92,214,0.03); }
    .option-item.selected { border-color: var(--accent-primary); background: rgba(133,92,214,0.06); }
    .option-letter { width: 28px; height: 28px; border-radius: 8px; border: 2px solid rgba(0,0,0,0.12); flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.8rem; color: var(--text-secondary); transition: all 0.15s; }
    .option-letter.checked { border-color: var(--accent-primary); background: var(--accent-primary); color: #fff; }
    .option-text { flex: 1; font-size: 0.93rem; color: var(--text-primary); line-height: 1.4; }

    /* FOOTER */
    .test-footer { position: fixed; bottom: 0; left: 0; right: 0; background: #fff; border-top: 2px solid rgba(0,0,0,0.06); padding: 0.85rem 2rem; display: flex; align-items: center; gap: 1.5rem; z-index: 50; }
    .footer-progress { flex: 1; display: flex; align-items: center; gap: 0.75rem; min-width: 0; }
    .footer-progress-bar { flex: 1; height: 6px; background: rgba(0,0,0,0.06); border-radius: 99px; overflow: hidden; }
    .footer-progress-fill { height: 100%; background: var(--accent-primary); border-radius: 99px; transition: width 0.3s; }
    .footer-pct { font-size: 0.8rem; color: var(--text-secondary); white-space: nowrap; }
    .btn-submit { padding: 0.7rem 1.5rem; border-radius: 10px; border: none; background: var(--accent-primary); color: #fff; font-weight: 700; font-size: 0.9rem; cursor: pointer; box-shadow: 0 3px 0 #6b46b8; transition: all 0.2s; white-space: nowrap; }
    .btn-submit:hover:not(:disabled) { transform: translateY(2px); box-shadow: 0 1px 0 #6b46b8; }
    .btn-submit:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }

    @media (max-width: 640px) {
      .test-footer { padding: 0.75rem 1rem; gap: 0.75rem; }
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
