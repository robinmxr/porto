import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/projects/projects').then(m => m.Projects),
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
