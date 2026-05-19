# EstudiaUni.cl - Guía de Pruebas y Sincronización a Firestore

Esta guía explica el modelo de pruebas de la aplicación, el cual se conecta directamente a la base de datos en la nube en **Firebase Firestore** por defecto, y detalla el uso del **Método B** (Mocks Locales) para desarrollo aislado u offline.

---

## ☁️ Conexión por Defecto: Firebase Firestore

La aplicación está configurada por defecto para realizar consultas directas y reactivas a Firebase Firestore. Esto permite que cualquier cambio en la base de datos remota se refleje de manera inmediata en la interfaz.

### Sincronización y Siembra de Datos (Backend a Firestore)
Para sincronizar y poblar de forma masiva las materias, capítulos, secciones y cuestionarios de Matemática 1 (M1) y Matemática 2 (M2) desde los archivos estáticos a Firestore, se utiliza el script de siembra del backend:

```bash
# Navegar a la carpeta del backend
cd estudiauni.cl/backend

# Ejecutar la sincronización masiva
node scratch/push-mock-to-firestore.js
```

> [!WARNING]
> **Saneamiento Automático:** Este script limpia las colecciones y subcolecciones previas de `lp_materias` y `lp_capitulos` para evitar duplicidad y asegurar que la estructura esté 100% limpia y consistente en la base de datos remota.

---

## 🛠️ Método B: Mocks Locales (Desarrollo Aislado)

Para no saturar las cuotas de lectura/escritura de Firebase, o para desarrollar de forma aislada en "modo avión" o sin conexión, implementamos un interruptor inteligente en el servicio `PaesContentService` que carga archivos JSON locales asíncronamente desde `frontend-app/src/assets/mocks/`.

### 🌟 Beneficios:
1. **Compilación 100% Segura:** Al cargarse de forma dinámica por `fetch` en ejecución, no hay importaciones estáticas de TypeScript que rompan el CI/CD si no tienes los archivos locales creados.
2. **Aislamiento Total:** Modificas tus preguntas y pruebas flujos locales sin alterar la base de datos remota de Firebase.
3. **Cero Consumo de Cuota:** Ideal para sesiones intensivas de testeo.

---

## 🚦 Guía para Activar / Desactivar el Modo de Pruebas Locales (Mocks)

Para alternar entre la base de datos en tiempo real (por defecto) y los mocks locales, simplemente ejecuta una línea en la consola de tu navegador (`F12` -> pestaña **Consola**):

### Activar Mocks Locales:
```javascript
localStorage.setItem('USE_LOCAL_MOCKS', 'true'); location.reload();
```

### Desactivar Mocks y Volver a Firebase Firestore (Predeterminado):
```javascript
localStorage.removeItem('USE_LOCAL_MOCKS'); location.reload();
```

---

## 📂 Directorio y Archivos del Método B

Toda la lógica y los datos locales de prueba se organizan en:
*   **Ruta del Directorio:** `frontend-app/src/assets/mocks/`
*   **Patrón en `.gitignore`:** `*-mock-local.json` (para evitar subidas accidentales al repositorio)

### Archivos de Mock:
1.  **`materias-mock-local.json`**: Estructura de materias activa para pruebas locales.
2.  **`capitulos-mock-local.json`**: Estructura de capítulos, secciones, guías e introducciones y preguntas.

---

## 🤖 Guía e Instrucciones para Antigravity (AI Copilot)

> [!NOTE]
> Reglas internas para Antigravity cuando trabaje en la generación de contenidos y pruebas.

### Cuando Desarrolles Preguntas:
1. **Edición:** Escribe el contenido nuevo de las guías y preguntas únicamente en los archivos de la carpeta `frontend-app/src/assets/mocks/` bajo el patrón `*-mock-local.json`.
2. **Validación:** Comprueba que la app compila limpia y funciona activando `USE_LOCAL_MOCKS = true` en tu navegador/consola de pruebas.
3. **Persistencia:** Nunca elimines la regla de exclusión de Git de `*-mock-local.json`.

### Cuando el Usuario Diga "Es Momento de Subir Todo a Firebase":
1. **Ejecutar Semilla:** Corre la sincronización masiva ejecutando:
   `node estudiauni.cl/backend/scratch/push-mock-to-firestore.js`
2. **Limpiar Bandera:** Asegúrate de que `PaesContentService` y tu navegador local estén apuntando a Firestore desactivando/limpiando `USE_LOCAL_MOCKS`.
