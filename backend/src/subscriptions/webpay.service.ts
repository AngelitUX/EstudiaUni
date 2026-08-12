import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { FirebaseService } from '../firebase/firebase.service';
import { SubscriptionsService } from './subscriptions.service';

const PLAN_AMOUNTS: Record<string, number> = {
  monthly: 9990,
  yearly: 69990,
};

// Transbank's own publicly-documented Webpay Plus INTEGRATION (sandbox) credentials.
// These are not secrets — Transbank publishes them for every developer to test against.
// They are only used as a fallback when WEBPAY_* env vars are not set.
const SANDBOX_BASE_URL = 'https://webpay3gint.transbank.cl';
const SANDBOX_COMMERCE_CODE = '597055555532';
const SANDBOX_API_KEY = '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C';
const PRODUCTION_BASE_URL = 'https://webpay3g.transbank.cl';

export interface CouponValidationResult {
  valid: boolean;
  message: string;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  discountAmount?: number;
  finalAmount?: number;
}

@Injectable()
export class WebpayService {
  private readonly logger = new Logger(WebpayService.name);
  private readonly inMemoryTransactions = new Map<string, any>();

  // Test-to-production switch: set WEBPAY_ENVIRONMENT=production plus the two
  // credential env vars below to your real Transbank commerce credentials.
  // Nothing else in this file needs to change.
  private readonly isProduction: boolean;
  private readonly baseUrl: string;
  private readonly commerceCode: string;
  private readonly apiKey: string;

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly configService: ConfigService,
  ) {
    this.isProduction = this.configService.get<string>('WEBPAY_ENVIRONMENT') === 'production';
    this.baseUrl = this.configService.get<string>('WEBPAY_BASE_URL')
      || (this.isProduction ? PRODUCTION_BASE_URL : SANDBOX_BASE_URL);
    this.commerceCode = this.configService.get<string>('WEBPAY_COMMERCE_CODE') || SANDBOX_COMMERCE_CODE;
    this.apiKey = this.configService.get<string>('WEBPAY_API_KEY') || SANDBOX_API_KEY;

    if (this.isProduction && (this.commerceCode === SANDBOX_COMMERCE_CODE || this.apiKey === SANDBOX_API_KEY)) {
      this.logger.error(
        '[Webpay] WEBPAY_ENVIRONMENT=production but WEBPAY_COMMERCE_CODE/WEBPAY_API_KEY are missing — ' +
        'still using Transbank sandbox credentials. Real payments will NOT work until these are set.',
      );
    }
    this.logger.log(`[Webpay] Running in ${this.isProduction ? 'PRODUCTION' : 'TEST/sandbox'} mode against ${this.baseUrl}`);
  }

  /**
   * Validate a discount coupon code.
   */
  async validateCoupon(code: string, planType: 'monthly' | 'yearly'): Promise<CouponValidationResult> {
    const normalized = code.trim().toUpperCase();
    let doc: any = null;

    try {
      doc = await this.firebaseService.firestore
        .collection('discount_codes')
        .doc(normalized)
        .get();
    } catch (dbError) {
      this.logger.error(`[Webpay] Firestore check for coupon "${code}" failed: ${dbError.message}`);
      // Fail closed: a coupon must be verified against Firestore to be honored.
      // Never grant a discount just because the database was momentarily unreachable.
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

  private async verifyUserExists(uid: string): Promise<void> {
    try {
      const doc = await this.firebaseService.firestore
        .collection('users')
        .doc(uid)
        .get();

      if (!doc.exists) {
        throw new BadRequestException(`El usuario destinatario no fue encontrado (uid: ${uid})`);
      }
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      this.logger.warn(`[Webpay] Could not verify recipient in Firestore: ${error.message}`);
    }
  }

  private async incrementCouponUsage(code: string): Promise<void> {
    try {
      const normalized = code.trim().toUpperCase();
      await this.firebaseService.firestore
        .collection('discount_codes')
        .doc(normalized)
        .update({
          usedCount: admin.firestore.FieldValue.increment(1),
        });
    } catch (error) {
      this.logger.warn(`[Webpay] Could not increment coupon usage in Firestore: ${error.message}`);
    }
  }

  /**
   * Create a transaction in Transbank Webpay Plus.
   */
  async createTransaction(
    payerUid: string,
    planType: 'monthly' | 'yearly',
    returnUrl: string,
    targetUid?: string,
    couponCode?: string,
  ) {
    const recipientUid = targetUid || payerUid;
    if (targetUid) {
      await this.verifyUserExists(targetUid);
    }

    let amount = PLAN_AMOUNTS[planType];
    let appliedCoupon: string | null = null;
    let discountAmount = 0;

    if (couponCode) {
      const couponResult = await this.validateCoupon(couponCode, planType);
      if (couponResult.valid) {
        amount = couponResult.finalAmount!;
        discountAmount = couponResult.discountAmount!;
        appliedCoupon = couponCode.trim().toUpperCase();
      } else {
        this.logger.warn(`[Webpay] Invalid coupon "${couponCode}" submitted for transaction — ignoring.`);
      }
    }

    const buyOrder = `BO-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const sessionId = `S-${payerUid.substring(0, 10)}-${Date.now()}`;

    this.logger.log(
      `[Webpay] Creating transaction: buyOrder=${buyOrder}, amount=${amount} (discount=${discountAmount}), planType=${planType}, payer=${payerUid}, recipient=${recipientUid}`,
    );

    try {
      const response = await fetch(`${this.baseUrl}/rswebpaytransaction/api/webpay/v1.2/transactions`, {
        method: 'POST',
        headers: {
          'Tbk-Api-Key-Id': this.commerceCode,
          'Tbk-Api-Key-Secret': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          buy_order: buyOrder,
          session_id: sessionId,
          amount,
          return_url: returnUrl,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`[Webpay] Error from Transbank: ${response.status} - ${errorText}`);
        throw new BadRequestException('Error creating transaction in Transbank');
      }

      const data = (await response.json()) as { token: string; url: string };

      const txRecord = {
        payerUid,
        uid: payerUid,
        recipientUid,
        isGift: recipientUid !== payerUid,
        buyOrder,
        sessionId,
        amount,
        originalAmount: PLAN_AMOUNTS[planType],
        discountAmount,
        appliedCoupon,
        planType,
        status: 'pending',
        token: data.token,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Store in memory as a fast-path cache, but Firestore below is the
      // durable record: create() and commit() can land on different backend
      // instances/processes (redeploy, restart, horizontal scaling), and the
      // in-memory Map does not survive any of that. If persisting to Firestore
      // fails here, the user would be sent to Transbank for a transaction that
      // commitTransaction() might never be able to find again — so this must
      // fail loudly instead of silently proceeding.
      this.inMemoryTransactions.set(data.token, txRecord);

      try {
        await this.firebaseService.firestore
          .collection('transactions')
          .doc(data.token)
          .set(txRecord);
      } catch (dbError) {
        this.logger.error(`[Webpay] Could not persist transaction ${data.token} to Firestore: ${dbError.message}`);
        throw new BadRequestException('No se pudo iniciar el pago. Intenta nuevamente en unos segundos.');
      }

      if (appliedCoupon) {
        await this.incrementCouponUsage(appliedCoupon);
      }

      return { token: data.token, url: data.url, amount, buyOrder };
    } catch (error) {
      this.logger.error('[Webpay] Failed to create Webpay transaction:', error);
      throw new BadRequestException(error.message || 'Failed to create Webpay transaction');
    }
  }

  /**
   * Commit/Confirm a transaction in Transbank Webpay Plus
   */
  async commitTransaction(uid: string, token: string) {
    this.logger.log(`[Webpay] Committing transaction for token=${token}`);

    let txData = this.inMemoryTransactions.get(token);
    const txRef = this.firebaseService.firestore.collection('transactions').doc(token);

    // Atomically claim this transaction so two concurrent commit calls (double-click,
    // network retry, browser back+forward) can't both pass the "not completed yet" check
    // and both call Transbank / grant premium.
    let claimed = true;
    try {
      await this.firebaseService.firestore.runTransaction(async (t) => {
        const doc = await t.get(txRef);
        if (doc.exists) {
          txData = doc.data();
        }
        if (!txData) {
          throw new BadRequestException('Transaction record not found');
        }
        if (txData.status === 'completed' || txData.status === 'processing') {
          claimed = false;
          return;
        }
        t.update(txRef, { status: 'processing', updatedAt: new Date() });
      });
    } catch (dbError) {
      if (dbError instanceof BadRequestException) throw dbError;
      this.logger.warn(`[Webpay] Firestore claim transaction failed, proceeding with in-memory record only: ${dbError.message}`);
    }

    if (!txData) {
      throw new BadRequestException('Transaction record not found');
    }

    if (!claimed) {
      return { success: true, message: 'Transaction already completed or in progress', details: txData };
    }

    try {
      const response = await fetch(`${this.baseUrl}/rswebpaytransaction/api/webpay/v1.2/transactions/${token}`, {
        method: 'PUT',
        headers: {
          'Tbk-Api-Key-Id': this.commerceCode,
          'Tbk-Api-Key-Secret': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`[Webpay] Commit error from Transbank: ${response.status} - ${errorText}`);
        throw new BadRequestException('Webpay transaction failed or expired');
      }

      const details = (await response.json()) as any;

      // Never trust the response blindly: the amount Transbank actually authorized must
      // match what we asked for when the transaction was created, or we refuse to grant.
      const amountMismatch = typeof details.amount === 'number' && details.amount !== txData.amount;

      if (details.response_code === 0 && details.status === 'AUTHORIZED' && !amountMismatch) {
        this.logger.log(`[Webpay] Transaction ${token} APPROVED!`);

        txData.status = 'completed';
        this.inMemoryTransactions.set(token, txData);

        try {
          await txRef.update({
            status: 'completed',
            paymentType: details.payment_type_code,
            cardDetail: details.card_detail,
            authorizationCode: details.authorization_code,
            transactionDate: details.transaction_date,
            responseCode: details.response_code,
            updatedAt: new Date(),
          });
        } catch (dbError) {
          this.logger.warn(`[Webpay] Could not update Firestore transaction: ${dbError.message}`);
        }

        const recipientUid = txData.recipientUid || txData.uid;
        this.logger.log(`[Webpay] Upgrading recipient uid=${recipientUid} to premium`);

        try {
          await this.subscriptionsService.upgrade(recipientUid, txData.planType);
        } catch (subError) {
          // The payment WAS captured by Transbank at this point — money changed
          // hands — but the Firestore write that grants Premium failed. We must
          // never tell the user "cuenta actualizada a premium" here: that would
          // be a lie, and with no error surfaced nobody would know to fix it.
          // Flag the transaction so an admin can find it and grant manually via
          // SubscriptionsService.manualGrant (the same tool used for bank transfers).
          this.logger.error(
            `[Webpay] PAID but upgrade FAILED for uid=${recipientUid}, token=${token}, buyOrder=${txData.buyOrder}: ${subError.message}`,
          );
          try {
            await txRef.update({ status: 'upgrade_failed', upgradeError: subError.message, updatedAt: new Date() });
          } catch (dbError) {
            this.logger.warn(`[Webpay] Could not flag transaction as upgrade_failed: ${dbError.message}`);
          }
          return {
            success: false,
            message: 'Tu pago fue aprobado, pero hubo un problema activando tu Plan Pro. Nuestro equipo ya fue notificado — si en unos minutos tu cuenta no se actualiza, por favor contacta a soporte con tu comprobante.',
            amount: txData.amount,
            buyOrder: txData.buyOrder,
          };
        }

        return {
          success: true,
          message: txData.isGift
            ? 'Pago aprobado. ¡Le regalaste el Plan Pro a un usuario!'
            : 'Pago aprobado y cuenta actualizada a premium',
          isGift: txData.isGift || false,
          amount: txData.amount,
          buyOrder: txData.buyOrder,
          authorizationCode: details.authorization_code,
          paymentType: details.payment_type_code,
          cardDetail: details.card_detail,
        };
      } else {
        if (amountMismatch) {
          this.logger.error(
            `[Webpay] AMOUNT MISMATCH for token=${token}: expected ${txData.amount}, Transbank authorized ${details.amount}. Refusing to grant premium.`,
          );
        } else {
          this.logger.warn(`[Webpay] Transaction ${token} REJECTED: response_code=${details.response_code}`);
        }
        await this.markTransactionTerminalState(txRef, txData, 'rejected');
        return {
          success: false,
          message: amountMismatch ? 'No se pudo verificar el monto del pago.' : 'Pago rechazado por el banco',
          responseCode: details.response_code,
        };
      }
    } catch (error) {
      // Release the 'processing' claim so the user (or a legitimate retry) isn't stuck forever.
      await this.markTransactionTerminalState(txRef, txData, 'pending');
      this.logger.error(`[Webpay] Failed to commit Webpay transaction:`, error);
      throw new BadRequestException(error.message || 'Failed to commit Webpay transaction');
    }
  }

  private async markTransactionTerminalState(
    txRef: admin.firestore.DocumentReference,
    txData: any,
    status: 'pending' | 'rejected',
  ): Promise<void> {
    if (txData) txData.status = status;
    try {
      await txRef.update({ status, updatedAt: new Date() });
    } catch (dbError) {
      this.logger.warn(`[Webpay] Could not reset transaction status to "${status}": ${dbError.message}`);
    }
  }
}
