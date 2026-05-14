"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DollarSign, Package, User, AlertTriangle, Loader2, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import { StatCard } from "@/features/super-admin/shared/components/StatCard";
import { DashboardChart } from "@/features/super-admin/dashboard/components/DashboardChart";
import { TopProducts } from "@/features/super-admin/dashboard/components/TopProducts";
import { RecentOrders } from "@/features/super-admin/dashboard/components/RecentOrders";
import {
  fetchDashboardStats,
  fetchRevenueChart,
  fetchTopProducts,
  fetchRecentOrders,
  syncInventorySerials,
  type DashboardStats,
  type RevenueChartWeek,
  type TopProductRow,
  type RecentOrderRow,
} from "@/lib/api/dashboardApi";
import {
  buildMonthOptions,
  formatDashboardMoney,
} from "@/features/super-admin/dashboard/utils/format";
import { cn } from "@/lib/utils";

export default function SuperAdminPage() {
  console.log('Dashboard Rendering...');
  const monthOptions = useMemo(() => buildMonthOptions(18), []);
  const [sel, setSel] = useState(() => monthOptions[0] ?? { year: 2026, month: 1, label: "" });

  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [topLoading, setTopLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartWeeks, setChartWeeks] = useState<RevenueChartWeek[]>([]);
  const [topProducts, setTopProducts] = useState<TopProductRow[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrderRow[]>([]);
  const [syncLoading, setSyncLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setStatsLoading(true);
    setChartLoading(true);
    setTopLoading(true);
    setOrdersLoading(true);

    const results = await Promise.allSettled([
      fetchDashboardStats(sel.year, sel.month),
      fetchRevenueChart(sel.year, sel.month),
      fetchTopProducts(sel.year, sel.month),
      fetchRecentOrders(sel.year, sel.month),
    ]);

    const [statsResult, chartResult, topResult, ordersResult] = results;
    console.log('Data fetched:', { statsResult, chartResult, topResult, ordersResult });

    if (statsResult.status === "fulfilled") {
      setStats(statsResult.value);
    } else {
      console.error(statsResult.reason);
      setStats(null);
    }

    if (chartResult.status === "fulfilled") {
      setChartWeeks(chartResult.value.weeks);
    } else {
      console.error(chartResult.reason);
      setChartWeeks([]);
    }

    if (topResult.status === "fulfilled") {
      setTopProducts(topResult.value);
    } else {
      console.error(topResult.reason);
      setTopProducts([]);
    }

    if (ordersResult.status === "fulfilled") {
      setRecentOrders(ordersResult.value);
    } else {
      console.error(ordersResult.reason);
      setRecentOrders([]);
    }

    if (results.some((result) => result.status === "rejected")) {
      toast.error("Một số dữ liệu dashboard không tải được, nhưng trang vẫn hiển thị.");
    }

    setStatsLoading(false);
    setChartLoading(false);
    setTopLoading(false);
    setOrdersLoading(false);
    setLoading(false);
  }, [sel.year, sel.month]);

  useEffect(() => {
    void load();
  }, [load]);

  const growthTrend = (pct: number): "up" | "down" =>
    pct >= 0 ? "up" : "down";

  const handleSyncInventory = async () => {
    if (!confirm("Bạn có chắc chắn muốn đồng bộ lại toàn bộ mã Series? Hành động này sẽ xóa các mã cũ và sinh lại mới dựa trên tồn kho hiện tại.")) {
      return;
    }
    setSyncLoading(true);
    try {
      const res = await syncInventorySerials();
      toast.success(res.message || "Đồng bộ mã Series thành công!");
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi đồng bộ mã Series");
    } finally {
      setSyncLoading(false);
    }
  };

  if (loading && !stats && !chartWeeks.length && !topProducts.length && !recentOrders.length) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-8 text-slate-500">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading...
      </div>
    );
  }


  return (
    <div className="flex flex-col gap-8 bg-slate-50/50 p-8 min-h-screen">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Tổng quan hệ thống
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Chào mừng trở lại! Đây là báo cáo kinh doanh của bạn.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-slate-100">
            {monthOptions.map((o) => {
              const isActive = `${sel.year}-${sel.month}` === `${o.year}-${o.month}`;
              return (
                <button
                  key={`${o.year}-${o.month}`}
                  onClick={() => setSel(o)}
                  className={cn(
                    "rounded-xl px-4 py-2 text-xs font-bold transition-all",
                    isActive 
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  {o.label}
                </button>
              );
            }).slice(0, 3)} {/* Hiển thị 3 tháng gần nhất dưới dạng tab, còn lại dùng select nếu cần hoặc chỉ hiển thị select */}
            
            <select
              className="ml-2 rounded-xl border-none bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-slate-200 outline-none"
              value={`${sel.year}-${sel.month}`}
              onChange={(e) => {
                const opt = monthOptions.find(
                  (o) => `${o.year}-${o.month}` === e.target.value,
                );
                if (opt) setSel(opt);
              }}
            >
              {monthOptions.map((o) => (
                <option key={`${o.year}-${o.month}`} value={`${o.year}-${o.month}`}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="h-10 w-[1px] bg-slate-200 hidden md:block" />

          <button
            onClick={handleSyncInventory}
            disabled={syncLoading}
            className="group flex items-center gap-2 rounded-2xl bg-white border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50"
          >
            {syncLoading ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-blue-600" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
            )}
            Đồng bộ kho
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="DOANH THU TỔNG"
          value={stats ? formatDashboardMoney(stats.totalRevenue) : "—"}
          trend={stats ? growthTrend(stats.totalRevenueGrowthPercent) : "none"}
          trendText={
            stats
              ? `${Math.abs(stats.totalRevenueGrowthPercent)}% so với tháng trước`
              : undefined
          }
          icon={<DollarSign className="h-4 w-4" />}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          title="TỔNG ĐƠN HÀNG"
          value={stats ? String(stats.totalOrders) : "—"}
          trend={stats ? growthTrend(stats.totalOrdersGrowthPercent) : "none"}
          trendText={
            stats
              ? `${Math.abs(stats.totalOrdersGrowthPercent)}% so với tháng trước`
              : undefined
          }
          icon={<Package className="h-4 w-4" />}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          title="KHÁCH HÀNG MỚI"
          value={stats ? String(stats.newCustomers) : "—"}
          trend={stats ? growthTrend(stats.newCustomersGrowthPercent) : "none"}
          trendText={
            stats
              ? `${Math.abs(stats.newCustomersGrowthPercent)}% so với tháng trước`
              : undefined
          }
          icon={<User className="h-4 w-4" />}
          iconBgColor="bg-slate-100"
          iconColor="text-slate-600"
        />
        <StatCard
          title="SẢN PHẨM SẮP HẾT"
          value={stats ? String(stats.lowStockProducts) : "—"}
          trend="none"
          trendText={
            stats
              ? `Ngưỡng < ${stats.lowStockThreshold} — Cần nhập kho ngay`
              : undefined
          }
          icon={<AlertTriangle className="h-4 w-4" />}
          iconBgColor="bg-red-100"
          iconColor="text-red-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        <DashboardChart weeks={chartWeeks} />
        <TopProducts products={topProducts} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <RecentOrders orders={recentOrders} />
      </div>
    </div>
  );
}
