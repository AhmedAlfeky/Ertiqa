import {
  getFeaturedCourses,
  getFeaturedInstructors,
  getTestimonials,
  getCategoriesWithCounts,
} from '@/features/public/queries';
import { HeroSection } from '@/app/components/landing/sections/HeroSection';
import { WhyChooseUsSection } from '@/app/components/landing/sections/WhyChooseUsSection';
import { FeaturedCoursesSection } from '@/app/components/landing/sections/FeaturedCoursesSection';
import { InstructorsSection } from '@/app/components/landing/sections/InstructorsSection';
import { TestimonialsSection } from '@/app/components/landing/sections/TestimonialsSection';
import { CTASection } from '@/app/components/landing/sections/CTASection';
import CourseCategorySection from '../../components/landing/sections/CourseCategorySection';

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const [courses, instructors, testimonials, categories] = await Promise.all([
    getFeaturedCourses(locale, 6),
    getFeaturedInstructors(4),
    getTestimonials(6),
    getCategoriesWithCounts(locale),
  ]);
  console.log(categories);
  return (
    <div className="space-y-0">
      <HeroSection locale={locale} />
      <WhyChooseUsSection />
      <CourseCategorySection categories={categories} locale={locale} />
      <FeaturedCoursesSection courses={courses} locale={locale} />
      <InstructorsSection instructors={instructors} locale={locale} />
      <TestimonialsSection testimonials={testimonials} />
      <CTASection locale={locale} />
    </div>
  );
}
