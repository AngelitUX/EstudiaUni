import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fact-opinion-practice',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="practice-container">
      <div class="practice-header">
        <div class="icon-wrap">⚖️</div>
        <h3>Práctica: Hecho vs. Opinión</h3>
        <p>Clasifica cada afirmación correctamente para avanzar.</p>
      </div>

      <div class="progress-bar">
        <div class="progress-fill" [style.width.%]="(currentIndex() / questions.length) * 100"></div>
      </div>

      <div class="question-card" *ngIf="!isCompleted()">
        <span class="q-badge">Ejercicio {{ currentIndex() + 1 }} de {{ questions.length }}</span>
        <div class="q-statement">
          "{{ currentQuestion().statement }}"
        </div>

        <div class="options-grid">
          <button class="opt-btn" 
                  [class.selected]="selectedAnswer() === 'hecho'"
                  [class.correct]="showFeedback() && currentQuestion().type === 'hecho' && selectedAnswer() === 'hecho'"
                  [class.incorrect]="showFeedback() && currentQuestion().type === 'opinion' && selectedAnswer() === 'hecho'"
                  (click)="selectAnswer('hecho')"
                  [disabled]="showFeedback()">
            <span class="opt-icon">📊</span>
            <strong>Hecho</strong>
            <small>Dato objetivo o comprobable</small>
          </button>
          
          <button class="opt-btn"
                  [class.selected]="selectedAnswer() === 'opinion'"
                  [class.correct]="showFeedback() && currentQuestion().type === 'opinion' && selectedAnswer() === 'opinion'"
                  [class.incorrect]="showFeedback() && currentQuestion().type === 'hecho' && selectedAnswer() === 'opinion'"
                  (click)="selectAnswer('opinion')"
                  [disabled]="showFeedback()">
            <span class="opt-icon">🗣️</span>
            <strong>Opinión</strong>
            <small>Juicio de valor o creencia</small>
          </button>
        </div>

        <div class="feedback-area" *ngIf="showFeedback()">
          <div class="feedback-box" [class.correct]="isCorrect()" [class.incorrect]="!isCorrect()">
            <h4>{{ isCorrect() ? '¡Correcto! 🎉' : 'Incorrecto 😅' }}</h4>
            <p>{{ currentQuestion().feedback }}</p>
          </div>
          <button class="next-btn" (click)="nextQuestion()">
            {{ currentIndex() === questions.length - 1 ? 'Finalizar Práctica' : 'Siguiente Ejercicio →' }}
          </button>
        </div>
      </div>

      <div class="completion-card" *ngIf="isCompleted()">
        <div class="star-icon">🌟</div>
        <h3>¡Práctica Completada!</h3>
        <p>Tu radar para detectar la calidad de la información está calibrado.</p>
        <button class="finish-btn" (click)="onFinish.emit()">Volver a la ruta</button>
      </div>
    </div>
  `,
  styles: [`
    .practice-container {
      max-width: 700px; margin: 0 auto;
      font-family: 'Inter', sans-serif;
    }
    .practice-header {
      text-align: center; margin-bottom: 2rem;
    }
    .icon-wrap {
      font-size: 3rem; background: rgba(245,158,11,0.15);
      width: 80px; height: 80px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 1rem;
    }
    .practice-header h3 { font-size: 1.8rem; color: #1f2937; margin: 0 0 0.5rem; }
    .practice-header p { color: #6b7280; margin: 0; }
    
    .progress-bar { height: 8px; background: #e5e7eb; border-radius: 4px; margin-bottom: 2rem; overflow: hidden; }
    .progress-fill { height: 100%; background: #f59e0b; transition: width 0.3s ease; }
    
    .question-card, .completion-card {
      background: white; border-radius: 20px; padding: 2.5rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.05);
      border: 1px solid #f3f4f6;
    }
    .completion-card { text-align: center; }
    .star-icon { font-size: 4rem; animation: tada 1s ease; margin-bottom: 1rem; }
    
    .q-badge {
      display: inline-block; background: rgba(139,92,246,0.1); color: #7c3aed;
      padding: 0.25rem 0.75rem; border-radius: 12px; font-weight: 700;
      font-size: 0.85rem; margin-bottom: 1rem;
    }
    .q-statement {
      font-size: 1.35rem; color: #111827; font-weight: 600; line-height: 1.4;
      margin-bottom: 2rem; font-style: italic; border-left: 4px solid #f59e0b; padding-left: 1rem;
    }
    
    .options-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem;
    }
    .opt-btn {
      background: white; border: 2px solid #e5e7eb; border-radius: 16px;
      padding: 1.5rem; text-align: center; cursor: pointer;
      transition: all 0.2s ease; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
    }
    .opt-btn:hover:not([disabled]) { border-color: #d1d5db; background: #f9fafb; transform: translateY(-2px); }
    .opt-btn.selected { border-color: #3b82f6; background: rgba(59,130,246,0.05); }
    .opt-btn.correct { border-color: #10b981; background: rgba(16,185,129,0.05); }
    .opt-btn.incorrect { border-color: #ef4444; background: rgba(239,68,68,0.05); opacity: 0.7; }
    
    .opt-icon { font-size: 2rem; }
    .opt-btn strong { font-size: 1.2rem; color: #1f2937; }
    .opt-btn small { color: #6b7280; font-size: 0.85rem; }
    
    .feedback-box {
      padding: 1.25rem; border-radius: 12px; margin-bottom: 1.5rem;
    }
    .feedback-box.correct { background: rgba(16,185,129,0.1); color: #047857; border: 1px solid rgba(16,185,129,0.2); }
    .feedback-box.incorrect { background: rgba(239,68,68,0.1); color: #b91c1c; border: 1px solid rgba(239,68,68,0.2); }
    .feedback-box h4 { margin: 0 0 0.5rem; font-size: 1.1rem; }
    .feedback-box p { margin: 0; font-size: 0.95rem; line-height: 1.4; }
    
    .next-btn, .finish-btn {
      width: 100%; background: #111827; color: white; border: none;
      border-radius: 12px; padding: 1rem; font-weight: 700; font-size: 1.1rem;
      cursor: pointer; transition: background 0.2s;
    }
    .next-btn:hover, .finish-btn:hover { background: #374151; }
    
    @keyframes tada {
      0% { transform: scale(1); }
      10%, 20% { transform: scale(0.9) rotate(-3deg); }
      30%, 50%, 70%, 90% { transform: scale(1.1) rotate(3deg); }
      40%, 60%, 80% { transform: scale(1.1) rotate(-3deg); }
      100% { transform: scale(1) rotate(0); }
    }
    
    @media (max-width: 600px) {
      .options-grid { grid-template-columns: 1fr; }
      .question-card { padding: 1.5rem; }
    }
  `]
})
export class FactOpinionPracticeComponent {
  @Input() capituloId!: string;
  @Output() onFinish = new EventEmitter<void>();

  questions = [
    {
      statement: "El índice de pobreza bajó un 3% en el último año, según datos del Ministerio.",
      type: "hecho",
      feedback: "Es un dato objetivo y comprobable que proviene de una fuente oficial."
    },
    {
      statement: "Es inaceptable que todavía haya personas que no reciclen la basura.",
      type: "opinion",
      feedback: "La palabra 'inaceptable' demuestra una valoración subjetiva del autor."
    },
    {
      statement: "Las ballenas azules pueden medir hasta 30 metros de largo.",
      type: "hecho",
      feedback: "Es un dato empírico y biológicamente comprobable."
    },
    {
      statement: "La película que estrenaron ayer es, sin duda, la mejor obra del director.",
      type: "opinion",
      feedback: "Decir que algo es 'lo mejor' es un juicio de apreciación estética, no un hecho."
    },
    {
      statement: "El agua hierve a los 100 grados Celsius a nivel del mar.",
      type: "hecho",
      feedback: "Es un hecho científico innegable y comprobable."
    },
    {
      statement: "Lamentablemente, el equipo no supo aprovechar las oportunidades.",
      type: "opinion",
      feedback: "El uso del adverbio 'lamentablemente' revela la emoción y perspectiva del autor."
    },
    {
      statement: "La Segunda Guerra Mundial finalizó en el año 1945.",
      type: "hecho",
      feedback: "Es un suceso histórico con fecha comprobable, sin valoración del emisor."
    },
    {
      statement: "Creo que deberíamos invertir más en educación que en infraestructura.",
      type: "opinion",
      feedback: "Es una creencia política/social, indicada claramente por 'Creo que'."
    }
  ];

  currentIndex = signal(0);
  selectedAnswer = signal<'hecho'|'opinion'|null>(null);
  showFeedback = signal(false);
  isCorrect = signal(false);

  currentQuestion() {
    return this.questions[this.currentIndex()];
  }

  isCompleted() {
    return this.currentIndex() >= this.questions.length;
  }

  selectAnswer(type: 'hecho'|'opinion') {
    if (this.showFeedback()) return;
    this.selectedAnswer.set(type);
    const correct = type === this.currentQuestion().type;
    this.isCorrect.set(correct);
    this.showFeedback.set(true);
  }

  nextQuestion() {
    this.currentIndex.update(i => i + 1);
    this.selectedAnswer.set(null);
    this.showFeedback.set(false);
    this.isCorrect.set(false);
  }
}
