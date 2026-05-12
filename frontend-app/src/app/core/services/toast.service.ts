import { Injectable, inject } from '@angular/core';

/**
 * ToastService - Non-blocking Notification System
 * 
 * BUG FIX (29/03/2026): Replaced alert() with elegant toast notifications
 * BEFORE: Blocking alert() popups throughout the app
 * AFTER: Smooth slide-in toast messages with auto-dismiss
 * 
 * Features:
 * - 3 types: success (green), error (red), info (blue)
 * - Auto-dismiss after configurable duration (default 4s)
 * - Click to dismiss manually
 * - Stacks multiple toasts vertically
 * - Smooth animations (slideInRight/slideOutRight)
 * 
 * Usage:
 *   toast.success('Quiz completado!')
 *   toast.error('Error al cargar módulos')
 *   toast.info('Tiempo terminado', 5000)
 */
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastContainer: HTMLElement | null = null;

  constructor() {
    // Create toast container on initialization
    if (typeof document !== 'undefined') {
      this.initContainer();
    }
  }

  private initContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText = `
        position: fixed;
        top: 24px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        pointer-events: none;
      `;
      document.body.appendChild(container);
    }
    this.toastContainer = container;
  }

  show(message: string, type: 'success' | 'error' | 'info' = 'info', duration: number = 4000) {
    if (!this.toastContainer) {
      this.initContainer();
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    const colors = {
      success: 'linear-gradient(135deg, #855cd6, #6b46b8)',
      error: 'linear-gradient(135deg, #ef4444, #dc2626)',
      info: 'linear-gradient(135deg, #6366f1, #4f46e5)'
    };

    toast.style.cssText = `
      background: ${colors[type]};
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      min-width: 320px;
      max-width: 90vw;
      font-size: 14px;
      font-weight: 600;
      animation: slideInTop 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      cursor: pointer;
      pointer-events: auto;
      text-align: center;
    `;

    this.toastContainer?.appendChild(toast);

    // Remove on click
    toast.addEventListener('click', () => {
      this.removeToast(toast);
    });

    // Auto remove after duration
    setTimeout(() => {
      this.removeToast(toast);
    }, duration);
  }

  private removeToast(toast: HTMLElement) {
    toast.style.animation = 'slideOutTop 0.3s ease forwards';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }

  success(message: string, duration?: number) {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number) {
    this.show(message, 'error', duration);
  }

  info(message: string, duration?: number) {
    this.show(message, 'info', duration);
  }
}
