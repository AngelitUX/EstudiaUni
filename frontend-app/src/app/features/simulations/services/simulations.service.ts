import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

interface SimulationAttempt {
  id: string;
  questions: any[];
  type: 'simulation' | 'quiz';
  timeLimitMinutes?: number;
}

// Este servicio ya no usa el backend - todo está en FirestoreService
// Se mantiene por compatibilidad con componentes existentes
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

  submitSimulation(attemptId: string, answers: any[]) {
    return of({ success: true, mock: true });
  }

  finishSimulation(attemptId: string) {
    return of({ success: true, mock: true });
  }
}
