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
        <span class="current">Capítulo {{ capOrder() }}</span>
      </nav>

      <!-- LESSON HEADER -->
      <div class="lesson-header">
        <span class="lesson-badge">{{ capitulo()?.title }}</span>
        <h1>{{ sec.title }}</h1>
      </div>

      <!-- MINI GUÍA -->
      <div class="content-card guide-card">
        <div class="card-header">
          <span class="card-icon">🧠</span>
          <h3>{{ sec.guia_titulo || '¿Qué aprenderás?' }}</h3>
        </div>
        <p class="guide-body">{{ sec.guia_contenido || sec.introduccion }}</p>
      </div>

      <!-- TEXTO BASE -->
      <div class="content-card context-card" *ngIf="sec.test?.contexto_base">
        <div class="card-header">
          <span class="card-icon">📄</span>
          <h3>Texto de práctica</h3>
          <span class="pregunta-count">{{ sec.test.preguntas.length }} {{ sec.test.preguntas.length === 1 ? 'pregunta' : 'preguntas' }}</span>
        </div>
        <div class="context-body">
          <p>{{ sec.test.contexto_base }}</p>
        </div>
      </div>

      <!-- TIPS CLAVE -->
      <div class="content-card tips-card" *ngIf="sec.datos_claves?.length">
        <div class="card-header">
          <span class="card-icon">💡</span>
          <h3>Tips clave</h3>
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
          <h3>¿Listo para practicar?</h3>
          <p>{{ sec.test.preguntas.length }} preguntas te esperan. ¡Necesitas 60% para aprobar!</p>
          <button class="btn-start-test" (click)="goToTest()">Comenzar Test →</button>
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

    /* LESSON HEADER */
    .lesson-header { margin-bottom: 1.5rem; animation: fadeSlide 0.5s ease-out; }
    .lesson-badge { display: inline-block; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: var(--accent-primary); background: rgba(133,92,214,0.1); padding: 0.25rem 0.8rem; border-radius: 8px; margin-bottom: 0.75rem; }
    .lesson-header h1 { font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: var(--text-primary); margin: 0; line-height: 1.2; }

    /* CONTENT CARDS */
    .content-card { background: #fff; border: 2px solid rgba(0,0,0,0.06); border-radius: 18px; padding: 1.5rem; margin-bottom: 1.25rem; animation: fadeSlide 0.5s ease-out; }
    .card-header { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1rem; flex-wrap: wrap; }
    .card-icon { font-size: 1.3rem; }
    .card-header h3 { font-family: var(--font-heading); font-size: 1rem; font-weight: 700; color: var(--text-primary); margin: 0; flex: 1; }
    .pregunta-count { font-size: 0.72rem; font-weight: 700; background: rgba(133,92,214,0.08); color: var(--accent-primary); padding: 0.2rem 0.65rem; border-radius: 99px; }

    /* MINI GUIA */
    .guide-card { border-color: rgba(133,92,214,0.15); background: linear-gradient(135deg, rgba(133,92,214,0.04), #fff); }
    .guide-body { font-size: 0.95rem; color: var(--text-secondary); line-height: 1.75; margin: 0; }

    /* CONTEXT */
    .context-body { background: rgba(133,92,214,0.03); border-left: 4px solid var(--accent-primary); border-radius: 0 12px 12px 0; padding: 1.25rem; }
    .context-body p { font-size: 0.93rem; color: var(--text-primary); line-height: 1.9; margin: 0; font-style: italic; }

    /* TIPS */
    .tips-list { display: flex; flex-direction: column; gap: 0.6rem; }
    .tip-item { display: flex; align-items: flex-start; gap: 0.85rem; padding: 0.85rem 1rem; background: rgba(0,0,0,0.015); border-radius: 12px; transition: all 0.2s; }
    .tip-item:hover { background: rgba(133,92,214,0.04); transform: translateX(4px); }
    .tip-num { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.78rem; font-weight: 800; color: #fff; flex-shrink: 0; margin-top: 0.1rem; }
    .tip-item p { font-size: 0.9rem; color: var(--text-primary); line-height: 1.6; margin: 0; }

    /* CTA */
    .cta-section { margin: 2rem 0; animation: fadeSlide 0.5s ease-out 0.2s both; }
    .cta-card { text-align: center; background: linear-gradient(135deg, rgba(133,92,214,0.06), rgba(133,92,214,0.02)); border: 2px dashed rgba(133,92,214,0.2); border-radius: 20px; padding: 2.5rem 2rem; }
    .cta-icon { font-size: 2.5rem; margin-bottom: 0.75rem; animation: ctaBounce 2s ease-in-out infinite; }
    .cta-card h3 { font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin: 0 0 0.5rem; }
    .cta-card p { font-size: 0.88rem; color: var(--text-secondary); margin: 0 0 1.5rem; }
    .btn-start-test { padding: 1rem 2.5rem; border-radius: 999px; border: none; background: var(--accent-primary); color: #fff; font-family: var(--font-heading); font-weight: 800; font-size: 1.05rem; cursor: pointer; box-shadow: 0 5px 0 #6b46b8; transition: all 0.2s; animation: testPulse 2s ease-in-out infinite; }
    .btn-start-test:hover { transform: translateY(3px); box-shadow: 0 2px 0 #6b46b8; }
    .btn-back-text { background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: 0.9rem; padding: 0; margin-top: 1rem; }
    .btn-back-text:hover { color: var(--accent-primary); }

    @keyframes fadeSlide { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes ctaBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
    @keyframes testPulse { 0%, 100% { box-shadow: 0 5px 0 #6b46b8, 0 0 0 0 rgba(133,92,214,0.3); } 50% { box-shadow: 0 5px 0 #6b46b8, 0 0 0 10px rgba(133,92,214,0); } }
    @media (max-width: 640px) { .cta-card { padding: 2rem 1.25rem; } }
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
    // Bold para **texto** markdown
    return text.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--accent-primary)">$1</strong>');
  }
}
