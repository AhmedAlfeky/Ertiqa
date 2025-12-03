import { redirect } from 'next/navigation';
import {
  getCourseById,
  getCurrentInstructorId,
  getLookupData,
} from '@/features/instructor/queries';
import { getCourseUnits } from '@/features/instructor/curriculum-queries';
import { CourseManageClient } from '@/app/components/instructor/CourseManageClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CourseManagePage({
  params,
}: {
  params: Promise<{ courseId: string; locale: string }>;
}) {
  const { courseId, locale } = await params;

  const instructorId = await getCurrentInstructorId();
  if (!instructorId) {
    redirect(`/${locale}/instructor/login`);
  }

  const courseIdNum = parseInt(courseId);
  const course = await getCourseById(courseIdNum);

  if (!course) {
    redirect(`/${locale}/instructor/courses`);
  }

  if (course.instructor_id !== instructorId) {
    redirect(`/${locale}/instructor/courses`);
  }

  const units = await getCourseUnits(courseIdNum);
  const { levels, languages, categories } = await getLookupData(locale);

  return (
    <CourseManageClient
      course={course}
      locale={locale}
      initialUnits={units}
      levels={levels}
      languages={languages}
      categories={categories}
    />
  );
}
