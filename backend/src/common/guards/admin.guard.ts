import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';

/**
 * AdminGuard - Security Guard for Admin Endpoints
 * 
 * BUG FIX (29/03/2026): Added admin role verification
 * BEFORE: Any authenticated user could access /admin/* endpoints
 * AFTER: Only users in /admins collection with active=true can access
 * 
 * Usage: @UseGuards(FirebaseAuthGuard, AdminGuard)
 * 
 * Checks:
 * 1. User is authenticated (handled by FirebaseAuthGuard first)
 * 2. User exists in Firestore /admins collection
 * 3. Admin account is active
 */
@Injectable()
export class AdminGuard implements CanActivate {
  private readonly logger = new Logger(AdminGuard.name);

  constructor(private readonly firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.uid) {
      throw new ForbiddenException('User not authenticated');
    }

    try {
      // Check if user exists in /admins collection
      const adminDoc = await this.firebaseService.firestore
        .collection('admins')
        .doc(user.uid)
        .get();

      if (!adminDoc.exists) {
        this.logger.warn(`User ${user.uid} attempted to access admin endpoint`);
        throw new ForbiddenException('Admin access required');
      }

      // Optionally, check for specific role
      const adminData = adminDoc.data();
      if (adminData && !adminData.active) {
        throw new ForbiddenException('Admin account is inactive');
      }

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      this.logger.error(`Error checking admin status: ${error.message}`);
      throw new ForbiddenException('Could not verify admin status');
    }
  }
}
