"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, 
  Calendar, 
  Package, 
  ChevronRight, 
  FileText, 
  Repeat, 
  Eye, 
  Truck, 
  CheckCircle2, 
  XCircle,
  Loader2,
  ShoppingCart
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { OrderData } from "../types/order";
import { cancelOrder } from "@/lib/api/orderApi";
import { useCartStore } from "@/store/useCartStore";
import { cn } from "@/lib/utils";

interface OrderItemProps {
  order: OrderData;
  onRefresh?: () => void;
}

export const OrderItem = ({ order, onRefresh }: OrderItemProps) => {
  const router = useRouter();
  const { addItem } = useCartStore();
  const [cancelling, setCancelling] = useState(false);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount).replace("₫", "đ");
  };

  const statusConfig: Record<
    OrderData["status"],
    { label: string; className: string; icon: any }
  > = {
    pending: {
      label: "ĐANG XỬ LÝ",
      className: "bg-blue-50 text-blue-600 ring-blue-100",
      icon: Package,
    },
    shipping: {
      label: "ĐANG GIAO",
      className: "bg-indigo-50 text-indigo-600 ring-indigo-100",
      icon: Truck,
    },
    completed: {
      label: "HOÀN THÀNH",
      className: "bg-emerald-50 text-emerald-600 ring-emerald-100",
      icon: CheckCircle2,
    },
    cancelled: {
      label: "ĐÃ HỦY",
      className: "bg-slate-50 text-slate-400 ring-slate-100",
      icon: XCircle,
    },
  };

  const currentStatus = statusConfig[order.status];
  const StatusIcon = currentStatus.icon;

  const handleCancel = async () => {
    if (!order.mongoId) return;
    if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) return;

    setCancelling(true);
    try {
      await cancelOrder(order.mongoId);
      toast.success("Đã hủy đơn hàng thành công");
      onRefresh?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể hủy đơn hàng");
    } finally {
      setCancelling(false);
    }
  };

  const handleReorder = () => {
    order.products.forEach((p) => {
      addItem({
        id: p.id,
        cartItemId: `${p.id}-${p.variant || 'default'}`, // Tạo ID duy nhất cho giỏ hàng
        name: p.name,
        price: p.price,
        quantity: p.quantity,
        image: p.imageUrl,
        configName: p.variant,
      });
    });
    toast.success("Đã thêm các sản phẩm vào giỏ hàng");
    router.push("/cart");
  };

  return (
    <div className="group flex flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:shadow-[0_8px_30px_rgb(59,130,246,0.08)]">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-50 pb-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-slate-800 uppercase tracking-tight">Đơn hàng #{order.id}</span>
              {order.isOTC && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-tighter text-blue-600 ring-1 ring-blue-100">
                  Tại quầy
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
              <Calendar className="h-3 w-3" />
              <span>Ngày đặt: {order.createdAt}</span>
            </div>
          </div>
        </div>

        <div className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-widest ring-1",
          currentStatus.className
        )}>
          <StatusIcon className="h-3.5 w-3.5" />
          {currentStatus.label}
        </div>
      </div>

      {/* Body: Products */}
      <div className="flex flex-col py-6">
        {order.products.map((product, idx) => (
          <div key={`${order.id}-${idx}`} className="group/item flex items-center gap-5 py-4 first:pt-0 last:pb-0">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-50 ring-1 ring-slate-100">
              {product.imageUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={product.imageUrl} alt={product.name} className="h-full w-full object-contain transition-transform duration-500 group-hover/item:scale-110" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-200">
                  <Package className="h-8 w-8" />
                </div>
              )}
              <div className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-lg bg-slate-900/80 text-[11px] font-black text-white backdrop-blur-sm">
                x{product.quantity}
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-1 overflow-hidden">
              <h4 className="truncate text-sm font-black text-slate-800 transition-colors group-hover/item:text-blue-600">
                {product.name}
              </h4>
              <p className="line-clamp-1 text-[11px] font-bold uppercase tracking-tight text-slate-400">
                {product.variant}
              </p>
              <div className="mt-1">
                <span className="text-sm font-black text-blue-600">{formatMoney(product.price)}</span>
              </div>
            </div>
            
            <ChevronRight className="h-4 w-4 text-slate-200 transition-transform group-hover/item:translate-x-1" />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-6 border-t border-slate-50 pt-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tổng cộng</span>
            <span className="text-2xl font-black tracking-tight text-blue-600">{formatMoney(order.totalAmount)}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href={`/profile/orders/${order.id}`}>
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl border-slate-200 px-6 text-[11px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 active:scale-95 transition-all"
            >
              <Eye className="mr-2 h-3.5 w-3.5" />
              Chi tiết đơn hàng
            </Button>
          </Link>

          {order.status === "pending" && (
            <Button
              type="button"
              variant="outline"
              disabled={cancelling}
              className="h-10 rounded-xl border-rose-200 px-6 text-[11px] font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50 active:scale-95 transition-all"
              onClick={handleCancel}
            >
              {cancelling ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <XCircle className="mr-2 h-3.5 w-3.5" />}
              Hủy đơn
            </Button>
          )}

          {(order.status === "completed" || order.status === "cancelled") && (
            <Button
              type="button"
              className="h-10 rounded-xl bg-slate-900 px-8 text-[11px] font-black uppercase tracking-widest text-white shadow-lg shadow-slate-100 hover:bg-blue-600 active:scale-95 transition-all"
              onClick={handleReorder}
            >
              <Repeat className="mr-2 h-3.5 w-3.5" />
              Mua lại
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
