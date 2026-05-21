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
        router.navigate(['/login']);
        resolve(false);
        return;
      }

      // Si el email ya está verificado en el objeto local, no hace falta recargar
      if (user.emailVerified) {
        resolve(true);
        return;
      }

      // Solo recargar si NO está verificado localmente (cuentas de correo/contraseña pendientes)
      user.reload().then(() => {
        if (user.emailVerified) {
          resolve(true);
        } else {
          router.navigate(['/verify-email']);
          resolve(false);
        }
      }).catch(() => {
        // Si el reload falla (COOP, red, etc.), dejar pasar si el usuario existe
        // para no bloquear a usuarios válidos por problemas de red
        resolve(true);
      });
    });
  });
};
