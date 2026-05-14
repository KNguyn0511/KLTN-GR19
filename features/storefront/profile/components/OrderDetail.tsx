"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  Package, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  CreditCard, 
  Calendar,
  Tag,
  Hash
} from "lucide-react";
import { getOrderDetail } from "@/lib/api/orderApi";
import { toast } from "react-toastify";

export const OrderDetail = () => {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await getOrderDetail(orderId);
        setOrder(data);
      } catch (error) {
        console.error(error);
        toast.error("Không tìm thấy thông tin đơn hàng");
        router.push("/profile/orders");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchDetail();
    }
  }, [orderId, router]);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount).replace("₫", "đ");
  };

  if (loading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!order) return null;

  const steps = [
    { key: "PENDING_CONFIRMATION", label: "Chờ xác nhận", icon: Calendar },
    { key: "CONFIRMED", label: "Đã xác nhận", icon: CheckCircle2 },
    { key: "PACKING", label: "Đang đóng gói", icon: Package },
    { key: "SHIPPING", label: "Đang giao hàng", icon: Truck },
    { key: "COMPLETED", label: "Đã nhận hàng", icon: CheckCircle2 },
  ];

  const currentStatusIndex = steps.findIndex(s => s.key === order.status);
  const isCancelled = order.status === "CANCELLED";

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          className="rounded-full"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-heading">Chi tiết đơn hàng {order.orderCode}</h1>
          <p className="text-sm text-gray-500">
            Ngày đặt: {new Date(order.createdAt).toLocaleString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        {isCancelled ? (
          <div className="flex items-center gap-3 text-destructive">
            <XCircle className="h-8 w-8" />
            <span className="text-lg font-bold">Đơn hàng này đã bị hủy</span>
          </div>
        ) : (
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;

              return (
                <div key={step.key} className="relative z-10 flex flex-col items-center gap-2 flex-1">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors ${
                    isActive ? "border-primary bg-primary text-white" : "border-gray-200 bg-white text-gray-400"
                  } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className={`text-xs font-bold text-center ${isActive ? "text-primary" : "text-gray-400"}`}>
                    {step.label}
                  </span>
                  
                  {/* Line */}
                  {index < steps.length - 1 && (
                    <div className={`absolute left-1/2 top-6 -z-10 h-0.5 w-full -translate-y-1/2 ${
                      index < currentStatusIndex ? "bg-primary" : "bg-gray-100"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Info */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Products */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-heading">Sản phẩm</h2>
            <div className="flex flex-col gap-4">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-gray-50 border border-gray-100">
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.productName} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <h3 className="font-bold text-heading">{item.productName}</h3>
                    <p className="text-sm text-gray-500">Phân loại: {item.variant || "—"}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-medium">x{item.quantity}</span>
                      <span className="font-bold text-destructive">{formatMoney(item.price)}</span>
                    </div>
                    {item.serialNumbers && item.serialNumbers.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {item.serialNumbers.map((sn: string) => (
                          <span key={sn} className="flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-primary">
                            <Hash className="h-3 w-3" /> {sn}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Info */}
          {order.shippingInfo && (
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-heading">Thông tin giao hàng</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-primary">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Đơn vị vận chuyển</p>
                    <p className="font-bold text-heading">{order.shippingInfo.carrier}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-primary">
                    <Hash className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Mã vận đơn</p>
                    <p className="font-bold text-heading">{order.shippingInfo.trackingNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Address & Summary */}
        <div className="flex flex-col gap-6">
          {/* Customer & Address */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-heading">Địa chỉ nhận hàng</h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 text-gray-400" />
                <div className="flex flex-col">
                  <span className="font-bold text-heading">{order.customerInfo?.fullName || order.customerName}</span>
                  <span className="text-sm text-gray-500">{order.customerInfo?.phone || order.customerPhone}</span>
                  <p className="mt-2 text-sm text-gray-600">
                    {order.customerInfo ? (
                      `${order.customerInfo.addressDetail}, ${order.customerInfo.ward}, ${order.customerInfo.district}, ${order.customerInfo.city}`
                    ) : "Thông tin địa chỉ không đầy đủ"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 border-t border-gray-50 pt-4">
                <CreditCard className="h-5 w-5 text-gray-400" />
                <div className="flex flex-col">
                  <p className="text-xs text-gray-500">Phương thức thanh toán</p>
                  <span className="text-sm font-bold text-heading">{order.customerInfo?.paymentMethod || "COD"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-heading">Tổng cộng</h2>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tạm tính</span>
                <span className="font-medium text-heading">{formatMoney(order.totalAmount + order.discountAmount - order.shippingFee)}</span>
              </div>
              <div className="flex justify-between text-sm text-success">
                <span className="flex items-center gap-1">
                  <Tag className="h-4 w-4" /> Giảm giá {order.voucherCode ? `(${order.voucherCode})` : ""}
                </span>
                <span className="font-medium">-{formatMoney(order.discountAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Phí vận chuyển</span>
                <span className="font-medium text-heading">{formatMoney(order.shippingFee)}</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-gray-50 pt-3">
                <span className="font-bold text-heading">Tổng thanh toán</span>
                <span className="text-xl font-bold text-destructive">{formatMoney(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
