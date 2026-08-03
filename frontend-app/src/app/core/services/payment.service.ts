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

export interface ManualTransferData {
  planType: 'monthly' | 'yearly';
  bankName: string;
  transferNumber: string;
  amount: number;
  payerEmail?: string;
  targetUid?: string;
  receiptUrl?: string;
  couponCode?: string;
}

export interface TransactionRecord {
  id: string;
  type: 'webpay' | 'transfer';
  buyOrder?: string;
  transferNumber?: string;
  bankName?: string;
  payerEmail?: string;
  payerUid?: string;
  recipientUid?: string;
  amount: number;
  planType: 'monthly' | 'yearly';
  status: 'pending' | 'completed' | 'failed' | 'rejected' | 'pending_approval' | 'approved';
  paymentType?: string;
  authorizationCode?: string;
  receiptUrl?: string;
  createdAt: string | Date;
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
   * Submit manual bank transfer report
   */
  submitManualTransfer(data: ManualTransferData): Observable<{ success: boolean; message: string; transferId: string }> {
    const baseUrl = environment.apiUrl || 'http://localhost:3000';
    const url = `${baseUrl}/api/subscriptions/transfer/submit`;
    return this.http.post<{ success: boolean; message: string; transferId: string }>(url, data);
  }

  /**
   * Get a random free-tier user to gift premium to
   */
  getRandomFreeUser(): Observable<RandomRecipientResponse> {
    const baseUrl = environment.apiUrl || 'http://localhost:3000';
    const url = `${baseUrl}/api/subscriptions/webpay/random-recipient`;
    return this.http.get<RandomRecipientResponse>(url);
  }

  // ── ADMIN PAYMENT ENDPOINTS ──

  getAdminTransactions(): Observable<TransactionRecord[]> {
    const baseUrl = environment.apiUrl || 'http://localhost:3000';
    return this.http.get<TransactionRecord[]>(`${baseUrl}/api/admin/subscriptions/transactions`);
  }

  adminGrantSubscription(data: { targetEmailOrUid: string; durationMonths: number; planType?: 'monthly' | 'yearly'; reason?: string }): Observable<{ success: boolean; message: string }> {
    const baseUrl = environment.apiUrl || 'http://localhost:3000';
    return this.http.post<{ success: boolean; message: string }>(`${baseUrl}/api/admin/subscriptions/grant`, data);
  }

  adminRevokeSubscription(data: { targetEmailOrUid: string; reason?: string }): Observable<{ success: boolean; message: string }> {
    const baseUrl = environment.apiUrl || 'http://localhost:3000';
    return this.http.post<{ success: boolean; message: string }>(`${baseUrl}/api/admin/subscriptions/revoke`, data);
  }

  adminApproveTransfer(data: { transferId: string; action: 'approve' | 'reject'; rejectionReason?: string }): Observable<{ success: boolean; message: string }> {
    const baseUrl = environment.apiUrl || 'http://localhost:3000';
    return this.http.post<{ success: boolean; message: string }>(`${baseUrl}/api/admin/subscriptions/transfer/approve`, data);
  }
}
