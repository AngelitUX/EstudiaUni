import { Module } from '@nestjs/common';
import { ModulesContentController } from './modules-content.controller';
import { ModulesContentService } from './modules-content.service';

@Module({
  controllers: [ModulesContentController],
  providers: [ModulesContentService],
  exports: [ModulesContentService],
})
export class ModulesContentModule {}
