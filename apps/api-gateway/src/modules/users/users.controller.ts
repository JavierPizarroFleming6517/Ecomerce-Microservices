import { Controller, Get, Inject, Req } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
import { ApiBadGatewayResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { USERS_PING } from '@retail/contracts';
import type { Request } from 'express';

import { USERS_CLIENT } from '../../messaging/messaging.constants';
import { RpcClientService } from '../../messaging/rpc-client.service';

type CorrelatedRequest = Request & { correlationId?: string };

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    @Inject(USERS_CLIENT) private readonly usersClient: ClientProxy,
    private readonly rpcClient: RpcClientService,
  ) {}

  @Get('ping')
  @ApiOkResponse({ description: 'Users service response' })
  @ApiBadGatewayResponse({ description: 'Users service is unavailable' })
  ping(@Req() request: CorrelatedRequest): Promise<unknown> {
    return this.rpcClient.send(this.usersClient, USERS_PING, {
      correlationId: request.correlationId,
    });
  }
}
