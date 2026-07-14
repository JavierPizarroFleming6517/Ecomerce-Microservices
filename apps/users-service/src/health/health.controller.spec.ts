import { ServiceUnavailableException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  const prisma = { isReady: jest.fn() };
  let controller: HealthController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: PrismaService, useValue: prisma }],
    }).compile();

    controller = moduleRef.get(HealthController);
    prisma.isReady.mockReset();
  });

  it('reports liveness without querying dependencies', () => {
    expect(controller.live()).toEqual({
      status: 'ok',
      service: 'users-service',
    });
    expect(prisma.isReady).not.toHaveBeenCalled();
  });

  it('reports readiness when Prisma responds', async () => {
    prisma.isReady.mockResolvedValue(true);

    await expect(controller.ready()).resolves.toEqual({
      status: 'ok',
      service: 'users-service',
    });
  });

  it('rejects readiness when Prisma is unavailable', async () => {
    prisma.isReady.mockResolvedValue(false);

    await expect(controller.ready()).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });
});
