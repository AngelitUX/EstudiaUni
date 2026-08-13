import { Component, inject, signal, computed, OnInit, OnDestroy, HostListener, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PaesContentService } from './services/paes-content.service';
import { KatexService } from '../../core/services/katex.service';
import { ToastService } from '../../core/services/toast.service';


@Component({
  selector: 'app-seccion-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="test-page" [class.boss-mode]="isBossMode()" [class.final-boss-mode]="isFinalBoss()" [class.taking-damage]="takingDamage()" *ngIf="test() as t">
      <!-- TOP BAR -->
      <div class="top-bar" [class.boss-bar]="isBossMode()">
        <button class="btn-close" (click)="confirmExit()" title="Salir">✕</button>
        
        <ng-container *ngIf="!isBossMode()">
          <div class="top-progress">
            <div class="top-progress-fill" [style.width.%]="progressPct()"></div>
          </div>
        </ng-container>

        <ng-container *ngIf="isBossMode()">
          <div class="lives-container">
            <span class="heart" *ngFor="let i of livesArray()" [class.empty]="lives() < i">❤️</span>
          </div>
        </ng-container>

        <div class="top-timer" [class.urgent]="isTimerUrgent()">{{ formatTime(timer()) }}</div>
      </div>

      <!-- CONTEXTO BASE -->
      <div class="context-section" *ngIf="t.contexto_base && !isScienceOrMath() && !isPhysics()">
        <button class="context-toggle" (click)="contextCollapsed = !contextCollapsed">
          <span>📄 Texto de referencia</span>
          <span class="toggle-arrow" [style.transform]="contextCollapsed ? 'rotate(0)' : 'rotate(180deg)'">▼</span>
        </button>
        <div class="context-wrapper" [class.collapsed]="contextCollapsed">
          <div class="context-body">
            <p *ngFor="let p of getFormattedParagraphs(getActiveContexto(t))">
              <span class="p-num" *ngIf="!p.isTitle">[{{ p.number }}]</span>
              <span class="p-text" [class.p-title]="p.isTitle" [innerHTML]="parseMixed(p.text)"></span>
            </p>
          </div>
        </div>
      </div>

      <!-- QUESTION CARD (one at a time) -->
      <div class="question-area">
        <div class="question-counter">
          Pregunta {{ currentIndex() + 1 }} de {{ totalQuestions() }}
        </div>

        <div class="question-card" [class.boss-card]="isBossMode()" [class.split-layout]="isPhysics() && (q.preambulo_imagen_url || q.imageUrl || q.svgContent)" *ngIf="currentQuestion() as q">
          
          <div class="split-left">
          <!-- VOICE CONTROLS (Collapsible for non-biology/physics, Full panel for biology/physics) -->
          <div class="voice-dropdown-container" *ngIf="!isMathModule() && !isBiology() && !isPhysics()">
            <button class="btn-voice-toggle" (click)="voiceMenuOpen = !voiceMenuOpen">
              🎧 Audio descriptivo <span class="arrow" [class.open]="voiceMenuOpen">▼</span>
            </button>
            <div class="voice-dropdown-menu" [class.open]="voiceMenuOpen">
              <button class="btn-voice" *ngIf="t.contexto_base" (click)="readContext()" title="Texto de referencia (Tecla 1)">🔊 1. Texto referencia</button>
              <button class="btn-voice" (click)="readQuestion()" title="Leer enunciado (Tecla 2)">🔊 2. Enunciado</button>
              <button class="btn-voice" (click)="readOptions()" *ngIf="q.tipo_alternativas !== 'imagen'" title="Leer alternativas (Tecla 3)">🔊 3. Alternativas</button>
              <button class="btn-voice" (click)="readFeedback()" *ngIf="showFeedback()" title="Leer explicación (Tecla 5)">🔊 5. Explicación</button>
              <button class="btn-voice btn-stop" (click)="stopReading()" title="Detener lectura (Tecla 4)">⏹️ 4. Detener</button>
            </div>
          </div>

          <!-- NEW A11Y AUDIO PANEL (Only Biology and Physics) -->
          <div class="a11y-mini-panel-container" *ngIf="isBiology() || isPhysics()">
            <button class="btn-a11y-toggle" (click)="shortcutsMenuOpen = !shortcutsMenuOpen" title="Atajos de teclado">
              🎧 Atajos <span class="arrow" [class.open]="shortcutsMenuOpen">▼</span>
            </button>
            <div class="a11y-mini-panel" [class.open]="shortcutsMenuOpen">
              <span class="a11y-shortcut"><b>[P]</b> Leer Pregunta</span>
              <span class="a11y-shortcut"><b>[O]</b> Leer Opciones</span>
              <span class="a11y-shortcut"><b>[I]</b> Detener</span>
              <span class="a11y-shortcut"><b>[1-4]</b> Elegir A-D</span>
              <span class="a11y-shortcut"><b>[Espacio]</b> Comprobar/Continuar</span>
            </div>
          </div>

          <!-- Preámbulo texto (Historia/Ciencias) -->
          <div class="q-preambulo" *ngIf="q.preambulo_texto">
            <span class="preambulo-icon">💬</span>
            <p>{{ q.preambulo_texto }}</p>
          </div>

          <!-- Preámbulo imagen (Ciencias/Matemáticas) -->
          <div class="q-image-wrap" *ngIf="q.preambulo_imagen_url && !isPhysics()">
            <img [src]="q.preambulo_imagen_url" alt="Imagen de apoyo" class="q-image" />
          </div>

          <p class="q-text" [innerHTML]="parseMixed(q.enunciado)"></p>

          <!-- Imagen o gráfico de apoyo (fuera de Física, que usa el panel lateral) -->
          <div class="q-image-wrap" *ngIf="q.imageUrl && !isPhysics()">
            <img [src]="q.imageUrl" alt="Imagen de apoyo" class="q-image" />
          </div>
          <div class="q-svg-wrap" *ngIf="q.svgContent && !isPhysics()" [innerHTML]="renderSvg(q.svgContent)"></div>

          <!-- Fórmula LaTeX (Matemáticas) -->
          <div class="q-formula" *ngIf="q.formula_latex"
            [innerHTML]="renderLatex(q.formula_latex)">
          </div>

          <div class="options-grid">
            <button *ngFor="let key of optionKeys"
              class="option-btn"
              tabindex="0"
              (keydown.enter)="!showFeedback() && selectAnswer(q.id, key)"
              (keydown.space)="!showFeedback() && selectAnswer(q.id, key); $event.preventDefault()"
              [class.selected]="answers().get(q.id) === key && !showFeedback()"
              [class.correct]="showFeedback() && key === q.respuesta_correcta"
              [class.wrong]="showFeedback() && answers().get(q.id) === key && key !== q.respuesta_correcta"
              [disabled]="showFeedback()"
              (click)="selectAnswer(q.id, key)">
              <span class="opt-letter" [class.sel]="answers().get(q.id) === key && !showFeedback()">{{ key }}</span>
              <span class="opt-text" *ngIf="q.tipo_alternativas !== 'imagen'" [innerHTML]="parseMixed(q.alternativas[key])"></span>
              <img *ngIf="q.tipo_alternativas === 'imagen'" [src]="q.alternativas[key]"
                alt="Opción {{ key }}" class="opt-img" />
            </button>
          </div>

            <!-- FEEDBACK -->
            <div class="feedback-bar" *ngIf="showFeedback()"
              [class.correct]="isCurrentCorrect()"
              [class.wrong]="!isCurrentCorrect()">
              <div class="feedback-icon">{{ isCurrentCorrect() ? '✅' : '❌' }}</div>
              <div class="feedback-body">
                <strong>{{ isCurrentCorrect() ? '¡Correcto!' : 'Incorrecto' }}</strong>
                <p [innerHTML]="parseMixed(isCurrentCorrect() ? currentQuestion()!.feedback_acierto : currentQuestion()!.feedback_error)"></p>
              </div>
            </div>
          </div> <!-- End split-left -->

          <div class="split-right" *ngIf="isPhysics() && (q.preambulo_imagen_url || q.imageUrl || q.svgContent)">
            <img *ngIf="q.preambulo_imagen_url || q.imageUrl" [src]="q.preambulo_imagen_url || q.imageUrl" alt="Imagen de apoyo de física" class="physics-support-img" />
            <div *ngIf="q.svgContent" class="physics-support-svg" [innerHTML]="renderSvg(q.svgContent)"></div>
          </div>
        </div>
      </div>



      <!-- BOTTOM BAR -->
      <div class="bottom-bar">
        <div>
          <button class="btn-secondary" [disabled]="showFeedback() || currentIndex() === 0" (click)="prevQuestion()">
            ← Anterior
          </button>
        </div>

        <div class="dot-indicators">
          <span *ngFor="let p of shuffledPreguntas(); let i = index"
            class="dot"
            [class.answered]="answers().has(p.id)"
            [class.current]="i === currentIndex()"
            (click)="!showFeedback() && goToQuestion(i)"></span>
        </div>

        <ng-container *ngIf="!showFeedback()">
          <button class="btn-check" [class.btn-attack]="isBossMode()" (click)="checkAnswer()" [disabled]="!hasCurrentAnswer()">
            {{ isBossMode() ? '⚔️ Atacar' : 'Comprobar' }}
          </button>
        </ng-container>
        <ng-container *ngIf="showFeedback()">
          <button class="btn-next" *ngIf="!isLastQuestion()" (click)="nextQuestion()">
            Continuar →
          </button>
          <button class="btn-finish" *ngIf="isLastQuestion()" (click)="submitTest()">
            Ver Resultados 🎉
          </button>
        </ng-container>
      </div>

      <!-- EXIT CONFIRM MODAL -->
      <div class="modal-overlay" *ngIf="showExitConfirm" (click)="showExitConfirm = false">
        <div class="modal-container glass" (click)="$event.stopPropagation()">
          <h3>¿Seguro que quieres salir?</h3>
          <p>Si sales ahora, perderás todo el progreso de esta prueba y tendrás que empezar de nuevo.</p>
          <div class="modal-actions">
            <button class="btn-cancel" (click)="showExitConfirm = false">Cancelar</button>
            <button class="btn-confirm-exit" (click)="executeExit()">Sí, salir</button>
          </div>
        </div>
      </div>

      <!-- GAME OVER MODAL -->
      <div class="modal-overlay" *ngIf="showGameOver">
        <div class="modal-container glass boss-game-over">
          <h3 style="color: #ef4444; font-size: 2rem; margin-bottom: 0;">💀 Game Over 💀</h3>
          <p style="font-size: 1.1rem; margin-top: 0.5rem;">{{ gameOverReason() }}</p>
          <p>Has fallado en tu enfrentamiento contra el Jefe. Debes volver a intentarlo desde el principio.</p>
          <div class="modal-actions" style="margin-top: 1.5rem;">
            <button class="btn-confirm-exit" (click)="executeExit()">Volver a la Ruta</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: #f8f9fa; color: var(--text-primary); }
    .test-page { min-height: 100vh; display: flex; flex-direction: column; position: relative; overflow: hidden; transition: all 0.5s ease; z-index: 1; }

    /* WATERMARK MATH BACKGROUND ORNAMENTS (Light Theme) */
    .math-bg-ornaments { position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 0; }
    .math-sym { position: absolute; font-family: 'Outfit', 'Inter', serif; font-weight: 800; color: rgba(0, 0, 0, 0.015); font-size: 5rem; user-select: none; transition: color 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
    
    /* DYNAMIC LEVEL WATERMARKS */
    .level-1 .math-sym { color: rgba(88, 204, 2, 0.035); }
    .level-2 .math-sym { color: rgba(28, 176, 246, 0.035); }
    .level-3 .math-sym { color: rgba(255, 150, 0, 0.035); }
    
    .sym-1 { top: 8%; left: 3%; transform: rotate(-15deg); font-size: 6.5rem; }
    .sym-2 { top: 12%; right: 5%; transform: rotate(12deg); font-size: 7rem; }
    .sym-3 { bottom: 15%; left: 4%; transform: rotate(25deg); font-size: 6rem; }
    .sym-4 { bottom: 18%; right: 4%; transform: rotate(-18deg); font-size: 6.5rem; }
    .sym-5 { top: 42%; left: 85%; transform: rotate(35deg); font-size: 7.5rem; }
    .sym-6 { bottom: 8%; left: 40%; transform: rotate(-10deg); font-size: 5.5rem; }

    /* PREMIUM DYNAMIC LIGHT MATH GRID BACKGROUND */
    .test-page.level-1 {
      background-color: #fafdf7;
      background-image: radial-gradient(circle at 5% 5%, rgba(88, 204, 2, 0.04) 0%, transparent 60%),
                        linear-gradient(rgba(0,0,0,0.012) 1px, transparent 1px), 
                        linear-gradient(90deg, rgba(0,0,0,0.012) 1px, transparent 1px);
      background-size: 100% 100%, 20px 20px, 20px 20px;
    }
    .test-page.level-2 {
      background-color: #f7fbfe;
      background-image: radial-gradient(circle at 5% 5%, rgba(28, 176, 246, 0.04) 0%, transparent 60%),
                        linear-gradient(rgba(0,0,0,0.012) 1px, transparent 1px), 
                        linear-gradient(90deg, rgba(0,0,0,0.012) 1px, transparent 1px);
      background-size: 100% 100%, 20px 20px, 20px 20px;
    }
    .test-page.level-3 {
      background-color: #fefbf7;
      background-image: radial-gradient(circle at 5% 5%, rgba(255, 150, 0, 0.045) 0%, transparent 60%),
                        linear-gradient(rgba(0,0,0,0.012) 1px, transparent 1px), 
                        linear-gradient(90deg, rgba(0,0,0,0.012) 1px, transparent 1px);
      background-size: 100% 100%, 20px 20px, 20px 20px;
    }

    /* TOP BAR */
    .top-bar { position: sticky; top: 0; z-index: 50; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.85rem 1.5rem; background: #fff; border-bottom: 2px solid rgba(0,0,0,0.06); transition: all 0.3s ease; }
    
    /* BOSS MODE LIGHT UI */
    .boss-bar { background: linear-gradient(to right, #fff, #fff0f0, #fff); border-bottom: 3px solid #ef4444; }
    .boss-bar .top-timer { color: #dc2626; font-size: 1.1rem; }
    
    .question-card { transition: all 0.3s ease; }
    .question-card.boss-card { border: 3px solid #ef4444; box-shadow: 0 10px 40px rgba(239, 68, 68, 0.12); position: relative; overflow: hidden; }
    .question-card.boss-card.final-boss { border-color: #ff3300; }

    /* SPLIT LAYOUT PARA FÍSICA */
    .question-card.split-layout { display: flex; flex-direction: row; gap: 2rem; align-items: stretch; max-width: 1200px; padding: 0; overflow: hidden; }
    .question-card.split-layout .split-left { flex: 1; padding: 2rem 2rem 2rem 3.5rem; display: flex; flex-direction: column; }
    .question-card.split-layout .split-right { flex: 1; background: #f0f4f8; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 400px; padding: 1rem; border-left: 2px dashed rgba(0,0,0,0.08); }
    .physics-support-img { max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
    .physics-support-svg { width: 100%; display: flex; align-items: center; justify-content: center; }
    .physics-support-svg svg { max-width: 100%; height: auto; }

    @media (max-width: 900px) {
      .question-card.split-layout { flex-direction: column-reverse; }
      .question-card.split-layout .split-right { border-left: none; border-bottom: 2px dashed rgba(0,0,0,0.08); min-height: 250px; }
    }

    @keyframes fireGlow {
      0% { box-shadow: 0 0 15px rgba(255, 51, 0, 0.4), 0 0 30px rgba(255, 174, 0, 0.2); }
      50% { box-shadow: 0 0 25px rgba(255, 51, 0, 0.7), 0 0 50px rgba(255, 174, 0, 0.4); }
      100% { box-shadow: 0 0 15px rgba(255, 51, 0, 0.4), 0 0 30px rgba(255, 174, 0, 0.2); }
    }

    /* FINAL BOSS SUPREMO UI */
    .test-page.final-boss-mode { background: #050505; }
    .test-page.final-boss-mode .question-card.split-layout .split-right { background: transparent; border-color: rgba(255, 51, 0, 0.3); }
    .test-page.final-boss-mode .top-bar { background: linear-gradient(to right, #000, #1a0800, #000); border-bottom: 3px solid #ff3300; color: #fff; }
    .test-page.final-boss-mode .top-title, .test-page.final-boss-mode .top-timer, .test-page.final-boss-mode .lives-count { color: #ffae00; }
    .test-page.final-boss-mode .question-card { background: #111; border: 3px solid #ff3300; animation: fireGlow 2s infinite alternate, slideUp 0.35s ease-out; }
    .test-page.final-boss-mode .q-text, .test-page.final-boss-mode .opt-text { color: #eee; }
    .test-page.final-boss-mode .q-preambulo { background: rgba(255, 174, 0, 0.05); border-left-color: #ffae00; }
    .test-page.final-boss-mode .q-preambulo p { color: #ccc; }
    .test-page.final-boss-mode .option-btn { background: #1a1a1a; border-color: #333; }
    .test-page.final-boss-mode .option-btn:hover:not(:disabled):not(.selected) { border-color: rgba(255, 51, 0, 0.5); background: rgba(255, 51, 0, 0.15); }
    .test-page.final-boss-mode .option-btn.selected { border-color: #ffae00; background: rgba(255, 174, 0, 0.15); box-shadow: 0 0 0 3px rgba(255, 174, 0, 0.2); }
    .test-page.final-boss-mode .btn-check, .test-page.final-boss-mode .btn-attack { background: linear-gradient(135deg, #ff3300, #991a00); box-shadow: 0 5px 0 #661100; border: none; }
    .test-page.final-boss-mode .btn-check:hover, .test-page.final-boss-mode .btn-attack:hover:not(:disabled) { transform: translateY(3px); box-shadow: 0 2px 0 #661100; }
    .test-page.final-boss-mode .question-counter { color: #ffae00; }
    
    .test-page.final-boss-mode .bottom-bar { background: #111; border-top-color: #333; }
    .test-page.final-boss-mode .btn-secondary { background: #1a1a1a; border-color: #333; color: #aaa; }
    .test-page.final-boss-mode .btn-secondary:hover:not(:disabled) { border-color: #ffae00; color: #ffae00; }
    .test-page.final-boss-mode .dot { background: #333; }
    .test-page.final-boss-mode .dot.answered { background: #ff3300; }
    .test-page.final-boss-mode .dot.current { background: #ffae00; box-shadow: 0 0 0 3px rgba(255, 174, 0, 0.3); }
    
    .test-page.final-boss-mode .feedback-bar { background: #1a1a1a; border-color: #333; }
    .test-page.final-boss-mode .feedback-bar.correct { background: rgba(88,204,2,0.15); border-color: #58cc02; }
    .test-page.final-boss-mode .feedback-bar.wrong { background: rgba(239,68,68,0.15); border-color: #ef4444; }
    .test-page.final-boss-mode .feedback-body p { color: #ccc; }
    
    .test-page.final-boss-mode .context-section { background: #111; border-color: #333; }
    .test-page.final-boss-mode .context-toggle { color: #eee; }
    .test-page.final-boss-mode .context-toggle:hover { background: rgba(255, 174, 0, 0.1); }
    .test-page.final-boss-mode .context-body p { color: #ccc; }
    .test-page.final-boss-mode .p-text { color: #ccc; }
    ::ng-deep .test-page.final-boss-mode .p-text strong, ::ng-deep .test-page.final-boss-mode .p-text b, ::ng-deep .test-page.final-boss-mode .p-text .katex { color: #ffae00; }
    
    .btn-close { width: 36px; height: 36px; border-radius: 50%; border: 2px solid rgba(0,0,0,0.1); background: transparent; color: var(--text-secondary); font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0; }
    .btn-close:hover { border-color: #ef4444; color: #ef4444; background: rgba(239,68,68,0.05); }
    .top-progress { flex: 1; height: 14px; background: rgba(0,0,0,0.06); border-radius: 99px; overflow: hidden; margin: 0 1rem; }
    .top-progress-fill { height: 100%; background: linear-gradient(90deg, #58cc02, #78d64b); border-radius: 99px; transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1); position: relative; }
    .top-progress-fill::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(255,255,255,0.35) 0%, transparent 60%); border-radius: 99px; }
    .top-timer { font-family: var(--font-heading); font-weight: 700; font-size: 0.9rem; color: var(--text-secondary); min-width: 52px; text-align: center; }
    .top-timer.urgent { color: #ef4444; animation: urgentPulse 1s ease-in-out infinite; }
    
    .lives-container { flex: 1; display: flex; justify-content: center; gap: 0.5rem; font-size: 1.6rem; }
    .heart { transition: all 0.3s; filter: drop-shadow(0 2px 4px rgba(239,68,68,0.4)); animation: pulseHeart 1.5s infinite alternate ease-in-out; display: inline-block; }
    .heart.empty { filter: grayscale(100%) opacity(0.3); transform: scale(0.8); animation: none; }

    /* CONTEXT MODULE */
    .physics-bottom-context { margin-top: 1.5rem; margin-bottom: 0.5rem; border: 2px dashed rgba(133,92,214,0.4); }
    .physics-context-btn { background: rgba(133,92,214,0.08); color: var(--accent-primary); font-size: 0.95rem; font-weight: 700; transition: all 0.3s; animation: pulseHint 2s infinite alternate ease-in-out; }
    .physics-context-btn:hover { background: rgba(133,92,214,0.15); transform: translateY(-1px); }
    @keyframes pulseHint { 0% { box-shadow: 0 0 0 0 rgba(133,92,214, 0.4); } 100% { box-shadow: 0 0 10px 2px rgba(133,92,214, 0.1); } }
    .context-section { background: #fff; border: 2px solid rgba(0,0,0,0.06); border-radius: 14px; overflow: hidden; }
    .context-toggle { display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 0.85rem 1.15rem; background: transparent; border: none; font-size: 0.88rem; font-weight: 600; color: var(--text-primary); cursor: pointer; transition: background 0.2s; }
    .context-toggle:hover { background: rgba(0,0,0,0.02); }
    .toggle-arrow { font-size: 0.75rem; color: var(--text-secondary); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
    .context-wrapper { display: grid; grid-template-rows: 1fr; transition: grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
    .context-wrapper.collapsed { grid-template-rows: 0fr; }
    .context-body { overflow: hidden; padding: 0 1.15rem 1rem; }
    .context-body p { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.7; margin: 0 0 0.85rem; font-style: italic; display: flex; gap: 0.5rem; align-items: flex-start; }
    .p-num { font-weight: 800; color: #b8b8b8; font-size: 0.85rem; user-select: none; min-width: 1.5rem; }
    .p-text { color: var(--text-secondary); font-size: 1rem; font-family: 'Helvetica', 'Arial', sans-serif; }
    ::ng-deep .p-text strong, ::ng-deep .p-text b { color: #000; font-weight: bold; }
    ::ng-deep .p-text .katex { color: #000; font-weight: bold; }
    .p-text.p-title { font-family: var(--font-heading); font-size: 1.05rem; font-weight: 800; color: var(--accent-primary); font-style: normal; margin-top: 0.75rem; margin-bottom: 0.35rem; display: block; border-bottom: 2px solid rgba(133,92,214,0.15); padding-bottom: 0.35rem; }
    .context-wrapper.collapsed .context-body { padding-top: 0; padding-bottom: 0; opacity: 0; transition: opacity 0.2s, padding 0.3s; }
    .context-wrapper:not(.collapsed) .context-body { opacity: 1; transition: opacity 0.3s 0.1s, padding 0.3s; }

    /* QUESTION AREA */
    .question-area { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 1.5rem; }
    .question-counter { font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 1rem; }

    .question-card {
      background: #fff;
      border: 2px solid rgba(0,0,0,0.06);
      border-radius: 20px;
      padding: 2.25rem 2.25rem 2.25rem 3.5rem; /* extra padding for notebook spirals */
      max-width: 850px;
      width: 100%;
      animation: slideUp 0.35s ease-out;
      position: relative;
      z-index: 10;
      box-shadow: 0 10px 25px rgba(0,0,0,0.03);
      transition: all 0.4s ease;
    }

    /* RED MARGIN LINE OF A NOTEBOOK */
    .question-card::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 2.5rem;
      width: 2px;
      background: rgba(239, 68, 68, 0.25);
    }

    /* NOTEBOOK SPIRAL RINGS */
    .question-card::after {
      content: '••••••••••••••••••••';
      position: absolute;
      top: 15px;
      left: 6px;
      bottom: 15px;
      width: 16px;
      color: #94a3b8;
      font-size: 1.8rem;
      line-height: 2.2rem;
      letter-spacing: 0.18rem;
      writing-mode: vertical-rl;
      overflow: hidden;
      opacity: 0.5;
      user-select: none;
      pointer-events: none;
    }

    /* LEVEL THEMED BORDERS */
    .level-1 .question-card { border-color: rgba(88, 204, 2, 0.15); border-left: 5px solid #58cc02; }
    .level-2 .question-card { border-color: rgba(28, 176, 246, 0.15); border-left: 5px solid #1cb0f6; }
    .level-3 .question-card { border-color: rgba(255, 150, 0, 0.15); border-left: 5px solid #ff9600; }
    .q-text { font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; color: var(--text-primary); line-height: 1.5; margin: 0 0 1.5rem; }

    .q-image-wrap { margin: 0 0 1.5rem; text-align: center; background: #f8f9fa; border-radius: 12px; padding: 1rem; border: 1px solid rgba(0,0,0,0.05); }
    .q-image { max-width: 100%; max-height: 250px; object-fit: contain; border-radius: 8px; }
    .q-svg-wrap { margin: 0 0 1.5rem; text-align: center; background: #f8f9fa; border-radius: 12px; padding: 1rem; border: 1px solid rgba(0,0,0,0.05); display: flex; justify-content: center; }
    .q-svg-wrap svg { max-width: 100%; height: auto; max-height: 320px; }

    /* PREAMBULO */
    .q-preambulo { display: flex; gap: 0.8rem; padding: 1.25rem; margin: 0 0 1.5rem; background: rgba(133,92,214,0.04); border-radius: 12px; border-left: 4px solid rgba(133,92,214,0.4); }
    .q-preambulo p { font-size: 1.05rem; color: var(--text-secondary); line-height: 1.7; margin: 0; font-style: italic; }
    .preambulo-icon { font-size: 1.1rem; flex-shrink: 0; }

    /* FORMULA */
    .q-formula { margin: 0 0 1.25rem; padding: 0.75rem 1rem; background: #f0fdf4; border: 1px solid rgba(22,163,74,0.15); border-radius: 10px; text-align: center; }
    .q-formula code { font-family: 'Courier New', monospace; font-size: 1rem; color: #166534; font-weight: 600; }

    /* IMAGE OPTIONS */
    .opt-img { max-width: 100%; max-height: 80px; object-fit: contain; border-radius: 6px; }

    /* OPTIONS */
    .options-grid { display: flex; flex-direction: column; gap: 0.8rem; }
    .option-btn { display: flex; align-items: center; gap: 1rem; padding: 1.15rem 1.25rem; border: 2px solid rgba(0,0,0,0.08); border-radius: 14px; background: #fff; cursor: pointer; transition: all 0.2s; text-align: left; width: 100%; }
    .option-btn:hover:not(:disabled):not(.selected) { border-color: rgba(133,92,214,0.3); background: rgba(133,92,214,0.03); transform: translateX(4px); }
    .option-btn.selected { border-color: var(--accent-primary); background: rgba(133,92,214,0.06); box-shadow: 0 0 0 3px rgba(133,92,214,0.12); }
    .option-btn.correct { border-color: #58cc02; background: rgba(88,204,2,0.08); box-shadow: 0 0 0 3px rgba(88,204,2,0.15); }
    .option-btn.wrong { border-color: #ef4444; background: rgba(239,68,68,0.06); box-shadow: 0 0 0 3px rgba(239,68,68,0.12); }
    .opt-letter { width: 36px; height: 36px; border-radius: 8px; border: 2px solid rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; font-family: var(--font-heading); font-weight: 800; font-size: 0.95rem; color: var(--text-secondary); flex-shrink: 0; transition: all 0.2s; }
    .opt-letter.sel { background: var(--accent-primary); border-color: var(--accent-primary); color: #fff; }
    .option-btn.correct .opt-letter { background: #58cc02; border-color: #58cc02; color: #fff; }
    .option-btn.wrong .opt-letter { background: #ef4444; border-color: #ef4444; color: #fff; }
    .opt-text { font-size: 1.05rem; color: var(--text-primary); line-height: 1.5; }

    /* FEEDBACK */
    .feedback-bar { display: flex; align-items: flex-start; gap: 0.85rem; padding: 1.15rem; border-radius: 14px; margin-top: 1.25rem; animation: slideUp 0.3s ease-out; }
    .feedback-bar.correct { background: rgba(88,204,2,0.08); border: 1px solid rgba(88,204,2,0.2); }
    .feedback-bar.wrong { background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.15); }
    .feedback-icon { font-size: 1.4rem; flex-shrink: 0; margin-top: 0.1rem; }
    .feedback-body strong { display: block; font-family: var(--font-heading); font-size: 0.95rem; margin-bottom: 0.3rem; }
    .feedback-bar.correct strong { color: #3d8c00; }
    .feedback-bar.wrong strong { color: #dc2626; }
    .feedback-body p { font-size: 0.85rem; color: var(--text-secondary); margin: 0; line-height: 1.5; }

    /* BOTTOM BAR */
    .bottom-bar { position: sticky; bottom: 0; display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 0.85rem 1.5rem; background: #fff; border-top: 2px solid rgba(0,0,0,0.06); z-index: 50; }
    .btn-secondary { padding: 0.7rem 1.2rem; border-radius: 12px; border: 2px solid rgba(0,0,0,0.08); background: #fff; color: var(--text-secondary); font-weight: 700; font-size: 0.88rem; cursor: pointer; transition: all 0.2s; }
    .btn-secondary:hover:not(:disabled) { border-color: var(--accent-primary); color: var(--accent-primary); }
    .btn-secondary:disabled { opacity: 0.3; cursor: not-allowed; }
    .dot-indicators { display: flex; gap: 6px; }
    .dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(0,0,0,0.1); cursor: pointer; transition: all 0.2s; }
    .dot.answered { background: var(--accent-primary); }
    .dot.current { background: var(--accent-primary); transform: scale(1.3); box-shadow: 0 0 0 3px rgba(133,92,214,0.2); }
    .btn-check { padding: 0.75rem 1.5rem; border-radius: 12px; border: none; background: var(--accent-primary); color: #fff; font-weight: 700; font-size: 0.95rem; cursor: pointer; box-shadow: 0 4px 0 #6b46b8; transition: all 0.2s; }
    .btn-check:hover:not(:disabled) { transform: translateY(2px); box-shadow: 0 2px 0 #6b46b8; }
    .btn-check:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
    
    .btn-attack { background: linear-gradient(135deg, #ef4444, #dc2626); box-shadow: 0 4px 0 #991b1b; text-transform: uppercase; letter-spacing: 1px; }
    .btn-attack:hover:not(:disabled) { box-shadow: 0 2px 0 #991b1b; }

    .btn-next { padding: 0.75rem 1.5rem; border-radius: 12px; border: none; background: #58cc02; color: #fff; font-weight: 700; font-size: 0.95rem; cursor: pointer; box-shadow: 0 4px 0 #4caf00; transition: all 0.2s; }
    .btn-next:hover { transform: translateY(2px); box-shadow: 0 2px 0 #4caf00; }
    .btn-finish { padding: 0.75rem 1.5rem; border-radius: 12px; border: none; background: linear-gradient(135deg, #ffc800, #ff9600); color: #fff; font-weight: 700; font-size: 0.95rem; cursor: pointer; box-shadow: 0 4px 0 #cc7a00; transition: all 0.2s; }
    .btn-finish:hover { transform: translateY(2px); box-shadow: 0 2px 0 #cc7a00; }

    /* VOICE CONTROLS */
    .voice-dropdown-container { margin-bottom: 1.5rem; }
    .btn-voice-toggle { display: flex; align-items: center; gap: 0.5rem; background: rgba(133,92,214,0.08); border: 2px solid rgba(133,92,214,0.2); color: var(--accent-primary); border-radius: 8px; padding: 0.45rem 0.8rem; font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
    .btn-voice-toggle:hover { background: rgba(133,92,214,0.15); }
    .btn-voice-toggle .arrow { font-size: 0.7rem; transition: transform 0.2s; }
    .btn-voice-toggle .arrow.open { transform: rotate(180deg); }
    .voice-dropdown-menu { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem; max-height: 0; opacity: 0; overflow: hidden; transition: all 0.3s ease-in-out; }
    .voice-dropdown-menu.open { max-height: 100px; opacity: 1; }
    .btn-voice { background: #fff; border: 1px solid rgba(133,92,214,0.3); color: var(--accent-primary); border-radius: 8px; padding: 0.4rem 0.7rem; font-size: 0.8rem; font-weight: 700; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
    .btn-voice:hover { background: var(--accent-primary); color: #fff; border-color: var(--accent-primary); transform: translateY(-1px); box-shadow: 0 2px 4px rgba(133,92,214,0.2); }
    .btn-stop { background: #fff; border-color: rgba(239,68,68,0.3); color: #ef4444; }
    .btn-stop:hover { background: #ef4444; color: #fff; border-color: #ef4444; }

    /* A11Y MINI PANEL (Biology) */
    .a11y-mini-panel-container { margin-bottom: 1rem; display: flex; flex-direction: column; align-items: flex-start; }
    .btn-a11y-toggle { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(133,92,214,0.08); border: 2px solid rgba(133,92,214,0.2); color: var(--accent-primary); border-radius: 8px; padding: 0.35rem 0.65rem; font-size: 0.75rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
    .btn-a11y-toggle:hover { background: rgba(133,92,214,0.15); }
    .btn-a11y-toggle .arrow { font-size: 0.6rem; transition: transform 0.2s; }
    .btn-a11y-toggle .arrow.open { transform: rotate(180deg); }
    
    .a11y-mini-panel { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; background: rgba(133,92,214,0.05); border-radius: 8px; padding: 0; max-height: 0; opacity: 0; overflow: hidden; transition: all 0.3s ease-in-out; border: 0px solid rgba(133,92,214,0.15); }
    .a11y-mini-panel.open { max-height: 100px; opacity: 1; padding: 0.65rem 0.85rem; border-width: 1px; margin-top: 0.5rem; }
    .a11y-shortcut { font-size: 0.75rem; color: var(--text-secondary); background: #fff; padding: 0.2rem 0.5rem; border-radius: 4px; border: 1px solid rgba(0,0,0,0.05); }
    .a11y-shortcut b { color: var(--text-primary); font-family: monospace; }

    /* FOCUS ACCESSIBILITY */
    .option-btn:focus-visible, .btn-check:focus-visible, .btn-next:focus-visible, .btn-finish:focus-visible, .btn-secondary:focus-visible {
      outline: none;
      box-shadow: 0 0 0 4px rgba(133,92,214,0.4) !important;
      border-color: var(--accent-primary) !important;
    }

    /* MODAL EXIT */
    .modal-overlay { position: fixed; inset: 0; z-index: 9000; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.55); backdrop-filter: blur(8px); animation: fadeOverlay 0.2s ease; }
    .modal-container { width: min(400px, 90vw); background: #fff; border-radius: 16px; padding: 1.5rem; text-align: center; border: 2px solid rgba(0,0,0,0.08); box-shadow: 0 10px 25px rgba(0,0,0,0.15); animation: scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
    .modal-container h3 { margin: 0 0 0.5rem; font-size: 1.25rem; color: var(--text-primary); font-family: var(--font-heading); }
    .modal-container p { margin: 0 0 1.5rem; color: var(--text-secondary); font-size: 0.95rem; line-height: 1.5; }
    .modal-actions { display: flex; gap: 0.75rem; justify-content: stretch; }
    .modal-actions button { flex: 1; padding: 0.75rem; border-radius: 10px; font-weight: 700; font-size: 0.95rem; cursor: pointer; transition: all 0.2s; border: none; }
    .btn-cancel { background: rgba(0,0,0,0.06); color: var(--text-primary); }
    .btn-cancel:hover { background: rgba(0,0,0,0.1); }
    .btn-confirm-exit { background: #ef4444; color: #fff; box-shadow: 0 4px 0 #b91c1c; }
    .btn-confirm-exit:hover { transform: translateY(2px); box-shadow: 0 2px 0 #b91c1c; }
    
    .boss-game-over { border-color: #ef4444; background: #fff0f0; }

    @keyframes fadeOverlay { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes urgentPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    @keyframes pulseHeart { 0% { transform: scale(1); } 100% { transform: scale(1.15); } }
    
    /* DAMAGE ANIMATION */
    .test-page.taking-damage { animation: damageShake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both; position: relative; }
    .test-page.taking-damage::after { content: ''; position: fixed; inset: 0; box-shadow: inset 0 0 50px rgba(239, 68, 68, 0.8); z-index: 9999; pointer-events: none; }
    @keyframes damageShake {
      10%, 90% { transform: translate3d(-2px, 0, 0); }
      20%, 80% { transform: translate3d(4px, 0, 0); }
      30%, 50%, 70% { transform: translate3d(-6px, 0, 0); }
      40%, 60% { transform: translate3d(6px, 0, 0); }
    }

    .level-badge { padding: 0.25rem 0.65rem; border-radius: 99px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; display: inline-block; vertical-align: middle; }
    .level-badge.lvl-1 { background: rgba(88,204,2,0.12); color: #58cc02; border: 1px solid rgba(88,204,2,0.2); }
    .level-badge.lvl-2 { background: rgba(28,176,246,0.12); color: #1cb0f6; border: 1px solid rgba(28,176,246,0.2); }
    .level-badge.lvl-3 { background: rgba(255,200,0,0.12); color: #ff9600; border: 1px solid rgba(255,200,0,0.2); }
    
    .dot.dot-lvl-1.current { box-shadow: 0 0 0 3px rgba(88,204,2,0.25); background: #58cc02; }
    .dot.dot-lvl-2.current { box-shadow: 0 0 0 3px rgba(28,176,246,0.25); background: #1cb0f6; }
    .dot.dot-lvl-3.current { box-shadow: 0 0 0 3px rgba(255,200,0,0.25); background: #ff9600; }

    /* DYNAMIC BUTTON & DOT COLORS */
    .level-1 .btn-check { background: #58cc02; box-shadow: 0 4px 0 #46a302; }
    .level-1 .btn-check:hover:not(:disabled) { box-shadow: 0 2px 0 #46a302; }
    
    .level-2 .btn-check { background: #1cb0f6; box-shadow: 0 4px 0 #0d8ecf; }
    .level-2 .btn-check:hover:not(:disabled) { box-shadow: 0 2px 0 #0d8ecf; }
    
    .level-3 .btn-check { background: #ff9600; box-shadow: 0 4px 0 #cc7a00; }
    .level-3 .btn-check:hover:not(:disabled) { box-shadow: 0 2px 0 #cc7a00; }

    /* DYNAMIC SELECTION HIGHLIGHTS */
    .level-1 .option-btn.selected { border-color: #58cc02; background: rgba(88,204,2,0.04); box-shadow: 0 0 0 3px rgba(88,204,2,0.1); }
    .level-1 .opt-letter.sel { background: #58cc02; border-color: #58cc02; color: #fff; }

    .level-2 .option-btn.selected { border-color: #1cb0f6; background: rgba(28,176,246,0.04); box-shadow: 0 0 0 3px rgba(28,176,246,0.1); }
    .level-2 .opt-letter.sel { background: #1cb0f6; border-color: #1cb0f6; color: #fff; }

    .level-3 .option-btn.selected { border-color: #ff9600; background: rgba(255,150,0,0.04); box-shadow: 0 0 0 3px rgba(255,150,0,0.1); }
    .level-3 .opt-letter.sel { background: #ff9600; border-color: #ff9600; color: #fff; }

    @media (max-width: 640px) {
      .question-card { padding: 1.5rem 1.5rem 1.5rem 2.5rem; }
      .question-card::before { left: 1.75rem; }
      .question-card::after { display: none; }
      .q-text { font-size: 1rem; }
      .bottom-bar { padding: 0.75rem 1rem; }
      .dot-indicators { gap: 4px; }
      .dot { width: 8px; height: 8px; }
    }
  `]
})
export class SeccionTestComponent implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private paes = inject(PaesContentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private katex = inject(KatexService);
  private sanitizer = inject(DomSanitizer);
  private toastSvc = inject(ToastService);

  optionKeys: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];

  seccionId = signal('');
  seccion = computed(() => this.paes.getSeccionById(this.seccionId()));
  test = computed(() => this.paes.getTestBySeccionId(this.seccionId()));
  shuffledPreguntas = signal<any[]>([]);

  answers = signal(new Map<number, 'A' | 'B' | 'C' | 'D'>());
  timer = signal(0);
  private intervalId: any;

  currentIndex = signal(0);
  showFeedback = signal(false);
  contextCollapsed = false;

  togglePhysicsContext(event: Event) {
    this.contextCollapsed = !this.contextCollapsed;
    if (!this.contextCollapsed) {
      setTimeout(() => {
        const btn = event.currentTarget as HTMLElement;
        btn.parentElement?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
    }
  }

  voiceMenuOpen = false;
  shortcutsMenuOpen = false;
  showExitConfirm = false;
  showGameOver = false;
  gameOverReason = signal('');

  materiaId = computed(() => this.seccion()?.materiaId || '');

  isBiology = computed(() => {
    const id = this.materiaId().toLowerCase();
    return id.includes('biologia');
  });

  isPhysics = computed(() => {
    const id = this.materiaId().toLowerCase();
    return id.includes('fisica');
  });

  isBossMode = computed(() => {
    const s = this.seccion();
    if (!s) return false;
    return s.id.includes('boss') || (s.title && s.title.toLowerCase().includes('jefe'));
  });

  isFinalBoss = computed(() => {
    const s = this.seccion();
    if (!s) return false;
    return s.id === 'jefe-final' || s.id.includes('jefe-final') || s.id === 'boss-mecanica' || s.id.includes('boss-final');
  });

  lives = signal(3);
  takingDamage = signal(false);

  isTimerUrgent = computed(() => {
    if (this.isBossMode()) return this.timer() <= 60; // Less than 60s left
    return this.timer() >= 300; // More than 5 mins elapsed
  });

  isMathModule = computed(() => {
    const mId = this.materiaId();
    return mId ? mId.toLowerCase().includes('mat') : false;
  });

  isScienceOrMath = computed(() => {
    const id = this.materiaId().toLowerCase();
    return id.includes('mat') || id.includes('ciencias') || id.includes('fisica');
  });

  maxLives = computed(() => this.isFinalBoss() ? 5 : 3);
  livesArray = computed(() => Array.from({ length: this.maxLives() }, (_, i) => i + 1));

  currentQuestion = computed(() => {
    const qList = this.shuffledPreguntas();
    return qList.length > 0 ? qList[this.currentIndex()] : undefined;
  });

  totalQuestions = computed(() => this.shuffledPreguntas().length || 0);
  answeredCount = computed(() => this.answers().size);

  progressPct = computed(() => {
    const t = this.totalQuestions();
    return t > 0 ? Math.round(((this.currentIndex() + (this.showFeedback() ? 1 : 0)) / t) * 100) : 0;
  });

  private getStorageKey(): string {
    return `paes_test_state_${this.seccionId()}`;
  }

  private saveState() {
    if (!isPlatformBrowser(this.platformId)) return;
    const state = {
      answers: Array.from(this.answers().entries()),
      currentIndex: this.currentIndex(),
      showFeedback: this.showFeedback(),
      timer: this.timer(),
      lives: this.lives(),
      questionOrder: this.shuffledPreguntas().map(q => q.id)
    };
    sessionStorage.setItem(this.getStorageKey(), JSON.stringify(state));
  }

  private loadState() {
    if (!isPlatformBrowser(this.platformId)) return;
    const saved = sessionStorage.getItem(this.getStorageKey());
    if (saved) {
      try {
        const state = JSON.parse(saved);
        if (state.answers) {
          this.answers.set(new Map(state.answers));
        }
        if (typeof state.currentIndex === 'number') {
          this.currentIndex.set(state.currentIndex);
        }
        if (typeof state.showFeedback === 'boolean') {
          this.showFeedback.set(state.showFeedback);
        }
        if (typeof state.timer === 'number') {
          this.timer.set(state.timer);
        }
        if (typeof state.lives === 'number') {
          this.lives.set(state.lives);
        }
        return state.questionOrder; // return saved order if exists
      } catch (e) {
        console.warn('Error loading test state', e);
      }
    }
    return null;
  }

  constructor() {
    this.route.paramMap.subscribe(params => {
      this.seccionId.set(params.get('seccionId') || '');
      this.loadState();
    });

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Forzar carga asíncrona de voces inmediatamente
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }

  ngOnInit() {
    this.loadTest();
  }

  loadTest() {
    this.showFeedback.set(false);
    this.contextCollapsed = this.materiaId().includes('fisica');

    const savedOrder = this.loadState();

    // Inicializar y mezclar preguntas
    const t = this.test();
    if (t && t.preguntas) {
      if (savedOrder && Array.isArray(savedOrder) && savedOrder.length === t.preguntas.length) {
        // Restaurar orden guardado
        const reordered = savedOrder.map(id => t.preguntas.find((p: any) => p.id === id)).filter(Boolean);
        this.shuffledPreguntas.set(reordered);
      } else {
        // Mezclar aleatoriamente pero por bloques de dificultad
        const arr = [...t.preguntas];
        const chunkSize = Math.ceil(arr.length / 3);
        const easy = arr.slice(0, chunkSize);
        const medium = arr.slice(chunkSize, chunkSize * 2);
        const hard = arr.slice(chunkSize * 2);

        const shuffle = (array: any[]) => {
          for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
          }
          return array;
        };

        const finalArr = [...shuffle(easy), ...shuffle(medium), ...shuffle(hard)];
        this.shuffledPreguntas.set(finalArr);
        this.saveState(); // Guardar el nuevo orden
      }
    }

    if (!savedOrder) {
      this.lives.set(this.isFinalBoss() ? 5 : 3);
    }

    if (this.timer() === 0) {
      if (this.isBossMode()) {
        const qCount = t?.preguntas?.length || 10;
        this.timer.set(qCount * 60); // 1 minuto por pregunta
      } else {
        this.timer.set(0);
      }
    }

    this.intervalId = setInterval(() => {
      if (this.showGameOver) return;

      if (this.isBossMode()) {
        this.timer.update(v => Math.max(0, v - 1));
        if (this.timer() === 0) {
          this.triggerGameOver('¡Se agotó el tiempo!');
        }
      } else {
        this.timer.update(v => v + 1);
      }

      // Guardar el estado cada 5 segundos para que el timer persista bien
      if (this.timer() % 5 === 0) {
        this.saveState();
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.stopReading();
  }

  // ==========================================
  // TEXT TO SPEECH (ACCESSIBILITY)
  // ==========================================
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Solo si no estamos escribiendo en un input (por si acaso)
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;

    const key = event.key.toLowerCase();

    // Audio controls for Biology and Physics
    if (this.isBiology() || this.isPhysics()) {
      if (key === 'p') this.readQuestion();
      if (key === 'o') this.readOptions();
      if (key === 'i') this.stopReading();
    } else if (!this.isMathModule()) {
      if (key === '1') this.readContext();
      if (key === '2') this.readQuestion();
      if (key === '3') this.readOptions();
      if (key === '5') this.readFeedback();
      if (key === '4' || key === 'escape' || key === 's') this.stopReading();
    }
  }

  private selectAnswerForCurrent(option: 'A' | 'B' | 'C' | 'D') {
    const q = this.currentQuestion();
    if (q) {
      this.selectAnswer(q.id, option);
    }
  }

  private cleanHtml(html: string): string {
    if (!html) return '';
    // Elimina las comillas y caracteres extraños
    let text = html.replace(/&quot;/g, '"');
    // Reemplaza los saltos de línea HTML por puntos para que el lector haga pausas
    text = text.replace(/<br\s*\/?>/gi, '. ');
    // Elimina todas las etiquetas HTML
    text = text.replace(/<[^>]*>?/gm, '');
    // Elimina emojis (para que el lector no diga sus nombres)
    text = text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '');
    // Elimina asteriscos de markdown (**negrita**)
    text = text.replace(/\*/g, '');
    return text.trim();
  }

  private getBestVoice(): SpeechSynthesisVoice | null {
    const voices = window.speechSynthesis.getVoices();
    // Prefer natural/neural Spanish voices
    let voice = voices.find(v => v.name.toLowerCase().includes('natural') && v.lang.startsWith('es'));
    if (!voice) voice = voices.find(v => v.name.includes('Google') && v.lang.startsWith('es'));
    // Fallback to Microsoft voices (Windows)
    if (!voice) voice = voices.find(v => v.name.includes('Microsoft') && (v.name.includes('Helena') || v.name.includes('Laura') || v.name.includes('Pablo') || v.name.includes('Sabina')));
    // Fallback to any Spanish voice
    if (!voice) voice = voices.find(v => v.lang.startsWith('es-') || v.lang === 'es');
    return voice || null;
  }

  private speak(text: string) {
    if (!('speechSynthesis' in window)) {
      this.toastSvc.error('Tu navegador no soporta lectura de voz.');
      return;
    }
    window.speechSynthesis.cancel();

    // Si el texto es muy largo, algunos navegadores fallan. Lo ideal sería partirlo, 
    // pero para las alternativas/enunciados esto funciona bien.
    const utterance = new SpeechSynthesisUtterance(text);

    // Mejoras para que suene más natural
    utterance.lang = 'es-ES'; // Default fallback
    utterance.rate = 0.95; // Un poco más lento para mejor dicción
    utterance.pitch = 1.05; // Tono ligeramente más alto suele ser más claro

    const voice = this.getBestVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }

    window.speechSynthesis.speak(utterance);
  }

  readContext() {
    const t = this.test();
    if (!t || !t.contexto_base) return;
    const activeContext = this.getActiveContexto(t);
    const text = this.cleanHtml(activeContext);
    this.speak(text);
  }

  readQuestion() {
    const q = this.currentQuestion();
    if (!q) return;
    let text = this.cleanHtml(q.enunciado);
    if (q.preambulo_texto) {
      text = q.preambulo_texto + '. ' + text;
    }
    this.speak(text);
  }

  readOptions() {
    const q = this.currentQuestion();
    if (!q || q.tipo_alternativas === 'imagen') return;

    let text = '';
    for (const key of this.optionKeys) {
      if (q.alternativas[key]) {
        text += `Opción ${key}: ${this.cleanHtml(q.alternativas[key])}. `;
      }
    }
    this.speak(text);
  }

  readFeedback() {
    if (!this.showFeedback()) return;
    const q = this.currentQuestion();
    if (!q) return;

    const isCorrect = this.isCurrentCorrect();
    const intro = isCorrect ? '¡Correcto! ' : 'Incorrecto. ';
    const text = this.cleanHtml(isCorrect ? q.feedback_acierto : q.feedback_error);

    this.speak(intro + text);
  }

  stopReading() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  selectAnswer(preguntaId: number, option: 'A' | 'B' | 'C' | 'D') {
    if (this.showFeedback()) return;
    const newMap = new Map(this.answers());
    newMap.set(preguntaId, option);
    this.answers.set(newMap);
    this.saveState();
  }

  hasCurrentAnswer(): boolean {
    const q = this.currentQuestion();
    return q ? this.answers().has(q.id) : false;
  }

  isCurrentCorrect(): boolean {
    const q = this.currentQuestion();
    if (!q) return false;
    return this.answers().get(q.id) === q.respuesta_correcta;
  }

  checkAnswer() {
    this.stopReading();
    if (this.isCurrentCorrect()) {
      this.toastSvc.success('¡Respuesta correcta!');
    } else {
      if (this.isBossMode()) {
        this.lives.update(v => v - 1);
        this.takingDamage.set(true);
        setTimeout(() => this.takingDamage.set(false), 400); // 400ms duration for shake

        if (this.lives() <= 0) {
          setTimeout(() => this.triggerGameOver('Has perdido todos tus corazones.'), 500);
          return;
        } else {
          this.toastSvc.error(`Incorrecto. ¡Te quedan ${this.lives()} vidas!`);
        }
      } else {
        this.toastSvc.error('Respuesta incorrecta');
      }
    }
    this.showFeedback.set(true);
    this.saveState();
  }

  triggerGameOver(reason: string) {
    if (this.intervalId) clearInterval(this.intervalId);
    this.gameOverReason.set(reason);
    this.showGameOver = true;
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem(this.getStorageKey()); // Limpiamos para que empiece de cero
    }
  }

  nextQuestion() {
    this.showFeedback.set(false);
    this.shortcutsMenuOpen = false;
    this.currentIndex.update(v => v + 1);
    this.saveState();
  }

  prevQuestion() {
    if (this.currentIndex() > 0 && !this.showFeedback()) {
      this.shortcutsMenuOpen = false;
      this.currentIndex.update(v => v - 1);
      this.saveState();
    }
  }

  goToQuestion(index: number) {
    this.shortcutsMenuOpen = false;
    this.currentIndex.set(index);
    this.saveState();
  }

  isLastQuestion(): boolean {
    return this.currentIndex() === this.totalQuestions() - 1;
  }

  submitTest() {
    if (this.intervalId) clearInterval(this.intervalId);
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem(this.getStorageKey());
    }
    this.paes.submitTest(this.seccionId(), this.answers());
    this.router.navigate(['/test', this.seccionId(), 'review']);
  }

  confirmExit() {
    this.showExitConfirm = true;
  }

  executeExit() {
    this.showExitConfirm = false;
    if (this.intervalId) clearInterval(this.intervalId);
    const cap = this.paes.getCapituloBySeccionId(this.seccionId());
    if (cap) {
      this.router.navigate(['/ruta', cap.materiaId], { fragment: this.seccionId() });
    } else {
      const sec = this.seccion();
      if (sec) {
        this.router.navigate(['/ruta', sec.materiaId], { fragment: this.seccionId() });
      } else {
        this.router.navigate(['/ruta']);
      }
    }
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  getActiveContexto(test: any): string {
    if (!test || !test.contexto_base) return '';
    const q = this.currentQuestion();
    const activeTextIndex = q?.texto_index ?? 0;

    if (test.contexto_base.includes('--- DIVISION_TEXTOS ---')) {
      const textos = test.contexto_base.split('--- DIVISION_TEXTOS ---').map((t: string) => t.trim());
      return textos[activeTextIndex] || textos[0] || '';
    }

    return test.contexto_base;
  }

  getFormattedParagraphs(text: string | null | undefined): { text: string; isTitle: boolean; number?: number }[] {
    if (!text) return [];
    const rawParagraphs = text.split('\n\n')
      .map(p => p.trim())
      .filter(p => p !== '' && p !== '--- DIVISION_TEXTOS ---');

    let paragraphCount = 0;
    return rawParagraphs.map(p => {
      const isTitle = p.startsWith('📖') || p.startsWith('TEXTO') || p.includes('TEXTO I') || p.includes('TEXTO II');
      if (isTitle) {
        paragraphCount = 0;
        return { text: p, isTitle: true };
      } else {
        paragraphCount++;
        return { text: p, isTitle: false, number: paragraphCount };
      }
    });
  }

  getParagraphs(text: string | null | undefined): string[] {
    if (!text) return [];
    return text.split('\n\n').map(p => p.trim()).filter(p => p !== '');
  }

  renderLatex(latex: string | null): SafeHtml {
    if (!latex) return '';
    return this.katex.render(latex);
  }

  parseMixed(text: string | null | undefined): SafeHtml {
    if (!text) return '';
    const renderedSafe = this.katex.renderMixedText(text);
    const rendered = (renderedSafe as any)?.changingThisBreaksApplicationSecurity || String(renderedSafe);
    const bolded = rendered.replace(/\*\*(.*?)\*\*/gs, '<strong>$1</strong>');
    const withBreaks = bolded.replace(/&lt;br&gt;/g, '<br>');
    const unescapedHtml = withBreaks
      .replace(/&lt;div(.*?)&gt;/g, '<div$1>')
      .replace(/&lt;\/div&gt;/g, '</div>')
      .replace(/&lt;svg(.*?)&gt;/g, '<svg$1>')
      .replace(/&lt;\/svg&gt;/g, '</svg>')
      .replace(/&lt;line(.*?)&gt;/g, '<line$1>')
      .replace(/&lt;\/line&gt;/g, '</line>')
      .replace(/&lt;circle(.*?)&gt;/g, '<circle$1>')
      .replace(/&lt;\/circle&gt;/g, '</circle>')
      .replace(/&lt;text(.*?)&gt;/g, '<text$1>')
      .replace(/&lt;\/text&gt;/g, '</text>')
      .replace(/&lt;path(.*?)&gt;/g, '<path$1>')
      .replace(/&lt;\/path&gt;/g, '</path>')
      .replace(/&lt;polygon(.*?)&gt;/g, '<polygon$1>')
      .replace(/&lt;\/polygon&gt;/g, '</polygon>')
      .replace(/&lt;rect(.*?)&gt;/g, '<rect$1>')
      .replace(/&lt;\/rect&gt;/g, '</rect>');
    return this.sanitizer.bypassSecurityTrustHtml(unescapedHtml);
  }

  renderSvg(svg: string | null | undefined): SafeHtml {
    if (!svg) return '';
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
}
