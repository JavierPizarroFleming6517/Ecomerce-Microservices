import { Controller, Get } from '@nestjs/common';
import { SERVICE_NAMES } from '@retail/contracts';
import type { PingResponseDto } from '@retail/contracts';

@Controller()
export class PingController {
  @Get('ping')
  ping(): PingResponseDto {
    return {
      service: SERVICE_NAMES.CATALOG,
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
