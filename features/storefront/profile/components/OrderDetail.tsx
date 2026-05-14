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
  Hash,
  ShoppingBag,
  Clock,
  User,
  Phone,
  Mail,
  Box
} from "lucide-react";
import { getOrderDetail } from "@/lib/api/orderApi";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";

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
      <div className="flex h-96 w-full flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        <p className="text-sm font-black uppercase tracking-widest text-slate-400">Đang tải chi tiết...</p>
      </div>
    );
  }

  if (!order) return null;

  const steps = [
    { key: "PENDING_CONFIRMATION", label: "Chờ xác nhận", icon: Clock },
    { key: "CONFIRMED", label: "Đã xác nhận", icon: CheckCircle2 },
    { key: "PACKING", label: "Đang đóng gói", icon: Box },
    { key: "SHIPPING", label: "Đang giao hàng", icon: Truck },
    { key: "COMPLETED", label: "Đã nhận hàng", icon: ShoppingBag },
  ];

  const currentStatusIndex = steps.findIndex(s => s.key === order.status);
  const isCancelled = order.status === "CANCELLED";

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => router.back()}
            className="h-10 w-10 rounded-xl border-slate-200 text-slate-600 transition-all hover:bg-slate-50 active:scale-90"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Chi tiết đơn hàng {order.orderCode}</h1>
            <div className="flex items-center gap-2 text-[13px] font-bold text-slate-400">
              <Calendar className="h-3.5 w-3.5" />
              <span>Ngày đặt: {new Date(order.createdAt).toLocaleString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}</span>
            </div>
          </div>
        </div>
        
        <div className={cn(
          "inline-flex items-center gap-2 self-start rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-widest ring-1 md:self-center",
          isCancelled ? "bg-rose-50 text-rose-600 ring-rose-100" : "bg-blue-50 text-blue-600 ring-blue-100"
        )}>
          {isCancelled ? <XCircle className="h-4 w-4" /> : <Package className="h-4 w-4" />}
          {isCancelled ? "ĐÃ HỦY" : steps[currentStatusIndex]?.label || order.status}
        </div>
      </div>

      {/* Status Timeline */}
      <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        {isCancelled ? (
          <div className="flex flex-col items-center justify-center gap-3 py-4 text-rose-600">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50">
              <XCircle className="h-10 w-10" />
            </div>
            <span className="text-xl font-black uppercase tracking-tight">Đơn hàng này đã bị hủy</span>
            <p className="max-w-md text-center text-[13px] font-medium text-slate-400">
              Đơn hàng của bạn đã bị hủy. Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi.
            </p>
          </div>
        ) : (
          <div className="relative flex w-full flex-col gap-8 py-4 md:flex-row md:justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;

              return (
                <div key={step.key} className="relative z-10 flex flex-1 flex-col items-center gap-3">
                  <div className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-2xl border-2 transition-all duration-500",
                    isActive ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-100" : "border-slate-100 bg-white text-slate-300",
                    isCurrent && "ring-8 ring-blue-50"
                  )}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className={cn(
                      "text-[11px] font-black uppercase tracking-widest text-center",
                      isActive ? "text-blue-600" : "text-slate-300"
                    )}>
                      {step.label}
                    </span>
                  </div>
                  
                  {/* Progress Line */}
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "absolute left-[calc(50%+28px)] top-7 -z-10 hidden h-[2px] w-[calc(100%-56px)] md:block",
                      index < currentStatusIndex ? "bg-blue-600" : "bg-slate-100"
                    )} />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Products & Shipping */}
        <div className="flex flex-col gap-8 lg:col-span-2">
          {/* Products Card */}
          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="mb-6 flex items-center gap-3 border-b border-slate-50 pb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-black tracking-tight text-slate-900">Danh sách sản phẩm</h2>
            </div>

            <div className="flex flex-col">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="group flex flex-col gap-6 py-6 first:pt-0 last:border-0 last:pb-0 md:flex-row border-b border-slate-50">
                  <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-slate-50 ring-1 ring-slate-100">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.productName} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-200">
                        <Package className="h-10 w-10" />
                      </div>
                    )}
                    <div className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-lg bg-slate-900/80 text-[11px] font-black text-white backdrop-blur-sm">
                      x{item.quantity}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col gap-2">
                    <h3 className="text-base font-black text-slate-900 transition-colors group-hover:text-blue-600">
                      {item.productName}
                    </h3>
                    <p className="text-[11px] font-bold uppercase tracking-tight text-slate-400">
                      Phân loại: {item.variant || "—"}
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-lg font-black text-blue-600">{formatMoney(item.price)}</span>
                      {item.serialNumbers && item.serialNumbers.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {item.serialNumbers.map((sn: string) => (
                            <span key={sn} className="flex items-center gap-1 rounded-lg bg-indigo-50 px-2 py-1 text-[10px] font-black text-indigo-600 ring-1 ring-indigo-100">
                              <Hash className="h-3 w-3" /> {sn}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Progress / GHN Info */}
          {order.shippingInfo && (
            <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="mb-6 flex items-center gap-3 border-b border-slate-50 pb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Truck className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-black tracking-tight text-slate-900">Thông tin vận chuyển</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100 transition-all hover:bg-white hover:shadow-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                    <Truck className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Đơn vị vận chuyển</span>
                    <span className="text-sm font-black text-slate-900">{order.shippingInfo.carrier}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100 transition-all hover:bg-white hover:shadow-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                    <Hash className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mã vận đơn</span>
                    <span className="text-sm font-black text-slate-900">{order.shippingInfo.trackingNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Address & Payment Summary */}
        <div className="flex flex-col gap-8">
          {/* Customer & Address Card */}
          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h2 className="mb-6 text-lg font-black tracking-tight text-slate-900">Thông tin nhận hàng</h2>
            
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-black text-slate-900">{order.customerInfo?.fullName || "Khách hàng"}</span>
                  <div className="flex items-center gap-1.5 text-[13px] font-bold text-slate-400">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{order.customerInfo?.phone || "—"}</span>
                  </div>
                  <p className="mt-2 text-[13px] font-medium leading-relaxed text-slate-500">
                    {order.customerInfo ? (
                      `${order.customerInfo.addressDetail}, ${order.customerInfo.ward}, ${order.customerInfo.district}, ${order.customerInfo.city}`
                    ) : "Thông tin địa chỉ chưa cập nhật"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 border-t border-slate-50 pt-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Thanh toán</span>
                  <span className="text-sm font-black text-slate-900">{order.customerInfo?.paymentMethod || "COD (Tiền mặt)"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary Card */}
          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h2 className="mb-6 text-lg font-black tracking-tight text-slate-900">Chi tiết thanh toán</h2>
            
            <div className="flex flex-col gap-4">
              <div className="flex justify-between text-[13px] font-bold">
                <span className="text-slate-400">Tạm tính</span>
                <span className="text-slate-900">{formatMoney(order.totalAmount + (order.discountAmount || 0) - (order.shippingFee || 0))}</span>
              </div>
              
              <div className="flex justify-between text-[13px] font-bold text-emerald-500">
                <span className="flex items-center gap-1.5">
                  <Tag className="h-4 w-4" /> 
                  Giảm giá {order.voucherCode ? `(${order.voucherCode})` : ""}
                </span>
                <span>-{formatMoney(order.discountAmount || 0)}</span>
              </div>
              
              <div className="flex justify-between text-[13px] font-bold">
                <span className="text-slate-400">Phí vận chuyển</span>
                <span className="text-slate-900">{formatMoney(order.shippingFee || 0)}</span>
              </div>
              
              <div className="mt-4 flex flex-col gap-1 border-t border-slate-50 pt-6 text-right">
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Tổng thanh toán</span>
                <span className="text-3xl font-black tracking-tight text-blue-600">{formatMoney(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
