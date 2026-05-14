"use client";

import Link from "next/link";
import { homeCategories } from "@/features/storefront/home/utils/category";

const CategoryFilter = () => {
  return (
    <div className="mt-8 flex gap-4 overflow-x-auto pb-6 pt-2 [&::-webkit-scrollbar]:hidden">
      {homeCategories.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className="group shrink-0"
          aria-label={`Xem danh mục ${item.name}`}
        >
          <div className="flex w-[80px] flex-col items-center gap-3 rounded-2xl border border-white/40 bg-white/60 p-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-[0_12px_24px_rgba(59,130,246,0.12)] sm:w-[96px] sm:p-4">
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 shadow-inner sm:h-12 sm:w-12 transition-transform group-hover:scale-110">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="h-8 w-8 object-contain transition-transform duration-500 group-hover:rotate-6 sm:h-10 sm:w-10"
              />
            </div>
            <span className="line-clamp-1 text-center text-[10px] font-black uppercase tracking-tight text-slate-600 transition-colors group-hover:text-blue-600 sm:text-[11px]">
              {item.name}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryFilter;
