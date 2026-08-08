import { Module } from '@nestjs/common';
import { AiFeedbackController } from './ai-feedback.controller';
import { AiFeedbackService } from './ai-feedback.service';
import { QuestionsModule } from '../questions/questions.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
  imports: [QuestionsModule, SubscriptionsModule],
  controllers: [AiFeedbackController],
  providers: [AiFeedbackService],
  exports: [AiFeedbackService],
})
export class AiFeedbackModule {}
