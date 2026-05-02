import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AiFeedbackService } from './ai-feedback.service';
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard';
import {
  CurrentUser,
  CurrentUserData,
} from '../common/decorators/current-user.decorator';
import { AssistQuestionDto } from './dto/assist-question.dto';
import { ChatRequestDto } from './dto/chat-message.dto';

@Controller('ai')
@UseGuards(FirebaseAuthGuard)
export class AiFeedbackController {
  constructor(private readonly aiFeedbackService: AiFeedbackService) {}

  @Post('analyze-attempt')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 per minute
  async analyzeAttempt(
    @CurrentUser() user: CurrentUserData,
    @Body('attemptId') attemptId: string,
  ) {
    return this.aiFeedbackService.analyzeAttempt(user.uid, attemptId);
  }

  @Post('synthesize-topic')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async synthesizeTopic(
    @Body('topicId') topicId: string,
    @Body('complexity') complexity: 'simple' | 'detailed' = 'simple',
  ) {
    return this.aiFeedbackService.synthesizeTopic(topicId, complexity);
  }

  @Post('assist-question')
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 per minute
  async assistQuestion(@Body() body: AssistQuestionDto) {
    return this.aiFeedbackService.assistQuestion(body);
  }

  @Post('chat')
  @Throttle({ default: { limit: 30, ttl: 60000 } }) // 30 messages per minute
  async chat(@Body() body: ChatRequestDto) {
    return this.aiFeedbackService.chatWithContext(body);
  }

  @Get('analysis/:analysisId')
  async getAnalysis(
    @CurrentUser() user: CurrentUserData,
    @Param('analysisId') analysisId: string,
  ) {
    return this.aiFeedbackService.getAnalysis(user.uid, analysisId);
  }
}
