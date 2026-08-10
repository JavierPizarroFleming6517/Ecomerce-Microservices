import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBadGatewayResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import type {
  CrossSellingRecommendationDto,
  PingResponseDto,
} from '@retail/contracts';
import type { Request } from 'express';

import { InternalHttpService } from '../internal/internal-http.service';

type CorrelatedRequest = Request & { correlationId?: string };

@ApiTags('recommendations')
@Controller('recommendations')
export class RecommendationsController {
  private readonly recommendationsServiceUrl: string;

  constructor(
    private readonly http: InternalHttpService,
    config: ConfigService,
  ) {
    this.recommendationsServiceUrl = config.getOrThrow<string>(
      'RECOMMENDATIONS_SERVICE_URL',
    );
  }

  @Get('ping')
  @ApiOkResponse({ description: 'Recommendations service response' })
  @ApiBadGatewayResponse({
    description: 'Recommendations service is unavailable',
  })
  ping(@Req() request: CorrelatedRequest): Promise<PingResponseDto> {
    return this.http.get(this.recommendationsServiceUrl, '/ping', {
      headers: { 'x-correlation-id': request.correlationId },
    });
  }

  @Get('cross-selling/:productId')
  @ApiOkResponse({ description: 'Neo4j cross-selling recommendations' })
  @ApiBadGatewayResponse({
    description: 'Recommendations service is unavailable',
  })
  getCrossSelling(
    @Req() request: CorrelatedRequest,
    @Param('productId') productId: string,
    @Query('limit') limit?: string,
  ): Promise<CrossSellingRecommendationDto[]> {
    return this.http.get(
      this.recommendationsServiceUrl,
      `/recommendations/cross-selling/${encodeURIComponent(productId)}`,
      {
        params: {
          limit: limit ? Number(limit) : undefined,
        },
        headers: { 'x-correlation-id': request.correlationId },
      },
    );
  }
}
