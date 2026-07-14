import { Controller, Logger, UseFilters } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  type RmqContext,
} from '@nestjs/microservices';
import { SERVICE_NAMES, USERS_PING } from '@retail/contracts';
import type { PingRequestDto, PingResponseDto } from '@retail/contracts';
import { acknowledgeRmqMessage, RmqRetryFilter } from '@retail/messaging';

@Controller()
@UseFilters(RmqRetryFilter)
export class UsersMessagesController {
  private readonly logger = new Logger(UsersMessagesController.name);

  @MessagePattern(USERS_PING)
  ping(
    @Payload() payload: PingRequestDto & { correlationId?: string },
    @Ctx() context: RmqContext,
  ): PingResponseDto {
    this.logger.log({
      message: 'Handled users.ping',
      correlationId: payload.correlationId,
    });

    acknowledgeRmqMessage(context);

    return {
      service: SERVICE_NAMES.USERS,
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
