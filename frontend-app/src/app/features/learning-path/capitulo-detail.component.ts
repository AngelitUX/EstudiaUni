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

      <!-- HEADER CARD -->
      <div class="cap-header-card">
        <div class="cap-header-top">
          <div class="cap-header-text">
            <h1>{{ cap.title }}</h1>
            <p class="cap-rule">Estudia y luego mide tu nivel. <strong>Apruebas con 60%.</strong></p>
          </div>
          <button *ngIf="cap.pdfUrl" class="btn-read" (click)="openPdf(cap.pdfUrl!)">
            📖 Leer capítulo
          </button>
        </div>
        <div class="cap-intro">
          <div class="intro-bar"></div>
          <div>
            <h3>Introducción</h3>
            <p>{{ cap.introduccion }}</p>
          </div>
        </div>
      </div>

      <!-- SECCIONES -->
      <div class="secciones-list">
        <div *ngFor="let sec of cap.secciones; let i = index"
          class="seccion-card"
          [class.completed]="getProgress(sec.id).completed"
          [class.attempted]="getProgress(sec.id).attempts > 0 && !getProgress(sec.id).completed">

          <div class="seccion-icon">
            <span *ngIf="getProgress(sec.id).completed">⭐</span>
            <span *ngIf="!getProgress(sec.id).completed && getProgress(sec.id).attempts > 0">🔄</span>
            <span *ngIf="getProgress(sec.id).attempts === 0">☆</span>
          </div>

          <div class="seccion-body">
            <h3>{{ sec.title }}</h3>
            <div class="seccion-progress-bar">
              <div class="seccion-progress-fill"
                [style.width.%]="getProgress(sec.id).bestScore"
                [class.low]="getProgress(sec.id).bestScore > 0 && getProgress(sec.id).bestScore < 60"
                [class.good]="getProgress(sec.id).bestScore >= 60">
              </div>
            </div>
            <div class="seccion-meta">
              <span *ngIf="getProgress(sec.id).attempts > 0">
                Mejor: {{ getProgress(sec.id).correctAnswers }}/{{ getProgress(sec.id).totalQuestions }}
                ({{ getProgress(sec.id).bestScore }}%)
              </span>
              <span *ngIf="getProgress(sec.id).attempts === 0" class="hint">
                Completa el test de la lección
              </span>
              <span *ngIf="getProgress(sec.id).lastAttemptDate" class="date">
                {{ formatDate(getProgress(sec.id).lastAttemptDate!) }}
              </span>
            </div>
          </div>

          <button class="btn-go" (click)="goToSeccion(sec.id)">
            Ir a la lección
          </button>
        </div>
      </div>

      <button class="btn-back-bottom" routerLink="/ruta">← Volver a la ruta</button>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: var(--bg-color, #fdf9f1); }
    .cap-page { max-width: 860px; margin: 0 auto; padding: 1.5rem 1.5rem 4rem; }

    /* BREADCRUMB */
    .breadcrumb { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .breadcrumb a { color: var(--text-secondary); text-decoration: none; }
    .breadcrumb a:hover { color: var(--accent-primary); }
    .sep { color: rgba(0,0,0,0.2); }
    .current { color: var(--text-primary); font-weight: 600; }

    /* HEADER CARD */
    .cap-header-card { background: #fff; border: 2px solid rgba(0,0,0,0.06); border-radius: 16px; padding: 2rem; margin-bottom: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
    .cap-header-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
    .cap-header-text h1 { font-family: var(--font-heading); font-size: 1.6rem; font-weight: 700; margin: 0 0 0.3rem; color: var(--text-primary); }
    .cap-rule { color: var(--text-secondary); font-size: 0.9rem; margin: 0; }
    .cap-rule strong { color: var(--text-primary); }
    .btn-read { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.7rem 1.4rem; border-radius: 10px; border: none; background: var(--accent-primary); color: #fff; font-weight: 700; font-size: 0.9rem; cursor: pointer; box-shadow: 0 3px 0 #6b46b8; transition: all 0.2s; white-space: nowrap; }
    .btn-read:hover { transform: translateY(2px); box-shadow: 0 1px 0 #6b46b8; }

    .cap-intro { display: flex; gap: 1rem; background: rgba(133,92,214,0.04); border-radius: 12px; padding: 1.25rem; }
    .intro-bar { width: 4px; background: var(--accent-primary); border-radius: 99px; flex-shrink: 0; }
    .cap-intro h3 { font-family: var(--font-heading); font-size: 1rem; font-weight: 700; margin: 0 0 0.4rem; color: var(--text-primary); }
    .cap-intro p { font-size: 0.9rem; color: var(--text-secondary); margin: 0; line-height: 1.5; }

    /* SECCIONES */
    .secciones-list { display: flex; flex-direction: column; gap: 1rem; }
    .seccion-card { display: flex; align-items: center; gap: 1rem; background: #fff; border: 2px solid rgba(0,0,0,0.06); border-radius: 14px; padding: 1.25rem 1.5rem; transition: all 0.2s; }
    .seccion-card:hover { border-color: rgba(133,92,214,0.3); box-shadow: 0 4px 12px rgba(133,92,214,0.08); }
    .seccion-card.completed { border-color: rgba(16,185,129,0.3); }
    .seccion-card.attempted { border-color: rgba(255,150,0,0.3); }
    .seccion-icon { font-size: 1.5rem; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.03); border-radius: 50%; flex-shrink: 0; }
    .seccion-body { flex: 1; min-width: 0; }
    .seccion-body h3 { font-family: var(--font-heading); font-size: 1rem; font-weight: 600; margin: 0 0 0.5rem; color: var(--text-primary); }
    .seccion-progress-bar { height: 6px; background: rgba(0,0,0,0.06); border-radius: 99px; overflow: hidden; margin-bottom: 0.35rem; }
    .seccion-progress-fill { height: 100%; border-radius: 99px; background: rgba(0,0,0,0.1); transition: width 0.5s; }
    .seccion-progress-fill.low { background: linear-gradient(90deg, #ff9600, #ffc800); }
    .seccion-progress-fill.good { background: linear-gradient(90deg, #10b981, #34d399); }
    .seccion-meta { display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-secondary); }
    .hint { font-style: italic; opacity: 0.7; }
    .date { opacity: 0.6; }

    .btn-go { padding: 0.6rem 1.2rem; border-radius: 10px; border: none; background: var(--accent-primary); color: #fff; font-weight: 700; font-size: 0.85rem; cursor: pointer; box-shadow: 0 3px 0 #6b46b8; transition: all 0.2s; white-space: nowrap; flex-shrink: 0; }
    .btn-go:hover { transform: translateY(2px); box-shadow: 0 1px 0 #6b46b8; }

    .btn-back-bottom { display: inline-flex; align-items: center; gap: 0.3rem; margin-top: 2rem; background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: 0.9rem; padding: 0; }
    .btn-back-bottom:hover { color: var(--accent-primary); }

    @media (max-width: 640px) {
      .seccion-card { flex-direction: column; text-align: center; }
      .seccion-meta { flex-direction: column; align-items: center; gap: 0.2rem; }
      .cap-header-top { flex-direction: column; }
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

  goToSeccion(seccionId: string) {
    this.router.navigate(['/ruta', this.materiaId(), this.capituloId(), seccionId]);
  }

  openPdf(url: string) { window.open(url, '_blank'); }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
}
