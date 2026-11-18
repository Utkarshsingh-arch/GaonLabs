# Architectural and Design Decisions

| Date | Topic | Decision | Rationale |
|---|---|---|---|
| 2026-11-17 | Architecture location | Implemented as `@gaonlab/village-explorer` in `apps/village-explorer` | Seamless alignment with existing monorepo workspaces (`packages/*`, `apps/*`). |
| 2026-11-17 | 2D World with 3D-Look Character | Pre-rendered isometric/8-direction sprite sheets in Phaser 3 | Keeps bundle lightweight and 60fps on budget Android devices; avoids heavy Three.js runtime. |
| 2026-11-17 | Hybrid AI & Local Grading | MCQ, fill-in-the-blank, and numeric questions are graded 100% locally and deterministically | Instant response, zero latency, 100% offline autonomy; AI reserved for open-ended rubric evaluations and Socratic hints. |
| 2026-11-17 | Event Bus Decoupling | Typed `eventBus.ts` for communication between Phaser canvas and React UI overlays | Phaser engine controls world rendering, collision, and camera; React controls accessible DOM overlays, i18n, and modals. |
| 2026-11-17 | Child Privacy | No PII sent to AI or stored externally; anonymous local nickname in Dexie | Strict compliance with DPDP Act 2023 for minor learners. |
