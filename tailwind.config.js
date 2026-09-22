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
        sans: ['Hanken Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'Times New Roman', 'serif'],
      },
      colors: {
        // Warm Neutral Palette (LuxeLoom-Inspired)
        'warm': {
          bg: '#F5F1EB',
          card: '#FDFAF6',
          surface: '#FAF7F2',
          text: '#2A241E',
          muted: '#6E6459',
          border: '#E6DDD1',
          'border-light': '#EFE8DC',
          accent: '#18181B',
          'accent-hover': '#000000',
          'accent-light': '#F4F4F5',
          'badge-bg': '#F4F4F5',
          'badge-text': '#18181B',
        },
        // Legacy tokens (kept for backward compat)
        '3d-red': '#18181B',
        '3d-dark': '#2A241E',
        '3d-card': '#FDFAF6',
      },
      borderRadius: {
        'card': '22px',
      },
      boxShadow: {
        'card': '0 1px 2px rgba(42,36,30,.03), 0 18px 40px -30px rgba(42,36,30,.18)',
        'card-hover': '0 1px 2px rgba(42,36,30,.03), 0 34px 60px -32px rgba(42,36,30,.28)',
        'warm-sm': '0 1px 3px rgba(42,36,30,.06)',
        'warm-md': '0 4px 16px rgba(42,36,30,.08)',
        'warm-lg': '0 12px 32px rgba(42,36,30,.12)',
      },
    },
  },
  plugins: [],
};
