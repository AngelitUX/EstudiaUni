import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config();

// Intenta inicializar con variables de entorno o credenciales por defecto (Application Default Credentials)
const projectId = process.env.FIREBASE_PROJECT_ID || 'estudiauni';
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

if (privateKey && clientEmail) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
} else {
  admin.initializeApp({ projectId });
}

const db = admin.firestore();

const NUEVOS_CAPITULOS = [
  // ─── CIENCIAS TÉCNICO PROFESIONAL ───
  {
    id: 'cap-ctp-biologia',
    materiaId: 'ciencias-tp',
    title: 'Biología TP: Células y Funciones',
    introduccion: 'Domina los conceptos de organización celular, procesos biológicos, herencia y evolución aplicados al contexto técnico profesional.',
    order: 1,
    secciones: [
      { id: 'sec-ctp-bio-1', title: '1. Organización y Estructura Celular', introduccion: 'Estructura y función de organelos en procariontes y eucariontes.', order: 1, testId: 'test-ctp-bio-1', datos_claves: ['Flagelo: movilidad bacteriana.', 'REL: síntesis de lípidos y desintoxicación.'] },
      { id: 'sec-ctp-bio-2', title: '2. Especialización Celular', introduccion: 'Enterocitos, neuronas y células secretoras.', order: 2, testId: 'test-ctp-bio-2', datos_claves: ['Enterocitos: absorción intestinal.', 'Neuronas: propagación de impulsos.'] },
      { id: 'sec-ctp-bio-3', title: '3. Sistema Nervioso y Respuesta', introduccion: 'Impulso nervioso y coordinación del organismo.', order: 3, testId: 'test-ctp-bio-3', datos_claves: ['Sinapsis química.', 'Arco reflejo simple.'] },
      { id: 'sec-ctp-bio-4', title: '4. Sexualidad y Reproducción', introduccion: 'Dimensiones de la sexualidad humana y gametos.', order: 4, testId: 'test-ctp-bio-4', datos_claves: ['Gametos: ovocitos y espermatozoides.', 'Fecundación.'] },
      { id: 'sec-ctp-bio-5', title: '5. Control de la Natalidad', introduccion: 'Métodos naturales y artificiales de anticoncepción.', order: 5, testId: 'test-ctp-bio-5', datos_claves: ['Métodos de barrera.', 'Anticonceptivos hormonales.'] },
      { id: 'sec-ctp-bio-6', title: '6. ITS y Prevención', introduccion: 'Principales infecciones de transmisión sexual y cuidados.', order: 6, testId: 'test-ctp-bio-6', datos_claves: ['VIH/SIDA.', 'Uso de preservativos.'] },
      { id: 'sec-ctp-bio-7', title: '7. Ciclo Celular y Mitosis', introduccion: 'Etapas del ciclo y su importancia en el crecimiento.', order: 7, testId: 'test-ctp-bio-7', datos_claves: ['Interfase y Mitosis.', 'Cáncer y ciclo celular.'] },
      { id: 'sec-ctp-bio-8', title: '8. Meiosis y Variabilidad', introduccion: 'Contribución de la meiosis a la diversidad genética.', order: 8, testId: 'test-ctp-bio-8', datos_claves: ['Crossing-over.', 'Reducción cromosómica.'] },
      { id: 'sec-ctp-bio-9', title: '9. Biotecnología y Aplicaciones', introduccion: 'Manipulación genética en alimentos y medicina.', order: 9, testId: 'test-ctp-bio-9', datos_claves: ['Clonación de genes.', 'Enzimas industriales.'] },
      { id: 'sec-ctp-bio-10', title: '10. JEFE FINAL: El Organismo Vivo', introduccion: 'Evaluación integral de Biología TP.', order: 10, testId: 'test-ctp-bio-10', datos_claves: ['Repaso completo.', 'Desafío final.'] }
    ]
  },
  {
    id: 'cap-ctp-fisica',
    materiaId: 'ciencias-tp',
    title: 'Física TP: Ondas, Mecánica y Energía',
    introduccion: 'Analiza fenómenos ondulatorios, cinemática, dinámica y electricidad en situaciones prácticas.',
    order: 2,
    secciones: [
      { id: 'sec-ctp-fis-1', title: '1. Fenómenos Ondulatorios', introduccion: 'Reflexión y refracción en la vida cotidiana.', order: 1, testId: 'test-ctp-fis-1', datos_claves: ['Rebote de ondas.', 'Cambio de medio.'] },
      { id: 'sec-ctp-fis-2', title: '2. Espectro Electromagnético', introduccion: 'Usos tecnológicos de las ondas de radio a rayos X.', order: 2, testId: 'test-ctp-fis-2', datos_claves: ['Frecuencia y longitud de onda.', 'Fibra óptica.'] },
      { id: 'sec-ctp-fis-3', title: '3. Luz y Formación de Imágenes', introduccion: 'Comportamiento de la luz en espejos y lentes.', order: 3, testId: 'test-ctp-fis-3', datos_claves: ['Imágenes virtuales.', 'Enfoque de luz.'] },
      { id: 'sec-ctp-fis-4', title: '4. Movimiento Rectilíneo', introduccion: 'Rapidez, velocidad y aceleración en el transporte.', order: 4, testId: 'test-ctp-fis-4', datos_claves: ['MRU.', 'Distancia vs Desplazamiento.'] },
      { id: 'sec-ctp-fis-5', title: '5. Leyes de Newton', introduccion: 'Principios de inercia y acción-reacción.', order: 5, testId: 'test-ctp-fis-5', datos_claves: ['Inercia.', 'Parejas de fuerzas.'] },
      { id: 'sec-ctp-fis-6', title: '6. Fuerzas y Roce', introduccion: 'Efecto del roce estático y cinético.', order: 6, testId: 'test-ctp-fis-6', datos_claves: ['Fuerza de fricción.', 'Agarre de neumáticos.'] },
      { id: 'sec-ctp-fis-7', title: '7. Elasticidad y Hooke', introduccion: 'Sistemas elásticos en la industria.', order: 7, testId: 'test-ctp-fis-7', datos_claves: ['Resortes.', 'Constante de elasticidad.'] },
      { id: 'sec-ctp-fis-8', title: '8. Electricidad Básica', introduccion: 'Corriente eléctrica y flujo de carga.', order: 8, testId: 'test-ctp-fis-8', datos_claves: ['Ampere.', 'Voltaje.'] },
      { id: 'sec-ctp-fis-9', title: '9. Circuitos y Ley de Ohm', introduccion: 'Análisis de conexiones en serie y paralelo.', order: 9, testId: 'test-ctp-fis-9', datos_claves: ['Ohm.', 'Resistencia equivalente.'] },
      { id: 'sec-ctp-fis-10', title: '10. JEFE FINAL: Física Tecnológica', introduccion: 'Evaluación integral de Física TP.', order: 10, testId: 'test-ctp-fis-10', datos_claves: ['Ondas y Mecánica.', 'Desafío final.'] }
    ]
  },
  {
    id: 'cap-ctp-quimica',
    materiaId: 'ciencias-tp',
    title: 'Química TP: Estructura y Reacciones',
    introduccion: 'Estudia la composición de la materia, compuestos orgánicos y las relaciones estequiométricas.',
    order: 3,
    secciones: [
      { id: 'sec-ctp-qui-1', title: '1. Estructura Atómica', introduccion: 'Componentes del átomo y modelos fundamentales.', order: 1, testId: 'test-ctp-qui-1', datos_claves: ['Protones y neutrones.', 'Isótopos.'] },
      { id: 'sec-ctp-qui-2', title: '2. Clasificación de la Materia', introduccion: 'Sustancias puras y mezclas industriales.', order: 2, testId: 'test-ctp-qui-2', datos_claves: ['Mezclas homogéneas.', 'Compuestos.'] },
      { id: 'sec-ctp-qui-3', title: '3. Separación de Mezclas', introduccion: 'Decantación, filtración y destilación.', order: 3, testId: 'test-ctp-qui-3', datos_claves: ['Purificación.', 'Contextos industriales.'] },
      { id: 'sec-ctp-qui-4', title: '4. Química del Carbono', introduccion: 'Hibridación y tipos de enlaces en el carbono.', order: 4, testId: 'test-ctp-qui-4', datos_claves: ['Tetravalencia.', 'Enlaces sigma y pi.'] },
      { id: 'sec-ctp-qui-5', title: '5. Hidrocarburos', introduccion: 'Nomenclatura y propiedades de alcanos y alquenos.', order: 5, testId: 'test-ctp-qui-5', datos_claves: ['Cadena principal.', 'Combustibles.'] },
      { id: 'sec-ctp-qui-6', title: '6. Grupos Funcionales', introduccion: 'Alcoholes, éteres y otros grupos en procesos.', order: 6, testId: 'test-ctp-qui-6', datos_claves: ['Funciones oxigenadas.', 'Nombres comunes e IUPAC.'] },
      { id: 'sec-ctp-qui-7', title: '7. Reacciones Químicas', introduccion: 'Balance de ecuaciones y conservación de masa.', order: 7, testId: 'test-ctp-qui-7', datos_claves: ['Reactantes y productos.', 'Leyes ponderales.'] },
      { id: 'sec-ctp-qui-8', title: '8. Estequiometría', introduccion: 'Cálculos de moles y masas en el laboratorio.', order: 8, testId: 'test-ctp-qui-8', datos_claves: ['Mol.', 'Masa molar.'] },
      { id: 'sec-ctp-qui-9', title: '9. Reactivo Limitante', introduccion: 'Identificación de excedentes en reacciones.', order: 9, testId: 'test-ctp-qui-9', datos_claves: ['Rendimiento.', 'Reactivo en exceso.'] },
      { id: 'sec-ctp-qui-10', title: '10. JEFE FINAL: Reacciones y Mezclas', introduccion: 'Evaluación integral de Química TP.', order: 10, testId: 'test-ctp-qui-10', datos_claves: ['Estequiometría y Orgánica.', 'Desafío final.'] }
    ]
  },

  // ─── CIENCIAS BIOLOGÍA ───
  {
    id: 'cap-cbio-1',
    materiaId: 'ciencias-biologia',
    title: 'Biología: Organización y Estructura Celular',
    introduccion: 'Explora la base de la vida: desde la estructura de los organelos hasta el metabolismo energético celular.',
    order: 1,
    secciones: [
      { id: 'sec-cbio-1-1', title: '1. Células Procariontes y Eucariontes', introduccion: 'Diferencias fundamentales en la organización celular.', order: 1, testId: 'test-cbio-1-1', datos_claves: ['Procariontes: sin núcleo definido.', 'Eucariontes: con organelos membranosos.'] },
      { id: 'sec-cbio-1-2', title: '2. Membrana y Pared Celular', introduccion: 'Límites celulares y transporte.', order: 2, testId: 'test-cbio-1-2', datos_claves: ['Membrana: modelo mosaico fluido.', 'Pared: soporte y protección en vegetales.'] },
      { id: 'sec-cbio-1-3', title: '3. Núcleo y Nucléolo', introduccion: 'El centro de control y síntesis de ribosomas.', order: 3, testId: 'test-cbio-1-3', datos_claves: ['ADN cromatínico.', 'Nucléolo: síntesis ribosomal.'] },
      { id: 'sec-cbio-1-4', title: '4. Retículo Endoplasmático', introduccion: 'Síntesis de proteínas y lípidos.', order: 4, testId: 'test-cbio-1-4', datos_claves: ['RER: ribosomas asociados.', 'REL: desintoxicación celular.'] },
      { id: 'sec-cbio-1-5', title: '5. Aparato de Golgi y Vesículas', introduccion: 'Procesamiento y exportación de moléculas.', order: 5, testId: 'test-cbio-1-5', datos_claves: ['Golgi: maduración de proteínas.', 'Lisosomas: digestión celular.'] },
      { id: 'sec-cbio-1-6', title: '6. Mitocondrias y Cloroplastos', introduccion: 'Transformación energética celular.', order: 6, testId: 'test-cbio-1-6', datos_claves: ['Mitocondria: respiración celular.', 'Cloroplasto: fotosíntesis.'] },
      { id: 'sec-cbio-1-7', title: '7. Citoesqueleto y Movimiento', introduccion: 'Soporte interno, cilios y flagelos.', order: 7, testId: 'test-cbio-1-7', datos_claves: ['Microtúbulos y microfilamentos.', 'Movilidad celular.'] },
      { id: 'sec-cbio-1-8', title: '8. Especialización: Enterocito y Músculo', introduccion: 'Adaptación de la forma a la función.', order: 8, testId: 'test-cbio-1-8', datos_claves: ['Microvellosidades.', 'Proteínas contráctiles.'] },
      { id: 'sec-cbio-1-9', title: '9. Especialización: Neurona y Secreción', introduccion: 'Transmisión de señales y glándulas.', order: 9, testId: 'test-cbio-1-9', datos_claves: ['Axón y dendritas.', 'Células pancreáticas.'] },
      { id: 'sec-cbio-1-10', title: '10. JEFE FINAL: Microcosmos Celular', introduccion: 'Evaluación integral de la organización celular.', order: 10, testId: 'test-cbio-1-10', datos_claves: ['Repaso completo.', 'Desafío final.'] }
    ]
  },
  {
    id: 'cap-cbio-2',
    materiaId: 'ciencias-biologia',
    title: 'Biología: Procesos y Funciones Biológicas',
    introduccion: 'Analiza la coordinación nerviosa y la reproducción humana.',
    order: 2,
    secciones: [
      { id: 'sec-cbio-2-1', title: '1. Sistema Nervioso y Neuronas', introduccion: 'Organización funcional del sistema nervioso.', order: 1, testId: 'test-cbio-2-1', datos_claves: ['Células gliales.', 'Estructura neuronal.'] },
      { id: 'sec-cbio-2-2', title: '2. Impulso y Sinapsis', introduccion: 'Transmisión de señales eléctricas y químicas.', order: 2, testId: 'test-cbio-2-2', datos_claves: ['Potencial de acción.', 'Neurotransmisores.'] },
      { id: 'sec-cbio-2-3', title: '3. Arco Reflejo y Respuestas', introduccion: 'Coordinación rápida e involuntaria.', order: 3, testId: 'test-cbio-2-3', datos_claves: ['Vía aferente y eferente.', 'Médula espinal.'] },
      { id: 'sec-cbio-2-4', title: '4. Drogas y Salud del SN', introduccion: 'Impacto del consumo de sustancias.', order: 4, testId: 'test-cbio-2-4', datos_claves: ['Adicción.', 'Higiene del sueño.'] },
      { id: 'sec-cbio-2-5', title: '5. Gametos y Fecundación', introduccion: 'Inicio de una nueva vida.', order: 5, testId: 'test-cbio-2-5', datos_claves: ['Encuentro de gametos.', 'Reacción acrosómica.'] },
      { id: 'sec-cbio-2-6', title: '6. Aparatos Reproductores', introduccion: 'Anatomía y funciones de las gónadas.', order: 6, testId: 'test-cbio-2-6', datos_claves: ['Testículos y Ovarios.', 'Vías genitales.'] },
      { id: 'sec-cbio-2-7', title: '7. Ciclo Ovárico y Uterino', introduccion: 'Regulación hormonal del ciclo femenino.', order: 7, testId: 'test-cbio-2-7', datos_claves: ['LH, FSH, Estrógenos.', 'Menstruación.'] },
      { id: 'sec-cbio-2-8', title: '8. Control de Natalidad', introduccion: 'Métodos para planificar la familia.', order: 8, testId: 'test-cbio-2-8', datos_claves: ['Métodos de barrera.', 'Anticonceptivos hormonales.'] },
      { id: 'sec-cbio-2-9', title: '9. ITS y Prevención', introduccion: 'Infecciones de transmisión sexual y cuidados.', order: 9, testId: 'test-cbio-2-9', datos_claves: ['VIH y Hepatitis B.', 'Uso de preservativo.'] },
      { id: 'sec-cbio-2-10', title: '10. JEFE FINAL: Coordinación y Vida', introduccion: 'Evaluación integral de procesos biológicos.', order: 10, testId: 'test-cbio-2-10', datos_claves: ['Repaso completo.', 'Desafío final.'] }
    ]
  },
  {
    id: 'cap-cbio-3',
    materiaId: 'ciencias-biologia',
    title: 'Biología: Herencia y Evolución',
    introduccion: 'Entiende cómo se transmite y cambia la vida.',
    order: 3,
    secciones: [
      { id: 'sec-cbio-3-1', title: '1. Ciclo Celular e Interfase', introduccion: 'Etapas previas a la división.', order: 1, testId: 'test-cbio-3-1', datos_claves: ['Fase S: duplicación ADN.', 'Compactación de cromatina.'] },
      { id: 'sec-cbio-3-2', title: '2. Mitosis y Crecimiento', introduccion: 'División celular ecuacional.', order: 2, testId: 'test-cbio-3-2', datos_claves: ['Profase, Metafase, Anafase, Telofase.', 'Células somáticas.'] },
      { id: 'sec-cbio-3-3', title: '3. Puntos de Control y Cáncer', introduccion: 'Regulación y fallas en el ciclo.', order: 3, testId: 'test-cbio-3-3', datos_claves: ['Proteína p53.', 'Proliferación descontrolada.'] },
      { id: 'sec-cbio-3-4', title: '4. Meiosis I: Recombinación', introduccion: 'Intercambio de material genético.', order: 4, testId: 'test-cbio-3-4', datos_claves: ['Crossing-over.', 'Variabilidad genética.'] },
      { id: 'sec-cbio-3-5', title: '5. Meiosis II y Gametos', introduccion: 'Producción de células haploides.', order: 5, testId: 'test-cbio-3-5', datos_claves: ['Separación de cromátidas.', 'Aneuploidías.'] },
      { id: 'sec-cbio-3-6', title: '6. Biotecnología Aplicada', introduccion: 'Manipulación genética en la industria.', order: 6, testId: 'test-cbio-3-6', datos_claves: ['Transgénicos.', 'Fármacos recombinantes.'] },
      { id: 'sec-cbio-3-7', title: '7. Evidencias de Evolución', introduccion: 'Pruebas del cambio en el tiempo.', order: 7, testId: 'test-cbio-3-7', datos_claves: ['Registro fósil.', 'Biología molecular.'] },
      { id: 'sec-cbio-3-8', title: '8. Teorías Evolutivas', introduccion: 'De Lamarck a Darwin y Wallace.', order: 8, testId: 'test-cbio-3-8', datos_claves: ['Herencia de caracteres adquiridos.', 'Selección Natural.'] },
      { id: 'sec-cbio-3-9', title: '9. Selección Natural', introduccion: 'Mecanismo de adaptación de especies.', order: 9, testId: 'test-cbio-3-9', datos_claves: ['Supervivencia diferencial.', 'Presión selectiva.'] },
      { id: 'sec-cbio-3-10', title: '10. JEFE FINAL: El Legado de la Vida', introduccion: 'Evaluación integral de herencia y evolución.', order: 10, testId: 'test-cbio-3-10', datos_claves: ['Repaso completo.', 'Desafío final.'] }
    ]
  },
  {
    id: 'cap-cbio-4',
    materiaId: 'ciencias-biologia',
    title: 'Biología: Organismo y Ambiente',
    introduccion: 'Flujos de materia y energía en los ecosistemas.',
    order: 4,
    secciones: [
      { id: 'sec-cbio-4-1', title: '1. Nutrición y Autótrofos', introduccion: 'Formas de obtener energía.', order: 1, testId: 'test-cbio-4-1', datos_claves: ['Fotosíntesis.', 'Quimiosíntesis.'] },
      { id: 'sec-cbio-4-2', title: '2. Fotosíntesis: Etapa Clara', introduccion: 'Captura de luz y fotólisis del agua.', order: 2, testId: 'test-cbio-4-2', datos_claves: ['Tilacoides.', 'Producción de O2 y ATP.'] },
      { id: 'sec-cbio-4-3', title: '3. Fotosíntesis: Etapa Oscura', introduccion: 'Fijación del carbono (Ciclo de Calvin).', order: 3, testId: 'test-cbio-4-3', datos_claves: ['Estroma.', 'Síntesis de glucosa.'] },
      { id: 'sec-cbio-4-4', title: '4. Factores Limitantes', introduccion: 'Variables que afectan la fotosíntesis.', order: 4, testId: 'test-cbio-4-4', datos_claves: ['Intensidad lumínica.', 'Temperatura y CO2.'] },
      { id: 'sec-cbio-4-5', title: '5. Respiración y Ciclos', introduccion: 'Relación entre respiración y fotosíntesis.', order: 5, testId: 'test-cbio-4-5', datos_claves: ['Ciclo del carbono.', 'Flujo de O2.'] },
      { id: 'sec-cbio-4-6', title: '6. Flujo de Energía', introduccion: 'Transferencia energética en tramas tróficas.', order: 6, testId: 'test-cbio-4-6', datos_claves: ['Productores.', 'Consumidores y Descomponedores.'] },
      { id: 'sec-cbio-4-7', title: '7. Pirámides y Biomasa', introduccion: 'Representación del flujo en ecosistemas.', order: 7, testId: 'test-cbio-4-7', datos_claves: ['Regla del 10%.', 'Productividad primaria.'] },
      { id: 'sec-cbio-4-8', title: '8. Ecosistemas y Humedales', introduccion: 'Ejemplos de equilibrio ambiental.', order: 8, testId: 'test-cbio-4-8', datos_claves: ['Turbidez.', 'Sólidos en suspensión.'] },
      { id: 'sec-cbio-4-9', title: '9. Impacto Humano', introduccion: 'Alteraciones antropogénicas en el ambiente.', order: 9, testId: 'test-cbio-4-9', datos_claves: ['Erosión.', 'Cambio climático.'] },
      { id: 'sec-cbio-4-10', title: '10. JEFE FINAL: Equilibrio Global', introduccion: 'Evaluación integral de organismo y ambiente.', order: 10, testId: 'test-cbio-4-10', datos_claves: ['Repaso completo.', 'Desafío final.'] }
    ]
  },

  // ─── CIENCIAS QUÍMICA ───
  {
    id: 'cap-cqui-1',
    materiaId: 'ciencias-quimica',
    title: 'Química: Estructura Atómica y Materia',
    introduccion: 'Explora la constitución de la materia, los modelos atómicos y las propiedades físicas fundamentales.',
    order: 1,
    secciones: [
      { id: 'sec-cqui-1-1', title: '1. Clasificación de la Materia', introduccion: 'Sustancias puras y mezclas.', order: 1, testId: 'test-cqui-1-1', datos_claves: ['Elementos y compuestos.', 'Mezclas homogéneas.'] },
      { id: 'sec-cqui-1-2', title: '2. Métodos de Separación', introduccion: 'Filtración, decantación y tamizado.', order: 2, testId: 'test-cqui-1-2', datos_claves: ['Floculación.', 'Purificación de agua.'] },
      { id: 'sec-cqui-1-3', title: '3. Propiedades Físicas', introduccion: 'Densidad, fusión y ebullición.', order: 3, testId: 'test-cqui-1-3', datos_claves: ['m/v.', 'Estados de la materia.'] },
      { id: 'sec-cqui-1-4', title: '4. Modelos Atómicos: Inicios', introduccion: 'Dalton y Thomson.', order: 4, testId: 'test-cqui-1-4', datos_claves: ['Buda de pasas.', 'Esferas indivisibles.'] },
      { id: 'sec-cqui-1-5', title: '5. El Modelo de Rutherford', introduccion: 'El descubrimiento del núcleo.', order: 5, testId: 'test-cqui-1-5', datos_claves: ['Espacio vacío.', 'Partículas alfa.'] },
      { id: 'sec-cqui-1-6', title: '6. El Modelo de Bohr', introduccion: 'Niveles de energía y órbitas.', order: 6, testId: 'test-cqui-1-6', datos_claves: ['Saltos cuánticos.', 'Espectros de emisión.'] },
      { id: 'sec-cqui-1-7', title: '7. Partículas Subatómicas', introduccion: 'Protones, neutrones y electrones.', order: 7, testId: 'test-cqui-1-7', datos_claves: ['Z y A.', 'Carga neutra.'] },
      { id: 'sec-cqui-1-8', title: '8. Iones e Isótopos', introduccion: 'Variaciones en carga y masa.', order: 8, testId: 'test-cqui-1-8', datos_claves: ['Mismo Z, distinto A.', 'Cationes y aniones.'] },
      { id: 'sec-cqui-1-9', title: '9. Estructura de Lewis Básica', introduccion: 'Representación de electrones de valencia.', order: 9, testId: 'test-cqui-1-9', datos_claves: ['Regla del octeto.', 'Enlaces básicos.'] },
      { id: 'sec-cqui-1-10', title: '10. JEFE FINAL: El Microcosmos', introduccion: 'Evaluación integral de estructura atómica.', order: 10, testId: 'test-cqui-1-10', datos_claves: ['Repaso completo.', 'Desafío final.'] }
    ]
  },
  {
    id: 'cap-cqui-2',
    materiaId: 'ciencias-quimica',
    title: 'Química: Química Orgánica',
    introduccion: 'Domina la química del carbono, sus enlaces y la diversidad de grupos funcionales.',
    order: 2,
    secciones: [
      { id: 'sec-cqui-2-1', title: '1. El Átomo de Carbono', introduccion: 'Tetravalencia e hibridación.', order: 1, testId: 'test-cqui-2-1', datos_claves: ['sp, sp2, sp3.', 'Geometría molecular.'] },
      { id: 'sec-cqui-2-2', title: '2. Enlaces Sigma y Pi', introduccion: 'Naturaleza de los enlaces orgánicos.', order: 2, testId: 'test-cqui-2-2', datos_claves: ['Solapamiento.', 'Longitud de enlace.'] },
      { id: 'sec-cqui-2-3', title: '3. Hidrocarburos: Alcanos', introduccion: 'Saturación y nomenclatura.', order: 3, testId: 'test-cqui-2-3', datos_claves: ['Parafinas.', 'Cadena principal.'] },
      { id: 'sec-cqui-2-4', title: '4. Alquenos y Alquinos', introduccion: 'Insaturaciones y reactividad.', order: 4, testId: 'test-cqui-2-4', datos_claves: ['Dobles y triples.', 'Propiedades físicas.'] },
      { id: 'sec-cqui-2-5', title: '5. Grupos Oxigenados: Alcoholes', introduccion: 'El grupo hidroxilo.', order: 5, testId: 'test-cqui-2-5', datos_claves: ['Puentes de hidrógeno.', 'Solubilidad.'] },
      { id: 'sec-cqui-2-6', title: '6. Éteres y Cetonas', introduccion: 'Funciones oxigenadas intermedias.', order: 6, testId: 'test-cqui-2-6', datos_claves: ['R-O-R.', 'Carbonilo.'] },
      { id: 'sec-cqui-2-7', title: '7. Aldehídos y Ácidos', introduccion: 'Funciones terminales.', order: 7, testId: 'test-cqui-2-7', datos_claves: ['Oxidación.', 'Vinagre y hormigas.'] },
      { id: 'sec-cqui-2-8', title: '8. Ésteres y Amidas', introduccion: 'Derivados de ácidos carboxílicos.', order: 8, testId: 'test-cqui-2-8', datos_claves: ['Aromas.', 'Enlaces peptídicos.'] },
      { id: 'sec-cqui-2-9', title: '9. Modelos de Representación', introduccion: 'De la fórmula al espacio.', order: 9, testId: 'test-cqui-2-9', datos_claves: ['Topológica.', 'Esferas y varillas.'] },
      { id: 'sec-cqui-2-10', title: '10. JEFE FINAL: El Carbono Vivo', introduccion: 'Evaluación integral de orgánica.', order: 10, testId: 'test-cqui-2-10', datos_claves: ['Repaso completo.', 'Desafío final.'] }
    ]
  },
  {
    id: 'cap-cqui-3',
    materiaId: 'ciencias-quimica',
    title: 'Química: Reacciones y Estequiometría',
    introduccion: 'Analiza los cambios químicos, el balance de masa y las leyes que rigen las reacciones.',
    order: 3,
    secciones: [
      { id: 'sec-cqui-3-1', title: '1. Cambios Químicos y Físicos', introduccion: 'Identificación de transformaciones.', order: 1, testId: 'test-cqui-3-1', datos_claves: ['Efervescencia.', 'Oxidación vs Fusión.'] },
      { id: 'sec-cqui-3-2', title: '2. Leyes Ponderales', introduccion: 'Conservación y proporciones.', order: 2, testId: 'test-cqui-3-2', datos_claves: ['Lavoisier.', 'Proust.'] },
      { id: 'sec-cqui-3-3', title: '3. El Mol y Avogadro', introduccion: 'La unidad de cantidad de sustancia.', order: 3, testId: 'test-cqui-3-3', datos_claves: ['6,022 x 10^23.', 'Masa molar.'] },
      { id: 'sec-cqui-3-4', title: '4. Balanceo de Ecuaciones', introduccion: 'Igualación de átomos.', order: 4, testId: 'test-cqui-3-4', datos_claves: ['Tanteo.', 'Coeficientes.'] },
      { id: 'sec-cqui-3-5', title: '5. Cálculos Estequiométricos', introduccion: 'Relaciones masa-masa y mol-mol.', order: 5, testId: 'test-cqui-3-5', datos_claves: ['Factor unitario.', 'Cálculos directos.'] },
      { id: 'sec-cqui-3-6', title: '6. Fórmulas Empíricas', introduccion: 'Composición mínima.', order: 6, testId: 'test-cqui-3-6', datos_claves: ['Porcentajes.', 'Cloroformo.'] },
      { id: 'sec-cqui-3-7', title: '7. Fórmula Molecular', introduccion: 'La estructura real.', order: 7, testId: 'test-cqui-3-7', datos_claves: ['Masa real vs molar.', 'Múltiplos.'] },
      { id: 'sec-cqui-3-8', title: '8. Reactivo Limitante', introduccion: '¿Quién se acaba primero?', order: 8, testId: 'test-cqui-3-8', datos_claves: ['Sobrante.', 'Control de producto.'] },
      { id: 'sec-cqui-3-9', title: '9. Rendimiento de Reacción', introduccion: 'Eficiencia en el laboratorio.', order: 9, testId: 'test-cqui-3-9', datos_claves: ['Real / Teórico.', 'Pureza.'] },
      { id: 'sec-cqui-3-10', title: '10. JEFE FINAL: Maestro de Reacciones', introduccion: 'Evaluación integral de estequiometría.', order: 10, testId: 'test-cqui-3-10', datos_claves: ['Repaso completo.', 'Desafío final.'] }
    ]
  },
  {
    id: 'cap-cqui-4',
    materiaId: 'ciencias-quimica',
    title: 'Química: Disoluciones Químicas',
    introduccion: 'Estudia las mezclas homogéneas y sus formas de expresar la concentración.',
    order: 4,
    secciones: [
      { id: 'sec-cqui-4-1', title: '1. Soluto y Solvente', introduccion: 'Componentes de la mezcla.', order: 1, testId: 'test-cqui-4-1', datos_claves: ['Fase dispersa.', 'Agua: solvente universal.'] },
      { id: 'sec-cqui-4-2', title: '2. Solubilidad', introduccion: 'Límites de mezcla.', order: 2, testId: 'test-cqui-4-2', datos_claves: ['Saturada.', 'Efecto de temperatura.'] },
      { id: 'sec-cqui-4-3', title: '3. Concentración Física: %m/m', introduccion: 'Masa en masa.', order: 3, testId: 'test-cqui-4-3', datos_claves: ['Gramos soluto/100g solución.', 'Densidad necesaria.'] },
      { id: 'sec-cqui-4-4', title: '4. Concentración Física: %m/v', introduccion: 'Masa en volumen.', order: 4, testId: 'test-cqui-4-4', datos_claves: ['Gramos soluto/100mL solución.', 'Uso en laboratorio.'] },
      { id: 'sec-cqui-4-5', title: '5. Molaridad (M)', introduccion: 'Moles por litro.', order: 5, testId: 'test-cqui-4-5', datos_claves: ['n / V(L).', 'Unidad más común.'] },
      { id: 'sec-cqui-4-6', title: '6. Molalidad y Fracción Molar', introduccion: 'Otras formas de medir.', order: 6, testId: 'test-cqui-4-6', datos_claves: ['Moles/kg solvente.', 'Suma = 1.'] },
      { id: 'sec-cqui-4-7', title: '7. Diluciones', introduccion: 'Bajar la concentración.', order: 7, testId: 'test-cqui-4-7', datos_claves: ['C1V1 = C2V2.', 'Aforo.'] },
      { id: 'sec-cqui-4-8', title: '8. Mezcla de Disoluciones', introduccion: 'Combinando soluciones.', order: 8, testId: 'test-cqui-4-8', datos_claves: ['Volúmenes aditivos.', 'Concentración final.'] },
      { id: 'sec-cqui-4-9', title: '9. Preparación de Soluciones', introduccion: 'Procedimiento experimental.', order: 9, testId: 'test-cqui-4-9', datos_claves: ['Matraz aforado.', 'Pesar soluto.'] },
      { id: 'sec-cqui-4-10', title: '10. JEFE FINAL: El Químico Analítico', introduccion: 'Evaluación integral de disoluciones.', order: 10, testId: 'test-cqui-4-10', datos_claves: ['Repaso completo.', 'Desafío final.'] }
    ]
  },

  // ─── CIENCIAS FÍSICA ───
  {
    id: 'cap-cfis-1',
    materiaId: 'ciencias-fisica',
    title: 'Física: Ondas y Sonido',
    introduccion: 'Explora la naturaleza de las ondas, la luz y el sonido.',
    order: 1,
    secciones: [
      { id: 'sec-cfis-1-1', title: '1. Propiedades de las Ondas', introduccion: 'Periodo, frecuencia y longitud de onda.', order: 1, testId: 'test-cfis-1-1', datos_claves: ['Frecuencia es ciclos por segundo.', 'Longitud de onda lambda.'] },
      { id: 'sec-cfis-1-2', title: '2. Reflexión y Refracción', introduccion: 'Comportamiento de la luz al cambiar de medio.', order: 2, testId: 'test-cfis-1-2', datos_claves: ['Reflexión y refracción simultáneas.', 'Índice de refracción.'] },
      { id: 'sec-cfis-1-3', title: '3. Radar y Ondas EM', introduccion: 'Aplicaciones tecnológicas de las ondas.', order: 3, testId: 'test-cfis-1-3', datos_claves: ['Propagación y Reflexión.', 'Ondas electromagnéticas en el vacío.'] },
      { id: 'sec-cfis-1-4', title: '4. Sonido: Tono y Timbre', introduccion: 'Características de la percepción auditiva.', order: 4, testId: 'test-cfis-1-4', datos_claves: ['Tono (Frecuencia).', 'Timbre (Forma de onda).'] },
      { id: 'sec-cfis-1-5', title: '5. Efecto Doppler', introduccion: 'Cambio aparente de frecuencia por movimiento.', order: 5, testId: 'test-cfis-1-5', datos_claves: ['Acercamiento: frecuencia sube.', 'Alejamiento: frecuencia baja.'] },
      { id: 'sec-cfis-1-6', title: '6. Luz: Espectro y Color', introduccion: 'Dispersión de la luz blanca en prismas.', order: 6, testId: 'test-cfis-1-6', datos_claves: ['Violeta se desvía más.', 'Luz monocromática.'] },
      { id: 'sec-cfis-1-7', title: '7. Espejos Planos', introduccion: 'Formación de imágenes virtuales y derechas.', order: 7, testId: 'test-cfis-1-7', datos_claves: ['Imagen simétrica.', 'Distancia objeto = distancia imagen.'] },
      { id: 'sec-cfis-1-8', title: '8. Espejos Esféricos', introduccion: 'Imágenes en espejos cóncavos y convexos.', order: 8, testId: 'test-cfis-1-8', datos_claves: ['Foco y centro de curvatura.', 'Espejos parabólicos.'] },
      { id: 'sec-cfis-1-9', title: '9. Lentes y Visión', introduccion: 'Divergentes, convergentes y defectos visuales.', order: 9, testId: 'test-cfis-1-9', datos_claves: ['Lentes divergentes virtuales.', 'Miopía e Hipermetropía.'] },
      { id: 'sec-cfis-1-10', title: '10. JEFE FINAL: El Mundo Ondulatorio', introduccion: 'Evaluación integral de ondas y óptica.', order: 10, testId: 'test-cfis-1-10', datos_claves: ['Repaso completo.', 'Desafío final.'] }
    ]
  },
  {
    id: 'cap-cfis-2',
    materiaId: 'ciencias-fisica',
    title: 'Física: Mecánica',
    introduccion: 'Estudio del movimiento, las fuerzas y la energía.',
    order: 2,
    secciones: [
      { id: 'sec-cfis-2-1', title: '1. Vectores en Física', introduccion: 'Magnitudes escalares y vectoriales.', order: 1, testId: 'test-cfis-2-1', datos_claves: ['Desplazamiento.', 'Suma de vectores.'] },
      { id: 'sec-cfis-2-2', title: '2. Movimiento Rectilíneo', introduccion: 'Rapidez y velocidad constante vs variable.', order: 2, testId: 'test-cfis-2-2', datos_claves: ['MRU y MRUA.', 'Gráficos de movimiento.'] },
      { id: 'sec-cfis-2-3', title: '3. Leyes de Newton I y II', introduccion: 'Inercia y Proporcionalidad Fuerza-Aceleración.', order: 3, testId: 'test-cfis-2-3', datos_claves: ['Inercia.', 'Fuerza Neta = m * a.'] },
      { id: 'sec-cfis-2-4', title: '4. Leyes de Newton III', introduccion: 'El principio de Acción y Reacción.', order: 4, testId: 'test-cfis-2-4', datos_claves: ['Fuerzas en pares.', 'Actúan en cuerpos diferentes.'] },
      { id: 'sec-cfis-2-5', title: '5. Fuerza de Roce', introduccion: 'Resistencia al movimiento entre superficies.', order: 5, testId: 'test-cfis-2-5', datos_claves: ['Estático vs Cinético.', 'Independencia del área.'] },
      { id: 'sec-cfis-2-6', title: '6. Tensión y Cuerdas', introduccion: 'Transmisión de fuerzas en cuerdas ideales.', order: 6, testId: 'test-cfis-2-6', datos_claves: ['Dinamómetros.', 'Sistemas en equilibrio.'] },
      { id: 'sec-cfis-2-7', title: '7. Ley de Hooke (Elasticidad)', introduccion: 'Fuerza restauradora en resortes.', order: 7, testId: 'test-cfis-2-7', datos_claves: ['Constante elástica k.', 'Elongación proporcional.'] },
      { id: 'sec-cfis-2-8', title: '8. Presión en Sólidos', introduccion: 'Fuerza distribuida en una superficie.', order: 8, testId: 'test-cfis-2-8', datos_claves: ['P = F / A.', 'Efecto de la masa y el área.'] },
      { id: 'sec-cfis-2-9', title: '9. Presión en Líquidos', introduccion: 'Hidrostática y Principio de Pascal.', order: 9, testId: 'test-cfis-2-9', datos_claves: ['Presión aumenta con profundidad.', 'Transmisión de presión.'] },
      { id: 'sec-cfis-2-10', title: '10. JEFE FINAL: Dinámica en Acción', introduccion: 'Evaluación integral de mecánica y fuerzas.', order: 10, testId: 'test-cfis-2-10', datos_claves: ['Repaso completo.', 'Desafío final.'] }
    ]
  },
  {
    id: 'cap-cfis-3',
    materiaId: 'ciencias-fisica',
    title: 'Física: Electricidad',
    introduccion: 'Circuitos, energía y potencia eléctrica.',
    order: 3,
    secciones: [
      { id: 'sec-cfis-3-1', title: '1. Carga y Fuerza Eléctrica', introduccion: 'Interacción entre partículas cargadas.', order: 1, testId: 'test-cfis-3-1', datos_claves: ['Ley de Coulomb.', 'Atracción y Repulsión.'] },
      { id: 'sec-cfis-3-2', title: '2. Circuitos en Serie', introduccion: 'Corriente en un solo camino.', order: 2, testId: 'test-cfis-3-2', datos_claves: ['Corriente constante.', 'Resistencia equivalente suma.'] },
      { id: 'sec-cfis-3-3', title: '3. Circuitos en Paralelo', introduccion: 'Voltaje constante en cada rama.', order: 3, testId: 'test-cfis-3-3', datos_claves: ['Diferencia de potencial igual.', 'Corriente se divide.'] },
      { id: 'sec-cfis-3-4', title: '4. Ley de Ohm', introduccion: 'Relación entre Voltaje, Corriente y Resistencia.', order: 4, testId: 'test-cfis-3-4', datos_claves: ['V = I * R.', 'Gráfico V vs I.'] },
      { id: 'sec-cfis-3-5', title: '5. Potencia Eléctrica', introduccion: 'Rapidez con que se consume energía.', order: 5, testId: 'test-cfis-3-5', datos_claves: ['P = V * I.', 'Brillo de ampolletas.'] },
      { id: 'sec-cfis-3-6', title: '6. Consumo de Energía', introduccion: 'Lectura de medidores y facturación.', order: 6, testId: 'test-cfis-3-6', datos_claves: ['Energía = P * t.', 'Unidad kWh.'] },
      { id: 'sec-cfis-3-7', title: '7. Seguridad Eléctrica', introduccion: 'Protección de circuitos en el hogar.', order: 7, testId: 'test-cfis-3-7', datos_claves: ['Interruptor automático.', 'Toma de tierra.'] },
      { id: 'sec-cfis-3-8', title: '8. Transformadores y Voltaje', introduccion: 'Adecuación de niveles de tensión.', order: 8, testId: 'test-cfis-3-8', datos_claves: ['Inducción EM.', 'Elevadores y reductores.'] },
      { id: 'sec-cfis-3-9', title: '9. Eficiencia Energética', introduccion: 'Optimización del uso de recursos.', order: 9, testId: 'test-cfis-3-9', datos_claves: ['Etiquetas ABC.', 'Ahorro doméstico.'] },
      { id: 'sec-cfis-3-10', title: '10. JEFE FINAL: El Poder de la Energía', introduccion: 'Evaluación integral de electricidad y potencia.', order: 10, testId: 'test-cfis-3-10', datos_claves: ['Repaso completo.', 'Desafío final.'] }
    ]
  },
  {
    id: 'cap-cfis-4',
    materiaId: 'ciencias-fisica',
    title: 'Física: Tierra y Universo',
    introduccion: 'Fenómenos terrestres, atmósfera y clima.',
    order: 4,
    secciones: [
      { id: 'sec-cfis-4-1', title: '1. Estructura de la Tierra', introduccion: 'Capas internas y composición.', order: 1, testId: 'test-cfis-4-1', datos_claves: ['Corteza, Manto, Núcleo.', 'Modelos Estático y Dinámico.'] },
      { id: 'sec-cfis-4-2', title: '2. Deriva Continental', introduccion: 'Historia del movimiento de los continentes.', order: 2, testId: 'test-cfis-4-2', datos_claves: ['Pangea.', 'Evidencia fósil y geológica.'] },
      { id: 'sec-cfis-4-3', title: '3. Tectónica de Placas', introduccion: 'Dorsales oceánicas y expansión.', order: 3, testId: 'test-cfis-4-3', datos_claves: ['Dorsal Centro-Atlántica.', 'Creación de suelo oceánico.'] },
      { id: 'sec-cfis-4-4', title: '4. Límites Convergentes', introduccion: 'Subducción y formación de cordilleras.', order: 4, testId: 'test-cfis-4-4', datos_claves: ['Fosas.', 'Sismicidad de largo plazo.'] },
      { id: 'sec-cfis-4-5', title: '5. Sismos y Ondas Sísmicas', introduccion: 'Propagación de energía en terremotos.', order: 5, testId: 'test-cfis-4-5', datos_claves: ['Ondas P y S.', 'Escalas de magnitud.'] },
      { id: 'sec-cfis-4-6', title: '6. Atmósfera y Clima', introduccion: 'Variables meteorológicas fundamentales.', order: 6, testId: 'test-cfis-4-6', datos_claves: ['Presión vs Altitud.', 'Densidad del aire.'] },
      { id: 'sec-cfis-4-7', title: '7. Factores del Clima', introduccion: 'Influencias no atmosféricas en la temperatura.', order: 7, testId: 'test-cfis-4-7', datos_claves: ['Relieve.', 'Latitud y Oceanidad.'] },
      { id: 'sec-cfis-4-8', title: '8. Efecto Invernadero', introduccion: 'Calentamiento global y consecuencias.', order: 8, testId: 'test-cfis-4-8', datos_claves: ['Derretimiento glaciares.', 'Gases de efecto invernadero.'] },
      { id: 'sec-cfis-4-9', title: '9. Oceanografía y Glaciares', introduccion: 'Dinámica de las masas de agua.', order: 9, testId: 'test-cfis-4-9', datos_claves: ['Salinidad.', 'Corrientes marinas.'] },
      { id: 'sec-cfis-4-10', title: '10. JEFE FINAL: Nuestro Planeta Dinámico', introduccion: 'Evaluación integral de ciencias de la tierra.', order: 10, testId: 'test-cfis-4-10', datos_claves: ['Repaso completo.', 'Desafío final.'] }
    ]
  }
];

const NUEVOS_TESTS = [
  // --- TÉCNICO PROFESIONAL: BIOLOGÍA ---
  {
    id: 'test-ctp-bio-1',
    seccionId: 'sec-ctp-bio-1',
    preguntas: [
      { id: 201, enunciado: '¿Cuál estructura bacteriana de E. coli se manipuló para permitirle rotar como hélice en un nanodispositivo?', alternativas: { A: 'El flagelo.', B: 'La cápsula.', C: 'La pared celular.', D: 'La membrana plasmática.' }, respuesta_correcta: 'A', feedback_acierto: '¡Correcto! El flagelo es el motor rotatorio.', feedback_error: 'Busca la estructura de movilidad.' },
      { id: 202, enunciado: 'En un estudio de radiación infrarroja en hepatocitos, se mide el volumen del REL. ¿Qué variable es esta?', alternativas: { A: 'Independiente.', B: 'Controlada.', C: 'Dependiente.', D: 'Extraña.' }, respuesta_correcta: 'C', feedback_acierto: '¡Exacto!', feedback_error: 'Es el efecto medido.' },
      { id: 203, enunciado: '¿Qué organelo se encarga de la síntesis de lípidos y desintoxicación celular?', alternativas: { A: 'RER.', B: 'REL.', C: 'Golgi.', D: 'Lisosoma.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Es el Retículo Liso.' }
    ]
  },
  {
    id: 'test-ctp-bio-2',
    seccionId: 'sec-ctp-bio-2',
    preguntas: [
      { id: 204, enunciado: 'Célula especializada en la absorción de nutrientes con microvellosidades:', alternativas: { A: 'Neurona.', B: 'Enterocito.', C: 'Miocito.', D: 'Adipocito.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Se encuentra en el intestino.' },
      { id: 205, enunciado: 'La función principal de las células beta pancreáticas es secretar:', alternativas: { A: 'Glucagón.', B: 'Insulina.', C: 'Somatostatina.', D: 'Bilis.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Regula la glucosa.' },
      { id: 206, enunciado: '¿Qué estructura de la neurona se encarga de recibir señales de otras células?', alternativas: { A: 'Axón.', B: 'Soma.', C: 'Dendritas.', D: 'Vaina de mielina.' }, respuesta_correcta: 'C', feedback_acierto: '¡Bien!', feedback_error: 'Son las prolongaciones ramificadas.' }
    ]
  },
  {
    id: 'test-ctp-bio-3',
    seccionId: 'sec-ctp-bio-3',
    preguntas: [
      { id: 207, enunciado: 'La sinapsis química utiliza mensajeros denominados:', alternativas: { A: 'Hormonas.', B: 'Enzimas.', C: 'Neurotransmisores.', D: 'Proteínas.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto!', feedback_error: 'Se liberan al espacio sináptico.' },
      { id: 208, enunciado: 'Un arco reflejo simple se caracteriza por ser una respuesta:', alternativas: { A: 'Voluntaria y lenta.', B: 'Involuntaria y rápida.', C: 'Consciente.', D: 'Solo motora.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'No pasa por la corteza cerebral.' },
      { id: 209, enunciado: '¿Qué efecto tiene el consumo de alcohol sobre el sistema nervioso?', alternativas: { A: 'Estimulante.', B: 'Depresor.', C: 'Alucinógeno.', D: 'Nulo.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Ralentiza las funciones cerebrales.' }
    ]
  },
  {
    id: 'test-ctp-bio-4',
    seccionId: 'sec-ctp-bio-4',
    preguntas: [
      { id: 210, enunciado: 'El gameto femenino humano se denomina:', alternativas: { A: 'Espermatocito.', B: 'Ovocito.', C: 'Óvulo.', D: 'Cigoto.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Es el ovocito II.' },
      { id: 211, enunciado: 'La unión de un espermatozoide y un ovocito se llama:', alternativas: { A: 'Gametogénesis.', B: 'Fecundación.', C: 'Implantación.', D: 'Ovulación.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Ocurre generalmente en las trompas.' },
      { id: 212, enunciado: '¿Dónde se producen los espermatozoides?', alternativas: { A: 'Próstata.', B: 'Conducto deferente.', C: 'Testículos (túbulos seminíferos).', D: 'Epidídimo.' }, respuesta_correcta: 'C', feedback_acierto: '¡Bien!', feedback_error: 'Es la gónada masculina.' }
    ]
  },
  {
    id: 'test-ctp-bio-5',
    seccionId: 'sec-ctp-bio-5',
    preguntas: [
      { id: 213, enunciado: 'Método de control de la natalidad basado en la observación del moco cervical:', alternativas: { A: 'Calendario.', B: 'Billings.', C: 'Temperatura.', D: 'Diafragma.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Es un método natural.' },
      { id: 214, enunciado: '¿Cuál de estos es un método anticonceptivo de barrera?', alternativas: { A: 'Píldora.', B: 'DIU hormonal.', C: 'Preservativo.', D: 'Vasectomía.' }, respuesta_correcta: 'C', feedback_acierto: '¡Exacto!', feedback_error: 'Impide físicamente el paso de gametos.' },
      { id: 215, enunciado: 'Los métodos quirúrgicos como la ligadura de trompas se consideran:', alternativas: { A: 'Reversibles fácilmente.', B: 'Parcialmente reversibles/permanentes.', C: 'Naturales.', D: 'Hormonales.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Son procedimientos definitivos.' }
    ]
  },
  {
    id: 'test-ctp-bio-6',
    seccionId: 'sec-ctp-bio-6',
    preguntas: [
      { id: 216, enunciado: 'Agente patógeno causante de la Sífilis:', alternativas: { A: 'Virus.', B: 'Bacteria.', C: 'Hongo.', D: 'Protozoo.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Treponema pallidum.' },
      { id: 217, enunciado: 'Principal medida de prevención contra el VIH en relaciones sexuales:', alternativas: { A: 'Píldora.', B: 'Ducha vaginal.', C: 'Uso de preservativo.', D: 'Antibióticos.' }, respuesta_correcta: 'C', feedback_acierto: '¡Exacto!', feedback_error: 'Es el único que protege de ITS.' },
      { id: 218, enunciado: 'ITS que se manifiesta con ampollas dolorosas y es causada por un virus:', alternativas: { A: 'Gonorrea.', B: 'Clamidia.', C: 'Herpes.', D: 'Sarna.' }, respuesta_correcta: 'C', feedback_acierto: '¡Bien!', feedback_error: 'Virus del herpes simple.' }
    ]
  },
  {
    id: 'test-ctp-bio-7',
    seccionId: 'sec-ctp-bio-7',
    preguntas: [
      { id: 219, enunciado: 'Etapa del ciclo celular donde ocurre la replicación del ADN:', alternativas: { A: 'Fase G1.', B: 'Fase S.', C: 'Fase G2.', D: 'Mitosis.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'S de Síntesis.' },
      { id: 220, enunciado: 'El crecimiento descontrolado de células con fallas en los puntos de control genera:', alternativas: { A: 'Regeneración.', B: 'Cáncer.', C: 'Apoptosis.', D: 'Mitosis normal.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Se forman tumores.' },
      { id: 221, enunciado: '¿En qué fase de la mitosis los cromosomas se alinean al centro de la célula?', alternativas: { A: 'Profase.', B: 'Metafase.', C: 'Anafase.', D: 'Telofase.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Línea ecuatorial.' }
    ]
  },
  {
    id: 'test-ctp-bio-8',
    seccionId: 'sec-ctp-bio-8',
    preguntas: [
      { id: 222, enunciado: 'Proceso de intercambio genético entre cromosomas homólogos en Profase I:', alternativas: { A: 'Permutación.', B: 'Crossing-over.', C: 'Citoquinesis.', D: 'Segregación.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Aumenta la variabilidad.' },
      { id: 223, enunciado: 'La meiosis produce células de tipo:', alternativas: { A: 'Diploides (2n).', B: 'Haploides (n).', C: 'Somáticas.', D: 'Clones.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Mitad del material genético.' },
      { id: 224, enunciado: 'Falla en la meiosis que genera gametos con un número anormal de cromosomas:', alternativas: { A: 'Mutación puntual.', B: 'Aneuploidía.', C: 'Poliploidía.', D: 'Euploidía.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Ejemplo: Síndrome de Down.' }
    ]
  },
  {
    id: 'test-ctp-bio-9',
    seccionId: 'sec-ctp-bio-9',
    preguntas: [
      { id: 225, enunciado: 'Proteínas producidas por hongos capaces de degradar grasas, usadas en detergentes:', alternativas: { A: 'Amilasas.', B: 'Lipasas.', C: 'Proteasas.', D: 'Insulinas.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Lípidos -> Lipasas.' },
      { id: 226, enunciado: 'Uso de seres vivos o sus partes para generar productos útiles:', alternativas: { A: 'Ecología.', B: 'Biotecnología.', C: 'Biofísica.', D: 'Bioquímica.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Aplicación tecnológica.' },
      { id: 227, enunciado: 'Un biofertilizante extraído de algas marinas busca aumentar:', alternativas: { A: 'Erosión.', B: 'Rendimiento y calidad de frutos.', C: 'Plagas.', D: 'Salinidad.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Mejora el crecimiento vegetal.' }
    ]
  },
  {
    id: 'test-ctp-bio-10',
    seccionId: 'sec-ctp-bio-10',
    preguntas: [
      { id: 228, enunciado: '¿Qué estructura permite la adherencia y rotación en E. coli?', respuesta_correcta: 'A', alternativas: { A: 'Flagelo.', B: 'Citoesqueleto.', C: 'Pared.', D: 'Membrana.' }, feedback_acierto: '¡Correcto!', feedback_error: 'Motor bacteriano.' },
      { id: 229, enunciado: 'Efecto medido al irradiar hepatocitos con infrarrojo:', respuesta_correcta: 'C', alternativas: { A: 'Tiempo.', B: 'Intensidad.', C: 'Volumen REL.', D: 'Calor.' }, feedback_acierto: '¡Exacto!', feedback_error: 'Variable dependiente.' },
      { id: 230, enunciado: 'Hormona pancreática que aumenta la glucosa en sangre:', respuesta_correcta: 'B', alternativas: { A: 'Insulina.', B: 'Glucagón.', C: 'Somatostatina.', D: 'Adrenalina.' }, feedback_acierto: '¡Correcto!', feedback_error: 'Antagonista de la insulina.' },
      { id: 231, enunciado: 'Para mejorar la confiabilidad de un estudio con fármacos en especies protegidas se debe:', respuesta_correcta: 'D', alternativas: { A: 'Usar menos sujetos.', B: 'Cambiar de especie.', C: 'No usar control.', D: 'Aumentar el número de individuos.' }, feedback_acierto: '¡Bien!', feedback_error: 'Muestra representativa.' },
      { id: 232, enunciado: 'Si una droga desintegra la zona pelúcida, ¿qué riesgo hay?', respuesta_correcta: 'A', alternativas: { A: 'Polispermia.', B: 'Infertilidad.', C: 'Gametos nulos.', D: 'Fecundación nula.' }, feedback_acierto: '¡Exacto!', feedback_error: 'Entran varios espermatozoides.' },
      { id: 233, enunciado: 'Efectividad del preservativo contra el VIH según la OMS:', respuesta_correcta: 'A', alternativas: { A: '>90%.', B: '50%.', C: '10%.', D: '0%.' }, feedback_acierto: '¡Bien!', feedback_error: 'Alta protección.' },
      { id: 234, enunciado: 'Método anticonceptivo basado en alcoholes que inhiben fertilización:', respuesta_correcta: 'B', alternativas: { A: 'Preservativo.', B: 'Espermicida.', C: 'Vasectomía.', D: 'Billings.' }, feedback_acierto: '¡Correcto!', feedback_error: 'Acción química.' },
      { id: 235, enunciado: 'Grado de compactación del ADN varía según:', respuesta_correcta: 'D', alternativas: { A: 'Tipo de célula.', B: 'Fase del ciclo celular.', C: 'Nutrición.', D: 'Todas las anteriores.' }, feedback_acierto: '¡Bien!', feedback_error: 'Dinámica genómica.' },
      { id: 236, enunciado: 'Diferencia principal entre Mitosis y Meiosis:', respuesta_correcta: 'C', alternativas: { A: 'Mitosis genera 4 células.', B: 'Meiosis es asexual.', C: 'Meiosis reduce carga cromosómica.', D: 'No hay diferencia.' }, feedback_acierto: '¡Exacto!', feedback_error: 'Reduccional vs Ecuacional.' },
      { id: 237, enunciado: 'Teoría que explica el origen de mitocondrias y cloroplastos:', respuesta_correcta: 'A', alternativas: { A: 'Endosimbiótica.', B: 'Celular.', C: 'Evolutiva.', D: 'Generación espontánea.' }, feedback_acierto: '¡Bien!', feedback_error: 'Lyn Margullis.' }
    ]
  },

  // --- TÉCNICO PROFESIONAL: FÍSICA ---
  {
    id: 'test-ctp-fis-1',
    seccionId: 'sec-ctp-fis-1',
    preguntas: [
      { id: 238, enunciado: 'Fenómeno que ocurre cuando un rayo luminoso pasa del aire al vidrio y se desvía:', alternativas: { A: 'Reflexión.', B: 'Refracción.', C: 'Difracción.', D: 'Interferencia.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Cambio de medio.' },
      { id: 239, enunciado: '¿Qué propiedad de la luz permite ver los objetos en un espejo?', alternativas: { A: 'Absorción.', B: 'Reflexión especular.', C: 'Refracción.', D: 'Dispersión.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Rebote ordenado.' },
      { id: 240, enunciado: 'Un rayo incidente, reflejado y refractado siempre se encuentran en:', alternativas: { A: 'Distintos planos.', B: 'El mismo plano.', C: 'Líneas paralelas.', D: 'El vacío.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Leyes de la óptica.' }
    ]
  },
  {
    id: 'test-ctp-fis-2',
    seccionId: 'sec-ctp-fis-2',
    preguntas: [
      { id: 241, enunciado: 'Rango del espectro EM usado para telecomunicaciones inalámbricas (Wi-Fi):', alternativas: { A: 'Rayos Gamma.', B: 'Microondas / Radiofrecuencia.', C: 'Luz Visible.', D: 'Ultravioleta.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Baja frecuencia.' },
      { id: 242, enunciado: 'La fibra óptica basa su funcionamiento en:', alternativas: { A: 'Refracción simple.', B: 'Reflexión interna total.', C: 'Efecto Doppler.', D: 'Polarización.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'La luz queda atrapada.' },
      { id: 243, enunciado: 'Dispositivo que usa el eco de ondas para detectar posición y velocidad:', alternativas: { A: 'Láser.', B: 'Radar.', C: 'Prismáticos.', D: 'Microscopio.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Eco-localización tecnológica.' }
    ]
  },
  {
    id: 'test-ctp-fis-3',
    seccionId: 'sec-ctp-fis-3',
    preguntas: [
      { id: 244, enunciado: 'Tipo de espejo que siempre forma imágenes virtuales, derechas y de igual tamaño:', alternativas: { A: 'Cóncavo.', B: 'Plano.', C: 'Convexo.', D: 'Parabólico.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Uso diario en el baño.' },
      { id: 245, enunciado: 'Lente que se utiliza para corregir la miopía (divergente):', alternativas: { A: 'Biconvexa.', B: 'Bicóncava.', C: 'Plana.', D: 'Cilíndrica.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Separa los rayos de luz.' },
      { id: 246, enunciado: 'Si un objeto se pone frente a un espejo convexo, la imagen será:', alternativas: { A: 'Real y grande.', B: 'Virtual y pequeña.', C: 'Invertida.', D: 'Igual tamaño.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Espejos de vigilancia.' }
    ]
  },
  {
    id: 'test-ctp-fis-4',
    seccionId: 'sec-ctp-fis-4',
    preguntas: [
      { id: 247, enunciado: '¿Qué diferencia al desplazamiento de la distancia recorrida?', alternativas: { A: 'Son lo mismo.', B: 'El desplazamiento es un vector (punto inicial a final).', C: 'La distancia es vectorial.', D: 'El desplazamiento es siempre mayor.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Trayectoria vs Vector.' },
      { id: 248, enunciado: 'En un movimiento rectilíneo uniforme (MRU), la velocidad es:', alternativas: { A: 'Cero.', B: 'Constante.', C: 'Variable.', D: 'Infinita.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'No hay aceleración.' },
      { id: 249, enunciado: 'Si un auto viaja a 100 km/h constantes, su aceleración es:', alternativas: { A: '100 m/s2.', B: '0 m/s2.', C: '9.8 m/s2.', D: '10 m/s2.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Velocidad fija = Aceleración nula.' }
    ]
  },
  {
    id: 'test-ctp-fis-5',
    seccionId: 'sec-ctp-fis-5',
    preguntas: [
      { id: 250, enunciado: 'Ley de Newton que explica por qué un pasajero se va hacia adelante al frenar el bus:', alternativas: { A: 'Primera Ley (Inercia).', B: 'Segunda Ley (F=ma).', C: 'Tercera Ley (Acción/Reacción).', D: 'Ley de Gravedad.' }, respuesta_correcta: 'A', feedback_acierto: '¡Correcto!', feedback_error: 'Tendencia a mantener el estado.' },
      { id: 251, enunciado: 'Si aplicas la misma fuerza a dos cuerpos, el de menor masa tendrá:', alternativas: { A: 'Menor aceleración.', B: 'Mayor aceleración.', C: 'Igual aceleración.', D: 'Reposo.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Inversamente proporcional.' },
      { id: 252, enunciado: 'Las fuerzas de acción y reacción actúan sobre:', alternativas: { A: 'El mismo cuerpo.', B: 'Cuerpos distintos.', C: 'Solo cuerpos sólidos.', D: 'Cuerpos en reposo.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Principio fundamental.' }
    ]
  },
  {
    id: 'test-ctp-fis-6',
    seccionId: 'sec-ctp-fis-6',
    preguntas: [
      { id: 253, enunciado: 'La fuerza de roce que se opone al inicio del movimiento es:', alternativas: { A: 'Cinética.', B: 'Estática.', C: 'Nula.', D: 'Gravitatoria.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Antes de que resbale.' },
      { id: 254, enunciado: 'El coeficiente de roce estático es generalmente:', alternativas: { A: 'Menor que el cinético.', B: 'Mayor que el cinético.', C: 'Igual al cinético.', D: 'Cero.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Cuesta más empezar a mover.' },
      { id: 255, enunciado: '¿De qué depende principalmente la magnitud de la fuerza de roce?', alternativas: { A: 'Área de contacto.', B: 'Naturaleza de superficies y fuerza normal.', C: 'Velocidad.', D: 'Color.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Independiente del área.' }
    ]
  },
  {
    id: 'test-ctp-fis-7',
    seccionId: 'sec-ctp-fis-7',
    preguntas: [
      { id: 256, enunciado: 'Según la Ley de Hooke, la deformación de un resorte es proporcional a:', alternativas: { A: 'El tiempo.', B: 'La fuerza aplicada.', C: 'La masa.', D: 'La temperatura.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'F = kx.' },
      { id: 257, enunciado: 'La constante "k" en un resorte representa su:', alternativas: { A: 'Longitud.', B: 'Rigidez.', C: 'Masa.', D: 'Color.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Dureza del material.' },
      { id: 258, enunciado: 'Si un resorte k=10 N/m se estira 0.5 m, ¿qué fuerza se aplicó?', alternativas: { A: '50 N.', B: '5 N.', C: '20 N.', D: '2 N.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'F = 10 * 0.5.' }
    ]
  },
  {
    id: 'test-ctp-fis-8',
    seccionId: 'sec-ctp-fis-8',
    preguntas: [
      { id: 259, enunciado: 'La unidad de medida de la intensidad de corriente eléctrica es:', alternativas: { A: 'Volt.', B: 'Ohm.', C: 'Ampere.', D: 'Watt.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto!', feedback_error: 'Flujo de electrones.' },
      { id: 260, enunciado: '¿Qué partícula subatómica se desplaza por el conductor generando corriente?', alternativas: { A: 'Protón.', B: 'Neutrón.', C: 'Electrón.', D: 'Nucleón.' }, respuesta_correcta: 'C', feedback_acierto: '¡Exacto!', feedback_error: 'Cargas negativas.' },
      { id: 261, enunciado: 'Un material que permite el paso libre de electrones se llama:', alternativas: { A: 'Aislante.', B: 'Conductor.', C: 'Semiconductor.', D: 'Dieléctrico.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Ejemplo: Cobre.' }
    ]
  },
  {
    id: 'test-ctp-fis-9',
    seccionId: 'sec-ctp-fis-9',
    preguntas: [
      { id: 262, enunciado: 'En un circuito en paralelo, el voltaje en cada resistencia es:', alternativas: { A: 'Distinto.', B: 'Igual al de la fuente.', C: 'Cero.', D: 'Suma de voltajes.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Conexión domiciliaria típica.' },
      { id: 263, enunciado: 'Si la resistencia de un circuito aumenta, la corriente (a voltaje constante):', alternativas: { A: 'Aumenta.', B: 'Disminuye.', C: 'Sigue igual.', D: 'Se duplica.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'I = V / R.' },
      { id: 264, enunciado: 'Dispositivo que protege la instalación cortando la luz por sobrecarga:', alternativas: { A: 'Medidor.', B: 'Interruptor automático.', C: 'Transformador.', D: 'Ampolleta.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Previene incendios.' }
    ]
  },
  {
    id: 'test-ctp-fis-10',
    seccionId: 'sec-ctp-fis-10',
    preguntas: [
      { id: 265, enunciado: 'Fenómeno de desviación de luz al cambiar de medio:', respuesta_correcta: 'B', alternativas: { A: 'Reflexión.', B: 'Refracción.', C: 'Interferencia.', D: 'Difracción.' }, feedback_acierto: '¡Correcto!', feedback_error: 'Indice de refracción.' },
      { id: 266, enunciado: 'Uso tecnológico de las ondas EM para medir distancia de aviones:', respuesta_correcta: 'A', alternativas: { A: 'Radar.', B: 'GPS.', C: 'Fibra.', D: 'Radio.' }, feedback_acierto: '¡Exacto!', feedback_error: 'Eco-localización.' },
      { id: 267, enunciado: 'Espejo que converge los rayos de luz en un punto (foco):', respuesta_correcta: 'A', alternativas: { A: 'Cóncavo.', B: 'Convexo.', C: 'Plano.', D: 'Cilíndrico.' }, feedback_acierto: '¡Bien!', feedback_error: 'Maquillaje o dentista.' },
      { id: 268, enunciado: 'Gráfico de MRU (Posición vs Tiempo) es una:', respuesta_correcta: 'A', alternativas: { A: 'Línea recta con pendiente.', B: 'Parábola.', C: 'Horizontal.', D: 'Vertical.' }, feedback_acierto: '¡Correcto!', feedback_error: 'Velocidad constante.' },
      { id: 269, enunciado: 'Si un bloque de 10kg no se mueve con 50N de fuerza, el roce es:', respuesta_correcta: 'B', alternativas: { A: '0 N.', B: '50 N.', C: '100 N.', D: '5 N.' }, feedback_acierto: '¡Exacto!', feedback_error: 'Equilibrio de fuerzas.' },
      { id: 270, enunciado: 'Unidad de potencia eléctrica:', respuesta_correcta: 'D', alternativas: { A: 'Ohm.', B: 'Volt.', C: 'Ampere.', D: 'Watt.' }, feedback_acierto: '¡Bien!', feedback_error: 'Energía por tiempo.' },
      { id: 271, enunciado: 'Resistencia equivalente de dos R de 10 Ohm en serie:', respuesta_correcta: 'C', alternativas: { A: '5 Ohm.', B: '10 Ohm.', C: '20 Ohm.', D: '100 Ohm.' }, feedback_acierto: '¡Correcto!', feedback_error: 'Se suman.' },
      { id: 272, enunciado: 'Componente que mide el consumo de kWh en el hogar:', respuesta_correcta: 'C', alternativas: { A: 'Automático.', B: 'Enchufe.', C: 'Medidor.', D: 'Cable.' }, feedback_acierto: '¡Exacto!', feedback_error: 'Registro acumulado.' },
      { id: 273, enunciado: 'La luz blanca se descompone en colores al pasar por un prisma debido a:', respuesta_correcta: 'C', alternativas: { A: 'Reflexión.', B: 'Absorción.', C: 'Dispersión (refracción diferencial).', D: 'Difracción.' }, feedback_acierto: '¡Bien!', feedback_error: 'Arcoíris.' },
      { id: 274, enunciado: 'Tercera Ley de Newton implica que las fuerzas siempre ocurren:', respuesta_correcta: 'B', alternativas: { A: 'Solas.', B: 'En pares.', C: 'En el vacío.', D: 'En objetos iguales.' }, feedback_acierto: '¡Excelente!', feedback_error: 'Interacción mutua.' }
    ]
  },

  // --- TÉCNICO PROFESIONAL: QUÍMICA ---
  {
    id: 'test-ctp-qui-1',
    seccionId: 'sec-ctp-qui-1',
    preguntas: [
      { id: 275, enunciado: 'Partícula subatómica con carga positiva ubicada en el núcleo:', alternativas: { A: 'Electrón.', B: 'Protón.', C: 'Neutrón.', D: 'Positrón.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Define el elemento.' },
      { id: 276, enunciado: 'Átomos con igual número de protones pero distinto número de neutrones:', alternativas: { A: 'Isótopos.', B: 'Isóbaros.', C: 'Isótonos.', D: 'Iones.' }, respuesta_correcta: 'A', feedback_acierto: '¡Exacto!', feedback_error: 'Mismo Z, distinto A.' },
      { id: 277, enunciado: 'El modelo atómico de "budín de pasas" pertenece a:', alternativas: { A: 'Dalton.', B: 'Thomson.', C: 'Rutherford.', D: 'Bohr.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Electrones en masa positiva.' }
    ]
  },
  {
    id: 'test-ctp-qui-2',
    seccionId: 'sec-ctp-qui-2',
    preguntas: [
      { id: 278, enunciado: 'Sustancia que no puede separarse en otras más simples por medios químicos:', alternativas: { A: 'Mezcla.', B: 'Elemento.', C: 'Compuesto.', D: 'Solución.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Átomos iguales.' },
      { id: 279, enunciado: 'El agua destilada se clasifica como:', alternativas: { A: 'Elemento.', B: 'Compuesto (sustancia pura).', C: 'Mezcla homogénea.', D: 'Mezcla heterogénea.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'H2O puro.' },
      { id: 280, enunciado: 'Una ensalada de frutas es un ejemplo de:', alternativas: { A: 'Mezcla homogénea.', B: 'Mezcla heterogénea.', C: 'Compuesto.', D: 'Elemento.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Se ven las fases.' }
    ]
  },
  {
    id: 'test-ctp-qui-3',
    seccionId: 'sec-ctp-qui-3',
    preguntas: [
      { id: 281, enunciado: 'Método para separar sólidos de líquidos usando un papel o malla:', alternativas: { A: 'Decantación.', B: 'Filtración.', C: 'Destilación.', D: 'Tamizado.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Retención física.' },
      { id: 282, enunciado: 'Técnica usada para separar líquidos con distinto punto de ebullición:', alternativas: { A: 'Filtración.', B: 'Destilación.', C: 'Cristalización.', D: 'Centrifugación.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Ejemplo: Alcohol y agua.' },
      { id: 283, enunciado: 'La decantación permite separar mezclas por diferencia de:', alternativas: { A: 'Tamaño.', B: 'Densidad.', C: 'Color.', D: 'Solubilidad.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'El más pesado baja.' }
    ]
  },
  {
    id: 'test-ctp-qui-4',
    seccionId: 'sec-ctp-qui-4',
    preguntas: [
      { id: 284, enunciado: 'Propiedad del carbono que le permite formar 4 enlaces:', alternativas: { A: 'Catenación.', B: 'Tetravalencia.', C: 'Electronegatividad.', D: 'Radio atómico.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: '4 electrones de valencia.' },
      { id: 285, enunciado: 'Hibridación del carbono en un enlace simple (alcanos):', alternativas: { A: 'sp.', B: 'sp2.', C: 'sp3.', D: 'd2sp3.' }, respuesta_correcta: 'C', feedback_acierto: '¡Exacto!', feedback_error: 'Geometría tetraédrica.' },
      { id: 286, enunciado: 'En un enlace doble (C=C), hay presentes:', alternativas: { A: 'Dos enlaces sigma.', B: 'Un enlace sigma y uno pi.', C: 'Dos enlaces pi.', D: 'Un enlace triple.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Hibridación sp2.' }
    ]
  },
  {
    id: 'test-ctp-qui-5',
    seccionId: 'sec-ctp-qui-5',
    preguntas: [
      { id: 287, enunciado: 'Hidrocarburos que solo tienen enlaces simples entre carbonos:', alternativas: { A: 'Alquenos.', B: 'Alquinos.', C: 'Alcanos.', D: 'Aromáticos.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto!', feedback_error: 'Saturados.' },
      { id: 288, enunciado: 'El hidrocarburo más simple, CH4, se llama:', alternativas: { A: 'Etano.', B: 'Metano.', C: 'Propano.', D: 'Butano.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Gas natural.' },
      { id: 289, enunciado: 'Al nombrar una cadena ramificada, se debe buscar la cadena:', alternativas: { A: 'Más corta.', B: 'Más larga y continua.', C: 'Con más ramificaciones.', D: 'Más pesada.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Cadena principal.' }
    ]
  },
  {
    id: 'test-ctp-qui-6',
    seccionId: 'sec-ctp-qui-6',
    preguntas: [
      { id: 290, enunciado: 'Grupo funcional caracterizado por el grupo -OH:', alternativas: { A: 'Éter.', B: 'Cetona.', C: 'Alcohol.', D: 'Aldehído.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto!', feedback_error: 'Hidroxilo.' },
      { id: 291, enunciado: 'Compuesto orgánico usado como solvente (R-O-R):', alternativas: { A: 'Éster.', B: 'Éter.', C: 'Amida.', D: 'Ácido.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Oxígeno central.' },
      { id: 292, enunciado: '¿Cuál es el grupo funcional presente en el formaldehído?', alternativas: { A: 'Cetona.', B: 'Aldehído.', C: 'Alcohol.', D: 'Ácido.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Carbonilo terminal.' }
    ]
  },
  {
    id: 'test-ctp-qui-7',
    seccionId: 'sec-ctp-qui-7',
    preguntas: [
      { id: 293, enunciado: 'Ley que indica que la masa se mantiene constante en una reacción:', alternativas: { A: 'Ley de Proust.', B: 'Ley de Lavoisier.', C: 'Ley de Dalton.', D: 'Ley de Boyle.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Conservación de la masa.' },
      { id: 294, enunciado: 'En la ecuación 2 H2 + O2 -> 2 H2O, ¿qué son el H2 y el O2?', alternativas: { A: 'Productos.', B: 'Reactantes.', C: 'Catalizadores.', D: 'Solventes.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Sustancias iniciales.' },
      { id: 295, enunciado: 'Proceso donde ocurre una reorganización de átomos para formar nuevas sustancias:', alternativas: { A: 'Cambio físico.', B: 'Reacción química.', C: 'Mezcla.', D: 'Evaporación.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Cambio de identidad química.' }
    ]
  },
  {
    id: 'test-ctp-qui-8',
    seccionId: 'sec-ctp-qui-8',
    preguntas: [
      { id: 296, enunciado: 'Un mol de cualquier sustancia contiene exactamente:', alternativas: { A: '100 unidades.', B: '6.02 * 10^23 unidades.', C: '1 kilogramo.', D: '1 litro.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Número de Avogadro.' },
      { id: 297, enunciado: 'La masa molar se expresa generalmente en:', alternativas: { A: 'gramos/litro.', B: 'gramos/mol.', C: 'moles/litro.', D: 'kilogramos.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Masa de un mol.' },
      { id: 298, enunciado: '¿Cuántos moles hay en 36g de agua (Masa molar H2O = 18 g/mol)?', alternativas: { A: '1 mol.', B: '2 mol.', C: '3 mol.', D: '4 mol.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: '36 / 18.' }
    ]
  },
  {
    id: 'test-ctp-qui-9',
    seccionId: 'sec-ctp-qui-9',
    preguntas: [
      { id: 299, enunciado: 'El reactivo que se consume totalmente y detiene la reacción es el:', alternativas: { A: 'En exceso.', B: 'Limitante.', C: 'Catalizador.', D: 'Soluto.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Determina el producto.' },
      { id: 300, enunciado: 'Si se obtienen 80g de producto de un máximo teórico de 100g, el rendimiento es:', alternativas: { A: '100%.', B: '80%.', C: '20%.', D: '50%.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Real / Teórico * 100.' },
      { id: 301, enunciado: 'Reactivo que sobra al finalizar la reacción:', alternativas: { A: 'Limitante.', B: 'En exceso.', C: 'Precipitado.', D: 'Impureza.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'No se usa todo.' }
    ]
  },
  {
    id: 'test-ctp-qui-10',
    seccionId: 'sec-ctp-qui-10',
    preguntas: [
      { id: 302, enunciado: 'Cambio de estado de gas a líquido:', respuesta_correcta: 'B', alternativas: { A: 'Evaporación.', B: 'Condensación.', C: 'Sublimación.', D: 'Fusión.' }, feedback_acierto: '¡Correcto!', feedback_error: 'Ciclo del agua.' }
    ]
  },

  // --- MÓDULOS DE CIENCIAS: BIOLOGÍA ---
  {
    id: 'test-cbio-1-1',
    seccionId: 'sec-cbio-1-1',
    preguntas: [
      { id: 1001, enunciado: 'Investigación sobre E. coli mutó una estructura para rotar como hélice. ¿Qué estructura es?', alternativas: { A: 'El flagelo.', B: 'La cápsula.', C: 'La pared celular.', D: 'La membrana plasmática.' }, respuesta_correcta: 'A', feedback_acierto: '¡Correcto! El flagelo otorga movilidad.', feedback_error: 'Busca el componente asociado al movimiento bacteriano.' },
      { id: 1002, enunciado: '¿Cuál es la principal diferencia entre una célula procarionte y una eucarionte?', alternativas: { A: 'Presencia de ADN.', B: 'Presencia de ribosomas.', C: 'Presencia de núcleo y organelos membranosos.', D: 'Presencia de membrana plasmática.' }, respuesta_correcta: 'C', feedback_acierto: '¡Exacto!', feedback_error: 'Los organelos membranosos son exclusivos de eucariontes.' },
      { id: 1003, enunciado: 'Las bacterias se clasifican como organismos:', alternativas: { A: 'Eucariontes animales.', B: 'Eucariontes vegetales.', C: 'Procariontes.', D: 'Acelulares.' }, respuesta_correcta: 'C', feedback_acierto: '¡Bien!', feedback_error: 'Las bacterias no tienen núcleo definido.' }
    ]
  },
  {
    id: 'test-cbio-1-2',
    seccionId: 'sec-cbio-1-2',
    preguntas: [
      { id: 1004, enunciado: 'El modelo de mosaico fluido describe la estructura de:', alternativas: { A: 'La pared celular.', B: 'La membrana plasmática.', C: 'El citoesqueleto.', D: 'El citoplasma.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Se refiere a la bicapa lipídica con proteínas.' },
      { id: 1005, enunciado: 'La pared celular vegetal está compuesta principalmente por:', alternativas: { A: 'Quitina.', B: 'Celulosa.', C: 'Peptidoglicano.', D: 'Fosfolípidos.' }, respuesta_correcta: 'B', feedback_acierto: '¡Excelente!', feedback_error: 'La celulosa otorga rigidez a las plantas.' },
      { id: 1006, enunciado: '¿Qué función cumple la membrana plasmática?', alternativas: { A: 'Síntesis de proteínas.', B: 'Regulación del paso de sustancias.', C: 'Producción de ATP.', D: 'Almacenamiento de agua.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Es una barrera selectiva.' }
    ]
  },
  {
    id: 'test-cbio-1-3',
    seccionId: 'sec-cbio-1-3',
    preguntas: [
      { id: 1007, enunciado: '¿Qué proceso ocurre específicamente en el nucléolo?', alternativas: { A: 'Replicación del ADN.', B: 'Síntesis de subunidades ribosomales.', C: 'Traducción de proteínas.', D: 'Glicosilación.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'El nucléolo es la fábrica de ribosomas.' },
      { id: 1008, enunciado: 'El material genético en el núcleo se encuentra asociado a proteínas formando:', alternativas: { A: 'Citosol.', B: 'Cromatina.', C: 'Nucléolo.', D: 'Matriz.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'ADN + Histonas = Cromatina.' },
      { id: 1009, enunciado: '¿Qué estructura delimita el contenido nuclear del citoplasma?', alternativas: { A: 'Pared celular.', B: 'Carioteca (Envoltura nuclear).', C: 'Lámina basal.', D: 'Plasmodesmo.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Es una doble membrana con poros.' }
    ]
  },
  {
    id: 'test-cbio-1-4',
    seccionId: 'sec-cbio-1-4',
    preguntas: [
      { id: 1010, enunciado: 'Un estudio en hepatocitos muestra que la radiación infrarroja modifica el volumen del REL. ¿Variable dependiente?', alternativas: { A: 'Intensidad radiación.', B: 'Tiempo.', C: 'Volumen del REL.', D: 'Línea celular.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto!', feedback_error: 'Es el efecto medido.' },
      { id: 1011, enunciado: 'El Retículo Endoplasmático Rugoso (RER) debe su nombre a la presencia de:', alternativas: { A: 'Lípidos.', B: 'Ribosomas.', C: 'Carbohidratos.', D: 'Lisosomas.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Los ribosomas le dan el aspecto rugoso.' },
      { id: 1012, enunciado: 'La función principal del REL es:', alternativas: { A: 'Síntesis de proteínas.', B: 'Síntesis de lípidos y desintoxicación.', C: 'Digestión celular.', D: 'Fotosíntesis.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Se encarga de grasas y toxinas.' }
    ]
  },
  {
    id: 'test-cbio-1-5',
    seccionId: 'sec-cbio-1-5',
    preguntas: [
      { id: 1013, enunciado: '¿Qué organelo se encarga de la maduración y empaquetamiento de proteínas?', alternativas: { A: 'Lisosoma.', B: 'Complejo de Golgi.', C: 'Peroxisoma.', D: 'Centriolo.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Es el "centro de despacho" celular.' },
      { id: 1014, enunciado: 'Los lisosomas contienen enzimas encargadas de:', alternativas: { A: 'Síntesis de ATP.', B: 'Digestión intracelular.', C: 'Replicación viral.', D: 'Fijación de CO2.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Son organelos de degradación.' },
      { id: 1015, enunciado: 'Las vesículas que transportan proteínas del RER al Golgi son:', alternativas: { A: 'Lisosomas.', B: 'Vesículas de transición.', C: 'Peroxisomas.', D: 'Vacuolas.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Mueven carga entre organelos.' }
    ]
  },
  {
    id: 'test-cbio-1-6',
    seccionId: 'sec-cbio-1-6',
    preguntas: [
      { id: 1016, enunciado: 'Fagocitos con dieta alta en NaCl bajan consumo de O2 y producción de energía. Organelo afectado:', alternativas: { A: 'Lisosoma.', B: 'Mitocondria.', C: 'Golgi.', D: 'RER.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! El O2 se usa en la mitocondria.', feedback_error: 'Es la central energética.' },
      { id: 1017, enunciado: 'Organelo exclusivo de células vegetales donde ocurre la fotosíntesis:', alternativas: { A: 'Mitocondria.', B: 'Cloroplasto.', C: 'Vacuola.', D: 'Pared celular.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Contienen clorofila.' },
      { id: 1018, enunciado: 'La teoría endosimbiótica explica el origen de:', alternativas: { A: 'Núcleo y RER.', B: 'Mitocondrias y cloroplastos.', C: 'Lisosomas y Golgi.', D: 'Ribosomas.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Propuesta por Lynn Margulis.' }
    ]
  },
  {
    id: 'test-cbio-1-7',
    seccionId: 'sec-cbio-1-7',
    preguntas: [
      { id: 1019, enunciado: '¿Qué componente otorga estabilidad mecánica y permite el movimiento de organelos?', alternativas: { A: 'Citoplasma.', B: 'Citoesqueleto.', C: 'Membrana.', D: 'Núcleo.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Es el armazón proteico.' },
      { id: 1020, enunciado: 'Las estructuras que permiten la movilidad de espermatozoides son:', alternativas: { A: 'Cilios.', B: 'Flagelos.', C: 'Pseudópodos.', D: 'Fimbrias.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Cola larga para nadar.' },
      { id: 1021, enunciado: 'El citoesqueleto está formado por:', alternativas: { A: 'Lípidos y ceras.', B: 'Microtúbulos, microfilamentos y filamentos intermedios.', C: 'ADN y ARN.', D: 'Almidón.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Son polímeros de proteínas.' }
    ]
  },
  {
    id: 'test-cbio-1-8',
    seccionId: 'sec-cbio-1-8',
    preguntas: [
      { id: 1022, enunciado: 'Célula con microvellosidades apicales y abundantes mitocondrias en la base:', alternativas: { A: 'Neurona.', B: 'Enterocito.', C: 'Miocito.', D: 'Leucocito.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Especializada en absorción.', feedback_error: 'Se encuentra en el intestino.' },
      { id: 1023, enunciado: 'Las células musculares esqueléticas se caracterizan por ser:', alternativas: { A: 'Uninucleadas.', B: 'Multinucleadas y con proteínas contráctiles.', C: 'Cúbicas.', D: 'Avasculares.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Actina y miosina son clave.' },
      { id: 1024, enunciado: '¿Qué estructura aumenta la superficie de absorción en el enterocito?', alternativas: { A: 'Cilios.', B: 'Microvellosidades.', C: 'Flagelos.', D: 'Desmosomas.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Repliegues de membrana.' }
    ]
  },
  {
    id: 'test-cbio-1-9',
    seccionId: 'sec-cbio-1-9',
    preguntas: [
      { id: 1025, enunciado: 'Célula dividida en soma, dendritas y axón:', alternativas: { A: 'Glía.', B: 'Neurona.', C: 'Hepatocito.', D: 'Adipocito.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Unidad funcional del SN.' },
      { id: 1026, enunciado: 'Célula especializada en la secreción de insulina y somatostatina:', alternativas: { A: 'Neurona.', B: 'Célula pancreática.', C: 'Enterocito.', D: 'Miocito.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Células beta y delta del páncreas.' },
      { id: 1027, enunciado: 'Las neuronas se comunican mediante:', alternativas: { A: 'Hormonas.', B: 'Sinapsis.', C: 'Ósmosis.', D: 'Difusión simple.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Transmisión del impulso.' }
    ]
  },
  {
    id: 'test-cbio-1-10',
    seccionId: 'sec-cbio-1-10',
    preguntas: [
      { id: 1028, enunciado: 'Estructura bacteriana manipulada para nanodispositivos de rotación:', respuesta_correcta: 'A', alternativas: { A: 'Flagelo.', B: 'Cápsula.', C: 'Pared.', D: 'Membrana.' }, feedback_acierto: '¡Correcto!', feedback_error: 'Movilidad bacteriana.' },
      { id: 1029, enunciado: 'Variable dependiente en el estudio de hepatocitos irradiados:', respuesta_correcta: 'C', alternativas: { A: 'Intensidad.', B: 'Tiempo.', C: 'Volumen REL.', D: 'Tipo rata.' }, feedback_acierto: '¡Exacto!', feedback_error: 'Lo que se mide.' },
      { id: 1030, enunciado: 'Estructura que se compacta para formar cromosomas:', respuesta_correcta: 'B', alternativas: { A: 'ARN.', B: 'Cromatina.', C: 'Ribosoma.', D: 'Centriolo.' }, feedback_acierto: '¡Bien!', feedback_error: 'ADN + Proteínas.' },
      { id: 1031, enunciado: 'Organelo que degrada sustancias tóxicas en el hígado:', respuesta_correcta: 'D', alternativas: { A: 'RER.', B: 'Lisosoma.', C: 'Mitocondria.', D: 'REL.' }, feedback_acierto: '¡Correcto!', feedback_error: 'Desintoxicación celular.' },
      { id: 1032, enunciado: 'Si se bloquea el nucléolo, ¿qué falta en el citoplasma?', respuesta_correcta: 'B', alternativas: { A: 'Glucosa.', B: 'Ribosomas.', C: 'Lípidos.', D: 'ATP.' }, feedback_acierto: '¡Exacto!', feedback_error: 'Sintetiza subunidades ribosomales.' },
      { id: 1033, enunciado: 'Componente que responde a presiones mecánicas externas:', respuesta_correcta: 'D', alternativas: { A: 'ADN.', B: 'Golgi.', C: 'Nucléolo.', D: 'Citoesqueleto.' }, feedback_acierto: '¡Bien!', feedback_error: 'Otorga estabilidad.' },
      { id: 1034, enunciado: 'Organelo con ADN propio y doble membrana:', respuesta_correcta: 'B', alternativas: { A: 'Ribosoma.', B: 'Mitocondria.', C: 'Lisosoma.', D: 'Vacuola.' }, feedback_acierto: '¡Correcto!', feedback_error: 'Herencia citoplasmática.' },
      { id: 1035, enunciado: 'Célula con abundantes proteínas contráctiles (actina/miosina):', respuesta_correcta: 'C', alternativas: { A: 'Enterocito.', B: 'Neurona.', C: 'Célula muscular.', D: 'Hepatocito.' }, feedback_acierto: '¡Bien!', feedback_error: 'Permite contracción.' },
      { id: 1036, enunciado: 'Tipo de transporte que requiere ATP:', respuesta_correcta: 'B', alternativas: { A: 'Difusión.', B: 'Transporte Activo.', C: 'Ósmosis.', D: 'Diálisis.' }, feedback_acierto: '¡Exacto!', feedback_error: 'Contra gradiente.' },
      { id: 1037, enunciado: 'La secreción de somatostatina en diabéticos tipo 2:', respuesta_correcta: 'C', alternativas: { A: 'Baja.', B: 'Es nula.', C: 'Aumenta.', D: 'Es normal.' }, feedback_acierto: '¡Correcto!', feedback_error: 'Dato del temario.' }
    ]
  },

  // --- BIOLOGÍA: PROCESOS Y FUNCIONES ---
  {
    id: 'test-cbio-2-1',
    seccionId: 'sec-cbio-2-1',
    preguntas: [
      { id: 2001, enunciado: 'Limitación científica para ver neuronas a finales del siglo XIX:', alternativas: { A: 'Falta de teorías.', B: 'Desconocimiento funcional.', C: 'Insuficiencia de microscopía.', D: 'Miedo al contagio.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto!', feedback_error: 'Técnicas de tinción y lentes eran limitadas.' },
      { id: 2002, enunciado: 'Las células de sostén del sistema nervioso se llaman:', alternativas: { A: 'Neuronas.', B: 'Glías (Células gliales).', C: 'Miocitos.', D: 'Adipocitos.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Nutren y protegen a las neuronas.' },
      { id: 2003, enunciado: '¿Qué estructura neuronal recibe las señales de otras neuronas?', alternativas: { A: 'Axón.', B: 'Dendritas.', C: 'Soma.', D: 'Vaina de mielina.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Prolongaciones cortas receptoras.' }
    ]
  },
  {
    id: 'test-cbio-2-2',
    seccionId: 'sec-cbio-2-2',
    preguntas: [
      { id: 2004, enunciado: 'La comunicación entre neuronas mediante mensajeros químicos se denomina:', alternativas: { A: 'Sinapsis eléctrica.', B: 'Sinapsis química.', C: 'Ósmosis.', D: 'Pinocitosis.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Involucra neurotransmisores.' },
      { id: 2005, enunciado: 'El potencial de acción se propaga a través de:', alternativas: { A: 'Las dendritas.', B: 'El axón.', C: 'El núcleo.', D: 'Los ribosomas.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Es la vía de salida de la señal.' },
      { id: 2006, enunciado: '¿Qué efecto tiene la vaina de mielina en la conducción nerviosa?', alternativas: { A: 'La ralentiza.', B: 'La acelera.', C: 'La detiene.', D: 'No tiene efecto.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Permite la conducción saltatoria.' }
    ]
  },
  {
    id: 'test-cbio-2-3',
    seccionId: 'sec-cbio-2-3',
    preguntas: [
      { id: 2007, enunciado: 'Un arco reflejo simple se caracteriza por ser:', alternativas: { A: 'Voluntario.', B: 'Involuntario y rápido.', C: 'Lento.', D: 'Solo cerebral.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Respuesta automática de la médula.' },
      { id: 2008, enunciado: 'La neurona que lleva la señal desde el receptor a la médula es:', alternativas: { A: 'Motora (Eferente).', B: 'Sensitiva (Aferente).', C: 'Interneurona.', D: 'Glía.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Lleva la sensación al centro.' },
      { id: 2009, enunciado: 'El centro integrador en un reflejo espinal es:', alternativas: { A: 'El cerebro.', B: 'La médula espinal.', C: 'El cerebelo.', D: 'El bulbo.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Permite respuesta sin llegar al cerebro.' }
    ]
  },
  {
    id: 'test-cbio-2-4',
    seccionId: 'sec-cbio-2-4',
    preguntas: [
      { id: 2010, enunciado: '¿Qué efecto tiene el consumo crónico de alcohol en el SN?', alternativas: { A: 'Mejora la memoria.', B: 'Es un depresor del sistema nervioso.', C: 'Estimula el crecimiento neuronal.', D: 'No tiene efectos.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Ralentiza las funciones cerebrales.' },
      { id: 2011, enunciado: 'Hábito esencial para la salud del sistema nervioso:', alternativas: { A: 'Consumo de cafeína.', B: 'Horas de sueño adecuadas.', C: 'Sedentarismo.', D: 'Estrés constante.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'El sueño permite la reparación.' },
      { id: 2012, enunciado: 'La adicción se relaciona con alteraciones en el sistema de:', alternativas: { A: 'Digestión.', B: 'Recompensa (Dopamina).', C: 'Excreción.', D: 'Circulación.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Afecta el juicio y placer.' }
    ]
  },
  {
    id: 'test-cbio-2-5',
    seccionId: 'sec-cbio-2-5',
    preguntas: [
      { id: 2013, enunciado: 'Si una droga desintegra la zona pelúcida del ovocito, ¿qué ocurre?', alternativas: { A: 'Infertilidad total.', B: 'Fecundación por más de un espermatozoide (Polispermia).', C: 'Mejor salud del cigoto.', D: 'Bloqueo del acrosoma.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! La zona pelúcida previene la entrada masiva.', feedback_error: 'Se pierde el bloqueo a la polispermia.' },
      { id: 2014, enunciado: '¿Qué proceso permite al espermatozoide atravesar las capas del ovocito?', alternativas: { A: 'Reacción acrosómica.', B: 'Capacitación.', C: 'Meiosis.', D: 'Mitosis.' }, respuesta_correcta: 'A', feedback_acierto: '¡Exacto!', feedback_error: 'Liberación de enzimas del acrosoma.' },
      { id: 2015, enunciado: 'La unión del ovocito y el espermatozoide forma:', alternativas: { A: 'Embrión.', B: 'Cigoto.', C: 'Feto.', D: 'Blastocisto.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Es la primera célula diploide.' }
    ]
  },
  {
    id: 'test-cbio-2-6',
    seccionId: 'sec-cbio-2-6',
    preguntas: [
      { id: 2016, enunciado: 'Lugar donde se producen los espermatozoides:', alternativas: { A: 'Próstata.', B: 'Túbulos seminíferos (Testículos).', C: 'Epidídimo.', D: 'Conducto deferente.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Gónada masculina.' },
      { id: 2017, enunciado: 'El gameto femenino (ovocito II) se produce en:', alternativas: { A: 'Utero.', B: 'Ovarios.', C: 'Trompas de falopio.', D: 'Vagina.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Gónada femenina.' },
      { id: 2018, enunciado: 'La implantación del embrión ocurre en:', alternativas: { A: 'Ovario.', B: 'Endometrio (Utero).', C: 'Cérvix.', D: 'Abdomen.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Capa interna del útero.' }
    ]
  },
  {
    id: 'test-cbio-2-7',
    seccionId: 'sec-cbio-2-7',
    preguntas: [
      { id: 2019, enunciado: 'Hormona que gatilla la ovulación:', alternativas: { A: 'FSH.', B: 'LH (Luteinizante).', C: 'Estrógeno.', D: 'Progesterona.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'El "peak" de LH induce la salida del ovocito.' },
      { id: 2020, enunciado: 'El fármaco elagolix busca mejorar la regularidad en mujeres con:', alternativas: { A: 'Gripe.', B: 'SOP (Síndrome de Ovario Poliquístico).', C: 'Diabetes.', D: 'Anemia.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Dato de la investigación citada.' },
      { id: 2021, enunciado: '¿Qué ocurre en la fase menstrual del ciclo uterino?', alternativas: { A: 'Engrosamiento del endometrio.', B: 'Desprendimiento del endometrio.', C: 'Ovulación.', D: 'Fecundación.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Marca el inicio del ciclo.' }
    ]
  },
  {
    id: 'test-cbio-2-8',
    seccionId: 'sec-cbio-2-8',
    preguntas: [
      { id: 2022, enunciado: '¿Cuál de estos es un método anticonceptivo de barrera?', alternativas: { A: 'Píldora.', B: 'Preservativo.', C: 'Vasectomía.', D: 'Ligadura de trompas.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Impide el contacto físico de gametos.' },
      { id: 2023, enunciado: 'Sustancia que inactiva o mata espermatozoides:', alternativas: { A: 'Antibiótico.', B: 'Espermicida.', C: 'Hormona.', D: 'Suero.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Acción química local.' },
      { id: 2024, enunciado: 'El método Billings se basa en la observación de:', alternativas: { A: 'Temperatura.', B: 'Moco cervical.', C: 'Días del calendario.', D: 'Ritmo cardiaco.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Método natural.' }
    ]
  },
  {
    id: 'test-cbio-2-9',
    seccionId: 'sec-cbio-2-9',
    preguntas: [
      { id: 2025, enunciado: 'Eficacia del preservativo contra el VIH según la OMS:', alternativas: { A: '50%.', B: '>90%.', C: '10%.', D: '0%.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Alta protección si se usa bien.' },
      { id: 2026, enunciado: 'Agente causante de la Sífilis:', alternativas: { A: 'Virus VIH.', B: 'Bacteria Treponema pallidum.', C: 'Hongo Cándida.', D: 'Parásito Tricomona.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Por eso se trata con antibióticos.' },
      { id: 2027, enunciado: 'ITS con menor protección por preservativo debido a lesiones externas:', alternativas: { A: 'VIH.', B: 'Herpes y Sífilis.', C: 'Hepatitis B.', D: 'Gonorrea.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'El contacto piel a piel con llagas transmite.' }
    ]
  },
  {
    id: 'test-cbio-2-10',
    seccionId: 'sec-cbio-2-10',
    preguntas: [
      { id: 2028, enunciado: 'Objetivo de vacunas de refuerzo:', respuesta_correcta: 'A', alternativas: { A: 'Protección larga duración.', B: 'Inmunidad innata.', C: 'Inmunidad pasiva.', D: 'Cura inmediata.' }, feedback_acierto: '¡Correcto!', feedback_error: 'Genera memoria inmunológica.' },
      { id: 2029, enunciado: 'Tejido avascular que no genera rechazo en trasplantes:', respuesta_correcta: 'D', alternativas: { A: 'Piel.', B: 'Hígado.', C: 'Corazón.', D: 'Córnea.' }, feedback_acierto: '¡Exacto!', feedback_error: 'Sin vasos sanguíneos.' },
      { id: 2030, enunciado: 'Tratamiento para la Sífilis:', respuesta_correcta: 'A', alternativas: { A: 'Antibióticos.', B: 'Antivirales.', C: 'Cirugía.', D: 'Vacuna.' }, feedback_acierto: '¡Bien!', feedback_error: 'Es una bacteria.' },
      { id: 2031, enunciado: 'Predicción sobre brote de Influenza con baja vacunación:', respuesta_correcta: 'C', alternativas: { A: 'No habrá brote.', B: 'Bajarán casos.', C: 'Nuevo brote probable.', D: 'Virus desaparecerá.' }, feedback_acierto: '¡Correcto!', feedback_error: 'Inferencia lógica.' },
      { id: 2032, enunciado: 'Células del cordón umbilical con mutación resisten al:', respuesta_correcta: 'B', alternativas: { A: 'Cáncer.', B: 'VIH.', C: 'SOP.', D: 'Sífilis.' }, feedback_acierto: '¡Exacto!', feedback_error: 'Caso de posible cura.' },
      { id: 2033, enunciado: 'Hormona que mantiene el embarazo:', respuesta_correcta: 'D', alternativas: { A: 'LH.', B: 'FSH.', C: 'Estrógeno.', D: 'Progesterona.' }, feedback_acierto: '¡Bien!', feedback_error: 'Pro-gestación.' },
      { id: 2034, enunciado: 'Sinapsis química usa:', respuesta_correcta: 'C', alternativas: { A: 'Electricidad directa.', B: 'Agua.', C: 'Neurotransmisores.', D: 'Sangre.' }, feedback_acierto: '¡Correcto!', feedback_error: 'Mensajeros químicos.' },
      { id: 2035, enunciado: 'Efecto del alcohol en la respuesta nerviosa:', respuesta_correcta: 'B', alternativas: { A: 'La acelera.', B: 'La ralentiza.', C: 'No influye.', D: 'Mejora reflejos.' }, feedback_acierto: '¡Bien!', feedback_error: 'Depresor del SN.' },
      { id: 2036, enunciado: 'El acrosoma se encuentra en:', respuesta_correcta: 'B', alternativas: { A: 'Ovocito.', B: 'Espermatozoide.', C: 'Cigoto.', D: 'Útero.' }, feedback_acierto: '¡Exacto!', feedback_error: 'Cabeza del gameto masculino.' },
      { id: 2037, enunciado: 'ITS viral prevenible con vacuna:', respuesta_correcta: 'C', alternativas: { A: 'Sífilis.', B: 'Gonorrea.', C: 'Hepatitis B / VPH.', D: 'Clamidia.' }, feedback_acierto: '¡Correcto!', feedback_error: 'Prevención por inmunización.' }
    ]
  },

  // --- BIOLOGÍA: HERENCIA Y EVOLUCIÓN ---
  {
    id: 'test-cbio-3-1',
    seccionId: 'sec-cbio-3-1',
    preguntas: [
      { id: 3001, enunciado: '¿En qué etapa de la interfase ocurre la duplicación del ADN?', alternativas: { A: 'G1.', B: 'S.', C: 'G2.', D: 'M.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'S de Síntesis.' },
      { id: 3002, enunciado: 'Grado de compactación del ADN es máximo en:', alternativas: { A: 'Interfase.', B: 'Metafase (Mitosis).', C: 'Fase S.', D: 'G0.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Cuando se ven los cromosomas claramente.' },
      { id: 3003, enunciado: 'Pregunta de investigación sobre señal fluorescente en ADN:', alternativas: { A: '¿Cómo se degrada?', B: '¿Cuál es el grado de compactación a lo largo del ciclo?', C: '¿Por qué brilla?', D: '¿Cuántas células hay?' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Relaciona intensidad con compactación.' }
    ]
  },
  {
    id: 'test-cbio-3-2',
    seccionId: 'sec-cbio-3-2',
    preguntas: [
      { id: 3004, enunciado: 'Etapa de la mitosis más extensa según el estudio citado:', alternativas: { A: 'Anafase.', B: 'Telofase.', C: 'Interfase (pero no es mitosis).', D: 'Profase (dentro de mitosis).' }, respuesta_correcta: 'D', feedback_acierto: '¡Correcto!', feedback_error: 'De las fases de M, la profase suele ser la más larga.' },
      { id: 3005, enunciado: '¿En qué fase se separan las cromátidas hermanas?', alternativas: { A: 'Profase.', B: 'Metafase.', C: 'Anafase.', D: 'Telofase.' }, respuesta_correcta: 'C', feedback_acierto: '¡Exacto!', feedback_error: 'Migran a polos opuestos.' },
      { id: 3006, enunciado: 'La mitosis produce células:', alternativas: { A: 'Haploides.', B: 'Genéticamente idénticas (Diploides).', C: 'Gametos.', D: 'Mutantes.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Conserva la información genética.' }
    ]
  },
  {
    id: 'test-cbio-3-3',
    seccionId: 'sec-cbio-3-3',
    preguntas: [
      { id: 3007, enunciado: 'Falla en los puntos de control del ciclo celular puede provocar:', alternativas: { A: 'Muerte celular programada.', B: 'Cáncer.', C: 'Regeneración perfecta.', D: 'Meiosis.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Proliferación sin freno.' },
      { id: 3008, enunciado: 'Efecto de un fármaco que ralentiza el ciclo celular:', alternativas: { A: 'Aumenta tumores.', B: 'Baja la tasa de proliferación.', C: 'Acelera mitosis.', D: 'No influye.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Estrategia terapéutica.' },
      { id: 3009, enunciado: 'Error de procedimiento al probar fármacos antitumorales:', alternativas: { A: 'Hacer réplicas.', B: 'Usar dos fármacos juntos sin aislarlos.', C: 'Controlar temperatura.', D: 'Usar misma línea celular.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Variables no aisladas impiden conclusiones.' }
    ]
  },
  {
    id: 'test-cbio-3-4',
    seccionId: 'sec-cbio-3-4',
    preguntas: [
      { id: 3010, enunciado: 'El complejo sinaptonémico (CS) es fundamental para:', alternativas: { A: 'La mitosis.', B: 'La recombinación genética en meiosis I.', C: 'La fase S.', D: 'La citoquinesis.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Permite el apareamiento y crossing-over.' },
      { id: 3011, enunciado: 'El crossing-over ocurre en:', alternativas: { A: 'Metafase I.', B: 'Profase I.', C: 'Profase II.', D: 'Anafase I.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Etapa de paquiteno.' },
      { id: 3012, enunciado: 'La meiosis I es una división de tipo:', alternativas: { A: 'Ecuacional.', B: 'Reduccional.', C: 'Somática.', D: 'Vegetativa.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Reduce la carga cromosómica a la mitad.' }
    ]
  },
  {
    id: 'test-cbio-3-5',
    seccionId: 'sec-cbio-3-5',
    preguntas: [
      { id: 3013, enunciado: 'La proteína SCC1 es responsable de:', alternativas: { A: 'Formar el huso.', B: 'Mantener la cohesión de cromátidas hermanas.', C: 'Duplicar ADN.', D: 'Sintetizar ATP.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Dato del estudio sobre aneuploidías.' },
      { id: 3014, enunciado: 'La aneuploidía (ej. Trisomía 21) se debe a:', alternativas: { A: 'Falla en la segregación cromosómica.', B: 'Exceso de nutrientes.', C: 'Mucha mitosis.', D: 'Radiación UV solamente.' }, respuesta_correcta: 'A', feedback_acierto: '¡Exacto!', feedback_error: 'No disyunción en meiosis.' },
      { id: 3015, enunciado: 'Dibujo de célula con 3 cromosomas migrando a cada polo (total 6):', alternativas: { A: 'Anafase I.', B: 'Anafase II.', C: 'Metafase I.', D: 'Telofase.' }, respuesta_correcta: 'A', feedback_acierto: '¡Bien!', feedback_error: 'Se separan homólogos.' }
    ]
  },
  {
    id: 'test-cbio-3-6',
    seccionId: 'sec-cbio-3-6',
    preguntas: [
      { id: 3016, enunciado: 'Para obtener una papa transgénica con toxina Bt, es indispensable:', alternativas: { A: 'Lavar la papa con toxina.', B: 'Insertar el gen Bt en un plásmido vector.', C: 'Inyectar la bacteria en la raíz.', D: 'Cruzar papas con bacterias.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Ingeniería genética.' },
      { id: 3017, enunciado: 'Proteína humana IL-37 producida en tabaco es un ejemplo de:', alternativas: { A: 'Mutación azar.', B: 'Biotecnología (Biofármacos).', C: 'Evolución natural.', D: 'Fotosíntesis.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Uso de plantas como bioreactores.' },
      { id: 3018, enunciado: '¿Qué permite la expresión de genes humanos en plantas?', alternativas: { A: 'El código genético es universal.', B: 'Las plantas son animales.', C: 'Las proteínas son iguales.', D: 'El azar.' }, respuesta_correcta: 'A', feedback_acierto: '¡Bien!', feedback_error: 'Principio fundamental de la biología molecular.' }
    ]
  },
  {
    id: 'test-cbio-3-7',
    seccionId: 'sec-cbio-3-7',
    preguntas: [
      { id: 3019, enunciado: 'La estratigrafía permite determinar la antigüedad relativa de fósiles basándose en:', alternativas: { A: 'El color del fósil.', B: 'La profundidad del estrato.', C: 'El tamaño.', D: 'El peso.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Más profundo, generalmente más antiguo.', feedback_error: 'Ley de superposición.' },
      { id: 3020, enunciado: 'Órganos con misma estructura interna pero distinta función (ej. ala ave y brazo humano):', alternativas: { A: 'Análogos.', B: 'Homólogos.', C: 'Vestigiales.', D: 'Atávicos.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Evidencia de ancestro común.' },
      { id: 3021, enunciado: 'Comparar secuencias de aminoácidos en hemoglobina de patos sirve para:', alternativas: { A: 'Ver qué comen.', B: 'Inferir parentesco evolutivo.', C: 'Ver el color de plumas.', D: 'Contar individuos.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Filogenia molecular.' }
    ]
  },
  {
    id: 'test-cbio-3-8',
    seccionId: 'sec-cbio-3-8',
    preguntas: [
      { id: 3022, enunciado: 'La "vernalización" de Lysenko se basaba en la teoría de:', alternativas: { A: 'Selección natural.', B: 'Herencia de caracteres adquiridos.', C: 'Genética de Mendel.', D: 'Big Bang.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Pensaba que el frío "educaba" a las semillas.', feedback_error: 'Postura neolamarckista.' },
      { id: 3023, enunciado: 'Lamarck proponía que la evolución ocurría por:', alternativas: { A: 'Azar.', B: 'Uso y desuso de órganos.', C: 'Extinciones masivas.', D: 'Deriva génica.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Teoría del transformismo.' },
      { id: 3024, enunciado: 'Darwin y Wallace postularon independientemente la:', alternativas: { A: 'Generación espontánea.', B: 'Selección Natural.', C: 'Panspermia.', D: 'Fijismo.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Mecanismo central de la evolución.' }
    ]
  },
  {
    id: 'test-cbio-3-9',
    seccionId: 'sec-cbio-3-9',
    preguntas: [
      { id: 3025, enunciado: 'La selección natural actúa directamente sobre:', alternativas: { A: 'Los genes.', B: 'El fenotipo de los individuos.', C: 'El clima.', D: 'Las rocas.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Los rasgos visibles determinan el éxito.' },
      { id: 3026, enunciado: 'Para que haya selección natural, debe existir:', alternativas: { A: 'Clones.', B: 'Variabilidad genética en la población.', C: 'Ambiente inmutable.', D: 'Inmortalidad.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Sin diferencias no hay qué seleccionar.' },
      { id: 3027, enunciado: 'La adecuación biológica (fitness) se mide por:', alternativas: { A: 'Fuerza física.', B: 'Éxito reproductivo.', C: 'Velocidad.', D: 'Inteligencia.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Cuantos descendientes dejas.' }
    ]
  },
  {
    id: 'test-cbio-3-10',
    seccionId: 'sec-cbio-3-10',
    preguntas: [
      { id: 3028, enunciado: 'Proceso que ocurre en Mitosis pero NO en Meiosis:', respuesta_correcta: 'D', alternativas: { A: 'Duplicación ADN.', B: 'Formación de huso.', C: 'División nuclear.', D: 'Producción de clones idénticos.' }, feedback_acierto: '¡Correcto!', feedback_error: 'Meiosis busca variabilidad.' },
      { id: 3029, enunciado: 'Evidencia evolutiva basada en el desarrollo temprano de embriones:', respuesta_correcta: 'B', alternativas: { A: 'Fósil.', B: 'Embriológica.', C: 'Bioquímica.', D: 'Geográfica.' }, feedback_acierto: '¡Exacto!', feedback_error: 'Similitudes en etapas iniciales.' },
      { id: 3030, enunciado: 'Aporte de la Biología Molecular a la evolución:', respuesta_correcta: 'C', alternativas: { A: 'Ver huesos.', B: 'Mirar capas tierra.', C: 'Comparar secuencias de ADN/Proteínas.', D: 'Estudiar climas.' }, feedback_acierto: '¡Bien!', feedback_error: 'Parentesco a nivel químico.' },
      { id: 3031, enunciado: 'Etapa del ciclo celular donde la célula "decide" si dividirse:', respuesta_correcta: 'A', alternativas: { A: 'Punto de control G1.', B: 'Anafase.', C: 'Fase S.', D: 'G2.' }, feedback_acierto: '¡Correcto!', feedback_error: 'Primer checkpoint importante.' },
      { id: 3032, enunciado: 'Consecuencia de la meiosis en la especie:', respuesta_correcta: 'C', alternativas: { A: 'Extinción.', B: 'Uniformidad.', C: 'Variabilidad genética.', D: 'Aumento de tamaño.' }, feedback_acierto: '¡Exacto!', feedback_error: 'Mezcla de genes.' },
      { id: 3033, enunciado: 'Órganos análogos resultan de:', respuesta_correcta: 'B', alternativas: { A: 'Ancestro común.', B: 'Convergencia evolutiva.', C: 'Mismo gen.', D: 'Azar puro.' }, feedback_acierto: '¡Bien!', feedback_error: 'Misma función, distinto origen.' },
      { id: 3034, enunciado: 'La selección natural es un proceso:', respuesta_correcta: 'B', alternativas: { A: 'Azaroso.', B: 'No azaroso (determinístico según éxito).', C: 'Instantáneo.', D: 'Voluntario.' }, feedback_acierto: '¡Correcto!', feedback_error: 'Depende del ajuste al ambiente.' },
      { id: 3035, enunciado: 'Un alimento transgénico contiene:', respuesta_correcta: 'C', alternativas: { A: 'Mucho azúcar.', B: 'Bacterias vivas.', C: 'ADN foráneo insertado.', D: 'Solo químicos.' }, feedback_acierto: '¡Bien!', feedback_error: 'Modificación genética directa.' },
      { id: 3036, enunciado: '¿Qué etapa de la mitosis es la más corta?', respuesta_correcta: 'A', alternativas: { A: 'Anafase.', B: 'Profase.', C: 'Metafase.', D: 'Telofase.' }, feedback_acierto: '¡Exacto!', feedback_error: 'Separación rápida.' },
      { id: 3037, enunciado: 'La teoría sintética de la evolución integra:', respuesta_correcta: 'C', alternativas: { A: 'Lamarck y Darwin.', B: 'Religión y Ciencia.', C: 'Darwinismo y Genética.', D: 'Big Bang y Evolución.' }, feedback_acierto: '¡Excelente!', feedback_error: 'Neodarwinismo.' }
    ]
  },

  // --- BIOLOGÍA: ORGANISMO Y AMBIENTE ---
  {
    id: 'test-cbio-4-1',
    seccionId: 'sec-cbio-4-1',
    preguntas: [
      { id: 4001, enunciado: 'Los organismos que producen su propio alimento usando luz se llaman:', alternativas: { A: 'Heterótrofos.', B: 'Fotoautótrofos.', C: 'Quimioheterótrofos.', D: 'Descomponedores.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Luz + Auto (propio) + Trofo (alimento).' },
      { id: 4002, enunciado: '¿Cuál es el rol de los descomponedores en el ecosistema?', alternativas: { A: 'Fijar CO2.', B: 'Reciclar materia orgánica a inorgánica.', C: 'Producir O2.', D: 'Consumir productores.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Cierran el ciclo de la materia.' },
      { id: 4003, enunciado: 'La nutrición heterótrofa consiste en:', alternativas: { A: 'Hacer fotosíntesis.', B: 'Obtener energía de materia orgánica ya formada.', C: 'Vivir del aire.', D: 'No comer.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Ejemplo: animales y hongos.' }
    ]
  },
  {
    id: 'test-cbio-4-2',
    seccionId: 'sec-cbio-4-2',
    preguntas: [
      { id: 4004, enunciado: '¿En qué estructura del cloroplasto ocurre la etapa clara?', alternativas: { A: 'Estroma.', B: 'Tilacoides.', C: 'Membrana externa.', D: 'Matriz.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Donde están los fotosistemas.' },
      { id: 4005, enunciado: 'La fotólisis del agua produce:', alternativas: { A: 'CO2.', B: 'O2, electrones y protones.', C: 'Glucosa.', D: 'Almidón.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'El oxígeno que respiramos viene del agua.' },
      { id: 4006, enunciado: 'Aumento de turbidez en humedales afecta la etapa clara debido a:', alternativas: { A: 'Falta de CO2.', B: 'Menor llegada de luz a las plantas acuáticas.', C: 'Mucha sal.', D: 'Falta de agua.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'La luz es el insumo de esta fase.' }
    ]
  },
  {
    id: 'test-cbio-4-3',
    seccionId: 'sec-cbio-4-3',
    preguntas: [
      { id: 4007, enunciado: 'El Ciclo de Calvin tiene como objetivo principal:', alternativas: { A: 'Liberar O2.', B: 'Fijar CO2 para producir glucosa.', C: 'Romper agua.', D: 'Producir ATP.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Etapa independiente de la luz.' },
      { id: 4008, enunciado: '¿Dónde ocurre la etapa oscura de la fotosíntesis?', alternativas: { A: 'Grana.', B: 'Estroma.', C: 'Citoplasma.', D: 'Mitocondria.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Espacio fluido del cloroplasto.' },
      { id: 4009, enunciado: 'Experimento con CO2 radiactivo permite ver que el carbono termina en:', alternativas: { A: 'El O2 liberado.', B: 'La glucosa/almidón.', C: 'El agua.', D: 'La clorofila.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Fijación del carbono.' }
    ]
  },
  {
    id: 'test-cbio-4-4',
    seccionId: 'sec-cbio-4-4',
    preguntas: [
      { id: 4010, enunciado: 'Si un alga a 8°C no produce O2, la causa probable es:', alternativas: { A: 'Mucha luz.', B: 'Inactividad enzimática por baja temperatura.', C: 'Falta de CO2.', D: 'Mucha humedad.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Las enzimas fotosintéticas tienen rangos óptimos.' },
      { id: 4011, enunciado: 'A mayor intensidad lumínica (sin llegar al punto de saturación), la fotosíntesis:', alternativas: { A: 'Baja.', B: 'Aumenta.', C: 'Se detiene.', D: 'No cambia.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'La luz es energía para el proceso.' },
      { id: 4012, enunciado: '¿Qué ocurre si se bloquean totalmente los estomas de una planta?', alternativas: { A: 'Sube la fotosíntesis.', B: 'Baja la producción de almidón por falta de CO2.', C: 'La planta crece más.', D: 'No pasa nada.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Se corta el suministro de gas.' }
    ]
  },
  {
    id: 'test-cbio-4-5',
    seccionId: 'sec-cbio-4-5',
    preguntas: [
      { id: 4013, enunciado: 'El punto de compensación (Pc) es cuando:', alternativas: { A: 'La planta muere.', B: 'Fotosíntesis = Respiración.', C: 'No hay CO2.', D: 'Es de noche.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'El consumo de O2 iguala su producción.' },
      { id: 4014, enunciado: 'La respiración celular ocurre principalmente en:', alternativas: { A: 'Cloroplastos.', B: 'Mitocondrias.', C: 'Lisosomas.', D: 'Núcleo.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Central de energía.' },
      { id: 4015, enunciado: 'En el ciclo del carbono, las plantas actúan como:', alternativas: { A: 'Fuentes de CO2.', B: 'Sumideros de CO2 (lo captan).', C: 'Productores de carbón mineral.', D: 'Solo consumidores.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Limpian la atmósfera.' }
    ]
  },
  {
    id: 'test-cbio-4-6',
    seccionId: 'sec-cbio-4-6',
    preguntas: [
      { id: 4016, enunciado: 'El flujo de energía en un ecosistema es:', alternativas: { A: 'Cíclico.', B: 'Unidireccional y abierto.', C: 'Infinito.', D: 'Cerrado.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Se pierde calor en cada paso.', feedback_error: 'La energía no se recicla.' },
      { id: 4017, enunciado: 'En una cadena trófica, la mayor energía disponible está en:', alternativas: { A: 'Consumidores primarios.', B: 'Productores.', C: 'Superdepredadores.', D: 'Descomponedores.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Son la base de la pirámide.' },
      { id: 4018, enunciado: 'Si E1, E2 y E3 son vegetales, la energía que entra al sistema proviene de:', alternativas: { A: 'El suelo.', B: 'El Sol.', C: 'La lluvia.', D: 'El viento.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Fuente primaria universal.' }
    ]
  },
  {
    id: 'test-cbio-4-7',
    seccionId: 'sec-cbio-4-7',
    preguntas: [
      { id: 4019, enunciado: 'La regla del 10% indica que:', alternativas: { A: 'Solo el 10% de la energía pasa al siguiente nivel trófico.', B: 'El 90% se almacena.', C: 'Las plantas son el 10% del planeta.', D: 'El CO2 es el 10% del aire.' }, respuesta_correcta: 'A', feedback_acierto: '¡Correcto!', feedback_error: 'La mayor parte se gasta en vivir.' },
      { id: 4020, enunciado: 'La biomasa de un ecosistema es:', alternativas: { A: 'El volumen de agua.', B: 'La cantidad total de materia viva.', C: 'La cantidad de rocas.', D: 'El aire.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Peso seco de organismos.' },
      { id: 4021, enunciado: '¿Qué nivel trófico tiene menor biomasa generalmente?', alternativas: { A: 'Productores.', B: 'Consumidores Terciarios.', C: 'Consumidores Primarios.', D: 'Herbívoros.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Pirámide de biomasa.' }
    ]
  },
  {
    id: 'test-cbio-4-8',
    seccionId: 'sec-cbio-4-8',
    preguntas: [
      { id: 4022, enunciado: 'La turbidez del agua en humedales reduce principalmente la:', alternativas: { A: 'Erosión.', B: 'Productividad primaria (fotosíntesis).', C: 'Salinidad.', D: 'Temperatura.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Menos luz = menos comida.' },
      { id: 4023, enunciado: 'Un humedal actúa como:', alternativas: { A: 'Desierto.', B: 'Filtro natural y reserva de biodiversidad.', C: 'Fuente de contaminación.', D: 'Zona inerte.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Ecosistema vital.' },
      { id: 4024, enunciado: 'El aumento de sólidos en suspensión suele deberse a:', alternativas: { A: 'Mucha lluvia limpia.', B: 'Erosión de suelos cercanos.', C: 'Exceso de peces.', D: 'Plantas acuáticas.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Arrastre de sedimentos.' }
    ]
  },
  {
    id: 'test-cbio-4-9',
    seccionId: 'sec-cbio-4-9',
    preguntas: [
      { id: 4025, enunciado: 'Principal causa antrópica del aumento del efecto invernadero:', alternativas: { A: 'Fotosíntesis excesiva.', B: 'Quema de combustibles fósiles.', C: 'Uso de bicicletas.', D: 'Reforestación.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Libera CO2 almacenado por milenios.' },
      { id: 4026, enunciado: 'La deforestación reduce la capacidad del ecosistema para:', alternativas: { A: 'Aumentar el calor.', B: 'Fijar CO2 y producir O2.', C: 'Erosionar el suelo.', D: 'Inundarse.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Se pierden los "pulmones" verdes.' },
      { id: 4027, enunciado: 'Un efecto del cambio climático en los océanos es:', alternativas: { A: 'Baja del nivel del mar.', B: 'Acidificación y aumento de temperatura.', C: 'Más peces.', D: 'Congelamiento total.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Afecta arrecifes y fauna.' }
    ]
  },
  {
    id: 'test-cbio-4-10',
    seccionId: 'sec-cbio-4-10',
    preguntas: [
      { id: 4028, enunciado: 'Origen del O2 producido en la fotosíntesis:', respuesta_correcta: 'C', alternativas: { A: 'CO2.', B: 'Glucosa.', C: 'H2O.', D: 'Clorofila.' }, feedback_acierto: '¡Correcto!', feedback_error: 'Viene de la fotólisis del agua.' },
      { id: 4029, enunciado: 'Factor que NO limita directamente la fotosíntesis:', respuesta_correcta: 'D', alternativas: { A: 'Luz.', B: 'CO2.', C: 'Temperatura.', D: 'Nitrógeno atmosférico.' }, feedback_acierto: '¡Exacto!', feedback_error: 'No se usa N2 gaseoso.' },
      { id: 4030, enunciado: 'Relación entre Fotosíntesis y Respiración:', respuesta_correcta: 'C', alternativas: { A: 'Son iguales.', B: 'No se relacionan.', C: 'Son procesos complementarios (ciclo O2/CO2).', D: 'Una anula a la otra.' }, feedback_acierto: '¡Bien!', feedback_error: 'Los productos de una son reactantes de otra.' },
      { id: 4031, enunciado: 'Energía que se pierde en cada nivel trófico:', respuesta_correcta: 'B', alternativas: { A: '10%.', B: '90% (aprox).', C: '0%.', D: '100%.' }, feedback_acierto: '¡Correcto!', feedback_error: 'Se pierde como calor.' },
      { id: 4032, enunciado: 'Conclusión sobre biomasa en pirámides terrestres:', respuesta_correcta: 'A', alternativas: { A: 'Disminuye al subir de nivel.', B: 'Aumenta al subir.', C: 'Es constante.', D: 'Es azarosa.' }, feedback_acierto: '¡Exacto!', feedback_error: 'Menos materia viva arriba.' },
      { id: 4033, enunciado: 'Efecto de la turbidez en la cadena alimentaria:', respuesta_correcta: 'B', alternativas: { A: 'Más peces.', B: 'Colapso de base productora.', C: 'Agua más limpia.', D: 'Más luz.' }, feedback_acierto: '¡Bien!', feedback_error: 'Sin plantas no hay herbívoros.' },
      { id: 4034, enunciado: 'Gas necesario para el Ciclo de Calvin:', respuesta_correcta: 'B', alternativas: { A: 'O2.', B: 'CO2.', C: 'N2.', D: 'CH4.' }, feedback_acierto: '¡Correcto!', feedback_error: 'Fijación de carbono.' },
      { id: 4035, enunciado: 'La productividad primaria neta es:', respuesta_correcta: 'B', alternativas: { A: 'Toda la energía solar.', B: 'Energía fijada menos respiración.', C: 'Solo el calor.', D: 'Materia muerta.' }, feedback_acierto: '¡Exacto!', feedback_error: 'Lo que queda para los consumidores.' },
      { id: 4036, enunciado: 'Ecosistema que protege contra inundaciones y filtra agua:', respuesta_correcta: 'B', alternativas: { A: 'Montaña.', B: 'Humedal.', C: 'Pradera.', D: 'Desierto.' }, feedback_acierto: '¡Bien!', feedback_error: 'Esponjas naturales.' },
      { id: 4037, enunciado: 'Principal reserva de carbono en el ciclo rápido:', respuesta_correcta: 'A', alternativas: { A: 'Atmósfera (CO2).', B: 'Rocas.', C: 'Núcleo tierra.', D: 'Diamantes.' }, feedback_acierto: '¡Excelente!', feedback_error: 'Intercambio constante con seres vivos.' }
    ]
  },

  // --- MÓDULOS DE CIENCIAS: QUÍMICA ---
  // --- CAP 1: ESTRUCTURA ATÓMICA ---
  {
    id: 'test-cqui-1-1',
    seccionId: 'sec-cqui-1-1',
    preguntas: [
      { id: 6001, enunciado: 'Una mezcla en la que no se pueden distinguir sus componentes a simple vista se clasifica como:', alternativas: { A: 'Mezcla heterogénea.', B: 'Mezcla homogénea.', C: 'Sustancia pura.', D: 'Elemento.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Ejemplo: el aire o agua con sal disuelta.', feedback_error: 'Si es uniforme, es homogénea.' },
      { id: 6002, enunciado: '¿Cuál de las siguientes es una sustancia pura compuesta?', alternativas: { A: 'Hierro (Fe).', B: 'Oxígeno (O2).', C: 'Agua (H2O).', D: 'Bronce.' }, respuesta_correcta: 'C', feedback_acierto: '¡Exacto! El agua tiene dos tipos de átomos unidos químicamente.', feedback_error: 'Un compuesto tiene diferentes elementos unidos.' },
      { id: 6003, enunciado: 'El NaCl sólido disuelto totalmente en agua forma una:', alternativas: { A: 'Mezcla heterogénea.', B: 'Disolución (homogénea).', C: 'Nueva sustancia pura.', D: 'Suspensión.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Es una mezcla uniforme.' }
    ]
  },
  {
    id: 'test-cqui-1-2',
    seccionId: 'sec-cqui-1-2',
    preguntas: [
      { id: 6004, enunciado: 'Método para separar arena de agua aprovechando la densidad superior de la arena:', alternativas: { A: 'Filtración.', B: 'Decantación.', C: 'Destilación.', D: 'Tamizado.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! La gravedad hace el trabajo.', feedback_error: 'Se basa en la sedimentación.' },
      { id: 6005, enunciado: 'En el proceso de potabilización, los floculantes se usan para:', alternativas: { A: 'Matar bacterias.', B: 'Atrapar partículas pequeñas en flóculos pesados.', C: 'Cambiar el sabor.', D: 'Evaporar el agua.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Facilitan la decantación posterior.' },
      { id: 6006, enunciado: '¿Qué método es más adecuado para separar dos líquidos con distinto punto de ebullición?', alternativas: { A: 'Tamizado.', B: 'Destilación.', C: 'Filtración.', D: 'Sublimación.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Aprovecha la volatilidad.' }
    ]
  },
  {
    id: 'test-cqui-1-3',
    seccionId: 'sec-cqui-1-3',
    preguntas: [
      { id: 6007, enunciado: 'Si el metal T tiene densidad 11,3 g/cm3 y ocupa 6,0 cm3, su masa es:', alternativas: { A: '17,3 g.', B: '67,8 g.', C: '1,88 g.', D: '5,3 g.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! m = d * v.', feedback_error: 'Multiplica densidad por volumen.' },
      { id: 6008, enunciado: 'El cambio de estado de gas a líquido se denomina:', alternativas: { A: 'Evaporación.', B: 'Condensación.', C: 'Fusión.', D: 'Solidificación.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Como el vapor de agua en un espejo.' },
      { id: 6009, enunciado: 'A temperatura ambiente, una sustancia con punto de fusión de -7°C y ebullición de 58°C está en estado:', alternativas: { A: 'Sólido.', B: 'Líquido.', C: 'Gaseoso.', D: 'Plasma.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! El ambiente (25°C) está entre ambos puntos.', feedback_error: 'Compara la temperatura ambiente con los puntos de cambio.' }
    ]
  },
  {
    id: 'test-cqui-1-4',
    seccionId: 'sec-cqui-1-4',
    preguntas: [
      { id: 6010, enunciado: '¿Quién propuso que el átomo era una esfera maciza e indivisible?', alternativas: { A: 'Thomson.', B: 'Dalton.', C: 'Rutherford.', D: 'Bohr.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! El primer modelo atómico moderno.', feedback_error: 'Fue el postulado de la teoría atómica.' },
      { id: 6011, enunciado: 'El modelo de "budín de pasas" con electrones incrustados pertenece a:', alternativas: { A: 'Rutherford.', B: 'Thomson.', C: 'Bohr.', D: 'Schrödinger.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! Descubridor del electrón.', feedback_error: 'Supuso una masa positiva con cargas negativas.' },
      { id: 6012, enunciado: 'Thomson utilizó tubos de rayos catódicos para descubrir:', alternativas: { A: 'El núcleo.', B: 'El electrón.', C: 'El neutrón.', D: 'El protón.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Partículas con carga negativa.' }
    ]
  },
  {
    id: 'test-cqui-1-5',
    seccionId: 'sec-cqui-1-5',
    preguntas: [
      { id: 6013, enunciado: 'Rutherford bombardeó una lámina de oro con partículas alfa y concluyó que:', alternativas: { A: 'El átomo es macizo.', B: 'El átomo es mayormente espacio vacío con un núcleo denso.', C: 'Los electrones están fijos.', D: 'No hay núcleo.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Casi todas las partículas atravesaron la lámina.', feedback_error: 'El desvío de pocas partículas reveló el núcleo.' },
      { id: 6014, enunciado: 'Las partículas alfa usadas por Rutherford tenían carga:', alternativas: { A: 'Negativa.', B: 'Positiva.', C: 'Neutra.', D: 'Variable.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! Son núcleos de helio.', feedback_error: 'Se repelían con el núcleo positivo.' },
      { id: 6015, enunciado: 'Inferencia correcta del experimento de Rutherford:', alternativas: { A: 'El núcleo ocupa todo el volumen.', B: 'El núcleo es muy pequeño y positivo.', C: 'Los electrones están en el núcleo.', D: 'Los neutrones orbitan.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Concentra casi toda la masa.' }
    ]
  },
  {
    id: 'test-cqui-1-6',
    seccionId: 'sec-cqui-1-6',
    preguntas: [
      { id: 6016, enunciado: 'Bohr propuso que los electrones giran en:', alternativas: { A: 'Nubes difusas.', B: 'Órbitas circulares de energía definida.', C: 'El interior del núcleo.', D: 'Líneas rectas.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Niveles de energía estacionarios.', feedback_error: 'Cuantización de la energía.' },
      { id: 6017, enunciado: 'Cuando un electrón salta de un nivel de mayor energía a uno menor:', alternativas: { A: 'Absorbe energía.', B: 'Libera energía (fotón).', C: 'Aumenta su masa.', D: 'Se destruye.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! Produce espectros de emisión.', feedback_error: 'La diferencia de energía se emite como luz.' },
      { id: 6018, enunciado: 'El error en un dibujo de un átomo con 5 protones y 5 electrones en el núcleo es:', alternativas: { A: 'Faltan neutrones.', B: 'Los electrones deben estar en orbitales externos.', C: 'Hay pocos protones.', D: 'El núcleo es muy grande.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! Los electrones orbitan el núcleo.', feedback_error: 'Cargas negativas fuera, positivas dentro.' }
    ]
  },
  {
    id: 'test-cqui-1-7',
    seccionId: 'sec-cqui-1-7',
    preguntas: [
      { id: 6019, enunciado: 'El número atómico (Z) representa la cantidad de:', alternativas: { A: 'Neutrones.', B: 'Protones.', C: 'Protones + Neutrones.', D: 'Electrones en un ión.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Define la identidad del elemento.', feedback_error: 'Es el número de identidad química.' },
      { id: 6020, enunciado: 'Un átomo con Z=11 y A=23 tiene:', alternativas: { A: '11 protones y 23 neutrones.', B: '11 protones y 12 neutrones.', C: '23 protones y 11 neutrones.', D: '11 protones y 11 neutrones.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! n = A - Z.', feedback_error: 'Neutrones = Masa - Protones.' },
      { id: 6021, enunciado: 'En un átomo neutro, la cantidad de protones es igual a la de:', alternativas: { A: 'Neutrones.', B: 'Electrones.', C: 'Positrones.', D: 'Núcleos.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! Las cargas se cancelan.', feedback_error: 'Carga total cero implica p+ = e-.' }
    ]
  },
  {
    id: 'test-cqui-1-8',
    seccionId: 'sec-cqui-1-8',
    preguntas: [
      { id: 6022, enunciado: 'Dos átomos son isótopos si tienen:', alternativas: { A: 'Mismo A, distinto Z.', B: 'Mismo Z, distinto A (distinto n).', C: 'Igual número de electrones.', D: 'Distinto elemento.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Ejemplo: Carbono-12 y Carbono-14.', feedback_error: 'Son el mismo elemento con distinta masa.' },
      { id: 6023, enunciado: 'Si el ión Li+ tiene Z=3, ¿cuántos electrones tiene?', alternativas: { A: '4.', B: '2.', C: '3.', D: '1.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! Perdió un electrón.', feedback_error: 'Carga positiva (+) significa pérdida de e-.' },
      { id: 6024, enunciado: 'El ión Cl- (Z=17) tiene:', alternativas: { A: '17 electrones.', B: '18 electrones.', C: '16 electrones.', D: '1 electron.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! Ganó un electrón.', feedback_error: 'Carga negativa (-) significa ganancia de e-.' }
    ]
  },
  {
    id: 'test-cqui-1-9',
    seccionId: 'sec-cqui-1-9',
    preguntas: [
      { id: 6025, enunciado: '¿Cuántos electrones de valencia tiene el Carbono (Z=6, grupo 14)?', alternativas: { A: '2.', B: '4.', C: '6.', D: '8.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Son los electrones del último nivel.', feedback_error: 'Mira el grupo de la tabla periódica.' },
      { id: 6026, enunciado: 'La regla del octeto establece que los átomos tienden a:', alternativas: { A: 'Tener 2 electrones.', B: 'Completar 8 electrones en su capa externa.', C: 'Perder todos sus electrones.', D: 'Tener 8 protones.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! Buscan estabilidad de gas noble.', feedback_error: 'Configuración s2p6.' },
      { id: 6027, enunciado: 'Un enlace iónico se forma típicamente entre:', alternativas: { A: 'Dos no metales.', B: 'Un metal y un no metal.', C: 'Dos metales.', D: 'Gases nobles.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! Transferencia de electrones.', feedback_error: 'Diferencia alta de electronegatividad.' }
    ]
  },
  {
    id: 'test-cqui-1-10',
    seccionId: 'sec-cqui-1-10',
    preguntas: [
      { id: 6028, enunciado: 'Inferencia de Rutherford sobre la lámina de oro:', respuesta_correcta: 'A', alternativas: { A: 'Átomo es principalmente vacío.', B: 'Núcleo es negativo.', C: 'Electrones en el núcleo.', D: 'Masa distribuida uniforme.' }, feedback_acierto: '¡Correcto!', feedback_error: 'Hito del modelo nuclear.' },
      { id: 6029, enunciado: 'Propiedad X que aumenta de NaF a NaI mientras Tf baja:', respuesta_correcta: 'B', alternativas: { A: 'Electronegatividad.', B: 'Radio atómico / Tamaño iónico.', C: 'Energía ionización.', D: 'Carácter metálico.' }, feedback_acierto: '¡Exacto!', feedback_error: 'Iones más grandes debilitan el enlace.' },
      { id: 6030, enunciado: 'Comparación de electrones: Cl- (Z=17) vs P3- (Z=15):', respuesta_correcta: 'B', alternativas: { A: 'Cl- tiene más.', B: 'Tienen los mismos (18).', C: 'P3- tiene 20.', D: 'Cl- tiene 16.' }, feedback_acierto: '¡Bien! Ambos son isoelectrónicos del Argón.', feedback_error: 'Suma cargas a Z.' },
      { id: 6031, enunciado: 'Los isótopos de Silicio se diferencian en:', respuesta_correcta: 'D', alternativas: { A: 'Z.', B: 'Protones.', C: 'Electrones.', D: 'Neutrones.' }, feedback_acierto: '¡Correcto!', feedback_error: 'Mismo elemento, distinta masa.' },
      { id: 6032, enunciado: 'Variable dependiente en el estudio de mezcla NaCl + solventes:', respuesta_correcta: 'C', alternativas: { A: 'Masa NaCl.', B: 'Volumen líquido.', C: 'Observación de solubilidad.', D: 'Tipo de tubo.' }, feedback_acierto: '¡Exacto!', feedback_error: 'Es lo que se observa tras la mezcla.' },
      { id: 6033, enunciado: 'Un ión con 13 protones y 10 electrones es:', respuesta_correcta: 'C', alternativas: { A: 'Anión (-3).', B: 'Neutro.', C: 'Catión (+3).', D: 'Isótopo.' }, feedback_acierto: '¡Bien! Al+3.', feedback_error: 'Sobra carga positiva.' },
      { id: 6034, enunciado: 'Estado de la sustancia U (Pf: 113°C, Pe: 184°C) a 25°C:', respuesta_correcta: 'A', alternativas: { A: 'Sólido.', B: 'Líquido.', C: 'Gaseoso.', D: 'Acuoso.' }, feedback_acierto: '¡Correcto! No ha llegado a fundirse.', feedback_error: '25 < 113.' },
      { id: 6035, enunciado: 'Metodología para separar alcohol de agua:', respuesta_correcta: 'D', alternativas: { A: 'Filtración.', B: 'Decantación.', C: 'Tamizado.', D: 'Destilación.' }, feedback_acierto: '¡Exacto!', feedback_error: 'Diferencia de Pe.' },
      { id: 6036, enunciado: 'Componente que define la identidad de un elemento:', respuesta_correcta: 'B', alternativas: { A: 'Masa A.', B: 'Número Z.', C: 'Neutrones.', D: 'Carga.' }, feedback_acierto: '¡Bien!', feedback_error: 'Z = protones.' },
      { id: 6037, enunciado: 'Modelo que introdujo los orbitales de energía:', respuesta_correcta: 'C', alternativas: { A: 'Dalton.', B: 'Thomson.', C: 'Bohr.', D: 'Rutherford.' }, feedback_acierto: '¡Excelente!', feedback_error: 'Niveles cuantizados.' }
    ]
  },

  // --- CAP 2: QUÍMICA ORGÁNICA ---
  {
    id: 'test-cqui-2-1',
    seccionId: 'sec-cqui-2-1',
    preguntas: [
      { id: 6038, enunciado: 'La capacidad del carbono de formar 4 enlaces se llama:', alternativas: { A: 'Hibridación.', B: 'Tetravalencia.', C: 'Isomería.', D: 'Resonancia.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Fundamental en orgánica.', feedback_error: 'Viene de tener 4 e- de valencia.' },
      { id: 6039, enunciado: 'Hibridación del carbono en el metano (CH4):', alternativas: { A: 'sp.', B: 'sp2.', C: 'sp3.', D: 'dsp2.' }, respuesta_correcta: 'C', feedback_acierto: '¡Exacto! Geometría tetraédrica.', feedback_error: '4 enlaces simples.' },
      { id: 6040, enunciado: 'Un carbono con hibridación sp2 forma geometría:', alternativas: { A: 'Lineal.', B: 'Trigonal plana.', C: 'Tetraédrica.', D: 'Angular.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! Ángulos de 120°.', feedback_error: 'Asociada a enlaces dobles.' }
    ]
  },
  {
    id: 'test-cqui-2-2',
    seccionId: 'sec-cqui-2-2',
    preguntas: [
      { id: 6041, enunciado: 'El primer enlace que se forma entre dos átomos siempre es de tipo:', alternativas: { A: 'Pi.', B: 'Sigma.', C: 'Metálico.', D: 'Iónico.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Es el enlace frontal más fuerte.', feedback_error: 'Los enlaces pi son adicionales (laterales).' },
      { id: 6042, enunciado: 'Un enlace triple (C≡C) consiste en:', alternativas: { A: '3 enlaces sigma.', B: '1 sigma y 2 pi.', C: '2 sigma y 1 pi.', D: '3 enlaces pi.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Solo puede haber un sigma por par de átomos.' },
      { id: 6043, enunciado: 'Orden de longitud de enlace (de mayor a menor):', alternativas: { A: 'Triple > Doble > Simple.', B: 'Simple > Doble > Triple.', C: 'Doble > Simple > Triple.', D: 'Iguales.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! A más enlaces, más cerca los núcleos.', feedback_error: 'El simple es el más largo.' }
    ]
  },
  {
    id: 'test-cqui-2-3',
    seccionId: 'sec-cqui-2-3',
    preguntas: [
      { id: 6044, enunciado: 'Fórmula general de los alcanos:', alternativas: { A: 'CnH2n.', B: 'CnH2n+2.', C: 'CnH2n-2.', D: 'CnHn.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Son hidrocarburos saturados.', feedback_error: 'Cada carbono gasta sus enlaces en H.' },
      { id: 6045, enunciado: 'Nombre del alcano de 5 carbonos:', alternativas: { A: 'Etano.', B: 'Propano.', C: 'Butano.', D: 'Pentano.' }, respuesta_correcta: 'D', feedback_acierto: '¡Exacto! Prefijo penta-.', feedback_error: 'Met, Et, Prop, But, Pent...' },
      { id: 6046, enunciado: 'En un alcano ramificado, la cadena principal es:', alternativas: { A: 'La más corta.', B: 'La que tiene más carbonos continua.', C: 'La que está en línea recta.', D: 'Cualquiera.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! Regla IUPAC.', feedback_error: 'Debes contar el camino más largo.' }
    ]
  },
  {
    id: 'test-cqui-2-4',
    seccionId: 'sec-cqui-2-4',
    preguntas: [
      { id: 6047, enunciado: 'Hidrocarburo con al menos un enlace doble:', alternativas: { A: 'Alcano.', B: 'Alqueno.', C: 'Alquino.', D: 'Aromático.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Terminación -eno.', feedback_error: 'Eno = doble.' },
      { id: 6048, enunciado: 'El etino (acetileno) pertenece a los:', alternativas: { A: 'Alcanos.', B: 'Alquenos.', C: 'Alquinos.', D: 'Alcoholes.' }, respuesta_correcta: 'C', feedback_acierto: '¡Exacto! Tiene un enlace triple.', feedback_error: 'Ino = triple.' },
      { id: 6049, enunciado: '¿Qué propiedad física aumenta generalmente con el número de carbonos?', alternativas: { A: 'Solubilidad en agua.', B: 'Temperatura de ebullición.', C: 'Volatilidad.', D: 'Reactividad.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! Mayor masa molar y fuerzas de London.', feedback_error: 'Cadenas largas hierven a más temperatura.' }
    ]
  },
  {
    id: 'test-cqui-2-5',
    seccionId: 'sec-cqui-2-5',
    preguntas: [
      { id: 6050, enunciado: 'Grupo funcional característico de los alcoholes:', alternativas: { A: '-CHO.', B: '-OH (Hidroxilo).', C: '-COOH.', D: '-O-.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Ejemplo: Etanol.' },
      { id: 6051, enunciado: 'Los alcoholes de cadena corta son solubles en agua por:', alternativas: { A: 'Enlaces iónicos.', B: 'Puentes de hidrógeno.', C: 'Fuerzas de van der Waals.', D: 'Ser apolares.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! El grupo OH es polar.', feedback_error: 'Afinidad con el agua.' },
      { id: 6052, enunciado: 'Nombre del alcohol derivado del metano:', alternativas: { A: 'Metanal.', B: 'Metanol.', C: 'Metanoato.', D: 'Metil.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Terminación -ol.' }
    ]
  },
  {
    id: 'test-cqui-2-6',
    seccionId: 'sec-cqui-2-6',
    preguntas: [
      { id: 6053, enunciado: 'Estructura R-O-R corresponde a un:', alternativas: { A: 'Éster.', B: 'Éter.', C: 'Cetona.', D: 'Aldehído.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Ejemplo: H3C-O-CH2CH3.', feedback_error: 'Oxígeno puente entre dos carbonos.' },
      { id: 6054, enunciado: 'El grupo carbonilo (C=O) en una posición intermedia es una:', alternativas: { A: 'Aldehído.', B: 'Cetona.', C: 'Ácido.', D: 'Amida.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! Ejemplo: Propanona.', feedback_error: 'El aldehído lo tiene al final.' },
      { id: 6055, enunciado: 'Nombre del compuesto CH3-CO-CH3:', alternativas: { A: 'Etanal.', B: 'Propanona (Acetona).', C: 'Ácido acético.', D: 'Metanol.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: '3 carbonos y cetona.' }
    ]
  },
  {
    id: 'test-cqui-2-7',
    seccionId: 'sec-cqui-2-7',
    preguntas: [
      { id: 6056, enunciado: 'Grupo funcional terminal -CHO define a los:', alternativas: { A: 'Aldehídos.', B: 'Cetonas.', C: 'Alcoholes.', D: 'Éteres.' }, respuesta_correcta: 'A', feedback_acierto: '¡Correcto! Ejemplo: Formaldehído.', feedback_error: 'Carbonilo terminal.' },
      { id: 6057, enunciado: 'Grupo -COOH (carboxilo) caracteriza a los:', alternativas: { A: 'Ésteres.', B: 'Ácidos Carboxílicos.', C: 'Aldehídos.', D: 'Cetonas.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! Ejemplo: Ácido metanoico.', feedback_error: 'Formado por carbonilo e hidroxilo.' },
      { id: 6058, enunciado: 'El ácido presente en el vinagre es:', alternativas: { A: 'Ácido fórmico.', B: 'Ácido acético (etanoico).', C: 'Ácido butanoico.', D: 'Ácido clorhídrico.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Ácido de 2 carbonos.' }
    ]
  },
  {
    id: 'test-cqui-2-8',
    seccionId: 'sec-cqui-2-8',
    preguntas: [
      { id: 6059, enunciado: 'Producto de la reacción entre un ácido y un alcohol:', alternativas: { A: 'Éter.', B: 'Éster.', C: 'Amida.', D: 'Alcano.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Esterificación.', feedback_error: 'Da olores frutales.' },
      { id: 6060, enunciado: 'Grupo funcional con Nitrógeno unido al carbonilo (-CONH2):', alternativas: { A: 'Amina.', B: 'Amida.', C: 'Nitrilo.', D: 'Nitro.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! Importantes en proteínas.', feedback_error: 'Diferencia de Amina (sin C=O).' },
      { id: 6061, enunciado: 'Los aromas de frutas se deben frecuentemente a los:', alternativas: { A: 'Ácidos.', B: 'Ésteres.', C: 'Alcoholes.', D: 'Alcanos.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Sustancias volátiles y olorosas.' }
    ]
  },
  {
    id: 'test-cqui-2-9',
    seccionId: 'sec-cqui-2-9',
    preguntas: [
      { id: 6062, enunciado: 'Representación que muestra solo líneas y vértices:', alternativas: { A: 'Desarrollada.', B: 'Topológica (lineal).', C: 'Condensada.', D: 'Empírica.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Cada vértice es un Carbono.', feedback_error: 'Forma de zig-zag.' },
      { id: 6063, enunciado: 'Un modelo de "esferas y varillas" es útil para ver:', alternativas: { A: 'Solo la fórmula.', B: 'La disposición espacial y ángulos.', C: 'La masa molar.', D: 'El color real.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Muestra la geometría 3D.' },
      { id: 6064, enunciado: '¿Cuántos hidrógenos tiene una molécula de benceno (C6H6)?', alternativas: { A: '12.', B: '6.', C: '14.', D: '8.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! Ciclo aromático.', feedback_error: 'Un H por cada C.' }
    ]
  },
  {
    id: 'test-cqui-2-10',
    seccionId: 'sec-cqui-2-10',
    preguntas: [
      { id: 6065, enunciado: 'Hibridación que permite enlaces dobles (C=C):', respuesta_correcta: 'B', alternativas: { A: 'sp.', B: 'sp2.', C: 'sp3.', D: 'd2sp3.' }, feedback_acierto: '¡Correcto!', feedback_error: 'Forma 1 pi y 3 sigma.' },
      { id: 6066, enunciado: 'Molécula H3C-O-CH2-CH3 es un:', respuesta_correcta: 'C', alternativas: { A: 'Alcohol.', B: 'Cetona.', C: 'Éter.', D: 'Éster.' }, feedback_acierto: '¡Exacto!', feedback_error: 'Oxígeno entre radicales.' },
      { id: 6067, enunciado: 'Orden de ebullición: Pentano vs 2-metilbutano vs 2,2-dimetilpropano:', respuesta_correcta: 'B', alternativas: { A: 'Lineal < Ramificado.', B: 'Lineal > Ramificado.', C: 'Iguales.', D: 'Azaroso.' }, feedback_acierto: '¡Bien! Menor ramificación = mayor superficie de contacto.', feedback_error: 'Las ramas bajan el punto de ebullición.' },
      { id: 6068, enunciado: 'Enlace sigma vs pi en una molécula de eteno (C2H4):', respuesta_correcta: 'C', alternativas: { A: '1 sigma, 1 pi.', B: '4 sigma, 1 pi.', C: '5 sigma, 1 pi.', D: '6 sigma, 0 pi.' }, feedback_acierto: '¡Exacto! 4 C-H (sigma) y 1 C=C (1 sigma + 1 pi).', feedback_error: 'Cuenta todos los enlaces simples.' },
      { id: 6069, enunciado: 'Un aldehído se reconoce por el grupo:', respuesta_correcta: 'B', alternativas: { A: '-OH.', B: '-CHO.', C: '-CO-.', D: '-COO-.' }, feedback_acierto: '¡Correcto!', feedback_error: 'Carbonilo terminal.' },
      { id: 6070, enunciado: 'Fórmula molecular del ciclohexano:', respuesta_correcta: 'B', alternativas: { A: 'C6H14.', B: 'C6H12.', C: 'C6H6.', D: 'C6H10.' }, feedback_acierto: '¡Bien! Pierde 2 H al cerrar el ciclo.', feedback_error: 'CnH2n para cicloalcanos.' },
      { id: 6071, enunciado: '¿Qué molécula tiene menor longitud de enlace C-C?', respuesta_correcta: 'C', alternativas: { A: 'Etano.', B: 'Eteno.', C: 'Etino.', D: 'Propano.' }, feedback_acierto: '¡Correcto! El triple enlace es el más corto.', feedback_error: 'Aumenta el orden de enlace, baja la longitud.' },
      { id: 6072, enunciado: 'La hibridación sp3 forma ángulos de:', respuesta_correcta: 'B', alternativas: { A: '180°.', B: '109,5°.', C: '120°.', D: '90°.' }, feedback_acierto: '¡Exacto! Tetraedro regular.', feedback_error: 'Ángulo típico de alcanos.' },
      { id: 6073, enunciado: 'El grupo funcional -NH2 corresponde a:', respuesta_correcta: 'A', alternativas: { A: 'Amina.', B: 'Amida.', C: 'Nitrilo.', D: 'Nitro.' }, feedback_acierto: '¡Bien!', feedback_error: 'Derivado del amoniaco.' },
      { id: 6074, enunciado: 'Representación tridimensional que distingue isómeros espaciales:', respuesta_correcta: 'B', alternativas: { A: 'Condensada.', B: 'Esferas y varillas.', C: 'Empírica.', D: 'Molecular.' }, feedback_acierto: '¡Excelente!', feedback_error: 'Muestra la orientación real.' }
    ]
  },

  // --- CAP 3: REACCIONES Y ESTEQUIOMETRÍA ---
  {
    id: 'test-cqui-3-1',
    seccionId: 'sec-cqui-3-1',
    preguntas: [
      { id: 6075, enunciado: '¿Cuál de estos es un cambio químico?', alternativas: { A: 'Fusión del hielo.', B: 'Oxidación de un clavo.', C: 'Evaporación de alcohol.', D: 'Romper un papel.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Se forma una nueva sustancia (óxido).', feedback_error: 'Un cambio químico altera la identidad de la materia.' },
      { id: 6076, enunciado: 'El burbujeo al mezclar bicarbonato y vinagre indica:', alternativas: { A: 'Cambio físico.', B: 'Reacción química (liberación de gas).', C: 'Sublimación.', D: 'Ebullición.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! Formación de CO2.', feedback_error: 'Se están rompiendo y formando enlaces.' },
      { id: 6077, enunciado: 'La ley de conservación de la masa dice que en una reacción:', alternativas: { A: 'Se crea materia.', B: 'La masa de reactantes = masa de productos.', C: 'La masa disminuye.', D: 'Los átomos desaparecen.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! Lavoisier.', feedback_error: 'Nada se pierde, todo se transforma.' }
    ]
  },
  {
    id: 'test-cqui-3-2',
    seccionId: 'sec-cqui-3-2',
    preguntas: [
      { id: 6078, enunciado: 'Para formar un compuesto, los elementos se unen en proporciones de masa fijas. Esto es:', alternativas: { A: 'Ley de Lavoisier.', B: 'Ley de Proust (Proporciones Definidas).', C: 'Ley de Dalton.', D: 'Ley de Newton.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'La composición es constante.' },
      { id: 6079, enunciado: 'Si 2g de X reaccionan con 1,5g de Y para dar 3,5g de producto, se cumple:', alternativas: { A: 'Solo Proust.', B: 'Ley de Conservación de Masa.', C: 'Que sobra X.', D: 'Que falta Y.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! 2 + 1,5 = 3,5.', feedback_error: 'Suma de masas de entrada y salida.' },
      { id: 6080, enunciado: 'La ley de las proporciones múltiples fue propuesta por:', alternativas: { A: 'Proust.', B: 'Dalton.', C: 'Lavoisier.', D: 'Thomson.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Cuando forman más de un compuesto.' }
    ]
  },
  {
    id: 'test-cqui-3-3',
    seccionId: 'sec-cqui-3-3',
    preguntas: [
      { id: 6081, enunciado: 'Un mol de cualquier sustancia contiene:', alternativas: { A: '1000 átomos.', B: '6,022 x 10^23 entidades.', C: '1 gramo.', D: '22,4 litros siempre.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Número de Avogadro.', feedback_error: 'Es la constante de mol.' },
      { id: 6082, enunciado: 'La masa molar del H2O (H=1, O=16) es:', alternativas: { A: '17 g/mol.', B: '18 g/mol.', C: '33 g/mol.', D: '16 g/mol.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! 2(1) + 16 = 18.', feedback_error: 'Suma las masas de todos los átomos.' },
      { id: 6083, enunciado: '¿Cuántos moles hay en 36g de agua?', alternativas: { A: '1 mol.', B: '2 mol.', C: '0,5 mol.', D: '18 mol.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! 36 / 18 = 2.', feedback_error: 'n = masa / MasaMolar.' }
    ]
  },
  {
    id: 'test-cqui-3-4',
    seccionId: 'sec-cqui-3-4',
    preguntas: [
      { id: 6084, enunciado: 'En la ecuación balanceada: q H2 + O2 -> r H2O, los valores de q y r son:', alternativas: { A: '1, 1.', B: '2, 2.', C: '1, 2.', D: '2, 1.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! 4 H y 2 O en ambos lados.', feedback_error: 'Asegura que haya igual número de átomos.' },
      { id: 6085, enunciado: 'Coeficientes para: Cu(NO3)2 + q NaOH -> r NaNO3 + Cu(OH)2:', alternativas: { A: '1, 1.', B: '2, 2.', C: '2, 1.', D: '1, 2.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! Se necesitan 2 OH y 2 Na.', feedback_error: 'Mira los grupos NO3 y OH.' },
      { id: 6086, enunciado: 'Un balanceo correcto garantiza que se cumpla la ley de:', alternativas: { A: 'Proust.', B: 'Conservación de la materia.', C: 'Gases ideales.', D: 'Octeto.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Los átomos no se crean ni destruyen.' }
    ]
  },
  {
    id: 'test-cqui-3-5',
    seccionId: 'sec-cqui-3-5',
    preguntas: [
      { id: 6087, enunciado: 'Si 1 mol de N2 reacciona con 3 mol de H2 para dar 2 mol de NH3, ¿cuántos moles de NH3 dan 0,5 mol de N2?', alternativas: { A: '0,5 mol.', B: '1,0 mol.', C: '2,0 mol.', D: '1,5 mol.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Relación 1:2.', feedback_error: 'Usa la proporción estequiométrica.' },
      { id: 6088, enunciado: '¿Masa de CO2 producida al quemar 12g de Carbono (C+O2->CO2)? (C=12, O=16):', alternativas: { A: '12g.', B: '44g.', C: '32g.', D: '28g.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! 1 mol C (12g) da 1 mol CO2 (44g).', feedback_error: 'Convierte masa a mol y luego a masa.' },
      { id: 6089, enunciado: 'Para obtener 4 mol de HNO3 a partir de N2O5 + H2O -> 2 HNO3, se requieren:', alternativas: { A: '1 mol N2O5.', B: '2 mol N2O5.', C: '4 mol N2O5.', D: '8 mol N2O5.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! Relación 1:2.', feedback_error: 'Mitad de N2O5 que de HNO3.' }
    ]
  },
  {
    id: 'test-cqui-3-6',
    seccionId: 'sec-cqui-3-6',
    preguntas: [
      { id: 6090, enunciado: 'La fórmula que indica la proporción más simple de átomos es la:', alternativas: { A: 'Molecular.', B: 'Empírica.', C: 'Estructural.', D: 'Desarrollada.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Ejemplo: CH2O para glucosa.', feedback_error: 'Es la mínima relación.' },
      { id: 6091, enunciado: 'Fórmula empírica del benceno (C6H6):', alternativas: { A: 'C2H2.', B: 'CH.', C: 'C3H3.', D: 'C6H6.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! Simplificando por 6.', feedback_error: 'Divide ambos subíndices por el máximo común divisor.' },
      { id: 6092, enunciado: 'Si un compuesto tiene 7g de N y 16g de O, su fórmula empírica (N=14, O=16) es:', alternativas: { A: 'NO.', B: 'NO2.', C: 'N2O.', D: 'N2O5.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! 0,5 mol N y 1 mol O -> 1:2.', feedback_error: 'Divide masa por masa molar para hallar moles.' }
    ]
  },
  {
    id: 'test-cqui-3-7',
    seccionId: 'sec-cqui-3-7',
    preguntas: [
      { id: 6093, enunciado: 'Para hallar la fórmula molecular a partir de la empírica se necesita:', alternativas: { A: 'El color.', B: 'La masa molar real del compuesto.', C: 'El volumen.', D: 'La presión.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! n = MasaReal / MasaEmpírica.', feedback_error: 'Relaciona las masas molares.' },
      { id: 6094, enunciado: 'Si la empírica es CH y la masa molar real es 78 g/mol (C=12, H=1), la molecular es:', alternativas: { A: 'C2H2.', B: 'C6H6.', C: 'C4H4.', D: 'C5H5.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! 78 / 13 = 6.', feedback_error: 'Multiplica la empírica por el factor calculado.' },
      { id: 6095, enunciado: 'Un compuesto con empírica HO y masa 34 g/mol es:', alternativas: { A: 'Agua (H2O).', B: 'Peróxido de Hidrógeno (H2O2).', C: 'Hidróxido.', D: 'Alcohol.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! (1+16)*2 = 34.', feedback_error: 'Comprueba la masa.' }
    ]
  },
  {
    id: 'test-cqui-3-8',
    seccionId: 'sec-cqui-3-8',
    preguntas: [
      { id: 6096, enunciado: 'El reactivo que se agota primero y limita la cantidad de producto es el:', alternativas: { A: 'En exceso.', B: 'Limitante.', C: 'Catalizador.', D: 'Inerte.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Determina el final de la reacción.' },
      { id: 6097, enunciado: 'Si reaccionan 0,1 mol de Fe y 0,1 mol de HCl (2 Fe + 6 HCl -> ...), el limitante es:', alternativas: { A: 'Fe.', B: 'HCl.', C: 'Ambos.', D: 'Ninguno.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! Se requiere 3 veces más HCl que Fe.', feedback_error: 'Compara moles disponibles vs necesarios.' },
      { id: 6098, enunciado: 'La cantidad de producto obtenida depende exclusivamente del:', alternativas: { A: 'Reactivo en exceso.', B: 'Reactivo limitante.', C: 'Recipiente.', D: 'Tiempo.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Él manda en el cálculo.' }
    ]
  },
  {
    id: 'test-cqui-3-9',
    seccionId: 'sec-cqui-3-9',
    preguntas: [
      { id: 6099, enunciado: 'El rendimiento porcentual se calcula como:', alternativas: { A: 'Teórico / Real * 100.', B: 'Real / Teórico * 100.', C: 'Suma / 2.', D: 'Masa / Vol.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Lo que obtuviste frente a lo ideal.' },
      { id: 6100, enunciado: 'Si el cálculo dice que obtendrás 100g pero solo obtienes 80g, el rendimiento es:', alternativas: { A: '100%.', B: '80%.', C: '20%.', D: '125%.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Realidad sobre teoría.' },
      { id: 6101, enunciado: 'Factores que bajan el rendimiento real:', alternativas: { A: 'Reacciones secundarias.', B: 'Impurezas.', C: 'Pérdidas al filtrar.', D: 'Todas las anteriores.' }, respuesta_correcta: 'D', feedback_acierto: '¡Bien! El mundo real no es ideal.', feedback_error: 'Muchos factores influyen.' }
    ]
  },
  {
    id: 'test-cqui-3-10',
    seccionId: 'sec-cqui-3-10',
    preguntas: [
      { id: 6102, enunciado: 'Variable dependiente en el estudio de precipitado (BaCl2 + Na2SO4):', respuesta_correcta: 'C', alternativas: { A: 'Masa BaCl2.', B: 'Tiempo.', C: 'Cantidad de BaSO4 formado.', D: 'Temperatura.' }, feedback_acierto: '¡Correcto!', feedback_error: 'Es el efecto medido.' },
      { id: 6103, enunciado: 'Fórmula empírica del compuesto con 28g de N y 48g de O (N=14, O=16):', respuesta_correcta: 'B', alternativas: { A: 'NO.', B: 'N2O3.', C: 'NO2.', D: 'N2O5.' }, feedback_acierto: '¡Exacto! 2 mol N y 3 mol O.', feedback_error: 'Divide masas por masas molares.' },
      { id: 6104, enunciado: 'Coeficientes q y r para: Cu(NO3)2 + 2 NaOH -> q NaNO3 + r Cu(OH)2:', respuesta_correcta: 'C', alternativas: { A: '1, 1.', B: '1, 2.', C: '2, 1.', D: '2, 2.' }, feedback_acierto: '¡Bien!', feedback_error: 'Iguala nitratos y sodio.' },
      { id: 6105, enunciado: 'Si 13,5g de Y dan 25,5g de X, 108g de Y darán:', respuesta_correcta: 'B', alternativas: { A: '102g.', B: '204g.', C: '51g.', D: '408g.' }, feedback_acierto: '¡Correcto! Relación lineal por Ley de Proust.', feedback_error: 'Usa una regla de tres.' },
      { id: 6106, enunciado: 'La formación de minúsculas gotas de agua al exhalar sobre un espejo es un:', respuesta_correcta: 'A', alternativas: { A: 'Cambio físico.', B: 'Cambio químico.', C: 'Balanceo.', D: 'Oxidación.' }, feedback_acierto: '¡Exacto! Es condensación.', feedback_error: 'No cambia la molécula de H2O.' },
      { id: 6107, enunciado: 'Ecuación balanceada para 2 X2 + Q2 -> 2 X2Q:', respuesta_correcta: 'B', alternativas: { A: 'X2 + Q2 -> XQ.', B: '2 X2 + Q2 -> 2 X2Q.', C: 'X + Q -> XQ.', D: '3 X2 + Q2 -> 3 XQ2.' }, feedback_acierto: '¡Bien! 4X y 2Q en ambos lados.', feedback_error: 'Verifica la cantidad de cada átomo.' },
      { id: 6108, enunciado: 'En 0,1 mol de Fe y 0,1 mol de HCl (2 Fe + 6 HCl), ¿cuánto Fe se consume?', respuesta_correcta: 'A', alternativas: { A: '0,033 mol.', B: '0,1 mol.', C: '0,05 mol.', D: '0,01 mol.' }, feedback_acierto: '¡Correcto! El HCl limita, y se consume 2/6 del HCl disponible.', feedback_error: 'Relación 2 Fe : 6 HCl.' },
      { id: 6109, enunciado: '¿Qué mide un cilindro graduado con émbolo móvil?', respuesta_correcta: 'B', alternativas: { A: 'Temperatura.', B: 'Volumen del gas.', C: 'Presión.', D: 'Masa.' }, feedback_acierto: '¡Exacto!', feedback_error: 'Es la variable dependiente si el émbolo se mueve.' },
      { id: 6110, enunciado: 'Masa de 1 mol de CO2:', respuesta_correcta: 'C', alternativas: { A: '12g.', B: '32g.', C: '44g.', D: '28g.' }, feedback_acierto: '¡Bien!', feedback_error: '12 + 2(16) = 44.' },
      { id: 6111, enunciado: 'Un gas que mantiene P constante cumple la ley de:', respuesta_correcta: 'B', alternativas: { A: 'Boyle.', B: 'Charles (V vs T).', C: 'Avogadro.', D: 'Gay-Lussac.' }, feedback_acierto: '¡Excelente!', feedback_error: 'Relación directa V/T.' }
    ]
  },

  // --- CAP 4: DISOLUCIONES QUÍMICAS ---
  {
    id: 'test-cqui-4-1',
    seccionId: 'sec-cqui-4-1',
    preguntas: [
      { id: 6112, enunciado: 'En una disolución de azúcar en agua, el azúcar es el:', alternativas: { A: 'Solvente.', B: 'Soluto.', C: 'Precipitado.', D: 'Disolvente.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Es la sustancia que se disuelve.', feedback_error: 'El soluto está en menor proporción.' },
      { id: 6113, enunciado: 'El solvente universal en la mayoría de procesos biológicos es:', alternativas: { A: 'Alcohol.', B: 'Agua.', C: 'Aceite.', D: 'Benceno.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Es polar y muy abundante.' },
      { id: 6114, enunciado: 'Una mezcla de NaCl + Agua es una:', alternativas: { A: 'Disolución.', B: 'Suspensión.', C: 'Emulsión.', D: 'Sustancia pura.' }, respuesta_correcta: 'A', feedback_acierto: '¡Bien! Mezcla homogénea líquida.', feedback_error: 'Sus componentes no se separan por reposo.' }
    ]
  },
  {
    id: 'test-cqui-4-2',
    seccionId: 'sec-cqui-4-2',
    preguntas: [
      { id: 6115, enunciado: 'Máxima cantidad de soluto que se puede disolver en 100g de solvente:', alternativas: { A: 'Molaridad.', B: 'Solubilidad.', C: 'Saturación.', D: 'Densidad.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Depende de la T y P.', feedback_error: 'Es una medida de capacidad.' },
      { id: 6116, enunciado: 'Una disolución que contiene menos soluto del máximo posible es:', alternativas: { A: 'Saturada.', B: 'Insaturada.', C: 'Sobresaturada.', D: 'Concentrada.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Aún puede disolver más.' },
      { id: 6117, enunciado: 'Generalmente, al aumentar la temperatura, la solubilidad de un sólido:', alternativas: { A: 'Baja.', B: 'Aumenta.', C: 'No cambia.', D: 'Desaparece.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! Facilita la mezcla.', feedback_error: 'La mayoría de las sales son más solubles en caliente.' }
    ]
  },
  {
    id: 'test-cqui-4-3',
    seccionId: 'sec-cqui-4-3',
    preguntas: [
      { id: 6118, enunciado: 'Un grado Brix (°Bx) corresponde a:', alternativas: { A: '1g soluto / 1L solución.', B: '1g azúcar / 100g solución.', C: '1 mol / L.', D: '1% v/v.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Es un % m/m.', feedback_error: 'Unidad usada en industria de jugos/vinos.' },
      { id: 6119, enunciado: 'Concentración de 80g de sal en 400g de solución:', alternativas: { A: '10% m/m.', B: '20% m/m.', C: '25% m/m.', D: '40% m/m.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! 80/400 * 100 = 20%.', feedback_error: 'Soluto / Solución * 100.' },
      { id: 6120, enunciado: 'Si 100g de agua (solvent) tienen 20g de sal, el % m/m es:', alternativas: { A: '20%.', B: '16,6%.', C: '10%.', D: '25%.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! Masa solución = 100 + 20 = 120g.', feedback_error: 'No olvides sumar soluto + solvente para la solución.' }
    ]
  },
  {
    id: 'test-cqui-4-4',
    seccionId: 'sec-cqui-4-4',
    preguntas: [
      { id: 6121, enunciado: '¿Qué significa una solución al 5% m/v?', alternativas: { A: '5g soluto en 100g solvente.', B: '5g soluto en 100mL solución.', C: '5mL soluto en 100mL solución.', D: '5 mol en 1L.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Masa en volumen.' },
      { id: 6122, enunciado: 'Masa de NaOH necesaria para 250mL al 2% m/v:', alternativas: { A: '2g.', B: '5g.', C: '10g.', D: '0,5g.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! (2/100) * 250 = 5.', feedback_error: 'Aplica la proporción.' },
      { id: 6123, enunciado: 'Una solución al 10% v/v tiene:', alternativas: { A: '10g en 100mL.', B: '10mL soluto en 100mL solución.', C: '10g en 1kg.', D: '10 mol en 1L.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Volumen en volumen.' }
    ]
  },
  {
    id: 'test-cqui-4-5',
    seccionId: 'sec-cqui-4-5',
    preguntas: [
      { id: 6124, enunciado: 'La Molaridad (M) se define como:', alternativas: { A: 'mol soluto / kg solvente.', B: 'mol soluto / Litro solución.', C: 'g soluto / 100mL.', D: 'mol / mol.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Unidad de volumen en Litros.' },
      { id: 6125, enunciado: 'Molaridad de 1 mol de NaCl en 500mL de solución:', alternativas: { A: '0,5 M.', B: '2,0 M.', C: '1,0 M.', D: '5,0 M.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! 1 / 0,5 = 2.', feedback_error: 'Pasa mL a Litros.' },
      { id: 6126, enunciado: '¿Cuántos moles hay en 2 Litros de solución 0,1 M?', alternativas: { A: '0,1 mol.', B: '0,2 mol.', C: '0,05 mol.', D: '2,0 mol.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! n = M * V.', feedback_error: 'Molaridad por Volumen.' }
    ]
  },
  {
    id: 'test-cqui-4-6',
    seccionId: 'sec-cqui-4-6',
    preguntas: [
      { id: 6127, enunciado: 'La Molalidad (m) usa en el denominador:', alternativas: { A: 'Litros de solución.', B: 'Kilogramos de solvente.', C: 'Masa total.', D: 'Moles de agua.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Independiente de la temperatura.' },
      { id: 6128, enunciado: 'La suma de las fracciones molares de todos los componentes es:', alternativas: { A: '100.', B: '1.', C: '0.', D: 'La masa molar.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Es una proporción unitaria.' },
      { id: 6129, enunciado: 'Unidad usada para concentraciones muy pequeñas (ej. metales en agua):', alternativas: { A: 'M.', B: 'ppm (partes por millón).', C: '% v/v.', D: 'm.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'mg / kg o mg / L.' }
    ]
  },
  {
    id: 'test-cqui-4-7',
    seccionId: 'sec-cqui-4-7',
    preguntas: [
      { id: 6130, enunciado: 'En una dilución, ¿qué parámetro permanece constante?', alternativas: { A: 'Concentración.', B: 'Cantidad de soluto (moles).', C: 'Volumen total.', D: 'Densidad.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Solo agregas solvente.', feedback_error: 'El soluto no se crea ni destruye.' },
      { id: 6131, enunciado: 'Si diluyes 5mL de HCl al 37% hasta 25mL, la nueva concentración es:', alternativas: { A: 'Igual.', B: 'Un quinto (1/5).', C: 'El quíntuple (5x).', D: 'Cero.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! El volumen subió 5 veces, la conc. baja 5 veces.', feedback_error: 'C1V1 = C2V2.' },
      { id: 6132, enunciado: 'Para bajar la M de 1,0 a 0,5, el volumen de la solución debe:', alternativas: { A: 'Bajar a la mitad.', B: 'Duplicarse.', C: 'Triplicarse.', D: 'No cambiar.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Relación inversa C vs V.' }
    ]
  },
  {
    id: 'test-cqui-4-8',
    seccionId: 'sec-cqui-4-8',
    preguntas: [
      { id: 6133, enunciado: 'Al mezclar 100mL de HCl 1M con 100mL de HCl 1M, la concentración final es:', alternativas: { A: '2 M.', B: '1 M.', C: '0,5 M.', D: '0,1 M.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Mezclas iguales no cambian la concentración.', feedback_error: 'Misma identidad y concentración.' },
      { id: 6134, enunciado: 'Mezcla de 10mL 1M + 20mL 0,5M + 50mL 0,2M de HCl. M final:', alternativas: { A: '1,7 M.', B: '0,375 M.', C: '0,5 M.', D: '2,6 M.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! Moles totales: 10+10+10=30mmol. Vol total: 80mL. 30/80 = 0,375.', feedback_error: 'Calcula moles totales y volumen total.' },
      { id: 6135, enunciado: 'Al mezclar dos soluciones de glucosa de igual concentración, la resultante:', alternativas: { A: 'Tiene más moles de soluto.', B: 'Tiene mayor concentración.', C: 'Tiene menos volumen.', D: 'Es heterogénea.' }, respuesta_correcta: 'A', feedback_acierto: '¡Bien! Sumas los contenidos.', feedback_error: 'Los moles son aditivos.' }
    ]
  },
  {
    id: 'test-cqui-4-9',
    seccionId: 'sec-cqui-4-9',
    preguntas: [
      { id: 6136, enunciado: 'Instrumento de vidrio usado para preparar soluciones de volumen exacto:', alternativas: { A: 'Vaso de precipitado.', B: 'Matraz aforado.', C: 'Probeta.', D: 'Tubo de ensayo.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Diseñado para el aforo.', feedback_error: 'Tiene una marca de graduación única.' },
      { id: 6137, enunciado: 'El paso final al preparar una solución en un matraz es:', alternativas: { A: 'Pesar.', B: 'Homogeneizar (agitar).', C: 'Calentar.', D: 'Filtrar.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Asegura que sea homogénea.' },
      { id: 6138, enunciado: 'Para preparar 1L de solución 1M de NaOH (40 g/mol), se debe pesar:', alternativas: { A: '1g.', B: '40g.', C: '23g.', D: '17g.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: '1 mol = 40g.' }
    ]
  },
  {
    id: 'test-cqui-4-10',
    seccionId: 'sec-cqui-4-10',
    preguntas: [
      { id: 6139, enunciado: 'Concentración de HCl resultante al mezclar 10mL 1M, 20mL 0,5M y 50mL 0,2M:', respuesta_correcta: 'B', alternativas: { A: '0,5 M.', B: '0,375 M.', C: '1,0 M.', D: '0,25 M.' }, feedback_acierto: '¡Correcto!', feedback_error: 'n total / V total.' },
      { id: 6140, enunciado: 'Volumen de agua para diluir 50mL al 4% m/v a 0,5 mol/L (NaOH=40):', respuesta_correcta: 'A', alternativas: { A: '50 mL.', B: '100 mL.', C: '25 mL.', D: '10 mL.' }, feedback_acierto: '¡Exacto! 4% m/v = 1 M. Diluir de 1M a 0,5M requiere duplicar volumen (50 -> 100), agregar 50mL.', feedback_error: 'Calcula M inicial primero.' },
      { id: 6141, enunciado: 'Mezcla para obtener 1L de NaOH 0,03 M desde una 1,0 M:', respuesta_correcta: 'D', alternativas: { A: '300mL sol + 700mL agua.', B: '100mL sol + 900mL agua.', C: '3mL sol + 997mL agua.', D: '30mL sol + 970mL agua.' }, feedback_acierto: '¡Bien! 1,0 * 30 = 0,03 * 1000.', feedback_error: 'C1V1 = C2V2.' },
      { id: 6142, enunciado: 'Variable fija en el estudio de dilución de cloro:', respuesta_correcta: 'D', alternativas: { A: 'Volumen final.', B: 'Volumen comercial.', C: 'Concentración final.', D: 'Concentración de la solución comercial.' }, feedback_acierto: '¡Correcto!', feedback_error: 'Viene del mismo envase siempre.' },
      { id: 6143, enunciado: 'Solución 1: 80g sal/400mL. Solución 2: 60g/200mL. ¿Cuál es más concentrada?', respuesta_correcta: 'B', alternativas: { A: 'Solución 1.', B: 'Solución 2.', C: 'Iguales.', D: 'Ninguna.' }, feedback_acierto: '¡Exacto! S1 = 20% m/v, S2 = 30% m/v.', feedback_error: 'Calcula g/100mL.' },
      { id: 6144, enunciado: 'Información del Estudiante 4 sobre medir Brix a diario es un:', respuesta_correcta: 'D', alternativas: { A: 'Modelo.', B: 'Hipótesis.', C: 'Resultado.', D: 'Procedimiento.' }, feedback_acierto: '¡Bien!', feedback_error: 'Describe pasos a seguir.' },
      { id: 6145, enunciado: 'La escala Brix mide aproximadamente:', respuesta_correcta: 'C', alternativas: { A: 'Alcohol.', B: 'Agua.', C: 'Azúcar.', D: 'Sal.' }, feedback_acierto: '¡Correcto!', feedback_error: 'Contenido de sólidos disueltos.' },
      { id: 6146, enunciado: '¿Qué sucede si se excede la solubilidad?', respuesta_correcta: 'B', alternativas: { A: 'Se evapora.', B: 'Precipita el exceso.', C: 'Se calienta.', D: 'Se vuelve gas.' }, feedback_acierto: '¡Exacto!', feedback_error: 'Forma un sólido al fondo.' },
      { id: 6147, enunciado: 'Fracción molar del soluto si hay 1 mol soluto y 9 mol solvente:', respuesta_correcta: 'B', alternativas: { A: '0,11.', B: '0,10.', C: '1,0.', D: '0,9.' }, feedback_acierto: '¡Bien! 1 / (1+9) = 0,1.', feedback_error: 'n_soluto / n_total.' },
      { id: 6148, enunciado: 'Para preparar una solución 1M de HCl a partir de 12M, el volumen inicial debe ser:', respuesta_correcta: 'B', alternativas: { A: '1/10 del final.', B: '1/12 del final.', C: '12 veces el final.', D: 'Igual.' }, feedback_acierto: '¡Excelente!', feedback_error: 'C1V1 = C2V2.' }
    ]
  },
  {
    id: 'test-cfis-1-1',
    seccionId: 'sec-cfis-1-1',
    preguntas: [
      { id: 5001, enunciado: 'Se estudian los perfiles de tres ondas (X, Y, Z) en un mismo medio. X tiene ciclos más cortos en el mismo tiempo que Z. ¿Conclusión?', alternativas: { A: 'El periodo es el mismo.', B: 'La longitud de onda es la misma.', C: 'vY > vZ.', D: 'fX > fZ.' }, respuesta_correcta: 'D', feedback_acierto: '¡Correcto! Más ciclos por segundo = mayor frecuencia.', feedback_error: 'La frecuencia depende del número de oscilaciones por unidad de tiempo.' },
      { id: 5002, enunciado: '¿Qué magnitud física de una onda se mantiene constante al pasar de un medio a otro?', alternativas: { A: 'Velocidad.', B: 'Longitud de onda.', C: 'Frecuencia.', D: 'Amplitud.' }, respuesta_correcta: 'C', feedback_acierto: '¡Exacto! La frecuencia depende de la fuente.', feedback_error: 'La velocidad y longitud de onda cambian al refractarse.' },
      { id: 5003, enunciado: 'El tiempo que tarda una partícula del medio en realizar una oscilación completa es:', alternativas: { A: 'Frecuencia.', B: 'Periodo.', C: 'Pulso.', D: 'Nodo.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Se mide en segundos.' }
    ]
  },
  {
    id: 'test-cfis-1-2',
    seccionId: 'sec-cfis-1-2',
    preguntas: [
      { id: 5004, enunciado: 'Un rayo luminoso pasa del aire al vidrio. ¿Qué sucede simultáneamente en la interfaz?', alternativas: { A: 'Solo reflexión.', B: 'Solo refracción.', C: 'Reflexión y refracción.', D: 'Difracción total.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! Parte de la energía vuelve y parte se transmite.', feedback_error: 'Ambos fenómenos ocurren juntos en superficies transparentes.' },
      { id: 5005, enunciado: 'Un haz monocromático pasa del vacío (n=1) a un medio (n=2). ¿Qué ocurre con su rapidez?', alternativas: { A: 'Se duplica.', B: 'Se reduce a la mitad.', C: 'Se mantiene igual.', D: 'Se vuelve cero.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! v = c / n.', feedback_error: 'A mayor índice de refracción, menor velocidad.' },
      { id: 5006, enunciado: 'En la refracción, si la luz se aleja de la normal al entrar a un nuevo medio, significa que:', alternativas: { A: 'v subió.', B: 'v bajó.', C: 'n es mayor.', D: 'La frecuencia cambió.' }, respuesta_correcta: 'A', feedback_acierto: '¡Bien! Mayor velocidad implica mayor ángulo.', feedback_error: 'Relaciona ángulo con rapidez.' }
    ]
  },
  {
    id: 'test-cfis-1-3',
    seccionId: 'sec-cfis-1-3',
    preguntas: [
      { id: 5007, enunciado: '¿Qué fenómenos explican el funcionamiento del radar aeronáutico?', alternativas: { A: 'Difracción y absorción.', B: 'Refracción y absorción.', C: 'Propagación y difracción.', D: 'Propagación y reflexión.' }, respuesta_correcta: 'D', feedback_acierto: '¡Correcto! El radar emite una señal que rebota (eco).', feedback_error: 'Busca los fenómenos asociados al rebote de ondas.' },
      { id: 5008, enunciado: '¿Qué tipo de onda utiliza un radar convencional?', alternativas: { A: 'Mecánica.', B: 'Electromagnética.', C: 'Sonora.', D: 'Sísmica.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Viajan a la velocidad de la luz.' },
      { id: 5009, enunciado: 'Un material diseñado para bloquear el 99,9% de ondas EM serviría para:', alternativas: { A: 'Amplificar señales.', B: 'Recubrimiento de trajes espaciales.', C: 'Antenas parabólicas.', D: 'Lentes de contacto.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! Protege de la radiación.', feedback_error: 'Debe ser un aislante de ondas.' }
    ]
  },
  {
    id: 'test-cfis-1-4',
    seccionId: 'sec-cfis-1-4',
    preguntas: [
      { id: 5010, enunciado: 'La característica del sonido que permite distinguir una nota Do tocada por un piano de la misma nota por un violín es:', alternativas: { A: 'Tono.', B: 'Intensidad.', C: 'Timbre.', D: 'Eco.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! Depende de la forma de la onda.', feedback_error: 'Es la identidad sonora del instrumento.' },
      { id: 5011, enunciado: 'Un sonido agudo se diferencia de uno grave por tener una mayor:', alternativas: { A: 'Amplitud.', B: 'Frecuencia.', C: 'Velocidad.', D: 'Energía.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! Agudo = alta frecuencia.', feedback_error: 'Relaciona tono con frecuencia.' },
      { id: 5012, enunciado: 'El rango de audición humano aproximado es:', alternativas: { A: '0 - 100 Hz.', B: '20 - 20.000 Hz.', C: '100.000 - 1.000.000 Hz.', D: 'Solo infrasonido.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Fuera de este rango son infrasonidos o ultrasonidos.' }
    ]
  },
  {
    id: 'test-cfis-1-5',
    seccionId: 'sec-cfis-1-5',
    preguntas: [
      { id: 5013, enunciado: 'Si una galaxia se aleja del Sistema Solar, la luz que percibimos se desplaza hacia:', alternativas: { A: 'El azul (frecuencia sube).', B: 'El rojo (frecuencia baja).', C: 'El blanco.', D: 'El ultravioleta.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Es el efecto Doppler aplicado a la luz.', feedback_error: 'Alejamiento = estiramiento de onda.' },
      { id: 5014, enunciado: 'Un observador escucha el sonido de una ambulancia que se acerca. ¿Qué percibe?', alternativas: { A: 'Menor frecuencia.', B: 'Mayor frecuencia.', C: 'Igual frecuencia.', D: 'Silencio.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! El sonido se vuelve más agudo.', feedback_error: 'Acercamiento comprime los frentes de onda.' },
      { id: 5015, enunciado: 'El efecto Doppler ocurre con:', alternativas: { A: 'Solo sonido.', B: 'Solo luz.', C: 'Toda onda cuando hay movimiento relativo.', D: 'Solo ondas mecánicas.' }, respuesta_correcta: 'C', feedback_acierto: '¡Bien! Es un fenómeno universal de ondas.', feedback_error: 'Aplica a cualquier tipo de onda.' }
    ]
  },
  {
    id: 'test-cfis-1-6',
    seccionId: 'sec-cfis-1-6',
    preguntas: [
      { id: 5016, enunciado: 'Al pasar luz blanca por un prisma, el color que más se desvía es el:', alternativas: { A: 'Rojo.', B: 'Verde.', C: 'Violeta.', D: 'Amarillo.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! Tiene mayor frecuencia y menor rapidez en el vidrio.', feedback_error: 'A mayor frecuencia, mayor desviación.' },
      { id: 5017, enunciado: 'La luz roja monocromática de un láser al pasar por un prisma:', alternativas: { A: 'Se descompone en colores.', B: 'Solo se desvía manteniendo su color.', C: 'Se vuelve blanca.', D: 'Se absorbe totalmente.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! Es monocromática.', feedback_error: 'No tiene otros colores que separar.' },
      { id: 5018, enunciado: 'El fenómeno de la "Luna de Sangre" (rojiza) en eclipses se debe a:', alternativas: { A: 'La Luna emite luz roja.', B: 'Dispersión de la luz solar en la atmósfera terrestre.', C: 'Sombras espaciales.', D: 'Reflexión en Marte.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! La atmósfera filtra los azules y deja pasar los rojos.', feedback_error: 'La luz se refracta y dispersa al pasar por el aire.' }
    ]
  },
  {
    id: 'test-cfis-1-7',
    seccionId: 'sec-cfis-1-7',
    preguntas: [
      { id: 5019, enunciado: 'Un objeto se ubica a 1 metro de un espejo plano. ¿A qué distancia del objeto está su imagen?', alternativas: { A: '1 m.', B: '2 m.', C: '0,5 m.', D: 'En el infinito.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! 1m al espejo + 1m detrás.', feedback_error: 'La distancia objeto-espejo es igual a espejo-imagen.' },
      { id: 5020, enunciado: 'La imagen formada por un espejo plano es siempre:', alternativas: { A: 'Real e invertida.', B: 'Virtual y derecha.', C: 'Real y derecha.', D: 'Virtual e invertida.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! No se puede proyectar y mantiene la orientación vertical.', feedback_error: 'Recuerda que tu derecha es su izquierda, pero arriba sigue siendo arriba.' },
      { id: 5021, enunciado: 'Si caminas hacia un espejo plano a 1 m/s, ¿a qué velocidad relativa te acercas a tu imagen?', alternativas: { A: '1 m/s.', B: '2 m/s.', C: '0 m/s.', D: '0,5 m/s.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! Las velocidades se suman.', feedback_error: 'Ambos se mueven hacia el espejo.' }
    ]
  },
  {
    id: 'test-cfis-1-8',
    seccionId: 'sec-cfis-1-8',
    preguntas: [
      { id: 5022, enunciado: '¿En qué tipo de espejo la imagen es siempre virtual, derecha y más pequeña que el objeto?', alternativas: { A: 'Cóncavo.', B: 'Convexo.', C: 'Plano.', D: 'Parabólico de gran radio.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Como los retrovisores laterales.', feedback_error: 'Es el espejo que siempre aleja y achica.' },
      { id: 5023, enunciado: 'Si ubicas un objeto justo en el FOCO de un espejo cóncavo:', alternativas: { A: 'La imagen es gigante.', B: 'No se forma imagen.', C: 'La imagen es virtual.', D: 'La imagen es puntual.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! Los rayos salen paralelos.', feedback_error: 'En el foco los rayos no se intersectan.' },
      { id: 5024, enunciado: 'Un espejo cóncavo puede formar imágenes reales e invertidas si el objeto está:', alternativas: { A: 'Más allá del foco.', B: 'Entre el foco y el espejo.', C: 'Justo en el foco.', D: 'En el infinito solamente.' }, respuesta_correcta: 'A', feedback_acierto: '¡Bien!', feedback_error: 'Dentro del foco la imagen se vuelve virtual y derecha.' }
    ]
  },
  {
    id: 'test-cfis-1-9',
    seccionId: 'sec-cfis-1-9',
    preguntas: [
      { id: 5025, enunciado: '¿Qué tipo de lente se utiliza para corregir la miopía?', alternativas: { A: 'Convergente.', B: 'Divergente.', C: 'Bifocal plana.', D: 'Cilíndrica.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Separa los rayos para que lleguen a la retina.', feedback_error: 'El ojo miope enfoca antes de la retina.' },
      { id: 5026, enunciado: 'Las imágenes formadas por una lente divergente son siempre:', alternativas: { A: 'Reales.', B: 'Virtuales, derechas y pequeñas.', C: 'Invertidas.', D: 'Mayores que el objeto.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! Se comporta similar a un espejo convexo.', feedback_error: 'Divergente = separa los rayos.' },
      { id: 5027, enunciado: 'Una lente convergente forma una imagen virtual y derecha cuando el objeto se coloca:', alternativas: { A: 'Lejos de la lente.', B: 'Entre el foco y la lente (como lupa).', C: 'En el doble de la distancia focal.', D: 'En el foco.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! Es el uso clásico de la lupa.', feedback_error: 'Debe estar muy cerca para verla derecha.' }
    ]
  },
  {
    id: 'test-cfis-1-10',
    seccionId: 'sec-cfis-1-10',
    preguntas: [
      { id: 5028, enunciado: 'Objetivo de medir rayos incidente, reflejado y refractado:', respuesta_correcta: 'D', alternativas: { A: 'Ver el color.', B: 'Ver el plano.', C: 'Ver la frecuencia.', D: 'Ver simultaneidad de fenómenos.' }, feedback_acierto: '¡Correcto!', feedback_error: 'Estudio de interfaz.' },
      { id: 5029, enunciado: 'Frecuencia de luz de 6e14 Hz pasa de vacío (n=1) a medio (n=2). Nueva frecuencia:', respuesta_correcta: 'C', alternativas: { A: '3e14 Hz.', B: '12e14 Hz.', C: '6e14 Hz.', D: '0 Hz.' }, feedback_acierto: '¡Exacto! La frecuencia NO cambia.', feedback_error: 'Propiedad de la fuente.' },
      { id: 5030, enunciado: 'Tipo de imagen en espejo 1 (Igual, Derecha) y Espejo 4 (Pequeña, Derecha):', respuesta_correcta: 'C', alternativas: { A: 'Ambos planos.', B: 'Ambos cóncavos.', C: '1 Plano, 4 Convexo.', D: '1 Convexo, 4 Plano.' }, feedback_acierto: '¡Bien!', feedback_error: 'El plano no cambia tamaño.' },
      { id: 5031, enunciado: 'Relación entre longitud de onda y frecuencia en un mismo medio:', respuesta_correcta: 'B', alternativas: { A: 'Directa.', B: 'Inversa.', C: 'No hay relación.', D: 'Logarítmica.' }, feedback_acierto: '¡Correcto! v = f * L.', feedback_error: 'A más frecuencia, ondas más cortas.' },
      { id: 5032, enunciado: 'El fenómeno de la difracción se nota más cuando el obstáculo es:', respuesta_correcta: 'B', alternativas: { A: 'Gigante.', B: 'Del tamaño de la longitud de onda.', C: 'Transparente.', D: 'Inexistente.' }, feedback_acierto: '¡Exacto!', feedback_error: 'La onda debe "sentir" el borde.' },
      { id: 5033, enunciado: 'Un sonido de 100 Hz comparado con uno de 1000 Hz es más:', respuesta_correcta: 'B', alternativas: { A: 'Fuerte.', B: 'Grave.', C: 'Agudo.', D: 'Rápido.' }, feedback_acierto: '¡Bien!', feedback_error: 'Menos frecuencia = más bajo/grave.' },
      { id: 5034, enunciado: '¿Qué ocurre con la rapidez de la luz al entrar al diamante (n=2.4)?', respuesta_correcta: 'B', alternativas: { A: 'Sube.', B: 'Baja.', C: 'Igual.', D: 'Depende del color.' }, feedback_acierto: '¡Correcto!', feedback_error: 'n > 1 siempre frena la luz.' },
      { id: 5035, enunciado: 'Si ves tu imagen en una cuchara por el lado que "contiene la sopa":', respuesta_correcta: 'A', alternativas: { A: 'Es espejo cóncavo.', B: 'Es espejo convexo.', C: 'Es lente.', D: 'Es plano.' }, feedback_acierto: '¡Exacto!', feedback_error: 'Es la parte hundida.' },
      { id: 5036, enunciado: 'La dispersión cromática en un prisma muestra que:', respuesta_correcta: 'B', alternativas: { A: 'Todos viajan igual.', B: 'Distintos colores viajan a distintas v en el vidrio.', C: 'La luz es negra.', D: 'El prisma crea colores.' }, feedback_acierto: '¡Bien!', feedback_error: 'El índice n varía con la frecuencia.' },
      { id: 5037, enunciado: '¿Por qué el cielo es azul?', respuesta_correcta: 'C', alternativas: { A: 'Refleja el mar.', B: 'Absorción total.', C: 'Dispersión selectiva (Rayleigh).', D: 'Es su color natural.' }, feedback_acierto: '¡Excelente! Los azules rebotan más.', feedback_error: 'Interacción con moléculas del aire.' }
    ]
  },

  // --- FÍSICA: MECÁNICA ---
  {
    id: 'test-cfis-2-1',
    seccionId: 'sec-cfis-2-1',
    preguntas: [
      { id: 5038, enunciado: '¿Cuál de las siguientes es una magnitud vectorial?', alternativas: { A: 'Masa.', B: 'Tiempo.', C: 'Desplazamiento.', D: 'Temperatura.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! Tiene dirección y sentido.', feedback_error: 'Las escalares solo tienen número y unidad.' },
      { id: 5039, enunciado: 'Si caminas 3m al norte y 4m al este, tu desplazamiento total es:', alternativas: { A: '7 m.', B: '5 m.', C: '1 m.', D: '12 m.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! Pitágoras (3, 4, 5).', feedback_error: 'El desplazamiento es la línea recta inicio-fin.' },
      { id: 5040, enunciado: 'La rapidez media se calcula como:', alternativas: { A: 'Desplazamiento / tiempo.', B: 'Distancia total / tiempo total.', C: 'v final + v inicial.', D: 'Aceleración * tiempo.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Es una magnitud escalar.' }
    ]
  },
  {
    id: 'test-cfis-2-2',
    seccionId: 'sec-cfis-2-2',
    preguntas: [
      { id: 5041, enunciado: 'En un gráfico de Rapidez vs Tiempo, el área bajo la curva representa:', alternativas: { A: 'Aceleración.', B: 'Distancia recorrida.', C: 'Fuerza.', D: 'Masa.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'v * t = distancia.' },
      { id: 5042, enunciado: 'Un cuerpo con aceleración constante de 2 m/s² significa que:', alternativas: { A: 'Se mueve a 2 m/s.', B: 'Su velocidad aumenta 2 m/s cada segundo.', C: 'Recorre 2 metros siempre.', D: 'Está en reposo.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'La aceleración mide el cambio de velocidad.' },
      { id: 5043, enunciado: 'Si la velocidad es constante, la aceleración es:', alternativas: { A: 'Máxima.', B: 'Cero.', C: '9,8 m/s².', D: 'Igual a la velocidad.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! No hay cambio, no hay aceleración.', feedback_error: 'a = delta V / delta t.' }
    ]
  },
  {
    id: 'test-cfis-2-3',
    seccionId: 'sec-cfis-2-3',
    preguntas: [
      { id: 5044, enunciado: 'La tendencia de los cuerpos a mantener su estado de reposo o movimiento rectilíneo uniforme se llama:', alternativas: { A: 'Fuerza.', B: 'Inercia.', C: 'Peso.', D: 'Roce.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! 1ra Ley de Newton.', feedback_error: 'Depende de la masa.' },
      { id: 5045, enunciado: 'Si sobre un cuerpo de 2 kg actúa una fuerza neta de 10 N, su aceleración será:', alternativas: { A: '20 m/s².', B: '5 m/s².', C: '12 m/s².', D: '8 m/s².' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! a = F / m.', feedback_error: 'Usa la 2da Ley de Newton.' },
      { id: 5046, enunciado: 'La unidad de Fuerza en el SI es el Newton, que equivale a:', alternativas: { A: 'kg * m/s.', B: 'kg * m/s².', C: 'm / kg.', D: 'Joule / m².' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Masa por aceleración.' }
    ]
  },
  {
    id: 'test-cfis-2-4',
    seccionId: 'sec-cfis-2-4',
    preguntas: [
      { id: 5047, enunciado: 'Una canica rebota en un globo tenso. ¿Qué explica que el globo se hunda y la canica suba?', alternativas: { A: 'Inercia.', B: 'Acción y Reacción.', C: 'Roce.', D: 'Centrípeta.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Fuerzas de igual magnitud y sentido opuesto en distintos cuerpos.', feedback_error: 'Es la 3ra Ley de Newton.' },
      { id: 5048, enunciado: 'Las fuerzas de acción y reacción:', alternativas: { A: 'Se anulan entre sí.', B: 'Actúan sobre el mismo cuerpo.', C: 'Actúan sobre cuerpos diferentes.', D: 'Tienen magnitudes diferentes.' }, respuesta_correcta: 'C', feedback_acierto: '¡Exacto! Por eso producen movimiento.', feedback_error: 'Si actuaran en el mismo cuerpo, se anularían.' },
      { id: 5049, enunciado: 'Al golpear una pared con la mano, el dolor se debe a:', alternativas: { A: 'La fuerza de tu mano.', B: 'La fuerza que la pared ejerce sobre tu mano.', C: 'La gravedad.', D: 'La mala suerte.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! Recibes la reacción.', feedback_error: 'Toda acción tiene reacción.' }
    ]
  },
  {
    id: 'test-cfis-2-5',
    seccionId: 'sec-cfis-2-5',
    preguntas: [
      { id: 5050, enunciado: '¿De qué depende principalmente la magnitud de la fuerza de roce cinético?', alternativas: { A: 'Del área de contacto.', B: 'De la naturaleza de las superficies y la fuerza normal.', C: 'De la velocidad del cuerpo.', D: 'De la temperatura ambiente.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! f = mu * N.', feedback_error: 'El área de contacto no influye en el roce ideal.' },
      { id: 5051, enunciado: '¿Cuál roce es mayor generalmente para un mismo par de superficies?', alternativas: { A: 'Roce estático máximo.', B: 'Roce cinético.', C: 'Son iguales.', D: 'Depende de la masa.' }, respuesta_correcta: 'A', feedback_acierto: '¡Exacto! Cuesta más empezar a mover que mantener el movimiento.', feedback_error: 'Piensa en empujar un auto.' },
      { id: 5052, enunciado: 'Un bloque en reposo sobre el cual se aplica una fuerza F que no logra moverlo, tiene un roce:', alternativas: { A: 'Nulo.', B: 'Igual a F.', C: 'Menor a F.', D: 'Cinético.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! Equilibrio de fuerzas.', feedback_error: 'Si no se mueve, la fuerza neta es cero.' }
    ]
  },
  {
    id: 'test-cfis-2-6',
    seccionId: 'sec-cfis-2-6',
    preguntas: [
      { id: 5053, enunciado: 'Para probar si la tensión depende del lugar de la cuerda, un dinamómetro debe intercalarse en:', alternativas: { A: 'Un solo punto.', B: 'Dos o más puntos diferentes de la misma cuerda.', C: 'Cuerdas de distinto material.', D: 'El techo solamente.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Así comparas resultados.', feedback_error: 'Diseño experimental básico.' },
      { id: 5054, enunciado: 'En una cuerda ideal (masa despreciable), la tensión es:', alternativas: { A: 'Mayor arriba.', B: 'Mayor abajo.', C: 'Igual en todos sus puntos.', D: 'Cero.' }, respuesta_correcta: 'C', feedback_acierto: '¡Exacto! Transmite la fuerza íntegramente.', feedback_error: 'Es una idealización física.' },
      { id: 5055, enunciado: 'Si un bloque cuelga en equilibrio, la tensión de la cuerda es igual a:', alternativas: { A: 'La masa.', B: 'El peso del bloque.', C: 'Cero.', D: '10 N siempre.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! T - P = 0.', feedback_error: 'Fuerzas opuestas en equilibrio.' }
    ]
  },
  {
    id: 'test-cfis-2-7',
    seccionId: 'sec-cfis-2-7',
    preguntas: [
      { id: 5056, enunciado: 'La Ley de Hooke establece que la fuerza en un resorte es proporcional a:', alternativas: { A: 'Su masa.', B: 'Su elongación (estiramiento).', C: 'Su temperatura.', D: 'Su color.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! F = k * x.', feedback_error: 'A más fuerza, más estiramiento.' },
      { id: 5057, enunciado: 'Si un resorte 1 es "más flexible" que un resorte 2, significa que:', alternativas: { A: 'k1 > k2.', B: 'k1 < k2.', C: 'k1 = k2.', D: 'No tiene k.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! Necesita menos fuerza para estirarse lo mismo.', feedback_error: 'k es la constante de rigidez.' },
      { id: 5058, enunciado: 'Un resorte se estira 10cm con 100N. ¿Cuánto se estirará con 200N (dentro del límite)?', alternativas: { A: '10 cm.', B: '20 cm.', C: '5 cm.', D: '40 cm.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! Relación directa.', feedback_error: 'Doble fuerza = doble estiramiento.' }
    ]
  },
  {
    id: 'test-cfis-2-8',
    seccionId: 'sec-cfis-2-8',
    preguntas: [
      { id: 5059, enunciado: 'Para estudiar el efecto de la masa en la presión sobre barro, ¿qué variable debe mantenerse fija?', alternativas: { A: 'La masa de arena.', B: 'El área de contacto del balde.', C: 'La profundidad de la huella.', D: 'El tiempo.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Si cambias el área, no sabes qué causó el efecto.', feedback_error: 'Es una variable controlada.' },
      { id: 5060, enunciado: 'A igual fuerza, si el área de contacto disminuye, la presión:', alternativas: { A: 'Aumenta.', B: 'Disminuye.', C: 'Sigue igual.', D: 'Se vuelve nula.' }, respuesta_correcta: 'A', feedback_acierto: '¡Exacto! P = F / A.', feedback_error: 'Menos área concentra la fuerza.' },
      { id: 5061, enunciado: '¿Por qué las raquetas de nieve evitan que te hundas?', alternativas: { A: 'Bajan tu peso.', B: 'Aumentan el área de contacto bajando la presión.', C: 'Tienen resortes.', D: 'Son mágicas.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! Distribuyen tu peso.', feedback_error: 'Relaciona área con presión.' }
    ]
  },
  {
    id: 'test-cfis-2-9',
    seccionId: 'sec-cfis-2-9',
    preguntas: [
      { id: 5062, enunciado: 'Si haces tres orificios a distinta profundidad en una botella con agua, el chorro con mayor alcance será el de:', alternativas: { A: 'El orificio superior.', B: 'El orificio inferior.', C: 'El del medio.', D: 'Todos iguales.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! A mayor profundidad, mayor presión.', feedback_error: 'P = densidad * g * h.' },
      { id: 5063, enunciado: 'El Principio de Pascal afirma que la presión aplicada a un fluido encerrado:', alternativas: { A: 'Se pierde.', B: 'Se transmite íntegramente en todas direcciones.', C: 'Solo baja.', D: 'Depende del color del fluido.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! Base de las prensas hidráulicas.', feedback_error: 'Propiedad de los líquidos incompresibles.' },
      { id: 5064, enunciado: 'Un buzo siente más presión en sus oídos mientras:', alternativas: { A: 'Nada horizontalmente.', B: 'Desciende a mayor profundidad.', C: 'Sube a la superficie.', D: 'Está en la piscina de su casa.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'La columna de agua sobre él aumenta.' }
    ]
  },
  {
    id: 'test-cfis-2-10',
    seccionId: 'sec-cfis-2-10',
    preguntas: [
      { id: 5065, enunciado: 'Bloque sobre superficie rugosa. Gráfico Roce vs F aplicada es lineal hasta Q. En Q:', respuesta_correcta: 'C', alternativas: { A: 'Se detiene.', B: 'Roce es cero.', C: 'Se alcanza el roce estático máximo.', D: 'Masa cambia.' }, feedback_acierto: '¡Correcto!', feedback_error: 'Punto de inicio del movimiento.' },
      { id: 5066, enunciado: 'Conclusión: "La magnitud del roce es independiente del área". ¿Qué evidencia la apoya?', respuesta_correcta: 'B', alternativas: { A: 'Usar distintos materiales.', B: 'Resultados iguales al apilar bloques (distinta área, igual masa total).', C: 'Medir en el vacío.', D: 'Usar aceites.' }, feedback_acierto: '¡Exacto!', feedback_error: 'Comparación experimental.' },
      { id: 5067, enunciado: 'Masa de objeto en resorte (k=4 N/cm) que estira 6cm en equilibrio:', respuesta_correcta: 'A', alternativas: { A: '2,4 kg.', B: '24 kg.', C: '0,24 kg.', D: '1,5 kg.' }, feedback_acierto: '¡Bien! F=k*x=24N. P=mg.', feedback_error: 'Recuerda convertir unidades si es necesario.' },
      { id: 5068, enunciado: 'En un sistema de poleas ideales, la fuerza necesaria para subir un peso:', respuesta_correcta: 'B', alternativas: { A: 'Aumenta.', B: 'Disminuye (si hay poleas móviles).', C: 'No cambia.', D: 'Es infinita.' }, feedback_acierto: '¡Correcto!', feedback_error: 'Ventaja mecánica.' },
      { id: 5069, enunciado: 'Si la fuerza neta sobre un auto es CERO, el auto:', respuesta_correcta: 'C', alternativas: { A: 'Está frenando.', B: 'Está acelerando.', C: 'Está en reposo o MRU.', D: 'Va en curvas.' }, feedback_acierto: '¡Exacto!', feedback_error: '1ra Ley de Newton.' },
      { id: 5070, enunciado: 'Peso en la Luna (g=1.6) comparado con la Tierra (g=10):', respuesta_correcta: 'B', alternativas: { A: 'Igual.', B: 'Menor.', C: 'Mayor.', D: 'Cero.' }, feedback_acierto: '¡Bien! P = m * g.', feedback_error: 'La masa no cambia, el peso sí.' },
      { id: 5071, enunciado: 'Unidad de Presión en el SI:', respuesta_correcta: 'B', alternativas: { A: 'Newton.', B: 'Pascal.', C: 'Joule.', D: 'Watt.' }, feedback_acierto: '¡Correcto! N/m².', feedback_error: 'Es fuerza por unidad de área.' },
      { id: 5072, enunciado: 'Fuerza de acción (pie patea pelota) y reacción (pelota patea pie):', respuesta_correcta: 'B', alternativas: { A: 'La de la pelota es menor.', B: 'Son de igual magnitud.', C: 'La de la pelota es mayor.', D: 'No existen.' }, feedback_acierto: '¡Exacto!', feedback_error: '3ra Ley siempre se cumple.' },
      { id: 5073, enunciado: 'Si el coeficiente de roce cinético es 0.2, un bloque de 100N requiere una fuerza de:', respuesta_correcta: 'B', alternativas: { A: '100 N.', B: '20 N.', C: '500 N.', D: '200 N.' }, feedback_acierto: '¡Bien! f = 0.2 * 100.', feedback_error: 'Cálculo de roce.' },
      { id: 5074, enunciado: '¿Qué mide un dinamómetro?', respuesta_correcta: 'C', alternativas: { A: 'Masa.', B: 'Volumen.', C: 'Fuerza.', D: 'Densidad.' }, feedback_acierto: '¡Excelente!', feedback_error: 'Mide la deformación de un resorte para dar la fuerza.' }
    ]
  },

  // --- FÍSICA: ELECTRICIDAD ---
  {
    id: 'test-cfis-3-1',
    seccionId: 'sec-cfis-3-1',
    preguntas: [
      { id: 5075, enunciado: 'Dos cargas de igual signo se:', alternativas: { A: 'Atraen.', B: 'Repelen.', C: 'Anulan.', D: 'Ignoran.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Ley de cargas.', feedback_error: 'Cargas iguales se repelen.' },
      { id: 5076, enunciado: 'Un material que permite el libre flujo de electrones es un:', alternativas: { A: 'Aislante.', B: 'Conductor.', C: 'Semiconductor.', D: 'Vidrio.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! Como los metales.', feedback_error: 'Los electrones se mueven fácil en ellos.' },
      { id: 5077, enunciado: 'La unidad de carga eléctrica en el SI es el:', alternativas: { A: 'Ampere.', B: 'Volt.', C: 'Coulomb.', D: 'Ohm.' }, respuesta_correcta: 'C', feedback_acierto: '¡Bien!', feedback_error: 'Medida de cantidad de electrones.' }
    ]
  },
  {
    id: 'test-cfis-3-2',
    seccionId: 'sec-cfis-3-2',
    preguntas: [
      { id: 5078, enunciado: 'En un circuito en SERIE, la intensidad de corriente en cada ampolleta es:', alternativas: { A: 'Diferente.', B: 'La misma.', C: 'Cero.', D: 'Depende del color.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Solo hay un camino para los electrones.', feedback_error: 'La corriente no tiene por dónde más ir.' },
      { id: 5079, enunciado: 'Si se quema una ampolleta en un circuito en serie:', alternativas: { A: 'Las otras brillan más.', B: 'Todas se apagan.', C: 'Nada cambia.', D: 'Explota la batería.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! El circuito se abre.', feedback_error: 'Se corta el único camino.' },
      { id: 5080, enunciado: 'La resistencia total en serie es:', alternativas: { A: 'Menor que la menor.', B: 'La suma de las resistencias individuales.', C: 'El promedio.', D: 'Cero.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! RT = R1 + R2...', feedback_error: 'Se van acumulando obstáculos.' }
    ]
  },
  {
    id: 'test-cfis-3-3',
    seccionId: 'sec-cfis-3-3',
    preguntas: [
      { id: 5081, enunciado: 'En un circuito en PARALELO, el voltaje en cada resistencia es:', alternativas: { A: 'La suma del total.', B: 'El mismo de la fuente.', C: 'Diferente en cada una.', D: 'Depende de la corriente.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Están todas conectadas a los mismos puntos.', feedback_error: 'Propiedad del paralelo.' },
      { id: 5082, enunciado: 'Si conectas dos resistencias en paralelo a una batería, la corriente total es:', alternativas: { A: 'Menor que en cada rama.', B: 'Igual a cada rama.', C: 'La suma de las corrientes de cada rama.', D: 'Cero.' }, respuesta_correcta: 'C', feedback_acierto: '¡Exacto! Los electrones se reparten.', feedback_error: 'Ley de nodos.' },
      { id: 5083, enunciado: 'Si se quema una ampolleta en paralelo:', alternativas: { A: 'Se apagan todas.', B: 'Las demás siguen encendidas.', C: 'Baja el voltaje.', D: 'Se corta la luz en la casa.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! Tienen caminos independientes.', feedback_error: 'Es la conexión usada en las casas.' }
    ]
  },
  {
    id: 'test-cfis-3-4',
    seccionId: 'sec-cfis-3-4',
    preguntas: [
      { id: 5084, enunciado: 'Un foco industrial de 220V tiene una corriente de 4A. ¿Cuál es su resistencia?', alternativas: { A: '880 Ohm.', B: '55 Ohm.', C: '4 Ohm.', D: '224 Ohm.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! R = V / I.', feedback_error: '220 / 4 = 55.' },
      { id: 5085, enunciado: 'Según la Ley de Ohm, si el voltaje se duplica y la resistencia se mantiene:', alternativas: { A: 'La corriente se reduce a la mitad.', B: 'La corriente se duplica.', C: 'La corriente es constante.', D: 'La ampolleta explota.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! Relación directa V-I.', feedback_error: 'I = V / R.' },
      { id: 5086, enunciado: 'Un gráfico de Voltaje vs Intensidad para un conductor óhmico es una:', alternativas: { A: 'Curva exponencial.', B: 'Línea recta que pasa por el origen.', C: 'Línea horizontal.', D: 'Línea vertical.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! La pendiente es la resistencia.', feedback_error: 'Proporcionalidad directa.' }
    ]
  },
  {
    id: 'test-cfis-3-5',
    seccionId: 'sec-cfis-3-5',
    preguntas: [
      { id: 5087, enunciado: 'La potencia eléctrica de un artefacto mide:', alternativas: { A: 'Cuánta carga almacena.', B: 'La rapidez con que consume o transforma energía.', C: 'Su voltaje máximo.', D: 'Su peso.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Se mide en Watts.', feedback_error: 'P = Energía / Tiempo.' },
      { id: 5088, enunciado: 'Dos hervidores tardan tiempos diferentes en hervir igual agua. Esto se debe a que tienen distinta:', alternativas: { A: 'Resistencia solamente.', B: 'Potencia eléctrica.', C: 'Voltaje de entrada.', D: 'Capacidad.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! El de más Watts es más rápido.', feedback_error: 'P = V * I.' },
      { id: 5089, enunciado: 'Si una ampolleta de 100W brilla más que una de 60W, es porque:', alternativas: { A: 'Tiene más voltaje.', B: 'Transforma más energía por segundo en luz.', C: 'Es más grande.', D: 'Es más cara.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Potencia es tasa de energía.' }
    ]
  },
  {
    id: 'test-cfis-3-6',
    seccionId: 'sec-cfis-3-6',
    preguntas: [
      { id: 5090, enunciado: '¿Qué unidad se utiliza habitualmente para cobrar el consumo eléctrico domiciliario?', alternativas: { A: 'Watt.', B: 'Joule.', C: 'Kilowatt-hora (kWh).', D: 'Ampere.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! Es una unidad de Energía.', feedback_error: 'Watt es potencia, kWh es energía.' },
      { id: 5091, enunciado: 'Un artefacto de 2000W encendido por 2 horas consume:', alternativas: { A: '4.000 kWh.', B: '4 kWh.', C: '2.000 J.', D: '1.000 Wh.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! 2kW * 2h = 4kWh.', feedback_error: 'Energía = Potencia * Tiempo.' },
      { id: 5092, enunciado: '¿Qué aparato permite conocer el consumo total de una vivienda?', alternativas: { A: 'Enchufe.', B: 'Interruptor.', C: 'Medidor eléctrico.', D: 'Transformador.' }, respuesta_correcta: 'C', feedback_acierto: '¡Bien! Registra el acumulado.', feedback_error: 'Es el "reloj" de la luz.' }
    ]
  },
  {
    id: 'test-cfis-3-7',
    seccionId: 'sec-cfis-3-7',
    preguntas: [
      { id: 5093, enunciado: 'El interruptor automático (disyuntor) protege el circuito contra:', alternativas: { A: 'Bajas de voltaje.', B: 'Excesos de corriente (sobrecarga).', C: 'Robo de energía.', D: 'Cortes de luz.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Se "salta" al superar cierto Amperaje.', feedback_error: 'Su función es abrir el circuito por seguridad.' },
      { id: 5094, enunciado: 'Si un circuito soporta 20A y conectas aparatos que suman 22A:', alternativas: { A: 'Brillan más.', B: 'El interruptor automático corta la corriente.', C: 'No pasa nada.', D: 'Baja el consumo.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! Previene incendios.', feedback_error: 'Superaste el límite de seguridad.' },
      { id: 5095, enunciado: '¿Qué indica un gráfico de Corriente vs Tiempo que cae a cero súbitamente?', alternativas: { A: 'Se acabó la pila.', B: 'El interruptor automático actuó.', C: 'Bajó el voltaje.', D: 'Todo bien.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! Corte de seguridad.', feedback_error: 'Es una interrupción brusca.' }
    ]
  },
  {
    id: 'test-cfis-3-8',
    seccionId: 'sec-cfis-3-8',
    preguntas: [
      { id: 5096, enunciado: '¿Qué dispositivo externo se usa para adecuar el voltaje a uno menor requerido por un artefacto?', alternativas: { A: 'Medidor.', B: 'Interruptor.', C: 'Transformador eléctrico.', D: 'Cable de cobre.' }, respuesta_correcta: 'C', feedback_acierto: '¡Correcto! Como los cargadores de celular.', feedback_error: 'Modifica los niveles de tensión.' },
      { id: 5097, enunciado: 'La red eléctrica chilena entrega habitualmente:', alternativas: { A: '110 V.', B: '220 V.', C: '440 V.', D: '12 V.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Es el estándar nacional.' },
      { id: 5098, enunciado: 'Un transformador funciona basado en el principio de:', alternativas: { A: 'Resistencia.', B: 'Inducción electromagnética.', C: 'Calor.', D: 'Presión.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Usa campos magnéticos variables.' }
    ]
  },
  {
    id: 'test-cfis-3-9',
    seccionId: 'sec-cfis-3-9',
    preguntas: [
      { id: 5099, enunciado: 'Las etiquetas de eficiencia energética permiten comparar:', alternativas: { A: 'El color del aparato.', B: 'El consumo de energía para realizar la misma tarea.', C: 'El peso.', D: 'La marca.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Una clase A consume menos que una clase G.', feedback_error: 'Busca el rendimiento energético.' },
      { id: 5100, enunciado: '¿Qué información es clave en una etiqueta de secadora para ver su eficiencia?', alternativas: { A: 'Capacidad de carga.', B: 'Energía utilizada por ciclo.', C: 'Nombre del modelo.', D: 'País de origen.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Relaciona trabajo hecho vs energía usada.' },
      { id: 5101, enunciado: 'Usar ampolletas LED en lugar de incandescentes es una medida de:', alternativas: { A: 'Decoración.', B: 'Eficiencia energética.', C: 'Aumento de potencia.', D: 'Pobreza.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! Menos Watts para igual luz.', feedback_error: 'Ahorro inteligente de energía.' }
    ]
  },
  {
    id: 'test-cfis-3-10',
    seccionId: 'sec-cfis-3-10',
    preguntas: [
      { id: 5102, enunciado: 'Configuración paralela vs serie: ¿En cuál es igual la diferencia de potencial (V)?', respuesta_correcta: 'D', alternativas: { A: 'Serie.', B: 'Ninguna.', C: 'Ambas.', D: 'Paralelo.' }, feedback_acierto: '¡Correcto!', feedback_error: 'Propiedad del paralelo.' },
      { id: 5103, enunciado: 'Pregunta de investigación: "Relación entre intensidad y tiempo de funcionamiento" sugiere medir:', respuesta_correcta: 'D', alternativas: { A: 'Voltaje cada hora.', B: 'Resistencia.', C: 'Color.', D: 'Corriente periódicamente (ej. cada 5 min).' }, feedback_acierto: '¡Exacto!', feedback_error: 'Mira las variables.' },
      { id: 5104, enunciado: 'Artefacto que permite conocer el consumo total de Watts/hora:', respuesta_correcta: 'C', alternativas: { A: 'Interruptor.', B: 'Enchufe.', C: 'Medidor.', D: 'Cable.' }, feedback_acierto: '¡Bien!', feedback_error: 'Registra energía acumulada.' },
      { id: 5105, enunciado: 'Si R1 = 10 Ohm y R2 = 10 Ohm en paralelo, la resistencia total es:', respuesta_correcta: 'B', alternativas: { A: '20 Ohm.', B: '5 Ohm.', C: '10 Ohm.', D: '100 Ohm.' }, feedback_acierto: '¡Correcto! 1/RT = 1/10 + 1/10.', feedback_error: 'En paralelo la total baja.' },
      { id: 5106, enunciado: 'La Ley de Ohm (V=IR) indica que si R sube y V es constante, la corriente:', respuesta_correcta: 'B', alternativas: { A: 'Sube.', B: 'Baja.', C: 'Igual.', D: 'Oscila.' }, feedback_acierto: '¡Exacto! Relación inversa.', feedback_error: 'Más resistencia = menos flujo.' },
      { id: 5107, enunciado: '¿Qué es un cortocircuito?', respuesta_correcta: 'B', alternativas: { A: 'Un cable largo.', B: 'Unión de baja resistencia que dispara la corriente.', C: 'Un interruptor abierto.', D: 'Ahorro de energía.' }, feedback_acierto: '¡Bien!', feedback_error: 'La corriente se va al infinito y quema cosas.' },
      { id: 5108, enunciado: 'Función del cable a tierra:', respuesta_correcta: 'B', alternativas: { A: 'Adornar.', B: 'Derivar corrientes de fuga al suelo por seguridad.', C: 'Dar más potencia.', D: 'Ahorrar luz.' }, feedback_acierto: '¡Excelente!', feedback_error: 'Evita choques eléctricos a humanos.' },
      { id: 5109, enunciado: 'En Chile, si conectas un aparato de 110V directamente a la red:', respuesta_correcta: 'B', alternativas: { A: 'Funciona bien.', B: 'Se quema por sobrevoltaje.', C: 'Consume menos.', D: 'No prende.' }, feedback_acierto: '¡Correcto!', feedback_error: 'Recibe el doble de tensión soportada.' },
      { id: 5110, enunciado: 'Unidad de potencia P:', respuesta_correcta: 'C', alternativas: { A: 'Joule.', B: 'Volt.', C: 'Watt.', D: 'Ampere.' }, feedback_acierto: '¡Bien!', feedback_error: 'Watt = J/s.' },
      { id: 5111, enunciado: '¿Qué sucede con el brillo de ampolletas en serie si agregas más?', respuesta_correcta: 'B', alternativas: { A: 'Brillan más.', B: 'Brillan menos (se reparte V).', C: 'Igual.', D: 'Explotan.' }, feedback_acierto: '¡Muy bien!', feedback_error: 'La resistencia total sube, la corriente baja.' }
    ]
  },

  // --- FÍSICA: TIERRA Y UNIVERSO ---
  {
    id: 'test-cfis-4-1',
    seccionId: 'sec-cfis-4-1',
    preguntas: [
      { id: 5112, enunciado: 'La capa más externa y delgada de la Tierra se llama:', alternativas: { A: 'Manto.', B: 'Corteza.', C: 'Núcleo.', D: 'Atmósfera.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto!', feedback_error: 'Es donde vivimos.' },
      { id: 5113, enunciado: 'El núcleo de la Tierra está compuesto principalmente por:', alternativas: { A: 'Silicio y Oxígeno.', B: 'Hierro y Níquel.', C: 'Agua.', D: 'Diamante.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! Genera el campo magnético.', feedback_error: 'Son metales pesados.' },
      { id: 5114, enunciado: 'La capa que se comporta de forma plástica y permite el movimiento de placas es:', alternativas: { A: 'Litosfera.', B: 'Astenosfera.', C: 'Núcleo interno.', D: 'Corteza continental.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Parte superior del manto.' }
    ]
  },
  {
    id: 'test-cfis-4-2',
    seccionId: 'sec-cfis-4-2',
    preguntas: [
      { id: 5115, enunciado: 'La teoría de la Deriva Continental fue propuesta inicialmente por:', alternativas: { A: 'Darwin.', B: 'Wegener.', C: 'Newton.', D: 'Hess.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Alfred Wegener.', feedback_error: 'Propuso que los continentes encajaban como puzzle.' },
      { id: 5116, enunciado: 'El supercontinente que existió hace 250 millones de años se llamaba:', alternativas: { A: 'Gondwana.', B: 'Pangea.', C: 'Laurasia.', D: 'Atlántida.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'Significa "toda la tierra".' },
      { id: 5117, enunciado: 'Una evidencia clave de la deriva continental es:', alternativas: { A: 'La lluvia.', B: 'Fósiles de la misma especie en continentes separados.', C: 'El color del mar.', D: 'Las nubes.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Como el Mesosaurus en África y Sudamérica.' }
    ]
  },
  {
    id: 'test-cfis-4-3',
    seccionId: 'sec-cfis-4-3',
    preguntas: [
      { id: 5118, enunciado: 'En una dorsal oceánica (límite divergente), las placas se:', alternativas: { A: 'Acercan.', B: 'Alejan.', C: 'Rozan lateralmente.', D: 'Quedan quietas.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Se crea nueva corteza oceánica.', feedback_error: 'Divergir es separar.' },
      { id: 5119, enunciado: '¿Qué sucede con dos islas en costas opuestas de un océano con dorsal central?', alternativas: { A: 'Se acercan.', B: 'Se alejan entre sí.', C: 'No cambian de posición.', D: 'Desaparecen.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! El océano se expande.', feedback_error: 'Predicción de tectónica de placas.' },
      { id: 5120, enunciado: '¿Dónde se encuentra la corteza oceánica más joven?', alternativas: { A: 'Cerca de los continentes.', B: 'En las fosas.', C: 'En el centro de las dorsales.', D: 'En el núcleo.' }, respuesta_correcta: 'C', feedback_acierto: '¡Bien! Ahí emerge el magma.', feedback_error: 'Es donde se está creando suelo.' }
    ]
  },
  {
    id: 'test-cfis-4-4',
    seccionId: 'sec-cfis-4-4',
    preguntas: [
      { id: 5121, enunciado: 'Un límite convergente donde una placa se hunde bajo otra se llama:', alternativas: { A: 'Dorsal.', B: 'Subducción.', C: 'Falla transformante.', D: 'Rift.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Caso de Chile (Nazca bajo Sudamericana).', feedback_error: 'Produce fosas y volcanes.' },
      { id: 5122, enunciado: 'Para determinar si hay un límite convergente (lento), se debe registrar la distancia por:', alternativas: { A: 'Un minuto.', B: 'Una década.', C: 'Un día.', D: 'Una hora.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! Los movimientos son de pocos cm por año.', feedback_error: 'Requiere escala de tiempo geológica.' },
      { id: 5123, enunciado: 'La Cordillera de los Andes se formó principalmente por un límite:', alternativas: { A: 'Divergente.', B: 'Convergente.', C: 'Transformante.', D: 'Inerte.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Choque y levantamiento de placas.' }
    ]
  },
  {
    id: 'test-cfis-4-5',
    seccionId: 'sec-cfis-4-5',
    preguntas: [
      { id: 5124, enunciado: '¿Qué ondas sísmicas son las más rápidas y llegan primero?', alternativas: { A: 'Ondas S.', B: 'Ondas P (Primarias).', C: 'Ondas L.', D: 'Ondas R.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Son longitudinales.', feedback_error: 'P de Primarias.' },
      { id: 5125, enunciado: 'El punto en el interior de la Tierra donde se origina el sismo es el:', alternativas: { A: 'Epicentro.', B: 'Hipocentro (Foco).', C: 'Cráter.', D: 'Falla.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto!', feedback_error: 'El epicentro es la proyección en superficie.' },
      { id: 5126, enunciado: '¿Qué escala mide la energía liberada por un sismo?', alternativas: { A: 'Mercalli.', B: 'Richter / Magnitud de Momento.', C: 'Celsius.', D: 'Beaufort.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Mercalli mide daños (percepción).' }
    ]
  },
  {
    id: 'test-cfis-4-6',
    seccionId: 'sec-cfis-4-6',
    preguntas: [
      { id: 5127, enunciado: 'A medida que aumenta la altitud sobre el nivel del mar, la presión atmosférica:', alternativas: { A: 'Aumenta.', B: 'Disminuye.', C: 'Sigue igual.', D: 'Se vuelve cero en el Everest.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Hay menos columna de aire arriba.', feedback_error: 'Menos aire = menos presión.' },
      { id: 5128, enunciado: '¿Qué sucede con la densidad del aire al subir una montaña?', alternativas: { A: 'Aumenta.', B: 'Disminuye.', C: 'No cambia.', D: 'Se vuelve sólida.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! El aire es más "ralo".', feedback_error: 'Relacionado con la presión.' },
      { id: 5129, enunciado: 'La temperatura de ebullición del agua en la cordillera es:', alternativas: { A: 'Mayor a 100°C.', B: 'Menor a 100°C.', C: 'Igual a 100°C.', D: 'Depende de la sal.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! Menos presión facilita el escape de burbujas.', feedback_error: 'Relaciona ebullición con presión ambiental.' }
    ]
  },
  {
    id: 'test-cfis-4-7',
    seccionId: 'sec-cfis-4-7',
    preguntas: [
      { id: 5130, enunciado: 'Un factor NO atmosférico que define el clima es:', alternativas: { A: 'Humedad.', B: 'Relieve (cordilleras).', C: 'Lluvia.', D: 'Nubes.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Es una condición geográfica.', feedback_error: 'Atmósfera es el aire, relieve es la tierra.' },
      { id: 5131, enunciado: '¿Qué sensor corregiría el tiempo de hervor en la costa vs cordillera?', alternativas: { A: 'Velocidad viento.', B: 'Presión atmosférica.', C: 'Humedad.', D: 'Luz.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! Detecta el cambio en P.', feedback_error: 'La P define el punto de hervor.' },
      { id: 5132, enunciado: '¿Qué mapa muestra factores climáticos como la altitud?', alternativas: { A: 'Mapa político.', B: 'Mapa físico / topográfico.', C: 'Mapa de carreteras.', D: 'Gráfico de barras.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Muestra cerros y valles.' }
    ]
  },
  {
    id: 'test-cfis-4-8',
    seccionId: 'sec-cfis-4-8',
    preguntas: [
      { id: 5133, enunciado: 'Una consecuencia directa del aumento de la temperatura global en 1,5°C es:', alternativas: { A: 'Más nieve.', B: 'Disminución del volumen de nieve acumulada.', C: 'Aumento de la capa de ozono.', D: 'Baja del nivel del mar.' }, respuesta_correcta: 'B', feedback_acierto: '¡Correcto! Derretimiento por calor.', feedback_error: 'El calentamiento derrite el hielo.' },
      { id: 5134, enunciado: 'El principal gas de efecto invernadero producido por humanos es:', alternativas: { A: 'Oxígeno.', B: 'Dióxido de Carbono (CO2).', C: 'Argón.', D: 'Helio.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! Quema de combustibles.', feedback_error: 'Retiene el calor infrarrojo.' },
      { id: 5135, enunciado: 'El efecto invernadero natural es beneficioso porque:', alternativas: { A: 'Crea el ozono.', B: 'Mantiene una temperatura apta para la vida.', C: 'Produce lluvia ácida.', D: 'Enfría el planeta.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien! Sin él, la Tierra sería un bloque de hielo.', feedback_error: 'El problema es su aumento artificial.' }
    ]
  },
  {
    id: 'test-cfis-4-9',
    seccionId: 'sec-cfis-4-9',
    preguntas: [
      { id: 5136, enunciado: 'Variable del agua de mar a medir para estudiar el derretimiento de glaciares:', alternativas: { A: 'Salinidad (baja al entrar agua dulce).', B: 'Viscosidad.', C: 'Color.', D: 'Tasa de evaporación.' }, respuesta_correcta: 'A', feedback_acierto: '¡Correcto! El hielo es agua dulce.', feedback_error: 'Diluye la sal del mar.' },
      { id: 5137, enunciado: 'Las corrientes marinas ayudan a:', alternativas: { A: 'Detener los sismos.', B: 'Distribuir el calor por el planeta.', C: 'Salalar el agua.', D: 'Aumentar la presión.' }, respuesta_correcta: 'B', feedback_acierto: '¡Exacto! Regulan el clima global.', feedback_error: 'Son los "ríos" del océano.' },
      { id: 5138, enunciado: 'El fenómeno de El Niño se caracteriza por:', alternativas: { A: 'Enfriamiento del Pacífico.', B: 'Calentamiento anormal de aguas superficiales.', C: 'Terremotos.', D: 'Nieve en el desierto siempre.' }, respuesta_correcta: 'B', feedback_acierto: '¡Bien!', feedback_error: 'Altera el régimen de lluvias.' }
    ]
  },
  {
    id: 'test-cfis-4-10',
    seccionId: 'sec-cfis-4-10',
    preguntas: [
      { id: 5139, enunciado: 'Predicción: Dorsal oceánica entre dos islas implica que estas se:', respuesta_correcta: 'A', alternativas: { A: 'Alejan.', B: 'Acercan.', C: 'Hunden.', D: 'Unen.' }, feedback_acierto: '¡Correcto!', feedback_error: 'Expansión oceánica.' },
      { id: 5140, enunciado: 'Límite que mejor explica la formación de fosas oceánicas profundas:', respuesta_correcta: 'B', alternativas: { A: 'Divergente.', B: 'Convergente (Subducción).', C: 'Transformante.', D: 'Rift continental.' }, feedback_acierto: '¡Exacto!', feedback_error: 'Una placa baja y crea el hoyo.' },
      { id: 5141, enunciado: 'Relación Presión - Altura - Temperatura en ascenso vertical:', respuesta_correcta: 'B', alternativas: { A: 'Todas suben.', B: 'P y T suelen disminuir.', C: 'P baja y T sube.', D: 'Son constantes.' }, feedback_acierto: '¡Bien!', feedback_error: 'Aire más frío y liviano arriba.' },
      { id: 5142, enunciado: 'Causa del aumento del nivel del mar por cambio climático:', respuesta_correcta: 'C', alternativas: { A: 'Más peces.', B: 'Menos lluvia.', C: 'Dilatación térmica y deshielo continental.', D: 'Evaporación.' }, feedback_acierto: '¡Correcto!', feedback_error: 'El calor expande el agua y añade hielo.' },
      { id: 5143, enunciado: 'Onda sísmica que no se propaga por fluidos (núcleo externo):', respuesta_correcta: 'B', alternativas: { A: 'P.', B: 'S.', C: 'L.', D: 'R.' }, feedback_acierto: '¡Exacto! Las transversales no pasan líquidos.', feedback_error: 'Prueba de que el núcleo externo es líquido.' },
      { id: 5144, enunciado: 'Inferencia: "A medida que pasa el tiempo, la magnitud física M de una placa disminuye". Es:', respuesta_correcta: 'D', alternativas: { A: 'Ley.', B: 'Teoría.', C: 'Variable.', D: 'Inferencia de datos.' }, feedback_acierto: '¡Bien!', feedback_error: 'Lectura de tendencia.' },
      { id: 5145, enunciado: '¿Qué es el epicentro?', respuesta_correcta: 'C', alternativas: { A: 'Donde nace el sismo abajo.', B: 'Un instrumento.', C: 'Punto superficial sobre el hipocentro.', D: 'Una falla.' }, feedback_acierto: '¡Correcto!', feedback_error: 'Proyección vertical.' },
      { id: 5146, enunciado: 'Componente mayoritario de la atmósfera terrestre:', respuesta_correcta: 'A', alternativas: { A: 'Nitrógeno (78%).', B: 'Oxígeno (21%).', C: 'CO2.', D: 'Vapor de agua.' }, feedback_acierto: '¡Exacto!', feedback_error: 'El N2 es el más abundante.' },
      { id: 5147, enunciado: 'El relieve influye en el clima al:', respuesta_correcta: 'B', alternativas: { A: 'Hacer que llueva más en el mar.', B: 'Actuar como barrera a vientos húmedos (biombo climático).', C: 'Cambiar el eje terrestre.', D: 'Nada.' }, feedback_acierto: '¡Bien!', feedback_error: 'Las nubes chocan con cerros.' },
      { id: 5148, enunciado: 'La capa de ozono nos protege de:', respuesta_correcta: 'B', alternativas: { A: 'Meteoritos.', B: 'Radiación Ultravioleta (UV).', C: 'Calor del sol.', D: 'Viento solar.' }, feedback_acierto: '¡Excelente!', feedback_error: 'Filtra rayos dañinos.' }
    ]
  }
];

async function seedCiencias() {
  console.log('🌱 Iniciando seed de Módulos de Ciencias...\n');

  const MATERIAS_CONFIG = [
    { id: 'ciencias-tp', title: 'Ciencias - Técnico Profesional', slug: 'ciencias-tp', icon: '🛠️', order: 4, isActive: true, imageUrl: 'assets/images/subjects/ciencias-tp.png' },
    { id: 'ciencias-biologia', title: 'Ciencias - Biología', slug: 'ciencias-biologia', icon: '🧬', order: 5, isActive: true, imageUrl: 'assets/images/subjects/biologia.png' },
    { id: 'ciencias-fisica', title: 'Ciencias - Física', slug: 'ciencias-fisica', icon: '⚡', order: 6, isActive: true, imageUrl: 'assets/images/subjects/fisica.png' },
    { id: 'ciencias-quimica', title: 'Ciencias - Química', slug: 'ciencias-quimica', icon: '🧪', order: 7, isActive: true, imageUrl: 'assets/images/subjects/quimica.png' }
  ];
  
  for (const mat of MATERIAS_CONFIG) {
    await db.collection('lp_materias').doc(mat.id).set(mat, { merge: true });
    console.log(`✅ Materia ${mat.id} OK.`);
  }

  const materiasActivas = MATERIAS_CONFIG.map(m => m.id);
  const capsRef = db.collection('lp_capitulos');
  for (const matId of materiasActivas) {
    const capsSnapshot = await capsRef.where('materiaId', '==', matId).get();
    for (const doc of capsSnapshot.docs) {
      const secSnap = await doc.ref.collection('secciones').get();
      for (const sDoc of secSnap.docs) await sDoc.ref.delete();
      await doc.ref.delete();
    }
  }

  console.log('\n📝 Insertando Capítulos y Secciones...');
  for (const cap of NUEVOS_CAPITULOS) {
    const capRef = db.collection('lp_capitulos').doc(cap.id);
    const capData = { ...cap };
    delete (capData as any).secciones;
    await capRef.set(capData);
    for (const sec of cap.secciones) {
      await capRef.collection('secciones').doc(sec.id).set(sec);
    }
  }

  console.log('\n📝 Insertando Tests...');
  for (const test of NUEVOS_TESTS) {
    await db.collection('lp_tests').doc(test.id).set(test);
  }

  console.log('\n🎉 Seed completado.');
}

seedCiencias().catch(console.error);
