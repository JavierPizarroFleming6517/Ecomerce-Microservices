import { Module } from '@nestjs/common';

import { MessagingModule } from '../../messaging/messaging.module';
import { RecommendationsController } from './recommendations.controller';

@Module({
  imports: [MessagingModule],
  controllers: [RecommendationsController],
})
export class RecommendationsModule {}
