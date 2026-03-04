# Media Trend — منصة التجارة الإلكترونية الذكية

منصة تجارة إلكترونية مدعومة بالذكاء الاصطناعي تعتمد نموذج "جرّب أولاً"، حيث يمكن للمستخدمين إنشاء متاجر تجريبية عبر محادثة ذكية دون الحاجة للتسجيل المسبق.

- **نموذج الإيرادات**: عمولة فقط (بدون اشتراكات)
- **الأسواق**: الكويت والسعودية (قابل للتوسع العالمي)
- **اللغات**: عربي (RTL) + إنجليزي

## التقنيات

| التقنية | الإصدار |
|---------|---------|
| Next.js | 14.2.25 (App Router) |
| React | 19 |
| TypeScript | 5 |
| Tailwind CSS | v4 |
| PostgreSQL | — |
| Zod | 3.25.67 |
| pnpm | — |

## متطلبات التشغيل

- Node.js 20+
- pnpm
- PostgreSQL database

## التثبيت

```bash
# تثبيت الاعتماديات
pnpm install

# تشغيل سكريبتات قاعدة البيانات بالترتيب
psql $DATABASE_URL -f scripts/001-create-tables.sql
psql $DATABASE_URL -f scripts/002-seed-data.sql
psql $DATABASE_URL -f scripts/003-create-sessions.sql
psql $DATABASE_URL -f scripts/004-soft-delete-blog.sql
psql $DATABASE_URL -f scripts/005-deprecate-legacy-passwords.sql

# تشغيل بيئة التطوير
pnpm dev
```

## متغيرات البيئة

أنشئ ملف `.env.local` في جذر المشروع:

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
NODE_ENV=development
```

## الأوامر

```bash
pnpm dev        # تشغيل خادم التطوير على :5000
pnpm build      # بناء الإنتاج
pnpm start      # تشغيل بناء الإنتاج
pnpm lint       # فحص الكود
pnpm test       # تشغيل الاختبارات
pnpm test:watch # الاختبارات في وضع المراقبة
```

## هيكل المشروع

```
AI/
├── app/                    # Next.js App Router
│   ├── api/                # 20 نقطة API
│   │   ├── admin/          # 11 مساراً إدارية (محمية بـ withAdminAuth)
│   │   ├── auth/           # تسجيل الدخول / التسجيل / الخروج
│   │   ├── portal/         # بوابة العملاء
│   │   ├── leads/          # العملاء المحتملون
│   │   ├── stores/         # إنشاء المتاجر
│   │   └── geo/            # تحديد الموقع
│   └── [pages]/            # 25+ صفحة
├── components/             # 76+ مكون React
│   └── ui/                 # مكونات shadcn/ui
├── lib/                    # المكتبات الأساسية
│   ├── db.ts               # الاتصال بـ PostgreSQL والأنواع
│   ├── auth.ts             # المصادقة والجلسات (PBKDF2)
│   ├── rate-limit.ts       # تحديد معدل الطلبات
│   ├── validations/        # مخططات Zod
│   ├── builder-engine.ts   # محرك البناء بالذكاء الاصطناعي
│   └── i18n.tsx            # نظام الترجمة
├── scripts/                # سكريبتات قاعدة البيانات
│   ├── 001-create-tables.sql
│   ├── 002-seed-data.sql
│   ├── 003-create-sessions.sql
│   ├── 004-soft-delete-blog.sql
│   └── 005-deprecate-legacy-passwords.sql
├── .github/workflows/      # GitHub Actions CI/CD
└── middleware.ts           # حماية المسارات وترويسات الأمان
```

## الأمان

- **المصادقة**: PBKDF2 بـ 310,000 تكرار (OWASP recommended)
- **الجلسات**: رمز عشوائي 32-بايت مخزّن مجزّأً في قاعدة البيانات
- **SQL**: Parameterized Queries فقط — لا حقن SQL
- **Rate Limiting**: على جميع مسارات المصادقة والإدارة
- **ترويسات الأمان**: CSP, HSTS, X-Frame-Options, X-Content-Type-Options
- **التحقق**: Zod schemas على جميع نقاط API
