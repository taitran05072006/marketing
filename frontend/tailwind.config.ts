import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B4332',
          dark: '#143325',
        },
        secondary: {
          DEFAULT: '#52796F',
        },
        accent: {
          DEFAULT: '#84A98C',
        },
        surface: {
          DEFAULT: '#F2EFEA',
        },
        bg: {
          DEFAULT: '#FAFAF7',
        },
        text: {
          dark: '#2D3B35',
          light: '#F8F9FA',
        },
        border: {
          DEFAULT: '#D8E4DC',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
