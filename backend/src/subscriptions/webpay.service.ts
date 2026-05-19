import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { SubscriptionsService } from './subscriptions.service';

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
   * Create a transaction in Transbank Webpay Plus
   */
  async createTransaction(uid: string, planType: 'monthly' | 'yearly', returnUrl: string) {
    // 1. Calculate amount in Chilean Pesos (CLP)
    const amount = planType === 'monthly' ? 9990 : 95880; // $9.990 / month or $95.880 / year (discounted)
    const buyOrder = `BO-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const sessionId = `S-${uid.substring(0, 10)}-${Date.now()}`;

    this.logger.log(`[Webpay] Creating transaction: buyOrder=${buyOrder}, amount=${amount}, planType=${planType}`);

    try {
      // 2. Query Transbank API
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
          amount: amount,
          return_url: returnUrl,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`[Webpay] Error from Transbank: ${response.status} - ${errorText}`);
        throw new BadRequestException('Error creating transaction in Transbank');
      }

      const data = (await response.json()) as { token: string; url: string };

      // 3. Save pending transaction in Firestore
      await this.firebaseService.firestore
        .collection('transactions')
        .doc(data.token)
        .set({
          uid,
          buyOrder,
          sessionId,
          amount,
          planType,
          status: 'pending',
          token: data.token,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

      return {
        token: data.token,
        url: data.url,
        amount,
        buyOrder,
      };
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

    // 1. Fetch transaction record from Firestore to verify ownership
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
      // 2. Commit transaction with Transbank
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
        
        await txRef.update({
          status: 'failed',
          error: errorText,
          updatedAt: new Date(),
        });

        throw new BadRequestException('Webpay transaction failed or expired');
      }

      const details = (await response.json()) as any;

      // 3. Check response code (0 means successful payment)
      if (details.response_code === 0 && details.status === 'AUTHORIZED') {
        this.logger.log(`[Webpay] Transaction ${token} APPROVED!`);

        // Update transaction status to completed
        await txRef.update({
          status: 'completed',
          paymentType: details.payment_type_code,
          cardDetail: details.card_detail,
          authorizationCode: details.authorization_code,
          transactionDate: details.transaction_date,
          responseCode: details.response_code,
          updatedAt: new Date(),
        });

        // Upgrade user plan to premium in Firestore
        await this.subscriptionsService.upgrade(uid, txData.planType);

        return {
          success: true,
          message: 'Pago aprobado y cuenta actualizada a premium',
          amount: txData.amount,
          buyOrder: txData.buyOrder,
          authorizationCode: details.authorization_code,
          paymentType: details.payment_type_code,
          cardDetail: details.card_detail,
        };
      } else {
        this.logger.warn(`[Webpay] Transaction ${token} REJECTED: response_code=${details.response_code}`);

        // Update transaction status to rejected/failed
        await txRef.update({
          status: 'rejected',
          responseCode: details.response_code,
          updatedAt: new Date(),
        });

        return {
          success: false,
          message: 'Pago rechazado por el banco',
          responseCode: details.response_code,
        };
      }
    } catch (error) {
      this.logger.error(`[Webpay] Failed to commit Webpay transaction:`, error);
      
      await txRef.update({
        status: 'failed',
        error: error.message,
        updatedAt: new Date(),
      });

      throw new BadRequestException(error.message || 'Failed to commit Webpay transaction');
    }
  }
}
