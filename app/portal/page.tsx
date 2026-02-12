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
} from "lucide-react";

type StoreData = {
  id: number;
  name_ar: string;
  name_en: string;
  slug: string;
  status: string;
  plan: string;
  created_at: string;
};

type TicketData = {
  id: number;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
};

export default function PortalPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "stores" | "tickets" | "settings"
  >("stores");
  const [stores, setStores] = useState<StoreData[]>([]);
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(true);

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

  const statusIcon = (status: string) => {
    switch (status) {
      case "active":
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
      {/* Header */}
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
        {/* Stats Overview */}
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
              {tab.label}
              {tab.count > 0 && (
                <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-lime-400/30 border-t-lime-400 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Stores Tab */}
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
                              store.status === "active"
                                ? "border-lime-400/30 text-lime-400"
                                : store.status === "pending"
                                  ? "border-yellow-400/30 text-yellow-400"
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
                        <div className="flex gap-2 mt-4">
                          <Link
                            href={`/s/${store.slug}`}
                            className="flex-1"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full border-white/10 text-zinc-300 hover:text-white hover:bg-white/5 gap-2 bg-transparent"
                            >
                              <ExternalLink className="w-3 h-3" />
                              View Store
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tickets Tab */}
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
                              {ticket.subject}
                            </h3>
                            <p className="text-zinc-500 text-xs mt-1">
                              #{ticket.id} - Opened{" "}
                              {new Date(
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

            {/* Settings Tab */}
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
    </div>
  );
}
