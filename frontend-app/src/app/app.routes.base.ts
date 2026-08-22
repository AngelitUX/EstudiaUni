import { Route, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { VerifyEmailComponent } from './features/auth/verify-email/verify-email.component';
import { HomeComponent } from './features/auth/home.component';
import { ModulesListComponent } from './features/modules/modules-list/modules-list.component';
import { TopicDetailComponent } from './features/modules/topic-detail/topic-detail.component';
import { SimulationRunnerComponent } from './features/simulations/simulation-runner/simulation-runner.component';
import { EnsayosListComponent } from './features/simulations/ensayos-list.component';
import { EnsayoRunnerComponent } from './features/simulations/ensayo-runner.component';
import { EnsayoReviewComponent } from './features/simulations/ensayo-review.component';
import { authGuard } from './core/guards/auth.guard';
import { emailVerifiedGuard } from './core/guards/email-verified.guard';
import { adminGuard } from './core/guards/admin.guard';


import { MateriaBiologiaPathComponent } from './features/learning-path/materia-biologia-path.component';
import { CapituloBiologiaDetailComponent } from './features/learning-path/capitulo-biologia-detail.component';
import { SeccionBiologiaDetailComponent } from './features/learning-path/seccion-biologia-detail.component';

import { MateriaFisicaPathComponent } from './features/learning-path/materia-fisica-path.component';
import { CapituloFisicaDetailComponent } from './features/learning-path/capitulo-fisica-detail.component';
import { SeccionFisicaDetailComponent } from './features/learning-path/seccion-fisica-detail.component';

export const baseRoutes: Routes = [
  {
    path: '', component: HomeComponent,
    data: { description: 'Plataforma para preparar la PAES con IA, práctica adaptativa y simulacros completos' }
  },
  {
    path: 'login', component: LoginComponent,
    data: { title: 'Iniciar Sesión', description: 'Inicia sesión en EstudiaUni.cl y sigue preparando tu PAES con inteligencia artificial.' }
  },
  {
    path: 'register', component: RegisterComponent,
    data: { title: 'Crea tu Cuenta Gratis', description: 'Crea tu cuenta gratis en EstudiaUni.cl y empieza a prepararte para la PAES con práctica adaptativa e IA.' }
  },
  { path: 'verify-email', component: VerifyEmailComponent, canActivate: [authGuard], data: { title: 'Verifica tu Correo' } },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard, emailVerifiedGuard],
    data: { title: 'Mi Dashboard' }
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile-settings.component').then(m => m.ProfileSettingsComponent),
    canActivate: [authGuard, emailVerifiedGuard],
    data: { title: 'Mi Perfil' }
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/profile/profile-settings.component').then(m => m.ProfileSettingsComponent),
    canActivate: [authGuard, emailVerifiedGuard],
    data: { title: 'Configuración' }
  },
  { path: 'modules', component: ModulesListComponent, canActivate: [authGuard, emailVerifiedGuard], data: { title: 'Módulos' } },
  { path: 'topic/:moduleId/:topicId', component: TopicDetailComponent, canActivate: [authGuard, emailVerifiedGuard], data: { title: 'Tema' } },
  { path: 'simulation/:attemptId', component: SimulationRunnerComponent, canActivate: [authGuard, emailVerifiedGuard], data: { title: 'Simulación' } },
  // Ensayos PAES
  { path: 'ensayos', component: EnsayosListComponent, canActivate: [authGuard, emailVerifiedGuard], data: { title: 'Ensayos PAES' } },
  { path: 'ensayo/:id/run', component: EnsayoRunnerComponent, canActivate: [authGuard, emailVerifiedGuard], data: { title: 'Rindiendo Ensayo' } },
  { path: 'ensayo/:id/review', component: EnsayoReviewComponent, canActivate: [authGuard, emailVerifiedGuard], data: { title: 'Revisión de Ensayo' } },
  // Mini Ensayos
  {
    path: 'mini-ensayo',
    loadComponent: () => import('./features/mini-ensayos/mini-ensayo-setup.component').then(m => m.MiniEnsayoSetupComponent),
    canActivate: [authGuard, emailVerifiedGuard],
    data: { title: 'Mini Ensayo' }
  },
  {
    path: 'mini-ensayo/run',
    loadComponent: () => import('./features/mini-ensayos/mini-ensayo-runner.component').then(m => m.MiniEnsayoRunnerComponent),
    canActivate: [authGuard, emailVerifiedGuard],
    data: { title: 'Mini Ensayo en Curso' }
  },
  {
    path: 'mini-ensayo/review',
    loadComponent: () => import('./features/mini-ensayos/mini-ensayo-review.component').then(m => m.MiniEnsayoReviewComponent),
    canActivate: [authGuard, emailVerifiedGuard],
    data: { title: 'Revisión Mini Ensayo' }
  },
  // Ruta de Aprendizaje (Duolingo-style)
  {
    path: 'ruta',
    loadComponent: () => import('./features/learning-path/learning-path.component').then(m => m.LearningPathComponent),
    canActivate: [authGuard, emailVerifiedGuard],
    data: { title: 'Ruta de Aprendizaje' }
  },
  {
    path: 'ruta/mat1',
    data: { materiaId: 'mat1', title: 'Matemática 1 · Ruta de Aprendizaje' },
    loadComponent: () => import('./features/learning-path/materia-math-path.component').then(m => m.MateriaMathPathComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  {
    path: 'ruta/mat2',
    data: { materiaId: 'mat2', title: 'Matemática 2 · Ruta de Aprendizaje' },
    loadComponent: () => import('./features/learning-path/materia-math-path.component').then(m => m.MateriaMathPathComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  {
    path: 'ruta/historia',
    data: { materiaId: 'historia', title: 'Historia · Ruta de Aprendizaje' },
    loadComponent: () => import('./features/learning-path/materia-historia-path.component').then(m => m.MateriaHistoriaPathComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },

  // BIOLOGIA AISLADA
  {
    path: 'ruta/biologia',
    data: { materiaId: 'biologia', title: 'Biología · Ruta de Aprendizaje' },
    loadComponent: () => import('./features/learning-path/materia-biologia-path.component').then(m => m.MateriaBiologiaPathComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  {
    path: 'ruta/ciencias-biologia',
    data: { materiaId: 'ciencias-biologia', title: 'Ciencias (Biología) · Ruta de Aprendizaje' },
    loadComponent: () => import('./features/learning-path/materia-biologia-path.component').then(m => m.MateriaBiologiaPathComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  {
    path: 'ruta/biologia/:capituloId',
    loadComponent: () => import('./features/learning-path/capitulo-biologia-detail.component').then(m => m.CapituloBiologiaDetailComponent),
    canActivate: [authGuard, emailVerifiedGuard],
    data: { title: 'Capítulo de Biología' }
  },
  {
    path: 'ruta/ciencias-biologia/:capituloId',
    loadComponent: () => import('./features/learning-path/capitulo-biologia-detail.component').then(m => m.CapituloBiologiaDetailComponent),
    canActivate: [authGuard, emailVerifiedGuard],
    data: { title: 'Capítulo de Ciencias' }
  },
  {
    path: 'ruta/biologia/:capituloId/:seccionId',
    loadComponent: () => import('./features/learning-path/seccion-biologia-detail.component').then(m => m.SeccionBiologiaDetailComponent),
    canActivate: [authGuard, emailVerifiedGuard],
    data: { title: 'Sección de Biología' }
  },
  {
    path: 'ruta/ciencias-biologia/:capituloId/:seccionId',
    loadComponent: () => import('./features/learning-path/seccion-biologia-detail.component').then(m => m.SeccionBiologiaDetailComponent),
    canActivate: [authGuard, emailVerifiedGuard],
    data: { title: 'Sección de Ciencias' }
  },

  // FISICA AISLADA
  {
    path: 'ruta/fisica',
    data: { materiaId: 'fisica', title: 'Física · Ruta de Aprendizaje' },
    loadComponent: () => import('./features/learning-path/materia-fisica-path.component').then(m => m.MateriaFisicaPathComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  {
    path: 'ruta/ciencias-fisica',
    data: { materiaId: 'ciencias-fisica', title: 'Ciencias (Física) · Ruta de Aprendizaje' },
    loadComponent: () => import('./features/learning-path/materia-fisica-path.component').then(m => m.MateriaFisicaPathComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  {
    path: 'ruta/fisica/:capituloId',
    loadComponent: () => import('./features/learning-path/capitulo-fisica-detail.component').then(m => m.CapituloFisicaDetailComponent),
    canActivate: [authGuard, emailVerifiedGuard],
    data: { title: 'Capítulo de Física' }
  },
  {
    path: 'ruta/ciencias-fisica/:capituloId',
    loadComponent: () => import('./features/learning-path/capitulo-fisica-detail.component').then(m => m.CapituloFisicaDetailComponent),
    canActivate: [authGuard, emailVerifiedGuard],
    data: { title: 'Capítulo de Ciencias' }
  },
  {
    path: 'ruta/fisica/:capituloId/:seccionId',
    loadComponent: () => import('./features/learning-path/seccion-fisica-detail.component').then(m => m.SeccionFisicaDetailComponent),
    canActivate: [authGuard, emailVerifiedGuard],
    data: { title: 'Sección de Física' }
  },
  {
    path: 'ruta/ciencias-fisica/:capituloId/:seccionId',
    loadComponent: () => import('./features/learning-path/seccion-fisica-detail.component').then(m => m.SeccionFisicaDetailComponent),
    canActivate: [authGuard, emailVerifiedGuard],
    data: { title: 'Sección de Ciencias' }
  },

  {
    path: 'ruta/quimica',
    data: { materiaId: 'quimica', title: 'Química · Ruta de Aprendizaje' },
    loadComponent: () => import('./features/learning-path/materia-quimica-path.component').then(m => m.MateriaQuimicaPathComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  {
    path: 'ruta/ciencias-quimica',
    data: { materiaId: 'ciencias-quimica', title: 'Ciencias (Química) · Ruta de Aprendizaje' },
    loadComponent: () => import('./features/learning-path/materia-quimica-path.component').then(m => m.MateriaQuimicaPathComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  {
    path: 'ruta/ciencias',
    data: { materiaId: 'ciencias', title: 'Ciencias · Ruta de Aprendizaje' },
    loadComponent: () => import('./features/learning-path/materia-quimica-path.component').then(m => m.MateriaQuimicaPathComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  {
    path: 'ruta/:materiaId',
    loadComponent: () => import('./features/learning-path/materia-path.component').then(m => m.MateriaPathComponent),
    canActivate: [authGuard, emailVerifiedGuard],
    data: { title: 'Ruta de Aprendizaje' }
  },
  {
    path: 'ruta/:materiaId/:capituloId',
    loadComponent: () => import('./features/learning-path/capitulo-detail.component').then(m => m.CapituloDetailComponent),
    canActivate: [authGuard, emailVerifiedGuard],
    data: { title: 'Capítulo' }
  },
  {
    path: 'ruta/:materiaId/:capituloId/:seccionId',
    loadComponent: () => import('./features/learning-path/seccion-detail.component').then(m => m.SeccionDetailComponent),
    canActivate: [authGuard, emailVerifiedGuard],
    data: { title: 'Sección' }
  },
  {
    path: 'test-math/:seccionId',
    loadComponent: () => import('./features/learning-path/seccion-test-math.component').then(m => m.SeccionTestMathComponent),
    canActivate: [authGuard, emailVerifiedGuard],
    data: { title: 'Prueba de Matemática' }
  },
  {
    path: 'test-math/:seccionId/review',
    loadComponent: () => import('./features/learning-path/seccion-test-review-math.component').then(m => m.SeccionTestReviewMathComponent),
    canActivate: [authGuard, emailVerifiedGuard],
    data: { title: 'Revisión de Prueba' }
  },
  {
    path: 'test/:seccionId',
    loadComponent: () => import('./features/learning-path/seccion-test.component').then(m => m.SeccionTestComponent),
    canActivate: [authGuard, emailVerifiedGuard],
    data: { title: 'Prueba' }
  },
  {
    path: 'test/:seccionId/review',
    loadComponent: () => import('./features/learning-path/seccion-test-review.component').then(m => m.SeccionTestReviewComponent),
    canActivate: [authGuard, emailVerifiedGuard],
    data: { title: 'Revisión de Prueba' }
  },
  // ─── Admin Panel ───
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-panel.component').then(m => m.AdminPanelComponent),
    canActivate: [authGuard, adminGuard],
    data: { title: 'Panel de Administración' }
  },
  {
    path: 'admin/pregunta/:id',
    loadComponent: () => import('./features/admin/question-editor.component').then(m => m.QuestionEditorComponent),
    canActivate: [authGuard, adminGuard],
    data: { title: 'Editor de Pregunta' }
  },
  {
    path: 'admin/recursos',
    loadComponent: () => import('./features/admin/admin-recursos.component').then(m => m.AdminRecursosComponent),
    canActivate: [authGuard, adminGuard],
    data: { title: 'Admin · Recursos' }
  },
  {
    path: 'admin/bugs',
    loadComponent: () => import('./features/admin/admin-bugs.component').then(m => m.AdminBugsComponent),
    canActivate: [authGuard, adminGuard],
    data: { title: 'Admin · Reportes de Errores' }
  },
  {
    path: 'admin/suscripciones',
    loadComponent: () => import('./features/admin/admin-subscriptions.component').then(m => m.AdminSubscriptionsComponent),
    canActivate: [authGuard, adminGuard],
    data: { title: 'Admin · Suscripciones' }
  },
  {
    path: 'admin/usuarios',
    loadComponent: () => import('./features/admin/admin-users.component').then(m => m.AdminUsersComponent),
    canActivate: [authGuard, adminGuard],
    data: { title: 'Admin · Usuarios' }
  },
  {
    path: 'admin/modo-infinito',
    loadComponent: () => import('./features/admin/admin-infinite-mode.component').then(m => m.AdminInfiniteModeComponent),
    canActivate: [authGuard, adminGuard],
    data: { title: 'Admin · Modo Infinito' }
  },
  {
    path: 'encuentra-tu-carrera',
    loadComponent: () => import('./features/career-finder/career-finder.component').then(m => m.CareerFinderComponent),
    canActivate: [authGuard, emailVerifiedGuard],
    data: { title: 'Encuentra tu Carrera' }
  },
  {
    path: 'mente-veloz',
    loadComponent: () => import('./features/mente-veloz/mente-veloz.component').then(m => m.MenteVelozComponent),
    canActivate: [authGuard, emailVerifiedGuard],
    data: { title: 'Mente Veloz' }
  },
  {
    path: 'calculadora-nem',
    loadComponent: () => import('./features/nem-calculator/nem-calculator.component').then(m => m.NemCalculatorComponent),
    canActivate: [authGuard, emailVerifiedGuard],
    data: { title: 'Calculadora NEM' }
  },
  {
    path: 'recursos',
    loadComponent: () => import('./features/recursos/recursos.component').then(m => m.RecursosComponent),
    canActivate: [authGuard, emailVerifiedGuard],
    data: { title: 'Recursos Adicionales' }
  },
  {
    path: 'pago-resultado',
    loadComponent: () => import('./features/payment/payment-result.component').then(m => m.PaymentResultComponent),
    canActivate: [authGuard, emailVerifiedGuard],
    data: { title: 'Resultado del Pago' }
  },
  {
    path: 'soporte',
    loadComponent: () => import('./features/soporte/soporte.component').then(m => m.SoporteComponent),
    data: { title: 'Centro de Soporte', description: '¿Tienes dudas o problemas con la plataforma? Encuentra respuestas y contáctanos desde el Centro de Soporte de EstudiaUni.cl.' }
  },
  {
    path: 'trabaja-con-nosotros',
    loadComponent: () => import('./features/trabaja/trabaja.component').then(m => m.TrabajaComponent),
    data: { title: 'Trabaja con Nosotros', description: 'Únete al Programa de Embajadores de EstudiaUni.cl: comparte la plataforma con tu comunidad y genera ingresos por cada estudiante que se una.' }
  },
  ];

/** Comodín 404. Debe ir SIEMPRE el último de la lista. */
export const wildcardRoute: Route = {
  path: '**',
  loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent),
  data: { title: 'Página no encontrada', noIndex: true }
};
