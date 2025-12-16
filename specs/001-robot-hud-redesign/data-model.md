# Data Model: Robot HUD Frontend Redesign

**Feature**: 001-robot-hud-redesign
**Date**: 2025-12-15
**Status**: Complete

## Overview

This document defines the TypeScript interfaces and prop types for all components in the Robot HUD redesign. These serve as the contract between components and their consumers.

---

## 1. Theme Configuration

### HUD Color Palette

```typescript
// src/types/theme.ts

export interface HUDColors {
  /** Primary interactive color - Cyan Laser */
  primary: '#00f3ff';
  /** Warning/accent color - Amber */
  warning: '#ffb800';
  /** Background color - Deep Black */
  background: '#050505';
  /** Text on dark background */
  textPrimary: '#ffffff';
  /** Muted text */
  textSecondary: '#a0a0a0';
}

export const HUD_COLORS: HUDColors = {
  primary: '#00f3ff',
  warning: '#ffb800',
  background: '#050505',
  textPrimary: '#ffffff',
  textSecondary: '#a0a0a0',
} as const;
```

### Font Configuration

```typescript
// src/types/theme.ts

export interface HUDFonts {
  /** Display font for headings */
  display: 'Orbitron';
  /** Body font for paragraphs */
  body: 'Rajdhani';
  /** Monospace font for code */
  mono: 'JetBrains Mono';
}

export type FontWeight = 300 | 400 | 500 | 600 | 700 | 900;

export interface FontConfig {
  family: keyof HUDFonts;
  weights: FontWeight[];
}
```

---

## 2. GridScan Component

### Entity Description
Three.js-based animated grid background with optional face-tracking for attention-based animation. Displays a CRT-style scanning effect on a deep black background.

### Props Interface

```typescript
// src/components/react-bits/GridScan/types.ts

export interface GridScanProps {
  /**
   * Height of the grid container
   * @default '100vh'
   */
  height?: string;

  /**
   * Primary grid line color
   * @default '#00f3ff' (HUD cyan)
   */
  gridColor?: string;

  /**
   * Grid line opacity
   * @default 0.3
   */
  gridOpacity?: number;

  /**
   * Number of grid divisions
   * @default 20
   */
  gridDivisions?: number;

  /**
   * Enable scan line animation
   * @default true
   */
  enableScanLine?: boolean;

  /**
   * Scan line animation speed (seconds per cycle)
   * @default 3
   */
  scanSpeed?: number;

  /**
   * Enable face-tracking (requires camera permission)
   * Falls back to time-based animation if unavailable
   * @default false
   */
  enableFaceTracking?: boolean;

  /**
   * Callback when face tracking status changes
   */
  onFaceTrackingChange?: (available: boolean) => void;

  /**
   * Additional CSS class for container
   */
  className?: string;
}

export interface GridScanState {
  /** Whether Three.js is initialized */
  isReady: boolean;
  /** Whether face tracking is active */
  faceTrackingActive: boolean;
  /** Current focus point (0-1 normalized) */
  focusPoint: { x: number; y: number };
}
```

### Validation Rules
- `gridOpacity` must be between 0 and 1
- `gridDivisions` must be positive integer
- `scanSpeed` must be positive number

---

## 3. Crosshair Component

### Entity Description
Custom cursor replacement that displays a robotic crosshair reticle. Follows mouse position globally and provides visual feedback on interactive elements.

### Props Interface

```typescript
// src/components/react-bits/Crosshair/types.ts

export interface CrosshairProps {
  /**
   * Size of the crosshair in pixels
   * @default 32
   */
  size?: number;

  /**
   * Primary color of crosshair
   * @default '#00f3ff'
   */
  color?: string;

  /**
   * Secondary color for hover state
   * @default '#ffb800'
   */
  hoverColor?: string;

  /**
   * Show targeting animation on click
   * @default true
   */
  showClickAnimation?: boolean;

  /**
   * Line thickness in pixels
   * @default 2
   */
  strokeWidth?: number;

  /**
   * Gap in center of crosshair
   * @default 8
   */
  centerGap?: number;

  /**
   * Enable crosshair globally
   * @default true
   */
  enabled?: boolean;
}

export interface CrosshairState {
  /** Current position */
  position: { x: number; y: number };
  /** Whether hovering over interactive element */
  isHovering: boolean;
  /** Whether currently clicking */
  isClicking: boolean;
  /** Whether crosshair is visible */
  isVisible: boolean;
}
```

### Behavior Rules
- Hide when cursor leaves window
- Change color when hovering over `<a>`, `<button>`, `[role="button"]`
- Scale animation on click
- Respect `prefers-reduced-motion` for animations

---

## 4. DecryptedText Component

### Entity Description
Text animation that reveals characters with a "decryption" effect, cycling through random characters before settling on final text.

### Props Interface

```typescript
// src/components/react-bits/DecryptedText/types.ts

export interface DecryptedTextProps {
  /**
   * The text to display after decryption
   */
  text: string;

  /**
   * HTML element to render as
   * @default 'span'
   */
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'p';

  /**
   * Duration of decryption animation in ms
   * @default 2000
   */
  duration?: number;

  /**
   * Delay before animation starts in ms
   * @default 0
   */
  delay?: number;

  /**
   * Characters to cycle through during decryption
   * @default 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
   */
  characters?: string;

  /**
   * Number of character cycles per position
   * @default 10
   */
  iterations?: number;

  /**
   * Trigger animation on element visibility
   * @default true
   */
  animateOnView?: boolean;

  /**
   * Callback when animation completes
   */
  onComplete?: () => void;

  /**
   * Additional CSS class
   */
  className?: string;
}

export interface DecryptedTextState {
  /** Current displayed text (may include random chars) */
  displayText: string;
  /** Animation progress (0-1) */
  progress: number;
  /** Whether animation is complete */
  isComplete: boolean;
}
```

### State Transitions
1. **Initial**: Display random characters for each position
2. **Decrypting**: Characters cycle, settling left-to-right
3. **Complete**: Final text displayed

### Accessibility
- If `prefers-reduced-motion`: Skip animation, show final text immediately
- Ensure text is readable by screen readers (use `aria-label`)

---

## 5. CardSwap Component

### Entity Description
3D card stack gallery with GSAP-powered swap animations. Displays a stack of cards that can be clicked or auto-cycled.

### Props Interface

```typescript
// src/components/react-bits/CardSwap/types.ts

export interface CardSwapCard {
  /** Unique identifier */
  id: string;
  /** Card title */
  title: string;
  /** Card description */
  description: string;
  /** Image URL */
  imageUrl: string;
  /** Optional link */
  href?: string;
}

export interface CardSwapProps {
  /**
   * Array of cards to display
   */
  cards: CardSwapCard[];

  /**
   * Width of each card in pixels
   * @default 300
   */
  cardWidth?: number;

  /**
   * Height of each card in pixels
   * @default 400
   */
  cardHeight?: number;

  /**
   * Vertical offset between stacked cards
   * @default 20
   */
  stackOffset?: number;

  /**
   * Horizontal offset for 3D perspective
   * @default 30
   */
  perspectiveOffset?: number;

  /**
   * Enable auto-cycling
   * @default true
   */
  autoPlay?: boolean;

  /**
   * Auto-cycle interval in ms
   * @default 5000
   */
  autoPlayInterval?: number;

  /**
   * Animation duration in ms
   * @default 600
   */
  animationDuration?: number;

  /**
   * Enable click to swap
   * @default true
   */
  clickToSwap?: boolean;

  /**
   * Callback when active card changes
   */
  onCardChange?: (card: CardSwapCard, index: number) => void;

  /**
   * Additional CSS class
   */
  className?: string;
}

export interface CardSwapState {
  /** Index of front card */
  activeIndex: number;
  /** Whether animation is in progress */
  isAnimating: boolean;
  /** Whether autoplay is paused (e.g., on hover) */
  isPaused: boolean;
}
```

### Animation Sequence
1. Front card lifts and rotates out
2. Back cards shift forward
3. Previous front card moves to back of stack
4. Stack settles with new front card

---

## 6. AnimationProvider Component

### Entity Description
Root-level wrapper that provides animation context, motion configuration, and global animation settings.

### Props Interface

```typescript
// src/components/providers/AnimationProvider/types.ts

import { MotionConfig } from 'motion/react';

export interface AnimationProviderProps {
  /**
   * Child components
   */
  children: React.ReactNode;

  /**
   * Reduced motion setting
   * @default 'user' (respects system preference)
   */
  reducedMotion?: 'user' | 'always' | 'never';

  /**
   * Default animation transition
   */
  transition?: {
    duration?: number;
    ease?: string | number[];
  };
}

export interface AnimationContextValue {
  /** Whether reduced motion is active */
  reducedMotion: boolean;
  /** Global animation duration multiplier */
  durationMultiplier: number;
}
```

---

## 7. HUD Page Layout

### Entity Description
Page-level layout component that applies HUD styling to Docusaurus pages.

### Props Interface

```typescript
// src/types/layout.ts

export interface HUDHeroProps {
  /**
   * Main title (uses DecryptedText animation)
   */
  title: string;

  /**
   * Subtitle text
   */
  subtitle?: string;

  /**
   * Call-to-action button
   */
  cta?: {
    label: string;
    href: string;
  };

  /**
   * Show GridScan background
   * @default true
   */
  showBackground?: boolean;

  /**
   * Hero height
   * @default '100vh'
   */
  height?: string;
}
```

---

## 8. Shared Types

```typescript
// src/types/common.ts

/** Position in 2D space */
export interface Point2D {
  x: number;
  y: number;
}

/** Size dimensions */
export interface Size {
  width: number;
  height: number;
}

/** Animation timing */
export interface AnimationTiming {
  duration: number;
  delay?: number;
  ease?: string;
}

/** Component with className prop */
export interface WithClassName {
  className?: string;
}

/** Component with children */
export interface WithChildren {
  children: React.ReactNode;
}
```

---

## Entity Relationships

```
┌─────────────────────────────────────────────────────────────────┐
│                         Root.tsx                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              AnimationProvider                           │   │
│  │  ┌───────────────────────────────────────────────────┐  │   │
│  │  │              Crosshair (global)                    │  │   │
│  │  │                                                     │  │   │
│  │  │  ┌─────────────────────────────────────────────┐  │  │   │
│  │  │  │           Page Content                       │  │   │
│  │  │  │  ┌──────────────────┐  ┌────────────────┐  │  │   │
│  │  │  │  │    GridScan      │  │  DecryptedText │  │  │   │
│  │  │  │  │   (Hero BG)      │  │   (Headings)   │  │  │   │
│  │  │  │  └──────────────────┘  └────────────────┘  │  │   │
│  │  │  │                                             │  │   │
│  │  │  │  ┌──────────────────────────────────────┐  │  │   │
│  │  │  │  │           CardSwap                    │  │  │   │
│  │  │  │  │         (Capstone)                    │  │  │   │
│  │  │  │  └──────────────────────────────────────┘  │  │   │
│  │  │  └─────────────────────────────────────────────┘  │   │
│  │  └───────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Validation Summary

| Entity | Required Props | Validation Rules |
|--------|---------------|------------------|
| GridScan | none | opacity 0-1, divisions > 0 |
| Crosshair | none | size > 0, strokeWidth > 0 |
| DecryptedText | text | text.length > 0, duration > 0 |
| CardSwap | cards | cards.length > 0 |
| AnimationProvider | children | - |
