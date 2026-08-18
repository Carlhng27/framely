/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FBF6EE',
        ink: '#1C1B19',
        coral: '#F1584C',
        'coral-dark': '#D6402F',
        teal: '#2F6F68',
        gold: '#E3A23C',
        line: '#E8E1D3',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        body: ['var(--font-worksans)', 'sans-serif'],
      },
      keyframes: {
        'heart-pop': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '30%': { transform: 'scale(1.3)', opacity: '1' },
          '60%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)', opacity: '0' },
        },
        'rise-in': {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'heart-pop': 'heart-pop 700ms ease-out forwards',
        'rise-in': 'rise-in 400ms ease-out forwards',
      },
    },
  },
  plugins: [],
};
