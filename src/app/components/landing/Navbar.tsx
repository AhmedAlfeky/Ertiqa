'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe } from 'lucide-react';
import { cn } from '@/lib/utils'; // تأكد إنك عندك دالة دمج الكلاسات دي

export const Navbar = () => {
  const t = useTranslations('Navbar'); // تأكد إن عندك ملف الترجمة
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // تأثير السكرول
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('home'), href: '/' },
    { name: t('about'), href: '#about' },
    { name: t('courses'), href: '/courses' },
    { name: t('instructors'), href: '/instructors' },
    { name: t('blog'), href: '/blog' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
        isScrolled
          ? 'bg-yale-blue/90 backdrop-blur-md shadow-lg py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-gold-primary">إرتقاء</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              className="text-white hover:text-gold-primary transition-colors font-medium text-sm"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions (Login & Language) */}
        <div className="hidden md:flex items-center gap-4">
          <button className="text-white hover:text-gold-primary transition">
            <Globe className="w-5 h-5" />
          </button>
          <Link
            href="/auth/login"
            className="px-5 py-2 rounded-full border border-gold-primary text-gold-primary hover:bg-gold-primary hover:text-yale-blue transition font-semibold text-sm"
          >
            {t('login')}
          </Link>
          <Link
            href="/auth/signup"
            className="px-5 py-2 rounded-full bg-gold-primary text-yale-blue hover:bg-gold-light transition font-semibold text-sm"
          >
            {t('signup')}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-yale-blue border-t border-yale-blue-light"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white text-lg font-medium hover:text-gold-primary"
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-yale-blue-light my-2" />
              <div className="flex flex-col gap-3">
                <Link
                  href="/auth/login"
                  className="text-center w-full py-3 rounded-lg border border-gold-primary text-gold-primary"
                >
                  {t('login')}
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-center w-full py-3 rounded-lg bg-gold-primary text-yale-blue font-bold"
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
