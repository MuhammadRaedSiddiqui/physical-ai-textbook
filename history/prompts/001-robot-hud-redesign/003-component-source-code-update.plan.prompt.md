---
id: 003
title: Component Source Code Implementation
stage: plan
date: 2025-12-15
surface: agent
model: claude-sonnet-4-5
feature: 001-robot-hud-redesign
branch: 001-robot-hud-redesign
user: system
command: /sp.plan
labels: ["implementation", "components", "gsap", "framer-motion", "react-bits"]
links:
  spec: specs/001-robot-hud-redesign/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-robot-hud-redesign/plan.md
  - specs/001-robot-hud-redesign/research.md
  - specs/001-robot-hud-redesign/quickstart.md
  - src/components/react-bits/Crosshair.tsx
  - src/components/react-bits/GridScan.tsx
  - src/components/react-bits/SpotlightCard.tsx
  - src/components/react-bits/DecryptedText.tsx
  - src/components/react-bits/CardSwap.tsx
  - src/components/react-bits/index.ts
tests:
  - N/A (components created - awaiting yarn build SSR validation)
---

## Prompt

User requested update to Implementation Plan to include specific source code for custom components:

1. Dependency Action Plan: Install gsap, framer-motion, clsx, tailwind-merge
2. Component Implementation: Create 5 React Bits components with exact provided code:
   - Crosshair.tsx - Global cursor with converging crosshairs
   - GridScan.tsx - Canvas-based scanning grid background
   - SpotlightCard.tsx - Cards with hover glow effect
   - DecryptedText.tsx - Text unscramble animation on hover
   - CardSwap.tsx - Stacked cards with GSAP swap animation

User provided exact implementation code for each component.

## Response snapshot

Successfully updated implementation plan and created all 5 React Bits components:

**Files Updated:**
- `specs/001-robot-hud-redesign/plan.md` - Added Dependency Action Plan section and Component Source Code section with all 5 implementations + integration examples
- `specs/001-robot-hud-redesign/research.md` - Updated dependencies to reflect simplified install (7 packages vs original 10)
- `specs/001-robot-hud-redesign/quickstart.md` - Updated install command and file structure

**Files Created:**
- `src/components/react-bits/Crosshair.tsx` - BrowserOnly wrapped, GSAP-powered crosshair cursor
- `src/components/react-bits/GridScan.tsx` - BrowserOnly wrapped, Canvas 2D animated grid
- `src/components/react-bits/SpotlightCard.tsx` - Pure React hover spotlight effect
- `src/components/react-bits/DecryptedText.tsx` - framer-motion powered text scramble
- `src/components/react-bits/CardSwap.tsx` - GSAP timeline card stack animation
- `src/components/react-bits/index.ts` - Barrel export file

**Key Changes from Original Plan:**
- Removed Three.js dependency (GridScan uses Canvas 2D instead)
- Removed @gsap/react (using plain GSAP with useEffect)
- Added SpotlightCard component (not in original spec)
- Simplified dependency count from 10 to 7

## Outcome

- ✅ Impact: Component source code now included in plan, actual files created on disk
- 🧪 Tests: Pending - run `yarn build` to verify SSR safety
- 📁 Files: 6 component files created, 3 spec files updated
- 🔁 Next prompts: Run `/sp.tasks` to generate implementation tasks, then integrate components into Root.tsx and index.tsx
- 🧠 Reflection: User-provided implementations simplified architecture by using Canvas 2D instead of Three.js, reducing bundle size and complexity

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): User-provided exact code injection
- Next experiment: Verify components work with `yarn build` before proceeding to integration
