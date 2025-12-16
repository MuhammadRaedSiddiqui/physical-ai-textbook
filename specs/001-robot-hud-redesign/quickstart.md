# Quickstart: Robot HUD Frontend Redesign

**Feature**: 001-robot-hud-redesign
**Date**: 2025-12-15

## Prerequisites

- Node.js >= 20.0
- Yarn (Classic)
- Git
- VS Code (recommended)

## Setup Steps

### 1. Clone and Install

```bash
# Clone repository (if not already done)
git clone https://github.com/MuhammadRaedSiddiqui/physical-ai-textbook.git
cd physical-ai-textbook

# Switch to feature branch
git checkout 001-robot-hud-redesign

# Install dependencies
yarn install
```

### 2. Add New Dependencies

```bash
# Single install command for all required packages
yarn add gsap framer-motion clsx tailwind-merge tailwindcss postcss autoprefixer
```

**Note**: `@docusaurus/BrowserOnly` is included with Docusaurus core - no separate install needed.

### 3. Configure Tailwind CSS

Create `tailwind.config.js` at project root:

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
  corePlugins: {
    preflight: false,
  },
};
```

### 4. Update Docusaurus Config

Add to `docusaurus.config.ts`:

```typescript
// In themeConfig or at root level
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

// Add Tailwind plugin
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

### 5. Update Custom CSS

Add to `src/css/custom.css` (at the top):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Existing CSS below... */
```

### 6. Components (Already Created)

The following React Bits components have been pre-created in `src/components/react-bits/`:

| Component | File | Purpose |
|-----------|------|---------|
| Crosshair | `Crosshair.tsx` | Global cursor with converging crosshairs |
| GridScan | `GridScan.tsx` | Canvas-based animated grid background |
| SpotlightCard | `SpotlightCard.tsx` | Cards with hover glow effect |
| DecryptedText | `DecryptedText.tsx` | Text unscramble animation |
| CardSwap | `CardSwap.tsx` | Stacked cards with swap animation |

**Index export**: `src/components/react-bits/index.ts`

```typescript
// Usage
import { Crosshair, GridScan, SpotlightCard, DecryptedText, CardSwap } from '@site/src/components/react-bits';
```

### 7. Verify Setup

```bash
# Start development server
yarn start

# In another terminal, verify build (SSR check)
yarn build
```

**Expected**: Both commands complete without errors.

---

## Development Workflow

### Starting Development

```bash
yarn start
```

Opens browser at `http://localhost:3000/physical-ai-textbook/`

### Building for Production

```bash
yarn build
```

**Critical**: Always run `yarn build` before committing to verify SSR safety.

### Type Checking

```bash
yarn typecheck
```

---

## Component Development Pattern

### Creating a New React Bits Component

1. **Create wrapper (SSR-safe)**

```typescript
// src/components/react-bits/MyComponent/MyComponent.tsx
import BrowserOnly from '@docusaurus/BrowserOnly';

export function MyComponent(props: MyComponentProps) {
  return (
    <BrowserOnly fallback={<div>Loading...</div>}>
      {() => {
        const MyComponentClient = require('./MyComponentClient').default;
        return <MyComponentClient {...props} />;
      }}
    </BrowserOnly>
  );
}

export default MyComponent;
```

2. **Create client implementation (browser-only)**

```typescript
// src/components/react-bits/MyComponent/MyComponentClient.tsx
import { useRef } from 'react';
// Import browser APIs here - safe because this file is never SSR'd

export default function MyComponentClient(props: MyComponentProps) {
  // Implementation using browser APIs
  return <div>...</div>;
}
```

3. **Create index export**

```typescript
// src/components/react-bits/MyComponent/index.ts
export { MyComponent, default } from './MyComponent';
export type { MyComponentProps } from './types';
```

4. **Create types**

```typescript
// src/components/react-bits/MyComponent/types.ts
export interface MyComponentProps {
  // ...
}
```

---

## Testing Components

### Manual Testing Checklist

- [ ] Component renders in dev server
- [ ] `yarn build` completes without SSR errors
- [ ] Animations work correctly
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Component looks correct in dark mode
- [ ] No console errors

### SSR Safety Check

If you see errors like:
```
ReferenceError: window is not defined
ReferenceError: document is not defined
```

The component is not properly wrapped in `<BrowserOnly>`. Check:
1. All browser API usage is in client component
2. Client component is `require()`d inside BrowserOnly callback
3. No top-level imports of browser-only packages

---

## Common Issues

### Issue: Tailwind classes not applying

**Solution**: Verify `tailwind.config.js` content paths include your files:
```javascript
content: ['./src/**/*.{ts,tsx}', './docs/**/*.mdx'],
```

### Issue: Fonts not loading

**Solution**: Check browser Network tab for 4xx errors on font requests. Verify `headTags` in docusaurus config.

### Issue: GSAP animations not working

**Solution**: Ensure GSAP operations are inside `useEffect` hooks, not at module scope.

### Issue: framer-motion import error

**Solution**: The package name is `framer-motion`, not `motion`. Import as:
```typescript
import { motion } from 'framer-motion';
```

---

## File Reference

After setup, your project structure should include:

```
physical-ai-textbook/
├── docusaurus.config.ts    # Updated with fonts + Tailwind plugin
├── tailwind.config.js      # NEW
├── src/
│   ├── css/
│   │   └── custom.css      # Updated with @tailwind directives
│   ├── components/
│   │   ├── ChatBot.tsx     # Existing
│   │   └── react-bits/     # NEW - Components pre-created
│   │       ├── Crosshair.tsx
│   │       ├── GridScan.tsx
│   │       ├── SpotlightCard.tsx
│   │       ├── DecryptedText.tsx
│   │       ├── CardSwap.tsx
│   │       └── index.ts
│   ├── pages/
│   │   └── index.tsx       # To be updated
│   └── theme/
│       └── Root.tsx        # To be updated
└── specs/
    └── 001-robot-hud-redesign/
        ├── spec.md
        ├── plan.md
        ├── research.md
        ├── data-model.md
        ├── quickstart.md   # This file
        └── contracts/
```

---

## Next Steps

After completing this quickstart:

1. Run `/sp.tasks` to generate implementation tasks
2. Follow task list in priority order
3. Test each component with `yarn build` before moving to next
4. Commit working increments frequently
