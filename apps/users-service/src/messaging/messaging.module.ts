import { Module } from '@nestjs/common';
import { UsersMessagesController } from './users-messages.controller';

@Module({
  controllers: [UsersMessagesController],
})
export class MessagingModule {}
