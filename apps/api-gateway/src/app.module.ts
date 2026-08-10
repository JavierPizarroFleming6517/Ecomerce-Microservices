import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { createNestPinoOptions, LoggerModule } from '@retail/logger';

import { AuthModule } from './auth/auth.module';
import { CorrelationIdInterceptor } from './common/correlation-id.interceptor';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { environmentValidationSchema } from './config/environment.validation';
import { HealthModule } from './health/health.module';
import { CatalogModule } from './catalog/catalog.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: environmentValidationSchema,
      validationOptions: { abortEarly: false },
    }),
    LoggerModule.forRoot(
      createNestPinoOptions({ serviceName: 'api-gateway' }),
    ),
    HealthModule,
    AuthModule,
    UsersModule,
    OrdersModule,
    CatalogModule,
    RecommendationsModule,
    PaymentsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CorrelationIdInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
