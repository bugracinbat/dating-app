/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bumble: {
          yellow: '#F4C430',
          'yellow-dark': '#E5B520',
          'yellow-light': '#FFD84D',
          orange: '#FF6E3A',
          gray: '#7C7C7C',
          'gray-light': '#F7F7F7',
        }
      },
      animation: {
        'swipe-right': 'swipeRight 0.5s ease-out',
        'swipe-left': 'swipeLeft 0.5s ease-out',
      },
      keyframes: {
        swipeRight: {
          '0%': { transform: 'translateX(0) rotate(0deg)', opacity: 1 },
          '100%': { transform: 'translateX(100%) rotate(20deg)', opacity: 0 },
        },
        swipeLeft: {
          '0%': { transform: 'translateX(0) rotate(0deg)', opacity: 1 },
          '100%': { transform: 'translateX(-100%) rotate(-20deg)', opacity: 0 },
        },
      },
    },
  },
  plugins: [],
}