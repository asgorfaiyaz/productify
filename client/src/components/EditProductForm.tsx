import { useCategoriesByProductId } from "@/hooks/useCategories";
import { useDashboardCategories } from "@/hooks/useDashboards";
import {
  ArrowLeftIcon,
  ImageIcon,
  TypeIcon,
  FileTextIcon,
  SaveIcon,
  DollarSignIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router";

type ProductFormState = {
  title: string;
  description: string;
  imageUrl: string;
  price: number | "";
  status: "public" | "private";
  categoryIds: string[]; // ✅ Added
};

function EditProductForm({
  product,
  isPending,
  isError,
  error,
  onSubmit,
}: {
  product: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    priceInCents: number;
    status: "public" | "private";
  };
  isPending: boolean;
  isError: boolean;
  error: any;
  onSubmit: (data: {
    title: string;
    description: string;
    imageUrl: string;
    price: number | "";
    status: "public" | "private";
    categoryIds: string[]; // ✅ Added
  }) => void;
}) {
  const [formData, setFormData] = useState<ProductFormState>({
    title: product.title,
    description: product.description,
    imageUrl: product.imageUrl,
    price: product.priceInCents,
    status: product.status,
    categoryIds: [], // ✅ Added
  });

  // Get all available categories (dashboard categories)
  const { data: dashboardData, isLoading: isDashboardCategoriesLoading } =
    useDashboardCategories(1);

  // Get product's current categories
  const { data: productCategories, isLoading: isProductCategoriesLoading } =
    useCategoriesByProductId(product.id);

  // ✅ Initialize selected categories when product categories load
  useEffect(() => {
    if (productCategories && productCategories.length > 0) {
      const categoryIds = productCategories.map((cat) => cat.id);
      setFormData((prev) => ({ ...prev, categoryIds }));
    }
  }, [productCategories]);

  const toggleCategory = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(id)
        ? prev.categoryIds.filter((c) => c !== id)
        : [...prev.categoryIds, id],
    }));
  };

  const isLoading = isDashboardCategoriesLoading || isProductCategoriesLoading;

  return (
    <div className="max-w-lg mx-auto">
      <Link to="/profile" className="btn btn-ghost btn-sm gap-1 mb-4">
        <ArrowLeftIcon className="size-4" /> Back
      </Link>

      <div className="card bg-base-300">
        <div className="card-body">
          <h1 className="card-title">
            <SaveIcon className="size-5 text-primary" />
            Edit Product
          </h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(formData); // ✅ Now includes categoryIds
            }}
            className="space-y-4 mt-4"
          >
            <label className="input input-bordered flex items-center gap-2 bg-base-200">
              <TypeIcon className="size-4 text-base-content/50" />
              <input
                type="text"
                placeholder="Product title"
                className="grow"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </label>

            {/* PRICE */}
            <label className="input input-bordered flex items-center gap-2 bg-base-200">
              <DollarSignIcon className="size-4 text-base-content/50" />
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="19.99"
                className="grow"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: e.target.value === "" ? "" : Number(e.target.value),
                  })
                }
                required
              />
            </label>

            {/* CATEGORIES */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-base-content/70">
                Categories
              </p>

              {isLoading ? (
                <p className="text-sm text-base-content/50">
                  Loading categories…
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {/* ✅ Always show all dashboard categories */}
                  {dashboardData?.categories?.map((category) => {
                    const isSelected = formData.categoryIds.includes(
                      category.id,
                    );

                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => toggleCategory(category.id)}
                        className={`
                          px-3 py-1 rounded-full text-sm capitalize border
                          transition-all
                          ${
                            isSelected
                              ? "bg-primary text-primary-content border-primary"
                              : "bg-base-200 border-base-300 hover:bg-base-300"
                          }
                        `}
                      >
                        {category.name}
                      </button>
                    );
                  })}
                </div>
              )}

              <p className="text-xs text-base-content/50">
                {formData.categoryIds.length} selected
              </p>
            </div>

            {/* STATUS */}
            <label className="input input-bordered flex items-center gap-2 bg-base-200">
              <span className="text-sm text-base-content/60">Status</span>
              <select
                className="grow bg-transparent"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as ProductFormState["status"],
                  })
                }
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </label>

            <label className="input input-bordered flex items-center gap-2 bg-base-200">
              <ImageIcon className="size-4 text-base-content/50" />
              <input
                type="url"
                placeholder="Image URL"
                className="grow"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                required
              />
            </label>

            {formData.imageUrl && (
              <div className="rounded-box overflow-hidden">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-40 object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            )}

            <div className="form-control">
              <div className="flex items-start gap-2 p-3 rounded-box bg-base-200 border border-base-300">
                <FileTextIcon className="size-4 text-base-content/50 mt-1" />
                <textarea
                  placeholder="Description"
                  className="grow bg-transparent resize-none focus:outline-none min-h-24"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {isError && (
              <div role="alert" className="alert alert-error alert-sm">
                <span>{error?.message || "Failed to update product"}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isPending}
            >
              {isPending ? (
                <span className="loading loading-spinner" />
              ) : (
                "Save Changes"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default EditProductForm;
