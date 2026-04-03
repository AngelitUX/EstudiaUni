import { Injectable, inject } from '@angular/core';
import { Auth, authState, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile, GoogleAuthProvider, signInWithPopup, sendEmailVerification } from '@angular/fire/auth';
import { User } from 'firebase/auth';
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

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    const result = await signInWithPopup(this.auth, provider);
    
    // Guardar/actualizar perfil en Firestore
    await this.firestoreService.saveUserProfile({
      displayName: result.user.displayName || '',
      email: result.user.email || ''
    });
    
    return result;
  }

  async register(email: string, pass: string, name: string) {
    let userCreated = false;
    let cred: any = null;
    
    try {
      // 1. Crear cuenta en Firebase Auth
      cred = await createUserWithEmailAndPassword(this.auth, email, pass);
      userCreated = true;
      
      // 2. Actualizar displayName
      await updateProfile(cred.user, { displayName: name });
      
      // 3. Enviar correo de verificación - si falla, eliminar cuenta
      await sendEmailVerification(cred.user, {
        url: window.location.origin + '/login',
        handleCodeInApp: false
      });
      
      // 4. Crear perfil de usuario en Firestore
      await this.firestoreService.saveUserProfile({
        displayName: name,
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
}
