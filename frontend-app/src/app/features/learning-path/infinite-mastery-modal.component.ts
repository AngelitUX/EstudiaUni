import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
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
              <h2 class="modal-title">Modo Infinito · {{ config.title }}</h2>
              <span class="modal-subtitle">Práctica infinita y dominio por ejes temáticos</span>
            </div>
          </div>
          <button class="btn-close" (click)="closeModal()" aria-label="Cerrar">&times;</button>
        </div>

        <!-- ═══ VISTA 1: POLÍGONO DE MAESTRÍA ═══ -->
        <div class="polygon-view" *ngIf="viewState === 'polygon'">
          
          <!-- TOP STATS BAR -->
          <div class="stats-ribbon">
            <div class="stat-pill">
              <span class="stat-icon">🏆</span>
              <span>Nivel de Maestría <strong>{{ progress.level }}</strong></span>
            </div>
            <div class="stat-pill">
              <span class="stat-icon">✨</span>
              <span><strong>{{ progress.xp }}</strong> XP Total</span>
            </div>
            <div class="stat-pill">
              <span class="stat-icon">🎯</span>
              <span><strong>{{ progress.completedAxes.length }}/{{ config.axes.length }}</strong> Ejes Completados</span>
            </div>
          </div>

          <!-- DYNAMIC SVG POLYGON CONTAINER -->
          <div class="polygon-container">
            <svg class="polygon-svg" viewBox="0 0 500 440">
              <defs>
                <!-- Central Core Glow Gradient -->
                <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" [attr.stop-color]="config.themeColor" stop-opacity="0.8"/>
                  <stop offset="60%" [attr.stop-color]="config.themeColor" stop-opacity="0.25"/>
                  <stop offset="100%" [attr.stop-color]="config.themeColor" stop-opacity="0"/>
                </radialGradient>
                <!-- Linear Gradient for Spokes -->
                <linearGradient id="spokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#ffffff" stop-opacity="0.4"/>
                  <stop offset="100%" [attr.stop-color]="config.themeColor" stop-opacity="0.8"/>
                </linearGradient>
              </defs>

              <!-- Central Core Glow Area -->
              <circle cx="250" cy="220" r="85" fill="url(#coreGlow)" class="pulsing-core"/>

              <!-- Outer Polygon Connecting Lines -->
              <polygon [attr.points]="polygonPointsString"
                       class="polygon-outer-ring"
                       [attr.stroke]="config.themeColor"/>

              <!-- Inner Spoke Lines from Center to Vertices -->
              <line *ngFor="let v of vertices"
                    x1="250" y1="220"
                    [attr.x2]="v.x" [attr.y2]="v.y"
                    class="polygon-spoke"
                    [attr.stroke]="v.completed ? '#f59e0b' : 'rgba(255,255,255,0.2)'"/>

              <!-- Central Orb -->
              <circle cx="250" cy="220" r="48" class="center-orb-bg"/>
              <circle cx="250" cy="220" r="48" class="center-orb-border" [attr.stroke]="config.themeColor"/>
              <text x="250" y="214" class="center-level-text">Lv. {{ progress.level }}</text>
              <text x="250" y="233" class="center-sub-text">MAESTRÍA</text>
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
                <span class="vertex-status">{{ v.completed ? 'Dominado' : 'Practicar →' }}</span>
              </div>
            </div>
          </div>

          <!-- BOTTOM INSTRUCTIONS / HELPER -->
          <div class="polygon-footer">
            <p>💡 Haz clic en cualquier eje temático para iniciar un mini-desafío de <strong>5 preguntas</strong>. Completa todos los ejes para subir tu nivel de maestría infinita.</p>
          </div>
        </div>

        <!-- ═══ VISTA 2: RUNNER DE PREGUNTAS DEL EJE ═══ -->
        <div class="quiz-view" *ngIf="viewState === 'quiz' && activeQuizQuestions.length > 0">
          
          <!-- QUIZ HEADER -->
          <div class="quiz-top-bar">
            <div class="quiz-axis-info">
              <span class="axis-pill" [style.background]="selectedAxis?.color + '22'" [style.color]="selectedAxis?.color">
                {{ selectedAxis?.icon }} {{ selectedAxis?.name }}
              </span>
              <span class="question-counter">Pregunta {{ currentQuestionIndex + 1 }} de {{ activeQuizQuestions.length }}</span>
            </div>
            <button class="btn-cancel-quiz" (click)="cancelQuiz()">✕ Salir del Desafío</button>
          </div>

          <!-- PROGRESS BAR -->
          <div class="quiz-progress-track">
            <div class="quiz-progress-fill" [style.width.%]="((currentQuestionIndex + 1) / activeQuizQuestions.length) * 100" [style.background]="selectedAxis?.color || config.themeColor"></div>
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

            <!-- ALTERNATIVES LIST -->
            <div class="options-grid">
              <button *ngFor="let key of optionKeys"
                      class="option-btn"
                      [class.selected]="selectedAnswer === key"
                      [class.correct]="hasAnswered && currentQuestion.respuesta_correcta === key"
                      [class.wrong]="hasAnswered && selectedAnswer === key && currentQuestion.respuesta_correcta !== key"
                      [disabled]="hasAnswered"
                      (click)="selectOption(key)">
                <span class="opt-letter">{{ key }}</span>
                <span class="opt-text">{{ currentQuestion.alternativas[key] }}</span>
              </button>
            </div>

            <!-- FEEDBACK PANEL AFTER ANSWERING -->
            <div class="feedback-panel" *ngIf="hasAnswered" [class.feedback-correct]="selectedAnswer === currentQuestion.respuesta_correcta" [class.feedback-wrong]="selectedAnswer !== currentQuestion.respuesta_correcta">
              <div class="feedback-header">
                <span class="feedback-icon">{{ selectedAnswer === currentQuestion.respuesta_correcta ? '🎉 ¡Correcto!' : '❌ Incorrecto' }}</span>
              </div>
              <p class="feedback-text">
                {{ selectedAnswer === currentQuestion.respuesta_correcta ? currentQuestion.feedback_acierto : currentQuestion.feedback_error }}
              </p>
            </div>
          </div>

          <!-- QUIZ BOTTOM ACTION BAR -->
          <div class="quiz-bottom-bar">
            <button *ngIf="!hasAnswered" class="btn-check primary" [disabled]="!selectedAnswer" (click)="checkAnswer()">
              Comprobar Respuesta
            </button>
            <button *ngIf="hasAnswered && currentQuestionIndex < activeQuizQuestions.length - 1" class="btn-next primary" (click)="nextQuestion()">
              Siguiente Pregunta →
            </button>
            <button *ngIf="hasAnswered && currentQuestionIndex === activeQuizQuestions.length - 1" class="btn-finish success" (click)="finishQuiz()">
              Finalizar Desafío 🏁
            </button>
          </div>
        </div>

        <!-- ═══ VISTA 3: RESUMEN / CELEBRACIÓN ═══ -->
        <div class="summary-view" *ngIf="viewState === 'summary'">
          
          <div class="celebration-badge" *ngIf="lastQuizResult?.leveledUp">
            <span class="badge-icon">🌟</span>
            <h3>¡NUEVO NIVEL DE MAESTRÍA!</h3>
            <p class="level-up-desc">Has dominado todos los ejes temáticos y ascendido a <strong>Nivel {{ lastQuizResult?.newLevel }}</strong></p>
          </div>

          <div class="summary-card" *ngIf="!lastQuizResult?.leveledUp">
            <div class="summary-icon">🎯</div>
            <h3>¡Eje {{ selectedAxis?.name }} Completado!</h3>
            <p>Has respondido <strong>{{ quizCorrectCount }} de {{ activeQuizQuestions.length }}</strong> preguntas correctamente.</p>
          </div>

          <div class="summary-stats">
            <div class="stat-box">
              <span class="stat-num">+{{ lastQuizResult?.xpEarned }}</span>
              <span class="stat-label">XP Ganada</span>
            </div>
            <div class="stat-box">
              <span class="stat-num">{{ progress.completedAxes.length }}/{{ config.axes.length }}</span>
              <span class="stat-label">Ejes del Ciclo</span>
            </div>
          </div>

          <button class="btn-continue-polygon" (click)="returnToPolygon()">
            Continuar en el Polígono ⚡
          </button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(10px);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      animation: fadeIn 0.25s ease-out;
    }

    .modal-card {
      background: #ffffff;
      width: 100%;
      max-width: 760px;
      max-height: 92vh;
      border-radius: 24px;
      border: 1.5px solid rgba(133, 92, 214, 0.2);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: relative;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.2rem 1.6rem;
      border-bottom: 1.5px solid rgba(0,0,0,0.06);
      background: #fafafa;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }

    .materia-icon {
      font-size: 1.8rem;
    }

    .modal-title {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 800;
      color: #0f172a;
    }

    .modal-subtitle {
      font-size: 0.85rem;
      color: #64748b;
      font-weight: 600;
    }

    .btn-close {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      border: 1.5px solid rgba(0,0,0,0.1);
      background: #ffffff;
      font-size: 1.2rem;
      color: #64748b;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .btn-close:hover {
      border-color: #ef4444;
      color: #ef4444;
      transform: rotate(90deg) scale(1.05);
    }

    /* ═══ VISTA POLÍGONO ═══ */
    .polygon-view {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow-y: auto;
    }

    .stats-ribbon {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
      justify-content: center;
      margin-bottom: 1rem;
    }

    .stat-pill {
      background: rgba(133, 92, 214, 0.08);
      border: 1.5px solid rgba(133, 92, 214, 0.2);
      border-radius: 99px;
      padding: 0.4rem 0.9rem;
      font-size: 0.85rem;
      color: #334155;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .polygon-container {
      position: relative;
      width: 500px;
      height: 440px;
      max-width: 100%;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .polygon-svg {
      width: 100%;
      height: 100%;
    }

    .polygon-outer-ring {
      fill: rgba(133, 92, 214, 0.03);
      stroke-width: 3.5;
      stroke-linejoin: round;
      filter: drop-shadow(0 0 8px rgba(133, 92, 214, 0.3));
    }

    .polygon-spoke {
      stroke-width: 2;
      stroke-dasharray: 4 4;
      animation: dashMove 20s linear infinite;
    }

    @keyframes dashMove {
      to { stroke-dashoffset: -100; }
    }

    .center-orb-bg {
      fill: #ffffff;
      filter: drop-shadow(0 8px 20px rgba(133, 92, 214, 0.25));
    }

    .center-orb-border {
      fill: none;
      stroke-width: 4;
    }

    .center-level-text {
      text-anchor: middle;
      font-size: 1.15rem;
      font-weight: 900;
      fill: #0f172a;
      font-family: inherit;
    }

    .center-sub-text {
      text-anchor: middle;
      font-size: 0.58rem;
      font-weight: 800;
      fill: #64748b;
      letter-spacing: 0.1em;
      font-family: inherit;
    }

    /* VERTEX OVERLAYS */
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
      transform: translate(-50%, -50%) scale(1.15);
    }

    .vertex-bubble {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      background: #ffffff;
      border: 3px solid var(--axis-color, #8b5cf6);
      box-shadow: 0 6px 16px rgba(0,0,0,0.12), 0 0 12px var(--axis-color, #8b5cf6);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      transition: all 0.25s ease;
    }

    .vertex-icon {
      font-size: 1.4rem;
    }

    .completed-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      background: #f59e0b;
      color: #ffffff;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      font-size: 0.75rem;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #ffffff;
      box-shadow: 0 2px 6px rgba(245, 158, 11, 0.5);
    }

    .vertex-node-wrapper.completed .vertex-bubble {
      border-color: #f59e0b;
      box-shadow: 0 0 16px rgba(245, 158, 11, 0.6);
      background: #fffbeb;
    }

    .vertex-label-card {
      margin-top: 0.35rem;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(4px);
      padding: 0.2rem 0.55rem;
      border-radius: 8px;
      text-align: center;
      display: flex;
      flex-direction: column;
      pointer-events: none;
      box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    }

    .vertex-title {
      font-size: 0.72rem;
      font-weight: 800;
      color: #ffffff;
      white-space: nowrap;
    }

    .vertex-status {
      font-size: 0.6rem;
      color: #94a3b8;
      font-weight: 600;
    }

    .polygon-footer {
      margin-top: 1rem;
      background: rgba(133, 92, 214, 0.05);
      border: 1.5px solid rgba(133, 92, 214, 0.15);
      border-radius: 12px;
      padding: 0.75rem 1rem;
      text-align: center;
      font-size: 0.85rem;
      color: #475569;
      max-width: 480px;
    }

    .polygon-footer p {
      margin: 0;
    }

    /* ═══ VISTA QUIZ ═══ */
    .quiz-view {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      overflow-y: auto;
    }

    .quiz-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .axis-pill {
      font-size: 0.85rem;
      font-weight: 800;
      padding: 0.35rem 0.75rem;
      border-radius: 99px;
      margin-right: 0.75rem;
    }

    .question-counter {
      font-size: 0.9rem;
      font-weight: 700;
      color: #64748b;
    }

    .btn-cancel-quiz {
      background: transparent;
      border: 1px solid rgba(0,0,0,0.12);
      padding: 0.35rem 0.75rem;
      border-radius: 8px;
      color: #64748b;
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-cancel-quiz:hover {
      border-color: #ef4444;
      color: #ef4444;
    }

    .quiz-progress-track {
      width: 100%;
      height: 6px;
      background: #e2e8f0;
      border-radius: 99px;
      overflow: hidden;
    }

    .quiz-progress-fill {
      height: 100%;
      transition: width 0.3s ease;
    }

    .preamble-box {
      background: #f8fafc;
      border-left: 4px solid var(--accent-primary, #855cd6);
      padding: 0.85rem 1rem;
      border-radius: 8px;
      font-size: 0.92rem;
      color: #334155;
      line-height: 1.45;
      margin-bottom: 0.75rem;
    }

    .question-enunciado {
      font-size: 1.05rem;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.4;
      margin: 0.5rem 0;
    }

    .options-grid {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      margin-top: 1rem;
    }

    .option-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.8rem 1rem;
      background: #ffffff;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      cursor: pointer;
      text-align: left;
      font-family: inherit;
      transition: all 0.2s;
    }

    .option-btn:hover:not([disabled]) {
      border-color: #855cd6;
      background: rgba(133, 92, 214, 0.04);
      transform: translateX(4px);
    }

    .option-btn.selected {
      border-color: #855cd6;
      background: rgba(133, 92, 214, 0.08);
      box-shadow: 0 4px 12px rgba(133, 92, 214, 0.15);
    }

    .option-btn.correct {
      border-color: #10b981 !important;
      background: #ecfdf5 !important;
    }

    .option-btn.wrong {
      border-color: #ef4444 !important;
      background: #fef2f2 !important;
    }

    .opt-letter {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      background: #f1f5f9;
      color: #475569;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      flex-shrink: 0;
    }

    .opt-text {
      font-size: 0.95rem;
      font-weight: 600;
      color: #1e293b;
    }

    .feedback-panel {
      padding: 0.9rem 1.1rem;
      border-radius: 12px;
      margin-top: 0.85rem;
      animation: fadeIn 0.2s ease-out;
    }

    .feedback-correct {
      background: #ecfdf5;
      border: 1.5px solid #a7f3d0;
      color: #065f46;
    }

    .feedback-wrong {
      background: #fef2f2;
      border: 1.5px solid #fecaca;
      color: #991b1b;
    }

    .feedback-header {
      font-weight: 800;
      font-size: 1rem;
      margin-bottom: 0.25rem;
    }

    .feedback-text {
      margin: 0;
      font-size: 0.88rem;
      line-height: 1.4;
      font-weight: 500;
    }

    .quiz-bottom-bar {
      display: flex;
      justify-content: flex-end;
      margin-top: 1rem;
    }

    .quiz-bottom-bar button {
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      font-weight: 800;
      font-size: 0.95rem;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }

    .quiz-bottom-bar button.primary {
      background: #855cd6;
      color: #ffffff;
      box-shadow: 0 4px 14px rgba(133, 92, 214, 0.35);
    }

    .quiz-bottom-bar button.success {
      background: #10b981;
      color: #ffffff;
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
    }

    .quiz-bottom-bar button:hover:not([disabled]) {
      transform: translateY(-2px);
      filter: brightness(1.08);
    }

    /* ═══ VISTA RESUMEN ═══ */
    .summary-view {
      padding: 2.5rem 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .celebration-badge {
      background: linear-gradient(135deg, #fef3c7, #fde68a);
      border: 2px solid #f59e0b;
      padding: 1.5rem;
      border-radius: 20px;
      margin-bottom: 1.5rem;
      animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .celebration-badge .badge-icon {
      font-size: 2.5rem;
      display: block;
      margin-bottom: 0.5rem;
    }

    .celebration-badge h3 {
      margin: 0;
      color: #92400e;
      font-size: 1.3rem;
      font-weight: 900;
    }

    .summary-icon {
      font-size: 3rem;
      margin-bottom: 0.5rem;
    }

    .summary-stats {
      display: flex;
      gap: 1.5rem;
      margin: 1.5rem 0;
    }

    .stat-box {
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      border-radius: 14px;
      padding: 1rem 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .stat-num {
      font-size: 1.6rem;
      font-weight: 900;
      color: #855cd6;
    }

    .stat-label {
      font-size: 0.8rem;
      font-weight: 700;
      color: #64748b;
    }

    .btn-continue-polygon {
      background: linear-gradient(135deg, #855cd6, #6b46b8);
      color: #ffffff;
      padding: 0.85rem 2rem;
      border-radius: 14px;
      border: none;
      font-size: 1rem;
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
export class InfiniteMasteryModalComponent implements OnInit {
  @Input() materiaId: string = 'mat1';
  @Output() close = new EventEmitter<void>();

  private masteryService = inject(InfiniteMasteryService);
  private katexService = inject(KatexService);

  config!: MasterySubjectConfig;
  progress!: MasteryProgress;
  vertices: PolygonVertex[] = [];
  polygonPointsString: string = '';

  readonly optionKeys: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];

  viewState: 'polygon' | 'quiz' | 'summary' = 'polygon';
  selectedAxis: MasteryAxis | null = null;
  activeQuizQuestions: PoolPregunta[] = [];
  currentQuestionIndex: number = 0;
  selectedAnswer: 'A' | 'B' | 'C' | 'D' | null = null;
  hasAnswered: boolean = false;
  quizCorrectCount: number = 0;

  lastQuizResult: { leveledUp: boolean; newLevel: number; xpEarned: number } | null = null;

  get currentQuestion(): PoolPregunta | null {
    return this.activeQuizQuestions[this.currentQuestionIndex] || null;
  }

  ngOnInit(): void {
    this.loadMasteryData();
  }

  loadMasteryData(): void {
    this.config = this.masteryService.getSubjectConfig(this.materiaId);
    this.progress = this.masteryService.getProgress(this.materiaId);
    this.computePolygon();
  }

  /**
   * Calcula dinámicamente las coordenadas de los vértices para cualquier polígono de N lados
   */
  computePolygon(): void {
    const axes = this.config.axes;
    const n = axes.length;
    const cx = 250;
    const cy = 220;
    const radius = 135;

    const points: string[] = [];
    this.vertices = axes.map((axis, i) => {
      // Ángulo regular: compensamos con -pi/2 para que el primer vértice apunte hacia arriba
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
    this.activeQuizQuestions = this.masteryService.generateAxisQuiz(this.materiaId, axis.id, 5);
    
    if (this.activeQuizQuestions.length === 0) {
      // Fallback: si no hay preguntas generadas, simular preguntas rápidas
      return;
    }

    this.currentQuestionIndex = 0;
    this.selectedAnswer = null;
    this.hasAnswered = false;
    this.quizCorrectCount = 0;
    this.viewState = 'quiz';
  }

  cancelQuiz(): void {
    this.viewState = 'polygon';
    this.selectedAxis = null;
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
    if (!this.selectedAxis) return;
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

  returnToPolygon(): void {
    this.viewState = 'polygon';
    this.selectedAxis = null;
    this.computePolygon();
  }

  renderLatex(latex: string): SafeHtml {
    return this.katexService.render(latex);
  }

  closeModal(): void {
    this.close.emit();
  }
}
