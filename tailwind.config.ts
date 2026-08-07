import type { Config } from 'tailwindcss'

// Token values are CSS variables defined in globals.css — art-direct there, not here.
const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './sanity/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // §7 palette — usa canales RGB para habilitar modificadores de opacidad
        // (text-ink/75, bg-paper/50, border-smoke/30, etc.)
        ink:    'rgb(var(--color-ink-rgb) / <alpha-value>)',
        paper:  'rgb(var(--color-paper-rgb) / <alpha-value>)',
        smoke:  'rgb(var(--color-smoke-rgb) / <alpha-value>)',
        accent: 'rgb(var(--color-accent-rgb) / <alpha-value>)',
        line:   'rgb(var(--color-line-rgb) / <alpha-value>)',
        clay:   'rgb(var(--color-clay-rgb) / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body:    ['var(--font-body)', 'sans-serif'],
        mono:    ['var(--font-mono)', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      transitionTimingFunction: {
        'out-expo':    'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
      },
    },
  },
  plugins: [],
}

export default config
