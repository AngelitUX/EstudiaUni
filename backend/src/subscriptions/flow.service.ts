import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as admin from 'firebase-admin';
import { FirebaseService } from '../firebase/firebase.service';
import { SubscriptionsService } from './subscriptions.service';

const PLAN_AMOUNTS: Record<string, number> = {
  monthly: 9990,
  yearly: 69990,
};

const PLAN_LABELS: Record<string, string> = {
  monthly: 'EstudiaUni PRO - Pase de 1 mes',
  yearly: 'EstudiaUni PRO - Pase de 1 año',
};

const SANDBOX_BASE_URL = 'https://sandbox.flow.cl/api';
const PRODUCTION_BASE_URL = 'https://www.flow.cl/api';

export interface CouponValidationResult {
  valid: boolean;
  message: string;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  discountAmount?: number;
  finalAmount?: number;
}

/**
 * Flow.cl integration — ONE-TIME PAYMENTS ONLY.
 *
 * This used to be built on Flow's recurring-subscription API
 * (`/customer/register` + `/subscription/create`, with Flow auto-charging
 * the card every period). Flow told the merchant that product is no longer
 * available to this account, so the whole thing was rebuilt on Flow's plain
 * payment-order API (`/payment/create` + `/payment/getStatus`): the user
 * buys a "pase" (1 month or 1 year) as a single non-recurring charge, and
 * has to repeat the purchase to keep Plan Pro going. Nothing here ever
 * charges a card again on its own — see CLAUDE.md §6 for the business
 * rules this replaced.
 *
 * The "buying again while days remain adds to what's left instead of
 * resetting it" behavior lives in SubscriptionsService.activateSubscription()
 * — it already worked that way before this change (it was written for the
 * gift-while-already-Pro case), so it needed no changes at all to satisfy
 * the new "membership stacking" requirement.
 */
@Injectable()
export class FlowService {
  private readonly logger = new Logger(FlowService.name);

  private readonly isProduction: boolean;
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly secretKey: string;
  private readonly backendPublicUrl: string;

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly configService: ConfigService,
  ) {
    this.isProduction = this.configService.get<string>('FLOW_ENVIRONMENT') === 'production';
    this.baseUrl = this.configService.get<string>('FLOW_BASE_URL')
      || (this.isProduction ? PRODUCTION_BASE_URL : SANDBOX_BASE_URL);
    this.apiKey = this.configService.get<string>('FLOW_API_KEY') || '';
    this.secretKey = this.configService.get<string>('FLOW_SECRET_KEY') || '';
    this.backendPublicUrl = (this.configService.get<string>('BACKEND_PUBLIC_URL') || '').replace(/\/$/, '');

    if (!this.apiKey || !this.secretKey) {
      // Unlike Transbank, Flow does not publish shared sandbox credentials — every
      // merchant must register their own account. There is no safe fallback here,
      // so we log loudly instead of silently accepting payments that can never work.
      this.logger.error(
        '[Flow] FLOW_API_KEY / FLOW_SECRET_KEY are not set. All Flow endpoints will fail ' +
        'until real credentials from your Flow account are added to the backend .env.',
      );
    }
    this.logger.log(`[Flow] Running in ${this.isProduction ? 'PRODUCTION' : 'SANDBOX'} mode against ${this.baseUrl}`);
  }

  // ── Low-level signed HTTP client ──

  private sign(params: Record<string, string>): string {
    const keys = Object.keys(params).filter((k) => k !== 's').sort();
    const toSign = keys.map((k) => `${k}${params[k]}`).join('');
    return crypto.createHmac('sha256', this.secretKey).update(toSign).digest('hex');
  }

  private assertConfigured(): void {
    if (!this.apiKey || !this.secretKey) {
      throw new BadRequestException(
        'Flow no está configurado: faltan FLOW_API_KEY / FLOW_SECRET_KEY en las variables de entorno del backend.',
      );
    }
  }

  private async request<T = any>(method: 'GET' | 'POST', path: string, params: Record<string, any> = {}): Promise<T> {
    this.assertConfigured();

    const allParams: Record<string, string> = { apiKey: this.apiKey };
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue;
      allParams[key] = String(value);
    }
    allParams.s = this.sign(allParams);

    let response: Response;
    try {
      if (method === 'GET') {
        const qs = new URLSearchParams(allParams).toString();
        response = await fetch(`${this.baseUrl}${path}?${qs}`, { method: 'GET' });
      } else {
        response = await fetch(`${this.baseUrl}${path}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(allParams).toString(),
        });
      }
    } catch (networkError) {
      this.logger.error(`[Flow] Network error calling ${path}: ${networkError.message}`);
      throw new BadRequestException('No se pudo conectar con Flow. Intenta nuevamente en unos segundos.');
    }

    const text = await response.text();
    let data: any;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { raw: text };
    }

    if (!response.ok) {
      this.logger.error(`[Flow] Error ${response.status} from ${path}: ${text}`);
      throw new BadRequestException(data?.message || `Error de Flow al llamar ${path}`);
    }

    return data as T;
  }

  // ── Coupons (unrelated to the payment mechanism itself — unchanged) ──

  async validateCoupon(code: string, planType: 'monthly' | 'yearly'): Promise<CouponValidationResult> {
    const normalized = code.trim().toUpperCase();
    let doc: any = null;

    try {
      doc = await this.firebaseService.firestore
        .collection('discount_codes')
        .doc(normalized)
        .get();
    } catch (dbError) {
      this.logger.error(`[Flow] Firestore check for coupon "${code}" failed: ${dbError.message}`);
      return { valid: false, message: 'No se pudo verificar el código de descuento en este momento.' };
    }

    if (!doc || !doc.exists) {
      return { valid: false, message: 'Código de descuento no encontrado.' };
    }

    const data = doc.data()!;

    if (!data.isActive) {
      return { valid: false, message: 'Este código de descuento ya no está activo.' };
    }

    if (data.expiresAt && data.expiresAt.toDate() < new Date()) {
      return { valid: false, message: 'Este código de descuento ha expirado.' };
    }

    if (data.maxUses && data.usedCount >= data.maxUses) {
      return { valid: false, message: 'Este código de descuento ya fue utilizado el máximo de veces.' };
    }

    if (data.applicableTo !== 'both' && data.applicableTo !== planType) {
      const planLabel = planType === 'monthly' ? 'mensual' : 'anual';
      return { valid: false, message: `Este código solo es válido para el plan ${data.applicableTo === 'monthly' ? 'mensual' : 'anual'}, no para el ${planLabel}.` };
    }

    const baseAmount = PLAN_AMOUNTS[planType];
    let discountAmount = 0;

    if (data.type === 'percentage') {
      discountAmount = Math.round(baseAmount * data.value / 100);
    } else {
      discountAmount = Math.min(data.value, baseAmount);
    }

    const finalAmount = Math.max(baseAmount - discountAmount, 1);

    const discountLabel = data.type === 'percentage'
      ? `${data.value}%`
      : `$${discountAmount.toLocaleString('es-CL')}`;

    return {
      valid: true,
      message: `¡Código aplicado! Descuento de ${discountLabel}`,
      discountType: data.type,
      discountValue: data.value,
      discountAmount,
      finalAmount,
    };
  }

  private async incrementCouponUsage(code: string): Promise<void> {
    try {
      const normalized = code.trim().toUpperCase();
      await this.firebaseService.firestore
        .collection('discount_codes')
        .doc(normalized)
        .update({ usedCount: admin.firestore.FieldValue.increment(1) });
    } catch (error) {
      this.logger.warn(`[Flow] Could not increment coupon usage in Firestore: ${error.message}`);
    }
  }

  private async verifyUserExists(uid: string): Promise<void> {
    try {
      const doc = await this.firebaseService.firestore.collection('users').doc(uid).get();
      if (!doc.exists) {
        throw new BadRequestException(`El usuario destinatario no fue encontrado (uid: ${uid})`);
      }
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      this.logger.warn(`[Flow] Could not verify recipient in Firestore: ${error.message}`);
    }
  }

  // ── One-time payment ("pase") ──

  /**
   * Start a one-time Flow payment for a 1-month or 1-year "pase" of Plan
   * Pro. Stores the intent in `flow_payments/{token}` (doc id = the Flow
   * token, since that's the only thing the browser return trip and the
   * webhook both have to look the payment up by) so confirmPayment() /
   * handlePaymentWebhook() know who to grant access to once Flow confirms
   * the charge went through.
   */
  async createPayment(
    payerUid: string,
    email: string,
    planType: 'monthly' | 'yearly',
    returnUrl: string,
    targetUid?: string,
    couponCode?: string,
    targetEmail?: string,
  ): Promise<{ token: string; url: string }> {
    if (!this.backendPublicUrl) {
      throw new BadRequestException(
        'Flow no está configurado: falta BACKEND_PUBLIC_URL en las variables de entorno del backend (se usa como urlConfirmation del pago).',
      );
    }

    const recipientUid = targetUid || payerUid;
    if (targetUid) {
      await this.verifyUserExists(targetUid);
    }

    let appliedCoupon: string | null = null;
    let amount = PLAN_AMOUNTS[planType];
    if (couponCode) {
      const couponResult = await this.validateCoupon(couponCode, planType);
      if (couponResult.valid) {
        appliedCoupon = couponCode.trim().toUpperCase();
        amount = couponResult.finalAmount!;
      } else {
        this.logger.warn(`[Flow] Invalid coupon "${couponCode}" submitted for payment — ignoring.`);
      }
    }

    const commerceOrder = `PASS-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const urlConfirmation = `${this.backendPublicUrl}/api/subscriptions/flow/webhook`;

    const result = await this.request<{ url: string; token: string; flowOrder?: number }>('POST', '/payment/create', {
      commerceOrder,
      subject: PLAN_LABELS[planType],
      currency: 'CLP',
      amount,
      email,
      urlConfirmation,
      urlReturn: returnUrl,
    });

    const paymentRecord = {
      commerceOrder,
      flowOrder: result.flowOrder ?? null,
      payerUid,
      payerEmail: email,
      recipientUid,
      recipientEmail: recipientUid !== payerUid ? (targetEmail || '').toLowerCase().trim() : email,
      isGift: recipientUid !== payerUid,
      planType,
      amount,
      appliedCoupon,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await this.firebaseService.firestore
        .collection('flow_payments')
        .doc(result.token)
        .set(paymentRecord);
    } catch (dbError) {
      this.logger.error(`[Flow] Could not persist payment ${result.token}: ${dbError.message}`);
      throw new BadRequestException('No se pudo iniciar el pago. Intenta nuevamente en unos segundos.');
    }

    return { token: result.token, url: result.url };
  }

  /**
   * Called when the user lands back on our return page after paying (or
   * cancelling) on Flow's site. Verifies the charge against Flow's own
   * `/payment/getStatus` (never trusts anything the browser could have
   * tampered with) and, if paid, grants the "pase" via
   * SubscriptionsService.activateSubscription() — which stacks the new
   * period on top of any days the user already had, exactly like the
   * "buy again before it runs out" requirement asks for.
   *
   * Races the webhook (handlePaymentWebhook) via a claim transaction on the
   * same `flow_payments/{token}` doc, so whichever of the two arrives first
   * is the one that actually grants access — the other backs off instead of
   * double-granting.
   */
  async confirmPayment(uid: string, token: string) {
    const payRef = this.firebaseService.firestore.collection('flow_payments').doc(token);

    let payData: any;
    let claimed = true;
    try {
      await this.firebaseService.firestore.runTransaction(async (t) => {
        const doc = await t.get(payRef);
        if (!doc.exists) {
          throw new BadRequestException('Registro de pago no encontrado');
        }
        payData = doc.data();
        if (payData.status === 'completed' || payData.status === 'processing') {
          claimed = false;
          return;
        }
        t.update(payRef, { status: 'processing', updatedAt: new Date() });
      });
    } catch (dbError) {
      if (dbError instanceof BadRequestException) throw dbError;
      this.logger.error(`[Flow] Could not claim payment ${token}: ${dbError.message}`);
      throw new BadRequestException('No se pudo verificar el pago.');
    }

    if (!payData) {
      throw new BadRequestException('Registro de pago no encontrado');
    }

    if (!claimed) {
      // Either the webhook is mid-flight for this same payment, or it (or a
      // previous call to this same method) already finished. Re-read so the
      // browser gets the real outcome instead of a generic "in progress".
      const fresh = await payRef.get();
      const freshData = fresh.data() || payData;
      if (freshData.status === 'completed') {
        return { success: true, message: 'Pago confirmado.', planType: freshData.planType, isGift: freshData.isGift || false, amount: freshData.amount };
      }
      return {
        success: false,
        message: 'Tu pago se está verificando. Si en un par de minutos tu Plan Pro no aparece activo, contacta a soporte.',
      };
    }

    if (payData.payerUid !== uid) {
      await this.markPaymentTerminal(payRef, 'pending');
      throw new BadRequestException('Este pago no pertenece a tu cuenta.');
    }

    try {
      const status = await this.request<any>('GET', '/payment/getStatus', { token });
      const isPaid = Number(status.status) === 2;

      if (!isPaid) {
        await this.markPaymentTerminal(payRef, 'rejected');
        return {
          success: false,
          message: 'El pago no fue aprobado por Flow. Intenta nuevamente con otro medio de pago.',
        };
      }

      if (payData.appliedCoupon) {
        await this.incrementCouponUsage(payData.appliedCoupon);
      }

      try {
        await this.subscriptionsService.activateSubscription(payData.recipientUid, payData.planType, {
          provider: 'flow',
          flowPaymentToken: token,
        });
      } catch (subError) {
        // Flow DID charge the card at this point — money changed hands —
        // but the Firestore write that grants the pass failed. Never claim
        // success here; flag it so an admin can grant manually.
        this.logger.error(
          `[Flow] Paid but activation FAILED for uid=${payData.recipientUid}, token=${token}: ${subError.message}`,
        );
        await payRef.update({ status: 'activation_failed', activationError: subError.message, updatedAt: new Date() }).catch(() => {});
        return {
          success: false,
          message: 'Tu pago fue aprobado por Flow, pero hubo un problema activando tu Plan Pro. Nuestro equipo ya fue notificado — si en unos minutos tu cuenta no se actualiza, por favor contacta a soporte.',
        };
      }

      await payRef.update({ status: 'completed', updatedAt: new Date() }).catch(() => {});

      return {
        success: true,
        message: payData.isGift
          ? '¡Pago aprobado! Le regalaste un pase de Plan Pro a un usuario.'
          : 'Pago aprobado. Tu Plan Pro está activo.',
        isGift: payData.isGift || false,
        planType: payData.planType,
        amount: payData.amount,
        cardType: status.paymentData?.media || status.mediaType || null,
      };
    } catch (error) {
      await this.markPaymentTerminal(payRef, 'pending');
      if (error instanceof BadRequestException) throw error;
      this.logger.error(`[Flow] Failed to confirm payment for token=${token}: ${error.message}`);
      throw new BadRequestException(error.message || 'No se pudo confirmar el pago con Flow.');
    }
  }

  private async markPaymentTerminal(
    payRef: admin.firestore.DocumentReference,
    status: 'pending' | 'rejected',
  ): Promise<void> {
    try {
      await payRef.update({ status, updatedAt: new Date() });
    } catch (dbError) {
      this.logger.warn(`[Flow] Could not reset payment status to "${status}": ${dbError.message}`);
    }
  }

  // ── Payment confirmation webhook (Flow's `urlConfirmation`, called server-to-server) ──

  /**
   * Flow calls this once, shortly after the user pays (or the payment
   * fails) on its site — this is the real source of truth for "did the
   * money arrive", independent of whether the user's browser ever made it
   * back to our `urlReturn` page. Never trusts the posted body for
   * money-relevant fields — always re-fetches the invoice status from Flow
   * keyed by the token before touching Firestore.
   */
  async handlePaymentWebhook(body: Record<string, any>): Promise<void> {
    this.logger.log(`[Flow] Payment webhook received: ${JSON.stringify(body)}`);

    const token = body.token;
    if (!token) {
      this.logger.warn('[Flow] Webhook payload had no token — ignoring.');
      return;
    }

    const payRef = this.firebaseService.firestore.collection('flow_payments').doc(token);

    let payData: any;
    let claimed = true;
    try {
      await this.firebaseService.firestore.runTransaction(async (t) => {
        const doc = await t.get(payRef);
        if (!doc.exists) {
          claimed = false;
          return;
        }
        payData = doc.data();
        if (payData.status === 'completed' || payData.status === 'processing') {
          claimed = false;
          return;
        }
        t.update(payRef, { status: 'processing', updatedAt: new Date() });
      });
    } catch (dbError) {
      this.logger.error(`[Flow] Webhook: could not claim payment ${token}: ${dbError.message}`);
      return;
    }

    if (!payData) {
      this.logger.warn(`[Flow] Webhook: no local payment record for token=${token} — ignoring.`);
      return;
    }
    if (!claimed) {
      return; // Already handled by the browser return-flow, or a duplicate webhook retry.
    }

    let status: any;
    try {
      status = await this.request('GET', '/payment/getStatus', { token });
    } catch (error) {
      this.logger.error(`[Flow] Webhook: could not verify payment status: ${error.message}`);
      await this.markPaymentTerminal(payRef, 'pending');
      return;
    }

    const isPaid = Number(status.status) === 2;
    if (!isPaid) {
      this.logger.warn(`[Flow] Webhook: payment ${token} not paid (status=${status.status})`);
      await this.markPaymentTerminal(payRef, 'rejected');
      return;
    }

    try {
      if (payData.appliedCoupon) {
        await this.incrementCouponUsage(payData.appliedCoupon);
      }
      await this.subscriptionsService.activateSubscription(payData.recipientUid, payData.planType, {
        provider: 'flow',
        flowPaymentToken: token,
      });
      await payRef.update({ status: 'completed', updatedAt: new Date() });
    } catch (error) {
      this.logger.error(`[Flow] Webhook: activation FAILED for uid=${payData.recipientUid}, token=${token}: ${error.message}`);
      await payRef.update({ status: 'activation_failed', activationError: error.message, updatedAt: new Date() }).catch(() => {});
    }
  }
}
