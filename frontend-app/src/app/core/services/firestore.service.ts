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
  Timestamp,
  runTransaction
} from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { from, map, Observable, of, catchError, switchMap, shareReplay } from 'rxjs';

// @ts-ignore
import m1QuestionsData from '../../../assets/m1-preguntas-db.json';
// @ts-ignore
import m1InviernoQuestionsData from '../../../assets/m1-invierno-preguntas-db.json';
import { environment } from '../../../environments/environment';
import { readSessionCache, writeSessionCache } from '../utils/session-cache';

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
    provider?: 'flow' | 'manual' | 'transfer';
    planType?: 'monthly' | 'yearly';
    cancelAtPeriodEnd?: boolean;
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
  lastSimulationFinishedAt?: any;
  dailyCredits?: {
    ensayosUsedToday?: number;
    quizzesUsedToday?: number;
    focoTokensUsedToday?: number;
    lastResetDate?: string;
  };
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

  /** Vigencia de la caché del catálogo de ensayos. Lo edita un admin y cambia poco. */
  private static readonly ENSAYOS_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hora
  private static readonly ENSAYOS_CACHE_KEY = 'ensayos_catalogo_cache';

  /**
   * Catálogo de ensayos activos.
   *
   * Antes releía la colección entera CADA vez que se abría la pantalla de
   * Ensayos: con ~30 ensayos, un alumno que entra y sale tres veces gastaba 90
   * lecturas para ver siempre lo mismo. Ahora se cachea en sessionStorage.
   */
  getEnsayos(subjectFilter?: string): Observable<Ensayo[]> {
    const cached = this.readSessionCache<Ensayo[]>(
      FirestoreService.ENSAYOS_CACHE_KEY,
      FirestoreService.ENSAYOS_CACHE_TTL_MS,
    );
    if (cached && cached.length > 0) return of(cached);

    const q = query(collection(this.firestore, 'ensayos'), where('isActive', '==', true));
    return from(getDocs(q)).pipe(
      map(snap => {
        const lista = snap.docs.map(d => ({ id: d.id, ...d.data() } as Ensayo));
        if (lista.length > 0) {
          this.writeSessionCache(FirestoreService.ENSAYOS_CACHE_KEY, lista);
        }
        return lista;
      })
    );
  }

  getEnsayo(ensayoId: string): Observable<Ensayo | null> {
    const finalId = this.normalizeEnsayoId(ensayoId);
    return from(getDoc(doc(this.firestore, 'ensayos', finalId))).pipe(
      map(snap => snap.exists() ? { id: snap.id, ...snap.data() } as Ensayo : null),
      catchError(() => of(null))
    );
  }

  private preguntasCache = new Map<string, Pregunta[]>();
  private intentoCache = new Map<string, Intento>();
  public devBypassResultsLock = false;

  async devSimulateTimePass(): Promise<void> {
    if (environment.production) return; // Never allow bypassing limits in production
    this.devBypassResultsLock = true;
    localStorage.removeItem('estudiauni_last_simulation_finished');
    const pastDate = new Date(Date.now() - 50 * 3600 * 1000);

    const profile = this.profileSignal();
    if (profile) {
      this.profileSignal.set({
        ...profile,
        lastSimulationFinishedAt: pastDate
      });
    }

    const user = this.auth.currentUser;
    if (user) {
      try {
        await updateDoc(doc(this.firestore, 'users', user.uid), {
          lastSimulationFinishedAt: Timestamp.fromDate(pastDate)
        });
      } catch (e) {}
    }
  }

  getPreguntas(ensayoId: string): Observable<Pregunta[]> {
    const finalId = this.normalizeEnsayoId(ensayoId);
    if (this.preguntasCache.has(finalId)) {
      return of(this.preguntasCache.get(finalId)!);
    }
    const q = query(collection(this.firestore, 'preguntas'), where('ensayoId', '==', finalId));
    return from(getDocs(q)).pipe(
      map(snap => {
        if (snap.empty) return this.getMockPreguntas(finalId);
        const results = snap.docs.map(d => ({ id: d.id, ...d.data() } as Pregunta));
        const sorted = results.sort((a, b) => (a.order || 0) - (b.order || 0));
        this.preguntasCache.set(finalId, sorted);
        return sorted;
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

  getIntento(intentoId: string, forceRefresh = false): Observable<Intento | null> {
    if (!forceRefresh && this.intentoCache.has(intentoId)) {
      const cached = this.intentoCache.get(intentoId)!;
      if (cached.status !== 'in_progress') {
        return of(cached);
      }
    }
    return from(getDoc(doc(this.firestore, 'intentos', intentoId))).pipe(
      map(snap => {
        if (!snap.exists()) return null;
        const data = { id: snap.id, ...snap.data() } as Intento;
        this.intentoCache.set(intentoId, data);
        return data;
      })
    );
  }

  async getLatestCompletedIntento(uid: string): Promise<any | null> {
    try {
      const q = query(
        collection(this.firestore, 'intentos'),
        where('odId', '==', uid),
        where('status', '==', 'completed'),
        limit(10)
      );
      const snap = await getDocs(q);
      if (snap.empty) return null;
      // Return the one with highest finishedAt / startedAt timestamp
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      docs.sort((a: any, b: any) => {
        const tA = (a.finishedAt?.toDate ? a.finishedAt.toDate() : new Date(a.finishedAt || 0)).getTime();
        const tB = (b.finishedAt?.toDate ? b.finishedAt.toDate() : new Date(b.finishedAt || 0)).getTime();
        return tB - tA;
      });
      return docs[0];
    } catch (e) {
      return null;
    }
  }

  // ─── Guardado de respuestas agrupado ───
  //
  // Antes cada respuesta disparaba su propia transacción: un ensayo de 70
  // preguntas costaba 70 lecturas + 70 escrituras. Con 200 alumnos rindiendo un
  // ensayo al día eso son 14.000 escrituras, el 70% de la cuota diaria gratuita
  // de Firestore solo en esto.
  //
  // Ahora las respuestas se acumulan y se vuelcan juntas cada pocos segundos en
  // UNA sola transacción. Estas escrituras intermedias solo sirven de red de
  // seguridad ante una caída del navegador: al entregar, finishIntento()
  // reconstruye el array completo desde el estado local del componente. Lo único
  // que se arriesga es lo respondido en los últimos segundos antes de un cierre
  // abrupto, a cambio de dividir el coste de escritura por ~5.
  private static readonly ANSWER_FLUSH_DELAY_MS = 4000;
  private pendingAnswers = new Map<string, Map<string, { preguntaId: string; selectedAnswer: string; isCorrect: boolean }>>();
  private flushTimers = new Map<string, any>();

  /**
   * Vuelca a Firestore todas las respuestas pendientes de un intento en una
   * sola transacción. Es idempotente y no lanza.
   */
  async flushPendingAnswers(intentoId: string): Promise<void> {
    const timer = this.flushTimers.get(intentoId);
    if (timer) {
      clearTimeout(timer);
      this.flushTimers.delete(intentoId);
    }

    const pendientes = this.pendingAnswers.get(intentoId);
    if (!pendientes || pendientes.size === 0) return;

    // Se vacía ANTES de escribir: si la escritura falla, no reintentamos en
    // bucle (finishIntento reconstruye igualmente el array al entregar).
    const lote = [...pendientes.values()];
    this.pendingAnswers.delete(intentoId);

    const ref = doc(this.firestore, 'intentos', intentoId);
    try {
      await runTransaction(this.firestore, async (transaction) => {
        const snap = await transaction.get(ref);
        if (!snap.exists()) return;
        const answers = [...(snap.data()['answers'] || [])];
        for (const item of lote) {
          const idx = answers.findIndex((a: { preguntaId: string }) => a.preguntaId === item.preguntaId);
          if (idx >= 0) answers[idx] = item;
          else answers.push(item);
        }
        transaction.update(ref, { answers });
      });
    } catch {
      // Mismo criterio que antes: un fallo transitorio aquí no es fatal.
    }
  }

  /**
   * Registra una respuesta y programa el volcado. No escribe de inmediato:
   * ver la nota de arriba sobre el coste.
   */
  saveAnswer(intentoId: string, preguntaId: string, selectedAnswer: string, isCorrect: boolean): void {
    if (!this.pendingAnswers.has(intentoId)) {
      this.pendingAnswers.set(intentoId, new Map());
    }
    // El Map por preguntaId colapsa los cambios de opinión: si el alumno cambia
    // tres veces su respuesta antes del volcado, solo se escribe la última.
    this.pendingAnswers.get(intentoId)!.set(preguntaId, { preguntaId, selectedAnswer, isCorrect });

    if (this.flushTimers.has(intentoId)) return; // ya hay un volcado programado
    const timer = setTimeout(() => {
      void this.flushPendingAnswers(intentoId);
    }, FirestoreService.ANSWER_FLUSH_DELAY_MS);
    this.flushTimers.set(intentoId, timer);
  }

  /** @deprecated Implementación anterior: una transacción por respuesta. */
  private async saveAnswerImmediate(intentoId: string, preguntaId: string, selectedAnswer: string, isCorrect: boolean): Promise<void> {
    // Runs as a transaction on purpose: selectOption() in the exam runner
    // fires this without awaiting it, so answering two questions in quick
    // succession can easily have both calls' getDoc() read the same
    // pre-update snapshot. With a plain get+update, whichever write lands
    // last would silently overwrite the other's answer, losing it from the
    // "answers" array entirely. A transaction re-reads on conflict instead
    // of blindly overwriting, so no answer gets dropped.
    const ref = doc(this.firestore, 'intentos', intentoId);
    try {
      await runTransaction(this.firestore, async (transaction) => {
        const snap = await transaction.get(ref);
        if (!snap.exists()) return;
        const answers = [...(snap.data()['answers'] || [])];
        const idx = answers.findIndex((a: { preguntaId: string }) => a.preguntaId === preguntaId);
        if (idx >= 0) answers[idx] = { preguntaId, selectedAnswer, isCorrect };
        else answers.push({ preguntaId, selectedAnswer, isCorrect });
        transaction.update(ref, { answers });
      });
    } catch {
      // Silenced to match prior behavior — finishIntento() rebuilds the full
      // answers array from local component state at submit time regardless,
      // so a transient failure here isn't fatal to the final result.
    }
  }

  async finishIntento(
    intentoId: string,
    timeSpent: number,
    totalQuestions: number,
    finalAnswers: { [preguntaId: string]: string } = {},
    questionsList: any[] = []
  ): Promise<number> {
    // Volcar lo pendiente antes de leer, para no perder respuestas recientes
    // si esta entrega no trae questionsList (en ese caso se usa lo que haya
    // guardado en el documento).
    await this.flushPendingAnswers(intentoId);
    const ref = doc(this.firestore, 'intentos', intentoId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return 0;
    const existingData = snap.data();
    const user = this.auth.currentUser;
    const isPro = this.profileSignal()?.plan === 'premium';
    const finishedAt = Timestamp.now();
    const finishedDate = new Date();
    const resultsAvailableAt = isPro
      ? finishedAt
      : Timestamp.fromDate(new Date(finishedDate.getTime() + 3 * 3600 * 1000));

    let answersList: any[] = existingData['answers'] || [];

    if (questionsList.length > 0) {
      answersList = questionsList.map(q => {
        const userSel = finalAnswers[q.id] || null;
        const correctKey = q.correctAnswer || 'A';
        const isCorr = userSel ? (userSel === correctKey) : false;
        return {
          preguntaId: q.id,
          selectedAnswer: userSel,
          correctAnswer: correctKey,
          isCorrect: isCorr,
          stem: q.stem || q.text || '',
          options: q.options || [],
          explanation: q.explanation || null
        };
      });
    } else if (Object.keys(finalAnswers).length > 0) {
      Object.keys(finalAnswers).forEach(pId => {
        const sel = finalAnswers[pId];
        const idx = answersList.findIndex((a: any) => a.preguntaId === pId);
        if (idx >= 0) {
          answersList[idx].selectedAnswer = sel;
        } else {
          answersList.push({ preguntaId: pId, selectedAnswer: sel, isCorrect: false });
        }
      });
    }

    const correctCount = answersList.filter((a: any) => a.isCorrect === true).length;
    const score = Math.round(100 + (correctCount / Math.max(totalQuestions, 1)) * 900);

    const updatePayload = {
      status: 'completed',
      finishedAt,
      resultsAvailableAt,
      resultsLocked: !isPro,
      answers: answersList,
      score
    };

    await updateDoc(ref, updatePayload);

    this.intentoCache.set(intentoId, {
      id: intentoId,
      ...existingData,
      ...updatePayload
    } as unknown as Intento);

    if (!isPro && user) {
      try {
        localStorage.setItem('estudiauni_last_simulation_finished', finishedDate.getTime().toString());
        await updateDoc(doc(this.firestore, 'users', user.uid), {
          lastSimulationFinishedAt: finishedAt
        });
        const currentProfile = this.profileSignal();
        if (currentProfile) {
          this.profileSignal.set({
            ...currentProfile,
            lastSimulationFinishedAt: finishedAt
          });
        }
      } catch (e) {}
    }

    return score;
  }

  /**
   * Mark an in-progress "Ensayo Real" attempt as abandoned when the user exits early.
   * Starts the 48h cooldown for Free tier, same as a normal finish, so users can't
   * bypass the limit by quitting before submitting.
   */
  async abandonIntento(intentoId: string): Promise<void> {
    // Al salir del ensayo conservamos lo respondido hasta ahora.
    await this.flushPendingAnswers(intentoId);
    const user = this.auth.currentUser;
    if (!user) return;

    const ref = doc(this.firestore, 'intentos', intentoId);
    const isPro = this.profileSignal()?.plan === 'premium';
    const finishedAt = Timestamp.now();

    try {
      const snap = await getDoc(ref);
      if (!snap.exists()) return;
      const data = snap.data();
      if (data['status'] !== 'in_progress') return; // already finished/abandoned

      await updateDoc(ref, {
        status: 'abandoned',
        finishedAt,
      });

      if (!isPro) {
        localStorage.setItem('estudiauni_last_simulation_finished', Date.now().toString());
        await updateDoc(doc(this.firestore, 'users', user.uid), {
          lastSimulationFinishedAt: finishedAt
        });
        const currentProfile = this.profileSignal();
        if (currentProfile) {
          this.profileSignal.set({
            ...currentProfile,
            lastSimulationFinishedAt: finishedAt
          });
        }
      }
    } catch (e) {
      console.error('Error abandoning intento:', e);
    }
  }

  async saveActivity(uid: string, entry: any): Promise<void> {
    await addDoc(collection(this.firestore, `users/${uid}/actividad`), { ...entry, timestamp: Timestamp.now() });
  }

  async getUserActivities(uid: string, limitCount: number = 10): Promise<any[]> {
    const q = query(collection(this.firestore, `users/${uid}/actividad`), orderBy('timestamp', 'desc'), limit(limitCount));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  private readonly newsCacheKey = 'estudiauni_news_cache_v1';
  private readonly newsCacheTtlMs = 10 * 60 * 1000; // 10 min

  /**
   * Reads the public news feed. This is the highest-traffic query in the app (it runs for
   * every anonymous visitor on the landing page), so results are cached in sessionStorage
   * for a few minutes to avoid a fresh Firestore read on every page load under load.
   */
  async getNews(): Promise<any[]> {
    const cached = this.readSessionCache<any[]>(this.newsCacheKey, this.newsCacheTtlMs);
    if (cached) return cached;

    try {
      const newsRef = collection(this.firestore, 'news');
      const q = query(newsRef, orderBy('date', 'desc'));
      const snap = await getDocs(q);
      const news = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      this.writeSessionCache(this.newsCacheKey, news);
      return news;
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  }

  // Delegan en core/utils/session-cache.ts, que es donde vive la logica y
  // donde estan sus tests (aqui no se puede instanciar el servicio en un test
  // sin arrastrar todo AngularFire).
  private readSessionCache<T>(key: string, ttlMs: number): T | null {
    return readSessionCache<T>(key, ttlMs);
  }

  private writeSessionCache(key: string, data: unknown): void {
    writeSessionCache(key, data);
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
        imageUrl: 'assets/imagesHome/seccion noticias/noticia1.jpeg'
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
        imageUrl: 'assets/imagesHome/seccion noticias/noticia2.jpg'
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
        imageUrl: 'assets/imagesHome/seccion noticias/noticia3.webp'
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

