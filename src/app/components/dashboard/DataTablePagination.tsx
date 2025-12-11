'use client';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from 'next-intl';

interface DataTablePaginationProps {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function DataTablePagination({ total, page, limit, totalPages }: DataTablePaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations('pagination');
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const updateLimit = (newLimit: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", newLimit.toString());
    params.set("page", "1"); // Reset to first page when changing limit
    router.push(`?${params.toString()}`);
  };

  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  return (
    <div className="w-full flex items-center justify-between px-2 py-4" dir={dir}>
      <div className="text-muted-foreground flex-1 text-sm">
        {t('showing', { 
          from: (page - 1) * limit + 1, 
          to: Math.min(page * limit, total), 
          total 
        })}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">{t('rowsPerPage')}</p>
          <Select value={`${limit}`} onValueChange={(value: string) => updateLimit(Number(value))} dir={dir}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={limit} />
            </SelectTrigger>
            <SelectContent side="top" dir={dir}>
              {[10, 20, 25, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          {t('pageOf', { page, totalPages })}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => updatePage(1)}
            disabled={!canGoPrevious}
          >
            <span className="sr-only">{t('goToFirstPage')}</span>
            <ChevronsLeft className="h-4 w-4 rtl:rotate-180" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => updatePage(page - 1)}
            disabled={!canGoPrevious}
          >
            <span className="sr-only">{t('goToPreviousPage')}</span>
            <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => updatePage(page + 1)}
            disabled={!canGoNext}
          >
            <span className="sr-only">{t('goToNextPage')}</span>
            <ChevronRight className="h-4 w-4 rtl:rotate-180" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => updatePage(totalPages)}
            disabled={!canGoNext}
          >
            <span className="sr-only">{t('goToLastPage')}</span>
            <ChevronsRight className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
}
