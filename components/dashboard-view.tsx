"use client";

import { format } from "date-fns";
import {
  Home,
  UtensilsCrossed,
  Car,
  Gamepad2,
  ShoppingBag,
  Heart,
  Zap,
  GraduationCap,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatCards } from "@/components/stat-cards";
import { BudgetAlerts } from "@/components/budget-alerts";
import { SpendingChart } from "@/components/spending-chart";
import {
  useStore,
  getExpensesForMonth,
  getBudgetsForMonth,
  getTotalSpentByCategory,
  CATEGORIES,
  type Category,
} from "@/lib/store";

const ICON_MAP: Record<string, React.ElementType> = {
  Home,
  UtensilsCrossed,
  Car,
  Gamepad2,
  ShoppingBag,
  Heart,
  Zap,
  GraduationCap,
  MoreHorizontal,
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function DashboardView() {
  const { currentMonth } = useStore();
  const expenses = getExpensesForMonth(currentMonth);
  const budgets = getBudgetsForMonth(currentMonth);
  const spent = getTotalSpentByCategory(currentMonth);
  const recentExpenses = expenses.slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <BudgetAlerts />
      <StatCards />

      <div className="grid gap-6 lg:grid-cols-2">
        <SpendingChart />

        {/* Recent Transactions */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {recentExpenses.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No transactions yet this month
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {recentExpenses.map((expense) => {
                  const catMeta = CATEGORIES[expense.category];
                  const IconComp = ICON_MAP[catMeta.icon] || MoreHorizontal;
                  return (
                    <div key={expense.id} className="flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                        style={{
                          backgroundColor: `${catMeta.color}20`,
                          color: catMeta.color,
                        }}
                      >
                        <IconComp className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex flex-1 flex-col min-w-0">
                        <span className="text-sm text-foreground truncate">
                          {expense.description}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {format(new Date(expense.date), "MMM d")}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-foreground font-mono tabular-nums">
                        -{formatCurrency(expense.amount)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Budget Overview */}
      {budgets.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Budget Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {budgets.map((budget) => {
                const catMeta = CATEGORIES[budget.category];
                const categorySpent = spent[budget.category] || 0;
                const percent = budget.limit > 0
                  ? Math.min((categorySpent / budget.limit) * 100, 100)
                  : 0;
                const isOver = categorySpent > budget.limit;
                const isNear = percent >= 80 && !isOver;

                return (
                  <div key={budget.id} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{catMeta.label}</span>
                      <span className="text-xs font-medium text-foreground font-mono">
                        {percent.toFixed(0)}%
                      </span>
                    </div>
                    <Progress
                      value={percent}
                      className={`h-1.5 ${
                        isOver
                          ? "[&>[data-slot=progress-indicator]]:bg-destructive"
                          : isNear
                            ? "[&>[data-slot=progress-indicator]]:bg-warning"
                            : "[&>[data-slot=progress-indicator]]:bg-primary"
                      }`}
                    />
                    <span className="text-[10px] text-muted-foreground">
                      ${categorySpent.toFixed(0)} / ${budget.limit.toFixed(0)}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
