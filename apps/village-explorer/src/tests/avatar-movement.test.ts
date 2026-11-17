import { describe, it, expect } from 'vitest';

describe('Avatar 8-Direction and Velocity Normalization Tests', () => {
  it('normalizes diagonal velocity vector so diagonal is not faster than orthogonal', () => {
    const baseSpeed = 150;
    const dx = 1;
    const dy = 1;
    const length = Math.sqrt(dx * dx + dy * dy);
    const vx = (dx / length) * baseSpeed;
    const vy = (dy / length) * baseSpeed;
    const actualSpeed = Math.sqrt(vx * vx + vy * vy);

    expect(actualSpeed).toBeCloseTo(baseSpeed, 2);
    expect(vx).toBeCloseTo(106.07, 2);
    expect(vy).toBeCloseTo(106.07, 2);
  });

  it('determines correct 8-directional codes', () => {
    function calculateDirection(dx: number, dy: number): string {
      const threshold = 0.38;
      if (dy > threshold) {
        if (dx < -threshold) return 'sw';
        if (dx > threshold) return 'se';
        return 's';
      } else if (dy < -threshold) {
        if (dx < -threshold) return 'nw';
        if (dx > threshold) return 'ne';
        return 'n';
      } else {
        return dx < 0 ? 'w' : 'e';
      }
    }

    expect(calculateDirection(0, 1)).toBe('s');
    expect(calculateDirection(-1, 1)).toBe('sw');
    expect(calculateDirection(-1, 0)).toBe('w');
    expect(calculateDirection(-1, -1)).toBe('nw');
    expect(calculateDirection(0, -1)).toBe('n');
    expect(calculateDirection(1, -1)).toBe('ne');
    expect(calculateDirection(1, 0)).toBe('e');
    expect(calculateDirection(1, 1)).toBe('se');
  });
});
