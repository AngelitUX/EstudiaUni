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
  Timestamp
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { from, map, Observable, of, catchError } from 'rxjs';

// @ts-ignore
import m1QuestionsData from '../../../assets/m1-preguntas-db.json';
// @ts-ignore
import m1InviernoQuestionsData from '../../../assets/m1-invierno-preguntas-db.json';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  plan: 'free' | 'premium';
  notificationsEnabled?: boolean;
  emailVerified?: boolean;
  theme?: 'auto' | 'dark' | 'light';
  notificationIntensity?: 'baja' | 'normal' | 'alta';
  preferredStudyTime?: 'manana' | 'tarde' | 'noche';
  bio?: string;
  profileEmoji?: string;
  targetCareer?: string;
  targetUniversity?: string;
  targetExamDate?: string;
  studyGoalMinutesPerDay?: number;
  stats: { questionsAnswered: number; studyStreak: number; lastStudyDate: string; };
}

export interface Ensayo {
  id?: string;
  title: string;
  subject: string;
  questionCount: number;
  timeMinutes: number;
  difficulty: string;
  isActive: boolean;
}

export interface Pregunta {
  id: string;
  ensayoId: string;
  order: number;
  subject: string;
  text: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
    E?: string;
    [key: string]: any;
  };
  correctAnswer: string;
  imageUrl?: string | null;
  explanation?: string;
  readingText?: string[] | null;
}

export interface Intento {
  id?: string;
  odId: string;
  ensayoId: string;
  ensayoTitle: string;
  startedAt: Timestamp;
  finishedAt?: Timestamp | null;
  status: 'in_progress' | 'completed' | 'abandoned';
  answers: any[];
  score?: number;
}

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  public firestore = inject(Firestore);
  private auth = inject(Auth);

  constructor() { (window as any).firestoreService = this; }

  getUserProfile(uid?: string): Observable<UserProfile | null> {
    const targetUid = uid || this.auth.currentUser?.uid;
    if (!targetUid) return of(null);
    return from(getDoc(doc(this.firestore, 'users', targetUid))).pipe(
      map(snap => snap.exists() ? snap.data() as UserProfile : null)
    );
  }

  async saveUserProfile(data: any): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) return;
    await setDoc(doc(this.firestore, 'users', user.uid), data, { merge: true });
  }

  async updateProfileSettings(settings: any): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) return;
    await updateDoc(doc(this.firestore, 'users', user.uid), settings);
  }

  async updateUserStats(stats: any): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) return;
    await updateDoc(doc(this.firestore, 'users', user.uid), stats);
  }

  getEnsayos(subjectFilter?: string): Observable<Ensayo[]> {
    const q = query(collection(this.firestore, 'ensayos'), where('isActive', '==', true));
    return from(getDocs(q)).pipe(
      map(snap => snap.docs.map(d => ({ id: d.id, ...d.data() } as Ensayo)))
    );
  }

  getEnsayo(ensayoId: string): Observable<Ensayo | null> {
    // ALIAS: Si piden 'm1', buscamos 'm1-2024'
    const finalId = ensayoId === 'm1' ? 'm1-2024' : ensayoId;
    return from(getDoc(doc(this.firestore, 'ensayos', finalId))).pipe(
      map(snap => snap.exists() ? { id: snap.id, ...snap.data() } as Ensayo : null)
    );
  }

  getPreguntas(ensayoId: string): Observable<Pregunta[]> {
    // ALIAS: Si piden 'm1', buscamos preguntas de 'm1-2024'
    const finalId = ensayoId === 'm1' ? 'm1-2024' : ensayoId;
    const q = query(collection(this.firestore, 'preguntas'), where('ensayoId', '==', finalId));
    return from(getDocs(q)).pipe(
      map(snap => {
        if (snap.empty) return this.getMockPreguntas(finalId);
        const results = snap.docs.map(d => ({ id: d.id, ...d.data() } as Pregunta));
        return results.sort((a, b) => (a.order || 0) - (b.order || 0));
      }),
      catchError(() => of(this.getMockPreguntas(finalId)))
    );
  }

  async startIntento(ensayoId: string, mode: string, fullName: string): Promise<string> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No auth');
    const snap = await addDoc(collection(this.firestore, 'intentos'), {
      odId: user.uid,
      ensayoId,
      ensayoTitle: fullName,
      startedAt: Timestamp.now(),
      status: 'in_progress',
      answers: []
    });
    return snap.id;
  }

  getIntento(intentoId: string): Observable<Intento | null> {
    return from(getDoc(doc(this.firestore, 'intentos', intentoId))).pipe(
      map(snap => snap.exists() ? { id: snap.id, ...snap.data() } as Intento : null)
    );
  }

  async saveAnswer(intentoId: string, preguntaId: string, selectedAnswer: string, isCorrect: boolean): Promise<void> {
    const ref = doc(this.firestore, 'intentos', intentoId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    const answers = snap.data()['answers'] || [];
    const idx = answers.findIndex((a: any) => a.preguntaId === preguntaId);
    if (idx >= 0) answers[idx] = { preguntaId, selectedAnswer, isCorrect };
    else answers.push({ preguntaId, selectedAnswer, isCorrect });
    await updateDoc(ref, { answers });
  }

  async finishIntento(intentoId: string, timeSpent: number, totalQuestions: number): Promise<number> {
    const ref = doc(this.firestore, 'intentos', intentoId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return 0;
    const correct = snap.data()['answers'].filter((a: any) => a.isCorrect).length;
    const score = Math.round(100 + (correct / Math.max(totalQuestions, 1)) * 900);
    await updateDoc(ref, { status: 'completed', finishedAt: Timestamp.now(), score });
    return score;
  }

  async saveActivity(uid: string, entry: any): Promise<void> {
    await addDoc(collection(this.firestore, `users/${uid}/actividad`), { ...entry, timestamp: Timestamp.now() });
  }

  async getUserActivities(uid: string, limitCount: number = 10): Promise<any[]> {
    const q = query(collection(this.firestore, `users/${uid}/actividad`), orderBy('timestamp', 'desc'), limit(limitCount));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  // SEEDING
  async seedEnsayoToFirestore(id: string) {
    const p = this.getMockPreguntas(id);
    for (const x of p) await setDoc(doc(this.firestore, 'preguntas', `${id}_${x.order}`), { ...x, ensayoId: id, id: `${id}_${x.order}` });
  }

  async seedEnsayoMetadata(id: string) {
    const p = this.getMockPreguntas(id);
    await setDoc(doc(this.firestore, 'ensayos', id), { 
      title: id === 'm1-2024' ? 'M1 PAES Oficial 2024' : `Ensayo ${id.toUpperCase()}`, 
      subject: 'matematica1', 
      questionCount: p.length, 
      timeMinutes: 140, 
      difficulty: 'medio', 
      isActive: true 
    });
  }

  private getMockPreguntas(id: string): Pregunta[] {
    // Si piden 'm1', devolvemos los datos de 'm1-2024'
    const targetId = (id === 'm1' || id === 'm1-2024') ? 'm1-2024' : id;
    if (targetId === 'm1-2024') return m1QuestionsData as any || [];
    if (id === 'm1-invierno-2024') return m1InviernoQuestionsData as any || [];
    return [];
  }
}
