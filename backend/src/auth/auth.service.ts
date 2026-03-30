import {
  Injectable,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly firebaseService: FirebaseService) {}

  /**
   * Register a new user with email/password.
   * Creates Firebase Auth user + Firestore user document.
   */
  async register(dto: RegisterDto) {
    try {
      // Create Firebase Auth user
      const userRecord = await this.firebaseService.auth.createUser({
        email: dto.email,
        password: dto.password,
        displayName: dto.displayName,
      });

      // Create Firestore user document with free tier defaults
      await this.createUserDocument(
        userRecord.uid,
        dto.email,
        dto.displayName,
      );

      // Generate custom token for immediate login
      const token = await this.firebaseService.auth.createCustomToken(
        userRecord.uid,
      );

      return {
        userId: userRecord.uid,
        token,
        user: {
          uid: userRecord.uid,
          email: dto.email,
          displayName: dto.displayName,
          tier: 'free',
        },
      };
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        throw new ConflictException('An account with this email already exists');
      }
      if (error.code === 'auth/invalid-password') {
        throw new BadRequestException(
          'Password must be at least 6 characters',
        );
      }
      this.logger.error(`Registration failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verify Google ID token and create/update user document.
   */
  async googleAuth(idToken: string) {
    try {
      const decodedToken =
        await this.firebaseService.auth.verifyIdToken(idToken);
      const uid = decodedToken.uid;

      // Check if user document exists
      const userDoc = await this.firebaseService.firestore
        .collection('users')
        .doc(uid)
        .get();

      if (!userDoc.exists) {
        await this.createUserDocument(
          uid,
          decodedToken.email || '',
          decodedToken.name || 'Student',
          decodedToken.picture,
        );
      }

      const token = await this.firebaseService.auth.createCustomToken(uid);

      return {
        userId: uid,
        token,
        user: {
          uid,
          email: decodedToken.email,
          displayName: decodedToken.name,
          tier: userDoc.exists
            ? userDoc.data()?.subscription?.tier || 'free'
            : 'free',
        },
      };
    } catch (error) {
      this.logger.error(`Google auth failed: ${error.message}`);
      throw new BadRequestException('Invalid Google token');
    }
  }

  /**
   * Get current user profile from Firestore.
   */
  async getMe(uid: string) {
    const userDoc = await this.firebaseService.firestore
      .collection('users')
      .doc(uid)
      .get();

    if (!userDoc.exists) {
      throw new BadRequestException('User profile not found');
    }

    return { uid, ...userDoc.data() };
  }

  /**
   * Create the default user document in Firestore.
   */
  private async createUserDocument(
    uid: string,
    email: string,
    displayName: string,
    photoURL?: string,
  ) {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    await this.firebaseService.firestore
      .collection('users')
      .doc(uid)
      .set({
        email,
        displayName,
        photoURL: photoURL || null,
        role: 'student',
        createdAt: now,
        updatedAt: now,
        subscription: {
          tier: 'free',
          status: 'active',
          startDate: null,
          endDate: null,
          stripeCustomerId: null,
        },
        dailyCredits: {
          ensayosUsedToday: 0,
          quizzesUsedToday: 0,
          lastResetDate: todayStr,
        },
        learningProfile: {
          currentModuleId: null,
          currentTopicId: null,
          globalProgress: 0,
          strengths: [],
          weaknesses: [],
        },
        onboardingCompleted: false,
      });

    this.logger.log(`User document created for: ${uid}`);
  }
}
