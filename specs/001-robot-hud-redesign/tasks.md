# Tasks: Robot HUD Frontend Redesign

**Input**: Design documents from `/specs/001-robot-hud-redesign/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Manual visual testing + `yarn build` SSR validation (per plan.md)

**Organization**: Tasks grouped by user story from spec.md for independent implementation and testing.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions (Docusaurus Frontend)

- **Components**: `src/components/react-bits/`
- **CSS**: `src/css/`
- **Pages**: `src/pages/`
- **Theme**: `src/theme/`
- **Config**: Repository root (`tailwind.config.js`, `docusaurus.config.ts`)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and configure Tailwind CSS for Docusaurus

- [x] T001 Install required dependencies: `yarn add gsap framer-motion clsx tailwind-merge tailwindcss postcss autoprefixer`
- [x] T002 [P] Create `tailwind.config.js` at repository root with HUD theme colors (#00f3ff, #ffb800, #050505) and font families (Orbitron, Rajdhani, JetBrains Mono)
- [x] T003 [P] Add Tailwind PostCSS plugin to `docusaurus.config.ts` plugins array
- [x] T004 [P] Add Google Fonts preconnect and stylesheet links to `docusaurus.config.ts` headTags
- [x] T005 Add Tailwind directives (@tailwind base/components/utilities) to top of `src/css/custom.css`
- [x] T006 Verify setup with `yarn build` - must complete without errors

**Checkpoint**: Tailwind CSS operational, dependencies installed, ready for component integration

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Components are pre-created in `src/components/react-bits/` - verify they exist and integrate Crosshair globally

**⚠️ CRITICAL**: Global Crosshair must be integrated before user story work begins

- [x] T007 Verify `src/components/react-bits/Crosshair.tsx` exists and matches plan.md source
- [x] T008 [P] Verify `src/components/react-bits/GridScan.tsx` exists and matches plan.md source
- [x] T009 [P] Verify `src/components/react-bits/DecryptedText.tsx` exists and matches plan.md source
- [x] T010 [P] Verify `src/components/react-bits/SpotlightCard.tsx` exists and matches plan.md source
- [x] T011 [P] Verify `src/components/react-bits/CardSwap.tsx` exists and matches plan.md source
- [x] T012 [P] Verify `src/components/react-bits/index.ts` barrel export exists
- [x] T013 Update `src/theme/Root.tsx` to import and render Crosshair component globally (FR-006)
- [x] T014 Run `yarn build` to verify SSR safety of all components (SC-003)

**Checkpoint**: Foundation ready - all components verified, Crosshair globally active, SSR-safe build passes

---

## Phase 3: User Story 1 - First-Time Visitor Immersion (Priority: P1) 🎯 MVP

**Goal**: New visitor lands on homepage and immediately experiences futuristic Robot HUD aesthetic with GridScan background, crosshair cursor, and DecryptedText title animation.

**Independent Test**: Load homepage at `http://localhost:3000/physical-ai-textbook/` and verify:
1. Deep black (#050505) background visible
2. Animated grid scanning effect playing
3. Crosshair cursor follows mouse movement
4. Title displays with character-by-character decryption animation

**Acceptance Criteria** (from spec.md):
- AC1: Deep black background with animated CRT grid scanning effect
- AC2: Cursor replaced with robotic crosshair reticle
- AC3: Title displays with character-by-character "decryption" animation

### Implementation for User Story 1

- [x] T015 [US1] Update `src/css/custom.css` to set deep black (#050505) background for body and [data-theme="dark"] (FR-001)
- [x] T016 [US1] Update `src/css/custom.css` to add HUD color variables (--hud-cyan: #00f3ff, --hud-amber: #ffb800) (FR-002, FR-003)
- [x] T017 [US1] Redesign `src/pages/index.tsx` hero section with GridScan background component (FR-007)
- [x] T018 [US1] Add DecryptedText component to main heading in `src/pages/index.tsx` hero section (FR-009)
- [x] T019 [US1] Apply Tailwind classes for HUD styling to hero content (text-hud-cyan, bg-hud-black)
- [x] T020 [US1] Fix homepage CTA button link to correct path `/docs/01-module-1-ros2/week-01-intro`
- [x] T021 [US1] Run `yarn build` and verify SSR safety for homepage changes
- [ ] T022 [US1] Manual test: verify all 3 acceptance criteria pass in browser

**Checkpoint**: User Story 1 complete - Homepage displays full HUD aesthetic (MVP deliverable)

---

## Phase 4: User Story 2 - Documentation Navigation Experience (Priority: P2)

**Goal**: Learner navigates documentation with consistent HUD styling - technical typography, cyan accents on interactive elements, and smooth page transitions.

**Independent Test**: Navigate to any documentation page (e.g., `/docs/01-module-1-ros2/week-01-intro`) and verify:
1. Headers use Orbitron/Rajdhani fonts
2. Code blocks use JetBrains Mono
3. Interactive elements have cyan (#00f3ff) accent styling
4. Crosshair cursor persists across navigation

**Acceptance Criteria** (from spec.md):
- AC1: Headers use Orbitron/Rajdhani fonts, code uses JetBrains Mono (FR-004, FR-005)
- AC2: Cyan (#00f3ff) accents highlight interactive elements (FR-002)
- AC3: Page transitions use smooth Framer Motion animations (FR-011)

### Implementation for User Story 2

- [x] T023 [US2] Update `src/css/custom.css` to apply Orbitron font to all heading elements (h1-h6) (FR-004)
- [x] T024 [P] [US2] Update `src/css/custom.css` to apply Rajdhani font to body text (FR-004)
- [x] T025 [P] [US2] Update `src/css/custom.css` to apply JetBrains Mono to code blocks and pre elements (FR-005)
- [x] T026 [US2] Update `src/css/custom.css` to style links and buttons with cyan (#00f3ff) accent color (FR-002)
- [x] T027 [US2] Update `src/css/custom.css` to style code block backgrounds with HUD theme
- [x] T028 [US2] Add cyan focus states to all interactive elements for accessibility (SC-007)
- [x] T029 [US2] Verify crosshair cursor persists across page navigations (SC-004)
- [x] T030 [US2] Run `yarn build` and verify SSR safety for CSS changes
- [ ] T031 [US2] Manual test: verify all 3 acceptance criteria pass across multiple doc pages

**Checkpoint**: User Story 2 complete - Documentation pages have consistent HUD styling

---

## Phase 5: User Story 3 - Capstone Project Showcase (Priority: P3)

**Goal**: User explores capstone section and interacts with CardSwap gallery showing Sim-to-Real pipeline (Gazebo -> Isaac Sim -> Real Robot).

**Independent Test**: Navigate to capstone section and verify:
1. CardSwap gallery displays 3D stacked cards
2. Clicking cards triggers swap animation
3. Cards display Sim-to-Real pipeline stages

**Acceptance Criteria** (from spec.md):
- AC1: Stack of 3D cards displays Sim-to-Real stages (FR-010)
- AC2: Cards swap positions with GSAP animation on click
- AC3: Cards automatically cycle through positions (auto-timer)

### Implementation for User Story 3

- [x] T032 [US3] Create capstone images in `static/img/` (gazebo.png, isaac.png, robot.png) or use placeholder images
- [x] T033 [US3] Create capstone showcase section in `src/pages/index.tsx` below hero using CardSwap component
- [x] T034 [US3] Configure CardSwap with Sim-to-Real pipeline cards data (3 cards: Gazebo, Isaac Sim, Real Robot)
- [x] T035 [US3] Apply SpotlightCard styling to CardSwap card content for hover glow effect
- [x] T036 [US3] Add auto-play functionality to CardSwap (5-second interval) per AC3
- [x] T037 [US3] Run `yarn build` and verify SSR safety for capstone section
- [ ] T038 [US3] Manual test: verify all 3 acceptance criteria pass

**Checkpoint**: User Story 3 complete - Capstone showcase with interactive CardSwap gallery

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Edge cases, accessibility, and final validation

### Edge Case Handling (from spec.md)

- [x] T039 [P] Add prefers-reduced-motion support to DecryptedText component (FR-013, SC-005)
- [x] T040 [P] Add prefers-reduced-motion support to GridScan component (FR-013)
- [x] T041 [P] Add prefers-reduced-motion support to CardSwap component (FR-013)
- [x] T042 Ensure core content readable with JavaScript disabled via fallback elements (SC-006)
- [x] T043 Add ARIA labels to animated components for screen reader accessibility

### Final Validation

- [x] T044 Run `yarn build` - verify no SSR errors (SC-003)
- [x] T045 Run `yarn typecheck` - verify no TypeScript errors
- [ ] T046 Manual test: verify homepage loads within 3 seconds (SC-001)
- [ ] T047 Manual test: verify consistent HUD styling across all pages (SC-002)
- [ ] T048 Manual test: verify prefers-reduced-motion disables animations (SC-005)
- [ ] T049 Manual test: verify focus states visible on all interactive elements (SC-007)

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1: Setup ────────────────────┐
                                   │
Phase 2: Foundational ◄────────────┘
    │
    ├── Phase 3: US1 (P1) ─── MVP Deliverable
    │
    ├── Phase 4: US2 (P2) ─── Can start after Phase 2
    │
    ├── Phase 5: US3 (P3) ─── Can start after Phase 2
    │
    └── Phase 6: Polish ◄─── After all user stories complete
```

### User Story Dependencies

| Story | Dependencies | Can Parallelize With |
|-------|--------------|---------------------|
| US1 (P1) | Phase 2 complete | - |
| US2 (P2) | Phase 2 complete | US1 (different files) |
| US3 (P3) | Phase 2 complete | US1, US2 (different files) |

### Within Each Phase

- Tasks marked [P] can run in parallel
- Sequential tasks depend on prior task completion
- Each phase ends with `yarn build` validation

---

## Parallel Execution Examples

### Phase 1 Parallel Tasks

```bash
# These can run simultaneously:
T002: Create tailwind.config.js
T003: Add Tailwind plugin to docusaurus.config.ts
T004: Add Google Fonts to docusaurus.config.ts headTags
```

### Phase 2 Parallel Tasks

```bash
# Component verification (all parallel):
T008: Verify GridScan.tsx
T009: Verify DecryptedText.tsx
T010: Verify SpotlightCard.tsx
T011: Verify CardSwap.tsx
T012: Verify index.ts
```

### Cross-Story Parallelization

```bash
# After Phase 2 completes, different developers could work on:
Developer A: US1 tasks (T015-T022) - Homepage hero
Developer B: US2 tasks (T023-T031) - CSS typography/styling
Developer C: US3 tasks (T032-T038) - Capstone CardSwap
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T006)
2. Complete Phase 2: Foundational (T007-T014)
3. Complete Phase 3: User Story 1 (T015-T022)
4. **STOP and VALIDATE**: Test homepage independently
5. **Deploy/Demo**: MVP delivers full HUD aesthetic on homepage

### Incremental Delivery

| Milestone | Deliverable | Tasks |
|-----------|-------------|-------|
| Foundation | Tailwind + Components ready | T001-T014 |
| MVP | Homepage HUD aesthetic | T015-T022 |
| Full Styling | Documentation HUD styling | T023-T031 |
| Complete | Capstone showcase | T032-T038 |
| Polished | Accessibility + Edge cases | T039-T049 |

---

## Summary

| Metric | Count |
|--------|-------|
| **Total Tasks** | 49 |
| **Phase 1 (Setup)** | 6 |
| **Phase 2 (Foundational)** | 8 |
| **Phase 3 (US1 - MVP)** | 8 |
| **Phase 4 (US2)** | 9 |
| **Phase 5 (US3)** | 7 |
| **Phase 6 (Polish)** | 11 |
| **Parallelizable Tasks** | 18 |

---

## Notes

- Components already exist in `src/components/react-bits/` (created during planning)
- All components use BrowserOnly wrapper for SSR safety
- No automated tests - manual visual testing per plan.md
- CSS changes use Tailwind utility classes where possible, custom CSS only for Docusaurus overrides
- Run `yarn build` after each phase to catch SSR issues early
