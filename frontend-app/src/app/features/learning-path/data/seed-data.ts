import { Materia, Capitulo } from '../models/paes.models';
import { CAP1_LOCALIZAR } from './cap1-localizar-data';

export const MATERIAS: Materia[] = [
  { id: 'comp-lectora', title: 'Competencia Lectora', slug: 'competencia-lectora', icon: '📖', order: 1, isActive: true },
  { id: 'mat1', title: 'Matemática 1', slug: 'matematica-1', icon: '📐', order: 2, isActive: false },
  { id: 'historia', title: 'Historia y Cs. Sociales', slug: 'historia', icon: '🏛️', order: 3, isActive: false },
  { id: 'ciencias', title: 'Ciencias', slug: 'ciencias', icon: '🧬', order: 4, isActive: false },
];

export const CAPITULOS: Capitulo[] = [
  CAP1_LOCALIZAR,
];
