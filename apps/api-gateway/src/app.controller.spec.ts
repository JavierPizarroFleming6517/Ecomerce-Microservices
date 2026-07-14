import { Test, type TestingModule } from '@nestjs/testing';
import { HealthController } from './health/health.controller';

describe('HealthController', () => {
  let healthController: HealthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    healthController = app.get(HealthController);
  });

  it('reports the gateway as healthy', () => {
    expect(healthController.check()).toEqual(
      expect.objectContaining({
        status: 'ok',
        service: 'api-gateway',
      }),
    );
  });
});
