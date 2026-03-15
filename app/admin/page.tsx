"use client";

import React from "react"

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Store,
  Users,
  FileText,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Search,
  Bell,
  ChevronLeft,
  Menu,
  Plus,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  UserCheck,
  Newspaper,
  Briefcase,
  Handshake,
  ScrollText,
  Shield,
  TrendingUp,
  DollarSign,
  Activity,
} from "lucide-react";

type Section =
  | "dashboard"
  | "stores"
  | "users"
  | "leads"
  | "tickets"
  | "blog"
  | "team"
  | "partners"
  | "cases"
  | "pages"
  | "audit";

interface DashboardStats {
  stores: number;
  users: number;
  leads: number;
  tickets: number;
  blog: number;
  revenue: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [section, setSection] = useState<Section>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    stores: 0,
    users: 0,
    leads: 0,
    tickets: 0,
    blog: 0,
    revenue: "0",
  });
  const [data, setData] = useState<Record<string, Record<string, unknown>[]>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const s = await res.json();
        setStats(s);
      }
    } catch (err) {
      console.error("Stats fetch error:", err);
    }
  }, []);

  const fetchSection = useCallback(async (sec: string) => {
    try {
      const res = await fetch(`/api/admin/${sec}`);
      if (res.ok) {
        const d: Record<string, unknown>[] = await res.json();
        setData((prev) => ({ ...prev, [sec]: d }));
      }
    } catch (err) {
      console.error(`Fetch ${sec} error:`, err);
    }
  }, []);

  useEffect(() => {
    fetchStats().then(() => setLoading(false));
  }, [fetchStats]);

  useEffect(() => {
    if (section !== "dashboard") {
      fetchSection(section);
    }
  }, [section, fetchSection]);

  async function handleDelete(sec: string, id: number) {
    if (!confirm(`Are you sure you want to delete this item?`)) return;
    setDeletingId(id);
    try {
      const endpointMap: Record<string, string> = {
        blog: "blog",
        team: "team",
        partners: "partners",
        cases: "cases",
        pages: "pages",
        stores: "stores",
        users: "users",
        leads: "leads",
        tickets: "tickets",
      };
      const endpoint = endpointMap[sec];
      if (!endpoint) return;
      const res = await fetch(`/api/admin/${endpoint}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setData((prev) => ({
          ...prev,
          [sec]: (prev[sec] || []).filter((item) => item.id !== id),
        }));
      }
    } catch (err) {
      console.error(`Delete ${sec} error:`, err);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    document.cookie =
      "admin-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/admin/login");
  }

  const navItems: { id: Section; label: string; icon: typeof Store }[] = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "stores", label: "Stores", icon: Store },
    { id: "users", label: "Users", icon: Users },
    { id: "leads", label: "Leads", icon: UserCheck },
    { id: "tickets", label: "Tickets", icon: MessageSquare },
    { id: "blog", label: "Blog", icon: Newspaper },
    { id: "team", label: "Team", icon: Briefcase },
    { id: "partners", label: "Partners", icon: Handshake },
    { id: "cases", label: "Case Studies", icon: ScrollText },
    { id: "pages", label: "Pages", icon: FileText },
    { id: "audit", label: "Audit Log", icon: Shield },
  ];

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: "border-lime-400/30 text-lime-400",
      pending: "border-yellow-400/30 text-yellow-400",
      suspended: "border-red-400/30 text-red-400",
      open: "border-blue-400/30 text-blue-400",
      closed: "border-zinc-400/30 text-zinc-400",
      resolved: "border-lime-400/30 text-lime-400",
      draft: "border-zinc-400/30 text-zinc-400",
      published: "border-lime-400/30 text-lime-400",
      admin: "border-lime-400/30 text-lime-400",
      customer: "border-blue-400/30 text-blue-400",
      new: "border-blue-400/30 text-blue-400",
      contacted: "border-yellow-400/30 text-yellow-400",
      converted: "border-lime-400/30 text-lime-400",
    };
    return (
      <Badge
        variant="outline"
        className={`text-xs ${colors[status] || "border-zinc-400/30 text-zinc-400"}`}
      >
        {status}
      </Badge>
    );
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case "active":
      case "published":
      case "resolved":
        return <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />;
      case "pending":
      case "open":
        return <Clock className="w-3.5 h-3.5 text-yellow-400" />;
      case "suspended":
      case "closed":
        return <XCircle className="w-3.5 h-3.5 text-red-400" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  const DELETABLE_SECTIONS = ["blog", "team", "partners", "cases", "pages", "stores", "users", "leads", "tickets"];

  const renderTable = (
    items: Record<string, unknown>[],
    columns: { key: string; label: string; render?: (v: unknown, row: Record<string, unknown>) => React.ReactNode }[],
    sectionKey?: string
  ) => {
    const filtered = searchQuery.trim()
      ? items.filter((item) =>
          Object.values(item).some((v) =>
            String(v || "").toLowerCase().includes(searchQuery.toLowerCase())
          )
        )
      : items;

    return (
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="text-left px-4 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wider"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="text-right px-4 py-3 text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((item, i) => (
                <tr
                  key={String(item.id || i)}
                  className="hover:bg-white/5 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-3 text-sm text-zinc-300"
                    >
                      {col.render
                        ? col.render(item[col.key], item)
                        : String(item[col.key] || "-")}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-zinc-400 hover:text-white hover:bg-white/10"
                        title="View"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      {sectionKey && DELETABLE_SECTIONS.includes(sectionKey) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={deletingId === Number(item.id)}
                          onClick={() => handleDelete(sectionKey, Number(item.id))}
                          className="h-7 w-7 p-0 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-zinc-500 text-sm">
            {searchQuery ? "No results match your search" : "No data found"}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-[#0a0a0a] border-r border-white/5 flex flex-col transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-white/5">
          {sidebarOpen ? (
            <div className="flex items-center justify-between w-full">
              <h1 className="text-lg font-bold text-white">
                Media<span className="text-lime-400">Trend</span>
              </h1>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="text-zinc-400 hover:text-white p-1"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="text-zinc-400 hover:text-white p-1 mx-auto"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="flex flex-col gap-1 px-2">
            {navItems.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  section === item.id
                    ? "bg-lime-400/10 text-lime-400"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                } ${!sidebarOpen ? "justify-center" : ""}`}
                title={item.label}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-white/5">
          <button
            type="button"
            onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-red-400 hover:bg-red-400/5 w-full transition-all ${
              !sidebarOpen ? "justify-center" : ""
            }`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}
      >
        {/* Top bar */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-xl z-40">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-white capitalize">
              {section === "cases" ? "Case Studies" : section}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 w-64 h-9 focus:border-lime-400/30"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-white hover:bg-white/5 relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-lime-400 rounded-full" />
            </Button>
          </div>
        </header>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-lime-400/30 border-t-lime-400 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Dashboard Overview */}
              {section === "dashboard" && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {[
                      {
                        label: "Total Stores",
                        value: stats.stores,
                        icon: Store,
                        color: "lime",
                      },
                      {
                        label: "Total Users",
                        value: stats.users,
                        icon: Users,
                        color: "blue",
                      },
                      {
                        label: "New Leads",
                        value: stats.leads,
                        icon: TrendingUp,
                        color: "yellow",
                      },
                      {
                        label: "Open Tickets",
                        value: stats.tickets,
                        icon: MessageSquare,
                        color: "orange",
                      },
                      {
                        label: "Blog Posts",
                        value: stats.blog,
                        icon: Newspaper,
                        color: "purple",
                      },
                      {
                        label: "Revenue",
                        value: stats.revenue,
                        icon: DollarSign,
                        color: "lime",
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-zinc-500 text-sm">
                              {stat.label}
                            </p>
                            <p className="text-2xl font-bold text-white mt-1">
                              {stat.value}
                            </p>
                          </div>
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              stat.color === "lime"
                                ? "bg-lime-400/10"
                                : stat.color === "blue"
                                  ? "bg-blue-400/10"
                                  : stat.color === "yellow"
                                    ? "bg-yellow-400/10"
                                    : stat.color === "orange"
                                      ? "bg-orange-400/10"
                                      : "bg-purple-400/10"
                            }`}
                          >
                            <stat.icon
                              className={`w-5 h-5 ${
                                stat.color === "lime"
                                  ? "text-lime-400"
                                  : stat.color === "blue"
                                    ? "text-blue-400"
                                    : stat.color === "yellow"
                                      ? "text-yellow-400"
                                      : stat.color === "orange"
                                        ? "text-orange-400"
                                        : "text-purple-400"
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <h3 className="text-white font-semibold mb-4">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: "View Stores", sec: "stores" as Section, icon: Store },
                      { label: "Manage Users", sec: "users" as Section, icon: Users },
                      { label: "View Leads", sec: "leads" as Section, icon: UserCheck },
                      { label: "Support Tickets", sec: "tickets" as Section, icon: MessageSquare },
                    ].map((action) => (
                      <button
                        type="button"
                        key={action.label}
                        onClick={() => setSection(action.sec)}
                        className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-lime-400/20 hover:bg-lime-400/5 transition-all text-left"
                      >
                        <action.icon className="w-5 h-5 text-lime-400 mb-2" />
                        <p className="text-white text-sm font-medium">
                          {action.label}
                        </p>
                      </button>
                    ))}
                  </div>

                  {/* Recent Activity */}
                  <h3 className="text-white font-semibold mt-8 mb-4">
                    Recent Activity
                  </h3>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <div className="flex flex-col gap-4">
                      {[
                        {
                          text: "Platform launched",
                          time: "Just now",
                          icon: Activity,
                        },
                        {
                          text: "Admin account created",
                          time: "Just now",
                          icon: Shield,
                        },
                        {
                          text: "Database initialized",
                          time: "Just now",
                          icon: Settings,
                        },
                      ].map((activity, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3"
                        >
                          <div className="w-8 h-8 bg-lime-400/10 rounded-full flex items-center justify-center">
                            <activity.icon className="w-4 h-4 text-lime-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-zinc-300 text-sm">
                              {activity.text}
                            </p>
                            <p className="text-zinc-600 text-xs">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Stores Section */}
              {section === "stores" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-zinc-400 text-sm">
                      Manage all customer stores
                    </p>
                    <Button className="bg-lime-400 hover:bg-lime-300 text-black font-semibold rounded-xl gap-2">
                      <Plus className="w-4 h-4" />
                      Add Store
                    </Button>
                  </div>
                  {renderTable(
                    (data.stores as Record<string, unknown>[]) || [],
                    [
                      { key: "id", label: "ID" },
                      {
                        key: "name_en",
                        label: "Name",
                        render: (v, row) => (
                          <div>
                            <p className="text-white font-medium">
                              {String(v || row.name_ar || "-")}
                            </p>
                            {row.name_ar && (
                              <p className="text-zinc-500 text-xs" dir="rtl">
                                {String(row.name_ar)}
                              </p>
                            )}
                          </div>
                        ),
                      },
                      { key: "slug", label: "Slug" },
                      {
                        key: "status",
                        label: "Status",
                        render: (v) => (
                          <div className="flex items-center gap-1.5">
                            {statusIcon(String(v))}
                            {statusBadge(String(v))}
                          </div>
                        ),
                      },
                      { key: "plan", label: "Plan" },
                      {
                        key: "created_at",
                        label: "Created",
                        render: (v) =>
                          new Date(String(v)).toLocaleDateString(),
                      },
                    ],
                    "stores"
                  )}
                </div>
              )}

              {/* Users Section */}
              {section === "users" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-zinc-400 text-sm">
                      Manage platform users
                    </p>
                    <Button className="bg-lime-400 hover:bg-lime-300 text-black font-semibold rounded-xl gap-2">
                      <Plus className="w-4 h-4" />
                      Add User
                    </Button>
                  </div>
                  {renderTable(
                    (data.users as Record<string, unknown>[]) || [],
                    [
                      { key: "id", label: "ID" },
                      { key: "email", label: "Email" },
                      {
                        key: "name_en",
                        label: "Name",
                        render: (v, row) =>
                          String(v || row.name_ar || "-"),
                      },
                      {
                        key: "role",
                        label: "Role",
                        render: (v) => statusBadge(String(v)),
                      },
                      { key: "phone", label: "Phone" },
                      {
                        key: "created_at",
                        label: "Joined",
                        render: (v) =>
                          new Date(String(v)).toLocaleDateString(),
                      },
                    ],
                    "users"
                  )}
                </div>
              )}

              {/* Leads Section */}
              {section === "leads" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-zinc-400 text-sm">
                      Track incoming leads
                    </p>
                  </div>
                  {renderTable(
                    (data.leads as Record<string, unknown>[]) || [],
                    [
                      { key: "id", label: "ID" },
                      { key: "name", label: "Name" },
                      { key: "email", label: "Email" },
                      { key: "phone", label: "Phone" },
                      {
                        key: "status",
                        label: "Status",
                        render: (v) => statusBadge(String(v || "new")),
                      },
                      { key: "source", label: "Source" },
                      {
                        key: "created_at",
                        label: "Date",
                        render: (v) =>
                          new Date(String(v)).toLocaleDateString(),
                      },
                    ],
                    "leads"
                  )}
                </div>
              )}

              {/* Tickets Section */}
              {section === "tickets" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-zinc-400 text-sm">
                      Support tickets overview
                    </p>
                  </div>
                  {renderTable(
                    (data.tickets as Record<string, unknown>[]) || [],
                    [
                      { key: "id", label: "ID" },
                      { key: "subject", label: "Subject" },
                      {
                        key: "status",
                        label: "Status",
                        render: (v) => (
                          <div className="flex items-center gap-1.5">
                            {statusIcon(String(v))}
                            {statusBadge(String(v))}
                          </div>
                        ),
                      },
                      {
                        key: "priority",
                        label: "Priority",
                        render: (v) => statusBadge(String(v)),
                      },
                      {
                        key: "created_at",
                        label: "Created",
                        render: (v) =>
                          new Date(String(v)).toLocaleDateString(),
                      },
                    ],
                    "tickets"
                  )}
                </div>
              )}

              {/* Blog Section */}
              {section === "blog" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-zinc-400 text-sm">
                      Manage blog posts
                    </p>
                    <Button className="bg-lime-400 hover:bg-lime-300 text-black font-semibold rounded-xl gap-2">
                      <Plus className="w-4 h-4" />
                      New Post
                    </Button>
                  </div>
                  {renderTable(
                    (data.blog as Record<string, unknown>[]) || [],
                    [
                      { key: "id", label: "ID" },
                      {
                        key: "title_en",
                        label: "Title",
                        render: (v, row) =>
                          String(v || row.title_ar || "-"),
                      },
                      { key: "slug", label: "Slug" },
                      {
                        key: "status",
                        label: "Status",
                        render: (v) => statusBadge(String(v)),
                      },
                      {
                        key: "created_at",
                        label: "Published",
                        render: (v) =>
                          new Date(String(v)).toLocaleDateString(),
                      },
                    ],
                    "blog"
                  )}
                </div>
              )}

              {/* Team Section */}
              {section === "team" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-zinc-400 text-sm">
                      Manage team members
                    </p>
                    <Button className="bg-lime-400 hover:bg-lime-300 text-black font-semibold rounded-xl gap-2">
                      <Plus className="w-4 h-4" />
                      Add Member
                    </Button>
                  </div>
                  {renderTable(
                    (data.team as Record<string, unknown>[]) || [],
                    [
                      { key: "id", label: "ID" },
                      {
                        key: "name_en",
                        label: "Name",
                        render: (v, row) =>
                          String(v || row.name_ar || "-"),
                      },
                      {
                        key: "role_en",
                        label: "Role",
                        render: (v, row) =>
                          String(v || row.role_ar || "-"),
                      },
                      { key: "email", label: "Email" },
                      {
                        key: "display_order",
                        label: "Order",
                      },
                    ],
                    "team"
                  )}
                </div>
              )}

              {/* Partners Section */}
              {section === "partners" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-zinc-400 text-sm">
                      Manage partner logos & info
                    </p>
                    <Button className="bg-lime-400 hover:bg-lime-300 text-black font-semibold rounded-xl gap-2">
                      <Plus className="w-4 h-4" />
                      Add Partner
                    </Button>
                  </div>
                  {renderTable(
                    (data.partners as Record<string, unknown>[]) || [],
                    [
                      { key: "id", label: "ID" },
                      {
                        key: "name_en",
                        label: "Name",
                        render: (v, row) =>
                          String(v || row.name_ar || "-"),
                      },
                      { key: "website", label: "Website" },
                      {
                        key: "is_active",
                        label: "Active",
                        render: (v) =>
                          v ? (
                            <CheckCircle2 className="w-4 h-4 text-lime-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-zinc-500" />
                          ),
                      },
                    ],
                    "partners"
                  )}
                </div>
              )}

              {/* Case Studies Section */}
              {section === "cases" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-zinc-400 text-sm">
                      Manage case studies / portfolio
                    </p>
                    <Button className="bg-lime-400 hover:bg-lime-300 text-black font-semibold rounded-xl gap-2">
                      <Plus className="w-4 h-4" />
                      Add Case Study
                    </Button>
                  </div>
                  {renderTable(
                    (data.cases as Record<string, unknown>[]) || [],
                    [
                      { key: "id", label: "ID" },
                      {
                        key: "title_en",
                        label: "Title",
                        render: (v, row) =>
                          String(v || row.title_ar || "-"),
                      },
                      { key: "client_name", label: "Client" },
                      {
                        key: "is_featured",
                        label: "Featured",
                        render: (v) =>
                          v ? (
                            <Badge
                              variant="outline"
                              className="border-lime-400/30 text-lime-400 text-xs"
                            >
                              Featured
                            </Badge>
                          ) : (
                            <span className="text-zinc-500 text-xs">No</span>
                          ),
                      },
                    ],
                    "cases"
                  )}
                </div>
              )}

              {/* Pages Section */}
              {section === "pages" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-zinc-400 text-sm">
                      Manage static pages
                    </p>
                    <Button className="bg-lime-400 hover:bg-lime-300 text-black font-semibold rounded-xl gap-2">
                      <Plus className="w-4 h-4" />
                      New Page
                    </Button>
                  </div>
                  {renderTable(
                    (data.pages as Record<string, unknown>[]) || [],
                    [
                      { key: "id", label: "ID" },
                      {
                        key: "title_en",
                        label: "Title",
                        render: (v, row) =>
                          String(v || row.title_ar || "-"),
                      },
                      { key: "slug", label: "Slug" },
                      {
                        key: "is_published",
                        label: "Published",
                        render: (v) =>
                          v ? (
                            <CheckCircle2 className="w-4 h-4 text-lime-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-zinc-500" />
                          ),
                      },
                    ],
                    "pages"
                  )}
                </div>
              )}

              {/* Audit Log Section */}
              {section === "audit" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-zinc-400 text-sm">
                      System activity log
                    </p>
                  </div>
                  {renderTable(
                    (data.audit as Record<string, unknown>[]) || [],
                    [
                      { key: "id", label: "ID" },
                      { key: "action", label: "Action" },
                      { key: "entity_type", label: "Entity" },
                      { key: "entity_id", label: "Entity ID" },
                      { key: "user_id", label: "User ID" },
                      {
                        key: "created_at",
                        label: "Time",
                        render: (v) =>
                          new Date(String(v)).toLocaleString(),
                      },
                    ],
                    "audit"
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
