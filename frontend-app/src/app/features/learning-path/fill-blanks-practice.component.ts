import { Component, signal, computed, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FillBlanksItem {
  id: number;
  textBefore: string;
  textAfter: string;
  options: string[];
  correctOption: string;
  hint: string;
}

@Component({
  selector: 'app-fill-blanks-practice',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fb-game">
      <!-- HEADER -->
      <div class="game-header">
        <div class="game-badge">🧠 Mini-Juego</div>
        <h2 class="game-title">{{ title() }}</h2>
        <p class="game-desc">{{ description() }}</p>
      </div>

      <div class="game-area" *ngIf="!gameFinished()">
        
        <!-- SCORE & PROGRESS -->
        <div class="progress-bar">
          <div class="progress-fill" [style.width.%]="(currentIndex() / items().length) * 100"></div>
        </div>
        <div class="score-text">Oración {{ currentIndex() + 1 }} de {{ items().length }}</div>

        <!-- SENTENCE CARD -->
        <div class="card-container" *ngIf="currentItem()">
          <div class="main-card" [class.shake]="shakeCard()">
            <span class="text-part">{{ currentItem()?.textBefore }}</span>
            
            <span class="blank-spot" [class.filled]="filledAnswer()" [class.wrong]="showError()">
              <ng-container *ngIf="filledAnswer()">{{ filledAnswer() }}</ng-container>
              <ng-container *ngIf="!filledAnswer()">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</ng-container>
            </span>
            
            <span class="text-part">{{ currentItem()?.textAfter }}</span>
          </div>
        </div>

        <!-- OPTIONS -->
        <div class="options-container" *ngIf="currentItem()">
          <button *ngFor="let opt of shuffledOptions()" 
                  class="btn-option" 
                  [disabled]="isChecking()"
                  (click)="selectOption(opt)">
            {{ opt }}
          </button>
        </div>

        <!-- FEEDBACK -->
        <div class="feedback-toast" *ngIf="lastFeedback()" [class.correct]="lastCorrect()" [class.wrong]="!lastCorrect()">
          <span class="fb-icon">{{ lastCorrect() ? '✅' : '❌' }}</span>
          <span class="fb-text">{{ lastFeedback() }}</span>
        </div>
        
      </div>

      <!-- GAME FINISHED -->
      <div class="game-finished" *ngIf="gameFinished()">
        <div class="gf-icon">🏆</div>
        <h3>¡Completado!</h3>
        <p>Has completado correctamente todas las oraciones.</p>
        <div class="gf-actions">
          <button class="btn-replay" (click)="resetGame()">🔄 Volver a hacerlo</button>
          <button class="btn-finish" (click)="onComplete.emit()">Siguiente Lección →</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .fb-game { max-width: 700px; margin: 0 auto; }

    /* HEADER */
    .game-header { text-align: center; margin-bottom: 1.5rem; }
    .game-badge { display: inline-block; background: linear-gradient(135deg, #855cd6, #6b46b8); color: #fff; font-family: var(--font-heading); font-size: 0.75rem; font-weight: 800; padding: 0.35rem 0.85rem; border-radius: 99px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
    .game-title { font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin: 0 0 0.4rem; }
    .game-desc { font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5; margin: 0; }

    /* PROGRESS */
    .progress-bar { height: 8px; background: rgba(0,0,0,0.05); border-radius: 4px; overflow: hidden; margin-bottom: 0.5rem; }
    .progress-fill { height: 100%; background: var(--accent-primary); transition: width 0.3s ease; }
    .score-text { text-align: center; font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 1.5rem; }

    /* SENTENCE CARD */
    .card-container { display: flex; justify-content: center; margin-bottom: 2rem; }
    .main-card { background: #fff; border: 2px solid rgba(0,0,0,0.05); border-radius: 16px; padding: 2rem; width: 100%; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.05); font-size: 1.25rem; font-weight: 500; color: var(--text-primary); transition: transform 0.3s; line-height: 1.6; }
    .main-card.shake { animation: shakeError 0.4s ease-in-out; border-color: #ff4b4b; background: rgba(255,75,75,0.02); }
    
    .blank-spot { display: inline-block; margin: 0; padding: 0.2rem 1rem; border-bottom: 3px solid #ccc; color: #ccc; font-weight: 700; font-family: var(--font-heading); min-width: 100px; text-align: center; transition: all 0.3s; min-height: 1.5rem; }
    .blank-spot.filled { color: #58cc02; border-bottom-color: #58cc02; background: rgba(88,204,2,0.1); border-radius: 8px 8px 0 0; }
    .blank-spot.wrong { color: #ff4b4b; border-bottom-color: #ff4b4b; background: rgba(255,75,75,0.1); }

    /* OPTIONS */
    .options-container { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; margin-bottom: 2rem; }
    .btn-option { padding: 1rem 1.5rem; border-radius: 12px; font-family: var(--font-heading); font-size: 1.1rem; font-weight: 700; cursor: pointer; border: 2px solid rgba(0,0,0,0.05); background: #fff; color: var(--text-primary); transition: all 0.2s; box-shadow: 0 4px 0 rgba(0,0,0,0.05); }
    .btn-option:hover:not(:disabled) { transform: translateY(2px); box-shadow: 0 2px 0 rgba(0,0,0,0.05); border-color: var(--accent-primary); color: var(--accent-primary); }
    .btn-option:disabled { opacity: 0.6; cursor: not-allowed; }

    /* FEEDBACK */
    .feedback-toast { display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem; border-radius: 12px; font-weight: 600; font-size: 1rem; animation: fadeSlide 0.3s ease-out; margin-bottom: 1rem; }
    .feedback-toast.correct { background: rgba(88,204,2,0.1); color: #4caf00; border: 1px solid rgba(88,204,2,0.3); }
    .feedback-toast.wrong { background: rgba(255,75,75,0.1); color: #e63939; border: 1px solid rgba(255,75,75,0.3); }
    .fb-icon { font-size: 1.2rem; }

    /* GAME FINISHED */
    .game-finished { text-align: center; padding: 3rem 1.5rem; background: #fff; border-radius: 16px; border: 2px solid rgba(0,0,0,0.05); animation: fadeSlide 0.5s ease-out; }
    .gf-icon { font-size: 4rem; margin-bottom: 1rem; animation: ctaBounce 2s infinite; }
    .game-finished h3 { font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; color: var(--text-primary); margin: 0 0 0.5rem; }
    .game-finished p { font-size: 1.05rem; color: var(--text-secondary); margin-bottom: 2rem; }
    .gf-actions { display: flex; gap: 1rem; justify-content: center; }
    .btn-replay, .btn-finish { padding: 0.85rem 1.5rem; border-radius: 99px; font-family: var(--font-heading); font-size: 1rem; font-weight: 800; cursor: pointer; border: none; transition: all 0.2s; }
    .btn-replay { background: rgba(0,0,0,0.05); color: var(--text-primary); box-shadow: 0 4px 0 rgba(0,0,0,0.1); }
    .btn-replay:hover { transform: translateY(2px); box-shadow: 0 2px 0 rgba(0,0,0,0.1); }
    .btn-finish { background: var(--accent-primary); color: #fff; box-shadow: 0 4px 0 var(--accent-dark); }
    .btn-finish:hover { transform: translateY(2px); box-shadow: 0 2px 0 var(--accent-dark); }

    @keyframes shakeError { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-8px); } 40% { transform: translateX(8px); } 60% { transform: translateX(-8px); } 80% { transform: translateX(8px); } }
    @keyframes fadeSlide { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes ctaBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
  `]
})
export class FillBlanksPracticeComponent implements OnInit {
  @Input() data!: { title: string, description: string, items: FillBlanksItem[] };
  @Output() onComplete = new EventEmitter<void>();

  title = signal('Completar Oraciones');
  description = signal('Selecciona la palabra o frase correcta para llenar el espacio.');
  
  items = signal<FillBlanksItem[]>([]);
  currentIndex = signal(0);
  
  shuffledOptions = signal<string[]>([]);
  filledAnswer = signal<string | null>(null);

  isChecking = signal(false);
  shakeCard = signal(false);
  showError = signal(false);
  
  lastFeedback = signal('');
  lastCorrect = signal(false);

  currentItem = computed(() => {
    if (this.currentIndex() < this.items().length) {
      return this.items()[this.currentIndex()];
    }
    return null;
  });

  gameFinished = computed(() => this.currentIndex() >= this.items().length && this.items().length > 0);

  ngOnInit() {
    if (this.data) {
      if (this.data.title) this.title.set(this.data.title);
      if (this.data.description) this.description.set(this.data.description);
      if (this.data.items) {
        this.items.set(this.data.items);
        this.setupCurrentItem();
      }
    }
  }

  setupCurrentItem() {
    const item = this.currentItem();
    if (item) {
      this.shuffledOptions.set([...item.options].sort(() => Math.random() - 0.5));
      this.filledAnswer.set(null);
      this.isChecking.set(false);
      this.lastFeedback.set('');
      this.showError.set(false);
    }
  }

  selectOption(opt: string) {
    if (this.isChecking()) return;
    
    this.filledAnswer.set(opt);
    this.isChecking.set(true);

    const item = this.currentItem();
    if (!item) return;

    if (opt === item.correctOption) {
      this.lastCorrect.set(true);
      this.lastFeedback.set('¡Correcto! ' + (item.hint || ''));
      
      setTimeout(() => {
        this.currentIndex.update(i => i + 1);
        this.setupCurrentItem();
      }, 1500);
    } else {
      this.lastCorrect.set(false);
      this.lastFeedback.set('Incorrecto. ' + (item.hint || 'Ese conector no es el adecuado.'));
      this.shakeCard.set(true);
      this.showError.set(true);
      
      setTimeout(() => {
        this.shakeCard.set(false);
        this.showError.set(false);
        this.filledAnswer.set(null);
        this.isChecking.set(false);
      }, 1500);
    }
  }

  resetGame() {
    this.currentIndex.set(0);
    this.setupCurrentItem();
  }
}
