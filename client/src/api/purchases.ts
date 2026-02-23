import axiosInstance from "@/lib/axios";

export const createOrder = async (productId: string) => {
  const res = await axiosInstance.post(`/purchases/${productId}`);
  return res.data;
};

export const getSalesDataByUserId = async (): Promise<
  {
    id: string;
    totalAmount: number;
    isPaid: boolean | null;
    createdAt: Date;
    items: {
      priceInCents: number;
      quantity: number;
      product: {
        imageUrl: string | null;
        description: string | null;
        title: string;
      };
    }[];
  }[]
> => {
  const res = await axiosInstance.get(`/purchases/user`);
  return res.data;
};
