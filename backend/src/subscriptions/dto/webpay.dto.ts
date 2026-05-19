import { IsString, IsIn, IsUrl } from 'class-validator';

export class CreateWebpayTransactionDto {
  @IsString()
  @IsIn(['monthly', 'yearly'])
  planType: 'monthly' | 'yearly';

  @IsString()
  @IsUrl({ require_tld: false }) // Allow localhost for development
  returnUrl: string;
}

export class CommitWebpayTransactionDto {
  @IsString()
  token: string;
}
