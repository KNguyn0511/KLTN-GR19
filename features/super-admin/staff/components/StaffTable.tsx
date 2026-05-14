"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Lock, Unlock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { StaffAddModal } from "./StaffAddModal";

const getInitials = (name: string) => {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length === 0) return "?";
  return parts[parts.length - 1][0].toUpperCase();
};

interface StaffTableProps {
  onOpenEdit: (staff: any) => void;
}

export function StaffTable({ onOpenEdit }: StaffTableProps) {
  const searchParams = useSearchParams();
  const [staffs, setStaffs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);

  useEffect(() => {
    const fetchStaffs = async () => {
      setLoading(true);
      try {
        const queryString = searchParams.toString();
        const res = await axiosInstance.get(
          `/users/staff/list${queryString ? `?${queryString}` : ""}`,
        );

        if (res.data && res.data.success) {
          setStaffs(res.data.data);
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách nhân viên:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffs();
  }, [searchParams]);

  const handleEditClick = (staff: any) => {
    setSelectedStaff(staff);
    setIsEditModalOpen(true);
  };

  const handleToggleLock = async (id: string, isDeleted: boolean) => {
    const confirmMsg = isDeleted 
      ? "Bạn muốn mở khóa tài khoản này?" 
      : "Bạn có chắc chắn muốn khóa nhân viên này?";
      
    if (!window.confirm(confirmMsg)) return;

    try {
      await axiosInstance.patch(`/users/${id}/toggle-lock`);
      alert(isDeleted ? "Mở khóa thành công!" : "Đã khóa tài khoản!");
      window.location.reload();
    } catch (error) {
      console.error("Lỗi khóa tài khoản:", error);
      alert("Có lỗi xảy ra khi thay đổi trạng thái!");
    }
  };

  return (
    <>
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50 text-[11px] font-black tracking-widest text-slate-400 uppercase">
                <th className="px-0 w-1"></th>
                <th className="px-6 py-5">NHÂN VIÊN</th>
                <th className="px-6 py-5">VAI TRÒ (ROLE)</th>
                <th className="px-6 py-5">CHI NHÁNH QUẢN LÝ</th>
                <th className="px-6 py-5">TRẠNG THÁI</th>
                <th className="px-6 py-5 text-center">HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                      <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">Đang tải dữ liệu...</p>
                    </div>
                  </td>
                </tr>
              ) : staffs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-slate-500 uppercase text-xs font-black tracking-widest">
                    Không tìm thấy nhân viên nào phù hợp.
                  </td>
                </tr>
              ) : (
                staffs.map((staff) => (
                  <tr 
                    key={staff._id} 
                    className={cn(
                      "group transition-all duration-300 hover:bg-blue-50/40 hover:shadow-[0_8px_30px_rgb(59,130,246,0.08)] hover:z-10 relative", 
                      staff.isDeleted && "opacity-60 grayscale-[0.5]"
                    )}
                  >
                    <td className="px-0 w-1 relative">
                      <div className="absolute inset-y-2 left-0 w-1 bg-blue-600 rounded-r-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-full group-hover:translate-x-0" />
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-black text-sm shadow-sm ring-1 ring-white transition-all group-hover:scale-110",
                          staff.isDeleted ? "bg-slate-200 text-slate-500" :
                          staff.role === "Super Admin" ? "bg-purple-100 text-purple-700 ring-purple-50" : "bg-blue-100 text-blue-700 ring-blue-50"
                        )}>
                          {getInitials(staff.fullName)}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className={cn("text-sm font-bold transition-colors group-hover:text-blue-600", staff.isDeleted ? "text-slate-500 line-through" : "text-slate-800")}>
                            {staff.fullName}
                          </span>
                          <span className="text-[11px] font-medium text-slate-400">{staff.email}</span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-5">
                      <span className={cn(
                        "inline-flex rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider shadow-sm ring-1",
                        staff.isDeleted ? "bg-slate-100 text-slate-500 ring-slate-200" :
                        staff.role === "Store Manager" ? "bg-blue-50 text-blue-700 ring-blue-100" : 
                        staff.role === "Super Admin" ? "bg-purple-50 text-purple-700 ring-purple-100" :
                        "bg-slate-50 text-slate-700 ring-slate-200"
                      )}>
                        {staff.role}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-sm font-bold text-slate-600">
                      <span className="inline-flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                        {staff.branchId?.name || "Kho Tổng (Central Warehouse)"}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-tight",
                        !staff.isDeleted ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100" : "bg-rose-50 text-rose-600 ring-1 ring-rose-100"
                      )}>
                        <div className={cn("h-1.5 w-1.5 rounded-full", !staff.isDeleted ? "bg-emerald-500 animate-pulse" : "bg-rose-500")} />
                        {!staff.isDeleted ? "Hoạt động" : "Đã khóa"}
                      </span>
                    </td>
                    
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEditClick(staff)}
                          className="h-8 w-8 rounded-xl bg-slate-50 text-blue-600 shadow-sm transition-all hover:bg-blue-600 hover:text-white hover:shadow-lg active:scale-90" 
                          title="Chỉnh sửa"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>

                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleToggleLock(staff._id, staff.isDeleted)}
                          className={cn(
                            "h-8 w-8 rounded-xl shadow-sm transition-all active:scale-90",
                            staff.isDeleted 
                              ? "bg-rose-50 text-rose-600 hover:bg-emerald-600 hover:text-white hover:shadow-emerald-100" 
                              : "bg-slate-50 text-slate-400 hover:bg-amber-500 hover:text-white hover:shadow-amber-100"
                          )} 
                          title={staff.isDeleted ? "Mở khóa tài khoản" : "Khóa tài khoản"}
                        >
                          {staff.isDeleted ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <StaffAddModal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedStaff(null);
        }} 
        editData={selectedStaff}
      />
    </>
  );
}