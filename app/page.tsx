"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { MonthSelector } from "@/components/month-selector";
import { DashboardView } from "@/components/dashboard-view";
import { ExpenseList } from "@/components/expense-list";
import { BudgetManager } from "@/components/budget-manager";
import { AnalyticsView } from "@/components/analytics-view";
import { useStore, setCurrentMonth } from "@/lib/store";

type View = "dashboard" | "expenses" | "budgets" | "analytics";

const VIEW_TITLES: Record<View, { title: string; description: string }> = {
  dashboard: {
    title: "Dashboard",
    description: "Your financial overview at a glance",
  },
  expenses: {
    title: "Expenses",
    description: "Manage and track your spending",
  },
  budgets: {
    title: "Budgets",
    description: "Set and monitor your budget goals",
  },
  analytics: {
    title: "Analytics",
    description: "Insights into your spending patterns",
  },
};

export default function HomePage() {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const { currentMonth } = useStore();

  return (
    <AppShell currentView={currentView} onViewChange={setCurrentView}>
      {/* Page Header */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight text-balance">
            {VIEW_TITLES[currentView].title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {VIEW_TITLES[currentView].description}
          </p>
        </div>
        <MonthSelector
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
        />
      </div>

      {/* View Content */}
      {currentView === "dashboard" && <DashboardView />}
      {currentView === "expenses" && <ExpenseList />}
      {currentView === "budgets" && <BudgetManager />}
      {currentView === "analytics" && <AnalyticsView />}
    </AppShell>
  );
}
