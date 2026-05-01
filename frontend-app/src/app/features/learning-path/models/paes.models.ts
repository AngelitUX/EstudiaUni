// ─── Modelos del sistema de aprendizaje estilo Duolingo ───

export interface Materia {
  id: string;
  title: string;
  slug: string;
  icon: string;
  order: number;
  isActive: boolean;
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
  datos_claves: string[];
  order: number;
  test: TestPaes;
}

export interface TestPaes {
  id: string;
  seccionId: string;
  contexto_base: string | null;
  preguntas: PreguntaTest[];
}

export interface PreguntaTest {
  id: number;
  enunciado: string;
  alternativas: { A: string; B: string; C: string; D: string };
  respuesta_correcta: 'A' | 'B' | 'C' | 'D';
  feedback_acierto: string;
  feedback_error: string;
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
