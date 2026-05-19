import { Module } from '@nestjs/common';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { WebpayService } from './webpay.service';

@Module({
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, WebpayService],
  exports: [SubscriptionsService, WebpayService],
})
export class SubscriptionsModule {}

