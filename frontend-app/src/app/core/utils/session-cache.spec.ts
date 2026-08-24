import { readSessionCache, writeSessionCache, clearSessionCache } from './session-cache';

/**
 * Estas cachés son las que evitan releer colecciones enteras de Firestore en
 * cada visita (catálogo de ensayos, noticias, recursos). Si se rompen, nada
 * falla a la vista: solo se dispara el consumo de la cuota. De ahí los tests.
 */
describe('session-cache', () => {
  const KEY = 'test_cache_key';
  const UNA_HORA = 60 * 60 * 1000;

  beforeEach(() => sessionStorage.clear());
  afterEach(() => sessionStorage.clear());

  it('devuelve lo guardado mientras esté vigente', () => {
    writeSessionCache(KEY, [{ id: 'e1' }]);
    expect(readSessionCache<any[]>(KEY, UNA_HORA)).toEqual([{ id: 'e1' }]);
  });

  it('devuelve null si la clave no existe', () => {
    expect(readSessionCache(KEY, UNA_HORA)).toBeNull();
  });

  it('descarta una entrada vencida', () => {
    const hace3h = Date.now() - 3 * UNA_HORA;
    writeSessionCache(KEY, ['algo'], hace3h);
    expect(readSessionCache(KEY, UNA_HORA)).toBeNull();
  });

  it('acepta una entrada justo dentro del límite', () => {
    const ahora = Date.now();
    writeSessionCache(KEY, ['algo'], ahora - (UNA_HORA - 1000));
    expect(readSessionCache(KEY, UNA_HORA, ahora)).toEqual(['algo']);
  });

  it('descarta JSON corrupto sin lanzar', () => {
    sessionStorage.setItem(KEY, '{ esto no es json');
    expect(() => readSessionCache(KEY, UNA_HORA)).not.toThrow();
    expect(readSessionCache(KEY, UNA_HORA)).toBeNull();
  });

  it('descarta una entrada sin marca de tiempo', () => {
    sessionStorage.setItem(KEY, JSON.stringify({ data: ['x'] }));
    expect(readSessionCache(KEY, UNA_HORA)).toBeNull();
  });

  it('descarta una marca de tiempo en el futuro (reloj movido o manipulación)', () => {
    const ahora = Date.now();
    writeSessionCache(KEY, ['algo'], ahora + 10 * UNA_HORA);
    expect(readSessionCache(KEY, UNA_HORA, ahora)).toBeNull();
  });

  it('conserva el tipo de los datos guardados', () => {
    writeSessionCache(KEY, { total: 3, items: ['a', 'b'] });
    const leido = readSessionCache<{ total: number; items: string[] }>(KEY, UNA_HORA);
    expect(leido?.total).toBe(3);
    expect(leido?.items.length).toBe(2);
  });

  it('clearSessionCache borra la entrada', () => {
    writeSessionCache(KEY, ['algo']);
    clearSessionCache(KEY);
    expect(readSessionCache(KEY, UNA_HORA)).toBeNull();
  });

  it('no lanza si sessionStorage no está disponible', () => {
    const original = Object.getOwnPropertyDescriptor(window, 'sessionStorage');
    Object.defineProperty(window, 'sessionStorage', {
      configurable: true,
      get() { throw new Error('bloqueado (navegación privada)'); },
    });
    try {
      expect(() => writeSessionCache(KEY, ['x'])).not.toThrow();
      expect(readSessionCache(KEY, UNA_HORA)).toBeNull();
      expect(() => clearSessionCache(KEY)).not.toThrow();
    } finally {
      if (original) Object.defineProperty(window, 'sessionStorage', original);
    }
  });
});
