import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MiniEnsayoService } from '../../core/services/mini-ensayo.service';
import { KatexService } from '../../core/services/katex.service';
import { SettingsModalComponent } from '../profile/settings-modal.component';
import { ProfileModalComponent } from '../profile/profile-modal.component';
import { AuthService } from '../../core/services/auth.service';


@Component({
  selector: 'app-mini-ensayo-runner',
  standalone: true,
  imports: [CommonModule, RouterLink, SettingsModalComponent, ProfileModalComponent],
  template: `
    <div class="runner-layout-wrap" *ngIf="session() as sess">
      <!-- MAIN CONTENT -->
      <main class="main-content runner-page animate-fade-in-down">
<header class="top-bar">
          <button class="btn-close" (click)="confirmExit()" title="Salir">✕</button>
          <div class="top-title">Mini Ensayo Personalizado</div>
          <div class="top-timer" [class.urgent]="timer() <= 300">{{ formatTime(timer()) }}</div>
        </header>

        <div class="runner-layout">
          <!-- SIDEBAR NAV -->
          <aside class="runner-sidebar">
            <div class="nav-title">Preguntas ({{ answeredCount() }}/{{ totalQuestions() }})</div>
            <div class="grid-nav">
              @for (q of sess.questions; track q.id; let i = $index) {
                <button class="nav-bubble" 
                        [class.current]="i === currentIndex()"
                        [class.answered]="answers()[q.id]"
                        (click)="goToQuestion(i)">
                  {{ i + 1 }}
                </button>
              }
            </div>
            <div class="runner-sidebar-footer">
              <button class="btn-finish" (click)="submitEnsayo()">Finalizar Ensayo</button>
            </div>
          </aside>

          <!-- QUESTION AREA -->
          <div class="question-area">
            <div class="question-scroll">
              <div class="question-card glass-card" *ngIf="currentQuestion() as q">
                <div class="q-header">
                  <span class="q-number">Pregunta {{ currentIndex() + 1 }}</span>
                  <span class="q-topic">{{ q.tema }}</span>
                </div>

                @if (q.preambulo_texto) {
                  <div class="q-preambulo"><p>{{ q.preambulo_texto }}</p></div>
                }

                @if (q.preambulo_imagen_url) {
                  <div class="q-image-wrap">
                    <img [src]="q.preambulo_imagen_url" alt="Imagen de contexto" class="q-image">
                  </div>
                }

                <p class="q-text">{{ q.enunciado }}</p>

                @if (q.formula_latex) {
                  <div class="q-formula" [innerHTML]="renderLatex(q.formula_latex)"></div>
                }

                <div class="options-grid">
                  @for (key of optionKeys; track key) {
                    <button class="option-btn" 
                            [class.selected]="answers()[q.id] === key"
                            (click)="selectAnswer(q.id, key)">
                      <span class="opt-letter" [class.sel]="answers()[q.id] === key">{{ key }}</span>
                      <span class="opt-text" *ngIf="q.tipo_alternativas !== 'imagen'">{{ q.alternativas[key] }}</span>
                      <img *ngIf="q.tipo_alternativas === 'imagen'" [src]="q.alternativas[key]" alt="Opción {{ key }}" class="opt-img" />
                    </button>
                  }
                </div>
              </div>
            </div>

            <!-- BOTTOM NAV -->
            <footer class="bottom-bar">
              <button class="btn-nav" [disabled]="currentIndex() === 0" (click)="prevQuestion()">← Anterior</button>
              <button class="btn-nav btn-primary" *ngIf="!isLastQuestion()" (click)="nextQuestion()">Siguiente →</button>
              <button class="btn-nav btn-primary" *ngIf="isLastQuestion()" (click)="submitEnsayo()">Terminar</button>
            </footer>
          </div>
        </div>
      </main>
    </div>

    <!-- EXIT CONFIRMATION MODAL -->
    <div class="modal-overlay" *ngIf="showExitModal" (click)="showExitModal = false">
      <div class="modal-card glass-card" (click)="$event.stopPropagation()">
        <div class="modal-icon">🚪</div>
        <h2>¿Seguro que quieres salir?</h2>
        <p>Tu progreso actual se guardará como borrador y el tiempo seguirá corriendo.</p>
        <div class="modal-actions">
          <button class="btn-cancel" (click)="showExitModal = false">Cancelar</button>
          <button class="btn-confirm" (click)="executeExit()">Sí, salir al Dashboard</button>
        </div>
      </div>
    </div>
    
    <!-- SUBMIT CONFIRMATION MODAL -->
    <div class="modal-overlay" *ngIf="showSubmitModal" (click)="showSubmitModal = false">
      <div class="modal-card glass-card" (click)="$event.stopPropagation()">
        <div class="modal-icon">🎯</div>
        <h2>¿Finalizar Mini Ensayo?</h2>
        <p *ngIf="unansweredCount() > 0" class="warning-text">Tienes {{ unansweredCount() }} preguntas sin responder. Se marcarán como omitidas.</p>
        <p *ngIf="unansweredCount() === 0">Has respondido todas las preguntas.</p>
        <div class="modal-actions">
          <button class="btn-cancel" (click)="showSubmitModal = false">Revisar respuestas</button>
          <button class="btn-confirm-submit" (click)="executeSubmit()">Entregar ensayo</button>
        </div>
      </div>
    </div>

    <app-settings-modal *ngIf="showSettingsModal" (close)="showSettingsModal = false"></app-settings-modal>
    <app-profile-modal *ngIf="showProfileModal" (close)="showProfileModal = false"></app-profile-modal>

    <!-- CUSTOM LOGOUT CONFIRMATION -->
    <div class="modal-overlay logout-confirm-overlay" *ngIf="showLogoutConfirm" (click)="showLogoutConfirm = false">
      <div class="modal-container glass logout-confirm-modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Cerrar Sesión</h2>
          <button class="logout-close-btn" (click)="showLogoutConfirm = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="confirm-content">
            <img src="assets/images/iconosParaElementos/P_CerrarSesion.png" alt="Cerrar Sesion" class="confirm-icon confirm-icon-img"/>
            <h3>¿Estás seguro de que quieres salir?</h3>
            <p>Se cerrará tu sesión actual y volverás a la página de inicio.</p>
          </div>
        </div>
        <div class="modal-footer confirm-actions">
          <button class="btn-secondary-modal" (click)="showLogoutConfirm = false">Cancelar</button>
          <button class="btn-primary-modal btn-danger" (click)="executeLogout()">Cerrar Sesión</button>
        </div>
      </div>
    </div>

  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: var(--bg-color); color: var(--text-primary); }
    
    .runner-layout-wrap { display: flex; min-height: 100vh; }
    .main-content { flex: 1; display: flex; flex-direction: column; background: #f8f9fa !important; margin-left: 0 !important; max-width: 100% !important; overflow: hidden; }
    
    .top-bar { display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 1.5rem; background: #fff; border-bottom: 2px solid rgba(0,0,0,0.06); flex-shrink: 0; }
    .btn-close { width: 36px; height: 36px; border-radius: 50%; border: 2px solid rgba(0,0,0,0.1); background: transparent; color: var(--text-secondary); cursor: pointer; transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), color 0.2s ease, border-color 0.2s ease, background 0.2s ease; display: flex; align-items: center; justify-content: center; font-weight: 800; }
    .btn-close:hover { border-color: #ef4444; color: #ef4444 !important; background: rgba(239,68,68,0.05); transform: rotate(90deg) scale(1.1); }
    .top-title { font-weight: 700; font-family: var(--font-heading); color: var(--text-secondary); font-size: 1.1rem; }
    .top-timer { font-family: 'Courier New', Courier, monospace; font-weight: 800; font-size: 1.1rem; color: var(--text-primary); background: rgba(0,0,0,0.05); padding: 0.3rem 0.8rem; border-radius: 8px; }
    .top-timer.urgent { color: #ef4444; background: rgba(239,68,68,0.1); animation: urgentPulse 1s infinite; }
    
    .runner-layout { flex: 1; display: flex; overflow: hidden; }
    
    .runner-sidebar { width: 250px; background: #fff; border-right: 2px solid rgba(0,0,0,0.06); display: flex; flex-direction: column; padding: 1.5rem; overflow-y: auto; flex-shrink: 0; }
    .nav-title { font-weight: 800; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-secondary); margin-bottom: 1rem; }
    .grid-nav { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; margin-bottom: 2rem; }
    .nav-bubble { aspect-ratio: 1; border-radius: 50%; border: 2px solid rgba(0,0,0,0.1); background: transparent; font-weight: 700; color: var(--text-secondary); cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
    .nav-bubble.answered { background: rgba(133,92,214,0.15); border-color: rgba(133,92,214,0.4); color: var(--accent-primary); }
    .nav-bubble.current { transform: scale(1.15); border-color: var(--accent-primary); background: var(--accent-primary); color: #fff; box-shadow: 0 4px 10px rgba(133,92,214,0.3); }
    .runner-sidebar-footer { margin-top: auto; padding-top: 1rem; border-top: 1px dashed rgba(0,0,0,0.1); }
    .btn-finish { width: 100%; padding: 0.85rem; border-radius: 12px; border: none; background: #ef4444; color: #fff; font-weight: 700; font-size: 0.95rem; cursor: pointer; transition: all 0.2s; }
    .btn-finish:hover { background: #dc2626; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(239,68,68,0.3); }
    
    .question-area { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
    .question-scroll { flex: 1; overflow-y: auto; padding: 2.5rem; display: flex; justify-content: center; align-items: flex-start; scroll-behavior: smooth; }
    .question-card { max-width: 800px; width: 100%; animation: fadeIn 0.3s ease-out; }
    
    .q-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .q-number { font-weight: 800; font-size: 1.2rem; color: var(--accent-primary); }
    .q-topic { font-size: 0.8rem; font-weight: 700; background: rgba(133,92,214,0.1); color: var(--accent-primary); padding: 0.3rem 0.8rem; border-radius: 99px; text-transform: uppercase; }
    
    .q-preambulo { padding: 1.25rem; background: #fff; border: 1px solid rgba(0,0,0,0.08); border-left: 4px solid var(--accent-primary); border-radius: 12px; margin-bottom: 1.5rem; }
    .q-preambulo p { margin: 0; line-height: 1.6; color: var(--text-secondary); font-size: 1rem; }
    
    .q-image-wrap { margin-bottom: 1.5rem; text-align: center; }
    .q-image { max-width: 100%; max-height: 300px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.1); }
    
    .q-text { font-size: 1.15rem; font-weight: 700; color: var(--text-primary); line-height: 1.6; margin: 0 0 1.5rem; }
    
    .q-formula { margin-bottom: 1.5rem; padding: 1rem; background: #fff; border: 1px solid rgba(0,0,0,0.08); border-radius: 12px; text-align: center; overflow-x: auto; }
    
    .options-grid { display: flex; flex-direction: column; gap: 0.85rem; padding-bottom: 2rem; }
    .option-btn { display: flex; align-items: center; gap: 1rem; padding: 1.15rem 1.25rem; border: 2px solid rgba(0,0,0,0.08); border-radius: 14px; background: #fff; cursor: pointer; transition: all 0.2s; text-align: left; width: 100%; }
    .option-btn:hover:not(.selected) { border-color: rgba(133,92,214,0.3); background: rgba(133,92,214,0.03); transform: translateX(4px); }
    .option-btn.selected { border-color: var(--accent-primary); background: rgba(133,92,214,0.08); box-shadow: 0 0 0 1px var(--accent-primary); }
    .opt-letter { width: 36px; height: 36px; border-radius: 8px; border: 2px solid rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; font-family: var(--font-heading); font-weight: 800; font-size: 0.95rem; color: var(--text-secondary); flex-shrink: 0; transition: all 0.2s; }
    .opt-letter.sel { background: var(--accent-primary); border-color: var(--accent-primary); color: #fff; }
    .opt-text { font-size: 1.05rem; color: var(--text-primary); line-height: 1.5; }
    .opt-img { max-width: 100%; max-height: 100px; border-radius: 6px; }
    
    .bottom-bar { display: flex; justify-content: space-between; padding: 1rem 1.5rem; background: #fff; border-top: 2px solid rgba(0,0,0,0.06); flex-shrink: 0; }
    .btn-nav { padding: 0.8rem 1.5rem; border-radius: 12px; border: 2px solid rgba(0,0,0,0.1); background: transparent; color: var(--text-secondary); font-weight: 700; cursor: pointer; transition: all 0.2s; }
    .btn-nav:hover:not(:disabled) { border-color: var(--text-secondary); color: var(--text-primary); }
    .btn-nav:disabled { opacity: 0.4; cursor: not-allowed; }
    .btn-primary { background: var(--accent-primary); color: #fff; border: none; box-shadow: 0 4px 12px rgba(133,92,214,0.25); }
    .btn-primary:hover { background: #6b46b8; transform: translateY(-2px); box-shadow: 0 6px 16px rgba(133,92,214,0.35); }
    
    /* MODAL STYLES */
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; animation: fadeIn 0.2s; }
    .modal-card { background: #fff; padding: 2.5rem; border-radius: 20px; max-width: 400px; width: 90%; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
    .modal-icon { font-size: 3rem; margin-bottom: 1rem; }
    .modal-card h2 { font-family: var(--font-heading); font-size: 1.5rem; margin: 0 0 0.5rem; color: var(--text-primary); }
    .modal-card p { color: var(--text-secondary); line-height: 1.5; margin-bottom: 2rem; font-size: 0.95rem; }
    .warning-text { color: #ef4444 !important; font-weight: 600; }
    .modal-actions { display: flex; gap: 1rem; justify-content: center; }
    .btn-cancel, .btn-confirm, .btn-confirm-submit { padding: 0.85rem 1.5rem; border-radius: 12px; font-weight: 700; cursor: pointer; border: none; transition: all 0.2s; flex: 1; }
    .btn-cancel { background: #f1f5f9; color: var(--text-secondary); }
    .btn-cancel:hover { background: #e2e8f0; color: var(--text-primary); }
    .btn-confirm { background: #ef4444; color: #fff; }
    .btn-confirm:hover { background: #dc2626; transform: translateY(-2px); }
    .btn-confirm-submit { background: var(--accent-primary); color: #fff; }
    .btn-confirm-submit:hover { background: #6b46b8; transform: translateY(-2px); }
    
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes urgentPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
    
    @media (max-width: 768px) {
      .runner-layout { flex-direction: column; }
      .runner-sidebar { width: 100%; border-right: none; border-bottom: 2px solid rgba(0,0,0,0.06); max-height: 200px; padding: 1rem; }
      .grid-nav { grid-template-columns: repeat(8, 1fr); margin-bottom: 1rem; }
      .runner-sidebar-footer { display: none; }
      .question-scroll { padding: 1.5rem 1rem; }
      .q-text { font-size: 1.05rem; }
    }
  `]
})
export class MiniEnsayoRunnerComponent implements OnInit, OnDestroy {
  private auth = inject(AuthService);

  mobileOpen = false;
  showSettingsModal = false;
  showProfileModal = false;
  showLogoutConfirm = false;
  isCollapsible = false;

  get herramientasExpanded(): boolean {
    const val = localStorage.getItem('herramientasExpanded');
    return val !== 'false';
  }

  toggleHerramientas() {
    this.isCollapsible = true;
    const current = this.herramientasExpanded;
    localStorage.setItem('herramientasExpanded', String(!current));
  }

  confirmLogout() {
    this.showLogoutConfirm = true;
  }

  async executeLogout() {
    this.showLogoutConfirm = false;
    await this.auth.logout().toPromise();
    this.router.navigate(['/']);
  }

  private miniEnsayoSvc = inject(MiniEnsayoService);
  private router = inject(Router);
  private katex = inject(KatexService);
  private sanitizer = inject(DomSanitizer);

  session = this.miniEnsayoSvc.activeSession;
  optionKeys: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
  
  answers = signal<Record<string, any>>({});
  currentIndex = signal(0);
  
  timer = signal(0);
  initialTime = 0;
  private intervalId: any;

  showExitModal = false;
  showSubmitModal = false;

  currentQuestion = computed(() => {
    const s = this.session();
    return s ? s.questions[this.currentIndex()] : undefined;
  });

  totalQuestions = computed(() => this.session()?.questions.length || 0);
  answeredCount = computed(() => Object.keys(this.answers()).length);
  unansweredCount = computed(() => this.totalQuestions() - this.answeredCount());
  isLastQuestion = computed(() => this.currentIndex() === this.totalQuestions() - 1);

  ngOnInit() {
    const s = this.session();
    if (!s) {
      this.router.navigate(['/mini-ensayo']);
      return;
    }
    
    this.answers.set(this.miniEnsayoSvc.loadAnswersDraft());
    this.initialTime = s.config.timeLimitMinutes * 60;
    
    const started = new Date(s.startedAt).getTime();
    const now = Date.now();
    const elapsed = Math.floor((now - started) / 1000);
    const remaining = Math.max(0, this.initialTime - elapsed);
    
    this.timer.set(remaining);
    
    this.intervalId = setInterval(() => {
      const current = this.timer();
      if (current <= 1) {
        clearInterval(this.intervalId);
        this.executeSubmit(true);
      } else {
        this.timer.set(current - 1);
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  selectAnswer(preguntaId: string, option: 'A' | 'B' | 'C' | 'D') {
    const curr = { ...this.answers() };
    curr[preguntaId] = option;
    this.answers.set(curr);
    this.miniEnsayoSvc.saveAnswersDraft(curr);
  }

  nextQuestion() {
    this.currentIndex.update(v => Math.min(this.totalQuestions() - 1, v + 1));
    const qa = document.querySelector('.question-area');
    if (qa) qa.scrollTop = 0;
  }

  prevQuestion() {
    this.currentIndex.update(v => Math.max(0, v - 1));
    const qa = document.querySelector('.question-area');
    if (qa) qa.scrollTop = 0;
  }

  goToQuestion(index: number) {
    this.currentIndex.set(index);
    const qa = document.querySelector('.question-area');
    if (qa) qa.scrollTop = 0;
  }

  submitEnsayo() {
    this.showSubmitModal = true;
  }

  executeSubmit(force: boolean = false) {
    if (this.intervalId) clearInterval(this.intervalId);
    const timeSpent = this.initialTime - this.timer();
    this.miniEnsayoSvc.submitSession(this.session()!.id, this.answers() as any, timeSpent);
    this.showSubmitModal = false;
    this.router.navigate(['/mini-ensayo/review']);
  }

  confirmExit() {
    this.showExitModal = true;
  }

  executeExit() {
    this.showExitModal = false;
    this.router.navigate(['/dashboard']);
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  renderLatex(latex: string): SafeHtml {
    try {
      return this.katex.render(latex);
    } catch {
      return latex;
    }
  }
}
