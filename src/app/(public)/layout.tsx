import { ReactNode } from 'react';
import Header from '@/components/shared/layout/Header';
import Navbar from '@/components/shared/layout/Navbar';
import Footer from '@/components/shared/layout/Footer';


export default function PublicLayout({
  children,
  lang
}: {
  children: ReactNode;
  lang: string;
}) {

//const lang = params.lang; // RootLayout هو اللي يضمن صحتها

 return (
    // ✅ الآن المدقق يرى أن lang من النوع 'ar' | 'en'
    <div>
      <Header lang={lang} />
      <Navbar lang={lang} />
      <main>{children}</main>
      <Footer lang={lang} />
    </div>
  );
}