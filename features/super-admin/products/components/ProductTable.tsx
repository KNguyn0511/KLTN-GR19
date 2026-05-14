// features/super-admin/products/components/ProductTable.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Lock, Unlock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Product,
  CategoryOption,
  extractSpecs,
  getCategories,
  toggleProductVisibility,
  updateProduct,
} from "@/lib/api/productApi";

interface ProductTableProps {
  data: Product[];
  isLoading: boolean;
  onRefresh: () => Promise<void> | void;
}

type EditFormState = {
  name: string;
  sku: string;
  brand: string;
  price: number;
  category: string;
  description: string;
};

const toCategoryId = (category: Product["category"]): string => {
  if (!category) return "";
  if (typeof category === "string") return category;
  return category._id || "";
};

export function ProductTable({ data, isLoading, onRefresh }: ProductTableProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isToggling, setIsToggling] = useState<string | null>(null);
  const [form, setForm] = useState<EditFormState>({
    name: "",
    sku: "",
    brand: "",
    price: 0,
    category: "",
    description: "",
  });

  const selectedProductId = selectedProduct?._id || "";

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const rows = await getCategories();
        setCategories(rows);
      } catch (error) {
        console.warn("Không thể tải danh mục sản phẩm:", error);
      }
    };
    loadCategories();
  }, []);

  const canSubmit = useMemo(() => {
    return (
      form.name.trim().length > 0 &&
      form.sku.trim().length > 0 &&
      Number.isFinite(Number(form.price)) &&
      Number(form.price) >= 0 &&
      form.category.trim().length > 0
    );
  }, [form]);

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setForm({
      name: product.name || "",
      sku: product.sku || "",
      brand: product.brand || "",
      price: Number(product.price) || 0,
      category: toCategoryId(product.category),
      description: product.description || "",
    });
    setIsEditOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!selectedProductId || !canSubmit) return;
    setIsSubmitting(true);
    try {
      await updateProduct(selectedProductId, {
        name: form.name.trim(),
        sku: form.sku.trim(),
        brand: form.brand.trim(),
        price: Number(form.price),
        category: form.category,
        description: form.description,
      });
      setIsEditOpen(false);
      setSelectedProduct(null);
      await onRefresh();
    } catch (error) {
      console.warn("Cập nhật sản phẩm thất bại:", error);
      alert("Không thể lưu thay đổi sản phẩm.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleVisibility = async (product: Product) => {
    const id = product._id;
    if (!id) return;
    const nextActive = !(product.isActive ?? true);
    const confirmMsg = nextActive
      ? "Bạn muốn hiện lại sản phẩm này?"
      : "Ẩn sản phẩm này khỏi Storefront?";
    if (!window.confirm(confirmMsg)) return;

    setIsToggling(id);
    try {
      await toggleProductVisibility(id, nextActive);
      await onRefresh();
    } catch (error) {
      console.warn("Cập nhật trạng thái sản phẩm thất bại:", error);
      alert("Không thể cập nhật trạng thái sản phẩm.");
    } finally {
      setIsToggling(null);
    }
  };

  return (
    <>
      <div className="relative min-h-[400px] rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50 text-[11px] font-black tracking-widest text-slate-400 uppercase">
                <th className="px-0 w-1"></th>
                <th className="px-6 py-5">SẢN PHẨM</th>
                <th className="px-6 py-5">DANH MỤC</th>
                <th className="px-6 py-5">GIÁ BÁN</th>
                <th className="px-6 py-5">TỒN KHO</th>
                <th className="px-6 py-5">THÔNG SỐ (AI)</th>
                <th className="px-6 py-5 text-right">HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.length === 0 && !isLoading ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="h-10 w-10 text-slate-200" />
                      <p className="text-sm font-medium text-slate-400">Không tìm thấy sản phẩm nào</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((product) => {
                  const specsString = extractSpecs(
                    product.specifications,
                    product.brand,
                  );
                  const badges =
                    specsString !== product.brand ? specsString.split(" / ") : [];
                  const isActive = product.isActive ?? true;

                  return (
                    <tr
                      key={product._id}
                      className={cn(
                        "group transition-all duration-300 hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:z-10 relative",
                        !isActive && "bg-slate-50/80 opacity-70",
                      )}
                    >
                      <td className="px-0 w-1 relative">
                        <div className="absolute inset-y-2 left-0 w-1 bg-blue-600 rounded-r-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-full group-hover:translate-x-0" />
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-slate-50 shadow-sm ring-1 ring-slate-100 group-hover:scale-110 transition-transform duration-300">
                            {product.images?.[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-300">
                                <Package className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="line-clamp-1 max-w-[200px] text-sm font-bold text-slate-800 transition-colors group-hover:text-blue-600">
                              {product.name}
                            </span>
                            <span className="text-[10px] font-black tracking-tight text-slate-400 uppercase">
                              SKU: {product.sku}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                          {(product.category as any)?.name || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm font-black text-slate-900">
                        {new Intl.NumberFormat("vi-VN").format(product.price || 0)}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            (product.totalStock || 0) > 10 ? "bg-emerald-500" : "bg-rose-500"
                          )} />
                          <span
                            className={cn(
                              "text-sm font-black",
                              (product.totalStock || 0) > 10
                                ? "text-slate-700"
                                : "text-rose-600",
                            )}
                          >
                            {product.totalStock}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-1">
                          {badges.slice(0, 3).map((badge, idx) => (
                            <span
                              key={idx}
                              className="rounded-md border border-slate-100 bg-white px-2 py-0.5 text-[10px] font-bold text-slate-500 shadow-sm"
                            >
                              {badge}
                            </span>
                          ))}
                          {badges.length > 3 && (
                            <span className="text-[10px] font-bold text-slate-400">+{badges.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditModal(product)}
                            className="h-8 w-8 rounded-lg text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600"
                            title="Chỉnh sửa sản phẩm"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleVisibility(product)}
                            disabled={isToggling === product._id}
                            className={cn(
                              "h-8 w-8 rounded-lg transition-all",
                              isActive
                                ? "text-slate-400 hover:bg-amber-50 hover:text-amber-600"
                                : "text-rose-500 hover:bg-emerald-50 hover:text-emerald-600",
                            )}
                            title={isActive ? "Ẩn sản phẩm" : "Hiện sản phẩm"}
                          >
                            {isToggling === product._id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : isActive ? (
                              <Lock className="h-3.5 w-3.5" />
                            ) : (
                              <Unlock className="h-3.5 w-3.5" />
                            )}
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
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <label className="text-sm font-medium text-slate-700">Tên sản phẩm</label>
              <Input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <label className="text-sm font-medium text-slate-700">SKU</label>
                <Input
                  value={form.sku}
                  onChange={(e) => setForm((prev) => ({ ...prev, sku: e.target.value }))}
                />
              </div>
              <div className="grid gap-1.5">
                <label className="text-sm font-medium text-slate-700">Giá bán</label>
                <Input
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, price: Number(e.target.value) || 0 }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <label className="text-sm font-medium text-slate-700">Thương hiệu</label>
                <Input
                  value={form.brand}
                  onChange={(e) => setForm((prev) => ({ ...prev, brand: e.target.value }))}
                />
              </div>
              <div className="grid gap-1.5">
                <label className="text-sm font-medium text-slate-700">Danh mục</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-1.5">
              <label className="text-sm font-medium text-slate-700">Mô tả</label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                rows={3}
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditOpen(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button onClick={handleSaveProduct} disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
