import { Component, signal, computed, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface MatchPair {
  id: number;
  left: string;
  right: string;
  hint: string;
}

@Component({
  selector: 'app-match-practice',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="syn-game">
      <!-- HEADER -->
      <div class="game-header">
        <div class="game-badge">🧠 Mini-Juego</div>
        <h2 class="game-title">{{ title() }}</h2>
        <p class="game-desc">{{ description() }}</p>
      </div>

      <!-- GAME AREA -->
      <div class="match-area" *ngIf="!gameFinished()">
        <!-- LEFT COLUMN -->
        <div class="match-col">
          <button *ngFor="let pair of leftItems()" class="match-btn word-btn"
            [class.selected]="selectedLeft() === pair.id"
            [class.matched]="isMatched(pair.id)"
            [disabled]="isMatched(pair.id)"
            (click)="selectLeft(pair.id)">
            {{ pair.left }}
          </button>
        </div>

        <!-- CENTER arrows -->
        <div class="match-arrows">
          <div *ngFor="let pair of currentPairs()" class="arrow-slot"
            [class.connected]="isMatched(pair.id)">
            <span *ngIf="isMatched(pair.id)" class="connected-line">✓</span>
            <span *ngIf="!isMatched(pair.id)" class="pending-dot">·</span>
          </div>
        </div>

        <!-- RIGHT COLUMN (shuffled) -->
        <div class="match-col">
          <button *ngFor="let rightItem of getRightItems()" class="match-btn syn-btn"
            [class.selected]="selectedRight() === rightItem.id"
            [class.matched]="isMatched(rightItem.id)"
            [class.wrong-flash]="wrongFlash() === rightItem.id"
            [disabled]="isMatched(rightItem.id)"
            (click)="selectRight(rightItem.id)">
            {{ rightItem.right }}
          </button>
        </div>
      </div>

      <!-- FEEDBACK -->
      <div class="feedback-bar" *ngIf="lastFeedback() && !gameFinished()" [class.correct]="lastCorrect()" [class.wrong]="!lastCorrect()">
        <span class="fb-icon">{{ lastCorrect() ? '✅' : '❌' }}</span>
        <span class="fb-text">{{ lastFeedback() }}</span>
      </div>

      <!-- GAME FINISHED -->
      <div class="game-finished" *ngIf="gameFinished()">
        <div class="gf-icon">🏆</div>
        <h3>¡Práctica completada!</h3>
        <p>Has conectado todos los conceptos correctamente.</p>
        <div class="gf-actions">
          <button class="btn-replay" (click)="resetGame()">🔄 Volver a hacerlo</button>
          <button class="btn-finish" (click)="onComplete.emit()">Siguiente Lección →</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .syn-game { max-width: 800px; margin: 0 auto; }

    /* HEADER */
    .game-header { text-align: center; margin-bottom: 1.5rem; }
    .game-badge { display: inline-block; background: linear-gradient(135deg, #855cd6, #6b46b8); color: #fff; font-family: var(--font-heading); font-size: 0.75rem; font-weight: 800; padding: 0.35rem 0.85rem; border-radius: 99px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
    .game-title { font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin: 0 0 0.4rem; }
    .game-desc { font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5; margin: 0; }

    /* MATCH AREA */
    .match-area { display: flex; align-items: stretch; justify-content: center; gap: 1rem; margin-bottom: 1.5rem; }
    .match-col { display: flex; flex-direction: column; gap: 0.8rem; flex: 1; }
    .match-arrows { display: flex; flex-direction: column; justify-content: space-around; width: 40px; }
    .arrow-slot { display: flex; align-items: center; justify-content: center; height: 100%; color: #ccc; font-weight: bold; transition: color 0.3s; }
    .arrow-slot.connected { color: #58cc02; }
    
    .match-btn { padding: 0.85rem 1rem; border-radius: 12px; border: 2px solid rgba(0,0,0,0.1); background: #fff; font-family: var(--font-body); font-size: 0.95rem; font-weight: 600; color: var(--text-primary); cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 0 rgba(0,0,0,0.05); outline: none; text-align: center; display: flex; align-items: center; justify-content: center; min-height: 60px; line-height: 1.3;}
    .match-btn:hover:not(:disabled) { transform: translateY(2px); box-shadow: 0 2px 0 rgba(0,0,0,0.05); background: #fcfcfc; }
    
    .word-btn.selected { border-color: var(--accent-primary); background: rgba(133,92,214,0.05); box-shadow: 0 4px 0 var(--accent-primary); color: var(--accent-primary); }
    .syn-btn.selected { border-color: #58cc02; background: rgba(88,204,2,0.05); box-shadow: 0 4px 0 #4caf00; color: #4caf00; }
    
    .match-btn.wrong-flash { animation: shakeError 0.4s ease-in-out; border-color: #ff4b4b; background: rgba(255,75,75,0.05); box-shadow: 0 4px 0 #e63939; color: #ff4b4b; }
    
    .match-btn.matched { border-color: rgba(0,0,0,0.05); background: rgba(0,0,0,0.02); color: #aaa; box-shadow: none; cursor: default; transform: none; opacity: 0.6; }

    /* FEEDBACK */
    .feedback-bar { display: flex; align-items: center; gap: 0.75rem; padding: 1rem; border-radius: 12px; margin-bottom: 1.5rem; font-weight: 600; font-size: 0.95rem; animation: fadeSlide 0.3s ease-out; }
    .feedback-bar.correct { background: rgba(88,204,2,0.1); border: 1px solid rgba(88,204,2,0.3); color: #4caf00; }
    .feedback-bar.wrong { background: rgba(255,75,75,0.1); border: 1px solid rgba(255,75,75,0.3); color: #e63939; }
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

    @keyframes shakeError { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-5px); } 40% { transform: translateX(5px); } 60% { transform: translateX(-5px); } 80% { transform: translateX(5px); } }
    @keyframes fadeSlide { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes ctaBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }

    @media (max-width: 640px) { .match-area { flex-direction: column; gap: 0.5rem; } .match-arrows { display: none; } }
  `]
})
export class MatchPracticeComponent implements OnInit {
  @Input() data!: { title: string, description: string, pairs: MatchPair[] };
  @Output() onComplete = new EventEmitter<void>();

  title = signal('Conecta los Pares');
  description = signal('Haz clic en la izquierda y luego en la derecha para conectarlos.');
  
  currentPairs = signal<MatchPair[]>([]);
  rightItemsShuffled = signal<MatchPair[]>([]);

  selectedLeft = signal<number | null>(null);
  selectedRight = signal<number | null>(null);
  wrongFlash = signal<number | null>(null);

  matchedIds = signal<Set<number>>(new Set());
  
  lastFeedback = signal<string>('');
  lastCorrect = signal<boolean>(false);

  gameFinished = computed(() => this.matchedIds().size === this.currentPairs().length && this.currentPairs().length > 0);

  leftItems = computed(() => this.currentPairs());

  ngOnInit() {
    if (this.data) {
      if (this.data.title) this.title.set(this.data.title);
      if (this.data.description) this.description.set(this.data.description);
      if (this.data.pairs) {
        this.currentPairs.set(this.data.pairs);
        this.rightItemsShuffled.set([...this.data.pairs].sort(() => Math.random() - 0.5));
      }
    }
  }

  getRightItems() {
    return this.rightItemsShuffled();
  }

  isMatched(id: number): boolean {
    return this.matchedIds().has(id);
  }

  selectLeft(id: number) {
    if (this.isMatched(id)) return;
    this.selectedLeft.set(this.selectedLeft() === id ? null : id);
    this.checkMatch();
  }

  selectRight(id: number) {
    if (this.isMatched(id)) return;
    this.selectedRight.set(this.selectedRight() === id ? null : id);
    this.checkMatch();
  }

  checkMatch() {
    const l = this.selectedLeft();
    const r = this.selectedRight();
    
    if (l !== null && r !== null) {
      if (l === r) {
        const pair = this.currentPairs().find(p => p.id === l);
        this.lastCorrect.set(true);
        this.lastFeedback.set('¡Correcto! ' + (pair?.hint || ''));
        
        const newSet = new Set(this.matchedIds());
        newSet.add(l);
        this.matchedIds.set(newSet);
      } else {
        this.lastCorrect.set(false);
        this.lastFeedback.set('Esos no coinciden. Intenta de nuevo.');
        this.wrongFlash.set(r);
        setTimeout(() => this.wrongFlash.set(null), 400);
      }
      
      this.selectedLeft.set(null);
      this.selectedRight.set(null);
    }
  }

  resetGame() {
    this.matchedIds.set(new Set());
    this.selectedLeft.set(null);
    this.selectedRight.set(null);
    this.lastFeedback.set('');
    this.rightItemsShuffled.set([...this.currentPairs()].sort(() => Math.random() - 0.5));
  }
}
