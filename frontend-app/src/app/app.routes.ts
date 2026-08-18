import { Routes } from '@angular/router';
import { baseRoutes, wildcardRoute } from './app.routes.base';

/**
 * Rutas de la aplicación (build de PRODUCCIÓN).
 *
 * En desarrollo este archivo se sustituye por `app.routes.dev.ts` mediante
 * `fileReplacements` (ver angular.json → build → configurations.development),
 * que añade el banco de pruebas de la Ruta de Aprendizaje.
 *
 * La sustitución se hace a nivel de BUILD y no con un `if (environment.production)`
 * a propósito: con la comprobación en tiempo de ejecución, el `import()` dinámico
 * del harness seguía generando su chunk y acababa incluido en el bundle de
 * producción. Así el código de desarrollo no existe siquiera en ese build.
 */
export const routes: Routes = [...baseRoutes, wildcardRoute];
