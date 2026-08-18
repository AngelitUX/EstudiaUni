import { Injectable, inject, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from '../../../core/services/firestore.service';
import { AdminService } from '../../admin/services/admin.service';
import { PaymentService } from '../../../core/services/payment.service';
import { PaesContentService } from './paes-content.service';

/**
 * Fuente de verdad ÚNICA del límite freemium de la Ruta de Aprendizaje.
 *
 * Regla de negocio: el Plan Básico (gratis) solo puede cursar el PRIMER capítulo
 * de cada materia. PRO y admin acceden a todos.
 *
 * Todas las vistas de la ruta (las 6 materia-*-path, capitulo-*-detail,
 * seccion-*-detail y los runners de test) deben consultar este servicio en vez
 * de reimplementar la comprobación. Antes cada componente calculaba su propio
 * `isProPlan` y ninguno de los de detalle/test comprobaba nada, así que se podía
 * entrar a cualquier capítulo escribiendo la URL a mano.
 */
@Injectable({ providedIn: 'root' })
export class LearningAccessService {
  private firestoreService = inject(FirestoreService);
  private adminService = inject(AdminService);
  private paes = inject(PaesContentService);

  /** Capítulos por materia que puede cursar un usuario del Plan Básico. */
  static readonly FREE_CHAPTERS_PER_MATERIA = 1;

  /**
   * PRO efectivo. Incluye a los admin, igual que el resto de la app
   * (dashboard, ensayos, mente veloz) y que el backend, que trata a los admin
   * como PRO en `SubscriptionsService`. Las vistas de la ruta antes NO incluían
   * a los admin, así que un admin veía la ruta capada.
   */
  readonly isPro = computed(() => {
    const profile = this.firestoreService.profileSignal();
    const isPremium =
      profile?.plan === 'premium' || profile?.subscription?.tier === 'premium';
    return isPremium || this.adminService.isAdmin() === true;
  });

  /**
   * IDs de los capítulos accesibles de una materia, en orden.
   * Para PRO devuelve todos; para gratis, solo el primero.
   */
  allowedChapterIds(materiaId: string): string[] {
    const capitulos = [...this.paes.getCapitulosByMateria(materiaId)].sort(
      (a, b) => (a.order || 0) - (b.order || 0),
    );
    if (this.isPro()) return capitulos.map((c) => c.id);
    return capitulos
      .slice(0, LearningAccessService.FREE_CHAPTERS_PER_MATERIA)
      .map((c) => c.id);
  }

  /**
   * ¿Puede el usuario entrar a este capítulo?
   *
   * Ante un capítulo o materia desconocidos devuelve `true`: el gate solo debe
   * bloquear lo que sabe con certeza que es de pago. Si los datos aún no
   * cargaron, bloquear produciría falsos positivos que echarían a un usuario
   * PRO de su propio contenido.
   */
  canAccessChapter(materiaId: string, capituloId: string): boolean {
    if (this.isPro()) return true;
    if (!materiaId || !capituloId) return true;

    const capitulos = this.paes.getCapitulosByMateria(materiaId);
    if (capitulos.length === 0) return true; // contenido aún no cargado

    const allowed = this.allowedChapterIds(materiaId);
    if (!capitulos.some((c) => c.id === capituloId)) return true; // desconocido
    return allowed.includes(capituloId);
  }

  /** ¿Puede el usuario entrar a esta sección? Resuelve su capítulo y delega. */
  canAccessSection(seccionId: string): boolean {
    if (this.isPro()) return true;
    if (!seccionId) return true;

    // Las guías de capítulo se identifican como `guide_<capituloId>`.
    const guideCapId = seccionId.startsWith('guide_')
      ? seccionId.slice('guide_'.length)
      : null;
    if (guideCapId) {
      const cap = this.paes.getCapituloById(guideCapId);
      return cap ? this.canAccessChapter(cap.materiaId, cap.id) : true;
    }

    const cap = this.paes.getCapituloBySeccionId(seccionId);
    if (!cap) return true; // sección desconocida o datos sin cargar
    return this.canAccessChapter(cap.materiaId, cap.id);
  }

  /**
   * Cuántos capítulos de la materia quedan tras el muro de pago.
   * Sirve para el mensaje "Te quedan N capítulos por desbloquear".
   */
  lockedChapterCount(materiaId: string): number {
    if (this.isPro()) return 0;
    const total = this.paes.getCapitulosByMateria(materiaId).length;
    return Math.max(0, total - LearningAccessService.FREE_CHAPTERS_PER_MATERIA);
  }
}

/**
 * Instala un guard REACTIVO de acceso en una vista de la ruta (capítulo,
 * sección o runner de test). Debe llamarse desde el constructor del componente
 * (contexto de inyección).
 *
 * Es reactivo a propósito: el contenido de la ruta se carga de forma asíncrona,
 * así que una comprobación puntual en el constructor se ejecutaría con la lista
 * de capítulos todavía vacía y dejaría pasar a cualquiera. El `effect` se
 * reevalúa cuando terminan de cargar los capítulos y cuando cambian los
 * parámetros de ruta o el plan del usuario.
 *
 * Ante la duda deja pasar (ver `canAccessChapter`): preferimos no expulsar por
 * error a un usuario legítimo. El bloqueo duro del contenido de pago vive en las
 * reglas de Firestore y en el backend, no aquí.
 */
export function enforceLearningAccess(source: {
  materiaId?: () => string;
  capituloId?: () => string;
  seccionId?: () => string;
}): void {
  const access = inject(LearningAccessService);
  const paes = inject(PaesContentService);
  const router = inject(Router);
  const payment = inject(PaymentService);

  effect(
    () => {
      if (paes.loading()) return;
      if (access.isPro()) return;

      const seccionId = source.seccionId?.() ?? '';
      const capituloId = source.capituloId?.() ?? '';
      const materiaId = source.materiaId?.() ?? '';

      let allowed = true;
      if (seccionId) {
        allowed = access.canAccessSection(seccionId);
      } else if (capituloId) {
        allowed = access.canAccessChapter(materiaId, capituloId);
      }

      if (!allowed) {
        // Expulsar PRIMERO y abrir el modal después: si el modal fallara, el
        // usuario ya está fuera del contenido de pago. El orden inverso dejaba
        // la expulsión a merced de que no lanzara nada antes.
        router.navigate(materiaId ? ['/ruta', materiaId] : ['/ruta']);
        payment.openPricingModal();
      }
    },
    // `openPricingModal()` escribe signals, y Angular 18 lo prohíbe dentro de un
    // effect salvo que se permita explícitamente. Sin esta opción se lanzaba
    // NG0600, la excepción abortaba el effect y NO se llegaba a expulsar al
    // usuario: el gate quedaba anulado y el capítulo de pago se leía entero.
    { allowSignalWrites: true },
  );
}
