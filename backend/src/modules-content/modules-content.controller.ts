import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ModulesContentService } from './modules-content.service';
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard';
import {
  CurrentUser,
  CurrentUserData,
} from '../common/decorators/current-user.decorator';

@Controller('modules')
@UseGuards(FirebaseAuthGuard)
export class ModulesContentController {
  constructor(
    private readonly modulesContentService: ModulesContentService,
  ) {}

  @Get()
  async listModules(@CurrentUser() user: CurrentUserData) {
    return this.modulesContentService.listModules(user.uid);
  }

  @Get(':moduleId')
  async getModule(
    @Param('moduleId') moduleId: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.modulesContentService.getModule(moduleId, user.uid);
  }

  @Get(':moduleId/topics/:topicId')
  async getTopic(
    @Param('moduleId') moduleId: string,
    @Param('topicId') topicId: string,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.modulesContentService.getTopic(moduleId, topicId, user.uid);
  }
}
