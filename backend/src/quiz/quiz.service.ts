import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { QuestionsService } from '../questions/questions.service';

@Injectable()
export class QuizService {
  private readonly logger = new Logger(QuizService.name);

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly questionsService: QuestionsService,
  ) {}

  /**
   * Generate an adaptive quiz for a topic based on user's mastery level.
   */
  async generate(uid: string, topicId: string, questionCount: number) {
    const db = this.firebaseService.firestore;

    // Check credits
    const creditCheck = await this.subscriptionsService.checkCredits(uid, 'quiz');
    if (!creditCheck.allowed) {
      throw new ForbiddenException({
        code: 'DAILY_LIMIT_REACHED',
        message: 'Daily quiz limit reached. Upgrade to premium for unlimited quizzes.',
      });
    }

    // Determine difficulty based on mastery
    const progressId = `${uid}_${topicId}`;
    const progressDoc = await db
      .collection('user_topic_progress')
      .doc(progressId)
      .get();

    const masteryLevel = progressDoc.exists
      ? progressDoc.data()?.masteryLevel || 0
      : 0;

    let difficulty: number;
    if (masteryLevel < 40) difficulty = 1;
    else if (masteryLevel < 70) difficulty = 2;
    else difficulty = 3;

    // Get questions pool
    let questions = await this.questionsService.getByTopic(
      topicId,
      difficulty,
    );

    // If not enough questions at target difficulty, include adjacent levels
    if (questions.length < questionCount) {
      const allQuestions = await this.questionsService.getByTopic(topicId);
      questions = allQuestions;
    }

    // Shuffle and pick
    const shuffled = questions.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, questionCount);

    // Find moduleId from the first question
    const moduleId = (selected[0] as any)?.moduleId || '';

    // Create attempt
    const attemptRef = db.collection('attempts').doc();
    await attemptRef.set({
      userId: uid,
      simulationId: null,
      type: 'quiz',
      moduleId,
      topicId,
      startedAt: new Date(),
      finishedAt: null,
      status: 'in_progress',
      answers: [],
      score: null,
      aiAnalysisId: null,
    });

    // Consume credit
    await this.subscriptionsService.consumeCredit(uid, 'quiz');

    return {
      attemptId: attemptRef.id,
      questions: this.questionsService.stripAnswers(selected),
      difficulty,
    };
  }

  /**
   * Submit quiz answers and calculate score. Updates mastery level.
   */
  async submit(
    uid: string,
    attemptId: string,
    answers: Array<{ questionId: string; selectedOption: string }>,
  ) {
    const db = this.firebaseService.firestore;
    const attemptRef = db.collection('attempts').doc(attemptId);
    const attemptDoc = await attemptRef.get();

    if (!attemptDoc.exists) throw new NotFoundException('Attempt not found');

    const attemptData = attemptDoc.data()!;
    if (attemptData.userId !== uid)
      throw new ForbiddenException('Not your attempt');

    // Grade answers
    const gradedAnswers = await Promise.all(
      answers.map(async (ans) => {
        const qDoc = await db.collection('questions').doc(ans.questionId).get();
        const isCorrect = qDoc.data()?.correctOption === ans.selectedOption;
        return {
          questionId: ans.questionId,
          selectedOption: ans.selectedOption,
          isCorrect,
          timeSpentSeconds: 0,
        };
      }),
    );

    const correct = gradedAnswers.filter((a) => a.isCorrect).length;
    const total = gradedAnswers.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    const score = {
      correct,
      incorrect: total - correct,
      omitted: 0,
      percentage,
      estimatedPaesScore: null,
    };

    // Update attempt
    await attemptRef.update({
      answers: gradedAnswers,
      score,
      status: 'completed',
      finishedAt: new Date(),
    });

    // Update mastery level
    const topicId = attemptData.topicId;
    if (topicId) {
      const progressId = `${uid}_${topicId}`;
      const progressRef = db.collection('user_topic_progress').doc(progressId);
      const progressDoc = await progressRef.get();

      const currentMastery = progressDoc.exists
        ? progressDoc.data()?.masteryLevel || 0
        : 0;
      const quizzesTaken = progressDoc.exists
        ? (progressDoc.data()?.quizzesTaken || 0) + 1
        : 1;

      // Weighted average: 70% current mastery + 30% new quiz score
      const newMastery = Math.round(currentMastery * 0.7 + percentage * 0.3);
      const bestScore = Math.max(
        progressDoc.exists ? progressDoc.data()?.bestQuizScore || 0 : 0,
        percentage,
      );

      await progressRef.set(
        {
          userId: uid,
          moduleId: attemptData.moduleId,
          topicId,
          status: newMastery >= 60 ? 'completed' : 'in_progress',
          quizzesTaken,
          bestQuizScore: bestScore,
          lastAccessedAt: new Date(),
          masteryLevel: newMastery,
        },
        { merge: true },
      );
    }

    return {
      score,
      feedback:
        percentage >= 80
          ? '¡Excelente! Dominas bien este tema.'
          : percentage >= 60
            ? 'Buen progreso. Sigue practicando para dominar los conceptos.'
            : 'Necesitas repasar este tema. Revisa el contenido antes de intentar de nuevo.',
    };
  }
}
