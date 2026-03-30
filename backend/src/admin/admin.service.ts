import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private readonly firebaseService: FirebaseService) {}

  /**
   * Create or update a module.
   */
  async upsertModule(moduleId: string | null, data: any) {
    const db = this.firebaseService.firestore;
    const ref = moduleId
      ? db.collection('modules').doc(moduleId)
      : db.collection('modules').doc();

    await ref.set(data, { merge: true });
    return { id: ref.id, ...data };
  }

  /**
   * Create or update a topic within a module.
   */
  async upsertTopic(moduleId: string, topicId: string | null, data: any) {
    const db = this.firebaseService.firestore;
    const ref = topicId
      ? db.collection('modules').doc(moduleId).collection('topics').doc(topicId)
      : db.collection('modules').doc(moduleId).collection('topics').doc();

    await ref.set(data, { merge: true });
    return { id: ref.id, ...data };
  }

  /**
   * Create or update a question.
   */
  async upsertQuestion(questionId: string | null, data: any) {
    const db = this.firebaseService.firestore;
    const ref = questionId
      ? db.collection('questions').doc(questionId)
      : db.collection('questions').doc();

    await ref.set({ ...data, isActive: true }, { merge: true });
    return { id: ref.id, ...data };
  }

  /**
   * Create a simulation.
   */
  async createSimulation(data: any) {
    const db = this.firebaseService.firestore;
    const ref = db.collection('simulations').doc();
    await ref.set({ ...data, createdAt: new Date() });
    return { id: ref.id, ...data };
  }

  /**
   * Get platform stats.
   */
  async getStats() {
    const db = this.firebaseService.firestore;

    const [users, questions, attempts, modules] = await Promise.all([
      db.collection('users').count().get(),
      db.collection('questions').count().get(),
      db.collection('attempts').count().get(),
      db.collection('modules').count().get(),
    ]);

    return {
      totalUsers: users.data().count,
      totalQuestions: questions.data().count,
      totalAttempts: attempts.data().count,
      totalModules: modules.data().count,
    };
  }
}
