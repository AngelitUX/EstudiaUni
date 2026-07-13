import { Component, inject, signal, computed, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PaesContentService } from './services/paes-content.service';
import { KatexService } from '../../core/services/katex.service';
import { SynonymPracticeComponent } from './synonym-practice.component';

@Component({
  selector: 'app-seccion-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, SynonymPracticeComponent],
  template: `
    <div class="sec-page" *ngIf="seccion() as sec">
      <!-- TOP NAV -->
      <div class="guide-nav-container">
        <button class="btn-back" (click)="goBack()">← Volver a la ruta</button>
        
        <div class="materia-progress-mini" *ngIf="materiaProgress() as progress">
          <span class="progress-pct">{{ progress.percentage }}% Completado</span>
          <div class="progress-bar-mini">
            <div class="progress-fill-mini" [style.width.%]="progress.percentage"></div>
          </div>
        </div>
      </div>
      <!-- BREADCRUMB -->
      <nav class="breadcrumb">
        <a routerLink="/dashboard">🏠</a>
        <span class="sep">›</span>
        <a [routerLink]="['/ruta', materiaId()]">{{ materia()?.title }}</a>
        <span class="sep">›</span>
        <span class="current">Capítulo {{ capOrder() }}</span>
      </nav>

      <!-- LESSON HEADER -->
      <div class="lesson-header" style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem;">
        <div>
          <span class="lesson-badge">{{ capitulo()?.title }}</span>
          <h1>{{ sec.title }}</h1>
        </div>

        <!-- VOICE CONTROLS (Collapsible) -->
        <div class="voice-dropdown-container" *ngIf="!isMathModule()">
          <button class="btn-voice-toggle" (click)="voiceMenuOpen = !voiceMenuOpen">
            🎧 Audio descriptivo <span class="arrow" [class.open]="voiceMenuOpen">▼</span>
          </button>
          <div class="voice-dropdown-menu" [class.open]="voiceMenuOpen">
            <button class="btn-voice" (click)="readGuide()" title="Leer guía (Tecla 1)">🔊 1. Qué aprenderás</button>
            <button class="btn-voice" *ngIf="sec.test?.contexto_base" (click)="readContext()" title="Leer texto (Tecla 2)">🔊 2. Texto práctica</button>
            <button class="btn-voice" *ngIf="sec.datos_claves?.length" (click)="readTips()" title="Leer tips (Tecla 3)">🔊 3. Tips clave</button>
            <button class="btn-voice btn-stop" (click)="stopReading()" title="Detener (Tecla 4)">⏹️ 4. Detener</button>
          </div>
        </div>
      </div>

      <!-- PRACTICE MODE (Synonym Game etc.) -->
      <ng-container *ngIf="sec.isPractice && sec.practiceType === 'synonyms'">
        <div class="content-card practice-card">
          <app-synonym-practice (onComplete)="completePractice()"></app-synonym-practice>
        </div>
      </ng-container>

      <!-- NORMAL SECTION CONTENT -->
      <ng-container *ngIf="!sec.isPractice">
      <!-- MINI GUÍA -->
      <div class="content-card guide-card">
        <div class="card-header">
          <span class="card-icon">🧠</span>
          <h3>{{ sec.guia_titulo || '¿Qué aprenderás?' }}</h3>
        </div>
        <div class="sec-image-wrap" *ngIf="sec.imageUrl">
          <img [src]="sec.imageUrl" alt="Imagen {{ sec.title }}" class="sec-image">
        </div>
        <p class="guide-body" [innerHTML]="parseMixed(sec.guia_contenido || sec.introduccion)"></p>
      </div>

      <!-- TEXTO BASE -->
      <div class="content-card context-card" *ngIf="sec.test?.contexto_base && materiaId() !== 'historia'">
        <div class="card-header">
          <span class="card-icon">📄</span>
          <h3>Texto de práctica</h3>
          <span class="pregunta-count">{{ sec.test.preguntas.length }} {{ sec.test.preguntas.length === 1 ? 'pregunta' : 'preguntas' }}</span>
        </div>
        <div class="context-body">
          <p *ngFor="let p of getFormattedParagraphs(sec.test.contexto_base)">
            <span class="p-num" *ngIf="!p.isTitle">[{{ p.number }}]</span>
            <span class="p-text" [class.p-title]="p.isTitle">{{ p.text }}</span>
          </p>
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
            <p [innerHTML]="parseMixed(dato)"></p>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="cta-section">
        <div class="cta-card">
          <div class="cta-icon">🚀</div>
          <h3>¿Listo para practicar?</h3>
          <p>{{ sec.test.preguntas.length }} preguntas te esperan. ¡Debes responder todo correctamente para avanzar!</p>
          <button class="btn-start-test" (click)="goToTest()">Comenzar Test →</button>
        </div>
      </div>
      </ng-container>

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
    .guide-card { border-color: rgba(133,92,214,0.15); background: linear-gradient(135deg, rgba(133,92,214,0.04), #fff); display: flow-root; }
    .guide-body { font-size: 0.95rem; color: var(--text-secondary); line-height: 1.75; margin: 0; }
    .sec-image-wrap { float: right; width: 220px; margin: 0 0 1rem 1.5rem; text-align: center; }
    .sec-image { max-width: 100%; border-radius: 16px; border: 3px solid rgba(133,92,214,0.15); box-shadow: 0 10px 25px rgba(0,0,0,0.08); animation: floatingImage 4s ease-in-out infinite; }
    @keyframes floatingImage { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-8px) rotate(1.5deg)} }

    /* CONTEXT */
    .context-body { background: rgba(133,92,214,0.03); border-left: 4px solid var(--accent-primary); border-radius: 0 12px 12px 0; padding: 1.25rem; }
    .context-body p { font-size: 0.93rem; color: var(--text-primary); line-height: 1.9; margin: 0 0 1rem; font-style: italic; display: flex; gap: 0.5rem; align-items: flex-start; }
    .context-body p:last-child { margin-bottom: 0; }
    .p-text { flex: 1; }
    .p-text.p-title { font-family: var(--font-heading); font-size: 1.05rem; font-weight: 800; color: var(--accent-primary); font-style: normal; margin-top: 0.75rem; margin-bottom: 0.35rem; display: block; border-bottom: 2px solid rgba(133,92,214,0.15); padding-bottom: 0.35rem; }

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

    .guide-nav-container { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
    .btn-back { background: transparent; border: none; font-size: 0.95rem; font-weight: 700; color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0; transition: all 0.2s; }
    .btn-back:hover { color: var(--accent-primary); transform: translateX(-4px); }

    .materia-progress-mini { display: flex; align-items: center; gap: 0.75rem; background: rgba(133,92,214,0.04); padding: 0.4rem 0.85rem; border-radius: 99px; border: 1px solid rgba(133,92,214,0.08); }
    .progress-pct { font-size: 0.75rem; font-weight: 800; color: var(--accent-primary); }
    .progress-bar-mini { width: 80px; height: 6px; background: rgba(0, 0, 0, 0.06); border-radius: 99px; overflow: hidden; }
    .progress-fill-mini { height: 100%; background: linear-gradient(90deg, var(--accent-primary), #58cc02); border-radius: 99px; transition: width 0.4s ease; }

    .practice-card { padding: 2rem; border-radius: 20px; background: #fff; border: 2px solid rgba(133,92,214,0.1); animation: fadeSlide 0.4s ease both; }
    .practice-success-actions { margin-top: 2rem; padding-top: 1.5rem; border-top: 2px dashed rgba(133,92,214,0.2); text-align: center; animation: fadeSlide 0.4s ease-out; }
    .success-banner { display: inline-block; font-weight: 700; color: #58cc02; background: rgba(88,204,2,0.1); padding: 0.5rem 1.25rem; border-radius: 99px; margin-bottom: 1rem; }
    .btn-next { background: #58cc02; box-shadow: 0 5px 0 #4caf00; }
    .btn-next:hover { box-shadow: 0 2px 0 #4caf00; }

    /* VOICE CONTROLS */
    .voice-dropdown-container { position: relative; z-index: 100; }
    .btn-voice-toggle { display: flex; align-items: center; gap: 0.5rem; background: rgba(133,92,214,0.08); border: 2px solid rgba(133,92,214,0.2); color: var(--accent-primary); border-radius: 8px; padding: 0.45rem 0.8rem; font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
    .btn-voice-toggle:hover { background: rgba(133,92,214,0.15); }
    .btn-voice-toggle .arrow { font-size: 0.7rem; transition: transform 0.2s; }
    .btn-voice-toggle .arrow.open { transform: rotate(180deg); }
    .voice-dropdown-menu { display: flex; flex-direction: column; gap: 0.25rem; position: absolute; right: 0; top: 100%; margin-top: 0.5rem; max-height: 0; opacity: 0; overflow: hidden; transition: all 0.3s ease-in-out; background: #fff; padding: 0; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); border: 1px solid rgba(133,92,214,0.1); }
    .voice-dropdown-menu.open { max-height: 250px; opacity: 1; padding: 0.5rem; }
    .btn-voice { background: transparent; border: none; text-align: left; color: var(--text-primary); border-radius: 6px; padding: 0.6rem 0.8rem; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
    .btn-voice:hover { background: rgba(133,92,214,0.08); color: var(--accent-primary); }
    .btn-stop { color: #ef4444; border-top: 1px dashed rgba(239,68,68,0.2); margin-top: 0.25rem; border-radius: 0 0 6px 6px; }
    .btn-stop:hover { background: rgba(239,68,68,0.08); color: #ef4444; }

    @keyframes fadeSlide { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes ctaBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
    @keyframes testPulse { 0%, 100% { box-shadow: 0 5px 0 #6b46b8, 0 0 0 0 rgba(133,92,214,0.3); } 50% { box-shadow: 0 5px 0 #6b46b8, 0 0 0 10px rgba(133,92,214,0); } }
    @media (max-width: 640px) { .cta-card { padding: 2rem 1.25rem; } .practice-card { padding: 1.25rem; } .voice-dropdown-menu { right: auto; left: 0; } }
  `]
})
export class SeccionDetailComponent {
  private paes = inject(PaesContentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private katexSvc = inject(KatexService);
  private sanitizer = inject(DomSanitizer);

  tipColors = ['#855cd6', '#1cb0f6', '#ff9600', '#58cc02', '#ef4444'];

  materiaId = signal('');
  capituloId = signal('');
  seccionId = signal('');
  practiceCompleted = signal(false);
  voiceMenuOpen = false;

  isMathModule = computed(() => this.materiaId().toLowerCase().includes('mat'));

  materia = computed(() => this.paes.getMateriaById(this.materiaId()));
  materiaProgress = computed(() => {
    const id = this.materiaId();
    if (!id) return { completed: 0, total: 0, percentage: 0 };
    return this.paes.getMateriaProgress(id);
  });
  capitulo = computed(() => this.paes.getCapituloById(this.capituloId()));
  seccion = computed(() => this.paes.getSeccionById(this.seccionId()));
  capOrder = computed(() => {
    const caps = this.paes.getCapitulosByMateria(this.materiaId());
    const idx = caps.findIndex(c => c.id === this.capituloId());
    return idx + 1;
  });

  constructor() {
    this.route.paramMap.subscribe(params => {
      this.materiaId.set(params.get('materiaId') || '');
      this.capituloId.set(params.get('capituloId') || '');
      this.seccionId.set(params.get('seccionId') || '');
      this.practiceCompleted.set(false);
    });
  }

  goBack() {
    window.history.back();
  }

  goToTest() {
    this.router.navigate(['/test', this.seccionId()]);
  }

  goBackPath() {
    this.router.navigate(['/ruta', this.materiaId()]);
  }

  parseMixed(text: string | null | undefined): SafeHtml {
    if (!text) return '';
    const renderedSafe = this.katexSvc.renderMixedText(text);
    const rendered = (renderedSafe as any)?.changingThisBreaksApplicationSecurity || String(renderedSafe);
    const bolded = rendered.replace(/\*\*(.*?)\*\*/gs, '<strong style="color:var(--accent-primary)">$1</strong>');
    const withBreaks = bolded.replace(/&lt;br&gt;/g, '<br>');
    return this.sanitizer.bypassSecurityTrustHtml(withBreaks);
  }

  getFormattedParagraphs(text: string | null | undefined): { text: string; isTitle: boolean; number?: number }[] {
    if (!text) return [];
    const rawParagraphs = text.split('\n\n')
      .map(p => p.trim())
      .filter(p => p !== '' && p !== '--- DIVISION_TEXTOS ---');
      
    let paragraphCount = 0;
    return rawParagraphs.map(p => {
      const isTitle = p.startsWith('📖') || p.startsWith('TEXTO') || p.includes('TEXTO I') || p.includes('TEXTO II');
      if (isTitle) {
        paragraphCount = 0;
        return { text: p, isTitle: true };
      } else {
        paragraphCount++;
        return { text: p, isTitle: false, number: paragraphCount };
      }
    });
  }

  getParagraphs(text: string | null | undefined): string[] {
    if (!text) return [];
    return text.split('\n\n').map(p => p.trim()).filter(p => p !== '');
  }

  completePractice() {
    this.paes.markSeccionCompleted(this.seccionId());
    this.goNext();
  }

  goNext() {
    const nextUrl = this.paes.getNextNodeUrl(this.materiaId());
    if (nextUrl) {
      this.router.navigate(nextUrl);
    } else {
      this.router.navigate(['/ruta', this.materiaId()]);
    }
  }

  // ==========================================
  // TEXT TO SPEECH (ACCESSIBILITY)
  // ==========================================
  ngOnDestroy() {
    this.stopReading();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
    if (this.isMathModule()) return;

    const key = event.key.toLowerCase();
    if (key === '1') this.readGuide();
    if (key === '2') this.readContext();
    if (key === '3') this.readTips();
    if (key === '4' || key === 'escape' || key === 's') this.stopReading();
  }

  private cleanHtml(html: string): string {
    if (!html) return '';
    let text = html.replace(/&quot;/g, '"');
    text = text.replace(/<br\s*\/?>/gi, '. ');
    text = text.replace(/<[^>]*>?/gm, '');
    text = text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '');
    text = text.replace(/\*/g, '');
    return text.trim();
  }

  private getBestVoice(): SpeechSynthesisVoice | null {
    const voices = window.speechSynthesis.getVoices();
    let voice = voices.find(v => v.name.includes('Google') && v.lang.startsWith('es'));
    if (!voice) voice = voices.find(v => v.name.includes('Microsoft') && (v.name.includes('Helena') || v.name.includes('Laura') || v.name.includes('Pablo')));
    if (!voice) voice = voices.find(v => v.lang.startsWith('es-') || v.lang === 'es');
    return voice || null;
  }

  private speak(text: string) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    
    const voice = this.getBestVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }

    window.speechSynthesis.speak(utterance);
  }

  readGuide() {
    const sec = this.seccion();
    if (!sec) return;
    const text = this.cleanHtml(sec.guia_titulo || 'Qué aprenderás') + '. ' + this.cleanHtml(sec.guia_contenido || sec.introduccion);
    this.speak(text);
  }

  readContext() {
    const sec = this.seccion();
    if (!sec?.test?.contexto_base) return;
    const text = 'Texto de práctica. ' + this.cleanHtml(sec.test.contexto_base);
    this.speak(text);
  }

  readTips() {
    const sec = this.seccion();
    if (!sec?.datos_claves?.length) return;
    let text = 'Tips clave: ';
    sec.datos_claves.forEach((tip, idx) => {
      text += `Tip número ${idx + 1}: ${this.cleanHtml(tip)}. `;
    });
    this.speak(text);
  }

  stopReading() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}
