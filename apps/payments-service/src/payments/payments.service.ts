import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'node:crypto';
import type { CreateTransactionDto } from './dto/payments.dto';
import { PaymentsRepository } from './payments.repository';
import type { PaymentStatus, StoredPayment } from './payments.types';
import { TransbankService } from './transbank.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly payments: PaymentsRepository,
    private readonly transbank: TransbankService,
    private readonly config: ConfigService,
  ) {}

  async createTransaction(input: CreateTransactionDto) {
    const buyOrder = input.buyOrder ?? this.buildBuyOrder();
    const sessionId = input.sessionId ?? this.buildSessionId();
    const returnUrl =
      input.returnUrl ??
      this.config.getOrThrow<string>('WEBPAY_RETURN_URL');

    const created = await this.transbank.create(
      buyOrder,
      sessionId,
      input.amount,
      returnUrl,
    );

    const now = new Date().toISOString();
    this.payments.save({
      token: created.token,
      buyOrder,
      sessionId,
      amount: input.amount,
      status: 'created',
      createdAt: now,
      updatedAt: now,
    });

    this.logger.log({
      message: 'Webpay transaction created',
      buyOrder,
      amount: input.amount,
    });

    return {
      token: created.token,
      url: created.url,
      buyOrder,
      sessionId,
      amount: input.amount,
    };
  }

  async commitTransaction(token: string) {
    if (!token?.trim()) {
      throw new BadRequestException('token is required');
    }

    const existing = this.payments.findByToken(token);
    const commit = await this.transbank.commit(token);
    const status = this.mapStatus(commit.responseCode, commit.status);

    const patch: Partial<StoredPayment> & { status: PaymentStatus } = {
      status,
      rawCommit: commit,
    };
    if (commit.authorizationCode !== undefined) {
      patch.authorizationCode = commit.authorizationCode;
    }
    if (commit.responseCode !== undefined) {
      patch.responseCode = commit.responseCode;
    }
    if (commit.paymentTypeCode !== undefined) {
      patch.paymentTypeCode = commit.paymentTypeCode;
    }
    if (commit.cardDetail?.card_number !== undefined) {
      patch.cardNumber = commit.cardDetail.card_number;
    }

    const stored =
      this.payments.update(token, patch) ??
      this.payments.save({
        token,
        buyOrder: commit.buyOrder ?? existing?.buyOrder ?? 'unknown',
        sessionId: commit.sessionId ?? existing?.sessionId ?? 'unknown',
        amount: commit.amount ?? existing?.amount ?? 0,
        createdAt: existing?.createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...patch,
      });

    this.logger.log({
      message: 'Webpay transaction committed',
      buyOrder: stored.buyOrder,
      status: stored.status,
      responseCode: stored.responseCode,
    });

    return {
      token: stored.token,
      buyOrder: stored.buyOrder,
      sessionId: stored.sessionId,
      amount: stored.amount,
      status: stored.status,
      authorizationCode: stored.authorizationCode,
      responseCode: stored.responseCode,
      paymentTypeCode: stored.paymentTypeCode,
      cardNumber: stored.cardNumber,
      transactionDate:
        typeof commit.transactionDate === 'string'
          ? commit.transactionDate
          : undefined,
    };
  }

  getTransaction(token: string): StoredPayment {
    const payment = this.payments.findByToken(token);
    if (!payment) {
      throw new NotFoundException(`Payment not found for token ${token}`);
    }
    return payment;
  }

  private mapStatus(
    responseCode: number | undefined,
    rawStatus: string | undefined,
  ): PaymentStatus {
    if (responseCode === 0 || rawStatus === 'AUTHORIZED') {
      return 'authorized';
    }
    if (rawStatus === 'FAILED') {
      return 'failed';
    }
    if (rawStatus === 'INITIALIZED' || rawStatus === 'CREATED') {
      return 'created';
    }
    return 'unknown';
  }

  private buildBuyOrder(): string {
    return `ORD${Date.now().toString().slice(-10)}${randomBytes(2).toString('hex')}`.slice(
      0,
      26,
    );
  }

  private buildSessionId(): string {
    return `SES${randomBytes(8).toString('hex')}`;
  }
}
