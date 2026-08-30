/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        '3d-red': '#e63946',
        '3d-dark': '#0f0f11',
        '3d-card': '#18181c',
        'fashion-bg': '#FAF9F6',
        'fashion-sage': '#7d9884',
        'fashion-lavender': '#d8d4f2',
        'beauty-bg': '#FDF5F3',
        'beauty-rose': '#d4a373',
        'beauty-accent': '#c88770',
      },
    },
  },
  plugins: [],
};
