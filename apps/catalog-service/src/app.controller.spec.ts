import { ServiceUnavailableException } from '@nestjs/common';
import { type Connection, ConnectionStates } from 'mongoose';
import { HealthController } from './health/health.controller';

describe('HealthController', () => {
  const connectionState = {
    readyState: ConnectionStates.connected,
  };
  const controller = new HealthController(
    connectionState as unknown as Connection,
  );

  it('reports liveness without dependencies', () => {
    expect(controller.live()).toEqual({ status: 'ok' });
  });

  it('reports readiness when MongoDB is connected', () => {
    expect(controller.ready()).toEqual({
      status: 'ok',
      checks: { mongodb: 'up' },
    });
  });

  it('rejects readiness when MongoDB is disconnected', () => {
    connectionState.readyState = ConnectionStates.disconnected;
    expect(() => controller.ready()).toThrow(ServiceUnavailableException);
    connectionState.readyState = ConnectionStates.connected;
  });
});
