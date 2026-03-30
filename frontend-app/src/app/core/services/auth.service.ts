import { Injectable, inject } from '@angular/core';
import { Auth, authState, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from '@angular/fire/auth';
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

  async register(email: string, pass: string, name: string) {
    const cred = await createUserWithEmailAndPassword(this.auth, email, pass);
    
    // Actualizar displayName en Firebase Auth
    await updateProfile(cred.user, { displayName: name });
    
    // Crear perfil de usuario en Firestore
    await this.firestoreService.saveUserProfile({
      displayName: name,
      email: email
    });
    
    return cred;
  }

  logout() {
    return from(signOut(this.auth));
  }
}
