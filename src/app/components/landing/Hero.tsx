'use client';

import { useTranslations } from 'next-intl';
import { PlayCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { Reveal } from './Reveal';

export const Hero = ({ locale }: { locale: string }) => {
  const t = useTranslations('Hero');
  const isRtl = locale === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-gradient-to-br from-yale-blue via-yale-blue-light to-carbon">
      {/* Background Shapes (Optional for aesthetic) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-alice-blue/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Text Content */}
        <div className="space-y-6 text-center lg:text-start">
          <Reveal>
            <div className="inline-block px-4 py-1.5 rounded-full bg-yale-blue-light border border-white/10 text-gold-primary text-sm font-semibold mb-4">
              🚀 {t('badge')}
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              {t('title_start')}{' '}
              <span className="text-gold-primary">{t('title_highlight')}</span>{' '}
              {t('title_end')}
            </h1>
          </Reveal>

          <Reveal delay={0.4}>
            <p className="text-lg text-platinum/80 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {t('description')}
            </p>
          </Reveal>

          <Reveal delay={0.5}>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <button className="w-full sm:w-auto px-8 py-4 bg-gold-primary hover:bg-gold-light text-yale-blue font-bold rounded-xl transition shadow-lg shadow-gold-primary/20 flex items-center justify-center gap-2 group">
                {t('cta_primary')}
                <ArrowIcon className="w-5 h-5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </button>

              <button className="w-full sm:w-auto px-8 py-4 border border-white/20 text-white hover:bg-white/10 rounded-xl transition flex items-center justify-center gap-2">
                <PlayCircle className="w-5 h-5 text-gold-primary" />
                {t('cta_secondary')}
              </button>
            </div>
          </Reveal>

          {/* Trust Badges / Stats (Optional) */}
          <Reveal delay={0.6}>
            <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 border-t border-white/10 mt-8">
              <div>
                <h3 className="text-2xl font-bold text-white">5k+</h3>
                <p className="text-sm text-platinum/60">{t('stat_students')}</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">120+</h3>
                <p className="text-sm text-platinum/60">{t('stat_courses')}</p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Hero Image */}
        <div className="relative hidden lg:block">
          <Reveal delay={0.4}>
            <div className="relative z-10 rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
              {/* استبدل الرابط بصورة حقيقية من المشروع */}
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop"
                alt="Students Learning"
                width={600}
                height={700}
                className="object-cover"
                priority
              />
            </div>
            {/* الخلفية الزخرفية للصورة */}
            <div className="absolute inset-0 bg-gold-primary rounded-3xl -rotate-3 -z-10 translate-y-4 translate-x-4 opacity-50" />
          </Reveal>
        </div>
      </div>
    </section>
  );
};
