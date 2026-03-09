"use client";

import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MonthSelectorProps {
  currentMonth: string;
  onMonthChange: (month: string) => void;
}

function parseMonth(month: string): { year: number; month: number } {
  const [y, m] = month.split("-").map(Number);
  return { year: y, month: m };
}

function formatMonth(month: string): string {
  const { year, month: m } = parseMonth(month);
  const date = new Date(year, m - 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function shiftMonth(month: string, delta: number): string {
  const { year, month: m } = parseMonth(month);
  const date = new Date(year, m - 1 + delta);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function MonthSelector({ currentMonth, onMonthChange }: MonthSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => onMonthChange(shiftMonth(currentMonth, -1))}
        aria-label="Previous month"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="flex items-center gap-2 rounded-lg bg-accent px-3 py-1.5 min-w-[170px] justify-center">
        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">{formatMonth(currentMonth)}</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => onMonthChange(shiftMonth(currentMonth, 1))}
        aria-label="Next month"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
