import axiosInstance from "@/lib/axios";

export const fetchCustomerCategories = async (): Promise<
  {
    id: string;
    name: string;
    createdAt: Date;
  }[]
> => {
  const response = await axiosInstance.get(`/categories`);
  return response.data;
};
