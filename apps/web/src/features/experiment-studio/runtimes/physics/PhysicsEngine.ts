/**
 * GaonLab Experiment Studio — Authoritative Physics Mechanics Engine
 * Numerical integration conforming to Newton's Laws and Coulomb's Friction Model.
 * Supports:
 * 1. Controlled Initial Velocity mode (investigating mass-independence during coasting: d = v0^2 / (2*mu_k*g))
 * 2. Applied Horizontal Force mode (investigating static friction threshold F_s,max = mu_s * N and push impulse)
 */

export interface PhysicsSimulationOptions {
  mu_s?: number;
  mode?: 'CONSTANT_VELOCITY' | 'APPLIED_FORCE';
  initialVelocityMps?: number;
  pushForceN?: number;
  pushDurationS?: number;
  gravityMps2?: number;
}

export interface PhysicsSimulationState {
  surfaceId: string;
  mu_k: number;
  mu_s: number;
  massKg: number;
  mode: 'CONSTANT_VELOCITY' | 'APPLIED_FORCE';
  pushForceN: number;
  pushDurationS: number;
  gravityMps2: number;
  initialVelocityMps: number;
  normalForceN: number;
  staticFrictionMaxN: number;
  frictionForceN: number;
  isStaticLock: boolean;
  accelerationMps2: number;
  stoppingDistanceM: number;
  timeToStopS: number;
}

export interface TrajectoryPoint {
  timeS: number;
  positionM: number;
  velocityMps: number;
  accelerationMps2: number;
}

export class PhysicsEngine {
  /**
   * Authoritative calculation of mechanics state.
   * Accepts either an options object or positional parameters for backward compatibility.
   */
  static calculateMechanics(
    mu_k: number,
    massKg: number,
    pushForceOrOptions: number | PhysicsSimulationOptions = 25.0,
    pushDurationS = 0.35,
    gravityMps2 = 9.8,
    mu_s?: number,
    mode?: 'CONSTANT_VELOCITY' | 'APPLIED_FORCE',
    initialVelocityMps?: number
  ): PhysicsSimulationState {
    let opts: PhysicsSimulationOptions;

    if (typeof pushForceOrOptions === 'object') {
      opts = pushForceOrOptions;
    } else {
      opts = {
        pushForceN: pushForceOrOptions,
        pushDurationS,
        gravityMps2,
        mu_s,
        mode,
        initialVelocityMps,
      };
    }

    const g = opts.gravityMps2 ?? 9.8;
    const resolvedMuS = opts.mu_s ?? (mu_k * 1.3);
    const resolvedMode =
      opts.mode ?? (opts.initialVelocityMps !== undefined ? 'CONSTANT_VELOCITY' : 'CONSTANT_VELOCITY');
    const pushDuration = opts.pushDurationS ?? 0.35;
    const pushForce = opts.pushForceN ?? 25.0;

    const normalForceN = massKg * g;
    const staticFrictionMaxN = resolvedMuS * normalForceN;
    const kineticFrictionN = mu_k * normalForceN;
    const coastDeceleration = -mu_k * g;

    let v0 = 0;
    let isStaticLock = false;
    let frictionForceN = kineticFrictionN;

    if (resolvedMode === 'CONSTANT_VELOCITY') {
      // Controlled initial launch velocity mode
      v0 = Math.max(opts.initialVelocityMps ?? 4.0, 0);
      isStaticLock = false;
      frictionForceN = v0 > 0 ? kineticFrictionN : 0;
    } else {
      // Applied horizontal push force mode
      if (pushForce <= staticFrictionMaxN) {
        // Force does not exceed static friction threshold (F_push <= F_s,max)
        isStaticLock = true;
        v0 = 0;
        // Static friction matches applied horizontal force in static equilibrium
        frictionForceN = pushForce;
      } else {
        // Exceeds static friction threshold: kinetic friction opposes forward motion
        isStaticLock = false;
        frictionForceN = kineticFrictionN;
        const netPushForce = pushForce - kineticFrictionN;
        const launchAcceleration = netPushForce / massKg;
        v0 = Math.max(launchAcceleration * pushDuration, 0);
      }
    }

    const timeToStopS = v0 > 0 ? v0 / Math.abs(coastDeceleration) : 0;
    const stoppingDistanceM = v0 > 0 ? (v0 * v0) / (2 * mu_k * g) : 0;

    return {
      surfaceId: '',
      mu_k,
      mu_s: Math.round(resolvedMuS * 100) / 100,
      massKg,
      mode: resolvedMode,
      pushForceN: pushForce,
      pushDurationS: pushDuration,
      gravityMps2: g,
      initialVelocityMps: Math.round(v0 * 1000) / 1000,
      normalForceN: Math.round(normalForceN * 100) / 100,
      staticFrictionMaxN: Math.round(staticFrictionMaxN * 100) / 100,
      frictionForceN: Math.round(frictionForceN * 100) / 100,
      isStaticLock,
      accelerationMps2: Math.round(coastDeceleration * 100) / 100,
      stoppingDistanceM: Math.round(stoppingDistanceM * 1000) / 1000,
      timeToStopS: Math.round(timeToStopS * 100) / 100,
    };
  }

  /**
   * Pre-generate trajectory data points for smooth canvas rendering and graphs
   */
  static generateTrajectory(
    mechanics: PhysicsSimulationState,
    steps = 100
  ): TrajectoryPoint[] {
    const points: TrajectoryPoint[] = [];
    const totalTime = mechanics.timeToStopS;

    if (totalTime <= 0 || mechanics.isStaticLock) {
      return [{ timeS: 0, positionM: 0, velocityMps: 0, accelerationMps2: 0 }];
    }

    const dt = totalTime / steps;
    const v0 = mechanics.initialVelocityMps;
    const a = mechanics.accelerationMps2;

    for (let i = 0; i <= steps; i++) {
      const t = i * dt;
      const v = Math.max(v0 + a * t, 0);
      const x = v0 * t + 0.5 * a * t * t;

      points.push({
        timeS: Math.round(t * 100) / 100,
        positionM: Math.round(x * 100) / 100,
        velocityMps: Math.round(v * 100) / 100,
        accelerationMps2: a,
      });
    }

    return points;
  }
}
