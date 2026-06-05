/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,css}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 24px 80px rgba(88, 80, 236, 0.25)',
        cyan: '0 20px 60px rgba(34, 211, 238, 0.16)',
      },
    },
  },
  plugins: [],
};
