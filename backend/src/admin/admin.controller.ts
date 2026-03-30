import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';

@Controller('admin')
@UseGuards(FirebaseAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

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
}
