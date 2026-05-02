import { Injectable } from '@angular/core';
import katex from 'katex';

@Injectable({ providedIn: 'root' })
export class KatexService {

  /**
   * Renderiza una cadena LaTeX a HTML usando KaTeX
   * @param latex - Cadena LaTeX sin delimitadores (ej: "\\frac{1}{2}")
   * @param displayMode - true para modo bloque, false para inline
   * @returns HTML string renderizado
   */
  render(latex: string, displayMode = true): string {
    if (!latex) return '';
    try {
      return katex.renderToString(latex, {
        displayMode,
        throwOnError: false,
        trust: true,
        strict: false,
        output: 'html',
      });
    } catch (error) {
      console.warn('KaTeX render error:', error);
      return `<code class="katex-error">${this.escapeHtml(latex)}</code>`;
    }
  }

  /**
   * Renderiza LaTeX directamente en un elemento del DOM
   */
  renderToElement(element: HTMLElement, latex: string, displayMode = true): void {
    if (!latex || !element) return;
    try {
      katex.render(latex, element, {
        displayMode,
        throwOnError: false,
        trust: true,
        strict: false,
      });
    } catch (error) {
      console.warn('KaTeX render error:', error);
      element.innerHTML = `<code class="katex-error">${this.escapeHtml(latex)}</code>`;
    }
  }

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}
