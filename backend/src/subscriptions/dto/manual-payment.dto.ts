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

export class ExtendSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  targetEmailOrUid: string;

  @IsNumber()
  @Min(1)
  durationDays: number;

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

  // Required when action is 'approve' — the admin picks the duration to
  // grant explicitly (1 month / 1 year) instead of trusting whatever
  // planType the student originally picked on the transfer form.
  @IsEnum(['monthly', 'yearly'])
  @IsOptional()
  planType?: 'monthly' | 'yearly';

  @IsString()
  @IsOptional()
  rejectionReason?: string;
}

export class DeleteTransferDto {
  @IsString()
  @IsNotEmpty()
  transferId: string;
}
