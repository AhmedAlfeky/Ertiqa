'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';

type Option = { id: number; name: string };

type Props = {
  categories: Option[];
  levels: Option[];
  languages: { id: number; name: string }[];
  locale: string;
};

export function CoursesFilter({ categories, levels, languages, locale }: Props) {
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

  const t = (key: string, en: string) => (locale === 'ar' ? key : en);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 bg-card border rounded-xl p-4">
      <div className="space-y-2">
        <Label>{t('الفئة', 'Category')}</Label>
        <Select
          value={searchParams.get('category') || ''}
          onValueChange={(v) => setParam('category', v || null)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('اختر', 'Select')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{t('الكل', 'All')}</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>{t('المستوى', 'Level')}</Label>
        <Select
          value={searchParams.get('level') || ''}
          onValueChange={(v) => setParam('level', v || null)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('اختر', 'Select')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{t('الكل', 'All')}</SelectItem>
            {levels.map((lvl) => (
              <SelectItem key={lvl.id} value={String(lvl.id)}>
                {lvl.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>{t('اللغة', 'Language')}</Label>
        <Select
          value={searchParams.get('language') || ''}
          onValueChange={(v) => setParam('language', v || null)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('اختر', 'Select')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{t('الكل', 'All')}</SelectItem>
            {languages.map((lang) => (
              <SelectItem key={lang.id} value={String(lang.id)}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>{t('بحث', 'Search')}</Label>
        <Input
          placeholder={t('ابحث عن دورة', 'Search courses')}
          defaultValue={searchParams.get('search') || ''}
          onBlur={(e) => setParam('search', e.target.value || null)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setParam('search', (e.target as HTMLInputElement).value);
            }
          }}
        />
        <div className="flex items-center gap-2">
          <Switch
            checked={searchParams.get('isFree') === 'true'}
            onCheckedChange={(checked) => setParam('isFree', checked ? 'true' : null)}
            id="isFree"
          />
          <Label htmlFor="isFree">{t('مجاني فقط', 'Free only')}</Label>
        </div>
      </div>
    </div>
  );
}

