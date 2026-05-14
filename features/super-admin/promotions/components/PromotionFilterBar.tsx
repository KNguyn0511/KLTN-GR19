import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FilterBarProps {
  search: string;
  setSearch: (val: string) => void;
}

export function PromotionFilterBar({ search, setSearch }: FilterBarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 md:flex-row md:items-center justify-between">
      <div className="relative flex-1 group">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />
        <Input
          placeholder="Tìm theo mã code hoặc tên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-lg rounded-xl border-none bg-slate-50 py-2.5 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-50/50 focus:shadow-sm"
        />
      </div>
    </div>
  );
}