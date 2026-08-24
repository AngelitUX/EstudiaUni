import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
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
  CAREER_CHAT_SYSTEM_PROMPT,
} from './prompts/assist.prompt';
import { ChatRequestDto } from './dto/chat-message.dto';
import { CareerChatRequestDto } from './dto/career-chat.dto';
import { StudyCoachRequestDto } from './dto/study-coach.dto';
import {
  STUDY_COACH_SYSTEM_PROMPT,
  buildStudyCoachContext,
} from './prompts/study-coach.prompt';
import { ReviewChatRequestDto } from './dto/review-chat.dto';
import { RecommendationsRequestDto } from './dto/recommendations.dto';

const GEMINI_MODEL = 'gemini-2.5-flash';

const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

// Many exam questions come from scanned official PAES tests: their `text`/
// `options` fields are placeholder strings like "Pregunta 5 (Ver imagen)" —
// the real content only exists in the attached image(s). Without this note,
// the model tends to answer generically off the placeholder text instead of
// actually reading the image, which is exactly the "doesn't seem to read the
// question" symptom this is fixing.
const VISION_NOTE = `INSTRUCCIÓN VISION: Se te adjuntaron una o más imágenes junto con este mensaje — son la captura oficial de la pregunta (y, si corresponde, del texto de lectura que la acompaña). Léelas con atención: ahí está el enunciado real, las alternativas completas y cualquier gráfico, tabla o dato numérico. Si el texto de "Pregunta" u "Opciones" de arriba es genérico o dice algo como "(Ver imagen)", IGNÓRALO por completo y basa tu respuesta únicamente en lo que ves en las imágenes.`;

// Used only for POST-exam review (the "Preguntarle a Foco" button on a wrong
// answer in ensayo-review). Unlike ASSIST_SYSTEM_PROMPT/chatWithContext —
// which explicitly forbids revealing the correct answer because the student
// is still mid-exam — here the attempt is already submitted and graded, so
// withholding the answer would just be unhelpful. This prompt is intentionally
// a separate, self-contained system instruction (not ASSIST_SYSTEM_PROMPT +
// an appended override) so the model never sees the contradictory "never
// reveal it" rule in the first place.
const REVIEW_CHAT_SYSTEM_PROMPT = `Eres Foco, la mascota oficial y tutor de EstudiaUni.cl. Eres un pulpo súper inteligente, entusiasta y amigable de 8 tentáculos (cada uno experto en una de las 8 materias de la PAES de Chile).

CONTEXTO: El estudiante YA TERMINÓ Y ENTREGÓ su ensayo — no está rindiendo la prueba ahora, está revisando sus resultados para aprender de un error. Por eso, a diferencia de cuando asistes durante un ensayo en curso, AQUÍ SÍ debes ser completamente transparente: dile abiertamente cuál era la alternativa correcta, explica el proceso completo paso a paso para llegar a ella, y luego analiza específicamente la alternativa que el estudiante marcó — explícale con calidez y sin juzgar qué error de razonamiento, cálculo o interpretación probablemente lo llevó a esa opción, para que no lo repita.

PERSONALIDAD Y TONO DE FOCO:
- ¡Eres un pulpo! Usa metáforas marinas u oceanográficas de forma sutil, dinámica y divertida (ej. "desenredar con mis tentáculos", "chocamos esos ocho"), pero NUNCA las uses en saludos repetitivos.
- Sé sumamente empático, motivador y usa un español chileno sutil y cercano, perfecto para estudiantes de enseñanza media.
- Tu personalidad es vibrante, alegre y con emojis marinos y de luz (🐙, 💡, 🌊, 🧠, ✨), sin abusar de ellos.

REGLAS (ESTRICTAS):
- SIN INTRODUCCIONES REPETITIVAS: ve directo al análisis, sin saludos largos ni rodeos.
- Estructura clara: (1) cuál era la alternativa correcta y por qué, con el proceso paso a paso; (2) por qué la alternativa que el estudiante marcó es tentadora pero incorrecta — el error específico que la explica.
- Sé conciso pero completo: 3-5 párrafos cortos está bien aquí (es más denso que una pista en pleno ensayo), pero SIEMPRE termina tus ideas completas, nunca a medias.
- Si el estudiante hace una pregunta de seguimiento, respóndela directamente y con el mismo nivel de transparencia.
- TRATAMIENTO DE DECIMALES: al explicar ejercicios con decimales largos, abrevia (ej. "4,56...") en vez de escribir la secuencia completa.

FORMATO MATEMÁTICO: usa LaTeX ('$$...$$' o '$...$') o Unicode legible (x², x_n) para fórmulas y ecuaciones; traduce cualquier notación de código a notación matemática tradicional.`;

const RECOMMENDATIONS_SYSTEM_PROMPT = `Eres Foco, el tutor IA de EstudiaUni.cl, una plataforma de preparación para la PAES (admisión universitaria en Chile).
Tu tarea es dar una recomendación de estudio breve, cálida y accionable, basada en la actividad reciente del estudiante.
Reglas:
- Máximo 120 palabras.
- Identifica 1-2 patrones concretos (materias con bajo rendimiento, poca práctica reciente, buen progreso a mantener).
- Termina con UNA acción concreta y específica que el estudiante pueda hacer hoy.
- Tono motivador, cercano, en español chileno neutro. Nunca uses relleno genérico tipo "sigue así" sin contexto.
- No inventes datos que no estén en la actividad entregada.`;

function buildRecommendationsUserPrompt(activities: RecommendationsRequestDto['activities']): string {
  if (!activities || activities.length === 0) {
    return 'El estudiante aún no tiene actividad registrada. Dale una recomendación general para comenzar a prepararse para la PAES.';
  }
  const lines = activities.slice(0, 15).map((a) => {
    const scoreText = a.totalQuestions
      ? `${a.totalCorrect ?? 0}/${a.totalQuestions} correctas`
      : a.score !== undefined
        ? `puntaje ${a.score}`
        : 'sin puntaje';
    return `- [${a.timestamp}] ${a.type} · ${a.title}${a.subject ? ` (${a.subject})` : ''} · ${scoreText}`;
  });
  return `Actividad reciente del estudiante (más nueva primero):\n${lines.join('\n')}\n\nGenera la recomendación siguiendo las reglas del sistema.`;
}

@Injectable()
export class AiFeedbackService {
  private readonly logger = new Logger(AiFeedbackService.name);
  private genAI: GoogleGenerativeAI | null = null;

  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly questionsService: QuestionsService,
    private readonly configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    } else {
      this.logger.warn('Gemini API key not configured. AI features disabled.');
    }
  }

  private getModel(systemInstruction: string, opts?: { json?: boolean; maxOutputTokens?: number; disableThinking?: boolean }) {
    return this.genAI!.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction,
      safetySettings: SAFETY_SETTINGS,
      generationConfig: {
        maxOutputTokens: opts?.maxOutputTokens ?? 3000,
        temperature: 0.7,
        // gemini-2.5-flash spends part of maxOutputTokens on an internal
        // "thinking" pass before the visible reply — with a low token cap
        // (chat replies used to cap at 500, copied over from the old OpenAI
        // config) that ate almost the entire budget, so replies got cut off
        // mid-sentence a few words in. Disabling it for chat keeps the full
        // budget for the actual visible answer.
        ...(opts?.disableThinking ? { thinkingConfig: { thinkingBudget: 0 } } : {}),
        ...(opts?.json ? { responseMimeType: 'application/json' } : {}),
      },
    });
  }

  /** Fetches an image URL and returns it as inline base64 data for Gemini vision input. */
  private async urlToInlineData(url: string): Promise<{ mimeType: string; data: string } | null> {
    try {
      const response = await fetch(url);
      if (!response.ok) return null;
      const arrayBuffer = await response.arrayBuffer();
      return {
        mimeType: response.headers.get('content-type') || 'image/png',
        data: Buffer.from(arrayBuffer).toString('base64'),
      };
    } catch (error) {
      this.logger.warn(`Could not fetch image for vision input: ${error.message}`);
      return null;
    }
  }

  /**
   * Maps our {role, content}[] history to Gemini's {role: 'user'|'model', parts}[]
   * shape, dropping the last turn (the caller sends that as the actual message)
   * and any leading assistant turns — Gemini chat history must start with 'user'.
   */
  private toGeminiHistory(history: Array<{ role: string; content: string }>) {
    const mapped = history.slice(0, -1).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
    while (mapped.length > 0 && mapped[0].role === 'model') {
      mapped.shift();
    }
    return mapped;
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
    if (this.genAI) {
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          aiResult = await this.callGeminiJson(
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

    if (!this.genAI) {
      return { markdown: topicData.content?.keyConceptsMarkdown || topicData.content?.summary || '' };
    }

    try {
      const result = await this.callGeminiText(
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
    imageUrl?: string;
  }) {
    if (!this.genAI) {
      return {
        reply:
          'La asistencia IA no está disponible en este momento. Intenta razonar la pregunta paso a paso y descarta opciones.',
      };
    }

    try {
      const hasImage = !!input.imageUrl && input.imageUrl.startsWith('http');
      const promptText = buildAssistUserPrompt(input) + (hasImage ? `\n\n${VISION_NOTE}` : '');
      const parts: any[] = [{ text: promptText }];

      if (hasImage) {
        const inline = await this.urlToInlineData(input.imageUrl!);
        if (inline) parts.push({ inlineData: inline });
      }

      const model = this.getModel(ASSIST_SYSTEM_PROMPT, { maxOutputTokens: 3000, disableThinking: true });
      const result = await model.generateContent(parts);
      return { reply: result.response.text() || '' };
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
    if (!this.genAI) {
      return {
        reply:
          '⚠️ La asistencia IA no está disponible en este momento. Intenta razonar la pregunta paso a paso y descarta las opciones que claramente son incorrectas.',
      };
    }

    const optionsText = input.options
      .map((opt) => `${opt.id}. ${opt.text}`)
      .join('\n');

    const hasImages = (!!input.imageUrl && input.imageUrl.startsWith('http')) || !!input.readingImages?.length;

    const systemPrompt = `${ASSIST_SYSTEM_PROMPT}

Contexto de la pregunta actual:
Materia: ${input.subject || 'PAES'}
Pregunta: ${input.question}
Opciones:
${optionsText}
Respuesta actual del estudiante: ${input.userAnswer || 'Sin responder'}

IMPORTANTE: Mantén el hilo de la conversación con el estudiante. Nunca reveles la alternativa correcta.${hasImages ? `\n\n${VISION_NOTE}` : ''}`;

    try {
      const model = this.getModel(systemPrompt, { maxOutputTokens: 1024, disableThinking: true });
      const chat = model.startChat({ history: this.toGeminiHistory(input.history) });

      const lastMsg = input.history[input.history.length - 1];
      const userText = lastMsg?.role === 'user' ? lastMsg.content : 'Necesito una pista.';
      const parts: any[] = [{ text: userText }];

      if (input.imageUrl && input.imageUrl.startsWith('http')) {
        const inline = await this.urlToInlineData(input.imageUrl);
        if (inline) parts.push({ inlineData: inline });
      }

      // Reading-comprehension questions (Lenguaje) need the passage itself,
      // not just the question's own image, to answer meaningfully.
      if (input.readingImages?.length) {
        for (const url of input.readingImages) {
          if (!url.startsWith('http')) continue;
          const inline = await this.urlToInlineData(url);
          if (inline) parts.push({ inlineData: inline });
        }
      }

      const result = await chat.sendMessage(parts);
      const reply = result.response.text() || 'No pude generar una respuesta. Intenta de nuevo.';
      return { reply };
    } catch (error) {
      this.logger.error(`Chat failed: ${error.message}`);
      throw new InternalServerErrorException('AI chat failed');
    }
  }

  /**
   * Post-exam review chat (PRO only, "Preguntarle a Foco" on a wrong answer).
   * Unlike chatWithContext, this is allowed — and expected — to state the
   * correct answer and explain the student's specific mistake, since the
   * attempt is already submitted and graded.
   */
  async reviewChat(input: ReviewChatRequestDto): Promise<{ reply: string }> {
    if (!this.genAI) {
      return {
        reply: '⚠️ La asistencia IA no está disponible en este momento.',
      };
    }

    const optionsText = input.options
      .map((opt) => `${opt.id}. ${opt.text}`)
      .join('\n');

    const hasImages = (!!input.imageUrl && input.imageUrl.startsWith('http')) || !!input.readingImages?.length;

    const systemPrompt = `${REVIEW_CHAT_SYSTEM_PROMPT}

Contexto de la pregunta ya corregida:
Materia: ${input.subject || 'PAES'}
Pregunta: ${input.question}
Opciones:
${optionsText}
Alternativa correcta: ${input.correctAnswer}
Alternativa marcada por el estudiante: ${input.userAnswer || 'No respondió (omitida)'}${hasImages ? `\n\n${VISION_NOTE}` : ''}`;

    try {
      const model = this.getModel(systemPrompt, { maxOutputTokens: 1536, disableThinking: true });
      const chat = model.startChat({ history: this.toGeminiHistory(input.history) });

      const lastMsg = input.history[input.history.length - 1];
      const userText = lastMsg?.role === 'user' ? lastMsg.content : '¿Cuál era el proceso para resolver esta pregunta y en qué pude haberme equivocado?';
      const parts: any[] = [{ text: userText }];

      if (input.imageUrl && input.imageUrl.startsWith('http')) {
        const inline = await this.urlToInlineData(input.imageUrl);
        if (inline) parts.push({ inlineData: inline });
      }

      if (input.readingImages?.length) {
        for (const url of input.readingImages) {
          if (!url.startsWith('http')) continue;
          const inline = await this.urlToInlineData(url);
          if (inline) parts.push({ inlineData: inline });
        }
      }

      const result = await chat.sendMessage(parts);
      const reply = result.response.text() || 'No pude generar una respuesta. Intenta de nuevo.';
      return { reply };
    } catch (error) {
      this.logger.error(`Review chat failed: ${error.message}`);
      throw new InternalServerErrorException('AI review chat failed');
    }
  }

  /**
   * Freeform vocational-guidance chat (career-finder assistant). Unlike
   * chatWithContext, there's no single exam question/options to anchor
   * on — it's an open conversation about careers, so it just replays the
   * client's message history against the vocational system prompt.
   */
  async careerChat(input: CareerChatRequestDto): Promise<{ reply: string }> {
    if (!this.genAI) {
      return {
        reply: '⚠️ El orientador vocacional IA no está disponible en este momento. Intenta de nuevo más tarde.',
      };
    }

    try {
      const model = this.getModel(CAREER_CHAT_SYSTEM_PROMPT, { maxOutputTokens: 1024, disableThinking: true });
      const chat = model.startChat({ history: this.toGeminiHistory(input.history) });

      const lastMsg = input.history[input.history.length - 1];
      const userText = lastMsg?.role === 'user' ? lastMsg.content : 'Hola';

      const result = await chat.sendMessage(userText);
      const reply = result.response.text() || 'No pude generar una respuesta. Intenta de nuevo.';
      return { reply };
    } catch (error) {
      this.logger.error(`Career chat failed: ${error.message}`);
      throw new InternalServerErrorException('AI career chat failed');
    }
  }

  /**
   * Entrenador de estudio del dashboard: Foco analiza el historial real del
   * alumno y le arma un plan, o —si todavía no hay historial— lo entrevista
   * para construirle una rutina.
   *
   * La ficha del alumno se inyecta como PRIMER mensaje de usuario, no en el
   * system prompt, para que el modelo la trate como datos del caso y no como
   * instrucciones (y para poder refrescarla en cada turno sin reconstruir el
   * system prompt).
   */
  async studyCoachChat(input: StudyCoachRequestDto): Promise<{ reply: string }> {
    if (!this.genAI) {
      return {
        reply: '⚠️ Foco no está disponible en este momento. Intenta de nuevo más tarde.',
      };
    }

    try {
      const model = this.getModel(STUDY_COACH_SYSTEM_PROMPT, {
        maxOutputTokens: 1600,
        disableThinking: true,
      });

      const ficha = buildStudyCoachContext(input.context || {});
      const historial = this.toGeminiHistory(input.history || []);

      // El último mensaje del usuario se envía aparte; el resto es historial.
      const ultimo = (input.history || [])[input.history.length - 1];
      const esDelUsuario = ultimo?.role === 'user';
      const historialPrevio = esDelUsuario ? historial.slice(0, -1) : historial;

      const chat = model.startChat({
        history: [
          { role: 'user', parts: [{ text: ficha }] },
          {
            role: 'model',
            parts: [{ text: 'Ficha recibida. Voy a usar solo estos datos, sin inventar nada.' }],
          },
          ...historialPrevio,
        ],
      });

      const texto = esDelUsuario
        ? ultimo.content
        : 'Preséntate y dame tus recomendaciones según mi ficha.';

      const result = await chat.sendMessage(texto);
      const reply = result.response.text() || 'No pude generar una respuesta. Intenta de nuevo.';
      return { reply };
    } catch (error) {
      this.logger.error(`Study coach chat failed: ${error.message}`);
      throw new InternalServerErrorException('AI study coach failed');
    }
  }

  /**
   * Generate a short, personalized study recommendation from the user's recent activity.
   * PRO-only, button-triggered feature — consumes 1 Foco token per call (enforced by controller).
   */
  async generateRecommendations(input: RecommendationsRequestDto): Promise<{ recommendation: string }> {
    if (!this.genAI) {
      return {
        recommendation: 'La IA no está disponible en este momento. Revisa tu historial de actividad y prioriza los temas donde tuviste más errores recientes.',
      };
    }

    try {
      const recommendation = await this.callGeminiText(
        RECOMMENDATIONS_SYSTEM_PROMPT,
        buildRecommendationsUserPrompt(input.activities),
      );
      return { recommendation: recommendation || 'No pude generar una recomendación esta vez. Intenta de nuevo más tarde.' };
    } catch (error) {
      this.logger.error(`Recommendations failed: ${error.message}`);
      throw new InternalServerErrorException('AI recommendations failed');
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
   * Call Gemini expecting a JSON response.
   */
  private async callGeminiJson(systemPrompt: string, userPrompt: string) {
    const model = this.getModel(systemPrompt, { json: true, maxOutputTokens: 4000 });
    const result = await model.generateContent(userPrompt);
    const content = result.response.text();
    if (!content) throw new Error('Empty AI response');

    return JSON.parse(content);
  }

  /**
   * Call Gemini expecting a plain text response.
   */
  private async callGeminiText(systemPrompt: string, userPrompt: string) {
    const model = this.getModel(systemPrompt, { maxOutputTokens: 3000 });
    const result = await model.generateContent(userPrompt);
    return result.response.text() || '';
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
