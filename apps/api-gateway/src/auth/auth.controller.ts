import { Body, Controller, Get, Headers, Post, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBadGatewayResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type {
  AuthSessionDto,
  AuthTokensDto,
  LoginRequestDto,
  LogoutRequestDto,
  RefreshRequestDto,
  RegisterRequestDto,
  UserMeDto,
} from '@retail/contracts';
import type { Request } from 'express';

import { InternalHttpService } from '../internal/internal-http.service';

type CorrelatedRequest = Request & { correlationId?: string };

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly usersServiceUrl: string;

  constructor(
    private readonly http: InternalHttpService,
    config: ConfigService,
  ) {
    this.usersServiceUrl = config.getOrThrow<string>('USERS_SERVICE_URL');
  }

  @Post('register')
  @ApiOkResponse({ description: 'User registered' })
  @ApiBadGatewayResponse({ description: 'Users service is unavailable' })
  register(
    @Req() request: CorrelatedRequest,
    @Body() body: RegisterRequestDto,
  ): Promise<AuthSessionDto> {
    return this.http.post(this.usersServiceUrl, '/auth/register', body, {
      headers: { 'x-correlation-id': request.correlationId },
    });
  }

  @Post('login')
  @ApiOkResponse({ description: 'User logged in' })
  @ApiBadGatewayResponse({ description: 'Users service is unavailable' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  login(
    @Req() request: CorrelatedRequest,
    @Body() body: LoginRequestDto,
  ): Promise<AuthSessionDto> {
    return this.http.post(this.usersServiceUrl, '/auth/login', body, {
      headers: { 'x-correlation-id': request.correlationId },
    });
  }

  @Post('refresh')
  @ApiOkResponse({ description: 'Tokens refreshed' })
  @ApiBadGatewayResponse({ description: 'Users service is unavailable' })
  @ApiUnauthorizedResponse({ description: 'Invalid refresh token' })
  refresh(
    @Req() request: CorrelatedRequest,
    @Body() body: RefreshRequestDto,
  ): Promise<AuthTokensDto> {
    return this.http.post(this.usersServiceUrl, '/auth/refresh', body, {
      headers: { 'x-correlation-id': request.correlationId },
    });
  }

  @Post('logout')
  @ApiOkResponse({ description: 'Refresh token revoked' })
  @ApiBadGatewayResponse({ description: 'Users service is unavailable' })
  logout(
    @Req() request: CorrelatedRequest,
    @Body() body: LogoutRequestDto,
  ): Promise<{ ok: true }> {
    return this.http.post(this.usersServiceUrl, '/auth/logout', body, {
      headers: { 'x-correlation-id': request.correlationId },
    });
  }

  @Get('me')
  @ApiOkResponse({ description: 'Current user profile' })
  @ApiBadGatewayResponse({ description: 'Users service is unavailable' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  me(
    @Req() request: CorrelatedRequest,
    @Headers('authorization') authorization?: string,
  ): Promise<UserMeDto> {
    return this.http.get(this.usersServiceUrl, '/auth/me', {
      headers: {
        'x-correlation-id': request.correlationId,
        authorization,
      },
    });
  }
}
