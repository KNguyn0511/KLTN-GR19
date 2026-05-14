"use client";

import { Input } from "@/components/ui/input";
import { Search, ChevronDown, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function MemberFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State cục bộ cho ô search để gõ không bị giật
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  // Hàm cập nhật URL
  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1"); // Đổi filter thì reset về trang 1
    router.push(`${pathname}?${params.toString()}`);
  };

  // Debounce search (ngừng gõ 500ms mới gọi API)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== (searchParams.get("search") || "")) {
        updateQuery("search", searchTerm);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 md:flex-row md:items-center justify-between">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />
          <Input
            type="text"
            placeholder="Tìm theo tên, SĐT, Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border-none bg-slate-50 py-2.5 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-50/50 focus:shadow-sm"
          />
        </div>

        {/* Dropdown Trạng thái */}
        <div className="relative group">
          <select 
            onChange={(e) => updateQuery("status", e.target.value)}
            defaultValue={searchParams.get("status") || "ACTIVE"}
            className="h-11 min-w-[160px] appearance-none rounded-xl border-none bg-slate-50 pl-4 pr-10 text-[11px] font-black uppercase tracking-wider text-slate-600 outline-none transition-all hover:bg-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-50/50"
          >
            <option value="ACTIVE">Trạng thái: Hoạt động</option>
            <option value="LOCKED">Trạng thái: Đã khóa</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 group-hover:text-slate-600" />
        </div>

        {/* Dropdown Hạng thẻ */}
        <div className="relative group">
          <select 
            onChange={(e) => updateQuery("tier", e.target.value)}
            defaultValue={searchParams.get("tier") || "all"}
            className="h-11 min-w-[160px] appearance-none rounded-xl border-none bg-slate-50 pl-4 pr-10 text-[11px] font-black uppercase tracking-wider text-slate-600 outline-none transition-all hover:bg-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-50/50"
          >
            <option value="all">Hạng thẻ: Tất cả</option>
            <option value="Platinum">Platinum</option>
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
            <option value="Member">Member</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 group-hover:text-slate-600" />
        </div>
      </div>

      <div>
        <Link 
          href="/super-admin/members/create"
          className="group flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-blue-100 transition-all hover:bg-blue-700 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Thêm mới
        </Link>
      </div>
    </div>
  );
}