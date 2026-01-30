import { DollarSign, TrendingUp, BarChart2 } from "lucide-react";

function DashboardSales() {
  // Placeholder data
  const totalRevenue = 12500; // in cents
  const monthlyGrowth = 12; // %
  const orders = 34;

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center py-12 px-4 space-y-4">
        {/* Header */}
        <h2 className="text-3xl font-extrabold tracking-tight text-center text-base-content">
          Sales Overview
        </h2>

        {/* Subheading / Coming Soon */}
        <h1 className="text-xl font-semibold text-center text-primary">
          Coming Soon 🚀
        </h1>

        {/* Description */}
        <p className="text-center text-base-content/60 max-w-md">
          Currently displaying placeholder data. Real sales metrics will appear
          here in a few days. Stay tuned!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Revenue */}
        <div className="stat bg-base-300 rounded-xl shadow p-4">
          <div className="stat-figure text-primary">
            <DollarSign className="size-6" />
          </div>
          <div className="stat-title">Total Revenue</div>
          <div className="stat-value text-primary">
            ${(totalRevenue / 100).toLocaleString()}
          </div>
          <div className="stat-desc text-base-content/60">All time</div>
        </div>

        {/* Monthly Growth */}
        <div className="stat bg-base-300 rounded-xl shadow p-4">
          <div className="stat-figure text-success">
            <TrendingUp className="size-6" />
          </div>
          <div className="stat-title">Monthly Growth</div>
          <div className="stat-value text-success">{monthlyGrowth}%</div>
          <div className="stat-desc text-base-content/60">
            Compared to last month
          </div>
        </div>

        {/* Total Orders */}
        <div className="stat bg-base-300 rounded-xl shadow p-4">
          <div className="stat-figure text-warning">
            <BarChart2 className="size-6" />
          </div>
          <div className="stat-title">Orders</div>
          <div className="stat-value text-warning">{orders}</div>
          <div className="stat-desc text-base-content/60">Completed orders</div>
        </div>
      </div>
    </div>
  );
}

export default DashboardSales;
