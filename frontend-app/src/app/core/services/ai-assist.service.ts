import { Injectable } from '@angular/core';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { environment } from '../../../environments/environment';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface ChatRequest {
  question: string;
  options: Array<{ id: string; text: string }>;
  userAnswer?: string | null;
  subject?: string;
  examTitle?: string;
  imageUrl?: string | null;
  history: ChatMessage[];
}

export interface ChatResponse {
  reply: string;
}

// Legacy support
export interface AssistRequest {
  question: string;
  options: Array<{ id: string; text: string }>;
  userAnswer?: string | null;
  subject?: string;
}

export interface AssistResponse {
  reply: string;
}

const TUTOR_SYSTEM_PROMPT = `Eres Foco, la mascota oficial y tutor de EstudiaUni.cl. Eres un pulpo súper inteligente, entusiasta y amigable de 8 tentáculos (cada uno experto en una de las 8 materias de la PAES de Chile). Tu rol es guiar a los estudiantes en sus ensayos asistidos con calidez, cercanía y mucha motivación.

PERSONALIDAD Y TONO DE FOCO:
- ¡Eres un pulpo! Usa metáforas marinas u oceanográficas de forma sutil, dinámica y divertida en tus explicaciones (ej. "agua nueva", "corrientes de ideas", "desenredar con mis tentáculos", "chocamos esos ocho"), pero NUNCA las uses en saludos repetitivos.
- Sé sumamente empático, motivador y usa un español chileno sutil y cercano, perfecto para estudiantes de enseñanza media (ej. "¡Dale!", "¡Súper!", "¡Excelente!", "¡Vamos con todo!").
- En lugar de respuestas genéricas de IA, tu personalidad es vibrante, alegre y llena de emojis marinos y de luz (🐙, 💡, 🌊, 🧠, ✨).

REGLAS DE RESOLUCIÓN PEDAGÓGICA (ESTRICTAS):
- NUNCA reveles la alternativa correcta directamente (ej. jamás digas "es la opción A", "marca la B", etc.).
- SIN INTRODUCCIONES REPETITIVAS (CRÍTICO): NUNCA incluyas saludos repetitivos, presentaciones o introducciones largas en tus respuestas (ej. evita decir "¡Hola!", "¡Vamos a sumergirnos!", "¡Hola crack!", "mis tentáculos están listos para...", etc.). Ve DIRECTAMENTE al grano, a la pista o a la pregunta en tu primer párrafo, sin rodeos tediosos para que la interacción fluya de forma ágil y rápida.
- Guía al estudiante mediante el método socrático: hazle preguntas de reflexión, dale pistas conceptuales y estrategias paso a paso para descartar opciones incorrectas.
- INTERACCIÓN PASO A PASO (CRÍTICO): NUNCA respondas a tus propias preguntas ni simules diálogos interactivos de ida y vuelta contigo mismo en una sola respuesta (evita monólogos como "¡Excelente! Ahora veamos la parte clave..." o "¡Súper! Ya casi lo tenemos..."). Haz una única pregunta de reflexión o entrega una única pista inicial a la vez, deteniendo tu respuesta para esperar a que el estudiante interactúe y responda antes de avanzar al siguiente paso de la resolución.
- Sé conciso y directo: responde de forma breve (idealmente entre 2 y 4 párrafos cortos) para no abrumar al estudiante, pero asegúrate de terminar SIEMPRE tus oraciones e ideas de forma completa y redonda.
- FINALIZACIÓN OBLIGATORIA: Bajo ninguna circunstancia dejes una respuesta incompleta, una oración a medias o una explicación truncada. Cada mensaje tuyo debe tener un cierre perfecto y coherente.
- TRATAMIENTO DE DECIMALES (CRÍTICO PARA SEGURIDAD): Al explicar ejercicios con números decimales de muchos dígitos (como 4,56891921), NUNCA escribas la secuencia completa de decimales. En su lugar, usa abreviaciones como "4,56..." o "4,568..." o redondea el número para mantener el texto limpio, amigable y evitar activar falsos positivos en los filtros de privacidad.

FORMATO MATEMÁTICO Y DE ECUACIONES (MUY IMPORTANTE):
- Para matemáticas o física, cuando uses ecuaciones, fórmulas o notación científica, usa un formato súper legible.
- Usa notación LaTeX estándar encerrando las fórmulas en bloques con '$$' o en línea con '$' (ej. '$$f(x) = x^2 + 5x + 6$$' o '$x^2$').
- O bien, usa caracteres Unicode legibles de superíndices (x², y³) y subíndices (x_n).
- Traduce cualquier lenguaje de programación crudo o sintaxis tipo Wolfram (ej. 'x^2+5x+6=0' o 'Integrate[x^2]') a notación matemática tradicional elegante y legible en español (ej. '$x^2 + 5x + 6 = 0$').`;

@Injectable({ providedIn: 'root' })
export class AiAssistService {
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    const apiKey = (environment as any).geminiApiKey;
    if (apiKey && apiKey.length > 10) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    } else {
      console.warn('[AiAssistService] Gemini API key no configurada.');
    }
  }

  /**
   * Multi-turn chat using Gemini directly (no backend needed).
   */
  async chatDirect(payload: ChatRequest): Promise<ChatResponse> {
    if (!this.genAI) {
      return {
        reply: '⚠️ El tutor IA no está configurado. Agrega tu API key en environment.ts'
      };
    }

    const optionsText = payload.options
      .map(o => `${o.id}. ${o.text}`)
      .join('\n');

    const contextPrompt = `${TUTOR_SYSTEM_PROMPT}

Ensayo actual: ${payload.examTitle || 'Prueba PAES'}
Materia/ID: ${payload.subject || 'Desconocida'}

Pregunta del ensayo (Podría ser una imagen que te adjunto):
${payload.question}

Opciones disponibles:
${optionsText}

Respuesta actual del estudiante: ${payload.userAnswer || 'Sin responder aún'}

INSTRUCCIÓN VISION:
Si te envío una imagen, léela con atención. Es la captura oficial de la pregunta. Si el texto de la 'Pregunta' arriba es genérico (como "Pregunta 5"), confía plenamente en lo que ves en la imagen para guiar al alumno.`;

    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction: contextPrompt,
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ],
        generationConfig: {
          maxOutputTokens: 8192,
          temperature: 0.7,
        }
      });

      // Build history for Gemini
      let geminiHistory = payload.history.slice(0, -1).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      // Gemini history MUST start with 'user' role
      while (geminiHistory.length > 0 && geminiHistory[0].role === 'model') {
        geminiHistory.shift();
      }

      const chat = model.startChat({ history: geminiHistory });

      // Build parts for the current message
      const lastMsg = payload.history[payload.history.length - 1];
      const userText = lastMsg?.role === 'user' ? lastMsg.content : 'Necesito una pista.';
      
      const messageParts: any[] = [{ text: userText }];

      // ADD VISION SUPPORT
      if (payload.imageUrl) {
        try {
          const base64Data = await this.urlToBase64(payload.imageUrl);
          messageParts.push({
            inline_data: {
              mime_type: 'image/png', // Assuming PNG/JPG
              data: base64Data
            }
          });
        } catch (imgError) {
          console.error('[AiAssistService] Error loading image for vision:', imgError);
        }
      }

      const result = await chat.sendMessage(messageParts);
      const reply = result.response.text();
      return { reply: reply || 'No pude generar una respuesta. Intenta de nuevo.' };

    } catch (error: any) {
      console.error('[AiAssistService] Gemini error:', error);
      
      // Manejo de errores específicos
      const msg = error?.message || '';
      return { reply: `⚠️ Error de Google API: ${msg}` };
    }
  }

  // Wrappers para el componente (el componente espera llamadas con Promise)
  chat(payload: ChatRequest) {
    return new Promise<ChatResponse>(resolve => resolve(this.chatDirect(payload)));
  }

  requestAssist(payload: AssistRequest) {
    return new Promise<AssistResponse>(resolve => resolve(this.chatDirect({
      ...payload,
      history: [{ role: 'user', content: 'Necesito una pista para esta pregunta.' }]
    })));
  }

  private async urlToBase64(url: string): Promise<string> {
    // Convert relative URL to absolute if needed (Gemini needs full data)
    const absoluteUrl = url.startsWith('http') ? url : window.location.origin + (url.startsWith('/') ? '' : '/') + url;
    const response = await fetch(absoluteUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async askQuestion(systemPrompt: string, history: ChatMessage[]): Promise<string> {
    if (!this.genAI) {
      return '⚠️ El tutor IA no está configurado. Agrega tu API key en environment.ts';
    }

    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction: systemPrompt,
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ],
        generationConfig: {
          maxOutputTokens: 8192,
          temperature: 0.7,
        }
      });

      let geminiHistory = history.slice(0, -1).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      while (geminiHistory.length > 0 && geminiHistory[0].role === 'model') {
        geminiHistory.shift();
      }

      const chat = model.startChat({ history: geminiHistory });
      
      const lastMsg = history[history.length - 1];
      const userText = lastMsg?.role === 'user' ? lastMsg.content : 'Hola';

      const result = await chat.sendMessage(userText);
      return result.response.text();
    } catch (error: any) {
      console.error('[AiAssistService] askQuestion error:', error);
      return `⚠️ Error de conexión: ${error?.message || 'Error desconocido'}`;
    }
  }
}
