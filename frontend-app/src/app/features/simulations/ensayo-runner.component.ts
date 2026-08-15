import { Component, inject, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FirestoreService, Pregunta } from '../../core/services/firestore.service';
import { AiAssistService, ChatMessage, FocoTokensExhaustedError } from '../../core/services/ai-assist.service';
import { formatFocoMessage } from '../../core/utils/foco-message-format';
import { ToastService } from '../../core/services/toast.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { PaymentService } from '../../core/services/payment.service';
import { AdminService } from '../admin/services/admin.service';
import { FocoTokensBadgeComponent } from '../../shared/components/foco-tokens-badge.component';

interface Question {
  id: string;
  order: number;
  stem: string;
  subject?: string;
  options: { id: string; text: string }[];
  correctAnswer?: string;
  imageUrl?: string | null;
  readingText?: string[] | null;
}

type ExamMode = 'real' | 'asistido';

interface SavedProgress {
  examId: string;
  examName: string;
  mode: ExamMode;
  timeRemaining: number;
  initialTimeSeconds: number;
  currentIndex: number;
  answers: { [key: string]: string };
  flagged: { [key: string]: boolean };
  updatedAt: number;
}

interface AiMessage {
  role: 'assistant' | 'user';
  content: string;
  timestamp?: Date;
}

@Component({
  selector: 'app-ensayo-runner',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, FocoTokensBadgeComponent],
  template: `
    <div class="exam-container">
      <!-- HEADER MINIMALISTA -->
      <header class="exam-header">
        <div class="header-left">
          <button class="btn-icon" (click)="confirmExit()">←</button>
          <span class="exam-title">{{ examTitle }}</span>
        </div>
        
        <div class="header-center">
          <!-- Removed sequential progress indicator to avoid confusion with official numbering -->
        </div>
        
        <div class="header-right">
          <span class="mode-badge" [class.assisted]="isAssisted">
            {{ isAssisted ? 'Asistido' : 'Real' }}
          </span>
          <app-foco-tokens-badge *ngIf="isAssisted"></app-foco-tokens-badge>
          <div class="timer" [class.warning]="timeWarning" [class.critical]="timeCritical">
            <span class="timer-icon">⏱️</span>
            <span class="timer-value">{{ formattedTime }}</span>
          </div>
          <ng-container *ngIf="isAssisted; else realActions">
            <button class="btn btn-ghost" (click)="pauseExam()">
              Pausar
            </button>
            <button class="btn btn-ghost" (click)="confirmExit()">
              Pausar y salir
            </button>
          </ng-container>
          <ng-template #realActions>
            <button class="btn btn-ghost" (click)="confirmExit()">
              Salir
            </button>
          </ng-template>
        </div>
      </header>

      <!-- MAIN EXAM AREA -->
      <div class="exam-body" 
           [class.assisted-layout]="isAssisted && !isAiCollapsed"
           [class.nav-collapsed]="isNavCollapsed"
           [class.ai-collapsed]="isAiCollapsed">
           


        <!-- QUESTION NAVIGATOR (Left Column) -->
        <aside class="question-nav" *ngIf="!isNavCollapsed">
          <div class="nav-panel-header">
            <h4 class="nav-title">Navegador</h4>
            <button class="panel-close-btn" (click)="toggleNav()" aria-label="Cerrar navegador">✕</button>
          </div>
          <div class="question-grid">
            <button 
              *ngFor="let q of questions; let i = index"
              class="q-btn"
              [class.answered]="answers[q.id]"
              [class.current]="currentIndex === i"
              [class.flagged]="flagged[q.id]"
              (click)="goToQuestion(i)">
              {{ q.order }}
            </button>
          </div>
          
          <div class="nav-legend">
            <div class="legend-item">
              <span class="legend-dot answered"></span>
              <span>Respondida</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot current"></span>
              <span>Actual</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot"></span>
              <span>Sin responder</span>
            </div>
          </div>

          <div class="nav-stats">
            <div class="stat">
              <span class="stat-value">{{ answeredCount }}</span>
              <span class="stat-label">Respondidas</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ totalQuestions - answeredCount }}</span>
              <span class="stat-label">Pendientes</span>
            </div>
          </div>
        </aside>

        <main class="question-area" 
              [class.with-reading-text]="currentQuestion?.readingText"
              [class.focus-reading]="focusedPanel === 'reading'"
              [class.focus-question]="focusedPanel === 'question'">
          
          <!-- Reading Text Section (Left side when split) -->
          <div class="reading-text-container glass-card" *ngIf="currentQuestion?.readingText as readingText">

            <div class="reading-text-header">
              <div class="header-left">
                <span class="reading-icon">📖</span>
                <h4>Texto de lectura</h4>
              </div>
              <div class="header-actions">
                <button class="focus-btn" 
                        (click)="toggleFocus('reading')" 
                        [title]="focusedPanel === 'reading' ? 'Ver ambos' : 'Expandir texto'">
                  <span style="font-size: 1.1rem; line-height: 1;">{{ focusedPanel === 'reading' ? '◨' : '⛶' }}</span>
                  {{ focusedPanel === 'reading' ? 'Dividir' : 'Ampliar Texto' }}
                </button>
              </div>
            </div>
              <div class="reading-images">
                <img *ngFor="let imgUrl of readingText" 
                     [src]="imgUrl" 
                     class="reading-image" 
                     alt="Texto de lectura" />
              </div>
          </div>

          <!-- Question Content -->
          <div class="question-content-container">
            <div class="question-card glass-card" *ngIf="currentQuestion">
              <div class="question-header">
                <div class="header-left">
                  <!-- Question number removed as it is in the image -->
                  <button 
                    class="flag-btn" 
                    [class.flagged]="flagged[currentQuestion.id]"
                    (click)="toggleFlag()">
                    {{ flagged[currentQuestion.id] ? '🚩' : '🏳️' }}
                  </button>
                </div>
                <div class="header-actions" *ngIf="isLanguageModule">
                  <button class="focus-btn" 
                          (click)="toggleFocus('question')" 
                          [title]="focusedPanel === 'question' ? 'Ver ambos' : 'Expandir pregunta'">
                    <span style="font-size: 1.1rem; line-height: 1;">{{ focusedPanel === 'question' ? '◧' : '⛶' }}</span>
                    {{ focusedPanel === 'question' ? 'Dividir' : 'Ampliar Pregunta' }}
                  </button>
                  <!-- AI quick toggle only when collapsed in language module -->
                  <button 
                    *ngIf="isAssisted && isAiCollapsed"
                    class="btn-ai-float"
                    (click)="toggleAi()"
                    title="Abrir Tutor Foco">
                    Consultar a Foco
                  </button>
                  <button
                    *ngIf="isAssisted && !isAiCollapsed"
                    class="btn-ai-float active"
                    (click)="toggleAi()"
                    title="Cerrar Tutor Foco">
                    ✕ Cerrar Foco
                  </button>
                </div>
              </div>

              <div class="question-stem">
                <div class="question-image-container">
                  <!-- Skeleton Loader while image is loading -->
                  <div class="image-skeleton" *ngIf="currentQuestion.imageUrl && isImageLoading">
                    <div class="skeleton-pulse">Cargando pregunta...</div>
                  </div>
                  
                  <img *ngIf="currentQuestion.imageUrl" 
                       [src]="ensureLeadingSlash(currentQuestion.imageUrl)" 
                       (load)="isImageLoading = false"
                       (error)="handleImageError($event)"
                       [class.hidden]="isImageLoading"
                       alt="Imagen de la pregunta" 
                       class="question-image" />
                </div>
              </div>

              <!-- OPTIONS & NAVIGATION (Single Row for Non-Language) -->
              <div class="options-nav-row" *ngIf="!isLanguageModule">
                <button 
                  class="btn-nav-inline"
                  [disabled]="currentIndex === 0"
                  (click)="prevQuestion()">
                  ← Anterior
                </button>

                <div class="options-list bubble-sheet-inline">
                  <button 
                    *ngFor="let opt of currentQuestion.options"
                    class="option-btn bubble-btn"
                    [class.selected]="answers[currentQuestion.id] === opt.id"
                    (click)="selectOption(opt.id)">
                    {{ opt.id }}
                  </button>
                </div>

                <button 
                  *ngIf="currentIndex < totalQuestions - 1"
                  class="btn-nav-inline primary"
                  (click)="nextQuestion()">
                  Siguiente Pregunta →
                </button>

                <button 
                  *ngIf="currentIndex === totalQuestions - 1"
                  class="btn-nav-inline success"
                  (click)="finishExam()">
                  ✓ Finalizar Ensayo
                </button>
              </div>

              <!-- OPTIONS & NAVIGATION for Language (same inline row as other modules) -->
              <div class="options-nav-row" *ngIf="isLanguageModule">
                <button 
                  class="btn-nav-inline"
                  [disabled]="currentIndex === 0"
                  (click)="prevQuestion()">
                  ←
                </button>

                <div class="options-list bubble-sheet-inline">
                  <button 
                    *ngFor="let opt of currentQuestion.options"
                    class="option-btn bubble-btn"
                    [class.selected]="answers[currentQuestion.id] === opt.id"
                    (click)="selectOption(opt.id)">
                    {{ opt.id }}
                  </button>
                </div>

                <button 
                  *ngIf="currentIndex < totalQuestions - 1"
                  class="btn-nav-inline primary"
                  (click)="nextQuestion()">
                  Siguiente →
                </button>

                <button 
                  *ngIf="currentIndex === totalQuestions - 1"
                  class="btn-nav-inline success"
                  (click)="finishExam()">
                  ✓ Finalizar
                </button>
              </div>
            </div>
          </div>
        </main>

        <!-- AI CHAT PANEL (Right Column) -->
        <aside class="ai-panel glass-card" [class.mobile-expanded]="isAiExpandedMobile" *ngIf="isAssisted && !isAiCollapsed">
          <div class="ai-header">
            <div class="ai-header-left">
              <div class="ai-avatar">
                <img src="https://res.cloudinary.com/dqm3syhwr/image/upload/f_auto,q_auto/v1/imagenes/branding/gif" alt="Foco" style="width: 100%; height: 100%; object-fit: contain;">
              </div>
              <div>
                <h4 class="ai-title">Foco, tu Pulpo Tutor</h4>
                <span class="ai-status">{{ aiLoading ? 'Pensando...' : 'En línea' }}</span>
              </div>
            </div>
            <button class="btn-icon-sm" (click)="clearChat()" title="Limpiar chat">🗑️</button>
            <button
              class="btn-icon-sm mobile-expand-btn"
              (click)="toggleAiExpandMobile()"
              [title]="isAiExpandedMobile ? 'Achicar chat' : 'Agrandar chat'"
              [attr.aria-label]="isAiExpandedMobile ? 'Achicar chat' : 'Agrandar chat'">
              {{ isAiExpandedMobile ? '⤡' : '⤢' }}
            </button>
            <button class="btn-icon-sm panel-close-btn-ai" (click)="toggleAi()" title="Cerrar tutor" aria-label="Cerrar tutor">✕</button>
          </div>

          <div class="ai-messages" #chatScrollContainer>
            <div class="chat-empty-state" *ngIf="aiMessages.length === 0 && !aiLoading">
              ¿Tienes preguntas? Foco está listo para guiarte.
            </div>
            <div
              *ngFor="let msg of aiMessages"
              class="ai-bubble"
              [class.user]="msg.role === 'user'"
              [class.assistant]="msg.role === 'assistant'">
              <div class="bubble-role">{{ msg.role === 'user' ? 'Tú' : '🐙 Foco' }}</div>
              <div class="bubble-content" [innerHTML]="formatAiMessage(msg.content)"></div>
              <div class="bubble-time" *ngIf="msg.timestamp">
                {{ msg.timestamp | date:'HH:mm' }}
              </div>
            </div>
            <div *ngIf="aiLoading" class="ai-bubble assistant loading-bubble">
              <div class="bubble-role">🐙 Foco</div>
              <div class="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="ai-quick-actions">
            <button class="quick-btn" (click)="sendQuickMessage('Necesito una pista para esta pregunta')" [disabled]="aiLoading">
              💡 Pista
            </button>
            <button class="quick-btn" (click)="sendQuickMessage('¿Qué estrategia debo usar para resolver esto?')" [disabled]="aiLoading">
              🎯 Estrategia
            </button>
            <button class="quick-btn" (click)="sendQuickMessage('¿Qué concepto debo repasar?')" [disabled]="aiLoading">
              📚 Concepto
            </button>
          </div>

          <!-- Chat Input -->
          <div class="ai-input-area">
            <textarea
              class="ai-input"
              [(ngModel)]="chatInputText"
              (keydown.enter)="onEnterKey($event)"
              [disabled]="aiLoading"
              placeholder="Escribe tu pregunta al tutor... (Enter para enviar)"
              rows="2"
              maxlength="300">
            </textarea>
            <button
              class="btn-send"
              (click)="sendChatMessage()"
              [disabled]="aiLoading || !chatInputText.trim()">
              <span *ngIf="!aiLoading">➤</span>
              <span *ngIf="aiLoading" class="spinner-sm">⏳</span>
            </button>
          </div>
          <p class="ai-disclaimer">⚠️ El tutor no revela respuestas directas.</p>
        </aside>

        <!-- MOBILE FLOATING ACTION BUTTONS -->
        <button class="mobile-fab mobile-nav-fab" *ngIf="isNavCollapsed" (click)="toggleNav()" aria-label="Abrir navegador de preguntas">
          📋 <span class="fab-badge">{{ answeredCount }}/{{ totalQuestions }}</span>
        </button>
        <button class="mobile-fab mobile-ai-fab" *ngIf="isAssisted && isAiCollapsed" (click)="toggleAi()" aria-label="Abrir tutor Foco">
          🐙
        </button>
      </div>

      <!-- PAUSE MODAL -->
      <div class="modal-overlay" *ngIf="showPauseModal">
        <div class="modal glass-card" (click)="$event.stopPropagation()">
          <h3>Ensayo en pausa</h3>
          <p>El tiempo está detenido. Puedes reanudar cuando quieras.</p>
          <div class="modal-actions">
            <button class="btn btn-primary" (click)="resumeExam()">Reanudar</button>
          </div>
        </div>
      </div>

      <!-- EXIT MODAL (ASSISTED) -->
      <div class="modal-overlay" *ngIf="showExitModal" (click)="cancelExit()">
        <div class="modal glass-card" (click)="$event.stopPropagation()">
          <h3>¿Pausar y salir?</h3>
          <p>Tu progreso se guardará. Podrás continuar después.</p>
          <div class="modal-actions">
            <button class="btn btn-outline" (click)="cancelExit()">Cancelar</button>
            <button class="btn btn-primary" (click)="exitExam()">Salir</button>
          </div>
        </div>
      </div>

      <!-- EXIT MODAL (REAL) -->
      <div class="modal-overlay" *ngIf="showRealExitModal" (click)="showRealExitModal = false">
        <div class="modal glass-card" (click)="$event.stopPropagation()">
          <h3>¿Salir del ensayo real?</h3>
          <p class="warning-text">⚠️ Si sales ahora, se borrará el progreso y no se guardará.</p>
          <div class="modal-actions">
            <button class="btn btn-outline" (click)="showRealExitModal = false">Cancelar</button>
            <button class="btn btn-primary" (click)="exitRealExam()">Salir</button>
          </div>
        </div>
      </div>

      <!-- RESUME MODAL -->
      <div class="modal-overlay" *ngIf="showResumeModal">
        <div class="modal glass-card" (click)="$event.stopPropagation()">
          <h3>Ensayo asistido en pausa</h3>
          <p>Encontramos un progreso guardado. ¿Deseas reanudar?</p>
          <div class="modal-actions">
            <button class="btn btn-outline" (click)="startNewAttempt()">Comenzar de cero</button>
            <button class="btn btn-primary" (click)="resumeSavedAttempt()">Reanudar</button>
          </div>
        </div>
      </div>

      <!-- FINISH MODAL -->
      <div class="modal-overlay" *ngIf="showFinishModal" (click)="showFinishModal = false">
        <div class="modal glass-card" (click)="$event.stopPropagation()">
          <h3>¿Finalizar ensayo?</h3>
          <p>Has respondido <strong>{{ answeredCount }}</strong> de <strong>{{ totalQuestions }}</strong> preguntas.</p>
          <p *ngIf="answeredCount < totalQuestions" class="warning-text">
            ⚠️ Tienes {{ totalQuestions - answeredCount }} preguntas sin responder.
          </p>
          <div class="modal-actions">
            <button class="btn btn-outline" (click)="showFinishModal = false">Revisar</button>
            <button 
              class="btn btn-success" 
              (click)="submitExam()">
              Finalizar
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Contenedor principal con fondo completo */
    :host {
      display: block;
      min-height: 100vh;
      background: #ffffff;
      color: #111827;
      --text-secondary: #4b5563;
      --glass-border: #cbd5e1;
    }
    
    .exam-container { min-height: 100vh; display: flex; flex-direction: column; color: #111827; }
    
    /* ===== HEADER ===== */
    .exam-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 2rem;
      background: #ffffff;
      border-bottom: 2px solid var(--glass-border);
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .header-left { display: flex; align-items: center; gap: 1rem; }
    .btn-icon {
      background: #f3f4f6;
      border: 2px solid #cbd5e1;
      color: #374151;
      width: 36px;
      height: 36px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .btn-icon:hover { background: #e5e7eb; }
    .exam-title {
      font-family: var(--font-heading);
      font-size: 1.1rem;
      font-weight: 600;
      color: #111827;
    }
    .header-center { flex: 1; max-width: 400px; margin: 0 2rem; }
    .progress-info { text-align: center; }
    .progress-bar-container {
      height: 6px;
      background: #f3f4f6;
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }
    .progress-bar {
      height: 100%;
      background: var(--gradient-brand);
      transition: width 0.3s ease;
    }
    .progress-text { font-size: 0.85rem; color: var(--text-secondary); font-weight: 500; }
    .header-right { display: flex; align-items: center; gap: 1rem; }
    .mode-badge {
      padding: 0.35rem 0.75rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      background: #f3f4f6;
      color: var(--text-secondary);
    }
    .mode-badge.assisted {
      background: #e0e7ff;
      color: #4338ca;
    }
    .timer {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-family: monospace;
      font-size: 1.25rem;
      font-weight: 600;
      padding: 0.5rem 1rem;
      background: #f8fafc;
      border: 2px solid #cbd5e1;
      border-radius: 8px;
      color: #1e293b;
    }
    .timer.warning { color: #ea580c; background: #fff7ed; border-color: #fdba74; }
    .timer.critical { color: #dc2626; background: #fef2f2; border-color: #fca5a5; animation: pulse 1s infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
    .timer-icon { font-size: 1rem; }

    /* ===== EXAM BODY ===== */
    .exam-body {
      flex: 1;
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 1rem;
      padding: 1rem;
      max-width: 100%;
      margin: 0;
      width: 100%;
      height: calc(100vh - 80px);
      overflow: hidden;
      position: relative;
      transition: grid-template-columns 0.3s ease;
    }
    .exam-body.assisted-layout {
      grid-template-columns: 280px 1fr 380px;
    }
    .exam-body.nav-collapsed {
      grid-template-columns: 0px 1fr;
    }
    .exam-body.nav-collapsed.assisted-layout {
      grid-template-columns: 0px 1fr 380px;
    }
    .exam-body.ai-collapsed {
      grid-template-columns: 280px 1fr 0px;
    }
    .exam-body.nav-collapsed.ai-collapsed {
      grid-template-columns: 0px 1fr 0px;
    }

    /* On large desktop monitors, give the chat column extra room instead of
       leaving it fixed at the same width used on a small laptop screen. */
    @media (min-width: 1440px) {
      .exam-body.assisted-layout { grid-template-columns: 280px 1fr 440px; }
      .exam-body.nav-collapsed.assisted-layout { grid-template-columns: 0px 1fr 440px; }
    }

    /* ===== TOGGLE BUTTONS ===== */
    .toggle-side-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 24px;
      height: 48px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 100;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      font-size: 0.8rem;
      transition: all 0.2s;
    }
    .toggle-side-btn:hover { background: #f8fafc; color: #3b82f6; }
    
    .toggle-nav-btn { left: 0; border-left: none; border-radius: 0 8px 8px 0; }
    .toggle-ai-btn { right: 0; border-right: none; border-radius: 8px 0 0 8px; }

    .nav-collapsed .toggle-nav-btn { left: 0; }
    .ai-collapsed .toggle-ai-btn { right: 0; }

    .question-area {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      height: 100%;
      overflow: hidden;
    }

    .question-area.with-reading-text {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .question-area.with-reading-text.focus-reading {
      grid-template-columns: 1fr 0px;
      gap: 0;
    }
    .question-area.with-reading-text.focus-reading .question-content-container {
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
      padding: 0;
    }

    .question-area.with-reading-text.focus-question {
      grid-template-columns: 0px 1fr;
      gap: 0;
    }
    .question-area.with-reading-text.focus-question .reading-text-container {
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
    }

    .reading-text-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
      border-radius: 16px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      padding: 1.5rem;
    }

    .reading-text-header {
      padding: 0.75rem 1.5rem;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      min-height: 68px;
      border-radius: 12px 12px 0 0;
      margin-bottom: 1.5rem;
    }

    .reading-text-header h4 {
      margin: 0;
      font-size: 0.9rem;
      font-weight: 700;
      color: #1e293b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .reading-images {
      flex: 1;
      overflow-y: auto;
      padding: 0;
      display: flex;
      flex-direction: column;
      background: #f1f5f9;
    }

    .reading-image {
      width: 100%;
      height: auto;
      display: block;
      margin: 0;
    }



    .header-left {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .focus-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      padding: 0.4rem 0.8rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      color: #475569;
      cursor: pointer;
      transition: all 0.2s;
    }
    .focus-btn:hover { background: #e2e8f0; color: #0f172a; }



    .question-content-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      height: 100%;
      overflow-y: auto;
      padding: 0 0.5rem;
    }

    .question-content-container::-webkit-scrollbar { width: 6px; }
    .question-content-container::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }

    /* ===== QUESTION NAV ===== */
    .question-nav {
      background: #ffffff;
      border: 2px solid var(--glass-border);
      border-radius: 16px;
      padding: 1.5rem;
      height: calc(100% - 20px);
      overflow-y: auto;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .nav-title {
      font-size: 0.85rem;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 1rem;
      font-weight: 700;
    }
    .question-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }
    .q-btn {
      width: 40px;
      height: 40px;
      border: 1px solid #cbd5e1;
      background: #f8fafc;
      color: #475569;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .q-btn:hover { border-color: #3b82f6; color: #3b82f6; background: #eff6ff; }
    .q-btn.answered {
      background: #3b82f6;
      border-color: #3b82f6;
      color: #fff;
    }
    .q-btn.current {
      border-color: #1e293b;
      box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.2);
    }
    .q-btn.flagged { border-color: #f97316; background: #fff7ed; color: #ea580c; }
    .q-btn.answered.flagged { background: #ea580c; border-color: #ea580c; color: #fff; }
    .nav-legend {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 1rem 0;
      border-top: 2px solid var(--glass-border);
      border-bottom: 2px solid var(--glass-border);
      margin-bottom: 1rem;
    }
    .legend-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: #475569; }
    .legend-dot {
      width: 12px;
      height: 12px;
      border-radius: 4px;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
    }
    .legend-dot.answered { background: #3b82f6; border-color: #3b82f6; }
    .legend-dot.current { border-color: #1e293b; box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.2); }
    .nav-stats { display: flex; justify-content: space-around; }
    .stat { text-align: center; }
    .stat-value { display: block; font-size: 1.5rem; font-weight: 700; color: #3b82f6; }
    .stat-label { font-size: 0.75rem; color: #64748b; font-weight: 500; }

    /* ===== QUESTION AREA ===== */
    .question-area { display: flex; flex-direction: column; gap: 1.5rem; }

    /* ===== AI CHAT PANEL ===== */
    .ai-panel {
      padding: 0;
      border-radius: 16px;
      background: #ffffff;
      border: 2px solid var(--glass-border);
      /* Sized to its content instead of stretching to fill the full column
         height: on a tall/large monitor that made the panel grow so tall the
         input box ended up below the fold, forcing a page scroll just to
         type. Capped a bit above the old 600px so it's not cramped either. */
      height: fit-content;
      max-height: 640px;
      /* Without this, a flex item won't shrink below its content's natural
         height (min-height defaults to "auto", not 0) — that was silently
         defeating .ai-messages' own overflow-y:auto below: instead of
         scrolling internally, the chat just grew past max-height and got
         clipped by overflow:hidden here, with no scrollbar anywhere. */
      min-height: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .ai-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.25rem;
      background: #f8fafc;
      border-bottom: 2px solid var(--glass-border);
      flex-shrink: 0;
    }
    .ai-header-left { display: flex; align-items: center; gap: 0.75rem; }
    .ai-avatar {
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .ai-title {
      font-size: 0.9rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
    }
    .ai-status {
      font-size: 0.72rem;
      color: #10b981;
      font-weight: 600;
    }
    .btn-icon-sm {
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      color: #64748b;
      width: 30px;
      height: 30px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .btn-icon-sm:hover { background: #e2e8f0; color: #1e293b; }
    .ai-messages {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      overflow-y: auto;
      padding: 1rem 1rem;
      scroll-behavior: smooth;
    }
    .chat-empty-state {
      margin: auto;
      color: #94a3b8;
      font-size: 0.88rem;
      text-align: center;
      padding: 2rem;
      font-weight: 500;
    }
    .ai-messages::-webkit-scrollbar { width: 4px; }
    .ai-messages::-webkit-scrollbar-track { background: transparent; }
    .ai-messages::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
    .ai-bubble {
      border-radius: 14px;
      padding: 0.75rem 1rem;
      font-size: 0.88rem;
      line-height: 1.55;
      max-width: 100%;
      word-break: break-word;
    }
    .ai-bubble.assistant {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      color: #334155;
      align-self: flex-start;
    }
    .ai-bubble.user {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      color: #1e40af;
      align-self: flex-end;
    }
    .bubble-role {
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 0.35rem;
    }
    .ai-bubble.user .bubble-role { color: #3b82f6; }
    .bubble-content { white-space: pre-wrap; }
    .bubble-time {
      font-size: 0.65rem;
      color: #94a3b8;
      margin-top: 0.35rem;
      text-align: right;
    }
    .loading-bubble { opacity: 0.8; }
    
    /* Soporte para formato de vectores y sombreros matemáticos */
    .math-vector {
      position: relative;
      display: inline-block;
      padding-top: 0.1em;
      font-weight: 700;
    }
    .math-vector::before {
      content: "→";
      position: absolute;
      top: -0.45em;
      left: 50%;
      transform: translateX(-50%) scale(0.7, 0.5);
      font-size: 0.7em;
      font-weight: bold;
      line-height: 1;
    }
    
    .math-hat {
      position: relative;
      display: inline-block;
      padding-top: 0.05em;
      font-weight: 700;
    }
    .math-hat::before {
      content: "^";
      position: absolute;
      top: -0.4em;
      left: 50%;
      transform: translateX(-50%) scale(1.1, 0.7);
      font-size: 0.8em;
      font-weight: bold;
      line-height: 1;
    }
    .typing-indicator {
      display: flex;
      gap: 5px;
      align-items: center;
      padding: 4px 0;
    }
    .typing-indicator span {
      width: 7px;
      height: 7px;
      background: #6366f1;
      border-radius: 50%;
      animation: bounce 1.2s infinite;
    }
    .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
    .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes bounce {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.6; }
      30% { transform: translateY(-6px); opacity: 1; }
    }
    .ai-quick-actions {
      display: flex;
      gap: 0.4rem;
      padding: 0.6rem 1rem;
      border-top: 2px solid var(--glass-border);
      flex-wrap: wrap;
      flex-shrink: 0;
    }
    .quick-btn {
      padding: 0.3rem 0.65rem;
      border-radius: 999px;
      font-size: 0.73rem;
      font-weight: 600;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      color: #3b82f6;
      cursor: pointer;
      transition: all 0.18s;
      white-space: nowrap;
    }
    .quick-btn:hover:not(:disabled) {
      background: #3b82f6;
      border-color: #2563eb;
      color: #fff;
    }
    .quick-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .ai-input-area {
      display: flex;
      gap: 0.5rem;
      align-items: flex-end;
      padding: 0.75rem 1rem;
      border-top: 2px solid var(--glass-border);
      background: #f8fafc;
      flex-shrink: 0;
    }
    .ai-input {
      flex: 1;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      color: #1e293b;
      font-size: 0.88rem;
      padding: 0.6rem 0.85rem;
      resize: none;
      font-family: inherit;
      line-height: 1.4;
      transition: border-color 0.2s;
    }
    .ai-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1); }
    .ai-input::placeholder { color: #94a3b8; }
    .ai-input:disabled { opacity: 0.5; background: #f1f5f9; }
    .btn-send {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3b82f6, #6366f1);
      border: none;
      color: #fff;
      font-size: 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.2s;
    }
    .btn-send:hover:not(:disabled) { transform: scale(1.1); opacity: 0.9; }
    .btn-send:disabled { opacity: 0.4; cursor: not-allowed; }
    .ai-disclaimer {
      font-size: 0.68rem;
      color: rgba(255,255,255,0.25);
      text-align: center;
      padding: 0 1rem 0.6rem;
      margin: 0;
      flex-shrink: 0;
    }
    .question-card {
      padding: 1.5rem;
      border-radius: 20px;
      background: #ffffff;
      border: 2px solid var(--glass-border);
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    .question-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding: 0.75rem 1.5rem;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
      border-radius: 12px 12px 0 0;
      min-height: 68px;
    }
    .question-number {
      font-size: 0.9rem;
      color: #6366f1;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .btn-ai-float {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.45rem 1rem;
      border-radius: 20px;
      border: none;
      background: #3b82f6;
      color: #fff;
      font-size: 0.85rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
      white-space: nowrap;
    }
    .btn-ai-float:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
      filter: brightness(1.1);
    }
    .btn-ai-float.active {
      background: #f1f5f9;
      color: #64748b;
      box-shadow: none;
      border: 1px solid #cbd5e1;
    }
    .flag-btn {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      color: #475569;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .flag-btn:hover { border-color: #f97316; color: #f97316; background: #fffed0; }
    .flag-btn.flagged { background: #ffedd5; border-color: #f97316; color: #ea580c; }
    .question-stem {
      font-size: 1.15rem;
      line-height: 1.7;
      color: #111827;
      margin-bottom: 1rem;
    }
    .question-image-container {
      width: 100%;
      background: #f8fafc;
      border-radius: 8px;
      display: flex;
      justify-content: center;
    }
    .question-image {
      width: 100%;
      height: auto;
      max-width: 100%;
      margin-top: 0.5rem;
      border-radius: 8px;
      mix-blend-mode: multiply;
    }
    .options-list { display: flex; flex-direction: column; gap: 1rem; }
    .options-list.bubble-sheet {
      flex-direction: row;
      justify-content: center;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 2px dashed #cbd5e1;
      flex-wrap: wrap;
    }
    .options-list.bubble-sheet-lang {
      flex-direction: row;
      justify-content: center;
      gap: 0.75rem;
      margin-top: 1rem;
      padding-top: 0.75rem;
      border-top: 1px dashed #e2e8f0;
      flex-wrap: wrap;
    }
    .option-btn {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem 1.5rem;
      background: #f8fafc;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      color: #1e293b;
      font-size: 1.1rem;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s;
    }
    .option-btn.bubble-btn {
      padding: 0;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      justify-content: center;
      font-weight: 700;
      font-size: 1rem;
      color: #64748b;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      flex-shrink: 0;
    }
    .option-btn:hover { border-color: #cbd5e1; background: #f1f5f9; transform: translateX(4px); }
    .option-btn.bubble-btn:hover { transform: translateY(-4px) scale(1.05); border-color: #3b82f6; color: #3b82f6; }
    .option-btn.selected {
      background: #eff6ff;
      border-color: #3b82f6;
      color: #1e3a8a;
    }
    .option-btn.bubble-btn.selected {
      background: #3b82f6;
      border-color: #2563eb;
      color: #ffffff;
      box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
      transform: translateY(-2px);
    }

    .options-nav-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
      padding-top: 0.875rem;
      border-top: 1.5px dashed #e2e8f0;
      gap: 0.5rem;
    }
    .bubble-sheet-inline {
      display: flex !important;
      flex-direction: row !important;
      gap: 0.5rem;
      justify-content: center;
      flex: 1;
      min-width: 0;
    }
    .btn-nav-inline {
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s;
      border: 1.5px solid #e2e8f0;
      background: #fff;
      color: #475569;
      white-space: nowrap;
      min-width: 100px;
    }
    .btn-nav-inline.primary { background: #3b82f6; border-color: #3b82f6; color: #fff; }
    .btn-nav-inline.success { background: #10b981; border-color: #10b981; color: #fff; }
    .btn-nav-inline:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0,0,0,0.05); border-color: #cbd5e1; }
    .btn-nav-inline:disabled { opacity: 0.4; cursor: not-allowed; }

    /* ===== MODALS ===== */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal {
      padding: 2.5rem;
      border-radius: 20px;
      max-width: 420px;
      text-align: center;
    }
    .modal h3 { font-size: 1.5rem; margin-bottom: 1rem; color: #111827; }
    .modal p { color: #475569; margin-bottom: 0.5rem; }
    .warning-text { color: #ea580c !important; font-weight: 500; }
    .modal-actions { display: flex; gap: 1rem; justify-content: center; margin-top: 1.5rem; }

    .glass-card { background: #ffffff; border: 2px solid var(--glass-border); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); }

    /* ===== RESPONSIVE ===== */
    .nav-panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }
    .nav-panel-header .nav-title { margin-bottom: 0; }
    .panel-close-btn {
      display: none;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      background: #f8fafc;
      color: #475569;
      font-size: 0.9rem;
      cursor: pointer;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .panel-close-btn-ai { display: none; }
    .mobile-expand-btn { display: none; }
    .mobile-fab {
      display: none;
      position: fixed;
      bottom: 1.25rem;
      z-index: 1500;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      border: none;
      border-radius: 999px;
      padding: 0.85rem 1.1rem;
      font-size: 1.3rem;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 8px 20px rgba(0,0,0,0.25);
      color: #fff;
    }
    .mobile-nav-fab { left: 1.25rem; background: #3b82f6; }
    .mobile-ai-fab { right: 1.25rem; background: linear-gradient(135deg, #7c3aed, #4338ca); }
    .fab-badge { font-size: 0.8rem; font-weight: 800; font-family: var(--font-body); }

    @media (max-width: 900px) {
      html, body { overflow-x: hidden; }
      .exam-container { min-height: 100vh; overflow-x: hidden; }
      /* !important is required here: it beats the higher-specificity
         .exam-body.nav-collapsed / .ai-collapsed combos above (which set extra
         0px grid tracks for the desktop collapse toggles) that would otherwise
         still apply on mobile and leave the sole remaining grid child
         (question-area) auto-placed into a 0-width column. */
      .exam-body {
        grid-template-columns: 1fr !important;
        height: auto;
        min-height: calc(100vh - 64px);
        overflow: visible;
        padding: 0.75rem;
      }
      .header-center { display: none; }
      .exam-title { display: none; }

      /* Question nav becomes a full-screen slide-over drawer instead of being
         stacked inline (avoids forcing the student to scroll past a big
         question grid before reaching the actual question). */
      .question-nav {
        position: fixed !important;
        inset: 0 !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        width: 100% !important;
        height: 100vh !important;
        max-height: 100vh !important;
        border-radius: 0 !important;
        z-index: 2000 !important;
        margin: 0 !important;
      }

      /* AI panel becomes a bottom-sheet covering ~half the screen instead of a
         full-screen overlay, so the question stays visible above it while the
         chat is open. */
      .ai-panel {
        position: fixed !important;
        top: auto !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        inset: auto 0 0 0 !important;
        width: 100% !important;
        height: 50vh !important;
        max-height: 50vh !important;
        border-radius: 20px 20px 0 0 !important;
        z-index: 2000 !important;
        margin: 0 !important;
        box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.25);
      }

      /* Manual "enlarge" toggle for when the 50vh sheet isn't tall enough to
         read a longer answer comfortably — grows it close to full-screen. */
      .ai-panel.mobile-expanded {
        height: 88vh !important;
        max-height: 88vh !important;
      }

      .panel-close-btn, .panel-close-btn-ai { display: flex; }
      .mobile-expand-btn { display: flex; }
      .mobile-fab { display: flex; }

      /* The header "Consultar a Foco" toggle is redundant with the mobile FAB
         (bottom-right octopus button) once the AI panel has its own dedicated
         trigger on mobile — keep a single, unambiguous way to open the chat. */
      .btn-ai-float { display: none !important; }

      .question-area { height: auto; overflow: visible; }
      .question-content-container { height: auto; overflow: visible; padding: 0; }

      .question-area.with-reading-text {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .question-area.with-reading-text .reading-text-container {
        height: auto;
        max-height: 48vh;
        flex-shrink: 0;
      }
      .question-area.with-reading-text.focus-reading .question-content-container { display: none; }
      .question-area.with-reading-text.focus-question .reading-text-container { display: none; }

      .exam-header { padding: 0.75rem 1rem; flex-wrap: wrap; row-gap: 0.5rem; }
      .header-right { flex-wrap: wrap; gap: 0.5rem; row-gap: 0.5rem; }
      .header-right .mode-badge { display: none; }
      .timer { padding: 0.4rem 0.7rem; font-size: 1.05rem; }
      .header-right .btn.btn-ghost { padding: 0.5rem 0.8rem; font-size: 0.85rem; }

      .question-card { padding: 1rem; }
      .question-header { padding: 0.6rem 1rem; min-height: auto; flex-wrap: wrap; gap: 0.5rem; }

      .options-nav-row { flex-direction: column; align-items: stretch; gap: 0.75rem; }
      .btn-nav-inline { width: 100%; min-width: 0; }
      .bubble-sheet-inline { flex-wrap: wrap; order: -1; }
    }

    @media (max-width: 480px) {
      .exam-header { padding: 0.6rem 0.75rem; }
      .btn-icon { width: 32px; height: 32px; font-size: 1rem; }
      .header-right { gap: 0.4rem; }
      .foco-tokens-badge { font-size: 0.7rem !important; padding: 0.25rem 0.5rem !important; }
      .timer { font-size: 0.95rem; padding: 0.35rem 0.55rem; gap: 0.3rem; }
      .header-right .btn.btn-ghost { padding: 0.4rem 0.6rem; font-size: 0.78rem; }
      .option-btn.bubble-btn { width: 38px; height: 38px; font-size: 0.9rem; }
      .modal { padding: 1.5rem; max-width: 92vw; }
      .mobile-fab { padding: 0.75rem 0.95rem; font-size: 1.15rem; bottom: 1rem; }
      .mobile-nav-fab { left: 0.75rem; }
      .mobile-ai-fab { right: 0.75rem; }
    }

    /* ===== MATH RENDERING & FOCO STYLING ===== */
    .math-block {
      display: block;
      margin: 0.75rem auto;
      text-align: center;
      padding: 0.75rem;
      background: rgba(241, 245, 249, 0.6);
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-family: 'Cambria Math', 'Times New Roman', Times, serif, monospace;
      font-size: 1.05rem;
      color: #0f172a;
      overflow-x: auto;
      white-space: nowrap;
    }
    .math-inline {
      font-family: 'Cambria Math', 'Times New Roman', Times, serif, monospace;
      font-weight: 600;
      font-size: 1.02rem;
      color: #1d4ed8;
      padding: 0 2px;
      display: inline-block;
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
    .fraction-num {
      border-bottom: 1.5px solid #475569;
      padding-bottom: 1px;
    }
    .fraction-den {
      padding-top: 1px;
    }

    /* ===== LOADING SKELETON ===== */
    .image-skeleton {
      width: 100%;
      height: 300px;
      background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
      background-size: 200% 100%;
      animation: loading-shimmer 1.5s infinite;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
      border: 1px dashed #cbd5e1;
    }
    .skeleton-pulse {
      color: #64748b;
      font-weight: 500;
      font-size: 1.1rem;
      animation: pulse-text 1.5s infinite;
    }
    @keyframes loading-shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    @keyframes pulse-text {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }
    .hidden {
      display: none !important;
    }
  `]
})
export class EnsayoRunnerComponent implements OnInit, OnDestroy, AfterViewChecked {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private firestoreService = inject(FirestoreService);
  private aiAssistService = inject(AiAssistService);
  private toast = inject(ToastService);
  private dashboardService = inject(DashboardService);
  public paymentService = inject(PaymentService);
  private adminService = inject(AdminService);

  get isProPlan(): boolean {
    return this.firestoreService.profileSignal()?.plan === 'premium' || this.adminService.isAdmin() === true;
  }

  get focoLimit(): number {
    return this.isProPlan ? 500 : 5;
  }

  get focoUsed(): number {
    return this.firestoreService.profileSignal()?.dailyCredits?.focoTokensUsedToday || 0;
  }

  get focoRemaining(): number {
    return Math.max(0, this.focoLimit - this.focoUsed);
  }

  @ViewChild('chatScrollContainer') private chatContainer!: ElementRef;

  examId = '';
  intentoId = '';
  examTitle = 'Ensayo M1 - Forma 115';
  totalQuestions = 65;
  currentIndex = 0;
  answers: { [key: string]: string } = {};
  flagged: { [key: string]: boolean } = {};
  loading = true;
  mode: ExamMode = 'real';
  isLanguageModule = false;

  showExitModal = false;
  showRealExitModal = false;
  showPauseModal = false;
  showResumeModal = false;
  showFinishModal = false;
  resumeDirectly = false; // true when navigating via 'Continuar' widget

  // Timer
  timeRemaining = 140 * 60; // 2h 20m in seconds
  initialTimeSeconds = 140 * 60;
  startTime = Date.now();
  timerInterval: ReturnType<typeof setInterval> | null = null;
  isPaused = false;
  savedProgress: SavedProgress | null = null;

  aiMessages: AiMessage[] = [];
  aiLoading = false;
  chatInputText = '';
  private shouldScrollChat = false;
  private assistQuestionId: string | null = null;
  
  // UI State
  isNavCollapsed = false;
  isAiCollapsed = false;
  isAiExpandedMobile = false;
  isImageLoading = true;
  focusedPanel: 'both' | 'reading' | 'question' = 'both';

  toggleFocus(panel: 'reading' | 'question') {
    this.focusedPanel = this.focusedPanel === panel ? 'both' : panel;
  }

  // Preguntas cargadas desde Firestore
  questions: Question[] = [];

  get currentQuestion(): Question | null {
    return this.questions[this.currentIndex] || null;
  }

  get answeredCount(): number {
    return Object.keys(this.answers).length;
  }

  get formattedTime(): string {
    const hours = Math.floor(this.timeRemaining / 3600);
    const mins = Math.floor((this.timeRemaining % 3600) / 60);
    const secs = this.timeRemaining % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  get timeWarning(): boolean {
    return this.timeRemaining <= 15 * 60 && this.timeRemaining > 5 * 60;
  }

  get timeCritical(): boolean {
    return this.timeRemaining <= 5 * 60;
  }

  get isAssisted(): boolean {
    return this.mode === 'asistido';
  }

  ngOnInit() {
    // En pantallas angostas arrancamos con el navegador de preguntas y el panel del
    // tutor colapsados (se abren como paneles flotantes) para que la pregunta quede
    // visible de inmediato sin tener que hacer scroll.
    if (typeof window !== 'undefined' && window.innerWidth <= 900) {
      this.isNavCollapsed = true;
      this.isAiCollapsed = true;
    }
    this.examId = this.route.snapshot.paramMap.get('id') || '';
    this.intentoId = this.route.snapshot.queryParamMap.get('intento') || '';
    const modeParam = this.route.snapshot.queryParamMap.get('mode');
    this.mode = modeParam === 'asistido' ? 'asistido' : 'real';
    // 'resume=true' means user clicked 'Continuar' from the widget → skip resume modal
    this.resumeDirectly = this.route.snapshot.queryParamMap.get('resume') === 'true';
    const durationParam = Number(this.route.snapshot.queryParamMap.get('duration'));
    if (Number.isFinite(durationParam) && durationParam > 0) {
      this.timeRemaining = durationParam * 60;
      this.initialTimeSeconds = this.timeRemaining;
    }
    const nameParam = this.route.snapshot.queryParamMap.get('name');
    this.loadQuestions(nameParam);
  }

  ngOnDestroy() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    // Always release the body scroll lock on the way out — leaving it stuck
    // would make the entire rest of the app unscrollable (e.g. if the user
    // navigates to "review" while the mobile chat/nav overlay was open).
    if (typeof document !== 'undefined') document.body.style.overflow = '';
  }

  // On mobile, the question-nav and AI chat panels are fixed-position overlays
  // meant to scroll only internally. Without this, the page behind them can
  // still be scrolled (e.g. via touch drag), which visually drags the "fixed"
  // panel along with it and makes the user scroll the whole tab to read a
  // long chat instead of just the message list scrolling on its own.
  private updateMobileOverlayScrollLock() {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;
    const isMobile = window.innerWidth <= 900;
    const overlayOpen = isMobile && (!this.isNavCollapsed || (this.isAssisted && !this.isAiCollapsed));
    document.body.style.overflow = overlayOpen ? 'hidden' : '';
  }

  loadQuestions(customName: string | null = null) {
    this.loading = true;
    this.firestoreService.getPreguntas(this.examId).subscribe(preguntas => {
      this.questions = preguntas.map(p => this.mapPreguntaToQuestion(p));
      this.totalQuestions = this.questions.length;
      
      // Dynamic title based on ID or custom name
      this.setDynamicTitle(customName);

      this.loading = false;
      this.updateAssistContext();
      this.initializeExamFlow();
    });
  }

  private setDynamicTitle(customName: string | null = null) {
    const id = this.examId.toLowerCase();
    this.isLanguageModule = id.startsWith('l-');
    
    // Auto-collapse AI panel in Language module: layout is already 3 columns
    if (this.isLanguageModule) {
      this.isAiCollapsed = true;
    }

    if (customName) {
      this.examTitle = customName;
      return;
    }

    if (id.includes('l-2025')) this.examTitle = 'Competencia Lectora 2025';
    else if (id.includes('l-2026')) this.examTitle = 'Competencia Lectora 2026';
    else if (id.includes('l-invierno-2024')) this.examTitle = 'Competencia Lectora Invierno 2024';
    else if (id.includes('l-invierno-2025')) this.examTitle = 'Competencia Lectora Invierno 2025';
    else if (id.includes('l-invierno-2026')) this.examTitle = 'Competencia Lectora Invierno 2026';
    else if (id.includes('m1')) this.examTitle = 'Competencia Matemática 1';
    else if (id.includes('m2')) this.examTitle = 'Competencia Matemática 2';
    else if (id.includes('ciencias')) this.examTitle = 'Ciencias';
    else if (id.includes('historia')) this.examTitle = 'Historia y Cs. Sociales';
    else this.examTitle = 'Ensayo Oficial';
  }

  private initializeExamFlow() {
    if (this.intentoId) {
      this.loading = true;
      this.firestoreService.getIntento(this.intentoId).subscribe({
        next: (intento) => {
          if (intento && intento.status === 'in_progress') {
            // Sincronizar respuestas desde Firestore
            intento.answers.forEach((a: { preguntaId: string; selectedAnswer: string }) => {
              this.answers[a.preguntaId] = a.selectedAnswer;
            });
          }
          this.loading = false;
          this.finishInitialize();
        },
        error: () => {
          this.loading = false;
          this.finishInitialize();
        }
      });
    } else {
      this.finishInitialize();
    }
  }

  private finishInitialize() {
    if (this.isAssisted) {
      this.savedProgress = this.getSavedProgress();
      if (this.savedProgress) {
        if (this.resumeDirectly) {
          // Coming from 'Continuar' widget → auto-resume without modal
          this.applySavedProgress(this.savedProgress);
          this.savedProgress = null;
        } else {
          this.showResumeModal = true;
          return;
        }
      }
    }
    this.initialTimeSeconds = this.timeRemaining;
    this.startTimer();
  }

  private mapPreguntaToQuestion(pregunta: Pregunta): Question {
    return {
      id: pregunta.id || '',
      order: pregunta.order,
      stem: pregunta.text,
      options: [
        { id: 'A', text: pregunta.options.A },
        { id: 'B', text: pregunta.options.B },
        { id: 'C', text: pregunta.options.C },
        { id: 'D', text: pregunta.options.D },
        ...(pregunta.options.E !== undefined ? [{ id: 'E', text: pregunta.options.E }] : [])
      ],
      correctAnswer: pregunta.correctAnswer,
      imageUrl: pregunta.imageUrl ? (pregunta.imageUrl.startsWith('http') || pregunta.imageUrl.startsWith('/') ? pregunta.imageUrl : '/' + pregunta.imageUrl) : null,
      readingText: (pregunta as any).readingText ? (pregunta as any).readingText.map((t: string) => t.startsWith('http') || t.startsWith('/') ? t : '/' + t) : null
    };
  }

  startTimer() {
    this.startTime = Date.now();
    this.isPaused = false;
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining--;
      } else {
        this.submitExam();
      }
    }, 1000);
  }

  pauseTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = null;
    this.isPaused = true;
  }

  toggleNav() {
    this.isNavCollapsed = !this.isNavCollapsed;
    this.updateMobileOverlayScrollLock();
  }

  toggleAi() {
    this.isAiCollapsed = !this.isAiCollapsed;

    // On mobile, the AI panel opens as a bottom sheet over the top half of the
    // screen. In the Lenguaje module that top half already has to fit the
    // reading text AND the question, so free up space by auto-focusing the
    // question when the chat opens (user can still switch back manually).
    if (!this.isAiCollapsed && this.isLanguageModule && typeof window !== 'undefined' && window.innerWidth <= 900) {
      this.focusedPanel = 'question';
    }

    // Don't leave the chat pre-expanded the next time it's opened.
    if (this.isAiCollapsed) {
      this.isAiExpandedMobile = false;
    }

    this.updateMobileOverlayScrollLock();
  }

  // Mobile-only: the chat opens as a ~50vh bottom sheet, which can feel cramped
  // when reading a longer answer from Foco. Lets the student temporarily grow it.
  toggleAiExpandMobile() {
    this.isAiExpandedMobile = !this.isAiExpandedMobile;
  }

  selectOption(optionId: string) {
    if (this.currentQuestion) {
      this.answers[this.currentQuestion.id] = optionId;
      
      // Guardar respuesta en Firestore si hay intento activo
      if (this.intentoId) {
        const isCorrect = this.currentQuestion.correctAnswer === optionId;
        this.firestoreService.saveAnswer(this.intentoId, this.currentQuestion.id, optionId, isCorrect)
          .catch(() => {}); // Silenciar error si falla
      }

      if (this.isAssisted) {
        this.saveProgress();
      }
    }
  }

  toggleFlag() {
    if (this.currentQuestion) {
      this.flagged[this.currentQuestion.id] = !this.flagged[this.currentQuestion.id];
      if (this.isAssisted) {
        this.saveProgress();
      }
    }
  }

  goToQuestion(index: number) {
    if (this.currentIndex === index) return;
    
    this.isImageLoading = true;
    this.currentIndex = index;
    if (this.isAssisted) {
      this.saveProgress();
    }
    this.updateAssistContext();
    this.scrollToTop();
  }

  prevQuestion() {
    if (this.currentIndex > 0) {
      this.isImageLoading = true;
      this.currentIndex--;
      if (this.isAssisted) {
        this.saveProgress();
      }
      this.updateAssistContext();
      this.scrollToTop();
    }
  }

  nextQuestion() {
    if (this.currentIndex < this.totalQuestions - 1) {
      this.isImageLoading = true;
      this.currentIndex++;
      if (this.isAssisted) {
        this.saveProgress();
      }
      this.updateAssistContext();
      this.scrollToTop();
    }
  }

  private scrollToTop() {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' as any });
      
      // Scrolear el contenedor principal o área de la pregunta
      const mainContainer = document.querySelector('.exam-container') 
        || document.querySelector('.simulation-layout') 
        || document.querySelector('.question-column') 
        || document.querySelector('.runner-body') 
        || document.querySelector('.main-content')
        || document.querySelector('.exam-body');
        
      if (mainContainer) {
        mainContainer.scrollTop = 0;
      }
      
      // Scrolear cualquier div con overflow excepto el chat de Foco
      const scrollableDivs = document.querySelectorAll('.overflow-y-auto, .scrollable');
      scrollableDivs.forEach(div => {
        if (!div.classList.contains('ai-messages')) {
          div.scrollTop = 0;
        }
      });
    }
  }

  confirmExit() {
    if (this.isAssisted) {
      // Do NOT pause the timer — let it keep running until user actually exits
      this.showExitModal = true;
      return;
    }
    this.showRealExitModal = true;
  }

  cancelExit() {
    this.showExitModal = false;
    // Timer was never paused when opening exit modal, so nothing to restart
  }

  exitExam() {
    if (!this.isAssisted) return;
    this.pauseTimer();
    this.saveProgress();
    this.showExitModal = false;
    this.showPauseModal = false;
    this.router.navigate(['/ensayos']);
  }

  async exitRealExam() {
    this.pauseTimer();
    this.showRealExitModal = false;

    if (this.intentoId) {
      try {
        await this.firestoreService.abandonIntento(this.intentoId);
      } catch (e) {
        // Continuar aunque falle
      }
    }

    this.router.navigate(['/ensayos']);
  }

  pauseExam() {
    if (!this.isAssisted) return;
    this.pauseTimer();
    this.saveProgress();
    this.showPauseModal = true;
  }

  resumeExam() {
    if (!this.isAssisted) return;
    this.showPauseModal = false;
    this.startTimer();
  }

  finishExam() {
    this.showFinishModal = true;
  }

  async submitExam() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    
    const timeSpent = Math.max(this.initialTimeSeconds - this.timeRemaining, 0);
    
    // Calculate score for dashboard logging
    const correctAnswers = this.questions.filter(q => 
      this.answers[q.id] === q.correctAnswer
    ).length;
    
    // Log to dashboard service for both assisted and real modes
    try {
      const subject = this.getSubjectFromExamId(this.examId);
      this.dashboardService.logEnsayoCompleted({
        ensayoId: this.examId,
        ensayoTitle: this.examTitle,
        subject,
        correctAnswers,
        totalQuestions: this.totalQuestions,
        score: Math.round(100 + (correctAnswers / Math.max(this.totalQuestions, 1)) * 900),
        mode: this.isAssisted ? 'asistido' : 'real',
        intentoId: this.intentoId || undefined,
      });
    } catch (err) { 
      console.warn('[EnsayoRunner] Error logging to dashboard:', err);
    }
    
    // Finalizar intento en Firestore enviando respuestas completas y lista de preguntas
    if (this.intentoId) {
      try {
        await this.firestoreService.finishIntento(
          this.intentoId,
          timeSpent,
          this.totalQuestions,
          this.answers,
          this.questions
        );
      } catch (e) {
        // Continuar aunque falle
      }
    }

    if (this.isAssisted) {
      this.clearSavedProgress();
    }
    
    this.router.navigate(['/ensayo', this.examId, 'review'], {
      queryParams: { intento: this.intentoId },
      replaceUrl: true
    });
  }

  private updateAssistContext() {
    const questionId = this.currentQuestion?.id;
    if (!questionId || this.assistQuestionId === questionId) return;
    this.assistQuestionId = questionId;
    this.aiMessages = [];
    this.shouldScrollChat = true;
  }

  ngAfterViewChecked() {
    if (this.shouldScrollChat) {
      this.scrollChatToBottom();
      this.shouldScrollChat = false;
    }
  }

  private scrollChatToBottom() {
    try {
      if (this.chatContainer?.nativeElement) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    } catch { }
  }

  /** Sends a free-form chat message with full conversation history */
  async sendChatMessage() {
    const text = this.chatInputText.trim();
    if (!text || this.aiLoading || !this.currentQuestion) return;

    this.chatInputText = '';
    this.aiMessages.push({ role: 'user', content: text, timestamp: new Date() });
    this.shouldScrollChat = true;
    this.aiLoading = true;

    await this.callAiChat();
  }

  /** Sends a pre-defined quick message */
  async sendQuickMessage(text: string) {
    if (this.aiLoading || !this.currentQuestion) return;
    this.aiMessages.push({ role: 'user', content: text, timestamp: new Date() });
    this.shouldScrollChat = true;
    this.aiLoading = true;
    await this.callAiChat();
  }

  /** Handles Enter key - send on Enter, newline on Shift+Enter */
  onEnterKey(event: Event) {
    const ke = event as KeyboardEvent;
    if (!ke.shiftKey) {
      ke.preventDefault();
      this.sendChatMessage();
    }
  }

  /** Clears chat history for current question */
  clearChat() {
    this.aiMessages = [];
    this.shouldScrollChat = true;
  }

  /**
   * Core method: routed through the backend (POST /api/ai/chat).
   *
   * This used to call Gemini directly from the browser with an API key
   * embedded in the frontend bundle, and "consumed" a Foco token by just
   * mutating the local profile signal in memory — nothing was ever written
   * to Firestore. That meant the daily limit wasn't actually enforced (the
   * key was usable by anyone who opened devtools, with no auth or quota
   * check at all), and the on-screen token count would drift back up any
   * time the profile got re-fetched from the database, since the "usage"
   * had never really been persisted. The backend endpoint checks and
   * consumes the real per-user counter in Firestore before/after calling
   * the model, so this is now the single source of truth.
   */
  private async callAiChat() {
    if (!this.currentQuestion) { this.aiLoading = false; return; }

    if (this.focoRemaining <= 0) {
      this.aiLoading = false;
      this.aiMessages.push({
        role: 'assistant',
        content: `⚠️ Has alcanzado tus ${this.focoLimit} fichas/tokens diarias de Foco IA. Se recargarán mañana a la misma hora. ¡Pásate a PRO para tener 200 fichas diarias! 👑`,
        timestamp: new Date()
      });
      this.paymentService.openPricingModal();
      return;
    }

    const historyForApi = this.aiMessages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    try {
      const response = await this.aiAssistService.chatViaBackend({
        question: this.currentQuestion.stem,
        options: this.currentQuestion.options,
        userAnswer: this.answers[this.currentQuestion.id] || null,
        subject: this.examId,
        imageUrl: this.currentQuestion.imageUrl,
        readingImages: this.currentQuestion.readingText,
        history: historyForApi,
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

      this.aiMessages.push({ role: 'assistant', content: response.reply, timestamp: new Date() });
    } catch (err) {
      if (err instanceof FocoTokensExhaustedError) {
        this.aiMessages.push({
          role: 'assistant',
          content: `⚠️ Has alcanzado tus ${err.limit} fichas/tokens diarias de Foco IA. Se recargarán mañana a la misma hora. ¡Pásate a PRO para tener 500 fichas diarias! 👑`,
          timestamp: new Date()
        });
        const profile = this.firestoreService.profileSignal();
        if (profile) {
          this.firestoreService.profileSignal.set({
            ...profile,
            dailyCredits: { ...(profile.dailyCredits || {}), focoTokensUsedToday: err.limit }
          });
        }
        this.paymentService.openPricingModal();
      } else {
        this.toast.error('No se pudo conectar con el tutor IA.');
        this.aiMessages.push({
          role: 'assistant',
          content: 'Lo siento, no pude conectarme en este momento. Intenta de nuevo.',
          timestamp: new Date()
        });
      }
    } finally {
      this.aiLoading = false;
      this.shouldScrollChat = true;
    }
  }

  /** Legacy method kept for compatibility */
  async requestAssist() {
    await this.sendQuickMessage('Necesito una pista para resolverla.');
  }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    console.warn('[Runner] Error al cargar imagen:', img.src);
    img.style.display = 'none';
  }

  ensureLeadingSlash(url: string | null | undefined): string {
    if (!url) return '';
    if (url.startsWith('assets/') || url.startsWith('images/')) {
      return '/' + url;
    }
    return url;
  }

  formatAiMessage(text: string): string {
    return formatFocoMessage(text);
  }

  startNewAttempt() {
    const baseTime = this.savedProgress?.initialTimeSeconds ?? this.initialTimeSeconds;
    this.clearSavedProgress();
    this.answers = {};
    this.flagged = {};
    this.currentIndex = 0;
    this.initialTimeSeconds = baseTime;
    this.timeRemaining = baseTime;
    this.showResumeModal = false;
    this.startTimer();
  }

  resumeSavedAttempt() {
    if (!this.savedProgress) {
      this.showResumeModal = false;
      this.startTimer();
      return;
    }
    this.applySavedProgress(this.savedProgress);
    this.savedProgress = null;
    this.showResumeModal = false;
    this.startTimer();
  }

  private getSavedProgress(): SavedProgress | null {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return null;
      const parsed = JSON.parse(stored) as SavedProgress;
      // Only restore if it's for THIS exam and in assisted mode
      if (!parsed || parsed.examId !== this.examId || parsed.mode !== 'asistido') return null;
      return parsed;
    } catch {
      return null;
    }
  }

  private saveProgress() {
    if (!this.isAssisted) return;
    const progress: SavedProgress = {
      examId: this.examId,
      examName: this.examTitle,
      mode: 'asistido',
      timeRemaining: this.timeRemaining,
      initialTimeSeconds: this.initialTimeSeconds,
      currentIndex: this.currentIndex,
      answers: { ...this.answers },
      flagged: { ...this.flagged },
      updatedAt: Date.now()
    };
    localStorage.setItem(this.storageKey, JSON.stringify(progress));
  }

  private clearSavedProgress() {
    localStorage.removeItem(this.storageKey);
    this.savedProgress = null;
  }

  private applySavedProgress(progress: SavedProgress) {
    this.timeRemaining = progress.timeRemaining;
    this.initialTimeSeconds = progress.initialTimeSeconds;
    this.currentIndex = Math.min(progress.currentIndex, this.totalQuestions - 1);
    this.answers = { ...progress.answers };
    this.flagged = { ...progress.flagged };
  }

  // Single global key: only ONE assisted exam can be in-progress at a time
  private get storageKey(): string {
    return 'estudiauni_active_asistido';
  }

  /** Derive the dashboard subject ID from the exam ID */
  private getSubjectFromExamId(examId: string): string {
    const id = examId.toLowerCase();
    if (id.includes('ciencias-tp') || id.includes('ciencias_tp') || id.includes('tp')) return 'ciencias-tp';
    if (id.includes('ciencias-biologia') || id.includes('biologia') || id.includes('bio')) return 'ciencias-biologia';
    if (id.includes('ciencias-fisica') || id.includes('fisica') || id.includes('fis')) return 'ciencias-fisica';
    if (id.includes('ciencias-quimica') || id.includes('quimica') || id.includes('qui')) return 'ciencias-quimica';
    if (id.includes('ciencias')) return 'ciencias-tp'; // generic ciencias fallback
    if (id.startsWith('l-') || id.includes('lectora') || id.includes('lenguaje')) return 'comp-lectora';
    if (id.includes('m2')) return 'mat2';
    if (id.includes('m1')) return 'mat1';
    if (id.includes('historia')) return 'historia';
    return 'general';
  }
}
