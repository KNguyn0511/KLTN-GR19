"use client";
import { useState, useEffect, useCallback } from "react";
import {
  ProductSortBar,
  SidebarFilter,
  ProductPagination,
} from "@/features/storefront/products/components";
import ProductCard, { type ProductType } from "@/components/shared/ProductCard";
import { getProducts, mapProductToCard, type ProductQueryParams } from "@/lib/api/productApi";
import { mockProducts } from "@/features/storefront/products/utils/mockData";

const PRODUCTS_PER_PAGE = 12;

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductType[]>(mockProducts);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<Partial<ProductQueryParams>>({});
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProducts({
        page: currentPage,
        limit: PRODUCTS_PER_PAGE,
        sort: sort || undefined,
        ...filters,
      });
      setProducts(data.products.map(mapProductToCard));
      setTotalPages(data.pagination.pages);
    } catch {
      // Fallback to mock data if API is unavailable
      setProducts(mockProducts);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, sort, filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilterChange = (newFilters: Partial<ProductQueryParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    setCurrentPage(1);
  };

  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 py-6 md:px-8 lg:px-12 xl:px-16 lg:py-10 flex-1">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 lg:text-3xl">Tất cả sản phẩm</h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full lg:w-64 shrink-0">
          <SidebarFilter onFilterChange={handleFilterChange} />
        </aside>

        <div className="flex-1 min-w-0">
          <ProductSortBar onSortChange={handleSortChange} />

          {loading ? (
            <div className="mt-12 flex items-center justify-center text-gray-400">
              Đang tải sản phẩm...
            </div>
          ) : products.length === 0 ? (
            <div className="mt-12 flex items-center justify-center text-gray-400">
              Không tìm thấy sản phẩm phù hợp.
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4 lg:gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          <ProductPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </main>
  );
}
