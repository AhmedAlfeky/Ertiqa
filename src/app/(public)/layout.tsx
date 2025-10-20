import { ReactNode } from 'react';
import Header from '@/components/shared/layout/Header';
import Navbar from '@/components/shared/layout/Navbar';
import Footer from '@/components/shared/layout/Footer';

type PublicLayoutProps = { children: ReactNode; lang: string };


export default function PublicLayout({ children, lang }: PublicLayoutProps)
 { const dir = lang === 'ar' ? 'rtl' : 'ltr';
   const fontClass = lang === 'ar' ? 'font-tajawal' : 'font-inter';


  return (
    <div dir={dir} className={fontClass}>
      <Header lang={lang} />
      <Navbar lang={lang} />
      <main>{children}</main>
      <Footer lang={lang} />
    </div>
  );
}