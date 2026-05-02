import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PaesContentService } from './services/paes-content.service';

@Component({
  selector: 'app-seccion-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sec-page" *ngIf="seccion() as sec">
      <!-- BREADCRUMB -->
      <nav class="breadcrumb">
        <a routerLink="/dashboard">🏠</a>
        <span class="sep">›</span>
        <a [routerLink]="['/ruta', materiaId()]">{{ materia()?.title }}</a>
        <span class="sep">›</span>
        <span class="current">Sección {{ sec.order }}</span>
      </nav>

      <!-- STEPPER -->
      <div class="stepper">
        <div class="step" [class.active]="true" [class.done]="true">
          <span class="step-num">1</span>
          <span class="step-label">Repaso</span>
        </div>
        <div class="step-line"></div>
        <div class="step">
          <span class="step-num">2</span>
          <span class="step-label">¡Test!</span>
        </div>
      </div>

      <!-- LESSON HEADER -->
      <div class="lesson-header">
        <span class="lesson-badge">{{ capitulo()?.title }}</span>
        <h1>{{ sec.title }}</h1>
        <p class="lesson-intro">{{ sec.introduccion }}</p>
      </div>

      <!-- CONTEXT TEXT -->
      <div class="content-card context-card" *ngIf="sec.test.contexto_base">
        <div class="card-header">
          <span class="card-icon">📖</span>
          <h3>Texto de práctica</h3>
        </div>
        <div class="context-body">
          <p>{{ sec.test.contexto_base }}</p>
        </div>
        <div class="context-footer">
          <span>{{ sec.test.preguntas.length }} {{ sec.test.preguntas.length === 1 ? 'pregunta' : 'preguntas' }} sobre este texto</span>
          <span class="dot">·</span>
          <span>~3-5 min</span>
        </div>
      </div>

      <!-- KEY TIPS -->
      <div class="content-card tips-card">
        <div class="card-header">
          <span class="card-icon">🔑</span>
          <h3>Claves para esta habilidad</h3>
        </div>
        <div class="tips-list">
          <div *ngFor="let dato of sec.datos_claves; let i = index" class="tip-item">
            <div class="tip-num" [style.background]="tipColors[i % tipColors.length]">{{ i + 1 }}</div>
            <p [innerHTML]="highlightBold(dato)"></p>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="cta-section">
        <div class="cta-card">
          <div class="cta-icon">🚀</div>
          <h3>¿Listo para poner a prueba tus conocimientos?</h3>
          <p>{{ sec.test.preguntas.length }} preguntas te esperan. ¡Necesitas 60% para aprobar!</p>
          <button class="btn-start-test" (click)="goToTest()">
            Comenzar Test →
          </button>
        </div>
      </div>

      <!-- BACK -->
      <button class="btn-back-text" [routerLink]="['/ruta', materiaId()]">← Volver a la ruta</button>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: #f8f9fa; color: var(--text-primary); }
    .sec-page { max-width: 680px; margin: 0 auto; padding: 1.5rem 1.5rem 5rem; }

    .breadcrumb { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .breadcrumb a { color: var(--text-secondary); text-decoration: none; }
    .breadcrumb a:hover { color: var(--accent-primary); }
    .sep { color: rgba(0,0,0,0.2); }
    .current { color: var(--text-primary); font-weight: 600; }

    /* STEPPER */
    .stepper { display: flex; align-items: center; justify-content: center; gap: 0; margin-bottom: 2rem; }
    .step { display: flex; flex-direction: column; align-items: center; gap: 0.3rem; }
    .step-num { width: 36px; height: 36px; border-radius: 50%; background: #e5e5e5; display: flex; align-items: center; justify-content: center; font-family: var(--font-heading); font-weight: 800; font-size: 0.9rem; color: #999; border: 3px solid #d1d1d1; transition: all 0.3s; }
    .step.active .step-num { background: linear-gradient(135deg, #855cd6, #a78bfa); border-color: #7c4dcc; color: #fff; }
    .step.done .step-num { background: linear-gradient(135deg, #58cc02, #78d64b); border-color: #4caf00; color: #fff; }
    .step-label { font-size: 0.72rem; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.03em; }
    .step.active .step-label { color: var(--accent-primary); }
    .step-line { width: 60px; height: 4px; background: #e5e5e5; border-radius: 99px; margin: 0 0.5rem; margin-bottom: 1.2rem; }
    .step-line.done { background: linear-gradient(90deg, #58cc02, #78d64b); }

    /* LESSON HEADER */
    .lesson-header { margin-bottom: 2rem; animation: fadeSlide 0.5s ease-out; }
    .lesson-badge { display: inline-block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: var(--accent-primary); background: rgba(133,92,214,0.1); padding: 0.25rem 0.8rem; border-radius: 8px; margin-bottom: 0.75rem; }
    .lesson-header h1 { font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: var(--text-primary); margin: 0 0 0.75rem; line-height: 1.2; }
    .lesson-intro { font-size: 0.95rem; color: var(--text-secondary); line-height: 1.7; margin: 0; max-width: 560px; }

    /* CONTENT CARDS */
    .content-card { background: #fff; border: 2px solid rgba(0,0,0,0.06); border-radius: 18px; padding: 1.5rem; margin-bottom: 1.25rem; animation: fadeSlide 0.5s ease-out; }
    .card-header { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1rem; }
    .card-icon { font-size: 1.3rem; }
    .card-header h3 { font-family: var(--font-heading); font-size: 1rem; font-weight: 700; color: var(--text-primary); margin: 0; }

    /* CONTEXT */
    .context-body { background: rgba(133,92,214,0.03); border-left: 4px solid var(--accent-primary); border-radius: 0 12px 12px 0; padding: 1.25rem; margin-bottom: 0.75rem; }
    .context-body p { font-size: 0.92rem; color: var(--text-primary); line-height: 1.85; margin: 0; font-style: italic; }
    .context-footer { display: flex; align-items: center; gap: 0.5rem; font-size: 0.78rem; color: var(--text-secondary); }
    .dot { opacity: 0.4; }

    /* TIPS */
    .tips-list { display: flex; flex-direction: column; gap: 0.6rem; }
    .tip-item { display: flex; align-items: flex-start; gap: 0.85rem; padding: 0.85rem 1rem; background: rgba(0,0,0,0.015); border-radius: 12px; transition: all 0.2s; }
    .tip-item:hover { background: rgba(133,92,214,0.04); transform: translateX(4px); }
    .tip-num { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.78rem; font-weight: 800; color: #fff; flex-shrink: 0; margin-top: 0.1rem; }
    .tip-item p { font-size: 0.9rem; color: var(--text-primary); line-height: 1.6; margin: 0; }
    .tip-item p :deep(strong) { color: var(--accent-primary); }

    /* CTA */
    .cta-section { margin: 2rem 0; animation: fadeSlide 0.5s ease-out 0.2s both; }
    .cta-card { text-align: center; background: linear-gradient(135deg, rgba(133,92,214,0.06), rgba(133,92,214,0.02)); border: 2px dashed rgba(133,92,214,0.2); border-radius: 20px; padding: 2.5rem 2rem; }
    .cta-icon { font-size: 2.5rem; margin-bottom: 0.75rem; animation: ctaBounce 2s ease-in-out infinite; }
    .cta-card h3 { font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin: 0 0 0.5rem; }
    .cta-card p { font-size: 0.88rem; color: var(--text-secondary); margin: 0 0 1.5rem; }
    .btn-start-test { padding: 1rem 2.5rem; border-radius: 999px; border: none; background: var(--accent-primary); color: #fff; font-family: var(--font-heading); font-weight: 800; font-size: 1.05rem; cursor: pointer; box-shadow: 0 5px 0 #6b46b8; transition: all 0.2s; animation: testPulse 2s ease-in-out infinite; }
    .btn-start-test:hover { transform: translateY(3px); box-shadow: 0 2px 0 #6b46b8; }

    .btn-back-text { background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: 0.9rem; padding: 0; }
    .btn-back-text:hover { color: var(--accent-primary); }

    @keyframes fadeSlide { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes ctaBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
    @keyframes testPulse { 0%, 100% { box-shadow: 0 5px 0 #6b46b8, 0 0 0 0 rgba(133,92,214,0.3); } 50% { box-shadow: 0 5px 0 #6b46b8, 0 0 0 10px rgba(133,92,214,0); } }

    @media (max-width: 640px) {
      .cta-card { padding: 2rem 1.25rem; }
      .step-line { width: 40px; }
    }
  `]
})
export class SeccionDetailComponent {
  private paes = inject(PaesContentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  tipColors = ['#855cd6', '#1cb0f6', '#ff9600', '#58cc02', '#ef4444'];

  materiaId = signal('');
  capituloId = signal('');
  seccionId = signal('');

  materia = computed(() => this.paes.getMateriaById(this.materiaId()));
  capitulo = computed(() => this.paes.getCapituloById(this.capituloId()));
  seccion = computed(() => this.paes.getSeccionById(this.seccionId()));
  capOrder = computed(() => {
    const caps = this.paes.getCapitulosByMateria(this.materiaId());
    const idx = caps.findIndex(c => c.id === this.capituloId());
    return idx + 1;
  });

  constructor() {
    const snap = this.route.snapshot;
    this.materiaId.set(snap.paramMap.get('materiaId') || '');
    this.capituloId.set(snap.paramMap.get('capituloId') || '');
    this.seccionId.set(snap.paramMap.get('seccionId') || '');
  }

  goToTest() {
    this.router.navigate(['/test', this.seccionId()]);
  }

  highlightBold(text: string): string {
    return text.replace(/(\".*?\")/g, '<strong>$1</strong>');
  }
}
