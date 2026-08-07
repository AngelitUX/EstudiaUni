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
  subscription?: {
    tier: 'free' | 'premium';
    status: string;
    startDate: any;
    endDate: any;
  };
  notificationsEnabled?: boolean;
  emailVerified?: boolean;
  theme?: 'auto' | 'dark' | 'light';
  notificationIntensity?: 'baja' | 'normal' | 'alta';
  preferredStudyTime?: 'manana' | 'tarde' | 'noche' | 'ninguno';
  bio?: string;
  profileEmoji?: string;
  studyGoalMinutesPerDay?: number;
  hasSeenTutorial?: boolean;
  selectedSubjects?: string[];
  dyslexiaFont?: boolean;
  highContrast?: boolean;
  fontSize?: 'normal' | 'large' | 'xlarge';
  textSpacing?: 'normal' | 'wide' | 'xwide';
  linkedinUrl?: string;
  school?: string;
  favoriteCareers?: any[];
  targetScore?: number;
  targetCareer?: string;
  targetUniversity?: string;
  /** Materias excluidas del promedio Meta PAES (ids de subject en paesRecords) */
  metaPaesExcludedSubjects?: string[];
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
    // Clear cached profile observable when auth status resets
    authState(this.auth).subscribe(user => {
      if (!user) {
        this.cachedProfile$ = null;
        this.profileSignal.set(null);
      }
    });
  }

  private normalizeProfile(data: any): UserProfile | null {
    if (!data) return null;
    
    let isExpired = false;
    if (data.subscription?.endDate) {
      let end: Date;
      if (typeof data.subscription.endDate.toDate === 'function') {
        end = data.subscription.endDate.toDate();
      } else {
        end = new Date(data.subscription.endDate);
      }
      if (end < new Date()) {
        isExpired = true;
      }
    }

    const plan = isExpired 
      ? 'free' 
      : (data.plan || (data.subscription?.tier === 'premium' ? 'premium' : 'free'));

    return {
      ...data,
      plan
    } as UserProfile;
  }

  getUserProfile(forceRefresh = false, uid?: string): Observable<UserProfile | null> {
    if (uid) {
      const docRef = doc(this.firestore, 'users', uid);
      return from(getDoc(docRef)).pipe(
        map(snap => snap.exists() ? this.normalizeProfile({ uid, ...snap.data() }) : null)
      );
    }

    if (this.cachedProfile$ && !forceRefresh) {
      return this.cachedProfile$;
    }

    this.cachedProfile$ = authState(this.auth).pipe(
      switchMap((user) => {
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
            const p = snap.exists() ? this.normalizeProfile({ uid: user.uid, ...snap.data() }) : null;
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

    this.cachedProfile$ = null;

    // Update local profile signal immediately to avoid redundant fetches
    const current = this.profileSignal();
    if (current && current.uid === user.uid) {
      this.profileSignal.set({ ...current, ...data });
    }
  }

  async markTutorialAsSeen(uid: string): Promise<void> {
    try {
      await setDoc(doc(this.firestore, 'users', uid), { hasSeenTutorial: true }, { merge: true });
      const current = this.profileSignal();
      if (current && current.uid === uid) {
        this.profileSignal.set({ ...current, hasSeenTutorial: true });
      }
    } catch (e) {
      console.error('Error marking tutorial as seen:', e);
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

      
      // 1. Copiar documento de perfil
      const oldDocRef = doc(this.firestore, 'users', oldUid);
      const newDocRef = doc(this.firestore, 'users', newUid);
      const oldSnap = await getDoc(oldDocRef);
      
      if (oldSnap.exists()) {
        const oldData = oldSnap.data();

        // Preservar uid del nuevo usuario y actualizar en Firestore
        await setDoc(newDocRef, { ...oldData, uid: newUid }, { merge: true });
        
        // Eliminar documento antiguo de perfil para evitar futuras duplicaciones o re-migraciones
        await deleteDoc(oldDocRef);

      } else {
        console.warn('[Migration] Old profile document did not exist.');
      }
      
      // 2. Migrar intentos de ensayos (cambiar odId de oldUid a newUid)
      const intentosRef = collection(this.firestore, 'intentos');
      const qIntentos = query(intentosRef, where('odId', '==', oldUid));
      const intentosSnap = await getDocs(qIntentos);

      for (const docSnap of intentosSnap.docs) {
        await updateDoc(doc(this.firestore, 'intentos', docSnap.id), { odId: newUid });
      }

      
      // 3. Migrar actividades (copiar subcolección)
      const oldActRef = collection(this.firestore, `users/${oldUid}/actividad`);
      const newActRef = collection(this.firestore, `users/${newUid}/actividad`);
      const actSnap = await getDocs(oldActRef);

      for (const docSnap of actSnap.docs) {
        await setDoc(doc(newActRef, docSnap.id), docSnap.data());
        // Eliminar actividad antigua
        await deleteDoc(doc(oldActRef, docSnap.id));
      }

      
    } catch (error) {
      console.error('[Migration] Critical error migrating user data:', error);
    }
  }

  async updateProfileSettings(settings: any): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) return;
    await updateDoc(doc(this.firestore, 'users', user.uid), settings);

    this.cachedProfile$ = null;

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

    this.cachedProfile$ = null;

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
    const finalId = this.normalizeEnsayoId(ensayoId);
    return from(getDoc(doc(this.firestore, 'ensayos', finalId))).pipe(
      map(snap => snap.exists() ? { id: snap.id, ...snap.data() } as Ensayo : null),
      catchError(() => of(null))
    );
  }

  getPreguntas(ensayoId: string): Observable<Pregunta[]> {
    const finalId = this.normalizeEnsayoId(ensayoId);
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
    const idx = answers.findIndex((a: { preguntaId: string }) => a.preguntaId === preguntaId);
    if (idx >= 0) answers[idx] = { preguntaId, selectedAnswer, isCorrect };
    else answers.push({ preguntaId, selectedAnswer, isCorrect });
    await updateDoc(ref, { answers });
  }

  async finishIntento(intentoId: string, timeSpent: number, totalQuestions: number): Promise<number> {
    const ref = doc(this.firestore, 'intentos', intentoId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return 0;
    const correct = snap.data()['answers'].filter((a: { isCorrect: boolean }) => a.isCorrect).length;
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

  async getNews(): Promise<any[]> {
    try {
      const newsRef = collection(this.firestore, 'news');
      const q = query(newsRef, orderBy('date', 'desc'));
      const snap = await getDocs(q);
      if (snap.empty) {
        await this.seedNews();
        const newSnap = await getDocs(q);
        return newSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  }

  async seedNews(): Promise<void> {
    const defaultNews = [
      {
        title: 'Inscripción PAES 2026: DEMRE lanza dura advertencia por cambio clave',
        source: 'El Mostrador',
        date: '2026-05-19',
        dateText: '19 de mayo, 2026',
        excerpt: 'El DEMRE advirtió sobre la importancia del cambio de clave del usuario en el portal de inscripción, ya que olvidar o errar en este paso podría dejar a los postulantes fuera del proceso regular.',
        gradient: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
        icon: '⚠️',
        tag: '¡Advertencia!',
        linkUrl: 'https://www.elmostrador.cl/datos-utiles/2026/05/19/inscripcion-paes-2026-demre-lanza-dura-advertencia-por-cambio-clave-que-podria-dejarte-fuera/',
        imageUrl: 'assets/img/seccion noticias/noticia1.jpeg'
      },
      {
        title: 'Comenzó el periodo de inscripción a la PAES de invierno 2026',
        source: 'Ministerio de Educación',
        date: '2026-03-04',
        dateText: '4 de marzo, 2026',
        excerpt: 'Hasta el martes 17 de marzo a las 13:00 horas, las y los egresados de enseñanza media podrán inscribirse para rendir la prueba de invierno los días 15, 16 y 17 de junio.',
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        icon: '❄️',
        tag: 'PAES Invierno',
        linkUrl: 'https://www.mineduc.cl/comenzo-el-periodo-de-inscripcion-a-la-paes-de-invierno-2026-admision-2027/',
        imageUrl: 'assets/img/seccion noticias/noticia2.jpg'
      },
      {
        title: 'PAES Invierno 2026: cuándo es y cómo hacer la inscripción',
        source: 'Iplacex',
        date: '2026-03-05',
        dateText: '5 de marzo, 2026',
        excerpt: 'La PAES de invierno ya tiene fechas confirmadas. Revisa cuándo es, cómo funciona el proceso de inscripción y los requisitos obligatorios para rendirla con éxito.',
        gradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
        icon: '📝',
        tag: 'Guía Práctica',
        linkUrl: 'https://www.iplacex.cl/blogs/paes-invierno-2026-cuando-es-y-como-hacer-la-inscripcion/',
        imageUrl: 'assets/img/seccion noticias/noticia3.webp'
      }
    ];

    for (const item of defaultNews) {
      const id = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await setDoc(doc(this.firestore, 'news', id), item);
    }
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

  /** Normalize exam ID variants to canonical DB IDs */
  private normalizeEnsayoId(id: string): string {
    if (id === 'm1' || id === 'm1-2024') return 'm1-2024';
    if (id === 'm1-invierno' || id === 'm1-invierno-2024') return 'm1-invierno-2024';
    return id;
  }

  private getMockPreguntas(id: string): Pregunta[] {
    const normalized = this.normalizeEnsayoId(id);
    if (normalized === 'm1-2024') return m1QuestionsData as any || [];
    if (normalized === 'm1-invierno-2024') return m1InviernoQuestionsData as any || [];
    return [];
  }

  async cancelSubscription(): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No auth');
    const docRef = doc(this.firestore, 'users', user.uid);
    await updateDoc(docRef, {
      'subscription.status': 'cancelled'
    });
    this.cachedProfile$ = null;
    const current = this.profileSignal();
    if (current?.subscription) {
      this.profileSignal.set({
        ...current,
        subscription: { ...current.subscription, status: 'cancelled' }
      });
    }
  }

  async submitBugReport(report: any): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No auth');
    
    await addDoc(collection(this.firestore, 'bug_reports'), {
      ...report,
      uid: user.uid,
      status: 'Pendiente',
      timestamp: Timestamp.now()
    });
  }
}

