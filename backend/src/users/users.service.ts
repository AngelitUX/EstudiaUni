import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly firebaseService: FirebaseService) {}

  async updateProfile(uid: string, dto: UpdateProfileDto) {
    const userRef = this.firebaseService.firestore.collection('users').doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      throw new NotFoundException('User not found');
    }

    const updateData: any = { updatedAt: new Date() };
    if (dto.displayName) updateData.displayName = dto.displayName;
    if (dto.photoURL !== undefined) updateData.photoURL = dto.photoURL;

    await userRef.update(updateData);

    return { uid, ...doc.data(), ...updateData };
  }

  async getDashboard(uid: string) {
    const db = this.firebaseService.firestore;

    // Get user profile
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) throw new NotFoundException('User not found');

    const userData = userDoc.data()!;

    // Get recent attempts (last 10)
    const attemptsSnap = await db
      .collection('attempts')
      .where('userId', '==', uid)
      .where('status', '==', 'completed')
      .orderBy('finishedAt', 'desc')
      .limit(10)
      .get();

    const recentAttempts = attemptsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Get progress stats
    const progressSnap = await db
      .collection('user_topic_progress')
      .where('userId', '==', uid)
      .get();

    const progressData = progressSnap.docs.map((doc) => doc.data());
    const completedTopics = progressData.filter(
      (p) => p.status === 'completed',
    ).length;
    const totalTopics = progressData.length;

    return {
      user: {
        displayName: userData.displayName,
        email: userData.email,
        photoURL: userData.photoURL,
        subscription: userData.subscription,
        dailyCredits: userData.dailyCredits,
      },
      progress: {
        globalProgress: userData.learningProfile?.globalProgress || 0,
        completedTopics,
        totalTopics,
        strengths: userData.learningProfile?.strengths || [],
        weaknesses: userData.learningProfile?.weaknesses || [],
      },
      recentAttempts,
    };
  }

  async getProgress(uid: string, moduleId?: string) {
    const db = this.firebaseService.firestore;
    let query: FirebaseFirestore.Query = db
      .collection('user_topic_progress')
      .where('userId', '==', uid);

    if (moduleId) {
      query = query.where('moduleId', '==', moduleId);
    }

    const snap = await query.get();
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
}
