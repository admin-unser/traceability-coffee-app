/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base colors (light theme)
        'base': {
          warm: '#FFFBF5',
          cream: '#FFF8F0',
          white: '#FFFFFF',
        },
        // Text colors
        'text': {
          primary: '#3D3D3D',
          secondary: '#7A7A7A',
          muted: '#A0A0A0',
        },
        // Terracotta accent
        'terracotta': {
          50: '#FEF7F3',
          100: '#FDEBE3',
          200: '#FAD4C4',
          300: '#F5B89A',
          400: '#E8936A',
          500: '#C2703E',
          600: '#A85C32',
          700: '#8B5A3C',
          800: '#6B4530',
          900: '#4A3022',
        },
        // Forest green (success/nature)
        'forest': {
          50: '#F0F5F1',
          100: '#DCE8DE',
          200: '#B8D1BC',
          300: '#8FB896',
          400: '#6A9E73',
          500: '#4A7C59',
          600: '#3B6347',
          700: '#2E4D38',
          800: '#233B2B',
          900: '#1A2B20',
        },
        // Sand (warning)
        'sand': {
          400: '#D4A574',
          500: '#C4956A',
          600: '#A87D54',
        },
        // Coffee red (danger - maintained)
        'coffee-red': '#C41E3A',
        // Legacy colors for compatibility
        'coffee-brown': '#6F4E37',
        'coffee-green': '#2D5016',
        'coffee-cream': '#F5E6D3',
      },
      fontFamily: {
        sans: ['Inter', 'Zen Kaku Gothic New', 'system-ui', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        jp: ['Zen Kaku Gothic New', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 30px -5px rgba(0, 0, 0, 0.05)',
        'terracotta': '0 4px 20px rgba(194, 112, 62, 0.25)',
      },
    },
  },
  plugins: [],
}
