import { Button } from "@/components/ui/button";
import { Globe, Store, MoreHorizontal, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminOrderRow } from "@/lib/api/adminOrdersApi";

export function apiStatusToLabel(status: string): string {
  if (status === "PENDING" || status === "PENDING_CONFIRMATION")
    return "Chờ xác nhận";
  if (status === "CONFIRMED") return "Đã xác nhận";
  if (status === "PACKING") return "Đang đóng gói";
  if (status === "SHIPPING") return "Đang giao hàng";
  if (status === "COMPLETED") return "Hoàn thành";
  if (status === "CANCELLED") return "Đã hủy";
  return status;
}

export function nextApiStatus(status: string): string | null {
  if (status === "PENDING" || status === "PENDING_CONFIRMATION") return "CONFIRMED";
  if (status === "CONFIRMED") return "PACKING";
  if (status === "PACKING") return "SHIPPING";
  if (status === "SHIPPING") return "COMPLETED";
  return null;
}

function formatOrderDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const day = String(d.getDate()).padStart(2, "0");
  const mon = String(d.getMonth() + 1).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${mon} ${h}:${m}`;
}

export type OrderTableProps = {
  orders: AdminOrderRow[];
  onAdvance: (order: AdminOrderRow) => void;
  children?: React.ReactNode;
};

export function OrderTable({ orders, onAdvance, children }: OrderTableProps) {
  return (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-50 bg-slate-50/50 text-[11px] font-black tracking-widest text-slate-400 uppercase">
              <th className="px-0 w-1"></th>
              <th className="px-6 py-5">MÃ ĐƠN</th>
              <th className="px-6 py-5">NGÀY ĐẶT</th>
              <th className="px-6 py-5">KHÁCH HÀNG</th>
              <th className="px-6 py-5">TỔNG TIỀN</th>
              <th className="px-6 py-5">NGUỒN (O2O)</th>
              <th className="px-6 py-5">TRẠNG THÁI</th>
              <th className="px-6 py-5 text-right">HÀNH ĐỘNG</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Package className="h-10 w-10 text-slate-200" />
                    <p className="text-sm font-medium text-slate-400">Không có đơn hàng nào</p>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const statusLabel = apiStatusToLabel(order.status);
                const displayCode = (order.orderCode || "").replace(/^#/, "");
                const isNtStyle = /^NT-/i.test(order.orderCode || "");
                const sourceLabel = order.channel === "ONLINE" ? "Website" : "Tại quầy";
                const next = nextApiStatus(order.status);
                
                return (
                  <tr 
                    key={order._id} 
                    className="group transition-all duration-300 hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:z-10 relative"
                  >
                    <td className="px-0 w-1 relative">
                      <div className="absolute inset-y-2 left-0 w-1 bg-blue-600 rounded-r-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-full group-hover:translate-x-0" />
                    </td>
                    <td className="px-6 py-5 font-black text-sm">
                      <span className={cn(
                        "rounded-md px-2 py-1 ring-1 transition-all group-hover:shadow-sm",
                        isNtStyle ? "text-blue-600 bg-blue-50 ring-blue-100" : "text-slate-800 bg-slate-50 ring-slate-200"
                      )}>
                        {(order.orderCode || "").startsWith("#") ? order.orderCode : `#${displayCode}`}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-xs font-bold text-slate-400">
                      {formatOrderDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-slate-800">
                          {order.customerName}
                        </span>
                        {order.status === "SHIPPING" || order.status === "COMPLETED" ? (
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-tighter text-blue-600 ring-1 ring-blue-100">
                              {order.shippingInfo?.carrier || "N/A"}
                            </span>
                            <span className="text-[10px] font-mono font-medium text-slate-400">
                              {order.shippingInfo?.trackingNumber}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-medium italic text-slate-300">Chờ vận chuyển</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-black text-slate-900">
                      {Math.round(order.totalAmount).toLocaleString("vi-VN")}
                    </td>

                    <td className="px-6 py-5">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-tight",
                        sourceLabel === "Website" 
                          ? "bg-sky-50 text-sky-600 ring-1 ring-sky-100" 
                          : "bg-slate-50 text-slate-500 ring-1 ring-slate-100"
                      )}>
                        {sourceLabel === "Website" ? <Globe className="h-3 w-3" /> : <Store className="h-3 w-3" />}
                        {sourceLabel}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={cn(
                          "inline-flex rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider shadow-sm ring-1",
                          {
                            "bg-amber-50 text-amber-600 ring-amber-100": statusLabel === "Chờ xác nhận",
                            "bg-blue-50 text-blue-600 ring-blue-100": statusLabel === "Đã xác nhận",
                            "bg-orange-50 text-orange-600 ring-orange-100": statusLabel === "Đang đóng gói",
                            "bg-indigo-50 text-indigo-600 ring-indigo-100": statusLabel === "Đang giao hàng",
                            "bg-emerald-50 text-emerald-600 ring-emerald-100": statusLabel === "Hoàn thành",
                            "bg-rose-50 text-rose-600 ring-rose-100": statusLabel === "Đã hủy",
                          },
                        )}
                      >
                        {statusLabel}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-right">
                      <div className="flex flex-col gap-1.5 items-end opacity-0 group-hover:opacity-100 transition-opacity">
                        {next ? (
                          <div className="flex flex-col gap-1 w-32">
                            <Button
                              type="button"
                              className={cn(
                                "h-8 rounded-xl px-4 text-[10px] font-black tracking-widest text-white shadow-lg transition-all active:scale-95",
                                {
                                  "bg-blue-600 shadow-blue-100 hover:bg-blue-700": order.status === "PENDING" || order.status === "PENDING_CONFIRMATION",
                                  "bg-indigo-600 shadow-indigo-100 hover:bg-indigo-700": order.status === "CONFIRMED",
                                  "bg-orange-600 shadow-orange-100 hover:bg-orange-700": order.status === "PACKING",
                                  "bg-emerald-600 shadow-emerald-100 hover:bg-emerald-700": order.status === "SHIPPING",
                                }
                              )}
                              onClick={() => onAdvance(order)}
                            >
                              {order.status === "PENDING" || order.status === "PENDING_CONFIRMATION" ? "XÁC NHẬN" : 
                               order.status === "CONFIRMED" ? "ĐÓNG GÓI" :
                               order.status === "PACKING" ? "ĐẨY ĐƠN" : "HOÀN TẤT"}
                            </Button>
                            
                            {order.status === "SHIPPING" && (
                              <button
                                onClick={() => onAdvance({ ...order, status: 'FORCE_COMPLETE' } as any)}
                                className="text-[9px] font-black text-rose-500 hover:text-rose-600 transition-colors uppercase tracking-tighter"
                              >
                                [TEST] GIẢ LẬP GHN ✅
                              </button>
                            )}
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-800"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {children}
    </div>
  );
}
