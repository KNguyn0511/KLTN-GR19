import { Button } from "@/components/ui/button";
import { Import, ClipboardCheck } from "lucide-react";

export function InventoryHeader(props: {
  onImport: () => void;
  onAudit: () => void;
}) {
  const { onImport, onAudit } = props;

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-100">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          Quản lý Kho hàng
        </h1>
        <p className="text-sm font-medium text-slate-500">
          Theo dõi tồn kho, nhập hàng và kiểm kê toàn hệ thống chi nhánh
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          className="group flex items-center gap-2 rounded-2xl bg-white border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
          onClick={onImport}
        >
          <Import className="h-3.5 w-3.5 text-blue-600 transition-transform group-hover:-translate-y-0.5" />
          Nhập kho
        </Button>
        <Button
          type="button"
          className="group flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-slate-200 transition-all hover:bg-slate-800 active:scale-95"
          onClick={onAudit}
        >
          <ClipboardCheck className="h-3.5 w-3.5 text-amber-400" />
          Kiểm kê
        </Button>
      </div>
    </div>
  );
}
