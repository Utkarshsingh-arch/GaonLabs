# GaonLab Experiment Studio — Scientific Accuracy & Learning Quality Audit

**Audit Date:** 17 November 2026  
**Auditor:** Antigravity Senior Software Architect & Scientific Audit Lead  
**Scope:** `EXP_CHEM_01`, `EXP_PHYS_01`, `EXP_PHYS_02`, Engine Runtimes, Manifest Architecture, Learning Lifecycle, Offline Reliability  
**Audit Classification:** Authoritative, Rigorous, Read-Only Audit Report  
**Target Document:** `docs/EXPERIMENT_STUDIO_SCIENTIFIC_AND_LEARNING_AUDIT.md`  

---

## 1. Executive Summary

A comprehensive, read-only scientific and educational audit was conducted on the **GaonLab Experiment Studio** codebase. The inspection evaluated the implemented Class 8 Chemistry virtual bench (`EXP_CHEM_01`), the Class 8 Physics friction track (`EXP_PHYS_01`), the Class 11 Rotational Dynamics declarative contract (`EXP_PHYS_02`), the declarative manifest engine, the 7-to-9 phase inquiry lifecycle state machine, the offline storage layer, and the test suite.

### Key Audit Findings

1. **Chemistry Simulation (`EXP_CHEM_01`):**
   - **Static Scalar Model:** The aqueous chemistry engine operates purely on static representative pH scalars read from the manifest rather than dynamic equilibrium or stoichiometric mass balances. Adding indicator drops merely increments an opacity counter ($\alpha \in [0.25, 0.92]$) without altering reagent volume or pH.
   - **Chemical Discrepancies & Safety Risk:** The agricultural application problem statement designates Calcium Hydroxide ($\text{Ca(OH)}_2$, slaked lime) as a "safe mild base". In reality, saturated $\text{Ca(OH)}_2$ is a caustic, strong alkaline base ($\text{pH} \approx 12.4$) capable of scorching crops and causing chemical burns. Standard agricultural liming utilizes crushed limestone ($\text{CaCO}_3$, a self-buffering mild base).
   - **Indicator Phenolphthalein Artifact:** Dilute baking soda ($\text{pH } 8.5$) triggers a vivid magenta in the simulation, whereas in physical middle school laboratories cold dilute sodium bicarbonate ($\text{NaHCO}_3$) is colorless or at most faintly pale pink. Furthermore, the UI renders a dipping paper strip for all indicators, despite phenolphthalein being a liquid dropwise indicator.

2. **Physics Simulation (`EXP_PHYS_01`):**
   - **Coulomb Kinetic Model Validated with Static Friction Omission:** Normal force ($N = mg$) and kinetic friction ($F_k = \mu_k N$) correctly govern sliding motion. However, static friction ($\mu_s$), although formally defined in manifest properties (e.g., $\mu_s = 0.85$ for sandpaper), is completely omitted in [`PhysicsEngine.calculateMechanics`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/apps/web/src/features/experiment-studio/runtimes/physics/PhysicsEngine.ts#L32-L70). An applied force lower than static friction threshold incorrectly accelerates the block.
   - **Pedagogical Contradiction (Prediction vs. Lab Bench Controls):** The prediction challenge asks what happens to stopping distance when doubling mass at constant initial velocity ($v_0$), correctly answering that distance remains unchanged ($d = v_0^2 / (2\mu_k g)$). However, the experimental workbench exposes a **Push Force** slider, not an initial velocity slider. Under constant force, doubling mass halves the launch velocity, causing stopping distance to drop by over 80%. A student testing their hypothesis observes the exact opposite of what the curriculum taught.
   - **Visual Track Clamping:** The visual track represents 12 meters. On low-friction surfaces like Ice ($\mu_k = 0.05$), stopping distances exceed 20 meters; the visual block hits the 85% track boundary and abruptly stops while the telemetry digital odometer and velocity graph continue animating for several more seconds. Vector arrows are static CSS boxes that do not scale with force magnitude.

3. **Rotational Dynamics Contract (`EXP_PHYS_02`):**
   - The declarative equations governing rigid body rolling down an incline plane ($a = \frac{g \sin\theta}{1 + I/(mR^2)}$) and kinetic energy partitioning are mathematically rigorous.
   - Unstated physical assumptions include no-slip conditions requiring $\mu_s \ge \frac{\tan\theta}{1 + mR^2/I}$, rigid contact surfaces, and negligible aerodynamic drag. The contract is strictly declarative (no canvas runtime), respecting the planned architecture boundaries.

4. **Lifecycle & Architecture:**
   - The state machine implements 9 discrete phases, accommodating `HINTS` as an auxiliary inquiry step and `COMPLETED` as the terminal boundary.
   - Multilingual support (`en`, `kn`) is integrated into manifests, providing culturally authentic localized contexts (e.g., Mandya farming, Channapatna wooden toys).

5. **Offline & Session Synchronization:**
   - Manifests, sessions, and events persist into browser IndexedDB.
   - **Critical Offline Disconnect:** The client queues events into an IndexedDB outbox store, but lacks an automatic reconnection listener or background queue flush worker. Furthermore, offline-created sessions (`local_session_${Date.now()}`) cannot be ingested by the backend without a reconciliation endpoint, causing foreign key errors upon reconnection.

6. **Test Verification:**
   - All 86 API tests across 10 test files pass cleanly (100% pass rate). Web build succeeds in 6.49s.
   - However, existing tests only validate HTTP responses and schema integrity; zero automated unit tests exist for physics equations, chemistry transitions, or offline sync outbox flushing.

---

## 2. Files and Components Inspected

| Category | File Path | Key Inspected Artifacts / Symbols |
|---|---|---|
| **Chemistry Engine** | [`apps/web/src/features/experiment-studio/runtimes/chemistry/ChemistryEngine.ts`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/apps/web/src/features/experiment-studio/runtimes/chemistry/ChemistryEngine.ts) | `getIndicatorColor`, `getBlendedBeakerColor`, `hexToRgba`, color thresholds |
| **Chemistry UI** | [`apps/web/src/features/experiment-studio/runtimes/chemistry/ChemistryRenderer.tsx`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/apps/web/src/features/experiment-studio/runtimes/chemistry/ChemistryRenderer.tsx) | `handleAddDrop`, `handleDipPaper`, Beaker SVG, Dropper visual, Digital pH Probe HUD |
| **Chemistry Manifest** | [`content/experiments/chemistry/indicator-investigation/manifest.json`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/content/experiments/chemistry/indicator-investigation/manifest.json) | Solutions, indicators, pH scalars, Mandya soil liming scenario |
| **Physics Engine** | [`apps/web/src/features/experiment-studio/runtimes/physics/PhysicsEngine.ts`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/apps/web/src/features/experiment-studio/runtimes/physics/PhysicsEngine.ts) | `calculateMechanics`, `generateTrajectory`, impulse equation, deceleration equation |
| **Physics UI** | [`apps/web/src/features/experiment-studio/runtimes/physics/PhysicsRenderer.tsx`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/apps/web/src/features/experiment-studio/runtimes/physics/PhysicsRenderer.tsx) | `handleLaunch`, `blockXPercent`, Canvas $v(t)$ graph, static vector HUD |
| **Physics Manifest** | [`content/experiments/physics/friction-and-motion/manifest.json`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/content/experiments/physics/friction-and-motion/manifest.json) | Surfaces ($\mu_k, \mu_s$), Prediction challenge, Application challenge |
| **Rotational Manifest** | [`content/experiments/physics/rotational-dynamics/manifest.json`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/content/experiments/physics/rotational-dynamics/manifest.json) | Inertia coefficients ($\beta$), incline angle equations, everyday & rural relevance |
| **Backend Services** | [`apps/api/src/modules/experiment-studio/manifest-loader.ts`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/apps/api/src/modules/experiment-studio/manifest-loader.ts) | Zod schema validation, manifest caching, directory discovery |
| **Backend Services** | [`apps/api/src/modules/experiment-studio/experiment-session.service.ts`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/apps/api/src/modules/experiment-studio/experiment-session.service.ts) | `startSession`, `ingestEvent`, `completeSession`, event deduplication |
| **Backend Routing** | [`apps/api/src/modules/experiment-studio/experiment-studio.router.ts`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/apps/api/src/modules/experiment-studio/experiment-studio.router.ts) | Express REST endpoints, route ordering |
| **Offline Storage** | [`apps/web/src/features/experiment-studio/services/experimentOfflineStorage.ts`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/apps/web/src/features/experiment-studio/services/experimentOfflineStorage.ts) | IndexedDB stores (`manifests`, `sessions`, `eventOutbox`), outbox queueing |
| **Client API** | [`apps/web/src/features/experiment-studio/services/experimentApi.ts`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/apps/web/src/features/experiment-studio/services/experimentApi.ts) | `fetchExperiments`, `fetchExperimentManifest`, `startExperimentSession`, `submitExperimentEvent` |
| **State Machine** | [`apps/web/src/features/experiment-studio/engine/ExperimentPlayerState.ts`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/apps/web/src/features/experiment-studio/engine/ExperimentPlayerState.ts) | `ExperimentPlayerContext`, action reducers |
| **UI Components** | [`apps/web/src/features/experiment-studio/components/LifecycleStepper.tsx`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/apps/web/src/features/experiment-studio/components/LifecycleStepper.tsx) | 9-step inquiry phase navigation bar |
| **Data Contracts** | [`packages/shared-types/src/experiment.ts`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/packages/shared-types/src/experiment.ts) | TypeScript interfaces, `ExperimentLifecyclePhase` union |
| **Database Schema** | [`apps/api/prisma/schema.prisma`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/apps/api/prisma/schema.prisma) | `Experiment`, `ExperimentVersion`, `ExperimentSession`, `ExperimentEvent` |
| **Test Suites** | [`apps/api/src/tests/experiment-studio.test.ts`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/apps/api/src/tests/experiment-studio.test.ts) | Vitest test cases (Manifest validation, REST endpoints, event deduplication) |

---

## 3. Chemistry Scientific Audit

### 3.1 Aqueous Chemistry & pH Model Verification

The chemistry simulation models six common aqueous substances in [`content/experiments/chemistry/indicator-investigation/manifest.json`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/content/experiments/chemistry/indicator-investigation/manifest.json):

| Substance | Simulated pH | Classification in Engine | True Chemical Nature | Atmospheric / Concentration Sensitivity |
|---|---:|---|---|---|
| **Lemon juice** | 2.2 | `ACID` | Citric acid ($\approx 5\text{--}8\%$), ascorbic acid | Varies naturally between $\text{pH } 2.0\text{--}2.6$ |
| **Vinegar** | 2.8 | `ACID` | Acetic acid ($\text{CH}_3\text{COOH}, 4\text{--}6\%$) | Weak acid ($K_a = 1.8 \times 10^{-5}$); typical commercial vinegar is $\text{pH } 2.4\text{--}3.0$ |
| **Water** | 7.0 | `NEUTRAL` | Pure $\text{H}_2\text{O}$ | Pure water at 25°C is 7.00; ambient tap/well water absorbs atmospheric $\text{CO}_2$ forming $\text{H}_2\text{CO}_3$, dropping to $\text{pH } 5.8\text{--}6.5$ |
| **Baking soda solution** | 8.5 | `BASE` | Sodium bicarbonate ($\text{NaHCO}_3$) | Amphiprotic salt; aqueous hydrolysis $\text{HCO}_3^- + \text{H}_2\text{O} \rightleftharpoons \text{H}_2\text{CO}_3 + \text{OH}^-$ yields weak base ($\text{pH } 8.2\text{--}8.6$) |
| **Soap water** | 9.5 | `BASE` | Sodium carboxylate salts ($\text{RCOO}^-\text{Na}^+$) | Hydrolysis of fatty acid salts yields mild-to-moderate alkaline solution ($\text{pH } 9.0\text{--}10.0$) |
| **Lime water** | 11.5 | `BASE` | Calcium hydroxide ($\text{Ca(OH)}_2$) | Saturated aqueous solution is strongly alkaline ($\text{pH } 12.4$ at 25°C); $\text{pH } 11.5$ corresponds to an unsaturated or carbonated solution |

#### Analysis of the Model's Scope and Simplifications:
1. **Representative vs. Universal Designation:** The simulation assigns single scalar constants to complex solutions. While these values are representative benchmarks suitable for Class 8 middle school pedagogy, the user interface currently lacks an explicit pedagogical note stating: *"These values represent standard room-temperature concentrations. In nature, domestic water and natural fruit juices vary based on mineral content and maturity."*
2. **Absence of Dynamic Aqueous Equilibrium:** The architecture document claimed dynamic equilibrium recalculations ($[H^+] \times V_1 + [OH^-] \times V_2$). The actual source code in [`ChemistryRenderer.tsx`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/apps/web/src/features/experiment-studio/runtimes/chemistry/ChemistryRenderer.tsx#L46) explicitly hardcodes:
   ```typescript
   const currentPh = currentSolution?.properties.ph ?? 7.0;
   ```
   No chemical mixing, titration, or neutralization occurs. Selecting a solution sets the pH directly. Adding indicator drops increments an integer counter (`indicatorDrops`), which is purely used for visual transparency blending.

### 3.2 Indicator Behaviour Verification

The indicator response logic is defined in [`ChemistryEngine.ts`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/apps/web/src/features/experiment-studio/runtimes/chemistry/ChemistryEngine.ts#L28-L55):

```typescript
export class ChemistryEngine {
  static getIndicatorColor(indicatorId: string, ph: number): string {
    switch (indicatorId) {
      case 'TURMERIC':
        return ph > 7.5 ? '#DC2626' : '#FBBF24'; // Red in base, Yellow in acid/neutral
      case 'RED_LITMUS':
        return ph > 7.0 ? '#2563EB' : '#EF4444'; // Blue in base, Red in acid/neutral
      case 'BLUE_LITMUS':
        return ph < 7.0 ? '#EF4444' : '#3B82F6'; // Red in acid, Blue in neutral/base
      case 'PHENOLPHTHALEIN':
        return ph > 8.2 ? '#EC4899' : 'rgba(255, 255, 255, 0.2)'; // Pink in base, Colorless in acid
      case 'CHINA_ROSE':
        if (ph < 6.0) return '#BE185D'; // Dark magenta in acid
        if (ph > 8.0) return '#059669'; // Emerald green in base
        return '#F472B6'; // Pink in neutral
    }
  }
}
```

#### Chemical Rigor Assessment:
1. **Turmeric (Curcumin):** Curcumin ($\text{C}_{21}\text{H}_{20}\text{O}_6$) keto-enol tautomerism triggers a sharp red shift (keto form in neutral/acid is yellow, enolate anion in alkali is deep red/brown). The threshold of $\text{pH } > 7.5$ yielding `#DC2626` (Red) and `#FBBF24` (Yellow) accurately mirrors NCERT Class 7 Chapter 5 and Class 8 curriculum guidelines.
2. **Litmus Paper:**
   - Red litmus turns blue in base ($\text{pH } > 7.0$), remains red in neutral/acid.
   - Blue litmus turns red in acid ($\text{pH } < 7.0$), remains blue in neutral/base.
   - Under neutral conditions ($\text{pH } = 7.0$), Red Litmus remains Red, and Blue Litmus remains Blue. This completely satisfies NCERT rules.
3. **Phenolphthalein Transition Inaccuracy:**
   - Phenolphthalein's standard transition interval is $\text{pH } 8.2\text{--}10.0$ (colorless $\rightarrow$ faint pink $\rightarrow$ deep magenta).
   - In the simulation, Baking Soda is assigned $\text{pH } = 8.5$. Because $8.5 > 8.2$, `getIndicatorColor` immediately returns vibrant saturated magenta (`#EC4899`).
   - *Physical Lab Reality:* In a real school lab, adding 1–2 drops of phenolphthalein to cold, dilute household baking soda ($\text{NaHCO}_3$) solution produces virtually no noticeable pink coloration (it typically remains colorless or displays an imperceptible tint) unless the solution is boiled or contaminated with sodium carbonate ($\text{Na}_2\text{CO}_3$). Presenting an intense magenta creates a misleading expectation for students conducting hands-on validation.
4. **China Rose (Hibiscus Rosa-sinensis):**
   - Three-zone model: Dark magenta/pink (`#BE185D`) for $\text{pH } < 6.0$; Emerald green (`#059669`) for $\text{pH } > 8.0$; Light pink (`#F472B6`) for $\text{pH } 6.0\text{--}8.0$.
   - This accurately conforms to the NCERT hibiscus extract extraction experiment.
5. **Renderer Artifact (Indicator Dipping Strip):**
   - In [`ChemistryRenderer.tsx`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/apps/web/src/features/experiment-studio/runtimes/chemistry/ChemistryRenderer.tsx#L306-L325), clicking the action "Dip Indicator Strip" renders a physical paper strip descending into the beaker, even when the user has selected **Phenolphthalein** or **China Rose** from the indicator list.
   - Litmus is standardly supplied as impregnated paper strips, but Phenolphthalein is an alcoholic liquid reagent dispensed via dropper. Showing a "Phenolphthalein paper strip" misrepresents laboratory apparatus.

### 3.3 Real-World Application & Safety Review (Soil Liming)

In [`content/experiments/chemistry/indicator-investigation/manifest.json`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/content/experiments/chemistry/indicator-investigation/manifest.json#L442-L460):

```json
"scenarioTitle": "The Mandya Farmer's Acidic Soil Crisis",
"scenarioDescription": "Mallesh, a farmer in Mandya district, notices his ragi crop turning yellowish and stunted. The local agricultural extension worker tests his soil runoff with indicator paper and finds a pH of 5.1 (strongly acidic soil).",
"problemStatement": "To neutralize the acidic soil without burning the crop roots, what should Mallesh treat his field with before sowing?",
"options": [
  "Agricultural slaked lime (Calcium Hydroxide, a safe mild base that neutralizes excess soil acids)",
  "Concentrated Vinegar (Acetic Acid)",
  "Lemon juice concentrate",
  "Pure distilled water flooding"
],
"correctOptionIndex": 0,
"practicalTakeaway": "Adding slaked lime (Ca(OH)2) neutralizes soil acids via Acid + Base -> Salt + Water, restoring the soil to pH 6.5–7.0 where plants can readily absorb nitrogen and phosphorus."
```

#### Chemical & Educational Defect:
- **Severe Inaccuracy:** Calcium Hydroxide ($\text{Ca(OH)}_2$) is **NOT** a "safe mild base". It is a strong base. Saturated lime water has a $\text{pH}$ of $12.4$ at 25°C.
- In agronomy, standard agricultural liming material is **Agricultural Limestone** ($\text{CaCO}_3$, calcite) or **Dolomitic Limestone** ($\text{CaCO}_3 \cdot \text{MgCO}_3$). Calcium carbonate has low aqueous solubility governed by $K_{sp} \approx 3.3 \times 10^{-9}$ and acts as a safe, self-limiting buffer that will not raise soil pH above $\approx 8.2$.
- Conversely, slaked lime ($\text{Ca(OH)}_2$) or quicklime ($\text{CaO}$) is caustic and aggressive. If applied directly by a farmer without precise buffering, it scorches plant roots ("burns" crops), destroys soil mycorrhizal fungi, and can cause severe skin and ocular chemical burns.
- Describing $\text{Ca(OH)}_2$ as a "safe mild base" in Class 8 curriculum teaches false chemical taxonomy and creates a safety misconception for rural children who might encounter hydrated construction lime at home or on farms.

---

## 4. Physics Scientific Audit

### 4.1 Friction Model Verification

The surface contact parameters are defined in [`content/experiments/physics/friction-and-motion/manifest.json`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/content/experiments/physics/friction-and-motion/manifest.json#L44-L95):

| Surface Identifier | Material Name | Kinetic Coefficient ($\mu_k$) | Static Coefficient ($\mu_s$) | Physical Realism |
|---|---|---:|---:|---|
| `ICE` | Polished Ice Surface | 0.05 | 0.08 | Realistic for smooth ice near 0°C |
| `GLASS` | Tempered Glass Sheet | 0.15 | 0.20 | Realistic for clean, dry glass-on-wood/metal |
| `WOOD_SMOOTH` | Polished Teak Wood Plank | 0.30 | 0.40 | Realistic for finished wood on wood |
| `GRASS_FIELD` | Dense Field Grass Turf | 0.55 | 0.65 | Approximate macroscopic sliding friction |
| `SANDPAPER` | Coarse Sandpaper (Rough) | 0.70 | 0.85 | Realistic for abrasive particle contact |

The calculation engine is implemented in [`PhysicsEngine.ts`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/apps/web/src/features/experiment-studio/runtimes/physics/PhysicsEngine.ts#L32-L70):

```typescript
export class PhysicsEngine {
  static calculateMechanics(
    mu_k: number,
    massKg: number,
    pushForceN: number,
    pushDurationS = 0.35,
    gravityMps2 = 9.8
  ): PhysicsSimulationState {
    const normalForceN = massKg * gravityMps2;
    const frictionForceN = mu_k * normalForceN;

    // During push impulse:
    const netPushForce = Math.max(pushForceN - frictionForceN, 0);
    const launchAcceleration = netPushForce / massKg;
    const initialVelocityMps = launchAcceleration * pushDurationS;

    // During unpowered coasting:
    const coastDeceleration = -mu_k * gravityMps2;
    const timeToStopS =
      initialVelocityMps > 0 ? initialVelocityMps / Math.abs(coastDeceleration) : 0;
    const stoppingDistanceM =
      initialVelocityMps > 0
        ? (initialVelocityMps * initialVelocityMps) / (2 * mu_k * gravityMps2)
        : 0;

    return {
      surfaceId: '',
      mu_k,
      massKg,
      pushForceN,
      pushDurationS,
      gravityMps2,
      initialVelocityMps,
      normalForceN,
      frictionForceN,
      accelerationMps2: coastDeceleration,
      stoppingDistanceM,
      timeToStopS,
    };
  }
}
```

#### Defect: Static Friction ($\mu_s$) is Defined but Ignored in Calculation
- While the JSON manifest specifies `mu_s` for each surface, `calculateMechanics` does not receive or use $\mu_s$.
- **Physical Inconsistency Test Case:**
  - Let surface be `SANDPAPER` ($\mu_s = 0.85$, $\mu_k = 0.70$), Mass $m = 2.0\text{ kg}$, $g = 9.8\text{ m/s}^2$.
  - Normal force: $N = 2.0 \times 9.8 = 19.6\text{ N}$.
  - Maximum static friction: $F_{s,\max} = \mu_s N = 0.85 \times 19.6 = 16.66\text{ N}$.
  - Kinetic friction: $F_k = \mu_k N = 0.70 \times 19.6 = 13.72\text{ N}$.
  - Apply a push force $F_{\text{push}} = 15.0\text{ N}$.
  - **True Physical Behavior:** Since $F_{\text{push}} < F_{s,\max}$ ($15.0\text{ N} < 16.66\text{ N}$), static friction balances the applied force ($f_s = 15.0\text{ N}$), net force is zero, and the block **remains stationary** ($v_0 = 0$).
  - **Actual Code Behavior:** Line 43 calculates `netPushForce = Math.max(15.0 - 13.72, 0) = 1.28 N`. Acceleration is $1.28 / 2.0 = 0.64\text{ m/s}^2$, and initial velocity becomes $0.64 \times 0.35 = 0.224\text{ m/s}$. The simulation moves the block when it should remain locked by static friction.

### 4.2 Motion Calculations & Stopping Distance Pitfall

The classic horizontal stopping distance equation under Coulomb sliding friction is:
$$d = \frac{v_0^2}{2 \mu_k g}$$

This relationship assumes:
1. Horizontal motion ($N = mg$, $\cos\theta = 1$).
2. Constant kinetic friction coefficient ($\mu_k$ independent of velocity).
3. Coasting phase with zero forward applied force ($F_{\text{applied}} = 0$).

The engine satisfies these assumptions during the unpowered coasting interval. However, a major pedagogical conflict exists between the prediction challenge and the workbench controls.

#### The Mass-Doubling Pedagogical Contradiction

1. **The Prediction Question in Manifest:**
   > *"If you double the mass of a sliding wooden block from 1 kg to 2 kg on the same smooth wood track, and give it the EXACT same initial velocity (say 4 m/s), what will happen to the stopping distance?"*
   - Correct Option: *"The stopping distance remains almost exactly the SAME, because both the friction force and the mass double, cancelling each other out ($a = -\mu_k g$)."*

2. **The Experimental Workbench Implementation:**
   - In [`PhysicsRenderer.tsx`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/apps/web/src/features/experiment-studio/runtimes/physics/PhysicsRenderer.tsx#L265-L315), the user is provided with two sliders:
     - **Block Mass ($m$):** 0.5 kg to 5.0 kg
     - **Push Force ($F_{\text{push}}$):** 5 N to 50 N
   - **There is no slider or control for initial launch velocity ($v_0$).** Launch velocity is a derived dependent variable determined by:
     $$v_0 = \frac{F_{\text{push}} - \mu_k m g}{m} \cdot \Delta t$$

3. **What the Student Experiences on the Workbench:**
   - On `WOOD_SMOOTH` ($\mu_k = 0.30$), with default $F_{\text{push}} = 25\text{ N}$, $\Delta t = 0.35\text{ s}$:
     - **At $m = 1.0\text{ kg}$:**
       $$F_k = 0.30 \times 1.0 \times 9.8 = 2.94\text{ N}$$
       $$F_{\text{net}} = 25 - 2.94 = 22.06\text{ N}$$
       $$a_{\text{launch}} = 22.06\text{ m/s}^2 \implies v_0 = 22.06 \times 0.35 = 7.72\text{ m/s}$$
       $$d_1 = \frac{(7.72)^2}{2 \times 0.30 \times 9.8} = \frac{59.60}{5.88} = \mathbf{10.14\text{ m}}$$
     - **At $m = 2.0\text{ kg}$ (Doubled Mass with same Push Force):**
       $$F_k = 0.30 \times 2.0 \times 9.8 = 5.88\text{ N}$$
       $$F_{\text{net}} = 25 - 5.88 = 19.12\text{ N}$$
       $$a_{\text{launch}} = \frac{19.12}{2.0} = 9.56\text{ m/s}^2 \implies v_0 = 9.56 \times 0.35 = 3.35\text{ m/s}$$
       $$d_2 = \frac{(3.35)^2}{2 \times 0.30 \times 9.8} = \frac{11.22}{5.88} = \mathbf{1.91\text{ m}}$$

4. **Educational Impact:**
   - The stopping distance dropped from **$10.14\text{ m}$ to $1.91\text{ m}$** (an 81% decrease!).
   - When the student tests their hypothesis on the lab bench, they see the 2 kg block stop in a fraction of the distance.
   - The student concludes: *"My prediction was right when I picked 'heavier blocks stop faster', and the teacher/answer key was wrong!"*
   - This failure to align the degree-of-freedom in the prediction question (constant velocity) with the degree-of-freedom on the workbench (constant applied force) creates a severe scientific learning contradiction.

### 4.3 Visual and Numerical Consistency

1. **Track Clamping Desynchronization:**
   - In [`PhysicsRenderer.tsx`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/apps/web/src/features/experiment-studio/runtimes/physics/PhysicsRenderer.tsx#L187-L188):
     ```typescript
     const trackScaleMaxM = 12.0;
     const blockXPercent = Math.min((currentDistanceM / trackScaleMaxM) * 80 + 5, 85);
     ```
   - On low friction surfaces like `ICE` ($\mu_k = 0.05$) with $m = 2\text{ kg}$ and $F_{\text{push}} = 25\text{ N}$, $v_0 \approx 4.20\text{ m/s}$, yielding a stopping distance of **$18.03\text{ meters}$**.
   - As $x$ passes 12 meters, `blockXPercent` clamps at 85%. The block visually hits an invisible wall at 85% track position and stops dead, while the digital distance readout continues counting up from 12.0m to 18.03m, and the real-time velocity graph keeps animating.
2. **Fixed-Length Force Vector Arrows:**
   - In [`PhysicsRenderer.tsx`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/apps/web/src/features/experiment-studio/runtimes/physics/PhysicsRenderer.tsx#L421-L440):
     - Normal force arrow is hardcoded to `w-0.5 h-4 bg-blue-400` (4 pixels high).
     - Gravity arrow is hardcoded to `w-0.5 h-4 bg-purple-400` (4 pixels high).
     - Friction arrow is hardcoded to `w-6 h-0.5 bg-red-400` (24 pixels wide).
     - Push arrow is hardcoded to `w-6 h-0.5 bg-emerald-400` (24 pixels wide).
   - The arrows do not dynamically scale with force magnitudes ($N$, $mg$, $F_k$, $F_{\text{push}}$). A 50 N push produces the exact same arrow as a 5 N push; a 5 kg mass produces the exact same normal vector as a 0.5 kg mass.

---

## 5. Rotational Motion Contract Audit (`EXP_PHYS_02`)

The Class 11 mechanics contract is declared in [`content/experiments/physics/rotational-dynamics/manifest.json`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/content/experiments/physics/rotational-dynamics/manifest.json).

### 5.1 Mathematical Derivation & Geometric Factors

For a rigid body of mass $m$, outer radius $R$, and moment of inertia $I = \beta m R^2$ rolling without slipping down an incline of angle $\theta$:

1. **Equations of Motion:**
   $$\sum F_x = m g \sin\theta - f_s = m a$$
   $$\sum \tau_{\text{cm}} = f_s R = I \alpha$$
   For non-slip rolling, $a = \alpha R \implies f_s = I \frac{a}{R^2} = \beta m a$.
   Substituting $f_s$ into linear force equation:
   $$m g \sin\theta - \beta m a = m a \implies a (1 + \beta) = g \sin\theta$$
   $$a = \frac{g \sin\theta}{1 + \beta} = \frac{g \sin\theta}{1 + \frac{I}{m R^2}}$$

2. **Evaluation of Manifest Shapes & Constants:**
   - **Thin Hollow Ring / Hoop:** $I = m R^2 \implies \beta = 1.0 \implies a = \frac{1}{2} g \sin\theta \approx 0.500\, g \sin\theta$.
   - **Solid Cylinder / Disk:** $I = \frac{1}{2} m R^2 \implies \beta = 0.5 \implies a = \frac{2}{3} g \sin\theta \approx 0.667\, g \sin\theta$.
   - **Uniform Solid Sphere:** $I = \frac{2}{5} m R^2 \implies \beta = 0.4 \implies a = \frac{5}{7} g \sin\theta \approx 0.714\, g \sin\theta$.
   - **Race Order:** $a_{\text{sphere}} > a_{\text{cylinder}} > a_{\text{ring}}$.

3. **Kinetic Energy Partitioning:**
   Total mechanical energy at linear velocity $v$:
   $$K_{\text{total}} = K_{\text{trans}} + K_{\text{rot}} = \frac{1}{2} m v^2 + \frac{1}{2} I \omega^2$$
   Since $\omega = v/R$ and $I = \beta m R^2$:
   $$K_{\text{total}} = \frac{1}{2} m v^2 (1 + \beta)$$
   - For a sphere ($\beta = 0.4$), $71.4\%$ of potential energy converts to translation, and $28.6\%$ to rotation.
   - For a ring ($\beta = 1.0$), $50\%$ converts to translation, and $50\%$ to rotation.

The mathematical contract in the manifest is **100% correct and conforms to CBSE/NCERT Class 11 Physics Chapter 7 (System of Particles and Rotational Motion)**.

### 5.2 Physical Assumptions Omitted from Contract

While mathematically sound, the contract omits physical boundary constraints that should be documented:
1. **Minimum Static Friction Condition:** Pure rolling without slipping requires sufficient static friction:
   $$f_s = \frac{m g \sin\theta}{1 + \frac{m R^2}{I}} \le \mu_s N = \mu_s m g \cos\theta$$
   $$\mu_s \ge \frac{\tan\theta}{1 + \frac{m R^2}{I}} = \frac{\beta}{1 + \beta} \tan\theta$$
   For a ring ($\beta = 1.0$) at $\theta = 45^\circ$, $\mu_s \ge 0.5$. If $\mu_s$ is lower, the object will slip and rotate simultaneously, invalidating the simple energy partition.
2. **Deformability & Rolling Resistance:** Real bodies experience rolling resistance due to hysteresis and contact deformation. The contract assumes infinitely rigid surfaces.

### 5.3 Roadmap & Implementation Boundary Verification

The audit confirms that `EXP_PHYS_02` exists strictly as a declarative JSON manifest in `content/experiments/physics/rotational-dynamics/manifest.json`. No runtime canvas or simulation engine has been implemented for `PHYSICS_ROTATIONAL_DYNAMICS` in `apps/web`. This accurately adheres to the architectural staging boundary.

---

## 6. Learning Lifecycle and Pedagogy Audit

### 6.1 State Machine Lifecycle: 7-Phase vs. 9-Phase Hierarchy

The design architecture specified a 7-phase inquiry cycle:
$$\text{MISSION} \longrightarrow \text{PREDICT} \longrightarrow \text{EXPERIMENT} \longrightarrow \text{OBSERVE} \longrightarrow \text{INVESTIGATE} \longrightarrow \text{UNDERSTAND} \longrightarrow \text{APPLY}$$

The actual codebase ([`packages/shared-types/src/experiment.ts`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/packages/shared-types/src/experiment.ts#L10) and [`LifecycleStepper.tsx`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/apps/web/src/features/experiment-studio/components/LifecycleStepper.tsx)) implements 9 phases:
1. `MISSION` (Orienting context)
2. `PREDICTION` (Hypothesis formulation)
3. `EXPERIMENT` (Active manipulation)
4. `OBSERVATION` (Empirical recording)
5. `QUESTIONING` (Investigate)
6. `HINTS` (Progressive scaffolding)
7. `EXPLANATION` (Understand)
8. `APPLICATION` (Real-world scenario transfer)
9. `COMPLETED` (Session reflection and score)

*Pedagogical Assessment:* The 9-phase implementation is structurally sound. `HINTS` acts as an auxiliary scaffolding step between questioning and deep explanation, while `COMPLETED` represents the terminal persistence boundary. The architectural documentation should formally state this 7+2 hierarchy.

### 6.2 Inquiry-Based Learning Quality

| Pedagogical Dimension | Implementation Quality | Code / Manifest Evidence | Findings & Assessment |
|---|---|---|---|
| **Active Manipulation** | High | `ChemistryRenderer.tsx`, `PhysicsRenderer.tsx` | Students freely change solutions, add drops, dip strips, change surfaces, mass, and force rather than watching passive animations. |
| **Prediction Scaffolding** | Medium | `manifest.json` under `learningLifecycle.prediction` | Forces students to lock in a hypothesis before accessing the bench. However, mass-doubling question conflicts with workbench controls. |
| **Observation Recording** | High | `handleSaveObservation`, Session event ingestion | Clicking "Record Observation" captures empirical measurements directly into the learner's session log. |
| **Questioning & Assessment** | High | `learningLifecycle.questions` | Questions assess causal mechanisms (e.g., why turmeric turns red, how friction opposes motion) rather than simple vocabulary recall. |
| **Progressive Hints** | High | `learningLifecycle.hints` | Three-tier progressive hints (Gentle Nudge $\rightarrow$ Guided Clue $\rightarrow$ Direct Principle) prevent premature reveal of solutions. |
| **Contextual Transfer** | High | `learningLifecycle.application` | Transfers concepts to local rural Indian contexts (Mandya soil liming, bullock cart wheel friction, Channapatna toy polishing). |

---

## 7. Manifest Engine and Technical Architecture Audit

### 7.1 Declarative Manifest Validation

In [`manifest-loader.ts`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/apps/api/src/modules/experiment-studio/manifest-loader.ts):
- Manifests are parsed using a Zod schema (`ExperimentManifestSchema`).
- If a manifest fails validation (such as a missing key or incorrect enum), `manifest-loader.ts` logs a formatted error and gracefully omits the invalid experiment without crashing the Express server.
- Manifest discovery reads recursively from `content/experiments/**/manifest.json`.

### 7.2 Database Model Alignment

In [`schema.prisma`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/apps/api/prisma/schema.prisma#L350-L420):
- `Experiment`: Canonical metadata linked to `EducationBoard`, `Level`, and `Subject`.
- `ExperimentVersion`: Versioned JSON manifests (`manifestJson`).
- `ExperimentSession`: Tracks learner, active phase, locked hypothesis, recorded observations, and completion status.
- `ExperimentEvent`: Event-sourcing log with idempotent deduplication via `clientEventId`.
- *Duplication Check:* The models cleanly reference existing `LearnerProfile`, `EducationBoard`, and `Subject` tables without duplicating student identity or curriculum definitions.

---

## 8. Offline and Session Reliability Audit

### 8.1 IndexedDB Storage Architecture

In [`experimentOfflineStorage.ts`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/apps/web/src/features/experiment-studio/services/experimentOfflineStorage.ts):
- Database name: `gaonlab_experiment_studio_db` (Version 1).
- Object Stores:
  1. `manifests` (key: `experimentId`, indexed by `code`).
  2. `sessions` (key: `id`).
  3. `eventOutbox` (key: `clientEventId`, indexed by `sessionId`, `synced`).

### 8.2 Offline Resilience & Defects

1. **Manifest Caching:** Manifests are cached into IndexedDB on first load. Subsequent offline loads successfully read from IndexedDB via `getCachedManifest`.
2. **Missing Outbox Flush Worker:**
   - In [`experimentOfflineStorage.ts`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/apps/web/src/features/experiment-studio/services/experimentOfflineStorage.ts#L137-L160), failed event submissions remain in `eventOutbox` with `synced: false`.
   - **Defect:** There is no `window.addEventListener('online')` handler, no interval timer, and no retry logic to flush pending outbox events when network connectivity is restored. Queued events remain stranded in IndexedDB indefinitely.
3. **Offline-Created Session Backend Foreign Key Failure:**
   - In [`experimentApi.ts`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/apps/web/src/features/experiment-studio/services/experimentApi.ts#L107-L130), if the device is offline when starting an experiment, a client session ID is generated: `local_session_${Date.now()}`.
   - When the student subsequently comes online and the app attempts to submit events or complete the session, [`experiment-session.service.ts`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/apps/api/src/modules/experiment-studio/experiment-session.service.ts#L93) queries:
     ```typescript
     const session = await prisma.experimentSession.findUnique({ where: { id: sessionId } });
     if (!session) throw new Error(`Session not found: ${sessionId}`);
     ```
   - The backend rejects all events and completion calls for `local_session_...` because the session was never created in PostgreSQL. There is no session reconciliation API (`POST /api/v1/experiments/sessions/reconcile`).

---

## 9. Test and Build Verification

### 9.1 Test Execution Results

**Command:**
```bash
npm --workspace=@gaonlab/api test
```
**Output Summary:**
```
Test Files  10 passed (10)
     Tests  86 passed (86)
  Duration  61.97s
```

All 86 tests passed, including:
- 10 tests in `src/tests/experiment-studio.test.ts`
- 15 tests in `src/tests/ncert-stem-catalogue.test.ts`
- 18 tests in `src/tests/topics-module.test.ts`
- 8 tests in `src/tests/identity-consent.test.ts`
- 10 tests in `src/tests/curriculum-catalogue.test.ts`

### 9.2 Web Build Verification

**Command:**
```bash
npm --workspace=@gaonlab/web run build
```
**Output Summary:**
```
✓ 1620 modules transformed.
dist/index.html                   1.32 kB │ gzip:   0.74 kB
dist/assets/index-DifEJ_yo.css   71.66 kB │ gzip:  11.53 kB
dist/assets/index-BlcX9QDA.js   450.69 kB │ gzip: 116.23 kB
✓ built in 6.49s
```

### 9.3 Test Coverage Limitations & Edge Cases

While API routing tests pass, significant test gaps exist:
1. **Zero Runtime Engine Tests:** Neither `ChemistryEngine.ts` nor `PhysicsEngine.ts` has any unit tests in `apps/web/src/tests` or `apps/api/src/tests`.
2. **Missing Boundary Tests:** No tests assert the behavior when $F_{\text{push}} < \mu_s N$, when $d > 12\text{m}$, or when offline outbox events are synchronized.

---

## 10. Issues and Evidence

The following table summarizes all identified issues classified by severity:

| ID | Issue Title | Severity | Impacted Component | Category |
|---|---|---|---|---|
| **ISS-01** | Slaked Lime Described as Safe Mild Base | **High** | `content/experiments/chemistry/.../manifest.json` | Scientific / Safety Inaccuracy |
| **ISS-02** | Pedagogical Contradiction: Mass Doubling vs Push Force | **High** | `content/experiments/physics/.../manifest.json` & `PhysicsRenderer.tsx` | Pedagogical Design Flaw |
| **ISS-03** | Offline Session Ingestion Rejection (No Reconciliation) | **High** | `experimentApi.ts` & `experiment-session.service.ts` | Offline Reliability Defect |
| **ISS-04** | Static Friction Ignored in Motion Calculation | **Medium** | `PhysicsEngine.ts` | Physical Calculation Defect |
| **ISS-05** | Track Visual Clamping & Telemetry Desync (> 12m) | **Medium** | `PhysicsRenderer.tsx` | Visual-Numerical Inconsistency |
| **ISS-06** | Static Pixel-Sized Force Vector HUD | **Medium** | `PhysicsRenderer.tsx` | Visual-Physical Inconsistency |
| **ISS-07** | Phenolphthalein Liquid Rendered as Dipping Strip | **Medium** | `ChemistryRenderer.tsx` | Laboratory Realism Flaw |
| **ISS-08** | Baking Soda Triggers Saturated Phenolphthalein Pink | **Low** | `ChemistryEngine.ts` | Chemical Inaccuracy |
| **ISS-09** | Missing Offline Outbox Flush Reconnection Listener | **Low** | `experimentOfflineStorage.ts` | Offline Incompleteness |
| **ISS-10** | Missing Dynamic pH Disclaimer for Natural Substances | **Low** | `ChemistryRenderer.tsx` | Pedagogical Clarification |

---

### Detailed Issue Specifications

#### ISS-01: Slaked Lime Described as Safe Mild Base
- **Severity:** High
- **Location:** [`content/experiments/chemistry/indicator-investigation/manifest.json`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/content/experiments/chemistry/indicator-investigation/manifest.json#L448-L460)
- **Current Behavior:** Option 1 states: *"Agricultural slaked lime (Calcium Hydroxide, a safe mild base that neutralizes excess soil acids)"*.
- **Why Inaccurate:** Calcium hydroxide ($\text{Ca(OH)}_2$) is a caustic, strong alkaline base ($\text{pH } 12.4$). Standard agricultural lime is crushed limestone ($\text{CaCO}_3$, a self-limiting mild base). Describing $\text{Ca(OH)}_2$ as a "safe mild base" creates safety and chemical misconceptions for rural children.
- **Evidence:** Saturated $\text{Ca(OH)}_2$ solution has $\text{pH } 12.4$, caustic to human tissue and living crop roots.
- **Recommended Correction:** Replace "slaked lime (Calcium Hydroxide)" with "Agricultural limestone (Calcium Carbonate, $\text{CaCO}_3$, a mild buffering base)" or accurately describe slaked lime as an alkaline compound requiring careful dosage.

#### ISS-02: Pedagogical Contradiction Between Mass Doubling and Push Force Controls
- **Severity:** High
- **Location:** [`content/experiments/physics/friction-and-motion/manifest.json`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/content/experiments/physics/friction-and-motion/manifest.json#L102-L140) & [`PhysicsRenderer.tsx`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/apps/web/src/features/experiment-studio/runtimes/physics/PhysicsRenderer.tsx#L265-L315)
- **Current Behavior:** Prediction asks for stopping distance when doubling mass at **equal launch velocity** (distance is unchanged). However, the lab bench gives the student a **Push Force** slider. Doubling mass with equal push force slashes launch velocity by half, dropping stopping distance by 81%.
- **Why Inaccurate:** The student tests the hypothesis on the simulator and observes the exact opposite of the correct answer, producing confusion.
- **Evidence:** $m=1\text{kg}, F=25\text{N} \implies d = 10.14\text{m}$; $m=2\text{kg}, F=25\text{N} \implies d = 1.91\text{m}$.
- **Recommended Correction:** Add a segmented toggle on the workbench: `[Constant Launch Velocity]` vs `[Constant Push Force]`, or add a specific Initial Velocity ($v_0$) slider so students can directly test the condition stated in the prediction challenge.

#### ISS-03: Offline Session Ingestion Rejection (No Reconciliation)
- **Severity:** High
- **Location:** [`apps/web/src/features/experiment-studio/services/experimentApi.ts`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/apps/web/src/features/experiment-studio/services/experimentApi.ts#L107-L130) & [`apps/api/src/modules/experiment-studio/experiment-session.service.ts`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/apps/api/src/modules/experiment-studio/experiment-session.service.ts#L93)
- **Current Behavior:** When offline, `startExperimentSession` creates a local ID (`local_session_${Date.now()}`). When the device reconnects and submits events, backend throws `Session not found: local_session_...`.
- **Why Inaccurate:** Offline sessions cannot sync to the backend when reconnected.
- **Evidence:** Code in `experiment-session.service.ts`: `if (!session) throw new Error(...)`.
- **Recommended Correction:** Implement a session reconciliation endpoint `POST /api/v1/experiments/sessions/reconcile` that accepts locally initialized sessions, creates them in PostgreSQL, and ingests all pending events.

#### ISS-04: Static Friction Ignored in Motion Calculation
- **Severity:** Medium
- **Location:** [`apps/web/src/features/experiment-studio/runtimes/physics/PhysicsEngine.ts`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/apps/web/src/features/experiment-studio/runtimes/physics/PhysicsEngine.ts#L42-L46)
- **Current Behavior:** `PhysicsEngine.calculateMechanics` only receives $\mu_k$. If $F_{\text{push}} < \mu_s N$ but $> \mu_k N$, the block moves.
- **Why Inaccurate:** Under Coulomb friction, an applied force below maximum static friction results in static equilibrium ($a = 0, v_0 = 0$).
- **Evidence:** On sandpaper ($\mu_s = 0.85, \mu_k = 0.70, m = 2\text{kg}$), $F_{s,\max} = 16.66\text{N}$. Applying $F_{\text{push}} = 15.0\text{N}$ produces $v_0 = 0.224\text{m/s}$ instead of remaining at rest.
- **Recommended Correction:** Pass $\mu_s$ to `calculateMechanics`. If $F_{\text{push}} \le \mu_s N$, set `netPushForce = 0` and `initialVelocityMps = 0`.

#### ISS-05: Track Visual Clamping & Telemetry Desync (> 12m)
- **Severity:** Medium
- **Location:** [`apps/web/src/features/experiment-studio/runtimes/physics/PhysicsRenderer.tsx`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/apps/web/src/features/experiment-studio/runtimes/physics/PhysicsRenderer.tsx#L187-L188)
- **Current Behavior:** `blockXPercent` is clamped at 85% because track length is calibrated to 12 meters. If stopping distance is 18m, the block stops animating at 12m while the distance readout and graph continue for seconds.
- **Why Inaccurate:** Visual and numerical representations desynchronize.
- **Evidence:** On Ice with $25\text{N}$ push, stopping distance is $18.03\text{m}$.
- **Recommended Correction:** Dynamically auto-scale track max distance: `trackScaleMaxM = Math.max(12.0, Math.ceil(mechanics.stoppingDistanceM / 5) * 5)`.

#### ISS-06: Static Pixel-Sized Force Vector HUD
- **Severity:** Medium
- **Location:** [`apps/web/src/features/experiment-studio/runtimes/physics/PhysicsRenderer.tsx`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/apps/web/src/features/experiment-studio/runtimes/physics/PhysicsRenderer.tsx#L420-L442)
- **Current Behavior:** Force vectors have fixed CSS dimensions (`h-4`, `w-6`) regardless of values.
- **Why Inaccurate:** Violates standard physics conventions where vector arrow lengths are proportional to vector magnitudes.
- **Evidence:** $F_{\text{push}} = 5\text{N}$ and $F_{\text{push}} = 50\text{N}$ render identical 24px arrows.
- **Recommended Correction:** Compute inline styles for arrow lengths: `width: `${Math.min(Math.max((force / maxForce) * 48, 8), 64)}px``.

#### ISS-07: Phenolphthalein Liquid Rendered as Dipping Strip
- **Severity:** Medium
- **Location:** [`apps/web/src/features/experiment-studio/runtimes/chemistry/ChemistryRenderer.tsx`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/apps/web/src/features/experiment-studio/runtimes/chemistry/ChemistryRenderer.tsx#L306-L325)
- **Current Behavior:** Clicking "Dip Indicator Strip" displays a paper strip submerged in the beaker even when Phenolphthalein is selected.
- **Why Inaccurate:** Phenolphthalein is a dropwise liquid indicator, not an indicator paper strip.
- **Recommended Correction:** Disable the "Dip Strip" button when liquid indicators (Phenolphthalein, China Rose) are selected, or show a tooltip: *"Phenolphthalein is a liquid reagent. Use the dropper to add drops."*

#### ISS-08: Baking Soda Triggers Saturated Phenolphthalein Pink
- **Severity:** Low
- **Location:** [`apps/web/src/features/experiment-studio/runtimes/chemistry/ChemistryEngine.ts`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/apps/web/src/features/experiment-studio/runtimes/chemistry/ChemistryEngine.ts#L43-L44)
- **Current Behavior:** Because baking soda has simulated $\text{pH } = 8.5 > 8.2$, phenolphthalein immediately turns `#EC4899` (deep magenta).
- **Why Inaccurate:** Cold dilute $\text{NaHCO}_3$ does not turn phenolphthalein deep pink in real labs.
- **Recommended Correction:** Use a gradual alpha transition for phenolphthalein between $\text{pH } 8.2$ and $10.0$, so $\text{pH } 8.5$ yields an extremely pale, barely perceptible pink.

#### ISS-09: Missing Offline Outbox Flush Reconnection Listener
- **Severity:** Low
- **Location:** [`apps/web/src/features/experiment-studio/services/experimentOfflineStorage.ts`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/apps/web/src/features/experiment-studio/services/experimentOfflineStorage.ts)
- **Current Behavior:** Events stored in `eventOutbox` with `synced: false` are never flushed upon network recovery.
- **Why Inaccurate:** Offline learning progress does not sync back to the server.
- **Recommended Correction:** Add `window.addEventListener('online', flushEventOutbox)` in `experimentApi.ts`.

#### ISS-10: Missing Dynamic pH Disclaimer for Natural Substances
- **Severity:** Low
- **Location:** [`apps/web/src/features/experiment-studio/runtimes/chemistry/ChemistryRenderer.tsx`](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/apps/web/src/features/experiment-studio/runtimes/chemistry/ChemistryRenderer.tsx#L250-L274)
- **Current Behavior:** Digital pH meter displays $\text{pH } 2.2$ without any educational context note.
- **Why Inaccurate:** Students may believe all lemons anywhere have an exact pH of 2.20.
- **Recommended Correction:** Add an educational tooltip on the pH probe HUD: *"Representative standard value. Natural lemon juices vary between pH 2.0 and 2.6 depending on ripeness and soil."*

---

## 11. Recommended Corrections — Prioritised

### Phase 1: Critical & High Priority (Safety, Pedagogy & Offline Sync)
1. **Correct Agricultural Liming Content in Chemistry Manifest (`content/experiments/chemistry/indicator-investigation/manifest.json`):**
   - Replace "Agricultural slaked lime ($\text{Ca(OH)}_2$)" with "Agricultural limestone ($\text{CaCO}_3$, powdered calcite)" as the primary safe neutralizing agent.
   - Clarify in the practical takeaway that slaked lime ($\text{Ca(OH)}_2$) is caustic and requires extreme care to avoid scorching crop roots.
2. **Align Physics Prediction Degrees of Freedom (`content/experiments/physics/friction-and-motion/manifest.json` & `PhysicsRenderer.tsx`):**
   - Add a launch mode toggle or direct Launch Velocity ($v_0$) slider to `PhysicsRenderer.tsx` so students can test the prediction challenge under constant velocity conditions.
   - Alternatively, rewrite the prediction challenge to state: *"If you double the mass while applying the EXACT same push force..."* to match the default workbench controls.
3. **Implement Offline Session Reconciliation (`experimentApi.ts` & `experiment-session.service.ts`):**
   - Add backend endpoint `POST /api/v1/experiments/sessions/reconcile` that accepts client-generated session records and persists them before ingesting queued events.

### Phase 2: Medium Priority (Simulation Accuracy & Visual Integrity)
4. **Incorporate Static Friction Threshold into `PhysicsEngine.ts`:**
   - Update `calculateMechanics` signature to accept `mu_s: number`.
   - Implement static friction check: `if (pushForceN <= mu_s * normalForceN) return stationaryState;`.
5. **Implement Dynamic Track Scaling in `PhysicsRenderer.tsx`:**
   - Auto-expand `trackScaleMaxM` when stopping distance exceeds 12 meters.
6. **Dynamic Scaling for Force Vector HUD:**
   - Scale pixel lengths of arrows on the block proportional to force magnitudes.
7. **Disallow Dipping Paper Strip for Liquid Indicators:**
   - Restrict strip dipping to Litmus in `ChemistryRenderer.tsx`.

### Phase 3: Low & Informational Priority (Polish & Scaffolding)
8. **Gradual Phenolphthalein Color Transition:**
   - Implement sigmoid or linear opacity ramp between pH 8.2 and 10.0.
9. **Automatic Outbox Sync Worker:**
   - Implement `flushEventOutbox()` triggered by browser `online` events.
10. **Add Engine Unit Tests:**
    - Create dedicated Vitest test files for `ChemistryEngine.test.ts` and `PhysicsEngine.test.ts`.

---

## 12. Final Assessment

| Evaluation Dimension | Status | Assessment Summary |
|---|---|---|
| **Scientifically Acceptable for Educational MVP** | **Conditional Pass** | The foundational physics equations (Coulomb friction, Newton's second law) and chemistry indicator rules (turmeric, litmus, china rose) are mathematically and chemically sound for Class 8 middle school inquiry. However, the designation of slaked lime as a "safe mild base" and the omission of static friction must be corrected before unrestricted student access. |
| **Educationally Suitable for Intended Level** | **High** | The structured 9-phase inquiry cycle, progressive hints, concrete observation logging, and rural contextual framing (Mandya farming, bullock carts) provide an exemplary experiential learning environment. The prediction-to-workbench slider contradiction must be aligned to preserve pedagogical trust. |
| **Technically Reliable for Further Expansion** | **Sound** | The declarative JSON manifest architecture, Zod schema validation, Prisma models, and TypeScript contracts provide a highly robust, extensible platform. Passing 86/86 API tests and a clean 6.49s production web build demonstrate high technical reliability. |
| **Ready for Supervised Pilot** | **Ready After Phase 1 Corrections** | The Experiment Studio is ready for a teacher-supervised classroom pilot once the Phase 1 priority corrections (agricultural lime terminology, mass-doubling slider alignment, and offline session reconciliation) are applied. |

---
*Report compiled and certified by Antigravity Scientific & Educational Software Architecture Audit.*
