import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { type ChartConfig } from "@/components/ui/chart";

function TotalRevenueBarChart() {
  const chartData = [
    { month: "January", revenue: 186, cost: 80 },
    { month: "February", revenue: 305, cost: 200 },
    { month: "March", revenue: 237, cost: 120 },
    { month: "April", revenue: 73, cost: 190 },
    { month: "May", revenue: 209, cost: 130 },
    { month: "June", revenue: 214, cost: 140 },
  ];
  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "#2563eb",
    },
    cost: {
      label: "Cost",
      color: "#60a5fa",
    },
  } satisfies ChartConfig;
  return (
    <ChartContainer config={chartConfig} className="min-h-40 w-full">
      <BarChart accessibilityLayer data={chartData}>
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis tickLine={false} tickMargin={10} axisLine={false} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
        <Bar dataKey="cost" fill="var(--color-cost)" radius={4} />{" "}
        <ChartTooltip content={<ChartTooltipContent />} />
      </BarChart>
    </ChartContainer>
  );
}

export default TotalRevenueBarChart;
