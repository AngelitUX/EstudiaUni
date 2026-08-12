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

    const userDoc = await db.collection('users').doc(uid).get();
    const isAdminUser = await this.firebaseService.isAdmin(uid);
    const tier = isAdminUser ? 'premium' : (userDoc.data()?.subscription?.tier || userDoc.data()?.plan || 'free');

    let query: FirebaseFirestore.Query = db.collection('simulations');

    const snap = await query.get();
    return snap.docs.map((doc) => {
      const data = doc.data();
      const idLower = (doc.id || '').toLowerCase();
      const nameLower = (data.title || data.nombre || '').toLowerCase();
      const isOfficialRegular2026 = (idLower.includes('2026') || nameLower.includes('2026')) && !idLower.includes('invierno') && !nameLower.includes('invierno');

      return {
        id: doc.id,
        ...data,
        isLockedForFree: tier === 'free' && !isOfficialRegular2026,
        questionIds: undefined,
      };
    });
  }

  /**
   * Start a simulation attempt.
   * Validates credits, 48h cooldown for free tier, and active attempt checks.
   */
  async start(uid: string, simulationId: string) {
    const db = this.firebaseService.firestore;

    const userDoc = await db.collection('users').doc(uid).get();
    const userData = userDoc.data() || {};
    const isAdminUser = await this.firebaseService.isAdmin(uid);
    const tier = isAdminUser ? 'premium' : (userData?.subscription?.tier || userData?.plan || 'free');

    // 1. Validate 48-hour cooldown for Free tier
    if (tier === 'free') {
      const cooldown = await this.subscriptionsService.checkSimulationCooldown(uid);
      if (cooldown.inCooldown) {
        throw new ForbiddenException({
          code: 'COOLDOWN_ACTIVE',
          secondsRemaining: cooldown.secondsRemaining,
          message: `Debes esperar 48 horas entre ensayos en el Plan Básico. Tu próximo ensayo estará disponible en ${Math.ceil(cooldown.secondsRemaining / 3600)} horas.`,
          upgradeUrl: '/pricing',
        });
      }
    }

    // 2. Check general simulation credits
    const creditCheck = await this.subscriptionsService.checkCredits(
      uid,
      'simulation',
    );
    if (!creditCheck.allowed) {
      throw new ForbiddenException({
        code: 'DAILY_LIMIT_REACHED',
        message: 'Límite de ensayo alcanzado. Conviértete en PRO para practicar sin límites.',
        upgradeUrl: '/pricing',
      });
    }

    // 3. Check for active attempts
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
        message: 'Ya tienes un ensayo activo en curso.',
        attemptId: activeSnap.docs[0].id,
      });
    }

    // 4. Get simulation
    const simDoc = await db.collection('simulations').doc(simulationId).get();
    if (!simDoc.exists) throw new NotFoundException('Ensayo no encontrado');

    const simData = simDoc.data()!;
    const idLower = simulationId.toLowerCase();
    const isOfficialRegular2026 = idLower.includes('2026') && !idLower.includes('invierno');

    // Block non-official 2026 simulations for Free tier
    if (tier === 'free' && !isOfficialRegular2026) {
      throw new ForbiddenException({
        code: 'PREMIUM_ONLY_SIMULATION',
        message: 'Este ensayo requiere una suscripción Plan PRO 👑.',
        upgradeUrl: '/pricing',
      });
    }

    // 5. Get questions (without answers)
    const questions = await this.questionsService.getByIds(
      simData.questionIds,
    );

    // 6. Create attempt
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

    // 7. Consume credit
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

    if (!attemptDoc.exists) throw new NotFoundException('Intento no encontrado');

    const attemptData = attemptDoc.data()!;
    if (attemptData.userId !== uid) throw new ForbiddenException('No es tu intento');
    if (attemptData.status !== 'in_progress')
      throw new ConflictException('El ensayo no está en progreso');

    const questionDoc = await db.collection('questions').doc(questionId).get();
    const isCorrect = questionDoc.data()?.correctOption === selectedOption;

    const answers = attemptData.answers || [];
    const existingIdx = answers.findIndex(
      (a: any) => a.questionId === questionId,
    );

    const answerEntry = {
      questionId,
      selectedOption,
      isCorrect,
      timeSpentSeconds: 0,
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
   * Finish a simulation, calculate score and apply 3-hour delay for Free tier.
   */
  async finish(uid: string, attemptId: string) {
    const db = this.firebaseService.firestore;
    const attemptRef = db.collection('attempts').doc(attemptId);
    const attemptDoc = await attemptRef.get();

    if (!attemptDoc.exists) throw new NotFoundException('Intento no encontrado');

    const attemptData = attemptDoc.data()!;
    if (attemptData.userId !== uid) throw new ForbiddenException('No es tu intento');
    if (attemptData.status !== 'in_progress')
      throw new ConflictException('El ensayo ya está finalizado');

    const userDoc = await db.collection('users').doc(uid).get();
    const isAdminUser = await this.firebaseService.isAdmin(uid);
    const tier = isAdminUser ? 'premium' : (userDoc.data()?.subscription?.tier || userDoc.data()?.plan || 'free');

    const simDoc = await db
      .collection('simulations')
      .doc(attemptData.simulationId)
      .get();
    const totalQuestions = simDoc.data()?.totalQuestions || 0;

    const answers = attemptData.answers || [];
    const correct = answers.filter((a: any) => a.isCorrect).length;
    const incorrect = answers.filter(
      (a: any) => !a.isCorrect && a.selectedOption,
    ).length;
    const omitted = totalQuestions - answers.length;

    const percentage =
      totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;

    const estimatedPaesScore = Math.round(100 + (percentage / 100) * 900);

    const score = {
      correct,
      incorrect,
      omitted,
      percentage,
      estimatedPaesScore,
    };

    const finishedAt = new Date();
    // 3 hours delay for Free users (3 * 3600 * 1000 ms)
    const resultsAvailableAt = tier === 'free'
      ? new Date(finishedAt.getTime() + 3 * 3600 * 1000)
      : finishedAt;

    await attemptRef.update({
      status: 'completed',
      finishedAt,
      resultsAvailableAt,
      score,
    });

    // Track last simulation completion for 48h cooldown
    if (tier === 'free') {
      try {
        await db.collection('users').doc(uid).update({
          lastSimulationFinishedAt: finishedAt,
        });
      } catch (e) {}
    }

    const isLocked = tier === 'free' && resultsAvailableAt > new Date();

    return {
      attemptId,
      score: isLocked ? null : score,
      resultsAvailableAt,
      resultsLocked: isLocked,
      secondsUntilAvailable: isLocked ? Math.ceil((resultsAvailableAt.getTime() - Date.now()) / 1000) : 0,
    };
  }

  /**
   * Get attempt detail with answers (enforces 3h delay for Free users).
   */
  async getAttempt(uid: string, attemptId: string) {
    const db = this.firebaseService.firestore;
    const attemptDoc = await db.collection('attempts').doc(attemptId).get();

    if (!attemptDoc.exists) throw new NotFoundException('Intento no encontrado');

    const data = attemptDoc.data()!;
    if (data.userId !== uid) throw new ForbiddenException('No es tu intento');

    const userDoc = await db.collection('users').doc(uid).get();
    const isAdminUser = await this.firebaseService.isAdmin(uid);
    const tier = isAdminUser ? 'premium' : (userDoc.data()?.subscription?.tier || userDoc.data()?.plan || 'free');

    // Check if results are locked (3-hour delay for Free tier)
    if (data.status === 'completed' && tier === 'free' && data.resultsAvailableAt) {
      let resultsAvailableAt: Date;
      if (typeof data.resultsAvailableAt.toDate === 'function') {
        resultsAvailableAt = data.resultsAvailableAt.toDate();
      } else {
        resultsAvailableAt = new Date(data.resultsAvailableAt);
      }

      if (resultsAvailableAt > new Date()) {
        const secondsRemaining = Math.ceil((resultsAvailableAt.getTime() - Date.now()) / 1000);
        return {
          id: attemptDoc.id,
          status: 'completed',
          resultsLocked: true,
          resultsAvailableAt,
          secondsRemaining,
          simulationId: data.simulationId,
          moduleId: data.moduleId,
          startedAt: data.startedAt,
          finishedAt: data.finishedAt,
        };
      }
    }

    if (data.status === 'completed') {
      const questionIds = (data.answers || []).map((a: any) => a.questionId);
      const questions = await this.questionsService.getByIds(questionIds);

      return {
        id: attemptDoc.id,
        ...data,
        resultsLocked: false,
        questionsDetail: questions,
      };
    }

    return { id: attemptDoc.id, ...data };
  }
}
