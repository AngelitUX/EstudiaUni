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

Pregunta actual del ensayo:
${payload.question}

Opciones:
${optionsText}

Respuesta actual del estudiante: ${payload.userAnswer || 'Sin responder aún'}
Materia: ${payload.subject || 'PAES'}`;

    try {
      // Intentamos con gemini-2.5-flash que es la última versión disponible
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction: contextPrompt,
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        ],
        generationConfig: {
          maxOutputTokens: 250,
          temperature: 0.7,
        }
      });

      // Build history for Gemini
      // Gemini requires history to start with 'user' role
      let geminiHistory = payload.history.slice(0, -1).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      // Remove any leading 'model' messages (e.g. the initial welcome message)
      while (geminiHistory.length > 0 && geminiHistory[0].role === 'model') {
        geminiHistory.shift();
      }

      const chat = model.startChat({ history: geminiHistory });

      // Last message is the user's current input
      const lastMsg = payload.history[payload.history.length - 1];
      const userText = lastMsg?.role === 'user' ? lastMsg.content : 'Necesito una pista.';

      const result = await chat.sendMessage(userText);
      const reply = result.response.text();
      return { reply: reply || 'No pude generar una respuesta. Intenta de nuevo.' };

    } catch (error: any) {
      console.error('[AiAssistService] Gemini error:', error);
      
      // Manejo de errores específicos
      const msg = error?.message || '';
      if (msg.includes('API_KEY')) {
        return { reply: '🔑 API key inválida. Verifica que esté correcta en environment.ts.' };
      }
      if (msg.includes('429') || msg.includes('Quota')) {
        return { reply: '⚠️ Has superado la cuota de la API (Limit 0 o Too Many Requests). Verifica tu cuenta de Google.' };
      }
      if (msg.includes('404')) {
        return { reply: '⚠️ El modelo seleccionado no está disponible en tu API key. Podría requerir gemini-2.0-flash o pro.' };
      }
      return { reply: 'No pude conectarme al tutor en este momento. Intenta de nuevo en unos segundos.' };
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
}
