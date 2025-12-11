'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Play, Award, Sparkles } from 'lucide-react';
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

  return (
    <section className="relative w-full min-h-screen overflow-hidden flex flex-col justify-center">
      {/* ========== SPLIT BACKGROUND ========== */}
      {/* Left side - Cream/Beige (Light) or Dark Slate (Dark) */}
      <div
        className={cn(
          'absolute inset-y-0 w-2/3 bg-[#faf8f5] dark:bg-slate-900',
          isRTL ? 'right-0' : 'left-0'
        )}
      />

      {/* Right side - Teal/Green (Light) or Yale Blue (Dark) */}
      <div
        className={cn(
          'absolute inset-y-0 w-1/3 bg-[#1a5f5a] dark:bg-yale-blue',
          isRTL ? 'left-0' : 'right-0'
        )}
      >
        {/* White Cloud Shapes on Dark Side */}
        <CloudShape className="absolute top-20 right-8 w-24 h-16 text-white/20" />
        <CloudShape className="absolute top-40 left-4 w-16 h-10 text-white/15" />
        <CloudShape className="absolute bottom-32 right-12 w-20 h-12 text-white/10" />

        {/* Decorative Squiggle */}
        <motion.svg
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute top-1/4 right-1/4 w-16 h-16 text-white/30"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        >
          <path d="M20,50 Q35,20 50,50 T80,50" />
        </motion.svg>
      </div>

      {/* ========== MAIN CONTENT ========== */}
      <MaxWidthWrapper className="relative z-10 py-10 lg:py-12">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* --- Left Column: Content --- */}
          <div
            className={cn(
              'flex flex-col space-y-6 relative',
              isRTL ? 'text-right items-end' : 'text-left'
            )}
          >
            {/* Tagline with Sparkle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'inline-flex items-center gap-2',
                isRTL ? 'flex-row-reverse' : ''
              )}
            >
              <Sparkles className="w-4 h-4 text-gold-primary" />
              <span className="text-gold-primary text-sm font-semibold tracking-wide">
                {t('tagline')}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={cn(
                'text-4xl md:text-5xl lg:text-[3.1rem] font-extrabold text-slate-900 dark:text-white leading-[1.15] tracking-tight',
                isRTL ? 'text-right' : 'text-left'
              )}
            >
              {t('titleLine1')}
              <br />
              {t('titleLine2')}{' '}
              <span className="relative inline-block">
                <span className="relative z-10 px-3 py-1 bg-[#f78d5c] text-white rounded-lg">
                  {t('titleHighlight')}
                </span>
              </span>
              <br />
              {t('titleLine3')}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-md leading-relaxed"
            >
              {t('description')}
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={cn(
                'flex flex-wrap gap-4 pt-2',
                isRTL ? 'flex-row-reverse' : ''
              )}
            >
              <Button
                asChild
                size="lg"
                className="h-12 px-8 rounded-full bg-gold-primary text-slate-900 font-semibold shadow-lg shadow-gold-primary/30 hover:bg-gold-primary/90 hover:scale-105 transition-all duration-300"
              >
                <Link href={`/${locale}/courses`}>{t('ctaPrimary')}</Link>
              </Button>

              <Button
                asChild
                variant="ghost"
                size="lg"
                className={cn(
                  'h-12 px-6 rounded-full text-slate-700 dark:text-white font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 group',
                  isRTL ? 'flex-row-reverse' : ''
                )}
              >
                <Link
                  href={`/${locale}/instructors`}
                  className={cn(
                    'flex items-center gap-3',
                    isRTL ? 'flex-row-reverse' : ''
                  )}
                >
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 fill-slate-700 dark:fill-white text-slate-700 dark:text-white ms-0.5" />
                  </div>
                  {t('ctaSecondary')}
                </Link>
              </Button>
            </motion.div>

            {/* Active Students Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={cn(
                'flex items-center gap-4 pt-6',
                isRTL ? 'flex-row-reverse' : ''
              )}
            >
              <div className={cn('flex', isRTL ? '-space-x-2' : '-space-x-2')}>
                <img
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 object-cover"
                  src="https://i.pravatar.cc/100?img=1"
                  alt=""
                />
                <img
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 object-cover"
                  src="https://i.pravatar.cc/100?img=2"
                  alt=""
                />
                <img
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 object-cover"
                  src="https://i.pravatar.cc/100?img=3"
                  alt=""
                />
              </div>
              <div>
                <p className="text-xl font-bold text-gold-primary">10,000+</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t('statsStudentsLabel')}
                </p>
              </div>
            </motion.div>
          </div>

          {/* --- Right Column: Hero Image --- */}
          <div
            className={cn(
              'relative flex items-center',
              isRTL ? 'justify-start' : 'justify-end'
            )}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              {/* Main Image */}
              <div className="relative w-[280px] md:w-[340px] lg:w-[400px] aspect-3/4 rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute -inset-4 lg:-inset-6 -z-10">
                  <svg className="w-full h-full" preserveAspectRatio="none">
                    <defs>
                      <pattern
                        id="frameStripes"
                        width="12"
                        height="12"
                        patternTransform="rotate(45)"
                        patternUnits="userSpaceOnUse"
                      >
                        <line
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="12"
                          className="stroke-[#f5a962]/50 dark:stroke-gold-primary/30"
                          strokeWidth="3"
                        />
                      </pattern>
                    </defs>
                    <rect
                      width="100%"
                      height="100%"
                      fill="url(#frameStripes)"
                    />
                  </svg>
                </div>

                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop"
                  alt="Student"
                  className="w-full h-full object-cover"
                />

                {/* Gradient Overlay for better contrast */}
                <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
              </div>

              {/* Floating Certificate Card */}
              <motion.div
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className={cn(
                  'absolute bottom-12 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-xl flex items-center gap-3 z-20 border border-slate-100 dark:border-slate-700',
                  isRTL ? '-right-4 md:-right-8' : '-left-4 md:-left-8'
                )}
              >
                <div className="w-10 h-10 bg-gold-primary/20 rounded-full flex items-center justify-center text-gold-primary">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {t('certified')}
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {t('getRecognized')}
                  </p>
                </div>
              </motion.div>

              {/* Decorative Star */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                className={cn(
                  'absolute top-8 text-gold-primary',
                  isRTL ? '-left-6' : '-right-6'
                )}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 40 40"
                  fill="currentColor"
                >
                  <path d="M20 0L24 16L40 20L24 24L20 40L16 24L0 20L16 16L20 0Z" />
                </svg>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </MaxWidthWrapper>

      {/* ========== LOGO LOOP ========== */}
      <div className="relative z-0 w-full py-6 mt-6">
        <MaxWidthWrapper>
          <LogoLoop
            logos={LOGOS}
            speed={100}
            direction={isRTL ? 'right' : 'left'}
            logoHeight={28}
            gap={60}
            className="grayscale opacity-60 hover:opacity-100 transition-all duration-500"
          />
        </MaxWidthWrapper>
      </div>
    </section>
  );
}

// --- Cloud Shape Component ---
function CloudShape({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 60" fill="currentColor">
      <ellipse cx="30" cy="40" rx="25" ry="18" />
      <ellipse cx="55" cy="35" rx="30" ry="22" />
      <ellipse cx="75" cy="42" rx="20" ry="15" />
    </svg>
  );
}
