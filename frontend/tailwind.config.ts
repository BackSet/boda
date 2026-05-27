import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        wedding: {
          ivory: 'var(--wedding-ivory)',
          blush: 'var(--wedding-blush)',
          sage: 'var(--wedding-sage)',
          gold: 'var(--wedding-gold)',
          ink: 'var(--wedding-ink)',
          rose: 'var(--accent-rose)',
        },
      },
      fontFamily: {
        script: ['"Great Vibes"', 'cursive'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
    },
  },
} satisfies Config
