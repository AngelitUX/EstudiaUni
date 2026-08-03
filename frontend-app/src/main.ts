
window.onerror = function(message, source, lineno, colno, error) {
  fetch('http://localhost:3000/log-error', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, source, lineno, colno, stack: error ? error.stack : '' })
  }).catch(e => console.error(e));
};
window.addEventListener('unhandledrejection', function(event) {
  fetch('http://localhost:3000/log-error', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Unhandled Promise Rejection', reason: event.reason ? event.reason.stack || event.reason : 'Unknown' })
  }).catch(e => console.error(e));
});

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
