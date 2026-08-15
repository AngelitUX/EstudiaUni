import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
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
  readingImages?: string[] | null;
  history: ChatMessage[];
}

export interface BackendChatResponse {
  reply: string;
  remainingTokens: number;
  limitTokens: number;
}

export class FocoTokensExhaustedError extends Error {
  constructor(public limit: number, serverMessage?: string) {
    super(serverMessage || 'FOCO_TOKENS_EXHAUSTED');
  }
}

export interface ReviewChatRequest {
  question: string;
  options: Array<{ id: string; text: string }>;
  userAnswer?: string | null;
  correctAnswer: string;
  subject?: string;
  imageUrl?: string | null;
  readingImages?: string[] | null;
  history: ChatMessage[];
}

@Injectable({ providedIn: 'root' })
export class AiAssistService {
  private http = inject(HttpClient);

  /**
   * Multi-turn chat routed through the backend (POST /api/ai/chat).
   *
   * This is the only path that should be used from user-facing screens: the
   * backend enforces the real Foco daily token limit (checkFocoTokens /
   * consumeFocoToken against Firestore) before/after calling the AI model,
   * and it's the model call itself that stays server-side — no API key is
   * ever exposed to the browser this way.
   *
   * Throws FocoTokensExhaustedError when the user is out of tokens for today.
   */
  async chatViaBackend(payload: ChatRequest): Promise<BackendChatResponse> {
    const baseUrl = environment.apiUrl || 'http://localhost:3000';
    const body: any = {
      question: payload.question,
      options: payload.options,
      history: payload.history,
    };
    if (payload.userAnswer) body.userAnswer = payload.userAnswer;
    if (payload.subject) body.subject = payload.subject;
    if (payload.imageUrl) body.imageUrl = payload.imageUrl;
    if (payload.readingImages?.length) body.readingImages = payload.readingImages;

    try {
      return await firstValueFrom(
        this.http.post<BackendChatResponse>(`${baseUrl}/api/ai/chat`, body),
      );
    } catch (err) {
      if (err instanceof HttpErrorResponse && err.error?.code === 'FOCO_TOKENS_EXHAUSTED') {
        throw new FocoTokensExhaustedError(err.error.limit, err.error.message);
      }
      throw err;
    }
  }

  /**
   * Vocational-guidance chat routed through the backend (POST /api/ai/career-chat).
   * Used by the career-finder assistant — server-side enforces the Pro-plan
   * gate and Foco token limit, and the model call stays server-side.
   *
   * Throws FocoTokensExhaustedError when the user is out of tokens for today.
   */
  async careerChatViaBackend(history: ChatMessage[]): Promise<BackendChatResponse> {
    const baseUrl = environment.apiUrl || 'http://localhost:3000';
    try {
      return await firstValueFrom(
        this.http.post<BackendChatResponse>(`${baseUrl}/api/ai/career-chat`, { history }),
      );
    } catch (err) {
      if (err instanceof HttpErrorResponse && err.error?.code === 'FOCO_TOKENS_EXHAUSTED') {
        throw new FocoTokensExhaustedError(err.error.limit, err.error.message);
      }
      throw err;
    }
  }

  /**
   * Post-exam "why did I get this wrong" chat routed through the backend
   * (POST /api/ai/review-chat). Pro-only and token-gated server-side — unlike
   * chatViaBackend, the model is explicitly allowed to state the correct
   * answer here since the attempt is already submitted and graded.
   *
   * Throws FocoTokensExhaustedError when out of tokens for today.
   */
  async reviewChatViaBackend(payload: ReviewChatRequest): Promise<BackendChatResponse> {
    const baseUrl = environment.apiUrl || 'http://localhost:3000';
    const body: any = {
      question: payload.question,
      options: payload.options,
      correctAnswer: payload.correctAnswer,
      history: payload.history,
    };
    if (payload.userAnswer) body.userAnswer = payload.userAnswer;
    if (payload.subject) body.subject = payload.subject;
    if (payload.imageUrl) body.imageUrl = payload.imageUrl;
    if (payload.readingImages?.length) body.readingImages = payload.readingImages;

    try {
      return await firstValueFrom(
        this.http.post<BackendChatResponse>(`${baseUrl}/api/ai/review-chat`, body),
      );
    } catch (err) {
      if (err instanceof HttpErrorResponse && err.error?.code === 'FOCO_TOKENS_EXHAUSTED') {
        throw new FocoTokensExhaustedError(err.error.limit, err.error.message);
      }
      throw err;
    }
  }
}
