import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
const data = [
  {
    name: "Day 1",
    sales: 400,
    sales_amt: 100,
  },
  {
    name: "Day 2",
    sales: 300,
    sales_amt: 50,
  },
  {
    name: "Day 3",
    sales: 320,
    sales_amt: 100,
  },
  {
    name: "Day 4",
    sales: 200,
    sales_amt: 400,
  },
  {
    name: "Day 5",
    sales: 278,
    sales_amt: 560,
  },
  {
    name: "Day 6",
    sales: 189,
    sales_amt: 600,
  },
];
const chartConfig = {};
function OrdersByDayChart() {
  return (
    <Card className="w-full h-full ">
      <CardHeader>Orders by Day Chart</CardHeader>
      <CardContent className=" p-0">
        <ResponsiveContainer width="100%" height="100%">
          <ChartContainer config={chartConfig} className="w-full h-48 sm:h-84">
            <LineChart
              margin={{ top: 4, right: 16, left: -16, bottom: 0 }}
              data={data}
              className="w-full"
            >
              <CartesianGrid />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                stroke="var(--color-chart-4)"
                dataKey="sales"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                stroke="var(--color-chart-1)"
                dataKey="sales_amt"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default OrdersByDayChart;
