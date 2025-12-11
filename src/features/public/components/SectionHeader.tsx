'use client';

import { H2, Lead } from '@/components/ui/Typography';

type Props = {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
};

export function SectionHeader({
  title,
  subtitle,
  align = 'center',
  className,
}: Props) {
  const isCentered = align === 'center';

  return (
    <div
      className={`flex flex-col gap-4 ${className} ${
        isCentered ? 'items-center text-center' : 'items-start text-start'
      }`}
    >
      <div className="relative w-fit inline-block">
        <H2 className="text-3xl w-fit relative md:text-4xl lg:text-5xl font-extrabold text-gold-primary dark:text-gold-primary">
          {title}
        </H2>
        <svg
          className={`absolute -bottom-5 w-24 h-3 md:w-32 md:h-4 ${
            isCentered ? 'start-1/3' : 'start-0'
          }`}
          viewBox="0 0 120 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 6C2 6 20 2 40 6C60 10 80 2 100 6C110 8 118 6 118 6"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gold-primary"
          />
          <path
            d="M2 8C2 8 20 4 40 8C60 12 80 4 100 8C110 10 118 8 118 8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gold-primary/50"
          />
        </svg>
        {/* Decorative SVG Line */}
      </div>
      {subtitle ? (
        <Lead
          className={`max-w-2xl mt-4 text-muted-foreground ${
            isCentered ? 'text-center' : 'text-start'
          }`}
        >
          {subtitle}
        </Lead>
      ) : null}
    </div>
  );
}
