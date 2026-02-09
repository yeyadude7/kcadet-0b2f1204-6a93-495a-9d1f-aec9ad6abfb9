import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export const ownerAdminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const role = auth.getUser()?.role;
  if (role === 'Owner' || role === 'Admin') return true;

  router.navigateByUrl('/board');
  return false;
};
