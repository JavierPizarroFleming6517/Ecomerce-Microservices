import {
  Controller,
  Get,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { type Connection, ConnectionStates } from 'mongoose';

@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get('live')
  live() {
    return { status: 'ok' };
  }

  @Get('ready')
  ready() {
    const mongoReady = this.connection.readyState === ConnectionStates.connected;

    if (!mongoReady) {
      throw new ServiceUnavailableException({
        status: 'down',
        checks: { mongodb: 'down' },
      });
    }

    return {
      status: 'ok',
      checks: { mongodb: 'up' },
    };
  }
}
