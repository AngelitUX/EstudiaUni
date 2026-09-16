# EstudiaUni.cl - Plataforma de Preparacion PAES

[![Angular](https://img.shields.io/badge/Angular-18.2-DD0031?style=flat-square&logo=angular&logoColor=white)](https://angular.dev/)
[![NestJS](https://img.shields.io/badge/NestJS-10.4-E0234E?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%7C%20Auth%20%7C%20Hosting-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Google Cloud](https://img.shields.io/badge/Google%20Cloud-Cloud%20Run-4285F4?style=flat-square&logo=googlecloud&logoColor=white)](https://cloud.google.com/run)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-8E75B2?style=flat-square&logo=google&logoColor=white)](https://aistudio.google.com/)
[![License](https://img.shields.io/badge/License-Proprietary-gray?style=flat-square)](#licencia)

Plataforma web integral de alto rendimiento orientada a la preparacion de la Prueba de Acceso a la Educacion Superior (PAES) en Chile. Integra rutas de aprendizaje gamificadas, ensayos oficiales DEMRE cronometrados y asistidos, un tutor inteligente impulsado por Google Gemini 2.5 Flash, buscador vocacional con datos oficiales de admision, calculadora NEM/Ranking y un sistema freemium con pasarela de pagos.

---

## Tabla de Contenidos

- [1. Descripcion General](#1-descripcion-general)
- [2. Caracteristicas Principales](#2-caracteristicas-principales)
- [3. Arquitectura del Sistema](#3-arquitectura-del-sistema)
  - [3.1. Diagrama de Flujo y Componentes](#31-diagrama-de-flujo-y-componentes)
  - [3.2. Patron de Comunicacion Hibrido](#32-patron-de-comunicacion-hibrido)
- [4. Pila Tecnologica](#4-pila-tecnologica)
- [5. Estructura del Repositorio](#5-estructura-del-repositorio)
- [6. Modulos y Funcionalidades en Detalle](#6-modulos-y-funcionalidades-en-detalle)
  - [6.1. Ruta de Aprendizaje](#61-ruta-de-aprendizaje)
  - [6.2. Ensayos PAES Oficiales y Mini Ensayos](#62-ensayos-paes-oficiales-y-mini-ensayos)
  - [6.3. Tutor Virtual Foco](#63-tutor-virtual-foco)
  - [6.4. Herramientas Vocacionales y Academicas](#64-herramientas-vocacionales-y-academicas)
  - [6.5. Panel de Administracion](#65-panel-de-administracion)
- [7. Modelo de Negocio y Planes](#7-modelo-de-negocio-y-planes)
- [8. Seguridad y Reglas de Base de Datos](#8-seguridad-y-reglas-de-base-de-datos)
- [9. Modelo de Datos (Firestore)](#9-modelo-de-datos-firestore)
- [10. Guia de Inicio Rapido](#10-guia-de-inicio-rapido)
  - [10.1. Requisitos Previos](#101-requisitos-previos)
  - [10.2. Instalacion](#102-instalacion)
  - [10.3. Configuracion de Variables de Entorno](#103-configuracion-de-variables-de-entorno)
  - [10.4. Ejecucion en Desarrollo](#104-ejecucion-en-desarrollo)
- [11. Banco de Preguntas y Herramientas](#11-banco-de-preguntas-y-herramientas)
- [12. Entornos de Prueba y Modo Offline](#12-entornos-de-prueba-y-modo-offline)
- [13. Despliegue en Produccion](#13-despliegue-en-produccion)
- [14. Convenciones de Codigo](#14-convenciones-de-codigo)
- [15. Licencia y Creditos](#15-licencia-y-creditos)

---

## 1. Descripcion General

EstudiaUni.cl es un ecosistema educativo desarrollado para optimizar el rendimiento de estudiantes chilenos que rinden la PAES. El sistema resuelve las limitaciones de los preuniversitarios tradicionales combinando:

- **Estructura Pedagogica Incremental:** Curriculo organizado por materias, capitulos, secciones y evaluaciones formativas que guian al alumno paso a paso.
- **Simulacion Realista:** Pruebas cronometradas construidas sobre los facsimiles oficiales liberados por el DEMRE, respetando ponderaciones y tiempos exactos.
- **Retroalimentacion Inteligente:** Identificacion precisa de distractores y errores conceptuales mediante inteligencia artificial generativa.
- **Accesibilidad y Rendimiento:** Aplicacion web moderna con prerenderizado estatico (SSR) para rutas clave, diseno responsivo optimizado para moviles y soporte para herramientas de accesibilidad (modo dislexia, alto contraste, navegacion por teclado).

---

## 2. Caracteristicas Principales

- **Ruta Gamificada:** 8 materias oficiales con avance por niveles, desafios de jefe de capitulo ("Boss Levels") y minijuegos pedagogicos (clasificacion, completar oraciones, emparejar terminos, ordenamiento cronologico).
- **Simulacros Oficiales:** Ensayos completos DEMRE (procesos regular e invierno) con modos "Real" (condiciones de examen estricto) y "Asistido" (con pausa y asistencia guiada).
- **Mini Ensayos a la Medida:** Generacion dinamica de cuestionarios de 10, 20 o 30 preguntas focalizadas en ejes tematicos debiles, incluyendo un "Modo Mejorador" para repetir unicamente fallos anteriores.
- **Tutor IA "Foco":** Sistema multicontexto impulsado por Google Gemini 2.5 Flash con capacidad de vision artificial para interpretar diagramas, formulas y graficos escaneados de las pruebas reales.
- **Mente Veloz:** Minijuego de agilidad y calculo mental contrarreloj para agilizar el procesamiento numerico y verbal.
- **Buscador Vocacional "Encuentra tu Carrera":** Base de datos indexada con estadisticas oficiales de postulacion, aranceles, ingresos y ponderaciones del sistema de admision chileno.
- **Calculadora NEM y Ranking:** Computo homologado con las tablas de conversion oficiales del DEMRE para colegios Cientifico-Humanistas y Tecnico-Profesionales.
- **Panel Administrativo:** Suite interna para gestion de contenido, pool de preguntas, metricas de usuarios, aprobacion de transferencias bancarias y auditoria.

---

## 3. Arquitectura del Sistema

El proyecto opera como un monorepo modular disenado para separar responsabilidades de entrega estatica, consulta directa de datos y procesamiento seguro en backend.

### 3.1. Diagrama de Flujo y Componentes

```mermaid
flowchart TD
    subgraph Cliente ["Navegador del Estudiante"]
        App["Angular 18 SPA / SSR"]
        SignalsState["Gestion de Estado (Signals)"]
        Turnstile["Cloudflare Turnstile Widget"]
    end

    subgraph FirebaseInfra ["Firebase Platform"]
        FHosting["Firebase Hosting (CDN)"]
        FAuth["Firebase Auth (Email & Google)"]
        Firestore["Cloud Firestore (Base de Datos)"]
    end

    subgraph BackendServices ["Google Cloud Run (southamerica-west1)"]
        NestAPI["NestJS API (/api/**)"]
        AppCheckService["App Check Module"]
        AiService["AI Feedback (Gemini 2.5)"]
        PaymentService["Flow.cl & Subscripciones"]
        AdminService["Admin & Auditoria"]
    end

    subgraph ExternalServices ["Servicios Externos"]
        GeminiAPI["Google AI Studio (Gemini 2.5 Flash)"]
        FlowAPI["Pasarela Flow.cl"]
        CloudflareVerify["Cloudflare Siteverify API"]
    end

    App -->|Descarga inicial / SSR| FHosting
    App -->|Login / Sesion| FAuth
    App -->|Consultas directas: progreso, ensayos, perfil| Firestore

    App -->|Peticiones seguras /api/**| FHosting
    FHosting -->|Rewrite proxy| NestAPI

    Turnstile -->|Token de verificacion| AppCheckService
    AppCheckService -->|Valida sitekey| CloudflareVerify
    AppCheckService -->|Genera token App Check| FAuth

    AiService -->|Inferencia de prompts e imagenes| GeminiAPI
    PaymentService -->|Creacion de cobros y webhooks| FlowAPI
    AdminService -->|Admin SDK con permisos totales| Firestore
```

### 3.2. Patron de Comunicacion Hibrido

1. **Lectura y Escritura Directa en Firestore:**
   - La aplicacion Angular se conecta directamente a Cloud Firestore para perfiles de usuario, avance en materias, registro de actividades, lectura de ensayos y almacenamiento de intentos de examen.
   - La seguridad no reside en una capa intermediaria de software, sino en reglas declarativas en `firestore.rules` validadas por los propios servidores de Google.

2. **Servicios de Backend Especializados (NestJS en Cloud Run):**
   - El backend solo interviene en operaciones sensibles que demandan secretos de servidor o procesamiento de alto costo:
     - Orquestacion de prompts e inferencia en Google Gemini (`/api/ai/*`).
     - Creacion y confirmacion criptografica de pagos con Flow.cl (`/api/subscriptions/*`).
     - Emision de tokens de Firebase App Check con Cloudflare Turnstile (`/api/app-check/*`).
     - Control administrativo de usuarios, aprobacion de pagos y auditoria (`/api/admin/*`).

---

## 4. Pila Tecnologica

| Capa | Tecnologia | Version | Proposito |
|---|---|---|---|
| **Frontend** | Angular | 18.2.0 | Framework SPA reactivo basado en Standalone Components y Signals |
| **Frontend SSR** | @angular/ssr | 18.2.21 | Prerenderizado estatico para SEO en rutas publicas institucionales |
| **SDK Firebase** | @angular/fire / firebase | 18.0.1 / 10.14.1 | Autenticacion y conexion reactiva en tiempo real a Firestore |
| **Renderizado Matematico** | KaTeX | 0.16.45 | Renderizado nativo de formulas matematicas complejas (M1 y M2) |
| **Renderizado Markdown** | Marked | 17.0.5 | Formateo dinamico de respuestas pedagodicas del tutor IA |
| **Onboarding** | Driver.js | 1.4.0 | Tours guiados interactivos para nuevos estudiantes |
| **Backend** | NestJS | 10.4.0 | Framework modular en TypeScript para APIs REST estructuradas |
| **Inteligencia Artificial** | @google/generative-ai | 0.24.1 | Integracion con el modelo Google Gemini 2.5 Flash |
| **SDK Administrativo** | firebase-admin | 12.0.0 | Gestion de usuarios, App Check y Firestore con privilegios de sistema |
| **Rate Limiting** | @nestjs/throttler | 6.0.0 | Proteccion contra saturacion (60 peticiones/minuto global) |
| **Proteccion Anti-Bots** | Cloudflare Turnstile | v0 | Desafios invisibles sin friccion para verificacion de clientes |
| **Pasarela de Pagos** | Flow.cl | REST API | Procesamiento de pagos en Chile (Webpay, debito, credito) |
| **Hosting & Base de Datos** | Firebase / GCP | - | Firebase Hosting, Cloud Firestore y Google Cloud Run |

---

## 5. Estructura del Repositorio

```
estudiauni.cl/
|-- frontend-app/                     Aplicacion cliente en Angular 18
|   |-- src/
|   |   |-- app/
|   |   |   |-- core/                Servicios transversales, guards e interceptores
|   |   |   |   |-- guards/          authGuard, adminGuard, emailVerifiedGuard
|   |   |   |   `-- services/        firestore, auth, ai-assist, dashboard, seo, toast
|   |   |   |-- features/            Modulos funcionales de la plataforma
|   |   |   |   |-- admin/           Panel administrativo unificado y submodulos
|   |   |   |   |-- auth/            Home/Landing, login, registro, verificacion de email
|   |   |   |   |-- career-finder/   Buscador vocacional y chat con Foco
|   |   |   |   |-- dashboard/       Panel del estudiante, metas PAES y rachas
|   |   |   |   |-- dev/             Harness de pruebas aislado (/dev/ruta)
|   |   |   |   |-- learning-path/   Ruta de aprendizaje, nodos, practicas y KaTeX
|   |   |   |   |-- mente-veloz/     Juego de velocidad numerica contrarreloj
|   |   |   |   |-- mini-ensayos/    Generador y runner de mini evaluaciones
|   |   |   |   |-- nem-calculator/  Calculadora oficial de NEM y puntaje ranking
|   |   |   |   |-- payment/         Modal de checkout y confirmacion de Flow
|   |   |   |   |-- recursos/        Biblioteca de guias, libros y material de estudio
|   |   |   |   `-- simulations/     Ensayos PAES oficiales (runner y revision)
|   |   |   `-- shared/              Componentes visuales y layouts compartidos
|   |   |-- assets/                  Bases de datos JSON de facsimiles y recursos multimedia
|   |   |-- environments/            Variables de configuracion (produccion y desarrollo)
|   |   `-- prerender-routes.txt     Rutas estaticas prerenderizadas para Googlebot
|   `-- angular.json                 Configuracion del build y optimizacion de empaquetado
|
|-- backend/                          API REST en NestJS 10
|   |-- src/
|   |   |-- admin/                   Endpoints protegidos para administradores
|   |   |-- ai-feedback/             Orquestacion de Google Gemini, prompts y vision
|   |   |-- app-check/               Validador de Turnstile y emisor de tokens App Check
|   |   |-- common/                  Guards globales (Throttler, FirebaseAuthGuard)
|   |   |-- firebase/                Inicializador del SDK de Firebase Admin
|   |   |-- subscriptions/           Integracion con Flow.cl, pases PRO y transferencias
|   |   `-- users/                   Servicio de usuarios y perfiles
|   `-- .env.example                 Plantilla de variables de entorno de servidor
|
|-- content/                          Fuente de verdad versionada de contenidos
|   `-- pool-preguntas/              Bancos JSON estructurados por materia y eje tematico
|
|-- tools/                            Herramientas de soporte y mantenimiento
|   |-- pool-preguntas/              Scripts de validacion, balance y subida a Firestore
|   `-- meta/                        Compilador de resumenes de conteo (build-meta.js)
|
|-- firestore.rules                   Politicas de seguridad y permisos de Cloud Firestore
|-- firestore.indexes.json            Indices compuestos para consultas ordenadas
|-- firebase.json                     Reglas de Hosting, caching y enrutamiento hacia Cloud Run
|-- actualizar.bat                    Script de despliegue del frontend a Firebase Hosting
`-- desplegar-backend.bat             Script de despliegue del backend a Google Cloud Run
```

---

## 6. Modulos y Funcionalidades en Detalle

### 6.1. Ruta de Aprendizaje
Organizada bajo el curriculo vigente del DEMRE en cuatro niveles: **Materia -> Capitulo -> Seccion -> Test**.

- **8 Materias Disponibles:** Competencia Lectora, M1, M2, Biologia, Fisica, Quimica, Ciencias TP e Historia.
- **Tipos de Nodos:**
  - *Guias en Diapositivas:* Sintesis teorica paso a paso para lectura rapida.
  - *Minijuegos Didacticos:* Clasificacion semantica, seleccion de sinonimos, completar oraciones, emparejamiento conceptual y preguntas rapidas.
  - *Fórmulas con KaTeX:* Representacion grafica fiel de expresiones algebraicas y modelos fisicos.
  - *Jefes de Capitulo:* Evaluaciones acumulativas que habilitan el desbloqueo del siguiente capitulo.

### 6.2. Ensayos PAES Oficiales y Mini Ensayos
- **Simulacros Oficiales:** Pruebas reales digitalizadas con dos modalidades:
  - *Modo Real:* Temporizador inexorable con condiciones oficiales, sin pausas ni ayudas externas. Al concluir, los resultados pasan por un periodo de retencion para usuarios del plan gratuito y se aplica un periodo de descanso (cooldown) de 48 horas.
  - *Modo Asistido:* Flexibilidad horaria, posibilidad de guardar el avance y boton de consulta asistida a Foco.
- **Mini Ensayos:** Cuestionarios tematicos de extension reducida (10 a 30 preguntas) para sesiones rapidas de estudio.
- **Modo Mejorador:** Algoritmo que filtra los errores cometidos en ensayos previos para transformarlos en una sesion de refuerzo correctivo.

### 6.3. Tutor Virtual Foco
Foco es la mascota y tutor de la plataforma, dotado de una personalidad empatica inspirada en el contexto estudiantil chileno. Emplea el modelo `gemini-2.5-flash` con prompts estrictamente aislados:

- **Prompt Asistente en Examen:** Solo aporta preguntas de andamiaje, pistas metodologicas y recordatorios teoricos. Tiene terminantemente vetado revelar la alternativa correcta o descartar opciones explicitamente.
- **Prompt de Revision Post-Entrega:** Analiza la prueba ya calificada. Informa la clave correcta, detalla la resolucion paso a paso y desglosa minuciosamente el error de razonamiento que justificaba la alternativa fallada por el estudiante.
- **Soporte de Vision:** Al procesar preguntas digitalizadas de ensayos DEMRE, el sistema adjunta directamente la captura grafica original para que el modelo interprete figuras, tablas y expresiones matematicas sin deformaciones de OCR.

### 6.4. Herramientas Vocacionales y Academicas
- **Mente Veloz:** Dinamica de alta intensidad con temporizador regressivo de 60 o 180 segundos. Registra marcas historicas de desempeno en almacenamiento local.
- **Encuentra tu Carrera:** Buscador universitario conectado a los registros oficiales de matricula y ponderaciones de universidades chilenas, asistido por un consultor vocacional de orientacion.
- **Calculadora NEM y Ranking:** Computa el promedio de ensenanza media (1° a 4° medio) truncado a dos decimales y calcula el puntaje oficial correspondiente a la tabla DEMRE del tipo de colegio del estudiante.
- **Recursos Adicionales:** Repositorio digital ordenado por formato (guias PDF, clases en video, lecturas y resumenes sinteticos).

### 6.5. Panel de Administracion
Modulo de acceso restringido para directores y editores de la plataforma:
- Inspeccion, edicion y creacion de reactivos del pool de preguntas.
- Visualizacion del padron de usuarios registrados con buscador en tiempo real.
- Asignacion manual, extension temporal o anulacion de membresias PRO.
- Bandeja de aprobacion de transferencias bancarias con previsualizacion de comprobantes.
- Publicador de avisos y novedades del carrusel del home (`news`).
- Registro y clasificacion de reportes de bugs informados por los alumnos.

---

## 7. Modelo de Negocio y Planes

El sistema cuenta con dos modalidades de servicio disenadas para equilibrar sostenibilidad y acceso:

| Caracteristica | Plan Basico (Gratis) | Plan PRO (Membresia por Pases) |
|---|---|---|
| **Precio** | $0 CLP | $9.990 CLP (1 mes) / $69.990 CLP (1 ano) |
| **Modalidad de Cobro** | Sin costo | Pago unico no recurrente (sin cargos sorpresa) |
| **Ruta de Aprendizaje** | Solo Capitulo 1 de cada materia | Acceso completo e ilimitado a las 8 materias |
| **Ensayos PAES Reales** | 1 ensayo cada 48 horas (cooldown) | Ilimitados y sin tiempo de espera |
| **Entrega de Resultados** | Retenidos durante 3 horas post-entrega | Inmediata con solucionario detallado |
| **Consultas a Tutor Foco**| 5 fichas de interaccion diarias | 500 fichas de interaccion diarias |
| **Mente Veloz** | 3 sesiones diarias en materias basicas | Sesiones ilimitadas en todas las asignaturas |
| **Mini Ensayos** | Limitados a disponibilidad diaria | Cuestionarios y Modo Mejorador ilimitados |
| **Acumulacion de Tiempo** | No aplica | Los nuevos pases suman dias al saldo vigente |

---

## 8. Seguridad y Reglas de Base de Datos

La integridad del sistema se respalda en reglas declarativas en `firestore.rules`:

- **Prevencion de Escalada de Privilegios:** La creacion o actualizacion de perfiles de usuario en `users/{uid}` prohibe mutaciones del campo `plan`, `subscription` o `dailyCredits`. Solo el backend mediante el SDK de Firebase Admin posee autoridad para alterar esos atributos.
- **Verificacion Temporal de Cooldowns:** El campo `lastSimulationFinishedAt` exige una ventana de validacion de tiempo respecto al reloj del servidor (-10 minutos a +2 minutos), bloqueando modificaciones fraudulentas destinadas a eludir el periodo de espera de 48 horas.
- **Validacion de Retencion de Resultados:** Al concluir un intento en `intentos/{id}`, el servidor de reglas comprueba si el usuario cuenta con membresia activa. En cuentas gratuitas, se exige forzosamente que `resultsAvailableAt >= finishedAt + 3h`.
- **Inmutabilidad de Intentos:** Los registros de examenes finalizados o abandonados no pueden eliminarse ni sobrescribirse.
- **Proteccion Anti-Bots con Cloudflare Turnstile:** Integracion personalizada de Firebase App Check sin dependencias de extensiones obsoletas, mitigando intentos de scraping o ejecucion automatizada de llamadas al backend.

---

## 9. Modelo de Datos (Firestore)

Principales colecciones que componen la base de datos de la plataforma:

```
Cloud Firestore
|-- users/                           Documentos de perfil del estudiante
|   `-- {uid}/
|       |-- plan, subscription       Nivel de acceso y fecha de vencimiento
|       |-- dailyCredits             Fichas Foco y cuotas de uso diario
|       `-- actividad/{id}           Historial de sesiones y calculo de rachas
|
|-- ensayos/{ensayoId}               Metadatos de ensayos oficiales DEMRE
|-- preguntas/{preguntaId}           Reactivos de los ensayos oficiales
|-- pool_preguntas/{preguntaId}      Banco para Mini Ensayos y Mente Veloz
|-- pool_preguntas_meta/summary      Conteo consolidado de reactivos por tema
|
|-- lp_materias/{materiaId}          Materias principales de la Ruta
|-- lp_capitulos/{capituloId}        Capitulos de contenido curricular
|   `-- secciones/{seccionId}        Subcoleccion: guias, practicas y teoria
|-- lp_tests/{testId}                Evaluaciones de cierre de seccion
|
|-- intentos/{intentoId}             Sesiones de examen (propiedad: campo odId)
|-- recursos_adicionales/{recursoId} Documentos y enlaces de estudio
|-- news/{newsId}                    Noticias publicas del home
|-- bug_reports/{reportId}           Reportes de error enviados por usuarios
`-- admins/{adminId}                 Lista blanca de UIDs con rol administrativo
```

---

## 10. Guia de Inicio Rapido

### 10.1. Requisitos Previos
- **Node.js:** Version 20 LTS o superior.
- **npm:** Version 10 o superior.
- **Firebase CLI:** Instalado globalmente (`npm install -g firebase-tools`).
- **Google Cloud SDK:** Requerido unicamente si se realizan despliegues del backend a Cloud Run.

### 10.2. Instalacion

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/estudiauni.cl.git
   cd estudiauni.cl
   ```

2. Instalar dependencias en todos los paquetes del monorepo:
   ```bash
   npm run install:all
   ```

### 10.3. Configuracion de Variables de Entorno

#### Backend (`backend/.env`)
Crear el archivo `backend/.env` tomando como referencia `backend/.env.example`:

```env
# Firebase Admin Credentials
FIREBASE_PROJECT_ID=estudiauni
FIREBASE_CLIENT_EMAIL=tu-cuenta-de-servicio@estudiauni.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Inteligencia Artificial
GEMINI_API_KEY=tu_api_key_de_google_ai_studio

# Pasarela Flow (Entorno Sandbox para desarrollo)
FLOW_ENVIRONMENT=sandbox
FLOW_API_KEY=tu_flow_api_key
FLOW_SECRET_KEY=tu_flow_secret_key
BACKEND_PUBLIC_URL=https://tu-tunel-cloudflared.com

# App Check & Turnstile
TURNSTILE_SECRET_KEY=0x4AAAAAA...
FIREBASE_APP_ID=1:976475724065:web:586b9c2609d84674158660

# Servidor Local
PORT=3000
FRONTEND_APP_URL=http://localhost:4200
```

#### Frontend (`frontend-app/src/environments/`)
- `environment.development.ts`: Apunta `apiUrl` a `http://localhost:3000` con `appCheckEnabled: false` para evitar bloqueos en pruebas locales.
- `environment.ts`: Configurado para produccion apuntando a `https://estudiauni.cl` con `appCheckEnabled: true`.

### 10.4. Ejecucion en Desarrollo

Abrir dos terminales para ejecutar ambos servicios simultaneamente:

- **Terminal 1: Servidor de Backend (NestJS)**
  ```bash
  npm run dev:backend
  ```
  *La API iniciara en `http://localhost:3000/api` con recarga automatica.*

- **Terminal 2: Servidor de Frontend (Angular)**
  ```bash
  npm run dev:app
  ```
  *La aplicacion web estara disponible en `http://localhost:4200`.*

---

## 11. Banco de Preguntas y Herramientas

La fuente de verdad del banco de preguntas no reside exclusivamente en la nube, sino en archivos versionados en `content/pool-preguntas/<materiaId>/<tema>.json`.

### Flujo de Trabajo para Nuevas Preguntas

1. **Validacion de Sintaxis y Reglas:**
   Verifica que los reactivos cuenten con identificadores unicos, alternativas completas y retroalimentacion pedagogica:
   ```bash
   node tools/pool-preguntas/build.js --check
   ```

2. **Verificacion de Cobertura Tematica:**
   Comprueba que cada tema posea al menos 30 preguntas para alimentar adecuadamente a los Mini Ensayos y Mente Veloz:
   ```bash
   node tools/pool-preguntas/verificar-modulos.js
   ```

3. **Carga Sincronizada a Firestore:**
   Sube las preguntas al entorno de produccion de forma idempotente:
   ```bash
   node tools/pool-preguntas/upload.js --commit
   ```

4. **Regeneracion de Metadatos:**
   Actualiza el documento `pool_preguntas_meta/summary` con los nuevos totales por materia:
   ```bash
   node tools/meta/build-meta.js --commit
   ```

---

## 12. Entornos de Prueba y Modo Offline

### 12.1. Modo Mocks Locales (Sin Consumo de Cuota Firebase)
Para sesiones intensivas de desarrollo sin alterar la base de datos ni agotar cuotas gratuitas:
1. Abrir la consola de desarrollo en el navegador (`F12`) en `http://localhost:4200`.
2. Activar la bandera de almacenamiento:
   ```javascript
   localStorage.setItem('USE_LOCAL_MOCKS', 'true');
   location.reload();
   ```
   *El servicio `PaesContentService` conmutara para leer archivos JSON locales desde `src/assets/mocks/`.*
3. Para regresar a la conexion en vivo con Firestore:
   ```javascript
   localStorage.removeItem('USE_LOCAL_MOCKS');
   location.reload();
   ```

### 12.2. Banco de Pruebas Aislado de la Ruta (`/dev/ruta`)
Permite inspeccionar y depurar visualmente cualquier nodo de la Ruta de Aprendizaje simulando diferentes estados de usuario sin requerir autenticacion en la base de datos:
```
http://localhost:4200/dev/ruta/comp-lectora?materia=comp-lectora&plan=free
```
*Parametros de plan admitidos en la URL: `free`, `pro`, `admin`.*

---

## 13. Despliegue en Produccion

### 13.1. Frontend a Firebase Hosting
La publicacion del cliente web estatico y prerenderizado se realiza mediante el script automatizado para Windows:

```cmd
actualizar.bat
```
El asistente ofrece:
- **Modo Vista Previa:** Publica en un canal de prelanzamiento temporal para verificar el empaquetado antes del lanzamiento.
- **Modo Produccion:** Actualiza el sitio oficial `https://estudiauni.cl`.

Para desplegar unicamente las politicas de seguridad e indices de base de datos:
```bash
npm run deploy:firestore
```

### 13.2. Backend a Google Cloud Run
El despliegue de la API de NestJS se ejecuta con el script dedicado:

```cmd
desplegar-backend.bat
```
El procedimiento empaqueta `backend/`, inyecta las variables de produccion de forma protegida y publica el contenedor en la region `southamerica-west1` (Santiago de Chile). Las peticiones hacia `https://estudiauni.cl/api/**` son canalizadas directamente a Cloud Run por las directivas de Firebase Hosting.

---

## 14. Convenciones de Codigo

- **Dominio en Espanol:** La nomenclatura de negocio y variables de modelo educativo respetan el espanol chileno (`Materia`, `Capitulo`, `Seccion`, `Pregunta`, `Intento`, `enunciado`, `alternativas`). Los comentarios tecnicos y patrones arquitectonicos pueden redactarse en ingles o espanol.
- **Aislamiento de Estilos CSS:** Para evitar que reglas globales de `styles.css` colisionen con componentes de administracion u otras vistas, los selectores de modulos especificos deben utilizar prefijos claros (por ejemplo, `.admin-sidebar`, `.admin-main-content`).
- **Restriccion Visual:** Se prohibe el empleo de emojis nativos en elementos de interfaz de usuario. Las iconografias deben provenir exclusivamente de recursos vectoriales SVG inline o archivos AVIF optimizados en `assets/images/`.

---

## 15. Licencia y Creditos

Propiedad exclusiva de EstudiaUni.cl y MaltSolutions. Todos los derechos reservados.

El contenido curricular, facsimiles y reactivos oficiales son adaptaciones didacticas basadas en las publicaciones publicas de caracter informativo emitidas por el DEMRE y el Ministerio de Educacion de Chile.
