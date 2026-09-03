import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../../token/token-service';

export const platformAdminGuard: CanActivateFn = async (route, state) => {
  const tokenService = inject(TokenService);
  if (!tokenService.isPlatformAdmin) {
    await tokenService.logout();
    return false;
  }
  return true;
};
