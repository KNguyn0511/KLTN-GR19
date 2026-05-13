"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { io, type Socket } from "socket.io-client";

const SOUND_SRC = "/sounds/notification.mp3";
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

export type NotificationPayload = {
  id: string;
  orderCode: string;
  totalPrice: number;
  customerName: string;
  timestamp: Date;
};

export default function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const retryTimerRef = useRef<number | null>(null);
  const retryCountRef = useRef(0);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => setNotifications([]);

  const openNotification = (data: any) => {
    const newId = `${data.orderCode || "ORDER"}-${Date.now()}`;
    const newNotif: NotificationPayload = {
      id: newId,
      orderCode: data.orderCode || data.code || "—",
      totalPrice: Number(data.totalPrice || data.totalAmount || 0),
      customerName: data.customerName || data.customer?.name || "Khách hàng",
      timestamp: new Date(),
    };

    setNotifications((prev) => [...prev, newNotif]);

    if (audioRef.current) {
      const audio = audioRef.current;
      audio.currentTime = 0;
      audio.play().catch((e) => console.warn("[NotificationProvider] Sound blocked", e));
      setTimeout(() => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      }, 3000);
    }
  };

  // Tự động cuộn xuống cuối khi có thông báo mới
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [notifications]);

  const connectSocket = () => {
    if (socketRef.current) return;
    const adminInfoRaw = localStorage.getItem("admin_info");
    let userRole = "";
    if (adminInfoRaw) {
      try {
        const parsed = JSON.parse(adminInfoRaw);
        userRole = parsed.role || parsed.user?.role || "";
      } catch (e) {
        console.error("Failed to parse admin_info", e);
      }
    }
    const normalizedRole = userRole.toLowerCase().replace(/\s+/g, "-");
    if (normalizedRole !== "super-admin" && normalizedRole !== "store-manager") return;

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      auth: { role: normalizedRole, token: localStorage.getItem("admin_token") },
      withCredentials: true,
    });

    socketRef.current = socket;
    socket.on("NEW_ORDER_RECEIVED", (data) => openNotification(data));
  };

  useEffect(() => {
    setMounted(true);
    const tryConnect = () => {
      if (socketRef.current) return;
      if (!localStorage.getItem("admin_info")) {
        retryCountRef.current += 1;
        if (retryCountRef.current <= 10) retryTimerRef.current = window.setTimeout(tryConnect, 500);
        return;
      }
      connectSocket();
    };
    tryConnect();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "admin_info" && !socketRef.current && e.newValue) connectSocket();
    };
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      if (retryTimerRef.current) window.clearTimeout(retryTimerRef.current);
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  return (
    <>
      <audio ref={audioRef} src={SOUND_SRC} preload="auto" />
      {children}
      {mounted && notifications.length > 0 && typeof document !== "undefined"
        ? createPortal(
            <div className="pointer-events-none fixed right-4 bottom-4 z-[99999] flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
              {/* Badge tổng số đơn chưa xử lý */}
              <div className="pointer-events-auto flex items-center gap-3">
                 {notifications.length > 3 && (
                    <button 
                      onClick={clearAll}
                      className="rounded-full bg-slate-800/80 px-3 py-1 text-[10px] font-medium text-slate-400 hover:bg-slate-700 hover:text-white backdrop-blur-sm transition"
                    >
                      Xóa tất cả
                    </button>
                 )}
                 <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white shadow-lg animate-bounce">
                    {notifications.length}
                 </div>
              </div>

              {/* Container cuộn */}
              <div 
                ref={scrollRef}
                className="pointer-events-auto flex max-h-[580px] w-[360px] flex-col gap-3 overflow-y-auto pr-2 scrollbar-hide custom-scrollbar"
                style={{ scrollBehavior: 'smooth' }}
              >
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="w-full shrink-0 animate-in slide-in-from-right-full fade-in duration-500 overflow-hidden rounded-xl border border-white/10 bg-slate-900/95 p-4 text-white shadow-2xl backdrop-blur-md"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
                          ĐƠN HÀNG MỚI
                        </p>
                        <h4 className="mt-1 font-bold text-white">#{notif.orderCode}</h4>
                      </div>
                      <button
                        onClick={() => removeNotification(notif.id)}
                        className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="space-y-2 rounded-lg bg-white/5 p-3 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Khách hàng:</span>
                        <span className="font-medium">{notif.customerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Tổng tiền:</span>
                        <span className="font-bold text-emerald-400">
                          {notif.totalPrice.toLocaleString("vi-VN")} ₫
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">
                        {notif.timestamp.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <a
                        href={`/super-admin/orders?search=${notif.orderCode}`}
                        className="rounded-lg bg-blue-600 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-blue-500"
                        onClick={() => removeNotification(notif.id)}
                      >
                        Chi tiết
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>,
            document.body,
          )
        : null}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </>
  );
}
