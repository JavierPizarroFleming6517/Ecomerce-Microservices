import { Module } from '@nestjs/common';

import { InternalHttpModule } from '../../internal/internal-http.module';
import { RecommendationsController } from './recommendations.controller';

@Module({
  imports: [InternalHttpModule],
  controllers: [RecommendationsController],
})
export class RecommendationsModule {}
