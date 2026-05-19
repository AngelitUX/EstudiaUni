import { Component, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FirestoreService } from './core/services/firestore.service';
import { PaymentService } from './core/services/payment.service';
import { PricingModalComponent } from './features/payment/pricing-modal.component';

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
