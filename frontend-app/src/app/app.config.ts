import { ApplicationConfig, PLATFORM_ID, inject, provideZoneChangeDetection } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { initializeApp, provideFirebaseApp, getApp } from '@angular/fire/app';
import { getAuth, provideAuth, initializeAuth, inMemoryPersistence } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAppCheck, initializeAppCheck, CustomProvider } from '@angular/fire/app-check';
import { CloudflareProviderOptions } from '@cloudflare/turnstile-firebase-app-check';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideClientHydration } from '@angular/platform-browser';

// Detección de plataforma "plana", sin inject(): App Check ni siquiera debe registrarse
// como provider en el servidor. CloudflareProviderOptions toca document.body/window en su
// propio constructor (para inyectar el widget invisible de Turnstile) — no es solo que
// initializeAppCheck() no sirva en Node, es que instanciar la clase ya revienta ahí. Nada
// de lo que se prerenderiza (home, login, etc.) necesita un token de App Check, así que la
// solución más simple y segura es que el provider entero no exista fuera del navegador.
const isBrowserRuntime = typeof window !== 'undefined';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })
    ),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => {
      // getAuth()'s default persistence hierarchy probes window/indexedDB asynchronously to
      // pick a storage backend — during SSR/prerendering there's no window at all, and that
      // probe never resolves, hanging the render instead of erroring. initializeAuth() with
      // an explicit persistence skips the probe entirely; the browser keeps getAuth()'s
      // normal (indexedDB/localStorage) persistence untouched.
      return isPlatformBrowser(inject(PLATFORM_ID))
        ? getAuth(getApp())
        : initializeAuth(getApp(), { persistence: inMemoryPersistence });
    }),
    provideFirestore(() => getFirestore(getApp())),
    provideClientHydration(),
    ...(isBrowserRuntime && (environment.production || (typeof location !== 'undefined' && location.hostname !== 'localhost')) ? [
      provideAppCheck(() => {
        const cpo = new CloudflareProviderOptions(
          environment.turnstileTokenExchangeUrl,
          environment.turnstileSiteKey
        );
        return initializeAppCheck(getApp(), {
          provider: new CustomProvider(cpo),
          isTokenAutoRefreshEnabled: true
        });
      })
    ] : [])
  ]
};
