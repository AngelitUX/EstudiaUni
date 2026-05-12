import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FirestoreService } from './core/services/firestore.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'frontend-app';
  private firestoreService = inject(FirestoreService);

  ngOnInit() {
    this.firestoreService.getUserProfile().subscribe(profile => {
      if (profile) {
        const classList = document.body.classList;
        if (profile.dyslexiaFont) classList.add('dyslexia-font'); else classList.remove('dyslexia-font');
        if (profile.highContrast) classList.add('high-contrast'); else classList.remove('high-contrast');
        classList.remove('font-large', 'font-xlarge');
        if (profile.fontSize === 'large') classList.add('font-large');
        else if (profile.fontSize === 'xlarge') classList.add('font-xlarge');
      }
    });
  }
}
