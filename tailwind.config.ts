import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}', // optional, in case you use pages directory too
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}', // in case you keep components in src
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          background: "var(--background)",
          foreground: "var(--foreground)",
          dark: '#1e3a8a',
          light: '#93c5fd',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
  darkMode: 'class', // or 'media'
}satisfies Config;
