import { Injectable, inject, signal, computed } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, writeBatch } from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { PoolPregunta, MateriaId } from '../../learning-path/models/paes.models';
import { PaesContentService } from '../../learning-path/services/paes-content.service';
import { FirestoreService } from '../../../core/services/firestore.service';

/** Una noticia del carrusel del home (colección `news`). Los campos coinciden
 *  con lo que renderiza home.component.ts y con lo que siembra seedNews(). */
export interface NewsItem {
  id?: string;
  title: string;
  excerpt: string;
  source: string;
  date: string;      // ISO 'YYYY-MM-DD' — se usa para ordenar (orderBy('date','desc'))
  dateText: string;  // texto legible, ej. "19 de mayo, 2026"
  linkUrl: string;
  imageUrl: string;
  gradient: string;  // CSS gradient para el overlay de la portada
  tag: string;       // texto del badge, ej. "¡Advertencia!"
}

// Firestore permite hasta 500 escrituras por batch; nos quedamos por debajo
// del límite para dejar margen a otras operaciones concurrentes.
const BULK_IMPORT_CHUNK_SIZE = 400;

@Injectable({ providedIn: 'root' })
export class AdminService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private paesContent = inject(PaesContentService);
  private firestoreService = inject(FirestoreService);

  // ─── Admin role ───
  private _isAdmin = signal<boolean | null>(null); // null = not checked yet
  readonly isAdmin = this._isAdmin.asReadonly();
  readonly isAdminChecked = computed(() => this._isAdmin() !== null);

  // ─── Pool state ───
  private _preguntas = signal<PoolPregunta[]>([]);
  private _loading = signal(false);
  private _filterMateria = signal<MateriaId | 'all'>('all');

  readonly preguntas = computed(() => {
    const filter = this._filterMateria();
    const all = this._preguntas();
    if (filter === 'all') return all;
    return all.filter(p => p.materiaId === filter);
  });
  readonly loading = this._loading.asReadonly();
  readonly filterMateria = this._filterMateria.asReadonly();
  readonly allPreguntas = this._preguntas.asReadonly();
  readonly totalPreguntas = computed(() => this._preguntas().length);

  readonly materiasDisponibles: { id: MateriaId; label: string; icon: string }[] = [
    { id: 'competencia-lectora', label: 'Competencia Lectora', icon: '📖' },
    { id: 'matematicas-m1', label: 'Matemáticas M1', icon: '🔢' },
    { id: 'matematicas-m2', label: 'Matemáticas M2', icon: '📐' },
    { id: 'ciencias-biologia', label: 'Biología', icon: '🧬' },
    { id: 'ciencias-fisica', label: 'Física', icon: '⚛️' },
    { id: 'ciencias-quimica', label: 'Química', icon: '🧪' },
    { id: 'ciencias-tp', label: 'Ciencias Técnico Profesional', icon: '🛠️' },
    { id: 'historia', label: 'Historia y Ciencias Sociales', icon: '🏛️' },
  ];

  // Fuente única de temas válidos por materia. Tanto el editor individual
  // como el importador masivo de JSON validan contra este mismo mapa, para
  // que los temas que aparecen en el selector de Mini Ensayos sean siempre
  // consistentes sin importar por qué vía se creó la pregunta.
  readonly temasPorMateria: Record<MateriaId, string[]> = {
    'matematicas-m1': ['Números', 'Álgebra y Funciones', 'Geometría', 'Probabilidad y Estadística'],
    'matematicas-m2': ['Números', 'Álgebra y Funciones', 'Geometría', 'Probabilidad y Estadística'],
    'competencia-lectora': ['Rastrear y localizar', 'Relacionar e interpretar', 'Evaluar y reflexionar'],
    'ciencias-biologia': ['Organización, estructura y actividad celular', 'Procesos y funciones biológicas', 'Herencia y evolución', 'Organismo y ambiente'],
    'ciencias-fisica': ['Mecánica', 'Ondas', 'Energía', 'Electricidad y magnetismo'],
    'ciencias-quimica': ['Estructura atómica y enlaces', 'Química orgánica', 'Reacciones químicas y estequiometría'],
    'ciencias-tp': ['Biología TP', 'Física TP', 'Química TP'],
    'historia': ['Mundo, América y Chile', 'Formación Ciudadana', 'Economía y Sociedad']
  };

  getTemasForMateria(materiaId: MateriaId): string[] {
    return this.temasPorMateria[materiaId] || [];
  }

  constructor() {
    // Auto-check admin status when auth state changes
    authState(this.auth).subscribe(user => {
      if (user) {
        this.checkAdminRole(user.uid);
      } else {
        this._isAdmin.set(false);
      }
    });
  }

  // ─── Admin Check ───
  async checkAdminRole(uid: string): Promise<boolean> {
    try {
      const adminDoc = await getDoc(doc(this.firestore, 'admins', uid));
      const result = adminDoc.exists();
      this._isAdmin.set(result);
      return result;
    } catch (error) {
      console.error('Error checking admin role:', error);
      this._isAdmin.set(false);
      return false;
    }
  }

  // ─── Filter ───
  setFilter(materia: MateriaId | 'all') {
    this._filterMateria.set(materia);
  }

  // ─── CRUD Operations ───

  async loadPreguntas(): Promise<void> {
    this._loading.set(true);
    try {
      // Sin orderBy('createdAt') a propósito: Firestore excluye de un orderBy
      // cualquier doc sin ese campo, y buena parte del pool (sobre todo física,
      // sembrada por scripts de backend en vez de este panel) nunca lo tuvo —
      // esas preguntas desaparecían por completo de la lista aunque existieran
      // en Firestore. Se ordena en memoria, con las que no tienen createdAt al final.
      const snap = await getDocs(collection(this.firestore, 'pool_preguntas'));
      const preguntas = snap.docs.map(d => ({ ...d.data(), id: d.id } as PoolPregunta));
      preguntas.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      this._preguntas.set(preguntas);
    } catch (error) {
      console.error('Error loading pool_preguntas:', error);
    } finally {
      this._loading.set(false);
    }
  }

  async getPreguntaById(id: string): Promise<PoolPregunta | null> {
    try {
      const snap = await getDoc(doc(this.firestore, 'pool_preguntas', id));
      if (snap.exists()) {
        return { ...snap.data(), id: snap.id } as PoolPregunta;
      }
      return null;
    } catch (error) {
      console.error('Error getting pregunta:', error);
      return null;
    }
  }

  async createPregunta(pregunta: Omit<PoolPregunta, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>): Promise<string> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    const now = new Date().toISOString();
    const data = {
      ...pregunta,
      createdAt: now,
      updatedAt: now,
      createdBy: user.uid,
    };

    const docRef = await addDoc(collection(this.firestore, 'pool_preguntas'), data);

    // Invalidate PaesContentService's pool_preguntas cache so el propio admin vea el cambio de inmediato
    this.paesContent.clearPoolPreguntasCache();

    // Update local state
    this._preguntas.update(list => [{ ...data, id: docRef.id } as PoolPregunta, ...list]);
    
    return docRef.id;
  }

  /**
   * Crea muchas preguntas de una vez usando writeBatch (chunks de hasta
   * BULK_IMPORT_CHUNK_SIZE). Cada chunk se confirma atómicamente: si un
   * chunk falla, todos los anteriores ya quedaron guardados y el chunk que
   * falló (junto con los que venían después) no se intenta — por eso el
   * resultado reporta hasta qué índice se guardó, en vez de fallar todo o
   * nada para una importación de cientos de preguntas.
   */
  async createPreguntasBulk(
    preguntas: Omit<PoolPregunta, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>[],
    onProgress?: (savedCount: number, total: number) => void,
  ): Promise<{ savedCount: number; failedFromIndex: number | null; error?: string }> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    const now = new Date().toISOString();
    const created: PoolPregunta[] = [];
    let savedCount = 0;

    for (let start = 0; start < preguntas.length; start += BULK_IMPORT_CHUNK_SIZE) {
      const chunk = preguntas.slice(start, start + BULK_IMPORT_CHUNK_SIZE);
      const batch = writeBatch(this.firestore);
      const chunkDocs: PoolPregunta[] = [];

      for (const pregunta of chunk) {
        const ref = doc(collection(this.firestore, 'pool_preguntas'));
        const data = { ...pregunta, createdAt: now, updatedAt: now, createdBy: user.uid };
        batch.set(ref, data);
        chunkDocs.push({ ...data, id: ref.id } as PoolPregunta);
      }

      try {
        await batch.commit();
        created.push(...chunkDocs);
        savedCount += chunk.length;
        onProgress?.(savedCount, preguntas.length);
      } catch (error: any) {
        // Este chunk no se guardó; los anteriores sí. Persistimos igualmente
        // el estado local/caché de lo que sí se guardó antes de reportar.
        if (created.length > 0) {
          this.paesContent.clearPoolPreguntasCache();
          this._preguntas.update(list => [...created, ...list]);
        }
        return { savedCount, failedFromIndex: start, error: error.message };
      }
    }

    if (created.length > 0) {
      this.paesContent.clearPoolPreguntasCache();
      this._preguntas.update(list => [...created, ...list]);
    }

    return { savedCount, failedFromIndex: null };
  }

  async updatePregunta(id: string, changes: Partial<PoolPregunta>): Promise<void> {
    const data = {
      ...changes,
      updatedAt: new Date().toISOString(),
    };
    // Remove 'id' from update data
    delete (data as any).id;

    await updateDoc(doc(this.firestore, 'pool_preguntas', id), data);

    // Invalidate PaesContentService's pool_preguntas cache so el propio admin vea el cambio de inmediato
    this.paesContent.clearPoolPreguntasCache();

    // Update local state
    this._preguntas.update(list =>
      list.map(p => (p.id === id ? { ...p, ...data } as PoolPregunta : p))
    );
  }

  async deletePregunta(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, 'pool_preguntas', id));

    // Invalidate PaesContentService's pool_preguntas cache so el propio admin vea el cambio de inmediato
    this.paesContent.clearPoolPreguntasCache();

    this._preguntas.update(list => list.filter(p => p.id !== id));
  }

  /**
   * Elimina muchas preguntas de una vez usando writeBatch (mismo patrón de chunking
   * que createPreguntasBulk). Cada chunk se confirma atómicamente: si uno falla, los
   * anteriores ya quedaron borrados, así que el resultado reporta cuántas se
   * alcanzaron a eliminar en vez de fallar todo o nada para un borrado de cientos.
   */
  async deletePreguntasBulk(
    ids: string[],
    onProgress?: (deletedCount: number, total: number) => void,
  ): Promise<{ deletedCount: number; failedFromIndex: number | null; error?: string }> {
    let deletedCount = 0;
    const deletedIds: string[] = [];

    for (let start = 0; start < ids.length; start += BULK_IMPORT_CHUNK_SIZE) {
      const chunk = ids.slice(start, start + BULK_IMPORT_CHUNK_SIZE);
      const batch = writeBatch(this.firestore);
      for (const id of chunk) {
        batch.delete(doc(this.firestore, 'pool_preguntas', id));
      }

      try {
        await batch.commit();
        deletedIds.push(...chunk);
        deletedCount += chunk.length;
        onProgress?.(deletedCount, ids.length);
      } catch (error: any) {
        if (deletedIds.length > 0) {
          this.paesContent.clearPoolPreguntasCache();
          const deletedSet = new Set(deletedIds);
          this._preguntas.update(list => list.filter(p => !deletedSet.has(p.id)));
        }
        return { deletedCount, failedFromIndex: start, error: error.message };
      }
    }

    if (deletedIds.length > 0) {
      this.paesContent.clearPoolPreguntasCache();
      const deletedSet = new Set(deletedIds);
      this._preguntas.update(list => list.filter(p => !deletedSet.has(p.id)));
    }

    return { deletedCount, failedFromIndex: null };
  }

  getMateriaLabel(materiaId: string): string {
    return this.materiasDisponibles.find(m => m.id === materiaId)?.label || materiaId;
  }

  getMateriaIcon(materiaId: string): string {
    return this.materiasDisponibles.find(m => m.id === materiaId)?.icon || '📚';
  }

  async getBugReports(): Promise<any[]> {
    try {
      // limit(100): la colección crece sin techo (la crea cualquier usuario) y el
      // panel no necesita el historial completo — los últimos 100 sobran.
      const snap = await getDocs(
        query(collection(this.firestore, 'bug_reports'), orderBy('timestamp', 'desc'), limit(100))
      );
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (error) {
      console.error('Error fetching bug reports:', error);
      return [];
    }
  }

  async updateBugReportStatus(id: string, status: string): Promise<void> {
    await updateDoc(doc(this.firestore, 'bug_reports', id), { status });
  }

  async deleteBugReport(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, 'bug_reports', id));
  }

  // ─── Noticias del home (colección `news`) ───
  // El home las lee con FirestoreService.getNews() (cacheado 10 min + limit(20)).
  // Tras cada escritura se limpia ese cache para que el cambio se vea al instante.

  async getNews(): Promise<NewsItem[]> {
    try {
      const snap = await getDocs(
        query(collection(this.firestore, 'news'), orderBy('date', 'desc'), limit(100))
      );
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as NewsItem));
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  }

  async createNews(item: Omit<NewsItem, 'id'>): Promise<string> {
    const ref = await addDoc(collection(this.firestore, 'news'), item);
    this.firestoreService.clearNewsCache();
    return ref.id;
  }

  async updateNews(id: string, changes: Partial<NewsItem>): Promise<void> {
    const data = { ...changes };
    delete (data as any).id;
    await updateDoc(doc(this.firestore, 'news', id), data);
    this.firestoreService.clearNewsCache();
  }

  async deleteNews(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, 'news', id));
    this.firestoreService.clearNewsCache();
  }
}

