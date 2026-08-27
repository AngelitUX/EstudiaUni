# EstudiaUni.cl — Documento maestro del proyecto

> **Para la IA:** este archivo es la fuente de verdad del proyecto. Léelo antes de tocar código.
> Si haces un cambio estructural (nueva feature, nueva colección de Firestore, cambio de arquitectura,
> cambio de precios/límites), **actualiza este archivo en el mismo commit**.
> Al final está la **Bitácora de avances** — anota ahí lo que vayas completando.
>
> Última actualización: 2026-08-26 (parte 4) · Rama en la que se escribió: `master`

---

## 1. Qué es EstudiaUni.cl

Plataforma web chilena de preparación para la **PAES** (Prueba de Acceso a la Educación Superior).
Combina:

- **Ruta de aprendizaje estilo Duolingo** (materias → capítulos → secciones → tests) con gamificación.
- **Ensayos PAES completos** (simulacros oficiales cronometrados) y **Mini Ensayos** configurables.
- **Foco**, el tutor IA: un pulpo de 8 tentáculos (uno por materia) impulsado por **Gemini 2.5 Flash**.
- **Herramientas**: Encuentra tu Carrera, Calculadora NEM, Recursos Adicionales, Mente Veloz.
- Modelo **freemium** (Plan Básico gratis / **Plan PRO** de pago vía Flow.cl).

Dominio previsto: `https://estudiauni.cl` · Repo: `https://gitlab.com/MaltSolutions/estudiauni.cl` (GitLab, no GitHub).
Proyecto Firebase: **`estudiauni`**.

> **Estado: EN DESARROLLO.** La app aún **no está hosteada ni en producción**. Todo corre en local
> (`localhost:4200` + backend en `localhost:3000`). Los dominios y URLs de producción que aparecen en
> el código (SEO, canonical, Cloudinary) están configurados de antemano, no reflejan un sitio vivo.

---

## 2. Arquitectura real (importante)

```
estudiauni.cl/
├── frontend-app/     ← Angular 18 (standalone components). ES LA APP COMPLETA (incl. landing)
├── backend/          ← NestJS 10. Solo IA + pagos + admin. NO está desplegado aún.
├── firestore.rules   ← Reglas de seguridad (fuente de verdad del modelo de permisos)
├── firestore.indexes.json
├── firebase.json     ← Hosting: solo el target "app"
└── pdfs/             ← PDFs oficiales DEMRE por materia (fuente de las preguntas)
```

### Cómo fluyen realmente los datos

**El frontend habla DIRECTO con Firestore para casi todo.** El backend NestJS solo se usa para
tres cosas: **IA (Foco)**, **pagos (Flow + transferencias)** y **admin de suscripciones**.

| Necesidad | Va por... |
|---|---|
| Perfil de usuario, progreso, rachas, actividad | Firestore directo (`FirestoreService`) |
| Ensayos, preguntas, intentos, respuestas | Firestore directo + JSON en `src/assets/` |
| Ruta de aprendizaje (materias/capítulos/secciones/tests) | Firestore directo (`PaesContentService`) |
| Recursos adicionales, noticias, reportes de bugs | Firestore directo |
| Chat con Foco, análisis de ensayo, recomendaciones IA | Backend NestJS `/api/ai/*` |
| Suscripciones Flow, cupones, transferencias | Backend NestJS `/api/subscriptions/*` |
| Admin de suscripciones (otorgar/revocar/aprobar) | Backend NestJS `/api/admin/*` |
| Admin: listar/filtrar usuarios, otorgar/extender/revocar Premium | Backend NestJS `/api/admin/users`, `/api/admin/subscriptions/*` |
| Pool de preguntas del panel admin | Firestore directo (`pool_preguntas`) |

### ⚠️ Divergencia de esquema backend vs frontend

El backend NestJS fue escrito contra un esquema **distinto y hoy no usado** por el frontend:

| Backend usa | Frontend usa (el real) |
|---|---|
| `attempts` | `intentos` |
| `questions` | `preguntas` / `pool_preguntas` |
| `simulations` | `ensayos` |
| `modules` + `topics` | `lp_materias` + `lp_capitulos` |
| `materias`, `secciones`, `tests` | `lp_materias`, subcolección `secciones`, `lp_tests` |

Por eso los módulos `modules-content`, `questions`, `quiz`, `simulations` y `learning-path` del backend
están efectivamente **muertos**: nadie los llama desde la app. No los "arregles" ni los borres sin
decisión explícita del equipo.

### Prerendering (SSG) para SEO — solo 6 rutas públicas (2026-08-25)

La app dejó de ser CSR puro para las páginas que le importan a Google. Con `@angular/ssr`
(`ng add @angular/ssr`, ver Bitácora 2026-08-25 para el detalle completo), `ng build` genera
**HTML ya renderizado en tiempo de build** (no un servidor corriendo en producción) para exactamente
6 rutas, listadas en `frontend-app/prerender-routes.txt`: `/`, `/login`, `/register`, `/verify-email`,
`/soporte`, `/trabaja-con-nosotros`. El resto de la app (`/dashboard`, `/ruta/*`, `/admin/*`, todo lo
que necesita sesión) sigue siendo CSR puro — no tiene sentido pre-renderizar contenido que ni Google
puede ver ni es igual para dos usuarios.

- `angular.json` → `build.options.prerender: { discoverRoutes: false, routesFile: "prerender-routes.txt" }`
  — **a propósito no usa auto-descubrimiento de rutas**: la mayoría de las rutas reales son privadas
  o tienen parámetros dinámicos, intentar pre-renderizarlas fallaría o no tendría sentido.
- El build genera **dos `index.html` distintos**: `browser/index.html` (el HTML ya armado de la ruta
  `/`) y `browser/index.csr.html` (el cascarón vacío genérico, para cualquier ruta que no esté en la
  lista de arriba). **`firebase.json` debe apuntar su rewrite catch-all a `index.csr.html`, no a
  `index.html`** — si apunta al primero, cualquier ruta privada (ej. `/dashboard`) serviría por error
  el HTML del home en la primera carga. Ya está así de correcto hoy; si alguna vez alguien lo cambia
  de vuelta a `index.html`, es un bug.
- Todo componente/servicio que corre en rutas prerenderizadas (hoy: `home.component.ts`, y
  transitivamente `app.component.ts` porque siempre se ejecuta) tiene que ser SSR-safe: nada de
  `window`/`document`/`localStorage` sin `isPlatformBrowser(inject(PLATFORM_ID))` de por medio, y
  ningún `setInterval`/`setTimeout` recursivo sin guardarlo también — Node no tiene esas APIs del
  navegador, y un timer que nunca termina cuelga el build en vez de fallar limpio. AngularFire tiene
  el mismo problema con `getAuth()`: su persistencia por defecto intenta tocar `indexedDB`/`window` de
  forma asíncrona y nunca resuelve en Node — `app.config.ts` usa `initializeAuth(..., { persistence:
  inMemoryPersistence })` en el servidor para evitarlo (ver Bitácora para el porqué exacto).
- `SeoService.init()` (ver sección de SEO, si se agrega una en el futuro) es lo que graba el
  `<title>`/`<meta description>`/`og:*`/`<link rel="canonical">` correctos **dentro del HTML
  pre-renderizado** de cada una de las 6 rutas — corre tanto en servidor como en navegador a
  propósito. Si alguna vez el `<title>` de una ruta prerenderizada aparece igual al del home en el
  HTML crudo (`view-source`), es señal de que algo antes de `seoService.init()` en la cadena de
  arranque está reventando silenciosamente en el servidor y cortando la ejecución antes de esa línea.

---

## 3. Stack técnico

### Frontend (`frontend-app/`)
- **Angular 18.2** — componentes **standalone**, `signals`, rutas con `loadComponent()` (lazy).
- **@angular/fire 18** — Auth + Firestore.
- **KaTeX 0.16** — fórmulas matemáticas (`katex.service.ts`, `math-katex.service.ts`).
- **marked 17** — render de Markdown en respuestas de Foco.
- **driver.js 1.4** — tour guiado / onboarding en el dashboard.
- Sin librería de UI: **CSS a mano**, con estilos inline en los templates y tokens en `src/styles.css`.
- Sin state manager: `signals` + servicios `providedIn: 'root'` + `localStorage`.

### Backend (`backend/`)
- **NestJS 10** + `firebase-admin` (Admin SDK).
- **@google/generative-ai** → `gemini-2.5-flash` (el paquete `openai` está instalado pero **no se usa**).
- **@nestjs/throttler**: 60 req/min global, aplicado vía `APP_GUARD` en `app.module.ts`
  (hasta 2026-08-20 el módulo estaba configurado pero **nunca aplicado** — `ThrottlerModule.forRoot()`
  solo registra la config, hace falta el `APP_GUARD` para que rija; los `@Throttle(...)` de
  `ai-feedback.controller.ts` no hacían nada mientras tanto).
- **cloudinary**: scripts de subida de imágenes (no en runtime).
- Prefijo global `/api`, `ValidationPipe` con `whitelist` + `forbidNonWhitelisted`.
- Puerto `3000` por defecto.

### Infraestructura
- **Firebase Hosting** (target `app`) sirve `frontend-app/dist/frontend-app/browser`, con rewrite SPA a `/index.html`.
- **Firestore** como única base de datos.
- **Firebase Auth**: email/password (con verificación obligatoria) + Google Sign-In.
- **Cloudinary** (`dqm3syhwr`) aloja logos, ilustraciones, videos y gifs.
- **Flow.cl** como pasarela de pago con suscripciones recurrentes.

---

## 4. Rutas de la aplicación (`app.routes.ts`)

### Públicas
| Ruta | Componente | Notas |
|---|---|---|
| `/` | `HomeComponent` | Landing completa (¡258 KB en un solo `.ts`!) |
| `/login`, `/register`, `/verify-email` | auth | `/verify-email` requiere `authGuard` |
| `/soporte` | `SoporteComponent` | Centro de ayuda |
| `/trabaja-con-nosotros` | `TrabajaComponent` | Programa de Embajadores |
| `**` | `NotFoundComponent` | `noIndex: true` |

### Privadas (`authGuard` + `emailVerifiedGuard`)
| Ruta | Qué es |
|---|---|
| `/dashboard` | Home del usuario: progreso, rachas, recomendaciones IA, Meta PAES |
| `/profile`, `/settings` | Ambas apuntan a `ProfileSettingsComponent` |
| `/ruta` | Índice de la ruta de aprendizaje |
| `/ruta/:materiaId[/:capituloId[/:seccionId]]` | Ruta genérica (fallback) |
| `/ensayos`, `/ensayo/:id/run`, `/ensayo/:id/review` | Ensayos PAES completos |
| `/mini-ensayo`, `/mini-ensayo/run`, `/mini-ensayo/review` | Mini ensayos configurables |
| `/test/:seccionId[/review]` y `/test-math/:seccionId[/review]` | Tests de sección (math tiene runner propio por LaTeX) |
| `/mente-veloz` | Juego de velocidad |
| `/encuentra-tu-carrera` | Buscador de carreras + chat vocacional con Foco |
| `/calculadora-nem` | Calculadora NEM oficial DEMRE |
| `/recursos` | Recursos adicionales (PDF/link/video/libro) |
| `/pago-resultado` | Retorno de Flow tras registrar tarjeta |
| `/modules`, `/topic/:moduleId/:topicId`, `/simulation/:attemptId` | **Legacy**, del esquema viejo |

### Admin (`authGuard` + `adminGuard`)
`/admin` (pool de preguntas) · `/admin/pregunta/:id` · `/admin/recursos` · `/admin/bugs` ·
`/admin/suscripciones` · `/admin/usuarios` (listar/filtrar/otorgar-extender-revocar Premium, 2026-08-20) ·
`/admin/modo-infinito` (selector de materia + botón para entrar al Modo Infinito de esa ruta,
2026-08-22 parte 9 — ver sección 7.1 y Bitácora)

Las 6 páginas comparten un único `AdminSidebarComponent` (`features/admin/admin-sidebar.component.ts`,
2026-08-20) — antes cada una tenía su propia copia del sidebar y se habían desincronizado (ver
Bitácora). Las páginas que necesitan contenido extra en el sidebar (los filtros por materia del pool
de preguntas) lo proyectan vía `<ng-content>`.

### ⚠️ Rutas duplicadas por materia
Biología, Física y Química tienen **componentes aislados** (`materia-biologia-path`, `materia-fisica-path`,
`materia-quimica-path`) además del genérico `materia-path`. Y cada una está registrada **dos veces**:
`/ruta/biologia` y `/ruta/ciencias-biologia` apuntan al mismo componente. Lo mismo con física y química
(`/ruta/ciencias` cae en el componente de química). **Si cambias una, revisa si hay que cambiar las demás** —
estos archivos son casi idénticos entre sí (~150 KB cada uno) y se desincronizan con facilidad.

---

## 5. Modelo de datos (Firestore)

### Colecciones vivas (las que usa la app)

| Colección | Contenido | Quién escribe |
|---|---|---|
| `users/{uid}` | Perfil, plan, suscripción, stats, créditos diarios, notas NEM, accesibilidad | Usuario (limitado) + backend |
| `users/{uid}/actividad/{id}` | Log de actividades de estudio (para racha e historial) | Usuario |
| `ensayos/{id}` | Metadata de cada ensayo PAES (`title`, `subject`, `questionCount`, `timeMinutes`, `isActive`) | Admin |
| `preguntas/{id}` | Preguntas de ensayos (`ensayoId`, `order`, `options` A–E, `correctAnswer`, `readingText`) | Admin |
| `pool_preguntas/{id}` | Banco de preguntas del panel admin (esquema `PoolPregunta`) | Admin |
| `intentos/{id}` | Intento de ensayo. **Ojo: el campo de dueño se llama `odId`, no `userId`** | Usuario |
| `lp_materias/{id}` | Materias de la ruta | Admin |
| `lp_capitulos/{id}` | Capítulos (con subcolección `secciones`) | Admin |
| `lp_tests/{id}` | Tests por sección | Admin |
| `recursos_adicionales/{id}` | Recursos (con placeholders si está vacía) | Admin |
| `news/{id}` | Noticias — **lectura pública sin auth** | Admin |
| `bug_reports/{id}` | Reportes de bugs (crea cualquier user, lee solo admin) | Usuario |
| `admins/{uid}` | Whitelist de admins. Solo se agregan **a mano** desde la consola. Lectura restringida a dueño o admin (antes cualquier autenticado podía enumerar todos los admins, 2026-08-20) | Nadie por código |

### Colecciones del backend (pagos e IA)
`manual_payments`, `flow_registrations`, `flow_subscriptions`, `flow_invoices`, `discount_codes`,
`ai_analyses`, `admin_audit_logs`, `config`.

### Colecciones legacy / muertas
`attempts`, `questions`, `simulations`, `modules`, `topics`, `materias`, `secciones` (top-level),
`tests`, `user_topic_progress`, `progreso`.

### Reglas de seguridad clave (`firestore.rules`)
Están bien pensadas — no las relajes sin entender por qué existen:

1. **El usuario no puede autoasignarse plan.** Al crear su doc no puede incluir `plan`, `subscription`
   ni `dailyCredits`. Al actualizar, no puede tocar `plan` ni `dailyCredits`.
2. **Cancelar suscripción sí, extenderla no.** Solo se permite pasar `subscription.status` a `'cancelled'`
   dejando `tier`/`startDate`/`endDate` intactos.
3. **Cooldown antifraude.** `lastSimulationFinishedAt` solo puede fijarse a "ahora" (ventana −10 min / +2 min),
   para que el cliente no retroceda la fecha y se salte el cooldown de 48 h.
4. **Retención de resultados.** Al terminar un intento, si el usuario **no es PRO**, `resultsAvailableAt`
   debe ser ≥ `finishedAt + 3 h`. El servidor de reglas lo verifica leyendo el doc del usuario.
5. **Intentos inmutables.** No se pueden borrar; en curso solo se puede escribir `answers`.

---

## 6. Modelo de negocio: planes, límites y créditos

Fuente de verdad: `backend/src/subscriptions/subscriptions.service.ts`.

### Plan Básico (gratis)
- **Ruta de Aprendizaje: solo el PRIMER capítulo de cada materia.**
  Fuente de verdad: `features/learning-path/services/learning-access.service.ts`
  (`LearningAccessService.FREE_CHAPTERS_PER_MATERIA`). No dupliques esta comprobación
  en los componentes: inyecta el servicio, o llama a `enforceLearningAccess()` en el
  constructor si es una vista a la que se puede llegar por URL directa.
- **1 ensayo PAES cada 48 horas** (cooldown, `COOLDOWN_SIMULATION_HOURS_FREE = 48`).
- **1 ensayo/día** (`FREE_TIER_LIMITS.simulation`), **5 quizzes/día**.
- **5 fichas de Foco/día** (tokens de IA).
- **Resultados retenidos 3 horas** tras terminar un ensayo.
- Mente Veloz: solo `mat1` y `comp-lectora`, tiempos de 60 s y 180 s, **3 sesiones por 24 h**.

### Plan PRO
- Ensayos y quizzes **ilimitados**, sin cooldown, resultados inmediatos.
- **500 fichas de Foco/día**.
- Todas las materias y tiempos en Mente Veloz.
- **$9.990 CLP/mes** o **$69.990 CLP/año** (definidos en `backend/src/scripts/setup-flow-plans.ts`).

### Detalles importantes
- Los **admins reciben trato PRO** en todos lados (`firebaseService.isAdmin(uid)`).
- Las fichas de Foco se consumen con `amount` variable: acciones "pesadas" (análisis completo) cuestan más
  que una pista rápida en examen.
- Los créditos se resetean por fecha (`dailyCredits.lastResetDate`).
- Se puede **regalar** una suscripción a otro usuario (`targetUid` en el flujo de pago).

### Pagos
Dos vías, ambas en `pricing-modal.component.ts`:
1. **Flow.cl** — suscripción recurrente. Flujo: `register-card` → redirect a Flow → vuelve a
   `/pago-resultado?token=…` → `flow/confirm`. Webhook en `POST /api/subscriptions/flow/webhook`.
   Requiere planes precreados con `npm run setup:flow-plans`; el backend **nunca crea planes en runtime**.
2. **Transferencia bancaria manual** — el usuario sube comprobante, queda `pending_approval`,
   y un admin lo aprueba en `/admin/suscripciones`.

También hay **cupones de descuento** (`discount_codes`, `POST /api/subscriptions/validate-coupon`).

---

## 7. Features principales

### 7.1 Ruta de Aprendizaje (el corazón del producto)
Jerarquía: **Materia → Capítulo → Sección → Test**.

Una `Seccion` puede ser de varios tipos, marcados con flags booleanos:
- `isSlideGuide` → guía en diapositivas (`guide-slides.component.ts`, datos en `guide-slides-data.ts`)
- `isPractice` + `practiceType` → minijuego. Tipos: `categorize`, `fill-blanks`, `synonyms`,
  `match-pairs`, `rapid`, `true-false`, `sort` (cada uno tiene su componente propio)
- `isBoss` → sección jefe de capítulo
- `isProTip` → consejo, sin evaluación

El contenido soporta `svgContent` (diagramas de física), `formula_latex` (KaTeX en M1/M2),
`preambulo_imagen_url` y alternativas de tipo `imagen`.

**Contenido en código, no en la nube:** `features/learning-path/data/seed-data.ts` (426 KB) y
`seed-historia.ts` (428 KB) son archivos TypeScript gigantes con todo el contenido. Hay copias
`.backup` al lado. Estos archivos se **siembran** a Firestore con los scripts del backend.

**Modo Infinito (Polígono de Maestría) — reservado para una actualización futura (2026-08-22
parte 9):** `InfiniteMasteryModalComponent` (`infinite-mastery-modal.component.ts`) existe y
funciona, pero **no está expuesto a los estudiantes**: se quitaron el selector "Ruta Principal /
Modo Infinito" y la tarjeta "Reforzar Materia" que aparecían al completar una ruta, en los 6
`materia-*-path.component.ts`. Solo se activa poniendo `activePathTab = 'infinite'`, algo que
ahora únicamente ocurre vía el query param `?mode=infinite` **y** `adminService.isAdmin()` (un
`effect()` en el constructor de cada componente, no un `ngOnInit` con `queryParams.subscribe` —
`isAdmin()` resuelve async, así que leerlo una sola vez al cargar se saltaba admins reales que
aún no habían confirmado). El único punto de entrada real es el panel de admin:
`/admin/modo-infinito` (selector de materia + botón). Ahí también se relaja `isEntirePathCompleted()`
vía `isInfiniteModeUnlocked()` para que un admin pueda entrar sin haber completado la ruta.
Si en el futuro se decide lanzar esta feature a los usuarios, hay que reintroducir el selector/tarjeta
en los 6 archivos (revisar la Bitácora de esa fecha para el diff exacto) y quitar el gate de admin.

### 7.2 Ensayos PAES
Dos modos (`type ExamMode = 'real' | 'asistido'`):
- **Real**: sin ayudas, cronómetro estricto, mide nivel real. Activa el cooldown de 48 h.
- **Asistido**: puedes pausar, salir (progreso guardado) y consultar a Foco.

Preguntas en `src/assets/*-preguntas-db.json`, nombradas por prueba y año:
`{m1,m2,b,f,h}[-invierno]-{2024,2025,2026}-preguntas-db.json`. Provienen de los PDFs oficiales
en `/pdfs/`. Muchas son **capturas escaneadas**: el campo `text` dice literalmente
`"Pregunta 5 (Ver imagen)"` y el contenido real está en la imagen — por eso el backend inyecta un
`VISION_NOTE` en los prompts de Foco.

### 7.3 Foco — el tutor IA
Pulpo mascota de 8 tentáculos. Español chileno cercano, metáforas marinas sutiles, emojis 🐙💡🌊🧠✨.
Modelo: **`gemini-2.5-flash`** con todos los `HarmBlockThreshold` en `BLOCK_NONE`.

Prompts separados según el momento — **esto es deliberado, no lo unifiques**:
- `ASSIST_SYSTEM_PROMPT` — durante el ensayo: **prohibido revelar la respuesta correcta**.
- `REVIEW_CHAT_SYSTEM_PROMPT` — en la revisión post-entrega: **sí revela la respuesta**, explica el
  procedimiento y analiza por qué la alternativa marcada era tentadora. Es un system prompt
  autocontenido, no una capa sobre el anterior, para que el modelo nunca vea la regla contradictoria.
- `CAREER_CHAT_SYSTEM_PROMPT` — orientación vocacional.
- `ANALYSIS_SYSTEM_PROMPT` / `SYNTHESIS_SYSTEM_PROMPT` — análisis de intentos (salida JSON).

### 7.4 Otras herramientas
- **Mente Veloz** — preguntas contrarreloj. Dificultades: `normal`, `hardcore`, `suddendeath`. Récords en `localStorage`.
- **Mini Ensayos** — el usuario arma su ensayo por materia/tema/cantidad. Tiene un modo `mejorador`
  que reintenta las preguntas falladas de un intento previo y calcula la mejora.
- **Encuentra tu Carrera** — buscador con datos reales de matrícula (`public/Matricula_2025_WEB_15_07_2025.csv`) + chat con Foco.
- **Calculadora NEM** — cálculo oficial DEMRE (promedio 1°–4° medio ÷ 4, truncado a 2 decimales, tabla por grupo).
- **Recursos Adicionales** — biblioteca filtrable por categoría/subcategoría/tipo.
- **Meta PAES** — objetivo de puntaje en el dashboard, con materias excluibles del promedio.

### 7.5 Gamificación y accesibilidad
- **Racha** (`studyStreak`) y **super racha** (todas las materias en un día), en `dashboard.service.ts`.
- **Tour guiado** con driver.js al primer ingreso (`hasSeenTutorial`).
- **Notificaciones push** del navegador con recordatorios por franja horaria preferida.
- **Accesibilidad** (aplicada como clases en `<body>` desde `app.component.ts`):
  `dyslexia-font`, `high-contrast`, `font-large`/`font-xlarge`, `spacing-wide`/`spacing-xwide`.
- **Navegación por teclado** (`keyboard-navigation.service.ts`) y lectura por voz en los tests.

### 7.6 Protección contra bots: Firebase App Check + Cloudflare Turnstile (2026-08-25)

`app.config.ts` inicializa **App Check** con un **Custom Provider** que usa **Cloudflare
Turnstile** (widget invisible, sin acertijos visuales) como mecanismo de verificación —
alternativa gratuita a reCAPTCHA Enterprise. Detalle completo en la Bitácora 2026-08-25
(parte 2); acá solo lo que hay que saber para no romperlo:

- **El "intercambio de token" NO pasa por la extensión oficial de Firebase**
  (`cloudflare-turnstile-app-check-provider`). Esa extensión despliega su propia Cloud
  Function, pero la versión publicada en el Extensions Hub todavía declara el runtime
  `nodejs18` — dado de baja por Google Cloud para despliegues nuevos — así que su
  instalación falla siempre con `RESOURCE_ERROR / DEPLOYS_NOT_ALLOWED`. No es un error de
  configuración: es la extensión desactualizada. Mientras Cloudflare no republique una
  versión corregida, **no reintentar instalarla**.
- En su lugar, el intercambio ocurre en el propio backend: `backend/src/app-check/` (nuevo
  módulo) recibe el token de Turnstile, lo verifica contra
  `https://challenges.cloudflare.com/turnstile/v0/siteverify` con `TURNSTILE_SECRET_KEY`, y
  si es válido emite un token real de Firebase App Check con
  `firebaseService.appCheck.createToken()` (Admin SDK, ya inicializado en `FirebaseService`).
  Sin Cloud Functions, sin Artifact Registry, sin Secret Manager.
- El endpoint (`POST /api/app-check/exchange`) es a propósito el único en todo el backend
  **sin ningún guard** — es el mecanismo de verificación en sí mismo, no puede exigir un
  token de App Check para llegar hasta ahí. Lo protege la verificación contra Cloudflare,
  no un `@UseGuards`.
- El formato de respuesta (`{ token, expireTimeMillis }`) no es arbitrario: es el que espera
  `CloudflareProviderOptions` (paquete `@cloudflare/turnstile-firebase-app-check`, ya
  instalado en el frontend) — el Admin SDK devuelve `ttlMillis` en vez de
  `expireTimeMillis`, hay que convertirlo (`Date.now() + ttlMillis`) o el cliente no sabe
  interpretar el token.
- **`AppCheckGuard`** (`backend/src/common/guards/app-check.guard.ts`) existe y sigue el
  mismo patrón que `FirebaseAuthGuard`, pero **no está atado a ningún controlador
  todavía** — a propósito, hasta que el sitekey real esté puesto y probado de punta a punta
  (atarlo antes le cortaría el acceso a esos endpoints de inmediato). Sirve para proteger
  endpoints propios del backend (Foco, suscripciones, admin) — **no** para login/registro/
  recuperar-contraseña, que van directo del navegador a Firebase Auth y nunca tocan este
  backend; a esas 3 páginas las protege la aplicación de App Check a nivel de Firebase, sin
  necesidad de ningún guard propio.
- **SSR:** `provideAppCheck(...)` en `app.config.ts` solo se registra si
  `typeof window !== 'undefined'` — ni siquiera se intenta en el servidor. No es solo que
  `initializeAppCheck()` no sirva en Node: el constructor de `CloudflareProviderOptions` toca
  `document.body` directamente para inyectar el widget, así que instanciar la clase ya
  revienta ahí. Nada de lo que se prerenderiza necesita un token de App Check.
- **Activar/desactivar la protección real** (una vez que todo esté probado) se hace **desde
  la consola de Firebase, no desde Cloudflare**: Firebase Console → Build → App Check →
  pestaña "APIs" → cada servicio (Cloud Firestore, Authentication, etc.) tiene su propio
  interruptor "Sin aplicar" (Supervisión, recoge métricas sin bloquear) / "Aplicar"
  (bloquea de verdad). Cloudflare solo administra el widget de Turnstile en sí (sitekey,
  dominio, modo) — no tiene ningún concepto de "aplicar" para servicios de Firebase.
  Recomendación de Google: dejarlo en "Sin aplicar" al menos una semana mirando la
  proporción de peticiones verificadas/no verificadas antes de pasar a "Aplicar".
- **Ojo al copiar sitekeys/secrets**: un sitekey/secret de reCAPTCHA empieza con `6L...`; uno
  de Turnstile empieza con `0x4AAAAAA...`. Son productos de Google y de Cloudflare
  respectivamente — no intercambiables. La pantalla de "Apps" de App Check en Firebase
  Console sugiere reCAPTCHA Enterprise por defecto (con un sitekey `6L...` ya cargado); eso
  es independiente del Custom Provider que este proyecto usa y no hace falta tocarlo ni
  registrar nada ahí para que Turnstile funcione.

---

## 8. Convenciones de código

- **Idioma mezclado a propósito**: la UI, los nombres de dominio (`Materia`, `Capitulo`, `Seccion`,
  `Pregunta`, `Intento`, `enunciado`, `alternativas`, `respuesta_correcta`) y los comentarios de negocio
  van **en español**. Los comentarios técnicos explicativos suelen estar **en inglés**. Mantén ese patrón.
- **Componentes standalone con template + estilos inline** en el mismo `.ts`. Por eso hay archivos de
  100–250 KB. Es el estilo de la casa; no los partas en `.html`/`.css` salvo que te lo pidan.
- **Signals** para estado (`signal()`, `WritableSignal`), `inject()` en vez de constructor injection.
- **Sidebar duplicada**: cada página de nivel superior reimplementa su propia sidebar y menú móvil
  en el template. Si cambias un ítem de navegación, hay que cambiarlo en **todas**: dashboard,
  ensayos-list, mente-veloz, career-finder, recursos, nem-calculator, learning-path.
  **Excepción: el panel admin ya NO duplica su sidebar** (ver sección 4) — desde 2026-08-20 las
  5 páginas de `/admin/*` comparten `AdminSidebarComponent`. Si agregas una página admin nueva,
  usa ese componente en vez de copiar el patrón viejo.
- **Ojo con nombres de clase CSS genéricos en componentes nuevos**: `styles.css` tiene bloques
  globales tipo "GLOBAL SIDEBAR STYLES" / "STANDARD DASHBOARD HEADER STYLES" con `!important`
  sobre selectores como `.sidebar`, `.sidebar-header`, `.main-content`, `.nav-item`, pensados para
  el sidebar del dashboard/ruta de aprendizaje. Si un componente nuevo reutiliza esos mismos
  nombres de clase, el CSS global le gana al del componente (aunque tenga más especificidad —
  el global usa `!important`), sin ningún error visible. Esto rompió el panel admin dos veces
  (2026-08-20, ver Bitácora) hasta que se renombraron sus clases con prefijo `admin-` (`.admin-sidebar`,
  `.admin-main-content`, etc.). Antes de nombrar una clase nueva, `grep` rápido sobre `styles.css`.
- **Nada de emojis nuevos en la UI**: hubo un commit dedicado a quitarlos (`080f8f8a`). Se usan
  **SVG desde `assets/images/Nuevos VideosEIlustraciones/iconosSVG/`**.
- Estilos: tokens CSS en `src/styles.css` (`--accent-primary: #855cd6` morado de marca,
  `--accent-secondary: #1cb0f6`, fuentes `Outfit` para títulos e `Inter` para cuerpo).

---

## 9. Comandos

```bash
npm run dev:app
```
```bash
npm run dev:backend
```
```bash
npm run build:app
```
```bash
npm run deploy:app
```
```bash
npm run deploy:firestore
```

Sembrar contenido de la ruta a Firestore (desde `backend/`):
```bash
node scratch/push-mock-to-firestore.js
```

Crear los planes recurrentes en Flow (una sola vez):
```bash
cd backend && npm run setup:flow-plans
```

> Los scripts `*:landing` fueron eliminados del `package.json` (2026-08-18): el landing dejó de ser un
> proyecto aparte y ahora vive dentro de la app Angular como `features/auth/home.component.ts`.

### Banco de pruebas de la Ruta (`/dev/ruta`) — solo desarrollo

La Ruta vive detrás de `authGuard` + `emailVerifiedGuard`, así que no se puede revisar
su diseño sin una cuenta real. Para eso existe `features/dev/ruta-harness.component.ts`,
que monta los componentes **reales** con dobles de `Auth`, `FirestoreService` y
`AdminService`:

```
http://localhost:4200/dev/ruta/comp-lectora?materia=comp-lectora&plan=free
```

`plan` acepta `free`, `pro` o `admin`. Materias con contenido offline suficiente:
`comp-lectora` (3 capítulos) e `historia` (5). `Firestore` se inyecta como objeto vacío
a propósito, así que el contenido sale del fallback local (`seed-data.ts`), **no de la BD**.

**Cómo se mantiene fuera de producción:** `app.routes.ts` (producción) no menciona el
harness. En desarrollo se sustituye por `app.routes.dev.ts` vía `fileReplacements`.
Ambos componen `app.routes.base.ts`, que tiene las rutas reales y el comodín 404.

> Se intentó primero con `if (environment.production) return []` y **no sirvió**: el
> `import()` dinámico generaba su chunk igual y el harness acababa en el bundle de
> producción. Verificado con `grep` sobre `dist/` — por eso la separación es a nivel de
> build. Si tocas esto, vuelve a comprobarlo:
> `grep -rl "DevRutaHarness\|dev/ruta" dist/frontend-app/browser/`

### Modo mocks locales (desarrollo sin gastar cuota de Firebase)
En la consola del navegador:
```javascript
localStorage.setItem('USE_LOCAL_MOCKS', 'true'); location.reload();
```
Lee de `frontend-app/src/assets/mocks/*-mock-local.json` (excluidos de git). Para volver a Firestore:
```javascript
localStorage.removeItem('USE_LOCAL_MOCKS'); location.reload();
```
Ver `README_TESTING.md` para el detalle completo.

---

## 10. Variables de entorno (`backend/.env`)

```
FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY
OPENAI_API_KEY          # declarado pero NO usado — el proveedor real es Gemini
CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET
FLOW_ENVIRONMENT (sandbox|production) / FLOW_API_KEY / FLOW_SECRET_KEY / FLOW_BASE_URL
FLOW_PLAN_ID_MONTHLY / FLOW_PLAN_ID_YEARLY
BACKEND_PUBLIC_URL      # URL HTTPS pública para el webhook Y el retorno de registro de Flow (en
                        # dev: un túnel — ver "Probar Flow en local" más abajo. Se recomienda
                        # `cloudflared` sobre `ngrok`: varios antivirus ponen en cuarentena el
                        # binario de ngrok como falso positivo, porque malware real también lo usa
                        # para túneles C2 — ver Bitácora 2026-08-25 parte 3)
TURNSTILE_SECRET_KEY    # Secret key de Cloudflare Turnstile (empieza con "0x4AAAAAA...").
                        # La usa AppCheckService (src/app-check/) — ver sección 7.6 y Bitácora
                        # 2026-08-25 (parte 2). Nunca es la misma clave que un sitekey de
                        # reCAPTCHA (esas empiezan con "6L...") — son productos distintos.
FIREBASE_APP_ID         # Opcional: mismo valor que appId en environment.ts del frontend. Si
                        # se omite, AppCheckService usa el valor real del proyecto como default.
```

Falta declarar la variable de la API key de Gemini en `.env.example` (el servicio la lee vía
`ConfigService` en `ai-feedback.service.ts` — verificar el nombre exacto antes de documentarlo).

Flow **no publica credenciales de sandbox compartidas**: cada comercio crea su cuenta en
`sandbox.flow.cl` y saca su propio API Key + Secret Key.

### Probar Flow en local (cada desarrollador necesita esto una vez)

`backend/.env` no viaja en git (está en `.gitignore`) — a propósito, nunca hay que forzar su
inclusión. Por eso, después de un `git pull` con estos cambios, la pasarela sigue fallando con
"Failed to fetch" o "apiKey not found" hasta que cada quien complete su `.env` local (ambos
errores diagnosticados en la Bitácora 2026-08-25 parte 3).

**La cuenta de sandbox y el API Key/Secret Key SÍ se pueden compartir entre todo el equipo** —
es dinero de mentira, no hay ningún riesgo en que varios usen la misma cuenta de prueba. Lo único
que es genuinamente por-máquina es el túnel (`BACKEND_PUBLIC_URL`), porque apunta al backend
local de cada quien. Camino recomendado para un equipo:

1. **Una sola persona** crea la cuenta en `sandbox.flow.cl` (Mi Cuenta → API Keys) y comparte
   `FLOW_API_KEY`/`FLOW_SECRET_KEY` con el resto por un canal privado — Slack/Discord DM, gestor
   de contraseñas del equipo — **nunca por commit ni por chat público**.
2. Esa misma persona corre `npm run setup:flow-plans` **una sola vez** contra esa cuenta y
   comparte los dos `FLOW_PLAN_ID_...` que imprime junto con las claves de arriba. `setup-flow-plans.ts`
   usa IDs fijos (`pro-mensual` / `pro-anual`, no un ID generado al azar por corrida) — por eso
   estos valores son igual de compartibles que las claves, cualquiera que corra el script otra vez
   contra la misma cuenta se encontrará con que esos planes ya existen.
3. **Cada desarrollador**, individualmente, levanta su propio túnel:
   ```bash
   cloudflared tunnel --url http://localhost:3000
   ```
   (`winget install --id Cloudflare.cloudflared` si no lo tienes — no ngrok, ver nota de
   `BACKEND_PUBLIC_URL` arriba) y completa su `backend/.env` con las 4 credenciales compartidas
   (`FLOW_ENVIRONMENT=sandbox`, `FLOW_API_KEY`, `FLOW_SECRET_KEY`, `FLOW_PLAN_ID_MONTHLY`,
   `FLOW_PLAN_ID_YEARLY`) más su propia `BACKEND_PUBLIC_URL` (la URL de SU túnel, sin `/` final).
4. Levantar `npm run dev:backend` y `npm run dev:app` como siempre. Al suscribirse, usar la
   tarjeta de prueba de Flow: `4051885600446623`, cualquier fecha futura, CVV `123` (si pide un
   RUT/PIN de banco simulado: `11111111-1` / `123`).

Si alguien prefiere aislar sus pruebas del resto del equipo, nada impide que en vez de esto se
cree su propia cuenta de sandbox y corra `setup:flow-plans` por su cuenta — son pasos idénticos,
solo que sin compartir nada con nadie.

Si el túnel de alguien se reinicia, su `BACKEND_PUBLIC_URL` cambia — eso NO afecta a los demás ni
requiere volver a correr `setup:flow-plans` (el `urlCallback` guardado en el plan solo importa
para el webhook de cobros recurrentes, no para el ida-y-vuelta del navegador al registrar una
tarjeta), solo hay que actualizar el `.env` de esa persona.

---

## 11. Estado del proyecto y pendientes conocidos

### ✅ Funcionando
Auth completo (email + Google, con verificación y migración de UID), ruta de aprendizaje de las 8 materias,
ensayos PAES en ambos modos, mini ensayos, Mente Veloz, Foco IA en todos sus contextos, panel admin
(preguntas, recursos, bugs, suscripciones, **usuarios** — listar/filtrar/otorgar-extender-revocar Premium,
2026-08-20), calculadora NEM, buscador de carreras, sistema freemium con
límites y cooldowns, reglas de Firestore endurecidas, SEO (meta tags dinámicos, canonical, JSON-LD,
sitemap, robots), accesibilidad, notificaciones, landing con videos, **pagos con Flow probados de
punta a punta en sandbox** (registro de tarjeta → suscripción → Premium activo, 2026-08-25) y
transferencia bancaria manual con comprobante subido por el usuario.

### 🔴 Bloqueantes para el primer despliegue
> **El FRONTEND ya está en producción en `https://estudiauni.cl`** (Firebase Hosting, target `app`).
> Se despliega con `actualizar.bat` en la raíz del repo — ver Bitácora 2026-08-26 (parte 3).
> **El BACKEND NestJS sigue sin desplegar en ningún lado**, y eso es lo que hace que el punto 1 de
> abajo sea el bloqueante real: en el sitio publicado no funciona nada que pase por el backend
> (Foco, análisis IA, pagos Flow, cupones, transferencias, panel de suscripciones).

1. **`environment.ts` (el de producción) apunta a `apiUrl: 'http://localhost:3000'`.**
   > **Estado 2026-08-26 (parte 4):** el backend ya está PREPARADO para Cloud Run (Dockerfile
   > verificado, `desplegar-backend.bat`, generación de variables de entorno). Solo faltan dos cosas
   > que dependen del dueño de la cuenta: **activar el plan Blaze** e **instalar `gcloud`**. Después,
   > el rewrite `/api/**` de `firebase.json` deja el backend en el mismo dominio y este bloqueante
   > desaparece. Ver Bitácora 2026-08-26 (parte 4).

   Si se despliega
   así, en la web publicada fallará todo lo que pasa por el backend: chat con Foco, análisis IA, pagos
   con Flow, cupones, transferencias y el admin de suscripciones. Hay que desplegar NestJS
   (Cloud Run / Render / Railway) y apuntar `environment.ts` a esa URL HTTPS, agregarla al
   `enableCors` de `main.ts` y ponerla en `BACKEND_PUBLIC_URL`.
2. **Flow en producción.** El sandbox ya se probó de punta a punta con éxito (2026-08-25). Falta
   pasar `FLOW_ENVIRONMENT=production` con credenciales reales de `www.flow.cl` (no las de
   sandbox — son cuentas distintas, ver sección 10) y ejecutar `setup:flow-plans` contra
   producción para generar los planes reales.
3. **Rotar la API secret de Cloudinary.** Ya se quitó del código (2026-08-18), pero **sigue en el
   historial de git**, así que hay que generar una nueva en
   https://console.cloudinary.com/ (Settings → API Keys) y ponerla en `backend/.env`.
   Mientras no se rote, la clave filtrada sigue siendo válida.
4. **`backend/.env` tiene `CLOUDINARY_*` vacías.** Los scripts de subida de imágenes ya no traen
   credenciales por defecto: hay que rellenarlas o abortan con un mensaje claro.

### 🔒 Hallazgo de seguridad: PDFs oficiales con sus solucionarios en el build
`frontend-app/src/assets/pruebasDemre/` contiene **107 MB**: los PDFs oficiales DEMRE de todas las
pruebas **junto a sus `*-SOLUCION.pdf`**, más los scripts de extracción y un `node_modules` completo
de la herramienta `pdf-cropper-tool`.

Como Angular copia `src/assets` entero al build, todo eso terminaba en `dist/` y se habría servido
público en `https://estudiauni.cl/assets/pruebasDemre/…` — es decir, **cualquiera habría podido
descargar las claves de respuestas de las pruebas que la plataforma cobra**, sin siquiera registrarse.

**Corregido (2026-08-18):** `angular.json` ahora excluye `pruebasDemre/**` del empaquetado.
Los archivos siguen en disco para el flujo de extracción de contenido; simplemente ya no se publican.
Verificado: build limpio, 0 PDFs en `dist/`, y los 30 JSON de preguntas + imágenes + katex + mocks
siguen presentes.

⚠️ **Si alguien vuelve a agregar assets pesados o sensibles, revisar esa exclusión.**

> **2026-08-25:** la carpeta gemela `frontend-app/src/pruebasDemre/` (fuera de `assets/`, la que usaba
> `npm run cropper` y nunca se empaquetó) se **eliminó por completo** — confirmado que ya no hacía
> falta. El script `"cropper"` también se quitó de `package.json`. `frontend-app/src/assets/pruebasDemre/`
> (la de este hallazgo, con los PDFs+soluciones, 107 MB) **sigue existiendo** — es una decisión
> distinta (contenido potencialmente sensible que quizás aún se necesite), no se tocó.

### 🟡 Deuda técnica
- **Peso de `assets/images/` — reducido de 293 MB a ~85 MB (2026-08-25)**, eliminando lo que
  resultó ser huérfano (nada en el código lo referenciaba, verificado con `grep` antes de borrar):
  `subjects/*.png` (42 MB, ya reemplazados por `subjectsAVIF/*.avif`), un `.mp4` de 18 MB sin ningún
  `<video>` que lo apuntara, y las 6 carpetas `L-*-IMAGENES` de comprensión lectora (149 MB) — estas
  últimas resultaron ser contenido a medio terminar: hay scripts (`generate-lenguaje.js`,
  `generate-l-2025.js`) pensados para generar un banco de preguntas de Lectura a partir de esas
  imágenes, pero el JSON que deberían producir nunca se generó ni se conectó a la app. Lo que queda
  y **sí se usa** (`GifsFocoWEBP/` 46 MB, `iconosSVG/`+`avatarsSVG/` ~7 MB con SVGs mal exportados
  — vectorizados automáticamente desde una ilustración en vez de ser vectores reales, por eso pesan
  cientos de KB en vez de unos pocos) sigue pendiente de optimizar — ver Bitácora 2026-08-25 para las
  especificaciones exactas de conversión (WebP animado → video, SVG → AVIF).
- **1182 archivos de `node_modules` versionados en git**, de `pdf-cropper-tool` — antes duplicados en
  `src/pruebasDemre/` y `src/assets/pruebasDemre/`, ahora solo en el segundo (el primero se eliminó,
  ver arriba). Para sacar los que quedan (591 archivos) hace falta correr (afecta a los working
  copies del equipo): `git rm -r --cached "frontend-app/src/assets/pruebasDemre/pdf-cropper-tool/node_modules"`
- El cache de despliegue `.firebase/*.cache` estaba versionado (uno referencia el `frontend-landing`
  ya inexistente). Ya está en `.gitignore`; falta `git rm -r --cached .firebase` para desindexarlo.
- `backend/.env` conserva variables `WEBPAY_*` de la pasarela anterior a Flow. Ningún archivo las lee.
- Módulos backend muertos: `modules-content`, `questions`, `quiz`, `simulations`, `learning-path`.
- ~40 scripts sueltos de seed/limpieza en `backend/src/` raíz (`seed-*.ts`, `clean-*.ts`, `check-*.ts`)
  que deberían vivir en `src/scripts/`.
- Archivos `.backup.ts` de contenido versionados junto a los originales (>1 MB entre ambos).
- Componentes `materia-*-path.component.ts` casi idénticos (~150 KB × 5) — se desincronizan.
- Sidebar duplicada en 8+ componentes del sitio general (dashboard, ensayos-list, mente-veloz,
  career-finder, recursos, nem-calculator, learning-path). **El panel admin ya no tiene este
  problema** (unificado en `AdminSidebarComponent`, 2026-08-20) — si se quiere replicar el patrón
  para el resto del sitio, es un trabajo aparte, no trivial por las clases CSS globales con las
  que colisiona (ver sección 8).
- Sin tests: `karma`/`jasmine` y `jest` configurados, cero specs escritos.
- El proyecto vive en `master` con ramas de feature mergeadas vía MR; hay 15+ ramas remotas viejas.

---

## 12. Bitácora de avances

> Anota aquí cada avance relevante, con fecha, para que la próxima conversación sepa dónde quedó todo.
> Formato: `### AAAA-MM-DD — Título` + qué se hizo + qué quedó pendiente.

### 2026-08-26 (parte 4) — Backend preparado para Cloud Run: Dockerfile verificado, arranque
endurecido para contenedor, y `desplegar-backend.bat`. Falta activar Blaze e instalar gcloud
`nest build` ✅ · **etapa de compilación del Dockerfile verificada de verdad**, no solo escrita:
se reprodujo el contexto exacto que vería Docker (aplicando `.dockerignore`) en una carpeta limpia,
con `npm ci` + `npm run build` + arranque real con `npm ci --omit=dev`. Pendientes reales al final.

**Contexto:** los pagos (Flow) quedan fuera de esta tanda a pedido explícito — los ve otra persona.
Esto cubre lo demás: dejar el backend listo para desplegar.

**Decisión: Cloud Run, no Cloud Functions ni Render.** Razones concretas, no preferencia:
- Es el encaje natural para un NestJS de toda la vida: corre `node dist/main.js` sin reescribir nada.
  Cloud Functions obligaría a envolver el Express de Nest en un `onRequest` y sufre *cold starts*
  visibles justo en lo más interactivo (el chat con Foco).
- **Firebase Hosting puede enrutar `/api/**` directo al servicio de Cloud Run** con un `rewrite` en
  `firebase.json`. Eso deja el backend en `estudiauni.cl/api/...`: mismo origen, sin CORS, y sin una
  URL de backend que se pueda escribir mal — que es exactamente el bloqueante #1 de la sección 11.
- Mismo proyecto de Google que Firebase: una sola cuenta, una sola factura.
- Render/Railway son más simples de configurar pero sus planes gratuitos duermen el servidor
  (30-60 s para despertar) y añaden otra plataforma que mantener.

**Nuevo: `backend/Dockerfile`** — dos etapas. La primera instala todo (incluidas devDependencies:
el CLI de Nest y TypeScript) y compila; la segunda instala solo producción y copia el `dist`.
Medido: `node_modules` pasa de **407 MB a 114 MB** entre una etapa y otra.
- `CMD ["node", "dist/main.js"]` y **no** `npm start`: npm se queda como proceso intermedio y no
  reenvía `SIGTERM` al proceso de Node, así que Cloud Run acabaría matando el contenedor a la fuerza
  en cada reinicio en vez de dejarlo cerrar ordenadamente.
- **Verificado end-to-end sin Docker instalado**, reproduciendo el contexto a mano: `npm ci` ✅,
  `npm run build` ✅ (`dist/main.js` generado), y —lo que de verdad importaba— **arranque real con
  solo dependencias de producción**: la app levanta, registra todos los módulos y mapea todas las
  rutas, sin ningún `MODULE_NOT_FOUND`. Si algo del runtime hubiera importado una devDependency,
  habría reventado en Cloud Run y no antes.

**Nuevo: `backend/.dockerignore`.** Lo más importante que hace es **excluir `.env`**: una imagen de
contenedor es solo un archivo, y quien pueda descargarla vería las claves. Los secretos van como
variables de entorno de Cloud Run.
> ⚠️ **No excluir `src/scripts/`**, aunque sean scripts. El `tsconfig` compila todo `src/**` y
> `src/upload-quimica.ts` importa `./scripts/cloudinary.config`; sin esa carpeta el `npm run build`
> de la etapa 1 falla. Se descubrió al verificar el build, no al escribirlo. `scratch` sí se excluye
> (el propio tsconfig ya lo excluye y nada en `src` lo importa).

**`backend/src/main.ts`, dos cambios para contenedor:**
- `app.listen(port, '0.0.0.0')` explícito. Dentro de un contenedor, un proceso atado solo a la
  interfaz por defecto no es alcanzable desde fuera y Cloud Run lo da por caído aunque esté vivo.
  `PORT` ya se leía bien (Cloud Run inyecta 8080; en local se cae al 3000 de siempre).
- **CORS acepta varios orígenes separados por coma** en `FRONTEND_APP_URL`
  (`https://estudiauni.cl,https://estudiauni.web.app`). Antes solo cabía uno y el sitio se sirve
  desde dos dominios. Nota: a través del rewrite `/api/**` la petición es del mismo origen y CORS ni
  siquiera entra en juego — esto importa al llamar la URL de Cloud Run directamente, por ejemplo
  para probar antes de montar el rewrite.

**Nuevo: `desplegar-backend.bat`** (raíz del repo), con el mismo patrón que `actualizar.bat`:
comprobaciones previas (Node, gcloud, sesión de gcloud, `backend/.env`, Dockerfile), aviso explícito
de que **requiere plan Blaze** y de que la primera construcción tarda 5-10 min, confirmación escrita
(`SI`), y al terminar imprime los 3 pasos que faltan para conectarlo al sitio. Despliega a la región
**`southamerica-west1` (Santiago)**: es donde están los usuarios y la latencia contra un servidor en
EE.UU. se nota en el chat con Foco. Va con `--allow-unauthenticated` a propósito — el servicio tiene
que ser alcanzable desde el navegador de cualquier visitante; la autenticación real la hace la app
con el token de Firebase en cada petición (`FirebaseAuthGuard`), no el control de acceso de Google.

**Nuevo: `backend/scripts-deploy/generar-env-yaml.js`** — convierte `backend/.env` en el YAML que
espera `gcloud run deploy --env-vars-file`. Hace falta un archivo y no `--set-env-vars` porque
`FIREBASE_PRIVATE_KEY` es una clave PEM multilínea, y pasarla por línea de comandos en Windows es
una fuente inagotable de errores de comillas.

> 🔴 **Bug real encontrado al verificarlo, que habría roto Firebase Admin en producción.** La primera
> versión traía un parser de `.env` hecho a mano. En el `.env` la clave está en UNA sola línea con
> `\n` **literales** (barra + n), y `dotenv` los convierte en saltos reales al leer; el parser propio
> los copiaba tal cual y encima el escapado les añadía otra barra. Resultado medido: la clave llegaba
> con **1732 caracteres en 1 línea** en vez de **1704 en 29**, sin el `-----END PRIVATE KEY-----`.
> Firebase Admin la habría rechazado. Se arregló usando **el mismo `dotenv` que usa el backend** en
> vez de un parser propio: así el servidor y el script interpretan el archivo idénticamente por
> construcción, no por coincidencia. Verificado tras el cambio: los 4 valores idénticos byte a byte
> y la clave con sus 29 líneas, `BEGIN` y `END` correctos.
>
> El script omite a propósito `PORT` (lo inyecta Cloud Run; fijarlo rompería el arranque), las
> `WEBPAY_*` (pasarela anterior a Flow, nadie las lee) y `OPENAI_API_KEY` (declarada sin uso). Nunca
> imprime valores, solo nombres. El YAML generado está en `.gitignore` y el `.bat` lo borra al
> terminar, vaya bien o mal.

**Lo que NO se hizo, deliberadamente:** no se tocaron `firebase.json` ni `environment.ts`. El rewrite
de `/api/**` apunta a un servicio de Cloud Run que **todavía no existe**, y dejarlo puesto haría que
`firebase deploy` fallara — es decir, rompería la capacidad de publicar el sitio. Se aplican los dos
juntos justo después del primer despliegue del backend (los pasos exactos los imprime el propio
`desplegar-backend.bat` al terminar).

**Ojo con `apiUrl`, que es una trampa:** el frontend hace `environment.apiUrl || 'http://localhost:3000'`
en **22 sitios**. Dejar `apiUrl` como cadena vacía para usar el mismo origen NO funciona: la cadena
vacía es *falsy* y caería al localhost. Hay que poner la URL completa: `https://estudiauni.cl`.

**Pendiente, y solo lo puede hacer el dueño de la cuenta:**
1. **Activar el plan Blaze** en la consola de Firebase. Cloud Run no existe en el plan gratuito. No es
   un gasto que añada esta decisión: la auditoría del 2026-08-18 ya concluyó que hace falta Blaze de
   todos modos, porque con ~200 usuarios se superan las 50.000 lecturas diarias de Firestore del plan
   gratuito. Cloud Run tiene capa gratuita amplia (2 millones de peticiones/mes); para una beta el
   costo es prácticamente cero.
2. **Instalar el SDK de Google Cloud** (`gcloud`) y hacer `gcloud auth login`. No está en esta
   máquina, así que **el despliegue real no se pudo ejecutar ni probar en esta sesión** — lo que sí
   está verificado es todo lo que rodea al comando (build, arranque con deps de producción, generación
   de variables) y las rutas de guarda del `.bat`.
3. Tras el primer despliegue: aplicar el rewrite + `apiUrl` y publicar con `actualizar.bat`.

### 2026-08-26 (parte 3) — Primer despliegue a producción desde este setup: `actualizar.bat`, y el
reporte de errores del navegador que se iba a colar al sitio publicado
Typecheck ✅ · `ng build --configuration production` ✅ con las 6 rutas prerenderizadas · **desplegado
a `https://estudiauni.cl` y verificado en vivo** (no solo "deploy complete") · vista previa publicada
y verificada antes de tocar producción.

**El sitio YA estaba hosteado — este documento decía lo contrario.** Hasta hoy la sección 11 afirmaba
"el proyecto está en desarrollo, aún NO está hosteado ni en producción". Falso desde hace meses:
`estudiauni.cl` servía una beta cuyo último release era del **2026-03-30**. Corregido en la sección 11.

**Nuevo: `actualizar.bat` en la raíz del repo.** Script de despliegue de Hosting para Windows, pensado
para que actualizar el sitio no dependa de recordar comandos. Qué hace y por qué está hecho así:
- Pregunta primero el modo: **[1] vista previa** (canal `preview` de Firebase Hosting, URL temporal y
  secreta que caduca en 7 días, no toca el sitio real) o **[2] producción**. La vista previa es el
  camino recomendado: se revisa ahí y solo entonces se publica.
- **Dos confirmaciones escritas para producción** (`SI`, y después de compilar, `DESPLEGAR`). La
  segunda va a propósito DESPUÉS del build, para confirmar sabiendo que el código compila.
- Comprobaciones previas: Node, firebase-tools (ofrece instalarlo), sesión de Firebase iniciada, rama
  y último commit, cambios sin commitear, y si `environment.ts` apunta a `localhost`.
- Si la compilación falla, **aborta sin publicar** y lo dice explícitamente.
- Verifica que el build generó `index.html` **y** `index.csr.html` — sin el segundo, las rutas
  privadas se romperían al cargarlas directo (ver sección 2).
- **A propósito NO toca `firestore.rules` ni el backend.** Solo `--only hosting:app`.

Detalles de `cmd.exe` que costaron 3 bugs y conviene no repetir si alguien lo edita:
- Las cadenas `if / else if / else` rompen el script entero con "La sintaxis del comando no es
  correcta". Se usan saltos explícitos (`goto`) en su lugar.
- `git log --format=%h %s` dentro de un `for /f` choca con las variables del bucle (`%%h`). Se usa
  `--oneline`.
- Con `enabledelayedexpansion`, un `!` literal dentro de un `echo` se lo come el parser — y dentro de
  un bloque `if (...)` ni siquiera `^!` sobrevive (doble pasada de parseo). Los avisos usan `[*]`.
- Todo el texto va **sin tildes**: cmd.exe las muestra como basura.

**🔴 Bug real encontrado justo antes de publicar: `main.ts` mandaba los errores de cada visitante a
su propio `localhost`.** `main.ts` instalaba `window.onerror` y `unhandledrejection` apuntando a
`'http://localhost:3000/log-error'`, **escrito a mano**, sin pasar por `environment.apiUrl` y sin
ninguna guarda de entorno. En el sitio publicado eso no apunta a ningún servidor nuestro: el navegador
de **cada visitante** intentaría conectarse a **su propia máquina** en el puerto 3000, fallando en cada
error, ensuciando la consola y —lo peor— enviando la traza del error a lo que sea que esa persona
tuviera escuchando en ese puerto. Confirmado en vivo en la vista previa: 3 peticiones reales a
`http://localhost:3000/log-error`.

Verificado además que **la producción de marzo NO lo traía** (se escaneó el `main.js` publicado), así
que publicar sin corregirlo habría metido una regresión nueva. Corregido poniendo el bloque tras
`if (!environment.production)` y usando `environment.apiUrl`. En desarrollo sigue funcionando igual.
En el build de producción la condición nunca entra — confirmado leyendo el bundle (`production:!0`) y
después en vivo (0 peticiones a `log-error` en el sitio publicado). El código muerto (~300 bytes) se
queda dentro del `if` porque esbuild no lo pliega: `environment` viene de un import, no es un literal.

**Desindexado `.firebase/*.cache`.** Ya estaba en `.gitignore` pero seguía versionado (gitignore no
afecta a lo ya trackeado), y uno de los dos archivos aún referenciaba el `frontend-landing` que no
existe. Se reescribe en cada `firebase deploy`, así que dejarlo trackeado hacía que el aviso de
"cambios sin commitear" de `actualizar.bat` saltara **siempre**, volviéndolo ruido que se aprende a
ignorar — justo lo que no se quiere de una comprobación de seguridad.

**Resultado medido en producción** (`estudiauni.cl`, carga limpia):

| | Beta anterior (2026-03-30) | Ahora |
|---|---|---|
| JS descargado en el home | ~490 KB | **296 KB** en 14 archivos |
| Peticiones a Google Fonts | sí (render-blocking) | **0** (self-hosted) |
| Peticiones a `localhost:3000/log-error` | no existía el código | **0** |

Enrutamiento verificado en vivo: `/`, `/soporte`, `/trabaja-con-nosotros` y `/login` sirven HTML
prerenderizado **cada una con su propio `<title>`**; `/dashboard` y `/ruta` sirven el cascarón
`index.csr.html`. Es decir, el rewrite de `firebase.json` está correcto (ver la advertencia de la
sección 2 sobre por qué esto importa).

**Turnstile en producción: queda un error 600010 en consola, sin resolver.** En la URL de vista previa
el error era `110200` ("dominio no autorizado"), esperable porque el canal usa un subdominio aleatorio
que no está en la lista de Cloudflare. En `estudiauni.cl` ese error desaparece —lo que confirma que el
dominio real **sí** está registrado— pero sale `600010`, un fallo genérico de resolución del desafío.
**Hipótesis más probable, no confirmada:** el navegador con el que se verificó es automatizado, que es
exactamente lo que Turnstile está diseñado para detectar (además se vio un `ERR_BLOCKED_BY_CLIENT`,
señal de un bloqueador de anuncios activo). **Pendiente: abrir `estudiauni.cl` en un navegador normal
y mirar la consola** para descartar que sea un problema real. No bloquea nada hoy: se verificó con una
lectura REST directa que Firestore responde 200, o sea que **App Check sigue en "Supervisión", no en
"Aplicar"** — si estuviera aplicado, un fallo de Turnstile dejaría el sitio inutilizable.

**Sigue pendiente y ahora importa más:** `environment.ts` apunta `apiUrl` a `http://localhost:3000`,
así que en el sitio publicado no funciona nada que pase por el backend (Foco, análisis IA, pagos Flow,
cupones, transferencias, panel de suscripciones, y el intercambio de token de App Check). Ya era así en
la beta de marzo — no es una regresión — pero con usuarios reales testeando pasa a ser lo primero que
hay que resolver. Ver bloqueante #1 de la sección 11.

### 2026-08-26 (parte 2) — Rendimiento del arranque: fuentes self-hosteadas (fuera Google Fonts) y
el chunk de seeds de 750 KB deja de precargarse en todas las páginas. Bundle inicial del home:
1.76 MB → 1.10 MB raw (0.49 → 0.30 MB gzip)
Typecheck ✅ (`tsc --noEmit -p tsconfig.app.json`, código 0) · `ng build --configuration production`
✅ prerenderizando las 6 rutas · medido con un **A/B real en esta máquina** (se revirtieron los 5
archivos a HEAD, se reconstruyó, se midió, y se restauraron) — no con una estimación · verificado en
navegador en pestaña limpia: 0 errores de consola, 0 peticiones a Google Fonts, y el harness
`/dev/ruta` renderizando sus 91 nodos reales.

**Origen:** una revisión externa señaló 5 puntos (budget de 4MB, zone.js, fuentes por CDN, sitemap,
slugs). Verificados uno a uno contra el código: el sitemap **ya existía** y está bien
(`public/sitemap.xml`, 5 URLs públicas, declarado en `robots.txt`), los slugs **ya son limpios**, y
el budget de 4MB es una alarma de build que no afecta un solo byte de lo que descarga el usuario
(el inicial real era 1.76 MB, ni cerca del techo). Sobre **zoneless**: es posible pero la API en
Angular 18 es `provideExperimentalZonelessChangeDetection()` (experimental hasta v20) y este
código es el peor candidato posible — 0 de 69 componentes usan `OnPush`, 0 usan `ChangeDetectorRef`,
y hay 127 callbacks asíncronos (96 `setTimeout` + 18 `setInterval` + 13 `addEventListener`) que hoy
repintan la UI **solo** porque Zone.js parchea esas APIs; sin Zone.js cada uno que no escriba a un
signal deja de repintar en silencio. Ganancia: `polyfills.js` = 90 kB, esencialmente todo zone.js.
No se tocó. Las dos cosas que sí valían la pena son las de abajo.

**1. Fuentes Outfit + Inter self-hosteadas.** Antes se traían de `fonts.googleapis.com` con un
`<link>` en el `<head>` de `index.html` (render-blocking, contra un tercer origen: DNS + TLS +
petición antes de poder pintar texto), **más un `@import url(...)` propio** dentro de los estilos de
`sort-practice.component.ts` y `true-false-practice.component.ts` — esos dos disparaban una petición
extra a Google al montar el componente. Ahora hay 4 `@font-face` al inicio de `styles.css` y los
`.woff2` viven en `public/fonts/`.

Hallazgo que simplificó mucho el trabajo: **ambas son fuentes variables**. La API `css2` de Google
devuelve 22 bloques `@font-face` (11 pesos × 2 subsets) pero apuntan a **4 archivos únicos** —
confirmado por `md5sum`, los 22 descargados daban 4 checksums. Por eso quedó un solo `@font-face`
por familia/subset con un **rango** de peso (`font-weight: 100 900`) en vez de uno por peso. Total:
**188 KB en 4 archivos** (`latin` + `latin-ext` de cada familia). El `latin-ext` no cuesta nada en
runtime: el navegador elige por `unicode-range` y en una página en español no lo descarga —
verificado en vivo, solo se piden los dos `-latin`.

- Se agregaron `<link rel="preload">` para los dos `latin` en `index.html`: sin eso el navegador no
  descubre la fuente hasta haber descargado y parseado `styles.css`.
- **Cambio visual real, a propósito:** antes solo se declaraban Outfit 300-800 e **Inter 400-600**,
  pero el proyecto usa `font-weight: 700` y `800` **538 veces cada uno** (más 72 `bold`, 63 de `900`)
  — todo eso se renderizaba con **negrita sintética** sobre Inter 600. Con el rango `100 900` ahora
  se interpola el eje real de la fuente variable. Verificado midiendo el ancho del mismo texto a
  400/700/800 (592 / 604 / 609 px: anchos distintos = pesos reales, no faux bold). El texto se ve
  un poco más limpio y ligeramente menos pesado en negritas. **Si se prefiere el aspecto anterior**,
  basta cambiar los 4 `font-weight: 100 900` por los pesos exactos que se declaraban antes.
- **Ojo con el sufijo `-v1` de los nombres de archivo:** `firebase.json` cachea `*.woff2` con
  `max-age=31536000, immutable`, y estos nombres NO llevan hash de contenido como el JS/CSS que
  genera Angular. Si algún día se reemplaza una fuente hay que **subir el número de versión** en el
  nombre y en las 6 referencias (4 en `styles.css` + 2 `preload` en `index.html`); pisar el archivo
  con el mismo nombre dejaría a los visitantes recurrentes con la versión vieja hasta un año.
- Para volver a bajar las fuentes hay que usar un **User-Agent de navegador moderno** contra la API
  `css2`; si no, Google devuelve `.ttf` en vez de `.woff2`.

**2. El chunk de seeds ya no se precarga en todas las páginas** — el pendiente que quedó abierto y
explícitamente sin hacer en la bitácora del 2026-08-25 ("evaluado pero NO implementado — riesgo
real"). `paes-content.service.ts` importaba `seed-data.ts` (426 KB) y `seed-historia.ts` (428 KB)
con `import` estático de módulo, así que esbuild los metía en un chunk que se precargaba
(`modulepreload`) en **todas** las rutas, incluido el home — que no tiene nada que ver con la Ruta
de Aprendizaje.

Resultó **bastante menos riesgoso de lo que se temía**, y vale la pena dejar por qué, porque la
evaluación anterior partía de una premisa equivocada. La bitácora del 25-08 decía que el servicio
"expone datos como signals síncronos a ~15 componentes, y volverlos asíncronos obliga a tocar cada
consumidor" — **eso no era necesario**: los signals siguen siendo síncronos y ningún consumidor
cambió. Lo único que se vuelve asíncrono es la *carga* de los seeds, que ya ocurría dentro de
funciones `async`. Dos hechos que lo confirman, verificados antes de tocar nada:
- `grep` en todo el frontend: **esos dos archivos solo los importa `paes-content.service.ts`**,
  nadie más.
- Los 3 símbolos (`CAPITULOS`, `HISTORIA_CAPITULOS`, `HISTORIA_MATERIA`) se usaban en 8 sitios, y
  **todas las cadenas de llamada nacen en funciones ya `async`** (`loadDataFromLocalMocks`,
  `doLoadDataFromFirestore`).

Implementación: un `loadSeeds()` privado que hace `Promise.all([...])` con los dos `import()`
dinámicos y cachea la promesa (coalesce de llamadas concurrentes, mismo patrón que ya usa
`loadDataFromFirestore()`); `syncLocalChapters()` y `loadLocalFallbacks()` pasan a `async`; `await`
en los 6 call sites.

**El único punto que necesitó cuidado:** dos usos vivían dentro de
`capitulosSnap.docs.forEach(doc => {...})`, un callback **síncrono** que no puede hacer `await` (el
typecheck los cazó — no se detectaron en la lectura inicial). Se resolvieron izando el
`await this.loadSeeds()` **antes** del bucle, dentro de la función `async` que lo contiene. No se
pierde nada: para cuando se ejecuta ese código ya estamos cargando la Ruta de Aprendizaje, que es
justamente el único lugar donde ese contenido hace falta.

**Medición (build de producción, home, A/B en la misma máquina):**

| | Antes | Después |
|---|---|---|
| Archivos iniciales | 13 | 13 |
| Peso inicial raw | 1.76 MB | **1.10 MB** |
| Peso inicial gzip | 0.49 MB | **0.30 MB** |
| kB de contenido de seeds en los chunks iniciales | **731.9 kB** | **0 kB** |

`seed-data` (359 kB) y `seed-historia` (333 kB) aparecen ahora como lazy chunks con nombre propio en
la salida del build, y no están en la lista de `modulepreload` del `index.html` prerenderizado.

**Verificación funcional del camino que más importa:** el harness `/dev/ruta` corre con Firestore
inyectado como objeto vacío a propósito, así que ejercita exactamente `loadLocalFallbacks()` — el
camino que ahora depende del `import()` dinámico. Renderiza sus **91 nodos** de Competencia Lectora
(el mismo número que documenta la bitácora del 2026-08-18), con los 2 errores de consola esperados
del harness. Los otros 2 escenarios que la evaluación anterior pedía reprobar (carga normal contra
Firestore, y el *fallback* por fallo de Firestore) **no se probaron contra una base real** — este
entorno no tiene credenciales de Firestore cargadas.

**Pendiente, no tocado:** sigue siendo cierto que el home pesa ~4.6 MB y que el LCP medido en móvil
era de 25.9 s — lo de esta sesión ataca el JavaScript de arranque, no las imágenes/vídeo, que son la
parte más grande. Tampoco se tocaron los 3 links del navbar del home sin `href` (lo único que le
resta puntos al SEO, 92/100).

### 2026-08-26 — Ajustes visuales en nodos de Matemáticas (M1/M2), títulos oficiales de los 4 ejes de M2 y blindaje de App Check en localhost
Build de producción ✅ · validado con `pnpm run build` (código 0).

**1. Ajustes visuales y encuadre de nodos en Matemática (`materia-math-path.component.ts`):**
- **Nodos completados (`.text-completed`):** Se ancló la tarjeta a `top: 58px`, acoplándose al tercio inferior del círculo del nodo (72px) para que la estrella central (`★`) y el badge de verificación (`✓`) queden 100% visibles y sin obstrucciones.
- **Nodos no completados / bloqueados / activos:** Se posicionó el texto a `top: 78px` para que se ubique de forma limpia debajo del círculo sin rozar la base del nodo.
- **Corrección del texto entrecortado y desborde de la tarjeta:** Se eliminó la propiedad conflictiva `[style.bottom]` del template HTML que forzaba una altura fija de ~40px (lo que provocaba que la 3ra línea de texto se saliera por debajo del recuadro blanco). Con `height: auto`, `overflow: visible`, `line-height: 1.35` y `padding: 6px 14px 8px 14px`, la cápsula ahora encierra dinámicamente todo el texto respetando los caracteres con trazo descendente (**p**, **q**, **g**, **j**, **y**) sin recortarlos, tanto en desktop como en resoluciones móviles.

**2. Ejes temáticos oficiales de Matemática M2:**
- Se actualizaron los 4 ejes temáticos oficiales en `infinite-mastery.service.ts` y `materia-math-path.component.ts`:
  1. `Reales y Logaritmos`
  2. `Trigonometría`
  3. `Circunferencia`
  4. `Dispersión y Modelos`
- Se removió la descripción de los banners de capítulo de M2 en `getChapterDisplayDesc()`, dejando únicamente el título visible de forma limpia.

**3. App Check en entorno local:**
- En `app.config.ts` se acondicionó `provideAppCheck` para que no bloquee con 403 en `localhost` durante pruebas locales cuando el backend de Turnstile no está enlazado.

### 2026-08-25 (parte 7) — Optimización masiva de assets multimedia: GIFs animados de Foco a WebM (VP9 transparente) y migración de Avatares e Íconos SVG a AVIF
Build de producción ✅ · prerendering de 6 rutas públicas ✅ · verificado con `pnpm run build`.

**Reducción masiva de peso del sitio (de ~279 MB a solo ~5.1 MB, un ahorro total de más de 273 MB):**
1. **Animaciones de Foco (WebP/GIF a WebM VP9 con canal alfa):**
   - Los 6 GIFs/WebPs animados de Foco (`focoBiologia`, `focoComprensionLectora`, `focoFisica`, `focoHistoria`, `focoMatematica`, `focoQuimica`), que pesaban entre 2.7 MB y 15.6 MB cada uno (con los GIFs originales sumando más de 272 MB), se convirtieron a videos **WebM (VP9 yuva420p transparente, 440×440 px)** pesando en conjunto solo **4.62 MB** (reducción del 98.3%).
   - Se reemplazaron las etiquetas `<img>` por `<video autoplay loop muted playsinline class="splash-mascot">` en los 6 componentes de ruta (`materia-biologia-path`, `materia-fisica-path`, `materia-historia-path`, `materia-math-path`, `materia-quimica-path`, `materia-path`) y en `dashboard.component.ts` (avatar del coach Foco).
2. **Avatares de perfil (SVG a AVIF):**
   - Los 10 avatares de usuario en `avatarsSVG/` (2.53 MB en total, con `avatar_10.svg` pesando 1.55 MB por vectorización compleja) se migraron a `avatarAVIF/` pesando en total **139 KB** (reducción del 94.5%).
   - Se actualizaron las referencias en `profile-modal.component.ts` y `profile-settings.component.ts`.
3. **Íconos de materias y herramientas (SVG a AVIF):**
   - Los 23 íconos del sistema (`P_Biologia`, `P_m1`, `P_m2`, etc.) en `iconosSVG/` (4.56 MB, con `P_Biologia.svg` en 2.23 MB) se migraron a `IconosAVIF/` pesando solo **351 KB** en conjunto (reducción del 92.3%).
   - Se actualizó el consumo en 20 componentes y templates mediante el script `backend/scratch/update_assets_to_avif.js`.
### 2026-08-25 (parte 3) — Flow sandbox configurado y probado por primera vez de punta a punta
(2 bugs reales corregidos), transferencia bancaria manual restaurada con comprobante subido por
el usuario, y panel admin: aprobar con duración explícita + eliminar registros resueltos
Typecheck ✅ backend y frontend en cada tanda · `nest build` ✅ · `ng build --configuration
production` ✅ (prerenderiza las 6 rutas igual que antes) · 43/43 tests unitarios de Angular ✅ ·
**probado de punta a punta con dinero de prueba real contra `sandbox.flow.cl`** (primera vez que
esto se prueba en este proyecto, no solo compilado) · lógica de aprobar/rechazar/eliminar
transferencia y de carga diferida del comprobante verificada ejecutando `SubscriptionsService`
real contra Firestore (vía `@nestjs/testing`, sin pasar por HTTP) con datos de prueba creados y
borrados en la misma corrida · barrido de consola sin errores en 8+ páginas del sitio con una
cuenta real.

**Flow, por primera vez, configurado y probado en sandbox — 2 bugs reales encontrados, ninguno
de los dos era el problema que parecía a primera vista.** El usuario ya tenía cuenta en
`sandbox.flow.cl` pero nunca se había completado el flujo real (ver bitácora 2026-08-22 parte 16:
"Flow... nunca se ha ejecutado contra una cuenta real"). Se completó `backend/.env` con
`FLOW_API_KEY`/`FLOW_SECRET_KEY`/`BACKEND_PUBLIC_URL` (túnel de Cloudflare, no ngrok — ver más
abajo por qué) y se corrió `npm run setup:flow-plans` con éxito.

- **Primer error, "apiKey not found" en cualquier endpoint de Flow — no era un typo de la clave,
  era la cuenta equivocada.** El usuario había copiado el API Key desde `www.flow.cl` (producción)
  en vez de `sandbox.flow.cl` — son dos cuentas y bases de datos de comercio completamente
  separadas en Flow, cada una con su propio panel "Mis Datos". Confirmado probando la misma clave
  contra un endpoint distinto (`/customer/list`) con el mismo resultado exacto, lo que descartó
  que fuera un problema de la ruta de suscripciones o del código.
- **Segundo error, ya con las credenciales de sandbox correctas: `Cannot POST /pago-resultado`
  (404) al volver de registrar la tarjeta.** Causa: la documentación oficial de Flow es explícita
  en que el `url_return` de `/customer/register` **siempre recibe un POST con `token` en el body,
  nunca un GET con query string** — algo que el código anterior asumía incorrectamente
  (`pricing-modal.component.ts` comentaba "Flow's documented redirect pattern: a plain GET").
  Una ruta de Angular no puede leer el body de un POST una vez que el navegador ya navegó ahí (ni
  en `ng serve`, ni en un hosting estático real — el problema no es específico de desarrollo).
  Solución: nuevo endpoint puente en el backend, `POST /api/subscriptions/flow/return`
  ([flow-webhook.controller.ts](backend/src/subscriptions/flow-webhook.controller.ts) —
  intencionalmente sin guard, igual que el webhook, porque lo llama el navegador antes de que
  exista sesión), que lee el `token` del body y hace un 302 al SPA con
  `?token=...` como query param, que sí puede leer `pago-resultado.component.ts`. El frontend
  ahora manda `url_return` apuntando a este endpoint del backend en vez de directo al SPA
  (`pricing-modal.component.ts` `proceedCheckout()`).
- **Tercer error, el más grave — el registro de tarjeta se completaba en Flow de verdad pero el
  backend igual decía "No se pudo registrar tu tarjeta".** `FlowService.confirmRegistrationAndSubscribe()`
  comparaba `status.status === 1` (número) contra la respuesta de
  `/customer/getRegisterStatus` — pero Flow devuelve ese campo como el **string** `"1"`, no el
  número `1`, confirmado pegándole directo a la API con el token real de una tarjeta ya inscrita
  (`{"status":"1","creditCardType":"Visa","last4CardDigits":"6623"}`). La comparación estricta
  nunca coincidía, así que **toda tarjeta registrada correctamente se marcaba como rechazada** —
  este bug llevaba ahí desde que se escribió el código (bitácora 2026-08-22 parte 16), nunca se
  había detectado porque nunca se había probado con un registro real hasta ahora. Corregido a
  `String(status.status) === '1'`. Tras las 3 correcciones, un ciclo completo (tarjeta de prueba
  de Flow `4051885600446623` → inscripción en Transbank/Webpay sandbox → confirmación → activación)
  terminó en "¡Bienvenido a Premium! 🚀" con un `subscriptionId` real de Flow.
- **Nota sobre la herramienta de túnel:** se recomendó `cloudflared` (Cloudflare Tunnel) en vez de
  `ngrok` porque el antivirus del usuario puso en cuarentena el binario de ngrok (falso positivo
  conocido: ngrok también lo usa malware real para C2, así que varios antivirus lo detectan de
  forma genérica). `cloudflared tunnel --url http://localhost:3000` no requiere cuenta y encaja
  con que el proyecto ya usa Cloudflare para Turnstile.

**Transferencia bancaria manual, de vuelta en el modal de precios — se había quitado por completo
el 2026-08-22 (parte 16) porque nunca pudo probarse Flow.** El usuario pidió reactivarla, pero
con un cambio real respecto a como estaba antes: ahora exige **subir una foto/captura del
comprobante**, no solo escribir el N° de transferencia a mano. La imagen se comprime en el propio
navegador (mismo patrón que ya usa la foto de perfil: `canvas.toDataURL('image/webp', 0.75)`,
recorte a 1000px de ancho máx.) y se manda como texto base64 en el campo `receiptUrl` del body —
sin ningún servicio de subida nuevo (ni Cloudinary, ni Firebase Storage). El botón "Notificar
Transferencia" ahora exige banco + N° de comprobante + la imagen, antes se podía enviar sin
ninguna evidencia. Como una imagen base64 comprimida (~100-250 KB típico) supera el límite por
defecto de Express para el body JSON (100 KB), se subió el límite a 5 MB en
[main.ts](backend/src/main.ts) (`bodyParser: false` + `express.json({limit:'5mb'})` manual —
necesario desactivar el parser por defecto de Nest primero, si no corre ADEMÁS del nuevo con el
límite viejo ganando la carrera). Nada del backend de transferencias estaba roto — solo faltaba
la UI, que se restauró completa (pestañas Flow/Transferencia, datos bancarios con placeholders,
igual que antes de quitarse) desde el diff del commit que la eliminó.

**Panel admin (`/admin/suscripciones`) — 3 cambios, a pedido explícito tras ver la primera
versión funcionando:**
1. **"Aprobar/Rechazar" → "Otorgar 1 Mes / Otorgar 1 Año / Rechazar".** Antes, aprobar una
   transferencia le daba al usuario el `planType` que ÉL había marcado al llenar el formulario
   (mensual o anual) — un campo de solo texto, sin ninguna verificación real detrás. Ahora el
   admin elige la duración explícitamente al aprobar, y esa elección es la que se otorga
   (`SubscriptionsService.approveTransfer()` recibe `planType` como parámetro nuevo y le gana al
   valor guardado en el propio registro de transferencia). El monto que el usuario dice haber
   transferido sigue siendo solo texto informativo — nada automático lo valida contra lo
   efectivamente depositado; sigue siendo responsabilidad del admin revisar el comprobante antes
   de otorgar.
2. **Botón "🗑️ Eliminar Registro"** — aparece solo cuando `status` es `approved` o `rejected`
   (nunca en pendientes; el backend lo rechaza explícitamente aunque se le pida vía API
   directamente, no solo lo oculta la UI). Borra el documento completo de `manual_payments`,
   comprobante incluido. Ver el punto siguiente sobre por qué esto importa.
3. **El comprobante ya NO viaja en la lista del panel — se pide solo al hacer clic en "Ver
   comprobante".** `SubscriptionsService.getAllTransactions()` traía hasta 100 registros de
   `manual_payments` completos en cada carga/actualización del panel, cada uno con su
   `receiptUrl` en base64 (~100-250 KB) — es decir, potencialmente varios MB transferidos solo
   para pintar una tabla, incluyendo comprobantes de transferencias resueltas hace meses que ya
   nadie necesita ver. Ahora la lista solo manda un booleano (`hasReceipt`), y un nuevo endpoint
   `GET /api/admin/subscriptions/transfer/:transferId/receipt` trae la imagen real solo cuando el
   admin efectivamente hace clic en "🧾 Ver comprobante" (con un estado "⏳ Cargando..." mientras
   llega). Esto es justo lo que hace que el botón "Eliminar Registro" valga la pena: sin la carga
   diferida, un comprobante sin borrar seguía pesando en cada carga del panel aunque nadie lo
   mirara nunca más.

**Sobre el costo/espacio de los comprobantes (para que quede documentado, se preguntó
explícitamente):** el costo de almacenamiento en sí en Firestore es marginal incluso con miles de
comprobantes acumulados (centavos de dólar al mes) — el problema real nunca fue el costo en
dólares, sino el peso de la respuesta de `getAllTransactions()` creciendo sin límite con el tiempo
si nadie borra los registros resueltos. Los puntos 2 y 3 de arriba juntos resuelven esto: la carga
diferida evita que un comprobante sin borrar pese en cada visita al panel, y "Eliminar Registro"
permite sacarlo de la base del todo una vez que ya no hace falta.

**Hallazgo del sistema, no relacionado con este trabajo — no corregido, no bloqueante:**
`ng build --configuration development` falla con `File '@cloudflare/turnstile-firebase-app-check/src/index.ts'
is missing from the TypeScript compilation` — confirmado que **ya fallaba así antes de este
trabajo** (reproducido con `git stash` sobre la rama sin tocar). `ng build --configuration
production` (la que realmente importa para desplegar) sí termina bien y sigue prerenderizando las
6 rutas — así que esto no bloquea nada real, es una rareza de cómo esa configuración de desarrollo
en particular resuelve el paquete de Cloudflare (que se instala sin compilar, ver bitácora
2026-08-25 parte 2). `ng serve` (el flujo real de desarrollo local, usado en todas las pruebas de
esta sesión) tampoco lo sufre. Queda anotado por si en el futuro alguien intenta correr
`ng build --configuration development` y se encuentra con esto — no es su culpa ni algo nuevo.

**Pendiente, no de código — coordinación de equipo:** cada desarrollador necesita su PROPIA cuenta
en `sandbox.flow.cl` (Flow no comparte credenciales de sandbox entre comercios) y su propio túnel
público corriendo para que `BACKEND_PUBLIC_URL` sea alcanzable — ver la sección de este documento
sobre cómo levantar el entorno de pagos localmente. `FLOW_PLAN_ID_MONTHLY`/`FLOW_PLAN_ID_YEARLY`
se generan una vez por cuenta de Flow con `npm run setup:flow-plans`, no se comparten entre
desarrolladores (cada cuenta sandbox tiene los suyos).

### 2026-08-25 (parte 4) — 🔴 Bug crítico real de facturación: "Cancelar Plan" no cancelaba nada
en Flow — el usuario seguía siendo cobrado indefinidamente. Corregido y verificado contra Flow
sandbox real, más un segundo bug relacionado (expiración de Plan PRO ignorada en la Ruta de
Aprendizaje)
Typecheck ✅ backend y frontend · `nest build` ✅ · 43/43 tests ✅ · **verificado contra la API
real de Flow, no solo leyendo el código**: se ejecutó la cancelación real sobre la suscripción de
prueba activa (`sus_y8ac54b6e9`, creada en la parte 3) y se confirmó con `GET /subscription/get`
que Flow devolvió `next_invoice_date: null` y `cancel_at` con la fecha real — Flow efectivamente
dejó de tener programado un próximo cobro. También se simuló el vencimiento de membresía
(retrasando `endDate` a ayer en el doc de prueba, con reversión inmediata después) para confirmar
en vivo que el acceso a la Ruta de Aprendizaje se bloquea correctamente pasada la fecha.

**El usuario pidió, antes de hacer commit de los cambios de Flow, que se le asegurara
explícitamente: (1) que es una suscripción real que cobra automáticamente cada mes/año a la
tarjeta registrada, y (2) que el botón "Cancelar Plan" del perfil realmente cancela — acceso
hasta el fin del período pagado, y bloqueo real de las funciones PRO después.** Se auditó todo el
camino de ambas preguntas en vez de asumir que "ya estaba probado" — y la pregunta 2 destapó un
bug real, no cosmético.

**Pregunta 1 — confirmado que SÍ es cobro recurrente real e indefinido, hasta que se cancele
explícitamente.** `setup-flow-plans.ts` nunca envía `periods_number` a `/plans/create` (no existe
ese parámetro en el código, confirmado por grep en todo el repo) — la documentación de Flow dice
"si el plan TIENE vencimiento, ingrese aquí el número de períodos", lo que implica que omitirlo
significa que el plan NO tiene vencimiento fijo. Confirmado además de forma indirecta y concluyente
con datos reales: antes de cancelar la suscripción de prueba, `GET /subscription/get` mostraba un
`next_invoice_date` con el próximo cobro programado — es decir, Flow ya tenía agendado seguir
cobrando el mes siguiente, sin que nadie configurara nada para eso. `/subscription/create`
(`flow.service.ts` `startCardRegistration`) tampoco manda ningún parámetro que limite la cantidad
de cobros. Conclusión: mientras no se cancele, Flow cobra la tarjeta registrada cada ciclo
(mensual o anual) indefinidamente — tal como se espera de una suscripción real.

**Pregunta 2 — el botón "Cancelar Plan" NUNCA había funcionado de verdad, desde que se implementó
Flow.** Encontrado auditando el camino completo, no solo el backend (que sí estaba bien hecho):

- `profile-modal.component.ts` `executeCancelSubscription()` llamaba a
  `firestoreService.cancelSubscription()` — un método que hace **una escritura directa del
  cliente a Firestore**, poniendo únicamente `subscription.status: 'cancelled'`. Nunca toca
  `cancelAtPeriodEnd`, y **nunca llama a ningún endpoint del backend**. Grep en todo el frontend
  confirmó cero referencias a `/subscriptions/cancel`, `flowSubscriptionId` o
  `cancelFlowSubscription` fuera del propio backend.
- El endpoint correcto ya existía y estaba bien implementado desde antes:
  `POST /api/subscriptions/cancel` → `SubscriptionsService.cancel()` (pone
  `subscription.cancelAtPeriodEnd: true`) → si hay `flowSubscriptionId`, el controlador llama a
  `FlowService.cancelFlowSubscription()` → `POST /subscription/cancel` en la API real de Flow.
  **Absolutamente nada de este camino se ejecutaba nunca**, porque el frontend jamás lo invocaba.
- **Efecto real para un usuario que cancelaba antes de este fix:** veía el toast "Mantendrás el
  acceso Premium hasta el fin de tu período pagado" y creía haber cancelado — pero Flow seguía
  cobrando su tarjeta cada ciclo, para siempre, sin ninguna forma de detenerlo desde la app. Peor
  aún: cada cobro exitoso llega por el webhook a `extendSubscriptionPeriod()`
  (`subscriptions.service.ts`), que solo se salta la renovación si `cancelAtPeriodEnd === true`
  (nunca se ponía) — así que además de seguir cobrando, **cada cobro seguía extendiendo el
  `endDate` local**, por lo que ni siquiera "cancelado" en el sentido de "no perder el acceso
  antes de tiempo" era cierto: nunca se acercaba a expirar.
- **Corregido:** nuevo método `PaymentService.cancelSubscription()` (frontend) que sí llama a
  `POST /api/subscriptions/cancel`; `executeCancelSubscription()` ahora lo usa y refleja
  `cancelAtPeriodEnd`/`status` localmente tras la respuesta. Se agregó `'subscription.status':
  'cancelled'` a la escritura del backend en `SubscriptionsService.cancel()` (antes solo ponía
  `cancelAtPeriodEnd`) para que `isSubscriptionCancelled()` en el perfil (que lee `status`) siga
  funcionando igual que antes. Se borró el método muerto `FirestoreService.cancelSubscription()`
  (el de la escritura directa) — no queda ningún otro llamador.
- **Verificado con la suscripción real de prueba de la parte 3**: tras ejecutar la cancelación,
  `GET /subscription/get` contra Flow mostró `subscription_end`/`cancel_at` con la fecha/hora real
  de la cancelación y **`next_invoice_date: null`** — la prueba concreta de que Flow ya no tiene
  ningún cobro futuro programado para esa tarjeta. En Firestore, `endDate` quedó intacto (el
  usuario mantiene acceso hasta esa fecha) y `cancelAtPeriodEnd`/`status` quedaron correctos.

**Segundo bug encontrado en la misma auditoría, relacionado pero independiente — la Ruta de
Aprendizaje no bloqueaba a un usuario ya vencido.**
`LearningAccessService.isPro()` (`learning-path/services/learning-access.service.ts`) calculaba
`isPremium` con `profile?.plan === 'premium' || profile?.subscription?.tier === 'premium'`. El
campo `profile.plan` ya viene corregido por vencimiento desde
`FirestoreService.normalizeProfile()` (compara `endDate` contra la fecha actual y fuerza `'free'`
si ya pasó) — pero el OR volvía a meter el campo crudo `subscription.tier`, que **nadie corrige
en el cliente** y en el backend solo se corrige como efecto secundario de `checkCredits()` (se
dispara solo al iniciar un quiz o ensayo, no al navegar la Ruta). **Efecto real:** un usuario
cuya membresía ya venció, pero que nunca inició un ensayo/quiz después de vencer, seguía viendo
**todos los capítulos de pago de la Ruta de Aprendizaje desbloqueados indefinidamente** — el
resto de la app (dashboard, `isProPlan()`) ya mostraba correctamente "Básico" porque esos sí leen
solo `.plan`, así que era una inconsistencia visible: dashboard decía Básico, la Ruta seguía
completa. Corregido quitando el OR — `isPro()` ahora solo lee `profile.plan` (que ya contempla el
fallback a `subscription.tier` internamente, así que no se pierde nada, solo se elimina la vía
que se saltaba la corrección por vencimiento). Verificado en vivo retrasando `endDate` de la
cuenta de prueba a ayer: antes del fix `isPro()` habría dado `true`; después del fix,
`allowedChapterIds('comp-lectora')` devolvió solo 1 capítulo (el límite gratuito), confirmando
el bloqueo real.

**Hallazgo menor, reportado pero NO corregido en esta sesión — bajo impacto, no es de dinero ni
de acceso a contenido pago:** `firestore.rules` (`isValidFinish()`, la regla que exige 3 h de
retención de resultados para Plan Básico) y `backend/src/common/guards/premium.guard.ts` calculan
"es Pro" igual que el bug de arriba (`tier`/`plan` sin comparar `endDate`) — mismo tipo de hueco,
pero de impacto menor: en el peor caso, un usuario recién vencido (que aún no disparó el
autocorrección de `checkCredits()`) podría ver sus resultados de ensayo antes de las 3 h en vez
de esperar el retraso del plan gratuito. `PremiumGuard` está confirmado sin usar en ningún
controlador (grep en todo `backend/src`), así que ese en particular no tiene impacto real hoy.
Ninguno de los dos afecta dinero ni el acceso a contenido de pago (ruta, ensayos) — decisión de
no tocar reglas de seguridad de Firestore sin que el equipo lo pida explícitamente, dado que
requiere `npm run deploy:firestore` para tomar efecto.

### 2026-08-25 (parte 5) — Auditoría exhaustiva de "vencimiento de Premium" en TODO el sistema (no
solo la Ruta de Aprendizaje): 3 bugs reales más encontrados y corregidos en el backend + 1 en
`firestore.rules`, alerta clara agregada al pago por transferencia, recomendación de reembolsos
(sin implementar, a pedido)
Typecheck ✅ · `nest build` ✅ · **verificado ejecutando `SubscriptionsService` real contra un
usuario de prueba con `endDate` vencido y `subscription.tier` sin autocorregir** (el escenario
exacto del bug: cancelado o vencido, pero que nunca disparó el autocorrección de
`checkCredits()`) · verificado en navegador que la alerta nueva se ve en el paso de transferencia.

**Contexto: el usuario, después del fix de "Cancelar Plan" de la parte 4, pidió una garantía más
fuerte — no solo que el botón cancele en Flow, sino que TODAS las limitantes de la app
efectivamente vuelvan a aparecer cuando vence el período.** Se hizo un grep exhaustivo de cada
lugar del frontend y del backend que calcula "¿es este usuario Premium?", clasificando cada uno
según si compara `endDate` contra la fecha actual o confía ciegamente en `subscription.tier`.

**Frontend: limpio.** Los ~25 lugares que hacen esta comprobación en el frontend
(`dashboard.component.ts`, `ensayos-list.component.ts`, `recursos.component.ts`,
`mente-veloz.component.ts`, `career-finder.component.ts`, `nem-calculator.component.ts`,
`mini-ensayo-*.component.ts`, `profile-modal.component.ts`, `pricing-modal.component.ts`, etc.)
usan casi todos `profile?.plan === 'premium'` — el campo que `FirestoreService.normalizeProfile()`
ya corrige por vencimiento. La única excepción real era `LearningAccessService.isPro()`, corregida
en la parte 4.

**Backend: 3 bugs reales más, mismo patrón exacto que el de la Ruta de Aprendizaje, pero con más
impacto porque gatillan gasto real de la API de Gemini y saltan límites de negocio reales — no
solo un glitch de UI.** `SubscriptionsService` calculaba "es Premium" de forma repetida e
inconsistente en 4 métodos distintos; solo `checkCredits()` comparaba `endDate`, los otros 3 no:
- **`checkFocoTokens()`** — la función que autoriza CADA llamada real a Gemini a través de Foco
  (6 endpoints en `ai-feedback.controller.ts`: chat en ensayo, revisión post-entrega, orientación
  vocacional, análisis, etc.). Sin el chequeo de `endDate`, un usuario cuya membresía venció pero
  cuyo `subscription.tier` seguía sin autocorregirse (eso solo pasa como efecto secundario de
  `checkCredits()`, disparado al iniciar un ensayo/quiz — alguien que solo chatea con Foco sin
  rendir nunca un ensayo podría no autocorregirse jamás) seguía teniendo **500 fichas de Foco al
  día en vez de 5** — costo real de API pagado por el negocio, no solo una función de más.
- **`checkSimulationCooldown()`** — el cooldown de 48h entre ensayos del Plan Básico. Mismo hueco:
  un usuario vencido-pero-no-autocorregido podía rendir ensayos ilimitados sin esperar el
  cooldown, indefinidamente.
- **`getStatus()`** (`GET /api/subscriptions/status`) — mismo hueco en el endpoint que informa el
  estado de la suscripción. Confirmado que el frontend actual no lo llama nunca (por eso este no
  se había notado en el uso normal de la app), pero sigue siendo un endpoint real, protegido solo
  por `FirebaseAuthGuard`, alcanzable por cualquier usuario autenticado con una petición directa.

  **Corrección:** se extrajo un método privado único, `isPremiumEffective(uid, userData)`, que
  hace la comparación de `tier`/`plan` **y** `endDate` correctamente en un solo lugar, y los 3
  métodos ahora lo usan en vez de repetir su propia versión incompleta del cálculo (`checkCredits()`
  no se tocó — ya estaba bien, y además hace la escritura de autocorrección a Firestore que los
  otros 3 no necesitan hacer). Verificado creando un usuario de prueba con `subscription.tier:
  'premium'` pero `endDate` de ayer (exactamente el escenario que se saltaba antes): tras el fix,
  `checkFocoTokens()` devuelve el límite de 5 (antes 500), `checkSimulationCooldown()` aplica el
  cooldown de 48h real, y `getStatus()` devuelve `tier: 'free'` con límites numéricos en vez de
  `'unlimited'`.

**`firestore.rules` — mismo hueco, encontrado en la parte 4 pero sin corregir entonces por ser de
bajo impacto; corregido ahora al pedirse una garantía más estricta.** `isValidFinish()` (la regla
que exige 3h de retención de resultados de ensayo para Plan Básico) calculaba "es Pro" sin
comparar `endDate`. Un usuario recién vencido podía ver sus resultados antes de las 3h. Corregido
agregando la misma comparación de fecha (`endDate == null || (endDate is timestamp && endDate >
request.time)`), mismo patrón ya usado en la regla vecina para `finishedAt`. **Desplegado a
producción el mismo día — ver parte 6, que además encontró y cerró un segundo hueco más grave en
la misma función mientras se verificaba este despliegue en vivo.**

**`PremiumGuard`** (`backend/src/common/guards/premium.guard.ts`) tiene el mismo hueco (sin
`endDate`) pero sigue confirmado sin usar en ningún controlador — no se tocó, cero impacto real
mientras siga así.

**Alerta agregada al paso de transferencia bancaria en el modal de precios**
(`pricing-modal.component.ts`), a pedido explícito: una caja ⚠️ entre los datos bancarios y el
formulario, con 3 puntos — la activación no es inmediata (revisión manual, puede tardar horas),
esto NO es una suscripción (pago único, no se cobra de nuevo solo), y al terminar el período
todas las funciones PRO se bloquean hasta la próxima transferencia manual. El tercer punto ahora
es una promesa que el sistema realmente cumple (gracias a los fixes de esta parte y de la parte
4) — antes de estos fixes habría sido una promesa falsa para el caso específico de "nunca inicia
un ensayo/quiz tras vencer".

**Reembolsos — recomendación dada, nada implementado (a pedido explícito).** El Términos de
Servicio (`legal-modal.component.ts`, sección VI) ya declara la política correcta y suficiente
para no necesitar automatizar nada todavía: sin reembolso proporcional por tiempo no usado, salvo
que la ley chilena exija lo contrario (derecho a retracto en compras a distancia). Recomendación
dada en el chat, no en código:
1. **No hace falta un sistema de autoservicio.** Para el volumen actual, tratar cada solicitud de
   reembolso como excepción manual vía soporte es lo estándar incluso en SaaS mucho más grandes —
   evita además construir una superficie que se preste para abuso de la política.
2. **La mitad de "revocar acceso" ya existe:** `SubscriptionsService.manualRevoke()` y el botón
   correspondiente en `/admin/usuarios` — nada nuevo que construir ahí.
3. **La mitad de "devolver el dinero"** depende del método: Flow tiene un endpoint real,
   `POST /refund/create` (con `/refund/getStatus` y `/refund/cancel`), que acepta un `amount`
   explícito (reembolso parcial o total) — usable desde el panel de Flow directamente sin escribir
   código, o integrarlo más adelante si el volumen de solicitudes lo justifica. Para transferencia
   manual, la devolución sería otra transferencia bancaria manual del propio equipo.
4. Sugerido, no implementado: si en el futuro esto se vuelve frecuente, una colección
   `refund_requests` simple con estado (pendiente/aprobado/rechazado) sería el siguiente paso
   natural — pero no es necesario para lanzar.

### 2026-08-25 (parte 6) — 🔴 Desplegado el fix de `firestore.rules` de la parte 5, y verificándolo
en vivo (no solo con `--dry-run`) apareció un segundo hueco preexistente, más grave: cualquier
usuario Plan Básico —vencido o no, nunca hizo falta ser ex-Premium— podía saltarse por completo la
retención de 3h con una escritura directa a Firestore. Cerrado y redesplegado el mismo día
Verificado con el SDK de **cliente** de Firebase (no Admin SDK, que se salta las reglas) autenticado
como el usuario de prueba real, escribiendo directo a `intentos` para ejercer la regla tal como la
ejercería un usuario real o alguien con la consola del navegador abierta — 4 escenarios, los 4 con
el resultado esperado, más un `--dry-run` antes de cada uno de los dos despliegues.

**Contexto:** al pedir "aplica esa regla del firestore, sin romper nada", en vez de solo correr
`npm run deploy:firestore` y confiar en el `--dry-run` de sintaxis de la parte 5 (que solo prueba
que compila, no que la lógica hace lo que debe), se probó la regla ya desplegada contra un
escenario real: cuenta con `endDate` de ayer y `subscription.tier` todavía en `'premium'` (sin
autocorregir) — el mismo escenario exacto de la parte 5 — intentando terminar un ensayo sin mandar
`resultsAvailableAt` en absoluto.

**Resultado inesperado: se permitió.** La función `isValidFinish()` ya traía, desde antes de
cualquier cambio de esta sesión, esta línea:
```
let availabilityOk = isPro || !('resultsAvailableAt' in request.resource.data) || (...)
```
El problema es el segundo término: `!('resultsAvailableAt' in request.resource.data)` — si el
campo simplemente **no viene** en la escritura, la regla lo daba por válido igual, sin importar si
el usuario es Pro o no. Es decir, el campo nunca fue realmente obligatorio para un usuario Free,
solo "si lo mandas, tiene que ser correcto" — pero mandarlo era opcional. **Esto es anterior a
cualquier cambio de esta sesión** (no lo introdujo el fix de la parte 5, solo se descubrió al
probarlo en serio) — cualquier usuario Plan Básico, sin necesidad de haber sido Premium nunca,
podía abrir la consola del navegador, tomar la instancia de Firestore que la propia página ya
tiene cargada, y terminar su intento mandando `finishedAt` pero omitiendo `resultsAvailableAt` —
viendo sus resultados al instante en vez de esperar las 3h.

**Antes de corregirlo a lo bruto, se revisó qué código legítimo de la app depende de terminar SIN
ese campo — y sí hay uno real:** `FirestoreService.abandonIntento()` marca `status: 'abandoned'`
sin `resultsAvailableAt` a propósito (un intento abandonado no tiene resultados que mostrar, no
aplica ningún retraso). Una corrección que exigiera el campo siempre habría roto el flujo de
abandonar un ensayo para cualquier usuario Free — el escenario exacto de "romper algo" que se
pidió evitar.

**Corrección real:** el campo pasa a ser obligatorio (no solo validado-si-presente) únicamente
cuando `status == 'completed'`:
```
let availabilityOk = isPro || request.resource.data.status != 'completed' || (
  'resultsAvailableAt' in request.resource.data && ...
);
```
Verificado con las 4 escrituras reales antes de dar por bueno el redespliegue:
1. `completed` sin `resultsAvailableAt` (el hueco) → **rechazado** ✅
2. `completed` con `resultsAvailableAt` = ahora mismo (saltarse el retraso) → **rechazado** ✅
   (esto ya lo bloqueaba la regla original, se confirmó que seguía bloqueado)
3. `completed` con `resultsAvailableAt` correcto (+3h) → **permitido** ✅ (el camino real de un
   usuario Free terminando su ensayo normalmente)
4. `abandoned` sin `resultsAvailableAt` → **permitido** ✅ (el flujo real de `abandonIntento()`
   sigue funcionando exactamente igual)

También se reconfirmó el camino Pro (cuenta con `endDate` real restaurado, terminar sin
`resultsAvailableAt`) — sigue permitido, sin regresión. Documentos de prueba en `intentos/` y el
`endDate` de prueba de la cuenta quedaron limpiados/restaurados al terminar.

### 2026-08-25 (parte 2) — Protección contra bots: Firebase App Check + Cloudflare Turnstile,
más 3 rutas adicionales sin carga diferida corregidas y limpieza de CSS muerto
Typecheck y build ✅ en frontend y backend, en cada paso · probado en vivo levantando el backend
real y pegándole al endpoint nuevo (no solo compilado) · verificado en navegador con la cuenta
real que el resto de la app sigue funcionando.

**Contexto:** el usuario usa DNS de Cloudflare y quería aprovechar Turnstile (su alternativa
gratuita a un captcha) para proteger Registro y Recuperar Contraseña — las dos páginas de
autenticación que hoy hablan directo con Firebase Auth desde el navegador, sin pasar por el
backend NestJS. Se evaluó Turnstile suelto vs. Firebase App Check con Turnstile como Custom
Provider, y se optó por App Check: protege TODO el tráfico hacia Firebase (Firestore, Auth,
Functions) una vez aplicado por servicio, no solo las páginas donde se ponga un widget suelto —
más apropiado para este proyecto, donde el frontend habla directo con Firestore en casi todo.

**1. La extensión oficial de Firebase para esto está rota — no es un error de configuración.**
`cloudflare-turnstile-app-check-provider` (Extensions Hub, Made by Cloudflare) despliega su
propia Cloud Function, pero al instalarla falló con: `RESOURCE_ERROR ... Failed to create 1st
Gen function ... runtime: Runtime validation errors: [DEPLOYS_NOT_ALLOWED: Runtime nodejs18 is
decommissioned and no longer allowed]`. Confirmado revisando el `extension.yaml` publicado
(runtime nodejs18) contra el de la rama `main` en GitHub (ya dice nodejs22) — Cloudflare
corrigió el código fuente pero no ha republicado una versión nueva al marketplace. Mientras eso
no pase, **instalar la extensión desde el botón de la consola de Firebase va a fallar siempre.**

**2. Solución: el mismo intercambio de token, pero como un endpoint del propio backend, no
como una Cloud Function separada.** Nuevo módulo `backend/src/app-check/`
(`app-check.service.ts` + `app-check.controller.ts`): recibe el token de Turnstile, lo verifica
contra `https://challenges.cloudflare.com/turnstile/v0/siteverify` con `TURNSTILE_SECRET_KEY`
(nueva variable de entorno), y si es válido llama a
`firebaseService.appCheck.createToken(appId, { ttlMillis })` (Admin SDK — se le agregó el
getter `appCheck` a `FirebaseService`) para emitir un token real de Firebase App Check. Cero
Cloud Functions, cero Artifact Registry, cero Secret Manager — todo corre en la misma
instancia de NestJS que ya está desplegada. El endpoint (`POST /api/app-check/exchange`) es a
propósito el único de todo el backend sin ningún guard: es el mecanismo de verificación en sí
mismo, todavía no existe ningún token de App Check que exigir para llegar hasta ahí.

Un detalle que habría roto el intercambio en silencio si no se revisa el tipo exacto: el Admin
SDK devuelve `{ token, ttlMillis }`, pero el cliente (`CloudflareProviderOptions`, paquete
`@cloudflare/turnstile-firebase-app-check`) espera `{ token, expireTimeMillis }` — hubo que
convertir explícitamente (`Date.now() + ttlMillis`), si no el cliente no sabe interpretar la
respuesta aunque el token en sí sea válido.

**3. Frontend: App Check inicializado en `app.config.ts`, pero solo en el navegador.**
Instalado `@cloudflare/turnstile-firebase-app-check` (más `@types/cloudflare-turnstile` como
devDependency y agregado a la lista `types` de `tsconfig.app.json` — el paquete de Cloudflare
publica su `src/index.ts` sin compilar como `"main"`, así que TypeScript lo tipa-chequea
directo y sin esos tipos no compila). `provideAppCheck(...)` se agrega al array de providers
con un spread condicionado a `typeof window !== 'undefined'` — ni siquiera se registra el
provider en el servidor, no basta con envolver el cuerpo de la factory como se hizo con Auth en
una sesión anterior: el constructor de `CloudflareProviderOptions` toca `document.body`
directamente (inyecta el widget invisible de Turnstile) apenas se instancia, antes de llegar
siquiera a `initializeAppCheck()`. Verificado con el build de producción completo: sigue
prerenderizando las 6 rutas públicas sin ningún `ReferenceError`.

**Pendiente para que quede operativo de punta a punta — no depende de más código, depende de 2
datos reales:**
- `turnstileSiteKey` en `environment.ts`/`environment.development.ts` sigue con el valor de
  relleno `'TU-SITEKEY-DE-TURNSTILE'` — falta el sitekey público real de Turnstile.
- `TURNSTILE_SECRET_KEY` en `backend/.env` **ya tiene el valor real** (empieza con
  `0x4AAAAAA...`, formato correcto de Cloudflare). Ojo con esto para el futuro: el primer valor
  que se intentó pegar acá (`6Lcbkpgt...`) resultó ser el sitekey de **reCAPTCHA Enterprise**
  de la pantalla "Apps" de App Check en la consola de Firebase, no de Turnstile — son pantallas
  distintas dentro de la misma consola y es fácil confundirlas. Un sitekey/secret de reCAPTCHA
  siempre empieza con `6L...`; uno de Turnstile siempre con `0x4AAAAAA...`.
- Verificado con un token falso que el endpoint SÍ llega hasta Cloudflare de verdad (122 ms de
  respuesta real contra la API de siteverify, contra 4 ms cuando la clave faltaba y el código
  cortaba camino antes) y responde `{ "token": "", "expireTimeMillis": 0 }` — el contrato de
  fallo correcto. No se pudo probar el flujo completo con un token real porque eso requiere el
  sitekey real resolviendo el widget en un navegador de verdad, que es justo lo que falta.
- `AppCheckGuard` (`backend/src/common/guards/app-check.guard.ts`) está listo pero
  deliberadamente no atado a ningún controlador todavía — atarlo antes de terminar de probar el
  intercambio de token le cortaría el acceso a esos endpoints de inmediato.

**Dónde se activa la protección real cuando todo esté listo:** consola de Firebase → Build →
App Check → pestaña "APIs" → cada servicio tiene su propio interruptor "Sin aplicar"
(Supervisión) / "Aplicar". **No se activa desde Cloudflare** — el dashboard de Cloudflare solo
administra el widget de Turnstile en sí (sitekey, dominio, modo), no tiene ningún concepto de
"aplicar" para servicios de Firebase. Confirmado en capturas del propio usuario que Cloud
Firestore ya está en "Supervisión" (0% verificadas / 100% no verificadas — esperado, ya que
nada usa Turnstile todavía con valores de relleno). Recomendación de Google: mirar esa
proporción al menos una semana antes de pasar a "Aplicar".

> Las otras 3 rutas sin carga diferida (`/modules`, `/topic/:id`, `/simulation/:id`) y la
> limpieza de `.pro-logo` en `styles.css` que se hicieron en esta misma sesión ya están
> documentadas en la entrada de abajo ("SEO técnico..."), no se repiten acá.

### 2026-08-25 — SEO técnico (prerendering de 6 rutas públicas), auditoría real de rendimiento con
Lighthouse, y una limpieza grande de peso muerto (archivos huérfanos + rutas sin carga diferida)
Typecheck ✅ en cada tanda de cambios · build de producción ✅ repetido después de cada cambio ·
verificado en navegador con la cuenta real (`angapicar@gmail.com`) logueada: dashboard, Ruta de
Aprendizaje con las 7 materias, login/registro — sin errores de consola en ningún caso.

**Motivo del trabajo:** una captura de un checklist de SEO señalaba "View Source vacío (CSR)" como
hallazgo crítico — confirmado real: `index.html` solo traía `<app-root></app-root>`, así que
Google/redes sociales veían la página en blanco en su primer pase (antes de que Angular la arme en
el navegador).

**1. Prerendering (SSG) agregado con `@angular/ssr`, solo para 6 rutas públicas** — ver sección 2
("Prerendering (SSG) para SEO") para el detalle de arquitectura, acá solo los hallazgos puntuales
del proceso:
- `ng add @angular/ssr` + `angular.json` con `prerender: { discoverRoutes: false, routesFile:
  "prerender-routes.txt" }` (rutas: `/`, `/login`, `/register`, `/verify-email`, `/soporte`,
  `/trabaja-con-nosotros`).
- **`home.component.ts` no era SSR-safe**: `ngAfterViewInit()` completo (parallax del mouse, scroll
  del carrusel de noticias, autoplay de videos, `IntersectionObserver`) y dos timers infinitos
  arrancados en `ngOnInit()` (`startHeroSimulation()`, `startActiveStudentsFluctuation()`) tocaban
  `window`/`document` sin guardas — rompía el build o lo colgaba (un `setInterval` que nunca termina
  no deja que el prerenderer llegue al estado "estable" que espera antes de tomar la foto del HTML).
  Corregido con `isPlatformBrowser(inject(PLATFORM_ID))` en los 3 puntos, más un cuarto que se había
  escapado (`requestAnimationFrame` dentro de `loadFirestoreNews()`, no estaba dentro de
  `ngAfterViewInit` así que la primera guarda no lo cubría). También se gatearon las lecturas de
  Firestore del propio `ngOnInit` (perfil + noticias): un `await` a Firestore que se cuelga durante
  el build (red no disponible, o simplemente lento) cuelga el build entero en vez de fallar limpio.
- **`app.component.ts` tampoco lo era, y esto se llevó dos horas de diagnóstico**: `ngOnInit()`
  llamaba a `this.keyboardNavService.init()` como primera línea, y esa llamada revienta con
  `ReferenceError: window is not defined` en el servidor (el servicio hace
  `window.addEventListener(...)` sin guarda) — como el error no se atrapa, corta la ejecución de
  `ngOnInit()` ahí mismo, **antes de llegar a la línea siguiente**, que era `this.seoService.init()`.
  Efecto real: las 5 páginas públicas que no son el home (login, registro, soporte, etc.) tenían el
  `<title>`/`<meta description>`/`og:*`/`canonical` correctos solo en el navegador (donde sí llega a
  ejecutar `seoService.init()`), pero el HTML crudo pre-renderizado — lo único que ve un bot que no
  corre JavaScript — seguía mostrando el título del home en las 5. Corregido reordenando: `seoService
  .init()` va primero (sin guarda, tiene que correr en servidor y navegador), y todo lo demás
  (atajos de teclado, scroll-to-top al navegar, clases de accesibilidad en `document.body`) quedó
  detrás de un `if (!isBrowser) return`. Verificado con `grep` sobre el HTML de cada ruta prerenderizada
  antes/después: las 5 pasaron de mostrar el título del home a mostrar el suyo propio.
- **AngularFire (`getAuth()`) tiene el mismo problema por su cuenta**: su persistencia por defecto
  intenta detectar `indexedDB`/`window` de forma asíncrona, y esa detección nunca resuelve en Node —
  cuelga el prerender en vez de fallar. Primero se probó `setPersistence(auth, inMemoryPersistence)`
  después de `getAuth()`, pero el problema es que la detección async ya había arrancado antes de
  poder cambiarla — seguía colgando. La solución real: en el servidor, crear el Auth con
  `initializeAuth(getApp(), { persistence: inMemoryPersistence })` directamente (nunca prueba
  IndexedDB/localStorage), reservando `getAuth()` normal solo para el navegador. Además, `isLoggedIn$`
  /`user$` de `home.component.ts` (consumidos con `toSignal()`, que se suscribe en el momento de
  construir el componente, no en `ngOnInit`) se cambiaron a `of(false)`/`of(null)` en el servidor —
  la página prerenderizada siempre se ve "deslogueada", que es lo correcto para un bot/crawler; un
  visitante real ve su sesión real apenas hidrata en su navegador.
- **Bug propio, encontrado en la verificación, no antes de publicarlo:** al configurar el
  `rewrite` catch-all de `firebase.json`, se dejó apuntando a `/index.html` (el HTML pre-renderizado
  específico de la ruta `/`) en vez de a `/index.csr.html` (el cascarón genérico que Angular genera
  para este propósito exacto). Con el error, cualquier URL no reconocida por Firebase Hosting como
  archivo estático (ej. `/dashboard` cargado directo) habría mostrado por un instante el contenido de
  marketing del home en vez de la app real, antes de que el router del lado del cliente corrigiera.
  Corregido antes de reportar el trabajo como terminado — verificado leyendo el contenido real de
  ambos archivos generados para confirmar cuál es cuál.
- Se agregó `noIndex: true` a las **51 rutas privadas** de `app.routes.base.ts` (dashboard, toda la
  Ruta de Aprendizaje, ensayos, admin, etc. — todas las que tienen `canActivate: [authGuard...]`),
  como segunda capa de defensa: `robots.txt` ya las bloqueaba, pero un bot que no respete ese archivo
  ahora también se encuentra con `<meta name="robots" content="noindex, nofollow">` en cada una.
  Verificado con la cuenta real: `/dashboard` manda ese meta tag, las páginas públicas siguen en
  `index, follow`.

**2. Auditoría de rendimiento — con Lighthouse real, no una estimación.** Corrido contra la build de
producción real servida en un servidor estático local (no `ng serve`, que nunca refleja el peso real).
Resultado: **SEO 92/100**, **Rendimiento 51/100 en celular** (55/100 en escritorio) — LCP de **25.9
segundos** en celular. Hallazgos concretos, no genéricos:
- El único punto que le resta al SEO: 3 links del navbar del home (`(click)` sin `href`) no son
  "rastreables" para Google — quedó pendiente, no se tocó.
- 4.6 MB de peso solo en el home; 739 KB de JavaScript que se descarga sin usarse en esa página.
- Un solo GIF/animación de Cloudinary pesa 648 KB sin `width`/`height` declarados (causa saltos de
  layout mientras carga).
- Hallazgo que contradice lo que se asumía: **no todos los SVG del proyecto son livianos** — 4 íconos
  (`P_MenteVeloz`, `P_m2`, `P_Logro`, `P_MiniEnsayos`) pesan 140-190 KB cada uno. Investigado a fondo
  más tarde el mismo día (ver abajo): son ilustraciones foto-realistas vectorizadas automáticamente
  desde una imagen, no vectores hechos a mano — de ahí el peso.

**3. Limpieza de archivos huérfanos — 209 MB reales del build + 107 MB de repo, verificados con
`grep` antes de cada borrado, no solo "parece que no se usa":**
- `assets/images/subjects/*.png` (42 MB, 8 archivos) — cero referencias en el código; ya reemplazados
  por `subjectsAVIF/*.avif`, que sí está en uso.
- `assets/images/videosHome/rutaDeAprendizajeTest.mp4` (18 MB) — cero referencias.
- Las 6 carpetas `assets/images/L-*-IMAGENES` (149 MB, comprensión lectora escaneada) — resultaron
  ser **contenido a medio terminar**, no reemplazado: hay 2 scripts (`src/generate-lenguaje.js`,
  `src/generate-l-2025.js`) pensados para generar un banco de preguntas de Lectura a partir de esas
  imágenes, pero el JSON de salida nunca se generó ni se conectó a la app (entre los bancos de
  ensayos reales solo existen los prefijos `m1,m2,b,f,h` — nunca uno de lectura). Se decidió borrar
  igual, a pedido explícito, sabiendo que es contenido pausado y no basura reemplazada.
- `src/pruebasDemre/` (107 MB, la carpeta gemela **fuera de** `assets/`, la que usaba `npm run
  cropper`) — eliminada por completo a pedido explícito ("ya no lo vamos a usar"), junto con el
  script `"cropper"` de `package.json`. **Ojo:** `src/assets/pruebasDemre/` (la de 107 MB con los
  PDFs+soluciones, hallazgo de seguridad de la sección 11) es una carpeta **distinta** y no se tocó.

**4. Rutas sin carga diferida, corregidas — 9 en total:** `login`, `register`, `ensayos`,
`ensayo/:id/run`, `ensayo/:id/review`, `modules`, `topic/:moduleId/:topicId`, `simulation/:attemptId`
pasaron de `component: X` (cargado siempre, en cada visita a cualquier página) a `loadComponent: () =>
import(...)`. Efecto medido: el bundle inicial bajó de 2.39 MB a 1.98 MB. Se investigó a fondo por
qué el primer intento (solo Ensayos) no bajó el peso esperado: `EnsayosListComponent` importa
`DashboardService`, que importa `PaesContentService`, que importa `seed-data.ts`+`seed-historia.ts`
(850 KB de contenido de la Ruta de Aprendizaje) — arreglar esa sola ruta no alcanzaba.

**Pendiente, evaluado pero NO implementado — riesgo real, no solo "no había tiempo":** un chunk de
750 KB (`seed-data.ts` + `seed-historia.ts` + `paes-content.service.ts` + `dashboard.service.ts`)
se sigue precargando en **todas** las páginas, incluido el home. Causa raíz distinta a la de arriba:
no es un import muerto, es que ~15 rutas distintas de la Ruta de Aprendizaje comparten ese contenido,
y el propio compilador (esbuild) decide precargarlo de una vez para todo el sitio en vez de dejarlo
100% bajo demanda. El arreglo correcto — que `paes-content.service.ts` importe `seed-data.ts` con un
`import()` dinámico dentro del método que realmente necesita el contenido local (solo cuando
Firestore falla, o para el harness de desarrollo) en vez de con un `import` estático de módulo — es
un cambio real y no descabellado, pero **no es trivial ni de bajo riesgo**: ese servicio expone datos
como signals síncronos a ~15 componentes distintos, y volverlos asíncronos obliga a tocar cada
consumidor. Además hay que volver a probar los 3 escenarios que dependen de este contenido local
(carga normal con Firestore, el *fallback* cuando Firestore falla — que ya le pasó a este proyecto
en auditorías anteriores, ver sección 11 — y el harness `/dev/ruta`, que depende 100% de este
contenido porque corre con Firestore vacío a propósito). No se tocó.

**5. Caché de archivos estáticos, implementada en `firebase.json`:** JS/CSS/fuentes (`.js`, `.css`,
`.woff`, `.woff2`, `.ttf`) con `Cache-Control: public, max-age=31536000, immutable` — seguro porque
Angular les pone un hash en el nombre en cada build (`outputHashing: "all"`), así que un archivo con
ese nombre nunca cambia de contenido. Imágenes/video (`.png,.jpg,.jpeg,.gif,.svg,.webp,.avif,.ico,
.mp4,.webm`) con `max-age=604800` (7 días) — más conservador porque estos SÍ pueden reemplazarse
manteniendo el mismo nombre de archivo.

**6. Bug real en `paes-content.service.ts`: a Biología/Física/Química/Técnico-Profesional nunca les
tocaba imagen.** El código que rellena `imageUrl` cuando Firestore no trae uno (`materias.forEach(m
=> { if (!m.imageUrl) { if (m.id === 'comp-lectora') ... } })`) solo cubría 4 de las 8 materias
(Comprensión Lectora, M1, M2, Historia) — nunca se completó para las otras 4. Corregido agregando
esas 4 ramas, y a propósito **sin** la guarda `if (!m.imageUrl)` para estas (la imagen local siempre
manda), porque no hay evidencia de que alguna vez se gestionara un `imageUrl` custom para estas 4
desde Firestore — así se cubre tanto el caso "no viene nada" como "viene algo roto". Verificado con
la cuenta real: las 3 imágenes cargan (200 OK, tamaño de archivo exacto). **Ojo:** si el usuario
sigue sin verlas después de este fix, casi seguro es la caché de 6 horas de `localStorage`
(`learning_path_cache` / `learning_path_cache_timestamp`, ver `CONTENT_CACHE_TTL_MS` en el propio
servicio) sirviendo datos de antes del fix — hay que borrar esas 2 claves y recargar, no es que el
fix no funcione.

**7. Limpieza de CSS muerto en `styles.css` — solo lo verificado, no una pasada agresiva.** Se
comparó cada clase CSS del archivo contra **todo** el código fuente (no solo una página visitada en
vivo, que da falsos positivos si una clase se usa en una ruta que no se probó). Encontrado y
eliminado: `.pro-logo` (3 bloques de reglas, incluidos dos `body .sidebar-logo:has(.pro-logo)`
duplicados palabra por palabra) — cero elementos en toda la app tienen esa clase; el hermano
`.pro-username` sí se usa (`dashboard.component.ts`) y se dejó intacto. Se revisó también que los 12
`@keyframes` del archivo y las clases `driver-popover-*`/`driver-active-element` (0 coincidencias en
el código propio, pero son clases que **driver.js genera en tiempo real**, no muertas) — nada más
calificó como seguro de borrar sin una herramienta de cobertura real corriendo sobre cada ruta, que
es un trabajo aparte más grande que esta pasada.

**8. Encontrado y reportado, NO corregido — decisión pendiente del equipo:**
- `@angular/animations` y `dotenv` en `dependencies`: cero archivos los importan. No afectan lo que
  descarga un usuario (Angular no empaqueta lo que no se usa), solo inflan `npm install`.
- `@google/generative-ai` en `dependencies` (no `devDependencies`), pero solo lo usan scripts sueltos
  (`test-gemini.js`, extractores de PDF) — nunca la app real sirvió por este paquete.
- `seed-data.backup.ts` (416 KB) y `seed-historia.backup_20260806_1940.ts` (256 KB) — sin ningún
  import. No afectan el bundle (TypeScript no usado no se compila), solo el tamaño del repo.
- `.firebase/*.cache` sigue versionado en git (uno de los dos archivos menciona `frontend-landing`,
  el proyecto que ya no existe) — ya estaba documentado en la sección de deuda técnica, sigue igual.
- 591 archivos de `node_modules` de `pdf-cropper-tool` siguen versionados dentro de
  `src/assets/pruebasDemre/` (la mitad de lo documentado en deuda técnica — la otra mitad, en
  `src/pruebasDemre/`, se fue con el borrado del punto 3).

### 2026-08-22 (parte 16) — Auditoría de seguridad de Flow, Flow como único método de pago en el
modal de precios, `planType` persistido en `subscription`, y aviso de renovación con antelación
Backend typecheck ✅ (tras `npm install` en `backend/` — faltaban `@google/generative-ai` y otras
dependencias no instaladas en este entorno, nada relacionado con este cambio) · frontend typecheck
✅ (`tsc --noEmit`) · verificado en navegador logueado con la cuenta real (`angapicar@gmail.com`)
abriendo el modal de precios hasta el paso de pago.

**Auditoría de la integración de Flow — 1 hallazgo real, corregido.** En
`FlowService.handleRecurringWebhook()` (backend/src/subscriptions/flow.service.ts), la línea
`const subscriptionId = body.subscriptionId || invoiceStatus?.subscriptionId;` confiaba primero en
el campo `subscriptionId` del **body del webhook**, que Flow no firma — cualquiera puede hacerle un
POST a `/api/subscriptions/flow/webhook` (no está detrás de `FirebaseAuthGuard` a propósito, porque
Flow lo llama server-to-server). El resto del método SÍ hace lo correcto (nunca confía en el body
para el estado de pago: siempre re-consulta `/invoice/get` a la API de Flow con una petición firmada
usando `invoiceId`/`token`), pero como `subscriptionId` se tomaba del body en vez de la respuesta
verificada, un atacante podía tomar el `invoiceId` de una factura real y pagada (incluso una propia,
de sandbox o de un cobro legítimo cualquiera) y combinarlo con un `subscriptionId` falso apuntando a
la suscripción de otra persona — el backend habría extendido el Plan PRO de la víctima gratis.
Corregido invirtiendo la prioridad: `invoiceStatus?.subscriptionId || body.subscriptionId` — ahora
sólo se usa el valor del body cuando Flow no devolvió ningún `invoiceStatus` verificado, caso en el
que `isPaid` ya da `false` de todos modos (no se puede activar nada). El resto de la integración
(firma HMAC-SHA256 de cada petición saliente en `sign()`, verificación server-to-server con
`getRegisterStatus`, transacciones de Firestore para evitar dobles activaciones en
`confirmRegistrationAndSubscribe`/`activateSubscription`, idempotencia de webhooks vía
`flow_invoices/{invoiceDocId}`, ventana de 2 días en `extendSubscriptionPeriod` para no duplicar el
período del primer cobro) ya estaba bien pensada — no se tocó nada más ahí.

**El campo `planType` ('monthly'|'yearly') nunca se guardaba en `users/{uid}.subscription`**, pese a
que `activateSubscription()`, `extendSubscriptionPeriod()` y `manualGrant()` ya reciben ese dato como
parámetro. Se agregó a los tres (merge recursivo de Firestore: sólo toca esa clave, no pisa el resto
del mapa `subscription`) — necesario para que el nuevo aviso de renovación (ver abajo) pueda mostrar
el monto correcto, y útil en general para el panel admin a futuro.

**Modal de precios: Flow pasa a ser el único método de pago visible** (`pricing-modal.component.ts`).
Se sacó el selector de pestañas "💳 Flow / 🏛️ Transferencia" y todo el bloque de transferencia manual
(datos bancarios, formulario de comprobante, pantalla de éxito) — reemplazado por una sola insignia
fija "Flow (Tarjetas de crédito y débito, suscripción)". Esto no es sólo estético: una transferencia
bancaria no puede auto-cobrarse periódicamente (no hay forma de que el banco reintente el cobro sin
que el usuario actúe cada vez), así que nunca encajó con el modelo de suscripción recurrente que ya
implementa Flow (`/customer/register` + `/subscription/create`) — Flow **tampoco** ofrece
transferencia como medio para registrar una suscripción recurrente en su checkout alojado (eso sólo
existe para pagos únicos vía `/payment/create`, que esta app no usa). El componente quedó sin el
signal `paymentMethod`/tipo `PaymentMethodOption`, sin los campos `bankName`/`transferNumber`/
`transferSubmitted` y sin `submitTransferReport()`. Se quitó también el ícono 🎯 de emoji sobre "¿Para
quién es el Plan Pro?", reemplazado por `assets/images/Nuevos VideosEIlustraciones/iconosSVG/P_Pro.svg`
(el mismo ícono que ya usa el sidebar del dashboard para la píldora PRO) — verificado en navegador que
carga bien (977×1024 natural, renderiza a 56×56). El texto "🔒 Suscripción 100% segura a través de
Flow y Transferencia Bancaria" del paso 1 se acortó a "...a través de Flow".

**No se tocó el backend de transferencia manual** (`SubscriptionsService.submitManualTransfer/
approveTransfer`, `POST /subscriptions/transfer/submit`, el panel `/admin/suscripciones`): sigue
existiendo para los registros históricos ya aprobados/pendientes en `manual_payments` y por si un
admin necesita aprobar algo generado fuera de la UI. Sí se limpió el único código muerto que quedó
tras sacar el formulario: `PaymentService.submitManualTransfer()` / la interfaz `ManualTransferData`
en el frontend, que ya no tenían ningún llamador (`pricing-modal.component.ts` era el único).

**Nuevo: aviso de renovación con antelación** (`features/payment/renewal-notice-banner.component.ts`,
insertado en `dashboard.component.ts` justo dentro de `<main class="main-content">`, antes del
`<header class="dashboard-header">` — en flujo normal del documento, **sin** `position:fixed/sticky`
a propósito: el resto del sitio ya pelea bastante con headers fijos y paddings ajustados por página,
ver sección 8, así que un banner fijo global habría chocado con eso). Flow no ofrece ningún webhook
de "aviso antes de cobrar" (sólo el que ya existe, disparado DESPUÉS de cada intento de cobro), así
que este aviso es 100% client-side: lee `subscription.endDate`/`planType`/`provider` del perfil ya
sincronizado en tiempo real desde Firestore y, si faltan 3 días o menos para el `endDate` (y
`provider === 'flow'`, `status === 'active'`, `!cancelAtPeriodEnd`), muestra "Tu Plan PRO se renueva
automáticamente el [fecha] por $[monto] — se cobrará a tu tarjeta en Flow si no cancelas antes" con
un botón a Configuración y un cierre que se recuerda en `localStorage` por fecha de renovación
(vuelve a aparecer en el próximo ciclo). No se muestra para `provider: 'manual'|'transfer'` (esos
planes no se auto-cobran, avisar sería engañoso). Verificado en navegador con la cuenta de prueba
(Plan Básico): el banner no aparece y no tira errores de consola — no se pudo probar el caso
visible (requeriría una suscripción Flow real venciendo en ≤3 días, que no existe en este entorno).

**Estado real de Flow en este entorno: NO está configurado.** `backend/.env` sólo tiene las 3
variables de Firebase — ninguna `FLOW_*` ni `BACKEND_PUBLIC_URL` ni `GEMINI_API_KEY`. El código de
Flow está completo e implementado (confirmado en esta auditoría), pero nunca se ha ejecutado contra
una cuenta real de Flow, ni siquiera en sandbox. Pendiente que el usuario cree su cuenta en
`sandbox.flow.cl`, saque su API Key/Secret Key, corra `npm run setup:flow-plans` y complete
`backend/.env` — instrucciones detalladas se dieron en la conversación, no repetidas aquí para no
duplicar contenido que puede desactualizarse (los pasos exactos están en la sección 10 y en
`backend/.env.example`, ya documentados).

### 2026-08-22 (parte 15) — Home desktop: más separación horizontal entre la columna de texto y la
tarjeta de la simulación en vivo
Typecheck ✅ (`tsc --noEmit`) · verificado con `getBoundingClientRect` en 1440px, en dos pasadas
(el usuario pidió subirlo más después de ver el primer valor).
`.hero-grid { gap: 2.5rem }` → `3.5rem` (hueco de 40px a 56px) → `5rem` (80px) → **`4.5rem`**
(hueco final: 72px, valor con el que quedó tras probar 3 valores). Sin efectos secundarios en
ninguna pasada — es el único lugar donde se usa ese `gap` (columnas del hero), y a 1440px sigue
cabiendo todo sin desbordar el `max-width: 1320px` del contenedor.

### 2026-08-22 (parte 14) — Home desktop: la fila de avatares/estrellas + "Comenzar Gratis"/"Iniciar
Sesión" se veía pegada a la izquierda pese a tener `align-items:center` puesto
Typecheck ✅ (`tsc --noEmit`) · verificado con `getBoundingClientRect` en 1440px.

**`.hero-cta-group` (el contenedor de la fila de avatares+estrellas y los dos botones) ya tenía
`display: inline-flex; flex-direction: column; align-items: center`, pero `inline-flex` se encoge
al ancho de su propio contenido (como `inline-block`) — así que "centrado" solo centraba esos
elementos DENTRO de una caja ya angosta, pegada al ancho del contenido más ancho (los botones), sin
relación con el ancho real de la columna izquierda del hero. Cambiado a `display: flex` (a secas):
al ser block-level, por defecto ocupa el 100% del ancho disponible del contenedor padre, así que el
`align-items: center` que ya estaba ahí pasa a centrar de verdad respecto a toda la columna.
Verificado: `.hero-cta-group` mide exactamente el mismo ancho que `.hero-left-content` (709px = 709px,
0px de hueco a los lados) y el centro horizontal de la fila de avatares y de la fila de botones
coincide exactamente con el centro de la columna izquierda.

### 2026-08-22 (parte 13) — Home desktop: píldoras superiores bajadas un poco, la tarjeta
"Adaptativo/En tiempo real/100% enfocado" con el mismo contorno que la tarjeta de la simulación, y
el aire muerto de 72px al fondo de la simulación recortado para que las dos tarjetas terminen a la
misma altura
Typecheck ✅ (`tsc --noEmit`) · verificado en navegador (1440px), incluyendo muestreo en vivo de la
animación del demo del tutor IA (que cicla y cambia de alto) para no adivinar un valor fijo.

**Píldoras ("919 estudiantes activos" / "41% OFF...") un poco más pegadas al borde superior de lo
que se veía bien, tras el ajuste de `align-items:start` de una sesión anterior.** Se les agregó
`margin-top: 0.6rem` a `.hero-top-badges` — antes tocaban el mismo `top` exacto que la tarjeta de
la derecha (0px de diferencia), ahora quedan 9.6px más abajo, un respiro pequeño e intencional en
vez de un alineado a rajatabla.

**`.hero-benefits-bar` (la tarjeta con Adaptativo/En tiempo real/100% enfocado) tenía un contorno
propio, más sutil (`1px solid rgba(133,92,214,0.16)`, morado tenue) que el de la tarjeta de la
simulación (`.hero-sim-card.glass-card`, `2px solid #cbd5e1`, gris azulado).** Se igualó el borde de
`.hero-benefits-bar` al de `.hero-sim-card` exactamente — pero probado en pantalla no convenció, así
que en la misma sesión se revirtió a `border: none` (sin contorno), y después se pidió sacarle
también el fondo, el `box-shadow` y el `backdrop-filter` — quedó sin ningún look de "tarjeta": solo
queda el `display:grid` + `gap` + `padding` que ordenan los 3 chips (Adaptativo/En tiempo
real/100% enfocado), que ahora se ven flotando directamente sobre el fondo del hero, sin caja
detrás. Verificado con `getComputedStyle`: `background-color: rgba(0,0,0,0)`, `border: 0px none`,
`box-shadow: none`, `backdrop-filter: none`.

**La tarjeta de la simulación terminaba 72px más abajo que la tarjeta de beneficios (su
`min-height: 840px` era mucho mayor de lo que el contenido real necesita), rompiendo la simetría
que se buscaba en una sesión anterior.** Antes de tocar el valor a ciegas, se midió la altura NATURAL
del contenido (sin el `min-height`) muestreando en vivo durante ~20 segundos, cubriendo varios
ciclos completos de la animación del demo (el panel del Tutor IA pasa por 5 pasos —
seleccionar/analizar/escribir/mostrar concepto— cada uno con distinto contenido y por lo tanto
distinto alto): el rango real fue 742-764px, nunca más. El alto exacto que hacía falta para que el
borde inferior de la tarjeta coincidiera con el de `.hero-benefits-bar` era 767.86px (calculado
como `benefitsBottom - simCardTop`). Como ambos números casi coinciden, se bajó `min-height` de
840px a **768px** — cubre de sobra el paso más alto de la animación (764px, cero riesgo de recortar
contenido) y dado que actúa como piso fijo, mantiene la tarjeta siempre a esa altura sin importar en
qué paso esté la animación (elimina también el jiggle de alto que tendría si se hubiera quitado el
`min-height` del todo). Verificado tras el cambio: `rightBottom - benefitsBottom` = 0.14px (antes
72.14px).

### 2026-08-22 (parte 12) — Pestaña vertical de simuladores (Matemática M1/M2 y Física) reemplaza el
nombre largo por un ícono SVG en móvil, y se oculta el tip "usa el botón Ampliar" (el botón ya
estaba oculto en móvil desde antes)
Typecheck ✅ (`tsc --noEmit`) · verificado en navegador: abriendo el cajón en móvil (375px) y
comparando contra escritorio (1440px, sin cambios).

**La pestaña fija "SIMULADORES INTERACTIVOS" (texto vertical, `writing-mode:vertical-rl`, en el
borde derecho de la pantalla) ocupaba mucho alto en móvil — 25 letras verticales son una pestaña
larga.** Se agregó un SVG dentro del `<span class="sim-tab-icon">` (antes vacío) — una curva sobre
ejes para Matemática M1/M2 (`materia-math-path.component.ts`, se repitió en los 3 bloques
duplicados del archivo, ver sección 8 sobre esta duplicación preexistente) y un átomo (3 elipses
rotadas) para Física (`materia-fisica-path.component.ts`) — y se ocultó `.sim-tab-label` en el
mismo `@media (max-width: 860px)` que ya existía para el cajón, mostrando el ícono en su lugar.
Verificado: `triggerHeight` pasa de la altura que ocupaba el texto vertical a 70.6px con el ícono,
en ambos archivos. En desktop (1440px) no cambia nada — el texto sigue ahí, el ícono queda oculto.

**El tip "💡 Si no visualizas bien la simulación, usa el botón ↗ Ampliar de arriba" ya no aplicaba
en móvil, porque ese mismo botón se ocultó ahí en una sesión anterior** (el cajón ya mide 100vw en
móvil sea "ampliado" o no, así que Ampliar/Reducir no hace nada visible). Se le agregó
`class="sim-expand-tip"` al `<div>` (antes sin clase, solo estilos inline) y se ocultó con
`display: none !important` en el mismo breakpoint de 860px — el `!important` hace falta porque el
`display:flex` está en un `style=""` inline, que sin `!important` le gana a una regla de clase
externa. Verificado: `display:none` en móvil, `display:flex` intacto en desktop.

### 2026-08-22 (parte 11) — Gifs de capítulo agrandados de nuevo (170px→220px en ≤480px, 130px→170px
en ≤900px) ahora que `object-fit:contain` (parte 10) garantiza cero recorte sin importar el tamaño
del contenedor, y botón "⚡ REFORZAR" quitado del índice de materias (llevaba al Modo Infinito,
oculto para todos menos admins desde la parte 9)
Typecheck ✅ (`tsc --noEmit`) · verificado en navegador forzando la carga real de la imagen (mismo
método que en la parte 10) y comprobando ausencia del botón en el DOM.

**Confirmado por el usuario con una captura real que el recorte por % seguía cortando contenido**
(destellos/hoja/botella de la ilustración de Biología cortados en el borde) — la parte 10 ya lo
había resuelto cambiando a `object-fit:contain` sin ningún recorte posible, a costa de que el
personaje se viera más chico dentro del recuadro. Como ese enfoque nunca puede recortar (por
diseño: `contain` solo escala hacia abajo para caber, nunca recorta), agrandar el contenedor no
reintroduce el riesgo — así que se subieron los dos tamaños de `.splash-mascot-area` otra vez:
130px→170px (`≤900px`) y 170px→220px (`≤480px`), en los 6 `materia-*-path.component.ts`. Verificado
forzando la carga real de la imagen de Biología (`1280×720`) antes de medir: con el contenedor en
220×220px, la imagen renderiza a 220×123.75px (llena el ancho completo, alto proporcional exacto a
16:9), 0px cortado en cualquier eje.

**Botón "⚡ REFORZAR" en las tarjetas de materia del índice de la Ruta de Aprendizaje
(`learning-path.component.ts`, no confundir con los `materia-*-path.component.ts` de las partes
anteriores — es una pantalla distinta, la lista con "N Capítulos · N Lecciones" y la barra de
progreso).** Aparecía junto al botón principal cuando una materia llegaba al 100% y llamaba a
`goToMateria(m, 'infinite', $event)` — es decir, navegaba a `/ruta/{materiaId}?mode=infinite`,
exactamente el mismo mecanismo que la parte 9 dejó reservado solo para admins (`adminService.
isAdmin()` en el `effect()` del constructor de cada `materia-*-path.component.ts`). Para un usuario
normal el botón ya no *hacía* nada dañino (el query param se ignora sin ser admin), pero seguía
siendo un botón visible y confuso que promete algo que no existe para ese usuario. Se quitó el
`<button class="btn-reinforce-action" *ngIf="...percentage === 100">` completo junto con su CSS
(`.btn-reinforce-action` y `:hover`, ya no se usan en ningún otro lado del archivo). El botón
"REPASAR" que aparece al lado (mismo `*ngIf` de 100%, pero es `.btn-main-action` con la clase
`.btn-review`) **no se tocó** — ese es el botón normal de repasar la materia ya completa, no tiene
relación con el Modo Infinito.

### 2026-08-22 (parte 10) — Gifs de capítulo: el recorte por porcentaje de la parte 9 seguía
cortando la ilustración (confirmado con captura real del usuario, no solo medición de DOM) — se
abandonó el recorte del todo a favor de un enfoque sin ningún riesgo de corte
Typecheck ✅ (`tsc --noEmit`) · verificado en navegador con `naturalWidth`/`naturalHeight` reales
tras forzar la carga de la imagen (`loading="lazy"` no dispara en el navegador de pruebas de esta
sesión porque no compone frames visualmente — no es un bug real, solo una limitación del entorno
de test; se confirmó cargando la imagen manualmente por JS antes de medir).

**La causa exacta de "sigue cortando" no se pudo confirmar (seguía sin poder verse la animación
en este entorno), pero ya no importa: se cambió de estrategia en vez de seguir ajustando el margen
de seguridad a ciegas.** En las partes 8/9 el `.splash-mascot` se posicionaba con
`position:absolute` + `width`/`left`/`top` en porcentajes calculados desde el bounding box del
canal alfa de un frame, con `overflow:hidden` en el contenedor — cualquier parte de la ilustración
(animada o no) que cayera fuera de ese recuadro calculado se recortaba limpio, y el usuario mandó
una captura real (el pulpo verde de Biología) mostrando destellos/hoja/botella claramente cortados
en el borde. En vez de seguir afinando el margen de seguridad (ya se había subido a 30% en la parte
9 y no alcanzó), se volvió al enfoque **sin ningún recorte posible**: se sacó `overflow:hidden` del
contenedor, `.splash-mascot` pasa a ser un ítem de flujo normal (`position:static`, ya no
`absolute`) con `width:auto; height:auto; max-width:100%; max-height:100%; object-fit:contain`, y
el centrado lo resuelve el propio contenedor (`.splash-mascot-area` ya es `display:flex;
align-items:center; justify-content:center` en su regla base, sin media query). Con esto el canvas
completo de cada `.webp` siempre cabe dentro del recuadro sin recortarse un solo píxel,
sin importar cuánto se mueva la animación — la única contrapartida es que el personaje se ve un
poco más chico que con el recorte agresivo (el recuadro deja de "rellenarse" al 100%, vuelve a
tener aire a los lados o arriba/abajo según la proporción de cada imagen). Se quitaron los 6
bloques de `width`/`left`/`top` en % por materia (ya no hacen falta: la regla nueva es idéntica
para las 6, no depende de las coordenadas de cada imagen). Aplicado en los 6
`materia-*-path.component.ts`, contenedor sin cambios de tamaño respecto a la parte 9 (130px/170px).
Verificado forzando la carga real de la imagen por JS antes de medir (`naturalWidth`/`naturalHeight`
confirmados: 1280×720 en Biología, 1920×1080 en Matemática — ambas 16:9): el `<img>` renderiza a
170×95.6px dentro del recuadro de 170×170, centrado verticalmente (`top:37.19px`,
`(170-95.6)/2≈37.19` ✓), ocupando el 100% del ancho disponible y 0% recortado en ningún eje.

### 2026-08-22 (parte 9) — Modo Infinito restringido a admins (nueva página `/admin/modo-infinito`),
rediseño final de los botones de audio descriptivo (sin desplegable, sin letras de atajo, ícono
play/stop) y el diseño "cuaderno" de las lecciones quitado en móvil
Typecheck ✅ (`tsc --noEmit`) tras cada tanda de cambios · `ng serve` reconstruyó sin errores ·
verificado en navegador logueado con la cuenta real (`angapicar@gmail.com`, plan Básico) a 375px.
El panel de admin nuevo (`/admin/modo-infinito`) se verificó indirectamente: el `adminGuard`
redirige correctamente a `/dashboard` a esta cuenta (no-admin), lo que confirma que la ruta y el
guard están bien conectados, pero **no se pudo probar visualmente el flujo completo de un admin
real** (no había credenciales admin a mano en esta sesión) — revisar con una cuenta admin real la
próxima vez que se toque esto.

**Modo Infinito (Polígono de Maestría) pasa a ser solo para el equipo, no para estudiantes.**
El pedido explícito: "lo queremos meter en una actualización futura" — no borrar el feature (que
ya funciona, `InfiniteMasteryModalComponent`), solo sacarlo de la vista de cualquier usuario normal
y dejarlo accesible únicamente desde el panel de admin. En los 6 `materia-*-path.component.ts` se
quitaron dos elementos que antes aparecían al completar una ruta: el selector "🗺️ Ruta Principal /
⚡ Modo Infinito" (`.path-view-segmented-wrap`) y la tarjeta "🌟 Reforzar Materia · Modo Infinito"
(`.infinite-mastery-node-card`) — ambos eran los únicos disparadores que ponían
`activePathTab = 'infinite'`. La vista embebida (`app-infinite-mastery-modal`) se dejó en el DOM
(sigue funcionando si `activePathTab` llega a `'infinite'` por otra vía), pero ya no hay ningún
botón que la alcance para un usuario normal.
El mecanismo de entrada para admins **ya existía pero estaba mal resuelto**: cada componente tenía
un `ngOnInit()` que leía `route.queryParams.subscribe(params => if (params['mode']==='infinite')
activePathTab='infinite')` sin comprobar el rol — cualquiera que conociera el query param podía
entrar. Se cambió a un `effect()` en el constructor que exige `adminService.isAdmin()` **y**
`route.snapshot.queryParams['mode']==='infinite'`. Tuvo que ser un `effect()` y no una comprobación
única en `ngOnInit`: `isAdmin()` es un signal que arranca en `null` (no confirmado) y resuelve
async contra Firestore — leerlo una sola vez al montar el componente se saltaba admins reales cuyo
rol aún no había terminado de confirmarse en ese instante. Se agregó `isInfiniteModeUnlocked()`
(`isEntirePathCompleted() || adminService.isAdmin()`) para que un admin pueda entrar sin haber
completado la ruta primero (impracticable para probar/enseñar la feature si se exigiera 100%
completada), y se reemplazaron las 3 apariciones de `isEntirePathCompleted()` en el template
(vista embebida, decoraciones de fondo, `.materia-page`) por esta nueva función en los 6 archivos.
`OnInit` se sacó de los 6 componentes (ya no queda nada en `ngOnInit` que lo necesite).

**Nueva página `/admin/modo-infinito`** (`admin-infinite-mode.component.ts`, sigue el mismo patrón
que `admin-bugs.component.ts`: `AdminSidebarComponent` + `.admin-main-content`, sin reutilizar los
nombres de clase genéricos que colisionan con `styles.css` — ver sección 8): un `<select>` con las
7 materias reales (comp-lectora, mat1, mat2, historia, ciencias-biologia, ciencias-fisica,
ciencias-quimica — se excluyó `ciencias`, el stub vacío) y un botón "⚡ Modo Infinito" que hace
`router.navigate(['/ruta/' + materiaId], { queryParams: { mode: 'infinite' } })`. Agregado el ítem
al `AdminSidebarComponent` y la ruta en `app.routes.base.ts` con el mismo `canActivate: [authGuard,
adminGuard]` que el resto del panel.

**Botones de audio descriptivo: última vuelta de rediseño, en 2 tandas dentro de esta misma parte.**
Primero se aplicó el mismo tratamiento visual (contorno + ícono, sin desplegable) que ya se había
hecho en las pantallas de descripción (bitácora anterior) al panel que quedaba pendiente: el de
**durante la lección**, biología/física (`seccion-test.component.ts`, `.a11y-mini-panel-container`).
Se quitó el botón toggle "🎧 Atajos ▼" (quedaba redundante con solo 3 acciones) y el panel pasó a
mostrarse siempre, bajo la leyenda "🎧 Audio Descriptivo" — mismo patrón que
`seccion-detail.component.ts`/`seccion-biologia-detail.component.ts`/`seccion-fisica-detail.component.ts`.
De paso se limpiaron las 3 llamadas a `this.shortcutsMenuOpen = false` en `nextQuestion()`/
`prevQuestion()`/`goToQuestion()` (existían para cerrar el panel al cambiar de pregunta; con el
panel siempre visible, ya no hacían nada) y el campo `shortcutsMenuOpen` en sí.

**"Diseño cuaderno" (línea roja de margen + anillado, `.question-card::before`/`::after`) — se
veía bien en desktop pero rompía el móvil, y no era exclusivo de biología/física: es del runner
compartido (`seccion-test.component.ts` y `seccion-test-math.component.ts`), afecta a cualquier
materia que pase por ahí.** El fix anterior (bitácora previa) solo *reposicionaba* la línea roja en
móvil (`left: 1.75rem`) sin quitarla, y dejaba el padding del `.question-card` asimétrico
(`1.5rem 1.5rem 1.5rem 2.5rem`, el extra a la izquierda era para dejarle sitio a la línea) — con
mucho menos ancho que en desktop, esa asimetría empujaba el enunciado y las opciones hacia la
izquierda, pegados al borde y descentrados. Corregido en el `@media (max-width: 640px)` de ambos
archivos: `.question-card::before { display: none }` (la línea ya no se reposiciona, se quita
del todo), padding vuelto simétrico (`1.5rem` parejo), y `.q-text`/`.option-btn` con
`text-align: center` (`.option-btn` además `justify-content: center`, es flex). Para física, que
además tiene `.question-card.split-layout .split-left` (columna izquierda cuando hay imagen de
apoyo) con el mismo padding asimétrico y sin cubrir en ningún media query, se agregó
`padding: 1.5rem` ahí también. Verificado con `getComputedStyle` en un jefe real (15 preguntas):
`::before` con `display:none`, `.question-card` con `padding:24px` parejo, `.q-text`/`.option-btn`
con `textAlign:center` y `.option-btn` con `justifyContent:center`.

**Gifs de capítulo: tercera y última vuelta de ajuste — el recorte "sin aire muerto" de la parte
anterior dejaba de nuevo grande y, según el usuario, seguía cortando contenido.** La matemática del
recorte (ancho/alto/posición en % calculados desde el bounding-box real del pulpo en cada webp) se
reverificó con un script aparte y da exactamente 0% de contenido fuera del recuadro — el cálculo en
sí no tenía el bug. La hipótesis más probable para "sigue cortando": **los 6 archivos son WEBP
ANIMADOS** (el pulpo se mueve/flota) y el recuadro se midió sobre un solo frame fijo; en otros
puntos de la animación el personaje puede extenderse más allá de ese recuadro (un tentáculo en
movimiento, por ejemplo), y como el contenedor tiene `overflow:hidden`, esos instantes se recortan.
No se pudo confirmar in situ si la animación efectivamente se mueve fuera del frame escaneado — el
navegador de pruebas de esta sesión no compone frames visualmente (no hay pane visible), así que
tampoco se pudo descartar. Ante la duda, se aplicó un margen de seguridad del 30% sobre el
recuadro medido antes de calcular el recorte (en vez de ajustar al 100% exacto), lo que reduce
bastante el zoom aplicado (ver tabla) y le da espacio de sobra a cualquier rango de movimiento de
la animación, a costa de dejar un poco del relleno transparente original (mucho menos que el
30-35% original, pero ya no 0%). También se encogió el contenedor una vez más, tal como pidió el
usuario ("encógelos un poco más"): de 160/240px a 130/170px en los dos breakpoints móviles.

| Materia (imagen) | `width`/`left`/`top` anteriores (0% margen) | Nuevos (30% margen) |
|---|---|---|
| Matemática (focoMatematica) | 194.13% / -47.83% / -7.08% | 149.33% / -25.25% / 6.09% |
| Comp. Lectora (focoComprensionLectora) | 264.46% / -83.68% / -25.0% | 203.43% / -52.83% / -7.69% |
| Historia (focoHistoria) | 243.35% / -73.38% / -19.96% | 187.19% / -44.91% / -3.82% |
| Biología (focoBiologia) | 278.26% / -88.91% / -40.0% | 214.05% / -56.86% / -19.23% |
| Física (focoFisica) | 220.13% / -59.52% / -24.40% | 169.33% / -34.25% / -7.23% |
| Química (focoQuimica) | 303.32% / -101.98% / -34.60% | 233.32% / -66.90% / -15.07% |

**Pendiente real, no resuelto en esta sesión:** confirmar visualmente (con capturas o video, no
solo mediciones de DOM) que el margen del 30% es suficiente y no excesivo — nadie en esta sesión
pudo ver el render final. Si en el futuro se puede verificar visualmente y el recorte sigue
sintiéndose grande o sigue cortando, el margen (hoy `1.3`, hardcodeado al calcular cada valor, no
una variable) es el primer lugar donde ajustar, junto con el tamaño de `.splash-mascot-area`
(130px/170px). El método completo (script de escaneo del canal alfa + fórmulas de `width`/`left`/
`top` en %) queda documentado en el historial de esta conversación por si hay que repetirlo para
un logo/imagen nuevo.

### 2026-08-22 (parte 8) — Animación del drawer de navegación arreglada de raíz (no solo maquillada),
gifs de capítulo recortados a su contenido real, nombres de nodo superpuestos en filas de 3,
puntitos de jefe con tope de 9, atajos de texto a voz sin equivalente táctil convertidos a botones,
y guía de teclado "[O] Repetir / [P] Volver al capítulo" solo en desktop
Typecheck ✅ (`tsc --noEmit`) tras cada tanda · `ng serve` reconstruyó sin errores · verificado en
navegador logueado con la cuenta real (`angapicar@gmail.com`, plan Básico) a 375px.

**La animación de apertura/cierre del drawer de navegación seguía sin animar en 14 de los 15
módulos/rutas, a pesar de que una sesión anterior "ya la había arreglado".** Esa sesión previa
cambió `styles.css` (global) de `display:none/block` a `opacity`/`visibility` con transición,
asumiendo que ningún componente tenía su propia regla local para `.mobile-overlay` — pero SÍ la
tenían: los 15 archivos con `.mobile-header` (dashboard, ensayos-list, mini-ensayo-setup, y los 7
de la familia Ruta + mente-veloz/career-finder/nem-calculator/recursos) traían cada uno su propia
`.mobile-overlay { display: none; ... }` / `.mobile-overlay.open { display: block; }` local,
copiada de antes de ese fix. Como el `display` no lo toca el `opacity`/`visibility` global, esa
regla local seguía mandando: el drawer quedaba `display:none` (invisible, sin poder animar) hasta
que la clase `.open` lo volvía `display:block` de golpe — la apertura se veía más o menos bien
(el navegador arranca la transición de opacity apenas el elemento se vuelve renderizable), pero el
**cierre** cortaba en seco, porque `display:none` se aplica instantáneo al sacar la clase, antes de
que la transición de opacity/left tuviera chance de jugar. Se borraron las 2 líneas muertas
(`display:none`/`display:block`) de los 14 archivos que las tenían (`mini-ensayo-review.component.ts`
ya estaba limpio, no tenía la regla local). El resto de propiedades que esas reglas locales traían
(background, blur, z-index) ya estaban 100% pisadas por el `!important` global de todos modos, así
que no se perdió nada al borrarlas.

**Gifs de capítulo, primera vuelta de recorte (superada por la parte 9, ver arriba): el `.webp` de
cada materia trae 15-35% de relleno transparente alrededor del pulpo, medido escaneando el canal
alfa con un `<canvas>` en el propio navegador.** Antes solo se agrandaba el contenedor
(`.splash-mascot-area`), lo que estiraba ese aire muerto junto con el personaje real y agrandaba la
tarjeta del capítulo sin necesidad. Se probó primero un recorte "cover" (ajustado al 100% del
recuadro real, cero margen) — funcionaba matemáticamente (verificado con `getBoundingClientRect`:
el contenido llena el recuadro de punta a punta) pero terminó viéndose demasiado grande/zoomeado
para el usuario, corregido en la parte 9 con el margen del 30%.

**Nombres de nodo superpuestos en filas de 3 (ej. "Modo Ráfaga: Historia/Ciencias/Cotidiano" en el
capítulo 1 de Competencia Lectora).** El `max-width` normal de `.node-title` (190px desktop /
150px ≤480px, fijado en una sesión anterior) asume que cada nodo tiene bastante espacio alrededor
— cierto en la mayoría de la ruta (nodos en fila de 1), falso en las filas de 3 nodos muy juntos
(`getBranchGap(3)` da un gap base de apenas 108px, escalado hasta 0.4x en móvil angosto: ~43px de
separación real). Con 190/150px de ancho posible por título, centrado sobre cada nodo, los 3
títulos se pisaban entre sí. Se agregó `[class.node-title-branch]="item.nodes!.length > 2"` al
`<div class="node-title">` y una regla `.node-title.node-title-branch` angosta (84px ≤900px, 72px
≤480px) con `-webkit-line-clamp: 2` (máximo 2 líneas, trunca con "…" si no alcanza) en los 6
`materia-*-path.component.ts`. Verificado en vivo: 0px de superposición, ~35px de aire entre
títulos vecinos (antes se pisaban visualmente).

**Puntitos de un nivel jefe con muchas preguntas (10-15) empujaban el botón "⚔️ Atacar" fuera de
pantalla.** `.dot-indicators` no tenía límite: un `<span class="dot">` por pregunta, sin
`overflow`/`flex-shrink`, así que con 15 preguntas simplemente crecía hasta empujar el botón del
`.bottom-bar` (que es `justify-content: space-between`) fuera del viewport. Se agregó un signal
computado `visibleDotIndices` (ventana de máximo 9 puntitos, centrada en la pregunta actual,
clampeada a los bordes del arreglo) en `seccion-test.component.ts` y `seccion-test-math.component.ts`
— el resto de las preguntas sigue navegable con Anterior/Continuar/tocar un puntito visible, solo
deja de tener un punto dedicado. Verificado con el jefe real de Competencia Lectora cap. 1
(`sec-1-23-boss`, 15 preguntas): 9 puntitos renderizados, botón "Atacar" completo dentro del
viewport de 375px.

**Guía de teclado "[O] Repetir" / "[P] Volver al capítulo" en la pantalla de resultados
(`seccion-test-review.component.ts`) aparecía también en móvil, donde un atajo de teclado no
significa nada** (y los botones a los que acompaña ya son tocables). Ocultada con `.btn-hint {
display: none }` dentro del `@media (max-width: 600px)` ya existente del archivo.

**Atajos de texto a voz sin equivalente táctil, convertidos a botones (primera vuelta — el ícono
play/stop y la eliminación del desplegable llegaron en la parte 9).** El panel de biología/física
durante la lección (`.a11y-mini-panel`, `seccion-test.component.ts`) y las guías de descripción de
biología/física (`seccion-biologia-detail.component.ts`, `seccion-fisica-detail.component.ts`)
mostraban únicamente texto tipo `[P] Leer Pregunta` — un recordatorio del atajo de teclado, sin
ningún `(click)` ni forma de tocarlo en el teléfono. Reutilizando los mismos métodos que ya usaba
el otro panel (con botones) de estas mismas pantallas (`readQuestion()`, `readOptions()`,
`readGuide()`, `readContext()`, `readTips()`, `stopReading()`), se cambiaron los `<span>` por
`<button>` con `(click)`. Los atajos `[1-4] Elegir A-D` / `[Espacio] Comprobar` se dejaron como
texto informativo en esta vuelta (ya tienen equivalente táctil en pantalla) — en la parte 9 se
terminaron quitando del todo.

### 2026-08-22 (parte 7) — Home: espacio vacío sobre las píldoras eliminado (bottom-align del hero
era la causa real, no solo el padding), hover de "Iniciar Sesión"/"Crear Cuenta" igualado al de
Precios/Comenzar Gratis; en todos los navbars móviles: animación del logo flotante corregida para
que sea simétrica respecto al centro (antes solo subía, nunca bajaba del reposo), botón hamburguesa
y equis de cerrar unificados al estilo del módulo Inicio (dashboard)
Typecheck ✅ (`tsc --noEmit`) tras cada tanda · verificado en navegador logueado con la cuenta real
(`angapicar@gmail.com`) en escritorio (1440px) y móvil (375px).

**"Elimina el espacio vacío entre el navbar y las píldoras, que queden simétricas con el borde de
la tarjeta animada de la derecha" — la causa real no era solo el `padding-top` del hero.**
`.hero-grid` tenía `align-items: end` (columnas alineadas al fondo): como la columna izquierda
(título+píldoras+CTAs) mide menos que la columna derecha (la tarjeta demo animada), quedaba
empujada hacia abajo por la diferencia de alturas — medido con `getBoundingClientRect`: 83.7px de
diferencia entre el top de las píldoras y el top de la tarjeta, un desplazamiento que **ningún**
ajuste de `padding-top` podía corregir por sí solo (mueve las dos columnas por igual, no cambia la
diferencia relativa entre ellas). Cambiado a `align-items: start` (ambas columnas arrancan a la
misma altura) + `padding-top` del hero reducido de `9rem` a `7.5rem`. Verificado:
`badgesTop === rightCardTop` exacto (antes 83.7px de diferencia), gap navbar→píldoras de ~19px
(antes ~139px). Efecto secundario aceptado a propósito: la tarjeta derecha ahora termina 84px más
abajo que la columna izquierda (antes terminaban parejas) — no se buscó compensar, es el
comportamiento esperado de quitar el bottom-align.

**Hover de "Iniciar Sesión"/"Crear Cuenta" del navbar, igualado a los botones que el usuario dijo
que le gustaban.** "Iniciar Sesión" (`.btn-ghost`) tenía un hover propio (tinte de fondo); se le
agregó el mismo mecanismo que ya usa "Precios" en `.nav-links a` — cambio de color + un subrayado
que crece desde el centro (`::after` con `width: 0 → calc(100% - 2rem)`), escopado a
`.nav-actions .btn-ghost` para no afectar el botón equivalente del menú móvil. "Crear Cuenta"
(`.navbar .btn-primary`) tenía un hover propio de "elevación + resplandor morado"
(`translateY(-2px)` + `box-shadow` difuso); se reemplazó por el mismo hover "presionado" que ya
trae el `.btn-primary` global (y por lo tanto "Comenzar Gratis", que no tiene ningún override
propio): fondo más oscuro, sombra que se achica de 4px a 2px, el botón baja 2px. Verificado
inspeccionando las reglas CSS compiladas en el navegador (no solo el código fuente): ambas
coinciden exactamente con sus referencias.

**Animación del logo flotante en el navbar móvil fijo, asimétrica respecto al centro real —
"se mueve de arriba hacia abajo pero no está centrado verticalmente".** La animación compartida
`floatLogo` (`0%,100% translateY(0)` → `50% translateY(-6px)`) solo sube desde el reposo y vuelve,
nunca baja — sobre un logo centrado con precisión mediante `.mobile-logo-link` (position:absolute,
top:50%), ese recorrido asimétrico hacía que el logo pasara más tiempo por encima del centro real
que exactamente en él, leyéndose como "no centrado". Se creó una keyframe nueva y separada,
`floatLogoNav` (`0%,100% translateY(-3px)` → `50% translateY(3px)`, mismo recorrido total de 6px
pero repartido a ambos lados del reposo), aplicada solo a `.mobile-logo-img` — **sin tocar**
`floatLogo` en sí, que sigue usando `.sidebar-logo-img` (el logo de escritorio) y no estaba roto.
Aplicado en los 15 archivos con `.mobile-header`. Verificado forzando el estado Premium/admin por
JS (la cuenta de prueba es Plan Básico, que no anima el logo a propósito — ver bitácora anterior):
con la animación en pausa en su fotograma de reposo, el centro vertical de la imagen coincide
exactamente (`diff: 0px`) con el centro de la fila de 60px del header.

**Botón hamburguesa y equis de cerrar del drawer, desincronizados entre módulos — unificados al
estilo de `dashboard.component.ts` ("módulo Inicio").** Existían dos variantes previas del botón
hamburguesa: 7 archivos (mente-veloz, nem-calculator, career-finder, recursos, mini-ensayo-setup,
mini-ensayo-review, ensayos-list) con una versión de menor contraste (`rgba(255,255,255,0.08)`,
sin tamaño fijo); los 7 de la familia Ruta con una versión **sin fondo ni borde en absoluto**
(`background:none; border:none`, sin `border-radius` ni `padding` — el botón "desaparecía"
visualmente, solo se veían las 3 rayitas flotando). Ninguna coincidía con el chip cuadrado de
38×38px con fondo/borde sutil que ya usaba dashboard. Igualados los 14 archivos al `.mobile-menu-btn`
exacto de dashboard (incluyendo el tamaño de las 3 rayitas internas: 18px/4px gap/2px alto en vez
de 22px/5px/2.5px) y se sacó el override de `min-width:44px` que la familia Ruta tenía para
compensar el botón invisible/pequeño anterior (ya no hace falta con el tamaño fijo de 38px). La
equis de cerrar del drawer tenía el mismo problema: 14 archivos con un simple `✕` de texto plano
sin fondo (`font-size:1.75rem`, sin `border`/`background`) contra el chip redondeado de
dashboard (34×34px, `rgba(255,255,255,0.1)`, `border-radius:10px`). Igualados los 14 al patrón de
dashboard. Verificado con `getBoundingClientRect`/`getComputedStyle` en 3 módulos de referencia
(dashboard, mente-veloz, un archivo de la familia Ruta): 38×38px y 34×34px exactos en los 3, mismo
`background-color`.

### 2026-08-22 (parte 6) — Contorno dorado + destellos morados en la píldora de descuento del home,
gifs de capítulo agrandados al doble en móvil (primera vuelta, sin recortar relleno transparente
todavía), y botón "Expandir" del simulador oculto en móvil (Matemática M1/M2 y Física)
Typecheck ✅ (`tsc --noEmit`) · verificado en navegador logueado con la cuenta real
(`angapicar@gmail.com`, plan Básico) en escritorio y a 375px.

**Píldora "41% OFF · Descuento en planes Premium" del home:** se le agregó un contorno dorado
estático (3px, mismo gradiente que `.btn-upgrade-pro`: `#FFE885→#E6A100→#B87E00`) y los destellos
de la animación que ya tenía (un `repeating-conic-gradient` rotando, de una sesión anterior) se
recolorearon de dorado a morado de marca (`#855cd6`/`#a78bfa` con núcleo blanco), para que combinen
con el resto de la paleta en vez de duplicar el dorado de la píldora PRO. El mecanismo de la
animación no cambió (sigue siendo solo `transform: rotate()` sobre un pseudo-elemento, compositor
puro, sin repintado por frame) — se verificó que sigue habiendo un único elemento animado en toda
la página, así que no hay carga de rendimiento nueva.

**Gifs de capítulo (el pulpo que acompaña cada capítulo en la Ruta de Aprendizaje) casi
invisibles en móvil:** se dobló el tamaño de `.splash-mascot-area` de 108px a 216px en el
breakpoint `max-width:480px`, en los 6 `materia-*-path.component.ts`. Esta primera vuelta **no
tocaba el relleno transparente** de cada `.webp` (eso vino recién en las partes 8/9) — simplemente
agrandaba el recuadro completo, imagen incluida, lo que en sesiones siguientes resultó ser la raíz
de "la tarjeta del capítulo se estira" (ver partes 8 y 9 para la solución real, con recorte
calculado desde el canal alfa de cada imagen).

**Botón "↗ Ampliar" del panel de simuladores interactivos (Matemática M1/M2 y Física) no servía
para nada en móvil:** el cajón de simuladores (`.sim-drawer`) ya mide el 100% del ancho en móvil
esté "ampliado" o no (`@media max-width:860px` fuerza `width:100vw` en ambos estados), así que el
botón que alterna entre 400px/800px de ancho no tiene ningún efecto visible ahí. Ocultado con
`.sim-expand-btn { display: none }` dentro de ese mismo `@media (max-width: 860px)`, en
`materia-math-path.component.ts` y `materia-fisica-path.component.ts`. El botón de cerrar (✕) del
cajón sigue funcionando igual.

### 2026-08-22 (parte 5) — El `.dashboard-header` seguía con `max-height` clamada al valor de
escritorio (título/descripción se desbordaban invisibles en Ensayos PAES y Mente Veloz), píldora
PRO móvil pasada a dorado+destello reutilizando `.btn-upgrade-pro`, y drawer lateral: logo alineado
al mismo margen que los ítems del menú, equis más a la izquierda, y padding simétrico
Typecheck ✅ (`tsc --noEmit`, tras corregir un error propio: comillas invertidas de Markdown dejadas
sin querer dentro de un comentario CSS en `learning-path.component.ts`, que cerraban el template
literal de `styles:[...]` antes de tiempo) · `ng serve` reconstruyó sin errores · verificado en
navegador logueado con la cuenta real (`angapicar@gmail.com`, plan Básico) a 375px en Ensayos PAES,
Mente Veloz y su drawer lateral.

**Root cause real de "Ensayo PAES y Mente Veloz siguen sin título/descripción" (la parte 2/3 solo
había resuelto que el header no quedara tapado por la barra fija, no que tuviera espacio propio
para crecer):** `.dashboard-header` tiene una regla GLOBAL en `styles.css`, sin ningún media query,
que fija `height`/`max-height: var(--header-height) !important` — una variable calculada por JS
pensada para compensar el zoom de escritorio (~110-124px). Ninguno de los overrides móviles de
sesiones anteriores tocaba `max-height` (solo `padding`/`min-height`/a veces `height:auto`), así que
ese techo seguía activo en Plan Básico — donde el título + una descripción de 2 líneas + el padding
extra de 116px (para no tapar la fila de la píldora PRO) necesitan bastante más de 110px. Con
`overflow:visible`, el contenido no se recortaba: se DESBORDABA por debajo del borde inferior del
header, cayendo encima de la tarjeta blanca de `.dashboard-body` — ahí el texto gris claro sobre
fondo blanco se volvía prácticamente invisible, dando la sensación de "no tiene título ni
descripción" cuando en realidad sí estaban en el DOM, solo ilegibles. Agregado `max-height: none
!important` (junto a `height: auto !important` donde faltaba) a la regla móvil de `.dashboard-header`
en los 15 archivos — en los 7 de la familia Ruta, que no tenían ninguna regla propia para
`.dashboard-header`, se agregó una nueva. Verificado en vivo: en Ensayos PAES el header pasó de
`height:124px` (clamado, contenido desbordado) a `height:212.8px` (real, todo el contenido cabe
dentro de la caja); en Mente Veloz a 112.7px — ambos casos con `max-height:none` confirmado por
`getComputedStyle`.

**Píldora "Mejorar a PRO" del navbar móvil (parte 3), dorada + destello como en escritorio:** en vez
de reinventar el gradiente morado que le había puesto, se le agregó la clase compartida
`btn-upgrade-pro` (la misma que ya usa este botón en el header de escritorio) junto a la propia
`mobile-pro-pill` — así hereda gratis, sin duplicar CSS, el gradiente dorado
(`#FFE885→#E6A100→#B87E00`), el pulso de brillo `goldGlowUpgrade` y el barrido de luz `::after`
(`shimmerUpgrade`) que ya existían GLOBALES en `styles.css` con `!important`. `.mobile-pro-pill`
quedó reducida a una sola línea (`width:190px; max-width:100%`) — lo único que `.btn-upgrade-pro` no
fija, para que el ancho siga igualando al del logo. Aplicado en los 15 archivos. Verificado con
`getComputedStyle`: `backgroundImage` resuelve al gradiente dorado, `animationName:goldGlowUpgrade`
y el `::after` con `animationName:shimmerUpgrade` — idéntico al botón de escritorio.

**Drawer lateral (menú deslizante): logo centrado ≠ alineado con los ítems del menú.** El pedido
anterior de "logo centrado" (parte 4) quedó reemplazado por uno más específico: alinear el logo al
MISMO margen izquierdo que usan los textos de "Inicio", "Ruta de Aprendizaje", etc. Medido primero
cuál es ese margen real (`.nav-item { padding: 0.9rem 1.1rem }`, o sea 17.6px desde el borde
izquierdo del drawer) en vez de adivinarlo. Cambiado `justify-content:center` → `flex-start` y el
padding-left del header de `1rem` a `1.1rem` (17.6px), para que el logo arranque exactamente donde
arranca el texto de los ítems — verificado con `getBoundingClientRect`: `logoLeft:17.59px` vs
`navItemPaddingLeft:17.6px`, prácticamente idéntico. La ✕ (que ya vivía en una esquina absoluta,
independiente del logo) se corrió más a la izquierda (`right: 0.75rem → 1.25rem`) para no quedar
pegada al borde. De paso, el padding vertical del header se emparejó: tenía `0.75rem` arriba y
`0.6rem` abajo (asimétrico); ahora los dos en `0.75rem` — confirmado `paddingTop === paddingBottom
=== 12px`. Aplicado en los 15 archivos (14 con el mismo patrón + la variante de `dashboard.component.ts`,
que usa `.mobile-close-btn` en vez del botón "✕" plano).

**Píldora de descuento del home: de "5 luces chicas, un ventilador" a "2 luces grandes, opuestas":**
el usuario aclaró que le gusta el mecanismo de la parte 4 pero quiere solo 2 destellos (no 5),
cada uno completando toda la vuelta, en lados opuestos de la píldora, y más grandes/vistosos.
Cambiado el período del `repeating-conic-gradient` de 72° (5 repeticiones) a 180° (2 repeticiones,
automáticamente opuestas entre sí en los 360°) y ensanchado el arco visible de ~26° a ~70° de cada
período de 180° (39%, contra el ~36% anterior, pero ahora concentrado en solo 2 luces en vez de 5,
así que cada una ocupa mucho más espacio visual real). Verificado con `getComputedStyle`: el
`repeating-conic-gradient` resuelve con los 9 stops correctos (0°/55°/72°/82°/90°/98°/108°/125°/180°).

### 2026-08-22 (parte 4) — Píldora del home reescrita sin mask-composite (se veía como un
ventilador girando), logo del navbar fijo desalineado con la hamburguesa en Plan Básico, y el
logo del drawer móvil descubierto como una imagen 500×500 con ~85% de relleno transparente
Typecheck ✅ (`tsc --noEmit`) · `ng serve` reconstruyó sin errores · verificado en navegador logueado
con la cuenta real (`angapicar@gmail.com`, plan Básico) a 375px en Dashboard y Mente Veloz.

**"La animación de la píldora parece un ventilador":** el enfoque de la parte 2/3 (repeating-conic-
gradient + `mask-composite: exclude`) dependía de que el navegador recortara el gradiente a un
anillo delgado sobre el borde. En el navegador real del usuario ese recorte no se aplicó — se vio el
CÍRCULO COMPLETO del conic-gradient girando (de ahí el aspecto de aspas de ventilador/pinwheel, que
es exactamente cómo luce un conic-gradient sin la máscara). `mask-composite` con la sintaxis
doble-mask + `-webkit-mask-composite:xor` es notoriamente poco fiable entre navegadores. Reescrito
sin ninguna máscara: `.hero-offer-badge` ahora es un contenedor exterior con `padding:2px` (el grosor
del anillo) y `overflow:hidden`; el `::before` (el conic-gradient rotando) ocupa esos 2px + todo el
área interior; y el contenido real se movió a un nuevo `.hero-offer-badge-inner` con fondo sólido
opaco, que — al vivir dentro del `padding:2px` del contenedor por simple flexbox, sin ninguna
posición absoluta — tapa todo excepto ese anillo de 2px alrededor, donde se ve pasar la luz. Cero
dependencia de `mask-composite`; solo `overflow:hidden` + un `z-index`, soportado en cualquier
navegador. Se pisó un bug de paso: la media query de `@media(max-width:640px)` traía el padding/
font-size del contenido pegados a `.hero-offer-badge` (el selector viejo, de un solo div) — al mover
el contenido a `.hero-offer-badge-inner` había que mover también esas reglas, si no el padding de
2px del anillo quedaba sobrescrito por el padding de contenido en móvil. Verificado con
`getBoundingClientRect`: anillo de exactamente 2px parejo en los 4 lados alrededor del contenido.

**Logo del navbar fijo más abajo que la hamburguesa/el avatar, solo en Plan Básico:** `.mobile-logo-
link` se centra con `position:absolute; top:50%` — pero relativo a `.mobile-header` completo, que en
Plan Básico mide 104px (60px + la fila de la píldora PRO de la parte 3) en vez de 60px. `top:50%` de
104px cae en el centro de TODO el header (más abajo que el centro de la fila de arriba, donde están
la hamburguesa y el avatar). Arreglado con un solo `position: relative;` en `.mobile-header-top` (la
fila de 60px) en los 15 archivos — así el logo absoluto se centra respecto a esa fila, no al header
completo. Para Premium/admin (header de una sola fila, sin la píldora) esto no cambia nada: la fila
ya medía 60px = todo el header, cero regresión ahí — confirmado con `getBoundingClientRect`
(hamburguesa, logo y avatar los 3 en `centerY:30` exacto). De paso, también se pidió que el logo NO
flote (la animación `floatLogo`) mientras esté la fila de la píldora — agregado
`.mobile-header.mobile-header-with-pro .mobile-logo-img { animation: none; }` en los 15 archivos;
Premium/admin conserva la animación tal cual estaba.

**El "espacio de arriba y abajo" del logo en el drawer lateral no era un tema de padding CSS — la
imagen del logo en sí mide 500×500px con la marca real ocupando solo una franja de 81px en el
centro.** Al pedir "reduce el espacio arriba/abajo del logo" se midió con un canvas (dibujando la
imagen y escaneando el canal alfa) el bounding-box real del contenido visible dentro del PNG:
`https://res.cloudinary.com/dqm3syhwr/.../LogoEstudiaUni` (500×500 natural) solo tiene píxeles
visibles entre `y:204` y `y:285` (81px de 500 = ~16% del alto real; el resto es relleno
transparente). Con `width:180px; height:auto` (que respeta el 1:1 del lienzo completo), el
`<img>` se renderiza como una caja de 180×180 — invisible en el navbar FIJO porque ahí el logo usa
`position:absolute` (la caja de más se sale de flujo sin que nadie lo note), pero en el DRAWER
(fila flex normal, sin position:absolute) esa caja de 180×180 estiraba el header entero a ~210px de
alto, la mayor parte aire muerto. Nunca se detectó antes porque visualmente "se veía bien" (el
contenido real ocupa poco espacio dentro de esa caja) — el bug era de LAYOUT, no de apariencia.
Corregido en el origen: se generó (y se verificó con el mismo método de canvas, confirmando cero
recorte del contenido real) un recorte de Cloudinary por URL —
`c_crop,x_1,y_204,w_489,h_81` para el logo normal y `c_crop,x_10,y_202,w_471,h_86` para
`LogoEstudiaUniPREMIUM` — aplicado SOLO al `<img>` del drawer lateral en los 15 archivos (no se
tocó el logo del navbar fijo ni el de otras páginas, que no estaban rotos). Con el recorte, el mismo
`width:180px;height:auto` ahora da ~180×30px — el tamaño real de una línea de logo. Verificado en
vivo en 2 módulos: el header del drawer bajó de ~210px a exactamente 60px, el logo quedó centrado
horizontalmente (`imgCenterX === drawerCenterX`) y la ✕ quedó a 13px del borde derecho del drawer y
9.6px del borde superior (antes vivía en la misma fila que el logo, empujándolo fuera del centro).
**Aplica a los 15 archivos.** Si en el futuro se sube un logo nuevo a esas dos URLs de Cloudinary,
hay que volver a medir el recorte (el método de canvas de esta sesión sirve para eso).

### 2026-08-22 (parte 3) — Navbar móvil de 2 filas con píldora "Mejorar a PRO" solo para Plan Básico
en los 15 módulos, título de Ensayos PAES/Mini Ensayo tapado detrás de la barra fija, y diagnóstico
de por qué la animación de la píldora del home nunca se ve
Typecheck ✅ (`tsc --noEmit`) · `ng serve` reconstruyó sin errores tras cada tanda de cambios ·
verificado en navegador logueado con la cuenta real (`angapicar@gmail.com`, plan Básico) a 375px en
Ruta de Aprendizaje, Ensayos PAES, Mini Ensayo, Mente Veloz y Dashboard, y a 1440px para confirmar
que el desktop no cambió. El estado PRO/admin (logo dorado + sin la fila extra) no se pudo probar
con una cuenta real premium — se simuló quitando la clase/fila por JS en vivo y se confirmó que el
header vuelve a 60px y `.main-content` a `padding-top:60px` exactamente como debe, pero **falta
reverificar con una cuenta PRO o admin real**.

**Pedido:** en el navbar móvil fijo, el botón "PRO ⚡" (que solo existía, apretujado, en el header de
`dashboard.component.ts`) quedaba visualmente roto junto al avatar. Se pidió: hacer el header más
alto hacia abajo, con una fila propia para una píldora "Mejorar a PRO" del mismo ancho que el logo
(190px), **solo para Plan Básico** — para PRO/admin esa fila debe desaparecer del todo (ya sin
tocar nada, porque el logo dorado ya estaba implementado).

**Diseño:** `.mobile-header` (fijo, `position:fixed`) pasó de una fila de 60px a `flex-direction:
column` con dos hijos:
- `.mobile-header-top` (60px, hamburguesa + logo centrado + avatar) — igual que antes.
- `.mobile-header-pro-row` — nuevo, con `*ngIf="!isProPlan() && !adminService.isAdmin()"`: al no
  ser PRO/admin, esta fila ni existe en el DOM, así que el header vuelve solo a 60px sin ningún CSS
  condicional extra. Dentro va `.mobile-pro-pill` (`width:190px`, exactamente el ancho de
  `.mobile-logo-img` en los 15 archivos — se confirmó por grep antes de hardcodear el valor),
  centrada con `(click)="paymentService.openPricingModal()"`.
- El `<div>` raíz de `.mobile-header` lleva `[class.mobile-header-with-pro]="!isProPlan() &&
  !adminService.isAdmin()"` — la MISMA condición que el `*ngIf`, pero como clase, para poder
  engancharle un selector CSS de hermano (`~`) que empuje el contenido de la página hacia abajo
  solo cuando la fila extra existe: `.mobile-header.mobile-header-with-pro ~ .main-content {
  padding-top: 104px !important; }` (104 = 60 del header base + 44 de la fila nueva), agregado en
  los mismos breakpoints donde cada archivo ya fijaba `padding-top: 60px`. Sin la clase (PRO/admin),
  ese selector no coincide con nada y `.main-content` se queda en sus 60px de siempre — cero código
  condicional adicional, solo la ausencia del elemento en el DOM.
- **3 archivos son la excepción** (`ensayos-list`, `mini-ensayo-setup`, `mini-ensayo-review`): ahí
  `.main-content` trae `padding: 0 !important` y el aire para no taparse se reserva directo en
  `.dashboard-header` (72px, ver el bug de abajo), así que el bump condicional apunta ahí en vez de
  a `.main-content`: `.mobile-header.mobile-header-with-pro ~ .main-content .dashboard-header {
  padding-top: 116px !important; }` (72 + 44).
Aplicado igual en los 15 archivos con `.mobile-header`: `dashboard`, los 7 de Ruta de Aprendizaje
(`learning-path` + 6 `materia-*-path`), `mente-veloz`, `career-finder`, `nem-calculator`,
`recursos`, `ensayos-list`, `mini-ensayo-setup`, `mini-ensayo-review`. Verificado con
`getBoundingClientRect`/`getComputedStyle` en 5 de ellos: header a 104.8px, píldora a 190px de
ancho centrada exactamente bajo el logo, `.main-content`/`.dashboard-header` con el padding-top
correcto y el título ya no tapado. A 1440px (desktop) el `.mobile-header` sigue en `display:none` y
el sidebar de escritorio intacto — sin regresión.

**Bug real encontrado de paso (no inventado por este cambio, pero se topó con él al mover el botón
PRO):** el "PRO ⚡" original de `dashboard.component.ts` vivía DENTRO de `.mobile-header` (fijo). Al
diseñar la fila nueva iguales para los 15 archivos, sirvió confirmar que los otros 14 nunca habían
tenido ningún botón PRO en su barra fija — coherente con que el pedido fuera "agrégalo a todos".

**Root cause real de "en Ensayo PAES y Mini Ensayo no sale el título ni la descripción completa"
(la parte 2 de hoy solo había resuelto que el título existiera en el DOM, no que se viera):**
en la parte 2 se cambió `.dashboard-header` de `display:none` a visible en
`ensayos-list.component.ts`, `mini-ensayo-setup.component.ts` y `mini-ensayo-review.component.ts`,
pero estos 3 archivos tienen `.main-content { padding: 0 !important }` en sus media queries — **sin
ningún `padding-top` que reserve los 60px de la barra fija** (a diferencia de los otros 12 archivos,
que sí lo hacen, ya sea vía su propio CSS o vía el fallback global de `styles.css`). Antes no
importaba porque `.dashboard-header` no ocupaba espacio (`display:none`); al hacerlo visible, quedó
renderizando en `y:0`, exactamente detrás de la barra fija (que tiene fondo opaco y
`z-index:101`) — el título quedaba 100% oculto tras esa barra y solo se alcanzaba a ver la mitad
inferior del subtítulo, asomando por debajo. Verificado con `getComputedStyle`: el texto SÍ estaba
ahí (`display:block`, `opacity:1`, `-webkit-text-fill-color:transparent` correcto para el degradado
morado) — no era un problema de CSS del texto en sí, sino de posición tapada. Corregido dándole a
`.dashboard-header` un `padding-top:72px` explícito (mismo valor que ya usaba `.dashboard-body` para
lo mismo) en los 3 archivos, y quitando el `padding-top:72px` que sobraba en `.dashboard-body` (si no,
quedaban 72+72=144px de aire, el doble de lo necesario, porque ahora es `.dashboard-header` quien
hace ese trabajo). Verificado en vivo: título a `y:72` (antes invisible), justo debajo de la barra
fija que termina en `y:60`.

**Diagnóstico de "sigo sin ver una animación en la píldora de descuento del home, van 3 intentos":**
revisado en vivo con `getComputedStyle`/`getAnimations()` — la animación está bien enganchada
(`animation-name: offer-glint-spin`, `animation-duration: 4s`, el `repeating-conic-gradient` se
resuelve con paradas de color válidas). El navegador de pruebas de esta sesión (igual que en las
anteriores, según bitácoras previas) tiene `prefers-reduced-motion: reduce` activo a nivel de SO, y
el CSS respeta esa preferencia a propósito (`@media (prefers-reduced-motion: reduce) {
.hero-offer-badge::before { animation: none; } }`) — forzando la animación vía `!important` en
consola sí la activa (`animationName`/`playState` pasan a `running`), así que el mecanismo en sí
funciona. **Hipótesis más probable, no confirmable desde aquí:** el sistema/navegador del usuario
también tiene alguna preferencia de "reducir movimiento" activada (Windows: Configuración >
Accesibilidad > Efectos visuales > "Efectos de animación", o una extensión del navegador) — de ser
así, **ninguna** de las 3 versiones de esta animación (estrellitas orbitando → destello único →
luces repetidas) se habría visto nunca, sin importar cuántas veces se rediseñe, porque el propio CSS
la apaga a propósito ahí. Pendiente que el usuario confirme si tiene esa preferencia activada en su
equipo; si prefiere que la animación se vea siempre (sin importar esa preferencia de accesibilidad),
hay que quitar deliberadamente ese `@media` guard — no se hizo sin su confirmación porque es una
elección de accesibilidad, no un bug.

### 2026-08-22 (parte 2) — Título/descripción ausentes en Ensayos PAES y Mini Ensayo, foto de perfil
duplicada y "cortada" bajo el título en Ruta de Aprendizaje, avatar superpuesto al logo en 3 navbars
móviles, y la luz de la píldora de descuento del home reescrita a "varias luces" reales
Typecheck ✅ (`tsc --noEmit`) · `ng serve` reconstruyó sin errores tras cada cambio · verificado en
navegador logueado con la cuenta real (`angapicar@gmail.com`) a 375px en Ruta de Aprendizaje, Ensayos
PAES y Mini Ensayo, y a 1440px para confirmar que el desktop no cambió. La animación de la píldora se
verificó de forma estructural (nombre/duración de la animación, gradiente con paradas válidas, y que
la regla `@media (prefers-reduced-motion: reduce)` la apaga correctamente) porque el navegador de
pruebas de esta sesión tiene `prefers-reduced-motion: reduce` activado a nivel de SO — igual que en
sesiones anteriores, eso impide grabarla en movimiento pero no es un bug.

**Root cause de "en Ruta de Aprendizaje sale una foto de perfil cortada debajo del texto":**
`.dashboard-header` (el header interno con "¡Hola/Título!" + descripción, dentro de `<main>`, DISTINTO
de la barra fija `.mobile-header`) también incluye `.welcome-actions` con el ícono de racha, el botón
PRO, el badge de plan y un segundo avatar de 56px (`.profile-menu-wrap`) — pensado para desktop. En
móvil, `styles.css` (regla global `@media max-width:1024px`, línea ~1476) solo cambia
`.dashboard-header` a columna; nunca oculta esos elementos duplicados. Y como la MISMA regla global
fija `min-height`/`max-height` a `var(--header-height)` con `!important` (puesto para el fix de zoom
de escritorio de una bitácora anterior) sin que el override móvil los toque, el header queda
literalmente atascado en una altura fija (110px) — así que cuando el segundo avatar no cabe ahí,
**se desborda visualmente hacia el contenido de abajo** en vez de expandir la caja, pareciendo "una
foto cortada debajo del texto". `dashboard.component.ts` ya resuelve esto correctamente desde antes
(oculta `app-streak-icon`, `.plan-badge`, `.btn-upgrade-pro` y `.profile-menu-wrap` dentro de
`.welcome-actions` en sus propios media queries) — el resto de módulos con este mismo patrón de
header nunca copiaron ese fix. Aplicado el mismo `display:none !important` sobre esos 4 selectores
(scopeado a `.dashboard-header .welcome-actions`, dentro de cada `@media(max-width:768px)` ya
existente) a los 7 archivos de la familia Ruta de Aprendizaje: `learning-path.component.ts` y los 6
`materia-*-path.component.ts` (biología, física, historia, math, química, y el genérico
`materia-path`) — se resincronizaron los 6 duplicados casi idénticos a la vez, como pide la sección 8
del documento maestro. Verificado en vivo en `/ruta`: `.profile-menu-wrap`/`.plan-badge` ahora
`display:none`, título y descripción intactos.

**Root cause de "en Ensayo PAES no sale el título/descripción, y en Mini Ensayo tampoco":**
`ensayos-list.component.ts`, `mini-ensayo-setup.component.ts` y `mini-ensayo-review.component.ts`
tomaron un atajo distinto y más agresivo para el mismo problema: directamente
`.dashboard-header { display: none !important; }` en móvil, con el comentario explícito "la barra
top ya lo reemplaza" — pero la barra fija (`.mobile-header`) nunca tuvo el título/descripción, solo
logo+avatar, así que ese "reemplazo" en realidad los eliminaba del todo. Corregido en los 3 archivos:
en vez de `display:none`, el header ahora queda visible en una fila en columna (título arriba, sin
altura mínima forzada) y solo se ocultan los 4 elementos duplicados de `.welcome-actions` (mismo
selector que en la familia Ruta). Verificado en vivo: "Ensayos PAES" / "Realiza ensayos completos..."
y "Mini Ensayos Personalizados" / "Practica a tu medida..." ya se ven en el navbar móvil de sus
páginas.

**Root cause de "la foto de perfil debe estar a la derecha" (se veía pegada a la hamburguesa, tapando
el logo):** estos mismos 3 archivos, más `mini-ensayo-review.component.ts`, tenían el botón de perfil
correctamente puesto en el HTML del `.mobile-header` (a diferencia del bug de la parte 1 de hoy, que
era foto ausente) pero a su regla `.mobile-header` le faltaba `justify-content: space-between` — sin
eso, como el logo se centra con `position:absolute` (no ocupa espacio en el flujo), la hamburguesa y
el botón de perfil (los dos únicos elementos en el flujo flex) quedaban pegados uno junto al otro en
el lado izquierdo por el `justify-content` por defecto, superpuestos visualmente al logo centrado en
vez de ir cada uno a un extremo. Agregado `justify-content: space-between` en
`ensayos-list.component.ts`, `mini-ensayo-setup.component.ts` y `mini-ensayo-review.component.ts`
(las 11 páginas restantes de las 15 con `.mobile-header` ya lo tenían). Verificado con
`getBoundingClientRect` en los 3: `logoCenterX === headerCenterX` (logo centrado) y el botón de
perfil ahora cae en el extremo derecho (ej. x:303-359 en un viewport de 375px), sin superponerse.

**Píldora de descuento del home ("Descuento en planes Premium · POR TIEMPO LIMITADO"):** el efecto de
la parte 4 de la bitácora del 21-08 (un único destello de ~65° de arco recorriendo el borde) se
sintió como "un brillo", no como "unas luces" — el usuario pidió explícitamente varias luces
recorriendo el contorno. Reescrito `.hero-offer-badge::before` en `home.component.ts`: de un
`conic-gradient` con una sola banda de luz a un `repeating-conic-gradient` con un período de 72°
(5 tramos de luz idénticos repartidos uniformemente en los 360°, cada uno con núcleo blanco
`#ffffff` y halo dorado `#fde68a`/`rgba(254,215,145,.85)` a los lados, sobre fondo transparente),
enmascarado igual que antes a un anillo delgado sobre el borde de la píldora y rotado en bucle
(`offer-glint-spin`, ahora 4s en vez de 5.5s, para que el recorrido de 5 luces no se sienta lento).
Mismo mecanismo de `prefers-reduced-motion:reduce` (se congela, no se quita) sin tocar. Aplica a
escritorio y a teléfono por igual porque es la misma regla sin scope de media query — confirmado que
en ambos tamaños el badge sigue siendo una sola línea (border-radius:999px real, no una franja
multilínea) para que el anillo de luces se vea como una píldora limpia y no un blob irregular.

### 2026-08-22 (parte 1) — Navbar móvil: foto de perfil faltante en 4 de los 15 módulos con sidebar
Typecheck ✅ (`tsc --noEmit`) · build de desarrollo ✅ (`ng serve`, un error de plantilla detectado y
corregido, ver abajo) · verificado en navegador logueado con la cuenta real (`angapicar@gmail.com`)
a 375px en los 4 módulos tocados, y a 1440px para confirmar que el desktop no cambió.

**El pedido:** comparar el navbar móvil superior de todos los módulos contra el de referencia
(Inicio/Dashboard: hamburguesa + logo centrado + foto de perfil a la derecha) y emparejar los que
estuvieran incompletos. `grep` de `class="mobile-header"` confirmó 15 archivos con este patrón; de
esos, 11 ya tenían los 3 elementos completos (`dashboard`, los 7 de `learning-path`/`materia-*-path`,
los 2 de `mini-ensayos`, `ensayos-list`). Los otros 4 —
`mente-veloz.component.ts`, `career-finder.component.ts`, `nem-calculator.component.ts` y
`recursos.component.ts` — tenían exactamente el bug de la captura del usuario: hamburguesa + logo,
pero en vez del botón de perfil había un `<div style="width:44px"></div>` de relleno (un espaciador
puesto ahí a propósito para simetría visual, pero sin el `<button class="profile-trigger">` real).
El nombre del módulo + su descripción (`.header-greeting` + `.subtitle` dentro de `.dashboard-header`,
en el `<main>`, no en el `.mobile-header` fijo) ya estaban presentes en los 4 — eso nunca fue el
problema, tal como aclaró el usuario con la captura de Mente Veloz.

**Fix:** en los 4 archivos, se reemplazó el `<div style="width:44px"></div>` por el mismo patrón de
botón de perfil que ya usan los 11 módulos correctos (copiado literal de
`materia-biologia-path.component.ts`): `<button class="profile-trigger" (click)="showProfileModal =
true">` con `profile-avatar-wrap` + `<img>` con el `photoURL` real de `firestoreService.profileSignal()`
y fallback a la inicial (`profileInitial()`) si no hay foto. También se agregó
`justify-content: space-between` a la regla `.mobile-header` de los 4 (los 11 módulos correctos ya
la tenían) — sin eso, el nuevo botón habría quedado pegado a la hamburguesa en vez de irse a la
derecha, ya que el logo usa `position: absolute` para centrarse y no reserva espacio en el flujo flex.

**Bug propio, encontrado por el build (no por typecheck) y corregido en la misma sesión:** al copiar
el `(click)` de `career-finder.component.ts` se pegó por error la variante de `nem-calculator`
(`showProfileModal = true; profileScrollTarget = ''`) — `career-finder` no tiene ningún campo
`profileScrollTarget` (ese solo existe en `nem-calculator`, para hacer scroll a una sección concreta
del modal de perfil). `tsc --noEmit` no lo detectó porque es un error de *type-checking de plantillas*
Angular, no de TypeScript puro; lo agarró el compilador AOT de `ng serve` (`NG9: Property
'profileScrollTarget' does not exist on type 'CareerFinderComponent'`). Corregido a
`(click)="showProfileModal = true"` simple, igual que en `nem-calculator`/`recursos`/`mente-veloz`.

Verificado en vivo en los 4 módulos (medido con `getBoundingClientRect` en consola, no solo
visualmente): a 375px, `logoCenterX === headerCenterX` en los 4 (logo centrado en todo el navbar,
no solo en el hueco entre botones — mismo criterio ya usado en la parte 6 de la bitácora anterior),
el botón de perfil aparece a la derecha con la foto real del usuario (`avatar_3.png`), y al hacer
clic abre `<app-profile-modal>` correctamente. A 1440px el `.mobile-header` vuelve a `display: none`
y el sidebar de escritorio (`display: flex`) queda intacto — cero regresión ahí.

### 2026-08-21 (parte 6) — Logo del navbar móvil más grande y centrado de verdad en los 15 módulos, reconstrucción del header de Ruta de Aprendizaje (le faltaba el avatar y el cierre), y el hueco vacío bajo el saludo del dashboard
Typecheck ✅ (`tsc --noEmit`) · verificado en navegador logueado con la cuenta real
(`angapicar@gmail.com`) a 375px en dashboard y en Ruta de Aprendizaje, y a 1920px/1100px para
confirmar que el sidebar de escritorio y el fix de zoom de la parte 4 seguían intactos.

**Logo del header móvil: de "centrado dentro del hueco que sobra entre los botones" a
"centrado de verdad en todo el navbar", y más grande, en los 15 módulos.**
El link del logo usaba `flex:1; display:flex; justify-content:center` — eso solo centra el logo
dentro del espacio que queda ENTRE el botón de hamburguesa y lo que haya a la derecha (avatar,
badge PRO, etc.), así que en cualquier módulo donde esos dos lados no pesan lo mismo (ej.
dashboard, con botón PRO + badge + avatar a la derecha vs. solo la hamburguesa a la izquierda) el
logo terminaba visualmente corrido hacia la izquierda del centro real del navbar. Cambiado a
`position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);` sobre el propio
`.mobile-header` (que ya es `position: fixed`, así que no hizo falta tocar nada más) — así el logo
queda centrado respecto a TODO el ancho del navbar sin importar cuánto pese cada lado. De paso se
subió de 160px a 190px en el header y de 150px a 180px en el drawer (el usuario pidió "más grande").
Verificado en vivo en dashboard: `logoCenterX === headerCenterX` exacto (antes estaba corrido).
Este cambio de tamaño/centrado se aplicó a los 15 archivos con `.mobile-header` sin excepción,
incluidos `mini-ensayos/mini-ensayo-setup.component.ts` y `mini-ensayo-review.component.ts` — los
2 que en la parte 5 quedaron marcados como "ya usaban el logo real" (no necesitaban el cambio de
texto→imagen) pero que igual usaban el `flex:1` viejo para centrar, así que también se les tocó
el link del logo y el tamaño ahí. Con los 6 de la parte 5 + los 7 de esta parte (más abajo) + estos
2, quedan los 15 contados.

**Ruta de Aprendizaje (7 archivos): el navbar móvil no tenía ni el logo bien puesto, ni el avatar de
perfil, ni cierre en el drawer — le faltaban piezas enteras, no era solo un tema de tamaño.**
Al comparar contra el diseño de referencia (Mini Ensayos) aparecieron dos problemas reales, no solo
estéticos, en `learning-path.component.ts` y los 6 componentes `materia-*-path.component.ts`
(`materia-path`, `materia-quimica-path`, `materia-math-path`, `materia-historia-path`,
`materia-fisica-path`, `materia-biologia-path` — duplicados casi idénticos entre sí, ver sección 8
del documento maestro):
- El header móvil solo tenía el botón de hamburguesa (una "☰" suelta, no el ícono de 3 líneas que
  usa el resto de la app) y el logo — **sin ningún botón de perfil a la derecha**, y sin
  `justify-content: space-between` en el contenedor. Se agregó el botón de perfil (mismo patrón
  `firestoreService.profileSignal()?.photoURL` / `profileInitial()` que ya usaba el sidebar de
  escritorio de estos mismos archivos, así que no hizo falta agregar nada al `.ts`) y el
  `justify-content: space-between`.
- El drawer (`.mobile-menu`) **no tenía ninguna fila de encabezado**: iba directo al `<nav>`, sin
  logo ni botón de cierre — igual que el problema que ya se había encontrado y arreglado en
  `recursos`/`mente-veloz`/`career-finder`/`nem-calculator` en la parte 5. Se agregó la misma fila
  (logo de 180px + botón ✕ arriba a la derecha) a los 7 archivos.
Verificado en vivo en `/ruta`: antes no había avatar en el header ni forma de cerrar el drawer salvo
tocar el fondo; ahora el header tiene hamburguesa + logo grande centrado + avatar, y el drawer abre
con logo + ✕ arriba a la derecha, igual que Mini Ensayos.

**Dashboard: el hueco vacío entre "¡Hola, X!" y la tarjeta blanca de abajo, en teléfono.**
Root cause: en la parte 4 de esta bitácora se había cambiado `.dashboard-header` de `height: 110px`
a `min-height: 110px` (para el fix de zoom de escritorio, que sigue intacto y sin tocar). Ese
`min-height` vive en la regla BASE del componente, y los `@media (max-width: 768px/1024px)` que
achican el header para teléfono solo pisaban `height: auto`, nunca `min-height` — así que el mínimo
de 110px seguía obligando al header a medir por lo menos eso incluso en un teléfono, donde el
saludo real ocupa mucho menos, dejando un espacio muerto abajo. Se agregó `min-height: 0 !important`
a esos dos breakpoints móviles (sin tocar la regla base de escritorio). Verificado en vivo: el alto
del header pasó de 110px a 47.9px (el alto real de su contenido) a 375px de ancho, y a 1100px de
ancho (rango de zoom de escritorio de la parte 4) el `min-height` calculado siguió siendo el mismo
de antes — cero regresión ahí.

**Confirmado, sin necesidad de cambios: la lógica de logo dorado (PRO/admin) vs. logo normal
(Básico) ya era correcta en los 15 archivos.** Los 6 módulos arreglados en la parte 5 y los 7
reconstruidos en esta parte usan exactamente el mismo `[src]="(isProPlan() || adminService.isAdmin())
? '.../LogoEstudiaUniPREMIUM' : '.../LogoEstudiaUni'"` que ya traían los módulos de referencia — se
copió literal, no se inventó una lógica nueva. Verificado con la cuenta de prueba (plan Básico): en
todos los módulos probados el logo resuelto fue siempre la variante normal (`LogoEstudiaUni`, sin
"PREMIUM"), nunca la dorada — consistente con no ser ni PRO ni admin.

### 2026-08-21 (parte 5) — Logo real en el header/drawer móvil de 6 módulos, animación de apertura/cierre del drawer a nivel global, y banner cortado en Encuentra tu Carrera
Typecheck ✅ (`tsc --noEmit`) · verificado en navegador logueado con la cuenta real
(`angapicar@gmail.com`), a 375px, en los 8 módulos con sidebar/mobile-header (dashboard, ensayos,
recursos, calculadora NEM, mente veloz, encuentra tu carrera) y a 1920px para confirmar que el
desktop no cambió.

**Logo de texto en vez del logo real, en 6 de los 15 módulos que tienen sidebar propio.**
`grep` de `class="mobile-logo-img"` (el patrón correcto, con la animación `floatLogo` de subir y
bajar) contra los 15 archivos que tienen `.mobile-header` mostró que 9 ya lo usaban bien
(`materia-*-path`, `learning-path`, `mini-ensayos/*`) y 6 no: `dashboard`, `ensayos-list`,
`recursos`, `nem-calculator`, `mente-veloz`, `career-finder` — todos mostraban un `<span
class="text-gradient">EstudiaUni</span>` de texto en vez de la imagen real, tanto en el header móvil
de arriba como en el drawer lateral. Se reemplazó por el mismo `<img [src]="(isProPlan() ||
adminService.isAdmin()) ? '.../LogoEstudiaUniPREMIUM' : '.../LogoEstudiaUni'" class="mobile-logo-img">`
que ya usa el sidebar de escritorio en todos ellos (variante Pro/Básico según plan), en los dos
sitios. La clase `.mobile-logo-img` y el `@keyframes floatLogo` ya existían en los 6 archivos (se
verificó antes de tocar nada) — el bug era solo de template, nunca de CSS faltante.
Al revisar el drawer de cada uno aparecieron en realidad **dos patrones distintos**: `dashboard` y
`ensayos-list` ya traían una fila de encabezado propia dentro de `.mobile-menu` (logo + botón ✕
arriba a la derecha, con `justify-content: space-between`) — solo hacía falta cambiar el texto por
la imagen. `recursos`, `nem-calculator`, `mente-veloz` y `career-finder` en cambio **no tenían
ninguna fila de encabezado en el drawer**: el `<nav class="sidebar-nav">` con los links empezaba de
inmediato y el único modo de cerrar era tocar el fondo oscuro. Se les agregó la misma fila de
encabezado (logo de 150px + botón ✕ arriba a la derecha) que ya tenían los otros dos, para que las
6 quedaran idénticas entre sí y con un cierre explícito además del backdrop.

**La animación de apertura/cierre del drawer no se podía arreglar por componente — vivía en un
bloque global con `!important` que ya ganaba sobre cualquier CSS local.**
Antes de tocar el CSS de cada componente se encontró que `styles.css` (línea ~372, dentro de un
bloque llamado "CRITICAL... Ensures EstudiaUni scales flawlessly") define `.mobile-overlay` y
`.mobile-overlay .mobile-menu` de forma **global y sin scope de componente**, con `!important` en
casi todas las propiedades — incluida `display: none/block !important` para el overlay. Cualquier
`.mobile-overlay { ... }` puesto dentro de los estilos de un componente Angular solo gana esa pelea
si también usa `!important` (algunos lo hacían, otros no — inconsistente y en la práctica sin
efecto real en ninguno de los dos casos, porque `display` no es una propiedad animable: pasar de
`none` a `block` no tiene punto intermedio que transicionar). Por eso mismo cualquier intento de
agregar una transición **dentro de un componente** habría sido inútil sin tocar antes este bloque
global. La solución fue cambiar, solo en `styles.css`, el toggle de `display:none/block` por
`opacity`/`visibility` (que sí se pueden transicionar) con `transition: opacity .28s ease, visibility
.28s ease`, dejando intacto el `transition: left .3s` que `.mobile-menu` ya tenía (ese sí funcionaba
para la apertura, pero nunca se alcanzaba a ver en el cierre porque el overlay desaparecía de golpe
con `display:none` antes de que la transición de `left` pudiera jugar). Con este cambio, un solo
edit en `styles.css` arregla la animación de entrada **y** salida en los 15 módulos a la vez, sin
tocar ninguno de los 15 archivos individualmente. Respeta `prefers-reduced-motion: reduce`.
Verificado en vivo: al abrir el drawer, `overlay.classList.contains('open')` pasa a `opacity:1;
visibility:visible` (antes solo alternaba `display`); al cerrar, ambos vuelven a su estado oculto.
El navegador de pruebas tenía `prefers-reduced-motion: reduce` a nivel de SO (igual que en sesiones
anteriores), así que ahí la transición queda en `none` — comportamiento correcto, no un bug; se
confirmó el valor real (`opacity 0.28s, visibility 0.28s`) forzando la media query a un lado para la
prueba.

**Encuentra tu Carrera: el botón "Abrir 🐙" / "Mejorar a PRO" del banner de Foco se cortaba en
móvil.** `.ai-promo-banner` era una fila flex sin `flex-wrap`, con un ícono circular de 60px fijo +
un título en `white-space: nowrap` + el botón, todo peleando por el mismo ancho — en un teléfono no
alcanzaba el espacio y el botón terminaba recortado contra el borde de la pantalla. Se agregó, solo
dentro del `@media (max-width: 768px)` ya existente, `flex-wrap: wrap` al banner y
`flex: 1 1 100%` a `.ai-promo-content`, para que el ícono+texto ocupen su propia fila completa y el
botón caiga a una fila propia debajo, a `width: 100%`. Verificado en vivo a 375px: el botón
("🔒 Mejorar a PRO" para este plan Básico) ahora mide 309px de ancho dentro del viewport de 375px,
sin desbordar en absoluto (antes se salía del borde derecho).

### 2026-08-21 (parte 4) — Rediseño del destello de la oferta, atajos de teclado ocultos en móvil, y navegador/imagen del ensayo en móvil
Typecheck ✅ (`tsc --noEmit`) · verificado en navegador logueado con la cuenta real
(`angapicar@gmail.com`) contra Firestore real, incluyendo un ensayo asistido real de principio a fin.

**Rediseño del efecto de la parte 3: de "2 estrellitas orbitando" a "un destello deslizándose por
el contorno de la píldora".** El feedback fue directo: no quería un dibujo de estrella dando vueltas
en un círculo pequeño junto al badge, sino un brillo/destello real recorriendo el borde de la
píldora en sentido horario, sutil, sin saturar. Se sacó por completo el markup anterior (2 `<span>`
con SVG de estrella de 4 puntas + sus `@keyframes` de órbita) y se reemplazó por la técnica estándar
de "anillo de degradado animado" hecha 100% en CSS, sin ningún elemento nuevo en el template:
un `::before` en `.hero-offer-badge` con `conic-gradient` (transparente en casi todo el círculo,
con un arco angosto y brillante ~295°-360°) recortado a un anillo de 2px mediante
`mask`/`-webkit-mask` + `mask-composite: exclude` (dos capas: `content-box` vs. el cuadro completo,
la diferencia entre ambas es exactamente el grosor del `padding` del pseudo-elemento), rotado con
`transform: rotate(360deg)` vía `@keyframes` a 5.5s por vuelta — lento y discreto a propósito.
`rotate()` con ángulos positivos gira en sentido horario de forma nativa, así que no hizo falta
ningún truco adicional para la dirección. Respeta `prefers-reduced-motion: reduce` (se congela en
vez de seguir girando). Verificado en el navegador de pruebas (que tenía `prefers-reduced-motion:
reduce` activado a nivel de SO, por lo que ahí la animación se ve congelada — comportamiento
correcto) que el `conic-gradient`, el `mask-composite` y el `@keyframes` están bien formados y
escalados correctamente por Angular.

**Configuración: la sección "Atajos de Teclado (Navegabilidad)" ya no aparece en móvil.**
No tiene sentido en una pantalla táctil sin teclado físico. Se le agregó la clase
`keyboard-shortcuts-section` a ese `.section-block` en `settings-modal.component.ts` y se ocultó
(`display:none`) dentro del `@media(max-width:720px)` que el propio componente ya traía (mismo
breakpoint que usa el resto del modal). Verificado en vivo abriendo el modal real a 375px (oculta) y
a 1920px (visible).

**Ensayo (modo teléfono): el navegador de preguntas se cierra solo al elegir una pregunta, y la
tarjeta de la pregunta se agranda un poco para que la imagen se vea mejor.**
En `ensayo-runner.component.ts`:
- `goToQuestion(index)` ahora cierra el navegador automáticamente cuando `window.innerWidth <= 900`
  (mismo umbral "móvil" que ya usaba el resto del componente para el overlay de pantalla completa
  del navegador y del chat de Foco) — antes había que cerrarlo a mano con la `✕` después de saltar a
  la pregunta elegida. En desktop (`> 900px`, donde el navegador es un panel fijo, no un overlay) el
  comportamiento no cambia: se probó explícitamente que ahí sigue abierto tras elegir una pregunta.
- Casi todas las preguntas del banco son imágenes escaneadas completas (el "enunciado" de texto es
  solo un placeholder, no se renderiza ningún texto real de pregunta en este componente — se
  verificó que no existe ninguna referencia a un campo de texto de la pregunta en el template), así
  que agrandar "la ventana de la pregunta" beneficia directamente a la imagen. Se redujo un poco el
  padding en el `@media (max-width: 900px)`: `.exam-body` de `0.75rem` a `0.5rem` y `.question-card`
  de `1rem` a `0.75rem`, más un pequeño "sangrado" extra específico de `.question-stem`
  (`margin: 0 -0.5rem`) para que la imagen gane aún más ancho que el resto de la tarjeta. Medido en
  vivo a 375px de ancho: la imagen pasó de ~319px a 347px (~9% más grande), sin overflow horizontal
  en ningún caso — un cambio modesto ("un poco más grande"), no un rediseño a todo lo ancho.

### 2026-08-21 (parte 3) — Sparkles en la oferta del home, iconos SVG en la Guía Rápida, y auditoría de Mini Ensayo / Mente Veloz contra el pool de preguntas
Typecheck ✅ (`tsc --noEmit`) · verificado en navegador **logueado con una cuenta real**
(`angapicar@gmail.com`, provista por el usuario para esta sesión) contra Firestore real, no mocks.

**Home: 2 brillitos naranjas orbitando el badge "Descuento en planes Premium · POR TIEMPO LIMITADO".**
Dos SVG de destello (sparkle de 4 puntas, no emoji — coherente con la convención del proyecto),
anclados arriba y abajo del centro del badge (`.offer-sparkle-anchor-top/bottom`), cada uno con su
propia animación `@keyframes` en órbita circular (técnica estándar rotate→translate→counter-rotate
para que el ícono no gire sobre sí mismo mientras da la vuelta) con `animation-delay` opuesto entre
ambos para que no giren en fase. Respeta `prefers-reduced-motion: reduce` (se congelan, no
desaparecen). Verificado en vivo: al forzar los sparkles a ángulos fijos distintos (0° y 90°) se
confirmó que cambian de posición según el ángulo, es decir que el mecanismo de órbita funciona;
el navegador de pruebas tenía `prefers-reduced-motion: reduce` activado a nivel de SO, por lo que
la animación en sí no se pudo grabar en movimiento ahí (comportamiento correcto, no un bug).

**Dashboard: los 8 emojis de la "Guía Rápida" (botón flotante + modal) reemplazados por SVG.**
Mismo motivo que los íconos de contraseña de la parte 2 — convención ya establecida de no usar
emojis nuevos en la UI. `.help-card-icon` ya tenía `color: var(--accent-primary)` puesto de antes
(pensado para un ícono con `currentColor`, no para el emoji que había), así que los 8 quedan de un
morado consistente en vez de los colores dispares que cada emoji traía de la fuente del sistema.
Verificado en vivo abriendo el modal real: 0 emojis restantes, 8 `<svg>` renderizados.

**Auditoría de Mini Ensayo / Mente Veloz contra `pool_preguntas`: ambos ya funcionan como se pidió,
no se encontró bug ni se tocó código.** El pedido original describía un problema que, tras probarlo
en vivo, resultó ser una confusión entre dos capturas de pantalla — vale la pena dejarlo anotado por
si vuelve a surgir la duda:
- La captura de "temas" (Cinemática Básica, Fenómenos Ondulatorios, etc. con "X pregs" cada uno) es
  la pantalla real de **Mini Ensayo** (`mini-ensayo-setup.component.ts`) para Física — no es Mente
  Veloz. Verificado en código (`MiniEnsayoService.generateSession()`) y en vivo: filtra
  `pool_preguntas` por `materiaId` **y** por el/los `tema` marcados. Prueba end-to-end real: se
  seleccionó únicamente el tema "Práctica: Ondas y Sonido" (marcado con "2 pregs" en la UI) y se
  inspeccionó la sesión generada en `localStorage` — dio exactamente 2 preguntas, ambas
  `materiaId: ciencias-fisica` y ambas `tema: "🎯 Práctica: Ondas y Sonido"`, cero fugas de otros
  temas o materias.
- La captura del pulpo con "Ondas · Mecánica · Tierra · Electricidad" y "4 Capítulos · 64 Lecciones"
  **no es de ningún minijuego** — es la tarjeta de la materia Física en el índice de la **Ruta de
  Aprendizaje** (`learning-path.component.ts`), que muestra cuántos capítulos/lecciones tiene esa
  materia en el contenido de la ruta (algo completamente aparte del pool de preguntas del panel
  admin). De ahí la confusión de que "Mente Veloz agarra todos los niveles de física": esa pantalla
  nunca fue Mente Veloz.
- **Mente Veloz** (`mente-veloz.component.ts`) no tiene ningún concepto de capítulo/tema en su
  código (se verificó que no hay ninguna referencia a "capitulo"/"tema" en el archivo): solo deja
  elegir materias (`isMateriaSelected`) y arma el mazo con `poolPreguntas().filter(q =>
  isMateriaSelected(q.materiaId))`, sin restringir por tema — exactamente lo que el usuario aclaró
  que debía pasar ("no necesita filtrar por tema... agarra preguntas de todo tipo o capítulo pero de
  las materias seleccionadas"). Verificado en vivo con la cuenta de prueba (plan Básico): con
  Competencia Lectora + Matemática M1 marcadas, la UI mostró "22 preguntas disponibles en 2
  materias"; se confirmó contra la caché real de `pool_preguntas` en `localStorage` que
  `competencia-lectora` tiene 20 preguntas repartidas en 3 temas distintos y `matematicas-m1` tiene 2
  en 2 temas — 22 en total, cero filtrado por tema.
- Dato de contexto encontrado de paso: el pool de física ya tiene 93 preguntas repartidas en 59
  `tema` distintos — con nombres de tema bastante finos/parecidos entre sí (ver la lista larga y algo
  repetitiva que se ve en el selector de Mini Ensayo). Es contenido cargado por el admin, no un bug
  de agrupación del código — si se quiere una lista de temas más prolija habría que limpiar/agrupar
  los valores de `tema` desde el panel admin, no cambiar la lógica de filtrado.

### 2026-08-21 (parte 2) — Iconos de contraseña a SVG, link roto en footer "Recursos" y deformación del dashboard con zoom del navegador
Typecheck ✅ (`tsc --noEmit`) · verificado con dev server real: login/register en navegador, links de
footer contra las URLs reales de DEMRE/beneficios estudiantiles, y el CSS del dashboard con una
réplica aislada (ver detalle abajo, no se pudo probar `/dashboard` en vivo porque exige una cuenta
autenticada y no había credenciales a mano).

**Emojis 👁️/🙈 del toggle de contraseña reemplazados por SVG.**
Afectaba a `/login` y a los dos campos de `/register` (contraseña y confirmar contraseña) — mismo
patrón en los tres. Coherente con la convención ya establecida en el proyecto (sección 8: "Nada de
emojis nuevos en la UI", commit `080f8f8a`) que este toggle se había quedado sin migrar. Nuevo
componente reutilizable `shared/components/password-visibility-icon.component.ts`
(`<app-password-visibility-icon [passwordVisible]="showPassword">`) con los iconos estándar
"eye" / "eye-off" (trazo `currentColor`, hereda el color del botón). Se agregó también
`[attr.aria-label]` dinámico ("Mostrar contraseña" / "Ocultar contraseña") a los 3 botones, que antes
no tenían accesibilidad para lectores de pantalla.

**Link roto en el footer, sección "Recursos": `https://demre.cl/universidades/` → 404 real.**
Se verificaron los 4 links de esa columna contra las URLs reales (no solo se asumió que estaban
bien): Portal Oficial DEMRE, Temarios Oficiales y Beneficios Estudiantiles funcionan y llevan a
contenido correcto. "Guía de Universidades" apuntaba a una URL que DEMRE ya no sirve (404 confirmado
en el sitio real). Corregido a
`https://demre.cl/paes/universidades-participantes/universidades-sistema-acceso` — la página real de
DEMRE con el listado de universidades del Sistema de Acceso y sus sitios/perfiles, que es lo que el
texto del link promete.

**Dashboard deformado a 125%–150% de zoom del navegador (no en 100% ni en móvil real).**
Root cause: el zoom del navegador reduce el ancho de viewport efectivo en píxeles CSS (a diferencia
de la propiedad CSS `zoom`, que solo escala visualmente sin achicar `window.innerWidth` — se
comprobó la diferencia en vivo antes de diagnosticar). En un monitor típico (1366–1920px de ancho
físico), 125–150% de zoom cae en un rango de ~900–1550px de ancho efectivo que queda **arriba** del
breakpoint móvil del dashboard (`@media max-width: 1024px`, donde el sidebar se oculta y aparece el
header móvil) pero muy por debajo de los ~1600–1920px para los que el header y los widgets del
dashboard estaban diseñados. En ese rango intermedio no hay ningún ajuste: `.dashboard-header` tenía
`height: 110px` fijo (no `min-height`), `.header-greeting` un `font-size: 2.4rem` fijo, y
`.welcome-widgets-row .kpis-row-sidebar-top` tenía `width: 420px` con **`flex-shrink: 0` forzado**
(se prohibía expresamente que se achicara) dentro de una fila sin `flex-wrap`. Resultado verificado
con una réplica aislada del HTML/CSS real (antes/después, sin poder loguearse a `/dashboard`): a
1000px de ancho efectivo, la versión original desbordaba el viewport en ~55–95px
(`.welcome-actions` y `.kpis-row-sidebar-top` saliéndose de la pantalla) — eso es la "ventana
deformada" que se ve con el navegador con zoom.
Arreglado en `dashboard.component.ts` (solo agregando propiedades, sin tocar ninguna regla dentro de
los `@media` de 1024px/768px que ya estaban verificados y funcionando):
- `.dashboard-header`: `height` → `min-height: 110px` + `flex-wrap: wrap` (si no entra en una fila,
  pasa a dos en vez de desbordar).
- `.header-greeting`: `font-size: 2.4rem` fijo → `clamp(1.6rem, 1.5vw + 0.6rem, 2.4rem)` — se
  calculó para que en pantallas anchas (≥1920px efectivos) el resultado sea matemáticamente
  idéntico a 2.4rem (verificado: sigue dando 38.4px a 1920px de ancho) y solo empiece a achicarse
  cuando el espacio realmente escasea.
- `.welcome-widgets-row`: se agregó `flex-wrap: wrap`; `.kpis-row-sidebar-top` pasó de
  `flex-shrink: 0; width: 420px` a `width: 420px; max-width: 100%` (ya no se prohíbe achicarse).
- `.countdown-row` y `.kpi-card`: `height` fijo → `min-height` (mismo espíritu, evita que el texto
  se recorte si alguna vez necesita más de una línea).
Verificado con la réplica aislada: a 1920px de ancho, antes y después dan exactamente los mismos
110px de alto y 38.4px de fuente (cero regresión visual en desktop normal); a 1000px de ancho, la
versión corregida ya no desborda ningún elemento fuera del viewport y la fila del saludo se apila
correctamente arriba de los botones/badge en vez de superponerse. Como estos cambios son puramente
aditivos (agregan `flex-wrap`/`max-width`/`min-height`, que solo actúan cuando el contenido
realmente no entra) y no tocan ninguna regla existente dentro de los `@media` de 1024px/768px, el
comportamiento móvil ya verificado en bitácoras anteriores queda intacto.
**Pendiente:** no se pudo verificar este fix contra el `/dashboard` real (requiere sesión
autenticada); si se agrega en el futuro un harness de desarrollo tipo `/dev/ruta` para vistas
protegidas por `authGuard`, convendría reverificar ahí. Tampoco se revisaron `.metrics-section` /
`.activity-section` / `.kpis-row` (grids de `fr` más abajo en la página) más allá de blindar
`.kpi-card` con `min-height` — los grids en sí no deberían desbordar (las columnas `fr` se achican
proporcionalmente), pero no se descarta que algún contenido interno se vea apretado en ese mismo
rango de zoom.

### 2026-08-21 — Home: video "Mira cómo funciona" no auto-reproducía + consentimiento legal ausente en registro
Typecheck ✅ (`tsc --noEmit`) · verificado en navegador contra dev server real (no mocks).

**Bug: el video de la sección "Mira cómo funciona" no entraba en bucle automático al hacer scroll,
solo si el usuario cambiaba de pestaña (2 o 3) y volvía a la 1.**
Root cause encontrado inspeccionando el `<video>` en vivo: aunque el template tenía el atributo
plano `muted` (sin binding), la propiedad JS viva `video.muted` valía `false` en runtime. Angular
crea el elemento vía `createElement`/`setAttribute` (no parseando HTML crudo), y ese camino no
inicializa la propiedad IDL `.muted` a partir del atributo de contenido — solo el parser HTML nativo
del navegador hace esa inicialización. Con `.muted === false`, la política de autoplay de Chrome
rechaza en silencio el `video.play()` que dispara el `IntersectionObserver` al entrar en viewport
(la promesa rechazada caía en un `.catch(() => {})` mudo); en cambio, el `play()` de
`selectDemoTab()` sí funcionaba porque corría inmediatamente después de un click real (gesto de
usuario reciente, dentro de la ventana de "user activation" transitoria de Chrome).
Arreglado en `home.component.ts` (los 3 `<video>` de "Mira cómo funciona", ~línea 713-753):
cambiado el atributo plano `muted` por el binding de propiedad `[muted]="true"` en los tres videos,
y además se fuerza `video.muted = true` justo antes de cada `.play()` (en el `IntersectionObserver`
y en `selectDemoTab()`) como refuerzo. Verificado en navegador: `video.muted` es `true` desde el
primer render y `video.play()` ya no requiere gesto de usuario.
El resto del mecanismo de performance ya estaba bien pensado y no se tocó: `preload="none"` (no
descarga los 3 videos de entrada), un solo `<video>` en el DOM a la vez (`*ngIf` por pestaña, no los
3 simultáneos) y el propio `IntersectionObserver` pausando el video fuera de viewport.

**Hallazgo legal: el flujo de registro no pedía aceptar Términos/Privacidad.**
Los links "Términos de Servicio" / "Política de Privacidad" solo existían en el footer del home
(`home.component.ts`) — el formulario de `/register` (ambos caminos: email/password y
"Continuar con Google") no mostraba ni enlazaba a ninguno de los dos documentos, y creaba la cuenta
sin capturar ningún consentimiento explícito. El propio texto de los Términos dice "al crear una
cuenta... aceptas quedar vinculado" (aceptación por uso/browsewrap), lo cual es más débil que un
checkbox explícito y no deja registro de que el usuario los vio. Revisado también el contenido legal
en sí (Ley 19.628, Ley 19.496, Ley 17.336, cláusula de reembolsos, IA/Foco, ARCO, menores,
transferencia internacional de datos) — está bien escrito y no se encontraron afirmaciones falsas o
contradictorias con lo que hace la plataforma realmente (Flow no recibe comprobantes de transferencia
como archivo, Cloudinary no procesa datos personales de usuarios, solo assets subidos por admins).
Se agregó un checkbox obligatorio "He leído y acepto los Términos de Servicio y la Política de
Privacidad" en `register.component.ts/html`, que abre el mismo modal legal y bloquea tanto el botón
de "Crear Cuenta" como "Continuar con Google" hasta marcarlo (más una validación equivalente en
`onSubmit()`/`registerWithGoogle()` por si el `disabled` del botón se bordea). Bug encontrado durante
esta implementación: como el checkbox y los links viven dentro del mismo `<label>`, un click en
"Términos de Servicio" también marcaba el checkbox por el comportamiento nativo de `<label>` (el click
en cualquier hijo, incluido un `<a>`, burbujea y activa el control asociado) — se corrigió con
`$event.stopPropagation()` en los links, así que abrir el texto para leerlo ya no cuenta como
aceptación implícita.

**Refactor de reutilización:** el modal legal (Términos + Privacidad, ~90 líneas de texto) vivía
duplicado por definición en `home.component.ts` — para poder usarlo también en `/register` sin copiar
el bloque (el propio CLAUDE.md ya advierte sobre este patrón de duplicación con el caso de la sidebar
del panel admin), se extrajo a un componente standalone reutilizable:
`shared/components/legal-modal.component.ts` (`<app-legal-modal [type]="'terms'|'privacy'|null" (close)="...">`).
`home.component.ts` y `register.component.ts` lo importan; el texto legal ahora vive en un solo lugar.
**Pendiente, no implementado:** replicar el mismo checkbox de consentimiento en el flujo de login con
Google si en algún momento login también crea cuentas nuevas silenciosamente (hoy `registerWithGoogle()`
es el único punto de creación de cuenta vía Google, y ya quedó cubierto).

### 2026-08-20 — Panel Admin: auditoría de seguridad, sidebar unificado y módulo Usuarios
Backend typecheck ✅ · build frontend (AOT) ✅ en cada paso · verificado en navegador contra
Firestore/Auth reales (no mocks) con una cuenta admin real.

**Auditoría de seguridad del panel admin — hallazgos y fixes:**
- `AdminService.cleanupDatabase()` (frontend) — método real, con botón "Depurar DB" visible en
  Pool de Preguntas, que borraba usuarios/admins/intentos según una whitelist de 12 UIDs
  **hardcodeada en el bundle público**. Con usuarios reales habría borrado a casi todos. Eliminado
  por completo (método + botón), no se intentó "arreglarlo".
- Endpoints `/admin/modules`, `/admin/questions`, `/admin/simulations` recibían `data: any` sin
  ningún DTO — el `ValidationPipe` global (`whitelist`/`forbidNonWhitelisted`) no protege nada
  cuando el tipo declarado es una interfaz plana en vez de una clase con decoradores de
  `class-validator`. Se les agregó DTO propio (`admin/dto/admin-content.dto.ts`). **Ojo:** ninguno
  de estos 3 endpoints lo llama el frontend hoy (todo pasa por `pool_preguntas` directo) — parecen
  muertos, no se borraron por si acaso.
- `AdminGuard` (backend) y `FirebaseService.isAdmin()` tenían lógica **distinta** para el campo
  `active` de `admins/{uid}` (uno exigía `active === true`, el otro solo bloqueaba si
  `active === false`) — un doc admin sin ese campo podía ser "admin" para beneficios premium pero
  "no-admin" para los endpoints REST. Unificado: `AdminGuard` ahora delega en
  `FirebaseService.isAdmin()`, una sola fuente de verdad.
- `firestore.rules`: `admins/{adminId}` permitía lectura a cualquier autenticado (se podía
  enumerar todos los UIDs admin). Ahora `isOwner(adminId) || isAdmin()`.
- `ThrottlerModule` estaba configurado pero nunca aplicado (ver sección 3) — agregado como
  `APP_GUARD` en `app.module.ts`.
- KaTeX (`katex.service.ts` y su duplicado `math-katex.service.ts`) usaba `trust: true`, que
  habilita comandos LaTeX (`\href`, `\htmlData`) capaces de inyectar HTML/JS arbitrario — relevante
  porque `formula_latex` viene de contenido cargado por admins (incluida importación masiva de
  JSON, menos revisada a mano). Cambiado a `trust: false` (default seguro de KaTeX, sigue
  renderizando toda fórmula matemática normal).
- **Hallazgo bajado de prioridad a pedido del equipo:** `pool_preguntas`/`preguntas` permiten
  lectura a cualquier autenticado, así que `respuesta_correcta` es técnicamente visible consultando
  Firestore directo (afecta también al ensayo real, no solo al pool). Se decidió NO arreglarlo:
  el único perjudicado sería el propio estudiante haciendo trampa sin recibir feedback, no hay
  ganancia real ni afecta a otros usuarios. Ver memoria de sesión (`feedback_security_severity_selfharm`)
  antes de re-priorizar esto.

**Sidebar del panel admin unificado (`features/admin/admin-sidebar.component.ts`):**
Las 5 páginas (`/admin`, `/admin/pregunta/:id`, `/admin/recursos`, `/admin/bugs`,
`/admin/suscripciones`, + la nueva `/admin/usuarios`) tenían cada una su propia copia pegada del
sidebar, desincronizadas: a Suscripciones le faltaba el link "Nueva Pregunta", a Recursos le
faltaba "Suscripciones y Pagos", el badge de conteo de preguntas aparecía en unas y en otras no,
y el editor de preguntas no tenía sidebar en absoluto (salía completamente del panel al crear/editar).
Ahora una sola copia, con `routerLinkActive` en vez de una clase `active` puesta a mano por archivo.

Dos bugs de layout encontrados **durante la unificación, no antes**:
1. El header del sidebar quedó con una altura fija (110px) que le quedaba chica al logo + el badge
   "ADMIN PANEL" al combinar variantes de CSS de las distintas copias — el contenido se desbordaba
   sobre el nav y **le robaba el click** al primer ítem ("Pool de Preguntas" navegaba a Dashboard).
   Arreglado quitando la altura fija (crece según contenido).
2. Root cause más grave: `styles.css` tiene bloques globales sin scope (`GLOBAL SIDEBAR STYLES`,
   `STANDARD DASHBOARD HEADER STYLES`) con `!important` sobre `.sidebar`, `.sidebar-header`,
   `.main-content`, `.nav-item`, etc., pensados para el sidebar del dashboard/ruta de aprendizaje.
   El panel admin reutilizaba esos mismos nombres → el CSS global le ganaba al del componente sin
   ningún error visible (fondo negro donde debía ser claro, `padding` forzado a 0, texto oscuro
   invisible sobre fondo oscuro). Arreglado renombrando TODO con prefijo `admin-`
   (`.admin-sidebar`, `.admin-sidebar-header`, `.admin-nav-item`, `.admin-main-content`, etc.) en
   las 5 páginas. **Ver la nota nueva en sección 8** — cualquier componente nuevo debe evitar estos
   nombres genéricos.

**Nuevo módulo `/admin/usuarios`** (backend `admin/admin.service.ts` `listUsers()` +
`admin/dto/list-users-query.dto.ts`, endpoint `GET /api/admin/users`; frontend
`admin-users.component.ts` + `admin-users.service.ts`):
- Lista paginada (cursor-based), filtro por plan (Todos/Free/Premium), búsqueda por email con
  autocompletado mientras se escribe (debounce 300ms + `switchMap` para cancelar búsquedas
  desactualizadas), columna de días restantes de Premium, botones **Otorgar** (usuario free),
  **Extender** (usuario premium, suma días — ver abajo) y **Quitar** Premium — estos tres
  reutilizan `PaymentService.adminGrantSubscription/adminExtendSubscription/adminRevokeSubscription`,
  los mismos endpoints que ya usaba "Suscripciones y Pagos".
- **Nuevo endpoint** `POST /api/admin/subscriptions/extend` (`SubscriptionsService.manualExtend`,
  `ExtendSubscriptionDto`): a diferencia de `manualGrant` (que siempre resetea el período completo
  desde hoy, en meses), `manualExtend` **suma días exactos** a lo que le queda al usuario —
  toma como base el mayor entre "hoy" y su `endDate` actual, y deja `startDate` intacto. Usado
  solo por el botón "Extender"; "Otorgar" sigue llamando a `manualGrant` sin cambios.
- Bugs reales encontrados **en producción, no en un test**, mientras se probaba en vivo con datos
  reales (créditos a probar contra la BD real en vez de confiar solo en que compilara):
  - `orderBy('createdAt')` excluía a **todos** los usuarios de la lista, porque Firestore excluye
    de un `orderBy` cualquier doc sin ese campo, y la mayoría de las cuentas reales no lo tienen
    (se agregó después de que existieran). Cambiado a `orderBy(FieldPath.documentId())` (todo doc
    tiene id). Para "Registrado" se usa `metadata.creationTime` de Firebase Auth (batch
    `admin.auth().getUsers()`), que sí existe siempre, en vez de depender de Firestore.
  - `FirebaseFirestore.FieldPath` usado como valor (`FirebaseFirestore.FieldPath.documentId()`)
    es solo un namespace de **tipos** de TypeScript — compila bien pero explota en runtime
    (`ReferenceError`). Hay que importar `firebase-admin` como valor (`admin.firestore.FieldPath`).
  - El filtro de plan usaba `where('plan','==','free')` contra Firestore, pero el valor que se
    **muestra** en pantalla es calculado con fallback (`plan==='premium' || subscription.tier
    ==='premium'`) para cuentas a las que nunca se les escribió el campo `plan` top-level. Result:
    filtrar "Free" mostraba solo 1 de 8 usuarios que la tabla "Todos" sí mostraba como Free. Movido
    el filtro a memoria, después de calcular el mismo `plan` que se muestra, para que filtro y
    display usen exactamente la misma definición.
  - `takeUntilDestroyed()` llamado dentro de `ngOnInit()` (no es contexto de inyección) tira
    NG0203 en runtime y el `.subscribe()` de la búsqueda en vivo nunca se establecía — nada pasaba
    al escribir. Hay que inyectar `DestroyRef` como campo de clase y pasarlo explícito:
    `takeUntilDestroyed(this.destroyRef)`.

**Dato operativo, no un cambio de código:** se agregó a `contactolimoslime@gmail.com` como admin
real (`admins/{uid}` con `active:true`) para poder probar el panel en vivo, a pedido explícito del
usuario. Sigue teniendo ese permiso en producción — sacarlo a mano desde la consola de Firebase si
no era la intención dejarlo así.

**Pendiente, solo se conversó, nada implementado:** dónde correrá el backend en producción. Sin
decidir todavía entre Cloud Run (mismo proyecto GCP, más natural dado que ya están en Firebase) o
Railway/Render (deploy más simple, plataforma aparte). Ver bloqueante #1 en sección 11.

### 2026-08-18 — Auditoría del modelo freemium: dónde se aplica cada límite
**Conclusión: el freemium se aplica en la INTERFAZ, no en los datos.** Un usuario técnico
puede saltarse casi todos los límites; ninguno de estos fallos afecta a la cuenta de OTRO
usuario ni permite escalar privilegios — son fugas de negocio, no agujeros de seguridad.

| Límite | Dónde se aplica | ¿Se puede saltar? |
|---|---|---|
| Fichas de Foco (5 vs 500) | Backend (`checkFocoTokens` + `consumeFocoToken`) | **No** |
| Funciones IA solo PRO | Backend (403 `PREMIUM_ONLY_FEATURE`) | **No** |
| Cooldown 48 h de ensayos | Reglas de Firestore (ventana de tiempo) | Solo omitiendo el campo |
| Retención de resultados 3 h | Reglas de Firestore | **No** |
| Autoasignarse plan PRO | Reglas de Firestore | **No** |
| 1 mini ensayo/día | `localStorage` | **Sí**, borrando el almacenamiento |
| 3 sesiones/24 h Mente Veloz | `localStorage` | **Sí**, ídem |
| Materias/tiempos de Mente Veloz | Solo cliente | **Sí** |
| 1 capítulo/materia en la Ruta | Solo cliente | **Sí** |
| 1 ensayo/día (`FREE_TIER_LIMITS`) | **En ningún sitio** | — |

**`POST /api/subscriptions/check-credits` existe en el backend y el frontend NUNCA lo llama.**
Por eso el límite de "1 ensayo/día" y "5 quizzes/día" es código muerto: la única barrera real
para los ensayos es el cooldown de 48 h. Conectarlo es la forma de convertir esos límites en
reales, pero requiere el backend desplegado y decidir qué pasa si está caído (recomendación:
dejar pasar y registrar, para no bloquear a quien paga por un fallo de infraestructura).

**El contenido de pago es legible igualmente.** Aunque se cierren los límites de arriba,
`lp_capitulos`, `secciones`, `lp_tests`, `preguntas` y `pool_preguntas` permiten lectura a
cualquier autenticado, así que un usuario gratuito puede leer los capítulos PRO directamente
desde Firestore. Es la misma raíz que el problema del solucionario: el modelo de negocio no se
puede cerrar mientras el cliente reciba todo el contenido.

**Corregido:** en `mini-ensayo.service.ts` los admin quedaban fuera del trato PRO (se les
aplicaba el tope de preguntas del plan gratuito y el límite de 1/día), al revés que en el resto
de la app y que el backend.

**Detectado y NO corregido (afecta solo a cuentas admin del equipo):** en
`firestore.service.ts`, `isPro` se calcula como `plan === 'premium'` sin incluir admins, así
que **a un admin se le retienen los resultados de un ensayo 3 horas**. No se tocó porque
arreglarlo solo en el cliente rompería el guardado: la regla `isValidFinish` de
`firestore.rules` calcula `isPro` igual (sin admins) y rechazaría la escritura. Hay que
cambiar las dos cosas a la vez —regla y cliente— en el mismo despliegue.

### 2026-08-18 — Optimización, seguridad y capacidad para ~200 usuarios
Typecheck (front y back) ✅ · 43/43 tests ✅ · build producción ✅.

#### 🔴 VULNERABILIDAD: las respuestas correctas son legibles por cualquier usuario
`firestore.rules` permite `read` a cualquier autenticado sobre `preguntas`,
`pool_preguntas` y `lp_tests`, y esos documentos **incluyen `correctAnswer` /
`respuesta_correcta`**. El propio archivo lo reconoce en un comentario.

No hace falta tocar la UI: con la sesión iniciada, un `getDocs(collection(db,'preguntas'))`
desde la consola —o una llamada REST con el ID token— devuelve **el solucionario completo de
todos los ensayos**. Son las 2163 preguntas de la ruta más los bancos de ensayos.

Es consecuencia directa de que el frontend corrige las respuestas en el cliente. **No se
puede arreglar solo con reglas**: si el navegador necesita la clave para corregir, el usuario
la tiene. La solución real es mover la corrección al backend:
1. Quitar `correctAnswer` de lo que se sirve al cliente (colección paralela `respuestas/{id}`
   con `allow read: if false`, o `Sin campo` vía Cloud Function).
2. Un endpoint `POST /api/attempts/:id/grade` que reciba las marcadas y devuelva el resultado.
3. Las reglas de `intentos` ya impiden falsificar la fecha; faltaría impedir falsificar `score`.
> Es un cambio de arquitectura, no un parche. **Decisión del equipo, no lo hice.**

#### Optimizaciones aplicadas
| Cambio | Antes | Después |
|---|---|---|
| Caché de contenido de la ruta | TTL 30 min | **TTL 6 h** (`CONTENT_CACHE_TTL_MS`) |
| Catálogo de ensayos | releía la colección en cada visita | caché de sesión, 1 h |
| Recursos adicionales | releía la colección en cada visita | caché de sesión, 1 h (`loadRecursos(true)` la salta tras editar) |
| Respuestas de ensayo | **1 transacción por respuesta** (70 lecturas + 70 escrituras por ensayo) | agrupadas cada 4 s en una sola transacción → **~15 escrituras** |

`FirestoreService.saveAnswer()` ahora **no devuelve promesa**: acumula y programa el volcado.
`flushPendingAnswers()` se llama solo al entregar y al abandonar. Un `Map` por `preguntaId`
colapsa los cambios de opinión. Riesgo asumido: un cierre abrupto del navegador puede perder
los últimos ≤4 s de respuestas; al entregar no se pierde nada porque `finishIntento()`
reconstruye el array desde el estado local del componente.

`readSessionCache`/`writeSessionCache` se extrajeron a `core/utils/session-cache.ts` porque
`FirestoreService` no se puede instanciar en un test sin colgar Karma (AngularFire inicializa
la persistencia de Auth y se queda esperando). Ahí viven sus 10 tests.

#### 🟠 Limitador de peticiones sin `trust proxy` (corregido)
`ThrottlerGuard` limita **por IP**, pero `main.ts` no confiaba en `X-Forwarded-For`. Detrás de
Cloud Run / Render / Railway, Express habría visto la IP del proxy en todas las peticiones y
**los 200 usuarios habrían compartido un único cupo de 60 req/min**. Añadido
`app.getHttpAdapter().getInstance().set('trust proxy', 1)`.
⚠️ Si se pone otro proxy delante (Cloudflare + Cloud Run), hay que subir ese número: confiar
de menos rompe el límite, confiar de más permite falsificar la IP y saltárselo.

#### Análisis de capacidad — 200 usuarios
Medido sobre el inventario real (8 materias, 30 capítulos, 401 secciones, 502 tests).

**Lecturas/usuario/día** (tras las optimizaciones): carga de contenido 439 × 1-2 al día,
catálogo de ensayos ~60, preguntas de un ensayo ~70, secciones abiertas ~10, perfil y
actividad ~12 → **≈ 600-900**.
- 200 usuarios ≈ **120.000-180.000 lecturas/día**.
- **Cuota gratuita (Spark): 50.000/día → se supera con ~60-80 usuarios activos.**

**Escrituras/usuario/día** (tras agrupar): ~25 → 200 usuarios ≈ **5.000/día**, holgado frente
al límite de 20.000. *Antes del agrupado eran ~14.000/día solo en respuestas de ensayo: el 70%
de la cuota.*

**Conclusión: hay que pasar a plan Blaze.** El coste es despreciable (~180k lecturas/día ≈
**US$2-3 al mes**); el problema del plan gratuito no es el dinero sino que **al agotarse la
cuota los `getDocs` fallan y la app cae al contenido local desfasado**, que es exactamente lo
que ocurrió durante la auditoría (`RESOURCE_EXHAUSTED`).

**El cuello de botella real NO es Firestore, es el ancho de banda.** El build pesa 310 MB, de
los cuales 293 MB son imágenes (PNG de materias de 5-7 MB, gifs de Foco de hasta 15 MB, un
MP4 de 18 MB). Con 200 usuarios y ~20 MB por sesión: **~80 GB/mes**, contra los 10 GB del plan
gratuito de Hosting y ~US$12/mes en Blaze — cuatro veces el coste de Firestore. Optimizar esas
imágenes (WebP/AVIF, redimensionar, o servirlas desde Cloudinary como ya se hace con el
branding) es la palanca de coste y de velocidad más grande que queda, y además es lo que más
se nota en un móvil con datos.

#### Revisado y correcto (no hacía falta tocar)
- **XSS:** los 19 usos de `bypassSecurityTrustHtml` reciben contenido escrito por **admins**
  (contenido de la ruta) o generado por la IA con escapado previo. Lo escrito por usuarios
  (reportes de bugs) se pinta con interpolación `{{ }}`, que Angular escapa. Sin vía de XSS
  almacenado encontrada.
- **Reglas de Firestore:** no hay `match /{document=**}` permisivo; las colecciones de pago e
  IA (`manual_payments`, `flow_*`, `discount_codes`, `admin_audit_logs`) quedan denegadas por
  defecto al cliente y solo las toca el Admin SDK.
- `getPreguntas` ya cacheaba en memoria por sesión.

### 2026-08-18 — Entrenador de estudio con Foco en el Dashboard (PRO)
Backend typecheck ✅ · 26/26 tests ✅ · build producción ✅ · verificado en navegador a 375 y 1280px.

**Qué es.** En "Inicio", el botón *Hablar con Foco* abre una **conversación** (antes era una
recomendación de una sola tirada). Foco recibe la ficha real del alumno y le dice qué hacer.

**Backend** — `POST /api/ai/study-coach`, exclusivo PRO:
- `dto/study-coach.dto.ts` · `prompts/study-coach.prompt.ts` · `AiFeedbackService.studyCoachChat()`
- **Coste en fichas: 2 el primer turno** (analiza todo el historial: entrada larga + respuesta
  densa) **y 1 cada seguimiento**. Se apoya en que `consumeFocoToken` ya acepta `amount`.
- La ficha del alumno se inyecta como **primer mensaje de usuario**, no en el system prompt,
  para que el modelo la trate como datos del caso y se pueda refrescar en cada turno.

**El prompt cubre dos escenarios, y esto es lo importante:**
- **A — con datos:** diagnostica citando cifras reales (puntajes, % de avance, racha) y da 2-3
  acciones priorizadas. Regla dura: si una materia no está en la ficha, no puede afirmar nada
  sobre ella.
- **B — sin datos:** tiene PROHIBIDO inventarse un diagnóstico. Dice que aún no tiene datos y
  entrevista al alumno **una pregunta por mensaje** (disponibilidad → franja horaria → materias
  → meta) hasta poder armarle un plan semanal concreto.
- El servidor decide el escenario con `tieneDatosSuficientes()` y se lo indica explícitamente,
  en vez de dejar que el modelo lo deduzca.

**Frontend** — modal de chat en `dashboard.component.ts`:
`AiAssistService.studyCoachViaBackend()`, nuevo `PremiumOnlyError`, markdown ligero saneado
con `DomSanitizer`, chips de preguntas sugeridas, contador de fichas restantes y hoja inferior
a pantalla completa en móvil. Al reabrir el modal en la misma sesión no se gastan fichas.

> **Sin verificar end-to-end:** el harness usa un Auth falso sin token válido, así que la
> llamada real (guard de Firebase + comprobación PRO + Gemini) **no se ha probado**. Lo
> verificado es: el modal abre, es responsive, el gate PRO/gratis funciona en la UI y el
> camino de error se muestra con elegancia. **Probar con una cuenta PRO real y el backend
> corriendo.**

**También:** eliminados los botones rojos `🧪 [DEV] Simular paso de tiempo` de `ensayos-list`
(2) y `ensayo-review` (1). Aparecían por el `fileReplacements` de entorno añadido ese mismo
día: antes `production` era `true` en desarrollo y los ocultaba. El método
`FirestoreService.devSimulateTimePass()` sigue existiendo.

### 2026-08-18 — Tests bajo demanda (−53% lecturas) + cabecera móvil tapada
Typecheck ✅ · 26/26 tests ✅ · build producción ✅ · medido en navegador a 414 y 1400px.

**Optimización: `lp_tests` ya NO se carga entero.**
Antes cada carga en frío hacía `getDocs(lp_tests)` trayendo los **502 documentos** de test
aunque el alumno abriera uno solo. Ahora:
- Arranque: 8 + 30 + 401 = **439 lecturas** (antes 941, **−53%**).
- Cada sección que se abre: **1 lectura**, y solo la primera vez de la sesión.
- Contenido servido desde seeds locales (comp-lectora, historia): **0 lecturas**, el test
  viene embebido.

API nueva en `PaesContentService`:
- `ensureTestLoaded(seccionId)` — idempotente, coalesce peticiones simultáneas al mismo
  test, y si la lectura falla **no lanza**: deja la sección como estaba.
- `attachTestToSeccion()` — inserta el test en `_capitulos` de forma inmutable para que los
  `computed()` de las vistas se recalculen.
- `autoLoadTest(() => seccionId)` — helper reactivo para el constructor del componente. Usa
  `untracked` para no depender de `_capitulos` (que es lo que acaba escribiendo) y evitar un
  ciclo de reevaluaciones.

Conectado en los 7 consumidores: `seccion-detail`, `seccion-biologia-detail`,
`seccion-fisica-detail`, `seccion-test`, `seccion-test-math`, `seccion-test-review`,
`seccion-test-review-math`.

> **Sin verificar contra Firestore real:** el harness usa un stub de Firestore, así que la
> ruta de lectura individual solo está cubierta por tests unitarios y typecheck. La cuota
> estaba agotada. **Probar una sección real** (que muestre sus preguntas) antes de desplegar.

**Bug visual: la cabecera móvil tapaba 60px de contenido.**
`.mobile-header` es `position: fixed` con 60px de alto a ≤1024px, pero nada reservaba ese
espacio en `.main-content`: el subtítulo "Elige una materia..." salía cortado y los botones
de la cabecera medio tapados. Dashboard y Mente Veloz ya lo compensaban en sus estilos de
componente; **la Ruta, sus materias y Ensayos no**.
Corregido en `styles.css`, en el bloque `@media (max-width:1024px)` que va **después** de
`.main-content { padding: 0 !important }` (sección STANDARD DASHBOARD HEADER) — puesto antes,
esa regla lo anulaba. Medido: de 60px tapados a **0**. Escritorio sin cambios.

### 2026-08-18 — Auditoría del contenido REAL en Firestore
Script: `node tools-audit-firestore.js` (SOLO LECTURA — solo `lp_materias`, `lp_capitulos`,
`secciones`, `lp_tests`; no toca users/intentos/pagos).

**Inventario real (muy superior a los seeds):** 8 materias · 30 capítulos · 401 secciones ·
502 tests · **2163 preguntas**. Los seeds locales solo tienen 564 preguntas: Firestore es la
fuente de verdad y los seeds están MUY por detrás.

#### 🔴 PROBLEMA DE ESCALA: 941 lecturas por carga en frío
Cada arranque con caché fría hace 4 `getDocs` de colecciones **completas**
(8 + 30 + 401 + 502 = **941 documentos**), incluidos los 502 tests aunque el usuario solo vaya
a abrir uno. Con la cuota gratuita de Firestore (50.000 lecturas/día) eso son **~53 cargas en
frío al día para toda la plataforma**. La caché de 30 min lo mitiga, pero no escala.

**Durante esta auditoría Firestore devolvió `RESOURCE_EXHAUSTED: Quota exceeded`.** Cuando eso
pasa, `loadDataFromFirestore` cae en `loadLocalFallbacks()` y los usuarios ven el contenido
local desfasado (o casi nada en mat1/mat2/ciencias) en vez del real. **Revisar la cuota/plan
de Firebase.** Arreglo de fondo: no cargar `lp_tests` de golpe — traer el test al abrir la
sección, que es cuando se necesita.

#### Hallazgos de contenido (de la única pasada completa)
- **16 preguntas con alternativas idénticas** — bug visible para el estudiante. El peor:
  `test-loc-syn` pregunta 300, donde **las 4 alternativas son iguales** (A=B=C=D). También
  `test-m1-2-11` (21104), `test-m1-2-15` (21502), `test-m1-2-20` (22015) con pares repetidos.
- **21 preguntas duplicadas dentro del MISMO test** (mismo id, contenido repetido en el array
  `preguntas`), sobre todo en `test-cbio-1-org-5` y `test-cbio-1-trans-5`.
- **2 referencias rotas**: `sec-cbio-2-nerv-tips` y `sec-cbio-2-repr-tips` apuntan a tests que
  no existen.
- **13 tests vacíos** (varios son prácticas/pro-tips, legítimos; `test-elec-prac-A/B` conviene
  revisarlos).
- **La materia `ciencias` está vacía en producción**: 1 capítulo (`cap-ciencias-1`) con 1
  sección y 0 capítulos de pago. Un usuario PRO no obtiene nada extra ahí.

#### Capítulo GRATIS de cada materia (el que abre el Plan Básico)
Verificado contra la base real — ninguna materia tiene empate de `order`, así que el capítulo
gratuito es determinista:

| Materia | Capítulo gratis | Secciones | De pago |
|---|---|---|---|
| comp-lectora | `cap-1` Habilidad 1: Localizar | 26 | 3 |
| mat1 | `cap-m1-1-numeros` Eje Temático: Números | 9 | 3 |
| mat2 | `cap-m2-1-numeros` Eje Temático: Números | 7 | 3 |
| historia | `cap-hist-1` La Era de las Repúblicas | 14 | 4 |
| ciencias-biologia | `cap-cbio-1` La Célula | 16 | 3 |
| ciencias-fisica | `cap-fisica-1` Ondas, Sonido y Luz | 20 | 3 |
| ciencias-quimica | `cap-qui-1` Estructura Atómica | 7 | 3 |
| ciencias | `cap-ciencias-1` (stub) | 1 | 0 |

> No se pudo recuperar la cola del informe (secciones MEDIA/BAJA: texto corrupto, tests
> huérfanos) porque la cuota se agotó en el segundo intento. Volver a correr el script otro día.

### 2026-08-18 — Auditoría de CONTENIDO de la Ruta (seeds locales)
Script reutilizable: `node tools-audit-contenido.js frontend-app` (carga los seeds TS de
verdad, no por regex como los antiguos `check_dupes.py` / `check_levels.py`).

**Inventario:** 12 capítulos, 160 secciones, **564 preguntas**.

**Lo que salió LIMPIO** (verificado, no asumido):
- **0 IDs duplicados** de capítulo, sección, test o pregunta.
- **564 enunciados, 564 únicos → 0 preguntas repetidas** en todo el contenido.
- 0 respuestas correctas inválidas (todas apuntan a una alternativa existente).
- 0 alternativas idénticas dentro de una pregunta · 0 feedbacks faltantes.
- 0 referencias cruzadas rotas (`capituloId`/`materiaId`/`seccionId` coherentes).

**Corregido:**
- **253 secuencias de texto corrupto (mojibake)** en `guide-slides-data.ts`: se veía
  "molÃ©culas", "SegÃºn", "âŒ". Era UTF-8 doblemente codificado. Los seeds de
  contenido (`seed-data.ts`, `seed-historia.ts`) estaban limpios.
- **Alternativa duplicada** en `SLIDE_QUIZ2`: la opción C aparecía dos veces, idéntica
  (quedaba A, B, C, C). Eliminada la copia; el quiz hermano también tiene 3 opciones.

**Falsos positivos aclarados (NO son bugs, no los "arregles"):**
- `order` duplicado en `cap-interpretar` (5 casos): son los **pares de rama** — mismo
  `level` y etiquetas complementarias `subcapitulo:Textos Informativos` / `Narrativos`.
  Es el diseño de camino ramificado.
- 11 "tests vacíos": son secciones `isPractice` (match-pairs, categorize) e `isProTip`,
  que usan sus propios componentes y no el runner de tests. El campo `test` vacío es
  dato muerto, no un test roto.

**Pendientes de decisión tuya:**
- **Capítulos stub sin contenido real** para `mat1`, `mat2` y `ciencias` en `seed-data.ts`
  (`cap-mat1-1`, `cap-mat2-1`, `cap-ciencias-1`): un capítulo con una sección que no tiene
  test. Solo aparecen en el fallback offline (online el contenido viene de Firestore).
  `syncLocalChapters` filtra el equivalente de historia (`cap-historia-1`) pero **no** estos.
- **Contenido muerto:** `LOCALIZAR_SLIDES`, `SLIDE5_QUIZ` y `SLIDE_QUIZ2` solo se sirven
  para el capítulo `cap-localizar`, que el servicio descarta como fantasma. Son 13 slides
  inalcanzables.
- Dos secciones distintas de `cap-evaluar` comparten el título "Práctica: Detección Rápida"
  (`sec-3-7` tono, `sec-3-15` falacias): en la ruta se ven como dos nodos con el mismo nombre.

**Fuera de alcance:** el contenido real de producción vive en **Firestore** y no se pudo
auditar (requiere credenciales). Esto cubre los seeds, que son lo que se siembra y el
fallback offline. Tampoco se auditaron los bancos de ensayos (`assets/*-preguntas-db.json`).

### 2026-08-18 — QA de la Ruta con 3 agentes: bugs encontrados y corregidos
Verificado: 22/22 tests ✅ · build producción ✅ · medido en navegador a 320/375/1024/1400.

**CRÍTICO — el gate freemium estaba anulado (bug introducido el mismo día).**
`enforceLearningAccess` escribía signals dentro de un `effect()` sin
`{ allowSignalWrites: true }`. Angular 18 lanza **NG0600**, la excepción abortaba el
effect **antes** del `router.navigate`, y el usuario gratuito se quedaba leyendo el
capítulo de pago entero. El `ErrorHandler` se lo tragaba en silencio.
Corregido + se expulsa PRIMERO y se abre el modal después. Reverificado en navegador:
free en cap-2 → expulsado, modal abierto, contenido no renderizado; free en cap-1 → entra;
PRO en cap-2 → entra.

**ALTA — la sidebar de escritorio tapaba el contenido en ≤1024px (bug global, preexistente).**
Conflicto de cascada en `styles.css`: `aside.sidebar` (≈línea 499, dentro del media query
que la oculta) y `body .sidebar` (≈línea 863) tienen la **misma especificidad (0,1,1)** y
ambas `!important` → ganaba la segunda por ir después. En un móvil de 375px la sidebar fija
de 260px se comía el **69% de la pantalla**. Afectaba a TODAS las vistas con sidebar, no
solo a la ruta. Resuelto al final de `styles.css` con especificidad (0,1,2).

**ALTA — contenido recortado en móvil.** A 320px: `.splash-info` colapsaba a **0px** (título,
insignia y stats del capítulo invisibles), **28 de 91 nodos** quedaban fuera de pantalla y
**56 de 91 títulos** cortados. Tres causas: `.dashboard-body` con `padding: 2.5rem` fijo sin
media query (80px = 25% de la pantalla), `.splash-hero` en flex con la mascota a 180px fijos
sin pasar a columna, y el gap de las filas ramificadas fijado en el template (208px para 2
nodos → `.node-wrapper` de 336px dentro de una fila de 296px).
Tras el arreglo, a 320 y 375px: **0 nodos recortados, 0 títulos cortados, 0 elementos fuera
de pantalla**. Escritorio sin cambios (padding y gap originales por encima de 700px).

**Otros:** `loadLocalFallbacks()` no incluía `HISTORIA_CAPITULOS`, así que sin conexión
Historia perdía sus 5 capítulos y se quedaba con un placeholder. · Los nodos bloqueados por
plan no tenían clase propia (indistinguibles de los bloqueados por progreso): ahora
`.node-premium-locked`. · Objetivos táctiles de 22–32px subidos a 44px en móvil.

**Ojo con el harness:** un rebuild incremental de Angular puede perder el `fileReplacement`
y hacer que `/dev/ruta` devuelva 404. Se arregla reiniciando el dev server.

### 2026-08-18 — Harness de la Ruta + `environment.development.ts` no se usaba
- **`angular.json` no tenía `fileReplacements`.** `environment.development.ts` era código
  muerto: `ng serve` compilaba con `environment.ts`, o sea **`production: true` durante el
  desarrollo**. Efecto real: los botones de desarrollo quedaban ocultos donde debían verse
  (`ensayos-list`, `isProduction`) y `devSimulateTimePass()` se auto-bloqueaba en local.
  Añadido el `fileReplacements` de entorno y de rutas.
- Creado el **banco de pruebas `/dev/ruta`** (ver sección 9) para poder revisar la Ruta sin
  iniciar sesión. Separación `app.routes.base.ts` / `app.routes.ts` / `app.routes.dev.ts`
  para garantizar que no llega a producción (verificado por `grep` sobre `dist/`).
- `.claude/launch.json` ahora fija el puerto 4301, para no chocar con un `ng serve`
  que ya esté corriendo en 4200.

### 2026-08-18 — Ruta de Aprendizaje: bugs, gate freemium, responsive y tests
Build ✅ · typecheck ✅ · 22/22 tests ✅ (verificados con mutación: al romper el gate a
propósito, 5 tests fallan; al restaurarlo, vuelven a verde).

**Seguridad (lo más grave):**
- **Atajos de trucos abiertos a cualquier usuario.** `Alt+U` (desbloquear toda la ruta),
  `Alt+C` (completar todo) y `Alt+X` (resetear progreso) estaban activos en las 6 rutas
  vía `@HostListener`. El botón visible estaba comentado, pero el atajo no. Cualquiera
  podía abrir el curso entero. Ahora requieren admin.
- **Ninguna vista de detalle o test validaba el plan.** `capitulo-*-detail`,
  `seccion-*-detail`, `seccion-test` y `seccion-test-math` renderizaban lo que pidiera
  la URL. Ahora todas instalan `enforceLearningAccess()`.

**Bugs corregidos:**
- `poolMap` siempre vacío hacía que un test definido con `preguntaIds` se quedara **sin
  preguntas de forma silenciosa**, pisando incluso las embebidas. Hoy es latente
  (`preguntaIds` se lee pero nadie lo escribe); quedó blindado y avisa por consola.
- `submitTest` con un test vacío hacía `0/0 = NaN`, y el NaN se propagaba a `bestScore`
  (`Math.max(x, NaN) === NaN`), se guardaba como `null` y **corrompía el progreso de esa
  sección de forma permanente**. Ahora lanza un error explícito antes.
- `loadDataFromFirestore()` no tenía guard de concurrencia y se llamaba desde
  `onAuthStateChanged`, que puede dispararse varias veces. Cada llamada son 4 `getDocs`
  de colecciones completas. Ahora las llamadas concurrentes se agrupan en una sola.
- `forceRefresh()` (botón admin "Actualizar Datos") limpiaba `paes_content_cache`, clave
  que **no existe**: recargaba sin invalidar nada. Ahora usa las claves reales.
- `materia-biologia-path` se declaraba con `selector: 'app-materia-fisica-path'`.
- `isProPlan` en las 6 rutas excluía a los admin, al revés que el resto de la app y que
  el backend. Ahora delega en `LearningAccessService.isPro()`.

**Responsive:**
- `.sim-drawer.expanded` medía 800px fijos **sin ningún override móvil**: desbordaba en
  cualquier teléfono. Ahora es `100vw` bajo 860px.
- No había **ni un solo `overflow-x`** en toda la sección: fórmulas KaTeX en bloque,
  tablas e imágenes anchas empujaban el ancho de la página. Añadida contención en las 11
  vistas de contenido (cada bloque ancho scrollea dentro de sí mismo).
- Las órbitas decorativas ya estaban bien (el contenedor recorta y se ocultan bajo 900px).

**Tests** — `services/*.spec.ts`, 22 casos. El proyecto no tenía ninguno.
Karma necesita un Chromium; si no hay Chrome, sirve Edge:
`CHROME_BIN="C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" npx ng test --watch=false --browsers=ChromeHeadless`

**Sin verificar end-to-end:** el gate se validó con tests unitarios y build, pero no en
navegador con una cuenta gratuita real (requiere credenciales). Conviene probar a mano:
entrar como usuario free a `/ruta/mat1/<capitulo-2>` por URL directa y confirmar que
redirige y abre el modal de precios.

### 2026-08-18 — Correcciones de seguridad y configuración
Cambios aplicados (backend typecheck ✅ · build del frontend ✅):
- **`angular.json`**: se excluye `pruebasDemre/**` del empaquetado. Los PDFs oficiales **con sus
  solucionarios** (107 MB) ya no se publican. Build verificado: 0 PDFs en `dist/`, assets necesarios
  intactos. Ver el hallazgo de seguridad en la sección 11.
- **Credenciales de Cloudinary fuera del código**: el `cloud_name`/`api_key`/`api_secret` estaban
  hardcodeados en **9 scripts** (6 `.ts` + 3 `.js`). Los `.ts` usan ahora el helper compartido
  `backend/src/scripts/cloudinary.config.ts`; los `.js` (CommonJS, sueltos) leen `.env` en línea.
  Todos abortan con un mensaje claro si falta una variable.
  **Pendiente: rotar el secreto**, que sigue en el historial de git.
- **`package.json` raíz**: eliminados los scripts rotos que apuntaban a `frontend-landing/`
  (`build:landing`, `deploy:landing`, `dev:landing`) y arreglados `install:all`, `build:all` y
  `deploy:hosting`. Se reemplazó el bloque de comentarios que citaba `deploy.bat`/`DEPLOY.md`
  (inexistentes) por instrucciones reales.
- **`EstudiaUni.code-workspace`**: quitada la carpeta `frontend-landing` inexistente.
- **`backend/.env.example`**: agregada `GEMINI_API_KEY` (el proveedor de IA real, que faltaba),
  marcada `OPENAI_API_KEY` como no usada, y documentadas `PORT`, `FRONTEND_APP_URL`,
  `FRONTEND_LANDING_URL` (legacy) y los emuladores de Firebase.
- **`.gitignore` de raíz**: no existía. Creado, cubriendo `node_modules/`, `dist/`, `.angular/`,
  `.firebase/`, `.env` y los mocks locales.

**No se tocó** (requiere tu decisión): módulos muertos del backend, componentes `materia-*-path`
duplicados, sidebar repetida, archivos `.backup.ts`, scripts sueltos de `backend/src/`,
`apiUrl` de `environment.ts`, optimización de imágenes, y el desindexado de `node_modules`/`.firebase`
de git (afecta a los working copies del equipo).

### 2026-08-18 — Documento maestro creado
- Análisis completo del proyecto y creación de este `CLAUDE.md`.
- Nada de código modificado.
- Corregido: el documento decía que el backend "estaba caído en producción". El proyecto **está en
  desarrollo, aún sin hostear** — el `apiUrl` a localhost es un pendiente para el primer deploy,
  no una falla actual.

<!-- Agrega las nuevas entradas ARRIBA de esta línea, en orden cronológico inverso -->
