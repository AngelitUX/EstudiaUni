/**
 * Cubre el agrupado de respuestas de un ensayo.
 *
 * No instancia FirestoreService (su constructor arrastra AngularFire y se cuelga
 * en headless): replica la estructura del buffer y verifica el comportamiento
 * que importa — colapsar cambios de opinión y no perder respuestas.
 *
 * Si esto se rompe, un ensayo vuelve a costar una escritura por pregunta: con
 * 200 alumnos son ~14.000 escrituras diarias solo en ensayos.
 */
type Respuesta = { preguntaId: string; selectedAnswer: string; isCorrect: boolean };

/** Misma lógica de acumulación que FirestoreService.saveAnswer. */
class BufferRespuestas {
  private pendientes = new Map<string, Map<string, Respuesta>>();

  registrar(intentoId: string, preguntaId: string, selectedAnswer: string, isCorrect: boolean) {
    if (!this.pendientes.has(intentoId)) this.pendientes.set(intentoId, new Map());
    this.pendientes.get(intentoId)!.set(preguntaId, { preguntaId, selectedAnswer, isCorrect });
  }

  vaciar(intentoId: string): Respuesta[] {
    const m = this.pendientes.get(intentoId);
    if (!m) return [];
    const lote = [...m.values()];
    this.pendientes.delete(intentoId);
    return lote;
  }
}

/** Misma fusión que hace la transacción sobre el array `answers` del documento. */
function fusionar(existentes: Respuesta[], lote: Respuesta[]): Respuesta[] {
  const answers = [...existentes];
  for (const item of lote) {
    const idx = answers.findIndex((a) => a.preguntaId === item.preguntaId);
    if (idx >= 0) answers[idx] = item;
    else answers.push(item);
  }
  return answers;
}

describe('Agrupado de respuestas del ensayo', () => {
  let buf: BufferRespuestas;
  beforeEach(() => { buf = new BufferRespuestas(); });

  it('agrupa varias respuestas en un solo lote', () => {
    buf.registrar('i1', 'q1', 'A', true);
    buf.registrar('i1', 'q2', 'B', false);
    buf.registrar('i1', 'q3', 'C', true);

    const lote = buf.vaciar('i1');

    expect(lote.length).toBe(3);
  });

  it('colapsa los cambios de opinión: solo se escribe la última respuesta', () => {
    buf.registrar('i1', 'q1', 'A', false);
    buf.registrar('i1', 'q1', 'B', false);
    buf.registrar('i1', 'q1', 'D', true);

    const lote = buf.vaciar('i1');

    expect(lote.length).toBe(1);
    expect(lote[0].selectedAnswer).toBe('D');
    expect(lote[0].isCorrect).toBe(true);
  });

  it('no mezcla intentos distintos', () => {
    buf.registrar('i1', 'q1', 'A', true);
    buf.registrar('i2', 'q1', 'B', false);

    expect(buf.vaciar('i1').length).toBe(1);
    expect(buf.vaciar('i2')[0].selectedAnswer).toBe('B');
  });

  it('vaciar dos veces no repite el lote (es idempotente)', () => {
    buf.registrar('i1', 'q1', 'A', true);

    expect(buf.vaciar('i1').length).toBe(1);
    expect(buf.vaciar('i1').length).toBe(0);
  });

  it('vaciar un intento sin respuestas devuelve lista vacía', () => {
    expect(buf.vaciar('inexistente')).toEqual([]);
  });

  it('la fusión actualiza las existentes y añade las nuevas', () => {
    const existentes: Respuesta[] = [
      { preguntaId: 'q1', selectedAnswer: 'A', isCorrect: false },
      { preguntaId: 'q2', selectedAnswer: 'B', isCorrect: true },
    ];
    const lote: Respuesta[] = [
      { preguntaId: 'q1', selectedAnswer: 'C', isCorrect: true }, // cambia
      { preguntaId: 'q3', selectedAnswer: 'D', isCorrect: false }, // nueva
    ];

    const res = fusionar(existentes, lote);

    expect(res.length).toBe(3);
    expect(res.find((a) => a.preguntaId === 'q1')!.selectedAnswer).toBe('C');
    expect(res.find((a) => a.preguntaId === 'q2')!.selectedAnswer).toBe('B');
    expect(res.find((a) => a.preguntaId === 'q3')).toBeTruthy();
  });

  it('REGRESIÓN: fusionar no pierde respuestas previas del documento', () => {
    // El bug que la transacción original evitaba: una escritura pisando a otra.
    const existentes: Respuesta[] = Array.from({ length: 40 }, (_, i) => ({
      preguntaId: 'q' + i, selectedAnswer: 'A', isCorrect: true,
    }));
    const lote: Respuesta[] = [{ preguntaId: 'q99', selectedAnswer: 'B', isCorrect: false }];

    const res = fusionar(existentes, lote);

    expect(res.length).toBe(41);
  });
});
