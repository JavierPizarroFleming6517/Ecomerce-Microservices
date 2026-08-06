import { type INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { type App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { TransbankService } from '../src/payments/transbank.service';

describe('Payments (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    process.env.PORT = '3004';
    process.env.TRANSBANK_ENVIRONMENT = 'integration';
    process.env.WEBPAY_RETURN_URL = 'http://localhost:5173/payments/result';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TransbankService)
      .useValue({
        create: jest.fn().mockResolvedValue({
          token: 'test-token',
          url: 'https://webpay3gint.transbank.cl/webpayserver/initTransaction',
        }),
        commit: jest.fn().mockResolvedValue({
          responseCode: 0,
          status: 'AUTHORIZED',
          buyOrder: 'ORD1',
          sessionId: 'SES1',
          amount: 1000,
          authorizationCode: '1213',
        }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  it('/health/live (GET)', () => {
    return request(app.getHttpServer())
      .get('/health/live')
      .expect(200)
      .expect({ status: 'ok', service: 'payments-service' });
  });

  it('/payments/transactions (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/payments/transactions')
      .send({ amount: 1000 })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        token: 'test-token',
        amount: 1000,
      }),
    );
  });

  afterEach(async () => {
    await app.close();
  });
});
