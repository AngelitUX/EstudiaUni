import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SimulationsService } from '../services/simulations.service';
import { QuizService } from '../../modules/services/quiz.service';
import { ToastService } from '../../../core/services/toast.service';
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * SimulationRunnerComponent - Quiz & Simulation Test Runner
 * 
 * BUG FIXES (29/03/2026):
 * 
 * 1. TIMER IMPLEMENTATION:
 *    - Added functional countdown timer for simulations
 *    - Persists in localStorage (survives page reload)
 *    - Auto-submits when timer reaches 0
 *    - Cleanup on component destroy
 * 
 * 2. ERROR HANDLING:
 *    - Replaced alert() with toast notifications
 *    - Specific error messages from API
 *    - Non-blocking UX
 * 
 * 3. LOADING STATES:
 *    - Prevents double-submission with submitting flag
 *    - Disables submit button during request
 * 
 * Timer Features:
 * - Only activates for type='simulation' with timeLimitMinutes
 * - Stores progress: localStorage key = 'timer_{attemptId}'
 * - Format: MM:SS display
 * - Toast notification on auto-submit
 */
@Component({
  selector: 'app-simulation-runner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="simulation-container animate-fade-in" *ngIf="attempt && !showResults">
      <header class="sim-header">
        <div class="sim-title">{{ attempt.type === 'quiz' ? 'Mini-Quiz Adaptativo' : 'Ensayo PAES' }}</div>
        <div class="sim-timer" *ngIf="timeLeft">Tiempo: {{ formatTime(timeLeft) }}</div>
      </header>

      <div class="progress-bar-container">
        <div class="progress-bar" [style.width.%]="((currentIndex + 1) / questions.length) * 100"></div>
      </div>

      <div class="question-number">Pregunta {{ currentIndex + 1 }} de {{ questions.length }}</div>

      <div class="question-card glass-card" *ngIf="questions.length > 0">
        <p class="stem">{{ currentQuestion.stem }}</p>
        
        <div class="options-list">
          <button 
            *ngFor="let opt of currentQuestion.options" 
            class="option-btn" 
            [class.selected]="selectedAnswers[currentQuestion.id] === opt.id"
            (click)="selectOption(opt.id)"
          >
            <span class="opt-id">{{ opt.id }}</span> {{ opt.text }}
          </button>
        </div>
      </div>

      <div class="actions">
        <button class="btn btn-outline" (click)="prev()" [disabled]="currentIndex === 0">Anterior</button>
        
        <button class="btn btn-primary" (click)="next()" *ngIf="currentIndex < questions.length - 1">Siguiente</button>
        <button class="btn btn-primary bg-success" (click)="submit()" *ngIf="currentIndex === questions.length - 1" [disabled]="submitting">
          {{ submitting ? 'Enviando...' : 'Finalizar' }}
        </button>
      </div>
    </div>

    <!-- Resultados -->
    <div class="results-container animate-fade-in" *ngIf="showResults && results">
      <div class="glass-card text-center">
        <h2>¡Resultados!</h2>
        <div class="score-display">
          <div class="score-number">{{ results.score?.percentage }}%</div>
          <div class="score-desc">Rendimiento</div>
        </div>

        <div class="results-details">
          <div><i class="green">✅</i> Correctas: {{ results.score?.correct }}</div>
          <div><i class="red">❌</i> Incorrectas: {{ results.score?.incorrect }}</div>
          <div *ngIf="results.score?.omitted !== undefined"><i class="gray">⭕</i> Omitidas: {{ results.score?.omitted }}</div>
        </div>

        <div class="feedback-box mt-4" *ngIf="parsedFeedback">
          <div class="markdown-body" [innerHTML]="parsedFeedback"></div>
        </div>

        <div class="actions center mt-4">
          <button class="btn btn-primary" (click)="goDashboard()">Volver al Inicio</button>
        </div>
      </div>
    </div>

    <div *ngIf="loading" class="simulation-container loading-state">
      Cargando preguntas de la evaluación...
    </div>
  `,
  styles: [`
    .simulation-container, .results-container { padding: 2rem; max-width: 800px; margin: auto; }
    .sim-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .sim-title { font-family: var(--font-heading); font-size: 1.5rem; font-weight: bold; }
    .sim-timer { font-family: monospace; font-size: 1.2rem; background: rgba(255,255,255,0.1); padding: 0.5rem 1rem; border-radius: 8px; }
    
    .progress-bar-container { height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; margin-bottom: 1rem; }
    .progress-bar { height: 100%; background: var(--gradient-brand); transition: width 0.3s; }
    .question-number { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 2rem; text-align: right; }

    .question-card { padding: 3rem; margin-bottom: 2rem; }
    .stem { font-size: 1.25rem; font-weight: 500; margin-bottom: 2.5rem; color: #fff; line-height: 1.6; }
    
    .options-list { display: flex; flex-direction: column; gap: 1rem; }
    .option-btn { background: rgba(255,255,255,0.05); border: 2px solid var(--glass-border); padding: 1.2rem; border-radius: 12px; color: white; text-align: left; font-size: 1.1rem; cursor: pointer; transition: all 0.2s; display: flex; align-items: center;}
    .opt-id { display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 50%; background: rgba(255,255,255,0.1); margin-right: 1rem; font-weight: bold; }
    .option-btn:hover { background: rgba(99,102,241,0.1); border-color: rgba(99,102,241,0.5); }
    .option-btn.selected { background: rgba(99,102,241,0.2); border-color: var(--accent-primary); box-shadow: 0 0 15px rgba(99,102,241,0.3); }

    .actions { display: flex; justify-content: space-between; align-items: center; }
    .actions.center { justify-content: center; }
    .bg-success { background: linear-gradient(135deg, #10b981, #059669); }

    .score-display { margin: 2rem 0; }
    .score-number { font-size: 5rem; font-weight: 800; color: transparent; background: var(--gradient-brand); -webkit-background-clip: text; }
    .score-desc { font-size: 1.2rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 2px; }
    .results-details { display: flex; justify-content: center; gap: 2rem; font-size: 1.1rem; }
    .feedback-box { background: rgba(255,255,255,0.05); border: 1px dashed var(--glass-border); padding: 1.5rem; border-radius: 12px; margin-top: 2rem; text-align: left; }
    .green { color: #10b981; } .red { color: #ef4444; } .gray { color: #9ca3af; }
    .text-center { text-align: center; }
    
    ::ng-deep .markdown-body h1, 
    ::ng-deep .markdown-body h2, 
    ::ng-deep .markdown-body h3 {
      font-family: var(--font-heading);
      margin-top: 1.5rem;
      margin-bottom: 1rem;
      color: #fff;
    }
    ::ng-deep .markdown-body p { margin-bottom: 1.2rem; }
    ::ng-deep .markdown-body code { background: rgba(0,0,0,0.3); padding: 0.2rem 0.4rem; border-radius: 4px; font-family: monospace; color: #fdfba8;}
  `]
})
export class SimulationRunnerComponent implements OnInit, OnDestroy {
  route = inject(ActivatedRoute);
  router = inject(Router);
  simService = inject(SimulationsService);
  quizService = inject(QuizService);
  sanitizer = inject(DomSanitizer);
  toast = inject(ToastService);

  attemptId = '';
  attempt: any = null;
  questions: any[] = [];
  currentIndex = 0;
  
  selectedAnswers: { [qId: string]: string } = {};

  loading = true;
  submitting = false;
  showResults = false;
  results: any = null;
  parsedFeedback: SafeHtml = '';
  
  timeLeft: number | null = null;
  timerInterval: any;
  storageKey = '';

  get currentQuestion() {
    return this.questions[this.currentIndex];
  }

  ngOnInit() {
    this.attemptId = this.route.snapshot.paramMap.get('attemptId') || '';
    this.storageKey = `timer_${this.attemptId}`;
    
    if (this.attemptId) {
      this.simService.getAttempt(this.attemptId).subscribe({
        next: (data) => {
          if (!data) {
            this.loading = false;
            return;
          }
          this.attempt = data;
          this.questions = data.questions || [];
          
          // Initialize timer for full simulations (not quizzes)
          if (data.type === 'simulation' && data.timeLimitMinutes) {
            this.initializeTimer(data.timeLimitMinutes);
          }
          
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching attempt', err);
          this.loading = false;
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  initializeTimer(minutes: number) {
    // Check if there's a saved timer in localStorage
    const savedTime = localStorage.getItem(this.storageKey);
    
    if (savedTime) {
      this.timeLeft = parseInt(savedTime, 10);
    } else {
      this.timeLeft = minutes * 60; // Convert to seconds
    }

    // Start countdown
    this.timerInterval = setInterval(() => {
      if (this.timeLeft !== null && this.timeLeft > 0) {
        this.timeLeft--;
        localStorage.setItem(this.storageKey, this.timeLeft.toString());
      } else if (this.timeLeft === 0) {
        // Time's up! Auto-submit
        this.autoSubmit();
      }
    }, 1000);
  }

  autoSubmit() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    localStorage.removeItem(this.storageKey);
    this.toast.info('¡Tiempo terminado! La simulación se enviará automáticamente.', 5000);
    this.submit();
  }

  selectOption(optId: string) {
    if (!this.currentQuestion) return;
    this.selectedAnswers[this.currentQuestion.id] = optId;
  }

  next() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  async processResults(res: any) {
    // Clear timer when results are shown
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    localStorage.removeItem(this.storageKey);
    
    this.showResults = true;
    this.results = res;
    this.submitting = false;
    
    if (res.feedback || res.structuredAnalysis?.fullMarkdown) {
      const fb = res.structuredAnalysis?.fullMarkdown || res.feedback;
      const html = await marked.parse(fb);
      this.parsedFeedback = this.sanitizer.bypassSecurityTrustHtml(html);
    }
  }

  submit() {
    if (this.submitting) return; // Prevent double submission
    this.submitting = true;
    
    const answersArray = Object.keys(this.selectedAnswers).map(qId => ({
      questionId: qId,
      selectedOption: this.selectedAnswers[qId]
    }));

    if (this.attempt.type === 'quiz') {
      this.quizService.submitQuiz(this.attemptId, answersArray).subscribe({
        next: (res) => this.processResults(res),
        error: (err) => {
          const message = err.error?.message || 'Error al enviar el quiz. Por favor intenta nuevamente.';
          this.toast.error(message);
          this.submitting = false;
        }
      });
    } else {
      this.simService.submitSimulation(this.attemptId, answersArray).subscribe({
        next: () => {
          this.simService.finishSimulation(this.attemptId).subscribe({
            next: (res) => this.processResults(res),
            error: (err) => {
              const message = err.error?.message || 'Error al finalizar la simulación.';
              this.toast.error(message);
              this.submitting = false;
            }
          });
        },
        error: (err) => {
          const message = err.error?.message || 'Error al enviar las respuestas.';
          this.toast.error(message);
          this.submitting = false;
        }
      });
    }
  }
  
  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  goDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
