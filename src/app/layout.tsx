import type { Metadata } from "next";
import { tajawal, cairo, amiri, changa, inter, roboto, gesstwo, gesstv, mateen, mohanned, mothanna, arslan } from '@/fonts';
import './globals.css';
import './styles/common.css';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: "منصة ارتقاء",
  description: "منصة ارتقاء تعليمية تفاعلية",
};

// قائمة اللغات المدعومة
const SUPPORTED_LANGS = ["ar", "en", "fr", "de", "tr"] as const;
type SupportedLang = typeof SUPPORTED_LANGS[number];

function getValidLang(input: string): SupportedLang {
  return SUPPORTED_LANGS.includes(input as SupportedLang)
    ? (input as SupportedLang)
    : "ar";
}

const RTL_LANGS = ["ar", "he", "fa", "ur"];

export default function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { lang?: string };
}) {
  const lang = getValidLang(params?.lang || "ar");
  const dir = RTL_LANGS.includes(lang) ? "rtl" : "ltr";


  // جمع كل المتغيرات في كلاس واحد
  const fontVariables = [
    amiri.variable,
    cairo.variable,
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
  
  return (
    <html lang={lang} dir={dir}>
      <body className={fontVariables}>
        {children}
      </body>
    </html>
  );
}