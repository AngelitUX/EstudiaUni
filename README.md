# EstudiaUni.cl - Plataforma de Preparacion PAES

Documentacion integral, arquitectura del sistema, manual de operacion y guia de desarrollo para el monorepo de EstudiaUni.cl.

---

## 1. Descripcion General

EstudiaUni.cl es una plataforma web chilena de alto rendimiento orientada a la preparacion integral de la Prueba de Acceso a la Educacion Superior (PAES). Combina tecnicas de aprendizaje gamificado, simulacros oficiales cronometrados con resolucion asistida, un banco exhaustivo de ejercitacion tematica, herramientas vocacionales oficiales del sistema universitario chileno y un tutor inteligente impulsado por modelos de lenguaje de ultima generacion.

### Objetivos y Enfoque Pedagogico
- Democratizar el acceso a preparacion PAES de alta calidad mediante un modelo freemium accesible.
- Ofrecer una ruta de aprendizaje incremental organizada en materias, capitulos, secciones teoricas y desafios practicos.
- Simular con exactitud las condiciones de rendicion real del Departamento de Evaluacion, Medicion y Registro Educacional (DEMRE).
- Proporcionar retroalimentacion cualitativa y cuantitativa inmediata, detectando debilidades especificas por eje tematico y habilidad cognitiva.

---

## 2. Arquitectura del Sistema y Flujo de Datos

El repositorio esta estructurado como un monorepo compuesto por dos aplicaciones principales, herramientas de soporte y definiciones de infraestructura.

```
estudiauni.cl/
|-- frontend-app/          Cliente web SPA/SSR en Angular 18 (incluye landing y aplicacion privada)
|-- backend/               API REST modular en NestJS 10 (IA, pasarela de pagos, tareas admin)
|-- content/               Fuente de verdad versionada del banco de preguntas (pool_preguntas)
|-- tools/                 Scripts de validacion, subida de contenido y compilacion de metadatos
|-- pdfs/                  Documentos tecnicos y facsimiles oficiales DEMRE
|-- firestore.rules        Reglas de seguridad y control de acceso para Cloud Firestore
|-- firestore.indexes.json Indices compuestos optimizados para Firestore
|-- firebase.json          Configuracion de Firebase Hosting y enrutamiento hacia Cloud Run
|-- actualizar.bat         Script de compilacion y publicacion del frontend en Firebase Hosting
`-- desplegar-backend.bat  Script de compilacion y despliegue del backend en Google Cloud Run
```

### Patron de Comunicacion y Flujo de Datos
La aplicacion utiliza un patron hibrido de conexion directa y backend especializado:

1. **Comunicacion Directa Frontend a Cloud Firestore:**
   - La aplicacion cliente consulta y suscribe directamente a colecciones de Firestore utilizando Firebase SDK y AngularFire.
   - Aplica a: perfiles de usuario, avance en rutas de aprendizaje, historial de intentos, lectura de ensayos, preguntas, recursos y noticias.
   - La seguridad e integridad de los datos no depende de controladores intermediarios, sino de la estricta validacion declarada en `firestore.rules`.

2. **Comunicacion Frontend a Backend NestJS (`/api/**`):**
   - El backend corre de forma aislada en Google Cloud Run y es enrutado bajo el mismo dominio (`https://estudiauni.cl/api/**`) mediante las reglas de reescritura de Firebase Hosting.
   - Maneja exclusivamente operaciones de alta seguridad o consumo de servicios externos:
     - Tutor Virtual Foco (orquestacion de prompts e inferencia en Google Gemini 2.5 Flash).
     - Procesamiento de pagos y pasarela Flow.cl (creacion de transacciones, recepcion de webhooks y confirmacion criptografica).
     - Aprobacion de transferencias bancarias y administracion de suscripciones.
     - Emision e intercambio de tokens de Firebase App Check con Cloudflare Turnstile.
     - Gestion avanzada de usuarios y auditoria.

---

## 3. Modulos y Funcionalidades del Sistema

### 3.1. Ruta de Aprendizaje
Estructurada bajo una jerarquia de cuatro niveles: **Materia -> Capitulo -> Seccion -> Test**.
Cubre las ocho materias evaluadas en el proceso de admision:
- Competencia Lectora
- Competencia Matematica 1 (M1)
- Competencia Matematica 2 (M2)
- Ciencias - Biologia
- Ciencias - Fisica
- Ciencias - Quimica
- Ciencias - Tecnico Profesional
- Historia y Ciencias Sociales

#### Tipologia de Secciones
Cada seccion contiene material especializado segun su naturaleza:
- **Guias en Diapositivas (`isSlideGuide`):** Material teorico sintetico con navegacion interactiva paso a paso.
- **Minijuegos y Practicas (`isPractice`):** Evaluaciones rapidas con mecanicas variadas:
  - `categorize`: Clasificacion de elementos en contenedores semanticos.
  - `fill-blanks`: Completar oraciones con conceptos clave.
  - `synonyms`: Identificacion de vocabulario contextual.
  - `match-pairs`: Emparejamiento de conceptos, formulas o procesos.
  - `rapid`: Preguntas de respuesta veloz bajo presion temporal.
  - `true-false`: Evaluacion de enunciados directos.
  - `sort`: Ordenamiento cronologico o secuencial.
- **Secciones de Jefe (`isBoss`):** Desafios de fin de capitulo con mayor nivel de complejidad.
- **Consejos Clave (`isProTip`):** Sugerencias metodologicas y estrategias de resolucion sin evaluacion sumativa.
- **Soporte Matematico KaTeX:** Renderizado nativo de formulas matematicas complejas en M1 y M2.

### 3.2. Ensayos PAES Oficiales y Mini Ensayos
- **Ensayos Completos:**
  - Facsimiles oficiales del DEMRE categorizados por prueba, proceso de admision y temporada (invierno y regular).
  - Dos modalidades de ejecucion:
    - **Modo Real:** Temporizador estricto segun pautas oficiales, sin pausas, sin acceso a pistas, con retencion de resultados para cuentas basicas y aplicacion de cooldown de 48 horas.
    - **Modo Asistido:** Permite pausar la sesion, guardar progreso para retomar posteriormente y solicitar orientacion al tutor Foco.
- **Mini Ensayos:**
  - Evaluaciones breves y personalizables donde el usuario selecciona materia, subtemas especificos y volumen de preguntas (10, 20 o 30 preguntas).
  - **Modo Mejorador:** Capacidad de reintentar exclusivamente preguntas falladas en ensayos anteriores, calculando la tasa de superacion y afianzamiento conceptual.

### 3.3. Tutor Virtual Foco (Google Gemini 2.5 Flash)
Representado por Foco, un pulpo tutor de ocho tentaculos, uno por cada materia de la PAES. Utiliza el modelo `gemini-2.5-flash` con prompts especializados y disociados para evitar contradicciones pedagogicas:
- **Asistencia durante Examen (`ASSIST_SYSTEM_PROMPT`):** Prohibe terminantemente entregar la respuesta correcta o descartar alternativas directamente. Proporciona pistas conceptuales, preguntas guia y referencias teoricas para estimular la deduccion.
- **Revision Post-Entrega (`REVIEW_CHAT_SYSTEM_PROMPT`):** Revela la alternativa correcta, desglosa el paso a paso metodologico y analiza especificamente la opcion que el estudiante selecciono, explicitando por que era un distractor verosimil y que error conceptual provoco el fallo.
- **Orientacion Vocacional (`CAREER_CHAT_SYSTEM_PROMPT`):** Asesora en eleccion de carreras, requisitos de ponderacion y perfiles academicos.
- **Recomendaciones de Estudio (`RECOMMENDATIONS_SYSTEM_PROMPT`):** Sintetiza los ultimos registros de actividad del alumno y genera directrices concretas de refuerzo para el dashboard.
- **Procesamiento de Imagenes (Vision):** Las preguntas digitalizadas de pruebas oficiales se procesan enviando la imagen directamente a la API de Gemini, permitiendo la interpretacion de diagramas cientificos, esquemas geometricos y graficos estadisticos.

### 3.4. Herramientas Complementarias
- **Mente Veloz:** Juego de agilidad cognitiva contrarreloj con tres niveles de dificultad (Normal, Hardcore y Muerte Subita) enfocado en operaciones numericas y comprension rapida.
- **Encuentra tu Carrera:** Buscador universitario conectado a datos reales de matricula, cortes de puntaje y aranceles del sistema de admision chileno.
- **Calculadora NEM y Ranking:** Computa el promedio oficial de Ensenanza Media y su conversion a puntaje estandarizado DEMRE segun el tipo de establecimiento educacional (Cientifico-Humanista o Tecnico-Profesional).
- **Recursos Adicionales:** Repositorio filtrable de documentos tecnicos, esquemas, libros y enlaces de apoyo.

### 3.5. Panel de Administracion
Accesible unicamente para identidades verificadas registradas en la coleccion `admins`:
- Gestion centralizada del pool de preguntas y su metadata.
- Modulo de administracion de usuarios: busqueda por correo/UID, visualizacion de actividad, y otorgamiento, extension o revocacion directa de pases PRO.
- Modulo de suscripciones y pagos: revision y aprobacion manual de comprobantes de transferencia bancaria.
- Gestion del carrusel de noticias publicas del home (`news`).
- Bandeja de reportes de errores enviados por los usuarios (`bug_reports`).
- Acceso a pruebas del Modo Infinito por materia.

---

## 4. Modelo de Negocio, Planes y Limites

La plataforma opera bajo un modelo freemium sin renovacion automatica forzada.

### 4.1. Plan Basico (Gratuito)
- Acceso al primer capitulo completo de cada una de las 8 materias en la Ruta de Aprendizaje.
- Rendicion de 1 ensayo PAES en Modo Real cada 48 horas (periodo de cooldown forzado).
- Limite diario de 1 ensayo y 5 quizzes.
- 5 fichas diarias de interaccion con el tutor Foco.
- Retencion de resultados de ensayos completados durante 3 horas antes de habilitar el reporte y la revision.
- Sesiones limitadas en Mente Veloz (materias basicas, tiempos restringidos y maximo 3 sesiones por 24 horas).

### 4.2. Plan PRO (Pases por Periodo Definido)
El Plan PRO se adquiere mediante **pases de tiempo definido** (1 mes o 1 ano) pagados en una unica transaccion, sin cobros recurrentes automaticos:
- Acceso ilimitado a todos los capitulos, secciones, practicas y evaluaciones de la Ruta de Aprendizaje.
- Ensayos PAES y Mini Ensayos ilimitados, sin cooldown y con entrega inmediata de resultados.
- 500 fichas diarias para consultas con el tutor Foco.
- Acceso total a todas las materias y modalidades de Mente Veloz.
- **Pases Acumulativos:** Si el usuario adquiere un nuevo pase antes del vencimiento del periodo vigente, los nuevos dias se suman automaticamente al saldo restante (`endDate = max(now, currentEndDate) + periodo`).
- Opcion de compra para terceros (regalo de pase indicando el UID o correo del beneficiario).

### 4.3. Pasarelas de Pago y Descuentos
1. **Flow.cl:** Procesamiento de pagos en pesos chilenos (CLP) mediante Webpay, tarjetas de credito, debito y transferencias interbancarias.
2. **Transferencia Bancaria Manual:** El estudiante transfiere a la cuenta bancaria de la plataforma y carga el comprobante digital. El pase queda en estado de espera hasta su validacion en el panel admin.
3. **Cupones de Descuento:** Sistema de codigos promocionales administrados en la coleccion `discount_codes`, con reduccion porcentual o de monto fijo aplicable en el checkout.

---

## 5. Seguridad y Reglas de Base de Datos

### 5.1. Reglas de Firestore (`firestore.rules`)
Las politicas de acceso estan disenadas bajo el principio de minimo privilegio:
- **Proteccion contra Autoasignacion de Privilegios:** Los usuarios solo pueden modificar datos no criticos de su documento en `users/{uid}`. No pueden alterar los campos `plan`, `subscription.tier`, `subscription.endDate` ni `dailyCredits`.
- **Integridad de Cooldown Antifraude:** La actualizacion de `lastSimulationFinishedAt` exige validacion de reloj en el servidor (entre -10 minutos y +2 minutos respecto a `request.time`), evitando que el cliente manipule la fecha para eludir el cooldown.
- **Cumplimiento de Retencion de Resultados:** Al finalizar un intento en `intentos/{id}`, si el usuario no cuenta con un Plan PRO vigente, la regla exige que `resultsAvailableAt` sea al menos 3 horas posterior a `finishedAt`.
- **Inmutabilidad de Intentos:** Un intento completado o abandonado no puede ser eliminado ni modificado por el usuario. Durante la ejecucion solo se autoriza la mutacion del objeto `answers`.
- **Privacidad de Administradores:** La coleccion `admins/{uid}` no puede ser enumerada por usuarios comunes; cada usuario solo puede comprobar la existencia de su propio UID.

### 5.2. Proteccion contra Bots (Firebase App Check y Cloudflare Turnstile)
- La aplicacion implementa Firebase App Check empleando Cloudflare Turnstile como proveedor personalizado.
- El intercambio se efectua en el endpoint propio `POST /api/app-check/exchange`, donde el backend valida el token de Turnstile contra los servidores de Cloudflare y, tras la verificacion, genera un token firmado de App Check mediante el SDK de Firebase Admin.
- El flujo previene la ejecucion de scraping y abuso automatizado en los servicios de autenticacion y base de datos.

---

## 6. Modelo de Datos (Colecciones Firestore)

| Coleccion | Proposito | Escritura | Lectura |
|---|---|---|---|
| `users/{uid}` | Perfil, plan, vigencia de suscripcion, creditos diarios y configuracion | Usuario (restringido) / Backend Admin SDK | Usuario autenticado |
| `users/{uid}/actividad/{id}` | Registro cronologico de practicas, ensayos y racha | Usuario dueno | Usuario dueno / Admin |
| `ensayos/{id}` | Metadata de ensayos PAES oficiales | Admin | Usuario autenticado |
| `preguntas/{id}` | Preguntas asignadas a ensayos oficiales | Admin | Usuario autenticado |
| `pool_preguntas/{id}` | Banco de preguntas para Mini Ensayos, Mente Veloz y Modo Infinito | Admin / Scripts de carga | Usuario autenticado |
| `pool_preguntas_meta/summary` | Conteo consolidado de preguntas por materia y tema | Admin / Scripts | Usuario autenticado |
| `lp_materias/{id}` | Materias de la ruta con conteos precalculados | Admin / Scripts | Usuario autenticado |
| `lp_capitulos/{id}` | Capitulos de cada materia | Admin | Usuario autenticado |
| `lp_capitulos/{id}/secciones/{id}` | Secciones de contenido, guias y practicas | Admin | Usuario autenticado |
| `lp_tests/{id}` | Evaluaciones de fin de seccion | Admin | Usuario autenticado |
| `intentos/{id}` | Registro de intentos de ensayos (dueno identificado por campo `odId`) | Usuario (restringido a su UID) | Usuario dueno |
| `recursos_adicionales/{id}` | Guias, enlaces y material complementario | Admin | Usuario autenticado |
| `news/{id}` | Noticias del carrusel informativo | Admin | Publico sin autenticacion |
| `bug_reports/{id}` | Informes de error enviados por estudiantes | Usuario autenticado | Solo Admin |
| `admins/{uid}` | Lista blanca de administradores | Manual en Consola Firebase | Dueno del UID o Admin |
| `flow_payments/{token}` | Registro transaccional de pagos via Flow | Solo Backend | Solo Backend |
| `manual_payments/{id}` | Registro de transferencias bancarias manuales | Usuario (creacion) / Backend | Usuario dueno / Admin |
| `discount_codes/{code}` | Definicion de cupones de descuento | Admin / Backend | Solo Backend |

---

## 7. Pila Tecnologica (Tech Stack)

### Frontend (`frontend-app/`)
- **Framework:** Angular 18.2.0 (arquitectura basada en Standalone Components y Signals reactivos).
- **Renderizado:** Angular SSR y prerendering estatico para rutas publicas institucionales (`/`, `/login`, `/register`, `/verify-email`, `/soporte`, `/trabaja-con-nosotros`).
- **Integracion Firebase:** `@angular/fire` v18.0.1 y `firebase` v10.14.1.
- **Tipografia Matematica:** `katex` v0.16.45 para renderizado de expresiones LaTeX.
- **Procesamiento de Texto:** `marked` v17.0.5 para formateo de explicaciones del tutor.
- **Tours Guiados:** `driver.js` v1.4.0 para onboarding interactivo en el dashboard.
- **Estilos:** CSS Vanilla modularizado, variables y tokens de diseno sin dependencias pesadas de frameworks externos.

### Backend (`backend/`)
- **Framework:** NestJS 10.4.0 estructurado modularmente con TypeScript.
- **Inteligencia Artificial:** `@google/generative-ai` v0.24.1 (modelo `gemini-2.5-flash`).
- **Control de Acceso y Datos:** `firebase-admin` v12.0.0.
- **Control de Frecuencia (Rate Limiting):** `@nestjs/throttler` v6.0.0 (limite global de 60 peticiones/minuto por cliente).
- **Validacion de Entrada:** `class-validator` y `class-transformer` con exclusion forzada de propiedades no declaradas.
- **Almacenamiento Multimedia:** `cloudinary` v2.10.0 (utilizado en scripts de carga).

### Infraestructura y Servicios Externos
- **Alojamiento Web:** Firebase Hosting (distribucion estatica optimizada con politicas de cache granulares).
- **Ejecucion de API:** Google Cloud Run (servicio serverless contenerizado `estudiauni-api` en la region `southamerica-west1` - Santiago de Chile).
- **Base de Datos y Autenticacion:** Google Cloud Firestore y Firebase Auth (Correo/Contrasena y Google Identity Provider).
- **Pasarela de Pagos:** Flow.cl (integracion REST para compras directas).
- **Seguridad Web:** Cloudflare Turnstile para verificacion invisible de clientes.
- **CDN Multimedia:** Cloudinary para almacenamiento y distribucion de imagenes optimizadas en AVIF/WebP.

---

## 8. Requisitos Previos e Instalacion

### Requisitos del Sistema
- Node.js version 20 LTS o superior.
- npm version 10 o superior.
- Firebase CLI (`firebase-tools`) instalado globalmente: `npm install -g firebase-tools`.
- Google Cloud SDK (`gcloud`) configurado si se requiere el despliegue del backend.

### Pasos de Instalacion

1. **Clonar el repositorio:**
   ```bash
   git clone https://gitlab.com/MaltSolutions/estudiauni.cl.git
   cd estudiauni.cl
   ```

2. **Instalar dependencias de todo el proyecto:**
   ```bash
   npm run install:all
   ```
   *Este comando ejecuta la instalacion de paquetes en `backend/` y `frontend-app/` de forma secuencial.*

---

## 9. Variables de Entorno y Configuracion

### 9.1. Backend (`backend/.env`)
Crear el archivo `backend/.env` basandose en `backend/.env.example`:

```env
# Credenciales de Servicio Firebase
FIREBASE_PROJECT_ID=estudiauni
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@estudiauni.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Inteligencia Artificial (Google Gemini)
GEMINI_API_KEY=AIzaSy...

# Pasarela de Pagos Flow.cl
FLOW_ENVIRONMENT=sandbox
FLOW_API_KEY=tu_api_key_de_flow
FLOW_SECRET_KEY=tu_secret_key_de_flow
BACKEND_PUBLIC_URL=https://tu-url-publica-o-tunel.com

# Seguridad App Check (Cloudflare Turnstile)
TURNSTILE_SECRET_KEY=0x4AAAAAA...
FIREBASE_APP_ID=1:976475724065:web:586b9c2609d84674158660

# Servidor y CORS
PORT=3000
FRONTEND_APP_URL=http://localhost:4200
```

### 9.2. Frontend (`frontend-app/src/environments/`)
- `environment.development.ts`: Configurado para desarrollo local apuntando `apiUrl` a `http://localhost:3000` y `appCheckEnabled: false`.
- `environment.ts`: Configurado para produccion apuntando `apiUrl` a `https://estudiauni.cl` con `appCheckEnabled: true`.

---

## 10. Comandos de Desarrollo y Operaciones

### 10.1. Servidores de Desarrollo
- **Iniciar Frontend Angular:**
  ```bash
  npm run dev:app
  ```
  *Disponible en `http://localhost:4200`.*

- **Iniciar Backend NestJS:**
  ```bash
  npm run dev:backend
  ```
  *Disponible en `http://localhost:3000/api` con recarga automatica.*

### 10.2. Compilacion
- **Compilar Frontend:**
  ```bash
  npm run build:app
  ```
- **Compilar Backend:**
  ```bash
  npm run build:backend
  ```
- **Compilacion Completa:**
  ```bash
  npm run build:all
  ```

### 10.3. Gestion del Banco de Preguntas (`content/pool-preguntas/`)
La fuente de verdad del banco de preguntas reside en `content/pool-preguntas/<materiaId>/<tema>.json`.

- **Validar formato y coherencia del pool:**
  ```bash
  node tools/pool-preguntas/build.js --check
  ```
- **Verificar suficiencia para Mini Ensayos y Mente Veloz:**
  ```bash
  node tools/pool-preguntas/verificar-modulos.js
  ```
- **Subir preguntas validadas a Firestore:**
  ```bash
  node tools/pool-preguntas/upload.js --commit
  ```
- **Reconstruir documento resumen de conteos (`pool_preguntas_meta/summary`):**
  ```bash
  node tools/meta/build-meta.js --commit
  ```

### 10.4. Pruebas Aisladas y Modo de Mocks Locales
Para trabajar sin consumir cuotas de Firebase Firestore o sin conexion a internet:
1. Abrir la consola del navegador (`F12`) en `http://localhost:4200`.
2. Activar mocks locales:
   ```javascript
   localStorage.setItem('USE_LOCAL_MOCKS', 'true');
   location.reload();
   ```
   *La aplicacion leera los datos desde `frontend-app/src/assets/mocks/`.*
3. Para regresar al modo en vivo con Firestore:
   ```javascript
   localStorage.removeItem('USE_LOCAL_MOCKS');
   location.reload();
   ```

Para probar componentes de la Ruta de Aprendizaje de forma aislada sin autenticacion real:
```
http://localhost:4200/dev/ruta/comp-lectora?materia=comp-lectora&plan=free
```
*(Valores aceptados para el parametro `plan`: `free`, `pro`, `admin`).*

---

## 11. Despliegue en Produccion

### 11.1. Despliegue del Frontend (Firebase Hosting)
El script de automatizacion para Windows realiza las comprobaciones previas, compila en modo produccion con prerendering y sube el build a Firebase:

```cmd
actualizar.bat
```
El script ofrece dos opciones operativas:
- **Opcion 1 (Vista Previa):** Publica el build en una URL temporal de canal de vista previa (`preview channel`) sin afectar el sitio publico.
- **Opcion 2 (Produccion):** Despliega directamente sobre `https://estudiauni.cl`.

Para desplegar solo reglas e indices de base de datos:
```bash
npm run deploy:firestore
```

### 11.2. Despliegue del Backend (Google Cloud Run)
El despliegue del backend se realiza sobre Google Cloud Run en la region `southamerica-west1` (Santiago de Chile):

```cmd
desplegar-backend.bat
```
Este proceso empaqueta el directorio `backend/`, transfiere las variables de produccion de forma segura y genera la nueva revision del servicio `estudiauni-api`. Las solicitudes del cliente dirigidas a `https://estudiauni.cl/api/**` son absorbidas automaticamente por el proxy de Firebase Hosting y redirigidas a Cloud Run.

---

## 12. Convenciones de Codigo y Buenas Practicas

- **Idioma de Dominio:** Los terminos del modelo educativo y de negocio se mantienen en espanol (`Materia`, `Capitulo`, `Seccion`, `Pregunta`, `Intento`, `enunciado`, `alternativas`, `respuesta_correcta`).
- **Arquitectura de Componentes:** Componentes Angular Standalone con estilos encapsulados y declaracion directa.
- **Gestion del Estado:** Uso extensivo de `signals` y servicios singleton inyectables en raiz (`providedIn: 'root'`).
- **Estilos y Selectores CSS:** Los nombres de clases en nuevos componentes deben evitar colisiones con clases globales de `styles.css`. En modulos como el panel de administracion se utiliza el prefijo `admin-`.
- **Assets Multimedia:** Toda iconografia de interfaz utiliza recursos optimizados en formato AVIF (`assets/images/.../IconosAVIF/`) o vectores SVG inline. Se prohibe el uso de emojis dentro de la interfaz de usuario de la plataforma.
