import { Module } from '@nestjs/common';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { FlowService } from './flow.service';
import { FlowWebhookController } from './flow-webhook.controller';

@Module({
  controllers: [SubscriptionsController, FlowWebhookController],
  providers: [SubscriptionsService, FlowService],
  exports: [SubscriptionsService, FlowService],
})
export class SubscriptionsModule {}
