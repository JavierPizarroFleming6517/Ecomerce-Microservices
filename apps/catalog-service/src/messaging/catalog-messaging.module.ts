import { Module } from '@nestjs/common';
import { CatalogMessagingController } from './catalog-messaging.controller';

@Module({
  controllers: [CatalogMessagingController],
})
export class CatalogMessagingModule {}
