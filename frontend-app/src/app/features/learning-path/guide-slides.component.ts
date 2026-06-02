import { Component, Output, EventEmitter, signal, computed, HostListener, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuideSlide, QuizAlt } from './models/paes.models';
import { KatexService } from '../../core/services/katex.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-guide-slides',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="slides-container" *ngIf="slides && slides.length > 0">
      <!-- PROGRESS -->
      <div class="progress-bar-wrap">
        <div class="progress-dots">
          <button *ngFor="let s of slides; let i = index" class="dot"
            [class.active]="i === current()" [class.visited]="i < current()"
            (click)="goTo(i)"></button>
        </div>
        <span class="progress-label">{{ current() + 1 }} / {{ slides.length }}</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" [style.width.%]="progressPct()"></div>
      </div>

      <!-- SLIDE VIEWPORT -->
      <div class="slide-viewport" [style.background]="slides[current()].bgGradient"
        (touchstart)="onTouchStart($event)" (touchend)="onTouchEnd($event)">
        <div class="slide-track" [style.transform]="'translateX(-' + (current() * 100) + '%)'">
          <div *ngFor="let slide of slides; let i = index" class="slide"
            [class.active]="i === current()" [class.stagger]="i === current()">

            <div class="slide-icon-wrap" [style.background]="slide.iconBg">{{ slide.icon }}</div>
            <h2 class="slide-title s-anim s-d1" [innerHTML]="parseMixed(slide.title)"></h2>
            <div class="slide-body s-anim s-d2" [innerHTML]="parseMixed(slide.content)"></div>

            <!-- INTERACTIVE QUIZ -->
            <div *ngIf="slide.interactive" class="quiz-section s-anim s-d3">
              <div *ngFor="let alt of getQuiz(slide.quizId!)" class="quiz-alt"
                [class.selected]="getQuizState(slide.quizId!).selected === alt.key"
                [class.correct]="getQuizState(slide.quizId!).revealed && alt.correct"
                [class.wrong]="getQuizState(slide.quizId!).revealed && !alt.correct"
                (click)="selectAlt(slide.quizId!, alt)">
                <span class="alt-label">{{ alt.key }})</span> <span [innerHTML]="parseMixed(alt.text)"></span>
                <div class="alt-feedback" *ngIf="getQuizState(slide.quizId!).revealed" [innerHTML]="parseMixed(alt.explain)"></div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- CONFETTI -->
      <div class="confetti-wrap" *ngIf="showConfetti()">
        <div *ngFor="let p of confettiPieces" class="confetti-piece" [style.left.%]="p.x" [style.animationDelay.ms]="p.delay" [style.background]="p.color"></div>
      </div>

      <!-- NAV -->
      <div class="slide-nav">
        <button class="nav-btn prev" (click)="prev()" [disabled]="current() === 0">← Anterior</button>
        <button *ngIf="current() < slides.length - 1" class="nav-btn next" (click)="next()">Siguiente →</button>
        <button *ngIf="current() === slides.length - 1" class="nav-btn cta" (click)="onFinish.emit()">Siguiente Lección →</button>
      </div>
    </div>
  `,
  styles: [`
    :host { display:block; }
    .slides-container { max-width:780px; margin:0 auto; padding:0 1rem; position:relative; }

    /* PROGRESS */
    .progress-bar-wrap { display:flex; align-items:center; justify-content:space-between; margin-bottom:0.5rem; }
    .progress-dots { display:flex; gap:0.35rem; flex-wrap:wrap; }
    .dot { width:10px; height:10px; border-radius:50%; border:2px solid rgba(0,0,0,0.1); background:#fff; cursor:pointer; transition:all 0.3s; padding:0; }
    .dot.visited { background:#58cc02; border-color:#58cc02; }
    .dot.active { background:var(--accent-primary); border-color:var(--accent-primary); transform:scale(1.3); box-shadow:0 0 0 3px rgba(133,92,214,0.2); }
    .progress-label { font-size:0.78rem; font-weight:700; color:var(--text-secondary); }
    .progress-track { width:100%; height:5px; background:rgba(0,0,0,0.06); border-radius:99px; margin-bottom:1.25rem; overflow:hidden; }
    .progress-fill { height:100%; background:linear-gradient(90deg,var(--accent-primary),#58cc02); border-radius:99px; transition:width 0.4s ease; }

    /* VIEWPORT */
    .slide-viewport { overflow:hidden; border-radius:24px; border:2px solid rgba(0,0,0,0.06); box-shadow:0 8px 32px rgba(0,0,0,0.06); transition:background 0.5s ease; }
    .slide-track { display:flex; transition:transform 0.5s cubic-bezier(0.4,0,0.2,1); }
    .slide { min-width:100%; padding:2rem 2rem 2.25rem; opacity:0.3; transition:opacity 0.5s ease; }
    .slide.active { opacity:1; }

    /* ICON */
    .slide-icon-wrap { width:48px; height:48px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.5rem; margin-bottom:0.75rem; box-shadow:0 4px 12px rgba(0,0,0,0.15); }

    .slide-title { font-family:var(--font-heading); font-size:1.4rem; font-weight:800; color:var(--text-primary); margin:0 0 1rem; line-height:1.25; }

    /* STAGGER */
    .s-anim { opacity:0; transform:translateY(14px); transition:opacity 0.5s ease, transform 0.5s ease; }
    .slide.stagger .s-anim { opacity:1; transform:translateY(0); }
    .slide.stagger .s-d1 { transition-delay:0.08s; }
    .slide.stagger .s-d2 { transition-delay:0.2s; }
    .slide.stagger .s-d3 { transition-delay:0.35s; }

    /* ─── RICHTEXT ─── */
    .slide-body { font-size:0.95rem; line-height:1.75; color:var(--text-primary); }
    .slide-body :first-child { margin-top:0; }
    :host ::ng-deep .hl { background:linear-gradient(120deg,rgba(255,200,0,0.35),rgba(255,200,0,0.15)); padding:0.1rem 0.3rem; border-radius:4px; font-weight:700; }
    :host ::ng-deep .hl-red { background:rgba(239,68,68,0.12); padding:0.1rem 0.3rem; border-radius:4px; font-weight:700; color:#dc2626; }
    :host ::ng-deep .callout { background:linear-gradient(135deg,rgba(133,92,214,0.08),rgba(133,92,214,0.03)); border-left:4px solid var(--accent-primary); border-radius:0 12px 12px 0; padding:0.85rem 1rem; margin:1rem 0 0; font-size:0.88rem; font-weight:600; }
    :host ::ng-deep .callout-gold { background:rgba(255,200,0,0.1); border-left:4px solid #ffc800; border-radius:0 12px 12px 0; padding:0.85rem 1rem; margin:1rem 0 0; font-size:0.88rem; font-weight:600; }
    :host ::ng-deep .paes-text { background:rgba(133,92,214,0.04); border-left:4px solid var(--accent-primary); border-radius:0 12px 12px 0; padding:1rem; font-style:italic; font-size:0.9rem; line-height:1.7; margin:0.75rem 0; }

    /* MINI CARDS */
    :host ::ng-deep .mini-cards { display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; margin:0.75rem 0; }
    :host ::ng-deep .mc { padding:0.6rem 0.85rem; border-radius:10px; font-size:0.88rem; font-weight:700; text-align:center; }
    :host ::ng-deep .mc.red { background:rgba(239,68,68,0.06); border:2px solid rgba(239,68,68,0.15); color:#dc2626; }
    :host ::ng-deep .mc.green { background:rgba(88,204,2,0.06); border:2px solid rgba(88,204,2,0.2); color:#16a34a; grid-column:1/-1; }

    /* BIG RULE */
    :host ::ng-deep .big-rule { background:rgba(255,200,0,0.08); border:2px solid rgba(255,200,0,0.2); border-radius:16px; padding:1.25rem; margin:0.5rem 0; text-align:center; }
    :host ::ng-deep .big-rule p { font-size:1.05rem; line-height:1.6; margin:0; }

    /* EXAMPLE BOX */
    :host ::ng-deep .example-box { background:rgba(0,0,0,0.02); border-radius:14px; padding:1rem; margin:0.75rem 0; }
    :host ::ng-deep .ex-label { font-size:0.78rem; font-weight:800; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.04em; margin-bottom:0.15rem; margin-top:0.5rem; }
    :host ::ng-deep .ex-label:first-child { margin-top:0; }
    :host ::ng-deep .ex-label.answer { color:#16a34a; }
    :host ::ng-deep .ex-text { margin:0; font-size:0.92rem; line-height:1.5; }

    /* SYNONYM GRID */
    :host ::ng-deep .synonym-grid { display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; margin:0.75rem 0; }
    :host ::ng-deep .syn-pair { display:flex; align-items:center; justify-content:center; gap:0.4rem; padding:0.5rem; background:rgba(0,0,0,0.02); border-radius:10px; font-size:0.85rem; }
    :host ::ng-deep .syn-a { font-weight:700; color:var(--accent-primary); }
    :host ::ng-deep .syn-arrow { color:var(--text-muted); }
    :host ::ng-deep .syn-b { font-weight:700; color:#16a34a; }

    /* ARROWS */
    :host ::ng-deep .arrow-map { display:flex; flex-direction:column; gap:0.5rem; margin:0.75rem 0; padding:0.85rem; background:rgba(0,0,0,0.02); border-radius:14px; }
    :host ::ng-deep .arrow-row { display:flex; align-items:center; gap:0.4rem; font-size:0.88rem; flex-wrap:wrap; }
    .slide.stagger :host ::ng-deep .anim-arrow { animation:arrowSlide 0.5s ease both; }
    .slide.stagger :host ::ng-deep .anim-arrow:nth-child(1) { animation-delay:0.3s; }
    .slide.stagger :host ::ng-deep .anim-arrow:nth-child(2) { animation-delay:0.45s; }
    .slide.stagger :host ::ng-deep .anim-arrow:nth-child(3) { animation-delay:0.6s; }
    .slide.stagger :host ::ng-deep .anim-arrow:nth-child(4) { animation-delay:0.75s; }
    @keyframes arrowSlide { from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:translateX(0)} }
    :host ::ng-deep .arrow-from { background:rgba(239,68,68,0.1); color:#dc2626; padding:0.2rem 0.5rem; border-radius:6px; font-weight:700; text-decoration:line-through; text-decoration-color:rgba(239,68,68,0.4); font-size:0.85rem; }
    :host ::ng-deep .arrow-icon { font-size:1rem; color:var(--accent-primary); font-weight:900; }
    :host ::ng-deep .arrow-to { background:rgba(88,204,2,0.1); color:#16a34a; padding:0.2rem 0.5rem; border-radius:6px; font-weight:700; font-size:0.85rem; }

    /* SCAN DEMO */
    :host ::ng-deep .scan-demo { margin:0.75rem 0; border-radius:12px; overflow:hidden; border:2px solid rgba(0,0,0,0.06); }
    :host ::ng-deep .scan-line { padding:0.6rem 1rem; font-size:0.88rem; line-height:1.5; border-bottom:1px solid rgba(0,0,0,0.04); }
    :host ::ng-deep .scan-line.dim { color:rgba(0,0,0,0.3); background:#fafafa; }
    :host ::ng-deep .scan-line.found { background:rgba(255,200,0,0.12); color:var(--text-primary); font-weight:500; }

    /* CONTEXT VISUAL */
    :host ::ng-deep .context-visual { margin:0.75rem 0; display:flex; flex-direction:column; gap:0; }
    :host ::ng-deep .ctx-line { padding:0.65rem 1rem; font-size:0.88rem; text-align:center; font-weight:600; }
    :host ::ng-deep .ctx-line.before { background:rgba(0,0,0,0.03); border-radius:12px 12px 0 0; color:var(--text-secondary); }
    :host ::ng-deep .ctx-line.target { background:rgba(255,200,0,0.15); color:var(--text-primary); font-weight:800; font-size:0.95rem; border-left:4px solid #ffc800; border-right:4px solid #ffc800; }
    :host ::ng-deep .ctx-line.after { background:rgba(0,0,0,0.03); border-radius:0 0 12px 12px; color:var(--text-secondary); }

    /* ERROR LIST */
    :host ::ng-deep .error-list { display:flex; flex-direction:column; gap:0.6rem; }
    :host ::ng-deep .error-item { display:flex; gap:0.75rem; align-items:flex-start; padding:0.7rem 0.85rem; background:rgba(239,68,68,0.03); border-radius:12px; border:1px solid rgba(239,68,68,0.1); }
    :host ::ng-deep .err-x { font-size:1.1rem; font-weight:900; color:#ef4444; flex-shrink:0; margin-top:0.1rem; }
    :host ::ng-deep .error-item strong { font-size:0.9rem; display:block; margin-bottom:0.1rem; }
    :host ::ng-deep .error-item p { margin:0; font-size:0.82rem; color:var(--text-secondary); line-height:1.4; }

    /* CTA */
    :host ::ng-deep .cta-inner { text-align:center; }
    :host ::ng-deep .big-icon { font-size:3.5rem; display:block; margin-bottom:0.75rem; animation:rocketLaunch 2s ease-in-out infinite; }
    :host ::ng-deep .cta-inner>p { font-size:0.95rem; line-height:1.6; color:var(--text-secondary); max-width:480px; margin:0 auto; }
    :host ::ng-deep .cta-checklist { display:flex; flex-direction:column; gap:0.4rem; margin:1rem auto; max-width:380px; text-align:left; }
    :host ::ng-deep .cta-check { display:flex; align-items:center; gap:0.5rem; font-size:0.88rem; font-weight:600; }
    :host ::ng-deep .cta-check span:first-child { width:22px; height:22px; background:#58cc02; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#fff; font-size:0.7rem; flex-shrink:0; }

    /* QUIZ */
    .quiz-section { margin-top:0.35rem; }
    .quiz-alt { padding:0.7rem 0.85rem; border-radius:10px; border:2px solid rgba(0,0,0,0.08); margin-bottom:0.45rem; cursor:pointer; transition:all 0.25s; font-size:0.88rem; line-height:1.45; }
    .quiz-alt:hover:not(.selected):not(.correct):not(.wrong) { border-color:var(--accent-primary); background:rgba(133,92,214,0.04); transform:translateX(3px); }
    .quiz-alt.selected { border-color:var(--accent-primary); background:rgba(133,92,214,0.08); }
    .quiz-alt.correct { border-color:#58cc02; background:rgba(88,204,2,0.08); cursor:default; }
    .quiz-alt.wrong { border-color:#ef4444; background:rgba(239,68,68,0.06); cursor:default; }
    .quiz-alt.dimmed { opacity:0.45; cursor:default; }
    .alt-label { font-weight:800; margin-right:0.3rem; }
    .alt-feedback { display:block; font-size:0.78rem; color:var(--text-secondary); margin-top:0.25rem; font-style:italic; animation:fadeIn 0.3s ease; }

    /* CONFETTI */
    .confetti-wrap { position:fixed; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:9999; overflow:hidden; }
    .confetti-piece { position:absolute; top:-10px; width:10px; height:10px; border-radius:2px; animation:confettiFall 2.5s ease-out forwards; }
    @keyframes confettiFall { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(100vh) rotate(720deg);opacity:0} }

    /* NAV */
    .slide-nav { display:flex; justify-content:space-between; align-items:center; margin-top:1.25rem; gap:1rem; }
    .nav-btn { padding:0.8rem 1.4rem; border-radius:14px; font-weight:800; font-family:var(--font-heading); font-size:0.95rem; cursor:pointer; transition:all 0.2s; border:none; }
    .nav-btn.prev { background:#fff; color:var(--text-secondary); border:2px solid rgba(0,0,0,0.1); }
    .nav-btn.prev:hover:not(:disabled) { border-color:var(--accent-primary); color:var(--accent-primary); }
    .nav-btn.prev:disabled { opacity:0.3; cursor:not-allowed; }
    .nav-btn.next { background:var(--accent-primary); color:#fff; box-shadow:0 4px 0 #6b46b8; }
    .nav-btn.next:hover { transform:translateY(2px); box-shadow:0 2px 0 #6b46b8; }
    .nav-btn.cta { background:#58cc02; color:#fff; box-shadow:0 4px 0 #46a302; animation:ctaPulse 2s ease-in-out infinite; }
    .nav-btn.cta:hover { transform:translateY(2px); box-shadow:0 2px 0 #46a302; }

    @keyframes rocketLaunch { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    @keyframes ctaPulse { 0%,100%{box-shadow:0 4px 0 #46a302,0 0 0 0 rgba(88,204,2,0.3)} 50%{box-shadow:0 4px 0 #46a302,0 0 0 10px rgba(88,204,2,0)} }
    @keyframes fadeIn { from{opacity:0}to{opacity:1} }

    @media(max-width:640px) {
      .slide { padding:1.5rem 1.15rem; }
      .slide-title { font-size:1.2rem; }
      :host ::ng-deep .mini-cards, :host ::ng-deep .synonym-grid { grid-template-columns:1fr; }
      .nav-btn { padding:0.7rem 1rem; font-size:0.88rem; }
    }
  `]
})
export class GuideSlidesComponent implements OnChanges {
  @Output() onFinish = new EventEmitter<void>();
  @Input() slides: GuideSlide[] = [];
  @Input() quizzes: Record<string, QuizAlt[]> = {};

  private katexSvc = inject(KatexService);
  private sanitizer = inject(DomSanitizer);

  quizStates: Record<string, { selected: string | null; revealed: boolean }> = {};

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['quizzes'] || changes['slides']) && this.quizzes) {
      this.quizStates = {};
      Object.keys(this.quizzes).forEach(id => {
        this.quizStates[id] = { selected: null, revealed: false };
      });
    }
  }

  parseMixed(text: string | undefined): SafeHtml {
    if (!text) return '';
    const renderedSafe = this.katexSvc.renderMixedText(text);
    const rendered = (renderedSafe as any)?.changingThisBreaksApplicationSecurity || String(renderedSafe);
    const bolded = rendered.replace(/\*\*(.*?)\*\*/gs, '<strong>$1</strong>');
    const withBreaks = bolded.replace(/&lt;br&gt;/g, '<br>');
    const unescaped = withBreaks
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&');
    return this.sanitizer.bypassSecurityTrustHtml(unescaped);
  }

  current = signal(0);
  progressPct = computed(() => (this.current() / (this.slides.length - 1)) * 100);
  showConfetti = signal(false);

  confettiPieces = Array.from({ length: 40 }, () => ({
    x: Math.random() * 100, delay: Math.random() * 1000,
    color: ['#855cd6','#58cc02','#ffc800','#1cb0f6','#ff9600','#ef4444'][Math.floor(Math.random() * 6)]
  }));

  private touchStartX = 0;

  @HostListener('window:keydown', ['$event'])
  handleKey(e: KeyboardEvent) {
    if (e.key === 'ArrowRight') this.next();
    if (e.key === 'ArrowLeft') this.prev();
  }

  onTouchStart(e: TouchEvent) { this.touchStartX = e.changedTouches[0].clientX; }
  onTouchEnd(e: TouchEvent) {
    const diff = this.touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? this.next() : this.prev(); }
  }

  next() {
    if (this.current() < this.slides.length - 1) {
      this.current.update(v => v + 1);
      if (this.current() === this.slides.length - 1) this.triggerConfetti();
    }
  }

  prev() { 
    if (this.current() > 0) {
      this.current.update(v => v - 1);
    }
  }

  goTo(i: number) { this.current.set(i); if (i === this.slides.length - 1) this.triggerConfetti(); }

  getQuiz(id: string): QuizAlt[] { return this.quizzes[id] || []; }
  getQuizState(id: string) { return this.quizStates[id] || { selected: null, revealed: false }; }

  selectAlt(quizId: string, alt: QuizAlt) {
    const state = this.quizStates[quizId];
    if (!state || state.revealed) return;
    state.selected = alt.key;
    
    setTimeout(() => { state.revealed = true; }, 400);
  }

  private triggerConfetti() {
    this.showConfetti.set(true);
    setTimeout(() => this.showConfetti.set(false), 3000);
  }
}
