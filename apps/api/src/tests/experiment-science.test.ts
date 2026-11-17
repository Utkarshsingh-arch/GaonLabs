import { describe, it, expect, beforeAll } from 'vitest';
import { ChemistryEngine, INDICATOR_METADATA } from '../../../web/src/features/experiment-studio/runtimes/chemistry/ChemistryEngine';
import { PhysicsEngine } from '../../../web/src/features/experiment-studio/runtimes/physics/PhysicsEngine';
import { manifestLoader } from '../modules/experiment-studio/manifest-loader';

describe('GaonLab Experiment Studio — Authoritative Scientific Calculations & Engine Verification', () => {
  beforeAll(async () => {
    await manifestLoader.loadAllManifests();
  });
  describe('1. Chemistry Engine — Representative pH, Indicator Transitions & Safety', () => {
    // Standard Class 8 representative samples
    const SAMPLES = [
      { id: 'LEMON_JUICE', name: 'Lemon Juice', ph: 2.2, classification: 'ACID' },
      { id: 'VINEGAR', name: 'Vinegar', ph: 2.8, classification: 'ACID' },
      { id: 'DISTILLED_WATER', name: 'Pure Water', ph: 7.0, classification: 'NEUTRAL' },
      { id: 'BAKING_SODA', name: 'Baking Soda Solution', ph: 8.5, classification: 'BASE' },
      { id: 'SOAP_WATER', name: 'Soap Water', ph: 9.5, classification: 'BASE' },
      { id: 'LIME_WATER', name: 'Lime Water', ph: 11.5, classification: 'BASE' },
    ];

    it('Correctly classifies all representative samples as ACID, BASE, or NEUTRAL', () => {
      for (const sample of SAMPLES) {
        const obs = ChemistryEngine.getObservationDetails('TURMERIC', sample.ph, sample.name);
        expect(obs.classification).toBe(sample.classification);
      }
    });

    it('Verifies Turmeric natural indicator turns deep red ONLY in alkaline solutions (pH > 7.5)', () => {
      // Acids and neutral stay yellow
      expect(ChemistryEngine.getIndicatorColor('TURMERIC', 2.2)).toBe('#FBBF24');
      expect(ChemistryEngine.getIndicatorColor('TURMERIC', 2.8)).toBe('#FBBF24');
      expect(ChemistryEngine.getIndicatorColor('TURMERIC', 7.0)).toBe('#FBBF24');

      // Alkaline solutions turn deep red
      expect(ChemistryEngine.getIndicatorColor('TURMERIC', 8.5)).toBe('#DC2626');
      expect(ChemistryEngine.getIndicatorColor('TURMERIC', 9.5)).toBe('#DC2626');
      expect(ChemistryEngine.getIndicatorColor('TURMERIC', 11.5)).toBe('#DC2626');
    });

    it('Verifies Red Litmus paper turns blue in alkali (pH > 7.0) and remains red in acid/neutral', () => {
      // Stays red in acid and neutral
      expect(ChemistryEngine.getIndicatorColor('RED_LITMUS', 2.2)).toBe('#EF4444');
      expect(ChemistryEngine.getIndicatorColor('RED_LITMUS', 7.0)).toBe('#EF4444');

      // Turns blue in alkaline solutions
      expect(ChemistryEngine.getIndicatorColor('RED_LITMUS', 8.5)).toBe('#2563EB');
      expect(ChemistryEngine.getIndicatorColor('RED_LITMUS', 9.5)).toBe('#2563EB');
      expect(ChemistryEngine.getIndicatorColor('RED_LITMUS', 11.5)).toBe('#2563EB');
    });

    it('Verifies Blue Litmus paper turns red in acid (pH < 7.0) and stays blue in neutral/alkali', () => {
      // Turns red in acids
      expect(ChemistryEngine.getIndicatorColor('BLUE_LITMUS', 2.2)).toBe('#EF4444');
      expect(ChemistryEngine.getIndicatorColor('BLUE_LITMUS', 2.8)).toBe('#EF4444');

      // Stays blue in neutral and bases
      expect(ChemistryEngine.getIndicatorColor('BLUE_LITMUS', 7.0)).toBe('#3B82F6');
      expect(ChemistryEngine.getIndicatorColor('BLUE_LITMUS', 8.5)).toBe('#3B82F6');
      expect(ChemistryEngine.getIndicatorColor('BLUE_LITMUS', 11.5)).toBe('#3B82F6');
    });

    it('Verifies Phenolphthalein shows subtle pale pink at pH 8.5 (Baking Soda) and NOT exaggerated magenta', () => {
      // Colorless in acids and neutral
      expect(ChemistryEngine.getIndicatorColor('PHENOLPHTHALEIN', 2.2)).toContain('rgba(255, 255, 255');
      expect(ChemistryEngine.getIndicatorColor('PHENOLPHTHALEIN', 7.0)).toContain('rgba(255, 255, 255');

      // Subtle pale pink at pH 8.5 (weak base near transition threshold 8.2)
      const bakingSodaColor = ChemistryEngine.getIndicatorColor('PHENOLPHTHALEIN', 8.5);
      expect(bakingSodaColor).toBe('#FBCFE8'); // Pale blush pink
      expect(bakingSodaColor).not.toBe('#EC4899'); // Must NOT be vivid magenta!

      // Vibrant magenta in strongly alkaline solutions (pH >= 9.0)
      expect(ChemistryEngine.getIndicatorColor('PHENOLPHTHALEIN', 9.5)).toBe('#EC4899');
      expect(ChemistryEngine.getIndicatorColor('PHENOLPHTHALEIN', 11.5)).toBe('#EC4899');

      // Verify observation text distinguishes weak alkali from strong alkali
      const weakObs = ChemistryEngine.getObservationDetails('PHENOLPHTHALEIN', 8.5, 'Baking Soda');
      expect(weakObs.colorName).toBe('Faint Subtle Pink');
      expect(weakObs.description).toContain('weakly alkaline');

      const strongObs = ChemistryEngine.getObservationDetails('PHENOLPHTHALEIN', 11.5, 'Lime Water');
      expect(strongObs.colorName).toBe('Vivid Magenta / Deep Pink');
      expect(strongObs.description).toContain('strongly alkaline');
    });

    it('Verifies China Rose indicator exhibits 3-zone behavior (dark magenta, pink, emerald green)', () => {
      // Acid zone (pH < 6.0): Dark magenta
      expect(ChemistryEngine.getIndicatorColor('CHINA_ROSE', 2.2)).toBe('#BE185D');
      expect(ChemistryEngine.getIndicatorColor('CHINA_ROSE', 5.5)).toBe('#BE185D');

      // Neutral zone (pH 6.0 - 8.0): Pink
      expect(ChemistryEngine.getIndicatorColor('CHINA_ROSE', 7.0)).toBe('#F472B6');

      // Alkaline zone (pH > 8.0): Emerald green
      expect(ChemistryEngine.getIndicatorColor('CHINA_ROSE', 8.5)).toBe('#059669');
      expect(ChemistryEngine.getIndicatorColor('CHINA_ROSE', 11.5)).toBe('#059669');
    });

    it('Clearly distinguishes paper strip indicators from liquid reagents', () => {
      expect(ChemistryEngine.getIndicatorForm('RED_LITMUS')).toBe('PAPER_STRIP');
      expect(ChemistryEngine.getIndicatorForm('BLUE_LITMUS')).toBe('PAPER_STRIP');
      expect(ChemistryEngine.getIndicatorForm('PHENOLPHTHALEIN')).toBe('LIQUID_REAGENT');
      expect(ChemistryEngine.getIndicatorForm('CHINA_ROSE')).toBe('LIQUID_REAGENT');
      expect(ChemistryEngine.getIndicatorForm('TURMERIC')).toBe('LIQUID_REAGENT');
    });

    it('Verifies agricultural liming challenge specifies Calcium Carbonate (CaCO3) and notes Ca(OH)2 caustic nature', () => {
      const manifest = manifestLoader.getManifestByCode('EXP_CHEM_01');
      expect(manifest).toBeDefined();

      const app = manifest!.learningLifecycle.application;
      // Option 0 should specify agricultural limestone (Calcium Carbonate, CaCO3)
      expect(app.options[0]).toContain('Calcium Carbonate');
      expect(app.options[0]).toContain('CaCO3');
      expect(app.options[0]).not.toContain('slaked lime (Calcium Hydroxide, a safe mild base');

      // Practical takeaway must explain that slaked lime is strongly alkaline and caustic
      expect(app.practicalTakeaway).toContain('CaCO3');
      expect(app.practicalTakeaway).toContain('caustic');
    });
  });

  describe('2. Physics Engine — Static & Kinetic Friction, Motion & Mass Independence', () => {
    const G = 9.8; // m/s^2

    it('Calculates normal force and static friction maximum threshold accurately', () => {
      const massKg = 2.0;
      const mu_k = 0.70;
      const mu_s = 0.85;

      // Independent expected values:
      // N = 2.0 * 9.8 = 19.6 N
      // F_s,max = 0.85 * 19.6 = 16.66 N
      // F_k = 0.70 * 19.6 = 13.72 N
      const state = PhysicsEngine.calculateMechanics(mu_k, massKg, {
        mu_s,
        mode: 'APPLIED_FORCE',
        pushForceN: 15.0,
        gravityMps2: G,
      });

      expect(state.normalForceN).toBe(19.6);
      expect(state.staticFrictionMaxN).toBe(16.66);
      expect(state.isStaticLock).toBe(true); // 15 N <= 16.66 N -> LOCKED
      expect(state.initialVelocityMps).toBe(0);
      expect(state.stoppingDistanceM).toBe(0);
      expect(state.frictionForceN).toBe(15.0); // Static friction balances applied force
    });

    it('Enforces no movement below static friction threshold', () => {
      // Mass 3.0 kg on Wood (mu_s = 0.40): N = 3.0 * 9.8 = 29.4 N; F_s,max = 0.40 * 29.4 = 11.76 N
      // Apply 10 N push force (10 N < 11.76 N) -> Remains stationary
      const state = PhysicsEngine.calculateMechanics(0.30, 3.0, {
        mu_s: 0.40,
        mode: 'APPLIED_FORCE',
        pushForceN: 10.0,
      });

      expect(state.isStaticLock).toBe(true);
      expect(state.initialVelocityMps).toBe(0);
      expect(state.stoppingDistanceM).toBe(0);
    });

    it('Initiates motion and applies kinetic friction when applied force exceeds static friction', () => {
      const massKg = 2.0;
      const mu_k = 0.70;
      const mu_s = 0.85;
      const pushForceN = 25.0; // 25 N > 16.66 N -> OVERCOMES static friction

      // Expected independent calculation:
      // F_k = 0.70 * 19.6 = 13.72 N
      // F_net_push = 25.0 - 13.72 = 11.28 N
      // a_launch = 11.28 / 2.0 = 5.64 m/s^2
      // v0 = 5.64 * 0.35 = 1.974 m/s
      // a_coast = -0.70 * 9.8 = -6.86 m/s^2
      // d_stop = (1.974)^2 / (2 * 6.86) = 3.896676 / 13.72 = 0.284 m
      const state = PhysicsEngine.calculateMechanics(mu_k, massKg, {
        mu_s,
        mode: 'APPLIED_FORCE',
        pushForceN,
        pushDurationS: 0.35,
        gravityMps2: G,
      });

      expect(state.isStaticLock).toBe(false);
      expect(state.frictionForceN).toBe(13.72);
      expect(state.initialVelocityMps).toBeCloseTo(1.974, 2);
      expect(state.accelerationMps2).toBeCloseTo(-6.86, 2);
      expect(state.stoppingDistanceM).toBeCloseTo(0.284, 2);
    });

    it('Verifies deceleration is strictly governed by -mu_k * g after push is removed', () => {
      // Wood (mu_k = 0.30): a = -0.30 * 9.8 = -2.94 m/s^2
      const woodState = PhysicsEngine.calculateMechanics(0.30, 2.0, {
        mode: 'CONSTANT_VELOCITY',
        initialVelocityMps: 4.0,
      });
      expect(woodState.accelerationMps2).toBe(-2.94);

      // Ice (mu_k = 0.05): a = -0.05 * 9.8 = -0.49 m/s^2
      const iceState = PhysicsEngine.calculateMechanics(0.05, 2.0, {
        mode: 'CONSTANT_VELOCITY',
        initialVelocityMps: 4.0,
      });
      expect(iceState.accelerationMps2).toBe(-0.49);
    });

    it('Verifies stopping distance formula d = v0^2 / (2 * mu_k * g) matches independent calculation', () => {
      // Surface: Wood (mu_k = 0.30), v0 = 4.0 m/s
      // Expected d = (4.0^2) / (2 * 0.30 * 9.8) = 16.0 / 5.88 = 2.721088 m
      // Expected t = 4.0 / 2.94 = 1.3605 s
      const state = PhysicsEngine.calculateMechanics(0.30, 2.0, {
        mode: 'CONSTANT_VELOCITY',
        initialVelocityMps: 4.0,
      });

      expect(state.stoppingDistanceM).toBeCloseTo(2.721, 2);
      expect(state.timeToStopS).toBeCloseTo(1.36, 1);
    });

    it('Rigorously verifies MASS INDEPENDENCE of stopping distance at constant initial velocity', () => {
      const v0 = 4.0; // m/s (as specified in Prediction Challenge)
      const mu_k = 0.30; // Wood

      // Trial 1: Mass = 1.0 kg
      const trial1 = PhysicsEngine.calculateMechanics(mu_k, 1.0, {
        mode: 'CONSTANT_VELOCITY',
        initialVelocityMps: v0,
      });

      // Trial 2: Mass = 2.0 kg (doubled mass)
      const trial2 = PhysicsEngine.calculateMechanics(mu_k, 2.0, {
        mode: 'CONSTANT_VELOCITY',
        initialVelocityMps: v0,
      });

      // Trial 3: Mass = 5.0 kg (5x mass)
      const trial3 = PhysicsEngine.calculateMechanics(mu_k, 5.0, {
        mode: 'CONSTANT_VELOCITY',
        initialVelocityMps: v0,
      });

      // Stopping distance must be strictly identical across all masses:
      expect(trial1.stoppingDistanceM).toBe(trial2.stoppingDistanceM);
      expect(trial2.stoppingDistanceM).toBe(trial3.stoppingDistanceM);
      expect(trial1.stoppingDistanceM).toBeCloseTo(2.721, 2);

      // Deceleration must also be identical:
      expect(trial1.accelerationMps2).toBe(trial2.accelerationMps2);
      expect(trial1.timeToStopS).toBe(trial2.timeToStopS);
    });

    it('Verifies stopping distance scales quadratically with initial velocity', () => {
      const mu_k = 0.30;

      // v0 = 2.0 m/s -> d = 4.0 / 5.88 = 0.680 m
      const s2 = PhysicsEngine.calculateMechanics(mu_k, 2.0, {
        mode: 'CONSTANT_VELOCITY',
        initialVelocityMps: 2.0,
      });

      // v0 = 4.0 m/s (2x speed) -> d = 16.0 / 5.88 = 2.721 m (4x distance)
      const s4 = PhysicsEngine.calculateMechanics(mu_k, 2.0, {
        mode: 'CONSTANT_VELOCITY',
        initialVelocityMps: 4.0,
      });

      // Ratio d(4) / d(2) must equal (4/2)^2 = 4
      expect(s4.stoppingDistanceM / s2.stoppingDistanceM).toBeCloseTo(4.0, 1);
    });

    it('Generates trajectory points that smoothly decay to zero velocity at stopping time', () => {
      const state = PhysicsEngine.calculateMechanics(0.30, 2.0, {
        mode: 'CONSTANT_VELOCITY',
        initialVelocityMps: 4.0,
      });

      const trajectory = PhysicsEngine.generateTrajectory(state, 50);
      expect(trajectory.length).toBe(51);

      // Start: t=0, x=0, v=4.0
      expect(trajectory[0].positionM).toBe(0);
      expect(trajectory[0].velocityMps).toBe(4.0);

      // End: t=timeToStop, x=stoppingDistance, v=0
      const lastPoint = trajectory[trajectory.length - 1];
      expect(lastPoint.velocityMps).toBe(0);
      expect(lastPoint.positionM).toBeCloseTo(state.stoppingDistanceM, 1);
    });
  });
});
