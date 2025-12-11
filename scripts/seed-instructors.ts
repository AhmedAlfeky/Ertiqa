// scripts/seed-instructors.ts
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config(); // load .env.local / .env

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY'
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { autoRefreshToken: false, persistSession: false },
});

type SeedInstructor = {
  email: string;
  full_name: string;
  avatar_url: string;
  specialization: string;
};

// Male-only avatar placeholders (unsplash / randomuser style)
const maleAvatars = [
  'https://randomuser.me/api/portraits/men/10.jpg',
  'https://randomuser.me/api/portraits/men/11.jpg',
  'https://randomuser.me/api/portraits/men/12.jpg',
  'https://randomuser.me/api/portraits/men/13.jpg',
  'https://randomuser.me/api/portraits/men/14.jpg',
  'https://randomuser.me/api/portraits/men/15.jpg',
  'https://randomuser.me/api/portraits/men/16.jpg',
  'https://randomuser.me/api/portraits/men/17.jpg',
  'https://randomuser.me/api/portraits/men/18.jpg',
  'https://randomuser.me/api/portraits/men/19.jpg',
  'https://randomuser.me/api/portraits/men/20.jpg',
  'https://randomuser.me/api/portraits/men/21.jpg',
  'https://randomuser.me/api/portraits/men/22.jpg',
  'https://randomuser.me/api/portraits/men/23.jpg',
  'https://randomuser.me/api/portraits/men/24.jpg',
  'https://randomuser.me/api/portraits/men/25.jpg',
  'https://randomuser.me/api/portraits/men/26.jpg',
  'https://randomuser.me/api/portraits/men/27.jpg',
  'https://randomuser.me/api/portraits/men/28.jpg',
  'https://randomuser.me/api/portraits/men/29.jpg',
  'https://randomuser.me/api/portraits/men/30.jpg',
  'https://randomuser.me/api/portraits/men/31.jpg',
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/men/33.jpg',
  'https://randomuser.me/api/portraits/men/34.jpg',
  'https://randomuser.me/api/portraits/men/35.jpg',
  'https://randomuser.me/api/portraits/men/36.jpg',
  'https://randomuser.me/api/portraits/men/37.jpg',
  'https://randomuser.me/api/portraits/men/38.jpg',
  'https://randomuser.me/api/portraits/men/39.jpg',
];

const specializations = [
  'Full-Stack Development',
  'Data Science & ML',
  'Cloud & DevOps',
  'UI/UX Design',
  'Mobile Development',
  'Cybersecurity',
  'Backend Engineering',
  'Frontend Engineering',
  'Product Management',
  'AI Engineering',
];

const instructors: SeedInstructor[] = Array.from({ length: 30 }).map(
  (_, idx) => {
    const spec = specializations[idx % specializations.length];
    return {
      email: `instructor${idx + 1}@example.com`,
      full_name: `Instructor ${idx + 1}`,
      avatar_url: maleAvatars[idx % maleAvatars.length],
      specialization: spec,
    };
  }
);

const coverImages = [
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200',
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=1200',
];

async function seed() {
  for (const [i, inst] of instructors.entries()) {
    // 1) Create auth user (email confirmed)
    const { data: userRes, error: userErr } =
      await supabase.auth.admin.createUser({
        email: inst.email,
        password: '123',
        email_confirm: true,
        user_metadata: {
          full_name: inst.full_name,
          avatar_url: inst.avatar_url,
          role_id: 2,
          is_instructor: true,
        },
        app_metadata: { role_id: 2, is_instructor: true },
      });

    if (userErr || !userRes?.user) {
      console.error('Failed to create user', inst.email, userErr);
      continue;
    }

    const userId = userRes.user.id;

    // 2) Upsert profile
    const { error: profileErr } = await supabase.from('user_profiles').upsert({
      id: userId,
      full_name: inst.full_name,
      avatar_url: inst.avatar_url,
      specialization: inst.specialization,
      is_instructor: true,
    });

    if (profileErr) {
      console.error('Failed to upsert profile for', inst.email, profileErr);
      continue;
    }

    // 3) Create two courses for this instructor
    for (let c = 0; c < 2; c++) {
      const titleEn = `${inst.specialization} Essentials ${c + 1}`;
      const titleAr = `أساسيات ${inst.specialization} ${c + 1}`;
      const slug = `${titleEn
        .toLowerCase()
        .replace(/\s+/g, '-')}-${Date.now()}-${c}`;
      const cover = coverImages[(i + c) % coverImages.length];

      const { data: course, error: courseErr } = await supabase
        .from('courses')
        .insert({
          instructor_id: userId,
          slug,
          level_id: 1, // adjust if your lookup IDs differ
          category_id: 2, // adjust if needed
          teaching_language_id: 1, // 1 = Arabic, change if needed
          is_free: false,
          price: 49.99,
          currency: 'USD',
          is_published: true,
          cover_image_url: cover,
        })
        .select()
        .single();

      if (courseErr || !course) {
        console.error('Failed to create course for', inst.email, courseErr);
        continue;
      }

      // 4) Insert translations (Arabic + English)
      const translations = [
        {
          course_id: course.id,
          language_id: 1, // Arabic
          title: titleAr,
          subtitle: 'مسار عملي لتطوير مهاراتك',
          description: 'تعلم المفاهيم الأساسية وتطبيقها بمشاريع حقيقية.',
        },
        {
          course_id: course.id,
          language_id: 2, // English
          title: titleEn,
          subtitle: 'Hands-on path to grow your skills',
          description: 'Learn core concepts and apply them with real projects.',
        },
      ];

      const { error: transErr } = await supabase
        .from('course_translations')
        .insert(translations);

      if (transErr) {
        console.error(
          'Failed to add translations for course',
          course.id,
          transErr
        );
      }

      console.log(`Created instructor ${inst.email} course ${course.id}`);
    }
  }

  console.log('Seeding done.');
}

seed().catch(e => {
  console.error(e);
  process.exit(1);
});
