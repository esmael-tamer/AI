"use client";

import React from "react"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid credentials");
        setIsLoading(false);
        return;
      }

      if (data.user.role !== "admin") {
        setError("Access denied. Admin only.");
        setIsLoading(false);
        return;
      }

      router.push("/admin");
    } catch {
      setError("Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col md:flex-row">
      {/* Left side - branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-lime-600/20 to-lime-400/5 border-r border-white/5 p-12 flex-col justify-between">
        <div>
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-bold text-white">
              Media<span className="text-lime-400">Trend</span>
            </h1>
          </Link>
          <h2 className="text-4xl font-bold text-white mt-12">
            Admin Dashboard
          </h2>
          <p className="text-zinc-400 mt-4 max-w-md">
            Manage stores, users, content, and your entire ecommerce platform
            from one central hub.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-auto">
          {["Stores", "Users", "Blog", "Analytics"].map((item) => (
            <div
              key={item}
              className="bg-white/5 border border-white/10 rounded-xl p-4"
            >
              <p className="text-lime-400 text-sm font-medium">{item}</p>
              <p className="text-zinc-500 text-xs mt-1">Full CRUD management</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right side - login form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <div className="flex md:hidden items-center gap-3 mb-8 w-full">
          <h1 className="text-2xl font-bold text-white">
            Media<span className="text-lime-400">Trend</span>
          </h1>
        </div>

        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white">
              Sign in to Admin
            </h2>
            <p className="text-zinc-400 mt-2">
              Enter your credentials to access the dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg flex items-center gap-3">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-zinc-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@mediatrend.sa"
                className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-lime-400/50"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-zinc-200">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-lime-400/50"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-lime-400 text-black hover:bg-lime-300 font-semibold h-11 rounded-xl"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

        </div>
      </div>
    </div>
  );
}
