/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        "dld-dark":    "#001315",
        "dld-darker":  "#001113",
        "dld-navy":    "#091f21",
        "dld-card":    "#192d2f",
        "dld-surface": "#0e2325",
        "dld-gold":    "#EEC14E",
        "dld-amber":   "#DA920F",
        "dld-text":    "#d0e7e9",
        "dld-muted":   "#d1c5b0",
      },
      fontFamily: {
        newsreader: ['"Newsreader"', 'serif'],
        manrope: ['"Manrope"', 'sans-serif'],
      },
      keyframes: {
        'matrix-rain': {
          '0%': {
            backgroundPosition: '0% 0%',
            backgroundSize: '16px 16px, 100% 100%'
          },
          '100%': {
            backgroundPosition: '0% 100%',
            backgroundSize: '32px 32px, 100% 100%'
          }
        }
      },
      animation: {
        'matrix-rain': 'matrix-rain 15s linear infinite'
      },
      borderImage: {
        'gradient-gold-silver': 'linear-gradient(45deg, #FFD700, #C0C0C0) 1'
      }
    },
  },
  plugins: [],
};