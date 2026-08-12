import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CareerChatMessageItemDto {
  @IsString()
  role: 'user' | 'assistant';

  @IsString()
  content: string;
}

export class CareerChatRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CareerChatMessageItemDto)
  history: CareerChatMessageItemDto[];
}
