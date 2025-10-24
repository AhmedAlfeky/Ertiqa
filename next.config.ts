import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // يمكن إضافة أي إعدادات أخرى
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://192.168.44.1:3000", // الـ IP الخاص بالجهاز على الشبكة
  ],

  // ✅ تجاهل أخطاء TypeScript أثناء build
  typescript: {
    ignoreBuildErrors: true,
  },

  // ✅ تجاهل أخطاء ESLint أثناء build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
