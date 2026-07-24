import { Controller, Get, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBadGatewayResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { PingResponseDto } from '@retail/contracts';
import type { Request } from 'express';

import { InternalHttpService } from '../internal/internal-http.service';

type CorrelatedRequest = Request & { correlationId?: string };

@ApiTags('users')
@Controller('users')
export class UsersController {
  private readonly usersServiceUrl: string;

  constructor(
    private readonly http: InternalHttpService,
    config: ConfigService,
  ) {
    this.usersServiceUrl = config.getOrThrow<string>('USERS_SERVICE_URL');
  }

  @Get('ping')
  @ApiOkResponse({ description: 'Users service response' })
  @ApiBadGatewayResponse({ description: 'Users service is unavailable' })
  ping(@Req() request: CorrelatedRequest): Promise<PingResponseDto> {
    return this.http.get(this.usersServiceUrl, '/ping', {
      headers: { 'x-correlation-id': request.correlationId },
    });
  }
}
