import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PaesContentService } from './services/paes-content.service';
import { KatexService } from '../../core/services/katex.service';
import { GuideSlidesComponent } from './guide-slides.component';
import { LOCALIZAR_SLIDES, SLIDE5_QUIZ, SLIDE_QUIZ2, CAP1_SUMMARY_SLIDES, CAP2_SUMMARY_SLIDES, CAP3_SUMMARY_SLIDES, HIST_CAP1_SUMMARY_SLIDES, HIST_CAP2_SUMMARY_SLIDES, HIST_CAP3_SUMMARY_SLIDES, HIST_CAP4_SUMMARY_SLIDES, HIST_CAP5_SUMMARY_SLIDES } from './guide-slides-data';

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
        <h1>Resumen: {{ cap.title }}</h1>
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
          <div *ngFor="let sec of getTheorySections(cap); let i = index" class="theory-card">
            <h2 class="sec-title"><span class="sec-num">{{ i + 1 }}</span> {{ sec.title }}</h2>
            <div class="theory-card-content">
              <div class="theory-text">
                <p class="theory-intro" [innerHTML]="parseMixed(sec.introduccion)"></p>
                <div class="tips-box" *ngIf="sec.datos_claves && sec.datos_claves.length > 0">
                  <h3>💡 Conceptos clave:</h3>
                  <ul class="tips-list">
                    <li *ngFor="let dato of sec.datos_claves">
                      <span [innerHTML]="parseMixed(dato)"></span>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="theory-image-container" *ngIf="sec.imageUrl">
                <img [src]="sec.imageUrl" alt="Imagen {{ sec.title }}" class="theory-image">
              </div>
              <div class="theory-svg-container" *ngIf="sec.svgContent">
                <div [innerHTML]="renderSvg(sec.svgContent)" class="theory-svg"></div>
              </div>
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
    .theory-card { background: #ffffff; border-radius: 20px; padding: 2.5rem; margin-bottom: 2.5rem; box-shadow: 0 10px 40px rgba(0,0,0,0.04); border: 1px solid rgba(0,0,0,0.05); transition: transform 0.3s ease, box-shadow 0.3s ease; }
    .theory-card:hover { transform: translateY(-4px); box-shadow: 0 16px 50px rgba(133,92,214,0.1); border-color: rgba(133,92,214,0.2); }
    
    .sec-title { font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: var(--text-primary); margin: 0 0 1.5rem; display: flex; align-items: center; gap: 1rem; }
    .sec-num { width: 38px; height: 38px; border-radius: 12px; background: linear-gradient(135deg, var(--accent-primary), #6b47b8); color: #fff; font-size: 1.2rem; font-weight: 900; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(133,92,214,0.4); flex-shrink: 0; }
    
    .theory-card-content { display: grid; grid-template-columns: 1fr; gap: 2rem; }
    @media (min-width: 768px) {
      .theory-card-content { grid-template-columns: 1.2fr 1fr; }
    }
    
    .theory-intro { font-size: 1.1rem; color: var(--text-secondary); line-height: 1.7; margin: 0 0 1.5rem; }
    
    .theory-image-container, .theory-svg-container { display: flex; align-items: flex-start; justify-content: center; }
    .theory-image { width: 100%; max-width: 320px; border-radius: 16px; box-shadow: 0 12px 30px rgba(0,0,0,0.08); border: 4px solid rgba(255,255,255,0.8); object-fit: cover; }
    .theory-svg { width: 100%; max-width: 380px; }
    
    /* TIPS BOX REDESIGN */
    .tips-box { background: linear-gradient(135deg, rgba(28, 176, 246, 0.05), rgba(28, 176, 246, 0.1)); border-radius: 16px; padding: 1.5rem; border-left: 4px solid #1cb0f6; }
    .tips-box h3 { font-family: var(--font-heading); font-size: 1.05rem; font-weight: 800; color: #158bc2; margin: 0 0 1rem; text-transform: uppercase; letter-spacing: 0.5px; }
    .tips-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.75rem; }
    .tips-list li { position: relative; padding-left: 1.5rem; font-size: 0.95rem; color: var(--text-primary); line-height: 1.5; font-weight: 500; }
    .tips-list li::before { content: '→'; position: absolute; left: 0; top: 0; color: #1cb0f6; font-size: 1.1rem; font-weight: 900; line-height: 1.4; }

    /* CTA */
    .cta-bottom { text-align: center; margin-top: 5rem; padding-top: 3rem; border-top: 2px dashed rgba(0,0,0,0.1); }
    .cta-bottom p { font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 1.5rem; font-weight: 600; }
    .btn-primary-lg { background: #58cc02; color: #fff; font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; padding: 1rem 2rem; border-radius: 16px; border: none; box-shadow: 0 6px 0 #46a302; cursor: pointer; transition: all 0.2s; }
    .btn-primary-lg:hover { transform: translateY(-2px); box-shadow: 0 8px 0 #46a302; }
    .btn-primary-lg:active { transform: translateY(4px); box-shadow: 0 2px 0 #46a302; }

    @media (max-width: 768px) {
      .guide-hero { padding: 2rem 1rem; }
      .guide-hero h1 { font-size: 1.75rem; }
      .theory-card { padding: 1.5rem; }
      .theory-card-content { grid-template-columns: 1fr; }
    }
  `]
})
export class CapituloDetailComponent {
  private paes = inject(PaesContentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private katexSvc = inject(KatexService);
  private sanitizer = inject(DomSanitizer);

  tipColors = ['#855cd6', '#1cb0f6', '#ff9600', '#58cc02', '#ef4444'];

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
    if (this.materiaId()) {
      // Guardar la posición de scroll antes de volver para restaurarla
      sessionStorage.setItem('ruta_scroll_' + this.materiaId(), String(window.scrollY));
      this.router.navigate(['/ruta', this.materiaId()], { fragment: this.capituloId() });
    } else {
      this.router.navigate(['/ruta']);
    }
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

  renderSvg(svg: string | undefined): SafeHtml {
    if (!svg) return '';
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  finishGuide() {
    const capId = this.capituloId();
    this.paes.markSeccionCompleted('guide_' + capId);
    
    const cap = this.capitulo();
    const matId = this.materiaId();

    if (cap && cap.secciones && cap.secciones.length > 0) {
      const uncompletedSec = cap.secciones.find(s => !this.paes.getSeccionProgress(s.id)?.completed);
      const targetSec = uncompletedSec || cap.secciones[0];
      this.router.navigate(['/ruta', matId, cap.id, targetSec.id]);
    } else {
      const nextUrl = this.paes.getNextNodeUrl(matId);
      if (nextUrl) {
        this.router.navigate(nextUrl);
      } else {
        this.router.navigate(['/ruta', matId]);
      }
    }
  }

  highlightBold(text: string): string {
    return text.replace(/\*\*(.*?)\*\*/gs, '<strong>$1</strong>');
  }

  // --- SLIDE HELPERS ---
  hasSlides(cap: any): boolean {
    return cap.id === 'cap-localizar' || cap.id === 'cap-1'
      || (cap.slides && cap.slides.length > 0)
      || (cap.secciones && cap.secciones.length > 0);
  }

  getSlides(cap: any): any[] {
    if (cap.id === 'cap-localizar' || cap.id === 'cap-1') return CAP1_SUMMARY_SLIDES;
    if (cap.id === 'cap-interpretar' || cap.id === 'cap-2') return CAP2_SUMMARY_SLIDES;
    if (cap.id === 'cap-evaluar' || cap.id === 'cap-3') return CAP3_SUMMARY_SLIDES;
    if (cap.id === 'cap-hist-1') return HIST_CAP1_SUMMARY_SLIDES;
    if (cap.id === 'cap-hist-2') return HIST_CAP2_SUMMARY_SLIDES;
    if (cap.id === 'cap-hist-3') return HIST_CAP3_SUMMARY_SLIDES;
    if (cap.id === 'cap-hist-4') return HIST_CAP4_SUMMARY_SLIDES;
    if (cap.id === 'cap-hist-5') return HIST_CAP5_SUMMARY_SLIDES;
    if (cap.slides && cap.slides.length > 0) return cap.slides;
    if (cap.secciones && cap.secciones.length > 0) return this.buildDynamicSlides(cap);
    return [];
  }

  getTheorySections(cap: any): any[] {
    if (!cap.secciones) return [];
    // Hide practices, bosses, and roots from the theory summary list
    return cap.secciones.filter((sec: any) => 
      !sec.isPractice && 
      !sec.id.includes('boss') && 
      !sec.id.includes('root')
    );
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
    const intro = sec.introduccion ? `<p class="theory-intro">${sec.introduccion}</p>` : '';
    const bullets = (sec.datos_claves || [])
      .map((dato: string) => `<li>${dato}</li>`)
      .join('');
    const tips = bullets
      ? `<div class="tips-box-premium"><h3>💡 Conceptos clave:</h3><ul class="tips-list-premium">${bullets}</ul></div>`
      : '';
    const imgHtml = sec.imageUrl ? `<div class="slide-image-wrap-large"><img src="${sec.imageUrl}" class="slide-image-premium" alt="Imagen ${sec.title}"></div>` : '';
    const svgHtml = sec.svgContent ? `<div class="slide-svg-wrap-large">${sec.svgContent}</div>` : '';

    return `${intro}${tips}${imgHtml}${svgHtml}`;
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
