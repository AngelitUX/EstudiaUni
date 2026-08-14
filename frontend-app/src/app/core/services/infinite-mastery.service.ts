import { Injectable, inject, signal } from '@angular/core';
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
  completedAxes: string[]; // Axis IDs completed in current level cycle
  totalQuestionsSolved: number;
  totalCorrect: number;
  history: {
    axisId: string;
    axisName: string;
    correct: number;
    total: number;
    timestamp: string;
  }[];
}

@Injectable({ providedIn: 'root' })
export class InfiniteMasteryService {
  private paesContent = inject(PaesContentService);
  private dashboardSvc = inject(DashboardService);
  private toast = inject(ToastService);

  private readonly STORAGE_PREFIX = 'INFINITE_MASTERY_PROGRESS_';

  // Configuración de Ejes por Materia
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
      icon: '✏️',
      themeColor: '#4f46e5',
      axes: [
        { id: 'm2-numeros', name: 'Números Reales y Complejos', shortName: 'Reales/Complejos', icon: '♾️', color: '#3b82f6', topics: ['Logaritmos', 'Números', 'Matemática Financiera'], description: 'Logaritmos, números complejos y matemática financiera.' },
        { id: 'm2-algebra', name: 'Álgebra Avanzada', shortName: 'Álgebra M2', icon: '📊', color: '#8b5cf6', topics: ['Desigualdades', 'Inecuaciones', 'Función Exponencial', 'Función Inversa'], description: 'Sistemas de inecuaciones, función potencia y exponencial.' },
        { id: 'm2-geometria', name: 'Geometría Analítica', shortName: 'Geometría M2', icon: '📐', color: '#ec4899', topics: ['Geometría 3D', 'Homotecia', 'Trigonometría'], description: 'Trigonometría, homotecia y cuerpos geométricos en 3D.' },
        { id: 'm2-probabilidad', name: 'Probabilidad Condicional', shortName: 'Probabilidad M2', icon: '🎲', color: '#f59e0b', topics: ['Combinatoria', 'Probabilidad Condicional', 'Variables Aleatorias'], description: 'Permutaciones, combinatoria y distribución de probabilidad.' }
      ]
    },
    'comp-lectora': {
      materiaId: 'comp-lectora',
      poolMateriaId: 'competencia-lectora',
      title: 'Competencia Lectora',
      icon: '📖',
      themeColor: '#2563eb',
      axes: [
        { id: 'localizar', name: 'Rastrear y Localizar', shortName: 'Localizar', icon: '🔍', color: '#3b82f6', topics: ['Localizar', 'Información Explícita', 'Comprensión Lectora'], description: 'Identificación de datos, hechos y detalles explícitos en el texto.' },
        { id: 'interpretar', name: 'Relacionar e Interpretar', shortName: 'Interpretar', icon: '🧠', color: '#8b5cf6', topics: ['Interpretar', 'Inferencia', 'Idea Principal', 'Propósito Comunicativo'], description: 'Inferencias, relaciones párrafo-párrafo y síntesis global.' },
        { id: 'evaluar', name: 'Reflexionar y Evaluar', shortName: 'Evaluar', icon: '⚖️', color: '#10b981', topics: ['Evaluar', 'Tono del Emisor', 'Juicio Crítico', 'Postura'], description: 'Evaluación del tono, intención, confiabilidad y sesgo.' }
      ]
    },
    'historia': {
      materiaId: 'historia',
      poolMateriaId: 'historia',
      title: 'Historia y Cs. Sociales',
      icon: '🏛️',
      themeColor: '#c2410c',
      axes: [
        { id: 'hist-chile', name: 'Historia de Chile', shortName: 'Chile', icon: '🇨🇱', color: '#ef4444', topics: ['Historia de Chile', 'Siglo XIX', 'Siglo XX', 'Dictadura y Democracia'], description: 'Procesos políticos, sociales y culturales republicanos.' },
        { id: 'ciudadania', name: 'Formación Ciudadana', shortName: 'Ciudadanía', icon: '🏛️', color: '#3b82f6', topics: ['Formación Ciudadana', 'Constitución', 'Derechos Humanos', 'Democracia'], description: 'Institucionalidad democrática, ciudadanía y DDHH.' },
        { id: 'mundo', name: 'Mundo y América', shortName: 'Mundo', icon: '🌍', color: '#8b5cf6', topics: ['Guerra Fría', 'Imperialismo', 'Totalitarismos', 'Globalización'], description: 'Guerras mundiales, Guerra Fría y transformaciones globales.' },
        { id: 'economia', name: 'Economía y Sociedad', shortName: 'Economía', icon: '📈', color: '#f59e0b', topics: ['Economía', 'Mercado', 'Inflación', 'Problema Económico'], description: 'Agentes económicos, mercado, dinero y sustentabilidad.' }
      ]
    },
    'fisica': {
      materiaId: 'fisica',
      poolMateriaId: 'ciencias-fisica',
      title: 'Física',
      icon: '🌌',
      themeColor: '#1e3a8a',
      axes: [
        { id: 'ondas', name: 'Ondas y Sonido', shortName: 'Ondas', icon: '🌊', color: '#06b6d4', topics: ['Ondas', 'Sonido', 'Luz', 'Espectro Electromagnético'], description: 'Propiedades ondulatorias, fenómenos del sonido y la luz.' },
        { id: 'mecanica', name: 'Mecánica y Movimiento', shortName: 'Mecánica', icon: '🚀', color: '#3b82f6', topics: ['Cinemática', 'Fuerzas', 'Leyes de Newton', 'Momentum'], description: 'MRU, MRUA, fuerzas de Newton y conservación del momento.' },
        { id: 'energia', name: 'Energía y Calor', shortName: 'Energía', icon: '🔥', color: '#f97316', topics: ['Energía Mecánica', 'Calor y Temperatura', 'Termodinámica'], description: 'Conservación de la energía mecánica, calor y temperatura.' },
        { id: 'electricidad', name: 'Electricidad y Magnetismo', shortName: 'Electricidad', icon: '⚡', color: '#eab308', topics: ['Circuitos Eléctricos', 'Ley de Ohm', 'Potencia'], description: 'Carga eléctrica, circuitos serie/paralelo y Ley de Ohm.' }
      ]
    },
    'quimica': {
      materiaId: 'quimica',
      poolMateriaId: 'ciencias-quimica',
      title: 'Química',
      icon: '🧪',
      themeColor: '#0d9488',
      axes: [
        { id: 'atomica', name: 'Estructura Atómica', shortName: 'Atómica', icon: '⚛️', color: '#8b5cf6', topics: ['Estructura Atómica', 'Tabla Periódica', 'Enlace Químico'], description: 'Modelos atómicos, configuración electrónica y enlaces.' },
        { id: 'organica', name: 'Química Orgánica', shortName: 'Orgánica', icon: '🌿', color: '#10b981', topics: ['Química Orgánica', 'Grupos Funcionales', 'Hidrocarburos'], description: 'Cadenas de carbono, grupos funcionales y nomenclatura.' },
        { id: 'reacciones', name: 'Reacciones y Estequiometría', shortName: 'Estequiometría', icon: '💥', color: '#f43f5e', topics: ['Estequiometría', 'Leyes Ponderales', 'Mol'], description: 'Balance de ecuaciones, masa molar y reactivo limitante.' },
        { id: 'soluciones', name: 'Soluciones y Concentración', shortName: 'Soluciones', icon: '💧', color: '#06b6d4', topics: ['Soluciones Químicas', 'Concentración', 'Ácidos y Bases'], description: 'Molaridad, unidades porcentuales y escala de pH.' }
      ]
    },
    'biologia': {
      materiaId: 'biologia',
      poolMateriaId: 'ciencias-biologia',
      title: 'Biología',
      icon: '🧬',
      themeColor: '#047857',
      axes: [
        { id: 'celula', name: 'Organización Celular', shortName: 'Célula', icon: '🔬', color: '#10b981', topics: ['Célula', 'Fotosíntesis', 'Respiración Celular', 'Membrana'], description: 'Estructura celular, transporte de membrana y bioenergética.' },
        { id: 'genetica', name: 'Herencia y Reproducción', shortName: 'Genética', icon: '🧬', color: '#8b5cf6', topics: ['Genética', 'ADN', 'Mitosis y Meiosis', 'Evolución'], description: 'Ciclo celular, leyes de Mendel y material genético.' },
        { id: 'fisiologia', name: 'Organismo y Salud', shortName: 'Fisiología', icon: '🫀', color: '#f43f5e', topics: ['Sistema Nervioso', 'Sistema Endocrino', 'Inmunidad', 'Sexualidad'], description: 'Regulación hormonal, sistema inmune y neurobiología.' },
        { id: 'ecologia', name: 'Organismo y Ambiente', shortName: 'Ecología', icon: '🌱', color: '#eab308', topics: ['Ecología', 'Cadenas Tróficas', 'Fotosíntesis', 'Impacto Humano'], description: 'Flujo de energía, tramas tróficas y conservación.' }
      ]
    }
  };

  /**
   * Obtiene la configuración de la materia normalizando su ID/slug
   */
  getSubjectConfig(materiaId: string): MasterySubjectConfig {
    const norm = this.normalizeMateriaId(materiaId);
    return this.SUBJECT_CONFIGS[norm] || this.SUBJECT_CONFIGS['mat1'];
  }

  private normalizeMateriaId(raw: string): string {
    const lower = (raw || '').toLowerCase();
    if (lower.includes('comp') || lower.includes('lect') || lower.includes('leng')) return 'comp-lectora';
    if (lower.includes('mat1') || lower.includes('matematica-1') || lower.includes('matematicas-m1')) return 'mat1';
    if (lower.includes('mat2') || lower.includes('matematica-2') || lower.includes('matematicas-m2')) return 'mat2';
    if (lower.includes('hist')) return 'historia';
    if (lower.includes('fisic')) return 'fisica';
    if (lower.includes('quim')) return 'quimica';
    if (lower.includes('bio')) return 'biologia';
    return lower;
  }

  /**
   * Carga el progreso actual de maestría infinita del usuario
   */
  getProgress(materiaId: string): MasteryProgress {
    const norm = this.normalizeMateriaId(materiaId);
    const key = `${this.STORAGE_PREFIX}${norm}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
    return {
      materiaId: norm,
      level: 1,
      xp: 0,
      completedAxes: [],
      totalQuestionsSolved: 0,
      totalCorrect: 0,
      history: []
    };
  }

  /**
   * Guarda el progreso
   */
  saveProgress(progress: MasteryProgress): void {
    const key = `${this.STORAGE_PREFIX}${progress.materiaId}`;
    localStorage.setItem(key, JSON.stringify(progress));
  }

  /**
   * Genera un quiz de preguntas aleatorias para un eje temático específico
   */
  generateAxisQuiz(materiaId: string, axisId: string, count: number = 5): PoolPregunta[] {
    const cfg = this.getSubjectConfig(materiaId);
    const axis = cfg.axes.find(a => a.id === axisId);
    if (!axis) return [];

    const allPool = this.paesContent.poolPreguntas();
    const normalizedPoolMateria = cfg.poolMateriaId;

    // Filtrar preguntas que coincidan con la materia o con los temas del eje
    const matched = allPool.filter(q => {
      const matchMateria = q.materiaId === normalizedPoolMateria || q.materiaId === cfg.materiaId;
      const matchTopic = axis.topics.some(t =>
        (q.tema || '').toLowerCase().includes(t.toLowerCase()) ||
        (q.enunciado || '').toLowerCase().includes(t.toLowerCase())
      );
      return matchMateria && (matchTopic || axis.topics.length === 0);
    });

    // Si no hay suficientes por tema exacto, usar las de la materia completa
    let pool = matched.length >= count ? matched : allPool.filter(q => q.materiaId === normalizedPoolMateria);
    if (pool.length === 0) pool = allPool; // Fallback total

    // Barajar aleatoriamente
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  /**
   * Registra la finalización de un eje temático y evalúa si sube de nivel
   */
  recordAxisCompletion(
    materiaId: string,
    axisId: string,
    correctCount: number,
    totalCount: number
  ): { progress: MasteryProgress; leveledUp: boolean; newLevel: number; xpEarned: number } {
    const progress = this.getProgress(materiaId);
    const cfg = this.getSubjectConfig(materiaId);
    const axis = cfg.axes.find(a => a.id === axisId);

    const xpEarned = correctCount * 25 + 50; // 25 XP por acierto + 50 XP bono por completar eje
    progress.xp += xpEarned;
    progress.totalQuestionsSolved += totalCount;
    progress.totalCorrect += correctCount;

    // Agregar eje a la lista de completados del nivel actual
    if (!progress.completedAxes.includes(axisId)) {
      progress.completedAxes.push(axisId);
    }

    progress.history.unshift({
      axisId,
      axisName: axis?.name || axisId,
      correct: correctCount,
      total: totalCount,
      timestamp: new Date().toISOString()
    });

    let leveledUp = false;
    let newLevel = progress.level;

    // Verificar si se completaron TODOS los ejes del polígono
    const allAxesCompleted = cfg.axes.every(a => progress.completedAxes.includes(a.id));
    if (allAxesCompleted) {
      progress.level += 1;
      newLevel = progress.level;
      leveledUp = true;
      progress.completedAxes = []; // Reiniciar el ciclo para el nuevo nivel de maestría
      this.toast.success(`🎉 ¡Felicidades! Has completado el Polígono y alcanzado el Nivel de Maestría ${newLevel}`);
    }

    this.saveProgress(progress);

    // Otorgar actividad y racha al dashboard
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
      // ignore dashboard log error
    }

    return { progress, leveledUp, newLevel, xpEarned };
  }
}
