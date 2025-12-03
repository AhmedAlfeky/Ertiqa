import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Video,
  FileQuestion,
} from 'lucide-react';
import {
  getCourseById,
  getCurrentInstructorId,
} from '@/features/instructor/queries';
import { getUnitById } from '@/features/instructor/curriculum-queries';
import { createClient } from '@/lib/supabase/server';
import { getTranslations } from 'next-intl/server';
import { UnitManageClient } from '@/app/components/instructor/UnitManageClient';

export const dynamic = 'force-dynamic';

export default async function UnitManagePage({
  params,
}: {
  params: Promise<{ courseId: string; unitId: string; locale: string }>;
}) {
  const { courseId, unitId, locale } = await params;
  const t = await getTranslations('instructor');
  const instructorId = await getCurrentInstructorId();

  if (!instructorId) {
    redirect(`/${locale}/login`);
  }

  const courseIdNum = parseInt(courseId);
  const unitIdNum = parseInt(unitId);

  const course = await getCourseById(courseIdNum);

  if (!course || course.instructor_id !== instructorId) {
    redirect(`/${locale}/instructor/courses`);
  }

  // Verify unit exists and belongs to course
  const supabase = await createClient();

  const { data: unitData, error: unitError } = await supabase
    .from('course_units')
    .select('id, course_id')
    .eq('id', unitIdNum)
    .single();

  if (unitError || !unitData) {
    console.error('❌ Unit not found:', unitError);
    notFound();
  }

  if (unitData.course_id !== courseIdNum) {
    console.error('❌ Unit does not belong to course');
    notFound();
  }

  // Fetch unit with its lessons
  const unit = await getUnitById(unitIdNum);

  if (!unit) {
    console.error('❌ Unit data not found');
    notFound();
  }

  return (
    <div className="py-8">
      <UnitManageClient courseId={courseIdNum} unit={unit} locale={locale} />
    </div>
  );
}
