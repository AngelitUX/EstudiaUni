/**
 * Caché con vencimiento sobre `sessionStorage`.
 *
 * Extraído de `FirestoreService` para poder testearlo sin arrastrar AngularFire:
 * el constructor del servicio necesita el contexto real de la librería, que en
 * un test headless se queda colgado inicializando la persistencia de Auth.
 *
 * Cada entrada guarda `{ data, cachedAt }`. Ante cualquier problema (storage no
 * disponible por navegación privada, cuota llena, JSON corrupto) se degrada a
 * "sin caché" en vez de lanzar: perder la caché solo cuesta lecturas, romper la
 * app cuesta al usuario.
 */

export interface CacheEnvelope<T> {
  data: T;
  cachedAt: number;
}

/** Devuelve el contenido si sigue vigente; `null` si falta, venció o es ilegible. */
export function readSessionCache<T>(key: string, ttlMs: number, now = Date.now()): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<CacheEnvelope<T>>;
    if (!parsed || typeof parsed.cachedAt !== 'number') return null;

    // Un `cachedAt` en el futuro delata un reloj cambiado o una entrada
    // manipulada: se descarta en vez de darla por válida para siempre.
    if (parsed.cachedAt > now) return null;
    if (now - parsed.cachedAt > ttlMs) return null;

    return (parsed.data ?? null) as T | null;
  } catch {
    return null;
  }
}

/** Guarda el valor con marca de tiempo. Nunca lanza. */
export function writeSessionCache(key: string, data: unknown, now = Date.now()): void {
  try {
    sessionStorage.setItem(key, JSON.stringify({ data, cachedAt: now }));
  } catch {
    // sessionStorage no disponible o sin espacio: seguimos sin caché.
  }
}

/** Borra una entrada. Nunca lanza. */
export function clearSessionCache(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch {
    /* nada que hacer */
  }
}
