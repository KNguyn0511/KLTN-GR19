"use client";

import { Loader2, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InventoryAdminRow } from "@/lib/api/inventoryApi";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN").format(amount);
};

export function InventoryTable(props: {
  rows: InventoryAdminRow[];
  loading: boolean;
}) {
  const { rows, loading } = props;

  return (
    <div className="relative min-h-[400px] overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-50 bg-slate-50/50 text-[11px] font-black tracking-widest text-slate-400 uppercase">
              <th className="px-0 w-1"></th>
              <th className="px-6 py-5">MÃ SKU</th>
              <th className="px-6 py-5">SẢN PHẨM</th>
              <th className="px-6 py-5">DANH MỤC</th>
              <th className="px-6 py-5">TỒN KHO (TỔNG)</th>
              <th className="px-6 py-5">GIÁ NHẬP / BÁN</th>
              <th className="px-6 py-5 text-right">TRẠNG THÁI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading && rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">Đang tải dữ liệu...</p>
                  </div>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Package className="h-10 w-10 text-slate-200" />
                    <p className="text-sm font-medium text-slate-400">Không tìm thấy sản phẩm trong kho</p>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((item) => (
                <tr 
                  key={item._id} 
                  className="group transition-all duration-300 hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:z-10 relative"
                >
                  <td className="px-0 w-1 relative">
                    <div className="absolute inset-y-2 left-0 w-1 bg-blue-600 rounded-r-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-full group-hover:translate-x-0" />
                  </td>
                  <td className="px-6 py-5">
                    <span className="rounded-md bg-slate-50 px-2 py-1 text-[10px] font-black text-slate-500 ring-1 ring-slate-200 uppercase tracking-tight">
                      {item.sku}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="rounded-full bg-blue-50/50 px-2.5 py-1 text-[10px] font-bold text-blue-600 ring-1 ring-blue-100/50">
                      {item.categoryName}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-base font-black",
                            item.totalStock > 5 ? "text-slate-800" : "text-rose-600",
                          )}
                        >
                          {item.totalStock}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-tight text-slate-400">Đơn vị: Cái</span>
                      </div>
                      {item.stockBreakdown && (
                        <span className="text-[10px] font-medium text-slate-400 italic">
                          ({item.stockBreakdown})
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-xs">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-12 text-[10px] font-black text-slate-400 uppercase tracking-tighter">Nhập:</span>
                        <span className="font-bold text-slate-700">
                          {formatCurrency(item.importPrice)}đ
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-12 text-[10px] font-black text-slate-400 uppercase tracking-tighter">Bán:</span>
                        <span className="font-bold text-blue-600">
                          {formatCurrency(item.sellPrice)}đ
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ring-1 shadow-sm",
                          item.status === "Sẵn hàng"
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                            : "bg-rose-50 text-rose-700 ring-rose-100",
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            item.status === "Sẵn hàng" ? "bg-emerald-500 animate-pulse" : "bg-rose-500",
                          )}
                        />
                        {item.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
