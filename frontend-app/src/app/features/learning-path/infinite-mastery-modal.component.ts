import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SafeHtml } from '@angular/platform-browser';
import { InfiniteMasteryService, MasteryAxis, MasterySubjectConfig, MasteryProgress } from '../../core/services/infinite-mastery.service';
import { PaesContentService } from './services/paes-content.service';
import { PoolPregunta } from './models/paes.models';
import { KatexService } from '../../core/services/katex.service';

interface PolygonVertex {
  axis: MasteryAxis;
  x: number;
  y: number;
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
            <span class="mastery-subtitle">Práctica ilimitada, maestría por ejes temáticos y desafío al Núcleo Maestro</span>
          </div>
        </div>
        <button *ngIf="!isEmbedded" class="btn-close" (click)="closeModal()" aria-label="Cerrar">&times;</button>
      </div>

      <!-- ═══ VISTA 1: POLÍGONO DE MAESTRÍA ═══ -->
      <div class="polygon-view" *ngIf="viewState === 'polygon'">
        
        <!-- TOP STATS & RESET TIMER BAR -->
        <div class="stats-ribbon">
          <div class="stat-pill">
            <span class="stat-icon">🏆</span>
            <span>Nivel de Maestría <strong>Lv. {{ progress.level }}</strong></span>
          </div>
          <div class="stat-pill">
            <span class="stat-icon">✨</span>
            <span><strong>{{ progress.xp }}</strong> XP</span>
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
        <div class="polygon-container">
          <svg class="polygon-svg" viewBox="0 0 540 460">
            <defs>
              <!-- Central Core Glow Gradient -->
              <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" [attr.stop-color]="isBossUnlocked ? '#f59e0b' : (config.themeColor || '#1e3a8a')" [attr.stop-opacity]="isBossUnlocked ? '0.35' : '0.15'"/>
                <stop offset="60%" [attr.stop-color]="isBossUnlocked ? '#fbbf24' : (config.themeColor || '#1e3a8a')" stop-opacity="0.08"/>
                <stop offset="100%" [attr.stop-color]="config.themeColor || '#1e3a8a'" stop-opacity="0"/>
              </radialGradient>
            </defs>

            <!-- Background Core Glow Area -->
            <circle cx="270" cy="230" r="95" fill="url(#coreGlow)" [class.pulsing-core]="isBossUnlocked"/>

            <!-- Outer Polygon Connecting Lines -->
            <polygon [attr.points]="polygonPointsString"
                     class="polygon-outer-ring"
                     [attr.stroke]="config.themeColor || '#1e3a8a'"/>

            <!-- Inner Spoke Lines from Center to Vertices -->
            <line *ngFor="let v of vertices"
                  x1="270" y1="230"
                  [attr.x2]="v.x" [attr.y2]="v.y"
                  class="polygon-spoke"
                  [class.spoke-active]="v.completed"
                  [attr.stroke]="v.completed ? '#10b981' : '#cbd5e1'"/>
          </svg>

          <!-- INTERACTIVE VERTEX NODES (HTML OVERLAY) -->
          <div *ngFor="let v of vertices; let i = index"
               class="vertex-node-wrapper"
               [style.left.px]="v.x"
               [style.top.px]="v.y"
               [class.completed]="v.completed"
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

        <!-- BOTTOM INSTRUCTIONS / HELPER -->
        <div class="polygon-footer">
          <p *ngIf="!isBossUnlocked">💡 Completa los <strong>{{ config.axes.length }} ejes temáticos</strong> de hoy para desbloquear el <strong>Núcleo Maestro (Jefe Multi-Eje)</strong>.</p>
          <p *ngIf="isBossUnlocked && !progress.bossDefeatedToday" class="boss-alert-text">🔥 <strong>¡Todos los ejes conquistados!</strong> Haz clic en el Núcleo Central para enfrentarte al Jefe y subir tu Nivel de Maestría.</p>
          <p *ngIf="progress.bossDefeatedToday" class="boss-victory-text">✨ <strong>¡Gran trabajo!</strong> Has derrotado al Núcleo Maestro de hoy. El ciclo se renovará a la medianoche.</p>
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
               [style.width.%]="((currentQuestionIndex + 1) / activeQuizQuestions.length) * 100" 
               [style.background]="isBossQuiz ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : (selectedAxis?.color || config.themeColor)"></div>
        </div>

        <!-- QUESTION CONTENT -->
        <div class="quiz-content" *ngIf="currentQuestion">
          
          <div class="preamble-box" *ngIf="currentQuestion.preambulo_texto">
            <p>{{ currentQuestion.preambulo_texto }}</p>
          </div>

          <div class="question-image-box" *ngIf="currentQuestion.preambulo_imagen_url">
            <img [src]="currentQuestion.preambulo_imagen_url" alt="Contexto de la pregunta" class="q-image"/>
          </div>

          <p class="question-enunciado">{{ currentQuestion.enunciado }}</p>

          <div class="formula-box" *ngIf="currentQuestion.formula_latex" [innerHTML]="renderLatex(currentQuestion.formula_latex)"></div>

          <!-- ALTERNATIVAS -->
          <div class="options-grid">
            <button *ngFor="let key of optionKeys"
                    class="option-btn"
                    [class.selected]="selectedAnswer === key"
                    [class.correct]="hasAnswered && key === currentQuestion.respuesta_correcta"
                    [class.incorrect]="hasAnswered && selectedAnswer === key && key !== currentQuestion.respuesta_correcta"
                    [disabled]="hasAnswered"
                    (click)="selectOption(key)">
              <span class="option-key">{{ key }}</span>
              <span class="option-text">{{ getOptionText(currentQuestion, key) }}</span>
              <span class="option-check-icon" *ngIf="hasAnswered && key === currentQuestion.respuesta_correcta">✓</span>
              <span class="option-check-icon" *ngIf="hasAnswered && selectedAnswer === key && key !== currentQuestion.respuesta_correcta">✗</span>
            </button>
          </div>

          <!-- EXPLICACIÓN / FEEDBACK -->
          <div class="feedback-card" *ngIf="hasAnswered">
            <div class="feedback-status" [class.is-correct]="selectedAnswer === currentQuestion.respuesta_correcta">
              {{ selectedAnswer === currentQuestion.respuesta_correcta ? '¡Respuesta Correcta! 🌟' : 'Respuesta Incorrecta' }}
            </div>
            <p class="feedback-explanation">{{ getExplanation(currentQuestion) }}</p>
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
        <div class="summary-card">
          
          <div class="summary-badge-wrap" [class.boss-victory-badge]="isBossQuiz">
            <span class="summary-emoji" *ngIf="!isBossQuiz">{{ quizCorrectCount >= (activeQuizQuestions.length * 0.6) ? '🎉' : '💪' }}</span>
            <span class="summary-emoji" *ngIf="isBossQuiz">👑</span>
          </div>

          <h3 class="summary-title" *ngIf="!isBossQuiz">
            {{ quizCorrectCount >= (activeQuizQuestions.length * 0.6) ? '¡Eje Temático Dominado!' : '¡Buen Intento!' }}
          </h3>
          <h3 class="summary-title boss-title-victory" *ngIf="isBossQuiz">
            ¡NÚCLEO MAESTRO DERROTADO!
          </h3>

          <p class="summary-subtitle" *ngIf="!isBossQuiz">Has completado el entrenamiento de <strong>{{ selectedAxis?.name }}</strong>.</p>
          <p class="summary-subtitle" *ngIf="isBossQuiz">Has conquistado el reto multidisciplinario diario de <strong>{{ config.title }}</strong>.</p>

          <div class="summary-stats-grid">
            <div class="summary-stat-box">
              <span class="stat-num">{{ quizCorrectCount }} / {{ activeQuizQuestions.length }}</span>
              <span class="stat-label">Aciertos</span>
            </div>
            <div class="summary-stat-box">
              <span class="stat-num">+{{ lastQuizResult?.xpEarned || 0 }}</span>
              <span class="stat-label">XP Ganada</span>
            </div>
            <div class="summary-stat-box" *ngIf="lastQuizResult?.leveledUp">
              <span class="stat-num text-gradient">Lv. {{ lastQuizResult?.newLevel }}</span>
              <span class="stat-label">¡Nuevo Nivel!</span>
            </div>
          </div>

          <button class="btn-continue-polygon" (click)="returnToPolygon()">
            Volver al Polígono de Maestría →
          </button>
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
      max-width: 900px;
      margin: 0 auto;
      padding: 1.5rem 1.25rem 4rem;
      background: transparent;
      color: #0f172a;
      font-family: inherit;
    }

    /* MODAL OVERLAY (Solo si se abre como popup flotante) */
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
      max-width: 880px;
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
      background: rgba(255, 255, 255, 0.85);
      border-radius: 20px 20px 0 0;
      backdrop-filter: blur(10px);
      margin-bottom: 1rem;
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
      padding: 0.4rem 0.85rem;
      border-radius: 10px;
      font-size: 0.82rem;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.35rem;
      transition: all 0.2s;
    }

    .btn-back-path:hover {
      background: #e2e8f0;
      color: #0f172a;
      transform: translateX(-2px);
    }

    .materia-icon {
      font-size: 2rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 0.35rem 0.55rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
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
      padding: 0.2rem 0.6rem;
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
      border-radius: 16px;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
      flex-wrap: wrap;
      margin-bottom: 1.5rem;
    }

    .stat-pill {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 0.4rem 0.85rem;
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
    }

    .polygon-container {
      position: relative;
      width: 540px;
      height: 460px;
      margin: 0 auto;
      user-select: none;
    }

    .polygon-svg {
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    .polygon-outer-ring {
      fill: rgba(0, 0, 0, 0.02);
      stroke-width: 3.5px;
      stroke-dasharray: 6 6;
      filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.08));
    }

    .polygon-spoke {
      stroke-width: 2.5px;
      stroke-dasharray: 4 4;
      transition: all 0.3s;
    }

    .polygon-spoke.spoke-active {
      stroke-width: 3.5px;
      stroke-dasharray: none;
      filter: drop-shadow(0 0 6px rgba(16, 185, 129, 0.5));
    }

    .pulsing-core {
      animation: pulseCoreGlow 3s infinite alternate ease-in-out;
    }

    @keyframes pulseCoreGlow {
      0% { transform: scale(0.92); transform-origin: 270px 230px; opacity: 0.6; }
      100% { transform: scale(1.18); transform-origin: 270px 230px; opacity: 1; }
    }

    /* VERTEX NODES */
    .vertex-node-wrapper {
      position: absolute;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      z-index: 10;
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .vertex-node-wrapper:hover {
      transform: translate(-50%, -50%) scale(1.12);
    }

    .vertex-bubble {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: #ffffff;
      border: 3.5px solid var(--axis-color, #1e3a8a);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08), 0 0 12px rgba(0, 0, 0, 0.04);
      position: relative;
      transition: all 0.2s;
    }

    .vertex-icon {
      font-size: 1.7rem;
    }

    .completed-badge {
      position: absolute;
      top: -3px;
      right: -3px;
      background: #10b981;
      color: #ffffff;
      font-size: 0.75rem;
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

    .vertex-label-card {
      margin-top: 0.45rem;
      background: #ffffff;
      border: 1px solid rgba(0, 0, 0, 0.08);
      border-radius: 10px;
      padding: 0.3rem 0.65rem;
      text-align: center;
      white-space: nowrap;
      pointer-events: none;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
    }

    .vertex-title {
      display: block;
      font-size: 0.78rem;
      font-weight: 800;
      color: #0f172a;
    }

    .vertex-status {
      display: block;
      font-size: 0.65rem;
      font-weight: 700;
      color: #64748b;
    }

    .vertex-node-wrapper.completed .vertex-status {
      color: #059669;
    }

    /* CENTRAL BOSS NODE */
    .boss-node-wrapper {
      position: absolute;
      top: 230px;
      left: 270px;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 12;
      cursor: pointer;
      transition: all 0.25s;
    }

    .boss-bubble {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      transition: all 0.3s;
    }

    .boss-node-wrapper.boss-locked .boss-bubble {
      background: #f1f5f9;
      border: 3.5px solid #cbd5e1;
      color: #94a3b8;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    }

    .boss-node-wrapper.boss-unlocked {
      animation: bossPulseFloat 2s infinite ease-in-out;
    }

    .boss-node-wrapper.boss-unlocked:hover {
      transform: translate(-50%, -50%) scale(1.12);
    }

    .boss-node-wrapper.boss-unlocked .boss-bubble {
      background: radial-gradient(circle at 35% 35%, #fef3c7, #fde047);
      border: 4px solid #f59e0b;
      box-shadow: 0 0 25px rgba(245, 158, 11, 0.6), 0 0 45px rgba(245, 158, 11, 0.3);
    }

    .boss-node-wrapper.boss-defeated .boss-bubble {
      background: radial-gradient(circle at 35% 35%, #f5f3ff, #ddd6fe);
      border: 3.5px solid #8b5cf6;
      box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
    }

    .boss-icon {
      font-size: 2.3rem;
    }

    .boss-level-tag {
      position: absolute;
      bottom: -6px;
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 99px;
      padding: 0.1rem 0.45rem;
      font-size: 0.65rem;
      font-weight: 900;
      color: #ffffff;
    }

    .boss-label-card {
      margin-top: 0.5rem;
      background: #ffffff;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 12px;
      padding: 0.35rem 0.75rem;
      text-align: center;
      white-space: nowrap;
      pointer-events: none;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
    }

    .boss-title {
      display: block;
      font-size: 0.82rem;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: 0.4px;
    }

    .boss-status {
      display: block;
      font-size: 0.68rem;
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
      margin-top: 1rem;
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

    .feedback-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 1rem 1.25rem;
      animation: fadeIn 0.3s ease;
    }

    .feedback-status {
      font-weight: 900;
      font-size: 0.95rem;
      color: #ef4444;
      margin-bottom: 0.35rem;
    }

    .feedback-status.is-correct {
      color: #10b981;
    }

    .feedback-explanation {
      font-size: 0.88rem;
      color: #475569;
      line-height: 1.55;
      margin: 0;
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
      max-width: 500px;
      width: 100%;
      background: #ffffff;
      border: 1px solid rgba(0, 0, 0, 0.08);
      border-radius: 20px;
      padding: 2.25rem 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
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

    .boss-title-victory {
      background: linear-gradient(135deg, #d97706, #dc2626, #7c3aed);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .summary-subtitle {
      font-size: 0.88rem;
      color: #64748b;
      margin: 0 0 1.5rem 0;
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
      font-size: 1.5rem;
      font-weight: 900;
      color: var(--subject-theme, #1e3a8a);
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

    .btn-continue-polygon {
      background: var(--subject-theme, #1e3a8a);
      color: #ffffff;
      padding: 0.85rem 2rem;
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

  private masteryService = inject(InfiniteMasteryService);
  private paesContent = inject(PaesContentService);
  private katexService = inject(KatexService);

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

  lastQuizResult: { leveledUp: boolean; newLevel: number; xpEarned: number } | null = null;

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
    this.config = this.masteryService.getSubjectConfig(this.materiaId);
    this.progress = this.masteryService.getProgress(this.materiaId);
    this.computePolygon();
    await this.paesContent.ensurePoolPreguntasLoaded();
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
    const cx = 270;
    const cy = 230;
    const radius = 145;

    const points: string[] = [];
    this.vertices = axes.map((axis, i) => {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      points.push(`${Math.round(x)},${Math.round(y)}`);

      return {
        axis,
        x: Math.round(x),
        y: Math.round(y),
        completed: this.progress.completedAxes.includes(axis.id)
      };
    });

    this.polygonPointsString = points.join(' ');
  }

  startAxisQuiz(axis: MasteryAxis): void {
    this.selectedAxis = axis;
    this.isBossQuiz = false;
    this.activeQuizQuestions = this.masteryService.generateAxisQuiz(this.materiaId, axis.id, 5);
    
    if (this.activeQuizQuestions.length === 0) return;

    this.currentQuestionIndex = 0;
    this.selectedAnswer = null;
    this.hasAnswered = false;
    this.quizCorrectCount = 0;
    this.viewState = 'quiz';
  }

  handleBossNodeClick(): void {
    if (!this.isBossUnlocked) return;
    this.startBossQuiz();
  }

  startBossQuiz(): void {
    this.selectedAxis = null;
    this.isBossQuiz = true;
    this.activeQuizQuestions = this.masteryService.generateBossQuiz(this.materiaId, 8);

    if (this.activeQuizQuestions.length === 0) return;

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

  getOptionText(q: PoolPregunta | null, key: 'A' | 'B' | 'C' | 'D'): string {
    if (!q || !q.alternativas) return '';
    return q.alternativas[key] || '';
  }

  getExplanation(q: PoolPregunta | null): string {
    if (!q) return '';
    if (this.selectedAnswer === q.respuesta_correcta) {
      return q.feedback_acierto || '¡Excelente razonamiento!';
    }
    return q.feedback_error || 'Revisa los conceptos clave para reforzar este tema.';
  }

  onBackToPath(): void {
    this.backToPath.emit();
  }

  closeModal(): void {
    this.close.emit();
  }
}
