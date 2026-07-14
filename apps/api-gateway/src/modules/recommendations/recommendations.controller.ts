import { Controller, Get, Inject, Req } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
import { ApiBadGatewayResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RECOMMENDATIONS_PING } from '@retail/contracts';
import type { Request } from 'express';

import { RECOMMENDATIONS_CLIENT } from '../../messaging/messaging.constants';
import { RpcClientService } from '../../messaging/rpc-client.service';

type CorrelatedRequest = Request & { correlationId?: string };

@ApiTags('recommendations')
@Controller('recommendations')
export class RecommendationsController {
  constructor(
    @Inject(RECOMMENDATIONS_CLIENT)
    private readonly recommendationsClient: ClientProxy,
    private readonly rpcClient: RpcClientService,
  ) {}

  @Get('ping')
  @ApiOkResponse({ description: 'Recommendations service response' })
  @ApiBadGatewayResponse({
    description: 'Recommendations service is unavailable',
  })
  ping(@Req() request: CorrelatedRequest): Promise<unknown> {
    return this.rpcClient.send(
      this.recommendationsClient,
      RECOMMENDATIONS_PING,
      { correlationId: request.correlationId },
    );
  }
}
