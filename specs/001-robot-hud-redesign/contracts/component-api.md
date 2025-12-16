# Component API Contracts

**Feature**: 001-robot-hud-redesign
**Date**: 2025-12-15

## Overview

This document defines the public API contracts for React Bits components. These contracts are binding - any changes require spec update.

---

## GridScan

### Import
```tsx
import { GridScan } from '@/components/react-bits/GridScan';
```

### Usage
```tsx
// Basic usage
<GridScan />

// With customization
<GridScan
  height="80vh"
  gridColor="#00f3ff"
  gridOpacity={0.2}
  scanSpeed={4}
/>
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| height | string | '100vh' | Container height |
| gridColor | string | '#00f3ff' | Grid line color |
| gridOpacity | number | 0.3 | Grid line opacity (0-1) |
| gridDivisions | number | 20 | Number of grid divisions |
| enableScanLine | boolean | true | Enable scan animation |
| scanSpeed | number | 3 | Seconds per scan cycle |
| enableFaceTracking | boolean | false | Enable camera tracking |
| className | string | undefined | Additional CSS class |

### SSR Handling
- Component is wrapped in `<BrowserOnly>`
- Fallback: `<div>` with background color matching height

### Accessibility
- Respects `prefers-reduced-motion` (scan line disabled)
- `aria-hidden="true"` (decorative element)

---

## Crosshair

### Import
```tsx
import { Crosshair } from '@/components/react-bits/Crosshair';
```

### Usage
```tsx
// In Root.tsx - renders globally
<Crosshair />

// Customized
<Crosshair
  size={40}
  color="#00f3ff"
  hoverColor="#ffb800"
/>
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | number | 32 | Crosshair size in px |
| color | string | '#00f3ff' | Default color |
| hoverColor | string | '#ffb800' | Color on interactive hover |
| showClickAnimation | boolean | true | Animate on click |
| strokeWidth | number | 2 | Line thickness |
| centerGap | number | 8 | Gap in center |
| enabled | boolean | true | Enable/disable crosshair |

### Behavior Contract
1. **Follows cursor** - Updates position on mousemove
2. **Hides on exit** - Invisible when cursor leaves window
3. **Hover detection** - Changes color over `a`, `button`, `[role="button"]`, `input`, `select`
4. **Click feedback** - Scale animation on mousedown/mouseup
5. **Z-index** - Always on top (z-index: 9999)
6. **Pointer events** - `pointer-events: none` (doesn't block clicks)

### SSR Handling
- Wrapped in `<BrowserOnly>`
- No fallback needed (invisible by default)

### Accessibility
- Hidden from screen readers (`aria-hidden="true"`)
- Does not affect tab navigation
- Reduced motion: No click animation

---

## DecryptedText

### Import
```tsx
import { DecryptedText } from '@/components/react-bits/DecryptedText';
```

### Usage
```tsx
// Basic
<DecryptedText text="Physical AI & Robotics" />

// As heading
<DecryptedText
  text="Welcome"
  as="h1"
  duration={1500}
  className="text-4xl font-display"
/>
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| text | string | **required** | Final text to display |
| as | ElementType | 'span' | HTML element type |
| duration | number | 2000 | Animation duration (ms) |
| delay | number | 0 | Start delay (ms) |
| characters | string | [alphanumeric+symbols] | Scramble characters |
| iterations | number | 10 | Cycles per character |
| animateOnView | boolean | true | Start on visibility |
| onComplete | () => void | undefined | Completion callback |
| className | string | undefined | CSS class |

### Animation Contract
1. **Initial state**: All characters randomized
2. **Progress**: Characters settle left-to-right
3. **Final state**: Exact input text displayed
4. **Re-trigger**: Animation restarts if text prop changes

### Accessibility
- `aria-label={text}` - Screen readers get final text
- Reduced motion: Immediate display, no animation

---

## CardSwap

### Import
```tsx
import { CardSwap } from '@/components/react-bits/CardSwap';
```

### Usage
```tsx
const cards = [
  {
    id: 'gazebo',
    title: 'Gazebo Simulation',
    description: 'ROS 2 physics simulation',
    imageUrl: '/img/gazebo.png',
  },
  {
    id: 'isaac',
    title: 'Isaac Sim',
    description: 'NVIDIA GPU-accelerated sim',
    imageUrl: '/img/isaac.png',
  },
  {
    id: 'real',
    title: 'Real Robot',
    description: 'Physical deployment',
    imageUrl: '/img/robot.png',
  },
];

<CardSwap
  cards={cards}
  autoPlay
  autoPlayInterval={4000}
/>
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| cards | CardSwapCard[] | **required** | Card data array |
| cardWidth | number | 300 | Card width (px) |
| cardHeight | number | 400 | Card height (px) |
| stackOffset | number | 20 | Vertical stack offset |
| perspectiveOffset | number | 30 | 3D perspective offset |
| autoPlay | boolean | true | Enable auto-cycling |
| autoPlayInterval | number | 5000 | Cycle interval (ms) |
| animationDuration | number | 600 | Swap animation (ms) |
| clickToSwap | boolean | true | Click advances cards |
| onCardChange | (card, index) => void | undefined | Change callback |
| className | string | undefined | CSS class |

### CardSwapCard Interface
```typescript
interface CardSwapCard {
  id: string;        // Unique identifier
  title: string;     // Card title
  description: string;
  imageUrl: string;
  href?: string;     // Optional link
}
```

### Behavior Contract
1. **Stack layout**: Cards stacked with offset, front card at top
2. **Click interaction**: Front card swaps to back
3. **Auto-play**: Cycles cards at interval
4. **Pause on hover**: Auto-play pauses when hovered
5. **Keyboard**: Enter/Space triggers swap when focused

### SSR Handling
- Wrapped in `<BrowserOnly>`
- Fallback: Static display of first card

### Accessibility
- Cards are focusable (`tabIndex={0}`)
- `aria-label` on each card
- Keyboard navigation supported
- Reduced motion: Instant swap, no animation

---

## AnimationProvider

### Import
```tsx
import { AnimationProvider } from '@/components/providers/AnimationProvider';
```

### Usage
```tsx
// In Root.tsx
export default function Root({ children }) {
  return (
    <AnimationProvider reducedMotion="user">
      {children}
    </AnimationProvider>
  );
}
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | **required** | Child components |
| reducedMotion | 'user' \| 'always' \| 'never' | 'user' | Motion preference |
| transition | TransitionConfig | undefined | Default transition |

### Context Value (useAnimationContext)
```typescript
interface AnimationContextValue {
  reducedMotion: boolean;  // Current reduced motion state
  durationMultiplier: number;  // Animation speed modifier
}
```

---

## Error Handling

### Component Error Boundaries

All React Bits components implement internal error boundaries:

```tsx
// If component crashes, shows fallback UI
<GridScan />
// Error -> Shows solid background

<DecryptedText text="Hello" />
// Error -> Shows static text

<CardSwap cards={[...]} />
// Error -> Shows first card only
```

### Validation Errors

| Component | Validation | Error Behavior |
|-----------|-----------|----------------|
| GridScan | opacity 0-1 | Clamp to valid range |
| Crosshair | size > 0 | Use default |
| DecryptedText | text required | Show empty string |
| CardSwap | cards.length > 0 | Render nothing |

---

## Version Compatibility

| Component | React | TypeScript | Motion | GSAP |
|-----------|-------|------------|--------|------|
| GridScan | ≥18 | ≥5.0 | - | - |
| Crosshair | ≥18 | ≥5.0 | ≥11 | - |
| DecryptedText | ≥18 | ≥5.0 | ≥11 | - |
| CardSwap | ≥18 | ≥5.0 | - | ≥3.12 |
| AnimationProvider | ≥18 | ≥5.0 | ≥11 | - |
