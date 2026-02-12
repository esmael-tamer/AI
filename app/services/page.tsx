import Link from "next/link";
import { MtHeader } from "@/components/mt-header";
import { MtFooter } from "@/components/mt-footer";
import {
  Store,
  Palette,
  BarChart3,
  Headphones,
  Smartphone,
  Globe,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    icon: Store,
    title: "AI Store Builder",
    titleAr: "بناء المتاجر بالذكاء الاصطناعي",
    description:
      "Create your complete online store in minutes through a guided AI conversation. No coding, no design skills needed.",
    features: [
      "Smart product categorization",
      "Auto-generated branding",
      "WhatsApp integration",
      "Multiple payment options",
    ],
  },
  {
    icon: Palette,
    title: "Store Design & Customization",
    titleAr: "تصميم وتخصيص المتاجر",
    description:
      "Premium custom designs that match your brand. Our team creates unique shopping experiences that convert visitors into customers.",
    features: [
      "Custom theme development",
      "Brand identity integration",
      "Mobile-first design",
      "A/B testing ready",
    ],
  },
  {
    icon: BarChart3,
    title: "Growth & Marketing",
    titleAr: "النمو والتسويق",
    description:
      "Data-driven marketing strategies to grow your online presence. SEO, social media, and performance marketing all in one.",
    features: [
      "SEO optimization",
      "Social media management",
      "Google & Meta ads",
      "Analytics dashboard",
    ],
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    titleAr: "دعم مخصص",
    description:
      "24/7 support in Arabic and English. Our team is always ready to help you succeed with your online business.",
    features: [
      "Arabic & English support",
      "24/7 availability",
      "Priority ticket system",
      "Dedicated account manager",
    ],
  },
  {
    icon: Smartphone,
    title: "Mobile Commerce",
    titleAr: "التجارة عبر الجوال",
    description:
      "Optimized mobile shopping experiences. Your store works perfectly on every device, with native app-like performance.",
    features: [
      "Progressive Web App",
      "Mobile-first checkout",
      "Push notifications",
      "Fast loading times",
    ],
  },
  {
    icon: Globe,
    title: "Multi-Language & RTL",
    titleAr: "تعدد اللغات ودعم العربية",
    description:
      "Full bilingual support with proper RTL layout. Reach Arabic and English speaking customers with a seamless experience.",
    features: [
      "Arabic RTL support",
      "Auto language detection",
      "Bilingual content management",
      "Regional payment methods",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <MtHeader />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 bg-lime-400/10 border border-lime-400/20 rounded-full text-lime-400 text-sm font-medium mb-6">
            Our Services
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance">
            Everything you need to{" "}
            <span className="text-lime-400">succeed online</span>
          </h1>
          <p className="text-zinc-400 text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
            From AI-powered store creation to growth marketing, we provide
            end-to-end solutions for your e-commerce journey.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-lime-400/20 transition-all group"
            >
              <div className="w-12 h-12 bg-lime-400/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-lime-400/20 transition-colors">
                <service.icon className="w-6 h-6 text-lime-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">
                {service.title}
              </h3>
              <p className="text-zinc-500 text-sm mb-3" dir="rtl">
                {service.titleAr}
              </p>
              <p className="text-zinc-400 text-sm leading-relaxed mb-5">
                {service.description}
              </p>
              <ul className="flex flex-col gap-2">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="text-zinc-500 text-sm flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 bg-lime-400 rounded-full shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-balance">
            Ready to start your project?
          </h2>
          <p className="text-zinc-400 mb-8">
            Talk to our team or try the AI builder now
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/builder"
              className="inline-flex items-center gap-2 bg-lime-400 hover:bg-lime-300 text-black font-semibold px-8 py-3 rounded-xl transition-all"
            >
              Try AI Builder
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold px-8 py-3 rounded-xl transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <MtFooter />
    </div>
  );
}
