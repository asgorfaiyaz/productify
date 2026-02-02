import axiosInstance from "@/lib/axios";

export const createCheckout = async (productIds: string[]): Promise<string> => {
  const res = await axiosInstance.post(`/stripe/checkout`, {
    productIds,
  });
  return res.data.url;
};
