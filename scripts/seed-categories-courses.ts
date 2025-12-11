import { createClient } from '@supabase/supabase-js';

// Check for required env vars
const supabaseUrl = 'https://chixhnyofmbrfwjhijnn.supabase.co';
const serviceRoleKey = 'sb_secret_VLG96i0sbA0Gu09RtSqnsw_qlipvZwF';

if (!supabaseUrl || !serviceRoleKey) {
  console.error('\n❌ Missing required environment variables!');
  process.exit(1);
}

// Initialize Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// 8 Categories with translations
const CATEGORIES = [
  {
    slug: 'design',
    nameEn: 'Design & Creativity',
    nameAr: 'التصميم والإبداع',
  },
  {
    slug: 'tech',
    nameEn: 'Tech & Programming',
    nameAr: 'البرمجة والتقنية',
  },
  {
    slug: 'business',
    nameEn: 'Business & Marketing',
    nameAr: 'إدارة الأعمال والتسويق',
  },
  {
    slug: 'photo',
    nameEn: 'Photography & Visual Arts',
    nameAr: 'التصوير والفنون البصرية',
  },
  {
    slug: 'personal',
    nameEn: 'Personal Development',
    nameAr: 'التطوير الشخصي',
  },
  {
    slug: 'language',
    nameEn: 'Languages',
    nameAr: 'اللغات',
  },
  {
    slug: 'health',
    nameEn: 'Health & Fitness',
    nameAr: 'الصحة واللياقة البدنية',
  },
  {
    slug: 'music',
    nameEn: 'Music & Audio',
    nameAr: 'الموسيقى والصوت',
  },
];

// Stock images from Unsplash (free to use)
const STOCK_IMAGES = [
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507537362848-9c7e70b7b5c1?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop',
];

// Stock video URLs (using Pexels/Vimeo free videos)
const STOCK_VIDEOS = [
  'https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_30fps.mp4',
  'https://videos.pexels.com/video-files/3045164/3045164-hd_1920_1080_30fps.mp4',
  'https://videos.pexels.com/video-files/3045165/3045165-hd_1920_1080_30fps.mp4',
  'https://videos.pexels.com/video-files/3045166/3045166-hd_1920_1080_30fps.mp4',
  'https://videos.pexels.com/video-files/3045167/3045167-hd_1920_1080_30fps.mp4',
  'https://videos.pexels.com/video-files/3045168/3045168-hd_1920_1080_30fps.mp4',
  'https://videos.pexels.com/video-files/3045169/3045169-hd_1920_1080_30fps.mp4',
  'https://videos.pexels.com/video-files/3045170/3045170-hd_1920_1080_30fps.mp4',
  'https://videos.pexels.com/video-files/3045171/3045171-hd_1920_1080_30fps.mp4',
  'https://videos.pexels.com/video-files/3045172/3045172-hd_1920_1080_30fps.mp4',
];

// Course templates by category
const COURSE_TEMPLATES: Record<string, Array<{
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  price: number;
  level: number;
}>> = {
  design: [
    {
      titleEn: 'UI/UX Design Masterclass',
      titleAr: 'دورة تصميم واجهات المستخدم',
      subtitleEn: 'Create Beautiful User Interfaces',
      subtitleAr: 'إنشاء واجهات مستخدم جميلة',
      descriptionEn: 'Learn design principles, Figma, user research, prototyping and create stunning UI/UX designs that users love.',
      descriptionAr: 'تعلم مبادئ التصميم و Figma وبحث المستخدم والنماذج الأولية وإنشاء تصاميم UI/UX مذهلة يحبها المستخدمون.',
      price: 79.99,
      level: 1,
    },
    {
      titleEn: 'Graphic Design with Adobe Creative Suite',
      titleAr: 'التصميم الجرافيكي مع Adobe Creative Suite',
      subtitleEn: 'Photoshop, Illustrator, InDesign',
      subtitleAr: 'فوتوشوب وإليستريتور وإن ديزاين',
      descriptionEn: 'Master Adobe Photoshop, Illustrator, and InDesign. Create professional graphics, logos, and layouts.',
      descriptionAr: 'إتقان Adobe Photoshop و Illustrator و InDesign. إنشاء رسومات وشعارات وتخطيطات احترافية.',
      price: 94.99,
      level: 1,
    },
    {
      titleEn: '3D Modeling with Blender',
      titleAr: 'النمذجة ثلاثية الأبعاد مع Blender',
      subtitleEn: 'Create Stunning 3D Graphics',
      subtitleAr: 'إنشاء رسومات ثلاثية الأبعاد مذهلة',
      descriptionEn: 'Learn 3D modeling, texturing, lighting, animation and rendering in Blender. Create game assets and animations.',
      descriptionAr: 'تعلم النمذجة ثلاثية الأبعاد والقوام والإضاءة والرسوم المتحركة والعرض في Blender. إنشاء أصول اللعبة والرسوم المتحركة.',
      price: 94.99,
      level: 2,
    },
    {
      titleEn: 'Web Design Fundamentals',
      titleAr: 'أساسيات تصميم الويب',
      subtitleEn: 'HTML, CSS, and Modern Design',
      subtitleAr: 'HTML و CSS والتصميم الحديث',
      descriptionEn: 'Learn the fundamentals of web design including HTML, CSS, responsive design, and modern web aesthetics.',
      descriptionAr: 'تعلم أساسيات تصميم الويب بما في ذلك HTML و CSS والتصميم المتجاوب وجماليات الويب الحديثة.',
      price: 49.99,
      level: 1,
    },
    {
      titleEn: 'Brand Identity Design',
      titleAr: 'تصميم الهوية التجارية',
      subtitleEn: 'Create Memorable Brand Identities',
      subtitleAr: 'إنشاء هويات تجارية لا تُنسى',
      descriptionEn: 'Master the art of brand identity design. Learn to create logos, color palettes, typography, and brand guidelines.',
      descriptionAr: 'إتقان فن تصميم الهوية التجارية. تعلم إنشاء الشعارات وألوان الخطوط والطباعة وإرشادات العلامة التجارية.',
      price: 89.99,
      level: 2,
    },
  ],
  tech: [
    {
      titleEn: 'Complete Web Development Bootcamp',
      titleAr: 'دورة تطوير الويب الكاملة',
      subtitleEn: 'From Beginner to Advanced',
      subtitleAr: 'من المبتدئ إلى المحترف',
      descriptionEn: 'Learn HTML, CSS, JavaScript, React, Node.js and become a full-stack web developer. Build real-world projects and deploy them to production.',
      descriptionAr: 'تعلم HTML و CSS و JavaScript و React و Node.js وأصبح مطور ويب متكامل. قم ببناء مشاريع حقيقية ونشرها على الإنترنت.',
      price: 99.99,
      level: 1,
    },
    {
      titleEn: 'Python for Data Science',
      titleAr: 'بايثون لعلوم البيانات',
      subtitleEn: 'Master Data Analysis and Machine Learning',
      subtitleAr: 'إتقان تحليل البيانات والتعلم الآلي',
      descriptionEn: 'Comprehensive Python course covering NumPy, Pandas, Matplotlib, Scikit-learn and deep learning with TensorFlow.',
      descriptionAr: 'دورة بايثون شاملة تغطي NumPy و Pandas و Matplotlib و Scikit-learn والتعلم العميق مع TensorFlow.',
      price: 89.99,
      level: 2,
    },
    {
      titleEn: 'Mobile App Development with React Native',
      titleAr: 'تطوير تطبيقات الجوال مع React Native',
      subtitleEn: 'Build iOS and Android Apps',
      subtitleAr: 'بناء تطبيقات iOS و Android',
      descriptionEn: 'Master React Native and build cross-platform mobile applications. Learn navigation, state management, APIs and app deployment.',
      descriptionAr: 'إتقان React Native وبناء تطبيقات الجوال عبر المنصات. تعلم التنقل وإدارة الحالة وواجهات API ونشر التطبيقات.',
      price: 119.99,
      level: 2,
    },
    {
      titleEn: 'Cloud Computing with AWS',
      titleAr: 'الحوسبة السحابية مع AWS',
      subtitleEn: 'EC2, S3, Lambda, and More',
      subtitleAr: 'EC2 و S3 و Lambda والمزيد',
      descriptionEn: 'Complete AWS course covering EC2, S3, RDS, Lambda, API Gateway and cloud architecture best practices.',
      descriptionAr: 'دورة AWS كاملة تغطي EC2 و S3 و RDS و Lambda و API Gateway وأفضل ممارسات الهندسة المعمارية السحابية.',
      price: 129.99,
      level: 3,
    },
    {
      titleEn: 'Docker and Kubernetes',
      titleAr: 'Docker و Kubernetes',
      subtitleEn: 'Container Orchestration',
      subtitleAr: 'تنسيق الحاويات',
      descriptionEn: 'Master containerization with Docker and orchestration with Kubernetes. Deploy scalable microservices applications.',
      descriptionAr: 'إتقان الحاويات مع Docker والتنسيق مع Kubernetes. نشر تطبيقات الخدمات الصغيرة القابلة للتطوير.',
      price: 139.99,
      level: 3,
    },
  ],
  business: [
    {
      titleEn: 'Digital Marketing Fundamentals',
      titleAr: 'أساسيات التسويق الرقمي',
      subtitleEn: 'SEO, Social Media, and Content Marketing',
      subtitleAr: 'تحسين محركات البحث ووسائل التواصل الاجتماعي',
      descriptionEn: 'Complete guide to digital marketing including SEO, social media marketing, email marketing, and analytics.',
      descriptionAr: 'دليل شامل للتسويق الرقمي بما في ذلك تحسين محركات البحث والتسويق عبر وسائل التواصل الاجتماعي والبريد الإلكتروني والتحليلات.',
      price: 0,
      level: 1,
    },
    {
      titleEn: 'Project Management Professional',
      titleAr: 'إدارة المشاريع الاحترافية',
      subtitleEn: 'PMP Certification Prep',
      subtitleAr: 'التحضير لشهادة PMP',
      descriptionEn: 'Complete PMP exam preparation course covering all knowledge areas, processes, and best practices in project management.',
      descriptionAr: 'دورة تحضير كاملة لامتحان PMP تغطي جميع مجالات المعرفة والعمليات وأفضل الممارسات في إدارة المشاريع.',
      price: 199.99,
      level: 3,
    },
    {
      titleEn: 'Business Analytics with Excel',
      titleAr: 'تحليلات الأعمال مع Excel',
      subtitleEn: 'Data Analysis and Visualization',
      subtitleAr: 'تحليل البيانات والتصور',
      descriptionEn: 'Advanced Excel course covering formulas, pivot tables, macros, data analysis, and business intelligence.',
      descriptionAr: 'دورة Excel متقدمة تغطي الصيغ والجداول المحورية والماكرو وتحليل البيانات وذكاء الأعمال.',
      price: 0,
      level: 1,
    },
    {
      titleEn: 'Social Media Marketing',
      titleAr: 'التسويق عبر وسائل التواصل الاجتماعي',
      subtitleEn: 'Facebook, Instagram, TikTok',
      subtitleAr: 'فيسبوك وإنستغرام وتيك توك',
      descriptionEn: 'Learn social media marketing strategies, content creation, ads management and grow your online presence.',
      descriptionAr: 'تعلم استراتيجيات التسويق عبر وسائل التواصل الاجتماعي وإنشاء المحتوى وإدارة الإعلانات وتنمية تواجدك على الإنترنت.',
      price: 0,
      level: 1,
    },
    {
      titleEn: 'Financial Accounting Fundamentals',
      titleAr: 'أساسيات المحاسبة المالية',
      subtitleEn: 'Understanding Financial Statements',
      subtitleAr: 'فهم القوائم المالية',
      descriptionEn: 'Learn accounting principles, financial statements, journal entries, and financial analysis for business decisions.',
      descriptionAr: 'تعلم مبادئ المحاسبة والقوائم المالية والقيود اليومية والتحليل المالي لاتخاذ قرارات الأعمال.',
      price: 0,
      level: 1,
    },
  ],
  photo: [
    {
      titleEn: 'Photography Masterclass',
      titleAr: 'دورة التصوير الفوتوغرافي',
      subtitleEn: 'From DSLR to Professional Photography',
      subtitleAr: 'من DSLR إلى التصوير الاحترافي',
      descriptionEn: 'Learn camera settings, composition, lighting, photo editing and become a professional photographer.',
      descriptionAr: 'تعلم إعدادات الكاميرا والتكوين والإضاءة وتحرير الصور وكن مصورًا محترفًا.',
      price: 74.99,
      level: 1,
    },
    {
      titleEn: 'Video Editing with Adobe Premiere Pro',
      titleAr: 'مونتاج الفيديو مع Adobe Premiere Pro',
      subtitleEn: 'Professional Video Production',
      subtitleAr: 'إنتاج فيديو احترافي',
      descriptionEn: 'Master video editing, color grading, audio mixing, and effects in Adobe Premiere Pro. Create professional videos.',
      descriptionAr: 'إتقان تحرير الفيديو وتدريج الألوان ومزج الصوت والتأثيرات في Adobe Premiere Pro. إنشاء مقاطع فيديو احترافية.',
      price: 84.99,
      level: 2,
    },
    {
      titleEn: 'Portrait Photography',
      titleAr: 'تصوير البورتريه',
      subtitleEn: 'Capture Stunning Portraits',
      subtitleAr: 'التقاط صور بورتريه مذهلة',
      descriptionEn: 'Learn the art of portrait photography including lighting techniques, posing, and post-processing.',
      descriptionAr: 'تعلم فن تصوير البورتريه بما في ذلك تقنيات الإضاءة والوضعيات والمعالجة اللاحقة.',
      price: 69.99,
      level: 2,
    },
    {
      titleEn: 'Landscape Photography',
      titleAr: 'تصوير المناظر الطبيعية',
      subtitleEn: 'Capture Beautiful Landscapes',
      subtitleAr: 'التقاط مناظر طبيعية جميلة',
      descriptionEn: 'Master landscape photography techniques including composition, golden hour, and long exposure photography.',
      descriptionAr: 'إتقان تقنيات تصوير المناظر الطبيعية بما في ذلك التكوين والساعة الذهبية والتصوير طويل التعرض.',
      price: 64.99,
      level: 1,
    },
    {
      titleEn: 'Photo Editing with Lightroom',
      titleAr: 'تحرير الصور مع Lightroom',
      subtitleEn: 'Professional Photo Editing',
      subtitleAr: 'تحرير الصور الاحترافي',
      descriptionEn: 'Learn Adobe Lightroom from basics to advanced editing techniques. Master color correction, retouching, and workflow.',
      descriptionAr: 'تعلم Adobe Lightroom من الأساسيات إلى تقنيات التحرير المتقدمة. إتقان تصحيح الألوان والتنميق وسير العمل.',
      price: 59.99,
      level: 1,
    },
  ],
  personal: [
    {
      titleEn: 'Introduction to Artificial Intelligence',
      titleAr: 'مقدمة في الذكاء الاصطناعي',
      subtitleEn: 'AI Fundamentals and Applications',
      subtitleAr: 'أساسيات الذكاء الاصطناعي وتطبيقاته',
      descriptionEn: 'Explore AI concepts, machine learning algorithms, neural networks and practical AI applications in real-world scenarios.',
      descriptionAr: 'استكشف مفاهيم الذكاء الاصطناعي وخوارزميات التعلم الآلي والشبكات العصبية وتطبيقات الذكاء الاصطناعي العملية في سيناريوهات العالم الحقيقي.',
      price: 0,
      level: 1,
    },
    {
      titleEn: 'Content Writing and Copywriting',
      titleAr: 'كتابة المحتوى والإعلانات',
      subtitleEn: 'Write Compelling Content',
      subtitleAr: 'اكتب محتوى مقنع',
      descriptionEn: 'Learn professional writing techniques, SEO writing, storytelling, and create engaging content that converts.',
      descriptionAr: 'تعلم تقنيات الكتابة الاحترافية وكتابة تحسين محركات البحث ورواية القصص وإنشاء محتوى جذاب يحقق نتائج.',
      price: 49.99,
      level: 1,
    },
    {
      titleEn: 'Time Management Mastery',
      titleAr: 'إتقان إدارة الوقت',
      subtitleEn: 'Productivity and Efficiency',
      subtitleAr: 'الإنتاجية والكفاءة',
      descriptionEn: 'Learn proven time management techniques, productivity systems, and strategies to maximize your efficiency and achieve your goals.',
      descriptionAr: 'تعلم تقنيات إدارة الوقت المثبتة وأنظمة الإنتاجية والاستراتيجيات لتعظيم كفاءتك وتحقيق أهدافك.',
      price: 39.99,
      level: 1,
    },
    {
      titleEn: 'Public Speaking and Presentation Skills',
      titleAr: 'مهارات الخطابة والعروض التقديمية',
      subtitleEn: 'Speak with Confidence',
      subtitleAr: 'تحدث بثقة',
      descriptionEn: 'Master the art of public speaking. Learn to deliver engaging presentations, overcome stage fright, and communicate effectively.',
      descriptionAr: 'إتقان فن الخطابة. تعلم تقديم عروض تقديمية جذابة والتغلب على رهاب المسرح والتواصل بفعالية.',
      price: 54.99,
      level: 1,
    },
    {
      titleEn: 'Leadership and Team Management',
      titleAr: 'القيادة وإدارة الفريق',
      subtitleEn: 'Lead with Impact',
      subtitleAr: 'قادة بتأثير',
      descriptionEn: 'Develop leadership skills, learn team management strategies, and become an effective leader who inspires and motivates.',
      descriptionAr: 'تطوير مهارات القيادة وتعلم استراتيجيات إدارة الفريق وكن قائدًا فعالًا يلهم ويحفز.',
      price: 79.99,
      level: 2,
    },
  ],
  language: [
    {
      titleEn: 'English Language Course',
      titleAr: 'دورة اللغة الإنجليزية',
      subtitleEn: 'Speak English Fluently',
      subtitleAr: 'تحدث الإنجليزية بطلاقة',
      descriptionEn: 'Comprehensive English course covering grammar, vocabulary, pronunciation, and conversation skills.',
      descriptionAr: 'دورة إنجليزية شاملة تغطي القواعد والمفردات والنطق ومهارات المحادثة.',
      price: 0,
      level: 1,
    },
    {
      titleEn: 'Spanish for Beginners',
      titleAr: 'الإسبانية للمبتدئين',
      subtitleEn: 'Learn Spanish from Scratch',
      subtitleAr: 'تعلم الإسبانية من الصفر',
      descriptionEn: 'Complete Spanish course for beginners covering basic grammar, vocabulary, and conversational Spanish.',
      descriptionAr: 'دورة إسبانية كاملة للمبتدئين تغطي القواعد الأساسية والمفردات والإسبانية المحادثة.',
      price: 59.99,
      level: 1,
    },
    {
      titleEn: 'French Language Mastery',
      titleAr: 'إتقان اللغة الفرنسية',
      subtitleEn: 'From Beginner to Advanced',
      subtitleAr: 'من المبتدئ إلى المتقدم',
      descriptionEn: 'Comprehensive French language course covering all levels from beginner to advanced with interactive exercises.',
      descriptionAr: 'دورة لغة فرنسية شاملة تغطي جميع المستويات من المبتدئ إلى المتقدم مع تمارين تفاعلية.',
      price: 69.99,
      level: 1,
    },
    {
      titleEn: 'Arabic for Non-Native Speakers',
      titleAr: 'العربية لغير الناطقين بها',
      subtitleEn: 'Learn Modern Standard Arabic',
      subtitleAr: 'تعلم العربية الفصحى',
      descriptionEn: 'Structured Arabic course for non-native speakers covering reading, writing, speaking, and listening skills.',
      descriptionAr: 'دورة عربية منظمة لغير الناطقين بها تغطي مهارات القراءة والكتابة والتحدث والاستماع.',
      price: 79.99,
      level: 1,
    },
    {
      titleEn: 'Business English Communication',
      titleAr: 'التواصل باللغة الإنجليزية للأعمال',
      subtitleEn: 'Professional English Skills',
      subtitleAr: 'مهارات الإنجليزية المهنية',
      descriptionEn: 'Master business English for professional communication including emails, presentations, and negotiations.',
      descriptionAr: 'إتقان الإنجليزية للأعمال للتواصل المهني بما في ذلك البريد الإلكتروني والعروض التقديمية والمفاوضات.',
      price: 89.99,
      level: 2,
    },
  ],
  health: [
    {
      titleEn: 'Yoga and Mindfulness',
      titleAr: 'اليوجا والوعي الذهني',
      subtitleEn: 'Find Balance and Peace',
      subtitleAr: 'ابحث عن التوازن والسلام',
      descriptionEn: 'Learn yoga poses, breathing techniques, and mindfulness practices for physical and mental well-being.',
      descriptionAr: 'تعلم أوضاع اليوجا وتقنيات التنفس وممارسات الوعي الذهني للرفاهية الجسدية والعقلية.',
      price: 49.99,
      level: 1,
    },
    {
      titleEn: 'Nutrition and Healthy Eating',
      titleAr: 'التغذية والأكل الصحي',
      subtitleEn: 'Fuel Your Body Right',
      subtitleAr: 'وقود جسمك بشكل صحيح',
      descriptionEn: 'Learn about nutrition science, meal planning, and healthy eating habits for optimal health and wellness.',
      descriptionAr: 'تعلم عن علم التغذية وتخطيط الوجبات وعادات الأكل الصحية للصحة والعافية المثلى.',
      price: 59.99,
      level: 1,
    },
    {
      titleEn: 'Home Workout Program',
      titleAr: 'برنامج التمرين في المنزل',
      subtitleEn: 'Get Fit at Home',
      subtitleAr: 'احصل على لياقة في المنزل',
      descriptionEn: 'Complete home workout program with no equipment needed. Build strength, endurance, and flexibility.',
      descriptionAr: 'برنامج تمرين منزلي كامل بدون الحاجة إلى معدات. بناء القوة والتحمل والمرونة.',
      price: 39.99,
      level: 1,
    },
    {
      titleEn: 'Meditation and Stress Relief',
      titleAr: 'التأمل وتخفيف التوتر',
      subtitleEn: 'Calm Your Mind',
      subtitleAr: 'هدئ عقلك',
      descriptionEn: 'Learn meditation techniques, stress management, and relaxation methods for mental clarity and peace.',
      descriptionAr: 'تعلم تقنيات التأمل وإدارة التوتر وطرق الاسترخاء للوضوح العقلي والسلام.',
      price: 44.99,
      level: 1,
    },
    {
      titleEn: 'Running and Cardio Training',
      titleAr: 'الجري والتدريب القلبي',
      subtitleEn: 'Build Endurance and Stamina',
      subtitleAr: 'بناء التحمل والقدرة على التحمل',
      descriptionEn: 'Master running techniques, create training plans, and improve your cardiovascular fitness.',
      descriptionAr: 'إتقان تقنيات الجري وإنشاء خطط التدريب وتحسين لياقتك القلبية الوعائية.',
      price: 54.99,
      level: 1,
    },
  ],
  music: [
    {
      titleEn: 'Guitar for Beginners',
      titleAr: 'الجيتار للمبتدئين',
      subtitleEn: 'Learn to Play Guitar',
      subtitleAr: 'تعلم العزف على الجيتار',
      descriptionEn: 'Complete guitar course for beginners covering chords, strumming, fingerpicking, and popular songs.',
      descriptionAr: 'دورة جيتار كاملة للمبتدئين تغطي الأوتار والعزف والضرب بالأصابع والأغاني الشعبية.',
      price: 69.99,
      level: 1,
    },
    {
      titleEn: 'Music Production with Ableton Live',
      titleAr: 'إنتاج الموسيقى مع Ableton Live',
      subtitleEn: 'Create Professional Music',
      subtitleAr: 'إنشاء موسيقى احترافية',
      descriptionEn: 'Master music production using Ableton Live. Learn mixing, mastering, and create your own tracks.',
      descriptionAr: 'إتقان إنتاج الموسيقى باستخدام Ableton Live. تعلم المزج والإتقان وإنشاء مساراتك الخاصة.',
      price: 99.99,
      level: 2,
    },
    {
      titleEn: 'Piano Fundamentals',
      titleAr: 'أساسيات البيانو',
      subtitleEn: 'Learn Piano from Scratch',
      subtitleAr: 'تعلم البيانو من الصفر',
      descriptionEn: 'Complete piano course covering reading music, scales, chords, and playing beautiful melodies.',
      descriptionAr: 'دورة بيانو كاملة تغطي قراءة الموسيقى والمقاييس والأوتار وعزف الألحان الجميلة.',
      price: 79.99,
      level: 1,
    },
    {
      titleEn: 'Audio Engineering Basics',
      titleAr: 'أساسيات هندسة الصوت',
      subtitleEn: 'Record and Mix Audio',
      subtitleAr: 'تسجيل ومزج الصوت',
      descriptionEn: 'Learn audio engineering fundamentals including recording, mixing, EQ, compression, and effects.',
      descriptionAr: 'تعلم أساسيات هندسة الصوت بما في ذلك التسجيل والمزج والمعادلة والضغط والتأثيرات.',
      price: 89.99,
      level: 2,
    },
    {
      titleEn: 'Songwriting and Composition',
      titleAr: 'كتابة الأغاني والتأليف',
      subtitleEn: 'Create Your Own Music',
      subtitleAr: 'أنشئ موسيقاك الخاصة',
      descriptionEn: 'Learn songwriting techniques, melody creation, chord progressions, and lyric writing to create original songs.',
      descriptionAr: 'تعلم تقنيات كتابة الأغاني وإنشاء اللحن وتقدمات الأوتار وكتابة الكلمات لإنشاء أغاني أصلية.',
      price: 74.99,
      level: 2,
    },
  ],
};

// Units and lessons template
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

async function seedCategories() {
  console.log('🌱 Starting category seeding...');

  const categoryMap = new Map<string, number>();

  for (const category of CATEGORIES) {
    console.log(`\n📁 Creating category: ${category.nameEn}`);

    // Check if category already exists
    const { data: existing } = await supabase
      .from('lookup_categories')
      .select('id')
      .eq('slug', category.slug)
      .single();

    if (existing) {
      console.log(`  ✅ Category already exists: ${category.slug} (ID: ${existing.id})`);
      categoryMap.set(category.slug, existing.id);
      continue;
    }

    // Create category
    const { data: newCategory, error: categoryError } = await supabase
      .from('lookup_categories')
      .insert({ slug: category.slug })
      .select()
      .single();

    if (categoryError || !newCategory) {
      console.error(`❌ Error creating category:`, categoryError);
      continue;
    }

    // Insert translations
    const translations = [
      {
        category_id: newCategory.id,
        language_id: 1, // Arabic
        name: category.nameAr,
      },
      {
        category_id: newCategory.id,
        language_id: 2, // English
        name: category.nameEn,
      },
    ];

    const { error: translationError } = await supabase
      .from('lookup_category_translations')
      .insert(translations);

    if (translationError) {
      console.error(`❌ Error creating translations:`, translationError);
      continue;
    }

    categoryMap.set(category.slug, newCategory.id);
    console.log(`  ✅ Category created: ${category.slug} (ID: ${newCategory.id})`);
  }

  return categoryMap;
}

async function seedCourses(categoryMap: Map<string, number>) {
  console.log('\n🌱 Starting course seeding...');

  // Use hardcoded instructor ID
  const instructorId = '87bae158-8b60-48ca-bd02-f466e1ffd5e4';
  console.log('👤 Using instructor ID:', instructorId);

  let courseIndex = 0;
  let imageIndex = 0;
  let videoIndex = 0;

  // Seed courses for each category
  for (const category of CATEGORIES) {
    const categoryId = categoryMap.get(category.slug);
    if (!categoryId) {
      console.error(`❌ Category not found: ${category.slug}`);
      continue;
    }

    const courses = COURSE_TEMPLATES[category.slug] || [];
    console.log(`\n📚 Seeding ${courses.length} courses for category: ${category.nameEn}`);

    for (let i = 0; i < courses.length; i++) {
      const courseData = courses[i];
      const coverImage = STOCK_IMAGES[imageIndex % STOCK_IMAGES.length];
      imageIndex++;

      console.log(`\n  📖 Creating course ${i + 1}/${courses.length}: ${courseData.titleEn}`);

      // Generate unique slug
      const slug = `${generateSlug(courseData.titleEn)}-${Date.now()}-${courseIndex}`;
      courseIndex++;

      // Create course
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .insert({
          instructor_id: instructorId,
          slug: slug,
          level_id: courseData.level,
          category_id: categoryId,
          teaching_language_id: 1, // Arabic
          is_free: courseData.price === 0,
          price: courseData.price,
          currency: 'USD',
          is_published: true, // Publish all courses
          cover_image_url: coverImage,
        })
        .select()
        .single();

      if (courseError || !course) {
        console.error(`  ❌ Error creating course:`, courseError);
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
        console.error(`  ❌ Error creating translations:`, transError);
        continue;
      }

      console.log(`  ✅ Course created: ${course.id}`);

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
          console.error(`  ❌ Error creating unit:`, unitError);
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
              console.error(`  ❌ Error creating quiz:`, lessonError);
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
            const videoUrl = STOCK_VIDEOS[videoIndex % STOCK_VIDEOS.length];
            videoIndex++;

            const { data: lesson, error: lessonError } = await supabase
              .from('lessons')
              .insert({
                unit_id: unit.id,
                order_index: lessonIndex,
                lesson_type: 'video',
                video_url: videoUrl,
                video_duration: lessonTemplate.duration * 60, // Convert to seconds
                is_free_preview: lessonTemplate.isFree,
              })
              .select()
              .single();

            if (lessonError || !lesson) {
              console.error(`  ❌ Error creating lesson:`, lessonError);
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

      console.log(`  ✅ Course ${i + 1} complete with ${UNITS_TEMPLATE.length} units`);
    }
  }

  console.log('\n🎉 Course seeding completed!');
}

// Main seeding function
async function main() {
  try {
    const categoryMap = await seedCategories();
    await seedCourses(categoryMap);
    console.log('\n✨ All seeding completed successfully!');
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding
main();

