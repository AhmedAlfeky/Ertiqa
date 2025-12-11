import { InstructorCard } from '@/features/public/components/InstructorCard';
import { InstructorsFilter } from '@/features/public/components/InstructorsFilter';
import { PaginationWrapper } from '@/features/public/components/PaginationWrapper';
import { SectionHeader } from '@/features/public/components/SectionHeader';
import { getPublicInstructors } from '@/features/public/queries';

export const revalidate = 0;

export default async function InstructorsPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const locale = params.locale;
  const page = Number(searchParams.page) || 1;
  const pageSize = 12;

  const instructors = await getPublicInstructors({
    page,
    pageSize,
    search: stringParam(searchParams.search),
    specialization: stringParam(searchParams.specialization),
  });

  const t = (ar: string, en: string) => (locale === 'ar' ? ar : en);

  return (
    <div className="container mx-auto px-6 py-10 space-y-8">
      <SectionHeader
        title={t('المدربون', 'Instructors')}
        subtitle={t('ابحث عن المدربين وتخصصاتهم.', 'Search instructors and their specializations.')}
        align="left"
      />

      <InstructorsFilter locale={locale} />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {instructors.items.map((ins) => (
          <InstructorCard key={ins.id} instructor={ins} locale={locale} />
        ))}
      </div>

      <PaginationWrapper page={instructors.page} totalPages={instructors.totalPages} />
    </div>
  );
}

function stringParam(value?: string | string[]) {
  if (Array.isArray(value)) return value[0];
  return value;
}

