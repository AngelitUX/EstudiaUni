import { Component, signal, computed, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface VocabItem {
  id: number;
  sentence: string;
  targetWord: string;
  correctMeaning: string;
  options: { key: string; text: string }[];
  correctKey: string;
  explanation: string;
}

const VOCAB_ROUNDS: VocabItem[][] = [
  // Round 1 — Palabras polisémicas frecuentes PAES
  [
    {
      id: 1, targetWord: 'gravedad',
      sentence: 'La <strong>gravedad</strong> de la crisis sanitaria obligó al gobierno a tomar medidas urgentes.',
      correctMeaning: 'Seriedad o importancia extrema',
      options: [
        { key: 'A', text: 'Fuerza de atracción entre cuerpos' },
        { key: 'B', text: 'Seriedad o importancia extrema' },
        { key: 'C', text: 'Peso de un objeto' },
        { key: 'D', text: 'Solemnidad en el tono de voz' },
      ],
      correctKey: 'B',
      explanation: '✅ En este contexto, "gravedad" = importancia/seriedad del problema, no la fuerza física.'
    },
    {
      id: 2, targetWord: 'estrecho',
      sentence: 'Existe un <strong>estrecho</strong> vínculo entre la desigualdad económica y el acceso a la educación.',
      correctMeaning: 'Cercano, íntimo',
      options: [
        { key: 'A', text: 'De poca anchura' },
        { key: 'B', text: 'Un paso marítimo entre dos tierras' },
        { key: 'C', text: 'Cercano, íntimo' },
        { key: 'D', text: 'Ajustado, que aprieta' },
      ],
      correctKey: 'C',
      explanation: '✅ "Estrecho vínculo" = relación cercana/íntima. No se refiere a algo físicamente angosto.'
    },
    {
      id: 3, targetWord: 'articular',
      sentence: 'El proyecto busca <strong>articular</strong> los esfuerzos de distintas instituciones para enfrentar el problema.',
      correctMeaning: 'Coordinar, conectar entre sí',
      options: [
        { key: 'A', text: 'Pronunciar palabras claramente' },
        { key: 'B', text: 'Unir huesos mediante articulaciones' },
        { key: 'C', text: 'Coordinar, conectar entre sí' },
        { key: 'D', text: 'Separar en partes más pequeñas' },
      ],
      correctKey: 'C',
      explanation: '✅ Aquí "articular" = coordinar/conectar esfuerzos. No se refiere a pronunciar ni a huesos.'
    },
    {
      id: 4, targetWord: 'depurar',
      sentence: 'Es necesario <strong>depurar</strong> los datos antes de presentar los resultados del estudio.',
      correctMeaning: 'Limpiar, eliminar errores o impurezas',
      options: [
        { key: 'A', text: 'Aumentar la cantidad de datos' },
        { key: 'B', text: 'Publicar los datos en un medio oficial' },
        { key: 'C', text: 'Limpiar, eliminar errores o impurezas' },
        { key: 'D', text: 'Copiar los datos a otro formato' },
      ],
      correctKey: 'C',
      explanation: '✅ "Depurar datos" = limpiarlos de errores. La técnica de sustitución confirma: "limpiar los datos antes de presentar...".'
    },
  ],
  // Round 2 — Vocabulario académico PAES
  [
    {
      id: 5, targetWord: 'sustancial',
      sentence: 'Los cambios introducidos en la legislación fueron <strong>sustanciales</strong> y transformaron el panorama jurídico.',
      correctMeaning: 'Importantes, significativos',
      options: [
        { key: 'A', text: 'Relacionados con sustancias químicas' },
        { key: 'B', text: 'Pequeños e imperceptibles' },
        { key: 'C', text: 'Importantes, significativos' },
        { key: 'D', text: 'Provisionales y temporales' },
      ],
      correctKey: 'C',
      explanation: '✅ "Cambios sustanciales" = cambios importantes/significativos. El contexto ("transformaron el panorama") lo confirma.'
    },
    {
      id: 6, targetWord: 'precario',
      sentence: 'Las condiciones laborales de los trabajadores eran <strong>precarias</strong>, sin contratos ni seguridad social.',
      correctMeaning: 'Insuficientes, inestables',
      options: [
        { key: 'A', text: 'Anticipadas, previstas' },
        { key: 'B', text: 'Insuficientes, inestables' },
        { key: 'C', text: 'Excesivamente reguladas' },
        { key: 'D', text: 'Voluntarias y opcionales' },
      ],
      correctKey: 'B',
      explanation: '✅ "Condiciones precarias" = insuficientes, inestables. El complemento "sin contratos ni seguridad" refuerza este significado.'
    },
    {
      id: 7, targetWord: 'subyacente',
      sentence: 'El problema <strong>subyacente</strong> no es la falta de recursos, sino la mala distribución de estos.',
      correctMeaning: 'Que está debajo, oculto bajo la superficie',
      options: [
        { key: 'A', text: 'Que está debajo, oculto bajo la superficie' },
        { key: 'B', text: 'Que es evidente y obvio' },
        { key: 'C', text: 'Que fue creado recientemente' },
        { key: 'D', text: 'Que carece de importancia' },
      ],
      correctKey: 'A',
      explanation: '✅ "Problema subyacente" = el problema real que está debajo de lo visible. No es obvio, está oculto.'
    },
    {
      id: 8, targetWord: 'eludir',
      sentence: 'Los responsables intentaron <strong>eludir</strong> las preguntas de los periodistas sobre el escándalo.',
      correctMeaning: 'Evitar, esquivar',
      options: [
        { key: 'A', text: 'Responder de forma directa' },
        { key: 'B', text: 'Evitar, esquivar' },
        { key: 'C', text: 'Aclarar con detalle' },
        { key: 'D', text: 'Preparar con anticipación' },
      ],
      correctKey: 'B',
      explanation: '✅ "Eludir preguntas" = evitarlas/esquivarlas. El contexto ("escándalo") sugiere que no quieren enfrentar el tema.'
    },
  ],
  // Round 3 — Contexto más desafiante
  [
    {
      id: 9, targetWord: 'vertiente',
      sentence: 'El fenómeno puede analizarse desde una <strong>vertiente</strong> económica, pero también desde una perspectiva cultural.',
      correctMeaning: 'Enfoque, perspectiva o aspecto',
      options: [
        { key: 'A', text: 'Ladera de una montaña' },
        { key: 'B', text: 'Corriente de agua' },
        { key: 'C', text: 'Enfoque, perspectiva o aspecto' },
        { key: 'D', text: 'Origen o fuente de algo' },
      ],
      correctKey: 'C',
      explanation: '✅ "Vertiente económica" = perspectiva/enfoque económico. Sustitución: "desde un enfoque económico" ✓.'
    },
    {
      id: 10, targetWord: 'acuciante',
      sentence: 'La necesidad de reformar el sistema de pensiones se ha vuelto <strong>acuciante</strong> en los últimos años.',
      correctMeaning: 'Urgente, apremiante',
      options: [
        { key: 'A', text: 'Irrelevante y prescindible' },
        { key: 'B', text: 'Compleja y difícil de entender' },
        { key: 'C', text: 'Urgente, apremiante' },
        { key: 'D', text: 'Costosa y difícil de financiar' },
      ],
      correctKey: 'C',
      explanation: '✅ "Necesidad acuciante" = necesidad urgente/apremiante. El contexto temporal ("en los últimos años") refuerza la urgencia.'
    },
    {
      id: 11, targetWord: 'soslayar',
      sentence: 'No se puede <strong>soslayar</strong> la evidencia científica al momento de diseñar políticas públicas.',
      correctMeaning: 'Ignorar, pasar por alto',
      options: [
        { key: 'A', text: 'Estudiar en profundidad' },
        { key: 'B', text: 'Ignorar, pasar por alto' },
        { key: 'C', text: 'Publicar de forma masiva' },
        { key: 'D', text: 'Cuestionar con argumentos' },
      ],
      correctKey: 'B',
      explanation: '✅ "No se puede soslayar" = no se puede ignorar/pasar por alto. Sustitución: "No se puede ignorar la evidencia" ✓.'
    },
    {
      id: 12, targetWord: 'ostentar',
      sentence: 'Chile <strong>ostenta</strong> uno de los índices de desarrollo humano más altos de América Latina.',
      correctMeaning: 'Poseer, tener (algo notable)',
      options: [
        { key: 'A', text: 'Presumir de forma exagerada' },
        { key: 'B', text: 'Perder gradualmente' },
        { key: 'C', text: 'Poseer, tener (algo notable)' },
        { key: 'D', text: 'Negar públicamente' },
      ],
      correctKey: 'C',
      explanation: '✅ "Ostentar un índice" = poseer/tener. Aunque "ostentar" a veces significa "presumir", aquí el contexto indica posesión.'
    },
  ],
];

@Component({
  selector: 'app-vocabulary-context-practice',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="vocab-game">
      <!-- HEADER -->
      <div class="game-header">
        <div class="game-badge">📖 Mini-Juego</div>
        <h2 class="game-title">Vocabulario en Contexto</h2>
        <p class="game-desc">Lee el fragmento y elige qué significa la palabra destacada <strong>según el contexto</strong>. ¡Usa la técnica de sustitución!</p>
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
        <div *ngFor="let item of currentItems(); let idx = index" class="vocab-card" 
          [class.answered]="isAnswered(item.id)"
          [class.hidden-card]="isAnswered(item.id) && !showExplanation(item.id)">

          <!-- Question Number -->
          <div class="q-number">{{ idx + 1 }} / {{ currentItems().length }}</div>

          <!-- Sentence -->
          <div class="sentence-box" [innerHTML]="item.sentence"></div>

          <!-- Target Word Label -->
          <div class="target-label">
            ❓ ¿Qué significa <strong>"{{ item.targetWord }}"</strong> en este contexto?
          </div>

          <!-- Options -->
          <div class="options-grid">
            <button *ngFor="let opt of item.options" class="option-btn"
              [class.selected]="getAnswer(item.id) === opt.key"
              [class.correct]="isRevealed(item.id) && opt.key === item.correctKey"
              [class.wrong]="isRevealed(item.id) && getAnswer(item.id) === opt.key && opt.key !== item.correctKey"
              [disabled]="isRevealed(item.id)"
              (click)="selectOption(item.id, opt.key, item.correctKey)">
              <span class="opt-key">{{ opt.key }})</span> {{ opt.text }}
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
        <!-- Icon & title change based on score -->
        <div class="gf-icon" *ngIf="correctCount() === totalItems">🏆</div>
        <div class="gf-icon" *ngIf="correctCount() >= totalItems * 0.75 && correctCount() < totalItems">🌟</div>
        <div class="gf-icon" *ngIf="correctCount() >= totalItems * 0.5 && correctCount() < totalItems * 0.75">💪</div>
        <div class="gf-icon" *ngIf="correctCount() < totalItems * 0.5">📚</div>

        <h3 *ngIf="correctCount() === totalItems">¡Vocabulario dominado!</h3>
        <h3 *ngIf="correctCount() >= totalItems * 0.75 && correctCount() < totalItems">¡Muy bien!</h3>
        <h3 *ngIf="correctCount() >= totalItems * 0.5 && correctCount() < totalItems * 0.75">¡Buen intento!</h3>
        <h3 *ngIf="correctCount() < totalItems * 0.5">Sigue practicando</h3>

        <p>Acertaste <strong>{{ correctCount() }}</strong> de <strong>{{ totalItems }}</strong> palabras en {{ rounds.length }} rondas.</p>

        <div class="gf-msg gf-perfect" *ngIf="correctCount() === totalItems">
          ¡Perfecto! La técnica de sustitución ya es parte de tu arsenal. 🎯
        </div>
        <div class="gf-msg gf-good" *ngIf="correctCount() >= totalItems * 0.75 && correctCount() < totalItems">
          ¡Gran trabajo! Casi lo tienes, repasa las que fallaste. 👏
        </div>
        <div class="gf-msg gf-ok" *ngIf="correctCount() >= totalItems * 0.5 && correctCount() < totalItems * 0.75">
          Vas por buen camino. Recuerda usar la técnica de sustitución para confirmar el significado. 💡
        </div>
        <div class="gf-msg gf-low" *ngIf="correctCount() < totalItems * 0.5">
          No te rindas. Relee las explicaciones de cada pregunta y vuelve a intentarlo. 🔄
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
    .vocab-game { max-width: 620px; margin: 0 auto; }

    .game-header { text-align: center; margin-bottom: 1.5rem; }
    .game-badge { display: inline-block; background: linear-gradient(135deg, #1cb0f6, #0d8ecf); color: #fff; font-family: var(--font-heading); font-size: 0.75rem; font-weight: 800; padding: 0.35rem 0.85rem; border-radius: 99px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
    .game-title { font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin: 0 0 0.4rem; }
    .game-desc { font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5; margin: 0; }

    .round-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; padding: 0.65rem 1rem; background: rgba(0,0,0,0.02); border-radius: 14px; border: 1px solid rgba(0,0,0,0.05); }
    .round-pills { display: flex; gap: 0.4rem; }
    .round-pill { width: 30px; height: 30px; border-radius: 50%; border: 2px solid rgba(0,0,0,0.1); background: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800; color: var(--text-secondary); transition: all 0.3s; }
    .round-pill.active { background: #1cb0f6; color: #fff; border-color: #1cb0f6; transform: scale(1.15); box-shadow: 0 0 0 4px rgba(28,176,246,0.15); }
    .round-pill.done { background: #58cc02; color: #fff; border-color: #58cc02; }
    .round-label { font-size: 0.78rem; font-weight: 700; color: var(--text-secondary); }

    .game-area { display: flex; flex-direction: column; gap: 1.25rem; }

    .vocab-card { background: #fff; border: 2px solid rgba(0,0,0,0.06); border-radius: 18px; padding: 1.25rem; animation: fadeSlide 0.4s ease both; transition: all 0.3s; }
    .vocab-card.answered { border-color: rgba(88,204,2,0.2); }

    .q-number { font-size: 0.72rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.75rem; }

    .sentence-box { font-size: 0.95rem; line-height: 1.7; color: var(--text-primary); background: rgba(28,176,246,0.04); border-left: 4px solid #1cb0f6; border-radius: 0 12px 12px 0; padding: 0.85rem 1rem; margin-bottom: 0.85rem; font-style: italic; }

    .target-label { font-size: 0.88rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.75rem; }

    .options-grid { display: flex; flex-direction: column; gap: 0.4rem; }
    .option-btn { padding: 0.7rem 0.85rem; border-radius: 10px; border: 2px solid rgba(0,0,0,0.08); background: #fff; font-size: 0.88rem; font-weight: 600; cursor: pointer; transition: all 0.2s; text-align: left; color: var(--text-primary); }
    .option-btn:hover:not(:disabled) { border-color: #1cb0f6; background: rgba(28,176,246,0.04); transform: translateX(3px); }
    .option-btn.selected { border-color: #1cb0f6; background: rgba(28,176,246,0.08); }
    .option-btn.correct { border-color: #58cc02 !important; background: rgba(88,204,2,0.08) !important; color: #16a34a; }
    .option-btn.wrong { border-color: #ef4444 !important; background: rgba(239,68,68,0.06) !important; color: #dc2626; }
    .option-btn:disabled { cursor: default; }
    .opt-key { font-weight: 800; margin-right: 0.3rem; }

    .explanation { margin-top: 0.75rem; padding: 0.65rem 0.85rem; background: rgba(88,204,2,0.06); border: 1px solid rgba(88,204,2,0.15); border-radius: 10px; font-size: 0.82rem; font-weight: 700; color: #16a34a; animation: fadeSlide 0.3s ease; }

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

    .game-finished { text-align: center; padding: 2rem; background: linear-gradient(135deg, rgba(28,176,246,0.06), rgba(88,204,2,0.06)); border: 2px solid rgba(88,204,2,0.15); border-radius: 24px; margin-top: 1.25rem; animation: fadeSlide 0.5s ease; }
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
    .btn-replay:hover { border-color: #1cb0f6; color: #1cb0f6; }
    .btn-finish { background: #58cc02; color: #fff; font-family: var(--font-heading); font-size: 0.9rem; font-weight: 800; padding: 0.7rem 1.25rem; border-radius: 12px; border: none; box-shadow: 0 4px 0 #46a302; cursor: pointer; transition: all 0.2s; }
    .btn-finish:hover { transform: translateY(2px); box-shadow: 0 2px 0 #46a302; }

    @keyframes fadeSlide { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

    @media(max-width:480px) {
      .option-btn { padding: 0.6rem 0.7rem; font-size: 0.82rem; }
      .game-title { font-size: 1.25rem; }
    }
  `]
})
export class VocabularyContextPracticeComponent {
  @Output() onComplete = new EventEmitter<void>();

  rounds = VOCAB_ROUNDS;
  totalItems = VOCAB_ROUNDS.reduce((sum, r) => sum + r.length, 0);

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

  isAnswered(id: number): boolean {
    return this.answers().has(id);
  }

  isRevealed(id: number): boolean {
    return this.revealed().has(id);
  }

  showExplanation(id: number): boolean {
    return this.revealed().has(id);
  }

  selectOption(itemId: number, selectedKey: string, correctKey: string) {
    if (this.revealed().has(itemId)) return;

    const newAnswers = new Map(this.answers());
    newAnswers.set(itemId, selectedKey);
    this.answers.set(newAnswers);

    // Reveal after a short delay
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
