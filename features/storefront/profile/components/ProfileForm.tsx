"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Phone, Mail, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const ProfileForm = () => {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  const [formData, setFormData] = useState<{
    name: string;
    phone: string;
    email: string;
    gender: "Nam" | "Nữ";
  }>({
    name: "",
    phone: "",
    email: "",
    gender: "Nam",
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.fullName || "",
        phone: user.phone || "",
        email: user.email || "",
        gender: user.gender || "Nam",
      });
    }
    setMounted(true);
  }, [user]);

  if (!mounted || !user) return null;

  const handleSave = () => {
    updateUser({
      fullName: formData.name,
      phone: formData.phone,
      email: formData.email,
      gender: formData.gender,
    });
    alert("Cập nhật thông tin thành công!");
  };

  return (
    <div className="flex w-full flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-10">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Hồ Sơ Của Tôi</h1>
          <p className="text-sm font-medium text-slate-400">
            Quản lý thông tin hồ sơ cá nhân của bạn
          </p>
        </div>
        <div className="hidden h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 md:flex">
          <User className="h-5 w-5" />
        </div>
      </div>

      {/* Form Fields */}
      <div className="flex w-full max-w-2xl flex-col gap-8">
        
        {/* Full Name */}
        <div className="grid gap-2 lg:grid-cols-4 lg:items-center lg:gap-6">
          <label className="text-[13px] font-black uppercase tracking-widest text-slate-500 lg:text-right">
            Họ và tên
          </label>
          <div className="relative lg:col-span-3">
            <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-12 w-full rounded-xl border-slate-200 bg-slate-50/30 pl-10 transition-all focus:bg-white focus:ring-4 focus:ring-blue-100"
              placeholder="Nhập họ và tên của bạn"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div className="grid gap-2 lg:grid-cols-4 lg:items-center lg:gap-6">
          <label className="text-[13px] font-black uppercase tracking-widest text-slate-500 lg:text-right">
            Số điện thoại
          </label>
          <div className="flex items-center gap-3 lg:col-span-3">
            <div className="relative flex-1">
              <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={formData.phone}
                className="h-12 w-full rounded-xl border-slate-200 bg-slate-50/50 pl-10 text-slate-500"
                readOnly
              />
            </div>
            <button className="text-[12px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors">
              Thay đổi
            </button>
          </div>
        </div>

        {/* Email */}
        <div className="grid gap-2 lg:grid-cols-4 lg:items-center lg:gap-6">
          <label className="text-[13px] font-black uppercase tracking-widest text-slate-500 lg:text-right">
            Email
          </label>
          <div className="relative lg:col-span-3">
            <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="h-12 w-full rounded-xl border-slate-200 bg-slate-50/30 pl-10 transition-all focus:bg-white focus:ring-4 focus:ring-blue-100"
              placeholder="example@gmail.com"
            />
          </div>
        </div>

        {/* Gender */}
        <div className="grid gap-2 lg:grid-cols-4 lg:items-center lg:gap-6">
          <label className="text-[13px] font-black uppercase tracking-widest text-slate-500 lg:text-right">
            Giới tính
          </label>
          <div className="flex items-center gap-8 lg:col-span-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, gender: "Nam" })}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-6 py-2.5 transition-all",
                formData.gender === "Nam"
                  ? "border-blue-600 bg-blue-50 text-blue-600 shadow-sm"
                  : "border-slate-100 bg-slate-50/50 text-slate-500 hover:border-slate-200"
              )}
            >
              <div className={cn(
                "h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all",
                formData.gender === "Nam" ? "border-blue-600" : "border-slate-300"
              )}>
                {formData.gender === "Nam" && <div className="h-2 w-2 rounded-full bg-blue-600" />}
              </div>
              <span className="text-sm font-bold">Nam</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, gender: "Nữ" })}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-6 py-2.5 transition-all",
                formData.gender === "Nữ"
                  ? "border-pink-500 bg-pink-50 text-pink-500 shadow-sm"
                  : "border-slate-100 bg-slate-50/50 text-slate-500 hover:border-slate-200"
              )}
            >
              <div className={cn(
                "h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all",
                formData.gender === "Nữ" ? "border-pink-500" : "border-slate-300"
              )}>
                {formData.gender === "Nữ" && <div className="h-2 w-2 rounded-full bg-pink-500" />}
              </div>
              <span className="text-sm font-bold">Nữ</span>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex lg:pl-44">
          <Button
            onClick={handleSave}
            className="group h-12 w-full rounded-2xl bg-blue-600 px-8 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-blue-100 transition-all hover:bg-blue-700 hover:shadow-blue-200 active:scale-95 sm:w-auto"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Lưu thay đổi
          </Button>
        </div>
      </div>
    </div>
  );
};
