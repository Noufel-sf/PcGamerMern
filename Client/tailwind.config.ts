/** @type {import('tailwindcss').Config} */
import { red } from 'tailwindcss/colors';

export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: red[600],
        'primary-hover': red[700],
      },
    },
  },
  plugins: [],
};
