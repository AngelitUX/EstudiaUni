import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  addDoc,
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  DocumentData
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { from, map, Observable, of, catchError } from 'rxjs';
import m1QuestionsData from '../../../assets/m1-preguntas-db.json';
import m1InviernoQuestionsData from '../../../assets/m1-invierno-preguntas-db.json';
import m1Invierno2025QuestionsData from '../../../assets/m1-invierno-2025-preguntas-db.json';
import m12026QuestionsData from '../../../assets/m1-2026-preguntas-db.json';
import m1Invierno2026QuestionsData from '../../../assets/m1-invierno-2026-preguntas-db.json';
import m22024QuestionsData from '../../../assets/m2-2024-preguntas-db.json';
import m22025QuestionsData from '../../../assets/m2-2025-preguntas-db.json';
import m22026QuestionsData from '../../../assets/m2-2026-preguntas-db.json';
import m2Invierno2024QuestionsData from '../../../assets/m2-invierno-2024-preguntas-db.json';
import m2Invierno2025QuestionsData from '../../../assets/m2-invierno-2025-preguntas-db.json';
import m2Invierno2026QuestionsData from '../../../assets/m2-invierno-2026-preguntas-db.json';
import h2024QuestionsData from '../../../assets/h-2024-preguntas-db.json';
import h2025QuestionsData from '../../../assets/h-2025-preguntas-db.json';
import h2026QuestionsData from '../../../assets/h-2026-preguntas-db.json';
import hInvierno2024QuestionsData from '../../../assets/h-invierno-2024-preguntas-db.json';
import hInvierno2025QuestionsData from '../../../assets/h-invierno-2025-preguntas-db.json';
import hInvierno2026QuestionsData from '../../../assets/h-invierno-2026-preguntas-db.json';
import b2024QuestionsData from '../../../assets/b-2024-preguntas-db.json';
import bInvierno2024QuestionsData from '../../../assets/b-invierno-2024-preguntas-db.json';
import b2025QuestionsData from '../../../assets/b-2025-preguntas-db.json';
import bInvierno2025QuestionsData from '../../../assets/b-invierno-2025-preguntas-db.json';
import b2026QuestionsData from '../../../assets/b-2026-preguntas-db.json';
import bInvierno2026QuestionsData from '../../../assets/b-invierno-2026-preguntas-db.json';
import f2024QuestionsData from '../../../assets/f-2024-preguntas-db.json';
import f2025QuestionsData from '../../../assets/f-2025-preguntas-db.json';
import f2026QuestionsData from '../../../assets/f-2026-preguntas-db.json';
import fInvierno2026QuestionsData from '../../../assets/f-invierno-2026-preguntas-db.json';
import fInvierno2024QuestionsData from '../../../assets/f-invierno-2024-preguntas-db.json';
import fInvierno2025QuestionsData from '../../../assets/f-invierno-2025-preguntas-db.json';

/**
 * ESTRUCTURA DE FIRESTORE PARA ESTUDIAUNI
 * =========================================
 * 
 * Colecciones principales:
 * 
 * 1. users/{uid}
 *    - email, displayName, photoURL
 *    - plan: 'free' | 'premium'
 *    - createdAt, lastLogin
 *    - stats: { questionsAnswered, studyStreak, lastStudyDate }
 * 
 * 2. ensayos/{ensayoId}
 *    - title: "Ensayo M1 - Forma 115"
 *    - subject: 'matematica1' | 'lenguaje' | 'ciencias' | 'historia'
 *    - questionCount: 65
 *    - timeMinutes: 140
 *    - difficulty: 'facil' | 'medio' | 'dificil'
 *    - isActive: boolean
 * 
 * 3. preguntas/{preguntaId}
 *    - ensayoId: referencia al ensayo
 *    - subject: materia
 *    - text: texto de la pregunta
 *    - options: { A: "...", B: "...", C: "...", D: "...", E: "..." }
 *    - correctAnswer: 'A' | 'B' | 'C' | 'D' | 'E'
 *    - explanation: explicación de la respuesta correcta
 *    - difficulty: 1-5
 *    - topic: tema específico
 * 
 * 4. intentos/{intentoId}
 *    - odId
 *    - ensayoId
 *    - startedAt, finishedAt
 *    - status: 'in_progress' | 'completed' | 'abandoned'
 *    - answers: [{ preguntaId, selectedAnswer, isCorrect }]
 *    - score: puntaje final
 *    - timeSpent: segundos
 * 
 * 5. progreso/{odId}
 *    - globalMastery: 0-100
 *    - subjectMastery: { matematica1: 75, lenguaje: 60, ... }
 *    - weakTopics: ['ecuaciones', 'inferencia']
 *    - strongTopics: ['algebra', 'comprension_literal']
 */

// Interfaces para tipado
export interface UserProfile {
  odId: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
  profileEmoji?: string;
  emailVerified?: boolean;
  bio?: string;
  targetCareer?: string;
  targetUniversity?: string;
  targetExamDate?: string | null;
  studyGoalMinutesPerDay?: number;
  preferredStudyTime?: 'manana' | 'tarde' | 'noche';
  notificationsEnabled?: boolean;
  theme?: 'dark' | 'light' | 'auto';
  notificationIntensity?: 'baja' | 'normal' | 'alta';
  plan: 'free' | 'premium';
  createdAt: Timestamp;
  lastLogin: Timestamp;
  stats: {
    questionsAnswered: number;
    studyStreak: number;
    lastStudyDate: Timestamp | null;
  };
}

export interface Ensayo {
  id?: string;
  title: string;
  subject: 'matematica1' | 'matematica2' | 'lenguaje' | 'ciencias' | 'historia';
  questionCount: number;
  timeMinutes: number;
  difficulty: 'facil' | 'medio' | 'dificil';
  isActive: boolean;
}

export interface Pregunta {
  id?: string;
  ensayoId: string;
  subject: string;
  text: string;
  options: { A: string; B: string; C: string; D: string; E: string };
  correctAnswer: 'A' | 'B' | 'C' | 'D' | 'E';
  explanation: string;
  difficulty: number;
  topic: string;
}

export interface Intento {
  id?: string;
  odId: string;
  ensayoId: string;
  startedAt: Timestamp;
  finishedAt?: Timestamp;
  status: 'in_progress' | 'completed' | 'abandoned';
  answers: Array<{
    preguntaId: string;
    selectedAnswer: string;
    isCorrect: boolean;
  }>;
  score?: number;
  timeSpent?: number;
}

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  // ============ USUARIOS ============

  /** Obtener perfil del usuario actual */
  getUserProfile(): Observable<UserProfile | null> {
    const user = this.auth.currentUser;
    if (!user) return of(null);
    
    const userRef = doc(this.firestore, 'users', user.uid);
    return from(getDoc(userRef)).pipe(
      map(snap => snap.exists() ? { odId: snap.id, ...snap.data() } as UserProfile : null)
    );
  }

  /** Crear o actualizar perfil de usuario */
  async saveUserProfile(data: Partial<UserProfile>): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No hay usuario autenticado');
    
    const userRef = doc(this.firestore, 'users', user.uid);
    const existing = await getDoc(userRef);
    
    if (existing.exists()) {
      await updateDoc(userRef, { ...data, lastLogin: Timestamp.now() });
    } else {
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName || 'Estudiante',
        photoURL: user.photoURL || null,
        profileEmoji: '✨',
        bio: '',
        targetCareer: '',
        targetUniversity: '',
        targetExamDate: null,
        studyGoalMinutesPerDay: 45,
        preferredStudyTime: 'tarde',
        notificationsEnabled: true,
        plan: 'free',
        createdAt: Timestamp.now(),
        lastLogin: Timestamp.now(),
        stats: {
          questionsAnswered: 0,
          studyStreak: 0,
          lastStudyDate: null
        },
        ...data
      });
    }
  }

  /** Actualizar configuración del perfil académico */
  async updateProfileSettings(
    data: Partial<
      Pick<
        UserProfile,
        | 'displayName'
        | 'photoURL'
        | 'profileEmoji'
        | 'bio'
        | 'targetCareer'
        | 'targetUniversity'
        | 'targetExamDate'
        | 'studyGoalMinutesPerDay'
        | 'preferredStudyTime'
        | 'notificationsEnabled'
        | 'theme'
        | 'notificationIntensity'
      >
    >,
  ): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No hay usuario autenticado');

    const userRef = doc(this.firestore, 'users', user.uid);
    const existing = await getDoc(userRef);

    if (!existing.exists()) {
      await this.saveUserProfile(data);
      return;
    }

    await updateDoc(userRef, {
      ...data,
      lastLogin: Timestamp.now(),
    });
  }

  /** Actualizar estadísticas del usuario */
  async updateUserStats(stats: Partial<UserProfile['stats']>): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) return;
    
    const userRef = doc(this.firestore, 'users', user.uid);
    await updateDoc(userRef, { 
      [`stats.questionsAnswered`]: stats.questionsAnswered,
      [`stats.studyStreak`]: stats.studyStreak,
      [`stats.lastStudyDate`]: stats.lastStudyDate
    });
  }

  // ============ ENSAYOS ============

  /** Obtener todos los ensayos activos */
  getEnsayos(subjectFilter?: string): Observable<Ensayo[]> {
    const ensayosRef = collection(this.firestore, 'ensayos');
    let q = query(ensayosRef, where('isActive', '==', true));
    
    if (subjectFilter && subjectFilter !== 'todos') {
      q = query(ensayosRef, where('isActive', '==', true), where('subject', '==', subjectFilter));
    }
    
    return from(getDocs(q)).pipe(
      map(snapshot => {
        if (snapshot.empty) {
          return this.getMockEnsayos(subjectFilter);
        }
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ensayo));
      }),
      catchError(err => {
        console.warn('[Firestore] getEnsayos falló (posible índice en construcción), usando mock data:', err?.message);
        return of(this.getMockEnsayos(subjectFilter));
      })
    );
  }

  /** Obtener un ensayo por ID */
  getEnsayo(ensayoId: string): Observable<Ensayo | null> {
    const ensayoRef = doc(this.firestore, 'ensayos', ensayoId);
    return from(getDoc(ensayoRef)).pipe(
      map(snap => snap.exists() ? { id: snap.id, ...snap.data() } as Ensayo : null)
    );
  }

  // ============ PREGUNTAS ============

  /** Obtener preguntas de un ensayo */
  getPreguntas(ensayoId: string): Observable<Pregunta[]> {
    const preguntasRef = collection(this.firestore, 'preguntas');
    // Nota: orderBy('order') requiere un índice compuesto con ensayoId.
    // Mientras el índice se construye, usamos sólo el filtro where para evitar el error.
    const q = query(preguntasRef, where('ensayoId', '==', ensayoId));
    
    return from(getDocs(q)).pipe(
      map(snapshot => {
        if (snapshot.empty) {
          // Mock data si no hay preguntas
          return this.getMockPreguntas(ensayoId);
        }
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Pregunta));
      }),
      catchError(err => {
        console.warn('[Firestore] getPreguntas falló (posible índice en construcción), usando mock data:', err?.message);
        return of(this.getMockPreguntas(ensayoId));
      })
    );
  }

  // ============ INTENTOS ============

  /** Iniciar un nuevo intento de ensayo */
  async startIntento(ensayoId: string): Promise<string> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Debes iniciar sesión');
    
    const intentosRef = collection(this.firestore, 'intentos');
    const newIntento: Omit<Intento, 'id'> = {
      odId: user.uid,
      ensayoId,
      startedAt: Timestamp.now(),
      status: 'in_progress',
      answers: []
    };
    
    const docRef = await addDoc(intentosRef, newIntento);
    return docRef.id;
  }

  /** Guardar respuesta de una pregunta */
  async saveAnswer(intentoId: string, preguntaId: string, selectedAnswer: string, isCorrect: boolean): Promise<void> {
    const intentoRef = doc(this.firestore, 'intentos', intentoId);
    const intentoSnap = await getDoc(intentoRef);
    
    if (!intentoSnap.exists()) return;
    
    const intento = intentoSnap.data() as Intento;
    const answers = intento.answers || [];
    
    // Buscar si ya existe respuesta para esta pregunta
    const existingIndex = answers.findIndex(a => a.preguntaId === preguntaId);
    if (existingIndex >= 0) {
      answers[existingIndex] = { preguntaId, selectedAnswer, isCorrect };
    } else {
      answers.push({ preguntaId, selectedAnswer, isCorrect });
    }
    
    await updateDoc(intentoRef, { answers });
  }

  /** Finalizar intento y calcular puntaje */
  async finishIntento(intentoId: string, timeSpent: number): Promise<number> {
    const intentoRef = doc(this.firestore, 'intentos', intentoId);
    const intentoSnap = await getDoc(intentoRef);
    
    if (!intentoSnap.exists()) return 0;
    
    const intento = intentoSnap.data() as Intento;
    const correctAnswers = intento.answers.filter(a => a.isCorrect).length;
    const totalQuestions = intento.answers.length || 1;
    const score = Math.round((correctAnswers / totalQuestions) * 1000); // Puntaje PAES estilo
    
    await updateDoc(intentoRef, {
      status: 'completed',
      finishedAt: Timestamp.now(),
      timeSpent,
      score
    });
    
    // Actualizar stats del usuario
    const user = this.auth.currentUser;
    if (user) {
      const userRef = doc(this.firestore, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const currentQuestions = userData['stats']?.questionsAnswered || 0;
        await updateDoc(userRef, {
          'stats.questionsAnswered': currentQuestions + intento.answers.length
        });
      }
    }
    
    return score;
  }

  /** Obtener intentos del usuario actual */
  getIntentosUsuario(): Observable<Intento[]> {
    const user = this.auth.currentUser;
    if (!user) return of([]);
    
    const intentosRef = collection(this.firestore, 'intentos');
    const q = query(intentosRef, where('odId', '==', user.uid), orderBy('startedAt', 'desc'), limit(20));
    
    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Intento)))
    );
  }

  /** Obtener un intento específico */
  getIntento(intentoId: string): Observable<Intento | null> {
    const intentoRef = doc(this.firestore, 'intentos', intentoId);
    return from(getDoc(intentoRef)).pipe(
      map(snap => snap.exists() ? { id: snap.id, ...snap.data() } as Intento : null)
    );
  }

  // ============ MOCK DATA (mientras no hay datos reales) ============

  private getMockEnsayos(subjectFilter?: string): Ensayo[] {
    const allEnsayos: Ensayo[] = [
      { id: 'mat1-f115', title: 'Ensayo M1 - Forma 115', subject: 'matematica1', questionCount: 65, timeMinutes: 140, difficulty: 'medio', isActive: true },
      { id: 'mat1-f116', title: 'Ensayo M1 - Forma 116', subject: 'matematica1', questionCount: 65, timeMinutes: 140, difficulty: 'dificil', isActive: true },
      { id: 'mat1-f117', title: 'Ensayo M1 - Forma 117', subject: 'matematica1', questionCount: 65, timeMinutes: 140, difficulty: 'facil', isActive: true },
      { id: 'mat2-f201', title: 'Ensayo M2 - Forma 201', subject: 'matematica2', questionCount: 55, timeMinutes: 140, difficulty: 'medio', isActive: true },
      { id: 'leng-f301', title: 'Ensayo CL - Forma 301', subject: 'lenguaje', questionCount: 65, timeMinutes: 150, difficulty: 'medio', isActive: true },
      { id: 'leng-f302', title: 'Ensayo CL - Forma 302', subject: 'lenguaje', questionCount: 65, timeMinutes: 150, difficulty: 'medio', isActive: true },
      { id: 'ciencias-f401', title: 'Ensayo Ciencias - Forma 401', subject: 'ciencias', questionCount: 80, timeMinutes: 160, difficulty: 'medio', isActive: true },
      { id: 'historia-f501', title: 'Ensayo Historia - Forma 501', subject: 'historia', questionCount: 65, timeMinutes: 120, difficulty: 'medio', isActive: true },
    ];
    
    if (subjectFilter && subjectFilter !== 'todos') {
      return allEnsayos.filter(e => e.subject === subjectFilter);
    }
    return allEnsayos;
  }

  private getMockPreguntas(ensayoId: string): Pregunta[] {
    if (ensayoId === 'm1') {
      return m1QuestionsData as unknown as Pregunta[];
    }
    if (ensayoId === 'm1-invierno') {
      return m1InviernoQuestionsData as unknown as Pregunta[];
    }
    if (ensayoId === 'm1-invierno-2025') {
      return m1Invierno2025QuestionsData as unknown as Pregunta[];
    }
    if (ensayoId === 'm1-2026') {
      return m12026QuestionsData as unknown as Pregunta[];
    }
    if (ensayoId === 'm1-invierno-2026') {
      return m1Invierno2026QuestionsData as unknown as Pregunta[];
    }
    if (ensayoId === 'm2-2024') {
      return m22024QuestionsData as unknown as Pregunta[];
    }
    if (ensayoId === 'm2-2025') {
      return m22025QuestionsData as unknown as Pregunta[];
    }
    if (ensayoId === 'm2-2026') {
      return m22026QuestionsData as unknown as Pregunta[];
    }
    if (ensayoId === 'm2-invierno-2024') {
      return m2Invierno2024QuestionsData as unknown as Pregunta[];
    }
    if (ensayoId === 'm2-invierno-2025') {
      return m2Invierno2025QuestionsData as unknown as Pregunta[];
    }
    if (ensayoId === 'm2-invierno-2026') {
      return m2Invierno2026QuestionsData as unknown as Pregunta[];
    }
    if (ensayoId === 'h-2024') {
      return h2024QuestionsData as unknown as Pregunta[];
    }
    if (ensayoId === 'h-2025') {
      return h2025QuestionsData as unknown as Pregunta[];
    }
    if (ensayoId === 'h-2026') {
      return h2026QuestionsData as unknown as Pregunta[];
    }
    if (ensayoId === 'h-invierno-2024') {
      return hInvierno2024QuestionsData as unknown as Pregunta[];
    }
    if (ensayoId === 'h-invierno-2025') {
      return hInvierno2025QuestionsData as unknown as Pregunta[];
    }
    if (ensayoId === 'h-invierno-2026') {
      return hInvierno2026QuestionsData as unknown as Pregunta[];
    }
    if (ensayoId === 'b-2024') {
      return b2024QuestionsData as unknown as Pregunta[];
    }
    if (ensayoId === 'b-invierno-2024') {
      return bInvierno2024QuestionsData as unknown as Pregunta[];
    }
    if (ensayoId === 'b-2025') {
      return b2025QuestionsData as unknown as Pregunta[];
    }
    if (ensayoId === 'b-invierno-2025') {
      return bInvierno2025QuestionsData as unknown as Pregunta[];
    }
    if (ensayoId === 'b-2026') {
      return b2026QuestionsData as unknown as Pregunta[];
    }
    if (ensayoId === 'b-invierno-2026') {
      return bInvierno2026QuestionsData as unknown as Pregunta[];
    }
    if (ensayoId === 'f-2024') {
      return f2024QuestionsData as unknown as Pregunta[];
    }
    if (ensayoId === 'f-2025') {
      return f2025QuestionsData as unknown as Pregunta[];
    }
    if (ensayoId === 'f-2026') {
      return f2026QuestionsData as unknown as Pregunta[];
    }
    if (ensayoId === 'f-invierno-2026') {
      return fInvierno2026QuestionsData as unknown as Pregunta[];
    }
    if (ensayoId === 'f-invierno-2024') {
      return fInvierno2024QuestionsData as unknown as Pregunta[];
    }
    if (ensayoId === 'f-invierno-2025') {
      return fInvierno2025QuestionsData as unknown as Pregunta[];
    }
    
    const total = this.getMockQuestionCount(ensayoId);
    // Generar preguntas mock
    const preguntas: Pregunta[] = [];
    const topics = ['Álgebra', 'Geometría', 'Probabilidad', 'Funciones', 'Trigonometría'];
    
    for (let i = 1; i <= total; i++) {
      preguntas.push({
        id: `${ensayoId}-q${i}`,
        ensayoId,
        subject: 'matematica1',
        text: `Pregunta ${i}: Si $x^2 + ${i}x + ${i * 2} = 0$, ¿cuál es el valor de la suma de las raíces?`,
        options: {
          A: `${-i}`,
          B: `${i}`,
          C: `${i * 2}`,
          D: `${-i * 2}`,
          E: `${i / 2}`
        },
        correctAnswer: 'A',
        explanation: `Por el teorema de Vieta, la suma de las raíces de $ax^2 + bx + c = 0$ es $-b/a$. En este caso, $-${i}/1 = ${-i}$.`,
        difficulty: (i % 5) + 1,
        topic: topics[i % 5]
      });
    }
    
    return preguntas;
  }

  private getMockQuestionCount(ensayoId: string): number {
    const normalized = ensayoId.toLowerCase();
    if (normalized.includes('ciencias')) return 80;
    if (normalized.includes('historia')) return 65;
    if (normalized.includes('competencia') || normalized.includes('lectora') || normalized.includes('leng')) return 65;
    if (normalized.includes('m2') || normalized.includes('mat2')) return 55;
    if (normalized.includes('m1') || normalized.includes('mat1')) return 65;
    return 65;
  }
}
