import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}',],

  theme: {
    extend: {
      fontFamily: { tajawal: ['var(--font-tajawal)'],
                    amiri: ['var(--font-amiri)'],
                    cairo: ['var(--font-cairo)'],
                    changa: ['var(--font-changa)'],
                    inter: ['var(--font-inter)'],
                    roboto: ['var(--font-roboto)'],
                    gesstwo: ['var(--font-ge-ss-two)'],
                    gesstv: ['var(--font-ge-ss-tv)'],
                    mateen: ['var(--font-mateen)'],
                    mohanned: ['var(--font-mohanned)'],
                    mothanna: ['var(--font-mothanna)'],
                    arslan: ['var(--font-arslan)'],                   
       },
    },
  },
  //darkMode: ["class", '[data-theme="dark"]'], // لدعم الثيم الداكن عبر الـ class أو data-theme
  plugins: [],
};

export default config;