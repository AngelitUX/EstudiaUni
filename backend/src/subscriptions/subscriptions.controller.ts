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
import { StartFlowRegistrationDto, ConfirmFlowSubscriptionDto, ValidateCouponDto } from './dto/flow.dto';
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
  // FlowService.confirmRegistrationAndSubscribe / handleRecurringWebhook) or
  // an admin action (see SubscriptionsService.manualGrant/approveTransfer). A
  // directly callable `POST /subscriptions/upgrade` used to exist and would
  // grant Premium to ANY authenticated user with no payment check at all —
  // it was removed.

  @Post('cancel')
  async cancel(@CurrentUser() user: CurrentUserData) {
    const result = await this.subscriptionsService.cancel(user.uid);
    if (result.flowSubscriptionId) {
      // Stop future Flow charges. Local access already keeps running until
      // endDate regardless of whether this call succeeds, so a Flow-side
      // failure here is logged (inside FlowService) but never surfaced as an
      // error to the user — the cancellation they asked for did take effect.
      await this.flowService.cancelFlowSubscription(result.flowSubscriptionId).catch(() => {});
    }
    return result;
  }

  @Post('validate-coupon')
  @HttpCode(HttpStatus.OK)
  async validateCoupon(@Body() dto: ValidateCouponDto) {
    return this.flowService.validateCoupon(dto.code, dto.planType);
  }

  @Post('flow/register-card')
  @HttpCode(HttpStatus.OK)
  async startFlowRegistration(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: StartFlowRegistrationDto,
  ) {
    return this.flowService.startCardRegistration(
      user.uid,
      user.email,
      dto.planType,
      dto.returnUrl,
      dto.targetUid,
      dto.couponCode,
    );
  }

  @Post('flow/confirm')
  @HttpCode(HttpStatus.OK)
  async confirmFlowSubscription(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: ConfirmFlowSubscriptionDto,
  ) {
    return this.flowService.confirmRegistrationAndSubscribe(user.uid, dto.token);
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
