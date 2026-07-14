import { Transport, type RmqOptions } from '@nestjs/microservices';

export interface RetailRmqOptions {
  urls: string | readonly string[];
  queue: string;
  queueOptions?: {
    durable?: boolean;
    arguments?: Record<string, unknown>;
  };
  prefetchCount?: number;
  noAck?: boolean;
  /**
   * When true (default for consumer queues), the queue is declared with a
   * dead-letter routing key pointing at `${queue}.dlq` on the default
   * exchange. Callers acting purely as RPC clients (ephemeral reply queues)
   * should pass `false`.
   */
  deadLetter?: boolean;
}

export function getDeadLetterQueueName(queue: string): string {
  return `${queue}.dlq`;
}

export function createRmqOptions(options: RetailRmqOptions): RmqOptions {
  const urls =
    typeof options.urls === 'string' ? [options.urls] : [...options.urls];

  if (urls.length === 0) {
    throw new Error('At least one RabbitMQ URL is required.');
  }

  const deadLetterArguments =
    options.deadLetter === false
      ? {}
      : {
          'x-dead-letter-exchange': '',
          'x-dead-letter-routing-key': getDeadLetterQueueName(options.queue),
        };

  return {
    transport: Transport.RMQ,
    options: {
      urls,
      queue: options.queue,
      queueOptions: {
        durable: true,
        ...options.queueOptions,
        arguments: {
          ...deadLetterArguments,
          ...options.queueOptions?.arguments,
        },
      },
      prefetchCount: options.prefetchCount ?? 10,
      noAck: options.noAck ?? false,
    },
  };
}

export const createRmqClientOptions = createRmqOptions;
