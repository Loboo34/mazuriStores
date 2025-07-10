/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        african: {
          terracotta: '#CD853F',
          'terracotta-dark': '#B8722C',
          red: '#B22222',
          'red-dark': '#8B1A1A',
          gold: '#DAA520',
          'gold-dark': '#B8860B',
          teal: '#008B8B',
          'teal-dark': '#006666',
          brown: '#8B4513',
          'brown-dark': '#654321',
          cream: '#F5F5DC',
          orange: '#FF8C00',
          'orange-dark': '#FF7F00',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'pulse-glow': 'pulseGlow 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(218, 165, 32, 0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(218, 165, 32, 0.8)' },
        },
      }
    },
  },
  plugins: [],
};