import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class QuestionsService {
  private readonly logger = new Logger(QuestionsService.name);

  constructor(private readonly firebaseService: FirebaseService) {}

  /**
   * Get questions by topic, optionally filtered by difficulty.
   */
  async getByTopic(topicId: string, difficulty?: number, limit?: number) {
    const db = this.firebaseService.firestore;
    let query: FirebaseFirestore.Query = db
      .collection('questions')
      .where('topicId', '==', topicId)
      .where('isActive', '==', true);

    if (difficulty) {
      query = query.where('difficulty', '==', difficulty);
    }

    if (limit) {
      query = query.limit(limit);
    }

    const snap = await query.get();
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  /**
   * Get questions by IDs (for simulations).
   */
  async getByIds(questionIds: string[]) {
    const db = this.firebaseService.firestore;
    const questions = await Promise.all(
      questionIds.map(async (id) => {
        const doc = await db.collection('questions').doc(id).get();
        return doc.exists ? { id: doc.id, ...doc.data() } : null;
      }),
    );
    return questions.filter(Boolean);
  }

  /**
   * Get questions stripped of correct answers (for student-facing views).
   */
  stripAnswers(questions: any[]) {
    return questions.map(({ correctOption, explanation, ...rest }) => rest);
  }
}
