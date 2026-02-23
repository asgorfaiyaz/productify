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
export const fetchDashboardOverviewData = async (): Promise<{
  totalSales: number;
  totalRevenue: number;
  avgSales: number;
  totalProducts: number;
  totalPublicProducts: number;
  totalPrivateProducts: number;
}> => {
  const response = await axiosInstance.get(`/dashboard/overview`);
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
export const fetchDashboardCategories = async (
  page: number,
): Promise<{
  categories: {
    id: string;
    name: string;
    createdAt: Date;
  }[];
  totalCategories: number;
  totalPages: number;
}> => {
  const response = await axiosInstance.get(
    `/dashboard/categories?page=${page || 1}`,
  );
  return response.data;
};
export const createCategory = async (data: {
  name: string;
}): Promise<{
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}> => {
  const response = await axiosInstance.post("/dashboard/categories", data);
  return response.data;
};

export const fetchDashboardSales = async (
  page: number,
): Promise<{
  sales: {
    id: string;
    createdAt: Date;
    totalAmount: number;
    isPaid: boolean | null;
    owner: {
      id: string;
      name: string | null;
      imageUrl: string | null;
    };
    items: {
      id: string;
      priceInCents: number;
      quantity: number;
    }[];
  }[];
  totalSales: number;
  totalPages: number;
}> => {
  const response = await axiosInstance.get(
    `/dashboard/sales?page=${page || 1}`,
  );
  return response.data;
};
// accepts either a preset string OR a custom from/to range
export type SalesByDateParams =
  | { preset: string; from?: never; to?: never }
  | { preset?: never; from: string; to: string };

export const fetchDashboardSalesByDate = async (
  params: SalesByDateParams = { preset: "last_7_days" },
): Promise<{ date: string; totalOrders: number; totalRevenue: number }[]> => {
  const response = await axiosInstance.get(`/dashboard/sales/by-date`, {
    params, // axios serializes this to ?preset=last_7_days or ?from=...&to=...
  });
  return response.data.data; // ← your API returns { data: [...] }
};
export const createUser = async (data: {
  firstName: string;
  lastName: string;
  email: string;
}): Promise<{
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: Date;
}> => {
  const response = await axiosInstance.post("/dashboard/users", data);
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await axiosInstance.delete(`/dashboard/users/${id}`);
  return response.data;
};
