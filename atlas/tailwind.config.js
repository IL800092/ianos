/** @type {import('tailwindcss').Config} */
// Design tokens live in src/index.css as RGB-triplet CSS variables.
// Tailwind reads them here so `bg-panel`, `text-accent` etc. all retheme
// from one place.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--c-bg) / <alpha-value>)',
        raised: 'rgb(var(--c-raised) / <alpha-value>)',
        panel: 'rgb(var(--c-panel) / <alpha-value>)',
        edge: 'rgb(var(--c-edge) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        dim: 'rgb(var(--c-dim) / <alpha-value>)',
        accent: 'rgb(var(--c-accent) / <alpha-value>)',
        'accent-deep': 'rgb(var(--c-accent-deep) / <alpha-value>)',
        violet: 'rgb(var(--c-violet) / <alpha-value>)',
        ok: 'rgb(var(--c-ok) / <alpha-value>)',
        warn: 'rgb(var(--c-warn) / <alpha-value>)',
        danger: 'rgb(var(--c-danger) / <alpha-value>)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 24px rgb(var(--c-accent) / 0.12)',
      },
    },
  },
  plugins: [],
}
