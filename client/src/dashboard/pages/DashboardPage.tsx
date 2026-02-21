import { Globe, Lock, DollarSign, Package } from "lucide-react";
import { useMyProducts } from "../../hooks/useProducts";
import TotalRevenueBarChart from "../charts/TotalRevenueBarChart";
import OrdersByDayChart from "../charts/OrdersByDayChart";
import StatCardSkeleton from "../components/StatCardSkeleton";
// import { formatCurrency } from "../../lib/formatter";
// import { useSalesDataByUser } from "@/hooks/usePurchases";

function DashboardPage() {
  const { data: products, error, isLoading } = useMyProducts();
  // const { data: salesInfo, isLoading } = useSalesDataByUser();

  const totalProducts = products?.length || 0;
  const publicProducts =
    products?.filter((p) => p.status === "public").length || 0;
  const privateProducts =
    products?.filter((p) => p.status === "private").length || 0;

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm text-base-content/60">
              Overview of your products and activity
            </p>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
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
            {/* Total Sales */}
            <div className="stat bg-base-300 rounded-xl shadow">
              <div className="stat-figure text-primary">
                <Package className="size-6" />
              </div>
              <div className="stat-title">Total Sales</div>
              <div className="stat-value text-primary">
                {/* {salesInfo?.totalSales} */} 0
              </div>
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
              <div className="stat-title">Total Revenu</div>
              <div className="stat-value text-primary">
                {/* {salesInfo?.totalSalesAmount
                ? formatCurrency(salesInfo?.totalSalesAmount / 100)
                : 0}{" "} */}
                0
              </div>
            </div>

            {/* Avg Products */}
            <div className="stat bg-base-300 rounded-xl shadow">
              <div className="stat-figure text-primary">
                <Package className="size-6" />
              </div>
              <div className="stat-title">Avg Sale</div>
              <div className="stat-value text-primary">
                {/* {salesInfo?.averageSaleValue
                ? formatCurrency(salesInfo?.averageSaleValue / 100)
                : 0} */}
                0
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-5">
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-3">
          <div className="bg-primary-foreground p-4 rounded-lg 2xl:col-span-2">
            <TotalRevenueBarChart />
          </div>
          <div className="bg-primary-foreground p-4 rounded-lg h-full">
            <OrdersByDayChart />
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardPage;
