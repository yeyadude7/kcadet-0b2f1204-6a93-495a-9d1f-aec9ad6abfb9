import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Tasks } from './pages/tasks/tasks';
import { Audit } from './pages/audit/audit';
import { Shell } from './layout/shell/shell';
import { authGuard } from './core/auth.guard';
import { ownerAdminGuard } from './core/role.guard';

export const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'board' },

  { path: 'login', component: Login },

  {
    path: '',
    component: Shell,
    canActivate: [authGuard],
    children: [
      { path: 'board', component: Tasks },
      { path: 'audit', component: Audit, canActivate: [ownerAdminGuard] },
    ],
  },

  { path: '**', redirectTo: 'board' },
];
