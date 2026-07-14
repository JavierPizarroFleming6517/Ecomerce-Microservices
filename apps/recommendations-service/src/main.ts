import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { MicroserviceOptions } from '@nestjs/microservices';
import { PinoLogger } from '@retail/logger';
import { assertDeadLetterQueue, createRmqOptions } from '@retail/messaging';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(PinoLogger));
  const config = app.get(ConfigService);
  const rabbitmqUrl = config.getOrThrow<string>('RABBITMQ_URL');
  const queue = config.getOrThrow<string>('RABBITMQ_QUEUE');

  await assertDeadLetterQueue(rabbitmqUrl, queue);

  app.connectMicroservice<MicroserviceOptions>(
    createRmqOptions({
      urls: rabbitmqUrl,
      queue,
      prefetchCount: config.getOrThrow<number>('RABBITMQ_PREFETCH'),
    }),
  );

  await app.startAllMicroservices();
  await app.listen(config.getOrThrow<number>('PORT'));
}

void bootstrap();
