export default function LandingPage() {
  return (
    <div className="font-sans">
      <section className="relative w-full h-[700px]">
        <img
          src="/images/eezy.png"
          // src="/images/Ertiqa1.jpg"
          alt="صورة ترحيبية"
          className="w-full h-full object-cover"
        />
        {/* نص فوق الصورة (اختياري) */}
        <div className="absolute inset-0 flex">
          <h1 className="text-white text-4xl md:text-6xl font-bold">
              <p className="dif text-5xl translate-x-[-35%] translate-y-[250%]">منصة تعليمية تفاعلية</p>
              <p className="dif text-4xl text-amber-300 translate-x-[-19%] translate-y-[450%]">دورات  .  بودكاست  .  فعاليات  .  مدونة  .  كتب</p>
              <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
                <button className="btn flex items-center justify-center gap-3 w-60 h-15 text-amber-300 transition duration-600 ease translate-x-[-115%] translate-y-[500%]">
                    ابدأ تجربتك معنا
                  <img src="/images/arw.png" alt="arw" className="arw object-contain w-10 h-10"/>
                </button>
              </a>
          </h1>
        </div>
      </section>

      {/* absolute inset-0 flex items-center justify-center */}
      
      {/* 1. Navigation */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
         
          <div className="font-bold text-xl text-indigo-700">إرتقاء</div>
          <div className="hidden md:flex space-x-8">
            <a href="#courses" className="text-gray-600 hover:text-indigo-600">الدورات</a><br></br>
            <a href="#podcast" className="text-gray-600 hover:text-indigo-600">البودكاست</a>
            <a href="#events" className="text-gray-600 hover:text-indigo-600">الفعاليات</a>
            <a href="#blog" className="text-gray-600 hover:text-indigo-600">المدونة</a>
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
            ابدأ الآن
          </button>
        </nav>
      </header>

      {/* 2. Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 to-white pt-20 pb-16">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            تعلّم، تطوّر، <span className="text-indigo-600">ارتَقِ</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            منصة عربية متكاملة تقدم محتوى تعليميًا عالي الجودة عبر الدورات، البودكاست، الفعاليات، والمقالات — لبناء معرفتك وتطوير مهاراتك في بيئة واحدة.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-medium text-lg hover:bg-indigo-700 transition shadow-lg">
              استكشف الدورات
            </button>
            <button className="border border-indigo-600 text-indigo-600 px-8 py-3 rounded-xl font-medium text-lg hover:bg-indigo-50 transition">
              استمع للبودكاست
            </button>
          </div>
        </div>
      </section>

      {/* 3. Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">لماذا تختار منصة إرتقاء؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="text-center p-6 rounded-xl border border-gray-200 hover:shadow-md transition">
                <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-indigo-600 text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">ما يقوله المستفيدون</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <h4 className="font-bold">{t.name}</h4>
                    <p className="text-gray-500 text-sm">{t.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{t.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA Final */}
      <section className="py-20 bg-white text-white text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">جاهز لبدء رحلتك التعليمية؟</h2>
          <p className="text-indigo-100 mb-8">انضم إلى آلاف المتعلمين الذين غيّروا مسارهم مع إرتقاء.</p>
          <button className="bg-white text-indigo-700 px-8 py-3 rounded-xl font-bold text-lg hover:bg-gray-100 transition">
            اشترك الآن
          </button>
        </div>
      </section>
    </div>
  );
}

// البيانات الثابتة (ستُستبدل لاحقًا ببيانات من قاعدة البيانات)
const features = [
  { icon: "🎓", title: "دورات معتمدة", desc: "محتوى مصمم من قبل خبراء في المجال، مع شهادات إتمام." },
  { icon: "🎧", title: "بودكاست يومي", desc: "استمع لأفكار وتجارب رواد في مجالات متنوعة أثناء التنقّل." },
  { icon: "🌍", title: "مجتمع تفاعلي", desc: "تفاعل مع مدربين ومتخصصين، وشارك في فعاليات حية." }
];

const testimonials = [
  { name: "سارة محمد", role: "مُدرّبة مهارات رقمية", quote: "منصة إرتقاء غيّرت طريقة تعلّمي. المحتوى عميق، والتنظيم ممتاز.", avatar: "/placeholder-avatar.png" },
  { name: "خالد علي", role: "رائد أعمال", quote: "البودكاست يعطيني أفكارًا جديدة أسبوعيًا. لا أفوّت حلقة!", avatar: "/images/placeholders/logo_T.png" },
  { name: "سارة محمد", role: "مُدرّبة مهارات رقمية", quote: "منصة إرتقاء غيّرت طريقة تعلّمي. المحتوى عميق، والتنظيم ممتاز.", avatar: "/placeholder-avatar.png" },
  { name: "خالد علي", role: "رائد أعمال", quote: "البودكاست يعطيني أفكارًا جديدة أسبوعيًا. لا أفوّت حلقة!", avatar: "/images/placeholders/logo_T.png" },
  { name: "سارة محمد", role: "مُدرّبة مهارات رقمية", quote: "منصة إرتقاء غيّرت طريقة تعلّمي. المحتوى عميق، والتنظيم ممتاز.", avatar: "/placeholder-avatar.png" },
  { name: "خالد علي", role: "رائد أعمال", quote: "البودكاست يعطيني أفكارًا جديدة أسبوعيًا. لا أفوّت حلقة!", avatar: "/images/placeholders/logo_T.png" },
];