import { Injectable, inject, signal } from '@angular/core';
import { Firestore, collection, doc, getDocs, setDoc, deleteDoc, query, orderBy, Timestamp, updateDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';

export interface Recurso {
  id?: string;
  titulo: string;
  descripcion: string;
  tipo: 'pdf' | 'link' | 'video' | 'libro' | 'ensayo' | 'otro';
  url: string;
  categoria: string;
  subcategoria?: string;
  etiquetas: string[];
  fechaCreacion?: Date | any;
  creadoPor?: string;
  visible: boolean;
  orden: number;
}

@Injectable({
  providedIn: 'root'
})
export class RecursosService {
  private firestore = inject(Firestore);
  private collectionName = 'recursos_adicionales';

  // Signals para estado
  public recursos = signal<Recurso[]>([]);
  public loading = signal<boolean>(false);

  constructor() {
    this.loadRecursos();
  }

  /** Vigencia de la caché del catálogo de recursos (lo edita un admin). */
  private static readonly CACHE_TTL_MS = 60 * 60 * 1000; // 1 hora
  private static readonly CACHE_KEY = 'recursos_adicionales_cache';

  /**
   * Carga el catálogo de recursos.
   *
   * Antes releía la colección completa en cada visita a la pantalla. Ahora se
   * cachea en sessionStorage; `force` la salta para que el panel admin vea sus
   * propios cambios al instante.
   */
  async loadRecursos(force = false) {
    if (!force) {
      try {
        const raw = sessionStorage.getItem(RecursosService.CACHE_KEY);
        if (raw) {
          const { data, cachedAt } = JSON.parse(raw);
          if (Date.now() - cachedAt < RecursosService.CACHE_TTL_MS && Array.isArray(data) && data.length) {
            this.recursos.set(data);
            this.loading.set(false);
            return;
          }
        }
      } catch { /* caché ilegible: se recarga de Firestore */ }
    }

    this.loading.set(true);
    try {
      const q = query(collection(this.firestore, this.collectionName), orderBy('orden', 'asc'));
      const querySnapshot = await getDocs(q);
      const data: Recurso[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Recurso);
      });

      if (data.length > 0) {
        try {
          sessionStorage.setItem(RecursosService.CACHE_KEY, JSON.stringify({ data, cachedAt: Date.now() }));
        } catch { /* sin espacio: seguimos sin caché */ }
      }

      // Si no hay recursos en la BD, creamos placeholders solo para visualizar
      if (data.length === 0) {
        this.recursos.set(this.getPlaceholders());
      } else {
        this.recursos.set(data);
      }
    } catch (error) {
      console.error('Error al cargar recursos:', error);
      // Fallback a placeholders en caso de error
      this.recursos.set(this.getPlaceholders());
    } finally {
      this.loading.set(false);
    }
  }

  async createRecurso(recurso: Recurso): Promise<string> {
    const docRef = doc(collection(this.firestore, this.collectionName));
    const nuevoRecurso = {
      ...recurso,
      fechaCreacion: Timestamp.now()
    };
    await setDoc(docRef, nuevoRecurso);
    await this.loadRecursos(true); // force: el admin debe ver su cambio ya
    return docRef.id;
  }

  async updateRecurso(id: string, recurso: Partial<Recurso>): Promise<void> {
    const docRef = doc(this.firestore, this.collectionName, id);
    await updateDoc(docRef, recurso);
    await this.loadRecursos(true); // force: el admin debe ver su cambio ya
  }

  async deleteRecurso(id: string): Promise<void> {
    const docRef = doc(this.firestore, this.collectionName, id);
    await deleteDoc(docRef);
    await this.loadRecursos(true); // force: el admin debe ver su cambio ya
  }

  private getPlaceholders(): Recurso[] {
    return [
      {
        id: 'placeholder_1',
        titulo: 'Guía Completa PSU Matemáticas M1',
        descripcion: 'Un resumen exhaustivo de todos los ejes temáticos para la prueba M1, con ejercicios resueltos paso a paso.',
        tipo: 'pdf',
        url: '#',
        categoria: 'Matemáticas',
        etiquetas: ['Álgebra', 'Geometría', 'Guía'],
        visible: true,
        orden: 1
      },
      {
        id: 'placeholder_2',
        titulo: 'Curso Intensivo de Física',
        descripcion: 'Lista de reproducción con clases en video para repasar conceptos clave de física para Ciencias.',
        tipo: 'video',
        url: '#',
        categoria: 'Ciencias',
        etiquetas: ['Física', 'Clases', 'Video'],
        visible: true,
        orden: 2
      },
      {
        id: 'placeholder_3',
        titulo: 'Ensayo DEMRE Oficial (Año Anterior)',
        descripcion: 'El modelo oficial liberado por el DEMRE para practicar en condiciones reales.',
        tipo: 'ensayo',
        url: '#',
        categoria: 'Comprensión Lectora',
        etiquetas: ['Oficial', 'Práctica'],
        visible: true,
        orden: 3
      },
      {
        id: 'placeholder_4',
        titulo: 'Resumen Historia de Chile Siglo XX',
        descripcion: 'Mapa conceptual y apuntes resumidos sobre los principales eventos históricos del siglo XX en Chile.',
        tipo: 'pdf',
        url: '#',
        categoria: 'Historia',
        etiquetas: ['Historia de Chile', 'Resumen'],
        visible: true,
        orden: 4
      },
      {
        id: 'placeholder_5',
        titulo: 'Portal de Recursos Mineduc',
        descripcion: 'Acceso directo al portal oficial con material complementario de estudio.',
        tipo: 'link',
        url: '#',
        categoria: 'General',
        etiquetas: ['Oficial', 'Enlaces'],
        visible: true,
        orden: 5
      }
    ];
  }
}
