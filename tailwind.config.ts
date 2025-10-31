import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],

  theme: {
    extend: {
      fontFamily: { sans: ['var(--font-tajawal)', 'sans-serif'], // ← معنى sans أنه الخط الافتراضي
                    tajawal: ['var(--font-tajawal)', 'sans-serif'],
                    amiri: ['var(--font-amiri)', 'serif'],
                    cairo: ['var(--font-cairo)', 'sans-serif'],
                    changa: ['var(--font-changa)', 'sans-serif'],
                    inter: ['var(--font-inter)', 'sans-serif'],
                    roboto: ['var(--font-roboto)', 'sans-serif'],
                    gesstwo: ['var(--font-ge-ss-two)', 'sans-serif'],
                    gesstv: ['var(--font-ge-ss-tv)', 'sans-serif'],
                    mateen: ['var(--font-mateen)', 'sans-serif'],
                    mohanned: ['var(--font-mohanned)', 'serif'],
                    mothanna: ['var(--font-mothanna)', 'serif'],
                    arslan: ['var(--font-arslan)', 'sans-serif'],                   
       },
    },
  },
  //darkMode: ["class", '[data-theme="dark"]'], // لدعم الثيم الداكن عبر الـ class أو data-theme
  plugins: [],
};

export default config;