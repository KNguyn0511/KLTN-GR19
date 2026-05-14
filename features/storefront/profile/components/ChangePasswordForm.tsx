"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Key, Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const ChangePasswordForm = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError("Vui lòng điền đầy đủ các trường.");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setIsLoading(true);
    // Simulating API call
    setTimeout(() => {
      setSuccess(true);
      setIsLoading(false);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }, 1000);
  };

  return (
    <div className="flex w-full flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-10">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Đổi Mật Khẩu</h1>
          <p className="text-sm font-medium text-slate-400">
            Nâng cao tính bảo mật cho tài khoản của bạn
          </p>
        </div>
        <div className="hidden h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 md:flex">
          <ShieldCheck className="h-5 w-5" />
        </div>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-8">
          
          {/* Current Password */}
          <div className="grid gap-2 lg:grid-cols-3 lg:items-center lg:gap-6">
            <label className="text-[13px] font-black uppercase tracking-widest text-slate-500 lg:text-right">
              Mật khẩu cũ
            </label>
            <div className="relative lg:col-span-2">
              <Key className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type={showCurrent ? "text" : "password"}
                placeholder="Nhập mật khẩu hiện tại"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                className="h-12 w-full rounded-xl border-slate-200 bg-slate-50/30 pl-10 pr-10 transition-all focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="grid gap-2 lg:grid-cols-3 lg:items-center lg:gap-6">
            <label className="text-[13px] font-black uppercase tracking-widest text-slate-500 lg:text-right">
              Mật khẩu mới
            </label>
            <div className="relative lg:col-span-2">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type={showNew ? "text" : "password"}
                placeholder="Nhập mật khẩu mới"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="h-12 w-full rounded-xl border-slate-200 bg-slate-50/30 pl-10 pr-10 transition-all focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="grid gap-2 lg:grid-cols-3 lg:items-center lg:gap-6">
            <label className="text-[13px] font-black uppercase tracking-widest text-slate-500 lg:text-right">
              Xác nhận lại
            </label>
            <div className="relative lg:col-span-2">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type={showConfirm ? "text" : "password"}
                placeholder="Nhập lại mật khẩu mới"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="h-12 w-full rounded-xl border-slate-200 bg-slate-50/30 pl-10 pr-10 transition-all focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Messages */}
          {(error || success) && (
            <div className="grid lg:grid-cols-3">
              <div className="hidden lg:block" />
              <div className="lg:col-span-2">
                {error && (
                  <div className="flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-500">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}
                {success && (
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                    Đổi mật khẩu thành công!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="mt-4 grid lg:grid-cols-3">
            <div className="hidden lg:block" />
            <div className="flex flex-col gap-4 lg:col-span-2">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="group h-12 w-full rounded-2xl bg-slate-900 px-8 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-slate-100 transition-all hover:bg-blue-600 hover:shadow-blue-200 active:scale-95 sm:w-auto"
              >
                {isLoading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
              </Button>
              <button type="button" className="text-left text-[12px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors">
                Quên mật khẩu?
              </button>
            </div>
          </div>

        </form>

        {/* Security Tips */}
        <div className="hidden w-64 flex-col gap-6 rounded-2xl bg-slate-50/50 p-6 lg:flex">
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Lời khuyên bảo mật</span>
          <ul className="flex flex-col gap-4">
            <li className="flex items-start gap-3">
              <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
              <p className="text-[13px] font-medium leading-relaxed text-slate-600">Sử dụng ít nhất 8 ký tự, bao gồm chữ cái và số.</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
              <p className="text-[13px] font-medium leading-relaxed text-slate-600">Tránh sử dụng thông tin dễ đoán như ngày sinh.</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
              <p className="text-[13px] font-medium leading-relaxed text-slate-600">Thay đổi mật khẩu định kỳ 3-6 tháng một lần.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
