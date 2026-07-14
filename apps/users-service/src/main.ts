import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { RmqOptions } from '@nestjs/microservices';
import { PinoLogger } from '@retail/logger';
import { assertDeadLetterQueue, createRmqOptions } from '@retail/messaging';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(PinoLogger));
  const config = app.get(ConfigService);
  const port = config.getOrThrow<number>('PORT');
  const queue = config.getOrThrow<string>('RABBITMQ_QUEUE');
  const rabbitmqUrl = config.getOrThrow<string>('RABBITMQ_URL');
  const prefetchCount = config.getOrThrow<number>('RABBITMQ_PREFETCH');

  await assertDeadLetterQueue(rabbitmqUrl, queue);

  app.enableShutdownHooks();
  app.connectMicroservice<RmqOptions>(
    createRmqOptions({ urls: rabbitmqUrl, queue, prefetchCount }),
    { inheritAppConfig: true },
  );

  await app.startAllMicroservices();
  await app.listen(port, '127.0.0.1');
}

void bootstrap();
