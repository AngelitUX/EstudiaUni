import { Component, signal, computed, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SynonymPair {
  id: number;
  word: string;
  synonym: string;
  hint: string;
}

const SYNONYM_ROUNDS: SynonymPair[][] = [
  // Round 1 — PAES frecuentes
  [
    { id: 1, word: 'Investigación', synonym: 'Estudio', hint: 'Ambas se refieren a un proceso de búsqueda de conocimiento.' },
    { id: 2, word: 'Incremento', synonym: 'Aumento', hint: 'Las dos expresan que algo crece o sube.' },
    { id: 3, word: 'Propósito', synonym: 'Objetivo', hint: 'Ambas indican la finalidad o meta de algo.' },
    { id: 4, word: 'Consecuencia', synonym: 'Resultado', hint: 'Las dos describen lo que ocurre después de algo.' },
  ],
  // Round 2 — Paráfrasis más difíciles
  [
    { id: 5, word: 'Controversia', synonym: 'Polémica', hint: 'Ambas aluden a un debate o desacuerdo.' },
    { id: 6, word: 'Escasez', synonym: 'Carencia', hint: 'Las dos expresan que algo falta o es insuficiente.' },
    { id: 7, word: 'Deterioro', synonym: 'Desgaste', hint: 'Ambas indican que algo se daña o pierde calidad.' },
    { id: 8, word: 'Predominio', synonym: 'Dominio', hint: 'Las dos refieren a tener superioridad o control.' },
  ],
  // Round 3 — Contexto PAES real
  [
    { id: 9, word: 'Transformación', synonym: 'Cambio', hint: 'Ambas implican que algo se modifica o altera.' },
    { id: 10, word: 'Implementar', synonym: 'Aplicar', hint: 'Las dos significan poner algo en práctica.' },
    { id: 11, word: 'Fenómeno', synonym: 'Suceso', hint: 'Ambas describen algo que ocurre o se manifiesta.' },
    { id: 12, word: 'Relevante', synonym: 'Importante', hint: 'Las dos indican que algo tiene significancia.' },
  ],
];

@Component({
  selector: 'app-synonym-practice',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="syn-game">
      <!-- HEADER -->
      <div class="game-header">
        <div class="game-badge">🧠 Mini-Juego</div>
        <h2 class="game-title">Conecta el Sinónimo</h2>
        <p class="game-desc">Haz clic en una palabra de la izquierda y luego en su sinónimo de la derecha. ¡Entrena tu ojo para la PAES!</p>
      </div>

      <!-- ROUND INDICATOR -->
      <div class="round-bar" *ngIf="!gameFinished()">
        <div class="round-pills">
          <div *ngFor="let r of rounds; let i = index" class="round-pill"
            [class.active]="i === currentRound()"
            [class.done]="i < currentRound()">
            {{ i < currentRound() ? '✓' : i + 1 }}
          </div>
        </div>
        <span class="round-label">Ronda {{ currentRound() + 1 }} / {{ rounds.length }}</span>
      </div>

      <!-- GAME AREA -->
      <div class="match-area" *ngIf="!gameFinished()">
        <!-- LEFT COLUMN (words) -->
        <div class="match-col">
          <button *ngFor="let pair of leftItems()" class="match-btn word-btn"
            [class.selected]="selectedLeft() === pair.id"
            [class.matched]="isMatched(pair.id)"
            [disabled]="isMatched(pair.id)"
            (click)="selectLeft(pair.id)">
            {{ pair.word }}
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

        <!-- RIGHT COLUMN (synonyms, shuffled) -->
        <div class="match-col">
          <button *ngFor="let syn of getRightItems()" class="match-btn syn-btn"
            [class.selected]="selectedRight() === syn.id"
            [class.matched]="isMatched(syn.id)"
            [class.wrong-flash]="wrongFlash() === syn.id"
            [disabled]="isMatched(syn.id)"
            (click)="selectRight(syn.id)">
            {{ syn.synonym }}
          </button>
        </div>
      </div>

      <!-- FEEDBACK -->
      <div class="feedback-bar" *ngIf="lastFeedback() && !gameFinished()" [class.correct]="lastCorrect()" [class.wrong]="!lastCorrect()">
        <span class="fb-icon">{{ lastCorrect() ? '✅' : '❌' }}</span>
        <span class="fb-text">{{ lastFeedback() }}</span>
      </div>

      <!-- SCORE -->
      <div class="score-bar" *ngIf="!gameFinished()">
        <div class="score-item"><span class="sc-num correct-num">{{ correctCount() }}</span><span class="sc-label">Correctas</span></div>
        <div class="score-item"><span class="sc-num wrong-num">{{ wrongCount() }}</span><span class="sc-label">Errores</span></div>
        <div class="score-item"><span class="sc-num streak-num">{{ streak() }}🔥</span><span class="sc-label">Racha</span></div>
      </div>

      <!-- ROUND COMPLETE -->
      <div class="round-complete" *ngIf="roundComplete() && !gameFinished()">
        <div class="rc-icon">🎉</div>
        <p class="rc-text">¡Ronda completada!</p>
        <button class="btn-next-round" (click)="nextRound()">
          {{ currentRound() === rounds.length - 1 ? 'Ver Resultados →' : 'Siguiente Ronda →' }}
        </button>
      </div>

      <!-- GAME FINISHED -->
      <div class="game-finished" *ngIf="gameFinished()">
        <div class="gf-icon">🏆</div>
        <h3>¡Práctica completada!</h3>
        <p>Acertaste <strong>{{ correctCount() }}</strong> de <strong>{{ totalPairs }}</strong> pares en {{ rounds.length }} rondas.</p>
        <div class="gf-msg" *ngIf="correctCount() === totalPairs">
          ¡Perfecto! Dominas los sinónimos como un profesional. 💪
        </div>
        <div class="gf-msg" *ngIf="correctCount() < totalPairs && correctCount() >= totalPairs - 3">
          ¡Muy bien! Solo algunos errores. Sigue practicando. 👏
        </div>
        <div class="gf-actions">
          <button class="btn-replay" (click)="resetGame()">🔄 Volver a hacerlo</button>
          <button class="btn-finish" (click)="onComplete.emit()">Siguiente Lección →</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .syn-game { max-width: 600px; margin: 0 auto; }

    /* HEADER */
    .game-header { text-align: center; margin-bottom: 1.5rem; }
    .game-badge { display: inline-block; background: linear-gradient(135deg, #855cd6, #6b46b8); color: #fff; font-family: var(--font-heading); font-size: 0.75rem; font-weight: 800; padding: 0.35rem 0.85rem; border-radius: 99px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
    .game-title { font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin: 0 0 0.4rem; }
    .game-desc { font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5; margin: 0; }

    /* ROUND BAR */
    .round-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; padding: 0.65rem 1rem; background: rgba(0,0,0,0.02); border-radius: 14px; border: 1px solid rgba(0,0,0,0.05); }
    .round-pills { display: flex; gap: 0.4rem; }
    .round-pill { width: 30px; height: 30px; border-radius: 50%; border: 2px solid rgba(0,0,0,0.1); background: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800; color: var(--text-secondary); transition: all 0.3s; }
    .round-pill.active { background: var(--accent-primary); color: #fff; border-color: var(--accent-primary); transform: scale(1.15); box-shadow: 0 0 0 4px rgba(133,92,214,0.15); }
    .round-pill.done { background: #58cc02; color: #fff; border-color: #58cc02; }
    .round-label { font-size: 0.78rem; font-weight: 700; color: var(--text-secondary); }

    /* MATCH AREA */
    .match-area { display: grid; grid-template-columns: 1fr 40px 1fr; gap: 0.5rem; align-items: start; margin-bottom: 1rem; }

    .match-col { display: flex; flex-direction: column; gap: 0.5rem; }

    .match-btn { padding: 0.75rem 1rem; border-radius: 12px; border: 2px solid rgba(0,0,0,0.08); background: #fff; font-size: 0.9rem; font-weight: 700; cursor: pointer; transition: all 0.2s; text-align: center; }
    .match-btn:hover:not(:disabled) { border-color: var(--accent-primary); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
    .match-btn.selected { border-color: var(--accent-primary); background: rgba(133,92,214,0.08); box-shadow: 0 0 0 3px rgba(133,92,214,0.12); }
    .match-btn.matched { border-color: #58cc02; background: rgba(88,204,2,0.08); color: #16a34a; cursor: default; opacity: 0.7; }
    .match-btn:disabled { cursor: default; }

    .word-btn { color: var(--accent-primary); }
    .syn-btn { color: #1a7a3a; }

    .wrong-flash { animation: wrongShake 0.4s ease; border-color: #ef4444 !important; background: rgba(239,68,68,0.08) !important; }
    @keyframes wrongShake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }

    /* ARROWS */
    .match-arrows { display: flex; flex-direction: column; align-items: center; justify-content: space-around; gap: 0.5rem; padding-top: 0.3rem; }
    .arrow-slot { width: 28px; height: 40px; display: flex; align-items: center; justify-content: center; }
    .pending-dot { color: rgba(0,0,0,0.15); font-size: 1.5rem; }
    .connected-line { color: #58cc02; font-weight: 800; font-size: 0.85rem; animation: popIn 0.3s ease; }
    @keyframes popIn { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }

    /* FEEDBACK */
    .feedback-bar { display: flex; align-items: center; gap: 0.5rem; padding: 0.65rem 1rem; border-radius: 12px; margin-bottom: 0.75rem; font-size: 0.85rem; font-weight: 700; animation: fadeSlide 0.3s ease; }
    .feedback-bar.correct { background: rgba(88,204,2,0.1); border: 1px solid rgba(88,204,2,0.2); color: #16a34a; }
    .feedback-bar.wrong { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.15); color: #dc2626; }
    .fb-icon { font-size: 1rem; }
    @keyframes fadeSlide { from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)} }

    /* SCORE */
    .score-bar { display: flex; gap: 1rem; justify-content: center; margin: 1rem 0; }
    .score-item { display: flex; flex-direction: column; align-items: center; padding: 0.5rem 1rem; background: rgba(0,0,0,0.02); border-radius: 12px; min-width: 70px; }
    .sc-num { font-family: var(--font-heading); font-size: 1.3rem; font-weight: 800; }
    .correct-num { color: #58cc02; }
    .wrong-num { color: #ef4444; }
    .streak-num { color: #ff9600; }
    .sc-label { font-size: 0.7rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; }

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
    .gf-msg { font-size: 0.9rem; font-weight: 700; color: #16a34a; margin-bottom: 1rem; }
    .gf-actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
    .btn-replay { background: #fff; border: 2px solid rgba(0,0,0,0.1); color: var(--text-primary); font-family: var(--font-heading); font-size: 0.9rem; font-weight: 800; padding: 0.7rem 1.25rem; border-radius: 12px; cursor: pointer; transition: all 0.2s; }
    .btn-replay:hover { border-color: var(--accent-primary); color: var(--accent-primary); }
    .btn-finish { background: #58cc02; color: #fff; font-family: var(--font-heading); font-size: 0.9rem; font-weight: 800; padding: 0.7rem 1.25rem; border-radius: 12px; border: none; box-shadow: 0 4px 0 #46a302; cursor: pointer; transition: all 0.2s; }
    .btn-finish:hover { transform: translateY(2px); box-shadow: 0 2px 0 #46a302; }

    @media(max-width:480px) {
      .match-area { grid-template-columns: 1fr 30px 1fr; }
      .match-btn { padding: 0.6rem 0.5rem; font-size: 0.82rem; }
      .game-title { font-size: 1.25rem; }
    }
  `]
})
export class SynonymPracticeComponent {
  @Output() onComplete = new EventEmitter<void>();

  rounds = SYNONYM_ROUNDS;
  totalPairs = SYNONYM_ROUNDS.reduce((sum, r) => sum + r.length, 0);

  currentRound = signal(0);
  matchedIds = signal<Set<number>>(new Set());
  selectedLeft = signal<number | null>(null);
  selectedRight = signal<number | null>(null);
  wrongFlash = signal<number | null>(null);
  lastFeedback = signal<string>('');
  lastCorrect = signal(true);
  correctCount = signal(0);
  wrongCount = signal(0);
  streak = signal(0);

  currentPairs = computed(() => {
    const round = this.currentRound();
    if (round >= this.rounds.length) return [];
    return this.rounds[round];
  });
  leftItems = computed(() => this.currentPairs());
  rightItems = computed(() => {
    const pairs = [...this.currentPairs()];
    for (let i = pairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
    }
    return pairs;
  });
  roundComplete = computed(() => {
    const round = this.currentRound();
    if (round >= this.rounds.length) return false;
    const pairs = this.rounds[round];
    return pairs.every(p => this.matchedIds().has(p.id));
  });
  gameFinished = computed(() => this.currentRound() >= this.rounds.length);

  // Cache shuffled items so they don't re-shuffle on every signal change
  private _cachedRight: SynonymPair[] = [];
  private _cachedRound = -1;

  constructor() {
    // Initialize first round's shuffled items
    this._shuffleRight();
  }

  private _shuffleRight() {
    const round = this.currentRound();
    if (round >= this.rounds.length) return;
    const pairs = [...this.rounds[round]];
    for (let i = pairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
    }
    this._cachedRight = pairs;
    this._cachedRound = round;
  }

  getRightItems(): SynonymPair[] {
    if (this._cachedRound !== this.currentRound()) {
      this._shuffleRight();
    }
    return this._cachedRight;
  }

  isMatched(id: number): boolean {
    return this.matchedIds().has(id);
  }

  selectLeft(id: number) {
    if (this.isMatched(id)) return;
    this.selectedLeft.set(id);
    this.tryMatch();
  }

  selectRight(id: number) {
    if (this.isMatched(id)) return;
    this.selectedRight.set(id);
    this.tryMatch();
  }

  private tryMatch() {
    const left = this.selectedLeft();
    const right = this.selectedRight();
    if (left === null || right === null) return;

    if (left === right) {
      // Correct match!
      const pair = this.currentPairs().find(p => p.id === left)!;
      const newSet = new Set(this.matchedIds());
      newSet.add(left);
      this.matchedIds.set(newSet);
      this.correctCount.update(v => v + 1);
      this.streak.update(v => v + 1);
      this.lastFeedback.set(`¡Correcto! ${pair.hint}`);
      this.lastCorrect.set(true);
    } else {
      // Wrong match
      this.wrongCount.update(v => v + 1);
      this.streak.set(0);
      this.wrongFlash.set(right);
      this.lastFeedback.set('No es la pareja correcta. ¡Inténtalo de nuevo!');
      this.lastCorrect.set(false);
      setTimeout(() => this.wrongFlash.set(null), 500);
    }

    this.selectedLeft.set(null);
    this.selectedRight.set(null);
  }

  nextRound() {
    if (this.currentRound() >= this.rounds.length - 1) {
      this.currentRound.set(this.rounds.length);
      return;
    }
    this.currentRound.update(v => v + 1);
    this.matchedIds.set(new Set());
    this.lastFeedback.set('');
    this._shuffleRight();
  }

  resetGame() {
    this.currentRound.set(0);
    this.matchedIds.set(new Set());
    this.selectedLeft.set(null);
    this.selectedRight.set(null);
    this.correctCount.set(0);
    this.wrongCount.set(0);
    this.streak.set(0);
    this.lastFeedback.set('');
    this.wrongFlash.set(null);
    this._shuffleRight();
  }
}
