import { Injectable, signal, computed, inject } from '@angular/core';
import { PaesContentService } from '../../features/learning-path/services/paes-content.service';
import { FirestoreService } from './firestore.service';
import { Auth } from '@angular/fire/auth';
import { collection, addDoc, query, where, getDocs, orderBy, limit, Timestamp } from '@angular/fire/firestore';

// ─── Interfaces ───

export interface ActivityEntry {
  id: string;
  type: 'leccion' | 'ensayo';
  title: string;
  subject: string;
  subjectIcon: string;
  score?: number;         // porcentaje para lecciones, puntaje para ensayos
  totalCorrect?: number;
  totalQuestions?: number;
  timestamp: string;       // ISO string
}

export interface SubjectMastery {
  subjectId: string;
  subjectName: string;
  subjectIcon: string;
  mastery: number;  // 0-100
  lessonsCompleted: number;
  totalLessons: number;
}

export interface PaesRecord {
  ensayoId: string;
  ensayoTitle: string;
  subject: string;
  correctAnswers: number;
  totalQuestions: number;
  score: number;           // puntaje calculado tipo PAES
  timestamp: string;
}

export interface AIRecommendation {
  icon: string;
  title: string;
  description: string;
  estimatedTime: string;
  difficulty: string;
  routerLink: string;
  type: 'leccion' | 'ensayo' | 'repaso';
}

const STORAGE_KEY_ACTIVITIES = 'estudiauni_activities';
const STORAGE_KEY_STREAK = 'estudiauni_streak';
const STORAGE_KEY_PAES_RECORDS = 'estudiauni_paes_records';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private paesContent = inject(PaesContentService);
  private firestoreService = inject(FirestoreService);
  private auth = inject(Auth);

  // ─── Signals ───
  private _activities = signal<ActivityEntry[]>([]);
  private _streakDays = signal<number>(0);
  private _lastStudyDate = signal<string | null>(null);
  private _paesRecords = signal<PaesRecord[]>([]);

  // ─── Readonly accessors ───
  readonly activities = this._activities.asReadonly();
  readonly streakDays = this._streakDays.asReadonly();
  readonly paesRecords = this._paesRecords.asReadonly();

  // ─── Computed: Best PAES record ───
  readonly bestPaesRecord = computed<PaesRecord | null>(() => {
    const records = this._paesRecords();
    if (records.length === 0) return null;
    return records.reduce((best, r) => r.correctAnswers > best.correctAnswers ? r : best, records[0]);
  });

  // ─── Computed: Subject Mastery (only subjects with at least 1 completed lesson) ───
  readonly subjectMasteries = computed<SubjectMastery[]>(() => {
    const allMaterias = this.paesContent.allMaterias();
    const masteries: SubjectMastery[] = [];

    for (const materia of allMaterias) {
      const progress = this.paesContent.getMateriaProgress(materia.id);
      if (progress.completed > 0) {
        masteries.push({
          subjectId: materia.id,
          subjectName: materia.title,
          subjectIcon: materia.icon,
          mastery: progress.percentage,
          lessonsCompleted: progress.completed,
          totalLessons: progress.total,
        });
      }
    }

    return masteries;
  });

  // ─── Computed: AI Recommendations ───
  readonly recommendations = computed<AIRecommendation[]>(() => {
    const masteries = this.subjectMasteries();
    const activities = this._activities();
    const allMaterias = this.paesContent.allMaterias();
    const recs: AIRecommendation[] = [];

    // 1. Recommend weakest subject (if any mastery exists)
    if (masteries.length > 0) {
      const weakest = masteries.reduce((w, m) => m.mastery < w.mastery ? m : w, masteries[0]);
      if (weakest.mastery < 100) {
        recs.push({
          icon: weakest.subjectIcon,
          title: `Refuerza ${weakest.subjectName}`,
          description: `Tu dominio actual es ${weakest.mastery}%. Completar más lecciones te ayudará a mejorar tu puntaje PAES en esta área.`,
          estimatedTime: '15-20 min',
          difficulty: weakest.mastery < 40 ? 'Fundamental' : 'Media',
          routerLink: '/ruta',
          type: 'leccion'
        });
      }
    }

    // 2. Recommend an untouched subject
    const untouchedMaterias = allMaterias.filter(m => {
      const p = this.paesContent.getMateriaProgress(m.id);
      return m.isActive && p.completed === 0;
    });
    if (untouchedMaterias.length > 0) {
      const m = untouchedMaterias[0];
      recs.push({
        icon: m.icon,
        title: `Comienza ${m.title}`,
        description: `Aún no has explorado esta materia. ¡Empieza hoy y desbloquea tu potencial!`,
        estimatedTime: '10-15 min',
        difficulty: 'Introductorio',
        routerLink: '/ruta',
        type: 'leccion'
      });
    }

    // 3. If user has been doing lessons, recommend an ensayo
    if (activities.filter(a => a.type === 'leccion').length >= 3) {
      const paesRecords = this._paesRecords();
      if (paesRecords.length === 0) {
        recs.push({
          icon: '📝',
          title: 'Realiza tu primer Ensayo PAES',
          description: 'Ya has completado varias lecciones. ¡Es hora de poner a prueba tus conocimientos con un ensayo completo!',
          estimatedTime: '2h 20min',
          difficulty: 'Simulación real',
          routerLink: '/ensayos',
          type: 'ensayo'
        });
      } else {
        recs.push({
          icon: '🏆',
          title: 'Supera tu puntaje récord',
          description: `Tu mejor ensayo tuvo ${this.bestPaesRecord()?.correctAnswers}/${this.bestPaesRecord()?.totalQuestions} correctas. ¡Intenta superarte!`,
          estimatedTime: '2h 20min',
          difficulty: 'Desafío',
          routerLink: '/ensayos',
          type: 'ensayo'
        });
      }
    }

    // 4. Streak encouragement
    const streak = this._streakDays();
    if (streak === 0 && activities.length > 0) {
      recs.push({
        icon: '🔥',
        title: 'Recupera tu racha de estudio',
        description: 'Tu racha se ha reiniciado. ¡Completa una lección hoy para empezar una nueva racha!',
        estimatedTime: '10 min',
        difficulty: 'Rápido',
        routerLink: '/ruta',
        type: 'repaso'
      });
    }

    // 5. Default recommendation if empty
    if (recs.length === 0) {
      recs.push({
        icon: '🚀',
        title: 'Comienza tu preparación PAES',
        description: 'Explora la ruta de aprendizaje y empieza con tu primera lección. ¡Tu viaje académico comienza aquí!',
        estimatedTime: '10-15 min',
        difficulty: 'Introductorio',
        routerLink: '/ruta',
        type: 'leccion'
      });
    }

    return recs;
  });

  constructor() {
    this.loadFromStorage();
    this.recalculateStreak();
    this.syncWithFirebase();
  }

  /** Sincronizar datos iniciales desde Firebase */
  private async syncWithFirebase() {
    const user = this.auth.currentUser;
    if (!user) return;

    try {
      // 1. Cargar actividades recientes desde Firestore
      // Nota: Aquí se asume que las actividades se guardan en la subcolección 'actividad' del usuario
      // o se integran desde la colección global 'intentos'
      const history = await this.firestoreService.getUserActivities(user.uid);
      if (history && history.length > 0) {
        this._activities.set(history as any);
      }

      // 2. Cargar records PAES
      // TODO: Implementar en firestoreService si es necesario
    } catch (error) {
      console.warn('[DashboardService] Error sincronizando con Firebase:', error);
    }
  }

  // ─── Public Methods ───

  /** Log a completed lesson from the learning path */
  logLessonCompleted(data: {
    seccionId: string;
    title: string;
    subject: string;
    subjectIcon: string;
    score: number;
    totalCorrect: number;
    totalQuestions: number;
  }): void {
    const entry: ActivityEntry = {
      id: `lesson-${data.seccionId}-${Date.now()}`,
      type: 'leccion',
      title: data.title,
      subject: data.subject,
      subjectIcon: data.subjectIcon,
      score: data.score,
      totalCorrect: data.totalCorrect,
      totalQuestions: data.totalQuestions,
      timestamp: new Date().toISOString(),
    };

    const current = this._activities();
    this._activities.set([entry, ...current].slice(0, 50)); // Keep last 50
    this.updateStreak();
    this.saveToStorage();

    // Persistir en Firebase
    const user = this.auth.currentUser;
    if (user) {
      this.firestoreService.saveActivity(user.uid, entry).catch(err => 
        console.error('[DashboardService] Error guardando actividad en Firebase:', err)
      );
    }
  }

  /** Log a completed PAES ensayo */
  logEnsayoCompleted(data: {
    ensayoId: string;
    ensayoTitle: string;
    subject: string;
    correctAnswers: number;
    totalQuestions: number;
    score: number;
  }): void {
    // Activity entry
    const entry: ActivityEntry = {
      id: `ensayo-${data.ensayoId}-${Date.now()}`,
      type: 'ensayo',
      title: data.ensayoTitle,
      subject: data.subject,
      subjectIcon: this.getSubjectIcon(data.subject),
      score: data.score,
      totalCorrect: data.correctAnswers,
      totalQuestions: data.totalQuestions,
      timestamp: new Date().toISOString(),
    };

    const currentActivities = this._activities();
    this._activities.set([entry, ...currentActivities].slice(0, 50));

    // PAES record
    const record: PaesRecord = {
      ensayoId: data.ensayoId,
      ensayoTitle: data.ensayoTitle,
      subject: data.subject,
      correctAnswers: data.correctAnswers,
      totalQuestions: data.totalQuestions,
      score: data.score,
      timestamp: new Date().toISOString(),
    };

    const currentRecords = this._paesRecords();
    this._paesRecords.set([record, ...currentRecords].slice(0, 20));

    this.updateStreak();
    this.saveToStorage();

    // Persistir en Firebase
    const user = this.auth.currentUser;
    if (user) {
      this.firestoreService.saveActivity(user.uid, entry).catch(err => 
        console.error('[DashboardService] Error guardando record en Firebase:', err)
      );
    }
  }

  // ─── Streak Logic ───

  private updateStreak(): void {
    const today = this.getDateString(new Date());
    const lastDate = this._lastStudyDate();

    if (lastDate === today) {
      // Already studied today, no change
      return;
    }

    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = this.getDateString(yesterdayDate);
    if (lastDate === yesterday) {
      // Studied yesterday, increment streak
      this._streakDays.update(s => s + 1);
    } else {
      // More than 1 day gap or first time, reset to 1
      this._streakDays.set(1);
    }

    this._lastStudyDate.set(today);
    this.saveToStorage();
  }

  private recalculateStreak(): void {
    const lastDate = this._lastStudyDate();
    if (!lastDate) {
      this._streakDays.set(0);
      return;
    }

    const today = this.getDateString(new Date());
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = this.getDateString(yesterdayDate);

    if (lastDate !== today && lastDate !== yesterday) {
      // More than 1 day without studying, reset
      this._streakDays.set(0);
      this.saveToStorage();
    }
  }

  // ─── Helpers ───

  getRelativeTime(isoString: string): string {
    const now = Date.now();
    const then = new Date(isoString).getTime();
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return new Date(isoString).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
  }

  private getSubjectIcon(subject: string): string {
    const icons: Record<string, string> = {
      'comp-lectora': '📖',
      'mat1': '📐',
      'historia': '🏛️',
      'ciencias': '🧬',
      'matematica1': '📐',
      'lenguaje': '📖',
    };
    return icons[subject] || '📚';
  }

  private getDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // ─── Persistence ───

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(this._activities()));
      localStorage.setItem(STORAGE_KEY_STREAK, JSON.stringify({
        days: this._streakDays(),
        lastDate: this._lastStudyDate()
      }));
      localStorage.setItem(STORAGE_KEY_PAES_RECORDS, JSON.stringify(this._paesRecords()));
    } catch { /* ignore quota errors */ }
  }

  private loadFromStorage(): void {
    try {
      const activitiesRaw = localStorage.getItem(STORAGE_KEY_ACTIVITIES);
      if (activitiesRaw) {
        this._activities.set(JSON.parse(activitiesRaw));
      }

      const streakRaw = localStorage.getItem(STORAGE_KEY_STREAK);
      if (streakRaw) {
        const streak = JSON.parse(streakRaw);
        this._streakDays.set(streak.days || 0);
        this._lastStudyDate.set(streak.lastDate || null);
      }

      const recordsRaw = localStorage.getItem(STORAGE_KEY_PAES_RECORDS);
      if (recordsRaw) {
        this._paesRecords.set(JSON.parse(recordsRaw));
      }
    } catch { /* ignore */ }
  }
}
