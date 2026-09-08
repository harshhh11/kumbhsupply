/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        kumbh: {
          dark: '#0a0d14',
          card: '#121620',
          surface: '#161c28',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-light': 'rgba(255, 255, 255, 0.16)',
          gold: '#e2b170',
          'gold-light': '#f4d29d',
          sand: '#d5b992',
          water: '#38bdf8',
          safe: '#10b981',
          warning: '#f59e0b',
          critical: '#f43f5e',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
        devanagari: ['Tiro Devanagari Hindi', 'serif']
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'glass-hover': '0 12px 40px 0 rgba(0, 0, 0, 0.6)',
        'subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.3)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
