/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        copper: {
          50:  '#fdf6ef',
          100: '#f7e8d4',
          200: '#eecfa8',
          300: '#d4956a',
          400: '#c4845a',
          500: '#b87c52',
          600: '#8b5e3c',
          700: '#7a4f2e',
          800: '#5c3820',
          900: '#3d2510',
        },
        warm: {
          50:  '#faf9f7',
          100: '#f3efe8',
          200: '#ede8e0',
          300: '#d4c4b4',
          400: '#b8a090',
          500: '#9c8570',
          600: '#6b5c48',
          700: '#3d3228',
          800: '#2a221a',
          900: '#1c1814',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
