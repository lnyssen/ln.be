/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        fg: 'var(--fg)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        accent: 'var(--accent)',
        'accent-strong': 'var(--accent-strong)',
        lab: 'var(--lab)',
      },
      fontFamily: {
        display: ['Gambarino', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Switzer', '"Helvetica Neue"', 'system-ui', 'sans-serif'],
      },
      maxWidth: { shell: '1200px' },
    },
  },
  plugins: [],
};
