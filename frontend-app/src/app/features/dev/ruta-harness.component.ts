import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { FirestoreService } from '../../core/services/firestore.service';
import { AdminService } from '../admin/services/admin.service';
import { PaesContentService } from '../learning-path/services/paes-content.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { LearningAccessService } from '../learning-path/services/learning-access.service';

/**
 * BANCO DE PRUEBAS DE LA RUTA DE APRENDIZAJE — SOLO DESARROLLO.
 *
 * La ruta vive detrás de `authGuard` + `emailVerifiedGuard`, así que no se puede
 * inspeccionar visualmente sin una cuenta real. Este harness monta los
 * componentes REALES de la ruta con dobles de `Auth`, `FirestoreService` y
 * `AdminService`, para poder revisar el diseño responsive y el muro de pago sin
 * iniciar sesión.
 *
 * IMPORTANTE:
 *  - La ruta `/dev/ruta` solo se registra cuando `environment.production === false`
 *    (ver app.routes.ts). Nunca llega a un build de producción.
 *  - No da acceso a datos reales: `Firestore` es un objeto vacío, así que
 *    `PaesContentService` falla al consultar y cae en su fallback local
 *    (`seed-data.ts` / `seed-historia.ts`). Es contenido de ejemplo, no de la BD.
 *
 * Uso:  /dev/ruta?materia=comp-lectora&plan=free
 *       plan = free | pro | admin
 */

function readParam(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  return new URLSearchParams(window.location.search).get(name) || fallback;
}

/** Auth falso: emite un usuario de inmediato para que el contenido cargue. */
function fakeAuthFactory() {
  const user = { uid: 'dev-harness-user', email: 'dev@harness.local', emailVerified: true };
  return {
    currentUser: user,
    onAuthStateChanged: (cb: (u: unknown) => void) => {
      setTimeout(() => cb(user), 0);
      return () => {};
    },
    onIdTokenChanged: () => () => {},
    signOut: () => Promise.resolve(),
  };
}

function fakeFirestoreServiceFactory() {
  const plan = readParam('plan', 'free');
  const profile = {
    uid: 'dev-harness-user',
    email: 'dev@harness.local',
    displayName: 'Usuario de Prueba',
    plan: plan === 'pro' ? 'premium' : 'free',
    stats: { questionsAnswered: 0, studyStreak: 0, lastStudyDate: '' },
  };
  return {
    profileSignal: signal(profile),
    getUserProfile: () => ({ subscribe: (fn: (p: unknown) => void) => { fn(profile); return { unsubscribe() {} }; } }),
    saveUserProfile: () => Promise.resolve(),
    updateProfileSettings: () => Promise.resolve(),
  };
}

function fakeAdminServiceFactory() {
  return { isAdmin: signal(readParam('plan', 'free') === 'admin') };
}

export const DEV_HARNESS_PROVIDERS = [
  { provide: Auth, useFactory: fakeAuthFactory },
  // Objeto vacío a propósito: fuerza el fallback a contenido local.
  { provide: Firestore, useValue: {} },
  { provide: FirestoreService, useFactory: fakeFirestoreServiceFactory },
  { provide: AdminService, useFactory: fakeAdminServiceFactory },
  // Instancias propias del subárbol para que resuelvan los dobles de arriba
  // (las de root ya están creadas con los servicios reales).
  PaesContentService,
  LearningAccessService,
];

@Component({
  selector: 'app-dev-ruta-harness',
  standalone: true,
  imports: [CommonModule, RouterModule],
  // Los dobles se declaran aquí (no en la ruta) para que queden en este chunk
  // lazy. Las rutas hijas renderizadas en el <router-outlet> los heredan.
  providers: DEV_HARNESS_PROVIDERS,
  template: `
    <div class="harness-bar">
      <strong>Harness de la Ruta</strong>
      <span class="hb-sep">·</span>
      <span>Plan:</span>
      <a [href]="link('comp-lectora', 'free')" [class.on]="plan === 'free'">Gratis</a>
      <a [href]="link('comp-lectora', 'pro')" [class.on]="plan === 'pro'">PRO</a>
      <a [href]="link('comp-lectora', 'admin')" [class.on]="plan === 'admin'">Admin</a>
      <span class="hb-sep">·</span>
      <span>Materia:</span>
      <a [href]="link('comp-lectora', plan)" [class.on]="materia === 'comp-lectora'">Comp. Lectora</a>
      <a [href]="link('historia', plan)" [class.on]="materia === 'historia'">Historia</a>
      <span class="hb-note">solo desarrollo · contenido de ejemplo</span>
    </div>

    <router-outlet></router-outlet>
  `,
  styles: [`
    .harness-bar {
      position: sticky; top: 0; z-index: 9999;
      display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem;
      padding: 0.5rem 0.9rem;
      background: #111827; color: #f9fafb;
      font: 500 0.8rem/1.2 system-ui, sans-serif;
      border-bottom: 2px solid #f59e0b;
    }
    .harness-bar a {
      color: #cbd5e1; text-decoration: none;
      padding: 0.25rem 0.6rem; border-radius: 99px;
      border: 1px solid rgba(255,255,255,0.18);
    }
    .harness-bar a.on { background: #f59e0b; color: #111827; border-color: #f59e0b; font-weight: 700; }
    .hb-sep { opacity: 0.4; }
    .hb-note { margin-left: auto; opacity: 0.55; font-style: italic; }
    @media (max-width: 640px) { .hb-note { display: none; } }
  `],
})
export class DevRutaHarnessComponent {
  plan = readParam('plan', 'free');
  materia = readParam('materia', 'comp-lectora');

  link(materia: string, plan: string): string {
    return `/dev/ruta/${materia}?materia=${materia}&plan=${plan}`;
  }
}
