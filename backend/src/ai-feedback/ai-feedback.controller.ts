import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AiFeedbackService } from './ai-feedback.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard';
import {
  CurrentUser,
  CurrentUserData,
} from '../common/decorators/current-user.decorator';
import { AssistQuestionDto } from './dto/assist-question.dto';
import { ChatRequestDto } from './dto/chat-message.dto';
import { CareerChatRequestDto } from './dto/career-chat.dto';
import { RecommendationsRequestDto } from './dto/recommendations.dto';

@Controller('ai')
@UseGuards(FirebaseAuthGuard)
export class AiFeedbackController {
  constructor(
    private readonly aiFeedbackService: AiFeedbackService,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  @Post('analyze-attempt')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
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
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  async assistQuestion(
    @CurrentUser() user: CurrentUserData,
    @Body() body: AssistQuestionDto,
  ) {
    const tokenCheck = await this.subscriptionsService.checkFocoTokens(user.uid);
    if (!tokenCheck.allowed) {
      throw new ForbiddenException({
        code: 'FOCO_TOKENS_EXHAUSTED',
        limit: tokenCheck.limit,
        message: `Has alcanzado tus ${tokenCheck.limit} fichas diarias de Foco. Se recargarán mañana o pasa a PRO para obtener 200 fichas diarias.`,
        upgradeUrl: '/pricing',
      });
    }

    const result = await this.aiFeedbackService.assistQuestion(body);
    await this.subscriptionsService.consumeFocoToken(user.uid);
    return { ...result, remainingTokens: tokenCheck.remaining - 1, limitTokens: tokenCheck.limit };
  }

  @Post('chat')
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  async chat(
    @CurrentUser() user: CurrentUserData,
    @Body() body: ChatRequestDto,
  ) {
    const tokenCheck = await this.subscriptionsService.checkFocoTokens(user.uid);
    if (!tokenCheck.allowed) {
      throw new ForbiddenException({
        code: 'FOCO_TOKENS_EXHAUSTED',
        limit: tokenCheck.limit,
        message: `Has alcanzado tus ${tokenCheck.limit} fichas diarias de Foco. Se recargarán mañana a la misma hora. ¡Pásate a PRO para tener 200 fichas diarias! 👑`,
        upgradeUrl: '/pricing',
      });
    }

    const result = await this.aiFeedbackService.chatWithContext(body);
    await this.subscriptionsService.consumeFocoToken(user.uid);
    return { ...result, remainingTokens: tokenCheck.remaining - 1, limitTokens: tokenCheck.limit };
  }

  @Post('career-chat')
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  async careerChat(
    @CurrentUser() user: CurrentUserData,
    @Body() body: CareerChatRequestDto,
  ) {
    const status = await this.subscriptionsService.getStatus(user.uid);
    if (status.tier !== 'premium') {
      throw new ForbiddenException({
        code: 'PREMIUM_ONLY_FEATURE',
        message: 'El orientador vocacional IA es exclusivo del Plan PRO.',
        upgradeUrl: '/pricing',
      });
    }

    const tokenCheck = await this.subscriptionsService.checkFocoTokens(user.uid);
    if (!tokenCheck.allowed) {
      throw new ForbiddenException({
        code: 'FOCO_TOKENS_EXHAUSTED',
        limit: tokenCheck.limit,
        message: `Has alcanzado tus ${tokenCheck.limit} fichas diarias de Foco. Se recargarán mañana a la misma hora.`,
        upgradeUrl: '/pricing',
      });
    }

    const result = await this.aiFeedbackService.careerChat(body);
    await this.subscriptionsService.consumeFocoToken(user.uid);
    return { ...result, remainingTokens: tokenCheck.remaining - 1, limitTokens: tokenCheck.limit };
  }

  @Post('recommendations')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async recommendations(
    @CurrentUser() user: CurrentUserData,
    @Body() body: RecommendationsRequestDto,
  ) {
    const status = await this.subscriptionsService.getStatus(user.uid);
    if (status.tier !== 'premium') {
      throw new ForbiddenException({
        code: 'PREMIUM_ONLY_FEATURE',
        message: 'Las recomendaciones de IA son exclusivas del Plan PRO.',
        upgradeUrl: '/pricing',
      });
    }

    const tokenCheck = await this.subscriptionsService.checkFocoTokens(user.uid);
    if (!tokenCheck.allowed) {
      throw new ForbiddenException({
        code: 'FOCO_TOKENS_EXHAUSTED',
        limit: tokenCheck.limit,
        message: `Has alcanzado tus ${tokenCheck.limit} fichas diarias de Foco. Se recargarán mañana.`,
        upgradeUrl: '/pricing',
      });
    }

    const result = await this.aiFeedbackService.generateRecommendations(body);
    await this.subscriptionsService.consumeFocoToken(user.uid);
    return { ...result, remainingTokens: tokenCheck.remaining - 1, limitTokens: tokenCheck.limit };
  }

  @Get('analysis/:analysisId')
  async getAnalysis(
    @CurrentUser() user: CurrentUserData,
    @Param('analysisId') analysisId: string,
  ) {
    return this.aiFeedbackService.getAnalysis(user.uid, analysisId);
  }
}
