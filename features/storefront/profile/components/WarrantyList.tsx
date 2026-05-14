"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ProfileTabs } from "./ProfileTabs";
import { WarrantyItem } from "./WarrantyItem";
import { getEligibleProducts, getMyWarranties } from "@/lib/warrantyApi";
import { RequestWarrantyModal } from "./RequestWarrantyModal";
import { WarrantyProgressModal } from "./WarrantyProgressModal";
import { toast } from "react-toastify";

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
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[24px] font-bold text-heading">Bảo Hành Điện Tử (O2O)</h1>
        <p className="text-[14px] text-gray-500">
          Tra cứu hạn bảo hành và tiến độ sửa chữa tại toàn bộ chi nhánh NetTech.
        </p>
      </div>

      <div className="mt-1">
        <ProfileTabs
          tabs={tabsLabels}
          activeTab={activeTabLabel || tabsLabels[0]}
          onChange={setActiveTabLabel}
        />
      </div>

      <div className="flex flex-col gap-6">
        {loading ? (
          <div className="flex h-32 w-full items-center justify-center">Đang tải dữ liệu...</div>
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
          <div className="flex h-32 w-full items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-500 shadow-sm">
            Không có dữ liệu bảo hành nào.
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
