"use client";

import { useEffect, useState } from "react";
import { getAllWarrantiesAdmin } from "@/lib/warrantyApi";
import { UpdateWarrantyModal } from "@/features/super-admin/warranty/components/UpdateWarrantyModal";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Search, RefreshCw, Filter } from "lucide-react";

const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-700" },
  APPROVED: { label: "Đã tiếp nhận", color: "bg-blue-100 text-blue-700" },
  UNDER_REPAIR: { label: "Đang sửa chữa", color: "bg-orange-100 text-orange-700" },
  COMPLETED: { label: "Sửa xong", color: "bg-green-100 text-green-700" },
  RETURNED: { label: "Đã trả khách", color: "bg-emerald-100 text-emerald-700" },
  REJECTED: { label: "Bị từ chối", color: "bg-red-100 text-red-700" },
};

export default function WarrantyAdminPage() {
  const [warranties, setWarranties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWarranty, setSelectedWarranty] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchWarranties = async () => {
    try {
      setLoading(true);
      const data = await getAllWarrantiesAdmin();
      setWarranties(data);
    } catch (error) {
      toast.error("Không thể tải danh sách bảo hành");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarranties();
  }, []);

  const handleUpdate = (warranty: any) => {
    setSelectedWarranty(warranty);
    setIsModalOpen(true);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("vi-VN");
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Quản lý bảo hành</h1>
          <p className="text-gray-500">Tiếp nhận và cập nhật tiến độ bảo hành cho khách hàng</p>
        </div>
        <Button onClick={fetchWarranties} variant="outline" className="gap-2">
          <RefreshCw size={16} /> Làm mới
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm theo tên SP, Serial hoặc khách hàng..." 
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter size={18} /> Bộ lọc
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-sm">Ngày gửi</th>
                <th className="px-6 py-4 font-semibold text-sm">Sản phẩm</th>
                <th className="px-6 py-4 font-semibold text-sm">Serial/IMEI</th>
                <th className="px-6 py-4 font-semibold text-sm">Khách hàng</th>
                <th className="px-6 py-4 font-semibold text-sm">Trạng thái</th>
                <th className="px-6 py-4 font-semibold text-sm text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">Đang tải...</td>
                </tr>
              ) : warranties.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">Chưa có yêu cầu nào</td>
                </tr>
              ) : (
                warranties.map((w) => (
                  <tr key={w._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(w.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{w.productName}</div>
                      <div className="text-xs text-red-500 truncate max-w-[200px]">Lỗi: {w.reason}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{w.serialNumber}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="font-medium">{w.userId?.fullName || "Khách vãng lai"}</div>
                      <div className="text-xs text-gray-400">{w.userId?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusMap[w.status]?.color}`}>
                        {statusMap[w.status]?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button size="sm" onClick={() => handleUpdate(w)}>Cập nhật</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <UpdateWarrantyModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        warranty={selectedWarranty}
        onSuccess={fetchWarranties}
      />
    </div>
  );
}
