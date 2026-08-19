import { Injectable, inject } from '@angular/core';
import { PoolPregunta, MateriaId } from '../../features/learning-path/models/paes.models';
import { PaesContentService } from '../../features/learning-path/services/paes-content.service';
import { DashboardService } from './dashboard.service';
import { ToastService } from './toast.service';

export interface MasteryAxis {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  topics: string[];
  description: string;
}

export interface MasterySubjectConfig {
  materiaId: string;
  poolMateriaId: MateriaId;
  title: string;
  icon: string;
  themeColor: string;
  axes: MasteryAxis[];
}

export interface MasteryProgress {
  materiaId: string;
  level: number;
  xp: number;
  completedAxes: string[]; // Axis IDs completed in current daily cycle (with 100% correct)
  bossDefeatedToday: boolean; // whether the boss node was defeated today (with 100% correct)
  lastActiveDate: string; // YYYY-MM-DD for daily reset
  totalQuestionsSolved: number;
  totalCorrect: number;
  dailyQuizzes?: Record<string, PoolPregunta[]>; // Static questions seeded for today (per axis & boss)
  history: {
    axisId: string;
    axisName: string;
    correct: number;
    total: number;
    passed: boolean;
    timestamp: string;
  }[];
}

@Injectable({ providedIn: 'root' })
export class InfiniteMasteryService {
  private paesContent = inject(PaesContentService);
  private dashboardSvc = inject(DashboardService);
  private toast = inject(ToastService);

  private readonly STORAGE_PREFIX = 'INFINITE_MASTERY_PROGRESS_';

  // Configuración de Ejes por Materia (Adaptativo para Polígonos de 3, 4 y 5 vértices)
  private readonly SUBJECT_CONFIGS: Record<string, MasterySubjectConfig> = {
    'mat1': {
      materiaId: 'mat1',
      poolMateriaId: 'matematicas-m1',
      title: 'Matemática M1',
      icon: '📐',
      themeColor: '#855cd6',
      axes: [
        { id: 'numeros', name: 'Números', shortName: 'Números', icon: '🔢', color: '#3b82f6', topics: ['Números', 'Fracciones', 'Porcentajes', 'Potencias', 'Raíces'], description: 'Operaciones reales, proporciones, porcentajes y potencias.' },
        { id: 'algebra', name: 'Álgebra y Funciones', shortName: 'Álgebra', icon: '📈', color: '#8b5cf6', topics: ['Álgebra', 'Ecuaciones', 'Sistemas de Ecuaciones', 'Función Lineal', 'Función Cuadrática'], description: 'Ecuaciones, sistemas, funciones lineales y cuadráticas.' },
        { id: 'geometria', name: 'Geometría', shortName: 'Geometría', icon: '📏', color: '#ec4899', topics: ['Geometría', 'Teorema de Pitágoras', 'Perímetros y Áreas', 'Vectores', 'Transformaciones Isométricas'], description: 'Áreas, perímetros, Pitágoras, vectores y transformaciones.' },
        { id: 'probabilidad', name: 'Probabilidad y Estadística', shortName: 'Probabilidad', icon: '🎲', color: '#f59e0b', topics: ['Probabilidad', 'Estadística', 'Medidas de Tendencia Central', 'Regla de Laplace'], description: 'Tablas, medidas de tendencia central y cálculo de probabilidades.' }
      ]
    },
    'mat2': {
      materiaId: 'mat2',
      poolMateriaId: 'matematicas-m2',
      title: 'Matemática M2',
      icon: '📊',
      themeColor: '#0ea5e9',
      axes: [
        { id: 'numeros_avanzados', name: 'Números Avanzados', shortName: 'Números M2', icon: '🔢', color: '#0284c7', topics: ['Logaritmos', 'Matemática Financiera', 'Complejos', 'Reales'], description: 'Logaritmos, matemática financiera e interés compuesto.' },
        { id: 'algebra_avanzada', name: 'Álgebra y Modelos', shortName: 'Álgebra M2', icon: '📈', color: '#6366f1', topics: ['Inecuaciones', 'Función Exponencial', 'Función Logarítmica', 'Sistemas 3x3'], description: 'Inecuaciones, funciones exponenciales y modelamiento.' },
        { id: 'geometria_analitica', name: 'Geometría y Trigonometría', shortName: 'Geometría M2', icon: '📐', color: '#d946ef', topics: ['Trigonometría', 'Geometría 3D', 'Homotecia', 'Esferas'], description: 'Razones trigonométricas, cuerpos redondos y homotecia.' },
        { id: 'probabilidad_inferencial', name: 'Probabilidad y Distribuciones', shortName: 'Probabilidad M2', icon: '🎲', color: '#f59e0b', topics: ['Distribución Normal', 'Probabilidad Condicional', 'Combinatoria', 'Permutaciones'], description: 'Probabilidad condicional, combinatoria y distribución normal.' }
      ]
    },
    'comp-lectora': {
      materiaId: 'comp-lectora',
      poolMateriaId: 'competencia-lectora',
      title: 'Competencia Lectora',
      icon: '📖',
      themeColor: '#2563eb',
      axes: [
        { id: 'localizar', name: 'Rastrear y Localizar', shortName: 'Localizar', icon: '🔍', color: '#3b82f6', topics: ['Localizar', 'Información Explícita', 'Rastrear'], description: 'Identificación de datos explícitos, detalles y secuencias textuales.' },
        { id: 'interpretar', name: 'Relacionar e Interpretar', shortName: 'Interpretar', icon: '🧠', color: '#a855f7', topics: ['Interpretar', 'Inferencia', 'Idea Principal', 'Relación de Párrafos', 'Síntesis'], description: 'Inferencias, relaciones causales, propósito comunicativo y síntesis.' },
        { id: 'evaluar', name: 'Evaluar y Reflexionar', shortName: 'Evaluar', icon: '⚖️', color: '#10b981', topics: ['Evaluar', 'Tono del Emisor', 'Actitud', 'Juicio Crítico', 'Coherencia'], description: 'Valoración crítica de la forma, postura del emisor y credibilidad.' }
      ]
    },
    'historia': {
      materiaId: 'historia',
      poolMateriaId: 'historia',
      title: 'Historia y Ciencias Sociales',
      icon: '🏛️',
      themeColor: '#c2410c',
      axes: [
        { id: 'historia_mundo', name: 'Historia Mundial y América', shortName: 'Mundo y América', icon: '🌍', color: '#ea580c', topics: ['Mundo', 'América', 'Guerra Fría', 'Siglo XX', 'Totalitarismos', 'Imperialismo'], description: 'Procesos globales contemporáneos, guerras mundiales y Guerra Fría.' },
        { id: 'historia_chile', name: 'Historia de Chile Republicano', shortName: 'Chile Republicano', icon: '🇨🇱', color: '#dc2626', topics: ['Chile', 'República', 'Independencia', 'Siglo XIX', 'Democracia en Chile', 'Dictadura'], description: 'Construcción republicana, transformaciones sociales y políticas en Chile.' },
        { id: 'formacion_ciudadana', name: 'Formación Ciudadana y Democracia', shortName: 'Ciudadanía', icon: '⚖️', color: '#7c3aed', topics: ['Ciudadanía', 'Democracia', 'Constitución', 'Derechos Humanos', 'Institucionalidad'], description: 'Sistema democrático, derechos fundamentales e instituciones del Estado.' },
        { id: 'economia_sociedad', name: 'Economía y Sociedad', shortName: 'Economía', icon: '📈', color: '#059669', topics: ['Economía', 'Mercado', 'Inflación', 'Comercio', 'Problema Económico'], description: 'Agentes económicos, funcionamiento de mercados y desarrollo sustentable.' },
        { id: 'geografia', name: 'Territorio y Geografía', shortName: 'Geografía', icon: '🗺️', color: '#0891b2', topics: ['Geografía', 'Territorio', 'Población', 'Medio Ambiente', 'Riesgos Naturales', 'Urbanización'], description: 'Dinámicas territoriales, riesgos socio-naturales y sustentabilidad ambiental.' }
      ]
    },
    'fisica': {
      materiaId: 'fisica',
      poolMateriaId: 'ciencias-fisica',
      title: 'Ciencias - Física',
      icon: '⚛️',
      themeColor: '#1e3a8a',
      axes: [
        { id: 'ondas', name: 'Ondas y Luz', shortName: 'Ondas', icon: '🌊', color: '#3b82f6', topics: ['Ondas', 'Sonido', 'Luz', 'Óptica', 'Espectro Electromagnético'], description: 'Propiedades ondulatorias, reflexión, refracción, sonido y óptica.' },
        { id: 'mecanica', name: 'Mecánica y Dinámica', shortName: 'Mecánica', icon: '🚗', color: '#f59e0b', topics: ['Cinemática', 'Dinámica', 'Leyes de Newton', 'Fuerzas', 'Energía Mecánica'], description: 'MRU, MRUA, fuerzas, leyes de Newton y conservación de la energía.' },
        { id: 'energia_calor', name: 'Energía y Calor', shortName: 'Energía y Calor', icon: '🔥', color: '#ef4444', topics: ['Calor', 'Temperatura', 'Termodinámica', 'Calorimetría', 'Escalas Térmicas'], description: 'Transferencia de calor, dilatación, calor específico y termometría.' },
        { id: 'electricidad', name: 'Electricidad y Magnetismo', shortName: 'Electricidad', icon: '⚡', color: '#8b5cf6', topics: ['Electricidad', 'Circuitos', 'Ley de Ohm', 'Potencia Eléctrica', 'Magnetismo'], description: 'Carga eléctrica, circuitos en serie/paralelo y ley de Ohm.' }
      ]
    },
    'quimica': {
      materiaId: 'quimica',
      poolMateriaId: 'ciencias-quimica',
      title: 'Ciencias - Química',
      icon: '🧪',
      themeColor: '#0d9488',
      axes: [
        { id: 'estructura_atomica', name: 'Estructura Atómica y Enlace', shortName: 'Átomo y Enlace', icon: '⚛️', color: '#0d9488', topics: ['Átomo', 'Tabla Periódica', 'Enlace Químico', 'Configuración Electrónica'], description: 'Modelos atómicos, enlaces iónico/covalente y periodicidad.' },
        { id: 'reacciones_estequiometria', name: 'Reacciones y Estequiometría', shortName: 'Estequiometría', icon: '⚖️', color: '#3b82f6', topics: ['Estequiometría', 'Mol', 'Reacciones Químicas', 'Leyes Ponderales', 'Balance'], description: 'Cálculo de moles, reactivo limitante y conservación de la masa.' },
        { id: 'soluciones', name: 'Soluciones y Concentración', shortName: 'Soluciones', icon: '💧', color: '#0284c7', topics: ['Soluciones', 'Concentración', 'Molaridad', 'Solubilidad', 'Dilución'], description: 'Unidades de concentración (% m/m, % m/v, molaridad) y solubilidad.' },
        { id: 'quimica_organica', name: 'Química Orgánica', shortName: 'Orgánica', icon: '🌿', color: '#10b981', topics: ['Orgánica', 'Hidrocarburos', 'Grupos Funcionales', 'Nomenclatura Orgánica'], description: 'Carbono, alcanos, alquenos, alquinos y grupos funcionales oxigenados.' }
      ]
    },
    'biologia': {
      materiaId: 'biologia',
      poolMateriaId: 'ciencias-biologia',
      title: 'Ciencias - Biología',
      icon: '🧬',
      themeColor: '#047857',
      axes: [
        { id: 'organizacion_celular', name: 'Organización Celular y Membrana', shortName: 'Célula', icon: '🔬', color: '#059669', topics: ['Célula', 'Membrana', 'Transporte Celular', 'Organelos', 'Biomoléculas'], description: 'Célula procarionte/eucarionte, organelos y transporte de membrana.' },
        { id: 'herencia_evolucion', name: 'Herencia y Evolución', shortName: 'Genética', icon: '🧬', color: '#10b981', topics: ['Genética', 'ADN', 'Mitosis', 'Meiosis', 'Evolución', 'Leyes de Mendel'], description: 'Ciclo celular, división meiótica, herencia mendeliana y selección natural.' },
        { id: 'organismo_ambiente', name: 'Organismo y Medio Ambiente', shortName: 'Ecología', icon: '🌱', color: '#84cc16', topics: ['Ecología', 'Cadenas Tróficas', 'Poblaciones', 'Fotosíntesis', 'Ecosistemas'], description: 'Flujo de energía, tramas tróficas, dinámica de poblaciones e impacto humano.' },
        { id: 'fisiologia_salud', name: 'Fisiología, Endocrino y Salud', shortName: 'Fisiología', icon: '❤️', color: '#e11d48', topics: ['Fisiología', 'Hormonas', 'Sistema Nervioso', 'Inmunidad', 'Sexualidad'], description: 'Homeostasis, sistema endocrino, control nervioso y respuesta inmune.' }
      ]
    }
  };

  /**
   * Obtiene la configuración de la materia
   */
  getSubjectConfig(materiaId: string): MasterySubjectConfig {
    const norm = this.normalizeMateriaId(materiaId);
    return this.SUBJECT_CONFIGS[norm] || this.SUBJECT_CONFIGS['mat1'];
  }

  /**
   * Normaliza el ID de materia
   */
  private normalizeMateriaId(materiaId: string): string {
    const m = (materiaId || '').toLowerCase();
    if (m.includes('mat1') || m === 'matematicas-m1' || m === 'm1') return 'mat1';
    if (m.includes('mat2') || m === 'matematicas-m2' || m === 'm2') return 'mat2';
    if (m.includes('lect') || m.includes('leng') || m.includes('comp')) return 'comp-lectora';
    if (m.includes('hist')) return 'historia';
    if (m.includes('fisic')) return 'fisica';
    if (m.includes('quim')) return 'quimica';
    if (m.includes('bio')) return 'biologia';
    return m;
  }

  /**
   * Devuelve la fecha actual en formato local YYYY-MM-DD
   */
  private getTodayDateString(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Calcula los segundos restantes hasta la medianoche (reseteo del ciclo diario)
   */
  getSecondsUntilMidnight(): number {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    return Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000));
  }

  /**
   * Progreso por defecto
   */
  private getDefaultProgress(materiaId: string): MasteryProgress {
    return {
      materiaId,
      level: 1,
      xp: 0,
      completedAxes: [],
      bossDefeatedToday: false,
      lastActiveDate: this.getTodayDateString(),
      totalQuestionsSolved: 0,
      totalCorrect: 0,
      dailyQuizzes: {},
      history: []
    };
  }

  /**
   * Carga el progreso actual con control estricto de reset diario
   */
  getProgress(materiaId: string): MasteryProgress {
    const norm = this.normalizeMateriaId(materiaId);
    const key = `${this.STORAGE_PREFIX}${norm}`;
    const today = this.getTodayDateString();
    const raw = localStorage.getItem(key);
    let progress: MasteryProgress;

    if (raw) {
      try {
        progress = JSON.parse(raw);
        if (!progress.lastActiveDate) progress.lastActiveDate = today;
        if (progress.bossDefeatedToday === undefined) progress.bossDefeatedToday = false;
        if (!progress.dailyQuizzes) progress.dailyQuizzes = {};
      } catch {
        progress = this.getDefaultProgress(norm);
      }
    } else {
      progress = this.getDefaultProgress(norm);
    }

    // Comprobación de Reseteo Diario: Si cambió el día, reiniciar ciclo
    if (progress.lastActiveDate !== today) {
      progress.lastActiveDate = today;
      progress.completedAxes = []; // Reiniciar ejes completados para el nuevo día
      progress.bossDefeatedToday = false; // Habilitar el reto del jefe para el nuevo día
      progress.dailyQuizzes = {}; // Forzar nueva generación estática para el nuevo día
      this.saveProgress(progress);
    }

    return progress;
  }

  /**
   * Guarda el progreso
   */
  saveProgress(progress: MasteryProgress): void {
    const key = `${this.STORAGE_PREFIX}${progress.materiaId}`;
    localStorage.setItem(key, JSON.stringify(progress));
  }

  /**
   * Recopila TODAS las preguntas disponibles para la materia:
   * 1. Del pool general (pool_preguntas de Firestore / Local).
   * 2. De todos los capítulos y secciones de la ruta de aprendizaje correspondiente.
   */
  getAllAvailableQuestionsForMateria(materiaId: string): PoolPregunta[] {
    const cfg = this.getSubjectConfig(materiaId);
    const normalizedPoolMateria = cfg.poolMateriaId;
    const questions: PoolPregunta[] = [];
    const seenIds = new Set<string>();

    // 1. Agregar del pool_preguntas
    const allPool = this.paesContent.poolPreguntas() || [];
    for (const q of allPool) {
      if (q.materiaId === normalizedPoolMateria || q.materiaId === cfg.materiaId) {
        if (!seenIds.has(q.id)) {
          seenIds.add(q.id);
          questions.push(q);
        }
      }
    }

    // 2. Agregar de todas las secciones/capítulos de la ruta de aprendizaje
    const chapters = this.paesContent.getCapitulosByMateria(cfg.materiaId) || [];
    for (const cap of chapters) {
      for (const sec of cap.secciones || []) {
        if (sec.test?.preguntas && Array.isArray(sec.test.preguntas)) {
          for (let idx = 0; idx < sec.test.preguntas.length; idx++) {
            const p = sec.test.preguntas[idx];
            const qId = String(p.id || `sec-${sec.id}-${idx}`);
            if (!seenIds.has(qId) && p.enunciado && p.alternativas) {
              seenIds.add(qId);
              questions.push({
                id: qId,
                materiaId: normalizedPoolMateria,
                tema: cap.title || sec.title || 'General',
                preambulo_texto: p.preambulo_texto || null,
                preambulo_imagen_url: p.preambulo_imagen_url || (p as any).imageUrl || null,
                enunciado: p.enunciado,
                formula_latex: p.formula_latex || null,
                tipo_alternativas: p.tipo_alternativas || 'texto',
                alternativas: p.alternativas,
                respuesta_correcta: p.respuesta_correcta,
                feedback_acierto: p.feedback_acierto || (p as any).explicacion || (p as any).resolucion || '¡Excelente razonamiento! Has aplicado correctamente los conceptos clave.',
                feedback_error: p.feedback_error || (p as any).explicacion || (p as any).resolucion || 'Revisa el desarrollo del ejercicio y los conceptos teóricos asociados.',
                createdAt: '',
                updatedAt: '',
                createdBy: 'system'
              });
            }
          }
        }
      }
    }

    return questions;
  }

  /**
   * Obtiene las preguntas ESTÁTICAS del día para un Eje Temático.
   * Si es la primera vez que se consultan hoy, se generan aleatoriamente y se guardan estáticas.
   */
  getDailyAxisQuiz(materiaId: string, axisId: string, count: number = 5): PoolPregunta[] {
    const progress = this.getProgress(materiaId);
    if (!progress.dailyQuizzes) progress.dailyQuizzes = {};

    // Si ya fueron generadas hoy para este eje, devolverlas estáticas
    if (progress.dailyQuizzes[axisId] && progress.dailyQuizzes[axisId].length > 0) {
      return progress.dailyQuizzes[axisId];
    }

    const cfg = this.getSubjectConfig(materiaId);
    const axis = cfg.axes.find(a => a.id === axisId);
    if (!axis) return [];

    const allQuestions = this.getAllAvailableQuestionsForMateria(materiaId);

    // Filtrar preguntas que coincidan con los temas del eje
    const matched = allQuestions.filter(q => {
      const topicText = `${q.tema || ''} ${q.enunciado || ''}`.toLowerCase();
      return axis.topics.some(t => topicText.includes(t.toLowerCase()));
    });

    let pool = matched.length >= count ? matched : allQuestions;
    if (pool.length === 0) pool = this.paesContent.poolPreguntas();

    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));

    // Guardar estático en el progreso de hoy
    progress.dailyQuizzes[axisId] = selected;
    this.saveProgress(progress);

    return selected;
  }

  /**
   * Obtiene las preguntas ESTÁTICAS del día para el NODO JEFE (Núcleo Maestro).
   * Combina proporcionalmente preguntas de todos los ejes.
   */
  getDailyBossQuiz(materiaId: string, count: number = 8): PoolPregunta[] {
    const progress = this.getProgress(materiaId);
    if (!progress.dailyQuizzes) progress.dailyQuizzes = {};

    if (progress.dailyQuizzes['boss'] && progress.dailyQuizzes['boss'].length > 0) {
      return progress.dailyQuizzes['boss'];
    }

    const cfg = this.getSubjectConfig(materiaId);
    const allQuestions = this.getAllAvailableQuestionsForMateria(materiaId);
    const bossQuestions: PoolPregunta[] = [];
    const questionsPerAxis = Math.max(1, Math.floor(count / cfg.axes.length));

    for (const axis of cfg.axes) {
      const axisPool = allQuestions.filter(q => {
        const topicText = `${q.tema || ''} ${q.enunciado || ''}`.toLowerCase();
        return axis.topics.some(t => topicText.includes(t.toLowerCase()));
      });

      const poolToUse = axisPool.length > 0 ? axisPool : allQuestions;
      const shuffled = [...poolToUse].sort(() => Math.random() - 0.5);
      const chosen = shuffled.slice(0, questionsPerAxis);
      bossQuestions.push(...chosen);
    }

    // Completar si faltan
    if (bossQuestions.length < count) {
      const remaining = allQuestions.filter(q => !bossQuestions.some(b => b.id === q.id)).sort(() => Math.random() - 0.5);
      bossQuestions.push(...remaining.slice(0, count - bossQuestions.length));
    }

    const finalBossList = bossQuestions.slice(0, count);
    progress.dailyQuizzes['boss'] = finalBossList;
    this.saveProgress(progress);

    return finalBossList;
  }

  /**
   * Registra la finalización de un eje temático con REGLA ESTRICTA DE 100% DE ACIERTOS.
   * Solo se considera superado si correctCount === totalCount.
   */
  recordAxisCompletion(
    materiaId: string,
    axisId: string,
    correctCount: number,
    totalCount: number
  ): { progress: MasteryProgress; passed: boolean; leveledUp: boolean; newLevel: number } {
    const progress = this.getProgress(materiaId);
    const cfg = this.getSubjectConfig(materiaId);
    const axis = cfg.axes.find(a => a.id === axisId);
    const passed = (correctCount === totalCount) && totalCount > 0;

    progress.totalQuestionsSolved += totalCount;
    progress.totalCorrect += correctCount;

    // Solo se marca como completado si tuvo 100% de aciertos
    if (passed && !progress.completedAxes.includes(axisId)) {
      progress.completedAxes.push(axisId);
    }

    progress.history.unshift({
      axisId,
      axisName: axis?.name || axisId,
      correct: correctCount,
      total: totalCount,
      passed,
      timestamp: new Date().toISOString()
    });

    const allAxesCompleted = cfg.axes.every(a => progress.completedAxes.includes(a.id));
    if (allAxesCompleted && !progress.bossDefeatedToday) {
      this.toast.success(`⚡ ¡Todos los ejes dominados al 100%! El Núcleo Maestro ha sido desbloqueado.`);
    }

    this.saveProgress(progress);

    try {
      this.dashboardSvc.logLessonCompleted({
        seccionId: `infinite-${axis?.id || 'axis'}`,
        title: `Modo Infinito (${cfg.title}) - ${axis?.name || 'Eje'}`,
        subject: cfg.title,
        subjectIcon: cfg.icon,
        score: Math.round((correctCount / (totalCount || 1)) * 100),
        totalCorrect: correctCount,
        totalQuestions: totalCount
      });
    } catch {
      // ignore
    }

    return { progress, passed, leveledUp: false, newLevel: progress.level };
  }

  /**
   * Registra el intento sobre el NODO JEFE (Núcleo Maestro) con REGLA ESTRICTA DE 100% DE ACIERTOS.
   * Solo sube de nivel (+1 Lv.) si se responden todas bien (8/8).
   */
  recordBossCompletion(
    materiaId: string,
    correctCount: number,
    totalCount: number
  ): { progress: MasteryProgress; passed: boolean; leveledUp: boolean; newLevel: number } {
    const progress = this.getProgress(materiaId);
    const cfg = this.getSubjectConfig(materiaId);
    const passed = (correctCount === totalCount) && totalCount > 0;

    progress.totalQuestionsSolved += totalCount;
    progress.totalCorrect += correctCount;

    if (passed) {
      progress.bossDefeatedToday = true;
      progress.level += 1; // Solo sube de nivel si se vence al 100%
      this.toast.success(`👑 ¡HAS DERROTADO AL NÚCLEO MAESTRO! Nivel aumentado a Lv. ${progress.level}`);
    }

    progress.history.unshift({
      axisId: 'boss-core',
      axisName: '👑 Núcleo de Maestría Total (Jefe)',
      correct: correctCount,
      total: totalCount,
      passed,
      timestamp: new Date().toISOString()
    });

    this.saveProgress(progress);

    try {
      this.dashboardSvc.logLessonCompleted({
        seccionId: `infinite-boss-${progress.materiaId}`,
        title: `👑 JEFE MODO INFINITO (${cfg.title})`,
        subject: cfg.title,
        subjectIcon: cfg.icon,
        score: Math.round((correctCount / (totalCount || 1)) * 100),
        totalCorrect: correctCount,
        totalQuestions: totalCount
      });
    } catch {
      // ignore
    }

    return { progress, passed, leveledUp: passed, newLevel: progress.level };
  }
}
