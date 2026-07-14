import { Test, type TestingModule } from '@nestjs/testing';
import { Neo4jService } from './neo4j/neo4j.service';
import { HealthController } from './health/health.controller';

describe('HealthController', () => {
  let healthController: HealthController;
  const neo4j = {
    verifyConnectivity: jest.fn(async (): Promise<void> => undefined),
  };

  beforeEach(async () => {
    neo4j.verifyConnectivity.mockResolvedValue(undefined);

    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: Neo4jService, useValue: neo4j }],
    }).compile();

    healthController = app.get(HealthController);
  });

  it('reports the process as live', () => {
    expect(healthController.live()).toEqual({
      status: 'ok',
      service: 'recommendations-service',
    });
  });

  it('checks Neo4j readiness', async () => {
    await expect(healthController.ready()).resolves.toEqual({
      status: 'ok',
      service: 'recommendations-service',
    });
    expect(neo4j.verifyConnectivity).toHaveBeenCalledTimes(1);
  });
});
