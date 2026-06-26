/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        institutional: '#1e3a5f',
        'institutional-light': '#2c5282',
        success: '#2ecc71',
        amber: '#f39c12',
        danger: '#e74c3c',
      },
      keyframes: {
        'fade-in':   { '0%': { opacity: 0, transform: 'translateY(8px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        'pop-in':    { '0%': { opacity: 0, transform: 'scale(0.6)' }, '60%': { transform: 'scale(1.08)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
        'slide-up':  { '0%': { opacity: 0, transform: 'translateY(24px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        shake:       { '0%,100%': { transform: 'translateX(0)' }, '25%': { transform: 'translateX(-6px)' }, '75%': { transform: 'translateX(6px)' } },
      },
      animation: {
        'fade-in':  'fade-in 0.35s ease-out',
        'pop-in':   'pop-in 0.5s cubic-bezier(.22,1.2,.36,1)',
        'slide-up': 'slide-up 0.4s ease-out',
        shake:      'shake 0.4s ease-in-out',
      },
    },
  },
  plugins: [],
}
