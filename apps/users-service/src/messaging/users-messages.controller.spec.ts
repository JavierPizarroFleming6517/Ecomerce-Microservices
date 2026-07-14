import { type RmqContext } from '@nestjs/microservices';
import { UsersMessagesController } from './users-messages.controller';

describe('UsersMessagesController', () => {
  it('responds to ping and acknowledges the message', () => {
    const ack = jest.fn();
    const message = {};
    const context = {
      getChannelRef: () => ({ ack }),
      getMessage: () => message,
    } as unknown as RmqContext;

    const response = new UsersMessagesController().ping(
      { correlationId: 'test-correlation-id' },
      context,
    );

    expect(response).toMatchObject({ status: 'ok', service: 'users' });
    expect(response.timestamp).toEqual(expect.any(String));
    expect(ack).toHaveBeenCalledWith(message);
  });
});
