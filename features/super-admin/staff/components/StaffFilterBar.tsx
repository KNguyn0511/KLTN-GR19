"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { StaffAddModal } from "./StaffAddModal";

interface StaffFilterBarProps {
  onOpenAdd: () => void; // Khai báo là sẽ nhận một hàm
}

export function StaffFilterBar({ onOpenAdd }: StaffFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // STATE ĐỂ QUẢN LÝ ĐÓNG/MỞ MODAL
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Khởi tạo state từ URL hiện tại
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [role, setRole] = useState(searchParams.get("role") || "");
  const [branch, setBranch] = useState(searchParams.get("branchId") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");

  // Hàm update URL
  const applyFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`?${params.toString()}`);
  };

  return (
    <>
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 md:flex-row md:items-center justify-between">
      
      {/* Left side: Search & Dropdowns */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1">
        {/* Search */}
        <div className="relative w-full md:max-w-xs group">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />
          <Input
            type="text"
            placeholder="Tìm theo Tên, Email..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters({ keyword })}
            className="w-full rounded-xl border-none bg-slate-50 py-2.5 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-50/50 focus:shadow-sm"
          />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto">
          {/* Dropdown Vai trò */}
          <div className="relative group">
            <select 
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                applyFilters({ role: e.target.value });
              }}
              className="h-11 min-w-[160px] appearance-none rounded-xl border-none bg-slate-50 pl-4 pr-10 text-[11px] font-black uppercase tracking-wider text-slate-600 outline-none transition-all hover:bg-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-50/50"
            >
              <option value="all">Vai trò: Tất cả</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Store Manager">Store Manager</option>
              <option value="Sales & Support">Sales & Support</option>
              <option value="Warehouse Staff">Warehouse Staff</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 group-hover:text-slate-600" />
          </div>

          {/* Dropdown Trạng thái */}
          <div className="relative group">
            <select 
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                applyFilters({ status: e.target.value });
              }}
              className="h-11 min-w-[160px] appearance-none rounded-xl border-none bg-slate-50 pl-4 pr-10 text-[11px] font-black uppercase tracking-wider text-slate-600 outline-none transition-all hover:bg-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-50/50"
            >
              <option value="all">Trạng thái: Tất cả</option>
              <option value="ACTIVE">Active (Hoạt động)</option>
              <option value="LOCKED">Locked (Đã khóa)</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 group-hover:text-slate-600" />
          </div>
        </div>
      </div>

      {/* Right side: Add button */}
      <div>
        <Button 
          onClick={() => setIsModalOpen(true)} 
          className="group flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-blue-100 transition-all hover:bg-blue-700 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Thêm Nhân viên
        </Button>
      </div>

    </div>
    <StaffAddModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}