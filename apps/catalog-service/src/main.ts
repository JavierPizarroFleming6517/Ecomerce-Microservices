import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { PinoLogger } from '@retail/logger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(PinoLogger));
  const config = app.get(ConfigService);

  app.enableShutdownHooks();
  await app.listen(config.getOrThrow<number>('PORT'));
}

void bootstrap();
