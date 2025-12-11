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

type Props = {
  page: number;
  totalPages: number;
};

export function PaginationWrapper({ page, totalPages }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const goToPage = (target: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', target.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => goToPage(Math.max(1, page - 1))}
            aria-disabled={page === 1}
            tabIndex={page === 1 ? -1 : 0}
          />
        </PaginationItem>

        {[...Array(totalPages)].map((_, idx) => {
          const p = idx + 1;
          return (
            <PaginationItem key={p}>
              <PaginationLink isActive={p === page} onClick={() => goToPage(p)}>
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
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

