/**
 * Converts a Foco chat reply (plain text with simple Markdown + LaTeX-ish
 * math notation) into safe-ish HTML for [innerHTML] binding. Shared by every
 * screen that renders Foco's messages (exam runner, ensayo review, career
 * finder) so formatting stays consistent and fixes only need to happen once.
 */
export function formatFocoMessage(text: string): string {
  if (!text) return '';

  let formatted = text;

  // 1. Reemplazar bloques de ecuaciones grandes $$ ... $$ o \[ ... \]
  formatted = formatted.replace(/\$\$([\s\S]*?)\$\$/g, (match, p1) => {
    return `<div class="math-block">${p1.trim()}</div>`;
  });
  formatted = formatted.replace(/\\\[([\s\S]*?)\\\]/g, (match, p1) => {
    return `<div class="math-block">${p1.trim()}</div>`;
  });

  // 2. Reemplazar ecuaciones inline $ ... $ o \( ... \)
  formatted = formatted.replace(/\$([\s\S]*?)\$/g, (match, p1) => {
    return `<span class="math-inline">${p1.trim()}</span>`;
  });
  formatted = formatted.replace(/\\\(([\s\S]*?)\\\)/g, (match, p1) => {
    return `<span class="math-inline">${p1.trim()}</span>`;
  });

  // 3. Procesar comandos matemáticos dentro de todo el texto

  // Texto dentro de formulas: \text{...} -> ...
  formatted = formatted.replace(/\\text\{([^{}]+)\}/g, '<span style="font-family: inherit;">$1</span>');
  formatted = formatted.replace(/\\mathrm\{([^{}]+)\}/g, '<span style="font-family: inherit;">$1</span>');
  formatted = formatted.replace(/\\mathbf\{([^{}]+)\}/g, '<strong>$1</strong>');
  formatted = formatted.replace(/\\textbf\{([^{}]+)\}/g, '<strong>$1</strong>');

  // Fracciones: \frac{a}{b} -> vertical fraction en HTML
  while (formatted.includes('\\frac{') || formatted.includes('\\dfrac{')) {
    const nextFormatted = formatted.replace(/\\d?frac\{([^{}]+)\}\{([^{}]+)\}/g, (match, num, den) => {
      return `<span class="math-fraction"><span class="fraction-num">${num}</span><span class="fraction-den">${den}</span></span>`;
    });
    if (nextFormatted === formatted) break;
    formatted = nextFormatted;
  }

  // Raíces: \sqrt{x} -> √x con línea superior styled
  formatted = formatted.replace(/\\sqrt\{([^{}]+)\}/g, '√<span style="border-top: 1.5px solid; padding-top: 1px;">$1</span>');

  // Vectores: \vec{u} o \vec u
  formatted = formatted.replace(/\\vec\{([a-zA-Z0-9+-]+)\}/g, '<span class="math-vector">$1</span>');
  formatted = formatted.replace(/\\vec\s*([a-zA-Z])/g, '<span class="math-vector">$1</span>');

  // Estimadores/Sombreros: \hat{p} o \hat p
  formatted = formatted.replace(/\\hat\{([a-zA-Z0-9+-]+)\}/g, '<span class="math-hat">$1</span>');
  formatted = formatted.replace(/\\hat\s*([a-zA-Z])/g, '<span class="math-hat">$1</span>');

  // Medias/Barras: \bar{x} o \overline{AB}
  formatted = formatted.replace(/\\overline\{([a-zA-Z0-9+-]+)\}/g, '<span style="text-decoration: overline;">$1</span>');
  formatted = formatted.replace(/\\bar\{([a-zA-Z0-9+-]+)\}/g, '<span style="text-decoration: overline;">$1</span>');
  formatted = formatted.replace(/\\bar\s*([a-zA-Z])/g, '<span style="text-decoration: overline;">$1</span>');

  // Exponentes: x^2 o y^(a+1) -> superíndices HTML
  formatted = formatted.replace(/\^\{([^}]+)\}/g, '<sup>$1</sup>');
  formatted = formatted.replace(/\^\(([^)]+)\)/g, '<sup>$1</sup>');
  formatted = formatted.replace(/\^([a-zA-Z0-9+-]+)/g, '<sup>$1</sup>');

  // Subíndices: x_1 o x_(i+1) -> subíndices HTML
  formatted = formatted.replace(/_\{([^}]+)\}/g, '<sub>$1</sub>');
  formatted = formatted.replace(/_\(([^)]+)\)/g, '<sub>$1</sub>');
  formatted = formatted.replace(/_([a-zA-Z0-9+-]+)/g, '<sub>$1</sub>');

  // Símbolos matemáticos de LaTeX a Unicode limpio
  const mathSymbols: { [key: string]: string } = {
    '\\\\pm': '±',
    '\\\\approx': '≈',
    '\\\\infty': '∞',
    '\\\\times': '×',
    '\\\\div': '÷',
    '\\\\neq': '≠',
    '\\\\ne': '≠',
    '\\\\leq': '≤',
    '\\\\le': '≤',
    '\\\\geq': '≥',
    '\\\\ge': '≥',
    '\\\\cdot': '•',
    '\\\\partial': '∂',
    '\\\\alpha': 'α',
    '\\\\beta': 'β',
    '\\\\gamma': 'γ',
    '\\\\delta': 'δ',
    '\\\\pi': 'π',
    '\\\\theta': 'θ',
    '\\\\sigma': 'σ',
    '\\\\lambda': 'λ',
    '\\\\Delta': 'Δ',
    '\\\\rightarrow': '→',
    '\\\\to': '→',
  };

  for (const [key, value] of Object.entries(mathSymbols)) {
    formatted = formatted.replace(new RegExp(key, 'g'), value);
  }

  // Convertir Markdown simple a HTML para el texto normal
  formatted = formatted
    // Negritas: **texto** -> <strong>texto</strong>
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Itálicas: *palabra* -> <em>palabra</em> (solo palabras individuales, evita romper 3 * x * y)
    .replace(/\*([a-zA-ZáéíóúÁÉÍÓÚñÑ]+)\*/g, '<em>$1</em>')
    // Listas: * elemento o   *   elemento (indentado, con varios espacios) -> • elemento
    .replace(/^[ \t]*\*[ \t]+(.*)$/gim, '• $1')
    // Saltos de línea: \n -> <br>
    .replace(/\n/g, '<br>');

  return formatted;
}
