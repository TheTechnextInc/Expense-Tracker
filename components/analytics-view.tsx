"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useStore,
  getExpensesForMonth,
  getTotalSpentByCategory,
  getTotalSpent,
  getTotalBudget,
  getBudgetsForMonth,
  CATEGORIES,
  type Category,
} from "@/lib/store";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}

interface CustomBarTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: { name: string; spent: number; budget: number };
  }>;
}

function CustomBarTooltip({ active, payload }: CustomBarTooltipProps) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
      <p className="text-sm font-medium text-foreground">{data.name}</p>
      <p className="text-xs text-primary">Spent: {formatCurrency(data.spent)}</p>
      {data.budget > 0 && (
        <p className="text-xs text-muted-foreground">Budget: {formatCurrency(data.budget)}</p>
      )}
    </div>
  );
}

interface CustomAreaTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: { date: string; amount: number; cumulative: number };
  }>;
  label?: string;
}

function CustomAreaTooltip({ active, payload }: CustomAreaTooltipProps) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
      <p className="text-sm font-medium text-foreground">{data.date}</p>
      <p className="text-xs text-primary">Daily: {formatCurrency(data.amount)}</p>
      <p className="text-xs text-muted-foreground">Cumulative: {formatCurrency(data.cumulative)}</p>
    </div>
  );
}

function MonthlyTrendTooltip({ active, payload }: CustomAreaTooltipProps) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
      <p className="text-sm font-medium text-foreground">{data.date}</p>
      <p className="text-xs text-primary">Total: {formatCurrency(data.amount)}</p>
    </div>
  );
}

export function AnalyticsView() {
  const { currentMonth } = useStore();
  const expenses = getExpensesForMonth(currentMonth);
  const spent = getTotalSpentByCategory(currentMonth);
  const budgets = getBudgetsForMonth(currentMonth);

  // Category comparison data
  const categoryData = (Object.keys(CATEGORIES) as Category[])
    .map((cat) => {
      const budget = budgets.find((b) => b.category === cat);
      return {
        name: CATEGORIES[cat].label,
        spent: spent[cat] || 0,
        budget: budget?.limit || 0,
        color: CATEGORIES[cat].color,
      };
    })
    .filter((d) => d.spent > 0 || d.budget > 0)
    .sort((a, b) => b.spent - a.spent);

  // Daily spending data
  const [y, m] = currentMonth.split("-").map(Number);
  const daysInMonth = new Date(y, m, 0).getDate();
  const dailyMap = new Map<number, number>();
  for (const exp of expenses) {
    const day = new Date(exp.date).getDate();
    dailyMap.set(day, (dailyMap.get(day) || 0) + exp.amount);
  }
  let cumulative = 0;
  const dailyData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const amount = dailyMap.get(day) || 0;
    cumulative += amount;
    return {
      date: `${m}/${day}`,
      amount,
      cumulative,
    };
  });

  // Monthly trend (last 6 months)
  const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(y, m - 1 - (5 - i));
    const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    return {
      date: d.toLocaleDateString("en-US", { month: "short" }),
      amount: getTotalSpent(monthStr),
      budget: getTotalBudget(monthStr),
    };
  });

  // Top spending categories
  const topCategories = (Object.keys(CATEGORIES) as Category[])
    .map((cat) => ({
      category: cat,
      amount: spent[cat] || 0,
      label: CATEGORIES[cat].label,
      color: CATEGORIES[cat].color,
    }))
    .filter((d) => d.amount > 0)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const totalSpent = topCategories.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Analytics</h2>
        <p className="text-sm text-muted-foreground">
          Visualize your spending patterns and trends
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="daily">Daily Spending</TabsTrigger>
          <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Category Comparison Bar Chart */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Budget vs Actual by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                {categoryData.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-sm text-muted-foreground">
                      No data to display
                    </p>
                  </div>
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryData} layout="vertical">
                        <CartesianGrid
                          strokeDasharray="3 3"
                          horizontal={false}
                          stroke="oklch(0.28 0.01 260)"
                        />
                        <XAxis
                          type="number"
                          tickFormatter={(v) => `$${v}`}
                          tick={{ fill: "oklch(0.65 0.01 260)", fontSize: 11 }}
                          axisLine={{ stroke: "oklch(0.28 0.01 260)" }}
                        />
                        <YAxis
                          dataKey="name"
                          type="category"
                          width={100}
                          tick={{ fill: "oklch(0.65 0.01 260)", fontSize: 11 }}
                          axisLine={{ stroke: "oklch(0.28 0.01 260)" }}
                        />
                        <Tooltip content={<CustomBarTooltip />} />
                        <Bar
                          dataKey="budget"
                          fill="oklch(0.28 0.01 260)"
                          radius={[0, 4, 4, 0]}
                          barSize={14}
                        />
                        <Bar
                          dataKey="spent"
                          fill="oklch(0.72 0.19 155)"
                          radius={[0, 4, 4, 0]}
                          barSize={14}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Spending */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Top Spending Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  {topCategories.map((item) => {
                    const percent = totalSpent > 0 ? (item.amount / totalSpent) * 100 : 0;
                    return (
                      <div key={item.category} className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm text-foreground">{item.label}</span>
                          </div>
                          <span className="text-sm font-medium text-foreground font-mono">
                            {formatCurrency(item.amount)}
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-accent overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${percent}%`,
                              backgroundColor: item.color,
                            }}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          {percent.toFixed(1)}% of total spending
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="daily" className="mt-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Cumulative Daily Spending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyData}>
                    <defs>
                      <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.72 0.19 155)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="oklch(0.72 0.19 155)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="oklch(0.28 0.01 260)"
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "oklch(0.65 0.01 260)", fontSize: 10 }}
                      axisLine={{ stroke: "oklch(0.28 0.01 260)" }}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tickFormatter={(v) => `$${v}`}
                      tick={{ fill: "oklch(0.65 0.01 260)", fontSize: 11 }}
                      axisLine={{ stroke: "oklch(0.28 0.01 260)" }}
                    />
                    <Tooltip content={<CustomAreaTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="cumulative"
                      stroke="oklch(0.72 0.19 155)"
                      fill="url(#colorCumulative)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="mt-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Monthly Spending Trend (Last 6 Months)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyTrend}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="oklch(0.28 0.01 260)"
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "oklch(0.65 0.01 260)", fontSize: 11 }}
                      axisLine={{ stroke: "oklch(0.28 0.01 260)" }}
                    />
                    <YAxis
                      tickFormatter={(v) => `$${v}`}
                      tick={{ fill: "oklch(0.65 0.01 260)", fontSize: 11 }}
                      axisLine={{ stroke: "oklch(0.28 0.01 260)" }}
                    />
                    <Tooltip content={<MonthlyTrendTooltip />} />
                    <Bar
                      dataKey="amount"
                      fill="oklch(0.72 0.19 155)"
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
