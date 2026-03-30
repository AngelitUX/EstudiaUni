import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';

@Injectable()
export class PremiumGuard implements CanActivate {
  constructor(private readonly firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.uid;

    if (!userId) {
      throw new ForbiddenException('User not authenticated');
    }

    const userDoc = await this.firebaseService.firestore
      .collection('users')
      .doc(userId)
      .get();

    if (!userDoc.exists) {
      throw new ForbiddenException('User profile not found');
    }

    const userData = userDoc.data();
    const tier = userData?.subscription?.tier;

    if (tier !== 'premium') {
      throw new ForbiddenException({
        code: 'PREMIUM_REQUIRED',
        message: 'This feature requires a premium subscription',
        upgradeUrl: '/premium',
      });
    }

    return true;
  }
}
