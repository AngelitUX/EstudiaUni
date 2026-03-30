import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { HomeComponent } from './features/auth/home.component';
import { ModulesListComponent } from './features/modules/modules-list/modules-list.component';
import { TopicDetailComponent } from './features/modules/topic-detail/topic-detail.component';
import { SimulationRunnerComponent } from './features/simulations/simulation-runner/simulation-runner.component';
import { EnsayosListComponent } from './features/simulations/ensayos-list.component';
import { EnsayoRunnerComponent } from './features/simulations/ensayo-runner.component';
import { EnsayoReviewComponent } from './features/simulations/ensayo-review.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  { path: 'modules', component: ModulesListComponent, canActivate: [authGuard] },
  { path: 'topic/:moduleId/:topicId', component: TopicDetailComponent, canActivate: [authGuard] },
  { path: 'simulation/:attemptId', component: SimulationRunnerComponent, canActivate: [authGuard] },
  // Ensayos PAES
  { path: 'ensayos', component: EnsayosListComponent, canActivate: [authGuard] },
  { path: 'ensayo/:id/run', component: EnsayoRunnerComponent, canActivate: [authGuard] },
  { path: 'ensayo/:id/review', component: EnsayoReviewComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];

