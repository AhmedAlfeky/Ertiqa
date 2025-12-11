'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import MaxWidthWrapper from '../MaxwidthWrapper';

export const Navbar = () => {
  const t = useTranslations('Navbar');
  const locale = useLocale();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if we're on the home page
  const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`;

  // تأثير السكرول
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('home'), href: `/${locale}` },
    { name: t('about'), href: `/${locale}#about` },
    { name: t('courses'), href: `/${locale}/courses` },
    { name: t('instructors'), href: `/${locale}/instructors` },
    { name: t('blog'), href: `/${locale}/blog` },
  ];

  // Toggle locale
  const toggleLocale = () => {
    const newLocale = locale === 'ar' ? 'en' : 'ar';
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    window.location.href = `/${newLocale}${pathWithoutLocale}`;
  };

  // Determine navbar background based on page and scroll state
  const getNavbarClasses = () => {
    if (isHomePage) {
      // On home page: transparent when at top, background when scrolled
      return isScrolled
        ? 'bg-background/90 dark:bg-slate-900/90 shadow-lg border-b border-border backdrop-blur-md py-3'
        : 'bg-transparent border-b border-transparent py-4';
    } else {
      // On other pages: always show background (not white)
      return 'bg-slate-50/95 dark:bg-slate-900/95 shadow-md border-b border-border backdrop-blur-md py-3';
    }
  };

  // Determine link colors based on page and scroll state
  const getLinkClasses = () => {
    if (isHomePage) {
      return isScrolled
        ? 'text-yale-blue dark:text-white hover:text-gold-primary dark:hover:text-gold-primary'
        : 'text-white hover:text-gold-primary';
    } else {
      return 'text-yale-blue dark:text-white hover:text-gold-primary dark:hover:text-gold-primary';
    }
  };

  return (
    <nav
      className={cn(
        'fixed top-0 start-0 end-0 z-50 transition-all duration-300 ease-in-out',
        getNavbarClasses()
      )}
    >
      <MaxWidthWrapper noPadding className=" flex items-center justify-between">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <span
            className={cn(
              'text-2xl font-bold transition-colors',
              isScrolled ? 'text-gold-primary' : 'text-gold-primary'
            )}
          >
            إرتقاء
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              className={cn(
                'transition-colors font-medium text-sm',
                getLinkClasses()
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions (Login & Language) */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle isScrolled={isScrolled} />
          <button
            onClick={toggleLocale}
            className={cn(
              'transition flex items-center gap-1',
              getLinkClasses()
            )}
            title={locale === 'ar' ? 'English' : 'العربية'}
          >
            <Globe className="w-4 h-4" />
            <span className="text-sm font-medium">
              {locale === 'ar' ? 'EN' : 'AR'}
            </span>
          </button>
          <Link
            href={`/${locale}/login`}
            className={cn(
              'px-5 py-2 rounded-full border transition font-semibold text-sm',
              isHomePage && !isScrolled
                ? 'border-white text-white hover:bg-white hover:text-yale-blue'
                : 'border-yale-blue text-yale-blue dark:border-gold-primary dark:text-gold-primary hover:bg-yale-blue hover:text-white dark:hover:bg-gold-primary dark:hover:text-yale-blue'
            )}
          >
            {t('login')}
          </Link>
          <Link
            href={`/${locale}/signup`}
            className={cn(
              'px-5 py-2 rounded-full transition font-semibold text-sm',
              isHomePage && !isScrolled
                ? 'bg-gold-primary text-yale-blue hover:bg-gold-light'
                : 'bg-yale-blue text-white dark:bg-gold-primary dark:text-yale-blue hover:bg-yale-blue-light dark:hover:bg-gold-light'
            )}
          >
            {t('signup')}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={cn(
            'md:hidden transition-colors',
            isHomePage && !isScrolled ? 'text-white' : 'text-yale-blue dark:text-white'
          )}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </MaxWidthWrapper>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={cn(
              'md:hidden border-t',
              isHomePage && !isScrolled
                ? 'bg-yale-blue dark:bg-slate-900 border-yale-blue-light dark:border-slate-700'
                : 'bg-slate-50 dark:bg-slate-900 border-border'
            )}
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'text-lg font-medium transition-colors',
                    isScrolled
                      ? 'text-yale-blue dark:text-white hover:text-gold-primary'
                      : 'text-yale-blue dark:text-white hover:text-gold-primary'
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <hr
                className={cn(
                  'my-2',
                  isScrolled
                    ? 'border-border'
                    : 'border-yale-blue-light dark:border-slate-700'
                )}
              />
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <ThemeToggle isScrolled={isScrolled} />
                  <button
                    onClick={toggleLocale}
                    className={cn(
                      'transition flex items-center gap-1 px-3 py-2',
                      isScrolled
                        ? 'text-yale-blue dark:text-white hover:text-gold-primary'
                        : 'text-yale-blue dark:text-white hover:text-gold-primary'
                    )}
                  >
                    <Globe className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {locale === 'ar' ? 'English' : 'العربية'}
                    </span>
                  </button>
                </div>
                <Link
                  href={`/${locale}/login`}
                  className={cn(
                    'text-center w-full py-3 rounded-lg border transition',
                    isScrolled
                      ? 'border-yale-blue text-yale-blue dark:border-gold-primary dark:text-gold-primary hover:bg-yale-blue hover:text-white dark:hover:bg-gold-primary dark:hover:text-yale-blue'
                      : 'border-yale-blue text-yale-blue dark:border-gold-primary dark:text-gold-primary hover:bg-yale-blue hover:text-white dark:hover:bg-gold-primary dark:hover:text-yale-blue'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('login')}
                </Link>
                <Link
                  href={`/${locale}/signup`}
                  className={cn(
                    'text-center w-full py-3 rounded-lg transition font-bold',
                    isScrolled
                      ? 'bg-yale-blue text-white dark:bg-gold-primary dark:text-yale-blue hover:bg-yale-blue-light dark:hover:bg-gold-light'
                      : 'bg-gold-primary text-yale-blue hover:bg-gold-light'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('signup')}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
