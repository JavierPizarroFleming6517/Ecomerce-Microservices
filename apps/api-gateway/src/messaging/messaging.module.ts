import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import {
  CATALOG_QUEUE,
  RECOMMENDATIONS_QUEUE,
  USERS_QUEUE,
} from '@retail/contracts';
import { createRmqClientOptions } from '@retail/messaging';

import {
  CATALOG_CLIENT,
  RECOMMENDATIONS_CLIENT,
  USERS_CLIENT,
} from './messaging.constants';
import { RpcClientService } from './rpc-client.service';

const createClient = (name: symbol, queue: string) => ({
  name,
  inject: [ConfigService],
  useFactory: (config: ConfigService) =>
    createRmqClientOptions({
      urls: config.getOrThrow<string>('RABBITMQ_URL'),
      queue,
      noAck: true,
      prefetchCount: 10,
      queueOptions: { durable: true },
    }),
});

@Module({
  imports: [
    ClientsModule.registerAsync([
      createClient(USERS_CLIENT, USERS_QUEUE),
      createClient(CATALOG_CLIENT, CATALOG_QUEUE),
      createClient(RECOMMENDATIONS_CLIENT, RECOMMENDATIONS_QUEUE),
    ]),
  ],
  providers: [RpcClientService],
  exports: [ClientsModule, RpcClientService],
})
export class MessagingModule {}
