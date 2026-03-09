"use client";

import {
  TrendingDown,
  TrendingUp,
  Target,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  useStore,
  getTotalSpent,
  getTotalBudget,
  getExpensesForMonth,
} from "@/lib/store";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function StatCards() {
  const { currentMonth } = useStore();
  const totalSpent = getTotalSpent(currentMonth);
  const totalBudget = getTotalBudget(currentMonth);
  const remaining = totalBudget - totalSpent;
  const percentUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const expenses = getExpensesForMonth(currentMonth);

  // Compare to previous month
  const [y, m] = currentMonth.split("-").map(Number);
  const prevDate = new Date(y, m - 2);
  const prevMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`;
  const prevSpent = getTotalSpent(prevMonth);
  const changePercent =
    prevSpent > 0 ? ((totalSpent - prevSpent) / prevSpent) * 100 : 0;

  const isOverBudget = remaining < 0;
  const isNearLimit = percentUsed >= 80 && !isOverBudget;

  const stats = [
    {
      label: "Total Spent",
      value: formatCurrency(totalSpent),
      sub:
        changePercent !== 0
          ? `${changePercent > 0 ? "+" : ""}${changePercent.toFixed(1)}% vs last month`
          : "No previous data",
      icon: changePercent > 0 ? TrendingUp : TrendingDown,
      accent:
        changePercent > 0
          ? "text-destructive"
          : "text-success",
    },
    {
      label: "Total Budget",
      value: formatCurrency(totalBudget),
      sub: `${expenses.length} transactions`,
      icon: Target,
      accent: "text-primary",
    },
    {
      label: "Remaining",
      value: formatCurrency(Math.abs(remaining)),
      sub: isOverBudget
        ? "Over budget!"
        : `${percentUsed.toFixed(0)}% of budget used`,
      icon: isOverBudget || isNearLimit ? AlertTriangle : TrendingDown,
      accent: isOverBudget
        ? "text-destructive"
        : isNearLimit
          ? "text-warning"
          : "text-success",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-card border-border">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-2xl font-semibold tracking-tight text-foreground font-mono">
                  {stat.value}
                </p>
              </div>
              <div className={`rounded-lg bg-accent p-2 ${stat.accent}`}>
                <stat.icon className="h-4.5 w-4.5" />
              </div>
            </div>
            <p className={`mt-2 text-xs ${stat.accent}`}>{stat.sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
