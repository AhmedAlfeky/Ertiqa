import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { Button, buttonVariants } from "@/ui/button";
import { cn } from "@/lib/utils";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="pagination-content" className={cn("flex flex-row items-center gap-2", className)} {...props} />;
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">;

function PaginationLink({ className, isActive, size = "icon", ...props }: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        "transition-all duration-200 hover:scale-105",
        isActive
          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30"
          : "text-gray-300 hover:text-white hover:bg-zinc-800/50",
        className
      )}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  children,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { children?: React.ReactNode }) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-2 px-3 sm:px-4", className)}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="hidden sm:inline-block">{children || "Previous"}</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  children,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { children?: React.ReactNode }) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-2 px-3 sm:px-4", className)}
      {...props}
    >
      <span className="hidden sm:inline-block">{children || "Next"}</span>
      <ChevronRight className="h-4 w-4" />
    </PaginationLink>
  );
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center text-gray-400", className)}
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
