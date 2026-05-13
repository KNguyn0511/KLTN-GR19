"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Bell, Package, Truck, X } from "lucide-react";
import { toast } from "react-toastify";
import { StatCard } from "@/features/super-admin/shared/components/StatCard";
import { OrderFilterBar } from "@/features/super-admin/orders/components/OrderFilterBar";
import {
  OrderTable,
  nextApiStatus,
} from "@/features/super-admin/orders/components/OrderTable";
import {
  fetchAdminOrders,
  patchOrderStatus,
  confirmOrder,
  type AdminOrderChannel,
  type AdminOrderDate,
  type AdminOrderRow,
  type AdminOrderStats,
  type AdminOrderTab,
} from "@/lib/api/adminOrdersApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function SuperAdminOrdersPage() {
  const [tab, setTab] = useState<AdminOrderTab>("all");
  const [channel, setChannel] = useState<AdminOrderChannel>("all");
  const [date, setDate] = useState<AdminOrderDate>("today");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [stats, setStats] = useState<AdminOrderStats | null>(null);
  const [orders, setOrders] = useState<AdminOrderRow[]>([]);
  
  // Confirmation Modal state
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderRow | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    try {
      const data = await fetchAdminOrders({
        tab,
        channel,
        date,
        q: debouncedSearch,
      });
      setStats(data.stats);
      setOrders(data.orders);
    } catch (e) {
      console.error(e);
      toast.error("Không tải được danh sách đơn (cần quyền Super Admin).");
      setStats(null);
      setOrders([]);
    }
  }, [tab, channel, date, debouncedSearch]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleAdvance = async (order: AdminOrderRow) => {
    if (order.status === "PENDING_CONFIRMATION" || order.status === "PENDING") {
      setSelectedOrder(order);
      setIsConfirmOpen(true);
      return;
    }

    const next = nextApiStatus(order.status);
    if (!next) return;
    try {
      await patchOrderStatus(order._id, next);
      toast.success("Đã cập nhật trạng thái đơn.");
      await load();
    } catch (e) {
      console.error(e);
      toast.error("Không cập nhật được trạng thái.");
    }
  };

  const handleConfirmOrder = async () => {
    if (!selectedOrder) return;
    setIsProcessing(true);
    try {
      await confirmOrder(selectedOrder._id);
      toast.success(`Đã xác nhận đơn hàng ${selectedOrder.orderCode}`);
      setIsConfirmOpen(false);
      setSelectedOrder(null);
      await load();
    } catch (e) {
      console.error(e);
      toast.error("Lỗi khi xác nhận đơn hàng.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          Quản lý đơn hàng (O2O Fulfillment)
        </h1>
        <Button
          type="button"
          className="flex items-center gap-2 rounded-md border border-green-600 px-4 py-2 text-sm font-semibold text-green-600 transition-colors hover:bg-green-50"
          onClick={() =>
            console.log("[XUẤT EXCEL] filters:", {
              tab,
              channel,
              date,
              search: debouncedSearch,
            })
          }
        >
          XUẤT EXCEL
          <Download className="h-4 w-4" />
        </Button>
      </div>

      {/* Cards Row */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="CHỜ XÁC NHẬN (ONLINE)"
          value={stats != null ? String(stats.pendingOnline) : "—"}
          trend="none"
          trendText=""
          icon={<Bell className="h-4 w-4" />}
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-600"
          valueColor="text-blue-600"
        />
        <StatCard
          title="ĐANG ĐÓNG GÓI"
          value={stats != null ? String(stats.packing) : "—"}
          trend="none"
          trendText=""
          icon={<Package className="h-4 w-4" />}
          iconBgColor="bg-orange-100"
          iconColor="text-orange-600"
          valueColor="text-orange-500"
        />
        <StatCard
          title="ĐANG GIAO HÀNG"
          value={stats != null ? String(stats.shipping) : "—"}
          trend="none"
          trendText=""
          icon={<Truck className="h-4 w-4" />}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          valueColor="text-green-500"
        />
        <StatCard
          title="ĐƠN HỦY / TRẢ HÀNG"
          value={stats != null ? String(stats.cancelled) : "—"}
          trend="none"
          trendText=""
          icon={<X className="h-4 w-4" />}
          iconBgColor="bg-red-100"
          iconColor="text-red-600"
          valueColor="text-red-600"
        />
      </div>

      {/* Filter Bar */}
      <OrderFilterBar
        search={search}
        onSearchChange={setSearch}
        tab={tab}
        onTab={setTab}
        channel={channel}
        onChannel={setChannel}
        date={date}
        onDate={setDate}
      />

      {/* Data Table */}
      <OrderTable orders={orders} onAdvance={handleAdvance} />

      {/* Confirmation Modal */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-800">Xác nhận đơn hàng</DialogTitle>
            <DialogDescription>
              Kiểm tra thông tin khách hàng và đơn hàng trước khi bắt đầu xử lý.
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (() => {
            const subtotal = (selectedOrder.items?.reduce((acc, it) => acc + (it.price * it.quantity), 0)) || 0;
            return (
            <div className="flex flex-col gap-5 py-4">
              {/* Customer Info Mini Card */}
              <div className="flex flex-col gap-1 border-b border-slate-100 pb-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-slate-400 uppercase font-bold">Mã đơn</span>
                    <span className="font-bold text-blue-600">{selectedOrder.orderCode}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-slate-400 uppercase font-bold text-right">Khách hàng</span>
                    <span className="font-semibold text-slate-800">{selectedOrder.customerName}</span>
                  </div>
                </div>
                {selectedOrder.customerInfo && (
                  <div className="mt-1 flex flex-col gap-0.5 text-slate-600">
                    {selectedOrder.customerInfo.phone && (
                      <span>📞 {selectedOrder.customerInfo.phone}</span>
                    )}
                    {selectedOrder.customerInfo.addressDetail && (
                      <span className="text-[10px] text-slate-500">
                        📍 {selectedOrder.customerInfo.addressDetail}, {selectedOrder.customerInfo.ward}, {selectedOrder.customerInfo.district}, {selectedOrder.customerInfo.city}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* 1. Product List (TOP) */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chi tiết sản phẩm:</span>
                <div className="max-h-[160px] overflow-y-auto rounded-lg border border-slate-100 bg-white p-2">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                      <div className="flex flex-col gap-0.5 max-w-[65%]">
                        <span className="text-sm font-medium text-slate-800 leading-tight">
                          {item.productName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {item.variant}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-slate-700">
                          {Math.round(item.price).toLocaleString("vi-VN")} đ
                        </span>
                        <span className="text-[10px] text-slate-400">
                          x{item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Pricing Summary (BOTTOM) */}
              <div className="rounded-lg bg-slate-50 p-4 border border-slate-100 flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Tạm tính:</span>
                  <span className="font-medium">
                    {Math.round(subtotal).toLocaleString("vi-VN")} đ
                  </span>
                </div>
                
                {((selectedOrder.discountAmount ?? 0) > 0 || (subtotal > selectedOrder.totalAmount)) && (
                  <div className="flex justify-between text-sm text-red-600">
                    <span className="flex items-center gap-1 italic">
                      {selectedOrder.voucherCode ? (
                        <>
                          Mã giảm giá <span className="not-italic font-bold bg-red-50 px-1.5 py-0.5 rounded border border-red-100 text-[10px] ml-1">{selectedOrder.voucherCode}</span>:
                        </>
                      ) : (
                        "Khuyến mãi / Giảm giá:"
                      )}
                    </span>
                    <span className="font-bold">
                      -{Math.round((selectedOrder.discountAmount ?? 0) || (subtotal + (selectedOrder.shippingFee ?? 0) - selectedOrder.totalAmount)).toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm text-slate-700">
                  <span className="text-slate-500">Phí vận chuyển:</span>
                  <span>+{Math.round(selectedOrder.shippingFee || 0).toLocaleString("vi-VN")} đ</span>
                </div>
                
                <div className="flex justify-between border-t border-slate-200 pt-3 mt-1">
                  <span className="text-slate-900 font-bold">Thành tiền:</span>
                  <span className="font-bold text-xl text-blue-600">
                    {Math.round(selectedOrder.totalAmount).toLocaleString("vi-VN")} đ
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 italic text-center">
                * Sau khi xác nhận, khách hàng sẽ nhận được thông báo trạng thái đơn hàng.
              </p>
            </div>
            );
          })()}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsConfirmOpen(false)}
              disabled={isProcessing}
            >
              Hủy
            </Button>
            <Button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              onClick={handleConfirmOrder}
              disabled={isProcessing}
            >
              {isProcessing ? "Đang xử lý..." : "Xác nhận & Xử lý"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
