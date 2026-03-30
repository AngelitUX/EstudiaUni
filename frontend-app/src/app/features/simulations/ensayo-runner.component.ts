import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FirestoreService, Pregunta } from '../../core/services/firestore.service';

interface Question {
  id: string;
  stem: string;
  options: { id: string; text: string }[];
  correctAnswer?: string;
}

@Component({
  selector: 'app-ensayo-runner',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="exam-container">
      <!-- HEADER MINIMALISTA -->
      <header class="exam-header">
        <div class="header-left">
          <button class="btn-icon" (click)="confirmExit()">←</button>
          <span class="exam-title">{{ examTitle }}</span>
        </div>
        
        <div class="header-center">
          <div class="progress-info">
            <div class="progress-bar-container">
              <div class="progress-bar" [style.width.%]="(currentIndex + 1) / totalQuestions * 100"></div>
            </div>
            <span class="progress-text">Pregunta {{ currentIndex + 1 }} de {{ totalQuestions }}</span>
          </div>
        </div>
        
        <div class="header-right">
          <div class="timer" [class.warning]="timeWarning" [class.critical]="timeCritical">
            <span class="timer-icon">⏱️</span>
            <span class="timer-value">{{ formattedTime }}</span>
          </div>
          <button class="btn btn-ghost" (click)="confirmExit()">
            Pausar y Salir
          </button>
        </div>
      </header>

      <!-- MAIN EXAM AREA -->
      <div class="exam-body">
        <!-- QUESTION NAVIGATOR (Left Column) -->
        <aside class="question-nav">
          <h4 class="nav-title">Navegador</h4>
          <div class="question-grid">
            <button 
              *ngFor="let q of questions; let i = index"
              class="q-btn"
              [class.answered]="answers[q.id]"
              [class.current]="currentIndex === i"
              [class.flagged]="flagged[q.id]"
              (click)="goToQuestion(i)">
              {{ i + 1 }}
            </button>
          </div>
          
          <div class="nav-legend">
            <div class="legend-item">
              <span class="legend-dot answered"></span>
              <span>Respondida</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot current"></span>
              <span>Actual</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot"></span>
              <span>Sin responder</span>
            </div>
          </div>

          <div class="nav-stats">
            <div class="stat">
              <span class="stat-value">{{ answeredCount }}</span>
              <span class="stat-label">Respondidas</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ totalQuestions - answeredCount }}</span>
              <span class="stat-label">Pendientes</span>
            </div>
          </div>
        </aside>

        <!-- QUESTION AREA (Right Column) -->
        <main class="question-area">
          <div class="question-card glass-card" *ngIf="currentQuestion">
            <div class="question-header">
              <span class="question-number">Pregunta {{ currentIndex + 1 }}</span>
              <button 
                class="flag-btn" 
                [class.flagged]="flagged[currentQuestion.id]"
                (click)="toggleFlag()">
                {{ flagged[currentQuestion.id] ? '🚩 Marcada' : '🏳️ Marcar' }}
              </button>
            </div>

            <div class="question-stem">
              {{ currentQuestion.stem }}
            </div>

            <div class="options-list">
              <button 
                *ngFor="let opt of currentQuestion.options"
                class="option-btn"
                [class.selected]="answers[currentQuestion.id] === opt.id"
                (click)="selectOption(opt.id)">
                <span class="option-id">{{ opt.id }}</span>
                <span class="option-text">{{ opt.text }}</span>
              </button>
            </div>
          </div>

          <!-- NAVIGATION -->
          <div class="question-navigation">
            <button 
              class="btn btn-outline"
              [disabled]="currentIndex === 0"
              (click)="prevQuestion()">
              ← Anterior
            </button>
            
            <button 
              *ngIf="currentIndex < totalQuestions - 1"
              class="btn btn-primary"
              (click)="nextQuestion()">
              Siguiente Pregunta →
            </button>

            <button 
              *ngIf="currentIndex === totalQuestions - 1"
              class="btn btn-success"
              (click)="finishExam()">
              ✓ Finalizar Ensayo
            </button>
          </div>
        </main>
      </div>

      <!-- EXIT MODAL -->
      <div class="modal-overlay" *ngIf="showExitModal" (click)="showExitModal = false">
        <div class="modal glass-card" (click)="$event.stopPropagation()">
          <h3>¿Pausar y salir?</h3>
          <p>Tu progreso se guardará. Podrás continuar después.</p>
          <div class="modal-actions">
            <button class="btn btn-outline" (click)="showExitModal = false">Cancelar</button>
            <button class="btn btn-primary" (click)="exitExam()">Salir</button>
          </div>
        </div>
      </div>

      <!-- FINISH MODAL -->
      <div class="modal-overlay" *ngIf="showFinishModal" (click)="showFinishModal = false">
        <div class="modal glass-card" (click)="$event.stopPropagation()">
          <h3>¿Finalizar ensayo?</h3>
          <p>Has respondido <strong>{{ answeredCount }}</strong> de <strong>{{ totalQuestions }}</strong> preguntas.</p>
          <p *ngIf="answeredCount < totalQuestions" class="warning-text">
            ⚠️ Tienes {{ totalQuestions - answeredCount }} preguntas sin responder.
          </p>
          <div class="modal-actions">
            <button class="btn btn-outline" (click)="showFinishModal = false">Revisar</button>
            <button class="btn btn-success" (click)="submitExam()">Finalizar</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .exam-container { min-height: 100vh; display: flex; flex-direction: column; background: var(--bg-color); }
    
    /* ===== HEADER ===== */
    .exam-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 2rem;
      background: rgba(13, 15, 23, 0.95);
      border-bottom: 1px solid var(--glass-border);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .header-left { display: flex; align-items: center; gap: 1rem; }
    .btn-icon {
      background: rgba(255, 255, 255, 0.1);
      border: none;
      color: #fff;
      width: 36px;
      height: 36px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1.2rem;
    }
    .btn-icon:hover { background: rgba(255, 255, 255, 0.15); }
    .exam-title {
      font-family: var(--font-heading);
      font-size: 1.1rem;
      font-weight: 600;
    }
    .header-center { flex: 1; max-width: 400px; margin: 0 2rem; }
    .progress-info { text-align: center; }
    .progress-bar-container {
      height: 6px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }
    .progress-bar {
      height: 100%;
      background: var(--gradient-brand);
      transition: width 0.3s ease;
    }
    .progress-text { font-size: 0.85rem; color: var(--text-secondary); }
    .header-right { display: flex; align-items: center; gap: 1.5rem; }
    .timer {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-family: monospace;
      font-size: 1.25rem;
      font-weight: 600;
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      color: var(--text-secondary);
    }
    .timer.warning { color: #f97316; background: rgba(249, 115, 22, 0.1); }
    .timer.critical { color: #ef4444; background: rgba(239, 68, 68, 0.15); animation: pulse 1s infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
    .timer-icon { font-size: 1rem; }

    /* ===== EXAM BODY ===== */
    .exam-body {
      flex: 1;
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 2rem;
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
    }

    /* ===== QUESTION NAV ===== */
    .question-nav {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--glass-border);
      border-radius: 16px;
      padding: 1.5rem;
      height: fit-content;
      position: sticky;
      top: 100px;
    }
    .nav-title {
      font-size: 0.85rem;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 1rem;
    }
    .question-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }
    .q-btn {
      width: 40px;
      height: 40px;
      border: 2px solid var(--glass-border);
      background: rgba(255, 255, 255, 0.03);
      color: var(--text-secondary);
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .q-btn:hover { border-color: var(--accent-primary); color: #fff; }
    .q-btn.answered {
      background: var(--accent-primary);
      border-color: var(--accent-primary);
      color: #fff;
    }
    .q-btn.current {
      border-color: #fff;
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
    }
    .q-btn.flagged { border-color: #f97316; }
    .nav-legend {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 1rem 0;
      border-top: 1px solid var(--glass-border);
      border-bottom: 1px solid var(--glass-border);
      margin-bottom: 1rem;
    }
    .legend-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: var(--text-secondary); }
    .legend-dot {
      width: 12px;
      height: 12px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.1);
      border: 2px solid var(--glass-border);
    }
    .legend-dot.answered { background: var(--accent-primary); border-color: var(--accent-primary); }
    .legend-dot.current { border-color: #fff; box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3); }
    .nav-stats { display: flex; justify-content: space-around; }
    .stat { text-align: center; }
    .stat-value { display: block; font-size: 1.5rem; font-weight: 700; color: var(--accent-primary); }
    .stat-label { font-size: 0.75rem; color: var(--text-secondary); }

    /* ===== QUESTION AREA ===== */
    .question-area { display: flex; flex-direction: column; gap: 1.5rem; }
    .question-card {
      padding: 2.5rem;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--glass-border);
    }
    .question-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .question-number {
      font-size: 0.9rem;
      color: var(--accent-primary);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .flag-btn {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--glass-border);
      color: var(--text-secondary);
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .flag-btn:hover { border-color: #f97316; color: #f97316; }
    .flag-btn.flagged { background: rgba(249, 115, 22, 0.15); border-color: #f97316; color: #f97316; }
    .question-stem {
      font-size: 1.3rem;
      line-height: 1.7;
      color: #fff;
      margin-bottom: 2.5rem;
    }
    .options-list { display: flex; flex-direction: column; gap: 1rem; }
    .option-btn {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem 1.5rem;
      background: rgba(255, 255, 255, 0.03);
      border: 2px solid var(--glass-border);
      border-radius: 12px;
      color: #fff;
      font-size: 1.1rem;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s;
    }
    .option-btn:hover {
      background: rgba(99, 102, 241, 0.1);
      border-color: rgba(99, 102, 241, 0.5);
    }
    .option-btn.selected {
      background: rgba(99, 102, 241, 0.2);
      border-color: var(--accent-primary);
      box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
    }
    .option-id {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      font-weight: 700;
      flex-shrink: 0;
    }
    .option-btn.selected .option-id {
      background: var(--accent-primary);
    }

    /* ===== NAVIGATION ===== */
    .question-navigation {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
    }
    .btn { padding: 0.85rem 1.75rem; border-radius: 10px; font-weight: 600; font-size: 1rem; cursor: pointer; transition: all 0.2s; border: none; }
    .btn-primary { background: var(--gradient-brand); color: #fff; }
    .btn-primary:hover { opacity: 0.9; transform: translateY(-2px); }
    .btn-outline { background: transparent; border: 2px solid var(--glass-border); color: #fff; }
    .btn-outline:hover { border-color: var(--accent-primary); }
    .btn-outline:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-success { background: linear-gradient(135deg, #10b981, #059669); color: #fff; }
    .btn-ghost { background: transparent; color: var(--text-secondary); border: none; }
    .btn-ghost:hover { color: #fff; }

    /* ===== MODALS ===== */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal {
      padding: 2.5rem;
      border-radius: 20px;
      max-width: 420px;
      text-align: center;
    }
    .modal h3 { font-size: 1.5rem; margin-bottom: 1rem; }
    .modal p { color: var(--text-secondary); margin-bottom: 0.5rem; }
    .warning-text { color: #f97316 !important; }
    .modal-actions { display: flex; gap: 1rem; justify-content: center; margin-top: 1.5rem; }

    .glass-card { background: rgba(255, 255, 255, 0.03); border: 1px solid var(--glass-border); backdrop-filter: blur(10px); }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 900px) {
      .exam-body { grid-template-columns: 1fr; }
      .question-nav { position: relative; top: 0; }
      .header-center { display: none; }
      .exam-title { display: none; }
    }
  `]
})
export class EnsayoRunnerComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private firestoreService = inject(FirestoreService);

  examId = '';
  intentoId = '';
  examTitle = 'Ensayo M1 - Forma 115';
  totalQuestions = 65;
  currentIndex = 0;
  answers: { [key: string]: string } = {};
  flagged: { [key: string]: boolean } = {};
  loading = true;

  showExitModal = false;
  showFinishModal = false;

  // Timer
  timeRemaining = 140 * 60; // 2h 20m in seconds
  startTime = Date.now();
  timerInterval: any;

  // Preguntas cargadas desde Firestore
  questions: Question[] = [];

  get currentQuestion(): Question | null {
    return this.questions[this.currentIndex] || null;
  }

  get answeredCount(): number {
    return Object.keys(this.answers).length;
  }

  get formattedTime(): string {
    const hours = Math.floor(this.timeRemaining / 3600);
    const mins = Math.floor((this.timeRemaining % 3600) / 60);
    const secs = this.timeRemaining % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  get timeWarning(): boolean {
    return this.timeRemaining <= 15 * 60 && this.timeRemaining > 5 * 60;
  }

  get timeCritical(): boolean {
    return this.timeRemaining <= 5 * 60;
  }

  ngOnInit() {
    this.examId = this.route.snapshot.paramMap.get('id') || '';
    this.intentoId = this.route.snapshot.queryParamMap.get('intento') || '';
    this.loadQuestions();
  }

  ngOnDestroy() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  loadQuestions() {
    this.loading = true;
    this.firestoreService.getPreguntas(this.examId).subscribe(preguntas => {
      this.questions = preguntas.map(p => this.mapPreguntaToQuestion(p));
      this.totalQuestions = this.questions.length;
      this.loading = false;
      this.startTimer();
    });
  }

  private mapPreguntaToQuestion(pregunta: Pregunta): Question {
    return {
      id: pregunta.id || '',
      stem: pregunta.text,
      options: [
        { id: 'A', text: pregunta.options.A },
        { id: 'B', text: pregunta.options.B },
        { id: 'C', text: pregunta.options.C },
        { id: 'D', text: pregunta.options.D },
        { id: 'E', text: pregunta.options.E }
      ],
      correctAnswer: pregunta.correctAnswer
    };
  }

  startTimer() {
    this.startTime = Date.now();
    this.timerInterval = setInterval(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining--;
      } else {
        this.submitExam();
      }
    }, 1000);
  }

  selectOption(optionId: string) {
    if (this.currentQuestion) {
      this.answers[this.currentQuestion.id] = optionId;
      
      // Guardar respuesta en Firestore si hay intento activo
      if (this.intentoId) {
        const isCorrect = this.currentQuestion.correctAnswer === optionId;
        this.firestoreService.saveAnswer(this.intentoId, this.currentQuestion.id, optionId, isCorrect)
          .catch(() => {}); // Silenciar error si falla
      }
    }
  }

  toggleFlag() {
    if (this.currentQuestion) {
      this.flagged[this.currentQuestion.id] = !this.flagged[this.currentQuestion.id];
    }
  }

  goToQuestion(index: number) {
    this.currentIndex = index;
  }

  prevQuestion() {
    if (this.currentIndex > 0) this.currentIndex--;
  }

  nextQuestion() {
    if (this.currentIndex < this.totalQuestions - 1) this.currentIndex++;
  }

  confirmExit() {
    this.showExitModal = true;
  }

  exitExam() {
    this.router.navigate(['/ensayos']);
  }

  finishExam() {
    this.showFinishModal = true;
  }

  async submitExam() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    
    const timeSpent = Math.floor((Date.now() - this.startTime) / 1000);
    
    // Finalizar intento en Firestore
    if (this.intentoId) {
      try {
        await this.firestoreService.finishIntento(this.intentoId, timeSpent);
      } catch (e) {
        // Continuar aunque falle
      }
    }
    
    this.router.navigate(['/ensayo', this.examId, 'review'], {
      queryParams: { intento: this.intentoId }
    });
  }
}
