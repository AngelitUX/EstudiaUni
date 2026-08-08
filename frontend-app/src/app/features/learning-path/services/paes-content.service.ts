import { Injectable, signal, computed, inject, Injector } from '@angular/core';
import { Materia, Capitulo, Seccion, TestPaes, SeccionProgress, TestResult, TestAnswer } from '../models/paes.models';
import { Firestore, collection, getDocs, collectionGroup } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { DashboardService } from '../../../core/services/dashboard.service';

const LOCAL_MATERIAS: Materia[] = [
  { id: 'comp-lectora', title: 'Competencia Lectora', slug: 'competencia-lectora', icon: '📖', order: 1, isActive: true, imageUrl: 'assets/images/subjects/comp-lectora.png' },
  { id: 'mat1', title: 'Competencia Matemática 1 (M1)', slug: 'matematica-1', icon: '📐', order: 2, isActive: true, imageUrl: 'assets/images/subjects/matematica1.png' },
  { id: 'mat2', title: 'Competencia Matemática 2 (M2)', slug: 'matematica-2', icon: '✏️', order: 3, isActive: true, imageUrl: 'assets/images/subjects/matematica2.png' },
  { id: 'historia', title: 'Historia y Cs. Sociales', slug: 'historia', icon: '🏛️', order: 4, isActive: true, imageUrl: 'assets/images/subjects/historia.png' },
  { id: 'ciencias', title: 'Ciencias', slug: 'ciencias', icon: '🧬', order: 5, isActive: true }
];

import { CAPITULOS } from '../data/seed-data';
import { HISTORIA_CAPITULOS, HISTORIA_MATERIA } from '../data/seed-historia';

const LOCAL_POOL_PREGUNTAS: any[] = [
  // Competencia Lectora
  {
    id: 'q-lect-1',
    materiaId: 'comp-lectora',
    tema: 'Localizar',
    enunciado: 'Con respecto al análisis demográfico, ¿cuál es la relación establecida entre el primer y segundo párrafo?',
    alternativas: {
      A: 'El primero presenta el problema del envejecimiento; el segundo muestra formas de medirlo.',
      B: 'El primero explica las tasas de crecimiento; el segundo las compara con América Latina.',
      C: 'El primero define la transición demográfica; el segundo plantea los indicadores que permiten observarla.',
      D: 'El primero categoriza factores de medición; el segundo explica las razones por las que fueron reemplazados.'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Excelente deducción! El primer párrafo establece el marco teórico (transición demográfica) y el segundo detalla los indicadores.',
    feedback_error: '¡Revisa con calma! El segundo párrafo introduce indicadores como la fecundidad y la esperanza de vida.'
  },
  {
    id: 'q-lect-2',
    materiaId: 'comp-lectora',
    tema: 'Interpretar',
    enunciado: 'A partir de la lectura, ¿qué implica el "bono demográfico" para una sociedad?',
    alternativas: {
      A: 'Que aumenta su población en edad laboral.',
      B: 'Que entrega incentivos para aumentar la natalidad.',
      C: 'Que impulsa el incremento de la esperanza de vida.',
      D: 'Que intenta frenar el envejecimiento de la población.'
    },
    respuesta_correcta: 'A',
    feedback_acierto: '¡Exacto! El "bono demográfico" es la situación favorable donde se amplía el tamaño de la población económicamente activa.',
    feedback_error: 'Recuerda buscar el concepto de bono demográfico. Refiere al aumento de la población activa.'
  },
  {
    id: 'q-lect-3',
    materiaId: 'comp-lectora',
    tema: 'Evaluar',
    enunciado: '¿Cuál es la actitud del emisor en relación con el problema de la "memoria corta"?',
    alternativas: {
      A: 'Crítica, pues considera que los intelectuales incumplen el rol de modelos.',
      B: 'Controversial, pues cree que hay áreas disciplinares menospreciadas.',
      C: 'Cuestionadora, pues cree que la educación carece de perspectiva integradora.',
      D: 'Pesimista, pues considera que el sistema educativo tiene limitaciones históricas.'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Muy bien captado! El emisor cuestiona cómo la falta de conocimientos desconecta a las generaciones de su pasado.',
    feedback_error: 'El emisor cuestiona y analiza críticamente la desconexión del pasado cultural.'
  },

  // Matemática M1
  {
    id: 'q-mat1-1',
    materiaId: 'mat1',
    tema: 'Números',
    enunciado: 'Un pantalón cuesta $25.000, pero está con un 20% de descuento. Si al pagar en caja se aplica un recargo del 5% sobre el precio ya descontado por usar tarjeta de crédito, ¿cuál es el valor final a pagar?',
    alternativas: {
      A: '$19.000',
      B: '$20.000',
      C: '$21.000',
      D: '$21.250'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Correcto! Descuento: $25.000 * 0.8 = $20.000. Recargo del 5%: $20.000 * 1.05 = $21.000.',
    feedback_error: '¡Revisa la matemática! Primero descuenta el 20%, y luego agrega el 5% a ese resultado.'
  },
  {
    id: 'q-mat1-2',
    materiaId: 'mat1',
    tema: 'Álgebra',
    enunciado: 'Si 2x + 8 = 0, ¿cuál es el valor de x?',
    alternativas: {
      A: '-4',
      B: '4',
      C: '-8',
      D: '8'
    },
    respuesta_correcta: 'A',
    feedback_acierto: '¡Excelente! 2x = -8, por lo tanto x = -8/2 = -4.',
    feedback_error: 'Despeja la ecuación: 2x = -8, luego divides por 2.'
  },
  {
    id: 'q-mat1-3',
    materiaId: 'mat1',
    tema: 'Probabilidad',
    enunciado: 'Al lanzar un dado común de 6 caras, ¿cuál es la probabilidad de obtener un número primo?',
    alternativas: {
      A: '1/6',
      B: '2/6',
      C: '3/6',
      D: '4/6'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Correcto! Los números primos en el dado son 2, 3 y 5. Eso hace 3 casos favorables de 6 posibles.',
    feedback_error: 'Recuerda cuáles son los números primos entre 1 y 6: el 2, el 3 y el 5.'
  },

  // Matemática M2
  {
    id: 'q-mat2-1',
    materiaId: 'mat2',
    tema: 'Logaritmos',
    enunciado: 'Si log_2(x) = 5, ¿cuál es el valor de x?',
    alternativas: {
      A: '10',
      B: '25',
      C: '32',
      D: '64'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Excelente! log_2(x) = 5 es equivalente a 2^5 = x, por lo tanto x = 32.',
    feedback_error: 'Por definición de logaritmo, la base elevada al resultado es igual al argumento: 2^5 = x.'
  },
  {
    id: 'q-mat2-2',
    materiaId: 'mat2',
    tema: 'Ecuaciones cuadráticas',
    enunciado: 'Dada la ecuación cuadrática x² - 6x + 9 = 0, ¿cuál es su discriminante (Δ)?',
    alternativas: {
      A: '0',
      B: '18',
      C: '-18',
      D: '36'
    },
    respuesta_correcta: 'A',
    feedback_acierto: '¡Perfecto! Δ = b² - 4ac = (-6)² - 4(1)(9) = 36 - 36 = 0.',
    feedback_error: 'Calcula Δ usando la fórmula b² - 4ac con a=1, b=-6, c=9.'
  },
  {
    id: 'q-mat2-3',
    materiaId: 'mat2',
    tema: 'Trigonometría',
    enunciado: 'En un triángulo rectángulo, si el seno de uno de sus ángulos agudos es 3/5, ¿cuánto es el coseno de dicho ángulo?',
    alternativas: {
      A: '2/5',
      B: '4/5',
      C: '3/4',
      D: '1'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Correcto! Usando la identidad fundamental sen²θ + cos²θ = 1, o el triángulo pitagórico 3-4-5: cos = 4/5.',
    feedback_error: 'Usa el triángulo pitagórico de lados 3, 4 y 5. Si el seno es opuesto/hipotenusa (3/5), el coseno es adyacente/hipotenusa (4/5).'
  },

  // Historia y Ciencias Sociales
  {
    id: 'q-hist-1',
    materiaId: 'historia',
    tema: 'Época del Salitre',
    enunciado: 'Según la historia económica de Chile, ¿cuál fue la principal consecuencia de la Guerra del Pacífico en los recursos fiscales del Estado?',
    alternativas: {
      A: 'El aumento masivo de la deuda externa.',
      B: 'La pérdida de control de los puertos del norte.',
      C: 'La obtención de vastos territorios ricos en salitre, aumentando los ingresos fiscales por impuestos.',
      D: 'La bancarrota del sistema de hacienda tradicional.'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Exacto! La incorporación de Tarapacá y Antofagasta dio a Chile el monopolio del salitre, incrementando fuertemente el presupuesto estatal.',
    feedback_error: 'La Guerra del Pacífico anexó territorios salitreros clave del norte.'
  },
  {
    id: 'q-hist-2',
    materiaId: 'historia',
    tema: 'Cuestión Social',
    enunciado: 'La Cuestión Social a finales del siglo XIX y principios del XX en Chile se vincula directamente con:',
    alternativas: {
      A: 'El conflicto agrario en las haciendas coloniales.',
      B: 'La migración campo-ciudad y el hacinamiento e insalubridad que sufrieron los obreros industriales y del salitre.',
      C: 'La disputa limítrofe por la Patagonia.',
      D: 'La expansión del voto femenino.'
    },
    respuesta_correcta: 'B',
    feedback_acierto: '¡Correcto! La cuestión social agrupó problemas habitacionales, sanitarios, laborales y de pobreza generados por la rápida urbanización e industrialización.',
    feedback_error: 'Apunta a las terribles condiciones habitacionales y de salud de los obreros en conventillos y salitreras.'
  },
  {
    id: 'q-hist-3',
    materiaId: 'historia',
    tema: 'Constitución',
    enunciado: '¿Cuál fue uno de los principales cambios políticos introducidos por la Constitución de 1925 en Chile?',
    alternativas: {
      A: 'El paso de un régimen parlamentario ineficaz a un fuerte régimen presidencial.',
      B: 'La instauración de una monarquía constitucional.',
      C: 'La abolición del Congreso Nacional.',
      D: 'La estatización de toda la minería del cobre.'
    },
    respuesta_correcta: 'A',
    feedback_acierto: '¡Perfecto! La carta de 1925 terminó con el régimen parlamentario "de facto" y devolvió atribuciones al poder ejecutivo.',
    feedback_error: 'Esta constitución buscó fortalecer la figura presidencial frente a un congreso obstruccionista.'
  },

  // Ciencias
  {
    id: 'q-cien-1',
    materiaId: 'ciencias',
    tema: 'Biología Celular',
    enunciado: 'Al observar una célula al microscopio se nota la presencia de pared celular de celulosa y grandes vacuolas centrales. ¿A qué tipo de organismo pertenece?',
    alternativas: {
      A: 'Animal',
      B: 'Bacteria',
      C: 'Planta',
      D: 'Hongo'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Excelente! La pared de celulosa y vacuola de gran tamaño son propias de células vegetales.',
    feedback_error: 'Las células animales no poseen pared celular. Es vegetal.'
  },
  {
    id: 'q-cien-2',
    materiaId: 'ciencias',
    tema: 'Fisiología',
    enunciado: '¿Cuál es la función principal de las mitocondrias en las células eucariontes?',
    alternativas: {
      A: 'La síntesis de proteínas.',
      B: 'La fotosíntesis celular.',
      C: 'La respiración celular y producción de energía química (ATP).',
      D: 'La digestión y reciclaje celular.'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Exacto! Las mitocondrias oxidan nutrientes para sintetizar ATP mediante la respiración aeróbica.',
    feedback_error: 'Las mitocondrias son las "centrales de energía" de la célula.'
  },
  {
    id: 'q-cien-3',
    materiaId: 'ciencias',
    tema: 'Física',
    enunciado: '¿Cuál de las siguientes ondas electromagnéticas tiene la menor longitud de onda?',
    alternativas: {
      A: 'Luz visible',
      B: 'Microondas',
      C: 'Rayos Gamma',
      D: 'Ondas de Radio'
    },
    respuesta_correcta: 'C',
    feedback_acierto: '¡Brillante! Los rayos Gamma poseen la mayor frecuencia y por tanto la menor longitud de onda en el espectro.',
    feedback_error: 'A mayor energía y frecuencia, menor es la longitud de onda. Los rayos gamma son extremadamente energéticos.'
  }
];

@Injectable({ providedIn: 'root' })
export class PaesContentService {
  private firestore = inject(Firestore);
  private injector = inject(Injector);
  private auth = inject(Auth);
  private currentUid: string | null = null;

  // Lazy-loaded to avoid circular dependency  
  private _dashboardService: DashboardService | null = null;
  private get dashSvc(): DashboardService {
    if (!this._dashboardService) {
      this._dashboardService = this.injector.get(DashboardService);
    }
    return this._dashboardService;
  }

  // ─── Signals de estado ───
  private _materias = signal<Materia[]>([]);
  private _capitulos = signal<Capitulo[]>([]);
  private _progress = signal<Map<string, SeccionProgress>>(new Map());
  private _lastTestResult = signal<TestResult | null>(null);
  private _poolPreguntas = signal<any[]>([]);

  private useMocksMode = false;

  // Signal para estado de carga
  loading = signal(true);

  // ─── Computed ───
  readonly materias = computed(() => this._materias().filter(m => m.isActive));
  readonly allMaterias = this._materias.asReadonly();
  readonly lastTestResult = this._lastTestResult.asReadonly();
  readonly poolPreguntas = this._poolPreguntas.asReadonly();

  constructor() {
    // this.clearCache(); // Commented out to prevent erasing cache on every reload/hot-reload, reducing Firestore reads.

    // Por defecto carga de Firestore. Solo carga de Mocks si está explícitamente activado en localStorage.
    const useMocks = localStorage.getItem('USE_LOCAL_MOCKS') === 'true';
    this.useMocksMode = useMocks;
    if (useMocks) {
      this.loadDataFromLocalMocks();
      this.loadProgressFromStorage();
    } else {
      // Don't fetch immediately, wait for auth to resolve to avoid permission denied errors
      // that trigger the local fallbacks prematurely.
    }
    // Subscribe to auth state changes to load user-specific progress and fetch fresh firestore data
    this.auth.onAuthStateChanged((user) => {
      if (this.useMocksMode) return;
      if (user) {
        const isNewUser = user.uid !== this.currentUid;
        this.currentUid = user.uid;

        if (isNewUser) {
          this._progress.set(new Map());
          this.loadProgressFromStorage();
          // Debug: log loaded progress count for verification
          if (this._progress().size > 0) {
            const completedCount = Array.from(this._progress().values()).filter(p => p.completed).length;
          }
        }

        // Cargar datos de Firestore ahora que estamos 100% autenticados
        // Siempre intentamos cargar de Firestore al loguearnos
        this.loadDataFromFirestore();
      } else {
        this.currentUid = null;
        this._progress.set(new Map());
        if (this._materias().length === 0) {
          this.loading.set(true);
        }
      }
    });

  }

  private async loadDataFromLocalMocks() {
    try {


      // 1. Cargar materias mock (usando ruta absoluta)
      const materiasRes = await fetch('/assets/mocks/materias-mock-local.json');
      if (!materiasRes.ok) throw new Error('materias-mock-local.json not found');
      const materias = await materiasRes.json() as Materia[];
      
      const hist = materias.find(m => m.id === 'historia');
      if (hist) {
        hist.isActive = true;
        hist.title = 'Historia y Cs. Sociales';
      } else {
        materias.push(HISTORIA_MATERIA);
      }

      this._materias.set(materias.sort((a, b) => a.order - b.order));

      // 2. Cargar capítulos mock (usando ruta absoluta)
      const capitulosRes = await fetch('/assets/mocks/capitulos-mock-local.json?v=' + Date.now());
      if (!capitulosRes.ok) throw new Error('capitulos-mock-local.json not found');
      const capitulos = await capitulosRes.json() as Capitulo[];
      const sortedCapitulos = capitulos.sort((a, b) => a.order - b.order);
      this._capitulos.set(this.syncLocalChapters(sortedCapitulos));

      // 3. Set pool preguntas from local hardcoded variable (just in case)
      this._poolPreguntas.set(LOCAL_POOL_PREGUNTAS);
    } catch (error) {
      console.warn('⚠️ [EstudiaUni Testing] Failed to load local mocks. Falling back to Firestore...', error);
      await this.loadDataFromFirestore();
    } finally {
      this.loading.set(false);
    }
  }

  public clearCache(): void {
    localStorage.removeItem('paes_content_cache_v2');
    localStorage.removeItem('paes_content_cache_timestamp_v2');

  }

  private syncLocalChapters(capitulosList: Capitulo[]): Capitulo[] {
    if (!capitulosList) capitulosList = [];

    const validHistoriaIds = ['cap-hist-1', 'cap-hist-2', 'cap-hist-3', 'cap-hist-4', 'cap-hist-5'];

    // Filtrar primero los capítulos fantasmas de historia que vengan del caché
    const filteredInput = capitulosList.filter(cap => {
      if (cap.materiaId === 'historia' && !validHistoriaIds.includes(cap.id)) {
        console.warn(`🗑️ [Historia] Eliminando capítulo fantasma del caché: ${cap.id} - "${cap.title}"`);
        return false;
      }
      return true;
    });

    const result = filteredInput.map(cap => {
      // Comp-lectora overrides
      if (cap.id === 'cap-1' || cap.id === 'cap-interpretar' || cap.id === 'cap-evaluar') {
        const localSeed = CAPITULOS.find(c => c.id === cap.id);
        if (localSeed) {
          return localSeed;
        }
      }
      // Historia overrides — reemplaza secciones con el mock local
      if (cap.materiaId === 'historia') {
        const historiaSeed = HISTORIA_CAPITULOS.find(c => c.id === cap.id);
        if (historiaSeed) {
          return historiaSeed;
        }
      }
      return cap;
    });

    // Añadir de comp-lectora si faltan
    for (const capId of ['cap-1', 'cap-interpretar', 'cap-evaluar']) {
      if (!result.some(c => c.id === capId)) {
        const localSeed = CAPITULOS.find(c => c.id === capId);
        if (localSeed) {
          result.push(localSeed);
        }
      }
    }

    // Añadir de historia si faltan
    for (const histCap of HISTORIA_CAPITULOS) {
      if (!result.some(c => c.id === histCap.id)) {
        result.push(histCap);
      }
    }

    return result.sort((a, b) => a.order - b.order);
  }

  private async loadDataFromFirestore() {
    const CACHE_KEY = 'learning_path_cache_v117';
    const cacheTimeKey = 'paes_content_cache_timestamp_v117';
    const cacheTTL = 30 * 60 * 1000; // 30 minutos

    try {
      // 0. Intentar cargar desde caché
      const cachedDataRaw = localStorage.getItem(CACHE_KEY);
      const cachedTimeRaw = localStorage.getItem(cacheTimeKey);

      if (cachedDataRaw && cachedTimeRaw) {
        const cachedTime = parseInt(cachedTimeRaw, 10);
        if (Date.now() - cachedTime < cacheTTL) {
          const cached = JSON.parse(cachedDataRaw);
          if (cached.materias && cached.poolPreguntas && cached.capitulos) {

            this._materias.set(cached.materias);
            this._poolPreguntas.set(cached.poolPreguntas);
            this._capitulos.set(this.syncLocalChapters(cached.capitulos));
            this.loading.set(false);
            return;
          }
        }
      }
    } catch (cacheError) {
      console.warn('[PaesContentService] Error leyendo caché local:', cacheError);
    }

    try {


      // 1. Cargar materias
      let materiasSnap;
      try {
        materiasSnap = await getDocs(collection(this.firestore, 'lp_materias'));
      } catch (err) {
        console.error('[PaesContentService] Error cargando lp_materias desde Firestore:', err);
        throw err;
      }
      const materias = materiasSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Materia));

      // 2. Cargar el pool de preguntas completo
      let poolSnap;
      try {
        poolSnap = await getDocs(collection(this.firestore, 'pool_preguntas'));
      } catch (err) {
        console.error('[PaesContentService] Error cargando pool_preguntas desde Firestore:', err);
        throw err;
      }
      const poolMap = new Map<string, any>();
      const poolArray: any[] = [];
      poolSnap.docs.forEach(doc => {
        const data = { id: doc.id, ...doc.data() };
        poolMap.set(doc.id, data);
        poolArray.push(data);
      });

      // 3. Cargar capítulos y sus secciones
      let capitulosSnap;
      try {
        capitulosSnap = await getDocs(collection(this.firestore, 'lp_capitulos'));
      } catch (err) {
        console.error('[PaesContentService] Error cargando lp_capitulos desde Firestore:', err);
        throw err;
      }
      const capitulos: Capitulo[] = [];

      // 4. Cargar todos los tests (como referencias)
      let testsSnap;
      try {
        testsSnap = await getDocs(collection(this.firestore, 'lp_tests'));
      } catch (err) {
        console.error('[PaesContentService] Error cargando lp_tests desde Firestore:', err);
        throw err;
      }
      const testsMap = new Map<string, TestPaes>();
      testsSnap.docs.forEach(doc => {
        const data = doc.data() as any;
        let preguntas = data.preguntas || [];
        if (data.preguntaIds && Array.isArray(data.preguntaIds)) {
          preguntas = data.preguntaIds
            .map((pid: string) => poolMap.get(pid))
            .filter((p: any) => !!p);
        }

        testsMap.set(doc.id, {
          ...data,
          id: doc.id,
          preguntas
        } as TestPaes);
      });

      // 5. Cargar todas las secciones de una sola vez con un Collection Group
      let seccionesSnap;
      try {
        seccionesSnap = await getDocs(collectionGroup(this.firestore, 'secciones'));
      } catch (err) {
        console.error('[PaesContentService] Error cargando secciones (collectionGroup) desde Firestore:', err);
        throw err;
      }
      const seccionesByCapitulo = new Map<string, Seccion[]>();

      seccionesSnap.docs.forEach(secDoc => {
        const secData = secDoc.data() as any;
        const test = testsMap.get(secData.testId);

        let imageUrl = secData.imageUrl || this.getHistoriaImageUrl(secDoc.id, secData);

        const seccion = {
          ...secData,
          id: secDoc.id,
          imageUrl,
          test
        } as Seccion;

        const capId = secData.capituloId;
        if (capId) {
          if (!seccionesByCapitulo.has(capId)) {
            seccionesByCapitulo.set(capId, []);
          }
          seccionesByCapitulo.get(capId)!.push(seccion);
        }
      });

      // 6. Armar los capítulos
      capitulosSnap.docs.forEach(doc => {
        const capData = doc.data() as any;

        if (capData.materiaId === 'comp-lectora') {
            // Permitimos los 3 capítulos válidos. cap-localizar es el duplicado de 6 lecciones.
            if (doc.id !== 'cap-1' && doc.id !== 'cap-interpretar' && doc.id !== 'cap-evaluar') {
                return; // IGNORAR CAPITULOS FANTASMAS VIEJOS COMO cap-localizar
            }
        }

        // IGNORAR CAPITULOS FANTASMAS DE HISTORIA — solo aceptamos los 5 del mock local
        if (capData.materiaId === 'historia') {
            const validHistoriaIds = ['cap-hist-1', 'cap-hist-2', 'cap-hist-3', 'cap-hist-4', 'cap-hist-5'];
            if (!validHistoriaIds.includes(doc.id)) {
                return; // IGNORAR capítulos viejos/fantasmas de historia
            }
        }

        let secciones = seccionesByCapitulo.get(doc.id) || [];
        
        // OVERRIDE CAP-1, CAP-INTERPRETAR, AND CAP-EVALUAR WITH LOCAL SEED DATA
        if (doc.id === 'cap-1' || doc.id === 'cap-evaluar' || doc.id === 'cap-interpretar') {
           const localSeed = CAPITULOS.find((c: any) => c.id === doc.id);
           if (localSeed && localSeed.secciones) {
               secciones = localSeed.secciones;
           }
        }

        // OVERRIDE HISTORIA CHAPTERS WITH LOCAL MOCK DATA
        if (doc.id.startsWith('cap-hist-')) {
           const localSeed = HISTORIA_CAPITULOS.find((c: any) => c.id === doc.id);
           if (localSeed && localSeed.secciones) {
               secciones = localSeed.secciones;
           }
        }
        
        secciones.sort((a: any, b: any) => a.order - b.order);

        capitulos.push({
          ...capData,
          id: doc.id,
          secciones
        } as Capitulo);
      });


      if (materias.length > 0) {
        // Enforce active status and existence of M2 and Historia
        if (!materias.some(m => m.id === 'mat2' || m.slug === 'matematica-2')) {
          materias.push({
            id: 'mat2',
            title: 'Matemática M2',
            slug: 'matematica-2',
            icon: '✏️',
            order: 3,
            isActive: true
          });
        }
        const hist = materias.find(m => m.id === 'historia');
        if (hist) {
          hist.isActive = true;
          hist.title = 'Historia y Cs. Sociales';
        } else {
          materias.push(HISTORIA_MATERIA);
        }
        
        const mat1 = materias.find(m => m.id === 'mat1' || m.slug === 'matematica-1');
        if (mat1) {
          mat1.title = 'Competencia Matemática 1 (M1)';
        }

        // Asignar imágenes a las materias si no vienen de Firestore
        materias.forEach(m => {
          if (!m.imageUrl) {
            if (m.id === 'comp-lectora' || m.slug === 'competencia-lectora') m.imageUrl = 'assets/images/subjects/comp-lectora.png';
            else if (m.id === 'mat1' || m.slug === 'matematica-1') m.imageUrl = 'assets/images/subjects/matematica1.png';
            else if (m.id === 'mat2' || m.slug === 'matematica-2') m.imageUrl = 'assets/images/subjects/matematica2.png';
            else if (m.id === 'historia' || m.slug === 'historia') m.imageUrl = 'assets/images/subjects/historia.png';
          }
        });

        const sortedMaterias = materias.sort((a, b) => a.order - b.order);
        const finalPool = poolArray.length > 0 ? poolArray : LOCAL_POOL_PREGUNTAS;
        const sortedCapitulos = capitulos.sort((a, b) => a.order - b.order);

        this.applyHistoriaImageMapping(sortedCapitulos);
        this.enrichHistoriaChapters4And5(sortedCapitulos);

        const syncedCapitulos = this.syncLocalChapters(sortedCapitulos);

        this._materias.set(sortedMaterias);
        this._poolPreguntas.set(finalPool);
        this._capitulos.set(syncedCapitulos);

        // Guardar en caché
        try {
          const cacheData = {
            materias: sortedMaterias,
            poolPreguntas: finalPool,
            capitulos: syncedCapitulos
          };
          localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
          localStorage.setItem(cacheTimeKey, Date.now().toString());

        } catch (cacheError) {
          console.warn('[PaesContentService] No se pudo guardar en caché:', cacheError);
        }
      } else {
        this.loadLocalFallbacks();
      }

    } catch (error) {
      console.error('Error cargando datos de Firestore (utilizando fallback local offline):', error);
      this.loadLocalFallbacks();
    } finally {
      this.loading.set(false);
    }
  }

  private applyHistoriaImageMapping(capitulos: Capitulo[]) {
    const HISTORIA_SECTION_IMAGES: Record<string, string> = {
      '1-1': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905037/vyqnyijownlrane4caw2.jpg',
      '1-2': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905036/h8krgjj2g5o8nfw0zcb1.jpg',
      '1-3': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905037/zfr8xuvtisumjbojzai9.jpg',
      '1-4': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905042/tja4smjac8eqy59wzxhi.jpg',
      '1-5': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905037/ti4ukigu1zbauotp2cwi.jpg',
      '2-1': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905037/kzhldetgmmdybpkywibq.jpg',
      '2-2': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905038/t5uq3iqxuroiqc2tzw8j.jpg',
      '2-3': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905038/mp8ayvhpswr76ubywob1.jpg',
      '2-4': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905037/yyb8euucllngapwgxon0.webp',
      '2-5': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905038/oxf6xsjvlepxru9btgcp.png',
      '3-1': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905038/ogrrtgtcbzmw2ntpnlxu.jpg',
      '3-2': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905038/jxpyrsxsigferexii71j.webp',
      '3-3': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905039/gw4uepphynwaog3bph4t.jpg',
      '3-4': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905039/eramr3kfqbyrqp6qrpct.jpg',
      '3-5': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905039/vtg5txfooop05ulahr7c.jpg',
      '4-1': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905039/y4uzuo3kfgtgfa3mwu0j.jpg',
      '4-2': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905040/kei7irgbxklaibqbbxvc.jpg',
      '4-3': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905040/elottrpyhfyxth84bsw8.jpg',
      '4-4': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905045/ardr8kvu2sis5j2v4kqo.jpg',
      '5-1': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905041/ahfrpvle3kr0rwtekpkw.webp',
      '5-2': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905041/e2y8gqkm53jjo0fql4ko.jpg',
      '5-3': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905042/lflmpcg6lybq7elbnvas.png',
      '5-4': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905041/je4etlc1wgnxeuzdewjp.jpg'
    };

    const histCaps = capitulos.filter(c => c.materiaId === 'historia' || c.materiaId === 'ciencias-historia');
    histCaps.forEach((cap, cIdx) => {
      const capNum = cap.order || (cIdx + 1);
      cap.secciones.forEach((sec, sIdx) => {
        const secNum = sec.order || (sIdx + 1);
        const key = `${capNum}-${secNum}`;
        if (HISTORIA_SECTION_IMAGES[key]) {
          sec.imageUrl = HISTORIA_SECTION_IMAGES[key];
        }
      });
    });
  }

  private getHistoriaImageUrl(secId: string, secData?: any): string | undefined {
    const map: Record<string, string> = {
      'sec-hist-1-1': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905037/vyqnyijownlrane4caw2.jpg',
      'sec-hist-1-2': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905036/h8krgjj2g5o8nfw0zcb1.jpg',
      'sec-hist-1-3': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905037/zfr8xuvtisumjbojzai9.jpg',
      'sec-hist-1-4': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905042/tja4smjac8eqy59wzxhi.jpg',
      'sec-hist-1-5': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905037/ti4ukigu1zbauotp2cwi.jpg',
      'sec-hist-2-1': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905037/kzhldetgmmdybpkywibq.jpg',
      'sec-hist-2-2': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905038/t5uq3iqxuroiqc2tzw8j.jpg',
      'sec-hist-2-3': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905038/mp8ayvhpswr76ubywob1.jpg',
      'sec-hist-2-4': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905037/yyb8euucllngapwgxon0.webp',
      'sec-hist-2-5': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905038/oxf6xsjvlepxru9btgcp.png',
      'sec-hist-3-1': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905038/ogrrtgtcbzmw2ntpnlxu.jpg',
      'sec-hist-3-2': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905038/jxpyrsxsigferexii71j.webp',
      'sec-hist-3-3': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905039/gw4uepphynwaog3bph4t.jpg',
      'sec-hist-3-4': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905039/eramr3kfqbyrqp6qrpct.jpg',
      'sec-hist-3-5': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905039/vtg5txfooop05ulahr7c.jpg',
      'sec-hist-4-1': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905039/y4uzuo3kfgtgfa3mwu0j.jpg',
      'sec-hist-4-2': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905040/kei7irgbxklaibqbbxvc.jpg',
      'sec-hist-4-3': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905040/elottrpyhfyxth84bsw8.jpg',
      'sec-hist-4-4': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905045/ardr8kvu2sis5j2v4kqo.jpg',
      'sec-hist-5-1': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905041/ahfrpvle3kr0rwtekpkw.webp',
      'sec-hist-5-2': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905041/e2y8gqkm53jjo0fql4ko.jpg',
      'sec-hist-5-3': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905042/lflmpcg6lybq7elbnvas.png',
      'sec-hist-5-4': 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905041/je4etlc1wgnxeuzdewjp.jpg'
    };

    if (map[secId]) return map[secId];
    if (secData) {
      const capId = secData.capituloId || '';
      const capNum = capId.replace('cap-hist-', '').replace('cap-historia-', '');
      const order = secData.order || 1;
      const altKey = `sec-hist-${capNum}-${order}`;
      if (map[altKey]) return map[altKey];
      if (map[`${capNum}-${order}`]) return map[`${capNum}-${order}`];
    }
    return undefined;
  }

  private enrichHistoriaChapters4And5(capitulos: Capitulo[]) {
    const histCaps = capitulos.filter(c => c.materiaId === 'historia' || c.materiaId === 'ciencias-historia');

    histCaps.forEach(cap => {
      if (cap.id === 'cap-hist-4' || cap.id === 'cap-historia-4' || cap.order === 4) {
        cap.secciones.forEach(sec => {
          const secId = sec.id;
          if (secId.includes('1') || sec.order === 1) {
            sec.introduccion = 'La democracia moderna no se limita a realizar elecciones periódicas; constituye un sistema político y de convivencia social fundado en la dignidad humana, la soberanía popular y el estricto apego al Estado de Derecho.';
            sec.guia_contenido = `En Chile, el artículo 5° de la Constitución consagra que la soberanía reside esencialmente en la Nación y se ejerce mediante elecciones periódicas, plebiscitos y por las autoridades que la Constitución establece. Para que una democracia funcione de manera plena, debe garantizar tres pilares fundamentales:<br><br>1. **Soberanía Popular y Representatividad:** El poder político emana del pueblo, quien delega su ejercicio en autoridades electas democráticamente.<br>2. **Estado de Derecho y Primacía Constitucional:** Todas las personas e instituciones, públicas y privadas, están sometidas al marco legal. El artículo 6° de la Carta Magna establece que los órganos del Estado deben adecuar su acción a la Constitución.<br>3. **Pluralismo Político y Separación de Poderes:** Se garantiza la libertad de asociación y el libre debate de ideas. La división de poderes (Ejecutivo, Legislativo y Judicial) junto con organismos autónomos (Contraloría General de la República, Tribunal Constitucional, Banco Central) genera un sistema de pesos y contrapesos (checks and balances) que evita la concentración del poder y la tiranía.`;
            sec.datos_claves = [
              '**Soberanía Popular (Art. 5°):** El poder supremo reside en la ciudadanía y se ejerce formalmente a través del voto y de los representantes electos.',
              '**Estado de Derecho (Art. 6° y 7°):** Las autoridades solo pueden actuar dentro del marco de sus competencias legales. Nadie está por sobre la ley.',
              '**Pluralismo Político:** Garantía constitucional para la coexistencia de diversas ideologías y la libre formación de partidos políticos.',
              '**Separación de Poderes:** División del poder estatal en Ejecutivo (Presidente), Legislativo (Congreso Nacional) y Judicial (Tribunales de Justicia).',
              '**Órganos Autónomos:** Instituciones independientes como la Contraloría (fiscaliza la legalidad del gasto público) y el Tribunal Constitucional.'
            ];
          } else if (secId.includes('2') || sec.order === 2) {
            sec.introduccion = 'El concepto contemporáneo de ciudadanía trasciende el mero acto de votar; abarca el ejercicio constante de derechos y la asunción de responsabilidades cívicas en la esfera pública.';
            sec.guia_contenido = `La ciudadanía plena se adquiere al cumplir 18 años de edad y no haber sido condenado a pena aflicitiva de presidio. En la democracia actual se promueve la **Ciudadanía Activa**, basada en dos dimensiones primordiales:<br><br>1. **Participación Político-Electoral:** Ejercicio del voto (en Chile, obligatorio con inscripción automática para elecciones populares) y postulación a cargos de elección pública.<br>2. **Participación Social y Civil:** Involucramiento constante en organizaciones no gubernamentales (ONGs), Juntas de Vecinos, Centros de Alumnos, voluntariados y movimientos sociales para la resolución de problemas comunitarios.<br>3. **Transparencia y Rendición de Cuentas (Accountability):** La Ley de Transparencia (N° 20.285) garantiza a los ciudadanos el acceso a la información pública, obligando a los organismos del Estado a transparentar sus actos, sueldos y contrataciones. Asimismo, las autoridades tienen el deber ético e institucional de justificar sus decisiones ante la ciudadanía.`;
            sec.datos_claves = [
              '**Requisitos de Ciudadanía:** Tener 18 años de edad y no estar condenado a pena aflicitiva (3 años y un día de cárcel o más).',
              '**Voto Obligatorio:** Restablecimiento del voto obligatorio con inscripción automática en Chile para fortalecer la participación democrática.',
              '**Participación No Electoral:** Involucramiento en la sociedad civil (Juntas de Vecinos, ONGs, voluntariados, agrupaciones ambientales).',
              '**Rendición de Cuentas (Accountability):** Deber de las autoridades públicas de responder, justificar y transparentar su gestión ante la sociedad.',
              '**Ley de Transparencia (N° 20.285):** Garantiza el derecho de cualquier ciudadano a acceder a la información de los organismos del Estado.'
            ];
          } else if (secId.includes('3') || sec.order === 3) {
            sec.introduccion = 'En la era de la información digital, los medios de comunicación y las redes sociales desempeñan un rol estratégico en la formación de la opinión pública y el debate democrático.';
            sec.guia_contenido = `Si bien Internet ha democratizado el acceso a la información y ha fortalecido la libertad de expresión, la masificación de las plataformas digitales ha introducido severos riesgos para la salud democrática:<br><br>1. **Fake News y Posverdad:** La propagación deliberada de noticias falsas diseñadas para apelar a las emociones y miedos de las personas, por sobre los hechos objetivos. Su objetivo principal es manipular procesos electorales y polarizar a la sociedad.<br>2. **Cámaras de Eco y Burbujas de Filtro:** Los algoritmos de las redes sociales muestran prioritariamente contenidos que coinciden con los gustos y sesgos previos del usuario. Esto aísla a las personas de opiniones divergentes, intensificando los sesgos de confirmación.<br>3. **Alfabetización Mediática:** Herramienta ciudadana clave para contrastar fuentes, verificar la veracidad de imágenes y textos antes de difundirlos, y fomentar un pensamiento crítico responsable en el entorno digital.`;
            sec.datos_claves = [
              '**Libertad de Expresión y Prensa:** Derecho fundamental a buscar, recibir y difundir información sin censura previa.',
              '**Desinformación y Fake News:** Información falsa creada intencionalmente para engañar, polarizar o influir en elecciones.',
              '**Cámaras de Eco:** Fenómeno generado por algoritmos que aíslan al usuario en contenido homogéneo, eliminando el debate diverso.',
              '**Posverdad:** Escenario en el que los datos objetivos influyen menos en la opinión pública que las apelaciones emocionales.',
              '**Pensamiento Crítico Digital:** Capacidad ciudadana de verificar la fuente, fecha y evidencias antes de compartir cualquier noticia.'
            ];
          } else if (secId.includes('4') || sec.order === 4) {
            sec.introduccion = 'Para asegurar la justicia y proteger los derechos fundamentales frente a abusos, Chile modernizó su administración de justicia mediante la Reforma Procesal Penal.';
            sec.guia_contenido = `Iniciada en el año 2000, la **Reforma Procesal Penal** reemplazó el antiguo sistema inquisitivo (escrito, secreto y concentrado en un solo juez) por un sistema acusatorio, oral y transparente. En este nuevo modelo, los roles están claramente delimitados:<br><br>1. **Ministerio Público (Fiscalía):** Organismo autónomo encargado de dirigir de forma exclusiva las investigaciones criminales y ejercer la acción penal pública.<br>2. **Defensoría Penal Pública:** Garantiza asesoría legal y defensa gratuita a toda persona imputada por un delito que no pueda costear un abogado privado.<br>3. **Jueces y Tribunales:** Los **Juzgados de Garantía** aseguran el respeto a los derechos constitucionales del imputado durante la investigación, mientras que los **Tribunales de Juicio Oral en lo Penal** escuchan los alegatos orales y dictan sentencia.<br>4. **Garantías Constitucionales:** Destacan la **Presunción de Inocencia** (toda persona es inocente hasta que se pruebe lo contrario), el **Recurso de Protección** (ante privación arbitraria de derechos) y el **Recurso de Amparo / Habeas Corpus** (ante arrestos ilegales o arbitrarios).`;
            sec.datos_claves = [
              '**Sistema Acusatorio Oral:** Reemplazó los juicios escritos y secretos por audiencias públicas y orales transmitidas en directo.',
              '**Ministerio Público (Fiscales):** Dirige la investigación criminal y presenta las pruebas en contra del acusado.',
              '**Defensoría Penal Pública:** Asegura el derecho irrenunciable a una defensa técnica gratuita para todo imputado.',
              '**Juez de Garantía:** Vela por los derechos del acusado y la legalidad de los procedimientos durante la investigación.',
              '**Presunción de Inocencia y Habeas Corpus:** Garantías esenciales para evitar detenciones arbitrarias y condenar sin pruebas.'
            ];
          }
        });
      }

      if (cap.id === 'cap-hist-5' || cap.id === 'cap-historia-5' || cap.order === 5) {
        cap.secciones.forEach(sec => {
          const secId = sec.id;
          if (secId.includes('1') || sec.order === 1) {
            sec.introduccion = 'La ciencia económica analiza cómo las sociedades gestionan recursos limitados para satisfacer necesidades humanas ilimitadas.';
            sec.guia_contenido = `El problema económico central es la **Escasez**. Ante recursos finitos, los agentes económicos deben tomar decisiones evaluando el **Costo de Oportunidad** (aquello a lo que se renuncia al elegir una alternativa). En una economía de libre mercado, los precios se determinan mediante la interacción de la **Oferta** (vendedores) y la **Demanda** (compradores). Sin embargo, el mercado presenta imperfecciones o fallas graves:<br><br>1. **Monopolio y Oligopolio:** Concentración de la oferta en una sola empresa o en un reducido grupo de firmas, eliminando la competencia y perjudicando a los consumidores.<br>2. **Colusión:** Acuerdo ilícito en secreto entre empresas competidoras para fijar precios artificialmente altos o repartirse cuotas de mercado (ejemplos en Chile: farmacias, papel higiénico, pollos).<br>3. **Organismos de Regulación:** La **Fiscalía Nacional Económica (FNE)** y el **Tribunal de Defensa de la Libre Competencia (TDLC)** persiguen los abusos de mercado, mientras el **SERNAC** protege los derechos de los consumidores.`;
            sec.datos_claves = [
              '**Problema de la Escasez:** Recursos limitados frente a necesidades humanas ilimitadas y continuas.',
              '**Costo de Oportunidad:** El valor de la mejor alternativa a la que se renuncia al tomar una decisión económica.',
              '**Ley de Oferta y Demanda:** Mecanismo que regula los precios según la abundancia o escasez de un producto y su demanda.',
              '**Colusión de Precios:** Práctica ilegal donde empresas competidoras pactan precios altos para eliminar la competencia.',
              '**Fiscalía Nacional Económica (FNE):** Organismo encargado de investigar y combatir las prácticas anticompetitivas en Chile.'
            ];
          } else if (secId.includes('2') || sec.order === 2) {
            sec.introduccion = 'Para financiar sus funciones, infraestructura pública y programas sociales, el Estado recauda fondos a través de la política fiscal e impuestos.';
            sec.guia_contenido = `En Chile, el marco constitucional define un **Estado Subsidiario**, el cual prioriza la iniciativa privada en la producción de bienes y servicios, reservando la intervención estatal para áreas donde los privados no invierten o para regular la actividad económica.<br><br>1. **Impuestos Directos e Indirectos:** Los impuestos directos gravan el ingreso o patrimonio (ej. Impuesto a la Renta, de carácter **progresivo** porque paga más quien más gana). Los impuestos indirectos gravan el consumo (ej. Impuesto al Valor Agregado - **IVA 19%**).<br>2. **Carácter Regresivo del IVA:** Puesto que el IVA afecta por igual a ricos y pobres al comprar un producto, representa un porcentaje proporcionalmente mayor del sueldo de las familias de menores ingresos.<br>3. **Presupuesto Nacional y Gasto Social:** El Estado redistribuir la recaudación fiscal mediante el presupuesto en salud pública, educación, pensiones solidarias y obras públicas.`;
            sec.datos_claves = [
              '**Estado Subsidiario:** El Estado interviene en la economía solo cuando el sector privado no puede o no quiere participar.',
              '**Impuesto Progresivo (Renta):** Gravamen donde la tasa porcentual aumenta a medida que aumenta el nivel de ingreso del contribuyente.',
              '**Impuesto Regresivo (IVA 19%):** Impuesto indirecto al consumo que afecta proporcionalmente más a las personas de menores ingresos.',
              '**Servicio de Impuestos Internos (SII):** Institución pública encargada de fiscalizar la correcta recaudación tributaria.',
              '**Gasto Social:** Inversión pública destinada a reducir la brecha social en salud, educación, vivienda y protección social.'
            ];
          } else if (secId.includes('3') || sec.order === 3) {
            sec.introduccion = 'El trabajo no es solo un factor de producción económica; es un pilar de la dignidad humana que requiere de protección legal frente al poder del empleador.';
            sec.guia_contenido = `El **Código del Trabajo** regula las relaciones laborales entre trabajadores y empleadores en Chile. El vínculo legal se formaliza mediante el **Contrato de Trabajo**, el cual debe escriturarse en un plazo máximo de 15 días e incluir la naturaleza de las funciones, remuneración, lugar y jornada laboral.<br><br>1. **Derechos Laborales Fundamentales:** Sueldo mínimo vital, jornada laboral de 40 horas semanales, descanso dominical, vacaciones pagadas (15 días hábiles al año) e indemnización por años de servicio.<br>2. **Protección a la Maternidad:** Fuero maternal (protección contra despidos desde el embarazo hasta un año después de expirado el postnatal) y derecho a salas cuna.<br>3. **Organización Sindical y Negociación Colectiva:** Los trabajadores tienen derecho constitucional a constituir sindicatos libres sin autorización previa, negociar colectivamente sus condiciones salariales y ejercer la huelga legal dentro del proceso de negociación.<br>4. **Dirección del Trabajo (DT):** Organismo encargado de fiscalizar el cumplimiento de la legislación laboral y sancionar los abusos de los empleadores.`;
            sec.datos_claves = [
              '**Contrato de Trabajo:** Documento obligatorio que establece derechos, obligaciones, sueldo y jornada de trabajo.',
              '**Jornada Laboral y Sueldo Mínimo:** Normativa legal que limita las horas de trabajo semanales y fija un piso salarial irrenunciable.',
              '**Fuero Maternal:** Garantía constitucional que protege a las trabajadoras de ser despedidas durante el embarazo y postnatal.',
              '**Libertad Sindical y Huelga:** Derecho de los trabajadores a organizarse en sindicatos y declararse en huelga legal.',
              '**Dirección del Trabajo (DT):** Institución fiscalizadora que vela por el cumplimiento de los contratos y normas laborales.'
            ];
          } else if (secId.includes('4') || sec.order === 4) {
            sec.introduccion = 'El gran desafío del siglo XXI es lograr un equilibrio entre el crecimiento económico, la equidad social y la preservación de los ecosistemas del planeta.';
            sec.guia_contenido = `La globalización ha integrado fuertemente a Chile en los mercados mundiales mediante el modelo exportador de recursos naturales (cobre, litio, productos agrícolas, madera y salmón) y la firma de **Tratados de Libre Comercio (TLCs)** con las principales potencias (EE.UU., China, Unión Europea).<br><br>1. **Desarrollo Sostenible:** Concepto impulsado por la ONU (Agenda 2030) que define el desarrollo como aquel capaz de satisfacer las necesidades de las generaciones presentes sin comprometer la capacidad de las generaciones futuras para satisfacer sus propias necesidades.<br>2. **Desafíos Ambientales de Chile:** Escasez hídrica y megasequía, contaminación en zonas de sacrificio industrial, descarbonización de la matriz energética y gestión de residuos mineros.<br>3. **Economía Circular y Transición Energética:** Cambio desde una economía lineal (extraer, usar, tirar) hacia la reutilización de materiales, la masificación de energías renovables no convencionales (solar y eólica) y la producción de Hidrógeno Verde.`;
            sec.datos_claves = [
              '**Integración Global y TLCs:** Apertura comercial de Chile con más de 60 países para exportar materias primas e importar tecnología.',
              '**Desarrollo Sostenible (ONU):** Crecimiento económico respetuoso con el medio ambiente y justo socialmente.',
              '**Matriz Energética Limpia:** Transición acelerada hacia energía solar y eólica para reducir las emisiones de carbono.',
              '**Economía Circular:** Modelo de producción que prioriza reparar, reciclar y reutilizar recursos para minimizar residuos.',
              '**Zonas de Sacrificio:** Áreas con alta concentración industrial que exigen mayor regulación ambiental para proteger a la población.'
            ];
          }
        });
      }
    });
  }

  private loadLocalFallbacks() {
    this._materias.set(LOCAL_MATERIAS);
    this._poolPreguntas.set(LOCAL_POOL_PREGUNTAS);
    this.applyHistoriaImageMapping(CAPITULOS);
    this.enrichHistoriaChapters4And5(CAPITULOS);
    this._capitulos.set(CAPITULOS);
  }

  // ─── Queries ───

  getMateriaById(id: string): Materia | undefined {
    if (id === 'quimica' || id === 'ciencias-quimica') {
      return this._materias().find(m => m.id === 'ciencias-quimica' || m.id === 'quimica') || this._materias().find(m => m.id === 'ciencias');
    }
    return this._materias().find(m => m.id === id);
  }

  getCapitulosByMateria(materiaId: string): Capitulo[] {
    if (materiaId === 'quimica' || materiaId === 'ciencias-quimica') {
      const chemistryCaps = this._capitulos().filter(c => c.materiaId === 'ciencias-quimica' || c.materiaId === 'quimica');
      if (chemistryCaps.length > 0) return chemistryCaps;
    }
    return this._capitulos().filter(c => c.materiaId === materiaId);
  }

  getNextNodeUrl(materiaId: string): string[] | null {
    const capitulos = this.getCapitulosByMateria(materiaId).sort((a, b) => a.order - b.order);

    for (const cap of capitulos) {
      const guideProg = this.getSeccionProgress('guide_' + cap.id);
      const isGuideCompleted = guideProg?.completed || false;

      if (!isGuideCompleted) {
        return ['/ruta', materiaId, cap.id];
      }

      const secciones = [...cap.secciones].sort((a, b) => a.order - b.order);
      for (const sec of secciones) {
        const prog = this.getSeccionProgress(sec.id);
        const isCompleted = prog?.completed || false;
        if (!isCompleted) {
          return ['/ruta', materiaId, cap.id, sec.id];
        }
      }
    }

    return null;
  }

  getStrictNextNodeUrl(seccionId: string): string[] | null {
    const cap = this.getCapituloBySeccionId(seccionId);
    if (!cap) return null;
    const secciones = [...cap.secciones].sort((a, b) => a.order - b.order);
    const currentIndex = secciones.findIndex(s => s.id === seccionId);

    if (currentIndex >= 0 && currentIndex < secciones.length - 1) {
      return ['/ruta', cap.materiaId, cap.id, secciones[currentIndex + 1].id];
    } else {
      // It's the last section of the chapter, find next chapter
      const capitulos = this.getCapitulosByMateria(cap.materiaId).sort((a, b) => a.order - b.order);
      const capIndex = capitulos.findIndex(c => c.id === cap.id);
      if (capIndex >= 0 && capIndex < capitulos.length - 1) {
        const nextCap = capitulos[capIndex + 1];
        return ['/ruta', cap.materiaId, nextCap.id]; // Go to next chapter's guide
      }
    }
    return null; // There is no next level (end of course)
  }

  getCapituloById(capituloId: string): Capitulo | undefined {
    return this._capitulos().find(c => c.id === capituloId);
  }

  getSeccionById(seccionId: string): Seccion | undefined {
    for (const cap of this._capitulos()) {
      const sec = cap.secciones.find(s => s.id === seccionId);
      if (sec) return sec;
    }
    return undefined;
  }

  getCapituloBySeccionId(seccionId: string): Capitulo | undefined {
    return this._capitulos().find(cap =>
      cap.secciones.some(sec => sec.id === seccionId)
    );
  }

  getTestBySeccionId(seccionId: string): TestPaes | undefined {
    const seccion = this.getSeccionById(seccionId);
    return seccion?.test;
  }

  // ─── Progreso ───

  getSeccionProgress(seccionId: string): SeccionProgress | undefined {
    return this._progress().get(seccionId);
  }

  getCapituloProgress(capituloId: string): { completed: number; total: number; percentage: number } {
    const cap = this.getCapituloById(capituloId);
    if (!cap) return { completed: 0, total: 0, percentage: 0 };

    const total = cap.secciones.length;
    let completed = 0;
    for (const sec of cap.secciones) {
      const p = this._progress().get(sec.id);
      if (p && p.completed) completed++;
    }
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }

  getMateriaProgress(materiaId: string): { completed: number; total: number; percentage: number } {
    const caps = this.getCapitulosByMateria(materiaId);
    let totalSec = 0;
    let completedSec = 0;
    for (const cap of caps) {
      for (const sec of cap.secciones) {
        totalSec++;
        const p = this._progress().get(sec.id);
        if (p && p.completed) completedSec++;
      }
    }
    return { completed: completedSec, total: totalSec, percentage: totalSec > 0 ? Math.round((completedSec / totalSec) * 100) : 0 };
  }

  // ─── Submitting test ───

  submitTest(seccionId: string, answers: Map<number, 'A' | 'B' | 'C' | 'D'>): TestResult {
    const test = this.getTestBySeccionId(seccionId);
    if (!test) throw new Error('Test not found');

    const seccion = this.getSeccionById(seccionId);
    const gradedAnswers: TestAnswer[] = test.preguntas.map(p => {
      const selected = answers.get(p.id) || null;
      return {
        preguntaId: p.id,
        selectedOption: selected,
        isCorrect: selected === p.respuesta_correcta
      };
    });

    const totalCorrect = gradedAnswers.filter(a => a.isCorrect).length;
    const score = Math.round((totalCorrect / test.preguntas.length) * 100);

    const result: TestResult = {
      seccionId,
      answers: gradedAnswers,
      score,
      totalCorrect,
      totalQuestions: test.preguntas.length,
      completedAt: new Date().toISOString()
    };

    // Update progress
    const currentProgress = this._progress().get(seccionId);
    const isPassing = seccionId === 'loc-boss' ? totalCorrect >= 10 : score === 100;
    const newProgress: SeccionProgress = {
      seccionId,
      capituloId: seccion?.capituloId || '',
      materiaId: seccion?.materiaId || '',
      completed: (currentProgress?.completed || false) || isPassing,
      bestScore: Math.max(currentProgress?.bestScore || 0, score),
      totalQuestions: test.preguntas.length,
      correctAnswers: totalCorrect,
      lastAttemptDate: result.completedAt,
      attempts: (currentProgress?.attempts || 0) + 1
    };

    const newMap = new Map(this._progress());
    newMap.set(seccionId, newProgress);
    this._progress.set(newMap);
    this._lastTestResult.set(result);

    this.saveProgressToStorage();

    // Log activity to dashboard
    try {
      const materia = this.getMateriaById(seccion?.materiaId || '');
      this.dashSvc.logLessonCompleted({
        seccionId,
        title: seccion?.title || 'Lección',
        subject: seccion?.materiaId || '',
        subjectIcon: materia?.icon || '📚',
        score,
        totalCorrect,
        totalQuestions: test.preguntas.length,
      });
    } catch { /* ignore */ }

    return result;
  }

  markSeccionCompleted(seccionId: string): void {
    const seccion = this.getSeccionById(seccionId);
    const currentProgress = this._progress().get(seccionId);
    const newProgress: SeccionProgress = {
      seccionId,
      capituloId: seccion?.capituloId || '',
      materiaId: seccion?.materiaId || '',
      completed: true,
      bestScore: 100,
      totalQuestions: 0,
      correctAnswers: 0,
      lastAttemptDate: new Date().toISOString(),
      attempts: (currentProgress?.attempts || 0) + 1
    };

    const newMap = new Map(this._progress());
    newMap.set(seccionId, newProgress);
    this._progress.set(newMap);
    this.saveProgressToStorage();
  }

  markSeccionIncomplete(seccionId: string): void {
    const newMap = new Map(this._progress());
    newMap.delete(seccionId);
    this._progress.set(newMap);
    this.saveProgressToStorage();
  }


  // ─── Persistence (localStorage) ───

  private saveProgressToStorage(): void {
    const uid = this.currentUid || 'offline';
    const obj: Record<string, SeccionProgress> = {};
    this._progress().forEach((v, k) => { obj[k] = v; });
    localStorage.setItem(`paes_progress_${uid}`, JSON.stringify(obj));
  }

  private loadProgressFromStorage(): void {
    const uid = this.currentUid || 'offline';
    try {
      const raw = localStorage.getItem(`paes_progress_${uid}`);
      if (raw) {
        const obj = JSON.parse(raw) as Record<string, SeccionProgress>;
        const map = new Map<string, SeccionProgress>();
        Object.entries(obj).forEach(([k, v]) => map.set(k, v));
        this._progress.set(map);
      }
    } catch { /* ignore */ }
  }
}
