'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
  locale: string;
};

export function InstructorsFilter({ locale }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = (key: string, value?: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (value && value.length > 0) params.set(key, value);
    else params.delete(key);
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const t = (ar: string, en: string) => (locale === 'ar' ? ar : en);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 bg-card border rounded-xl p-4">
      <div className="space-y-2 sm:col-span-2 lg:col-span-1">
        <Label>{t('بحث بالاسم', 'Search by name')}</Label>
        <Input
          placeholder={t('ابحث عن مدرب', 'Search instructor')}
          defaultValue={searchParams.get('search') || ''}
          onBlur={(e) => setParam('search', e.target.value || null)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setParam('search', (e.target as HTMLInputElement).value);
            }
          }}
        />
      </div>
      <div className="space-y-2 sm:col-span-2 lg:col-span-2">
        <Label>{t('التخصص', 'Specialization')}</Label>
        <Input
          placeholder={t('مثال: تطوير ذاتي', 'e.g., Personal Development')}
          defaultValue={searchParams.get('specialization') || ''}
          onBlur={(e) => setParam('specialization', e.target.value || null)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setParam('specialization', (e.target as HTMLInputElement).value);
            }
          }}
        />
      </div>
    </div>
  );
}

