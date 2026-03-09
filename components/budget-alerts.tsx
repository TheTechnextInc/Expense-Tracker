"use client";

import { AlertTriangle, TrendingUp, X } from "lucide-react";
import { useState } from "react";
import {
  useStore,
  getBudgetsForMonth,
  getTotalSpentByCategory,
  CATEGORIES,
  type Category,
} from "@/lib/store";

export function BudgetAlerts() {
  const { currentMonth } = useStore();
  const budgets = getBudgetsForMonth(currentMonth);
  const spent = getTotalSpentByCategory(currentMonth);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const alerts: {
    id: string;
    category: Category;
    percent: number;
    spent: number;
    limit: number;
    type: "over" | "warning";
  }[] = [];

  for (const budget of budgets) {
    const categorySpent = spent[budget.category] || 0;
    const percent = budget.limit > 0 ? (categorySpent / budget.limit) * 100 : 0;
    if (percent >= 80 && !dismissed.has(budget.id)) {
      alerts.push({
        id: budget.id,
        category: budget.category,
        percent,
        spent: categorySpent,
        limit: budget.limit,
        type: percent >= 100 ? "over" : "warning",
      });
    }
  }

  if (alerts.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm ${
            alert.type === "over"
              ? "border-destructive/30 bg-destructive/5"
              : "border-warning/30 bg-warning/5"
          }`}
          role="alert"
        >
          {alert.type === "over" ? (
            <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
          ) : (
            <TrendingUp className="h-4 w-4 shrink-0 text-warning" />
          )}
          <span className="flex-1 text-foreground">
            <span className="font-medium">
              {CATEGORIES[alert.category].label}
            </span>{" "}
            {alert.type === "over" ? (
              <>
                is <span className="font-semibold text-destructive">over budget</span> at{" "}
                {alert.percent.toFixed(0)}%
              </>
            ) : (
              <>
                is at <span className="font-semibold text-warning">{alert.percent.toFixed(0)}%</span> of
                budget
              </>
            )}
            {" "}
            <span className="text-muted-foreground">
              (${alert.spent.toFixed(0)} / ${alert.limit.toFixed(0)})
            </span>
          </span>
          <button
            onClick={() => setDismissed((prev) => new Set(prev).add(alert.id))}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss alert"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
