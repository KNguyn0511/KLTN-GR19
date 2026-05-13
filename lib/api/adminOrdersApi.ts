import axiosInstance from "@/lib/axiosInstance";

export type AdminOrderTab = "all" | "pending" | "processing" | "completed";
export type AdminOrderChannel = "all" | "ONLINE" | "O2O";
export type AdminOrderDate = "all" | "today" | "week" | "month";

export interface AdminOrderStats {
  pendingOnline: number;
  packing: number;
  shipping: number;
  cancelled: number;
}

export interface AdminOrderRow {
  _id: string;
  orderCode: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  channel: "ONLINE" | "O2O";
  status: string;
  items?: Array<{
    product?: string;
    productName: string;
    quantity: number;
    variant: string;
    price: number;
    serialNumbers?: string[];
    availableSerials?: string[];
  }>;
  voucherCode?: string | null;
  discountAmount?: number;
  shippingFee?: number;
  shippingInfo?: {
    carrier: string;
    trackingNumber: string;
    shippedAt: string;
  } | null;
  customerInfo?: {
    fullName?: string;
    phone?: string;
    email?: string;
    city?: string;
    district?: string;
    ward?: string;
    addressDetail?: string;
    paymentMethod?: string;
  } | null;
}

export interface AdminOrdersResponse {
  stats: AdminOrderStats;
  orders: AdminOrderRow[];
}

export async function fetchAdminOrders(params: {
  tab: AdminOrderTab;
  channel: AdminOrderChannel;
  date: AdminOrderDate;
  q?: string;
}): Promise<AdminOrdersResponse> {
  const { data } = await axiosInstance.get<AdminOrdersResponse>("/orders/admin", {
    params: {
      tab: params.tab,
      channel: params.channel,
      date: params.date,
      q: params.q?.trim() || undefined,
    },
  });
  return data;
}

export async function patchOrderStatus(
  orderId: string,
  status: string,
): Promise<AdminOrderRow> {
  const { data } = await axiosInstance.patch<AdminOrderRow>(
    `/orders/${orderId}/status`,
    { status },
  );
  return data;
}

export async function confirmOrder(orderId: string): Promise<AdminOrderRow> {
  const { data } = await axiosInstance.patch<AdminOrderRow>(
    `/orders/${orderId}/confirm`
  );
  return data;
}

export async function packOrder(orderId: string, items: { productId: string, serialNumbers: string[] }[]): Promise<any> {
  const { data } = await axiosInstance.post("/sales/pack-order", { orderId, items });
  return data;
}

export async function shipOrder(orderId: string, carrier: string): Promise<any> {
  const { data } = await axiosInstance.post("/sales/ship-order", { orderId, carrier });
  return data;
}

export async function completeOrder(orderId: string, force = false): Promise<any> {
  const { data } = await axiosInstance.post("/sales/complete-order", { orderId, force });
  return data;
}

export async function syncAllOrders(): Promise<any> {
  const { data } = await axiosInstance.post("/sales/sync-all-orders");
  return data;
}
