import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/ProductCard";
import ProductPagination from "@/components/ProductPagination";
import { useFilterStore } from "@/store/filter-store";
import { PackageIcon } from "lucide-react";
import { Link } from "react-router";
import ProductSkeleton from "@/components/ProuductSkeleton";

function ProductsPage() {
  const { filters, setFilters } = useFilterStore();
  const { data, isLoading } = useProducts();
  const totalPages = data?.totalPages ?? 1;
  return (
    <div className="">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
        <PackageIcon className="size-5 text-primary" />
        All Products
      </h2>

      {/* PAGINATION CONTROLS */}
      {!isLoading && (
        <ProductPagination
          currentPage={filters.page}
          setCurrentPage={setFilters}
          totalPages={totalPages}
        />
      )}

      {/* The Grid Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Show a nice batch of 8 skeletons to fill the screen
          Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
        ) : data?.products?.length === 0 ? (
          // Empty State
          <div className="col-span-full flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl bg-muted/50">
            <PackageIcon className="size-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">No products found</h3>
            <p className="text-muted-foreground mb-6">
              Start by adding a new item to the store.
            </p>
            <Link to="/create" className="btn btn-primary">
              Create Product
            </Link>
          </div>
        ) : (
          // Success State
          data?.products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
}

export default ProductsPage;
