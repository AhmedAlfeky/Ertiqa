'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowRight, ArrowLeft, Star, MapPin } from 'lucide-react';

// Swiper Imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { SectionHeader } from '@/features/public/components/SectionHeader';
import { Button } from '@/components/ui/button';
import MaxWidthWrapper from '@/app/components/MaxwidthWrapper';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface InstructorsSectionProps {
  instructors: any[];
  locale: string;
}

export function InstructorsSection({
  instructors,
  locale,
}: InstructorsSectionProps) {
  const t = useTranslations('landing.instructors');
  const currentLocale = useLocale();
  const isRTL = currentLocale === 'ar';

  // Ref to control Swiper instances for custom buttons
  const swiperRef = useRef<SwiperType>(null);

  if (!instructors || instructors.length === 0) return null;

  return (
    <section className="relative  bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* --- Background Decor --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-linear-to-b from-white to-transparent dark:from-slate-900 dark:to-transparent opacity-80" />
        {/* Abstract Blob */}
        <div className="absolute right-0 top-20 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-soft-light" />
        <div className="absolute left-0 bottom-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-soft-light" />
      </div>

      <MaxWidthWrapper className="relative z-10">
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row items-end md:items-center justify-between mb-12 gap-6">
          <SectionHeader
            title={t('title')}
            subtitle={t('subtitle')}
            className="mb-0"
            align="left"
          />

          {/* Custom Navigation Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <NavButton
              onClick={() => swiperRef.current?.slidePrev()}
              icon={isRTL ? ArrowRight : ArrowLeft}
              label="Previous"
            />
            <NavButton
              onClick={() => swiperRef.current?.slideNext()}
              icon={isRTL ? ArrowLeft : ArrowRight}
              isActive
              label="Next"
            />
          </div>
        </div>

        {/* --- Swiper Carousel --- */}
        <div className="relative px-4 md:px-0 -mx-4 md:mx-0">
          <Swiper
            modules={[Navigation, Autoplay, Pagination]}
            onBeforeInit={swiper => {
              swiperRef.current = swiper;
            }}
            spaceBetween={24}
            slidesPerView={1}
            dir={isRTL ? 'rtl' : 'ltr'}
            key={isRTL ? 'rtl' : 'ltr'} // Force re-render on language change
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="pb-12 overflow-visible" // Allow shadows to breathe
          >
            {instructors.map((instructor, index) => (
              <SwiperSlide key={instructor.id || index} className="h-auto">
                <ModernInstructorCard instructor={instructor} locale={locale} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* --- Mobile View All Button --- */}
        <div className="mt-8 flex justify-center md:hidden">
          <Button
            asChild
            variant="outline"
            className="w-full border-yellow-400 text-yellow-600 dark:text-yellow-400"
          >
            <Link href={`/${locale}/instructors`}>{t('viewAll')}</Link>
          </Button>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}

// --- Sub-Component: Custom Nav Button ---
const NavButton = ({ onClick, icon: Icon, isActive, label }: any) => (
  <button
    onClick={onClick}
    aria-label={label}
    className={cn(
      'flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 shadow-sm',
      isActive
        ? 'bg-yellow-400 text-slate-900 shadow-yellow-400/25 hover:bg-yellow-500 hover:scale-105'
        : 'bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:border-yellow-400'
    )}
  >
    <Icon className="w-5 h-5" />
  </button>
);

// --- Sub-Component: Modern Card (Matches Reference Image) ---
const ModernInstructorCard = ({
  instructor,
  locale,
}: {
  instructor: {
    id: string;
    full_name?: string | null;
    avatar_url?: string | null;
    specialization?: string | null;
    instructor_verified?: boolean | null;
    location?: string | null;
  };
  locale: string;
}) => {
  const name =
    instructor.full_name ||
    (locale === 'ar' ? 'مدرب غير مسمى' : 'Unnamed Instructor');
  const subject =
    instructor.specialization || (locale === 'ar' ? 'مدرب' : 'Instructor');
  const rating = 4.9;
  const location =
    instructor.location || (locale === 'ar' ? 'عن بعد' : 'Online');

  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Link
      href={`/${locale}/instructors/${instructor.id}`}
      className="group relative flex flex-col items-center bg-white dark:bg-slate-900 rounded-4xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl hover:shadow-yellow-500/10 hover:-translate-y-2 transition-all duration-300 h-full"
    >
      {/* 1. Circular Image Wrapper with Gradient Border */}
      <div className="relative mb-4">
        <div className="absolute inset-0 bg-linear-to-tr from-yellow-400 to-orange-400 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity" />
        <Avatar className="relative w-32 h-32 p-1 bg-white dark:bg-slate-900 rounded-full ring-1 ring-slate-100 dark:ring-slate-800">
          <AvatarImage
            src={instructor.avatar_url || ''}
            alt={name}
            className="grayscale-20 group-hover:grayscale-0 transition-all duration-500 object-cover"
          />
          <AvatarFallback className="text-lg font-semibold bg-yellow-100 text-yellow-800 dark:bg-slate-800 dark:text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        {/* Verified Badge */}
        <div className="absolute bottom-1 right-1 bg-blue-500 text-white p-1.5 rounded-full border-4 border-white dark:border-slate-900">
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      {/* 2. Content */}
      <div className="text-center w-full space-y-2">
        {/* Rating */}
        <div className="flex items-center justify-center gap-1 text-sm font-bold text-slate-900 dark:text-white">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span>{rating}</span>
          <span className="text-slate-400 font-normal">/ 5.0</span>
        </div>

        {/* Name */}
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
          {name}
        </h3>

        {/* Metadata (Location/School) */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
          <MapPin className="w-3 h-3" />
          {location}
        </div>

        {/* Subject Badge (Pill) */}
        <span className="inline-block px-4 py-1.5 rounded-full bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-sm font-semibold border border-yellow-100 dark:border-yellow-800/50">
          {subject}
        </span>
      </div>

      {/* 3. Hover CTA (Optional) */}
      <div className="w-full mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <div className="w-full py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center gap-2">
          {locale === 'ar' ? 'عرض الملف الشخصي' : 'View Profile'}{' '}
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </div>
      </div>
    </Link>
  );
};
