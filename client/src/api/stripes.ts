import axiosInstance from "@/lib/axios";

export const createCheckout = async (
  products: { id: string; quantity: number }[],
): Promise<string> => {
  const res = await axiosInstance.post(`/purchases/checkout`, {
    products,
  });
  return res.data.url;
};
