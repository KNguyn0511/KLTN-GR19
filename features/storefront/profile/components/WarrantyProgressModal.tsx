"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, Clock, Wrench, PackageCheck, XCircle } from "lucide-react";

interface ProgressItem {
  status: string;
  note: string;
  updatedAt: string;
}

interface WarrantyProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  progress: ProgressItem[];
}

const statusMap: Record<string, { label: string; icon: any; color: string }> = {
  PENDING: { label: "Chờ xác nhận", icon: Clock, color: "text-yellow-500" },
  APPROVED: { label: "Đã tiếp nhận", icon: CheckCircle2, color: "text-blue-500" },
  UNDER_REPAIR: { label: "Đang sửa chữa", icon: Wrench, color: "text-orange-500" },
  COMPLETED: { label: "Sửa xong", icon: PackageCheck, color: "text-green-500" },
  RETURNED: { label: "Đã trả khách", icon: CheckCircle2, color: "text-green-600" },
  REJECTED: { label: "Từ chối bảo hành", icon: XCircle, color: "text-red-500" },
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export function WarrantyProgressModal({ isOpen, onClose, productName, progress }: WarrantyProgressModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary">Tiến độ bảo hành</DialogTitle>
          <p className="text-sm text-gray-500">{productName}</p>
        </DialogHeader>
        
        <div className="mt-6 space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
          {progress && progress.length > 0 ? (
            progress.map((item, index) => {
              const config = statusMap[item.status] || statusMap.PENDING;
              const Icon = config.icon;
              
              return (
                <div key={index} className="relative flex items-center justify-between md:justify-start">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border border-white bg-white shadow shrink-0 md:order-1 ${config.color} z-10`}>
                    <Icon size={20} />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-auto p-4 rounded border border-slate-200 shadow-sm ml-4 md:order-2 bg-slate-50">
                    <div className="flex items-center justify-between space-x-2 mb-1">
                      <div className={`font-bold ${config.color}`}>{config.label}</div>
                      <time className="text-xs font-medium text-slate-500 italic">
                        {formatDate(item.updatedAt)}
                      </time>
                    </div>
                    <div className="text-slate-600 text-sm">{item.note}</div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center py-4 text-gray-500">Chưa có thông tin tiến độ.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
