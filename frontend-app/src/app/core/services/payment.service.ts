import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface FlowRegistrationResponse {
  token: string;
  url: string;
}

export interface FlowSubscriptionResult {
  success: boolean;
  message: string;
  isGift?: boolean;
  planType?: 'monthly' | 'yearly';
  subscriptionId?: string;
  cardType?: string | null;
  cardLast4?: string | null;
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

export interface GiftedSubscription {
  flowSubscriptionId: string;
  recipientUid: string;
  recipientEmail: string;
  planType: 'monthly' | 'yearly';
  status: 'active' | 'cancelled';
  createdAt?: any;
  cancelledAt?: any;
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
   * Start card registration with Flow for a new subscription. Redirects the
   * browser to the returned Flow URL; the user comes back to `returnUrl` with
   * a `token` query param once the card is registered.
   */
  startFlowRegistration(
    planType: 'monthly' | 'yearly',
    returnUrl: string,
    targetUid?: string,
    couponCode?: string,
    targetEmail?: string,
  ): Observable<FlowRegistrationResponse> {
    const baseUrl = environment.apiUrl || 'http://localhost:3000';
    const url = `${baseUrl}/api/subscriptions/flow/register-card`;
    const body: any = { planType, returnUrl };
    if (targetUid) body.targetUid = targetUid;
    if (targetEmail) body.targetEmail = targetEmail;
    if (couponCode) body.couponCode = couponCode;
    return this.http.post<FlowRegistrationResponse>(url, body);
  }

  /**
   * Confirm the card registration and subscribe the customer to the plan.
   * Called from the return page once Flow redirects back with a token.
   */
  confirmFlowSubscription(token: string): Observable<FlowSubscriptionResult> {
    const baseUrl = environment.apiUrl || 'http://localhost:3000';
    const url = `${baseUrl}/api/subscriptions/flow/confirm`;
    return this.http.post<FlowSubscriptionResult>(url, { token });
  }

  /**
   * Cancels the current subscription. Unlike the old direct-Firestore write
   * this replaced, this actually reaches Flow: the backend sets
   * `cancelAtPeriodEnd` (so the next renewal webhook won't extend `endDate`)
   * AND calls Flow's `/subscription/cancel` to stop the card from being
   * charged again — see subscriptions.controller.ts `cancel()`. Access is
   * kept until the already-paid `endDate`, same as before.
   */
  cancelSubscription(): Observable<{ success: boolean; message: string; endDate?: string | Date | null; flowSubscriptionId?: string | null }> {
    const baseUrl = environment.apiUrl || 'http://localhost:3000';
    return this.http.post<{ success: boolean; message: string; endDate?: string | Date | null; flowSubscriptionId?: string | null }>(`${baseUrl}/api/subscriptions/cancel`, {});
  }

  /** Cancela un REGALO de Plan Pro por Flow que el usuario actual está pagando.
   *  El backend verifica que el flowSubscriptionId esté en SUS giftedSubscriptions,
   *  corta los cobros en Flow y marca la suscripción del amigo como cancelada. */
  cancelGift(flowSubscriptionId: string): Observable<{ success: boolean; message: string }> {
    const baseUrl = environment.apiUrl || 'http://localhost:3000';
    return this.http.post<{ success: boolean; message: string }>(`${baseUrl}/api/subscriptions/gift/cancel`, { flowSubscriptionId });
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
