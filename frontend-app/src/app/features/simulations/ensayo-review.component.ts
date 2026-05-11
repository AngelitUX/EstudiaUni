import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FirestoreService, Intento, Pregunta } from '../../core/services/firestore.service';
import { from, map, forkJoin, of } from 'rxjs';

interface ReviewQuestion {
  id: number;
  stem: string;
  options: { id: string; text: string }[];
  userAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: {
    whyWrong?: string;
    correctSolution: string;
    tip: string;
  };
  imageUrl?: string;
}

@Component({
  selector: 'app-ensayo-review',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="review-container">
      <!-- LOADING OVERLAY -->
      <div class="loading-overlay" *ngIf="loading">
        <div class="spinner"></div>
        <p>Calculando resultados...</p>
      </div>

      <!-- HEADER -->
        <header class="review-header">
          <div class="header-left">
            <button class="btn-back" routerLink="/ensayos">← Volver</button>
            <div class="header-info">
              <h1>Revisión: {{ examTitle }}</h1>
              <p class="header-subtitle">Revisa tus respuestas y aprende de los errores</p>
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
      <div class="review-body">
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
                [class.correct-answer]="question.isCorrect && question.correctAnswer === opt.id"
                [class.wrong-answer]="question.userAnswer === opt.id && question.correctAnswer !== opt.id">
                
                <span class="option-id">{{ opt.id }}</span>
                <span class="option-text">{{ opt.text }}</span>
                
                <span class="option-indicator" *ngIf="question.isCorrect && question.correctAnswer === opt.id">✓ Correcta</span>
                <span class="option-indicator wrong" *ngIf="question.userAnswer === opt.id && question.correctAnswer !== opt.id">✗ Tu respuesta</span>
              </div>
            </div>

            <!-- AI EXPLANATION REMOVED AS REQUESTED -->
          </div>
        </div>

        <!-- ACTIONS -->
        <div class="review-actions">
          <button class="btn btn-primary btn-finalizar" routerLink="/ensayos">
            Finalizar
          </button>
        </div>
      </div>
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
    
    /* ===== HEADER ===== */
    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 2rem;
      background: #ffffff;
      border-bottom: 2px solid #e2e8f0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      position: sticky;
      top: 0;
      z-index: 100;
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
    .question-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
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

    /* ===== AI EXPLANATION ===== */
    .ai-explanation {
      margin-top: 1.5rem;
      background: rgba(99, 102, 241, 0.05);
      border: 2px solid rgba(99, 102, 241, 0.3);
      border-radius: 12px;
    }
    .ai-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.25rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid rgba(99, 102, 241, 0.3);
    }
    .ai-icon { font-size: 1.5rem; }
    .ai-title { font-weight: 600; color: var(--accent-primary); font-size: 1rem; }
    .explanation-content { display: flex; flex-direction: column; gap: 1.25rem; }
    .explanation-section h4 {
      font-size: 0.9rem;
      font-weight: 600;
      color: #fff;
      margin-bottom: 0.5rem;
    }
    .explanation-section p { color: var(--text-secondary); line-height: 1.7; font-size: 0.95rem; }
    .solution-box {
      background: rgba(0, 0, 0, 0.2);
      padding: 1rem;
      border-radius: 8px;
      font-family: monospace;
    }
    .solution-box p { color: #e2e8f0; }
    .explanation-section.tip {
      background: rgba(249, 115, 22, 0.1);
      padding: 1rem;
      border-radius: 8px;
      border-left: 3px solid #f97316;
    }
    .explanation-section.tip h4 { color: #f97316; }

    /* ===== ACTIONS ===== */
    .review-actions { display: flex; justify-content: center; margin-top: 3rem; padding-top: 2rem; border-top: 2px solid var(--glass-border); }
    .btn { padding: 1rem 3rem; border-radius: 12px; font-weight: 700; font-size: 1rem; cursor: pointer; transition: all 0.2s; border: none; }
    .btn-primary { background: #855cd6; color: #fff; box-shadow: 0 4px 15px rgba(133, 92, 214, 0.3); }
    .btn-primary:hover { transform: translateY(-2px); background: #7349c2; box-shadow: 0 8px 25px rgba(133, 92, 214, 0.4); }
    .btn-finalizar { text-transform: uppercase; letter-spacing: 1px; min-width: 250px; }

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
    @media (max-width: 768px) {
      .review-header { flex-direction: column; gap: 1.5rem; align-items: flex-start; }
      .summary-cards { grid-template-columns: 1fr; }
      .filter-tabs { flex-direction: column; }
      .review-actions { flex-direction: column; gap: 1rem; }
      .review-actions .btn { width: 100%; }
    }
  `]
})
export class EnsayoReviewComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private firestoreService = inject(FirestoreService);

  examId = '';
  examTitle = 'Cargando...';
  score = 0;
  totalQuestions = 0;
  activeFilter = 'all';
  loading = true;

  questions: ReviewQuestion[] = [];

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

  ngOnInit() {
    this.examId = this.route.snapshot.paramMap.get('id') || '';
    const intentoId = this.route.snapshot.queryParamMap.get('intento');

    if (intentoId) {
      this.loadIntentoData(intentoId);
    } else {
      this.loading = false;
    }
  }

  private loadIntentoData(intentoId: string) {
    this.loading = true;
    
    forkJoin({
      intento: this.firestoreService.getIntento(intentoId),
      preguntas: this.firestoreService.getPreguntas(this.examId),
      ensayo: this.firestoreService.getEnsayo(this.examId)
    }).subscribe({
      next: (data: any) => {
        if (data.intento && data.preguntas) {
          this.score = data.intento.score || 0;
          this.examTitle = data.ensayo?.title || this.getGenericTitle(this.examId);
          this.totalQuestions = data.preguntas.length;
          
          this.questions = data.preguntas.map((p: any) => {
            const userAnsObj = data.intento?.answers.find((a: any) => a.preguntaId === p.id);
            return {
              id: p.order,
              stem: p.text,
              imageUrl: p.imageUrl ? (p.imageUrl.startsWith('/') ? p.imageUrl : '/' + p.imageUrl) : undefined,
              options: [
                { id: 'A', text: p.options.A },
                { id: 'B', text: p.options.B },
                { id: 'C', text: p.options.C },
                { id: 'D', text: p.options.D },
                ...(p.options.E !== undefined ? [{ id: 'E', text: p.options.E }] : [])
              ],
              userAnswer: userAnsObj?.selectedAnswer || null,
              correctAnswer: p.correctAnswer,
              isCorrect: userAnsObj?.isCorrect || false,
              explanation: {
                whyWrong: userAnsObj && !userAnsObj.isCorrect ? (p as any).whyWrong || 'La respuesta elegida no cumple con las condiciones del problema.' : undefined,
                correctSolution: p.explanation || 'Consultar material de estudio para el desarrollo detallado.',
                tip: (p as any).tip || 'Lee siempre bien el enunciado y las unidades antes de responder.'
              }
            };
          });
        }
        this.loading = false;
      },
      error: () => {
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
}
