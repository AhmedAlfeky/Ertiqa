'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, X, ArrowRight, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Props = {
  locale: string;
  specializations: string[];
};

export function InstructorsFilter({ locale, specializations }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get('search') || ''
  );
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const t = (ar: string, en: string) => (locale === 'ar' ? ar : en);
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const currentSpecialization = searchParams.get('specialization') || 'all';
  const hasActiveFilters = searchValue || currentSpecialization !== 'all';

  const setParam = useCallback(
    (key: string, value?: string | null) => {
      const params = new URLSearchParams(searchParams);
      if (value && value.length > 0) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.set('page', '1');
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  const debouncedSearch = useCallback(
    (value: string) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      debounceTimeoutRef.current = setTimeout(() => {
        setParam('search', value || null);
      }, 500);
    },
    [setParam]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleReset = () => {
    setSearchValue('');
    setParam('search', null);
    setParam('specialization', null);
  };

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    };
  }, []);

  return (
    <div className="sticky top-4 z-40 w-full mb-10">
      <div className="max-w-4xl mx-auto">
        {/* Glass Container */}
        <div className="relative group bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-xl rounded-full p-2 transition-all duration-300 hover:shadow-2xl hover:border-gold-primary/30">
          <div className="flex flex-col md:flex-row items-center gap-2">
            {/* Search Input Section */}
            <div className="relative flex-1 w-full md:w-auto">
              <div
                className={`absolute top-1/2 -translate-y-1/2 ${
                  dir === 'rtl' ? 'right-4' : 'left-4'
                } text-slate-400 pointer-events-none`}
              >
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchValue}
                onChange={handleSearchChange}
                placeholder={t(
                  'ابحث عن مدرب بالاسم...',
                  'Search instructor by name...'
                )}
                className={`w-full h-12 bg-transparent text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none ${
                  dir === 'rtl'
                    ? 'pr-12 pl-4 text-right'
                    : 'pl-12 pr-4 text-left'
                }`}
                dir={dir}
              />
              {searchValue && (
                <button
                  onClick={() => {
                    setSearchValue('');
                    setParam('search', null);
                  }}
                  className={`absolute top-1/2 -translate-y-1/2 ${
                    dir === 'rtl' ? 'left-4' : 'right-4'
                  } text-slate-400 hover:text-red-500 transition-colors`}
                  aria-label={t('مسح البحث', 'Clear search')}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Divider (Desktop) */}
            <div className="hidden md:block w-px h-8 bg-slate-200 dark:bg-slate-700 mx-2" />

            {/* Filter Dropdown Section */}
            <div className="w-full md:w-[280px]">
              <Select
                value={currentSpecialization}
                onValueChange={val =>
                  setParam('specialization', val === 'all' ? null : val)
                }
                dir={dir}
              >
                <SelectTrigger className="w-full h-12 border-0 bg-slate-50 dark:bg-slate-800 rounded-full focus:ring-0 focus:ring-offset-0 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors px-4">
                  <div className="flex items-center gap-2 truncate">
                    <Filter className="w-4 h-4 text-gold-primary" />
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      {t('التخصص:', 'Specialty:')}
                    </span>
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100 dark:border-slate-800 shadow-xl">
                  <SelectItem
                    value="all"
                    className="font-semibold cursor-pointer py-3"
                  >
                    {t('جميع التخصصات', 'All Specializations')}
                  </SelectItem>
                  {specializations.map(spec => (
                    <SelectItem
                      key={spec}
                      value={spec}
                      className="cursor-pointer py-2"
                    >
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reset & Search Buttons */}
            <div className="hidden md:flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  onClick={handleReset}
                  className="h-12 px-4 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
                  aria-label={t('إعادة تعيين', 'Reset filters')}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t('إعادة تعيين', 'Reset')}</span>
                </button>
              )}
              <button
                className="h-12 w-12 bg-slate-900 dark:bg-white rounded-full flex items-center justify-center text-white dark:text-slate-900 shadow-lg hover:scale-105 transition-transform"
                aria-label={t('بحث', 'Search')}
              >
                <ArrowRight className="w-5 h-5 rtl:rotate-180" />
              </button>
            </div>
          </div>
        </div>

        {/* Popular Tags (Optional Polish) */}
        {specializations.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-2 animate-in fade-in slide-in-from-top-4 duration-500">
            <span className="text-xs font-semibold text-slate-400 py-1.5">
              {t('الأكثر بحثاً:', 'Popular:')}
            </span>
            {specializations.slice(0, 4).map(spec => (
              <button
                key={spec}
                onClick={() => setParam('specialization', spec)}
                className={cn(
                  'text-xs px-3 py-1.5 rounded-full border transition-all duration-200',
                  currentSpecialization === spec
                    ? 'bg-gold-primary/10 border-gold-primary text-gold-primary'
                    : 'bg-white/50 border-slate-200 text-slate-500 hover:border-gold-primary/50 hover:text-gold-primary'
                )}
                aria-label={t(`تصفية حسب ${spec}`, `Filter by ${spec}`)}
              >
                {spec}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
