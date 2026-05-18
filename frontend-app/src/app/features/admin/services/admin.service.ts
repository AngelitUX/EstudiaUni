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

  async cleanupDatabase(): Promise<{ deletedUsers: number, deletedAdmins: number, updatedUsers: number }> {
    const whitelist = [
      '4AHAu2xomGPiQPuhO7Nk9HJggy22',
      'J3Bsp1TZ92QcriwOxYzsjqPdGVu1',
      'Iz89GJLdakR3iOiokl6AfmjcomF2',
      'gr9lsUQB18R5TGaTOknrZjPQDS2',
      'fqfhKmRQ8NU55KLGc05DjhnVChP2',
      'TIJ56kj8wlM7Jlvh8wmBJDFzNUy2',
      'PQLYe6RgqmQmDwdL9Q25y2XynX62',
      'PSkf4nj3XfaQlekOlVoxZuw170z2',
      'rnDrpdyISBFMwGKWBLOWLAEDfnQ2',
      '6N81QZQ7fIdeXAU1kPzVLE3jTKM2',
      'm6D8ujsOh6f4Qk7jwsfDE1dvUAt2',
      'H1ulAzlSK5cKoFRJY3je5ddlTfc2'
    ];

    const adminUids = [
      'PSkf4nj3XfaQlekOlVoxZuw170z2',
      'rnDrpdyISBFMwGKWBLOWLAEDfnQ2'
    ];

    let deletedUsers = 0;
    let deletedAdmins = 0;
    let updatedUsers = 0;

    try {
      // 1. Limpiar colección 'users' y actualizar roles
      const usersRef = collection(this.firestore, 'users');
      const usersSnap = await getDocs(usersRef);
      for (const docSnap of usersSnap.docs) {
        const uid = docSnap.id;
        if (!whitelist.includes(uid)) {
          // Borrar documento de usuario fantasma
          await deleteDoc(doc(this.firestore, 'users', uid));
          deletedUsers++;
          
          // Borrar subcolección 'actividad' si existiese
          const actRef = collection(this.firestore, `users/${uid}/actividad`);
          const actSnap = await getDocs(actRef);
          for (const actDoc of actSnap.docs) {
            await deleteDoc(doc(this.firestore, `users/${uid}/actividad`, actDoc.id));
          }
        } else {
          // Actualizar rol del usuario en la lista activa
          const isUserAdmin = adminUids.includes(uid);
          await updateDoc(doc(this.firestore, 'users', uid), {
            role: isUserAdmin ? 'admin' : 'student'
          });
          updatedUsers++;
        }
      }

      // 2. Limpiar colección 'admins'
      const adminsRef = collection(this.firestore, 'admins');
      const adminsSnap = await getDocs(adminsRef);
      for (const docSnap of adminsSnap.docs) {
        const uid = docSnap.id;
        if (!adminUids.includes(uid)) {
          await deleteDoc(doc(this.firestore, 'admins', uid));
          deletedAdmins++;
        }
      }

      // 3. Limpiar 'intentos' huérfanos
      const intentosRef = collection(this.firestore, 'intentos');
      const intentosSnap = await getDocs(intentosRef);
      for (const docSnap of intentosSnap.docs) {
        const intento = docSnap.data();
        const odId = intento['odId'];
        if (odId && !whitelist.includes(odId)) {
          await deleteDoc(doc(this.firestore, 'intentos', docSnap.id));
        }
      }
    } catch (err) {
      console.error('Error executing cleanupDatabase:', err);
      throw err;
    }

    return { deletedUsers, deletedAdmins, updatedUsers };
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
    
    // Invalidate PaesContentService cache
    localStorage.removeItem('paes_content_cache');
    localStorage.removeItem('paes_content_cache_timestamp');

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

    // Invalidate PaesContentService cache
    localStorage.removeItem('paes_content_cache');
    localStorage.removeItem('paes_content_cache_timestamp');

    // Update local state
    this._preguntas.update(list =>
      list.map(p => (p.id === id ? { ...p, ...data } as PoolPregunta : p))
    );
  }

  async deletePregunta(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, 'pool_preguntas', id));
    
    // Invalidate PaesContentService cache
    localStorage.removeItem('paes_content_cache');
    localStorage.removeItem('paes_content_cache_timestamp');

    this._preguntas.update(list => list.filter(p => p.id !== id));
  }

  getMateriaLabel(materiaId: string): string {
    return this.materiasDisponibles.find(m => m.id === materiaId)?.label || materiaId;
  }

  getMateriaIcon(materiaId: string): string {
    return this.materiasDisponibles.find(m => m.id === materiaId)?.icon || '📚';
  }
}
