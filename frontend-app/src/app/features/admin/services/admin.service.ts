import { Injectable, inject, signal, computed } from '@angular/core';
import {
  Firestore, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, setDoc,
  query, where, orderBy, limit, writeBatch, startAfter, documentId, getCountFromServer,
  QueryConstraint, QueryDocumentSnapshot,
} from '@angular/fire/firestore';
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

  // ─── Pool de preguntas: paginación con cursor real en Firestore ───────────
  //
  // Antes `loadPreguntas()` hacía getDocs(collection('pool_preguntas')) y traía
  // TODA la colección (~1.150 docs = ~1.150 lecturas) en cada entrada al panel,
  // y el componente renderizaba las ~1.150 tarjetas de golpe. Ahora:
  //
  //  - Navegación normal  → query con orderBy(documentId()) + startAfter + limit(21).
  //                          Coste por página nueva: 21 lecturas. Ir "atrás" usa
  //                          la caché en memoria (0 lecturas).
  //  - Filtro de tema     → carga scoped where('materiaId','==',m) UNA vez
  //                          (~135–200 docs), se filtra por tema y se pagina en
  //                          cliente (evita el índice compuesto materiaId+tema).
  //  - Buscador           → carga completa UNA vez (cacheada toda la sesión) y se
  //                          filtra/pagina en cliente, para que "busque entre todas".
  //  - Contadores del stats-bar → getCountFromServer por materia (~1 lectura c/u).
  static readonly PAGE_SIZE = 20;

  private _pageItems = signal<PoolPregunta[]>([]);
  private _pageIndex = signal(0);
  private _hasNextPage = signal(false);
  private _pageLoading = signal(false);
  private _totalCount = signal(0);
  private _materiaCounts = signal<Record<string, number>>({});

  private _filterMateria = signal<MateriaId | 'all'>('all');
  private _filterTema = signal<string>('all');
  private _searchQuery = signal('');

  readonly pageItems = this._pageItems.asReadonly();
  readonly pageIndex = this._pageIndex.asReadonly();
  readonly hasNextPage = this._hasNextPage.asReadonly();
  readonly pageLoading = this._pageLoading.asReadonly();
  readonly totalCount = this._totalCount.asReadonly();
  readonly materiaCounts = this._materiaCounts.asReadonly();
  readonly filterMateria = this._filterMateria.asReadonly();
  readonly filterTema = this._filterTema.asReadonly();
  readonly searchQuery = this._searchQuery.asReadonly();

  // Caché en memoria (dura lo que dura la sesión del admin).
  private pageCache = new Map<number, PoolPregunta[]>();
  private hasNextByPage = new Map<number, boolean>();
  private lastSnapByPage = new Map<number, QueryDocumentSnapshot>();
  private searchCorpus: PoolPregunta[] | null = null;
  private materiaCorpus = new Map<string, PoolPregunta[]>();

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

  // ─── Filtros ───
  setMateriaFilter(materia: MateriaId | 'all') {
    if (this._filterMateria() === materia) return;
    this._filterMateria.set(materia);
    this._filterTema.set('all'); // los temas son específicos de cada materia
    this.resetPaging();
    void this.loadCurrentPage();
  }

  setTemaFilter(tema: string) {
    if (this._filterTema() === tema) return;
    this._filterTema.set(tema);
    this.resetPaging();
    void this.loadCurrentPage();
  }

  setSearch(query: string) {
    const q = query.trim();
    if (this._searchQuery() === q) return;
    this._searchQuery.set(q);
    this.resetPaging();
    void this.loadCurrentPage();
  }

  /** Compat: el filtro por materia vivía acá con este nombre. */
  setFilter(materia: MateriaId | 'all') {
    this.setMateriaFilter(materia);
  }

  // ─── Navegación de páginas ───
  nextPage() {
    if (!this._hasNextPage() || this._pageLoading()) return;
    this._pageIndex.update(i => i + 1);
    void this.loadCurrentPage();
  }

  prevPage() {
    if (this._pageIndex() === 0 || this._pageLoading()) return;
    this._pageIndex.update(i => i - 1);
    void this.loadCurrentPage();
  }

  private resetPaging() {
    this._pageIndex.set(0);
    this.pageCache.clear();
    this.hasNextByPage.clear();
    this.lastSnapByPage.clear();
  }

  private get mode(): 'cursor' | 'tema' | 'search' {
    if (this._searchQuery()) return 'search';
    if (this._filterTema() !== 'all') return 'tema';
    return 'cursor';
  }

  // ─── Carga inicial y refresco ───

  /** Reemplaza al viejo loadPreguntas(): lo llama el panel en ngOnInit. */
  async initPool(): Promise<void> {
    this._filterTema.set('all');
    this._searchQuery.set('');
    this.resetPaging();
    await this.refreshPool();
  }

  /** Invalida toda la caché en memoria y recarga página 0 + contadores. */
  async refreshPool(): Promise<void> {
    this.pageCache.clear();
    this.hasNextByPage.clear();
    this.lastSnapByPage.clear();
    this.searchCorpus = null;
    this.materiaCorpus.clear();
    this._pageIndex.set(0);
    await Promise.all([this.loadCurrentPage(), this.refreshCounts(), this.rebuildPoolMeta()]);
  }

  private async loadCurrentPage(): Promise<void> {
    const page = this._pageIndex();

    const cached = this.pageCache.get(page);
    if (cached) {
      this._pageItems.set(cached);
      this._hasNextPage.set(this.hasNextByPage.get(page) ?? false);
      return;
    }

    this._pageLoading.set(true);
    try {
      if (this.mode === 'cursor') {
        await this.loadCursorPage(page);
      } else if (this.mode === 'tema') {
        await this.loadTemaPage(page);
      } else {
        await this.loadSearchPage(page);
      }
    } catch (error) {
      console.error('[AdminService] Error cargando página del pool:', error);
      this._pageItems.set([]);
      this._hasNextPage.set(false);
    } finally {
      this._pageLoading.set(false);
    }
  }

  /** Navegación normal: cursor real en Firestore. */
  private async loadCursorPage(page: number): Promise<void> {
    const materia = this._filterMateria();
    const constraints: QueryConstraint[] = [];
    if (materia !== 'all') constraints.push(where('materiaId', '==', materia));
    // orderBy(documentId()) es estable y siempre existe. NOTA: el orden pasa a ser
    // "por ID" en vez de "más nuevas primero" — buena parte del banco no tiene
    // createdAt y un orderBy('createdAt') las excluiría de la query.
    constraints.push(orderBy(documentId()));

    if (page > 0) {
      const cursor = this.lastSnapByPage.get(page - 1);
      if (!cursor) {
        // Las páginas se cargan en orden, así que esto no debería pasar; si pasa,
        // volvemos a página 0 en vez de mostrar una lista rota.
        this._pageIndex.set(0);
        return this.loadCursorPage(0);
      }
      constraints.push(startAfter(cursor));
    }
    constraints.push(limit(AdminService.PAGE_SIZE + 1));

    const snap = await getDocs(query(collection(this.firestore, 'pool_preguntas'), ...constraints));
    const docs = snap.docs;
    const hasExtra = docs.length > AdminService.PAGE_SIZE;
    const pageDocs = hasExtra ? docs.slice(0, AdminService.PAGE_SIZE) : docs;

    const items = pageDocs.map(d => ({ ...d.data(), id: d.id } as PoolPregunta));
    this._pageItems.set(items);
    this._hasNextPage.set(hasExtra);
    this.pageCache.set(page, items);
    this.hasNextByPage.set(page, hasExtra);
    if (pageDocs.length > 0) {
      this.lastSnapByPage.set(page, pageDocs[pageDocs.length - 1]);
    }
  }

  /** Filtro de tema activo: carga scoped por materia + filtro/paginado en cliente. */
  private async loadTemaPage(page: number): Promise<void> {
    const materia = this._filterMateria();
    if (materia === 'all') {
      // Un tema sin materia no tiene sentido; caemos a cursor.
      return this.loadCursorPage(page);
    }
    const corpus = await this.getMateriaCorpus(materia);
    const tema = this._filterTema();
    const filtered = tema === 'all' ? corpus : corpus.filter(p => p.tema === tema);
    this.applyClientPage(filtered, page);
  }

  /** Buscador activo: carga completa (cacheada) + filtro/paginado en cliente. */
  private async loadSearchPage(page: number): Promise<void> {
    const corpus = await this.getSearchCorpus();
    const materia = this._filterMateria();
    const tema = this._filterTema();
    const q = this._searchQuery().toLowerCase();
    let filtered = corpus;
    if (materia !== 'all') filtered = filtered.filter(p => p.materiaId === materia);
    if (tema !== 'all') filtered = filtered.filter(p => p.tema === tema);
    if (q) {
      filtered = filtered.filter(p =>
        p.enunciado?.toLowerCase().includes(q) ||
        p.tema?.toLowerCase().includes(q)
      );
    }
    this.applyClientPage(filtered, page);
  }

  private applyClientPage(filtered: PoolPregunta[], page: number): void {
    const start = page * AdminService.PAGE_SIZE;
    let slice = filtered.slice(start, start + AdminService.PAGE_SIZE);
    if (slice.length === 0 && page > 0) {
      // La página quedó fuera de rango tras cambiar el filtro: volvemos a la 0.
      this._pageIndex.set(0);
      slice = filtered.slice(0, AdminService.PAGE_SIZE);
      this._pageItems.set(slice);
      this._hasNextPage.set(filtered.length > AdminService.PAGE_SIZE);
      return;
    }
    this._pageItems.set(slice);
    this._hasNextPage.set(start + AdminService.PAGE_SIZE < filtered.length);
  }

  private async getMateriaCorpus(materia: string): Promise<PoolPregunta[]> {
    const cached = this.materiaCorpus.get(materia);
    if (cached) return cached;
    const snap = await getDocs(
      query(collection(this.firestore, 'pool_preguntas'), where('materiaId', '==', materia))
    );
    const list = snap.docs
      .map(d => ({ ...d.data(), id: d.id } as PoolPregunta))
      .sort((a, b) => a.id.localeCompare(b.id));
    this.materiaCorpus.set(materia, list);
    return list;
  }

  private async getSearchCorpus(): Promise<PoolPregunta[]> {
    if (this.searchCorpus) return this.searchCorpus;
    const snap = await getDocs(collection(this.firestore, 'pool_preguntas'));
    this.searchCorpus = snap.docs
      .map(d => ({ ...d.data(), id: d.id } as PoolPregunta))
      .sort((a, b) => a.id.localeCompare(b.id));
    return this.searchCorpus;
  }

  /** Contadores por materia para el stats-bar. getCountFromServer cuesta ~1
   *  lectura por consulta, así que son ~8 lecturas en total (vs ~1.150). */
  async refreshCounts(): Promise<void> {
    try {
      const entries = await Promise.all(
        this.materiasDisponibles.map(async m => {
          const c = await getCountFromServer(
            query(collection(this.firestore, 'pool_preguntas'), where('materiaId', '==', m.id))
          );
          return [m.id, c.data().count] as const;
        })
      );
      const counts: Record<string, number> = {};
      let total = 0;
      for (const [id, n] of entries) {
        counts[id] = n;
        total += n;
      }
      this._materiaCounts.set(counts);
      this._totalCount.set(total);
    } catch (error) {
      console.error('[AdminService] Error contando pool_preguntas:', error);
    }
  }

  countForMateria(materiaId: string): number {
    return this._materiaCounts()[materiaId] ?? 0;
  }

  /**
   * Reconstruye el doc resumen `pool_preguntas_meta/summary` (conteos por
   * materia/tema) que consumen Mini Ensayo / Mente Veloz para no leer las ~1.200
   * preguntas. Se llama tras cada mutación del pool y desde "Actualizar".
   * Cuesta 1 lectura completa (solo admin, poco frecuente). No lanza.
   */
  private rebuildingMeta = false;
  async rebuildPoolMeta(): Promise<void> {
    if (this.rebuildingMeta) return;
    this.rebuildingMeta = true;
    try {
      const snap = await getDocs(query(collection(this.firestore, 'pool_preguntas')));
      const byMateria: Record<string, { total: number; temas: Record<string, number> }> = {};
      snap.docs.forEach(d => {
        const data = d.data() as any;
        const m = data.materiaId;
        if (!m) return;
        byMateria[m] = byMateria[m] || { total: 0, temas: {} };
        byMateria[m].total++;
        if (data.tema) byMateria[m].temas[data.tema] = (byMateria[m].temas[data.tema] || 0) + 1;
      });
      await setDoc(doc(this.firestore, 'pool_preguntas_meta', 'summary'), {
        updatedAt: new Date().toISOString(),
        total: snap.size,
        byMateria,
      });
    } catch (error) {
      console.error('[AdminService] Error reconstruyendo pool_preguntas_meta:', error);
    } finally {
      this.rebuildingMeta = false;
    }
  }

  // ─── CRUD Operations ───

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
    // El editor navega de vuelta a /admin tras crear, así que el panel se
    // remonta y llama a initPool(); igual invalidamos por si acaso.
    this.searchCorpus = null;
    this.materiaCorpus.clear();
    void this.rebuildPoolMeta();

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
    let savedCount = 0;

    for (let start = 0; start < preguntas.length; start += BULK_IMPORT_CHUNK_SIZE) {
      const chunk = preguntas.slice(start, start + BULK_IMPORT_CHUNK_SIZE);
      const batch = writeBatch(this.firestore);

      for (const pregunta of chunk) {
        const ref = doc(collection(this.firestore, 'pool_preguntas'));
        const data = { ...pregunta, createdAt: now, updatedAt: now, createdBy: user.uid };
        batch.set(ref, data);
      }

      try {
        await batch.commit();
        savedCount += chunk.length;
        onProgress?.(savedCount, preguntas.length);
      } catch (error: any) {
        if (savedCount > 0) this.paesContent.clearPoolPreguntasCache();
        return { savedCount, failedFromIndex: start, error: error.message };
      }
    }

    if (savedCount > 0) this.paesContent.clearPoolPreguntasCache();
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

    // Parche en sitio de la página actual + caches derivadas.
    this._pageItems.update(list =>
      list.map(p => (p.id === id ? { ...p, ...data } as PoolPregunta : p))
    );
    this.pageCache.delete(this._pageIndex());
    this.searchCorpus = null;
    this.materiaCorpus.clear();
    void this.rebuildPoolMeta();
  }

  async deletePregunta(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, 'pool_preguntas', id));

    // Invalidate PaesContentService's pool_preguntas cache so el propio admin vea el cambio de inmediato
    this.paesContent.clearPoolPreguntasCache();

    this._pageItems.update(list => list.filter(p => p.id !== id));
    this.pageCache.delete(this._pageIndex());
    this.searchCorpus = null;
    this.materiaCorpus.clear();
    void this.refreshCounts();
    void this.rebuildPoolMeta();
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

    for (let start = 0; start < ids.length; start += BULK_IMPORT_CHUNK_SIZE) {
      const chunk = ids.slice(start, start + BULK_IMPORT_CHUNK_SIZE);
      const batch = writeBatch(this.firestore);
      for (const id of chunk) {
        batch.delete(doc(this.firestore, 'pool_preguntas', id));
      }

      try {
        await batch.commit();
        deletedCount += chunk.length;
        onProgress?.(deletedCount, ids.length);
      } catch (error: any) {
        if (deletedCount > 0) this.paesContent.clearPoolPreguntasCache();
        return { deletedCount, failedFromIndex: start, error: error.message };
      }
    }

    if (deletedCount > 0) this.paesContent.clearPoolPreguntasCache();
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
