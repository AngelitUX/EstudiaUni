import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ChatMessageItemDto {
  @IsString()
  role: 'user' | 'assistant';

  @IsString()
  content: string;
}

class AssistOptionDto {
  @IsString()
  id: string;

  @IsString()
  text: string;
}

export class ChatRequestDto {
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

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readingImages?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatMessageItemDto)
  history: ChatMessageItemDto[];
}
