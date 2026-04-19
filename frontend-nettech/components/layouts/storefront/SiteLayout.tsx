"use client";

import React from "react";
import { usePathname } from "next/navigation";
import  Header  from "@/components/layouts/storefront/Header";
import  Navigation  from "@/components/layouts/storefront/Navigation";
import  Footer  from "@/components/layouts/storefront/Footer";
import  ScrollToTop  from "../../shared/ScrollToTop";

export const SiteLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  // Kiểm tra xem trang hiện tại có phải là trang Auth không
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password");

  return (
    <>
      {!isAuthPage && <Header />}
      {!isAuthPage && <Navigation />}

      <main className="flex w-full grow flex-col bg-white">{children}</main>

      {!isAuthPage && <ScrollToTop />}
      {!isAuthPage && <Footer />}
    </>
  );
};

export default SiteLayout;
