'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MaxWidthWrapper from '@/app/components/MaxwidthWrapper';
import { H2, Lead } from '@/components/ui/Typography';
import { cn } from '@/lib/utils';

interface CTASectionProps {
  locale: string;
}

export function CTASection({ locale }: CTASectionProps) {
  const t = useTranslations('landing.cta');

  return (
    <section className="relative  overflow-hidden">
      <MaxWidthWrapper>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative isolate overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-2xl"
        >
          {/* --- 1. Dynamic Background Layers --- */}

          {/* Base Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#1e3a8a] to-slate-900" />

          {/* Animated Aurora / Mesh Gradient */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-0 -left-1/4 w-full h-full bg-gradient-to-r from-emerald-500/30 to-blue-500/30 blur-[100px] rounded-full mix-blend-screen animate-pulse-slow" />
            <div className="absolute bottom-0 -right-1/4 w-full h-full bg-gradient-to-l from-purple-500/30 to-indigo-500/30 blur-[100px] rounded-full mix-blend-screen animate-pulse-slow delay-1000" />
          </div>

          {/* Grid Pattern Overlay */}
          <svg
            className="absolute inset-0 -z-10 h-full w-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="cta-grid"
                width={40}
                height={40}
                x="50%"
                y={-1}
                patternUnits="userSpaceOnUse"
              >
                <path d="M.5 200V.5H200" fill="none" />
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              strokeWidth={0}
              fill="url(#cta-grid)"
            />
          </svg>

          {/* Grain Texture (Adds high-quality feel) */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150 pointer-events-none" />

          {/* --- 2. Floating Decor Elements --- */}
          <FloatingOrb className="top-12 left-12 bg-blue-400/20" delay={0} />
          <FloatingOrb
            className="bottom-12 right-12 bg-emerald-400/20"
            delay={2}
          />

          {/* --- 3. Content --- */}
          <div className="relative z-10 px-6 py-24 sm:px-12 sm:py-32 lg:px-16 text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white ring-1 ring-inset ring-white/20 backdrop-blur-md mb-8"
            >
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <span>{t('badge')}</span>
            </motion.div>

            {/* Title */}
            <H2 className="mx-auto max-w-2xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl mb-6 border-none">
              {t('title')}
            </H2>

            {/* Description */}
            <Lead className="mx-auto max-w-xl text-lg text-blue-100/80 mb-10 leading-relaxed">
              {t('description')}
            </Lead>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              {/* Primary Button with "Shimmer" Effect */}
              <Button
                asChild
                size="lg"
                className="relative h-14 px-8 text-lg font-semibold bg-white text-slate-900 hover:bg-slate-100 hover:scale-105 transition-all duration-300 rounded-full shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] overflow-hidden group"
              >
                <Link href={`/${locale}/signup`}>
                  <span className="relative z-10 flex items-center gap-2">
                    {t('signup')}
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" />
                  </span>
                  {/* Shimmer Overlay */}
                  <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent z-0" />
                </Link>
              </Button>

              {/* Secondary Button */}
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 px-8 text-lg font-semibold text-white border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 backdrop-blur-sm rounded-full transition-all duration-300"
              >
                <Link href={`/${locale}/courses`}>{t('browse')}</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </MaxWidthWrapper>
    </section>
  );
}

// --- Sub-Component: Floating Orb Decor ---
const FloatingOrb = ({
  className,
  delay,
}: {
  className?: string;
  delay: number;
}) => (
  <motion.div
    className={cn(
      'absolute w-64 h-64 rounded-full blur-3xl pointer-events-none mix-blend-screen',
      className
    )}
    animate={{
      y: [0, -30, 0],
      scale: [1, 1.1, 1],
      opacity: [0.3, 0.6, 0.3],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      ease: 'easeInOut',
      delay: delay,
    }}
  />
);
