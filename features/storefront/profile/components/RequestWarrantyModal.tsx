"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestWarranty } from "@/lib/warrantyApi";
import { toast } from "react-toastify";

interface RequestWarrantyModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    orderId: string;
    productId: string;
    productName: string;
    serialNumbers?: string[];
  } | null;
  onSuccess: () => void;
}

export function RequestWarrantyModal({ isOpen, onClose, product, onSuccess }: RequestWarrantyModalProps) {
  const [reason, setReason] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [loading, setLoading] = useState(false);

  if (!product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason || !serialNumber) {
      toast.error("Vui lòng nhập đầy đủ lý do và số Serial");
      return;
    }

    try {
      setLoading(true);
      await requestWarranty({
        orderId: product.orderId,
        productId: product.productId,
        productName: product.productName,
        serialNumber: serialNumber,
        reason: reason,
      });
      toast.success("Gửi yêu cầu bảo hành thành công!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Gửi yêu cầu thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary">Yêu cầu bảo hành</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Sản phẩm</Label>
            <Input value={product.productName} disabled className="bg-gray-50" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="serial">Số Serial / IMEI</Label>
            {product.serialNumbers && product.serialNumbers.length > 0 ? (
              <select 
                className="w-full p-2 border rounded-md"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                required
              >
                <option value="">Chọn số Serial</option>
                {product.serialNumbers.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            ) : (
              <Input 
                id="serial" 
                placeholder="Nhập số Serial trên tem sản phẩm" 
                value={serialNumber} 
                onChange={(e) => setSerialNumber(e.target.value)}
                required
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Lý do bảo hành / Mô tả lỗi</Label>
            <textarea 
              id="reason" 
              placeholder="Mô tả chi tiết lỗi bạn gặp phải..." 
              value={reason} 
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
              className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
            <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-white">
              {loading ? "Đang gửi..." : "Gửi yêu cầu"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
