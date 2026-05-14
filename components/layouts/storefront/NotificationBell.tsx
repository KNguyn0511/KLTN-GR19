"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useNotificationStore } from "@/store/useNotificationStore";

// Hàm hỗ trợ định dạng thời gian đơn giản
function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return "Vừa xong";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
  return date.toLocaleDateString("vi-VN");
}

export default function NotificationBell() {
  const { notifications, unreadCount, markAllAsRead } = useNotificationStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkSocket = () => {
      const socket = (window as any).socket;
      if (socket?.connected) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    };
    const timer = setInterval(checkSocket, 2000);
    return () => clearInterval(timer);
  }, []);

  const handleMouseEnter = () => {
    setShowDropdown(true);
    if (unreadCount > 0) {
      const authStorageRaw = localStorage.getItem("auth-storage");
      const adminInfoRaw = localStorage.getItem("admin_info");
      let userId = "";
      try {
        if (adminInfoRaw) {
          const parsed = JSON.parse(adminInfoRaw);
          userId = parsed.id || parsed._id || parsed.user?.id || parsed.user?._id;
        }
        if (!userId && authStorageRaw) {
          const parsed = JSON.parse(authStorageRaw);
          userId = parsed.state?.user?.id || parsed.state?.user?._id;
        }
        if (userId) markAllAsRead(userId);
      } catch (e) {}
    }
  };

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setShowDropdown(false)}
    >
      <div className="group relative flex items-center gap-2.5 px-4 py-2 rounded-full border border-slate-100 bg-white/50 backdrop-blur-sm transition-all hover:border-primary/20 hover:bg-white hover:shadow-md active:scale-95 cursor-pointer">
        <div className="relative">
          <Bell 
            size={20} 
            className={cn(
              "text-slate-400 transition-all group-hover:text-primary",
              unreadCount > 0 && "animate-bounce text-primary"
            )} 
          />
          {/* Dấu chấm báo trạng thái kết nối (Dùng để Debug) */}
          <div className={cn(
            "absolute -bottom-0.5 -left-0.5 h-2 w-2 rounded-full border border-white",
            isConnected ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "bg-slate-300"
          )} title={isConnected ? "Đã kết nối Socket" : "Mất kết nối Socket"}></div>
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-tr from-red-600 to-orange-500 text-[10px] font-bold text-white shadow-lg ring-2 ring-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
        <span className="hidden md:block text-[14px] font-semibold text-slate-700 transition-colors group-hover:text-primary">
          Thông báo
        </span>
      </div>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute top-full right-0 w-80 pt-2 animate-in fade-in slide-in-from-top-2 duration-200 z-[9999]">
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl shadow-slate-200/50">
            <div className="flex items-center justify-between border-b border-slate-50 bg-slate-50/50 px-4 py-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Thông báo mới</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-primary">
                  {unreadCount} mới
                </span>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <Link
                    key={n._id}
                    href="/profile"
                    className={cn(
                      "flex flex-col gap-1 border-b border-slate-50 p-4 transition-colors hover:bg-blue-50/30",
                      !n.isRead && "bg-blue-50/10"
                    )}
                    onClick={() => setShowDropdown(false)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className={cn("text-sm font-bold", !n.isRead ? "text-slate-900" : "text-slate-600")}>
                        {n.title}
                      </span>
                      {!n.isRead && <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary"></div>}
                    </div>
                    <p className="text-xs leading-relaxed text-slate-500 line-clamp-2">
                      {n.message}
                    </p>
                    <span className="mt-1 text-[10px] font-medium text-slate-400">
                      {formatTime(n.createdAt)}
                    </span>
                  </Link>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                    <Bell size={24} />
                  </div>
                  <p className="text-sm font-medium text-slate-400">Chưa có thông báo nào</p>
                </div>
              )}
            </div>

            <Link
              href="/profile"
              className="flex w-full items-center justify-center bg-slate-50/50 py-3 text-[11px] font-bold uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-white"
              onClick={() => setShowDropdown(false)}
            >
              Xem tất cả thông báo
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
