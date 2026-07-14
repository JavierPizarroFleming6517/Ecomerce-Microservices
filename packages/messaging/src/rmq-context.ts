import type { Channel, ConsumeMessage } from 'amqplib';
import type { RmqContext } from '@nestjs/microservices';

export function acknowledgeRmqMessage(context: RmqContext): void {
  const channel = context.getChannelRef() as Channel;
  const message = context.getMessage() as ConsumeMessage;

  channel.ack(message);
}

export function rejectRmqMessage(
  context: RmqContext,
  requeue = false,
): void {
  const channel = context.getChannelRef() as Channel;
  const message = context.getMessage() as ConsumeMessage;

  channel.nack(message, false, requeue);
}
