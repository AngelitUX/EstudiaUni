import { Injectable, signal, computed, inject } from '@angular/core';
import { PoolPregunta, MateriaId } from '../../features/learning-path/models/paes.models';
import { PaesContentService } from '../../features/learning-path/services/paes-content.service';
import { DashboardService } from './dashboard.service';
import { FirestoreService } from './firestore.service';
import { AdminService } from '../../features/admin/services/admin.service';

export const FREE_MINI_ENSAYO_MAX_QUESTIONS = 16;

export interface MiniEnsayoConfig {
  materiaId: MateriaId;
  selectedTopics: string[];
  questionCount: 16 | 24 | 30;
  timeLimitMinutes: number;
  mode: 'personalizado' | 'mejorador';
  sourceIntento?: {
    intentoId: string;
    ensayoId: string;
    ensayoTitle: string;
    previousTopicScores: { topic: string; correct: number; total: number }[];
  };
}

export interface MiniEnsayoSession {
  id: string;
  config: MiniEnsayoConfig;
  questions: PoolPregunta[];
  startedAt: string;
}

export interface MiniEnsayoResult {
  sessionId: string;
  config: MiniEnsayoConfig;
  answers: Record<string, 'A' | 'B' | 'C' | 'D' | null>;
  questionIds: string[];
  correctCount: number;
  totalQuestions: number;
  score: number;
  topicBreakdown: { topic: string; correct: number; total: number; percentage: number }[];
  timeSpent: number;
  timestamp: string;
  improvement?: {
    specific: { topic: string; before: number; after: number; delta: number }[];
    global: { topic: string; avgBefore: number; after: number; delta: number }[];
  };
}

@Injectable({ providedIn: 'root' })
export class MiniEnsayoService {
  private paesContent = inject(PaesContentService);
  private dashboardSvc = inject(DashboardService);
  private firestoreService = inject(FirestoreService);
  private adminService = inject(AdminService);

  private isProPlan(): boolean {
    // Los admin reciben trato PRO en toda la app y en el backend
    // (SubscriptionsService). Aqui quedaban fuera, asi que a una cuenta admin
    // se le aplicaba el tope de preguntas del plan gratuito y el limite de un
    // mini ensayo al dia.
    if (this.adminService.isAdmin() === true) return true;
    return this.firestoreService.profileSignal()?.plan === 'premium';
  }

  private _activeSession = signal<MiniEnsayoSession | null>(null);
  readonly activeSession = this._activeSession.asReadonly();

  private _lastResult = signal<MiniEnsayoResult | null>(null);
  readonly lastResult = this._lastResult.asReadonly();

  constructor() {
    this.loadSessionFromStorage();
  }

  getAvailableTopics(materiaId: MateriaId): { topic: string; count: number }[] {
    const allPreguntas = this.paesContent.poolPreguntas();
    const materiaPreguntas = allPreguntas.filter(p => p.materiaId === materiaId);
    
    const topicMap = new Map<string, number>();
    for (const p of materiaPreguntas) {
      if (p.tema) {
        topicMap.set(p.tema, (topicMap.get(p.tema) || 0) + 1);
      }
    }
    
    return Array.from(topicMap.entries())
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count);
  }

  generateSession(config: MiniEnsayoConfig): MiniEnsayoSession {
    const allPreguntas = this.paesContent.poolPreguntas();

    // Free users are capped at FREE_MINI_ENSAYO_MAX_QUESTIONS regardless of what the UI requested
    const requestedCount = this.isProPlan() ? config.questionCount : Math.min(config.questionCount, FREE_MINI_ENSAYO_MAX_QUESTIONS);

    // Filter by materia and topics
    let eligible = allPreguntas.filter(p =>
      p.materiaId === config.materiaId && config.selectedTopics.includes(p.tema)
    );

    // Shuffle and take N
    eligible = eligible.sort(() => Math.random() - 0.5);
    const selected = eligible.slice(0, Math.min(requestedCount, eligible.length));

    const session: MiniEnsayoSession = {
      id: crypto.randomUUID(),
      config: {
        ...config,
        questionCount: selected.length as 16 | 24 | 30 // Adjust if not enough questions
      },
      questions: selected,
      startedAt: new Date().toISOString()
    };
    
    this._activeSession.set(session);
    this.saveSessionToStorage(session);
    return session;
  }

  submitSession(sessionId: string, answers: Record<string, 'A' | 'B' | 'C' | 'D' | null>, timeSpentSec: number): MiniEnsayoResult {
    const session = this._activeSession();
    if (!session || session.id !== sessionId) {
      throw new Error('No active session matches the ID');
    }

    let correctCount = 0;
    const topicBreakdownMap = new Map<string, { correct: number, total: number }>();
    
    session.config.selectedTopics.forEach(t => topicBreakdownMap.set(t, { correct: 0, total: 0 }));

    for (const q of session.questions) {
      const isCorrect = answers[q.id] === q.respuesta_correcta;
      if (isCorrect) correctCount++;
      
      const stats = topicBreakdownMap.get(q.tema) || { correct: 0, total: 0 };
      stats.total++;
      if (isCorrect) stats.correct++;
      topicBreakdownMap.set(q.tema, stats);
    }

    const topicBreakdown = Array.from(topicBreakdownMap.entries())
      .map(([topic, stats]) => ({
        topic,
        correct: stats.correct,
        total: stats.total,
        percentage: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
      }))
      .filter(t => t.total > 0);

    const percentage = correctCount / session.questions.length;
    // PAES score approx (100 to 1000)
    const score = Math.round(100 + (percentage * 900));

    const result: MiniEnsayoResult = {
      sessionId,
      config: session.config,
      answers,
      questionIds: session.questions.map(q => q.id),
      correctCount,
      totalQuestions: session.questions.length,
      score,
      topicBreakdown,
      timeSpent: timeSpentSec,
      timestamp: new Date().toISOString()
    };

    if (session.config.mode === 'mejorador' && session.config.sourceIntento) {
      result.improvement = this.calculateImprovement(result, session.config.sourceIntento);
    }

    this._lastResult.set(result);
    this.clearSessionStorage();
    this._activeSession.set(null);

    // Persist to dashboard history
    this.saveResultToHistory(result);

    return result;
  }

  private calculateImprovement(result: MiniEnsayoResult, sourceIntento: MiniEnsayoConfig['sourceIntento']) {
    if (!sourceIntento) return undefined;

    const specific: any[] = [];
    
    result.topicBreakdown.forEach(curr => {
      const prev = sourceIntento.previousTopicScores.find(p => p.topic === curr.topic);
      if (prev && prev.total > 0) {
        const prevPct = Math.round((prev.correct / prev.total) * 100);
        specific.push({
          topic: curr.topic,
          before: prevPct,
          after: curr.percentage,
          delta: curr.percentage - prevPct
        });
      }
    });

    return { specific, global: [] }; // Global to be implemented if history exists
  }

  setLastResult(result: MiniEnsayoResult) {
    this._lastResult.set(result);
  }

  private saveResultToHistory(result: MiniEnsayoResult) {
    const materia = this.paesContent.getMateriaById(result.config.materiaId);
    
    this.dashboardSvc.logMiniEnsayoCompleted({
      id: result.sessionId,
      type: 'mini-ensayo',
      title: `Mini Ensayo ${materia?.title || 'Personalizado'}`,
      subject: result.config.materiaId,
      subjectIcon: materia?.icon || '🎯',
      score: result.score,
      totalCorrect: result.correctCount,
      totalQuestions: result.totalQuestions,
      timestamp: result.timestamp,
      timeLimit: result.config.timeLimitMinutes,
      mode: result.config.mode as 'real' | 'asistido',
      playedQuestionsRaw: JSON.stringify(result.topicBreakdown) // abuse this field for topic breakdown
    });
    
    // Save full result to local storage history
    try {
      const historyRaw = localStorage.getItem('estudiauni_mini_ensayo_history') || '[]';
      const history = JSON.parse(historyRaw);
      history.push(result);
      localStorage.setItem('estudiauni_mini_ensayo_history', JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save mini ensayo history', e);
    }
  }
  
  getSessionHistory(): MiniEnsayoResult[] {
    try {
      const historyRaw = localStorage.getItem('estudiauni_mini_ensayo_history') || '[]';
      return JSON.parse(historyRaw);
    } catch (e) {
      return [];
    }
  }

  /** Most recently completed mini-ensayo, regardless of plan, or null if none yet. */
  getLastCompletedResult(): MiniEnsayoResult | null {
    const history = this.getSessionHistory();
    return history.length > 0 ? history[history.length - 1] : null;
  }

  /** Free users only get 1 mini-ensayo per calendar day. Pro users are unlimited. */
  canStartToday(): { allowed: boolean; nextAvailableAt?: Date } {
    if (this.isProPlan()) return { allowed: true };

    const history = this.getSessionHistory();
    if (history.length === 0) return { allowed: true };

    const todayStr = new Date().toDateString();
    const lastResult = history[history.length - 1];
    const lastDate = new Date(lastResult.timestamp);

    if (lastDate.toDateString() !== todayStr) return { allowed: true };

    const nextAvailableAt = new Date(lastDate);
    nextAvailableAt.setDate(nextAvailableAt.getDate() + 1);
    nextAvailableAt.setHours(0, 0, 0, 0);

    return { allowed: false, nextAvailableAt };
  }

  private saveSessionToStorage(session: MiniEnsayoSession) {
    localStorage.setItem('estudiauni_active_mini_ensayo', JSON.stringify(session));
  }

  private loadSessionFromStorage() {
    try {
      const stored = localStorage.getItem('estudiauni_active_mini_ensayo');
      if (stored) {
        this._activeSession.set(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load mini ensayo session', e);
    }
  }

  private clearSessionStorage() {
    localStorage.removeItem('estudiauni_active_mini_ensayo');
    // Also clear answers if any
    localStorage.removeItem('estudiauni_active_mini_ensayo_answers');
  }
  
  saveAnswersDraft(answers: Record<string, string | null>) {
    localStorage.setItem('estudiauni_active_mini_ensayo_answers', JSON.stringify(answers));
  }
  
  loadAnswersDraft(): Record<string, string | null> {
    try {
      const stored = localStorage.getItem('estudiauni_active_mini_ensayo_answers');
      if (stored) return JSON.parse(stored);
    } catch (e) { }
    return {};
  }
}
