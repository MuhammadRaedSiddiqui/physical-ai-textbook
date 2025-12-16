# Tailwind Theme Contract

**Feature**: 001-robot-hud-redesign
**Date**: 2025-12-15

## Overview

Defines the Tailwind CSS theme extensions for the Robot HUD design system. These values are binding and must be used consistently across all components.

---

## Color Palette

### Primary Colors

| Name | Class | Hex | Usage |
|------|-------|-----|-------|
| Cyan Laser | `hud-cyan` | #00f3ff | Links, interactive elements, primary accents |
| Warning Amber | `hud-amber` | #ffb800 | Warnings, CTAs, secondary accents |
| Deep Black | `hud-black` | #050505 | Backgrounds, containers |

### Tailwind Usage

```jsx
// Background
<div className="bg-hud-black" />

// Text
<span className="text-hud-cyan" />

// Border
<div className="border border-hud-cyan" />

// Hover states
<button className="text-hud-cyan hover:text-hud-amber" />
```

### Extended Palette (Generated)

```javascript
// tailwind.config.js
colors: {
  'hud-cyan': {
    DEFAULT: '#00f3ff',
    50: '#e5feff',
    100: '#b3fbff',
    200: '#80f8ff',
    300: '#4df5ff',
    400: '#1af2ff',
    500: '#00f3ff', // DEFAULT
    600: '#00c2cc',
    700: '#009299',
    800: '#006166',
    900: '#003133',
  },
  'hud-amber': {
    DEFAULT: '#ffb800',
    50: '#fff8e5',
    100: '#ffebb3',
    200: '#ffde80',
    300: '#ffd14d',
    400: '#ffc41a',
    500: '#ffb800', // DEFAULT
    600: '#cc9300',
    700: '#996e00',
    800: '#664900',
    900: '#332500',
  },
  'hud-black': {
    DEFAULT: '#050505',
    50: '#1a1a1a',
    100: '#141414',
    200: '#0f0f0f',
    300: '#0a0a0a',
    400: '#070707',
    500: '#050505', // DEFAULT
  },
}
```

---

## Typography

### Font Families

| Name | Class | Font Stack | Usage |
|------|-------|-----------|-------|
| Display | `font-display` | Orbitron, system-ui, sans-serif | H1, H2, H3, hero text |
| Body | `font-body` | Rajdhani, system-ui, sans-serif | Paragraphs, UI text |
| Mono | `font-mono` | JetBrains Mono, monospace | Code, terminal |

### Tailwind Configuration

```javascript
// tailwind.config.js
fontFamily: {
  'display': ['Orbitron', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
  'body': ['Rajdhani', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
  'mono': ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
}
```

### Font Weights

| Weight | Class | Orbitron | Rajdhani | JetBrains Mono |
|--------|-------|----------|----------|----------------|
| 300 | `font-light` | - | ✓ | - |
| 400 | `font-normal` | ✓ | ✓ | ✓ |
| 500 | `font-medium` | ✓ | ✓ | ✓ |
| 600 | `font-semibold` | - | ✓ | - |
| 700 | `font-bold` | ✓ | ✓ | ✓ |
| 900 | `font-black` | ✓ | - | - |

### Usage Examples

```jsx
// Hero title
<h1 className="font-display font-bold text-6xl text-hud-cyan">
  Physical AI
</h1>

// Body text
<p className="font-body font-normal text-lg text-white">
  Learn robotics from the ground up.
</p>

// Code block
<code className="font-mono text-sm text-hud-cyan bg-hud-black-50">
  ros2 run demo_nodes_cpp talker
</code>
```

---

## Spacing & Layout

### Container

```javascript
// tailwind.config.js
container: {
  center: true,
  padding: {
    DEFAULT: '1rem',
    sm: '2rem',
    lg: '4rem',
    xl: '5rem',
  },
}
```

### Custom Spacing

| Name | Class | Value | Usage |
|------|-------|-------|-------|
| HUD Border | `p-hud` | 1px | Thin HUD-style borders |
| Grid Gap | `gap-hud` | 2rem | Standard grid spacing |

---

## Effects & Utilities

### Box Shadow (Glow Effects)

```javascript
// tailwind.config.js
boxShadow: {
  'hud-glow': '0 0 20px rgba(0, 243, 255, 0.3)',
  'hud-glow-lg': '0 0 40px rgba(0, 243, 255, 0.4)',
  'hud-amber-glow': '0 0 20px rgba(255, 184, 0, 0.3)',
}
```

### Usage

```jsx
<button className="shadow-hud-glow hover:shadow-hud-glow-lg">
  Activate
</button>
```

### Border Radius

```javascript
// Keep minimal for HUD aesthetic
borderRadius: {
  'hud': '2px',  // Subtle corner
  'hud-lg': '4px',
}
```

### Backdrop Blur

```javascript
backdropBlur: {
  'hud': '8px',  // Glass-morphism effect
}
```

```jsx
<div className="backdrop-blur-hud bg-hud-black/80">
  HUD Panel Content
</div>
```

---

## Animation

### Transition Duration

```javascript
// tailwind.config.js
transitionDuration: {
  'hud': '300ms',
  'hud-slow': '600ms',
}
```

### Keyframes

```javascript
// tailwind.config.js
keyframes: {
  'hud-pulse': {
    '0%, 100%': { opacity: '1' },
    '50%': { opacity: '0.5' },
  },
  'hud-scan': {
    '0%': { transform: 'translateY(-100%)' },
    '100%': { transform: 'translateY(100%)' },
  },
  'hud-blink': {
    '0%, 100%': { opacity: '1' },
    '50%': { opacity: '0' },
  },
}

animation: {
  'hud-pulse': 'hud-pulse 2s ease-in-out infinite',
  'hud-scan': 'hud-scan 3s linear infinite',
  'hud-blink': 'hud-blink 1s step-end infinite',
}
```

### Usage

```jsx
// Pulsing indicator
<span className="animate-hud-pulse bg-hud-cyan" />

// Blinking cursor
<span className="animate-hud-blink">_</span>
```

---

## Responsive Breakpoints

Use Tailwind defaults:

| Breakpoint | Min Width | Typical Device |
|------------|-----------|----------------|
| sm | 640px | Mobile landscape |
| md | 768px | Tablet |
| lg | 1024px | Laptop |
| xl | 1280px | Desktop |
| 2xl | 1536px | Large desktop |

---

## Dark Mode Configuration

```javascript
// tailwind.config.js
darkMode: ['class', '[data-theme="dark"]'],
```

Since HUD is dark-mode-first, most styles use dark colors by default:

```jsx
// Default (dark mode)
<div className="bg-hud-black text-white">

// Light mode override (if needed)
<div className="bg-hud-black text-white light:bg-white light:text-hud-black">
```

---

## Preflight Disabled

```javascript
// tailwind.config.js
corePlugins: {
  preflight: false, // Preserve Infima/Docusaurus base styles
}
```

**Rationale**: Docusaurus relies on Infima for documentation styling. Disabling Tailwind's preflight prevents conflicts with:
- Default link colors
- List styling in docs
- Form element defaults
- Table styling

---

## Complete tailwind.config.js

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
        'hud-cyan': {
          DEFAULT: '#00f3ff',
          50: '#e5feff',
          100: '#b3fbff',
          500: '#00f3ff',
          700: '#009299',
          900: '#003133',
        },
        'hud-amber': {
          DEFAULT: '#ffb800',
          50: '#fff8e5',
          500: '#ffb800',
          700: '#996e00',
        },
        'hud-black': {
          DEFAULT: '#050505',
          50: '#1a1a1a',
          100: '#141414',
        },
      },
      fontFamily: {
        'display': ['Orbitron', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'body': ['Rajdhani', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'hud-glow': '0 0 20px rgba(0, 243, 255, 0.3)',
        'hud-glow-lg': '0 0 40px rgba(0, 243, 255, 0.4)',
        'hud-amber-glow': '0 0 20px rgba(255, 184, 0, 0.3)',
      },
      borderRadius: {
        'hud': '2px',
        'hud-lg': '4px',
      },
      animation: {
        'hud-pulse': 'hud-pulse 2s ease-in-out infinite',
        'hud-scan': 'hud-scan 3s linear infinite',
        'hud-blink': 'hud-blink 1s step-end infinite',
      },
      keyframes: {
        'hud-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'hud-scan': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'hud-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
```
