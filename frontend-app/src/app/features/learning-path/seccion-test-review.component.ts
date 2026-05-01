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
      <!-- SCORE SUMMARY -->
      <div class="score-card">
        <div class="score-emoji">{{ r.score >= 80 ? '🎉' : r.score >= 60 ? '👍' : '💪' }}</div>
        <h1 class="score-title">
          {{ r.score >= 80 ? '¡Excelente!' : r.score >= 60 ? '¡Buen trabajo!' : '¡Sigue practicando!' }}
        </h1>
        <div class="score-ring">
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" class="ring-bg"/>
            <circle cx="60" cy="60" r="52" class="ring-fill"
              [style.strokeDashoffset]="327 - (327 * r.score / 100)"
              [class.good]="r.score >= 60" [class.bad]="r.score < 60"/>
          </svg>
          <span class="score-pct">{{ r.score }}%</span>
        </div>
        <div class="score-details">
          <span class="detail correct">✅ {{ r.totalCorrect }} correctas</span>
          <span class="detail incorrect">❌ {{ r.totalQuestions - r.totalCorrect }} incorrectas</span>
          <span class="detail omitted">⭕ {{ getOmitted(r) }} omitidas</span>
        </div>
      </div>

      <!-- QUESTIONS REVIEW -->
      <h2 class="review-title">Revisión de respuestas</h2>

      <div *ngFor="let p of preguntas(); let i = index" class="review-q-card">
        <div class="rq-header">
          <span class="rq-num">{{ i + 1 }}. {{ p.enunciado }}</span>
        </div>

        <div class="rq-options">
          <div *ngFor="let key of optKeys" class="rq-option"
            [class.correct-answer]="key === p.respuesta_correcta"
            [class.wrong-selected]="key !== p.respuesta_correcta && getAnswer(r, p.id) === key"
            [class.unselected]="getAnswer(r, p.id) !== key && key !== p.respuesta_correcta">
            <span class="rq-radio"
              [class.green]="key === p.respuesta_correcta"
              [class.red]="key !== p.respuesta_correcta && getAnswer(r, p.id) === key"></span>
            <span class="rq-text">{{ p.alternativas[key] }}</span>
            <span class="rq-tag" *ngIf="key === p.respuesta_correcta">✓ Esta era la correcta</span>
          </div>
        </div>

        <div class="explanation-box" [class.success]="isCorrect(r, p.id)" [class.error]="!isCorrect(r, p.id)">
          <h4>Explicación</h4>
          <p>{{ isCorrect(r, p.id) ? p.feedback_acierto : p.feedback_error }}</p>
        </div>
      </div>

      <!-- ACTIONS -->
      <div class="review-actions">
        <button class="btn-secondary" (click)="goBack()">← Volver al capítulo</button>
        <button class="btn-primary" (click)="retryTest()">🔄 Repetir test</button>
      </div>
    </div>

    <div class="review-page empty" *ngIf="!result()">
      <p>No hay resultados para mostrar.</p>
      <button class="btn-secondary" routerLink="/ruta">Volver a la ruta</button>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: var(--bg-color, #fdf9f1); }
    .review-page { max-width: 800px; margin: 0 auto; padding: 2rem 1.5rem 4rem; }
    .review-page.empty { text-align: center; padding-top: 6rem; color: var(--text-secondary); }

    /* SCORE CARD */
    .score-card { text-align: center; background: #fff; border: 2px solid rgba(0,0,0,0.06); border-radius: 20px; padding: 2.5rem 2rem; margin-bottom: 2rem; }
    .score-emoji { font-size: 3rem; margin-bottom: 0.5rem; }
    .score-title { font-family: var(--font-heading); font-size: 1.6rem; font-weight: 700; color: var(--text-primary); margin: 0 0 1.5rem; }
    .score-ring { position: relative; width: 120px; height: 120px; margin: 0 auto 1.5rem; }
    .score-ring svg { transform: rotate(-90deg); width: 100%; height: 100%; }
    .score-ring circle { fill: none; stroke-width: 10; stroke-linecap: round; }
    .ring-bg { stroke: rgba(0,0,0,0.06); }
    .ring-fill { stroke-dasharray: 327; transition: stroke-dashoffset 1s ease; }
    .ring-fill.good { stroke: #10b981; }
    .ring-fill.bad { stroke: #ef4444; }
    .score-pct { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; color: var(--text-primary); }
    .score-details { display: flex; justify-content: center; gap: 1.5rem; flex-wrap: wrap; }
    .detail { font-size: 0.9rem; font-weight: 500; }
    .detail.correct { color: #10b981; }
    .detail.incorrect { color: #ef4444; }
    .detail.omitted { color: var(--text-secondary); }

    /* REVIEW QUESTIONS */
    .review-title { font-family: var(--font-heading); font-size: 1.2rem; font-weight: 700; color: var(--text-primary); margin: 0 0 1rem; }
    .review-q-card { background: #fff; border: 2px solid rgba(0,0,0,0.06); border-radius: 16px; padding: 1.5rem 1.75rem; margin-bottom: 1.25rem; }
    .rq-header { margin-bottom: 1rem; }
    .rq-num { font-family: var(--font-heading); font-size: 1rem; font-weight: 600; color: var(--text-primary); line-height: 1.5; }

    .rq-options { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1rem; }
    .rq-option { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; border: 2px solid rgba(0,0,0,0.04); border-radius: 10px; font-size: 0.9rem; color: var(--text-primary); position: relative; }
    .rq-option.correct-answer { border-color: rgba(16,185,129,0.4); background: rgba(16,185,129,0.05); }
    .rq-option.wrong-selected { border-color: rgba(239,68,68,0.4); background: rgba(239,68,68,0.05); }
    .rq-option.unselected { opacity: 0.6; }
    .rq-radio { width: 18px; height: 18px; border-radius: 50%; border: 2px solid rgba(0,0,0,0.15); flex-shrink: 0; }
    .rq-radio.green { border-color: #10b981; background: #10b981; }
    .rq-radio.red { border-color: #ef4444; background: #ef4444; }
    .rq-text { flex: 1; }
    .rq-tag { font-size: 0.75rem; color: #10b981; font-weight: 600; white-space: nowrap; }

    .explanation-box { padding: 1.25rem; border-radius: 12px; }
    .explanation-box.success { background: rgba(16,185,129,0.06); border-left: 4px solid #10b981; }
    .explanation-box.error { background: rgba(255,193,7,0.08); border-left: 4px solid #ffc107; }
    .explanation-box h4 { font-family: var(--font-heading); font-size: 0.9rem; font-weight: 700; margin: 0 0 0.4rem; color: var(--text-primary); }
    .explanation-box p { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6; margin: 0; }

    .review-actions { display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; margin-top: 2rem; }
    .btn-secondary { padding: 0.8rem 1.5rem; border-radius: 999px; border: 2px solid rgba(0,0,0,0.08); background: #fff; color: var(--text-secondary); font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; }
    .btn-secondary:hover { border-color: var(--accent-primary); color: var(--accent-primary); }
    .btn-primary { padding: 0.8rem 1.5rem; border-radius: 999px; border: none; background: var(--accent-primary); color: #fff; font-weight: 700; font-size: 0.9rem; cursor: pointer; box-shadow: 0 4px 0 #6b46b8; transition: all 0.2s; }
    .btn-primary:hover { transform: translateY(2px); box-shadow: 0 2px 0 #6b46b8; }
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
