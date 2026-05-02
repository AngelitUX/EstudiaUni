import { Component, inject, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FirestoreService, Pregunta } from '../../core/services/firestore.service';
import { AiAssistService, ChatMessage } from '../../core/services/ai-assist.service';
import { ToastService } from '../../core/services/toast.service';

interface Question {
  id: string;
  stem: string;
  options: { id: string; text: string }[];
  correctAnswer?: string;
  imageUrl?: string | null;
}

type ExamMode = 'real' | 'asistido';

interface SavedProgress {
  examId: string;
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
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="exam-container">
      <!-- HEADER MINIMALISTA -->
      <header class="exam-header">
        <div class="header-left">
          <button class="btn-icon" (click)="confirmExit()">←</button>
          <span class="exam-title">{{ examTitle }}</span>
        </div>
        
        <div class="header-center">
          <div class="progress-info">
            <div class="progress-bar-container">
              <div class="progress-bar" [style.width.%]="(currentIndex + 1) / totalQuestions * 100"></div>
            </div>
            <span class="progress-text">Pregunta {{ currentIndex + 1 }} de {{ totalQuestions }}</span>
          </div>
        </div>
        
        <div class="header-right">
          <span class="mode-badge" [class.assisted]="isAssisted">
            {{ isAssisted ? 'Asistido' : 'Real' }}
          </span>
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
      <div class="exam-body" [class.assisted-layout]="isAssisted">
        <!-- QUESTION NAVIGATOR (Left Column) -->
        <aside class="question-nav">
          <h4 class="nav-title">Navegador</h4>
          <div class="question-grid">
            <button 
              *ngFor="let q of questions; let i = index"
              class="q-btn"
              [class.answered]="answers[q.id]"
              [class.current]="currentIndex === i"
              [class.flagged]="flagged[q.id]"
              (click)="goToQuestion(i)">
              {{ i + 1 }}
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

        <!-- QUESTION AREA (Center Column) -->
        <main class="question-area">
          <div class="question-card glass-card" *ngIf="currentQuestion">
            <div class="question-header">
              <span class="question-number">Pregunta {{ currentIndex + 1 }}</span>
              <button 
                class="flag-btn" 
                [class.flagged]="flagged[currentQuestion.id]"
                (click)="toggleFlag()">
                {{ flagged[currentQuestion.id] ? '🚩 Marcada' : '🏳️ Marcar' }}
              </button>
            </div>

            <div class="question-stem">
              <p *ngIf="!currentQuestion.imageUrl">{{ currentQuestion.stem }}</p>
              <img *ngIf="currentQuestion.imageUrl" [src]="currentQuestion.imageUrl" alt="Imagen de la pregunta" class="question-image" />
            </div>

            <div class="options-list bubble-sheet">
              <button 
                *ngFor="let opt of currentQuestion.options"
                class="option-btn bubble-btn"
                [class.selected]="answers[currentQuestion.id] === opt.id"
                (click)="selectOption(opt.id)">
                {{ opt.id }}
              </button>
            </div>
          </div>

          <!-- NAVIGATION -->
          <div class="question-navigation">
            <button 
              class="btn btn-outline"
              [disabled]="currentIndex === 0"
              (click)="prevQuestion()">
              ← Anterior
            </button>
            
            <button 
              *ngIf="currentIndex < totalQuestions - 1"
              class="btn btn-primary"
              (click)="nextQuestion()">
              Siguiente Pregunta →
            </button>

            <button 
              *ngIf="currentIndex === totalQuestions - 1"
              class="btn btn-success"
              (click)="finishExam()">
              ✓ Finalizar Ensayo
            </button>
          </div>
        </main>

        <!-- AI CHAT PANEL (Right Column) -->
        <aside class="ai-panel glass-card" *ngIf="isAssisted">
          <div class="ai-header">
            <div class="ai-header-left">
              <div class="ai-avatar">🤖</div>
              <div>
                <h4 class="ai-title">Tutor IA</h4>
                <span class="ai-status">{{ aiLoading ? 'Pensando...' : 'En línea' }}</span>
              </div>
            </div>
            <button class="btn-icon-sm" (click)="clearChat()" title="Limpiar chat">🗑️</button>
          </div>

          <div class="ai-messages" #chatScrollContainer>
            <div
              *ngFor="let msg of aiMessages"
              class="ai-bubble"
              [class.user]="msg.role === 'user'"
              [class.assistant]="msg.role === 'assistant'">
              <div class="bubble-role">{{ msg.role === 'user' ? 'Tú' : '🤖 Tutor' }}</div>
              <div class="bubble-content">{{ msg.content }}</div>
              <div class="bubble-time" *ngIf="msg.timestamp">
                {{ msg.timestamp | date:'HH:mm' }}
              </div>
            </div>
            <div *ngIf="aiLoading" class="ai-bubble assistant loading-bubble">
              <div class="bubble-role">🤖 Tutor</div>
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
      </div>

      <!-- PAUSE MODAL -->
      <div class="modal-overlay" *ngIf="showPauseModal">
        <div class="modal glass-card" (click)="$event.stopPropagation()">
          <h3>Ensayo en pausa</h3>
          <p>El tiempo está detenido. Puedes reanudar cuando quieras.</p>
          <div class="modal-actions">
            <button class="btn btn-outline" (click)="exitExam()">Salir</button>
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
            <button class="btn btn-success" (click)="submitExam()">Finalizar</button>
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
      --glass-border: #e5e7eb;
    }
    
    .exam-container { min-height: 100vh; display: flex; flex-direction: column; color: #111827; }
    
    /* ===== HEADER ===== */
    .exam-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 2rem;
      background: #ffffff;
      border-bottom: 1px solid var(--glass-border);
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .header-left { display: flex; align-items: center; gap: 1rem; }
    .btn-icon {
      background: #f3f4f6;
      border: 1px solid #e5e7eb;
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
      border: 1px solid #e2e8f0;
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
      gap: 2rem;
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
    }
    .exam-body.assisted-layout {
      grid-template-columns: 280px 1fr 320px;
    }

    /* ===== QUESTION NAV ===== */
    .question-nav {
      background: #ffffff;
      border: 1px solid var(--glass-border);
      border-radius: 16px;
      padding: 1.5rem;
      height: fit-content;
      position: sticky;
      top: 100px;
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
      border-top: 1px solid var(--glass-border);
      border-bottom: 1px solid var(--glass-border);
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
      border: 1px solid var(--glass-border);
      height: calc(100vh - 130px);
      max-height: 750px;
      position: sticky;
      top: 100px;
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
      border-bottom: 1px solid var(--glass-border);
      flex-shrink: 0;
    }
    .ai-header-left { display: flex; align-items: center; gap: 0.75rem; }
    .ai-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3b82f6, #6366f1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
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
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      overflow-y: auto;
      padding: 1rem 1rem;
      scroll-behavior: smooth;
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
      border-top: 1px solid var(--glass-border);
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
      border-top: 1px solid var(--glass-border);
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
      padding: 2.5rem;
      border-radius: 20px;
      background: #ffffff;
      border: 1px solid var(--glass-border);
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    .question-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .question-number {
      font-size: 0.9rem;
      color: #6366f1;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
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
      margin-bottom: 2rem;
    }
    .question-image {
      max-width: 100%;
      height: auto;
      margin-top: 1rem;
      border: none;
      background: transparent;
      padding: 0;
      mix-blend-mode: multiply;
    }
    .options-list { display: flex; flex-direction: column; gap: 1rem; }
    .options-list.bubble-sheet {
      flex-direction: row;
      justify-content: center;
      gap: 2rem;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px dashed #e2e8f0;
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
      width: 56px;
      height: 56px;
      border-radius: 50%;
      justify-content: center;
      font-weight: 700;
      font-size: 1.3rem;
      color: #64748b;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
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

    /* ===== NAVIGATION ===== */
    .question-navigation {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
    }
    .btn { padding: 0.85rem 1.75rem; border-radius: 10px; font-weight: 600; font-size: 1rem; cursor: pointer; transition: all 0.2s; border: none; }
    .btn-primary { background: linear-gradient(135deg, #3b82f6, #6366f1); color: #fff; }
    .btn-primary:hover { opacity: 0.9; transform: translateY(-2px); }
    .btn-outline { background: #ffffff; border: 2px solid #cbd5e1; color: #475569; }
    .btn-outline:hover { border-color: #3b82f6; color: #3b82f6; }
    .btn-outline:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-success { background: linear-gradient(135deg, #10b981, #059669); color: #fff; }
    .btn-ghost { background: transparent; color: #64748b; border: none; }
    .btn-ghost:hover { color: #1e293b; background: #f1f5f9; border-radius: 8px; }

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

    .glass-card { background: #ffffff; border: 1px solid var(--glass-border); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 900px) {
      .exam-body { grid-template-columns: 1fr; }
      .exam-body.assisted-layout { grid-template-columns: 1fr; }
      .question-nav { position: relative; top: 0; }
      .ai-panel { position: relative; top: 0; }
      .header-center { display: none; }
      .exam-title { display: none; }
    }
  `]
})
export class EnsayoRunnerComponent implements OnInit, OnDestroy, AfterViewChecked {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private firestoreService = inject(FirestoreService);
  private aiAssistService = inject(AiAssistService);
  private toast = inject(ToastService);

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

  showExitModal = false;
  showRealExitModal = false;
  showPauseModal = false;
  showResumeModal = false;
  showFinishModal = false;

  // Timer
  timeRemaining = 140 * 60; // 2h 20m in seconds
  initialTimeSeconds = 140 * 60;
  startTime = Date.now();
  timerInterval: any;
  isPaused = false;
  savedProgress: SavedProgress | null = null;

  aiMessages: AiMessage[] = [
    { role: 'assistant', content: '¡Hola! Soy tu tutor IA. Puedo darte pistas y ayudarte a razonar cada pregunta sin revelar la respuesta directa. ¿En qué puedo ayudarte?', timestamp: new Date() },
  ];
  aiLoading = false;
  chatInputText = '';
  private shouldScrollChat = false;
  private assistQuestionId: string | null = null;

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
    this.examId = this.route.snapshot.paramMap.get('id') || '';
    this.intentoId = this.route.snapshot.queryParamMap.get('intento') || '';
    const modeParam = this.route.snapshot.queryParamMap.get('mode');
    this.mode = modeParam === 'asistido' ? 'asistido' : 'real';
    const durationParam = Number(this.route.snapshot.queryParamMap.get('duration'));
    if (Number.isFinite(durationParam) && durationParam > 0) {
      this.timeRemaining = durationParam * 60;
      this.initialTimeSeconds = this.timeRemaining;
    }
    this.loadQuestions();
  }

  ngOnDestroy() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  loadQuestions() {
    this.loading = true;
    this.firestoreService.getPreguntas(this.examId).subscribe(preguntas => {
      this.questions = preguntas.map(p => this.mapPreguntaToQuestion(p));
      this.totalQuestions = this.questions.length;
      this.loading = false;
      this.updateAssistContext();
      this.initializeExamFlow();
    });
  }

  private initializeExamFlow() {
    if (this.isAssisted) {
      this.savedProgress = this.getSavedProgress();
      if (this.savedProgress) {
        this.showResumeModal = true;
        return;
      }
    }
    this.initialTimeSeconds = this.timeRemaining;
    this.startTimer();
  }

  private mapPreguntaToQuestion(pregunta: Pregunta): Question {
    return {
      id: pregunta.id || '',
      stem: pregunta.text,
      options: [
        { id: 'A', text: pregunta.options.A },
        { id: 'B', text: pregunta.options.B },
        { id: 'C', text: pregunta.options.C },
        { id: 'D', text: pregunta.options.D }
      ],
      correctAnswer: pregunta.correctAnswer,
      imageUrl: (pregunta as any).imageUrl ? ((pregunta as any).imageUrl.startsWith('/') ? (pregunta as any).imageUrl : '/' + (pregunta as any).imageUrl) : null
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
    this.currentIndex = index;
    if (this.isAssisted) {
      this.saveProgress();
    }
    this.updateAssistContext();
  }

  prevQuestion() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      if (this.isAssisted) {
        this.saveProgress();
      }
      this.updateAssistContext();
    }
  }

  nextQuestion() {
    if (this.currentIndex < this.totalQuestions - 1) {
      this.currentIndex++;
      if (this.isAssisted) {
        this.saveProgress();
      }
      this.updateAssistContext();
    }
  }

  confirmExit() {
    if (this.isAssisted) {
      this.pauseTimer();
      this.showExitModal = true;
      return;
    }
    this.showRealExitModal = true;
  }

  cancelExit() {
    this.showExitModal = false;
    if (this.isAssisted) {
      this.startTimer();
    }
  }

  exitExam() {
    if (!this.isAssisted) return;
    this.pauseTimer();
    this.saveProgress();
    this.showExitModal = false;
    this.showPauseModal = false;
    this.router.navigate(['/ensayos']);
  }

  exitRealExam() {
    this.pauseTimer();
    this.showRealExitModal = false;
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
    
    // Finalizar intento en Firestore
    if (this.intentoId) {
      try {
        await this.firestoreService.finishIntento(this.intentoId, timeSpent);
      } catch (e) {
        // Continuar aunque falle
      }
    }

    if (this.isAssisted) {
      this.clearSavedProgress();
    }
    
    this.router.navigate(['/ensayo', this.examId, 'review'], {
      queryParams: { intento: this.intentoId }
    });
  }

  private updateAssistContext() {
    const questionId = this.currentQuestion?.id;
    if (!questionId || this.assistQuestionId === questionId) return;
    this.assistQuestionId = questionId;
    this.aiMessages = [
      { role: 'assistant', content: '¡Nueva pregunta! Estoy listo para ayudarte. Puedes escribirme o usar las acciones rápidas.', timestamp: new Date() },
    ];
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
    this.aiMessages = [
      { role: 'assistant', content: 'Chat limpiado. ¿En qué puedo ayudarte con esta pregunta?', timestamp: new Date() },
    ];
    this.shouldScrollChat = true;
  }

  /** Core method: calls Gemini directly (no backend needed) */
  private async callAiChat() {
    if (!this.currentQuestion) { this.aiLoading = false; return; }

    const historyForApi = this.aiMessages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    try {
      const response = await this.aiAssistService.chatDirect({
        question: this.currentQuestion.stem,
        options: this.currentQuestion.options,
        userAnswer: this.answers[this.currentQuestion.id] || null,
        subject: this.examId,
        history: historyForApi,
      });
      this.aiMessages.push({ role: 'assistant', content: response.reply, timestamp: new Date() });
    } catch {
      this.toast.error('No se pudo conectar con el tutor IA.');
      this.aiMessages.push({
        role: 'assistant',
        content: 'Lo siento, no pude conectarme en este momento. Intenta de nuevo.',
        timestamp: new Date()
      });
    } finally {
      this.aiLoading = false;
      this.shouldScrollChat = true;
    }
  }

  /** Legacy method kept for compatibility */
  async requestAssist() {
    await this.sendQuickMessage('Necesito una pista para resolverla.');
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

  private get storageKey(): string {
    return `ensayo_assistido_${this.examId}`;
  }
}
