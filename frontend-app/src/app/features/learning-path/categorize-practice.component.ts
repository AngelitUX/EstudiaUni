import { Component, signal, computed, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CategorizeItem {
  id: number;
  text: string;
  category: string; // matches categoryA.id or categoryB.id
  hint: string;
}

@Component({
  selector: 'app-categorize-practice',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cat-game">
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
        <div class="score-text">Tarjeta {{ currentIndex() + 1 }} de {{ items().length }}</div>

        <!-- CURRENT CARD -->
        <div class="card-container" *ngIf="currentItem()">
          <div class="main-card" [class.shake]="shakeCard()">
            <p>{{ currentItem()?.text }}</p>
          </div>
        </div>

        <!-- ACTION BUTTONS -->
        <div class="action-buttons" *ngIf="currentItem()">
          <button *ngFor="let cat of categories(); let i = index" 
                  class="btn-category" [ngClass]="'btn-cat-' + i" 
                  (click)="categorize(cat.id)">
            {{ cat.label }}
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
        <h3>¡Clasificación completada!</h3>
        <p>Lograste clasificar correctamente las {{ items().length }} tarjetas.</p>
        <div class="gf-actions">
          <button class="btn-replay" (click)="resetGame()">🔄 Volver a hacerlo</button>
          <button class="btn-finish" (click)="onComplete.emit()">Siguiente Lección →</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .cat-game { max-width: 600px; margin: 0 auto; }

    /* HEADER */
    .game-header { text-align: center; margin-bottom: 1.5rem; }
    .game-badge { display: inline-block; background: linear-gradient(135deg, #855cd6, #6b46b8); color: #fff; font-family: var(--font-heading); font-size: 0.75rem; font-weight: 800; padding: 0.35rem 0.85rem; border-radius: 99px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
    .game-title { font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin: 0 0 0.4rem; }
    .game-desc { font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5; margin: 0; }

    /* PROGRESS */
    .progress-bar { height: 8px; background: rgba(0,0,0,0.05); border-radius: 4px; overflow: hidden; margin-bottom: 0.5rem; }
    .progress-fill { height: 100%; background: var(--accent-primary); transition: width 0.3s ease; }
    .score-text { text-align: center; font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 1.5rem; }

    /* CARD */
    .card-container { display: flex; justify-content: center; margin-bottom: 2rem; perspective: 1000px; }
    .main-card { background: #fff; border: 2px solid rgba(0,0,0,0.05); border-radius: 16px; padding: 2rem 1.5rem; width: 100%; max-width: 400px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.08); font-size: 1.1rem; font-weight: 600; color: var(--text-primary); transition: transform 0.3s; }
    .main-card.shake { animation: shakeError 0.4s ease-in-out; border-color: #ff4b4b; background: rgba(255,75,75,0.05); }

    /* BUTTONS */
    .action-buttons { display: flex; gap: 1rem; justify-content: center; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .btn-category { flex: 1; min-width: 120px; max-width: 200px; padding: 1rem; border-radius: 12px; font-family: var(--font-heading); font-size: 1.1rem; font-weight: 800; cursor: pointer; border: none; color: #fff; transition: all 0.2s; }
    .btn-cat-0 { background: #ff9600; box-shadow: 0 5px 0 #cc7800; }
    .btn-cat-0:hover { transform: translateY(3px); box-shadow: 0 2px 0 #cc7800; }
    .btn-cat-1 { background: #58cc02; box-shadow: 0 5px 0 #4caf00; }
    .btn-cat-1:hover { transform: translateY(3px); box-shadow: 0 2px 0 #4caf00; }
    .btn-cat-2 { background: #1cb0f6; box-shadow: 0 5px 0 #1899d6; }
    .btn-cat-2:hover { transform: translateY(3px); box-shadow: 0 2px 0 #1899d6; }
    .btn-cat-3 { background: #ce82ff; box-shadow: 0 5px 0 #a568cc; }
    .btn-cat-3:hover { transform: translateY(3px); box-shadow: 0 2px 0 #a568cc; }

    /* FEEDBACK */
    .feedback-toast { text-align: center; padding: 1rem; border-radius: 12px; font-weight: 600; font-size: 0.95rem; animation: fadeSlide 0.3s ease-out; }
    .feedback-toast.correct { background: rgba(88,204,2,0.1); color: #4caf00; }
    .feedback-toast.wrong { background: rgba(255,75,75,0.1); color: #e63939; }

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

    @keyframes shakeError { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-10px); } 40% { transform: translateX(10px); } 60% { transform: translateX(-10px); } 80% { transform: translateX(10px); } }
    @keyframes fadeSlide { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes ctaBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }

    @media (max-width: 640px) { .action-buttons { flex-direction: column; } .btn-category { max-width: 100%; } }
  `]
})
export class CategorizePracticeComponent implements OnInit {
  @Input() data!: { title: string, description: string, categories: {id: string, label: string}[], items: CategorizeItem[] };
  @Output() onComplete = new EventEmitter<void>();

  title = signal('Clasificador');
  description = signal('Clasifica las siguientes tarjetas en la categoría correcta.');
  
  categories = signal<{id: string, label: string}[]>([]);
  
  items = signal<CategorizeItem[]>([]);
  currentIndex = signal(0);
  
  shakeCard = signal(false);
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
      if (this.data.categories && this.data.categories.length > 0) {
        this.categories.set(this.data.categories.map((cat: any) => 
          typeof cat === 'string' ? { id: cat, label: cat } : cat
        ));
      } else {
        this.categories.set([{id: 'a', label: 'A'}, {id: 'b', label: 'B'}]);
      }
      if (this.data.items) {
        // shuffle items
        this.items.set([...this.data.items].sort(() => Math.random() - 0.5));
      }
    }
  }

  categorize(categoryId: string) {
    const item = this.currentItem();
    if (!item) return;

    if (item.category === categoryId) {
      // Correct
      this.lastCorrect.set(true);
      this.lastFeedback.set('¡Correcto! ' + (item.hint || ''));
      setTimeout(() => {
        this.currentIndex.update(i => i + 1);
        this.lastFeedback.set('');
      }, 1000);
    } else {
      // Wrong
      this.lastCorrect.set(false);
      this.lastFeedback.set('Incorrecto. ' + (item.hint || 'Intenta de nuevo.'));
      this.shakeCard.set(true);
      setTimeout(() => this.shakeCard.set(false), 400);
    }
  }

  resetGame() {
    this.currentIndex.set(0);
    this.lastFeedback.set('');
    this.items.set([...this.items()].sort(() => Math.random() - 0.5));
  }
}
