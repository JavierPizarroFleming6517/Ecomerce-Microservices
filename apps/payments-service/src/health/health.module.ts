import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { PingController } from './ping.controller';

@Module({
  controllers: [HealthController, PingController],
})
export class HealthModule {}
