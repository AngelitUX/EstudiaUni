/**
 * Prompt templates for OpenAI API calls.
 */
export const ANALYSIS_SYSTEM_PROMPT = `Eres un tutor experto en la Prueba de Acceso a la Educación Superior (PAES) de Chile. Tu rol es analizar los resultados de un estudiante y proporcionar retroalimentación detallada y constructiva en español.

Tu análisis debe ser empático pero honesto. Usa un tono motivador que incentive al estudiante a seguir estudiando.`;

export function buildAnalysisUserPrompt(data: {
  correctCount: number;
  totalCount: number;
  percentage: number;
  incorrectQuestions: Array<{
    stem: string;
    selectedOption: string;
    correctOption: string;
    explanation: string;
    topicTitle: string;
    topicId: string;
  }>;
}): string {
  const incorrectList = data.incorrectQuestions
    .map(
      (q, i) =>
        `
Pregunta ${i + 1}:
- Enunciado: ${q.stem}
- Respuesta del estudiante: ${q.selectedOption}
- Respuesta correcta: ${q.correctOption}
- Explicación oficial: ${q.explanation}
- Tema: ${q.topicTitle} (ID: ${q.topicId})`,
    )
    .join('\n');

  return `Analiza los siguientes resultados de un ensayo PAES.

RESUMEN:
- Correctas: ${data.correctCount}/${data.totalCount} (${data.percentage}%)

PREGUNTAS INCORRECTAS:
${incorrectList || 'Ninguna — ¡el estudiante respondió todo correctamente!'}

Responde en JSON con exactamente este schema:
{
  "overallFeedback": "string - Resumen general del rendimiento, máximo 3 oraciones",
  "detectedGaps": [
    {
      "topicId": "string - ID del tema",
      "topicTitle": "string - Nombre del tema",
      "gapDescription": "string - Descripción de la brecha conceptual",
      "severity": "low | medium | high",
      "recommendedModuleId": "string",
      "recommendedTopicId": "string"
    }
  ],
  "questionAnalyses": [
    {
      "questionStem": "string - Inicio del enunciado para identificar",
      "wasCorrect": false,
      "explanation": "string - Por qué la respuesta correcta es correcta",
      "mistakeReason": "string - Por qué el estudiante probablemente se equivocó",
      "conceptualGap": "string - brecha conceptual específica"
    }
  ],
  "studyPlan": {
    "priorityTopics": ["topicId1", "topicId2"],
    "suggestedNextAction": "string - Recomendación de qué hacer a continuación"
  }
}`;
}

export const SYNTHESIS_SYSTEM_PROMPT = `Eres un tutor experto en contenido educativo para la PAES de Chile. Tu rol es sintetizar contenido académico de forma clara, concisa y fácil de entender para estudiantes de educación media.

Usa:
- Lenguaje simple y directo
- Ejemplos prácticos
- Analogías cuando sea útil
- Formato Markdown con headers, listas y negritas
- Responde siempre en español de Chile`;

export function buildSynthesisPrompt(
  topicTitle: string,
  content: string,
  complexity: 'simple' | 'detailed',
): string {
  const level =
    complexity === 'simple'
      ? 'Sintetiza de forma muy breve y simple, máximo 500 palabras. Enfócate en los conceptos clave.'
      : 'Explica de forma detallada con ejemplos y ejercicios resueltos. Máximo 1500 palabras.';

  return `Tema: ${topicTitle}

Contenido original:
${content}

Instrucciones: ${level}

Responde en formato Markdown.`;
}
