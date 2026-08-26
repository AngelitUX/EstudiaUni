import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirebaseService } from '../firebase/firebase.service';
import { SubmitTransferDto } from './dto/manual-payment.dto';

const FREE_TIER_LIMITS = {
  simulation: 1,  // 1 ensayo por día
  quiz: 5,        // 5 quizzes por día
  focoTokens: 5,  // 5 fichas de Foco por día para Gratis
};

const PRO_TIER_LIMITS = {
  focoTokens: 500, // 500 fichas de Foco por día para PRO
};

const COOLDOWN_SIMULATION_HOURS_FREE = 48;

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);
  private readonly inMemoryTransfers = new Map<string, any>();

  constructor(private readonly firebaseService: FirebaseService) {}

  /**
   * The one correct way to compute "is this user currently Premium" —
   * checks tier/plan AND that `endDate` (if present) hasn't already passed.
   * getStatus(), checkFocoTokens() and checkSimulationCooldown() used to
   * each duplicate an ad-hoc version of this check that skipped the
   * `endDate` comparison entirely — a subscription whose period had already
   * ended, but whose `subscription.tier` hadn't been flipped back to 'free'
   * yet (that only happens as a side effect of checkCredits(), which some
   * users might never trigger — e.g. someone who only ever chats with Foco
   * and never starts a quiz/ensayo), stayed "Premium" for those three checks
   * indefinitely: unlimited real Gemini AI tokens via checkFocoTokens() and
   * no 48h ensayo cooldown via checkSimulationCooldown(), both real cost/
   * business-limit exposure, not just a display glitch.
   */
  private async isPremiumEffective(uid: string, userData: any): Promise<boolean> {
    const sub = userData?.subscription;
    let isPremium = sub?.tier === 'premium' || userData?.plan === 'premium';
    if (isPremium && sub?.endDate) {
      const endDate = typeof sub.endDate.toDate === 'function' ? sub.endDate.toDate() : new Date(sub.endDate);
      if (endDate < new Date()) {
        isPremium = false;
      }
    }
    return isPremium || (await this.firebaseService.isAdmin(uid));
  }

  /**
   * Get current subscription status and remaining daily credits.
   */
  async getStatus(uid: string) {
    let userData: any = null;
    try {
      const userDoc = await this.firebaseService.firestore
        .collection('users')
        .doc(uid)
        .get();
      if (userDoc.exists) {
        userData = userDoc.data();
      }
    } catch (e) {
      this.logger.warn(`[SubscriptionsService] getStatus error: ${e.message}`);
    }

    if (!userData) {
      return {
        tier: 'free',
        status: 'active',
        credits: {
          ensayosRemaining: 1,
          quizzesRemaining: 5,
          focoTokensRemaining: 5,
          focoTokensLimit: 5,
        },
        cooldown: { inCooldown: false, secondsRemaining: 0 },
      };
    }

    const subscription = userData.subscription || { tier: userData.plan || 'free', status: 'active' };
    const isPremium = await this.isPremiumEffective(uid, userData);
    const dailyCredits = await this.getResetCredits(uid, userData);
    const focoLimit = isPremium ? PRO_TIER_LIMITS.focoTokens : FREE_TIER_LIMITS.focoTokens;
    const focoUsed = dailyCredits.focoTokensUsedToday || 0;
    const focoRemaining = Math.max(0, focoLimit - focoUsed);

    const cooldownStatus = await this.checkSimulationCooldown(uid);

    return {
      tier: isPremium ? 'premium' : 'free',
      status: subscription.status || 'active',
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      credits: {
        ensayosRemaining: isPremium ? 'unlimited' : Math.max(0, FREE_TIER_LIMITS.simulation - dailyCredits.ensayosUsedToday),
        quizzesRemaining: isPremium ? 'unlimited' : Math.max(0, FREE_TIER_LIMITS.quiz - dailyCredits.quizzesUsedToday),
        focoTokensRemaining: focoRemaining,
        focoTokensLimit: focoLimit,
        focoTokensUsed: focoUsed,
      },
      cooldown: cooldownStatus,
    };
  }

  /**
   * Check Foco AI tutor tokens for user. `required` lets a caller ask "can
   * this user afford an N-token action" (e.g. the review-explanation chat,
   * which costs more than a quick in-exam hint) instead of just "any tokens
   * left at all" — otherwise a user with 1 token left could still trigger a
   * 3-token action and go negative.
   */
  async checkFocoTokens(uid: string, required = 1): Promise<{ allowed: boolean; remaining: number; limit: number; used: number }> {
    let userData: any = null;
    try {
      const userDoc = await this.firebaseService.firestore
        .collection('users')
        .doc(uid)
        .get();
      if (userDoc.exists) userData = userDoc.data();
    } catch (e) {}

    const isPremium = await this.isPremiumEffective(uid, userData);
    const limit = isPremium ? PRO_TIER_LIMITS.focoTokens : FREE_TIER_LIMITS.focoTokens;
    const dailyCredits = await this.getResetCredits(uid, userData || {});
    const used = dailyCredits.focoTokensUsedToday || 0;
    const remaining = Math.max(0, limit - used);

    return {
      allowed: remaining >= required,
      remaining,
      limit,
      used,
    };
  }

  /**
   * Consume `amount` Foco AI tutor tokens (defaults to 1). Heavier actions —
   * like the post-exam review explanation, which generates a much longer
   * response than a quick in-exam hint — pass a higher amount to reflect
   * their real cost against the daily allowance.
   */
  async consumeFocoToken(uid: string, amount = 1) {
    try {
      await this.firebaseService.firestore
        .collection('users')
        .doc(uid)
        .update({
          'dailyCredits.focoTokensUsedToday': admin.firestore.FieldValue.increment(amount),
        });
    } catch (e) {
      // The AI reply was already generated and shown to the user by this
      // point (real cost incurred), so we don't fail the request over a
      // quota-tracking write failing — but silently swallowing it here means
      // that usage under-counts with zero visibility. Log it so an
      // under-enforced quota is at least detectable instead of invisible.
      this.logger.error(`[SubscriptionsService] consumeFocoToken FAILED for uid=${uid} (amount=${amount}): ${e.message}`);
    }
  }

  /**
   * Check 48h simulation cooldown for Free tier users.
   */
  async checkSimulationCooldown(uid: string): Promise<{ inCooldown: boolean; secondsRemaining: number; lastFinishedAt?: Date }> {
    let userData: any = null;
    try {
      const userDoc = await this.firebaseService.firestore.collection('users').doc(uid).get();
      if (userDoc.exists) userData = userDoc.data();
    } catch (e) {}

    const isPremium = await this.isPremiumEffective(uid, userData);
    if (isPremium) {
      return { inCooldown: false, secondsRemaining: 0 };
    }

    const lastFinishedVal = userData?.lastSimulationFinishedAt;
    if (!lastFinishedVal) {
      return { inCooldown: false, secondsRemaining: 0 };
    }

    let lastFinishedAt: Date;
    if (typeof lastFinishedVal.toDate === 'function') {
      lastFinishedAt = lastFinishedVal.toDate();
    } else {
      lastFinishedAt = new Date(lastFinishedVal);
    }

    const cooldownMs = COOLDOWN_SIMULATION_HOURS_FREE * 3600 * 1000;
    const elapsedMs = Date.now() - lastFinishedAt.getTime();

    if (elapsedMs < cooldownMs) {
      const msRemaining = cooldownMs - elapsedMs;
      return {
        inCooldown: true,
        secondsRemaining: Math.ceil(msRemaining / 1000),
        lastFinishedAt,
      };
    }

    return { inCooldown: false, secondsRemaining: 0, lastFinishedAt };
  }

  /**
   * Check if the user can perform an action (simulation or quiz).
   */
  async checkCredits(
    uid: string,
    action: 'simulation' | 'quiz',
  ): Promise<{ allowed: boolean; reason?: string }> {
    let userData: any = null;
    try {
      const userDoc = await this.firebaseService.firestore
        .collection('users')
        .doc(uid)
        .get();
      if (userDoc.exists) {
        userData = userDoc.data();
      }
    } catch (e) {
      this.logger.warn(`[SubscriptionsService] checkCredits error: ${e.message}`);
    }

    if (!userData) return { allowed: true };

    let isPremium = userData.subscription?.tier === 'premium' || userData.plan === 'premium';
    if (isPremium && userData.subscription?.endDate) {
      const endDate = typeof userData.subscription.endDate.toDate === 'function'
        ? userData.subscription.endDate.toDate()
        : new Date(userData.subscription.endDate);

      if (endDate < new Date()) {
        isPremium = false;
        try {
          await this.firebaseService.firestore
            .collection('users')
            .doc(uid)
            .update({
              'subscription.tier': 'free',
              'subscription.status': 'expired',
              plan: 'free',
              updatedAt: new Date(),
            });
        } catch (e) {}
      }
    }

    // Admins get Pro-tier treatment everywhere, regardless of their subscription state.
    isPremium = isPremium || (await this.firebaseService.isAdmin(uid));

    if (isPremium) {
      return { allowed: true };
    }

    const dailyCredits = await this.getResetCredits(uid, userData);

    if (action === 'simulation') {
      const cooldown = await this.checkSimulationCooldown(uid);
      if (cooldown.inCooldown) {
        return { allowed: false, reason: 'COOLDOWN_ACTIVE' };
      }
      if (dailyCredits.ensayosUsedToday >= FREE_TIER_LIMITS.simulation) {
        return { allowed: false, reason: 'DAILY_LIMIT_REACHED' };
      }
    } else if (action === 'quiz') {
      if (dailyCredits.quizzesUsedToday >= FREE_TIER_LIMITS.quiz) {
        return { allowed: false, reason: 'DAILY_LIMIT_REACHED' };
      }
    }

    return { allowed: true };
  }

  /**
   * Increment the daily credit counter for an action.
   */
  async consumeCredit(uid: string, action: 'simulation' | 'quiz') {
    const field =
      action === 'simulation'
        ? 'dailyCredits.ensayosUsedToday'
        : 'dailyCredits.quizzesUsedToday';

    try {
      await this.firebaseService.firestore
        .collection('users')
        .doc(uid)
        .update({
          [field]: admin.firestore.FieldValue.increment(1),
        });
    } catch (e) {}
  }

  /**
   * Activate (or extend) a user's Premium subscription. Used for the first
   * charge of a Flow subscription, a manual bank-transfer approval, or any
   * other verified-payment path.
   */
  async activateSubscription(
    uid: string,
    planType: 'monthly' | 'yearly' = 'monthly',
    providerInfo: { provider: 'flow' | 'manual' | 'transfer'; flowCustomerId?: string; flowSubscriptionId?: string } = { provider: 'manual' },
  ) {
    const userRef = this.firebaseService.firestore.collection('users').doc(uid);

    // IMPORTANT: this used to catch its own errors, log a warning, and return
    // { success: true } regardless of whether the Firestore write actually
    // happened. That meant a paying user could get "Pago aprobado y cuenta
    // actualizada a premium" while their account silently stayed Free. Any
    // failure here MUST propagate to the caller (FlowService.confirmRegistrationAndSubscribe)
    // so it can report the real outcome instead of a false success.

    // Transaction: prevents two near-simultaneous grants (e.g. a Flow confirm racing
    // an admin manual approval for the same user) from reading the same stale
    // existingEndDate and one of them clobbering the other's extension.
    await this.firebaseService.firestore.runTransaction(async (t) => {
        const userDoc = await t.get(userRef);

        let startDate = new Date();
        let endDate = new Date();
        if (planType === 'yearly') {
          endDate.setFullYear(startDate.getFullYear() + 1);
        } else {
          endDate.setMonth(startDate.getMonth() + 1);
        }

        if (userDoc.exists) {
          const userData = userDoc.data()!;
          const isPremium = userData.subscription?.tier === 'premium' || userData.plan === 'premium';
          const existingEndDateVal = userData.subscription?.endDate;

          if (isPremium && existingEndDateVal) {
            const existingEndDate: Date = typeof existingEndDateVal.toDate === 'function'
              ? existingEndDateVal.toDate()
              : new Date(existingEndDateVal);

            if (existingEndDate > new Date()) {
              if (userData.subscription?.startDate) {
                startDate = typeof userData.subscription.startDate.toDate === 'function'
                  ? userData.subscription.startDate.toDate()
                  : new Date(userData.subscription.startDate);
              }
              endDate = new Date(existingEndDate);
              if (planType === 'yearly') {
                endDate.setFullYear(endDate.getFullYear() + 1);
              } else {
                endDate.setMonth(endDate.getMonth() + 1);
              }
            }
          }
        }

      t.set(userRef, {
        subscription: {
          tier: 'premium',
          status: 'active',
          provider: providerInfo.provider,
          planType,
          flowCustomerId: providerInfo.flowCustomerId || null,
          flowSubscriptionId: providerInfo.flowSubscriptionId || null,
          cancelAtPeriodEnd: false,
          startDate,
          endDate,
        },
        plan: 'premium',
        updatedAt: new Date(),
      }, { merge: true });
    });

    return { success: true, message: `Upgraded to premium (${planType})` };
  }

  /**
   * Extend the current period by one billing cycle after a successful Flow
   * renewal charge (called from the recurring webhook). Never called for the
   * first charge of a subscription — that's activateSubscription()'s job.
   */
  async extendSubscriptionPeriod(uid: string, planType: 'monthly' | 'yearly' = 'monthly') {
    const userRef = this.firebaseService.firestore.collection('users').doc(uid);

    await this.firebaseService.firestore.runTransaction(async (t) => {
      const userDoc = await t.get(userRef);
      if (!userDoc.exists) return;

      const userData = userDoc.data()!;
      const sub = userData.subscription || {};

      // The user already asked to cancel — a renewal charge racing the
      // cancellation must not resurrect access for another period.
      if (sub.cancelAtPeriodEnd) return;

      const now = new Date();
      const currentEndDate = sub.endDate
        ? (typeof sub.endDate.toDate === 'function' ? sub.endDate.toDate() : new Date(sub.endDate))
        : null;

      // Flow's webhook fires for every charge, including the very first one
      // that activateSubscription() already granted access for synchronously
      // right after subscribing. If the stored endDate is still comfortably
      // in the future, this webhook call is that same first-charge
      // confirmation arriving a few seconds later — skip it so one charge
      // doesn't grant two periods.
      const RENEWAL_DUE_WINDOW_MS = 2 * 24 * 3600 * 1000;
      if (currentEndDate && currentEndDate.getTime() - now.getTime() > RENEWAL_DUE_WINDOW_MS) {
        return;
      }

      const newEndDate = currentEndDate && currentEndDate > now ? new Date(currentEndDate) : new Date(now);
      if (planType === 'yearly') {
        newEndDate.setFullYear(newEndDate.getFullYear() + 1);
      } else {
        newEndDate.setMonth(newEndDate.getMonth() + 1);
      }

      t.set(userRef, {
        subscription: {
          tier: 'premium',
          status: 'active',
          planType,
          endDate: newEndDate,
        },
        plan: 'premium',
        updatedAt: new Date(),
      }, { merge: true });
    });
  }

  /**
   * Submit a manual bank transfer report.
   */
  async submitManualTransfer(uid: string, dto: SubmitTransferDto) {
    // Guard against the same bank receipt number being submitted more than once
    // (accidentally or to try to farm multiple approvals from one real payment).
    try {
      const existing = await this.firebaseService.firestore
        .collection('manual_payments')
        .where('transferNumber', '==', dto.transferNumber)
        .where('status', 'in', ['pending_approval', 'approved'])
        .limit(1)
        .get();
      if (!existing.empty) {
        throw new BadRequestException('Ya existe un comprobante con ese número de transferencia en revisión o aprobado.');
      }
    } catch (e) {
      if (e instanceof BadRequestException) throw e;
      this.logger.warn(`[SubscriptionsService] Duplicate transfer check failed: ${e.message}`);
    }

    const transferId = `TRF-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const recipientUid = dto.targetUid || uid;

    const transferData = {
      id: transferId,
      payerUid: uid,
      recipientUid,
      bankName: dto.bankName,
      transferNumber: dto.transferNumber,
      amount: dto.amount,
      planType: dto.planType,
      payerEmail: dto.payerEmail || '',
      receiptUrl: dto.receiptUrl || '',
      couponCode: dto.couponCode || null,
      paymentMethod: 'transfer',
      status: 'pending_approval',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.inMemoryTransfers.set(transferId, transferData);

    try {
      await this.firebaseService.firestore
        .collection('manual_payments')
        .doc(transferId)
        .set(transferData);
    } catch (e) {
      this.logger.warn(`[SubscriptionsService] Firestore manual_payments error: ${e.message}`);
    }

    return {
      success: true,
      message: 'Comprobante de transferencia registrado. El equipo revisará y activará tu Plan Pro en breve.',
      transferId,
    };
  }

  /**
   * Helper to find a user by email or UID.
   */
  async findUserByEmailOrUid(targetEmailOrUid: string): Promise<{ uid: string; email: string; data: any } | null> {
    const input = targetEmailOrUid.trim();
    try {
      const doc = await this.firebaseService.firestore.collection('users').doc(input).get();
      if (doc.exists) {
        return { uid: doc.id, email: doc.data()?.email || '', data: doc.data() };
      }

      const query = await this.firebaseService.firestore
        .collection('users')
        .where('email', '==', input.toLowerCase())
        .limit(1)
        .get();

      if (!query.empty) {
        const userDoc = query.docs[0];
        return { uid: userDoc.id, email: userDoc.data().email, data: userDoc.data() };
      }
    } catch (e) {
      this.logger.warn(`[SubscriptionsService] findUserByEmailOrUid error: ${e.message}`);
    }

    if (input.includes('@')) {
      return { uid: `uid-${input.split('@')[0]}`, email: input, data: {} };
    }
    return null;
  }

  /**
   * ADMIN: Grant Plan PRO manually to a user (by email or UID) for N months.
   */
  async manualGrant(targetEmailOrUid: string, durationMonths: number, planType: 'monthly' | 'yearly' = 'monthly', adminUid: string, reason?: string) {
    const user = await this.findUserByEmailOrUid(targetEmailOrUid);
    if (!user) {
      throw new NotFoundException(`Usuario no encontrado para "${targetEmailOrUid}"`);
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(startDate.getMonth() + durationMonths);

    try {
      await this.firebaseService.firestore
        .collection('users')
        .doc(user.uid)
        .set({
          subscription: {
            tier: 'premium',
            status: 'active',
            provider: 'manual',
            planType,
            cancelAtPeriodEnd: false,
            startDate,
            endDate,
            grantedBy: adminUid,
            grantReason: reason || 'Concedido manualmente por Admin',
          },
          plan: 'premium',
          updatedAt: new Date(),
        }, { merge: true });

      await this.firebaseService.firestore.collection('admin_audit_logs').add({
        action: 'GRANT_PREMIUM',
        adminUid,
        targetUid: user.uid,
        targetEmail: user.email,
        durationMonths,
        reason,
        timestamp: new Date(),
      });
    } catch (e) {
      this.logger.warn(`[SubscriptionsService] manualGrant Firestore error: ${e.message}`);
    }

    return {
      success: true,
      message: `Plan Pro concedido a ${user.email || user.uid} por ${durationMonths} mes(es). Vence el ${endDate.toLocaleDateString('es-CL')}.`,
      uid: user.uid,
      email: user.email,
      endDate,
    };
  }

  /**
   * ADMIN: Extend an existing Plan PRO by N days, counted from whichever is
   * later: the current `endDate` (if still in the future) or today. A
   * diferencia de manualGrant (que siempre resetea el período completo
   * desde hoy y solo admite meses), esto SUMA días exactos a lo que ya le
   * queda — usado por el botón "Extender" para no acortarle el período a
   * alguien que aún tiene días pendientes, y para poder darle un número de
   * días arbitrario (no solo bloques de meses).
   */
  async manualExtend(targetEmailOrUid: string, durationDays: number, adminUid: string, reason?: string) {
    const user = await this.findUserByEmailOrUid(targetEmailOrUid);
    if (!user) {
      throw new NotFoundException(`Usuario no encontrado para "${targetEmailOrUid}"`);
    }

    const userDoc = await this.firebaseService.firestore.collection('users').doc(user.uid).get();
    const currentSub = userDoc.data()?.subscription;

    let baseDate = new Date();
    if (currentSub?.endDate) {
      const currentEnd = typeof currentSub.endDate.toDate === 'function'
        ? currentSub.endDate.toDate()
        : new Date(currentSub.endDate);
      if (currentEnd > baseDate) {
        baseDate = currentEnd;
      }
    }

    const endDate = new Date(baseDate);
    endDate.setDate(endDate.getDate() + durationDays);

    try {
      // merge:true hace merge recursivo en el mapa `subscription`, así que
      // esto solo toca los campos listados abajo (incluido `startDate`, que
      // se deja intacto — sigue reflejando cuándo se hizo premium por
      // primera vez, no cuándo se extendió).
      await this.firebaseService.firestore
        .collection('users')
        .doc(user.uid)
        .set({
          subscription: {
            tier: 'premium',
            status: 'active',
            cancelAtPeriodEnd: false,
            endDate,
            extendedBy: adminUid,
            extendReason: reason || 'Extendido manualmente por Admin',
          },
          plan: 'premium',
          updatedAt: new Date(),
        }, { merge: true });

      await this.firebaseService.firestore.collection('admin_audit_logs').add({
        action: 'EXTEND_PREMIUM',
        adminUid,
        targetUid: user.uid,
        targetEmail: user.email,
        durationDays,
        reason,
        timestamp: new Date(),
      });
    } catch (e) {
      this.logger.warn(`[SubscriptionsService] manualExtend Firestore error: ${e.message}`);
    }

    return {
      success: true,
      message: `Plan Pro extendido ${durationDays} día(s) para ${user.email || user.uid}. Ahora vence el ${endDate.toLocaleDateString('es-CL')}.`,
      uid: user.uid,
      email: user.email,
      endDate,
    };
  }

  /**
   * ADMIN: Revoke Plan PRO from a user.
   */
  async manualRevoke(targetEmailOrUid: string, adminUid: string, reason?: string) {
    const user = await this.findUserByEmailOrUid(targetEmailOrUid);
    if (!user) {
      throw new NotFoundException(`Usuario no encontrado para "${targetEmailOrUid}"`);
    }

    try {
      await this.firebaseService.firestore
        .collection('users')
        .doc(user.uid)
        .set({
          subscription: {
            tier: 'free',
            status: 'revoked',
            revokedBy: adminUid,
            revokeReason: reason || 'Revocado por Admin',
          },
          plan: 'free',
          updatedAt: new Date(),
        }, { merge: true });

      await this.firebaseService.firestore.collection('admin_audit_logs').add({
        action: 'REVOKE_PREMIUM',
        adminUid,
        targetUid: user.uid,
        targetEmail: user.email,
        reason,
        timestamp: new Date(),
      });
    } catch (e) {
      this.logger.warn(`[SubscriptionsService] manualRevoke Firestore error: ${e.message}`);
    }

    return {
      success: true,
      message: `Plan Pro revocado para ${user.email || user.uid}. La cuenta volvió a nivel Gratuito.`,
    };
  }

  /**
   * ADMIN: Get unified list of all transactions and manual transfer claims.
   */
  async getAllTransactions() {
    const transactions: any[] = [];

    try {
      const invSnapshot = await this.firebaseService.firestore
        .collection('flow_invoices')
        .orderBy('createdAt', 'desc')
        .limit(100)
        .get();

      invSnapshot.forEach(doc => {
        const d = doc.data();
        transactions.push({
          id: doc.id,
          type: 'flow',
          subscriptionId: d.subscriptionId || '---',
          payerUid: d.uid,
          recipientUid: d.uid,
          amount: d.amount,
          planType: d.planType || 'monthly',
          status: d.status,
          createdAt: d.createdAt?.toDate ? d.createdAt.toDate() : d.createdAt,
        });
      });
    } catch (e) {
      this.logger.warn(`[SubscriptionsService] getAllTransactions Firestore error: ${e.message}`);
    }

    try {
      const trfSnapshot = await this.firebaseService.firestore
        .collection('manual_payments')
        .orderBy('createdAt', 'desc')
        .limit(100)
        .get();

      trfSnapshot.forEach(doc => {
        const d = doc.data();
        transactions.push({
          id: doc.id,
          type: 'transfer',
          transferNumber: d.transferNumber,
          bankName: d.bankName,
          payerEmail: d.payerEmail,
          payerUid: d.payerUid,
          recipientUid: d.recipientUid,
          amount: d.amount,
          planType: d.planType || 'monthly',
          status: d.status,
          // The actual image is NOT sent here on purpose — with up to 100
          // records per load, each carrying a ~100-250KB base64 receipt,
          // this list would ship several MB on every panel open/refresh
          // even for transfers resolved months ago. Just a boolean; the
          // real `receiptUrl` is fetched on demand via getTransferReceipt()
          // only when an admin actually clicks "Ver comprobante".
          hasReceipt: !!d.receiptUrl,
          createdAt: d.createdAt?.toDate ? d.createdAt.toDate() : d.createdAt,
        });
      });
    } catch (e) {}

    this.inMemoryTransfers.forEach((val, id) => {
      if (!transactions.some(t => t.id === id)) {
        transactions.push({ ...val, type: 'transfer' });
      }
    });

    transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return transactions;
  }

  /**
   * ADMIN: Approve or Reject a manual bank transfer request.
   */
  async approveTransfer(transferId: string, action: 'approve' | 'reject', adminUid: string, rejectionReason?: string, planType?: 'monthly' | 'yearly') {
    let transfer = this.inMemoryTransfers.get(transferId);

    try {
      const docRef = this.firebaseService.firestore.collection('manual_payments').doc(transferId);
      const doc = await docRef.get();
      if (doc.exists) {
        transfer = doc.data();
      }
    } catch (e) {}

    if (!transfer) {
      throw new NotFoundException('Comprobante de transferencia no encontrado');
    }

    // Idempotency: a transfer already resolved can't be re-approved/re-rejected
    // (prevents double-clicks from re-extending a subscription or duplicating audit logs).
    if (transfer.status === 'approved' || transfer.status === 'rejected') {
      return {
        success: true,
        message: `Esta transferencia ya fue ${transfer.status === 'approved' ? 'aprobada' : 'rechazada'} previamente.`,
      };
    }

    if (action === 'approve') {
      // The admin's chosen duration wins over whatever the student picked on
      // the transfer form — that field is just their stated intent, not
      // verified by anything, so the grant should reflect what the admin
      // actually decided to give after checking the receipt.
      const grantedPlanType = planType || transfer.planType || 'monthly';
      transfer.status = 'approved';
      const recipientUid = transfer.recipientUid || transfer.payerUid;
      await this.activateSubscription(recipientUid, grantedPlanType, { provider: 'transfer' });

      try {
        await this.firebaseService.firestore
          .collection('manual_payments')
          .doc(transferId)
          .update({ status: 'approved', approvedBy: adminUid, grantedPlanType, updatedAt: new Date() });
      } catch (e) {}

      await this.logAdminAction('APPROVE_TRANSFER', adminUid, recipientUid, { transferId, amount: transfer.amount, planType: grantedPlanType });

      return { success: true, message: `Transferencia aprobada — Plan Pro ${grantedPlanType === 'yearly' ? 'anual' : 'mensual'} activado con éxito.` };
    } else {
      transfer.status = 'rejected';
      transfer.rejectionReason = rejectionReason || 'Comprobante inválido';

      try {
        await this.firebaseService.firestore
          .collection('manual_payments')
          .doc(transferId)
          .update({ status: 'rejected', rejectionReason, rejectedBy: adminUid, updatedAt: new Date() });
      } catch (e) {}

      await this.logAdminAction('REJECT_TRANSFER', adminUid, transfer.recipientUid || transfer.payerUid, { transferId, rejectionReason });

      return { success: true, message: 'Transferencia rechazada.' };
    }
  }

  /**
   * Permanently deletes a resolved transfer record — mainly to reclaim the
   * space its base64 `receiptUrl` image takes in Firestore once it no
   * longer matters (the decision is already made and reflected on the
   * user's subscription). Only allowed for records already approved or
   * rejected: a pending one still needs its receipt to be reviewable.
   */
  async deleteTransferRecord(transferId: string, adminUid: string) {
    const docRef = this.firebaseService.firestore.collection('manual_payments').doc(transferId);
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new NotFoundException('Comprobante de transferencia no encontrado');
    }

    const transfer = doc.data()!;
    if (transfer.status !== 'approved' && transfer.status !== 'rejected') {
      throw new BadRequestException('Solo se pueden eliminar registros ya aprobados o rechazados.');
    }

    await docRef.delete();
    this.inMemoryTransfers.delete(transferId);

    await this.logAdminAction('DELETE_TRANSFER_RECORD', adminUid, transfer.recipientUid || transfer.payerUid, { transferId, previousStatus: transfer.status });

    return { success: true, message: 'Registro eliminado.' };
  }

  /**
   * Fetches a single transfer's receipt image on demand — kept out of
   * getAllTransactions()'s list payload for the reason noted there.
   */
  async getTransferReceipt(transferId: string): Promise<{ receiptUrl: string }> {
    const doc = await this.firebaseService.firestore.collection('manual_payments').doc(transferId).get();
    if (!doc.exists) {
      throw new NotFoundException('Comprobante de transferencia no encontrado');
    }
    const receiptUrl = doc.data()?.receiptUrl;
    if (!receiptUrl) {
      throw new NotFoundException('Esta transferencia no tiene comprobante adjunto.');
    }
    return { receiptUrl };
  }

  private async logAdminAction(action: string, adminUid: string, targetUid: string, extra: Record<string, any> = {}) {
    try {
      await this.firebaseService.firestore.collection('admin_audit_logs').add({
        action,
        adminUid,
        targetUid,
        ...extra,
        timestamp: new Date(),
      });
    } catch (e) {
      this.logger.warn(`[SubscriptionsService] Could not write admin audit log for "${action}": ${e.message}`);
    }
  }

  /**
   * Cancel premium subscription. Access is kept until the already-paid
   * `endDate` — we only stop future renewals (mirrors standard SaaS
   * cancel-at-period-end UX). The actual downgrade to Free happens lazily,
   * the same way it already does for expiry: checkCredits()/normalizeProfile()
   * flip tier/status once `endDate` is in the past — no extra write needed here.
   */
  async cancel(uid: string) {
    const userRef = this.firebaseService.firestore.collection('users').doc(uid);
    let flowSubscriptionId: string | null = null;
    let endDateJs: Date | null = null;

    try {
      const userDoc = await userRef.get();
      if (userDoc.exists) {
        const sub = userDoc.data()?.subscription;
        flowSubscriptionId = sub?.flowSubscriptionId || null;
        const endDateVal = sub?.endDate;
        if (endDateVal) {
          endDateJs = typeof endDateVal.toDate === 'function' ? endDateVal.toDate() : new Date(endDateVal);
        }
      }

      await userRef.update({
        'subscription.cancelAtPeriodEnd': true,
        'subscription.status': 'cancelled',
        updatedAt: new Date(),
      });
    } catch (e) {
      this.logger.warn(`[SubscriptionsService] cancel error: ${e.message}`);
    }

    return {
      success: true,
      message: endDateJs
        ? `Tu suscripción fue cancelada. Mantendrás acceso Premium hasta el ${endDateJs.toLocaleDateString('es-CL')}.`
        : 'Tu suscripción fue cancelada.',
      endDate: endDateJs,
      flowSubscriptionId,
    };
  }

  private async getResetCredits(uid: string, userData: any) {
    const now = new Date();
    const chileOffset = -3 * 60;
    const chileDate = new Date(now.getTime() + chileOffset * 60000);
    const todayStr = chileDate.toISOString().split('T')[0];

    const dailyCredits = userData.dailyCredits || {
      ensayosUsedToday: 0,
      quizzesUsedToday: 0,
      focoTokensUsedToday: 0,
      lastResetDate: todayStr,
    };

    if (dailyCredits.lastResetDate !== todayStr) {
      const resetData = {
        ensayosUsedToday: 0,
        quizzesUsedToday: 0,
        focoTokensUsedToday: 0,
        lastResetDate: todayStr,
      };

      try {
        await this.firebaseService.firestore
          .collection('users')
          .doc(uid)
          .update({ dailyCredits: resetData });
      } catch (e) {}

      return resetData;
    }

    return dailyCredits;
  }
}
