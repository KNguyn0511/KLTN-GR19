import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { TopProductRow } from "@/lib/api/dashboardApi";

export function TopProducts({ products }: { products: TopProductRow[] }) {
  const maxSold = products.length > 0 ? Math.max(...products.map((p) => p.soldQuantity)) : 0;

  return (
    <Card className="col-span-1 border-none bg-white shadow-sm transition-all hover:shadow-md md:col-span-1 lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-800">Top Sản phẩm</CardTitle>
        <p className="text-xs text-slate-500">Sản phẩm bán chạy nhất tháng</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          {products.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center rounded-xl bg-slate-50 text-center">
              <p className="text-sm font-medium text-slate-500">Chưa có dữ liệu</p>
            </div>
          ) : (
            products.map((product, index) => {
              const percentage = maxSold > 0 ? (product.soldQuantity / maxSold) * 100 : 0;
              return (
                <div key={product.productId ?? `tp-${product.rank}`} className="group relative">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black",
                        index === 0 ? "bg-amber-100 text-amber-600 ring-2 ring-amber-50" :
                        index === 1 ? "bg-slate-100 text-slate-600 ring-2 ring-slate-50" :
                        index === 2 ? "bg-orange-100 text-orange-600 ring-2 ring-orange-50" :
                        "bg-slate-50 text-slate-400"
                      )}>
                        {product.rank}
                      </div>
                      <span className="max-w-[140px] truncate text-sm font-bold text-slate-700 transition-colors group-hover:text-blue-600">
                        {product.name}
                      </span>
                    </div>
                    <span className="text-xs font-black text-slate-900">
                      {product.soldQuantity}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-1000 ease-out",
                        index === 0 ? "bg-blue-500" : "bg-slate-400"
                      )}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
