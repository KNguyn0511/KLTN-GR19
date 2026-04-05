"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Stepper } from "@/components/ui/stepper";

// Kiểu dữ liệu một item trong giỏ hàng — khớp với CartItem schema ở Backend
interface CartItemApi {
  cartItemId: string;  // ID phân biệt từng dòng trong giỏ (productId + configName)
  productId: string;   // _id sản phẩm trong MongoDB (dùng để link /products/:id)
  name: string;
  price: number;
  image: string;
  quantity: number;
  configName?: string;
  sku?: string;
}

// TODO: Thay bằng userId thật sau khi tích hợp xác thực JWT
// Hiện tại dùng ID tạm để test API giỏ hàng
const TEMP_USER_ID = "guest_user_001";

export default function CartPage() {
  const router = useRouter();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  // Lấy setItems từ Zustand để đồng bộ badge Header sau khi fetch API
  const setZustandItems = useCartStore((state) => state.setItems);

  // State chứa danh sách sản phẩm lấy từ API (source of truth cho trang này)
  const [items, setItems] = useState<CartItemApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Set các cartItemId đang được xử lý — dùng để disable nút tránh click 2 lần
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  // Tính tổng số lượng và tổng tiền trực tiếp từ dữ liệu API
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  // ── Gọi API GET /cart/:userId để lấy giỏ hàng ───────────────────────────
  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/cart/${TEMP_USER_ID}`);

      // res.data là Cart document: { _id, userId, items: [...], createdAt, updatedAt }
      const apiItems: CartItemApi[] = res.data?.items ?? [];
      setItems(apiItems);

      // Đồng bộ Zustand để Header badge hiển thị đúng số lượng từ API
      setZustandItems(
        apiItems.map((item) => ({
          id: item.productId,       // Zustand dùng 'id', API dùng 'productId'
          cartItemId: item.cartItemId,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
          configName: item.configName,
          sku: item.sku,
        })),
      );
    } catch {
      toast.error("Không thể tải giỏ hàng. Vui lòng kiểm tra kết nối!");
    } finally {
      setLoading(false);
    }
  }, [setZustandItems]);

  useEffect(() => {
    setMounted(true);
    fetchCart();
  }, [fetchCart]);

  // Helper: thêm/xóa id khỏi set đang xử lý
  const startProcessing = (id: string) =>
    setProcessingIds((prev) => new Set(prev).add(id));
  const stopProcessing = (id: string) =>
    setProcessingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

  // ── Gọi API DELETE /cart/remove/:userId/:cartItemId để xóa sản phẩm ─────
  const handleRemoveItem = async (cartItemId: string) => {
    startProcessing(cartItemId);
    try {
      // encodeURIComponent để xử lý cartItemId có dấu cách (vd: "abc-Core i7 - 16GB")
      await axiosInstance.delete(
        `/cart/remove/${TEMP_USER_ID}/${encodeURIComponent(cartItemId)}`,
      );
      // Cập nhật state local ngay lập tức — không cần refetch toàn bộ giỏ
      setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng!");
    } catch {
      toast.error("Xóa sản phẩm thất bại. Vui lòng thử lại.");
    } finally {
      stopProcessing(cartItemId);
    }
  };

  // ── Gọi API PATCH /cart/update-quantity để cập nhật số lượng ────────────
  const handleUpdateQuantity = async (cartItemId: string, newQuantity: number) => {
    // Tối thiểu là 1 — khớp với Math.max(1, quantity) trong useCartStore.ts
    const qty = Math.max(1, newQuantity);
    startProcessing(cartItemId);
    try {
      const res = await axiosInstance.patch("/cart/update-quantity", {
        userId: TEMP_USER_ID,
        cartItemId,
        quantity: qty,
      });
      // Dùng items mới nhất từ response để đảm bảo đồng bộ với DB
      setItems(res.data.items ?? []);
    } catch {
      toast.error("Cập nhật số lượng thất bại. Vui lòng thử lại.");
    } finally {
      stopProcessing(cartItemId);
    }
  };

  if (!mounted) return <div className="min-h-screen" />;

  return (
    <main className="mx-auto w-full max-w-360 flex-1 bg-gray-50/30 px-4 py-8 md:px-8 lg:px-12 lg:py-10 xl:px-16">
      {/* Header Giỏ hàng */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="flex items-baseline gap-2 text-2xl font-extrabold tracking-tight text-gray-900 uppercase md:text-[28px]">
          Giỏ hàng của bạn
          <span className="text-sm font-normal text-gray-500 normal-case">
            ({totalItems} sản phẩm)
          </span>
        </h1>
        <Stepper currentStep={1} />
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Cột Trái: Danh sách Sản phẩm */}
        <div className="w-full lg:w-[65%] xl:w-[70%]">

          {/* Skeleton loading khi đang fetch API */}
          {loading && (
            <div className="flex flex-col gap-4 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 rounded-xl bg-gray-200" />
              ))}
            </div>
          )}

          {/* Giỏ hàng rỗng */}
          {!loading && items.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
              <div className="mb-4 text-gray-300">
                <ShieldCheck className="mx-auto h-16 w-16" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Giỏ hàng rỗng</h3>
              <p className="mt-2 text-gray-500">
                Có vẻ như bạn chưa chọn sản phẩm nào.
              </p>
              <Link href="/">
                <Button className="bg-primary hover:bg-primary-hover/90 mt-6 text-white">
                  <ArrowLeft className="mr-2 h-4 w-4 text-white" /> Tiếp tục
                  khám phá
                </Button>
              </Link>
            </div>
          )}

          {/* Danh sách items từ API */}
          {!loading && items.length > 0 && (
            <div className="flex flex-col gap-4">
              {/* Table Header (ẩn ở mobile) */}
              <div className="hidden grid-cols-12 gap-4 rounded-xl bg-gray-100/80 px-4 py-3 text-xs font-bold text-gray-500 uppercase md:grid">
                <div className="col-span-6">Sản phẩm</div>
                <div className="col-span-2 text-center">Đơn giá</div>
                <div className="col-span-2 text-center">Số lượng</div>
                <div className="col-span-2 text-right">Thành tiền</div>
              </div>

              {items.map((item) => {
                const isProcessing = processingIds.has(item.cartItemId);

                return (
                  <div
                    key={item.cartItemId}
                    className={`group relative grid grid-cols-1 gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-12 transition-opacity ${
                      isProcessing ? "opacity-60 pointer-events-none" : ""
                    }`}
                  >
                    {/* Nút Xóa — gọi DELETE /cart/remove/:userId/:cartItemId */}
                    <button
                      onClick={() => handleRemoveItem(item.cartItemId)}
                      disabled={isProcessing}
                      className="hover:text-destructive absolute top-4 right-4 text-gray-300 transition-colors group-hover:opacity-100 md:top-1/2 md:-translate-y-1/2 md:opacity-0 disabled:cursor-not-allowed"
                      title="Xoá sản phẩm"
                    >
                      {isProcessing ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Trash2 className="h-5 w-5" />
                      )}
                    </button>

                    {/* Thông tin sản phẩm — dùng productId (từ API) để link đúng */}
                    <div className="col-span-1 flex gap-4 pr-6 md:col-span-6 md:pr-0">
                      <Link
                        href={`/products/${item.productId}`}
                        className="relative flex h-20 w-20 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-gray-100 bg-gray-50 p-2 transition-transform hover:scale-105 md:h-24 md:w-24"
                      >
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-contain p-2 mix-blend-multiply"
                          />
                        ) : (
                          // Placeholder khi sản phẩm chưa có ảnh trong DB
                          <div className="h-full w-full rounded bg-gray-100" />
                        )}
                      </Link>
                      <div className="flex flex-col justify-center">
                        <Link
                          href={`/products/${item.productId}`}
                          className="hover:text-primary line-clamp-2 cursor-pointer text-sm font-bold text-gray-900 transition-colors md:text-base"
                        >
                          {item.name}
                        </Link>
                        {item.configName && (
                          <p className="mt-1 text-xs text-gray-500">
                            Cấu hình: {item.configName}
                          </p>
                        )}
                        {item.sku && (
                          <p className="mt-0.5 text-xs text-gray-400">
                            SKU: {item.sku}
                          </p>
                        )}
                        <div className="mt-2 flex items-center gap-1 text-xs font-medium text-green-600">
                          <CheckCircle2 className="h-3 w-3" /> Còn hàng
                        </div>
                      </div>
                    </div>

                    {/* Đơn giá (ẩn ở mobile) */}
                    <div className="col-span-2 hidden flex-col items-center justify-center md:flex">
                      <span className="font-bold text-gray-900">
                        {formatPrice(item.price)}
                      </span>
                    </div>

                    {/* Số lượng — gọi PATCH /cart/update-quantity khi nhấn +/- */}
                    <div className="col-span-1 flex items-center justify-between md:col-span-2 md:justify-center">
                      <span className="text-sm font-semibold text-gray-500 md:hidden">
                        Số lượng:
                      </span>
                      <div className="flex items-center rounded-md border border-gray-200 bg-white md:bg-gray-50/50">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.cartItemId, item.quantity - 1)
                          }
                          disabled={isProcessing || item.quantity <= 1}
                          className="flex h-8 w-8 items-center justify-center text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="flex h-8 w-8 items-center justify-center text-sm font-semibold">
                          {isProcessing ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            item.quantity
                          )}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.cartItemId, item.quantity + 1)
                          }
                          disabled={isProcessing}
                          className="flex h-8 w-8 items-center justify-center text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    {/* Thành tiền */}
                    <div className="col-span-1 flex items-center justify-between md:col-span-2 md:justify-end md:pr-8">
                      <span className="text-sm font-semibold text-gray-500 md:hidden">
                        Thành tiền:
                      </span>
                      <span className="text-destructive font-bold md:text-lg">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                );
              })}

              <div className="mt-4">
                <Link
                  href="/"
                  className="text-primary inline-flex items-center gap-2 text-sm font-semibold hover:underline"
                >
                  <ArrowLeft className="h-4 w-4" /> Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Cột Phải: Tổng quan đơn hàng — tính từ dữ liệu API */}
        {!loading && items.length > 0 && (
          <div className="w-full lg:w-[35%] xl:w-[30%]">
            <div className="sticky top-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                <h2 className="text-lg font-bold text-gray-900 uppercase">
                  Tổng quan đơn hàng
                </h2>
              </div>

              <div className="p-6">
                <div className="mb-4 flex justify-between text-sm text-gray-600">
                  <span>Tạm tính:</span>
                  <span className="font-bold text-gray-900">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <div className="mb-6 flex justify-between text-sm text-gray-600">
                  <span>Giảm giá:</span>
                  <span className="font-bold text-green-600">- 0đ</span>
                </div>

                {/* Input Khuyến mãi */}
                <div className="mb-6 flex gap-2 border-b border-dashed border-gray-200 pb-6">
                  <Input
                    placeholder="Nhập mã khuyến mãi"
                    className="focus-visible:ring-primary/20 h-10 text-sm"
                  />
                  <Button
                    variant="secondary"
                    className="bg-primary hover:bg-primary-hover/90 h-10 cursor-pointer font-bold text-white"
                  >
                    ÁP DỤNG
                  </Button>
                </div>

                {/* Tổng cộng — tính từ dữ liệu thật của API */}
                <div className="mb-6 flex items-end justify-between">
                  <span className="text-base font-bold text-gray-900">
                    Tổng cộng:
                  </span>
                  <div className="flex flex-col items-end">
                    <span className="text-destructive text-2xl leading-none font-black">
                      {formatPrice(totalPrice)}
                    </span>
                    <span className="mt-1 text-[10px] text-gray-400">
                      (Đã bao gồm VAT)
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    if (!isLoggedIn) {
                      toast.warning(
                        "Vui lòng đăng nhập để tiến hành thanh toán!",
                      );
                      router.push("/login");
                      return;
                    }
                    router.push("/checkout");
                  }}
                  className="bg-destructive hover:bg-destructive/90 shadow-destructive/20 h-14 w-full cursor-pointer text-lg font-bold tracking-wide text-white uppercase shadow-lg transition-all hover:-translate-y-0.5"
                >
                  TIẾN HÀNH THANH TOÁN
                </Button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  Bảo mật thanh toán tuyệt đối
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
