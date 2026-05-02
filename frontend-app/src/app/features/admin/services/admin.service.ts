import { Injectable, inject, signal, computed } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy } from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { PoolPregunta, MateriaId } from '../../learning-path/models/paes.models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

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

  // ─── Materias disponibles ───
  readonly materiasDisponibles: { id: MateriaId; label: string; icon: string }[] = [
    { id: 'competencia-lectora', label: 'Competencia Lectora', icon: '📖' },
    { id: 'matematicas-m1', label: 'Matemáticas M1', icon: '🔢' },
    { id: 'matematicas-m2', label: 'Matemáticas M2', icon: '📐' },
    { id: 'ciencias-biologia', label: 'Biología', icon: '🧬' },
    { id: 'ciencias-fisica', label: 'Física', icon: '⚛️' },
    { id: 'ciencias-quimica', label: 'Química', icon: '🧪' },
    { id: 'historia', label: 'Historia', icon: '🏛️' },
  ];

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
      const snap = await getDocs(
        query(collection(this.firestore, 'pool_preguntas'), orderBy('createdAt', 'desc'))
      );
      const preguntas = snap.docs.map(d => ({ ...d.data(), id: d.id } as PoolPregunta));
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
    
    // Update local state
    this._preguntas.update(list => [{ ...data, id: docRef.id } as PoolPregunta, ...list]);
    
    return docRef.id;
  }

  async updatePregunta(id: string, changes: Partial<PoolPregunta>): Promise<void> {
    const data = {
      ...changes,
      updatedAt: new Date().toISOString(),
    };
    // Remove 'id' from update data
    delete (data as any).id;

    await updateDoc(doc(this.firestore, 'pool_preguntas', id), data);

    // Update local state
    this._preguntas.update(list =>
      list.map(p => (p.id === id ? { ...p, ...data } as PoolPregunta : p))
    );
  }

  async deletePregunta(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, 'pool_preguntas', id));
    this._preguntas.update(list => list.filter(p => p.id !== id));
  }

  getMateriaLabel(materiaId: string): string {
    return this.materiasDisponibles.find(m => m.id === materiaId)?.label || materiaId;
  }

  getMateriaIcon(materiaId: string): string {
    return this.materiasDisponibles.find(m => m.id === materiaId)?.icon || '📚';
  }
}
