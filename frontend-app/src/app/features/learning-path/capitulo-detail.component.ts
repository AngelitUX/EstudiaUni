import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PaesContentService } from './services/paes-content.service';

@Component({
  selector: 'app-capitulo-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="cap-page" *ngIf="capitulo() as cap">
      <!-- BREADCRUMB -->
      <nav class="breadcrumb">
        <a routerLink="/dashboard">🏠</a>
        <span class="sep">›</span>
        <a routerLink="/ruta">{{ materia()?.title }}</a>
        <span class="sep">›</span>
        <span class="current">{{ cap.title }}</span>
      </nav>

      <!-- HERO CARD -->
      <div class="cap-hero">
        <div class="cap-hero-badge">
          <span class="badge-icon">📘</span>
        </div>
        <div class="cap-hero-text">
          <h1>{{ cap.title }}</h1>
          <p class="cap-intro-text">{{ cap.introduccion }}</p>
        </div>
        <div class="cap-hero-stats">
          <div class="stat-ring">
            <svg viewBox="0 0 40 40" class="ring-svg">
              <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="4"/>
              <circle cx="20" cy="20" r="16" fill="none"
                [attr.stroke]="capPct() >= 100 ? '#58cc02' : '#855cd6'"
                stroke-width="4"
                stroke-linecap="round"
                [attr.stroke-dasharray]="100.53"
                [attr.stroke-dashoffset]="100.53 - (100.53 * capPct() / 100)"
                transform="rotate(-90 20 20)"/>
            </svg>
            <span class="ring-pct">{{ capPct() }}%</span>
          </div>
          <button *ngIf="cap.pdfUrl" class="btn-pdf" (click)="openPdf(cap.pdfUrl!)">📖 Leer material</button>
        </div>
      </div>

      <!-- RULE -->
      <div class="rule-bar">
        <span class="rule-icon">🎯</span>
        <span>Apruebas cada lección con <strong>60%</strong> o más</span>
      </div>

      <!-- LECCIONES PATH -->
      <div class="lessons-path">
        <div *ngFor="let sec of cap.secciones; let i = index; let last = last" class="lesson-row">
          <!-- Vertical connector -->
          <div class="lesson-connector" *ngIf="!last"
            [class.done]="getProgress(sec.id).completed"></div>

          <div class="lesson-node" (click)="goToSeccion(sec.id)"
            [class.completed]="getProgress(sec.id).completed"
            [class.attempted]="getProgress(sec.id).attempts > 0 && !getProgress(sec.id).completed"
            [class.current]="isCurrentLesson(i)">

            <!-- Circle with SVG ring -->
            <div class="lesson-circle-wrap">
              <svg viewBox="0 0 52 52" class="lesson-ring">
                <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="4"/>
                <circle cx="26" cy="26" r="22" fill="none"
                  [attr.stroke]="getProgress(sec.id).completed ? '#58cc02' : getProgress(sec.id).attempts > 0 ? '#ff9600' : 'transparent'"
                  stroke-width="4"
                  stroke-linecap="round"
                  [attr.stroke-dasharray]="138.23"
                  [attr.stroke-dashoffset]="138.23 - (138.23 * getProgress(sec.id).bestScore / 100)"
                  transform="rotate(-90 26 26)"/>
              </svg>
              <div class="lesson-circle-inner"
                [class.done]="getProgress(sec.id).completed"
                [class.in-progress]="getProgress(sec.id).attempts > 0 && !getProgress(sec.id).completed"
                [class.is-current]="isCurrentLesson(i)">
                <span *ngIf="getProgress(sec.id).completed">⭐</span>
                <span *ngIf="!getProgress(sec.id).completed && getProgress(sec.id).attempts > 0">🔄</span>
                <span *ngIf="getProgress(sec.id).attempts === 0 && isCurrentLesson(i)">🔥</span>
                <span *ngIf="getProgress(sec.id).attempts === 0 && !isCurrentLesson(i)">{{ i + 1 }}</span>
              </div>
            </div>

            <!-- Info -->
            <div class="lesson-info">
              <h3>{{ sec.title }}</h3>
              <div class="lesson-meta">
                <span *ngIf="getProgress(sec.id).attempts > 0" class="score-tag"
                  [class.pass]="getProgress(sec.id).completed"
                  [class.fail]="!getProgress(sec.id).completed">
                  {{ getProgress(sec.id).bestScore }}%
                </span>
                <span *ngIf="getProgress(sec.id).attempts === 0" class="hint-tag">
                  {{ sec.test.preguntas.length }} preguntas
                </span>
                <span *ngIf="getProgress(sec.id).lastAttemptDate" class="date-tag">
                  {{ formatDate(getProgress(sec.id).lastAttemptDate!) }}
                </span>
              </div>
            </div>

            <!-- Arrow -->
            <div class="lesson-arrow">→</div>
          </div>
        </div>
      </div>

      <button class="btn-back-bottom" routerLink="/ruta">← Volver a la ruta</button>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: var(--bg-color, #fdf9f1); }
    .cap-page { max-width: 720px; margin: 0 auto; padding: 1.5rem 1.5rem 4rem; }

    /* BREADCRUMB */
    .breadcrumb { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .breadcrumb a { color: var(--text-secondary); text-decoration: none; }
    .breadcrumb a:hover { color: var(--accent-primary); }
    .sep { color: rgba(0,0,0,0.2); }
    .current { color: var(--text-primary); font-weight: 600; }

    /* HERO */
    .cap-hero { display: flex; align-items: flex-start; gap: 1.25rem; background: #fff; border: 2px solid rgba(0,0,0,0.06); border-radius: 20px; padding: 1.75rem; margin-bottom: 1rem; box-shadow: 0 2px 12px rgba(0,0,0,0.04); }
    .cap-hero-badge { width: 56px; height: 56px; border-radius: 16px; background: linear-gradient(135deg, rgba(133,92,214,0.1), rgba(133,92,214,0.05)); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .badge-icon { font-size: 1.8rem; }
    .cap-hero-text { flex: 1; min-width: 0; }
    .cap-hero-text h1 { font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; margin: 0 0 0.5rem; color: var(--text-primary); line-height: 1.2; }
    .cap-intro-text { font-size: 0.9rem; color: var(--text-secondary); margin: 0; line-height: 1.6; }
    .cap-hero-stats { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; flex-shrink: 0; }
    .stat-ring { position: relative; width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; }
    .ring-svg { width: 100%; height: 100%; }
    .ring-pct { position: absolute; font-family: var(--font-heading); font-size: 0.85rem; font-weight: 800; color: var(--text-primary); }
    .btn-pdf { display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.5rem 0.9rem; border-radius: 10px; border: none; background: var(--accent-primary); color: #fff; font-weight: 700; font-size: 0.78rem; cursor: pointer; box-shadow: 0 3px 0 #6b46b8; transition: all 0.2s; white-space: nowrap; }
    .btn-pdf:hover { transform: translateY(2px); box-shadow: 0 1px 0 #6b46b8; }

    /* RULE */
    .rule-bar { display: flex; align-items: center; gap: 0.6rem; background: rgba(88,204,2,0.08); border: 1px solid rgba(88,204,2,0.2); border-radius: 12px; padding: 0.75rem 1.15rem; margin-bottom: 2rem; font-size: 0.88rem; color: var(--text-secondary); }
    .rule-icon { font-size: 1.1rem; }
    .rule-bar strong { color: var(--text-primary); }

    /* LESSONS PATH */
    .lessons-path { display: flex; flex-direction: column; align-items: center; }
    .lesson-row { position: relative; width: 100%; margin-bottom: 0.5rem; }
    .lesson-connector { position: absolute; left: 50px; top: 76px; width: 3px; height: calc(100% - 20px); background: rgba(0,0,0,0.06); border-radius: 99px; z-index: 0; }
    .lesson-connector.done { background: linear-gradient(180deg, #58cc02, #78d64b); }

    .lesson-node { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.25rem; border-radius: 16px; cursor: pointer; transition: all 0.25s; position: relative; z-index: 1; background: #fff; border: 2px solid rgba(0,0,0,0.05); }
    .lesson-node:hover { border-color: rgba(133,92,214,0.25); box-shadow: 0 4px 16px rgba(133,92,214,0.1); transform: translateX(4px); }
    .lesson-node.completed { border-color: rgba(88,204,2,0.2); }
    .lesson-node.completed:hover { border-color: rgba(88,204,2,0.4); box-shadow: 0 4px 16px rgba(88,204,2,0.1); }
    .lesson-node.current { border-color: rgba(133,92,214,0.3); box-shadow: 0 0 0 4px rgba(133,92,214,0.08); }

    /* CIRCLE WITH RING */
    .lesson-circle-wrap { position: relative; width: 52px; height: 52px; flex-shrink: 0; }
    .lesson-ring { position: absolute; inset: 0; }
    .lesson-circle-inner { position: absolute; inset: 6px; border-radius: 50%; background: #e8e8e8; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; font-weight: 800; color: #aaa; font-family: var(--font-heading); transition: all 0.3s; }
    .lesson-circle-inner.done { background: linear-gradient(135deg, #58cc02, #78d64b); color: #fff; }
    .lesson-circle-inner.in-progress { background: linear-gradient(135deg, #ff9600, #ffc800); color: #fff; }
    .lesson-circle-inner.is-current { background: linear-gradient(135deg, #855cd6, #a78bfa); color: #fff; animation: currentGlow 2s ease-in-out infinite; }

    .lesson-info { flex: 1; min-width: 0; }
    .lesson-info h3 { font-family: var(--font-heading); font-size: 0.95rem; font-weight: 700; margin: 0 0 0.35rem; color: var(--text-primary); line-height: 1.3; }
    .lesson-meta { display: flex; align-items: center; gap: 0.6rem; font-size: 0.78rem; }
    .score-tag { padding: 0.15rem 0.5rem; border-radius: 99px; font-weight: 700; }
    .score-tag.pass { background: rgba(88,204,2,0.12); color: #3d8c00; }
    .score-tag.fail { background: rgba(255,150,0,0.12); color: #cc7a00; }
    .hint-tag { color: var(--text-secondary); }
    .date-tag { color: var(--text-secondary); opacity: 0.6; }

    .lesson-arrow { font-size: 1.1rem; color: var(--text-secondary); opacity: 0.4; transition: all 0.2s; flex-shrink: 0; }
    .lesson-node:hover .lesson-arrow { opacity: 1; color: var(--accent-primary); transform: translateX(4px); }

    .btn-back-bottom { display: inline-flex; align-items: center; gap: 0.3rem; margin-top: 2rem; background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: 0.9rem; padding: 0; }
    .btn-back-bottom:hover { color: var(--accent-primary); }

    @keyframes currentGlow { 0%, 100% { box-shadow: 0 0 0 0 rgba(133,92,214,0.3); } 50% { box-shadow: 0 0 0 8px rgba(133,92,214,0); } }

    @media (max-width: 640px) {
      .cap-hero { flex-direction: column; }
      .cap-hero-stats { flex-direction: row; width: 100%; justify-content: center; }
      .lesson-node { padding: 0.85rem 1rem; }
    }
  `]
})
export class CapituloDetailComponent {
  private paes = inject(PaesContentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private materiaId = signal('');
  private capituloId = signal('');

  materia = computed(() => this.paes.getMateriaById(this.materiaId()));
  capitulo = computed(() => this.paes.getCapituloById(this.capituloId()));
  capPct = computed(() => {
    const p = this.paes.getCapituloProgress(this.capituloId());
    return p.percentage;
  });

  constructor() {
    const snap = this.route.snapshot;
    this.materiaId.set(snap.paramMap.get('materiaId') || '');
    this.capituloId.set(snap.paramMap.get('capituloId') || '');
  }

  getProgress(seccionId: string) {
    return this.paes.getSeccionProgress(seccionId) || {
      completed: false, bestScore: 0, totalQuestions: 0,
      correctAnswers: 0, lastAttemptDate: null, attempts: 0
    };
  }

  isCurrentLesson(index: number): boolean {
    const cap = this.capitulo();
    if (!cap) return false;
    for (let i = 0; i < cap.secciones.length; i++) {
      const p = this.getProgress(cap.secciones[i].id);
      if (!p.completed) return i === index;
    }
    return false;
  }

  goToSeccion(seccionId: string) {
    this.router.navigate(['/ruta', this.materiaId(), this.capituloId(), seccionId]);
  }

  openPdf(url: string) { window.open(url, '_blank'); }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
}
