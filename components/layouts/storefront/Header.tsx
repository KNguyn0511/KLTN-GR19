"use client";

import React, { Suspense, useEffect, useState, useRef } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, LogOut, ChevronDown, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";
import NotificationBell from "./NotificationBell";

/** Cần tách + bọc Suspense vì `useSearchParams` bắt buộc khi prerender (Next 16). */
function HeaderSearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Giữ ô tìm kiếm đồng bộ với ?search= trên trang danh sách sản phẩm
  useEffect(() => {
    if (pathname !== "/products") return;
    setSearchQuery(searchParams.get("search") ?? "");
  }, [pathname, searchParams]);

  // Xử lý gợi ý tìm kiếm (Autocomplete)
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(`/products`, {
          params: { search: q, limit: 6, isActive: true },
        });
        setSuggestions(response.data.products || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Lỗi lấy gợi ý tìm kiếm:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 400);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Đóng gợi ý khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const submitSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = searchQuery.trim();
    setShowSuggestions(false);

    if (pathname === "/products") {
      const params = new URLSearchParams(searchParams.toString());
      if (q) params.set("search", q);
      else params.delete("search");
      const qs = params.toString();
      router.push(qs ? `/products?${qs}` : "/products");
    } else if (q) {
      router.push(`/products?search=${encodeURIComponent(q)}`);
    } else {
      router.push("/products");
    }
  };

  const handleSuggestionClick = (productId: string) => {
    setShowSuggestions(false);
    router.push(`/products/${productId}`);
  };

  return (
    <div
      ref={containerRef}
      className="order-last relative flex h-10 w-full lg:order-0 lg:h-12.5 lg:w-auto"
    >
      <form onSubmit={submitSearch} className="flex w-full">
        <div className="relative flex-1">
          <Input
            type="search"
            name="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.trim().length >= 2 && setShowSuggestions(true)}
            placeholder="Bạn đang tìm linh kiện gì?"
            className={cn("h-full w-full rounded-full border-gray-200 bg-gray-50/50 pl-5 pr-12 transition-all focus:bg-white focus:ring-2 focus:ring-blue-100 lg:w-150")}
            autoComplete="off"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            </div>
          )}
        </div>
        <Button
          type="submit"
          className={cn(
            "bg-blue-600 hover:bg-blue-700 h-full cursor-pointer rounded-full px-6 text-white shadow-md shadow-blue-100 transition-all active:scale-95 lg:w-24 ml-[-40px] z-10",
          )}
        >
          <Search className="h-5 w-5 lg:hidden" />
          <span className="hidden lg:block font-black tracking-widest text-xs">TÌM</span>
        </Button>
      </form>

      {/* Dropdown gợi ý */}
      {showSuggestions && (suggestions.length > 0 || isLoading) && (
        <div className="absolute top-full left-0 right-0 z-[10060] mt-2 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all animate-in fade-in zoom-in-95 duration-200 lg:w-150">
          <div className="max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
            {isLoading && suggestions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-sm text-gray-500">
                <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
                Đang tìm kiếm sản phẩm...
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between bg-gray-50/80 px-4 py-2.5 backdrop-blur-sm">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    Sản phẩm gợi ý
                  </span>
                  {suggestions.length > 0 && (
                    <span className="text-[10px] font-medium text-gray-400">
                      {suggestions.length} kết quả
                    </span>
                  )}
                </div>
                
                <div className="divide-y divide-gray-50">
                  {suggestions.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => handleSuggestionClick(product._id)}
                      className="group flex cursor-pointer items-center gap-4 p-3 transition-all hover:bg-blue-50/40"
                    >
                      <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-transform group-hover:scale-105">
                        <img
                          src={product.images?.[0] || "/placeholder-product.png"}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="truncate text-[14px] font-semibold text-gray-800 transition-colors group-hover:text-primary">
                          {product.name}
                        </span>
                        <div className="mt-0.5 flex items-center gap-3">
                          <span className="text-[15px] font-bold text-primary">
                            {product.price?.toLocaleString("vi-VN")}₫
                          </span>
                          {product.brand && (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[9px] font-bold text-gray-500 uppercase tracking-tight">
                              {product.brand}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => submitSearch()}
                  className="flex w-full items-center justify-center gap-2 bg-gray-50/50 py-3 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-white"
                >
                  <Search className="h-3.5 w-3.5" />
                  XEM TẤT CẢ KẾT QUẢ CHO "{searchQuery.toUpperCase()}"
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function HeaderSearchFallback() {
  return (
    <div className="order-last flex h-10 w-full lg:order-0 lg:h-12.5 lg:w-auto">
      <Input
        readOnly
        placeholder="Tìm kiếm linh kiện, Laptop, VGA..."
        className={cn("h-full flex-1 lg:w-150")}
      />
      <Button
        type="button"
        disabled
        className={cn(
          "bg-primary hover:bg-primary-hover/90 h-full cursor-pointer px-4 text-white lg:w-17.5",
        )}
      >
        TÌM
      </Button>
    </div>
  );
}

function Header() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { isLoggedIn, user, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    toast.info("Đã đăng xuất.", { autoClose: 1500 });
    router.push("/");
  };

  // Lấy chữ cái đầu của tên để hiển thị avatar
  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .slice(-2)
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
    : "U";
  return (
    <header className="relative z-[10000] flex flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-8 lg:px-12 lg:py-6.25 xl:px-16">
      {/* Logo */}
      <div className="text-xl font-black md:text-2xl lg:text-[28px] tracking-tighter">
        <Link href={"/"} className="group flex items-center gap-1">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent transition-all group-hover:from-indigo-600 group-hover:to-blue-600">Net</span>
          <span className="text-slate-800">Tech</span>
          <div className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse mt-3" />
        </Link>
      </div>

      {/* Search */}
      <Suspense fallback={<HeaderSearchFallback />}>
        <HeaderSearchBar />
      </Suspense>

      {/* Right: Cart + Auth */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Chuông thông báo kiểu Shopee */}
        {mounted && isLoggedIn && <NotificationBell />}

        {/* Giỏ hàng */}
        <Link
          href="/cart"
          className="group hover:text-primary relative flex cursor-pointer items-center gap-2 text-sm transition-colors md:text-base"
        >
          <div className="relative">
            <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
            {mounted && totalItems > 0 && (
              <span className="bg-destructive absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white md:h-5 md:w-5 md:text-xs">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </div>
          <p className="hidden md:block">Giỏ hàng</p>
        </Link>
        {/* --- ĐOẠN CODE CŨ ĐÃ ĐƯỢC COMMENT LẠI ---
        <div className="flex items-center gap-2 lg:h-10">
          {mounted && isLoggedIn && user ? (
            <Link href="/profile" className="flex items-center gap-2 ml-4 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#005BAA] text-[15px] font-bold text-white shadow-sm">
                {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <span className="hidden text-[14px] font-bold text-heading md:block whitespace-nowrap">
                {user?.fullName || "User"}
              </span>
            </Link>
          ) : (
        ------------------------------------------- */}

        {/* Auth buttons */}
        <div className="flex items-center gap-2 lg:h-10">
          {mounted && isLoggedIn ? (
            /* ── Trạng thái đã đăng nhập ── */
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="hover:border-primary/40 hover:text-primary flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1.5 pr-3 pl-1.5 text-sm font-semibold text-gray-700 shadow-sm transition-all"
              >
                {/* Avatar */}
                <span className="bg-primary flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white">
                  {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                </span>
                <span className="hidden max-w-24 truncate md:block">
                  {user?.fullName?.split(" ").pop() || "Tài khoản"}
                </span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform",
                    dropdownOpen && "rotate-180",
                  )}
                />
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute top-full right-0 z-[10050] mt-2 w-44 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
                  <div className="border-b border-gray-100 px-4 py-2.5">
                    <p className="text-xs font-semibold text-gray-500">
                      Đã đăng nhập
                    </p>
                    <p className="truncate text-sm font-bold text-gray-900">
                      {user?.fullName || "Tài khoản"}
                    </p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="hover:text-primary flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <User className="h-4 w-4" /> Tài khoản của tôi
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ── Trạng thái chưa đăng nhập ── */
            <>
              <Link href="/login">
                <Button
                  className={cn(
                    "hover:bg-primary-hover/90 h-8 cursor-pointer px-3 text-sm text-white md:h-10 md:px-4 lg:w-30 lg:text-base",
                  )}
                >
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  className={cn(
                    "hover:bg-primary-hover/90 h-8 cursor-pointer px-3 text-sm text-white md:h-10 md:px-4 lg:w-30 lg:text-base",
                  )}
                >
                  Đăng ký
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
