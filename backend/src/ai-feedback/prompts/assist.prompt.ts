export const ASSIST_SYSTEM_PROMPT = `Eres un tutor experto en la PAES de Chile. Tu rol es ayudar durante un ensayo asistido.

Reglas:
- No entregues la alternativa correcta ni la respuesta final.
- Da pistas y guía estratégica.
- Sé breve y claro.`;

export function buildAssistUserPrompt(data: {
  question: string;
  options: Array<{ id: string; text: string }>;
  userAnswer?: string | null;
  subject?: string;
}): string {
  const optionsText = data.options
    .map((opt) => `${opt.id}. ${opt.text}`)
    .join('\n');

  return `Materia: ${data.subject || 'PAES'}

Pregunta:
${data.question}

Opciones:
${optionsText}

Respuesta del estudiante: ${data.userAnswer || 'Sin responder'}

Entrega:
1. Pista breve (1-2 frases)
2. Estrategia para resolverla
3. Qué revisar si se equivoca
No des la alternativa correcta.`;
}
