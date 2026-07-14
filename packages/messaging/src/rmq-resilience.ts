import { connect } from 'amqplib';
import {
  Catch,
  Logger,
  type ArgumentsHost,
  type ExceptionFilter,
} from '@nestjs/common';
import type { RmqContext } from '@nestjs/microservices';

import { getDeadLetterQueueName } from './rmq-options';

export const DEFAULT_MAX_RMQ_RETRIES = 3;

interface DeathHeader {
  count?: number;
  queue?: string;
}

function getRetryCount(context: RmqContext): number {
  const message = context.getMessage();
  const deaths = message.properties.headers?.['x-death'] as
    | DeathHeader[]
    | undefined;

  if (!deaths || deaths.length === 0) {
    return 0;
  }

  return deaths.reduce((total, death) => total + (death.count ?? 1), 0);
}

/**
 * Declares the dead-letter queue for a consumer queue so that messages
 * rejected without requeue (after exhausting retries) land somewhere
 * durable instead of being silently dropped by the broker.
 */
export async function assertDeadLetterQueue(
  url: string,
  queue: string,
): Promise<void> {
  const connection = await connect(url);
  try {
    const channel = await connection.createChannel();
    try {
      await channel.assertQueue(getDeadLetterQueueName(queue), {
        durable: true,
      });
    } finally {
      await channel.close();
    }
  } finally {
    await connection.close();
  }
}

/**
 * Retries a failed RMQ message up to `maxRetries` times (using the
 * broker's `x-death` header as the attempt counter) before rejecting it
 * without requeue, which routes it to the queue's dead-letter queue.
 */
@Catch()
export class RmqRetryFilter implements ExceptionFilter {
  private readonly logger = new Logger(RmqRetryFilter.name);
  // No-arg constructor by design: Nest instantiates filters passed by class
  // reference (`@UseFilters(RmqRetryFilter)`) through its DI container, and
  // a constructor parameter without an explicit type annotation reflects as
  // `Object` in `design:paramtypes`, which Nest cannot resolve a provider
  // for. Use `withMaxRetries()` to get a pre-configured instance instead.
  private maxRetries: number = DEFAULT_MAX_RMQ_RETRIES;

  static withMaxRetries(maxRetries: number): RmqRetryFilter {
    const filter = new RmqRetryFilter();
    filter.maxRetries = maxRetries;
    return filter;
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToRpc().getContext<RmqContext>();
    const channel = context.getChannelRef();
    const message = context.getMessage();
    const pattern = context.getPattern();
    const attempt = getRetryCount(context) + 1;
    const shouldRetry = attempt <= this.maxRetries;

    this.logger.warn(
      `Message on pattern "${pattern}" failed (attempt ${attempt}/${this.maxRetries}): ${
        exception instanceof Error ? exception.message : String(exception)
      }`,
    );

    channel.nack(message, false, shouldRetry);
  }
}
