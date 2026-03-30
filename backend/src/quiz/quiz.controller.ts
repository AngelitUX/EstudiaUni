import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { GenerateQuizDto, SubmitQuizDto } from './dto/generate-quiz.dto';
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard';
import {
  CurrentUser,
  CurrentUserData,
} from '../common/decorators/current-user.decorator';

@Controller('quiz')
@UseGuards(FirebaseAuthGuard)
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post('generate')
  async generate(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: GenerateQuizDto,
  ) {
    return this.quizService.generate(user.uid, dto.topicId, dto.questionCount);
  }

  @Post('submit')
  async submit(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: SubmitQuizDto,
  ) {
    return this.quizService.submit(user.uid, dto.attemptId, dto.answers);
  }

  @Post(':attemptId/submit')
  async submitWithParam(
    @CurrentUser() user: CurrentUserData,
    @Param('attemptId') attemptId: string,
    @Body() body: { answers: any[] },
  ) {
    return this.quizService.submit(user.uid, attemptId, body.answers);
  }
}
