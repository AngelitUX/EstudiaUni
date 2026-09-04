import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { InfiniteMasteryService, MasteryAxis, MasterySubjectConfig, MasteryProgress } from '../../core/services/infinite-mastery.service';
import { PaesContentService } from './services/paes-content.service';
import { PoolPregunta } from './models/paes.models';
import { KatexService } from '../../core/services/katex.service';

interface PolygonVertex {
  axis: MasteryAxis;
  x: number;
  y: number;
  xPercent: number;
  yPercent: number;
  labelPositionClass: string;
  completed: boolean;
}

@Component({
  selector: 'app-infinite-mastery-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <ng-container *ngIf="isEmbedded; else modalLayout">
      <div class="embedded-infinite-container animate-fade-in" [style.--subject-theme]="config.themeColor || '#1e3a8a'">
        <ng-container *ngTemplateOutlet="contentBody"></ng-container>
      </div>
    </ng-container>

    <ng-template #modalLayout>
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal-card light-glass-card" [style.--subject-theme]="config.themeColor || '#1e3a8a'" (click)="$event.stopPropagation()">
          <ng-container *ngTemplateOutlet="contentBody"></ng-container>
        </div>
      </div>
    </ng-template>

    <!-- REUSABLE INNER CONTENT -->
    <ng-template #contentBody>
      <!-- HEADER -->
      <div class="mastery-header">
        <div class="header-left">
          <button *ngIf="isEmbedded" class="btn-back-path" (click)="onBackToPath()" title="Volver al mapa de la ruta">
            <span>←</span> Volver a la Ruta
          </button>
          <span class="materia-icon">{{ config.icon }}</span>
          <div>
            <div class="title-row">
              <h2 class="mastery-title">Modo Infinito · {{ config.title }}</h2>
              <span class="daily-badge">📅 Ciclo Diario</span>
            </div>
            <span class="mastery-subtitle">Práctica diaria por ejes temáticos y desafío al Núcleo Maestro (100% de aciertos para dominar)</span>
          </div>
        </div>
        <button *ngIf="!isEmbedded" class="btn-close" (click)="closeModal()" aria-label="Cerrar">&times;</button>
      </div>

      <!-- ═══ VISTA 1: POLÍGONO DE MAESTRÍA ═══ -->
      <div class="polygon-view" *ngIf="viewState === 'polygon'">
        
        <!-- TOP STATS & RESET TIMER BAR (SIN XP, ENFOCADO EN NIVEL Y EJES) -->
        <div class="stats-ribbon">
          <div class="stat-pill">
            <span class="stat-icon">🏆</span>
            <span>Nivel de Maestría <strong>Lv. {{ progress.level }}</strong></span>
          </div>
          <div class="stat-pill">
            <span class="stat-icon">🎯</span>
            <span><strong>{{ progress.completedAxes.length }}/{{ config.axes.length }}</strong> Ejes Hoy</span>
          </div>
          <div class="stat-pill reset-timer-pill" title="Tiempo restante para el reseteo del ciclo diario">
            <span class="stat-icon">⏳</span>
            <span>Refresco en: <strong>{{ timeUntilReset }}</strong></span>
          </div>
        </div>

        <!-- DYNAMIC SVG POLYGON CONTAINER -->
        <div class="polygon-wrapper">
          <div class="polygon-container">
            <svg class="polygon-svg" viewBox="0 0 600 520" preserveAspectRatio="xMidYMid meet">
              <defs>
                <!-- Central Core Glow Gradient -->
                <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" [attr.stop-color]="isBossUnlocked ? '#f59e0b' : (config.themeColor || '#1e3a8a')" [attr.stop-opacity]="isBossUnlocked ? '0.35' : '0.12'"/>
                  <stop offset="65%" [attr.stop-color]="isBossUnlocked ? '#fbbf24' : (config.themeColor || '#1e3a8a')" stop-opacity="0.05"/>
                  <stop offset="100%" [attr.stop-color]="config.themeColor || '#1e3a8a'" stop-opacity="0"/>
                </radialGradient>
              </defs>

              <!-- Central Core Glow Backdrop -->
              <circle cx="300" cy="245" r="110" fill="url(#coreGlow)" [class.pulsing-core]="isBossUnlocked"/>

              <!-- Outer Base Polygon Track (soft pipe underlay) -->
              <polygon [attr.points]="polygonPointsString"
                       class="polygon-outer-track"/>

              <!-- Outer Active Polygon Ring (crisp thematic line) -->
              <polygon [attr.points]="polygonPointsString"
                       class="polygon-outer-ring"
                       [attr.stroke]="config.themeColor || '#1e3a8a'"/>

              <!-- Radial Spoke Lines from Center (300, 245) to Vertices -->
              <g *ngFor="let v of vertices">
                <!-- Base Spoke Track -->
                <line x1="300" y1="245"
                      [attr.x2]="v.x" [attr.y2]="v.y"
                      class="polygon-spoke-track"/>
                
                <!-- Active / Completed Energy Spoke -->
                <line x1="300" y1="245"
                      [attr.x2]="v.x" [attr.y2]="v.y"
                      class="polygon-spoke"
                      [class.spoke-active]="v.completed"
                      [attr.stroke]="v.completed ? '#10b981' : '#cbd5e1'"/>
              </g>
            </svg>

            <!-- INTERACTIVE VERTEX NODES (HTML OVERLAY) -->
            <div *ngFor="let v of vertices; let i = index"
                 class="vertex-node-wrapper"
                 [ngClass]="v.labelPositionClass"
                 [class.completed]="v.completed"
                 [style.left.%]="v.xPercent"
                 [style.top.%]="v.yPercent"
                 (click)="startAxisQuiz(v.axis)">
              <div class="vertex-bubble" [style.--axis-color]="v.axis.color">
                <span class="vertex-icon">{{ v.axis.icon }}</span>
                <span class="completed-badge" *ngIf="v.completed">✓</span>
              </div>
              <div class="vertex-label-card">
                <span class="vertex-title">{{ v.axis.shortName }}</span>
                <span class="vertex-status">{{ v.completed ? 'Dominado Hoy' : 'Practicar →' }}</span>
              </div>
            </div>

            <!-- CENTRAL BOSS NODE / NÚCLEO MAESTRO INTERACTIVO -->
            <div class="boss-node-wrapper"
                 [class.boss-unlocked]="isBossUnlocked && !progress.bossDefeatedToday"
                 [class.boss-defeated]="progress.bossDefeatedToday"
                 [class.boss-locked]="!isBossUnlocked"
                 (click)="handleBossNodeClick()">
              <div class="boss-bubble">
                <span class="boss-icon" *ngIf="progress.bossDefeatedToday">👑</span>
                <span class="boss-icon" *ngIf="isBossUnlocked && !progress.bossDefeatedToday">🔥</span>
                <span class="boss-icon" *ngIf="!isBossUnlocked">🔒</span>
                <div class="boss-level-tag">Lv. {{ progress.level }}</div>
              </div>
              <div class="boss-label-card">
                <span class="boss-title">Núcleo Maestro</span>
                <span class="boss-status" *ngIf="progress.bossDefeatedToday">¡Conquistado Hoy!</span>
                <span class="boss-status highlight" *ngIf="isBossUnlocked && !progress.bossDefeatedToday">¡Desafiar Jefe! ⚡</span>
                <span class="boss-status" *ngIf="!isBossUnlocked">Completa los {{ config.axes.length }} ejes</span>
              </div>
            </div>

          </div>
        </div>

        <!-- BOTTOM INSTRUCTIONS / HELPER -->
        <div class="polygon-footer">
          <p *ngIf="!isBossUnlocked">💡 Completa los <strong>{{ config.axes.length }} ejes temáticos</strong> con <strong>100% de aciertos</strong> para desbloquear el <strong>Núcleo Maestro (Jefe)</strong>.</p>
          <p *ngIf="isBossUnlocked && !progress.bossDefeatedToday" class="boss-alert-text">🔥 <strong>¡Todos los ejes conquistados!</strong> Haz clic en el Núcleo Central para enfrentarte al Jefe, lograr el 100% y subir tu Nivel de Maestría.</p>
          <p *ngIf="progress.bossDefeatedToday" class="boss-victory-text">✨ <strong>¡Gran trabajo!</strong> Has derrotado al Núcleo Maestro de hoy y subiste de nivel. El ciclo se renovará a la medianoche.</p>
        </div>
      </div>

      <!-- ═══ VISTA 2: RUNNER DE PREGUNTAS DEL EJE / JEFE ═══ -->
      <div class="quiz-view" *ngIf="viewState === 'quiz' && activeQuizQuestions.length > 0">
        
        <!-- QUIZ HEADER -->
        <div class="quiz-top-bar">
          <div class="quiz-axis-info">
            <span class="axis-pill" *ngIf="!isBossQuiz" [style.background]="selectedAxis?.color + '15'" [style.color]="selectedAxis?.color" [style.borderColor]="selectedAxis?.color + '40'">
              {{ selectedAxis?.icon }} {{ selectedAxis?.name }}
            </span>
            <span class="axis-pill boss-pill" *ngIf="isBossQuiz">
              👑 Núcleo Maestro Multi-Eje (Batalla de Jefe)
            </span>
            <span class="question-counter">Pregunta {{ currentQuestionIndex + 1 }} de {{ activeQuizQuestions.length }}</span>
          </div>
          <button class="btn-cancel-quiz" (click)="cancelQuiz()">✕ Salir del Desafío</button>
        </div>

        <!-- PROGRESS BAR -->
        <div class="quiz-progress-track">
          <div class="quiz-progress-fill" 
               [style.width.%]="(currentQuestionIndex / activeQuizQuestions.length) * 100" 
               [style.background]="isBossQuiz ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : (selectedAxis?.color || config.themeColor)"></div>
        </div>

        <!-- QUESTION CONTENT -->
        <div class="quiz-content" *ngIf="currentQuestion">
          
          <div class="preamble-box" *ngIf="currentQuestion.preambulo_texto" [innerHTML]="parseMixed(currentQuestion.preambulo_texto)"></div>

          <div class="question-image-box" *ngIf="currentQuestion.preambulo_imagen_url">
            <img [src]="currentQuestion.preambulo_imagen_url" alt="Contexto de la pregunta" class="q-image"/>
          </div>

          <p class="question-enunciado" [innerHTML]="parseMixed(currentQuestion.enunciado)"></p>

          <div class="formula-box" *ngIf="currentQuestion.formula_latex" [innerHTML]="renderLatex(currentQuestion.formula_latex)"></div>

          <!-- ALTERNATIVAS CON SOPORTE KATEX MIXTO -->
          <div class="options-grid">
            <button *ngFor="let key of optionKeys"
                    class="option-btn"
                    [class.selected]="selectedAnswer === key"
                    [class.correct]="hasAnswered && key === currentQuestion.respuesta_correcta"
                    [class.incorrect]="hasAnswered && selectedAnswer === key && key !== currentQuestion.respuesta_correcta"
                    [disabled]="hasAnswered"
                    (click)="selectOption(key)">
              <span class="option-key">{{ key }}</span>
              <span class="option-text" [innerHTML]="parseMixed(getOptionText(currentQuestion, key))"></span>
              <span class="option-check-icon" *ngIf="hasAnswered && key === currentQuestion.respuesta_correcta">✓</span>
              <span class="option-check-icon" *ngIf="hasAnswered && selectedAnswer === key && key !== currentQuestion.respuesta_correcta">✗</span>
            </button>
          </div>

          <!-- EXPLICACIÓN / FEEDBACK PASO A PASO CON KATEX -->
          <div class="feedback-card" *ngIf="hasAnswered">
            <div class="feedback-status" [class.is-correct]="selectedAnswer === currentQuestion.respuesta_correcta">
              <span class="status-badge-icon">{{ selectedAnswer === currentQuestion.respuesta_correcta ? '✓' : '✗' }}</span>
              <span>{{ selectedAnswer === currentQuestion.respuesta_correcta ? '¡Respuesta Correcta! 🌟' : 'Respuesta Incorrecta' }}</span>
              <span class="correct-answer-pill" *ngIf="selectedAnswer !== currentQuestion.respuesta_correcta">
                Respuesta correcta: <strong>Opción {{ currentQuestion.respuesta_correcta }}</strong>
              </span>
            </div>
            <div class="feedback-explanation-body" [innerHTML]="renderExplanation(currentQuestion)"></div>
          </div>

        </div>

        <!-- QUIZ ACTIONS FOOTER -->
        <div class="quiz-footer">
          <button class="btn-check" 
                  *ngIf="!hasAnswered" 
                  [disabled]="!selectedAnswer"
                  (click)="checkAnswer()">
            Comprobar Respuesta
          </button>

          <button class="btn-next" 
                  *ngIf="hasAnswered && currentQuestionIndex < activeQuizQuestions.length - 1"
                  (click)="nextQuestion()">
            Siguiente Pregunta →
          </button>

          <button class="btn-finish" 
                  *ngIf="hasAnswered && currentQuestionIndex === activeQuizQuestions.length - 1"
                  (click)="finishQuiz()">
            {{ isBossQuiz ? '👑 Finalizar Batalla del Jefe' : 'Finalizar Desafío' }}
          </button>
        </div>

      </div>

      <!-- ═══ VISTA 3: RESUMEN DE RESULTADOS ═══ -->
      <div class="summary-view" *ngIf="viewState === 'summary'">
        <div class="summary-card" [class.summary-passed]="lastQuizResult?.passed" [class.summary-failed]="!lastQuizResult?.passed">
          
          <div class="summary-badge-wrap" [class.boss-victory-badge]="isBossQuiz && lastQuizResult?.passed" [class.failed-badge]="!lastQuizResult?.passed">
            <span class="summary-emoji" *ngIf="lastQuizResult?.passed && !isBossQuiz">🎉</span>
            <span class="summary-emoji" *ngIf="lastQuizResult?.passed && isBossQuiz">👑</span>
            <span class="summary-emoji" *ngIf="!lastQuizResult?.passed">❌</span>
          </div>

          <!-- TITULOS PASSED VS FAILED -->
          <ng-container *ngIf="lastQuizResult?.passed">
            <h3 class="summary-title" *ngIf="!isBossQuiz">¡Eje Temático Dominado!</h3>
            <h3 class="summary-title boss-title-victory" *ngIf="isBossQuiz">¡NÚCLEO MAESTRO DERROTADO!</h3>
            <p class="summary-subtitle" *ngIf="!isBossQuiz">¡Perfección total (100% de aciertos)! Has dominado el eje <strong>{{ selectedAxis?.name }}</strong> de hoy.</p>
            <p class="summary-subtitle" *ngIf="isBossQuiz">¡Felicitaciones! Has completado el reto global del día sin errores y has subido de Nivel de Maestría.</p>
          </ng-container>

          <ng-container *ngIf="!lastQuizResult?.passed">
            <h3 class="summary-title failed-title">Desafío No Superado</h3>
            <p class="summary-subtitle failed-subtitle">Para dominar este eje hoy debes responder <strong>todas las preguntas correctamente (100% de aciertos)</strong>. ¡Vuelve a intentarlo!</p>
          </ng-container>

          <div class="summary-stats-grid">
            <div class="summary-stat-box">
              <span class="stat-num" [class.text-green]="lastQuizResult?.passed" [class.text-red]="!lastQuizResult?.passed">
                {{ quizCorrectCount }} / {{ activeQuizQuestions.length }}
              </span>
              <span class="stat-label">Aciertos ({{ Math.round((quizCorrectCount / activeQuizQuestions.length) * 100) }}%)</span>
            </div>
            <div class="summary-stat-box" *ngIf="lastQuizResult?.leveledUp">
              <span class="stat-num text-gradient">Lv. {{ lastQuizResult?.newLevel }}</span>
              <span class="stat-label">¡Nuevo Nivel de Maestría!</span>
            </div>
          </div>

          <div class="summary-actions-wrap">
            <button *ngIf="!lastQuizResult?.passed" class="btn-retry-quiz" (click)="retryCurrentQuiz()">
              🔁 Reintentar Desafío Diario
            </button>
            <button class="btn-continue-polygon" (click)="returnToPolygon()">
              {{ lastQuizResult?.passed ? 'Volver al Polígono de Maestría →' : 'Salir al Polígono' }}
            </button>
          </div>
        </div>
      </div>
    </ng-template>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    /* EMBEDDED CONTAINER (Lienzo integrado en la ruta) */
    .embedded-infinite-container {
      width: 100%;
      max-width: 960px;
      margin: 0 auto;
      padding: 1.25rem 1rem 4rem;
      background: transparent;
      color: #0f172a;
      font-family: inherit;
    }

    /* MODAL OVERLAY (Si se abre como popup) */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(8px);
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      animation: fadeIn 0.2s ease-out;
    }

    .modal-card {
      width: 100%;
      max-width: 920px;
      max-height: 94vh;
      background: #ffffff;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 24px;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.25);
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      color: #0f172a;
    }

    /* HEADER */
    .mastery-header {
      padding: 1.25rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      background: rgba(255, 255, 255, 0.9);
      border-radius: 20px 20px 0 0;
      backdrop-filter: blur(12px);
      margin-bottom: 1.25rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .btn-back-path {
      background: #f1f5f9;
      color: #475569;
      border: 1px solid #cbd5e1;
      padding: 0.45rem 0.95rem;
      border-radius: 12px;
      font-size: 0.82rem;
      font-weight: 800;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.35rem;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .btn-back-path:hover {
      background: #e2e8f0;
      color: #0f172a;
      transform: translateX(-2px);
    }

    .materia-icon {
      font-size: 2rem;
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      border-radius: 16px;
      padding: 0.4rem 0.65rem;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
    }

    .title-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .mastery-title {
      font-size: 1.35rem;
      font-weight: 900;
      margin: 0;
      color: #0f172a;
      letter-spacing: -0.02em;
    }

    .daily-badge {
      font-size: 0.75rem;
      font-weight: 800;
      padding: 0.2rem 0.65rem;
      border-radius: 99px;
      background: #e0f2fe;
      border: 1px solid #bae6fd;
      color: #0369a1;
    }

    .mastery-subtitle {
      font-size: 0.82rem;
      color: #64748b;
      display: block;
      margin-top: 0.2rem;
      font-weight: 500;
    }

    .btn-close {
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      color: #64748b;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      font-size: 1.4rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .btn-close:hover {
      background: #fee2e2;
      color: #ef4444;
      border-color: #fca5a5;
    }

    /* STATS RIBBON */
    .stats-ribbon {
      display: flex;
      gap: 0.75rem;
      padding: 0.85rem 1.25rem;
      background: #ffffff;
      border: 1px solid rgba(0, 0, 0, 0.07);
      border-radius: 18px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
      flex-wrap: wrap;
      margin-bottom: 1.75rem;
      width: 100%;
      box-sizing: border-box;
    }

    .stat-pill {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 0.45rem 0.95rem;
      font-size: 0.82rem;
      display: flex;
      align-items: center;
      gap: 0.45rem;
      color: #475569;
      font-weight: 600;
    }

    .stat-pill strong {
      color: #0f172a;
      font-weight: 800;
    }

    .reset-timer-pill {
      margin-left: auto;
      background: #fef3c7;
      border-color: #fde68a;
      color: #92400e;
    }

    .reset-timer-pill strong {
      color: #78350f;
      font-family: monospace;
      font-size: 0.88rem;
    }

    /* POLYGON VIEW */
    .polygon-view {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0.5rem 0;
      width: 100%;
    }

    .polygon-wrapper {
      width: 100%;
      display: flex;
      justify-content: center;
      padding: 1.5rem 0;
    }

    .polygon-container {
      position: relative;
      width: 100%;
      max-width: 600px;
      aspect-ratio: 600 / 520;
      user-select: none;
    }

    .polygon-svg {
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    /* SVG TRACKS & LINES */
    .polygon-outer-track {
      fill: rgba(248, 250, 252, 0.6);
      stroke: #e2e8f0;
      stroke-width: 8px;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .polygon-outer-ring {
      fill: none;
      stroke-width: 3.5px;
      stroke-linecap: round;
      stroke-linejoin: round;
      filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.08));
    }

    .polygon-spoke-track {
      stroke: #e2e8f0;
      stroke-width: 7px;
      stroke-linecap: round;
    }

    .polygon-spoke {
      stroke-width: 3px;
      stroke-linecap: round;
      transition: all 0.35s ease;
    }

    .polygon-spoke.spoke-active {
      stroke-width: 4.5px;
      stroke: #10b981 !important;
      filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.65));
      animation: energyPulse 3s infinite ease-in-out;
    }

    @keyframes energyPulse {
      0% { opacity: 0.85; }
      50% { opacity: 1; }
      100% { opacity: 0.85; }
    }

    .pulsing-core {
      animation: pulseCoreGlow 3s infinite alternate ease-in-out;
    }

    @keyframes pulseCoreGlow {
      0% { transform: scale(0.92); transform-origin: 300px 245px; opacity: 0.6; }
      100% { transform: scale(1.18); transform-origin: 300px 245px; opacity: 1; }
    }

    /* VERTEX NODES */
    .vertex-node-wrapper {
      position: absolute;
      transform: translate(-50%, -50%);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 10;
      transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .vertex-node-wrapper:hover {
      transform: translate(-50%, -50%) scale(1.12);
      z-index: 25;
    }

    .vertex-bubble {
      width: 66px;
      height: 66px;
      border-radius: 50%;
      background: #ffffff;
      border: 3.5px solid var(--axis-color, #1e3a8a);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 22px rgba(0, 0, 0, 0.08), 0 0 14px rgba(0, 0, 0, 0.04);
      position: relative;
      transition: all 0.25s;
    }

    .vertex-icon {
      font-size: 1.75rem;
    }

    .completed-badge {
      position: absolute;
      top: -3px;
      right: -3px;
      background: #10b981;
      color: #ffffff;
      font-size: 0.78rem;
      font-weight: 900;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #ffffff;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    }

    .vertex-node-wrapper.completed .vertex-bubble {
      border-color: #10b981;
      background: #f0fdf4;
      box-shadow: 0 8px 24px rgba(16, 185, 129, 0.25);
    }

    /* FLOATING LABEL CARD (Dynamic Directional Positioning) */
    .vertex-label-card {
      position: absolute;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border: 1.5px solid rgba(0, 0, 0, 0.08);
      border-radius: 12px;
      padding: 0.35rem 0.75rem;
      text-align: center;
      white-space: nowrap;
      pointer-events: none;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
      transition: all 0.2s ease;
    }

    .vertex-title {
      display: block;
      font-size: 0.8rem;
      font-weight: 800;
      color: #0f172a;
    }

    .vertex-status {
      display: block;
      font-size: 0.68rem;
      font-weight: 700;
      color: #64748b;
    }

    .vertex-node-wrapper.completed .vertex-status {
      color: #059669;
    }

    /* Position Variants */
    .vertex-node-wrapper.label-pos-top .vertex-label-card {
      bottom: calc(100% + 10px);
      left: 50%;
      transform: translateX(-50%);
    }

    .vertex-node-wrapper.label-pos-bottom .vertex-label-card,
    .vertex-node-wrapper.label-pos-bottom-left .vertex-label-card,
    .vertex-node-wrapper.label-pos-bottom-right .vertex-label-card {
      top: calc(100% + 10px);
      left: 50%;
      transform: translateX(-50%);
    }

    .vertex-node-wrapper.label-pos-left .vertex-label-card {
      right: calc(100% + 12px);
      top: 50%;
      transform: translateY(-50%);
    }

    .vertex-node-wrapper.label-pos-right .vertex-label-card {
      left: calc(100% + 12px);
      top: 50%;
      transform: translateY(-50%);
    }

    /* CENTRAL BOSS NODE */
    .boss-node-wrapper {
      position: absolute;
      top: 47.11%; /* 245 / 520 */
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 15;
      cursor: pointer;
      transition: all 0.25s;
    }

    .boss-bubble {
      width: 86px;
      height: 86px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .boss-node-wrapper.boss-locked .boss-bubble {
      background: linear-gradient(135deg, #f8fafc, #e2e8f0);
      border: 3.5px solid #94a3b8;
      color: #64748b;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    }

    .boss-node-wrapper.boss-unlocked {
      animation: bossPulseFloat 2.2s infinite ease-in-out;
    }

    .boss-node-wrapper.boss-unlocked:hover {
      transform: translate(-50%, -50%) scale(1.12);
    }

    .boss-node-wrapper.boss-unlocked .boss-bubble {
      background: radial-gradient(circle at 35% 35%, #fef3c7, #f59e0b);
      border: 4px solid #f59e0b;
      box-shadow: 0 0 35px rgba(245, 158, 11, 0.7), 0 0 60px rgba(245, 158, 11, 0.3);
    }

    .boss-node-wrapper.boss-defeated .boss-bubble {
      background: radial-gradient(circle at 35% 35%, #f5f3ff, #c4b5fd);
      border: 3.5px solid #8b5cf6;
      box-shadow: 0 0 25px rgba(139, 92, 246, 0.45);
    }

    .boss-icon {
      font-size: 2.4rem;
    }

    .boss-level-tag {
      position: absolute;
      bottom: -6px;
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 99px;
      padding: 0.1rem 0.5rem;
      font-size: 0.68rem;
      font-weight: 900;
      color: #ffffff;
    }

    .boss-label-card {
      margin-top: 0.55rem;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border: 1.5px solid rgba(0, 0, 0, 0.09);
      border-radius: 14px;
      padding: 0.4rem 0.85rem;
      text-align: center;
      white-space: nowrap;
      pointer-events: none;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    }

    .boss-title {
      display: block;
      font-size: 0.84rem;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: 0.3px;
    }

    .boss-status {
      display: block;
      font-size: 0.7rem;
      font-weight: 700;
      color: #64748b;
    }

    .boss-status.highlight {
      color: #b45309;
      font-weight: 800;
    }

    .boss-node-wrapper.boss-defeated .boss-status {
      color: #7c3aed;
    }

    @keyframes bossPulseFloat {
      0% { transform: translate(-50%, -50%) scale(1); }
      50% { transform: translate(-50%, -50%) scale(1.08); }
      100% { transform: translate(-50%, -50%) scale(1); }
    }

    /* FOOTER INSTRUCTIONS */
    .polygon-footer {
      max-width: 620px;
      text-align: center;
      font-size: 0.85rem;
      color: #475569;
      background: #ffffff;
      padding: 0.85rem 1.5rem;
      border-radius: 16px;
      border: 1px solid rgba(0, 0, 0, 0.07);
      margin-top: 1.25rem;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
    }

    .polygon-footer p {
      margin: 0;
      line-height: 1.5;
    }

    .boss-alert-text {
      color: #b45309 !important;
      font-weight: 700;
    }

    .boss-victory-text {
      color: #6d28d9 !important;
      font-weight: 700;
    }

    /* QUIZ VIEW */
    .quiz-view {
      padding: 1rem 0;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .quiz-top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #ffffff;
      padding: 0.85rem 1.25rem;
      border-radius: 16px;
      border: 1px solid rgba(0, 0, 0, 0.07);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
    }

    .quiz-axis-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .axis-pill {
      padding: 0.4rem 0.95rem;
      border-radius: 99px;
      font-weight: 800;
      font-size: 0.85rem;
      border: 1.5px solid transparent;
    }

    .boss-pill {
      background: #fef3c7 !important;
      border-color: #f59e0b !important;
      color: #b45309 !important;
    }

    .question-counter {
      font-size: 0.85rem;
      font-weight: 700;
      color: #64748b;
    }

    .btn-cancel-quiz {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      color: #64748b;
      padding: 0.4rem 0.85rem;
      border-radius: 10px;
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-cancel-quiz:hover {
      background: #fee2e2;
      color: #ef4444;
      border-color: #fca5a5;
    }

    .quiz-progress-track {
      width: 100%;
      height: 8px;
      background: #e2e8f0;
      border-radius: 99px;
      overflow: hidden;
    }

    .quiz-progress-fill {
      height: 100%;
      border-radius: 99px;
      transition: width 0.3s ease;
    }

    .quiz-content {
      background: #ffffff;
      border: 1px solid rgba(0, 0, 0, 0.08);
      border-radius: 20px;
      padding: 1.75rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      box-shadow: 0 6px 24px rgba(0, 0, 0, 0.04);
    }

    .preamble-box {
      background: #f8fafc;
      border-left: 4px solid var(--subject-theme, #1e3a8a);
      padding: 0.85rem 1.25rem;
      border-radius: 10px;
      font-size: 0.92rem;
      color: #334155;
      line-height: 1.6;
    }

    .question-image-box {
      display: flex;
      justify-content: center;
      padding: 0.5rem;
    }

    .q-image {
      max-width: 100%;
      max-height: 250px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }

    .question-enunciado {
      font-size: 1.08rem;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.6;
      margin: 0;
    }

    .formula-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 1rem;
      display: flex;
      justify-content: center;
      overflow-x: auto;
    }

    .options-grid {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .option-btn {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      border-radius: 14px;
      padding: 0.9rem 1.25rem;
      color: #1e293b;
      font-size: 0.95rem;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s;
    }

    .option-btn:hover:not(:disabled) {
      background: #f1f5f9;
      border-color: var(--subject-theme, #1e3a8a);
      transform: translateX(4px);
    }

    .option-btn.selected {
      background: #eff6ff;
      border-color: #3b82f6;
      color: #1e3a8a;
    }

    .option-btn.correct {
      background: #ecfdf5 !important;
      border-color: #10b981 !important;
      color: #065f46 !important;
    }

    .option-btn.incorrect {
      background: #fef2f2 !important;
      border-color: #ef4444 !important;
      color: #991b1b !important;
    }

    .option-key {
      font-weight: 900;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: #0f172a;
    }

    .option-text {
      flex: 1;
      line-height: 1.45;
    }

    .option-check-icon {
      font-weight: 900;
      font-size: 1.15rem;
    }

    /* ENHANCED FEEDBACK CARD WITH DETAILED RESOLUTION */
    .feedback-card {
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      border-radius: 16px;
      padding: 1.25rem 1.5rem;
      animation: fadeIn 0.3s ease;
    }

    .feedback-status {
      font-weight: 900;
      font-size: 1.05rem;
      color: #dc2626;
      margin-bottom: 0.65rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .feedback-status.is-correct {
      color: #059669;
    }

    .status-badge-icon {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #fee2e2;
      color: #dc2626;
      font-size: 0.85rem;
    }

    .feedback-status.is-correct .status-badge-icon {
      background: #d1fae5;
      color: #059669;
    }

    .correct-answer-pill {
      font-size: 0.82rem;
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      color: #1e293b;
      padding: 0.2rem 0.6rem;
      border-radius: 8px;
      font-weight: 700;
      margin-left: auto;
    }

    .feedback-explanation-body {
      font-size: 0.92rem;
      color: #334155;
      line-height: 1.65;
      background: #ffffff;
      padding: 0.85rem 1.15rem;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }

    .quiz-footer {
      display: flex;
      justify-content: flex-end;
    }

    .btn-check, .btn-next, .btn-finish {
      padding: 0.75rem 1.75rem;
      border-radius: 12px;
      font-weight: 800;
      font-size: 0.92rem;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-check {
      background: var(--subject-theme, #1e3a8a);
      color: #ffffff;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
    }

    .btn-check:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      box-shadow: none;
    }

    .btn-next {
      background: #3b82f6;
      color: #ffffff;
      box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3);
    }

    .btn-finish {
      background: linear-gradient(135deg, #10b981, #059669);
      color: #ffffff;
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
    }

    /* SUMMARY VIEW */
    .summary-view {
      padding: 2rem 1rem;
      display: flex;
      justify-content: center;
    }

    .summary-card {
      max-width: 520px;
      width: 100%;
      background: #ffffff;
      border: 1.5px solid rgba(0, 0, 0, 0.08);
      border-radius: 24px;
      padding: 2.25rem 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.06);
    }

    .summary-badge-wrap {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: #f1f5f9;
      border: 2px solid #cbd5e1;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
    }

    .summary-card.summary-passed .summary-badge-wrap {
      background: #d1fae5;
      border-color: #10b981;
    }

    .failed-badge {
      background: #fee2e2 !important;
      border-color: #ef4444 !important;
    }

    .boss-victory-badge {
      background: radial-gradient(circle, #fef3c7, #fde68a) !important;
      border-color: #f59e0b !important;
      box-shadow: 0 0 25px rgba(245, 158, 11, 0.4);
    }

    .summary-emoji {
      font-size: 2.5rem;
    }

    .summary-title {
      font-size: 1.4rem;
      font-weight: 900;
      color: #0f172a;
      margin: 0 0 0.5rem 0;
    }

    .failed-title {
      color: #dc2626 !important;
    }

    .boss-title-victory {
      background: linear-gradient(135deg, #d97706, #dc2626, #7c3aed);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .summary-subtitle {
      font-size: 0.9rem;
      color: #64748b;
      margin: 0 0 1.5rem 0;
      line-height: 1.5;
    }

    .failed-subtitle {
      color: #475569;
    }

    .summary-stats-grid {
      display: flex;
      gap: 1rem;
      width: 100%;
      margin-bottom: 1.75rem;
    }

    .summary-stat-box {
      flex: 1;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .stat-num {
      font-size: 1.45rem;
      font-weight: 900;
      color: var(--subject-theme, #1e3a8a);
    }

    .text-green {
      color: #059669 !important;
    }

    .text-red {
      color: #dc2626 !important;
    }

    .text-gradient {
      background: linear-gradient(135deg, #0284c7, #4f46e5);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .stat-label {
      font-size: 0.75rem;
      font-weight: 700;
      color: #64748b;
      margin-top: 0.2rem;
    }

    .summary-actions-wrap {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      width: 100%;
    }

    .btn-retry-quiz {
      background: linear-gradient(135deg, #e11d48, #be123c);
      color: #ffffff;
      padding: 0.85rem 1.5rem;
      border-radius: 14px;
      border: none;
      font-size: 0.95rem;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(225, 29, 72, 0.3);
      transition: all 0.2s;
    }

    .btn-retry-quiz:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(225, 29, 72, 0.45);
      filter: brightness(1.08);
    }

    .btn-continue-polygon {
      background: var(--subject-theme, #1e3a8a);
      color: #ffffff;
      padding: 0.85rem 1.5rem;
      border-radius: 14px;
      border: none;
      font-size: 0.95rem;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
      transition: all 0.2s;
    }

    .btn-continue-polygon:hover {
      transform: translateY(-2px);
      filter: brightness(1.1);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    }

    /* RESPONSIVE ADJUSTMENTS */
    @media (max-width: 640px) {
      .polygon-container {
        max-width: 440px;
      }
      .vertex-bubble {
        width: 54px;
        height: 54px;
      }
      .vertex-icon {
        font-size: 1.45rem;
      }
      .vertex-title {
        font-size: 0.72rem;
      }
      .vertex-status {
        font-size: 0.6rem;
      }
      .boss-bubble {
        width: 72px;
        height: 72px;
      }
      .boss-icon {
        font-size: 1.9rem;
      }
      .stats-ribbon {
        gap: 0.5rem;
      }
      .stat-pill {
        font-size: 0.75rem;
        padding: 0.35rem 0.65rem;
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class InfiniteMasteryModalComponent implements OnInit, OnDestroy {
  @Input() materiaId: string = 'mat1';
  @Input() isEmbedded: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() backToPath = new EventEmitter<void>();

  Math = Math;

  private masteryService = inject(InfiniteMasteryService);
  private paesContent = inject(PaesContentService);
  private katexService = inject(KatexService);
  private sanitizer = inject(DomSanitizer);

  config!: MasterySubjectConfig;
  progress!: MasteryProgress;
  vertices: PolygonVertex[] = [];
  polygonPointsString: string = '';

  timeUntilReset: string = '00:00:00';
  private timerInterval: any = null;

  readonly optionKeys: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];

  viewState: 'polygon' | 'quiz' | 'summary' = 'polygon';
  selectedAxis: MasteryAxis | null = null;
  isBossQuiz: boolean = false;

  activeQuizQuestions: PoolPregunta[] = [];
  currentQuestionIndex: number = 0;
  selectedAnswer: 'A' | 'B' | 'C' | 'D' | null = null;
  hasAnswered: boolean = false;
  quizCorrectCount: number = 0;

  lastQuizResult: { passed: boolean; leveledUp: boolean; newLevel: number } | null = null;

  get currentQuestion(): PoolPregunta | null {
    return this.activeQuizQuestions[this.currentQuestionIndex] || null;
  }

  get isBossUnlocked(): boolean {
    if (!this.config || !this.progress) return false;
    return this.config.axes.every(a => this.progress.completedAxes.includes(a.id));
  }

  ngOnInit(): void {
    this.loadMasteryData();
    this.startCountdownTimer();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  async loadMasteryData(): Promise<void> {
    // Solo las preguntas de esta materia (cacheadas por materia). loadPoolForMaterias
    // además las vuelca en el signal `poolPreguntas()`, que es lo que lee el
    // MasteryService de forma síncrona.
    await this.paesContent.loadPoolForMaterias([this.materiaId]);
    this.config = this.masteryService.getSubjectConfig(this.materiaId);
    this.progress = this.masteryService.getProgress(this.materiaId);
    this.computePolygon();
  }

  private startCountdownTimer(): void {
    this.updateResetTimer();
    this.timerInterval = setInterval(() => {
      this.updateResetTimer();
    }, 1000);
  }

  private updateResetTimer(): void {
    const totalSecs = this.masteryService.getSecondsUntilMidnight();
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    this.timeUntilReset = `${String(hrs).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;

    if (totalSecs === 0) {
      this.loadMasteryData();
    }
  }

  computePolygon(): void {
    const axes = this.config.axes;
    const n = axes.length;
    const cx = 300;
    const cy = 245;
    const radius = 165;
    const svgWidth = 600;
    const svgHeight = 520;

    const points: string[] = [];
    this.vertices = axes.map((axis, i) => {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      points.push(`${Math.round(x)},${Math.round(y)}`);

      const labelPositionClass = this.getLabelPositionClass(angle);

      return {
        axis,
        x: Math.round(x),
        y: Math.round(y),
        xPercent: (x / svgWidth) * 100,
        yPercent: (y / svgHeight) * 100,
        labelPositionClass,
        completed: this.progress.completedAxes.includes(axis.id)
      };
    });

    this.polygonPointsString = points.join(' ');
  }

  private getLabelPositionClass(angle: number): string {
    let a = angle;
    while (a > Math.PI) a -= 2 * Math.PI;
    while (a < -Math.PI) a -= 2 * Math.PI;

    const sin = Math.sin(a);
    const cos = Math.cos(a);

    if (sin < -0.55) {
      return 'label-pos-top';
    } else if (sin > 0.55) {
      if (cos < -0.3) return 'label-pos-bottom-left';
      if (cos > 0.3) return 'label-pos-bottom-right';
      return 'label-pos-bottom';
    } else {
      return cos < 0 ? 'label-pos-left' : 'label-pos-right';
    }
  }

  startAxisQuiz(axis: MasteryAxis): void {
    this.selectedAxis = axis;
    this.isBossQuiz = false;
    this.activeQuizQuestions = this.masteryService.getDailyAxisQuiz(this.materiaId, axis.id, 5);
    
    if (this.activeQuizQuestions.length === 0) return;

    this.currentQuestionIndex = 0;
    this.selectedAnswer = null;
    this.hasAnswered = false;
    this.quizCorrectCount = 0;
    this.viewState = 'quiz';
  }

  handleBossNodeClick(): void {
    if (!this.isBossUnlocked || this.progress.bossDefeatedToday) return;
    this.startBossQuiz();
  }

  startBossQuiz(): void {
    this.selectedAxis = null;
    this.isBossQuiz = true;
    this.activeQuizQuestions = this.masteryService.getDailyBossQuiz(this.materiaId, 8);

    if (this.activeQuizQuestions.length === 0) return;

    this.currentQuestionIndex = 0;
    this.selectedAnswer = null;
    this.hasAnswered = false;
    this.quizCorrectCount = 0;
    this.viewState = 'quiz';
  }

  retryCurrentQuiz(): void {
    this.currentQuestionIndex = 0;
    this.selectedAnswer = null;
    this.hasAnswered = false;
    this.quizCorrectCount = 0;
    this.viewState = 'quiz';
  }

  cancelQuiz(): void {
    this.viewState = 'polygon';
    this.selectedAxis = null;
    this.isBossQuiz = false;
    this.computePolygon();
  }

  selectOption(key: 'A' | 'B' | 'C' | 'D'): void {
    if (this.hasAnswered) return;
    this.selectedAnswer = key;
  }

  checkAnswer(): void {
    if (!this.selectedAnswer || this.hasAnswered || !this.currentQuestion) return;
    this.hasAnswered = true;
    if (this.selectedAnswer === this.currentQuestion.respuesta_correcta) {
      this.quizCorrectCount++;
    }
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.activeQuizQuestions.length - 1) {
      this.currentQuestionIndex++;
      this.selectedAnswer = null;
      this.hasAnswered = false;
    }
  }

  finishQuiz(): void {
    if (this.isBossQuiz) {
      const result = this.masteryService.recordBossCompletion(
        this.materiaId,
        this.quizCorrectCount,
        this.activeQuizQuestions.length
      );
      this.lastQuizResult = result;
      this.progress = result.progress;
      this.viewState = 'summary';
    } else if (this.selectedAxis) {
      const result = this.masteryService.recordAxisCompletion(
        this.materiaId,
        this.selectedAxis.id,
        this.quizCorrectCount,
        this.activeQuizQuestions.length
      );
      this.lastQuizResult = result;
      this.progress = result.progress;
      this.viewState = 'summary';
    }
  }

  returnToPolygon(): void {
    this.viewState = 'polygon';
    this.selectedAxis = null;
    this.isBossQuiz = false;
    this.computePolygon();
  }

  renderLatex(latex: string): SafeHtml {
    return this.katexService.render(latex);
  }

  parseMixed(text: string | null | undefined): SafeHtml {
    if (!text) return '';
    const renderedSafe = this.katexService.renderMixedText(text);
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

  renderExplanation(q: PoolPregunta | null): SafeHtml {
    if (!q) return '';
    const isCorrect = this.selectedAnswer === q.respuesta_correcta;
    const rawText = isCorrect
      ? (q.feedback_acierto || (q as any).explicacion || (q as any).resolucion || '¡Excelente razonamiento! Has seleccionado la alternativa correcta.')
      : (q.feedback_error || (q as any).explicacion || (q as any).resolucion || 'Revisa con calma el procedimiento paso a paso para resolver este problema.');
    return this.parseMixed(rawText);
  }

  getOptionText(q: PoolPregunta | null, key: 'A' | 'B' | 'C' | 'D'): string {
    if (!q || !q.alternativas) return '';
    if (Array.isArray(q.alternativas)) {
      const idx = key === 'A' ? 0 : key === 'B' ? 1 : key === 'C' ? 2 : 3;
      return q.alternativas[idx] || '';
    }
    return (q.alternativas as any)[key] || '';
  }

  onBackToPath(): void {
    this.backToPath.emit();
  }

  closeModal(): void {
    this.close.emit();
  }
}
