import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createNestPinoOptions, LoggerModule } from '@retail/logger';
import { environmentValidationSchema } from './config/environment.validation';
import { HealthModule } from './health/health.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: environmentValidationSchema,
      validationOptions: { abortEarly: false },
    }),
    LoggerModule.forRoot(
      createNestPinoOptions({ serviceName: 'payments-service' }),
    ),
    PaymentsModule,
    HealthModule,
  ],
})
export class AppModule {}
