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
        <a routerLink="/ruta">{{ materia()?.title }}</a>
        <span class="sep">›</span>
        <a [routerLink]="['/ruta', materiaId(), capituloId()]">Capítulo {{ capOrder() }}</a>
        <span class="sep">›</span>
        <span class="current">Sección {{ sec.order }}</span>
      </nav>

      <!-- TOP -->
      <div class="sec-top">
        <p class="sec-cap-label">{{ capitulo()?.title }}</p>
        <h1>{{ sec.title }}</h1>
        <p class="sec-intro-text">{{ sec.introduccion }}</p>
      </div>

      <!-- DATOS CLAVES -->
      <div class="section-block">
        <h3 class="block-title">🔑 Claves para esta habilidad</h3>
        <div class="datos-claves">
          <div *ngFor="let dato of sec.datos_claves; let i = index" class="dato-card">
            <div class="dato-num" [style.background]="barColors[i % barColors.length]">{{ i + 1 }}</div>
            <div class="dato-content">
              <p [innerHTML]="highlightBold(dato)"></p>
            </div>
          </div>
        </div>
      </div>

      <!-- CONTEXTO BASE -->
      <div class="section-block" *ngIf="sec.test.contexto_base">
        <h3 class="block-title">📄 Texto de práctica</h3>
        <div class="contexto-box">
          <p>{{ sec.test.contexto_base }}</p>
        </div>
        <div class="context-meta">
          <span>{{ sec.test.preguntas.length }} {{ sec.test.preguntas.length === 1 ? 'pregunta' : 'preguntas' }} sobre este texto</span>
          <span class="dot">·</span>
          <span>~3-5 minutos</span>
        </div>
      </div>

      <!-- CTA -->
      <div class="cta-block">
        <div class="cta-info">
          <span class="cta-icon">🎯</span>
          <div>
            <strong>¿Listo para el test?</strong>
            <p>Responde {{ sec.test.preguntas.length }} pregunta{{ sec.test.preguntas.length !== 1 ? 's' : '' }} sobre el texto de arriba.</p>
          </div>
        </div>
        <button class="btn-primary-lg" (click)="goToTest()">Comenzar test →</button>
      </div>

      <button class="btn-back-text" [routerLink]="['/ruta', materiaId(), capituloId()]">← Volver al capítulo</button>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: var(--bg-color, #fdf9f1); }
    .sec-page { max-width: 800px; margin: 0 auto; padding: 1.5rem 1.5rem 5rem; }

    .breadcrumb { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .breadcrumb a { color: var(--text-secondary); text-decoration: none; }
    .breadcrumb a:hover { color: var(--accent-primary); }
    .sep { color: rgba(0,0,0,0.2); }
    .current { color: var(--text-primary); font-weight: 600; }

    /* TOP */
    .sec-top { margin-bottom: 2rem; }
    .sec-cap-label { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--accent-primary); background: rgba(133,92,214,0.1); display: inline-block; padding: 0.2rem 0.7rem; border-radius: 6px; margin-bottom: 0.75rem; }
    .sec-top h1 { font-family: var(--font-heading); font-size: 1.7rem; font-weight: 800; color: var(--text-primary); margin: 0 0 0.75rem; line-height: 1.2; }
    .sec-intro-text { font-size: 0.97rem; color: var(--text-secondary); line-height: 1.7; margin: 0; max-width: 620px; }

    /* BLOCKS */
    .section-block { margin-bottom: 2rem; }
    .block-title { font-family: var(--font-heading); font-size: 1rem; font-weight: 700; color: var(--text-primary); margin: 0 0 1rem; }

    /* DATOS CLAVES */
    .datos-claves { display: flex; flex-direction: column; gap: 0.65rem; }
    .dato-card { display: flex; align-items: flex-start; gap: 1rem; background: #fff; border: 2px solid rgba(0,0,0,0.05); border-radius: 14px; padding: 1rem 1.25rem; transition: all 0.2s; }
    .dato-card:hover { border-color: rgba(133,92,214,0.2); box-shadow: 0 3px 12px rgba(133,92,214,0.07); }
    .dato-num { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 800; color: #fff; flex-shrink: 0; margin-top: 0.1rem; }
    .dato-content { flex: 1; }
    .dato-content p { font-size: 0.93rem; color: var(--text-primary); line-height: 1.6; margin: 0; }
    .dato-content strong { color: var(--accent-primary); }

    /* CONTEXTO */
    .contexto-box { background: #fff; border: 2px solid rgba(0,0,0,0.06); border-radius: 14px; padding: 1.5rem; border-left: 4px solid var(--accent-primary); }
    .contexto-box p { font-size: 0.95rem; color: var(--text-primary); line-height: 1.8; margin: 0; font-style: italic; }
    .context-meta { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.75rem; font-size: 0.8rem; color: var(--text-secondary); }
    .dot { opacity: 0.4; }

    /* CTA */
    .cta-block { background: linear-gradient(135deg, rgba(133,92,214,0.08), rgba(133,92,214,0.04)); border: 2px solid rgba(133,92,214,0.15); border-radius: 16px; padding: 1.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
    .cta-info { display: flex; align-items: center; gap: 1rem; flex: 1; min-width: 0; }
    .cta-icon { font-size: 2rem; flex-shrink: 0; }
    .cta-info strong { display: block; font-family: var(--font-heading); font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.2rem; }
    .cta-info p { font-size: 0.85rem; color: var(--text-secondary); margin: 0; }
    .btn-primary-lg { padding: 0.9rem 2rem; border-radius: 999px; border: none; background: var(--accent-primary); color: #fff; font-weight: 700; font-size: 1rem; cursor: pointer; box-shadow: 0 4px 0 #6b46b8; transition: all 0.2s; white-space: nowrap; }
    .btn-primary-lg:hover { transform: translateY(2px); box-shadow: 0 2px 0 #6b46b8; }

    .btn-back-text { background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: 0.9rem; padding: 0; }
    .btn-back-text:hover { color: var(--accent-primary); }

    @media (max-width: 640px) {
      .cta-block { flex-direction: column; }
      .btn-primary-lg { width: 100%; text-align: center; }
    }
  `]
})
export class SeccionDetailComponent {
  private paes = inject(PaesContentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  barColors = ['#855cd6', '#1cb0f6', '#ff9600', '#10b981', '#ef4444'];

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
    return text.replace(/(".*?")/g, '<strong>$1</strong>');
  }
}
