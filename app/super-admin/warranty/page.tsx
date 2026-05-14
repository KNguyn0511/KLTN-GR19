"use client";

import { useEffect, useState } from "react";
import { getAllWarrantiesAdmin } from "@/lib/warrantyApi";
import { UpdateWarrantyModal } from "@/features/super-admin/warranty/components/UpdateWarrantyModal";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Search, RefreshCw, Filter, ShieldCheck, User, Package, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const statusMap: Record<string, { label: string; color: string; dotColor: string }> = {
  PENDING: { label: "Chờ xác nhận", color: "bg-amber-50 text-amber-700 ring-amber-100", dotColor: "bg-amber-500" },
  APPROVED: { label: "Đã tiếp nhận", color: "bg-blue-50 text-blue-700 ring-blue-100", dotColor: "bg-blue-500" },
  UNDER_REPAIR: { label: "Đang sửa chữa", color: "bg-orange-50 text-orange-700 ring-orange-100", dotColor: "bg-orange-500" },
  COMPLETED: { label: "Sửa xong", color: "bg-green-50 text-green-700 ring-green-100", dotColor: "bg-green-500" },
  RETURNED: { label: "Đã trả khách", color: "bg-emerald-50 text-emerald-700 ring-emerald-100", dotColor: "bg-emerald-500" },
  REJECTED: { label: "Bị từ chối", color: "bg-rose-50 text-rose-700 ring-rose-100", dotColor: "bg-rose-500" },
};

export default function WarrantyAdminPage() {
  const [warranties, setWarranties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWarranty, setSelectedWarranty] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
    const d = new Date(dateStr);
    return {
      time: d.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' }),
      date: d.toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric' })
    };
  };

  const filteredWarranties = warranties.filter(w => 
    w.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.userId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 bg-slate-50/50 p-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-100">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Quản lý Bảo hành
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Theo dõi, tiếp nhận và cập nhật tiến độ bảo hành sản phẩm cho khách hàng
          </p>
        </div>
        <Button 
          onClick={fetchWarranties} 
          variant="outline" 
          className="group flex items-center gap-2 rounded-2xl bg-white border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
        >
          <RefreshCw size={14} className={cn("text-blue-600 transition-transform group-hover:rotate-180 duration-500", loading && "animate-spin")} />
          Làm mới dữ liệu
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 md:flex-row md:items-center justify-between">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />
          <input 
            type="text" 
            placeholder="Tìm theo tên sản phẩm, Serial/IMEI hoặc tên khách hàng..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-2xl rounded-xl border-none bg-slate-50 py-2.5 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-50/50 focus:shadow-sm"
          />
        </div>
        <Button variant="outline" className="h-11 rounded-xl border-none bg-slate-50 px-4 text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100">
          <Filter size={16} className="mr-2" /> Bộ lọc
        </Button>
      </div>

      {/* Table Section */}
      <div className="relative min-h-[500px] overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50 text-[11px] font-black tracking-widest text-slate-400 uppercase">
                <th className="px-0 w-1"></th>
                <th className="px-6 py-5">Ngày gửi</th>
                <th className="px-6 py-5">Sản phẩm</th>
                <th className="px-6 py-5">Serial/IMEI</th>
                <th className="px-6 py-5">Khách hàng</th>
                <th className="px-6 py-5">Trạng thái</th>
                <th className="px-6 py-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && warranties.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                      <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">Đang tải danh sách...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredWarranties.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-300">
                      <ShieldCheck className="h-12 w-12 opacity-20" />
                      <p className="text-sm font-bold uppercase tracking-tight">Không tìm thấy yêu cầu bảo hành nào</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredWarranties.map((w) => {
                  const dateInfo = formatDate(w.createdAt);
                  const status = statusMap[w.status] || { label: w.status, color: "bg-slate-100 text-slate-600", dotColor: "bg-slate-400" };
                  
                  return (
                    <tr 
                      key={w._id} 
                      className="group transition-all duration-300 hover:bg-blue-50/40 hover:shadow-[0_8px_30px_rgb(59,130,246,0.08)] hover:z-10 relative"
                    >
                      <td className="px-0 w-1 relative">
                        <div className="absolute inset-y-2 left-0 w-1 bg-blue-600 rounded-r-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-full group-hover:translate-x-0" />
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-slate-900 font-bold text-sm">
                            <Clock size={12} className="text-slate-400" />
                            {dateInfo.time} {dateInfo.date}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <div className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {w.productName || "—"}
                          </div>
                          <div className="text-[11px] font-medium text-rose-500 mt-1 italic line-clamp-1">
                            Lỗi: {w.reason}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-xs font-bold text-slate-600 font-mono tracking-tight">
                          {w.serialNumber}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                            <User size={16} />
                          </div>
                          <div className="flex flex-col">
                            <div className="text-sm font-bold text-slate-800">{w.userId?.fullName || "Khách vãng lai"}</div>
                            <div className="text-[11px] font-medium text-slate-400">{w.userId?.email || "—"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-tight ring-1 shadow-sm",
                          status.color
                        )}>
                          <div className={cn("h-1.5 w-1.5 rounded-full", status.dotColor, w.status === 'UNDER_REPAIR' && "animate-pulse")} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end">
                          <Button 
                            size="sm" 
                            onClick={() => handleUpdate(w)}
                            className="rounded-xl bg-slate-900 text-[10px] font-black uppercase tracking-widest text-white shadow-md shadow-slate-100 transition-all hover:bg-slate-800 hover:-translate-y-0.5 active:scale-95"
                          >
                            Cập nhật
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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
