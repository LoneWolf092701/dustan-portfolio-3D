/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        noir: {
          950: "#000000",
          900: "#0a0a0a",
          800: "#141414",
          700: "#1a1a1a",
          600: "#262626",
          500: "#404040",
          400: "#737373",
          300: "#a3a3a3",
          200: "#d4d4d4",
          100: "#e5e5e5",
        }
      },
      boxShadow: {
        noir: "0 0 30px rgba(255, 255, 255, 0.3)",
        "noir-strong": "0 0 50px rgba(255, 255, 255, 0.5)",
        "noir-inner": "inset 0 0 20px rgba(255, 255, 255, 0.1)",
      },
      screens: {
        xs: "450px",
      },
      backgroundImage: {
        "grain": "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noise\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noise)\" opacity=\"0.05\"/%3E%3C/svg%3E')",
        "vignette": "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.8) 100%)",
      },
      animation: {
        'flicker': 'flicker 3s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.95 },
          '75%': { opacity: 0.97 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      }
    },
  },
  plugins: [],
}