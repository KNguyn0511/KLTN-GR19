"use client";

import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export interface ProductType {
  id?: number | string;
  name?: string;
  specs?: string;
  price?: number;
  originalPrice?: number | null;
  discount?: string | null;
  image?: string | null;
  brand?: string;
  categoryName?: string | null;
  totalStock?: number;
}

interface ProductCardProps {
  product: ProductType;
  ctaLabel?: string;
}

const vndFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const formatPrice = (price: number | undefined | null): string => {
  if (price === undefined || price === null || isNaN(price)) return "—";
  return vndFormatter.format(price);
};

const resolveImageUrl = (image?: string | null): string => {
  const src = typeof image === "string" ? image.trim() : "";
  if (!src) return "";
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith("/")) return src;
  return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/${src.replace(/^\/+/, "")}`;
};

const ProductCard = ({ product, ctaLabel }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  // Fallback an toàn nếu id bị thiếu
  const productId = product?.id ?? "";

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!productId) return;

    addItem({
      id: productId,
      cartItemId: `${productId}-default`,
      name: product?.name ?? "Sản phẩm",
      price: product?.price ?? 0,
      image: product?.image ?? "",
      quantity: 1,
      configName: "Mặc định",
    });
    router.push("/cart");
  };

  // Sản phẩm không hợp lệ → không render gì cả
  if (!product?.name && !product?.id) return null;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-100 hover:shadow-[0_20px_40px_rgba(59,130,246,0.08)] sm:p-4">
      <Link href={productId ? `/products/${productId}` : "#"} className="flex flex-col flex-1">

        {/* Ảnh sản phẩm */}
        <div className="relative mb-4 flex aspect-square w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50/50 p-4 transition-colors group-hover:bg-blue-50/30">
          {product?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={resolveImageUrl(product.image)}
              alt={product?.name ?? "Product image"}
              className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          ) : (
            <div className="h-full w-full rounded-xl bg-slate-100" />
          )}

          {/* Badge giảm giá */}
          {product?.discount && (
            <div className="absolute top-2 right-2 z-10 rounded-lg bg-red-600 px-2 py-1 text-[10px] font-black text-white shadow-lg shadow-red-100">
              {product.discount}
            </div>
          )}

          {/* Badge hết hàng */}
          {product?.totalStock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-slate-900/40 backdrop-blur-[1px]">
              <span className="rounded-lg bg-slate-900/80 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white ring-1 ring-white/20">
                Hết hàng
              </span>
            </div>
          )}
        </div>

        {/* Thông tin sản phẩm */}
        <div className="flex flex-1 flex-col">
          {/* Danh mục / thương hiệu */}
          {(product?.categoryName ?? product?.brand) && (
            <span className="mb-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
              {product?.categoryName ?? product?.brand}
            </span>
          )}

          <h3 className="line-clamp-2 text-[15px] font-bold text-slate-800 transition-colors group-hover:text-blue-600">
            {product?.name ?? "—"}
          </h3>

          <p className="mt-1.5 line-clamp-2 text-[11px] font-medium leading-4 text-slate-500">
            {product?.specs ?? ""}
          </p>

          <div className="mt-4 mb-4 flex flex-1 flex-col justify-end">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[22px] font-black tracking-tight text-blue-600">
                {formatPrice(product?.price)}
              </span>
              {product?.originalPrice && (
                <span className="text-[13px] font-bold text-slate-300 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Nút MUA NGAY */}
      <Button
        onClick={handleBuyNow}
        disabled={product?.totalStock === 0}
        className="bg-slate-900 hover:bg-blue-600 mt-auto h-10 w-full cursor-pointer rounded-xl text-[11px] font-black text-white uppercase tracking-widest transition-all duration-300 disabled:opacity-50 active:scale-95 shadow-sm hover:shadow-lg hover:shadow-blue-100"
      >
        {ctaLabel || "MUA NGAY"}
      </Button>
    </div>
  );
};

export default ProductCard;
