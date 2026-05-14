import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  AdminOrderChannel,
  AdminOrderDate,
  AdminOrderTab,
} from "@/lib/api/adminOrdersApi";

export type OrderFilterBarProps = {
  search: string;
  onSearchChange: (v: string) => void;
  tab: AdminOrderTab;
  onTab: (t: AdminOrderTab) => void;
  channel: AdminOrderChannel;
  onChannel: (c: AdminOrderChannel) => void;
  date: AdminOrderDate;
  onDate: (d: AdminOrderDate) => void;
};

export function OrderFilterBar({
  search,
  onSearchChange,
  tab,
  onTab,
  channel,
  onChannel,
  date,
  onDate,
}: OrderFilterBarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 md:flex-row md:items-center justify-between">
      {/* Left side: Search & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center gap-8">
        {/* Search */}
        <div className="relative w-full md:w-72 group">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />
          <Input
            type="text"
            placeholder="Tìm Mã đơn, SĐT khách..."
            className="w-full rounded-xl border-none bg-slate-50 py-2.5 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-50/50 focus:shadow-sm"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 overflow-x-auto text-xs font-black uppercase tracking-widest no-scrollbar">
          <button
            type="button"
            className={cn(
              "whitespace-nowrap transition-all border-b-2 py-1",
              tab === "all"
                ? "border-blue-600 text-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-600"
            )}
            onClick={() => onTab("all")}
          >
            Tất cả
          </button>
          <button
            type="button"
            className={cn(
              "whitespace-nowrap transition-all border-b-2 py-1",
              tab === "pending"
                ? "border-blue-600 text-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-600"
            )}
            onClick={() => onTab("pending")}
          >
            Chờ xác nhận
          </button>
          <button
            type="button"
            className={cn(
              "whitespace-nowrap transition-all border-b-2 py-1",
              tab === "processing"
                ? "border-blue-600 text-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-600"
            )}
            onClick={() => onTab("processing")}
          >
            Đang xử lý
          </button>
          <button
            type="button"
            className={cn(
              "whitespace-nowrap transition-all border-b-2 py-1",
              tab === "completed"
                ? "border-blue-600 text-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-600"
            )}
            onClick={() => onTab("completed")}
          >
            Hoàn thành
          </button>
        </div>
      </div>

      {/* Right side: Dropdowns */}
      <div className="flex items-center gap-3">
        <div className="relative group">
          <select
            className="h-10 min-w-[140px] appearance-none rounded-xl border-none bg-slate-50 pl-4 pr-10 text-[10px] font-black uppercase tracking-wider text-slate-600 outline-none transition-all hover:bg-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-50/50"
            value={channel}
            onChange={(e) => onChannel(e.target.value as AdminOrderChannel)}
          >
            <option value="all">Kênh: Tất cả</option>
            <option value="ONLINE">Website</option>
            <option value="O2O">Tại quầy</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 group-hover:text-slate-600" />
        </div>

        <div className="relative group">
          <select
            className="h-10 min-w-[140px] appearance-none rounded-xl border-none bg-slate-50 pl-4 pr-10 text-[10px] font-black uppercase tracking-wider text-slate-600 outline-none transition-all hover:bg-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-50/50"
            value={date}
            onChange={(e) => onDate(e.target.value as AdminOrderDate)}
          >
            <option value="today">Ngày: Hôm nay</option>
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 group-hover:text-slate-600" />
        </div>
      </div>
    </div>
  );
}
