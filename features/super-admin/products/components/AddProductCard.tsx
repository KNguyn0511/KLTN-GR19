import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export function AddProductCard() {
  return (
    <Link href="/super-admin/products/create" className="h-full w-full outline-none">
      <Card className="group relative flex h-full min-h-25 cursor-pointer items-center justify-center overflow-hidden border-none bg-blue-600 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl active:scale-95">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <CardContent className="relative flex flex-col items-center justify-center p-0 text-white">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 group-hover:scale-110 transition-transform">
            <span className="text-xl font-light">+</span>
          </div>
          <span className="text-xs font-black tracking-widest uppercase">
            Thêm sản phẩm
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
