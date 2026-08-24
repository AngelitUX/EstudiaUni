import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class StudyCoachMessageDto {
  @IsString()
  role: 'user' | 'assistant';

  @IsString()
  content: string;
}

/** Una actividad reciente del alumno (lección, ensayo, mini ensayo, mente veloz). */
class StudyActivityDto {
  @IsString()
  type: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsNumber()
  score?: number;

  @IsOptional()
  @IsNumber()
  totalCorrect?: number;

  @IsOptional()
  @IsNumber()
  totalQuestions?: number;

  @IsString()
  timestamp: string;
}

/** Mejor puntaje obtenido en un ensayo PAES por materia. */
class PaesRecordDto {
  @IsString()
  subject: string;

  @IsOptional()
  @IsNumber()
  score?: number;

  @IsOptional()
  @IsNumber()
  correctAnswers?: number;

  @IsOptional()
  @IsNumber()
  totalQuestions?: number;
}

/** Porcentaje de avance del alumno en la Ruta de Aprendizaje, por materia. */
class SubjectMasteryDto {
  @IsString()
  subject: string;

  @IsOptional()
  @IsNumber()
  mastery?: number;
}

/**
 * Todo lo que sabemos del alumno. Se envía en CADA mensaje para que Foco
 * mantenga el contexto sin depender de que el historial lo repita.
 */
export class StudyCoachContextDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudyActivityDto)
  actividades?: StudyActivityDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaesRecordDto)
  ensayos?: PaesRecordDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubjectMasteryDto)
  avanceRuta?: SubjectMasteryDto[];

  @IsOptional()
  @IsNumber()
  rachaDias?: number;

  @IsOptional()
  @IsNumber()
  superRachaDias?: number;

  /** Meta PAES fijada por el alumno en el dashboard. */
  @IsOptional()
  @IsNumber()
  puntajeMeta?: number;

  @IsOptional()
  @IsString()
  carreraMeta?: string;

  /** Franja horaria preferida declarada en el perfil (manana|tarde|noche|ninguno). */
  @IsOptional()
  @IsString()
  horarioPreferido?: string;

  @IsOptional()
  @IsNumber()
  minutosDiariosObjetivo?: number;

  /** Días que faltan para la PAES, para dimensionar el plan. */
  @IsOptional()
  @IsNumber()
  diasParaPaes?: number;
}

export class StudyCoachRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudyCoachMessageDto)
  history: StudyCoachMessageDto[];

  @ValidateNested()
  @Type(() => StudyCoachContextDto)
  context: StudyCoachContextDto;

  /**
   * true en el primer turno de la conversación, donde Foco produce el análisis
   * completo. Cuesta más fichas que un mensaje de seguimiento.
   */
  @IsOptional()
  @IsBoolean()
  isOpening?: boolean;
}
