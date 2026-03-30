import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard';

@Controller('questions')
@UseGuards(FirebaseAuthGuard)
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get('topic/:topicId')
  async getByTopic(
    @Param('topicId') topicId: string,
    @Query('difficulty') difficulty?: number,
  ) {
    const questions = await this.questionsService.getByTopic(
      topicId,
      difficulty,
    );
    return this.questionsService.stripAnswers(questions);
  }
}
