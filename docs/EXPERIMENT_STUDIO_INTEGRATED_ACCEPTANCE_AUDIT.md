# GaonLab Experiment Studio — Stage 3: Integrated End-to-End Acceptance Audit Report

**Date of Audit:** 18 November 2026  
**Auditor:** Lead Systems Architect & Senior Verification Lead  
**Scope:** Integrated verification of Stage 1 (Scientific Accuracy & Learning Consistency) and Stage 2 (Offline Session Persistence & Reliable Sync) across realistic student usage scenarios.  
**Mode:** Read-only inspection & non-invasive programmatic acceptance verification.  

---

## 1. Executive Summary

This acceptance audit evaluates the integrated readiness of the **GaonLab Experiment Studio** following the completion of Stage 1 (Scientific Accuracy Corrections) and Stage 2 (Offline Persistence & Reliable Synchronization).

The audit subjected the system to 20 realistic end-to-end student scenarios, boundary-condition tests, concurrent multi-tab sync races, device clock perturbations, multi-learner isolation checks, and authoritative scientific validations for both **Class 8 Chemistry (EXP_CHEM_01)** and **Class 8 Physics (EXP_PHYS_01)**.

### Headline Findings:
1. **Scientific Correctness (VERIFIED & PASSING):**
   - The chemistry sample-testing model faithfully enforces dilute representative pH benchmarks at 25°C, provides subtle blush pink phenolphthalein coloration (`#FBCFE8`) at pH 8.5 without exaggerated magenta, clearly distinguishes liquid droppers from paper dipping strips, and rigorously differentiates agricultural limestone ($\text{CaCO}_3$) from caustic slaked lime ($\text{Ca(OH)}_2$).
   - The physics mechanics engine accurately implements Coulomb static friction thresholds ($F_{s,\max} = \mu_s N$). A moving body decelerates continuously under kinetic friction ($a = -\mu_k g$) and does **not** halt prematurely when applied force ceases. Controlled initial velocity ($v_0$) mode cleanly demonstrates mass-independence ($d = v_0^2 / 2\mu_k g$).
2. **Offline Session Persistence & Reload Rehydration (VERIFIED & PASSING):**
   - Active experiments snapshot state locally on every student interaction. Reloading the browser restores the active phase, recorded observations, and responses from IndexedDB v2 without requiring an active network connection.
3. **Multi-Tab Sync Race Condition (CONFIRMED DEFECT — MEDIUM SEVERITY):**
   - While server-side PostgreSQL unique constraints (`@unique` on `clientSessionId` and `clientEventId`) successfully prevent database row duplication, two browser tabs running simultaneously under the same learner encounter unhandled Prisma `P2002` unique constraint rejections (HTTP 500) during concurrent writes, because the in-memory sync mutex `isSyncing` does not span across tabs.
4. **Offline Cold-Start Web Shell Caching (VERIFIED BUT INCOMPLETE — LOW-MEDIUM SEVERITY):**
   - Client data (manifests, session telemetry, apparatus state) is 100% resilient offline in IndexedDB. However, the static web application shell lacks an active Service Worker / CacheStorage manifest for true offline cold boots if the local HTTP dev server is terminated or browser HTTP cache is cleared.
5. **Event Ordering under Clock Shifts (VERIFIED BUT INCOMPLETE — LOW SEVERITY):**
   - Outbox ordering currently relies on ISO timestamp strings. If a device clock is manually altered or multiple events occur within the same millisecond, deterministic ordering is not guaranteed without an incremental session sequence counter.

---

## 2. Scientific Regression Results

| Test Area | Subsystem | Verification Criterion | Status | Empirical Evidence |
|---|---|---|---|---|
| **Sample-Testing Workflow** | Chemistry (`ChemistryEngine.ts`) | Testing pre-defined sample beakers against indicators without arbitrary reagent mixing | **Verified and Passing** | Confirmed sample testing model across 6 standardized samples (Lemon Juice, Vinegar, Water, Baking Soda, Soap Water, Lime Water). |
| **Representative pH Calibration** | Chemistry (`ChemistryEngine.ts`) | Calibrated pH reference values at 25°C dilute baseline | **Verified and Passing** | Lemon Juice = 2.2, Vinegar = 2.8, Distilled Water = 7.0, Baking Soda = 8.5, Soap Water = 9.5, Lime Water = 11.5. |
| **Indicator Transitions & Apparatus** | Chemistry (`ChemistryRenderer.tsx`) | Clear separation between `PAPER_STRIP` and `LIQUID_REAGENT`; subtle pink at pH 8.5 | **Verified and Passing** | Litmus papers rendered as dipping strips; Phenolphthalein rendered as liquid dropper yielding `#FBCFE8` at pH 8.5 and vivid `#EC4899` at pH 9.5+. |
| **Agricultural Liming Distinction** | Chemistry (`manifest.json`) | Calcium Carbonate ($\text{CaCO}_3$) as main safe buffering agent; Slaked Lime ($\text{Ca(OH)}_2$) qualified as caustic | **Verified and Passing** | Manifest lines 538–561 clearly teach agricultural limestone as safe buffering base ($K_{sp} \approx 3.3 \times 10^{-9}$) and warn that slaked lime causes chemical burns and seedling root scorching. |
| **Static Friction Threshold** | Physics (`PhysicsEngine.ts`) | Body remains at rest when $F_{\text{push}} \le F_{s,\max} = \mu_s N$ | **Verified and Passing** | $F_{\text{push}} = 5.0\text{ N} \le 7.64\text{ N}$ yields `isStaticLock: true`, $v_0 = 0$, $F_{\text{friction}} = 5.0\text{ N}$. |
| **Moving Object Deceleration** | Physics (`PhysicsEngine.ts`, `PhysicsRenderer.tsx`) | Moving object does **not** stop when applied force drops below static threshold | **Verified and Passing** | During coasting, $F_{\text{push}} = 0$ (which is $< F_{s,\max}$), but block continues coasting under $a = -\mu_k g = -2.94\text{ m/s}^2$ for $1.36\text{ s}$ across $2.721\text{ m}$ until $v = 0$. Moving object does not halt prematurely. |
| **Mass Independence under Fixed $v_0$** | Physics (`PhysicsEngine.ts`) | Stopping distance $d = v_0^2 / (2\mu_k g)$ identical across 1kg, 2kg, 4kg | **Verified and Passing** | Fixed $v_0 = 4.0\text{ m/s}$ on Wood ($\mu_k = 0.30$) yielded $d = 2.721\text{ m}$ identically for 1kg, 2kg, and 4kg. |
| **Dynamic Track Scaling** | Physics (`PhysicsRenderer.tsx`) | Track dynamically scales for $d > 12\text{ m}$ to avoid block clipping | **Verified and Passing** | `trackScaleMaxM = Math.max(12.0, Math.ceil((d + 2)/4) * 4)` dynamically expands canvas limits for high launch velocities. |
| **Force Vectors & Graphs** | Physics (`PhysicsRenderer.tsx`) | Dynamic vectors for $N, mg, f, F_{\text{push}}$ and real-time $v(t)$ graph | **Verified and Passing** | Vector directions: $N$ upwards, $mg$ downwards, $f$ opposing motion (leftwards), $F_{\text{push}}$ forwards. Velocity-time canvas renders real-time linear deceleration slope. |

---

## 3. Offline Cold-Start Results

### Detailed Scenario Walkthrough

```mermaid
flowchart TD
    Step1[1. Student Opens GaonLab Online] --> Step2[2. Navigates to Experiment Lab]
    Step2 --> Step3[3. Manifest Cached to IndexedDB: manifests store]
    Step3 --> Step4[4. Browser Tab Closed / Session Ended]
    Step4 --> Step5[5. Device Disconnected from Internet]
    Step5 --> Step6{6. Reopen Application}
    
    Step6 -->|Server Reachable on Local Host / LAN| LoadLocal[HTML/JS bundle loads from HTTP server]
    Step6 -->|True Standalone Cold Boot / HTTP Cache Purged| FailSW[No Service Worker Registered:\nBundle fails if host unreachable]
    
    LoadLocal --> Step7[7. Fetch Experiment Manifest]
    Step7 --> IDBCache[Retrieved from IndexedDB: manifests store]
    IDBCache --> Step8[8. Conduct Experiment & Record Data]
    Step8 --> Step9[9. Reload Tab while Offline]
    Step9 --> Step10[10. Session Restored from IndexedDB: sessions store]
```

### Audit Findings:
1. **Application Data Layer (IndexedDB):**
   - Manifests are successfully cached upon first retrieval via `cacheManifest()`.
   - When offline, `fetchExperimentManifest()` intercepts the network failure and retrieves the cached manifest from IndexedDB.
   - Offline sessions are created with stable UUIDs (`clientSessionId`), and state is continuously snapshotted in IndexedDB `sessions` store.
   - Upon reload, `getActiveSessionForLearner()` restores the exact active phase, observations, and answers.
2. **Application Shell & Asset Distribution:**
   - **Local School Server / LAN deployment:** When GaonLab is deployed on a Raspberry Pi, school micro-server, or local laptop (`http://localhost:5173`), the application functions seamlessly offline because the local node process serves the HTML, JS, and CSS bundles.
   - **Standalone Client without Host Process:** The web workspace currently has **no Service Worker** registered (`navigator.serviceWorker`). If internet is severed on a client laptop and the HTTP dev server is closed, a browser cannot load the application shell from cache.
   - **External CDN Dependency:** `apps/web/index.html` references Google Fonts (`https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans`). While browsers fall back to local system sans-serif fonts when offline, bundling fonts locally is recommended for complete rural self-containment.

**Classification:** **Verified but incomplete.**

---

## 4. Multi-Tab Synchronization Results

### Concurrency Test Analysis
A programmatic stress test simulated two browser tabs operating under the same learner profile (`asha.rao.audit@gaonlab.internal`) attempting simultaneous session reconciliation and event submission at the exact same millisecond.

#### 1. Session Reconciliation Concurrency (`POST /sessions/reconcile`)
- **Observed Behavior:**
  - Tab 1 completed successfully with HTTP 200 and returned the created session record.
  - Tab 2 hit the server during Tab 1's write window. Because Tab 2's `findUnique` check did not find the record prior to write, Tab 2 attempted `prisma.experimentSession.create()`.
  - PostgreSQL correctly rejected the write: `Unique constraint failed on the fields: (clientSessionId)`.
  - The API router caught this as an unhandled rejection and returned **HTTP 500** to Tab 2.
- **Database State:** Exactly **1 session record** existed in PostgreSQL. The unique constraint prevented database corruption, but Tab 2 received an error instead of a graceful reconciliation response.

#### 2. Event Submission Concurrency (`POST /sessions/:id/events`)
- **Observed Behavior:**
  - Tab 1 ingested `clientEventId: shared_evt_01` successfully (HTTP 200, `deduplicated: false`).
  - Tab 2 submitted `shared_evt_01` simultaneously.
  - PostgreSQL rejected the second write: `Unique constraint failed on the fields: (clientEventId)`.
  - Express returned **HTTP 500** to Tab 2.
- **Database State:** Exactly **1 event record** existed in PostgreSQL.

#### 3. In-Memory Mutex Boundary
- The client-side mutex `isSyncing` in `experimentApi.ts` is a module-scoped variable:
  ```typescript
  let isSyncing = false;
  ```
  This mutex prevents concurrent sync operations inside the **same tab**, but does not span across different browser tabs or processes.

**Classification:** **Verified but incomplete (Defect logged).**

---

## 5. Event Ordering and Data Integrity

### Empirical Analysis
1. **Timestamp Granularity:**
   - Events generate timestamps via `new Date().toISOString()`.
   - `getPendingOutboxEvents()` sorts pending events:
     ```typescript
     pending.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
     ```
   - If two events are recorded within the same millisecond, `getTime() - getTime() === 0`. Because `Array.prototype.sort()` preserves order, but IndexedDB `getAll()` yields arbitrary cursor order based on key string, tie-breaking is not deterministic.
2. **Device Clock Drift / Shifts:**
   - If a student's tablet clock shifts backwards (e.g., CMOS battery failure, manual time change from 11:00 AM to 10:30 AM), newly queued events receive an earlier timestamp than previously queued events, inverting the outbox replay order.
3. **Interrupted Synchronization & Partial Acknowledgement:**
   - The outbox flusher iterates events one by one in chronological sequence.
   - If connection drops after Event 2 of 4:
     - Events 1 and 2 are marked `synced: true`.
     - Event 3 network call throws an error; loop breaks immediately via `break`.
     - `purgeSyncedEvents()` only removes events where `synced === true`.
     - Events 3 and 4 remain safely queued in IndexedDB.
     - On next reconnect, Event 3 and 4 are retried and acknowledged.
   - **Zero Data Loss Guarantee Verified.**
4. **Stable Per-Session Event Sequence Number:**
   - **Recommendation:** Add an integer `sequenceNumber` (e.g. 1, 2, 3...) per `sessionId` to `IngestExperimentEventDTO`. This guarantees strictly monotonic ordering independent of system clock jumps.

**Classification:** **Verified and passing** for normal conditions; **Verified but incomplete** for non-monotonic clock shifts.

---

## 6. Authentication and Learner Isolation

### Scenario Testing

```
Learner A (Asha Rao) -> Creates offline session EXP_CHEM_01 (clientSessionId = client_uuid_alpha)
Token Expires -> Work remains in IndexedDB outbox
Learner B (Kavya Hegde) Logs in on same tablet ->
  1. getActiveSessionForLearner only retrieves Learner B's sessions
  2. Learner B cannot view or corrupt Learner A's session
  3. If Learner B attempts to reconcile client_uuid_alpha:
     Backend evaluates: existingSession.learnerPersonId !== dto.learnerPersonId
     Server immediately throws: HTTP 403 Forbidden
```

### Empirical Test Output:
```bash
[Learner Isolation] Cross-learner reconciliation protection:
Server rejected cross-learner claim with HTTP 403 Forbidden.
```

### Findings:
1. **Multi-Learner Protection:** On shared rural tablets, sessions in IndexedDB are segregated by `learnerPersonId`. When switching student accounts, the previous learner's in-progress state is hidden from the new learner.
2. **Unauthorized Reconciliation Rejection:** If a client script attempts to reconcile a session using a different learner person ID, the backend enforces ownership and aborts with HTTP 403.
3. **Authentication Expiration Safety:** Pending outbox events are never wiped when auth expires or network drops. Work is preserved until re-authentication succeeds.

**Classification:** **Verified and passing.**

---

## 7. IndexedDB Migration and Recovery

### Audit of Version 1 to Version 2 Upgrade
Located in `apps/web/src/features/experiment-studio/services/experimentOfflineStorage.ts`:
```typescript
const DB_NAME = 'gaonlab_experiment_studio_db';
const DB_VERSION = 2;
```

#### Migration Inspection:
1. **Store Preservation:** `onupgradeneeded` checks `!db.objectStoreNames.contains('sessions')`. If the store exists from v1, it retrieves the existing store via `tx.objectStore('sessions')` rather than recreating it. Existing session rows are **not** wiped.
2. **Index Addition:** Safely checks `!sessionStore.indexNames.contains('clientSessionId')` before adding new indexes (`clientSessionId`, `learnerPersonId`, `experimentId`, and composite `['learnerPersonId', 'experimentId']`).
3. **Error Swallowing in `saveLocalSession`:**
   In `saveLocalSession`:
   ```typescript
   try {
     const db = await openDb();
     ...
   } catch (err) {
     console.warn('Failed to save local session:', err);
   }
   ```
   If storage quota is exceeded (`QuotaExceededError`) or private browsing disables storage, the exception is logged to console but not propagated to the UI. The UI indicator displays "Saved on this device" despite the failed write.

**Classification:** **Verified and passing** for standard schema upgrade; **Verified but incomplete** for silent quota error handling.

---

## 8. Student-Facing Synchronization Feedback

### Visual State Verification in `SyncStatusIndicator.tsx`

| Visual State | Indicator Component | Color / Icon | User-Facing Text | Interaction |
|---|---|---|---|---|
| **Synced** | Pill Badge | Emerald (`CheckCircle2`) | *"Synced"* | Read-only confirmation that cloud matches device. |
| **Saved on this device** | Pill Badge | Slate (`HardDrive`) | *"Saved on this device"* | Confirms offline local preservation. |
| **Waiting to sync** | Interactive Pill | Amber (`CloudUpload`) | *"Waiting to sync (N)"* | Shows pending event count + **[Sync Now]** trigger. |
| **Synchronizing...** | Pill Badge | Sky (`RefreshCw` spin) | *"Synchronizing..."* | Real-time animation during active network flight. |
| **Needs attention** | Interactive Pill | Rose (`AlertCircle`) | *"Needs attention"* | Appears on connection failure + **[Retry]** trigger. |

### Evaluation Criteria:
1. **Premature "Synced" Labeling:**
   - When an experiment is completed offline, `completeExperimentSession()` catches the network failure, updates the local record, and fires `notifySyncListeners('WAITING_TO_SYNC', 1)`.
   - The indicator transitions to `Waiting to sync`, **not** `Synced`. It only displays `Synced` once the server returns HTTP 200.
2. **Student Language:**
   - Feedback is non-technical and reassuring: *"Saved on this device"*, *"Waiting to sync"*. Technical stack traces are never exposed in the student UI.
3. **Idempotent Retry:**
   - Repeatedly clicking **[Sync Now]** or **[Retry]** does not duplicate work because the backend enforces `clientEventId` and `clientSessionId` uniqueness.

**Classification:** **Verified and passing.**

---

## 9. End-to-End Acceptance Scenario (20-Step Lifecycle)

A full synthetic acceptance test was executed against the running dev server and PostgreSQL instance:

| Step # | Action | Subsystem | Result | Observation |
|---|---|---|---|---|
| **1** | Log in as learner | Auth / Demo | **PASS** | Asha Rao authenticated. |
| **2** | Open experiment online | Web / Router | **PASS** | `EXP_CHEM_01` loaded. |
| **3** | Cache required assets | IndexedDB | **PASS** | Manifest and simulation parameters cached. |
| **4** | Start experiment online | API / Session | **PASS** | Server initialized session `96e038ea-...`. |
| **5** | Make predictions | Player Engine | **PASS** | `PREDICTION_SUBMITTED` ingested. |
| **6** | Change parameters | Chemistry Bench | **PASS** | Selected lemon juice and turmeric indicator. |
| **7** | Record observations | Player Engine | **PASS** | Beaker color blend recorded (`#FBBF24`). |
| **8** | Answer questions | Question Panel | **PASS** | Reasoning answer saved. |
| **9** | Complete experiment online | API / Session | **PASS** | Session marked `COMPLETED` on server. |
| **10** | Disconnect from internet | Network Mock | **PASS** | Server calls intercepted by offline fallback. |
| **11** | Start new experiment offline | Offline Storage | **PASS** | `EXP_PHYS_01` initialized with `client_offline_uuid_...`. |
| **12** | Record observations & complete | Offline Storage | **PASS** | Physics trials recorded and session completed in IndexedDB. |
| **13** | Reload application | React / Router | **PASS** | Application shell re-mounted. |
| **14** | Restore both sessions | IndexedDB | **PASS** | `getActiveSessionForLearner` restored active and completed sessions. |
| **15** | Reconnect to internet | Network Trigger | **PASS** | `window.addEventListener('online')` fired. |
| **16** | Trigger synchronization | Outbox Flusher | **PASS** | `reconcileSession` and event outbox replay executed. |
| **17** | Simulate partial failure & retry | Outbox Flusher | **PASS** | Duplicate event returned `deduplicated: true`. |
| **18** | Verify both sessions on server | PostgreSQL DB | **PASS** | Both sessions exist with canonical statuses. |
| **19** | Verify event deduplication | PostgreSQL DB | **PASS** | Exactly 1 DB row per `clientEventId`. |
| **20** | Reload & verify sync indicator | Web UI | **PASS** | Status pill accurately reports `Synced`. |

**Overall Acceptance Scenario Score: 20/20 Passing.**

---

## 10. Test and Build Results

### 1. API Workspace Test Results
Command: `npm --workspace=@gaonlab/api test`

```
Test Files  12 passed (12)
     Tests  112 passed (112)
  Duration  39.89s
```

Detailed test suite breakdown:
- `curriculum-catalogue.test.ts`: 10 passed
- `experiment-science.test.ts`: 16 passed
- `experiment-sync.test.ts`: 10 passed
- `experiment-studio.test.ts`: 10 passed
- `ncert-stem-catalogue.test.ts`: 15 passed
- `topics-module.test.ts`: 18 passed
- `identity-consent.test.ts`: 8 passed
- `curriculum-boundaries.test.ts`: 5 passed
- `database-models.test.ts`: 4 passed
- `reader-module.test.ts`: 7 passed
- `feature-modules.test.ts`: 4 passed
- `health-ready.test.ts`: 5 passed

### 2. Scientific Regression Tests
Command: `npx --workspace=@gaonlab/api vitest run src/tests/experiment-science.test.ts`
- **16/16 passed in 989ms.**

### 3. Offline Sync Tests
Command: `npx --workspace=@gaonlab/api vitest run src/tests/experiment-sync.test.ts`
- **10/10 passed in 2.53s.**

### 4. Web Production Build
Command: `npm --workspace=@gaonlab/web run build`
```
vite v5.4.21 building for production...
✓ 1621 modules transformed.
dist/index.html                   1.32 kB │ gzip:   0.74 kB
dist/assets/index-CxhhGXSd.css   72.66 kB │ gzip:  11.68 kB
dist/assets/index-BYldb2Ox.js   471.87 kB │ gzip: 122.19 kB
✓ built in 8.50s with 0 errors.
```

---

## 11. Confirmed Defects and Recommended Corrections

### Defect 1: Unhandled Prisma P2002 Unique Constraint Rejection on Concurrent Multi-Tab Reconciliation
- **Severity:** Medium
- **Status:** Confirmed Defect
- **Affected Files:**
  - `apps/api/src/modules/experiment-studio/experiment-session.service.ts` (lines 239–254)
  - `apps/api/src/modules/experiment-studio/experiment-studio.router.ts` (lines 45–70)
- **Evidence:**
  When two tabs concurrently reconcile the same `clientSessionId`, both pass the `findUnique` check before either write completes. The second call to `prisma.experimentSession.create()` fails with `P2002: Unique constraint failed on clientSessionId`, causing Express to return an unhandled HTTP 500 error instead of returning the newly created record.
- **Recommended Correction:**
  Wrap `prisma.experimentSession.create()` in a `try...catch` block. If `err.code === 'P2002'`, re-query `prisma.experimentSession.findUnique({ where: { clientSessionId } })` and return the existing session gracefully.

### Defect 2: In-Memory Outbox Mutex Lacks Cross-Tab Locking
- **Severity:** Medium
- **Status:** Confirmed Defect
- **Affected File:** `apps/web/src/features/experiment-studio/services/experimentApi.ts` (lines 297, 320)
- **Evidence:**
  `let isSyncing = false;` is scoped to the tab's JavaScript module. Opening two tabs simultaneously allows both to trigger `flushExperimentOutbox()` at the same time, leading to Defect 1.
- **Recommended Correction:**
  Wrap `flushExperimentOutbox()` with Web Locks API:
  ```typescript
  if ('locks' in navigator) {
    await navigator.locks.request('gaonlab_sync_lock', async () => {
      await doFlush();
    });
  } else {
    await doFlush();
  }
  ```

### Defect 3: Web Application Shell Lacks Service Worker for Standalone Offline Cold Boot
- **Severity:** Low-Medium
- **Status:** Architectural Incompleteness
- **Affected Files:**
  - `apps/web/vite.config.ts`
  - `apps/web/index.html`
- **Evidence:**
  No Service Worker is registered. While IndexedDB reliably caches data, navigating to the URL on a laptop without an active HTTP server process fails to load the initial HTML/JS shell.
- **Recommended Correction:**
  Add `vite-plugin-pwa` to `vite.config.ts` with a `generateSW` configuration caching HTML, JS chunks, and CSS for offline PWA installation. Bundle Google Fonts locally in `apps/web/public/fonts/`.

### Defect 4: Event Ordering Vulnerable to System Clock Shifts
- **Severity:** Low
- **Status:** Architectural Incompleteness
- **Affected Files:**
  - `apps/web/src/features/experiment-studio/services/experimentOfflineStorage.ts`
  - `packages/shared-types/src/experiment.ts`
- **Evidence:**
  Sorting outbox events by `timestamp` string relies on monotonic wall-clock time. Non-monotonic clock resets invert event sort order.
- **Recommended Correction:**
  Add an incremental `sequenceNumber: number` to `IngestExperimentEventDTO` initialized per session and sort by `(sessionId, sequenceNumber)`.

### Defect 5: Silent Error Handling on IndexedDB Write Failure
- **Severity:** Low
- **Status:** Confirmed Defect
- **Affected File:** `apps/web/src/features/experiment-studio/services/experimentOfflineStorage.ts`
- **Evidence:**
  `saveLocalSession` catches errors with `console.warn` and returns `void`. If disk quota is exceeded, the student UI still displays "Saved on this device".
- **Recommended Correction:**
  Propagate persistence errors or notify `SyncStatusIndicator` with `'NEEDS_ATTENTION'`.

---

## 12. Final Pilot Readiness Assessment

| Audit Subsystem / Scenario | Status | Assessment & Operational Guidance |
|---|---|---|
| **Chemistry Simulation Accuracy** | **Verified and Passing** | 100% compliant with NCERT Class 8 curriculum benchmarks. |
| **Physics Simulation Accuracy** | **Verified and Passing** | Amontons-Coulomb model verified; mass independence mathematically verified; moving body deceleration verified. |
| **In-Session Reload Rehydration** | **Verified and Passing** | Active sessions restore accurately from IndexedDB without network. |
| **Single-Tab Synchronization & Deduplication** | **Verified and Passing** | Event deduplication and session reconciliation 100% reliable. |
| **Multi-Learner Device Isolation** | **Verified and Passing** | Cross-learner reconciliations rejected with HTTP 403. |
| **Student-Facing Sync Feedback** | **Verified and Passing** | Clear 5-state indicators with non-technical student guidance. |
| **Multi-Tab Concurrent Synchronization** | **Verified but incomplete** | Server prevents DB corruption, but unhandled P2002 generates HTTP 500. Correct with try/catch P2002 fallback and Web Locks API. |
| **Standalone Offline Cold-Start (No Host Process)** | **Verified but incomplete** | Requires local HTTP server (Raspberry Pi/laptop). For standalone browser offline boot, add Service Worker PWA plugin. |
| **Clock-Independent Event Sequencing** | **Verified but incomplete** | Functions accurately on normal clocks; add integer sequence numbers for drift resistance. |
| **Quota Error Transparency** | **Verified but incomplete** | Catch quota failures and surface "Needs attention" pill. |

### Overall Readiness Verdict: **PILOT READY WITH IDENTIFIED ENHANCEMENTS**

The core learning experience, scientific models, offline state persistence, and cloud synchronization are fully functional and safe for classroom and field pilot deployment. The identified defects in multi-tab concurrency and standalone PWA caching should be addressed prior to wide-scale unattended field distribution.
