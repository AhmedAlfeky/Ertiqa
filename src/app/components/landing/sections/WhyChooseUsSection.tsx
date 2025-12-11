'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import {
  GraduationCap,
  BookOpen,
  Award,
  CheckCircle2,
  Zap,
  Globe2,
  ArrowRight,
} from 'lucide-react';
import { SectionHeader } from '@/features/public/components/SectionHeader';
import MaxWidthWrapper from '@/app/components/MaxwidthWrapper';
import { H3, P } from '@/components/ui/Typography';
import { cn } from '@/lib/utils';

export function WhyChooseUsSection() {
  const t = useTranslations('landing.whyChooseUs');

  const exploreLabel = t('explore');
  const features = [
    {
      icon: GraduationCap,
      badgeIcon: CheckCircle2,
      badgeText: t('badges.expertVerified'),
      title: t('features.certifiedTrainers.title'),
      description: t('features.certifiedTrainers.description'),
      pattern: 'grid', // Visual pattern type
      color: 'blue',
    },
    {
      icon: BookOpen,
      badgeIcon: Zap,
      badgeText: t('badges.weeklyUpdates'),
      title: t('features.freshContent.title'),
      description: t('features.freshContent.description'),
      pattern: 'dots',
      color: 'purple',
    },
    {
      icon: Award,
      badgeIcon: Globe2,
      badgeText: t('badges.intlRecognized'),
      title: t('features.accreditedCertificates.title'),
      description: t('features.accreditedCertificates.description'),
      pattern: 'wave',
      color: 'amber',
    },
  ];

  return (
    <section className="relative py-10 bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <MaxWidthWrapper className="relative  z-10">
        <SectionHeader
          title={t('title')}
          subtitle={t('subtitle')}
          align="center"
          className="mb-10"
        />

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, idx) => (
            <SpotlightCard
              key={idx}
              feature={feature}
              index={idx}
              exploreLabel={exploreLabel}
            />
          ))}
        </div>
      </MaxWidthWrapper>
    </section>
  );
}

// --- Sub-Component: The Spotlight Card ---

function SpotlightCard({
  feature,
  index,
  exploreLabel,
}: {
  feature: any;
  index: number;
  exploreLabel: string;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const Icon = feature.icon;
  const BadgeIcon = feature.badgeIcon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onMouseMove={handleMouseMove}
      className="group relative border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden rounded-3xl"
    >
      {/* 1. Spotlight Effect Layer (The "Shine") */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(14, 165, 233, 0.15),
              transparent 80%
            )
          `,
        }}
      />

      {/* 2. Inner Content */}
      <div className="relative h-full flex flex-col p-8">
        {/* Header: Icon & Badge */}
        <div className="flex items-start justify-between mb-8">
          <div
            className={cn(
              'relative flex h-14 w-14 items-center justify-center rounded-2xl border transition-colors duration-300 shadow-sm',
              feature.color === 'blue' &&
                'bg-blue-50 border-blue-100 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white',
              feature.color === 'purple' &&
                'bg-purple-50 border-purple-100 text-purple-600 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-400 group-hover:bg-purple-600 group-hover:border-purple-600 group-hover:text-white',
              feature.color === 'amber' &&
                'bg-amber-50 border-amber-100 text-amber-600 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400 group-hover:bg-amber-600 group-hover:border-amber-600 group-hover:text-white'
            )}
          >
            <Icon className="h-7 w-7" />
          </div>

          {/* New "Visual Info" Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <BadgeIcon className="w-3.5 h-3.5" />
            {feature.badgeText}
          </div>
        </div>

        {/* Text Content */}
        <div className="relative z-10">
          <H3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
            {feature.title}
          </H3>

          <P className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
            {feature.description}
          </P>
        </div>

        {/* Footer: Learn More Link (Visual Only) */}
        <div className="mt-auto pt-4 flex items-center text-sm font-semibold text-slate-900 dark:text-white opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <span>{exploreLabel}</span>
          <ArrowRight className="ml-2 rtl:ml-0 rtl:mr-2 rtl:rotate-180 w-4 h-4" />
        </div>
      </div>

      {/* 3. Decorative Background Patterns */}
      <div className="absolute inset-0 z-0 opacity-20 dark:opacity-10 pointer-events-none transition-opacity duration-500 group-hover:opacity-10 dark:group-hover:opacity-5">
        {feature.pattern === 'grid' && (
          <svg
            className="absolute right-0 top-0 h-full w-full stroke-slate-900/10 dark:stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="grid-pattern"
                width="20"
                height="20"
                x="50%"
                y="-1"
                patternUnits="userSpaceOnUse"
              >
                <path d="M.5 200V.5H200" fill="none" />
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              strokeWidth="0"
              fill="url(#grid-pattern)"
            />
          </svg>
        )}
        {feature.pattern === 'dots' && (
          <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        )}
        {feature.pattern === 'wave' && (
          <svg
            className="absolute right-0 bottom-0 h-[120%] w-[120%] opacity-50"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M0 100 C 20 0 50 0 100 100 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-slate-900 dark:text-white"
            />
          </svg>
        )}
      </div>
    </motion.div>
  );
}
