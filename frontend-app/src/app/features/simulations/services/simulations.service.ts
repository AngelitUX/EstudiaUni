import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

interface SimulationAttempt {
  id: string;
  questions: { id: string; stem: string; options: { id: string; text: string }[] }[];
  type: 'simulation' | 'quiz';
  timeLimitMinutes?: number;
}

interface AnswerSubmission {
  questionId: string;
  selectedOption: string;
}

// Servicio legacy mantenido por compatibilidad con componentes existentes.
// La lógica principal de ensayos está en FirestoreService.
@Injectable({ providedIn: 'root' })
export class SimulationsService {

  getAttempt(attemptId: string): Observable<SimulationAttempt | null> {
    // Devolver mock data en lugar de null
    return of({
      id: attemptId,
      questions: [],
      type: 'quiz' as const,
      timeLimitMinutes: undefined
    });
  }

  submitSimulation(attemptId: string, answers: AnswerSubmission[]) {
    return of({ success: true, mock: true });
  }

  finishSimulation(attemptId: string) {
    return of({ success: true, mock: true });
  }
}
