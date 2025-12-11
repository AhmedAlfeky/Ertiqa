'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, Star, BadgeCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type Props = {
  instructor: {
    id: string;
    full_name: string | null;
    specialization?: string | null;
    avatar_url?: string | null;
    courses_count?: number | null;
    rating?: number; // Optional mock rating if you have it
  };
  locale: string;
  index?: number;
};

export function InstructorCard({ instructor, locale, index = 0 }: Props) {
  const initials = instructor.full_name
    ? instructor.full_name
        .split(' ')
        .map(p => p[0])
        .join('')
        .slice(0, 2)
    : 'IN';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: 'spring', 
        stiffness: 300,
        delay: index * 0.1,
        duration: 0.5
      }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Link
        href={`/${locale}/instructors/${instructor.id}`}
        className="group block h-full"
      >
        <div className="relative h-full bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl hover:shadow-gold-primary/5 transition-all duration-300 overflow-hidden">
          {/* Decorative Background Blob */}
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

          <div className="relative z-10 flex flex-col items-center">
            {/* Avatar with Animated Ring */}
            <div className="relative mb-4">
              <div className="absolute -inset-1 bg-gradient-to-tr from-gold-primary to-orange-400 rounded-full opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500" />
              <div className="relative p-1 bg-white dark:bg-slate-900 rounded-full">
                <Avatar className="h-24 w-24 border-4 border-white dark:border-slate-800 shadow-md">
                  <AvatarImage
                    src={instructor.avatar_url || ''}
                    alt={instructor.full_name || ''}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-slate-100 text-slate-500 font-bold text-xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Verified Badge */}
              <div
                className="absolute bottom-1 right-1 bg-blue-500 text-white p-1 rounded-full border-2 border-white dark:border-slate-900 shadow-sm"
                title="Verified Instructor"
              >
                <BadgeCheck className="w-4 h-4" />
              </div>
            </div>

            {/* Info */}
            <div className="text-center space-y-1 mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-gold-primary transition-colors">
                {instructor.full_name}
              </h3>
              <p className="text-sm font-medium text-gold-primary/90 uppercase tracking-wide">
                {instructor.specialization ||
                  (locale === 'ar' ? 'مدرب معتمد' : 'Certified Instructor')}
              </p>
            </div>

            {/* Stats Row */}
            <div className="w-full grid grid-cols-2 gap-2 py-4 border-t border-slate-100 dark:border-slate-800 mb-2">
              <div className="flex flex-col items-center gap-1 border-r border-slate-100 dark:border-slate-800 last:border-0">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <BookOpen className="w-4 h-4 text-gold-primary" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {instructor.courses_count ?? 0}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {locale === 'ar' ? 'دورات' : 'Courses'}
                </span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    4.9
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {locale === 'ar' ? 'تقييم' : 'Rating'}
                </span>
              </div>
            </div>

            {/* Action Button (Slides up on Hover) */}
            <div className="w-full">
              <div className="w-full py-3 rounded-xl bg-yale-blue dark:bg-yale-blue text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 transform translate-y-2 opacity-90 group-hover:translate-y-0 group-hover:opacity-100 group-hover:shadow-lg group-hover:bg-yale-blue-light dark:group-hover:bg-yale-blue-light">
                <span>{locale === 'ar' ? 'عرض الملف' : 'View Profile'}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
