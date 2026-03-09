"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useStore,
  getTotalSpentByCategory,
  CATEGORIES,
  type Category,
} from "@/lib/store";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: { name: string; value: number; color: string; percent: number };
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
      <p className="text-sm font-medium text-foreground">{data.name}</p>
      <p className="text-xs text-muted-foreground">
        {formatCurrency(data.value)} ({data.percent.toFixed(1)}%)
      </p>
    </div>
  );
}

export function SpendingChart() {
  const { currentMonth } = useStore();
  const spent = getTotalSpentByCategory(currentMonth);

  const data = (Object.keys(CATEGORIES) as Category[])
    .map((cat) => ({
      name: CATEGORIES[cat].label,
      value: spent[cat] || 0,
      color: CATEGORIES[cat].color,
    }))
    .filter((d) => d.value > 0);

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const dataWithPercent = data.map((d) => ({
    ...d,
    percent: total > 0 ? (d.value / total) * 100 : 0,
  }));

  if (data.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Spending by Category</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-sm text-muted-foreground">No spending data for this month</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-6 lg:flex-row">
          <div className="h-[200px] w-[200px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataWithPercent}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {dataWithPercent.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 flex-1">
            {dataWithPercent
              .sort((a, b) => b.value - a.value)
              .map((item) => (
                <div key={item.name} className="flex items-center gap-2 py-1">
                  <div
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs text-muted-foreground truncate">
                      {item.name}
                    </span>
                    <span className="text-xs font-medium text-foreground font-mono">
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
