import EventEmitter from 'events';
import { EventEnvelope } from '@gaonlab/shared-types';
import { logger } from '../utils/logger';

export class DomainEventBus extends EventEmitter {
  private static instance: DomainEventBus;

  private constructor() {
    super();
    this.setMaxListeners(50);
  }

  public static getInstance(): DomainEventBus {
    if (!DomainEventBus.instance) {
      DomainEventBus.instance = new DomainEventBus();
    }
    return DomainEventBus.instance;
  }

  public publish<T = Record<string, unknown>>(envelope: EventEnvelope<T>): void {
    logger.debug('Publishing domain event', {
      type: envelope.type,
      eventId: envelope.eventId,
      learnerId: envelope.learnerId,
    });
    this.emit(envelope.type, envelope);
    this.emit('*', envelope);
  }

  public subscribe<T = Record<string, unknown>>(
    eventType: string,
    handler: (event: EventEnvelope<T>) => void | Promise<void>
  ): void {
    this.on(eventType, async (event: EventEnvelope<T>) => {
      try {
        await handler(event);
      } catch (err: any) {
        logger.error(`Error in event handler for ${eventType}`, {
          eventId: event.eventId,
          error: err?.message,
        });
      }
    });
  }
}

export const eventBus = DomainEventBus.getInstance();
