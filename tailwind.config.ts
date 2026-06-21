import type { Config } from 'tailwindcss';

const config: Config = {
  // All Tailwind classes are prefixed with "tw-" to avoid
  // collisions with the Fluig Style Guide CSS.
  prefix: 'tw-',
  content: ['./src/react/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  // Do NOT inject Tailwind's base reset — Fluig controls the base styles.
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};

export default config;
