import axiosInstance from "@/lib/axios";

export const fetchDashboardProducts = async (
  page: number,
): Promise<{
  products: {
    imageUrl: string | null;
    createdAt: Date;
    description: string | null;
    title: string;
    status: "public" | "private";
    priceInCents: number | null;
    owner: {
      name: string | null;
    };
  }[];
  totalProducts: number;
  totalPages: number;
}> => {
  const response = await axiosInstance.get(
    `/dashboard/products?page=${page || 1}`,
  );
  return response.data;
};
export const fetchDashboardUsers = async (
  page: number,
): Promise<{
  users: {
    name: string | null;
    id: string;
    email: string;
    role: "user" | "admin";
    imageUrl: string | null;
    createdAt: Date;
  }[];
  totalUsers: number;
  totalPages: number;
}> => {
  const response = await axiosInstance.get(
    `/dashboard/users?page=${page || 1}`,
  );
  return response.data;
};
