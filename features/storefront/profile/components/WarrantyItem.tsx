import React from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Wrench, Clock, Activity, Calendar, Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface WarrantyItemProps {
  item: {
    productId: string;
    productName: string;
    imageUrl: string;
    serialNumbers?: string[];
    purchaseDate: string;
    expiryDate: string;
    isExpired: boolean;
    currentWarrantyStatus: string | null;
    orderId: string;
    warrantyId?: string;
  };
  onRequest: (item: any) => void;
  onViewProgress: (warrantyId: string, name: string) => void;
}

const statusMap: Record<string, { label: string; className: string; icon: any }> = {
  PENDING: { label: "Chờ xác nhận", className: "bg-amber-50 text-amber-600 ring-amber-100", icon: Clock },
  APPROVED: { label: "Đã tiếp nhận", className: "bg-blue-50 text-blue-600 ring-blue-100", icon: Package },
  UNDER_REPAIR: { label: "Đang sửa chữa", className: "bg-orange-50 text-orange-600 ring-orange-100", icon: Wrench },
  COMPLETED: { label: "Sửa xong", className: "bg-emerald-50 text-emerald-600 ring-emerald-100", icon: ShieldCheck },
  RETURNED: { label: "Đã trả khách", className: "bg-indigo-50 text-indigo-600 ring-indigo-100", icon: ShieldCheck },
  REJECTED: { label: "Bị từ chối", className: "bg-rose-50 text-rose-600 ring-rose-100", icon: ShieldCheck },
};

export const WarrantyItem = ({ item, onRequest, onViewProgress }: WarrantyItemProps) => {
  const isProcessing = !!item.currentWarrantyStatus;
  const statusInfo = isProcessing ? statusMap[item.currentWarrantyStatus!] : null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  return (
    <div className="group flex flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:shadow-[0_8px_30px_rgb(59,130,246,0.08)]">
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        {/* Image */}
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-50 ring-1 ring-slate-100">
          {item.imageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={item.imageUrl} alt={item.productName} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-200">
              <ShieldCheck className="h-10 w-10" />
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex flex-1 flex-col justify-between gap-4 md:flex-row md:items-center">
          
          <div className="flex flex-col gap-1.5">
            <h3 className="text-lg font-black tracking-tight text-slate-800 transition-colors group-hover:text-blue-600">
              {item.productName}
            </h3>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-slate-400">
                <Activity className="h-3.5 w-3.5" />
                Serial: <span className="text-slate-600">{item.serialNumbers?.[0] || "Đang cập nhật"}</span>
              </span>
              <span className={cn(
                "inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest",
                item.isExpired ? 'text-rose-500' : 'text-emerald-500'
              )}>
                <Calendar className="h-3.5 w-3.5" />
                Hạn BH: {formatDate(item.expiryDate)}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-start gap-4 md:items-end">
            {isProcessing ? (
              <div className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-widest ring-1",
                statusInfo?.className
              )}>
                {statusInfo && <statusInfo.icon className="h-3.5 w-3.5" />}
                {statusInfo?.label}
              </div>
            ) : (
              <div className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-widest ring-1",
                item.isExpired ? "bg-slate-50 text-slate-400 ring-slate-100" : "bg-emerald-50 text-emerald-600 ring-emerald-100"
              )}>
                {item.isExpired ? <Clock className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                {item.isExpired ? "Hết hạn" : "Còn hiệu lực"}
              </div>
            )}

            {isProcessing ? (
              <Button 
                onClick={() => onViewProgress(item.warrantyId!, item.productName)}
                className="h-10 rounded-xl bg-blue-600 px-8 text-[11px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all w-full md:w-auto"
              >
                <Activity className="mr-2 h-3.5 w-3.5" />
                Xem tiến độ
              </Button>
            ) : (
              <Button 
                disabled={item.isExpired}
                onClick={() => onRequest(item)}
                variant="outline" 
                className="h-10 rounded-xl border-slate-200 px-8 text-[11px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 active:scale-95 transition-all w-full md:w-auto"
              >
                <Wrench className="mr-2 h-3.5 w-3.5" />
                Yêu cầu bảo hành
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
