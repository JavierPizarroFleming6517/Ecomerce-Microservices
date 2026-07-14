import { Controller, Logger, UseFilters } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  type RmqContext,
} from '@nestjs/microservices';
import { RECOMMENDATIONS_PING, SERVICE_NAMES } from '@retail/contracts';
import type { PingRequestDto, PingResponseDto } from '@retail/contracts';
import { acknowledgeRmqMessage, RmqRetryFilter } from '@retail/messaging';

@Controller()
@UseFilters(RmqRetryFilter)
export class RecommendationsMessagesController {
  private readonly logger = new Logger(RecommendationsMessagesController.name);

  @MessagePattern(RECOMMENDATIONS_PING)
  ping(
    @Payload() payload: PingRequestDto & { correlationId?: string },
    @Ctx() context: RmqContext,
  ): PingResponseDto {
    this.logger.log({
      message: 'Handled recommendations.ping',
      correlationId: payload.correlationId,
    });

    acknowledgeRmqMessage(context);

    return {
      service: SERVICE_NAMES.RECOMMENDATIONS,
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
