import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  private readonly logger = new Logger(FirebaseAuthGuard.name);

  constructor(private readonly firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const token = authHeader.split('Bearer ')[1];

    try {
      const decodedToken = await this.firebaseService.auth.verifyIdToken(token);
      request.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
      };
      return true;
    } catch (error) {
      this.logger.warn(`Token verification failed: ${error.message}`);

      // SECURITY: there used to be a fallback here that decoded the JWT payload
      // without verifying its signature whenever verifyIdToken() failed. Since a
      // JWT payload can be freely forged (no signature needed to read/write the
      // base64 segment), that fallback let anyone impersonate any uid — including
      // hitting payment/admin endpoints as another user. Never resurrect it; if
      // verification fails, the request is unauthenticated, full stop.

      if (error.code === 'auth/id-token-expired') {
        throw new UnauthorizedException('Token expired. Please login again.');
      }

      throw new UnauthorizedException('Invalid authentication token');
    }
  }
}
