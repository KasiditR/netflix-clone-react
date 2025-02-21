import type { Config } from 'tailwindcss';
import tailwindScrollbarHide from 'tailwind-scrollbar-hide';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [tailwindScrollbarHide],
};

export default config;
