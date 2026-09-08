import { Injectable, inject } from '@angular/core';
import { Auth, authState, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile, GoogleAuthProvider, signInWithRedirect, signInWithPopup, getRedirectResult, sendEmailVerification, sendPasswordResetEmail } from '@angular/fire/auth';
import { User, UserCredential, getAdditionalUserInfo } from 'firebase/auth';
import { Observable, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly firestoreService = inject(FirestoreService);

  readonly user$: Observable<User | null> = authState(this.auth);
  
  readonly isLoggedIn$: Observable<boolean> = this.user$.pipe(
    map(user => !!user)
  );

  get currentUser(): User | null {
    return this.auth.currentUser;
  }

  async getToken(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (user) {
      return user.getIdToken();
    }
    return null;
  }

  login(email: string, pass: string) {
    return from(signInWithEmailAndPassword(this.auth, email, pass)).pipe(
      tap(async (cred) => {
        // Actualizar lastLogin en Firestore
        await this.firestoreService.saveUserProfile({});
      })
    );
  }

  /**
   * Inicia sesión con Google vía REDIRECCIÓN, no popup. `signInWithPopup` dependía de que
   * un iframe de terceros (`<project>.firebaseapp.com/__/auth/iframe`) pudiera comunicarse
   * de vuelta con la ventana que lo abrió usando storage compartido entre ventanas — con
   * "Total Cookie Protection" de Firefox (partición dinámica de storage de terceros, activa
   * por defecto) esa comunicación se corta y la ventana de Google nunca llega a abrirse: el
   * botón se queda cargando para siempre, sin ningún error (confirmado en producción el
   * 2026-09-04 — un usuario real en Firefox + uBlock Origin). `signInWithRedirect` navega la
   * MISMA pestaña a Google en vez de depender de esa comunicación entre ventanas, así que no
   * le afecta el bloqueo de cookies/storage de terceros.
   *
   * Esta llamada NO devuelve el resultado del login — la página navega fuera de aquí. El
   * resultado se recoge después, cuando Google redirige de vuelta y la app se recarga, con
   * `handleGoogleRedirectResult()` (ver `AppComponent.ngOnInit`).
   */
  async startGoogleLogin(): Promise<UserCredential | null> {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    const isLocalhost = typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);

    if (isLocalhost) {
      // En localhost (http://), signInWithRedirect está bloqueado por el particionamiento de storage
      // y políticas de seguridad del navegador (getRedirectResult siempre retorna null).
      // Se utiliza signInWithPopup que resuelve directamente en la misma ventana sin perder sesión.
      const result = await signInWithPopup(this.auth, provider);
      await this.processSuccessfulGoogleLogin(result);
      return result;
    }

    if (typeof window !== 'undefined') {
      try { sessionStorage.setItem('google_login_pending', 'true'); } catch {}
    }
    await signInWithRedirect(this.auth, provider);
    return null;
  }

  /**
   * Lógica unificada para procesar el perfil tras un login exitoso con Google.
   */
  async processSuccessfulGoogleLogin(result: UserCredential): Promise<void> {
    const googleUser = result.user;
    const googleEmail = googleUser.email?.toLowerCase().trim();
    const addInfo = getAdditionalUserInfo(result);
    const isNewUser = addInfo?.isNewUser ?? false;

    // Solo para usuarios NUEVOS en Auth buscamos si existía un perfil previo con diferente UID para migrar
    if (isNewUser && googleEmail) {
      try {
        const existingUid = await this.firestoreService.findUidByEmail(googleEmail);
        if (existingUid && existingUid !== googleUser.uid) {
          await this.firestoreService.migrateUserData(existingUid, googleUser.uid);
        }
      } catch (migErr) {
        console.error('Error durante migración de usuario:', migErr);
      }
    }

    // Guardar/actualizar perfil en Firestore.
    // Para usuarios existentes se ejecuta en segundo plano sin retrasar el paso al Dashboard.
    const savePromise = this.firestoreService.saveUserProfile({
      displayName: googleUser.displayName || '',
      email: googleEmail || '',
      emailVerified: true
    }).catch(err => console.error('Error guardando perfil post-login:', err));

    if (isNewUser) {
      await savePromise;
    }
  }

  /**
   * Se llama UNA VEZ al arrancar la app (`AppComponent.ngOnInit`, solo en el navegador) para
   * recoger el resultado de un `startGoogleLogin()` anterior, si la app se acaba de recargar
   * por volver de ese redirect. En un arranque normal (sin redirect pendiente) resuelve a
   * `null` de inmediato, sin ninguna llamada de red — es el patrón que la propia
   * documentación de Firebase pide para `signInWithRedirect`.
   */
  async handleGoogleRedirectResult(): Promise<UserCredential | null> {
    let result: UserCredential | null = null;
    try {
      result = await getRedirectResult(this.auth);
      if (!result) return null;

      await this.processSuccessfulGoogleLogin(result);
      return result;
    } finally {
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.removeItem('google_login_pending');
          window.dispatchEvent(new CustomEvent('google_redirect_done', { detail: { success: !!result } }));
        } catch {}
      }
    }
  }

  async register(email: string, pass: string, name: string) {
    let userCreated = false;
    let cred: UserCredential | null = null;
    
    // Sanear el nombre quitando saltos de línea
    const cleanName = (name || '').replace(/[\r\n]+/g, ' ').trim();
    
    try {
      // 1. Crear cuenta en Firebase Auth
      cred = await createUserWithEmailAndPassword(this.auth, email, pass);
      userCreated = true;
      
      // 2. Actualizar displayName
      await updateProfile(cred.user, { displayName: cleanName });
      
      // 3. Enviar correo de verificación - si falla, eliminar cuenta
      await sendEmailVerification(cred.user, {
        url: window.location.origin + '/login',
        handleCodeInApp: false
      });
      
      // 4. Crear perfil de usuario en Firestore
      await this.firestoreService.saveUserProfile({
        displayName: cleanName,
        email: email,
        emailVerified: false
      });
      
      // 5. Cerrar sesión - el usuario NO debe quedar logueado hasta verificar
      await signOut(this.auth);
      
      return cred;
    } catch (error: any) {
      // Si la cuenta fue creada pero hubo error después, eliminarla
      if (userCreated && cred?.user) {
        try {
          await cred.user.delete();
        } catch (deleteError) {
          console.error('Error al eliminar usuario:', deleteError);
        }
      }
      
      // Asegurar que el usuario no quede logueado
      try {
        await signOut(this.auth);
      } catch (signOutError) {
        // Ignorar errores de signOut
      }
      
      throw error;
    }
  }

  async resendVerificationEmail() {
    const user = this.auth.currentUser;
    if (user && !user.emailVerified) {
      await sendEmailVerification(user, {
        url: window.location.origin + '/dashboard',
        handleCodeInApp: false
      });
    }
  }

  logout() {
    return from(signOut(this.auth));
  }

  async resetPassword(email: string) {
    await sendPasswordResetEmail(this.auth, email);
  }
}
