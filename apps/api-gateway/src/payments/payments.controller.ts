import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBadGatewayResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import type {
  CommitPaymentTransactionRequestDto,
  CommitPaymentTransactionResponseDto,
  CreatePaymentTransactionRequestDto,
  CreatePaymentTransactionResponseDto,
  PingResponseDto,
} from '@retail/contracts';
import type { Request } from 'express';

import { InternalHttpService } from '../internal/internal-http.service';

type CorrelatedRequest = Request & { correlationId?: string };

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  private readonly paymentsServiceUrl: string;

  constructor(
    private readonly http: InternalHttpService,
    config: ConfigService,
  ) {
    this.paymentsServiceUrl = config.getOrThrow<string>('PAYMENTS_SERVICE_URL');
  }

  @Get('ping')
  @ApiOkResponse({ description: 'Payments service response' })
  @ApiBadGatewayResponse({ description: 'Payments service is unavailable' })
  ping(@Req() request: CorrelatedRequest): Promise<PingResponseDto> {
    return this.http.get(this.paymentsServiceUrl, '/ping', {
      headers: { 'x-correlation-id': request.correlationId },
    });
  }

  @Post('transactions')
  @ApiOkResponse({ description: 'Webpay transaction created' })
  @ApiBadGatewayResponse({ description: 'Payments service is unavailable' })
  createTransaction(
    @Req() request: CorrelatedRequest,
    @Body() body: CreatePaymentTransactionRequestDto,
  ): Promise<CreatePaymentTransactionResponseDto> {
    return this.http.post(
      this.paymentsServiceUrl,
      '/payments/transactions',
      body,
      {
        headers: { 'x-correlation-id': request.correlationId },
      },
    );
  }

  @Post('transactions/commit')
  @ApiOkResponse({ description: 'Webpay transaction committed' })
  @ApiBadGatewayResponse({ description: 'Payments service is unavailable' })
  commitTransaction(
    @Req() request: CorrelatedRequest,
    @Body() body: CommitPaymentTransactionRequestDto,
  ): Promise<CommitPaymentTransactionResponseDto> {
    return this.http.post(
      this.paymentsServiceUrl,
      '/payments/transactions/commit',
      body,
      {
        headers: { 'x-correlation-id': request.correlationId },
      },
    );
  }

  @Get('transactions/:token')
  @ApiOkResponse({ description: 'Stored payment transaction' })
  @ApiBadGatewayResponse({ description: 'Payments service is unavailable' })
  getTransaction(
    @Req() request: CorrelatedRequest,
    @Param('token') token: string,
  ): Promise<unknown> {
    return this.http.get(
      this.paymentsServiceUrl,
      `/payments/transactions/${token}`,
      {
        headers: { 'x-correlation-id': request.correlationId },
      },
    );
  }
}
