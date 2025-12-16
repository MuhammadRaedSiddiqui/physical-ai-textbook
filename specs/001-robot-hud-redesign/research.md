# Research: Robot HUD Frontend Redesign

**Feature**: 001-robot-hud-redesign
**Date**: 2025-12-15
**Status**: Complete

## Executive Summary

Research conducted on key technology integrations for the Robot HUD redesign. All NEEDS CLARIFICATION items from Technical Context have been resolved. The implementation path is clear with well-documented patterns for each dependency.

---

## 1. Tailwind CSS for Docusaurus v3

### Decision
Use **Tailwind CSS v3** with PostCSS plugin integration (not v4) for better stability with Docusaurus.

### Rationale
- Tailwind v3 has proven Docusaurus integration patterns
- v4 removes `tailwind.config.js` in favor of CSS-based configuration, which is less intuitive for theming
- v3 allows explicit theme configuration for HUD colors

### Implementation Pattern

**Dependencies:**
```bash
yarn add tailwindcss postcss autoprefixer
```

**tailwind.config.js:**
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './docs/**/*.{md,mdx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        'hud-cyan': '#00f3ff',
        'hud-amber': '#ffb800',
        'hud-black': '#050505',
      },
      fontFamily: {
        'display': ['Orbitron', 'sans-serif'],
        'body': ['Rajdhani', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Disable base reset to avoid Infima conflicts
  },
}
```

**docusaurus.config.ts plugin:**
```typescript
plugins: [
  async function tailwindPlugin(context, options) {
    return {
      name: 'docusaurus-tailwindcss',
      configurePostCss(postcssOptions) {
        postcssOptions.plugins.push(require('tailwindcss'));
        postcssOptions.plugins.push(require('autoprefixer'));
        return postcssOptions;
      },
    };
  },
],
```

**src/css/custom.css additions:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Alternatives Considered
- **Tailwind v4**: Newer but less documented patterns for Docusaurus
- **CSS-in-JS (Emotion/styled-components)**: Against constitution principle V
- **Keep Infima only**: Cannot achieve HUD aesthetic consistently

### Sources
- [Using TailwindCSS v3 in Docusaurus in 5 steps](https://dev.to/shannonajclarke/using-tailwindcss-v3-in-docusaurus-in-5-steps-5c26)
- [Adding Tailwind v4 to Docusaurus v3](https://dev.to/michalwrzosek/adding-tailwind-v4-to-docusaurus-v3-3poa)
- [Docusaurus Tailwind Shadcn Template](https://github.com/namnguyenthanhwork/docusaurus-tailwind-shadcn-template)

---

## 2. Three.js SSR Safety Pattern (BrowserOnly)

### Decision
Use Docusaurus `<BrowserOnly>` component with **dynamic require** inside callback function.

### Rationale
- Three.js accesses `window`, `document`, and WebGL APIs at module initialization
- Standard imports fail during SSR even with conditional rendering
- The callback pattern ensures Three.js is never parsed during SSR

### Implementation Pattern

**Critical Pattern:**
```tsx
import BrowserOnly from '@docusaurus/BrowserOnly';

export function GridScan() {
  return (
    <BrowserOnly fallback={<div className="bg-hud-black h-screen" />}>
      {() => {
        // MUST use require() inside callback - import won't work
        const GridScanClient = require('./GridScanClient').default;
        return <GridScanClient />;
      }}
    </BrowserOnly>
  );
}
```

**File Structure:**
```
src/components/react-bits/GridScan/
├── GridScan.tsx          # BrowserOnly wrapper (SSR-safe)
├── GridScanClient.tsx    # Actual Three.js implementation (client-only)
└── index.ts              # Re-export GridScan
```

### Key Rules
1. **Never import Three.js at module scope** - use dynamic require in BrowserOnly callback
2. **Use fallback for loading state** - prevents layout shift
3. **Client component can use normal imports** - it's never executed during SSR
4. **Test with `yarn build`** - SSR errors only surface during build, not dev

### Common Mistakes to Avoid
```tsx
// ❌ WRONG - import runs at parse time
import { Canvas } from '@react-three/fiber';
export function BadComponent() {
  return <BrowserOnly>{() => <Canvas />}</BrowserOnly>;
}

// ✅ CORRECT - require inside callback
export function GoodComponent() {
  return (
    <BrowserOnly>
      {() => {
        const { Canvas } = require('@react-three/fiber');
        return <Canvas />;
      }}
    </BrowserOnly>
  );
}
```

### Sources
- [Docusaurus SSG Documentation](https://docusaurus.io/docs/advanced/ssg)
- [GitHub Discussion #4514 - SSR Issues](https://github.com/facebook/docusaurus/discussions/4514)
- [GitHub Discussion #9435 - BrowserOnly with ES Modules](https://github.com/facebook/docusaurus/discussions/9435)

---

## 3. GSAP React Integration

### Decision
Use `@gsap/react` package with `useGSAP()` hook for automatic cleanup.

### Rationale
- Official GSAP package for React
- Handles React 18/19 Strict Mode double-mount issues
- Automatic cleanup prevents memory leaks
- SSR-safe with `useIsomorphicLayoutEffect` internally

### Implementation Pattern

**Dependencies:**
```bash
yarn add gsap @gsap/react
```

**Component Pattern:**
```tsx
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export function CardSwapClient() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // All GSAP animations auto-cleanup on unmount
    gsap.to('.card', {
      rotationY: 180,
      duration: 0.6,
      stagger: 0.1,
    });
  }, { scope: containerRef }); // Scopes all selectors to container

  return (
    <div ref={containerRef}>
      <div className="card">Card 1</div>
      <div className="card">Card 2</div>
    </div>
  );
}
```

### BrowserOnly Wrapping (for Docusaurus)
GSAP core is SSR-safe, but some plugins (Draggable, ScrollTrigger) are not:
```tsx
// For SSR-safe GSAP (core only)
import gsap from 'gsap'; // ✅ Safe

// For browser-only plugins
<BrowserOnly>
  {() => {
    const { Draggable } = require('gsap/Draggable');
    gsap.registerPlugin(Draggable);
    return <DraggableComponent />;
  }}
</BrowserOnly>
```

### Performance Best Practices
- Only animate `transform` and `opacity` (GPU-accelerated)
- Avoid animating `filter`, `boxShadow`, `clipPath` (CPU-heavy)
- Use `will-change: transform` sparingly

### Sources
- [@gsap/react npm package](https://www.npmjs.com/package/@gsap/react)
- [GSAP React Official Docs](https://gsap.com/resources/React/)
- [GSAP React Animation Guide](https://www.augustinfotech.com/blogs/gsap-react-seamless-animations-in-component-lifecycles/)

---

## 4. Framer Motion (Motion) Integration

### Decision
Use `motion` package (Framer Motion v12) with `MotionConfig` for site-wide reduced motion support.

### Rationale
- React 19 compatible (added in v11)
- Built-in `useReducedMotion` hook for accessibility (FR-013)
- Page transition support via `AnimatePresence`
- Declarative API fits React patterns

### Implementation Pattern

**Dependencies:**
```bash
yarn add motion
```

**Root Provider Setup (src/theme/Root.tsx):**
```tsx
import { MotionConfig } from 'motion/react';

export default function Root({ children }) {
  return (
    <MotionConfig reducedMotion="user">
      {children}
    </MotionConfig>
  );
}
```

**Reduced Motion Usage:**
```tsx
import { motion, useReducedMotion } from 'motion/react';

export function DecryptedText({ text }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <span>{text}</span>; // Static fallback
  }

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {text}
    </motion.span>
  );
}
```

### ReducedMotion Options
- `"user"` - Respects system preference (recommended for FR-013)
- `"always"` - Force reduced motion
- `"never"` - Ignore preference (accessibility violation)

### Sources
- [Motion Official Docs](https://motion.dev/docs/react-use-reduced-motion)
- [Motion Accessibility Guide](https://motion.dev/docs/react-accessibility)
- [Framer Motion Changelog](https://github.com/framer/motion/blob/main/CHANGELOG.md)
- [Animating React in 2025](https://medium.com/outreach-prague/animating-react-in-2025-unlocking-the-power-of-motion-73ff9a490445)

---

## 5. Typography (Google Fonts)

### Decision
Use Google Fonts CDN with `font-display: swap` for Orbitron, Rajdhani, and JetBrains Mono.

### Rationale
- No self-hosting complexity
- CDN caching for repeat visitors
- `font-display: swap` prevents FOIT (Flash of Invisible Text)

### Implementation Pattern

**docusaurus.config.ts:**
```typescript
headTags: [
  {
    tagName: 'link',
    attributes: {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
  },
  {
    tagName: 'link',
    attributes: {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossorigin: 'anonymous',
    },
  },
  {
    tagName: 'link',
    attributes: {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Orbitron:wght@400;500;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap',
    },
  },
],
```

**Tailwind config font families:**
```javascript
fontFamily: {
  'display': ['Orbitron', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  'body': ['Rajdhani', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  'mono': ['JetBrains Mono', 'ui-monospace', 'monospace'],
},
```

### Font Usage Guidelines
| Font | Use Case | Weights |
|------|----------|---------|
| Orbitron | H1-H3 headings, hero titles | 500, 700, 900 |
| Rajdhani | Body text, paragraphs, UI labels | 400, 500, 600 |
| JetBrains Mono | Code blocks, inline code, terminal | 400, 500 |

### Sources
- [Google Fonts - Orbitron](https://fonts.google.com/specimen/Orbitron)
- [Google Fonts - JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)
- [JetBrains Mono Official](https://www.jetbrains.com/lp/mono/)

---

## 6. face-api.js (Optional Enhancement)

### Decision
Implement as **optional progressive enhancement** with graceful fallback.

### Rationale
- Camera access may be denied or unavailable
- Adds significant bundle size (~6MB for models)
- Core GridScan functionality works without it
- Per spec edge case: "GridScan should fallback to non-attention-based animation"

### Implementation Pattern

```tsx
const [faceApiAvailable, setFaceApiAvailable] = useState(false);

useEffect(() => {
  async function loadFaceApi() {
    try {
      const faceapi = await import('face-api.js');
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      setFaceApiAvailable(true);
    } catch {
      console.warn('Face API unavailable, using default animation');
      setFaceApiAvailable(false);
    }
  }
  loadFaceApi();
}, []);

// Use faceApiAvailable to toggle attention-based vs time-based animation
```

### Fallback Strategy
1. Attempt to load face-api.js models
2. If fails: use time-based sine wave animation instead
3. If camera denied: use mouse position for interaction point
4. If no interaction: use center-focused static animation

### Decision: Defer to Phase 2
Face-api.js adds complexity. Recommend implementing GridScan with time-based animation first, then adding face-api as optional enhancement in separate task.

---

## Dependencies Summary

### Required (yarn add)
```bash
# Core install command
yarn add gsap framer-motion clsx tailwind-merge

# Styling (if Tailwind not configured)
yarn add tailwindcss postcss autoprefixer
```

**Note**: `@docusaurus/BrowserOnly` is included with Docusaurus core - no separate install needed.

### Simplified Dependency List
| Package | Purpose | Required |
|---------|---------|----------|
| gsap | GSAP animations (Crosshair, CardSwap) | ✅ |
| framer-motion | Declarative animations (DecryptedText) | ✅ |
| clsx | Conditional className utility | ✅ |
| tailwind-merge | Tailwind class deduplication | ✅ |
| tailwindcss | Utility CSS framework | ✅ |
| postcss | CSS processing | ✅ |
| autoprefixer | Vendor prefixes | ✅ |

### Removed from Original Plan
- `three`, `@react-three/fiber`, `@react-three/drei`, `postprocessing` - GridScan uses Canvas 2D instead of Three.js
- `@gsap/react` - Using plain GSAP with useEffect (simpler)
- `face-api.js` - Deferred to Phase 2

### Total New Dependencies: 7 required

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| SSR build failures | Medium | High | BrowserOnly pattern, `yarn build` testing |
| Animation performance on mobile | Medium | Medium | `prefers-reduced-motion`, graceful degradation |
| Tailwind/Infima CSS conflicts | Low | Medium | `preflight: false`, careful specificity |
| Bundle size increase | Medium | Low | Code splitting, dynamic imports |

---

## Next Steps (Phase 1)

1. Create `data-model.md` - Define component props interfaces
2. Create `contracts/` - Component API specifications
3. Create `quickstart.md` - Developer setup guide
4. Update agent context with new technologies
