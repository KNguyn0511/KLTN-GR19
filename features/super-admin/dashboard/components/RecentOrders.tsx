import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { RecentOrderRow } from "@/lib/api/dashboardApi";
import { formatDashboardOrderTotal } from "@/features/super-admin/dashboard/utils/format";

function statusPillClass(status: string): string {
  const s = status === "PENDING" ? "PENDING_CONFIRMATION" : status;
  if (s === "COMPLETED") return "bg-emerald-50 text-emerald-600 border-emerald-100";
  if (s === "PENDING_CONFIRMATION") return "bg-amber-50 text-amber-600 border-amber-100";
  if (s === "CONFIRMED") return "bg-blue-50 text-blue-600 border-blue-100";
  if (s === "PACKING") return "bg-orange-50 text-orange-600 border-orange-100";
  if (s === "SHIPPING") return "bg-violet-50 text-violet-600 border-violet-100";
  if (s === "CANCELLED") return "bg-rose-50 text-rose-600 border-rose-100";
  return "bg-slate-50 text-slate-600 border-slate-100";
}

function formatOrderDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function RecentOrders({ orders }: { orders: RecentOrderRow[] }) {
  return (
    <Card className="col-span-1 border-none bg-white shadow-sm transition-all hover:shadow-md md:col-span-3 lg:col-span-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-bold text-slate-800">Đơn hàng mới nhất</CardTitle>
          <p className="text-xs text-slate-500">Các giao dịch vừa thực hiện</p>
        </div>
        <button className="text-xs font-bold text-blue-600 hover:underline">
          Xem tất cả
        </button>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-50 text-[11px] font-black tracking-widest text-slate-400 uppercase">
              <th className="px-2 pb-4">MÃ ĐƠN</th>
              <th className="px-2 pb-4">KHÁCH HÀNG</th>
              <th className="px-2 pb-4">NGÀY ĐẶT</th>
              <th className="px-2 pb-4">TỔNG TIỀN</th>
              <th className="px-2 pb-4">TRẠNG THÁI</th>
              <th className="px-2 pb-4">KÊNH</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-sm font-medium text-slate-400">Không có đơn hàng nào</p>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={`${order.orderCode}-${order.createdAt}`} className="group transition-colors hover:bg-slate-50/50">
                  <td className="px-2 py-4">
                    <span className="text-sm font-bold text-blue-600 transition-colors group-hover:text-blue-700">
                      #{order.orderCode}
                    </span>
                  </td>
                  <td className="px-2 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                        {order.customerName.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-slate-700">{order.customerName}</span>
                    </div>
                  </td>
                  <td className="px-2 py-4 text-sm text-slate-500">
                    {formatOrderDate(order.createdAt)}
                  </td>
                  <td className="px-2 py-4 text-sm font-black text-slate-900">
                    {formatDashboardOrderTotal(order.totalAmount)}
                  </td>
                  <td className="px-2 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider",
                        statusPillClass(order.status),
                      )}
                    >
                      {order.statusLabel}
                    </span>
                  </td>
                  <td className="px-2 py-4">
                    <span className={cn(
                      "text-[11px] font-bold",
                      order.channelLabel.toLowerCase().includes("web") ? "text-blue-500" : "text-emerald-500"
                    )}>
                      {order.channelLabel}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
