// tailwind.config.js
const {heroui} = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./docs/**/*.{md,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Futuristic Hackathon Palette
        "cyber-black": "#09090b",
        "cyber-gray": "#18181b",
        "neon-cyan": "#00f0ff",
        "neon-purple": "#bd00ff",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Clean, modern font
      }
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};