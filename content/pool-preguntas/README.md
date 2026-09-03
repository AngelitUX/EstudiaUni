# Banco de preguntas (`pool_preguntas`)

Fuente de verdad **versionada** del banco de preguntas que alimenta Mini Ensayos,
Mente Veloz y el Modo Infinito. Firestore es la copia que consume la app en
producción; este directorio es de dónde sale esa copia.

## Por qué el contenido vive acá y no solo en Firestore

- Se puede revisar en un *code review* y volver atrás con `git revert`.
- Se valida automáticamente antes de subir (ver más abajo), así que no se
  descubren errores de formato recién cuando un estudiante se topa con ellos.
- No depende de que alguien recuerde qué se cargó a mano por el panel admin.

## Estructura

```
content/pool-preguntas/<materiaId>/<tema>.json
```

Cada archivo es un array de preguntas del mismo `materiaId` y `tema`. Los `id`
son deterministas (`pp-<materia>-<tema>-NNN`), lo que hace que subir dos veces
sea idempotente: se actualiza el mismo documento en vez de duplicarlo.

## Reglas del formato

El validador aplica **las mismas reglas que el importador JSON del panel admin**
(`validateAndImport()` en `admin-panel.component.ts`), más algunas de calidad:

| Campo | Regla |
|---|---|
| `materiaId` | Uno de los 8 ids válidos (ver `tools/pool-preguntas/schema.js`) |
| `tema` | **Exactamente** uno de los temas de `AdminService.temasPorMateria` |
| `alternativas` | Las cuatro llaves `A`, `B`, `C`, `D`, no vacías y distintas entre sí |
| `respuesta_correcta` | `A`, `B`, `C` o `D` |
| `feedback_acierto` | Explica **por qué** la respuesta es correcta |
| `feedback_error` | Da una pista **sin revelar** la alternativa correcta |
| `preambulo_texto` | Texto de apoyo (obligatorio en la práctica para Competencia Lectora) |
| `formula_latex` | Ver la advertencia de abajo |

### ⚠️ `formula_latex` tiene que ser legible sin renderizar

El runner de Mini Ensayo y el Modo Infinito pasan este campo por KaTeX, pero
**Mente Veloz lo imprime tal cual dentro de un `<code>`**
(`mente-veloz.component.ts`, ~línea 344). Por eso el validador rechaza `\frac`,
`\sqrt`, `\begin` y similares: en Mente Veloz el estudiante vería el código
crudo. Usa notación plana (`x^2`, `3/4`, `(a+b)/2`), que se ve bien en los tres.

### Cuántas preguntas por tema

**45**, y el mínimo real es 30: Mini Ensayo permite pedir 30 preguntas y el
estudiante puede marcar **un solo tema**, así que con menos de 30 la sesión se
recortaría sola (`generateSession()` ajusta `questionCount` a la baja). Las 15
adicionales dan variedad para quien repite el mismo tema.

## Comandos

```bash
node tools/pool-preguntas/build.js --check
```

Valida todo el contenido sin escribir nada. Informa además la distribución de la
letra correcta por tema.

```bash
node tools/pool-preguntas/build.js
```

Valida y genera `frontend-app/src/assets/mocks/pool-preguntas-mock-local.json`,
el mock que usa la app con `USE_LOCAL_MOCKS` activo. Ese archivo **no va en git**
(cae en el patrón `*-mock-local.json` del `.gitignore`): lo versionado es la
fuente, no el artefacto.

```bash
node tools/pool-preguntas/verificar-modulos.js
```

Comprueba que el banco alcanza para los tres módulos que lo consumen,
replicando su lógica de filtrado real (materia, tema y ejes del Modo Infinito).

```bash
node tools/pool-preguntas/rebalance.js --check
```

Informa si alguna letra concentra demasiadas respuestas correctas dentro de un
tema. Sin `--check` corrige los desbalances intercambiando alternativas, y
**nunca toca preguntas cuyas alternativas forman una secuencia numérica
ordenada**, porque ahí el orden es información para el estudiante.

```bash
node tools/pool-preguntas/upload.js            # simulación, no escribe
node tools/pool-preguntas/upload.js --commit   # escribe en Firestore
```

Sube el contenido a la colección `pool_preguntas`. Ver las garantías en la
cabecera del propio script: solo toca esa colección, nunca borra documentos, y
**se salta cualquier documento cuyo `createdBy` no sea el de esta tanda**, de
modo que las preguntas cargadas antes por el panel admin quedan intactas.

```bash
node tools/pool-preguntas/adoptar.js <id> [<id>...]            # simulación
node tools/pool-preguntas/adoptar.js <id> [<id>...] --commit   # escribe
```

La excepción explícita a esa protección, para **corregir una pregunta antigua**
(cargada a mano por el panel) desde la fuente versionada. Solo toca los ids que
se le pasen, exige que el id ya exista en `content/` y pase el validador,
conserva el `createdAt` original e imprime el antes/después campo por campo.
Tras adoptarla, `upload.js` la administra como una más.

## Probarlo sin subir nada

```javascript
// en la consola del navegador
localStorage.setItem('USE_LOCAL_MOCKS', 'true'); location.reload();
```

Con el mock generado y ese flag, `/dev/mini-ensayo` monta el módulo real sin
necesidad de iniciar sesión (solo en desarrollo, ver `app.routes.dev.ts`).
Para volver a Firestore: `localStorage.removeItem('USE_LOCAL_MOCKS')`.

## Al agregar preguntas nuevas

1. Respetar el `tema` exacto: si no coincide con `AdminService.temasPorMateria`,
   la pregunta se guarda igual pero **no aparece en el selector de Mini Ensayos**.
2. Correr `build.js --check` antes de subir.
3. Recordar que la app cachea el pool 6 horas (`CONTENT_CACHE_TTL_MS`). Para ver
   el cambio al instante: botón "Actualizar Datos" del panel admin, o borrar
   `pool_preguntas_cache` de `localStorage`.
