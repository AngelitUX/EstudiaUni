import { Injectable, signal, computed, inject, Injector } from '@angular/core';
import { Materia, Capitulo, Seccion, TestPaes, SeccionProgress, TestResult, TestAnswer } from '../models/paes.models';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { DashboardService } from '../../../core/services/dashboard.service';

@Injectable({ providedIn: 'root' })
export class PaesContentService {
  private firestore = inject(Firestore);
  private injector = inject(Injector);

  // Lazy-loaded to avoid circular dependency  
  private _dashboardService: DashboardService | null = null;
  private get dashSvc(): DashboardService {
    if (!this._dashboardService) {
      this._dashboardService = this.injector.get(DashboardService);
    }
    return this._dashboardService;
  }

  // ─── Signals de estado ───
  private _materias = signal<Materia[]>([]);
  private _capitulos = signal<Capitulo[]>([]);
  private _progress = signal<Map<string, SeccionProgress>>(new Map());
  private _lastTestResult = signal<TestResult | null>(null);
  
  // Signal para estado de carga
  loading = signal(true);

  // ─── Computed ───
  readonly materias = computed(() => this._materias().filter(m => m.isActive));
  readonly allMaterias = this._materias.asReadonly();
  readonly lastTestResult = this._lastTestResult.asReadonly();

  constructor() {
    this.loadProgressFromStorage();
    this.loadDataFromFirestore();
  }

  private async loadDataFromFirestore() {
    try {
      // 1. Cargar materias
      const materiasSnap = await getDocs(collection(this.firestore, 'lp_materias'));
      const materias = materiasSnap.docs.map(doc => doc.data() as Materia);
      this._materias.set(materias.sort((a, b) => a.order - b.order));

      // 2. Cargar capítulos y sus secciones
      const capitulosSnap = await getDocs(collection(this.firestore, 'lp_capitulos'));
      const capitulos: Capitulo[] = [];

      // 3. Cargar todos los tests
      const testsSnap = await getDocs(collection(this.firestore, 'lp_tests'));
      const testsMap = new Map<string, TestPaes>();
      testsSnap.docs.forEach(doc => testsMap.set(doc.id, doc.data() as TestPaes));

      for (const capDoc of capitulosSnap.docs) {
        const capData = capDoc.data() as Omit<Capitulo, 'secciones'>;
        
        // Cargar secciones de este capítulo
        const seccionesSnap = await getDocs(collection(this.firestore, `lp_capitulos/${capDoc.id}/secciones`));
        const secciones: Seccion[] = seccionesSnap.docs.map(secDoc => {
          const secData = secDoc.data() as any;
          // Vincular el test
          const test = testsMap.get(secData.testId);
          return {
            ...secData,
            id: secDoc.id,
            capituloId: capDoc.id,
            materiaId: capData.materiaId,
            test
          } as Seccion;
        });

        capitulos.push({
          ...capData,
          id: capDoc.id,
          secciones: secciones.sort((a, b) => a.order - b.order)
        });
      }

      this._capitulos.set(capitulos.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Error cargando datos de la ruta de aprendizaje:', error);
    } finally {
      this.loading.set(false);
    }
  }

  // ─── Queries ───

  getMateriaById(id: string): Materia | undefined {
    return this._materias().find(m => m.id === id);
  }

  getCapitulosByMateria(materiaId: string): Capitulo[] {
    return this._capitulos().filter(c => c.materiaId === materiaId);
  }

  getCapituloById(capituloId: string): Capitulo | undefined {
    return this._capitulos().find(c => c.id === capituloId);
  }

  getSeccionById(seccionId: string): Seccion | undefined {
    for (const cap of this._capitulos()) {
      const sec = cap.secciones.find(s => s.id === seccionId);
      if (sec) return sec;
    }
    return undefined;
  }

  getTestBySeccionId(seccionId: string): TestPaes | undefined {
    const seccion = this.getSeccionById(seccionId);
    return seccion?.test;
  }

  // ─── Progreso ───

  getSeccionProgress(seccionId: string): SeccionProgress | undefined {
    return this._progress().get(seccionId);
  }

  getCapituloProgress(capituloId: string): { completed: number; total: number; percentage: number } {
    const cap = this.getCapituloById(capituloId);
    if (!cap) return { completed: 0, total: 0, percentage: 0 };

    const total = cap.secciones.length;
    let completed = 0;
    for (const sec of cap.secciones) {
      const p = this._progress().get(sec.id);
      if (p && p.completed) completed++;
    }
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }

  getMateriaProgress(materiaId: string): { completed: number; total: number; percentage: number } {
    const caps = this.getCapitulosByMateria(materiaId);
    let totalSec = 0;
    let completedSec = 0;
    for (const cap of caps) {
      for (const sec of cap.secciones) {
        totalSec++;
        const p = this._progress().get(sec.id);
        if (p && p.completed) completedSec++;
      }
    }
    return { completed: completedSec, total: totalSec, percentage: totalSec > 0 ? Math.round((completedSec / totalSec) * 100) : 0 };
  }

  // ─── Submitting test ───

  submitTest(seccionId: string, answers: Map<number, 'A' | 'B' | 'C' | 'D'>): TestResult {
    const test = this.getTestBySeccionId(seccionId);
    if (!test) throw new Error('Test not found');

    const seccion = this.getSeccionById(seccionId);
    const gradedAnswers: TestAnswer[] = test.preguntas.map(p => {
      const selected = answers.get(p.id) || null;
      return {
        preguntaId: p.id,
        selectedOption: selected,
        isCorrect: selected === p.respuesta_correcta
      };
    });

    const totalCorrect = gradedAnswers.filter(a => a.isCorrect).length;
    const score = Math.round((totalCorrect / test.preguntas.length) * 100);

    const result: TestResult = {
      seccionId,
      answers: gradedAnswers,
      score,
      totalCorrect,
      totalQuestions: test.preguntas.length,
      completedAt: new Date().toISOString()
    };

    // Update progress
    const currentProgress = this._progress().get(seccionId);
    const newProgress: SeccionProgress = {
      seccionId,
      capituloId: seccion?.capituloId || '',
      materiaId: seccion?.materiaId || '',
      completed: score >= 60,
      bestScore: Math.max(currentProgress?.bestScore || 0, score),
      totalQuestions: test.preguntas.length,
      correctAnswers: totalCorrect,
      lastAttemptDate: result.completedAt,
      attempts: (currentProgress?.attempts || 0) + 1
    };

    const newMap = new Map(this._progress());
    newMap.set(seccionId, newProgress);
    this._progress.set(newMap);
    this._lastTestResult.set(result);

    this.saveProgressToStorage();

    // Log activity to dashboard
    try {
      const materia = this.getMateriaById(seccion?.materiaId || '');
      this.dashSvc.logLessonCompleted({
        seccionId,
        title: seccion?.title || 'Lección',
        subject: seccion?.materiaId || '',
        subjectIcon: materia?.icon || '📚',
        score,
        totalCorrect,
        totalQuestions: test.preguntas.length,
      });
    } catch { /* ignore */ }

    return result;
  }

  // ─── Persistence (localStorage) ───

  private saveProgressToStorage(): void {
    const obj: Record<string, SeccionProgress> = {};
    this._progress().forEach((v, k) => { obj[k] = v; });
    localStorage.setItem('paes_progress', JSON.stringify(obj));
  }

  private loadProgressFromStorage(): void {
    try {
      const raw = localStorage.getItem('paes_progress');
      if (raw) {
        const obj = JSON.parse(raw) as Record<string, SeccionProgress>;
        const map = new Map<string, SeccionProgress>();
        Object.entries(obj).forEach(([k, v]) => map.set(k, v));
        this._progress.set(map);
      }
    } catch { /* ignore */ }
  }
}
