import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing/landing.component').then(m => m.LandingComponent),
    title: 'Blaze — Where Ideas Catch Fire',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent),
    title: 'Blaze — Login',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then(m => m.RegisterComponent),
    title: 'Blaze — Register',
  },
  {
    path: 'workspace',
    loadComponent: () =>
      import('./pages/workspace/workspace.component').then(m => m.WorkspaceComponent),
    title: 'Blaze — Workspace',
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin/admin.component').then(m => m.AdminComponent),
    title: 'Blaze — Admin Panel',
    canActivate: [adminGuard],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
