// AI Store Builder - Conversational Question Engine
// Types are centralized in @/types
import type { StoreConfig, ProductSeed, BuilderStep } from "@/types"


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

// Generate AI response messages based on user answers (bilingual)
export function getAIResponse(stepId: string, answer: string, isAr: boolean = false): string {
  const responses: Record<string, { en: string[]; ar: string[] }> = {
    "store-name": {
      en: [
        `"${answer}" - great name! It has a nice ring to it.`,
        `Love it! "${answer}" sounds very professional.`,
        `"${answer}" is memorable. Great choice!`,
      ],
      ar: [
        `"${answer}" - اسم رائع! له وقع جميل.`,
        `أحببته! "${answer}" يبدو احترافياً جداً.`,
        `"${answer}" اسم مميز. اختيار ممتاز!`,
      ],
    },
    "store-name-ar": {
      en: [
        `Beautiful Arabic name! Bilingual stores perform 40% better in the region.`,
        `Perfect! Having Arabic and English names helps reach more customers.`,
      ],
      ar: [
        `اسم عربي جميل! المتاجر ثنائية اللغة تحقق أداءً أفضل بنسبة 40%.`,
        `ممتاز! وجود اسم عربي وإنجليزي يساعد في الوصول لعملاء أكثر.`,
      ],
    },
    category: {
      en: [
        `Excellent choice! That's one of the fastest-growing categories right now.`,
        `Great market to be in! Let me customize your store for this category.`,
      ],
      ar: [
        `اختيار ممتاز! هذا من أسرع القطاعات نمواً حالياً.`,
        `سوق رائع! دعني أخصص متجرك لهذا القطاع.`,
      ],
    },
    country: {
      en: [
        `Perfect! I'll set up the right currency and shipping options for your region.`,
        `Great! I'll optimize your store for that market.`,
      ],
      ar: [
        `ممتاز! سأضبط العملة وخيارات الشحن المناسبة لمنطقتك.`,
        `رائع! سأحسّن متجرك لهذا السوق.`,
      ],
    },
    audience: {
      en: [
        `Got it! I'll tailor the store design and tone for your target audience.`,
        `Understanding your audience helps me create a more effective store layout.`,
      ],
      ar: [
        `فهمت! سأصمم المتجر بما يناسب جمهورك المستهدف.`,
        `معرفة جمهورك تساعدني في تصميم متجر أكثر فعالية.`,
      ],
    },
    description: {
      en: [
        `Wonderful description! I'll use this to create compelling copy for your store.`,
        `That's a clear and engaging pitch. Your customers will love it.`,
      ],
      ar: [
        `وصف رائع! سأستخدمه لإنشاء محتوى جذاب لمتجرك.`,
        `عرض واضح وجذاب. عملاؤك سيحبونه.`,
      ],
    },
    "theme-color": {
      en: [
        `Beautiful choice! I'll apply this color throughout your store for a cohesive brand look.`,
        `Great eye for color! This will make your store stand out.`,
      ],
      ar: [
        `اختيار جميل! سأطبق هذا اللون في جميع أنحاء متجرك لمظهر متناسق.`,
        `ذوق رفيع في اختيار الألوان! سيجعل متجرك مميزاً.`,
      ],
    },
  }

  const stepResponses = responses[stepId]
  if (!stepResponses) return isAr ? "فهمت! لننتقل للخطوة التالية..." : "Got it! Moving on..."
  const options = isAr ? stepResponses.ar : stepResponses.en
  return options[Math.floor(Math.random() * options.length)]
}

// Generate sample products based on category
export function generateSampleProducts(category: string, storeName: string): ProductSeed[] {
  const productsByCategory: Record<string, ProductSeed[]> = {
    fashion: [
      { nameEn: "Silk Evening Dress", nameAr: "فستان سهرة حرير", descEn: "Elegant silk evening dress with modern cut", descAr: "فستان سهرة حرير أنيق بقصة عصرية", price: 450, category: "dresses", image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80" },
      { nameEn: "Leather Handbag", nameAr: "حقيبة يد جلدية", descEn: "Premium Italian leather handbag", descAr: "حقيبة يد من الجلد الإيطالي الفاخر", price: 280, category: "accessories", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80" },
      { nameEn: "Cashmere Scarf", nameAr: "شال كشمير", descEn: "Soft cashmere scarf in neutral tones", descAr: "شال كشمير ناعم بألوان محايدة", price: 120, category: "accessories", image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80" },
      { nameEn: "Tailored Blazer", nameAr: "بليزر مفصل", descEn: "Classic tailored blazer for all occasions", descAr: "بليزر كلاسيكي مفصل لجميع المناسبات", price: 350, category: "outerwear", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80" },
    ],
    electronics: [
      { nameEn: "Wireless Earbuds Pro", nameAr: "سماعات لاسلكية برو", descEn: "Premium noise-cancelling wireless earbuds", descAr: "سماعات لاسلكية فاخرة بخاصية إلغاء الضوضاء", price: 199, category: "audio", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80" },
      { nameEn: "Smart Watch Ultra", nameAr: "ساعة ذكية ألترا", descEn: "Advanced fitness and health tracking smartwatch", descAr: "ساعة ذكية متقدمة لتتبع اللياقة والصحة", price: 349, category: "wearables", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80" },
      { nameEn: "Portable Charger 20K", nameAr: "شاحن متنقل 20K", descEn: "20000mAh fast-charging portable battery", descAr: "بطارية متنقلة 20000 مللي أمبير شحن سريع", price: 79, category: "accessories", image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80" },
      { nameEn: "Bluetooth Speaker", nameAr: "مكبر صوت بلوتوث", descEn: "Waterproof portable bluetooth speaker", descAr: "مكبر صوت بلوتوث محمول مقاوم للماء", price: 129, category: "audio", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80" },
    ],
    food: [
      { nameEn: "Premium Coffee Blend", nameAr: "خلطة قهوة فاخرة", descEn: "Artisan roasted Arabic coffee blend", descAr: "خلطة قهوة عربية محمصة بعناية", price: 45, category: "beverages", image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80" },
      { nameEn: "Organic Honey Set", nameAr: "مجموعة عسل عضوي", descEn: "Set of 3 premium organic honey varieties", descAr: "مجموعة من 3 أنواع عسل عضوي فاخر", price: 85, category: "honey", image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80" },
      { nameEn: "Date Gift Box", nameAr: "علبة تمور هدية", descEn: "Luxury assorted dates in premium packaging", descAr: "تمور مشكلة فاخرة في علبة هدايا أنيقة", price: 120, category: "dates", image: "https://images.unsplash.com/photo-1611003229641-7e343593e5cf?w=600&q=80" },
      { nameEn: "Saffron Premium", nameAr: "زعفران فاخر", descEn: "Pure Iranian saffron, 5g premium grade", descAr: "زعفران إيراني نقي، 5 غرام درجة فاخرة", price: 65, category: "spices", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80" },
    ],
    beauty: [
      { nameEn: "Rose Face Serum", nameAr: "سيروم وجه بالورد", descEn: "Hydrating rose extract face serum", descAr: "سيروم وجه مرطب بخلاصة الورد", price: 89, category: "skincare", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80" },
      { nameEn: "Oud Perfume Collection", nameAr: "مجموعة عطور العود", descEn: "Three luxury oud-based fragrances", descAr: "ثلاثة عطور فاخرة بأساس العود", price: 250, category: "fragrances", image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80" },
      { nameEn: "Natural Lip Set", nameAr: "مجموعة أحمر شفاه طبيعي", descEn: "Set of 4 natural ingredient lip colors", descAr: "مجموعة من 4 ألوان شفاه بمكونات طبيعية", price: 55, category: "makeup", image: "https://images.unsplash.com/photo-1586495777744-4e6232bf2176?w=600&q=80" },
      { nameEn: "Hair Oil Elixir", nameAr: "إكسير زيت الشعر", descEn: "Nourishing argan and jojoba hair oil", descAr: "زيت شعر مغذي بالأرغان والجوجوبا", price: 42, category: "haircare", image: "https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=600&q=80" },
    ],
    home: [
      { nameEn: "Scented Candle Set", nameAr: "مجموعة شموع معطرة", descEn: "Luxury soy wax scented candles set of 3", descAr: "مجموعة شموع فاخرة من الشمع النباتي 3 قطع", price: 75, category: "decor", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80" },
      { nameEn: "Ceramic Vase", nameAr: "مزهرية سيراميك", descEn: "Handcrafted ceramic vase in earth tones", descAr: "مزهرية سيراميك يدوية الصنع بألوان ترابية", price: 95, category: "decor", image: "https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=600&q=80" },
      { nameEn: "Linen Throw Blanket", nameAr: "بطانية كتان", descEn: "Soft linen throw blanket for sofa or bed", descAr: "بطانية كتان ناعمة للأريكة أو السرير", price: 130, category: "textiles", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80" },
      { nameEn: "Wooden Serving Board", nameAr: "لوح تقديم خشبي", descEn: "Premium acacia wood serving board", descAr: "لوح تقديم فاخر من خشب الأكاسيا", price: 60, category: "kitchen", image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&q=80" },
    ],
    sports: [
      { nameEn: "Yoga Mat Pro", nameAr: "حصيرة يوغا برو", descEn: "Non-slip professional yoga mat 6mm", descAr: "حصيرة يوغا احترافية مانعة للانزلاق 6 مم", price: 85, category: "yoga", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80" },
      { nameEn: "Resistance Bands Set", nameAr: "مجموعة أشرطة مقاومة", descEn: "Set of 5 resistance bands for full body workout", descAr: "مجموعة من 5 أشرطة مقاومة لتمرين الجسم كامل", price: 45, category: "fitness", image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&q=80" },
      { nameEn: "Running Hydration Vest", nameAr: "سترة ترطيب للجري", descEn: "Lightweight hydration vest with 2L bladder", descAr: "سترة ترطيب خفيفة مع خزان 2 لتر", price: 120, category: "running", image: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&q=80" },
      { nameEn: "Gym Duffel Bag", nameAr: "حقيبة جيم", descEn: "Large capacity sports duffel bag with shoe compartment", descAr: "حقيبة رياضية واسعة مع حجرة للأحذية", price: 95, category: "accessories", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80" },
    ],
    books: [
      { nameEn: "Business Strategy Collection", nameAr: "مجموعة استراتيجية الأعمال", descEn: "5-book collection on modern business strategy", descAr: "مجموعة من 5 كتب في استراتيجية الأعمال الحديثة", price: 120, category: "business", image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&q=80" },
      { nameEn: "Arabic Literature Anthology", nameAr: "أنثولوجيا الأدب العربي", descEn: "Curated collection of modern Arabic literature", descAr: "مجموعة مختارة من الأدب العربي الحديث", price: 85, category: "literature", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80" },
      { nameEn: "Self Development Bundle", nameAr: "حزمة التطوير الذاتي", descEn: "3 bestselling self-development books", descAr: "3 كتب تطوير ذاتي من الأكثر مبيعاً", price: 75, category: "self-help", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80" },
      { nameEn: "Children's Story Box", nameAr: "صندوق قصص أطفال", descEn: "Monthly box of 4 curated children's books", descAr: "صندوق شهري من 4 قصص أطفال مختارة", price: 60, category: "children", image: "https://images.unsplash.com/photo-1560089000-7433a4ebbd64?w=600&q=80" },
    ],
  }

  // Default products for categories not explicitly defined
  const defaultProducts: ProductSeed[] = [
    { nameEn: "Premium Product A", nameAr: "منتج فاخر أ", descEn: `Quality product from ${storeName}`, descAr: `منتج عالي الجودة من ${storeName}`, price: 99, category: "general", image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80" },
    { nameEn: "Premium Product B", nameAr: "منتج فاخر ب", descEn: `Best seller from ${storeName}`, descAr: `الأكثر مبيعاً من ${storeName}`, price: 149, category: "general", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80" },
    { nameEn: "Premium Product C", nameAr: "منتج فاخر ج", descEn: `New arrival at ${storeName}`, descAr: `وصل حديثاً إلى ${storeName}`, price: 79, category: "general", image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80" },
    { nameEn: "Premium Product D", nameAr: "منتج فاخر د", descEn: `Exclusive from ${storeName}`, descAr: `حصري من ${storeName}`, price: 199, category: "general", image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80" },
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
