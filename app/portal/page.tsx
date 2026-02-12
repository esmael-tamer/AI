"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

export default function PortalPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "stores" | "tickets" | "settings"
  >("stores");
  const [stores, setStores] = useState<StoreData[]>([]);
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(true);

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
  }, [fetchData]);

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

  const tabs = [
    { id: "stores" as const, label: "My Stores", icon: Store, count: stores.length },
    {
      id: "tickets" as const,
      label: "Tickets",
      icon: Ticket,
      count: tickets.length,
    },
    { id: "settings" as const, label: "Settings", icon: Settings, count: 0 },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white">
            Media<span className="text-lime-400">Trend</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-zinc-400 text-sm">Customer Portal</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-zinc-400 hover:text-white hover:bg-white/5"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-lime-400/10 rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-lime-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stores.length}</p>
                <p className="text-zinc-500 text-sm">Active Stores</p>
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
                  {tickets.filter((t) => t.status === "open").length}
                </p>
                <p className="text-zinc-500 text-sm">Open Tickets</p>
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
                <p className="text-zinc-500 text-sm">Total Orders</p>
              </div>
            </div>
          </div>
        </div>

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
              {tab.label}
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
                    My Stores
                  </h2>
                  <Link href="/builder">
                    <Button className="bg-lime-400 hover:bg-lime-300 text-black font-semibold rounded-xl gap-2">
                      <Plus className="w-4 h-4" />
                      Create Store
                    </Button>
                  </Link>
                </div>

                {stores.length === 0 ? (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                    <Store className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      No stores yet
                    </h3>
                    <p className="text-zinc-500 mb-6">
                      Create your first store with our AI builder
                    </p>
                    <Link href="/builder">
                      <Button className="bg-lime-400 hover:bg-lime-300 text-black font-semibold rounded-xl">
                        Start Building
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
                              {store.name_en || store.name_ar}
                            </h3>
                            {store.name_ar && (
                              <p
                                className="text-zinc-400 text-sm"
                                dir="rtl"
                              >
                                {store.name_ar}
                              </p>
                            )}
                          </div>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
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
                            <span className="ml-1">{store.status}</span>
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-zinc-500">
                          <span>Plan: {store.plan}</span>
                          <span>
                            Created:{" "}
                            {new Date(store.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        {(store.payments_status !== "inactive" || store.shipping_status !== "inactive" || store.warehousing_status !== "inactive") && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {store.payments_status !== "inactive" && (
                              <Badge variant="outline" className={`text-xs ${store.payments_status === "active" ? "border-lime-400/30 text-lime-400" : "border-yellow-400/30 text-yellow-400"}`}>
                                <CreditCard className="w-3 h-3" />
                                Payments: {store.payments_status}
                              </Badge>
                            )}
                            {store.shipping_status !== "inactive" && (
                              <Badge variant="outline" className={`text-xs ${store.shipping_status === "active" ? "border-lime-400/30 text-lime-400" : "border-yellow-400/30 text-yellow-400"}`}>
                                <Truck className="w-3 h-3" />
                                Shipping: {store.shipping_status}
                              </Badge>
                            )}
                            {store.warehousing_status !== "inactive" && (
                              <Badge variant="outline" className={`text-xs ${store.warehousing_status === "active" ? "border-lime-400/30 text-lime-400" : "border-yellow-400/30 text-yellow-400"}`}>
                                <Warehouse className="w-3 h-3" />
                                Warehousing: {store.warehousing_status}
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
                              View Store
                            </Button>
                          </Link>

                          {store.status === "demo" && (
                            <Button
                              size="sm"
                              onClick={() => openStepper(store)}
                              className="flex-1 bg-lime-400 hover:bg-lime-300 text-black font-semibold gap-2"
                            >
                              <ArrowRight className="w-3 h-3" />
                              Activate Store
                            </Button>
                          )}

                          {store.status === "pending" && (
                            <Badge
                              variant="outline"
                              className="border-yellow-400/30 text-yellow-400 text-xs px-3 py-1.5 self-center"
                            >
                              <Clock className="w-3 h-3" />
                              Activation Pending
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
                                Manage Store
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 border-white/10 text-zinc-300 hover:text-white hover:bg-white/5 gap-2 bg-transparent"
                              >
                                <BarChart3 className="w-3 h-3" />
                                View Analytics
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
                    Support Tickets
                  </h2>
                  <Button className="bg-lime-400 hover:bg-lime-300 text-black font-semibold rounded-xl gap-2">
                    <Plus className="w-4 h-4" />
                    New Ticket
                  </Button>
                </div>

                {tickets.length === 0 ? (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                    <MessageSquare className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      No tickets
                    </h3>
                    <p className="text-zinc-500">
                      You have no support tickets at this time
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
                                ? `${ticket.subject} — ${ticket.store_name_en || ticket.store_name_ar || ""}`
                                : ticket.subject}
                            </h3>
                            <p className="text-zinc-500 text-xs mt-1">
                              #{ticket.id} · {ticket.ticket_type === "activation" ? "Activation" : "Support"} · {new Date(
                                ticket.created_at
                              ).toLocaleDateString()}
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
                              {ticket.priority}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                ticket.status === "open"
                                  ? "border-lime-400/30 text-lime-400"
                                  : "border-zinc-400/30 text-zinc-400"
                              }`}
                            >
                              {ticket.status}
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
                  Account Settings
                </h2>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <p className="text-zinc-400 text-sm">
                    Account settings coming soon. You can contact support for any
                    account changes.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

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
                  Activate Store
                </h2>
                <p className="text-zinc-500 text-sm">
                  {activatingStore.name_en || activatingStore.name_ar} — Step {stepperStep} of 4
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
                    <h3 className="text-white font-medium mb-1">Choose Services</h3>
                    <p className="text-zinc-500 text-sm" dir="rtl">اختر الخدمات التي تحتاجها</p>
                  </div>
                  <div className="space-y-3">
                    {SERVICES.map((service) => {
                      const selected = selectedServices.includes(service.id);
                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => toggleService(service.id)}
                          className={`w-full text-left p-4 rounded-xl border transition-all ${
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
                                <span className="text-white font-medium text-sm">{service.label_en}</span>
                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                  selected ? "bg-lime-400 border-lime-400" : "border-white/20"
                                }`}>
                                  {selected && <Check className="w-3 h-3 text-black" />}
                                </div>
                              </div>
                              <p className="text-zinc-500 text-xs mt-0.5" dir="rtl">{service.label_ar}</p>
                              <p className="text-zinc-400 text-xs mt-1">{service.desc_en}</p>
                              <p className="text-zinc-500 text-xs mt-0.5" dir="rtl">{service.desc_ar}</p>
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
                    <h3 className="text-white font-medium mb-1">Business Details</h3>
                    <p className="text-zinc-500 text-sm" dir="rtl">تفاصيل النشاط التجاري</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-zinc-300 text-sm mb-1.5">
                        Business Name <span className="text-zinc-500">/ اسم النشاط</span> <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Enter your business name"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-lime-400/40 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-300 text-sm mb-1.5">
                        Business Type <span className="text-zinc-500">/ نوع النشاط</span>
                      </label>
                      <select
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-lime-400/40 transition-colors appearance-none"
                      >
                        <option value="" className="bg-[#0a0a0a]">Select type...</option>
                        {BUSINESS_TYPES.map((bt) => (
                          <option key={bt.value} value={bt.value} className="bg-[#0a0a0a]">
                            {bt.label_en} / {bt.label_ar}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-zinc-300 text-sm mb-1.5">
                        Contact Phone <span className="text-zinc-500">/ رقم التواصل</span> <span className="text-red-400">*</span>
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
                        Notes <span className="text-zinc-500">/ ملاحظات</span>
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any additional notes..."
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
                    <h3 className="text-white font-medium mb-1">Review & Submit</h3>
                    <p className="text-zinc-500 text-sm" dir="rtl">مراجعة وإرسال</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                    <div>
                      <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1.5">Selected Services</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedServices.map((sId) => {
                          const svc = SERVICES.find((s) => s.id === sId);
                          if (!svc) return null;
                          return (
                            <Badge key={sId} variant="outline" className="border-lime-400/30 text-lime-400 text-xs gap-1">
                              <svc.icon className="w-3 h-3" />
                              {svc.label_en}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-3">
                      <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1.5">Business Details</p>
                      <div className="space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-zinc-400 text-sm">Business Name</span>
                          <span className="text-white text-sm">{businessName}</span>
                        </div>
                        {businessType && (
                          <div className="flex justify-between">
                            <span className="text-zinc-400 text-sm">Business Type</span>
                            <span className="text-white text-sm">{BUSINESS_TYPES.find((bt) => bt.value === businessType)?.label_en || businessType}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-zinc-400 text-sm">Phone</span>
                          <span className="text-white text-sm">{contactPhone}</span>
                        </div>
                        {notes && (
                          <div className="flex justify-between">
                            <span className="text-zinc-400 text-sm">Notes</span>
                            <span className="text-white text-sm text-right max-w-[200px] truncate">{notes}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-3">
                      <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1.5">Store</p>
                      <p className="text-white text-sm">{activatingStore.name_en || activatingStore.name_ar}</p>
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
                    <h3 className="text-white font-semibold text-lg">Activation Submitted!</h3>
                    <p className="text-zinc-500 text-sm" dir="rtl">تم تقديم طلب التفعيل بنجاح</p>
                  </div>
                  <p className="text-zinc-400 text-sm">
                    Our team will review your request and activate your services. You&apos;ll be notified once each service is live.
                  </p>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-zinc-500 text-xs uppercase tracking-wider mb-2">Ticket IDs</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {activationResult.tickets.map((t) => (
                        <Badge key={t.id} variant="outline" className="border-lime-400/30 text-lime-400 text-xs">
                          #{t.id} — {t.type}
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
                    {stepperStep === 1 ? "Cancel" : "Back"}
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
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Submit Activation
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
                      Next
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
                  Done
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
