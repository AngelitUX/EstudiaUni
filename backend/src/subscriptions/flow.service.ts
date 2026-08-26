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

@Injectable()
export class FlowService {
  private readonly logger = new Logger(FlowService.name);

  private readonly isProduction: boolean;
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly secretKey: string;
  private readonly planIdMonthly: string;
  private readonly planIdYearly: string;

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
    this.planIdMonthly = this.configService.get<string>('FLOW_PLAN_ID_MONTHLY') || '';
    this.planIdYearly = this.configService.get<string>('FLOW_PLAN_ID_YEARLY') || '';

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

  // ── Coupons (unrelated to the gateway itself — ported as-is) ──

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
      message: `¡Código aplicado! Descuento de ${discountLabel} (solo primer cobro)`,
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

  // ── Customer + card registration ──

  private async getOrCreateCustomer(uid: string, email: string): Promise<string> {
    const userRef = this.firebaseService.firestore.collection('users').doc(uid);
    const userDoc = await userRef.get();
    const existing = userDoc.exists ? userDoc.data()?.subscription?.flowCustomerId : null;
    if (existing) return existing;

    const result = await this.request<{ customerId: string }>('POST', '/customer/create', {
      name: email.split('@')[0],
      email,
      externalId: uid,
    });

    try {
      await userRef.set({ subscription: { flowCustomerId: result.customerId } }, { merge: true });
    } catch (dbError) {
      this.logger.warn(`[Flow] Could not persist flowCustomerId for uid=${uid}: ${dbError.message}`);
    }

    return result.customerId;
  }

  /**
   * Kick off card registration for a future subscription. Stores the intended
   * plan/coupon/recipient in `flow_registrations/{token}` so the return trip
   * (confirmRegistrationAndSubscribe) knows what to subscribe the customer to.
   */
  async startCardRegistration(
    payerUid: string,
    email: string,
    planType: 'monthly' | 'yearly',
    returnUrl: string,
    targetUid?: string,
    couponCode?: string,
  ): Promise<{ token: string; url: string }> {
    const recipientUid = targetUid || payerUid;
    if (targetUid) {
      await this.verifyUserExists(targetUid);
    }

    let appliedCoupon: string | null = null;
    if (couponCode) {
      const couponResult = await this.validateCoupon(couponCode, planType);
      if (couponResult.valid) {
        appliedCoupon = couponCode.trim().toUpperCase();
      } else {
        this.logger.warn(`[Flow] Invalid coupon "${couponCode}" submitted for registration — ignoring.`);
      }
    }

    const customerId = await this.getOrCreateCustomer(payerUid, email);

    const result = await this.request<{ url: string; token: string }>('POST', '/customer/register', {
      customerId,
      url_return: returnUrl,
    });

    const registrationRecord = {
      payerUid,
      recipientUid,
      isGift: recipientUid !== payerUid,
      customerId,
      planType,
      appliedCoupon,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await this.firebaseService.firestore
        .collection('flow_registrations')
        .doc(result.token)
        .set(registrationRecord);
    } catch (dbError) {
      this.logger.error(`[Flow] Could not persist registration ${result.token}: ${dbError.message}`);
      throw new BadRequestException('No se pudo iniciar el registro de la tarjeta. Intenta nuevamente en unos segundos.');
    }

    return { token: result.token, url: result.url };
  }

  /**
   * Called when the user lands back on our return page after registering a
   * card with Flow. Verifies the card was registered, subscribes the customer
   * to the plan (Flow charges the first period immediately), and activates
   * Premium for the recipient. Mirrors the old commitTransaction()'s
   * claim-then-verify-then-upgrade pattern so double-clicks / retries are safe.
   */
  async confirmRegistrationAndSubscribe(uid: string, token: string) {
    const regRef = this.firebaseService.firestore.collection('flow_registrations').doc(token);

    let regData: any;
    let claimed = true;
    try {
      await this.firebaseService.firestore.runTransaction(async (t) => {
        const doc = await t.get(regRef);
        if (!doc.exists) {
          throw new BadRequestException('Registro de pago no encontrado');
        }
        regData = doc.data();
        if (regData.status === 'completed' || regData.status === 'processing') {
          claimed = false;
          return;
        }
        t.update(regRef, { status: 'processing', updatedAt: new Date() });
      });
    } catch (dbError) {
      if (dbError instanceof BadRequestException) throw dbError;
      this.logger.error(`[Flow] Could not claim registration ${token}: ${dbError.message}`);
      throw new BadRequestException('No se pudo verificar el registro de la tarjeta.');
    }

    if (!regData) {
      throw new BadRequestException('Registro de pago no encontrado');
    }

    if (!claimed) {
      return { success: true, message: 'Esta suscripción ya fue procesada.', planType: regData.planType };
    }

    if (regData.payerUid !== uid) {
      await this.markRegistrationTerminal(regRef, 'pending');
      throw new BadRequestException('Este registro de pago no pertenece a tu cuenta.');
    }

    try {
      const status = await this.request<any>('GET', '/customer/getRegisterStatus', { token });
      // Flow returns `status` as the STRING "1" on success, not the number 1
      // (confirmed against a real sandbox response) — a strict `=== 1` never
      // matches, so every registration looked "rejected" even when the card
      // was actually inscribed.
      const registered = String(status.status) === '1' || String(status.status).toUpperCase() === 'SUCCESS';

      if (!registered) {
        await this.markRegistrationTerminal(regRef, 'rejected');
        return {
          success: false,
          message: 'No se pudo registrar tu tarjeta en Flow. Intenta nuevamente con otro medio de pago.',
        };
      }

      const planId = regData.planType === 'yearly' ? this.planIdYearly : this.planIdMonthly;
      if (!planId) {
        throw new BadRequestException(
          `Flow no está configurado: falta FLOW_PLAN_ID_${regData.planType === 'yearly' ? 'YEARLY' : 'MONTHLY'} en las variables de entorno.`,
        );
      }

      const subscription = await this.request<any>('POST', '/subscription/create', {
        planId,
        customerId: regData.customerId,
      });
      const subscriptionId = subscription.subscriptionId || subscription.id;

      if (regData.appliedCoupon) {
        // Best-effort: the discount only ever affects the first charge. If Flow
        // rejects it we still keep the subscription (full price) rather than
        // failing the whole activation over a coupon.
        try {
          await this.request('POST', '/subscription/addDiscount', {
            subscriptionId,
            coupon: regData.appliedCoupon,
          });
        } catch (discountError) {
          this.logger.warn(`[Flow] Could not apply coupon "${regData.appliedCoupon}" to subscription ${subscriptionId}: ${discountError.message}`);
        }
        await this.incrementCouponUsage(regData.appliedCoupon);
      }

      try {
        await this.firebaseService.firestore
          .collection('flow_subscriptions')
          .doc(String(subscriptionId))
          .set({ uid: regData.recipientUid, planType: regData.planType, createdAt: new Date() });
      } catch (dbError) {
        this.logger.warn(`[Flow] Could not persist flow_subscriptions index for ${subscriptionId}: ${dbError.message}`);
      }

      try {
        await this.subscriptionsService.activateSubscription(regData.recipientUid, regData.planType, {
          provider: 'flow',
          flowCustomerId: regData.customerId,
          flowSubscriptionId: subscriptionId,
        });
      } catch (subError) {
        // The card WAS charged by Flow at this point — money changed hands —
        // but the Firestore write that grants Premium failed. Never claim
        // success here; flag it so an admin can grant manually.
        this.logger.error(
          `[Flow] Subscribed but activation FAILED for uid=${regData.recipientUid}, subscriptionId=${subscriptionId}: ${subError.message}`,
        );
        await regRef.update({ status: 'upgrade_failed', upgradeError: subError.message, updatedAt: new Date() }).catch(() => {});
        return {
          success: false,
          message: 'Tu suscripción fue creada en Flow, pero hubo un problema activando tu Plan Pro. Nuestro equipo ya fue notificado — si en unos minutos tu cuenta no se actualiza, por favor contacta a soporte.',
        };
      }

      await regRef.update({ status: 'completed', subscriptionId: String(subscriptionId), updatedAt: new Date() }).catch(() => {});

      return {
        success: true,
        message: regData.isGift
          ? 'Suscripción activada. ¡Le regalaste el Plan Pro a un usuario!'
          : 'Suscripción activada. Tu Plan Pro se renovará automáticamente.',
        isGift: regData.isGift || false,
        planType: regData.planType,
        subscriptionId: String(subscriptionId),
        cardType: status.creditCardType || status.brand || null,
        cardLast4: status.last4Digits || status.paymentData?.last4 || null,
      };
    } catch (error) {
      await this.markRegistrationTerminal(regRef, 'pending');
      if (error instanceof BadRequestException) throw error;
      this.logger.error(`[Flow] Failed to confirm subscription for token=${token}: ${error.message}`);
      throw new BadRequestException(error.message || 'No se pudo confirmar la suscripción con Flow.');
    }
  }

  private async markRegistrationTerminal(
    regRef: admin.firestore.DocumentReference,
    status: 'pending' | 'rejected',
  ): Promise<void> {
    try {
      await regRef.update({ status, updatedAt: new Date() });
    } catch (dbError) {
      this.logger.warn(`[Flow] Could not reset registration status to "${status}": ${dbError.message}`);
    }
  }

  // ── Cancellation ──

  async cancelFlowSubscription(subscriptionId: string): Promise<void> {
    if (!subscriptionId) return;
    try {
      await this.request('POST', '/subscription/cancel', { subscriptionId });
    } catch (error) {
      this.logger.error(`[Flow] Could not cancel subscription ${subscriptionId} in Flow: ${error.message}`);
      throw error;
    }
  }

  // ── Recurring charge webhook (urlCallback / urlConfirmation on the Plan) ──

  /**
   * Flow calls this after every charge attempt on a subscription (success or
   * failure), including the very first one. We never trust the posted body
   * for money-relevant fields — always re-fetch the authoritative invoice
   * status from Flow before touching Firestore.
   */
  async handleRecurringWebhook(body: Record<string, any>): Promise<void> {
    this.logger.log(`[Flow] Webhook received: ${JSON.stringify(body)}`);

    const invoiceId = body.invoiceId || body.invoice_id;
    const token = body.token;

    let invoiceStatus: any = null;
    try {
      if (invoiceId) {
        invoiceStatus = await this.request('GET', '/invoice/get', { invoiceId });
      } else if (token) {
        invoiceStatus = await this.request('GET', '/invoice/get', { token });
      }
    } catch (error) {
      this.logger.error(`[Flow] Webhook: could not verify invoice status: ${error.message}`);
      return;
    }

    // SECURITY: subscriptionId must come from the verified Flow response, never
    // from the raw webhook body. Flow's webhook payload isn't signed, so anyone
    // could POST here with an `invoiceId` for a real (even their own) paid
    // invoice alongside a forged `subscriptionId` pointing at a victim's
    // subscription — if we trusted body.subscriptionId, that would extend the
    // victim's Premium for free. invoiceStatus?.subscriptionId came back from a
    // signed GET to Flow's API keyed by the invoiceId/token, so it can't be
    // spoofed the same way. Only fall back to the body value when Flow gave us
    // no invoiceStatus at all — in that case isPaid is false below regardless,
    // so an unverified subscriptionId can't be used to grant anything.
    const subscriptionId = invoiceStatus?.subscriptionId || body.subscriptionId;
    if (!subscriptionId) {
      this.logger.warn('[Flow] Webhook payload had no subscriptionId we could resolve — ignoring.');
      return;
    }

    const indexDoc = await this.firebaseService.firestore
      .collection('flow_subscriptions')
      .doc(String(subscriptionId))
      .get();
    if (!indexDoc.exists) {
      this.logger.warn(`[Flow] Webhook: no local index for subscriptionId=${subscriptionId} — ignoring.`);
      return;
    }
    const { uid, planType } = indexDoc.data()!;

    const isPaid = invoiceStatus?.status === 1 || String(invoiceStatus?.status).toUpperCase() === 'PAID';
    const invoiceDocId = String(invoiceId || invoiceStatus?.invoiceId || `${subscriptionId}-${Date.now()}`);
    const invoiceRef = this.firebaseService.firestore.collection('flow_invoices').doc(invoiceDocId);

    const existingInvoice = await invoiceRef.get();
    if (existingInvoice.exists && existingInvoice.data()?.status === 'paid') {
      return; // Already processed — Flow retries webhooks, this must be idempotent.
    }

    try {
      await invoiceRef.set({
        uid,
        subscriptionId: String(subscriptionId),
        planType,
        amount: invoiceStatus?.amount ?? null,
        status: isPaid ? 'paid' : 'failed',
        createdAt: new Date(),
      }, { merge: true });
    } catch (dbError) {
      this.logger.warn(`[Flow] Could not log invoice ${invoiceDocId}: ${dbError.message}`);
    }

    if (!isPaid) {
      this.logger.warn(`[Flow] Renewal charge FAILED for uid=${uid}, subscriptionId=${subscriptionId}`);
      return;
    }

    try {
      await this.subscriptionsService.extendSubscriptionPeriod(uid, planType);
    } catch (error) {
      this.logger.error(`[Flow] Could not extend subscription period for uid=${uid}: ${error.message}`);
    }
  }
}
