import { Component, signal, computed, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ConnectorItem {
  id: number;
  sentenceBefore: string;
  sentenceAfter: string;
  options: { key: string; text: string }[];
  correctKey: string;
  relationType: string;
  explanation: string;
}

const CONNECTOR_ROUNDS: ConnectorItem[][] = [
  // Round 1 — Conectores básicos
  [
    {
      id: 1,
      sentenceBefore: 'La ciudad experimentó un crecimiento económico acelerado,',
      sentenceAfter: 'la desigualdad social aumentó considerablemente.',
      options: [
        { key: 'A', text: 'por lo tanto' },
        { key: 'B', text: 'sin embargo' },
        { key: 'C', text: 'además' },
        { key: 'D', text: 'es decir' },
      ],
      correctKey: 'B',
      relationType: 'Contraste / Oposición',
      explanation: '✅ "Sin embargo" marca contraste: el crecimiento económico debería mejorar todo, PERO la desigualdad aumentó. Relación adversativa.'
    },
    {
      id: 2,
      sentenceBefore: 'La deforestación destruye los hábitats naturales;',
      sentenceAfter: 'muchas especies se encuentran en peligro de extinción.',
      options: [
        { key: 'A', text: 'en cambio' },
        { key: 'B', text: 'aunque' },
        { key: 'C', text: 'en consecuencia' },
        { key: 'D', text: 'no obstante' },
      ],
      correctKey: 'C',
      relationType: 'Causa → Efecto',
      explanation: '✅ "En consecuencia" marca que la segunda idea es resultado de la primera. La deforestación CAUSA el peligro de extinción.'
    },
    {
      id: 3,
      sentenceBefore: 'El estudio reveló una correlación entre el uso de redes sociales y la ansiedad.',
      sentenceAfter: 'se encontró que los adolescentes son el grupo más afectado.',
      options: [
        { key: 'A', text: 'Sin embargo' },
        { key: 'B', text: 'Por el contrario' },
        { key: 'C', text: 'Asimismo' },
        { key: 'D', text: 'En otras palabras' },
      ],
      correctKey: 'C',
      relationType: 'Adición',
      explanation: '✅ "Asimismo" agrega información complementaria. El estudio encontró una cosa Y ADEMÁS otra relacionada.'
    },
    {
      id: 4,
      sentenceBefore: 'La vacuna demostró ser segura y eficaz en los ensayos clínicos,',
      sentenceAfter: 'fue aprobada por las autoridades sanitarias.',
      options: [
        { key: 'A', text: 'a pesar de ello' },
        { key: 'B', text: 'en cambio' },
        { key: 'C', text: 'por esta razón' },
        { key: 'D', text: 'no obstante' },
      ],
      correctKey: 'C',
      relationType: 'Causa → Efecto',
      explanation: '✅ "Por esta razón" establece que la aprobación fue consecuencia directa de los buenos resultados en ensayos.'
    },
  ],
  // Round 2 — Conectores intermedios
  [
    {
      id: 5,
      sentenceBefore: 'El gobierno anunció un aumento en el presupuesto educativo.',
      sentenceAfter: 'los sindicatos de profesores afirmaron que la cifra era insuficiente.',
      options: [
        { key: 'A', text: 'Por lo tanto' },
        { key: 'B', text: 'Es decir' },
        { key: 'C', text: 'No obstante' },
        { key: 'D', text: 'Dado que' },
      ],
      correctKey: 'C',
      relationType: 'Contraste / Concesión',
      explanation: '✅ "No obstante" introduce una objeción: hay aumento, PERO no es suficiente según los sindicatos. Concesión.'
    },
    {
      id: 6,
      sentenceBefore: 'Los países nórdicos invierten fuertemente en educación pública;',
      sentenceAfter: 'sus índices de desarrollo humano se encuentran entre los más altos del mundo.',
      options: [
        { key: 'A', text: 'a pesar de que' },
        { key: 'B', text: 'de ahí que' },
        { key: 'C', text: 'en cambio' },
        { key: 'D', text: 'si bien' },
      ],
      correctKey: 'B',
      relationType: 'Causa → Efecto',
      explanation: '✅ "De ahí que" conecta la inversión en educación como causa del alto desarrollo. Relación causal.'
    },
    {
      id: 7,
      sentenceBefore: 'Los niveles de contaminación en Santiago superan los límites recomendados.',
      sentenceAfter: 'en ciudades como Valdivia el aire mantiene una calidad aceptable.',
      options: [
        { key: 'A', text: 'Además' },
        { key: 'B', text: 'Por consiguiente' },
        { key: 'C', text: 'En contraste' },
        { key: 'D', text: 'Incluso' },
      ],
      correctKey: 'C',
      relationType: 'Comparación / Contraste',
      explanation: '✅ "En contraste" compara dos situaciones opuestas: Santiago (contaminado) vs. Valdivia (aire aceptable).'
    },
    {
      id: 8,
      sentenceBefore: 'La transición demográfica implica una reducción de la fecundidad,',
      sentenceAfter: 'un aumento progresivo de la esperanza de vida.',
      options: [
        { key: 'A', text: 'sin embargo' },
        { key: 'B', text: 'así como' },
        { key: 'C', text: 'a causa de' },
        { key: 'D', text: 'en vez de' },
      ],
      correctKey: 'B',
      relationType: 'Adición / Enumeración',
      explanation: '✅ "Así como" conecta dos características que ocurren juntas: baja fecundidad Y aumento de esperanza de vida.'
    },
  ],
  // Round 3 — Conectores PAES avanzados
  [
    {
      id: 9,
      sentenceBefore: 'Las nuevas tecnologías han facilitado el acceso a la información.',
      sentenceAfter: 'han generado debates sobre la veracidad de las fuentes disponibles.',
      options: [
        { key: 'A', text: 'En consecuencia' },
        { key: 'B', text: 'Por ejemplo' },
        { key: 'C', text: 'No obstante, también' },
        { key: 'D', text: 'Puesto que' },
      ],
      correctKey: 'C',
      relationType: 'Contraste + Adición',
      explanation: '✅ "No obstante, también" reconoce un beneficio (acceso) PERO añade una preocupación (veracidad). Concesión con adición.'
    },
    {
      id: 10,
      sentenceBefore: 'El cambio climático afecta a todos los ecosistemas del planeta.',
      sentenceAfter: 'las regiones polares experimentan un deshielo sin precedentes.',
      options: [
        { key: 'A', text: 'En particular' },
        { key: 'B', text: 'Sin embargo' },
        { key: 'C', text: 'Por el contrario' },
        { key: 'D', text: 'Aunque' },
      ],
      correctKey: 'A',
      relationType: 'General → Particular',
      explanation: '✅ "En particular" introduce un caso específico (regiones polares) de la idea general (todos los ecosistemas). De lo general a lo particular.'
    },
    {
      id: 11,
      sentenceBefore: 'La obra de Gabriela Mistral aborda temas de dolor, amor y maternidad;',
      sentenceAfter: 'su poesía refleja las experiencias más íntimas del ser humano.',
      options: [
        { key: 'A', text: 'por el contrario' },
        { key: 'B', text: 'en otras palabras' },
        { key: 'C', text: 'a pesar de ello' },
        { key: 'D', text: 'dado que' },
      ],
      correctKey: 'B',
      relationType: 'Reformulación / Explicación',
      explanation: '✅ "En otras palabras" reformula la misma idea: los temas (dolor, amor, maternidad) = experiencias íntimas. Es una paráfrasis.'
    },
    {
      id: 12,
      sentenceBefore: 'La automatización ha eliminado ciertos empleos tradicionales.',
      sentenceAfter: 'ha creado nuevas oportunidades laborales en el sector tecnológico.',
      options: [
        { key: 'A', text: 'Por lo tanto' },
        { key: 'B', text: 'Es decir' },
        { key: 'C', text: 'En cambio' },
        { key: 'D', text: 'Además' },
      ],
      correctKey: 'C',
      relationType: 'Contraste / Oposición',
      explanation: '✅ "En cambio" contrapone dos efectos opuestos de la automatización: elimina empleos vs. crea otros. Relación de contraste.'
    },
  ],
];

@Component({
  selector: 'app-connector-practice',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="conn-game">
      <!-- HEADER -->
      <div class="game-header">
        <div class="game-badge">🔗 Mini-Juego</div>
        <h2 class="game-title">Conectores Lógicos</h2>
        <p class="game-desc">Completa la oración eligiendo el <strong>conector correcto</strong>. Los conectores son las "señales de tránsito" del texto.</p>
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
      <div class="game-area" *ngIf="!gameFinished()">
        <div *ngFor="let item of currentItems(); let idx = index" class="conn-card"
          [class.answered]="isRevealed(item.id)">

          <div class="q-number">{{ idx + 1 }} / {{ currentItems().length }}</div>

          <!-- Sentence with gap -->
          <div class="sentence-gap">
            <span class="s-before">{{ item.sentenceBefore }}</span>
            <span class="gap-badge" [class.filled]="getAnswer(item.id)"
              [class.correct-gap]="isRevealed(item.id) && getAnswer(item.id) === item.correctKey"
              [class.wrong-gap]="isRevealed(item.id) && getAnswer(item.id) !== item.correctKey">
              {{ getSelectedText(item) || '______' }}
            </span>
            <span class="s-after">{{ item.sentenceAfter }}</span>
          </div>

          <!-- Relation type tag -->
          <div class="relation-tag" *ngIf="isRevealed(item.id)">
            {{ item.relationType }}
          </div>

          <!-- Options -->
          <div class="options-row">
            <button *ngFor="let opt of item.options" class="conn-option"
              [class.selected]="getAnswer(item.id) === opt.key"
              [class.correct]="isRevealed(item.id) && opt.key === item.correctKey"
              [class.wrong]="isRevealed(item.id) && getAnswer(item.id) === opt.key && opt.key !== item.correctKey"
              [disabled]="isRevealed(item.id)"
              (click)="selectConnector(item.id, opt.key, item.correctKey)">
              {{ opt.text }}
            </button>
          </div>

          <!-- Explanation -->
          <div class="explanation" *ngIf="isRevealed(item.id)">
            {{ item.explanation }}
          </div>
        </div>

        <!-- Round Complete -->
        <div class="round-complete" *ngIf="roundComplete() && !gameFinished()">
          <div class="rc-icon">🎉</div>
          <p class="rc-text">¡Ronda completada!</p>
          <button class="btn-next-round" (click)="nextRound()">
            {{ currentRound() === rounds.length - 1 ? 'Ver Resultados →' : 'Siguiente Ronda →' }}
          </button>
        </div>
      </div>

      <!-- SCORE BAR -->
      <div class="score-bar" *ngIf="!gameFinished()">
        <div class="score-item"><span class="sc-num correct-num">{{ correctCount() }}</span><span class="sc-label">Correctas</span></div>
        <div class="score-item"><span class="sc-num wrong-num">{{ wrongCount() }}</span><span class="sc-label">Errores</span></div>
        <div class="score-item"><span class="sc-num streak-num">{{ streak() }}🔥</span><span class="sc-label">Racha</span></div>
      </div>

      <!-- GAME FINISHED -->
      <div class="game-finished" *ngIf="gameFinished()">
        <div class="gf-icon" *ngIf="correctCount() === totalItems">🏆</div>
        <div class="gf-icon" *ngIf="correctCount() >= totalItems * 0.75 && correctCount() < totalItems">🌟</div>
        <div class="gf-icon" *ngIf="correctCount() >= totalItems * 0.5 && correctCount() < totalItems * 0.75">💪</div>
        <div class="gf-icon" *ngIf="correctCount() < totalItems * 0.5">📚</div>

        <h3 *ngIf="correctCount() === totalItems">¡Conectores dominados!</h3>
        <h3 *ngIf="correctCount() >= totalItems * 0.75 && correctCount() < totalItems">¡Muy bien!</h3>
        <h3 *ngIf="correctCount() >= totalItems * 0.5 && correctCount() < totalItems * 0.75">¡Buen intento!</h3>
        <h3 *ngIf="correctCount() < totalItems * 0.5">Sigue practicando</h3>

        <p>Acertaste <strong>{{ correctCount() }}</strong> de <strong>{{ totalItems }}</strong> conectores en {{ rounds.length }} rondas.</p>

        <div class="gf-msg gf-perfect" *ngIf="correctCount() === totalItems">
          ¡Perfecto! Ya puedes leer las "señales de tránsito" de cualquier texto. 🚦
        </div>
        <div class="gf-msg gf-good" *ngIf="correctCount() >= totalItems * 0.75 && correctCount() < totalItems">
          ¡Gran trabajo! Repasa los conectores que fallaste y vuelve a intentarlo. 👏
        </div>
        <div class="gf-msg gf-ok" *ngIf="correctCount() >= totalItems * 0.5 && correctCount() < totalItems * 0.75">
          Vas por buen camino. Identifica el tipo de relación entre las ideas para elegir el conector correcto. 💡
        </div>
        <div class="gf-msg gf-low" *ngIf="correctCount() < totalItems * 0.5">
          No te rindas. Relee las explicaciones y recuerda: cada conector indica un tipo de relación lógica. 🔄
        </div>

        <div class="gf-actions">
          <button class="btn-replay" (click)="resetGame()">🔄 Repetir</button>
          <button class="btn-finish" (click)="onComplete.emit()">Siguiente Lección →</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .conn-game { max-width: 620px; margin: 0 auto; }

    .game-header { text-align: center; margin-bottom: 1.5rem; }
    .game-badge { display: inline-block; background: linear-gradient(135deg, #855cd6, #6b46b8); color: #fff; font-family: var(--font-heading); font-size: 0.75rem; font-weight: 800; padding: 0.35rem 0.85rem; border-radius: 99px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
    .game-title { font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin: 0 0 0.4rem; }
    .game-desc { font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5; margin: 0; }

    .round-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; padding: 0.65rem 1rem; background: rgba(0,0,0,0.02); border-radius: 14px; border: 1px solid rgba(0,0,0,0.05); }
    .round-pills { display: flex; gap: 0.4rem; }
    .round-pill { width: 30px; height: 30px; border-radius: 50%; border: 2px solid rgba(0,0,0,0.1); background: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800; color: var(--text-secondary); transition: all 0.3s; }
    .round-pill.active { background: #855cd6; color: #fff; border-color: #855cd6; transform: scale(1.15); box-shadow: 0 0 0 4px rgba(133,92,214,0.15); }
    .round-pill.done { background: #58cc02; color: #fff; border-color: #58cc02; }
    .round-label { font-size: 0.78rem; font-weight: 700; color: var(--text-secondary); }

    .game-area { display: flex; flex-direction: column; gap: 1.25rem; }

    .conn-card { background: #fff; border: 2px solid rgba(0,0,0,0.06); border-radius: 18px; padding: 1.25rem; animation: fadeSlide 0.4s ease both; transition: all 0.3s; }
    .conn-card.answered { border-color: rgba(88,204,2,0.2); }

    .q-number { font-size: 0.72rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.75rem; }

    .sentence-gap { font-size: 0.95rem; line-height: 1.8; color: var(--text-primary); margin-bottom: 1rem; padding: 0.85rem 1rem; background: rgba(133,92,214,0.03); border-radius: 14px; border: 1px solid rgba(133,92,214,0.08); }
    .s-before, .s-after { }
    .gap-badge { display: inline-block; padding: 0.2rem 0.65rem; border-radius: 8px; font-weight: 800; margin: 0 0.25rem; transition: all 0.3s; }
    .gap-badge:not(.filled) { background: rgba(133,92,214,0.08); color: var(--accent-primary); border: 2px dashed rgba(133,92,214,0.3); min-width: 100px; text-align: center; }
    .gap-badge.filled { background: rgba(28,176,246,0.1); color: #0d8ecf; border: 2px solid rgba(28,176,246,0.3); }
    .gap-badge.correct-gap { background: rgba(88,204,2,0.1) !important; color: #16a34a !important; border-color: rgba(88,204,2,0.4) !important; }
    .gap-badge.wrong-gap { background: rgba(239,68,68,0.08) !important; color: #dc2626 !important; border-color: rgba(239,68,68,0.3) !important; text-decoration: line-through; }

    .relation-tag { display: inline-block; font-size: 0.72rem; font-weight: 800; background: rgba(133,92,214,0.08); color: var(--accent-primary); padding: 0.2rem 0.6rem; border-radius: 8px; margin-bottom: 0.75rem; animation: fadeSlide 0.3s ease; }

    .options-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem; margin-bottom: 0.5rem; }
    .conn-option { padding: 0.65rem 0.75rem; border-radius: 10px; border: 2px solid rgba(0,0,0,0.08); background: #fff; font-size: 0.88rem; font-weight: 700; cursor: pointer; transition: all 0.2s; text-align: center; color: var(--text-primary); }
    .conn-option:hover:not(:disabled) { border-color: var(--accent-primary); background: rgba(133,92,214,0.04); transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.06); }
    .conn-option.selected { border-color: var(--accent-primary); background: rgba(133,92,214,0.08); }
    .conn-option.correct { border-color: #58cc02 !important; background: rgba(88,204,2,0.08) !important; color: #16a34a; }
    .conn-option.wrong { border-color: #ef4444 !important; background: rgba(239,68,68,0.06) !important; color: #dc2626; }
    .conn-option:disabled { cursor: default; }

    .explanation { margin-top: 0.5rem; padding: 0.65rem 0.85rem; background: rgba(88,204,2,0.06); border: 1px solid rgba(88,204,2,0.15); border-radius: 10px; font-size: 0.82rem; font-weight: 700; color: #16a34a; animation: fadeSlide 0.3s ease; }

    .score-bar { display: flex; gap: 1rem; justify-content: center; margin: 1.25rem 0; }
    .score-item { display: flex; flex-direction: column; align-items: center; padding: 0.5rem 1rem; background: rgba(0,0,0,0.02); border-radius: 12px; min-width: 70px; }
    .sc-num { font-family: var(--font-heading); font-size: 1.3rem; font-weight: 800; }
    .correct-num { color: #58cc02; }
    .wrong-num { color: #ef4444; }
    .streak-num { color: #ff9600; }
    .sc-label { font-size: 0.7rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; }

    .round-complete { text-align: center; padding: 1.5rem; background: rgba(88,204,2,0.06); border: 2px solid rgba(88,204,2,0.15); border-radius: 20px; animation: fadeSlide 0.4s ease; }
    .rc-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
    .rc-text { font-family: var(--font-heading); font-size: 1.1rem; font-weight: 800; color: var(--text-primary); margin: 0 0 1rem; }
    .btn-next-round { background: #58cc02; color: #fff; font-family: var(--font-heading); font-size: 1rem; font-weight: 800; padding: 0.75rem 1.75rem; border-radius: 14px; border: none; box-shadow: 0 4px 0 #46a302; cursor: pointer; transition: all 0.2s; }
    .btn-next-round:hover { transform: translateY(2px); box-shadow: 0 2px 0 #46a302; }

    .game-finished { text-align: center; padding: 2rem; background: linear-gradient(135deg, rgba(133,92,214,0.06), rgba(88,204,2,0.06)); border: 2px solid rgba(88,204,2,0.15); border-radius: 24px; margin-top: 1.25rem; animation: fadeSlide 0.5s ease; }
    .gf-icon { font-size: 3rem; margin-bottom: 0.75rem; }
    .game-finished h3 { font-family: var(--font-heading); font-size: 1.4rem; font-weight: 800; color: var(--text-primary); margin: 0 0 0.5rem; }
    .game-finished p { color: var(--text-secondary); font-size: 0.95rem; margin: 0 0 0.75rem; }
    .gf-msg { font-size: 0.9rem; font-weight: 700; margin-bottom: 1rem; padding: 0.5rem 0.75rem; border-radius: 10px; }
    .gf-perfect { color: #16a34a; background: rgba(88,204,2,0.08); }
    .gf-good { color: #0d8ecf; background: rgba(28,176,246,0.08); }
    .gf-ok { color: #d97706; background: rgba(255,150,0,0.08); }
    .gf-low { color: #dc2626; background: rgba(239,68,68,0.07); }
    .gf-actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
    .btn-replay { background: #fff; border: 2px solid rgba(0,0,0,0.1); color: var(--text-primary); font-family: var(--font-heading); font-size: 0.9rem; font-weight: 800; padding: 0.7rem 1.25rem; border-radius: 12px; cursor: pointer; transition: all 0.2s; }
    .btn-replay:hover { border-color: var(--accent-primary); color: var(--accent-primary); }
    .btn-finish { background: #58cc02; color: #fff; font-family: var(--font-heading); font-size: 0.9rem; font-weight: 800; padding: 0.7rem 1.25rem; border-radius: 12px; border: none; box-shadow: 0 4px 0 #46a302; cursor: pointer; transition: all 0.2s; }
    .btn-finish:hover { transform: translateY(2px); box-shadow: 0 2px 0 #46a302; }

    @keyframes fadeSlide { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

    @media(max-width:480px) {
      .options-row { grid-template-columns: 1fr; }
      .conn-option { padding: 0.6rem; font-size: 0.82rem; }
      .game-title { font-size: 1.25rem; }
    }
  `]
})
export class ConnectorPracticeComponent {
  @Output() onComplete = new EventEmitter<void>();

  rounds = CONNECTOR_ROUNDS;
  totalItems = CONNECTOR_ROUNDS.reduce((sum, r) => sum + r.length, 0);

  currentRound = signal(0);
  answers = signal<Map<number, string>>(new Map());
  revealed = signal<Set<number>>(new Set());
  correctCount = signal(0);
  wrongCount = signal(0);
  streak = signal(0);

  currentItems = computed(() => {
    const round = this.currentRound();
    if (round >= this.rounds.length) return [];
    return this.rounds[round];
  });

  roundComplete = computed(() => {
    const items = this.currentItems();
    return items.length > 0 && items.every(item => this.revealed().has(item.id));
  });

  gameFinished = computed(() => this.currentRound() >= this.rounds.length);

  getAnswer(id: number): string | null {
    return this.answers().get(id) || null;
  }

  isRevealed(id: number): boolean {
    return this.revealed().has(id);
  }

  getSelectedText(item: ConnectorItem): string {
    const key = this.getAnswer(item.id);
    if (!key) return '';
    const opt = item.options.find(o => o.key === key);
    return opt ? opt.text : '';
  }

  selectConnector(itemId: number, selectedKey: string, correctKey: string) {
    if (this.revealed().has(itemId)) return;

    const newAnswers = new Map(this.answers());
    newAnswers.set(itemId, selectedKey);
    this.answers.set(newAnswers);

    setTimeout(() => {
      const newRevealed = new Set(this.revealed());
      newRevealed.add(itemId);
      this.revealed.set(newRevealed);

      if (selectedKey === correctKey) {
        this.correctCount.update(v => v + 1);
        this.streak.update(v => v + 1);
      } else {
        this.wrongCount.update(v => v + 1);
        this.streak.set(0);
      }
    }, 400);
  }

  nextRound() {
    if (this.currentRound() >= this.rounds.length - 1) {
      this.currentRound.set(this.rounds.length);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    this.currentRound.update(v => v + 1);
    this.answers.set(new Map());
    this.revealed.set(new Set());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetGame() {
    this.currentRound.set(0);
    this.answers.set(new Map());
    this.revealed.set(new Set());
    this.correctCount.set(0);
    this.wrongCount.set(0);
    this.streak.set(0);
  }
}
