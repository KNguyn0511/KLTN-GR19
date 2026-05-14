"use client";

import { Input } from "@/components/ui/input";
import { Search, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function ProductFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    params.set("page", "1"); 
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== (searchParams.get("search") || "")) {
        updateQuery("search", searchTerm);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const clearFilters = () => {
    setSearchTerm("");
    router.push(pathname);
  };

  const hasFilters = searchParams.toString().length > 0;

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 md:flex-row md:items-center">
      {/* Search Input */}
      <div className="relative flex-1 group">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />
        <Input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border-none bg-slate-50 py-2.5 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-50/50 focus:shadow-sm"
        />
      </div>
      
      {/* Filters Container */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Category Select */}
        <div className="relative group">
          <select 
            onChange={(e) => updateQuery("category", e.target.value)}
            defaultValue={searchParams.get("category") || ""}
            className="h-10 min-w-[160px] appearance-none rounded-xl border-none bg-slate-50 pl-4 pr-10 text-xs font-bold text-slate-600 outline-none transition-all hover:bg-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-50/50"
          >
            <option value="">Danh mục: Tất cả</option>
            <option value="cpu">Vi xử lý (CPU)</option>
            <option value="mainboard">Mainboard</option>
            <option value="laptop">Laptop</option>
            <option value="vga">Card đồ họa (VGA)</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-slate-600" />
        </div>

        {/* Brand Select */}
        <div className="relative group">
          <select 
             onChange={(e) => updateQuery("brand", e.target.value)}
             defaultValue={searchParams.get("brand") || ""}
             className="h-10 min-w-[140px] appearance-none rounded-xl border-none bg-slate-50 pl-4 pr-10 text-xs font-bold text-slate-600 outline-none transition-all hover:bg-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-50/50"
          >
            <option value="">Thương hiệu</option>
            <option value="intel">Intel</option>
            <option value="asus">Asus</option>
            <option value="dell">Dell</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-slate-600" />
        </div>

        {/* Status Select */}
        <div className="relative group">
          <select 
            onChange={(e) => updateQuery("isActive", e.target.value)}
            defaultValue={searchParams.get("isActive") || "all"}
            className="h-10 min-w-[140px] appearance-none rounded-xl border-none bg-slate-50 pl-4 pr-10 text-xs font-bold text-slate-600 outline-none transition-all hover:bg-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-50/50"
          >
            <option value="all">Trạng thái: Tất cả</option>
            <option value="true">Đang hiển thị</option>
            <option value="false">Đang ẩn</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-slate-600" />
        </div>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="h-10 px-4 text-xs font-black text-rose-500 hover:text-rose-600 transition-colors"
          >
            XÓA LỌC
          </button>
        )}
      </div>
    </div>
  );
}