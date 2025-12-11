'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Play, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { H1 } from '@/components/ui/Typography';
import { cn } from '@/lib/utils'; // Assuming you have this utility

// --- Types & Interfaces ---
interface Category {
  id: string;
  slug: string;
  name: string;
  count: number;
}

interface CourseCategorySectionProps {
  categories: Category[];
  locale: string;
}

// --- Mock Data ---
const floatingImages = [
  {
    src: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=300&auto=format&fit=crop',
    alt: 'Male Developer',
    // Adjusted positions to frame the center text better
    className:
      'top-[12%] left-[8%] md:top-[15%] md:left-[20%] w-20 h-20 md:w-28 md:h-28 rotate-[-6deg]',
    delay: 0,
    duration: 5,
  },
  {
    src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=300&auto=format&fit=crop',
    alt: 'Male Students',
    className:
      'top-[15%] right-[8%] md:top-[20%] md:right-[20%] w-24 h-24 md:w-32 md:h-32 rotate-[6deg]',
    delay: 2,
    duration: 6,
  },
  {
    src: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&auto=format&fit=crop',
    alt: 'Business Man',
    className:
      'bottom-[18%] left-[8%] md:bottom-[25%] md:left-[22%] w-28 h-28 md:w-36 md:h-36 rotate-[3deg]',
    delay: 1,
    duration: 7,
  },
  {
    src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
    alt: 'Creative Student',
    className:
      'bottom-[12%] right-[8%] md:bottom-[20%] md:right-[22%] w-20 h-24 md:w-28 md:h-36 rotate-[-3deg]',
    delay: 3,
    duration: 5.5,
  },
];

export default function CourseCategorySection({
  categories,
  locale,
}: CourseCategorySectionProps) {
  const t = useTranslations('landing.courseCategories');
  const currentLocale = useLocale();
  const isRTL = currentLocale === 'ar';
  const [activeIndex, setActiveIndex] = useState(0);

  const categoriesData = categories.length > 0 ? categories : [];

  // --- Animation Logic ---
  useEffect(() => {
    if (categoriesData.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % categoriesData.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [categoriesData.length]);

  if (categoriesData.length === 0) return null;

  return (
    <section className="relative w-full min-h-[90vh] bg-[#FDFBF7] dark:bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
      {/* --- Background Doodles (The "Cool" Factor) --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top Left Squiggle */}
        <DoodleSquiggle className="absolute top-20 left-10 w-24 h-24 text-gold-primary/40 rotate-12" />

        {/* Top Right Circle/Loop */}
        <DoodleLoop className="absolute top-32 right-10 w-20 h-20 text-yale-blue/20 dark:text-white/10" />

        {/* Bottom Left Arrow pointing to center */}
        <DoodleArrow className="absolute bottom-32 left-20 w-32 h-32 text-gold-primary/30 rotate-[-15deg]" />

        {/* Bottom Right Star */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-20 right-20 text-yale-blue/10 dark:text-white/5"
        >
          <Sparkles className="w-16 h-16 fill-current" />
        </motion.div>
      </div>

      {/* --- Floating Images --- */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {floatingImages.map((img, index) => (
          <FloatingImage
            key={index}
            src={img.src}
            alt={img.alt}
            className={img.className}
            delay={img.delay}
            duration={img.duration}
          />
        ))}
      </div>

      {/* --- Main Content --- */}
      <div className="z-20 flex flex-col items-center text-center max-w-4xl px-4 w-full">
        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-primary/15 dark:bg-gold-primary/10 text-gold-primary text-sm font-extrabold tracking-wide uppercase border border-gold-primary/30 dark:border-gold-primary/25 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 fill-gold-primary" />
            {t('subtitle')}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 relative mt-4"
        >
          <H1 className="text-5xl md:text-7xl font-black text-yale-blue dark:text-white tracking-tight leading-none mb-2">
            {t('title')}
          </H1>
          {/* Decorative Underline SVG */}
          <svg
            className="w-48 h-4 mx-auto text-gold-primary"
            viewBox="0 0 100 10"
            preserveAspectRatio="none"
          >
            <path
              d="M0 5 Q 50 10 100 5"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
            />
          </svg>
        </motion.div>

        {/* --- Infinite Moving Categories List --- */}
        <div className="relative h-[160px] w-full max-w-lg flex justify-center perspective-1000 mb-12 mt-6">
          <AnimatePresence mode="popLayout">
            {categoriesData.map((cat, index) => {
              const offset =
                (index - activeIndex + categoriesData.length) %
                categoriesData.length;
              if (offset > 2 && offset !== categoriesData.length - 1)
                return null;

              return (
                <CategoryItem
                  key={cat.id}
                  text={cat.name}
                  count={cat.count}
                  offset={offset}
                  isExiting={offset === categoriesData.length - 1}
                />
              );
            })}
          </AnimatePresence>

          {/* Soft Gradient Masks */}
          <div className="absolute top-0 inset-x-0 h-8 bg-gradient-to-b from-[#f8f8f8] dark:from-slate-950 to-transparent z-30 pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-[#f8f8f8] dark:from-slate-950 to-transparent z-30 pointer-events-none" />
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center gap-4 z-30"
        >
          <Link
            href={`/${locale}/courses`}
            className="h-14 px-10 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg shadow-xl shadow-slate-900/20 hover:scale-105 hover:bg-slate-800 transition-all duration-300 flex items-center gap-3"
          >
            {t('btn')}
            <ArrowRight className={cn('w-5 h-5', isRTL && 'rotate-180')} />
          </Link>

          <button className="h-14 px-8 rounded-full bg-gold-primary text-yale-blue font-bold text-lg border border-transparent shadow-sm hover:bg-gold-light transition-all flex items-center gap-3 group dark:bg-gold-primary dark:text-yale-blue dark:hover:bg-gold-light">
            <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-3.5 h-3.5 fill-yale-blue text-yale-blue ml-0.5" />
            </div>
            <span>
              {t('watchVideo') || t('ctaSecondary') || 'شاهد الفيديو'}
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}

// --- Sub-Components ---

const FloatingImage = ({ src, alt, className, delay, duration }: any) => {
  return (
    <motion.div
      className={cn(
        'absolute rounded-2xl overflow-hidden bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-[4px] border-white dark:border-slate-800',
        className
      )}
      initial={{ y: 0 }}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 2, -2, 0], // Gentle sway
      }}
      transition={{
        repeat: Infinity,
        duration: duration,
        ease: 'easeInOut',
        delay: delay,
      }}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </motion.div>
  );
};

const CategoryItem = ({ text, count, offset, isExiting }: any) => {
  let initial = {};
  let animate = {};
  let styleClass = '';

  if (offset === 0) {
    // ACTIVE: Big, Dark, Clear
    styleClass =
      'text-4xl md:text-5xl font-black text-slate-900 dark:text-white z-20 opacity-100 scale-100 blur-0';
    animate = { y: 0, scale: 1, filter: 'blur(0px)', opacity: 1 };
    initial = { y: 50, scale: 0.9, filter: 'blur(2px)', opacity: 0.5 };
  } else if (offset === 1) {
    // NEXT: Smaller, Lighter, Blurred
    styleClass =
      'text-2xl md:text-3xl font-bold text-slate-400 dark:text-slate-500 z-10 blur-[1px]';
    animate = { y: 60, scale: 0.9, filter: 'blur(1px)', opacity: 0.6 };
    initial = { y: 100, scale: 0.8, opacity: 0 };
  } else if (offset === 2) {
    // WAITING: Very small
    styleClass =
      'text-xl font-bold text-slate-300 dark:text-slate-600 z-0 blur-[2px]';
    animate = { y: 110, scale: 0.8, filter: 'blur(2px)', opacity: 0.3 };
    initial = { y: 150, opacity: 0 };
  } else if (isExiting) {
    // EXITING: Fly up and vanish
    styleClass = 'text-4xl md:text-5xl font-black text-slate-900 absolute';
    initial = { y: 0, opacity: 1 };
    animate = { y: -60, opacity: 0, filter: 'blur(4px)' };
  }

  return (
    <motion.div
      layout
      initial={initial}
      animate={animate}
      transition={{
        duration: 0.5,
        type: 'spring',
        stiffness: 100,
        damping: 20,
      }}
      className={`absolute w-full flex items-center justify-center gap-3 whitespace-nowrap ${styleClass}`}
      style={{ top: 0 }}
    >
      <span>{text}</span>
      <span
        className={cn(
          'text-sm font-extrabold px-2 py-0.5 rounded-md',
          offset === 0
            ? 'bg-gold-primary text-white shadow-lg shadow-gold-primary/30 rotate-3'
            : 'hidden'
        )}
      >
        {count}+
      </span>
    </motion.div>
  );
};

// --- Doodle Components (SVGs) ---

const DoodleSquiggle = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    stroke="currentColor"
    strokeWidth="8"
    strokeLinecap="round"
  >
    <path d="M10,50 Q30,10 50,50 T90,50" />
  </svg>
);

const DoodleLoop = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    stroke="currentColor"
    strokeWidth="6"
    strokeLinecap="round"
  >
    <path d="M20,40 C20,10 80,10 80,40 C80,70 20,70 20,40 Z" />
  </svg>
);

const DoodleArrow = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    stroke="currentColor"
    strokeWidth="4"
    strokeLinecap="round"
  >
    <path d="M10,90 Q50,90 80,20" />
    <path d="M60,20 L80,20 L80,40" />
  </svg>
);
