import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class ModulesContentService {
  private readonly logger = new Logger(ModulesContentService.name);

  constructor(private readonly firebaseService: FirebaseService) {}

  /**
   * List all active modules with user progress attached.
   */
  async listModules(uid: string) {
    const db = this.firebaseService.firestore;

    const modulesSnap = await db
      .collection('modules')
      .where('isActive', '==', true)
      .orderBy('order')
      .get();

    const modules = await Promise.all(
      modulesSnap.docs.map(async (doc) => {
        const moduleData = { id: doc.id, ...doc.data() };

        // Get user progress for this module
        const progressSnap = await db
          .collection('user_topic_progress')
          .where('userId', '==', uid)
          .where('moduleId', '==', doc.id)
          .get();

        const topicProgress = progressSnap.docs.map((p) => p.data());
        const completedCount = topicProgress.filter(
          (p) => p.status === 'completed',
        ).length;

        return {
          ...moduleData,
          userProgress: {
            completedTopics: completedCount,
            totalTopics: (moduleData as any).totalTopics || 0,
            percentage:
              (moduleData as any).totalTopics > 0
                ? Math.round(
                    (completedCount / (moduleData as any).totalTopics) * 100,
                  )
                : 0,
          },
        };
      }),
    );

    return modules;
  }

  /**
   * Get module detail with all its topics.
   */
  async getModule(moduleId: string, uid: string) {
    const db = this.firebaseService.firestore;

    const moduleDoc = await db.collection('modules').doc(moduleId).get();
    if (!moduleDoc.exists) throw new NotFoundException('Module not found');

    const topicsSnap = await db
      .collection('modules')
      .doc(moduleId)
      .collection('topics')
      .orderBy('order')
      .get();

    // Get user progress for all topics in this module
    const progressSnap = await db
      .collection('user_topic_progress')
      .where('userId', '==', uid)
      .where('moduleId', '==', moduleId)
      .get();

    const progressMap = new Map<string, any>();
    progressSnap.docs.forEach((p) => {
      const data = p.data();
      progressMap.set(data.topicId, data);
    });

    const topics = topicsSnap.docs.map((doc) => {
      const topicData = { id: doc.id, ...doc.data() };
      const progress = progressMap.get(doc.id);

      return {
        ...topicData,
        userStatus: progress?.status || 'locked',
        masteryLevel: progress?.masteryLevel || 0,
      };
    });

    return {
      id: moduleDoc.id,
      ...moduleDoc.data(),
      topics,
    };
  }

  /**
   * Get full topic content. Verifies the topic is unlocked for the user.
   */
  async getTopic(moduleId: string, topicId: string, uid: string) {
    const db = this.firebaseService.firestore;

    // Check user progress / unlock status
    const progressId = `${uid}_${topicId}`;
    const progressDoc = await db
      .collection('user_topic_progress')
      .doc(progressId)
      .get();

    if (progressDoc.exists) {
      const status = progressDoc.data()?.status;
      if (status === 'locked') {
        throw new ForbiddenException({
          code: 'TOPIC_LOCKED',
          message:
            'This topic is locked. Complete prerequisite topics to unlock it.',
        });
      }
    }

    const topicDoc = await db
      .collection('modules')
      .doc(moduleId)
      .collection('topics')
      .doc(topicId)
      .get();

    if (!topicDoc.exists) throw new NotFoundException('Topic not found');

    let progressData: any = progressDoc.exists ? progressDoc.data() : null;

    // Update status to in_progress if it was available
    if (
      !progressDoc.exists ||
      progressDoc.data()?.status === 'available'
    ) {
      progressData = {
        userId: uid,
        moduleId,
        topicId,
        status: 'in_progress',
        quizzesTaken: 0,
        bestQuizScore: 0,
        lastAccessedAt: new Date(),
        masteryLevel: 0,
      };
      await db
        .collection('user_topic_progress')
        .doc(progressId)
        .set(progressData, { merge: true });
    } else {
      await db
        .collection('user_topic_progress')
        .doc(progressId)
        .update({ lastAccessedAt: new Date() });
    }

    // Return in format expected by frontend: {topic: {...}, progress: {...}}
    return {
      topic: { id: topicDoc.id, ...topicDoc.data() },
      progress: progressData || {
        userId: uid,
        moduleId,
        topicId,
        status: 'in_progress',
        masteryLevel: 0,
        quizzesTaken: 0,
      },
    };
  }
}
