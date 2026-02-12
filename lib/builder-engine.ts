// AI Store Builder - Conversational Question Engine
// This simulates an AI-guided flow with smart branching

export type StoreConfig = {
  storeName: string
  storeNameAr: string
  category: string
  description: string
  descriptionAr: string
  themeColor: string
  currency: string
  country: string
  targetAudience: string
  products: ProductSeed[]
}

export type ProductSeed = {
  nameEn: string
  nameAr: string
  descEn: string
  descAr: string
  price: number
  category: string
  image: string
}

export type BuilderStep = {
  id: string
  question: string
  questionAr: string
  type: "text" | "select" | "multi-select" | "color"
  options?: { value: string; label: string; labelAr: string }[]
  field: keyof StoreConfig | "skip"
  placeholder?: string
  placeholderAr?: string
  validation?: (value: string) => boolean
}

const CATEGORIES = [
  { value: "fashion", label: "Fashion & Apparel", labelAr: "أزياء وملابس" },
  { value: "electronics", label: "Electronics & Tech", labelAr: "إلكترونيات وتقنية" },
  { value: "food", label: "Food & Beverages", labelAr: "أطعمة ومشروبات" },
  { value: "beauty", label: "Beauty & Cosmetics", labelAr: "جمال ومستحضرات تجميل" },
  { value: "home", label: "Home & Living", labelAr: "منزل ومعيشة" },
  { value: "sports", label: "Sports & Fitness", labelAr: "رياضة ولياقة" },
  { value: "books", label: "Books & Education", labelAr: "كتب وتعليم" },
  { value: "other", label: "Other", labelAr: "أخرى" },
]

const COUNTRIES = [
  { value: "SA", label: "Saudi Arabia", labelAr: "المملكة العربية السعودية" },
  { value: "AE", label: "UAE", labelAr: "الإمارات" },
  { value: "EG", label: "Egypt", labelAr: "مصر" },
  { value: "KW", label: "Kuwait", labelAr: "الكويت" },
  { value: "BH", label: "Bahrain", labelAr: "البحرين" },
  { value: "QA", label: "Qatar", labelAr: "قطر" },
  { value: "OM", label: "Oman", labelAr: "عمان" },
  { value: "JO", label: "Jordan", labelAr: "الأردن" },
  { value: "other", label: "Other", labelAr: "أخرى" },
]

const AUDIENCES = [
  { value: "women", label: "Women", labelAr: "نساء" },
  { value: "men", label: "Men", labelAr: "رجال" },
  { value: "youth", label: "Youth (18-25)", labelAr: "شباب (18-25)" },
  { value: "families", label: "Families", labelAr: "عائلات" },
  { value: "businesses", label: "Businesses (B2B)", labelAr: "شركات (B2B)" },
  { value: "everyone", label: "Everyone", labelAr: "الجميع" },
]

const COLORS = [
  { value: "#a3e635", label: "Lime", labelAr: "ليموني" },
  { value: "#8b5cf6", label: "Purple", labelAr: "بنفسجي" },
  { value: "#3b82f6", label: "Blue", labelAr: "أزرق" },
  { value: "#ef4444", label: "Red", labelAr: "أحمر" },
  { value: "#f59e0b", label: "Amber", labelAr: "كهرماني" },
  { value: "#10b981", label: "Emerald", labelAr: "زمردي" },
  { value: "#ec4899", label: "Pink", labelAr: "وردي" },
  { value: "#06b6d4", label: "Cyan", labelAr: "سماوي" },
]

export const builderSteps: BuilderStep[] = [
  {
    id: "store-name",
    question: "What would you like to name your store?",
    questionAr: "ما الاسم الذي تريده لمتجرك؟",
    type: "text",
    field: "storeName",
    placeholder: "e.g., Elegance Fashion",
    placeholderAr: "مثال: أناقة للأزياء",
  },
  {
    id: "store-name-ar",
    question: "What's the Arabic name for your store?",
    questionAr: "ما الاسم العربي لمتجرك؟",
    type: "text",
    field: "storeNameAr",
    placeholder: "مثال: أناقة للأزياء",
  },
  {
    id: "category",
    question: "What type of products will you sell?",
    questionAr: "ما نوع المنتجات التي ستبيعها؟",
    type: "select",
    field: "category",
    options: CATEGORIES,
  },
  {
    id: "country",
    question: "Where is your business based?",
    questionAr: "أين يقع عملك؟",
    type: "select",
    field: "country",
    options: COUNTRIES,
  },
  {
    id: "audience",
    question: "Who is your target audience?",
    questionAr: "من هو جمهورك المستهدف؟",
    type: "select",
    field: "targetAudience",
    options: AUDIENCES,
  },
  {
    id: "description",
    question: "Describe your store in a sentence (we'll use this for your about page).",
    questionAr: "صف متجرك في جملة واحدة (سنستخدمها في صفحة 'من نحن').",
    type: "text",
    field: "description",
    placeholder: "e.g., Premium women's fashion for the modern Arab woman",
    placeholderAr: "مثال: أزياء نسائية فاخرة للمرأة العربية العصرية",
  },
  {
    id: "theme-color",
    question: "Pick a brand color for your store:",
    questionAr: "اختر لوناً لعلامتك التجارية:",
    type: "color",
    field: "themeColor",
    options: COLORS,
  },
]

// Generate AI response messages based on user answers
export function getAIResponse(stepId: string, answer: string): string {
  const responses: Record<string, string[]> = {
    "store-name": [
      `"${answer}" - great name! It has a nice ring to it.`,
      `Love it! "${answer}" sounds very professional.`,
      `"${answer}" is memorable. Great choice!`,
    ],
    "store-name-ar": [
      `Beautiful Arabic name! Bilingual stores perform 40% better in the region.`,
      `Perfect! Having Arabic and English names helps reach more customers.`,
    ],
    category: [
      `Excellent choice! That's one of the fastest-growing categories right now.`,
      `Great market to be in! Let me customize your store for this category.`,
    ],
    country: [
      `Perfect! I'll set up the right currency and shipping options for your region.`,
      `Great! I'll optimize your store for that market.`,
    ],
    audience: [
      `Got it! I'll tailor the store design and tone for your target audience.`,
      `Understanding your audience helps me create a more effective store layout.`,
    ],
    description: [
      `Wonderful description! I'll use this to create compelling copy for your store.`,
      `That's a clear and engaging pitch. Your customers will love it.`,
    ],
    "theme-color": [
      `Beautiful choice! I'll apply this color throughout your store for a cohesive brand look.`,
      `Great eye for color! This will make your store stand out.`,
    ],
  }

  const options = responses[stepId] || ["Got it! Moving on..."]
  return options[Math.floor(Math.random() * options.length)]
}

// Generate sample products based on category
export function generateSampleProducts(category: string, storeName: string): ProductSeed[] {
  const productsByCategory: Record<string, ProductSeed[]> = {
    fashion: [
      { nameEn: "Silk Evening Dress", nameAr: "فستان سهرة حرير", descEn: "Elegant silk evening dress with modern cut", descAr: "فستان سهرة حرير أنيق بقصة عصرية", price: 450, category: "dresses", image: "/images/products/dress-1.jpg" },
      { nameEn: "Leather Handbag", nameAr: "حقيبة يد جلدية", descEn: "Premium Italian leather handbag", descAr: "حقيبة يد من الجلد الإيطالي الفاخر", price: 280, category: "accessories", image: "/images/products/bag-1.jpg" },
      { nameEn: "Cashmere Scarf", nameAr: "شال كشمير", descEn: "Soft cashmere scarf in neutral tones", descAr: "شال كشمير ناعم بألوان محايدة", price: 120, category: "accessories", image: "/images/products/scarf-1.jpg" },
      { nameEn: "Tailored Blazer", nameAr: "بليزر مفصل", descEn: "Classic tailored blazer for all occasions", descAr: "بليزر كلاسيكي مفصل لجميع المناسبات", price: 350, category: "outerwear", image: "/images/products/blazer-1.jpg" },
    ],
    electronics: [
      { nameEn: "Wireless Earbuds Pro", nameAr: "سماعات لاسلكية برو", descEn: "Premium noise-cancelling wireless earbuds", descAr: "سماعات لاسلكية فاخرة بخاصية إلغاء الضوضاء", price: 199, category: "audio", image: "/images/products/earbuds-1.jpg" },
      { nameEn: "Smart Watch Ultra", nameAr: "ساعة ذكية ألترا", descEn: "Advanced fitness and health tracking smartwatch", descAr: "ساعة ذكية متقدمة لتتبع اللياقة والصحة", price: 349, category: "wearables", image: "/images/products/watch-1.jpg" },
      { nameEn: "Portable Charger 20K", nameAr: "شاحن متنقل 20K", descEn: "20000mAh fast-charging portable battery", descAr: "بطارية متنقلة 20000 مللي أمبير شحن سريع", price: 79, category: "accessories", image: "/images/products/charger-1.jpg" },
      { nameEn: "Bluetooth Speaker", nameAr: "مكبر صوت بلوتوث", descEn: "Waterproof portable bluetooth speaker", descAr: "مكبر صوت بلوتوث محمول مقاوم للماء", price: 129, category: "audio", image: "/images/products/speaker-1.jpg" },
    ],
    food: [
      { nameEn: "Premium Coffee Blend", nameAr: "خلطة قهوة فاخرة", descEn: "Artisan roasted Arabic coffee blend", descAr: "خلطة قهوة عربية محمصة بعناية", price: 45, category: "beverages", image: "/images/products/coffee-1.jpg" },
      { nameEn: "Organic Honey Set", nameAr: "مجموعة عسل عضوي", descEn: "Set of 3 premium organic honey varieties", descAr: "مجموعة من 3 أنواع عسل عضوي فاخر", price: 85, category: "honey", image: "/images/products/honey-1.jpg" },
      { nameEn: "Date Gift Box", nameAr: "علبة تمور هدية", descEn: "Luxury assorted dates in premium packaging", descAr: "تمور مشكلة فاخرة في علبة هدايا أنيقة", price: 120, category: "dates", image: "/images/products/dates-1.jpg" },
      { nameEn: "Saffron Premium", nameAr: "زعفران فاخر", descEn: "Pure Iranian saffron, 5g premium grade", descAr: "زعفران إيراني نقي، 5 غرام درجة فاخرة", price: 65, category: "spices", image: "/images/products/saffron-1.jpg" },
    ],
    beauty: [
      { nameEn: "Rose Face Serum", nameAr: "سيروم وجه بالورد", descEn: "Hydrating rose extract face serum", descAr: "سيروم وجه مرطب بخلاصة الورد", price: 89, category: "skincare", image: "/images/products/serum-1.jpg" },
      { nameEn: "Oud Perfume Collection", nameAr: "مجموعة عطور العود", descEn: "Three luxury oud-based fragrances", descAr: "ثلاثة عطور فاخرة بأساس العود", price: 250, category: "fragrances", image: "/images/products/perfume-1.jpg" },
      { nameEn: "Natural Lip Set", nameAr: "مجموعة أحمر شفاه طبيعي", descEn: "Set of 4 natural ingredient lip colors", descAr: "مجموعة من 4 ألوان شفاه بمكونات طبيعية", price: 55, category: "makeup", image: "/images/products/lipset-1.jpg" },
      { nameEn: "Hair Oil Elixir", nameAr: "إكسير زيت الشعر", descEn: "Nourishing argan and jojoba hair oil", descAr: "زيت شعر مغذي بالأرغان والجوجوبا", price: 42, category: "haircare", image: "/images/products/hairoil-1.jpg" },
    ],
  }

  // Default products for categories not explicitly defined
  const defaultProducts: ProductSeed[] = [
    { nameEn: "Premium Product A", nameAr: "منتج فاخر أ", descEn: `Quality product from ${storeName}`, descAr: `منتج عالي الجودة من ${storeName}`, price: 99, category: "general", image: "/images/products/default-1.jpg" },
    { nameEn: "Premium Product B", nameAr: "منتج فاخر ب", descEn: `Best seller from ${storeName}`, descAr: `الأكثر مبيعاً من ${storeName}`, price: 149, category: "general", image: "/images/products/default-2.jpg" },
    { nameEn: "Premium Product C", nameAr: "منتج فاخر ج", descEn: `New arrival at ${storeName}`, descAr: `وصل حديثاً إلى ${storeName}`, price: 79, category: "general", image: "/images/products/default-3.jpg" },
    { nameEn: "Premium Product D", nameAr: "منتج فاخر د", descEn: `Exclusive from ${storeName}`, descAr: `حصري من ${storeName}`, price: 199, category: "general", image: "/images/products/default-4.jpg" },
  ]

  return productsByCategory[category] || defaultProducts
}

// Generate a slug from store name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .substring(0, 50)
}
