import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import katex from 'katex';

@Injectable({ providedIn: 'root' })
export class KatexService {

  constructor(private sanitizer: DomSanitizer) {
    this.ensureStylesLoaded();
  }

  /**
   * Garantiza que la hoja de estilos CSS de KaTeX esté cargada localmente en el documento
   */
  private ensureStylesLoaded(): void {
    if (typeof document !== 'undefined') {
      const styleId = 'katex-cdn-styles';
      if (!document.getElementById(styleId)) {
        const link = document.createElement('link');
        link.id = styleId;
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.45/dist/katex.min.css';
        document.head.appendChild(link);
      }
    }
  }

  /**
   * Renderiza una cadena LaTeX a HTML usando KaTeX
   * @param latex - Cadena LaTeX sin delimitadores (ej: "\\frac{1}{2}")
   * @param displayMode - true para modo bloque, false para inline
   * @returns SafeHtml renderizado y seguro para [innerHTML]
   */
  render(latex: string, displayMode = true): SafeHtml {
    if (!latex) return '';
    try {
      const htmlString = katex.renderToString(latex, {
        displayMode,
        throwOnError: false,
        trust: true,
        strict: false,
        output: 'html',
      });
      return this.sanitizer.bypassSecurityTrustHtml(htmlString);
    } catch (error) {
      console.warn('KaTeX render error:', error);
      const errorHtml = `<code class="katex-error">${this.escapeHtml(latex)}</code>`;
      return this.sanitizer.bypassSecurityTrustHtml(errorHtml);
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

  /**
   * Renderiza una cadena mixta que contiene texto normal y bloques LaTeX envueltos en $...$
   */
  renderMixedText(text: string): SafeHtml {
    if (!text) return '';

    // Reemplazamos los signos de dólar escapados (\$) por un placeholder temporal
    const placeholderText = text.replace(/\\(\$)/g, '%%%DOLLAR%%%');

    let lastIndex = 0;
    let result = '';
    const regex = /\$(.+?)\$/g;
    let match;

    while ((match = regex.exec(placeholderText)) !== null) {
      // Escapamos el texto normal y convertimos los saltos de línea (\n) a &lt;br&gt;
      const normalText = placeholderText.substring(lastIndex, match.index);
      result += this.escapeHtml(normalText).replace(/\n/g, '&lt;br&gt;');
      
      const latexBlock = match[1].replace(/%%%DOLLAR%%%/g, '\\$');
      
      // Renderizamos el bloque con KaTeX (retorna un string HTML internamente)
      const latexHtml = katex.renderToString(latexBlock, {
        displayMode: false,
        throwOnError: false,
        trust: true,
        strict: false,
        output: 'html',
      });
      
      result += latexHtml;
      lastIndex = regex.lastIndex;
    }
    const finalNormalText = placeholderText.substring(lastIndex);
    result += this.escapeHtml(finalNormalText).replace(/\n/g, '&lt;br&gt;');

    // Restauramos el placeholder por el signo de dólar literal y sanitizamos todo el bloque mixto
    const finalHtml = result.replace(/%%%DOLLAR%%%/g, '$');
    return this.sanitizer.bypassSecurityTrustHtml(finalHtml);
  }

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}
