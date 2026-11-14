import type { Config } from 'tailwindcss';

/** 所有颜色都以 CSS 变量（RGB 通道）为唯一来源，支持 /opacity 语法。 */
const token = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './content/**/*.{md,json}',
  ],
  theme: {
    extend: {
      colors: {
        paper: token('--paper'),
        'paper-soft': token('--paper-soft'),
        surface: token('--surface'),
        'surface-2': token('--surface-2'),
        ink: token('--ink'),
        'ink-2': token('--ink-2'),
        muted: token('--muted'),
        line: token('--line'),
        'line-strong': token('--line-strong'),
        accent: token('--accent'),
        'accent-ink': token('--accent-ink'),
        'accent-soft': token('--accent-soft'),
        olive: token('--olive'),
        'olive-soft': token('--olive-soft'),
        gold: token('--gold'),
        'gold-soft': token('--gold-soft'),
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        serif: ['var(--font-serif)'],
        mono: ['var(--font-mono)'],
      },
      maxWidth: {
        page: '1200px',
        reading: '760px',
      },
      borderRadius: {
        sm: '8px',
        DEFAULT: '12px',
        lg: '18px',
        xl: '24px',
      },
      boxShadow: {
        hair: '0 1px 2px rgb(66 48 24 / 0.05)',
        soft: '0 2px 4px rgb(66 48 24 / 0.04), 0 14px 34px -18px rgb(66 48 24 / 0.22)',
        lift: '0 6px 14px -8px rgb(66 48 24 / 0.18), 0 24px 48px -28px rgb(66 48 24 / 0.28)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'bar-grow': {
          from: { transform: 'scaleY(0)' },
          to: { transform: 'scaleY(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.4s ease both',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
