export interface CreatePaymentTransactionRequestDto {
  amount: number;
  buyOrder?: string;
  sessionId?: string;
  returnUrl?: string;
}

export interface CreatePaymentTransactionResponseDto {
  token: string;
  url: string;
  buyOrder: string;
  sessionId: string;
  amount: number;
}

export interface CommitPaymentTransactionRequestDto {
  token: string;
}

export interface CommitPaymentTransactionResponseDto {
  token: string;
  buyOrder: string;
  sessionId: string;
  amount: number;
  status: string;
  authorizationCode?: string;
  responseCode?: number;
  paymentTypeCode?: string;
  cardNumber?: string;
  transactionDate?: string;
}
