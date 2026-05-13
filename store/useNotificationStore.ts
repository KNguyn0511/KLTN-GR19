import { create } from "zustand";
import axiosInstance from "@/lib/axiosInstance";

interface Notification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: (userId: string) => Promise<void>;
  addNotification: (notification: Notification) => void;
  markAllAsRead: (userId: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  fetchNotifications: async (userId: string) => {
    try {
      console.log("--- FETCHING NOTIFICATIONS FOR USER:", userId);
      const res = await axiosInstance.get(`/notifications/${userId}`);
      const list = res.data;
      console.log("--- NOTIFICATIONS LIST:", list.length);
      set({ 
        notifications: list, 
        unreadCount: list.filter((n: any) => !n.isRead).length 
      });
    } catch (e) {
      console.error("Fetch notifications error", e);
    }
  },
  addNotification: (n: Notification) => {
    const newList = [n, ...get().notifications];
    set({ 
      notifications: newList,
      unreadCount: get().unreadCount + 1
    });
  },
  markAllAsRead: async (userId: string) => {
    console.log("🚀 [MARK ALL READ] STARTING...");
    // 1. Cho biến mất ngay lập tức (Optimistic Update)
    set({ unreadCount: 0 });
    
    try {
      // 2. Gọi API đồng bộ với Backend
      await axiosInstance.patch(`/notifications/${userId}/read-all`);
      console.log("✅ [MARK ALL READ] DB UPDATED");
      
      // 3. Cập nhật lại danh sách local để mất dấu chấm xanh
      set((state) => ({
        notifications: state.notifications.map((n: any) => ({ ...n, isRead: true }))
      }));
    } catch (e) {
      console.error("❌ [MARK ALL READ] ERROR:", e);
    }
  }
}));
