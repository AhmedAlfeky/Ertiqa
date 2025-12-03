import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve, join } from 'path';
import { existsSync } from 'fs';

// Check for required env vars
const supabaseUrl = 'https://chixhnyofmbrfwjhijnn.supabase.co';
const serviceRoleKey = 'sb_secret_VLG96i0sbA0Gu09RtSqnsw_qlipvZwF';

console.log('🔍 Environment check:');
console.log('  URL:', supabaseUrl ? '✅' : '❌');
console.log(
  '  Service Key:',
  serviceRoleKey
    ? `✅ (starts with ${serviceRoleKey.substring(0, 20)}...)`
    : '❌'
);

if (!supabaseUrl || !serviceRoleKey) {
  console.error('\n❌ Missing required environment variables!');
  console.log('\nAdd to .env.local:');
  console.log(
    '  NEXT_PUBLIC_SUPABASE_URL=https://chixhnyofmbrfwjhijnn.supabase.co'
  );
  console.log('  SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>');
  console.log(
    '\n💡 Get from: Supabase Dashboard → Settings → API → Reveal service_role key'
  );
  process.exit(1);
}

// Decode JWT to check if it's service role
try {
  const payload = JSON.parse(
    Buffer.from(serviceRoleKey.split('.')[1], 'base64').toString()
  );
  console.log('  Key role:', payload.role);
  if (payload.role !== 'service_role') {
    console.error(
      '\n❌ ERROR: You are using the ANON key, not the SERVICE ROLE key!'
    );
    console.log('  Current role:', payload.role);
    console.log('  Required role: service_role');
    console.log(
      '\n💡 Copy the SERVICE ROLE key from Supabase Dashboard, not the anon key!'
    );
    process.exit(1);
  }
} catch (e) {
  console.warn('⚠️ Could not verify key type');
}

// Initialize Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Course cover images from Unsplash (free to use)
const COVER_IMAGES = [
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
  'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
  'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
  'https://images.unsplash.com/photo-1507537362848-9c7e70b7b5c1?w=800',
  'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=800',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
];

// Sample course data
const COURSES = [
  {
    titleEn: 'Complete Web Development Bootcamp',
    titleAr: 'دورة تطوير الويب الكاملة',
    subtitleEn: 'From Beginner to Advanced',
    subtitleAr: 'من المبتدئ إلى المحترف',
    descriptionEn:
      'Learn HTML, CSS, JavaScript, React, Node.js and become a full-stack web developer. Build real-world projects and deploy them to production.',
    descriptionAr:
      'تعلم HTML و CSS و JavaScript و React و Node.js وأصبح مطور ويب متكامل. قم ببناء مشاريع حقيقية ونشرها على الإنترنت.',
    price: 99.99,
    level: 1,
  },
  {
    titleEn: 'Python for Data Science',
    titleAr: 'بايثون لعلوم البيانات',
    subtitleEn: 'Master Data Analysis and Machine Learning',
    subtitleAr: 'إتقان تحليل البيانات والتعلم الآلي',
    descriptionEn:
      'Comprehensive Python course covering NumPy, Pandas, Matplotlib, Scikit-learn and deep learning with TensorFlow.',
    descriptionAr:
      'دورة بايثون شاملة تغطي NumPy و Pandas و Matplotlib و Scikit-learn والتعلم العميق مع TensorFlow.',
    price: 89.99,
    level: 2,
  },
  {
    titleEn: 'UI/UX Design Masterclass',
    titleAr: 'دورة تصميم واجهات المستخدم',
    subtitleEn: 'Create Beautiful User Interfaces',
    subtitleAr: 'إنشاء واجهات مستخدم جميلة',
    descriptionEn:
      'Learn design principles, Figma, user research, prototyping and create stunning UI/UX designs that users love.',
    descriptionAr:
      'تعلم مبادئ التصميم و Figma وبحث المستخدم والنماذج الأولية وإنشاء تصاميم UI/UX مذهلة يحبها المستخدمون.',
    price: 79.99,
    level: 1,
  },
  {
    titleEn: 'Mobile App Development with React Native',
    titleAr: 'تطوير تطبيقات الجوال مع React Native',
    subtitleEn: 'Build iOS and Android Apps',
    subtitleAr: 'بناء تطبيقات iOS و Android',
    descriptionEn:
      'Master React Native and build cross-platform mobile applications. Learn navigation, state management, APIs and app deployment.',
    descriptionAr:
      'إتقان React Native وبناء تطبيقات الجوال عبر المنصات. تعلم التنقل وإدارة الحالة وواجهات API ونشر التطبيقات.',
    price: 119.99,
    level: 2,
  },
  {
    titleEn: 'Digital Marketing Fundamentals',
    titleAr: 'أساسيات التسويق الرقمي',
    subtitleEn: 'SEO, Social Media, and Content Marketing',
    subtitleAr: 'تحسين محركات البحث ووسائل التواصل الاجتماعي',
    descriptionEn:
      'Complete guide to digital marketing including SEO, social media marketing, email marketing, and analytics.',
    descriptionAr:
      'دليل شامل للتسويق الرقمي بما في ذلك تحسين محركات البحث والتسويق عبر وسائل التواصل الاجتماعي والبريد الإلكتروني والتحليلات.',
    price: 0,
    level: 1,
  },
  {
    titleEn: 'Advanced JavaScript Concepts',
    titleAr: 'مفاهيم جافاسكريبت المتقدمة',
    subtitleEn: 'Closures, Async/Await, and More',
    subtitleAr: 'الإغلاقات والبرمجة غير المتزامنة والمزيد',
    descriptionEn:
      'Deep dive into advanced JavaScript topics including closures, prototypes, async programming, and modern ES6+ features.',
    descriptionAr:
      'الغوص العميق في مواضيع JavaScript المتقدمة بما في ذلك الإغلاقات والنماذج الأولية والبرمجة غير المتزامنة وميزات ES6+ الحديثة.',
    price: 69.99,
    level: 3,
  },
  {
    titleEn: 'Database Design and SQL',
    titleAr: 'تصميم قواعد البيانات و SQL',
    subtitleEn: 'From Basics to Advanced Queries',
    subtitleAr: 'من الأساسيات إلى الاستعلامات المتقدمة',
    descriptionEn:
      'Learn database design principles, normalization, SQL queries, joins, indexes, and database optimization techniques.',
    descriptionAr:
      'تعلم مبادئ تصميم قواعد البيانات والتطبيع واستعلامات SQL والصلات والفهارس وتقنيات تحسين قاعدة البيانات.',
    price: 59.99,
    level: 2,
  },
  {
    titleEn: 'Graphic Design with Adobe Creative Suite',
    titleAr: 'التصميم الجرافيكي مع Adobe Creative Suite',
    subtitleEn: 'Photoshop, Illustrator, InDesign',
    subtitleAr: 'فوتوشوب وإليستريتور وإن ديزاين',
    descriptionEn:
      'Master Adobe Photoshop, Illustrator, and InDesign. Create professional graphics, logos, and layouts.',
    descriptionAr:
      'إتقان Adobe Photoshop و Illustrator و InDesign. إنشاء رسومات وشعارات وتخطيطات احترافية.',
    price: 94.99,
    level: 1,
  },
  {
    titleEn: 'Cloud Computing with AWS',
    titleAr: 'الحوسبة السحابية مع AWS',
    subtitleEn: 'EC2, S3, Lambda, and More',
    subtitleAr: 'EC2 و S3 و Lambda والمزيد',
    descriptionEn:
      'Complete AWS course covering EC2, S3, RDS, Lambda, API Gateway and cloud architecture best practices.',
    descriptionAr:
      'دورة AWS كاملة تغطي EC2 و S3 و RDS و Lambda و API Gateway وأفضل ممارسات الهندسة المعمارية السحابية.',
    price: 129.99,
    level: 3,
  },
  {
    titleEn: 'Introduction to Artificial Intelligence',
    titleAr: 'مقدمة في الذكاء الاصطناعي',
    subtitleEn: 'AI Fundamentals and Applications',
    subtitleAr: 'أساسيات الذكاء الاصطناعي وتطبيقاته',
    descriptionEn:
      'Explore AI concepts, machine learning algorithms, neural networks and practical AI applications in real-world scenarios.',
    descriptionAr:
      'استكشف مفاهيم الذكاء الاصطناعي وخوارزميات التعلم الآلي والشبكات العصبية وتطبيقات الذكاء الاصطناعي العملية في سيناريوهات العالم الحقيقي.',
    price: 0,
    level: 1,
  },
  {
    titleEn: 'Cybersecurity Essentials',
    titleAr: 'أساسيات الأمن السيبراني',
    subtitleEn: 'Protect Systems and Data',
    subtitleAr: 'حماية الأنظمة والبيانات',
    descriptionEn:
      'Learn network security, encryption, penetration testing, and ethical hacking techniques to protect digital assets.',
    descriptionAr:
      'تعلم أمن الشبكات والتشفير واختبار الاختراق وتقنيات القرصنة الأخلاقية لحماية الأصول الرقمية.',
    price: 109.99,
    level: 2,
  },
  {
    titleEn: 'Blockchain and Cryptocurrency',
    titleAr: 'البلوكتشين والعملات الرقمية',
    subtitleEn: 'Understand the Future of Finance',
    subtitleAr: 'فهم مستقبل التمويل',
    descriptionEn:
      'Comprehensive guide to blockchain technology, cryptocurrency trading, smart contracts, and DeFi applications.',
    descriptionAr:
      'دليل شامل لتكنولوجيا البلوكتشين وتداول العملات الرقمية والعقود الذكية وتطبيقات DeFi.',
    price: 149.99,
    level: 3,
  },
  {
    titleEn: 'Content Writing and Copywriting',
    titleAr: 'كتابة المحتوى والإعلانات',
    subtitleEn: 'Write Compelling Content',
    subtitleAr: 'اكتب محتوى مقنع',
    descriptionEn:
      'Learn professional writing techniques, SEO writing, storytelling, and create engaging content that converts.',
    descriptionAr:
      'تعلم تقنيات الكتابة الاحترافية وكتابة تحسين محركات البحث ورواية القصص وإنشاء محتوى جذاب يحقق نتائج.',
    price: 49.99,
    level: 1,
  },
  {
    titleEn: 'Video Editing with Adobe Premiere Pro',
    titleAr: 'مونتاج الفيديو مع Adobe Premiere Pro',
    subtitleEn: 'Professional Video Production',
    subtitleAr: 'إنتاج فيديو احترافي',
    descriptionEn:
      'Master video editing, color grading, audio mixing, and effects in Adobe Premiere Pro. Create professional videos.',
    descriptionAr:
      'إتقان تحرير الفيديو وتدريج الألوان ومزج الصوت والتأثيرات في Adobe Premiere Pro. إنشاء مقاطع فيديو احترافية.',
    price: 84.99,
    level: 2,
  },
  {
    titleEn: 'Business Analytics with Excel',
    titleAr: 'تحليلات الأعمال مع Excel',
    subtitleEn: 'Data Analysis and Visualization',
    subtitleAr: 'تحليل البيانات والتصور',
    descriptionEn:
      'Advanced Excel course covering formulas, pivot tables, macros, data analysis, and business intelligence.',
    descriptionAr:
      'دورة Excel متقدمة تغطي الصيغ والجداول المحورية والماكرو وتحليل البيانات وذكاء الأعمال.',
    price: 0,
    level: 1,
  },
  {
    titleEn: 'iOS Development with Swift',
    titleAr: 'تطوير تطبيقات iOS مع Swift',
    subtitleEn: 'Build iPhone and iPad Apps',
    subtitleAr: 'بناء تطبيقات iPhone و iPad',
    descriptionEn:
      'Learn Swift programming, UIKit, SwiftUI, and build beautiful iOS applications from scratch.',
    descriptionAr:
      'تعلم برمجة Swift و UIKit و SwiftUI وبناء تطبيقات iOS جميلة من الصفر.',
    price: 124.99,
    level: 2,
  },
  {
    titleEn: 'Project Management Professional',
    titleAr: 'إدارة المشاريع الاحترافية',
    subtitleEn: 'PMP Certification Prep',
    subtitleAr: 'التحضير لشهادة PMP',
    descriptionEn:
      'Complete PMP exam preparation course covering all knowledge areas, processes, and best practices in project management.',
    descriptionAr:
      'دورة تحضير كاملة لامتحان PMP تغطي جميع مجالات المعرفة والعمليات وأفضل الممارسات في إدارة المشاريع.',
    price: 199.99,
    level: 3,
  },
  {
    titleEn: '3D Modeling with Blender',
    titleAr: 'النمذجة ثلاثية الأبعاد مع Blender',
    subtitleEn: 'Create Stunning 3D Graphics',
    subtitleAr: 'إنشاء رسومات ثلاثية الأبعاد مذهلة',
    descriptionEn:
      'Learn 3D modeling, texturing, lighting, animation and rendering in Blender. Create game assets and animations.',
    descriptionAr:
      'تعلم النمذجة ثلاثية الأبعاد والقوام والإضاءة والرسوم المتحركة والعرض في Blender. إنشاء أصول اللعبة والرسوم المتحركة.',
    price: 94.99,
    level: 2,
  },
  {
    titleEn: 'Financial Accounting Fundamentals',
    titleAr: 'أساسيات المحاسبة المالية',
    subtitleEn: 'Understanding Financial Statements',
    subtitleAr: 'فهم القوائم المالية',
    descriptionEn:
      'Learn accounting principles, financial statements, journal entries, and financial analysis for business decisions.',
    descriptionAr:
      'تعلم مبادئ المحاسبة والقوائم المالية والقيود اليومية والتحليل المالي لاتخاذ قرارات الأعمال.',
    price: 0,
    level: 1,
  },
  {
    titleEn: 'Docker and Kubernetes',
    titleAr: 'Docker و Kubernetes',
    subtitleEn: 'Container Orchestration',
    subtitleAr: 'تنسيق الحاويات',
    descriptionEn:
      'Master containerization with Docker and orchestration with Kubernetes. Deploy scalable microservices applications.',
    descriptionAr:
      'إتقان الحاويات مع Docker والتنسيق مع Kubernetes. نشر تطبيقات الخدمات الصغيرة القابلة للتطوير.',
    price: 139.99,
    level: 3,
  },
  {
    titleEn: 'Photography Masterclass',
    titleAr: 'دورة التصوير الفوتوغرافي',
    subtitleEn: 'From DSLR to Professional Photography',
    subtitleAr: 'من DSLR إلى التصوير الاحترافي',
    descriptionEn:
      'Learn camera settings, composition, lighting, photo editing and become a professional photographer.',
    descriptionAr:
      'تعلم إعدادات الكاميرا والتكوين والإضاءة وتحرير الصور وكن مصورًا محترفًا.',
    price: 74.99,
    level: 1,
  },
  {
    titleEn: 'DevOps Engineering',
    titleAr: 'هندسة DevOps',
    subtitleEn: 'CI/CD, Infrastructure as Code',
    subtitleAr: 'التكامل المستمر والبنية التحتية كرمز',
    descriptionEn:
      'Learn DevOps practices, CI/CD pipelines, Jenkins, GitLab CI, Terraform and automate your development workflow.',
    descriptionAr:
      'تعلم ممارسات DevOps وخطوط CI/CD و Jenkins و GitLab CI و Terraform وأتمتة سير عمل التطوير الخاص بك.',
    price: 159.99,
    level: 3,
  },
  {
    titleEn: 'English Language Course',
    titleAr: 'دورة اللغة الإنجليزية',
    subtitleEn: 'Speak English Fluently',
    subtitleAr: 'تحدث الإنجليزية بطلاقة',
    descriptionEn:
      'Comprehensive English course covering grammar, vocabulary, pronunciation, and conversation skills.',
    descriptionAr:
      'دورة إنجليزية شاملة تغطي القواعد والمفردات والنطق ومهارات المحادثة.',
    price: 0,
    level: 1,
  },
  {
    titleEn: 'Machine Learning A-Z',
    titleAr: 'التعلم الآلي من الألف إلى الياء',
    subtitleEn: 'Hands-On Python & R',
    subtitleAr: 'عملي مع Python و R',
    descriptionEn:
      'Complete machine learning course with hands-on projects in Python and R. Build predictive models and AI applications.',
    descriptionAr:
      'دورة تعلم آلي كاملة مع مشاريع عملية في Python و R. بناء نماذج تنبؤية وتطبيقات الذكاء الاصطناعي.',
    price: 134.99,
    level: 3,
  },
  {
    titleEn: 'WordPress Website Development',
    titleAr: 'تطوير مواقع WordPress',
    subtitleEn: 'Build Professional Websites',
    subtitleAr: 'بناء مواقع احترافية',
    descriptionEn:
      'Learn WordPress development, theme customization, plugins, WooCommerce and create professional websites.',
    descriptionAr:
      'تعلم تطوير WordPress وتخصيص القوالب والإضافات و WooCommerce وإنشاء مواقع ويب احترافية.',
    price: 54.99,
    level: 1,
  },
  {
    titleEn: 'Game Development with Unity',
    titleAr: 'تطوير الألعاب مع Unity',
    subtitleEn: '2D and 3D Game Creation',
    subtitleAr: 'إنشاء ألعاب ثنائية وثلاثية الأبعاد',
    descriptionEn:
      'Master Unity game engine, C# programming, physics, animations and create 2D/3D games for multiple platforms.',
    descriptionAr:
      'إتقان محرك ألعاب Unity وبرمجة C# والفيزياء والرسوم المتحركة وإنشاء ألعاب ثنائية/ثلاثية الأبعاد لمنصات متعددة.',
    price: 114.99,
    level: 2,
  },
  {
    titleEn: 'Social Media Marketing',
    titleAr: 'التسويق عبر وسائل التواصل الاجتماعي',
    subtitleEn: 'Facebook, Instagram, TikTok',
    subtitleAr: 'فيسبوك وإنستغرام وتيك توك',
    descriptionEn:
      'Learn social media marketing strategies, content creation, ads management and grow your online presence.',
    descriptionAr:
      'تعلم استراتيجيات التسويق عبر وسائل التواصل الاجتماعي وإنشاء المحتوى وإدارة الإعلانات وتنمية تواجدك على الإنترنت.',
    price: 0,
    level: 1,
  },
];

// Sample units and lessons
const UNITS_TEMPLATE = [
  {
    titleEn: 'Introduction and Getting Started',
    titleAr: 'المقدمة والبدء',
    descriptionEn: 'Introduction to the course and setting up your environment',
    descriptionAr: 'مقدمة للدورة وإعداد بيئة العمل',
    lessons: [
      {
        titleEn: 'Welcome to the Course',
        titleAr: 'مرحباً بك في الدورة',
        contentEn: 'Introduction and course overview',
        contentAr: 'المقدمة ونظرة عامة على الدورة',
        duration: 5,
        isFree: true,
      },
      {
        titleEn: 'Installation and Setup',
        titleAr: 'التثبيت والإعداد',
        contentEn: 'Setting up your development environment',
        contentAr: 'إعداد بيئة التطوير الخاصة بك',
        duration: 10,
        isFree: true,
      },
    ],
  },
  {
    titleEn: 'Core Concepts',
    titleAr: 'المفاهيم الأساسية',
    descriptionEn: 'Understanding the fundamental concepts',
    descriptionAr: 'فهم المفاهيم الأساسية',
    lessons: [
      {
        titleEn: 'Basic Principles',
        titleAr: 'المبادئ الأساسية',
        contentEn: 'Core principles and fundamentals',
        contentAr: 'المبادئ والأساسيات الأساسية',
        duration: 15,
        isFree: false,
      },
      {
        titleEn: 'Advanced Concepts',
        titleAr: 'المفاهيم المتقدمة',
        contentEn: 'Deep dive into advanced topics',
        contentAr: 'الغوص العميق في المواضيع المتقدمة',
        duration: 20,
        isFree: false,
      },
      {
        type: 'quiz',
        titleEn: 'Core Concepts Quiz',
        titleAr: 'اختبار المفاهيم الأساسية',
        questions: [
          {
            questionEn: 'What is the main purpose of this module?',
            questionAr: 'ما هو الغرض الرئيسي من هذه الوحدة؟',
            options: [
              {
                textEn: 'Learn basics',
                textAr: 'تعلم الأساسيات',
                isCorrect: true,
              },
              {
                textEn: 'Skip content',
                textAr: 'تخطي المحتوى',
                isCorrect: false,
              },
              { textEn: 'Test only', textAr: 'اختبار فقط', isCorrect: false },
              { textEn: 'Nothing', textAr: 'لا شيء', isCorrect: false },
            ],
          },
          {
            questionEn: 'Which principle is most important?',
            questionAr: 'أي مبدأ هو الأكثر أهمية؟',
            options: [
              { textEn: 'Practice', textAr: 'الممارسة', isCorrect: true },
              {
                textEn: 'Theory only',
                textAr: 'النظرية فقط',
                isCorrect: false,
              },
              { textEn: 'Reading', textAr: 'القراءة', isCorrect: false },
              { textEn: 'Watching', textAr: 'المشاهدة', isCorrect: false },
            ],
          },
        ],
      },
    ],
  },
  {
    titleEn: 'Practical Projects',
    titleAr: 'المشاريع العملية',
    descriptionEn: 'Build real-world projects',
    descriptionAr: 'بناء مشاريع حقيقية',
    lessons: [
      {
        titleEn: 'Project 1: Beginner Level',
        titleAr: 'المشروع 1: مستوى المبتدئين',
        contentEn: 'Build your first project',
        contentAr: 'بناء مشروعك الأول',
        duration: 30,
        isFree: false,
      },
      {
        titleEn: 'Project 2: Intermediate Level',
        titleAr: 'المشروع 2: المستوى المتوسط',
        contentEn: 'Advanced project with real-world features',
        contentAr: 'مشروع متقدم مع ميزات حقيقية',
        duration: 45,
        isFree: false,
      },
    ],
  },
];

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function seedCourses() {
  console.log('🌱 Starting course seeding...');

  // Use hardcoded instructor ID (your instructor UUID)
  const instructorId = '87bae158-8b60-48ca-bd02-f466e1ffd5e4';

  console.log('👤 Using instructor ID:', instructorId);

  // Seed courses
  for (let i = 0; i < Math.min(COURSES.length, 30); i++) {
    const courseData = COURSES[i];
    const coverImage = COVER_IMAGES[i % COVER_IMAGES.length];

    console.log(`\n📚 Creating course ${i + 1}: ${courseData.titleEn}`);

    // Generate unique slug
    const slug = `${generateSlug(courseData.titleEn)}-${Date.now()}-${i}`;

    // Create course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert({
        instructor_id: instructorId,
        slug: slug,
        level_id: courseData.level,
        category_id: 2, // Use existing category (or set to null if optional)
        teaching_language_id: 1, // Arabic
        is_free: courseData.price === 0,
        price: courseData.price,
        currency: 'USD',
        is_published: i % 3 === 0, // Publish every 3rd course
        cover_image_url: coverImage,
      })
      .select()
      .single();

    if (courseError || !course) {
      console.error(`❌ Error creating course:`, courseError);
      continue;
    }

    // Insert course translations
    const translations = [
      {
        course_id: course.id,
        language_id: 1, // Arabic
        title: courseData.titleAr,
        subtitle: courseData.subtitleAr,
        description: courseData.descriptionAr,
      },
      {
        course_id: course.id,
        language_id: 2, // English
        title: courseData.titleEn,
        subtitle: courseData.subtitleEn,
        description: courseData.descriptionEn,
      },
    ];

    const { error: transError } = await supabase
      .from('course_translations')
      .insert(translations);

    if (transError) {
      console.error(`❌ Error creating translations:`, transError);
      continue;
    }

    console.log(`✅ Course created: ${course.id}`);

    // Create units and lessons
    for (let unitIndex = 0; unitIndex < UNITS_TEMPLATE.length; unitIndex++) {
      const unitTemplate = UNITS_TEMPLATE[unitIndex];

      // Create unit
      const { data: unit, error: unitError } = await supabase
        .from('course_units')
        .insert({
          course_id: course.id,
          order_index: unitIndex,
        })
        .select()
        .single();

      if (unitError || !unit) {
        console.error(`❌ Error creating unit:`, unitError);
        continue;
      }

      // Insert unit translations
      const unitTranslations = [
        {
          unit_id: unit.id,
          language_id: 1,
          title: unitTemplate.titleAr,
          description: unitTemplate.descriptionAr,
        },
        {
          unit_id: unit.id,
          language_id: 2,
          title: unitTemplate.titleEn,
          description: unitTemplate.descriptionEn,
        },
      ];

      await supabase.from('course_unit_translations').insert(unitTranslations);

      console.log(`  📦 Unit ${unitIndex + 1} created`);

      // Create lessons
      for (
        let lessonIndex = 0;
        lessonIndex < unitTemplate.lessons.length;
        lessonIndex++
      ) {
        const lessonTemplate = unitTemplate.lessons[lessonIndex];

        if ('type' in lessonTemplate && lessonTemplate.type === 'quiz') {
          // Create quiz lesson
          const { data: lesson, error: lessonError } = await supabase
            .from('lessons')
            .insert({
              unit_id: unit.id,
              order_index: lessonIndex,
              lesson_type: 'quiz',
              passing_score: 70.0,
            })
            .select()
            .single();

          if (lessonError || !lesson) {
            console.error(`❌ Error creating quiz:`, lessonError);
            continue;
          }

          // Insert lesson translations
          const lessonTranslations = [
            {
              lesson_id: lesson.id,
              language_id: 1,
              title: lessonTemplate.titleAr,
              content: null,
            },
            {
              lesson_id: lesson.id,
              language_id: 2,
              title: lessonTemplate.titleEn,
              content: null,
            },
          ];

          await supabase.from('lesson_translations').insert(lessonTranslations);

          // Create quiz questions
          for (
            let qIndex = 0;
            qIndex < lessonTemplate.questions.length;
            qIndex++
          ) {
            const questionTemplate = lessonTemplate.questions[qIndex];

            const { data: question, error: qError } = await supabase
              .from('quiz_questions')
              .insert({
                lesson_id: lesson.id,
                order_index: qIndex,
                question_type: 'multiple_choice',
              })
              .select()
              .single();

            if (qError || !question) continue;

            // Insert question translations
            const questionTranslations = [
              {
                question_id: question.id,
                language_id: 1,
                question_text: questionTemplate.questionAr,
              },
              {
                question_id: question.id,
                language_id: 2,
                question_text: questionTemplate.questionEn,
              },
            ];

            await supabase
              .from('quiz_question_translations')
              .insert(questionTranslations);

            // Create options
            for (
              let oIndex = 0;
              oIndex < questionTemplate.options.length;
              oIndex++
            ) {
              const optionTemplate = questionTemplate.options[oIndex];

              const { data: option, error: oError } = await supabase
                .from('quiz_options')
                .insert({
                  question_id: question.id,
                  order_index: oIndex,
                  is_correct: optionTemplate.isCorrect,
                })
                .select()
                .single();

              if (oError || !option) continue;

              // Insert option translations
              const optionTranslations = [
                {
                  option_id: option.id,
                  language_id: 1,
                  option_text: optionTemplate.textAr,
                },
                {
                  option_id: option.id,
                  language_id: 2,
                  option_text: optionTemplate.textEn,
                },
              ];

              await supabase
                .from('quiz_option_translations')
                .insert(optionTranslations);
            }
          }

          console.log(`    📝 Quiz lesson created`);
        } else {
          // Create video lesson
          const { data: lesson, error: lessonError } = await supabase
            .from('lessons')
            .insert({
              unit_id: unit.id,
              order_index: lessonIndex,
              lesson_type: 'video',
              video_url: `https://vz-6e836a43-a1c.b-cdn.net/sample-${i}-${unitIndex}-${lessonIndex}.mp4`,
              video_duration: lessonTemplate.duration * 60, // Convert to seconds
              is_free_preview: lessonTemplate.isFree,
            })
            .select()
            .single();

          if (lessonError || !lesson) {
            console.error(`❌ Error creating lesson:`, lessonError);
            continue;
          }

          // Insert lesson translations
          const lessonTranslations = [
            {
              lesson_id: lesson.id,
              language_id: 1,
              title: lessonTemplate.titleAr,
              content: lessonTemplate.contentAr,
            },
            {
              lesson_id: lesson.id,
              language_id: 2,
              title: lessonTemplate.titleEn,
              content: lessonTemplate.contentEn,
            },
          ];

          await supabase.from('lesson_translations').insert(lessonTranslations);

          console.log(`    🎥 Video lesson created: ${lessonTemplate.titleEn}`);
        }
      }
    }

    console.log(
      `✅ Course ${i + 1}/${COURSES.length} complete with ${
        UNITS_TEMPLATE.length
      } units`
    );
  }

  console.log('\n🎉 Seeding completed!');
}

// Run seeding
seedCourses().catch(console.error);
