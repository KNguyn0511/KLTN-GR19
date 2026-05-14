import axiosInstance from "./axiosInstance";

export const getEligibleProducts = async () => {
  const res = await axiosInstance.get("/warranty/eligible-products");
  return res.data;
};

export const getMyWarranties = async () => {
  const res = await axiosInstance.get("/warranty/my");
  return res.data;
};

export const requestWarranty = async (data: {
  orderId: string;
  productId: string;
  productName: string;
  serialNumber: string;
  reason: string;
}) => {
  const res = await axiosInstance.post("/warranty/request", data);
  return res.data;
};

export const getAllWarrantiesAdmin = async () => {
  const res = await axiosInstance.get("/warranty/admin");
  return res.data;
};

export const updateWarrantyStatusAdmin = async (id: string, data: { status: string; note?: string }) => {
  const res = await axiosInstance.patch(`/warranty/${id}/status`, data);
  return res.data;
};
