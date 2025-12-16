<!--
SYNC IMPACT REPORT
==================
Version change: 0.0.0 → 1.0.0 (MAJOR - initial ratification)
Modified principles: N/A (initial creation)
Added sections:
  - Core Principles (6 principles)
  - Technology Stack (immutable constraints)
  - Visual Standards
  - Development Workflow
  - Governance
Removed sections: N/A (initial creation)
Templates requiring updates:
  - .specify/templates/plan-template.md - ✅ reviewed (no changes needed)
  - .specify/templates/spec-template.md - ✅ reviewed (no changes needed)
  - .specify/templates/tasks-template.md - ✅ reviewed (no changes needed)
Follow-up TODOs: None
==================
-->

# Physical AI & Humanoid Robotics Textbook Constitution

## Core Principles

### I. Docusaurus-First Architecture

All content and features MUST be built within the Docusaurus v3 framework paradigm. This project is a static-site-generated (SSG) educational textbook, not a dynamic web application.

**Non-Negotiables:**
- The site MUST build successfully with `yarn build` before any PR merge
- All pages MUST be pre-renderable at build time
- Content MUST be organized under `docs/` following Docusaurus conventions
- Custom pages MUST reside in `src/pages/`
- Reusable UI MUST be modular React components in `src/components/`

**Rationale:** Docusaurus provides documentation-optimized features (versioning, search, MDX) that would be costly to replicate. Staying within its paradigm ensures maintainability and access to ecosystem updates.

### II. SSR Safety (The "Anti-Crash" Laws)

Docusaurus performs Server-Side Rendering (SSR) during build. Browser APIs do NOT exist in Node.js and will crash the build if accessed at module scope.

**Non-Negotiables:**
- NEVER use `window`, `document`, or `navigator` at the top level of a component
- Any component using browser-only APIs (Three.js, GSAP Draggable, Face API, etc.) MUST be wrapped in Docusaurus's `<BrowserOnly>` component or imported dynamically with `{ ssr: false }`
- All browser-dependent code MUST use one of these patterns:
  - `<BrowserOnly>` wrapper component
  - Dynamic import: `React.lazy(() => import('./Component'))` with Suspense
  - `useEffect()` hooks (runs only client-side)
  - `typeof window !== 'undefined'` guards for conditional logic

**Rationale:** A single unguarded browser API call at module level will fail the entire build. This is the most common source of Docusaurus crashes and must be prevented.

### III. Component-Driven Development

All UI elements MUST be modular, reusable React components. No inline JSX sprawl in page files.

**Non-Negotiables:**
- Components MUST reside in `src/components/` with clear naming conventions
- "React Bits" pattern components MUST be manually created in `src/components/react-bits/` (NOT installed via npm - full source code must be written)
- Each component MUST have a single responsibility
- Components MUST accept props for customization; avoid hardcoded values
- Complex components SHOULD be composed from smaller primitives

**Rationale:** A textbook will have many pages reusing similar UI patterns (code blocks, diagrams, quizzes, callouts). Component modularity prevents duplication and ensures visual consistency.

### IV. TypeScript-Preferred Development

TypeScript (.tsx) is the preferred language for all React components and utilities. JavaScript (.js) is acceptable only for configuration files.

**Non-Negotiables:**
- All new components MUST be written in TypeScript (.tsx)
- Props interfaces MUST be explicitly defined for all components
- Configuration files (`docusaurus.config.ts`, `sidebars.ts`) MAY use TypeScript or JavaScript
- `any` type SHOULD be avoided; use specific types or `unknown` with type guards

**Rationale:** TypeScript catches errors at compile time, provides self-documenting interfaces, and improves IDE support for a multi-contributor educational project.

### V. Tailwind-First Styling

Tailwind CSS (via PostCSS) is the primary styling engine. CSS Modules are reserved for third-party overrides only.

**Non-Negotiables:**
- All new styling MUST use Tailwind utility classes
- Custom CSS SHOULD be avoided; extend Tailwind config instead when needed
- CSS Modules (`.module.css`) MUST only be used for Docusaurus theme overrides that cannot be achieved with Tailwind
- Inline styles MUST be avoided except for truly dynamic values

**Rationale:** Tailwind provides a consistent design system, reduces CSS bloat through utility composition, and enables rapid UI iteration without naming debates.

### VI. Conservative Swizzling Policy

Docusaurus theme customization follows a strict hierarchy to minimize maintenance burden.

**Non-Negotiables:**
- Only swizzle components if styling via CSS/Tailwind is impossible
- PREFER wrapping over ejecting (wrap preserves upstream updates, eject does not)
- Swizzled components MUST be documented with rationale in component file header
- Before swizzling, verify the customization cannot be achieved via:
  1. Tailwind classes
  2. Custom CSS targeting Docusaurus classes
  3. Theme configuration in `docusaurus.config.ts`

**Rationale:** Swizzled components do not receive upstream updates and increase maintenance burden. Each swizzle is technical debt that must be justified.

## Technology Stack (Immutable)

These technology choices are locked for the project lifecycle unless a constitution amendment is ratified.

| Layer | Technology | Version Constraint |
|-------|------------|-------------------|
| Framework | Docusaurus | v3.x (React 18+) |
| Language | TypeScript (.tsx preferred) | ^5.x |
| Runtime | Node.js | >=20.0 |
| Package Manager | Yarn | Classic |
| Styling | Tailwind CSS | via PostCSS |
| Animation (default) | Framer Motion | Latest stable |
| Animation (complex) | GSAP | Latest stable |
| Animation (3D/WebGL) | Three.js | Latest stable |
| Content Format | MDX | v3.x |

**Immutability Rationale:** Changing core framework mid-project would require massive rewrites. These choices are deliberate and researched.

## Visual Standards

### Theme: "Sci-Fi HUD" (Heads-Up Display)

The textbook adopts a futuristic Heads-Up Display aesthetic appropriate for Physical AI and Robotics content.

**Color Palette:**

| Role | Color | Hex Code |
|------|-------|----------|
| Primary | Cyan | `#00f3ff` |
| Warning/Accent | Amber | `#ffb800` |
| Background | Deep Black | `#050505` |

**Mode Configuration:**
- Dark mode is the DEFAULT and primary experience
- Light mode MAY be supported but is secondary priority
- All components MUST be designed dark-mode-first

**Visual Guidelines:**
- Use cyan (`#00f3ff`) for primary interactive elements, links, and highlights
- Use amber (`#ffb800`) for warnings, important callouts, and secondary accents
- Maintain high contrast ratios for accessibility (WCAG AA minimum)
- HUD-style elements: thin borders, glow effects, technical typography

## Development Workflow

### Branch Strategy

- `main` - production-ready, deploys to GitHub Pages
- `feature/*` - new features and content
- `fix/*` - bug fixes and corrections

### Quality Gates

All PRs MUST pass before merge:

1. **Build Check**: `yarn build` completes without errors
2. **Type Check**: `yarn typecheck` passes with no errors
3. **SSR Validation**: No browser API errors during build
4. **Content Review**: MDX content renders correctly in local preview

### Commit Convention

Follow conventional commits:
- `feat:` - new features or content
- `fix:` - bug fixes
- `docs:` - documentation changes
- `style:` - formatting, styling (no logic change)
- `refactor:` - code restructuring
- `chore:` - maintenance tasks

## Governance

### Amendment Process

1. Propose amendment via PR to `.specify/memory/constitution.md`
2. Document rationale and impact assessment
3. Require review from at least one other contributor
4. Update version according to semantic rules below

### Versioning Policy

- **MAJOR** (X.0.0): Breaking changes to principles, technology stack changes, governance restructuring
- **MINOR** (0.X.0): New principles added, significant guidance expansion
- **PATCH** (0.0.X): Clarifications, typo fixes, non-semantic refinements

### Compliance

- All PRs MUST verify adherence to constitution principles
- Build failures due to SSR violations are automatic rejection
- Complexity additions MUST be justified against constitution principles
- Swizzling requires explicit justification in PR description

**Version**: 1.0.0 | **Ratified**: 2025-12-15 | **Last Amended**: 2025-12-15
