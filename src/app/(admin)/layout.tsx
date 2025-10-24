import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "لوحة التحكم",
  description: "صفحة إدارة المحتوى والمستخدمين",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}