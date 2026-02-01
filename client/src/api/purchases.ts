import axiosInstance from "@/lib/axios";

export const createOrder = async (productId: string) => {
  const res = await axiosInstance.post(`/purchases/${productId}`);
  return res.data;
};

export const getSalesDataByUserId = async (): Promise<{
  totalSales: number;
  totalSalesAmount: number;
  averageSaleValue: number;
}> => {
  const res = await axiosInstance.get("/purchases");
  return res.data;
};
