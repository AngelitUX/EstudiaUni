import { Component, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FirestoreService } from './core/services/firestore.service';
import { PaymentService } from './core/services/payment.service';
import { PricingModalComponent } from './features/payment/pricing-modal.component';
import { KeyboardNavigationService } from './core/services/keyboard-navigation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, PricingModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'frontend-app';
  private firestoreService = inject(FirestoreService);
  public readonly paymentService = inject(PaymentService);
  private router = inject(Router);
  private keyboardNavService = inject(KeyboardNavigationService);

  @HostListener('document:click', ['$event'])
  onGlobalClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const isPromoCard = target && (
      target.classList.contains('sidebar-promo-card') || 
      target.closest('.sidebar-promo-card')
    );
    
    if (isPromoCard) {
      event.preventDefault();
      event.stopPropagation();
      this.paymentService.openPricingModal();
    }
  }

  ngOnInit() {
    this.keyboardNavService.init();

    // Scroll to top on navigation change
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      setTimeout(() => {
        const scrollables = document.querySelectorAll('.main-content, .review-container, .question-area, .runner-page, .review-page');
        scrollables.forEach(el => el.scrollTop = 0);
      }, 50);
    });

    this.firestoreService.getUserProfile().subscribe(profile => {
      if (profile) {
        const classList = document.body.classList;
        if (profile.dyslexiaFont) classList.add('dyslexia-font'); else classList.remove('dyslexia-font');
        if (profile.highContrast) classList.add('high-contrast'); else classList.remove('high-contrast');
        classList.remove('font-large', 'font-xlarge', 'spacing-wide', 'spacing-xwide');
        if (profile.fontSize === 'large') classList.add('font-large');
        else if (profile.fontSize === 'xlarge') classList.add('font-xlarge');
        
        if (profile.textSpacing === 'wide') classList.add('spacing-wide');
        else if (profile.textSpacing === 'xwide') classList.add('spacing-xwide');
      }
    });
  }
}
