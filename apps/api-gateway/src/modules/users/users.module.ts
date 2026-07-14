import { Module } from '@nestjs/common';

import { MessagingModule } from '../../messaging/messaging.module';
import { UsersController } from './users.controller';

@Module({
  imports: [MessagingModule],
  controllers: [UsersController],
})
export class UsersModule {}
