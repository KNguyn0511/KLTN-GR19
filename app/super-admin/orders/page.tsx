"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Bell, Package, Truck, X, RefreshCcw } from "lucide-react";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
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
  packOrder,
  shipOrder,
  completeOrder,
  syncAllOrders,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [isPackOpen, setIsPackOpen] = useState(false);
  const [isShipOpen, setIsShipOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Shipping logic state
  const [selectedCarrier, setSelectedCarrier] = useState("");

  // Packing logic state
  const [packingData, setPackingData] = useState<{[key: string]: string[]}>({});

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
    if (order.status === "FORCE_COMPLETE") {
      setIsProcessing(true);
      try {
        await completeOrder(order._id, true);
        toast.success(`[TEST] Đã giả lập bưu cục giao hàng thành công đơn #${order.orderCode}! 💰`);
        await load();
      } catch (e: any) {
        toast.error(`Lỗi giả lập: ${e.response?.data?.message || e.message}`);
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    if (order.status === "PENDING_CONFIRMATION" || order.status === "PENDING") {
      setSelectedOrder(order);
      setIsConfirmOpen(true);
      return;
    }

    if (order.status === "CONFIRMED") {
      setSelectedOrder(order);
      // Initialize packing data with existing serials or empty strings
      const initial: {[key: string]: string[]} = {};
      order.items?.forEach((it, idx) => {
        initial[`${it.product}-${idx}`] = Array(it.quantity).fill("");
      });
      setPackingData(initial);
      setIsPackOpen(true);
      return;
    }

    if (order.status === "PACKING") {
      setSelectedOrder(order);
      setIsShipOpen(true);
      return;
    }

    if (order.status === "SHIPPING") {
      try {
        await completeOrder(order._id);
        toast.success(`Đơn hàng #${order.orderCode} đã giao thành công!`);
        await load();
      } catch (e: any) {
        const errorMsg = e.response?.data?.message || e.message || "Lỗi khi hoàn tất đơn hàng";
        if (errorMsg.includes("xác nhận thủ công")) {
          if (window.confirm(`${errorMsg}\n\nBạn có muốn XÁC NHẬN THỦ CÔNG để hoàn tất đơn hàng này ngay không?`)) {
            try {
              await completeOrder(order._id, true);
              toast.success(`Đã xác nhận thủ công đơn hàng #${order.orderCode}. Doanh thu +${Math.round(order.totalAmount).toLocaleString('vi-VN')}đ 💰`);
              await load();
            } catch (innerErr: any) {
              toast.error("Vẫn không thể hoàn tất đơn hàng.");
            }
          }
        } else {
          toast.error(errorMsg);
        }
      }
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

  const handleSyncAll = async () => {
    setIsProcessing(true);
    try {
      const res = await syncAllOrders();
      toast.info(`Đã quét xong! Có ${res.updatedCount} đơn hàng bưu cục vừa giao xong 🚀`);
      await load();
    } catch (e) {
      console.error(e);
      toast.error("Lỗi đồng bộ bưu cục.");
    } finally {
      setIsProcessing(false);
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

  const handlePackOrder = async () => {
    if (!selectedOrder) return;
    
    const itemsToSubmit = selectedOrder.items?.map((it, idx) => ({
      productId: it.product || "",
      serialNumbers: packingData[`${it.product}-${idx}`] || []
    })) || [];

    const isMissing = itemsToSubmit.some(it => it.serialNumbers.some(sn => !sn));
    if (isMissing) {
      toast.warn("Vui lòng nhập/chọn đủ Serial Number cho tất cả sản phẩm.");
    }

    setIsProcessing(true);
    try {
      await packOrder(selectedOrder._id, itemsToSubmit);
      toast.success(`Đã đóng gói đơn hàng ${selectedOrder.orderCode}.`);
      setIsPackOpen(false);
      // Giữ lại selectedOrder để nếu Admin muốn bấm Giao hàng ngay thì ID vẫn còn đó
      await load();


    } catch (e) {
      console.error(e);
      toast.error("Lỗi khi đóng gói đơn hàng.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSmartAllocate = () => {
    if (!selectedOrder) return;
    const newData = { ...packingData };
    let allocatedCount = 0;
    let fallbackCount = 0;

    selectedOrder.items?.forEach((it, idx) => {
      const key = `${it.product}-${idx}`;
      const available = it.availableSerials || [];
      
      newData[key] = Array(it.quantity).fill(0).map((_, i) => {
        if (available[i]) {
          allocatedCount++;
          return available[i];
        }
        fallbackCount++;
        return `SN-${it.productName?.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 1000000)}`;
      });
    });

    setPackingData(newData);
    if (fallbackCount > 0) {
      toast.info(`Đã tự động chọn ${allocatedCount} mã từ kho. ${fallbackCount} mã được tạo tạm thời do kho hết hàng.`);
    } else {
      toast.success(`Đã tự động gán ${allocatedCount} Serial từ kho.`);
    }
  };

  const handleShipOrder = async () => {
    if (!selectedOrder?._id) {
      toast.error("Lỗi: Không tìm thấy ID đơn hàng hợp lệ.");
      return;
    }
    console.log("🚀 [SHIPPING] Sending request for OrderID:", selectedOrder._id);
    setIsProcessing(true);
    try {
      await shipOrder(selectedOrder._id, selectedCarrier);
      toast.success(`Đã đẩy đơn sang ${selectedCarrier} thành công!`);
      setIsShipOpen(false);
      setSelectedOrder(null);
      await load();
    } catch (e: any) {


      console.error(e);
      toast.error(e.response?.data?.message || e.message || "Lỗi khi kết nối với bưu cục.");
    } finally {
      setIsProcessing(false);
    }
  };

  const isPackingValid = selectedOrder?.items?.every((item, idx) => {
    const key = `${item.product}-${idx}`;
    const assigned = packingData[key] || [];
    return assigned.length === item.quantity && assigned.every((sn: string) => sn !== "");
  });

  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          Quản lý đơn hàng (O2O Fulfillment)
        </h1>
        <div className="flex gap-2">
          <Button
            type="button"
            className="flex items-center gap-2 rounded-md border border-[#F27024] px-4 py-2 text-sm font-semibold text-[#F27024] transition-colors hover:bg-orange-50"
            onClick={handleSyncAll}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <RefreshCcw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
            ĐỒNG BỘ BƯU CỤC
          </Button>
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

      {/* 2. PACKING MODAL (NEW) */}
      <Dialog open={isPackOpen} onOpenChange={setIsPackOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Package className="h-5 w-5 text-blue-600" />
              Đóng gói đơn hàng & Gán Serial
            </DialogTitle>
            <DialogDescription>
              Vui lòng chọn Serial Number tương ứng cho các sản phẩm trong đơn.
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="flex flex-col gap-6 py-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mã đơn hàng</p>
                  <p className="font-bold text-blue-600">{selectedOrder.orderCode}</p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 text-[11px] font-bold border-blue-600 text-blue-600 hover:bg-blue-50 bg-white shadow-sm px-4"
                  onClick={handleSmartAllocate}
                >
                  ⚡ Quét nhanh sản phẩm
                </Button>
              </div>

              <div className="flex flex-col gap-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                {selectedOrder.items?.map((item, itemIdx) => (
                  <div key={itemIdx} className="rounded-xl border border-slate-100 bg-slate-50/30 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-slate-800 leading-tight">{item.productName}</h4>
                        <p className="text-[11px] text-slate-500 mt-1">{item.variant || "Phiên bản tiêu chuẩn"}</p>
                      </div>
                      <div className="bg-white px-3 py-1 rounded-full border border-slate-200 text-[11px] font-bold text-blue-600">
                        Cần nhập: {item.quantity}
                      </div>
                    </div>

                    {/* Quick Scan Input */}
                    <div className="mb-4">
                      <input
                        type="text"
                        placeholder="Nhấp vào đây để quét mã liên tục..."
                        className="w-full h-8 px-3 text-xs bg-blue-50 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-blue-300"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const val = (e.target as HTMLInputElement).value.trim();
                            if (!val) return;
                            
                            const key = `${item.product}-${itemIdx}`;
                            const newData = { ...packingData };
                            if (!newData[key]) newData[key] = Array(item.quantity).fill("");
                            
                            // Tìm ô trống đầu tiên để điền vào
                            const emptyIdx = newData[key].findIndex(sn => !sn);
                            if (emptyIdx !== -1) {
                              newData[key][emptyIdx] = val;
                              setPackingData(newData);
                              (e.target as HTMLInputElement).value = ""; // Clear để quét cái tiếp theo
                              toast.success(`Đã nhận: ${val}`, { autoClose: 500, hideProgressBar: true });
                            } else {
                              toast.warn("Đã nhập đủ số lượng cho sản phẩm này.");
                            }
                          }
                        }}
                      />
                    </div>

                    <div className="space-y-3">
                      {Array.from({ length: item.quantity }).map((_, i) => {
                        const key = `${item.product}-${itemIdx}`;
                        const currentVal = packingData[key]?.[i] || "";
                        
                        return (
                          <div key={i} className="flex items-center gap-3">
                            <div className="flex-none w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 border border-slate-200">
                              {i+1}
                            </div>
                            <div className="flex-1">
                              <select
                                className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                                value={currentVal}
                                onChange={(e) => {
                                  const newData = { ...packingData };
                                  if (!newData[key]) newData[key] = [];
                                  newData[key][i] = e.target.value;
                                  setPackingData(newData);
                                }}
                              >
                                <option value="">-- Chọn số Serial từ kho --</option>
                                {item.availableSerials?.map(sn => (
                                  <option key={sn} value={sn}>{sn}</option>
                                ))}
                                {currentVal && !item.availableSerials?.includes(currentVal) && (
                                  <option value={currentVal}>{currentVal} (Test)</option>
                                )}
                              </select>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 border-t pt-5">
            <Button
              type="button"
              variant="ghost"
              className="text-slate-500 hover:text-slate-700"
              onClick={() => setIsPackOpen(false)}
              disabled={isProcessing}
            >
              Quay lại
            </Button>
            <Button
              type="button"
              className="bg-green-600 hover:bg-green-700 text-white px-10 font-bold transition-all transform active:scale-95"
              onClick={handlePackOrder}
              disabled={isProcessing || !isPackingValid}
              title={!isPackingValid ? "Vui lòng quét/chọn đủ Serial cho tất cả sản phẩm" : ""}
            >
              {isProcessing ? "Đang xử lý..." : "Hoàn tất đóng gói"}
              {!isProcessing && <Truck className="ml-2 h-4 w-4" />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. SHIPPING MODAL (NEW - SIMULATED API) */}
      <Dialog open={isShipOpen} onOpenChange={setIsShipOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Truck className="h-5 w-5 text-green-600" />
              Kết nối bưu cục vận chuyển
            </DialogTitle>
            <DialogDescription>
              Hệ thống sẽ tự động đồng bộ đơn hàng sang hệ thống của bưu cục.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 flex flex-col gap-5">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                Chọn đơn vị vận chuyển
              </label>
              <Select value={selectedCarrier} onValueChange={setSelectedCarrier}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn đơn vị vận chuyển" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Giao Hàng Nhanh (GHN)">Giao Hàng Nhanh (GHN)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Sẵn sàng đồng bộ API dữ liệu khách hàng
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Tự động lấy mã vận đơn sau khi xác nhận
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              className={cn(
                "bg-slate-900 hover:bg-black text-white px-8 font-bold flex-1 transition-all",
                (!selectedCarrier || isProcessing) && "opacity-50 cursor-not-allowed"
              )}
              onClick={handleShipOrder}
              disabled={isProcessing || !selectedCarrier}
            >
              {isProcessing ? "Đang kết nối API..." : "Xác nhận & Đẩy đơn"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
