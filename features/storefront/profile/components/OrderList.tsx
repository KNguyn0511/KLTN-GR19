"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ProfileTabs } from "./ProfileTabs";
import { OrderItem } from "./OrderItem";
import {
  getMyOrders,
  mapMyOrderApiToOrderData,
  MY_ORDERS_STALE_STORAGE_KEY,
  type MyOrdersApiStatus,
} from "@/lib/api/orderApi";
import type { OrderData } from "../types/order";
import { toast } from "react-toastify";

export type OrderStatusTab = "Tất cả" | "Chờ xác nhận" | "Đang giao" | "Hoàn thành" | "Đã hủy";
const ORDER_TABS: OrderStatusTab[] = ["Tất cả", "Chờ xác nhận", "Đang giao", "Hoàn thành", "Đã hủy"];

const TAB_TO_API_STATUS: Partial<Record<OrderStatusTab, MyOrdersApiStatus>> = {
  "Chờ xác nhận": "PENDING_CONFIRMATION",
  "Đang giao": "SHIPPING",
  "Hoàn thành": "COMPLETED",
  "Đã hủy": "CANCELLED",
};

import { ShoppingBag, Loader2, Inbox } from "lucide-react";

export const OrderList = () => {
  const [activeTab, setActiveTab] = useState<OrderStatusTab>("Tất cả");
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const apiStatus = TAB_TO_API_STATUS[activeTab];
      const { orders: raw } = await getMyOrders(
        apiStatus != null ? { status: apiStatus } : {},
      );
      setOrders(raw.map(mapMyOrderApiToOrderData));
      try {
        sessionStorage.removeItem(MY_ORDERS_STALE_STORAGE_KEY);
      } catch {
        /* ignore */
      }
    } catch (e: unknown) {
      console.error(e);
      toast.error("Không tải được lịch sử đơn hàng. Bạn đã đăng nhập chưa?");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  // Sau đặt hàng: refetch khi quay lại trang / tab (bfcache, nhiều tab).
  useEffect(() => {
    const maybeRefetch = () => {
      if (typeof window === "undefined") return;
      try {
        if (sessionStorage.getItem(MY_ORDERS_STALE_STORAGE_KEY) != null) {
          void fetchOrders();
        }
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("focus", maybeRefetch);
    window.addEventListener("pageshow", maybeRefetch);
    return () => {
      window.removeEventListener("focus", maybeRefetch);
      window.removeEventListener("pageshow", maybeRefetch);
    };
  }, [fetchOrders]);

  return (
    <div className="flex w-full flex-col gap-8">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Lịch sử đơn hàng</h1>
          <p className="text-sm font-medium text-slate-400">Xem và quản lý các đơn hàng bạn đã đặt</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <ShoppingBag className="h-5 w-5" />
        </div>
      </div>

      {/* Tabs */}
      <ProfileTabs tabs={ORDER_TABS} activeTab={activeTab} onChange={setActiveTab} />

      {/* List */}
      <div className="flex flex-col gap-6">
        {loading ? (
          <div className="flex h-64 w-full flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white text-slate-400 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <span className="mt-4 text-sm font-black uppercase tracking-widest">Đang tải đơn hàng...</span>
          </div>
        ) : orders.length > 0 ? (
          orders.map((order) => <OrderItem key={order.id} order={order} />)
        ) : (
          <div className="flex h-64 w-full flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white text-slate-400 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-200">
              <Inbox className="h-10 w-10" />
            </div>
            <span className="mt-4 text-sm font-black uppercase tracking-widest">Không có đơn hàng nào</span>
            <p className="mt-1 text-[13px] font-medium text-slate-400">Hãy bắt đầu mua sắm để nhận ưu đãi!</p>
          </div>
        )}
      </div>
    </div>
  );
};
