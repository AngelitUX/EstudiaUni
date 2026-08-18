import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { PaesContentService } from './paes-content.service';

/**
 * Cubre la corrección de tests de la Ruta de Aprendizaje.
 * El foco está en la regresión del test vacío, que corrompía el progreso.
 */
function setup(): PaesContentService {
  TestBed.configureTestingModule({
    providers: [
      PaesContentService,
      { provide: Firestore, useValue: {} },
      // El constructor se suscribe al estado de auth; con un stub que no emite,
      // el servicio queda inerte y no toca red.
      { provide: Auth, useValue: { onAuthStateChanged: () => () => {} } },
    ],
  });
  return TestBed.inject(PaesContentService);
}

const PREGUNTAS = [
  { id: 1, respuesta_correcta: 'A' },
  { id: 2, respuesta_correcta: 'B' },
  { id: 3, respuesta_correcta: 'C' },
  { id: 4, respuesta_correcta: 'D' },
];

function stubTest(svc: PaesContentService, preguntas: any[]) {
  spyOn(svc, 'getTestBySeccionId').and.returnValue({
    id: 't1',
    seccionId: 'sec-1',
    contexto_base: null,
    preguntas,
  } as any);
  spyOn(svc, 'getSeccionById').and.returnValue({
    id: 'sec-1',
    capituloId: 'cap-1',
    materiaId: 'mat1',
  } as any);
  spyOn(svc, 'getMateriaById').and.returnValue(undefined);
}

describe('PaesContentService.submitTest', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => TestBed.resetTestingModule());

  it('puntúa 100 cuando todas las respuestas son correctas', () => {
    const svc = setup();
    stubTest(svc, PREGUNTAS);

    const answers = new Map<number, any>([[1, 'A'], [2, 'B'], [3, 'C'], [4, 'D']]);
    const result = svc.submitTest('sec-1', answers);

    expect(result.score).toBe(100);
    expect(result.totalCorrect).toBe(4);
    expect(result.totalQuestions).toBe(4);
    expect(svc.getSeccionProgress('sec-1')?.completed).toBe(true);
  });

  it('puntúa parcialmente y no marca la sección como completada', () => {
    const svc = setup();
    stubTest(svc, PREGUNTAS);

    // 2 de 4 correctas
    const answers = new Map<number, any>([[1, 'A'], [2, 'B'], [3, 'A'], [4, 'A']]);
    const result = svc.submitTest('sec-1', answers);

    expect(result.score).toBe(50);
    expect(result.totalCorrect).toBe(2);
    // Solo se completa con 100 (salvo la sección jefe 'loc-boss').
    expect(svc.getSeccionProgress('sec-1')?.completed).toBe(false);
  });

  it('cuenta como incorrecta una pregunta sin responder', () => {
    const svc = setup();
    stubTest(svc, PREGUNTAS);

    const result = svc.submitTest('sec-1', new Map());

    expect(result.score).toBe(0);
    expect(result.totalCorrect).toBe(0);
    expect(result.answers.every((a) => a.selectedOption === null)).toBe(true);
    expect(result.answers.every((a) => a.isCorrect === false)).toBe(true);
  });

  it('conserva el mejor puntaje entre intentos', () => {
    const svc = setup();
    stubTest(svc, PREGUNTAS);

    svc.submitTest('sec-1', new Map<number, any>([[1, 'A'], [2, 'B'], [3, 'C'], [4, 'D']]));
    svc.submitTest('sec-1', new Map<number, any>([[1, 'X']] as any));

    const prog = svc.getSeccionProgress('sec-1');
    expect(prog?.bestScore).toBe(100);
    expect(prog?.attempts).toBe(2);
    // Una vez completada, un intento peor no la descompleta.
    expect(prog?.completed).toBe(true);
  });

  it('REGRESIÓN: un test sin preguntas lanza error en vez de producir NaN', () => {
    // Antes hacía 0/0 = NaN; el NaN llegaba a score y a bestScore
    // (Math.max(x, NaN) === NaN), se serializaba como null en localStorage y
    // dejaba el progreso de la sección corrupto de forma permanente.
    const svc = setup();
    stubTest(svc, []);

    expect(() => svc.submitTest('sec-1', new Map())).toThrowError(/no tiene preguntas/);
    expect(svc.getSeccionProgress('sec-1')).toBeUndefined();
  });

  it('lanza error si la sección no tiene test', () => {
    const svc = setup();
    spyOn(svc, 'getTestBySeccionId').and.returnValue(undefined);

    expect(() => svc.submitTest('sec-x', new Map())).toThrowError(/Test not found/);
  });
});

describe('PaesContentService — progreso', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => TestBed.resetTestingModule());

  it('marca y desmarca una sección', () => {
    const svc = setup();
    spyOn(svc, 'getSeccionById').and.returnValue({
      id: 'sec-9', capituloId: 'cap-1', materiaId: 'mat1',
    } as any);

    svc.markSeccionCompleted('sec-9');
    expect(svc.getSeccionProgress('sec-9')?.completed).toBe(true);

    svc.markSeccionIncomplete('sec-9');
    expect(svc.getSeccionProgress('sec-9')).toBeUndefined();
  });
});

describe('PaesContentService.ensureTestLoaded — carga de tests bajo demanda', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => TestBed.resetTestingModule());

  it('NO gasta lecturas si la sección ya trae el test embebido (seeds locales)', async () => {
    const svc = setup();
    spyOn(svc, 'getSeccionById').and.returnValue({
      id: 'sec-1', testId: 'test-1',
      test: { id: 'test-1', preguntas: PREGUNTAS },
    } as any);
    const attach = spyOn<any>(svc, 'attachTestToSeccion');

    await svc.ensureTestLoaded('sec-1');

    expect(attach).not.toHaveBeenCalled();
  });

  it('no hace nada si la sección no existe o no tiene testId', async () => {
    const svc = setup();
    const attach = spyOn<any>(svc, 'attachTestToSeccion');

    spyOn(svc, 'getSeccionById').and.returnValue(undefined);
    await svc.ensureTestLoaded('sec-desconocida');

    (svc.getSeccionById as jasmine.Spy).and.returnValue({ id: 'sec-2' } as any);
    await svc.ensureTestLoaded('sec-2');

    expect(attach).not.toHaveBeenCalled();
  });

  it('ignora ids vacíos', async () => {
    const svc = setup();
    const spy = spyOn(svc, 'getSeccionById');
    await svc.ensureTestLoaded('');
    expect(spy).not.toHaveBeenCalled();
  });

  it('attachTestToSeccion inserta el test sin mutar el capítulo original', () => {
    const svc = setup();
    const original = {
      id: 'cap-1', materiaId: 'mat1', order: 1,
      secciones: [{ id: 'sec-a' }, { id: 'sec-b' }],
    } as any;
    (svc as any)._capitulos.set([original]);

    const test = { id: 't-a', preguntas: PREGUNTAS } as any;
    (svc as any).attachTestToSeccion('sec-a', test);

    // el nuevo estado tiene el test...
    expect(svc.getTestBySeccionId('sec-a')).toBe(test);
    expect(svc.getTestBySeccionId('sec-b')).toBeUndefined();
    // ...y el objeto original no fue mutado (los computed dependen de eso)
    expect(original.secciones[0].test).toBeUndefined();
  });
});
