import { Controller, Logger, UseFilters } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  type RmqContext,
} from '@nestjs/microservices';
import { CATALOG_PING, SERVICE_NAMES } from '@retail/contracts';
import type { PingRequestDto, PingResponseDto } from '@retail/contracts';
import { acknowledgeRmqMessage, RmqRetryFilter } from '@retail/messaging';

@Controller()
@UseFilters(RmqRetryFilter)
export class CatalogMessagingController {
  private readonly logger = new Logger(CatalogMessagingController.name);

  @MessagePattern(CATALOG_PING)
  ping(
    @Payload() payload: PingRequestDto & { correlationId?: string },
    @Ctx() context: RmqContext,
  ): PingResponseDto {
    this.logger.log({
      message: 'Handled catalog.ping',
      correlationId: payload.correlationId,
    });

    acknowledgeRmqMessage(context);

    return {
      service: SERVICE_NAMES.CATALOG,
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
