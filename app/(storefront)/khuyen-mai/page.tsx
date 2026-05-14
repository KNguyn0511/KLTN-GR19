"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Gift, Ticket, Truck } from "lucide-react";

// --- Countdown Component ---
const CountdownTimer = ({ targetDate }: { targetDate: Date }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft("00:00:00");
        return;
      }

      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return <span>{timeLeft}</span>;
};

const PromotionsPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Set target date for countdown (e.g., end of today)
  const [targetDate] = useState(() => {
    const date = new Date();
    date.setHours(23, 59, 59, 999);
    return date;
  });

  useEffect(() => {
    const fetchPromotions = async () => {
      setLoading(true);
      try {
        const { getPromotions } = await import("@/lib/api/promotionApi");
        const data = await getPromotions();
        setPromotions(data);
      } catch (error) {
        console.error("Failed to fetch promotions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  };

  const activePromotions = promotions.filter(p => {
    if (!p.isActive) return false;
    
    // Check if expired
    const now = new Date();
    const endDate = new Date(p.endDate);
    if (now > endDate) return false;
    
    // Check if usage limit reached
    if (p.usageLimit > 0 && p.usedCount >= p.usageLimit) return false;

    return true;
  });

  return (
    <main className="px-4 py-4 md:px-8 md:py-6 lg:px-12 xl:px-16 lg:py-7.5">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-900">
          <Gift className="text-red-500 fill-red-500 w-8 h-8" />
          Săn Deal & Mã Giảm Giá
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Cập nhật lúc 14:00 - 05/02/2026
        </p>
      </div>

      {/* Hero Banner */}
      <div
        className="relative w-full rounded-2xl p-8 md:p-12 mb-10 overflow-hidden shadow-lg"
        style={{
          backgroundColor: "#0066FF",
          backgroundImage: `
            radial-gradient(circle at 85% -10%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 40%),
            radial-gradient(circle at 95% 110%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 45%),
            radial-gradient(circle at 75% 60%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 30%)
          `,
        }}
      >
        <div className="relative z-10 flex flex-col items-start gap-4 text-white max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            SIÊU SALE LƯƠNG VỀ
          </h2>
          <p className="text-lg md:text-xl text-blue-50">
            Giảm đến 50% Laptop & Gear - Số lượng có hạn!
          </p>
          
          <div className="bg-blue-900/40 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mt-2 flex items-center gap-2 text-sm font-medium">
            <span>⏰</span> Kết thúc sau: <CountdownTimer targetDate={targetDate} />
          </div>

          <Button className="mt-4 bg-white text-blue-600 hover:bg-gray-100 font-bold px-8 py-6 rounded-xl shadow-md transition-transform hover:scale-105">
            SĂN NGAY ▶
          </Button>
        </div>
      </div>

      {/* Filter and Sort */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => setActiveFilter("all")}
            className={`rounded-full ${
              activeFilter === "all"
                ? "bg-blue-600 text-white hover:bg-blue-700 border-transparent hover:text-white"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            Tất cả
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveFilter("voucher")}
            className={`rounded-full flex items-center gap-2 ${
              activeFilter === "voucher"
                ? "bg-blue-600 text-white hover:bg-blue-700 border-transparent hover:text-white"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            <Ticket className="w-4 h-4" /> Voucher
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveFilter("freeship")}
            className={`rounded-full flex items-center gap-2 ${
              activeFilter === "freeship"
                ? "bg-blue-600 text-white hover:bg-blue-700 border-transparent hover:text-white"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            <Truck className="w-4 h-4 text-orange-500" /> Freeship
          </Button>
        </div>

        <div className="w-full sm:w-48">
          <Select defaultValue="newest">
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Sắp xếp: Mới nhất</SelectItem>
              <SelectItem value="discount">Giảm nhiều nhất</SelectItem>
              <SelectItem value="ending">Sắp kết thúc</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Deals Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-48 text-gray-500 font-medium">
          Đang tải danh sách khuyến mãi...
        </div>
      ) : activePromotions.length === 0 ? (
        <div className="flex justify-center items-center h-48 text-gray-500 font-medium">
          Hiện tại chưa có khuyến mãi nào.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activePromotions.map((promo) => {
            const isFreeship = promo.code.toLowerCase().includes('ship') || promo.description.toLowerCase().includes('vận chuyển');
            const isGift = promo.code.toLowerCase().includes('tang') || promo.description.toLowerCase().includes('tặng');
            
            // Dynamic styling logic based on content
            let theme = {
              badgeBg: "bg-red-500",
              badgeText: "HOT DEAL",
              cardBg: "bg-blue-100",
              titleColor: "text-blue-900",
              titleIcon: null as React.ReactNode,
              mainTitle: promo.discountType === 'Percentage' ? `${promo.discountValue}% OFF` : `GIẢM ${promo.discountValue / 1000}K`,
              buttonColor: "bg-blue-600 hover:bg-blue-700",
            };

            if (isFreeship) {
              theme = {
                badgeBg: "bg-emerald-600",
                badgeText: "TOÀN QUỐC",
                cardBg: "bg-green-100",
                titleColor: "text-emerald-800",
                titleIcon: <Truck className="w-8 h-8 mb-2" />,
                mainTitle: "FREESHIP",
                buttonColor: "bg-emerald-500 hover:bg-emerald-600",
              };
            } else if (isGift) {
              theme = {
                badgeBg: "bg-pink-600",
                badgeText: "QUÀ TẶNG HOT",
                cardBg: "bg-pink-100",
                titleColor: "text-pink-800",
                titleIcon: <Gift className="w-8 h-8 mb-2" />,
                mainTitle: "QUÀ TẶNG",
                buttonColor: "bg-orange-500 hover:bg-orange-600",
              };
            }

            return (
              <div key={promo._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow">
                <div className={`${theme.cardBg} p-8 flex flex-col items-center justify-center text-center relative h-48`}>
                  <span className={`absolute top-4 left-4 text-white text-xs font-bold px-3 py-1 rounded-md ${theme.badgeBg}`}>
                    {theme.badgeText}
                  </span>
                  {theme.titleIcon}
                  <h3 className={`text-4xl font-bold ${theme.titleColor}`}>{theme.mainTitle}</h3>
                </div>
                <div className="p-6 flex flex-col grow">
                  <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{promo.description}</h4>
                  <p className="text-sm text-gray-500 mb-6 line-clamp-2">
                    {promo.minOrderValue > 0 ? `Đơn từ ${formatCurrency(promo.minOrderValue)}.` : "Áp dụng toàn sàn."}
                    {promo.maxDiscount > 0 && ` Tối đa ${formatCurrency(promo.maxDiscount)}.`}
                  </p>
                  
                  <div className="mt-auto">
                    {isFreeship ? (
                      <div className="flex items-center justify-center bg-gray-100 text-gray-500 rounded-xl p-3 mb-4 font-medium text-sm border-2 border-transparent">
                        Tự động áp dụng
                      </div>
                    ) : (
                      <div className="flex items-center justify-between border-2 border-dashed border-gray-200 bg-gray-50 rounded-xl p-3 mb-4">
                        <span className="font-bold tracking-wider text-gray-800 uppercase">{promo.code}</span>
                        <Button 
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(promo.code)}
                          className="text-blue-600 font-bold hover:text-blue-700 hover:bg-blue-50/50"
                        >
                          {copiedCode === promo.code ? "ĐÃ COPY" : "COPY"}
                        </Button>
                      </div>
                    )}
                    <Button className={`w-full text-white font-semibold py-6 rounded-xl ${theme.buttonColor}`}>
                      Dùng Ngay
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default PromotionsPage;
