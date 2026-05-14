import axiosInstance from "../axiosInstance";

export interface Promotion {
  _id: string;
  code: string;
  description: string;
  discountType: "Percentage" | "Fixed";
  discountValue: number;
  minOrderValue: number;
  maxDiscount: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

// Hàm lấy tất cả danh sách khuyến mãi
export const getPromotions = async (): Promise<Promotion[]> => {
  const response = await axiosInstance.get("/promotions");
  
  // Xử lý trường hợp backend trả về { Data: [...], Count: X } hoặc mảng trực tiếp
  if (response.data && response.data.Data) {
    return response.data.Data;
  }
  
  return response.data || [];
};
