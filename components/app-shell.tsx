"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Receipt,
  Target,
  BarChart3,
  Wallet,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type View = "dashboard" | "expenses" | "budgets" | "analytics";

interface AppShellProps {
  currentView: View;
  onViewChange: (view: View) => void;
  children: React.ReactNode;
}

const NAV_ITEMS: { view: View; label: string; icon: React.ElementType }[] = [
  { view: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { view: "expenses", label: "Expenses", icon: Receipt },
  { view: "budgets", label: "Budgets", icon: Target },
  { view: "analytics", label: "Analytics", icon: BarChart3 },
];

export function AppShell({ currentView, onViewChange, children }: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card">
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-border">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Wallet className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-foreground tracking-tight">SpendWise</h1>
            <p className="text-xs text-muted-foreground">Budget Manager</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1 p-3 flex-1" role="navigation" aria-label="Main navigation">
          {NAV_ITEMS.map(({ view, label, icon: Icon }) => (
            <button
              key={view}
              onClick={() => onViewChange(view)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                currentView === view
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
              aria-current={currentView === view ? "page" : undefined}
            >
              <Icon className="h-4.5 w-4.5" />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <div className="rounded-lg bg-accent/50 p-3">
            <p className="text-xs font-medium text-foreground">Pro Tip</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Set budgets for each category to get alerts when you're close to your limit.
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="flex flex-1 flex-col">
        <header className="md:hidden flex items-center justify-between border-b border-border bg-card px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Wallet className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">SpendWise</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </header>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute inset-0 z-50 bg-background/95 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Wallet className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-sm font-semibold text-foreground">SpendWise</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex flex-col gap-1 p-4" role="navigation" aria-label="Mobile navigation">
              {NAV_ITEMS.map(({ view, label, icon: Icon }) => (
                <button
                  key={view}
                  onClick={() => {
                    onViewChange(view);
                    setMobileMenuOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    currentView === view
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
