"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RevenueChartWeek } from "@/lib/api/dashboardApi";

type Row = RevenueChartWeek & { name: string };

export function DashboardChart({
  weeks,
}: {
  weeks: RevenueChartWeek[];
}) {
  const data: Row[] = (weeks.length ? weeks : []).map((w) => ({
    ...w,
    name: w.label,
  }));

  const fallback: Row[] = [
    { name: "Tuần 1", label: "Tuần 1", online: 0, offline: 0 },
    { name: "Tuần 2", label: "Tuần 2", online: 0, offline: 0 },
    { name: "Tuần 3", label: "Tuần 3", online: 0, offline: 0 },
    { name: "Tuần 4", label: "Tuần 4", online: 0, offline: 0 },
  ];

  const chartData = data.length ? data : fallback;

  return (
    <Card className="col-span-1 border-none bg-white shadow-sm transition-all hover:shadow-md md:col-span-2 lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-lg font-bold text-slate-800">
            Biểu đồ doanh thu
          </CardTitle>
          <p className="text-xs text-slate-500">So sánh doanh thu Online và Offline</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Online</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-slate-800" />
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Offline</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barGap={12} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                hide={false}
              />
              <Tooltip
                cursor={{ fill: "#f1f5f9", radius: 8 }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-xl border-none bg-white p-4 shadow-2xl ring-1 ring-slate-100">
                        <p className="mb-2 text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</p>
                        <div className="flex flex-col gap-2">
                          {payload.map((entry: any, index: number) => (
                            <div key={index} className="flex items-center justify-between gap-8">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.fill }} />
                                <span className="text-sm font-medium text-slate-600">{entry.name}</span>
                              </div>
                              <span className="text-sm font-bold text-slate-900">
                                {Number(entry.value).toLocaleString("vi-VN")} đ
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="online"
                name="Online"
                fill="#3b82f6"
                radius={[6, 6, 0, 0]}
                barSize={24}
                animationDuration={1500}
              />
              <Bar
                dataKey="offline"
                name="Offline"
                fill="#1e293b"
                radius={[6, 6, 0, 0]}
                barSize={24}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
