import { getPublishedCourses } from '@/lib/db/queries/courses.sql';

export default async function CoursesPage() {
  const courses = await getPublishedCourses(20); // عرض 20 دورة

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-10">جميع الدورات</h1>
       
        {courses.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">لا توجد دورات منشورة حاليًا.</p>
            ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div 
                key={course.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {course.cover_image_url ? (
                  <img 
                    src={course.cover_image_url} 
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center">
                    <span className="text-gray-400 text-lg">لا غلاف متاح</span>
                  </div>
                )}
                <div className="p-5">
                  <h2 className="text-xl font-bold mb-2 text-gray-900">{course.title}</h2>
                  <p className="text-gray-600 mb-3 line-clamp-2">{course.summary}</p>
                  <p className="text-sm text-indigo-600 font-medium">المدرب: {course.instructor_name}</p>
                </div>
              </div>
            ))}
          </div>
            )
        }
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* ... */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}