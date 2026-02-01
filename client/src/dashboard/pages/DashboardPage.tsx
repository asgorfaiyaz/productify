import { Home, Globe, Lock, DollarSign, Package } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useMyProducts } from "../../hooks/useProducts";
import { Link } from "react-router";
import { formatCurrency } from "../../lib/formatter";
import DashboardCard from "../components/DashboardCard";

function DashboardPage() {
  const { data: products, isLoading, error } = useMyProducts();

  const totalProducts = products?.length || 0;
  const publicProducts =
    products?.filter((p) => p.status === "public").length || 0;
  const privateProducts =
    products?.filter((p) => p.status === "private").length || 0;
  const totalValue = products?.reduce((sum, p) => sum + p.priceInCents, 0) || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-base-content/60">
            Overview of your products and activity
          </p>
        </div>

        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <Home className="size-4" />
          Back to Home
        </Link>
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="alert alert-error">
          Failed to load products. Please retry.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Products */}
          <div className="stat bg-base-300 rounded-xl shadow">
            <div className="stat-figure text-primary">
              <Package className="size-6" />
            </div>
            <div className="stat-title">Total Products</div>
            <div className="stat-value text-primary">{totalProducts}</div>
          </div>

          {/* Public */}
          <div className="stat bg-base-300 rounded-xl shadow">
            <div className="stat-figure text-success">
              <Globe className="size-6" />
            </div>
            <div className="stat-title">Public Products</div>
            <div className="stat-value text-success">{publicProducts}</div>
          </div>

          {/* Private */}
          <div className="stat bg-base-300 rounded-xl shadow">
            <div className="stat-figure text-warning">
              <Lock className="size-6" />
            </div>
            <div className="stat-title">Private Products</div>
            <div className="stat-value text-warning">{privateProducts}</div>
          </div>

          {/* Total Value */}
          <div className="stat bg-base-300 rounded-xl shadow">
            <div className="stat-figure text-primary">
              <DollarSign className="size-6" />
            </div>
            <div className="stat-title">Total Value</div>
            <div className="stat-value text-primary">
              {formatCurrency(totalValue / 100)}
            </div>
          </div>
        </div>
      )}

      <DashboardCard
        title="Total sales"
        description="5 orders"
        content="1580$"
      />
      <DashboardCard
        title="Total Customers"
        description="100 avg value"
        content="5"
      />
      <DashboardCard
        title="Products Activity"
        description="5 products public"
        content="5 products private"
      />
    </div>
  );
}

export default DashboardPage;
