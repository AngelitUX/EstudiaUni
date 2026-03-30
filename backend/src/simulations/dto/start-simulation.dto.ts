import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class StartSimulationDto {
  @IsString()
  simulationId: string;
}

export class SubmitAnswerDto {
  @IsString()
  attemptId: string;

  @IsString()
  questionId: string;

  @IsString()
  selectedOption: string;
}

export class FinishSimulationDto {
  @IsString()
  attemptId: string;
}
