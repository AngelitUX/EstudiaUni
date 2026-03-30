import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class LearningPathService {
  private readonly logger = new Logger(LearningPathService.name);

  constructor(private readonly firebaseService: FirebaseService) {}

  /**
   * Get the current learning path state for a user.
   * Returns all topics grouped by module with their unlock status.
   */
  async getLearningPath(uid: string) {
    const db = this.firebaseService.firestore;

    // Get all modules
    const modulesSnap = await db
      .collection('modules')
      .where('isActive', '==', true)
      .orderBy('order')
      .get();

    // Get all user progress
    const progressSnap = await db
      .collection('user_topic_progress')
      .where('userId', '==', uid)
      .get();

    const progressMap = new Map<string, any>();
    progressSnap.docs.forEach((doc) => {
      const data = doc.data();
      progressMap.set(data.topicId, data);
    });

    const path = await Promise.all(
      modulesSnap.docs.map(async (moduleDoc) => {
        const moduleData = moduleDoc.data();
        const topicsSnap = await db
          .collection('modules')
          .doc(moduleDoc.id)
          .collection('topics')
          .orderBy('order')
          .get();

        const topics = topicsSnap.docs.map((topicDoc) => {
          const topicData = topicDoc.data();
          const progress = progressMap.get(topicDoc.id);

          return {
            id: topicDoc.id,
            title: topicData.title,
            order: topicData.order,
            difficulty: topicData.difficultyLevel,
            estimatedMinutes: topicData.estimatedMinutes,
            status: progress?.status || 'locked',
            masteryLevel: progress?.masteryLevel || 0,
            prerequisiteTopicIds: topicData.prerequisiteTopicIds || [],
          };
        });

        return {
          id: moduleDoc.id,
          title: moduleData.title,
          subject: moduleData.subject,
          iconUrl: moduleData.iconUrl,
          topics,
        };
      }),
    );

    return path;
  }

  /**
   * Evaluate and unlock topics based on prerequisite completion.
   * Called after quiz/simulation completion.
   */
  async evaluateUnlocks(uid: string): Promise<string[]> {
    const db = this.firebaseService.firestore;
    const unlockedTopics: string[] = [];

    // Get all user progress
    const progressSnap = await db
      .collection('user_topic_progress')
      .where('userId', '==', uid)
      .get();

    const progressMap = new Map<string, any>();
    progressSnap.docs.forEach((doc) => {
      const data = doc.data();
      progressMap.set(data.topicId, data);
    });

    // Get all modules and their topics
    const modulesSnap = await db.collection('modules').get();

    for (const moduleDoc of modulesSnap.docs) {
      const topicsSnap = await db
        .collection('modules')
        .doc(moduleDoc.id)
        .collection('topics')
        .orderBy('order')
        .get();

      for (const topicDoc of topicsSnap.docs) {
        const topicData = topicDoc.data();
        const progressId = `${uid}_${topicDoc.id}`;
        const currentProgress = progressMap.get(topicDoc.id);

        // Skip if already unlocked or completed
        if (
          currentProgress &&
          currentProgress.status !== 'locked'
        ) {
          continue;
        }

        const prerequisites = topicData.prerequisiteTopicIds || [];

        // If no prerequisites, topic should be available
        if (prerequisites.length === 0) {
          await db
            .collection('user_topic_progress')
            .doc(progressId)
            .set(
              {
                userId: uid,
                moduleId: moduleDoc.id,
                topicId: topicDoc.id,
                status: 'available',
                quizzesTaken: 0,
                bestQuizScore: 0,
                lastAccessedAt: new Date(),
                masteryLevel: 0,
              },
              { merge: true },
            );
          unlockedTopics.push(topicDoc.id);
          continue;
        }

        // Check if ALL prerequisites are completed with mastery >= 60
        const allPrereqsMet = prerequisites.every((prereqId: string) => {
          const prereqProgress = progressMap.get(prereqId);
          return (
            prereqProgress &&
            prereqProgress.status === 'completed' &&
            prereqProgress.masteryLevel >= 60
          );
        });

        if (allPrereqsMet) {
          await db
            .collection('user_topic_progress')
            .doc(progressId)
            .set(
              {
                userId: uid,
                moduleId: moduleDoc.id,
                topicId: topicDoc.id,
                status: 'available',
                quizzesTaken: 0,
                bestQuizScore: 0,
                lastAccessedAt: new Date(),
                masteryLevel: 0,
              },
              { merge: true },
            );
          unlockedTopics.push(topicDoc.id);
        }
      }
    }

    // Update global progress
    if (unlockedTopics.length > 0) {
      await this.updateGlobalProgress(uid);
    }

    return unlockedTopics;
  }

  /**
   * Get AI-powered study recommendations.
   */
  async getRecommendations(uid: string) {
    const db = this.firebaseService.firestore;

    const userDoc = await db.collection('users').doc(uid).get();
    const learningProfile = userDoc.data()?.learningProfile || {};

    const weaknesses = learningProfile.weaknesses || [];
    const recommendations: any[] = [];

    // Recommend weak topics first
    for (const topicId of weaknesses.slice(0, 3)) {
      const progressId = `${uid}_${topicId}`;
      const progressDoc = await db
        .collection('user_topic_progress')
        .doc(progressId)
        .get();

      if (progressDoc.exists) {
        const progress = progressDoc.data()!;
        recommendations.push({
          type: 'review',
          topicId,
          moduleId: progress.moduleId,
          reason: `Tu nivel de dominio es ${progress.masteryLevel}%. Repasar te ayudará a mejorar.`,
          priority: 'high',
        });
      }
    }

    // Recommend available topics
    const availableSnap = await db
      .collection('user_topic_progress')
      .where('userId', '==', uid)
      .where('status', '==', 'available')
      .limit(3)
      .get();

    for (const doc of availableSnap.docs) {
      const data = doc.data();
      recommendations.push({
        type: 'new_topic',
        topicId: data.topicId,
        moduleId: data.moduleId,
        reason: 'Este tema ya está desbloqueado y listo para estudiar.',
        priority: 'medium',
      });
    }

    return recommendations;
  }

  /**
   * Recalculate the user's global progress percentage.
   */
  private async updateGlobalProgress(uid: string) {
    const db = this.firebaseService.firestore;

    const progressSnap = await db
      .collection('user_topic_progress')
      .where('userId', '==', uid)
      .get();

    const total = progressSnap.docs.length;
    const completed = progressSnap.docs.filter(
      (d) => d.data().status === 'completed',
    ).length;

    const globalProgress = total > 0 ? Math.round((completed / total) * 100) : 0;

    await db.collection('users').doc(uid).update({
      'learningProfile.globalProgress': globalProgress,
    });
  }
}
