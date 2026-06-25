/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Users,
  Bell,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  TrendingUp,
  Activity,
  Send
} from "lucide-react";

export const AdminPortal: React.FC = () => {
  const [finances, setFinances] = useState<any>(null);
  const [pendingCoaches, setPendingCoaches] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Notification form state
  const [notifTitle, setNotifTitle] = useState("");
  const [notifContent, setNotifContent] = useState("");
  const [notifStatus, setNotifStatus] = useState<"idle" | "success" | "error">("idle");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [finRes, coachesRes, usersRes] = await Promise.all([
        fetch("/api/admin/finances").then(r => r.json()),
        fetch("/api/admin/coaches/pending").then(r => r.json()),
        fetch("/api/admin/users").then(r => r.json())
      ]);

      if (usersRes.success) setUsersList(usersRes.data);

      if (finRes.success) setFinances(finRes.data);
      if (coachesRes.success) setPendingCoaches(coachesRes.data);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApproveCoach = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/coaches/${id}/approve`, {
        method: "PATCH"
      });
      const data = await res.json();
      if (data.success) {
        setPendingCoaches(prev => prev.filter(c => c.id !== id));
      }
    } catch (error) {
      console.error("Error approving coach:", error);
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotifStatus("idle");
    try {
      const res = await fetch(`/api/admin/notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: notifTitle,
          content: notifContent,
          type: "SYSTEM"
        })
      });
      const data = await res.json();
      if (data.success) {
        setNotifStatus("success");
        setNotifTitle("");
        setNotifContent("");
        setTimeout(() => setNotifStatus("idle"), 3000);
      } else {
        setNotifStatus("error");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      setNotifStatus("error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-800/60">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-[10px] font-bold text-indigo-400 tracking-wider">ADMIN PORTAL</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">پنل مدیریت</h1>
          <p className="text-sm text-zinc-400 max-w-xl leading-relaxed">
            گزارش‌های مالی، مدیریت مربیان و اطلاع‌رسانی پلتفرم
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Activity className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-400 mb-1">کل درآمد پلتفرم</h3>
                    <p className="text-2xl font-black text-white font-mono">
                      {finances?.kpi?.totalRevenue?.toLocaleString("fa-IR") || "0"} <span className="text-sm text-zinc-500 font-sans">تومان</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all" />
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-400 mb-1">سود پلتفرم (کمیسیون)</h3>
                    <p className="text-2xl font-black text-white font-mono">
                      {finances?.kpi?.totalCommission?.toLocaleString("fa-IR") || "0"} <span className="text-sm text-zinc-500 font-sans">تومان</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-400 mb-1">قابل پرداخت به مربیان</h3>
                    <p className="text-2xl font-black text-white font-mono">
                      {finances?.kpi?.totalPayouts?.toLocaleString("fa-IR") || "0"} <span className="text-sm text-zinc-500 font-sans">تومان</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* User Management Table */}
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" /> مدیریت کاربران
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                  <thead className="text-[11px] text-zinc-500 uppercase bg-zinc-800/30">
                    <tr>
                      <th className="px-4 py-3 rounded-r-lg">نام کاربر</th>
                      <th className="px-4 py-3">ایمیل</th>
                      <th className="px-4 py-3">نقش</th>
                      <th className="px-4 py-3">جنسیت</th>
                      <th className="px-4 py-3 rounded-l-lg">تاریخ عضویت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList?.length > 0 ? (
                      usersList.map((u: any) => (
                        <tr key={u.id} className="border-b border-zinc-800/40 last:border-0 hover:bg-zinc-800/20 transition-colors">
                          <td className="px-4 py-4 font-medium text-white">{u.name}</td>
                          <td className="px-4 py-4 text-zinc-300">{u.email}</td>
                          <td className="px-4 py-4">
                            <span className="px-2 py-1 bg-zinc-800 text-zinc-300 rounded text-[10px]">{u.role}</span>
                          </td>
                          <td className="px-4 py-4 text-zinc-400">{u.gender === "MALE" ? "مرد" : "زن"}</td>
                          <td className="px-4 py-4 text-zinc-400">{new Date(u.createdAt).toLocaleDateString("fa-IR")}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-zinc-500 text-xs">
                          کاربری یافت نشد.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Transactions Table */}
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" /> تراکنش‌های اخیر
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                  <thead className="text-[11px] text-zinc-500 uppercase bg-zinc-800/30">
                    <tr>
                      <th className="px-4 py-3 rounded-r-lg">کاربر</th>
                      <th className="px-4 py-3">پکیج</th>
                      <th className="px-4 py-3">مبلغ (تومان)</th>
                      <th className="px-4 py-3">تاریخ</th>
                      <th className="px-4 py-3 rounded-l-lg">وضعیت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {finances?.recentTransactions?.length > 0 ? (
                      finances.recentTransactions.map((tx: any) => (
                        <tr key={tx.id} className="border-b border-zinc-800/40 last:border-0 hover:bg-zinc-800/20 transition-colors">
                          <td className="px-4 py-4 font-medium text-white">{tx.userName}</td>
                          <td className="px-4 py-4 text-zinc-300">{tx.packageType}</td>
                          <td className="px-4 py-4 text-emerald-400 font-mono">{tx.amount.toLocaleString("fa-IR")}</td>
                          <td className="px-4 py-4 text-zinc-400">{new Date(tx.date).toLocaleDateString("fa-IR")}</td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 rounded-md text-[10px] font-semibold ${tx.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                              {tx.status === "COMPLETED" ? "موفق" : "در انتظار"}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-zinc-500 text-xs">
                          تراکنشی یافت نشد.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">

            {/* Coach Approvals */}
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" /> تایید مربیان
                </h3>
                {pendingCoaches.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-[10px] font-bold">
                    {pendingCoaches.length}
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {pendingCoaches.length > 0 ? (
                  pendingCoaches.map((coach) => (
                    <div key={coach.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-white mb-1">{coach.user.name}</h4>
                        <p className="text-[11px] text-zinc-400">{coach.user.email}</p>
                      </div>
                      <button
                        onClick={() => handleApproveCoach(coach.id)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 rounded-lg text-xs font-bold transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" /> تایید مربی
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 border border-dashed border-zinc-800 rounded-xl">
                    <CheckCircle2 className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                    <p className="text-xs text-zinc-500">مربی در انتظار تایید نیست.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Platform Notifications */}
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" /> ارسال اعلان سیستم
              </h3>

              <form onSubmit={handleSendNotification} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-2">عنوان اعلان</label>
                  <input
                    type="text"
                    required
                    value={notifTitle}
                    onChange={e => setNotifTitle(e.target.value)}
                    className="w-full p-3 bg-zinc-950/60 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 transition-all text-right"
                    placeholder="مثال: به‌روزرسانی سیستم"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-2">متن اعلان</label>
                  <textarea
                    required
                    value={notifContent}
                    onChange={e => setNotifContent(e.target.value)}
                    className="w-full p-3 bg-zinc-950/60 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 transition-all text-right min-h-[100px] resize-none"
                    placeholder="متن پیام خود را بنویسید..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-all"
                >
                  <Send className="w-4 h-4" /> ارسال پیام
                </button>

                {notifStatus === "success" && (
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-2 justify-center">
                    <CheckCircle2 className="w-3 h-3" /> پیام با موفقیت ارسال شد
                  </p>
                )}
                {notifStatus === "error" && (
                  <p className="text-[10px] text-red-400 flex items-center gap-1 mt-2 justify-center">
                    <AlertCircle className="w-3 h-3" /> خطا در ارسال پیام
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
