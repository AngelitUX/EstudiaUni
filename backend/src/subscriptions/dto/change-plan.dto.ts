import { IsString, IsIn } from 'class-validator';

export class CheckCreditsDto {
  @IsString()
  @IsIn(['simulation', 'quiz'])
  action: 'simulation' | 'quiz';
}

export class ChangePlanDto {
  @IsString()
  @IsIn(['premium', 'free'])
  tier: 'premium' | 'free';
}
