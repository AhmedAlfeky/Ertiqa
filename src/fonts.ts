// src/fonts.ts
import { Amiri, Cairo, Tajawal, Changa, Inter, Roboto } from 'next/font/google';
import localFont from 'next/font/local';

// خطوط Google Fonts (عربية ولاتينية)
export const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-amiri',
});

export const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-cairo',
});

export const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-tajawal',
});

export const changa = Changa({
  subsets: ['arabic'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-changa',
});

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-inter',
});

export const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-roboto',
});

// خطوط محلية (Local Fonts)
export const gesstwo = localFont({
  src: '../public/fonts/GE SS Two Bold.ttf',
  display: 'swap',
  variable: '--font-ge-ss-two',
});

export const gesstv = localFont({
  src: '../public/fonts/GE SS TV Bold.ttf',
  display: 'swap',
  variable: '--font-ge-ss-tv',
});

export const mateen = localFont({
  src: '../public/fonts/ae_AlMateen.ttf',
  display: 'swap',
  variable: '--font-mateen',
});

export const mohanned = localFont({
  src: '../public/fonts/ae_AlMohanad.ttf',
  display: 'swap',
  variable: '--font-mohanned',
});

export const mothanna = localFont({
  src: '../public/fonts/ae_AlMothnna_bold.ttf',
  display: 'swap',
  variable: '--font-mothanna',
});

export const arslan = localFont({
  src: '../public/fonts/Arslan.ttf',
  display: 'swap',
  variable: '--font-arslan',
});