import { Module } from '@nestjs/common';
import { GraphModule } from '../graph/graph.module';
import { RecommendationsController } from './recommendations.controller';
import { RecommendationsMessagesController } from './recommendations.messages.controller';
import { RecommendationsService } from './recommendations.service';

@Module({
  imports: [GraphModule],
  controllers: [
    RecommendationsController,
    RecommendationsMessagesController,
  ],
  providers: [RecommendationsService],
})
export class RecommendationsModule {}
