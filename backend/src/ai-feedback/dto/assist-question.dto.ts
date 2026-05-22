import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AssistOptionDto {
  @IsString()
  id: string;

  @IsString()
  text: string;
}

export class AssistQuestionDto {
  @IsString()
  question: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssistOptionDto)
  options: AssistOptionDto[];

  @IsOptional()
  @IsString()
  userAnswer?: string | null;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
