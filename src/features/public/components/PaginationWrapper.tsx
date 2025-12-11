'use client';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

type Props = {
  page: number;
  totalPages: number;
};

export function PaginationWrapper({ page, totalPages }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations('pagination');
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  const goToPage = (target: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', target.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-8" dir={dir}>
      <PaginationContent dir={dir}>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => goToPage(Math.max(1, page - 1))}
            aria-disabled={page === 1}
            tabIndex={page === 1 ? -1 : 0}
            label={t('previous')}
            dir={dir}
            size="default"
          />
        </PaginationItem>

        {[...Array(totalPages)].map((_, idx) => {
          const p = idx + 1;
          return (
            <PaginationItem key={p}>
              <PaginationLink
                isActive={p === page}
                onClick={() => goToPage(p)}
                size="icon"
                dir={dir}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            onClick={() => goToPage(Math.min(totalPages, page + 1))}
            aria-disabled={page === totalPages}
            tabIndex={page === totalPages ? -1 : 0}
            label={t('next')}
            dir={dir}
            size="default"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
