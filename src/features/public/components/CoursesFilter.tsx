'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

type Option = { id: number; name: string };

type Props = {
  categories: Option[];
  levels: Option[];
  languages: { id: number; name: string }[];
  locale: string;
};

export function CoursesFilter({
  categories,
  levels,
  languages,
  locale,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isRTL = locale === 'ar';

  const t = (ar: string, en: string) => (locale === 'ar' ? ar : en);

  const setParam = (key: string, value?: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (value && value.length > 0) params.set(key, value);
    else params.delete(key);
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="sticky top-4 z-40 w-full mb-10">
      <div className="max-w-6xl mx-auto">
        {/* Glass Container */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl p-3 md:p-4 transition-all hover:shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* 1. Search Bar (Spans 4 cols) */}
            <div className="md:col-span-4 relative group">
              <div
                className={cn(
                  'absolute top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yale-blue transition-colors',
                  isRTL ? 'right-3' : 'left-3'
                )}
              >
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder={t('ابحث عن ما تريد تعلمه...', 'Search courses...')}
                defaultValue={searchParams.get('search') || ''}
                onBlur={e => setParam('search', e.target.value || null)}
                onKeyDown={e =>
                  e.key === 'Enter' &&
                  setParam('search', (e.target as HTMLInputElement).value)
                }
                className={cn(
                  'w-full h-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yale-blue/20 transition-all',
                  isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'
                )}
              />
            </div>

            {/* Divider (Desktop) */}
            <div className="hidden md:block md:col-span-1 flex justify-center">
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-800" />
            </div>

            {/* 2. Filters Group (Spans 7 cols) */}
            <div className="md:col-span-7 flex flex-wrap md:flex-nowrap gap-2 items-center">
              {/* Category */}
              <SelectWrapper
                value={searchParams.get('category')}
                onChange={v => setParam('category', v)}
                placeholder={t('الفئة', 'Category')}
                options={categories}
                locale={locale}
              />

              {/* Level */}
              <SelectWrapper
                value={searchParams.get('level')}
                onChange={v => setParam('level', v)}
                placeholder={t('المستوى', 'Level')}
                options={levels}
                locale={locale}
              />

              {/* Language */}
              <SelectWrapper
                value={searchParams.get('language')}
                onChange={v => setParam('language', v)}
                placeholder={t('اللغة', 'Language')}
                options={languages}
                locale={locale}
              />

              {/* Free Only Toggle */}
              <div
                className="ml-auto flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-green-500/50 transition-colors"
                onClick={() =>
                  setParam(
                    'isFree',
                    searchParams.get('isFree') === 'true' ? null : 'true'
                  )
                }
              >
                <div
                  className={cn(
                    'w-4 h-4 rounded border flex items-center justify-center transition-colors',
                    searchParams.get('isFree') === 'true'
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-slate-300'
                  )}
                >
                  {searchParams.get('isFree') === 'true' && (
                    <Check className="w-3 h-3" />
                  )}
                </div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 select-none">
                  {t('مجاني فقط', 'Free Only')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Component for consistent Selects
function SelectWrapper({ value, onChange, placeholder, options, locale }: any) {
  const isRTL = locale === 'ar';
  return (
    <Select
      value={value || 'all'}
      onValueChange={v => onChange(v === 'all' ? null : v)}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <SelectTrigger className="h-10 min-w-[110px] bg-transparent border-0 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg focus:ring-0 text-slate-600 dark:text-slate-300 text-xs font-medium">
        <div className="flex items-center gap-2">
          <span>
            {value
              ? options.find((o: any) => String(o.id) === value)?.name
              : placeholder}
          </span>
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{isRTL ? 'الكل' : 'All'}</SelectItem>
        {options.map((opt: any) => (
          <SelectItem key={opt.id} value={String(opt.id)}>
            {opt.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
