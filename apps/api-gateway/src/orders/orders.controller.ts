import { Body, Controller, Get, Headers, Post, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBadGatewayResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type {
  CreateOrderRequestDto,
  ListOrdersResponseDto,
  OrderDto,
} from '@retail/contracts';
import type { Request } from 'express';

import { InternalHttpService } from '../internal/internal-http.service';

type CorrelatedRequest = Request & { correlationId?: string };

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  private readonly usersServiceUrl: string;

  constructor(
    private readonly http: InternalHttpService,
    config: ConfigService,
  ) {
    this.usersServiceUrl = config.getOrThrow<string>('USERS_SERVICE_URL');
  }

  @Get()
  @ApiOkResponse({ description: 'Orders for the authenticated user' })
  @ApiBadGatewayResponse({ description: 'Users service is unavailable' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  list(
    @Req() request: CorrelatedRequest,
    @Headers('authorization') authorization?: string,
  ): Promise<ListOrdersResponseDto> {
    return this.http.get(this.usersServiceUrl, '/orders', {
      headers: {
        'x-correlation-id': request.correlationId,
        authorization,
      },
    });
  }

  @Post()
  @ApiOkResponse({ description: 'Order created for the authenticated user' })
  @ApiBadGatewayResponse({ description: 'Users service is unavailable' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  create(
    @Req() request: CorrelatedRequest,
    @Headers('authorization') authorization?: string,
    @Body() body?: CreateOrderRequestDto,
  ): Promise<OrderDto> {
    return this.http.post(this.usersServiceUrl, '/orders', body, {
      headers: {
        'x-correlation-id': request.correlationId,
        authorization,
      },
    });
  }
}
