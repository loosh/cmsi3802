/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        logoblue: '#01406b',
        logobg: '#e9f0f6',
        logoyellow: '#ffdc44',
        python: '#4B8BBE',
        javascript: '#e6c82a',
      }
    }
  },
  plugins: [],
}

