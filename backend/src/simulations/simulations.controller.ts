import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { SimulationsService } from './simulations.service';
import {
  StartSimulationDto,
  SubmitAnswerDto,
  FinishSimulationDto,
} from './dto/start-simulation.dto';
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard';
import {
  CurrentUser,
  CurrentUserData,
} from '../common/decorators/current-user.decorator';

@Controller('simulations')
@UseGuards(FirebaseAuthGuard)
export class SimulationsController {
  constructor(private readonly simulationsService: SimulationsService) {}

  @Get()
  async list(@CurrentUser() user: CurrentUserData) {
    return this.simulationsService.list(user.uid);
  }

  @Post('start')
  async start(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: StartSimulationDto,
  ) {
    return this.simulationsService.start(user.uid, dto.simulationId);
  }

  @Post('submit')
  async submitAnswer(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: SubmitAnswerDto,
  ) {
    return this.simulationsService.submitAnswer(
      user.uid,
      dto.attemptId,
      dto.questionId,
      dto.selectedOption,
    );
  }

  @Post('finish')
  async finish(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: FinishSimulationDto,
  ) {
    return this.simulationsService.finish(user.uid, dto.attemptId);
  }

  @Get('attempts/:attemptId')
  async getAttempt(
    @CurrentUser() user: CurrentUserData,
    @Param('attemptId') attemptId: string,
  ) {
    return this.simulationsService.getAttempt(user.uid, attemptId);
  }

  // Additional routes that match frontend expectations
  @Post(':attemptId/submit')
  async submitWithParam(
    @CurrentUser() user: CurrentUserData,
    @Param('attemptId') attemptId: string,
    @Body() body: { answers: any[] },
  ) {
    // Submit all answers at once (for quiz-style submission)
    return this.simulationsService.finish(user.uid, attemptId);
  }

  @Post(':attemptId/finish')
  async finishWithParam(
    @CurrentUser() user: CurrentUserData,
    @Param('attemptId') attemptId: string,
  ) {
    return this.simulationsService.finish(user.uid, attemptId);
  }
}
