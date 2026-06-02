import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/projects/projects').then(m => m.Projects),
  },
  {
    path: 'experience',
    loadComponent: () => import('./pages/experience/experience').then(m => m.Experience),
  },
  {
    path: 'bio',
    loadComponent: () => import('./pages/bio/bio').then(m => m.Bio),
  },
  {
    path: 'project/:id',
    loadComponent: () => import('./pages/project-detail/project-detail').then(m => m.ProjectDetail),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
