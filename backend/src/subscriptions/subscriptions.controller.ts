import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { FlowService } from './flow.service';
import { CheckCreditsDto } from './dto/change-plan.dto';
import { CreateFlowPaymentDto, ConfirmFlowPaymentDto, ValidateCouponDto } from './dto/flow.dto';
import { SubmitTransferDto } from './dto/manual-payment.dto';
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard';
import {
  CurrentUser,
  CurrentUserData,
} from '../common/decorators/current-user.decorator';

@Controller('subscriptions')
@UseGuards(FirebaseAuthGuard)
export class SubscriptionsController {
  constructor(
    private readonly subscriptionsService: SubscriptionsService,
    private readonly flowService: FlowService,
  ) {}

  @Get('status')
  async getStatus(@CurrentUser() user: CurrentUserData) {
    return this.subscriptionsService.getStatus(user.uid);
  }

  @Post('check-credits')
  @HttpCode(HttpStatus.OK)
  async checkCredits(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: CheckCreditsDto,
  ) {
    return this.subscriptionsService.checkCredits(user.uid, dto.action);
  }

  // NOTE: there is intentionally no public "upgrade" endpoint here. Granting
  // premium must only ever happen after a verified payment (see
  // FlowService.confirmPayment / handlePaymentWebhook) or an admin action
  // (see SubscriptionsService.manualGrant/approveTransfer). A directly
  // callable `POST /subscriptions/upgrade` used to exist and would grant
  // Premium to ANY authenticated user with no payment check at all — it was
  // removed.

  // NOTE: there is also intentionally no "cancel subscription" endpoint.
  // That only ever made sense while Flow auto-charged the card every period
  // (see CLAUDE.md §6/§12 for why that stopped) — a one-time "pase" has
  // nothing recurring to cancel, it just expires on its own `endDate`.

  @Post('validate-coupon')
  @HttpCode(HttpStatus.OK)
  async validateCoupon(@Body() dto: ValidateCouponDto) {
    return this.flowService.validateCoupon(dto.code, dto.planType);
  }

  @Post('flow/create-payment')
  @HttpCode(HttpStatus.OK)
  async createFlowPayment(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: CreateFlowPaymentDto,
  ) {
    return this.flowService.createPayment(
      user.uid,
      user.email,
      dto.planType,
      dto.returnUrl,
      dto.targetUid,
      dto.couponCode,
      dto.targetEmail,
    );
  }

  @Post('flow/confirm')
  @HttpCode(HttpStatus.OK)
  async confirmFlowPayment(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: ConfirmFlowPaymentDto,
  ) {
    return this.flowService.confirmPayment(user.uid, dto.token);
  }

  @Post('transfer/submit')
  @HttpCode(HttpStatus.OK)
  async submitTransfer(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: SubmitTransferDto,
  ) {
    return this.subscriptionsService.submitManualTransfer(user.uid, dto);
  }
}
