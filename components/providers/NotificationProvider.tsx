"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { io, type Socket } from "socket.io-client";
import { useNotificationStore } from "@/store/useNotificationStore";

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
  const { fetchNotifications } = useNotificationStore();
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

    // PHÁT ÂM THANH DÙNG ĐỐI TƯỢNG AUDIO ĐỘNG
    try {
      // Tiếng 'Ping' ngắn mã hóa Base64 để đảm bảo luôn có âm thanh kể cả khi file lỗi
      const BEEP_BASE64 = "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YTdvT18AZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAABfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19f";
      const audio = new Audio(SOUND_SRC);
      
      audio.volume = 1.0;
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise.then(() => {
          // GIỚI HẠN SOUND CHỈ CHẠY 3 GIÂY
          setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
          }, 3000);
        }).catch(() => {
          // Nếu file mp3 lỗi hoặc bị chặn, thử phát tiếng beep dự phòng
          const fallbackAudio = new Audio(BEEP_BASE64);
          fallbackAudio.play().catch(e => console.warn("Audio fully blocked:", e.message));
        });
      }
    } catch (err) {
      console.error("❌ [Notification] Audio error:", err);
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
    const authStorageRaw = localStorage.getItem("auth-storage");
    
    let userRole = "";
    let token = "";
    let userId = "";

    const getUserId = (obj: any) => {
      if (!obj) return "";
      return obj.id || obj._id || obj.userId || obj.user?.id || obj.user?._id || obj.user?.userId || "";
    };

    const path = typeof window !== "undefined" ? window.location.pathname : "";
    const isAdminArea =
      path.startsWith("/super-admin") ||
      path.startsWith("/admin") ||
      path.startsWith("/store-manager") ||
      path.startsWith("/staff") ||
      path.startsWith("/central-warehouse");

    if (isAdminArea && adminInfoRaw) {
      try {
        const parsed = JSON.parse(adminInfoRaw);
        userId = getUserId(parsed);
        userRole = parsed.role || parsed.user?.role || "super-admin";
        token = localStorage.getItem("admin_token") || "";
      } catch (e) {
        console.error("Failed to parse admin_info", e);
      }
    } else if (authStorageRaw) {
      try {
        const parsed = JSON.parse(authStorageRaw);
        userId = getUserId(parsed.state) || getUserId(parsed.state?.user);
        userRole = parsed.state?.user?.role || "customer";
        token = parsed.state?.access_token || "";
      } catch (e) {}
    }

    const normalizedRole = userRole.toLowerCase().replace(/\s+/g, "-");
    const isAuthorized = [
      "super-admin",
      "store-manager",
      "sales-staff",
      "warehouse-staff",
      "admin",
      "customer",
      "user",
    ].includes(normalizedRole);

    if (!isAuthorized) return;

    if (userId && normalizedRole === "customer") fetchNotifications(userId);

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      auth: { role: normalizedRole, token, userId },
      query: { userId, role: normalizedRole },
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("SOCKET CONNECTED! ID:", socket.id);
    });

    // CHỈ CHO PHÉP SUPER-ADMIN VÀ STORE-MANAGER NHẬN THÔNG BÁO ĐƠN HÀNG MỚI
    if (["super-admin", "store-manager"].includes(normalizedRole)) {
      socket.on("NEW_ORDER_RECEIVED", (data) => {
        console.log("🔔 [ADMIN] NEW ORDER EVENT RECEIVED!!", data);
        openNotification(data);
      });
    }

    socket.on("NOTIFICATION_RECEIVED", (data) => {
      console.log("REAL-TIME NOTIFICATION RECEIVED:", data);
      if (userId) {
        fetchNotifications(userId);
      }
    });
  };

  useEffect(() => {
    setMounted(true);
    const tryConnect = () => {
      if (socketRef.current) return;
      const adminInfoRaw = localStorage.getItem("admin_info");
      const authStorageRaw = localStorage.getItem("auth-storage");
      
      if (!adminInfoRaw && !authStorageRaw) {
        if (retryCountRef.current < 10) {
          retryCountRef.current += 1;
          retryTimerRef.current = window.setTimeout(tryConnect, 1000);
        }
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
