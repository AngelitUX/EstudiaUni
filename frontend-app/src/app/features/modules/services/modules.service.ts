import { Injectable, inject } from '@angular/core';
import { of } from 'rxjs';

// Servicio legacy mantenido por compatibilidad con componentes existentes.
// La lógica principal está en FirestoreService.

interface Topic {
  id: string;
  title: string;
  difficulty: number;
  estimatedMinutes: number;
  masteryLevel: number;
  status: string;
}

interface LearningModule {
  id: string;
  title: string;
  subject: string;
  topics: Topic[];
}
@Injectable({ providedIn: 'root' })
export class ModulesService {

  getLearningPath() {
    // Devuelve datos mock - la lógica real está en FirestoreService
    return of(this.getMockModules());
  }

  getTopic(moduleId: string, topicId: string) {
    const modules = this.getMockModules();
    const module = modules.find(m => m.id === moduleId);
    if (!module) return of(null);
    const topic = module.topics.find((t: Topic) => t.id === topicId);
    return of(topic || null);
  }

  private getMockModules(): LearningModule[] {
    return [
      {
        id: 'mat1',
        title: 'Matemática 1',
        subject: 'M1',
        topics: [
          { id: 'alg1', title: 'Álgebra Básica', difficulty: 1, estimatedMinutes: 30, masteryLevel: 85, status: 'completed' },
          { id: 'alg2', title: 'Ecuaciones Cuadráticas', difficulty: 2, estimatedMinutes: 45, masteryLevel: 60, status: 'in_progress' },
          { id: 'geo1', title: 'Geometría Plana', difficulty: 2, estimatedMinutes: 40, masteryLevel: 0, status: 'available' },
          { id: 'geo2', title: 'Geometría Analítica', difficulty: 3, estimatedMinutes: 50, masteryLevel: 0, status: 'locked' }
        ]
      },
      {
        id: 'leng',
        title: 'Comprensión Lectora',
        subject: 'LENGUAJE',
        topics: [
          { id: 'comp1', title: 'Comprensión Literal', difficulty: 1, estimatedMinutes: 25, masteryLevel: 70, status: 'completed' },
          { id: 'comp2', title: 'Inferencia Textual', difficulty: 2, estimatedMinutes: 35, masteryLevel: 40, status: 'in_progress' },
          { id: 'voc1', title: 'Vocabulario Contextual', difficulty: 2, estimatedMinutes: 30, masteryLevel: 0, status: 'available' }
        ]
      }
    ];
  }
}
