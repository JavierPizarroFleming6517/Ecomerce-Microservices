import { type RmqContext } from '@nestjs/microservices';
import { CatalogMessagingController } from './catalog-messaging.controller';

describe('CatalogMessagingController', () => {
  it('acknowledges CATALOG_PING messages manually', () => {
    const ack = jest.fn();
    const message = {};
    const context = {
      getChannelRef: () => ({ ack }),
      getMessage: () => message,
    } as unknown as RmqContext;

    const response = new CatalogMessagingController().ping(
      { correlationId: 'test-correlation-id' },
      context,
    );

    expect(ack).toHaveBeenCalledWith(message);
    expect(response).toMatchObject({
      service: 'catalog',
      status: 'ok',
    });
    expect(typeof response.timestamp).toBe('string');
  });
});
