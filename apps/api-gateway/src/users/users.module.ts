import { Module } from '@nestjs/common';

import { InternalHttpModule } from '../internal/internal-http.module';
import { UsersController } from './users.controller';

@Module({
  imports: [InternalHttpModule],
  controllers: [UsersController],
})
export class UsersModule {}
