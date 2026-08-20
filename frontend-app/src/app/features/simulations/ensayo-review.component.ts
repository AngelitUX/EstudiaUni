import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FirestoreService, Intento, Pregunta } from '../../core/services/firestore.service';
import { PaymentService } from '../../core/services/payment.service';
import { Auth } from '@angular/fire/auth';
import { from, map, forkJoin, of, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminService } from '../admin/services/admin.service';
import { AiAssistService, FocoTokensExhaustedError } from '../../core/services/ai-assist.service';
import { ToastService } from '../../core/services/toast.service';
import { formatFocoMessage } from '../../core/utils/foco-message-format';
import { FocoTokensBadgeComponent } from '../../shared/components/foco-tokens-badge.component';

interface ReviewQuestion {
  id: number;
  stem: string;
  options: { id: string; text: string }[];
  userAnswer: string | null;
  correctAnswer: string | null;
  isCorrect: boolean;
  explanation: {
    whyWrong?: string;
    correctSolution: string;
    tip: string;
  };
  imageUrl?: string | null;
  readingText?: string[] | null;
  tema?: string;
}

@Component({
  selector: 'app-ensayo-review',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, FocoTokensBadgeComponent],
  template: `
    <div class="review-container animate-fade-in">
      <!-- LOADING OVERLAY -->
      <div class="loading-overlay" *ngIf="loading">
        <div class="spinner"></div>
        <p>Calculando resultados...</p>
      </div>

      <!-- RESULTS LOCKED VIEW (3-Hour Delay for Free Users) -->
      <div class="results-locked-container animate-fade-in" *ngIf="!loading && resultsLocked" style="min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 2rem;">
        <div class="locked-card glass-card" style="background: #ffffff; padding: 3rem 2.5rem; border-radius: 28px; max-width: 600px; width: 100%; text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.1); border: 2px solid rgba(124,58,237,0.2);">
          <div style="font-size: 4rem; margin-bottom: 1rem;">⏳</div>
          <h2 style="font-size: 1.85rem; font-weight: 900; color: #0f172a; margin: 0 0 0.5rem;">Resultados en Preparación</h2>
          <span style="background: rgba(245,158,11,0.15); color: #b45309; padding: 0.38rem 0.85rem; border-radius: 99px; font-weight: 800; font-size: 0.82rem; display: inline-block; margin-bottom: 1.5rem;">
            Plan Básico (Liberación en 3 Horas)
          </span>
          
          <p style="color: #475569; font-size: 1rem; line-height: 1.6; margin-bottom: 2rem;">
            ¡Ensayo completado con éxito! 🎯 En el Plan Básico, tus resultados, puntaje PAES y pauta explicada se liberan automáticamente <strong>3 horas después</strong> de rendir la prueba.
          </p>

          <div style="background: rgba(124,58,237,0.06); border: 2px solid rgba(124,58,237,0.2); padding: 1.5rem; border-radius: 18px; margin-bottom: 2rem;">
            <span style="font-size: 0.85rem; font-weight: 700; color: #6d28d9; text-transform: uppercase; letter-spacing: 1px;">Disponible en:</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: #7c3aed; font-family: monospace; margin-top: 0.4rem;">
              {{ countdownTimerText }}
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.85rem;">
            <button (click)="paymentService.openPricingModal()" style="background: linear-gradient(135deg,#7c3aed,#5b21b6); color: #fff; border: none; padding: 1rem 1.5rem; border-radius: 14px; font-weight: 800; font-size: 1.05rem; cursor: pointer; box-shadow: 0 8px 20px rgba(124,58,237,0.3); transition: all 0.2s;">
              Desbloquear Resultados de Inmediato con PRO 👑
            </button>
            <button routerLink="/ensayos" style="background: #f1f5f9; color: #475569; border: 1.5px solid #cbd5e1; padding: 0.85rem 1.5rem; border-radius: 14px; font-weight: 700; font-size: 0.95rem; cursor: pointer;">
              ← Volver a Ensayos PAES
            </button>
            <button *ngIf="!isProduction" (click)="devResetTimeLimits()" style="background: rgba(239, 68, 68, 0.08); border: 1.5px dashed rgba(239, 68, 68, 0.4); color: #ef4444; padding: 0.75rem 1rem; border-radius: 14px; font-weight: 800; font-size: 0.85rem; cursor: pointer; margin-top: 0.5rem;">
              🧪 [DEV] Simular paso de tiempo (Liberar Resultados Ahora)
            </button>
          </div>
        </div>
      </div>

      <!-- NOT FOUND: no attempt data exists to review (e.g. it was never saved) -->
      <div class="results-locked-container animate-fade-in" *ngIf="!loading && !resultsLocked && notFound" style="min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 2rem;">
        <div class="locked-card glass-card" style="background: #ffffff; padding: 3rem 2.5rem; border-radius: 28px; max-width: 600px; width: 100%; text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.1); border: 2px solid rgba(148,163,184,0.3);">
          <div style="font-size: 4rem; margin-bottom: 1rem;">🔍</div>
          <h2 style="font-size: 1.85rem; font-weight: 900; color: #0f172a; margin: 0 0 0.5rem;">No encontramos este ensayo</h2>
          <p style="color: #475569; font-size: 1rem; line-height: 1.6; margin-bottom: 2rem;">
            No pudimos cargar los resultados de este intento. Puede que no se haya guardado correctamente (por ejemplo, por un problema de conexión al iniciarlo). Si acabas de terminar un ensayo y esto te aparece, intenta rendirlo de nuevo.
          </p>
          <button routerLink="/ensayos" style="background: linear-gradient(135deg,#7c3aed,#5b21b6); color: #fff; border: none; padding: 1rem 1.5rem; border-radius: 14px; font-weight: 800; font-size: 1.05rem; cursor: pointer; box-shadow: 0 8px 20px rgba(124,58,237,0.3); width: 100%;">
            ← Volver a Ensayos PAES
          </button>
        </div>
      </div>

      <ng-container *ngIf="!loading && !resultsLocked && !notFound">
        <!-- HEADER -->
        <header class="review-header">
          <div style="display: flex; align-items: center; gap: 2rem; flex-wrap: wrap;">
            <div class="header-left">
              <button class="btn-back" routerLink="/ensayos">← Volver</button>
              <div class="header-info">
                <h1>Revisión: {{ examTitle }}</h1>
                <p class="header-subtitle">Revisa tus respuestas y aprende de los errores</p>
              </div>
            </div>
            
            <div class="header-actions" style="display: flex; gap: 1rem; align-items: center;">
            <app-foco-tokens-badge></app-foco-tokens-badge>
            <button class="btn btn-primary btn-sm" routerLink="/ensayos" style="padding: 0.75rem 1.5rem; font-size: 0.9rem;">
              Finalizar
            </button>
            </div>
          </div>
        
        <div class="header-score">
          <div class="score-details">
            <div class="score-points-row">
              <span class="score-points">{{ score }} <small>/ 1000</small> pts</span>
              <div class="info-icon-container">
                <span class="info-icon-sm">i</span>
                <div class="info-tooltip">
                  Puntaje estimado de forma lineal. El puntaje oficial puede variar según la curva de transformación del DEMRE.
                </div>
              </div>
            </div>
            <span class="score-breakdown">{{ correctCount }}/{{ totalQuestions }} correctas</span>
            <span class="mastery-msg">Lograste un <strong>{{ scorePercentage }}% de dominio</strong> en esta prueba</span>
            <span class="points-per-q-msg">Cada respuesta correcta suma aproximadamente <strong>{{ pointsPerQuestion }}</strong> puntos.</span>
          </div>
        </div>
      </header>

      <!-- MAIN CONTENT -->
      <div class="review-body animate-slide-up">
        <!-- SUMMARY CARDS -->
        <div class="summary-cards">
          <div class="summary-card correct">
            <span class="summary-icon">✅</span>
            <span class="summary-value">{{ correctCount }}</span>
            <span class="summary-label">Correctas</span>
          </div>
          <div class="summary-card incorrect">
            <span class="summary-icon">❌</span>
            <span class="summary-value">{{ incorrectCount }}</span>
            <span class="summary-label">Incorrectas</span>
          </div>
          <div class="summary-card omitted">
            <span class="summary-icon">⏭️</span>
            <span class="summary-value">{{ omittedCount }}</span>
            <span class="summary-label">Omitidas</span>
          </div>
        </div>

        <!-- FILTER TABS -->
        <div class="filter-tabs">
          <button 
            class="tab"
            [class.active]="activeFilter === 'all'"
            (click)="activeFilter = 'all'">
            Todas ({{ totalQuestions }})
          </button>
          <button 
            class="tab"
            [class.active]="activeFilter === 'incorrect'"
            (click)="activeFilter = 'incorrect'">
            ❌ Incorrectas ({{ incorrectCount }})
          </button>
          <button 
            class="tab"
            [class.active]="activeFilter === 'correct'"
            (click)="activeFilter = 'correct'">
            ✅ Correctas ({{ correctCount }})
          </button>
          <button 
            class="tab"
            [class.active]="activeFilter === 'omitted'"
            (click)="activeFilter = 'omitted'">
            ⏭️ Omitidas ({{ omittedCount }})
          </button>
        </div>

        <!-- QUESTIONS LIST -->
        <div class="questions-list">
          <div 
            *ngFor="let question of filteredQuestions; let i = index"
            class="review-question-card glass-card"
            [class.correct]="question.isCorrect"
            [class.incorrect]="!question.isCorrect && question.userAnswer"
            [class.omitted]="!question.userAnswer">

            <div class="question-header">
              <span class="question-badge" [ngClass]="{'correct': question.isCorrect, 'incorrect': !question.isCorrect && question.userAnswer, 'omitted': !question.userAnswer}">
                {{ question.isCorrect ? '✅ Correcta' : (!question.userAnswer ? '⏭️ Omitida' : '❌ Incorrecta') }}
              </span>
              <span class="question-number">Pregunta {{ question.id }}</span>
            </div>

            <div class="reading-text-container" *ngIf="question.readingText as readingText">
              <div class="reading-text-label">📖 Texto de lectura</div>
              <div class="reading-images">
                <img *ngFor="let imgUrl of readingText" [src]="imgUrl" alt="Texto de lectura" class="reading-image">
              </div>
            </div>

            <div class="question-stem">
              <div *ngIf="question.imageUrl" class="question-image-container">
                <img [src]="question.imageUrl" alt="Pregunta" class="question-image">
              </div>
              <p *ngIf="!question.imageUrl">{{ question.stem }}</p>
            </div>

            <div class="options-list">
              <div
                *ngFor="let opt of question.options"
                class="option-review"
                [class.user-selected]="question.userAnswer === opt.id"
                [class.correct-answer]="question.userAnswer && question.correctAnswer === opt.id && (isProPlan || question.isCorrect)"
                [class.wrong-answer]="question.userAnswer === opt.id && question.correctAnswer !== opt.id">

                <span class="option-id">{{ opt.id }}</span>
                <span class="option-text">{{ opt.text }}</span>

                <span class="option-indicator" *ngIf="question.userAnswer && question.correctAnswer === opt.id && (isProPlan || question.isCorrect)">✓ Correcta</span>
                <span class="option-indicator wrong" *ngIf="question.userAnswer === opt.id && question.correctAnswer !== opt.id">✗ Tu respuesta</span>
              </div>
            </div>

            <!-- Free plan: don't reveal which option was correct on a wrong answer — upsell instead -->
            <p class="locked-answer-note" *ngIf="!isProPlan && question.userAnswer && !question.isCorrect">
              🔒 <a (click)="paymentService.openPricingModal()">Actualiza a PRO</a> para ver cuál era la respuesta correcta y pedirle a Foco que te explique en qué te equivocaste.
            </p>

            <!-- Pro plan: ask Foco to explain the correct process + the student's specific mistake -->
            <button
              class="btn-ask-foco"
              *ngIf="isProPlan && question.userAnswer && !question.isCorrect"
              (click)="openFocoForQuestion(question)">
              🐙 Preguntarle a Foco por qué me equivoqué
            </button>
          </div>
        </div>

        <!-- ACTIONS MOVED TO HEADER -->

        <!-- MODAL MEJORADOR DE PUNTAJE -->
        <div class="modal-overlay animate-fade-in" *ngIf="mostrarModalMejorador" (click)="mostrarModalMejorador = false">
          <div class="modal-card animate-scale-up" (click)="$event.stopPropagation()" style="max-width: 500px;">
            <div class="modal-icon" style="font-size: 3.8rem; filter: drop-shadow(0 4px 10px rgba(99,102,241,0.2)); margin-bottom: 0.75rem;">📈</div>
            <h2 style="font-size: 1.85rem; font-weight: 800; color: #0f172a !important; margin-bottom: 0.5rem; letter-spacing: -0.02em;">Mejorador de Puntaje</h2>
            <p style="color: #475569 !important; font-size: 0.98rem; line-height: 1.6; margin: 0.5rem 0 1.75rem; text-align: center; font-weight: 600;">
              ¿Cómo prefieres potenciar tu rendimiento hoy? Selecciona una de las siguientes opciones inteligentes diseñadas para fortalecer tus debilidades:
            </p>
            
            <div class="mejorador-options-list" style="display: flex; flex-direction: column; gap: 1rem; width: 100%; margin-bottom: 1.5rem;">
              <!-- OPCIÓN 1: RUTA DE APRENDIZAJE -->
              <button class="mejorador-opt-btn" (click)="irARutaDeAprendizaje()" style="display: flex; align-items: center; gap: 1.25rem; padding: 1.2rem; border: 2px solid rgba(99, 102, 241, 0.15); border-radius: 16px; background: #ffffff !important; cursor: pointer; transition: all 0.25s; text-align: left; width: 100%; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.03);">
                <span style="font-size: 2.4rem; filter: drop-shadow(0 2px 4px rgba(99,102,241,0.25)); flex-shrink: 0;">🗺️</span>
                <div>
                  <div style="font-weight: 800; font-size: 1.12rem; color: #0f172a !important; margin-bottom: 0.25rem;">Reforzar en Ruta de Aprendizaje</div>
                  <div style="font-size: 0.88rem; color: #475569 !important; font-weight: 600; line-height: 1.45;">Estudia y domina los temas conceptuales específicos en los que tuviste fallos.</div>
                </div>
              </button>

              <!-- OPCIÓN 2: MINI ENSAYO -->
              <button class="mejorador-opt-btn" (click)="aceptarMejorador()" style="display: flex; align-items: center; gap: 1.25rem; padding: 1.2rem; border: 2px solid rgba(139, 92, 246, 0.15); border-radius: 16px; background: #ffffff !important; cursor: pointer; transition: all 0.25s; text-align: left; width: 100%; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.03);">
                <span style="font-size: 2.4rem; filter: drop-shadow(0 2px 4px rgba(139, 92, 246, 0.25)); flex-shrink: 0;">🎯</span>
                <div>
                  <div style="font-weight: 800; font-size: 1.12rem; color: #0f172a !important; margin-bottom: 0.25rem;">Iniciar Mini Ensayo Personalizado</div>
                  <div style="font-size: 0.88rem; color: #475569 !important; font-weight: 600; line-height: 1.45;">Un ensayo personalizado y único diseñado por la Inteligencia Artificial a tu medida para fortalecer tus debilidades y acelerar al máximo la mejora de tu rendimiento.</div>
                </div>
              </button>
            </div>

            <button class="btn-cancel" (click)="mostrarModalMejorador = false" style="width: 100%; padding: 0.9rem; border-radius: 12px; font-weight: 700; cursor: pointer; border: 1.5px solid rgba(0,0,0,0.08); background: #f1f5f9; color: #475569; transition: all 0.2s;">Quizás más tarde</button>
          </div>
        </div>

        <!-- FOCO REVIEW CHAT (Pro): docked panel, not a blocking modal — the
             question stays visible/scrollable next to (desktop) or above
             (mobile) the chat while it's open. -->
        <div class="foco-chat-card animate-fade-in" *ngIf="activeChatQuestion">
          <div class="foco-chat-header">
            <div class="foco-chat-header-left">
              <span class="foco-chat-avatar">🐙</span>
              <div>
                <h4>Foco, tu Pulpo Tutor</h4>
                <span class="foco-chat-status">{{ chatLoading ? 'Pensando...' : 'En línea' }}</span>
              </div>
            </div>
            <button class="foco-chat-close" (click)="closeFocoChat()" aria-label="Cerrar tutor">✕</button>
          </div>

          <div class="foco-chat-messages" #focoChatScroll>
            <div *ngFor="let msg of chatMessages" class="foco-chat-msg" [class.user]="msg.role === 'user'" [class.assistant]="msg.role === 'assistant'" [innerHTML]="msg.role === 'assistant' ? formatFocoMessage(msg.content) : msg.content">
            </div>
            <div class="foco-chat-msg assistant loading" *ngIf="chatLoading">
              <span class="foco-typing-dot"></span><span class="foco-typing-dot"></span><span class="foco-typing-dot"></span>
            </div>
          </div>

          <div class="foco-chat-input-area">
            <textarea
              class="foco-chat-input"
              [(ngModel)]="chatInputText"
              (keydown.enter)="onFocoEnterKey($event)"
              [disabled]="chatLoading"
              placeholder="Escribe tu pregunta de seguimiento... (Enter para enviar)"
              rows="2"
              maxlength="300">
            </textarea>
            <button class="foco-chat-send" (click)="sendFocoFollowUp()" [disabled]="chatLoading || !chatInputText.trim()" aria-label="Enviar">➤</button>
          </div>
        </div>
      </div>
      </ng-container>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: #f8fafc;
      color: #1e293b;
    }
    
    .review-container { min-height: 100vh; }
    
    /* MODAL STYLES */
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(8, 10, 18, 0.75); backdrop-filter: blur(12px) saturate(180%); display: flex; align-items: center; justify-content: center; z-index: 99999 !important; }
    .modal-card { background: #ffffff !important; padding: 3rem 2.5rem 2.5rem; border-radius: 24px; max-width: 500px; width: 90%; text-align: center; box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25) !important; border: 1px solid rgba(15, 23, 42, 0.08) !important; }
    .modal-icon { font-size: 3.5rem; margin-bottom: 1.25rem; }
    .modal-card h2 { font-family: var(--font-heading); font-size: 1.75rem; font-weight: 800; margin: 0 0 0.5rem; color: #0f172a !important; }
    
    .mejorador-opt-btn { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
    .mejorador-opt-btn:hover { border-color: #6366f1 !important; background: rgba(99, 102, 241, 0.05) !important; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(99, 102, 241, 0.12); }
    .btn-cancel { transition: all 0.25s; }
    .btn-cancel:hover { background: #cbd5e1 !important; color: #0f172a !important; }
    
    .animate-fade-in { animation: none; opacity: 1; }
    .animate-scale-up { animation: none; opacity: 1; transform: none; }
    .animate-slide-up { animation: none; opacity: 1; transform: none; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    
    /* ===== HEADER ===== */
    /* Not sticky on purpose: this header is tall (title row + full score
       breakdown), so pinning it ate a large chunk of the viewport for the
       whole scroll through the question list. It only needs to be seen once. */
    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 2rem;
      background: #ffffff;
      border-bottom: 2px solid #e2e8f0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .header-left { display: flex; align-items: center; gap: 1.5rem; }
    .btn-back {
      background: #f1f5f9;
      border: 2px solid #e2e8f0;
      color: #475569;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s;
      font-weight: 600;
    }
    .btn-back:hover { background: #e2e8f0; color: #1e293b; }
    .header-info h1 {
      font-size: 1.5rem;
      font-weight: 800;
      color: #0f172a;
      margin: 0;
    }
    .header-subtitle { color: #64748b; font-size: 0.95rem; margin-top: 0.25rem; }
    
    .score-details { display: flex; flex-direction: column; gap: 0.25rem; }
    .score-points-row { display: flex; align-items: center; gap: 0.5rem; }
    .score-points { font-size: 1.5rem; font-weight: 800; color: #0f172a; }
    .info-icon-container { position: relative; display: flex; align-items: center; }
    .info-icon-sm {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #e2e8f0;
      color: #64748b;
      font-size: 0.7rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: help;
      font-style: italic;
    }
    .info-tooltip {
      position: absolute;
      bottom: 50%;
      right: 130%;
      transform: translateY(50%);
      width: 240px;
      padding: 0.75rem;
      background: #1e293b;
      color: #fff;
      font-size: 0.75rem;
      border-radius: 8px;
      box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
      visibility: hidden;
      opacity: 0;
      transition: all 0.2s;
      z-index: 200;
      line-height: 1.4;
      pointer-events: none;
    }
    .info-tooltip::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 100%;
      margin-top: -6px;
      border: 6px solid transparent;
      border-left-color: #1e293b;
    }
    .info-icon-container:hover .info-tooltip { visibility: visible; opacity: 1; transform: translateY(50%) translateX(-5px); }

    .score-breakdown { color: #64748b; font-size: 0.9rem; font-weight: 600; }
    .mastery-msg { font-size: 0.8rem; color: #475569; margin-top: 0.25rem; }
    .mastery-msg strong { color: #855cd6; }
    .points-per-q-msg { font-size: 0.75rem; color: #64748b; margin-top: 0.1rem; }
    .points-per-q-msg strong { color: #10b981; }

    .score-points small { font-size: 0.9rem; color: #94a3b8; font-weight: 600; }

    /* ===== BODY ===== */
    .review-body { max-width: 1000px; margin: 0 auto; padding: 2rem; }

    /* ===== SUMMARY CARDS ===== */
    .summary-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 2rem; }
    .summary-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1.25rem;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .summary-card.correct { border-top: 4px solid #10b981; }
    .summary-card.incorrect { border-top: 4px solid #ef4444; }
    .summary-card.omitted { border-top: 4px solid #94a3b8; }
    .summary-icon { font-size: 1.25rem; margin-bottom: 0.25rem; }
    .summary-value { font-size: 1.75rem; font-weight: 800; color: #0f172a; }
    .summary-label { color: #64748b; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.025em; }

    /* ===== TABS ===== */
    .filter-tabs { display: flex; gap: 0.75rem; margin-bottom: 2rem; }
    .tab {
      padding: 0.6rem 1.2rem;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      color: #64748b;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .tab.active { background: #3b82f6; border-color: #3b82f6; color: #ffffff; }
    .tab:hover:not(.active) { background: #f8fafc; border-color: #cbd5e1; }

    /* ===== QUESTIONS ===== */
    .questions-list { display: flex; flex-direction: column; gap: 1.5rem; }
    .review-question-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .review-question-card.correct { border-left: 4px solid #10b981; }
    .review-question-card.incorrect { border-left: 4px solid #ef4444; }
    .review-question-card.omitted { border-left: 4px solid #94a3b8; }

    .question-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.5rem; }
    .question-badge {
      padding: 0.35rem 0.75rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
    }
    .question-badge.correct { background: #ecfdf5; color: #059669; }
    .question-badge.incorrect { background: #fef2f2; color: #dc2626; }
    .question-badge.omitted { background: #f1f5f9; color: #475569; }
    
    .question-stem { font-size: 1.1rem; color: #1e293b; margin-bottom: 1.5rem; line-height: 1.6; }

    /* ===== READING TEXT (Competencia Lectora) ===== */
    .reading-text-container {
      margin-bottom: 1.5rem;
      padding: 1.25rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      max-height: 60vh;
      overflow-y: auto;
    }
    .reading-text-label { font-weight: 700; color: #475569; font-size: 0.85rem; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.02em; }
    .reading-images { display: flex; flex-direction: column; gap: 0.75rem; }
    .reading-image { max-width: 100%; height: auto; border-radius: 6px; }
    
    /* ===== OPTIONS ===== */
    .options-list { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
    .option-review {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #f8fafc;
      border: 2px solid #e2e8f0;
      border-radius: 10px;
      font-size: 0.95rem;
    }
    .option-review.correct-answer { border-color: #10b981; background: #f0fdf4; }
    .option-review.wrong-answer { border-color: #ef4444; background: #fef2f2; }
    .option-id {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #e2e8f0;
      border-radius: 6px;
      font-weight: 800;
      flex-shrink: 0;
    }
    .option-review.correct-answer .option-id { background: #10b981; color: #fff; }
    .option-review.wrong-answer .option-id { background: #ef4444; color: #fff; }

    /* ===== FREE PLAN LOCKED-ANSWER UPSELL ===== */
    .locked-answer-note {
      margin-top: 1rem;
      padding: 0.85rem 1rem;
      background: rgba(245, 158, 11, 0.08);
      border: 1.5px dashed rgba(245, 158, 11, 0.35);
      border-radius: 10px;
      color: #92400e;
      font-size: 0.88rem;
      font-weight: 600;
      line-height: 1.5;
    }
    .locked-answer-note a { color: #7c3aed; text-decoration: underline; cursor: pointer; font-weight: 800; }

    /* ===== ASK FOCO BUTTON (Pro) ===== */
    .btn-ask-foco {
      margin-top: 1rem;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.7rem 1.25rem;
      background: linear-gradient(135deg, #7c3aed, #4338ca);
      color: #fff;
      border: none;
      border-radius: 12px;
      font-weight: 800;
      font-size: 0.9rem;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .btn-ask-foco:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(124, 58, 237, 0.35); }

    /* ===== FOCO REVIEW CHAT (docked panel, not a blocking modal) =====
       Deliberately NOT centered over a dark backdrop: the whole point is to
       read Foco's explanation while the question card stays visible, so this
       docks to the right edge on desktop (question list keeps scrolling
       underneath/beside it) and becomes a bottom sheet on mobile that leaves
       the top of the screen — where the question is — uncovered. */
    .foco-chat-card {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: min(400px, 100vw);
      height: 100vh;
      max-height: 100vh;
      background: #ffffff;
      border-radius: 20px 0 0 20px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 5000;
      box-shadow: -12px 0 40px -12px rgba(15, 23, 42, 0.35);
    }
    .foco-chat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.25rem;
      background: #f8fafc;
      border-bottom: 2px solid #e2e8f0;
      flex-shrink: 0;
    }
    .foco-chat-header-left { display: flex; align-items: center; gap: 0.75rem; }
    .foco-chat-avatar {
      width: 44px; height: 44px; border-radius: 50%;
      background: linear-gradient(135deg, #7c3aed, #4338ca);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.4rem; flex-shrink: 0;
    }
    .foco-chat-header-left h4 { margin: 0; font-size: 0.95rem; font-weight: 800; color: #1e293b; }
    .foco-chat-status { font-size: 0.72rem; color: #10b981; font-weight: 600; }
    .foco-chat-close {
      background: #f1f5f9; border: 1px solid #e2e8f0; color: #64748b;
      width: 30px; height: 30px; border-radius: 8px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
    }
    .foco-chat-close:hover { background: #e2e8f0; color: #1e293b; }
    .foco-chat-messages {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }
    .foco-chat-msg {
      max-width: 85%;
      padding: 0.75rem 1rem;
      border-radius: 14px;
      font-size: 0.92rem;
      line-height: 1.55;
      white-space: pre-wrap;
    }
    .foco-chat-msg.user {
      align-self: flex-end;
      background: #ede9fe;
      color: #4c1d95;
      border-bottom-right-radius: 4px;
    }
    .foco-chat-msg.assistant {
      align-self: flex-start;
      background: #f1f5f9;
      color: #1e293b;
      border-bottom-left-radius: 4px;
    }
    .foco-chat-msg.loading { display: flex; gap: 0.3rem; align-items: center; padding: 1rem; }
    .foco-typing-dot {
      width: 7px; height: 7px; border-radius: 50%; background: #94a3b8;
      animation: focoTypingBounce 1.2s infinite ease-in-out;
    }
    .foco-typing-dot:nth-child(2) { animation-delay: 0.15s; }
    .foco-typing-dot:nth-child(3) { animation-delay: 0.3s; }
    @keyframes focoTypingBounce { 0%, 60%, 100% { transform: translateY(0); opacity: 0.6; } 30% { transform: translateY(-4px); opacity: 1; } }
    .foco-chat-input-area {
      flex-shrink: 0;
      display: flex;
      gap: 0.6rem;
      padding: 0.85rem 1rem;
      border-top: 2px solid #e2e8f0;
      background: #ffffff;
    }
    .foco-chat-input {
      flex: 1;
      resize: none;
      border: 1.5px solid #e2e8f0;
      border-radius: 10px;
      padding: 0.6rem 0.75rem;
      font-size: 0.9rem;
      font-family: inherit;
      color: #1e293b;
    }
    .foco-chat-input:focus { outline: none; border-color: #7c3aed; box-shadow: 0 0 0 2px rgba(124,58,237,0.12); }
    .foco-chat-input:disabled { opacity: 0.6; background: #f1f5f9; }
    .foco-chat-send {
      width: 42px; height: 42px; border-radius: 10px; border: none; flex-shrink: 0;
      background: linear-gradient(135deg, #7c3aed, #4338ca); color: #fff;
      font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center;
    }
    .foco-chat-send:disabled { opacity: 0.5; cursor: not-allowed; }

    /* Math/markdown rendering inside Foco's messages (see formatFocoMessage) */
    .foco-chat-msg strong { font-weight: 800; }
    .foco-chat-msg em { font-style: italic; }
    .math-block {
      display: block;
      margin: 0.5rem auto;
      text-align: center;
      padding: 0.6rem;
      background: rgba(241, 245, 249, 0.7);
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-family: 'Cambria Math', 'Times New Roman', Times, serif, monospace;
      font-size: 1rem;
      color: #0f172a;
      overflow-x: auto;
      white-space: nowrap;
    }
    .math-inline {
      font-family: 'Cambria Math', 'Times New Roman', Times, serif, monospace;
      font-weight: 600;
      color: #1d4ed8;
      padding: 0 2px;
    }
    .math-fraction {
      display: inline-flex;
      flex-direction: column;
      vertical-align: middle;
      text-align: center;
      padding: 0 4px;
      line-height: 1.1;
      font-size: 0.88em;
    }
    .fraction-num { border-bottom: 1.5px solid #475569; padding-bottom: 1px; }
    .fraction-den { padding-top: 1px; }
    .math-vector { position: relative; display: inline-block; padding-top: 0.1em; font-weight: 700; }
    .math-vector::before {
      content: "→"; position: absolute; top: -0.45em; left: 50%;
      transform: translateX(-50%) scale(0.7, 0.5); font-size: 0.7em; font-weight: bold; line-height: 1;
    }
    .math-hat { position: relative; display: inline-block; padding-top: 0.05em; font-weight: 700; }
    .math-hat::before {
      content: "^"; position: absolute; top: -0.4em; left: 50%;
      transform: translateX(-50%) scale(1.1, 0.7); font-size: 0.8em; font-weight: bold; line-height: 1;
    }

    @media (max-width: 768px) {
      /* Bottom sheet instead of a right-docked panel: leaves the top of the
         screen (where the question card is) visible above it. */
      .foco-chat-card {
        top: auto;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 58vh;
        max-height: 58vh;
        border-radius: 20px 20px 0 0;
        box-shadow: 0 -12px 40px -12px rgba(15, 23, 42, 0.35);
      }
    }

    /* ===== ACTIONS ===== */
    .review-actions { display: flex; justify-content: center; margin-top: 3rem; padding-top: 2rem; border-top: 2px solid var(--glass-border); }
    .btn { padding: 1rem 3rem; border-radius: 12px; font-weight: 700; font-size: 1rem; cursor: pointer; transition: all 0.2s; border: none; }
    .btn-primary { background: #855cd6; color: #fff; box-shadow: 0 4px 15px rgba(133, 92, 214, 0.3); }
    .btn-primary:hover { transform: translateY(-2px); background: #7349c2; box-shadow: 0 8px 25px rgba(133, 92, 214, 0.4); }
    .btn-secondary { background: #fff; color: #855cd6; border: 2px solid #855cd6; }
    .btn-secondary:hover { background: rgba(133, 92, 214, 0.05); transform: translateY(-2px); }
    .btn-finalizar { text-transform: uppercase; letter-spacing: 1px; min-width: 200px; }

    .glass-card { background: rgba(255, 255, 255, 0.03); border: 2px solid var(--glass-border); backdrop-filter: blur(10px); }

    /* LOADING */
    .loading-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.8);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid rgba(255,255,255,0.1);
      border-top-color: var(--accent-primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .question-image-container {
      margin: 1rem 0;
      background: #fff;
      border-radius: 8px;
      padding: 1rem;
      display: flex;
      justify-content: center;
    }
    .question-image {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
    }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 1024px) {
      .review-body { padding: 1.5rem; }
      .options-list { grid-template-columns: 1fr; }
    }
    @media (max-width: 768px) {
      .review-header { flex-direction: column; gap: 1.5rem; align-items: flex-start; padding: 1.25rem 1.25rem; }
      .header-left { flex-wrap: wrap; gap: 1rem; }
      .header-actions { width: 100%; }
      .header-actions .btn { width: 100%; }
      .summary-cards { grid-template-columns: 1fr; }
      .filter-tabs { flex-direction: column; }
      .review-actions { flex-direction: column; gap: 1rem; }
      .review-actions .btn { width: 100%; }
      .review-body { padding: 1.25rem; }
      .review-question-card { padding: 1.25rem; }
      .info-tooltip { right: auto; left: 0; width: 200px; max-width: calc(100vw - 2rem); }
      .reading-text-container { max-height: 42vh; padding: 1rem; }
    }
    @media (max-width: 480px) {
      .info-tooltip { display: none; }
      .review-header { padding: 1rem; }
      .review-body { padding: 1rem; }
      .review-question-card { padding: 1rem; }
      .header-info h1 { font-size: 1.25rem; }
      .score-points { font-size: 1.25rem; }
      .modal-card { padding: 2rem 1.25rem 1.5rem !important; }
    }
  `]
})
export class EnsayoReviewComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public firestoreService = inject(FirestoreService);
  public paymentService = inject(PaymentService);
  private auth = inject(Auth);
  private adminService = inject(AdminService);
  private aiAssistService = inject(AiAssistService);
  private toast = inject(ToastService);

  examId = '';
  examTitle = 'Cargando...';
  score = 0;
  totalQuestions = 0;
  activeFilter = 'all';
  loading = true;
  notFound = false;
  mostrarModalMejorador = false;
  resultsLocked = false;
  resultsAvailableAt: Date | null = null;
  countdownTimerText = '00:00:00';
  private resultsTimerInterval: any;

  questions: ReviewQuestion[] = [];

  // Exposed so the template can call it directly on each message.
  readonly formatFocoMessage = formatFocoMessage;

  // Foco "why did I get this wrong" chat (Pro only)
  activeChatQuestion: ReviewQuestion | null = null;
  chatMessages: { role: 'user' | 'assistant'; content: string; timestamp: Date }[] = [];
  chatLoading = false;
  chatInputText = '';

  get isProPlan(): boolean {
    return this.firestoreService.profileSignal()?.plan === 'premium' || this.adminService.isAdmin() === true;
  }

  get correctCount(): number {
    return this.questions.filter(q => q.isCorrect).length;
  }

  get incorrectCount(): number {
    return this.questions.filter(q => !q.isCorrect && q.userAnswer).length;
  }

  get omittedCount(): number {
    return this.questions.filter(q => !q.userAnswer).length;
  }

  get scorePercentage(): number {
    if (this.totalQuestions === 0) return 0;
    return Math.round((this.correctCount / this.totalQuestions) * 100);
  }

  get pointsPerQuestion(): number {
    if (this.totalQuestions === 0) return 0;
    return parseFloat((900 / this.totalQuestions).toFixed(1));
  }

  get filteredQuestions(): ReviewQuestion[] {
    switch (this.activeFilter) {
      case 'correct':
        return this.questions.filter(q => q.isCorrect);
      case 'incorrect':
        return this.questions.filter(q => !q.isCorrect && q.userAnswer !== null);
      case 'omitted':
        return this.questions.filter(q => !q.userAnswer);
      default:
        return this.questions;
    }
  }

  async ngOnInit() {
    this.examId = this.route.snapshot.paramMap.get('id') || '';
    let intentoId = this.route.snapshot.queryParamMap.get('intento');

    const user = this.auth.currentUser;

    // Note: the 3-hour results lock for Free tier is enforced per-attempt inside
    // loadIntentoData() below (using that attempt's own resultsAvailableAt/finishedAt).
    // It must NOT be checked here against the user's global lastSimulationFinishedAt,
    // since that timestamp reflects whichever simulation the user finished most
    // recently — not necessarily the one being reviewed — which would incorrectly
    // lock old, already-unlocked attempts opened from "Actividad Reciente".

    // If intentoId is missing, auto-fetch latest completed attempt for user
    if (!intentoId && user) {
      const latest = await this.firestoreService.getLatestCompletedIntento(user.uid);
      if (latest) {
        intentoId = latest.id;
        if (latest.ensayoId) this.examId = latest.ensayoId;
      }
    }

    if (intentoId) {
      this.loadIntentoData(intentoId);
    } else {
      // No intento in the URL and none found for this user either — most
      // commonly because the exam session started without a Firestore
      // record (e.g. a transient failure when creating it). There is
      // nothing to review; say so instead of rendering a blank "0/0" screen.
      this.notFound = true;
      this.loading = false;
    }
  }

  ngOnDestroy() {
    if (this.resultsTimerInterval) {
      clearInterval(this.resultsTimerInterval);
    }
  }

  devBypassResultsLock = false;
  readonly isProduction = environment.production;

  async devResetTimeLimits() {
    if (this.isProduction) return; // Dev-only escape hatch, never active in production
    await this.firestoreService.devSimulateTimePass();
    this.resultsLocked = false;
    if (this.resultsTimerInterval) clearInterval(this.resultsTimerInterval);

    const user = this.auth.currentUser;
    let intentoId = this.route.snapshot.queryParamMap.get('intento');
    if (!intentoId && user) {
      const latest = await this.firestoreService.getLatestCompletedIntento(user.uid);
      if (latest) intentoId = latest.id;
    }
    if (intentoId) {
      this.loadIntentoData(intentoId);
    }
  }

  private startResultsCountdown(targetDate: Date) {
    const update = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) {
        this.resultsLocked = false;
        if (this.resultsTimerInterval) clearInterval(this.resultsTimerInterval);
        return;
      }
      const hours = Math.floor(diff / (1000 * 3600)).toString().padStart(2, '0');
      const minutes = Math.floor((diff % (1000 * 3600)) / (1000 * 60)).toString().padStart(2, '0');
      const seconds = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
      this.countdownTimerText = `${hours}h : ${minutes}m : ${seconds}s`;
    };
    update();
    this.resultsTimerInterval = setInterval(update, 1000);
  }

  private loadIntentoData(intentoId: string) {
    this.loading = true;

    forkJoin({
      intento: this.firestoreService.getIntento(intentoId).pipe(catchError(() => of(null))),
      preguntas: this.firestoreService.getPreguntas(this.examId).pipe(catchError(() => of([]))),
      ensayo: this.firestoreService.getEnsayo(this.examId).pipe(catchError(() => of(null)))
    }).subscribe({
      next: (data: any) => {
        const preguntas: any[] = data.preguntas || [];
        const intento: any = data.intento || null;

        // Enforce 3-hour delay for Free tier users (unless DEV button bypassed it)
        if (!this.isProPlan && !this.firestoreService.devBypassResultsLock) {
          let availDate: Date | null = null;
          if (intento?.resultsAvailableAt) {
            availDate = typeof intento.resultsAvailableAt.toDate === 'function'
              ? intento.resultsAvailableAt.toDate()
              : new Date(intento.resultsAvailableAt);
          } else if (intento?.finishedAt) {
            const finishedDate = typeof intento.finishedAt.toDate === 'function'
              ? intento.finishedAt.toDate()
              : new Date(intento.finishedAt);
            availDate = new Date(finishedDate.getTime() + 3 * 3600 * 1000);
          } else {
            const profile = this.firestoreService.profileSignal();
            const lastFinished = profile?.lastSimulationFinishedAt;
            if (lastFinished) {
              const finishedDate = typeof lastFinished.toDate === 'function' ? lastFinished.toDate() : new Date(lastFinished);
              availDate = new Date(finishedDate.getTime() + 3 * 3600 * 1000);
            }
          }

          if (availDate && availDate > new Date()) {
            this.resultsLocked = true;
            this.resultsAvailableAt = availDate;
            this.startResultsCountdown(availDate);
            this.loading = false;
            return;
          }
        }

        const answersList: any[] = Array.isArray(intento?.answers) ? intento.answers : [];
        this.score = intento?.score || 0;
        this.examTitle = intento?.ensayoTitle || data.ensayo?.title || this.getGenericTitle(this.examId);

        if (preguntas.length > 0) {
          this.totalQuestions = preguntas.length;
          this.questions = preguntas.map((p: any) => {
            const userAnsObj = answersList.find((a: any) => a.preguntaId === p.id) || null;

            let topic = p.tema || p.topic || p.subtema;
            if (!topic) {
              const lowerId = this.examId.toLowerCase();
              const order = p.order || 1;
              if (lowerId.includes('m1') || lowerId.includes('matematica')) {
                if (order <= 15) topic = 'Números';
                else if (order <= 35) topic = 'Álgebra';
                else if (order <= 50) topic = 'Geometría';
                else topic = 'Probabilidad';
              } else if (lowerId.includes('lectora') || lowerId.includes('l-')) {
                if (order <= 20) topic = 'Localizar';
                else if (order <= 45) topic = 'Interpretar';
                else topic = 'Evaluar';
              } else if (lowerId.includes('ciencias') || lowerId.includes('biologia')) {
                if (order <= 20) topic = 'Biología Celular';
                else if (order <= 45) topic = 'Fisiología';
                else topic = 'Ecosistemas';
              } else if (lowerId.includes('fisica')) {
                topic = 'Física';
              } else if (lowerId.includes('quimica')) {
                topic = 'Química';
              } else if (lowerId.includes('historia')) {
                if (order <= 22) topic = 'Época del Salitre';
                else if (order <= 44) topic = 'Cuestión Social';
                else topic = 'Constitución';
              } else {
                topic = 'General';
              }
            }

            const pOpts = p.options || {};
            const options: { id: string; text: string }[] = [
              { id: 'A', text: pOpts.A || pOpts.a || 'Opción A' },
              { id: 'B', text: pOpts.B || pOpts.b || 'Opción B' },
              { id: 'C', text: pOpts.C || pOpts.c || 'Opción C' },
              { id: 'D', text: pOpts.D || pOpts.d || 'Opción D' },
              ...((pOpts.E || pOpts.e) ? [{ id: 'E', text: pOpts.E || pOpts.e }] : [])
            ];

            const userSelected = userAnsObj?.selectedAnswer || null;
            const correctKey = p.correctAnswer || p.correct || null;
            const isCorrect = userSelected ? (userSelected === correctKey) : false;

            const normalizeUrl = (url: string) => (url.startsWith('http') || url.startsWith('/')) ? url : '/' + url;

            return {
              id: p.order || 1,
              stem: p.stem || p.pregunta || 'Pregunta de ensayo',
              options,
              userAnswer: userSelected,
              correctAnswer: correctKey,
              isCorrect,
              explanation: {
                correctSolution: p.explicacion || p.explanation?.correctSolution || 'Revisa la pauta oficial DEMRE.',
                tip: 'Analiza cada alternativa descartando las distractoras.'
              },
              imageUrl: p.imageUrl ? normalizeUrl(p.imageUrl) : null,
              readingText: Array.isArray(p.readingText) ? p.readingText.map(normalizeUrl) : null,
              tema: topic
            };
          });
        } else if (answersList.length > 0) {
          // Fallback if preguntas collection query is empty for official exams
          this.totalQuestions = answersList.length;
          this.questions = answersList.map((a: any, idx: number) => ({
            id: idx + 1,
            stem: a.questionStem || a.stem || `Pregunta N° ${idx + 1}`,
            options: a.options || [
              { id: 'A', text: 'Opción A' },
              { id: 'B', text: 'Opción B' },
              { id: 'C', text: 'Opción C' },
              { id: 'D', text: 'Opción D' }
            ],
            userAnswer: a.selectedAnswer || null,
            correctAnswer: a.correctAnswer || (a.isCorrect ? a.selectedAnswer : null),
            isCorrect: !!a.isCorrect,
            explanation: {
              correctSolution: a.explanation?.correctSolution || 'Pauta y solución explicada de la pregunta.',
              tip: 'Revisa tus respuestas para identificar tus fortalezas y debilidades.'
            },
            imageUrl: a.imageUrl ? (String(a.imageUrl).startsWith('http') || String(a.imageUrl).startsWith('/') ? a.imageUrl : '/' + a.imageUrl) : null,
            readingText: Array.isArray(a.readingText) ? a.readingText.map((t: string) => t.startsWith('http') || t.startsWith('/') ? t : '/' + t) : null,
            tema: a.tema || 'General'
          }));
        }

        // Compute score: use stored score, or compute from mapped questions
        if (intento?.score) {
          this.score = intento.score;
        } else {
          const correct = this.questions.filter(q => q.isCorrect).length;
          this.score = this.totalQuestions > 0
            ? Math.round(100 + (correct / this.totalQuestions) * 900)
            : 0;
        }

        // Neither the intento doc nor any questions could be loaded — there
        // is genuinely nothing to show (e.g. the attempt itself was never
        // saved to Firestore). Surface that clearly instead of a blank "0/0".
        if (!intento && this.totalQuestions === 0) {
          this.notFound = true;
        }

        this.loading = false;
      },
      error: () => {
        this.notFound = true;
        this.loading = false;
      }
    });
  }

  private getGenericTitle(id: string): string {
    const lower = id.toLowerCase();
    if (lower.includes('l-')) return 'Competencia Lectora';
    if (lower.includes('m1')) return 'Matemática 1';
    if (lower.includes('m2')) return 'Matemática 2';
    if (lower.includes('ciencias')) return 'Ciencias';
    if (lower.includes('historia')) return 'Historia';
    return 'Ensayo PAES';
  }

  private calculatePreviousTopicScores(): { topic: string; correct: number; total: number }[] {
    const topicStats: Record<string, { correct: number, total: number }> = {};
    
    this.questions.forEach(q => {
      if (q.tema) {
        if (!topicStats[q.tema]) {
          topicStats[q.tema] = { correct: 0, total: 0 };
        }
        topicStats[q.tema].total++;
        if (q.isCorrect) {
          topicStats[q.tema].correct++;
        }
      }
    });

    return Object.entries(topicStats).map(([topic, stats]) => ({
      topic,
      correct: stats.correct,
      total: stats.total
    }));
  }

  aceptarMejorador() {
    this.mostrarModalMejorador = false;
    this.entrenarTemas();
  }

  irARutaDeAprendizaje() {
    this.mostrarModalMejorador = false;
    let pathMateriaId = '';
    const lower = this.examId.toLowerCase();
    
    if (lower.includes('l-') || lower.includes('lectora') || lower.includes('comp-lectora')) {
      pathMateriaId = 'comp-lectora';
    } else if (lower.includes('m1') || lower.includes('mat1')) {
      pathMateriaId = 'mat1';
    } else if (lower.includes('m2') || lower.includes('mat2')) {
      pathMateriaId = 'mat2';
    } else if (lower.includes('historia')) {
      pathMateriaId = 'historia';
    } else if (lower.includes('biologia') || lower.includes('fisica') || lower.includes('quimica') || lower.includes('tp') || lower.includes('ciencias')) {
      pathMateriaId = 'ciencias';
    }

    if (pathMateriaId) {
      this.router.navigate(['/ruta', pathMateriaId]);
    } else {
      this.router.navigate(['/ruta']);
    }
  }

  entrenarTemas() {
    let materiaId = '';
    const lower = this.examId.toLowerCase();
    if (lower.includes('l-') || lower.includes('lectora')) materiaId = 'competencia-lectora';
    else if (lower.includes('m1')) materiaId = 'matematicas-m1';
    else if (lower.includes('m2')) materiaId = 'matematicas-m2';
    else if (lower.includes('biologia')) materiaId = 'ciencias-biologia';
    else if (lower.includes('fisica')) materiaId = 'ciencias-fisica';
    else if (lower.includes('quimica')) materiaId = 'ciencias-quimica';
    else if (lower.includes('tp')) materiaId = 'ciencias-tp';
    else if (lower.includes('historia')) materiaId = 'historia';

    // Gather failed topics
    const failedQuestions = this.questions.filter(q => q.userAnswer !== null && !q.isCorrect);
    const failedTopicsSet = new Set<string>();
    failedQuestions.forEach(q => {
      if (q.tema) failedTopicsSet.add(q.tema);
    });
    const failedTopics = Array.from(failedTopicsSet);

    // Build route query params
    const queryParams: any = {
      mode: 'mejorador',
      materiaId
    };
    if (failedTopics.length > 0) {
      queryParams['topics'] = failedTopics.join(',');
    }
    
    // Pass baseline scores for comparison
    const previousTopicScores = this.calculatePreviousTopicScores();
    queryParams['sourceIntento'] = JSON.stringify({
      intentoId: this.route.snapshot.queryParamMap.get('intento') || '',
      ensayoId: this.examId,
      ensayoTitle: this.examTitle,
      previousTopicScores
    });

    this.router.navigate(['/mini-ensayo'], { queryParams });
  }

  // ── Foco review chat (Pro only) ──

  openFocoForQuestion(question: ReviewQuestion) {
    this.activeChatQuestion = question;
    this.chatMessages = [];
    this.chatInputText = '';
    // Auto-kicks off the explanation — the student didn't type this, but
    // showing it as their own message keeps the chat transcript coherent
    // (matches the "quick message" pattern used in the exam runner's chat).
    this.chatMessages.push({
      role: 'user',
      content: '¿Cuál era el proceso para resolver esta pregunta y en qué pude haberme equivocado?',
      timestamp: new Date()
    });
    this.chatLoading = true;
    this.runFocoChat(question);
  }

  closeFocoChat() {
    this.activeChatQuestion = null;
    this.chatMessages = [];
    this.chatInputText = '';
  }

  async sendFocoFollowUp() {
    const text = this.chatInputText.trim();
    if (!text || this.chatLoading || !this.activeChatQuestion) return;
    this.chatInputText = '';
    this.chatMessages.push({ role: 'user', content: text, timestamp: new Date() });
    this.chatLoading = true;
    await this.runFocoChat(this.activeChatQuestion);
  }

  onFocoEnterKey(event: Event) {
    const ke = event as KeyboardEvent;
    if (!ke.shiftKey) {
      ke.preventDefault();
      this.sendFocoFollowUp();
    }
  }

  private async runFocoChat(question: ReviewQuestion) {
    try {
      const history = this.chatMessages.map(m => ({ role: m.role, content: m.content }));
      const response = await this.aiAssistService.reviewChatViaBackend({
        question: question.stem,
        options: question.options,
        userAnswer: question.userAnswer,
        correctAnswer: question.correctAnswer || 'A',
        subject: this.examId,
        imageUrl: question.imageUrl,
        readingImages: question.readingText,
        history,
      });

      // Sync the local profile signal with the real, backend-confirmed usage
      // instead of guessing/incrementing locally. Must go through .set() with
      // a new object — mutating profile.dailyCredits in place doesn't notify
      // Angular signals, so anything computed() from profileSignal() (like
      // the Foco tokens badge) would silently keep showing stale numbers.
      const profile = this.firestoreService.profileSignal();
      if (profile) {
        this.firestoreService.profileSignal.set({
          ...profile,
          dailyCredits: {
            ...(profile.dailyCredits || {}),
            focoTokensUsedToday: Math.max(0, response.limitTokens - response.remainingTokens)
          }
        });
      }

      this.chatMessages.push({ role: 'assistant', content: response.reply, timestamp: new Date() });
    } catch (err) {
      if (err instanceof FocoTokensExhaustedError) {
        this.chatMessages.push({
          role: 'assistant',
          content: `⚠️ ${err.message}`,
          timestamp: new Date()
        });
      } else {
        this.toast.error('No se pudo conectar con el tutor IA.');
        this.chatMessages.push({
          role: 'assistant',
          content: 'Lo siento, no pude conectarme en este momento. Intenta de nuevo.',
          timestamp: new Date()
        });
      }
    } finally {
      this.chatLoading = false;
    }
  }
}
