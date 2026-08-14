import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SafeHtml } from '@angular/platform-browser';
import { InfiniteMasteryService, MasteryAxis, MasterySubjectConfig, MasteryProgress } from '../../core/services/infinite-mastery.service';
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
    <div class="modal-overlay" (click)="closeModal()">
      <div class="modal-card glass-card" (click)="$event.stopPropagation()">
        
        <!-- HEADER -->
        <div class="modal-header">
          <div class="header-left">
            <span class="materia-icon">{{ config.icon }}</span>
            <div>
              <div class="title-row">
                <h2 class="modal-title">Modo Infinito · {{ config.title }}</h2>
                <span class="daily-badge">📅 Ciclo Diario</span>
              </div>
              <span class="modal-subtitle">Práctica ilimitada, maestría por ejes temáticos y desafío al Núcleo Jefe</span>
            </div>
          </div>
          <button class="btn-close" (click)="closeModal()" aria-label="Cerrar">&times;</button>
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
                  <stop offset="0%" [attr.stop-color]="isBossUnlocked ? '#f59e0b' : config.themeColor" [attr.stop-opacity]="isBossUnlocked ? '0.9' : '0.4'"/>
                  <stop offset="60%" [attr.stop-color]="isBossUnlocked ? '#fbbf24' : config.themeColor" stop-opacity="0.2"/>
                  <stop offset="100%" [attr.stop-color]="config.themeColor" stop-opacity="0"/>
                </radialGradient>
                <!-- Boss Flame Gradient -->
                <linearGradient id="bossFireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#f59e0b"/>
                  <stop offset="50%" stop-color="#ef4444"/>
                  <stop offset="100%" stop-color="#8b5cf6"/>
                </linearGradient>
              </defs>

              <!-- Outer Polygon Connecting Lines -->
              <polygon [attr.points]="polygonPointsString"
                       class="polygon-outer-ring"
                       [attr.stroke]="config.themeColor"/>

              <!-- Inner Spoke Lines from Center to Vertices -->
              <line *ngFor="let v of vertices"
                    x1="270" y1="230"
                    [attr.x2]="v.x" [attr.y2]="v.y"
                    class="polygon-spoke"
                    [class.spoke-active]="v.completed"
                    [attr.stroke]="v.completed ? '#f59e0b' : 'rgba(255,255,255,0.18)'"/>

              <!-- Background Core Glow Area -->
              <circle cx="270" cy="230" r="90" fill="url(#coreGlow)" [class.pulsing-core]="isBossUnlocked"/>
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
            <p *ngIf="!isBossUnlocked">💡 Completa los <strong>{{ config.axes.length }} ejes temáticos</strong> del día para desbloquear la batalla final del <strong>Núcleo Maestro (Jefe Multi-Eje)</strong>.</p>
            <p *ngIf="isBossUnlocked && !progress.bossDefeatedToday" class="boss-alert-text">🔥 <strong>¡Todos los ejes conquistados!</strong> Haz clic en el Núcleo Central para enfrentarte al Jefe y subir tu Nivel de Maestría.</p>
            <p *ngIf="progress.bossDefeatedToday" class="boss-victory-text">✨ <strong>¡Gran trabajo!</strong> Has derrotado al Núcleo Maestro de hoy. El ciclo se renovará a la medianoche.</p>
          </div>
        </div>

        <!-- ═══ VISTA 2: RUNNER DE PREGUNTAS DEL EJE / JEFE ═══ -->
        <div class="quiz-view" *ngIf="viewState === 'quiz' && activeQuizQuestions.length > 0">
          
          <!-- QUIZ HEADER -->
          <div class="quiz-top-bar">
            <div class="quiz-axis-info">
              <span class="axis-pill" *ngIf="!isBossQuiz" [style.background]="selectedAxis?.color + '22'" [style.color]="selectedAxis?.color">
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
          <div class="summary-card glass-card">
            
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

      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(10px);
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      animation: fadeIn 0.25s ease-out;
    }

    .modal-card {
      width: 100%;
      max-width: 860px;
      max-height: 94vh;
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 24px;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 35px rgba(133, 92, 214, 0.2);
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      color: #f8fafc;
      font-family: inherit;
    }

    /* HEADER */
    .modal-header {
      padding: 1.25rem 1.75rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(30, 41, 59, 0.5);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .materia-icon {
      font-size: 2.2rem;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 0.4rem 0.6rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .title-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .modal-title {
      font-size: 1.35rem;
      font-weight: 800;
      margin: 0;
      color: #ffffff;
      letter-spacing: -0.02em;
    }

    .daily-badge {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.2rem 0.6rem;
      border-radius: 99px;
      background: rgba(14, 165, 233, 0.15);
      border: 1px solid rgba(14, 165, 233, 0.4);
      color: #38bdf8;
    }

    .modal-subtitle {
      font-size: 0.82rem;
      color: #94a3b8;
      display: block;
      margin-top: 0.2rem;
    }

    .btn-close {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #94a3b8;
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
      background: rgba(239, 68, 68, 0.2);
      color: #ef4444;
      border-color: rgba(239, 68, 68, 0.4);
    }

    /* STATS RIBBON */
    .stats-ribbon {
      display: flex;
      gap: 0.75rem;
      padding: 0.85rem 1.75rem;
      background: rgba(15, 23, 42, 0.4);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      flex-wrap: wrap;
    }

    .stat-pill {
      background: rgba(30, 41, 59, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 0.35rem 0.85rem;
      font-size: 0.82rem;
      display: flex;
      align-items: center;
      gap: 0.45rem;
      color: #cbd5e1;
    }

    .stat-pill strong {
      color: #ffffff;
    }

    .reset-timer-pill {
      margin-left: auto;
      background: rgba(245, 158, 11, 0.12);
      border-color: rgba(245, 158, 11, 0.3);
      color: #fbbf24;
    }

    .reset-timer-pill strong {
      color: #fef3c7;
      font-family: monospace;
      font-size: 0.88rem;
    }

    /* POLYGON VIEW */
    .polygon-view {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1.5rem 1rem;
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
      fill: rgba(30, 41, 59, 0.25);
      stroke-width: 3px;
      stroke-dasharray: 6 6;
      filter: drop-shadow(0 0 10px rgba(133, 92, 214, 0.3));
    }

    .polygon-spoke {
      stroke-width: 2.5px;
      stroke-dasharray: 4 4;
      transition: all 0.3s;
    }

    .polygon-spoke.spoke-active {
      stroke-width: 3.5px;
      stroke-dasharray: none;
      filter: drop-shadow(0 0 8px #f59e0b);
    }

    .pulsing-core {
      animation: pulseCoreGlow 3s infinite alternate ease-in-out;
    }

    @keyframes pulseCoreGlow {
      0% { transform: scale(0.9); transform-origin: 270px 230px; opacity: 0.5; }
      100% { transform: scale(1.15); transform-origin: 270px 230px; opacity: 1; }
    }

    /* VERTEX NODES (HTML OVERLAY) */
    .vertex-node-wrapper {
      position: absolute;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      z-index: 10;
      transition: transform 0.2s;
    }

    .vertex-node-wrapper:hover {
      transform: translate(-50%, -50%) scale(1.1);
    }

    .vertex-bubble {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: radial-gradient(circle at 30% 30%, #334155, #0f172a);
      border: 3px solid var(--axis-color, #855cd6);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.5), 0 0 16px var(--axis-color, rgba(133, 92, 214, 0.4));
      position: relative;
      transition: all 0.2s;
    }

    .vertex-icon {
      font-size: 1.6rem;
    }

    .completed-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      background: #10b981;
      color: #ffffff;
      font-size: 0.75rem;
      font-weight: 900;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #0f172a;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
    }

    .vertex-node-wrapper.completed .vertex-bubble {
      border-color: #10b981;
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.35);
    }

    .vertex-label-card {
      margin-top: 0.4rem;
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 10px;
      padding: 0.25rem 0.6rem;
      text-align: center;
      white-space: nowrap;
      pointer-events: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }

    .vertex-title {
      display: block;
      font-size: 0.75rem;
      font-weight: 800;
      color: #f8fafc;
    }

    .vertex-status {
      display: block;
      font-size: 0.65rem;
      font-weight: 600;
      color: #94a3b8;
    }

    .vertex-node-wrapper.completed .vertex-status {
      color: #34d399;
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
      width: 76px;
      height: 76px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      transition: all 0.3s;
    }

    .boss-node-wrapper.boss-locked .boss-bubble {
      background: #1e293b;
      border: 3px solid #475569;
      opacity: 0.8;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
    }

    .boss-node-wrapper.boss-unlocked {
      animation: bossPulseFloat 2s infinite ease-in-out;
    }

    .boss-node-wrapper.boss-unlocked:hover {
      transform: translate(-50%, -50%) scale(1.12);
    }

    .boss-node-wrapper.boss-unlocked .boss-bubble {
      background: radial-gradient(circle at 35% 35%, #f59e0b, #dc2626);
      border: 4px solid #fef08a;
      box-shadow: 0 0 30px rgba(245, 158, 11, 0.8), 0 0 50px rgba(239, 68, 68, 0.5);
    }

    .boss-node-wrapper.boss-defeated .boss-bubble {
      background: radial-gradient(circle at 35% 35%, #8b5cf6, #4f46e5);
      border: 3px solid #c084fc;
      box-shadow: 0 0 25px rgba(139, 92, 246, 0.6);
    }

    .boss-icon {
      font-size: 2.2rem;
    }

    .boss-level-tag {
      position: absolute;
      bottom: -6px;
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 99px;
      padding: 0.1rem 0.45rem;
      font-size: 0.65rem;
      font-weight: 900;
      color: #f8fafc;
    }

    .boss-label-card {
      margin-top: 0.5rem;
      background: rgba(15, 23, 42, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      padding: 0.35rem 0.75rem;
      text-align: center;
      white-space: nowrap;
      pointer-events: none;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5);
    }

    .boss-title {
      display: block;
      font-size: 0.82rem;
      font-weight: 900;
      color: #ffffff;
      letter-spacing: 0.5px;
    }

    .boss-status {
      display: block;
      font-size: 0.68rem;
      font-weight: 700;
      color: #94a3b8;
    }

    .boss-status.highlight {
      color: #f59e0b;
      animation: textGlow 1.5s infinite alternate;
    }

    .boss-node-wrapper.boss-defeated .boss-status {
      color: #c084fc;
    }

    @keyframes bossPulseFloat {
      0% { transform: translate(-50%, -50%) scale(1); filter: drop-shadow(0 0 8px #f59e0b); }
      50% { transform: translate(-50%, -50%) scale(1.08); filter: drop-shadow(0 0 18px #ef4444); }
      100% { transform: translate(-50%, -50%) scale(1); filter: drop-shadow(0 0 8px #f59e0b); }
    }

    @keyframes textGlow {
      from { opacity: 0.8; }
      to { opacity: 1; filter: drop-shadow(0 0 6px #f59e0b); }
    }

    /* FOOTER */
    .polygon-footer {
      max-width: 650px;
      text-align: center;
      font-size: 0.85rem;
      color: #94a3b8;
      background: rgba(30, 41, 59, 0.4);
      padding: 0.75rem 1.5rem;
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.06);
      margin-top: 0.5rem;
    }

    .polygon-footer p {
      margin: 0;
    }

    .boss-alert-text {
      color: #fbbf24 !important;
    }

    .boss-victory-text {
      color: #c084fc !important;
    }

    /* QUIZ RUNNER VIEW */
    .quiz-view {
      padding: 1.5rem 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .quiz-top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .quiz-axis-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .axis-pill {
      padding: 0.4rem 1rem;
      border-radius: 99px;
      font-weight: 800;
      font-size: 0.85rem;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }

    .boss-pill {
      background: linear-gradient(90deg, rgba(245, 158, 11, 0.2), rgba(239, 68, 68, 0.2)) !important;
      border-color: #f59e0b !important;
      color: #fbbf24 !important;
    }

    .question-counter {
      font-size: 0.85rem;
      font-weight: 700;
      color: #94a3b8;
    }

    .btn-cancel-quiz {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #94a3b8;
      padding: 0.4rem 0.85rem;
      border-radius: 10px;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-cancel-quiz:hover {
      background: rgba(239, 68, 68, 0.15);
      color: #ef4444;
      border-color: rgba(239, 68, 68, 0.3);
    }

    .quiz-progress-track {
      width: 100%;
      height: 6px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 99px;
      overflow: hidden;
    }

    .quiz-progress-fill {
      height: 100%;
      border-radius: 99px;
      transition: width 0.3s ease;
    }

    .quiz-content {
      background: rgba(30, 41, 59, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 18px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .preamble-box {
      background: rgba(15, 23, 42, 0.6);
      border-left: 3px solid #855cd6;
      padding: 0.85rem 1.25rem;
      border-radius: 8px;
      font-size: 0.9rem;
      color: #cbd5e1;
      line-height: 1.5;
    }

    .question-image-box {
      display: flex;
      justify-content: center;
      padding: 0.5rem;
    }

    .q-image {
      max-width: 100%;
      max-height: 240px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .question-enunciado {
      font-size: 1.05rem;
      font-weight: 700;
      color: #ffffff;
      line-height: 1.6;
      margin: 0;
    }

    .formula-box {
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
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
      background: rgba(15, 23, 42, 0.6);
      border: 1.5px solid rgba(255, 255, 255, 0.1);
      border-radius: 14px;
      padding: 0.85rem 1.25rem;
      color: #f8fafc;
      font-size: 0.95rem;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s;
    }

    .option-btn:hover:not(:disabled) {
      background: rgba(133, 92, 214, 0.15);
      border-color: #855cd6;
      transform: translateX(4px);
    }

    .option-btn.selected {
      background: rgba(133, 92, 214, 0.25);
      border-color: #a78bfa;
    }

    .option-btn.correct {
      background: rgba(16, 185, 129, 0.2) !important;
      border-color: #10b981 !important;
      color: #6ee7b7;
    }

    .option-btn.incorrect {
      background: rgba(239, 68, 68, 0.2) !important;
      border-color: #ef4444 !important;
      color: #fca5a5;
    }

    .option-key {
      font-weight: 900;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .option-text {
      flex: 1;
      line-height: 1.4;
    }

    .option-check-icon {
      font-weight: 900;
      font-size: 1.1rem;
    }

    .feedback-card {
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.1);
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
      font-size: 0.85rem;
      color: #cbd5e1;
      line-height: 1.5;
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
      background: #855cd6;
      color: #ffffff;
      box-shadow: 0 4px 14px rgba(133, 92, 214, 0.4);
    }

    .btn-check:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      box-shadow: none;
    }

    .btn-next {
      background: #3b82f6;
      color: #ffffff;
      box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
    }

    .btn-finish {
      background: linear-gradient(135deg, #10b981, #059669);
      color: #ffffff;
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
    }

    /* SUMMARY VIEW */
    .summary-view {
      padding: 2.5rem 1.5rem;
      display: flex;
      justify-content: center;
    }

    .summary-card {
      max-width: 500px;
      width: 100%;
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 20px;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .summary-badge-wrap {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: rgba(133, 92, 214, 0.15);
      border: 2px solid #855cd6;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
    }

    .boss-victory-badge {
      background: radial-gradient(circle, rgba(245, 158, 11, 0.3), rgba(239, 68, 68, 0.3)) !important;
      border-color: #f59e0b !important;
      box-shadow: 0 0 25px rgba(245, 158, 11, 0.5);
    }

    .summary-emoji {
      font-size: 2.5rem;
    }

    .summary-title {
      font-size: 1.4rem;
      font-weight: 900;
      color: #ffffff;
      margin: 0 0 0.5rem 0;
    }

    .boss-title-victory {
      background: linear-gradient(135deg, #fbbf24, #f87171, #c084fc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .summary-subtitle {
      font-size: 0.88rem;
      color: #94a3b8;
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
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .stat-num {
      font-size: 1.5rem;
      font-weight: 900;
      color: #855cd6;
    }

    .text-gradient {
      background: linear-gradient(135deg, #38bdf8, #818cf8);
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
      background: linear-gradient(135deg, #855cd6, #6b46b8);
      color: #ffffff;
      padding: 0.85rem 2rem;
      border-radius: 14px;
      border: none;
      font-size: 0.95rem;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 6px 18px rgba(133, 92, 214, 0.35);
      transition: all 0.2s;
    }

    .btn-continue-polygon:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(133, 92, 214, 0.45);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.96); }
      to { opacity: 1; transform: scale(1); }
    }
  `]
})
export class InfiniteMasteryModalComponent implements OnInit, OnDestroy {
  @Input() materiaId: string = 'mat1';
  @Output() close = new EventEmitter<void>();

  private masteryService = inject(InfiniteMasteryService);
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

  loadMasteryData(): void {
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

    // Si el contador llega a cero, refrescar datos
    if (totalSecs === 0) {
      this.loadMasteryData();
    }
  }

  /**
   * Calcula dinámicamente las coordenadas de los vértices para cualquier polígono de N lados (3, 4, 5...)
   */
  computePolygon(): void {
    const axes = this.config.axes;
    const n = axes.length;
    const cx = 270;
    const cy = 230;
    const radius = 145;

    const points: string[] = [];
    this.vertices = axes.map((axis, i) => {
      // Ángulo regular: compensamos con -pi/2 para que el primer vértice apunte hacia arriba (12 en punto)
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

  closeModal(): void {
    this.close.emit();
  }
}
