import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', 
  ],
  theme: {
    extend: {
      fontFamily: {
        handwriting: ['"Patrick Hand"', 'cursive'], // custom handwriting font
      },
    },
  },
  plugins: [],
};

export default config;
