import { Injectable, signal, computed, inject, Injector } from '@angular/core';
import { Materia, Capitulo, Seccion, TestPaes, SeccionProgress, TestResult, TestAnswer } from '../models/paes.models';
import { Firestore, collection, getDocs, collectionGroup } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { DashboardService } from '../../../core/services/dashboard.service';

const LOCAL_MATERIAS: Materia[] = [
  { id: 'comp-lectora', title: 'Competencia Lectora', slug: 'competencia-lectora', icon: '📖', order: 1, isActive: true, imageUrl: 'assets/images/subjects/comp-lectora.png' },
  { id: 'mat1', title: 'Matemática 1', slug: 'matematica-1', icon: '📐', order: 2, isActive: true },
  { id: 'mat2', title: 'Matemática M2', slug: 'matematica-2', icon: '✏️', order: 3, isActive: true },
  { id: 'historia', title: 'Historia y Cs. Sociales', slug: 'historia', icon: '🏛️', order: 4, isActive: true },
  { id: 'ciencias', title: 'Ciencias', slug: 'ciencias', icon: '🧬', order: 5, isActive: true }
];

const LOCAL_CAPITULOS: Capitulo[] = [
  {
    id: 'cap-lectora-1',
    materiaId: 'comp-lectora',
    title: 'Habilidad 1: Localizar',
    introduccion: 'Localizar es la habilidad de identificar y extraer información explícita de un texto.',
    order: 1,
    secciones: [
      {
        id: 'sec-lectora-1',
        capituloId: 'cap-lectora-1',
        materiaId: 'comp-lectora',
        title: '1. Rastrear información explícita',
        introduccion: 'La respuesta está literal en el texto. Tu misión es encontrar la información exacta.',
        datos_claves: ['Busca palabras clave', 'La respuesta puede usar sinónimos'],
        order: 1,
        test: {
          id: 'test-lectora-1',
          seccionId: 'sec-lectora-1',
          contexto_base: 'Generalmente, el envejecimiento demográfico es visto como una consecuencia inevitable...',
          preguntas: [
            {
              id: 101,
              enunciado: 'Con respecto al análisis demográfico, ¿cuál es la relación establecida entre el primer y segundo párrafo?',
              alternativas: {
                A: 'El primero presenta el problema del envejecimiento; el segundo muestra cómo medirlo.',
                B: 'El primero explica las tasas; el segundo compara continentes.',
                C: 'El primero define la transición; el segundo plantea los indicadores.',
                D: 'El primero categoriza factores; el segundo explica reemplazos.'
              },
              respuesta_correcta: 'C',
              feedback_acierto: '¡Excelente deducción! El primer párrafo establece el marco teórico (qué es la transición), y el segundo detalla cómo se mide.',
              feedback_error: '¡Ojo con la estructura! Vuelve a leer el inicio de ambos párrafos.'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'cap-mat1-1',
    materiaId: 'mat1',
    title: 'Números y Proporcionalidad',
    introduccion: 'Domina los conceptos básicos de conjuntos numéricos y razones.',
    order: 1,
    secciones: [
      {
        id: 'sec-mat1-1',
        capituloId: 'cap-mat1-1',
        materiaId: 'mat1',
        title: '1. Porcentajes en la Vida Diaria',
        introduccion: 'Aprende a calcular descuentos, aumentos e interés simple.',
        datos_claves: ['Un porcentaje es una fracción de 100', 'Descuento del X% multiplica por (1 - X/100)'],
        order: 1,
        test: {
          id: 'test-mat1-1',
          seccionId: 'sec-mat1-1',
          contexto_base: null,
          preguntas: [
            {
              id: 201,
              enunciado: 'Un pantalón cuesta $25.000, pero está con un 20% de descuento. Si al pagar en caja se aplica un recargo del 5% sobre el precio ya descontado, ¿cuál es el valor final a pagar?',
              alternativas: {
                A: '$19.000',
                B: '$20.000',
                C: '$21.000',
                D: '$21.250'
              },
              respuesta_correcta: 'C',
              feedback_acierto: '¡Correcto! Primero calculamos el descuento: $25.000 * 0.8 = $20.000. Luego, aplicamos el recargo del 5% sobre ese monto: $20.000 * 1.05 = $21.000.',
              feedback_error: 'Revisa los pasos. Primero aplica el descuento al precio original, y luego aplica el recargo al nuevo precio.'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'cap-mat2-1',
    materiaId: 'mat2',
    title: 'Álgebra Superior y Geometría M2',
    introduccion: 'Aprende sistemas de ecuaciones complejos, logaritmos y geometría analítica.',
    order: 1,
    secciones: [
      {
        id: 'sec-mat2-1',
        capituloId: 'cap-mat2-1',
        materiaId: 'mat2',
        title: '1. Logaritmos y Ecuaciones Exponenciales',
        introduccion: 'Domina las propiedades de los logaritmos y resolución de ecuaciones exponenciales.',
        datos_claves: ['log_b(a) = c equivale a b^c = a', 'Propiedades de multiplicación, división y potencias en logaritmos'],
        order: 1,
        test: {
          id: 'test-mat2-1',
          seccionId: 'sec-mat2-1',
          contexto_base: null,
          preguntas: [
            {
              id: 301,
              enunciado: 'Si log_2(x) = 5, ¿cuál es el valor de x?',
              alternativas: {
                A: '10',
                B: '25',
                C: '32',
                D: '64'
              },
              respuesta_correcta: 'C',
              feedback_acierto: '¡Excelente! Usando la definición de logaritmo, log_2(x) = 5 es equivalente a 2^5 = x, por lo tanto x = 32.',
              feedback_error: 'Recuerda que el logaritmo es la operación inversa de la exponenciación. log_b(x) = y implica b^y = x.'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'cap-historia-1',
    materiaId: 'historia',
    title: 'Historia de Chile y el Mundo',
    introduccion: 'Analiza los procesos históricos, políticos, económicos y sociales contemporáneos.',
    order: 1,
    secciones: [
      {
        id: 'sec-historia-1',
        capituloId: 'cap-historia-1',
        materiaId: 'historia',
        title: '1. El Ciclo del Salitre',
        introduccion: 'Comprende el impacto económico del salitre tras la Guerra del Pacífico y la Cuestión Social.',
        datos_claves: ['El salitre generó grandes ingresos al Estado', 'La Cuestión Social refiere a las precarias condiciones laborales'],
        order: 1,
        test: {
          id: 'test-historia-1',
          seccionId: 'sec-historia-1',
          contexto_base: 'Durante la época del salitre en Chile (1880-1930), la economía nacional dependió casi exclusivamente de las exportaciones de este mineral...',
          preguntas: [
            {
              id: 401,
              enunciado: 'Según el texto, ¿cuál fue una consecuencia económica directa para el Estado chileno producto del ciclo salitrero?',
              alternativas: {
                A: 'La nacionalización total de las empresas salitreras extranjeras.',
                B: 'La disminución de la burocracia y el gasto público estatal.',
                C: 'El aumento de los ingresos fiscales mediante el cobro de impuestos de exportación.',
                D: 'La erradicación de la pobreza gracias a la equitativa distribución de las ganancias.'
              },
              respuesta_correcta: 'C',
              feedback_acierto: '¡Muy bien! El texto menciona explícitamente que el Estado cobraba un impuesto que multiplicó sus ingresos y permitió expandir el aparato estatal.',
              feedback_error: 'Vuelve a leer el texto. Fíjate en cómo obtenía dinero el Estado.'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'cap-ciencias-1',
    materiaId: 'ciencias',
    title: 'Biología Celular y Ecosistemas',
    introduccion: 'Comprende las diferencias entre células procariontes y eucariontes, y sus organelos.',
    order: 1,
    secciones: [
      {
        id: 'sec-ciencias-1',
        capituloId: 'cap-ciencias-1',
        materiaId: 'ciencias',
        title: '1. Tipos de Células',
        introduccion: 'Aprende a distinguir las características clave de procariontes y eucariontes (animal y vegetal).',
        datos_claves: ['Las células procariontes no tienen núcleo definido', 'Las células eucariontes vegetales poseen pared celular y cloroplastos'],
        order: 1,
        test: {
          id: 'test-ciencias-1',
          seccionId: 'sec-ciencias-1',
          contexto_base: null,
          preguntas: [
            {
              id: 501,
              enunciado: 'Al observar una muestra de tejido bajo el microscopio, se nota la presencia de una pared celular rígida y grandes vacuolas centrales. ¿A qué tipo de célula pertenece?',
              alternativas: {
                A: 'A un animal vertebrado.',
                B: 'A una bacteria (procarionte).',
                C: 'A una planta (eucarionte vegetal).',
                D: 'A un hongo filamentoso.'
              },
              respuesta_correcta: 'C',
              feedback_acierto: '¡Correcto! La pared celular y las grandes vacuolas centrales son características distintivas de las células eucariontes vegetales.',
              feedback_error: 'Recuerda las diferencias estructurales. Las células animales no tienen pared celular.'
            }
          ]
        }
      }
    ]
  }
];

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
      // Forzar uso de mocks locales para desarrollo local (mejora-m1)
      const useMocks = false;
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
      this._materias.set(materias.sort((a, b) => a.order - b.order));

      // 2. Cargar capítulos mock (usando ruta absoluta)
      const capitulosRes = await fetch('/assets/mocks/capitulos-mock-local.json');
      if (!capitulosRes.ok) throw new Error('capitulos-mock-local.json not found');
      const capitulos = await capitulosRes.json() as Capitulo[];
      this._capitulos.set(capitulos.sort((a, b) => a.order - b.order));
      

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

  private async loadDataFromFirestore() {
    const cacheKey = 'paes_content_cache_v11';
    const cacheTimeKey = 'paes_content_cache_timestamp_v11';
    const cacheTTL = 30 * 60 * 1000; // 30 minutos

    try {
      // 0. Intentar cargar desde caché
      const cachedDataRaw = localStorage.getItem(cacheKey);
      const cachedTimeRaw = localStorage.getItem(cacheTimeKey);

      if (cachedDataRaw && cachedTimeRaw) {
        const cachedTime = parseInt(cachedTimeRaw, 10);
        if (Date.now() - cachedTime < cacheTTL) {
          const cached = JSON.parse(cachedDataRaw);
          if (cached.materias && cached.poolPreguntas && cached.capitulos) {

            this._materias.set(cached.materias);
            this._poolPreguntas.set(cached.poolPreguntas);
            this._capitulos.set(cached.capitulos);
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
        const seccion = {
          ...secData,
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

      for (const capDoc of capitulosSnap.docs) {
        const capData = capDoc.data() as Omit<Capitulo, 'secciones'>;
        const secciones = seccionesByCapitulo.get(capDoc.id) || [];

        capitulos.push({
          ...capData,
          id: capDoc.id,
          secciones: secciones.sort((a, b) => a.order - b.order)
        });
      }

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
        }

        const sortedMaterias = materias.sort((a, b) => a.order - b.order);
        const finalPool = poolArray.length > 0 ? poolArray : LOCAL_POOL_PREGUNTAS;
        const sortedCapitulos = capitulos.sort((a, b) => a.order - b.order);

        this._materias.set(sortedMaterias);
        this._poolPreguntas.set(finalPool);
        this._capitulos.set(sortedCapitulos);

        // Guardar en caché
        try {
          const cacheData = {
            materias: sortedMaterias,
            poolPreguntas: finalPool,
            capitulos: sortedCapitulos
          };
          localStorage.setItem(cacheKey, JSON.stringify(cacheData));
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

  private loadLocalFallbacks() {
    this._materias.set(LOCAL_MATERIAS);
    this._poolPreguntas.set(LOCAL_POOL_PREGUNTAS);
    this._capitulos.set(LOCAL_CAPITULOS);
  }

  // ─── Queries ───

  getMateriaById(id: string): Materia | undefined {
    return this._materias().find(m => m.id === id);
  }

  getCapitulosByMateria(materiaId: string): Capitulo[] {
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
