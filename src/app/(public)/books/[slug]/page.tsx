import React from "react";

interface BookPageProps {
  params: { slug: string };
}

export default function BookPage({ params }: BookPageProps) {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold text-gray-800">الكتاب: {params.slug}</h1>
      <p className="mt-2 text-gray-600">هذه صفحة ديناميكية لعرض تفاصيل الكتاب.</p>
    </main>
  );
}