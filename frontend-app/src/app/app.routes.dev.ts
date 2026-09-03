import { Routes } from '@angular/router';
import { baseRoutes, wildcardRoute } from './app.routes.base';

/**
 * Rutas de la aplicación en DESARROLLO.
 *
 * Sustituye a `app.routes.ts` vía `fileReplacements` (angular.json → build →
 * configurations.development). Añade `/dev/ruta`, el banco de pruebas que
 * permite inspeccionar la Ruta de Aprendizaje sin iniciar sesión.
 *
 * Nada de esto llega a un build de producción: ese build compila `app.routes.ts`,
 * que no referencia este archivo ni el componente del harness.
 */
const devRutaHarnessRoute = {
  path: 'dev/ruta',
  data: { title: 'DEV · Harness de la Ruta', noIndex: true },
  // Los dobles de Auth/FirestoreService/AdminService se declaran en el propio
  // componente (@Component providers), así viven en su chunk lazy y los heredan
  // las rutas hijas a través del <router-outlet>.
  loadComponent: () =>
    import('./features/dev/ruta-harness.component').then(m => m.DevRutaHarnessComponent),
  children: [
    {
      path: ':materiaId',
      loadComponent: () =>
        import('./features/learning-path/materia-path.component').then(m => m.MateriaPathComponent),
    },
    {
      path: ':materiaId/:capituloId',
      loadComponent: () =>
        import('./features/learning-path/capitulo-detail.component').then(m => m.CapituloDetailComponent),
    },
    {
      path: ':materiaId/:capituloId/:seccionId',
      loadComponent: () =>
        import('./features/learning-path/seccion-detail.component').then(m => m.SeccionDetailComponent),
    },
    // Índice de la ruta ("Elige una materia"), igual que /ruta en la app real.
    {
      path: '',
      loadComponent: () =>
        import('./features/learning-path/learning-path.component').then(m => m.LearningPathComponent),
    },
  ],
};

// Dashboard ("Inicio") sin login, para revisar el entrenador de estudio.
const devInicioRoute = {
  path: 'dev/inicio',
  data: { title: 'DEV · Inicio', noIndex: true },
  loadComponent: () =>
    import('./features/dev/ruta-harness.component').then(m => m.DevRutaHarnessComponent),
  children: [
    {
      path: '',
      loadComponent: () =>
        import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    },
  ],
};

// Mini Ensayos sin login, para revisar el banco de preguntas (pool_preguntas).
// Es el consumidor principal del pool: permite comprobar que cada materia
// muestre sus temas con el conteo correcto y que la sesión se arme bien.
// Con USE_LOCAL_MOCKS activo lee el mock local generado desde
// content/pool-preguntas/ (ver tools/pool-preguntas/build.js).
const devMiniEnsayoRoute = {
  path: 'dev/mini-ensayo',
  data: { title: 'DEV · Mini Ensayo', noIndex: true },
  loadComponent: () =>
    import('./features/dev/ruta-harness.component').then(m => m.DevRutaHarnessComponent),
  children: [
    {
      path: '',
      loadComponent: () =>
        import('./features/mini-ensayos/mini-ensayo-setup.component').then(m => m.MiniEnsayoSetupComponent),
    },
  ],
};

export const routes: Routes = [
  ...baseRoutes,
  devRutaHarnessRoute,
  devInicioRoute,
  devMiniEnsayoRoute,
  wildcardRoute,
];
