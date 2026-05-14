"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateVoucherModal } from "./CreateVoucherModal";

interface PromotionHeaderProps {
  refreshData: () => void;
}

export function PromotionHeader({ refreshData }: PromotionHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-100">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Khuyến mãi & Voucher
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Phát hành mã giảm giá, quản lý chiến dịch marketing và theo dõi hiệu quả
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="group flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-slate-200 transition-all hover:bg-slate-800 active:scale-95"
        >
          <Plus className="h-4 w-4 text-amber-400" />
          Tạo Voucher Mới
        </Button>
      </div>

      <CreateVoucherModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={refreshData}
      />
    </>
  );
}
