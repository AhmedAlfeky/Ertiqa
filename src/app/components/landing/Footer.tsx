import Link from 'next/link';
import MaxWidthWrapper from '../MaxwidthWrapper';
import { H3, H4, P, Muted } from '@/components/ui/Typography';

export function Footer({ locale }: { locale: string }) {
  return (
    <footer className="bg-yale-blue text-white mt-16">
      <MaxWidthWrapper>
        <div className="grid gap-8 md:grid-cols-4 py-10">
          <div className="space-y-3">
            <H3 className="text-white">إرتقاء</H3>
            <P className="text-sm text-white/70">
              {locale === 'ar'
                ? 'منصة تعليمية لدورات تطوير الذات والمهارات المهنية.'
                : 'Learning platform for personal development and professional skills.'}
            </P>
          </div>
          <div>
            <H4 className="text-white mb-3">
              {locale === 'ar' ? 'روابط' : 'Links'}
            </H4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link
                  href={`/${locale}/courses`}
                  className="hover:text-gold-primary transition-colors"
                >
                  {locale === 'ar' ? 'الدورات' : 'Courses'}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/instructors`}
                  className="hover:text-gold-primary transition-colors"
                >
                  {locale === 'ar' ? 'المدربون' : 'Instructors'}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/blog`}
                  className="hover:text-gold-primary transition-colors"
                >
                  {locale === 'ar' ? 'المدونة' : 'Blog'}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <H4 className="text-white mb-3">
              {locale === 'ar' ? 'الدعم' : 'Support'}
            </H4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link
                  href={`/${locale}/help`}
                  className="hover:text-gold-primary transition-colors"
                >
                  {locale === 'ar' ? 'مساعدة' : 'Help'}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/contact`}
                  className="hover:text-gold-primary transition-colors"
                >
                  {locale === 'ar' ? 'اتصل بنا' : 'Contact'}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <H4 className="text-white mb-3">
              {locale === 'ar' ? 'تواصل' : 'Connect'}
            </H4>
            <P className="text-sm text-white/80">contact@ertiqa.com</P>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center">
          <Muted className="text-white/70">
            © {new Date().getFullYear()} Ertiqa. All rights reserved.
          </Muted>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
}
