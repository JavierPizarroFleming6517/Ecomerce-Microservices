import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createNestPinoOptions, LoggerModule } from '@retail/logger';
import { AuthModule } from './auth/auth.module';
import { environmentValidationSchema } from './config/environment.validation';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProfilesModule } from './profiles/profiles.module';
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
      createNestPinoOptions({ serviceName: 'users-service' }),
    ),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProfilesModule,
    HealthModule,
  ],
})
export class AppModule {}
