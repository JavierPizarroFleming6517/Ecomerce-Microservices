export const MESSAGE_ENVELOPE_VERSION = '1.0' as const;

export type MessageEnvelopeVersion = typeof MESSAGE_ENVELOPE_VERSION;

export interface MessageMetadata {
  correlationId?: string;
  causationId?: string;
  source?: string;
}

export interface MessageEnvelope<TPayload = unknown> {
  id: string;
  version: MessageEnvelopeVersion;
  occurredAt: string;
  payload: TPayload;
  metadata?: MessageMetadata;
}
