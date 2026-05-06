/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        ink: '#1a1a2e',
        mist: '#e8eaf6',
        indigo: {
          soft: '#7986cb',
          mid: '#5c6bc0',
          deep: '#3949ab',
        },
        rose: {
          soft: '#f48fb1',
        },
        sage: '#a5d6a7',
      },
    },
  },
  plugins: [],
}
