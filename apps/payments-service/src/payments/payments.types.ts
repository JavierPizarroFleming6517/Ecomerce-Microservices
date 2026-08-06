export type PaymentStatus =
  | 'created'
  | 'authorized'
  | 'failed'
  | 'cancelled'
  | 'unknown';

export interface StoredPayment {
  token: string;
  buyOrder: string;
  sessionId: string;
  amount: number;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  authorizationCode?: string;
  responseCode?: number;
  paymentTypeCode?: string;
  cardNumber?: string;
  rawCommit?: unknown;
}
