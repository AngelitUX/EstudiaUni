import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ReviewChatMessageItemDto {
  @IsString()
  role: 'user' | 'assistant';

  @IsString()
  content: string;
}

class ReviewOptionDto {
  @IsString()
  id: string;

  @IsString()
  text: string;
}

export class ReviewChatRequestDto {
  @IsString()
  question: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReviewOptionDto)
  options: ReviewOptionDto[];

  @IsOptional()
  @IsString()
  userAnswer?: string | null;

  @IsString()
  correctAnswer: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readingImages?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReviewChatMessageItemDto)
  history: ReviewChatMessageItemDto[];
}
