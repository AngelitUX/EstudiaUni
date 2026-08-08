import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PaesContentService } from './services/paes-content.service';
import { KatexService } from '../../core/services/katex.service';


@Component({
  selector: 'app-seccion-test-review',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="review-page" *ngIf="result() as r">

      <!-- CONFETTI (CSS only) -->
      <div class="confetti-container" *ngIf="r.score === 100">
        <div *ngFor="let c of confettiPieces" class="confetti-piece"
          [style.left.%]="c.left"
          [style.animationDelay]="c.delay + 's'"
          [style.background]="c.color"></div>
      </div>

      <!-- SCORE HERO -->
      <div class="score-hero" [class.passed]="passed()" [class.failed]="!passed()">
        <!-- Emoji burst -->
        <div class="hero-emoji">{{ passed() ? '🏆' : '💪' }}</div>

        <div class="score-ring-wrap">
          <svg viewBox="0 0 120 120" class="score-ring-svg">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="10"/>
            <circle cx="60" cy="60" r="52" fill="none"
              [attr.stroke]="passed() ? '#58cc02' : '#ef4444'"
              stroke-width="10"
              stroke-linecap="round"
              stroke-dasharray="327"
              [attr.stroke-dashoffset]="327 - (327 * r.score / 100)"
              transform="rotate(-90 60 60)"
              class="ring-animated"/>
          </svg>
          <span class="score-big">{{ r.score }}%</span>
        </div>

        <h1 class="hero-title">
          {{ passed() ? '¡Excelente trabajo!' : '¡Sigue practicando!' }}
        </h1>
        <p class="hero-subtitle">
          {{ passed() ? '¡Dominaste este tema por completo!' : (seccionId() === 'loc-boss' ? 'Necesitas al menos 10 aciertos (80%) para avanzar.' : 'Necesitas responder todo correctamente para avanzar.') }}
        </p>

        <!-- Stats row -->
        <div class="stats-row">
          <div class="stat-box green">
            <span class="sb-val">{{ r.totalCorrect }}</span>
            <span class="sb-label">Correctas</span>
          </div>
          <div class="stat-box red">
            <span class="sb-val">{{ r.totalQuestions - r.totalCorrect }}</span>
            <span class="sb-label">Incorrectas</span>
          </div>
          <div class="stat-box neutral">
            <span class="sb-val">{{ r.totalQuestions }}</span>
            <span class="sb-label">Total</span>
          </div>
        </div>

        <!-- XP Badge -->
        <div class="xp-badge" *ngIf="passed()">
          +{{ r.totalCorrect * 10 }} XP ganados ⚡
        </div>

        <!-- Hero actions -->
        <div class="hero-actions">
          <button class="btn-primary-hero" (click)="retryTest()" *ngIf="!passed()">↩ Repetir test</button>
          <button class="btn-secondary-hero" (click)="goBack()">← Volver al capítulo</button>
          <button class="btn-primary-hero btn-next-hero" (click)="goNext()" *ngIf="passed()">Siguiente Lección →</button>
        </div>
      </div>

      <!-- REVIEW SECTION -->
      <h2 class="review-heading">📋 Revisión de respuestas</h2>

      <div *ngFor="let p of preguntas(); let i = index" class="review-q-card"
        [class.q-correct]="isCorrect(r, p.id)"
        [class.q-wrong]="!isCorrect(r, p.id)">

        <div class="rq-status-bar">
          <span class="rq-status-icon">{{ isCorrect(r, p.id) ? '✓' : '✗' }}</span>
          <span class="rq-status-text">{{ isCorrect(r, p.id) ? 'Correcta' : 'Incorrecta' }}</span>
        </div>

        <p class="rq-enunciado"><span class="rq-num">{{ i + 1 }}</span> <span [innerHTML]="parseMixed(p.enunciado)"></span></p>

        <div class="rq-preambulo" *ngIf="p.preambulo_texto">
          <span>💬</span> {{ p.preambulo_texto }}
        </div>

        <div class="rq-image-container" *ngIf="p.preambulo_imagen_url">
          <img [src]="p.preambulo_imagen_url" alt="Imagen de apoyo" class="rq-image" />
        </div>

        <div class="rq-formula" *ngIf="p.formula_latex"
          [innerHTML]="renderLatex(p.formula_latex)">
        </div>

        <div class="rq-options">
          <ng-container *ngFor="let key of optKeys">
            <div *ngIf="p.alternativas && p.alternativas[key]" class="rq-option"
              [class.correct-answer]="key === p.respuesta_correcta"
              [class.wrong-selected]="key !== p.respuesta_correcta && getAnswer(r, p.id) === key"
              [class.neutral]="getAnswer(r, p.id) !== key && key !== p.respuesta_correcta">
              <span class="rq-letter"
                [class.letter-green]="key === p.respuesta_correcta"
                [class.letter-red]="key !== p.respuesta_correcta && getAnswer(r, p.id) === key">{{ key }}</span>
              <span class="rq-text" *ngIf="p.tipo_alternativas !== 'imagen'" [innerHTML]="parseMixed(p.alternativas[key])"></span>
              <img *ngIf="p.tipo_alternativas === 'imagen'" [src]="p.alternativas[key]"
                alt="Opción {{ key }}" class="rq-opt-img" />
              <span class="rq-tag correct-tag" *ngIf="key === p.respuesta_correcta">✓ Correcta</span>
              <span class="rq-tag wrong-tag" *ngIf="key !== p.respuesta_correcta && getAnswer(r, p.id) === key">✗ Tu respuesta</span>
            </div>
          </ng-container>
        </div>

        <div class="explanation-box" [class.exp-success]="isCorrect(r, p.id)" [class.exp-error]="!isCorrect(r, p.id)">
          <span class="exp-icon">{{ isCorrect(r, p.id) ? '💡' : '📖' }}</span>
          <div style="flex: 1;">
            <h4>{{ isCorrect(r, p.id) ? '¿Por qué es correcta?' : 'Explicación del error' }}</h4>
            <div *ngIf="isCorrect(r, p.id)">
              <p [innerHTML]="parseMixed(p.feedback_acierto)"></p>
            </div>
            <div *ngIf="!isCorrect(r, p.id)">
              <p [innerHTML]="parseMixed(p.feedback_error)"></p>
            </div>
          </div>
        </div>
      </div>

      <!-- BOTTOM -->
      <div class="bottom-actions">
        <button class="btn-outline-bottom" (click)="goBack()">← Volver al capítulo</button>
        <button class="btn-solid-bottom" (click)="retryTest()" *ngIf="!passed()">↩ Intentar de nuevo</button>
        <button class="btn-solid-bottom" (click)="goNext()" *ngIf="passed()">Siguiente Lección →</button>
      </div>
    </div>

    <div class="review-page empty" *ngIf="!result()">
      <p>No hay resultados para mostrar.</p>
      <button class="btn-outline-bottom" (click)="goBack()">Volver a la ruta</button>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: #f8f9fa; color: var(--text-primary); }
    .review-page { max-width: 640px; margin: 0 auto; padding: 2rem 1.5rem 5rem; position: relative; }
    .review-page.empty { text-align: center; padding-top: 6rem; color: var(--text-secondary); }

    /* CONFETTI */
    .confetti-container { position: fixed; top: 0; left: 0; right: 0; height: 100vh; pointer-events: none; z-index: 100; overflow: hidden; }
    .confetti-piece { position: absolute; top: -10px; width: 10px; height: 10px; border-radius: 2px; animation: confettiFall 3.5s ease-in forwards; }
    @keyframes confettiFall {
      0% { transform: translateY(0) rotate(0deg); opacity: 1; }
      100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
    }

    /* SCORE HERO */
    .score-hero { background: #fff; border: 2px solid rgba(0,0,0,0.06); border-radius: 24px; padding: 2.5rem 2rem; margin-bottom: 2.5rem; text-align: center; animation: heroSlide 0.6s ease-out; }
    .score-hero.passed { border-color: rgba(88,204,2,0.25); }
    .score-hero.failed { border-color: rgba(239,68,68,0.2); }
    .hero-emoji { font-size: 3rem; margin-bottom: 1rem; animation: emojiPop 0.6s ease-out 0.3s both; }

    .score-ring-wrap { position: relative; width: 130px; height: 130px; margin: 0 auto 1.25rem; }
    .score-ring-svg { width: 100%; height: 100%; }
    .ring-animated { transition: stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1); }
    .score-big { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-family: var(--font-heading); font-size: 2rem; font-weight: 900; color: var(--text-primary); }

    .hero-title { font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: var(--text-primary); margin: 0 0 0.4rem; }
    .hero-subtitle { font-size: 0.9rem; color: var(--text-secondary); margin: 0 0 1.5rem; }

    /* STATS */
    .stats-row { display: flex; justify-content: center; gap: 1rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
    .stat-box { background: rgba(0,0,0,0.03); border-radius: 14px; padding: 0.75rem 1.25rem; text-align: center; min-width: 90px; }
    .stat-box.green { background: rgba(88,204,2,0.08); }
    .stat-box.red { background: rgba(239,68,68,0.06); }
    .sb-val { display: block; font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; line-height: 1; }
    .stat-box.green .sb-val { color: #3d8c00; }
    .stat-box.red .sb-val { color: #dc2626; }
    .stat-box.neutral .sb-val { color: var(--text-primary); }
    .sb-label { font-size: 0.7rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.04em; font-weight: 600; }

    /* XP BADGE */
    .xp-badge { display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.5rem 1.2rem; border-radius: 999px; background: linear-gradient(135deg, #ffc800, #ff9600); color: #fff; font-family: var(--font-heading); font-weight: 800; font-size: 0.9rem; margin-bottom: 1.5rem; animation: xpPop 0.5s ease-out 0.8s both; box-shadow: 0 3px 0 #cc7a00; }

    .hero-actions { display: flex; justify-content: center; gap: 0.75rem; flex-wrap: wrap; }
    .btn-primary-hero { padding: 0.75rem 1.5rem; border-radius: 999px; border: none; background: var(--accent-primary); color: #fff; font-weight: 700; font-size: 0.9rem; cursor: pointer; box-shadow: 0 4px 0 #6b46b8; transition: all 0.2s; }
    .btn-primary-hero:hover { transform: translateY(2px); box-shadow: 0 2px 0 #6b46b8; }
    .btn-next-hero { background: #58cc02; box-shadow: 0 4px 0 #4caf00; }
    .btn-next-hero:hover { box-shadow: 0 2px 0 #4caf00; }
    .btn-secondary-hero { padding: 0.75rem 1.5rem; border-radius: 999px; border: 2px solid rgba(0,0,0,0.1); background: #fff; color: var(--text-secondary); font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; }
    .btn-secondary-hero:hover { border-color: var(--accent-primary); color: var(--accent-primary); }

    /* REVIEW HEADING */
    .review-heading { font-family: var(--font-heading); font-size: 1.1rem; font-weight: 700; color: var(--text-primary); margin: 0 0 1rem; }

    /* REVIEW CARDS */
    .review-q-card { background: #fff; border: 2px solid rgba(0,0,0,0.06); border-radius: 18px; margin-bottom: 1rem; overflow: hidden; animation: cardSlide 0.4s ease-out both; }
    .review-q-card.q-correct { border-color: rgba(88,204,2,0.2); }
    .review-q-card.q-wrong { border-color: rgba(239,68,68,0.15); }

    .rq-status-bar { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1.25rem; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    .q-correct .rq-status-bar { background: rgba(88,204,2,0.08); color: #3d8c00; }
    .q-wrong .rq-status-bar { background: rgba(239,68,68,0.06); color: #ef4444; }

    .rq-enunciado { display: flex; align-items: flex-start; gap: 0.75rem; font-family: var(--font-heading); font-size: 0.95rem; font-weight: 600; color: var(--text-primary); line-height: 1.5; margin: 0; padding: 1rem 1.25rem 0.75rem; }
    .rq-num { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; background: var(--accent-primary); color: #fff; font-size: 0.75rem; font-weight: 800; flex-shrink: 0; margin-top: 0.15rem; }

    .rq-image-container { margin: 0 1.25rem 1rem; text-align: center; background: #f8f9fa; border-radius: 12px; padding: 1rem; border: 1px solid rgba(0,0,0,0.05); }
    .rq-image { max-width: 100%; max-height: 250px; object-fit: contain; border-radius: 8px; }

    .rq-preambulo { font-size: 0.82rem; color: var(--text-secondary); font-style: italic; padding: 0.65rem 1.25rem; line-height: 1.5; border-left: 3px solid rgba(133,92,214,0.3); margin: 0 1.25rem 0.75rem; background: rgba(133,92,214,0.03); border-radius: 0 8px 8px 0; }
    .rq-formula { margin: 0 1.25rem 0.75rem; padding: 0.6rem 0.85rem; background: #f0fdf4; border: 1px solid rgba(22,163,74,0.15); border-radius: 8px; text-align: center; }
    .rq-formula code { font-family: 'Courier New', monospace; font-size: 0.9rem; color: #166534; font-weight: 600; }
    .rq-opt-img { max-width: 120px; max-height: 60px; object-fit: contain; border-radius: 4px; }

    .rq-options { display: flex; flex-direction: column; gap: 0.4rem; padding: 0 1.25rem 1rem; }
    .rq-option { display: flex; align-items: center; gap: 0.75rem; padding: 0.65rem 0.9rem; border: 2px solid rgba(0,0,0,0.04); border-radius: 12px; font-size: 0.88rem; transition: all 0.15s; }
    .rq-option.correct-answer { border-color: rgba(88,204,2,0.4); background: rgba(88,204,2,0.06); }
    .rq-option.wrong-selected { border-color: rgba(239,68,68,0.35); background: rgba(239,68,68,0.05); }
    .rq-option.neutral { opacity: 0.45; }
    .rq-letter { width: 26px; height: 26px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.78rem; font-weight: 800; border: 2px solid rgba(0,0,0,0.1); color: var(--text-secondary); flex-shrink: 0; }
    .rq-letter.letter-green { border-color: #58cc02; background: #58cc02; color: #fff; }
    .rq-letter.letter-red { border-color: #ef4444; background: #ef4444; color: #fff; }
    .rq-text { flex: 1; color: var(--text-primary); line-height: 1.4; }
    .rq-tag { font-size: 0.7rem; font-weight: 700; white-space: nowrap; padding: 0.15rem 0.5rem; border-radius: 6px; }
    .correct-tag { color: #3d8c00; background: rgba(88,204,2,0.12); }
    .wrong-tag { color: #ef4444; background: rgba(239,68,68,0.1); }

    .explanation-box { display: flex; align-items: flex-start; gap: 0.75rem; padding: 1rem 1.25rem; border-top: 1px solid rgba(0,0,0,0.04); }
    .explanation-box.exp-success { background: rgba(88,204,2,0.04); }
    .explanation-box.exp-error { background: rgba(255,193,7,0.05); }
    .exp-icon { font-size: 1.2rem; flex-shrink: 0; margin-top: 0.1rem; }
    .explanation-box h4 { font-family: var(--font-heading); font-size: 0.85rem; font-weight: 700; margin: 0 0 0.3rem; color: var(--text-primary); }
    .explanation-box p { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; margin: 0; }

    /* BOTTOM */
    .bottom-actions { display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; margin-top: 2rem; }
    .btn-outline-bottom { padding: 0.8rem 1.5rem; border-radius: 999px; border: 2px solid rgba(0,0,0,0.08); background: #fff; color: var(--text-secondary); font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; }
    .btn-outline-bottom:hover { border-color: var(--accent-primary); color: var(--accent-primary); }
    .btn-solid-bottom { padding: 0.8rem 1.5rem; border-radius: 999px; border: none; background: var(--accent-primary); color: #fff; font-weight: 700; font-size: 0.9rem; cursor: pointer; box-shadow: 0 4px 0 #6b46b8; transition: all 0.2s; }
    .btn-solid-bottom:hover { transform: translateY(2px); box-shadow: 0 2px 0 #6b46b8; }

    @keyframes heroSlide { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes emojiPop { from { transform: scale(0); } to { transform: scale(1); } }
    @keyframes xpPop { from { transform: scale(0) rotate(-10deg); opacity: 0; } to { transform: scale(1) rotate(0); opacity: 1; } }
    @keyframes cardSlide { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

    @media (max-width: 600px) {
      .score-hero { padding: 1.75rem 1.25rem; }
      .hero-title { font-size: 1.3rem; }
      .stats-row { gap: 0.6rem; }
      .stat-box { min-width: 75px; padding: 0.6rem 0.9rem; }
      .bottom-actions { flex-direction: column; }
    }
  `]
})
export class SeccionTestReviewComponent {
  private paes = inject(PaesContentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private katexSvc = inject(KatexService);
  private sanitizer = inject(DomSanitizer);


  optKeys: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
  seccionId = signal('');

  result = computed(() => this.paes.lastTestResult());
  seccion = computed(() => this.paes.getSeccionById(this.seccionId()));
  preguntas = computed(() => {
    const test = this.paes.getTestBySeccionId(this.seccionId());
    return test?.preguntas || [];
  });
  passed = computed(() => {
    const r = this.result();
    if (!r) return false;
    if (this.seccionId() === 'loc-boss') {
      return r.totalCorrect >= 10;
    }
    return r.score === 100;
  });

  confettiPieces = Array.from({ length: 40 }, () => ({
    left: Math.random() * 100,
    delay: Math.random() * 2,
    color: ['#58cc02', '#ffc800', '#855cd6', '#ff9600', '#1cb0f6', '#ef4444'][Math.floor(Math.random() * 6)]
  }));

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

  goBack() {
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

  retryTest() {
    this.router.navigate(['/test', this.seccionId()]);
  }

  goNext() {
    const nextUrl = this.paes.getStrictNextNodeUrl(this.seccionId());
    if (nextUrl) {
      this.router.navigate(nextUrl);
    } else {
      const cap = this.paes.getCapituloBySeccionId(this.seccionId());
      const materiaId = cap?.materiaId || this.seccion()?.materiaId;
      if (materiaId) {
        this.router.navigate(['/ruta', materiaId]);
      } else {
        this.router.navigate(['/ruta']);
      }
    }
  }

  renderLatex(latex: string | null): SafeHtml {
    if (!latex) return '';
    return this.katexSvc.render(latex);
  }

  parseMixed(text: string | null | undefined): SafeHtml {
    if (!text) return '';
    const renderedSafe = this.katexSvc.renderMixedText(text);
    const rendered = (renderedSafe as any)?.changingThisBreaksApplicationSecurity || String(renderedSafe);
    const bolded = rendered.replace(/\*\*(.*?)\*\*/gs, '<strong>$1</strong>');
    const withBreaks = bolded.replace(/&lt;br&gt;/g, '<br>');
    const unescapedHtml = withBreaks
      .replace(/&lt;div(.*?)&gt;/g, '<div$1>')
      .replace(/&lt;\/div&gt;/g, '</div>')
      .replace(/&lt;svg(.*?)&gt;/g, '<svg$1>')
      .replace(/&lt;\/svg&gt;/g, '</svg>')
      .replace(/&lt;line(.*?)&gt;/g, '<line$1>')
      .replace(/&lt;\/line&gt;/g, '</line>')
      .replace(/&lt;circle(.*?)&gt;/g, '<circle$1>')
      .replace(/&lt;\/circle&gt;/g, '</circle>')
      .replace(/&lt;text(.*?)&gt;/g, '<text$1>')
      .replace(/&lt;\/text&gt;/g, '</text>')
      .replace(/&lt;path(.*?)&gt;/g, '<path$1>')
      .replace(/&lt;\/path&gt;/g, '</path>')
      .replace(/&lt;polygon(.*?)&gt;/g, '<polygon$1>')
      .replace(/&lt;\/polygon&gt;/g, '</polygon>')
      .replace(/&lt;rect(.*?)&gt;/g, '<rect$1>')
      .replace(/&lt;\/rect&gt;/g, '</rect>');
    return this.sanitizer.bypassSecurityTrustHtml(unescapedHtml);
  }
}
