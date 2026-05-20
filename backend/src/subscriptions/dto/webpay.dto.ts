import { IsString, IsIn, IsUrl, IsOptional } from 'class-validator';

export class CreateWebpayTransactionDto {
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
  couponCode?: string; // Optional discount code
}

export class CommitWebpayTransactionDto {
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
