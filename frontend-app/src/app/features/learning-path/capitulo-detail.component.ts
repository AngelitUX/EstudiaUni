import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PaesContentService } from './services/paes-content.service';
import { KatexService } from '../../core/services/katex.service';

@Component({
  selector: 'app-capitulo-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="guidebook-page" *ngIf="capitulo() as cap">
      
      <!-- BREADCRUMB & HEADER -->
      <nav class="guide-nav">
        <button class="btn-back" (click)="goBack()">← Volver a la ruta</button>
      </nav>

      <header class="guide-hero">
        <div class="hero-icon">📖</div>
        <h1>Guía de Estudio: {{ cap.title }}</h1>
        <p class="hero-intro">{{ cap.introduccion }}</p>
      </header>

      <!-- CONTENT BODY -->
      <main class="guide-content">
        
        <!-- Iterate through sections to show theory -->
        <div *ngFor="let sec of cap.secciones; let i = index" class="theory-section">
          <h2 class="sec-title"><span class="sec-num">{{ i + 1 }}</span> {{ sec.title }}</h2>
          <div class="sec-intro">
            <p [innerHTML]="parseMixed(sec.introduccion)"></p>
          </div>

          <!-- Tips & Examples -->
          <div class="tips-box" *ngIf="sec.datos_claves && sec.datos_claves.length > 0">
            <h3>💡 Conceptos Clave & Ejemplos</h3>
            <ul class="tips-list">
              <li *ngFor="let dato of sec.datos_claves">
                <span [innerHTML]="parseMixed(dato)"></span>
              </li>
            </ul>
          </div>
        </div>

        <!-- CTA TO PRACTICE -->
        <div class="cta-bottom">
          <p>¿Terminaste de repasar la teoría?</p>
          <button class="btn-primary-lg" (click)="goBack()">¡Empezar a Practicar!</button>
        </div>

      </main>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: #ffffff; }
    .guidebook-page { max-width: 800px; margin: 0 auto; padding: 2rem 1.5rem 6rem; }

    /* NAV */
    .guide-nav { margin-bottom: 2rem; }
    .btn-back { background: transparent; border: none; font-size: 0.95rem; font-weight: 700; color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0; transition: all 0.2s; }
    .btn-back:hover { color: var(--accent-primary); transform: translateX(-4px); }

    /* HERO */
    .guide-hero { text-align: center; padding: 3rem 1rem; background: linear-gradient(135deg, rgba(133,92,214,0.05), rgba(133,92,214,0.15)); border-radius: 24px; margin-bottom: 3rem; border: 2px solid rgba(133,92,214,0.1); }
    .hero-icon { font-size: 3.5rem; margin-bottom: 1rem; line-height: 1; filter: drop-shadow(0 4px 12px rgba(133,92,214,0.2)); }
    .guide-hero h1 { font-family: var(--font-heading); font-size: 2.25rem; font-weight: 800; color: var(--text-primary); margin: 0 0 1rem; }
    .hero-intro { font-size: 1.1rem; color: var(--text-secondary); max-width: 600px; margin: 0 auto; line-height: 1.6; }

    /* CONTENT */
    .theory-section { margin-bottom: 4rem; position: relative; padding-left: 2rem; }
    .theory-section::before { content: ''; position: absolute; left: 0; top: 0; bottom: -2rem; width: 4px; background: rgba(0,0,0,0.05); border-radius: 4px; }
    .theory-section:last-child::before { display: none; }

    .sec-title { display: flex; align-items: center; gap: 1rem; font-family: var(--font-heading); font-size: 1.4rem; font-weight: 800; color: var(--text-primary); margin: 0 0 1.5rem; }
    .sec-num { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; background: var(--accent-primary); color: #fff; border-radius: 50%; font-size: 1rem; font-weight: 800; box-shadow: 0 4px 12px rgba(133,92,214,0.3); }
    
    .sec-intro p { font-size: 1.05rem; line-height: 1.7; color: var(--text-primary); margin-bottom: 1.5rem; }

    /* TIPS BOX */
    .tips-box { background: rgba(255, 200, 0, 0.1); border: 2px solid rgba(255, 200, 0, 0.3); border-radius: 16px; padding: 1.5rem; margin-top: 2rem; }
    .tips-box h3 { font-family: var(--font-heading); font-size: 1.1rem; font-weight: 800; color: #b8860b; margin: 0 0 1rem; }
    .tips-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 1rem; }
    .tips-list li { position: relative; padding-left: 1.5rem; font-size: 1rem; color: var(--text-primary); line-height: 1.5; }
    .tips-list li::before { content: '•'; position: absolute; left: 0; top: 0; color: #ffc800; font-size: 1.5rem; line-height: 1; font-weight: bold; }

    /* CTA */
    .cta-bottom { text-align: center; margin-top: 5rem; padding-top: 3rem; border-top: 2px dashed rgba(0,0,0,0.1); }
    .cta-bottom p { font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 1.5rem; font-weight: 600; }
    .btn-primary-lg { background: #58cc02; color: #fff; font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; padding: 1rem 2rem; border-radius: 16px; border: none; box-shadow: 0 6px 0 #46a302; cursor: pointer; transition: all 0.2s; }
    .btn-primary-lg:hover { transform: translateY(-2px); box-shadow: 0 8px 0 #46a302; }
    .btn-primary-lg:active { transform: translateY(4px); box-shadow: 0 2px 0 #46a302; }

    @media (max-width: 768px) {
      .guide-hero { padding: 2rem 1rem; }
      .guide-hero h1 { font-size: 1.75rem; }
      .theory-section { padding-left: 0; }
      .theory-section::before { display: none; }
    }
  `]
})
export class CapituloDetailComponent {
  private paes = inject(PaesContentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private katexSvc = inject(KatexService);
  private sanitizer = inject(DomSanitizer);

  materiaId = signal('');
  capituloId = signal('');

  materia = computed(() => this.paes.getMateriaById(this.materiaId()));
  capitulo = computed(() => this.paes.getCapitulosByMateria(this.materiaId()).find(c => c.id === this.capituloId()));

  constructor() {
    this.materiaId.set(this.route.snapshot.paramMap.get('materiaId') || '');
    this.capituloId.set(this.route.snapshot.paramMap.get('capituloId') || '');
  }

  goBack() {
    this.router.navigate(['/ruta', this.materiaId()]);
  }

  parseMixed(text: string | undefined): SafeHtml {
    if (!text) return '';
    // Procesamos el LaTeX primero (que también escapa el HTML)
    const renderedSafe = this.katexSvc.renderMixedText(text);
    const rendered = (renderedSafe as any)?.changingThisBreaksApplicationSecurity || String(renderedSafe);
    // Luego procesamos las negritas (**texto**)
    const bolded = rendered.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    const withBreaks = bolded.replace(/&lt;br&gt;/g, '<br>');
    // Lo marcamos como HTML seguro
    return this.sanitizer.bypassSecurityTrustHtml(withBreaks);
  }
}
