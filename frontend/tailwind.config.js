/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        moss: '#2E4036',
        clay: '#CC5833',
        cream: '#F2F0E9',
        charcoal: '#1A1A1A',
        'moss-light': '#3A5446',
        'moss-dark': '#1E2D24',
        'clay-light': '#E06A45',
        'clay-dark': '#A84528',
        'cream-dark': '#E8E5DC',
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', '"Outfit"', 'sans-serif'],
        outfit: ['"Outfit"', 'sans-serif'],
        drama: ['"Cormorant Garamond"', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        'organic': '2rem',
      },
      transitionTimingFunction: {
        'magnetic': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      boxShadow: {
        'organic-sm': '0 2px 8px rgba(30, 45, 36, 0.06)',
        'organic': '0 4px 24px rgba(30, 45, 36, 0.08)',
        'organic-lg': '0 8px 48px rgba(30, 45, 36, 0.12)',
        'clay-glow': '0 4px 32px rgba(204, 88, 51, 0.15)',
      },
      letterSpacing: {
        'tighter-custom': '-0.04em',
      },
    },
  },
  plugins: [],
};
