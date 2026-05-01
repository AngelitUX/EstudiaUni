import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PaesContentService } from './services/paes-content.service';

@Component({
  selector: 'app-seccion-test-review',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="review-page" *ngIf="result() as r">

      <!-- SCORE HERO -->
      <div class="score-hero" [class.passed]="r.score >= 60" [class.failed]="r.score < 60">
        <div class="score-hero-inner">
          <div class="score-ring">
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" class="ring-bg"/>
              <circle cx="60" cy="60" r="52" class="ring-fill"
                [style.strokeDashoffset]="327 - (327 * r.score / 100)"
                [class.good]="r.score >= 60" [class.bad]="r.score < 60"/>
            </svg>
            <span class="score-pct">{{ r.score }}%</span>
          </div>
          <div class="score-meta">
            <h1 class="score-title">
              {{ r.score >= 80 ? '¡Excelente!' : r.score >= 60 ? '¡Buen trabajo!' : '¡Sigue practicando!' }}
            </h1>
            <p class="score-subtitle">
              {{ r.score >= 60 ? 'Superaste el umbral de aprobación (60%)' : 'Necesitas al menos 60% para aprobar' }}
            </p>
            <div class="score-stats">
              <div class="stat">
                <span class="stat-val correct-col">{{ r.totalCorrect }}</span>
                <span class="stat-lbl">Correctas</span>
              </div>
              <div class="stat-div"></div>
              <div class="stat">
                <span class="stat-val incorrect-col">{{ r.totalQuestions - r.totalCorrect }}</span>
                <span class="stat-lbl">Incorrectas</span>
              </div>
              <div class="stat-div"></div>
              <div class="stat">
                <span class="stat-val">{{ r.totalQuestions }}</span>
                <span class="stat-lbl">Total</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ACTIONS dentro del hero -->
        <div class="hero-actions">
          <button class="btn-retry" (click)="retryTest()">↩ Repetir test</button>
          <button class="btn-back-cap" (click)="goBack()">← Volver al capítulo</button>
        </div>
      </div>

      <!-- REVIEW QUESTIONS -->
      <h2 class="review-title">Revisión de respuestas</h2>

      <div *ngFor="let p of preguntas(); let i = index" class="review-q-card"
        [class.q-correct]="isCorrect(r, p.id)"
        [class.q-wrong]="!isCorrect(r, p.id)">

        <div class="rq-status-bar">
          <span class="rq-status-icon">{{ isCorrect(r, p.id) ? '✓' : '✗' }}</span>
          <span class="rq-status-text">{{ isCorrect(r, p.id) ? 'Correcta' : 'Incorrecta' }}</span>
        </div>

        <p class="rq-enunciado"><span class="rq-num">{{ i + 1 }}</span> {{ p.enunciado }}</p>

        <div class="rq-options">
          <div *ngFor="let key of optKeys" class="rq-option"
            [class.correct-answer]="key === p.respuesta_correcta"
            [class.wrong-selected]="key !== p.respuesta_correcta && getAnswer(r, p.id) === key"
            [class.neutral]="getAnswer(r, p.id) !== key && key !== p.respuesta_correcta">
            <span class="rq-letter"
              [class.letter-green]="key === p.respuesta_correcta"
              [class.letter-red]="key !== p.respuesta_correcta && getAnswer(r, p.id) === key">{{ key }}</span>
            <span class="rq-text">{{ p.alternativas[key] }}</span>
            <span class="rq-tag correct-tag" *ngIf="key === p.respuesta_correcta">✓ Correcta</span>
            <span class="rq-tag wrong-tag" *ngIf="key !== p.respuesta_correcta && getAnswer(r, p.id) === key">✗ Tu respuesta</span>
          </div>
        </div>

        <div class="explanation-box" [class.exp-success]="isCorrect(r, p.id)" [class.exp-error]="!isCorrect(r, p.id)">
          <span class="exp-icon">{{ isCorrect(r, p.id) ? '💡' : '📖' }}</span>
          <div>
            <h4>{{ isCorrect(r, p.id) ? '¿Por qué es correcta?' : '¿Por qué te equivocaste?' }}</h4>
            <p>{{ isCorrect(r, p.id) ? p.feedback_acierto : p.feedback_error }}</p>
          </div>
        </div>
      </div>

      <!-- BOTTOM ACTIONS -->
      <div class="bottom-actions">
        <button class="btn-secondary" (click)="goBack()">← Volver al capítulo</button>
        <button class="btn-primary" (click)="retryTest()">↩ Intentar de nuevo</button>
      </div>
    </div>

    <div class="review-page empty" *ngIf="!result()">
      <p>No hay resultados para mostrar.</p>
      <button class="btn-secondary" routerLink="/ruta">Volver a la ruta</button>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: var(--bg-color, #fdf9f1); }
    .review-page { max-width: 720px; margin: 0 auto; padding: 2rem 1.5rem 5rem; }
    .review-page.empty { text-align: center; padding-top: 6rem; color: var(--text-secondary); }

    /* SCORE HERO */
    .score-hero { border-radius: 20px; padding: 2rem; margin-bottom: 2.5rem; border: 2px solid; }
    .score-hero.passed { background: linear-gradient(135deg, rgba(16,185,129,0.06), rgba(16,185,129,0.02)); border-color: rgba(16,185,129,0.25); }
    .score-hero.failed { background: linear-gradient(135deg, rgba(239,68,68,0.06), rgba(239,68,68,0.02)); border-color: rgba(239,68,68,0.2); }
    .score-hero-inner { display: flex; align-items: center; gap: 2rem; flex-wrap: wrap; margin-bottom: 1.5rem; }

    .score-ring { position: relative; width: 110px; height: 110px; flex-shrink: 0; }
    .score-ring svg { transform: rotate(-90deg); width: 100%; height: 100%; }
    .score-ring circle { fill: none; stroke-width: 10; stroke-linecap: round; }
    .ring-bg { stroke: rgba(0,0,0,0.07); }
    .ring-fill { stroke-dasharray: 327; transition: stroke-dashoffset 1.2s ease; }
    .ring-fill.good { stroke: #10b981; }
    .ring-fill.bad { stroke: #ef4444; }
    .score-pct { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); font-family: var(--font-heading); font-size: 1.7rem; font-weight: 900; color: var(--text-primary); }

    .score-meta { flex: 1; min-width: 0; }
    .score-title { font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin: 0 0 0.3rem; }
    .score-subtitle { font-size: 0.88rem; color: var(--text-secondary); margin: 0 0 1.25rem; }

    .score-stats { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
    .stat { display: flex; flex-direction: column; align-items: center; }
    .stat-val { font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--text-primary); }
    .stat-val.correct-col { color: #10b981; }
    .stat-val.incorrect-col { color: #ef4444; }
    .stat-lbl { font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; }
    .stat-div { width: 1px; height: 30px; background: rgba(0,0,0,0.1); }

    .hero-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .btn-retry { padding: 0.7rem 1.4rem; border-radius: 999px; border: none; background: var(--accent-primary); color: #fff; font-weight: 700; font-size: 0.9rem; cursor: pointer; box-shadow: 0 3px 0 #6b46b8; transition: all 0.2s; }
    .btn-retry:hover { transform: translateY(2px); box-shadow: 0 1px 0 #6b46b8; }
    .btn-back-cap { padding: 0.7rem 1.4rem; border-radius: 999px; border: 2px solid rgba(0,0,0,0.1); background: #fff; color: var(--text-secondary); font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; }
    .btn-back-cap:hover { border-color: var(--accent-primary); color: var(--accent-primary); }

    /* REVIEW QUESTIONS */
    .review-title { font-family: var(--font-heading); font-size: 1.1rem; font-weight: 700; color: var(--text-primary); margin: 0 0 1rem; }
    .review-q-card { background: #fff; border: 2px solid rgba(0,0,0,0.06); border-radius: 16px; margin-bottom: 1.25rem; overflow: hidden; }
    .review-q-card.q-correct { border-color: rgba(16,185,129,0.2); }
    .review-q-card.q-wrong { border-color: rgba(239,68,68,0.15); }

    .rq-status-bar { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1.25rem; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    .q-correct .rq-status-bar { background: rgba(16,185,129,0.08); color: #10b981; }
    .q-wrong .rq-status-bar { background: rgba(239,68,68,0.07); color: #ef4444; }
    .rq-status-icon { font-size: 1rem; }

    .rq-enunciado { display: flex; align-items: flex-start; gap: 0.75rem; font-family: var(--font-heading); font-size: 1rem; font-weight: 600; color: var(--text-primary); line-height: 1.5; margin: 0; padding: 1rem 1.25rem 0.75rem; }
    .rq-num { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; background: var(--accent-primary); color: #fff; font-size: 0.75rem; font-weight: 800; flex-shrink: 0; margin-top: 0.15rem; }

    .rq-options { display: flex; flex-direction: column; gap: 0.4rem; padding: 0 1.25rem 1rem; }
    .rq-option { display: flex; align-items: center; gap: 0.75rem; padding: 0.65rem 0.9rem; border: 2px solid rgba(0,0,0,0.04); border-radius: 10px; font-size: 0.9rem; transition: all 0.15s; }
    .rq-option.correct-answer { border-color: rgba(16,185,129,0.4); background: rgba(16,185,129,0.06); }
    .rq-option.wrong-selected { border-color: rgba(239,68,68,0.35); background: rgba(239,68,68,0.05); }
    .rq-option.neutral { opacity: 0.5; }
    .rq-letter { width: 26px; height: 26px; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 0.78rem; font-weight: 800; border: 2px solid rgba(0,0,0,0.1); color: var(--text-secondary); flex-shrink: 0; }
    .rq-letter.letter-green { border-color: #10b981; background: #10b981; color: #fff; }
    .rq-letter.letter-red { border-color: #ef4444; background: #ef4444; color: #fff; }
    .rq-text { flex: 1; color: var(--text-primary); }
    .rq-tag { font-size: 0.72rem; font-weight: 700; white-space: nowrap; padding: 0.15rem 0.5rem; border-radius: 5px; }
    .correct-tag { color: #10b981; background: rgba(16,185,129,0.1); }
    .wrong-tag { color: #ef4444; background: rgba(239,68,68,0.1); }

    .explanation-box { display: flex; align-items: flex-start; gap: 0.75rem; padding: 1rem 1.25rem; border-top: 1px solid rgba(0,0,0,0.04); }
    .explanation-box.exp-success { background: rgba(16,185,129,0.04); }
    .explanation-box.exp-error { background: rgba(255,193,7,0.05); }
    .exp-icon { font-size: 1.2rem; flex-shrink: 0; margin-top: 0.1rem; }
    .explanation-box h4 { font-family: var(--font-heading); font-size: 0.85rem; font-weight: 700; margin: 0 0 0.3rem; color: var(--text-primary); }
    .explanation-box p { font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; margin: 0; }

    /* BOTTOM */
    .bottom-actions { display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; margin-top: 2rem; }
    .btn-secondary { padding: 0.8rem 1.5rem; border-radius: 999px; border: 2px solid rgba(0,0,0,0.08); background: #fff; color: var(--text-secondary); font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; }
    .btn-secondary:hover { border-color: var(--accent-primary); color: var(--accent-primary); }
    .btn-primary { padding: 0.8rem 1.5rem; border-radius: 999px; border: none; background: var(--accent-primary); color: #fff; font-weight: 700; font-size: 0.9rem; cursor: pointer; box-shadow: 0 4px 0 #6b46b8; transition: all 0.2s; }
    .btn-primary:hover { transform: translateY(2px); box-shadow: 0 2px 0 #6b46b8; }

    @media (max-width: 600px) {
      .score-hero-inner { flex-direction: column; align-items: center; text-align: center; }
      .score-stats { justify-content: center; }
      .hero-actions { justify-content: center; }
      .bottom-actions { flex-direction: column; }
    }
  `]
})
export class SeccionTestReviewComponent {
  private paes = inject(PaesContentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  optKeys: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
  seccionId = signal('');

  result = computed(() => this.paes.lastTestResult());
  seccion = computed(() => this.paes.getSeccionById(this.seccionId()));
  preguntas = computed(() => {
    const test = this.paes.getTestBySeccionId(this.seccionId());
    return test?.preguntas || [];
  });

  constructor() {
    this.seccionId.set(this.route.snapshot.paramMap.get('seccionId') || '');
  }

  getAnswer(r: any, preguntaId: number): string | null {
    const a = r.answers.find((a: any) => a.preguntaId === preguntaId);
    return a?.selectedOption || null;
  }

  isCorrect(r: any, preguntaId: number): boolean {
    const a = r.answers.find((a: any) => a.preguntaId === preguntaId);
    return a?.isCorrect || false;
  }

  getOmitted(r: any): number {
    return r.answers.filter((a: any) => !a.selectedOption).length;
  }

  goBack() {
    const sec = this.seccion();
    if (sec) {
      this.router.navigate(['/ruta', sec.materiaId, sec.capituloId]);
    } else {
      this.router.navigate(['/ruta']);
    }
  }

  retryTest() {
    this.router.navigate(['/test', this.seccionId()]);
  }
}

