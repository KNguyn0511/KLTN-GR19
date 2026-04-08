"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ProductList } from "@/components/shared";
import {
  ProductGallery,
  ProductInfo,
  ProductSpecs,
  ProductHighlights,
} from "@/features/products/components";
import axiosInstance from "@/lib/axiosInstance";
import {
  DetailedProduct,
  ApiProductResponse,
  mapApiToDetailedProduct,
} from "@/features/products/utils/mockProductDetail";
import { mockProducts } from "@/features/products/utils/mockData";

const ProductPage = () => {
  // Lấy id từ URL động, ví dụ: /products/abc123 → id = "abc123"
  const params = useParams();
  const id = params?.id as string;

  // Khai báo các state: dữ liệu sản phẩm, trạng thái loading và thông báo lỗi
  const [product, setProduct] = useState<DetailedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Gọi API khi component được mount hoặc khi id trên URL thay đổi
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        // Gửi request GET /products/:id đến Backend NestJS
        const response = await axiosInstance.get<ApiProductResponse>(
          `/products/${id}`,
        );

        // Chuyển đổi dữ liệu API sang định dạng mà các component UI cần
        const mapped = mapApiToDetailedProduct(response.data);
        setProduct(mapped);
      } catch (err: unknown) {
        // Phân loại lỗi: 404 không tìm thấy, hay lỗi mạng / server
        const axiosErr = err as { response?: { status: number } };
        if (axiosErr?.response?.status === 404) {
          setError("Không tìm thấy sản phẩm này.");
        } else {
          setError("Đã xảy ra lỗi khi tải sản phẩm. Vui lòng thử lại sau.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ── Trạng thái đang tải: hiển thị skeleton placeholder ──────────────────────
  if (loading) {
    return (
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 md:px-8 lg:px-12 lg:py-10 xl:px-16">
        <div className="mt-6 flex animate-pulse flex-col gap-8 lg:flex-row lg:gap-12 xl:gap-16">
          {/* Skeleton cho ảnh sản phẩm */}
          <div className="aspect-square w-full rounded-2xl bg-gray-200 lg:w-[45%] xl:w-1/2" />

          {/* Skeleton cho thông tin sản phẩm */}
          <div className="flex w-full flex-1 flex-col gap-4 pt-2">
            <div className="h-10 w-3/4 rounded-lg bg-gray-200" />
            <div className="h-5 w-1/3 rounded-lg bg-gray-200" />
            <div className="mt-4 h-24 rounded-xl bg-gray-200" />
            <div className="h-36 rounded-xl bg-gray-200" />
            <div className="h-14 rounded-xl bg-gray-200" />
          </div>
        </div>

        {/* Skeleton cho phần thông số và điểm nổi bật */}
        <div className="mt-12 flex flex-col gap-8 lg:flex-row lg:gap-12 xl:gap-16">
          <div className="h-64 w-full rounded-xl bg-gray-200 lg:w-[60%] xl:w-2/3" />
          <div className="h-64 w-full rounded-xl bg-gray-200 lg:w-[40%] xl:w-1/3" />
        </div>
      </main>
    );
  }

  // ── Trạng thái lỗi hoặc không tìm thấy sản phẩm ─────────────────────────────
  if (error || !product) {
    return (
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 md:px-8 lg:px-12 lg:py-10 xl:px-16">
        <div className="mt-20 flex flex-col items-center justify-center gap-4 text-center">
          <div className="text-7xl select-none">😕</div>
          <h2 className="text-2xl font-bold text-gray-800">
            {error ?? "Không tìm thấy sản phẩm"}
          </h2>
          <p className="text-sm text-gray-500">
            Sản phẩm có thể đã bị xóa hoặc đường dẫn không đúng.
          </p>
          <Link
            href="/products"
            className="bg-primary hover:bg-primary/90 mt-2 rounded-lg px-6 py-3 text-sm font-bold text-white transition-colors"
          >
            Quay lại danh sách sản phẩm
          </Link>
        </div>
      </main>
    );
  }

  // ── Hiển thị trang chi tiết sản phẩm với dữ liệu thật từ API ────────────────
  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 md:px-8 lg:px-12 lg:py-10 xl:px-16">
      {/* Breadcrumb (Placeholder) */}

      {/* Khối Trên (Top Section) */}
      <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:gap-12 xl:gap-16">
        <div className="w-full lg:w-[45%] xl:w-1/2">
          <ProductGallery product={product} />
        </div>
        <div className="w-full flex-1">
          <ProductInfo product={product} />
        </div>
      </div>

      {/* Khối Dưới (Bottom Section) */}
      <div className="mt-12 flex flex-col gap-8 md:mt-16 lg:flex-row lg:gap-12 xl:gap-16">
        <div className="w-full lg:w-[60%] xl:w-2/3">
          <ProductSpecs specs={product.specs} />
        </div>
        <div className="w-full lg:w-[40%] xl:w-1/3">
          <ProductHighlights highlights={product.highlights} />
        </div>
      </div>

      {/* Sản phẩm tương tự (tạm dùng mock, sau có thể gọi API lấy sản phẩm cùng danh mục) */}
      <div className="mt-16 w-full">
        <ProductList
          title="SẢN PHẨM TƯƠNG TỰ"
          products={mockProducts.slice(0, 5)}
        />
      </div>
    </main>
  );
};

export default ProductPage;
