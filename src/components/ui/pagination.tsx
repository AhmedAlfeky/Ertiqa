import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

import { cn } from '@/lib/utils';
import { ButtonProps, buttonVariants } from '@/components/ui/button';

type PaginationProps = React.ComponentProps<'nav'> & {
  dir?: 'ltr' | 'rtl';
};

const Pagination = ({ className, dir, ...props }: PaginationProps) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    dir={dir}
    {...props}
  />
);
Pagination.displayName = 'Pagination';

type PaginationContentProps = React.ComponentProps<'ul'> & {
  dir?: 'ltr' | 'rtl';
};

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  PaginationContentProps
>(({ className, dir, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    dir={dir}
    {...props}
  />
));
PaginationContent.displayName = 'PaginationContent';

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
));
PaginationItem.displayName = 'PaginationItem';

type PaginationLinkProps = {
  isActive?: boolean;
  dir?: 'ltr' | 'rtl';
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'a'>;

const PaginationLink = ({
  className,
  isActive,
  size = 'icon',
  dir,
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? 'outline' : 'ghost',
        size,
      }),
      className
    )}
    dir={dir}
    {...props}
  />
);
PaginationLink.displayName = 'PaginationLink';

type PaginationPreviousProps = React.ComponentProps<typeof PaginationLink> & {
  label?: string;
  dir?: 'ltr' | 'rtl';
};

const PaginationPrevious = ({
  className,
  label,
  dir,
  ...props
}: PaginationPreviousProps) => {
  // In RTL: Previous button should point right (→), in LTR: point left (←)
  const Icon = dir === 'rtl' ? ChevronRight : ChevronLeft;
  const displayLabel = label || 'Previous';
  
  return (
    <PaginationLink
      aria-label={label || 'Go to previous page'}
      size="default"
      className={cn('gap-1 pl-2.5', className)}
      dir={dir}
      {...props}
    >
      <Icon className="h-4 w-4" />
      <span>{displayLabel}</span>
    </PaginationLink>
  );
};
PaginationPrevious.displayName = 'PaginationPrevious';

type PaginationNextProps = React.ComponentProps<typeof PaginationLink> & {
  label?: string;
  dir?: 'ltr' | 'rtl';
};

const PaginationNext = ({
  className,
  label,
  dir,
  ...props
}: PaginationNextProps) => {
  // In RTL: Next button should point left (←), in LTR: point right (→)
  const Icon = dir === 'rtl' ? ChevronLeft : ChevronRight;
  const displayLabel = label || 'Next';
  
  return (
    <PaginationLink
      aria-label={label || 'Go to next page'}
      size="default"
      className={cn('gap-1 pr-2.5', className)}
      dir={dir}
      {...props}
    >
      <span>{displayLabel}</span>
      <Icon className="h-4 w-4" />
    </PaginationLink>
  );
};
PaginationNext.displayName = 'PaginationNext';

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = 'PaginationEllipsis';

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
