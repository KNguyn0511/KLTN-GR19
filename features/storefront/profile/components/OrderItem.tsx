"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { OrderData } from "../types/order";
import { cancelOrder } from "@/lib/api/orderApi";
import { useCartStore } from "@/store/useCartStore";

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
    { label: string; className: string }
  > = {
    pending: {
      label: "Đang xử lý",
      className: "bg-[#FFF8E1] text-[#F57F17]",
    },
    shipping: {
      label: "Đang giao",
      className: "bg-blue-50 text-primary",
    },
    completed: {
      label: "Hoàn thành",
      className: "bg-success/15 text-success",
    },
    cancelled: {
      label: "Đã hủy",
      className: "bg-gray-100 text-gray-500",
    },
  };

  const currentStatus = statusConfig[order.status];

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
        name: p.name,
        price: p.price,
        quantity: p.quantity,
        image: p.imageUrl,
        // variant attributes are not fully stored in OrderProduct, but we try our best
      });
    });
    toast.success("Đã thêm các sản phẩm vào giỏ hàng");
    router.push("/cart");
  };

  return (
    <div className="flex flex-col rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-gray-100 pb-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4 font-semibold">
          <span className="text-[14px] text-heading">Đơn hàng #{order.id}</span>
          <span className="hidden text-gray-300 md:block">|</span>
          <span className="text-[14px] text-gray-500">Ngày đặt: {order.createdAt}</span>

          {order.isOTC && (
            <div className="ml-0 flex w-fit items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[13px] font-bold text-primary md:ml-2">
              <ShoppingCart size={14} className="text-primary" /> Mua tại quầy
            </div>
          )}
        </div>

        <div className={`mt-2 flex w-fit items-center justify-center rounded-md px-4 py-1.5 text-[14px] font-bold md:mt-0 ${currentStatus.className}`}>
          {currentStatus.label}
        </div>
      </div>

      {/* Body: Products */}
      <div className="flex flex-col pt-4">
        {order.products.map((product, idx) => (
          <div key={`${order.id}-${idx}`} className="mb-4 flex gap-4 last:mb-0 pb-4 border-b border-gray-100">
            {/* Image placeholder */}
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-gray-100 border border-gray-100 relative flex items-center justify-center">
              {product.imageUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
              ) : null}
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col md:flex-row md:justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[15px] font-bold text-heading">{product.name}</span>
                <span className="text-[13px] text-gray-500 font-medium">Phân loại: {product.variant}</span>
                <span className="text-[14px] font-bold text-heading mt-1">x{product.quantity}</span>
              </div>
              <div className="mt-2 text-right md:mt-0">
                <span className="text-[15px] font-bold text-destructive">{formatMoney(product.price)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-4 pt-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-medium text-gray-500">Thành tiền:</span>
          <span className="text-[20px] font-bold text-destructive">{formatMoney(order.totalAmount)}</span>
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/profile/orders/${order.id}`}>
            <Button
              type="button"
              variant="outline"
              className="h-9 font-bold text-heading hover:bg-gray-50 bg-white"
            >
              Chi tiết đơn hàng
            </Button>
          </Link>

          {order.status === "pending" && (
            <Button
              type="button"
              variant="outline"
              disabled={cancelling}
              className="h-9 font-bold text-destructive hover:bg-red-50 border-destructive/20"
              onClick={handleCancel}
            >
              {cancelling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Hủy đơn
            </Button>
          )}

          {(order.status === "completed" || order.status === "cancelled") && (
            <Button
              type="button"
              className="h-9 px-6 font-bold text-white shadow-sm hover:opacity-90 bg-primary"
              onClick={handleReorder}
            >
              Mua lại
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
