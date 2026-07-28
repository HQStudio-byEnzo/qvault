import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        white: 'oklch(var(--surface-50) / <alpha-value>)',
        black: 'oklch(var(--surface-950) / <alpha-value>)',
        surface: {
          DEFAULT: 'oklch(var(--surface-950) / <alpha-value>)',
          50: 'oklch(var(--surface-50) / <alpha-value>)',
          100: 'oklch(var(--surface-100) / <alpha-value>)',
          200: 'oklch(var(--surface-200) / <alpha-value>)',
          300: 'oklch(var(--surface-300) / <alpha-value>)',
          400: 'oklch(var(--surface-400) / <alpha-value>)',
          500: 'oklch(var(--surface-500) / <alpha-value>)',
          600: 'oklch(var(--surface-600) / <alpha-value>)',
          700: 'oklch(var(--surface-700) / <alpha-value>)',
          800: 'oklch(var(--surface-800) / <alpha-value>)',
          900: 'oklch(var(--surface-900) / <alpha-value>)',
          950: 'oklch(var(--surface-950) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'oklch(var(--accent-500) / <alpha-value>)',
          50: 'oklch(var(--accent-50) / <alpha-value>)',
          100: 'oklch(var(--accent-100) / <alpha-value>)',
          200: 'oklch(var(--accent-200) / <alpha-value>)',
          300: 'oklch(var(--accent-300) / <alpha-value>)',
          400: 'oklch(var(--accent-400) / <alpha-value>)',
          500: 'oklch(var(--accent-500) / <alpha-value>)',
          600: 'oklch(var(--accent-600) / <alpha-value>)',
          700: 'oklch(var(--accent-700) / <alpha-value>)',
          800: 'oklch(var(--accent-800) / <alpha-value>)',
          900: 'oklch(var(--accent-900) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Segoe UI Variable', 'Segoe UI', 'Aptos', 'ui-sans-serif', 'sans-serif'],
        mono: ['Cascadia Mono', 'SFMono-Regular', 'Consolas', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        xl: '0.375rem',
        '2xl': '0.625rem',
      },
      animation: {
        'fade-in': 'fadeIn 280ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 380ms cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 260ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
