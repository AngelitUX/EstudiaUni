import { Injectable, inject, signal, WritableSignal } from '@angular/core';
import { 
  Firestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  addDoc,
  deleteDoc,
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp
} from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { from, map, Observable, of, catchError, switchMap, shareReplay } from 'rxjs';

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
  studyGoalMinutesPerDay?: number;
  selectedSubjects?: string[];
  dyslexiaFont?: boolean;
  highContrast?: boolean;
  fontSize?: 'normal' | 'large' | 'xlarge';
  linkedinUrl?: string;
  favoriteCareers?: any[];
  location?: string;
  stats: { questionsAnswered: number; studyStreak: number; lastStudyDate: string; };
  notasNem?: {
    n1?: number | null;
    n2?: number | null;
    n3?: number | null;
    n4?: number | null;
    me?: number | null;
    mae?: number | null;
    grupo?: string;
  };
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
  public profileSignal: WritableSignal<UserProfile | null> = signal(null);
  private cachedProfile$: Observable<UserProfile | null> | null = null;

  constructor() { 
    (window as any).firestoreService = this; 
    // Clear cached profile observable when auth status resets
    authState(this.auth).subscribe(user => {
      if (!user) {
        this.cachedProfile$ = null;
        this.profileSignal.set(null);
      }
    });
  }

  getUserProfile(forceRefresh = false, uid?: string): Observable<UserProfile | null> {
    if (uid) {
      const docRef = doc(this.firestore, 'users', uid);
      return from(getDoc(docRef)).pipe(
        map(snap => snap.exists() ? snap.data() as UserProfile : null)
      );
    }

    if (this.cachedProfile$ && !forceRefresh) {
      return this.cachedProfile$;
    }

    this.cachedProfile$ = authState(this.auth).pipe(
      switchMap((user: any) => {
        if (!user) {
          this.profileSignal.set(null);
          return of(null);
        }

        // Return local cached signal immediately if populated and not force-refreshing
        const current = this.profileSignal();
        if (current && current.uid === user.uid && !forceRefresh) {
          return of(current);
        }

        const docRef = doc(this.firestore, 'users', user.uid);
        return from(getDoc(docRef)).pipe(
          map(snap => {
            const p = snap.exists() ? snap.data() as UserProfile : null;
            this.profileSignal.set(p);
            return p;
          })
        );
      }),
      shareReplay(1)
    );

    return this.cachedProfile$;
  }

  async saveUserProfile(data: any): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) return;

    // Si nos pasan un displayName, verificar que no estemos sobreescribiendo uno ya existente
    if (data && data.displayName) {
      // Reemplazar saltos de línea con espacio y limpiar espacios extra
      data.displayName = data.displayName.replace(/[\r\n]+/g, ' ').trim();

      try {
        const docRef = doc(this.firestore, 'users', user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const existingData = snap.data();
          if (existingData && existingData['displayName'] && existingData['displayName'].trim() !== '') {
            // Si ya existe un nombre real guardado en su perfil, lo conservamos y no lo sobreescribimos con el de Google
            data.displayName = existingData['displayName'].replace(/[\r\n]+/g, ' ').trim();
          }
        }
      } catch (err) {
        console.error('Error preserving displayName:', err);
      }
    }

    await setDoc(doc(this.firestore, 'users', user.uid), data, { merge: true });

    // Update local profile signal immediately to avoid redundant fetches
    const current = this.profileSignal();
    if (current && current.uid === user.uid) {
      this.profileSignal.set({ ...current, ...data });
    }
  }

  async findUidByEmail(email: string): Promise<string | null> {
    try {
      const usersRef = collection(this.firestore, 'users');
      const q = query(usersRef, where('email', '==', email.toLowerCase().trim()));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs[0].id;
      }
    } catch (error) {
      console.error('Error finding UID by email:', error);
    }
    return null;
  }

  async migrateUserData(oldUid: string, newUid: string): Promise<void> {
    try {
      console.log(`[Migration] Starting data migration from ${oldUid} to ${newUid}`);
      
      // 1. Copiar documento de perfil
      const oldDocRef = doc(this.firestore, 'users', oldUid);
      const newDocRef = doc(this.firestore, 'users', newUid);
      const oldSnap = await getDoc(oldDocRef);
      
      if (oldSnap.exists()) {
        const oldData = oldSnap.data();
        console.log('[Migration] Migrating profile data:', oldData);
        // Preservar uid del nuevo usuario y actualizar en Firestore
        await setDoc(newDocRef, { ...oldData, uid: newUid }, { merge: true });
        
        // Eliminar documento antiguo de perfil para evitar futuras duplicaciones o re-migraciones
        await deleteDoc(oldDocRef);
        console.log('[Migration] Old profile document deleted successfully.');
      } else {
        console.warn('[Migration] Old profile document did not exist.');
      }
      
      // 2. Migrar intentos de ensayos (cambiar odId de oldUid a newUid)
      const intentosRef = collection(this.firestore, 'intentos');
      const qIntentos = query(intentosRef, where('odId', '==', oldUid));
      const intentosSnap = await getDocs(qIntentos);
      console.log(`[Migration] Found ${intentosSnap.size} attempts to migrate.`);
      for (const docSnap of intentosSnap.docs) {
        await updateDoc(doc(this.firestore, 'intentos', docSnap.id), { odId: newUid });
      }
      console.log('[Migration] Simulation attempts migrated successfully.');
      
      // 3. Migrar actividades (copiar subcolección)
      const oldActRef = collection(this.firestore, `users/${oldUid}/actividad`);
      const newActRef = collection(this.firestore, `users/${newUid}/actividad`);
      const actSnap = await getDocs(oldActRef);
      console.log(`[Migration] Found ${actSnap.size} activities to migrate.`);
      for (const docSnap of actSnap.docs) {
        await setDoc(doc(newActRef, docSnap.id), docSnap.data());
        // Eliminar actividad antigua
        await deleteDoc(doc(oldActRef, docSnap.id));
      }
      console.log('[Migration] Activity history migrated and cleaned up successfully.');
      
    } catch (error) {
      console.error('[Migration] Critical error migrating user data:', error);
    }
  }

  async updateProfileSettings(settings: any): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) return;
    await updateDoc(doc(this.firestore, 'users', user.uid), settings);

    // Update local profile signal immediately to avoid redundant fetches
    const current = this.profileSignal();
    if (current && current.uid === user.uid) {
      this.profileSignal.set({ ...current, ...settings });
    }
  }

  async updateUserStats(stats: any): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) return;
    await updateDoc(doc(this.firestore, 'users', user.uid), stats);

    // Update local profile signal immediately to avoid redundant fetches
    const current = this.profileSignal();
    if (current && current.uid === user.uid) {
      this.profileSignal.set({ 
        ...current, 
        stats: { ...current.stats, ...stats } 
      });
    }
  }

  getEnsayos(subjectFilter?: string): Observable<Ensayo[]> {
    const q = query(collection(this.firestore, 'ensayos'), where('isActive', '==', true));
    return from(getDocs(q)).pipe(
      map(snap => snap.docs.map(d => ({ id: d.id, ...d.data() } as Ensayo)))
    );
  }

  getEnsayo(ensayoId: string): Observable<Ensayo | null> {
    const finalId = ensayoId === 'm1' ? 'm1-2024' : ensayoId;
    return from(getDoc(doc(this.firestore, 'ensayos', finalId))).pipe(
      map(snap => snap.exists() ? { id: snap.id, ...snap.data() } as Ensayo : null)
    );
  }

  getPreguntas(ensayoId: string): Observable<Pregunta[]> {
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
    const targetId = (id === 'm1' || id === 'm1-2024') ? 'm1-2024' : id;
    if (targetId === 'm1-2024') return m1QuestionsData as any || [];
    if (id === 'm1-invierno-2024') return m1InviernoQuestionsData as any || [];
    return [];
  }
}
