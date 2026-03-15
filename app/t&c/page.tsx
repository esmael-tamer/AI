"use client"

import { useState } from "react"
import Link from "next/link"
import MTHeader from "@/components/layout/header"
import MTFooter from "@/components/layout/footer"
import { useLang } from "@/lib/i18n"
import { FileText, Shield, Cookie, ChevronDown, ChevronUp } from "lucide-react"

type TabId = "terms" | "privacy" | "cookies"

interface Section {
  title: string
  content: string
}

interface TabData {
  id: TabId
  icon: React.ElementType
  label: string
  lastUpdated: string
  sections: Section[]
}

export default function LegalPage() {
  const { t, isAr } = useLang()
  const [activeTab, setActiveTab] = useState<TabId>("terms")
  const [openSection, setOpenSection] = useState<number | null>(0)

  const tabs: TabData[] = [
    {
      id: "terms",
      icon: FileText,
      label: t("Terms of Service", "شروط الخدمة"),
      lastUpdated: t("Last updated: January 1, 2025", "آخر تحديث: 1 يناير 2025"),
      sections: [
        {
          title: t("1. Acceptance of Terms", "1. قبول الشروط"),
          content: t(
            "By accessing or using Media Trend's platform and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. These terms apply to all users, visitors, and others who access or use the service.",
            "باستخدامك لمنصة وخدمات ميديا تريند، فإنك توافق على الالتزام بشروط الخدمة هذه. إذا كنت لا توافق على هذه الشروط، يُرجى عدم استخدام خدماتنا. تسري هذه الشروط على جميع المستخدمين والزوار وغيرهم ممن يصلون إلى الخدمة أو يستخدمونها."
          ),
        },
        {
          title: t("2. Description of Services", "2. وصف الخدمات"),
          content: t(
            "Media Trend provides an AI-powered e-commerce platform that enables users to create, manage, and grow online stores. Our services include store building tools, ad campaign management, account management, and supporting services as described on our website. We reserve the right to modify, suspend, or discontinue any part of the service at any time.",
            "تقدم ميديا تريند منصة تجارة إلكترونية مدعومة بالذكاء الاصطناعي تمكّن المستخدمين من إنشاء المتاجر الإلكترونية وإدارتها وتنميتها. تشمل خدماتنا أدوات بناء المتاجر وإدارة الحملات الإعلانية وإدارة الحسابات والخدمات الداعمة كما هو موضح في موقعنا. نحتفظ بالحق في تعديل أي جزء من الخدمة أو تعليقه أو إيقافه في أي وقت."
          ),
        },
        {
          title: t("3. User Accounts", "3. حسابات المستخدمين"),
          content: t(
            "To access certain features of our platform, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate and current.",
            "للوصول إلى بعض ميزات منصتنا، يجب عليك إنشاء حساب. أنت مسؤول عن الحفاظ على سرية بيانات اعتماد حسابك وعن جميع الأنشطة التي تجري بموجب حسابك. توافق على تقديم معلومات دقيقة وحديثة وكاملة أثناء التسجيل وتحديثها للحفاظ على دقتها."
          ),
        },
        {
          title: t("4. Payment & Billing", "4. الدفع والفواتير"),
          content: t(
            "Certain services are provided on a paid subscription basis. You agree to pay all fees and charges associated with your account on a timely basis. All fees are exclusive of applicable taxes. We reserve the right to change our pricing at any time with reasonable notice. Refunds are handled on a case-by-case basis.",
            "تُقدَّم بعض الخدمات على أساس اشتراك مدفوع. توافق على دفع جميع الرسوم والتكاليف المرتبطة بحسابك في الوقت المناسب. جميع الرسوم لا تشمل الضرائب المطبقة. نحتفظ بالحق في تغيير أسعارنا في أي وقت مع إشعار معقول. تُعالَج المبالغ المستردة على أساس كل حالة على حدة."
          ),
        },
        {
          title: t("5. Intellectual Property", "5. الملكية الفكرية"),
          content: t(
            "The platform, its original content, features, and functionality are owned by Media Trend and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You retain ownership of content you create using our platform, but grant Media Trend a license to host and display such content.",
            "المنصة ومحتواها الأصلي وميزاتها ووظائفها مملوكة لميديا تريند وتحميها قوانين حقوق النشر والعلامات التجارية وبراءات الاختراع والأسرار التجارية والملكية الفكرية الدولية الأخرى. تحتفظ بملكية المحتوى الذي تنشئه باستخدام منصتنا، لكنك تمنح ميديا تريند ترخيصاً لاستضافة هذا المحتوى وعرضه."
          ),
        },
        {
          title: t("6. Prohibited Uses", "6. الاستخدامات المحظورة"),
          content: t(
            "You may not use our services for any unlawful purpose, to harass or harm others, to transmit spam, to distribute malware, to infringe on intellectual property rights, or to engage in fraudulent activities. Violation of these terms may result in immediate termination of your account.",
            "لا يجوز لك استخدام خدماتنا لأي غرض غير مشروع، أو لمضايقة الآخرين أو إيذائهم، أو لإرسال رسائل غير مرغوب فيها، أو توزيع البرامج الضارة، أو انتهاك حقوق الملكية الفكرية، أو الانخراط في أنشطة احتيالية. قد تؤدي مخالفة هذه الشروط إلى إنهاء حسابك فوراً."
          ),
        },
        {
          title: t("7. Limitation of Liability", "7. حدود المسؤولية"),
          content: t(
            "To the maximum extent permitted by law, Media Trend shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising from your use of or inability to use our services. Our total liability shall not exceed the amount paid by you in the 12 months preceding the claim.",
            "إلى أقصى حد يسمح به القانون، لن تكون ميديا تريند مسؤولة عن أي أضرار غير مباشرة أو عرضية أو خاصة أو تبعية أو عقابية، بما في ذلك خسارة الأرباح أو البيانات أو الشهرة التجارية، الناشئة عن استخدامك أو عدم قدرتك على استخدام خدماتنا. لن تتجاوز مسؤوليتنا الإجمالية المبلغ الذي دفعته في الـ 12 شهراً السابقة للمطالبة."
          ),
        },
        {
          title: t("8. Governing Law", "8. القانون الحاكم"),
          content: t(
            "These Terms shall be governed by and construed in accordance with the laws of the Kingdom of Saudi Arabia. Any disputes arising from these terms shall be resolved through binding arbitration in Riyadh, Saudi Arabia.",
            "تخضع هذه الشروط وتُفسَّر وفقاً لقوانين المملكة العربية السعودية. يُحسم أي نزاع ينشأ عن هذه الشروط عبر التحكيم الملزم في الرياض، المملكة العربية السعودية."
          ),
        },
      ],
    },
    {
      id: "privacy",
      icon: Shield,
      label: t("Privacy Policy", "سياسة الخصوصية"),
      lastUpdated: t("Last updated: January 1, 2025", "آخر تحديث: 1 يناير 2025"),
      sections: [
        {
          title: t("1. Information We Collect", "1. المعلومات التي نجمعها"),
          content: t(
            "We collect information you provide directly: name, email address, phone number, business details, and payment information when you register or use our services. We also automatically collect technical data such as IP address, browser type, device information, and usage patterns when you interact with our platform.",
            "نجمع المعلومات التي تقدمها مباشرة: الاسم وعنوان البريد الإلكتروني ورقم الهاتف وتفاصيل العمل ومعلومات الدفع عند التسجيل أو استخدام خدماتنا. كما نجمع تلقائياً بيانات تقنية مثل عنوان IP ونوع المتصفح ومعلومات الجهاز وأنماط الاستخدام عند تفاعلك مع منصتنا."
          ),
        },
        {
          title: t("2. How We Use Your Information", "2. كيف نستخدم معلوماتك"),
          content: t(
            "We use your information to provide and improve our services, process transactions, send service communications, personalize your experience, detect and prevent fraud, comply with legal obligations, and communicate marketing updates (with your consent). We do not sell your personal information to third parties.",
            "نستخدم معلوماتك لتقديم خدماتنا وتحسينها، ومعالجة المعاملات، وإرسال اتصالات الخدمة، وتخصيص تجربتك، واكتشاف الاحتيال ومنعه، والامتثال للالتزامات القانونية، وإرسال التحديثات التسويقية (بموافقتك). لا نبيع معلوماتك الشخصية لأطراف ثالثة."
          ),
        },
        {
          title: t("3. Data Sharing", "3. مشاركة البيانات"),
          content: t(
            "We may share your information with trusted service providers who assist in operating our platform (payment processors, cloud hosting, analytics), with business partners for integrated services you choose to enable, and with authorities when required by law. All third parties are contractually bound to protect your data.",
            "قد نشارك معلوماتك مع مزودي خدمات موثوق بهم يساعدون في تشغيل منصتنا (معالجو الدفع والاستضافة السحابية والتحليلات)، ومع شركاء الأعمال للخدمات المتكاملة التي تختار تفعيلها، ومع السلطات عند الاقتضاء قانوناً. جميع الأطراف الثالثة ملزمة تعاقدياً بحماية بياناتك."
          ),
        },
        {
          title: t("4. Data Security", "4. أمان البيانات"),
          content: t(
            "We implement industry-standard security measures including encryption at rest and in transit, regular security audits, access controls, and secure data centers. However, no method of transmission over the internet is 100% secure. We notify users of any data breaches as required by applicable law.",
            "ننفّذ معايير الأمان القياسية في الصناعة بما في ذلك التشفير أثناء التخزين والنقل، وعمليات تدقيق الأمان المنتظمة، وضوابط الوصول، ومراكز البيانات الآمنة. ومع ذلك، لا توجد طريقة إرسال عبر الإنترنت آمنة بنسبة 100٪. نُخطر المستخدمين بأي اختراق للبيانات وفقاً للقانون المعمول به."
          ),
        },
        {
          title: t("5. Your Rights", "5. حقوقك"),
          content: t(
            "You have the right to access, correct, or delete your personal data. You may request a copy of your data, opt out of marketing communications, withdraw consent for data processing, and request data portability. To exercise these rights, contact us at privacy@mediatrend.sa. We will respond within 30 days.",
            "يحق لك الوصول إلى بياناتك الشخصية وتصحيحها أو حذفها. يمكنك طلب نسخة من بياناتك، والانسحاب من الاتصالات التسويقية، وسحب الموافقة على معالجة البيانات، وطلب قابلية نقل البيانات. للممارسة هذه الحقوق، تواصل معنا على privacy@mediatrend.sa. سنرد في غضون 30 يوماً."
          ),
        },
        {
          title: t("6. Data Retention", "6. الاحتفاظ بالبيانات"),
          content: t(
            "We retain your personal data for as long as your account is active or as needed to provide services. After account closure, we retain data for up to 2 years for legal and audit purposes, then securely delete it. Anonymized aggregate data may be retained indefinitely for analytics purposes.",
            "نحتفظ ببياناتك الشخصية طالما حسابك نشط أو حسب الحاجة لتقديم الخدمات. بعد إغلاق الحساب، نحتفظ بالبيانات لمدة تصل إلى سنتين لأغراض قانونية وتدقيقية، ثم نحذفها بشكل آمن. يمكن الاحتفاظ بالبيانات المجمّعة المجهولة الهوية إلى أجل غير مسمى لأغراض التحليل."
          ),
        },
        {
          title: t("7. Cookies", "7. ملفات الارتباط"),
          content: t(
            "We use cookies and similar tracking technologies to enhance your experience. Essential cookies are required for the platform to function. Analytics and preference cookies can be managed through your browser settings or our cookie preference center. See our Cookie Policy for full details.",
            "نستخدم ملفات الارتباط وتقنيات التتبع المماثلة لتحسين تجربتك. ملفات الارتباط الأساسية مطلوبة لعمل المنصة. يمكن إدارة ملفات ارتباط التحليلات والتفضيلات من خلال إعدادات متصفحك أو مركز تفضيلات ملفات الارتباط لدينا. راجع سياسة ملفات الارتباط للحصول على التفاصيل الكاملة."
          ),
        },
      ],
    },
    {
      id: "cookies",
      icon: Cookie,
      label: t("Cookie Policy", "سياسة ملفات الارتباط"),
      lastUpdated: t("Last updated: January 1, 2025", "آخر تحديث: 1 يناير 2025"),
      sections: [
        {
          title: t("What Are Cookies?", "ما هي ملفات الارتباط؟"),
          content: t(
            "Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences, keep you logged in, and understand how you use the site. Cookies may be 'session cookies' (deleted when you close your browser) or 'persistent cookies' (remain until they expire or you delete them).",
            "ملفات الارتباط هي ملفات نصية صغيرة تُخزَّن على جهازك عند زيارة موقع ويب. تساعد مواقع الويب على تذكر تفضيلاتك وإبقائك مسجلاً للدخول وفهم كيفية استخدامك للموقع. قد تكون ملفات الارتباط 'ملفات ارتباط الجلسة' (تُحذف عند إغلاق المتصفح) أو 'ملفات الارتباط الدائمة' (تبقى حتى انتهاء صلاحيتها أو حذفها)."
          ),
        },
        {
          title: t("Essential Cookies", "ملفات الارتباط الأساسية"),
          content: t(
            "These cookies are strictly necessary for the platform to function and cannot be disabled. They include authentication cookies that keep you logged in, security cookies that protect against fraud, and session cookies that maintain your cart and preferences during a browsing session. No personal data is collected through these cookies.",
            "ملفات الارتباط هذه ضرورية تماماً لعمل المنصة ولا يمكن تعطيلها. تشمل ملفات ارتباط المصادقة التي تبقيك مسجلاً للدخول، وملفات الارتباط الأمنية التي تحمي من الاحتيال، وملفات ارتباط الجلسة التي تحافظ على سلة التسوق وتفضيلاتك خلال جلسة التصفح. لا يُجمع أي بيانات شخصية من خلال هذه الملفات."
          ),
        },
        {
          title: t("Analytics Cookies", "ملفات ارتباط التحليلات"),
          content: t(
            "We use analytics cookies to understand how visitors interact with our platform. This includes which pages are most visited, how long users spend on the platform, and where visitors come from. This data is collected in aggregate and helps us improve our service. You can opt out of analytics cookies in your browser settings.",
            "نستخدم ملفات ارتباط التحليلات لفهم كيفية تفاعل الزوار مع منصتنا. يشمل ذلك الصفحات الأكثر زيارة ومدة بقاء المستخدمين على المنصة ومصدر الزوار. تُجمع هذه البيانات بشكل إجمالي وتساعدنا في تحسين خدمتنا. يمكنك الانسحاب من ملفات ارتباط التحليلات في إعدادات المتصفح."
          ),
        },
        {
          title: t("Preference Cookies", "ملفات ارتباط التفضيلات"),
          content: t(
            "Preference cookies remember your settings and choices to enhance your experience. This includes your language preference (Arabic or English), theme settings, and other personalization options. These cookies make your experience more convenient by remembering your choices between visits.",
            "تتذكر ملفات ارتباط التفضيلات إعداداتك وخياراتك لتحسين تجربتك. يشمل ذلك تفضيل اللغة (العربية أو الإنجليزية) وإعدادات المظهر وخيارات التخصيص الأخرى. تجعل ملفات الارتباط هذه تجربتك أكثر ملاءمةً بتذكر خياراتك بين الزيارات."
          ),
        },
        {
          title: t("Marketing Cookies", "ملفات ارتباط التسويق"),
          content: t(
            "Marketing cookies track your browsing activity to show you relevant advertisements across the web. We and our advertising partners may use these cookies to build a profile of your interests. You can opt out of marketing cookies at any time. Note that opting out does not mean you will see no ads, just that ads will be less relevant to your interests.",
            "تتتبع ملفات ارتباط التسويق نشاط تصفحك لعرض إعلانات ذات صلة عبر الويب. قد نستخدم نحن وشركاؤنا في الإعلانات هذه الملفات لبناء ملف شخصي لاهتماماتك. يمكنك إلغاء الاشتراك في ملفات ارتباط التسويق في أي وقت. لاحظ أن إلغاء الاشتراك لا يعني أنك لن ترى إعلانات، بل أن الإعلانات ستكون أقل صلة باهتماماتك."
          ),
        },
        {
          title: t("Managing Cookies", "إدارة ملفات الارتباط"),
          content: t(
            "You can control cookies through your browser settings. Most browsers allow you to block or delete cookies. However, blocking essential cookies may prevent the platform from working correctly. For more information on managing cookies, visit your browser's help documentation. You can also contact us at privacy@mediatrend.sa for assistance.",
            "يمكنك التحكم في ملفات الارتباط من خلال إعدادات المتصفح. تسمح معظم المتصفحات بحظر ملفات الارتباط أو حذفها. ومع ذلك، قد يمنع حظر ملفات الارتباط الأساسية المنصة من العمل بشكل صحيح. للحصول على مزيد من المعلومات حول إدارة ملفات الارتباط، تفضل بزيارة وثائق مساعدة متصفحك. يمكنك أيضاً التواصل معنا على privacy@mediatrend.sa للمساعدة."
          ),
        },
      ],
    },
  ]

  const activeTabData = tabs.find((tab) => tab.id === activeTab)!

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <MTHeader />

      {/* Hero */}
      <section className="pt-36 pb-12 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-lime-400/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative">
          <span className="inline-block px-5 py-2 bg-lime-400/10 border border-lime-400/20 rounded-full text-lime-400 text-sm font-medium mb-8 backdrop-blur-sm">
            {t("Legal", "قانوني")}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-4">
            {t("Terms & Policies", "الشروط والسياسات")}
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            {t(
              "We believe in transparency. Read our policies to understand your rights and how we operate.",
              "نؤمن بالشفافية. اطّلع على سياساتنا لفهم حقوقك وكيفية عملنا."
            )}
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="px-6 pb-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3 p-1.5 bg-white/[0.03] border border-white/[0.06] rounded-2xl">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setOpenSection(0) }}
                  className={`flex-1 flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-lime-400 text-black"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <p className="text-zinc-500 text-sm">{activeTabData.lastUpdated}</p>
          </div>

          <div className="space-y-3">
            {activeTabData.sections.map((section, index) => (
              <div
                key={index}
                className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenSection(openSection === index ? null : index)}
                  className={`w-full flex items-center justify-between p-6 text-left transition-colors duration-200 ${isAr ? "text-right" : "text-left"} hover:bg-white/[0.02]`}
                >
                  <span className="text-white font-semibold text-base">{section.title}</span>
                  {openSection === index ? (
                    <ChevronUp className="w-5 h-5 text-lime-400 shrink-0 ml-4" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-zinc-500 shrink-0 ml-4" />
                  )}
                </button>
                {openSection === index && (
                  <div className="px-6 pb-6">
                    <div className="border-t border-white/[0.06] pt-4">
                      <p className="text-zinc-400 leading-relaxed text-sm">{section.content}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="mt-12 p-8 bg-white/[0.03] border border-white/[0.06] rounded-2xl text-center">
            <h3 className="text-white font-bold text-lg mb-2">
              {t("Have questions?", "هل لديك أسئلة؟")}
            </h3>
            <p className="text-zinc-400 text-sm mb-6">
              {t(
                "If you have any questions about our legal policies, please contact our team.",
                "إذا كانت لديك أي أسئلة حول سياساتنا القانونية، يُرجى التواصل مع فريقنا."
              )}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-lime-400 hover:bg-lime-300 text-black font-bold px-6 py-3 rounded-full text-sm transition-all hover:scale-105"
              >
                {t("Contact Us", "تواصل معنا")}
              </Link>
              <a
                href="mailto:legal@mediatrend.sa"
                className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold px-6 py-3 rounded-full text-sm transition-all"
              >
                legal@mediatrend.sa
              </a>
            </div>
          </div>
        </div>
      </section>

      <MTFooter />
    </div>
  )
}
