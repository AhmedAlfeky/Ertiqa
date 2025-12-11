# شرح عمل Supabase Clients (العربية)

## 📚 نظرة عامة

في Supabase، يوجد نوعان رئيسيان من المفاتيح (Keys) والـ Clients:

1. **Anon Client (العميل العام)** - يستخدم `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. **Admin Client (العميل الإداري)** - يستخدم `SUPABASE_SERVICE_ROLE_KEY`

---

## 🔓 1. Anon Client (العميل العام)

### ما هو؟
- **الاسم الكامل**: Anonymous Client
- **المفتاح المستخدم**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **الموقع**: يمكن استخدامه في Client Components (في المتصفح)

### المميزات:
✅ **آمن للاستخدام في المتصفح** - يمكن وضعه في كود JavaScript الذي يعمل في المتصفح  
✅ **يخضع لـ Row Level Security (RLS)** - يحترم سياسات الأمان في قاعدة البيانات  
✅ **محدود الصلاحيات** - يمكنه فقط الوصول للبيانات المسموح بها حسب RLS

### القيود:
❌ **لا يمكنه تنفيذ عمليات إدارية** مثل:
- `listUsers()` - عرض جميع المستخدمين
- `createUser()` - إنشاء مستخدم جديد
- `updateUser()` - تحديث بيانات المستخدم
- أي عملية تتطلب صلاحيات إدارية

### مثال على الاستخدام:

```typescript
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';

export async function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // ← المفتاح العام
    {
      cookies: {
        // إدارة الكوكيز للجلسات
      }
    }
  );
}
```

### متى نستخدمه؟
- ✅ جلب البيانات العادية (courses, categories, etc.)
- ✅ تسجيل الدخول/الخروج
- ✅ قراءة البيانات المسموح بها حسب RLS
- ✅ العمليات التي يقوم بها المستخدمون العاديون

---

## 🔐 2. Admin Client (العميل الإداري)

### ما هو؟
- **الاسم الكامل**: Service Role Client
- **المفتاح المستخدم**: `SUPABASE_SERVICE_ROLE_KEY`
- **الموقع**: **يستخدم فقط في Server Side** (لا يظهر أبداً في المتصفح)

### المميزات:
✅ **صلاحيات كاملة** - يمكنه تنفيذ أي عملية في قاعدة البيانات  
✅ **يتجاوز RLS** - لا يخضع لسياسات Row Level Security  
✅ **عمليات إدارية** - يمكنه إدارة المستخدمين والبيانات

### القيود:
❌ **سري جداً** - لا يجب وضعه أبداً في:
- Client Components
- كود JavaScript في المتصفح
- أي مكان يمكن للمستخدم رؤيته

### مثال على الاستخدام:

```typescript
// src/lib/supabase/admin.ts
import { createClient } from '@supabase/supabase-js';

export const createAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // ← المفتاح السري
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};
```

### متى نستخدمه؟
- ✅ عرض جميع المستخدمين (`listUsers()`)
- ✅ إنشاء مستخدمين جدد
- ✅ تحديث أدوار المستخدمين
- ✅ أي عملية إدارية تتطلب صلاحيات كاملة
- ✅ فقط في Server Actions أو Server Components

---

## 🔄 كيف يعمل النظام؟

### مثال عملي: صفحة عرض المستخدمين

```typescript
// ❌ خطأ - هذا لن يعمل
export async function getAllUsers() {
  const supabase = await createClient(); // Anon Client
  
  // هذا سيفشل! لأن Anon Client لا يمكنه listUsers()
  const { data, error } = await supabase.auth.admin.listUsers();
  // Error: User not allowed
}

// ✅ صحيح - استخدام Admin Client
export async function getAllUsers() {
  const adminSupabase = createAdminClient(); // Admin Client
  
  // هذا سيعمل! لأن Admin Client لديه صلاحيات كاملة
  const { data, error } = await adminSupabase.auth.admin.listUsers();
  return data;
}
```

---

## 🛡️ Row Level Security (RLS) - الأمان على مستوى الصف

### مع Anon Client:
```sql
-- مثال: سياسة RLS في قاعدة البيانات
CREATE POLICY "Users can only see their own data"
ON user_profiles
FOR SELECT
USING (auth.uid() = id);
```

**النتيجة**: Anon Client يمكنه فقط رؤية بيانات المستخدم الحالي، وليس جميع المستخدمين.

### مع Admin Client:
- **يتجاوز جميع سياسات RLS**
- يمكنه رؤية وتعديل جميع البيانات
- لذلك يجب استخدامه بحذر شديد

---

## 📁 هيكل الملفات في المشروع

```
src/lib/supabase/
├── client.ts          → Anon Client (للمتصفح)
├── server.ts          → Anon Client (للسيرفر)
└── admin.ts           → Admin Client (للسيرفر فقط)
```

---

## ⚠️ نصائح أمان مهمة

1. **لا تضع Service Role Key في Client Components أبداً**
   ```typescript
   // ❌ خطأ فادح
   'use client';
   const key = process.env.SUPABASE_SERVICE_ROLE_KEY; // خطر!
   ```

2. **استخدم Anon Client للعمليات العادية**
   ```typescript
   // ✅ صحيح
   const supabase = await createClient();
   const { data } = await supabase.from('courses').select('*');
   ```

3. **استخدم Admin Client فقط في Server Actions**
   ```typescript
   // ✅ صحيح
   'use server';
   export async function getAllUsers() {
     const admin = createAdminClient();
     return await admin.auth.admin.listUsers();
   }
   ```

---

## 🎯 الخلاصة

| الميزة | Anon Client | Admin Client |
|--------|-------------|--------------|
| المفتاح | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `SUPABASE_SERVICE_ROLE_KEY` |
| الاستخدام | Client & Server | Server فقط |
| RLS | ✅ يخضع له | ❌ يتجاوزه |
| الصلاحيات | محدودة | كاملة |
| العمليات الإدارية | ❌ لا | ✅ نعم |
| الأمان | آمن للمتصفح | سري جداً |

---

## 📝 مثال كامل: صفحة إدارة المستخدمين

```typescript
// src/features/admin/queries.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function getAllUsersWithRoles() {
  // 1. التحقق من أن المستخدم الحالي هو Admin
  const supabase = await createClient(); // Anon Client
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user?.user_metadata?.role_id !== 5) {
    return []; // ليس Admin
  }

  // 2. استخدام Admin Client للحصول على جميع المستخدمين
  const adminSupabase = createAdminClient(); // Admin Client
  const { data: authUsers } = await adminSupabase.auth.admin.listUsers();

  // 3. استخدام Anon Client للحصول على Profiles (آمن)
  const { data: profiles } = await supabase
    .from('user_profiles')
    .select('*');

  // 4. دمج البيانات
  return authUsers?.users.map(user => ({
    ...user,
    profile: profiles?.find(p => p.id === user.id)
  }));
}
```

---

## 🔗 روابط مفيدة

- [Supabase Auth Admin API](https://supabase.com/docs/reference/javascript/auth-admin-api)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Service Role Key](https://supabase.com/docs/guides/api/api-keys)

