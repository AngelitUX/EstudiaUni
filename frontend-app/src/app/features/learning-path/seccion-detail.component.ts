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
        <div class="sec-top-left">
          <p class="sec-cap-label">Capítulo: {{ capitulo()?.title }}</p>
          <h1>{{ sec.title }}</h1>
        </div>
        <button class="btn-start-test" (click)="goToTest()">
          ▶ Comenzar test
          <span class="btn-sub">{{ sec.test.preguntas.length }} preguntas</span>
        </button>
      </div>

      <!-- DATOS CLAVES -->
      <div class="datos-claves">
        <div *ngFor="let dato of sec.datos_claves; let i = index" class="dato-card">
          <div class="dato-bar" [style.background]="barColors[i % barColors.length]"></div>
          <div class="dato-content">
            <p [innerHTML]="highlightBold(dato)"></p>
          </div>
        </div>
      </div>

      <!-- CONTEXTO BASE -->
      <div class="contexto-section" *ngIf="sec.test.contexto_base">
        <h3>📄 Texto de trabajo</h3>
        <div class="contexto-box">
          <p>{{ sec.test.contexto_base }}</p>
        </div>
      </div>

      <div class="bottom-actions">
        <button class="btn-back" [routerLink]="['/ruta', materiaId(), capituloId()]">← Volver al capítulo</button>
        <button class="btn-primary-lg" (click)="goToTest()">🚀 Comenzar Test</button>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: var(--bg-color, #fdf9f1); }
    .sec-page { max-width: 860px; margin: 0 auto; padding: 1.5rem 1.5rem 4rem; }

    .breadcrumb { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .breadcrumb a { color: var(--text-secondary); text-decoration: none; }
    .breadcrumb a:hover { color: var(--accent-primary); }
    .sep { color: rgba(0,0,0,0.2); }
    .current { color: var(--text-primary); font-weight: 600; }

    .sec-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
    .sec-cap-label { font-size: 0.85rem; color: var(--text-secondary); margin: 0 0 0.3rem; }
    .sec-top h1 { font-family: var(--font-heading); font-size: 1.6rem; font-weight: 700; color: var(--text-primary); margin: 0; }
    .btn-start-test { display: flex; flex-direction: column; align-items: center; gap: 0.2rem; padding: 0.8rem 1.6rem; border-radius: 12px; border: none; background: var(--accent-primary); color: #fff; font-weight: 700; font-size: 1rem; cursor: pointer; box-shadow: 0 4px 0 #6b46b8; transition: all 0.2s; white-space: nowrap; flex-shrink: 0; }
    .btn-start-test:hover { transform: translateY(2px); box-shadow: 0 2px 0 #6b46b8; }
    .btn-sub { font-size: 0.75rem; font-weight: 500; opacity: 0.8; }

    /* DATOS CLAVES */
    .datos-claves { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem; }
    .dato-card { display: flex; gap: 1rem; background: #fff; border: 2px solid rgba(0,0,0,0.04); border-radius: 14px; padding: 1.25rem 1.5rem; transition: all 0.2s; }
    .dato-card:hover { border-color: rgba(133,92,214,0.15); box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
    .dato-bar { width: 4px; border-radius: 99px; flex-shrink: 0; }
    .dato-content { flex: 1; }
    .dato-content p { font-size: 0.95rem; color: var(--text-primary); line-height: 1.6; margin: 0; }

    /* CONTEXTO */
    .contexto-section { margin-bottom: 2rem; }
    .contexto-section h3 { font-family: var(--font-heading); font-size: 1.1rem; font-weight: 700; margin: 0 0 0.75rem; color: var(--text-primary); }
    .contexto-box { background: #fff; border: 2px solid rgba(0,0,0,0.06); border-radius: 14px; padding: 1.5rem; }
    .contexto-box p { font-size: 0.92rem; color: var(--text-secondary); line-height: 1.7; margin: 0; white-space: pre-line; }

    .bottom-actions { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; }
    .btn-back { background: none; border: none; color: var(--text-secondary); cursor: pointer; font-size: 0.9rem; padding: 0; }
    .btn-back:hover { color: var(--accent-primary); }
    .btn-primary-lg { padding: 1rem 2rem; border-radius: 999px; border: none; background: var(--accent-primary); color: #fff; font-weight: 700; font-size: 1rem; cursor: pointer; box-shadow: 0 4px 0 #6b46b8; transition: all 0.2s; }
    .btn-primary-lg:hover { transform: translateY(2px); box-shadow: 0 2px 0 #6b46b8; }

    @media (max-width: 640px) {
      .sec-top { flex-direction: column; }
      .bottom-actions { flex-direction: column; align-items: stretch; }
      .btn-primary-lg { text-align: center; }
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
