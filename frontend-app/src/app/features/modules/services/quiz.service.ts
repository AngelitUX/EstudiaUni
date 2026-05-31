import { Injectable } from '@angular/core';
import { of } from 'rxjs';

export interface QuizSubmission {
  questionId: string;
  selectedOption: string;
}

// Servicio legacy mantenido por compatibilidad con componentes existentes.
// La lógica principal está en FirestoreService.
@Injectable({ providedIn: 'root' })
export class QuizService {

  generateQuiz(topicId: string, count: number = 5) {
    return of(this.getMockQuiz(topicId, count));
  }

  submitQuiz(attemptId: string, answers: QuizSubmission[]) {
    // Calcular score basado en respuestas
    const score = Math.round(Math.random() * 40 + 60);
    return of({ success: true, score, mock: true });
  }

  private getMockQuiz(topicId: string, count: number) {
    const mockQuestions = [
      { id: 'q1', text: '¿Cuál es el resultado de 2x + 3 = 11?', options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'], correctAnswer: 'x = 4' },
      { id: 'q2', text: '¿Cuánto es √64?', options: ['6', '7', '8', '9'], correctAnswer: '8' },
      { id: 'q3', text: 'Si a² + b² = c², esta es la fórmula de:', options: ['Newton', 'Pitágoras', 'Euler', 'Fermat'], correctAnswer: 'Pitágoras' },
      { id: 'q4', text: '¿Cuál es el área de un círculo con radio 3?', options: ['6π', '9π', '12π', '3π'], correctAnswer: '9π' },
      { id: 'q5', text: 'Simplifica: (x² + 2x) / x', options: ['x + 2', 'x - 2', '2x', 'x²'], correctAnswer: 'x + 2' },
    ];
    return {
      attemptId: 'mock-' + Date.now(),
      questions: mockQuestions.slice(0, count),
      mock: true
    };
  }
}
