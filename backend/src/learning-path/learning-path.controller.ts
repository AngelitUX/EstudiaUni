import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { LearningPathService } from './learning-path.service';
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard';
import {
  CurrentUser,
  CurrentUserData,
} from '../common/decorators/current-user.decorator';

@Controller('learning-path')
@UseGuards(FirebaseAuthGuard)
export class LearningPathController {
  constructor(private readonly learningPathService: LearningPathService) {}

  @Get()
  async getLearningPath(@CurrentUser() user: CurrentUserData) {
    return this.learningPathService.getLearningPath(user.uid);
  }

  @Post('unlock-check')
  async unlockCheck(@CurrentUser() user: CurrentUserData) {
    const unlockedTopics = await this.learningPathService.evaluateUnlocks(
      user.uid,
    );
    return { unlockedTopics };
  }

  @Get('recommendations')
  async getRecommendations(@CurrentUser() user: CurrentUserData) {
    return this.learningPathService.getRecommendations(user.uid);
  }
}
