import { IsString, IsIn, IsUrl, IsOptional } from 'class-validator';

export class CreateFlowPaymentDto {
  @IsString()
  @IsIn(['monthly', 'yearly'])
  planType: 'monthly' | 'yearly';

  @IsString()
  @IsUrl({ require_tld: false }) // Allow localhost for development
  returnUrl: string;

  @IsOptional()
  @IsString()
  targetUid?: string; // If provided, the pass is granted to this user (gift flow)

  @IsOptional()
  @IsString()
  targetEmail?: string; // Recipient's email — stored so the payer can see whom they're gifting

  @IsOptional()
  @IsString()
  couponCode?: string; // Optional discount code, applied to this one-time payment
}

export class ConfirmFlowPaymentDto {
  @IsString()
  token: string;
}

export class ValidateCouponDto {
  @IsString()
  code: string;

  @IsString()
  @IsIn(['monthly', 'yearly'])
  planType: 'monthly' | 'yearly';
}
