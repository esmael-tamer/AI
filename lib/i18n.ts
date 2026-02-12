export type Locale = "en" | "ar"

export const defaultLocale: Locale = "en"

const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.work": "Our Work",
    "nav.team": "Team",
    "nav.blog": "Blog",
    "nav.contact": "Contact",
    "nav.login": "Login",
    "nav.signup": "Get Started",
    "nav.dashboard": "Dashboard",
    "nav.admin": "Admin",

    // Hero
    "hero.badge": "AI-Powered E-Commerce",
    "hero.title": "Build Your Dream Store",
    "hero.titleHighlight": "In Minutes",
    "hero.subtitle": "Our AI assistant guides you through creating a professional online store. No coding required. Just answer a few questions and watch your store come to life.",
    "hero.cta": "Start Building Free",
    "hero.ctaSecondary": "Watch Demo",
    "hero.stats.stores": "Stores Created",
    "hero.stats.revenue": "Revenue Generated",
    "hero.stats.satisfaction": "Satisfaction Rate",

    // Services
    "services.title": "Everything You Need",
    "services.subtitle": "Comprehensive e-commerce solutions powered by cutting-edge technology",
    "services.ai.title": "AI Store Builder",
    "services.ai.desc": "Create your complete store with our intelligent assistant",
    "services.hosting.title": "Premium Hosting",
    "services.hosting.desc": "Lightning-fast servers with 99.9% uptime guarantee",
    "services.payments.title": "Payment Integration",
    "services.payments.desc": "Accept payments globally with multi-currency support",
    "services.analytics.title": "Smart Analytics",
    "services.analytics.desc": "Data-driven insights to grow your business",
    "services.support.title": "24/7 Support",
    "services.support.desc": "Expert help whenever you need it",
    "services.security.title": "Enterprise Security",
    "services.security.desc": "Bank-grade security for your store and customers",

    // CTA
    "cta.title": "Ready to Transform Your Business?",
    "cta.subtitle": "Join thousands of entrepreneurs who launched their stores with Media Trend",
    "cta.button": "Start Your Free Trial",

    // Footer
    "footer.company": "Media Trend",
    "footer.tagline": "Building the future of e-commerce, one store at a time.",
    "footer.services": "Services",
    "footer.company_links": "Company",
    "footer.support": "Support",
    "footer.legal": "Legal",
    "footer.rights": "All rights reserved.",
    "footer.terms": "Terms",
    "footer.privacy": "Privacy",

    // Auth
    "auth.login": "Login",
    "auth.signup": "Create Account",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.name": "Full Name",
    "auth.phone": "Phone",
    "auth.company": "Company Name",
    "auth.forgotPassword": "Forgot password?",
    "auth.noAccount": "Don't have an account?",
    "auth.hasAccount": "Already have an account?",
    "auth.loginButton": "Sign In",
    "auth.signupButton": "Create Account",

    // AI Builder
    "builder.title": "Let's Build Your Store",
    "builder.subtitle": "Answer a few questions and our AI will create a professional store for you",
    "builder.start": "Start Building",
    "builder.generating": "Creating your store...",
    "builder.complete": "Your store is ready!",
    "builder.viewStore": "View Your Store",

    // Common
    "common.loading": "Loading...",
    "common.error": "Something went wrong",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.create": "Create",
    "common.search": "Search...",
    "common.noResults": "No results found",
    "common.viewAll": "View All",
    "common.learnMore": "Learn More",
  },
  ar: {
    // Navigation
    "nav.home": "\u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629",
    "nav.services": "\u0627\u0644\u062e\u062f\u0645\u0627\u062a",
    "nav.work": "\u0623\u0639\u0645\u0627\u0644\u0646\u0627",
    "nav.team": "\u0627\u0644\u0641\u0631\u064a\u0642",
    "nav.blog": "\u0627\u0644\u0645\u062f\u0648\u0646\u0629",
    "nav.contact": "\u0627\u062a\u0635\u0644 \u0628\u0646\u0627",
    "nav.login": "\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644",
    "nav.signup": "\u0627\u0628\u062f\u0623 \u0627\u0644\u0622\u0646",
    "nav.dashboard": "\u0644\u0648\u062d\u0629 \u0627\u0644\u062a\u062d\u0643\u0645",
    "nav.admin": "\u0627\u0644\u0625\u062f\u0627\u0631\u0629",

    // Hero
    "hero.badge": "\u062a\u062c\u0627\u0631\u0629 \u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a\u0629 \u0628\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a",
    "hero.title": "\u0627\u0628\u0646\u0650 \u0645\u062a\u062c\u0631\u0643 \u0627\u0644\u0645\u062b\u0627\u0644\u064a",
    "hero.titleHighlight": "\u0641\u064a \u062f\u0642\u0627\u0626\u0642",
    "hero.subtitle": "\u0645\u0633\u0627\u0639\u062f\u0646\u0627 \u0627\u0644\u0630\u0643\u064a \u064a\u0631\u0634\u062f\u0643 \u0644\u0625\u0646\u0634\u0627\u0621 \u0645\u062a\u062c\u0631 \u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a \u0627\u062d\u062a\u0631\u0627\u0641\u064a. \u0644\u0627 \u062d\u0627\u062c\u0629 \u0644\u0644\u0628\u0631\u0645\u062c\u0629. \u0641\u0642\u0637 \u0623\u062c\u0628 \u0639\u0644\u0649 \u0628\u0636\u0639 \u0623\u0633\u0626\u0644\u0629 \u0648\u0634\u0627\u0647\u062f \u0645\u062a\u062c\u0631\u0643 \u064a\u0646\u0628\u0636 \u0628\u0627\u0644\u062d\u064a\u0627\u0629.",
    "hero.cta": "\u0627\u0628\u062f\u0623 \u0627\u0644\u0628\u0646\u0627\u0621 \u0645\u062c\u0627\u0646\u0627\u064b",
    "hero.ctaSecondary": "\u0634\u0627\u0647\u062f \u0627\u0644\u0639\u0631\u0636",
    "hero.stats.stores": "\u0645\u062a\u062c\u0631 \u062a\u0645 \u0625\u0646\u0634\u0627\u0624\u0647",
    "hero.stats.revenue": "\u0625\u064a\u0631\u0627\u062f\u0627\u062a \u0645\u062d\u0642\u0642\u0629",
    "hero.stats.satisfaction": "\u0646\u0633\u0628\u0629 \u0627\u0644\u0631\u0636\u0627",

    // Services
    "services.title": "\u0643\u0644 \u0645\u0627 \u062a\u062d\u062a\u0627\u062c\u0647",
    "services.subtitle": "\u062d\u0644\u0648\u0644 \u062a\u062c\u0627\u0631\u0629 \u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a\u0629 \u0634\u0627\u0645\u0644\u0629 \u0645\u062f\u0639\u0648\u0645\u0629 \u0628\u0623\u062d\u062f\u062b \u0627\u0644\u062a\u0642\u0646\u064a\u0627\u062a",
    "services.ai.title": "\u0628\u0646\u0627\u0621 \u0645\u062a\u062c\u0631 \u0628\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a",
    "services.ai.desc": "\u0623\u0646\u0634\u0626 \u0645\u062a\u062c\u0631\u0643 \u0627\u0644\u0643\u0627\u0645\u0644 \u0645\u0639 \u0645\u0633\u0627\u0639\u062f\u0646\u0627 \u0627\u0644\u0630\u0643\u064a",
    "services.hosting.title": "\u0627\u0633\u062a\u0636\u0627\u0641\u0629 \u0645\u0645\u062a\u0627\u0632\u0629",
    "services.hosting.desc": "\u062e\u0648\u0627\u062f\u0645 \u0641\u0627\u0626\u0642\u0629 \u0627\u0644\u0633\u0631\u0639\u0629 \u0645\u0639 \u0636\u0645\u0627\u0646 99.9% \u0648\u0642\u062a \u0627\u0644\u062a\u0634\u063a\u064a\u0644",
    "services.payments.title": "\u062a\u0643\u0627\u0645\u0644 \u0627\u0644\u062f\u0641\u0639",
    "services.payments.desc": "\u0627\u0642\u0628\u0644 \u0627\u0644\u0645\u062f\u0641\u0648\u0639\u0627\u062a \u0639\u0627\u0644\u0645\u064a\u0627\u064b \u0645\u0639 \u062f\u0639\u0645 \u0645\u062a\u0639\u062f\u062f \u0627\u0644\u0639\u0645\u0644\u0627\u062a",
    "services.analytics.title": "\u062a\u062d\u0644\u064a\u0644\u0627\u062a \u0630\u0643\u064a\u0629",
    "services.analytics.desc": "\u0631\u0624\u0649 \u0645\u0628\u0646\u064a\u0629 \u0639\u0644\u0649 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a \u0644\u062a\u0646\u0645\u064a\u0629 \u0639\u0645\u0644\u0643",
    "services.support.title": "\u062f\u0639\u0645 \u0639\u0644\u0649 \u0645\u062f\u0627\u0631 \u0627\u0644\u0633\u0627\u0639\u0629",
    "services.support.desc": "\u0645\u0633\u0627\u0639\u062f\u0629 \u0627\u0644\u062e\u0628\u0631\u0627\u0621 \u0645\u062a\u0649 \u0627\u062d\u062a\u062c\u062a\u0647\u0627",
    "services.security.title": "\u0623\u0645\u0627\u0646 \u0645\u0624\u0633\u0633\u064a",
    "services.security.desc": "\u0623\u0645\u0627\u0646 \u0628\u0645\u0633\u062a\u0648\u0649 \u0627\u0644\u0628\u0646\u0648\u0643 \u0644\u0645\u062a\u062c\u0631\u0643 \u0648\u0639\u0645\u0644\u0627\u0626\u0643",

    // CTA
    "cta.title": "\u0645\u0633\u062a\u0639\u062f \u0644\u062a\u062d\u0648\u064a\u0644 \u0639\u0645\u0644\u0643\u061f",
    "cta.subtitle": "\u0627\u0646\u0636\u0645 \u0625\u0644\u0649 \u0622\u0644\u0627\u0641 \u0631\u0648\u0627\u062f \u0627\u0644\u0623\u0639\u0645\u0627\u0644 \u0627\u0644\u0630\u064a\u0646 \u0623\u0637\u0644\u0642\u0648\u0627 \u0645\u062a\u0627\u062c\u0631\u0647\u0645 \u0645\u0639 Media Trend",
    "cta.button": "\u0627\u0628\u062f\u0623 \u062a\u062c\u0631\u0628\u062a\u0643 \u0627\u0644\u0645\u062c\u0627\u0646\u064a\u0629",

    // Footer
    "footer.company": "Media Trend",
    "footer.tagline": "\u0646\u0628\u0646\u064a \u0645\u0633\u062a\u0642\u0628\u0644 \u0627\u0644\u062a\u062c\u0627\u0631\u0629 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a\u0629\u060c \u0645\u062a\u062c\u0631 \u062a\u0644\u0648 \u0627\u0644\u0622\u062e\u0631.",
    "footer.services": "\u0627\u0644\u062e\u062f\u0645\u0627\u062a",
    "footer.company_links": "\u0627\u0644\u0634\u0631\u0643\u0629",
    "footer.support": "\u0627\u0644\u062f\u0639\u0645",
    "footer.legal": "\u0642\u0627\u0646\u0648\u0646\u064a",
    "footer.rights": "\u062c\u0645\u064a\u0639 \u0627\u0644\u062d\u0642\u0648\u0642 \u0645\u062d\u0641\u0648\u0638\u0629.",
    "footer.terms": "\u0627\u0644\u0634\u0631\u0648\u0637",
    "footer.privacy": "\u0627\u0644\u062e\u0635\u0648\u0635\u064a\u0629",

    // Auth
    "auth.login": "\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644",
    "auth.signup": "\u0625\u0646\u0634\u0627\u0621 \u062d\u0633\u0627\u0628",
    "auth.email": "\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a",
    "auth.password": "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631",
    "auth.name": "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644",
    "auth.phone": "\u0627\u0644\u0647\u0627\u062a\u0641",
    "auth.company": "\u0627\u0633\u0645 \u0627\u0644\u0634\u0631\u0643\u0629",
    "auth.forgotPassword": "\u0646\u0633\u064a\u062a \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631\u061f",
    "auth.noAccount": "\u0644\u064a\u0633 \u0644\u062f\u064a\u0643 \u062d\u0633\u0627\u0628\u061f",
    "auth.hasAccount": "\u0644\u062f\u064a\u0643 \u062d\u0633\u0627\u0628 \u0628\u0627\u0644\u0641\u0639\u0644\u061f",
    "auth.loginButton": "\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644",
    "auth.signupButton": "\u0625\u0646\u0634\u0627\u0621 \u062d\u0633\u0627\u0628",

    // AI Builder
    "builder.title": "\u0644\u0646\u0628\u0646\u0650 \u0645\u062a\u062c\u0631\u0643",
    "builder.subtitle": "\u0623\u062c\u0628 \u0639\u0644\u0649 \u0628\u0636\u0639 \u0623\u0633\u0626\u0644\u0629 \u0648\u0633\u064a\u0642\u0648\u0645 \u0630\u0643\u0627\u0624\u0646\u0627 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a \u0628\u0625\u0646\u0634\u0627\u0621 \u0645\u062a\u062c\u0631 \u0627\u062d\u062a\u0631\u0627\u0641\u064a \u0644\u0643",
    "builder.start": "\u0627\u0628\u062f\u0623 \u0627\u0644\u0628\u0646\u0627\u0621",
    "builder.generating": "\u062c\u0627\u0631\u064d \u0625\u0646\u0634\u0627\u0621 \u0645\u062a\u062c\u0631\u0643...",
    "builder.complete": "\u0645\u062a\u062c\u0631\u0643 \u062c\u0627\u0647\u0632!",
    "builder.viewStore": "\u0639\u0631\u0636 \u0645\u062a\u062c\u0631\u0643",

    // Common
    "common.loading": "\u062c\u0627\u0631\u064d \u0627\u0644\u062a\u062d\u0645\u064a\u0644...",
    "common.error": "\u062d\u062f\u062b \u062e\u0637\u0623 \u0645\u0627",
    "common.save": "\u062d\u0641\u0638",
    "common.cancel": "\u0625\u0644\u063a\u0627\u0621",
    "common.delete": "\u062d\u0630\u0641",
    "common.edit": "\u062a\u0639\u062f\u064a\u0644",
    "common.create": "\u0625\u0646\u0634\u0627\u0621",
    "common.search": "\u0628\u062d\u062b...",
    "common.noResults": "\u0644\u0627 \u062a\u0648\u062c\u062f \u0646\u062a\u0627\u0626\u062c",
    "common.viewAll": "\u0639\u0631\u0636 \u0627\u0644\u0643\u0644",
    "common.learnMore": "\u0627\u0639\u0631\u0641 \u0627\u0644\u0645\u0632\u064a\u062f",
  },
}

export function t(key: string, locale: Locale = defaultLocale): string {
  return translations[locale]?.[key] || translations.en[key] || key
}

export function isRTL(locale: Locale): boolean {
  return locale === "ar"
}

export function getDirection(locale: Locale): "ltr" | "rtl" {
  return isRTL(locale) ? "rtl" : "ltr"
}
