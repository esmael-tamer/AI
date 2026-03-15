"use client"

import Link from "next/link"
import MTHeader from "@/components/layout/header"
import MTFooter from "@/components/layout/footer"
import { useLang } from "@/lib/i18n"
import {
  Target,
  Eye,
  Heart,
  Zap,
  Globe,
  Shield,
  ArrowRight,
  TrendingUp,
  Store,
  Users,
} from "lucide-react"

export default function AboutPage() {
  const { t, isAr } = useLang()

  const stats = [
    { value: "500+", label: t("Stores Built", "متجر تم بناؤه") },
    { value: "3+", label: t("Years of Experience", "سنوات خبرة") },
    { value: "12", label: t("MENA Countries", "دولة في المنطقة") },
    { value: "98%", label: t("Client Satisfaction", "رضا العملاء") },
  ]

  const values = [
    {
      icon: Zap,
      title: t("Innovation First", "الابتكار أولاً"),
      description: t(
        "We leverage cutting-edge AI to make e-commerce accessible for every entrepreneur in the Arab world.",
        "نوظّف أحدث تقنيات الذكاء الاصطناعي لجعل التجارة الإلكترونية في متناول كل رائد أعمال في العالم العربي."
      ),
      color: "from-lime-400/20 to-emerald-400/10",
    },
    {
      icon: Heart,
      title: t("Arab-First Design", "تصميم عربي أولاً"),
      description: t(
        "Built from the ground up for Arabic-speaking markets — RTL, local currencies, and regional integrations included.",
        "مبني من الصفر لأسواق اللغة العربية — دعم RTL والعملات المحلية والتكاملات الإقليمية مدمجة."
      ),
      color: "from-rose-400/20 to-pink-400/10",
    },
    {
      icon: Shield,
      title: t("Trust & Transparency", "الثقة والشفافية"),
      description: t(
        "We believe in honest pricing, clear commitments, and long-term partnerships with our clients.",
        "نؤمن بالتسعير الصادق والالتزامات الواضحة والشراكات طويلة الأمد مع عملائنا."
      ),
      color: "from-blue-400/20 to-cyan-400/10",
    },
    {
      icon: Globe,
      title: t("Regional Expertise", "خبرة إقليمية"),
      description: t(
        "Deep understanding of MENA market dynamics, consumer behavior, and local business needs.",
        "فهم عميق لديناميكيات سوق المنطقة وسلوك المستهلك واحتياجات الأعمال المحلية."
      ),
      color: "from-purple-400/20 to-violet-400/10",
    },
    {
      icon: TrendingUp,
      title: t("Results-Driven", "موجّه بالنتائج"),
      description: t(
        "Everything we do is measured by the growth and success of our clients' businesses.",
        "كل ما نفعله يُقاس بنمو ونجاح أعمال عملائنا."
      ),
      color: "from-amber-400/20 to-orange-400/10",
    },
    {
      icon: Users,
      title: t("Community & Support", "المجتمع والدعم"),
      description: t(
        "24/7 Arabic and English support from a team that genuinely cares about your success.",
        "دعم 24/7 بالعربية والإنجليزية من فريق يهتم حقاً بنجاحك."
      ),
      color: "from-teal-400/20 to-green-400/10",
    },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <MTHeader />

      {/* Hero */}
      <section className="pt-36 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-lime-400/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <span className="inline-block px-5 py-2 bg-lime-400/10 border border-lime-400/20 rounded-full text-lime-400 text-sm font-medium mb-8 backdrop-blur-sm">
            {t("About Us", "من نحن")}
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight mb-6">
            {t("We're building the ", "نبني ")}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400">
              {t("future of e-commerce", "مستقبل التجارة الإلكترونية")}
            </span>
            {t(" in the Arab world", " في العالم العربي")}
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
            {t(
              "Media Trend is an AI-powered e-commerce platform built specifically for entrepreneurs and businesses in the MENA region. We turn ambitious ideas into thriving online stores.",
              "ميديا تريند منصة تجارة إلكترونية مدعومة بالذكاء الاصطناعي، مبنية خصيصاً لرواد الأعمال والشركات في منطقة الشرق الأوسط وشمال أفريقيا. نحوّل الأفكار الطموحة إلى متاجر إلكترونية مزدهرة."
            )}
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 text-center"
            >
              <div className="text-4xl font-black text-lime-400 mb-2">{stat.value}</div>
              <div className="text-zinc-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-10 hover:border-lime-400/30 transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-lime-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="w-14 h-14 bg-lime-400/10 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-lime-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">{t("Our Mission", "رسالتنا")}</h2>
              <p className="text-zinc-400 leading-relaxed">
                {t(
                  "To democratize e-commerce for Arabic-speaking entrepreneurs by combining artificial intelligence with deep regional expertise — making it possible for anyone to launch and grow a professional online store.",
                  "تمكين رواد الأعمال العرب من التجارة الإلكترونية من خلال الجمع بين الذكاء الاصطناعي والخبرة الإقليمية العميقة — لتجعل كل شخص قادراً على إطلاق متجر إلكتروني احترافي وتنميته."
                )}
              </p>
            </div>
          </div>

          <div className="group relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-10 hover:border-lime-400/30 transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="w-14 h-14 bg-emerald-400/10 rounded-2xl flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">{t("Our Vision", "رؤيتنا")}</h2>
              <p className="text-zinc-400 leading-relaxed">
                {t(
                  "To become the leading e-commerce enablement platform in the MENA region — where every business, regardless of size, can compete and win in the digital marketplace.",
                  "أن نصبح المنصة الرائدة لتمكين التجارة الإلكترونية في منطقة الشرق الأوسط وشمال أفريقيا — حيث يمكن لكل عمل تجاري، بغض النظر عن حجمه، المنافسة والفوز في السوق الرقمية."
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-5 py-2 bg-white/5 border border-white/10 rounded-full text-white/60 text-sm font-medium mb-6">
              {t("Our Story", "قصتنا")}
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">
              {t("From idea to ", "من فكرة إلى ")}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400">
                {t("500+ stores", "500+ متجر")}
              </span>
            </h2>
          </div>
          <div className="space-y-6 text-zinc-400 text-lg leading-relaxed">
            <p>
              {t(
                "Media Trend was founded with a simple observation: launching an online store in the Arab world was unnecessarily complex, expensive, and time-consuming. Most solutions were designed for Western markets, leaving Arabic-speaking entrepreneurs to navigate platforms that didn't understand their language, currency, or culture.",
                "تأسست ميديا تريند بملاحظة بسيطة: إطلاق متجر إلكتروني في العالم العربي كان معقداً ومكلفاً وبطيئاً بشكل غير ضروري. كانت معظم الحلول مصممة للأسواق الغربية، تاركةً رواد الأعمال العرب يتعاملون مع منصات لا تفهم لغتهم ولا عملتهم ولا ثقافتهم."
              )}
            </p>
            <p>
              {t(
                "We built Media Trend to change that. By combining the power of AI with deep MENA market knowledge, we created a platform that speaks Arabic natively, supports local payment methods, and integrates with regional logistics providers — so you can focus on growing your business instead of wrestling with technology.",
                "بنينا ميديا تريند لتغيير هذا الواقع. من خلال الجمع بين قوة الذكاء الاصطناعي والمعرفة العميقة بسوق المنطقة، أنشأنا منصة تتحدث العربية بشكل أصيل، وتدعم طرق الدفع المحلية، وتتكامل مع مزودي الخدمات اللوجستية الإقليميين — حتى تتمكن من التركيز على تنمية أعمالك بدلاً من التصارع مع التكنولوجيا."
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-5 py-2 bg-white/5 border border-white/10 rounded-full text-white/60 text-sm font-medium mb-6">
              {t("What We Stand For", "ما نؤمن به")}
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              {t("Our values", "قيمنا")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="group relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 hover:border-lime-400/30 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative">
                  <div className="w-12 h-12 bg-white/[0.06] rounded-xl flex items-center justify-center mb-5 group-hover:bg-white/10 transition-all duration-300 group-hover:scale-110">
                    <value.icon className="w-6 h-6 text-lime-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{value.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl p-12 sm:p-16 text-center overflow-hidden border border-white/[0.06]">
            <div className="absolute inset-0 bg-gradient-to-br from-lime-400/10 via-transparent to-emerald-400/5 pointer-events-none" />
            <div className="relative">
              <Store className="w-12 h-12 text-lime-400 mx-auto mb-6" />
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
                {t("Ready to join us?", "جاهز للانضمام إلينا؟")}
              </h2>
              <p className="text-zinc-400 mb-8 text-lg">
                {t(
                  "Build your online store today and join 500+ businesses growing with Media Trend.",
                  "ابنِ متجرك الإلكتروني اليوم وانضم إلى 500+ عمل تجاري ينمو مع ميديا تريند."
                )}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/builder"
                  className="group inline-flex items-center gap-2 bg-lime-400 hover:bg-lime-300 text-black font-bold px-8 py-4 rounded-full transition-all hover:scale-105"
                >
                  {t("Start Building", "ابدأ البناء")}
                  <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isAr ? "rotate-180 group-hover:-translate-x-1" : ""}`} />
                </Link>
                <Link
                  href="/team"
                  className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold px-8 py-4 rounded-full transition-all"
                >
                  {t("Meet the Team", "تعرّف على الفريق")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MTFooter />
    </div>
  )
}
