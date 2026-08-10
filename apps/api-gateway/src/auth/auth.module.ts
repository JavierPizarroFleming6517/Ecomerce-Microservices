import { Module } from '@nestjs/common';

import { InternalHttpModule } from '../internal/internal-http.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [InternalHttpModule],
  controllers: [AuthController],
})
export class AuthModule {}
