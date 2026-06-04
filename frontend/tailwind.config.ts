import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Hero gradient classes built dynamically
    'from-red-950/80', 'via-slate-900/60',
    'from-cyan-950/80',
    'from-indigo-950/80',
    'from-pink-950/80',
    'from-violet-950/80',
    'from-slate-950/80',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans:    ['DM Sans', 'system-ui', 'sans-serif'],
        reading: ['Lora', 'Georgia', 'serif'],
      },
      colors: {
        journal: {
          mist: '#d5dbe2',
          blue: '#b3bfcb',
          ink: '#778ca4',
          deep: '#313c45',
          dusk: '#4f6271',
        },
        profile: {
          blush: '#f7e5eb',
          lilac: '#c6c6e8',
          mauve: '#9896bb',
          navy: '#344979',
          periwinkle: '#5d6da5',
        },
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.22, 1, 0.36, 1)',
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '250': '250ms',
        '400': '400ms',
        '600': '600ms',
      },
      boxShadow: {
        journal: '0 18px 45px rgba(49,60,69,0.12)',
        float:   '0 20px 60px rgba(49,60,69,0.18)',
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up':  'fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'fade-in':  'fade-in 0.3s ease forwards',
        'scale-in': 'scale-in 0.25s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        shimmer:    'shimmer 1.8s linear infinite',
      },
      aspectRatio: {
        'novel-cover': '2 / 3',
      },
    },
  },
  plugins: [],
}

export default config
