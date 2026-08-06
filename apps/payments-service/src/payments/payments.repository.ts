import { Injectable } from '@nestjs/common';
import type { PaymentStatus, StoredPayment } from './payments.types';

@Injectable()
export class PaymentsRepository {
  private readonly byToken = new Map<string, StoredPayment>();

  save(payment: StoredPayment): StoredPayment {
    this.byToken.set(payment.token, payment);
    return payment;
  }

  findByToken(token: string): StoredPayment | undefined {
    return this.byToken.get(token);
  }

  update(
    token: string,
    patch: Partial<StoredPayment> & { status: PaymentStatus },
  ): StoredPayment | undefined {
    const current = this.byToken.get(token);
    if (!current) {
      return undefined;
    }

    const next: StoredPayment = {
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    this.byToken.set(token, next);
    return next;
  }
}
