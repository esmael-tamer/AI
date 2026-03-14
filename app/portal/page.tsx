"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLang } from "@/lib/i18n";
import {
  Store,
  Ticket,
  Settings,
  LogOut,
  Plus,
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  BarChart3,
  MessageSquare,
  CreditCard,
  Truck,
  Warehouse,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  X,
} from "lucide-react";

type StoreData = {
  id: number;
  name_ar: string;
  name_en: string;
  slug: string;
  status: string;
  plan: string;
  payments_status: string;
  shipping_status: string;
  warehousing_status: string;
  created_at: string;
};

type TicketData = {
  id: number;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
  ticket_type?: string;
  store_name_en?: string;
  store_name_ar?: string;
};

type ActivationResult = {
  lead: { id: number };
  tickets: { id: number; type: string }[];
};

const SERVICES = [
  {
    id: "payments" as const,
    icon: CreditCard,
    label_en: "Payment Gateway",
    label_ar: "بوابة الدفع",
    desc_en: "Accept credit cards, Apple Pay, mada and more",
    desc_ar: "قبول البطاقات الائتمانية، آبل باي، مدى والمزيد",
  },
  {
    id: "shipping" as const,
    icon: Truck,
    label_en: "Shipping Integration",
    label_ar: "تكامل الشحن",
    desc_en: "Automated shipping rates and label printing",
    desc_ar: "أسعار شحن تلقائية وطباعة بوليصات الشحن",
  },
  {
    id: "warehousing" as const,
    icon: Warehouse,
    label_en: "Warehousing & Fulfillment",
    label_ar: "التخزين والتوصيل",
    desc_en: "Store inventory and fulfill orders from our warehouses",
    desc_ar: "تخزين المنتجات وتنفيذ الطلبات من مستودعاتنا",
  },
];

const BUSINESS_TYPES = [
  { value: "fashion", label_en: "Fashion", label_ar: "أزياء" },
  { value: "electronics", label_en: "Electronics", label_ar: "إلكترونيات" },
  { value: "food", label_en: "Food", label_ar: "طعام" },
  { value: "beauty", label_en: "Beauty", label_ar: "تجميل" },
  { value: "home", label_en: "Home", label_ar: "منزل" },
  { value: "sports", label_en: "Sports", label_ar: "رياضة" },
  { value: "other", label_en: "Other", label_ar: "أخرى" },
];

const STATUS_LABELS: Record<string, { en: string; ar: string }> = {
  active: { en: "Active", ar: "نشط" },
  live: { en: "Live", ar: "مباشر" },
  demo: { en: "Demo", ar: "تجريبي" },
  pending: { en: "Pending", ar: "قيد المراجعة" },
  suspended: { en: "Suspended", ar: "موقوف" },
};

const PRIORITY_LABELS: Record<string, { en: string; ar: string }> = {
  high: { en: "High", ar: "عالية" },
  medium: { en: "Medium", ar: "متوسطة" },
  low: { en: "Low", ar: "منخفضة" },
};

export default function PortalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, isAr } = useLang();
  const [activeTab, setActiveTab] = useState<"stores" | "tickets" | "settings">("stores");
  const [stores, setStores] = useState<StoreData[]>([]);
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [linkedSlug, setLinkedSlug] = useState<string | null>(null);

  const [activatingStore, setActivatingStore] = useState<StoreData | null>(null);
  const [stepperStep, setStepperStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [activationResult, setActivationResult] = useState<ActivationResult | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [storesRes, ticketsRes] = await Promise.all([
        fetch("/api/portal/stores"),
        fetch("/api/portal/tickets"),
      ]);
      if (storesRes.ok) setStores(await storesRes.json());
      if (ticketsRes.ok) setTickets(await ticketsRes.json());
    } catch (err) {
      console.error("Failed to fetch portal data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const linked = searchParams.get("linked");
    if (linked) setLinkedSlug(linked);
  }, [fetchData, searchParams]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  function openStepper(store: StoreData) {
    setActivatingStore(store);
    setStepperStep(1);
    setSelectedServices([]);
    setBusinessName("");
    setBusinessType("");
    setContactPhone("");
    setNotes("");
    setActivationResult(null);
  }

  function closeStepper() {
    setActivatingStore(null);
    if (activationResult) {
      fetchData();
    }
  }

  function toggleService(serviceId: string) {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((s) => s !== serviceId)
        : [...prev, serviceId]
    );
  }

  async function handleSubmitActivation() {
    if (!activatingStore) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/portal/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          store_id: activatingStore.id,
          services: selectedServices,
          business_name: businessName,
          business_type: businessType,
          contact_phone: contactPhone,
          notes: notes || undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setActivationResult(data);
        setStepperStep(4);
      }
    } catch (err) {
      console.error("Activation failed:", err);
    } finally {
      setSubmitting(false);
    }
  }

  const canProceedStep1 = selectedServices.length > 0;
  const canProceedStep2 = businessName.trim() !== "" && contactPhone.trim() !== "";

  const statusIcon = (status: string) => {
    switch (status) {
      case "active":
      case "live":
        return <CheckCircle2 className="w-4 h-4 text-lime-400" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case "suspended":
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-zinc-400" />;
    }
  };

  const statusLabel = (status: string) => {
    const lbl = STATUS_LABELS[status];
    if (!lbl) return status;
    return isAr ? lbl.ar : lbl.en;
  };

  const priorityLabel = (priority: string) => {
    const lbl = PRIORITY_LABELS[priority];
    if (!lbl) return priority;
    return isAr ? lbl.ar : lbl.en;
  };

  const tabs = [
    { id: "stores" as const, labelEn: "My Stores", labelAr: "متاجري", icon: Store, count: stores.length },
    { id: "tickets" as const, labelEn: "Tickets", labelAr: "التذاكر", icon: Ticket, count: tickets.length },
    { id: "settings" as const, labelEn: "Settings", labelAr: "الإعدادات", icon: Settings, count: 0 },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]" dir={isAr ? "rtl" : "ltr"}>
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white">
            Media<span className="text-lime-400">Trend</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-zinc-400 text-sm">
              {t("Customer Portal", "بوابة العملاء")}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-zinc-400 hover:text-white hover:bg-white/5 gap-2"
            >
              <LogOut className="w-4 h-4" />
              {t("Sign Out", "تسجيل الخروج")}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Linked store banner */}
        {linkedSlug && (
          <div className="mb-6 bg-lime-400/10 border border-lime-400/20 rounded-xl px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-lime-400 shrink-0" />
              <div>
                <p className="text-lime-400 font-semibold text-sm">
                  {t("Your demo store has been saved to your account!", "تم حفظ متجرك التجريبي في حسابك!")}
                </p>
                <p className="text-white/50 text-xs mt-0.5">
                  {t("Activate it below to go live with payments and shipping.", "فعّله أدناه لإطلاقه مع الدفع والشحن.")}
                </p>
              </div>
            </div>
            <Link
              href={`/s/${linkedSlug}`}
              className="flex items-center gap-1.5 text-lime-400 text-sm hover:text-lime-300 transition-colors shrink-0"
            >
              {t("View Store", "عرض المتجر")}
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-lime-400/10 rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-lime-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stores.length}</p>
                <p className="text-zinc-500 text-sm">{t("Active Stores", "المتاجر النشطة")}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400/10 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {tickets.filter((tk) => tk.status === "open").length}
                </p>
                <p className="text-zinc-500 text-sm">{t("Open Tickets", "التذاكر المفتوحة")}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-400/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-zinc-500 text-sm">{t("Total Orders", "إجمالي الطلبات")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-lime-400/10 text-lime-400 border border-lime-400/20"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {isAr ? tab.labelAr : tab.labelEn}
              {tab.count > 0 && (
                <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-lime-400/30 border-t-lime-400 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === "stores" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">
                    {t("My Stores", "متاجري")}
                  </h2>
                  <Link href="/builder">
                    <Button className="bg-lime-400 hover:bg-lime-300 text-black font-semibold rounded-xl gap-2">
                      <Plus className="w-4 h-4" />
                      {t("Create Store", "إنشاء متجر")}
                    </Button>
                  </Link>
                </div>

                {stores.length === 0 ? (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                    <Store className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      {t("No stores yet", "لا توجد متاجر بعد")}
                    </h3>
                    <p className="text-zinc-500 mb-6">
                      {t("Create your first store with our AI builder", "أنشئ أول متجر لك مع منشئنا بالذكاء الاصطناعي")}
                    </p>
                    <Link href="/builder">
                      <Button className="bg-lime-400 hover:bg-lime-300 text-black font-semibold rounded-xl">
                        {t("Start Building", "ابدأ البناء")}
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stores.map((store) => (
                      <div
                        key={store.id}
                        className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-lime-400/20 transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-white font-medium">
                              {isAr ? (store.name_ar || store.name_en) : (store.name_en || store.name_ar)}
                            </h3>
                            {store.name_ar && store.name_en && (
                              <p className="text-zinc-400 text-sm" dir={isAr ? "ltr" : "rtl"}>
                                {isAr ? store.name_en : store.name_ar}
                              </p>
                            )}
                          </div>
                          <Badge
                            variant="outline"
                            className={`text-xs flex items-center gap-1 ${
                              store.status === "active" || store.status === "live"
                                ? "border-lime-400/30 text-lime-400"
                                : store.status === "pending"
                                  ? "border-yellow-400/30 text-yellow-400"
                                  : store.status === "demo"
                                    ? "border-blue-400/30 text-blue-400"
                                    : "border-zinc-400/30 text-zinc-400"
                            }`}
                          >
                            {statusIcon(store.status)}
                            {statusLabel(store.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-zinc-500">
                          <span>{t("Plan", "الخطة")}: {store.plan}</span>
                          <span>
                            {t("Created", "تاريخ الإنشاء")}:{" "}
                            {new Date(store.created_at).toLocaleDateString(isAr ? "ar-SA" : "en-US")}
                          </span>
                        </div>

                        {(store.payments_status !== "inactive" || store.shipping_status !== "inactive" || store.warehousing_status !== "inactive") && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {store.payments_status !== "inactive" && (
                              <Badge variant="outline" className={`text-xs gap-1 ${store.payments_status === "active" ? "border-lime-400/30 text-lime-400" : "border-yellow-400/30 text-yellow-400"}`}>
                                <CreditCard className="w-3 h-3" />
                                {t("Payments", "الدفع")}: {statusLabel(store.payments_status)}
                              </Badge>
                            )}
                            {store.shipping_status !== "inactive" && (
                              <Badge variant="outline" className={`text-xs gap-1 ${store.shipping_status === "active" ? "border-lime-400/30 text-lime-400" : "border-yellow-400/30 text-yellow-400"}`}>
                                <Truck className="w-3 h-3" />
                                {t("Shipping", "الشحن")}: {statusLabel(store.shipping_status)}
                              </Badge>
                            )}
                            {store.warehousing_status !== "inactive" && (
                              <Badge variant="outline" className={`text-xs gap-1 ${store.warehousing_status === "active" ? "border-lime-400/30 text-lime-400" : "border-yellow-400/30 text-yellow-400"}`}>
                                <Warehouse className="w-3 h-3" />
                                {t("Warehousing", "التخزين")}: {statusLabel(store.warehousing_status)}
                              </Badge>
                            )}
                          </div>
                        )}

                        <div className="flex gap-2 mt-4">
                          <Link href={`/s/${store.slug}`} className="flex-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full border-white/10 text-zinc-300 hover:text-white hover:bg-white/5 gap-2 bg-transparent"
                            >
                              <ExternalLink className="w-3 h-3" />
                              {t("View Store", "عرض المتجر")}
                            </Button>
                          </Link>

                          {store.status === "demo" && (
                            <Button
                              size="sm"
                              onClick={() => openStepper(store)}
                              className="flex-1 bg-lime-400 hover:bg-lime-300 text-black font-semibold gap-2"
                            >
                              <ArrowRight className="w-3 h-3" />
                              {t("Activate Store", "تفعيل المتجر")}
                            </Button>
                          )}

                          {store.status === "pending" && (
                            <Badge
                              variant="outline"
                              className="border-yellow-400/30 text-yellow-400 text-xs px-3 py-1.5 self-center gap-1"
                            >
                              <Clock className="w-3 h-3" />
                              {t("Activation Pending", "قيد التفعيل")}
                            </Badge>
                          )}

                          {(store.status === "live" || store.status === "active") && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 border-white/10 text-zinc-300 hover:text-white hover:bg-white/5 gap-2 bg-transparent"
                              >
                                <Settings className="w-3 h-3" />
                                {t("Manage Store", "إدارة المتجر")}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 border-white/10 text-zinc-300 hover:text-white hover:bg-white/5 gap-2 bg-transparent"
                              >
                                <BarChart3 className="w-3 h-3" />
                                {t("Analytics", "التحليلات")}
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "tickets" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">
                    {t("Support Tickets", "تذاكر الدعم")}
                  </h2>
                  <Button className="bg-lime-400 hover:bg-lime-300 text-black font-semibold rounded-xl gap-2">
                    <Plus className="w-4 h-4" />
                    {t("New Ticket", "تذكرة جديدة")}
                  </Button>
                </div>

                {tickets.length === 0 ? (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                    <MessageSquare className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      {t("No tickets", "لا توجد تذاكر")}
                    </h3>
                    <p className="text-zinc-500">
                      {t("You have no support tickets at this time", "ليس لديك تذاكر دعم في الوقت الحالي")}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {tickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-white font-medium text-sm">
                              {ticket.ticket_type === "activation"
                                ? `${ticket.subject} — ${isAr ? (ticket.store_name_ar || ticket.store_name_en) : (ticket.store_name_en || ticket.store_name_ar) || ""}`
                                : ticket.subject}
                            </h3>
                            <p className="text-zinc-500 text-xs mt-1">
                              #{ticket.id} · {ticket.ticket_type === "activation" ? t("Activation", "تفعيل") : t("Support", "دعم")} · {new Date(ticket.created_at).toLocaleDateString(isAr ? "ar-SA" : "en-US")}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                ticket.priority === "high"
                                  ? "border-red-400/30 text-red-400"
                                  : ticket.priority === "medium"
                                    ? "border-yellow-400/30 text-yellow-400"
                                    : "border-zinc-400/30 text-zinc-400"
                              }`}
                            >
                              {priorityLabel(ticket.priority)}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                ticket.status === "open"
                                  ? "border-lime-400/30 text-lime-400"
                                  : "border-zinc-400/30 text-zinc-400"
                              }`}
                            >
                              {statusLabel(ticket.status)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-6">
                  {t("Account Settings", "إعدادات الحساب")}
                </h2>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <p className="text-zinc-400 text-sm">
                    {t(
                      "Account settings coming soon. You can contact support for any account changes.",
                      "إعدادات الحساب قادمة قريباً. يمكنك التواصل مع الدعم لأي تعديلات على حسابك."
                    )}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Activation Stepper Modal */}
      {activatingStore && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeStepper}
          />
          <div className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            <div className="sticky top-0 bg-[#0a0a0a] border-b border-white/10 p-5 flex items-center justify-between z-10 rounded-t-2xl">
              <div>
                <h2 className="text-white font-semibold text-lg">
                  {t("Activate Store", "تفعيل المتجر")}
                </h2>
                <p className="text-zinc-500 text-sm">
                  {isAr ? (activatingStore.name_ar || activatingStore.name_en) : (activatingStore.name_en || activatingStore.name_ar)} — {t("Step", "الخطوة")} {stepperStep} {t("of", "من")} 4
                </p>
              </div>
              <button
                type="button"
                onClick={closeStepper}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-5 pt-4 pb-2">
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      step <= stepperStep ? "bg-lime-400" : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="p-5">
              {stepperStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-white font-medium mb-1">{t("Choose Services", "اختر الخدمات")}</h3>
                    <p className="text-zinc-500 text-sm">{t("Select the services you need", "اختر الخدمات التي تحتاجها")}</p>
                  </div>
                  <div className="space-y-3">
                    {SERVICES.map((service) => {
                      const selected = selectedServices.includes(service.id);
                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => toggleService(service.id)}
                          className={`w-full text-start p-4 rounded-xl border transition-all ${
                            selected
                              ? "border-lime-400/40 bg-lime-400/5"
                              : "border-white/10 bg-white/5 hover:border-white/20"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              selected ? "bg-lime-400/20" : "bg-white/10"
                            }`}>
                              <service.icon className={`w-5 h-5 ${selected ? "text-lime-400" : "text-zinc-400"}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-white font-medium text-sm">{isAr ? service.label_ar : service.label_en}</span>
                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                  selected ? "bg-lime-400 border-lime-400" : "border-white/20"
                                }`}>
                                  {selected && <Check className="w-3 h-3 text-black" />}
                                </div>
                              </div>
                              <p className="text-zinc-400 text-xs mt-1">{isAr ? service.desc_ar : service.desc_en}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {stepperStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-white font-medium mb-1">{t("Business Details", "تفاصيل النشاط التجاري")}</h3>
                    <p className="text-zinc-500 text-sm">{t("Tell us about your business", "أخبرنا عن نشاطك التجاري")}</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-zinc-300 text-sm mb-1.5">
                        {t("Business Name", "اسم النشاط")} <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder={t("Enter your business name", "أدخل اسم نشاطك")}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-lime-400/40 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-300 text-sm mb-1.5">
                        {t("Business Type", "نوع النشاط")}
                      </label>
                      <select
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-lime-400/40 transition-colors appearance-none"
                      >
                        <option value="" className="bg-[#0a0a0a]">{t("Select type...", "اختر النوع...")}</option>
                        {BUSINESS_TYPES.map((bt) => (
                          <option key={bt.value} value={bt.value} className="bg-[#0a0a0a]">
                            {isAr ? bt.label_ar : bt.label_en}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-zinc-300 text-sm mb-1.5">
                        {t("Contact Phone", "رقم التواصل")} <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="+966 5XX XXX XXXX"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-lime-400/40 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-300 text-sm mb-1.5">
                        {t("Notes", "ملاحظات")}
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder={t("Any additional notes...", "أي ملاحظات إضافية...")}
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-lime-400/40 transition-colors resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {stepperStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-white font-medium mb-1">{t("Review & Submit", "مراجعة وإرسال")}</h3>
                    <p className="text-zinc-500 text-sm">{t("Confirm your request before submitting", "تأكد من طلبك قبل الإرسال")}</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                    <div>
                      <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1.5">{t("Selected Services", "الخدمات المختارة")}</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedServices.map((sId) => {
                          const svc = SERVICES.find((s) => s.id === sId);
                          if (!svc) return null;
                          return (
                            <Badge key={sId} variant="outline" className="border-lime-400/30 text-lime-400 text-xs gap-1">
                              <svc.icon className="w-3 h-3" />
                              {isAr ? svc.label_ar : svc.label_en}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-3">
                      <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1.5">{t("Business Details", "تفاصيل النشاط")}</p>
                      <div className="space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-zinc-400 text-sm">{t("Business Name", "اسم النشاط")}</span>
                          <span className="text-white text-sm">{businessName}</span>
                        </div>
                        {businessType && (
                          <div className="flex justify-between">
                            <span className="text-zinc-400 text-sm">{t("Business Type", "نوع النشاط")}</span>
                            <span className="text-white text-sm">
                              {isAr
                                ? BUSINESS_TYPES.find((bt) => bt.value === businessType)?.label_ar
                                : BUSINESS_TYPES.find((bt) => bt.value === businessType)?.label_en
                                || businessType}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-zinc-400 text-sm">{t("Phone", "الهاتف")}</span>
                          <span className="text-white text-sm">{contactPhone}</span>
                        </div>
                        {notes && (
                          <div className="flex justify-between">
                            <span className="text-zinc-400 text-sm">{t("Notes", "ملاحظات")}</span>
                            <span className="text-white text-sm text-end max-w-[200px] truncate">{notes}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-3">
                      <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1.5">{t("Store", "المتجر")}</p>
                      <p className="text-white text-sm">{isAr ? (activatingStore.name_ar || activatingStore.name_en) : (activatingStore.name_en || activatingStore.name_ar)}</p>
                    </div>
                  </div>
                </div>
              )}

              {stepperStep === 4 && activationResult && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-lime-400/10 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-lime-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">{t("Activation Submitted!", "تم تقديم طلب التفعيل!")}</h3>
                    <p className="text-zinc-500 text-sm mt-1">{t("Our team will review and activate your services.", "سيراجع فريقنا طلبك ويفعّل خدماتك.")}</p>
                  </div>
                  <p className="text-zinc-400 text-sm">
                    {t(
                      "You'll be notified once each service is live.",
                      "سيتم إشعارك فور تشغيل كل خدمة."
                    )}
                  </p>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-zinc-500 text-xs uppercase tracking-wider mb-2">{t("Ticket IDs", "أرقام التذاكر")}</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {activationResult.tickets.map((tk) => (
                        <Badge key={tk.id} variant="outline" className="border-lime-400/30 text-lime-400 text-xs">
                          #{tk.id} — {tk.type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-[#0a0a0a] border-t border-white/10 p-5 flex items-center justify-between rounded-b-2xl">
              {stepperStep < 4 ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => stepperStep === 1 ? closeStepper() : setStepperStep((s) => s - 1)}
                    className="text-zinc-400 hover:text-white hover:bg-white/5 gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {stepperStep === 1 ? t("Cancel", "إلغاء") : t("Back", "السابق")}
                  </Button>

                  {stepperStep === 3 ? (
                    <Button
                      size="sm"
                      onClick={handleSubmitActivation}
                      disabled={submitting}
                      className="bg-lime-400 hover:bg-lime-300 text-black font-semibold gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {t("Submitting...", "جاري الإرسال...")}
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          {t("Submit Activation", "إرسال طلب التفعيل")}
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => setStepperStep((s) => s + 1)}
                      disabled={
                        (stepperStep === 1 && !canProceedStep1) ||
                        (stepperStep === 2 && !canProceedStep2)
                      }
                      className="bg-lime-400 hover:bg-lime-300 text-black font-semibold gap-2 disabled:opacity-40"
                    >
                      {t("Next", "التالي")}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  size="sm"
                  onClick={closeStepper}
                  className="bg-lime-400 hover:bg-lime-300 text-black font-semibold gap-2 mx-auto"
                >
                  <Check className="w-4 h-4" />
                  {t("Done", "تم")}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
