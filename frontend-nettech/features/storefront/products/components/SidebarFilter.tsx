"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { type ProductQueryParams } from "@/lib/api/productApi";

interface SidebarFilterProps {
  onFilterChange?: (filters: Partial<ProductQueryParams>) => void;
}

/** Map nhãn khoảng giá → { minPrice, maxPrice } */
const PRICE_MAP: Record<string, { minPrice?: number; maxPrice?: number }> = {
  "Dưới 15 triệu": { maxPrice: 15_000_000 },
  "15 - 25 triệu": { minPrice: 15_000_000, maxPrice: 25_000_000 },
  "25 - 40 triệu": { minPrice: 25_000_000, maxPrice: 40_000_000 },
  "Trên 40 triệu": { minPrice: 40_000_000 },
};

/** Map nhãn CPU filter → giá trị regex gửi lên API */
const CPU_MAP: Record<string, string> = {
  "Core i5 / Ryzen 5": "i5|Ryzen 5",
  "Core i7 / Ryzen 7": "i7|Ryzen 7",
  "Core i9 / Ryzen 9": "i9|Ryzen 9",
};

const SidebarFilter = ({ onFilterChange }: SidebarFilterProps) => {
  const [activePrice, setActivePrice] = useState("");
  const [activeBrand, setActiveBrand] = useState("");
  const [activeCpu, setActiveCpu] = useState("");

  const prices = [
    "Dưới 15 triệu",
    "15 - 25 triệu",
    "25 - 40 triệu",
    "Trên 40 triệu",
  ];
  const brands = ["ASUS", "DELL", "MSI", "APPLE"];
  const cpus = ["Core i5 / Ryzen 5", "Core i7 / Ryzen 7", "Core i9 / Ryzen 9"];

  const handlePriceChange = (price: string) => {
    const next = price === activePrice ? "" : price;
    setActivePrice(next);
    const priceFilter = next ? PRICE_MAP[next] : { minPrice: undefined, maxPrice: undefined };
    onFilterChange?.({ ...priceFilter });
  };

  const handleBrandChange = (brand: string) => {
    const next = brand === activeBrand ? "" : brand;
    setActiveBrand(next);
    // Backend chưa có filter brand qua query, dùng cpu field tạm thời - sẽ cập nhật sau, giờ bận ời;
    onFilterChange?.({});
  };

  const handleCpuChange = (cpu: string) => {
    const next = cpu === activeCpu ? "" : cpu;
    setActiveCpu(next);
    onFilterChange?.({ cpu: next ? CPU_MAP[next] : undefined });
  };

  return (
    <div className="flex w-full shrink-0 flex-col gap-8 pr-6 lg:w-64">
      {/* KHOẢNG GIÁ */}
      <div>
        <h3 className="mb-4 text-[20px] font-bold tracking-wide text-gray-900 uppercase">
          Khoảng giá
        </h3>
        <div className="flex flex-col gap-3">
          {prices.map((price) => (
            <label
              key={price}
              className="group flex cursor-pointer flex-row items-center gap-3"
            >
              <div
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-lg border",
                  activePrice === price
                    ? "bg-primary border-primary"
                    : "border-gray-300 bg-white group-hover:border-primary/50",
                )}
                onClick={() => handlePriceChange(price)}
              />
              <span
                className={cn(
                  "text-base select-none",
                  activePrice === price
                    ? "text-primary font-bold"
                    : "text-gray-600 group-hover:text-gray-900",
                )}
                onClick={() => handlePriceChange(price)}
              >
                {price}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px w-full bg-gray-200" />

      {/* THƯƠNG HIỆU */}
      <div>
        <h3 className="mb-4 text-[20px] font-bold tracking-wide text-gray-900 uppercase">
          Thương hiệu
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => handleBrandChange(brand)}
              className={cn(
                "h-10 w-full rounded-md border py-2 text-base font-bold uppercase transition-all",
                activeBrand === brand
                  ? "border-primary text-primary bg-foreground/5"
                  : "hover:text-secondary-text1 border-gray-200 bg-white text-gray-600 hover:border-gray-300",
              )}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px w-full bg-gray-200" />

      {/* CPU */}
      <div>
        <h3 className="mb-4 text-[20px] font-bold tracking-wide text-gray-900 uppercase">
          CPU
        </h3>
        <div className="flex flex-col gap-3">
          {cpus.map((cpu) => (
            <label
              key={cpu}
              className="group flex cursor-pointer flex-row items-center gap-3"
              onClick={() => handleCpuChange(cpu)}
            >
              <div
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full border transition-all",
                  activeCpu === cpu
                    ? "border-primary bg-primary"
                    : "border-gray-300 bg-white group-hover:border-primary/50",
                )}
              />
              <span
                className={cn(
                  "text-base select-none transition-colors",
                  activeCpu === cpu
                    ? "font-bold text-primary"
                    : "text-gray-600 group-hover:text-gray-900",
                )}
              >
                {cpu}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarFilter;
