import { Module } from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { QuestionsModule } from '../questions/questions.module';

@Module({
  imports: [SubscriptionsModule, QuestionsModule],
  controllers: [QuizController],
  providers: [QuizService],
  exports: [QuizService],
})
export class QuizModule {}
