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
import { CheckCreditsDto } from './dto/change-plan.dto';
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard';
import {
  CurrentUser,
  CurrentUserData,
} from '../common/decorators/current-user.decorator';

@Controller('subscriptions')
@UseGuards(FirebaseAuthGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

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

  @Post('upgrade')
  async upgrade(@CurrentUser() user: CurrentUserData) {
    return this.subscriptionsService.upgrade(user.uid);
  }

  @Post('cancel')
  async cancel(@CurrentUser() user: CurrentUserData) {
    return this.subscriptionsService.cancel(user.uid);
  }
}
