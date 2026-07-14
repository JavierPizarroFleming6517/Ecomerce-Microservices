import { Controller, Get, Inject, Req } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
import { ApiBadGatewayResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CATALOG_PING } from '@retail/contracts';
import type { Request } from 'express';

import { CATALOG_CLIENT } from '../../messaging/messaging.constants';
import { RpcClientService } from '../../messaging/rpc-client.service';

type CorrelatedRequest = Request & { correlationId?: string };

@ApiTags('catalog')
@Controller('catalog')
export class CatalogController {
  constructor(
    @Inject(CATALOG_CLIENT) private readonly catalogClient: ClientProxy,
    private readonly rpcClient: RpcClientService,
  ) {}

  @Get('ping')
  @ApiOkResponse({ description: 'Catalog service response' })
  @ApiBadGatewayResponse({ description: 'Catalog service is unavailable' })
  ping(@Req() request: CorrelatedRequest): Promise<unknown> {
    return this.rpcClient.send(this.catalogClient, CATALOG_PING, {
      correlationId: request.correlationId,
    });
  }
}
