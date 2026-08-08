import { Routes } from '@angular/router';
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

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify-email', component: VerifyEmailComponent, canActivate: [authGuard] },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile-settings.component').then(m => m.ProfileSettingsComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/profile/profile-settings.component').then(m => m.ProfileSettingsComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  { path: 'modules', component: ModulesListComponent, canActivate: [authGuard, emailVerifiedGuard] },
  { path: 'topic/:moduleId/:topicId', component: TopicDetailComponent, canActivate: [authGuard, emailVerifiedGuard] },
  { path: 'simulation/:attemptId', component: SimulationRunnerComponent, canActivate: [authGuard, emailVerifiedGuard] },
  // Ensayos PAES
  { path: 'ensayos', component: EnsayosListComponent, canActivate: [authGuard, emailVerifiedGuard] },
  { path: 'ensayo/:id/run', component: EnsayoRunnerComponent, canActivate: [authGuard, emailVerifiedGuard] },
  { path: 'ensayo/:id/review', component: EnsayoReviewComponent, canActivate: [authGuard, emailVerifiedGuard] },
  // Mini Ensayos
  {
    path: 'mini-ensayo',
    loadComponent: () => import('./features/mini-ensayos/mini-ensayo-setup.component').then(m => m.MiniEnsayoSetupComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  {
    path: 'mini-ensayo/run',
    loadComponent: () => import('./features/mini-ensayos/mini-ensayo-runner.component').then(m => m.MiniEnsayoRunnerComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  {
    path: 'mini-ensayo/review',
    loadComponent: () => import('./features/mini-ensayos/mini-ensayo-review.component').then(m => m.MiniEnsayoReviewComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  // Ruta de Aprendizaje (Duolingo-style)
  {
    path: 'ruta',
    loadComponent: () => import('./features/learning-path/learning-path.component').then(m => m.LearningPathComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  {
    path: 'ruta/mat1',
    data: { materiaId: 'mat1' },
    loadComponent: () => import('./features/learning-path/materia-math-path.component').then(m => m.MateriaMathPathComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  {
    path: 'ruta/mat2',
    data: { materiaId: 'mat2' },
    loadComponent: () => import('./features/learning-path/materia-math-path.component').then(m => m.MateriaMathPathComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  {
    path: 'ruta/historia',
    data: { materiaId: 'historia' },
    loadComponent: () => import('./features/learning-path/materia-historia-path.component').then(m => m.MateriaHistoriaPathComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  
  // BIOLOGIA AISLADA
  {
    path: 'ruta/biologia',
    data: { materiaId: 'biologia' },
    loadComponent: () => import('./features/learning-path/materia-biologia-path.component').then(m => m.MateriaBiologiaPathComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  {
    path: 'ruta/ciencias-biologia',
    data: { materiaId: 'ciencias-biologia' },
    loadComponent: () => import('./features/learning-path/materia-biologia-path.component').then(m => m.MateriaBiologiaPathComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  {
    path: 'ruta/biologia/:capituloId',
    loadComponent: () => import('./features/learning-path/capitulo-biologia-detail.component').then(m => m.CapituloBiologiaDetailComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  {
    path: 'ruta/ciencias-biologia/:capituloId',
    loadComponent: () => import('./features/learning-path/capitulo-biologia-detail.component').then(m => m.CapituloBiologiaDetailComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  {
    path: 'ruta/biologia/:capituloId/:seccionId',
    loadComponent: () => import('./features/learning-path/seccion-biologia-detail.component').then(m => m.SeccionBiologiaDetailComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  {
    path: 'ruta/ciencias-biologia/:capituloId/:seccionId',
    loadComponent: () => import('./features/learning-path/seccion-biologia-detail.component').then(m => m.SeccionBiologiaDetailComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },

  // FISICA AISLADA
  {
    path: 'ruta/fisica',
    data: { materiaId: 'fisica' },
    loadComponent: () => import('./features/learning-path/materia-fisica-path.component').then(m => m.MateriaFisicaPathComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  {
    path: 'ruta/ciencias-fisica',
    data: { materiaId: 'ciencias-fisica' },
    loadComponent: () => import('./features/learning-path/materia-fisica-path.component').then(m => m.MateriaFisicaPathComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  {
    path: 'ruta/fisica/:capituloId',
    loadComponent: () => import('./features/learning-path/capitulo-fisica-detail.component').then(m => m.CapituloFisicaDetailComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  {
    path: 'ruta/ciencias-fisica/:capituloId',
    loadComponent: () => import('./features/learning-path/capitulo-fisica-detail.component').then(m => m.CapituloFisicaDetailComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  {
    path: 'ruta/fisica/:capituloId/:seccionId',
    loadComponent: () => import('./features/learning-path/seccion-fisica-detail.component').then(m => m.SeccionFisicaDetailComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  {
    path: 'ruta/ciencias-fisica/:capituloId/:seccionId',
    loadComponent: () => import('./features/learning-path/seccion-fisica-detail.component').then(m => m.SeccionFisicaDetailComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },

  {
    path: 'ruta/quimica',
    data: { materiaId: 'quimica' },
    loadComponent: () => import('./features/learning-path/materia-quimica-path.component').then(m => m.MateriaQuimicaPathComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  {
    path: 'ruta/ciencias-quimica',
    data: { materiaId: 'ciencias-quimica' },
    loadComponent: () => import('./features/learning-path/materia-quimica-path.component').then(m => m.MateriaQuimicaPathComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  {
    path: 'ruta/ciencias',
    data: { materiaId: 'ciencias' },
    loadComponent: () => import('./features/learning-path/materia-quimica-path.component').then(m => m.MateriaQuimicaPathComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  {
    path: 'ruta/:materiaId',
    loadComponent: () => import('./features/learning-path/materia-path.component').then(m => m.MateriaPathComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  {
    path: 'ruta/:materiaId/:capituloId',
    loadComponent: () => import('./features/learning-path/capitulo-detail.component').then(m => m.CapituloDetailComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  {
    path: 'ruta/:materiaId/:capituloId/:seccionId',
    loadComponent: () => import('./features/learning-path/seccion-detail.component').then(m => m.SeccionDetailComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  {
    path: 'test-math/:seccionId',
    loadComponent: () => import('./features/learning-path/seccion-test-math.component').then(m => m.SeccionTestMathComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  {
    path: 'test-math/:seccionId/review',
    loadComponent: () => import('./features/learning-path/seccion-test-review-math.component').then(m => m.SeccionTestReviewMathComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  {
    path: 'test/:seccionId',
    loadComponent: () => import('./features/learning-path/seccion-test.component').then(m => m.SeccionTestComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  {
    path: 'test/:seccionId/review',
    loadComponent: () => import('./features/learning-path/seccion-test-review.component').then(m => m.SeccionTestReviewComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  // ─── Admin Panel ───
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-panel.component').then(m => m.AdminPanelComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/pregunta/:id',
    loadComponent: () => import('./features/admin/question-editor.component').then(m => m.QuestionEditorComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/recursos',
    loadComponent: () => import('./features/admin/admin-recursos.component').then(m => m.AdminRecursosComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/bugs',
    loadComponent: () => import('./features/admin/admin-bugs.component').then(m => m.AdminBugsComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/suscripciones',
    loadComponent: () => import('./features/admin/admin-subscriptions.component').then(m => m.AdminSubscriptionsComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'encuentra-tu-carrera',
    loadComponent: () => import('./features/career-finder/career-finder.component').then(m => m.CareerFinderComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  {
    path: 'mente-veloz',
    loadComponent: () => import('./features/mente-veloz/mente-veloz.component').then(m => m.MenteVelozComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  {
    path: 'calculadora-nem',
    loadComponent: () => import('./features/nem-calculator/nem-calculator.component').then(m => m.NemCalculatorComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  {
    path: 'recursos',
    loadComponent: () => import('./features/recursos/recursos.component').then(m => m.RecursosComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  {
    path: 'pago-resultado',
    loadComponent: () => import('./features/payment/payment-result.component').then(m => m.PaymentResultComponent),
    canActivate: [authGuard, emailVerifiedGuard]
  },
  {
    path: 'soporte',
    loadComponent: () => import('./features/soporte/soporte.component').then(m => m.SoporteComponent),
  },
  {
    path: 'trabaja-con-nosotros',
    loadComponent: () => import('./features/trabaja/trabaja.component').then(m => m.TrabajaComponent),
  },
  { path: '**', redirectTo: '' }
];

