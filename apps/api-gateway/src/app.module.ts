import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { createNestPinoOptions, LoggerModule } from '@retail/logger';

import { CorrelationIdInterceptor } from './common/correlation-id.interceptor';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { environmentValidationSchema } from './config/environment.validation';
import { HealthModule } from './health/health.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { RecommendationsModule } from './modules/recommendations/recommendations.module';
import { UsersModule } from './modules/users/users.module';

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
    UsersModule,
    CatalogModule,
    RecommendationsModule,
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
