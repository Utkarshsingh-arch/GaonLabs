# GaonLab Village Explorer (Feature 21: STEM Village Living Lab)

> **"The Village as a Living Laboratory"**  
> An offline-first, multilingual 2D top-down STEM educational game designed for Grades 6–8 students in rural and semi-urban India. Instead of teaching science through abstract formulas alone, GaonLab connects physics, chemistry, biology, and mathematics directly to village infrastructure.

---

## 🌟 Highlights & Features

- **Gather.town-Style 2D Village Map**: Built in Phaser 3 with 40×30 tilemap, procedural 8-direction pre-rendered 3D-feel avatar sprite sheet, normalized diagonal movement ($150/\sqrt{2}\approx 106\text{ px/s}$), camera tracking, and physics collisions.
- **Dual Controls**: Desktop WASD / Arrow keys and mobile-first floating Virtual Joystick.
- **6 Living STEM Labs**:
  1. 🏠 **Village House Lab**: Vernacular architecture, convective ceiling vents, high-albedo lime whitewash reflection, and rainwater harvesting volume calculations ($V = A \times R \times C$).
  2. 🪣 **Community Well Lab**: Simple machines, single fixed & movable pulleys, mechanical advantage ($\text{MA} = \text{Load} / \text{Effort}$), and groundwater tables.
  3. 🌾 **Agricultural Farm Lab**: Crop spacing geometry, plant population density, and 50% water savings with precision drip irrigation over flood irrigation.
  4. 💧 **Overhead Water Tank Lab**: Hydrostatic fluid mechanics ($P = \rho gh$), Torricelli's outflow velocity ($v = \sqrt{2gh}$), and gravity-fed distribution.
  5. ☀️ **Solar Array Lab**: Photovoltaic power ($P = VI$), sun zenith elevation angles ($\sin\theta$), and dust layer attenuation losses.
  6. 🧪 **Soil Chemistry Lab**: Universal indicator color strip, soil pH testing, and chemical neutralization using agricultural lime ($\text{CaCO}_3$) and gypsum ($\text{CaSO}_4$).
- **6 Interactive SVG Simulation Widgets**: Embedded real-time interactive parameter sliders directly inside lab panels for experiential hands-on discovery.
- **42 Curated STEM Questions across Grades 6–8**:
  - Multiple Choice (MCQ) & Real-World Scenarios
  - Fill in the Blank (with flexible spelling & language synonyms)
  - Numeric Calculation (with tolerance and unit validation)
  - Open-Ended Rubric Evaluation (graded by local AI proxy)
- **🤖 Mitra — Village STEM Guide**: Companion guide and tutorial assistant providing grade-specific tips, structure science summaries, and motivational encouragement.
- **AI Server Proxy & Prompt Injection Defense**:
  - Express server on `localhost:8787` supporting Google Gemini, Ollama, and local deterministic Mock providers.
  - Strict system prompt guardrails defending against instruction override / prompt injection attempts.
  - Per-session rate limiting (30 requests/hr) and 24-hour evaluation cache.
  - 8-second client timeout with graceful offline fallback to model answers.
- **Multilingual (English, हिन्दी, ಕನ್ನಡ)**:
  - Complete i18n support across all UI chrome, HUD, prompts, labs, hints, and feedback.
- **Offline-First & Privacy Conscious (DPDP Act 2023)**:
  - Local persistence via Dexie.js (IndexedDB) with memory fallback for headless testing.
  - No PII collected (only local nickname and grade).
  - XP progression, mastery radar, and 6 collectible STEM badges.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd apps/village-explorer
npm install
```

### 2. Start Development Server
Starts both the Vite frontend (`http://localhost:5173`) and the AI proxy (`http://localhost:8787`) concurrently:
```bash
npm run dev
```

Or run them individually:
```bash
# Frontend only
npm run dev:client

# Express AI proxy only
npm run dev:server
```

### 3. Run Tests
Runs the full Vitest suite (9 test suites covering avatar movement, collision physics, local grading, AI evaluator & prompt injection defenses, Dexie store, interactive simulations, i18n accessibility, and integration smoke tests):
```bash
npm run test
```

### 4. Validate Question Bank Content
Validates all 42 curriculum questions across all zones, grades, languages, options, accepted blanks, and progressive hints:
```bash
npm run validate:bank
```

### 5. Production Build
Typechecks with strict TypeScript compiler and bundles production assets:
```bash
npm run build
```

---

## 📁 Repository Architecture

```
apps/village-explorer/
├── public/
│   ├── assets/
│   │   ├── tilesets/       # Generated procedural tilesets
│   │   └── characters/     # 8-direction pre-rendered avatar sprite sheets
│   └── maps/
│       └── village.json    # 40x30 Tiled JSON tilemap with zones object layer
├── server/                 # Node.js Express AI Proxy
│   ├── index.ts            # Express application mounting /api/ai
│   ├── prompts.ts          # Zod evaluation schemas & safe system prompts
│   ├── rateLimit.ts        # 30 req/hr session rate limiter & 24h cache
│   └── providers/
│       ├── provider.ts     # AiProvider interface
│       ├── mock.ts         # Deterministic mock provider with injection defense
│       ├── gemini.ts       # Google Gemini API provider
│       └── ollama.ts       # Local Ollama LLM provider
├── src/
│   ├── game/               # Phaser 3 Game Engine
│   │   ├── config.ts       # Phaser game config
│   │   ├── eventBus.ts     # Decoupled typed event bus
│   │   ├── scenes/         # BootScene & VillageScene
│   │   └── systems/        # Avatar, InputSystem, ZoneSystem
│   ├── learning/           # Curriculum & Grading Engine
│   │   ├── types.ts        # Typed STEM schemas (Question, Zone, Grade, Lang)
│   │   ├── localGrader.ts  # Deterministic local evaluation engine
│   │   ├── aiClient.ts     # Resilient client for AI evaluation with offline fallback
│   │   └── questionBank/   # 42 NCERT-aligned questions across 6 village zones
│   ├── storage/            # Dexie.js Persistence
│   │   ├── db.ts           # IndexedDB schemas (profile, labs, mastery, badges)
│   │   └── progressStore.ts# Profile, XP, and badge unlocking state machine
│   ├── i18n/               # Centralized Internationalization
│   │   └── translations.ts # Typed dictionaries for en, hi, kn
│   ├── ui/                 # React UI Chrome
│   │   ├── hud/            # VirtualJoystick, ZonePrompt, HUD bar
│   │   ├── lab/            # LabPanel, QuestionRenderer, HintLadder, OpenAnswer
│   │   │   └── demos/      # 6 Interactive SVG Simulation Widgets
│   │   ├── mitra/          # MitraHelper companion dialog
│   │   └── screens/        # StartScreen & ProgressScreen
│   └── tests/              # 9 Vitest Unit & Integration Suites
└── scripts/
    ├── generateMap.ts      # Automated procedural tilemap generator
    └── validateQuestionBank.ts # Strict question bank validator
```
