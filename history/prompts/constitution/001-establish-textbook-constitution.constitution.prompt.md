---
id: 001
title: Establish Textbook Constitution
stage: constitution
date: 2025-12-15
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: main
user: MuhammadRaedSiddiqui
command: /sp.constitution
labels: ["constitution", "setup", "docusaurus", "tailwind", "typescript"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - null
---

## Prompt

Establish the configuration for the "Physical AI & Humanoid Robotics Textbook".

**1. Technology Stack (Immutable)**
- **Framework:** Docusaurus v3 (React 18+).
- **Language:** TypeScript (.tsx) is preferred, but JavaScript (.js) is acceptable for config files.
- **Styling:** **Tailwind CSS** (via PostCSS) is the primary styling engine. Do not use CSS Modules unless necessary for third-party overrides.
- **Animation:** Framer Motion (default), GSAP (complex sequences), Three.js (WebGL).

**2. Architectural Principles**
- **Component-Driven:** All UI elements must be modular React components located in `src/components/`.
- **"React Bits" Protocol:** We are using the "React Bits" library pattern. These components are NOT installed via npm. They are **manually created** files in `src/components/react-bits/`. The Agent must write the full source code for these when requested.

**3. Critical Coding Rules (The "Anti-Crash" Laws)**
- **SSR Safety:** Docusaurus is a Static Site Generator (SSG).
    - **Rule:** NEVER use `window`, `document`, or `navigator` at the top level of a component.
    - **Rule:** Any component using browser-only APIs (like Three.js, GSAP Draggable, or Face API) **MUST** be wrapped in Docusaurus's `<BrowserOnly>` component or imported dynamically with `{ ssr: false }`.
- **Swizzling:** Only swizzle components if styling via CSS is impossible. Prefer wrapping over ejecting.

**4. Visual Standards**
- **Theme:** "Sci-Fi HUD" (Heads-Up Display). Dark mode is the default.
- **Colors:** Primary: Cyan (#00f3ff), Warning: Amber (#ffb800), Background: Deep Black (#050505).

## Response snapshot

Created and ratified the project constitution v1.0.0 for the Physical AI & Humanoid Robotics Textbook with 6 core principles:

1. **Docusaurus-First Architecture** - SSG paradigm, build validation required
2. **SSR Safety (Anti-Crash Laws)** - Browser API guards, BrowserOnly wrappers mandatory
3. **Component-Driven Development** - Modular components in src/components/, React Bits manually created
4. **TypeScript-Preferred** - .tsx for components, explicit prop interfaces
5. **Tailwind-First Styling** - No CSS Modules except for theme overrides
6. **Conservative Swizzling Policy** - Wrap over eject, CSS first

Also established:
- Immutable technology stack table
- Visual standards (Sci-Fi HUD theme, dark-mode default, cyan/amber/black palette)
- Development workflow with quality gates
- Governance with semantic versioning

## Outcome

- ✅ Impact: Foundation document created - all future development must comply with these principles
- 🧪 Tests: N/A (constitution document, not code)
- 📁 Files: 1 file created/updated (.specify/memory/constitution.md)
- 🔁 Next prompts: Install Tailwind CSS, configure theme colors, create base React Bits components
- 🧠 Reflection: Constitution successfully captures SSR safety as highest priority - this will prevent common Docusaurus build failures

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Validate constitution compliance during first feature implementation
