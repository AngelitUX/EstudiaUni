import { Module } from '@nestjs/common';
import { SimulationsController } from './simulations.controller';
import { SimulationsService } from './simulations.service';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { QuestionsModule } from '../questions/questions.module';

@Module({
  imports: [SubscriptionsModule, QuestionsModule],
  controllers: [SimulationsController],
  providers: [SimulationsService],
  exports: [SimulationsService],
})
export class SimulationsModule {}
