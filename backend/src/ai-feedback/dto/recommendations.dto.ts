import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ActivitySummaryDto {
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

export class RecommendationsRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActivitySummaryDto)
  activities: ActivitySummaryDto[];
}
