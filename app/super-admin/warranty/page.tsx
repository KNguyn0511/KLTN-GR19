"use client";

import { useEffect, useState } from "react";
import { getAllWarrantiesAdmin } from "@/lib/warrantyApi";
import { UpdateWarrantyModal } from "@/features/super-admin/warranty/components/UpdateWarrantyModal";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Search, RefreshCw, Filter, ShieldCheck, Clock, User, Package, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const statusMap: Record<string, { label: string; color: string; bgColor: string; dotColor: string }> = {
  PENDING: { 
    label: "Chờ xác nhận", 
    color: "text-amber-700", 
    bgColor: "bg-amber-50 ring-amber-100", 
    dotColor: "bg-amber-500" 
  },
  APPROVED: { 
    label: "Đã tiếp nhận", 
    color: "text-blue-700", 
    bgColor: "bg-blue-50 ring-blue-100", 
    dotColor: "bg-blue-500" 
  },
  UNDER_REPAIR: { 
    label: "Đang sửa chữa", 
    color: "text-orange-700", 
    bgColor: "bg-orange-50 ring-orange-100", 
    dotColor: "bg-orange-500" 
  },
  COMPLETED: { 
    label: "Sửa xong", 
    color: "text-emerald-700", 
    bgColor: "bg-emerald-50 ring-emerald-100", 
    dotColor: "bg-emerald-500" 
  },
  RETURNED: { 
    label: "Đã trả khách", 
    color: "text-slate-700", 
    bgColor: "bg-slate-50 ring-slate-100", 
    dotColor: "bg-slate-400" 
  },
  REJECTED: { 
    label: "Bị từ chối", 
    color: "text-rose-700", 
    bgColor: "bg-rose-50 ring-rose-100", 
    dotColor: "bg-rose-500" 
  },
};

export default function WarrantyAdminPage() {
  const [warranties, setWarranties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWarranty, setSelectedWarranty] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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
      date: d.toLocaleDateString("vi-VN"),
      time: d.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })
    };
  };

  const filteredWarranties = warranties.filter(w => {
    const matchesSearch = 
      w.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.userId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === "all") {
      matchesStatus = true;
    } else if (statusFilter === "NEW") {
      matchesStatus = w.status === "PENDING" || w.status === "APPROVED";
    } else if (statusFilter === "REPAIRING") {
      matchesStatus = w.status === "UNDER_REPAIR";
    } else if (statusFilter === "RESOLVED") {
      matchesStatus = w.status === "COMPLETED" || w.status === "RETURNED";
    } else {
      matchesStatus = w.status === statusFilter;
    }
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    newRequests: warranties.filter(w => w.status === "PENDING" || w.status === "APPROVED").length,
    inProgress: warranties.filter(w => w.status === "UNDER_REPAIR").length,
    resolved: warranties.filter(w => w.status === "COMPLETED" || w.status === "RETURNED").length,
  };

  return (
    <div className="flex flex-col gap-8 bg-slate-50/50 p-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-100">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            Quản lý Bảo hành
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Hệ thống tiếp nhận, điều phối sửa chữa và quản lý hậu mãi toàn diện
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={fetchWarranties} 
            variant="outline" 
            className="group flex items-center gap-2 rounded-2xl bg-white border-none px-5 py-6 text-xs font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 transition-all hover:ring-blue-200 active:scale-95"
          >
            <RefreshCw size={14} className={cn("text-blue-600 transition-transform group-hover:rotate-180 duration-500", loading && "animate-spin")} />
            Làm mới hệ thống
          </Button>
        </div>
      </div>

      {/* Quick Stats Filterable Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => setStatusFilter(statusFilter === "NEW" ? "all" : "NEW")}
          className={cn(
            "bg-white p-6 rounded-3xl shadow-sm ring-1 flex items-center gap-5 transition-all cursor-pointer hover:scale-[1.02]",
            statusFilter === "NEW" ? "ring-amber-400 bg-amber-50/30 shadow-md" : "ring-slate-100"
          )}
        >
          <div className="h-14 w-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 shadow-inner">
            <Clock size={28} />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Đợi tiếp nhận</p>
            <h3 className="text-2xl font-black text-slate-900">{stats.newRequests} <span className="text-sm font-medium text-slate-400 italic">phiếu mới</span></h3>
          </div>
        </div>
        
        <div 
          onClick={() => setStatusFilter(statusFilter === "REPAIRING" ? "all" : "REPAIRING")}
          className={cn(
            "bg-white p-6 rounded-3xl shadow-sm ring-1 flex items-center gap-5 transition-all cursor-pointer hover:scale-[1.02]",
            statusFilter === "REPAIRING" ? "ring-blue-400 bg-blue-50/30 shadow-md" : "ring-slate-100"
          )}
        >
          <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 shadow-inner">
            <RefreshCw size={28} className={statusFilter === "REPAIRING" ? "animate-spin" : "animate-spin-slow"} />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Đang sửa chữa</p>
            <h3 className="text-2xl font-black text-slate-900">{stats.inProgress} <span className="text-sm font-medium text-slate-400 italic">thiết bị</span></h3>
          </div>
        </div>

        <div 
          onClick={() => setStatusFilter(statusFilter === "RESOLVED" ? "all" : "RESOLVED")}
          className={cn(
            "bg-white p-6 rounded-3xl shadow-sm ring-1 flex items-center gap-5 transition-all cursor-pointer hover:scale-[1.02]",
            statusFilter === "RESOLVED" ? "ring-emerald-400 bg-emerald-50/30 shadow-md" : "ring-slate-100"
          )}
        >
          <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-inner">
            <ShieldCheck size={28} />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Đã giải quyết</p>
            <h3 className="text-2xl font-black text-slate-900">{stats.resolved} <span className="text-sm font-medium text-slate-400 italic">yêu cầu</span></h3>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 md:flex-row md:items-center justify-between">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />
          <input 
            type="text" 
            placeholder="Tìm theo tên máy, số Serial hoặc thông tin khách hàng..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-xl rounded-2xl border-none bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-bold text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-100/50 focus:shadow-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-[1px] bg-slate-100 mx-2 hidden md:block" />
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-12 rounded-2xl bg-slate-50 px-6 text-[11px] font-black uppercase tracking-widest text-slate-600 outline-none transition-all hover:bg-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-50/50"
          >
            <option value="all">TẤT CẢ TRẠNG THÁI</option>
            {Object.entries(statusMap).map(([key, value]) => (
              <option key={key} value={key}>{value.label.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content Table */}
      <div className="relative min-h-[400px] overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50 text-[11px] font-black tracking-widest text-slate-400 uppercase">
                <th className="px-0 w-1"></th>
                <th className="px-6 py-5">THỜI GIAN GỬI</th>
                <th className="px-6 py-5">SẢN PHẨM & LỖI</th>
                <th className="px-6 py-5">SERIAL/IMEI</th>
                <th className="px-6 py-5">KHÁCH HÀNG</th>
                <th className="px-6 py-5">TRẠNG THÁI</th>
                <th className="px-6 py-5 text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && filteredWarranties.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-12 w-12 rounded-full border-4 border-blue-600/20 border-t-blue-600 animate-spin" />
                      <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Đang đồng bộ dữ liệu...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredWarranties.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-4 text-slate-300">
                      <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center ring-1 ring-slate-100">
                        <ShieldCheck className="h-10 w-10 opacity-20" />
                      </div>
                      <p className="text-sm font-black uppercase tracking-tight text-slate-400">Không có yêu cầu bảo hành nào cần xử lý</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredWarranties.map((w) => {
                  const dateInfo = formatDate(w.createdAt);
                  const status = statusMap[w.status] || statusMap.PENDING;

                  return (
                    <tr 
                      key={w._id} 
                      className="group transition-all duration-300 hover:bg-blue-50/30 hover:shadow-[0_4px_20px_rgb(59,130,246,0.04)] relative"
                    >
                      <td className="px-0 w-1 relative">
                        <div className="absolute inset-y-3 left-0 w-1.5 bg-blue-600 rounded-r-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-full group-hover:translate-x-0 shadow-[0_0_10px_rgb(37,99,235,0.4)]" />
                      </td>
                      
                      <td className="px-6 py-6">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 text-slate-900 font-black text-sm tracking-tight">
                            <Clock className="h-3.5 w-3.5 text-blue-500" />
                            {dateInfo.date}
                          </div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-70">Lúc {dateInfo.time}</span>
                        </div>
                      </td>

                      <td className="px-6 py-6">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 bg-slate-100 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              <Package className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-black text-slate-800 tracking-tight leading-tight">
                              {w.productName}
                            </span>
                          </div>
                          <div className="text-[11px] font-bold text-rose-600 bg-rose-50/80 px-2.5 py-1 rounded-lg border border-rose-100 shadow-sm inline-flex items-center gap-2 w-fit">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                            Lỗi: {w.reason}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-6">
                        <span className="inline-flex items-center rounded-xl bg-slate-900 px-3.5 py-2 text-[10px] font-black text-white uppercase tracking-[0.15em] font-mono shadow-lg shadow-slate-200">
                          {w.serialNumber}
                        </span>
                      </td>

                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3.5">
                          <div className="h-11 w-11 rounded-2xl bg-white flex items-center justify-center text-slate-500 font-black text-sm ring-1 ring-slate-100 shadow-sm transition-all group-hover:scale-110 group-hover:shadow-md group-hover:ring-blue-100">
                            <User size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-black text-slate-900 tracking-tight">
                              {w.userId?.fullName || "Khách vãng lai"}
                            </span>
                            <span className="text-[11px] font-bold text-slate-400 opacity-80">{w.userId?.email || "No Email Provided"}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-6">
                        <span className={cn(
                          "inline-flex items-center gap-2 rounded-2xl px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest ring-1 shadow-sm", 
                          status.bgColor,
                          status.color
                        )}>
                          <div className={cn("h-2 w-2 rounded-full", status.dotColor, w.status !== "RETURNED" && w.status !== "REJECTED" && "animate-pulse shadow-[0_0_8px_currentColor]")} />
                          {status.label}
                        </span>
                      </td>

                      <td className="px-6 py-6 text-right">
                        <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                          <Button 
                            size="sm" 
                            onClick={() => handleUpdate(w)}
                            className="rounded-2xl bg-slate-900 px-6 py-5 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-slate-200 transition-all hover:bg-blue-600 hover:shadow-blue-100 active:scale-95"
                          >
                            Chi tiết
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
