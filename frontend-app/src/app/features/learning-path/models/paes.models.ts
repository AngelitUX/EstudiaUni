// ─── Modelos del sistema de aprendizaje estilo Duolingo ───

export interface Materia {
  id: string;
  title: string;
  slug: string;
  icon: string;
  order: number;
  isActive: boolean;
  imageUrl?: string;
}

export interface Capitulo {
  id: string;
  materiaId: string;
  title: string;
  introduccion: string;
  order: number;
  pdfUrl?: string;
  secciones: Seccion[];
}

export interface Seccion {
  id: string;
  capituloId: string;
  materiaId: string;
  title: string;
  introduccion: string;
  guia_titulo?: string;
  guia_contenido?: string;
  datos_claves: string[];
  order: number;
  isBoss?: boolean;
  isPractice?: boolean;
  practiceType?: string;
  test: TestPaes;
}

export interface TestPaes {
  id: string;
  seccionId: string;
  contexto_base: string | null;
  preguntaIds?: string[];
  preguntas: PreguntaTest[];
}

export interface PreguntaTest {
  id: number;
  texto_index?: number;                    // Índice del texto contextual correspondiente (ej: para desafíos con múltiples textos)
  preambulo_texto?: string | null;         // Citas cortas (Historia/Ciencias)
  preambulo_imagen_url?: string | null;    // Imagen de apoyo (Ciencias/Matemáticas)
  enunciado: string;
  formula_latex?: string | null;           // Fórmulas LaTeX (Matemáticas M1/M2)
  tipo_alternativas?: 'texto' | 'imagen';  // Flag para renderizado dinámico
  alternativas: { A: string; B: string; C: string; D: string };
  respuesta_correcta: 'A' | 'B' | 'C' | 'D';
  feedback_acierto: string;
  feedback_error: string;
}

// ─── Pool de preguntas para el panel admin ───

export type MateriaId =
  | 'competencia-lectora'
  | 'matematicas-m1'
  | 'matematicas-m2'
  | 'ciencias-biologia'
  | 'ciencias-fisica'
  | 'ciencias-quimica'
  | 'ciencias-tp'
  | 'historia';

export interface PoolPregunta {
  id: string;                             // Auto-generado o manual (ej: "m1-frac-01")
  materiaId: MateriaId;                   // Materia destino
  tema: string;                           // Eje temático (ej: "Fracciones")
  preambulo_texto: string | null;
  preambulo_imagen_url: string | null;
  enunciado: string;
  formula_latex: string | null;
  tipo_alternativas: 'texto' | 'imagen';
  alternativas: { A: string; B: string; C: string; D: string };
  respuesta_correcta: 'A' | 'B' | 'C' | 'D';
  feedback_acierto: string;
  feedback_error: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;                      // UID del admin que creó la pregunta
}

// ─── Estado del progreso del usuario ───

export interface SeccionProgress {
  seccionId: string;
  capituloId: string;
  materiaId: string;
  completed: boolean;
  bestScore: number;       // 0-100
  totalQuestions: number;
  correctAnswers: number;
  lastAttemptDate: string | null;
  attempts: number;
}

export interface TestResult {
  seccionId: string;
  answers: TestAnswer[];
  score: number;
  totalCorrect: number;
  totalQuestions: number;
  completedAt: string;
}

export interface TestAnswer {
  preguntaId: number;
  selectedOption: 'A' | 'B' | 'C' | 'D' | null;
  isCorrect: boolean;
}
