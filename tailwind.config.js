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
        'display': ['Orbitron', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'body': ['Rajdhani', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'hud-glow': '0 0 20px rgba(0, 243, 255, 0.3)',
        'hud-glow-lg': '0 0 40px rgba(0, 243, 255, 0.4)',
        'hud-amber-glow': '0 0 20px rgba(255, 184, 0, 0.3)',
      },
      animation: {
        'hud-pulse': 'hud-pulse 2s ease-in-out infinite',
        'hud-scan': 'hud-scan 3s linear infinite',
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
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Disable base reset to avoid Infima conflicts
  },
};
