import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface WebpayInitResponse {
  token: string;
  url: string;
  amount: number;
  buyOrder: string;
}

export interface WebpayCommitResponse {
  success: boolean;
  message: string;
  amount?: number;
  buyOrder?: string;
  authorizationCode?: string;
  paymentType?: string;
  cardDetail?: {
    card_number: string;
  };
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private http = inject(HttpClient);
  
  showPricingModal = signal<boolean>(false);

  openPricingModal() {
    this.showPricingModal.set(true);
  }

  closePricingModal() {
    this.showPricingModal.set(false);
  }

  /**
   * Initiate a Webpay transaction
   */
  createWebpayTransaction(planType: 'monthly' | 'yearly', returnUrl: string): Observable<WebpayInitResponse> {
    const baseUrl = environment.apiUrl || 'http://localhost:3000';
    const url = `${baseUrl}/api/subscriptions/webpay/create`;
    return this.http.post<WebpayInitResponse>(url, { planType, returnUrl });
  }

  /**
   * Commit/Confirm a Webpay transaction
   */
  commitWebpayTransaction(token: string): Observable<WebpayCommitResponse> {
    const baseUrl = environment.apiUrl || 'http://localhost:3000';
    const url = `${baseUrl}/api/subscriptions/webpay/commit`;
    return this.http.post<WebpayCommitResponse>(url, { token });
  }
}
