import React from "react";

export default function BlogPage({ params }: { params: { slug: string } }) {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">مقال: {params.slug}</h1>
      <p className="mt-2 text-gray-600">تفاصيل المقال ستظهر هنا لاحقًا.</p>
    </main>
  );
}
// import React from "react";

// interface BlogPageProps {
//   params: { slug: string };
// }

// export default function BlogPage({ params }: BlogPageProps) {
//   return (
//     <main className="p-6">
//       <h1 className="text-2xl font-bold">مقال: {params.slug}</h1>
//       <p className="mt-2 text-gray-600">تفاصيل المقال ستظهر هنا لاحقًا.</p>
//     </main>
//   );
// }
