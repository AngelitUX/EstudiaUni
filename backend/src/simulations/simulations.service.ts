import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { QuestionsService } from '../questions/questions.service';

@Injectable()
export class SimulationsService {
  private readonly logger = new Logger(SimulationsService.name);

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly questionsService: QuestionsService,
  ) {}

  /**
   * List available simulations.
   */
  async list(uid: string) {
    const db = this.firebaseService.firestore;

    // Get user tier to filter premium-only
    const userDoc = await db.collection('users').doc(uid).get();
    const tier = userDoc.data()?.subscription?.tier || 'free';

    let query: FirebaseFirestore.Query = db.collection('simulations');

    if (tier !== 'premium') {
      query = query.where('isPremiumOnly', '==', false);
    }

    const snap = await query.get();
    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      questionIds: undefined, // Don't expose question IDs in listing
    }));
  }

  /**
   * Start a simulation attempt.
   * Validates credits and checks for active attempts.
   */
  async start(uid: string, simulationId: string) {
    const db = this.firebaseService.firestore;

    // 1. Check credits
    const creditCheck = await this.subscriptionsService.checkCredits(
      uid,
      'simulation',
    );
    if (!creditCheck.allowed) {
      throw new ForbiddenException({
        code: 'DAILY_LIMIT_REACHED',
        message:
          'You have reached your daily simulation limit. Upgrade to premium for unlimited access.',
        upgradeUrl: '/premium',
      });
    }

    // 2. Check for active attempts
    const activeSnap = await db
      .collection('attempts')
      .where('userId', '==', uid)
      .where('type', '==', 'simulation')
      .where('status', '==', 'in_progress')
      .limit(1)
      .get();

    if (!activeSnap.empty) {
      throw new ConflictException({
        code: 'ACTIVE_ATTEMPT_EXISTS',
        message: 'You already have an active simulation. Finish or abandon it first.',
        attemptId: activeSnap.docs[0].id,
      });
    }

    // 3. Get simulation
    const simDoc = await db.collection('simulations').doc(simulationId).get();
    if (!simDoc.exists) throw new NotFoundException('Simulation not found');

    const simData = simDoc.data()!;

    // 4. Get questions (without answers)
    const questions = await this.questionsService.getByIds(
      simData.questionIds,
    );

    // 5. Create attempt
    const attemptRef = db.collection('attempts').doc();
    await attemptRef.set({
      userId: uid,
      simulationId,
      type: 'simulation',
      moduleId: simData.subject,
      topicId: null,
      startedAt: new Date(),
      finishedAt: null,
      status: 'in_progress',
      answers: [],
      score: null,
      aiAnalysisId: null,
    });

    // 6. Consume credit
    await this.subscriptionsService.consumeCredit(uid, 'simulation');

    return {
      attemptId: attemptRef.id,
      questions: this.questionsService.stripAnswers(questions),
      timeLimit: simData.timeLimitMinutes,
      totalQuestions: simData.totalQuestions,
    };
  }

  /**
   * Submit a single answer during a simulation.
   */
  async submitAnswer(
    uid: string,
    attemptId: string,
    questionId: string,
    selectedOption: string,
  ) {
    const db = this.firebaseService.firestore;
    const attemptRef = db.collection('attempts').doc(attemptId);
    const attemptDoc = await attemptRef.get();

    if (!attemptDoc.exists) throw new NotFoundException('Attempt not found');

    const attemptData = attemptDoc.data()!;
    if (attemptData.userId !== uid) throw new ForbiddenException('Not your attempt');
    if (attemptData.status !== 'in_progress')
      throw new ConflictException('Attempt is not in progress');

    // Get correct answer
    const questionDoc = await db.collection('questions').doc(questionId).get();
    const isCorrect = questionDoc.data()?.correctOption === selectedOption;

    // Update answers array
    const answers = attemptData.answers || [];
    const existingIdx = answers.findIndex(
      (a: any) => a.questionId === questionId,
    );

    const answerEntry = {
      questionId,
      selectedOption,
      isCorrect,
      timeSpentSeconds: 0, // Frontend can track this
    };

    if (existingIdx >= 0) {
      answers[existingIdx] = answerEntry;
    } else {
      answers.push(answerEntry);
    }

    await attemptRef.update({ answers });

    return { saved: true };
  }

  /**
   * Finish a simulation, calculate score.
   */
  async finish(uid: string, attemptId: string) {
    const db = this.firebaseService.firestore;
    const attemptRef = db.collection('attempts').doc(attemptId);
    const attemptDoc = await attemptRef.get();

    if (!attemptDoc.exists) throw new NotFoundException('Attempt not found');

    const attemptData = attemptDoc.data()!;
    if (attemptData.userId !== uid) throw new ForbiddenException('Not your attempt');
    if (attemptData.status !== 'in_progress')
      throw new ConflictException('Attempt already finished');

    // Get simulation to know total questions
    const simDoc = await db
      .collection('simulations')
      .doc(attemptData.simulationId)
      .get();
    const totalQuestions = simDoc.data()?.totalQuestions || 0;

    // Calculate score
    const answers = attemptData.answers || [];
    const correct = answers.filter((a: any) => a.isCorrect).length;
    const incorrect = answers.filter(
      (a: any) => !a.isCorrect && a.selectedOption,
    ).length;
    const omitted = totalQuestions - answers.length;

    const percentage =
      totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;

    // Estimate PAES score (simplified linear mapping: 100-1000)
    const estimatedPaesScore = Math.round(100 + (percentage / 100) * 900);

    const score = {
      correct,
      incorrect,
      omitted,
      percentage,
      estimatedPaesScore,
    };

    await attemptRef.update({
      status: 'completed',
      finishedAt: new Date(),
      score,
    });

    return { score, attemptId };
  }

  /**
   * Get attempt detail with answers.
   */
  async getAttempt(uid: string, attemptId: string) {
    const db = this.firebaseService.firestore;
    const attemptDoc = await db.collection('attempts').doc(attemptId).get();

    if (!attemptDoc.exists) throw new NotFoundException('Attempt not found');

    const data = attemptDoc.data()!;
    if (data.userId !== uid) throw new ForbiddenException('Not your attempt');

    // If completed, include correct answers and explanations
    if (data.status === 'completed') {
      const questionIds = data.answers.map((a: any) => a.questionId);
      const questions = await this.questionsService.getByIds(questionIds);

      return {
        id: attemptDoc.id,
        ...data,
        questionsDetail: questions,
      };
    }

    return { id: attemptDoc.id, ...data };
  }
}
