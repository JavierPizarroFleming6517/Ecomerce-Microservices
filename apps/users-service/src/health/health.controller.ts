import {
  Controller,
  Get,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface HealthResponse {
  status: 'ok';
  service: 'users-service';
}

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('live')
  live(): HealthResponse {
    return { status: 'ok', service: 'users-service' };
  }

  @Get('ready')
  async ready(): Promise<HealthResponse> {
    if (!(await this.prisma.isReady())) {
      throw new ServiceUnavailableException({
        status: 'error',
        service: 'users-service',
        checks: { database: 'down' },
      });
    }

    return { status: 'ok', service: 'users-service' };
  }
}
