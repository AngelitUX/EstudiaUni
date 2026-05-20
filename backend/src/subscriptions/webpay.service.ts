import { Injectable, BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { SubscriptionsService } from './subscriptions.service';

const PLAN_AMOUNTS: Record<string, number> = {
  monthly: 9990,
  yearly: 69990,
};

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
  
  // Transbank Integration/Sandbox public details
  private readonly baseUrl = 'https://webpay3gint.transbank.cl';
  private readonly commerceCode = '597055555532';
  private readonly apiKey = '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C';

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  /**
   * Validate a discount coupon code.
   * Coupon documents are stored in the 'discount_codes' collection using the code (uppercase) as the document ID.
   */
  async validateCoupon(code: string, planType: 'monthly' | 'yearly'): Promise<CouponValidationResult> {
    const normalized = code.trim().toUpperCase();
    const doc = await this.firebaseService.firestore
      .collection('discount_codes')
      .doc(normalized)
      .get();

    if (!doc.exists) {
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

    const finalAmount = Math.max(baseAmount - discountAmount, 1); // Minimum 1 CLP

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

  /**
   * Find a random free-tier user (for the "gift to random person" feature)
   */
  async getRandomFreeUser(): Promise<{ uid: string; email: string }> {
    const snapshot = await this.firebaseService.firestore
      .collection('users')
      .where('plan', '==', 'free')
      .limit(50)
      .get();

    if (snapshot.empty) {
      throw new NotFoundException('No free-tier users found to gift to');
    }

    const docs = snapshot.docs;
    const randomDoc = docs[Math.floor(Math.random() * docs.length)];
    const data = randomDoc.data();

    return {
      uid: randomDoc.id,
      email: data.email || 'correo no disponible',
    };
  }

  /**
   * Verify that a user with the given UID exists in Firestore.
   */
  private async verifyUserExists(uid: string): Promise<void> {
    const doc = await this.firebaseService.firestore
      .collection('users')
      .doc(uid)
      .get();

    if (!doc.exists) {
      throw new BadRequestException(`El usuario destinatario no fue encontrado (uid: ${uid})`);
    }
  }

  /**
   * Increment coupon usage counter after a successful transaction is initiated.
   */
  private async incrementCouponUsage(code: string): Promise<void> {
    const normalized = code.trim().toUpperCase();
    await this.firebaseService.firestore
      .collection('discount_codes')
      .doc(normalized)
      .update({
        usedCount: require('firebase-admin').firestore.FieldValue.increment(1),
      });
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

    // Calculate base amount
    let amount = PLAN_AMOUNTS[planType];
    let appliedCoupon: string | null = null;
    let discountAmount = 0;

    // Apply coupon if provided
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

      await this.firebaseService.firestore
        .collection('transactions')
        .doc(data.token)
        .set({
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
        });

      // Increment coupon usage counter
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

    const txRef = this.firebaseService.firestore.collection('transactions').doc(token);
    const txDoc = await txRef.get();

    if (!txDoc.exists) {
      throw new BadRequestException('Transaction record not found');
    }

    const txData = txDoc.data()!;
    if (txData.uid !== uid) {
      throw new BadRequestException('User is not authorized to commit this transaction');
    }

    if (txData.status === 'completed') {
      return { success: true, message: 'Transaction already completed previously', details: txData };
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
        await txRef.update({ status: 'failed', error: errorText, updatedAt: new Date() });
        throw new BadRequestException('Webpay transaction failed or expired');
      }

      const details = (await response.json()) as any;

      if (details.response_code === 0 && details.status === 'AUTHORIZED') {
        this.logger.log(`[Webpay] Transaction ${token} APPROVED!`);

        await txRef.update({
          status: 'completed',
          paymentType: details.payment_type_code,
          cardDetail: details.card_detail,
          authorizationCode: details.authorization_code,
          transactionDate: details.transaction_date,
          responseCode: details.response_code,
          updatedAt: new Date(),
        });

        const recipientUid = txData.recipientUid || txData.uid;
        this.logger.log(`[Webpay] Upgrading recipient uid=${recipientUid} to premium`);
        await this.subscriptionsService.upgrade(recipientUid, txData.planType);

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
        this.logger.warn(`[Webpay] Transaction ${token} REJECTED: response_code=${details.response_code}`);
        await txRef.update({ status: 'rejected', responseCode: details.response_code, updatedAt: new Date() });
        return { success: false, message: 'Pago rechazado por el banco', responseCode: details.response_code };
      }
    } catch (error) {
      this.logger.error(`[Webpay] Failed to commit Webpay transaction:`, error);
      await txRef.update({ status: 'failed', error: error.message, updatedAt: new Date() });
      throw new BadRequestException(error.message || 'Failed to commit Webpay transaction');
    }
  }
}
