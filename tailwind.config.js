/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      maxWidth: {
        'xxs': '240px',
      },
      height: {
        '128': '32rem',
      }
    },
  },
  plugins: [require('@tailwindcss/forms')],
  darkMode: 'class'
}
