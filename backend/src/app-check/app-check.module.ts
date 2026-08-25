import { Module } from '@nestjs/common';
import { AppCheckController } from './app-check.controller';
import { AppCheckService } from './app-check.service';

@Module({
  controllers: [AppCheckController],
  providers: [AppCheckService],
})
export class AppCheckModule {}
