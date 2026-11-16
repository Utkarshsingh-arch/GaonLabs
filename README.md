# GaonLab (गाँव लैब)

> **Personalised, Offline-First STEM Education Ecosystem for Rural and Underserved Learners**  
> *Connecting Formal School Curricula with Everyday Experiential Science*

---

## Overview

**GaonLab** is an offline-first STEM education platform designed primarily for middle school students (Grades 6–8) in rural and underserved communities across India. Rather than replicating conventional lecture-and-quiz EdTech platforms, GaonLab turns a student's living environment—their village, farmland, local flora, fauna, tools, and rural infrastructure—into an experiential scientific laboratory.

### Core Architectural Chain
$$\text{Curriculum} \longrightarrow \text{Concepts} \longrightarrow \text{Resources} \longrightarrow \text{Learning Activities} \longrightarrow \text{Assessment} \longrightarrow \text{Student Understanding}$$

---

## Architectural & Project Documentation

All foundational specifications, architectural designs, and implementation roadmaps are documented in detail:

| Document | Description |
| :--- | :--- |
| **[PROJECT_CONTEXT.md](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/PROJECT_CONTEXT.md)** | **Persistent source of truth** for all development workflows, tech stack definitions, 26-feature scope matrix, and guidelines for engineers and AI agents. |
| **[docs/PRODUCT_OVERVIEW.md](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/docs/PRODUCT_OVERVIEW.md)** | **Application specification**, user personas, complete 26-feature deep dive, ecosystem interconnectivity, and government initiative alignment. |
| **[docs/BASE_ARCHITECTURE.md](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/docs/BASE_ARCHITECTURE.md)** | **Technical architecture**, 9 modular monolith domains, Mermaid diagrams, `LearnerContext` design, `resolveStudentCurriculum` pipeline, DPDP guardian consent flows, and offline sync foundation. |
| **[docs/BASE_SCOPE_AND_ROADMAP.md](file:///home/utkarsh-singh-parihar/Projects/GaonLabs/docs/BASE_SCOPE_AND_ROADMAP.md)** | **Foundational base scope**, explicit exclusions, sequential delivery roadmap (Stages 0–6+), acceptance criteria, and government integration maturity matrix. |

---

## Foundational Technology Stack

- **Frontend:** React 18+, Vite, TypeScript, Tailwind CSS, Workbox (PWA / Service Workers), Dexie.js (IndexedDB)
- **Backend:** Node.js 22 LTS, Express, TypeScript, Prisma ORM, Zod validation
- **Database:** PostgreSQL 16 (Modular schema isolation)
- **External Integration:** Provider-agnostic Government Integration Gateway (`LIVE`, `CACHED`, `MOCK`, `OFF` modes) supporting Bhashini, DIKSHA, and UDISE+

---

## Current Status & Next Steps

- **Current Stage:** **Stage 0 (Repository Context & System Design) — Completed**
- **Next Stage:** **Stage 1 (Core Monolith Foundation & Database Scaffolding)** *(Awaiting user review and authorization)*
