import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
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
  ExtendSubscriptionDto,
  RevokeSubscriptionDto,
  ApproveTransferDto,
  DeleteTransferDto,
} from '../subscriptions/dto/manual-payment.dto';
import {
  UpsertModuleDto,
  UpsertTopicDto,
  UpsertQuestionDto,
  CreateSimulationDto,
} from './dto/admin-content.dto';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { CurrentUser, CurrentUserData } from '../common/decorators/current-user.decorator';

@Controller('admin')
@UseGuards(FirebaseAuthGuard, AdminGuard)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  @Post('modules')
  async upsertModule(@Body() body: UpsertModuleDto) {
    return this.adminService.upsertModule(body.moduleId || null, body.data);
  }

  @Post('modules/:moduleId/topics')
  async upsertTopic(
    @Param('moduleId') moduleId: string,
    @Body() body: UpsertTopicDto,
  ) {
    return this.adminService.upsertTopic(
      moduleId,
      body.topicId || null,
      body.data,
    );
  }

  @Post('questions')
  async upsertQuestion(@Body() body: UpsertQuestionDto) {
    return this.adminService.upsertQuestion(body.questionId || null, body.data);
  }

  @Post('simulations')
  async createSimulation(@Body() body: CreateSimulationDto) {
    return this.adminService.createSimulation(body.data);
  }

  @Get('stats')
  async getStats() {
    return this.adminService.getStats();
  }

  @Get('users')
  async listUsers(@Query() query: ListUsersQueryDto) {
    return this.adminService.listUsers(query);
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

  @Post('subscriptions/extend')
  @HttpCode(HttpStatus.OK)
  async extendSubscription(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: ExtendSubscriptionDto,
  ) {
    return this.subscriptionsService.manualExtend(
      dto.targetEmailOrUid,
      dto.durationDays,
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
  async approveTransfer(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: ApproveTransferDto,
  ) {
    return this.subscriptionsService.approveTransfer(
      dto.transferId,
      dto.action,
      user.uid,
      dto.rejectionReason,
      dto.planType,
    );
  }

  @Post('subscriptions/transfer/delete')
  @HttpCode(HttpStatus.OK)
  async deleteTransferRecord(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: DeleteTransferDto,
  ) {
    return this.subscriptionsService.deleteTransferRecord(dto.transferId, user.uid);
  }

  @Get('subscriptions/transfer/:transferId/receipt')
  async getTransferReceipt(@Param('transferId') transferId: string) {
    return this.subscriptionsService.getTransferReceipt(transferId);
  }
}
