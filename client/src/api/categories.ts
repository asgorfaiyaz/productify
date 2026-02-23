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
export const fetchCategoriesByProductId = async (
  productId: string,
): Promise<
  {
    id: string;
    name: string;
    createdAt: Date;
  }[]
> => {
  const response = await axiosInstance.get(`/categories/${productId}`);
  return response.data;
};
