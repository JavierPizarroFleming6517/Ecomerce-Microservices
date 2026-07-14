import {
  Controller,
  Get,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Neo4jService } from '../neo4j/neo4j.service';

interface HealthResponse {
  status: 'ok';
  service: 'recommendations-service';
}

@Controller('health')
export class HealthController {
  constructor(private readonly neo4j: Neo4jService) {}

  @Get('live')
  live(): HealthResponse {
    return { status: 'ok', service: 'recommendations-service' };
  }

  @Get('ready')
  async ready(): Promise<HealthResponse> {
    try {
      await this.neo4j.verifyConnectivity();
      return { status: 'ok', service: 'recommendations-service' };
    } catch {
      throw new ServiceUnavailableException({
        status: 'unavailable',
        service: 'recommendations-service',
        dependency: 'neo4j',
      });
    }
  }
}
