'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { SectionHeader } from '@/features/public/components/SectionHeader';
import { CourseCard } from '@/features/public/components/CourseCard';
import { Button } from '@/components/ui/button';
import MaxWidthWrapper from '../../MaxwidthWrapper';
import { motion } from 'framer-motion';

interface FeaturedCoursesSectionProps {
  courses: any[];
  locale: string;
}

export function FeaturedCoursesSection({
  courses,
  locale,
}: FeaturedCoursesSectionProps) {
  const t = useTranslations('landing.featuredCourses');
  const currentLocale = useLocale();
  const isRTL = currentLocale === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  if (courses.length === 0) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <section className="relative bg-linear-to-b from-background dark:from-slate-900 via-gold-primary/5 dark:via-gold-primary/10 to-alice-blue/30 dark:to-slate-800/30 overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div className="absolute top-0 start-0 w-96 h-96 bg-gold-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 end-0 w-96 h-96 bg-yale-blue/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <MaxWidthWrapper className="relative z-10">
        <div className="flex items-center justify-between mb-12">
          <SectionHeader
            title={t('title')}
            subtitle={t('subtitle')}
            align="center"
          />
          <Button
            asChild
            variant="ghost"
            className="text-yale-blue hover:text-gold-primary group"
          >
            <Link href={`/${locale}/courses`} className="flex items-center">
              {t('viewAll')}
              <ArrowIcon
                className={`h-4 w-4 transition-transform ${
                  isRTL
                    ? 'me-2 group-hover:-translate-x-1'
                    : 'ms-2 group-hover:translate-x-1'
                }`}
              />
            </Link>
          </Button>
        </div>

        <motion.div
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              variants={itemVariants}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              <CourseCard course={course} locale={locale} />
            </motion.div>
          ))}
        </motion.div>
      </MaxWidthWrapper>
    </section>
  );
}
