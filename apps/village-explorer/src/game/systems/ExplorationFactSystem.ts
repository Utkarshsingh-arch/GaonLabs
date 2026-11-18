import { EXPLORATION_FACTS, ExplorationFact } from '../data/villageEntities';

export interface ExplorationFactConfig {
  /** Minimum cooldown between facts in milliseconds (default: 22000 ms) */
  cooldownMs?: number;
  /** Minimum distance in pixels the player must walk before a fact triggers (default: 260 px) */
  minTravelDistancePx?: number;
  /** Number of recently shown facts to avoid repeating (default: 8) */
  recentHistorySize?: number;
}

/**
 * Pure, testable controller that triggers occasional, non-intrusive,
 * context-aware educational facts as the learner explores the village.
 */
export class ExplorationFactSystem {
  private readonly cooldownMs: number;
  private readonly minTravelDistancePx: number;
  private readonly recentHistorySize: number;

  private elapsedSinceLastFactMs: number;
  private accumulatedDistancePx: number = 0;
  private lastX: number | null = null;
  private lastY: number | null = null;
  private recentFactIds: string[] = [];

  constructor(config: ExplorationFactConfig = {}) {
    this.cooldownMs = config.cooldownMs ?? 22000;
    this.minTravelDistancePx = config.minTravelDistancePx ?? 260;
    this.recentHistorySize = config.recentHistorySize ?? 8;
    // Allow first fact after ~10 seconds of active walking
    this.elapsedSinceLastFactMs = Math.max(0, this.cooldownMs - 10000);
  }

  /**
   * Advances internal timers & distance tracking. Returns an ExplorationFact
   * when both cooldown and active exploration thresholds are satisfied.
   */
  public update(
    deltaMs: number,
    avatarX: number,
    avatarY: number,
    nearbyAreaTags: string[] = [],
    isPaused: boolean = false
  ): ExplorationFact | null {
    if (isPaused) return null;

    if (this.lastX !== null && this.lastY !== null) {
      const moved = Math.hypot(avatarX - this.lastX, avatarY - this.lastY);
      if (moved > 0.5 && moved < 200) {
        this.accumulatedDistancePx += moved;
      }
    }
    this.lastX = avatarX;
    this.lastY = avatarY;

    this.elapsedSinceLastFactMs += deltaMs;

    if (
      this.elapsedSinceLastFactMs >= this.cooldownMs &&
      this.accumulatedDistancePx >= this.minTravelDistancePx
    ) {
      const fact = this.pickNextFact(nearbyAreaTags);
      if (fact) {
        this.elapsedSinceLastFactMs = 0;
        this.accumulatedDistancePx = 0;
        this.recentFactIds.push(fact.id);
        if (this.recentFactIds.length > this.recentHistorySize) {
          this.recentFactIds.shift();
        }
        return fact;
      }
    }

    return null;
  }

  /**
   * Contextually prefers facts matching nearby areas/objects while avoiding
   * recently displayed facts to keep exploration fresh and varied.
   */
  public pickNextFact(nearbyAreaTags: string[] = []): ExplorationFact | null {
    const eligible = EXPLORATION_FACTS.filter(
      (f) => !this.recentFactIds.includes(f.id)
    );
    const pool = eligible.length > 0 ? eligible : EXPLORATION_FACTS;

    if (nearbyAreaTags.length > 0) {
      const contextual = pool.filter((f) =>
        f.relatedAreas?.some((tag) => nearbyAreaTags.includes(tag))
      );
      if (contextual.length > 0) {
        return contextual[Math.floor(Math.random() * contextual.length)];
      }
    }

    return pool[Math.floor(Math.random() * pool.length)] ?? null;
  }

  public getRecentFactIds(): string[] {
    return [...this.recentFactIds];
  }
}
