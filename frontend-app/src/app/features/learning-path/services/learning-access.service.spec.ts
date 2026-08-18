import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { LearningAccessService } from './learning-access.service';
import { PaesContentService } from './paes-content.service';
import { FirestoreService } from '../../../core/services/firestore.service';
import { AdminService } from '../../admin/services/admin.service';

/**
 * Cubre el límite freemium de la Ruta de Aprendizaje: el Plan Básico solo puede
 * cursar el PRIMER capítulo de cada materia.
 */

const CAPS_MAT1 = [
  { id: 'cap-a', materiaId: 'mat1', order: 1, secciones: [{ id: 'sec-a1' }, { id: 'sec-a2' }] },
  { id: 'cap-b', materiaId: 'mat1', order: 2, secciones: [{ id: 'sec-b1' }] },
  { id: 'cap-c', materiaId: 'mat1', order: 3, secciones: [{ id: 'sec-c1' }] },
];

function setup(opts: { plan?: string; admin?: boolean | null; capitulos?: any[] } = {}) {
  const capitulos = opts.capitulos ?? CAPS_MAT1;

  const paesFake: Partial<PaesContentService> = {
    getCapitulosByMateria: (materiaId: string) =>
      capitulos.filter((c) => c.materiaId === materiaId) as any,
    getCapituloById: (capituloId: string) =>
      capitulos.find((c) => c.id === capituloId) as any,
    getCapituloBySeccionId: (seccionId: string) =>
      capitulos.find((c) => c.secciones.some((s: any) => s.id === seccionId)) as any,
  };

  const firestoreFake = {
    profileSignal: signal(opts.plan ? ({ plan: opts.plan } as any) : null),
  };

  const adminFake = { isAdmin: signal(opts.admin ?? false) };

  TestBed.configureTestingModule({
    providers: [
      LearningAccessService,
      { provide: PaesContentService, useValue: paesFake },
      { provide: FirestoreService, useValue: firestoreFake },
      { provide: AdminService, useValue: adminFake },
    ],
  });

  return TestBed.inject(LearningAccessService);
}

describe('LearningAccessService — límite freemium de la ruta', () => {
  afterEach(() => TestBed.resetTestingModule());

  describe('usuario del Plan Básico', () => {
    it('entra al primer capítulo de la materia', () => {
      const access = setup({ plan: 'free' });
      expect(access.isPro()).toBe(false);
      expect(access.canAccessChapter('mat1', 'cap-a')).toBe(true);
    });

    it('NO entra al segundo ni al tercer capítulo', () => {
      const access = setup({ plan: 'free' });
      expect(access.canAccessChapter('mat1', 'cap-b')).toBe(false);
      expect(access.canAccessChapter('mat1', 'cap-c')).toBe(false);
    });

    it('solo lista el primer capítulo como permitido', () => {
      const access = setup({ plan: 'free' });
      expect(access.allowedChapterIds('mat1')).toEqual(['cap-a']);
    });

    it('cuenta correctamente los capítulos bloqueados', () => {
      const access = setup({ plan: 'free' });
      expect(access.lockedChapterCount('mat1')).toBe(2);
    });

    it('entra a las secciones del primer capítulo pero no a las del resto', () => {
      const access = setup({ plan: 'free' });
      expect(access.canAccessSection('sec-a1')).toBe(true);
      expect(access.canAccessSection('sec-a2')).toBe(true);
      expect(access.canAccessSection('sec-b1')).toBe(false);
      expect(access.canAccessSection('sec-c1')).toBe(false);
    });

    it('aplica el mismo límite a las guías de capítulo (guide_<capId>)', () => {
      const access = setup({ plan: 'free' });
      expect(access.canAccessSection('guide_cap-a')).toBe(true);
      expect(access.canAccessSection('guide_cap-b')).toBe(false);
    });

    it('el orden manda sobre el orden de llegada de los datos', () => {
      // cap-b llega primero en el array pero tiene order 2: el gratuito
      // debe quedarse con cap-a (order 1), no con el primero del array.
      const desordenados = [
        { id: 'cap-b', materiaId: 'mat1', order: 2, secciones: [] },
        { id: 'cap-a', materiaId: 'mat1', order: 1, secciones: [] },
      ];
      const access = setup({ plan: 'free', capitulos: desordenados });
      expect(access.allowedChapterIds('mat1')).toEqual(['cap-a']);
      expect(access.canAccessChapter('mat1', 'cap-b')).toBe(false);
    });
  });

  describe('usuario PRO', () => {
    it('entra a todos los capítulos', () => {
      const access = setup({ plan: 'premium' });
      expect(access.isPro()).toBe(true);
      expect(access.canAccessChapter('mat1', 'cap-a')).toBe(true);
      expect(access.canAccessChapter('mat1', 'cap-b')).toBe(true);
      expect(access.canAccessChapter('mat1', 'cap-c')).toBe(true);
    });

    it('no tiene capítulos bloqueados', () => {
      const access = setup({ plan: 'premium' });
      expect(access.lockedChapterCount('mat1')).toBe(0);
      expect(access.allowedChapterIds('mat1')).toEqual(['cap-a', 'cap-b', 'cap-c']);
    });
  });

  describe('admin', () => {
    it('recibe trato PRO aunque su plan sea gratuito', () => {
      // Regresión: las vistas de la ruta calculaban isProPlan solo con
      // plan === 'premium', así que un admin veía la ruta capada.
      const access = setup({ plan: 'free', admin: true });
      expect(access.isPro()).toBe(true);
      expect(access.canAccessChapter('mat1', 'cap-c')).toBe(true);
    });
  });

  describe('casos límite (no expulsar por error)', () => {
    it('deja pasar mientras el contenido no ha cargado', () => {
      const access = setup({ plan: 'free', capitulos: [] });
      expect(access.canAccessChapter('mat1', 'cap-b')).toBe(true);
    });

    it('deja pasar ante un capítulo desconocido para esa materia', () => {
      const access = setup({ plan: 'free' });
      expect(access.canAccessChapter('mat1', 'cap-inexistente')).toBe(true);
    });

    it('deja pasar ante una sección desconocida', () => {
      const access = setup({ plan: 'free' });
      expect(access.canAccessSection('sec-inexistente')).toBe(true);
    });

    it('deja pasar con ids vacíos', () => {
      const access = setup({ plan: 'free' });
      expect(access.canAccessChapter('', '')).toBe(true);
      expect(access.canAccessSection('')).toBe(true);
    });

    it('trata isAdmin() === null (aún sin resolver) como NO admin', () => {
      const access = setup({ plan: 'free', admin: null });
      expect(access.isPro()).toBe(false);
      expect(access.canAccessChapter('mat1', 'cap-b')).toBe(false);
    });
  });
});
