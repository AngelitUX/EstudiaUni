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
  isGift?: boolean;
  amount?: number;
  buyOrder?: string;
  authorizationCode?: string;
  paymentType?: string;
  cardDetail?: {
    card_number: string;
  };
}

export interface RandomRecipientResponse {
  uid: string;
  email: string;
}

export interface CouponValidationResponse {
  valid: boolean;
  message: string;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  discountAmount?: number;
  finalAmount?: number;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private http = inject(HttpClient);
  
  showPricingModal = signal<boolean>(false);
  skipPlanStep = signal<boolean>(false);
  selectedPlanType = signal<'monthly' | 'yearly'>('monthly');

  openPricingModal(skipToRecipient = false, planType?: 'monthly' | 'yearly') {
    if (planType) {
      this.selectedPlanType.set(planType);
    }
    this.skipPlanStep.set(skipToRecipient);
    this.showPricingModal.set(true);
  }

  closePricingModal() {
    this.showPricingModal.set(false);
    this.skipPlanStep.set(false);
  }

  /**
   * Validate a discount coupon code against the backend.
   */
  validateCoupon(code: string, planType: 'monthly' | 'yearly'): Observable<CouponValidationResponse> {
    const baseUrl = environment.apiUrl || 'http://localhost:3000';
    return this.http.post<CouponValidationResponse>(`${baseUrl}/api/subscriptions/validate-coupon`, { code, planType });
  }

  /**
   * Initiate a Webpay transaction.
   * If targetUid is provided, premium will be granted to that user after payment (gift flow).
   * If couponCode is provided, the discount will be applied to the amount.
   */
  createWebpayTransaction(
    planType: 'monthly' | 'yearly',
    returnUrl: string,
    targetUid?: string,
    couponCode?: string,
  ): Observable<WebpayInitResponse> {
    const baseUrl = environment.apiUrl || 'http://localhost:3000';
    const url = `${baseUrl}/api/subscriptions/webpay/create`;
    const body: any = { planType, returnUrl };
    if (targetUid) body.targetUid = targetUid;
    if (couponCode) body.couponCode = couponCode;
    return this.http.post<WebpayInitResponse>(url, body);
  }

  /**
   * Commit/Confirm a Webpay transaction
   */
  commitWebpayTransaction(token: string): Observable<WebpayCommitResponse> {
    const baseUrl = environment.apiUrl || 'http://localhost:3000';
    const url = `${baseUrl}/api/subscriptions/webpay/commit`;
    return this.http.post<WebpayCommitResponse>(url, { token });
  }

  /**
   * Get a random free-tier user to gift premium to
   */
  getRandomFreeUser(): Observable<RandomRecipientResponse> {
    const baseUrl = environment.apiUrl || 'http://localhost:3000';
    const url = `${baseUrl}/api/subscriptions/webpay/random-recipient`;
    return this.http.get<RandomRecipientResponse>(url);
  }
}
