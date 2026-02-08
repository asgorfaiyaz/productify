import axiosInstance from "../lib/axios";

export const createProduct = async ({
  title,
  description,
  imageUrl,
  price,
  status,
  categoryIds,
}: {
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  status: "public" | "private";
  categoryIds: string[];
}) => {
  const response = await axiosInstance.post("/products", {
    title,
    description,
    imageUrl,
    price,
    status,
    categories: categoryIds,
  });
  return response.data;
};
export const updateProduct = async ({
  productId,
  productData,
}: {
  productId: string;
  productData: {
    title?: string;
    description?: string;
    imageUrl?: string;
    price?: number;
    status?: "public" | "private";
  };
}) => {
  const response = await axiosInstance.put(
    `/products/${productId}`,
    productData,
  );
  return response.data;
};

export const fetchProducts = async (
  page: number,
): Promise<{
  products: {
    title: string;
    description: string;
    imageUrl: string;
    priceInCents: number;
    status: "public" | "private";
    owner: {
      name: string;
      imageUrl: string;
    };
    comments: { id: string }[];
    createdAt: string;
    id: string;
  }[];
  totalProducts: number;
  totalPages: number;
}> => {
  const response = await axiosInstance.get(`/products?page=${page || 1}`);
  return response.data;
};
export const fetchMyProducts = async () => {
  const response = await axiosInstance.get("/products/me");

  // if backend returns null, undefined, or object with products
  const productsArray = Array.isArray(response.data) ? response.data : [];

  return productsArray as {
    title: string;
    description: string;
    imageUrl: string;
    owner: {
      name: string;
      imageUrl: string;
    };
    comments: { id: string }[];
    createdAt: string;
    id: string;
    priceInCents: number;
    status: "public" | "private";
  }[];
};

export const fetchProduct = async (id: string) => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data as {
    createdAt: string;
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    priceInCents: number;
    status: "public" | "private";
    owner: {
      id: string;
      name: string;
      imageUrl: string;
      clerkId: string;
    };
    comments: {
      id: string;
      createdAt: string;
      content: string;
      owner: { id: string; name: string; imageUrl: string };
    }[];
    categories: { id: string; name: string }[];
  };
};
export const deleteProduct = async (id: string) => {
  return await axiosInstance.delete(`/products/${id}`);
};
