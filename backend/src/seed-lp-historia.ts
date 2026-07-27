import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config();

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: privateKey,
  }),
});

const db = admin.firestore();

// ─── Data ───
const MATERIAS = [
  { id: 'historia', title: 'Historia y Cs. Sociales', slug: 'historia', icon: '🏛️', order: 3, isActive: true },
];

const CAPITULOS = [
  // ==========================================
  // CAPITULO 1: La Era de las Repúblicas y el Siglo XIX
  // ==========================================
  {
    id: 'cap-hist-1',
    materiaId: 'historia',
    title: 'La Era de las Repúblicas y el Siglo XIX',
    introduccion: 'Explora el surgimiento de los Estados-Nación, el impacto del liberalismo y la Revolución Industrial en Chile y el mundo.',
    order: 1,
    paesWeight: '15% de la PAES',
        imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783833823/xetvuw6swkjlckxrxzrh.jpg',

    secciones: [
      {
        id: 'sec-hist-1-1',
        title: '1. Ideas liberales en Europa',
        introduccion: 'Durante el siglo XIX, las ideas liberales, herederas de la Ilustración y la Revolución Francesa, reconfiguraron el mapa político y económico de Occidente.',
        guia_titulo: '📖 Teoría y Contexto Histórico',
        guia_contenido: `Durante el siglo XIX, las ideas liberales, herederas de la Ilustración y la Revolución Francesa, reconfiguraron el mapa político y económico de Occidente. Este movimiento intelectual y político surgió como respuesta al absolutismo monárquico, buscando limitar el poder del Estado y garantizar los derechos fundamentales del individuo. En América Latina, estas ideas cruzaron el océano impulsadas por la burguesía criolla, convirtiéndose en el motor ideológico fundamental para los procesos de independencia y la posterior construcción de las jóvenes repúblicas.`,
        datos_claves: [
          '**Liberalismo Político:** Promueve la soberanía popular (el poder reside en el pueblo), la separación de los poderes del Estado (Ejecutivo, Legislativo y Judicial) y el constitucionalismo (existencia de una carta magna que rige la nación).',
          '**Liberalismo Económico (Adam Smith):** Defiende el libre mercado, la propiedad privada como derecho inalienable, la libre competencia y la nula intervención del Estado en la economía (Laissez-faire).',
          '**Impacto en América Latina:** Fomentó el republicanismo, el deseo de autonomía comercial (romper el monopolio español) y la instauración de derechos civiles para los ciudadanos (aunque inicialmente limitados a la élite).',
          '**Burguesía:** Clase social clave del siglo XIX. Dueños de capitales y medios de producción, fueron los principales impulsores y beneficiarios de las ideas liberales y capitalistas.',
          '**Nacionalismo:** Surge paralelo al liberalismo. Es el sentimiento de pertenencia a una nación con idioma, historia y cultura comunes, impulsando la unificación de países (como Italia y Alemania).'
        ],
        order: 1,        imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905037/vyqnyijownlrane4caw2.jpg',

        test: {
          id: 'test-hist-1-1',
          contexto_base: 'Durante el siglo XIX, las ideas liberales herederas de la Ilustración y la Revolución Francesa se expandieron por Europa. El liberalismo político proponía el fin de las monarquías absolutas, exigiendo constituciones escritas, separación de los poderes del Estado y soberanía popular. En el aspecto económico, defendía el libre mercado y la propiedad privada. Estas ideas cruzaron el océano y fueron el motor ideológico de los procesos de independencia en América Latina.',
          preguntas: [
            { id: 3101, enunciado: '¿Cuál de los siguientes principios es fundamental en el pensamiento liberal político del siglo XIX?', alternativas: { A: 'La concentración del poder en un monarca.', B: 'La separación de los poderes del Estado.', C: 'La abolición de la propiedad privada.', D: 'La defensa de los privilegios de la nobleza.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Separar los poderes (Ejecutivo, Legislativo, Judicial) evita la tiranía.', feedback_error: 'El liberalismo buscaba limitar el poder del rey, dividiendo las funciones del Estado.' },
            { id: 3102, enunciado: '¿Qué impacto directo tuvieron las ideas liberales europeas en América Latina durante el siglo XIX?', alternativas: { A: 'Impulsaron la creación de virreinatos más fuertes.', B: 'Inspiraron los procesos de independencia y la creación de repúblicas.', C: 'Promovieron el establecimiento de regímenes comunistas.', D: 'Frenaron el desarrollo del libre comercio.' }, respuesta_correcta: 'B', feedback_acierto: '¡Muy bien! Los próceres latinoamericanos se inspiraron en estas ideas para fundar repúblicas independientes.', feedback_error: 'Recuerda que el liberalismo se oponía a las colonias y monarquías; buscaba la libertad y soberanía.' }
          ]
        }
      },
      {
        id: 'sec-hist-1-2',
        title: '2. Formación de la República de Chile',
        introduccion: 'Tras consolidar su independencia, Chile enfrentó una etapa de intensa búsqueda de organización política conocida como "Ensayos Constitucionales" (1823-1830).',
        guia_titulo: '📖 Teoría y Contexto Histórico',
        guia_contenido: `Tras consolidar su independencia, Chile enfrentó una etapa de intensa búsqueda de organización política conocida como "Ensayos Constitucionales" (1823-1830). Este periodo de inestabilidad culminó con el triunfo del bando conservador (pelucones) en la Batalla de Lircay. A partir de entonces, bajo la figura omnipotente del ministro Diego Portales, se instaló un régimen político altamente autoritario y centralizado, cristalizado en la Constitución de 1833. Esta carta magna priorizó el orden por sobre las libertades, sentando las bases del Estado chileno durante el resto del siglo.`,
        datos_claves: [
          '**Ensayos Constitucionales:** Periodo de aprendizaje político donde se intentaron varios modelos: Moralista (1823), Federal (1826) y Liberal (1828), fracasando por la inexperiencia y pugnas internas.',
          '**El Orden Portaliano:** Ideología práctica de Diego Portales. Desconfiaba de la democracia y promovía un "gobierno fuerte, centralizador, cuyos hombres sean verdaderos modelos de virtud y patriotismo", para educar al pueblo.',
          '**Constitución de 1833:** Redactada principalmente por Mariano Egaña. Estableció un Ejecutivo con facultades extraordinarias (veto, estado de sitio), un Congreso con menos poder, religión católica oficial y exclusiva, y voto censitario.',
          '**Voto Censitario:** Solo podían votar los hombres, mayores de 21 (casados) o 25 (solteros), que supieran leer y escribir, y que tuvieran una propiedad o renta específica. La política era exclusiva de la élite.',
          '**Guerra contra la Confederación Perú-Boliviana:** Primer conflicto externo (1836-1839). Portales la impulsó por temor geopolítico y por la competencia comercial entre Valparaíso y El Callao. Consolidó la identidad nacional.'
        ],
        order: 2,        imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905036/h8krgjj2g5o8nfw0zcb1.jpg',

        test: {
          id: 'test-hist-1-2',
          contexto_base: 'Tras consolidar su independencia, Chile enfrentó el desafío de organizar su naciente república. Después de una década de inestabilidad política conocida como "Ensayos Constitucionales" (1823-1830), el bando conservador o "pelucón" triunfó en la batalla de Lircay. Bajo la influencia del ministro Diego Portales, se promulgó la Constitución de 1833, la cual instauró un régimen político altamente centralizado, autoritario y presidencialista. Este "orden portaliano" buscaba estabilidad por sobre las libertades individuales, apoyándose en la Iglesia Católica y restringiendo el derecho a voto solo a los hombres que poseyeran propiedades o ingresos (voto censitario).',
          preguntas: [
            { id: 3103, enunciado: 'Una de las características principales de la Constitución de 1833 en Chile fue:', alternativas: { A: 'Establecer un régimen parlamentario descentralizado.', B: 'Otorgar amplias facultades y poder al Presidente de la República.', C: 'Separar definitivamente a la Iglesia del Estado.', D: 'Instaurar el sufragio universal para hombres y mujeres.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Fue un texto que buscaba el orden a través de un Ejecutivo muy fuerte.', feedback_error: 'La idea central de Portales era el "orden". Para ello, la Constitución le dio muchísimo poder al Presidente.' },
            { id: 3104, enunciado: 'El sistema de "voto censitario" establecido en la época implicaba que:', alternativas: { A: 'Solo podían votar los militares en servicio activo.', B: 'Se realizaba un censo anual para obligar a todos a votar.', C: 'El derecho a voto estaba restringido a quienes poseyeran bienes o rentas.', D: 'Las autoridades eclesiásticas elegían a los representantes.' }, respuesta_correcta: 'C', feedback_acierto: '¡Muy bien! "Censitario" viene de censo de riqueza. Solo la élite económica participaba en política.', feedback_error: 'El voto no era un derecho universal. Dependía de una condición económica específica.' }
          ]
        }
      },
      {
        id: 'sec-hist-1-3',
        title: '3. Inserción de Chile en la economía global',
        introduccion: 'Durante la segunda mitad del siglo XIX, Chile abandonó el aislamiento colonial para integrarse de lleno en el sistema capitalista mundial.',
        guia_titulo: '📖 Teoría y Contexto Histórico',
        guia_contenido: `Durante la segunda mitad del siglo XIX, Chile abandonó el aislamiento colonial para integrarse de lleno en el sistema capitalista mundial. Apoyado en las ideas del liberalismo económico, el país adoptó un modelo de "Crecimiento hacia afuera", convirtiéndose en un activo exportador de materias primas e importador de manufacturas. Este auge económico, impulsado por descubrimientos mineros y la demanda agrícola internacional, enriqueció a la oligarquía y permitió modernizar la infraestructura nacional, aunque sentó las bases de una profunda dependencia externa.`,
        datos_claves: [
          '**Crecimiento hacia afuera:** Modelo económico donde el desarrollo del país depende de la demanda externa por sus materias primas, dejando a la economía vulnerable a las crisis internacionales.',
          '**Auge Agrícola:** Fiebres del oro en California y Australia generaron una demanda explosiva de trigo chileno, reactivando la agricultura del valle central y fortaleciendo a los latifundistas.',
          '**Ciclo Minero:** Descubrimiento de plata (Chañarcillo, Tres Puntas) y carbón (Lota). La minería atrajo capitales extranjeros y motivó la creación de las primeras redes ferroviarias.',
          '**Valparaíso:** Se consolidó como el puerto principal del Pacífico Sur, atrayendo inmigrantes y casas comerciales británicas y alemanas, impulsando el libre comercio.',
          '**Estado Docente y Secularización:** En paralelo al auge económico, el Estado asumió el rol de educar (creación U. de Chile, 1842). Los liberales impulsaron las "Leyes Laicas" (cementerios, registro civil, matrimonio) restando poder a la Iglesia.'
        ],
        order: 3,        imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905037/zfr8xuvtisumjbojzai9.jpg',

        test: {
          id: 'test-hist-1-3',
          contexto_base: 'A mediados del siglo XIX, Chile se integró a la economía mundial capitalista asumiendo el rol de proveedor de materias primas. Aprovechando el descubrimiento de oro en California y Australia, Chile exportó masivamente trigo hacia esos mercados. Además, la minería despuntó con los yacimientos de plata (Chañarcillo) y cobre. Este modelo exportador primario enriqueció a la élite y permitió modernizar el país con la construcción de ferrocarriles y la consolidación del puerto de Valparaíso como centro comercial, pero al mismo tiempo generó una alta dependencia económica de los mercados extranjeros.',
          preguntas: [
            { id: 3105, enunciado: 'El modelo económico adoptado por Chile a mediados del siglo XIX se conoce como "Crecimiento hacia afuera". ¿Qué significa esto?', alternativas: { A: 'El desarrollo de una fuerte industria manufacturera para competir en Europa.', B: 'El cierre de las fronteras para proteger la economía local.', C: 'La priorización de la exportación de materias primas hacia mercados internacionales.', D: 'La expansión territorial mediante la compra de países vecinos.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! La economía crecía en la medida en que vendíamos recursos naturales "hacia afuera".', feedback_error: 'Piensa en qué producía Chile (trigo, minerales) y adónde iban a parar esos productos.' },
            { id: 3106, enunciado: 'Una consecuencia directa de este modelo exportador primario fue:', alternativas: { A: 'La dependencia de la economía chilena respecto a la demanda de los países industrializados.', B: 'La industrialización inmediata de todo el territorio nacional.', C: 'La erradicación total de la pobreza rural.', D: 'El fin del latifundio agrícola.' }, respuesta_correcta: 'A', feedback_acierto: '¡Muy bien! Si Europa o EE.UU. dejaban de comprar, la economía chilena entraba en crisis.', feedback_error: 'Si un país solo vende trigo y rocas de mineral, ¿qué pasa cuando los compradores externos ya no los necesitan?' }
          ]
        }
      },
      {
        id: 'sec-hist-1-4',
        title: '4. El ciclo del salitre',
        introduccion: 'Tras la victoria en la Guerra del Pacífico (1879-1884), Chile anexó los territorios ricos en salitre del norte grande.',
        guia_titulo: '📖 Teoría y Contexto Histórico',
        guia_contenido: `Tras la victoria en la Guerra del Pacífico (1879-1884), Chile anexó los territorios ricos en salitre del norte grande. Este mineral, vital para el mundo como fertilizante y explosivo, inauguró una era de riqueza sin precedentes. El Estado decidió no explotar directamente las salitreras, dejándolas en manos de privados (mayoritariamente capitales británicos) y cobrando un alto impuesto de exportación. Estos cuantiosos ingresos fiscales modernizaron el país, pero acentuaron las desigualdades sociales, creando el caldo de cultivo para futuras crisis.`,
        datos_claves: [
          '**El monopolio mundial:** Chile quedó como el único gran proveedor de nitrato natural, lo que disparó las arcas fiscales mediante el cobro de derechos aduaneros de exportación.',
          '**El rol del Estado y Privados:** El Estado no fue empresario, fue rentista. Empresarios como el inglés John Thomas North ("El Rey del Salitre") controlaron la producción, transporte y comercio del mineral.',
          '**Obras Públicas:** El dinero del salitre financió ferrocarriles de norte a sur, puertos, puentes (Viaducto del Malleco), edificios gubernamentales y expansión de la educación pública.',
          '**La vida en la Pampa:** Los obreros vivían aislados en "Oficinas Salitreras". Sufrían jornadas extenuantes, pagos en "fichas" (válidas solo en la pulpería de la empresa) y nula seguridad laboral.',
          '**Dependencia Extrema:** Más del 50% de los ingresos del Estado dependían de un solo producto. Cuando Alemania inventó el salitre sintético durante la Primera Guerra Mundial, la economía chilena colapsó.'
        ],
        order: 4,        imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905042/tja4smjac8eqy59wzxhi.jpg',

        test: {
          id: 'test-hist-1-4',
          contexto_base: 'Tras la Guerra del Pacífico (1879-1884), Chile anexó las ricas provincias salitreras de Tarapacá y Antofagasta, obteniendo el monopolio mundial del salitre natural, muy demandado como fertilizante agrícola y para la fabricación de pólvora. El Estado chileno optó por no nacionalizar la industria, dejando la explotación en manos de privados, principalmente ingleses como John Thomas North, y cobrando un alto impuesto de exportación. Estos enormes ingresos fiscales transformaron el país: se construyeron obras públicas, escuelas y viaductos, pero al mismo tiempo, las extremas condiciones laborales en la pampa salitrera sembraron el descontento obrero.',
          preguntas: [
            { id: 3107, enunciado: '¿De qué manera el Estado chileno obtuvo sus principales ingresos durante el ciclo del salitre?', alternativas: { A: 'A través de la administración directa y estatal de todas las oficinas salitreras.', B: 'Mediante el cobro de derechos aduaneros (impuestos) a la exportación del mineral.', C: 'Vendiendo los territorios salitreros a potencias europeas.', D: 'Cobrando impuestos sobre la renta a los obreros de la pampa.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! El Estado no era dueño de las empresas, pero cobraba un "peaje" por cada saco exportado.', feedback_error: 'Recuerda que las oficinas salitreras eran privadas (muchas inglesas). El Estado se financiaba a través de las aduanas.' },
            { id: 3108, enunciado: 'El uso principal del salitre en el mercado internacional a fines del siglo XIX era:', alternativas: { A: 'Como combustible para las nuevas máquinas de vapor.', B: 'Como materia prima exclusiva para joyería fina.', C: 'Como fertilizante agrícola y componente para explosivos.', D: 'Como material de construcción para rascacielos.' }, respuesta_correcta: 'C', feedback_acierto: '¡Exacto! Era esencial para aumentar la producción de alimentos en Europa y para armas.', feedback_error: 'Piensa en las necesidades de Europa en esa época: alimentar a una población creciente y prepararse para conflictos bélicos.' }
          ]
        }
      },
      {
        id: 'sec-hist-1-5',
        title: '5. La Cuestión Social en Chile',
        introduccion: 'El crecimiento económico de fines del siglo XIX y principios del XX tuvo un lado oscuro: la pauperización extrema de las clases trabajadoras.',
        guia_titulo: '📖 Teoría y Contexto Histórico',
        guia_contenido: `El crecimiento económico de fines del siglo XIX y principios del XX tuvo un lado oscuro: la pauperización extrema de las clases trabajadoras. A este conjunto de problemas (hacinamiento, insalubridad, explotación laboral y mortalidad) se le denominó la "Cuestión Social". Ante la ceguera y represión de la oligarquía gobernante, que veía la pobreza como un problema de caridad o policial, el proletariado comenzó a organizarse de manera autónoma, fundando mutuales y mancomunales, lo que daría origen al moderno movimiento obrero chileno.`,
        datos_claves: [
          '**Definición:** Conjunto de graves problemas sociales y laborales que afectaron a los sectores populares (obreros salitreros, mineros, industriales y campesinos emigrados) a fines del s. XIX y comienzos del XX.',
          '**Problemas Urbanos:** Migración masiva campo-ciudad. La gente vivía hacinada en "conventillos" (piezas minúsculas sin servicios básicos), sufriendo alta mortalidad infantil y epidemias de cólera y viruela.',
          '**Explotación Laboral:** Jornadas de 12 a 14 horas, ausencia de contratos, sin seguro de accidentes, pago en fichas y explotación de mujeres y niños en las industrias.',
          '**Organización Obrera:** Ante el abandono estatal, surgen las Sociedades de Socorros Mutuos (solidaridad financiera), las Mancomunales (sindicatos regionales) y las Sociedades de Resistencia (anarquistas, acción directa y huelgas).',
          '**Respuesta del Estado:** Inicialmente indiferencia o represión armada frente a las huelgas (ej. Matanza de la Escuela Santa María de Iquique, 1907). Recién en los años 1920 comenzaron a dictarse las primeras leyes sociales protectoras.'
        ],
        order: 5,        imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905037/ti4ukigu1zbauotp2cwi.jpg',

        test: {
          id: 'test-hist-1-5',
          contexto_base: 'A fines del siglo XIX y principios del XX, el crecimiento económico contrastó brutalmente con la pobreza de las clases trabajadoras. La migración masiva del campo a los puertos, ciudades e industrias salitreras provocó un colapso. Los obreros vivían hacinados en "conventillos" (piezas sin ventilación ni agua potable), enfrentando epidemias como el cólera. A nivel laboral, sufrían jornadas de 12 a 14 horas, no existían leyes de descanso dominical, accidentes de trabajo ni protección a mujeres o niños. A este conjunto de problemas se le denominó la "Cuestión Social". Ante la indiferencia de la oligarquía gobernante, los trabajadores comenzaron a organizarse en mutuales, sociedades de resistencia y, posteriormente, en sindicatos y partidos políticos para exigir sus derechos.',
          preguntas: [
            { id: 3109, enunciado: '¿Qué se entiende históricamente por "Cuestión Social" en Chile?', alternativas: { A: 'El debate en el Senado sobre la separación de la Iglesia y el Estado.', B: 'El conjunto de problemas de precariedad, hacinamiento y explotación laboral que afectó a la clase obrera.', C: 'El conflicto diplomático con países vecinos por límites territoriales.', D: 'La integración de la clase media a la administración pública.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Es el término que agrupa todas las miserias sufridas por los sectores populares en esa época.', feedback_error: 'La palabra "social" aquí se refiere a los graves padecimientos de la sociedad más vulnerable (los obreros).' },
            { id: 3110, enunciado: '¿Cuál fue una de las principales formas de organización que adoptaron los trabajadores para hacer frente a la Cuestión Social?', alternativas: { A: 'La creación de mutuales y sociedades de resistencia para apoyarse mutuamente.', B: 'La fundación de bancos comerciales privados.', C: 'El ingreso masivo a las filas del ejército.', D: 'La alianza política con la oligarquía terrateniente.' }, respuesta_correcta: 'A', feedback_acierto: '¡Muy bien! A través de la solidaridad (mutuales), los obreros crearon fondos comunes para ayudarse en caso de enfermedad o huelga.', feedback_error: 'Ante la ausencia de ayuda del Estado, los trabajadores tuvieron que organizarse entre ellos mismos.' },
            { id: 31051, enunciado: '¿Qué fenómeno demográfico contribuyó al estallido de la Cuestión Social en Chile?', alternativas: { A: 'La emigración masiva de chilenos hacia Europa.', B: 'La migración masiva de campesinos hacia las ciudades e industrias salitreras.', C: 'La caída drástica de la natalidad urbana.', D: 'El traslado de la capital desde Santiago a Valparaíso.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Miles de peones dejaron el campo buscando mejores sueldos en la ciudad y el norte, generando hacinamiento.', feedback_error: 'Piensa de dónde venía la gente pobre que llenó los conventillos de Santiago y Valparaíso.' },
            { id: 31052, enunciado: 'La respuesta inicial del Estado y la clase dirigente (oligarquía) frente a la Cuestión Social fue:', alternativas: { A: 'Indiferencia y represión violenta ante las huelgas.', B: 'Promulgar de inmediato un código del trabajo completo.', C: 'Renunciar al gobierno para dar paso a un régimen socialista.', D: 'Financiar viviendas sociales de lujo para todos los obreros.' }, respuesta_correcta: 'A', feedback_acierto: '¡Exacto! El Estado miraba para el lado o enviaba al ejército a reprimir las protestas (ej: Matanza de Santa María de Iquique).', feedback_error: 'La oligarquía creía que las huelgas eran problemas policiales o actos de rebelión, no demandas justas.' },
            { id: 31053, enunciado: '¿Qué mecanismo utilizaron los obreros como primera forma de apoyo mutuo ante la ausencia de leyes sociales?', alternativas: { A: 'La formación de AFP privadas.', B: 'El ahorro en bancos internacionales.', C: 'La creación de Sociedades de Socorros Mutuos (Mutuales).', D: 'La contratación de seguros de vida en Londres.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! Los obreros aportaban cuotas voluntarias para ayudarse en caso de enfermedad o muerte.', feedback_error: 'Al no tener salud pública, los obreros debieron unirse para socorrerse mutuamente.' }
          ]
        }
      }
    ]
  },
  
  // ==========================================
  // CAPITULO 2: El Turbulento Siglo XX
  // ==========================================
  {
    id: 'cap-hist-2',
    materiaId: 'historia',
    title: 'Historia del Siglo XX (Chile y el Mundo)',
    introduccion: 'Analiza los conflictos mundiales, la Guerra Fría y cómo estos eventos sacudieron a América Latina.',
    order: 2,
    paesWeight: '20% de la PAES',
    imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783833824/jaqrl9ag5zhddvh2nbmb.jpg',
    secciones: [
      {
        id: 'sec-hist-2-1',
        title: '1. La Crisis del 29 y el Estado de Bienestar',
        introduccion: 'La Gran Depresión iniciada el "Jueves Negro" de 1929 no solo derrumbó la bolsa de Wall Street, sino que destrozó el dogma del liberalismo económico (el mercado se regula solo).',
        guia_titulo: '📖 Teoría y Contexto Histórico',
        guia_contenido: `La Gran Depresión iniciada el "Jueves Negro" de 1929 no solo derrumbó la bolsa de Wall Street, sino que destrozó el dogma del liberalismo económico (el mercado se regula solo). Al quebrar masivamente bancos y fábricas, el desempleo global se disparó. La respuesta a este colapso provino de las ideas del economista John Maynard Keynes, quien argumentó que, en tiempos de crisis, el Estado debía intervenir activamente inyectando dinero y creando obras públicas para dar trabajo. Así nació el Estado de Bienestar en occidente, un modelo que buscaba garantizar derechos sociales mínimos (salud, pensiones) y que en América Latina se tradujo en la industrialización estatal.`,
        datos_claves: [
          '**La Gran Depresión (1929):** Colapso del mercado de valores de EE.UU. por exceso de especulación y sobreproducción. Provocó una crisis económica global de proporciones inéditas.',
          '**Impacto en Chile:** La Sociedad de Naciones declaró que Chile fue el país más golpeado del mundo. Las exportaciones de salitre se detuvieron abruptamente, llevando al cierre de minas y al desempleo masivo.',
          '**El Estado de Bienestar:** Surge como salvavidas del capitalismo. El Estado abandona su rol pasivo (Laissez-faire) y asume un rol interventor y garante de la seguridad social.',
          '**El Keynesianismo:** Teoría económica que promueve la intervención estatal mediante el gasto público para estimular la demanda y crear empleos durante las crisis.',
          '**Modelo ISI en América Latina:** (Industrialización por Sustitución de Importaciones). Para dejar de depender de manufacturas extranjeras, los estados latinoamericanos (como Chile con la CORFO en 1939) comenzaron a crear sus propias industrias estratégicas.'
        ],
        order: 1,
        level: 1,        imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905037/kzhldetgmmdybpkywibq.jpg',

        test: {
          id: 'test-hist-2-1',
          contexto_base: 'La Gran Depresión de 1929 desnudó las fallas del modelo capitalista liberal, que sostenía que el mercado se regulaba por sí solo. La quiebra masiva de empresas y bancos en Estados Unidos provocó desempleo mundial. Los países más afectados fueron los exportadores de materias primas, como Chile, que vio paralizadas sus ventas de salitre. Ante la catástrofe, surgió el modelo keynesiano y el "Estado de Bienestar", donde el Estado intervino activamente en la economía mediante obras públicas para crear empleo y garantizando derechos sociales básicos. En América Latina, esto se tradujo en el modelo de Industrialización por Sustitución de Importaciones (ISI), buscando crear fábricas locales para no depender tanto del exterior.',
          preguntas: [
            { id: 3201, enunciado: '¿Qué consecuencia política y económica tuvo la Crisis de 1929 respecto al rol del Estado?', alternativas: { A: 'El Estado se retiró por completo de la economía para dejar actuar al libre mercado.', B: 'El Estado asumió un rol interventor y regulador, dando paso al Estado de Bienestar.', C: 'Los Estados abolieron la moneda y volvieron al sistema de trueque.', D: 'Se fortalecieron los imperios coloniales del siglo XIX.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! La crisis demostró que el Estado debía intervenir para proteger a los ciudadanos y reactivar la economía.', feedback_error: 'La crisis demostró que dejar el mercado completamente libre era peligroso. ¿Qué hizo el Estado para solucionarlo?' },
            { id: 3202, enunciado: 'El modelo ISI implementado en América Latina tras la crisis de 1929 tenía como objetivo principal:', alternativas: { A: 'Aumentar la exportación exclusiva de salitre y materias primas.', B: 'Fomentar la industrialización local para reducir la dependencia de bienes importados.', C: 'Privatizar todas las empresas públicas.', D: 'Prohibir el consumo de productos manufacturados.' }, respuesta_correcta: 'B', feedback_acierto: '¡Muy bien! ISI significa "Industrialización por Sustitución de Importaciones": fabricar en casa lo que antes se compraba afuera.', feedback_error: 'Revisa las siglas ISI. Buscaba "Sustituir" las "Importaciones".' },
            { id: 32011, enunciado: '¿Qué sector económico fue el más golpeado en Chile producto de la Gran Depresión de 1929?', alternativas: { A: 'La exportación de salitre.', B: 'La producción de cobre refinado.', C: 'La agricultura de exportación.', D: 'La industria automotriz.' }, respuesta_correcta: 'A', feedback_acierto: '¡Correcto! El fin de las exportaciones salitreras hundió la economía chilena.', feedback_error: 'Piensa en el principal mineral que exportaba Chile en esa época, llamado "oro blanco".' },
            { id: 32012, enunciado: '¿Cuál fue una de las principales políticas del Estado de Bienestar para combatir el desempleo?', alternativas: { A: 'La reducción de impuestos a las grandes empresas.', B: 'La inversión masiva en obras públicas.', C: 'La privatización de los servicios básicos.', D: 'El cierre de las fronteras a la inmigración.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! El Estado contrató a miles de desempleados para construir puentes, caminos y escuelas.', feedback_error: 'Si había mucho desempleo y empresas quebradas, ¿quién debía dar trabajo y cómo?' },
            { id: 32013, enunciado: 'El modelo económico que impulsó la intervención estatal tras la crisis de 1929 estuvo fuertemente influenciado por las ideas de:', alternativas: { A: 'Adam Smith.', B: 'Karl Marx.', C: 'John Maynard Keynes.', D: 'Milton Friedman.' }, respuesta_correcta: 'C', feedback_acierto: '¡Excelente! El keynesianismo justificaba la intervención del Estado en tiempos de crisis.', feedback_error: 'Fue un economista británico que propuso que el Estado debía estimular la demanda para salir de la crisis.' }
          ]
        }
      },
      {
        id: 'sec-hist-2-2',
        title: '2. Totalitarismos europeos',
        introduccion: 'La desesperación tras la Primera Guerra Mundial y la ruina económica de 1929 crearon un caldo de cultivo perfecto para el surgimiento de ideologías radicales en Europa.',
        guia_titulo: '📖 Teoría y Contexto Histórico',
        guia_contenido: `La desesperación tras la Primera Guerra Mundial y la ruina económica de 1929 crearon un caldo de cultivo perfecto para el surgimiento de ideologías radicales en Europa. El Fascismo en Italia (Mussolini) y el Nazismo en Alemania (Hitler) instauraron regímenes totalitarios. A diferencia de las dictaduras tradicionales, los totalitarismos no solo buscaban el poder político, sino el control absoluto de la mente, la cultura y la vida íntima de las personas. Prometieron devolver la gloria a sus naciones a cambio de la sumisión incondicional del individuo al Estado.`,
        datos_claves: [
          '**Definición de Totalitarismo:** Régimen político donde el Estado tiene el control absoluto y totalitario de todas las esferas de la vida pública y privada. El individuo no existe, solo la Nación o el Estado.',
          '**Características Principales:** Existencia de un partido único y líder indiscutido, uso del terror de Estado policial (Gestapo), adoctrinamiento masivo desde la juventud (Juventudes Hitlerianas) y control de la propaganda.',
          '**Fascismo Italiano (Benito Mussolini):** Surge en los años 20. Enalteció el nacionalismo extremo, el militarismo y el corporativismo, buscando revivir la gloria del Imperio Romano.',
          '**Nazismo Alemán (Adolf Hitler):** Compartía los rasgos del fascismo pero añadió un componente biológico irracional: el racismo extremo y el antisemitismo, sosteniendo la superioridad de la raza aria.',
          '**Estalinismo en la URSS (Iósif Stalin):** Aunque económicamente comunista (opuesto al fascismo capitalista), políticamente Stalin instauró un régimen totalitario con purgas masivas, culto a la personalidad y control estatal absoluto.'
        ],
        order: 2,
        level: 2,        imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905038/t5uq3iqxuroiqc2tzw8j.jpg',

        test: {
          id: 'test-hist-2-2',
          contexto_base: 'El descontento tras la Primera Guerra Mundial y la miseria de la crisis del 29 crearon un terreno fértil para el surgimiento de regímenes totalitarios en Europa, principalmente el Fascismo en Italia (Mussolini) y el Nazismo en Alemania (Hitler). A diferencia de una dictadura común, el totalitarismo aspira a controlar "totalmente" la vida de las personas: elimina los partidos de oposición, suprime la libertad de prensa, adoctrina a la juventud a través de la educación y moviliza a las masas en torno a un líder carismático e infalible. Además, utilizan el terror policial y el nacionalismo exacerbado (y el racismo, en el caso nazi) para unificar a la nación y eliminar a cualquier "enemigo interno".',
          preguntas: [
            { id: 3203, enunciado: 'Una característica fundamental de los regímenes totalitarios del siglo XX fue:', alternativas: { A: 'El respeto irrestricto a los Derechos Humanos.', B: 'El fomento de un sistema político multipartidista.', C: 'La subordinación total del individuo al Estado y al líder.', D: 'La separación estricta entre el Estado y los medios de comunicación.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! En un estado totalitario, la persona no tiene valor por sí misma, solo sirve a los fines del Estado.', feedback_error: 'La palabra "totalitario" implica que el Estado controla una totalidad absoluta. Busca la opción que refleje falta de libertad.' },
            { id: 3204, enunciado: '¿Qué factor económico facilitó el apoyo popular al Nazismo en Alemania durante la década de 1930?', alternativas: { A: 'La enorme riqueza generada por sus colonias americanas.', B: 'La profunda crisis económica, hiperinflación y desempleo masivo tras 1929.', C: 'El éxito de las políticas de libre comercio con Gran Bretaña.', D: 'La consolidación del Estado de Bienestar impulsado por la República de Weimar.' }, respuesta_correcta: 'B', feedback_acierto: '¡Muy bien! El hambre y el desespero de la crisis hicieron que la gente buscara soluciones radicales y líderes fuertes.', feedback_error: 'Recuerda el impacto devastador de la Gran Depresión de 1929 en un país que ya estaba arruinado por perder la Primera Guerra Mundial.' },
            { id: 32021, enunciado: '¿Qué país fue el precursor del modelo fascista bajo el liderazgo de Benito Mussolini?', alternativas: { A: 'Alemania', B: 'España', C: 'Italia', D: 'Unión Soviética' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! Mussolini instauró el fascismo en Italia años antes de que Hitler llegara al poder en Alemania.', feedback_error: 'Este país tiene forma de bota y su capital es Roma.' },
            { id: 32022, enunciado: 'Una de las estrategias clave de los totalitarismos para asegurar el control social fue:', alternativas: { A: 'Promover la libertad de prensa y el debate político.', B: 'Permitir la existencia de múltiples sindicatos independientes.', C: 'El adoctrinamiento masivo de la juventud a través de la educación y organizaciones estatales.', D: 'Descentralizar el poder hacia los gobiernos locales.' }, respuesta_correcta: 'C', feedback_acierto: '¡Muy bien! Captar a los jóvenes desde pequeños aseguraba lealtad ciega al régimen (ej: Juventudes Hitlerianas).', feedback_error: 'Para que la población obedeciera sin cuestionar, el Estado debía controlar sus mentes desde la infancia.' },
            { id: 32023, enunciado: 'A diferencia del fascismo italiano, el nazismo alemán incorporó como pilar ideológico central:', alternativas: { A: 'El militarismo expansionista.', B: 'El anticomunismo.', C: 'El racismo y el antisemitismo extremo.', D: 'El rechazo a la democracia liberal.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! La obsesión por la "pureza racial" aria y el odio hacia los judíos fue la base del nazismo.', feedback_error: 'Ambos eran militaristas y anticomunistas, pero el nazismo basó toda su visión del mundo en la biología y la raza.' }
          ]
        }
      },
      {
        id: 'sec-hist-2-3',
        title: '3. El nuevo orden: La Guerra Fría',
        introduccion: 'Con la derrota del Eje (Alemania, Japón, Italia) en 1945, las dos superpotencias ganadoras, Estados Unidos y la Unión Soviética, se repartieron el mundo en zonas de influencia.',
        guia_titulo: '📖 Teoría y Contexto Histórico',
        guia_contenido: `Con la derrota del Eje (Alemania, Japón, Italia) en 1945, las dos superpotencias ganadoras, Estados Unidos y la Unión Soviética, se repartieron el mundo en zonas de influencia. Así comenzó la "Guerra Fría", un conflicto global ideológico, geopolítico y económico de casi medio siglo. Se llamó "fría" porque, gracias al desarrollo de armas nucleares, ambas potencias sabían que un enfrentamiento directo significaba la Destrucción Mutua Asegurada (MAD, por sus siglas en inglés). En lugar de pelear cara a cara, compitieron en la carrera espacial, la propaganda y auspiciando guerras en países periféricos.`,
        datos_claves: [
          '**El Mundo Bipolar:** La Tierra se dividió en dos bloques: Occidente (Capitalista, Democrático, liderado por EE.UU.) y Oriente (Comunista, Autoritario, liderado por la URSS).',
          '**Alianzas Militares:** EE.UU. creó la OTAN (Organización del Tratado del Atlántico Norte) para defensa mutua, mientras la URSS respondió creando el Pacto de Varsovia con sus países satélites de Europa del Este.',
          '**Guerras "Proxy" (Subsidiarias):** Aunque no pelearon directamente, EE.UU. y la URSS financiaron bandos opuestos en sangrientos conflictos locales como la Guerra de Corea, la Guerra de Vietnam y la Guerra de Afganistán.',
          '**La Carrera Espacial y Armamentista:** El espacio se volvió un campo de batalla propagandístico. La URSS tomó la delantera (primer satélite Sputnik, primer hombre en el espacio Yuri Gagarin), pero EE.UU. triunfó al llegar a la Luna en 1969.',
          '**El "Telón de Acero" y el Muro de Berlín:** El límite físico e ideológico que dividió a Europa. En 1961, la URSS construyó el Muro de Berlín para evitar la fuga de ciudadanos al lado capitalista, convirtiéndose en el símbolo máximo de la Guerra Fría.'
        ],
        order: 3,
        level: 2,        imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905038/mp8ayvhpswr76ubywob1.jpg',

        test: {
          id: 'test-hist-2-3',
          contexto_base: 'Tras la derrota del Nazismo en 1945, las dos grandes potencias vencedoras, Estados Unidos y la Unión Soviética (URSS), configuraron un nuevo orden mundial bipolar conocido como la Guerra Fría. Este fue un conflicto ideológico, político y económico entre el modelo capitalista liberal (EE.UU.) y el modelo comunista de economía planificada (URSS). Nunca se enfrentaron militarmente de forma directa por la amenaza de una Destrucción Mutua Asegurada (gracias a las armas nucleares). Sin embargo, compitieron ferozmente en la carrera espacial y financiaron guerras indirectas en países del Tercer Mundo (Guerra de Corea, Vietnam), intentando expandir sus esferas de influencia global.',
          preguntas: [
            { id: 3205, enunciado: '¿Por qué el conflicto entre EE.UU. y la URSS fue denominado "Guerra Fría"?', alternativas: { A: 'Porque se desarrolló principalmente en zonas geográficas de bajas temperaturas.', B: 'Porque ambas potencias evitaron el enfrentamiento militar directo por el temor a una guerra nuclear.', C: 'Porque consistió únicamente en sanciones económicas, sin guerras en ningún otro país.', D: 'Porque fue un conflicto resuelto pacíficamente a través de la ONU.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! El miedo a la bomba atómica mantuvo el conflicto "frío" entre las potencias principales.', feedback_error: 'Piensa en las armas atómicas que ambas potencias poseían. Si peleaban directamente, el mundo se destruía.' },
            { id: 3206, enunciado: 'En términos económicos, ¿qué proponía el modelo defendido por la Unión Soviética (URSS)?', alternativas: { A: 'La defensa del libre mercado y la no intervención estatal.', B: 'Una economía centralmente planificada, con abolición de la propiedad privada de los medios de producción.', C: 'La creación del Fondo Monetario Internacional (FMI) para dar préstamos a empresas privadas.', D: 'Un Estado de Bienestar donde coexistieran monopolios privados y estatales.' }, respuesta_correcta: 'B', feedback_acierto: '¡Muy bien! El comunismo soviético dictaba que el Estado controlaba toda la industria y economía.', feedback_error: 'La URSS defendía el comunismo. ¿Cuál opción describe mejor una economía comunista?' },
            { id: 32031, enunciado: '¿Qué bloque militar fue creado por Estados Unidos y sus aliados europeos para frenar el avance soviético?', alternativas: { A: 'El Pacto de Varsovia.', B: 'La Organización de las Naciones Unidas (ONU).', C: 'La Organización del Tratado del Atlántico Norte (OTAN).', D: 'El Movimiento de Países No Alineados.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! La OTAN fue la alianza militar defensiva del bloque capitalista.', feedback_error: 'Es una alianza que sigue existiendo hasta hoy y agrupa a los países del Atlántico Norte.' },
            { id: 32032, enunciado: '¿Cómo respondió la Unión Soviética a la creación de alianzas militares por parte de Occidente?', alternativas: { A: 'Disolviendo su ejército para promover la paz mundial.', B: 'Uniéndose a la OTAN.', C: 'Creando el Pacto de Varsovia con los países de Europa del Este.', D: 'Solicitando protección a las Naciones Unidas.' }, respuesta_correcta: 'C', feedback_acierto: '¡Exacto! El Pacto de Varsovia fue la respuesta militar del bloque comunista.', feedback_error: 'Buscó agrupar militarmente a sus estados satélites de Europa Oriental.' },
            { id: 32033, enunciado: 'La carrera espacial durante la Guerra Fría fue importante porque:', alternativas: { A: 'Permitió descubrir nuevos recursos naturales en Marte.', B: 'Sirvió como demostración de superioridad tecnológica e ideológica entre ambas potencias.', C: 'Fue un proyecto cooperativo que unió a científicos de EE.UU. y la URSS.', D: 'Desvió completamente la atención de los conflictos terrestres.' }, respuesta_correcta: 'B', feedback_acierto: '¡Muy bien! Llegar al espacio era una forma de demostrar al mundo cuál sistema (capitalista o comunista) era mejor.', feedback_error: 'Cada satélite o astronauta enviado era propaganda política para demostrar quién tenía la mejor tecnología.' }
          ]
        }
      },
      {
        id: 'sec-hist-2-4',
        title: '4. América Latina y la Doctrina de Seguridad Nacional',
        introduccion: "El triunfo de la Revolución Cubana en 1959 alertó a Estados Unidos sobre la posible expansión del comunismo en su 'patio trasero'. Como respuesta, implementó estrategias que cambiarían el destino del continente. La principal fue la Doctrina de Seguridad Nacional (DSN), la cual redefinió el rol de los ejércitos latinoamericanos: el verdadero peligro ya no era una invasión externa, sino el 'enemigo interno' (marxistas, sindicalistas y opositores). Esta doctrina sirvió de justificación ideológica para que los militares derrocaran las frágiles democracias e instauraran violentas dictaduras cívico-militares (como en Chile, Argentina, Uruguay y Brasil), coordinadas a través de la siniestra Operación Cóndor.",
        datos_claves: ['La Revolución Cubana (1959) alarmó a Estados Unidos.', 'EE.UU. impulsó la Doctrina de Seguridad Nacional (DSN).', 'La DSN veía al marxismo como un "enemigo interno", justificando dictaduras militares.'],
        order: 4,
        level: 3,        imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905037/yyb8euucllngapwgxon0.webp',

        test: {
          id: 'test-hist-2-4',
          contexto_base: 'El triunfo de la Revolución Cubana en 1959 instaló un gobierno comunista aliado de la URSS a pocos kilómetros de Estados Unidos. Para evitar que el ejemplo cubano se expandiera por América Latina, EE.UU. desarrolló dos estrategias: una económica (Alianza para el Progreso) y una militar-ideológica (la Doctrina de Seguridad Nacional o DSN). La DSN instruía a las Fuerzas Armadas latinoamericanas bajo la premisa de que la principal amenaza ya no era una invasión externa, sino el "enemigo interno": los movimientos de izquierda, sindicatos o cualquier grupo tildado de marxista. Esta doctrina fue la justificación ideológica para los violentos Golpes de Estado y las posteriores dictaduras cívico-militares en el Cono Sur (Brasil, Argentina, Chile, Uruguay) en las décadas de los 60 y 70.',
          preguntas: [
            { id: 3207, enunciado: 'Según la Doctrina de Seguridad Nacional promovida por EE.UU. durante la Guerra Fría, el papel principal de las Fuerzas Armadas en América Latina era:', alternativas: { A: 'Prepararse para una inminente invasión militar soviética por vía marítima.', B: 'Garantizar el respeto a los Derechos Humanos en los procesos electorales.', C: 'Combatir y eliminar al "enemigo interno" representado por los movimientos de izquierda y marxistas.', D: 'Fomentar la industrialización del continente dirigiendo empresas estatales.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! El objetivo cambió hacia el control ideológico interno, reprimiendo a los opositores políticos.', feedback_error: 'La DSN cambió el foco de las fuerzas armadas: de cuidar las fronteras a vigilar a sus propios ciudadanos.' },
            { id: 3208, enunciado: 'El evento histórico que actuó como detonante para que Estados Unidos endureciera su política en América Latina mediante la DSN fue:', alternativas: { A: 'La Revolución Mexicana de 1910.', B: 'La crisis de los misiles en Europa.', C: 'La victoria de la Revolución Cubana en 1959.', D: 'La elección de Salvador Allende en 1970.' }, respuesta_correcta: 'C', feedback_acierto: '¡Exacto! Fidel Castro llevó la Guerra Fría al patio trasero de Estados Unidos, generando pánico en Washington.', feedback_error: 'Ocurrió en una isla del Caribe a fines de los años 50 y se volvió el símbolo del comunismo en la región.' },
            { id: 32041, enunciado: '¿Qué plan impulsó Estados Unidos para promover el desarrollo económico en América Latina y evitar la propagación del comunismo tras la Revolución Cubana?', alternativas: { A: 'El Plan Marshall.', B: 'La Alianza para el Progreso.', C: 'El Tratado de Libre Comercio de América del Norte (TLCAN).', D: 'La Operación Cóndor.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Fue un plan de ayuda económica impulsado por JFK para mejorar la vida en la región y quitar apoyo a la guerrilla.', feedback_error: 'Buscaba generar "progreso" mediante una "alianza" económica.' },
            { id: 32042, enunciado: '¿Qué fue la Operación Cóndor?', alternativas: { A: 'Una operación militar estadounidense para invadir Cuba.', B: 'Un plan de desarrollo agrícola en los Andes.', C: 'Una red de coordinación represiva entre las dictaduras del Cono Sur para perseguir y eliminar opositores políticos.', D: 'Una misión secreta soviética para instalar misiles en Chile.' }, respuesta_correcta: 'C', feedback_acierto: '¡Muy bien! Las dictaduras de Chile, Argentina, Uruguay, Brasil, Paraguay y Bolivia colaboraron para cazar disidentes más allá de sus fronteras.', feedback_error: 'Fue una macabra alianza de las inteligencias militares sudamericanas para intercambiar prisioneros y asesinar.' },
            { id: 32043, enunciado: '¿Cómo afectó la Doctrina de Seguridad Nacional a las democracias latinoamericanas?', alternativas: { A: 'Las fortaleció mediante apoyo económico.', B: 'Llevó a su quiebre y al establecimiento de dictaduras cívico-militares bajo la excusa de combatir la subversión.', C: 'No tuvo mayor impacto, ya que los ejércitos se mantuvieron neutrales.', D: 'Promovió la creación de gobiernos de coalición entre militares y partidos comunistas.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Los militares tomaron el poder para "limpiar" a la sociedad del marxismo, destruyendo las democracias.', feedback_error: 'Los militares creían que los políticos civiles eran débiles ante la amenaza comunista, así que decidieron gobernar ellos mismos.' }
          ]
        }
      },
      {
        id: 'sec-hist-2-5',
        title: '5. La sociedad y las movilizaciones sociales',
        introduccion: "La segunda mitad del siglo XX estuvo marcada por profundas transformaciones sociales que desafiaron el orden tradicional. La inserción masiva de la mujer en el mundo laboral y público, junto con la legalización de métodos anticonceptivos como la píldora, redefinieron los roles de género y fortalecieron el movimiento feminista. Paralelamente, la juventud emergió como un actor social independiente y rebelde. Inspirados por el rock, la contracultura hippie, la lucha por los derechos civiles y protestas emblemáticas como el Mayo del 68, los jóvenes de todo el mundo exigieron mayores libertades, pacifismo y una ruptura definitiva con el conservadurismo de sus padres.",
        datos_claves: ['El siglo XX vio el ingreso masivo de las mujeres al mundo público (voto, trabajo).', 'Surgieron movimientos juveniles y contraculturales (movimiento hippie, protestas estudiantiles de 1968).', 'La cultura de masas se expandió por el mundo a través del cine, radio y TV.'],
        order: 5,
        level: 3,        imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905038/oxf6xsjvlepxru9btgcp.png',

        test: {
          id: 'test-hist-2-5',
          contexto_base: 'La segunda mitad del siglo XX no solo estuvo marcada por la política y la guerra, sino también por profundas revoluciones sociales y culturales. La incorporación masiva de la mujer a la educación universitaria y al mercado laboral, junto a la conquista del sufragio universal, redefinió los roles de género tradicionales. Paralelamente, los jóvenes emergieron como un nuevo sujeto social. En la década de 1960, el rechazo a la Guerra de Vietnam, la lucha por los derechos civiles de los afroamericanos y el movimiento estudiantil de Mayo del 68 en Francia, demostraron que las nuevas generaciones cuestionaban el consumismo y el autoritarismo. Todo esto ocurrió en medio de la expansión de una "cultura de masas", impulsada por la radio, la televisión y la música rock.',
          preguntas: [
            { id: 3209, enunciado: 'Durante la década de 1960, los movimientos juveniles a nivel global se caracterizaron principalmente por:', alternativas: { A: 'Su apoyo incondicional a las políticas bélicas de Estados Unidos.', B: 'Su postura conservadora y su rechazo a los derechos civiles.', C: 'Su espíritu contestatario, cuestionando el sistema tradicional, el consumismo y la guerra.', D: 'Su desinterés absoluto en la política y enfoque exclusivo en la música clásica.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! Los jóvenes (como el movimiento hippie) buscaron romper con los moldes de sus padres y exigieron paz y libertades.', feedback_error: 'Piensa en el estereotipo de los años 60: amor, paz, rock and roll y protestas contra la guerra.' },
            { id: 3210, enunciado: 'En el ámbito de los derechos femeninos, el siglo XX fue fundamental porque:', alternativas: { A: 'Se logró consolidar el derecho a voto y una mayor participación de las mujeres en el espacio público.', B: 'Las mujeres retornaron masivamente a roles exclusivamente domésticos por mandato de la ONU.', C: 'Se abolió el derecho de las mujeres a acceder a la educación superior en Europa.', D: 'Se estableció que las mujeres solo podían votar si demostraban poseer grandes propiedades.' }, respuesta_correcta: 'A', feedback_acierto: '¡Muy bien! El siglo XX fue el siglo de la emancipación femenina (derecho a voto, ingreso al trabajo asalariado y educación).', feedback_error: 'Fue un siglo de grandes avances en igualdad de género. Revisa qué opción describe un avance positivo.' },
            { id: 32051, enunciado: '¿Cuál fue uno de los principales motores de la masificación de la cultura en el siglo XX?', alternativas: { A: 'La invención de la imprenta.', B: 'La prohibición de la música popular en Europa.', C: 'La expansión de los medios de comunicación como la radio, el cine y la televisión.', D: 'El aumento exclusivo de la lectura de libros académicos.' }, respuesta_correcta: 'C', feedback_acierto: '¡Exacto! Los medios masivos permitieron que la música, moda y noticias llegaran a millones de personas al mismo tiempo.', feedback_error: 'La cultura de "masas" requiere llegar a las "masas" rápidamente. ¿Qué inventos del siglo XX permitieron eso?' },
            { id: 32052, enunciado: 'El movimiento estudiantil de Mayo del 68 en Francia simbolizó:', alternativas: { A: 'El apoyo de los jóvenes a las políticas del bloque soviético.', B: 'Una rebelión antiautoritaria que cuestionaba el orden establecido, la educación tradicional y el consumismo.', C: 'Una protesta exclusivamente por mejoras en la infraestructura de las universidades.', D: 'El inicio de una revolución armada que derrocó al gobierno francés.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Fue un grito generacional contra las estructuras rígidas y conservadoras de la sociedad de la época.', feedback_error: 'Bajo el lema "Prohibido prohibir", los jóvenes no solo pedían reformas educativas, sino un cambio total de valores.' },
            { id: 32053, enunciado: '¿Qué factor fue decisivo para los cambios en el rol social de la mujer durante el siglo XX?', alternativas: { A: 'Su integración masiva al mercado laboral, en parte impulsada por las Guerras Mundiales.', B: 'La decisión de los gobiernos de prohibir el trabajo femenino en fábricas.', C: 'El estancamiento de los índices de escolaridad femenina.', D: 'El rechazo de las mujeres a participar en la política.' }, respuesta_correcta: 'A', feedback_acierto: '¡Muy bien! Cuando los hombres fueron a la guerra, las mujeres ocuparon sus puestos de trabajo, demostrando su capacidad y ganando independencia económica.', feedback_error: 'Durante las guerras, ¿quién operaba las fábricas y mantenía la economía cuando los hombres estaban en el frente?' }
          ]
        }
      }
    ]
  },

  // ==========================================
  // CAPITULO 3: Chile Reciente: Dictadura y Democracia
  // ==========================================
  {
    id: 'cap-hist-3',
    materiaId: 'historia',
    title: 'Chile Reciente: Dictadura y Democracia',
    introduccion: 'La caída de la democracia en 1973, los 17 años de régimen militar y el difícil proceso de transición.',
    order: 3,
    paesWeight: '25% de la PAES',
    imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783833825/aqvuylooa80zcdadffbl.jpg',
    secciones: [
      {
        id: 'sec-hist-3-1',
        title: '1. Chile a mediados del siglo XX',
        introduccion: 'Hacia los años 60, el modelo económico desarrollista chileno (ISI) mostraba claros signos de agotamiento, generando inflación y estancamiento.',
        guia_titulo: '📖 Teoría y Contexto Histórico',
        guia_contenido: `Hacia los años 60, el modelo económico desarrollista chileno (ISI) mostraba claros signos de agotamiento, generando inflación y estancamiento. Para superar el subdesarrollo, surgieron tres proyectos políticos excluyentes (Derecha, Centro DC e Izquierda UP) que proponían soluciones radicales, como la Reforma Agraria para modernizar el campo o la Chilenización/Nacionalización del cobre. La elección del socialista Salvador Allende en 1970 ("La Vía Chilena al Socialismo") polarizó al extremo a una sociedad ya cruzada por la tensión de la Guerra Fría. La severa crisis económica (desabastecimiento, boicot estadounidense) y la violencia callejera pavimentaron el camino hacia el colapso institucional.`,
        datos_claves: [
          '**Reforma Agraria:** Proceso clave iniciado por Alessandri ("reforma de macetero"), profundizado por Frei Montalva y radicalizado por Allende. Su fin era eliminar los enormes latifundios ineficientes y entregar "la tierra al que la trabaja".',
          '**Nacionalización del Cobre:** Culminación del proceso iniciado por Frei. En 1971, bajo el gobierno de Allende, el Congreso aprobó por unanimidad expropiar la gran minería del cobre, hasta entonces en manos de EE.UU.',
          '**Polarización y Guerra Fría:** El contexto global fue clave. EE.UU., bajo la presidencia de Nixon, intervino activamente financiando a la oposición y paralizando la economía para evitar que el experimento marxista chileno tuviera éxito.',
          '**Proyectos Excluyentes:** Los tres tercios políticos de Chile no lograron acuerdos. La Democracia Cristiana propuso la "Revolución en Libertad", mientras que la Unidad Popular apostó por un rápido avance hacia el socialismo estatal.',
          '**Crisis Económica de 1973:** Hiperinflación superior al 300%, paros nacionales de camioneros, acaparamiento y mercado negro de alimentos ahogaron el gobierno de la Unidad Popular.'
        ],
        order: 1,        imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905038/ogrrtgtcbzmw2ntpnlxu.jpg',

        test: {
          id: 'test-hist-3-1',
          contexto_base: 'Hacia las décadas de 1960 y 1970, la sociedad chilena experimentaba grandes tensiones. El modelo de industrialización (ISI) mostraba señales de agotamiento, generando estancamiento económico e inflación. Para modernizar el país, surgió la necesidad de reformas estructurales, destacando la Reforma Agraria (iniciada por Jorge Alessandri, profundizada por Eduardo Frei Montalva y radicalizada por Salvador Allende) que buscaba terminar con los ineficientes latifundios rurales y redistribuir la tierra. En 1970, Salvador Allende (Unidad Popular) asumió la presidencia intentando instaurar el socialismo por la vía democrática. Su gobierno nacionalizó el cobre, pero enfrentó una dura oposición interna, boicot económico impulsado por EE.UU., polarización extrema de la sociedad y desabastecimiento, desembocando en una crisis institucional sin precedentes.',
          preguntas: [
            { id: 3301, enunciado: '¿Cuál fue el objetivo principal del proceso de Reforma Agraria en Chile durante las décadas de 1960 y 1970?', alternativas: { A: 'Privatizar todas las tierras fiscales para venderlas a inversionistas extranjeros.', B: 'Industrializar forzosamente el campo prohibiendo la agricultura tradicional.', C: 'Expropiar y redistribuir los grandes latifundios para modernizar la agricultura y mejorar la situación de los campesinos.', D: 'Concentrar la propiedad de la tierra en manos de la Iglesia Católica.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! Se buscaba hacer más productivo el campo y entregar tierras a quienes las trabajaban ("la tierra para el que la trabaja").', feedback_error: 'El campo chileno estaba dominado por muy pocas familias dueñas de enormes extensiones (latifundios) improductivas. ¿Qué buscó el Estado?' },
            { id: 3302, enunciado: 'El proyecto político de Salvador Allende y la Unidad Popular se caracterizó por su intento de:', alternativas: { A: 'Instaurar un régimen totalitario de partido único mediante un golpe armado.', B: 'Implementar el socialismo a través de la vía institucional y democrática.', C: 'Establecer un modelo neoliberal privatizando todas las empresas del Estado.', D: 'Retirar a Chile de Naciones Unidas y alinearlo exclusivamente con Gran Bretaña.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! Fue conocido como la "Vía chilena al socialismo", es decir, llegar al socialismo usando las leyes de la democracia burguesa.', feedback_error: 'Allende no hizo una revolución armada (como en Cuba o Rusia), él llegó al poder mediante elecciones.' },
            { id: 33011, enunciado: 'Además de la Reforma Agraria, otra gran transformación estructural impulsada en la década de 1960 bajo el gobierno de Eduardo Frei Montalva fue:', alternativas: { A: 'La Chilenización del Cobre.', B: 'La privatización de la educación superior.', C: 'La creación de las AFP.', D: 'La prohibición de los sindicatos obreros.' }, respuesta_correcta: 'A', feedback_acierto: '¡Correcto! El Estado compró parte de la gran minería del cobre para tener mayor control de su principal riqueza.', feedback_error: 'Buscó aumentar el control estatal sobre la principal exportación de Chile, que en esa época estaba en manos de empresas estadounidenses.' },
            { id: 33012, enunciado: 'La polarización política en Chile a principios de 1970 se vio agravada por el contexto internacional de:', alternativas: { A: 'La Primera Guerra Mundial.', B: 'La caída del Muro de Berlín.', C: 'La Guerra Fría y la influencia de la Revolución Cubana.', D: 'La globalización económica.' }, respuesta_correcta: 'C', feedback_acierto: '¡Bien! El mundo estaba dividido en dos bloques, y Chile se convirtió en un escenario clave de esa disputa.', feedback_error: 'Recuerda qué gran conflicto mundial dividía al mundo entre capitalistas y comunistas en esa época.' },
            { id: 33013, enunciado: '¿Qué sector político se opuso férreamente a las reformas de la Unidad Popular, buscando apoyo en el extranjero (EE.UU.)?', alternativas: { A: 'El Partido Comunista.', B: 'Los sindicatos campesinos.', C: 'La derecha política y parte del empresariado.', D: 'Los movimientos estudiantiles de izquierda.' }, respuesta_correcta: 'C', feedback_acierto: '¡Excelente! Los sectores conservadores y empresariales temían perder sus propiedades con el avance al socialismo.', feedback_error: 'Fueron los sectores que sentían amenazados sus intereses económicos por las expropiaciones.' }
          ]
        }
      },
      {
        id: 'sec-hist-3-2',
        title: '2. El Quiebre de 1973',
        introduccion: 'El 11 de septiembre de 1973, las Fuerzas Armadas y Carabineros ejecutaron un violento Golpe de Estado, derrocando al gobierno democrático de Salvador Allende, quien falleció en el Palacio de La Moneda.',
        guia_titulo: '📖 Teoría y Contexto Histórico',
        guia_contenido: `El 11 de septiembre de 1973, las Fuerzas Armadas y Carabineros ejecutaron un violento Golpe de Estado, derrocando al gobierno democrático de Salvador Allende, quien falleció en el Palacio de La Moneda. Este hecho marcó la destrucción inmediata del Estado de Derecho republicano. La Junta Militar clausuró el Congreso Nacional, censuró la prensa, disolvió el Tribunal Constitucional y proscribió los partidos políticos, concentrando todos los poderes del Estado. Así, se inició una dictadura liderada por Augusto Pinochet que duraría casi dos décadas.`,
        datos_claves: [
          '**Fin de la República Liberal:** El Golpe no fue un simple cambio de mando, fue el desmantelamiento de todas las instituciones democráticas que Chile construyó desde la Constitución de 1925.',
          '**Concentración del Poder:** La Junta de Gobierno asumió el Poder Ejecutivo y el Poder Legislativo simultáneamente, gobernando mediante "Bandos Militares" y "Decretos Leyes" sin contrapeso legal.',
          '**Justificación Ideológica:** Los militares utilizaron la "Doctrina de Seguridad Nacional" (heredada de EE.UU.) para justificar el golpe como un acto de salvación de la patria frente al "cáncer marxista" y a una supuesta guerra civil.',
          '**Estado de Sitio y Toque de Queda:** Medidas inmediatas de control poblacional. Se suspendieron los derechos de reunión, circulación y libertad de expresión, instalando un clima de terror en la población civil.',
          '**Apoyo Civil:** El golpe contó con el apoyo inicial de grandes empresarios, de la derecha política y de un sector importante de la Democracia Cristiana, quienes esperaban una rápida normalización, la cual no ocurrió.'
        ],
        order: 2,        imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905038/jxpyrsxsigferexii71j.webp',

        test: {
          id: 'test-hist-3-2',
          contexto_base: 'Ante la ingobernabilidad y la crisis política y económica, el 11 de septiembre de 1973 las Fuerzas Armadas y de Orden ejecutaron un Golpe de Estado que derrocó al presidente Salvador Allende. Este evento no fue solo un cambio de gobierno, sino la destrucción de la democracia republicana que Chile había construido durante décadas. La Junta Militar clausuró el Congreso, censuró la prensa, eliminó los registros electorales y declaró proscritos a los partidos políticos. A partir de ese momento, el Estado dejó de garantizar los derechos civiles y concentró todo el poder Ejecutivo y Legislativo en manos de Augusto Pinochet, marcando el inicio de una dictadura que se extendería por 17 años.',
          preguntas: [
            { id: 3303, enunciado: 'Una de las primeras medidas políticas implementadas por la Junta Militar tras el Golpe de Estado de 1973 fue:', alternativas: { A: 'Llamar a elecciones presidenciales anticipadas en un plazo de seis meses.', B: 'Clausurar el Congreso Nacional y prohibir la actividad de los partidos políticos.', C: 'Redactar inmediatamente una Constitución de corte socialista.', D: 'Entregar el gobierno a la Corte Suprema de Justicia.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! La dictadura eliminó todas las instituciones representativas de la democracia.', feedback_error: 'Las dictaduras no toleran la oposición ni el debate político. ¿Qué instituciones cerraron?' },
            { id: 3304, enunciado: 'El quiebre de la democracia en 1973 significó institucionalmente:', alternativas: { A: 'La concentración del Poder Ejecutivo y Legislativo en la Junta Militar, anulando la separación de poderes.', B: 'La adopción de un sistema parlamentario donde el Congreso adquirió más poder que nunca.', C: 'La mantención intacta de la Constitución de 1925 sin ninguna modificación.', D: 'El inicio de un periodo de pleno respeto al Estado de Derecho.' }, respuesta_correcta: 'A', feedback_acierto: '¡Muy bien! Se destruyó el principio básico del liberalismo republicano: la división de poderes.', feedback_error: 'Si cerraron el congreso, ¿quién pasó a hacer las leyes? Quien tiene las armas pasó a tener todo el poder.' },
            { id: 33021, enunciado: 'Tras el golpe de Estado, el gobierno militar implementó medidas de control como:', alternativas: { A: 'El toque de queda y el Estado de Sitio.', B: 'La convocatoria a asambleas constituyentes libres.', C: 'El fomento de la prensa internacional opositora.', D: 'La reducción del presupuesto militar.' }, respuesta_correcta: 'A', feedback_acierto: '¡Correcto! Se limitaron severamente las libertades de circulación y reunión.', feedback_error: 'Las dictaduras necesitan controlar a la población civil. ¿Cómo restringen el movimiento en las noches?' },
            { id: 33022, enunciado: 'La Junta Militar justificó su toma del poder argumentando:', alternativas: { A: 'El deseo de unirse al bloque soviético.', B: 'La necesidad de salvar a Chile de una supuesta inminente guerra civil y del marxismo.', C: 'La petición formal de la Organización de Naciones Unidas (ONU).', D: 'El rechazo de la población a las inversiones estadounidenses.' }, respuesta_correcta: 'B', feedback_acierto: '¡Muy bien! Usaron la crisis y la amenaza comunista como excusa principal, en línea con la Doctrina de Seguridad Nacional.', feedback_error: 'Según los militares, el país estaba al borde del caos y ellos debían "restaurar el orden" frente a la izquierda.' },
            { id: 33023, enunciado: 'Durante los primeros años del régimen militar, la persecución política se centró principalmente en:', alternativas: { A: 'Los grandes empresarios nacionales.', B: 'Miembros de los partidos Socialista, Comunista, MIR y dirigentes sindicales.', C: 'La alta jerarquía de la Iglesia Católica.', D: 'Los dueños de los medios de comunicación privados.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! El objetivo era desarticular y eliminar a los líderes y bases de los partidos de izquierda que apoyaron a Allende.', feedback_error: 'El objetivo declarado de la dictadura era erradicar el marxismo.' }
          ]
        }
      },
      {
        id: 'sec-hist-3-3',
        title: '3. El modelo neoliberal y la Constitución de 1980',
        introduccion: 'Tras tomar el poder, la dictadura decidió que no bastaba con eliminar a la izquierda, había que refundar el país ("Las Modernizaciones").',
        guia_titulo: '📖 Teoría y Contexto Histórico',
        guia_contenido: `Tras tomar el poder, la dictadura decidió que no bastaba con eliminar a la izquierda, había que refundar el país ("Las Modernizaciones"). En el plano económico, un grupo de economistas chilenos (los "Chicago Boys") implantó el modelo Neoliberal, reduciendo drásticamente al Estado y entregando los derechos sociales al mercado. En el plano político, el régimen diseñó la Constitución de 1980 para institucionalizar su modelo, creando una "Democracia Protegida" con mecanismos autoritarios para evitar que futuros gobiernos populares pudieran revertir estas profundas transformaciones estructurales.`,
        datos_claves: [
          '**Neoliberalismo:** Modelo que confía casi exclusivamente en el libre mercado para asignar recursos. Privatizó decenas de empresas públicas estratégicas y redujo los aranceles de importación.',
          '**Estado Subsidiario:** Principio clave de la Constitución del 80. Establece que el Estado solo debe intervenir o proveer servicios en aquellas áreas donde los privados no quieran o no puedan invertir.',
          '**Privatización de Derechos Sociales:** Se crearon las Administradoras de Fondos de Pensiones (AFP, sistema privado de jubilación) y las Instituciones de Salud Previsional (ISAPRES, seguros privados de salud).',
          '**Constitución de 1980:** Aprobada en un plebiscito altamente cuestionado. Buscó consagrar legalmente el régimen y fijar un itinerario de transición amarrado por las fuerzas armadas.',
          '**"Cerrojos" Autoritarios:** La Constitución incluyó Senadores Designados (no electos), el Consejo de Seguridad Nacional (militares tutelando la democracia) y altísimos quórums que hacían casi imposible reformarla.'
        ],
        order: 3,        imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905039/gw4uepphynwaog3bph4t.jpg',

        test: {
          id: 'test-hist-3-3',
          contexto_base: 'Para transformar a Chile de raíz, la dictadura se apoyó en un grupo de economistas chilenos educados en la Universidad de Chicago (Chicago Boys). Ellos aplicaron el "Neoliberalismo", un modelo extremo de libre mercado. El Estado abandonó su rol benefactor, rebajó aranceles a las importaciones, privatizó decenas de empresas públicas y entregó al mercado la administración de los derechos sociales: se crearon las AFP (pensiones), las ISAPRES (salud privada) y se municipalizó la educación. Para asegurar que este modelo no pudiera ser cambiado fácilmente en el futuro, el régimen diseñó la Constitución de 1980. Esta carta magna instauró una "democracia protegida", con senadores designados, rol tutelar de las Fuerzas Armadas y altos quórums para reformarla.',
          preguntas: [
            { id: 3305, enunciado: 'En materia de derechos sociales (salud, educación, previsión), el modelo neoliberal impuesto en Chile implicó:', alternativas: { A: 'El monopolio estatal absoluto en la entrega de estos servicios.', B: 'La gratuidad universal garantizada constitucionalmente para todos los chilenos.', C: 'La privatización y mercantilización de estos servicios, permitiendo el lucro de empresas privadas (AFP, Isapres).', D: 'La prohibición de que entidades privadas participaran en salud y educación.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! Los derechos sociales pasaron a ser considerados bienes de consumo administrados por el mercado.', feedback_error: 'Piensa en las instituciones que surgieron en los 80s: AFP para pensiones e Isapres para salud. ¿Son públicas o privadas?' },
            { id: 3306, enunciado: 'La Constitución de 1980 estableció una "democracia protegida". ¿Qué mecanismo concreto reflejaba este concepto?', alternativas: { A: 'La existencia de Senadores Designados y el rol de garantes de la institucionalidad de las Fuerzas Armadas.', B: 'El establecimiento del voto voluntario para los mayores de 18 años.', C: 'La elección directa de todos los alcaldes e intendentes del país.', D: 'La facultad del pueblo para destituir al Presidente mediante plebiscitos anuales.' }, respuesta_correcta: 'A', feedback_acierto: '¡Muy bien! Estos "cerrojos" autoritarios aseguraban que, aunque volvieran los civiles al poder, los militares conservarían influencia.', feedback_error: 'La dictadura desconfiaba de la democracia pura, por lo que dejó mecanismos autoritarios para evitar que la izquierda volviera al poder o cambiara la constitución.' },
            { id: 33031, enunciado: '¿Qué grupo de economistas fue el artífice del modelo neoliberal implementado en Chile durante la dictadura?', alternativas: { A: 'Los Keynesianos.', B: 'Los Chicago Boys.', C: 'Los Marxistas-Leninistas.', D: 'Los Estructuralistas de la CEPAL.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Formados en la U. de Chicago bajo las ideas de Milton Friedman.', feedback_error: 'Eran jóvenes chilenos que estudiaron posgrados en una famosa universidad de Estados Unidos.' },
            { id: 33032, enunciado: 'El nuevo sistema de pensiones creado en 1980 (AFP) se basaba en:', alternativas: { A: 'Un fondo solidario administrado por el Estado.', B: 'Cuentas de capitalización individual administradas por empresas privadas.', C: 'Pensiones pagadas íntegramente por los empleadores.', D: 'Un sistema mixto europeo.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! Cada trabajador ahorra para su propia jubilación, y empresas privadas invierten ese dinero.', feedback_error: 'El modelo neoliberal busca la iniciativa privada. Las AFP son privadas y cada persona junta su propio fondo.' },
            { id: 33033, enunciado: 'La Constitución de 1980 definió el rol del Estado en la economía como:', alternativas: { A: 'Estado de Bienestar.', B: 'Estado Centralizado.', C: 'Estado Subsidiario.', D: 'Estado Benefactor.' }, respuesta_correcta: 'C', feedback_acierto: '¡Excelente! "Subsidiario" significa que el Estado solo interviene en lo que los privados no pueden o no quieren hacer.', feedback_error: 'Es un concepto jurídico que relega al Estado a un plano secundario, dejando la iniciativa al mercado.' }
          ]
        }
      },
      {
        id: 'sec-hist-3-4',
        title: '4. Violaciones a los Derechos Humanos',
        introduccion: 'Durante los 17 años de régimen militar, la represión a la disidencia no fue un exceso de algunos oficiales, sino una política sistemática planificada y ejecutada desde el propio aparato del Estado.',
        guia_titulo: '📖 Teoría y Contexto Histórico',
        guia_contenido: `Durante los 17 años de régimen militar, la represión a la disidencia no fue un exceso de algunos oficiales, sino una política sistemática planificada y ejecutada desde el propio aparato del Estado. A través de organismos de inteligencia secretos que operaban por sobre la ley, la dictadura secuestró, torturó masivamente, ejecutó y desapareció a miles de opositores políticos (principalmente militantes de izquierda y dirigentes sindicales). Frente a la inacción cómplice de los Tribunales de Justicia, solo las iglesias y organizaciones civiles se levantaron para defender la vida de los perseguidos.`,
        datos_claves: [
          '**Terrorismo de Estado:** Uso ilegal de la fuerza y los recursos del Estado para imponer terror en la población civil. Incluyó centros clandestinos de detención y tortura (ej. Villa Grimaldi, Estadio Nacional).',
          '**Organismos Represivos:** La DINA (Dirección de Inteligencia Nacional) y su sucesora, la CNI. Tenían poder ilimitado para arrestar e interrogar bajo tortura, sin responder a la justicia ordinaria.',
          '**Detenidos Desaparecidos:** Práctica perversa donde agentes del Estado secuestraban y asesinaban a opositores, ocultando sus cuerpos para negar su responsabilidad y prolongar el sufrimiento familiar.',
          '**Vicaría de la Solidaridad:** Organismo de la Iglesia Católica que jugó un rol crucial brindando apoyo legal (recursos de amparo) a los perseguidos y documentando los crímenes para el futuro.',
          '**Comisiones de Verdad:** Ya en democracia, se crearon la Comisión Rettig (que acreditó los casos con resultado de muerte o desaparición) y la Comisión Valech (que acreditó más de 38.000 víctimas de prisión política y tortura).'
        ],
        order: 4,        imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905039/eramr3kfqbyrqp6qrpct.jpg',

        test: {
          id: 'test-hist-3-4',
          contexto_base: 'Bajo el amparo de la Doctrina de Seguridad Nacional, el régimen militar transformó al Estado en una maquinaria represiva contra sus propios ciudadanos. Organismos de inteligencia secretos, como la DINA (luego CNI), operaron al margen de la ley. Se abrieron centros de tortura clandestinos (como Villa Grimaldi), se ejecutó a disidentes y se inauguró la trágica práctica de los "Detenidos Desaparecidos". El Estado negó sistemáticamente estos crímenes y el Poder Judicial (Corte Suprema) falló al no aceptar los recursos de amparo que buscaban proteger la vida de los detenidos. Solo el trabajo de organizaciones civiles, como la Vicaría de la Solidaridad de la Iglesia Católica, logró documentar los casos y defender a las víctimas en los años más oscuros.',
          preguntas: [
            { id: 3307, enunciado: 'Una característica que define la represión ejercida por la dictadura chilena (1973-1990) es que esta fue:', alternativas: { A: 'Ejecutada exclusivamente por grupos paramilitares sin conexión con el gobierno.', B: 'Una política sistemática planificada y ejecutada desde el propio aparato del Estado.', C: 'Sancionada y castigada inmediatamente por los tribunales de justicia de la época.', D: 'Restringida únicamente a ciudadanos extranjeros residentes en Chile.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! El propio Estado usó sus recursos, militares e infraestructura para eliminar a la oposición de manera sistemática.', feedback_error: 'Las violaciones a los DD.HH. no fueron "excesos" o "accidentes" de algunos militares, sino una estrategia coordinada desde el alto mando.' },
            { id: 3308, enunciado: '¿Qué importante rol cumplió la "Vicaría de la Solidaridad" durante el régimen militar?', alternativas: { A: 'Financió la formación económica de los Chicago Boys.', B: 'Se encargó de censurar a los medios de comunicación opositores.', C: 'Defendió legalmente a los perseguidos políticos y documentó las violaciones a los Derechos Humanos.', D: 'Fue la institución encargada de redactar la Constitución de 1980.' }, respuesta_correcta: 'C', feedback_acierto: '¡Muy bien! Fue un escudo protector clave para las víctimas frente a los abusos del régimen.', feedback_error: 'Esta fue una institución de la Iglesia Católica. Piensa en el concepto de "solidaridad" en tiempos de dictadura.' },
            { id: 33041, enunciado: 'La Dirección de Inteligencia Nacional (DINA) tuvo como principal objetivo:', alternativas: { A: 'Fomentar la educación cívica en colegios.', B: 'Perseguir, torturar y hacer desaparecer a opositores políticos.', C: 'Proteger las fronteras en caso de guerra externa.', D: 'Planificar el desarrollo económico del país.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Fue la policía secreta de Pinochet, responsable de las peores atrocidades.', feedback_error: 'Fue una organización temida, que operaba al margen de la ley oficial para eliminar a la disidencia.' },
            { id: 33042, enunciado: 'Tras el fin de la dictadura, el gobierno de Patricio Aylwin creó la "Comisión Rettig" para:', alternativas: { A: 'Juzgar y encarcelar directamente a los militares responsables.', B: 'Redactar una nueva Constitución Política.', C: 'Establecer la verdad oficial sobre las violaciones a los DD.HH. con resultado de muerte o desaparición.', D: 'Investigar los delitos económicos del régimen.' }, respuesta_correcta: 'C', feedback_acierto: '¡Bien! Su nombre oficial fue Comisión Nacional de Verdad y Reconciliación.', feedback_error: 'Como los tribunales no habían investigado, esta comisión buscó al menos conocer "la verdad" sobre los asesinados y desaparecidos.' },
            { id: 33043, enunciado: 'La práctica de los "Detenidos Desaparecidos" implicaba que el Estado:', alternativas: { A: 'Exiliaba a las personas sin registrar su destino.', B: 'Secuestraba personas, las asesinaba y ocultaba sus cuerpos para negar responsabilidad.', C: 'Enviaba opositores a trabajar a minas en el norte.', D: 'Entregaba prisioneros a potencias extranjeras.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Al no haber cuerpo, el Estado podía negar cínicamente el crimen, prolongando el dolor de las familias.', feedback_error: 'Es uno de los crímenes más crueles, pues consiste en negar información a las familias sobre el paradero de sus seres queridos.' }
          ]
        }
      },
      {
        id: 'sec-hist-3-5',
        title: '5. La Transición a la Democracia',
        introduccion: 'Tras la severa crisis económica de 1982, estallaron grandes Protestas Nacionales que reorganizaron a la oposición política y civil.',
        guia_titulo: '📖 Teoría y Contexto Histórico',
        guia_contenido: `Tras la severa crisis económica de 1982, estallaron grandes Protestas Nacionales que reorganizaron a la oposición política y civil. Respetando el cronograma trazado por la propia dictadura en la Constitución de 1980, en 1988 se celebró el Plebiscito Nacional donde la opción "NO" (rechazo a la continuidad de Pinochet) obtuvo la victoria. Esto forzó la realización de elecciones presidenciales libres en 1989. Aunque el demócratacristiano Patricio Aylwin asumió el mando en 1990, inició un proceso de "Transición" marcado por la fuerte presencia tutelar de las Fuerzas Armadas y la imposibilidad inicial de cambiar el modelo heredado.`,
        datos_claves: [
          '**Crisis de 1982 y Protestas:** La quiebra del modelo neoliberal detonó masivas y violentas protestas sociales, rompiendo el "apagón cultural" y forzando a los partidos políticos a salir de la clandestinidad.',
          '**Plebiscito de 1988:** Consulta nacional donde el "SÍ" significaba 8 años más de Pinochet. La victoria del "NO" (55% a 43%) marcó el triunfo pacífico de la "Concertación de Partidos por el NO" (alianza de centro-izquierda).',
          '**Reformas de 1989:** Antes de entregar el poder, se negoció un paquete de reformas constitucionales para atenuar los aspectos más autoritarios de la Constitución del 80 (ej. aumentar número de senadores electos y facilitar futuras reformas).',
          '**Democracia de los Acuerdos:** Estilo político de los primeros gobiernos concertacionistas (Aylwin, Frei Ruiz-Tagle). Basado en negociar cada ley con la derecha en el Congreso, debido a la imposibilidad de conseguir mayorías absolutas.',
          '**Justicia en la medida de lo posible:** Frase del Presidente Aylwin que reflejaba la extrema tensión con el poder militar. Pinochet continuó siendo Comandante en Jefe del Ejército hasta 1998, realizando ejercicios de presión militar ("Boinazo", "Ejercicio de Enlace") cuando la justicia se acercaba a sus familiares u oficiales.'
        ],
        order: 5,        imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905039/vtg5txfooop05ulahr7c.jpg',

        test: {
          id: 'test-hist-3-5',
          contexto_base: 'A principios de los años 80, una grave crisis económica detonó masivas Protestas Nacionales que exigían el retorno a la democracia. La Constitución de 1980 había fijado un itinerario institucional: en 1988 se realizaría un plebiscito para decidir si Augusto Pinochet continuaba 8 años más en el poder ("SÍ") o si se llamaba a elecciones presidenciales ("NO"). La campaña del "NO" aglutinó a los partidos de centro e izquierda, ganando sorpresivamente en las urnas. Así, en 1990 asumió Patricio Aylwin, primer presidente de la Concertación. La "transición" fue un periodo tenso: aunque se recuperaron las libertades civiles, los gobiernos democráticos tuvieron que gobernar con Pinochet como Comandante en Jefe del Ejército y no lograron desmantelar el modelo neoliberal, sino que administraron "en la medida de lo posible".',
          preguntas: [
            { id: 3309, enunciado: 'El triunfo de la opción "NO" en el Plebiscito de 1988 significó institucionalmente:', alternativas: { A: 'La renuncia inmediata de Augusto Pinochet y su exilio a Inglaterra al día siguiente.', B: 'La aprobación de una nueva Constitución Política que reemplazó a la de 1980.', C: 'La convocatoria a elecciones presidenciales y parlamentarias abiertas para 1989.', D: 'La continuidad de Augusto Pinochet en el poder por 8 años adicionales.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! El triunfo del NO activó el mecanismo constitucional que obligaba a llamar a elecciones democráticas al año siguiente.', feedback_error: 'El NO no sacó a Pinochet de su cargo inmediatamente, sino que forzó las elecciones de 1989 (ganadas por Aylwin).' },
            { id: 3310, enunciado: 'Una de las características o "amarres" que limitó el poder de los primeros gobiernos democráticos (Concertación) en la década de 1990 fue:', alternativas: { A: 'La permanencia de Augusto Pinochet como Comandante en Jefe del Ejército.', B: 'El control de la economía por parte de los sindicatos comunistas.', C: 'La prohibición constitucional de negociar tratados de libre comercio.', D: 'El veto del gobierno de los Estados Unidos a sus leyes sociales.' }, respuesta_correcta: 'A', feedback_acierto: '¡Exacto! Fue una transición pactada y vigilada por los militares, lo que obligaba a buscar consensos (y generaba miedo).', feedback_error: 'Recuerda que Pinochet no se retiró de la vida pública. Se quedó al mando de las Fuerzas Armadas hasta 1998.' },
            { id: 33051, enunciado: 'La transición a la democracia en Chile estuvo marcada por ser un proceso:', alternativas: { A: 'Rupturista y violento, logrando derrocar a Pinochet por las armas.', B: 'Pactado, gradual e institucionalizado a través de la propia Constitución de 1980.', C: 'Impulsado exclusivamente por la presión diplomática internacional.', D: 'Dirigido por el Partido Comunista y grupos guerrilleros.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Se usaron las mismas reglas de la dictadura (el plebiscito) para sacar a Pinochet.', feedback_error: 'A diferencia de otras dictaduras que cayeron por revoluciones, en Chile se derrotó al régimen usando sus propias leyes electorales.' },
            { id: 33052, enunciado: 'Durante los gobiernos de la Concertación en los años 90, la política económica se caracterizó por:', alternativas: { A: 'Mantener el modelo de libre mercado (neoliberal), pero con mayor gasto social (crecimiento con equidad).', B: 'Volver inmediatamente al modelo ISI y estatizar las empresas.', C: 'Nacionalizar toda la banca privada e instituciones financieras.', D: 'Aislar a Chile de los tratados de libre comercio.' }, respuesta_correcta: 'A', feedback_acierto: '¡Bien! No cambiaron el modelo económico, sino que buscaron disminuir la extrema pobreza heredada.', feedback_error: 'La coalición que asumió no destruyó el modelo de los Chicago Boys, sino que trató de hacerlo menos desigual.' },
            { id: 33053, enunciado: 'Uno de los principales problemas políticos que enfrentaron los primeros gobiernos democráticos (Aylwin, Frei) fueron los "enclaves autoritarios", como:', alternativas: { A: 'Los sindicatos con demasiado poder.', B: 'Los senadores designados y la inamovilidad de los comandantes en jefe de las FF.AA.', C: 'Las leyes electorales proporcionales.', D: 'La presión del Fondo Monetario Internacional.' }, respuesta_correcta: 'B', feedback_acierto: '¡Excelente! Estos "cerrojos" impedían tener mayorías en el Congreso y mantenían a los militares fuera del control civil.', feedback_error: 'Eran mecanismos dejados por la dictadura en la Constitución para mantener poder e influencia, limitando la democracia.' }
          ]
        }
      }
    ]
  },

  // ==========================================
  // CAPITULO 4: Ciudadanía y Justicia en el Mundo Actual
  // ==========================================
  {
    id: 'cap-hist-4',
    materiaId: 'historia',
    title: 'Ciudadanía y Justicia en el Mundo Actual',
    introduccion: 'Aprende los pilares de la democracia, los desafíos de la desinformación y cómo funciona el sistema judicial.',
    order: 4,
    paesWeight: '25% de la PAES',
    imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783833825/vx0jfetabtqg3jsgkdfi.jpg',
    secciones: [
      {
        id: 'sec-hist-4-1',
        title: '1. Fundamentos de la Democracia y el Estado',
        introduccion: 'La democracia moderna no se limita a realizar elecciones periódicas; exige un compromiso profundo con la soberanía popular y el Estado de Derecho.',
        guia_titulo: '📖 Teoría y Contexto Histórico',
        guia_contenido: `La democracia moderna no se limita a realizar elecciones periódicas; exige un compromiso profundo con la soberanía popular y el Estado de Derecho. En Chile, el Artículo 5° de la Constitución consagra que la soberanía reside en la Nación y se ejerce a través del voto y de las autoridades que la propia Carta Magna establece. Para que un sistema democrático funcione plenamente, deben garantizarse tres pilares esenciales: primero, la Soberanía Popular, que implica que el poder político emana del pueblo y éste lo delega en representantes elegidos en elecciones libres, informadas y periódicas. Segundo, el Estado de Derecho (Arts. 6° y 7° CPR), que somete a todas las personas e instituciones —incluidas las autoridades— al marco legal vigente: nadie puede actuar fuera de sus competencias ni por encima de la Constitución. Tercero, la Separación de Poderes: la división del poder estatal en Ejecutivo (Presidente de la República), Legislativo (Congreso Nacional) y Judicial (tribunales), junto a organismos autónomos como la Contraloría General de la República, el Tribunal Constitucional y el Banco Central, que funcionan como contrapesos que evitan la concentración y el abuso del poder.`,
        datos_claves: [
          '**Soberanía Popular (Art. 5° CPR):** El poder supremo emana de la Nación; el pueblo lo ejerce directamente (plebiscitos) o a través de representantes electos en votaciones libres y periódicas.',
          '**Estado de Derecho (Arts. 6° y 7° CPR):** Todas las personas, organismos e instituciones —públicas y privadas— están sometidas a la Constitución y a las leyes; ninguna autoridad puede actuar más allá de sus atribuciones.',
          '**Pluralismo Político:** Garantía constitucional que asegura la coexistencia de diversas ideologías, partidos e ideas; es la esencia de la democracia representativa.',
          '**Separación de Poderes (Montesquieu):** División del poder del Estado en Ejecutivo, Legislativo y Judicial para que un poder frene a otro y se evite la tiranía (pesos y contrapesos).',
          '**Órganos Autónomos:** La Contraloría fiscaliza la legalidad del gasto público; el Tribunal Constitucional revisa si las leyes respetan la Constitución; el Banco Central vela por la estabilidad monetaria.'
        ],
        order: 1,        imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905039/y4uzuo3kfgtgfa3mwu0j.jpg',

        test: {
          id: 'test-hist-4-1',
          contexto_base: 'El término democracia proviene del griego (demos = pueblo, kratos = poder). En las democracias modernas y representativas, como la chilena, el poder no reside en un rey, sino en la "Soberanía Popular"; el pueblo elige a sus representantes (Presidente, parlamentarios, alcaldes) a través de elecciones libres, periódicas e informadas. Para que una democracia sea real, debe garantizar el pluralismo (competencia justa entre diversos partidos políticos), la protección inalienable de los Derechos Humanos y el apego al Estado de Derecho, lo que significa que ni siquiera el gobierno de turno puede pasar por encima de la Constitución.',
          preguntas: [
            { id: 3401, enunciado: '¿Cuál es el principio fundamental que sostiene que el poder político de una nación emana de sus propios ciudadanos?', alternativas: { A: 'El pluralismo político.', B: 'El Estado de Derecho.', C: 'La Soberanía Popular.', D: 'El sufragio censitario.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! La soberanía (el poder supremo) le pertenece al pueblo.', feedback_error: 'Busca el concepto que indique de dónde nace el poder. "Soberanía" es poder supremo, y "Popular" se refiere al pueblo.' },
            { id: 3402, enunciado: 'La existencia de diversos partidos políticos, medios de comunicación de distintas líneas editoriales y libertad de asociación son ejemplos directos de:', alternativas: { A: 'Pluralismo en una sociedad democrática.', B: 'Concentración del poder estatal.', C: 'Un régimen totalitario.', D: 'Nepotismo institucional.' }, respuesta_correcta: 'A', feedback_acierto: '¡Muy bien! El pluralismo es esencial: sin opciones distintas, la democracia no existe.', feedback_error: 'La palabra clave es "diversos". ¿Cómo se le llama a la aceptación de ideas variadas en política?' }
          ]
        }
      },
      {
        id: 'sec-hist-4-2',
        title: '2. Ciudadanía Activa',
        introduccion: 'El concepto tradicional de ciudadanía, centrado exclusivamente en el sufragio, ha evolucionado hacia una "Ciudadanía Activa".',
        guia_titulo: '📖 Teoría y Contexto Histórico',
        guia_contenido: `La ciudadanía se adquiere automáticamente al cumplir 18 años si no se ha sido condenado a pena aflictiva (más de 3 años de privación de libertad). Pero más allá del simple estatus jurídico, el concepto contemporáneo habla de "Ciudadanía Activa": un rol dinámico en el que las personas no solo ejercen su derecho a voto, sino que participan permanentemente en el espacio público para mejorar la sociedad. En Chile, desde 2012, existe la inscripción electoral automática para todos los mayores de 18 años y, desde 2022, el voto es obligatorio para elecciones de autoridades populares. La participación no electoral es igualmente vital: organizaciones sociales como las Juntas de Vecinos, Centros de Alumnos, ONGs, cabildos ciudadanos y movimientos sociales son expresiones directas de la sociedad civil. Por otro lado, la Ley de Transparencia (N° 20.285) obliga a todos los organismos del Estado a publicar en línea sus contratos, sueldos y gastos, y permite a cualquier ciudadano pedir información pública; esto es la base del deber de rendición de cuentas (accountability) que tienen las autoridades hacia quienes los eligieron.`,
        datos_claves: [
          '**Requisitos de Ciudadanía:** Tener 18 años y no haber sido condenado a pena aflictiva. Los ciudadanos tienen derecho a sufragio activo (votar) y pasivo (ser candidato).',
          '**Voto Obligatorio con Inscripción Automática:** Desde 2022, todos los ciudadanos inscritos automáticamente deben votar en elecciones populares; abstenerse tiene consecuencias legales.',
          '**Participación Social (No Electoral):** Juntas de Vecinos, ONGs, Centros de Alumnos, marchas pacíficas y cabildos son formas de ejercer ciudadanía activa sin necesidad de esperar elecciones.',
          '**Rendición de Cuentas (Accountability):** Las autoridades están éticamente obligadas a justificar sus decisiones y transparentar el uso del dinero público ante la ciudadanía que los eligió.',
          '**Ley de Transparencia N° 20.285:** Garantiza el acceso ciudadano a la información de los organismos del Estado; estos deben publicar contratos, sueldos y gastos, y responder solicitudes de información.'
        ],
        order: 2,        imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905040/kei7irgbxklaibqbbxvc.jpg',

        test: {
          id: 'test-hist-4-2',
          contexto_base: 'Históricamente, ser ciudadano significaba únicamente tener derecho a votar. Hoy, el concepto es mucho más amplio: hablamos de "Ciudadanía Activa". Esto implica que las personas no solo ejercen sus derechos políticos electorales, sino que se involucran cotidianamente en el espacio público para mejorar la sociedad. Un ciudadano activo se informa, paga sus impuestos, participa en organizaciones sociales (juntas de vecinos, agrupaciones estudiantiles, ONG), protesta pacíficamente cuando hay injusticias, y exige transparencia a sus gobernantes (rendición de cuentas o accountability).',
          preguntas: [
            { id: 3403, enunciado: 'Una manifestación clara del ejercicio de una ciudadanía activa (no electoral) en la actualidad es:', alternativas: { A: 'Ir a votar en las elecciones presidenciales cada 4 años.', B: 'Pagar un soborno para agilizar un trámite municipal.', C: 'Organizar un comité vecinal para reforestar plazas y exigir mayor seguridad al municipio.', D: 'Inscribirse pasivamente en el registro electoral.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! La participación comunitaria para resolver problemas colectivos es el mejor ejemplo de ciudadanía activa.', feedback_error: 'La pregunta pide un ejemplo "no electoral" y "activo". Votar o inscribirse es electoral.' },
            { id: 3404, enunciado: 'El deber ético de las autoridades democráticas de explicar, justificar sus decisiones y transparentar el uso de recursos públicos ante los ciudadanos se conoce como:', alternativas: { A: 'Probidad administrativa.', B: 'Rendición de cuentas (accountability).', C: 'Cohecho estatal.', D: 'Soberanía nacional.' }, respuesta_correcta: 'B', feedback_acierto: '¡Muy bien! Las autoridades le deben cuentas a quienes los eligieron.', feedback_error: 'El concepto se refiere literalmente a "rendir" o dar "cuentas" de lo que se hace con el dinero y poder del Estado.' },
            { id: 34021, enunciado: 'La "Rendición de Cuentas" (o accountability) es un deber de las autoridades que consiste en:', alternativas: { A: 'Aceptar sobornos de manera transparente.', B: 'Censurar las críticas de los ciudadanos.', C: 'Explicar, justificar y transparentar ante la ciudadanía el uso de los recursos y las decisiones tomadas.', D: 'Rechazar la fiscalización de la prensa.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! En democracia, el político es un empleado público, por lo que debe dar cuentas a sus jefes (los ciudadanos).', feedback_error: 'Significa "rendir cuentas". ¿Qué hace alguien cuando rinde cuentas?' },
            { id: 34022, enunciado: 'El voto en Chile, para los ciudadanos mayores de 18 años, actualmente tiene el carácter de:', alternativas: { A: 'Voluntario en todas las elecciones.', B: 'Obligatorio, con inscripción automática.', C: 'Restringido a quienes acrediten estudios universitarios.', D: 'Exclusivo para personas nacidas dentro del territorio nacional.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! Desde hace poco, Chile retornó al voto obligatorio para fomentar la participación masiva.', feedback_error: 'Piensa en las últimas grandes elecciones. ¿Se podía elegir si ir o no sin recibir multas?' },
            { id: 34023, enunciado: 'Participar activamente en una Junta de Vecinos o en un Centro de Alumnos son ejemplos de:', alternativas: { A: 'Participación política electoral.', B: 'Participación ciudadana en el ámbito social o civil.', C: 'Ejercicios ilegales de la soberanía.', D: 'Instituciones del Estado de Derecho.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Es una forma de involucrarse en la comunidad, más allá de ir a votar.', feedback_error: 'Estas organizaciones no son parte del gobierno ni de las elecciones oficiales. Son parte de la sociedad civil.' }
          ]
        }
      },
      {
        id: 'sec-hist-4-3',
        title: '3. Medios de comunicación y Fake News',
        introduccion: 'La era digital ha transformado radicalmente nuestro acceso a la información, democratizando la comunicación pero trayendo nuevos peligros.',
        guia_titulo: '📖 Teoría y Contexto Histórico',
        guia_contenido: `Internet y las redes sociales democratizaron el acceso a la información y fortalecieron la libertad de expresión, pero también abrieron la puerta a uno de los mayores desafíos de la democracia contemporánea: la desinformación masiva. Las "Fake News" son contenidos deliberadamente falsos o engañosos, diseñados para manipular emociones —especialmente el miedo y la indignación—, desprestigiar a adversarios políticos o alterar los resultados de procesos electorales. El fenómeno de la "Posverdad" describe el escenario en el que los hechos objetivos y verificables importan menos en la formación de la opinión pública que las apelaciones emocionales y los prejuicios previos. Los algoritmos de las plataformas digitales agravan esto al crear las "Burbujas de Filtro" o "Cámaras de Eco": al mostrar al usuario principalmente contenido que coincide con lo que ya cree, refuerzan sus sesgos de confirmación y lo aíslan de perspectivas distintas, fragmentando el debate social. La principal defensa del ciudadano moderno es el desarrollo de la Alfabetización Mediática: la capacidad de leer críticamente, verificar las fuentes (autor, fecha, referencias), contrastar con medios confiables y no compartir información sin antes comprobar su veracidad.`,
        datos_claves: [
          '**Libertad de Expresión y de Prensa:** Derecho fundamental a buscar, recibir y difundir información sin censura previa; es la base del debate democrático informado.',
          '**Fake News y Desinformación:** Noticias creadas intencionalmente para engañar; su objetivo es polarizar, generar miedo y manipular elecciones o decisiones colectivas.',
          '**Posverdad:** Contexto donde los hechos objetivos influyen menos en la opinión pública que las emociones y creencias previas; la verdad subjetiva supera a la evidencia.',
          '**Cámaras de Eco y Burbujas de Filtro:** Efecto de los algoritmos que muestran solo contenido afín a los gustos del usuario, aislándolo de ideas distintas y aumentando la polarización.',
          '**Alfabetización Mediática:** Capacidad de verificar la fuente, el autor, la fecha y las referencias de cualquier información antes de creerla o compartirla; es la principal herramienta ciudadana contra la desinformación.'
        ],
        order: 3,        imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905040/elottrpyhfyxth84bsw8.jpg',

        test: {
          id: 'test-hist-4-3',
          contexto_base: 'En el siglo XXI, Internet y las redes sociales multiplicaron exponencialmente el acceso a la información, facilitando la libertad de expresión. Sin embargo, este ecosistema sin filtros editoriales permitió el auge de la desinformación y las "Fake News" (noticias falsas). Éstas son creadas intencionalmente para manipular emociones (generalmente miedo o indignación), desprestigiar a adversarios políticos o influir en los resultados de una elección. Esto crea burbujas de filtro donde los ciudadanos solo consumen información que refuerza sus prejuicios (sesgo de confirmación), amenazando gravemente la cohesión social y la calidad de la democracia al destruir el consenso sobre la realidad objetiva.',
          preguntas: [
            { id: 3405, enunciado: '¿De qué forma la propagación de "Fake News" en redes sociales representa un peligro directo para la democracia?', alternativas: { A: 'Obliga a los gobiernos a censurar el internet y apagar servidores internacionales.', B: 'Informa excesivamente a la población, provocando que los ciudadanos ya no quieran votar.', C: 'Desinforma y manipula la opinión pública, afectando la toma de decisiones racionales de los votantes.', D: 'Fomenta el monopolio de los diarios impresos tradicionales.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! Si la gente vota basándose en mentiras, la elección deja de ser genuinamente libre.', feedback_error: 'Piensa en el objetivo de una noticia falsa durante una elección: hacerte creer una mentira para que votes (o no votes) por alguien.' },
            { id: 3406, enunciado: 'El fenómeno en el cual los algoritmos de redes sociales solo muestran a un usuario información u opiniones que coinciden con sus propias creencias previas se denomina:', alternativas: { A: 'Censura previa.', B: 'Burbuja de filtro o cámara de eco.', C: 'Libertad editorial.', D: 'Pluralismo digital.' }, respuesta_correcta: 'B', feedback_acierto: '¡Muy bien! Las cámaras de eco nos aíslan de puntos de vista contrarios, aumentando la polarización política.', feedback_error: 'Es como estar encerrado en una burbuja donde solo escuchas el "eco" de tu propia voz.' },
            { id: 34031, enunciado: 'Las "Cámaras de Eco" en redes sociales afectan negativamente a la democracia porque:', alternativas: { A: 'Fomentan el debate constructivo con ideas opuestas.', B: 'Aíslan a los usuarios, mostrándoles solo opiniones que refuerzan sus prejuicios y dificultando el diálogo.', C: 'Bloquean automáticamente las noticias falsas.', D: 'Mejoran la comprensión lectora de la población.' }, respuesta_correcta: 'B', feedback_acierto: '¡Muy bien! Generan polarización porque las personas creen que todo el mundo piensa igual que ellas.', feedback_error: 'Si un algoritmo solo te muestra lo que tú ya crees, ¿cómo afecta eso a tu tolerancia hacia quienes piensan distinto?' },
            { id: 34032, enunciado: 'El fenómeno de la "Posverdad" se refiere a:', alternativas: { A: 'Una época donde la evidencia objetiva es fundamental para las decisiones.', B: 'La verificación científica de todos los datos en internet.', C: 'La situación en la que los hechos objetivos influyen menos en la opinión pública que las emociones y las creencias personales.', D: 'La honestidad absoluta de los políticos.' }, respuesta_correcta: 'C', feedback_acierto: '¡Exacto! A la gente ya no le importan tanto los datos duros, sino cómo se sienten frente a una noticia.', feedback_error: 'A veces, aunque muestres pruebas científicas o datos, la gente prefiere creer una mentira si esta confirma sus miedos.' },
            { id: 34033, enunciado: 'Una de las mejores herramientas ciudadanas para combatir la desinformación y las "Fake News" es:', alternativas: { A: 'La alfabetización mediática y la verificación de fuentes antes de compartir información.', B: 'Compartir inmediatamente toda la información que cause alarma.', C: 'Creer exclusivamente en cadenas de WhatsApp.', D: 'Exigir que el gobierno cierre las redes sociales.' }, respuesta_correcta: 'A', feedback_acierto: '¡Correcto! Leer con pensamiento crítico es nuestra mejor defensa.', feedback_error: 'El problema no es la red en sí, sino cómo la usamos. ¿Qué deberíamos hacer antes de reenviar algo?' }
          ]
        }
      },
      {
        id: 'sec-hist-4-4',
        title: '4. El Sistema Judicial Chileno',
        introduccion: 'Para garantizar la igualdad y el debido proceso, el sistema judicial chileno experimentó una profunda modernización a través de la Reforma Procesal Penal (iniciada el año 2000).',
        guia_titulo: '📖 Teoría y Contexto Histórico',
        guia_contenido: `A comienzos del siglo XXI, Chile implementó una de las transformaciones judiciales más importantes de su historia: la Reforma Procesal Penal, que se aplicó gradualmente entre 2000 y 2005 en todo el territorio. El sistema antiguo era inquisitivo: un mismo juez investigaba el delito, acusaba al imputado y luego dictaba la sentencia, todo en expedientes escritos y con escasa publicidad. Este esquema generaba lentitud extrema, posibles abusos y falta de imparcialidad. El nuevo sistema acusatorio separó radicalmente estas funciones: el Ministerio Público (Fiscalía), un organismo autónomo, dirige de manera exclusiva las investigaciones criminales con apoyo de Carabineros y la PDI, y ejerce la acción penal pública. La Defensoría Penal Pública garantiza que todo imputado, sin importar su situación económica, cuente con un abogado defensor de calidad. El Juzgado de Garantía controla que durante la investigación se respeten los derechos constitucionales del imputado (principio de inocencia, comunicación, etc.). Finalmente, el Tribunal de Juicio Oral en lo Penal escucha los argumentos y pruebas de ambas partes en audiencias públicas y orales, y dicta sentencia. Las garantías constitucionales del proceso son irrenunciables: la Presunción de Inocencia (nadie es culpable hasta que el juez lo declare), el Recurso de Amparo/Habeas Corpus (protección ante detenciones ilegales) y el Recurso de Protección (ante vulneración arbitraria de derechos fundamentales).`,
        datos_claves: [
          '**Reforma Procesal Penal (2000-2005):** Reemplazó los juicios escritos y secretos por un sistema oral, público y transparente, separando la investigación del juzgamiento.',
          '**Ministerio Público (Fiscalía):** Organismo autónomo que dirige en exclusiva la investigación de los delitos y ejerce la acción penal pública; trabaja con Carabineros y PDI.',
          '**Defensoría Penal Pública:** Asegura el derecho irrenunciable a una defensa técnica gratuita para todo imputado que no pueda costear un abogado privado.',
          '**Juzgado de Garantía y Tribunal Oral en lo Penal:** El primero vela por los derechos del imputado durante la investigación; el segundo dicta sentencia tras escuchar las pruebas de ambas partes en audiencia pública.',
          '**Presunción de Inocencia y Habeas Corpus:** Toda persona es inocente hasta sentencia condenatoria firme; el Recurso de Amparo protege ante detenciones ilegales o arbitrarias.'
        ],
        order: 4,        imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905045/ardr8kvu2sis5j2v4kqo.jpg',

        test: {
          id: 'test-hist-4-4',
          contexto_base: 'Para asegurar la igualdad ante la ley, el sistema de justicia debe ser imparcial. A principios de los años 2000, Chile implementó la Reforma Procesal Penal, reemplazando un sistema inquisitivo (antiguo, escrito, secreto, donde un mismo juez investigaba y condenaba) por un sistema acusatorio, oral y público. Ahora, los roles están estrictamente separados: el Ministerio Público (los fiscales) investiga los delitos de manera autónoma; la Defensoría Penal Pública asegura que todo acusado, aunque no tenga dinero, tenga un abogado; y el Juez (Tribunal de Garantía o Juicio Oral) simplemente escucha las pruebas de ambas partes y dicta sentencia. Esta separación garantiza el debido proceso y la presunción de inocencia.',
          preguntas: [
            { id: 3407, enunciado: 'En el actual sistema penal de Chile, ¿cuál es la función específica del Ministerio Público (Fiscalía)?', alternativas: { A: 'Dictar la sentencia definitiva tras escuchar los alegatos orales.', B: 'Dirigir en forma exclusiva la investigación de los delitos y formular la acusación contra los imputados.', C: 'Proveer de defensa jurídica gratuita a las víctimas de crímenes.', D: 'Redactar las leyes del código penal junto al Congreso.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Los fiscales buscan las pruebas con ayuda de las policías, pero NO son los que dictan las sentencias.', feedback_error: 'Piensa en las películas de juicios: el "fiscal" es quien acusa y aporta pruebas en contra del sospechoso.' },
            { id: 3408, enunciado: 'La creación de la Defensoría Penal Pública tuvo como propósito fundamental:', alternativas: { A: 'Garantizar el principio de presunción de inocencia y el derecho a una defensa técnica, incluso para quienes no pueden pagarla.', B: 'Castigar a los jueces corruptos que existían en el sistema antiguo.', C: 'Defender exclusivamente los intereses económicos del Estado frente a demandas ciudadanas.', D: 'Reemplazar el rol investigativo de Carabineros y la PDI.' }, respuesta_correcta: 'A', feedback_acierto: '¡Exacto! Sin defensa no hay justicia equitativa. Esto asegura que la balanza no se incline por factores económicos.', feedback_error: 'Si alguien es acusado de un crimen y no tiene plata para un abogado, ¿quién lo ayuda? Para eso se creó esta institución.' },
            { id: 34041, enunciado: '¿Qué principio garantiza que una persona no sea tratada como culpable hasta que un juez no dicte una sentencia en su contra?', alternativas: { A: 'Derecho a apelación.', B: 'Igualdad ante la ley.', C: 'Presunción de inocencia.', D: 'Habeas corpus.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! Eres inocente hasta que se demuestre lo contrario. Esto evita abusos.', feedback_error: 'Se asume o se "presume" algo positivo sobre la persona hasta que termine el juicio.' },
            { id: 34042, enunciado: 'Una de las grandes ventajas de la Reforma Procesal Penal (2000) respecto al sistema antiguo fue:', alternativas: { A: 'La instauración de la pena de muerte.', B: 'El reemplazo de juicios secretos y escritos por juicios orales, públicos y transparentes.', C: 'La eliminación de los abogados defensores.', D: 'La posibilidad de que Carabineros dicte sentencias directamente.' }, respuesta_correcta: 'B', feedback_acierto: '¡Muy bien! Ahora cualquier persona puede ir a ver un juicio oral, lo que garantiza transparencia.', feedback_error: 'Antes, todo se resolvía por cartas en una oficina cerrada. ¿Cómo son los juicios ahora?' },
            { id: 34043, enunciado: 'Dentro del actual proceso penal, si una persona considera que sus derechos fundamentales están siendo amenazados o que su detención es ilegal, el tribunal competente para protegerla durante la investigación es:', alternativas: { A: 'El Tribunal de Juicio Oral en lo Penal.', B: 'El Juzgado de Garantía.', C: 'El Tribunal Constitucional.', D: 'La Fiscalía Nacional.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! El Juez de Garantía está ahí justamente para "garantizar" que la policía y los fiscales no cometan abusos en la investigación.', feedback_error: 'Es un juez cuyo nombre incluye la palabra "garantizar" los derechos del imputado.' }
          ]
        }
      }
    ]
  },

  // ==========================================
  // CAPITULO 5: Economía, Desarrollo y Trabajo
  // ==========================================
  {
    id: 'cap-hist-5',
    materiaId: 'historia',
    title: 'Economía, Desarrollo y Trabajo',
    introduccion: 'Mecanismos del mercado, el modelo chileno y la importancia de los derechos de los trabajadores.',
    order: 5,
    paesWeight: '25% de la PAES',
    imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783833826/gfhv2l7brhvkrjrj3erb.jpg',
    secciones: [
      {
        id: 'sec-hist-5-1',
        title: '1. Funcionamiento del Mercado',
        introduccion: 'El problema económico fundamental radica en que las necesidades humanas son infinitas, pero los recursos para satisfacerlas son escasos.',
        guia_titulo: '📖 Teoría y Contexto Histórico',
        guia_contenido: `El problema central de la ciencia económica es la Escasez: los recursos con que cuenta una sociedad (capital, trabajo, tierra, tecnología) son finitos, mientras que las necesidades y deseos humanos son ilimitados. Ante este dilema, toda decisión implica un Costo de Oportunidad: el valor de la mejor alternativa a la que se renuncia al elegir una opción (por ejemplo, el costo de estudiar es el sueldo que se deja de ganar al trabajar). En una economía de libre mercado como la chilena, los precios no los fija el gobierno sino el juego de la Oferta (cantidad que los productores están dispuestos a vender) y la Demanda (cantidad que los consumidores están dispuestos a comprar): cuando la demanda sube y la oferta no aumenta, el precio sube. Sin embargo, el mercado no siempre funciona de manera eficiente o justa: existen Fallas de Mercado. El Monopolio ocurre cuando una sola empresa controla toda la producción de un bien, eliminando la competencia y pudiendo cobrar precios abusivos. La Colusión es un acuerdo ilegal y secreto entre empresas competidoras para fijar precios artificialmente altos o repartirse el mercado (casos emblemáticos en Chile: farmacias, pollos, papel higiénico, navieras). Para combatir estos abusos, existe la Fiscalía Nacional Económica (FNE) y el Tribunal de Defensa de la Libre Competencia (TDLC), mientras que el SERNAC protege los derechos de los consumidores.`,
        datos_claves: [
          '**Escasez y Costo de Oportunidad:** Los recursos son limitados; elegir una opción implica renunciar a la siguiente mejor alternativa, cuyo valor es el costo de oportunidad.',
          '**Ley de Oferta y Demanda:** El precio de equilibrio se determina por la interacción entre la cantidad ofrecida y la demandada; cambios en alguna de ellas alteran el precio de mercado.',
          '**Monopolio y Oligopolio:** Fallas de mercado donde uno o pocos actores controlan la producción, eliminando la competencia y permitiendo cobrar precios abusivos a los consumidores.',
          '**Colusión de Precios:** Acuerdo ilegal y secreto entre empresas rivales para fijar precios altos o repartirse el mercado; es perseguida penalmente por la Fiscalía Nacional Económica (FNE).',
          '**FNE y SERNAC:** La Fiscalía Nacional Económica investiga y sanciona las conductas anticompetitivas; el SERNAC protege los derechos de los consumidores frente a abusos del mercado.'
        ],
        order: 1,        imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905041/ahfrpvle3kr0rwtekpkw.webp',

        test: {
          id: 'test-hist-5-1',
          contexto_base: 'El problema económico fundamental es la escasez: los recursos son limitados, pero las necesidades humanas son infinitas. En los sistemas de mercado (capitalismo), la forma en que se decide qué producir y a qué precio vender se rige por las fuerzas de la Oferta (cantidad de bienes disponibles) y la Demanda (cantidad de bienes que la gente quiere comprar). En teoría, si hay mucha competencia, los precios bajan y la calidad sube. Sin embargo, el mercado es imperfecto. En Chile hemos visto "fallas de mercado" severas como la Colusión (cuando empresas competidoras, como las de farmacias o papel higiénico, se ponen de acuerdo en secreto para subir los precios de manera artificial), afectando gravemente a los consumidores.',
          preguntas: [
            { id: 3501, enunciado: '¿Qué ocurre generalmente con el precio de un bien en un libre mercado si su demanda aumenta rápidamente pero la oferta se mantiene constante (escasez)?', alternativas: { A: 'El precio se mantiene estable por regulación del Banco Central.', B: 'El precio disminuye porque los productores quieren vender rápido.', C: 'El precio aumenta debido a que los consumidores están dispuestos a pagar más por el bien escaso.', D: 'El precio cae a cero porque el bien deja de tener valor.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! A mayor demanda y poca oferta, el precio siempre tiende a subir.', feedback_error: 'Imagina el precio de las mascarillas al inicio de la pandemia. Todos querían, pero había pocas.' },
            { id: 3502, enunciado: 'El fenómeno de la "colusión" es considerado una grave imperfección del mercado porque:', alternativas: { A: 'Elimina la competencia entre empresas, permitiéndoles fijar precios artificialmente altos en perjuicio de los consumidores.', B: 'Obliga a las empresas a pagar salarios mínimos muy elevados.', C: 'Genera un exceso de oferta que lleva a la quiebra de la industria.', D: 'Impide la recolección de impuestos por parte del Estado.' }, respuesta_correcta: 'A', feedback_acierto: '¡Muy bien! Cuando los que deberían competir se asocian en secreto para subir precios, el consumidor es el único que pierde.', feedback_error: 'Las farmacias se "coludieron" hace unos años. ¿Qué hicieron? Se pusieron de acuerdo para no competir y cobrar más caro.' },
            { id: 35011, enunciado: 'El modelo económico en el cual los precios de los bienes y servicios son determinados exclusivamente por la interacción de la oferta y la demanda, sin intervención del Estado, se conoce teóricamente como:', alternativas: { A: 'Economía de planificación central.', B: 'Economía de libre mercado perfecto.', C: 'Economía mixta.', D: 'Mercantilismo estatal.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! En un mercado puro, solo las fuerzas de quienes compran y venden fijan el precio.', feedback_error: 'Busca la opción que mencione la "libertad" de los actores para transar.' },
            { id: 35012, enunciado: 'En una economía de mercado, si se produce un monopolio (una sola empresa ofrece un bien esencial), ¿qué consecuencia directa sufre el consumidor?', alternativas: { A: 'Los precios bajan drásticamente por la eficiencia de la empresa.', B: 'Queda desprotegido ante posibles abusos y alzas arbitrarias de precios por falta de competencia.', C: 'Aumentan sus opciones de compra.', D: 'Recibe subsidios automáticos del monopolio.' }, respuesta_correcta: 'B', feedback_acierto: '¡Muy bien! Sin competencia, el monopolio cobra lo que quiere.', feedback_error: 'Si solo hay un supermercado en toda la ciudad y necesitas pan, el dueño puede cobrar el precio que se le antoje.' },
            { id: 35013, enunciado: '¿Cuál es el rol fundamental de la Fiscalía Nacional Económica (FNE) en Chile respecto a las "fallas de mercado"?', alternativas: { A: 'Fijar el precio oficial de todos los alimentos básicos.', B: 'Investigar y perseguir prácticas anticompetitivas como la colusión o el abuso de posición dominante.', C: 'Entregar préstamos a empresas que están a punto de quebrar.', D: 'Redactar los contratos laborales de los trabajadores privados.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! Es la "policía" que vigila que las empresas compitan limpiamente y no se coludan.', feedback_error: 'Es un organismo que defiende la libre competencia persiguiendo a quienes hacen trampa (como en el caso del confort).' }
          ]
        }
      },
      {
        id: 'sec-hist-5-2',
        title: '2. El Rol del Estado y los Impuestos',
        introduccion: 'El Estado necesita recursos para proveer bienes públicos como salud y educación, los cuales obtiene principalmente a través de impuestos como el IVA y el Impuesto a la Renta.',
        guia_titulo: '📖 Teoría y Contexto Histórico',
        guia_contenido: `El Estado chileno, según la Constitución de 1980, tiene un rol "subsidiario": no compite con los privados en la economía, sino que sólo interviene cuando estos no pueden o no quieren actuar. Para financiar sus funciones básicas (salud pública, seguridad, educación, justicia e infraestructura), el Estado recauda impuestos a través del Servicio de Impuestos Internos (SII). Los impuestos se dividen en directos e indirectos. Los impuestos directos gravan el ingreso o patrimonio; el principal es el Impuesto a la Renta, de carácter progresivo: a mayor ingreso, mayor porcentaje de impuesto que se paga, lo que contribuye a reducir la desigualdad. Los impuestos indirectos, en cambio, gravan el consumo; el principal es el IVA (Impuesto al Valor Agregado) del 19%, que se cobra en prácticamente toda compra de bienes y servicios. El IVA se considera regresivo: como es una tasa fija para todos, representa una proporción mucho mayor del sueldo de una familia de bajos ingresos que gasta todo en consumo básico, que del sueldo de una familia adinerada que ahorra e invierte. El presupuesto nacional —elaborado por el Ejecutivo y aprobado por el Congreso— decide cómo se distribuyen estos ingresos en gasto social (salud, educación, pensiones) e inversiones públicas.`,
        datos_claves: [
          '**Estado Subsidiario:** El Estado chileno solo interviene directamente en la economía cuando el sector privado no puede o no quiere hacerlo; la iniciativa privada es el motor principal del desarrollo.',
          '**Impuesto Progresivo (Renta):** Grava los ingresos o patrimonios; paga más quien más gana. Contribuye a reducir la brecha económica entre distintos segmentos de la sociedad.',
          '**Impuesto Regresivo (IVA 19%):** Grava el consumo con una tasa fija para todos; impacta proporcionalmente más a las familias de bajos ingresos que destinan todo su sueldo a compras básicas.',
          '**Servicio de Impuestos Internos (SII):** Organismo encargado de fiscalizar el correcto cumplimiento tributario, detectar evasiones y facilitar la declaración de impuestos en Chile.',
          '**Presupuesto Nacional:** Ley anual elaborada por el Ministerio de Hacienda y aprobada por el Congreso que establece cómo se gastarán los ingresos fiscales en salud, educación, seguridad y obras públicas.'
        ],
        order: 2,        imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905041/e2y8gqkm53jjo0fql4ko.jpg',

        test: {
          id: 'test-hist-5-2',
          contexto_base: 'Para financiar obras públicas, hospitales y educación, el Estado necesita recursos. Su principal fuente de ingresos son los impuestos. En Chile, el impuesto que más dinero recauda es el IVA (Impuesto al Valor Agregado, 19%), que se cobra cada vez que compramos cualquier producto. El IVA es considerado un impuesto "regresivo", porque afecta proporcionalmente más a los más pobres, ya que destinan todo su sueldo al consumo básico. En términos macroeconómicos, la Constitución de 1980 estableció para Chile un Estado Subsidiario: el Estado no debe tener empresas ni intervenir en áreas de la economía a menos que el sector privado no pueda o no quiera participar por falta de rentabilidad.',
          preguntas: [
            { id: 3503, enunciado: '¿Por qué se clasifica al IVA como un impuesto "regresivo"?', alternativas: { A: 'Porque solo lo pagan las personas que perciben sueldos muy altos.', B: 'Porque es una tasa fija (19%) que impacta más fuerte en el bolsillo de las familias de menores ingresos que gastan todo su dinero en consumo.', C: 'Porque se cobra exclusivamente a las empresas importadoras.', D: 'Porque su tasa disminuye a medida que aumenta la inflación.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Si ganas el sueldo mínimo y gastas todo en comida, pagas 19% por todo tu sueldo. Un millonario ahorra y paga menos proporción de IVA.', feedback_error: 'Un impuesto es regresivo si afecta más fuerte a los pobres que a los ricos.' },
            { id: 3504, enunciado: 'El principio del "Estado Subsidiario" que rige el modelo económico chileno establece que:', alternativas: { A: 'El Estado es el principal dueño de las industrias del país y planifica centralizadamente la economía.', B: 'El Estado otorga un subsidio mensual a todas las familias de manera universal.', C: 'La iniciativa privada es el motor de la economía y el Estado interviene solo de manera residual o cuando los privados no actúan.', D: 'El sector privado está impedido de participar en la educación y la salud.' }, respuesta_correcta: 'C', feedback_acierto: '¡Exacto! El Estado da un paso atrás y deja que los privados actúen en salud, educación, previsión y comercio.', feedback_error: 'La subsidiariedad significa que el Estado solo entra "a la cancha" cuando el jugador privado no quiere o no puede jugar.' },
            { id: 35021, enunciado: 'El Impuesto a la Renta en Chile, que cobra un porcentaje mayor a quienes tienen sueldos más altos, es un ejemplo de impuesto:', alternativas: { A: 'Regresivo.', B: 'Proporcional.', C: 'Progresivo.', D: 'Indirecto.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! A diferencia del IVA, el impuesto a la renta es progresivo (paga más quien gana más).', feedback_error: 'Si el impuesto aumenta a medida que "progresa" o sube tu sueldo, ¿cómo se llamará?' },
            { id: 35022, enunciado: 'El principio de "Subsidiariedad" del Estado chileno implica en la práctica que:', alternativas: { A: 'El Estado no interviene creando empresas públicas si los privados están dispuestos a invertir en ese sector.', B: 'El Estado garantiza bonos universales mensuales a toda la población.', C: 'El Estado asume la propiedad total de las riquezas mineras.', D: 'Los privados tienen prohibido crear colegios o universidades.' }, respuesta_correcta: 'A', feedback_acierto: '¡Muy bien! El Estado se margina de la actividad económica directa, dejándola en manos privadas.', feedback_error: 'Subsidiario significa que el Estado solo entra como "suplente" cuando el sector privado "titular" no quiere participar.' },
            { id: 35023, enunciado: '¿Cuál es el propósito principal de la recaudación de impuestos por parte del Estado?', alternativas: { A: 'Enriquecer a los parlamentarios.', B: 'Financiar el gasto público, proveer bienes sociales (salud, seguridad) y redistribuir la riqueza.', C: 'Reducir artificialmente las ganancias de las empresas extranjeras.', D: 'Desincentivar el trabajo formal.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Sin impuestos, no habría hospitales públicos, policías, carreteras ni colegios gratuitos.', feedback_error: '¿De dónde saca plata el gobierno para construir un puente o pagarle a Carabineros?' }
          ]
        }
      },
      {
        id: 'sec-hist-5-3',
        title: '3. Desarrollo Sustentable',
        introduccion: 'El modelo económico chileno es de carácter primario-exportador (o extractivista), basado fuertemente en la explotación y exportación de materias primas con bajo valor agregado (cobre, litio, forestal, salmonicultura).',
        guia_titulo: '📖 Teoría y Contexto Histórico',
        guia_contenido: `Chile está muy integrado a la economía global a través de su modelo primario-exportador: vende materias primas (cobre, litio, manzanas, salmones) al mundo y compra manufactura tecnológica. Para facilitar este comercio, ha firmado numerosos Tratados de Libre Comercio (TLCs) con EE.UU., China, la Unión Europea y más de 60 economías. Si bien la globalización ha traído crecimiento económico, también ha generado profundos daños medioambientales: agotamiento de acuíferos, deforestación y las llamadas "Zonas de Sacrificio", como Quintero-Puchuncaví, donde la concentración industrial ha devastado la salud de los vecinos. Ante la crisis climática global, surge el concepto de Desarrollo Sustentable (o Sostenible), definido por la ONU como "el desarrollo que satisface las necesidades del presente sin comprometer la capacidad de las generaciones futuras de satisfacer sus propias necesidades". Sus tres pilares son: el crecimiento económico, la equidad social y la protección medioambiental. Chile ha avanzado hacia este modelo con la transición energética (masificación de energías solar y eólica), el impulso a la Economía Circular (reutilizar, reparar y reciclar en lugar de desechar) y la producción de Hidrógeno Verde gracias al potencial de sus desiertos y costas.`,
        datos_claves: [
          '**Modelo Primario Exportador:** Chile vende recursos naturales con poco procesamiento (cobre, litio, fruta, salmones) y depende de los precios internacionales de esas materias primas.',
          '**Tratados de Libre Comercio (TLCs):** Acuerdos bilaterales o multilaterales para reducir o eliminar barreras arancelarias al comercio; Chile tiene TLCs con EE.UU., China y la UE, entre otros.',
          '**Desarrollo Sustentable (ONU):** Modelo de progreso que equilibra crecimiento económico, equidad social y cuidado del medio ambiente para no comprometer los recursos de las generaciones futuras.',
          '**Zonas de Sacrificio:** Áreas que concentran industrias contaminantes (termoelectricas, refinerías) cuya contaminación enferma a los habitantes locales en beneficio del desarrollo económico nacional.',
          '**Economía Circular y Energías Renovables:** La Economía Circular busca eliminar desechos reutilizando materiales; las Energías Renovables (solar, eólica) reducen las emisiones de CO₂ y la dependencia de combustibles fósiles.'
        ],
        order: 3,        imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905042/lflmpcg6lybq7elbnvas.png',

        test: {
          id: 'test-hist-5-3',
          contexto_base: 'Históricamente, Chile ha dependido de exportar recursos naturales (cobre, litio, salmones, fruta, madera) en un modelo extractivista. Si bien esto trae crecimiento económico a corto plazo, genera fuertes impactos medioambientales: deforestación, agotamiento del agua (sequía) y contaminación industrial en las llamadas "zonas de sacrificio" (como Quintero-Puchuncaví). Ante la crisis climática global, surge el paradigma del Desarrollo Sustentable, que sostiene que el crecimiento económico debe estar en armonía con la equidad social y el cuidado ecológico. La meta ya no es solo extraer para vender rápido, sino hacerlo de manera que nuestros hijos y nietos puedan seguir viviendo en un entorno sano.',
          preguntas: [
            { id: 3505, enunciado: 'La esencia del concepto de "Desarrollo Sustentable" radica en:', alternativas: { A: 'Frenar completamente el crecimiento industrial a nivel global para salvar la naturaleza.', B: 'Promover la explotación acelerada de recursos renovables para abaratar costos.', C: 'Lograr un equilibrio donde el desarrollo económico actual no comprometa los recursos y la calidad de vida de las generaciones futuras.', D: 'Extraer recursos naturales y exportarlos sin ningún procesamiento industrial.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! Es usar responsablemente lo que tenemos hoy, pensando en el mañana.', feedback_error: 'Sustentable = que se sostiene en el tiempo. Busca la opción que relacione la economía de hoy con el futuro de la humanidad.' },
            { id: 3506, enunciado: 'El modelo económico de Chile, centrado fuertemente en la exportación de materias primas (extractivismo), presenta como uno de sus mayores riesgos a largo plazo:', alternativas: { A: 'La rápida diversificación tecnológica del país.', B: 'La vulnerabilidad ante las fluctuaciones de precios internacionales y el daño irreversible a los ecosistemas locales.', C: 'El surgimiento de múltiples industrias pesadas y automotrices.', D: 'La erradicación definitiva de los conflictos ambientales locales.' }, respuesta_correcta: 'B', feedback_acierto: '¡Muy bien! Si el precio del cobre cae en China, Chile sufre. Además, extraer tanto daña nuestro medio ambiente.', feedback_error: 'Un modelo extractivista depende de que nos compren recursos sin valor agregado. ¿Qué pasa si bajan los precios o se acaba el recurso?' },
            { id: 35031, enunciado: 'Una de las críticas más fuertes al modelo económico primario exportador chileno es que:', alternativas: { A: 'Desarrolla excesivamente la industria pesada y la tecnología de punta.', B: 'Depende de recursos naturales no renovables y tiene bajo valor agregado (poca industrialización).', C: 'Aísla a Chile del comercio internacional.', D: 'Fomenta el excesivo proteccionismo estatal.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! Vendemos piedras y compramos computadores, lo que nos hace dependientes y frágiles.', feedback_error: 'Exportar cobre sin refinar es un ejemplo de vender algo tal como sale de la tierra, sin sumarle valor.' },
            { id: 35032, enunciado: 'El concepto de "Zonas de Sacrificio" en Chile (como Quintero, Tocopilla o Coronel) se refiere a:', alternativas: { A: 'Áreas protegidas legalmente donde está prohibida la industria.', B: 'Sectores geográficos que concentran alta contaminación industrial, afectando gravemente la salud de sus habitantes en pos del desarrollo económico del país.', C: 'Terrenos agrícolas destinados exclusivamente al cultivo de exportación.', D: 'Zonas urbanas destinadas a la construcción de viviendas sociales.' }, respuesta_correcta: 'B', feedback_acierto: '¡Lamentablemente correcto! Son pueblos que pagan con su salud el costo de tener termoeléctricas o refinerías.', feedback_error: 'La palabra "sacrificio" indica que estas comunidades están pagando un alto precio (su salud) para que el resto del país tenga energía.' },
            { id: 35033, enunciado: 'Una medida concreta orientada al Desarrollo Sustentable en la matriz energética chilena ha sido:', alternativas: { A: 'La construcción masiva de nuevas centrales a carbón.', B: 'El impulso y subsidio a la importación de petróleo refinado.', C: 'La fuerte inversión en energías Renovables No Convencionales (ERNC), como la solar y eólica.', D: 'El cierre definitivo de todas las industrias del país.' }, respuesta_correcta: 'C', feedback_acierto: '¡Muy bien! Chile tiene un enorme potencial solar (en el norte) y eólico (en el sur) que ya está aprovechando.', feedback_error: 'Si queremos cuidar el futuro y frenar el cambio climático, ¿qué tipo de energía necesitamos promover?' }
          ]
        }
      },
      {
        id: 'sec-hist-5-4',
        title: '4. Derechos Laborales y Sindicatos',
        introduccion: 'En el mercado laboral existe una asimetría de poder natural entre el empleador y el trabajador, por lo que el Estado establece leyes protectoras contenidas en el Código del Trabajo.',
        guia_titulo: '📖 Teoría y Contexto Histórico',
        guia_contenido: `El mercado laboral presenta una asimetría de poder estructural: el empleador tiene el capital y puede reemplazar trabajadores; el trabajador depende del salario para subsistir. Para equilibrar esta relación, el Estado establece el Derecho Laboral, contenido principalmente en el Código del Trabajo. Este cuerpo legal consagra derechos irrenunciables: sueldo mínimo (fijado anualmente por ley), jornada máxima de 40 horas semanales (reducción progresiva implementada desde 2024), feriado legal de 15 días hábiles al año, fuero maternal (protección contra el despido desde el embarazo hasta un año después del postnatal) e indemnización por años de servicio al ser despedido. La herramienta colectiva más poderosa de los trabajadores es el Sindicato: una organización voluntaria que los une para negociar colectivamente con el empleador condiciones mejores a las mínimas legales (sueldos, bonos, jornada). Si no hay acuerdo durante la Negociación Colectiva, los trabajadores pueden ejercer su derecho a Huelga: paralizar las actividades de la empresa para presionar al empleador a ceder. La Dirección del Trabajo (DT) y sus Inspectores fiscalizan el cumplimiento del Código del Trabajo y tramitan las denuncias de los trabajadores.`,
        datos_claves: [
          '**Código del Trabajo y Derechos Irrenunciables:** Ley que protege al trabajador con derechos mínimos que no pueden ser eliminados por contrato: sueldo mínimo, jornada máxima de 40 hrs, vacaciones, fuero maternal.',
          '**Sindicatos y Libertad Sindical:** Organizaciones voluntarias de trabajadores que los representan ante el empleador; tienen derecho constitucional a formarse libremente sin autorización previa.',
          '**Negociación Colectiva:** Proceso formal donde el sindicato y la empresa señalan sus condiciones para llegar a un Contrato Colectivo con mejores condiciones que el mínimo legal.',
          '**Derecho a Huelga:** Último recurso legal de los trabajadores durante una negociación colectiva sin acuerdo; consiste en paralizar las actividades de la empresa para presionar al empleador.',
          '**Dirección del Trabajo (DT):** Organismo estatal que fiscaliza el cumplimiento de la legislación laboral, atiende denuncias de trabajadores y aplica multas a empleadores que infringen sus derechos.'
        ],
        order: 4,        imageUrl: 'https://res.cloudinary.com/dqm3syhwr/image/upload/v1783905041/je4etlc1wgnxeuzdewjp.jpg',

        test: {
          id: 'test-hist-5-4',
          contexto_base: 'En las relaciones laborales, el trabajador siempre está en desventaja frente a la empresa (asimetría de poder). Para equilibrar esto, existe el Código del Trabajo. Este cuerpo legal establece derechos irrenunciables, como el salario mínimo, jornada máxima legal, feriado legal (vacaciones) y fuero maternal. Sin embargo, para mejorar sus condiciones más allá del mínimo legal, los trabajadores se organizan en Sindicatos. A través del derecho a huelga y la Negociación Colectiva, obligan a la empresa a sentarse a dialogar para acordar mejoras salariales o bonos. En Chile, la labor de vigilar y cursar multas a las empresas que no respetan estas leyes recae en la Dirección del Trabajo (Inspección del Trabajo).',
          preguntas: [
            { id: 3507, enunciado: '¿Cuál es el principal objetivo que persigue el proceso de "negociación colectiva" entre un sindicato y una empresa?', alternativas: { A: 'Delegar en el gobierno la fijación de los sueldos de todos los empleados.', B: 'Pactar beneficios, salarios y condiciones de trabajo superiores a las mínimas legales, a través de la unión de los trabajadores.', C: 'Despedir sin indemnización a los trabajadores que no cumplan las metas.', D: 'Modificar el Código del Trabajo mediante una votación interna de la empresa.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! Unidos, los trabajadores tienen fuerza para exigir un contrato colectivo con mejoras.', feedback_error: 'La palabra "colectiva" es clave. Juntos negocian beneficios que individualmente no lograrían.' },
            { id: 3508, enunciado: 'Si un trabajador en Chile siente que fue despedido injustificadamente o no le han pagado sus cotizaciones, ¿a qué entidad estatal debe acudir primariamente para estampar un reclamo o denuncia?', alternativas: { A: 'A Carabineros de Chile.', B: 'A la Tesorería General de la República.', C: 'A la Inspección del Trabajo (Dirección del Trabajo).', D: 'Al Ministerio de Hacienda.' }, respuesta_correcta: 'C', feedback_acierto: '¡Muy bien! La Inspección del Trabajo es el "árbitro" estatal en los conflictos laborales.', feedback_error: 'Existe una institución del Estado encargada específicamente de "inspeccionar" el mundo laboral.' },
            { id: 35041, enunciado: 'El Código del Trabajo en Chile se basa en el principio de que la relación entre empleador y trabajador:', alternativas: { A: 'Es de absoluta igualdad de condiciones.', B: 'Es asimétrica, por lo que la ley debe proteger a la parte más débil (el trabajador).', C: 'Debe ser regulada exclusivamente por el libre mercado, sin intervención estatal.', D: 'Beneficia siempre al empleador, quien debe ser protegido por el Estado.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Como el jefe tiene el dinero y el poder de despedir, la ley intenta equilibrar la balanza otorgando derechos irrenunciables al empleado.', feedback_error: '¿Quién tiene más poder a la hora de firmar un contrato: el dueño de la gran empresa o el ciudadano que busca empleo?' },
            { id: 35042, enunciado: 'El derecho a Huelga, reconocido en la legislación laboral chilena, es fundamental porque:', alternativas: { A: 'Permite a los trabajadores presionar paralizando la producción durante una negociación colectiva cuando no hay acuerdo con el empleador.', B: 'Autoriza a los trabajadores a destruir la infraestructura de la empresa.', C: 'Es un mecanismo para que la empresa reduzca sus impuestos anuales.', D: 'Faculta al Estado para tomar el control administrativo de la empresa privada.' }, respuesta_correcta: 'A', feedback_acierto: '¡Muy bien! La huelga es la principal herramienta de presión legítima que tienen los sindicatos.', feedback_error: 'Si los trabajadores piden aumento y el jefe dice "no", ¿cuál es su última herramienta pacífica para presionarlo?' },
            { id: 35043, enunciado: 'Un trabajador que ha sido despedido por "Necesidades de la empresa" tiene derecho legal al pago de:', alternativas: { A: 'Solo sus vacaciones proporcionales, sin indemnización adicional.', B: 'Una indemnización por años de servicio (un mes de sueldo por cada año trabajado).', C: 'Un bono vitalicio pagado por la AFP.', D: 'Nada, pues el despido por necesidades de la empresa no da derecho a finiquito.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! El despido por "necesidades de la empresa" es el único que obliga legalmente al pago de años de servicio.', feedback_error: 'Es una compensación monetaria que premia la antigüedad laboral del empleado al ser despedido sin culpa suya.' }
          ]
        }
      }
    ]
  }
];


async function seedFirestore() {
  console.log('🌱 Iniciando la creación de la MEJORADA ruta de aprendizaje de Historia...');

  try {
    const materiasRef = db.collection('lp_materias');
    for (const materia of MATERIAS) {
      await materiasRef.doc(materia.id).set(materia, { merge: true });
      console.log(`✅ Materia seeded: ${materia.id}`);
    }

    const capitulosRef = db.collection('lp_capitulos');
    for (const cap of CAPITULOS) {
      const { secciones, ...capituloData } = cap;
      await capitulosRef.doc(cap.id).set(capituloData);
      console.log(`✅ Capítulo seeded: ${cap.id}`);

      const seccionesRef = capitulosRef.doc(cap.id).collection('secciones');
      for (const sec of secciones) {
        const { test, ...seccionData } = sec;
        
        const secWithIds = {
          ...seccionData,
          materiaId: cap.materiaId,
          capituloId: cap.id,
          testId: test.id 
        };
        
        await seccionesRef.doc(sec.id).set(secWithIds);
        console.log(`✅ Sección seeded: ${sec.id}`);

        const testsRef = db.collection('lp_tests');
        await testsRef.doc(test.id).set({
          ...test,
          seccionId: sec.id
        });
        console.log(`✅ Test seeded: ${test.id}`);
      }
    }

    console.log('🎉 Seed de Historia MEJORADO completado con éxito!');
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
  }
}

seedFirestore();
