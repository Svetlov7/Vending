import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'vending' },
  {
    path: 'vending',
    loadComponent: () =>
      import('@features/vending/vending-machine').then((m) => m.VendingMachine),
  },
  {
    path: 'admin',
    loadComponent: () => import('@features/admin/admin-panel').then((m) => m.AdminPanel),
  },
  { path: '**', redirectTo: 'vending' },
];
