export interface IdempotencyStore {
  /** Returns true when the message id has already been processed. */
  hasProcessed(messageId: string): boolean;
  /** Marks a message id as processed. */
  markProcessed(messageId: string): void;
}

export interface IdempotencyStoreOptions {
  /** Maximum number of message ids to remember. Oldest entries are evicted first. */
  maxEntries?: number;
}

/**
 * Bounded in-memory idempotency guard for RMQ command/event handlers.
 *
 * This is a process-local, best-effort guard suitable for de-duplicating
 * retried deliveries within a single consumer instance. Services that run
 * multiple replicas or need durable idempotency guarantees should back this
 * with a shared store (e.g. a unique constraint in their own database) once
 * real command/event handlers are implemented.
 */
export function createIdempotencyStore(
  options: IdempotencyStoreOptions = {},
): IdempotencyStore {
  const maxEntries = options.maxEntries ?? 10_000;
  const seen = new Set<string>();

  return {
    hasProcessed(messageId: string): boolean {
      return seen.has(messageId);
    },
    markProcessed(messageId: string): void {
      if (seen.size >= maxEntries) {
        const oldest = seen.values().next().value;
        if (oldest !== undefined) {
          seen.delete(oldest);
        }
      }

      seen.add(messageId);
    },
  };
}
