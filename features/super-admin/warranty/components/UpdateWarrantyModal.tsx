"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { updateWarrantyStatusAdmin } from "@/lib/warrantyApi";
import { toast } from "react-toastify";
import { ShieldAlert, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface UpdateWarrantyModalProps {
  isOpen: boolean;
  onClose: () => void;
  warranty: any;
  onSuccess: () => void;
}

const STATUS_OPTIONS = [
  { value: "APPROVED", label: "Tiếp nhận bảo hành" },
  { value: "UNDER_REPAIR", label: "Đang sửa chữa" },
  { value: "COMPLETED", label: "Đã sửa xong" },
  { value: "RETURNED", label: "Đã trả khách" },
  { value: "REJECTED", label: "Từ chối bảo hành" },
];

export function UpdateWarrantyModal({ isOpen, onClose, warranty, onSuccess }: UpdateWarrantyModalProps) {
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  // Sync status when warranty changes
  useEffect(() => {
    if (warranty) {
      setStatus(warranty.status || "");
    }
  }, [warranty]);

  if (!warranty) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateWarrantyStatusAdmin(warranty._id, { status, note });
      toast.success("Cập nhật trạng thái thành công");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] bg-white rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
        <div className="bg-slate-900 px-6 py-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ShieldAlert size={120} />
          </div>
          <DialogHeader className="relative z-10">
            <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-2">
              Cập nhật Bảo hành
            </DialogTitle>
            <p className="text-slate-400 text-sm font-medium mt-1">
              {warranty.productName} (SN: {warranty.serialNumber})
            </p>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-3">
            <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Trạng thái mới</Label>
            <div className="grid grid-cols-1 gap-2">
              <select 
                className="w-full h-12 rounded-xl border-none bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none transition-all hover:bg-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-50/50"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="">Chọn trạng thái tiếp theo</option>
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="note" className="text-[11px] font-black uppercase tracking-widest text-slate-400">Ghi chú tiến độ</Label>
            <div className="relative group">
              <textarea 
                id="note" 
                placeholder="VD: Đã thay linh kiện mới, đang test máy trước khi trả..." 
                value={note} 
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
                className="flex min-h-[120px] w-full rounded-2xl border-none bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:bg-white focus:ring-2 focus:ring-blue-50/50"
              />
              <p className="mt-2 text-[10px] font-bold text-blue-500/60 uppercase tracking-tight italic">
                * Ghi chú này sẽ được gửi thông báo cho khách hàng
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose}
              className="flex-1 h-12 rounded-2xl font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
            >
              Hủy bỏ
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="flex-[1.5] h-12 rounded-2xl bg-blue-600 font-black uppercase tracking-widest text-white shadow-lg shadow-blue-100 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang lưu...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send size={16} />
                  Xác nhận Cập nhật
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
