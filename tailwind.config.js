/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#05060a',
        surface: '#0b0e17',
        accent: '#6ee7ff',
        accent2: '#a78bfa',
        glow: '#f0abfc',
      },
    },
  },
  plugins: [],
}
