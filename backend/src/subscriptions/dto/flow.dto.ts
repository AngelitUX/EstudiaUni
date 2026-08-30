import { IsString, IsIn, IsUrl, IsOptional } from 'class-validator';

export class StartFlowRegistrationDto {
  @IsString()
  @IsIn(['monthly', 'yearly'])
  planType: 'monthly' | 'yearly';

  @IsString()
  @IsUrl({ require_tld: false }) // Allow localhost for development
  returnUrl: string;

  @IsOptional()
  @IsString()
  targetUid?: string; // If provided, premium will be granted to this user (gift flow)

  @IsOptional()
  @IsString()
  targetEmail?: string; // Recipient's email — stored so the payer can see whom they're gifting

  @IsOptional()
  @IsString()
  couponCode?: string; // Optional discount code, applied to the first charge only
}

export class ConfirmFlowSubscriptionDto {
  @IsString()
  token: string;
}

export class CancelGiftDto {
  @IsString()
  flowSubscriptionId: string;
}

export class ValidateCouponDto {
  @IsString()
  code: string;

  @IsString()
  @IsIn(['monthly', 'yearly'])
  planType: 'monthly' | 'yearly';
}
