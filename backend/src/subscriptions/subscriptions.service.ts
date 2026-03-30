import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

const FREE_TIER_LIMITS = {
  simulation: 1,  // 1 ensayo por día
  quiz: 5,        // 5 quizzes por día
};

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  constructor(private readonly firebaseService: FirebaseService) {}

  /**
   * Get current subscription status and remaining daily credits.
   */
  async getStatus(uid: string) {
    const userDoc = await this.firebaseService.firestore
      .collection('users')
      .doc(uid)
      .get();

    if (!userDoc.exists) throw new NotFoundException('User not found');

    const userData = userDoc.data()!;
    const subscription = userData.subscription;
    const dailyCredits = await this.getResetCredits(uid, userData);

    return {
      tier: subscription.tier,
      status: subscription.status,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      credits: {
        ensayosRemaining:
          subscription.tier === 'premium'
            ? 'unlimited'
            : Math.max(0, FREE_TIER_LIMITS.simulation - dailyCredits.ensayosUsedToday),
        quizzesRemaining:
          subscription.tier === 'premium'
            ? 'unlimited'
            : Math.max(0, FREE_TIER_LIMITS.quiz - dailyCredits.quizzesUsedToday),
      },
    };
  }

  /**
   * Check if the user can perform an action (simulation or quiz).
   * Resets daily credits if the date has changed.
   */
  async checkCredits(
    uid: string,
    action: 'simulation' | 'quiz',
  ): Promise<{ allowed: boolean; reason?: string }> {
    const userDoc = await this.firebaseService.firestore
      .collection('users')
      .doc(uid)
      .get();

    if (!userDoc.exists) throw new NotFoundException('User not found');

    const userData = userDoc.data()!;

    // Premium users always allowed
    if (userData.subscription?.tier === 'premium') {
      return { allowed: true };
    }

    // Free tier — check daily limits
    const dailyCredits = await this.getResetCredits(uid, userData);

    if (action === 'simulation') {
      if (dailyCredits.ensayosUsedToday >= FREE_TIER_LIMITS.simulation) {
        return {
          allowed: false,
          reason: 'DAILY_LIMIT_REACHED',
        };
      }
    } else if (action === 'quiz') {
      if (dailyCredits.quizzesUsedToday >= FREE_TIER_LIMITS.quiz) {
        return {
          allowed: false,
          reason: 'DAILY_LIMIT_REACHED',
        };
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

    await this.firebaseService.firestore
      .collection('users')
      .doc(uid)
      .update({
        [field]: (await this.getCurrentCount(uid, action)) + 1,
      });
  }

  /**
   * Upgrade user to premium (placeholder — no Stripe integration yet).
   */
  async upgrade(uid: string) {
    await this.firebaseService.firestore
      .collection('users')
      .doc(uid)
      .update({
        'subscription.tier': 'premium',
        'subscription.status': 'active',
        'subscription.startDate': new Date(),
        'subscription.endDate': null, // indefinite for placeholder
        updatedAt: new Date(),
      });

    return { success: true, message: 'Upgraded to premium' };
  }

  /**
   * Cancel premium subscription (reverts to free).
   */
  async cancel(uid: string) {
    await this.firebaseService.firestore
      .collection('users')
      .doc(uid)
      .update({
        'subscription.tier': 'free',
        'subscription.status': 'cancelled',
        updatedAt: new Date(),
      });

    return { success: true, message: 'Subscription cancelled' };
  }

  /**
   * Reset daily credits if the date has changed (UTC-3 Chile timezone).
   */
  private async getResetCredits(uid: string, userData: any) {
    const now = new Date();
    // Chile timezone offset: UTC-3 (or UTC-4 in winter, simplified to -3)
    const chileOffset = -3 * 60;
    const chileDate = new Date(now.getTime() + chileOffset * 60000);
    const todayStr = chileDate.toISOString().split('T')[0];

    const dailyCredits = userData.dailyCredits || {
      ensayosUsedToday: 0,
      quizzesUsedToday: 0,
      lastResetDate: todayStr,
    };

    if (dailyCredits.lastResetDate !== todayStr) {
      // Reset credits for new day
      const resetData = {
        ensayosUsedToday: 0,
        quizzesUsedToday: 0,
        lastResetDate: todayStr,
      };

      await this.firebaseService.firestore
        .collection('users')
        .doc(uid)
        .update({ dailyCredits: resetData });

      return resetData;
    }

    return dailyCredits;
  }

  private async getCurrentCount(
    uid: string,
    action: 'simulation' | 'quiz',
  ): Promise<number> {
    const doc = await this.firebaseService.firestore
      .collection('users')
      .doc(uid)
      .get();
    const data = doc.data();
    if (action === 'simulation') {
      return data?.dailyCredits?.ensayosUsedToday || 0;
    }
    return data?.dailyCredits?.quizzesUsedToday || 0;
  }
}
