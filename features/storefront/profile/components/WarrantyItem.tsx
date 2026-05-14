import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

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

const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-700" },
  APPROVED: { label: "Đã tiếp nhận", color: "bg-blue-100 text-blue-700" },
  UNDER_REPAIR: { label: "Đang sửa chữa", color: "bg-orange-100 text-orange-700" },
  COMPLETED: { label: "Sửa xong", color: "bg-green-100 text-green-700" },
  RETURNED: { label: "Đã trả khách", color: "bg-emerald-100 text-emerald-700" },
  REJECTED: { label: "Bị từ chối", color: "bg-red-100 text-red-700" },
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("vi-VN");
};

export const WarrantyItem = ({ item, onRequest, onViewProgress }: WarrantyItemProps) => {
  const isProcessing = !!item.currentWarrantyStatus;
  const statusInfo = isProcessing ? statusMap[item.currentWarrantyStatus!] : null;

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="relative w-[120px] h-[120px] flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
        <Image
          src={item.imageUrl || "/images/pink.jpg"}
          alt={item.productName}
          fill
          className="object-contain p-2"
        />
      </div>

      <div className="flex-grow space-y-2 text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <h3 className="text-[18px] font-bold text-heading leading-tight">
            {item.productName}
          </h3>
          {isProcessing ? (
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusInfo?.color}`}>
              {statusInfo?.label}
            </span>
          ) : (
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.isExpired ? "bg-gray-100 text-gray-500" : "bg-green-50 text-green-600 border border-green-100"}`}>
              {item.isExpired ? "Hết hiệu lực" : "Còn hiệu lực"}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-sm text-gray-500">
            Serial/IMEI: <span className="font-medium text-gray-700">{item.serialNumbers?.[0] || "Đang cập nhật"}</span>
          </p>
          <p className="text-sm text-gray-500">
            Hạn bảo hành: <span className={`font-medium ${item.isExpired ? "text-red-400" : "text-gray-700"}`}>
              {formatDate(item.expiryDate)}
            </span>
          </p>
        </div>
      </div>

      <div className="flex-shrink-0">
        {isProcessing ? (
          <Button
            onClick={() => onViewProgress(item.warrantyId!, item.productName)}
            className="px-6 py-2 bg-primary text-white text-[13px] font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-sm uppercase tracking-wider"
          >
            XEM TIẾN ĐỘ
          </Button>
        ) : (
          <Button
            disabled={item.isExpired}
            onClick={() => onRequest(item)}
            className={`px-6 py-2 text-[13px] font-bold rounded-lg transition-all shadow-sm uppercase tracking-wider ${
              item.isExpired 
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200" 
              : "bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white"
            }`}
          >
            YÊU CẦU BẢO HÀNH
          </Button>
        )}
      </div>
    </div>
  );
};
