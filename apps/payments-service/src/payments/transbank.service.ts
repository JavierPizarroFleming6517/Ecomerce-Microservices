import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Environment,
  IntegrationApiKeys,
  IntegrationCommerceCodes,
  Options,
  WebpayPlus,
} from 'transbank-sdk';

export interface WebpayCreateResult {
  token: string;
  url: string;
}

export interface WebpayCommitResult {
  vci?: string;
  amount?: number;
  status?: string;
  buyOrder?: string;
  sessionId?: string;
  cardDetail?: { card_number?: string };
  accountingDate?: string;
  transactionDate?: string;
  authorizationCode?: string;
  paymentTypeCode?: string;
  responseCode?: number;
  installmentsNumber?: number;
}

@Injectable()
export class TransbankService {
  private readonly logger = new Logger(TransbankService.name);
  private readonly transaction: InstanceType<typeof WebpayPlus.Transaction>;

  constructor(private readonly config: ConfigService) {
    const environment = config.getOrThrow<string>('TRANSBANK_ENVIRONMENT');
    const isProduction = environment === 'production';

    const commerceCode = isProduction
      ? config.getOrThrow<string>('TRANSBANK_COMMERCE_CODE')
      : IntegrationCommerceCodes.WEBPAY_PLUS;
    const apiKey = isProduction
      ? config.getOrThrow<string>('TRANSBANK_API_KEY')
      : IntegrationApiKeys.WEBPAY;
    const sdkEnvironment = isProduction
      ? Environment.Production
      : Environment.Integration;

    this.transaction = new WebpayPlus.Transaction(
      new Options(commerceCode, apiKey, sdkEnvironment),
    );

    this.logger.log({
      message: 'Transbank Webpay Plus configured',
      environment,
    });
  }

  create(
    buyOrder: string,
    sessionId: string,
    amount: number,
    returnUrl: string,
  ): Promise<WebpayCreateResult> {
    return this.transaction.create(buyOrder, sessionId, amount, returnUrl);
  }

  commit(token: string): Promise<WebpayCommitResult> {
    return this.transaction.commit(token);
  }
}
