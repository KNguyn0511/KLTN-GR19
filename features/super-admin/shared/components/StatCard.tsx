import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  trend?: "up" | "down" | "none";
  trendText?: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  valueColor?: string;
}

export function StatCard({
  title,
  value,
  trend,
  trendText,
  icon,
  iconBgColor,
  iconColor,
  valueColor = "text-slate-900",
}: StatCardProps) {
  return (
    <Card className="group relative overflow-hidden border-none bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-50/50" />
      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-bold tracking-wider text-slate-500 uppercase">
          {title}
        </CardTitle>
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl shadow-inner transition-transform duration-500 group-hover:rotate-12",
            iconBgColor,
            iconColor
          )}
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className={cn("text-3xl font-black tracking-tight", valueColor)}>
          {value}
        </div>
        {trendText && (
          <div className="mt-3 flex items-center gap-1.5">
            {trend === "up" && (
              <div className="flex items-center rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-bold text-green-600">
                <ArrowUp className="mr-0.5 h-3 w-3" />
                {trendText}
              </div>
            )}
            {trend === "down" && (
              <div className="flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-600">
                <ArrowDown className="mr-0.5 h-3 w-3" />
                {trendText}
              </div>
            )}
            {trend === "none" && (
              <div className="rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                {trendText}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
