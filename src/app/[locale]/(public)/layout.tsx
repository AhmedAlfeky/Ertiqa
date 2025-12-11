import { ReactNode } from 'react';
import { Navbar } from '../../components/landing/Navbar';
import { Footer } from '../../components/landing/Footer';

export default async function PublicLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  return (
    <div className="bg-background text-foreground">
      <Navbar />
      <main className="">{children}</main>
      <Footer locale={locale} />
    </div>
  );
}
