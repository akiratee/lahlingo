/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors
        brand: {
          brown: '#8B5E3C',
          gold: '#D4A574',
        },
        // Tone Visualization Colors
        tone: {
          1: '#4CAF50', // Green - Flat, High
          2: '#2196F3', // Blue - Rising  
          3: '#F44336', // Red - Falling
          5: '#9E9E9E', // Gray - Low, Flat
          6: '#FF9800', // Orange - Low Rising
          7: '#673AB7', // Purple - Entering
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Noto Serif SC', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
