# مراجعة مشروع Media Trend — الإصدار 2 (مارس 2026)

## نظرة عامة على المشروع

**Media Trend** هي منصة تجارة إلكترونية مدعومة بالذكاء الاصطناعي تعتمد نموذج "جرّب أولاً"، حيث يمكن للمستخدمين إنشاء متاجر تجريبية عبر محادثة ذكية دون الحاجة للتسجيل، ثم التسجيل وطلب تفعيل الخدمات (المدفوعات، الشحن، التخزين).

- **نموذج الإيرادات**: عمولة فقط (بدون اشتراكات)
- **الأسواق المستهدفة**: الكويت والسعودية (جاهز للتوسع العالمي)
- **اللغات**: عربي (RTL) + إنجليزي

---

## التقنيات المستخدمة

| التقنية | الإصدار | الاستخدام |
|---------|---------|-----------|
| Next.js | 14.2.25 | إطار العمل الأساسي (App Router) |
| React | 19 | واجهة المستخدم |
| TypeScript | 5 | لغة البرمجة |
| Tailwind CSS | v4 | التنسيق |
| Radix UI / shadcn | - | مكونات واجهة المستخدم |
| PostgreSQL | Replit | قاعدة البيانات |
| Zod | 3.25.67 | التحقق من المدخلات |
| pnpm | - | مدير الحزم |

---

## هيكل المشروع

```
AI/
├── app/                    # Next.js App Router
│   ├── api/                # 20 نقطة API
│   │   ├── admin/          # 11 مساراً إدارية
│   │   ├── auth/           # 3 مسارات مصادقة
│   │   ├── portal/         # 3 مسارات بوابة العملاء
│   │   ├── leads/          # التقاط العملاء المحتملين
│   │   ├── stores/         # إنشاء المتاجر
│   │   └── geo/            # تحديد الموقع الجغرافي
│   └── [pages]/            # 25+ صفحة
├── components/             # 76+ مكون React
│   └── ui/                 # 50+ مكون shadcn/ui
├── lib/                    # المكتبات الأساسية
│   ├── db.ts               # الاتصال بقاعدة البيانات + الأنواع
│   ├── auth.ts             # نظام المصادقة والجلسات
│   ├── rate-limit.ts       # تحديد معدل الطلبات
│   ├── validations/admin.ts # مخططات Zod للإدارة
│   ├── builder-engine.ts   # محرك بناء المتاجر بالذكاء الاصطناعي
│   └── i18n.tsx            # نظام اللغات
├── public/                 # الأصول الثابتة
└── middleware.ts           # حماية المسارات وترويسات الأمان
```

**قاعدة البيانات**: 13 جدول — users, stores, products, leads, tickets, support_tickets, pages, blog_posts, partners, team_members, case_studies, audit_logs, **sessions** (جديد)

---

## ملخص تنفيذي

| الفئة | العدد | التقييم |
|--------|-------|---------|
| مشاكل حرجة متبقية | 2 | 🔴 يجب إصلاحها فوراً |
| مشاكل عالية الخطورة | 4 | 🟠 إصلاح ضمن أسبوع |
| مشاكل متوسطة الخطورة | 5 | 🟡 إصلاح ضمن شهر |
| مشاكل جودة الكود | 4 | 🔵 تحسين تدريجي |
| مشاكل مُصلحة منذ المراجعة السابقة | 10 | ✅ |

---

## نقاط القوة

### 1. بنية منظمة جيداً
- استخدام Next.js App Router بشكل صحيح مع فصل واضح بين الصفحات والمكونات وواجهات API
- نظام أنواع TypeScript شامل لقاعدة البيانات (`lib/db.ts`)
- مكتبة مكونات غنية (76+ مكون) مبنية على Radix UI

### 2. دعم ثنائي اللغة متكامل
- نظام i18n مبني على React Context مع دعم كامل لـ RTL
- جميع المكونات تدعم دالة الترجمة `t(en, ar)`

### 3. استعلامات SQL آمنة
- جميع الاستعلامات تستخدم Parameterized Queries — لا تجميع نصي مباشر (حماية كاملة من SQL Injection)

### 4. نظام مصادقة محسّن
- PBKDF2 بـ 310,000 تكرار (الحد الأدنى الموصى به من OWASP)
- رمز session عشوائي 32-بايت باستخدام `crypto.getRandomValues()`
- مخزن في قاعدة البيانات بعد التجزئة (SHA-256) للتحقق
- غلافات `withAdminAuth()` و`withAuth()` لحماية نقاط API

### 5. ترويسات الأمان
- CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy مُضافة في كلٍّ من `middleware.ts` و`next.config.mjs`

### 6. التحقق من المدخلات بـ Zod
- جميع مسارات API الإدارية تستخدم مخططات Zod للتحقق من المدخلات (`lib/validations/admin.ts`)

---

## القسم الأول: المشاكل التي تم إصلاحها منذ المراجعة السابقة ✅

فيما يلي المشاكل التي كانت موثّقة في الإصدار الأول من المراجعة وقد تم إصلاحها بالكامل:

| # | المشكلة السابقة | الحالة | الدليل |
|---|---|---|---|
| 1 | كلمة المرور المبرمجة `admin123` | ✅ مُصلح | نقطة تسجيل الدخول تستخدم `verifyPassword()` حصراً |
| 2 | تخزين كلمات المرور كنص صريح في signup | ✅ مُصلح | `app/api/auth/signup/route.ts:46` — يستدعي `hashPassword()` قبل INSERT |
| 3 | غياب المصادقة على admin APIs | ✅ مُصلح | جميع المسارات الإدارية تستخدم `withAdminAuth()` |
| 4 | خوارزمية SHA-256 الضعيفة كالخيار الوحيد | ✅ مُصلح | PBKDF2 بـ 310,000 تكرار هو الخيار الافتراضي (`lib/auth.ts:38-64`) |
| 5 | غياب تحديد معدل الطلبات على تسجيل الدخول | ✅ مُصلح | `loginLimiter` — 10 محاولات / 15 دقيقة (`app/api/auth/login/route.ts:6`) |
| 6 | غياب تحديد معدل الطلبات على إنشاء الحسابات | ✅ مُصلح | `signupLimiter` — 5 محاولات / ساعة |
| 7 | استخدام `Math.random()` لتوليد Session ID | ✅ مُصلح | `crypto.getRandomValues()` — `lib/auth.ts:9-13` |
| 8 | الـ Middleware لا يتحقق من صلاحية الجلسة أو الدور | ✅ مُصلح | يتحقق من `mt-session` و`user_role`؛ الجلسة تُتحقق منها بـ DB في `getSession()` |
| 9 | غياب ترويسات الأمان HTTP | ✅ مُصلح | 7 ترويسات أمان في `middleware.ts:33-45` و`next.config.mjs:6-21` |
| 10 | تعطيل ESLint وTypeScript في البناء | ✅ مُصلح | `next.config.mjs` الحالي لا يحتوي `ignoreBuildErrors` |
| 11 | اعتماد `vue-router` غير المستخدم | ✅ مُصلح | غير موجود في `package.json` الحالي |

---

## القسم الثاني: المشاكل الحرجة المتبقية 🔴

### 1. SSL معطّل في اتصال قاعدة البيانات
**الملف**: `lib/db.ts:4`
**الخطورة**: حرجة

```typescript
export const sql = postgres(process.env.DATABASE_URL!, {
  ssl: false,  // ⚠️ الاتصال بقاعدة البيانات غير مشفّر
  max: 10,
})
```

اتصال قاعدة البيانات يتم بدون تشفير TLS/SSL، مما يعرّض بيانات المستخدمين (بما فيها كلمات المرور المجزأة) للاعتراض في حال كان الاتصال عبر شبكة غير موثوقة.

**الإصلاح المقترح**:
```typescript
export const sql = postgres(process.env.DATABASE_URL!, {
  ssl: process.env.NODE_ENV === "production" ? "require" : false,
  max: 10,
})
```

---

### 2. غياب تحديد معدل الطلبات على مسارات الإدارة
**الملفات**: جميع الملفات في `app/api/admin/`
**الخطورة**: حرجة

`lib/rate-limit.ts` موجود ويُستخدم في مسارات المصادقة، لكنه **غير مُستخدم في أيٍّ من المسارات الإدارية الـ 11**. هذا يعني أن أي أدمن يمكنه إرسال آلاف الطلبات في الثانية على نقاط مثل:
- `GET /api/admin/users` — استخراج قائمة المستخدمين كاملة
- `GET /api/admin/stats` — استعلامات ثقيلة على قاعدة البيانات
- `DELETE /api/admin/blog` — حذف متعدد سريع بدون قيود

**الإصلاح المقترح**: استيراد `rateLimit` من `lib/rate-limit.ts` في كل مسار إداري وتطبيق حد معقول (مثلاً 200 طلب / 15 دقيقة لكل IP).

---

## القسم الثالث: المشاكل عالية الخطورة 🟠

### 3. تصعيد الصلاحيات — مخطط الدور لا يتطابق مع قاعدة البيانات
**الملفات**: `lib/validations/admin.ts:173-176` و`app/api/admin/users/route.ts:34-65`
**الخطورة**: عالية

```typescript
// lib/validations/admin.ts:173-176
export const updateUserRoleSchema = z.object({
  id: idRequired,
  role: z.enum(["user", "admin", "moderator"], { required_error: "Role is required" }),
});
```

مشكلتان متداخلتان:

**أ) عدم التطابق مع قاعدة البيانات**: النوع `User` في `lib/db.ts:17` يُعرِّف الدور كـ `"admin" | "customer"`، بينما المخطط يسمح بـ `"user"` و`"moderator"` — وهي قيم غير صالحة في قاعدة البيانات.

**ب) لا قيود على منح دور أدمن**: أي أدمن يمكنه ترقية أي مستخدم إلى "admin" بدون:
- فحص هوية الأدمن الطالب
- تأكيد إضافي
- إشعار للمستخدم المُرقَّى
- سجل يتضمن الدور القديم قبل التغيير

**الإصلاح المقترح**:
- تصحيح المخطط: `z.enum(["admin", "customer"])`
- إضافة شرط: منع تغيير الدور إلى "admin" إلا من حساب super-admin مخصص
- تسجيل الدور القديم في `details_json`: `{ from: oldRole, to: role }`

---

### 4. تعديل نسبة العمولة لا يُسجَّل في سجل التدقيق
**الملف**: `app/api/admin/stores/route.ts:63-65`
**الخطورة**: عالية

```typescript
// السطر 63-65: commission_rate_percent مُحدَّث في DB لكن غائب عن details_json
await sql`
  INSERT INTO audit_logs (admin_id, action, entity_type, entity_id, details_json)
  VALUES (${admin.id}, 'update', 'store', ${id}, ${JSON.stringify({ status, plan, payments_status, shipping_status, warehousing_status })})
`;
```

`commission_rate_percent` يُعدَّل في قاعدة البيانات (السطر 50) لكن **لا يُسجَّل** في `details_json` ضمن سجل التدقيق. هذا يعني أنه لا يمكن تتبع من غيّر نسبة العمولة، ومتى، وبكم.

**الإصلاح المقترح**: إضافة `commission_rate_percent` إلى `details_json`:
```typescript
${JSON.stringify({ status, plan, commission_rate_percent, payments_status, shipping_status, warehousing_status })}
```

---

### 5. كوكي `user_role` قابل للقراءة بواسطة JavaScript
**الملف**: `app/api/auth/login/route.ts:88-94`
**الخطورة**: عالية

```typescript
response.cookies.set("user_role", user.role as string, {
  httpOnly: false,  // ⚠️ قابل للقراءة بـ JavaScript
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  expires: expiresAt,
});
```

الـ middleware يستخدم هذا الكوكي للتحقق من دور الأدمن (`middleware.ts:7,19`). بما أن `httpOnly: false`، يمكن لأي سكريبت XSS قراءة دور المستخدم واستخدامه للتحايل. التحقق الفعلي يحدث server-side، لكن كشف الدور يُيسِّر هجمات XSS المستهدفة.

**الإصلاح المقترح**: استخدام `httpOnly: true` وتمرير الدور عبر استجابة JSON فقط، مع إعادة هيكلة الـ middleware ليحصل على الدور من DB مباشرة.

---

### 6. سياسة أمان المحتوى (CSP) غير فعّالة
**الملفات**: `middleware.ts:43` و`next.config.mjs:16`
**الخطورة**: عالية

```
script-src 'self' 'unsafe-inline' 'unsafe-eval'
```

- **`'unsafe-inline'`**: يسمح لأي سكريبت مُدرَج مباشرة بالتنفيذ — يُلغي الحماية الرئيسية لـ CSP من هجمات XSS
- **`'unsafe-eval'`**: يسمح بـ `eval()` وما شابهه — يُمكِّن تنفيذ الكود الديناميكي

**الإصلاح المقترح**: الانتقال إلى nonces المولّدة لكل طلب للسكريبتات الشرعية وإزالة كلا الخيارين. يتطلب مراجعة جميع المكونات التي تستخدم سكريبتات مُدرَجة مباشرة.

---

## القسم الرابع: المشاكل متوسطة الخطورة 🟡

### 7. استخدام `z.any()` في مخططات التحقق
**الملف**: `lib/validations/admin.ts`
**الخطورة**: متوسطة

| الحقل | السطر | المخطط الحالي | المخطط المقترح |
|---|---|---|---|
| `content_json` (createPageSchema) | 18 | `z.any().optional()` | `z.record(z.unknown()).optional()` |
| `content_json` (updatePageSchema) | 31 | `z.any().optional()` | `z.record(z.unknown()).optional()` |
| `selected_activations` | 44 | `z.any().optional()` | `z.array(z.string()).optional()` |
| `payload_json` | 45 | `z.any().optional()` | `z.record(z.unknown()).optional()` |
| `gallery` (createCaseSchema) | 121 | `z.any().optional()` | `z.array(z.string().url()).optional()` |
| `gallery` (updateCaseSchema) | 134 | `z.any().optional()` | `z.array(z.string().url()).optional()` |

استخدام `z.any()` يتجاوز التحقق كلياً ويُمكِّن تخزين بيانات خبيثة أو هيكل JSON غير متوقع.

---

### 8. دعم خوارزمية SHA-256 القديمة بملح ثابت
**الملف**: `lib/auth.ts:96-103`
**الخطورة**: متوسطة

```typescript
// Oldest legacy format: SHA-256 with static salt
const encoder = new TextEncoder()
const data = encoder.encode(password + "mediatrend-salt-2024")
const hash = await crypto.subtle.digest("SHA-256", data)
```

هذا المسار لا يزال نشطاً. أي حساب قديم يستخدم هذه الصيغة معرّض للكسر بسهولة (ملح ثابت ومعروف، SHA-256 سريع). رغم أن الكود يُعيد التجزئة تلقائياً عند تسجيل الدخول (`login/route.ts:51-54`)، إلا أن الحسابات التي لم تسجّل دخولاً منذ الترقية لا تزال محمية بهذه الصيغة الضعيفة.

**الإصلاح المقترح**: تشغيل سكريبت ترحيل يُجبر هؤلاء المستخدمين على إعادة تعيين كلمة المرور، ثم إزالة مسار التحقق القديم.

---

### 9. الحذف النهائي لمقالات المدونة بدون إمكانية الاسترداد
**الملف**: `app/api/admin/blog/route.ts:110`
**الخطورة**: متوسطة

```typescript
const result = await sql`DELETE FROM blog_posts WHERE id = ${id} RETURNING id`;
```

الحذف نهائي وفوري. المقالات المنشورة تُحذف بشكل دائم دون إمكانية استرداد.

**الإصلاح المقترح**: إضافة عمود `deleted_at TIMESTAMP WITH TIME ZONE` إلى جدول `blog_posts`، وتغيير DELETE إلى `UPDATE blog_posts SET deleted_at = NOW()`.

---

### 10. سجل التدقيق يكشف جميع النشاطات لأي أدمن
**الملف**: `app/api/admin/audit/route.ts:12-16`
**الخطورة**: متوسطة

```typescript
const logs = await sql`
  SELECT * FROM audit_logs
  ORDER BY created_at DESC
  LIMIT ${limit} OFFSET ${offset}
`;
```

أي أدمن يمكنه رؤية كامل نشاطات جميع الأدمناء الآخرين. لا يوجد فلترة بحسب الأدمن الطالب أو نوع الكيان.

**الإصلاح المقترح**: إضافة فلتر بحسب `admin_id` أو إتاحة الرؤية الشاملة للأدمناء ذوي صلاحيات عالية فقط.

---

### 11. الخادم يستمع على جميع الواجهات (0.0.0.0)
**الملف**: `package.json:7,9`
**الخطورة**: متوسطة (حسب بيئة التشغيل)

```json
"dev":   "next dev -p 5000 -H 0.0.0.0",
"start": "next start -p 5000 -H 0.0.0.0"
```

في البيئات المُستضافة خلف reverse proxy (مثل Replit) هذا مقبول، لكن في النشر الذاتي يُعرِّض الخادم لكل الشبكات.

**الإصلاح المقترح**: في النشر الذاتي، تغيير إلى `127.0.0.1` وترك الـ reverse proxy يتولى التوجيه.

---

## القسم الخامس: مشاكل جودة الكود 🔵

### 12. غياب الاختبارات كلياً
**الخطورة**: عالية (من منظور الجودة)

- لا يوجد أي ملفات اختبار (`.test.ts`, `.spec.ts`)
- لا يوجد إعداد لـ Jest أو Vitest أو أي إطار اختبار
- لا يوجد سكريبت `test` في `package.json`

الكود الحساس (نظام المصادقة، محرك البناء بالذكاء الاصطناعي، منطق API) يعمل دون أي شبكة أمان.

**التوصية**: Vitest + Testing Library للاختبارات الوحدوية والتكاملية. البدء بملفات `lib/auth.ts` و`lib/builder-engine.ts`.

---

### 13. غياب CI/CD
**الخطورة**: متوسطة (من منظور الجودة)

- لا يوجد GitHub Actions أو أي أداة CI/CD
- لا يوجد pre-commit hooks
- لا يوجد فحص تلقائي للكود قبل الدمج

**التوصية**: إنشاء `.github/workflows/ci.yml` يشمل: `lint` + `type-check` + `test` عند كل Pull Request.

---

### 14. `console.log` في كود الإنتاج
**الخطورة**: منخفضة

تم العثور على `console.log` في عدد من ملفات المكونات وصفحات الواجهة. يُعرِّض هذا معلومات داخلية في بيئة الإنتاج ويُثقل الأداء.

**التوصية**: حذف عبارات `console.log` غير الضرورية أو استبدالها بنظام تسجيل منظم.

---

### 15. غياب README
**الخطورة**: منخفضة

لا يوجد ملف `README.md` للمشروع — يوجد فقط `replit.md` كدليل نشر. المطورون الجدد لا يجدون نقطة بداية واضحة.

**التوصية**: إنشاء `README.md` يشمل: وصف المشروع، خطوات التثبيت، متغيرات البيئة المطلوبة، هيكل المشروع.

---

## ملخص التقييم المحدَّث

| الفئة | التقييم | ملاحظات |
|--------|---------|---------|
| هيكل المشروع | ممتاز | تنظيم احترافي مع فصل واضح للمسؤوليات |
| واجهة المستخدم | ممتاز | 76+ مكون مع دعم كامل لـ RTL |
| قاعدة البيانات | جيد | استعلامات آمنة — لكن SSL معطّل |
| المصادقة والجلسات | جيد | PBKDF2 + تحقق من DB — بعض الثغرات المتبقية |
| المصادقة في API | جيد | `withAdminAuth` على جميع المسارات — يحتاج rate limiting |
| التحقق من المدخلات | متوسط | Zod مُستخدم — لكن `z.any()` في حقول حرجة |
| الاختبارات | غير موجود | لا يوجد أي اختبارات |
| CI/CD | غير موجود | لا يوجد أي إعداد |
| الأداء | متوسط | صور غير محسّنة (`unoptimized: true`) |
| التوثيق | ضعيف | لا README، لا توثيق تقني |

---

## خارطة الطريق للإصلاح

### المرحلة 1 — فورية (أيام)
1. تفعيل SSL في `lib/db.ts` — سطر واحد
2. إضافة `commission_rate_percent` لسجل التدقيق في `stores/route.ts`
3. تصحيح مخطط `updateUserRoleSchema` ليتطابق مع قيم DB

### المرحلة 2 — قصيرة المدى (أسبوع)
4. إضافة rate limiting على جميع مسارات `/api/admin/*`
5. تغيير `user_role` cookie إلى `httpOnly: true`
6. استبدال `z.any()` بمخططات Zod محددة في `validations/admin.ts`

### المرحلة 3 — متوسطة المدى (شهر)
7. تطبيق soft delete لمقالات المدونة
8. إضافة فلترة لسجل التدقيق بحسب الأدمن
9. وضع خطة لإيقاف دعم SHA-256 القديم
10. مراجعة CSP والانتقال التدريجي من `unsafe-inline`

### المرحلة 4 — جودة وبنية تحتية (ربع سنة)
11. إضافة إطار اختبار (Vitest) وكتابة اختبارات للمنطق الحساس
12. إعداد GitHub Actions للـ CI/CD
13. إنشاء README.md
14. إزالة `console.log` من كود الإنتاج
