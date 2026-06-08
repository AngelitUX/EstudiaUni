import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tone-intention-practice',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="practice-container">
      <div class="practice-header">
        <div class="icon-wrap">🎭</div>
        <h3>Práctica: Tono e Intención</h3>
        <p>Lee la cita y selecciona el tono y la intención correcta.</p>
      </div>

      <div class="progress-bar">
        <div class="progress-fill" [style.width.%]="(currentIndex() / questions.length) * 100"></div>
      </div>

      <div class="question-card" *ngIf="!isCompleted()">
        <span class="q-badge">Cita {{ currentIndex() + 1 }} de {{ questions.length }}</span>
        <div class="q-statement">
          "{{ currentQuestion().quote }}"
        </div>

        <!-- Fase 1: Elegir el Tono -->
        <div class="phase-section" *ngIf="phase() === 'tono' || phase() === 'feedback'">
          <h4>1. ¿Qué tono predomina en el texto?</h4>
          <div class="options-grid">
            <button *ngFor="let opt of currentQuestion().toneOptions"
                    class="opt-btn"
                    [class.selected]="selectedTone() === opt.id"
                    [class.correct]="showFeedback() && opt.id === currentQuestion().correctTone && selectedTone() === opt.id"
                    [class.incorrect]="showFeedback() && opt.id !== currentQuestion().correctTone && selectedTone() === opt.id"
                    [disabled]="showFeedback()"
                    (click)="selectTone(opt.id)">
              <span class="opt-emoji">{{ opt.emoji }}</span>
              <span>{{ opt.label }}</span>
            </button>
          </div>
        </div>

        <!-- Fase 2: Elegir la Intención (Aparece tras acertar el tono o directamente) -->
        <div class="phase-section" *ngIf="phase() === 'intencion' || phase() === 'feedback'">
          <h4>2. ¿Cuál es la intención del emisor?</h4>
          <div class="options-grid">
            <button *ngFor="let opt of currentQuestion().intentionOptions"
                    class="opt-btn"
                    [class.selected]="selectedIntention() === opt.id"
                    [class.correct]="showFeedback() && opt.id === currentQuestion().correctIntention && selectedIntention() === opt.id"
                    [class.incorrect]="showFeedback() && opt.id !== currentQuestion().correctIntention && selectedIntention() === opt.id"
                    [disabled]="showFeedback()"
                    (click)="selectIntention(opt.id)">
              <span class="opt-emoji">🎯</span>
              <span>{{ opt.label }}</span>
            </button>
          </div>
        </div>

        <div class="feedback-area" *ngIf="showFeedback()">
          <div class="feedback-box" [class.correct]="isCorrect()" [class.incorrect]="!isCorrect()">
            <h4>{{ isCorrect() ? '¡Análisis Perfecto! 🎉' : 'Casi... revisemos el texto 😅' }}</h4>
            <p>{{ currentQuestion().feedback }}</p>
          </div>
          <button class="next-btn" (click)="nextQuestion()">
            {{ currentIndex() === questions.length - 1 ? 'Finalizar Práctica' : 'Siguiente Cita →' }}
          </button>
        </div>
      </div>

      <div class="completion-card" *ngIf="isCompleted()">
        <div class="star-icon">🏆</div>
        <h3>¡Radar Crítico Activado!</h3>
        <p>Has demostrado gran habilidad para leer las verdaderas intenciones de un autor.</p>
        <button class="finish-btn" (click)="onFinish.emit()">Volver a la ruta</button>
      </div>
    </div>
  `,
  styles: [`
    .practice-container { max-width: 700px; margin: 0 auto; font-family: 'Inter', sans-serif; }
    .practice-header { text-align: center; margin-bottom: 2rem; }
    .icon-wrap { font-size: 3rem; background: rgba(16,185,129,0.15); width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; }
    .practice-header h3 { font-size: 1.8rem; color: #1f2937; margin: 0 0 0.5rem; }
    .practice-header p { color: #6b7280; margin: 0; }
    
    .progress-bar { height: 8px; background: #e5e7eb; border-radius: 4px; margin-bottom: 2rem; overflow: hidden; }
    .progress-fill { height: 100%; background: #10b981; transition: width 0.3s ease; }
    
    .question-card, .completion-card { background: white; border-radius: 20px; padding: 2.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #f3f4f6; }
    .completion-card { text-align: center; }
    .star-icon { font-size: 4rem; animation: tada 1s ease; margin-bottom: 1rem; }
    
    .q-badge { display: inline-block; background: rgba(16,185,129,0.1); color: #047857; padding: 0.25rem 0.75rem; border-radius: 12px; font-weight: 700; font-size: 0.85rem; margin-bottom: 1rem; }
    .q-statement { font-size: 1.35rem; color: #111827; font-weight: 600; line-height: 1.4; margin-bottom: 2rem; font-style: italic; border-left: 4px solid #10b981; padding-left: 1rem; }
    
    .phase-section h4 { color: #374151; margin: 0 0 1rem; font-size: 1.1rem; }
    .phase-section { margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid #e5e7eb; }
    .phase-section:last-of-type { border-bottom: none; margin-bottom: 1.5rem; }
    
    .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
    .opt-btn { background: white; border: 2px solid #e5e7eb; border-radius: 12px; padding: 1rem; text-align: left; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; gap: 0.75rem; font-size: 1rem; font-weight: 600; color: #4b5563; }
    .opt-btn:hover:not([disabled]) { border-color: #d1d5db; background: #f9fafb; transform: translateY(-2px); }
    .opt-btn.selected { border-color: #3b82f6; background: rgba(59,130,246,0.05); color: #1d4ed8; }
    .opt-btn.correct { border-color: #10b981; background: rgba(16,185,129,0.05); color: #047857; }
    .opt-btn.incorrect { border-color: #ef4444; background: rgba(239,68,68,0.05); color: #b91c1c; opacity: 0.7; }
    .opt-emoji { font-size: 1.25rem; }
    
    .feedback-box { padding: 1.25rem; border-radius: 12px; margin-bottom: 1.5rem; }
    .feedback-box.correct { background: rgba(16,185,129,0.1); color: #047857; border: 1px solid rgba(16,185,129,0.2); }
    .feedback-box.incorrect { background: rgba(239,68,68,0.1); color: #b91c1c; border: 1px solid rgba(239,68,68,0.2); }
    .feedback-box h4 { margin: 0 0 0.5rem; font-size: 1.1rem; }
    .feedback-box p { margin: 0; font-size: 0.95rem; line-height: 1.4; }
    
    .next-btn, .finish-btn { width: 100%; background: #111827; color: white; border: none; border-radius: 12px; padding: 1rem; font-weight: 700; font-size: 1.1rem; cursor: pointer; transition: background 0.2s; }
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
export class ToneIntentionPracticeComponent {
  @Input() capituloId!: string;
  @Output() onFinish = new EventEmitter<void>();

  questions = [
    {
      quote: "¡Oh, qué maravilla de decisión! Arruinar el único parque verde del barrio para poner un estacionamiento de concreto. Simplemente brillante.",
      toneOptions: [
        { id: 'ironico', label: 'Irónico / Sarcástico', emoji: '😏' },
        { id: 'optimista', label: 'Optimista / Alegre', emoji: '😊' },
        { id: 'objetivo', label: 'Objetivo / Neutro', emoji: '😐' },
        { id: 'nostalgico', label: 'Nostálgico / Triste', emoji: '🥺' }
      ],
      correctTone: 'ironico',
      intentionOptions: [
        { id: 'informar', label: 'Informar sobre la construcción' },
        { id: 'criticar', label: 'Criticar la decisión de las autoridades' },
        { id: 'persuadir', label: 'Persuadir para construir más parques' },
        { id: 'describir', label: 'Describir el nuevo estacionamiento' }
      ],
      correctIntention: 'criticar',
      feedback: "El autor dice 'qué maravilla' pero quiere decir lo contrario (ironía). Su intención final es quejarse y criticar la destrucción del parque."
    },
    {
      quote: "El informe señala que el 45% de los encuestados prefiere trabajar desde casa, mientras que el 30% opta por un modelo híbrido.",
      toneOptions: [
        { id: 'critico', label: 'Crítico / Severo', emoji: '😠' },
        { id: 'objetivo', label: 'Objetivo / Neutro', emoji: '😐' },
        { id: 'persuasivo', label: 'Persuasivo / Convincente', emoji: '🗣️' },
        { id: 'dubitativo', label: 'Dubitativo / Inseguro', emoji: '🤔' }
      ],
      correctTone: 'objetivo',
      intentionOptions: [
        { id: 'informar', label: 'Informar sobre las preferencias laborales' },
        { id: 'cuestionar', label: 'Cuestionar la validez de la encuesta' },
        { id: 'convencer', label: 'Convencer de trabajar desde casa' },
        { id: 'entretener', label: 'Entretener con datos curiosos' }
      ],
      correctIntention: 'informar',
      feedback: "El texto solo entrega datos concretos (45%, 30%) sin juicios de valor. Su tono es neutro y su propósito es puramente informativo."
    },
    {
      quote: "Si no actuamos ahora para reducir nuestras emisiones de carbono, las próximas generaciones heredarán un planeta inhabitable. El tiempo se agota.",
      toneOptions: [
        { id: 'ironico', label: 'Irónico / Sarcástico', emoji: '😏' },
        { id: 'pesimista', label: 'Pesimista / Alarmista', emoji: '😨' },
        { id: 'esperanzador', label: 'Esperanzador', emoji: '✨' },
        { id: 'objetivo', label: 'Objetivo / Neutro', emoji: '😐' }
      ],
      correctTone: 'pesimista',
      intentionOptions: [
        { id: 'informar', label: 'Informar sobre las emisiones de carbono' },
        { id: 'describir', label: 'Describir el futuro del planeta' },
        { id: 'persuadir', label: 'Persuadir al lector para actuar' },
        { id: 'criticar', label: 'Criticar a las generaciones pasadas' }
      ],
      correctIntention: 'persuadir',
      feedback: "El autor usa un tono alarmista ('planeta inhabitable', 'tiempo se agota') con la intención directa de motivar o persuadir al lector a tomar acción inmediata."
    },
    {
      quote: "No sé qué pasará mañana, pero hoy decido enfocarme en lo positivo y creer que, paso a paso, las cosas mejorarán.",
      toneOptions: [
        { id: 'pesimista', label: 'Pesimista', emoji: '😞' },
        { id: 'optimista', label: 'Optimista / Esperanzador', emoji: '🌱' },
        { id: 'critico', label: 'Crítico', emoji: '😠' },
        { id: 'ironico', label: 'Irónico', emoji: '😏' }
      ],
      correctTone: 'optimista',
      intentionOptions: [
        { id: 'informar', label: 'Informar sobre sus planes futuros' },
        { id: 'expresar', label: 'Expresar una postura ante la vida' },
        { id: 'persuadir', label: 'Persuadir a otros a ser optimistas' },
        { id: 'cuestionar', label: 'Cuestionar la incertidumbre' }
      ],
      correctIntention: 'expresar',
      feedback: "El tono es de esperanza ('las cosas mejorarán'). Su intención principal es expresar su sentimiento o filosofía personal, más que convencer al resto de hacerlo."
    }
  ];

  currentIndex = signal(0);
  phase = signal<'tono'|'intencion'|'feedback'>('tono');
  selectedTone = signal<string|null>(null);
  selectedIntention = signal<string|null>(null);
  
  showFeedback = signal(false);
  isCorrect = signal(false);

  currentQuestion() {
    return this.questions[this.currentIndex()];
  }

  isCompleted() {
    return this.currentIndex() >= this.questions.length;
  }

  selectTone(id: string) {
    if (this.phase() !== 'tono') return;
    this.selectedTone.set(id);
    // Move to next phase
    this.phase.set('intencion');
  }

  selectIntention(id: string) {
    if (this.phase() !== 'intencion') return;
    this.selectedIntention.set(id);
    
    // Evaluate both
    const q = this.currentQuestion();
    const correct = this.selectedTone() === q.correctTone && this.selectedIntention() === q.correctIntention;
    this.isCorrect.set(correct);
    this.showFeedback.set(true);
    this.phase.set('feedback');
  }

  nextQuestion() {
    this.currentIndex.update(i => i + 1);
    this.selectedTone.set(null);
    this.selectedIntention.set(null);
    this.phase.set('tono');
    this.showFeedback.set(false);
    this.isCorrect.set(false);
  }
}
