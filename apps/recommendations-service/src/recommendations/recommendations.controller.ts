import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { SERVICE_NAMES } from '@retail/contracts';
import type { PingResponseDto } from '@retail/contracts';
import { RecommendationsService } from './recommendations.service';

@Controller()
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @Get('ping')
  ping(): PingResponseDto {
    return {
      service: SERVICE_NAMES.RECOMMENDATIONS,
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('recommendations/cross-selling/:productId')
  getCrossSelling(
    @Param('productId') productId: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.recommendationsService.getCrossSelling(productId, limit);
  }
}
