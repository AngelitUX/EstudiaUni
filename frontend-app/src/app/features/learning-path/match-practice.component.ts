import { Component, signal, computed, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface MatchPair {
  id: number;
  left: string;
  right: string;
  hint?: string;
}

@Component({
  selector: 'app-match-practice',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="syn-game">
      <!-- HEADER -->
      <div class="game-header">
        <div class="game-badge">🎮 Mini-Juego</div>
        <h2 class="game-title">{{ title() }}</h2>
        <p class="game-desc">{{ description() }}</p>
      </div>

      <!-- ROUND INDICATOR -->
      <div class="round-bar" *ngIf="!gameFinished() && totalRounds() > 1">
        <div class="round-pills">
          <div *ngFor="let r of [].constructor(totalRounds()); let i = index" 
               class="round-pill" 
               [class.active]="currentRound() === i"
               [class.done]="currentRound() > i">
          </div>
        </div>
        <div class="round-label">Ronda {{ currentRound() + 1 }} de {{ totalRounds() }}</div>
      </div>

      <!-- GAME AREA -->
      <div class="match-area" *ngIf="!gameFinished() && !roundComplete()">
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
      <div class="feedback-bar" *ngIf="lastFeedback() && !gameFinished() && !roundComplete()" [class.correct]="lastCorrect()" [class.wrong]="!lastCorrect()">
        <span class="fb-icon">{{ lastCorrect() ? '💡' : '❌' }}</span>
        <span class="fb-text">{{ lastFeedback() }}</span>
      </div>

      <!-- ROUND COMPLETE -->
      <div class="round-complete" *ngIf="roundComplete() && !gameFinished()">
        <div class="rc-icon">🔥</div>
        <h3 class="rc-text">¡Ronda {{ currentRound() + 1 }} Completada!</h3>
        <button class="btn-next-round" (click)="nextRound()">Siguiente Ronda →</button>
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

    /* ROUND INDICATOR */
    .round-bar { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; }
    .round-pills { display: flex; gap: 0.4rem; }
    .round-pill { width: 30px; height: 6px; border-radius: 3px; background: rgba(0,0,0,0.1); transition: all 0.3s; }
    .round-pill.active { background: var(--accent-primary); width: 40px; }
    .round-pill.done { background: #58cc02; }
    .round-label { font-size: 0.78rem; font-weight: 700; color: var(--text-secondary); }

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
    .match-btn.matched { border-color: #58cc02; background: rgba(88,204,2,0.08); color: #16a34a; cursor: default; opacity: 0.75; transform: translateY(2px); box-shadow: 0 2px 0 rgba(0,0,0,0.05); }

    /* FEEDBACK */
    .feedback-bar { display: flex; align-items: center; gap: 0.5rem; padding: 0.65rem 1rem; border-radius: 12px; margin-bottom: 0.75rem; font-size: 0.85rem; font-weight: 700; animation: fadeSlide 0.3s ease; }
    .feedback-bar.correct { background: rgba(88,204,2,0.1); border: 1px solid rgba(88,204,2,0.2); color: #16a34a; }
    .feedback-bar.wrong { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.15); color: #dc2626; }
    .fb-icon { font-size: 1rem; }
    @keyframes fadeSlide { from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)} }

    /* ROUND COMPLETE */
    .round-complete { text-align: center; padding: 1.5rem; background: rgba(88,204,2,0.06); border: 2px solid rgba(88,204,2,0.15); border-radius: 20px; margin-top: 1rem; animation: fadeSlide 0.4s ease; }
    .rc-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
    .rc-text { font-family: var(--font-heading); font-size: 1.1rem; font-weight: 800; color: var(--text-primary); margin: 0 0 1rem; }
    .btn-next-round { background: #58cc02; color: #fff; font-family: var(--font-heading); font-size: 1rem; font-weight: 800; padding: 0.75rem 1.75rem; border-radius: 14px; border: none; box-shadow: 0 4px 0 #46a302; cursor: pointer; transition: all 0.2s; }
    .btn-next-round:hover { transform: translateY(2px); box-shadow: 0 2px 0 #46a302; }

    /* GAME FINISHED */
    .game-finished { text-align: center; padding: 2rem; background: linear-gradient(135deg, rgba(255,200,0,0.06), rgba(88,204,2,0.06)); border: 2px solid rgba(88,204,2,0.15); border-radius: 24px; margin-top: 1.25rem; animation: fadeSlide 0.5s ease; }
    .gf-icon { font-size: 3rem; margin-bottom: 0.75rem; }
    .game-finished h3 { font-family: var(--font-heading); font-size: 1.4rem; font-weight: 800; color: var(--text-primary); margin: 0 0 0.5rem; }
    .game-finished p { color: var(--text-secondary); font-size: 0.95rem; margin: 0 0 0.75rem; }
    .gf-actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
    .btn-replay { background: #fff; border: 2px solid rgba(0,0,0,0.1); color: var(--text-primary); font-family: var(--font-heading); font-size: 0.9rem; font-weight: 800; padding: 0.7rem 1.25rem; border-radius: 12px; cursor: pointer; transition: all 0.2s; }
    .btn-replay:hover { border-color: var(--accent-primary); color: var(--accent-primary); }
    .btn-finish { background: #58cc02; color: #fff; font-family: var(--font-heading); font-size: 0.9rem; font-weight: 800; padding: 0.7rem 1.25rem; border-radius: 12px; border: none; box-shadow: 0 4px 0 #46a302; cursor: pointer; transition: all 0.2s; }
    .btn-finish:hover { transform: translateY(2px); box-shadow: 0 2px 0 #46a302; }

    @keyframes shakeError { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-5px); } 40% { transform: translateX(5px); } 60% { transform: translateX(-5px); } 80% { transform: translateX(5px); } }

    @media (max-width: 640px) { .match-area { flex-direction: column; gap: 0.5rem; } .match-arrows { display: none; } }
  `]
})
export class MatchPracticeComponent implements OnInit {
  @Input() data!: { title?: string, description?: string, pairs?: MatchPair[], rounds?: { pairs: MatchPair[] }[] };
  @Output() onComplete = new EventEmitter<void>();

  title = signal('Conecta los Pares');
  description = signal('Haz clic en la izquierda y luego en la derecha para conectarlos.');
  
  rounds = signal<MatchPair[][]>([]);
  currentRound = signal(0);
  
  currentPairs = computed(() => {
    const r = this.rounds();
    if (r.length === 0) return [];
    return r[this.currentRound()];
  });
  
  totalRounds = computed(() => this.rounds().length);

  rightItemsShuffled = signal<MatchPair[]>([]);

  selectedLeft = signal<number | null>(null);
  selectedRight = signal<number | null>(null);
  wrongFlash = signal<number | null>(null);

  matchedIds = signal<Set<number>>(new Set());
  
  lastFeedback = signal<string>('');
  lastCorrect = signal<boolean>(false);

  roundComplete = computed(() => {
    const pairs = this.currentPairs();
    return pairs.length > 0 && this.matchedIds().size === pairs.length;
  });

  gameFinished = computed(() => {
    return this.roundComplete() && this.currentRound() === this.totalRounds() - 1;
  });

  leftItems = computed(() => this.currentPairs());

  ngOnInit() {
    if (this.data) {
      if (this.data.title) this.title.set(this.data.title);
      if (this.data.description) this.description.set(this.data.description);
      
      // Support BOTH formats: { pairs: [...] } OR { rounds: [{pairs: [...]}] }
      let newRounds: MatchPair[][] = [];
      if (this.data.rounds && this.data.rounds.length > 0) {
        newRounds = this.data.rounds.map(r => r.pairs);
      } else if (this.data.pairs && this.data.pairs.length > 0) {
        newRounds = [this.data.pairs];
      }
      
      this.rounds.set(newRounds);
      this.setupCurrentRound();
    }
  }

  setupCurrentRound() {
    const pairs = this.currentPairs();
    if (pairs && pairs.length > 0) {
      this.rightItemsShuffled.set([...pairs].sort(() => Math.random() - 0.5));
    }
    this.matchedIds.set(new Set());
    this.selectedLeft.set(null);
    this.selectedRight.set(null);
    this.lastFeedback.set('');
  }

  nextRound() {
    if (this.currentRound() < this.totalRounds() - 1) {
      this.currentRound.update(r => r + 1);
      this.setupCurrentRound();
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
    this.currentRound.set(0);
    this.setupCurrentRound();
  }
}
