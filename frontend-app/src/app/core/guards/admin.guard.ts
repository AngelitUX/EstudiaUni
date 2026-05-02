import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminService } from '../../features/admin/services/admin.service';

export const adminGuard: CanActivateFn = async () => {
  const adminService = inject(AdminService);
  const router = inject(Router);

  // Wait for admin check if not done yet
  if (adminService.isAdmin() === null) {
    // Give it a moment to resolve (auth state subscription)
    await new Promise<void>(resolve => {
      const check = setInterval(() => {
        if (adminService.isAdmin() !== null) {
          clearInterval(check);
          resolve();
        }
      }, 100);
      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(check);
        resolve();
      }, 5000);
    });
  }

  if (adminService.isAdmin()) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
