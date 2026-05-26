import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PaesContentService } from './services/paes-content.service';
import { KatexService } from '../../core/services/katex.service';
import { GuideSlidesComponent } from './guide-slides.component';
import { LOCALIZAR_SLIDES, SLIDE5_QUIZ, SLIDE_QUIZ2 } from './guide-slides-data';

@Component({
  selector: 'app-capitulo-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, GuideSlidesComponent],
  template: `
    <div class="guidebook-page animate-enter" *ngIf="capitulo() as cap">
      
      <!-- BREADCRUMB & HEADER -->
      <div class="guide-nav-container">
        <button class="btn-back" (click)="goBack()">← Volver a la ruta</button>
        
        <div class="materia-progress-mini" *ngIf="materiaProgress() as progress">
          <span class="progress-pct">{{ progress.percentage }}% Completado</span>
          <div class="progress-bar-mini">
            <div class="progress-fill-mini" [style.width.%]="progress.percentage"></div>
          </div>
        </div>
      </div>

      <!-- Hero only for generic chapters -->
      <header class="guide-hero" *ngIf="!hasSlides(cap)">
        <div class="hero-icon">📖</div>
        <h1>Guía de Estudio: {{ cap.title }}</h1>
        <p class="hero-intro">{{ cap.introduccion }}</p>
      </header>

      <!-- CONTENT BODY -->
      <main class="guide-content">
        
        <!-- INTERACTIVE SLIDES -->
        <ng-container *ngIf="hasSlides(cap)">
          <app-guide-slides 
            [slides]="getSlides(cap)" 
            [quizzes]="getQuizzes(cap)" 
            (onFinish)="finishGuide()">
          </app-guide-slides>
        </ng-container>

        <!-- GENERIC SECTIONS for other chapters -->
        <ng-container *ngIf="!hasSlides(cap)">
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
        </ng-container>

        <!-- CTA TO PRACTICE (only for non-slide guides) -->
        <div class="cta-bottom" *ngIf="!hasSlides(cap)">
          <p>¿Terminaste de repasar la teoría?</p>
          <button class="btn-primary-lg" (click)="finishGuide()">¡Empezar a Practicar!</button>
        </div>

      </main>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: #ffffff; }
    .guidebook-page { max-width: 800px; margin: 0 auto; padding: 2rem 1.5rem 6rem; }
    .animate-enter { animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    @keyframes slideUpFade { from { opacity: 0; transform: translateY(30px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }

    /* NAV */
    .guide-nav-container { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
    .btn-back { background: transparent; border: none; font-size: 0.95rem; font-weight: 700; color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0; transition: all 0.2s; }
    .btn-back:hover { color: var(--accent-primary); transform: translateX(-4px); }

    .materia-progress-mini { display: flex; align-items: center; gap: 0.75rem; background: rgba(133,92,214,0.04); padding: 0.4rem 0.85rem; border-radius: 99px; border: 1px solid rgba(133,92,214,0.08); }
    .progress-pct { font-size: 0.75rem; font-weight: 800; color: var(--accent-primary); }
    .progress-bar-mini { width: 80px; height: 6px; background: rgba(0, 0, 0, 0.06); border-radius: 99px; overflow: hidden; }
    .progress-fill-mini { height: 100%; background: linear-gradient(90deg, var(--accent-primary), #58cc02); border-radius: 99px; transition: width 0.4s ease; }

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
  materiaProgress = computed(() => {
    const id = this.materiaId();
    if (!id) return { completed: 0, total: 0, percentage: 0 };
    return this.paes.getMateriaProgress(id);
  });
  capitulo = computed(() => this.paes.getCapitulosByMateria(this.materiaId()).find(c => c.id === this.capituloId()));

  constructor() {
    this.route.paramMap.subscribe(params => {
      this.materiaId.set(params.get('materiaId') || '');
      this.capituloId.set(params.get('capituloId') || '');
    });
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
    const bolded = rendered.replace(/\*\*(.*?)\*\*/gs, '<strong>$1</strong>');
    const withBreaks = bolded.replace(/&lt;br&gt;/g, '<br>');
    // Lo marcamos como HTML seguro
    return this.sanitizer.bypassSecurityTrustHtml(withBreaks);
  }

  finishGuide() {
    this.paes.markSeccionCompleted('guide_' + this.capituloId());
    const nextUrl = this.paes.getNextNodeUrl(this.materiaId());
    if (nextUrl) {
      this.router.navigate(nextUrl);
    } else {
      this.router.navigate(['/ruta', this.materiaId()]);
    }
  }

  highlightBold(text: string): string {
    return text.replace(/\*\*(.*?)\*\*/gs, '<strong>$1</strong>');
  }

  // --- SLIDE HELPERS ---
  hasSlides(cap: any): boolean {
    return cap.id === 'cap-localizar'
      || (cap.slides && cap.slides.length > 0)
      || (cap.secciones && cap.secciones.length > 0);
  }

  getSlides(cap: any): any[] {
    if (cap.id === 'cap-localizar') return LOCALIZAR_SLIDES;
    if (cap.slides && cap.slides.length > 0) return cap.slides;
    if (cap.secciones && cap.secciones.length > 0) return this.buildDynamicSlides(cap);
    return [];
  }

  getQuizzes(cap: any): any {
    if (cap.id === 'cap-localizar') {
      return { quiz1: SLIDE5_QUIZ, quiz2: SLIDE_QUIZ2 };
    }
    return cap.quizzes || {};
  }

  private buildDynamicSlides(cap: any): any[] {
    if (!cap?.secciones || cap.secciones.length === 0) return [];
    return cap.secciones.map((sec: any, index: number) => {
      const theme = this.getSlideTheme(index);
      return {
        icon: this.getSlideIcon(index),
        title: sec.title,
        bgGradient: theme.bgGradient,
        iconBg: theme.iconBg,
        content: this.buildDynamicSlideContent(sec)
      };
    });
  }

  private buildDynamicSlideContent(sec: any): string {
    const intro = sec.introduccion ? `<p>${sec.introduccion}</p>` : '';
    const bullets = (sec.datos_claves || [])
      .map((dato: string) => `<li>${dato}</li>`)
      .join('');
    const tips = bullets
      ? `<div class="callout-gold"><strong>Conceptos clave:</strong><ul>${bullets}</ul></div>`
      : '';
    return `${intro}${tips}`;
  }

  private getSlideIcon(index: number): string {
    const icons = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
    return icons[index] || '📘';
  }

  private getSlideTheme(index: number): { bgGradient: string; iconBg: string } {
    const themes = [
      {
        bgGradient: 'linear-gradient(135deg, rgba(133,92,214,0.06), rgba(133,92,214,0.02))',
        iconBg: 'linear-gradient(135deg, #855cd6, #6b46b8)'
      },
      {
        bgGradient: 'linear-gradient(135deg, rgba(255,200,0,0.08), rgba(255,200,0,0.02))',
        iconBg: 'linear-gradient(135deg, #ffc800, #e0a800)'
      },
      {
        bgGradient: 'linear-gradient(135deg, rgba(28,176,246,0.06), rgba(28,176,246,0.02))',
        iconBg: 'linear-gradient(135deg, #1cb0f6, #0d8ecf)'
      },
      {
        bgGradient: 'linear-gradient(135deg, rgba(88,204,2,0.06), rgba(88,204,2,0.02))',
        iconBg: 'linear-gradient(135deg, #58cc02, #46a302)'
      }
    ];
    return themes[index % themes.length];
  }
}
