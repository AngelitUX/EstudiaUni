import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, Min } from 'class-validator';

export class SubmitTransferDto {
  @IsEnum(['monthly', 'yearly'])
  @IsNotEmpty()
  planType: 'monthly' | 'yearly';

  @IsString()
  @IsNotEmpty()
  bankName: string;

  @IsString()
  @IsNotEmpty()
  transferNumber: string;

  @IsNumber()
  @Min(1)
  amount: number;

  @IsString()
  @IsOptional()
  payerEmail?: string;

  @IsString()
  @IsOptional()
  targetUid?: string;

  @IsString()
  @IsOptional()
  receiptUrl?: string;

  @IsString()
  @IsOptional()
  couponCode?: string;
}

export class GrantSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  targetEmailOrUid: string;

  @IsNumber()
  @Min(1)
  durationMonths: number;

  @IsEnum(['monthly', 'yearly'])
  @IsOptional()
  planType?: 'monthly' | 'yearly';

  @IsString()
  @IsOptional()
  reason?: string;
}

export class RevokeSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  targetEmailOrUid: string;

  @IsString()
  @IsOptional()
  reason?: string;
}

export class ApproveTransferDto {
  @IsString()
  @IsNotEmpty()
  transferId: string;

  @IsEnum(['approve', 'reject'])
  @IsNotEmpty()
  action: 'approve' | 'reject';

  @IsString()
  @IsOptional()
  rejectionReason?: string;
}
