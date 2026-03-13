-- Seed data for Media Trend platform

-- Admin user (password hash for 'admin123' using SHA-256 + salt)
-- Password hash below is SHA-256('admin123' + 'mediatrend-salt-2024')
-- Change this password immediately after first login in production
INSERT INTO users (name_ar, name_en, email, password_hash, role, lang_pref) VALUES
  ('أدمن', 'Admin', 'admin@mediatrend.com', '987e4da27eeec872c691fec289a8947385632074e5a704f176e9748084135fd7', 'admin', 'en')
ON CONFLICT (email) DO NOTHING;

-- Team members
INSERT INTO team_members (name_ar, name_en, role_ar, role_en, department, sort_order) VALUES
  ('أحمد الراشد', 'Ahmed Al-Rashid', 'المؤسس والرئيس التنفيذي', 'CEO & Founder', 'leadership', 1),
  ('سارة حسن', 'Sara Hassan', 'مديرة التقنية', 'CTO', 'engineering', 2),
  ('عمر خليل', 'Omar Khalil', 'مدير التصميم', 'Head of Design', 'design', 3),
  ('ليلى منصور', 'Layla Mansour', 'مديرة التسويق', 'Marketing Director', 'marketing', 4);

-- Partners
INSERT INTO partners (name, logo_url, website, sort_order) VALUES
  ('Shopify', '/icons/partners/shopify.svg', 'https://shopify.com', 1),
  ('Stripe', '/icons/partners/stripe.svg', 'https://stripe.com', 2),
  ('Google Cloud', '/icons/partners/google-cloud.svg', 'https://cloud.google.com', 3),
  ('AWS', '/icons/partners/aws.svg', 'https://aws.amazon.com', 4),
  ('Meta', '/icons/partners/meta.svg', 'https://meta.com', 5),
  ('Vercel', '/icons/partners/vercel.svg', 'https://vercel.com', 6);

-- Blog posts
INSERT INTO blog_posts (slug, title_ar, title_en, excerpt_ar, excerpt_en, content_ar, content_en, cover_image, status, published_at) VALUES
  ('future-ecommerce-mena', 'مستقبل التجارة الإلكترونية في المنطقة', 'The Future of E-Commerce in MENA', 'اكتشف كيف يعيد الذكاء الاصطناعي تشكيل البيع بالتجزئة عبر الإنترنت', 'Exploring how AI and automation are reshaping online retail across MENA.', 'محتوى المقال الكامل...', 'Full article content...', '/images/blog/ecommerce-future.jpg', 'published', NOW()),
  ('building-first-online-store', 'بناء متجرك الأول: دليل شامل', 'Building Your First Online Store: A Complete Guide', 'كل ما تحتاج معرفته عن إطلاق تجارة إلكترونية ناجحة', 'Everything you need to know about launching a successful e-commerce business.', 'محتوى المقال الكامل...', 'Full article content...', '/images/blog/first-store.jpg', 'published', NOW()),
  ('ai-powered-store-creation', 'إنشاء متجر بالذكاء الاصطناعي', 'AI-Powered Store Creation: How It Works', 'اكتشف كيف يساعدك مساعدنا الذكي في بناء متجر احترافي في دقائق', 'Discover how our AI assistant helps you build a professional online store in minutes.', 'محتوى المقال الكامل...', 'Full article content...', '/images/blog/ai-store.jpg', 'published', NOW())
ON CONFLICT (slug) DO NOTHING;

-- Case studies
INSERT INTO case_studies (title_ar, title_en, desc_ar, desc_en, client_name, category, sort_order) VALUES
  ('تحويل تجارة التجزئة الفاخرة', 'Transforming Luxury Retail Online', 'كيف ساعدنا مجموعة كبرى في إطلاق واجهة متجرهم الرقمية بزيادة 300% في المبيعات', 'How we helped a major retail group launch their digital storefront with 300% increase in online sales.', 'Al-Futtaim Group', 'retail', 1),
  ('من المحلي إلى العالمي', 'From Local to Global: Scaling Artisan Goods', 'سوق تقليدي تحول رقمياً ووصل إلى عملاء في 45+ دولة', 'A traditional marketplace went digital and reached customers in 45+ countries.', 'Souk Collective', 'marketplace', 2);

-- Static pages
INSERT INTO pages (slug, title_ar, title_en, content_json, status) VALUES
  ('terms', 'الشروط والأحكام', 'Terms & Conditions', '{"sections": []}', 'published'),
  ('privacy', 'سياسة الخصوصية', 'Privacy Policy', '{"sections": []}', 'published'),
  ('about', 'من نحن', 'About Us', '{"sections": []}', 'published')
ON CONFLICT (slug) DO NOTHING;
