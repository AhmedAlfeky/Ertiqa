import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

import eslint from '@eslint/js';
import next from '@next/eslint-plugin-next';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

// سطر أتوماتيك تم إيقافه
//export default eslintConfig;

export default tseslint.config(
  // القواعد الأساسية
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  
  // دعم Next.js
  {
    plugins: {
      '@next/next': next,
    },
    rules: {
      ...next.configs.recommended.rules,
      ...next.configs['core-web-vitals'].rules,
    },
  },
  
  // تعطيل قواعد التنسيق (Prettier سيتولى المهمة)
  prettier,
  
  // قواعد مخصصة لمشروعك
  {
    rules: {
      // مثال: منع استخدام any
      '@typescript-eslint/no-explicit-any': 'warn',
      // مثال: طلب أنواع العودة للدوال
      '@typescript-eslint/explicit-function-return-type': 'off', // يمكن تفعيله لاحقًا
    },
  },
  
  // تطبيق القواعد على ملفات المشروع فقط
  {
    files: ['**/*.{ts,tsx}'],
  }
);