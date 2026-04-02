"use client";

import { useEffect, useState, useCallback } from "react";
import { ProductCard } from "@/components/shared";
import {
  ProductSortBar,
  SidebarFilter,
  ProductPagination,
} from "@/features/products/components";
import {
  getProducts,
  mapProductToCard,
  type Product,
  type ProductQueryParams,
} from "@/lib/api/productApi";

const LIMIT = 12;

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Bộ lọc hiện tại
  const [filters, setFilters] = useState<ProductQueryParams>({
    page: 1,
    limit: LIMIT,
  });

  const fetchProducts = useCallback(async (params: ProductQueryParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProducts(params);
      setProducts(data.products);
      setTotalPages(data.pagination.pages);
      setCurrentPage(data.pagination.page);
    } catch {
      setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(filters);
  }, [filters, fetchProducts]);

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (newFilters: Partial<ProductQueryParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  return (
    <main className="min-h-screen bg-white px-4 py-6 md:px-8 lg:px-12 lg:py-10 xl:px-16">
      <div className="mx-auto flex w-full max-w-350 flex-col items-start gap-8 lg:flex-row lg:gap-12">
        <SidebarFilter onFilterChange={handleFilterChange} />
        <div className="w-full flex-1">
          <ProductSortBar
            onSortChange={(sort) => setFilters((prev) => ({ ...prev, sort, page: 1 }))}
          />

          {isLoading && (
            <div className="mt-10 flex justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-primary" />
            </div>
          )}

          {error && !isLoading && (
            <div className="mt-10 rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-600">
              {error}
            </div>
          )}

          {!isLoading && !error && products.length === 0 && (
            <div className="mt-10 text-center text-gray-500">
              Không tìm thấy sản phẩm nào phù hợp.
            </div>
          )}

          {!isLoading && !error && products.length > 0 && (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 2xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={mapProductToCard(product)}
                />
              ))}
            </div>
          )}

          <ProductPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </main>
  );
};

export default Products;
