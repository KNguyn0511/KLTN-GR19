"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";
import { 
  User, 
  ShoppingBag, 
  MapPin, 
  ShieldCheck, 
  Lock, 
  LogOut,
  ChevronRight
} from "lucide-react";

const menuItems = [
  { href: "/profile", label: "Thông tin tài khoản", icon: User },
  { href: "/profile/orders", label: "Lịch sử mua hàng", icon: ShoppingBag },
  { href: "/profile/addresses", label: "Sổ địa chỉ nhận hàng", icon: MapPin },
  { href: "/profile/warranty", label: "Lịch sử bảo hành", icon: ShieldCheck },
  { href: "/profile/change-password", label: "Đổi mật khẩu", icon: Lock },
];

export const ProfileSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!user) return null;

  return (
    <div className="flex w-full flex-col gap-6 md:w-[300px] shrink-0">
      {/* User Info Card */}
      <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:shadow-[0_8px_30px_rgb(59,130,246,0.08)]">
        <div className="absolute top-0 right-0 h-20 w-20 translate-x-10 -translate-y-10 rounded-full bg-blue-50/50 transition-transform group-hover:scale-110" />
        
        <div className="relative flex items-center gap-4">
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-2xl font-black text-white shadow-lg shadow-blue-100">
              {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
          </div>
          
          <div className="flex flex-col">
            <span className="text-base font-black text-slate-800 leading-tight">
              {user?.fullName || "User"}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-blue-500">
              <span className="h-1 w-1 rounded-full bg-blue-500" />
              Thành viên
            </span>
          </div>
        </div>
      </div>

      {/* Menu Navigation */}
      <div className="flex flex-col rounded-2xl border border-slate-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden p-2">
        <div className="px-4 py-3 mb-1">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Quản lý cá nhân</span>
        </div>
        
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex h-12 w-full items-center justify-between rounded-xl px-4 transition-all duration-300",
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                  isActive ? "bg-white shadow-sm" : "bg-slate-50 group-hover:bg-white"
                )}>
                  <Icon className={cn("h-4 w-4", isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")} />
                </div>
                <span className={cn("text-sm font-bold", isActive ? "font-black" : "font-semibold")}>
                  {item.label}
                </span>
              </div>
              <ChevronRight className={cn("h-4 w-4 transition-transform group-hover:translate-x-0.5", isActive ? "opacity-100" : "opacity-0")} />
            </Link>
          );
        })}

        <div className="mx-4 my-3 h-px bg-slate-50" />

        <button
          onClick={handleLogout}
          className="group flex h-12 w-full items-center gap-3 rounded-xl px-4 text-sm font-bold text-rose-500 transition-all hover:bg-rose-50"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 group-hover:bg-white transition-colors">
            <LogOut className="h-4 w-4" />
          </div>
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};
