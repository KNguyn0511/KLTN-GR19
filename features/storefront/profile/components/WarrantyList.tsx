"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ProfileTabs } from "./ProfileTabs";
import { WarrantyItem } from "./WarrantyItem";
import { getEligibleProducts, getMyWarranties } from "@/lib/warrantyApi";
import { RequestWarrantyModal } from "./RequestWarrantyModal";
import { WarrantyProgressModal } from "./WarrantyProgressModal";
import { toast } from "react-toastify";
import { ShieldCheck, Loader2, SearchX } from "lucide-react";

export const WarrantyList = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTabLabel, setActiveTabLabel] = useState<string>("");

  // Modal States
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [progressData, setProgressData] = useState<{ name: string; items: any[] }>({ name: "", items: [] });

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getEligibleProducts();
      setData(result);
    } catch (error) {
      console.error("Error fetching warranty data:", error);
      toast.error("Không thể tải dữ liệu bảo hành.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Dynamically calculate counts
  const allCount = data.length;
  const processingCount = data.filter((w) => !!w.currentWarrantyStatus).length;
  const expiredCount = data.filter((w) => w.isExpired).length;

  const TABS_CONFIG = useMemo(() => [
    { key: "all", label: `Tất cả (${allCount})` },
    { key: "processing", label: `Đang xử lý (${processingCount})` },
    { key: "expired", label: `Hết hạn (${expiredCount})` },
  ], [allCount, processingCount, expiredCount]);

  const tabsLabels = TABS_CONFIG.map(t => t.label);

  // Initialize active tab
  useEffect(() => {
    if (!activeTabLabel && tabsLabels.length > 0) {
      setActiveTabLabel(tabsLabels[0]);
    }
  }, [tabsLabels, activeTabLabel]);

  const activeKey = TABS_CONFIG.find(t => t.label === activeTabLabel)?.key || "all";

  const filteredData = data.filter((item) => {
    if (activeKey === "all") return true;
    if (activeKey === "processing") return !!item.currentWarrantyStatus;
    if (activeKey === "expired") return item.isExpired;
    return true;
  });

  const handleOpenRequest = (item: any) => {
    setSelectedProduct(item);
    setIsRequestModalOpen(true);
  };

  const handleOpenProgress = async (warrantyId: string, name: string) => {
    try {
      // Fetch details of specific warranty to get progress history
      const myWarranties = await getMyWarranties();
      const specific = myWarranties.find((w: any) => w._id === warrantyId);
      if (specific) {
        setProgressData({ name, items: specific.progress });
        setIsProgressModalOpen(true);
      }
    } catch (error) {
      toast.error("Không thể tải tiến độ bảo hành.");
    }
  };

  return (
    <div className="flex w-full flex-col gap-8">
      {/* Page Title & Subtitle */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Bảo Hành Điện Tử</h1>
          <p className="text-sm font-medium text-slate-400">
            Tra cứu hạn bảo hành và tiến độ sửa chữa thiết bị của bạn.
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <ShieldCheck className="h-5 w-5" />
        </div>
      </div>

      {/* Tabs */}
      <ProfileTabs
        tabs={tabsLabels}
        activeTab={activeTabLabel || (tabsLabels.length > 0 ? tabsLabels[0] : "")}
        onChange={setActiveTabLabel}
      />

      {/* List Feed */}
      <div className="grid gap-6">
        {loading ? (
          <div className="flex h-64 w-full flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white text-slate-400 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <span className="mt-4 text-sm font-black uppercase tracking-widest">Đang tải dữ liệu...</span>
          </div>
        ) : filteredData.length > 0 ? (
          filteredData.map((item, idx) => (
            <WarrantyItem 
              key={`${item.orderId}-${item.productId}-${idx}`} 
              item={item} 
              onRequest={handleOpenRequest}
              onViewProgress={handleOpenProgress}
            />
          ))
        ) : (
          <div className="flex h-64 w-full flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white text-slate-400 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-200">
              <SearchX className="h-10 w-10" />
            </div>
            <span className="mt-4 text-sm font-black uppercase tracking-widest">Không tìm thấy dữ liệu</span>
            <p className="mt-1 text-[13px] font-medium text-slate-400">Thiết bị của bạn có thể chưa được kích hoạt bảo hành.</p>
          </div>
        )}
      </div>

      <RequestWarrantyModal 
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        product={selectedProduct}
        onSuccess={fetchData}
      />

      <WarrantyProgressModal 
        isOpen={isProgressModalOpen}
        onClose={() => setIsProgressModalOpen(false)}
        productName={progressData.name}
        progress={progressData.items}
      />
    </div>
  );
};
