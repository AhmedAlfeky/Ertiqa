'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

type Props = {
  locale: string;
  isEnrolled: boolean;
  isStudent: boolean;
  isLoggedIn: boolean;
};

export function EnrollButton({ locale, isEnrolled, isStudent, isLoggedIn }: Props) {
  const router = useRouter();

  if (isEnrolled) {
    return (
      <Button variant="outline" disabled className="w-full md:w-auto">
        {locale === 'ar' ? 'أنت مسجل بالفعل' : 'Already enrolled'}
      </Button>
    );
  }

  if (!isStudent) {
    return (
      <Button variant="outline" disabled className="w-full md:w-auto">
        {locale === 'ar' ? 'متاح للطلاب فقط' : 'Students only'}
      </Button>
    );
  }

  const label = locale === 'ar' ? 'شارك في الدورة' : 'Participate';

  const handleClick = () => {
    if (!isLoggedIn) {
      router.push(`/${locale}/login`);
      return;
    }
    router.push(`/${locale}/student/dashboard`);
  };

  return (
    <Button className="w-full md:w-auto" onClick={handleClick}>
      {label}
    </Button>
  );
}

