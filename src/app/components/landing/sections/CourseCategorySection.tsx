'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { H1 } from '@/components/ui/Typography';

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

// --- Mock Data (Men / Students Only) ---
const floatingImages = [
  {
    src: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=300&auto=format&fit=crop',
    alt: 'Male Developer',
    className:
      'top-[10%] start-[10%] md:top-[15%] md:start-[15%] w-24 h-24 md:w-32 md:h-32',
    delay: 0,
    duration: 5,
  },
  {
    src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=300&auto=format&fit=crop',
    alt: 'Male Students',
    className:
      'top-[20%] end-[10%] md:top-[25%] md:end-[15%] w-28 h-28 md:w-40 md:h-40',
    delay: 2,
    duration: 6,
  },
  {
    src: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&auto=format&fit=crop',
    alt: 'Business Man',
    className:
      'bottom-[20%] start-[5%] md:bottom-[25%] md:start-[10%] w-32 h-32 md:w-48 md:h-32 object-cover',
    delay: 1,
    duration: 7,
  },
  {
    src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
    alt: 'Creative Student',
    className:
      'bottom-[15%] end-[5%] md:bottom-[20%] md:end-[10%] w-24 h-32 md:w-32 md:h-48 object-cover',
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

  // Only animate if we have categories
  const categoriesData = categories.length > 0 ? categories : [];

  // --- Animation Logic: Cycle every 2 seconds ---
  useEffect(() => {
    if (categoriesData.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % categoriesData.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [categoriesData.length]);

  if (categoriesData.length === 0) {
    return null;
  }

  return (
    <section
      className="relative w-full min-h-screen bg-linear-to-br from-gold-primary/5 
    via-background to-yale-blue/5 dark:from-gold-primary/10 dark:via-slate-900 dark:to-yale-blue/10 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* --- Floating Images (Men/Students Only) --- */}
      <div className="absolute inset-0 pointer-events-none">
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
      <div className="z-10 flex flex-col items-center text-center max-w-4xl px-4 w-full">
        {/* Tagline */}
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gold-primary font-bold text-sm tracking-widest mb-4 uppercase bg-gold-primary/10 dark:bg-gold-primary/20 px-3 py-1 rounded-full border border-gold-primary/20 dark:border-gold-primary/30"
        >
          {t('subtitle')}
        </motion.span>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <H1 className="text-yale-blue dark:text-white whitespace-nowrap">
            {t('title')}
          </H1>
        </motion.div>

        {/* --- Infinite Moving Categories List --- */}
        <div className="relative h-[180px] w-full max-w-md flex justify-center perspective-1000">
          <AnimatePresence mode="popLayout">
            {categoriesData.map((cat, index) => {
              // Calculate relative position based on activeIndex
              const offset =
                (index - activeIndex + categoriesData.length) %
                categoriesData.length;

              // Only render items that are currently relevant to the animation window
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

          {/* Gradient Masks to blend top/bottom smoothly */}
          <div className="absolute top-0 start-0 end-0 h-4 bg-linear-to-b from-background dark:from-slate-900 to-transparent z-20 pointer-events-none" />
          <div className="absolute bottom-0 start-0 end-0 h-12 bg-linear-to-t from-background dark:from-slate-900 to-transparent z-20 pointer-events-none" />
        </div>

        {/* CTA Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-12 z-30"
        >
          <Link
            href={`/${locale}/courses`}
            className="bg-yale-blue dark:bg-yale-blue-light text-white font-medium text-lg py-4 px-10 rounded-full shadow-xl hover:bg-yale-blue-light dark:hover:bg-yale-blue transition-colors duration-300 flex items-center gap-3 group"
          >
            {t('btn')}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// --- Sub-Components ---

const FloatingImage = ({ src, alt, className, delay, duration }: any) => {
  return (
    <motion.div
      className={`absolute shadow-2xl rounded-2xl overflow-hidden border-[5px] border-background/80 dark:border-slate-800/80 ${className}`}
      initial={{ y: 0 }}
      animate={{
        y: [0, -25, 0],
        rotate: [0, 1.5, -1.5, 0],
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

// The List Item with specific states for Active, Next, and Exiting
const CategoryItem = ({ text, count, offset, isExiting }: any) => {
  // Define styles based on position in the "queue"
  let initial = {};
  let animate = {};
  let exit = {};
  const fontClass = '';
  let styleClass = '';

  if (offset === 0) {
    // ACTIVE STATE (Top, Highlighted)
    styleClass = `text-3xl md:text-5xl font-extrabold text-yale-blue dark:text-white z-10 opacity-100 whitespace-nowrap ${fontClass}`;
    animate = { y: 0, scale: 1, filter: 'blur(0px)', opacity: 1 };
    initial = { y: 60, scale: 0.9, filter: 'blur(2px)', opacity: 0.6 };
  } else if (offset === 1) {
    // NEXT STATE (Below Active, blurred)
    styleClass = `text-xl md:text-2xl font-semibold text-yale-blue/60 dark:text-white/60 z-0 whitespace-nowrap ${fontClass}`;
    animate = { y: 70, scale: 0.9, filter: 'blur(1px)', opacity: 0.6 };
    initial = { y: 120, scale: 0.8, filter: 'blur(4px)', opacity: 0 };
  } else if (offset === 2) {
    // WAITING STATE (Bottom, entering)
    styleClass = `text-lg md:text-xl font-semibold text-yale-blue/40 dark:text-white/40 z-0 whitespace-nowrap ${fontClass}`;
    animate = { y: 130, scale: 0.8, filter: 'blur(2px)', opacity: 0.3 };
    initial = { y: 180, opacity: 0 };
  } else if (isExiting) {
    // EXITING STATE (Flying Up)
    styleClass = `text-3xl md:text-5xl font-extrabold text-yale-blue dark:text-white absolute whitespace-nowrap ${fontClass}`;
    initial = { y: 0, opacity: 1 };
    animate = { y: -60, opacity: 0, filter: 'blur(4px)' };
  }

  return (
    <motion.div
      layout
      initial={initial}
      animate={animate}
      exit={exit}
      transition={{
        duration: 0.6,
        type: 'spring',
        stiffness: 100,
        damping: 20,
      }}
      className={`absolute w-full flex items-center justify-center gap-3 ${styleClass}`}
      style={{ top: 0 }}
    >
      <span>{text}</span>
      <span
        className={`text-base font-semibold px-2 py-0.5 rounded-md whitespace-nowrap ${
          offset === 0
            ? 'bg-gold-primary/20 dark:bg-gold-primary/30 text-gold-primary'
            : 'bg-transparent text-transparent'
        }`}
      >
        {count}+
      </span>
    </motion.div>
  );
};
