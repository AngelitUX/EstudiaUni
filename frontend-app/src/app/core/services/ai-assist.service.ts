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

const TUTOR_SYSTEM_PROMPT = `Eres un tutor experto en la PAES (Prueba de Acceso a la Educación Superior) de Chile. Ayudas a estudiantes durante ensayos asistidos.

REGLAS ESTRICTAS:
- NUNCA reveles la alternativa correcta directamente (nunca digas "la respuesta es A", "es la opción B", etc.)
- Da pistas conceptuales, estrategias de razonamiento y orientación paso a paso
- Mantén el hilo conversacional con el estudiante
- Responde siempre en español chileno, de forma clara y amigable
- Sé conciso: máximo 120 palabras por respuesta
- Usa un tono motivador y cercano`;

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
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        ],
        generationConfig: {
          maxOutputTokens: 1000,
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
        generationConfig: {
          maxOutputTokens: 1000,
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
