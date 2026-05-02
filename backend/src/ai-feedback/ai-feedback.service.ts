import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FirebaseService } from '../firebase/firebase.service';
import { QuestionsService } from '../questions/questions.service';
import {
  ANALYSIS_SYSTEM_PROMPT,
  buildAnalysisUserPrompt,
  SYNTHESIS_SYSTEM_PROMPT,
  buildSynthesisPrompt,
} from './prompts/analysis.prompt';
import {
  ASSIST_SYSTEM_PROMPT,
  buildAssistUserPrompt,
} from './prompts/assist.prompt';
import OpenAI from 'openai';
import { ChatRequestDto } from './dto/chat-message.dto';

@Injectable()
export class AiFeedbackService {
  private readonly logger = new Logger(AiFeedbackService.name);
  private openai: OpenAI;

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly questionsService: QuestionsService,
    private readonly configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    } else {
      this.logger.warn('OpenAI API key not configured. AI features disabled.');
    }
  }

  /**
   * Analyze a completed attempt with AI.
   * Retries up to 2 times on failure, falls back to basic analysis.
   */
  async analyzeAttempt(uid: string, attemptId: string) {
    const db = this.firebaseService.firestore;

    // Get attempt
    const attemptDoc = await db.collection('attempts').doc(attemptId).get();
    if (!attemptDoc.exists) throw new NotFoundException('Attempt not found');

    const attemptData = attemptDoc.data()!;
    if (attemptData.userId !== uid) {
      throw new NotFoundException('Attempt not found');
    }

    // Get all questions with full details
    const questionIds = attemptData.answers.map((a: any) => a.questionId);
    const questions = await this.questionsService.getByIds(questionIds);

    // Build data for incorrect questions
    const incorrectQuestions = attemptData.answers
      .filter((a: any) => !a.isCorrect)
      .map((a: any) => {
        const q = questions.find((q: any) => q.id === a.questionId) as any;
        return {
          stem: q?.stem || '',
          selectedOption: a.selectedOption,
          correctOption: q?.correctOption || '',
          explanation: q?.explanation || '',
          topicTitle: q?.topicId || '',
          topicId: q?.topicId || '',
        };
      });

    const score = attemptData.score || { correct: 0, incorrect: 0, percentage: 0 };

    // Try AI analysis with retries
    let aiResult: any = null;
    if (this.openai) {
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          aiResult = await this.callOpenAI(
            ANALYSIS_SYSTEM_PROMPT,
            buildAnalysisUserPrompt({
              correctCount: score.correct,
              totalCount: score.correct + score.incorrect + (score.omitted || 0),
              percentage: score.percentage,
              incorrectQuestions,
            }),
          );
          break;
        } catch (error) {
          this.logger.warn(
            `AI analysis attempt ${attempt + 1} failed: ${error.message}`,
          );
          if (attempt < 2) {
            await new Promise((r) => setTimeout(r, 1000 * (attempt + 1))); // backoff
          }
        }
      }
    }

    // Fallback to basic analysis if AI fails
    if (!aiResult) {
      this.logger.warn('AI analysis failed — using basic fallback');
      aiResult = this.buildBasicAnalysis(score, incorrectQuestions);
    }

    // Save analysis to Firestore
    const analysisRef = db.collection('ai_analyses').doc();
    await analysisRef.set({
      attemptId,
      userId: uid,
      createdAt: new Date(),
      ...aiResult,
    });

    // Update attempt with analysis ID
    await db.collection('attempts').doc(attemptId).update({
      aiAnalysisId: analysisRef.id,
    });

    // Update user learning profile weaknesses
    if (aiResult.detectedGaps?.length > 0) {
      const weakTopicIds = aiResult.detectedGaps
        .filter((g: any) => g.severity !== 'low')
        .map((g: any) => g.topicId);

      if (weakTopicIds.length > 0) {
        const userRef = db.collection('users').doc(uid);
        const userDoc = await userRef.get();
        const currentWeaknesses =
          userDoc.data()?.learningProfile?.weaknesses || [];
        const merged = [...new Set([...currentWeaknesses, ...weakTopicIds])];
        await userRef.update({ 'learningProfile.weaknesses': merged });
      }
    }

    return { analysisId: analysisRef.id, aiAnalysis: aiResult };
  }

  /**
   * Synthesize topic content using AI.
   */
  async synthesizeTopic(
    topicId: string,
    complexity: 'simple' | 'detailed',
  ) {
    const db = this.firebaseService.firestore;

    // Find the topic across all modules
    const modulesSnap = await db.collection('modules').get();
    let topicData: any = null;

    for (const moduleDoc of modulesSnap.docs) {
      const topicDoc = await db
        .collection('modules')
        .doc(moduleDoc.id)
        .collection('topics')
        .doc(topicId)
        .get();

      if (topicDoc.exists) {
        topicData = topicDoc.data();
        break;
      }
    }

    if (!topicData) throw new NotFoundException('Topic not found');

    if (!this.openai) {
      return { markdown: topicData.content?.keyConceptsMarkdown || topicData.content?.summary || '' };
    }

    try {
      const result = await this.callOpenAIText(
        SYNTHESIS_SYSTEM_PROMPT,
        buildSynthesisPrompt(
          topicData.title,
          topicData.content?.keyConceptsMarkdown || topicData.content?.summary || '',
          complexity,
        ),
      );
      return { markdown: result };
    } catch (error) {
      this.logger.error(`Synthesis failed: ${error.message}`);
      // Fallback to original content
      return { markdown: topicData.content?.keyConceptsMarkdown || topicData.content?.summary || '' };
    }
  }

  /**
   * Provide assisted hint for an in-progress question.
   */
  async assistQuestion(input: {
    question: string;
    options: Array<{ id: string; text: string }>;
    userAnswer?: string | null;
    subject?: string;
  }) {
    if (!this.openai) {
      return {
        reply:
          'La asistencia IA no está disponible en este momento. Intenta razonar la pregunta paso a paso y descarta opciones.',
      };
    }

    try {
      const reply = await this.callOpenAIText(
        ASSIST_SYSTEM_PROMPT,
        buildAssistUserPrompt(input),
      );
      return { reply };
    } catch (error) {
      this.logger.error(`Assist failed: ${error.message}`);
      throw new InternalServerErrorException('AI assist failed');
    }
  }

  /**
   * Multi-turn chat with context (question + history).
   * Accepts full conversation history and returns AI reply.
   */
  async chatWithContext(input: ChatRequestDto): Promise<{ reply: string }> {
    if (!this.openai) {
      return {
        reply:
          '⚠️ La asistencia IA no está disponible en este momento. Intenta razonar la pregunta paso a paso y descarta las opciones que claramente son incorrectas.',
      };
    }

    const optionsText = input.options
      .map((opt) => `${opt.id}. ${opt.text}`)
      .join('\n');

    const systemPrompt = `${ASSIST_SYSTEM_PROMPT}

Contexto de la pregunta actual:
Materia: ${input.subject || 'PAES'}
Pregunta: ${input.question}
Opciones:
${optionsText}
Respuesta actual del estudiante: ${input.userAnswer || 'Sin responder'}

IMPORTANTE: Mantén el hilo de la conversación con el estudiante. Nunca reveles la alternativa correcta.`;

    // Build messages array from history
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...input.history.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    ];

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages,
        max_tokens: 500,
        temperature: 0.7,
      });

      const reply = response.choices[0]?.message?.content || 'No pude generar una respuesta. Intenta de nuevo.';
      return { reply };
    } catch (error) {
      this.logger.error(`Chat failed: ${error.message}`);
      throw new InternalServerErrorException('AI chat failed');
    }
  }

  /**
   * Retrieve an existing analysis.
   */
  async getAnalysis(uid: string, analysisId: string) {
    const doc = await this.firebaseService.firestore
      .collection('ai_analyses')
      .doc(analysisId)
      .get();

    if (!doc.exists) throw new NotFoundException('Analysis not found');

    const data = doc.data()!;
    if (data.userId !== uid) throw new NotFoundException('Analysis not found');

    return { id: doc.id, ...data };
  }

  /**
   * Call OpenAI API expecting JSON response.
   */
  private async callOpenAI(systemPrompt: string, userPrompt: string) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 4000,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('Empty AI response');

    return JSON.parse(content);
  }

  /**
   * Call OpenAI API expecting text response.
   */
  private async callOpenAIText(systemPrompt: string, userPrompt: string) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 3000,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || '';
  }

  /**
   * Basic fallback analysis when AI is unavailable.
   */
  private buildBasicAnalysis(
    score: any,
    incorrectQuestions: any[],
  ) {
    return {
      overallFeedback: `Obtuviste ${score.correct} de ${score.correct + score.incorrect} respuestas correctas (${score.percentage}%). ${score.percentage >= 60 ? 'Buen trabajo, sigue así.' : 'Te recomendamos repasar los temas donde fallaste.'}`,
      detectedGaps: incorrectQuestions.map((q: any) => ({
        topicId: q.topicId,
        topicTitle: q.topicTitle,
        gapDescription: `Error en pregunta relacionada con ${q.topicTitle}`,
        severity: 'medium' as const,
        recommendedModuleId: '',
        recommendedTopicId: q.topicId,
      })),
      questionAnalyses: incorrectQuestions.map((q: any) => ({
        questionStem: q.stem.substring(0, 80),
        wasCorrect: false,
        explanation: q.explanation,
        mistakeReason: 'Análisis detallado no disponible temporalmente.',
        conceptualGap: `Revisar tema: ${q.topicTitle}`,
      })),
      studyPlan: {
        priorityTopics: [...new Set(incorrectQuestions.map((q: any) => q.topicId))],
        suggestedNextAction: 'Repasa los temas donde tuviste errores antes de tomar otro ensayo.',
      },
    };
  }
}
