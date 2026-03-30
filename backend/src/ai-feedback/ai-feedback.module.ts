import { Module } from '@nestjs/common';
import { AiFeedbackController } from './ai-feedback.controller';
import { AiFeedbackService } from './ai-feedback.service';
import { QuestionsModule } from '../questions/questions.module';

@Module({
  imports: [QuestionsModule],
  controllers: [AiFeedbackController],
  providers: [AiFeedbackService],
  exports: [AiFeedbackService],
})
export class AiFeedbackModule {}
