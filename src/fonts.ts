// src/fonts.ts
import {
  Cairo,
  Poppins,
  Orbitron,
  Amiri,
  Tajawal,
  Changa,
  Inter,
  Roboto,
} from 'next/font/google';
import localFont from 'next/font/local';

// ============================================
// 1. الخطوط الأساسية للمنصة (Core Platform Fonts)
// ============================================
export const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-cairo',
});

export const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  fallback: ['system-ui', 'arial'],
});

export const orbitron = Orbitron({
  variable: '--font-orbitron',
  subsets: ['latin'],
  display: 'swap',
});

// ============================================
// 2. خطوط المحتوى والتصميم الإضافية (Google Fonts)
// ============================================
export const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-amiri',
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

// ============================================
// 3. الخطوط المحلية الخاصة (Local Fonts)
// ============================================
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

// ============================================
// 4. مجمع متغيرات كافة الخطوط للحقن في الـ Root Layout
// ============================================
export const fontVariables = [
  cairo.variable,
  poppins.variable,
  orbitron.variable,
  amiri.variable,
  tajawal.variable,
  changa.variable,
  inter.variable,
  roboto.variable,
  gesstwo.variable,
  gesstv.variable,
  mateen.variable,
  mohanned.variable,
  mothanna.variable,
  arslan.variable,
].join(' ');