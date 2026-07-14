import { Module } from '@nestjs/common';

import { MessagingModule } from '../../messaging/messaging.module';
import { CatalogController } from './catalog.controller';

@Module({
  imports: [MessagingModule],
  controllers: [CatalogController],
})
export class CatalogModule {}
