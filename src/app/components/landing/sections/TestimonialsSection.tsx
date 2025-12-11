'use client';

import { useTranslations } from 'next-intl';
import { Quote } from 'lucide-react';
import { SectionHeader } from '@/features/public/components/SectionHeader';
import { TestimonialCard } from '@/features/public/components/TestimonialCard';
import MaxWidthWrapper from '@/app/components/MaxwidthWrapper';

interface TestimonialsSectionProps {
  testimonials: any[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const t = useTranslations('landing.testimonials');

  if (testimonials.length === 0) return null;

  return (
    <section className="bg-linear-to-b from-alice-blue/30 dark:from-slate-800/30 to-background dark:to-slate-900 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 start-0 w-64 h-64 bg-gold-primary/5 dark:bg-gold-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 end-0 w-64 h-64 bg-yale-blue/5 dark:bg-yale-blue/10 rounded-full blur-3xl" />

      <MaxWidthWrapper className="relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-primary/10 text-gold-primary mb-4">
            <Quote className="h-8 w-8" />
          </div>
          <SectionHeader
            title={t('title')}
            subtitle={t('subtitle')}
          />
        </div>

        <div className="grid gap-8 mt-12 md:grid-cols-3">
          {testimonials.map((testimonial, idx) => (
            <div
              key={`${testimonial.id}-${testimonial.name || idx}`}
              className="transform transition-all duration-500 hover:scale-105"
            >
              <TestimonialCard
                testimonial={{
                  name: testimonial.name,
                  job_title: testimonial.job_title,
                  content: testimonial.content,
                  photo_url: testimonial.photo_url,
                }}
              />
            </div>
          ))}
        </div>
      </MaxWidthWrapper>
    </section>
  );
}

