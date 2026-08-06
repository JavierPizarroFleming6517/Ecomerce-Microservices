import { PaymentsRepository } from './payments.repository';

describe('PaymentsRepository', () => {
  it('stores and retrieves payments by token', () => {
    const repository = new PaymentsRepository();
    const now = new Date().toISOString();

    repository.save({
      token: 'token-1',
      buyOrder: 'ORD1',
      sessionId: 'SES1',
      amount: 1500,
      status: 'created',
      createdAt: now,
      updatedAt: now,
    });

    expect(repository.findByToken('token-1')?.buyOrder).toBe('ORD1');
    expect(
      repository.update('token-1', {
        status: 'authorized',
        authorizationCode: '1234',
      })?.authorizationCode,
    ).toBe('1234');
  });
});
