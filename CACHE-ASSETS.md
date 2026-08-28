# Por que las imagenes NO estan cacheadas a 1 año

Una auditoria de PageSpeed (2026-08-27) recomienda subir el `Cache-Control` de las imagenes a
`max-age=31536000, immutable`, igual que ya esta el JS/CSS/fuentes. **No se hizo, a proposito.**

`immutable` con un año solo es seguro cuando el nombre del archivo cambia si cambia el contenido.
Eso se cumple para el JS y el CSS, porque Angular les pone un hash de contenido en el nombre
(`outputHashing: "all"` en `angular.json` → `main-IDQFTNQW.js`). **No se cumple para nada de
`src/assets/`**: Angular copia esos archivos tal cual, con su nombre original. Si alguien reemplaza
`P_MiniEnsayos.avif` por una version nueva, el nombre no cambia — y con un año de `immutable`,
todo visitante recurrente seguiria viendo la imagen vieja hasta 12 meses, sin forma de forzar la
actualizacion salvo renombrar el archivo y todas sus referencias.

El mismo problema ya esta documentado para las fuentes en `CLAUDE.md` (bitacora 2026-08-26 parte 2),
donde se resolvio con un sufijo de version manual en el nombre (`inter-latin-v1.woff2`). Por eso las
fuentes SI pueden ir a un año y las imagenes no.

## Lo que se aplico en su lugar

```
public, max-age=2592000, stale-while-revalidate=604800
```

30 dias de cache fresca, y durante 7 dias mas el navegador sirve la copia vieja al instante mientras
revalida en segundo plano. Para un visitante recurrente el efecto percibido es casi el mismo que el
de un año, pero una imagen reemplazada se propaga en dias, no en meses.

## Si en el futuro se quiere el año completo

Hay que versionar los nombres primero. Dos caminos:

1. **Manual**, como se hizo con las fuentes: `P_MiniEnsayos-v1.avif`, y subir el numero al
   reemplazar el archivo. Simple, pero hay que acordarse de actualizar cada referencia.
2. **Automatico**, moviendo esos assets fuera de `src/assets/` para que pasen por el pipeline de
   Angular y reciban hash. Es mas invasivo: cambia como se referencian desde el CSS y los templates.

Mientras no se haga ninguna de las dos, subir este valor a un año es un bug esperando a ocurrir.
