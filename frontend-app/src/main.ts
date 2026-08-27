import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

// Reporte de errores del navegador al backend — SOLO en desarrollo.
//
// Antes esto se instalaba siempre, con la URL 'http://localhost:3000/log-error'
// escrita a mano (ni siquiera environment.apiUrl). En el sitio publicado eso no
// apunta a ningun servidor nuestro: el navegador de CADA visitante intentaria
// conectarse a SU PROPIA maquina, en su puerto 3000. Ademas de fallar en cada
// error y ensuciar la consola, le mandaria la traza del error a cualquier cosa
// que esa persona tuviera escuchando en ese puerto.
//
// Con environment.apiUrl + la guarda de production, en el build de produccion
// este bloque no se instala (y el compilador lo elimina del bundle).
if (!environment.production) {
  const reportarError = (cuerpo: Record<string, unknown>) => {
    fetch(`${environment.apiUrl}/log-error`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpo),
    }).catch(() => {
      // El backend local no esta levantado: no es motivo para ensuciar la
      // consola encima del error que se estaba intentando reportar.
    });
  };

  window.onerror = function (message, source, lineno, colno, error) {
    reportarError({ message, source, lineno, colno, stack: error ? error.stack : '' });
  };

  window.addEventListener('unhandledrejection', function (event) {
    reportarError({
      message: 'Unhandled Promise Rejection',
      reason: event.reason ? event.reason.stack || event.reason : 'Unknown',
    });
  });
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
