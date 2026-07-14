import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

interface HealthResponse {
  status: 'ok';
  service: 'api-gateway';
  timestamp: string;
}

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOkResponse({ description: 'The API gateway is running' })
  check(): HealthResponse {
    return this.status();
  }

  @Get('live')
  @ApiOkResponse({ description: 'The API gateway process is running' })
  live(): HealthResponse {
    return this.status();
  }

  @Get('ready')
  @ApiOkResponse({ description: 'The API gateway is ready to accept traffic' })
  ready(): HealthResponse {
    return this.status();
  }

  private status(): HealthResponse {
    return {
      status: 'ok',
      service: 'api-gateway',
      timestamp: new Date().toISOString(),
    };
  }
}
