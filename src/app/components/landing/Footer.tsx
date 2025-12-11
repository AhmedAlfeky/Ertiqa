'use client';

import Link from 'next/link';
import MaxWidthWrapper from '../MaxwidthWrapper';
import { H3, H4, P } from '@/components/ui/Typography';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer({ locale }: { locale: string }) {
  const isRTL = locale === 'ar';

  return (
    <footer className="relative mt-24 overflow-hidden bg-slate-900 pt-20 pb-10 text-white">
      {/* --- Background Decor --- */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-primary to-transparent opacity-50" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-yale-blue/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gold-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <MaxWidthWrapper className="relative z-10">
        <div className="grid gap-12 lg:grid-cols-12 mb-16">
          {/* --- Column 1: Brand & About (Span 4) --- */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <H3 className="text-3xl font-bold text-white mb-2">
                {locale === 'ar' ? 'إرتقاء' : 'Ertiqa'}
                <span className="text-gold-primary">.</span>
              </H3>
              <P className="text-slate-400 text-base leading-relaxed max-w-sm">
                {locale === 'ar'
                  ? 'منصة تعليمية رائدة تهدف إلى تطوير المهارات المهنية والشخصية من خلال دورات احترافية ومعتمدة.'
                  : 'A leading educational platform aiming to develop professional and personal skills through professional and accredited courses.'}
              </P>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <SocialIcon icon={Facebook} href="#" />
              <SocialIcon icon={Twitter} href="#" />
              <SocialIcon icon={Instagram} href="#" />
              <SocialIcon icon={Linkedin} href="#" />
            </div>
          </div>

          {/* --- Column 2: Links (Span 2) --- */}
          <div className="lg:col-span-2">
            <H4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              {locale === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </H4>
            <ul className="space-y-4">
              <FooterLink
                href={`/${locale}/courses`}
                label={locale === 'ar' ? 'جميع الدورات' : 'All Courses'}
                isRTL={isRTL}
              />
              <FooterLink
                href={`/${locale}/instructors`}
                label={locale === 'ar' ? 'المدربون' : 'Instructors'}
                isRTL={isRTL}
              />
              <FooterLink
                href={`/${locale}/blog`}
                label={locale === 'ar' ? 'المقالات' : 'Blog'}
                isRTL={isRTL}
              />
              <FooterLink
                href={`/${locale}/about`}
                label={locale === 'ar' ? 'من نحن' : 'About Us'}
                isRTL={isRTL}
              />
            </ul>
          </div>

          {/* --- Column 3: Support (Span 2) --- */}
          <div className="lg:col-span-2">
            <H4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              {locale === 'ar' ? 'المساعدة' : 'Support'}
            </H4>
            <ul className="space-y-4">
              <FooterLink
                href={`/${locale}/help`}
                label={locale === 'ar' ? 'الأسئلة الشائعة' : 'FAQs'}
                isRTL={isRTL}
              />
              <FooterLink
                href={`/${locale}/terms`}
                label={
                  locale === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'
                }
                isRTL={isRTL}
              />
              <FooterLink
                href={`/${locale}/privacy`}
                label={locale === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
                isRTL={isRTL}
              />
              <FooterLink
                href={`/${locale}/contact`}
                label={locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
                isRTL={isRTL}
              />
            </ul>
          </div>

          {/* --- Column 4: Newsletter & Contact (Span 4) --- */}
          <div className="lg:col-span-4 space-y-6">
            {/* Newsletter Box */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <H4 className="text-white font-bold mb-2">
                {locale === 'ar'
                  ? 'انضم لنشرتنا البريدية'
                  : 'Join Our Newsletter'}
              </H4>
              <P className="text-slate-400 text-sm mb-4">
                {locale === 'ar'
                  ? 'احصل على أحدث العروض والمقالات التعليمية.'
                  : 'Get the latest updates and educational articles.'}
              </P>
              <div className="flex gap-2">
                <Input
                  placeholder={
                    locale === 'ar'
                      ? 'بريدك الإلكتروني...'
                      : 'Your email address...'
                  }
                  className="bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-gold-primary"
                />
                <Button
                  size="icon"
                  className="bg-gold-primary hover:bg-gold-primary/90 text-slate-900 shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Direct Contact Info */}
            <div className="space-y-3 pt-2">
              <ContactItem icon={Mail} text="contact@ertiqa.com" />
              <ContactItem icon={Phone} text="+966 50 000 0000" />
              <ContactItem
                icon={MapPin}
                text={
                  locale === 'ar'
                    ? 'الرياض، المملكة العربية السعودية'
                    : 'Riyadh, Saudi Arabia'
                }
              />
            </div>
          </div>
        </div>

        {/* --- Bottom Bar --- */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-start">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Ertiqa.{' '}
            {locale === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </p>

          <div className="flex items-center gap-6 text-sm text-slate-400">
            <Link href="#" className="hover:text-white transition-colors">
              {locale === 'ar' ? 'الخصوصية' : 'Privacy'}
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              {locale === 'ar' ? 'الشروط' : 'Terms'}
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              {locale === 'ar' ? 'خريطة الموقع' : 'Sitemap'}
            </Link>
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
}

// --- Sub-Components ---

function FooterLink({
  href,
  label,
  isRTL,
}: {
  href: string;
  label: string;
  isRTL: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        className="group flex items-center gap-2 text-slate-400 hover:text-gold-primary transition-all duration-300"
      >
        <ArrowRight
          className={`w-3 h-3 text-gold-primary opacity-0 group-hover:opacity-100 transition-all duration-300 ${
            isRTL
              ? 'rotate-180 -translate-x-2 group-hover:translate-x-0'
              : '-translate-x-2 group-hover:translate-x-0'
          }`}
        />
        <span className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
          {label}
        </span>
      </Link>
    </li>
  );
}

function SocialIcon({ icon: Icon, href }: { icon: any; href: string }) {
  return (
    <Link
      href={href}
      className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-gold-primary hover:text-slate-900 hover:border-gold-primary transition-all duration-300 hover:-translate-y-1"
    >
      <Icon className="w-4 h-4" />
    </Link>
  );
}

function ContactItem({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-400">
      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5 text-gold-primary" />
      </div>
      <span>{text}</span>
    </div>
  );
}
