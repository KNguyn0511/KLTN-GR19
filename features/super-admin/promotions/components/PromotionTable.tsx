"use client";

import { cn } from "@/lib/utils";
import { Ticket, Loader2 } from "lucide-react";

interface PromotionTableProps {
  promotions: any[];
  loading: boolean;
}

function UsageBar({ count, limit }: { count: number; limit: number }) {
  if (!limit || limit === 0) {
    return (
      <div className="flex flex-col items-center gap-1">
        <span className="text-[11px] font-black text-slate-700">
          {count.toLocaleString("vi-VN")} / ∞
        </span>
      </div>
    );
  }

  const percentage = Math.min((count / limit) * 100, 100);

  return (
    <div className="flex flex-col items-center gap-1.5 min-w-[100px]">
      <span className="text-[11px] font-black text-slate-700">
        {count.toLocaleString("vi-VN")} / {limit.toLocaleString("vi-VN")}
      </span>
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 shadow-sm",
            percentage >= 100
              ? "bg-slate-300"
              : percentage >= 80
                ? "bg-amber-500 shadow-amber-100"
                : "bg-blue-600 shadow-blue-100"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function PromotionTable({ promotions, loading }: PromotionTableProps) {
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit' });
  };

  const getStatusInfo = (item: any) => {
    const now = new Date();
    const startDate = new Date(item.startDate);
    const endDate = new Date(item.endDate);

    if (!item.isActive) {
      return { text: "Đã khóa", color: "bg-rose-50 text-rose-600 ring-rose-100", isPing: false };
    }
    if (now < startDate) {
      return { text: "Sắp tới", color: "bg-amber-50 text-amber-600 ring-amber-100", isPing: false };
    }
    if (now > endDate) {
      return { text: "Kết thúc", color: "bg-slate-50 text-slate-400 ring-slate-100", isPing: false };
    }
    if (item.usageLimit > 0 && item.usedCount >= item.usageLimit) {
      return { text: "Hết lượt", color: "bg-slate-50 text-slate-400 ring-slate-100", isPing: false };
    }
    
    return { text: "Đang chạy", color: "bg-emerald-50 text-emerald-600 ring-emerald-100", isPing: true };
  };

  return (
    <div className="relative min-h-[400px] overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-50 bg-slate-50/50 text-[11px] font-black tracking-widest text-slate-400 uppercase">
              <th className="px-0 w-1"></th>
              <th className="px-6 py-5">MÃ CODE</th>
              <th className="px-6 py-5">TÊN CHƯƠNG TRÌNH</th>
              <th className="px-6 py-5">CHI TIẾT ƯU ĐÃI</th>
              <th className="px-6 py-5">THỜI GIAN</th>
              <th className="px-6 py-5">SỬ DỤNG</th>
              <th className="px-6 py-5 text-right">TRẠNG THÁI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">Đang tải dữ liệu...</p>
                  </div>
                </td>
              </tr>
            ) : promotions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-300">
                    <Ticket className="h-10 w-10" />
                    <p className="text-sm font-bold uppercase tracking-tight">Không tìm thấy voucher</p>
                  </div>
                </td>
              </tr>
            ) : (
              promotions.map((item) => {
                const status = getStatusInfo(item);

                return (
                  <tr 
                    key={item._id} 
                    className="group transition-all duration-300 hover:bg-blue-50/40 hover:shadow-[0_8px_30px_rgb(59,130,246,0.08)] hover:z-10 relative"
                  >
                    <td className="px-0 w-1 relative">
                      <div className="absolute inset-y-2 left-0 w-1 bg-blue-600 rounded-r-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-full group-hover:translate-x-0" />
                    </td>
                    
                    <td className="px-6 py-5">
                      <div className="relative inline-flex flex-col items-center justify-center px-4 py-1.5 min-w-[90px]">
                        <div className="absolute inset-0 bg-amber-50 ring-2 ring-amber-200/50 rounded-lg" />
                        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white ring-2 ring-amber-200/50" />
                        <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white ring-2 ring-amber-200/50" />
                        
                        <span className="relative text-xs font-black text-amber-700 uppercase tracking-widest">
                          {item.code}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {item.description}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-black text-slate-800">
                          {item.discountType === 'Percentage' 
                            ? `GIẢM ${item.discountValue}%` 
                            : `GIẢM ${formatCurrency(item.discountValue)}đ`
                          }
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                          {item.minOrderValue > 0 ? `Đơn tối thiểu ${formatCurrency(item.minOrderValue)}đ` : 'Áp dụng mọi đơn hàng'}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded uppercase">{formatDate(item.startDate)}</span>
                        <span className="text-slate-300">→</span>
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded uppercase">{formatDate(item.endDate)}</span>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <UsageBar count={item.usedCount || 0} limit={item.usageLimit} />
                    </td>

                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-tight ring-1", 
                          status.color
                        )}>
                          {status.isPing && (
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                            </span>
                          )}
                          {status.text}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}