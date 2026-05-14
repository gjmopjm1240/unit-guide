/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ebf2ff',
          100: '#d8e4ff',
          600: '#1e4f9a',
          700: '#163c74',
          800: '#0b2c5f'
        }
      },
      boxShadow: {
        card: '0 2px 10px rgba(11,44,95,0.1)'
      }
    }
  },
  plugins: []
};
