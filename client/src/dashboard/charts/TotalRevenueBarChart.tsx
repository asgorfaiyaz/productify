import { useState } from "react";
import { format } from "date-fns";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon } from "lucide-react";
import { useDashboardSalesByDate } from "@/hooks/useDashboards";
import type { SalesByDateParams } from "@/api/dashboards";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Types & config ───────────────────────────────────────────────────────────

const chartConfig = {
  totalOrders: {
    label: "Orders",
    color: "hsl(var(--chart-5))",
  },
};

type PresetOption = { label: string; apiValue: string };

const PRESETS: PresetOption[] = [
  { label: "Today", apiValue: "today" },
  { label: "Yesterday", apiValue: "yesterday" },
  { label: "7 days", apiValue: "7days" },
  { label: "30 days", apiValue: "30days" },
  { label: "This month", apiValue: "this_month" },
  { label: "Last month", apiValue: "last_month" },
];

// shadcn Calendar uses its own internal type for range — we only need from/to
// type SimpleRange = { from: Date; to: Date } | undefined;

// ─── Component ────────────────────────────────────────────────────────────────

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ChartSkeleton() {
  return (
    <div className="space-y-3">
      {/* Y-axis + bars */}
      <div className="flex h-48 items-end gap-2 sm:h-64">
        {/* Y-axis labels */}
        <div className="flex h-full flex-col justify-between pb-5">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-3 w-6" />
          ))}
        </div>
        {/* Bars — varying heights to look natural */}
        {[60, 80, 45, 90, 55, 70, 40].map((h, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-sm"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      {/* X-axis labels */}
      <div className="flex gap-2 pl-8">
        {[...Array(7)].map((_, i) => (
          <Skeleton key={i} className="h-3 flex-1" />
        ))}
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TotalRevenueBarChart() {
  const [active, setActive] = useState<PresetOption>(PRESETS[2]);
  const [apiParams, setApiParams] = useState<SalesByDateParams>({
    preset: PRESETS[2].apiValue,
  });
  const [calRange, setCalRange] = useState<{ from?: Date; to?: Date }>({});
  const [calOpen, setCalOpen] = useState(false);

  const { data = [], isLoading, isError } = useDashboardSalesByDate(apiParams);

  function applyPreset(p: PresetOption) {
    setActive(p);
    setApiParams({ preset: p.apiValue });
  }

  function applyCustomRange() {
    if (!calRange.from || !calRange.to) return;
    setApiParams({
      from: format(calRange.from, "yyyy-MM-dd"),
      to: format(calRange.to, "yyyy-MM-dd"),
    });
    setActive({
      label: `${format(calRange.from, "MMM d")} – ${format(calRange.to, "MMM d")}`,
      apiValue: "custom",
    });
    setCalOpen(false);
  }

  return (
    <Card className="w-full min-w-0 border-none">
      <CardHeader className="space-y-3 pb-3">
        {/* Row 1: title + custom range button */}
        <div className="flex min-w-0 items-start justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="text-base sm:text-lg">
              Orders by Date
            </CardTitle>
            <CardDescription className="truncate">
              {active.label}
            </CardDescription>
          </div>

          <Popover open={calOpen} onOpenChange={setCalOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="shrink-0 gap-1.5">
                <CalendarIcon className="h-3.5 w-3.5" />
                Custom
              </Button>
            </PopoverTrigger>

            <PopoverContent
              align="end"
              className="w-auto max-w-[calc(100vw-2rem)] p-3"
            >
              <div className="sm:hidden">
                <Calendar
                  mode="range"
                  selected={calRange as any}
                  onSelect={(r) => setCalRange(r ?? {})}
                  numberOfMonths={1}
                  disabled={{ after: new Date() }}
                />
              </div>
              <div className="hidden sm:block">
                <Calendar
                  mode="range"
                  selected={calRange as any}
                  onSelect={(r) => setCalRange(r ?? {})}
                  numberOfMonths={2}
                  disabled={{ after: new Date() }}
                />
              </div>

              <Separator className="my-2" />

              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">
                  {calRange.from && calRange.to
                    ? `${format(calRange.from, "MMM d")} → ${format(calRange.to, "MMM d, yyyy")}`
                    : "Pick a start & end date"}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    disabled={!calRange.from || !calRange.to}
                    onClick={applyCustomRange}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Row 2: preset buttons */}
        <div className="flex flex-wrap gap-1">
          {PRESETS.map((p) => (
            <Button
              key={p.apiValue}
              size="sm"
              variant={active.apiValue === p.apiValue ? "default" : "outline"}
              className="h-7 px-2.5 text-xs"
              onClick={() => applyPreset(p)}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pl-2 pr-4">
        {isError ? (
          <p className="py-16 text-center text-sm text-destructive">
            Failed to load data.
          </p>
        ) : isLoading ? (
          <ChartSkeleton />
        ) : data.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No orders found for this period.
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="h-48 w-full sm:h-64">
            <BarChart
              data={data}
              margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10 }}
                tickFormatter={(v) =>
                  data.length <= 14
                    ? format(new Date(v), "MMM d")
                    : format(new Date(v), "M/d")
                }
                interval={data.length > 14 ? Math.ceil(data.length / 7) : 0}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10 }}
                width={28}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(v) =>
                      format(new Date(v), "EEEE, MMM d yyyy")
                    }
                  />
                }
              />
              <Bar
                dataKey="totalOrders"
                fill="var(--color-chart-4)"
                radius={[4, 4, 0, 0]}
                maxBarSize={80}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
