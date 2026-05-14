"use client";

import React, { useState, useEffect } from "react";
import { addressApi, UserAddress } from "@/features/storefront/address/api/addressApi";
import { AddressFormModal } from "@/features/storefront/address/components/AddressFormModal";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, User, Edit3, Trash2, Plus, CheckCircle2, Home, Briefcase, Navigation, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const ProfileAddressBook = () => {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const data = await addressApi.getSavedAddresses();
      setAddresses(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
      await addressApi.deleteAddress(id);
      fetchAddresses();
    }
  };

  const handleSetDefault = async (id: string) => {
    await addressApi.setDefaultAddress(id);
    fetchAddresses();
  };

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (addr: UserAddress) => {
    setEditingAddress(addr);
    setIsModalOpen(true);
  };

  const handleSaveModal = async (data: Omit<UserAddress, "id"> | UserAddress) => {
    setIsModalOpen(false); // Optimistic close
    if ("id" in data) {
      await addressApi.updateAddress(data as UserAddress);
    } else {
      await addressApi.saveAddress(data);
    }
    fetchAddresses();
  };

  return (
    <div className="flex w-full flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Sổ địa chỉ</h1>
          <p className="text-sm font-medium text-slate-400">Quản lý các địa chỉ nhận hàng của bạn</p>
        </div>
        <Button 
          onClick={handleOpenAdd} 
          className="group h-11 rounded-2xl bg-blue-600 px-6 text-[13px] font-black uppercase tracking-widest text-white shadow-xl shadow-blue-100 transition-all hover:bg-blue-700 hover:shadow-blue-200 active:scale-95"
        >
          <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
          Thêm mới
        </Button>
      </div>

      {/* List */}
      <div className="grid gap-6">
        {isLoading ? (
          <div className="flex h-64 w-full flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white text-slate-400 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <span className="mt-4 text-sm font-black uppercase tracking-widest">Đang tải địa chỉ...</span>
          </div>
        ) : addresses.length === 0 ? (
          <div className="flex h-64 w-full flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white text-slate-400 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-200">
              <MapPin className="h-10 w-10" />
            </div>
            <span className="mt-4 text-sm font-black uppercase tracking-widest">Chưa có địa chỉ nào</span>
            <p className="mt-1 text-[13px] font-medium text-slate-400">Vui lòng thêm địa chỉ để nhận hàng nhanh hơn!</p>
          </div>
        ) : (
          addresses.map((addr) => (
            <div 
              key={addr.id} 
              className={cn(
                "group relative flex flex-col gap-6 rounded-3xl border p-6 transition-all duration-300 md:flex-row md:items-start md:justify-between",
                addr.isDefault 
                  ? "border-blue-100 bg-blue-50/30 shadow-[0_8px_30px_rgb(59,130,246,0.08)]" 
                  : "border-slate-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
              )}
            >
              {/* Address Content */}
              <div className="flex flex-1 items-start gap-5">
                <div className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors",
                  addr.isDefault ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-blue-600"
                )}>
                  {addr.addressDetail.toLowerCase().includes("văn phòng") || addr.addressDetail.toLowerCase().includes("công ty") 
                    ? <Briefcase className="h-6 w-6" /> 
                    : <Home className="h-6 w-6" />
                  }
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-base font-black text-slate-800">{addr.fullName}</span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-400">
                      <Phone className="h-3.5 w-3.5" />
                      {"(+84) " + (addr.phone.startsWith("0") ? addr.phone.substring(1) : addr.phone)}
                    </span>
                    {addr.isDefault && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-tighter text-white shadow-sm">
                        <CheckCircle2 className="h-3 w-3" />
                        Mặc định
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-start gap-2">
                      <Navigation className="mt-1 h-3.5 w-3.5 shrink-0 text-slate-300" />
                      <span className="text-sm font-medium leading-relaxed text-slate-600">{addr.addressDetail}</span>
                    </div>
                    <span className="ml-5 text-sm font-bold text-slate-400">
                      {addr.ward}, {addr.district}, {addr.city}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end md:self-start">
                {!addr.isDefault && (
                  <Button 
                    onClick={() => handleSetDefault(addr.id)} 
                    variant="outline"
                    className="h-10 rounded-xl border-slate-200 px-4 text-[11px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50"
                  >
                    Mặc định
                  </Button>
                )}
                <div className="flex h-10 items-center gap-1 rounded-xl bg-slate-50 p-1 group-hover:bg-white/50">
                  <Button 
                    onClick={() => handleOpenEdit(addr)} 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                    title="Chỉnh sửa"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={() => handleDelete(addr.id)} 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500"
                    title="Xóa"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <AddressFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveModal}
        initialData={editingAddress}
      />
    </div>
  );
};
