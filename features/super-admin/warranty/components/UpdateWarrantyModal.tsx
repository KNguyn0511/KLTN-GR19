"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { updateWarrantyStatusAdmin } from "@/lib/warrantyApi";
import { toast } from "react-toastify";

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
  const [status, setStatus] = useState(warranty?.status || "");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

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
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Cập nhật bảo hành</DialogTitle>
          <p className="text-sm text-gray-500">{warranty.productName}</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Trạng thái mới</Label>
            <select 
              className="w-full p-2 border rounded-md"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="">Chọn trạng thái</option>
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Ghi chú tiến độ (Gửi cho khách thấy)</Label>
            <textarea 
              id="note" 
              placeholder="VD: Đã thay linh kiện mới, đang test máy..." 
              value={note} 
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
              className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang lưu..." : "Cập nhật"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
