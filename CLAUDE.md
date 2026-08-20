# EstudiaUni.cl — Documento maestro del proyecto

> **Para la IA:** este archivo es la fuente de verdad del proyecto. Léelo antes de tocar código.
> Si haces un cambio estructural (nueva feature, nueva colección de Firestore, cambio de arquitectura,
> cambio de precios/límites), **actualiza este archivo en el mismo commit**.
> Al final está la **Bitácora de avances** — anota ahí lo que vayas completando.
>
> Última actualización: 2026-08-20 · Rama en la que se escribió: `rutaInfinita`

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
`/admin/suscripciones` · `/admin/usuarios` (listar/filtrar/otorgar-extender-revocar Premium, 2026-08-20)

Las 5 páginas comparten un único `AdminSidebarComponent` (`features/admin/admin-sidebar.component.ts`,
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
BACKEND_PUBLIC_URL      # URL HTTPS pública para el webhook de Flow (en dev: ngrok)
```

Falta declarar la variable de la API key de Gemini en `.env.example` (el servicio la lee vía
`ConfigService` en `ai-feedback.service.ts` — verificar el nombre exacto antes de documentarlo).

Flow **no publica credenciales de sandbox compartidas**: cada comercio crea su cuenta en
`sandbox.flow.cl` y saca su propio API Key + Secret Key.

---

## 11. Estado del proyecto y pendientes conocidos

### ✅ Funcionando
Auth completo (email + Google, con verificación y migración de UID), ruta de aprendizaje de las 8 materias,
ensayos PAES en ambos modos, mini ensayos, Mente Veloz, Foco IA en todos sus contextos, panel admin
(preguntas, recursos, bugs, suscripciones, **usuarios** — listar/filtrar/otorgar-extender-revocar Premium,
2026-08-20), calculadora NEM, buscador de carreras, sistema freemium con
límites y cooldowns, reglas de Firestore endurecidas, SEO (meta tags dinámicos, canonical, JSON-LD,
sitemap, robots), accesibilidad, notificaciones, landing con videos.

### 🔴 Bloqueantes para el primer despliegue
> **El proyecto está en desarrollo — todavía NO está hosteado ni en producción.** Nada de lo siguiente
> es una falla actual; en local todo funciona con `npm run dev:backend` corriendo. Son los pendientes
> que hay que resolver **antes** del primer deploy.

1. **`environment.ts` (el de producción) apunta a `apiUrl: 'http://localhost:3000'`.** Si se despliega
   así, en la web publicada fallará todo lo que pasa por el backend: chat con Foco, análisis IA, pagos
   con Flow, cupones, transferencias y el admin de suscripciones. Hay que desplegar NestJS
   (Cloud Run / Render / Railway) y apuntar `environment.ts` a esa URL HTTPS, agregarla al
   `enableCors` de `main.ts` y ponerla en `BACKEND_PUBLIC_URL`.
2. **Flow en sandbox.** Falta pasar `FLOW_ENVIRONMENT=production` con credenciales reales y ejecutar
   `setup:flow-plans` contra producción.
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

⚠️ **Si alguien vuelve a agregar assets pesados o sensibles, revisar esa exclusión.** La carpeta
gemela `frontend-app/src/pruebasDemre/` (fuera de assets) es la que usa `npm run cropper` y nunca
se empaquetó.

### 🟡 Deuda técnica
- **Build de 310 MB**, casi todo `assets/images/` (293 MB): `subjects/*.png` de 5–7 MB cada una,
  gifs de Foco en WebP de hasta 15 MB, un `.mp4` de 18 MB y las carpetas `L-*-IMAGENES` de
  comprensión lectora (~150 MB entre todas). **Estas imágenes sí se usan**, así que optimizarlas
  (redimensionar, comprimir, o servirlas desde Cloudinary como ya se hace con el branding) es un
  trabajo aparte que cambia lo que se ve — no se tocó.
- **1182 archivos de `node_modules` versionados en git**, de `pdf-cropper-tool`, duplicados en
  `src/pruebasDemre/` y `src/assets/pruebasDemre/`. El `.gitignore` nuevo evita que crezca, pero
  para sacar los ya versionados hace falta correr (afecta a los working copies del equipo):
  `git rm -r --cached "frontend-app/src/**/pdf-cropper-tool/node_modules"`
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

### 2026-08-20 — Modo Infinito / Polígono de Maestría Diaria (Nueva Feature)
Build ✅ · typecheck ✅ · probado en desktop y mobile.

**Implementación de la Maestría Infinita tras completar el 100% de una materia:**
- **`InfiniteMasteryService` (`src/app/core/services/infinite-mastery.service.ts`):**
  - Mapeo de polígonos geométricos según la materia: 3 ejes (Competencia Lectora), 4 ejes (Matemática M1, M2, Física, Química, Biología) y 5 ejes (Historia).
  - Pool combinado de preguntas: integra `pool_preguntas` de Firestore + extracción automática de preguntas con sus alternativas, fórmulas LaTeX y feedback de todos los capítulos/secciones de la materia correspondiente.
  - Seeding diario estático: genera 5 preguntas por eje y 8 para el jefe al inicio del día y las mantiene estáticas durante toda la jornada.
  - Regla estricta del 100% de aciertos: exige responder todas las preguntas bien para dominar un eje y derrotar al Núcleo Maestro.
  - Bloqueo de 1 nivel por día para el Núcleo Maestro con reseteo sincronizado a la medianoche.
- **`InfiniteMasteryModalComponent` (`src/app/features/learning-path/infinite-mastery-modal.component.ts`):**
  - Modo embebido en el lienzo (`isEmbedded`) integrado en la propia página de la ruta sin modales oscuros, con estética clara y paleta de colores `--subject-theme` por materia.
  - Polígono SVG escalable con pistas de fondo suaves, trazos vivos y animación de pulso energético en ejes completados.
  - Posicionamiento direccional dinámico de etiquetas (`label-pos-top`, `bottom`, `left`, `right`) para evitar colisiones entre nodos externos y el núcleo central.
  - Renderizado KaTeX mixto (`parseMixed`) con `DomSanitizer` para enunciados, alternativas y explicaciones paso a paso.
  - Barra de progreso reactiva desde 0% y tarjeta de resumen con reintento diario.
- **Integración y Navegación:**
  - Botón `⚡ REFORZAR` en el catálogo (`learning-path.component.ts`) activo únicamente para materias con 100% de progreso.
  - Switcher segmentado `[ 🗺️ Ruta Principal ] [ ⚡ Modo Infinito ]` incrustado en los 6 componentes de ruta (`materia-math-path`, `materia-historia-path`, `materia-fisica-path`, `materia-quimica-path`, `materia-biologia-path`, `materia-path`) con sincronización de query param `?mode=infinite`.

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
