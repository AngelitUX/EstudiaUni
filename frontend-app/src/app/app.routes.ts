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
  { path: '**', redirectTo: '' }
];

