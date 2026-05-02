import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

interface ReviewQuestion {
  id: number;
  stem: string;
  options: { id: string; text: string }[];
  userAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: {
    whyWrong?: string;
    correctSolution: string;
    tip: string;
  };
}

@Component({
  selector: 'app-ensayo-review',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="review-container">
      <!-- HEADER -->
        <header class="review-header">
          <div class="header-left">
            <button class="btn-back" routerLink="/ensayos">← Volver</button>
            <div class="header-info">
              <h1>Revisión: {{ examTitle }}</h1>
              <p class="header-subtitle">Revisa tus respuestas y aprende de los errores</p>
            </div>
        </div>
        
        <div class="header-score">
          <div class="score-circle" [class.good]="scorePercentage >= 70" [class.warning]="scorePercentage >= 50 && scorePercentage < 70" [class.bad]="scorePercentage < 50">
            <span class="score-value">{{ scorePercentage }}%</span>
          </div>
          <div class="score-details">
            <span class="score-points">{{ score }} pts</span>
            <span class="score-breakdown">{{ correctCount }}/{{ totalQuestions }} correctas</span>
          </div>
        </div>
      </header>

      <!-- MAIN CONTENT -->
      <div class="review-body">
        <!-- SUMMARY CARDS -->
        <div class="summary-cards">
          <div class="summary-card correct">
            <span class="summary-icon">✅</span>
            <span class="summary-value">{{ correctCount }}</span>
            <span class="summary-label">Correctas</span>
          </div>
          <div class="summary-card incorrect">
            <span class="summary-icon">❌</span>
            <span class="summary-value">{{ incorrectCount }}</span>
            <span class="summary-label">Incorrectas</span>
          </div>
          <div class="summary-card omitted">
            <span class="summary-icon">⏭️</span>
            <span class="summary-value">{{ omittedCount }}</span>
            <span class="summary-label">Omitidas</span>
          </div>
        </div>

        <!-- FILTER TABS -->
        <div class="filter-tabs">
          <button 
            class="tab"
            [class.active]="activeFilter === 'all'"
            (click)="activeFilter = 'all'">
            Todas ({{ totalQuestions }})
          </button>
          <button 
            class="tab"
            [class.active]="activeFilter === 'incorrect'"
            (click)="activeFilter = 'incorrect'">
            ❌ Incorrectas ({{ incorrectCount }})
          </button>
          <button 
            class="tab"
            [class.active]="activeFilter === 'correct'"
            (click)="activeFilter = 'correct'">
            ✅ Correctas ({{ correctCount }})
          </button>
        </div>

        <!-- QUESTIONS LIST -->
        <div class="questions-list">
          <div 
            *ngFor="let question of filteredQuestions; let i = index"
            class="review-question-card glass-card"
            [class.correct]="question.isCorrect"
            [class.incorrect]="!question.isCorrect && question.userAnswer"
            [class.omitted]="!question.userAnswer">

            <div class="question-header">
              <span class="question-badge" [ngClass]="{'correct': question.isCorrect, 'incorrect': !question.isCorrect && question.userAnswer, 'omitted': !question.userAnswer}">
                {{ question.isCorrect ? '✅ Correcta' : (!question.userAnswer ? '⏭️ Omitida' : '❌ Incorrecta') }}
              </span>
              <span class="question-number">Pregunta {{ question.id }}</span>
            </div>

            <div class="question-stem">
              {{ question.stem }}
            </div>

            <div class="options-list">
              <div 
                *ngFor="let opt of question.options"
                class="option-review"
                [class.user-selected]="question.userAnswer === opt.id"
                [class.correct-answer]="question.correctAnswer === opt.id"
                [class.wrong-answer]="question.userAnswer === opt.id && question.correctAnswer !== opt.id">
                
                <span class="option-id">{{ opt.id }}</span>
                <span class="option-text">{{ opt.text }}</span>
                
                <span class="option-indicator" *ngIf="question.correctAnswer === opt.id">✓ Correcta</span>
                <span class="option-indicator wrong" *ngIf="question.userAnswer === opt.id && question.correctAnswer !== opt.id">✗ Tu respuesta</span>
              </div>
            </div>

            <!-- AI EXPLANATION -->
            <div class="ai-explanation" *ngIf="!question.isCorrect">
              <div class="ai-header">
                <span class="ai-icon">🤖</span>
                <span class="ai-title">Explicación del Tutor IA</span>
              </div>
              
              <div class="explanation-content">
                <!-- Why Wrong -->
                <div class="explanation-section" *ngIf="question.explanation.whyWrong">
                  <h4>❌ Por qué tu respuesta es incorrecta</h4>
                  <p>{{ question.explanation.whyWrong }}</p>
                </div>

                <!-- Correct Solution -->
                <div class="explanation-section">
                  <h4>📝 Desarrollo correcto paso a paso</h4>
                  <div class="solution-box">
                    <p>{{ question.explanation.correctSolution }}</p>
                  </div>
                </div>

                <!-- PAES Tip -->
                <div class="explanation-section tip">
                  <h4>💡 Tip para la PAES</h4>
                  <p>{{ question.explanation.tip }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ACTIONS -->
        <div class="review-actions">
          <button class="btn btn-outline" routerLink="/ensayos">
            ← Volver a Ensayos
          </button>
          <button class="btn btn-primary" routerLink="/ensayos">
            Practicar Más
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Contenedor principal con fondo completo */
    :host {
      display: block;
      min-height: 100vh;
      background: #000000;
    }
    
    .review-container { min-height: 100vh; color: #ffffff; }
    
    /* ===== HEADER ===== */
    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2rem;
      background: rgba(13, 15, 23, 0.95);
      border-bottom: 2px solid var(--glass-border);
    }
    .header-left { display: flex; align-items: center; gap: 1.5rem; }
    .btn-back {
      background: none;
      border: none;
      color: var(--accent-primary);
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.2s;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0;
    }
    .btn-back:hover {
      color: #fff;
      transform: translateX(-4px);
    }
    .header-info h1 {
      font-family: var(--font-heading);
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }
    .header-subtitle { color: var(--text-secondary); font-size: 0.9rem; }
    .header-score { display: flex; align-items: center; gap: 1rem; }
    .score-circle {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-heading);
      font-weight: 800;
      font-size: 1.25rem;
      border: 3px solid;
    }
    .score-circle.good { border-color: #10b981; color: #10b981; background: rgba(16, 185, 129, 0.1); }
    .score-circle.warning { border-color: #f97316; color: #f97316; background: rgba(249, 115, 22, 0.1); }
    .score-circle.bad { border-color: #ef4444; color: #ef4444; background: rgba(239, 68, 68, 0.1); }
    .score-details { display: flex; flex-direction: column; }
    .score-points { font-size: 1.25rem; font-weight: 700; color: #fff; }
    .score-breakdown { font-size: 0.85rem; color: var(--text-secondary); }

    /* ===== BODY ===== */
    .review-body { max-width: 900px; margin: 0 auto; padding: 2rem; }

    /* ===== SUMMARY CARDS ===== */
    .summary-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem; }
    .summary-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.03);
      border: 2px solid var(--glass-border);
      border-radius: 12px;
    }
    .summary-card.correct { border-color: rgba(16, 185, 129, 0.3); }
    .summary-card.incorrect { border-color: rgba(239, 68, 68, 0.3); }
    .summary-card.omitted { border-color: rgba(156, 163, 175, 0.3); }
    .summary-icon { font-size: 1.5rem; margin-bottom: 0.5rem; }
    .summary-value { font-size: 2rem; font-weight: 800; font-family: var(--font-heading); }
    .summary-card.correct .summary-value { color: #10b981; }
    .summary-card.incorrect .summary-value { color: #ef4444; }
    .summary-card.omitted .summary-value { color: #9ca3af; }
    .summary-label { color: var(--text-secondary); font-size: 0.85rem; }

    /* ===== FILTER TABS ===== */
    .filter-tabs { display: flex; gap: 0.5rem; margin-bottom: 2rem; flex-wrap: wrap; }
    .tab {
      padding: 0.75rem 1.25rem;
      background: rgba(255, 255, 255, 0.05);
      border: 2px solid var(--glass-border);
      border-radius: 10px;
      color: var(--text-secondary);
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .tab:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }
    .tab.active { background: var(--accent-primary); border-color: var(--accent-primary); color: #fff; }

    /* ===== QUESTION CARDS ===== */
    .questions-list { display: flex; flex-direction: column; gap: 2rem; }
    .review-question-card {
      padding: 2rem;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.03);
      border: 2px solid var(--glass-border);
    }
    .review-question-card.correct { border-left: 4px solid #10b981; }
    .review-question-card.incorrect { border-left: 4px solid #ef4444; }
    .review-question-card.omitted { border-left: 4px solid #9ca3af; }
    .question-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .question-badge {
      padding: 0.4rem 0.8rem;
      border-radius: 999px;
      font-size: 0.8rem;
      font-weight: 600;
    }
    .question-badge.correct { background: rgba(16, 185, 129, 0.2); color: #10b981; }
    .question-badge.incorrect { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
    .question-badge.omitted { background: rgba(156, 163, 175, 0.2); color: #9ca3af; }
    .question-number { color: var(--text-secondary); font-size: 0.9rem; }
    .question-stem { font-size: 1.15rem; line-height: 1.7; color: #fff; margin-bottom: 1.5rem; }

    /* ===== OPTIONS ===== */
    .options-list { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem; }
    .option-review {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.25rem;
      background: rgba(255, 255, 255, 0.02);
      border: 2px solid var(--glass-border);
      border-radius: 10px;
      transition: all 0.2s;
    }
    .option-review.correct-answer {
      background: rgba(16, 185, 129, 0.1);
      border-color: #10b981;
    }
    .option-review.wrong-answer {
      background: rgba(239, 68, 68, 0.1);
      border-color: #ef4444;
    }
    .option-id {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      font-weight: 700;
      font-size: 0.9rem;
      flex-shrink: 0;
    }
    .option-review.correct-answer .option-id { background: #10b981; color: #fff; }
    .option-review.wrong-answer .option-id { background: #ef4444; color: #fff; }
    .option-text { flex: 1; color: #e2e8f0; }
    .option-indicator { font-size: 0.8rem; font-weight: 600; color: #10b981; }
    .option-indicator.wrong { color: #ef4444; }

    /* ===== AI EXPLANATION ===== */
    .ai-explanation {
      margin-top: 1.5rem;
      padding: 1.5rem;
      background: rgba(99, 102, 241, 0.05);
      border: 2px solid rgba(99, 102, 241, 0.3);
      border-radius: 12px;
    }
    .ai-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.25rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid rgba(99, 102, 241, 0.3);
    }
    .ai-icon { font-size: 1.5rem; }
    .ai-title { font-weight: 600; color: var(--accent-primary); font-size: 1rem; }
    .explanation-content { display: flex; flex-direction: column; gap: 1.25rem; }
    .explanation-section h4 {
      font-size: 0.9rem;
      font-weight: 600;
      color: #fff;
      margin-bottom: 0.5rem;
    }
    .explanation-section p { color: var(--text-secondary); line-height: 1.7; font-size: 0.95rem; }
    .solution-box {
      background: rgba(0, 0, 0, 0.2);
      padding: 1rem;
      border-radius: 8px;
      font-family: monospace;
    }
    .solution-box p { color: #e2e8f0; }
    .explanation-section.tip {
      background: rgba(249, 115, 22, 0.1);
      padding: 1rem;
      border-radius: 8px;
      border-left: 3px solid #f97316;
    }
    .explanation-section.tip h4 { color: #f97316; }

    /* ===== ACTIONS ===== */
    .review-actions { display: flex; justify-content: space-between; margin-top: 3rem; padding-top: 2rem; border-top: 2px solid var(--glass-border); }
    .btn { padding: 0.85rem 1.75rem; border-radius: 10px; font-weight: 600; font-size: 1rem; cursor: pointer; transition: all 0.2s; border: none; }
    .btn-primary { background: var(--gradient-brand); color: #fff; }
    .btn-primary:hover { opacity: 0.9; }
    .btn-outline { background: transparent; border: 2px solid var(--glass-border); color: #fff; }
    .btn-outline:hover { border-color: var(--accent-primary); }

    .glass-card { background: rgba(255, 255, 255, 0.03); border: 2px solid var(--glass-border); backdrop-filter: blur(10px); }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 768px) {
      .review-header { flex-direction: column; gap: 1.5rem; align-items: flex-start; }
      .summary-cards { grid-template-columns: 1fr; }
      .filter-tabs { flex-direction: column; }
      .review-actions { flex-direction: column; gap: 1rem; }
      .review-actions .btn { width: 100%; }
    }
  `]
})
export class EnsayoReviewComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  examId = '';
  examTitle = 'Ensayo M1 - Forma 116';
  score = 785;
  totalQuestions = 65;
  activeFilter = 'all';

  // Mock questions with review data
  questions: ReviewQuestion[] = [
    {
      id: 1,
      stem: 'En un triángulo rectángulo, si uno de los catetos mide 3 cm y la hipotenusa mide 5 cm, ¿cuánto mide el otro cateto?',
      options: [
        { id: 'A', text: '2 cm' },
        { id: 'B', text: '4 cm' },
        { id: 'C', text: '6 cm' },
        { id: 'D', text: '8 cm' },
        { id: 'E', text: 'Ninguna de las anteriores' }
      ],
      userAnswer: 'A',
      correctAnswer: 'B',
      isCorrect: false,
      explanation: {
        whyWrong: 'Elegiste 2 cm, pero esto no cumple con el Teorema de Pitágoras. Si el cateto fuera 2, tendríamos 3² + 2² = 9 + 4 = 13 ≠ 25 = 5².',
        correctSolution: 'Aplicamos el Teorema de Pitágoras: a² + b² = c²\n\nDonde c = 5 (hipotenusa) y a = 3 (cateto conocido):\n3² + b² = 5²\n9 + b² = 25\nb² = 16\nb = 4 cm',
        tip: 'Memoriza las ternas pitagóricas más comunes: (3,4,5), (5,12,13), (8,15,17). Te ahorrarán tiempo en la PAES.'
      }
    },
    {
      id: 2,
      stem: 'Si f(x) = 2x + 3, ¿cuál es el valor de f(5)?',
      options: [
        { id: 'A', text: '10' },
        { id: 'B', text: '13' },
        { id: 'C', text: '15' },
        { id: 'D', text: '8' },
        { id: 'E', text: '11' }
      ],
      userAnswer: 'B',
      correctAnswer: 'B',
      isCorrect: true,
      explanation: {
        correctSolution: 'f(5) = 2(5) + 3 = 10 + 3 = 13',
        tip: 'Siempre reemplaza el valor directamente y sigue el orden de operaciones.'
      }
    },
    {
      id: 3,
      stem: '¿Cuál es el resultado de simplificar la expresión (x² - 4) / (x - 2)?',
      options: [
        { id: 'A', text: 'x - 2' },
        { id: 'B', text: 'x + 2' },
        { id: 'C', text: 'x² - 2' },
        { id: 'D', text: '2x' },
        { id: 'E', text: 'No se puede simplificar' }
      ],
      userAnswer: null,
      correctAnswer: 'B',
      isCorrect: false,
      explanation: {
        whyWrong: 'Omitiste esta pregunta. Recuerda que en la PAES no hay descuento por respuestas incorrectas, así que siempre conviene responder.',
        correctSolution: 'Factorizamos el numerador usando diferencia de cuadrados:\n\nx² - 4 = (x + 2)(x - 2)\n\nEntonces:\n(x² - 4) / (x - 2) = (x + 2)(x - 2) / (x - 2) = x + 2',
        tip: 'La diferencia de cuadrados a² - b² = (a+b)(a-b) es una de las fórmulas más útiles. ¡Memorízala!'
      }
    }
  ];

  get correctCount(): number {
    return this.questions.filter(q => q.isCorrect).length;
  }

  get incorrectCount(): number {
    return this.questions.filter(q => !q.isCorrect && q.userAnswer).length;
  }

  get omittedCount(): number {
    return this.questions.filter(q => !q.userAnswer).length;
  }

  get scorePercentage(): number {
    return Math.round((this.correctCount / this.totalQuestions) * 100);
  }

  get filteredQuestions(): ReviewQuestion[] {
    switch (this.activeFilter) {
      case 'correct':
        return this.questions.filter(q => q.isCorrect);
      case 'incorrect':
        return this.questions.filter(q => !q.isCorrect);
      default:
        return this.questions;
    }
  }

  ngOnInit() {
    this.examId = this.route.snapshot.paramMap.get('id') || '';
  }
}
