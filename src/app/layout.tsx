import type { Metadata } from "next";
import { Amiri, Cairo, Tajawal, Changa, Inter, Roboto/*"Noto Kufi Arabic", 'El Messiri', Lateef*/} from 'next/font/google'
import localFont from 'next/font/local';
import './globals.css';
import './styles/common.css';
import { ReactNode } from 'react';


const amiri = Amiri({ subsets: ['arabic'], weight: ['400', '700'], display: 'swap', variable: '--font-amiri', })
const cairo = Cairo({ subsets: ['arabic'], weight: ['400', '700'], display: 'swap', variable: '--font-cairo', })
const tajawal = Tajawal({ subsets: ['arabic'], weight: ['400', '700'], display: 'swap', variable: '--font-tajawal', })
const changa = Changa({ subsets: ['arabic'], weight: ['400', '700'], display: 'swap', variable: '--font-changa', })
const inter = Inter({ subsets: ['latin'], weight: ['400', '700'], display: 'swap', variable: '--font-inter', })
const roboto = Roboto({ subsets: ['latin'], weight: ['400', '700'], display: 'swap', variable: '--font-roboto', })
const gesstwo = localFont({ src: '../../public/fonts/GE SS Two Bold.ttf', display: 'swap', variable: '--font-ge-ss-two', });
const gesstv = localFont({ src: '../../public/fonts/GE SS TV Bold.ttf', display: 'swap', variable: '--font-ge-ss-tv', });
const mateen = localFont({ src: '../../public/fonts/ae_AlMateen.ttf', display: 'swap', variable: '--font-mateen', });
const mohanned = localFont({ src: '../../public/fonts/ae_AlMohanad.ttf', display: 'swap', variable: '--font-mohanned', });
const mothanna = localFont({ src: '../../public/fonts/ae_AlMothnna_bold.ttf', display: 'swap', variable: '--font-mothanna', });
const arslan = localFont({ src: '../../public/fonts/Arslan.ttf', display: 'swap', variable: '--font-arslan', });


export const metadata: Metadata = {
  title: "منصة ارتقاء",
  description: "منصة ارتقاء تعليمية تفاعلية",
};
// هذا الملف لا يحتوي على <html> أو <body>
// فقط يمرّر children
export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="ar" dir="rtl" className={cairo.className}>
      <body className={`${tajawal.variable} ${amiri.variable} ${cairo.variable} ${changa.variable} ${inter.variable} ${roboto.variable}`}>
        {children}
      </body>
    </html>
  );
}