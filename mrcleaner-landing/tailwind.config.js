/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F7A693',
        secondary: '#4EBA6F',
        accent: '#1BB0CE',
        background: '#FDFCFB',
        dark: '#2C2E33',
        grayLight: '#E8E4DD'
      },
      fontFamily: {
        sans: ['"Work Sans"', 'sans-serif'],
        heading: ['"Roboto"', 'sans-serif'],
        drama: ['"Cormorant Garamond"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
