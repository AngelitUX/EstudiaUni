import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface FlowPaymentStartResponse {
  token: string;
  url: string;
}

export interface FlowPaymentResult {
  success: boolean;
  message: string;
  isGift?: boolean;
  planType?: 'monthly' | 'yearly';
  amount?: number;
  cardType?: string | null;
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
  targetEmail?: string;
  receiptUrl?: string;
  couponCode?: string;
}

export interface TransactionRecord {
  id: string;
  type: 'flow' | 'transfer';
  subscriptionId?: string;
  transferNumber?: string;
  bankName?: string;
  payerEmail?: string;
  payerUid?: string;
  recipientUid?: string;
  recipientEmail?: string | null;
  isGift?: boolean;
  amount: number;
  planType: 'monthly' | 'yearly';
  status: 'pending' | 'paid' | 'failed' | 'rejected' | 'pending_approval' | 'approved';
  // The list endpoint only sends this boolean, never the image itself — see
  // getAllTransactions() in subscriptions.service.ts. Fetch the real image
  // on demand with getTransferReceipt() only when actually viewing it.
  hasReceipt?: boolean;
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
   * Start a ONE-TIME Flow payment for a 1-month or 1-year "pase" of Plan
   * Pro — no recurring charge is ever created. Redirects the browser to the
   * returned Flow URL; the user comes back to `returnUrl` with a `token`
   * query param once they finish (or cancel) paying.
   */
  createFlowPayment(
    planType: 'monthly' | 'yearly',
    returnUrl: string,
    targetUid?: string,
    couponCode?: string,
    targetEmail?: string,
  ): Observable<FlowPaymentStartResponse> {
    const baseUrl = environment.apiUrl || 'http://localhost:3000';
    const url = `${baseUrl}/api/subscriptions/flow/create-payment`;
    const body: any = { planType, returnUrl };
    if (targetUid) body.targetUid = targetUid;
    if (targetEmail) body.targetEmail = targetEmail;
    if (couponCode) body.couponCode = couponCode;
    return this.http.post<FlowPaymentStartResponse>(url, body);
  }

  /**
   * Confirm the payment and grant the "pase". Called from the return page
   * once Flow redirects back with a token.
   */
  confirmFlowPayment(token: string): Observable<FlowPaymentResult> {
    const baseUrl = environment.apiUrl || 'http://localhost:3000';
    const url = `${baseUrl}/api/subscriptions/flow/confirm`;
    return this.http.post<FlowPaymentResult>(url, { token });
  }

  /**
   * Submit a manual bank transfer report. Lands in `manual_payments` with
   * status `pending_approval` for an admin to approve/reject from
   * /admin/suscripciones — see subscriptions.service.ts `submitManualTransfer`.
   */
  submitManualTransfer(data: ManualTransferData): Observable<{ success: boolean; message: string; transferId: string }> {
    const baseUrl = environment.apiUrl || 'http://localhost:3000';
    const url = `${baseUrl}/api/subscriptions/transfer/submit`;
    return this.http.post<{ success: boolean; message: string; transferId: string }>(url, data);
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

  adminExtendSubscription(data: { targetEmailOrUid: string; durationDays: number; reason?: string }): Observable<{ success: boolean; message: string }> {
    const baseUrl = environment.apiUrl || 'http://localhost:3000';
    return this.http.post<{ success: boolean; message: string }>(`${baseUrl}/api/admin/subscriptions/extend`, data);
  }

  adminRevokeSubscription(data: { targetEmailOrUid: string; reason?: string }): Observable<{ success: boolean; message: string }> {
    const baseUrl = environment.apiUrl || 'http://localhost:3000';
    return this.http.post<{ success: boolean; message: string }>(`${baseUrl}/api/admin/subscriptions/revoke`, data);
  }

  adminApproveTransfer(data: { transferId: string; action: 'approve' | 'reject'; planType?: 'monthly' | 'yearly'; rejectionReason?: string }): Observable<{ success: boolean; message: string }> {
    const baseUrl = environment.apiUrl || 'http://localhost:3000';
    return this.http.post<{ success: boolean; message: string }>(`${baseUrl}/api/admin/subscriptions/transfer/approve`, data);
  }

  adminDeleteTransferRecord(transferId: string): Observable<{ success: boolean; message: string }> {
    const baseUrl = environment.apiUrl || 'http://localhost:3000';
    return this.http.post<{ success: boolean; message: string }>(`${baseUrl}/api/admin/subscriptions/transfer/delete`, { transferId });
  }

  getTransferReceipt(transferId: string): Observable<{ receiptUrl: string }> {
    const baseUrl = environment.apiUrl || 'http://localhost:3000';
    return this.http.get<{ receiptUrl: string }>(`${baseUrl}/api/admin/subscriptions/transfer/${transferId}/receipt`);
  }
}
