"use client"

import React from "react"

import MTHeader from "@/components/mt-header"
import MTFooter from "@/components/mt-footer"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import { useState } from "react"
import { useLang } from "@/lib/i18n"

export default function ContactPage() {
  const { t, isAr } = useLang()
  const [formState, setFormState] = useState({ name: "", email: "", phone: "", message: "", service: "" })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      })
      if (res.ok) setSubmitted(true)
    } catch {
      // handle error
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen">
      <MTHeader />

      <section className="pt-32 pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground text-balance">
              {t("Get in", "تواصل")} <span className="text-[#a3e635]">{t("Touch", "معنا")}</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto text-pretty">
              {t("Have a question or want to start a project? We would love to hear from you.", "لديك سؤال أو تريد بدء مشروع؟ نحب أن نسمع منك.")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-border-subtle rounded-2xl p-6">
                <Mail className="w-5 h-5 text-[#a3e635] mb-3" />
                <h3 className="text-sm font-semibold text-foreground">{t("Email", "البريد الإلكتروني")}</h3>
                <p className="text-sm text-muted-foreground mt-1">hello@mediatrend.com</p>
              </div>
              <div className="glass-border-subtle rounded-2xl p-6">
                <Phone className="w-5 h-5 text-[#a3e635] mb-3" />
                <h3 className="text-sm font-semibold text-foreground">{t("Phone", "الهاتف")}</h3>
                <p className="text-sm text-muted-foreground mt-1">+966 50 123 4567</p>
              </div>
              <div className="glass-border-subtle rounded-2xl p-6">
                <MapPin className="w-5 h-5 text-[#a3e635] mb-3" />
                <h3 className="text-sm font-semibold text-foreground">{t("Office", "المكتب")}</h3>
                <p className="text-sm text-muted-foreground mt-1">{t("Riyadh, Saudi Arabia", "الرياض، المملكة العربية السعودية")}</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="glass-border rounded-2xl p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#a3e635]/20 mx-auto mb-4 flex items-center justify-center">
                    <Send className="w-7 h-7 text-[#a3e635]" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{t("Message Sent!", "تم إرسال الرسالة!")}</h3>
                  <p className="mt-2 text-muted-foreground">{t("We will get back to you within 24 hours.", "سنرد عليك خلال 24 ساعة.")}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="glass-border rounded-2xl p-6 sm:p-8 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-sm font-medium text-foreground mb-1.5">{t("Name", "الاسم")}</label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-[#a3e635]/50 transition-colors"
                        placeholder={t("Your name", "اسمك")}
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-sm font-medium text-foreground mb-1.5">{t("Email", "البريد")}</label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-[#a3e635]/50 transition-colors"
                        placeholder={t("your@email.com", "بريدك@مثال.com")}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="block text-sm font-medium text-foreground mb-1.5">{t("Phone", "الهاتف")}</label>
                    <input
                      id="contact-phone"
                      type="tel"
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-[#a3e635]/50 transition-colors"
                      placeholder="+966 50 XXX XXXX"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-service" className="block text-sm font-medium text-foreground mb-1.5">{t("Service Interest", "الخدمة المطلوبة")}</label>
                    <select
                      id="contact-service"
                      value={formState.service}
                      onChange={(e) => setFormState({ ...formState, service: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm focus:outline-none focus:border-[#a3e635]/50 transition-colors"
                    >
                      <option value="" className="bg-black">{t("Select a service", "اختر خدمة")}</option>
                      <option value="store-builder" className="bg-black">{t("AI Store Builder", "بناء المتاجر")}</option>
                      <option value="hosting" className="bg-black">{t("Premium Hosting", "استضافة متميزة")}</option>
                      <option value="payments" className="bg-black">{t("Payment Integration", "تكامل الدفع")}</option>
                      <option value="custom" className="bg-black">{t("Custom Solution", "حل مخصص")}</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-medium text-foreground mb-1.5">{t("Message", "الرسالة")}</label>
                    <textarea
                      id="contact-message"
                      required
                      rows={4}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-[#a3e635]/50 transition-colors resize-none"
                      placeholder={t("Tell us about your project...", "أخبرنا عن مشروعك...")}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-[#a3e635] text-black font-semibold rounded-xl hover:bg-[#bef264] transition-colors disabled:opacity-50"
                  >
                    {submitting ? t("Sending...", "جاري الإرسال...") : t("Send Message", "إرسال الرسالة")}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <MTFooter />
    </main>
  )
}
