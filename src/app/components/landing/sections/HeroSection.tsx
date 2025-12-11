'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import {
  Play,
  Award,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import LogoLoop from '@/components/LogoLoop';
import MaxWidthWrapper from '@/app/components/MaxwidthWrapper';

// --- Constants & Mock Data ---
const LOGOS = [
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Duolingo_logo_2019.svg/320px-Duolingo_logo_2019.svg.png',
    alt: 'Duolingo',
  },
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Codecademy_logo.svg/320px-Codecademy_logo.svg.png',
    alt: 'Codecademy',
  },
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Udemy_logo.svg/320px-Udemy_logo.svg.png',
    alt: 'Udemy',
  },
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Coursera-Logo_600x600.svg/320px-Coursera-Logo_600x600.svg.png',
    alt: 'Coursera',
  },
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Pluralsight_logo.svg/320px-Pluralsight_logo.svg.png',
    alt: 'Pluralsight',
  },
];

interface HeroSectionProps {
  locale: string;
}

export function HeroSection({ locale }: HeroSectionProps) {
  const t = useTranslations('landing.hero');
  const currentLocale = useLocale();
  const isRTL = currentLocale === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="relative w-full overflow-hidden bg-[#f8f8f8]">
      <div className="absolute inset-0   dark:bg-slate-950 z-0" />

      <div
        className={cn(
          'absolute inset-y-0 hidden h-full lg:block w-[45%] bg-[#175078] dark:bg-yale-blue z-0 shadow-2xl',
          isRTL ? 'left-0' : 'right-0'
        )}
      >
        {/* Texture inside the colored shape */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        ></div>

        {/* Floating Doodles (Background) */}
        <CloudShape className="absolute top-20 right-20 w-32 h-20 text-white/10" />
        <CloudShape className="absolute bottom-40 left-10 w-24 h-16 text-white/5" />

        {/* Squiggle */}
        <svg
          className="absolute top-1/3 left-1/4 w-20 h-20 text-gold-primary/20"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          <path d="M10,50 Q25,25 50,50 T90,50" />
        </svg>
      </div>

      {/* =========================================
          2. MAIN CONTENT
      ========================================= */}
      <MaxWidthWrapper className="relative  z-10 ">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* --- LEFT COLUMN: TEXT (Spans 7 cols) --- */}
          <div className="lg:col-span-7  pt-24 lg:pb-20 flex flex-col space-y-8 text-center lg:text-start">
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center lg:justify-start"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-primary/15 dark:bg-gold-primary/10 text-gold-primary text-sm font-bold tracking-wide uppercase border border-gold-primary/30 dark:border-gold-primary/25">
                <Sparkles className="w-4 h-4 fill-current" />
                {t('tagline')}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-slate-900 dark:text-white leading-[1.1] tracking-tight"
            >
              {t('titleLine1')} <br />
              {t('titleLine2')}{' '}
              <span className="relative whitespace-nowrap text-transparent bg-clip-text bg-linear-to-r from-[#d2ad37] to-[#e5d398] dark:from-gold-primary dark:to-gold-light">
                {t('titleHighlight')}
              </span>
              <br />
              {t('titleLine3')}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              {t('description')}
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2"
            >
              <Button
                asChild
                size="lg"
                className="h-14 px-8 rounded-full bg-yale-blue text-white shadow-xl shadow-yale-blue/25 text-lg font-bold hover:scale-105 transition-all duration-300 dark:bg-yale-blue dark:text-white"
              >
                <Link href={`/${locale}/courses`}>
                  {t('ctaPrimary')}{' '}
                  <ArrowIcon
                    className={cn('w-5 h-5', isRTL ? 'mr-2' : 'ml-2')}
                  />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 px-8 rounded-full border-2 border-slate-200 dark:border-slate-700 hover:border-[#1a5f5a] dark:hover:border-gold-primary text-slate-700 dark:text-white hover:bg-transparent text-lg font-bold transition-all duration-300 group"
              >
                <Link
                  href={`/${locale}/instructors`}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gold-primary/15 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-3.5 h-3.5 fill-gold-primary text-gold-primary ml-0.5" />
                  </div>
                  {t('ctaSecondary')}
                </Link>
              </Button>
            </motion.div>

            {/* Social Proof / Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="pt-6 flex items-center justify-center lg:justify-start gap-6"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <img
                    key={i}
                    src={`https://i.pravatar.cc/100?img=${i + 15}`}
                    className="w-10 h-10 rounded-full border-[3px] border-white dark:border-slate-900"
                    alt="Student"
                  />
                ))}
                <div className="w-10 h-10 rounded-full border-[3px] border-white dark:border-slate-900 bg-gold-primary text-slate-900 flex items-center justify-center text-xs font-bold">
                  +2K
                </div>
              </div>
              <div
                className={cn('text-left', isRTL ? 'text-right' : 'text-left')}
              >
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {t('joinedUs')}
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-gold-primary text-xs">★★★★★</span>
                  <span className="text-xs text-slate-500">(4.9/5)</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* --- RIGHT COLUMN: IMAGE (Spans 5 cols) --- */}
          {/* This sits ON TOP of the colored background shape */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative z-10 w-full max-w-[450px]"
            >
              {/* Decorative Circle Behind Head (Pop effect) */}
              <div className="absolute top-10 left-10 w-3/4 h-3/4 bg-white/10 rounded-full blur-2xl -z-10" />

              {/* Main Image with Frame Effect */}
              <div className="relative rounded-[2.5rem] overflow-hidden border-8 border-white/20 dark:border-white/10 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop"
                  alt="Happy Student"
                  className="w-full h-auto object-cover transform scale-105 hover:scale-100 transition-transform duration-700"
                />

                {/* Gradient Overlay for Text Readability if needed */}
                <div className="absolute inset-0 bg-linear-to-t from-[#175078]/80 via-transparent to-transparent opacity-60 mix-blend-multiply" />
              </div>

              {/* --- Floating Badge 1: Certificate (Bottom Left) --- */}
              <FloatingCard
                className={cn(
                  'bottom-8 bg-white dark:bg-slate-800 text-slate-900 dark:text-white',
                  isRTL ? '-right-12' : '-left-12'
                )}
                delay={0.5}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Award className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {t('courseLabel')}
                    </p>
                    <p className="text-sm font-extrabold">
                      {t('courseCompleted')}
                    </p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green-500 ml-1" />
                </div>
              </FloatingCard>

              {/* --- Floating Badge 2: Live Class (Top Right) --- */}
              <FloatingCard
                className={cn(
                  'top-12 bg-orange-500 text-white',
                  isRTL ? '-left-6' : '-right-6'
                )}
                delay={1.2}
                duration={5}
              >
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                  </span>
                  <p className="text-xs font-bold uppercase tracking-wider">
                    {t('liveClass')}
                  </p>
                </div>
              </FloatingCard>
            </motion.div>

            {/* Background Spinning Element */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-10 -right-10 text-orange-400 z-0 opacity-50 hidden lg:block"
            >
              <Sparkles className="w-24 h-24" />
            </motion.div>
          </div>
        </div>
      </MaxWidthWrapper>

      {/* ========== LOGO LOOP (Bottom) ========== */}
      <div className="relative z-20 w-full border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-900/70 backdrop-blur-sm">
        <MaxWidthWrapper className="py-3">
          <LogoLoop
            logos={LOGOS}
            speed={90}
            direction={isRTL ? 'right' : 'left'}
            logoHeight={28}
            gap={60}
            className="grayscale opacity-40 hover:opacity-100 transition-all duration-500 dark:invert"
          />
        </MaxWidthWrapper>
      </div>
    </section>
  );
}

// --- Sub-components ---

function FloatingCard({ children, className, delay = 0, duration = 6 }: any) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
      className={cn(
        'absolute p-3 pr-5 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.1)] flex items-center gap-3 z-20',
        className
      )}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration, ease: 'easeInOut', delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function CloudShape({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 60" fill="currentColor">
      <path d="M25,50 Q10,50 10,35 Q10,20 25,20 Q30,5 50,5 Q70,5 75,20 Q90,20 90,35 Q90,50 75,50 Z" />
    </svg>
  );
}
