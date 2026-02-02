import axiosInstance from "@/lib/axios";

export const createCheckout = async (
  products: { id: string; quantity: number }[],
): Promise<string> => {
  const res = await axiosInstance.post(`/stripe/checkout`, {
    products,
  });
  return res.data.url;
};
