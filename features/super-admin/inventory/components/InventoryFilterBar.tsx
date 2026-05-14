import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { InventoryBranch } from "@/lib/api/inventoryApi";

export function InventoryFilterBar(props: {
  branch: InventoryBranch;
  onBranchChange: (v: InventoryBranch) => void;
  searchValue: string;
  onSearchChange: (v: string) => void;
}) {
  const { branch, onBranchChange, searchValue, onSearchChange } = props;

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 md:flex-row md:items-center justify-between">
      <div className="relative flex-1 group">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />
        <Input
          placeholder="Tìm SKU, Tên SP..."
          className="w-full max-w-lg rounded-xl border-none bg-slate-50 py-2.5 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-50/50 focus:shadow-sm"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3">
        <Select
          value={branch}
          onValueChange={(v) => onBranchChange(v as InventoryBranch)}
        >
          <SelectTrigger className="h-11 min-w-[220px] rounded-xl border-none bg-slate-50 px-4 text-[11px] font-black uppercase tracking-wider text-slate-600 outline-none transition-all hover:bg-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-50/50">
            <SelectValue placeholder="Chọn kho" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-100 shadow-xl">
            <SelectItem value="all" className="text-xs font-bold uppercase tracking-tight">Kho: Tất cả chi nhánh</SelectItem>
            <SelectItem value="q5" className="text-xs font-bold uppercase tracking-tight">Chi nhánh Quận 5</SelectItem>
            <SelectItem value="q1" className="text-xs font-bold uppercase tracking-tight">Chi nhánh Quận 1</SelectItem>
            <SelectItem value="q10" className="text-xs font-bold uppercase tracking-tight">Chi nhánh Quận 10</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
