import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import {
  GrantSubscriptionDto,
  RevokeSubscriptionDto,
  ApproveTransferDto,
} from '../subscriptions/dto/manual-payment.dto';
import { CurrentUser, CurrentUserData } from '../common/decorators/current-user.decorator';

@Controller('admin')
@UseGuards(FirebaseAuthGuard, AdminGuard)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  @Post('modules')
  async upsertModule(@Body() body: { moduleId?: string; data: any }) {
    return this.adminService.upsertModule(body.moduleId || null, body.data);
  }

  @Post('modules/:moduleId/topics')
  async upsertTopic(
    @Param('moduleId') moduleId: string,
    @Body() body: { topicId?: string; data: any },
  ) {
    return this.adminService.upsertTopic(
      moduleId,
      body.topicId || null,
      body.data,
    );
  }

  @Post('questions')
  async upsertQuestion(@Body() body: { questionId?: string; data: any }) {
    return this.adminService.upsertQuestion(body.questionId || null, body.data);
  }

  @Post('simulations')
  async createSimulation(@Body() data: any) {
    return this.adminService.createSimulation(data);
  }

  @Get('stats')
  async getStats() {
    return this.adminService.getStats();
  }

  // ─── ADMIN SUBSCRIPTION & PAYMENT ENDPOINTS ───

  @Get('subscriptions/transactions')
  async getAllTransactions() {
    return this.subscriptionsService.getAllTransactions();
  }

  @Post('subscriptions/grant')
  @HttpCode(HttpStatus.OK)
  async grantSubscription(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: GrantSubscriptionDto,
  ) {
    return this.subscriptionsService.manualGrant(
      dto.targetEmailOrUid,
      dto.durationMonths,
      dto.planType || 'monthly',
      user.uid,
      dto.reason,
    );
  }

  @Post('subscriptions/revoke')
  @HttpCode(HttpStatus.OK)
  async revokeSubscription(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: RevokeSubscriptionDto,
  ) {
    return this.subscriptionsService.manualRevoke(
      dto.targetEmailOrUid,
      user.uid,
      dto.reason,
    );
  }

  @Post('subscriptions/transfer/approve')
  @HttpCode(HttpStatus.OK)
  async approveTransfer(@Body() dto: ApproveTransferDto) {
    return this.subscriptionsService.approveTransfer(
      dto.transferId,
      dto.action,
      dto.rejectionReason,
    );
  }
}
