"use client";

import { Suspense, useState } from "react";
import { StaffFilterBar } from "@/features/super-admin/staff/components/StaffFilterBar";
import { StaffTable } from "@/features/super-admin/staff/components/StaffTable";
import { StaffAddModal } from "@/features/super-admin/staff/components/StaffAddModal"; // Cần import Modal

export default function SuperAdminStaffPage() {
  // 1. Quản lý trạng thái Đóng/Mở của Modal chung
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 2. Quản lý xem đang Sửa ai (nếu Thêm mới thì gán là null)
  const [selectedStaff, setSelectedStaff] = useState<any>(null);

  // Hàm mở Modal để THÊM MỚI (Truyền cho FilterBar)
  const handleOpenAdd = () => {
    setSelectedStaff(null); 
    setIsModalOpen(true);
  };

  // Hàm mở Modal để SỬA (Truyền cho Table)
  const handleOpenEdit = (staff: any) => {
    setSelectedStaff(staff); 
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-8 bg-slate-50/50 p-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Nhân sự & Phân quyền
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Quản lý đội ngũ nhân viên, vai trò truy cập và quyền hạn hệ thống (RBAC)
          </p>
        </div>
      </div>

      {/* Truyền hàm onOpenAdd xuống FilterBar */}
      <Suspense fallback={<div className="h-16 animate-pulse rounded-xl bg-slate-100"></div>}>
        <StaffFilterBar onOpenAdd={handleOpenAdd} />
      </Suspense>

      {/* Truyền hàm onOpenEdit xuống Table */}
      <Suspense fallback={<div className="p-8 text-center text-slate-500">Đang tải bảng dữ liệu...</div>}>
        <StaffTable onOpenEdit={handleOpenEdit} />
      </Suspense>

      {/* Đây là Modal duy nhất của toàn bộ trang */}
      <StaffAddModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        editData={selectedStaff} 
      />
    </div>
  );
}