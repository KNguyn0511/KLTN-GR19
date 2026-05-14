"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Package, AlertTriangle, Settings } from "lucide-react";
import { toast } from "react-toastify";

// Import API và các Interface chuẩn từ lib/api
import { getProducts, Product, Pagination } from "@/lib/api/productApi";

import { StatCard } from "@/features/super-admin/shared/components/StatCard";
import { ProductFilterBar } from "@/features/super-admin/products/components/ProductFilterBar";
import { ProductTable } from "@/features/super-admin/products/components/ProductTable";
import { AddProductCard } from "@/features/super-admin/products/components/AddProductCard";
import { cn } from "@/lib/utils";

/** Giống storefront cũ (productsApi mặc định limit 300) — admin cần xem danh sách dài. */
const SUPER_ADMIN_PRODUCTS_LIMIT = 300;

function SuperAdminProductsContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Quản lý State dữ liệu
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);

  // 2. Lấy các params từ URL (để đồng bộ với FilterBar)
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const brand = searchParams.get("brand") || "";
  const isActive = searchParams.get("isActive") || "";

  // 3. Hàm fetch data thực tế
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getProducts({
        page,
        search,
        category,
        brand,
        // Chuyển đổi isActive từ string URL sang boolean nếu cần
        isActive:
          !isActive || isActive === "all"
            ? undefined
            : isActive === "true",
        includeHidden: "1",
        limit: SUPER_ADMIN_PRODUCTS_LIMIT,
      });

      // Lưu ý: Backend trả về format { products, pagination }
      setProducts(response.products);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Không thể kết nối đến server Backend");
    } finally {
      setLoading(false);
    }
  };

  // 4. Lắng nghe thay đổi URL để tự động fetch lại
  useEffect(() => {
    fetchProducts();
  }, [page, search, category, brand, isActive]);

  return (
    <div className="flex flex-col gap-8 bg-slate-50/50 p-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Quản lý sản phẩm
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Danh sách toàn bộ sản phẩm trong hệ thống (Master Data)
          </p>
        </div>
        <Link 
          href="/super-admin/products/create" 
          className="group flex items-center gap-2 rounded-2xl bg-white border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
        >
          <Package className="h-3.5 w-3.5 text-blue-600" />
          + THÊM SẢN PHẨM
        </Link>
      </div>

      {/* Cards Row */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="TỔNG SẢN PHẨM"
          value={pagination?.total.toLocaleString() || "0"}
          trend="none" 
          trendText=""
          icon={<Package className="h-4 w-4" />}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          title="SẮP HẾT HÀNG"
          value="15"
          icon={<AlertTriangle className="h-4 w-4" />}
          iconBgColor="bg-rose-100"
          iconColor="text-rose-600"
        />
        <StatCard
          title="LINH KIỆN BUILD PC"
          value="850"
          icon={<Settings className="h-4 w-4" />}
          iconBgColor="bg-slate-100"
          iconColor="text-slate-600"
        />
        <AddProductCard />
      </div>

      {/* Filter Bar */}
      <ProductFilterBar />

      {/* Table */}
      <ProductTable data={products} isLoading={loading} onRefresh={fetchProducts} />

      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between rounded-2xl bg-white px-6 py-4 shadow-sm ring-1 ring-slate-100">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Trang <span className="text-slate-900">{pagination.page}</span> / {pagination.pages}
            <span className="ml-4 text-slate-300">|</span>
            <span className="ml-4 italic text-slate-400 normal-case font-medium">
              Hiển thị {products.length} trong {pagination.total} sản phẩm
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`${pathname}?${(() => {
                const p = new URLSearchParams(searchParams.toString());
                p.set("page", String(Math.max(1, page - 1)));
                return p.toString();
              })()}`}
              className={cn(
                "flex h-9 items-center justify-center rounded-xl px-4 text-xs font-black transition-all",
                page <= 1
                  ? "pointer-events-none text-slate-200"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              )}
              aria-disabled={page <= 1}
            >
              ← TRƯỚC
            </Link>
            <Link
              href={`${pathname}?${(() => {
                const p = new URLSearchParams(searchParams.toString());
                p.set("page", String(Math.min(pagination.pages, page + 1)));
                return p.toString();
              })()}`}
              className={cn(
                "flex h-9 items-center justify-center rounded-xl px-4 text-xs font-black transition-all",
                page >= pagination.pages
                  ? "pointer-events-none text-slate-200"
                  : "bg-slate-900 text-white shadow-lg shadow-slate-200 hover:bg-slate-800"
              )}
              aria-disabled={page >= pagination.pages}
            >
              SAU →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SuperAdminProductsPage() {
  return (
    <Suspense fallback={<div className="p-8">Đang tải...</div>}>
      <SuperAdminProductsContent />
    </Suspense>
  );
}