import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';

export const emailVerifiedGuard = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  return new Promise<boolean>((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      
      if (!user) {
        // No hay usuario, redirigir a login
        router.navigate(['/login']);
        resolve(false);
        return;
      }

      // Recargar el usuario para obtener el estado más actualizado
      user.reload().then(() => {
        if (user.emailVerified) {
          // Email verificado, permitir acceso
          resolve(true);
        } else {
          // Email NO verificado, redirigir a página de verificación
          router.navigate(['/verify-email']);
          resolve(false);
        }
      }).catch(() => {
        router.navigate(['/verify-email']);
        resolve(false);
      });
    });
  });
};
