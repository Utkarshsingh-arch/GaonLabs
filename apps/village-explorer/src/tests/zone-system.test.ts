import { describe, it, expect } from 'vitest';
import { eventBus } from '../game/eventBus';

describe('ZoneSystem and EventBus Integration Tests', () => {
  it('eventBus emits and receives zone events correctly', () => {
    let receivedZoneId = '';

    const listener = (data: { id: string }) => {
      receivedZoneId = data.id;
    };

    eventBus.on('zone:hover', listener);
    eventBus.emit('zone:hover', { id: 'farm', name: 'Agricultural Farm Lab' });

    expect(receivedZoneId).toBe('farm');
    eventBus.off('zone:hover', listener);
  });

  it('pauses and resumes scenes via lab events', () => {
    let isPaused = false;

    eventBus.on('lab:open', () => {
      isPaused = true;
    });

    eventBus.on('lab:close', () => {
      isPaused = false;
    });

    eventBus.emit('lab:open');
    expect(isPaused).toBe(true);

    eventBus.emit('lab:close');
    expect(isPaused).toBe(false);
  });
});
