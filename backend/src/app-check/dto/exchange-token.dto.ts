import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class ExchangeTokenDto {
  @IsString()
  turnstileToken: string;

  @IsOptional()
  @IsBoolean()
  limitedUse?: boolean;
}
