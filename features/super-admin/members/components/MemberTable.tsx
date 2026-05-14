"use client";

import { Star, Circle, Loader2, Users } from "lucide-react";
import Link from "next/link";
import { Member } from "@/lib/api/memberApi";

interface MemberTableProps {
  data: Member[];
  isLoading: boolean;
  children?: React.ReactNode;
}

const formatCurrency = (value: unknown): string => {
  const numericValue = Number(value);
  const safeValue = Number.isFinite(numericValue) ? numericValue : 0;
  return `${new Intl.NumberFormat("vi-VN").format(safeValue)}đ`;
};

export function MemberTable({ data, isLoading, children }: MemberTableProps) {
  return (
    <div className="relative min-h-[400px] overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
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
              <th className="px-6 py-5">MÃ KH</th>
              <th className="px-6 py-5">HỌ VÀ TÊN</th>
              <th className="px-6 py-5">SỐ ĐIỆN THOẠI</th>
              <th className="px-6 py-5">HẠNG THẺ</th>
              <th className="px-6 py-5">TỔNG CHI TIÊU</th>
              <th className="px-6 py-5">NGÀY GIA NHẬP</th>
              <th className="px-6 py-5 text-right">HÀNH ĐỘNG</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.length === 0 && !isLoading ? (
              <tr>
                <td colSpan={8} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Users className="h-10 w-10 text-slate-200" />
                    <p className="text-sm font-medium text-slate-400">Không tìm thấy khách hàng nào</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((member) => (
                <tr
                  key={member._id}
                  className="group transition-all duration-300 hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:z-10 relative"
                >
                  <td className="px-0 w-1 relative">
                    <div className="absolute inset-y-2 left-0 w-1 bg-blue-600 rounded-r-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-full group-hover:translate-x-0" />
                  </td>
                  <td className="px-6 py-5">
                    <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-black text-blue-600 ring-1 ring-blue-100">
                      {member.memberCode || `#MEM-${member._id.slice(-5).toUpperCase()}`}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {member.fullName}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">{member.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-slate-600">
                    {member.phone || "—"}
                  </td>

                  <td className="px-6 py-5">
                    {member.tier === "Platinum" && (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-purple-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-purple-600 ring-1 ring-purple-100">
                        <Star className="h-3 w-3 fill-purple-600" /> Platinum
                      </span>
                    )}
                    {member.tier === "Gold" && (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-amber-600 ring-1 ring-amber-100">
                        <Star className="h-3 w-3 fill-amber-600" /> Gold
                      </span>
                    )}
                    {member.tier === "Silver" && (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-blue-600 ring-1 ring-blue-100">
                        <Circle className="h-2 w-2 fill-blue-600" /> Silver
                      </span>
                    )}
                    {(member.tier === "Member" || !member.tier) && (
                      <span className="inline-flex items-center rounded-lg bg-slate-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500 ring-1 ring-slate-100">
                        Member
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-5 text-sm font-black text-slate-900">
                    {formatCurrency(member.totalSpent)}
                  </td>

                  <td className="px-6 py-5 text-xs font-bold text-slate-400">
                    {new Date(member.createdAt).toLocaleDateString("vi-VN")}
                  </td>

                  <td className="px-6 py-5 text-right">
                    <Link
                      href={`/super-admin/members/${member._id}`}
                      className="inline-flex h-8 items-center justify-center rounded-xl bg-slate-50 px-4 text-[10px] font-black uppercase tracking-widest text-slate-600 ring-1 ring-slate-100 transition-all hover:bg-blue-600 hover:text-white hover:ring-blue-600 hover:shadow-lg hover:shadow-blue-100 active:scale-95 opacity-0 group-hover:opacity-100"
                    >
                      Chi tiết
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {children}
    </div>
  );
}
