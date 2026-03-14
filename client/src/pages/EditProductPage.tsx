import { useNavigate, useParams, Link } from "react-router";
import { useProduct, useUpdateProduct } from "../hooks/useProducts";
import LoadingSpinner from "../components/LoadingSpinner";
import EditProductForm from "../components/EditProductForm";

function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: product, isLoading } = useProduct(id!);
  const updateProduct = useUpdateProduct();

  if (isLoading) return <LoadingSpinner />;

  if (!product || !id) {
    return (
      <div className="card bg-base-300 max-w-md mx-auto">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-error">
            {!product ? "Not found" : "Access denied"}
          </h2>
          <Link to="/" className="btn btn-primary btn-sm">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <EditProductForm
      product={product}
      isPending={updateProduct.isPending}
      isError={updateProduct.isError}
      error={updateProduct.error}
      onSubmit={(formData: {
        title: string;
        description: string;
        imageUrl: string;
      }) => {
        updateProduct.mutate(
          { productId: id, productData: formData },
          {
            onSuccess: () => navigate(`/product/${id}`),
          },
        );
      }}
    />
  );
}

export default EditProductPage;
