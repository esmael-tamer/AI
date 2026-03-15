// AI Store Builder - Conversational Question Engine
// Types are centralized in @/types
import type { StoreConfig, ProductSeed, BuilderStep } from "@/types"


const CATEGORIES = [
  { value: "perfumes", label: "Perfumes & Fragrances", labelAr: "عطور وبخور" },
  { value: "fashion", label: "Fashion & Apparel", labelAr: "ملابس وأزياء" },
  { value: "shoes", label: "Shoes & Footwear", labelAr: "أحذية" },
  { value: "skincare", label: "Skincare & Care", labelAr: "عناية بالبشرة" },
  { value: "beauty", label: "Beauty & Makeup", labelAr: "مكياج وجمال" },
  { value: "electronics", label: "Electronics & Tech", labelAr: "إلكترونيات وتقنية" },
  { value: "food", label: "Food & Beverages", labelAr: "أطعمة ومشروبات" },
  { value: "home", label: "Home & Living", labelAr: "منزل ومعيشة" },
  { value: "sports", label: "Sports & Fitness", labelAr: "رياضة ولياقة" },
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
  { value: "#b8860b", label: "Gold", labelAr: "ذهبي" },
  { value: "#8b5cf6", label: "Purple", labelAr: "بنفسجي" },
  { value: "#ec4899", label: "Pink", labelAr: "وردي" },
  { value: "#ef4444", label: "Red", labelAr: "أحمر" },
  { value: "#3b82f6", label: "Blue", labelAr: "أزرق" },
  { value: "#10b981", label: "Emerald", labelAr: "زمردي" },
  { value: "#f59e0b", label: "Amber", labelAr: "كهرماني" },
  { value: "#1a1a1a", label: "Black", labelAr: "أسود" },
]

export const builderSteps: BuilderStep[] = [
  {
    id: "store-name",
    question: "What would you like to name your store?",
    questionAr: "ما الاسم الذي تريده لمتجرك؟",
    type: "text",
    field: "storeName",
    placeholder: "e.g., Khayal Perfumes",
    placeholderAr: "مثال: خيال للعطور",
  },
  {
    id: "store-name-ar",
    question: "What's the Arabic name for your store?",
    questionAr: "ما الاسم العربي لمتجرك؟",
    type: "text",
    field: "storeNameAr",
    placeholder: "مثال: خيال للعطور",
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
    placeholder: "e.g., Luxury oud and oriental perfumes from the heart of Arabia",
    placeholderAr: "مثال: عطور عود وشرقية فاخرة من قلب الجزيرة العربية",
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
    perfumes: [
      { nameEn: "Royal Oud Intense", nameAr: "العود الملكي المكثف", descEn: "A rich and commanding oriental fragrance built on deep oud wood, aged amber, and a whisper of saffron", descAr: "عطر شرقي فاخر مبني على خشب العود العميق والعنبر المعتق ولمسة من الزعفران", price: 185, category: "عطور", image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80" },
      { nameEn: "Rose Taif Collection", nameAr: "مجموعة ورد الطائف", descEn: "Inspired by the legendary roses of Taif — fresh floral heart wrapped in soft musk and white woods", descAr: "مستوحى من ورود الطائف الأسطورية — قلب زهري منعش ملفوف بالمسك الناعم والأخشاب البيضاء", price: 145, category: "عطور", image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80" },
      { nameEn: "White Musk Elixir", nameAr: "إكسير المسك الأبيض", descEn: "A timeless white musk with clean powdery notes, iris, and a hint of sandalwood — worn close to the skin", descAr: "مسك أبيض خالد بعبق ناعم وأيريس وإشارة خشب الصندل — يُلبس قريباً من البشرة", price: 95, category: "عطور", image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&q=80" },
      { nameEn: "Amber Noir", nameAr: "العنبر الأسود", descEn: "A bold, resinous amber with dark vanilla, vetiver, and smoky incense — unforgettable and long-lasting", descAr: "عنبر راتنجي جريء مع فانيليا داكنة وفيتيفير وبخور دخاني — لا يُنسى وطويل الأمد", price: 220, category: "عطور", image: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&q=80" },
      { nameEn: "Oud & Roses Gift Set", nameAr: "طقم هدية عود وورود", descEn: "Luxury gift set of 3 complementary fragrances: oud, rose, and musk — perfect for gifting", descAr: "طقم هدايا فاخر من 3 عطور متكاملة: عود وورد ومسك — مثالي للإهداء", price: 320, category: "عطور", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80" },
      { nameEn: "Incense Bakhoor Blend", nameAr: "مزيج بخور فاخر", descEn: "Traditional Arabian bakhoor chips handcrafted with oud chips, rose petals, and precious resins", descAr: "بخور عربي تقليدي مصنوع يدوياً بشرائح العود وبتلات الورد والراتنجات الثمينة", price: 75, category: "بخور", image: "https://images.unsplash.com/photo-1606471191009-63994c53433b?w=600&q=80" },
    ],
    fashion: [
      { nameEn: "Silk Abaya — Pearl White", nameAr: "عباءة حرير — لؤلؤي", descEn: "Flowing silk abaya with delicate pearl embroidery at cuffs and hem — effortlessly elegant", descAr: "عباءة حريرية منسابة مع تطريز لؤلؤي رقيق على الأكمام والحاشية — أناقة بلا مجهود", price: 580, category: "عباءات", image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80" },
      { nameEn: "Linen Kaftan Dress", nameAr: "فستان كافتان كتاني", descEn: "Relaxed kaftan cut in breathable linen, embellished with hand-drawn geometric print", descAr: "قطع كافتان مريحة من الكتان المسامي، مزخرفة بطبعة هندسية مرسومة باليد", price: 340, category: "فساتين", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80" },
      { nameEn: "Structured Blazer — Sand", nameAr: "بليزر منظم — رملي", descEn: "Tailored blazer in warm sand tone — power dressing for the modern Arab woman", descAr: "بليزر مفصل بدرجة الرمل الدافئ — ملابس القوة للمرأة العربية العصرية", price: 420, category: "ملابس خارجية", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80" },
      { nameEn: "Premium Leather Bag", nameAr: "حقيبة جلدية فاخرة", descEn: "Full-grain leather structured tote — spacious, durable, and beautifully crafted", descAr: "حقيبة توت جلد كامل الحبة — واسعة ومتينة ومصنوعة بجمال", price: 680, category: "حقائب", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80" },
      { nameEn: "Embroidered Scarf", nameAr: "شال مطرز", descEn: "Lightweight chiffon scarf with intricate Arabic calligraphy embroidery", descAr: "شال شيفون خفيف مع تطريز دقيق لخط عربي", price: 130, category: "إكسسوارات", image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80" },
      { nameEn: "Wide-Leg Trousers", nameAr: "بنطلون واسع الساق", descEn: "Flowing wide-leg trousers in premium crepe fabric — dress up or down", descAr: "بنطلون واسع الساق من قماش الكريب الفاخر — مناسب لكل المناسبات", price: 195, category: "بنطلونات", image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=600&q=80" },
    ],
    shoes: [
      { nameEn: "Leather Pointed Heels", nameAr: "كعب جلد مدبب", descEn: "Sleek pointed-toe heels in genuine leather — the foundation of any power outfit", descAr: "كعب مدبب أنيق من الجلد الحقيقي — أساس أي إطلالة قوية", price: 380, category: "كعب عالي", image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&q=80" },
      { nameEn: "Classic White Sneakers", nameAr: "سنيكر أبيض كلاسيك", descEn: "Clean, versatile white leather sneakers — pairs with everything", descAr: "سنيكر جلد أبيض نظيف ومتعدد الاستخدامات — يناسب كل شيء", price: 245, category: "سنيكر", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80" },
      { nameEn: "Suede Loafers", nameAr: "لوفر سويدي", descEn: "Supple suede loafers with gold bit detail — smart casual perfection", descAr: "لوفر سويد ناعم مع تفصيل ذهبي — مثالي للأناقة العصرية", price: 310, category: "لوفر", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80" },
      { nameEn: "Leather Ankle Boots", nameAr: "بوت كاحل جلدي", descEn: "Refined ankle boots in full-grain leather with side zip — autumn essential", descAr: "بوت كاحل راقٍ من جلد كامل الحبة مع سحاب جانبي — ضرورة الخريف", price: 520, category: "بوت", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80" },
      { nameEn: "Embellished Flat Sandals", nameAr: "صندل مسطح مزخرف", descEn: "Flat sandals adorned with hand-set crystals — beach-to-brunch ready", descAr: "صندل مسطح مزين بكريستال يدوي — من الشاطئ إلى الغداء", price: 175, category: "صندل", image: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600&q=80" },
      { nameEn: "Platform Mule", nameAr: "ميول بلاتفورم", descEn: "Chunky platform mule in premium leather — elevated comfort for the modern wardrobe", descAr: "ميول بلاتفورم من الجلد الفاخر — راحة راقية للخزانة العصرية", price: 290, category: "ميول", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80" },
    ],
    skincare: [
      { nameEn: "Vitamin C Brightening Serum", nameAr: "سيروم فيتامين C للإشراق", descEn: "High-potency 20% Vitamin C serum — visibly brightens, evens tone, and defends against oxidative stress", descAr: "سيروم فيتامين C عالي الفعالية 20% — يُشرق ويُوحد البشرة ويحميها من الإجهاد التأكسدي", price: 130, category: "سيروم", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80" },
      { nameEn: "Retinol Night Cream", nameAr: "كريم الريتينول الليلي", descEn: "Clinical-grade retinol overnight cream — smooths fine lines, refines texture while you sleep", descAr: "كريم ريتينول ليلي بدرجة طبية — يُنعم الخطوط الدقيقة ويُكثف البشرة أثناء نومك", price: 165, category: "كريم", image: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=600&q=80" },
      { nameEn: "Hyaluronic Acid Gel", nameAr: "جل حمض الهيالورونيك", descEn: "Lightweight triple-weight hyaluronic acid gel — plumps and hydrates at all skin layers", descAr: "جل حمض الهيالورونيك خفيف الوزن بثلاث درجات — ينضج ويرطب في جميع طبقات البشرة", price: 95, category: "مرطب", image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80" },
      { nameEn: "Rose Clay Purifying Mask", nameAr: "قناع الطين بالورد", descEn: "Kaolin and rose clay mask with willow bark — unclogs pores, absorbs excess oil, leaves skin luminous", descAr: "قناع طين الكاولين والورد مع لحاء الصفصاف — يفتح المسام ويمتص الزيوت الزائدة", price: 75, category: "قناع", image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&q=80" },
      { nameEn: "SPF 50 Tinted Sunscreen", nameAr: "واقي شمس ملوّن SPF 50", descEn: "Lightweight tinted mineral sunscreen SPF 50+ — daily protection that doubles as a skin-perfecting base", descAr: "واقي شمس معدني ملوّن خفيف SPF 50+ — حماية يومية تعمل كقاعدة مكياج مثالية", price: 85, category: "واقي شمس", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80" },
      { nameEn: "Argan Body Oil", nameAr: "زيت جسم بالأرغان", descEn: "Pure Moroccan argan body oil — absorbs instantly, leaves skin silky and deeply nourished", descAr: "زيت جسم أرغان مغربي نقي — يُمتص فوراً ويترك البشرة حريرية ومغذاة بعمق", price: 70, category: "زيت الجسم", image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80" },
    ],
    beauty: [
      { nameEn: "Rose Face Serum", nameAr: "سيروم وجه بالورد", descEn: "Hydrating rose extract face serum", descAr: "سيروم وجه مرطب بخلاصة الورد", price: 89, category: "عناية", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80" },
      { nameEn: "Oud Perfume Collection", nameAr: "مجموعة عطور العود", descEn: "Three luxury oud-based fragrances", descAr: "ثلاثة عطور فاخرة بأساس العود", price: 250, category: "عطور", image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80" },
      { nameEn: "Natural Lip Set", nameAr: "مجموعة أحمر شفاه طبيعي", descEn: "Set of 4 natural ingredient lip colors", descAr: "مجموعة من 4 ألوان شفاه بمكونات طبيعية", price: 55, category: "مكياج", image: "https://images.unsplash.com/photo-1586495777744-4e6232bf2176?w=600&q=80" },
      { nameEn: "Hair Oil Elixir", nameAr: "إكسير زيت الشعر", descEn: "Nourishing argan and jojoba hair oil", descAr: "زيت شعر مغذي بالأرغان والجوجوبا", price: 42, category: "شعر", image: "https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=600&q=80" },
    ],
    electronics: [
      { nameEn: "Wireless Earbuds Pro", nameAr: "سماعات لاسلكية برو", descEn: "Premium noise-cancelling wireless earbuds", descAr: "سماعات لاسلكية فاخرة بخاصية إلغاء الضوضاء", price: 199, category: "صوتيات", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80" },
      { nameEn: "Smart Watch Ultra", nameAr: "ساعة ذكية ألترا", descEn: "Advanced fitness and health tracking smartwatch", descAr: "ساعة ذكية متقدمة لتتبع اللياقة والصحة", price: 349, category: "ساعات", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80" },
      { nameEn: "Portable Charger 20K", nameAr: "شاحن متنقل 20K", descEn: "20000mAh fast-charging portable battery", descAr: "بطارية متنقلة 20000 مللي أمبير شحن سريع", price: 79, category: "إكسسوارات", image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80" },
      { nameEn: "Bluetooth Speaker", nameAr: "مكبر صوت بلوتوث", descEn: "Waterproof portable bluetooth speaker", descAr: "مكبر صوت بلوتوث محمول مقاوم للماء", price: 129, category: "صوتيات", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80" },
    ],
    food: [
      { nameEn: "Premium Coffee Blend", nameAr: "خلطة قهوة فاخرة", descEn: "Artisan roasted Arabic coffee blend", descAr: "خلطة قهوة عربية محمصة بعناية", price: 45, category: "مشروبات", image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80" },
      { nameEn: "Organic Honey Set", nameAr: "مجموعة عسل عضوي", descEn: "Set of 3 premium organic honey varieties", descAr: "مجموعة من 3 أنواع عسل عضوي فاخر", price: 85, category: "عسل", image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80" },
      { nameEn: "Date Gift Box", nameAr: "علبة تمور هدية", descEn: "Luxury assorted dates in premium packaging", descAr: "تمور مشكلة فاخرة في علبة هدايا أنيقة", price: 120, category: "تمور", image: "https://images.unsplash.com/photo-1611003229641-7e343593e5cf?w=600&q=80" },
      { nameEn: "Saffron Premium", nameAr: "زعفران فاخر", descEn: "Pure Iranian saffron, 5g premium grade", descAr: "زعفران إيراني نقي، 5 غرام درجة فاخرة", price: 65, category: "بهارات", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80" },
    ],
    home: [
      { nameEn: "Scented Candle Set", nameAr: "مجموعة شموع معطرة", descEn: "Luxury soy wax scented candles set of 3", descAr: "مجموعة شموع فاخرة من الشمع النباتي 3 قطع", price: 75, category: "ديكور", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80" },
      { nameEn: "Ceramic Vase", nameAr: "مزهرية سيراميك", descEn: "Handcrafted ceramic vase in earth tones", descAr: "مزهرية سيراميك يدوية الصنع بألوان ترابية", price: 95, category: "ديكور", image: "https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=600&q=80" },
      { nameEn: "Linen Throw Blanket", nameAr: "بطانية كتان", descEn: "Soft linen throw blanket for sofa or bed", descAr: "بطانية كتان ناعمة للأريكة أو السرير", price: 130, category: "مفروشات", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80" },
      { nameEn: "Wooden Serving Board", nameAr: "لوح تقديم خشبي", descEn: "Premium acacia wood serving board", descAr: "لوح تقديم فاخر من خشب الأكاسيا", price: 60, category: "مطبخ", image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&q=80" },
    ],
    sports: [
      { nameEn: "Yoga Mat Pro", nameAr: "حصيرة يوغا برو", descEn: "Non-slip professional yoga mat 6mm", descAr: "حصيرة يوغا احترافية مانعة للانزلاق 6 مم", price: 85, category: "يوغا", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80" },
      { nameEn: "Resistance Bands Set", nameAr: "مجموعة أشرطة مقاومة", descEn: "Set of 5 resistance bands for full body workout", descAr: "مجموعة من 5 أشرطة مقاومة لتمرين الجسم كامل", price: 45, category: "لياقة", image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&q=80" },
      { nameEn: "Running Hydration Vest", nameAr: "سترة ترطيب للجري", descEn: "Lightweight hydration vest with 2L bladder", descAr: "سترة ترطيب خفيفة مع خزان 2 لتر", price: 120, category: "جري", image: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&q=80" },
      { nameEn: "Gym Duffel Bag", nameAr: "حقيبة جيم", descEn: "Large capacity sports duffel bag with shoe compartment", descAr: "حقيبة رياضية واسعة مع حجرة للأحذية", price: 95, category: "إكسسوارات", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80" },
    ],
  }

  // Default products for categories not explicitly defined
  const defaultProducts: ProductSeed[] = [
    { nameEn: "Featured Item", nameAr: "منتج مميز", descEn: `Quality product from ${storeName}`, descAr: `منتج عالي الجودة من ${storeName}`, price: 99, category: "عام", image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80" },
    { nameEn: "Best Seller", nameAr: "الأكثر مبيعاً", descEn: `Best seller from ${storeName}`, descAr: `الأكثر مبيعاً من ${storeName}`, price: 149, category: "عام", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80" },
    { nameEn: "New Arrival", nameAr: "وصل حديثاً", descEn: `New arrival at ${storeName}`, descAr: `وصل حديثاً إلى ${storeName}`, price: 79, category: "عام", image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80" },
    { nameEn: "Exclusive Pick", nameAr: "اختيار حصري", descEn: `Exclusive from ${storeName}`, descAr: `حصري من ${storeName}`, price: 199, category: "عام", image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80" },
  ]

  return productsByCategory[category] || defaultProducts
}

// Generate a URL-safe slug from store name
export function generateSlug(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "") // strip leading/trailing hyphens
    .substring(0, 50)
  return slug || "store"
}
