import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Auth } from '@angular/fire/auth';

export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  // Use a Promise with onAuthStateChanged so we wait for Firebase to restore
  // the session from persistence (avoids the initial null emission race condition
  // that occurs on hard refresh with take(1) on authState).
  return new Promise<boolean | any>((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      if (user) {
        resolve(true);
      } else {
        resolve(router.createUrlTree(['/login']));
      }
    });
  });
};
