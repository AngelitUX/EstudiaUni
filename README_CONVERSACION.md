# Resumen de conversacion (mocks, guias y Firebase)

Este archivo resume los cambios, hallazgos y pasos para volver a la normalidad.

## 1) Objetivo de trabajo
- Migrar guias interactivas tipo carrusel (Lenguaje) a Matemáticas M1/M2.
- Preparar mockups para Fisica (Ciencias) con capitulos, pasos y placeholders.
- Evitar cambios permanentes en Lenguaje y mantener compatibilidad.

## 2) Cambios realizados (codigo)
- Se agrego soporte para guias tipo carrusel en M1/M2 desde `secciones`.
- Se introdujo logica para que `cap-localizar` use `guide-slides-data.ts` local.
- Se agrego render KaTeX y HTML en slides para que aparezcan etiquetas y formulas.

Archivos relevantes:
- frontend-app/src/app/features/learning-path/capitulo-detail.component.ts
- frontend-app/src/app/features/learning-path/guide-slides.component.ts
- frontend-app/src/app/features/learning-path/guide-slides-data.ts

## 3) Mockups de Fisica
- Se agregaron 4 capitulos de Fisica con pasos y preguntas placeholder.
- Los datos quedaron en:
  - frontend-app/src/assets/mocks/capitulos-mock-local.json

## 4) Firebase (estado actual)
- Se llego a subir `slides` y `quizzes` a Firestore en `lp_capitulos` para pruebas.
- Se ejecuto rollback eliminando `slides` y `quizzes` de:
  - cap-m1-1-numeros
  - cap-localizar
- Esto restauro la base de datos a su estado original en esos campos.

## 5) Volver a la normalidad
Si se necesita volver al flujo normal (Firestore):
- Restablecer la carga por defecto a Firestore en `PaesContentService`.
- Usar el flag `USE_LOCAL_MOCKS=true` solo cuando se quiera trabajar con mockups.

## 6) Diagnostico actual (Fisica no muestra pasos)
- La UI muestra 4 capitulos pero 0 lecciones.
- Eso indica que los capitulos se detectan, pero `secciones` llega vacio.
- Las causas mas probables:
  - La app no esta leyendo `capitulos-mock-local.json` actualizado.
  - Se esta usando un cache viejo o se esta cargando Firestore en vez de mocks.

## 7) Proxima accion recomendada
- Confirmar que el flag `USE_LOCAL_MOCKS` este activo cuando se quieran ver mockups.
- Verificar que la carga de mocks no sea reemplazada por Firestore durante auth.
- Revisar el formato de M1/M2 (ruta) para replicar presentacion en Fisica.
